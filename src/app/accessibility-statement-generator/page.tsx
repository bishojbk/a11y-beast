import type { Metadata } from "next";
import Link from "next/link";
import StatementGenerator from "@/components/StatementGenerator";

export const metadata: Metadata = {
  title: "Free Accessibility Statement Generator",
  description:
    "Generate a free accessibility statement for your website in seconds. Based on the W3C/WAI structure — conformance status, feedback contact, known limitations, and assessment approach. Honest by default.",
  alternates: { canonical: "/accessibility-statement-generator" },
};

export default function StatementGeneratorPage() {
  return (
      <main
        id="main-content"
        className="stagger-in"
        role="main"
        style={{ flex: 1, maxWidth: 1080, margin: "0 auto", padding: "56px 24px 96px", width: "100%" }}
      >
        <div className="doc-eyebrow">Free tool · in-browser</div>
        <h1 className="doc-title">Accessibility statement generator</h1>
        <p className="doc-lead" style={{ marginBottom: 40 }}>
          Fill in the details and copy a ready-to-use accessibility statement, structured the way the{" "}
          <a href="https://www.w3.org/WAI/planning/statements/" target="_blank" rel="noopener noreferrer">
            W3C
          </a>{" "}
          recommends. Free, no signup — it runs entirely in your browser. We default to <em>partially conformant</em> on
          purpose: a statement should be honest about what you can prove.
        </p>

        <StatementGenerator />

        <div className="cta-band" style={{ flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
          <p className="doc-p" style={{ margin: 0 }}>
            A statement says you care — it doesn’t make your site accessible. To know your actual conformance status (and
            which laws each issue implicates) before you publish one:
          </p>
          <Link href="/#scan" className="scan-btn btn-lg">
            Scan your site free
          </Link>
        </div>
      </main>
  );
}
