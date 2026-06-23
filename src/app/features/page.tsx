import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/ui/Header";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Everything A11y Beast does, in plain English — and which tier each feature is on. Free covers the full diagnosis (a real-browser scan mapped to 16 legal frameworks); Pro adds the dated EN 301 549 evidence record, the ledger, multi-page crawls and CI; Agency scales it for clients.",
  alternates: { canonical: "/features" },
};

// Match the forensic-editorial system used across the content pages (see /about, /cli).
const kicker: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--text-tertiary)",
};
const body: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: 16,
  lineHeight: 1.65,
  marginBottom: 16,
};

type Tier = "Free" | "Pro" | "Agency";

function TierPill({ tier }: { tier: Tier }) {
  const map: Record<Tier, React.CSSProperties> = {
    Free: { color: "var(--pass)", borderColor: "var(--pass)", background: "transparent" },
    Pro: { color: "var(--accent-text)", borderColor: "var(--accent-line)", background: "var(--accent-wash)" },
    Agency: { color: "var(--text-primary)", borderColor: "var(--border-strong)", background: "var(--bg-raised)" },
  };
  const s = map[tier];
  return (
    <span
      className="mono"
      style={{
        flexShrink: 0,
        fontSize: 10,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: s.color,
        background: s.background,
        border: `1px solid ${s.borderColor}`,
        borderRadius: 3,
        padding: "2px 7px",
        lineHeight: 1.4,
      }}
    >
      {tier}
    </span>
  );
}

interface Feature {
  name: string;
  tier: Tier;
  desc: string;
}

interface Group {
  kicker: string;
  title: string;
  intro: string;
  features: Feature[];
}

const GROUPS: Group[] = [
  {
    kicker: "01 · the diagnosis",
    title: "See where you stand",
    intro:
      "Free, no signup. The full picture of what's wrong and which laws it implicates — we never hide the diagnosis.",
    features: [
      {
        name: "Real-browser scanning",
        tier: "Free",
        desc: "Every scan runs a real Chromium browser via Puppeteer, so we see what users see — single-page apps, JS-gated content, computed styles and focus order — not a static-HTML approximation.",
      },
      {
        name: "125+ accessibility checks",
        tier: "Free",
        desc: "axe-core's 105 rules plus 20 custom checks it doesn't catch — heading gaps, suspiciously generic alt text, text that's too small, zoom-lock and more.",
      },
      {
        name: "16 legal frameworks, mapped",
        tier: "Free",
        desc: "Every violation is tied to the laws it implicates — ADA, the EAA / EN 301 549, Section 508, California's Unruh Act, AODA and more. One scan, sixteen verdicts.",
      },
      {
        name: "Per-criterion WCAG conformance",
        tier: "Free",
        desc: "See exactly which WCAG success criteria pass and fail, by level (A / AA) — the real denominator behind the score, not an arbitrary number.",
      },
      {
        name: "Risk score & severity breakdown",
        tier: "Free",
        desc: "An honest automated-coverage score with issues ranked critical / major / minor. It's an indicator of legal risk — never a claim of compliance.",
      },
      {
        name: "Fix guidance for every issue",
        tier: "Free",
        desc: "For each finding: what's wrong, why it matters for real users, and how to fix it in your own source.",
      },
      {
        name: "Accessibility statement generator",
        tier: "Free",
        desc: "Generate an honest WCAG or EN 301 549 / EAA accessibility statement from your results — worded as documented effort, never a compliance guarantee.",
      },
    ],
  },
  {
    kicker: "02 · the outcome",
    title: "Prove it, over time",
    intro:
      "The part a free scanner can't give you: a dated, defensible trail of effort you can hand to a client, a regulator, or a court.",
    features: [
      {
        name: "Dated EN 301 549 evidence record",
        tier: "Pro",
        desc: "Turn a scan into a tamper-evident record (SHA-256 content hash) of your accessibility effort against the EAA standard — framed as documented effort, not a certification.",
      },
      {
        name: "Evidence ledger & progress diff",
        tier: "Pro",
        desc: "Re-scan over time and we diff the runs — “23 criteria resolved since March.” A free scan is a snapshot; the ledger is the proof you improved.",
      },
      {
        name: "Multi-page site crawl",
        tier: "Pro",
        desc: "Scan a whole site, not just one page — real businesses have many, and risk hides on the ones you forget.",
      },
      {
        name: "Export — Markdown, JSON & evidence file",
        tier: "Pro",
        desc: "Download the full report and the printable evidence record to attach to procurement, an audit, or your accessibility statement.",
      },
      {
        name: "AI fix suggestions",
        tier: "Pro",
        desc: "Claude-generated corrected HTML for your critical and major issues — minimal, attribute-preserving changes, not JavaScript band-aids.",
      },
      {
        name: "CLI + GitHub Action",
        tier: "Pro",
        desc: "Run scans from your terminal and fail a CI build when accessibility regresses. Open-core: the engine is AGPL, the published CLI ships with Pro.",
      },
      {
        name: "Monitoring & alerts",
        tier: "Pro",
        desc: "Scheduled re-scans that email you when new issues appear, so a deploy can't quietly reintroduce risk. (Early access — see Pricing.)",
      },
    ],
  },
  {
    kicker: "03 · for agencies",
    title: "Scale it for clients",
    intro: "Higher-value B2B: audit many client sites and hand over a deliverable you can put your name on.",
    features: [
      {
        name: "Up to 25 client sites, bulk scanning",
        tier: "Agency",
        desc: "Scan and track many client sites from one place, in bulk, with deeper crawls.",
      },
      {
        name: "Client-ready, brandable evidence records",
        tier: "Agency",
        desc: "Put your logo on the evidence record and resell it as your own audit deliverable.",
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main
        id="main-content"
        className="stagger-in"
        role="main"
        style={{ flex: 1, maxWidth: 820, margin: "0 auto", padding: "64px 24px 96px", width: "100%" }}
      >
        <div style={{ ...kicker, marginBottom: 12 }}>Features · what you actually get</div>
        <h1
          className="font-display"
          style={{ fontSize: "clamp(34px, 5vw, 52px)", lineHeight: 1.05, marginBottom: 20 }}
        >
          Everything A11y Beast does.
        </h1>
        <p style={{ ...body, fontSize: 18 }}>
          The guiding line: <strong>free answers &ldquo;am I at risk, and what&rsquo;s wrong?&rdquo;</strong> — the
          full diagnosis. <strong>Paid answers &ldquo;prove it, fix it across my whole site, and keep me safe over
          time.&rdquo;</strong> We never gate the diagnosis; we charge for the proof.
        </p>

        <div
          style={{
            fontSize: 13.5,
            lineHeight: 1.55,
            color: "var(--text-secondary)",
            background: "var(--bg-raised)",
            border: "1px solid var(--border-default)",
            borderRadius: 8,
            padding: "12px 16px",
            margin: "8px 0 8px",
          }}
        >
          Free features are live today. <strong style={{ color: "var(--text-primary)" }}>Pro</strong> and{" "}
          <strong style={{ color: "var(--text-primary)" }}>Agency</strong> features ship with founding access —{" "}
          <Link href="/pricing" style={{ color: "var(--accent-text)" }}>see pricing</Link>.
        </div>

        {GROUPS.map((g) => (
          <section key={g.title} aria-labelledby={`g-${g.title}`} style={{ marginTop: 52 }}>
            <div style={{ ...kicker, marginBottom: 8 }}>{g.kicker}</div>
            <h2 id={`g-${g.title}`} className="font-display" style={{ fontSize: "clamp(22px, 3vw, 30px)", lineHeight: 1.15, marginBottom: 10 }}>
              {g.title}
            </h2>
            <p style={{ ...body, marginBottom: 24 }}>{g.intro}</p>

            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 1, background: "var(--border-faint)", border: "1px solid var(--border-faint)", borderRadius: 10, overflow: "hidden" }}>
              {g.features.map((f) => (
                <li key={f.name} style={{ background: "var(--bg-base)", padding: "16px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 15.5, fontWeight: 600, color: "var(--text-primary)" }}>{f.name}</span>
                    <TierPill tier={f.tier} />
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.55, margin: 0 }}>{f.desc}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p style={{ ...body, fontSize: 14, marginTop: 44, color: "var(--text-tertiary)" }}>
          Whatever the tier, A11y Beast reports an automated indicator mapped to legal risk — not a compliance verdict.
          Automated testing catches ~30&ndash;40% of WCAG success criteria; pair it with a manual audit for the rest.
        </p>

        <div
          style={{
            marginTop: 40,
            paddingTop: 32,
            borderTop: "1px solid var(--border-faint)",
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <Link href="/#scan" className="scan-btn" style={{ display: "inline-flex", alignItems: "center", height: 44, padding: "0 22px", borderRadius: 6, fontSize: 14, fontWeight: 600 }}>
            Scan your site free
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
