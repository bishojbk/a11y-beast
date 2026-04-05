import type { AccessibilityIssue, Severity, WcagLevel, WcagPrinciple } from "./issue";

export interface ScoreBreakdown {
  overall: number; // 0-100
  grade: "A" | "B" | "C" | "D" | "F";
  byLevel: Record<WcagLevel, { passed: number; failed: number; total: number }>;
  byPrinciple: Record<WcagPrinciple, { passed: number; failed: number }>;
  bySeverity: Record<Severity, number>;
}

export interface PageMeta {
  url: string;
  title: string;
  lang: string;
  hasH1: boolean;
  hasSkipLink: boolean;
  hasAccessibilityStatement: boolean;
  imageCount: number;
  imagesWithoutAlt: number;
  linkCount: number;
  headingCount: number;
  formCount: number;
}

export interface ScanResult {
  id: string;
  url: string;
  inputMethod: "url" | "paste" | "upload";
  timestamp: string;
  scanDurationMs: number;
  pageMeta: PageMeta;
  score: ScoreBreakdown;
  issues: AccessibilityIssue[];
  passedRules: number;
  incompleteRules: number;
  inapplicableRules: number;
  totalRulesRun: number;
}
