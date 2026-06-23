# SEO Keyword → Page Map

_A11y Beast · created 2026-06-16. Turns the keyword research into an executable on-page SEO plan: every demand cluster is assigned to one page, with a target keyword, the real queries to satisfy, and recommended title/meta/H1._

## How this was built (and its limits)

- **Source of demand data:** Google Autocomplete (Suggest API) pulled directly for ~30 accessibility/compliance seed terms. These are *real* Google completions — the actual long-tail people type, ranked by Google's popularity signal.
- **Not available in this environment:** Google Trends returned `429` (rate-limited from a data-center IP), and absolute monthly search volumes sit behind paywalled tools (Keyword Planner / Ahrefs / Semrush). So this map ranks by **autocomplete signal + buyer intent**, not by exact volume.
- **To upgrade later:** connect Ahrefs or Semrush and layer exact volume + keyword-difficulty onto the clusters below; set up **Google Search Console** (the site has none yet) to measure actual impressions/clicks per page after these changes ship.

## Core principle — one cluster per page, brand vs. keyword split

1. **One primary keyword cluster per page.** Don't make two pages chase the same term (cannibalization). The homepage owns the category term ("accessibility checker"); blog posts own informational long-tail.
2. **Split the title from the social title.** The `<title>` tag (SERP + browser tab) should carry keywords; the `og:title` (social shares) can keep the brand hook. Next.js supports this via separate `title` and `openGraph.title`. **Implemented on the homepage** as of 2026-06-16.
3. **Keep the brand voice on-page.** The hero H1 stays brand-led ("you're breaking 16 laws"); keywords live in the title tag, meta description, and one keyword-bearing H2 — written naturally, never stuffed.

### Title-tag formula
`<Primary keyword> — <qualifier / differentiator> | A11y Beast` — aim ≤ 60 characters so it doesn't truncate in Google.

---

## The demand clusters (from autocomplete)

| Cluster | Representative real queries (autocomplete) | Intent | Target page | Status |
|---|---|---|---|---|
| **Accessibility checker (category)** | `accessibility checker`, `free accessibility checker for website`, `ada compliance checker`, `website accessibility checker free`, `wcag compliance checker` | Commercial — wants a tool | **Homepage** `/` | ✅ exists — retitled |
| **ADA compliance (head)** | `ada compliance`, `ada compliance requirements`, `ada website compliance`, `ada compliance meaning` | Informational → commercial | Homepage + `/blog/how-to-check-if-your-website-is-ada-compliant` | ✅ exists |
| **Compliance DEADLINE / "April 2026"** | `ada compliance april 2026`, `ada compliance deadline`, `wcag compliance april 2026`, `accessibility compliance april 2026`, `web accessibility deadline` | High-anxiety, timely | **NEW** `/blog/ada-compliance-deadline-2026` | 🔨 to build |
| **Platform-specific** | `is my shopify website ada compliant`, `how to make my website ada compliant on shopify / wordpress / squarespace / wix` | High intent, specific stack | **NEW** platform guides | 🔨 to build |
| **WCAG version** | `wcag 2.2 vs 2.1`, `what is latest wcag version`, `which version of wcag should i use` | Informational | `/blog/which-wcag-version-does-the-law-require` | ✅ exists |
| **Checklist** | `ada compliance checklist`, `wcag 2.1 aa checklist`, `wcag 2.2 aa checklist`, `accessibility audit checklist` | Informational, linkable | **NEW** `/blog/ada-wcag-compliance-checklist` | 🔨 to build |
| **Accessibility statement** | `accessibility statement generator`, `accessibility statement template`, `accessibility statement examples` | Tool + template | **NEW** `/accessibility-statement-generator` (micro-tool) | 🔨 to build |
| **Lawsuit cost / defense** | `ada lawsuit payout`, `ada website lawsuit settlement amounts`, `ada website lawsuit defense` | High-anxiety, commercial | re-angle `/blog/why-web-accessibility-lawsuits-are-surging` | ✏️ re-angle |
| **Overlays** | `accessibility overlays are bad`, `accessibility overlay lawsuit`, `accessibility overlay fact sheet` | Defensive / comparison | `/blog/do-accessibility-overlays-work` | ✅ exists |
| **Section 508 / VPAT** | `section 508 compliance`, `section 508 compliance checklist`, `vpat meaning`, `vpat example` | Federal niche | `/blog/section-508-compliance-explained` | ✅ exists |
| **EAA** | `european accessibility act 2025 deadline`, `eaa requirements`, `eaa websites` | Informational, timely | `/blog/european-accessibility-act-deadline` | ✅ exists |
| **Unruh / California** | `unruh act damages`, `unruh act statutory damages`, `ada lawsuit california` | CA-specific | `/blog/california-unruh-act-and-your-website` | ✅ exists |

---

## Page-by-page on-page plan

### `/` — Homepage  ·  cluster: **accessibility checker (category)**
- **Primary keyword:** free accessibility checker · **Supporting:** ada compliance checker, website accessibility checker, wcag checker
- **`<title>` (SERP):** `Free Accessibility Checker for ADA & WCAG | A11y Beast`  ✅ _shipped_
- **`og:title` (social):** `A11y Beast — you're not just failing WCAG. You're breaking 16 laws.`  ✅ _shipped_
- **Meta description:** `Free accessibility checker that maps every WCAG violation to 16 laws — ADA, EAA, Section 508, California Unruh and more. 110+ checks in a real browser. Not an overlay.`  ✅ _shipped_
- **H1:** keep brand — "Most tools say you fail WCAG 1.1.1. We say you're breaking 16 laws." (no change)
- **TODO (next):** add ONE keyword-bearing H2 near the scanner, e.g. _"A free accessibility checker that maps issues to the law"_ — gives crawlers an on-page keyword match without touching the hero. (Design-sensitive; do deliberately.)

### `/pricing` — cluster: **pricing/commercial (light)**
- **`<title>`:** `Pricing` → renders `Pricing — A11y Beast` ✅ (already fixed). Optional later: `Pricing — Free Accessibility Checker & Plans`.
- **Self-canonical** ✅ already fixed. No keyword surgery needed; this page converts, it doesn't need to rank for a head term.

### `/about` — cluster: **brand / E-E-A-T (not keyword-targeted)**
- Leave keyword-light on purpose. Its SEO job is trust/entity signal (Organization + founder schema ✅), not ranking for a head term.

### NEW `/blog/ada-compliance-deadline-2026` — cluster: **DEADLINE** 🔨 _highest-demand gap_
- **Primary keyword:** ada compliance deadline · **Supporting:** ada compliance april 2026, web accessibility deadline, wcag compliance 2026
- **`<title>`:** `The April 2026 ADA Compliance Deadline, Explained`
- **Angle (accuracy-critical):** The "April 2026" date people are panicking about is the **DOJ ADA Title II rule for state & local governments** — and it was **extended to April 2027** by an interim final rule. It is **not** a deadline for private businesses. The post captures the high-anxiety traffic *and* corrects the confusion (authority play). Do NOT imply private companies have an April 2026 deadline — that would be inaccurate and fear-mongering.
- **Internal links:** → `which-wcag-version-does-the-law-require`, → homepage scanner.

### NEW platform guides — cluster: **platform-specific** 🔨
- Pages: `/blog/make-your-shopify-store-ada-compliant`, `/blog/make-your-wordpress-site-ada-compliant` (add Wix/Squarespace later).
- **Primary keyword (Shopify):** how to make your shopify website ada compliant · **Supporting:** is my shopify website ada compliant
- **`<title>`:** `How to Make Your Shopify Store ADA Compliant`
- **Angle:** platform-specific gotchas (themes, apps, alt text on product images) + "scan it free" CTA. Naturally high-converting because the reader has a specific stack and a specific worry.

### NEW `/blog/ada-wcag-compliance-checklist` — cluster: **checklist** 🔨
- **Primary keyword:** ada compliance checklist · **Supporting:** wcag 2.1 aa checklist
- **`<title>`:** `ADA & WCAG 2.1 AA Compliance Checklist (2026)`
- **Angle:** scannable, downloadable checklist — classic link-magnet. Mark clearly which items automation can check (ties to the "what scans can/can't catch" post) vs. which need manual review.

### NEW `/accessibility-statement-generator` — cluster: **accessibility statement** 🔨 _(product page / micro-tool, not a blog post)_
- **Primary keyword:** accessibility statement generator · **Supporting:** accessibility statement template, examples
- **`<title>`:** `Free Accessibility Statement Generator`
- **Angle:** a genuinely useful free tool (fill a form → get a statement) = strong link-bait + top-of-funnel capture that feeds the scanner. Competes directly with UserWay/Siteimprove generators that rank today.

### `/blog/why-web-accessibility-lawsuits-are-surging` — ✏️ **re-angle**
- The trend/stats framing is journalistic; the higher-intent query is **cost**. Add a section (and work into the title/description) targeting `ada lawsuit settlement amounts` / `ada lawsuit payout` / `ada website lawsuit defense`. Keep the verified 2025 stats; lead the reader toward "what it costs you and how to prevent it."

---

## Competitor pattern note
The incumbents (accessiBe, UserWay, AudioEye, Siteimprove, Level Access, Deque, WebAIM) publish heavily around exactly these clusters: **free checker/scanner pages, ADA compliance guides, accessibility-statement generators, WCAG checklists, and state/law explainers.** That both validates the demand and means these terms are competitive — our edge is the **legal-risk angle + honesty (anti-overlay, "automated indicator not a verdict")**, which the overlay vendors can't credibly claim.

## Execution status (by demand × effort)
1. ✅ Homepage title/meta split — _done._
2. ✅ `/blog/ada-compliance-deadline-2026` — top demand, timely. _Built._
3. ✅ Platform guides — `/blog/make-your-shopify-store-ada-compliant` + `/blog/make-your-wordpress-site-ada-compliant`. _Built_ (Wix/Squarespace can reuse the template later).
4. ✅ Re-angled the lawsuits post toward settlement cost (`/blog/why-web-accessibility-lawsuits-are-surging`). _Done._
5. ✅ `/blog/ada-wcag-compliance-checklist` — link-magnet, [auto]/[manual] tagged. _Built._
6. ✅ `/accessibility-statement-generator` micro-tool — interactive, W3C-structured, honest defaults. _Built._
7. 🔭 **Next, on you:** set up Google Search Console to measure all of the above; revisit with Ahrefs/Semrush volume data. Optional: add one keyword-bearing H2 to the homepage; Wix/Squarespace platform guides.

_All blog content is drafted and should be reviewed before publishing. Every statistic is primary-source-verified and inline-cited; the lawsuit-cost figures deliberately avoid the unverifiable vendor ranges that circulate online._
