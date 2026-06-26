import type { Metadata } from "next";

// Server component wrapping the client results page so we can export route
// metadata (page.tsx stays "use client" and cannot export metadata itself).
// Results render from a client-only scan in session storage, so there is
// nothing for crawlers to index — but the page links out to real content, so
// we keep follow on while setting index to false.
export const metadata: Metadata = {
  title: "Sample legal-risk report",
  description:
    "See how A11y Beast reports a scan: an automated WCAG coverage score mapped to 16 laws, conformance per success criterion, and a phased remediation plan — with honest limitations.",
  alternates: { canonical: "/results" },
  robots: { index: false, follow: true },
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
