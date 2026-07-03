# AccessLens / A11y Beast — Session Handoff

_Last updated: 2026-07-03. Working handoff for the next Claude session. **Read "📍 Where we are right now" immediately below — short version: STRATEGY PIVOTED 2026-07-03 (user decision) to self-serve freemium + Reddit distribution; NO cold outreach. Next: build the Pro paid product (email-gate → auth → Stripe → hosted ledger → crawl → PDF) at the new $19/mo price, then fire the Reddit posts.** Deep history is in the dated sections further down + the user's auto-memory notes._

## What this is
A11y Beast (repo: `a11y-beast`, product dir `~/Personal/accesslens`) — a Next.js 16 + TypeScript web **accessibility legal-risk scanner**. Puppeteer + axe-core renders a page, runs 110+ checks, maps each WCAG violation to **16 legal frameworks** (ADA, EAA, Section 508, …) with an honest "automated-coverage" score. Positioning: **legal intelligence + anti-overlay**, NOT "another WCAG checker" and never "guaranteed compliance" (the FTC fined an overlay vendor $1M for that claim — stay clear of it).

## 📍 Where we are right now (2026-07-03 — READ THIS FIRST)
**Phase: BUILD THE PAID PRODUCT (self-serve). On 2026-07-03 the user explicitly pivoted the go-to-market: NO cold email, NO hand-sold agency outreach. New model = free Reddit-distributed scanner → people see the value → self-serve Pro/Agency signup. This supersedes the "validation sprint by hand" plan below (kept for history).**

**Decisions locked 2026-07-03 (user-confirmed):**
- **Pro $19/mo · $190/yr** (down from $49, which three research passes killed as above-field). Pro = full-site crawl + hosted dated/hashed evidence ledger + scheduled re-scans/diffs + exportable PDF evidence record.
- **Agency $99/mo founding price, publicly capped (first 15–20 agencies), $249 list price shown.** Founding cap = the price-discovery mechanism (the 2026-07-02 research confirmed NO vendor publishes agency/partner pricing anywhere — $249 has zero public comps). Agency = Pro + multi-client workspaces + white-label branding on the evidence record.
- **Free stays gloriously free:** single-page scan, full 16-framework diagnosis, no email gate on the scan itself. The information is free; the evidence *workflow* (persistence, portability, branding) is paid.
- **Sequencing: build Pro FIRST, then Reddit.** Do not fire the one-shot subreddit posts before a real buy button exists.

**Build order — ✅ ALL 6 PHASES BUILT 2026-07-03 (one session, committed per phase, each live-verified + axe-0):**
1. **Email-gated exports** (`EmailUnlock.tsx`; waitlist source `report_unlock`; localStorage flag `a11y-beast:report-unlock`; regression script `.verify-emailgate.mjs`).
2. **Accounts** — Drizzle + Postgres via `DATABASE_URL` (**PGlite auto-fallback in `.dev-db/` when unset — zero-setup dev**); DB sessions (SHA-256 token hash, httpOnly/secure/lax, 30d); routes `api/v1/auth/{signup,signin,signout,me}`; `/signin` `/signup` `/account` pages; header live auth state (`ab:auth-changed` event). Prod DB: provision Neon via Vercel, set `DATABASE_URL`, run `node scripts/db-migrate.mjs`.
3. **Stripe** — checkout/webhook/portal/status routes; **degrades to waitlist CTAs until `STRIPE_*` env vars are set** (see `.env.example` for the 3 prices to create: $19/mo, $190/yr, $99/mo founding); founding cap (20) enforced in checkout + shown publicly; webhook syncs plan from subscription price.
4. **Server evidence ledger** — `api/v1/evidence` GET/POST, per-plan limits (free 1 site×5, pro 3×24, agency 25×24), hash dedup, trim; results page prefers server prior for the diff; account page lists sites.
5. **Plan-gated crawl** — `api/v1/crawl` entitlement = session plan (pro 12 pages / agency 25, clamped); `ENABLE_SITE_CRAWL` is now only a dev override; homepage shows a real whole-site checkbox to pro/agency.
6. **Evidence PDF + white-label** — `api/v1/evidence/pdf` (Pro+; sanitizes the untrusted record field-by-field; shared Puppeteer + render semaphore); Agency stamps saved `users.brand_name` as "Prepared by" (form on `/account`, `api/v1/account/brand`).
**Full-site axe sweep after the build: 0 violations, 14 routes × 2 themes (`.axe-sweep.mjs`, scroll+final-state harness).** Adversarial review of the diff run via workflow — findings + fixes recorded below/in git.

**4th research pass (2026-07-02, adversarial deep-research → `docs/deep-research-viability-2026-07-02.md`): CONDITIONAL GO with one reframe.** Verified: 2025 US suits hit a RECORD (5,114 total; 3,117 federal +27%; **46% of federal cases = repeat defendants — the single strongest sales hook found**); accessiBe gives agencies a FREE white-labeled scanner → never market "white-label scanner"; the unoccupied seam is the white-label evidence RECORD (AudioEye prohibits white-labeling; no incumbent ships the record). REFUTED (don't use): HHS-504 healthcare deadline as a demand segment; Belkins cold-email benchmarks.

**Launch blockers before the Reddit posts fire:** (a) custom domain + name decision — posting `accesslens-green.vercel.app` kills credibility; "AccessLens" collides with access-lens.com; "A11Y" TM risk (BOIA) stands; (b) Stripe account + keys (user-side); (c) reframe the Reddit kit CTAs from waitlist → real signup.
- **Product is live, honest, credible, and abuse-safe** at https://accesslens-green.vercel.app (all on `main`). The site was fully **redesigned** to the human-made **"The Record"** look (warm paper, evidence-green `#1C5D52`, Fraunces/Archivo/IBM Plex Mono) and **passes its own scan — 0 axe WCAG 2.2 AA violations across all 12 routes in both light + dark themes.** What exists is still the **funnel (free scan) + differentiated engine** (16-framework mapping + honesty guard + hashed evidence ledger). The **paid artifact still does not exist**: evidence is localStorage v0; no VPAT export, monitoring, accounts/billing, or real white-label.
- **Strategy re-confirmed by FRESH 2026 deep-research (not just prior notes):** scan is a commodity; the defensible seam = **honest + 16-framework legal mapping + dated verifiable evidence ledger + agency white-label**, and **no competitor holds all four**. BUT the exact wedge (small US agencies paying to white-label an honest evidence record) is **inferred, not measured**. Full 11-competitor landscape: https://claude.ai/code/artifact/1a7e54b8-a700-4974-b1ab-12049af36e3e
- ~~**Pricing verdict** / **THE NEXT MOVE (hand outreach + validation gate)**~~ — **SUPERSEDED 2026-07-03 by the pivot block above.** Historical record: the prior plan was hand-sold agency validation (≥2–3 "yes I'd pay" gate) with Reddit as a parallel awareness track; prices were Pro $49 / Agency $249. The user chose the self-serve path instead: demand validation now happens via the live funnel (scan → signup → paid conversion), not conversations. The outreach toolkit (`docs/outreach-kit.md`, `docs/target-list-starter.md`) stays in `docs/` — still useful if any agency ever replies to the founding-cap tier. The reddit kit (`docs/reddit-launch-kit.md` + board artifact https://claude.ai/code/artifact/2df26b3a-166c-4124-8792-235082b711a1) is now the PRIMARY channel, firing after Pro ships.
- **Still OPEN (decisions, not build):** product name + "A11Y" trademark (BOIA holds it); repositioning/repricing the Pro tier; `SITE_URL` still the preview domain (fix at custom-domain cutover). **PDF accessibility** is the ONE feature worth building — but only once a buyer asks; it's on the site now as an honest **ROADMAP item + demand probe** (`PdfInterestCta.tsx`), NOT shipped. **Email a11y: dropped** (no demand, no law, zero competitors ship it).

## Done in the 2026-06-29 → 07-02 session (redesign SHIPPED + go-to-market research)
Committed to `main`. Theme: make the site credible, then map the market honestly before outreach.
1. **Full redesign to "The Record"** — merged via **PR #6 (`c287897`)** and deployed. Warm-paper light default, evidence-green, Fraunces/Archivo/IBM Plex Mono; homepage rebuilt around the dated evidence record; the global token flip carried every page. Design system captured in `design.md`.
2. **Review fixes** — theme toggle now works with the light default; dark-theme honesty band no longer flips white; homepage + `dash-verdict` spacing; JSX whitespace bug (`thirdwe`/`recordof`) fixed with `{" "}`; footer credit → "EJR Bisoj"; scan CTA simplified; external links open **same-tab** (dropped `target=_blank`, kept the generated-report new tab).
3. **Accessibility re-verified with a corrected harness** — the prior sweep didn't scroll, so `whileInView` reveal-gated sections were `opacity:0` and silently skipped by axe. Re-running **with scroll + motion forced to final state** surfaced + fixed real dark-theme failures (green-as-text `--brand`→`--accent-text`; prose links given real underlines; dark tertiary `#828892`→`#969CA6`). **Now 0 violations, 12 routes, both themes.** Always use scroll+final-state for a11y checks on this site.
4. **PDF accessibility = honest ROADMAP item + demand probe** (`PdfInterestCta.tsx`, posts to the waitlist tagged `source:"pdf"`) — NOT a shipped feature. Deliberately did NOT list PDF/email as live Pro features (that's the accessiBe/AudioEye overclaim the FTC fined). Email dropped entirely.
5. **Competitor landscape** (11 rivals, live-sourced) → artifact above. Key: white-label is a *crowded/cheap* motion (not an open gap); `a11ybeast.com` does NOT exist (corrected an old note); accesstime's email/PDF are "coming soon" vapor.
6. **Pricing deep-research** (independent, adversarially verified, 21 primary sources) → verdict in the block above; saved to `accesslens-pricing-research-2026.md` (auto-memory).
7. **Reddit go-to-market** (13-subreddit research) → per-sub playbook + NPT times + 5 human-voiced ready-to-paste posts + buyer-sub comment template, folded into `docs/reddit-launch-kit.md`.
8. **Strategic refinements** (auto-memory): cold email is weak → prefer warm/community channels; Reddit validates usage not buyers; the "honesty" wedge is now necessary-not-sufficient (the field went measured after the FTC fine).

## Current state (deployed)
- **Live on Vercel**, production deploys from the **`main`** branch (Git integration). Vercel project `accesslens` (`prj_8EAK9wGKZpyKvozHFbnpTR8EhOBp`), team `team_rAyQiYDsI6noVmDIUbLIXJ3a`. URL: https://accesslens-green.vercel.app — **no custom domain yet** (the 3 domains on the account, ipllive.*/webwisestudio.agency, are unrelated).
- Production is **healthy** — every recent deploy `● Ready`, ~50s builds, latest minutes ago.
- **Vercel CLI is logged in** (`bishojbk`); `.vercel/project.json` is linked. CLI deploy/inspect works without re-auth.
- **Production env vars are set** (was the top open item — now done):
  - `WAITLIST_WEBHOOK_URL` (set ~06-17) — waitlist + monitor leads now flow to the configured sink, not just server logs.
  - `NEXT_PUBLIC_MIXPANEL_TOKEN` (set ~06-18) — Mixpanel funnel analytics now live in production (no-op without the token).
- **Vercel Web Analytics** is wired in (`<Analytics />` from `@vercel/analytics/next` in `src/app/layout.tsx`).
- **Google Search Console** verification meta tag is in place (`e6740cd`).

## Done since the 06-16 handoff (the 06-17 → 06-19 launch-prep push)
Git is **clean**; everything below is committed to `main`. In rough order:
1. **Launch research & specs** (`docs/`): `gtm-launch-research.md`, `demand-validation-research.md`, `tier-gating-spec.md`, `monitoring-feature-spec.md`, `seo-keyword-map.md`.
2. **Free "monitor this page" opt-in** (`8be432e`, `0889ac1`) — `MonitorCta.tsx` shown after a scan. **Level-1 concierge**: posts to the existing `POST /api/v1/waitlist` tagged `source:"monitor"` with the URL; leads land in the sheet/logs and re-scans are done by hand. No cron/email automation yet. Copy later reframed (`8515789`) to honest **early-access** language — does NOT claim monitoring is already running.
3. **Mixpanel funnel analytics** (`4881231`) — `src/lib/analytics.ts`, token-gated, no-op until `NEXT_PUBLIC_MIXPANEL_TOKEN` set (now set).
4. **Legal pages** (`15c700d`) — minimal `/privacy` + `/terms`.
5. **Brand consolidation** to "A11y Beast" across report/CLI output (`137a67f`).
6. **SEO/content** — blog fact-check brief + 12/12-pass consistency tightenings (`6b18f93`, `49068cb`), Wix + Squarespace guides, homepage keyword H2 (`37b8f78`), FTC phrasing tightened in posts (`f84e2db`).
7. **Launch-post drafts** (`952b83e`) — `docs/launch-posts.md`: Show HN, Reddit, IH, LinkedIn/EAA, Product Hunt; credibility-first, FTC-safe. **Not yet posted.**

## Done since 06-19 (the 06-23 session)
Committed to `main`. The theme: name the wedge, fix the pricing to sell it, kill dead UI.
1. **Evidence-ledger feature** (the defensible non-commodity wedge): EN 301 549 statement mode in `StatementGenerator.tsx`; dated, SHA-256-hashed **evidence record** (`src/lib/report/evidence-file.ts`); per-site **ledger + regression diff** (`src/lib/report/evidence-ledger.ts`, localStorage v0); **honest-language guard** (`src/lib/report/honest-language.ts`) that flags banned overclaims in generated docs. Results page gained "EN 301 549 statement" + "Evidence file" buttons. Spec: `docs/evidence-ledger-spec.md`. **Persistence is localStorage-only (demo-grade); no auth/server store yet.**
2. **POSITIONING.md** (new) — the one-page source of truth. Motto: *"Anyone can scan. We give you the dated, defensible proof you tried."* Scan = commodity/funnel; evidence ledger = product.
3. **Pricing realignment** to match the positioning — Pro **$39→$49**, Agency **$99→$249**, evidence ledger is now the headline paid value. **Free deliberately keeps the full 16-framework diagnosis** (it's the hook / the "sixteen verdicts" tagline); the *outcome* is gated: report export, evidence record, multi-page, CLI/CI. `tier-gating-spec.md` updated to match (an earlier draft of this session wrongly gated free to 4 frameworks — reverted because it broke the tagline).
4. **Footer dead links fixed** (`Footer.tsx`) — removed vaporware "API", `#cli`/`#oss` dead anchors → real targets; CLI now → `/cli` with a "Pro" pill.
5. **`/cli` page** (new, `src/app/cli/page.tsx`) — documents the real `scan`/`benchmark` commands + flags; honest "Pro / open-core / not-on-npm-yet" framing.
6. **Scanner navigation fix** — the hero scanner had no anchor, so every "scan" CTA dumped users at page top (or no-op'd). Added `id="scan"`; repointed all scan CTAs app-wide (`/` → `/#scan`): footer, header (incl. mobile), about, blog, statement-gen, pricing, results, 404.
7. **Sample report now uses a real, verifiable URL** — was the fake `demo.example-store.com`; now the W3C's own public "Before" demo (`w3.org/WAI/demos/bad/before/home.html`), with a banner inviting visitors to re-scan and verify. Avoids publicly shaming a real business.

## Done in the 06-23 continuation (QA hardening + the viability reckoning)
Committed to `main` (`3ad538c`) + this doc commit. Theme: stop drift, harden honesty/security, then face whether this is even viable.
1. **Design system centralized** — added an "Ink & Ember" content-page CSS vocabulary to `globals.css` (`doc-eyebrow/title/lead`, numbered `doc-section`s, `spec-list`, `tier-pill`, `callout`, `doc-code`, `opt-table`, `cta-band`, `prose`, blog cards) and refactored every secondary page (features, cli, about, privacy, terms, blog, statement-gen, pricing header) off inline one-offs onto it. Home/results were already polished — left alone.
2. **Honest engine numbers** — "125+/105 axe rules" → **"110+/96"** everywhere (axe-core 4.11.2 runs **96** rules + 20 custom = 116; "110+" is defensible, "125+" overshot).
3. **P0 correctness/legal fixes** (surfaced by a 4-dimension QA audit — data/claims, links, a11y, security):
   - **ADA Title II deadlines** were stale/expired → updated to the extended **Apr 26 2027 / Apr 26 2028** (DOJ interim final rule, verified vs the **Federal Register**). The blog already had the right dates; `frameworks.ts` was the stale one.
   - **California Unruh "$4,000 per visit"** → "statutory minimum per offense (courts vary on stacking)" — stopped asserting per-visit stacking our own blog debunks.
   - **Jurisdiction flag bug** — ACA ("Canada Federal") mis-flagged as **US** (matched the `federal` rule first); fixed (Canada checked before federal; California flags US since it *is* US).
   - **Self-accessibility** — removed a duplicate `id="main-content"`; the scanning state now renders inside `<main>` with an `<h1>` (we sell a11y — must pass our own bar).
4. **Cost/abuse gating (no billing yet → default OFF)** — `/api/v1/crawl` gated behind `ENABLE_SITE_CRAWL` (402); `/api/v1/fix` (Anthropic) gated behind `ENABLE_AI_FIX` (501, UI degrades gracefully) + a 24 KB input cap. Homepage crawl checkbox → a "Pro" upsell pill. Flags documented in a now-tracked `.env.example` (added a `!.env.example` gitignore exception — the template had never actually been tracked).
5. **Bug fixes** — replaced `next/script` `beforeInteractive` inline theme script with a raw `<script dangerouslySetInnerHTML>` (fixes a React 19 warning; no-flash preserved); removed the dead `--font-outfit` CSS var (Footer + results) → `--font-mono`.

## 🎯 Strategic decision (2026-06-23): VALIDATE before building more
The harder finding this session, and the call that should govern the next one:
- **`access-lens.com` ("Access·Lens") is a near-clone AND a name collision** — free axe-core scan → WCAG + EAA + EN 301 549 + a *"dated, machine-verifiable report"*, Pro **€19–39 per YEAR**. It owns our exact EN-301-549-evidence wedge, cheaply. It's **EU-EAA only (no ADA / no US litigation framing)** — so **US litigation breadth + 16 frameworks is our one remaining defensible lane**.
- **Naming** — "AccessLens" is **OUT** (direct collision). `a11ybeast.com` is **available** (RDAP 404), but the word mark **"A11Y" is USPTO-registered (Reg. 4824150) by Bureau of Internet Accessibility** in this exact field → needs a TM attorney's clearance, not a guess. "A11y Beast" is usable but weak (crowded `a11y*` namespace; "Beast" clashes tonally with selling legal evidence).
- **Pricing reality** — the app's **$49/mo solo Pro is NOT justified** (Equally AI is $45/mo and broader; access-lens €39/yr; axe/Pa11y/WAVE free). **Agency $249 IS defensible** (vs $1.25k–25k manual audits; white-label competitors $399–999). The money is the **agency/white-label deliverable anchored to audit cost** — not a monthly solo sub. See the updated `accesslens-pricing-research-2026.md` memory.
- **THE DECISION — stop building/polishing; run a 2-week validation sprint.** Hand-sell the dated evidence record to **~10 US web/design agencies** (they have recurring need and *resell*). Lead with a **free, hand-made evidence record**; probe willingness-to-pay **anchored to the $1.25k–25k audit, never to "a scanner."** **Kill criterion: <2–3 "yes I'd pay $X" / LOI → stop.** The name, the (acknowledged) AI-generated look, the pricing page, and remaining P1/P2 bugs are **ON HOLD** until a real buyer says yes. The product is already good enough to test.

## Done in the 06-24/25 session — deep validation research + the execution toolkit
Everything committed + pushed to `main`. Theme: prove (or disprove) the wedge on paper, fix the last honesty gap, and build the kit to validate with real buyers.
1. **Deep market research** (`docs/market-research.md`) — a 5-stream primary-source pass + a feature-level teardown of 12 real competitors. Verdicts:
   - Legal pain is **real but bounded** (~5,100 US web suits in 2025, ~70% e-commerce, ~$10–30k nuisance cost). **US enforcement = private litigation, NOT fines;** EAA fines are dormant (zero a year in); AODA's C$100k/day penalty has never been used; Section 508 is a procurement gate.
   - **What buyers pay for (ranked):** VPAT/ACR document → manual audit → lawyer-ready evidence trail → remediation → monitoring. **The scan is expected FREE; a "compliance badge" is NEGATIVE value (FTC).** What bridges the $1–5k price gap is the *document/evidence*, not more scanning.
   - **Trigger that opens a wallet:** a named/dated threat to the buyer — a demand letter, or a VPAT-blocked RFP/deal. The EAA "deadline" fizzled.
   - **It's a considered, multi-stakeholder B2B purchase — not an impulse buy.** Self-serve checkout in this market is only for cheap overlay widgets. Right motion = founder-led, human-closed, into the agency channel, with the free scan as lead-gen (the Vanta/Drata SOC-2 pattern).
   - **Feature gaps vs. the field:** we LACK (1) scheduled monitoring + alerts, (2) a portable VPAT/styled-PDF document, (3) accounts/billing — all near-universal among competitors. We UNIQUELY have deterministic 16-framework **non-LLM** legal mapping + an honest-language guard, and a SHA-256 evidence ledger + CLI. **Most dangerous competitor: WCAGSafe** (positioning clone already shipping monitoring + a dated certificate). NB: Equally AI is a **$38/mo overlay**, not "$45 & broader" (earlier doc error, corrected).
2. **Honest inventory — "what people pay for" vs. "what we've built":** we built the funnel + engine, but the paid objects are missing or prototype — VPAT ❌, monitoring ❌, durable/server evidence ❌ (localStorage only), AI fixes = suggestions-only and gated OFF, accessibility statement ✅ (but low-value). Verified in code.
3. **VPAT overclaim fixed** — pricing said "Expert manual review + VPAT" (Enterprise); we can deliver neither, so → **"Manual audit + VPAT via certified partners"** (honest: the formal VPAT comes from a human partner, not our scanner).
4. **The validation toolkit — the operator/next session works from these `docs/`:**
   - **`market-research.md`** — the evidence + verdicts above.
   - **`go-to-market-runbook.md`** — the two-phase model (validate before launch), the sprint, the funnel math.
   - **`outreach-kit.md`** — ICP, the sourcing recipe, per-prospect workflow, the cold-outreach **messages (§4)**, cadence, tracker, the gate.
   - **`target-list-starter.md`** — **16 verified small US agencies** to start (portfolio hooks + founder hints; confirm email/founder on LinkedIn — none invented).
   - **`reddit-launch-kit.md`** — the *parallel* awareness track; 4 audience posts (the learning-journey one for r/accessibility; the "internet for everyone" Shopify one; Wix/Squarespace; agencies) + anti-ban rules. Feedback/credibility, **NOT** the validation gate.
   - **`templates/evidence-record-template.html`** — the **white-label deliverable** you hand agencies (print-to-PDF, honest framing) — the artifact whose willingness-to-pay you're testing.

## Pricing decisions (context for future edits)
- Current numbers: Free $0 · Pro **$49** · Agency **$249** · Enterprise custom. ⚠️ **Superseded — see the 🎯 Strategic decision above:** the 06-23 competitor research found **$49/mo solo Pro is not justified** (Equally AI $45/mo broader; access-lens €39/yr; free scanners everywhere). Agency $249 holds. Reprice around the agency/deliverable anchor after validation.
- **Load-bearing call: never gate the diagnosis.** The full 16-framework breakdown stays free — it's the marketing hook and the "one scan, sixteen verdicts" tagline. Gate the *outcome* (proof/export/scale/CI), not the framework count. See POSITIONING.md + tier-gating-spec.md.
- **Usage gates (1/3/25 sites, page caps) are stated INTENT only** — nothing enforces them yet (no auth, no metering). Paid tiers are waitlist-only.
- **CLI is open-core**: engine source is AGPL-3.0 (buildable by anyone), but the published CLI + CI gate are Pro.
- Agency is intentionally thin on near-term features (mostly higher limits + bulk + priority + brandable evidence records). If asked to differentiate it pre-launch, pull one near-term capability up into it.

## What's NOT built yet (the real gaps)
- **Auth / accounts / teams** — none. No login anywhere.
- **Stripe / checkout** — deferred by the user; paid tiers route to the waitlist modal (`WaitlistCta` → `POST /api/v1/waitlist`).
- **Scheduled monitoring + regression alerts** — only the **concierge front-end** exists (`MonitorCta` → waitlist pipeline, manual re-scans). No automated cron re-scan or change-diff email yet.
- **White-label reports** — not built (roadmap).
- **Public/keyed API** — `/api/v1/*` endpoints exist but aren't productized/authenticated (roadmap).
- **Styled PDF** — legal report export is **Markdown** today, not styled PDF.

## Open action items for the user
_(Reordered 2026-07-03 for the self-serve pivot — the outreach sprint item is GONE by user decision.)_
- **🎯 #1 — User-side prerequisites for the Pro build:** create the **Stripe account** and provide test+live keys (Claude builds the integration but cannot provision the account), and make the **name + domain call** — "AccessLens" is out (access-lens.com collision); if proceeding with "A11y Beast": grab `a11ybeast.com` (was available) and get **USPTO clearance** vs the "A11Y" mark (Reg. 4824150, Bureau of Internet Accessibility) before brand spend. The Reddit posts cannot fire while the site lives at `accesslens-green.vercel.app`.
- **🎯 #2 — Build Pro** (Claude-driven, next session(s)): email-gated layer → auth → Stripe → hosted ledger → crawl gating → PDF export, per the build order in the 📍 block. Pricing page updates to $19/$99-founding as part of this (do NOT update the pricing page before the backend is real — that would be overselling).
- **🎯 #3 — Reddit launch AFTER Pro ships:** rework `docs/reddit-launch-kit.md` CTAs from waitlist → real signup, then post per the per-sub playbook. `docs/launch-posts.md` (Show HN/PH) stays held until the funnel shows conversion.
- **Site "looks AI-generated"** (user-flagged) — address before public launch; does NOT block the concierge validation sprint (you lead with a tailored report, not the homepage).
- **Custom domain** — still on `accesslens-green.vercel.app`; attach the chosen brand domain before launch.
- Confirm the **monitor/waitlist leads** are actually arriving at the `WAITLIST_WEBHOOK_URL` sink (send a test opt-in), and that **Mixpanel + Vercel Analytics** funnels are populating from production traffic.
- **Wire up the real monitoring loop** when ready (cron re-scan + change-diff email) — until then the opt-in is concierge/manual. See `docs/monitoring-feature-spec.md`.

## Build / verify gotchas
- After code changes run **both** `npm run build` (Next) **and** `npm run build:cli` (tsup). `npm start` serves stale `.next` otherwise.
- For **CSS-variable** changes, verify via clean `npm run build` + `npm start`, NOT `npm run dev` (HMR serves stale CSS for var changes). Layout/component changes are fine in dev.
- Local screenshot recipe used this session: start dev (`next dev -p 3210`), then drive the project's own Puppeteer (`NODE_PATH=$(pwd)/node_modules node script.js`, Chrome at `~/.cache/puppeteer/...`).
- Project ships a large **pre-existing lint baseline** (~104 errors in design_handoff/dist/cli/puppeteer-scanner) — not yours; don't chase it.
- AGENTS.md note: this is Next.js 16 with breaking changes — check `node_modules/next/dist/docs/` before writing framework code.

## Deploy flow
Commit to `main` → `git push origin main` → Vercel auto-builds production. (Vercel CLI was logged out last session; `vercel login` if you need CLI deploys/inspection.)
