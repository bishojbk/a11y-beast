import puppeteer from "puppeteer";
import type { BenchIssue, BenchRun, BenchSeverity } from "../types";

// Lighthouse emits an "a11y" audit map; each audit is pass/fail + a WCAG-linked
// description. We only surface failed ones (score < 1) and skip audits that
// are manual-only (scoreDisplayMode === "manual").
interface LhAudit {
  id: string;
  score: number | null;
  scoreDisplayMode: string;
  title: string;
  description: string;
  details?: { items?: Array<{ node?: { selector?: string } }> };
}

interface LhResult {
  lhr: {
    audits: Record<string, LhAudit>;
    categories: { accessibility?: { score: number | null } };
  };
}

type LighthouseFn = (url: string, opts: Record<string, unknown>) => Promise<LhResult>;

// Lighthouse has no per-impact severity, but its accessibility category is
// pass/fail. We tag failures as "major" by default.
const DEFAULT_SEVERITY: BenchSeverity = "major";

export async function runLighthouse(url: string, timeoutMs: number): Promise<BenchRun> {
  const started = Date.now();

  let lighthouse: LighthouseFn | null = null;
  try {
    // Lighthouse v10+ is ESM-only; use a runtime dynamic import through an
    // indirection so TS doesn't try to resolve it at build time (it's an
    // optional peer dep).
    const dynImport = new Function("specifier", "return import(specifier)") as (
      specifier: string
    ) => Promise<{ default?: LighthouseFn } & LighthouseFn>;
    const mod = await dynImport("lighthouse");
    lighthouse = (mod.default ?? (mod as unknown as LighthouseFn)) as LighthouseFn;
  } catch {
    return {
      tool: "lighthouse",
      url,
      ok: false,
      error: "lighthouse not installed — run `npm i -D lighthouse` to include it",
      durationMs: 0,
      issues: [],
      uniqueRuleCount: 0,
      legalMapping: false,
    };
  }

  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--remote-debugging-port=0"],
    });
    const wsUrl = browser.wsEndpoint();
    const port = Number(new URL(wsUrl).port);

    const result = await lighthouse(url, {
      port,
      output: "json",
      onlyCategories: ["accessibility"],
      logLevel: "error",
      maxWaitForLoad: timeoutMs,
    });

    const audits = result.lhr.audits;
    const issues: BenchIssue[] = [];
    for (const id of Object.keys(audits)) {
      const a = audits[id];
      if (a.scoreDisplayMode === "manual" || a.scoreDisplayMode === "notApplicable") continue;
      if (a.score === null || a.score >= 1) continue;
      const firstSelector = a.details?.items?.[0]?.node?.selector;
      const occurrences = a.details?.items?.length ?? 1;
      issues.push({
        ruleId: a.id,
        severity: DEFAULT_SEVERITY,
        message: a.title,
        selector: firstSelector,
        occurrences,
      });
    }

    return {
      tool: "lighthouse",
      url,
      ok: true,
      durationMs: Date.now() - started,
      issues,
      uniqueRuleCount: issues.length,
      legalMapping: false,
    };
  } catch (err) {
    return {
      tool: "lighthouse",
      url,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      durationMs: Date.now() - started,
      issues: [],
      uniqueRuleCount: 0,
      legalMapping: false,
    };
  } finally {
    if (browser) await browser.close();
  }
}
