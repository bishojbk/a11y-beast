// Blog registry — single source of truth for posts (metadata + body).
// Drafts: written to be reviewed/edited before publish. Every statistic here is
// one already verified for use on the live site (Seyfarth/UsableNet 2025 figures,
// FTC $1M overlay fine, ~30–40% automated coverage). Don't add unverified stats.
import type React from "react";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  datePublished: string; // ISO date
  dateModified?: string;
  tags: string[];
  readingMinutes: number;
  /** Short dek shown on the index + top of the post. */
  dek: string;
  Body: React.FC;
}

// Shared prose styles — match the forensic-editorial system.
const p: React.CSSProperties = { color: "var(--text-secondary)", fontSize: 16.5, lineHeight: 1.7, marginBottom: 18 };
const h2: React.CSSProperties = { fontSize: "clamp(22px, 3vw, 28px)", lineHeight: 1.2, marginTop: 44, marginBottom: 14 };
const li: React.CSSProperties = { ...p, marginBottom: 8 };
const aStyle: React.CSSProperties = { color: "var(--accent-text)" };

function EaaBody() {
  return (
    <>
      <p style={p}>
        The European Accessibility Act (EAA) has applied since <strong>28 June 2025</strong>. If you
        sell to consumers in the EU — e-commerce, banking, e-books, ticketing, transport booking — your
        digital products and services are expected to meet accessibility requirements, and member
        states are now enforcing them under their own national laws.
      </p>

      <h2 className="font-display" style={h2}>What standard does the EAA actually require?</h2>
      <p style={p}>
        The EAA itself sets functional requirements; the technical yardstick is the European standard{" "}
        <strong>EN 301 549</strong>, which incorporates <strong>WCAG 2.1 Level AA</strong>. That&rsquo;s
        the practical bar to aim for today. (A future revision of EN 301 549 is expected to move the
        reference toward WCAG 2.2 — worth watching, but 2.1 AA is what applies now.) The version is set
        by the legal citation, not by &ldquo;whatever the latest WCAG is.&rdquo;
      </p>

      <h2 className="font-display" style={h2}>Who is in scope?</h2>
      <p style={p}>The EAA targets consumer-facing products and services, including:</p>
      <ul style={{ marginBottom: 18, paddingLeft: 22 }}>
        <li style={li}>E-commerce sites and apps</li>
        <li style={li}>Consumer banking services</li>
        <li style={li}>E-books and e-readers</li>
        <li style={li}>Transport ticketing and travel booking</li>
        <li style={li}>Telephony and audiovisual media access services</li>
      </ul>
      <p style={p}>
        There are exceptions (notably for microenterprises providing services), but if you&rsquo;re a
        non-EU company selling into the EU, &ldquo;we&rsquo;re not based in Europe&rdquo; is not a
        defence.
      </p>

      <h2 className="font-display" style={h2}>How do you check where you stand?</h2>
      <p style={p}>
        Start by testing against WCAG 2.1 AA. Automated testing is the fast first pass — but be honest
        about its ceiling: automated tools can only evaluate roughly{" "}
        <strong>30&ndash;40% of WCAG success criteria</strong>. The rest (meaningful alt text, logical
        focus order, sensible error messages) needs human review. Any tool claiming a one-click
        &ldquo;compliant&rdquo; verdict is overselling — in 2025 the US FTC fined an accessibility
        overlay vendor <strong>$1M</strong> for exactly that kind of claim.
      </p>
      <p style={p}>
        That&rsquo;s the gap A11y Beast is built for:{" "}
        <a href="/" style={aStyle}>scan your page</a> in a real browser, see which findings map to the
        EAA (and 15 other frameworks), and get the code to fix each one — reported as an automated
        indicator, not a compliance guarantee.
      </p>
    </>
  );
}

function AdaBody() {
  return (
    <>
      <p style={p}>
        US courts have, for years, read the Americans with Disabilities Act (ADA) Title III to cover
        many websites — and plaintiffs are filing. UsableNet tracked more than <strong>5,000 digital
        accessibility lawsuits in 2025</strong>; Seyfarth counted <strong>3,117 federal web-accessibility
        suits, up 27% year over year</strong>. So &ldquo;is my site ADA compliant?&rdquo; is a fair
        question to be nervous about. Here&rsquo;s how to actually check.
      </p>

      <h2 className="font-display" style={h2}>1. Know the standard courts point to</h2>
      <p style={p}>
        The ADA doesn&rsquo;t name a technical spec, but settlements and guidance consistently reference{" "}
        <strong>WCAG 2.1 Level AA</strong> as the practical target. (US Section 508, for federal
        agencies and contractors, formally references the older WCAG 2.0 AA.) Test against WCAG 2.1 AA
        and you&rsquo;re aiming at the right bar for most ADA exposure.
      </p>

      <h2 className="font-display" style={h2}>2. Run an automated scan — then respect its limits</h2>
      <p style={p}>
        An automated scan finds a lot fast: missing alt text, low contrast, unlabeled form fields,
        broken ARIA. But automated testing only reaches about <strong>30&ndash;40% of WCAG success
        criteria</strong>. It can&rsquo;t judge whether your alt text is <em>meaningful</em>, whether
        focus order makes sense, or whether an error message is actually helpful. Treat the scan as an
        indicator, not a verdict.
      </p>

      <h2 className="font-display" style={h2}>3. Don&rsquo;t buy an overlay to make it &ldquo;go away&rdquo;</h2>
      <p style={p}>
        Accessibility overlay widgets promise instant compliance. They don&rsquo;t deliver it — and
        they don&rsquo;t stop lawsuits. UsableNet found <strong>1,416 of 2025&rsquo;s lawsuits targeted
        sites that were already running an overlay</strong>. Fix issues in your real source instead.
      </p>

      <h2 className="font-display" style={h2}>4. Fix, then keep checking</h2>
      <p style={p}>
        Accessibility regresses every time you ship. Run scans in CI (a CLI or GitHub Action that fails
        the build on new violations), and schedule manual review for the criteria automation can&rsquo;t
        see.
      </p>
      <p style={p}>
        A11y Beast does the first three steps in one pass:{" "}
        <a href="/" style={aStyle}>scan your page</a> in a real browser, see exactly which findings
        implicate ADA Title III (and 15 other frameworks), and get the code to fix each — without anyone
        pretending a scan equals legal compliance.
      </p>
    </>
  );
}

export const POSTS: BlogPost[] = [
  {
    slug: "european-accessibility-act-deadline",
    title: "When is the European Accessibility Act deadline — and what it means for your site",
    description:
      "The European Accessibility Act has applied since 28 June 2025. Here's who's in scope, the WCAG 2.1 AA standard it points to via EN 301 549, and how to check where your site stands.",
    dek: "The EAA has applied since 28 June 2025. Who's in scope, what standard it requires, and how to check your site.",
    datePublished: "2026-06-16",
    tags: ["European Accessibility Act", "EAA", "WCAG 2.1", "EN 301 549", "compliance"],
    readingMinutes: 4,
    Body: EaaBody,
  },
  {
    slug: "how-to-check-if-your-website-is-ada-compliant",
    title: "How to check if your website is ADA compliant",
    description:
      "ADA web lawsuits topped 3,000 in federal court in 2025 (+27% YoY). Here's a realistic four-step way to check your site against WCAG 2.1 AA — and why no automated scan can declare you 'compliant'.",
    dek: "A realistic, four-step way to check your site against the standard courts point to — without buying the 'instant compliance' lie.",
    datePublished: "2026-06-16",
    tags: ["ADA", "Title III", "WCAG 2.1", "accessibility lawsuits", "compliance"],
    readingMinutes: 5,
    Body: AdaBody,
  },
];

export function getAllPosts(): BlogPost[] {
  // Newest first.
  return [...POSTS].sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));
}

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((post) => post.slug === slug);
}
