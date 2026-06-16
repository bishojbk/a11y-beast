import type { Metadata } from "next";
import Header from "@/components/ui/Header";
import PricingTable from "@/components/PricingTable";
import PricingComparison from "@/components/PricingComparison";
import PricingFaq from "@/components/PricingFaq";
import JsonLd from "@/components/JsonLd";
import { buildFaqPageLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  // Title only — the root layout's template ("%s — A11y Beast") adds the brand
  // suffix. Setting the full title here produced "Pricing — A11y Beast — A11y Beast".
  title: "Pricing",
  description:
    "Free forensic accessibility scanning with 16-framework legal mapping. Pro and Agency tiers add site crawls, legal report exports, and bulk scanning. Not an overlay.",
  // Self-canonical — without this the page inherits the layout's canonical "/",
  // telling Google /pricing is a duplicate of the homepage.
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <JsonLd data={buildFaqPageLd()} />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main id="main-content" role="main" style={{ flex: 1, maxWidth: 1180, margin: "0 auto", padding: "64px 24px 96px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
            Pricing · forensic accessibility
          </div>
        </div>
        <h1 className="font-display" style={{ fontSize: "clamp(34px, 5vw, 56px)", textAlign: "center", lineHeight: 1.05, marginBottom: 16 }}>
          Start free. Pay when you<br />need it across your <span style={{ fontStyle: "italic", color: "var(--accent-text)" }}>whole site</span>.
        </h1>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", maxWidth: "62ch", margin: "0 auto 48px", fontSize: 17, lineHeight: 1.5 }}>
          Scanning a page and mapping it to 16 laws is free, forever. We don&rsquo;t sell an overlay widget — we show
          you exactly which laws you&rsquo;re exposed under and the code to fix each issue. Paid tiers add crawls, bulk
          scanning, and reports your legal team will accept.
        </p>

        <PricingTable />

        <PricingComparison />

        <PricingFaq />

        <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: 12.5, marginTop: 72, lineHeight: 1.6, maxWidth: "70ch", marginInline: "auto" }}>
          <b style={{ color: "var(--text-primary)" }}>On the roadmap:</b>{" "}
          scheduled monitoring &amp; regression alerts,
          white-label reports, and a public API — rolling out to paid tiers. Founding members keep their price as these land.
        </p>

        <p style={{ textAlign: "center", color: "var(--text-tertiary)", fontSize: 12.5, marginTop: 20, lineHeight: 1.6, maxWidth: "70ch", marginInline: "auto" }}>
          A11y Beast reports automated indicators, not a conformance verdict — automated testing covers ~30–40% of
          WCAG criteria, and full conformance needs manual review. Not legal advice.
        </p>
      </main>
    </>
  );
}
