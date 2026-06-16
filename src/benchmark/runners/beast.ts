import { puppeteerScan } from "@/lib/fetch/puppeteer-scanner";
import { processServerResults } from "@/lib/analyzer/process-results";
import type { BenchIssue, BenchRun, BenchSeverity } from "../types";
import type { Severity } from "@/lib/types/issue";

const SEV_MAP: Record<Severity, BenchSeverity> = {
  critical: "critical",
  major: "major",
  minor: "minor",
  "best-practice": "info",
};

export async function runBeast(url: string, _timeoutMs: number): Promise<BenchRun> {
  void _timeoutMs; // puppeteerScan has its own internal timeout; kept in signature for parity with the other runners
  const started = Date.now();
  try {
    const raw = await puppeteerScan(url);
    if (!raw.ok) {
      return {
        tool: "beast",
        url,
        ok: false,
        error: raw.error ?? "scan failed",
        durationMs: Date.now() - started,
        issues: [],
        uniqueRuleCount: 0,
        legalMapping: true,
      };
    }

    if (!raw.axeResults || !raw.pageMeta || raw.finalUrl === undefined) {
      return {
        tool: "beast",
        url,
        ok: false,
        error: "scan returned incomplete payload",
        durationMs: Date.now() - started,
        issues: [],
        uniqueRuleCount: 0,
        legalMapping: true,
      };
    }

    const result = processServerResults(
      {
        finalUrl: raw.finalUrl,
        fetchDurationMs: raw.fetchDurationMs,
        axeResults: raw.axeResults,
        customIssues: raw.customIssues?.map((c) => ({
          ruleId: c.ruleId,
          impact: c.impact,
          help: c.help,
          description: c.description,
          tags: c.tags,
          nodes: c.nodes,
        })),
        pageMeta: raw.pageMeta,
      },
      url
    );
    // Group by rule so the per-URL tables aren't dominated by one noisy rule.
    const byRule = new Map<string, BenchIssue>();
    for (const i of result.issues) {
      const existing = byRule.get(i.ruleId);
      if (existing) {
        existing.occurrences += 1;
        continue;
      }
      byRule.set(i.ruleId, {
        ruleId: i.ruleId,
        severity: SEV_MAP[i.severity],
        message: i.description,
        wcagCriterion: i.wcagCriterion?.number,
        wcagLevel: i.wcagCriterion?.level,
        selector: i.element.selector,
        occurrences: 1,
      });
    }

    const issues = Array.from(byRule.values());
    return {
      tool: "beast",
      url,
      ok: true,
      durationMs: Date.now() - started,
      issues,
      uniqueRuleCount: issues.length,
      legalMapping: true,
    };
  } catch (err) {
    return {
      tool: "beast",
      url,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      durationMs: Date.now() - started,
      issues: [],
      uniqueRuleCount: 0,
      legalMapping: true,
    };
  }
}
