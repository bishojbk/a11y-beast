import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import Header from "@/components/ui/Header";
import WaitlistCta from "@/components/WaitlistCta";

export const metadata: Metadata = {
  title: "Pricing — A11y Beast",
  description:
    "Free forensic accessibility scanning with 16-framework legal mapping. Pro and Agency tiers add site crawls, monitoring, legal report exports, and API access.",
};

const WAITLIST = "mailto:hello@a11ybeast.com?subject=A11y%20Beast%20waitlist";

interface Tier {
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
  soon?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    tagline: "Everything you need to find and prioritise legal-risk issues on a page.",
    features: [
      "Single-page scans, unlimited",
      "125+ checks · real-browser rendering",
      "All 16 legal frameworks mapped",
      "Per-success-criterion conformance view",
      "Markdown & JSON export",
      "CLI + GitHub Action",
    ],
    cta: { label: "Start scanning", href: "/" },
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "/ month",
    tagline: "For teams shipping continuously who can't let regressions slip into production.",
    features: [
      "Everything in Free",
      "Multi-page site crawls",
      "Scheduled monitoring + regression alerts",
      "Per-jurisdiction PDF / legal reports",
      "Scan history & compare",
      "AI fix suggestions",
    ],
    cta: { label: "Join the waitlist", href: WAITLIST },
    featured: true,
    soon: true,
  },
  {
    name: "Agency",
    price: "$99",
    cadence: "/ month",
    tagline: "For agencies and consultancies auditing client sites at scale.",
    features: [
      "Everything in Pro",
      "White-label reports",
      "API access",
      "Unlimited team seats",
      "Priority support",
    ],
    cta: { label: "Join the waitlist", href: WAITLIST },
    soon: true,
  },
];

export default function PricingPage() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main id="main-content" role="main" style={{ flex: 1, maxWidth: 1180, margin: "0 auto", padding: "64px 24px 96px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
            Pricing · forensic accessibility
          </div>
        </div>
        <h1 className="font-display" style={{ fontSize: "clamp(34px, 5vw, 56px)", textAlign: "center", lineHeight: 1.05, marginBottom: 16 }}>
          Start free. Pay when you<br />need it across your <span style={{ fontStyle: "italic", color: "var(--accent-text)" }}>whole site</span>.
        </h1>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", maxWidth: "60ch", margin: "0 auto 56px", fontSize: 17, lineHeight: 1.5 }}>
          Scanning a page and mapping it to 16 laws is free, forever. Paid tiers add the things teams need at
          scale — crawls, monitoring, and reports your legal team will accept.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 1, background: "var(--border-default)", border: "1px solid var(--border-default)", borderRadius: 6, overflow: "hidden" }}>
          {TIERS.map((t) => (
            <div
              key={t.name}
              style={{
                background: t.featured ? "var(--bg-raised)" : "var(--bg-base)",
                padding: "28px 26px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                position: "relative",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span className="font-display" style={{ fontSize: 22 }}>{t.name}</span>
                  {t.featured && (
                    <span className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent-text)", background: "var(--accent-wash)", border: "1px solid var(--accent-line)", borderRadius: 3, padding: "2px 7px" }}>
                      Most popular
                    </span>
                  )}
                  {t.soon && !t.featured && (
                    <span className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", border: "1px solid var(--border-default)", borderRadius: 3, padding: "2px 7px" }}>
                      Coming soon
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span className="mono" style={{ fontSize: 40, fontWeight: 600, color: "var(--text-primary)" }}>{t.price}</span>
                  <span className="mono" style={{ fontSize: 13, color: "var(--text-tertiary)" }}>{t.cadence}</span>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: 13.5, lineHeight: 1.5, marginTop: 12 }}>{t.tagline}</p>
              </div>

              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                {t.features.map((f) => (
                  <li key={f} style={{ display: "flex", gap: 9, fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    <Check size={15} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2, color: "var(--pass)" }} />
                    {f}
                  </li>
                ))}
              </ul>

              {t.soon ? (
                <WaitlistCta plan={t.name} label={t.cta.label} featured={t.featured} />
              ) : (
                <Link href={t.cta.href} className={`btn ${t.featured ? "primary" : ""}`} style={{ justifyContent: "center" }}>
                  {t.cta.label}
                </Link>
              )}
              {t.soon && (
                <p className="mono" style={{ fontSize: 10, color: "var(--text-tertiary)", textAlign: "center", marginTop: -8 }}>
                  Free during early access
                </p>
              )}
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", color: "var(--text-tertiary)", fontSize: 12.5, marginTop: 32, lineHeight: 1.6, maxWidth: "70ch", marginInline: "auto" }}>
          A11y Beast reports automated indicators, not a conformance verdict — automated testing covers ~30–40% of
          WCAG criteria, and full conformance needs manual review. Not legal advice.
        </p>
      </main>
    </>
  );
}
