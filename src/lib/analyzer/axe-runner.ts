import type { AccessibilityIssue, Severity } from "@/lib/types/issue";
import type { PageMeta } from "@/lib/types/scan-result";
import { getApplicableFrameworks } from "@/lib/compliance/mapper";
import { extractWcagCriterion } from "./wcag-data";

function mapSeverity(impact: string | null | undefined): Severity {
  switch (impact) {
    case "critical": return "critical";
    case "serious": return "major";
    case "moderate": return "minor";
    case "minor": return "best-practice";
    default: return "minor";
  }
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

// Raw axe result shape (serializable subset — what we get back from the iframe)
interface RawAxeNode {
  html: string;
  target: string[];
  failureSummary?: string;
}

interface RawAxeResult {
  id: string;
  impact?: string;
  tags: string[];
  description: string;
  help: string;
  helpUrl: string;
  nodes: RawAxeNode[];
}

interface RawAxeResults {
  violations: RawAxeResult[];
  passes: RawAxeResult[];
  incomplete: RawAxeResult[];
  inapplicable: RawAxeResult[];
}

function axeResultToIssues(violations: RawAxeResult[]): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  for (const violation of violations) {
    for (const node of violation.nodes) {
      issues.push({
        id: `${violation.id}-${issues.length}`,
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
  return issues;
}

export interface AxeRunResult {
  issues: AccessibilityIssue[];
  passedRules: number;
  passedRuleTags: string[][];
  incompleteRules: number;
  inapplicableRules: number;
  totalRulesRun: number;
}

/**
 * Runs axe-core INSIDE an iframe by injecting the axe-core script into it.
 * This is necessary because axe.run() must execute in the same window context
 * as the document it's analyzing.
 */
export async function runAxeInIframe(iframe: HTMLIFrameElement): Promise<AxeRunResult> {
  const iframeWin = iframe.contentWindow;
  if (!iframeWin) throw new Error("Cannot access iframe window");

  // Inject axe-core into the iframe using an absolute URL to OUR origin.
  // The iframe may have a <base href> pointing to the scanned site's domain,
  // so relative paths like "/axe-core/axe.min.js" would resolve there instead.
  const axeScript = iframeWin.document.createElement("script");
  axeScript.src = `${window.location.origin}/axe-core/axe.min.js`;

  await new Promise<void>((resolve, reject) => {
    axeScript.onload = () => resolve();
    axeScript.onerror = () => reject(new Error("Failed to load axe-core in iframe"));
    iframeWin.document.head.appendChild(axeScript);
  });

  // Run axe inside the iframe via an injected inline script that writes results
  // to a global variable, which we then read from the parent.
  const results = await new Promise<RawAxeResults>((resolve, reject) => {
    const resultKey = `__axeResult_${Date.now()}`;
    const errorKey = `__axeError_${Date.now()}`;

    // Poll for the result
    const poll = setInterval(() => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const win = iframeWin as any;
        if (win[resultKey]) {
          clearInterval(poll);
          clearTimeout(timeout);
          resolve(win[resultKey]);
        }
        if (win[errorKey]) {
          clearInterval(poll);
          clearTimeout(timeout);
          reject(new Error(win[errorKey]));
        }
      } catch {
        // iframe may not be accessible yet
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(poll);
      reject(new Error("axe-core timed out after 30 seconds"));
    }, 30000);

    // Inject a script that runs axe and stores the result
    const runScript = iframeWin.document.createElement("script");
    runScript.textContent = `
      (function() {
        window.axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa","best-practice"] },
          resultTypes: ["violations","passes","incomplete","inapplicable"]
        }).then(function(r) {
          function mapNodes(nodes) {
            return nodes.map(function(n) { return { html: n.html, target: n.target, failureSummary: n.failureSummary }; });
          }
          function mapRule(v, includeNodes) {
            return { id: v.id, impact: v.impact, tags: v.tags, description: v.description, help: v.help, helpUrl: v.helpUrl, nodes: includeNodes ? mapNodes(v.nodes) : [] };
          }
          window["${resultKey}"] = {
            violations: r.violations.map(function(v) { return mapRule(v, true); }),
            passes: r.passes.map(function(v) { return mapRule(v, false); }),
            incomplete: r.incomplete.map(function(v) { return mapRule(v, true); }),
            inapplicable: r.inapplicable.map(function(v) { return mapRule(v, false); })
          };
        }).catch(function(e) {
          window["${errorKey}"] = e.message || "axe-core failed";
        });
      })();
    `;
    iframeWin.document.body.appendChild(runScript);
  });

  const issues = axeResultToIssues(results.violations);

  return {
    issues,
    passedRules: results.passes.length,
    passedRuleTags: results.passes.map((p) => p.tags),
    incompleteRules: results.incomplete.length,
    inapplicableRules: results.inapplicable.length,
    totalRulesRun: results.violations.length + results.passes.length + results.incomplete.length + results.inapplicable.length,
  };
}

export function extractPageMeta(doc: Document, url: string): PageMeta {
  const imgs = doc.querySelectorAll("img");
  const imgsNoAlt = Array.from(imgs).filter((img) => !img.hasAttribute("alt") || img.alt.trim() === "");
  return {
    url,
    title: doc.title || "(no title)",
    lang: doc.documentElement.lang || "(not set)",
    hasH1: !!doc.querySelector("h1"),
    hasSkipLink: !!doc.querySelector('a[href^="#main"], a[href^="#content"], a.skip-link, [class*="skip"]'),
    hasAccessibilityStatement: !!doc.querySelector('a[href*="accessibility"], a[href*="a11y"]'),
    imageCount: imgs.length,
    imagesWithoutAlt: imgsNoAlt.length,
    linkCount: doc.querySelectorAll("a[href]").length,
    headingCount: doc.querySelectorAll("h1, h2, h3, h4, h5, h6").length,
    formCount: doc.querySelectorAll("form").length,
  };
}
