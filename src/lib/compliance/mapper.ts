import type { ComplianceResult } from "@/lib/types/compliance";
import type { AccessibilityIssue } from "@/lib/types/issue";
import { FRAMEWORKS, type FrameworkWithTags } from "./frameworks";

/**
 * Determine which frameworks an issue applies to based on its axe-core tags.
 * A rule applies to a framework if ANY of the rule's tags match the framework's accepted tags.
 */
export function getApplicableFrameworks(axeTags: string[]): string[] {
  const ids: string[] = [];
  for (const fw of FRAMEWORKS) {
    if (axeTags.some((tag) => fw.acceptedTags.includes(tag))) {
      ids.push(fw.id);
    }
  }
  return ids;
}

const SEV_WEIGHT: Record<string, number> = {
  critical: 5,
  major: 3,
  minor: 1.5,
  "best-practice": 0.3,
};

interface RuleInfo {
  ruleId: string;
  severity: string;
  tags: string[];
  elementCount: number;
}

/**
 * Framework-centric compliance scoring.
 *
 * Each framework is scored independently based on:
 * 1. Which failing rules have tags matching this framework's acceptedTags
 * 2. Framework-specific bonus penalties (missing a11y statement, skip link, etc.)
 * 3. Severity weighting with per-framework multiplier
 * 4. Element count weighting (for per-violation penalty frameworks like Unruh Act)
 */
export function generateComplianceResults(
  issues: AccessibilityIssue[],
  passedRuleCount: number,
  pageMeta?: { hasAccessibilityStatement?: boolean; hasSkipLink?: boolean; lang?: string }
): ComplianceResult[] {
  // Deduplicate issues into unique rules, tracking worst severity, element count,
  // and the set of framework IDs from applicableFrameworks
  const ruleMap = new Map<string, RuleInfo & { frameworkIds: Set<string> }>();
  for (const issue of issues) {
    const existing = ruleMap.get(issue.ruleId);
    if (!existing) {
      ruleMap.set(issue.ruleId, {
        ruleId: issue.ruleId,
        severity: issue.severity,
        tags: issue.wcagCriterion
          ? [`wcag${issue.wcagCriterion.number.replace(/\./g, "")}`]
          : ["best-practice"],
        elementCount: 1,
        frameworkIds: new Set(issue.applicableFrameworks),
      });
    } else {
      existing.elementCount++;
      // Keep worst severity
      if ((SEV_WEIGHT[issue.severity] ?? 0) > (SEV_WEIGHT[existing.severity] ?? 0)) {
        existing.severity = issue.severity;
      }
      // Merge framework IDs from all instances of this rule
      for (const fwId of issue.applicableFrameworks) {
        existing.frameworkIds.add(fwId);
      }
    }
  }

  return FRAMEWORKS.map((fw) => {
    // Find which failing rules apply to THIS specific framework
    const applicableFailingRules: RuleInfo[] = [];
    for (const [, rule] of ruleMap) {
      if (rule.frameworkIds.has(fw.id)) {
        applicableFailingRules.push(rule);
      }
    }

    const failedCount = applicableFailingRules.length;
    const failingRuleIds = applicableFailingRules.map((r) => r.ruleId);

    // Total applicable = failed + passed (approximate: scale passed by tag coverage ratio)
    // WCAG 2.0 frameworks cover fewer rules than 2.1/2.2
    const tagCoverage = fw.acceptedTags.length;
    const maxTags = 12; // approximate max tag count
    const coverageRatio = Math.min(tagCoverage / maxTags, 1);
    const estimatedPassedForFw = Math.round(passedRuleCount * coverageRatio);
    const totalApplicable = failedCount + estimatedPassedForFw;

    if (totalApplicable === 0) {
      return {
        framework: fw,
        passedCount: 0,
        failedCount: 0,
        totalApplicable: 0,
        percentage: 100,
        failingRuleIds: [],
      };
    }

    // Base pass rate
    const basePassRate = (totalApplicable - failedCount) / totalApplicable;

    // Severity penalty (weighted by framework's multiplier)
    const sevMultiplier = fw.bonusPenalties.severityMultiplier ?? 1.0;
    let severityPenalty = 0;
    for (const rule of applicableFailingRules) {
      severityPenalty += (SEV_WEIGHT[rule.severity] ?? 1) * sevMultiplier;
    }
    const normalizedSevPenalty = Math.min(severityPenalty / (totalApplicable * 3), 1) * 0.2;

    // Element count penalty (for frameworks like Unruh Act that care about per-violation)
    const elemWeight = fw.bonusPenalties.elementCountWeight ?? 0;
    const totalElements = applicableFailingRules.reduce((sum, r) => sum + r.elementCount, 0);
    const elementPenalty = elemWeight > 0 ? Math.min(totalElements / 100, 1) * elemWeight : 0;

    // Framework-specific bonus penalties
    let bonusPenalty = 0;
    if (fw.bonusPenalties.missingA11yStatement && pageMeta && !pageMeta.hasAccessibilityStatement) {
      bonusPenalty += fw.bonusPenalties.missingA11yStatement / 100;
    }
    if (fw.bonusPenalties.missingSkipLink && pageMeta && !pageMeta.hasSkipLink) {
      bonusPenalty += fw.bonusPenalties.missingSkipLink / 100;
    }
    if (fw.bonusPenalties.missingLang && pageMeta && (!pageMeta.lang || pageMeta.lang === "(not set)")) {
      bonusPenalty += fw.bonusPenalties.missingLang / 100;
    }

    // Final percentage
    const rawPercentage = basePassRate - normalizedSevPenalty - elementPenalty - bonusPenalty;
    const percentage = Math.max(0, Math.min(100, Math.round(rawPercentage * 100)));

    return {
      framework: fw,
      passedCount: totalApplicable - failedCount,
      failedCount,
      totalApplicable,
      percentage,
      failingRuleIds,
    };
  });
}
