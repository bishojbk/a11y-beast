// JSON-LD structured data for search engines and AI answer engines.
// Plain objects serialized into <script type="application/ld+json"> via <JsonLd>.
// Keep the `name`/`url` consistent with layout.tsx metadata so the brand entity
// resolves cleanly across SEO, GEO (AI citation), and AEO (rich results).
import { PRICING_FAQ, type FaqItem } from "./faq";

export const SITE_URL = "https://accesslens-green.vercel.app";
const BRAND = "A11y Beast";

// Organization — declares the brand entity (name, logo, sameAs) so AI engines
// have something to anchor to. @id lets other nodes reference this entity.
// Maker behind the project (pseudonymous — "EJR"). Referenced as the
// Organization founder so the brand entity has a human author signal (E-E-A-T)
// without claiming a name or credentials we can't substantiate.
export const founderLd = {
  "@type": "Person",
  "@id": `${SITE_URL}/#founder`,
  name: "EJR",
  url: "https://github.com/bishojbk",
  sameAs: ["https://github.com/bishojbk"],
};

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: BRAND,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  description:
    "A11y Beast is a forensic web-accessibility scanner that maps every WCAG violation to 16 legal frameworks (ADA, EAA, Section 508, California Unruh and more).",
  founder: founderLd,
  sameAs: ["https://github.com/bishojbk"],
};

// SoftwareApplication — describes the product itself: a free, web-based
// developer/security tool. Eligible for software rich results.
export const softwareApplicationLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: BRAND,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description:
    "Free forensic accessibility scanner. 125+ checks in a real browser, every violation mapped to 16 legal frameworks — ADA, EAA, Section 508, California Unruh and more. One scan, sixteen verdicts. Not an overlay.",
  publisher: { "@id": `${SITE_URL}/#organization` },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Single-page scans with full 16-framework legal mapping, free forever — no signup.",
  },
  featureList: [
    "125+ accessibility checks (axe-core 105 rules + 20 custom checks)",
    "Maps every violation to 16 legal frameworks (ADA, EAA, Section 508, Unruh, AODA and more)",
    "Real-browser rendering via Puppeteer",
    "CLI and GitHub Action for CI",
  ],
};

// HowTo — the four-step scan pipeline ("Under the hood"). Mirrors HOW_STEPS in
// page.tsx; keep the step text in sync if that section changes.
export const howToLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How A11y Beast scans a page for accessibility legal risk",
  description:
    "How A11y Beast renders a page, runs 125+ accessibility checks, and maps every finding to 16 legal frameworks.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Fetch the page",
      text: "Puppeteer pulls a real browser render — SPAs, JS-gated content and all. SSRF-guarded, private IPs blocked.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Render the DOM",
      text: "Full document, computed styles, role tree, focus order. No static parsing shortcuts — what users actually see.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Run 125+ rules",
      text: "axe-core's 105 rules plus 20 custom checks axe-core doesn't catch: heading gaps, small text, suspicious alt, zoom-lock.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Map to 16 laws",
      text: "Every finding scored against jurisdiction WCAG scope, severity multiplier, deadline exposure. One scan, 16 verdicts.",
    },
  ],
};

// FAQPage — built from the shared PRICING_FAQ so it can't drift from the UI.
export function buildFaqPageLd(items: FaqItem[] = PRICING_FAQ) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
