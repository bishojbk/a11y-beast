# design.md — the human design system

_The canonical design direction for the accessibility-scanner site (working names: A11y Beast / AccessLens). Written 2026-06-26, grounded in a multi-source study of real human-made reference sites. **This document supersedes `design_handoff_a11y_beast/`** — that bundle was an AI-generated design handoff, and its "Ink & Ember" dark-forensic look is exactly what we are replacing._

---

## 0. Why this exists

The current site reads as **AI-built**. Not because the taste is bad — because the whole visual system was conceived by an AI design tool and it landed on the statistical center of "edgy AI startup": a near-black canvas, one hot crimson accent, a serif headline with one word italicized in the accent color, and a thick layer of decoration (a scrolling lawsuit ticker, blinking status dots, radial glows, a gradient-glow button, mono micro-labels on every section, a "case file" aside). It has **zero real product imagery, zero humans, and an aggressive "you're breaking 16 laws / INDICTMENT" tone.**

That fights the actual business. We sell an **honest, dated, defensible evidence record** to **small US web/design agencies** who resell it into $1.25k–25k audits. This is a considered, relationship-led, human-closed B2B purchase. The thing that closes it is **credibility and "a real expert made this,"** not flash. The redesign's north star:

> **A legal-evidence document you'd be proud to hand a client — calm, warm, specific, and unmistakably made by a person who knows this field.**

And because this is an **accessibility tool**, the site itself must be an exemplary-accessible artifact (WCAG 2.2 AA). The site's own conformance is the proof. Design competence *is* the sales pitch.

---

## 1. The decision: "The Record"

Three directions were developed from the research. We are building **Direction 1, executed with Direction 2's enterprise discipline.**

| Direction | Vibe | Verdict |
|---|---|---|
| **① The Record** (warm editorial / paper) | Warm bone paper, a confident editorial serif, the dated record as the hero | **✅ CHOSEN** — most distinctive, and the only one whose *look* embodies the "dated, defensible record" thesis |
| ② The Ledger (calm light enterprise) | Vanta-grade white/teal trust software, real screenshots carry it | Absorbed as the **engineering standard** (discipline, real product shots, trust-center catalog) so The Record reads as serious software, not a literary blog |
| ③ The Brief (restrained dark) | Harvey-style near-monochrome ink, experts do the persuading | Held in reserve — only if we ever want dark, and only with wall-to-wall real product UI |

**Why The Record wins for *this* sale:** small agencies have seen a thousand light-blue SaaS pages (②'s risk) and a thousand dark crimson AI pages (today's site, ③'s risk). **Warm paper + a calm evidence-green + a characterful serif is a lane almost no competitor occupies.** It reframes us from "another scanner" (a free commodity with a €39/yr near-clone) to "a deliverable I can bill and resell." And the warm ground + a real expert's face is what closes a human-sold deal. Bonus: the warm `#F4F1EA` palette **already exists** in the codebase as the opt-in light theme — promoting it to default is the lowest-effort, highest-impact move available.

> **If you'd rather go a different way:** swap the palette + display font per the spec in §10 ("Alternate directions"). Everything else in this doc (spacing, motion, a11y, voice, anti-patterns) holds regardless of direction.

---

## 2. Voice & tone

The voice is a **calm, senior expert who respects the reader's judgment.** Confidence doesn't shout.

- **Kill all fear copy.** No "INDICTMENT," no "verdicts," no "you're breaking 16 laws," no threat tickers. State plainly what the scan finds and which frameworks apply.
- **Honesty is the headline, not the fine print.** Lead with what automation *can and cannot* catch (the honest ~30–40% automated-coverage limit). This is both the differentiator and the FTC-safe posture (the accessiBe $1M fine looms over anyone implying "guaranteed compliance").
- **Specific, sourced, quiet.** "110+ checks = axe-core's 96 rules + 20 custom checks." "16 legal frameworks." "A dated, SHA-256-hashed record." Specificity is the persuasion device — never decoration.
- **Plain language.** GOV.UK-style section labels ("How it works," "What we check," "Frameworks"), zero jargon kickers.

**Never:** claim or imply "guaranteed compliance," a "compliance badge," or certification anywhere.

---

## 3. Color

Light/warm paper is the **default ground**. Color is **functional only** — most of the page is neutral; one calm brand hue appears sparingly; a true red is reserved for genuine errors/critical findings. **Retire crimson as the brand color.** Red must mean something.

### Light (default)
```
--bg-base:      #F4F1EA   /* warm bone — the paper */
--bg-raised:    #FCFAF5   /* lifted card / panel */
--bg-overlay:   #FFFFFF   /* highest surface, inputs */

--ink-primary:  #1A1714   /* warm near-black (not pure #000) */
--ink-secondary:#4A443D   /* >=4.5:1 on bone */
--ink-tertiary: #6B655C   /* labels, meta — verify >=4.5:1 at size */

--brand:        #1C5D52   /* deep evidence-green/teal — links + primary CTA */
--brand-hover:  #16463E
--brand-tint:   rgba(28,93,82,0.08)   /* quiet fills only */

/* SEMANTIC — reserved, never decorative */
--critical:     #B4283A   /* critical-severity findings / real errors ONLY */
--major:        #8A4B06   /* amber */
--minor:        #6B5408
--pass:         #1C7D4D   /* resolved / passing */
--info:         #2E5FB0

--border:       rgba(26,23,20,0.14)   /* hairline */
--border-strong:rgba(26,23,20,0.28)
--focus:        #1C5D52   /* see §6 focus signature */
```
Optional, restrained: one per-section secondary warm hue (clay/ochre, à la Stripe Press) used sparingly. Never a gradient, never a glow.

### Dark (opt-in only, refined)
Not the current near-black. Cool ink, restrained, every section carried by real product UI:
```
--bg-base: #14161A   --bg-raised: #1C1F24
--ink-primary: #ECEEF1   --ink-secondary: #AEB4BD  (>=4.5:1)
--brand: #7FB5A6  (muted sage — never a glow)
--critical: #FF6B6B (critical only)
```

**Contrast is non-negotiable:** every text/background pair must hit **≥4.5:1** (≥3:1 for large text and UI borders). We ship an a11y tool; verify with our own scanner.

---

## 4. Typography

A characterful editorial serif does the emotional work; a clean grotesque carries the reading; mono is reserved for genuinely technical tokens.

| Role | Font | Use | Notes |
|---|---|---|---|
| **Display** | **Fraunces** (variable, high optical-size, soft) | h1–h3, big stat numbers, the gauge number, card titles | via `next/font/google`. Set tight-but-not-touching (`letter-spacing: -0.01em`). **Replaces Newsreader.** |
| **Body / UI** | **Archivo** (already loaded) | everything else — body, nav, buttons, labels | warm neutral grotesque; generous leading; prose measure **60–68ch** |
| **Mono** | **IBM Plex Mono** (already loaded) | WCAG IDs, CSS selectors, the SHA-256 hash, code blocks | **removed from all section kickers** — mono means "this is technical," nothing else |

**Hard rule:** **never** the serif-headline-with-one-italic-accent-colored-word pattern again (today's `.hero-title .ember`). Emphasis comes from **weight or a subtle underline/marker**, never from recoloring one word in the brand hue.

**Type scale** (8px-derived, clamp for fluidity): 13 / 15(base) / 17 / 20 / 24 / 30 / 38 / 48 / 64. Display sizes use Fraunces; ≤20px uses Archivo.

---

## 5. Space, grid & shape

- **One 8px spacing rhythm everywhere:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128. Section padding 96–128px (marketing), 24–36px (dense data).
- **Radius family, near-sharp** (engineered-document feel): `--r-sm: 4px`, `--r-md: 6px`, `--r-lg: 8px`. One family, used consistently.
- **Borders, not shadows, do the separating:** real 1px `--border` hairlines. **At most one honest soft shadow** for a genuinely lifted element. No stacked glows.
- **Break the uniform grid deliberately.** Vary card size by importance (let one framework card span; let the hero artifact be larger). Asymmetric editorial layout — offset images, alternating left/right content bands — instead of the centered single-column-with-equal-cards AI default.
- **Prose measure** capped at ~60–68ch so dense legal/technical copy reads like an essay, not a warning label.

---

## 6. Motion (tiny budget)

Motion is **rhythm, not spectacle** — the exception, not the rule. A deliberately near-still site reads as confidence and doubles as proof of accessibility competence.

- **One** short fade/translate-up on section entry (~0.45–0.55s, ease-out). That's the budget.
- Real **state** transitions only (hover, focus, the gauge filling once when a score arrives).
- **Nothing infinite. Nothing that blinks or pulses.** No ticker/marquee, no animated counters, no blinking log cursor, no "liveness theater."
- **`prefers-reduced-motion`: remove motion entirely** (not merely slow it). Content appears at final state instantly.

---

## 7. Accessibility as the signature (non-negotiable)

This is where we out-credential everyone. Don't claim competence — **demonstrate it.**

- **Focus signature (our brand moment):** adapt the GOV.UK pattern — a high-visibility focus state that is unmistakably intentional. A **3px solid `--brand` outline at 2px offset**, plus on body links a underline that **thickens from 1px → 3px**. (GOV.UK uses a yellow highlight block + black bottom bar; we adapt the color to the paper palette.) A thin 2px crimson outline is *not* good enough for an a11y tool.
- **Links carry meaning beyond color:** body links are `--brand` **with a 1px underline** that thickens on hover. Never color-only.
- **Severity is never color-only:** color + label + icon/shape, always.
- **Semantics:** real landmarks, one `<h1>`, ordered headings, `aria-live="polite"` on scan progress, ARIA tabs on the scanner, `role="img"` + label on the gauge.
- **Targets ≥24×24px** (WCAG 2.5.8). All states verified ≥4.5:1 on the *real* palette.
- **Eat our own dog food:** publicly run our scanner on our own marketing pages and **show the honest result** (WebAIM does this; it's irreproducible proof).

---

## 8. Imagery & humans (the biggest single fix)

The current site has **no product imagery and no people.** That alone screams "template." Fix both:

1. **The artifact is the hero.** The dated, hash-verifiable **evidence record** + the **WCAG→16-framework mapping table**, rendered like a printed legal document (masthead, margins, a real date, a real hash, the honest coverage %). White space used *as content*. This recurring artifact replaces every glow and ticker.
2. **Real product screenshots** as the dominant imagery class — faithful, slightly imperfect, real data and edge cases: the evidence record, the 16-framework verdict view, the regression diff. (Vanta/Resend discipline.)
3. **Put a face on it.** A real photo + name + credential of the expert behind the audits. For a relationship-led sale, "a real person made this" is the whole pitch (A11Y Project, Fable, Harvey all do this).
4. **One coherent custom line-illustration set** with a running metaphor — evidence / ledger / proof / frameworks — as quiet section anchors (Stark, A11Y Project). Even 3–4 hand-drawn sketches signal "a person made this." Not stock, not abstract glows.
5. **Trust-marker row** (once we have it): real client/award logos in **muted monochrome** so they read as proof, not billboard.
6. **Frameworks as a trust-center catalog** (Drata/SafeBase pattern): each framework is a card with status + a visible **DATE** + a **verify/hash** affordance — calm and browsable, never a glowing dashboard or a scrolling feed. Recency and dating *are* the credibility.

---

## 9. Component notes

- **Primary button:** flat, solid `--brand`, white text, `--r-md`, **one** honest shadow at most, crisp focus ring. **Kill the `ember-shift` animated-gradient button.** Label is plain ("Scan a page," "See a sample record") — no "→ Scan for legal risk" drama.
- **Cards:** hairline border, `--bg-raised`, generous padding, no glow. Hover = border to `--brand` + 1px lift (no scale bounce).
- **Scanner:** keep the 3-tab URL/paste/upload structure (it works) but strip the decoration — no glow ring, no animated meta dots. Calm, confident input.
- **Scanning state:** the 4 honest stages stay, driven by real lifecycle. **Remove** the blinking log cursor and any fake liveness; if it isn't live, don't animate it.
- **Section headers:** short confident headline (Fraunces) + one supporting sentence (Archivo) + one real visual. **No mono eyebrow kickers.**

---

## 10. Anti-patterns — never do these again

1. **Never** the serif-headline-with-one-recolored-italic-word (`.hero-title .ember`).
2. **Never** default to a near-black canvas. Light/warm is the default; dark is an explicit opt-in carried by real product UI.
3. **Never** let one hot accent be brand + link + focus + glow + selection. Brand hue ≠ semantic red; red is reserved for critical/error states.
4. **Never** motion-as-liveness: no blinking/pulsing dots, no infinite ticker, no animated counters, no blinking cursor.
5. **Never** a gradient-glow / infinitely-animated CTA, or radial glow washes behind heroes.
6. **Never** fear/indictment copy or threat tickers — it contradicts our positioning and flirts with FTC-overclaim energy.
7. **Never** mono micro-label kickers on every section. Mono = WCAG IDs, selectors, hashes, code. Period.
8. **Never** typed typographic ornaments (`───────`, `◆`, decorative `●`). Use real 1px borders, real spacing, one functional icon set.
9. **Never** a homepage with zero product imagery and zero humans.
10. **Never** treat the focus state as an afterthought. It's our signature (§6/§7).
11. **Never** uniform equal-height card grids with one global radius for every section. Let layout express hierarchy.
12. **Never** claim/imply "guaranteed compliance," a "compliance badge," or certification. Lead with the honest coverage limit as a feature.

### Alternate directions (if we override The Record)
- **② The Ledger:** bg `#FFFFFF`/`#FAFAF9`, ink `#1A2233` deep navy-charcoal, accent teal `#2F6F5E` *or* legal-ink blue `#234E94` (pick one). Display + body both **Inter/Geist** (no serif). Everything rides on real screenshots + named humans, or it slides into generic SaaS.
- **③ The Brief (dark):** bg `#14161A` (not near-black), ink `#ECEEF1`, muted sage `#7FB5A6`, **zero** glow/hot-accent. Every section must be carried by real product UI or it collapses back into the AI cliché.

---

## 11. Implementation map (to this codebase)

Next.js 16 · Tailwind v4 · framer-motion · lucide-react. In rough build order:

1. **Promote light to default.** In `src/app/globals.css`, move the `[data-theme="light"]` warm-paper values onto `:root`; make dark the opt-in. Update the token names per §3 (introduce `--brand`, separate it from `--critical`).
2. **Swap the display font.** In `src/app/layout.tsx`, replace Newsreader with **Fraunces** (`next/font/google`). Keep Archivo + IBM Plex Mono.
3. **Demolition pass (do this first, it's most of the win):** delete the `ember-shift` button, the lawsuit ticker, all blinking/pulsing dots, both radial glows, the background grid, the typed `───` rules, and every mono section kicker. Replace with flat buttons, hairline borders, and stillness.
4. **Rebuild the focus signature** (§7) as the global `:focus-visible`.
5. **Rewrite hero + sections** around the **evidence-record artifact** and real product screenshots; rewrite copy to the calm-expert voice (§2); add the expert photo + credential.
6. **Reframe the 16 frameworks** as a trust-center catalog (status + date + verify), not a glowing 4×4 grid.
7. **Commission/draft** the small custom line-illustration set (§8.4).
8. **Verify** with our own scanner: 0 axe violations, ≥4.5:1 everywhere, motion gone under reduced-motion — and publish the result on the site.

---

_References this is built on (all live, human-made): GOV.UK Design System, The A11Y Project, Fable, WebAIM, Stark (accessibility); Vanta, Secureframe, Drata, SafeBase (trust/compliance); Stripe Press, Basecamp, Val.town (editorial/craft); Harvey, Eve (legal authority). Full research artifact archived in the workflow output for this session._
