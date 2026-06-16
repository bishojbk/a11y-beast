# AccessLens / A11y Beast — Session Handoff

_Last updated: 2026-06-16. This is a working handoff for the next Claude session. For deep product/architecture history, see the user's auto-memory note `project_accesslens.md`._

## What this is
A11y Beast (repo: `a11y-beast`, product dir `~/Personal/accesslens`) — a Next.js 16 + TypeScript web **accessibility legal-risk scanner**. Puppeteer + axe-core renders a page, runs 125+ checks, maps each WCAG violation to **16 legal frameworks** (ADA, EAA, Section 508, …) with an honest "automated-coverage" score. Positioning: **legal intelligence + anti-overlay**, NOT "another WCAG checker" and never "guaranteed compliance" (the FTC fined an overlay vendor $1M for that claim — stay clear of it).

## Current state (deployed)
- **Live on Vercel**, production deploys from the **`main`** branch (Git integration). Vercel project `accesslens`, team `team_rAyQiYDsI6noVmDIUbLIXJ3a`. URL: https://accesslens-green.vercel.app
- **Vercel Web Analytics** is wired in (`<Analytics />` from `@vercel/analytics/next` in `src/app/layout.tsx`). Enabled on the dashboard; data populates from production traffic only.
- `main` and `ship/launch-prep` were reconciled (they had diverged on a byte-identical "Harden scanner" commit). `main` is now the source of truth.

## Done this session (2026-06-16)
1. Added Vercel Analytics + the homepage framework-detail modal (commit `e8784b6`).
2. **Pricing revamp** (commit `187b92c`) — `/pricing`:
   - 4 tiers: **Free $0 / Pro $39 (Most popular) / Agency $99 / Enterprise (Contact sales)**.
   - Monthly/annual **billing toggle** (annual default = "2 months free", ~17% off → Pro $33/mo, Agency $83/mo).
   - `PricingTable` (client), `PricingComparison` (feature × tier matrix), `PricingFaq` (native `<details>`, FTC-safe answers).
   - **Near-term features only** in cards; monitoring / white-label / public API live in a "roadmap" note. Founding-price microcopy ("locked in for life") replaced "free during early access".
   - Anti-overlay line in the subhead. Verified via headless-Chrome screenshots (dark/light/mobile, both toggle states).
3. Installed a **global** Claude skill `seo-geo-aeo` at `~/.claude/skills/seo-geo-aeo/SKILL.md` (SEO/GEO/AEO audit, Markdown output) — unrelated to this repo.

## Pricing decisions (context for future edits)
- Tier numbers were chosen against competitor research: overlay SMB anchor ≈ $49/mo; scanner tools $25–400; 3-tier + Enterprise is the proven structure. Pro $39 sits just under the overlay anchor as a wedge.
- **Usage gates (1/3/10 sites, page caps) are stated INTENT only** — nothing enforces them yet (no auth, no metering). Paid tiers are waitlist-only.
- Agency is intentionally thin on near-term features (mostly higher limits + bulk + priority). If asked to differentiate it pre-launch, pull one near-term capability up into it.

## What's NOT built yet (the real gaps)
- **Auth / accounts / teams** — none. No login anywhere.
- **Stripe / checkout** — deferred by the user; paid tiers route to the waitlist modal (`WaitlistCta` → `POST /api/v1/waitlist`).
- **Scheduled monitoring + regression alerts** — not built (advertised as roadmap).
- **White-label reports** — not built (roadmap).
- **Public/keyed API** — `/api/v1/*` endpoints exist but aren't productized/authenticated (roadmap).
- **Styled PDF** — legal report export is **Markdown** today, not styled PDF.

## Open action items for the user
- **Set `WAITLIST_WEBHOOK_URL`** in Vercel env — without it, waitlist leads only hit server logs (see `docs/WAITLIST_SETUP.md`). Google Sheet / Zapier / Slack all work.
- Confirm Analytics data is flowing in the Vercel dashboard post-deploy.
- Optional: custom domain; USPTO trademark clearance on "A11y Beast" / "AccessLens" before brand spend.
- GTM: Reddit-first execution.

## Build / verify gotchas
- After code changes run **both** `npm run build` (Next) **and** `npm run build:cli` (tsup). `npm start` serves stale `.next` otherwise.
- For **CSS-variable** changes, verify via clean `npm run build` + `npm start`, NOT `npm run dev` (HMR serves stale CSS for var changes). Layout/component changes are fine in dev.
- Local screenshot recipe used this session: start dev (`next dev -p 3210`), then drive the project's own Puppeteer (`NODE_PATH=$(pwd)/node_modules node script.js`, Chrome at `~/.cache/puppeteer/...`).
- Project ships a large **pre-existing lint baseline** (~104 errors in design_handoff/dist/cli/puppeteer-scanner) — not yours; don't chase it.
- AGENTS.md note: this is Next.js 16 with breaking changes — check `node_modules/next/dist/docs/` before writing framework code.

## Deploy flow
Commit to `main` → `git push origin main` → Vercel auto-builds production. (Vercel CLI was logged out last session; `vercel login` if you need CLI deploys/inspection.)
