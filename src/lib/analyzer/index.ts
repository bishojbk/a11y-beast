import { runAxeInIframe, extractPageMeta } from "./axe-runner";
import { calculateScore, extractPassDistribution } from "./scoring";
import type { ScanResult } from "@/lib/types/scan-result";

let scanCounter = 0;

/**
 * Analyze an iframe that has HTML loaded into it.
 * axe-core is injected INTO the iframe and runs in its context.
 */
export async function analyzeIframe(
  iframe: HTMLIFrameElement,
  url: string,
  inputMethod: ScanResult["inputMethod"]
): Promise<ScanResult> {
  const start = performance.now();

  const iframeDoc = iframe.contentDocument;
  if (!iframeDoc) throw new Error("Cannot access iframe document");

  // Extract page meta from the iframe document (this works cross-frame for same-origin)
  const pageMeta = extractPageMeta(iframeDoc, url);

  // Run axe-core inside the iframe
  const axeResult = await runAxeInIframe(iframe);

  const passDistribution = extractPassDistribution(axeResult.passedRuleTags);
  const score = calculateScore(
    axeResult.issues,
    axeResult.passedRules,
    axeResult.incompleteRules,
    passDistribution
  );

  return {
    id: `scan-${Date.now()}-${++scanCounter}`,
    url,
    inputMethod,
    timestamp: new Date().toISOString(),
    scanDurationMs: Math.round(performance.now() - start),
    pageMeta,
    score,
    issues: axeResult.issues,
    passedRules: axeResult.passedRules,
    incompleteRules: axeResult.incompleteRules,
    inapplicableRules: axeResult.inapplicableRules,
    totalRulesRun: axeResult.totalRulesRun,
  };
}
