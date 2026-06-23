import type { Metadata } from "next";
import PageContainer from "@/components/ui/PageContainer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms for using A11y Beast — including that it provides an automated indicator, not legal advice or a guarantee of compliance.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <PageContainer>
      <div className="doc-eyebrow">Legal · terms</div>
      <h1 className="doc-title" style={{ marginBottom: 10 }}>
        Terms of Service
      </h1>
      <p className="mono" style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 28 }}>
        Last updated 19 June 2026
      </p>

      <div className="prose">
        <p>By using A11y Beast (the “Service”), you agree to these terms.</p>

        <h2>What the Service is</h2>
        <p>
          A11y Beast is an automated web-accessibility scanner that maps findings to legal frameworks. Single-page scans
          are free; some features ask for an email.
        </p>

        <h2>Not legal advice, and not a guarantee of compliance</h2>
        <p>
          A11y Beast gives you an{" "}
          <strong>automated-coverage indicator — not a conformance verdict, and not legal advice.</strong> Automated
          testing only detects a portion of accessibility issues, so a passing or high score does <strong>not</strong>{" "}
          mean your site is accessible, “compliant,” or protected from legal claims; full conformance requires manual
          review. We make no warranty that using the Service will make any website compliant with the ADA, WCAG, the
          European Accessibility Act, or any other law, or that it will prevent litigation. For legal advice, consult a
          qualified attorney.
        </p>

        <h2>Acceptable use</h2>
        <ul>
          <li>Only scan websites you own or are authorized to test.</li>
          <li>
            Don’t use the Service to attack, overload, or gain unauthorized access to any system (we block scans of
            private / internal network addresses).
          </li>
          <li>Don’t resell or misuse the Service except as its open-source license permits.</li>
        </ul>

        <h2>“As is,” and limits on liability</h2>
        <p>
          The Service is provided “as is” and “as available,” without warranties of any kind, express or implied. To the
          maximum extent the law allows, A11y Beast and its maker are not liable for any indirect, incidental, or
          consequential damages, or for any loss arising from your use of — or reliance on — the Service or its results.
        </p>

        <h2>Changes &amp; governing law</h2>
        <p>
          We may modify or discontinue the Service or these terms at any time; continued use means you accept the
          changes. These terms are governed by the laws of the jurisdiction in which A11y Beast operates, without regard
          to conflict-of-laws rules.
        </p>

        <p>
          Questions? <a href="mailto:hello@a11ybeast.com">hello@a11ybeast.com</a>
        </p>
      </div>
    </PageContainer>
  );
}
