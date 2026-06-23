// Single source of truth for the pricing-page FAQ.
// Consumed by both <PricingFaq> (rendered UI) and the FAQPage JSON-LD, so the
// structured data can never drift from what users actually see. Answers are
// plain strings: schema.org acceptedAnswer.text must be plain text, and the UI
// renders them as text too.
export interface FaqItem {
  q: string;
  a: string;
}

export const PRICING_FAQ: FaqItem[] = [
  {
    q: "Is it really free?",
    a: "Yes — single-page scans with all 16-framework legal mapping are free forever, no signup. On paste or upload your HTML never leaves your browser. Paid tiers add site-wide crawls, legal-report exports, and scale.",
  },
  {
    q: "Do you guarantee my site is ADA / WCAG compliant?",
    a: "No — and be wary of any tool that does. The FTC fined an overlay vendor $1M in 2025 for exactly that claim. Automated testing covers only ~30–40% of WCAG criteria, so we report automated indicators mapped to legal risk, not a conformance verdict. Full conformance needs manual review.",
  },
  {
    q: "Isn't this just another accessibility overlay widget?",
    a: "No. We don't inject a script that claims to “fix” your site. We render your real page in a browser, find the issues, map each to the laws it implicates, and hand you the code to fix them. Overlays don't stop lawsuits — over a thousand sites running one were still sued in 2025.",
  },
  {
    q: "What does “founding price” mean?",
    a: "Join the Pro or Agency waitlist now and you lock in today's price for life. As roadmap features land — scheduled monitoring, white-label reports, the public API — your rate stays the same.",
  },
  {
    q: "Annual or monthly?",
    a: "Either. Annual billing is two months free (about 17% off) and you can switch any time.",
  },
  {
    q: "Can I run it in CI?",
    a: "Yes — the CLI and GitHub Action let you fail a build on new violations. They're included from the Pro tier up.",
  },
];
