import type { BenchIssue, BenchRun, BenchSeverity } from "../types";

interface Pa11yIssue {
  code: string;
  type: "error" | "warning" | "notice";
  message: string;
  context: string;
  selector: string;
  runnerExtras?: Record<string, unknown>;
}

interface Pa11yResult {
  documentTitle: string;
  pageUrl: string;
  issues: Pa11yIssue[];
}

type Pa11yFn = (url: string, opts?: Record<string, unknown>) => Promise<Pa11yResult>;

const SEVERITY: Record<Pa11yIssue["type"], BenchSeverity> = {
  error: "major",
  warning: "minor",
  notice: "info",
};

// Pa11y codes look like "WCAG2AA.Principle1.Guideline1_1.1_1_1.H37". We pull
// the criterion (1.1.1) and level (AA) out of the prefix.
function parseCode(code: string): { criterion?: string; level?: "A" | "AA" | "AAA"; rule: string } {
  const parts = code.split(".");
  const levelMatch = parts[0]?.match(/^WCAG2(A{1,3})$/);
  const level = levelMatch?.[1] as "A" | "AA" | "AAA" | undefined;
  const criterionPart = parts.find((p) => /^\d+_\d+_\d+$/.test(p));
  const criterion = criterionPart?.replace(/_/g, ".");
  const rule = parts[parts.length - 1] ?? code;
  return { criterion, level, rule };
}

export async function runPa11y(url: string, timeoutMs: number): Promise<BenchRun> {
  const started = Date.now();

  let pa11y: Pa11yFn | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("pa11y");
    pa11y = (mod.default ?? mod) as Pa11yFn;
  } catch {
    return {
      tool: "pa11y",
      url,
      ok: false,
      error: "pa11y not installed — run `npm i -D pa11y` to include it",
      durationMs: 0,
      issues: [],
      uniqueRuleCount: 0,
      legalMapping: false,
    };
  }

  try {
    const result = await pa11y(url, {
      timeout: timeoutMs,
      chromeLaunchConfig: {
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      },
    });

    // Collapse by rule (last segment of the code) so counts match Beast's grouping.
    const byRule = new Map<string, BenchIssue>();
    for (const issue of result.issues) {
      const { criterion, level, rule } = parseCode(issue.code);
      const existing = byRule.get(rule);
      if (existing) {
        existing.occurrences += 1;
        continue;
      }
      byRule.set(rule, {
        ruleId: rule,
        severity: SEVERITY[issue.type],
        message: issue.message,
        wcagCriterion: criterion,
        wcagLevel: level,
        selector: issue.selector,
        occurrences: 1,
      });
    }

    const issues = Array.from(byRule.values());
    return {
      tool: "pa11y",
      url,
      ok: true,
      durationMs: Date.now() - started,
      issues,
      uniqueRuleCount: issues.length,
      legalMapping: false,
    };
  } catch (err) {
    return {
      tool: "pa11y",
      url,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      durationMs: Date.now() - started,
      issues: [],
      uniqueRuleCount: 0,
      legalMapping: false,
    };
  }
}
