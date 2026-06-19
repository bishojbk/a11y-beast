import type { Metadata } from "next";
import Header from "@/components/ui/Header";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What A11y Beast collects, how it's used, who processes it, and your choices — plain-English and minimal.",
  alternates: { canonical: "/privacy" },
};

const kicker: React.CSSProperties = {
  fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
  color: "var(--text-tertiary)", marginBottom: 12,
};
const h2: React.CSSProperties = { fontSize: "clamp(20px, 3vw, 26px)", lineHeight: 1.2, marginTop: 40, marginBottom: 12 };
const body: React.CSSProperties = { color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.65, marginBottom: 14 };
const li: React.CSSProperties = { ...body, marginBottom: 8 };
const link: React.CSSProperties = { color: "var(--accent-text)" };

export default function PrivacyPage() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main id="main-content" className="stagger-in" role="main" style={{ flex: 1, maxWidth: 760, margin: "0 auto", padding: "64px 24px 96px", width: "100%" }}>
        <div style={kicker} className="mono">Legal · privacy</div>
        <h1 className="font-display" style={{ fontSize: "clamp(32px, 5vw, 48px)", lineHeight: 1.05, marginBottom: 8 }}>
          Privacy Policy
        </h1>
        <p className="mono" style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 28 }}>Last updated 19 June 2026</p>

        <p style={body}>
          A11y Beast respects your privacy and collects as little as possible. Here&rsquo;s the short version.
        </p>

        <h2 className="font-display" style={h2}>What we collect</h2>
        <ul style={{ paddingLeft: 22 }}>
          <li style={li}><strong>Pages you scan.</strong> When you scan a URL, we process that page to run accessibility checks. When you paste or upload HTML, it&rsquo;s analyzed in your browser and isn&rsquo;t sent to our servers.</li>
          <li style={li}><strong>Your email and monitored URL.</strong> If you join the waitlist or turn on &ldquo;monitor this page,&rdquo; we store the email you give us (and, for monitoring, the URL you ask us to watch) so we can run the service and contact you.</li>
          <li style={li}><strong>Usage analytics.</strong> We use Vercel Analytics (aggregate page views) and Mixpanel (product events such as &ldquo;scan completed&rdquo;) to understand and improve the tool. These may set cookies / local storage and record technical data (browser, approximate region, actions taken).</li>
          <li style={li}><strong>In your browser only.</strong> Your theme preference and recent scan history live in your browser&rsquo;s local storage, not on our servers.</li>
        </ul>

        <h2 className="font-display" style={h2}>How we use it</h2>
        <p style={body}>
          To run the scans and monitoring you request, send updates you opted into, measure and improve the product,
          and keep it secure. <strong>We don&rsquo;t sell your personal data.</strong>
        </p>

        <h2 className="font-display" style={h2}>Who processes it</h2>
        <ul style={{ paddingLeft: 22 }}>
          <li style={li}><strong>Vercel</strong> — hosting and privacy-friendly analytics.</li>
          <li style={li}><strong>Mixpanel</strong> — product analytics.</li>
          <li style={li}><strong>Google</strong> (Apps Script / Sheets) — storing waitlist and monitoring sign-ups.</li>
          <li style={li}><strong>Anthropic</strong> — only if you use the optional &ldquo;AI fix&rdquo; feature, the relevant code snippet is sent to generate a suggestion.</li>
        </ul>

        <h2 className="font-display" style={h2}>Your choices &amp; rights</h2>
        <p style={body}>
          You can block analytics in your browser or extension settings — the scanner still works. Depending on where
          you live (e.g. the EU/UK under GDPR, or California under the CCPA), you can ask us to access, correct, or
          delete your personal data. Email <a href="mailto:hello@a11ybeast.com" style={link}>hello@a11ybeast.com</a> and we&rsquo;ll take care of it.
        </p>

        <h2 className="font-display" style={h2}>Retention &amp; changes</h2>
        <p style={body}>
          We keep sign-up data while your monitoring or waitlist entry is active, or until you ask us to delete it. We
          may update this policy; the date above changes when we do.
        </p>

        <p style={{ ...body, marginTop: 24 }}>
          Questions? <a href="mailto:hello@a11ybeast.com" style={link}>hello@a11ybeast.com</a>
        </p>
      </main>
    </>
  );
}
