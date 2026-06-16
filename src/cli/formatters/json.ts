import type { ScanResult } from "@/lib/types/scan-result";
import type { ComplianceResult } from "@/lib/types/compliance";

export function formatJson(
  scan: ScanResult,
  compliance: ComplianceResult[],
  effortMap: Record<string, { label: string; estimate: string }>,
  fixMap?: Record<string, { fixedHtml: string; explanation: string }>
): string {
  return JSON.stringify(
    {
      scan,
      ...(fixMap && Object.keys(fixMap).length > 0 ? { fixes: fixMap } : {}),
      compliance: compliance.map((c) => ({
        framework: c.framework.id,
        name: c.framework.shortName,
        region: c.framework.region,
        percentage: c.percentage,
        passedCount: c.passedCount,
        failedCount: c.failedCount,
        totalApplicable: c.totalApplicable,
        failingRuleIds: c.failingRuleIds,
        penalties: c.framework.penalties,
        deadlineAlert: c.framework.deadlineAlert ?? null,
      })),
      effort: effortMap,
      meta: {
        version: "0.1.0",
        engine: "axe-core 4.11.2 + 20 custom checks",
        timestamp: new Date().toISOString(),
      },
    },
    null,
    2
  );
}
