// Normalized benchmark schema. Every runner folds its native output into
// BenchRun so cross-tool tables stay apples-to-apples.

export type ToolName = "beast" | "axe-raw" | "pa11y" | "lighthouse";

export type BenchSeverity = "critical" | "major" | "minor" | "info";

export interface BenchIssue {
  ruleId: string;
  severity: BenchSeverity;
  message: string;
  wcagCriterion?: string;
  wcagLevel?: "A" | "AA" | "AAA";
  selector?: string;
  occurrences: number;
}

export interface BenchRun {
  tool: ToolName;
  url: string;
  ok: boolean;
  error?: string;
  durationMs: number;
  issues: BenchIssue[];
  /** Unique rule ids surfaced (rolled-up; occurrences collapsed). */
  uniqueRuleCount: number;
  /** Whether the runner mapped findings to legal frameworks (beast only). */
  legalMapping: boolean;
}

export interface BenchReport {
  timestamp: string;
  urls: string[];
  tools: ToolName[];
  runs: BenchRun[];
}
