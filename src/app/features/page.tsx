import type { Metadata } from "next";
import Link from "next/link";
import PageContainer from "@/components/ui/PageContainer";
import PdfInterestCta from "@/components/PdfInterestCta";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Everything A11y Beast does, in plain English — and which tier each feature is on. Free covers the full diagnosis (a real-browser scan mapped to 16 legal frameworks); Pro adds the dated EN 301 549 evidence record, the ledger, multi-page crawls and CI; Agency scales it for clients.",
  alternates: { canonical: "/features" },
};

type Tier = "Free" | "Pro" | "Agency";

function TierPill({ tier }: { tier: Tier }) {
  return <span className={`tier-pill ${tier.toLowerCase()}`}>{tier}</span>;
}

/** Visibly-distinct, non-live pill for features that are not yet built (concierge / roadmap). */
function RoadmapPill() {
  return (
    <span
      className="tier-pill"
      style={{
        color: "var(--text-tertiary)",
        borderStyle: "dashed",
        borderColor: "var(--border-strong)",
        background: "transparent",
      }}
    >
      Roadmap
    </span>
  );
}

interface Feature {
  name: string;
  tier: Tier;
  desc: string;
  /** Not live in the default deploy — show a Roadmap pill instead of a live tier pill. */
  roadmap?: boolean;
}

interface Group {
  num: string;
  kicker: string;
  title: string;
  intro: string;
  features: Feature[];
}

const GROUPS: Group[] = [
  {
    num: "01",
    kicker: "the diagnosis",
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
        name: "110+ accessibility checks",
        tier: "Free",
        desc: "axe-core's 96 rules plus 20 custom checks it doesn't catch — heading gaps, suspiciously generic alt text, text that's too small, zoom-lock and more.",
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
    num: "02",
    kicker: "the outcome",
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
        name: "Export — Markdown, JSON & evidence record",
        tier: "Pro",
        desc: "Download the full report and the printable evidence record to attach to procurement, an audit, or your accessibility statement.",
      },
      {
        name: "AI fix suggestions",
        tier: "Pro",
        roadmap: true,
        desc: "Claude-generated corrected HTML for your critical and major issues — minimal, attribute-preserving changes, not JavaScript band-aids. In early access and off by default; on the roadmap for general availability.",
      },
      {
        name: "CLI + GitHub Action",
        tier: "Pro",
        desc: "Run scans from your terminal and fail a CI build when accessibility regresses. Open-core: the engine is AGPL, the published CLI ships with Pro.",
      },
      {
        name: "Monitoring & alerts",
        tier: "Pro",
        roadmap: true,
        desc: "Scheduled re-scans that email you when new issues appear, so a deploy can't quietly reintroduce risk. Currently offered as a manual / concierge service while automated monitoring is on the roadmap.",
      },
      {
        name: "Document (PDF) accessibility checks",
        tier: "Pro",
        roadmap: true,
        desc: "Check PDFs and documents against PDF/UA + WCAG — the format where most compliance programs quietly fail (Section 508, ADA Title II, the EAA's EN 301 549 §10). Not built yet: we're scoping it for Pro and will prioritise by who actually needs it. Tell us below.",
      },
    ],
  },
  {
    num: "03",
    kicker: "for agencies",
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
    <PageContainer>
      <div className="doc-eyebrow">Features · what you actually get</div>
      <h1 className="doc-title">Everything A11y Beast does.</h1>
      <p className="doc-lead">
        The guiding line: <strong>free answers “am I at risk, and what’s wrong?”</strong> — the full diagnosis.{" "}
        <strong>Paid answers “prove it, fix it across my whole site, and keep me safe over time.”</strong> We never
        gate the diagnosis; we charge for the proof.
      </p>

      <div className="callout">
        Free features are live today. <strong>Pro</strong> and <strong>Agency</strong> features are in founding access.
      </div>

      {GROUPS.map((g) => (
        <section key={g.title} className="doc-section" aria-labelledby={`g-${g.num}`}>
          <div className="doc-eyebrow">{g.kicker}</div>
          <div className="doc-section-head">
            <span className="doc-num">{g.num}</span>
            <h2 id={`g-${g.num}`} className="doc-h2">
              {g.title}
            </h2>
          </div>
          <p className="doc-p">{g.intro}</p>

          <ul className="spec-list">
            {g.features.map((f) => (
              <li key={f.name} className="spec-row">
                <div className="spec-head">
                  <span className="spec-name">{f.name}</span>
                  <TierPill tier={f.tier} />
                  {f.roadmap && <RoadmapPill />}
                </div>
                <p className="spec-desc">{f.desc}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="doc-section" aria-labelledby="g-roadmap">
        <div className="doc-eyebrow">help shape it</div>
        <div className="doc-section-head">
          <span className="doc-num">04</span>
          <h2 id="g-roadmap" className="doc-h2">Tell us what to build next</h2>
        </div>
        <p className="doc-p">
          We build for the proof layer, then add what real users ask for — not what a competitor&rsquo;s feature page
          lists. PDF/document checking is the most-requested gap; if your clients need it, say so and it moves up.
        </p>
        <PdfInterestCta />
      </section>

      <p className="doc-note">
        Whatever the tier, A11y Beast reports an automated indicator mapped to legal risk — not a compliance verdict.
        Automated testing catches ~30–40% of WCAG success criteria; pair it with a manual audit for the rest.
      </p>

      <div className="cta-band">
        <Link href="/#scan" className="scan-btn btn-lg">
          Scan your site free
        </Link>
        <Link href="/pricing" className="btn-lg outline">
          See pricing
        </Link>
      </div>
    </PageContainer>
  );
}
