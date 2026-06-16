import type { ScanResult, ScoreBreakdown, PageMeta } from "@/lib/types/scan-result";
import type { AccessibilityIssue, Severity, WcagLevel } from "@/lib/types/issue";
import type { CrawlOutcome } from "@/lib/fetch/crawler";
import type { SiteScanResult, PageScanSummary } from "@/lib/types/site-scan";
import { gradeForScore } from "./scoring";

/** Sum one page's by-level/by-principle/by-severity breakdown into the accumulator. */
function mergeScore(acc: ScoreBreakdown, s: ScoreBreakdown): void {
  for (const lvl of ["A", "AA", "AAA"] as WcagLevel[]) {
    acc.byLevel[lvl].passed += s.byLevel[lvl].passed;
    acc.byLevel[lvl].failed += s.byLevel[lvl].failed;
    acc.byLevel[lvl].total += s.byLevel[lvl].total;
  }
  for (const p of ["perceivable", "operable", "understandable", "robust"] as const) {
    acc.byPrinciple[p].passed += s.byPrinciple[p].passed;
    acc.byPrinciple[p].failed += s.byPrinciple[p].failed;
  }
  for (const sev of ["critical", "major", "minor", "best-practice"] as Severity[]) {
    acc.bySeverity[sev] += s.bySeverity[sev];
  }
}

/**
 * Roll a crawl's per-page ScanResults into a single site-wide ScanResult plus
 * per-page summaries. The aggregate is shaped like a normal ScanResult so the
 * results page renders it with no special-casing; the per-page list drives the
 * extra "pages crawled" section.
 *
 * The headline `overall` is the mean of per-page scores (so it agrees with the
 * worst-first page list shown right below it); the breakdown is the sum of
 * per-page breakdowns (for the POUR bars + severity totals). Grade comes from
 * the shared `gradeForScore` so the ladder isn't duplicated.
 */
export function aggregateSite(
  startUrl: string,
  outcome: CrawlOutcome,
  totalDurationMs: number
): SiteScanResult {
  const origin = (() => {
    try { return new URL(startUrl).origin; } catch { return startUrl; }
  })();

  const score: ScoreBreakdown = {
    overall: 100,
    grade: "A",
    byLevel: { A: { passed: 0, failed: 0, total: 0 }, AA: { passed: 0, failed: 0, total: 0 }, AAA: { passed: 0, failed: 0, total: 0 } },
    byPrinciple: { perceivable: { passed: 0, failed: 0 }, operable: { passed: 0, failed: 0 }, understandable: { passed: 0, failed: 0 }, robust: { passed: 0, failed: 0 } },
    bySeverity: { critical: 0, major: 0, minor: 0, "best-practice": 0 },
  };

  const issues: AccessibilityIssue[] = [];
  const passedRuleTags: string[][] = [];
  let passedRules = 0;
  let incompleteRules = 0;
  let inapplicableRules = 0;
  let totalRulesRun = 0;
  let scoreSum = 0;

  // pageMeta rollup: AND for skip link (one missing page is a gap),
  // OR for accessibility statement (usually one page linked sitewide).
  let allHaveSkipLink = outcome.pages.length > 0;
  let anyHasStatement = false;
  let anyHasH1 = false;
  let startLang = "(not set)";
  const meta = { imageCount: 0, imagesWithoutAlt: 0, linkCount: 0, headingCount: 0, formCount: 0 };

  const summaries: PageScanSummary[] = [];

  outcome.pages.forEach(({ url, scan }, i) => {
    // Re-prefix issue ids so the results page can filter issues by page.
    for (const issue of scan.issues) {
      issues.push({ ...issue, id: `p${i}-${issue.id}` });
    }
    passedRules += scan.passedRules;
    if (scan.passedRuleTags) passedRuleTags.push(...scan.passedRuleTags);
    incompleteRules += scan.incompleteRules;
    inapplicableRules += scan.inapplicableRules;
    totalRulesRun += scan.totalRulesRun;
    scoreSum += scan.score.overall;
    mergeScore(score, scan.score);

    allHaveSkipLink = allHaveSkipLink && scan.pageMeta.hasSkipLink;
    anyHasStatement = anyHasStatement || scan.pageMeta.hasAccessibilityStatement;
    anyHasH1 = anyHasH1 || scan.pageMeta.hasH1;
    if (i === 0) startLang = scan.pageMeta.lang;
    meta.imageCount += scan.pageMeta.imageCount;
    meta.imagesWithoutAlt += scan.pageMeta.imagesWithoutAlt;
    meta.linkCount += scan.pageMeta.linkCount;
    meta.headingCount += scan.pageMeta.headingCount;
    meta.formCount += scan.pageMeta.formCount;

    summaries.push({
      pageIndex: i,
      url,
      score: scan.score.overall,
      grade: scan.score.grade,
      issueCount: scan.issues.length,
      criticalCount: scan.score.bySeverity.critical,
      majorCount: scan.score.bySeverity.major,
    });
  });

  // Headline = mean of per-page scores, so it matches the per-page list.
  score.overall = outcome.pages.length > 0 ? Math.round(scoreSum / outcome.pages.length) : 100;
  score.grade = gradeForScore(score.overall);

  const pageMeta: PageMeta = {
    url: origin,
    title: `${outcome.pages.length} page${outcome.pages.length === 1 ? "" : "s"} · ${origin}`,
    lang: startLang,
    hasH1: anyHasH1,
    hasSkipLink: allHaveSkipLink,
    hasAccessibilityStatement: anyHasStatement,
    ...meta,
  };

  const aggregate: ScanResult = {
    id: `site-${Date.now()}`,
    url: origin,
    inputMethod: "url",
    timestamp: new Date().toISOString(),
    scanDurationMs: totalDurationMs,
    pageMeta,
    score,
    issues,
    passedRules,
    passedRuleTags,
    incompleteRules,
    inapplicableRules,
    totalRulesRun,
  };

  summaries.sort((a, b) => a.score - b.score); // worst first

  return {
    startUrl,
    origin,
    timestamp: aggregate.timestamp,
    totalDurationMs,
    pages: summaries,
    aggregate,
    stats: {
      discovered: outcome.discovered,
      scanned: outcome.pages.length,
      failed: outcome.failed,
      maxPages: outcome.maxPages,
      cappedByPageLimit: outcome.cappedByPageLimit,
      cappedByTimeBudget: outcome.cappedByTimeBudget,
      robotsSkipped: outcome.robotsSkipped,
    },
  };
}
