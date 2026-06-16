import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/ui/Header";
import StatementGenerator from "@/components/StatementGenerator";

export const metadata: Metadata = {
  title: "Free Accessibility Statement Generator",
  description:
    "Generate a free accessibility statement for your website in seconds. Based on the W3C/WAI structure — conformance status, feedback contact, known limitations, and assessment approach. Honest by default.",
  alternates: { canonical: "/accessibility-statement-generator" },
};

export default function StatementGeneratorPage() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main
        id="main-content"
        className="page-enter"
        role="main"
        style={{ flex: 1, maxWidth: 1080, margin: "0 auto", padding: "56px 24px 96px", width: "100%" }}
      >
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 12 }}>
          Free tool
        </div>
        <h1 className="font-display" style={{ fontSize: "clamp(30px, 4.5vw, 48px)", lineHeight: 1.05, marginBottom: 16 }}>
          Accessibility statement generator
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 17, lineHeight: 1.6, maxWidth: "64ch", marginBottom: 40 }}>
          Fill in the details and copy a ready-to-use accessibility statement, structured the way the{" "}
          <a href="https://www.w3.org/WAI/planning/statements/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-text)" }}>W3C</a>{" "}
          recommends. Free, no signup — it runs entirely in your browser. We default to{" "}
          <em>partially conformant</em> on purpose: a statement should be honest about what you can prove.
        </p>

        <StatementGenerator />

        <div style={{ marginTop: 56, paddingTop: 32, borderTop: "1px solid var(--border-faint)" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6, marginBottom: 16, maxWidth: "64ch" }}>
            A statement says you care — it doesn&rsquo;t make your site accessible. To know your actual
            conformance status (and which laws each issue implicates) before you publish one:
          </p>
          <Link href="/" className="scan-btn" style={{ display: "inline-flex", alignItems: "center", height: 44, padding: "0 22px", borderRadius: 6, fontSize: 14, fontWeight: 600 }}>
            Scan your site free
          </Link>
        </div>
      </main>
    </>
  );
}
