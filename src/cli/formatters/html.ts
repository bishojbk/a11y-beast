import type { ScanResult } from "@/lib/types/scan-result";
import type { ComplianceResult } from "@/lib/types/compliance";
import { generateHtmlReport } from "@/lib/report/html-report";

export function formatHtml(
  scan: ScanResult,
  compliance: ComplianceResult[],
  effortMap: Record<string, { label: string; estimate: string }>
): string {
  return generateHtmlReport(scan, compliance, effortMap);
}
