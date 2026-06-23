import type { Metadata } from "next";
import PageContainer from "@/components/ui/PageContainer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What A11y Beast collects, how it's used, who processes it, and your choices — plain-English and minimal.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <PageContainer>
      <div className="doc-eyebrow">Legal · privacy</div>
      <h1 className="doc-title" style={{ marginBottom: 10 }}>
        Privacy Policy
      </h1>
      <p className="mono" style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 28 }}>
        Last updated 19 June 2026
      </p>

      <div className="prose">
        <p>A11y Beast respects your privacy and collects as little as possible. Here’s the short version.</p>

        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Pages you scan.</strong> When you scan a URL, we process that page to run accessibility checks. When
            you paste or upload HTML, it’s analyzed in your browser and isn’t sent to our servers.
          </li>
          <li>
            <strong>Your email and monitored URL.</strong> If you join the waitlist or turn on “monitor this page,” we
            store the email you give us (and, for monitoring, the URL you ask us to watch) so we can run the service and
            contact you.
          </li>
          <li>
            <strong>Usage analytics.</strong> We use Vercel Analytics (aggregate page views) and Mixpanel (product
            events such as “scan completed”) to understand and improve the tool. These may set cookies / local storage
            and record technical data (browser, approximate region, actions taken).
          </li>
          <li>
            <strong>In your browser only.</strong> Your theme preference and recent scan history live in your browser’s
            local storage, not on our servers.
          </li>
        </ul>

        <h2>How we use it</h2>
        <p>
          To run the scans and monitoring you request, send updates you opted into, measure and improve the product, and
          keep it secure. <strong>We don’t sell your personal data.</strong>
        </p>

        <h2>Who processes it</h2>
        <ul>
          <li>
            <strong>Vercel</strong> — hosting and privacy-friendly analytics.
          </li>
          <li>
            <strong>Mixpanel</strong> — product analytics.
          </li>
          <li>
            <strong>Google</strong> (Apps Script / Sheets) — storing waitlist and monitoring sign-ups.
          </li>
          <li>
            <strong>Anthropic</strong> — only if you use the optional “AI fix” feature, the relevant code snippet is sent
            to generate a suggestion.
          </li>
        </ul>

        <h2>Your choices &amp; rights</h2>
        <p>
          You can block analytics in your browser or extension settings — the scanner still works. Depending on where
          you live (e.g. the EU/UK under GDPR, or California under the CCPA), you can ask us to access, correct, or
          delete your personal data. Email <a href="mailto:hello@a11ybeast.com">hello@a11ybeast.com</a> and we’ll take
          care of it.
        </p>

        <h2>Retention &amp; changes</h2>
        <p>
          We keep sign-up data while your monitoring or waitlist entry is active, or until you ask us to delete it. We
          may update this policy; the date above changes when we do.
        </p>

        <p>
          Questions? <a href="mailto:hello@a11ybeast.com">hello@a11ybeast.com</a>
        </p>
      </div>
    </PageContainer>
  );
}
