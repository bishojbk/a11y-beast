import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/ui/Header";
import JsonLd from "@/components/JsonLd";
import { organizationLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why A11y Beast exists, how it works, and what it deliberately won't claim. Real-browser scanning, 125+ checks benchmarked against axe-core, Lighthouse and Pa11y, mapped to 16 legal frameworks — an honest automated indicator, never a compliance guarantee.",
  alternates: { canonical: "/about" },
};

// Reusable bits — match the forensic-editorial system used across the app.
const kicker: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--text-tertiary)",
};
const h2: React.CSSProperties = {
  fontSize: "clamp(22px, 3vw, 30px)",
  lineHeight: 1.15,
  marginTop: 56,
  marginBottom: 16,
};
const body: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: 16,
  lineHeight: 1.65,
  marginBottom: 16,
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={organizationLd} />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main
        id="main-content"
        role="main"
        style={{ flex: 1, maxWidth: 760, margin: "0 auto", padding: "64px 24px 96px", width: "100%" }}
      >
        <div style={{ ...kicker, marginBottom: 12 }}>About · forensic accessibility</div>
        <h1
          className="font-display"
          style={{ fontSize: "clamp(34px, 5vw, 52px)", lineHeight: 1.05, marginBottom: 20 }}
        >
          We tell you which laws you&rsquo;re{" "}
          <span style={{ fontStyle: "italic", color: "var(--accent-text)" }}>actually</span> exposed under.
        </h1>
        <p style={{ ...body, fontSize: 18 }}>
          A11y Beast is a forensic web-accessibility scanner. Most tools hand you a list of WCAG
          violations and stop there. We render your real page in a browser, run 125+ checks, and map
          every finding to the <strong>16 legal frameworks</strong> it implicates — ADA, the European
          Accessibility Act, Section 508, California&rsquo;s Unruh Act and more — with the code to fix
          each issue. One scan, sixteen verdicts.
        </p>

        <h2 className="font-display" style={h2}>How it actually works</h2>
        <p style={body}>
          Every scan runs in a real Chromium browser via Puppeteer, so we see what users see —
          single-page apps, JS-gated content, computed styles, the role tree and focus order — not a
          static-HTML approximation. We run <strong>axe-core&rsquo;s 105 rules plus 20 custom checks</strong>{" "}
          axe-core doesn&rsquo;t catch (heading gaps, suspiciously generic alt text, small text,
          zoom-lock and more), then score each finding against each jurisdiction&rsquo;s WCAG scope,
          severity, and deadline exposure.
        </p>
        <p style={body}>
          We&rsquo;ve benchmarked the engine against <strong>axe-core, Lighthouse and Pa11y</strong> and
          aligned the methodology with the W3C&rsquo;s{" "}
          <a
            href="https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent-text)" }}
          >
            Website Accessibility Conformance Evaluation Methodology (WCAG-EM)
          </a>
          . When we report coverage per framework, it&rsquo;s a real denominator of the criteria that
          actually apply to that law and version — Section 508 maps to WCAG 2.0 AA, the EAA to 2.1 AA —
          not an arbitrary score.
        </p>

        <h2 className="font-display" style={h2}>What we won&rsquo;t claim</h2>
        <p style={body}>
          We will never tell you your site is &ldquo;ADA compliant&rdquo; or &ldquo;WCAG compliant,&rdquo;
          and you should be wary of any tool that does. Automated testing can only evaluate{" "}
          <strong>~30&ndash;40% of WCAG success criteria</strong>; full conformance is a binary,
          per-criterion judgment that requires manual review. So everything we report is an{" "}
          <em>automated indicator mapped to legal risk</em>, not a conformance verdict. In 2025 the FTC
          fined an accessibility-overlay vendor <strong>$1M</strong> for making exactly the kind of
          guarantee we refuse to make.
        </p>

        <h2 className="font-display" style={h2}>Not an overlay. On purpose.</h2>
        <p style={body}>
          A11y Beast does not inject a widget that claims to &ldquo;fix&rdquo; your site. Overlays
          don&rsquo;t stop lawsuits — over a thousand sites running one were still sued in 2025. We find
          the real issues, tell you which laws each one implicates, and give you the code to fix them in
          your own source. That&rsquo;s the whole product.
        </p>

        <h2 className="font-display" style={h2}>Who&rsquo;s behind it</h2>
        <p style={body}>
          A11y Beast is built and maintained by <strong>EJR</strong>, an independent developer. It
          started as a tool to answer a question no free scanner would: not just &ldquo;what&rsquo;s
          broken,&rdquo; but &ldquo;which laws does this expose me to, and how do I fix it?&rdquo; The
          engine, the 16-framework legal mapping, and the CLI are all built in the open —{" "}
          <a
            href="https://github.com/bishojbk"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent-text)" }}
          >
            github.com/bishojbk
          </a>
          .
        </p>

        <div
          style={{
            marginTop: 56,
            paddingTop: 32,
            borderTop: "1px solid var(--border-faint)",
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <Link href="/" className="scan-btn" style={{ display: "inline-flex", alignItems: "center", height: 44, padding: "0 22px", borderRadius: 6, fontSize: 14, fontWeight: 600 }}>
            Scan your site
          </Link>
          <Link
            href="/pricing"
            style={{ display: "inline-flex", alignItems: "center", height: 44, padding: "0 22px", borderRadius: 6, fontSize: 14, fontWeight: 600, border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
          >
            See pricing
          </Link>
        </div>
      </main>
    </>
  );
}
