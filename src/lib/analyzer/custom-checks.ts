/**
 * Custom accessibility checks that axe-core does NOT cover.
 * Runs inside Puppeteer's page.evaluate() — pure DOM + getComputedStyle.
 * Returns an array of issues in a standard shape.
 */

export interface CustomIssue {
  ruleId: string;
  impact: "critical" | "serious" | "moderate" | "minor";
  help: string;
  description: string;
  tags: string[];
  nodes: { html: string; target: string }[];
}

/** This function is serialized and injected into Puppeteer — must be self-contained. */
export function runCustomChecks(): CustomIssue[] {
  const issues: CustomIssue[] = [];

  function getSelector(el: Element): string {
    if (el.id) return `#${el.id}`;
    const tag = el.tagName.toLowerCase();
    const cls = el.className && typeof el.className === "string"
      ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
      : "";
    return tag + cls;
  }

  function outerSlice(el: Element): string {
    return el.outerHTML.slice(0, 200);
  }

  // ── 1. Suspicious alt text (filenames) ──
  document.querySelectorAll("img[alt]").forEach((img) => {
    const alt = (img as HTMLImageElement).alt.trim();
    if (
      /^(IMG|DSC|DCIM|photo|image|screenshot|untitled|picture)[\s_-]?\d/i.test(alt) ||
      /\.(jpe?g|png|gif|svg|webp|bmp|tiff?)$/i.test(alt) ||
      /^[a-f0-9]{16,}$/i.test(alt)
    ) {
      issues.push({
        ruleId: "alt-suspicious-filename",
        impact: "serious",
        help: "Image alt text appears to be a filename",
        description: `Alt text "${alt.slice(0, 60)}" looks like a filename, not a description of the image.`,
        tags: ["wcag2a", "wcag111", "cat.text-alternatives"],
        nodes: [{ html: outerSlice(img), target: getSelector(img) }],
      });
    }
  });

  // ── 2. Long alt text ──
  document.querySelectorAll("img[alt]").forEach((img) => {
    const alt = (img as HTMLImageElement).alt;
    if (alt.length > 125) {
      issues.push({
        ruleId: "alt-too-long",
        impact: "moderate",
        help: "Image alt text is too long (>125 characters)",
        description: `Alt text is ${alt.length} characters. Consider using aria-describedby for detailed descriptions.`,
        tags: ["best-practice", "cat.text-alternatives"],
        nodes: [{ html: outerSlice(img), target: getSelector(img) }],
      });
    }
  });

  // ── 3. Redundant alt text prefixes ──
  const redundantPrefix = /^(image|img|photo|picture|graphic|icon|logo|banner|illustration|figure)\s+(of|:|–|\s)/i;
  document.querySelectorAll("img[alt]").forEach((img) => {
    const alt = (img as HTMLImageElement).alt.trim();
    if (redundantPrefix.test(alt)) {
      issues.push({
        ruleId: "alt-redundant-prefix",
        impact: "minor",
        help: 'Alt text starts with redundant "image of" prefix',
        description: "Screen readers already announce this is an image. Remove the prefix.",
        tags: ["best-practice", "cat.text-alternatives"],
        nodes: [{ html: outerSlice(img), target: getSelector(img) }],
      });
    }
  });

  // ── 4. Generic/suspicious link text ──
  const genericTexts = new Set(["click here", "here", "read more", "learn more", "more", "link", "this", "click", "go", "details", "continue", "info", "more info", "see more", "view more", "view", "open", "next", "previous", "back", "expand", "collapse", "start", "submit", "download", "press here", "click this", "tap here", "see details", "full story", "read on"]);
  document.querySelectorAll("a").forEach((a) => {
    const text = (a.textContent || "").trim().toLowerCase();
    if (genericTexts.has(text)) {
      issues.push({
        ruleId: "link-text-generic",
        impact: "serious",
        help: `Link text "${text}" is not descriptive`,
        description: "Link purpose should be determinable from the link text alone (WCAG 2.4.4).",
        tags: ["wcag2a", "wcag244", "cat.name-role-value"],
        nodes: [{ html: outerSlice(a), target: getSelector(a) }],
      });
    }
  });

  // ── 5. Missing skip navigation ──
  const firstFocusable = document.querySelectorAll("a[href], button, input, select, textarea, [tabindex]");
  const first8 = Array.from(firstFocusable).slice(0, 8);
  const hasSkip = first8.some((el) => {
    const href = el.getAttribute("href") || "";
    const text = (el.textContent || "").toLowerCase();
    const cls = (el.className && typeof el.className === "string") ? el.className.toLowerCase() : "";
    return (href.startsWith("#") && (text.includes("skip") || text.includes("main content") || text.includes("jump") || text.includes("navigation")))
      || cls.includes("skip") || cls.includes("sr-only");
  });
  if (!hasSkip && document.body.innerHTML.length > 1000) {
    issues.push({
      ruleId: "skip-link-missing",
      impact: "serious",
      help: "Page is missing a skip navigation link",
      description: "Add a skip link as the first focusable element to let keyboard users bypass repeated content (WCAG 2.4.1).",
      tags: ["wcag2a", "wcag241", "cat.keyboard"],
      nodes: [{ html: "<body>", target: "body" }],
    });
  }

  // ── 6. Heading hierarchy gaps ──
  const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6"));
  for (let i = 1; i < headings.length; i++) {
    const prev = parseInt(headings[i - 1].tagName[1]);
    const curr = parseInt(headings[i].tagName[1]);
    if (curr > prev + 1) {
      issues.push({
        ruleId: "heading-skip-level",
        impact: "moderate",
        help: `Heading level skipped from h${prev} to h${curr}`,
        description: "Heading levels should increase by one. Skipping levels confuses screen reader navigation.",
        tags: ["wcag2a", "wcag131", "cat.semantics"],
        nodes: [{ html: outerSlice(headings[i]), target: getSelector(headings[i]) }],
      });
    }
  }

  // ── 7. Multiple h1 elements ──
  const h1s = document.querySelectorAll("h1");
  if (h1s.length > 1) {
    issues.push({
      ruleId: "multiple-h1",
      impact: "moderate",
      help: `Page has ${h1s.length} h1 elements (should have one)`,
      description: "Multiple h1 elements confuse screen reader users about the page structure.",
      tags: ["best-practice", "cat.semantics"],
      nodes: Array.from(h1s).map((h) => ({ html: outerSlice(h), target: getSelector(h) })),
    });
  }

  // ── 8. No headings at all ──
  if (headings.length === 0 && document.body.textContent && document.body.textContent.trim().length > 500) {
    issues.push({
      ruleId: "no-headings",
      impact: "serious",
      help: "Page has no heading elements",
      description: "Screen reader users rely on headings to navigate content. Add heading structure.",
      tags: ["wcag2a", "wcag131", "cat.semantics"],
      nodes: [{ html: "<body>", target: "body" }],
    });
  }

  // ── 9. Small text ──
  const smallTextNodes: { html: string; target: string }[] = [];
  document.querySelectorAll("p, span, li, td, th, label, a, div").forEach((el) => {
    const style = getComputedStyle(el);
    const size = parseFloat(style.fontSize);
    if (size < 12 && el.textContent && el.textContent.trim().length > 0 && style.display !== "none" && style.visibility !== "hidden") {
      if (smallTextNodes.length < 5) smallTextNodes.push({ html: outerSlice(el), target: getSelector(el) });
    }
  });
  if (smallTextNodes.length > 0) {
    issues.push({
      ruleId: "text-too-small",
      impact: "moderate",
      help: `${smallTextNodes.length} element(s) have text smaller than 12px`,
      description: "Very small text is difficult to read for users with low vision (WCAG 1.4.4).",
      tags: ["wcag2aa", "wcag144", "cat.sensory-and-visual-cues"],
      nodes: smallTextNodes,
    });
  }

  // ── 10. Tight line height ──
  const tightLines: { html: string; target: string }[] = [];
  document.querySelectorAll("p, li, td, dd, blockquote").forEach((el) => {
    const style = getComputedStyle(el);
    const lineHeight = style.lineHeight;
    const fontSize = parseFloat(style.fontSize);
    if (lineHeight !== "normal" && fontSize > 0) {
      const ratio = parseFloat(lineHeight) / fontSize;
      if (ratio < 1.5 && ratio > 0 && el.textContent && el.textContent.trim().length > 20) {
        if (tightLines.length < 5) tightLines.push({ html: outerSlice(el), target: getSelector(el) });
      }
    }
  });
  if (tightLines.length > 0) {
    issues.push({
      ruleId: "line-height-too-tight",
      impact: "moderate",
      help: `${tightLines.length} element(s) have line-height less than 1.5`,
      description: "Tight line spacing impairs readability, especially for users with cognitive disabilities (WCAG 1.4.12).",
      tags: ["wcag2aa", "wcag1412", "cat.sensory-and-visual-cues"],
      nodes: tightLines,
    });
  }

  // ── 11. Viewport zoom disabled ──
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    const content = viewport.getAttribute("content") || "";
    const noScale = /user-scalable\s*=\s*no/i.test(content);
    const maxMatch = content.match(/maximum-scale\s*=\s*([\d.]+)/i);
    const maxScale = maxMatch ? parseFloat(maxMatch[1]) : null;
    if (noScale || (maxScale !== null && maxScale < 2)) {
      issues.push({
        ruleId: "viewport-zoom-disabled",
        impact: "critical",
        help: "Viewport prevents user from zooming",
        description: "user-scalable=no or maximum-scale<2 prevents users from zooming to 200% (WCAG 1.4.4).",
        tags: ["wcag2aa", "wcag144", "cat.sensory-and-visual-cues"],
        nodes: [{ html: outerSlice(viewport), target: 'meta[name="viewport"]' }],
      });
    }
  }

  // ── 12. Auto-playing media ──
  document.querySelectorAll("video[autoplay], audio[autoplay]").forEach((el) => {
    if (!(el as HTMLMediaElement).muted) {
      issues.push({
        ruleId: "autoplay-media",
        impact: "serious",
        help: "Media auto-plays without being muted",
        description: "Auto-playing audio disorients users and interferes with screen readers (WCAG 1.4.2).",
        tags: ["wcag2a", "wcag142", "cat.time-and-media"],
        nodes: [{ html: outerSlice(el), target: getSelector(el) }],
      });
    }
  });

  // ── 13. Deprecated HTML elements ──
  const deprecated = document.querySelectorAll("font, center, big, strike, tt, applet, basefont, marquee, blink, frameset, frame");
  if (deprecated.length > 0) {
    issues.push({
      ruleId: "deprecated-html",
      impact: "moderate",
      help: `${deprecated.length} deprecated HTML element(s) found`,
      description: "Deprecated elements may not be accessible. Use modern CSS and semantic HTML instead.",
      tags: ["wcag2a", "wcag411", "cat.parsing"],
      nodes: Array.from(deprecated).slice(0, 5).map((el) => ({ html: outerSlice(el), target: getSelector(el) })),
    });
  }

  // ── 14. Broken ARIA references ──
  const ariaRefAttrs = ["aria-labelledby", "aria-describedby", "aria-controls", "aria-owns", "aria-flowto", "aria-activedescendant", "aria-errormessage"];
  const brokenRefs: { html: string; target: string }[] = [];
  ariaRefAttrs.forEach((attr) => {
    document.querySelectorAll(`[${attr}]`).forEach((el) => {
      const ids = (el.getAttribute(attr) || "").split(/\s+/);
      ids.forEach((id) => {
        if (id && !document.getElementById(id)) {
          if (brokenRefs.length < 5) brokenRefs.push({ html: outerSlice(el), target: getSelector(el) });
        }
      });
    });
  });
  if (brokenRefs.length > 0) {
    issues.push({
      ruleId: "aria-reference-broken",
      impact: "serious",
      help: `${brokenRefs.length} broken ARIA ID reference(s) found`,
      description: "ARIA attributes reference IDs that don't exist on the page. Screen readers get no information.",
      tags: ["wcag2a", "wcag412", "cat.aria"],
      nodes: brokenRefs,
    });
  }

  // ── 15. Positive tabindex ──
  const posTabindex: { html: string; target: string }[] = [];
  document.querySelectorAll("[tabindex]").forEach((el) => {
    const val = parseInt(el.getAttribute("tabindex") || "0");
    if (val > 0) posTabindex.push({ html: outerSlice(el), target: getSelector(el) });
  });
  if (posTabindex.length > 0) {
    issues.push({
      ruleId: "tabindex-positive",
      impact: "serious",
      help: `${posTabindex.length} element(s) have positive tabindex values`,
      description: "Positive tabindex creates unpredictable tab order. Use tabindex=0 or -1 instead (WCAG 2.4.3).",
      tags: ["wcag2a", "wcag243", "cat.keyboard"],
      nodes: posTabindex.slice(0, 5),
    });
  }

  // ── 16. Redundant title attributes ──
  const redundantTitles: { html: string; target: string }[] = [];
  document.querySelectorAll("[title]").forEach((el) => {
    const title = (el.getAttribute("title") || "").trim().toLowerCase();
    const text = (el.textContent || "").trim().toLowerCase();
    const ariaLabel = (el.getAttribute("aria-label") || "").trim().toLowerCase();
    if (title && (title === text || title === ariaLabel)) {
      if (redundantTitles.length < 5) redundantTitles.push({ html: outerSlice(el), target: getSelector(el) });
    }
  });
  if (redundantTitles.length > 0) {
    issues.push({
      ruleId: "title-redundant",
      impact: "minor",
      help: `${redundantTitles.length} element(s) have title attributes duplicating their text`,
      description: "Redundant title attributes cause screen readers to announce the text twice.",
      tags: ["best-practice", "cat.semantics"],
      nodes: redundantTitles,
    });
  }

  // ── 17. Justified text ──
  const justified: { html: string; target: string }[] = [];
  document.querySelectorAll("p, li, td, div, blockquote").forEach((el) => {
    if (getComputedStyle(el).textAlign === "justify" && el.textContent && el.textContent.trim().length > 50) {
      if (justified.length < 5) justified.push({ html: outerSlice(el), target: getSelector(el) });
    }
  });
  if (justified.length > 0) {
    issues.push({
      ruleId: "text-justified",
      impact: "minor",
      help: `${justified.length} element(s) use justified text alignment`,
      description: "Justified text creates uneven word spacing that impairs readability for dyslexic users.",
      tags: ["wcag2aaa", "wcag148", "cat.sensory-and-visual-cues"],
      nodes: justified,
    });
  }

  // ── 18. Links to documents without type warning ──
  const docPattern = /\.(pdf|docx?|xlsx?|pptx?|csv|rtf)(\?.*)?$/i;
  const undeclaredDocs: { html: string; target: string }[] = [];
  document.querySelectorAll("a[href]").forEach((a) => {
    const href = (a as HTMLAnchorElement).href;
    if (docPattern.test(href)) {
      const text = ((a.textContent || "") + " " + (a.getAttribute("aria-label") || "")).toLowerCase();
      if (!text.includes("pdf") && !text.includes("word") && !text.includes("excel") && !text.includes("download") && !text.includes("document")) {
        if (undeclaredDocs.length < 5) undeclaredDocs.push({ html: outerSlice(a), target: getSelector(a) });
      }
    }
  });
  if (undeclaredDocs.length > 0) {
    issues.push({
      ruleId: "link-document-no-warning",
      impact: "minor",
      help: `${undeclaredDocs.length} link(s) to documents without file type indication`,
      description: "Links to PDFs and other documents should indicate the file type so users know what to expect.",
      tags: ["best-practice", "cat.name-role-value"],
      nodes: undeclaredDocs,
    });
  }

  // ── 19. Missing main landmark ──
  const hasMain = !!document.querySelector('main, [role="main"]');
  if (!hasMain && document.body.innerHTML.length > 500) {
    issues.push({
      ruleId: "landmark-main-missing",
      impact: "moderate",
      help: "Page is missing a <main> landmark",
      description: "A <main> landmark helps screen reader users navigate to primary content (WCAG 1.3.1).",
      tags: ["wcag2a", "wcag131", "cat.structure"],
      nodes: [{ html: "<body>", target: "body" }],
    });
  }

  // ── 20. Missing nav landmark ──
  const hasNav = !!document.querySelector('nav, [role="navigation"]');
  const linkCount = document.querySelectorAll("a[href]").length;
  if (!hasNav && linkCount > 10) {
    issues.push({
      ruleId: "landmark-nav-missing",
      impact: "moderate",
      help: "Page has many links but no <nav> landmark",
      description: "Navigation regions should be wrapped in <nav> elements (WCAG 1.3.1).",
      tags: ["wcag2a", "wcag131", "cat.structure"],
      nodes: [{ html: "<body>", target: "body" }],
    });
  }

  return issues;
}
