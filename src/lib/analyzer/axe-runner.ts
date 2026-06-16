import type { PageMeta } from "@/lib/types/scan-result";
import { runCustomChecks, type CustomIssue } from "./custom-checks";

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
  custom: CustomIssue[];
}

export interface AxeRunResult {
  axeResults: {
    violations: RawAxeResult[];
    passes: RawAxeResult[];
    incomplete: RawAxeResult[];
    inapplicable: RawAxeResult[];
  };
  customIssues: CustomIssue[];
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

    // Inject a script that runs axe AND the custom checks in the iframe's own
    // context (so document/getComputedStyle resolve to the scanned page), then
    // stores the combined result. runCustomChecks is self-contained, so it
    // serializes cleanly via toString() — the same way Puppeteer runs it.
    const runScript = iframeWin.document.createElement("script");
    runScript.textContent = `
      (function() {
        var runCustom = ${runCustomChecks.toString()};
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
          var custom = [];
          try { custom = runCustom(); } catch (e) { custom = []; }
          window["${resultKey}"] = {
            violations: r.violations.map(function(v) { return mapRule(v, true); }),
            passes: r.passes.map(function(v) { return mapRule(v, false); }),
            incomplete: r.incomplete.map(function(v) { return mapRule(v, true); }),
            inapplicable: r.inapplicable.map(function(v) { return mapRule(v, false); }),
            custom: custom
          };
        }).catch(function(e) {
          window["${errorKey}"] = e.message || "axe-core failed";
        });
      })();
    `;
    iframeWin.document.body.appendChild(runScript);
  });

  return {
    axeResults: {
      violations: results.violations,
      passes: results.passes,
      incomplete: results.incomplete,
      inapplicable: results.inapplicable,
    },
    customIssues: results.custom ?? [],
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
