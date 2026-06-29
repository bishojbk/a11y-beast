import type { Metadata } from "next";
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
      <main id="main-content" className="stagger-in"role="main" style={{ flex: 1, maxWidth: 1180, margin: "0 auto", padding: "64px 24px 96px", width: "100%" }}>
        <div className="doc-eyebrow" style={{ justifyContent: "center" }}>
          Pricing · forensic accessibility
        </div>
        <h1 className="doc-title" style={{ textAlign: "center", marginBottom: 16 }}>
          Start free. Pay when you
          <br />
          need it across your <span className="ember" style={{ fontStyle: "italic" }}>whole site</span>.
        </h1>
        <p className="doc-lead" style={{ textAlign: "center", maxWidth: "62ch", margin: "0 auto 48px" }}>
          Scanning a page and mapping it to 16 laws is free, forever. We don’t sell an overlay widget — we show you
          exactly which laws you’re exposed under and the code to fix each issue. Paid tiers add crawls, bulk scanning,
          and reports your legal team will accept.
        </p>

        <PricingTable />

        <PricingComparison />

        <PricingFaq />

        <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: 12.5, marginTop: 72, lineHeight: 1.6, maxWidth: "70ch", marginInline: "auto" }}>
          <b style={{ color: "var(--text-primary)" }}>On the roadmap:</b>{" "}
          scheduled monitoring &amp; regression alerts, document (PDF) accessibility checks,
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
