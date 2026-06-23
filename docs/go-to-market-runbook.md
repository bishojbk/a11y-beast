# A11y Beast — Go-To-Market Runbook (validation → launch)

_Created 2026-06-23. The step-by-step operating doc for getting from "it's built" to
"someone pays." Update the tracker section as you go. Grounded in 2026 cold-outreach
and micro-SaaS benchmarks (sources at bottom)._

---

## 0. The one idea that fixes everything: two phases, in order

You are conflating two different motions. They are NOT the same, and doing the
second before the first is how technical founders die at this stage.

| | **Phase 0 — VALIDATION (now)** | **Phase 1 — LAUNCH (later)** |
|---|---|---|
| Goal | Prove someone will *pay* | Get *volume* of users |
| Motion | 1:1 founder-led outreach | Broadcast (HN / Product Hunt / Reddit / communities) |
| Channel | LinkedIn DM + email to a hand-picked list | Public posts |
| Audience | ~50–80 specific agencies | Everyone |
| Success | 2–3 "yes, I'd pay $X" / LOI | Sign-ups, traffic, press |
| Reddit's role | **None** (it's not a sales channel) | A *supporting* channel, used carefully |

**Rule: do not broadcast-launch until Phase 0 returns a yes.** Your one shot at
HN/Product Hunt is wasted if you fire it at an unvalidated, contested wedge. The
launch posts in `docs/launch-posts.md` are Phase 1 — they stay in the drawer until
Phase 0 clears.

---

## 1. Reddit: the honest verdict

Your instinct that "subs are strict" is correct, and it's worse than you think for
*selling*:
- Reddit retired the formal 10% rule but **73% of mods still enforce a ratio**;
  the governing principle is *"It's fine to be a Redditor with a website; not okay
  to be a website with a Reddit account."*
- **r/webdev** allows self-promo "only in rare cases"; **r/Entrepreneur** and most
  big business subs are **zero-tolerance**. r/accessibility is practitioners, not
  buyers — great for credibility/feedback, useless for selling.
- A "bold ad" post gets removed and can get you shadow-banned.

**So Reddit is NOT your validation channel.** Its only correct uses (Phase 1, and
even then secondary): (a) genuinely helpful comments where someone asks "how do I
check ADA compliance" → answer fully, mention the free tool *once*, plainly; (b) a
"I built this, here's what I learned" post in builder subs (r/SideProject,
r/indiehackers) framed as a story, not an ad. Lead with insight, win the reader
first. Never link-drop.

**Validation comes from direct outreach, not Reddit.** Full stop.

---

## 2. Who exactly we target (ICP)

**Primary: small US web/design/dev agencies (2–20 people) that build & maintain
sites for SMB clients.** Why this beachhead:
- They have a **book of client sites** → recurring need, not one-off.
- They **resell** — our output becomes their billable deliverable (anchor:
  $1.25k–25k audits they already quote). White-labeling accessibility to agencies
  is a *proven, existing model* (accessibilitychecker.org, Scanluma, TestParty,
  WhiteLabelIQ all run agency programs) — which validates the lane AND means we
  must differentiate: **16 frameworks + US litigation framing + dated evidence +
  honest/anti-overlay**, not "another scanner."
- They are **not served** by the €39/yr EU competitor (access-lens.com is EU-EAA
  only) — this is our open lane.

**Secondary (smaller batch): US businesses recently named in ADA web lawsuits.**
Acute pain, fast yes/no. Find via public court dockets / UsableNet lawsuit reports
/ plaintiff-firm press releases. Use as a second cohort, not the main one.

**Deprioritize:** EU/EAA SMEs (cheap incumbent), solo site owners (low willingness),
developers (free-tool users, not buyers).

---

## 3. The funnel math (how many to contact — grounded in 2026 data)

Benchmarks:
- Generic B2B cold email: **3.4–5.8% reply**, SaaS often **<2%**.
- BUT **small, hyper-personalized lists (<50) ≈ 5.8%** vs 2.1% for blasts; a
  **personal 3-sentence message naming the exact problem = 15–25% reply**.
- **Follow-ups produce 42% of all replies**; 48% of people never send one. Always
  follow up (2×).
- Meetings: ~1–2 per 100 generic emails; far higher with personalization + a free
  offer.

**Our plan (personalized + free-value offer, so we use the optimistic end):**

```
Build list:            60–80 target agencies
Contact (2 wks):       ~50 (hyper-personalized, multi-touch)
  → replies (~20%):    ~10–12
  → conversations:     ~8–10   (a 15-min call or a thread)
  → "yes I'd pay $X":  2–4     ← THE GATE
```

So: **~50 carefully chosen agencies, 3 touches each, over 2 weeks, to net 2–4
will-pay signals.** Quality of list + personalization beats volume every time —
do NOT blast 500.

**Calls?** Don't cold-call. It's high-effort, low-fit for a solo technical founder
and unnecessary now. Go async-first (LinkedIn + email) → book a 15-min video call
*only* with people who reply interested.

---

## 4. Free version first? Yes — it's the door-opener

The motion is **concierge + free-value-first**:
1. You don't pitch a product. You **offer to run a free, hand-made evidence audit
   on one of their client sites** and show them the output.
2. That deliverable (dated, hashed evidence record + top violations mapped to the
   laws they implicate + fix list) *is* the product, delivered by hand.
3. The free scan on the site is the funnel; the conversation about the **evidence
   record** is where you probe willingness-to-pay.

You never put a $49 pricing page in front of them in Phase 0 (that's where any
number looks laughable next to free scanners). Price comes up in conversation,
**anchored to the $1.25k–25k audit they bill / the $5k–75k settlement they help
clients avoid — never to "a scanner."**

---

## 5. The 2-week validation sprint — step by step

**Day 1–2 — Build the list (target: 60–80 agencies).**
- Source from **Clutch** (filter: web design, US, small) + DesignRush, GoodFirms,
  UpCity. Also LinkedIn search "web design agency" + city; your own network first
  (warmest, per the data: people-you-know convert first).
- Log each in the tracker (§6) with: agency, contact name, role (owner/founder
  best), LinkedIn URL, email, one specific personalization hook (a client site of
  theirs you can scan).

**Day 2–3 — Prep the personalization.**
- For each agency, run **your own tool** on one of their *client* sites, and
  hand-clean a 1-page evidence record (§7). This is the hook: "I ran this on
  [their client] and found X."

**Day 3–10 — Outreach, ~10–15 per day, multi-touch.**
- Touch 1: LinkedIn connect + short note (template §8a) OR cold email (§8b).
- Touch 2 (after 3 days, no reply): follow-up (§8c) — attach/share the free
  evidence record you made for their client.
- Touch 3 (after 4 more days): final nudge (§8d).
- Anyone who replies interested → book a **15-min call**.

**Day 5–14 — Conversations + the ask.**
- On the call: show the evidence record, ask the will-pay question (§8e), and
  **shut up and listen**. Log exactly what they say about price and value.

**Day 14 — Decision gate (§9).**

---

## 6. The tracker (make this a spreadsheet — Google Sheet)

| Col | Meaning |
|---|---|
| Agency | name |
| Contact / role | owner/founder ideal |
| LinkedIn / email | channels |
| Client site scanned | the personalization hook |
| Touch 1 / 2 / 3 (date) | cadence log |
| Reply? (Y/N + date) | |
| Conversation? (Y/N) | |
| **Will-pay? (Y/N)** | the gate metric |
| **Price reaction** | *verbatim* quote — most valuable column |
| Notes | objections, feature asks |

Update it daily. The "Price reaction" column is your actual research output.

---

## 7. The deliverable (free hand-made evidence record)

A 1-page PDF you generate with your own tool, then clean by hand:
- Their client's URL + **date** + SHA-256 hash (the "dated, tamper-evident" point).
- Overall score + top 5–8 violations, **each mapped to the laws it implicates**
  (ADA Title III, Unruh, Section 508, EAA…).
- Prioritized fix list.
- Footer: *"Documented automated assessment — not a certification or legal advice.
  Automated testing covers ~30–40% of WCAG; pair with manual review."* (honest +
  FTC-safe).
Branded plainly so an agency can imagine it white-labeled.

---

## 8. Templates (copy, personalize the [brackets], send)

**8a — LinkedIn connect note (≤300 chars):**
> Hi [Name] — I build a tool that turns a site scan into a dated, defensible
> WCAG/ADA evidence record (the kind a client can show if they get a demand
> letter). Ran it on [their client site] and found a few things — happy to send
> you the 1-pager. No pitch.

**8b — Cold email (3 sentences, problem-first):**
> Subject: [Client]'s site — 3 ADA issues worth a look
>
> Hi [Name] — I ran an accessibility scan on [client site] you built and it flags
> [X serious WCAG issues] that map to ADA Title III + Unruh exposure. I built a
> tool that turns that into a dated, defensible evidence record agencies can
> white-label into their audits. Want the free 1-page report I generated for
> [client]?

**8c — Follow-up #1 (+3 days):**
> Hi [Name] — following up with the report itself (attached). The dated/hashed
> part is what's useful if a client ever gets a demand letter — it's proof they
> assessed and acted. Would something like this be useful in your audit deliverables?

**8d — Follow-up #2 (+4 days, last):**
> Last note — should I keep you posted as this develops, or not your thing? Either
> way, the [client] report is yours to use.

**8e — The will-pay ask (on the call):**
> "If this were white-labeled under your brand — your logo, your client-ready
> evidence reports + monitoring — would you put it in your audit packages? What
> would you pay per client, or per month for a book of clients?"
> *(Then silence. Log the exact number/reaction.)*

---

## 9. Decision gate (commit to this BEFORE you start)

After ~50 contacted / ~8–10 conversations:
- **≥2–3 say "yes, I'd pay $X" or sign an LOI / pre-pay → VALIDATED.** Proceed to
  reprice around what they said, fix the pricing page + the "AI-generated look,"
  settle the name/trademark, then Phase 1 launch.
- **0–1 → STOP.** The wedge or buyer is wrong. The product is already built, so
  nothing more is owed to it. Either pivot the wedge (e.g., the sued-SMB cohort)
  or shelve it. Do not "just keep building" — that's the trap.

---

## 10. Phase 1 launch (only after the gate clears — deferred)

Sequence, later: (1) fix pricing + visual polish; (2) settle brand/domain; (3) seed
credibility (a11y community, a genuine Reddit "what I learned" post, the public
benchmark); (4) Product Hunt + Show HN with the *validated* hook + real testimonials
from the agencies who said yes; (5) Reddit value-comments in webdev/SMB threads.
Detail lives in `docs/launch-posts.md` (drafts already written, FTC-safe).

---

## Sources (2026)
- Cold-email benchmarks: prospeo.io, instantly.ai, apollo.io, cleanlist.ai (reply
  3.4–5.8%; <50-list 5.8% vs 2.1%; follow-ups = 42% of replies; ~1–2 meetings/100).
- Micro-SaaS first customers: superframeworks.com, saasranger.com (personal
  3-sentence msg 15–25% reply; people-you-know → communities → social → SEO;
  6–8 wks to first paying customer).
- Reddit rules: oneup.today, redship.io, subredditsignals.com (ratio still
  enforced; r/webdev rare-cases; "Redditor with a website" principle).
- Agency targeting: clutch.co, designrush.com, duda.co directory guide.
- White-label-to-agencies model + pitch: accessible.org, accessibilitychecker.org/
  businesses/agency, testparty.ai/blog/white-label-partnerships (40–60% margin,
  value-based, audit-as-entry-point, avoid overlays).
