import type { ScanResult } from "@/lib/types/scan-result";
import type { ComplianceResult } from "@/lib/types/compliance";
import { c } from "../utils/logger.js";

const SEV_COLOR: Record<string, string> = {
  critical: c.RED,
  major: c.YELLOW,
  minor: c.CYAN,
  "best-practice": c.DIM,
};

const SEV_LABEL: Record<string, string> = {
  critical: "CRITICAL",
  major: "MAJOR",
  minor: "MINOR",
  "best-practice": "INFO",
};

function gradeColor(grade: string): string {
  if (grade === "A") return c.GREEN;
  if (grade === "B") return c.GREEN;
  if (grade === "C") return c.YELLOW;
  return c.RED;
}

function scoreColor(score: number): string {
  if (score >= 90) return c.GREEN;
  if (score >= 70) return c.YELLOW;
  return c.RED;
}

export function formatTable(
  scan: ScanResult,
  compliance: ComplianceResult[],
  effortMap: Record<string, { label: string; estimate: string }>,
  fixMap?: Record<string, { fixedHtml: string; explanation: string }>
): string {
  const lines: string[] = [];
  const W = 60;
  const rule = "─".repeat(W);

  // Header
  lines.push("");
  lines.push(`${c.BOLD}  AccessLens Scan Report${c.RESET}`);
  lines.push(`  ${c.DIM}${rule}${c.RESET}`);
  lines.push(`  URL:       ${c.BOLD}${scan.url}${c.RESET}`);
  lines.push(`  Score:     ${scoreColor(scan.score.overall)}${c.BOLD}${scan.score.overall}/100${c.RESET} ${gradeColor(scan.score.grade)}(Grade ${scan.score.grade})${c.RESET}`);
  lines.push(`  Duration:  ${scan.scanDurationMs.toLocaleString()}ms`);
  lines.push(`  Rules:     ${scan.totalRulesRun} run, ${scan.passedRules} passed, ${scan.incompleteRules} need review`);
  lines.push("");

  // Severity breakdown
  lines.push(`  ${c.BOLD}Severity${c.RESET}`);
  lines.push(`  ${c.DIM}${rule}${c.RESET}`);
  const sevs = [
    { key: "critical", count: scan.score.bySeverity.critical },
    { key: "major", count: scan.score.bySeverity.major },
    { key: "minor", count: scan.score.bySeverity.minor },
    { key: "best-practice", count: scan.score.bySeverity["best-practice"] },
  ];
  for (const s of sevs) {
    const color = SEV_COLOR[s.key] ?? "";
    const bar = s.count > 0 ? "█".repeat(Math.min(s.count, 30)) : "";
    lines.push(`  ${color}${SEV_LABEL[s.key]?.padEnd(10)}${c.RESET} ${String(s.count).padStart(3)}  ${color}${bar}${c.RESET}`);
  }
  lines.push("");

  // Page checks
  lines.push(`  ${c.BOLD}Page Checks${c.RESET}`);
  lines.push(`  ${c.DIM}${rule}${c.RESET}`);
  const checks = [
    { label: "Title", ok: scan.pageMeta.title !== "(no title)" },
    { label: "Lang attribute", ok: scan.pageMeta.lang !== "(not set)" },
    { label: "Has <h1>", ok: scan.pageMeta.hasH1 },
    { label: "Skip link", ok: scan.pageMeta.hasSkipLink },
    { label: "A11y statement", ok: scan.pageMeta.hasAccessibilityStatement },
  ];
  for (const ch of checks) {
    const icon = ch.ok ? `${c.GREEN}✓${c.RESET}` : `${c.RED}✗${c.RESET}`;
    lines.push(`  ${icon} ${ch.label}`);
  }
  lines.push(`  Images: ${scan.pageMeta.imageCount} (${scan.pageMeta.imagesWithoutAlt} missing alt)`);
  lines.push(`  Links: ${scan.pageMeta.linkCount}  Headings: ${scan.pageMeta.headingCount}`);
  lines.push("");

  // Top issues
  if (scan.issues.length > 0) {
    lines.push(`  ${c.BOLD}Top Issues${c.RESET}`);
    lines.push(`  ${c.DIM}${rule}${c.RESET}`);

    const shown = scan.issues.slice(0, 10);
    for (const issue of shown) {
      const sColor = SEV_COLOR[issue.severity] ?? "";
      const sLabel = SEV_LABEL[issue.severity] ?? "";
      const effort = effortMap[issue.ruleId];
      const wcag = issue.wcagCriterion ? `WCAG ${issue.wcagCriterion.number}` : "";
      const effortStr = effort ? `~${effort.estimate}` : "";
      const desc = issue.fixSuggestion || issue.description;

      lines.push(`  ${sColor}[${sLabel}]${c.RESET} ${desc}`);
      lines.push(`  ${c.DIM}         ${issue.ruleId}  ${wcag}  ${effortStr}${c.RESET}`);
      const fix = fixMap?.[issue.id];
      if (fix) {
        lines.push(`  ${c.GREEN}  FIX:${c.RESET} ${fix.explanation}`);
        const preview = fix.fixedHtml.split("\n")[0].slice(0, 70);
        lines.push(`  ${c.DIM}       ${preview}${fix.fixedHtml.length > 70 ? "..." : ""}${c.RESET}`);
      }
    }

    if (scan.issues.length > 10) {
      lines.push(`  ${c.DIM}... and ${scan.issues.length - 10} more issues${c.RESET}`);
    }
    lines.push("");
  }

  // Compliance
  if (compliance.length > 0) {
    lines.push(`  ${c.BOLD}Compliance${c.RESET}`);
    lines.push(`  ${c.DIM}${rule}${c.RESET}`);

    for (const cr of compliance) {
      const pct = cr.percentage;
      const color = pct >= 90 ? c.GREEN : pct >= 70 ? c.YELLOW : c.RED;
      lines.push(`  ${color}${String(pct).padStart(3)}%${c.RESET}  ${cr.framework.shortName.padEnd(18)} ${c.DIM}${cr.framework.region}${c.RESET}  ${cr.failedCount} failing`);
    }
    lines.push("");
  }

  // Footer
  lines.push(`  ${c.DIM}Automated testing detects ~30-40% of issues. Manual review recommended.${c.RESET}`);
  lines.push("");

  return lines.join("\n");
}
