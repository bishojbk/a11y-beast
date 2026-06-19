import type { Metadata } from "next";
import Header from "@/components/ui/Header";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms for using A11y Beast — including that it provides an automated indicator, not legal advice or a guarantee of compliance.",
  alternates: { canonical: "/terms" },
};

const kicker: React.CSSProperties = {
  fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
  color: "var(--text-tertiary)", marginBottom: 12,
};
const h2: React.CSSProperties = { fontSize: "clamp(20px, 3vw, 26px)", lineHeight: 1.2, marginTop: 40, marginBottom: 12 };
const body: React.CSSProperties = { color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.65, marginBottom: 14 };
const li: React.CSSProperties = { ...body, marginBottom: 8 };
const link: React.CSSProperties = { color: "var(--accent-text)" };

export default function TermsPage() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main id="main-content" className="stagger-in" role="main" style={{ flex: 1, maxWidth: 760, margin: "0 auto", padding: "64px 24px 96px", width: "100%" }}>
        <div style={kicker} className="mono">Legal · terms</div>
        <h1 className="font-display" style={{ fontSize: "clamp(32px, 5vw, 48px)", lineHeight: 1.05, marginBottom: 8 }}>
          Terms of Service
        </h1>
        <p className="mono" style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 28 }}>Last updated 19 June 2026</p>

        <p style={body}>By using A11y Beast (the &ldquo;Service&rdquo;), you agree to these terms.</p>

        <h2 className="font-display" style={h2}>What the Service is</h2>
        <p style={body}>
          A11y Beast is an automated web-accessibility scanner that maps findings to legal frameworks. Single-page
          scans are free; some features ask for an email.
        </p>

        <h2 className="font-display" style={h2}>Not legal advice, and not a guarantee of compliance</h2>
        <p style={body}>
          A11y Beast gives you an <strong>automated-coverage indicator — not a conformance verdict, and not legal
          advice.</strong> Automated testing only detects a portion of accessibility issues, so a passing or high
          score does <strong>not</strong> mean your site is accessible, &ldquo;compliant,&rdquo; or protected from
          legal claims; full conformance requires manual review. We make no warranty that using the Service will make
          any website compliant with the ADA, WCAG, the European Accessibility Act, or any other law, or that it will
          prevent litigation. For legal advice, consult a qualified attorney.
        </p>

        <h2 className="font-display" style={h2}>Acceptable use</h2>
        <ul style={{ paddingLeft: 22 }}>
          <li style={li}>Only scan websites you own or are authorized to test.</li>
          <li style={li}>Don&rsquo;t use the Service to attack, overload, or gain unauthorized access to any system (we block scans of private / internal network addresses).</li>
          <li style={li}>Don&rsquo;t resell or misuse the Service except as its open-source license permits.</li>
        </ul>

        <h2 className="font-display" style={h2}>&ldquo;As is,&rdquo; and limits on liability</h2>
        <p style={body}>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without warranties of any kind,
          express or implied. To the maximum extent the law allows, A11y Beast and its maker are not liable for any
          indirect, incidental, or consequential damages, or for any loss arising from your use of — or reliance on —
          the Service or its results.
        </p>

        <h2 className="font-display" style={h2}>Changes &amp; governing law</h2>
        <p style={body}>
          We may modify or discontinue the Service or these terms at any time; continued use means you accept the
          changes. These terms are governed by the laws of the jurisdiction in which A11y Beast operates, without
          regard to conflict-of-laws rules.
        </p>

        <p style={{ ...body, marginTop: 24 }}>
          Questions? <a href="mailto:hello@a11ybeast.com" style={link}>hello@a11ybeast.com</a>
        </p>
      </main>
    </>
  );
}
