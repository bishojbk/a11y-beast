import type { AccessibilityIssue, WcagLevel, WcagPrinciple } from "@/lib/types/issue";
import type { FrameworkWithTags } from "./frameworks";
import { getWcagCriterionName } from "@/lib/analyzer/wcag-data";

/**
 * Catalog of WCAG Success Criteria at Level A and AA, tagged by the version
 * that introduced them (2.0 or 2.1). Every legal framework A11y Beast covers
 * cites WCAG 2.0 AA or 2.1 AA, so this catalog is the full denominator for any
 * per-regulation conformance view. (2.2-only criteria are intentionally absent
 * — no framework here cites 2.2 yet.)
 */
export interface WcagCriterionDef {
  number: string;
  level: Exclude<WcagLevel, "AAA">;
  version: "2.0" | "2.1";
}

export const WCAG_CRITERIA: WcagCriterionDef[] = [
  // ── WCAG 2.0 Level A ──
  { number: "1.1.1", level: "A", version: "2.0" },
  { number: "1.2.1", level: "A", version: "2.0" },
  { number: "1.2.2", level: "A", version: "2.0" },
  { number: "1.2.3", level: "A", version: "2.0" },
  { number: "1.3.1", level: "A", version: "2.0" },
  { number: "1.3.2", level: "A", version: "2.0" },
  { number: "1.3.3", level: "A", version: "2.0" },
  { number: "1.4.1", level: "A", version: "2.0" },
  { number: "1.4.2", level: "A", version: "2.0" },
  { number: "2.1.1", level: "A", version: "2.0" },
  { number: "2.1.2", level: "A", version: "2.0" },
  { number: "2.2.1", level: "A", version: "2.0" },
  { number: "2.2.2", level: "A", version: "2.0" },
  { number: "2.3.1", level: "A", version: "2.0" },
  { number: "2.4.1", level: "A", version: "2.0" },
  { number: "2.4.2", level: "A", version: "2.0" },
  { number: "2.4.3", level: "A", version: "2.0" },
  { number: "2.4.4", level: "A", version: "2.0" },
  { number: "3.1.1", level: "A", version: "2.0" },
  { number: "3.2.1", level: "A", version: "2.0" },
  { number: "3.2.2", level: "A", version: "2.0" },
  { number: "3.3.1", level: "A", version: "2.0" },
  { number: "3.3.2", level: "A", version: "2.0" },
  { number: "4.1.1", level: "A", version: "2.0" },
  { number: "4.1.2", level: "A", version: "2.0" },
  // ── WCAG 2.0 Level AA ──
  { number: "1.2.4", level: "AA", version: "2.0" },
  { number: "1.2.5", level: "AA", version: "2.0" },
  { number: "1.4.3", level: "AA", version: "2.0" },
  { number: "1.4.4", level: "AA", version: "2.0" },
  { number: "1.4.5", level: "AA", version: "2.0" },
  { number: "2.4.5", level: "AA", version: "2.0" },
  { number: "2.4.6", level: "AA", version: "2.0" },
  { number: "2.4.7", level: "AA", version: "2.0" },
  { number: "3.1.2", level: "AA", version: "2.0" },
  { number: "3.2.3", level: "AA", version: "2.0" },
  { number: "3.2.4", level: "AA", version: "2.0" },
  { number: "3.3.3", level: "AA", version: "2.0" },
  { number: "3.3.4", level: "AA", version: "2.0" },
  // ── WCAG 2.1 Level A additions ──
  { number: "2.1.4", level: "A", version: "2.1" },
  { number: "2.5.1", level: "A", version: "2.1" },
  { number: "2.5.2", level: "A", version: "2.1" },
  { number: "2.5.3", level: "A", version: "2.1" },
  { number: "2.5.4", level: "A", version: "2.1" },
  // ── WCAG 2.1 Level AA additions ──
  { number: "1.3.4", level: "AA", version: "2.1" },
  { number: "1.3.5", level: "AA", version: "2.1" },
  { number: "1.4.10", level: "AA", version: "2.1" },
  { number: "1.4.11", level: "AA", version: "2.1" },
  { number: "1.4.12", level: "AA", version: "2.1" },
  { number: "1.4.13", level: "AA", version: "2.1" },
  { number: "4.1.3", level: "AA", version: "2.1" },
];

export type CriterionStatus = "fail" | "needs-review" | "pass" | "not-tested";

export interface CriterionResult {
  number: string;
  name: string;
  level: "A" | "AA";
  principle: WcagPrinciple;
  status: CriterionStatus;
  failCount: number; // confirmed failing occurrences mapped to this criterion
}

export interface ConformanceSummary {
  target: string; // e.g. "WCAG 2.1 Level AA"
  criteria: CriterionResult[];
  fail: number;
  needsReview: number;
  pass: number;
  notTested: number;
  total: number;
}

function principleOf(number: string): WcagPrinciple {
  switch (number[0]) {
    case "1": return "perceivable";
    case "2": return "operable";
    case "3": return "understandable";
    default: return "robust";
  }
}

/** Does this framework cite WCAG 2.1 (vs 2.0)? Derived from its accepted tags. */
function frameworkIsWcag21(fw: FrameworkWithTags): boolean {
  return fw.acceptedTags.includes("wcag21a") || fw.acceptedTags.includes("wcag21aa");
}

/** Criterion numbers found in a set of axe tag arrays (e.g. "wcag143" → "1.4.3"). */
function criteriaFromTags(tagSets: string[][]): Set<string> {
  const out = new Set<string>();
  for (const tags of tagSets) {
    for (const tag of tags) {
      const m = tag.match(/^wcag(\d)(\d)(\d+)$/);
      if (m) out.add(`${m[1]}.${m[2]}.${m[3]}`);
    }
  }
  return out;
}

/**
 * Compute per-Success-Criterion conformance for a framework — the audit-grade
 * view. WCAG conformance is pass/fail per criterion; criteria automation could
 * not evaluate are reported "not tested" (honest about the ~60% coverage gap),
 * never silently passed.
 */
export function computeConformance(
  fw: FrameworkWithTags,
  issues: AccessibilityIssue[],
  passedRuleTags?: string[][]
): ConformanceSummary {
  const is21 = frameworkIsWcag21(fw);
  const applicable = WCAG_CRITERIA.filter((c) => is21 || c.version === "2.0");

  // Confirmed failures and needs-review, keyed by criterion number.
  const failCounts = new Map<string, number>();
  const needsReview = new Set<string>();
  for (const issue of issues) {
    const num = issue.wcagCriterion?.number;
    if (!num) continue;
    if (issue.needsManualReview) {
      needsReview.add(num);
    } else {
      failCounts.set(num, (failCounts.get(num) ?? 0) + 1);
    }
  }
  const passed = passedRuleTags ? criteriaFromTags(passedRuleTags) : new Set<string>();

  const criteria: CriterionResult[] = applicable.map((c) => {
    let status: CriterionStatus;
    if (failCounts.has(c.number)) status = "fail";
    else if (needsReview.has(c.number)) status = "needs-review";
    else if (passed.has(c.number)) status = "pass";
    else status = "not-tested";
    return {
      number: c.number,
      name: getWcagCriterionName(c.number) || c.number,
      level: c.level,
      principle: principleOf(c.number),
      status,
      failCount: failCounts.get(c.number) ?? 0,
    };
  });

  const tally = (s: CriterionStatus) => criteria.filter((c) => c.status === s).length;
  return {
    target: `${is21 ? "WCAG 2.1" : "WCAG 2.0"} Level AA`,
    criteria,
    fail: tally("fail"),
    needsReview: tally("needs-review"),
    pass: tally("pass"),
    notTested: tally("not-tested"),
    total: criteria.length,
  };
}
