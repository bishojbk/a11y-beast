# Reddit Community Kit — the "free tool, feedback welcome" track

_Created 2026-06-24. Runs IN PARALLEL with the cold-outreach validation track (`outreach-kit.md`).
This track's job is **feedback + credibility + a little top-of-funnel** — NOT proof that anyone will pay.
Don't let it substitute for the asks; goodwill doesn't pay the hosting bill._

## What this track is / isn't (keep it honest with yourself)
- **Is:** product critique from real practitioners, credibility you can cite in agency DMs ("shared it with r/accessibility, here's what I changed"), a few free users, maybe a warm lead.
- **Isn't:** validation of willingness-to-pay. Free users of a commodity scan ≠ payers. The gate is still the agency replies.
- **Expect modest traction.** Accessibility-scanner posts historically land quietly, and r/accessibility is a high-standards, overlay-scarred audience. The *critique* is the win — even a roast is useful signal.

## Golden rules (so you don't get banned or roasted)
1. **Be a Redditor, not a website with an account.** Read each sub's sidebar rules before posting. Keep self-promo ≤10% of your activity.
2. **Post from a real, aged account with comment history.** A fresh 0-karma account dropping a tool link = instant removal/ban. If yours is thin, spend a week genuinely commenting first.
3. **Disclose it's yours, every time.** "Full disclosure, I built this." Hiding it is the fastest way to get torched.
4. **One genuine post per sub — never a same-day blast across 5 subs.** Space them out over the week.
5. **Engage every comment** — especially critical ones, graciously. That's where the credibility is earned.
6. **NEVER claim "compliant," "lawsuit-proof," or "AI fixes everything."** Lead with **anti-overlay + the honest ~30–40% automation ceiling.** In this crowd that honesty is your entire ticket in.

## Where to post — sub by sub
| Sub | Use it for | How |
|---|---|---|
| **r/accessibility** | Feedback + credibility (toughest, highest value) | A genuine "I built this free, honest, anti-overlay tool — critique it" post. Expect hard feedback; welcome it. |
| **r/SideProject** | "I built this" is welcome; traction signal | Maker-story framing. Audience = makers, not buyers. |
| **r/indiehackers** (+ indiehackers.com) | Same — makers, build-in-public | Share the *why* + ask what to build next. |
| **r/webdev**, **r/web_design** | Self-promo is "rare cases only" | Prefer their showcase/Saturday threads, or just *help* in relevant threads. A standalone tool post ONLY if the rules allow it that week. |
| **r/shopify, r/smallbusiness, r/ecommerce** | Where the *at-risk buyers* are — but DON'T launch here | Don't post a "I made a scanner." Instead *answer* genuine "is my store ADA compliant / I got a demand letter" threads helpfully, and mention the tool once. (See comment template.) |

## The flagship post — lead with what you LEARNED, not the tool
The post is a genuine "here's what surprised me learning web-accessibility law" share. The lesson is the value; the tool is a footnote at the end. This is what survives strict subs (it's content, not an ad), wins the practitioner crowd, and is true to your actual journey. **Keep it first-person and humble — you're sharing what you learned and inviting correction, not lecturing.**

> **Title:** I spent the last few months learning how web-accessibility *law* actually works. A few things genuinely surprised me — sharing in case it helps (and please correct me).
>
> I'm an indie dev, and I went down the accessibility rabbit hole — not just WCAG, but the actual laws behind it. Some of what I found wasn't what I expected:
>
> **1. "WCAG" isn't one law — it's the basis for ~16 of them.** ADA Title III (US), California's Unruh Act ($4,000 per violation), the EU's EAA / EN 301 549, Section 508, Ontario's AODA… they mostly point back to WCAG, but with different scopes, deadlines, and teeth. Most scanners tell you that you fail "WCAG 1.1.1" — almost none tell you *which laws* that actually exposes you under.
>
> **2. US enforcement is private lawsuits, not government fines.** ~5,000+ web-accessibility suits were filed in the US in 2025, ~70% against e-commerce, mostly companies under $25M revenue. The "government will fine you" angle is really an EU/EAA and Section-508 thing — not ADA.
>
> **3. Overlay widgets don't work — and the FTC now agrees.** Over 1,000 sites running an accessibility "overlay" were still sued; the FTC fined accessiBe $1M in 2025 for claiming its AI made sites compliant. Automated testing only catches ~30–40% of WCAG anyway, so anything promising "instant compliance" is selling snake oil.
>
> **4. The EAA "deadline" was quieter than the hype.** It's been in force since June 2025, but ~a year on there are basically no fines yet — enforcement so far is "guidance first."
>
> I ended up building a free scanner along the way that maps each finding to the specific laws it implicates — and is upfront that it *can't* make you "compliant" (it's not an overlay; it just shows you the issues + the code to fix them). Full disclosure, it's mine, no signup: [LIVE URL]. But honestly I mostly wanted to share the learnings — **would love corrections from people who know this space better than I do.**

**Why this works:** the first 90% is genuinely useful, citable content with zero ask; the tool is one honest line at the end; and "please correct me" invites the practitioners' expertise instead of lecturing them. It cannot read as a "bold ad."

**Sub adaptations (keep the learning spine):**
- **r/accessibility** — exactly as above; lean hardest into humility + "correct me." This crowd knows this cold, so invite their expertise; expect (and welcome) hard critique, including of the site/pricing.
- **r/SideProject / r/indiehackers** — same learnings, but add a line of build-journey ("learning this is what made me build it") and end with "what would you have built — monitoring? a VPAT export?"
- **r/webdev / r/web_design** (only where rules allow) — trim to 2 learnings most relevant to devs (the "16 laws, not 1" point + "overlays don't work / ~30–40% ceiling"), then the tool line. Or just drop these learnings as a helpful *comment* in an existing thread.

## Audience-specific posts (different framing per group)
The learning-journey post above is for **practitioners + makers** (r/accessibility, r/SideProject, r/webdev). The three groups below care about different things, so give each its own post. Same guardrails apply: read each sub's rules, post from a real account, disclose it's yours, never claim "compliant," lead with value not the link.

### Group 1 — Shopify merchants (r/shopify, r/ecommerce) — the "internet for everyone" story
Merchants respond to mission + the practical reality of their store, NOT legalese or fear. Open with the heart, land it on something useful.

> **Title:** I've always loved the idea of an "internet for everyone" — so I dug into why so many Shopify stores lock people out, and built a free way to check yours.
>
> I've always been fascinated by the original promise of the web: an **internet for everyone**. The idea that anyone — someone who can't see the screen, can't use a mouse, navigates by keyboard or screen reader — should still be able to shop, read, and get around online.
>
> The more I looked, the more I realized how far most sites are from that, including a lot of Shopify stores. It's not malice — themes and apps quietly add things that shut people out: product images with no alt text, buttons a screen reader can't name, text too low-contrast to read, checkout fields with no labels.
>
> Two things I learned that might matter to you as a merchant:
> - This is also *why* stores get those scary "ADA demand letters" — inaccessible e-commerce is the #1 target, and the letters usually ask for a few thousand to settle.
> - The "accessibility widget/overlay" apps don't fix it — sites running them still get sued, and the FTC fined one **$1M** for claiming otherwise. The real fixes live in your theme.
>
> So I built a free tool that scans your store, shows what's blocking people (and which laws each issue touches), and gives the actual fix. No signup — and full disclosure, it's mine. It won't tell you you're "compliant" (no automated tool honestly can — they catch ~30–40%), but it's a real starting point: [LIVE URL]
>
> Mostly I wanted to share the "internet for everyone" framing, because it turned accessibility from a "legal chore" into "don't lock people out of my shop" for me. Happy to answer questions about making a Shopify store more accessible.

### Group 2 — Wix / Squarespace / small-biz owners (r/squarespace, r/wix, r/smallbusiness)
Non-technical owners. Lead with "you can check this yourself, no dev skills," be honest that some fixes are editor-level and some are platform-limited.

> **Title:** Free, no-signup way to check if your Wix/Squarespace site is usable by people with disabilities — and what you can actually fix yourself.
>
> Small-business owner-friendly heads up: a lot of Wix/Squarespace sites accidentally lock out visitors who use a screen reader, keyboard, or need higher contrast — and that's also what's behind the "ADA compliance" demand letters going around (they mostly hit small sites, and usually ask for a few thousand to settle).
>
> A couple of honest things: those "accessibility widget" add-ons don't actually fix it (sites with them still get sued), and no automated tool can truthfully promise you're "compliant" — they catch maybe 30–40% of issues. But a lot of the common problems *are* things you can fix yourself in the editor: adding image alt text, fixing low-contrast text, giving links real descriptions.
>
> I built a free tool that checks your site in ~a minute and shows the issues + how to fix them (and which ones are editor-level vs. need more). No signup, full disclosure it's mine: [LIVE URL]. Some platform-level things you can't fully fix on Wix/Squarespace — I'm honest about that too. Happy to help if anyone wants to post their site.

### Group 3 — Agencies / freelancers (r/web_design, r/Wordpress, r/freelance)
Peer-to-peer + professional. This doubles as warming for the cold-outreach track — anyone who engages goes in the outreach tracker.

> **Title:** What I learned about the accessibility laws your *clients* are actually exposed to — and a free tool that maps it (for fellow agencies/freelancers).
>
> If you build or maintain client sites, the accessibility-lawsuit thing is worth 2 minutes: ~5,000+ US web-accessibility suits were filed in 2025, ~70% against e-commerce, mostly companies under $25M — i.e. exactly the SMB clients a lot of us serve. A few things that surprised me digging in:
> - "WCAG" maps to ~16 different laws (ADA, California Unruh at $4k/violation, EAA/EN 301 549, Section 508, AODA…) — clients ask "am I compliant?" and the honest answer depends on which one.
> - Overlay widgets don't protect clients (the FTC fined accessiBe $1M; sites with overlays still get sued). Recommending one is a liability.
> - Automated testing only covers ~30–40% — so a real audit is still a real, billable service.
>
> I built a free scanner that maps each finding to the specific laws, and produces a **dated evidence record** you could white-label into your audits/retainers (it's honest — "documented effort," never "certified compliant"). Full disclosure it's mine, no signup: [LIVE URL]. Genuinely after feedback from people who do client work — is the legal mapping useful, or overkill?

### Where each goes + the caution
- **r/shopify, r/ecommerce, r/squarespace, r/wix** are **strict** and merchant/owner crowds are wary of "a dev selling something." The mission/utility framing + full disclosure + leading with useful info is what makes these postable — but check each sidebar; some only allow promo on specific days or in specific threads.
- **r/smallbusiness** — usually promo-day only; otherwise help in threads.
- If a sub disallows a post, use the **comment template** below in existing "is my site ADA compliant / got a demand letter" threads instead.

## Comment template (for helping in threads — r/shopify, r/smallbusiness, etc.)
Use when someone asks "is my site ADA compliant?" / "got a demand letter, help":
> [Answer their actual question first, honestly:] Automated tools only catch ~30–40% of issues, so no scan can promise "compliant." Demand letters usually settle around $5–20k and the first move is to talk to a lawyer, not to rush-change the site. And heads up — accessibility *overlay* widgets don't stop these suits (sites running them still get sued), so avoid those.
>
> If you want a free starting point to see what's actually flagged, I built a scanner that lists the issues and maps them to the laws — [LIVE URL]. **Full disclosure, it's mine; no signup.** The real fix is in your theme's code, and for a clean bill you'd still want a manual audit.

Value first, disclose, mention once, stay honest. Never lead with the link.

## Account prep + cadence (this week)
- **Day 0:** check sidebar rules for each sub; make sure your account has genuine history.
- **Day 1:** post the flagship in **r/accessibility**. Reply to every comment for 48h.
- **Day 3:** post the maker version in **r/SideProject**.
- **Throughout:** help in 2–3 genuine threads in r/webdev / r/shopify / r/smallbusiness (comment template).
- Don't repost the same thing everywhere on the same day.

## How this feeds the outreach (the real track)
- Any **agency owner / freelancer** who engages positively → add them to the outreach tracker as a *warm* lead.
- Use the reception as a credibility line in cold DMs: *"I shared this with r/accessibility and here's what they said / what I changed."*
- Feed every critique into the product and the positioning.

## Reminder
The Reddit track is the friendly, comfortable one. The track that tells you whether this is a *business* is still the agency outreach. Do both — but if you only have energy for one in a given day, send the DMs.

---

# 2026-06-29 — VERIFIED per-sub playbook + ready-to-paste posts (USE THESE)

_Built from a live 13-subreddit research pass (adversarially checked where possible). Visual board: https://claude.ai/code/artifact/2df26b3a-166c-4124-8792-235082b711a1 ._
_These supersede the draft posts above for the subs they cover; the drafts stay as rationale._
_⚠ Reddit blocked the bots from reading rule pages, so karma gates below are estimates — **read each sub's live sidebar before posting.**_

## Posting times in Nepal Time (NPT)
NPT = US Eastern **+ 9h45m** while the US is on daylight time (now, EDT). After early November it's **+10h45m** (EST), so shift these ~1hr later.

| Sub | US Eastern sweet spot | **Nepal Time** |
|---|---|---|
| r/accessibility | Tue/Wed 7–10am ET | **Tue/Wed 4:45–7:45 PM** |
| r/SideProject | Tue 9am–1pm ET | **Tue 6:45–10:45 PM** |
| r/indiehackers | Tue–Thu ~9am ET | **Tue–Thu ~6:45 PM** |
| r/web_design | Mon–Wed 6–9am ET | **Mon–Wed 3:45–6:45 PM** |
| r/webdev | Saturday ~8am ET | **Sat ~5:45 PM** |
| Buyer subs (commenting) | Tue–Thu 6–9am ET | **Tue–Thu 3:45–6:45 PM** |

General rule: aim for **5:45–8:45 PM Nepal time, Tue–Thu**. Post only when you can sit and reply for the next 1–2 hours.

## The verdict board (what you can actually do in each)
| Sub | Verdict | Key rule / gate |
|---|---|---|
| **r/SideProject** | ✅ POST (primary launch) | self-promo is the point; ~10 karma |
| **r/accessibility** | ✅ POST (learning-journey only) | restricted, value-first; aged acct + real history; verify sidebar |
| **r/indiehackers** | ✅ POST ×1 | must use the **"SHOW IH" flair**; ~50 karma, 14d |
| **r/webdev** | 🟠 SHOWCASE ONLY | **"Showoff Saturday" flair, Saturdays only** |
| **r/web_design** | 🟠 VALUE POST | main-feed promo ≈ banned; use weekly showcase thread or a link-free teaching post |
| **r/shopify** ★buyer | 🔵 COMMENT-FIRST | strictly promo-free; help in ADA/overlay threads, tool once in-context |
| **r/squarespace** ★buyer | 🔵 COMMENT-FIRST | "free help before paid tools" norm |
| **r/Wix** ★buyer | 🔵 COMMENT-FIRST | help/support sub; link-posts removed |
| **r/Wordpress** | 🔵 COMMENT-FIRST | promotion-free (mod-confirmed); promo only in sibling plugin/theme subs |
| **r/smallbusiness** | 🔵 COMMENT-FIRST | promo only in the weekly "Promote your Business" thread |
| **r/ecommerce** | 🔴 COMMENT-ONLY | bans self-promo "even if free"; founder-stories explicitly removable (ban risk) |
| **r/freelance** | 🔴 COMMENT-ONLY | strict; violations = removal + permanent ban |
| **r/Entrepreneur** | ⚪ LOW PRIORITY | needs 10 in-sub comment karma to post; AI-written posts = ban; audience = peers not buyers |

★ = your actual buyer. The rooms that let you post aren't your buyers; the rooms with your buyers won't let you post. Buyer signal lives in the *comments* of the merchant subs.

## Ready-to-paste posts (written to read human, not AI)
Rules: **one sub per day**, link in the **first comment** (not the body), reply fast, and **swap in one TRUE personal detail** before posting (the real reason you got curious) — that's the biggest anti-AI move.

### 1 — r/accessibility (your credibility anchor)
```text
Title: went down the web-accessibility law rabbit hole for a few months as a dev. some of it genuinely surprised me, and i'd love if you told me where i'm wrong

quick context: i'm a web dev, not an a11y specialist, so this is me sharing what i learned, not lecturing people who've done this for years.

i got into it kind of by accident. read about a lawsuit, realised i had no idea what "ADA compliant" even meant for a website, started digging. stuff that stuck with me:

- there isn't really one "web accessibility law." WCAG is the technical spec, but it gets referenced by a whole pile of different laws depending where your users are (ADA, Section 508, the EU's EAA, Ontario's AODA...). the same broken button can put you on the wrong side of several at once, which i hadn't clocked.

- in the US a lot of it isn't the government coming after you, it's private lawsuits and demand letters. that reframed the whole thing for me.

- the overlay widgets. i'd assumed those little "accessibility" toolbar things actually fixed sites. then i found the Overlay Fact Sheet, and the FTC fining accessiBe a million dollars for claiming their AI made sites compliant. changed how i see this whole space.

- automated testing only catches roughly a third of WCAG. the rest genuinely needs a human, and i don't think i appreciated how much before.

learning this is what got me to build something. full disclosure it's mine: a free scanner that runs the checks and, instead of one vague score, tells you which of those laws each issue maps to, and is upfront it can't make you "compliant" (only catches the automatable part). no overlay, no signup.

honestly i'm more interested in being corrected than in anyone using it. for those who do this for real: is the per-law mapping actually useful, or is it noise? and what's the one thing a free first-pass tool should do that they all get wrong? happy to be told i've misunderstood any of the above.

(link in a comment so this isn't just an ad)
```

### 2 — r/SideProject (where the scans + emails come from)
```text
Title: i made a free accessibility scanner because the "ADA compliance" widgets everyone sells annoyed me

short version: scan any page, it finds the accessibility problems and tells you which actual laws each one is tied to. free, no signup, no overlay widget. [attach a 10-15s gif of a scan + the report]

longer story: i went looking for a way to check if a site was accessible and the whole market is these overlay scripts promising "instant ADA compliance." turns out a lot of them don't work, sites with them installed still get sued, and the FTC fined one of the big ones (accessiBe) a million dollars last year for the "our AI makes you compliant" claim. that annoyed me enough to build the honest version.

so this thing:
- runs in a real browser so it sees the page like a user does, not a static fetch
- maps every issue to the laws it touches instead of one meaningless score
- is upfront that automated tools only catch ~30-40%, so it tells you what still needs a human instead of pretending it's done
- doesn't try to sell you a widget that "fixes" everything

it's the first real thing i've shipped solo, so i'd genuinely take brutal feedback. mainly: is the report clear or overwhelming, and would you actually trust a tool MORE for telling you what it can't do? that bit was a gamble.

(it's called A11y Beast for now, the name's probably changing. link in comments.)
```

### 3 — r/indiehackers (use the **SHOW IH** flair)
```text
Title: built a free accessibility scanner, but the interesting part is figuring out what's actually worth paying for

context: spent a while learning web accessibility (the law side is messier than i thought, WCAG gets referenced by like a dozen different laws depending on country). built a free scanner out of it. checks a page, maps each problem to the laws it implicates, honest that automated testing only catches about a third of real issues.

the free scan is easy to give away because it's a commodity, free scanners are everywhere. where i'm stuck is the business side, which is why i'm asking here.

what people seem to actually pay for isn't the scan, it's the paperwork. a dated record proving they tested and tried, that an agency can hand a client or attach to a contract. audits that produce that run a couple grand. so my instinct is the money's in the "evidence" layer (a portable report, monitoring over time, white-label for agencies), not a monthly scanner sub.

but i haven't sold anything yet, so that's a theory, not a fact. for those who've sold to agencies or SMBs: would a "proof you did the work" document actually open wallets, or am i romanticising it? and what would make you reach for it instead of running a free scan and forgetting about it?

(full disclosure the tool's mine, link in comments, would love a teardown of the report itself)
```

### 4 — r/webdev (**Showoff Saturday only**, with the flair)
```text
Title: a free accessibility scanner that's honest about what automated testing can't do

showoff saturday. this is mine, free, no signup.

what it is: paste a url, it loads the page in real chromium (puppeteer, not a static fetch, so JS/SPA content actually gets seen), runs axe-core plus some checks i wrote, and gives you the issues by severity. the twist is it maps each finding to the specific laws it touches (ADA, Section 508, EAA...) instead of one vanity score.

being upfront because this crowd will rightly ask: yes the engine is mostly axe-core, that's open source and i'm not pretending otherwise. what i added is ~20 custom checks for things axe misses, the legal mapping, and a dated report you can keep. it says clearly that automated testing only catches ~30-40% of WCAG, so it flags what still needs manual review instead of slapping a "compliant" badge on you. (built it partly because the overlay side of this industry is genuinely shady, accessiBe ate a $1M FTC fine for the "AI makes you compliant" line.)

stuff i'd love eyes on: report readability, whether the per-law mapping is useful or just noise, and any false positives you hit. roast welcome.

(link in comments)
```

### 5 — r/web_design (lead with value, hold the link back)
```text
Title: the same 5 accessibility issues show up on almost every small site i look at. here's what they are and how to fix them.

i've been scanning a lot of small-business and portfolio sites lately (why, at the end) and it's the same handful of things every time. none are hard to fix, so sharing in case it saves someone a redesign headache or a demand letter.

1. low-contrast text. that light-grey-on-white look designers love fails WCAG AA constantly. normal text needs 4.5:1. check your muted text and placeholders especially.

2. images with no alt text, or alt="IMG_1234.jpg". decorative images get empty alt (alt=""), meaningful ones need a real description.

3. focus states stripped off. someone sets outline:none to make buttons look cleaner and now keyboard users can't tell where they are. if you remove the default outline, put a visible one back.

4. inputs with no real label. placeholder text isn't a label, it vanishes when you type and screen readers handle it inconsistently. every input needs an associated <label>.

5. links that all say "click here" / "read more." meaningless out of context for anyone navigating by links. describe where the link goes.

none of this needs an overlay widget, by the way. those tend to make it worse and don't stop lawsuits, sites with them still get sued. it's all just markup.

why i've been scanning so many: i built a free tool that checks these and maps them to the laws they fall under. it's mine so i won't link it in the post, but happy to drop it in a comment if anyone wants it. mostly i just wanted to share the list, this stuff is so common and so fixable.
```

### Bonus — the comment for buyer subs (Shopify / Squarespace / Wix / r/Wordpress / smallbusiness)
Use when someone asks "is my store ADA compliant / do I need an accessibility app / are overlays legit." Help first, link optional.
```text
honest answer since this comes up a lot: you don't need an overlay widget, and i'd avoid them. the little "accessibility" toolbars that promise instant ADA compliance mostly don't work, and sites that install them still get sued (the FTC even fined accessiBe $1M for claiming their AI made sites compliant). don't let anyone scare you into one.

what actually helps is fixing the real stuff, and most of it is boring and doable: color contrast, alt text on images, labels on form fields, visible focus outlines, and link text that isn't "click here." that handful covers a big chunk of what gets flagged.

if you want to see where your store stands, run any free scanner. full disclosure i built one that maps each issue to the laws it touches and is upfront that automated checks only catch ~30-40%, so you still want a human for the rest. happy to link it if useful, but honestly any decent scanner plus fixing the basics puts you ahead of most stores.
```
