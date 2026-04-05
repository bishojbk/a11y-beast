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

export function calculateScore(
  issues: AccessibilityIssue[],
  passedRules: number,
  incompleteRules: number
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
  // Based on: what % of applicable rules pass, penalized by severity and element count.
  //
  // Step 1: Base pass rate (how many rules pass out of total applicable)
  const failingRuleCount = failingRules.size;
  const passRate = totalApplicableRules > 0
    ? (totalApplicableRules - failingRuleCount) / totalApplicableRules
    : 1;

  // Step 2: Severity deduction — serious/critical failures cost more
  // Normalized to 0-0.25 range (max 25 point deduction)
  const maxSeverityPenalty = totalApplicableRules * RULE_SEVERITY_WEIGHT.critical * 2;
  const severityDeduction = maxSeverityPenalty > 0
    ? Math.min(failurePoints / maxSeverityPenalty, 1) * 0.25
    : 0;

  // Step 3: Element count deduction — many failing elements is worse
  // Normalized to 0-0.15 range (max 15 point deduction)
  const totalFailingElements = issues.length;
  const elementDeduction = Math.min(totalFailingElements / 200, 1) * 0.15;

  // Step 4: Combine — start from pass rate, subtract penalties
  const rawScore = Math.max(0, passRate - severityDeduction - elementDeduction);

  // Step 5: Scale to 0-100
  const overall = Math.max(0, Math.min(100, Math.round(rawScore * 100)));

  // Grade thresholds aligned with common accessibility grading
  const grade: ScoreBreakdown["grade"] =
    overall >= 90 ? "A" :
    overall >= 75 ? "B" :
    overall >= 60 ? "C" :
    overall >= 40 ? "D" : "F";

  // By WCAG level
  const byLevel: ScoreBreakdown["byLevel"] = {
    A: { passed: 0, failed: 0, total: 0 },
    AA: { passed: 0, failed: 0, total: 0 },
    AAA: { passed: 0, failed: 0, total: 0 },
  };
  for (const issue of issues) {
    const level = issue.wcagCriterion?.level ?? "AA";
    byLevel[level].failed++;
    byLevel[level].total++;
  }
  byLevel.A.passed = Math.round(passedRules * 0.3);
  byLevel.AA.passed = Math.round(passedRules * 0.6);
  byLevel.AAA.passed = Math.round(passedRules * 0.1);
  byLevel.A.total += byLevel.A.passed;
  byLevel.AA.total += byLevel.AA.passed;
  byLevel.AAA.total += byLevel.AAA.passed;

  // By principle
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
  const principles: WcagPrinciple[] = ["perceivable", "operable", "understandable", "robust"];
  const weights = [0.35, 0.3, 0.2, 0.15];
  principles.forEach((p, i) => {
    byPrinciple[p].passed = Math.round(passedRules * weights[i]);
  });

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
