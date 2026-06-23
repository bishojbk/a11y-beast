# A11y Beast — Positioning

> The one-page source of truth for what we are, who we're for, and why we charge
> what we charge. The homepage, About page, and pricing table should never
> contradict this file. If they drift, this file wins — fix them.

## Motto

**Anyone can scan. We give you the dated, defensible proof you tried.**

## What we are (one sentence)

A11y Beast turns an accessibility scan into a **dated, tamper-evident record of
effort against EN 301 549** (the European Accessibility Act standard) — proof you
can hand to a client, a regulator, or a court that you assessed your site and
improved it over time.

## The wedge — why this isn't just another scanner

The scan itself is a **commodity**. axe-core is open source; anyone can run it
free, and Lighthouse/Pa11y/WAVE all do the same job. Competing on "we detect
accessibility issues" is a race to zero.

The thing a free scan **cannot** produce is the part that actually has value when
someone asks "what did you do about it?":

- a **dated** record tied to a specific scan,
- **tamper-evident** (SHA-256 content hash — re-derivable, alteration-detectable),
- mapped to **EN 301 549 / WCAG 2.1 AA success criteria**,
- and a **trail over time** — re-scan, diff, and show "23 criteria resolved
  since March."

That ledger of effort is the product. The scan is the funnel that fills it.

## Who it's for (in priority order)

1. **Agencies & consultancies** — they audit client sites and need a credible,
   client-ready deliverable they can bill for. Highest willingness to pay; they
   resell our output.
2. **EU SMEs subject to the EAA** — need to show a good-faith accessibility
   effort and keep an accessibility statement current.
3. **In-house dev/compliance teams** — need a paper trail for legal/procurement
   and want it wired into CI so regressions are caught.

## What we are NOT (the guardrails)

- **Not a "compliance guarantee."** Automated testing covers ~30–40% of success
  criteria. EN 301 549 also includes requirements WCAG doesn't (real-time text,
  two-way voice, synchronised media) that need manual review. We say
  **"documented effort, not certification"** everywhere — it's honest and it's
  FTC-safe. (The FTC fined accessiBe $1M in 2025 for "fully compliant" overclaims.)
- **Not an overlay.** Overlays don't fix accessibility and are rejected for
  EN 301 549. We never inject a widget into anyone's site.
- **Not a one-shot score.** A number with no date and no trail proves nothing.
  The date and the history are the point.

## Proof we can stand behind

- Public **benchmark** vs axe-core / Pa11y / Lighthouse (`docs/benchmark/`).
- **16 legal frameworks** mapped to findings, EN 301 549 modelled correctly as a
  superset of WCAG 2.1 AA (not equated with it).
- A built-in **honest-language guard** that fails generated documents containing
  banned overclaims — the honesty is enforced in code, not just promised.

## Pricing principles (these drive the tier table — see PricingTable.tsx)

1. **Per-site, never per-visitor.** Per-visitor billing is resented (Shopify
   tooling proved this) and punishes success. We price per site / per scope.
2. **Free is the full diagnosis — and only the diagnosis.** It's the funnel and
   the hook: a single-page scan with the **full 16-framework breakdown** ("one
   scan, sixteen verdicts" — the line that makes people share). It deliberately
   does **not** include the *outcome*: the evidence record, report export,
   history, multi-page crawl, or CI tooling. Never gate the diagnosis — gate the
   proof. The framework count is the hook, so it stays free; the proof-over-time
   is what lives behind the paywall.
3. **Paid is the proof, not the volume.** What you pay for is the dated evidence
   record, the ledger/diff over time, the full jurisdiction set, and CI
   monitoring — not "more scans."
4. **Agencies pay more because they bill clients.** Our output is their
   deliverable. Agency pricing reflects resale value, not our marginal cost.
5. **EN 301 549 / EAA is the spine, not a separate SKU.** Every paid tier is an
   "EAA compliance evidence" product. We market the EAA angle hard, but we don't
   fragment it into its own tier — it's the through-line of Pro → Agency →
   Enterprise.

## The honest caveat (read before scaling pricing)

Demand for this specific outcome is **not yet validated**. EAA enforcement is so
far dormant (zero documented fines a year in), and we have no willingness-to-pay
data. These tiers are a **hypothesis**, not a finding. The real numbers come from
selling the evidence record by hand to 3–5 real buyers — not from this file.
Treat the prices below as the opening bid we test, then correct.

---

## ⚠️ Update 2026-06-23 — competitor shock + a lane shift

A live competitor changes the read above. **`access-lens.com` ("Access·Lens")**
is a near-clone: free axe-core scan → WCAG + EAA + **EN 301 549** + a *"dated,
machine-verifiable report,"* Pro at **€19–39 per YEAR**. It owns the exact
EN-301-549-evidence wedge this file is built around — and undercuts any
subscription we'd run. So two corrections to the positioning:

1. **The EN 301 549 / EAA evidence record can't be the headline anymore** — it's
   occupied and cheap, and EAA enforcement is dormant. Make it *a feature*, not
   the spine. **The defensible spine is US litigation-risk breadth: ADA Title II/III,
   California Unruh, Section 508, AODA + 16 frameworks** — the part Access·Lens
   does NOT touch (it's EU-only). Lead there.
2. **Buyer priority is now agencies, hard.** Agencies (§"who it's for" #1) are the
   only lane with repeatable money and resale value, and they're not served by a
   €39/yr EU tool. EU SMEs (#2) now have a cheap incumbent — deprioritise.

**Pricing reality:** the app's **$49/mo solo Pro is not justified** (Equally AI
$45/mo and broader; access-lens €39/yr). Agency $249 holds (vs $1.25k–25k audits).
Sell the **agency/white-label deliverable anchored to audit cost**, not a monthly
solo sub. (Full detail in the `accesslens-pricing-research-2026` memory.)

**Name:** "AccessLens" is **out** (collision with access-lens.com). `a11ybeast.com`
is available; "A11y Beast" is usable but weak, and the word mark "A11Y" is
trademarked in this field — get clearance before brand spend.

**The next move is not more product — it's validation.** Hand-sell the evidence
record to ~10 US agencies; **<2–3 will-pay/LOI in 2 weeks → stop.** This file's
tiers stay a hypothesis until that returns a yes.
