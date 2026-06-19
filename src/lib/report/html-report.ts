import type { ScanResult } from "@/lib/types/scan-result";
import type { ComplianceResult } from "@/lib/types/compliance";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function scoreColor(score: number): string {
  if (score >= 90) return "#22c55e";
  if (score >= 70) return "#eab308";
  if (score >= 50) return "#f97316";
  return "#ef4444";
}

const SEV_COLORS: Record<string, { bg: string; fg: string }> = {
  critical: { bg: "#fef2f2", fg: "#dc2626" },
  major: { bg: "#fffbeb", fg: "#d97706" },
  minor: { bg: "#f0fdf4", fg: "#16a34a" },
  "best-practice": { bg: "#eff6ff", fg: "#2563eb" },
};

export function generateHtmlReport(
  scan: ScanResult,
  compliance: ComplianceResult[],
  effortMap: Record<string, { label: string; estimate: string }>
): string {
  const color = scoreColor(scan.score.overall);
  const circ = 2 * Math.PI * 45;
  const offset = circ - (scan.score.overall / 100) * circ;
  const ts = new Date(scan.timestamp).toLocaleString();

  const issuesByGroup = {
    critical: scan.issues.filter((i) => i.severity === "critical"),
    major: scan.issues.filter((i) => i.severity === "major"),
    minor: scan.issues.filter((i) => i.severity === "minor"),
    "best-practice": scan.issues.filter((i) => i.severity === "best-practice"),
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>A11y Beast Report — ${escapeHtml(scan.url)}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#1a1a1a;background:#fff;line-height:1.6;max-width:900px;margin:0 auto;padding:2rem 1.5rem}
h1{font-size:1.5rem;font-weight:700;margin-bottom:.25rem}
h2{font-size:1.1rem;font-weight:600;margin:2.5rem 0 1rem;padding-bottom:.5rem;border-bottom:2px solid #f0f0f0}
h3{font-size:.95rem;font-weight:600;margin-bottom:.5rem}
.meta{color:#666;font-size:.85rem;margin-bottom:2rem}
.score-section{display:flex;align-items:center;gap:2rem;margin:1.5rem 0 2rem;padding:1.5rem;background:#fafafa;border-radius:12px;border:1px solid #eee}
.score-section svg{flex-shrink:0}
.score-num{font-size:2.5rem;font-weight:800;line-height:1}
.score-label{font-size:.85rem;color:#666;margin-top:.25rem}
.score-detail{flex:1}
.grade{font-size:1.2rem;font-weight:700;margin-bottom:.5rem}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:.75rem;margin:1rem 0}
.stat{text-align:center;padding:.75rem;background:#fafafa;border-radius:8px;border:1px solid #eee}
.stat-num{font-size:1.5rem;font-weight:700}
.stat-label{font-size:.75rem;color:#666;margin-top:.15rem}
.checks{display:grid;grid-template-columns:1fr 1fr;gap:.4rem .75rem;font-size:.85rem}
.check{display:flex;align-items:center;gap:.4rem}
.check-pass{color:#16a34a}
.check-fail{color:#dc2626}
.pour{display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;margin:1rem 0}
.pour-card{text-align:center;padding:.75rem;background:#fafafa;border-radius:8px;border:1px solid #eee}
.pour-pct{font-size:1.5rem;font-weight:700}
.pour-bar{height:4px;background:#eee;border-radius:2px;margin-top:.5rem;overflow:hidden}
.pour-fill{height:100%;border-radius:2px}
.compliance{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:.75rem;margin:1rem 0}
.fw-card{padding:.75rem;border:1px solid #eee;border-radius:8px}
.fw-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem}
.fw-name{font-weight:600;font-size:.85rem}
.fw-pct{font-weight:700;font-size:1.1rem}
.fw-bar{height:4px;background:#eee;border-radius:2px;overflow:hidden;margin-bottom:.4rem}
.fw-fill{height:100%;border-radius:2px}
.fw-meta{font-size:.75rem;color:#666;display:flex;justify-content:space-between}
.issue{padding:1rem;margin:.5rem 0;border:1px solid #eee;border-radius:8px;border-left:3px solid}
.issue-header{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;margin-bottom:.4rem}
.badge{font-size:.7rem;font-weight:600;padding:.15rem .5rem;border-radius:4px;text-transform:uppercase}
.issue-desc{font-size:.85rem;color:#444;margin-bottom:.4rem}
.issue-code{font-size:.8rem;font-family:monospace;color:#555;background:#f5f5f5;padding:.5rem;border-radius:4px;overflow-x:auto;white-space:pre-wrap;word-break:break-all;margin:.4rem 0}
.issue-meta{font-size:.75rem;color:#888;display:flex;gap:1rem;flex-wrap:wrap}
.disclaimer{margin-top:3rem;padding:1rem;background:#fafafa;border-radius:8px;font-size:.8rem;color:#666;border:1px solid #eee}
.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #eee;font-size:.75rem;color:#999;display:flex;justify-content:space-between}
@media print{body{max-width:100%}h2{page-break-after:avoid}.issue{page-break-inside:avoid}}
@media(prefers-color-scheme:dark){body{background:#111;color:#e5e5e5}.meta{color:#999}h2{border-color:#333}.score-section,.stat,.pour-card{background:#1a1a1a;border-color:#333}.pour-bar,.fw-bar{background:#333}.issue{border-color:#333}.issue-code{background:#1a1a1a}.disclaimer{background:#1a1a1a;border-color:#333;color:#888}.footer{border-color:#333;color:#666}.checks{color:#ccc}.fw-card{border-color:#333}}
</style>
</head>
<body>
<h1>A11y Beast Accessibility Report</h1>
<p class="meta">${escapeHtml(scan.url)} &middot; ${ts} &middot; ${scan.scanDurationMs}ms &middot; ${scan.totalRulesRun} rules</p>

<div class="score-section">
  <svg width="120" height="120" viewBox="0 0 100 100" style="transform:rotate(-90deg)">
    <circle cx="50" cy="50" r="45" stroke="#eee" stroke-width="6" fill="none"/>
    <circle cx="50" cy="50" r="45" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round"
      stroke-dasharray="${circ}" stroke-dashoffset="${offset}"/>
  </svg>
  <div class="score-detail">
    <div class="score-num" style="color:${color}">${scan.score.overall}</div>
    <div class="score-label">out of 100</div>
    <div class="grade" style="color:${color}">Grade ${scan.score.grade}</div>
    <p style="font-size:.85rem;color:#666">${scan.score.overall >= 90 ? "Excellent — few issues found." : scan.score.overall >= 70 ? "Good — needs attention." : scan.score.overall >= 50 ? "Multiple issues found." : "Significant issues. Action needed."}</p>
  </div>
</div>

<h2>Severity Breakdown</h2>
<div class="stats">
  <div class="stat"><div class="stat-num" style="color:#dc2626">${scan.score.bySeverity.critical}</div><div class="stat-label">Critical</div></div>
  <div class="stat"><div class="stat-num" style="color:#d97706">${scan.score.bySeverity.major}</div><div class="stat-label">Major</div></div>
  <div class="stat"><div class="stat-num" style="color:#16a34a">${scan.score.bySeverity.minor}</div><div class="stat-label">Minor</div></div>
  <div class="stat"><div class="stat-num" style="color:#2563eb">${scan.score.bySeverity["best-practice"]}</div><div class="stat-label">Info</div></div>
  <div class="stat"><div class="stat-num" style="color:#22c55e">${scan.passedRules}</div><div class="stat-label">Passed</div></div>
  <div class="stat"><div class="stat-num" style="color:#f97316">${scan.incompleteRules}</div><div class="stat-label">Review</div></div>
</div>

<h2>Page Checks</h2>
<div class="checks">
  ${[
    { l: "Title", ok: scan.pageMeta.title !== "(no title)" },
    { l: "Language attribute", ok: scan.pageMeta.lang !== "(not set)" },
    { l: "Has &lt;h1&gt;", ok: scan.pageMeta.hasH1 },
    { l: "Skip link", ok: scan.pageMeta.hasSkipLink },
    { l: "Accessibility statement", ok: scan.pageMeta.hasAccessibilityStatement },
  ].map((c) => `<div class="check"><span class="${c.ok ? "check-pass" : "check-fail"}">${c.ok ? "✓" : "✗"}</span> ${c.l}</div>`).join("")}
</div>
<p style="font-size:.85rem;color:#666;margin-top:.5rem">Images: ${scan.pageMeta.imageCount} (${scan.pageMeta.imagesWithoutAlt} missing alt) &middot; Links: ${scan.pageMeta.linkCount} &middot; Headings: ${scan.pageMeta.headingCount}</p>

<h2>POUR Principles</h2>
<div class="pour">
  ${(["perceivable", "operable", "understandable", "robust"] as const).map((p) => {
    const d = scan.score.byPrinciple[p];
    const total = d.passed + d.failed;
    const pct = total > 0 ? Math.round((d.passed / total) * 100) : 100;
    const c = scoreColor(pct);
    return `<div class="pour-card"><div class="pour-pct" style="color:${c}">${pct}%</div><div style="font-size:.8rem;text-transform:capitalize;color:#666">${p}</div><div style="font-size:.75rem;color:#999">${d.failed} issue${d.failed !== 1 ? "s" : ""}</div><div class="pour-bar"><div class="pour-fill" style="width:${pct}%;background:${c}"></div></div></div>`;
  }).join("")}
</div>

${compliance.length > 0 ? `
<h2>Framework Compliance</h2>
<div class="compliance">
  ${compliance.map((cr) => {
    const c = scoreColor(cr.percentage);
    return `<div class="fw-card"><div class="fw-header"><span class="fw-name">${escapeHtml(cr.framework.shortName)}</span><span class="fw-pct" style="color:${c}">${cr.percentage}%</span></div><div class="fw-bar"><div class="fw-fill" style="width:${cr.percentage}%;background:${c}"></div></div><div class="fw-meta"><span>${cr.failedCount} failing</span><span>${escapeHtml(cr.framework.region)}</span></div></div>`;
  }).join("")}
</div>` : ""}

<h2>Issues (${scan.issues.length})</h2>
${(["critical", "major", "minor", "best-practice"] as const).map((sev) => {
  const issues = issuesByGroup[sev];
  if (issues.length === 0) return "";
  const sc = SEV_COLORS[sev] ?? SEV_COLORS.minor;
  return issues.map((issue) => {
    const effort = effortMap[issue.ruleId];
    const wcag = issue.wcagCriterion ? `WCAG ${issue.wcagCriterion.number}` : "";
    return `<div class="issue" style="border-left-color:${sc.fg}">
  <div class="issue-header">
    <span class="badge" style="background:${sc.bg};color:${sc.fg}">${sev === "best-practice" ? "info" : sev}</span>
    <strong style="font-size:.9rem">${escapeHtml(issue.fixSuggestion || issue.description)}</strong>
  </div>
  <p class="issue-desc">${escapeHtml(issue.description)}</p>
  ${issue.element.html ? `<div class="issue-code">${escapeHtml(issue.element.html.slice(0, 300))}</div>` : ""}
  <div class="issue-meta">
    <span>${escapeHtml(issue.ruleId)}</span>
    ${wcag ? `<span>${wcag}</span>` : ""}
    ${effort ? `<span>~${effort.estimate}</span>` : ""}
    <span>${escapeHtml(issue.element.selector.slice(0, 60))}</span>
  </div>
</div>`;
  }).join("");
}).join("")}

${scan.issues.length === 0 ? '<p style="text-align:center;padding:2rem;color:#22c55e;font-weight:600">No issues found.</p>' : ""}

<div class="disclaimer">
  <strong>Disclaimer:</strong> Automated testing detects approximately 30-40% of accessibility issues.
  This report does not constitute a legal compliance assessment. Manual testing by qualified experts is recommended.
</div>

<div class="footer">
  <span>Generated by A11y Beast v0.1.0</span>
  <span>${ts}</span>
</div>
</body>
</html>`;
}
