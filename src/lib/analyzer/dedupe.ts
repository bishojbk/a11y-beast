/**
 * Several custom checks overlap with native axe-core rules — they flag the same
 * underlying barrier. When the equivalent axe rule has already fired (as a
 * violation OR an incomplete/needs-review result), the custom finding is a
 * duplicate and should be dropped so it doesn't inflate failure counts or
 * double-count against legal frameworks.
 *
 * Each custom ruleId maps to the axe rule ids that make it redundant.
 */
export const CUSTOM_AXE_OVERLAP: Record<string, string[]> = {
  // "Bypass blocks" (WCAG 2.4.1) is axe `bypass`; our skip-link heuristic is the same concern.
  "skip-link-missing": ["bypass"],
  // axe `landmark-one-main` already requires a main landmark.
  "landmark-main-missing": ["landmark-one-main"],
  // axe `page-has-heading-one` / `empty-heading` cover heading presence.
  "no-headings": ["page-has-heading-one", "empty-heading"],
  // axe `heading-order` covers skipped heading levels.
  "heading-skip-level": ["heading-order"],
  // axe `tabindex` flags positive tabindex.
  "tabindex-positive": ["tabindex"],
  // axe `meta-viewport` flags user-scalable=no / maximum-scale<2.
  "viewport-zoom-disabled": ["meta-viewport"],
  // axe `aria-valid-attr-value` flags broken aria id references.
  "aria-reference-broken": ["aria-valid-attr-value"],
};

export interface MinimalCustomIssue {
  ruleId: string;
}

/**
 * Drop custom issues whose equivalent axe rule already appears in the scan
 * (violations + incomplete). Returns a new array; order preserved.
 */
export function filterRedundantCustomIssues<T extends MinimalCustomIssue>(
  customIssues: T[],
  axeRuleIdsPresent: Set<string>
): T[] {
  return customIssues.filter((issue) => {
    const overlaps = CUSTOM_AXE_OVERLAP[issue.ruleId];
    if (!overlaps) return true;
    return !overlaps.some((axeId) => axeRuleIdsPresent.has(axeId));
  });
}
