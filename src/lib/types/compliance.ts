export interface ComplianceFramework {
  id: string;
  name: string;
  shortName: string;
  region: string;
  wcagBasis: string;
  appliesTo: "public" | "private" | "both";
  enforcementDate?: string;
  penalties: string;
  url: string;
  deadlineAlert?: string;
}

export interface ComplianceResult {
  framework: ComplianceFramework;
  passedCount: number;
  failedCount: number;
  totalApplicable: number;
  percentage: number;
  failingRuleIds: string[];
}
