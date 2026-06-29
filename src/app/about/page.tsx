import type { Metadata } from "next";
import Link from "next/link";
import PageContainer from "@/components/ui/PageContainer";
import JsonLd from "@/components/JsonLd";
import { organizationLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why A11y Beast exists, how it works, and what it deliberately won't claim. Real-browser scanning, 110+ checks benchmarked against axe-core, Lighthouse and Pa11y, mapped to 16 legal frameworks — an honest automated indicator, never a compliance guarantee.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={organizationLd} />
      <PageContainer>
        <div className="doc-eyebrow">About · forensic accessibility</div>
        <h1 className="doc-title">
          We tell you which laws you’re <span className="ember" style={{ fontStyle: "italic" }}>actually</span> exposed
          under.
        </h1>
        <p className="doc-lead">
          A11y Beast is a forensic web-accessibility scanner. Most tools hand you a list of WCAG violations and stop
          there. We render your real page in a browser, run 110+ checks, and map every finding to the{" "}
          <strong>16 legal frameworks</strong> it implicates — ADA, the European Accessibility Act, Section 508,
          California’s Unruh Act and more — with the code to fix each issue. One scan, sixteen verdicts.
        </p>

        <section className="doc-section">
          <div className="doc-section-head">
            <span className="doc-num">01</span>
            <h2 className="doc-h2">How it actually works</h2>
          </div>
          <p className="doc-p">
            Every scan runs in a real Chromium browser via Puppeteer, so we see what users see — single-page apps,
            JS-gated content, computed styles, the role tree and focus order — not a static-HTML approximation. We run{" "}
            <strong>axe-core’s 96 rules plus 20 custom checks</strong> axe-core doesn’t catch (heading gaps, suspiciously
            generic alt text, small text, zoom-lock and more), then score each finding against each jurisdiction’s WCAG
            scope, severity, and deadline exposure.
          </p>
          <p className="doc-p">
            We benchmark the engine against <strong>axe-core, Lighthouse and Pa11y</strong> on a fixed set of real-world
            sites — the{" "}
            <a
              href="https://github.com/bishojbk/a11y-beast/blob/main/docs/benchmark/benchmark.md"
            >
              full comparison is public and reproducible
            </a>{" "}
            (run it yourself with <code>a11y-beast benchmark</code>) — and align the methodology with the W3C’s{" "}
            <a
              href="https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/"
            >
              Website Accessibility Conformance Evaluation Methodology (WCAG-EM)
            </a>
            . When we report coverage per framework, it’s a real denominator of the criteria that actually apply to that
            law and version — Section 508 maps to WCAG 2.0 AA, the EAA to 2.1 AA — not an arbitrary score.
          </p>
        </section>

        <section className="doc-section">
          <div className="doc-section-head">
            <span className="doc-num">02</span>
            <h2 className="doc-h2">What we won’t claim</h2>
          </div>
          <p className="doc-p">
            We will never tell you your site is “ADA compliant” or “WCAG compliant,” and you should be wary of any tool
            that does. Automated testing can only evaluate <strong>~30–40% of WCAG success criteria</strong>; full
            conformance is a binary, per-criterion judgment that requires manual review. So everything we report is an{" "}
            <em>automated indicator mapped to legal risk</em>, not a conformance verdict. In 2025 the FTC fined an
            accessibility-overlay vendor <strong>$1M</strong> for making exactly the kind of guarantee we refuse to make.
          </p>
        </section>

        <section className="doc-section">
          <div className="doc-section-head">
            <span className="doc-num">03</span>
            <h2 className="doc-h2">Not an overlay. On purpose.</h2>
          </div>
          <p className="doc-p">
            A11y Beast does not inject a widget that claims to “fix” your site. Overlays don’t stop lawsuits — over a
            thousand sites running one were still sued in 2025. We find the real issues, tell you which laws each one
            implicates, and give you the code to fix them in your own source. That’s the whole product.
          </p>
        </section>

        <section className="doc-section">
          <div className="doc-section-head">
            <span className="doc-num">04</span>
            <h2 className="doc-h2">Who’s behind it</h2>
          </div>
          <p className="doc-p">
            A11y Beast is built and maintained by <strong>EJR</strong>, an independent developer. It started as a tool
            to answer a question no free scanner would: not just “what’s broken,” but “which laws does this expose me to,
            and how do I fix it?” The engine, the 16-framework legal mapping, and the CLI are all built in the open —{" "}
            <a href="https://github.com/bishojbk">
              github.com/bishojbk
            </a>
            .
          </p>
        </section>

        <div className="cta-band">
          <Link href="/#scan" className="scan-btn btn-lg">
            Scan your site
          </Link>
          <Link href="/pricing" className="btn-lg outline">
            See pricing
          </Link>
        </div>
      </PageContainer>
    </>
  );
}
