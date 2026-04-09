import type { AccessibilityIssue, Severity, WcagLevel, WcagPrinciple } from "@/lib/types/issue";
import type { ScoreBreakdown } from "@/lib/types/scan-result";

/**
 * Scoring algorithm modeled after common accessibility scoring tools.
 *
 * The score is based on the RATIO of failing rules to total applicable rules,
 * weighted by severity. This means:
 * - A site with 3 failing rules out of 40 applicable = much worse than 3/100
 * - Critical/serious issues weigh more than moderate/minor
 * - Each UNIQUE failing rule counts (not each element — 99 elements failing
 *   "region" is one rule failing, not 99 failures)
 * - Incomplete (needs review) rules count as half-failures
 */

const RULE_SEVERITY_WEIGHT: Record<Severity, number> = {
  critical: 5,
  major: 3,
  minor: 1.5,
  "best-practice": 0.5,
};

/**
 * Distribution of passed rules by WCAG level and principle.
 * Extracted from actual axe-core pass results when available.
 */
export interface PassDistribution {
  byLevel: { A: number; AA: number; AAA: number };
  byPrinciple: { perceivable: number; operable: number; understandable: number; robust: number };
}

/**
 * Extract pass distribution from axe-core passed rule tags.
 * Each rule has a tags array — we determine level and principle from those tags.
 */
export function extractPassDistribution(
  passedRuleTags: string[][]
): PassDistribution {
  const byLevel = { A: 0, AA: 0, AAA: 0 };
  const byPrinciple = { perceivable: 0, operable: 0, understandable: 0, robust: 0 };

  for (const tags of passedRuleTags) {
    // Determine WCAG level from tags
    if (tags.some((t) => t.includes("aaa"))) {
      byLevel.AAA++;
    } else if (tags.some((t) => t === "wcag2a" || t === "wcag21a")) {
      byLevel.A++;
    } else {
      byLevel.AA++; // Default: AA (most rules) or best-practice
    }

    // Determine principle from criterion tags (e.g., wcag111 → principle 1 → perceivable)
    let principleFound = false;
    for (const tag of tags) {
      const match = tag.match(/^wcag(\d)\d+$/);
      if (match) {
        switch (match[1]) {
          case "1": byPrinciple.perceivable++; break;
          case "2": byPrinciple.operable++; break;
          case "3": byPrinciple.understandable++; break;
          case "4": byPrinciple.robust++; break;
        }
        principleFound = true;
        break;
      }
    }
    // Rules without a specific criterion tag (e.g., best-practice) — distribute to robust
    if (!principleFound) {
      byPrinciple.robust++;
    }
  }

  return { byLevel, byPrinciple };
}

export function calculateScore(
  issues: AccessibilityIssue[],
  passedRules: number,
  incompleteRules: number,
  passDistribution?: PassDistribution
): ScoreBreakdown {
  // Group issues by rule to count unique failing rules and their worst severity
  const failingRules = new Map<string, { severity: Severity; elementCount: number }>();
  for (const issue of issues) {
    const existing = failingRules.get(issue.ruleId);
    if (!existing || RULE_SEVERITY_WEIGHT[issue.severity] > RULE_SEVERITY_WEIGHT[existing.severity]) {
      failingRules.set(issue.ruleId, {
        severity: issue.severity,
        elementCount: (existing?.elementCount ?? 0) + 1,
      });
    } else {
      existing.elementCount++;
    }
  }

  // Calculate weighted failure score
  let failurePoints = 0;
  for (const [, rule] of failingRules) {
    const baseWeight = RULE_SEVERITY_WEIGHT[rule.severity];
    // Element count adds a scaling factor — more affected elements = worse
    // Uses log scale so 1 element = 1x, 10 elements = 2x, 100 elements = 3x
    const elementScale = 1 + Math.log10(Math.max(rule.elementCount, 1));
    failurePoints += baseWeight * elementScale;
  }

  // Incomplete rules count as half-failures (moderate severity)
  failurePoints += incompleteRules * RULE_SEVERITY_WEIGHT.minor * 0.5;

  // Total applicable rules (failed + passed + incomplete)
  const totalApplicableRules = failingRules.size + passedRules + incompleteRules;

  // ── Score Calculation ──
  const failingRuleCount = failingRules.size;
  const passRate = totalApplicableRules > 0
    ? (totalApplicableRules - failingRuleCount) / totalApplicableRules
    : 1;

  // Severity deduction — serious/critical failures cost more (max 25 point deduction)
  const maxSeverityPenalty = totalApplicableRules * RULE_SEVERITY_WEIGHT.critical * 2;
  const severityDeduction = maxSeverityPenalty > 0
    ? Math.min(failurePoints / maxSeverityPenalty, 1) * 0.25
    : 0;

  // Element count deduction — many failing elements is worse (max 15 point deduction)
  const totalFailingElements = issues.length;
  const elementDeduction = Math.min(totalFailingElements / 200, 1) * 0.15;

  // Combine — start from pass rate, subtract penalties
  const rawScore = Math.max(0, passRate - severityDeduction - elementDeduction);
  const overall = Math.max(0, Math.min(100, Math.round(rawScore * 100)));

  // Grade thresholds aligned with common accessibility grading
  const grade: ScoreBreakdown["grade"] =
    overall >= 90 ? "A" :
    overall >= 75 ? "B" :
    overall >= 60 ? "C" :
    overall >= 40 ? "D" : "F";

  // ── By WCAG Level ──
  const byLevel: ScoreBreakdown["byLevel"] = {
    A: { passed: 0, failed: 0, total: 0 },
    AA: { passed: 0, failed: 0, total: 0 },
    AAA: { passed: 0, failed: 0, total: 0 },
  };
  // Count failed issues by level
  for (const issue of issues) {
    const level = issue.wcagCriterion?.level ?? "AA";
    byLevel[level].failed++;
    byLevel[level].total++;
  }
  // Use actual pass distribution if available, otherwise estimate from axe-core's known distribution
  if (passDistribution) {
    byLevel.A.passed = passDistribution.byLevel.A;
    byLevel.AA.passed = passDistribution.byLevel.AA;
    byLevel.AAA.passed = passDistribution.byLevel.AAA;
  } else {
    // Fallback estimation based on axe-core's actual rule distribution:
    // ~35% Level A rules, ~55% Level AA rules, ~10% Level AAA / best-practice
    byLevel.A.passed = Math.round(passedRules * 0.35);
    byLevel.AA.passed = Math.round(passedRules * 0.55);
    byLevel.AAA.passed = passedRules - byLevel.A.passed - byLevel.AA.passed;
  }
  byLevel.A.total += byLevel.A.passed;
  byLevel.AA.total += byLevel.AA.passed;
  byLevel.AAA.total += byLevel.AAA.passed;

  // ── By Principle ──
  const byPrinciple: ScoreBreakdown["byPrinciple"] = {
    perceivable: { passed: 0, failed: 0 },
    operable: { passed: 0, failed: 0 },
    understandable: { passed: 0, failed: 0 },
    robust: { passed: 0, failed: 0 },
  };
  for (const issue of issues) {
    const p = issue.wcagCriterion?.principle ?? "robust";
    byPrinciple[p].failed++;
  }
  if (passDistribution) {
    byPrinciple.perceivable.passed = passDistribution.byPrinciple.perceivable;
    byPrinciple.operable.passed = passDistribution.byPrinciple.operable;
    byPrinciple.understandable.passed = passDistribution.byPrinciple.understandable;
    byPrinciple.robust.passed = passDistribution.byPrinciple.robust;
  } else {
    // Fallback estimation based on axe-core's known principle distribution
    const pWeights = { perceivable: 0.33, operable: 0.28, understandable: 0.17, robust: 0.22 };
    const principles: WcagPrinciple[] = ["perceivable", "operable", "understandable", "robust"];
    let remaining = passedRules;
    principles.forEach((p, i) => {
      const count = i < principles.length - 1 ? Math.round(passedRules * pWeights[p]) : remaining;
      byPrinciple[p].passed = count;
      remaining -= count;
    });
  }

  // By severity
  const bySeverity: ScoreBreakdown["bySeverity"] = {
    critical: 0,
    major: 0,
    minor: 0,
    "best-practice": 0,
  };
  for (const issue of issues) {
    bySeverity[issue.severity]++;
  }

  return { overall, grade, byLevel, byPrinciple, bySeverity };
}
