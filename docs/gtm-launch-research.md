# A11y Beast — Go-To-Market Launch Research

_Created 2026-06-16. Sources: (1) a deep-research harness pass — 109 agents, 27 sources fetched, 119 claims extracted, 25 adversarially verified (24 confirmed, 1 killed); (2) Google Autocomplete demand data pulled this session (see `seo-keyword-map.md`). **Verified evidence and inference are labeled separately throughout** — the founder values real data over estimates._

---

## TL;DR

- **Is there demand? Yes — verified.** The strongest hard signal is litigation pressure (a record **3,255** US federal website-accessibility lawsuits in 2022; ~3,117 in 2025), plus **real Shopify store-owners posting "I've just been sued under the ADA"** in Shopify's own community forum. That's direct buyer intent, not a guess.
- **The anti-overlay positioning is exceptionally well-supported.** The FTC's 2025 **$1M consent order** against overlay vendor accessiBe, the **1,031-signatory** Overlay Fact Sheet, and an NFB resolution prove the accessibility community is large, mobilized, and hostile to overlay snake-oil. **Credibility is the entry ticket** — and AccessLens's honest, anti-overlay stance is an asset, not a liability.
- **Recommended beachhead (inference, grounded): SMB / e-commerce owners, Shopify-first.** That's where the direct, anxious, "I'll pay to make this go away" demand is. Agencies are the **monetization/expansion** play (the white-label category is real and competed-for); developers are third (lowest urgency).
- **Bifurcate your channels** (this is the key strategic insight): the **buyers** (anxious store owners) and the **gatekeepers/partners** (accessibility pros) hang out in *different* places and need *different* messages. Don't pitch buyers in pro communities or vice-versa.
- **Top 3 channels:** (1) **r/shopify + Shopify Community forums** (buyers, highest-intent), (2) **r/smallbusiness / r/webdev / r/accessibility** (mixed reach), (3) **Web-A11y Slack + a11y meetups** (credibility + partnerships, *not* direct selling).

---

## Part 0 — Method & honesty

The deep-research harness verified **market context and channel existence** to high confidence but, by design, **refused to manufacture** the parts it couldn't source: a segment-by-segment demand ranking, a full subreddit-rules map, and outreach templates. Those are marked **[INFERENCE]** or **[BEST PRACTICE]** below and rest on (a) the verified facts, (b) the buyer-intent threads the harness fetched, and (c) the Google Autocomplete data from this session. Treat **[VERIFIED]** as research-backed and everything else as my recommendation to pressure-test.

---

## Part 1 — Demand validation

### [VERIFIED] The litigation driver is real and large
- **3,255** ADA website-accessibility lawsuits filed in US federal court in **2022** (+12% YoY) — Seyfarth Shaw's ADA Title III tracker, corroborated by Level Access. (3-0 verified.)
- ⚠️ **Cite the year.** 2022 was a **peak**; filings dipped in 2023–24 and rebounded to ~3,117 in 2025. It's a large, persistent threat — **not** continuous year-over-year growth. (Don't overclaim a trend.)
- This is an **indirect proxy** (litigation volume ⇒ anxiety), but it's the strongest demand-side fact in the verified set.

### [VERIFIED — DIRECT BUYER INTENT] Real owners are posting about exactly this
The harness fetched these real **Shopify Community** threads (titles are self-evident buyer intent; in-thread specifics weren't independently re-verified, so treat the *existence + titles* as the signal):
- "I have a Shopify store and I've just been sued under the ADA (Gathers v. Wet Shaving Products LLC)" — community.shopify.com/t/.../10174
- "Sued for not being ADA compliance" — community.shopify.com/t/.../232788
- "ADA accessibility lawsuits" — community.shopify.com/t/.../351516
- "How to ensure ADA and WCAG compliance on my Shopify store" — community.shopify.com/t/.../28266

These four threads alone answer the core question: **yes, anxious store owners are actively seeking help.**

### [VERIFIED — this session] Search demand is concrete
Google Autocomplete (real completions, see `seo-keyword-map.md`) shows live demand clusters: `ada compliance april 2026`, `ada compliance checker`, `is my shopify website ada compliant`, `how to make my website ada compliant on shopify/wordpress`, `free accessibility checker`. The "deadline/April 2026" and platform-specific clusters are especially hot.

### [INFERENCE] Segment ranking & beachhead
No *verified comparative* demand data exists across segments, but the evidence points one way:

| Rank | Segment | Why (evidence) | Caveat |
|---|---|---|---|
| **1 (beachhead)** | **SMB / e-commerce owners (Shopify-first)** | Direct buyer-intent threads + autocomplete demand + 70% of suits hit e-commerce (prior research). High urgency, will pay to de-risk. | Non-technical; need dead-simple UX + plain-English output (you have this). |
| 2 (monetization) | **Web/digital agencies & freelancers** | White-label category is **[VERIFIED]** real & competed-for (AccessibilityChecker.org + 3–4 others at $99–150/mo). Recurring, higher LTV. | Supply-side validation, not demand proof. Slower sales cycle. |
| 3 | **Developers / in-house** | Free scanner + CLI/CI fits; reachable on dev communities. | Lowest urgency/willingness-to-pay; commoditized (axe is free). |

**Beachhead = SMB/e-commerce owners.** Land them with the free scanner via the lawsuit-anxiety hook; expand into agencies for revenue.

---

## Part 2 — Channel & community map

**The key move: split channels into BUYER-acquisition vs CREDIBILITY/PARTNERSHIP.** Buyers (anxious owners) want "am I at risk and how do I fix it?"; pros (a11y community) grant credibility and become partners but will reject anything that smells like an overlay vendor.

### A. Buyer-acquisition channels (where the demand is)
| Channel | Fit × Reach × Ease | Status |
|---|---|---|
| **r/shopify, Shopify Community forums** | High × High × Med | [INFERENCE] — Shopify forums **[VERIFIED]** have real ADA threads; r/shopify rules need checking |
| **r/smallbusiness, r/ecommerce, r/Entrepreneur** | High × High × Low-Med | [INFERENCE] — strict self-promo rules; value-first only |
| **r/webdev, r/web_design, r/wordpress** | Med × High × Med | [INFERENCE] — mixed buyer/builder; verify rules |
| **WordPress.org support forums / r/Wordpress** | Med × Med × Med | [INFERENCE] |
| **Quora / Stack Exchange (Webmasters, UX)** | Med × Med × High | [INFERENCE] — evergreen Q&A, good for SEO compounding |
| **Indie Hackers, Product Hunt, Hacker News (Show HN)** | Med × Med × Med | HN rules **[VERIFIED]**; others [INFERENCE] |
| **Discovery/review sites: G2, Capterra, AlternativeTo** | Med × Med × High | [INFERENCE] — list the free tool; buyers comparison-shop here |

### B. Credibility & partnership channels (where the gatekeepers are)
| Channel | Notes | Status |
|---|---|---|
| **Web-A11y Slack** (web-a11y.slack.com, ~14k members) | Largest a11y Slack; topic channels (jobs/help/dev/testing). **Do not sell** — contribute. | [VERIFIED] exists/active; 14k & exact channels from blogs |
| **WordPress Make #accessibility Slack** | Official WP a11y team hub; active (June 2026 mtg confirmed). | [VERIFIED] |
| **A11y meetups: A11yNYC, A11yLondon, A11yTO, A11yChi, A11yBay, A11ySea, A11yDC** | Cover US/UK/CA; events into 2026. Talks/sponsorship/relationships. | [VERIFIED] |
| **Accessibility consultants/agencies** | White-label & referral partners; need automated triage. | [VERIFIED] category |
| **Accessibility Twitter/Mastodon, Adrian Roselli / Karl Groves / Lainey Feingold orbit** | Influential anti-overlay voices; credibility multipliers if they vouch. | [INFERENCE] |

⚠️ **Geography:** demand is loudest in the **US** (ADA/Unruh). UK (Equality Act), Canada (AODA/ACA), Australia (DDA) have communities (A11yLondon, A11yTO verified) but less litigation-driven urgency — secondary.

---

## Part 3 — Outreach playbook

> **Golden rule [VERIFIED constraint]:** credibility is the entry ticket. The community is organized and hostile to overlay snake-oil (FTC/accessiBe, 1,031-signatory Fact Sheet, NFB). Lead with the anti-overlay/honest-coverage stance, contribute value *before* mentioning the product, and never pattern-match to an overlay vendor (no "one-click compliance," no "make your site compliant"). One spammy post in Web-A11y Slack could brand you permanently.

### Organic community participation
**Reddit [BEST PRACTICE — verify each subreddit's rules first]:**
- The "9:1 rule" (≤10% self-promotion) is **community lore / reddiquette, not an official sitewide rule** — but mods enforce their *own* versions, and many tool-relevant subs (r/webdev, r/accessibility) **ban or restrict tool promotion**. Read each subreddit's rules + check for a "self-promo Saturday" or "show-off" thread before posting.
- **Win by being useful, not by posting your link.** When someone asks "is my site ADA compliant / I got a demand letter," write a genuinely helpful answer; mention the free tool only if it directly helps, and **disclose** you built it ("disclosure: I made a free scanner that…").
- Example value-first comment template:
  > "Sorry you got that letter — they're stressful but usually settle. First, don't buy an 'accessibility overlay' widget to make it go away; the FTC fined one vendor $1M and courts don't accept them. What actually helps: fix the real issues. Free way to see where you stand: run your URL through an automated checker (I built a free one, [link] — disclosure, it's mine; axe DevTools and WAVE are also free). It'll show which issues map to ADA. Then prioritize alt text, contrast, labels, keyboard nav. Happy to look at your results."
- Cadence: comment helpfully for 2–3 weeks *before* any standalone post. Earn karma + recognition first.

**Shopify Community / WordPress.org forums [BEST PRACTICE]:** same value-first approach; these are the highest-intent buyer venues and are more tolerant of helpful tool links than Reddit. Answer the existing ADA threads (they're already there).

**Hacker News [VERIFIED rules]:** a **Show HN** is allowed and ideal for the free tool/CLI. But it's **explicitly forbidden to solicit upvotes/comments** ("Don't solicit upvotes… Can I ask people to upvote? No.") — HN's voting-ring detector will penalize it. Post it, then let it ride. Frame around the *interesting* part (the 16-framework legal mapping, the honesty about ~57% automated coverage), not "please try my product."

### Direct outreach [BEST PRACTICE + ethical line]
- **The ethical line:** **do not cold-contact businesses because they were just sued or appear in a lawsuit tracker.** That's ambulance-chasing — predatory, brand-damaging, and the exact behavior the community despises. (It also risks looking like you're exploiting litigation-sensitive data.)
- **Do instead:** respond *publicly and helpfully* to people who are *already asking* (the Shopify threads, Reddit posts). Reach out 1:1 only to people who've **expressed the need** or **opted in** (e.g., replied to a helpful comment, joined the waitlist).
- Example reply-to-a-public-poster DM:
  > "Saw your post about the ADA demand letter — that's rough. No pitch: the one thing to avoid is an 'overlay' widget (FTC just fined one $1M and they don't stop lawsuits). If useful, I built a free scanner that shows which issues map to ADA and gives you the code to fix them — [link]. Happy to walk through your results, no strings."

### Partnerships [BEST PRACTICE]
- **Accessibility consultants & small agencies** — your best partners. They do manual audits and *want* automated triage to scale + a white-label dashboard for clients (the **[VERIFIED]** $99–150/mo category). Pitch: "free/cheap automated first-pass so you spend billable hours on the 60% automation can't catch; white-label it to your clients." This *aligns* with the anti-overlay community (they explicitly bless white-label **when it's genuine code-level remediation, not overlays**).
- **Shopify / WordPress ecosystem** — a genuinely accessible (non-overlay) Shopify app or WP plugin that surfaces your scan = distribution into the exact buyer pool. Higher build effort; medium-term.
- **Complementary dev tools** (CI/testing, site builders) — integration/co-marketing.
- ⚠️ **Disability orgs (NFB etc.):** do **not** approach as a "marketing partner." They're credibility-granters who are deeply wary. Only engage by genuinely contributing (sponsor a meetup, give a talk, support the Fact Sheet) — never transactionally.

---

## First-moves plan

**First 2 weeks (credibility + presence, no selling):**
1. Join **Web-A11y Slack** and **WordPress Make #accessibility Slack**; lurk, learn the norms, answer a few questions helpfully. No links.
2. Find & **reply helpfully** to the existing Shopify Community ADA threads and 5–10 fresh Reddit posts (r/shopify, r/smallbusiness) — value first, tool only where it genuinely helps, always disclosed.
3. List the free scanner on **AlternativeTo / Product Hunt "upcoming" / G2 (free tier)** so it's discoverable.
4. Tighten copy per the corrections below before driving any traffic.

**First 90 days (acquisition + partnerships):**
5. **Show HN** the free tool/CLI (lead with the legal-mapping angle; no upvote-soliciting).
6. Publish 2–3 of your blog posts where the audience is (link from helpful answers; the deadline + Shopify guides map to hot demand).
7. Reach out to **3–5 small accessibility consultancies/agencies** with the white-label/triage pitch.
8. Scope a **Shopify app or WP plugin** as the distribution bet.
9. Sponsor/attend one **a11y meetup**; start building real relationships with the pro community.

---

## Bonus — corrections this research surfaced for our existing copy

- **FTC phrasing:** always "the FTC **charged/alleged**… **consent order**/settlement," never "fine proven in court." accessiBe signed a **non-admission** consent order and publicly disputes it. Our overlay post phrases this well; tighten the looser "the FTC fined… for claiming otherwise" lines in the Shopify/WordPress/lawsuits posts to "charged… and settled for $1M."
- **Litigation stat:** cite the **year** (2022 = 3,255 peak; ~3,117 in 2025). Don't imply continuous growth.
- **Overlay Fact Sheet:** **date** the signatory count (1,031 as of mid-2026; it rises).
- **axe-core ~57%:** that's % of *issues by volume*, not success criteria — our "automated scans" post already handles this correctly.

---

## Open questions (what a follow-up research pass should harden)
1. Verified subreddit list + **current sizes + exact self-promo rules** (which ban tool promotion).
2. Verified **Upwork/Fiverr "ADA compliance" gig demand** (volume of buyer requests) — supply was found, buyer-demand volume wasn't.
3. More **dated, quoted buyer-intent threads** beyond Shopify (r/smallbusiness, Quora, WP forums).
4. Whether any **disability-org or influencer** relationships are realistically attainable pre-traction.
