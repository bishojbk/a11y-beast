# Evidence Ledger + EN 301 549 Statement — v0 spec (hand-sell artifact)

_Created 2026-06-22. Purpose: the thinnest demoable version of the one defensible, non-commodity asset — a **dated, evidence-backed accessibility statement** — built to **hand-sell to 3–5 real buyers** (agencies / EU SMEs), NOT a full SaaS feature. No auth, no billing, no cron. If a buyer pays for this document, we earn the right to build the recurring product behind it. See memory: `accesslens-pricing-research-2026`, `accesslens-strategic-direction`._

## The one rule that governs everything here

**Position the output as documented EFFORT and PROGRESS — never as certification or compliance.**
- ✅ "Documented accessibility effort," "conformance evidence as of [date]," "what we tested, found, and fixed."
- ❌ "Certified," "compliant," "guaranteed," "100%," "fully conformant by default."
- Why: industry consensus (and our own FTC-safety rule) is that an automated/AI-generated VPAT or statement has weak legal weight — credible conformance needs manual assistive-tech testing. Selling "certification" is the accessiBe $1M mistake. Selling **honest, dated, defensible documentation of effort** is the gap nobody fills well — and it's exactly what regulators/plaintiffs' counsel actually want to see ("not a document, evidence").

## What it produces (two linked artifacts)

1. **EN 301 549 / EAA accessibility statement** — the EU-shaped statement (more than the existing W3C-generic one), pre-filled from a real scan: standard (EN 301 549 v3.2.1 → WCAG 2.1 AA), conformance status (defaults to *Partially conformant*), known limitations auto-drafted from actual findings, feedback contact, assessment method, date.
2. **Dated evidence file** — the defensible artifact: "Site X was scanned on [date] with [tool + version]; N issues found across these EN 301 549 clauses; here is the per-clause breakdown and remediation status." Carries a generation timestamp and a content hash so it's tamper-evident.

The **ledger** = an append-only series of these dated evidence files for the same site over time (scan → re-scan → diff). Even a 2-entry ledger ("June: 41 issues · August: 12 issues, here's what we fixed") *is* the regression-proof that free scanners can't produce.

## Reuse, don't rebuild

| Need | Existing module |
|---|---|
| Scan + findings | `puppeteer-scanner`, `ScanResult`/`PageMeta` (`src/lib/types/`) |
| EN 301 549 mapping + per-clause | `src/lib/compliance/frameworks.ts` (`en-301-549`, `acceptedTags`, `missingA11yStatement`), `compliance/mapper.ts` |
| Statement UI + honest defaults | `src/components/StatementGenerator.tsx` (W3C structure, "Partially conformant" default) |
| Rendered document | `src/lib/report/html-report.ts` (`generateHtmlReport`) |
| Save + shareable link w/ expiry | `src/lib/report/share-link.ts` (`saveReport`), `POST /api/v1/share` |

## v0 scope (demoable)

**In:**
- New EN 301 549/EAA mode for the statement generator, **pre-filled from a scan result** (pass scan → draft limitations + standard + date).
- An **evidence file** view/export (extend `generateHtmlReport` or a sibling) that stamps: generated-at timestamp, tool + version, source URL, per-EN-301-549-clause findings, and a SHA-256 content hash.
- "Ledger" = persist each evidence file via the existing `saveReport` share-link store; a simple list of a site's dated entries + a diff between the two most recent (issues added/resolved).
- Honest-language linting in the copy (no banned words; effort framing).

**Explicitly OUT (v0):**
- Auth, accounts, billing, Stripe.
- Scheduled/automated re-scans (cron) — re-scan is **manual** for the hand-sell; you run it.
- Styled PDF (HTML + share link is enough to demo; PDF later).
- Multi-tenant / white-label.
- Any claim of covering the non-WCAG EN 301 549 clauses (RTT, two-way voice, synchronised media) — state plainly these need manual review.

## Data model (minimal)

```
EvidenceEntry {
  id            // share-link token (reuse saveReport)
  siteUrl
  generatedAt   // ISO timestamp (server-stamped)
  toolVersion   // e.g. "a11y-beast 0.1.0 / axe-core 4.11.2"
  standard      // "EN 301 549 v3.2.1 (WCAG 2.1 AA)"
  status        // default "Partially conformant"
  findings      // per-clause: { clause, criterion, count, severity }
  summary       // { totalIssues, byClause, byPrinciple }
  contentHash   // sha256 of the canonicalized findings+meta
}
// Ledger for a site = EvidenceEntry[] ordered by generatedAt; diff = setdiff of finding keys between last two.
```

## Hand-sell demo flow

1. Scan a prospect's real site (free path you already have).
2. Generate their EN 301 549/EAA statement + dated evidence file → share link.
3. Re-scan after they fix a few things (or after a week) → second entry → show the **diff** ("you resolved 12 of 41; here's the dated trail").
4. The pitch: *"Free scanners tell you what's broken today. This is the dated, defensible record of what you tested, found, and fixed — the evidence an EU regulator or a plaintiff's lawyer actually asks for. Want it kept current automatically?"* → that question is the upsell to the (future) Compliance tier.

## Build order (smallest first)

1. **EN 301 549 statement mode** in `StatementGenerator` + accept a scan result to pre-fill (no new storage).
2. **Evidence file renderer** — extend `html-report` with the stamped/hashed evidence layout.
3. **Persist + list** via existing `saveReport`/share store; add a tiny "ledger" list + 2-entry diff.
4. **Honest-language pass** on all generated copy.

## Validate before building further

- Will an agency/SME **pay** for this document? (the whole point — hand-sell answers it)
- Legal-defensibility framing: confirm "documented effort, not certification" wording with how EAA/Art.47 evidence is actually evaluated (still partly unverified — see `accesslens-market-reality-2026`).
- Does the 2-entry diff land as "regression proof," or do buyers want a longer trail before it feels like evidence?
