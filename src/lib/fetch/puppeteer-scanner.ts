import puppeteer, { type Browser } from "puppeteer";
import { readFileSync } from "fs";
import { join } from "path";
import { validateUrl } from "./ssrf-guard";
import { runCustomChecks, type CustomIssue } from "@/lib/analyzer/custom-checks";

// Read axe-core source once at module load
const axeSource = readFileSync(
  join(process.cwd(), "node_modules", "axe-core", "axe.min.js"),
  "utf-8"
);

const IS_VERCEL = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (browser?.connected) return browser;

  if (IS_VERCEL) {
    // On Vercel: use @sparticuz/chromium which bundles a Lambda-compatible Chromium
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const chromium = require("@sparticuz/chromium");
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  } else {
    // Local dev: use system Puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
    });
  }

  return browser;
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

export async function puppeteerScan(url: string): Promise<PuppeteerScanResult> {
  const start = Date.now();

  // SSRF validation
  const validation = validateUrl(url);
  if (!validation.safe || !validation.url) {
    return { ok: false, error: validation.reason ?? "Invalid URL", fetchDurationMs: Date.now() - start };
  }

  const b = await getBrowser();
  const page = await b.newPage();

  try {
    await page.setViewport({ width: 1280, height: 720 });
    await page.setBypassCSP(true);
    await page.goto(validation.url.toString(), { waitUntil: "networkidle2", timeout: 25000 });

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
    await page.evaluate(axeSource);

    const axeResults = await page.evaluate(() => {
      return new Promise<{
        violations: RawAxeResult[];
        passes: RawAxeResult[];
        incomplete: RawAxeResult[];
        inapplicable: RawAxeResult[];
      }>((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).axe.run(document, {
          // Run ALL rules — no filtering. This includes wcag2a, wcag2aa, wcag21a,
          // wcag21aa, wcag22aa, best-practice, and experimental rules.
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

    // Run custom checks that axe-core doesn't cover
    const customIssues: CustomIssue[] = await page.evaluate(runCustomChecks);

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
