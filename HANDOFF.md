# AccessLens / A11y Beast — Session Handoff

_Last updated: 2026-06-23 (continuation session — QA hardening + viability/validation decision). This is a working handoff for the next Claude session. **Start with the "🎯 Strategic decision" section below — the call is: validate with real buyers before building more.** For deep product/architecture history, see the user's auto-memory notes._

## What this is
A11y Beast (repo: `a11y-beast`, product dir `~/Personal/accesslens`) — a Next.js 16 + TypeScript web **accessibility legal-risk scanner**. Puppeteer + axe-core renders a page, runs 110+ checks, maps each WCAG violation to **16 legal frameworks** (ADA, EAA, Section 508, …) with an honest "automated-coverage" score. Positioning: **legal intelligence + anti-overlay**, NOT "another WCAG checker" and never "guaranteed compliance" (the FTC fined an overlay vendor $1M for that claim — stay clear of it).

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
- **🎯 #1 — Run the validation sprint (the only thing that matters next).** ~10 US web/design agencies, free hand-made evidence record, ask "would you white-label this and charge it into your audits, at what price?" 2 weeks, kill at <2–3 yes. Everything below is ON HOLD until this lands.
- **DO NOT launch yet** — `docs/launch-posts.md` is written and FTC-safe, but holding. Spending the one public launch (HN/PH/Reddit) on an unvalidated, contested wedge wastes it. Launch *after* validation succeeds + the pricing-page/AI-look fixes.
- **Name + trademark** — "AccessLens" is out (access-lens.com collision). If proceeding with "A11y Beast": grab `a11ybeast.com` (available) and get **USPTO clearance** vs the existing "A11Y" mark (Reg. 4824150, Bureau of Internet Accessibility) before any brand spend.
- **Reprice before launch** — $49/mo solo Pro is above the field; re-model around the agency/deliverable anchor (validation will inform the number).
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
