# Free "Monitor My Page" — Feature Spec (plain-English)

_Created 2026-06-17. The single highest-leverage pre-launch add. Goal: turn a one-shot scan into (a) a captured email, (b) an ongoing reason to come back, and (c) a live test of whether people want monitoring — the feature you'd later charge for. No login required for the free version. Jargon defined inline._

---

## What it is, in one line
After someone scans a page, offer: **"Want us to keep an eye on this page? We'll re-check it weekly and email you only if new accessibility issues appear — free."** They give an email, confirm it, done.

## Why it's worth building first
- **Captures an email** with a real value exchange (this is a *lead magnet* — something useful traded for contact info), which beats "join a waitlist for a paid product that doesn't exist."
- **Deepens the hook** — a scan is one-and-done; monitoring is a reason to remember you exist.
- **Validates the paid feature for free** — if lots of people opt in and open the emails, you've proven the monitoring tier is worth building *before* building it. If nobody opts in, you just saved yourself months.
- **No auth needed** — just email + URL + a confirm click. Cheapest possible capture.

---

## Build it in two levels — do Level 1 first

### Level 1 — "Concierge" version _(ship before launch; almost no new code)_
> **Concierge MVP** is a startup technique: before you automate something, do it *by hand* for your first few users to confirm they actually want it. You build only the front door; *you* are the back end.

- **Build:** just the opt-in form (email + the URL being scanned). Send it to your **existing waitlist pipeline** (`/api/v1/waitlist` → `WAITLIST_WEBHOOK_URL` → Google Sheet) with a tag like `type: monitor`. That's it — no database, no cron, no email automation.
- **You, manually, once a week:** open the sheet, re-run each URL through the scanner, and personally email anyone whose site got worse (or just "still clean ✅"). With 5–30 early users this takes 20 minutes.
- **What it proves:** the opt-in rate (do people even want this?) and whether the weekly email is valued — the two things that decide if Level 2 is worth building. **This is the cheapest way to get real data.**

### Level 2 — Automated version _(build only after Level 1 shows demand)_
The real feature. Now you add the three pieces of infrastructure a monitoring product needs:

1. **Storage** (a place to remember who's monitoring what). Today the app has no database — scan history is just in the browser. You need a small persistent store: **Vercel KV** (a simple key-value store) or **Vercel Postgres / Supabase** (a real database, free tier). Store one row per monitored page.
2. **A schedule** (something that runs weekly without you). **Vercel Cron Jobs** — you declare a schedule in `vercel.json` and Vercel calls one of your API routes on that cadence (e.g. every Monday). _(Check your Vercel plan's allowed cron frequency; weekly is modest.)_
3. **Transactional email** (automated one-to-one emails — confirmations and alerts, *not* marketing blasts). Use a service like **Resend**, **Postmark**, or **AWS SES** — they have free/cheap tiers and handle *deliverability* (the technical work of not landing in spam, via SPF/DKIM domain setup).

---

## Data model (Level 2 — what to store per monitored page)
```
monitor {
  id              // unique id
  email           // who to notify
  url             // the page being watched
  confirmed       // true only after they click the confirm link (see double opt-in)
  confirmToken    // random token for the confirm + unsubscribe links
  baseline        // the issue "fingerprint" from the first scan (see diff logic)
  lastScanAt      // when we last checked
  lastResult      // latest fingerprint, for comparison
  frequency       // "weekly" (free); paid could be daily
  createdAt
  active          // false after unsubscribe
}
```

## The "what changed" logic (the heart of it)
You only want to email when something **meaningfully** changed — nobody wants a weekly "nothing happened" spam.
- A **fingerprint** = the set of issues from a scan, each reduced to a stable key like `ruleId + element-selector` (you already produce rule IDs + severities + framework mapping). Store the *set*, not the whole report.
- On each weekly re-scan, compare new fingerprint to the stored baseline:
  - **New issues** = in the new set, not in the baseline → this is a *regression* → **email them.**
  - **Resolved issues** = in the baseline, not in the new set → nice-to-have "you fixed 3 things ✅" line.
  - **No change** → don't email (or fold into an optional monthly digest).
- After emailing, update the baseline to the new state so you don't re-alert the same issue.

## The emails (keep it to 2–3)
1. **Confirm your email** (sent immediately) — *"Confirm you want weekly monitoring for example.com"* with a confirm link. This is **double opt-in** (they must click to activate). Why it matters: stops someone signing up an address they don't own, and it's essential for deliverability/spam-compliance.
2. **Regression alert** (only when new issues appear) — *"3 new accessibility issues found on example.com"* → top issues, which laws they implicate, link to the full scan, and a one-click **unsubscribe**.
3. *(Optional)* **All-clear / monthly digest** — light touch so they remember you without annoyance.

> Every automated email **must** have a working unsubscribe link — it's the law (CAN-SPAM in the US) and critical for not getting your domain flagged as spam.

---

## Guardrails (don't skip these)
- **Reuse the SSRF guard.** You're re-scanning user-submitted URLs on a schedule. Your scanner already validates URLs and blocks private IPs (`validateUrl` / the SSRF guard in the crawler + puppeteer scanner) — route monitoring re-scans through the same checks so nobody points it at internal addresses.
- **Cap the free tier hard:** **1 page per email, weekly only.** This is your gate (matches the tier spec: free = 1 page/manual; Pro = many pages, more often). It also caps your cost.
- **Cost awareness:** Puppeteer scans are heavy. For the first dozens of monitored pages, a single weekly cron that loops them is fine. Past that, process **one URL per invocation** (a simple queue) so you don't blow the serverless function time limit.
- **Privacy:** you're storing emails + URLs — add a line to your privacy policy, and make unsubscribe delete the record.
- **Confirm before scanning** (double opt-in) so you're not re-scanning sites for unconfirmed/abandoned signups.

---

## Where it sits in the tiers (consistency with `tier-gating-spec.md`)
- **Free (email-gated):** monitor **1 page, weekly.** ← this feature.
- **Pro:** monitor **many pages / a whole site, more frequently**, with history + alerts. ← the paid upgrade this validates.
- The free version is deliberately the "taste" of the paid version — that's the point.

## What to measure
- **Primary:** **scan → opt-in rate** — of people who run a scan, what % turn on monitoring? This is *the* number that says whether the lead magnet works. (Don't anchor on a target — measure your real baseline; you can A/B the wording later.)
- **Confirm rate** — of opt-ins, how many click the confirm link (tests email/deliverability).
- **Later:** alert **open/click rate** and how many monitored users eventually upgrade — that's your signal the paid tier is real.

---

## Build checklist
**Level 1 (pre-launch, ~hours):**
- [ ] Post-scan CTA: "Monitor this page free" → small form (email + pre-filled URL)
- [ ] POST to existing waitlist route with `type: "monitor"` + the URL
- [ ] You re-scan + email the early list by hand, weekly

**Level 2 (after Level 1 shows demand):**
- [ ] Add storage (Vercel KV or Postgres/Supabase)
- [ ] Double opt-in: confirm email flow + token
- [ ] Weekly Vercel Cron → API route → re-scan each active+confirmed monitor (reuse scan + SSRF guard)
- [ ] Diff vs baseline → send regression alert via transactional email (Resend/Postmark) with unsubscribe
- [ ] Cap free at 1 page/weekly; privacy-policy line
- [ ] Dashboards for the two metrics above
