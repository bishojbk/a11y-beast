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
