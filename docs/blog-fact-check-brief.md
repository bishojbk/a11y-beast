# A11y Beast — Blog Fact-Check & Review Brief

_Paste this into a fresh Claude (or any reviewer) to verify the blog posts. It's self-contained — the reviewer needs no other context. Goal: confirm every factual/legal claim is accurate and FTC-safe, and the tone matches the brand._

---

## 1. What the product is (so you understand the voice)

**A11y Beast** (product also called AccessLens) is a **free, anti-overlay web-accessibility legal-risk scanner**. It renders a page in a real browser, runs 110+ checks (axe-core + custom), and maps each WCAG violation to **16 legal frameworks** (ADA, EAA, Section 508, California Unruh, UK Equality Act, AODA, etc.), with an honest 0–100 "automated-coverage" score.

**Positioning & voice:**
- **Legal-risk intelligence, not "another WCAG checker."** The hook: "Most tools say you fail WCAG 1.1.1. We say you're breaking 16 laws."
- **Radically honest / anti-overlay.** This is the brand's spine. It must NEVER claim it makes a site "compliant" or "guarantees" anything.
- Tone: forensic, direct, plain-English, credible. Confident but never overstated.

### ⚠️ THE CARDINAL RULE (check every post against this)
The US FTC fined overlay vendor accessiBe **$1M in 2025** for falsely claiming its product made sites "WCAG compliant." Our entire credibility rests on **not** making that mistake. So:
- Never say A11y Beast (or any tool) makes a site "compliant" or "ADA/WCAG compliant" or "lawsuit-proof."
- Always frame automated results as an **"automated-coverage indicator, not a conformance verdict."** (Automated testing covers only ~30–40% of WCAG; full conformance needs manual review.)
- Describe the FTC/accessiBe matter as **"charged / alleged / consent order / settled for $1M"** — NOT "fined for proven false claims." It was a non-admission consent order; accessiBe disputes it.

---

## 2. The 12 posts to verify (live URLs)

Base: `https://accesslens-green.vercel.app/blog/`

| # | Post | What it claims (verify these) |
|---|---|---|
| 1 | `european-accessibility-act-deadline` | EAA applied **28 June 2025**; EU e-commerce in scope; technical standard = EN 301 549 → **WCAG 2.1 AA** |
| 2 | `how-to-check-if-your-website-is-ada-compliant` | ADA Title III; target WCAG 2.1 AA; automated tools catch only ~30–40%; don't buy overlays |
| 3 | `do-accessibility-overlays-work` | Overlays don't deliver compliance; FTC $1M accessiBe order; Overlay Fact Sheet (1,031 signatories); WebAIM 67% |
| 4 | `section-508-compliance-explained` | Section 508 = federal ICT; **WCAG 2.0 AA**; in force since Jan 18 2018; VPAT/ACR; covers agencies (vendors indirectly) |
| 5 | `which-wcag-version-does-the-law-require` | 508→2.0 AA; ADA Title II→2.1 AA; EAA→2.1 AA; Title III→no codified standard; version set by law, not "latest" |
| 6 | `why-web-accessibility-lawsuits-are-surging` | 2025 lawsuit counts + **cost** ($4,000 Unruh floor, ~$16K typical CA settlement, ~$143K to defend) |
| 7 | `california-unruh-act-and-your-website` | Civil Code §51/§52; **$4,000/offense** floor; Robles v. Domino's; ADA violation = Unruh violation |
| 8 | `what-automated-accessibility-scans-can-and-cant-catch` | ~30–40% automatable; GDS/Deque figures; W3C: tools assist, can't determine conformance |
| 9 | `ada-compliance-deadline-2026` | "April 2026" = DOJ **Title II** (govt) rule, **extended to 2027/2028**; NOT a private-business deadline |
| 10 | `make-your-shopify-store-ada-compliant` | Shopify VPATs/Dawn theme/alt-text/contrast; checkout is Shopify's; avoid overlay apps |
| 11 | `make-your-wordpress-site-ada-compliant` | "accessibility-ready" theme tag; WebAIM Million stats; helpful plugins vs overlay plugins |
| 12 | `ada-wcag-compliance-checklist` | WCAG 2.1 AA by principle, each item tagged [auto]/[manual] |

---

## 3. Verified ground-truth facts (check the posts against these)

These were verified against primary sources (FTC, US Access Board, ADA.gov, W3C, ETSI, California Civil Code, FEVAD, Seyfarth, UsableNet). If a post contradicts one of these, it's wrong.

**FTC / accessiBe:** $1,000,000; complaint Jan 2025, **final consent order Apr 2025**; product = "accessWidget"; **non-admission settlement** (phrase as "charged/alleged/order," not "proven"). Order bars claiming its product makes any site WCAG-compliant without evidence.

**Overlays:** Overlay Fact Sheet = **1,031 signatories** (rising — date it). WebAIM practitioner survey: **67%** rated overlays not/not-very effective (72% of disabled respondents). Overlays don't stop lawsuits.

**Litigation (cite the YEAR — these fluctuate, not steady growth):**
- 2022: **3,255** federal website lawsuits (Seyfarth) — a *peak*.
- 2024: 2,452 federal website suits (Seyfarth).
- 2025: **3,117** federal website suits, +27% YoY (Seyfarth); UsableNet counted **5,114** total digital suits; **1,416** were against sites already running an accessibility widget.

**WCAG versions:** 2.0 (Dec 2008), 2.1 (Jun 2018), 2.2 (Oct 2023). Coexist — version is set by each law's citation, not "the latest."
- **Section 508** → WCAG **2.0 AA** (in force Jan 18 2018).
- **ADA Title II** (DOJ rule, Apr 2024) → WCAG **2.1 AA**. Deadlines were **extended ~1 year by an Apr 2026 interim rule → now Apr 26 2027 (pop ≥50k) / Apr 26 2028 (smaller)**.
- **EAA** → EN 301 549 v3.2.1 → WCAG **2.1 AA**; applied **28 June 2025**.
- **ADA Title III** (private business) → **no codified WCAG standard**; DOJ treats WCAG as guidance; practitioners target 2.1 AA.

**California Unruh:** Civil Code **§51** (§51(f): an ADA violation = an Unruh violation); **§52(a)**: statutory damages **≥ $4,000 per offense**, no proof of actual damages needed. *Robles v. Domino's* (9th Cir. 2019; cert denied Oct 2019). For a website, courts treat it as a **single** violation (not $4,000 × each visit).

**France/EAA (FEVAD):** e-commerce accessibility mandatory **28 June 2025**; fines **€7,500 → €15,000** (repeat), enforced by DGCCRF; only microenterprises (<10 employees AND ≤ €2M) exempt.

**Automated coverage:** ~**30–40% of WCAG success criteria** are automatable (industry baseline; GDS found best tools ~40% of seeded barriers). Deque claims axe finds **~57% of *issues by volume*** (different metric). W3C: tools "can not determine accessibility, they can only assist"; conformance is binary pass/fail per criterion.

---

## 4. What to flag (treat with extra scrutiny)
- Any claim a tool makes a site "compliant" or "guarantees"/"lawsuit-proof" → **must be removed/softened**.
- FTC matter phrased as a "fine for proven false claims" → soften to "charged / consent order / settled."
- Litigation stats without a **year** attached, or implying steady year-over-year growth (2022 was a peak; 2023–24 dipped).
- Specific penalty/settlement dollar figures NOT in §3 above (e.g., generic "$5K–$75K" ranges) → these were found to be **vendor estimates, not court/Seyfarth data**; flag as unverified.
- German BFSG specifics (€100k fines, "Abmahnungen since Aug 2025") → plausible but **not independently verified** in our research; flag if a post states them as fact.
- Any overlay vendor named in a defamatory (vs factual/nominative) way → keep references factual (e.g., the documented FTC action), not smears.

---

## 5. Suggested prompt to use with this brief
> "Here's context on my product and its blog (below). Fetch each of the 12 live blog URLs and fact-check every legal/statistical claim against the 'verified ground-truth facts' section. Flag: (a) any factual error or contradiction, (b) anything that claims or implies a site is 'compliant'/lawsuit-proof (forbidden), (c) FTC phrasing that overstates, (d) stats missing a year or that look unverified, (e) tone that's overstated vs the honest brand voice. Give me a per-post pass/fail with specific fixes."
