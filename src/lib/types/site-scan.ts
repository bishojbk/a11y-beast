import type { ScanResult } from "./scan-result";

/** Lightweight per-page summary shown in the crawled-pages list. */
export interface PageScanSummary {
  /** Original crawl order index — aggregate issue ids are prefixed `p{index}-`. */
  pageIndex: number;
  url: string;
  score: number;
  grade: ScanResult["score"]["grade"];
  issueCount: number;
  criticalCount: number;
  majorCount: number;
}

export interface CrawlFailure {
  url: string;
  error: string;
}

export interface CrawlStats {
  /** Distinct same-origin URLs discovered during the crawl. */
  discovered: number;
  /** Pages successfully scanned. */
  scanned: number;
  /** Pages that failed to scan, with reasons. */
  failed: CrawlFailure[];
  /** The page cap that was applied. */
  maxPages: number;
  /** True if discovery hit the page cap (more pages exist than were scanned). */
  cappedByPageLimit: boolean;
  /** True if the wall-clock budget stopped the crawl before the cap. */
  cappedByTimeBudget: boolean;
  /** URLs skipped because robots.txt disallowed them. */
  robotsSkipped: number;
}

export interface SiteScanResult {
  startUrl: string;
  origin: string;
  timestamp: string;
  totalDurationMs: number;
  /** Per-page summaries, worst score first. */
  pages: PageScanSummary[];
  /**
   * Site-wide rollup shaped exactly like a single-page ScanResult so the
   * existing results UI (score, compliance, issue list) renders it unchanged.
   */
  aggregate: ScanResult;
  stats: CrawlStats;
}
