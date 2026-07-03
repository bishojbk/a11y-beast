# A11y Beast — Tier & Gating Spec (plain-English)

_Created 2026-06-17. Updated 2026-06-23 to match the shipped pricing page (Pro ~$49 / Agency ~$249). **RE-PRICED 2026-07-03 (user-confirmed, part of the self-serve pivot): Pro $19/mo · $190/yr; Agency $99/mo founding price (publicly capped, first 15–20 agencies) with $249 list price shown.** Rationale: three research passes killed $49 as above-field (accesstime $20–50 w/ vapor features; access-lens.com €19–39/yr; free scanners everywhere), and the 2026-07-02 pass confirmed NO vendor publishes agency/partner pricing — so the founding cap IS the price-discovery mechanism. Where this doc says $49/$249 below, read $19/$99-founding. Everything else (the gate lines, the free-diagnosis rule, the build order) is unchanged and still governs. The load-bearing call held: **the full 16-framework diagnosis stays free** (it's the hook). See POSITIONING.md for the one-page summary._

_This decides what's **free** vs **paid**, and why. Written to be readable without SaaS background — jargon is defined inline. Nothing here needs to be enforced until the paid product is built; the point is to decide the lines now so the free tool doesn't accidentally become the whole product._

---

## 60-second SaaS primer (the words used below)

- **Freemium** = a free tier that's genuinely useful, used to attract people, plus paid tiers for the deeper value. (Different from a *free trial*, which is the paid product free for 14 days then it stops.)
- **The funnel** = the path a stranger takes to becoming a paying customer. Ours: **find → scan (try it) → give email → upgrade to paid → expand (bigger plan)**. Each step loses most people; that's normal.
- **Lead magnet** = something valuable you give away *in exchange for an email* (here: the downloadable report / free monitoring). It's how a free tool builds a contact list.
- **Gating** = putting a feature behind a wall (login, email, or payment).
- **Value metric** = the *thing you charge based on* — e.g. number of sites, pages, or scans. Good ones grow as the customer gets more value (so bigger customers pay more, fairly).
- **MRR** = Monthly Recurring Revenue — the subscription money that repeats every month. The whole point of SaaS: build once, get paid monthly. A one-off purchase is *not* MRR.
- **Churn** = customers cancelling. Recurring features (like monitoring) fight churn because there's an ongoing reason to keep paying.
- **The core rule for what to gate:** free should answer *"Am I at risk, and what's wrong?"* (the **diagnosis**). Paid should answer *"Fix it across my whole site, keep me safe over time, and give me proof I can show someone"* (the **outcome**). Never hide the diagnosis — it's your hook and your marketing.

---

## TL;DR

Four layers. Gate on **scale** (one page → whole site), **continuity** (one-off → monitored over time), and **proof/polish** (raw findings → regulator/client-ready report). Keep the single-page "which laws am I breaking" scan **gloriously free** — it's your growth engine. Capture emails with a free report + free single-page monitoring. Charge for site-wide scanning, ongoing monitoring, the polished legal report, and (for agencies) white-label.

---

## The four layers

### 1. FREE — no signup _(the hook + your marketing)_
The job of this layer is **reach and trust**, not revenue. Be generous here.
- Single-page scan (enter a URL, or paste/upload HTML)
- The **full 16-framework legal breakdown** + risk score — this is your differentiator *and* your curiosity hook ("you're breaking 16 laws"); keeping it free is what makes people click and share
- The issue list: what's wrong, severity, and which law each issue implicates
- Per-criterion (WCAG) conformance view — part of the diagnosis
- A *preview* of fixes (show the problem + a hint of the fix, not the full copy-paste remediation for every issue)

_(The CLI/GitHub Action was originally slated for free here. It moved to Pro under an open-core model: the engine source is AGPL-3.0 so developers can still build it, but the published CLI and the build-failing CI gate are paid.)_

### 2. EMAIL-GATED — still free, but you capture an email _(the lead magnet)_
The job here is **turn an anonymous scan into a contact you can talk to.** This is the layer you're missing today, and it's cheap to build (you already have email-capture infra). "Free, just give us your email" converts far better than "join a waitlist for a paid product."
- Download the **full report** (PDF / markdown)
- The **complete fix-list** (the full remediation guidance / AI-generated fixes)
- **Free monitoring on ONE page** — we re-scan weekly and email you if new issues appear _(this is the single highest-value add: it captures the email, gives an ongoing reason to come back, AND validates the monitoring feature you'll later charge for)_
- Cloud-saved scan history (instead of just this-browser)

### 3. PRO — paid (~$49/mo) _(the outcome, for a single business)_
The job here is **recurring revenue from an owner who has a real, multi-page site.**
- **Dated, tamper-evident EN 301 549 evidence record + ledger** — the core paid wedge: proof of effort over time that a free scan can't produce (see evidence-ledger-spec.md)
- **CLI + GitHub Action (CI gating)** — published CLI + build-failing gate (open-core; see free-tier note above)
- **Multi-page / site-wide crawl** — the big one: real businesses have many pages, and free only does one. This alone is a strong reason to pay.
- **Scheduled monitoring + alerts across many pages** — the recurring value (fights churn: they keep paying to stay watched)
- History & compare over time (track whether you're improving)
- **Polished, counsel-ready / VPAT-style legal report** — a proof artifact with real value for procurement and EAA documentation (people pay for *proof*, not just findings)
- Higher AI-fix limits, more frequent re-scans

### 4. AGENCY — paid (~$249/mo) _(scale + resale, for people who serve many clients)_
The job here is **higher-value B2B revenue from people who bring their own clients** — per the research, the segment where paying for a *product* is already proven.
- **White-label** — their logo on the reports/dashboard, so they can resell it to clients as their own
- Multiple client sites / bulk scanning
- Team seats
- API access
- Priority support

---

## Why the lines are drawn here

- **Free = diagnosis** because that's your hook, your differentiator-as-marketing, and (critically) you have **no audience yet** — the bigger risk pre-launch is *nobody shows up*, not *people use free too much*. Generous-free is your only growth engine right now.
- **Paid = scale + continuity + proof** because that's exactly where willingness-to-pay is *verified*: the research found people pay for the *outcome* (audits, monitoring, proof) and for *white-label*, and that **nobody pays for "a scan"** (free scanners are everywhere). A one-off scan can't be your paid product — monitoring (recurring) can.
- **The single-page limit** is the cleanest, fairest gate: it doesn't feel like you're hiding value, but almost every real business needs more than one page.

---

## What to charge *by* (your value metric)

Pick **number of sites (domains) monitored** as the primary value metric. Why it's the right one:
- It grows with the customer's value (an agency with 30 client sites clearly gets more value than a shop with 1 → they pay more, and it feels fair).
- It's easy to understand and count.
- It maps to the recurring value (monitoring), not a one-time action.

So conceptually: Free = 1 page, manual · Pro = 1 site, monitored · Agency = many sites, monitored + white-label. (You can add page-count caps inside each, but "sites monitored" is the headline lever.)

## On price ($39 / $99)
Keep them — they're already validated against competitors (overlay SMB tools ~$49; scanner tools $25–400; white-label $99–150). Two plain notes:
- **Monthly recurring** is the goal — that's MRR. Annual plans (2 months free) are good because they reduce churn and give you cash up front.
- **Founder pricing** ("lock in this price for life if you join now") is a legitimate way to reward early believers and create urgency — you already do this. Keep it.

---

## Build order (you can't enforce any of this until the product is "sellable")

Today nothing is gated because there's no login or payment system. To enforce the lines you need three things — build them in this order, smallest first:

1. **Email capture on the report / monitoring** _(cheap — you already have waitlist infra)_. This unlocks the entire **email-gated layer** with almost no new infrastructure, and starts building your contact list immediately. **Do this before launch.**
2. **Accounts / login (auth)** — needed before you can track who's on which plan.
3. **Stripe checkout + subscriptions + usage metering** — the actual "take money" layer. Gate ONE paid feature first (I'd pick **site-wide crawl** or **monitoring**), prove someone pays, then add the rest.

**Minimum sellable product** = auth + Stripe + one gated feature. Everything else is polish.

---

## Common freemium mistakes to avoid (given we're early)
- ❌ Gating the **diagnosis** (the scan/16-law breakdown). That's the hook — never wall it off.
- ❌ Charging for a **one-off scan**. No recurring reason to pay = no real SaaS. Charge for *ongoing* (monitoring) and *scale* (site-wide, multi-site).
- ❌ **Over-gating before you have traffic.** Pre-launch, err generous; tighten later with data. The leak that matters now is the **full report/fix export** — put that behind email; leave the rest open.
- ❌ Building all the paid features before anyone's validated them. Ship the *free monitoring opt-in* first and watch if people use it — that tells you if the paid monitoring tier is worth building.
- ❌ Hiding pricing or making upgrade fuzzy. Be clear and upfront (you already are).

## The one number to watch
- **Now (pre-paid):** *scan → email rate* — of people who run a scan, how many give an email for the report/monitoring. That tells you if your lead magnet works.
- **Later (post-paid):** *email → paid rate* — of your email list, how many upgrade. That tells you if the paid value is real.

Everything else is noise until those two numbers exist.
