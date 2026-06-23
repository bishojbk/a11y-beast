import type { ScanResult } from "@/lib/types/scan-result";
import type { Severity, WcagLevel } from "@/lib/types/issue";
import type { EvidenceDiff } from "./evidence-ledger";
import { assertHonest } from "./honest-language";

// The evidence file turns a scan into a dated, tamper-evident record of
// accessibility EFFORT against EN 301 549 (the EAA standard) — not a
// certification. See docs/evidence-ledger-spec.md. Every claim here is hedged
// to documented-effort language on purpose (FTC-safe, and honest about the
// ~30-40% automated ceiling).

const STANDARD = "EN 301 549 V3.2.1 (WCAG 2.1 level AA)";
const DEFAULT_TOOL = "A11y Beast (axe-core + custom checks)";

const SEV_RANK: Record<Severity, number> = { critical: 0, major: 1, minor: 2, "best-practice": 3 };

export interface EvidenceClause {
  /** WCAG SC number, e.g. "1.1.1" — the EN 301 549 web clause maps to this. */
  criterion: string;
  name: string;
  level: WcagLevel | "—";
  issueCount: number;
  /** Worst severity among the issues for this criterion. */
  severity: Severity;
}

export interface EvidenceRecord {
  siteUrl: string;
  pageTitle: string;
  /** When this record was generated (ISO). */
  generatedAt: string;
  /** When the underlying scan ran (ISO, from the scan). */
  scanDate: string;
  toolVersion: string;
  standard: string;
  /** Always conservative — an automated scan cannot assert full conformance. */
  status: string;
  summary: {
    totalIssues: number;
    affectedCriteria: number;
    bySeverity: Record<Severity, number>;
    coverageScore: number;
  };
  clauses: EvidenceClause[];
  /** SHA-256 of the canonical content above — recompute to verify integrity. */
  contentHash: string;
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function buildClauses(scan: ScanResult): EvidenceClause[] {
  const byCrit = new Map<string, EvidenceClause>();
  for (const issue of scan.issues) {
    const c = issue.wcagCriterion;
    const key = c ? c.number : "—";
    const existing = byCrit.get(key);
    if (existing) {
      existing.issueCount += 1;
      if (SEV_RANK[issue.severity] < SEV_RANK[existing.severity]) existing.severity = issue.severity;
    } else {
      byCrit.set(key, {
        criterion: key,
        name: c ? c.name : "Other / non-WCAG checks",
        level: c ? c.level : "—",
        issueCount: 1,
        severity: issue.severity,
      });
    }
  }
  return Array.from(byCrit.values()).sort(
    (a, b) => SEV_RANK[a.severity] - SEV_RANK[b.severity] || b.issueCount - a.issueCount
  );
}

/**
 * Build the evidence record from a scan. Async because the content hash uses
 * the Web Crypto API (available in browsers and Node 18+).
 */
export async function buildEvidenceRecord(
  scan: ScanResult,
  opts: { toolVersion?: string; generatedAt?: string } = {}
): Promise<EvidenceRecord> {
  const clauses = buildClauses(scan);
  const summary = {
    totalIssues: scan.issues.length,
    affectedCriteria: clauses.filter((c) => c.criterion !== "—").length,
    bySeverity: scan.score.bySeverity,
    coverageScore: scan.score.overall,
  };
  const core = {
    siteUrl: scan.url,
    pageTitle: scan.pageMeta.title,
    scanDate: scan.timestamp,
    generatedAt: opts.generatedAt ?? new Date().toISOString(),
    toolVersion: opts.toolVersion ?? DEFAULT_TOOL,
    standard: STANDARD,
    status: "Partially conformant",
    summary,
    clauses,
  };
  const contentHash = await sha256Hex(JSON.stringify(core));
  return { ...core, contentHash };
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const SEV_FG: Record<Severity, string> = {
  critical: "#dc2626",
  major: "#d97706",
  minor: "#16a34a",
  "best-practice": "#2563eb",
};

function renderProgress(diff: EvidenceDiff): string {
  const since = new Date(diff.sinceDate).toLocaleDateString();
  const delta = diff.netIssueDelta;
  const deltaLabel =
    delta < 0 ? `${-delta} fewer issues` : delta > 0 ? `${delta} more issues` : "no net change in issue count";
  const deltaColor = delta < 0 ? "#16a34a" : delta > 0 ? "#dc2626" : "#555";
  const list = (label: string, items: string[]) =>
    items.length ? `<p class="meta"><strong>${label}:</strong> ${items.map(esc).join(", ")}</p>` : "";
  return `<h2>Progress since ${esc(since)}</h2>
<div class="note" style="border-left-color:${deltaColor}">
This record is part of an ongoing trail. Compared with the assessment of ${esc(since)}:
<strong style="color:${deltaColor}">${deltaLabel}</strong> (${diff.prevTotalIssues} → ${diff.currTotalIssues}).
</div>
${list("Criteria resolved", diff.resolvedCriteria)}
${list("Newly affected criteria", diff.newCriteria)}`;
}

/** Render the evidence record as a self-contained, printable HTML document. */
export function renderEvidenceHtml(r: EvidenceRecord, diff?: EvidenceDiff): string {
  const gen = new Date(r.generatedAt).toLocaleString();
  const scanned = new Date(r.scanDate).toLocaleString();
  const rows = r.clauses
    .map(
      (c) => `<tr>
      <td class="crit">${c.criterion === "—" ? "—" : esc(c.criterion)}</td>
      <td>${esc(c.name)}</td>
      <td>${c.level}</td>
      <td><span class="sev" style="color:${SEV_FG[c.severity]}">${c.severity}</span></td>
      <td class="num">${c.issueCount}</td>
    </tr>`
    )
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Accessibility Evidence Record — ${esc(r.siteUrl)}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#1a1a1a;background:#fff;line-height:1.6;max-width:880px;margin:0 auto;padding:2.5rem 1.5rem}
h1{font-size:1.5rem;font-weight:700;margin-bottom:.25rem}
h2{font-size:1.05rem;font-weight:600;margin:2.25rem 0 .75rem;padding-bottom:.4rem;border-bottom:2px solid #f0f0f0}
.meta{color:#555;font-size:.85rem;margin-bottom:.35rem}
.badge{display:inline-block;font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#92400e;background:#fef3c7;border:1px solid #fde68a;border-radius:5px;padding:3px 9px;margin-bottom:1rem}
.note{font-size:.85rem;color:#444;background:#fafafa;border:1px solid #eee;border-left:3px solid #d97706;border-radius:6px;padding:.85rem 1rem;margin:1rem 0}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:.75rem;margin:1.25rem 0}
.stat{text-align:center;padding:.85rem;background:#fafafa;border-radius:8px;border:1px solid #eee}
.stat-num{font-size:1.5rem;font-weight:700}
.stat-label{font-size:.72rem;color:#666;text-transform:uppercase;letter-spacing:.05em;margin-top:.2rem}
table{width:100%;border-collapse:collapse;font-size:.85rem;margin-top:.5rem}
th{text-align:left;font-size:.7rem;text-transform:uppercase;letter-spacing:.05em;color:#666;border-bottom:2px solid #eee;padding:.5rem .6rem}
td{border-bottom:1px solid #f2f2f2;padding:.5rem .6rem;vertical-align:top}
.crit{font-variant-numeric:tabular-nums;font-weight:600;white-space:nowrap}
.num{text-align:right;font-variant-numeric:tabular-nums}
.sev{font-weight:600;text-transform:capitalize;font-size:.8rem}
.hash{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.72rem;color:#555;word-break:break-all;background:#fafafa;border:1px solid #eee;border-radius:6px;padding:.6rem .75rem;margin-top:.5rem}
footer{margin-top:2.5rem;padding-top:1rem;border-top:1px solid #eee;font-size:.78rem;color:#777}
@media print{body{padding:0}.badge{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style>
</head>
<body>
<div class="badge">Documented effort — not a certification</div>
<h1>Accessibility Evidence Record</h1>
<p class="meta"><strong>Site:</strong> ${esc(r.siteUrl)}</p>
<p class="meta"><strong>Standard:</strong> ${esc(r.standard)}</p>
<p class="meta"><strong>Status:</strong> ${esc(r.status)}</p>
<p class="meta"><strong>Scanned:</strong> ${esc(scanned)} &nbsp;·&nbsp; <strong>Record generated:</strong> ${esc(gen)}</p>
<p class="meta"><strong>Method:</strong> automated assessment with ${esc(r.toolVersion)}</p>

<div class="note">
This record documents the accessibility issues found by an <strong>automated</strong> assessment as of the date above.
Automated testing evaluates only part of the applicable success criteria (roughly 30–40%). EN 301 549 also includes
requirements beyond WCAG (real-time text, two-way voice, synchronised media) that require manual review. This is a
record of effort and progress — <strong>not a certification of conformance</strong>.
</div>

<div class="stats">
  <div class="stat"><div class="stat-num">${r.summary.totalIssues}</div><div class="stat-label">Issues found</div></div>
  <div class="stat"><div class="stat-num">${r.summary.affectedCriteria}</div><div class="stat-label">Criteria affected</div></div>
  <div class="stat"><div class="stat-num" style="color:${SEV_FG.critical}">${r.summary.bySeverity.critical ?? 0}</div><div class="stat-label">Critical</div></div>
  <div class="stat"><div class="stat-num">${r.summary.coverageScore}/100</div><div class="stat-label">Automated coverage</div></div>
</div>

${diff ? renderProgress(diff) : ""}

<h2>Findings by success criterion</h2>
<p class="meta">The EN 301 549 web clauses (9.x) map to these WCAG 2.1 success criteria. Worst severity first.</p>
<table>
<thead><tr><th>Criterion</th><th>Name</th><th>Level</th><th>Severity</th><th class="num">Issues</th></tr></thead>
<tbody>
${rows || `<tr><td colspan="5">No automated issues detected. Manual review is still required for full conformance.</td></tr>`}
</tbody>
</table>

<h2>Integrity</h2>
<p class="meta">SHA-256 of this record's content. Re-generate from the same scan to verify it has not been altered.</p>
<div class="hash">${esc(r.contentHash)}</div>

<footer>
Generated by A11y Beast. This document is a self-assessment aid, not legal advice or a certified audit.
</footer>
</body>
</html>`;
  assertHonest("evidence file", html);
  return html;
}
