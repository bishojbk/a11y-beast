# AccessLens / A11y Beast — Session Handoff

_Last updated: 2026-06-23. This is a working handoff for the next Claude session. For deep product/architecture history, see the user's auto-memory note `project_accesslens.md`._

## What this is
A11y Beast (repo: `a11y-beast`, product dir `~/Personal/accesslens`) — a Next.js 16 + TypeScript web **accessibility legal-risk scanner**. Puppeteer + axe-core renders a page, runs 125+ checks, maps each WCAG violation to **16 legal frameworks** (ADA, EAA, Section 508, …) with an honest "automated-coverage" score. Positioning: **legal intelligence + anti-overlay**, NOT "another WCAG checker" and never "guaranteed compliance" (the FTC fined an overlay vendor $1M for that claim — stay clear of it).

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

## Pricing decisions (context for future edits)
- Current numbers: Free $0 · Pro **$49** · Agency **$249** · Enterprise custom. Chosen against competitor research (overlay SMB anchor ≈ $49/mo; scanner tools $25–400) + the principle that agencies pay more because they resell our output.
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
- **Post the launch drafts** — `docs/launch-posts.md` is written and FTC-safe but nothing has been posted yet. GTM plan is Reddit-first.
- **Custom domain** — still on the `accesslens-green.vercel.app` URL; no production domain attached. Decide + add before brand spend.
- **USPTO trademark clearance** on "A11y Beast" / "AccessLens" before brand spend (optional but advised pre-launch).
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
