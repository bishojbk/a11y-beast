# AccessLens — Web Accessibility Legal-Risk Market Validation

_Created 2026-06-24. Synthesized from a 5-stream primary-source research pass (WebSearch +
WebFetch). Confidence tags: **[H]** High / **[M]** Medium / **[L]** Low. ⚑ = vendor-self-reported
(treat with skepticism). Enforcement mechanism is stated per jurisdiction — never blurred._

---

## 1. Executive summary — the verdict

**Is there a real *paying* market for a $39/month self-serve legal-risk *scanner*? No — not as framed.**
The legal *pain* is real and active, but the *scanner* is the wrong thing to charge $39/mo for, and the price is indefensible against the field.

- **The pain is real but bounded.** ~3,117 federal + ~5,114 total US ADA web suits in 2025 (+27% YoY), overwhelmingly hitting **sub-$25M e-commerce SMBs**, and **accessibility widgets demonstrably don't stop the suits** (25%+ of 2024 cases had one installed). [H] But the realistic cost is **nuisance-level ($10–30K all-in)**, not existential — and the "government fines" angle is weak: **EAA fines remain unlevied a year in, AODA's C$100K/day penalty has literally never been used, Section 508 is a procurement gate not a fine.** [H]
- **The scan layer is fully commoditized.** Free and genuinely good (axe-core, WAVE, Pa11y, Lighthouse, IBM Equal Access); cheap SaaS sits *below* you (A11y Pulse $19/mo, Pope Tech $25/mo); and a **near-clone (access-lens.com) sells the same scan→dated EAA/EN 301 549 report for €39 per YEAR** — ~12× cheaper than $39/month. [H]
- **The money is in outcomes a scanner can't produce.** What people actually pay for: **lawsuit remediation ($5–75K), VPAT/ACR prep ($2–6K), manual audits ($1.25–10K)** — all human-verified, none deliverable by an automated scan. [H]

**Who's the buyer / what's the trigger?**
1. **A small business that just received a demand letter** — panic purchase, real budget, immediate. Highest intent. But they need *remediation + a defensible evidence trail*, not a monthly scanner. [H]
2. **A vendor/agency that needs a VPAT/ACR to clear procurement** — recurring, budgeted, deadline-driven, the most *durable* paying buyer. [H]

**The single biggest threat:** **commoditization from below colliding with the credibility trap.** Free OSS + a €39/yr clone + $19/mo SaaS squeeze the scanner into a no-margin gap; meanwhile any new "honest automated" claim reads like the next accessiBe (which the FTC just fined $1M for exactly that). You can't out-cheap the floor and you can't out-claim without becoming the snake oil.

**What this means for AccessLens (one line):** drop the "$39/mo self-serve scanner" framing; the defensible business is a **productized legal-evidence / VPAT outcome** (one-time or higher annual) sold to just-sued SMBs and procurement-driven agencies, with the "honest, code-level, not-an-overlay" wedge — and it must be **validated by real buyers before more build** (see `docs/go-to-market-runbook.md`).

---

## 2. Findings by section

### §1 — Is the legal pain real and quantified? **Verdict: real & rebounding, but bounded; US = litigation, not fines.**

**US ADA web litigation (mechanism: private lawsuits + demand letters, NOT government fines):**
- Federal filings (Seyfarth, the neutral docket count): 2023 **2,749** → 2024 **2,452** (−13%) → 2025 **3,117** (+27%); web = 36% of all ADA Title III federal filings in 2025. [H] ([adatitleiii.com](https://www.adatitleiii.com/2026/03/federal-court-website-accessibility-lawsuit-filings-bounce-back-in-2025/))
- Federal + state total (UsableNet ⚑, but tracks dockets): 2025 **5,114** (federal 3,195 / NY+CA state 1,919). [M] ([usablenet](https://info.usablenet.com/2025-year-end-report-on-web-accessibility-lawsuits))
- **Mechanism per jurisdiction:** Federal ADA Title III → injunctive relief + plaintiff fees, **no statutory damages**; **California Unruh** (state court) → **$4,000/violation** + fees (this is the money engine); **demand letters** → unmeasured, believed to dwarf filed suits, never tracked. [H mechanism / L demand-letter volume]
- 2025 wrinkle: ~40% of federal filings now **pro se**, plaintiffs using genAI to draft complaints — a volume accelerator. [M]

**Cost of a "drive-by" suit** (all [M/L] — defense-firm/vendor blogs, no neutral dataset):
- Quick settlement $5–20K (SMBs sometimes <$5K); defense fees $10–25K even for a fast settle; average digital-a11y settlement ~$25K; outliers $100K–$1M+. **Realistic SMB nuisance exposure: ~$10–30K all-in.** ([accessible.org](https://accessible.org/ada-website-compliance-lawsuit-settlement-amounts/))

**Who's targeted:** ~70–77% e-commerce/retail [H]; ~67% of 2024 suits hit companies <$25M revenue [M]; ~40% repeat targeting [M]; driver firms are a small CA Unruh ring (Manning Law >14% of 2025 filings, Pacific Trial, Wilshire) [M]. **Widgets don't help: >1,000 widget-using businesses sued in 2024 (25%+ of cases).** [M, corroborated]

**EAA (mechanism: regulatory fine):** Law in force 28 Jun 2025; ceilings DE €100K / IT €40K / ES up to €1M. **Reality mid-2026: essentially NO fines levied — "guidance first" posture.** France issued formal notices (Carrefour/Auchan/Leclerc) + pending NGO injunctions; Germany private *Abmahnung* letters from Aug 2025. [H on "no fines yet"] ([pivotalaccessibility](https://www.pivotalaccessibility.com/2025/09/eaa-enforcement-in-europe-following-the-june-2025-deadline/))

**Section 508 / AODA / state:**
- **508 (procurement gate):** consequence = lost federal contracts, no private fine; only matters if you sell to government. [H]
- **AODA (regulatory fine, paper tiger):** C$100K/day penalty **never once used**; 20–25 staff for 400,000+ orgs; 45 non-compliance orders since 2017; 98.8% of audits resolved with no escalation. [H] ([CBC](https://www.cbc.ca/news/canada/toronto/aoda-ontario-accessibility-enforement-1.7053294))

### §2 — Are people talking about it, and is it growing? **Verdict: real & emotionally intense, but event-spiky, not steadily growing — and scanner *products* get ~0 traction.**

- **Hacker News** [H]: recurring, high-quality pain. "Ask HN: How do I make a website in 2023 and not get sued?" lists the exact alphabet soup (ADA/WCAG/508/504/AODA/EN 301 549/EAA) and calls it "impossible" ([HN](https://news.ycombinator.com/item?id=36675451)). WSJ thread: "predatory law firm try to end your lifeline" ([HN](https://news.ycombinator.com/item?id=41231808)).
- **EAA deadline spike (HN Algolia, first-hand):** "European Accessibility Act" stories: 2024 = 1 → **2025 = 8** → **2026 = 0.** A clean deadline pulse that **fully collapsed.** "WCAG" mentions are *declining* (537→214 over 2023→2026). [H]
- **Scanner products flop on HN:** "Show HN: accessibility scanner / EAA checker" posts (2025–2026) all landed at **0–3 points, 0 comments.** [H] — topic generates fear/articles, products get near-zero organic pull.
- **A direct competitor is already in-market:** Indie Hackers "AccessiScan" (Pipo Labs, 2026-05) — same wedge, **$19–299/mo**, procurement/VPAT framing, cites the accessiBe FTC fine. [H]
- **Sentiment split:** **fear/anger dominates** ("got a demand letter, my heart sank," "shakedown") > compliance/procurement (growing, higher-WTP) > ethics (vocal minority, outnumbered). [H]
- _Caveat: Reddit is now firewalled to the research tooling; Reddit signal here is inferred via secondary sources (Shopify/Nic Chan/TestParty), not first-hand._

**Verbatim language for copy** (fear converts; "too many laws" is the differentiator):
> "I woke up to an email from an attorney that made my heart sink." · "They didn't care if my site was accessible. They just cared about how fast they could get the money." ([Shopify](https://www.shopify.com/news/accessibility-lawsuits)) · "It seems impossible… ADA, WCAG, Section 508, 504, AODA, EN 301 549, EAA."

### §3 — Will they pay? **Verdict: WEAK for a standalone scanner; STRONG for the legal outcome.**

- **Abundant evidence people pay to avoid lawsuits / clear procurement; little evidence of demand for a paid standalone scanner.** Searches for "accessiBe too expensive, I just want a cheap scanner" returned vendor blogs, not user voices — **treat "people want a cheaper scanner" as unproven.** [M in the absence]
- **Free scanners are table stakes** (W3C lists 100+); cheap SaaS undercuts $39/mo (A11y Pulse $19, Pope Tech $25). [H]
- **VPAT/ACR is a real, budgeted trigger — but it's a services/report sale, not a scan.** Template free (ITI); ACR authoring $350–950 (Accessible.org); prerequisite manual audit $1.5–5.5K; **realistic VPAT prep ~$2–6K+.** An automated scan **cannot** produce a defensible VPAT (needs manual + AT testing). [H] ([accessible.org/pricing](https://accessible.org/pricing/))
- **Trigger ranking by wallet-opening strength:** (1) demand letter received [H], (2) procurement RFP needing a VPAT [H], (3) EAA deadline — *weak today, dormant* [H], (4) ethics — rarely pays [M].

### §4 — Competitor health. **Verdict: overlay players wobbling; healthy money is anti-overlay dev tooling; OSS commoditizes detection.**

**accessiBe FTC settlement (precise) [H, ftc.gov]:** **$1,000,000** civil penalty; complaint Jan 3 2025, **final order April 2025**; deceptive claims = the "30% immediately / 70% within 48 hrs WCAG compliance" claim, the "daily rescans ensure compliance" claim, and **disguised paid endorsements** presented as independent. Bars compliance claims without competent evidence. _Community read (Roselli): accessiBe did $51.3M rev in 2024 — $1M is "the cost of doing business," so it stigmatizes the marketing, not the model._

See the competitor table in §3 below for the full map.

**Free/OSS commoditization [H]:** axe-core (~57% of issues *by volume*, ~20–30% of WCAG *success criteria*), WAVE, Lighthouse (runs axe subset), Pa11y, **IBM Equal Access (ships EN 301 549 rulesets free)**. No scanner judges contextual issues (alt quality, reading order, keyboard logic) — the remaining ~60% needs humans. **A paid tool that merely re-runs these rules is redundant;** durable value = monitoring/regression over time, prioritized remediation, and **legal-evidence artifacts** — but even EN 301 549 rulesets are free, so the *packaging of evidence* must carry the value.

### §5 — The overlay backlash. **Verdict: "not an overlay" is a viable wedge, NOT a poisoned well — but only with radical honesty about the ~30–40% ceiling.**

- **overlayfactsheet.com** — Karl Groves + **1,031 signatories** (incl. spec authors & a11y staff at Google/Microsoft/Apple/Shopify); names accessiBe, UserWay, AudioEye, EqualWeb; "full compliance cannot be achieved with an overlay," 67% of disabled users rate them not effective. [H]
- **Overlays attract, don't prevent, suits:** UsableNet — **25% (1,023) of 2024 suits explicitly cited widgets as barriers**; 2025 midyear shows widget-mention filings every month. [H]
- **FTC action is category-defining in *buyer* perception** (law firms now warn businesses *using* overlays), though financially toothless to vendors. [H]
- **The lane is open:** market is actively re-sorting toward "code-level, fixes-your-actual-HTML, not-an-overlay" tools (RatedWithAI, TestParty, Silktide, WCAGSafe positioning here). The community's anger was at **deceptive DOM-patching + false compliance claims, not automation per se.** [H]
- **The trap (non-negotiable guardrail):** the most credible truth in the space is "automation catches only ~30–40%." Any tool promising automated "compliance" or "lawsuit-proofing" walks straight into accessiBe's crime and gets lumped with the snake oil. [H]

---

## 3. Competitor map

| Name | Positioning | Pricing (2026) | Funding / health | Sentiment | Legal trouble |
|---|---|---|---|---|---|
| **accessiBe** | SMB overlay leader | ⚑ ~$59/mo → $3,990/yr, metered [M] | K1-backed, ~$58M raised; $51.3M rev '24 | Backlash-heavy; opaque pricing gripes | **$1M FTC settlement, final Apr 2025** [H] |
| **UserWay** | Overlay + remediation | ⚑ ~$49–249/mo [M] | **Acquired by Level Access, ~$98.7M, Mar 2024** [H] | G2 ~4.7 (644+) | Overlay-category backlash |
| **Level Access** | Enterprise platform + services (anti-overlay post-merger) | Quote-based | **KKR + JMI**; ⚑ first a11y co. past $100M ARR (Dec '24) | Enterprise | None notable |
| **AudioEye** (NASDAQ: AEYE) | Public overlay-**hybrid** | Quote-based + SMB self-serve | **Rev $35.2M→$40.3M (+15%); GAAP net loss $(3.1)M; stock ~$6, −85% from '21 peak** [H] | G2 4.7 (~229) | Securities class action (2022–23) re efficacy |
| **Deque / axe-core** | Respected **anti-overlay** dev tooling; OSS engine standard | axe DevTools ~$40–45/user/mo; enterprise gated | Private; est. ~$41–52M rev [L-M] | Strong practitioner rep | **None** [H] |
| **Siteimprove** | Broad DX suite (a11y = 1 module) | ⚑ $15K–150K+/yr | **Nordic Capital-owned**; ~$103M rev, flat growth | G2 4.6 (~427); "outdated UI" | None; **2023 sales layoffs** [M] |
| **Evinced** | Enterprise dev-side AI a11y; anti-overlay | Contact sales | **~$112M raised (Series C $55M, Dec '24)** [H] | Thin/premium | None |
| **Stark** | Design-time a11y (Figma) → platform | Free → ~$99/yr/user | Seed $6M; Series C w/ 8VC ('25) | Well-regarded | None |
| **Equally AI** | "Flowy" AI a11y — but still ships a widget | Demo/trial only | Undisclosed | No reliable data | Widget = overlay-adjacent risk |
| **TestParty** (newcomer) | AI scan + **source-code fixes via GitHub PRs**; anti-overlay | Not public | Seed $4M (Jun '24) + NSF SBIR | New | None (its lawsuit stats are marketing) |
| **access-lens.com** | **Near-clone**: scan → dated EAA/EN 301 549 PDF, white-label, 1-click fixes | **€19 launch / €39 per YEAR** | Unknown (EU, indie) | n/a | None |
| **AccessiScan** (Pipo Labs) | Indie scanner → procurement VPATs | **$19–299/mo** | Indie (Indie Hackers) | New | None |

---

## 4. Implications for AccessLens

**Where the $39/mo + AI-fix + VPAT/ACR angle fits — and doesn't:**
- **$39/mo self-serve scanner: doesn't fit.** You're ~12× a feature-comparable clone (€39/yr), above cheap SaaS ($19–25/mo), and competing with genuinely-good free tools on the commoditized layer. Don't anchor the business here. [H]
- **AI-fix (Anthropic SDK): a feature, not a moat, and a liability if over-claimed.** TestParty already does AI source-code PR fixes funded. Frame as "suggested fixes for review," never "automated compliance" — that's the accessiBe trap. [H]
- **VPAT/ACR: the realest paid trigger — but it's a *services/evidence outcome* ($2–6K), and an automated scan can't produce a defensible one.** This is the lane: package a **scan-assisted, human-verified VPAT/evidence deliverable**, not a $39/mo scan. [H]

**What to build first (after validation):**
1. Nothing new yet — **validate the agency/just-sued-SMB outcome sale by hand first** (`go-to-market-runbook.md`).
2. If validated: the **VPAT/EN 301 549 evidence deliverable** (scan-assisted, honest, dated) priced against the $2–6K VPAT, sold to procurement-driven agencies + panicked SMBs.
3. Lead generation on **fear + "widgets won't save you"** (the strongest, most-quotable, evidence-backed angle), convert on **procurement/evidence**.

**What would kill it:**
- Pricing as a $39/mo scanner → squeezed to zero margin by free/clone/cheap-SaaS.
- Over-claiming automated "compliance"/"lawsuit-proof" → instant accessiBe-style credibility death + FTC exposure.
- Leaning on EAA *fines* as the urgency → they're dormant; the trigger isn't opening wallets.
- Betting on Reddit/HN as the channel → scanner products get ~0 organic traction there.

---

## 5. Open questions / couldn't verify

- **Reddit first-hand signal** — the tooling is firewalled from Reddit; r/webdev, r/accessibility, r/shopify sentiment is *inferred via secondary sources*, not directly observed. Worth a manual pass (or a read-only Reddit MCP).
- **Demand-letter volume** — believed to dwarf filed suits, but no reliable count exists anywhere.
- **EAA enforcement trajectory** — "fines inevitable" is asserted; whether/when member states actually levy them is unknown. Re-check quarterly.
- **Settlement amounts** — no neutral dataset; all figures are defense-firm/vendor-sourced and directional only.
- **Private-company financials** (Deque, Siteimprove rev; Stark Series C size; Equally AI funding) — third-party estimates or unverified; cite no hard number.
- **Willingness-to-pay for *our* specific evidence deliverable** — the entire premise — is **still unvalidated by a real buyer.** That's the validation sprint's job, and no amount of desk research substitutes for it.

_Sources are linked inline. Strongest neutral anchors: Seyfarth (federal counts), CBC (AODA), FTC (accessiBe), overlayfactsheet.com, HN Algolia (volume). Vendor/defense-firm figures (UsableNet, TestParty, EcomBack, Karlin) are directional and flagged ⚑/[M] throughout._

---

## 6. Deep dive (2026-06-24) — feature teardown, differentiation, and what buyers actually pay for

_Real product pages fetched. Fills the gap the first pass missed: feature-level competition, where our white space is, and the willingness-to-pay object + buy trigger._

### Feature-gap matrix (fetched 2026-06-24)
| Competitor | Hook | Price | Monitoring | VPAT/ACR or styled PDF | White-label | Note |
|---|---|---|---|---|---|---|
| **WCAGSafe** | "60s scan → **legal-risk score** + fixes + **dated ADA cert** + monthly monitor", anti-overlay, free-to-start | free + paid | ✅ monthly | ✅ "ADA Audit Certificate" + PDF | — | **Near-verbatim clone of our wedge; ships the 2 things we lack** |
| **RatedWithAI** | Anti-overlay, real-browser (Playwright), continuous score | **$29/mo flat, per-site** | ✅ scheduled | per-element report | — | **Undercuts a $49/mo solo Pro; flat per-site = our exact pricing principle** |
| **access-lens.com** | EU EAA conformance PDF (EN 301 549 + Annex I) | **€39/YEAR** | — | ✅ styled PDF + Excel, white-label | ✅ | EU-EAA only (no US/ADA) — the clone, cheaper |
| **AccessibilityChecker.org** | scan→AI fix→**Compliance Vault**→LiveStatement→VPAT | $69–359/mo | ✅ weekly | ✅ annual VPAT + cert | ✅ + **20% rev-share** | Most feature-complete; **issues *certificates* + its "SmartFix" injects JS at runtime = a covert overlay** |
| **AccessiScan** | US municipal procurement VPAT + auto-fix PRs | $19–299/mo | ✅ | ✅ **white-label VPAT 2.5 @ $49** | ✅ | Self-signed TLS cert = thin solo op |
| **GetWCAG** | Monitoring platform; cadence = the price ladder | $19–999/mo | ✅ daily→quarterly | ✅ ACR (VPAT 2.5) + PDF | — | The template for the monitoring product we lack |
| **A11y Pulse** | Dev-native monitor, Slack/Teams alerts, **MCP + API** | $19–159/mo | ✅ daily | PDF only | — | Closest to us in *philosophy* (honest, anti-overlay, has an MCP) |
| **TestParty** | AI **source-code fixes via GitHub PRs** + human audits | $1–5k/mo | ✅ | (fixes, not docs) | ✅ **reseller program** | **Most dangerous in the agency lane we're prioritizing** |
| **Equally AI** | AI **overlay widget** + Flowy + services | **$38/mo (overlay)** | ✅ | ✅ (services) | top tier | ⚠️ It's an OVERLAY — a different category. _Correction: POSITIONING.md's "$45/mo & broader" is wrong; it's a $38/mo widget._ |
| **Silktide** | Whole-site QA suite (a11y = 1 module) | quote, 12-mo | ✅ | dashboards | — | WCAG-quality-centric, not lawsuit-centric |
| **Pope Tech** | WAVE-engine team platform + manual + training | free + $25–400 | ✅ | — | — | Sells to a11y *teams/programs*, little overlap |
| **Deque axe DevTools/Monitor** | The incumbent; **IGT → ~80% coverage** | ~$1.2–2.5k/seat/yr | ✅ 25k+ pp | BI reports | — | **We're built ON their axe-core — downstream, not a peer** |

### What we LACK that is table-stakes (recurring across ~all of them)
1. **Scheduled monitoring + alerts** — *every* serious competitor has it; two positioning-clones (WCAGSafe, RatedWithAI) lead with it. Our diff/ledger only runs on a manual re-scan. **#1 gap.**
2. **A portable, formal evidence document** — VPAT/ACR (GetWCAG, AccessiScan, Equally, AccessibilityChecker) or styled PDF (everyone). We emit Markdown + a localStorage hash. **Critical for the agency/procurement buyer.**
3. **Accounts / billing / server-side persistence** — localStorage evidence can't be shared, can't survive a cleared browser, isn't credible as "proof we hand a regulator." For an *evidence* product this is near-mission-critical.
4. (White-label/agency program — TestParty, AccessibilityChecker, AccessiScan all have one; we prioritize agencies but have none.)

### What we UNIQUELY do (the only defensible ground)
1. **Deterministic per-finding mapping to 16 legal frameworks, non-LLM, + an honest-language guard that refuses to overclaim.** Nobody else gives a 16-jurisdiction, hallucination-free legal-risk breakdown on one free scan. Competitors either list a few frameworks, deliberately avoid "which law" (Deque/Silktide), or issue **fake certificates / auto-VPATs** (the exact FTC-fined overclaim). **"The tool that won't let you lie" is genuinely unoccupied post-accessiBe-$1M.**
2. **SHA-256 tamper-evident, dated evidence record + regression-diff ledger + a public CLI that benchmarks vs axe/Pa11y/Lighthouse.** No competitor ships a cryptographically verifiable artifact; WCAGSafe's "certificate" and Deque's "trend" aren't signed.

**Honest bottom line:** on the **scan + standards coverage we are undifferentiated** (commodity; a €39/yr clone exists). Our **only** defensible ground is the **trust/evidence layer** — but that moat is undermined while we lack monitoring + a portable document + accounts, because rivals "check the evidence box" with a VPAT + vault before a buyer ever appreciates our hashing. **Most dangerous: WCAGSafe** (clone that ships what we lack). Runners-up: **RatedWithAI** (pricing/distribution), **TestParty** (agency lane).

### What buyers PAY FOR — ranked by real willingness-to-pay
Through-line: **buyers pay for documented outcomes that satisfy a third party (a procurement officer, a court, a regulator). They do NOT pay for the scan.**
1. **VPAT / ACR document** [H] — cleanest money-maker; a deal-*blocker*, not a nicety. À la carte $350–950 (Accessible.org); audit-backed $1–5k.
2. **Manual human audit** [H] — the premium anchor: SMB $1.25–7k, mid $7–25k.
3. **Lawyer-ready dated evidence / immutable audit trail** [M-H] — the EAA-era money object, **closest to our thesis**. UserWay prices the *documentation* layer at **$18k/yr (Legal) / $29k/yr (Conformance)** — 30–60× the base widget. Young, opaque, sold top-down to legal.
4. **Remediation (someone fixes the code)** [M-H] — largest spend, but lumpy consulting, not a clean SKU.
5. **Monitoring** [M] — recurring tier, rarely the hero.
6. Statement [M, tiny]. 7. **Raw scanning [EXPECTED FREE, ~$0 WTP].** 8. **"Compliance badge" [NEGATIVE — FTC liability].**

**The structural price gap:** cheap software ($19–149/mo) → **GAP ($1–5k)** → audit+VPAT ($1.25–25k) → enterprise ($15–150k/yr). **What bridges the gap is the document/evidence, not more scanning.**

### The IMPULSE / buy trigger — and the hard truth
Only **two** triggers reliably open a wallet *immediately*, and both are "a named, dated threat to YOU" — not a news-calendar deadline:
1. **A demand letter / lawsuit just arrived** [H] — but the first call is a **lawyer**, then audit/remediation; tooling is bought *inside the legal-defense bundle*, not standalone.
2. **A VPAT demanded in a live deal/RFP with a deadline** [H] — revenue is blocked; buyer = founder/RevOps.

Slower/weaker: DOJ Title II (budget cycles; deadline slipped to 2027/2028); **EAA "deadline" demonstrably fizzled — zero fines** (the only converting EAA variant is the German *Abmahnung* warning letter, which is a demand-letter trigger in EAA costume); board mandate = a budget *multiplier*, not a trigger; PR/brand risk = weakest (and the community is hostile to fear-marketing).

**Is it an impulse buy? NO — it's a considered, multi-stakeholder B2B purchase.** [H] Instant self-serve checkout in this market exists ONLY for cheap overlay widgets (≤~$124/mo) and free dev tiers; the moment a product touches audits/VPATs/"compliance," *every* vendor switches to "contact sales / book a demo." The realistic motion = **founder-led hand-selling into the web-agency channel, fronted by a free-scanner PLG wedge, with the evidence/VPAT outcome closed by a human** (the Vanta/Drata SOC-2 pattern). Treat the demand-letter moment as demand-gen (SEO/content), not a checkout.

**Free→paid conversion:** give the on-screen finding free; **gate the export/the take-away document** (so it reads "take the proof to your boss," not "we hid the answer") and the **multi-page crawl** (self-selects real sites). Monitoring is retention, not acquisition. Avoid the $200–500/mo no-man's-land.

### Corrections to internal docs (from the real pages)
- **Equally AI is a $38/mo OVERLAY widget, not "$45/mo and broader"** — re-anchor the per-site monitoring comps to RatedWithAI **$29/mo flat** and WCAGSafe (free-to-start). Both reconfirm a $49/mo solo Pro is hard to justify.
- The **"no monitoring" gap is not a nicety** — it's the one feature 100% of serious rivals have and two clones lead with.
