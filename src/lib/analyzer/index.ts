import { runAxeInIframe, extractPageMeta } from "./axe-runner";
import { processServerResults } from "./process-results";
import type { ScanResult } from "@/lib/types/scan-result";

/**
 * Analyze an iframe that has HTML loaded into it. axe-core AND the 20 custom
 * checks run inside the iframe; results then flow through the SAME pipeline as
 * URL scans (processServerResults) — so paste/upload get identical handling:
 * custom checks, needs-review (axe incomplete), dedup, best-practice exclusion,
 * and per-framework denominators.
 */
export async function analyzeIframe(
  iframe: HTMLIFrameElement,
  url: string,
  inputMethod: ScanResult["inputMethod"]
): Promise<ScanResult> {
  const start = performance.now();

  const iframeDoc = iframe.contentDocument;
  if (!iframeDoc) throw new Error("Cannot access iframe document");

  // Page metadata from the iframe document (works cross-frame for same-origin).
  const pageMeta = extractPageMeta(iframeDoc, url);

  // Run axe-core + custom checks inside the iframe.
  const { axeResults, customIssues } = await runAxeInIframe(iframe);

  const result = processServerResults(
    {
      finalUrl: url,
      fetchDurationMs: Math.round(performance.now() - start),
      axeResults,
      customIssues,
      pageMeta,
    },
    url
  );
  result.inputMethod = inputMethod;
  return result;
}
