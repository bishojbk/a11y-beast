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

// External source link — opens in a new tab, accent-coloured.
function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={aStyle}>
      {children}
    </a>
  );
}

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
        &ldquo;compliant&rdquo; verdict is overselling — in 2025 the US FTC charged an accessibility
        overlay vendor over exactly that kind of claim, settling for <strong>$1M</strong>.
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

function OverlaysBody() {
  return (
    <>
      <p style={p}>
        Accessibility overlay widgets promise something irresistible: paste one line of JavaScript,
        and your site becomes accessible — and lawsuit-proof — overnight. It doesn&rsquo;t work that
        way. The evidence against overlays is now strong enough that a US federal regulator, the
        disability community, and the litigation data all point the same direction.
      </p>

      <h2 className="font-display" style={h2}>What an overlay actually is</h2>
      <p style={p}>
        An overlay is a third-party script that loads <em>after</em> your page and tries to patch
        accessibility problems from the outside — adjusting contrast, injecting ARIA, adding a
        settings menu. It never changes your underlying source code. That&rsquo;s the root of the
        problem: a screen reader builds its model of the page from the raw HTML as it loads, so
        bolt-on fixes often arrive too late, and overlays can actively <strong>conflict</strong> with
        the assistive technology a user already relies on. Deque, a major accessibility vendor, walks
        through the technical reasons in detail (
        <Ext href="https://www.deque.com/blog/not-all-accessibility-overlays-are-created-equal/">deque.com</Ext>).
      </p>

      <h2 className="font-display" style={h2}>They don&rsquo;t stop lawsuits</h2>
      <p style={p}>
        In its 2025 year-end report, UsableNet found <strong>1,416 lawsuits filed against companies
        that already had an accessibility widget installed</strong> — under a section bluntly titled
        &ldquo;Accessibility Widgets Do Not Reduce Legal Risk&rdquo; (
        <Ext href="https://info.usablenet.com/2025-year-end-report-on-web-accessibility-lawsuits">UsableNet 2025 report</Ext>).
        Installing an overlay did not slow litigation.
      </p>

      <h2 className="font-display" style={h2}>And a regulator has weighed in</h2>
      <p style={p}>
        In January 2025 the US Federal Trade Commission charged overlay vendor accessiBe with
        deceptive advertising, alleging its &ldquo;accessWidget&rdquo; product could not actually make
        websites WCAG-compliant as claimed; the FTC&rsquo;s <strong>$1 million</strong> order was
        finalized in April 2025 and bars the company from claiming its automated product makes any
        site compliant without evidence (
        <Ext href="https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-order-requires-online-marketer-pay-1-million-deceptive-claims-its-ai-product-could-make-websites">FTC press release</Ext>).
      </p>

      <h2 className="font-display" style={h2}>The experts agree</h2>
      <p style={p}>
        The community-authored <Ext href="https://overlayfactsheet.com/en/">Overlay Fact Sheet</Ext>,
        signed by over 1,000 accessibility professionals and disabled users, states plainly that full
        compliance cannot be achieved with an overlay. In WebAIM&rsquo;s practitioner survey,{" "}
        <strong>67% of respondents</strong> — and 72% of respondents with disabilities — rated
        overlays &ldquo;not very&rdquo; or &ldquo;not at all&rdquo; effective (
        <Ext href="https://webaim.org/projects/practitionersurvey3/">WebAIM</Ext>).
      </p>
      <p style={p}>
        The honest path is the unglamorous one: find the real issues in your source and fix them.
        That&rsquo;s what A11y Beast is for — <a href="/" style={aStyle}>scan your page</a> in a real
        browser, see which laws each finding implicates, and get the code to fix it. No widget, no
        compliance guarantee.
      </p>
    </>
  );
}

function Section508Body() {
  return (
    <>
      <p style={p}>
        Section 508 is the US law that requires federal technology to be accessible. If you run a
        federal agency&rsquo;s website — or sell software, hardware, or digital content to the federal
        government — it sets the bar you&rsquo;re measured against. Here&rsquo;s what it actually
        requires.
      </p>

      <h2 className="font-display" style={h2}>What it is, and who it covers</h2>
      <p style={p}>
        Section 508 of the Rehabilitation Act (codified at 29 U.S.C. § 794d) requires federal agencies
        to ensure their <strong>information and communication technology (ICT)</strong> is accessible
        to people with disabilities — comparable to the access everyone else gets (
        <Ext href="https://www.section508.gov/manage/laws-and-policies/section-508-law/">Section508.gov</Ext>).
        The legal duty falls on <strong>agencies</strong>. Private vendors aren&rsquo;t directly
        regulated by the statute — but because agencies can&rsquo;t buy non-conforming ICT, vendors
        are effectively required to make accessible products (and document it) to sell to the
        government.
      </p>

      <h2 className="font-display" style={h2}>The standard: WCAG 2.0 Level AA</h2>
      <p style={p}>
        The Revised 508 Standards <strong>incorporate WCAG 2.0 Level A and AA by reference</strong> and
        have been in force since <strong>January 18, 2018</strong> (
        <Ext href="https://www.access-board.gov/ict/">US Access Board</Ext>). Note the version:
        Section 508 still points to WCAG <strong>2.0</strong> AA — not 2.1 or 2.2. (By contrast, the
        DOJ&rsquo;s 2024 ADA Title II rule for state and local government adopted WCAG 2.1 AA. The
        required version is set by each law&rsquo;s citation, not by the latest WCAG release.)
      </p>

      <h2 className="font-display" style={h2}>VPATs and ACRs</h2>
      <p style={p}>
        Vendors document conformance using a <strong>VPAT</strong> (Voluntary Product Accessibility
        Template) — a form listing each applicable criterion and whether the product
        &ldquo;supports,&rdquo; &ldquo;partially supports,&rdquo; or &ldquo;does not support&rdquo; it.
        Once filled in with real test results, it becomes an <strong>Accessibility Conformance Report
        (ACR)</strong>, which agencies request before buying (
        <Ext href="https://www.section508.gov/sell/acr-vpat-faq/">Section508.gov ACR/VPAT FAQ</Ext>).
      </p>

      <h2 className="font-display" style={h2}>508 vs. 504</h2>
      <p style={p}>
        Both come from the Rehabilitation Act. <strong>Section 504</strong> is a broad
        non-discrimination rule for programs receiving federal funds; <strong>Section 508</strong> is
        the narrower, technology-specific requirement for federal ICT. They&rsquo;re related —
        508 even borrows 504&rsquo;s complaint procedures for enforcement (
        <Ext href="https://www.section508.gov/manage/relationship-between-sections-508-504-and-501/">Section508.gov</Ext>).
      </p>
      <p style={p}>
        A11y Beast maps every finding to Section 508&rsquo;s WCAG 2.0 AA scope alongside 15 other
        frameworks — so you can see federal exposure specifically. <a href="/" style={aStyle}>Scan a
        page</a> to start.
      </p>
    </>
  );
}

function WcagVersionBody() {
  return (
    <>
      <p style={p}>
        &ldquo;Which WCAG version do we need to meet?&rdquo; has a frustrating answer: it depends on
        which law applies to you. There are three current versions, and different laws point to
        different ones — on purpose.
      </p>

      <h2 className="font-display" style={h2}>The three versions</h2>
      <ul style={{ marginBottom: 18, paddingLeft: 22 }}>
        <li style={li}><strong>WCAG 2.0</strong> — December 2008</li>
        <li style={li}><strong>WCAG 2.1</strong> — June 2018 (added mobile, low-vision, and cognitive criteria)</li>
        <li style={li}><strong>WCAG 2.2</strong> — October 2023 (the current version)</li>
      </ul>
      <p style={p}>
        Crucially, the W3C says these <strong>coexist</strong>: 2.2 does not deprecate 2.1, and 2.1
        does not deprecate 2.0 (
        <Ext href="https://www.w3.org/WAI/standards-guidelines/wcag/">W3C WAI</Ext>). So the version
        you&rsquo;re legally held to is whatever your applicable law <em>cites</em> — not automatically
        the newest one.
      </p>

      <h2 className="font-display" style={h2}>What each law points to</h2>
      <ul style={{ marginBottom: 18, paddingLeft: 22 }}>
        <li style={li}>
          <strong>US Section 508</strong> (federal ICT) → <strong>WCAG 2.0 AA</strong> (
          <Ext href="https://www.section508.gov/develop/applicability-conformance/">Section508.gov</Ext>).
        </li>
        <li style={li}>
          <strong>US ADA Title II</strong> (state &amp; local government) → <strong>WCAG 2.1 AA</strong>,
          under the DOJ&rsquo;s April 2024 rule (
          <Ext href="https://www.ada.gov/resources/2024-03-08-web-rule/">ADA.gov</Ext>). Note: an
          interim final rule in April 2026 <strong>extended the compliance deadlines by one year</strong> —
          now April 26, 2027 for larger entities (population ≥ 50,000) and April 26, 2028 for smaller
          ones (
          <Ext href="https://www.federalregister.gov/documents/2026/04/20/2026-07663/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web">Federal Register</Ext>).
        </li>
        <li style={li}>
          <strong>EU European Accessibility Act</strong> → via harmonized standard{" "}
          <strong>EN 301 549 v3.2.1</strong>, which references <strong>WCAG 2.1 AA</strong>. A draft
          EN 301 549 v4.x (November 2025) moves toward WCAG 2.2, but the 2.1-based version remains in
          legal effect for now (
          <Ext href="https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf">ETSI</Ext>).
        </li>
        <li style={li}>
          <strong>US ADA Title III</strong> (private businesses) → <strong>no codified version.</strong>{" "}
          DOJ has no regulation setting a technical web standard; it treats WCAG and Section 508 as
          &ldquo;helpful guidance&rdquo; (
          <Ext href="https://www.ada.gov/resources/web-guidance/">ADA.gov</Ext>). In practice, most
          businesses target WCAG 2.1 AA.
        </li>
      </ul>

      <h2 className="font-display" style={h2}>The practical takeaway</h2>
      <p style={p}>
        Building to <strong>WCAG 2.1 AA</strong> satisfies most of the laws above today (Section 508 is
        the exception, sitting at 2.0 AA, which 2.1 is a superset of). A11y Beast pins each of its 16
        frameworks to the exact WCAG version that framework&rsquo;s law cites — so a
        &ldquo;coverage&rdquo; number means something specific, not a generic score.{" "}
        <a href="/" style={aStyle}>Scan your site</a> to see it per framework.
      </p>
    </>
  );
}

function LawsuitTrendsBody() {
  return (
    <>
      <p style={p}>
        Digital accessibility litigation didn&rsquo;t slow down in 2025 — it climbed. If you sell
        online, the odds of a demand letter are no longer hypothetical. Here&rsquo;s what the data
        shows, and why.
      </p>

      <h2 className="font-display" style={h2}>The 2025 numbers</h2>
      <p style={p}>
        UsableNet reviewed <strong>5,114 ADA-related digital accessibility lawsuits</strong> filed in
        US federal and state courts in 2025 — 3,195 federal (62%) and 1,919 in state court (
        <Ext href="https://info.usablenet.com/2025-year-end-report-on-web-accessibility-lawsuits">UsableNet 2025 report</Ext>).
        Tracking federal website cases specifically, Seyfarth Shaw counted{" "}
        <strong>3,117 — up 27% over 2024</strong> (
        <Ext href="https://www.adatitleiii.com/2026/03/federal-court-website-accessibility-lawsuit-filings-bounce-back-in-2025/">Seyfarth ADA Title III</Ext>).
        (The two counts differ because each firm tracks a different scope. And while the 2025 rebound
        is sharp, it&rsquo;s still a hair below the 2022 peak of ~3,255 federal suits — a resurgence,
        not an all-time record.)
      </p>

      <h2 className="font-display" style={h2}>What&rsquo;s driving the surge</h2>
      <ul style={{ marginBottom: 18, paddingLeft: 22 }}>
        <li style={li}>
          <strong>Repeat targeting.</strong> 45% of 2025 federal cases were filed against companies
          that had already been sued — a repeatable strategy, per UsableNet.
        </li>
        <li style={li}>
          <strong>E-commerce concentration.</strong> About 70% of suits hit e-commerce sites, and 36%
          of the top 500 online retailers were sued at least once (UsableNet).
        </li>
        <li style={li}>
          <strong>State courts.</strong> New York and California (the latter via the Unruh Act&rsquo;s
          statutory damages) drove the 1,919 state-court filings.
        </li>
        <li style={li}>
          <strong>Overlays aren&rsquo;t shields.</strong> 1,416 of the suits targeted sites already
          running an accessibility widget (UsableNet) — and the FTC charged overlay vendor accessiBe
          over what its product claimed, settling for $1M in 2025 (
          <Ext href="https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-order-requires-online-marketer-pay-1-million-deceptive-claims-its-ai-product-could-make-websites">FTC</Ext>).
        </li>
      </ul>

      <h2 className="font-display" style={h2}>What does one actually cost?</h2>
      <p style={p}>
        Be skeptical of the precise dollar ranges that dominate search results (&ldquo;$5,000 demand
        letter,&rdquo; &ldquo;$5K&ndash;$75K settlement&rdquo;) — most trace to companies selling
        remediation, not to Seyfarth, UsableNet, the DOJ, or court data, and pre-litigation settlements
        are confidential. The figures that <em>are</em> attributable:
      </p>
      <ul style={{ marginBottom: 18, paddingLeft: 22 }}>
        <li style={li}>
          <strong>California (Unruh Act): at least $4,000 per case.</strong> Civil Code § 52(a) sets a
          $4,000 statutory-damages floor, and an ADA violation is automatically an Unruh violation. For a
          website, courts treat it as a <em>single</em> violation — in <em>Robles v. Domino&rsquo;s</em>
          the court awarded one $4,000, rejecting &ldquo;per visit&rdquo; stacking (
          <Ext href="https://www.bclplaw.com/en-US/events-insights-news/california-federal-court-holds-dominos-website-violates-the-ada-limits-penalties-under-unruh-act-to-dollar4000.html">BCLP</Ext>).
        </li>
        <li style={li}>
          <strong>~$16,000</strong> is what California ADA/Unruh website-type cases &ldquo;regularly settle
          for,&rdquo; per the US Chamber-affiliated Institute for Legal Reform (
          <Ext href="https://instituteforlegalreform.com/blog/ada-lawsuits-in-california-a-gold-rush-for-serial-filers/">ILR</Ext>).
        </li>
        <li style={li}>
          <strong>~$143,000</strong> is what one business recovered in fees after <em>winning</em> through
          trial and appeal — a real proxy for what fighting a case to the end costs (
          <Ext href="https://ada.jeffer.com/defending-ada-and-unruh-act-lawsuits-winning-attorneys-fees-as-a-business/">JMBM, Garcia v. Zarco</Ext>).
        </li>
      </ul>
      <p style={p}>
        And note: under federal ADA Title III a private plaintiff <strong>can&rsquo;t win damages</strong> —
        only an injunction plus <strong>attorneys&rsquo; fees</strong> (
        <Ext href="https://www.law.cornell.edu/uscode/text/42/12205">42 U.S.C. § 12205</Ext>). You still
        pay because the bill is the plaintiff&rsquo;s legal fees, your own defense counsel, and the
        remediation the court orders anyway — so &ldquo;no damages&rdquo; never means &ldquo;free.&rdquo;
      </p>

      <h2 className="font-display" style={h2}>What it means for you</h2>
      <p style={p}>
        The cheapest case to defend is the one you prevent — and remediation is the one cost you&rsquo;d
        pay regardless of outcome, so do it first. Find and fix real issues in your source, keep checking
        as you ship, and don&rsquo;t rely on a widget to make the risk disappear. A11y Beast gives you the
        legal-risk view in one pass — <a href="/" style={aStyle}>scan your page</a> and see exactly which
        of 16 frameworks each finding implicates.
      </p>
    </>
  );
}

function UnruhBody() {
  return (
    <>
      <p style={p}>
        California sees more web accessibility lawsuits than almost anywhere else, and one state law is
        the reason: the Unruh Civil Rights Act. It turns a federal accessibility violation into a
        claim worth real money — which is exactly why plaintiffs file in California.
      </p>

      <h2 className="font-display" style={h2}>What the Unruh Act says</h2>
      <p style={p}>
        The Unruh Act (California Civil Code § 51) guarantees equal access to &ldquo;all business
        establishments of every kind whatsoever&rdquo; (
        <Ext href="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=51.">Civil Code § 51</Ext>).
        The key link for websites is § 51(f): <strong>a violation of the ADA is automatically a
        violation of the Unruh Act.</strong> So an inaccessible site that fails the ADA fails Unruh
        too — and an ADA-based Unruh claim doesn&rsquo;t require proving intent.
      </p>

      <h2 className="font-display" style={h2}>The $4,000 difference</h2>
      <p style={p}>
        Under the federal ADA, a private plaintiff can only win an injunction (a court order to fix the
        site) plus attorney&rsquo;s fees — no damages. Unruh changes the math: Civil Code § 52(a) sets
        <strong> statutory damages of no less than $4,000 per offense</strong>, and you don&rsquo;t have
        to prove any actual loss to recover it (
        <Ext href="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=52.">Civil Code § 52</Ext>).
        That per-offense minimum is what makes each California case independently worth filing.
      </p>

      <h2 className="font-display" style={h2}>Why Robles v. Domino&rsquo;s matters</h2>
      <p style={p}>
        In <em>Robles v. Domino&rsquo;s Pizza</em> (2019), the Ninth Circuit held that the ADA covers a
        business&rsquo;s website and app when they connect to a physical place of public accommodation;
        the Supreme Court declined to review it in October 2019, leaving the ruling in force across the
        Ninth Circuit, including California (
        <Ext href="https://adasoutheast.org/legal/court/robles-v-dominos-pizza-llc/">case summary</Ext>).
        That precedent is the foundation California Unruh plaintiffs build on.
      </p>

      <h2 className="font-display" style={h2}>One common misconception</h2>
      <p style={p}>
        California has heightened pleading rules and extra fees aimed at high-frequency litigants — but
        those apply to <strong>construction-related (physical premises) claims</strong>, not website
        cases. They generally don&rsquo;t slow digital accessibility suits, which is part of why those
        remain so common.
      </p>
      <p style={p}>
        If you serve California customers, the Unruh exposure is worth taking seriously. A11y Beast
        flags which findings implicate California&rsquo;s Unruh Act specifically —{" "}
        <a href="/" style={aStyle}>scan your page</a> to see where you stand.
      </p>
    </>
  );
}

function AutomatedLimitsBody() {
  return (
    <>
      <p style={p}>
        Automated accessibility scanners are fast, cheap, and genuinely useful — and they will never,
        on their own, tell you a site is &ldquo;compliant.&rdquo; Understanding exactly where the line
        is will save you from both false confidence and wasted effort.
      </p>

      <h2 className="font-display" style={h2}>How much can automation actually catch?</h2>
      <p style={p}>
        When the UK Government Digital Service seeded a test page with 142 known accessibility barriers
        and ran 13 automated tools at it, the <strong>best tool caught about 40%</strong>; the worst,
        13% (
        <Ext href="https://alphagov.github.io/accessibility-tool-audit/">GDS tool audit</Ext>).
        Measured differently — by volume of issues rather than by success criteria — Deque reports its
        axe engine surfaces about <strong>57% of issues automatically</strong>, while noting the
        traditional &ldquo;success-criteria&rdquo; figure spans roughly 20–40% depending on the source (
        <Ext href="https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/">Deque</Ext>).
        Those measure different things — but both land on the same conclusion: a large share of
        accessibility can only be assessed by a human.
      </p>

      <h2 className="font-display" style={h2}>What automation catches well</h2>
      <ul style={{ marginBottom: 18, paddingLeft: 22 }}>
        <li style={li}>Missing alternative text on images</li>
        <li style={li}>Insufficient color contrast</li>
        <li style={li}>Form fields without labels</li>
        <li style={li}>Missing page language or broken heading structure</li>
        <li style={li}>Invalid or misused ARIA</li>
      </ul>

      <h2 className="font-display" style={h2}>What it can&rsquo;t judge</h2>
      <ul style={{ marginBottom: 18, paddingLeft: 22 }}>
        <li style={li}>Whether alt text is actually <em>meaningful</em> (not just present)</li>
        <li style={li}>Whether reading and focus order make sense</li>
        <li style={li}>Whether link text is clear out of context</li>
        <li style={li}>Whether captions and complex-image descriptions are accurate</li>
      </ul>
      <p style={p}>
        The W3C is explicit: evaluation tools &ldquo;can not determine accessibility, they can only
        assist&rdquo; — human judgement is required (
        <Ext href="https://www.w3.org/WAI/test-evaluate/tools/selecting/">W3C WAI</Ext>). And WCAG
        conformance is binary, pass-or-fail per success criterion, assessed across representative pages —
        not something a single scan can settle for a whole site (
        <Ext href="https://www.w3.org/WAI/WCAG22/Understanding/conformance">Understanding Conformance</Ext>).
      </p>

      <h2 className="font-display" style={h2}>Why we say this out loud</h2>
      <p style={p}>
        This is exactly why A11y Beast reports an <strong>automated indicator mapped to legal risk —
        not a compliance verdict.</strong> We catch what automation catches well, map it to the laws
        it implicates, and tell you plainly where manual review is still needed. Any tool that promises
        a one-click &ldquo;compliant&rdquo; stamp is making the kind of claim that just cost an overlay
        vendor a $1M FTC settlement. <a href="/" style={aStyle}>Scan a page</a> and see the honest version.
      </p>
    </>
  );
}

function DeadlineBody() {
  return (
    <>
      <p style={p}>
        Search interest in an &ldquo;ADA compliance April 2026 deadline&rdquo; has spiked — and most of
        what&rsquo;s circulating gets it wrong. Here&rsquo;s the accurate version: that date comes from a
        specific government rule, it has since been <strong>pushed back a year</strong>, and if
        you&rsquo;re a private business it probably was never your deadline in the first place. What you
        actually have is ongoing ADA exposure with no deadline at all.
      </p>

      <h2 className="font-display" style={h2}>Where the &ldquo;April 2026&rdquo; date comes from</h2>
      <p style={p}>
        In April 2024 the US Department of Justice published a final rule under <strong>ADA Title II</strong>{" "}
        setting <strong>WCAG 2.1 Level AA</strong> as the technical standard for the websites and mobile
        apps of <strong>state and local governments</strong> (
        <Ext href="https://www.ada.gov/resources/2024-03-08-web-rule/">ADA.gov</Ext>). The original
        compliance date for larger entities (population ≥ 50,000) was <strong>April 24, 2026</strong> —
        that&rsquo;s the &ldquo;April 2026&rdquo; everyone is searching.
      </p>

      <h2 className="font-display" style={h2}>It&rsquo;s been extended by a year</h2>
      <p style={p}>
        An interim final rule in April 2026 <strong>extended those deadlines by roughly one year</strong>:
        larger entities now have until <strong>April 26, 2027</strong>, and smaller entities (population
        under 50,000) and special district governments until <strong>April 26, 2028</strong> (
        <Ext href="https://www.federalregister.gov/documents/2026/04/20/2026-07663/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web">Federal Register</Ext>).
        So even for the governments it covers, &ldquo;April 2026&rdquo; is no longer the operative date.
      </p>

      <h2 className="font-display" style={h2}>Does any of this apply to my business?</h2>
      <p style={p}>
        If you run a private business, <strong>no</strong> — Title II covers government entities only.
        Private &ldquo;public accommodations&rdquo; fall under <strong>ADA Title III</strong>, and DOJ
        has <strong>no</strong> regulation setting a web standard or deadline for Title III; it treats
        WCAG as &ldquo;helpful guidance&rdquo; and enforces under the ADA&rsquo;s general
        anti-discrimination duty (
        <Ext href="https://www.ada.gov/resources/web-guidance/">ADA.gov web guidance</Ext>). The
        practical effect is the opposite of relief: there&rsquo;s no countdown because the expectation
        to be accessible <em>already</em> applies, and lawsuits are filed continuously, not on a deadline.
      </p>

      <h2 className="font-display" style={h2}>The dates that might actually matter to you</h2>
      <ul style={{ marginBottom: 18, paddingLeft: 22 }}>
        <li style={li}><strong>EU — European Accessibility Act:</strong> in effect since <strong>28 June 2025</strong> for businesses selling to EU consumers (WCAG 2.1 AA via EN 301 549).</li>
        <li style={li}><strong>US federal agencies &amp; vendors — Section 508:</strong> WCAG 2.0 AA, in force since 2018.</li>
        <li style={li}><strong>US state/local government — ADA Title II:</strong> WCAG 2.1 AA by April 2027/2028 (above).</li>
        <li style={li}><strong>US private business — ADA Title III:</strong> no deadline, no codified version — but continuously enforceable.</li>
      </ul>
      <p style={p}>
        Don&rsquo;t panic over a date that may not be yours — but don&rsquo;t mistake &ldquo;no
        deadline&rdquo; for &ldquo;no risk.&rdquo; <a href="/" style={aStyle}>Scan your site</a> to see
        which of these frameworks your pages are actually exposed under.
      </p>
    </>
  );
}

function ShopifyBody() {
  return (
    <>
      <p style={p}>
        Shopify gives you a strong accessibility starting point — but a Shopify store is not accessible
        by default just because it&rsquo;s on Shopify. Some of the responsibility is Shopify&rsquo;s, and
        some is squarely yours. Here&rsquo;s how to tell them apart and close the gaps you own.
      </p>

      <h2 className="font-display" style={h2}>What Shopify handles (and documents)</h2>
      <p style={p}>
        Shopify states that <strong>WCAG 2.2 Level AA</strong> is its guiding principle and publishes{" "}
        <strong>Accessibility Conformance Reports (VPATs)</strong> for its own products — Checkout, Admin,
        and the default <strong>Dawn</strong> theme (
        <Ext href="https://www.shopify.com/accessibility">shopify.com/accessibility</Ext>). Tellingly,
        Shopify&rsquo;s own <Ext href="https://www.shopify.com/accessibility/vpat-checkout">Checkout VPAT</Ext>{" "}
        openly lists unresolved barriers (focus-order and focus-visibility issues, some small touch
        targets). Because checkout is Shopify-hosted, standard merchants can&rsquo;t rewrite its markup —
        that part&rsquo;s on Shopify. Everything above checkout is on you.
      </p>

      <h2 className="font-display" style={h2}>What you own — and the fixes</h2>
      <ul style={{ marginBottom: 18, paddingLeft: 22 }}>
        <li style={li}>
          <strong>Product image alt text.</strong> Set it per image in <em>Admin → Products → [product] →
          select the media → Add alt text</em>; describe the product, ~125 characters (
          <Ext href="https://help.shopify.com/en/manual/products/product-media/add-alt-text">Shopify Help</Ext>).
        </li>
        <li style={li}>
          <strong>Theme choice.</strong> Dawn and other free Online Store 2.0 themes carry Shopify&rsquo;s
          accessibility work and a published VPAT — the strongest free baseline. (A good theme is a
          floor, not a guarantee; customizations and apps can still break it.) Shopify Theme Store themes
          must hit a minimum Lighthouse accessibility score of 90 (
          <Ext href="https://www.shopify.com/partners/blog/theme-store-accessibility-requirements">Shopify Partners</Ext>).
        </li>
        <li style={li}>
          <strong>Color contrast.</strong> Shopify&rsquo;s documented thresholds: 4.5:1 for body/button
          text, 3:1 for large text and for icons/input borders (
          <Ext href="https://help.shopify.com/en/manual/online-store/themes/customizing-themes/accessibility">Shopify Help</Ext>).
        </li>
        <li style={li}>
          <strong>Keyboard &amp; focus.</strong> Tab the whole path to checkout: dropdowns open on
          Enter/Space, cart drawers and modals trap focus and close on Esc, and the focus ring is always
          visible (never <code>outline:none</code>).
        </li>
        <li style={li}>
          <strong>Apps &amp; pop-ups.</strong> Third-party apps inject their own markup; audit pop-ups,
          modals, and add-on widgets for contrast, focus traps, and dismissibility.
        </li>
      </ul>

      <h2 className="font-display" style={h2}>The one trap to avoid</h2>
      <p style={p}>
        The Shopify App Store has an Accessibility category full of one-click &ldquo;compliance&rdquo;
        overlay widgets. They don&rsquo;t fix your code, they don&rsquo;t stop lawsuits, and in 2025 the
        US FTC charged overlay vendor accessiBe over claims like that, settling for <strong>$1M</strong> (
        <Ext href="https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-order-requires-online-marketer-pay-1-million-deceptive-claims-its-ai-product-could-make-websites">FTC</Ext>).
        Remediate the source instead.
      </p>
      <p style={p}>
        Want to know exactly which issues your store has and which laws they implicate?{" "}
        <a href="/" style={aStyle}>Scan your Shopify URL</a> — real browser, 125+ checks, mapped to 16
        frameworks.
      </p>
    </>
  );
}

function WordPressBody() {
  return (
    <>
      <p style={p}>
        WordPress can absolutely be made accessible — the platform has an official accessibility team and
        real standards — but nothing about installing WordPress makes your site compliant. Most failures
        come from theme choice, missing alt text, and (ironically) &ldquo;accessibility&rdquo; plugins
        that make things worse. Here&rsquo;s the practical path.
      </p>

      <h2 className="font-display" style={h2}>WordPress has real accessibility standards</h2>
      <p style={p}>
        The <Ext href="https://make.wordpress.org/accessibility/">Make WordPress Accessible</Ext> team
        maintains an <strong>&ldquo;accessibility-ready&rdquo; theme tag</strong> granted only after a
        manual audit (skip links, keyboard support, labelled fields, heading structure, sufficient
        contrast, alt text, and more —{" "}
        <Ext href="https://make.wordpress.org/themes/handbook/review/accessibility/required/">requirements</Ext>),
        and WordPress&rsquo;s coding standard targets <strong>WCAG 2.2 Level AA</strong> (
        <Ext href="https://developer.wordpress.org/coding-standards/wordpress-coding-standards/accessibility/">handbook</Ext>).
        Note the tag is WordPress&rsquo;s minimum bar — it doesn&rsquo;t by itself certify full conformance.
      </p>

      <h2 className="font-display" style={h2}>Where WordPress sites actually fail</h2>
      <p style={p}>
        The web-wide failure pattern shows up on WordPress too. In WebAIM&rsquo;s 2025 analysis of the top
        million home pages, <strong>94.8% had detectable WCAG failures</strong> — low-contrast text on
        79.1%, missing alt text on 55.5%, missing form labels on 48.2% (
        <Ext href="https://webaim.org/projects/million/2025">WebAIM Million 2025</Ext>). The fixes:
      </p>
      <ul style={{ marginBottom: 18, paddingLeft: 22 }}>
        <li style={li}><strong>Alt text</strong> in the Media Library / Image-block &ldquo;Alternative Text&rdquo; field; mark purely decorative images with empty <code>alt=&quot;&quot;</code>.</li>
        <li style={li}><strong>Heading structure</strong> — one <code>&lt;h1&gt;</code>, logical nesting, never skip levels; choose levels for structure, not font size.</li>
        <li style={li}><strong>Contrast</strong> — WCAG AA 4.5:1 for normal text, 3:1 for large text and UI.</li>
        <li style={li}><strong>Accessible forms</strong> — visible labels programmatically tied to inputs, clear error messages.</li>
        <li style={li}><strong>Page builders</strong> (Elementor, Divi) can introduce issues in interactive widgets, but they&rsquo;re not inherently inaccessible — Divi was actually the best-performing platform in WebAIM Million 2025. Build carefully and test.</li>
      </ul>

      <h2 className="font-display" style={h2}>Helpful plugins vs. the overlay trap</h2>
      <p style={p}>
        Genuinely useful, non-overlay tools include <strong>WP Accessibility</strong> (Joe Dolson),{" "}
        <strong>Editoria11y</strong> (an author-facing checker maintained by Princeton), and{" "}
        <strong>Equalize Digital Accessibility Checker</strong> (scans posts against WCAG in the admin —
        explicitly not a front-end overlay). Avoid the opposite category: one-script overlay/widget
        plugins that promise instant ADA compliance. The{" "}
        <Ext href="https://overlayfactsheet.com/">Overlay Fact Sheet</Ext> (1,000+ signatories) states no
        overlay can make a site fully compliant, and overlays haven&rsquo;t stopped lawsuits — UsableNet
        recorded 1,416 suits in 2025 against sites already running one.
      </p>
      <p style={p}>
        Automated tools (including ours) catch a portion of issues; manual and screen-reader testing
        cover the rest. <a href="/" style={aStyle}>Scan your WordPress URL</a> to see which findings map
        to which of 16 laws — then fix them in your theme and content, not with a widget.
      </p>
    </>
  );
}

function ChecklistBody() {
  return (
    <>
      <p style={p}>
        Most laws point at the same target: <strong>WCAG 2.1 Level AA</strong> (Section 508 sits at 2.0
        AA, which 2.1 fully includes). This is a practical, plain-English checklist of what that means,
        grouped by WCAG&rsquo;s four principles. Each item is marked <strong>[auto]</strong> if an
        automated scanner can reliably catch it, or <strong>[manual]</strong> if it needs human judgement —
        because no tool can certify the whole list (
        <Ext href="https://www.w3.org/WAI/test-evaluate/tools/selecting/">W3C: tools assist, they
        can&rsquo;t determine conformance</Ext>).
      </p>

      <h2 className="font-display" style={h2}>1. Perceivable</h2>
      <ul style={{ marginBottom: 18, paddingLeft: 22 }}>
        <li style={li}>Every meaningful image has alt text; decorative images are empty <code>alt=&quot;&quot;</code>. <strong>[auto]</strong> presence / <strong>[manual]</strong> whether it&rsquo;s meaningful.</li>
        <li style={li}>Video has captions and (where needed) audio description. <strong>[manual]</strong></li>
        <li style={li}>Information isn&rsquo;t conveyed by color alone. <strong>[manual]</strong></li>
        <li style={li}>Text contrast ≥ 4.5:1 (≥ 3:1 for large text); UI components and graphics ≥ 3:1. <strong>[auto]</strong></li>
        <li style={li}>Content reflows at 400% zoom / 320px without horizontal scrolling, and text spacing can be increased. <strong>[manual]</strong></li>
        <li style={li}>Structure (headings, lists, tables) is marked up semantically, not faked with styling. <strong>[auto]</strong> partial.</li>
      </ul>

      <h2 className="font-display" style={h2}>2. Operable</h2>
      <ul style={{ marginBottom: 18, paddingLeft: 22 }}>
        <li style={li}>Everything works by keyboard alone, with no keyboard traps. <strong>[manual]</strong></li>
        <li style={li}>A visible focus indicator is always present. <strong>[auto]</strong> partial / <strong>[manual]</strong>.</li>
        <li style={li}>A &ldquo;skip to content&rdquo; link or equivalent bypass is available. <strong>[auto]</strong></li>
        <li style={li}>Pages have unique, descriptive <code>&lt;title&gt;</code>s and link text that makes sense out of context. <strong>[auto]</strong> presence / <strong>[manual]</strong> clarity.</li>
        <li style={li}>No content flashes more than three times per second. <strong>[manual]</strong></li>
        <li style={li}>Time limits can be turned off, adjusted, or extended. <strong>[manual]</strong></li>
      </ul>

      <h2 className="font-display" style={h2}>3. Understandable</h2>
      <ul style={{ marginBottom: 18, paddingLeft: 22 }}>
        <li style={li}>Page language is set (<code>&lt;html lang&gt;</code>). <strong>[auto]</strong></li>
        <li style={li}>Navigation and components behave consistently across pages. <strong>[manual]</strong></li>
        <li style={li}>Form fields have visible, programmatically associated labels. <strong>[auto]</strong></li>
        <li style={li}>Errors are identified in text, with suggestions for fixing them. <strong>[manual]</strong></li>
      </ul>

      <h2 className="font-display" style={h2}>4. Robust</h2>
      <ul style={{ marginBottom: 18, paddingLeft: 22 }}>
        <li style={li}>Markup is valid; elements have complete start/end tags and unique IDs. <strong>[auto]</strong></li>
        <li style={li}>Custom widgets expose correct name, role, and value via ARIA. <strong>[auto]</strong> partial / <strong>[manual]</strong>.</li>
        <li style={li}>Status messages are announced to assistive tech without moving focus. <strong>[manual]</strong></li>
      </ul>

      <p style={p}>
        Notice how many items are <strong>[manual]</strong>: that&rsquo;s why an automated pass is the
        start, not the finish. The fastest way to clear the <strong>[auto]</strong> half of this list is
        to <a href="/" style={aStyle}>scan your page</a> — you&rsquo;ll get each finding mapped to the law
        it implicates and the code to fix it, plus a clear view of what still needs a human.
      </p>
    </>
  );
}

function WixBody() {
  return (
    <>
      <p style={p}>
        Wix gives you more accessibility tooling than most site builders — but a Wix site isn&rsquo;t accessible just
        because it&rsquo;s on Wix. And it has one signature problem the others don&rsquo;t: the drag-and-drop canvas can
        scramble the order screen readers and keyboards follow. Here&rsquo;s how to handle it.
      </p>

      <h2 className="font-display" style={h2}>Your head start: the Accessibility Wizard</h2>
      <p style={p}>
        In the editor, go to <strong>Settings → Accessibility Wizard → Scan Site</strong>. It returns two tabs —{" "}
        <strong>Detected Issues</strong> (auto-found) and <strong>Manual Tasks</strong> (things a scan can&rsquo;t
        catch) — with checks based on <strong>WCAG 2.2 Level AA</strong> (
        <Ext href="https://support.wix.com/en/article/accessibility-about-the-accessibility-wizard-5119725">Wix Help</Ext>).
        It&rsquo;s a genuinely useful first pass — but a starting point, not a guarantee: Wix itself notes the Wizard
        does <strong>not</strong> scan your CMS content, checkout, password-protected pages, or third-party apps, and
        only covers your primary language.
      </p>

      <h2 className="font-display" style={h2}>The signature Wix problem: reading &amp; tab order</h2>
      <p style={p}>
        Wix&rsquo;s free-form canvas lets you drop elements anywhere visually — but screen readers and the keyboard
        Tab key follow the underlying <strong>DOM order</strong>, not where things sit on screen. So content can be
        announced or focused out of sequence. Fix it in the Wizard:{" "}
        <strong>Detected Issues → Site Level → Organize DOM Order → Manually</strong>, then drag elements into a logical
        order in the Layers panel (
        <Ext href="https://support.wix.com/en/article/accessibility-checking-and-adjusting-a-sites-dom-order">Wix Help</Ext>).
        Watch the gotcha: <strong>pinned elements</strong> (sticky headers, floating buttons) get pushed to the{" "}
        <em>end</em> of the tab sequence.
      </p>

      <h2 className="font-display" style={h2}>What you own</h2>
      <ul style={{ marginBottom: 18, paddingLeft: 22 }}>
        <li style={li}><strong>Alt text</strong> — click an image → the <em>Settings</em> icon → fill in &ldquo;What&rsquo;s in the image?&rdquo;. Wix can auto-generate alt text with AI; review it before shipping — don&rsquo;t trust it blind.</li>
        <li style={li}><strong>Heading structure</strong> — select text → Text panel → <em>SEO &amp; Accessibility</em> → choose the HTML tag. One <code>&lt;h1&gt;</code> per page, sequential H2/H3, no skipped levels.</li>
        <li style={li}><strong>Color contrast</strong> — add the Wix <strong>Contrast Checker</strong>; aim for 4.5:1 (normal text) / 3:1 (large text). Template defaults sometimes fail.</li>
        <li style={li}><strong>Descriptive link text</strong> — the Wizard&rsquo;s Manual Tasks prompt for this; avoid bare &ldquo;click here.&rdquo;</li>
        <li style={li}><strong>Third-party apps</strong> — the Wizard can&rsquo;t scan App Market apps you&rsquo;ve embedded, so test those by hand.</li>
      </ul>

      <h2 className="font-display" style={h2}>The trap to avoid</h2>
      <p style={p}>
        The Wix App Market has one-click &ldquo;accessibility&rdquo; overlay/widget apps. They don&rsquo;t fix your
        underlying site and they don&rsquo;t stop lawsuits — the{" "}
        <Ext href="https://overlayfactsheet.com/">Overlay Fact Sheet</Ext> (1,000+ signatories) states no overlay makes
        a site compliant, and in 2025 the US FTC charged overlay vendor accessiBe over compliance claims it
        couldn&rsquo;t back up, settling for <strong>$1M</strong> (
        <Ext href="https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-order-requires-online-marketer-pay-1-million-deceptive-claims-its-ai-product-could-make-websites">FTC</Ext>).
        Use the Wizard and fix the real issues instead.
      </p>
      <p style={p}>
        Want to see which laws your Wix site is exposed under — beyond what the Wizard checks?{" "}
        <a href="/" style={aStyle}>Scan your URL</a> with A11y Beast: real browser, 125+ checks, mapped to 16 frameworks.
      </p>
    </>
  );
}

function SquarespaceBody() {
  return (
    <>
      <p style={p}>
        Squarespace gives you accessible building blocks — alt-text fields, a built-in focus outline, contrast
        controls — but unlike Wix, it has <strong>no built-in accessibility checker</strong>, so the auditing is on
        you. And alt text behaves differently depending on the kind of image. Here&rsquo;s the practical path.
      </p>

      <h2 className="font-display" style={h2}>What Squarespace gives you — and what it doesn&rsquo;t</h2>
      <p style={p}>
        Squarespace <em>recommends</em> WCAG but doesn&rsquo;t claim its templates conform, and it provides: dedicated
        alt-text fields, a focus outline + &ldquo;Skip to Content&rdquo; link on Tab, contrast controls in the Colors
        panel, and captions/transcripts (
        <Ext href="https://support.squarespace.com/hc/en-us/articles/215129127-Accessibility-resources-at-Squarespace">Squarespace docs</Ext>).
        Two honest caveats: the Colors panel is a <strong>manual design aid, not an automated contrast checker</strong>;
        and there&rsquo;s <strong>no native scanner or wizard</strong> — Squarespace points you to third-party tools,
        and its SEO Report only flags <em>missing</em> alt text (presence, not quality). So you have to bring your own
        auditing.
      </p>

      <h2 className="font-display" style={h2}>Alt text: it depends on the block</h2>
      <p style={p}>
        This is the Squarespace gotcha — alt text isn&rsquo;t set the same way everywhere (
        <Ext href="https://support.squarespace.com/hc/en-us/articles/206542357-Adding-alt-text-to-images">Squarespace docs</Ext>):
      </p>
      <ul style={{ marginBottom: 18, paddingLeft: 22 }}>
        <li style={li}><strong>Image blocks:</strong> a dedicated <em>Image alt text</em> field (Content tab) — type it in.</li>
        <li style={li}><strong>Gallery images:</strong> the image <em>description</em> becomes the alt text.</li>
        <li style={li}><strong>Product images:</strong> set in the product metadata — otherwise the product name is used.</li>
        <li style={li}><strong>Background images:</strong> can&rsquo;t take alt text at all; use an image block instead if the image carries meaning.</li>
      </ul>

      <h2 className="font-display" style={h2}>The usual suspects</h2>
      <ul style={{ marginBottom: 18, paddingLeft: 22 }}>
        <li style={li}><strong>Color contrast</strong> — the most-cited Squarespace issue (pastel text/buttons). Since there&rsquo;s no native checker, test with an external tool and target 4.5:1 (normal) / 3:1 (large), then fix in the Colors panel.</li>
        <li style={li}><strong>Heading structure</strong> — one <code>&lt;h1&gt;</code> per page, logical H2/H3 order; never fake a heading with bold text.</li>
        <li style={li}><strong>Descriptive link text</strong> — &ldquo;visit our contact page,&rdquo; not &ldquo;click here.&rdquo;</li>
        <li style={li}><strong>Code Injection</strong> (Business/Commerce plans) — anything you paste in can add untested, inaccessible markup; audit it.</li>
      </ul>

      <h2 className="font-display" style={h2}>The trap to avoid</h2>
      <p style={p}>
        Many Squarespace owners paste an &ldquo;accessibility&rdquo; overlay/widget script into Code Injection. It
        doesn&rsquo;t fix the underlying site and doesn&rsquo;t stop lawsuits — the{" "}
        <Ext href="https://overlayfactsheet.com/">Overlay Fact Sheet</Ext> (1,000+ signatories) says no overlay makes a
        site compliant, and in 2025 the US FTC charged overlay vendor accessiBe over compliance claims it couldn&rsquo;t
        back up, settling for <strong>$1M</strong> (
        <Ext href="https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-order-requires-online-marketer-pay-1-million-deceptive-claims-its-ai-product-could-make-websites">FTC</Ext>).
        Fix the content and markup instead.
      </p>
      <p style={p}>
        Because Squarespace won&rsquo;t audit for you, <a href="/" style={aStyle}>scan your URL</a> with A11y Beast —
        real browser, 125+ checks, every finding mapped to the 16 laws it implicates, plus the code to fix it.
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
  {
    slug: "do-accessibility-overlays-work",
    title: "Do accessibility overlay widgets actually work?",
    description:
      "Overlays promise instant accessibility and lawsuit protection. The litigation data, the FTC's $1M action against accessiBe, and the disability community all say otherwise. Here's why — and what to do instead.",
    dek: "The litigation data, a $1M FTC action, and the disability community all point the same way: overlays don't deliver compliance.",
    datePublished: "2026-06-16",
    tags: ["accessibility overlays", "overlay widgets", "accessiBe", "FTC", "WCAG"],
    readingMinutes: 5,
    Body: OverlaysBody,
  },
  {
    slug: "section-508-compliance-explained",
    title: "Section 508 compliance, explained",
    description:
      "What Section 508 requires, who it covers (federal agencies — and vendors, indirectly), the WCAG 2.0 AA standard it references, and how VPATs and ACRs fit in.",
    dek: "What the law requires, who's on the hook, the WCAG 2.0 AA standard it points to, and how VPATs/ACRs work.",
    datePublished: "2026-06-16",
    tags: ["Section 508", "WCAG 2.0", "VPAT", "ACR", "federal", "ICT"],
    readingMinutes: 5,
    Body: Section508Body,
  },
  {
    slug: "which-wcag-version-does-the-law-require",
    title: "Which WCAG version does the law require — 2.0, 2.1, or 2.2?",
    description:
      "Section 508 cites WCAG 2.0 AA, the ADA Title II rule cites 2.1 AA, the EU's EN 301 549 cites 2.1 AA, and ADA Title III cites nothing. The required version is set by each law — not by the latest release.",
    dek: "Section 508 → 2.0 AA. ADA Title II → 2.1 AA. The EAA → 2.1 AA. The version is set by the law that applies, not the newest release.",
    datePublished: "2026-06-16",
    tags: ["WCAG 2.0", "WCAG 2.1", "WCAG 2.2", "ADA Title II", "EN 301 549", "Section 508"],
    readingMinutes: 5,
    Body: WcagVersionBody,
  },
  {
    slug: "why-web-accessibility-lawsuits-are-surging",
    title: "Web accessibility lawsuits in 2025 — the surge, and what they cost",
    description:
      "5,114 digital accessibility lawsuits in 2025 (UsableNet); federal website suits up 27% (Seyfarth: 3,117). What's driving it — and what one actually costs: the $4,000 Unruh floor, ~$16K typical CA settlement, ~$143K to fight to the end.",
    dek: "5,114 suits in 2025, federal filings up 27% — plus what one actually costs (the $4,000 Unruh floor, ~$16K typical CA settlement, ~$143K to fight to the end).",
    datePublished: "2026-06-16",
    tags: ["accessibility lawsuits", "ADA", "UsableNet", "Seyfarth", "litigation trends"],
    readingMinutes: 4,
    Body: LawsuitTrendsBody,
  },
  {
    slug: "california-unruh-act-and-your-website",
    title: "The California Unruh Act and your website",
    description:
      "California's Unruh Civil Rights Act turns an ADA web violation into statutory damages of at least $4,000 per offense — which is why the state is a web accessibility litigation hotspot. Here's how it works.",
    dek: "Why an ADA web violation in California is worth at least $4,000 per offense — and what Robles v. Domino's established.",
    datePublished: "2026-06-16",
    tags: ["Unruh Act", "California", "ADA", "statutory damages", "Robles v Domino's"],
    readingMinutes: 4,
    Body: UnruhBody,
  },
  {
    slug: "what-automated-accessibility-scans-can-and-cant-catch",
    title: "What automated accessibility scans can — and can't — catch",
    description:
      "Automated tools catch roughly a third to a half of accessibility issues — never all of them. Here's what scanning does well, what needs human review, and why no scan can declare a site 'compliant'.",
    dek: "Scanners catch a third to half of issues, never all. What automation does well, what needs a human, and why no scan equals 'compliant'.",
    datePublished: "2026-06-16",
    tags: ["automated testing", "WCAG", "axe-core", "WCAG-EM", "conformance"],
    readingMinutes: 5,
    Body: AutomatedLimitsBody,
  },
  {
    slug: "ada-compliance-deadline-2026",
    title: "The April 2026 ADA compliance deadline, explained",
    description:
      "The 'April 2026 ADA deadline' is the DOJ's Title II rule for state and local governments — and it's been extended to 2027/2028. If you're a private business, it was never your deadline. Here's what actually applies.",
    dek: "It's the government (Title II) deadline — now pushed to 2027/2028 — not a private-business one. What the date really means, and the dates that do apply to you.",
    datePublished: "2026-06-16",
    tags: ["ADA", "Title II", "compliance deadline", "WCAG 2.1", "DOJ"],
    readingMinutes: 4,
    Body: DeadlineBody,
  },
  {
    slug: "make-your-shopify-store-ada-compliant",
    title: "How to make your Shopify store ADA compliant",
    description:
      "Shopify gives you an accessibility head start, but a store isn't compliant by default. What Shopify handles (checkout, themes), what you own (alt text, contrast, apps), and the overlay-app trap to avoid.",
    dek: "What Shopify handles, what you own (alt text, contrast, theme, apps), and the one-click overlay app to avoid.",
    datePublished: "2026-06-16",
    tags: ["Shopify", "ADA", "WCAG", "ecommerce", "accessibility"],
    readingMinutes: 5,
    Body: ShopifyBody,
  },
  {
    slug: "make-your-wordpress-site-ada-compliant",
    title: "How to make your WordPress site ADA compliant",
    description:
      "WordPress can be fully accessible — but installing it doesn't make your site compliant. Accessibility-ready themes, alt text, the real failure data, helpful plugins, and the overlay plugins to avoid.",
    dek: "Accessibility-ready themes, alt text, the real WebAIM failure data, genuinely useful plugins — and the overlay plugins that make things worse.",
    datePublished: "2026-06-16",
    tags: ["WordPress", "ADA", "WCAG", "themes", "plugins", "accessibility"],
    readingMinutes: 5,
    Body: WordPressBody,
  },
  {
    slug: "ada-wcag-compliance-checklist",
    title: "ADA & WCAG 2.1 AA compliance checklist (2026)",
    description:
      "A plain-English WCAG 2.1 AA checklist grouped by the four principles, with each item marked [auto] (a scanner can catch it) or [manual] (needs human review) — so you know what tooling covers and what it can't.",
    dek: "A plain-English WCAG 2.1 AA checklist by principle, each item marked [auto] or [manual] — so you know what a scanner covers and what still needs a human.",
    datePublished: "2026-06-16",
    tags: ["ADA", "WCAG 2.1", "checklist", "Level AA", "compliance"],
    readingMinutes: 6,
    Body: ChecklistBody,
  },
  {
    slug: "make-your-wix-site-ada-compliant",
    title: "How to make your Wix site ADA compliant",
    description:
      "Wix gives you a real accessibility head start (the Accessibility Wizard), but a Wix site isn't compliant by default. The signature reading/tab-order issue, what you own, and the overlay-app trap.",
    dek: "Wix's Accessibility Wizard, the drag-and-drop reading/tab-order trap, what you own (alt text, headings, contrast), and the overlay apps to skip.",
    datePublished: "2026-06-19",
    tags: ["Wix", "ADA", "WCAG", "accessibility", "site builder"],
    readingMinutes: 5,
    Body: WixBody,
  },
  {
    slug: "make-your-squarespace-site-ada-compliant",
    title: "How to make your Squarespace site ADA compliant",
    description:
      "Squarespace has accessible building blocks but no built-in accessibility checker — so auditing is on you. Per-block alt-text rules, the usual contrast/heading issues, and the overlay-script trap.",
    dek: "No native checker (unlike Wix), alt text that changes per block type, the usual contrast/heading issues, and the Code-Injection overlay trap.",
    datePublished: "2026-06-19",
    tags: ["Squarespace", "ADA", "WCAG", "accessibility", "site builder"],
    readingMinutes: 5,
    Body: SquarespaceBody,
  },
];

export function getAllPosts(): BlogPost[] {
  // Newest first.
  return [...POSTS].sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));
}

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((post) => post.slug === slug);
}
