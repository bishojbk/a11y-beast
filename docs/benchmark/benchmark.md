# Accessibility scanner benchmark

- **Generated:** 2026-06-22T02:18:46.823Z
- **URLs scanned:** 7
- **Tools compared:** A11y Beast, axe-core raw, Pa11y, Lighthouse

> Each tool runs in its own Chromium instance. Issues are collapsed by rule id — one row per rule, occurrences summed in the rightmost column of each per-URL section.

## Aggregate

| Tool | URLs OK | Unique rules (total) | Issues (total) | Avg duration | Legal mapping |
| --- | ---: | ---: | ---: | ---: | :---: |
| A11y Beast | 6/7 | 48 | 503 | 5.2s | ✓ |
| axe-core raw | 6/7 | 17 | 264 | 5.1s | — |
| Pa11y | 6/7 | 20 | 372 | 3.6s | — |
| Lighthouse | 7/7 | 6 | 26 | 27.1s | — |

## https://shopify.com

| Tool | Status | Unique rules | Issues | Duration |
| --- | :---: | ---: | ---: | ---: |
| A11y Beast | ❌ Navigation timeout of 25000 ms exceeded | — | — | 26.4s |
| axe-core raw | ❌ Navigation timeout of 45000 ms exceeded | — | — | 46.5s |
| Pa11y | ❌ Navigation timeout of 45000 ms exceeded | — | — | 45.5s |
| Lighthouse | ✓ | 3 | 7 | 10.9s |

## https://stripe.com

| Tool | Status | Unique rules | Issues | Duration |
| --- | :---: | ---: | ---: | ---: |
| A11y Beast | ✓ | 9 | 134 | 8.3s |
| axe-core raw | ✓ | 1 | 1 | 8.0s |
| Pa11y | ✓ | 4 | 46 | 4.9s |
| Lighthouse | ✓ | 1 | 6 | 12.1s |

- Rules surfaced by ≥2 tools: **1**
- Rules surfaced only by A11y Beast: **8** (`color-contrast`, `link-in-text-block`, `alt-too-long`, `link-text-generic`, `skip-link-missing`, …)

## https://hermes.com

| Tool | Status | Unique rules | Issues | Duration |
| --- | :---: | ---: | ---: | ---: |
| A11y Beast | ✓ | 4 | 4 | 5.1s |
| axe-core raw | ✓ | 2 | 2 | 5.1s |
| Pa11y | ✓ | 0 | 0 | 2.4s |
| Lighthouse | ✓ | 2 | 13 | 40.9s |

- Rules surfaced by ≥2 tools: **2**
- Rules surfaced only by A11y Beast: **2** (`frame-tested`, `skip-link-missing`)

## https://ticketmaster.com

| Tool | Status | Unique rules | Issues | Duration |
| --- | :---: | ---: | ---: | ---: |
| A11y Beast | ✓ | 9 | 49 | 8.9s |
| axe-core raw | ✓ | 3 | 11 | 6.8s |
| Pa11y | ✓ | 5 | 13 | 5.9s |
| Lighthouse | ✓ | 0 | 0 | 31.5s |

- Rules surfaced by ≥2 tools: **3**
- Rules surfaced only by A11y Beast: **6** (`color-contrast`, `link-text-generic`, `text-too-small`, `line-height-too-tight`, `aria-reference-broken`, …)

## https://github.com

| Tool | Status | Unique rules | Issues | Duration |
| --- | :---: | ---: | ---: | ---: |
| A11y Beast | ✓ | 7 | 45 | 2.6s |
| axe-core raw | ✓ | 1 | 1 | 3.2s |
| Pa11y | ✓ | 5 | 9 | 2.8s |
| Lighthouse | ✓ | 0 | 0 | 31.5s |

- Rules surfaced by ≥2 tools: **1**
- Rules surfaced only by A11y Beast: **6** (`color-contrast`, `video-caption`, `alt-too-long`, `multiple-h1`, `line-height-too-tight`, …)

## https://www.usa.gov

| Tool | Status | Unique rules | Issues | Duration |
| --- | :---: | ---: | ---: | ---: |
| A11y Beast | ✓ | 5 | 9 | 3.4s |
| axe-core raw | ✓ | 3 | 3 | 3.9s |
| Pa11y | ✓ | 0 | 0 | 3.1s |
| Lighthouse | ✓ | 0 | 0 | 31.5s |

- Rules surfaced by ≥2 tools: **3**
- Rules surfaced only by A11y Beast: **2** (`color-contrast`, `line-height-too-tight`)

## https://news.ycombinator.com

| Tool | Status | Unique rules | Issues | Duration |
| --- | :---: | ---: | ---: | ---: |
| A11y Beast | ✓ | 14 | 262 | 2.8s |
| axe-core raw | ✓ | 7 | 246 | 3.5s |
| Pa11y | ✓ | 6 | 304 | 2.4s |
| Lighthouse | ✓ | 0 | 0 | 31.5s |

- Rules surfaced by ≥2 tools: **7**
- Rules surfaced only by A11y Beast: **7** (`bypass`, `link-text-generic`, `skip-link-missing`, `text-too-small`, `line-height-too-tight`, …)
