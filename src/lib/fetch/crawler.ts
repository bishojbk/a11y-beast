import { puppeteerScanWithLinks } from "./puppeteer-scanner";
import { validateUrl } from "./ssrf-guard";
import { processServerResults } from "@/lib/analyzer/process-results";
import type { ScanResult } from "@/lib/types/scan-result";
import type { CrawlFailure } from "@/lib/types/site-scan";

export interface CrawlOptions {
  maxPages?: number;
  /** Wall-clock budget for the whole crawl, in ms. Keeps us inside serverless limits. */
  budgetMs?: number;
  /** How many pages to scan in parallel (shares one browser). */
  concurrency?: number;
}

export interface CrawlOutcome {
  pages: Array<{ url: string; scan: ScanResult }>;
  discovered: number;
  failed: CrawlFailure[];
  maxPages: number;
  cappedByPageLimit: boolean;
  cappedByTimeBudget: boolean;
  robotsSkipped: number;
}

const HARD_PAGE_CAP = 12;
const DEFAULT_MAX_PAGES = 5;
// Budget leaves headroom under the route's 60s maxDuration for aggregation +
// compliance after the crawl. We also never START a batch that couldn't finish
// within the budget (see NAV_TIMEOUT_MS look-ahead in the loop).
const DEFAULT_BUDGET_MS = 45_000;
const DEFAULT_CONCURRENCY = 3;
const NAV_TIMEOUT_MS = 15_000;

// Extensions that are never HTML pages — skip enqueuing them.
const NON_PAGE_EXT = /\.(pdf|zip|gz|rar|7z|docx?|xlsx?|pptx?|csv|png|jpe?g|gif|svg|webp|ico|mp4|webm|mp3|wav|woff2?|ttf|eot|css|js|json|xml|rss)$/i;

/** Strip the hash and normalise trailing slash so URLs dedupe cleanly. */
function normalizeUrl(raw: string): string | null {
  try {
    const u = new URL(raw);
    u.hash = "";
    // Treat "/path" and "/path/" as the same page.
    if (u.pathname.length > 1 && u.pathname.endsWith("/")) u.pathname = u.pathname.slice(0, -1);
    return u.toString();
  } catch {
    return null;
  }
}

function escapeRe(s: string): string {
  return s.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * robots.txt matcher for the `*` user-agent group. Supports multiple
 * user-agent lines per group, both Allow and Disallow, and the `*` wildcard /
 * trailing `$` anchor. Resolution follows the convention: the longest matching
 * rule wins, and Allow beats Disallow on an equal-length tie.
 */
class RobotsRules {
  private rules: Array<{ allow: boolean; pattern: string }> = [];

  static async fetch(origin: string): Promise<RobotsRules> {
    const rules = new RobotsRules();
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 4000);
      const res = await fetch(`${origin}/robots.txt`, { signal: ctrl.signal });
      clearTimeout(t);
      if (res.ok) rules.parse(await res.text());
    } catch {
      /* no robots.txt or unreachable — allow all */
    }
    return rules;
  }

  private parse(text: string): void {
    // A group = consecutive user-agent lines followed by rule lines. The group
    // applies to us if any of its user-agents is "*".
    let groupAgents: string[] = [];
    let collectingRules = false;
    const starGroup = () => groupAgents.includes("*");

    for (const lineRaw of text.split(/\r?\n/)) {
      const line = lineRaw.replace(/#.*$/, "").trim();
      if (!line) continue;
      const idx = line.indexOf(":");
      if (idx < 0) continue;
      const key = line.slice(0, idx).trim().toLowerCase();
      const value = line.slice(idx + 1).trim();

      if (key === "user-agent") {
        if (collectingRules) { groupAgents = []; collectingRules = false; } // new group
        groupAgents.push(value.toLowerCase());
      } else if (key === "allow" || key === "disallow") {
        collectingRules = true;
        if (starGroup() && value) this.rules.push({ allow: key === "allow", pattern: value });
      }
    }
  }

  private matches(pattern: string, path: string): boolean {
    const anchored = pattern.endsWith("$");
    const pat = anchored ? pattern.slice(0, -1) : pattern;
    const re = "^" + pat.split("*").map(escapeRe).join(".*") + (anchored ? "$" : "");
    try { return new RegExp(re).test(path); } catch { return path.startsWith(pat.replace(/\*/g, "")); }
  }

  allows(pathname: string): boolean {
    let best: { allow: boolean; len: number } | null = null;
    for (const r of this.rules) {
      if (!this.matches(r.pattern, pathname)) continue;
      const len = r.pattern.length;
      if (!best || len > best.len || (len === best.len && r.allow)) best = { allow: r.allow, len };
    }
    return best ? best.allow : true;
  }
}

/**
 * Crawl a site breadth-first from startUrl, scanning same-origin HTML pages up
 * to a page cap and time budget. Returns one processed ScanResult per page.
 */
export async function crawlSite(startUrl: string, opts: CrawlOptions = {}): Promise<CrawlOutcome> {
  const maxPages = Math.min(HARD_PAGE_CAP, Math.max(1, opts.maxPages ?? DEFAULT_MAX_PAGES));
  const budgetMs = opts.budgetMs ?? DEFAULT_BUDGET_MS;
  const concurrency = Math.max(1, opts.concurrency ?? DEFAULT_CONCURRENCY);
  const deadline = Date.now() + budgetMs;

  const start = normalizeUrl(startUrl);
  if (!start) {
    return {
      pages: [], discovered: 0, failed: [{ url: startUrl, error: "Invalid start URL" }],
      maxPages, cappedByPageLimit: false, cappedByTimeBudget: false, robotsSkipped: 0,
    };
  }

  const origin = new URL(start).origin;

  // SSRF guard BEFORE any network call (incl. the robots.txt prefetch below).
  // Without this, a seed pointing at a private/metadata host would be hit by
  // the robots fetch even though per-page navigation is validated later.
  const seedCheck = await validateUrl(start);
  if (!seedCheck.safe) {
    return {
      pages: [], discovered: 0, failed: [{ url: startUrl, error: seedCheck.reason ?? "Blocked URL" }],
      maxPages, cappedByPageLimit: false, cappedByTimeBudget: false, robotsSkipped: 0,
    };
  }

  const robots = await RobotsRules.fetch(origin);

  const queue: string[] = [start];
  const seen = new Set<string>([start]);
  const pages: Array<{ url: string; scan: ScanResult }> = [];
  const failed: CrawlFailure[] = [];
  let robotsSkipped = 0;
  let cappedByTimeBudget = false;

  const enqueue = (href: string) => {
    const n = normalizeUrl(href);
    if (!n || seen.has(n)) return;
    let u: URL;
    try { u = new URL(n); } catch { return; }
    if (u.origin !== origin) return;            // same-origin only
    if (NON_PAGE_EXT.test(u.pathname)) return;   // skip asset/file links
    seen.add(n);
    if (!robots.allows(u.pathname)) { robotsSkipped++; return; }
    queue.push(n);
  };

  while (queue.length > 0 && pages.length < maxPages) {
    // Don't start a batch that couldn't finish before the budget — a single
    // slow page (up to NAV_TIMEOUT_MS) must not push us past maxDuration.
    if (Date.now() + NAV_TIMEOUT_MS > deadline) { cappedByTimeBudget = true; break; }

    const remaining = maxPages - pages.length;
    const batch = queue.splice(0, Math.min(concurrency, remaining));

    const results = await Promise.all(
      batch.map(async (pageUrl) => {
        try {
          const raw = await puppeteerScanWithLinks(pageUrl, NAV_TIMEOUT_MS);
          return { pageUrl, raw };
        } catch (err) {
          return { pageUrl, raw: null, err: err instanceof Error ? err.message : "Scan failed" };
        }
      })
    );

    for (const r of results) {
      if (!r.raw || !r.raw.ok) {
        failed.push({ url: r.pageUrl, error: r.raw?.error ?? r.err ?? "Scan failed" });
        continue;
      }
      const scan = processServerResults(r.raw as Parameters<typeof processServerResults>[0], r.pageUrl);
      pages.push({ url: r.raw.finalUrl ?? r.pageUrl, scan });
      for (const link of r.raw.links) enqueue(link);
    }
  }

  // discovered = everything we found in-origin and would scan (visited + still queued),
  // excluding robots-skipped which never entered `seen` as scannable.
  const cappedByPageLimit = queue.length > 0 && !cappedByTimeBudget;

  return {
    pages,
    discovered: seen.size,
    failed,
    maxPages,
    cappedByPageLimit,
    cappedByTimeBudget,
    robotsSkipped,
  };
}
