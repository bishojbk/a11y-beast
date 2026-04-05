export type Severity = "critical" | "major" | "minor" | "best-practice";

export type WcagLevel = "A" | "AA" | "AAA";

export type WcagPrinciple =
  | "perceivable"
  | "operable"
  | "understandable"
  | "robust";

export type ImpactGroup = "visual" | "motor" | "cognitive" | "auditory";

export interface WcagCriterion {
  number: string;
  name: string;
  level: WcagLevel;
  principle: WcagPrinciple;
}

export interface ElementInfo {
  html: string;
  selector: string;
}

export interface AccessibilityIssue {
  id: string;
  ruleId: string;
  source: "axe-core" | "custom";
  severity: Severity;
  wcagCriterion: WcagCriterion | null;
  impact: ImpactGroup[];
  element: ElementInfo;
  description: string;
  fixSuggestion: string;
  whyItMatters: string;
  needsManualReview: boolean;
  applicableFrameworks: string[];
}
