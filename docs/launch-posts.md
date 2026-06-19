# A11y Beast — Launch Posts (drafts)

_Created 2026-06-19. Ready-to-adapt drafts for a credibility-first, anti-overlay launch. Based on `gtm-launch-research.md`. Edit to your voice before posting._

## ⚠️ Read before posting
1. **URL vs brand:** your live link is `accesslens-green.vercel.app`, but the brand is **A11y Beast**. Ideally **register & point `a11ybeast.com` first** so the link matches the name — a mismatched URL reads as unpolished on launch day. Drafts below use `[a11ybeast.com]` as a placeholder; swap in whatever's live.
2. **Cardinal rule — never claim "compliant."** Don't say the tool makes a site compliant or lawsuit-proof. Always frame as "see which laws you're exposed under + the code to fix it." This is your whole credibility edge; one overclaim undoes it.
3. **Warm up before Reddit.** Spend a few days commenting helpfully in the target subs *before* dropping a post — fresh accounts that only self-promote get removed. Read each sub's rules (many ban or restrict tool links; some have a weekly self-promo thread).
4. **Don't blast the same post everywhere at once** — tailor per community; cross-posting identical promo gets flagged.

## Facts you can safely cite (all verified)
- Seyfarth: **3,117** federal website-accessibility lawsuits in 2025 (**+27%** over 2024). UsableNet: **5,114** total digital suits in 2025; **1,416** hit sites already running an accessibility widget.
- FTC **charged accessiBe** over deceptive "compliance" claims; it **settled for $1M** (2025). *(Say "charged/settled," not "fined for proven fraud.")*
- **EAA** (EU) has applied since **28 June 2025**; most EU e-commerce is in scope.
- Automated testing catches only **~30–40%** of issues — full conformance needs manual review.

---

## 1. Show HN (Hacker News) — for the tool + the dev crowd
**Title:** `Show HN: A11y Beast – free scanner that maps each accessibility issue to the laws it breaks`

**Text:**
> I built a free web-accessibility scanner with a twist: instead of just listing WCAG violations, it maps each one to the **16 legal frameworks** it implicates (ADA, the EU Accessibility Act, Section 508, California's Unruh Act, etc.) and gives you the code to fix it.
>
> Why: existing tools mostly either dump raw WCAG output with no legal context, or sell "accessibility overlay" widgets that promise instant compliance — which don't work (the FTC charged one vendor and it settled for $1M in 2025, and ~1,400 sites running a widget were sued anyway last year).
>
> It renders each page in a real browser (Puppeteer) and runs axe-core's rules plus ~20 custom checks. On paste/upload, your HTML never leaves the browser. There's a CLI + GitHub Action too.
>
> I've tried hard to be honest about limits: automated testing only catches ~30–40% of issues, so it's labeled an "automated-coverage indicator, not a conformance verdict" — not legal advice, and it won't make anyone "compliant." Curious what this community thinks of the legal-mapping angle and where it's wrong.
>
> [link]

**Rules:** Post it yourself; **do NOT ask anyone to upvote** (HN penalizes vote solicitation). Engage in the comments. Best posted weekday morning US time.

---

## 2. Reddit — value-first post (the buyer beachhead)
**Where:** r/smallbusiness, r/ecommerce, or r/Entrepreneur (pick one; check its self-promo rule first). This is helpful content with the tool disclosed once — not an ad.

**Title:** `"ADA website compliance" demand letters are everywhere now — what actually helps, and the trap to avoid`

**Body:**
> If you run a website with any kind of storefront, you may have gotten (or will get) a demand letter claiming your site isn't accessible to people with disabilities. It's a real wave — over 3,000 of these hit federal court in 2025, ~70% against e-commerce. A few things I've learned:
>
> **1. Don't buy an "accessibility overlay/widget" to make it go away.** Those one-line scripts that promise instant ADA compliance don't deliver it and don't stop lawsuits — ~1,400 sites running one were sued anyway in 2025, and the FTC charged a major overlay vendor (it settled for $1M). Plaintiffs and the disability community actively dislike them.
>
> **2. What actually helps:** fix the real issues in your site — missing alt text, low contrast, unlabeled form fields, keyboard traps. Start by *finding* them.
>
> **3. Be wary of anyone (including tools) claiming to make you "compliant."** Automated scans only catch ~30–40%; the rest needs a human. Treat scans as a starting point.
>
> Free ways to see where you stand: axe DevTools and WAVE are free browser tools. I also built a free scanner ([a11ybeast.com]) that maps each issue to the specific laws it implicates and gives fix code — **disclosure: it's mine**, mentioning it because the legal-mapping is the part I couldn't find elsewhere. Happy to answer questions either way.

**Rules:** Lead with value; the disclosure is non-negotiable; don't repost across subs verbatim.

---

## 3. Reddit/forum — reply template (for existing "I got sued / am I at risk" threads)
_The lowest-risk, highest-intent way in. Drop this (adapted) on real threads in r/shopify, Shopify Community, r/smallbusiness, etc._

> Sorry you're dealing with this — they're stressful but usually settle. One thing to avoid: don't rush to install an "accessibility overlay" widget to fix it. They don't make a site compliant and they don't stop these suits (the FTC charged one vendor $1M over that claim, and tons of sites running them got sued anyway). What helps is fixing the actual issues in your code.
>
> Free ways to see what's wrong: axe DevTools, WAVE, or — disclosure, I built this — a free scanner that shows which laws each issue implicates and the fix: [a11ybeast.com]. Won't make you "compliant" (no tool can — automation catches ~a third of issues), but it'll show you where to start. Happy to look at your results.

---

## 4. Indie Hackers / r/SaaS — founder/launch post (build-in-public is welcome here)
**Title:** `Launched a free accessibility scanner that tells you which laws your site is breaking`

**Body:**
> Web-accessibility lawsuits keep climbing (3,000+ in US federal court in 2025), and the EU Accessibility Act just kicked in — but the tooling is split between raw WCAG linters and overlay-widget "compliance" snake-oil (the FTC just fined one $1M-ish).
>
> So I built **A11y Beast** ([a11ybeast.com]): scan a page free, and instead of a wall of WCAG codes you get each issue mapped to the 16 laws it implicates + the code to fix it. Real-browser rendering, axe-core + custom checks, CLI/GitHub Action. The whole positioning is *honesty* — it's explicitly "an automated indicator, not a compliance guarantee," because that's exactly what the overlay vendors got fined for.
>
> Free tier is the scanner; the plan is to charge for ongoing monitoring + agency white-label. Would love feedback on the wedge and the pricing thinking.

**Rules:** IH and r/SaaS tolerate launch/feedback posts; still engage genuinely, don't drive-by.

---

## 5. LinkedIn — the EU / EAA angle (freshest urgency)
> The European Accessibility Act has applied since **28 June 2025** — and most EU e-commerce, banking, and travel sites are now in scope, with member-state fines for non-compliance. A lot of businesses still aren't sure where they stand.
>
> If that's you: skip the "accessibility overlay" widgets (they don't deliver compliance and the FTC just fined a major one) and start by *finding* the real issues. I built a free scanner that checks a page against the EAA (and 15 other frameworks like the ADA and UK Equality Act) and shows the code to fix each finding: [a11ybeast.com].
>
> It's an honest automated indicator — not a conformance verdict, not legal advice — but it'll tell you where you're exposed. Happy to help anyone navigating the EAA deadline.

**Rules:** LinkedIn is self-promo-friendly; tag relevant hashtags (#accessibility #EAA #ecommerce). Good for reaching agencies + EU businesses.

---

## 6. Product Hunt (optional, when you do a formal launch)
- **Tagline:** "Free accessibility scanner that maps each issue to the law it breaks."
- **Description:** "A11y Beast renders your page in a real browser, runs 125+ checks, and maps every accessibility issue to the 16 legal frameworks it implicates (ADA, EAA, Section 508, Unruh…) — with the code to fix each one. Honest by design: an automated-coverage indicator, not a compliance guarantee. Not an overlay."

---

## Suggested first-week order
1. **Get `a11ybeast.com` live** so links match the brand.
2. Warm up: a few helpful comments in r/shopify / r/smallbusiness (no links).
3. **Show HN** (weekday AM US) — the most credibility-aligned launch surface.
4. **LinkedIn EAA post** — rides the freshest, most urgent demand.
5. **Reply template** on 5–10 real "demand letter / am I at risk" threads.
6. The **value-first Reddit post** once your account has some genuine history in the sub.
7. **Indie Hackers** founder post for feedback.
Watch your **scan → email opt-in rate** in Mixpanel after each push — that's the signal.
