"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import WaitlistCta from "@/components/WaitlistCta";
import CheckoutCta from "@/components/CheckoutCta";

interface Tier {
  name: string;
  /** Monthly list price in USD. null = custom / contact-sales. */
  monthly: number | null;
  /** Crossed-out reference price (founding tiers). */
  listMonthly?: number;
  /** True = tier has no annual variant; the toggle doesn't apply. */
  noAnnual?: boolean;
  /** Shown instead of a price when monthly is null. */
  customLabel?: string;
  tagline: string;
  features: string[];
  cta:
    | { kind: "link"; label: string; href: string }
    | { kind: "waitlist"; label: string }
    | { kind: "checkout"; label: string; priceMonthly: string; priceAnnual: string };
  featured?: boolean;
  /** Founding-price tier — shows the founding pill + microcopy. */
  founding?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Free",
    monthly: 0,
    tagline: "See where you stand. One scan, sixteen legal verdicts — the full diagnosis, no record, no signup.",
    features: [
      "Single-page scan · unlimited",
      "110+ checks · real-browser rendering",
      "All 16 legal frameworks + risk score",
      "Per-criterion WCAG conformance view",
      "View & copy results in-browser",
    ],
    cta: { kind: "link", label: "Start scanning", href: "/#scan" },
  },
  {
    name: "Pro",
    monthly: 19,
    tagline: "Prove it, over time. Turn each scan into a dated EN 301 549 evidence record and track progress.",
    features: [
      "Everything in Free",
      "Dated, tamper-evident EN 301 549 evidence record",
      "Evidence ledger — re-scan, diff, show progress over time",
      "Multi-page site crawls",
      "Markdown, JSON & evidence record export",
      "CLI + GitHub Action (catch regressions in CI)",
      "Up to 3 sites",
      "AI fix suggestions (early access)",
    ],
    cta: { kind: "checkout", label: "Get Pro", priceMonthly: "pro_monthly", priceAnnual: "pro_annual" },
    featured: true,
  },
  {
    name: "Agency",
    monthly: 99,
    listMonthly: 249,
    noAnnual: true,
    tagline: "Prove it for clients. Audit-ready evidence records you can put your name on and bill for.",
    features: [
      "Everything in Pro",
      "Up to 25 client sites · deeper crawls",
      "Bulk multi-client scanning",
      "Client-ready, brandable evidence records",
      "Priority support",
    ],
    cta: { kind: "checkout", label: "Claim a founding seat", priceMonthly: "agency_founding", priceAnnual: "agency_founding" },
    founding: true,
  },
  {
    name: "Enterprise",
    monthly: null,
    customLabel: "Custom",
    tagline: "For organisations that need scale, security, and audit-grade sign-off.",
    features: [
      "Everything in Agency",
      "SSO & team management",
      "Custom frameworks & jurisdictions",
      "Manual audit + VPAT via certified partners",
      "SLA & dedicated support",
    ],
    cta: { kind: "waitlist", label: "Contact sales" },
  },
];

/** Annual billing = 2 months free (pay for 10). */
function annualPerMonth(monthly: number): number {
  return Math.round((monthly * 10) / 12);
}

function PriceBlock({ tier, annual }: { tier: Tier; annual: boolean }) {
  const lbl: React.CSSProperties = { fontSize: 11, color: "var(--text-tertiary)", marginTop: 6, minHeight: 16 };

  if (tier.monthly === null) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span className="mono" style={{ fontSize: 40, fontWeight: 600, color: "var(--text-primary)" }}>{tier.customLabel}</span>
        </div>
        <div className="mono" style={lbl}>let&rsquo;s scope it together</div>
      </div>
    );
  }

  if (tier.monthly === 0) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span className="mono" style={{ fontSize: 40, fontWeight: 600, color: "var(--text-primary)" }}>$0</span>
          <span className="mono" style={{ fontSize: 13, color: "var(--text-tertiary)" }}>forever</span>
        </div>
        <div className="mono" style={lbl}>no card, no signup</div>
      </div>
    );
  }

  if (tier.noAnnual) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          {tier.listMonthly && (
            <s className="mono" style={{ fontSize: 20, color: "var(--text-tertiary)" }}>
              <span className="sr-only">List price </span>${tier.listMonthly}
            </s>
          )}
          <span className="mono" style={{ fontSize: 40, fontWeight: 600, color: "var(--text-primary)" }}>${tier.monthly}</span>
          <span className="mono" style={{ fontSize: 13, color: "var(--text-tertiary)" }}>/ mo</span>
        </div>
        <div className="mono" style={lbl}>
          {tier.listMonthly ? `founding rate · list price $${tier.listMonthly}/mo` : "billed monthly"}
        </div>
      </div>
    );
  }

  const shown = annual ? annualPerMonth(tier.monthly) : tier.monthly;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span className="mono" style={{ fontSize: 40, fontWeight: 600, color: "var(--text-primary)" }}>${shown}</span>
        <span className="mono" style={{ fontSize: 13, color: "var(--text-tertiary)" }}>/ mo</span>
      </div>
      <div className="mono" style={lbl}>
        {annual ? `$${tier.monthly * 10}/yr · 2 months free` : "billed monthly"}
      </div>
    </div>
  );
}

export default function PricingTable() {
  const [annual, setAnnual] = useState(true);
  // Billing probe: until Stripe is configured, checkout tiers render the
  // honest waitlist CTA. When configured, real buy buttons + the public
  // founding-seat count appear automatically.
  const [billing, setBilling] = useState<{ configured: boolean; foundingSeatsLeft: number | null }>({
    configured: false,
    foundingSeatsLeft: null,
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/v1/billing/status")
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setBilling({ configured: !!d.configured, foundingSeatsLeft: d.foundingSeatsLeft ?? null }); })
      .catch(() => { /* stays waitlist */ });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      {/* Billing toggle */}
      <div role="group" aria-label="Billing period" style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
        <div style={{ display: "inline-flex", background: "var(--bg-base)", border: "1px solid var(--border-default)", borderRadius: 999, padding: 3 }}>
          {([["Monthly", false], ["Annual", true]] as const).map(([label, val]) => {
            const active = annual === val;
            return (
              <button
                key={label}
                type="button"
                aria-pressed={active}
                onClick={() => setAnnual(val)}
                className="mono"
                style={{
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  letterSpacing: "0.04em",
                  padding: "7px 16px",
                  borderRadius: 999,
                  background: active ? "var(--accent-text)" : "transparent",
                  color: active ? "var(--bg-base)" : "var(--text-secondary)",
                  transition: "background .2s, color .2s",
                }}
              >
                {label}
                {val && <span style={{ opacity: 0.85, marginLeft: 6 }}>· save 17%</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(255px, 1fr))", gap: 1, background: "var(--border-default)", border: "1px solid var(--border-default)", borderRadius: 6, overflow: "hidden" }}>
        {TIERS.map((t) => (
          <div
            key={t.name}
            style={{
              background: t.featured ? "var(--bg-raised)" : "var(--bg-base)",
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              position: "relative",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, minHeight: 22 }}>
                <span className="font-display" style={{ fontSize: 22 }}>{t.name}</span>
                {t.featured && (
                  <span className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent-text)", background: "var(--accent-wash)", border: "1px solid var(--accent-line)", borderRadius: 3, padding: "2px 7px" }}>
                    Most popular
                  </span>
                )}
                {t.founding && !t.featured && (
                  <span className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", border: "1px solid var(--border-default)", borderRadius: 3, padding: "2px 7px" }}>
                    Founding · 20 seats
                  </span>
                )}
              </div>
              <PriceBlock tier={t} annual={annual} />
              <p style={{ color: "var(--text-secondary)", fontSize: 13.5, lineHeight: 1.5, marginTop: 14 }}>{t.tagline}</p>
            </div>

            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              {t.features.map((f) => (
                <li key={f} style={{ display: "flex", gap: 9, fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                  <Check size={15} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2, color: "var(--pass)" }} />
                  {f}
                </li>
              ))}
            </ul>

            {t.cta.kind === "waitlist" ? (
              <WaitlistCta plan={t.name} label={t.cta.label} featured={t.featured} />
            ) : t.cta.kind === "checkout" ? (
              <CheckoutCta
                price={annual && !t.noAnnual ? t.cta.priceAnnual : t.cta.priceMonthly}
                plan={t.name}
                label={billing.configured ? t.cta.label : "Get founding access"}
                featured={t.featured}
                configured={billing.configured}
              />
            ) : (
              <Link href={t.cta.href} className={`btn ${t.featured ? "primary" : ""}`} style={{ justifyContent: "center" }}>
                {t.cta.label}
              </Link>
            )}
            {t.founding && (
              <p className="mono" style={{ fontSize: 10, color: "var(--text-tertiary)", textAlign: "center", marginTop: -8 }}>
                {billing.configured && billing.foundingSeatsLeft !== null
                  ? `Founding price — locked for life · ${billing.foundingSeatsLeft} of 20 seats left`
                  : "Founding price — locked in for life"}
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
