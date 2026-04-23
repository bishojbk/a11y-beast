import puppeteer from "puppeteer";
import { readFileSync } from "fs";
import { join } from "path";
import type { BenchIssue, BenchRun, BenchSeverity } from "../types";

// Same dual-lookup the main scanner uses so the CLI works from project root
// or a global install. Deferred until first use so a missing axe-core doesn't
// crash at module import.
function loadAxeSource(): string {
  try {
    return readFileSync(join(process.cwd(), "node_modules", "axe-core", "axe.min.js"), "utf-8");
  } catch {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createRequire } = require("module");
    const req = createRequire(__filename);
    return readFileSync(req.resolve("axe-core/axe.min.js"), "utf-8");
  }
}

let axeSourceCache: string | null = null;
function getAxeSource(): string {
  if (axeSourceCache === null) axeSourceCache = loadAxeSource();
  return axeSourceCache;
}

const IMPACT_MAP: Record<string, BenchSeverity> = {
  critical: "critical",
  serious: "major",
  moderate: "minor",
  minor: "info",
};

function extractWcag(tags: string[]): { criterion?: string; level?: "A" | "AA" | "AAA" } {
  // axe tags like "wcag143" → "1.4.3", and level via "wcag2a" / "wcag2aa" / "wcag2aaa".
  const criterionTag = tags.find((t) => /^wcag\d{3,4}$/.test(t));
  let criterion: string | undefined;
  if (criterionTag) {
    const digits = criterionTag.replace("wcag", "");
    criterion = digits.split("").join(".");
  }
  const level = tags.includes("wcag2aaa") ? "AAA" : tags.includes("wcag2aa") ? "AA" : tags.includes("wcag2a") ? "A" : undefined;
  return { criterion, level };
}

export async function runAxeRaw(url: string, timeoutMs: number): Promise<BenchRun> {
  const started = Date.now();
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: timeoutMs });
    await page.evaluate(getAxeSource());
    const violations: Array<{ id: string; impact?: string; tags: string[]; description: string; nodes: Array<{ target: string[] }> }> =
      await page.evaluate(async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r = await (window as any).axe.run(document, { resultTypes: ["violations"] });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return r.violations.map((v: any) => ({
          id: v.id,
          impact: v.impact,
          tags: v.tags,
          description: v.description,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          nodes: v.nodes.map((n: any) => ({ target: n.target })),
        }));
      });

    const issues: BenchIssue[] = violations.map((v) => {
      const { criterion, level } = extractWcag(v.tags);
      return {
        ruleId: v.id,
        severity: IMPACT_MAP[v.impact ?? ""] ?? "minor",
        message: v.description,
        wcagCriterion: criterion,
        wcagLevel: level,
        selector: v.nodes[0]?.target.join(" "),
        occurrences: v.nodes.length,
      };
    });

    return {
      tool: "axe-raw",
      url,
      ok: true,
      durationMs: Date.now() - started,
      issues,
      uniqueRuleCount: issues.length,
      legalMapping: false,
    };
  } catch (err) {
    return {
      tool: "axe-raw",
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
