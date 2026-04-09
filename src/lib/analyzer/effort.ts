export type EffortLevel = "quick-fix" | "medium" | "refactor";

export interface EffortInfo {
  level: EffortLevel;
  label: string;
  color: string;
  bg: string;
  estimate: string;
}

const EFFORT_MAP: Record<string, EffortLevel> = {
  // Quick fixes — simple attribute additions
  "image-alt": "quick-fix",
  "input-image-alt": "quick-fix",
  "area-alt": "quick-fix",
  "object-alt": "quick-fix",
  "svg-img-alt": "quick-fix",
  "role-img-alt": "quick-fix",
  "html-has-lang": "quick-fix",
  "html-lang-valid": "quick-fix",
  "valid-lang": "quick-fix",
  "document-title": "quick-fix",
  "meta-viewport": "quick-fix",
  "meta-refresh": "quick-fix",
  "button-name": "quick-fix",
  "link-name": "quick-fix",
  "label": "quick-fix",
  "select-name": "quick-fix",
  "input-button-name": "quick-fix",
  "frame-title": "quick-fix",
  "frame-title-unique": "quick-fix",
  "video-caption": "quick-fix",
  "audio-caption": "quick-fix",
  "scope-attr-valid": "quick-fix",
  "tabindex": "quick-fix",
  "autocomplete-valid": "quick-fix",
  "aria-required-attr": "quick-fix",
  "aria-valid-attr": "quick-fix",
  "aria-valid-attr-value": "quick-fix",
  "duplicate-id": "quick-fix",
  "duplicate-id-aria": "quick-fix",
  "duplicate-id-active": "quick-fix",
  "table-duplicate-name": "quick-fix",
  "td-has-header": "quick-fix",
  "th-has-data-cells": "quick-fix",

  // Medium effort — structural/styling changes
  "color-contrast": "medium",
  "link-in-text-block": "medium",
  "heading-order": "medium",
  "empty-heading": "medium",
  "p-as-heading": "medium",
  "list": "medium",
  "listitem": "medium",
  "dlitem": "medium",
  "definition-list": "medium",
  "aria-allowed-attr": "medium",
  "aria-roles": "medium",
  "aria-allowed-role": "medium",
  "aria-hidden-focus": "medium",
  "aria-hidden-body": "medium",
  "aria-required-children": "medium",
  "aria-required-parent": "medium",
  "landmark-one-main": "medium",
  "landmark-banner-is-top-level": "medium",
  "landmark-contentinfo-is-top-level": "medium",
  "landmark-main-is-top-level": "medium",
  "landmark-no-duplicate-banner": "medium",
  "landmark-no-duplicate-contentinfo": "medium",
  "landmark-no-duplicate-main": "medium",
  "landmark-unique": "medium",
  "region": "medium",
  "target-size": "medium",
  "image-redundant-alt": "medium",
  "form-field-multiple-labels": "medium",
  "avoid-inline-spacing": "medium",

  // Refactor — significant code changes
  "bypass": "refactor",
  "skip-link": "refactor",
  "scrollable-region-focusable": "refactor",
  "nested-interactive": "refactor",
  "no-autoplay-audio": "refactor",
  "blink": "refactor",
  "marquee": "refactor",
  "focus-order-semantics": "refactor",

  // Custom checks from custom-checks.ts
  "alt-suspicious-filename": "quick-fix",
  "alt-too-long": "quick-fix",
  "alt-redundant-prefix": "quick-fix",
  "link-text-generic": "medium",
  "skip-link-missing": "refactor",
  "heading-skip-level": "medium",
  "multiple-h1": "medium",
  "no-headings": "refactor",
  "text-too-small": "medium",
  "line-height-too-tight": "medium",
  "viewport-zoom-disabled": "quick-fix",
  "autoplay-media": "quick-fix",
  "deprecated-html": "medium",
  "aria-reference-broken": "medium",
  "tabindex-positive": "quick-fix",
  "title-redundant": "quick-fix",
  "text-justified": "quick-fix",
  "link-document-no-warning": "quick-fix",
  "landmark-main-missing": "medium",
  "landmark-nav-missing": "medium",
};

const EFFORT_INFO: Record<EffortLevel, EffortInfo> = {
  "quick-fix": {
    level: "quick-fix",
    label: "Quick Fix",
    color: "var(--pass)",
    bg: "var(--pass-bg)",
    estimate: "< 5 min",
  },
  medium: {
    level: "medium",
    label: "Medium Effort",
    color: "var(--severity-minor)",
    bg: "var(--severity-minor-bg)",
    estimate: "15-60 min",
  },
  refactor: {
    level: "refactor",
    label: "Requires Refactor",
    color: "var(--severity-major)",
    bg: "var(--severity-major-bg)",
    estimate: "1-4 hours",
  },
};

export function getEffort(ruleId: string): EffortInfo {
  const level = EFFORT_MAP[ruleId] ?? "medium";
  return EFFORT_INFO[level];
}
