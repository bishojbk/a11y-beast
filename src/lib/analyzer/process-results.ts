import type { AccessibilityIssue, Severity, WcagPrinciple, WcagLevel } from "@/lib/types/issue";
import type { ScanResult, PageMeta } from "@/lib/types/scan-result";
import { getApplicableFrameworks } from "@/lib/compliance/mapper";
import { calculateScore } from "./scoring";

function mapSeverity(impact: string | null | undefined): Severity {
  switch (impact) {
    case "critical": return "critical";
    case "serious": return "major";
    case "moderate": return "minor";
    case "minor": return "best-practice";
    default: return "minor";
  }
}

function extractWcagCriterion(tags: string[]): AccessibilityIssue["wcagCriterion"] {
  for (const tag of tags) {
    const match = tag.match(/^wcag(\d)(\d)(\d+)$/);
    if (match) {
      const number = `${match[1]}.${match[2]}.${match[3]}`;
      const principle: WcagPrinciple =
        match[1] === "1" ? "perceivable" :
        match[1] === "2" ? "operable" :
        match[1] === "3" ? "understandable" : "robust";
      let level: WcagLevel = "AA";
      if (tags.includes("wcag2a") || tags.includes("wcag21a")) level = "A";
      if (tags.includes("wcag2aaa") || tags.includes("wcag21aaa")) level = "AAA";
      return { number, name: "", level, principle };
    }
  }
  return null;
}

function getImpactGroups(ruleId: string, tags: string[]): AccessibilityIssue["impact"] {
  const groups: AccessibilityIssue["impact"] = [];
  const id = ruleId.toLowerCase();
  if (id.includes("color") || id.includes("contrast") || id.includes("image") || id.includes("alt")) groups.push("visual");
  if (id.includes("keyboard") || id.includes("focus") || id.includes("tabindex") || id.includes("target-size")) groups.push("motor");
  if (id.includes("label") || id.includes("heading") || id.includes("lang") || id.includes("autocomplete")) groups.push("cognitive");
  if (id.includes("audio") || id.includes("video") || id.includes("caption") || id.includes("media")) groups.push("auditory");
  if (tags.some((t) => t.includes("cat.text-alternatives"))) groups.push("visual");
  if (tags.some((t) => t.includes("cat.keyboard"))) groups.push("motor");
  if (tags.some((t) => t.includes("cat.aria") || t.includes("cat.name-role-value"))) groups.push("visual");
  return [...new Set(groups)].length > 0 ? [...new Set(groups)] : ["visual"];
}

interface RawNode { html: string; target: string[]; failureSummary?: string; }
interface RawRule { id: string; impact?: string; tags: string[]; description: string; help: string; helpUrl: string; nodes: RawNode[]; }

let counter = 0;

export function processServerResults(
  data: {
    finalUrl: string;
    fetchDurationMs: number;
    axeResults: { violations: RawRule[]; passes: RawRule[]; incomplete: RawRule[]; inapplicable: RawRule[] };
    customIssues?: { ruleId: string; impact: string; help: string; description: string; tags: string[]; nodes: { html: string; target: string }[] }[];
    pageMeta: Omit<PageMeta, "url">;
  },
  url: string
): ScanResult {
  const { axeResults, pageMeta: rawMeta } = data;

  // Convert violations to typed issues
  const issues: AccessibilityIssue[] = [];
  // Process violations (definite failures)
  for (const violation of axeResults.violations) {
    for (const node of violation.nodes) {
      issues.push({
        id: `${violation.id}-${counter++}`,
        ruleId: violation.id,
        source: "axe-core",
        severity: mapSeverity(violation.impact),
        wcagCriterion: extractWcagCriterion(violation.tags),
        impact: getImpactGroups(violation.id, violation.tags),
        element: {
          html: node.html.slice(0, 500),
          selector: node.target.map(String).join(" > "),
        },
        description: violation.description,
        fixSuggestion: violation.help,
        whyItMatters: node.failureSummary ?? violation.helpUrl,
        needsManualReview: false,
        applicableFrameworks: getApplicableFrameworks(violation.tags),
      });
    }
  }

  // Process incomplete results as issues that need manual review
  // These are elements where axe-core couldn't determine pass/fail —
  // they should count towards the score since they're likely problems
  for (const inc of axeResults.incomplete) {
    for (const node of inc.nodes) {
      issues.push({
        id: `${inc.id}-review-${counter++}`,
        ruleId: inc.id,
        source: "axe-core",
        severity: mapSeverity(inc.impact),
        wcagCriterion: extractWcagCriterion(inc.tags),
        impact: getImpactGroups(inc.id, inc.tags),
        element: {
          html: node.html.slice(0, 500),
          selector: node.target.map(String).join(" > "),
        },
        description: inc.description,
        fixSuggestion: inc.help,
        whyItMatters: node.failureSummary ?? "Needs manual review — automated testing could not determine pass/fail.",
        needsManualReview: true,
        applicableFrameworks: getApplicableFrameworks(inc.tags),
      });
    }
  }

  // Process custom issues (checks axe-core doesn't cover)
  if (data.customIssues) {
    for (const custom of data.customIssues) {
      for (const node of custom.nodes) {
        issues.push({
          id: `${custom.ruleId}-${counter++}`,
          ruleId: custom.ruleId,
          source: "custom",
          severity: mapSeverity(custom.impact),
          wcagCriterion: extractWcagCriterion(custom.tags),
          impact: getImpactGroups(custom.ruleId, custom.tags),
          element: {
            html: node.html.slice(0, 500),
            selector: node.target,
          },
          description: custom.description,
          fixSuggestion: custom.help,
          whyItMatters: custom.description,
          needsManualReview: false,
          applicableFrameworks: getApplicableFrameworks(custom.tags),
        });
      }
    }
  }

  const passedRules = axeResults.passes.length;
  const incompleteRules = axeResults.incomplete.length;
  const inapplicableRules = axeResults.inapplicable.length;

  const score = calculateScore(issues, passedRules, incompleteRules);

  const pageMeta: PageMeta = { url: data.finalUrl ?? url, ...rawMeta };

  return {
    id: `scan-${Date.now()}-${counter++}`,
    url: data.finalUrl ?? url,
    inputMethod: "url",
    timestamp: new Date().toISOString(),
    scanDurationMs: data.fetchDurationMs,
    pageMeta,
    score,
    issues,
    passedRules,
    incompleteRules,
    inapplicableRules,
    totalRulesRun: axeResults.violations.length + passedRules + incompleteRules + inapplicableRules,
  };
}
