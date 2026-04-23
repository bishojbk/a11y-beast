import puppeteer, { type Browser, type Page } from "puppeteer";
import { readFileSync } from "fs";
import { join } from "path";
import { validateUrl } from "./ssrf-guard";
import { runCustomChecks, type CustomIssue } from "@/lib/analyzer/custom-checks";

// Find axe-core in multiple ways (Next.js dev/build + CLI/npx/global install).
// Deferred until first scan so a missing axe-core doesn't crash at module import
// (e.g. on a cold serverless start where postinstall didn't run).
function loadAxeSource(): string {
  // Primary: process.cwd() (Next.js, running from project root)
  try {
    return readFileSync(join(process.cwd(), "node_modules", "axe-core", "axe.min.js"), "utf-8");
  } catch { /* not found via cwd */ }
  // Fallback: require.resolve (CLI installed globally or via npx)
  try {
    const { createRequire } = require("module");
    const req = createRequire(__filename);
    return readFileSync(req.resolve("axe-core/axe.min.js"), "utf-8");
  } catch { /* not found via require.resolve */ }
  throw new Error("Could not find axe-core/axe.min.js. Run: npm install axe-core");
}

let axeSourceCache: string | null = null;
function getAxeSource(): string {
  if (axeSourceCache === null) axeSourceCache = loadAxeSource();
  return axeSourceCache;
}

const IS_VERCEL = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

// Memoize the launch *promise* (not the resolved Browser) so concurrent
// callers in a TOCTOU race share one browser instead of leaking spares.
let browserPromise: Promise<Browser> | null = null;

async function getBrowser(): Promise<Browser> {
  if (browserPromise) {
    try {
      const b = await browserPromise;
      if (b.connected) return b;
    } catch { /* fall through to relaunch */ }
    browserPromise = null;
  }

  browserPromise = (async () => {
    if (IS_VERCEL) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const chromium = require("@sparticuz/chromium");
      return puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    }
    return puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
    });
  })();

  return browserPromise;
}

/** Close the shared browser instance. Call this when done scanning (e.g. CLI exit). */
export async function closeBrowser(): Promise<void> {
  if (!browserPromise) return;
  const p = browserPromise;
  browserPromise = null;
  try {
    const b = await p;
    if (b.connected) await b.close();
  } catch { /* ignore — already gone */ }
}

export interface PuppeteerScanResult {
  ok: boolean;
  error?: string;
  finalUrl?: string;
  fetchDurationMs: number;
  axeResults?: {
    violations: RawAxeResult[];
    passes: RawAxeResult[];
    incomplete: RawAxeResult[];
    inapplicable: RawAxeResult[];
  };
  customIssues?: CustomIssue[];
  pageMeta?: {
    title: string;
    lang: string;
    hasH1: boolean;
    hasSkipLink: boolean;
    hasAccessibilityStatement: boolean;
    imageCount: number;
    imagesWithoutAlt: number;
    linkCount: number;
    headingCount: number;
    formCount: number;
  };
}

interface RawAxeNode {
  html: string;
  target: string[];
  failureSummary?: string;
}

interface RawAxeResult {
  id: string;
  impact?: string;
  tags: string[];
  description: string;
  help: string;
  helpUrl: string;
  nodes: RawAxeNode[];
}

/**
 * Shared scanning logic — extracts metadata, runs axe-core, runs custom checks.
 * Called by both puppeteerScan (URL) and puppeteerScanHtml (HTML string).
 */
async function scanPage(page: Page): Promise<{
  pageMeta: PuppeteerScanResult["pageMeta"];
  axeResults: PuppeteerScanResult["axeResults"];
  customIssues: CustomIssue[];
}> {
  // Extract page metadata
  const pageMeta = await page.evaluate(() => {
    const imgs = document.querySelectorAll("img");
    const imgsNoAlt = Array.from(imgs).filter((img) => !img.hasAttribute("alt") || img.alt.trim() === "");
    return {
      title: document.title || "(no title)",
      lang: document.documentElement.lang || "(not set)",
      hasH1: !!document.querySelector("h1"),
      hasSkipLink: !!document.querySelector('a[href^="#main"], a[href^="#content"], a.skip-link, [class*="skip"]'),
      hasAccessibilityStatement: !!document.querySelector('a[href*="accessibility"], a[href*="a11y"]'),
      imageCount: imgs.length,
      imagesWithoutAlt: imgsNoAlt.length,
      linkCount: document.querySelectorAll("a[href]").length,
      headingCount: document.querySelectorAll("h1, h2, h3, h4, h5, h6").length,
      formCount: document.querySelectorAll("form").length,
    };
  });

  // Inject axe-core and run
  await page.evaluate(getAxeSource());

  const axeResults = await page.evaluate(() => {
    return new Promise<{
      violations: RawAxeResult[];
      passes: RawAxeResult[];
      incomplete: RawAxeResult[];
      inapplicable: RawAxeResult[];
    }>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).axe.run(document, {
        resultTypes: ["violations", "passes", "incomplete", "inapplicable"],
      }).then((r: { violations: any[]; passes: any[]; incomplete: any[]; inapplicable: any[] }) => {
        function mapNodes(nodes: any[]) {
          return nodes.map((n: any) => ({ html: n.html, target: n.target, failureSummary: n.failureSummary }));
        }
        function mapRule(v: any, includeNodes: boolean) {
          return { id: v.id, impact: v.impact, tags: v.tags, description: v.description, help: v.help, helpUrl: v.helpUrl, nodes: includeNodes ? mapNodes(v.nodes) : [] };
        }
        resolve({
          violations: r.violations.map((v: any) => mapRule(v, true)),
          passes: r.passes.map((v: any) => mapRule(v, false)),
          incomplete: r.incomplete.map((v: any) => mapRule(v, true)),
          inapplicable: r.inapplicable.map((v: any) => mapRule(v, false)),
        });
      }).catch(reject);
    });
  });

  // Run custom checks
  const customIssues: CustomIssue[] = await page.evaluate(runCustomChecks);

  return { pageMeta, axeResults, customIssues };
}

/** Scan a URL using Puppeteer (full browser rendering). */
export async function puppeteerScan(url: string): Promise<PuppeteerScanResult> {
  const start = Date.now();

  const validation = await validateUrl(url);
  if (!validation.safe || !validation.url) {
    return { ok: false, error: validation.reason ?? "Invalid URL", fetchDurationMs: Date.now() - start };
  }

  const b = await getBrowser();
  const page = await b.newPage();

  try {
    await page.setViewport({ width: 1280, height: 720 });
    await page.setBypassCSP(true);
    await page.goto(validation.url.toString(), { waitUntil: "networkidle2", timeout: 25000 });

    const { pageMeta, axeResults, customIssues } = await scanPage(page);

    return {
      ok: true,
      finalUrl: page.url(),
      fetchDurationMs: Date.now() - start,
      axeResults,
      pageMeta,
      customIssues,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Scan failed",
      fetchDurationMs: Date.now() - start,
    };
  } finally {
    await page.close();
  }
}

/** Scan raw HTML content using Puppeteer (loads via page.setContent). */
export async function puppeteerScanHtml(htmlContent: string, label?: string): Promise<PuppeteerScanResult> {
  const start = Date.now();

  const b = await getBrowser();
  const page = await b.newPage();

  try {
    await page.setViewport({ width: 1280, height: 720 });
    await page.setBypassCSP(true);
    await page.setContent(htmlContent, { waitUntil: "networkidle2", timeout: 25000 });

    const { pageMeta, axeResults, customIssues } = await scanPage(page);

    return {
      ok: true,
      finalUrl: label ?? "local-html",
      fetchDurationMs: Date.now() - start,
      axeResults,
      pageMeta,
      customIssues,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Scan failed",
      fetchDurationMs: Date.now() - start,
    };
  } finally {
    await page.close();
  }
}
