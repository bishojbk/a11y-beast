<p align="center">
  <img src="public/icon.svg" width="80" height="80" alt="A11y Beast logo" />
</p>

<h1 align="center">A11y Beast</h1>

<p align="center">
  <strong>The ultimate free web accessibility checker.</strong><br/>
  125+ rules. 20 custom checks. 16 global legal frameworks. Real browser rendering.
</p>

<p align="center">
  <a href="https://accesslens-green.vercel.app">Live Demo</a> &middot;
  <a href="#features">Features</a> &middot;
  <a href="#how-it-works">How It Works</a> &middot;
  <a href="#getting-started">Getting Started</a>
</p>

---

## What is A11y Beast?

A11y Beast scans any website for accessibility issues and maps every violation to real-world legal frameworks — not just WCAG pass/fail, but which **laws** your site is breaking and in which **countries**.

Most accessibility tools tell you "you fail WCAG 1.1.1." A11y Beast tells you "this failure puts you at risk under **ADA Title III** (5,114 lawsuits in 2025), **EAA** (enforceable across 27 EU states), and **13 more laws** — and here's the code to fix it."

## Features

### Scanning Engine
- **105+ axe-core rules** — industry standard, zero false positives
- **20 custom checks** axe-core doesn't cover:
  - Generic link text ("click here", "read more")
  - Missing skip navigation links
  - Heading hierarchy gaps (h1 → h3)
  - Multiple h1 elements
  - Text too small (< 12px)
  - Tight line height (< 1.5)
  - Viewport zoom disabled
  - Auto-playing media
  - Broken ARIA ID references
  - Positive tabindex values
  - Redundant title attributes
  - Suspicious alt text (filenames)
  - Long alt text (> 125 chars)
  - Missing landmarks (main, nav)
  - And more
- **Real browser rendering** via Puppeteer — JavaScript-rendered SPAs (React, Vue, Next.js) are fully supported
- **Three input methods**: URL scan, paste HTML, upload .html file

### Legal Compliance
- **16 global legal frameworks** with per-framework compliance scoring:

  | Framework | Region | WCAG Basis |
  |-----------|--------|------------|
  | ADA Title II & III | USA | WCAG 2.1 AA |
  | Section 508 | US Federal | WCAG 2.0 AA |
  | California Unruh Act | California | WCAG 2.1 AA |
  | European Accessibility Act | EU (27 states) | WCAG 2.1 AA |
  | EN 301 549 | EU | WCAG 2.1 AA |
  | EU Web Accessibility Directive | EU Public Sector | WCAG 2.1 AA |
  | Equality Act 2010 | UK | WCAG 2.1 AA |
  | AODA | Ontario, Canada | WCAG 2.0 AA |
  | Accessible Canada Act | Canada Federal | WCAG 2.1 AA |
  | DDA 1992 | Australia | WCAG 2.1 AA |
  | JIS X 8341-3 | Japan | WCAG 2.0 |
  | RPD Act 2016 | India | WCAG 2.0 AA |
  | KDDA | South Korea | WCAG 2.1 AA |
  | NZ WAS 1.1 | New Zealand | WCAG 2.1 AA |
  | Israel SI 5568 | Israel | WCAG 2.1 AA |
  | EU WAD | EU Public Sector | WCAG 2.1 AA |

- **Different scores per framework** based on: WCAG version scope, severity multipliers, missing accessibility statement penalties, missing skip link penalties, per-violation element count (Unruh Act)
- **Deadline alerts** for upcoming enforcement dates

### Results Dashboard
- **0-100 score** with A-F letter grade
- **POUR breakdown** (Perceivable, Operable, Understandable, Robust)
- **Effort estimation** per issue: Quick Fix (< 5 min), Medium (15-60 min), Requires Refactor (1-4 hrs)
- **Severity icons**: Critical, Major, Minor, Best Practice
- **Code snippets** with CSS selectors for each issue
- **Impact analysis**: which disability groups are affected (visual, motor, cognitive, auditory)
- **Page analysis**: images, alt text, links, headings, skip links, accessibility statement detection

### Design
- Dark mode (default) + light mode toggle
- Animated score gauge with Framer Motion
- Smooth scroll-reveal animations
- Accessible: skip links, ARIA tabs, live regions, landmarks, keyboard navigation
- Custom SVG logo
- Responsive design

## How It Works

### URL Scan (Server-side)
```
User enters URL → Server fetches page with Puppeteer (real browser)
→ axe-core runs against live DOM → 20 custom checks run
→ Results scored + mapped to legal frameworks → Displayed on /results
```

### Paste / Upload (Client-side)
```
User pastes HTML or uploads file → Rendered in hidden iframe
→ axe-core injected into iframe → Analysis runs in browser
→ Results scored + mapped → Displayed on /results
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Scanning | axe-core + Puppeteer + 20 custom checks |
| Hosting | Vercel |
| Serverless Chrome | @sparticuz/chromium |

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install & Run

```bash
git clone https://github.com/bishojbk/a11y-beast.git
cd a11y-beast
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage (scanner + landing)
│   ├── results/page.tsx      # Results dashboard
│   ├── not-found.tsx         # Custom 404
│   ├── api/
│   │   ├── scan/route.ts     # Puppeteer scan endpoint
│   │   └── fetch-html/route.ts # HTML fetch (for client-side analysis)
│   ├── layout.tsx
│   └── globals.css           # Design tokens (dark/light themes)
├── components/ui/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Logo.tsx              # Custom SVG logo
├── hooks/
│   └── useAxeAnalysis.ts     # Scan lifecycle hook
└── lib/
    ├── analyzer/
    │   ├── axe-runner.ts     # axe-core integration
    │   ├── custom-checks.ts  # 20 checks beyond axe-core
    │   ├── scoring.ts        # Score calculation algorithm
    │   ├── effort.ts         # Fix effort estimation
    │   ├── process-results.ts
    │   └── index.ts
    ├── compliance/
    │   ├── frameworks.ts     # 16 legal frameworks with metadata
    │   └── mapper.ts         # Issue → framework mapping + scoring
    ├── fetch/
    │   ├── puppeteer-scanner.ts  # Server-side scanning
    │   ├── html-fetcher.ts       # HTML fetch for client-side
    │   └── ssrf-guard.ts         # SSRF protection
    └── types/
        ├── issue.ts
        ├── scan-result.ts
        └── compliance.ts
```

## Security

- **SSRF protection**: All URLs validated before fetch — blocks private IPs, cloud metadata endpoints (169.254.169.254), localhost, non-http protocols, non-standard ports
- **No data stored**: Scan results live in `sessionStorage` only — cleared when browser tab closes
- **Content Security Policy**: Strict CSP headers
- **SSRF re-validation**: Every redirect hop re-checked

## Scoring Methodology

The overall score (0-100) is based on:

1. **Pass rate**: What percentage of applicable rules pass
2. **Severity deduction**: Critical/major failures cost more (configurable multiplier per framework)
3. **Element count**: More affected elements = larger deduction
4. **Grade**: A (90+), B (75+), C (60+), D (40+), F (below 40)

Per-framework compliance scores differ based on:
- WCAG version scope (2.0 vs 2.1 vs 2.2 — determines which rules apply)
- Severity multiplier (ADA Title III = 1.5x due to lawsuit frequency)
- Missing accessibility statement penalty (EAA: -8%, UK: -6%)
- Missing skip link penalty (Section 508: -5%)
- Per-violation element weight (California Unruh: -15% based on element count)

## License

AGPL-3.0 — see [LICENSE](LICENSE) for details.

axe-core is licensed under MPL-2.0 by Deque Systems.

## Acknowledgments

- [axe-core](https://github.com/dequelabs/axe-core) by Deque Systems — the accessibility engine
- [Puppeteer](https://pptr.dev/) — headless Chrome automation
- [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) by W3C — the accessibility standard
- Accessibility lawsuit data from Seyfarth Shaw and UsableNet annual reports

---

<p align="center">
  <sub>Built by <a href="https://github.com/bishojbk">bishojbk</a> &middot; Not legal advice &middot; Automated tools detect ~30-40% of issues</sub>
</p>
