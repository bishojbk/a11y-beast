"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileText,
  RefreshCw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import Gauge from "@/components/results/Gauge";
import Flag, { flagForRegion } from "@/components/results/Flag";
import { GithubActionDialog, DownloadReportDialog, LegalReportDialog } from "@/components/results/ExportDialogs";
import MonitorCta from "@/components/MonitorCta";
import { EAA_STANDARD, PREFILL_KEY, type StatementPrefill } from "@/components/StatementGenerator";
import { FRAMEWORKS, type FrameworkWithTags } from "@/lib/compliance/frameworks";
import { computeConformance, type CriterionStatus } from "@/lib/compliance/wcag-criteria";
import type { ScanResult } from "@/lib/types/scan-result";
import type { AccessibilityIssue, ImpactGroup, Severity } from "@/lib/types/issue";
import type { ComplianceResult } from "@/lib/types/compliance";
import type { SiteScanResult } from "@/lib/types/site-scan";
import { SAMPLE_RESULT } from "@/lib/sample-result";

// Build a statement pre-fill from a scan so the EN 301 549 / EAA statement is
// backed by real findings. Worst-severity issues become the "known limitations"
// lines; the generator stays honest (defaults to "Partially conformant").
const STMT_SEV_RANK: Record<Severity, number> = { critical: 0, major: 1, minor: 2, "best-practice": 3 };

function buildStatementPrefill(result: ScanResult): StatementPrefill {
  let host = result.url;
  try { host = new URL(result.url).host; } catch { /* keep raw url */ }
  const byRule = new Map<string, { desc: string; sev: Severity; count: number }>();
  for (const i of result.issues) {
    const e = byRule.get(i.ruleId);
    if (e) e.count++;
    else byRule.set(i.ruleId, { desc: i.description, sev: i.severity, count: 1 });
  }
  const limitations = [...byRule.values()]
    .sort((a, b) => STMT_SEV_RANK[a.sev] - STMT_SEV_RANK[b.sev] || b.count - a.count)
    .slice(0, 6)
    .map((r) => (r.count > 1 ? `${r.desc} (${r.count} instances)` : r.desc));
  return {
    siteName: host,
    siteUrl: result.url,
    standard: EAA_STANDARD,
    status: "Partially conformant",
    limitations,
    scanDate: result.timestamp ? result.timestamp.slice(0, 10) : undefined,
    toolVersion: "A11y Beast (axe-core + custom checks)",
  };
}

type FilterKey = Severity | "all" | "needs-review";

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

/* Severity → design token */
const SEV_TOKEN: Record<Severity, { dotClass: string; label: string }> = {
  critical: { dotClass: "critical", label: "Critical" },
  major: { dotClass: "major", label: "Major" },
  minor: { dotClass: "minor", label: "Minor" },
  "best-practice": { dotClass: "info", label: "Best practice" },
};

/* ──────────────────────────────────────────────────────────────
   Filter chip — severity with count
   ────────────────────────────────────────────────────────────── */
function FilterChip({
  active,
  label,
  count,
  onClick,
  sev,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
  sev?: Severity;
}) {
  return (
    <button
      type="button"
      className={`filter-chip ${active ? "on" : ""}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {sev && (
        <span
          className={`sev-dot ${SEV_TOKEN[sev].dotClass}`}
          style={{ margin: 0, width: 6, height: 6 }}
          aria-hidden="true"
        />
      )}
      {label} <span className="count">{count}</span>
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────
   Effort
   ────────────────────────────────────────────────────────────── */
type EffortChip = { chipClass: "quick" | "medium" | "refactor"; label: string; estimate: string };

/* ──────────────────────────────────────────────────────────────
   Issue code diff block
   Very light syntax tinting — just tag/attr highlights
   ────────────────────────────────────────────────────────────── */
function tokenizeHtml(line: string): ReactElement[] {
  // Split while keeping delimiters: tag, attr="val", plain
  const parts: ReactElement[] = [];
  const regex = /(<\/?[\w-]+)|([\w-]+="[^"]*")|(<!--[^]*?-->)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(line)) !== null) {
    if (match.index > last) {
      parts.push(<span key={key++}>{line.slice(last, match.index)}</span>);
    }
    if (match[1]) {
      parts.push(<span key={key++} className="tag">{match[1]}</span>);
    } else if (match[2]) {
      parts.push(<span key={key++} className="attr">{match[2]}</span>);
    } else if (match[3]) {
      parts.push(<span key={key++} className="cmt">{match[3]}</span>);
    }
    last = regex.lastIndex;
  }
  if (last < line.length) parts.push(<span key={key++}>{line.slice(last)}</span>);
  return parts;
}

function IssueCode({
  issue,
  fixHtml,
}: {
  issue: AccessibilityIssue;
  fixHtml: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const copyTarget = fixHtml ?? issue.element.html;

  const copy = useCallback(() => {
    navigator.clipboard.writeText(copyTarget);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }, [copyTarget]);

  const failLines = issue.element.html.split("\n").filter(Boolean);
  const fixLines = fixHtml ? fixHtml.split("\n").filter(Boolean) : [];

  return (
    <div className="issue-code">
      <div className="code-head">
        <span className="sel mono">{issue.element.selector || "—"}</span>
        <button type="button" className="code-copy" onClick={copy}>
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "copied" : fixHtml ? "copy fix" : "copy snippet"}
        </button>
      </div>
      <div className="code-body mono">
        {failLines.map((ln, i) => (
          <span key={`f${i}`} className="fail">{tokenizeHtml(ln)}</span>
        ))}
        {fixLines.length > 0 && <div style={{ height: 6 }} />}
        {fixLines.map((ln, i) => (
          <span key={`x${i}`} className="fix">{tokenizeHtml(ln)}</span>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   IssueRow
   ────────────────────────────────────────────────────────────── */
function IssueRow({
  issue,
  effort,
  count,
  fixHtml,
  showCode,
  expanded,
  onToggle,
  loadingFix,
}: {
  issue: AccessibilityIssue;
  effort: EffortChip;
  count: number;
  fixHtml: string | null;
  showCode: boolean;
  expanded: boolean;
  onToggle: () => void;
  loadingFix: boolean;
}) {
  const allGroups: ImpactGroup[] = ["visual", "motor", "cognitive", "auditory"];
  const groupLabels: Record<ImpactGroup, string> = {
    visual: "Visual",
    motor: "Motor",
    cognitive: "Cognitive",
    auditory: "Auditory",
  };
  const sev = SEV_TOKEN[issue.severity];

  return (
    <motion.div className="issue" variants={fadeUp}>
      <span className={`sev-dot ${sev.dotClass}`} role="img" aria-label={`${sev.label} severity`} />
      <div>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          style={{
            display: "flex", alignItems: "center", gap: 8, background: "none", border: "none",
            padding: 0, margin: 0, cursor: "pointer", textAlign: "left", color: "inherit", width: "100%",
          }}
        >
          <ChevronRight
            size={14}
            aria-hidden="true"
            style={{ flexShrink: 0, color: "var(--text-tertiary)", transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.18s ease" }}
          />
          <span className="issue-title">{issue.fixSuggestion || issue.description}</span>
        </button>
        <div className="issue-desc" style={{ marginLeft: 22 }}>{issue.description}</div>
        <div className="issue-meta" style={{ marginLeft: 22 }}>
          {issue.wcagCriterion && (
            <>
              <span>
                WCAG {issue.wcagCriterion.number} {issue.wcagCriterion.level}
              </span>
              <span className="issue-sep" aria-hidden="true" />
            </>
          )}
          <span>
            rule: <span style={{ color: "var(--accent-text)" }}>{issue.ruleId}</span>
          </span>
          <span className="issue-sep" aria-hidden="true" />
          <span>
            {count} {count === 1 ? "occurrence" : "occurrences"}
          </span>
          {issue.needsManualReview && (
            <>
              <span className="issue-sep" aria-hidden="true" />
              <span style={{ color: "var(--sev-review)" }}>needs manual review</span>
            </>
          )}
          {loadingFix && (
            <>
              <span className="issue-sep" aria-hidden="true" />
              <span style={{ color: "var(--accent-text)" }}>generating fix…</span>
            </>
          )}
        </div>
        {showCode && expanded && (
          <div style={{ marginLeft: 22 }}>
            <IssueCode issue={issue} fixHtml={fixHtml} />
          </div>
        )}
      </div>
      <div className="issue-groups">
        <div className="groups-label">Affects</div>
        <div className="groups-pills">
          {allGroups.map((g) => (
            <span
              key={g}
              className={`group-pill ${issue.impact.includes(g) ? "" : "dim"}`}
            >
              {groupLabels[g]}
            </span>
          ))}
        </div>
      </div>
      <span className={`effort-chip ${effort.chipClass}`}>
        {effort.label}
        <span className="effort-time">· {effort.estimate}</span>
      </span>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Compliance card
   ────────────────────────────────────────────────────────────── */
function ComplianceCard({
  fw,
  cr,
  idx,
  onOpen,
}: {
  fw: FrameworkWithTags;
  cr: ComplianceResult;
  idx: number;
  onOpen: () => void;
}) {
  const [barW, setBarW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setBarW(cr.percentage), 180 + idx * 25);
    return () => clearTimeout(t);
  }, [cr.percentage, idx]);

  const pct = cr.percentage;
  const fillColor =
    pct < 60 ? "var(--severity-critical)" :
    pct < 75 ? "var(--severity-major)" :
    pct < 90 ? "var(--severity-minor)" : "var(--pass)";

  const riskLevel: "high" | "med" | "low" | "pass" =
    pct < 60 ? "high" :
    pct < 75 ? "med" :
    pct < 90 ? "low" : "pass";
  const riskLabel = riskLevel === "pass" ? "Pass" : riskLevel === "low" ? "Low" : riskLevel === "med" ? "Med" : "High";

  const scoreColor =
    pct < 60 ? "var(--severity-critical)" :
    pct < 75 ? "var(--severity-major)" :
    pct < 90 ? "var(--severity-minor)" :
    "var(--pass)";

  return (
    <motion.div
      className="compl-card"
      role="button"
      tabIndex={0}
      aria-label={`${fw.name}, ${pct} percent compliance, ${riskLabel} risk. Open details.`}
      variants={fadeUp}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      style={{ cursor: "pointer" }}
    >
      <div className="compl-top">
        <div>
          <div className="compl-id mono">{String(idx + 1).padStart(2, "0")}/16</div>
          <div className="compl-name">{fw.shortName}</div>
        </div>
        <Flag code={flagForRegion(fw.region)} />
      </div>
      <div className="compl-wcag">{fw.wcagBasis}</div>
      <div className="compl-score-row">
        <span className="compl-score" style={{ color: scoreColor }}>{pct}</span>
        <div className="compl-bar">
          <div className="f" style={{ width: `${barW}%`, background: fillColor }} />
        </div>
      </div>
      <div className="compl-region">{fw.region}</div>
      <span className={`compl-risk ${riskLevel}`}>{riskLabel}</span>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────────── */
function splitUrl(raw: string): { host: string; ext: string } {
  try {
    const u = new URL(raw);
    const path = u.pathname === "/" ? "" : u.pathname;
    return { host: `${u.protocol}//${u.host}`, ext: path + (u.search || "") };
  } catch {
    return { host: raw, ext: "" };
  }
}

function formatScanTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mi = String(d.getUTCMinutes()).padStart(2, "0");
  return `SCAN · ${yyyy}.${mm}.${dd} · ${hh}:${mi} UTC`;
}

function daysBetween(fromISO: string, toISO?: string): number {
  if (!toISO) return NaN;
  const a = Date.now();
  const b = new Date(toISO).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

/* ──────────────────────────────────────────────────────────────
   Results page
   ────────────────────────────────────────────────────────────── */
export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [site, setSite] = useState<SiteScanResult | null>(null);
  const [compliance, setCompliance] = useState<ComplianceResult[]>([]);
  const [effortMap, setEffortMap] = useState<Record<string, EffortChip>>({});
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [frameworkFilter, setFrameworkFilter] = useState<string>("all");
  const [pageFilter, setPageFilter] = useState<number | null>(null);
  const [openRules, setOpenRules] = useState<Set<string>>(new Set());
  const [bulkFixing, setBulkFixing] = useState(false);
  const [detailFw, setDetailFw] = useState<FrameworkWithTags | null>(null);
  const [showAllFw, setShowAllFw] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(false);
  const [fixCache, setFixCache] = useState<Record<string, string>>({});
  const [fixLoading, setFixLoading] = useState<Record<string, boolean>>({});
  const [modal, setModal] = useState<"action" | "report" | "legal" | null>(null);
  const [evidenceCount, setEvidenceCount] = useState(0);
  // True when this report is the baked sample (arrived via ?sample), not a real
  // scan. Drives the sample banner and gates real-ledger / counter side effects.
  const [isSample, setIsSample] = useState(false);
  const h1Ref = useRef<HTMLHeadingElement>(null);

  // How many evidence records this browser already holds for this site (the ledger).
  // Skip on the sample — its W3C demo URL must not read the visitor's real ledger.
  useEffect(() => {
    if (!result?.url || isSample) return;
    let cancelled = false;
    import("@/lib/report/evidence-ledger").then(({ getSiteEntries }) => {
      if (!cancelled) setEvidenceCount(getSiteEntries(result.url).length);
    });
    return () => { cancelled = true; };
  }, [result?.url, isSample]);

  // Hand the scan to the statement generator (EN 301 549 / EAA mode), pre-filled
  // from these findings. See docs/evidence-ledger-spec.md.
  const generateStatement = useCallback(() => {
    if (!result) return;
    try {
      sessionStorage.setItem(PREFILL_KEY, JSON.stringify(buildStatementPrefill(result)));
    } catch { /* sessionStorage unavailable — generator still opens blank */ }
    router.push("/accessibility-statement-generator");
  }, [result, router]);

  // Build the dated, hashed evidence record, diff it against this site's prior
  // ledger entry (regression proof), append it, and open the printable doc.
  const openEvidenceFile = useCallback(async () => {
    if (!result) return;
    const { buildEvidenceRecord, renderEvidenceHtml } = await import("@/lib/report/evidence-file");
    const { getSiteEntries, appendEntry, diffEntries } = await import("@/lib/report/evidence-ledger");
    const record = await buildEvidenceRecord(result);
    // On the sample, still build and open the printable doc — but never mutate
    // the visitor's real localStorage ledger (or the on-screen counter) with the
    // W3C demo's record.
    const prior = isSample ? undefined : getSiteEntries(result.url)[0];
    const diff = prior && prior.contentHash !== record.contentHash ? diffEntries(prior, record) : undefined;
    if (!isSample) {
      appendEntry(record);
      setEvidenceCount(getSiteEntries(result.url).length);
    }
    const blob = new Blob([renderEvidenceHtml(record, diff)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener");
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
  }, [result, isSample]);
  const rowsInited = useRef(false);

  useEffect(() => {
    // An explicit ?sample (the "See a sample" CTA) always wins — check it FIRST
    // so the baked sample never silently shows a prior real scan from session
    // storage. Otherwise use the real scan stored from the homepage scanner.
    let parsed: ScanResult | null = null;
    let sample = false;
    if (new URLSearchParams(window.location.search).has("sample")) {
      parsed = SAMPLE_RESULT;
      sample = true;
    } else {
      const stored = sessionStorage.getItem("a11y-beast-result");
      if (stored) {
        try { parsed = JSON.parse(stored) as ScanResult; } catch { /* invalid cache */ }
      }
    }
    if (!parsed) return;
    {
      setIsSample(sample);
      setResult(parsed);
      const storedSite = sessionStorage.getItem("a11y-beast-site");
      if (storedSite) {
        try { setSite(JSON.parse(storedSite) as SiteScanResult); } catch { /* ignore */ }
      }
      import("@/lib/compliance/mapper").then(({ generateComplianceResults }) => {
        setCompliance(
          generateComplianceResults(parsed.issues, parsed.passedRules, {
            hasAccessibilityStatement: parsed.pageMeta.hasAccessibilityStatement,
            hasSkipLink: parsed.pageMeta.hasSkipLink,
            lang: parsed.pageMeta.lang,
          }, parsed.passedRuleTags)
        );
      });
      import("@/lib/analyzer/effort").then(({ getEffort }) => {
        const map: Record<string, EffortChip> = {};
        for (const issue of parsed.issues) {
          if (!map[issue.ruleId]) {
            const raw = getEffort(issue.ruleId);
            const chipClass: EffortChip["chipClass"] =
              raw.level === "quick-fix" ? "quick" : raw.level === "refactor" ? "refactor" : "medium";
            const label =
              raw.level === "quick-fix" ? "Quick fix" : raw.level === "refactor" ? "Refactor" : "Medium";
            map[issue.ruleId] = { chipClass, label, estimate: raw.estimate };
          }
        }
        setEffortMap(map);
      });
    }
  }, []);

  useEffect(() => {
    fetch("/api/v1/fix", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })
      .then((r) => setAiAvailable(r.status !== 501))
      .catch(() => setAiAvailable(false));
  }, []);

  // Move focus to the report h1 once results render, so a scan completion lands
  // assistive-tech users at the top of the report instead of leaving focus on
  // the scanner. Runs once when the dashboard first mounts.
  useEffect(() => {
    if (result) h1Ref.current?.focus();
  }, [result]);

  const generateFixForIssue = useCallback(
    async (issueId: string) => {
      if (!result || fixCache[issueId] || fixLoading[issueId]) return;
      const issue = result.issues.find((i) => i.id === issueId);
      if (!issue) return;
      setFixLoading((p) => ({ ...p, [issueId]: true }));
      try {
        const res = await fetch("/api/v1/fix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ issue, pageMeta: result.pageMeta }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message ?? "Failed");
        setFixCache((p) => ({ ...p, [issueId]: data.fix?.fixedHtml ?? "" }));
      } catch {
        /* swallow — code block still shows failing HTML */
      } finally {
        setFixLoading((p) => ({ ...p, [issueId]: false }));
      }
    },
    [result, fixCache, fixLoading]
  );

  /* Auto-request AI fixes for the first few critical issues — in an effect, not
     during render. Runs once per scan when AI is available. */
  useEffect(() => {
    if (!aiAvailable || !result) return;
    result.issues
      .filter((i) => i.severity === "critical" && !i.needsManualReview)
      .slice(0, 3)
      .forEach((i) => generateFixForIssue(i.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiAvailable, result]);

  /* Raw issues filtered by page (crawl drill-down), framework, and search —
     applied before grouping so occurrence counts reflect the active filters. */
  const filteredRaw = useMemo(() => {
    if (!result) return [] as AccessibilityIssue[];
    const q = search.trim().toLowerCase();
    return result.issues.filter((i) => {
      if (pageFilter !== null && !i.id.startsWith(`p${pageFilter}-`)) return false;
      if (frameworkFilter !== "all" && !i.applicableFrameworks.includes(frameworkFilter)) return false;
      if (q) {
        const hay = `${i.ruleId} ${i.fixSuggestion} ${i.description} ${i.element.selector}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [result, pageFilter, frameworkFilter, search]);

  /* Counts over the filtered set so chip counts track active filters.
     Severity counts are CONFIRMED failures only; needs-review is separate. */
  const counts = useMemo(() => {
    const c: Record<Severity, number> & { total: number; needsReview: number } = {
      critical: 0, major: 0, minor: 0, "best-practice": 0, total: 0, needsReview: 0,
    };
    for (const i of filteredRaw) {
      if (i.needsManualReview) { c.needsReview += 1; continue; }
      c[i.severity] += 1;
      c.total += 1;
    }
    return c;
  }, [filteredRaw]);

  const grouped = useMemo(() => {
    const byRule = new Map<string, { issue: AccessibilityIssue; count: number }>();
    for (const i of filteredRaw) {
      const existing = byRule.get(i.ruleId);
      if (!existing) byRule.set(i.ruleId, { issue: i, count: 1 });
      else existing.count += 1;
    }
    const arr = Array.from(byRule.values());
    arr.sort((a, b) => {
      const sevOrder: Record<Severity, number> = { critical: 0, major: 1, minor: 2, "best-practice": 3 };
      if (sevOrder[a.issue.severity] !== sevOrder[b.issue.severity])
        return sevOrder[a.issue.severity] - sevOrder[b.issue.severity];
      return b.count - a.count;
    });
    return arr;
  }, [filteredRaw]);

  const visibleIssues = useMemo(() => {
    if (filter === "needs-review") return grouped.filter((g) => g.issue.needsManualReview);
    const confirmed = grouped.filter((g) => !g.issue.needsManualReview);
    return filter === "all" ? confirmed : confirmed.filter((g) => g.issue.severity === filter);
  }, [grouped, filter]);

  /* Auto-expand rule rows on first load only when the list is small. */
  useEffect(() => {
    if (rowsInited.current || grouped.length === 0) return;
    rowsInited.current = true;
    if (grouped.length <= 10) setOpenRules(new Set(grouped.map((g) => g.issue.ruleId)));
  }, [grouped]);

  const allVisibleOpen = visibleIssues.length > 0 && visibleIssues.every((g) => openRules.has(g.issue.ruleId));
  const toggleRule = useCallback((ruleId: string) => {
    setOpenRules((prev) => {
      const next = new Set(prev);
      if (next.has(ruleId)) next.delete(ruleId);
      else next.add(ruleId);
      return next;
    });
  }, []);
  const toggleAll = useCallback(() => {
    setOpenRules((prev) => {
      const allOpen = visibleIssues.length > 0 && visibleIssues.every((g) => prev.has(g.issue.ruleId));
      if (allOpen) {
        const next = new Set(prev);
        for (const g of visibleIssues) next.delete(g.issue.ruleId);
        return next;
      }
      const next = new Set(prev);
      for (const g of visibleIssues) next.add(g.issue.ruleId);
      return next;
    });
  }, [visibleIssues]);

  /* Copy the currently-visible issues as a markdown checklist. */
  const [copiedAll, setCopiedAll] = useState(false);
  const copyVisible = useCallback(() => {
    const lines = visibleIssues.map(({ issue, count }) => {
      const wcag = issue.wcagCriterion ? ` (WCAG ${issue.wcagCriterion.number} ${issue.wcagCriterion.level})` : "";
      return `- [ ] **${issue.severity}** ${issue.fixSuggestion || issue.ruleId}${wcag} — \`${issue.ruleId}\`, ${count}×`;
    });
    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1600);
  }, [visibleIssues]);

  /* Generate AI fixes for every visible issue that has a code snippet. */
  const generateAllFixes = useCallback(async () => {
    if (!result || bulkFixing) return;
    setBulkFixing(true);
    try {
      const targets = visibleIssues
        .map((g) => g.issue)
        .filter((i) => i.element.html.length > 0 && !fixCache[i.id]);
      // Sequential to stay within the fix endpoint's rate limit.
      for (const issue of targets.slice(0, 20)) {
        await generateFixForIssue(issue.id);
      }
    } finally {
      setBulkFixing(false);
    }
  }, [result, bulkFixing, visibleIssues, fixCache, generateFixForIssue]);

  const activePage = pageFilter !== null && site ? site.pages.find((p) => p.pageIndex === pageFilter) : null;

  /* Risk callout — derive from compliance scores */
  const { breakingLaws, worstFrameworks } = useMemo(() => {
    if (!compliance.length) return { breakingLaws: 0, worstFrameworks: [] as ComplianceResult[] };
    const breaking = compliance.filter((c) => c.percentage < 75);
    const sorted = [...breaking].sort((a, b) => a.percentage - b.percentage);
    return { breakingLaws: breaking.length, worstFrameworks: sorted.slice(0, 6) };
  }, [compliance]);

  /* Upcoming deadline alert (if any framework has deadline + low compliance) */
  const deadlineAlert = useMemo(() => {
    for (const cr of compliance) {
      const fw = cr.framework as FrameworkWithTags;
      if (fw.enforcementDate) {
        const days = daysBetween(new Date().toISOString(), fw.enforcementDate);
        if (Number.isFinite(days) && days > -30 && cr.percentage < 90) {
          return { fw, days, pct: cr.percentage };
        }
      }
    }
    return null;
  }, [compliance]);

  if (!result) {
    return (
        <main
          id="main-content"
          role="main"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 24px",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <div className="mono" style={{ fontSize: 11, color: "var(--text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
            NO SCAN · SESSION EMPTY
          </div>
          <h1 className="font-display" style={{ fontSize: 36, marginBottom: 10 }}>
            Nothing to report yet.
          </h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: 24, maxWidth: "48ch" }}>
            Run a scan from the homepage. Results stay in your browser session — we never save them server-side.
          </p>
          <Link href="/#scan" className="btn primary">
            <ArrowLeft size={14} /> Back to scanner
          </Link>
        </main>
    );
  }

  const { score, issues, pageMeta, scanDurationMs, totalRulesRun, timestamp } = result;
  const { host, ext } = splitUrl(pageMeta.url);

  return (
    <MotionConfig reducedMotion="user">
      <main id="main-content" role="main" className="dash" style={{ flex: 1 }}>
        {isSample && (
          <div
            className="mono"
            style={{
              maxWidth: "var(--dash-max)",
              margin: "0 auto",
              padding: "10px 32px",
              fontSize: 12.5,
              color: "var(--text-secondary)",
              background: "var(--accent-wash)",
              borderBottom: "1px solid var(--accent-line)",
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            <span>
              <strong style={{ color: "var(--accent-text)" }}>Sample report.</strong> A real scan of the W3C&rsquo;s
              official inaccessible demo —{" "}
              <a
                href="https://www.w3.org/WAI/demos/bad/before/home.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent-text)", textDecoration: "underline" }}
              >
                visit it
              </a>{" "}
              and re-scan to verify these numbers yourself.
            </span>
          </div>
        )}
        {/* ─── Top header strip ─── */}
        <div className="dash-top">
          <div className="dash-head">
            <div>
              <div className="dash-target">{formatScanTimestamp(timestamp)}</div>
              {/* Real page h1 — focusable (tabIndex -1) so scan completion can move
                  focus here, and styled to match the existing target/url block. */}
              <h1
                ref={h1Ref}
                tabIndex={-1}
                className="font-display"
                style={{ fontSize: 22, lineHeight: 1.2, margin: "4px 0 2px", outline: "none" }}
              >
                Accessibility report for {host}
              </h1>
              <div className="dash-url mono">
                {host}
                <span className="ext">{ext}</span>
              </div>
              <div className="dash-meta">
                <span>Scan time <b>{(scanDurationMs / 1000).toFixed(2)}s</b></span>
                <span>Rules run <b>{totalRulesRun}</b></span>
                <span>Passed <b>{result.passedRules}</b></span>
                <span>
                  Issues found{" "}
                  <b style={{ color: issues.length > 0 ? "var(--severity-critical)" : "var(--pass)" }}>
                    {issues.length}
                  </b>
                </span>
              </div>
            </div>
            <div className="dash-actions">
              <Link href="/#scan" className="btn">
                <RefreshCw size={13} /> Re-scan
              </Link>
              <button type="button" className="btn" onClick={() => window.print()}>
                <Download size={13} /> Export PDF
              </button>
              <button type="button" className="btn" onClick={() => setModal("report")}>
                <Download size={13} /> Download report
              </button>
              <button type="button" className="btn" onClick={generateStatement}>
                <FileText size={13} /> EN 301 549 statement
              </button>
              <button type="button" className="btn" onClick={openEvidenceFile}>
                <FileText size={13} /> Evidence file
              </button>
              <button type="button" className="btn" onClick={() => setModal("action")}>
                <Code2 size={13} /> CI / CLI
              </button>
              {aiAvailable && (
                <button type="button" className="btn primary" onClick={generateAllFixes} disabled={bulkFixing}>
                  <Sparkles size={13} /> {bulkFixing ? "Generating fixes…" : "Generate AI fixes"}
                </button>
              )}
            </div>
            {!isSample && evidenceCount > 0 && (
              <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <FileText size={11} /> {evidenceCount} evidence record{evidenceCount === 1 ? "" : "s"} on file for this site — each Evidence file adds a dated, timestamped entry and shows what changed since the last one.
              </p>
            )}
          </div>

          <motion.p
            className="dash-verdict"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
          >
            {breakingLaws > 0 ? (
              <>
                Likely exposed under <span className="hot">{breakingLaws} of 16 laws</span>
                {counts.critical > 0 && <> · {counts.critical} critical issue{counts.critical === 1 ? "" : "s"}</>}
                {" "}· automated coverage score {score.overall}/100.
              </>
            ) : (
              <>
                <span className="ok">Low legal exposure</span> — no framework scored below 75%. Coverage score {score.overall}/100.
              </>
            )}
          </motion.p>

          <motion.div
            className="score-strip"
            variants={stagger}
            initial="hidden"
            animate="visible"
            transition={{ delayChildren: 0.15, staggerChildren: 0.12 }}
          >
            <motion.div variants={fadeUp}>
              <Gauge value={score.overall} grade={score.grade} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <Pour score={score} />
            </motion.div>
            <motion.div variants={fadeUp}>
              <Risk breakingLaws={breakingLaws} worst={worstFrameworks} pct={score.overall} />
            </motion.div>
          </motion.div>
        </div>

        {/* ─── Monitor opt-in (free weekly re-scan; email capture). Real URL scans only — not paste/upload or the sample. ─── */}
        {result.url && /^https?:\/\//i.test(result.url) && !isSample && (
          <MonitorCta url={result.url} />
        )}

        {/* ─── Site crawl banner ─── */}
        {site && <SiteBanner site={site} />}

        {/* ─── Deadline alert ─── */}
        {deadlineAlert && (
          <motion.div
            className="deadline-bar"
            role="alert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE, delay: 0.35 }}
          >
            <span className="pill">
              <AlertTriangle size={12} /> Deadline
            </span>
            <span className="msg">
              <b>
                {deadlineAlert.fw.name} — {new Date(deadlineAlert.fw.enforcementDate!).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                · {deadlineAlert.days > 0 ? `${deadlineAlert.days} days away` : `${Math.abs(deadlineAlert.days)} days past`}.
              </b>{" "}
              Your current compliance: {deadlineAlert.pct}%.
            </span>
            <span style={{ marginLeft: "auto" }}>
              <a href="#issues" style={{ color: "var(--accent-text)", fontFamily: "var(--font-mono), ui-monospace, monospace", fontSize: 11 }}>
                Remediation plan →
              </a>
            </span>
          </motion.div>
        )}

        {/* ─── Compliance grid (worst-first; collapsed to 8 by default) ─── */}
        <section className="dash-section" aria-label="Compliance by framework">
          <div className="dash-section-head">
            <h2 className="font-display">Coverage by framework</h2>
            <span className="hint">{showAllFw ? "16 jurisdictions" : "worst-exposed first"} · automated-coverage indicator vs each law&rsquo;s WCAG version — not a conformance verdict</span>
          </div>
          <motion.div
            key={showAllFw ? "all" : "top"}
            className="compliance-grid"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
            initial="hidden"
            animate={compliance.length > 0 ? "visible" : "hidden"}
          >
            {FRAMEWORKS
              .map((fw) => ({ fw, cr: compliance.find((c) => c.framework.id === fw.id) }))
              .filter((x) => x.cr)
              .sort((a, b) => a.cr!.percentage - b.cr!.percentage)
              .slice(0, showAllFw ? 16 : 8)
              .map(({ fw, cr }, displayIdx) => (
                // idx is the display rank (worst-first), so the "NN/16" label and
                // stagger delay stay sequential after sorting.
                <ComplianceCard key={fw.id} fw={fw} cr={cr!} idx={displayIdx} onOpen={() => setDetailFw(fw)} />
              ))}
          </motion.div>
          {compliance.length > 8 && (
            <button type="button" className="btn" style={{ marginTop: 14 }} onClick={() => setShowAllFw((s) => !s)}>
              {showAllFw ? "Show fewer" : `Show all 16 frameworks (${compliance.length - 8} more)`}
            </button>
          )}
        </section>

        {/* ─── Conformance by success criterion (audit-grade) ─── */}
        <ConformanceByCriterion
          issues={result.issues}
          passedRuleTags={result.passedRuleTags}
          defaultFrameworkId={worstFrameworks[0]?.framework.id ?? "ada-title-iii"}
          scopeLabel={site ? `${site.stats.scanned} page${site.stats.scanned === 1 ? "" : "s"} of ${site.origin} (sampled)` : "this page"}
        />

        {/* ─── Pages crawled (site scan only) ─── */}
        {site && (
          <CrawledPages
            site={site}
            activeIndex={pageFilter}
            onSelectPage={(idx) => {
              setPageFilter(idx);
              setFilter("all");
              document.getElementById("issues")?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        )}

        {/* ─── Jurisdiction spotlight — EAA + Unruh ─── */}
        <JurisdictionSpotlight result={result} compliance={compliance} onLegalReport={() => setModal("legal")} />

        {/* ─── Issues ─── */}
        <section className="dash-section" id="issues" aria-label="Issue list">
          <div className="dash-section-head">
            <h2 className="font-display">Issues</h2>
            <span className="hint">
              {filteredRaw.length} shown · {grouped.length} unique rules · grouped &amp; sorted by severity
            </span>
          </div>
          <div className="issues-table">
            {/* Search + framework + page filters */}
            <div
              style={{
                display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap",
                padding: "12px 14px", borderBottom: "1px solid var(--border-default)",
              }}
            >
              <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
                <Search size={13} aria-hidden="true" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search rule, description, selector…"
                  aria-label="Search issues"
                  style={{
                    width: "100%", background: "var(--bg-input)", border: "1px solid var(--border-strong)",
                    borderRadius: 6, padding: "6px 10px 6px 30px", color: "var(--text-primary)", fontSize: 13,
                  }}
                />
              </div>
              <label htmlFor="fw-filter" className="sr-only">Filter by framework</label>
              <select
                id="fw-filter"
                value={frameworkFilter}
                onChange={(e) => setFrameworkFilter(e.target.value)}
                className="mono"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border-strong)", borderRadius: 6, padding: "6px 8px", color: "var(--text-primary)", fontSize: 12 }}
              >
                <option value="all">All frameworks</option>
                {FRAMEWORKS.map((fw) => (
                  <option key={fw.id} value={fw.id}>{fw.shortName}</option>
                ))}
              </select>
              <button type="button" className="btn" onClick={toggleAll} disabled={visibleIssues.length === 0}>
                {allVisibleOpen ? "Collapse all" : "Expand all"}
              </button>
              <button type="button" className="btn" onClick={copyVisible} disabled={visibleIssues.length === 0}>
                {copiedAll ? <Check size={13} /> : <Copy size={13} />} {copiedAll ? "Copied" : "Copy all"}
              </button>
              {aiAvailable && (
                <button type="button" className="btn" onClick={generateAllFixes} disabled={bulkFixing || visibleIssues.length === 0}>
                  <Sparkles size={13} /> {bulkFixing ? "Generating…" : "AI-fix visible"}
                </button>
              )}
            </div>

            {/* Active page drill-down chip */}
            {activePage && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: "1px solid var(--border-default)", fontSize: 12, color: "var(--text-secondary)" }}>
                <span>Showing issues for page:</span>
                <span className="mono" style={{ color: "var(--text-primary)" }}>{pathOf(activePage.url)}</span>
                <button type="button" className="btn-ghost" onClick={() => setPageFilter(null)} style={{ padding: "3px 8px" }}>
                  <X size={11} /> Clear
                </button>
              </div>
            )}

            <div className="issues-filter" role="toolbar" aria-label="Filter issues by severity">
              <span className="label">Filter</span>
              <FilterChip active={filter === "all"} label="All" count={counts.total} onClick={() => setFilter("all")} />
              <FilterChip
                active={filter === "critical"}
                label="Critical"
                count={counts.critical}
                onClick={() => setFilter("critical")}
                sev="critical"
              />
              <FilterChip
                active={filter === "major"}
                label="Major"
                count={counts.major}
                onClick={() => setFilter("major")}
                sev="major"
              />
              <FilterChip
                active={filter === "minor"}
                label="Minor"
                count={counts.minor}
                onClick={() => setFilter("minor")}
                sev="minor"
              />
              <FilterChip
                active={filter === "best-practice"}
                label="Best practice"
                count={counts["best-practice"]}
                onClick={() => setFilter("best-practice")}
                sev="best-practice"
              />
              {counts.needsReview > 0 && (
                <FilterChip
                  active={filter === "needs-review"}
                  label="Needs review"
                  count={counts.needsReview}
                  onClick={() => setFilter("needs-review")}
                />
              )}
              <span
                style={{
                  marginLeft: "auto",
                  fontFamily: "var(--font-mono), ui-monospace, monospace",
                  fontSize: 11,
                  color: "var(--text-tertiary)",
                  letterSpacing: "0.06em",
                }}
              >
                Sorted by · legal exposure
              </span>
            </div>

            {visibleIssues.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-secondary)" }}>
                {search || frameworkFilter !== "all" || pageFilter !== null
                  ? "No issues match these filters. Try clearing search or the framework filter."
                  : "No issues at this severity. Manual testing still recommended — automated scans catch ~30–40%."}
              </div>
            ) : (
              <motion.div
                key={`${filter}-${frameworkFilter}-${pageFilter}-${search}`}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
                initial="hidden"
                animate="visible"
              >
                {visibleIssues.map(({ issue, count }) => {
                  const effort = effortMap[issue.ruleId] ?? {
                    chipClass: "medium" as const,
                    label: "Medium",
                    estimate: "15–60 min",
                  };
                  const fixHtml = fixCache[issue.id] ?? null;
                  return (
                    <IssueRow
                      key={issue.id}
                      issue={issue}
                      effort={effort}
                      count={count}
                      fixHtml={fixHtml}
                      showCode={issue.element.html.length > 0}
                      expanded={openRules.has(issue.ruleId)}
                      onToggle={() => toggleRule(issue.ruleId)}
                      loadingFix={!!fixLoading[issue.id]}
                    />
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>

        {/* ─── Ship banner ─── */}
        <section className="dash-section" style={{ paddingBottom: 80 }}>
          <div
            style={{
              border: "1px solid var(--border-default)",
              background: "var(--bg-raised)",
              borderRadius: 6,
              padding: 24,
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 24,
              alignItems: "center",
            }}
          >
            <div>
              <h2 className="font-display" style={{ fontSize: 20, marginBottom: 6 }}>
                Ship this report to your team
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, maxWidth: "64ch", lineHeight: 1.55 }}>
                Drop the GitHub Action into <span className="mono" style={{ color: "var(--text-primary)" }}>.github/workflows/</span> so regressions fail CI, or
                download a PR-ready markdown report to paste into an issue or ticket. Your scan data stays in your
                browser session.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" className="btn" onClick={() => setModal("action")}>
                <ExternalLink size={13} /> GitHub Action
              </button>
              <button type="button" className="btn" onClick={() => setModal("legal")}>
                <Download size={13} /> Legal report
              </button>
              <button type="button" className="btn primary" onClick={() => setModal("report")}>
                <Download size={13} /> Download report
              </button>
            </div>
          </div>
        </section>

        <div
          style={{
            width: "100%",
            borderTop: "1px solid var(--border-default)",
            padding: "16px 32px 40px",
            color: "var(--text-tertiary)",
            fontSize: 12,
          }}
        >
          <p style={{ lineHeight: 1.6, marginBottom: 8 }}>
            <b className="mono" style={{ color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: 10 }}>
              Disclaimer —
            </b>{" "}
            Automated testing detects ~30–40% of WCAG issues. This is not a legal compliance assessment, and a
            passing score is not a determination that your site complies with any law. For a full audit, pair us
            with a manual expert review.
          </p>
          <p style={{ lineHeight: 1.6, marginBottom: 8 }}>
            WCAG conformance is determined pass/fail per success criterion, and W3C does not define a single-number
            conformance metric. The per-framework percentages here are <b>automated-coverage indicators</b> against
            each law&rsquo;s cited WCAG version (e.g. Section&nbsp;508 = WCAG&nbsp;2.0&nbsp;AA, EAA/EN&nbsp;301&nbsp;549 =
            WCAG&nbsp;2.1&nbsp;AA) — not conformance verdicts. A single automated scan cannot establish conformance for
            a page, let alone a whole site.
          </p>
          <p style={{ lineHeight: 1.6 }}>
            Actual legal exposure depends on jurisdiction, entity type and size, applicable exemptions, timing, and
            the facts of each case. Damage figures shown are historical settlements or statutory reference points, not
            predictions — EAA penalties in particular are set by each EU member state. Nothing here is legal advice;
            consult counsel before making decisions based on these results.
          </p>
        </div>
      </main>

      <GithubActionDialog
        open={modal === "action"}
        onClose={() => setModal(null)}
        targetUrl={result.url}
        currentScore={score.overall}
      />
      <DownloadReportDialog
        open={modal === "report"}
        onClose={() => setModal(null)}
        result={result}
        compliance={compliance}
        aiFixes={fixCache}
      />
      <LegalReportDialog
        open={modal === "legal"}
        onClose={() => setModal(null)}
        result={result}
        compliance={compliance}
      />
      <ComplianceDetailModal
        fw={detailFw}
        cr={detailFw ? compliance.find((c) => c.framework.id === detailFw.id) ?? null : null}
        onClose={() => setDetailFw(null)}
        onFilterIssues={() => {
          if (!detailFw) return;
          setFrameworkFilter(detailFw.id);
          setFilter("all");
          setDetailFw(null);
          document.getElementById("issues")?.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </MotionConfig>
  );
}

/* ──────────────────────────────────────────────────────────────
   Compliance detail modal — full framework context on card click
   ────────────────────────────────────────────────────────────── */
function ComplianceDetailModal({
  fw,
  cr,
  onClose,
  onFilterIssues,
}: {
  fw: FrameworkWithTags | null;
  cr: ComplianceResult | null;
  onClose: () => void;
  onFilterIssues: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus management (matches ExportDialogs): focus the close button on open,
  // trap Tab / Shift+Tab inside the dialog, and restore focus to the element
  // that opened the modal (the compliance card) on close.
  useEffect(() => {
    if (!fw) return;
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      opener?.focus?.();
    };
  }, [fw, onClose]);

  return (
    <AnimatePresence>
      {fw && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${fw.name} details`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.62)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: 24 }}
        >
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ width: "min(560px, 100%)", maxHeight: "calc(100vh - 48px)", overflow: "auto", background: "var(--bg-raised)", border: "1px solid var(--border-strong)", borderRadius: 8, boxShadow: "0 40px 120px rgba(0,0,0,0.55)" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderBottom: "1px solid var(--border-default)", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Flag code={flagForRegion(fw.region)} />
                <div>
                  <div className="font-display" style={{ fontSize: 17 }}>{fw.name}</div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{fw.region} · {fw.wcagBasis}</div>
                </div>
              </div>
              <button ref={closeRef} type="button" className="modal-close" onClick={onClose} aria-label="Close dialog">
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 16 }}>
              {cr && (
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span className="mono" style={{ fontSize: 34, fontWeight: 700, color: cr.percentage < 60 ? "var(--severity-critical)" : cr.percentage < 90 ? "var(--severity-minor)" : "var(--pass)" }}>
                    {cr.percentage}%
                  </span>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    automated coverage ({fw.wcagBasis}) · {cr.passedCount}/{cr.totalApplicable} applicable automated rules pass · {cr.failedCount} failing
                  </span>
                </div>
              )}

              <Field label="Who it applies to" value={fw.appliesTo === "both" ? "Public & private sector" : `${fw.appliesTo[0].toUpperCase()}${fw.appliesTo.slice(1)} sector`} />
              <Field label="Penalties / enforcement" value={fw.penalties} />
              {fw.enforcementDate && (
                <Field
                  label="Enforcement date"
                  value={`${new Date(fw.enforcementDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}${fw.deadlineAlert ? ` — ${fw.deadlineAlert}` : ""}`}
                />
              )}

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 4 }}>
                <button type="button" className="btn primary" onClick={onFilterIssues}>
                  Show issues affecting this law →
                </button>
                <a href={fw.url} target="_blank" rel="noopener noreferrer" className="btn">
                  <ExternalLink size={13} /> Read the law
                </a>
              </div>

              <p style={{ fontSize: 11, color: "var(--text-tertiary)", lineHeight: 1.5, margin: 0 }}>
                WCAG conformance is pass/fail per success criterion — this percentage is an automated-coverage
                indicator for {fw.wcagBasis} (the version {fw.shortName} legally cites), not a conformance
                determination. Automated testing covers only ~30–40% of criteria; full conformance requires manual
                review. Penalty figures are historical or statutory reference points. Not legal advice.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Pour + Risk sub-components
   ────────────────────────────────────────────────────────────── */
function Pour({ score }: { score: ScanResult["score"] }) {
  const rows: Array<{ key: "P" | "O" | "U" | "R"; name: string; principle: "perceivable" | "operable" | "understandable" | "robust" }> = [
    { key: "P", name: "Perceivable", principle: "perceivable" },
    { key: "O", name: "Operable", principle: "operable" },
    { key: "U", name: "Understandable", principle: "understandable" },
    { key: "R", name: "Robust", principle: "robust" },
  ];

  return (
    <div className="pour-grid" aria-label="POUR breakdown">
      {rows.map((r) => {
        const data = score.byPrinciple[r.principle];
        const total = data.passed + data.failed;
        const pct = total > 0 ? Math.round((data.passed / total) * 100) : 100;
        const tone = pct >= 90 ? "ok" : pct >= 70 ? "warn" : "bad";
        return (
          <div key={r.key} className="pour-row">
            <div className="pour-name">
              <span>
                {r.key} · <b>{r.name}</b>
              </span>
              <span className="mono">{pct}</span>
            </div>
            <div
              className="pour-bar"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${r.name} score ${pct} of 100`}
            >
              <div className={`pour-fill ${tone}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Risk({
  breakingLaws,
  worst,
  pct,
}: {
  breakingLaws: number;
  worst: ComplianceResult[];
  pct: number;
}) {
  if (breakingLaws === 0) {
    return (
      <div className="risk-col">
        <div className="risk-lead">
          You&rsquo;re at <span className="hot" style={{ color: "var(--pass)" }}>low risk</span>. No framework scored below 75% compliance.
        </div>
        <p className="risk-sub">
          Continue to monitor — regressions happen in deploys, not audits. Wire A11y Beast into CI to catch them
          before they ship.
        </p>
      </div>
    );
  }

  const extra = Math.max(0, worst.length - 6);

  return (
    <div className="risk-col">
      <div className="risk-lead">
        You&rsquo;re likely exposed under <span className="hot">{breakingLaws} of 16 framework{breakingLaws === 1 ? "" : "s"}</span> — here&rsquo;s what to fix first.
      </div>
      <p className="risk-sub">
        Ranked by your violations, jurisdictional scope, and per-framework severity, so you can resolve the riskiest
        first. Directional, not legal advice — and automation only sees part of the picture.
      </p>
      <div className="risk-tags">
        {worst.slice(0, 6).map((c) => (
          <span key={c.framework.id} className="risk-tag">
            {c.framework.shortName}
          </span>
        ))}
        {extra > 0 && <span className="risk-tag">+{extra} more</span>}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Site crawl banner — summary + transparency about coverage
   ────────────────────────────────────────────────────────────── */
function SiteBanner({ site }: { site: SiteScanResult }) {
  const { stats } = site;
  const notes: string[] = [];
  if (stats.cappedByPageLimit) notes.push(`stopped at the ${stats.maxPages}-page limit — more pages exist`);
  if (stats.cappedByTimeBudget) notes.push("stopped at the time budget — more pages exist");
  if (stats.robotsSkipped > 0) notes.push(`${stats.robotsSkipped} skipped per robots.txt`);
  if (stats.failed.length > 0) notes.push(`${stats.failed.length} failed to load`);

  return (
    <motion.div
      className="deadline-bar"
      role="status"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE, delay: 0.3 }}
      style={{ background: "var(--bg-raised)" }}
    >
      <span className="pill">Site scan</span>
      <span className="msg">
        <b>{stats.scanned} page{stats.scanned === 1 ? "" : "s"} scanned</b> across {site.origin} ·
        scores below are a site-wide rollup.
        {notes.length > 0 && <span style={{ color: "var(--text-tertiary)" }}> {notes.join(" · ")}.</span>}
      </span>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Pages crawled — per-page scores, worst first
   ────────────────────────────────────────────────────────────── */
function pathOf(url: string): string {
  try {
    const u = new URL(url);
    return (u.pathname === "/" ? "/" : u.pathname) + (u.search || "");
  } catch {
    return url;
  }
}

function CrawledPages({
  site,
  activeIndex,
  onSelectPage,
}: {
  site: SiteScanResult;
  activeIndex: number | null;
  onSelectPage: (pageIndex: number) => void;
}) {
  const scoreTone = (n: number) => (n >= 90 ? "var(--pass)" : n >= 60 ? "var(--severity-minor)" : "var(--severity-critical)");
  return (
    <section className="dash-section" aria-label="Pages crawled">
      <div className="dash-section-head">
        <h2 className="font-display">Pages crawled</h2>
        <span className="hint">{site.pages.length} pages · worst score first · click to filter issues</span>
      </div>
      <div style={{ border: "1px solid var(--border-default)", borderRadius: 6, overflow: "hidden" }}>
        {site.pages.map((p, i) => {
          const active = activeIndex === p.pageIndex;
          return (
            <button
              key={p.url + i}
              type="button"
              onClick={() => onSelectPage(p.pageIndex)}
              aria-pressed={active}
              style={{
                width: "100%",
                textAlign: "left",
                display: "grid",
                gridTemplateColumns: "auto 1fr auto auto auto",
                gap: 16,
                alignItems: "center",
                padding: "12px 16px",
                borderTop: i === 0 ? "none" : "1px solid var(--border-default)",
                background: active ? "var(--bg-overlay)" : "transparent",
                border: "none",
                borderLeft: active ? "3px solid var(--accent)" : "3px solid transparent",
                cursor: "pointer",
                color: "inherit",
              }}
            >
              <span className="mono" style={{ fontSize: 18, fontWeight: 700, color: scoreTone(p.score), minWidth: 36 }}>
                {p.score}
              </span>
              <span className="mono" style={{ fontSize: 13, color: "var(--text-primary)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {pathOf(p.url)}
              </span>
              <span className="mono" style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                grade {p.grade}
              </span>
              <span className="mono" style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                {p.criticalCount > 0 && (
                  <span style={{ color: "var(--severity-critical)" }}>{p.criticalCount} critical · </span>
                )}
                {p.issueCount} issue{p.issueCount === 1 ? "" : "s"}
              </span>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Open ${p.url} in a new tab`}
                style={{ color: "var(--text-tertiary)", display: "inline-flex" }}
              >
                <ExternalLink size={13} />
              </a>
            </button>
          );
        })}
      </div>
      {site.stats.failed.length > 0 && (
        <p style={{ marginTop: 10, fontSize: 12, color: "var(--text-tertiary)" }}>
          Failed to scan: {site.stats.failed.map((f) => pathOf(f.url)).join(", ")}
        </p>
      )}
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Conformance by success criterion — the audit-grade view.
   WCAG conformance is pass/fail per criterion; criteria automation
   can't evaluate are shown "not tested", never silently passed.
   ────────────────────────────────────────────────────────────── */
const CRIT_STATUS_META: Record<CriterionStatus, { label: string; color: string; order: number }> = {
  fail: { label: "Failed", color: "var(--severity-critical)", order: 0 },
  "needs-review": { label: "Needs review", color: "var(--sev-review)", order: 1 },
  "not-tested": { label: "Not tested", color: "var(--text-tertiary)", order: 2 },
  pass: { label: "Passed", color: "var(--pass)", order: 3 },
};

function ConformanceByCriterion({
  issues,
  passedRuleTags,
  defaultFrameworkId,
  scopeLabel,
}: {
  issues: AccessibilityIssue[];
  passedRuleTags?: string[][];
  defaultFrameworkId: string;
  scopeLabel: string;
}) {
  const [fwId, setFwId] = useState<string>(defaultFrameworkId);
  const [showAll, setShowAll] = useState(false);
  const fw = FRAMEWORKS.find((f) => f.id === fwId) ?? FRAMEWORKS[0];
  const conf = useMemo(
    () => computeConformance(fw, issues, passedRuleTags),
    [fw, issues, passedRuleTags]
  );

  const sorted = useMemo(
    () =>
      [...conf.criteria].sort((a, b) => {
        const o = CRIT_STATUS_META[a.status].order - CRIT_STATUS_META[b.status].order;
        return o !== 0 ? o : a.number.localeCompare(b.number, undefined, { numeric: true });
      }),
    [conf]
  );
  // Always surface actionable items; hide pass/not-tested behind a toggle.
  const visible = showAll ? sorted : sorted.filter((c) => c.status === "fail" || c.status === "needs-review");
  const hiddenCount = sorted.length - sorted.filter((c) => c.status === "fail" || c.status === "needs-review").length;

  const Stat = ({ n, label, color }: { n: number; label: string; color: string }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span className="mono" style={{ fontSize: 22, fontWeight: 700, color }}>{n}</span>
      <span className="mono" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>{label}</span>
    </div>
  );

  return (
    <section className="dash-section" aria-label="Conformance by success criterion">
      <div className="dash-section-head">
        <h2 className="font-display">Conformance by success criterion</h2>
        <span className="hint">pass / fail per WCAG criterion — the audit-grade view</span>
      </div>

      <div style={{ border: "1px solid var(--border-default)", borderRadius: 6, padding: 18, background: "var(--bg-raised)" }}>
        {/* Declared target + scope (WCAG-EM) */}
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
          <label htmlFor="conf-fw" className="mono" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
            Framework
          </label>
          <select
            id="conf-fw"
            value={fwId}
            onChange={(e) => setFwId(e.target.value)}
            className="mono"
            style={{ background: "var(--bg-input)", border: "1px solid var(--border-strong)", borderRadius: 6, padding: "5px 8px", color: "var(--text-primary)", fontSize: 12 }}
          >
            {FRAMEWORKS.map((f) => (
              <option key={f.id} value={f.id}>{f.shortName} · {f.region}</option>
            ))}
          </select>
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            Target: <b style={{ color: "var(--text-primary)" }}>{conf.target}</b> · Evaluated: {scopeLabel}
          </span>
        </div>

        {/* Summary tally */}
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", padding: "14px 0", borderTop: "1px solid var(--border-default)", borderBottom: "1px solid var(--border-default)", marginBottom: 14 }}>
          <Stat n={conf.fail} label="Failed" color="var(--severity-critical)" />
          <Stat n={conf.needsReview} label="Needs review" color="var(--sev-review)" />
          <Stat n={conf.notTested} label="Not tested" color="var(--text-tertiary)" />
          <Stat n={conf.pass} label="Passed (auto)" color="var(--pass)" />
          <Stat n={conf.total} label={`Applicable SC (${conf.target.includes("2.1") ? "2.1" : "2.0"} AA)`} color="var(--text-secondary)" />
        </div>

        {/* Criterion list */}
        <div role="list">
          {visible.map((c) => {
            const meta = CRIT_STATUS_META[c.status];
            return (
              <div
                key={c.number}
                role="listitem"
                style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 12, alignItems: "center", padding: "9px 0", borderTop: "1px solid var(--border-default)" }}
              >
                <span className="mono" style={{ fontSize: 12, color: "var(--text-tertiary)", minWidth: 48 }}>{c.number}</span>
                <span style={{ fontSize: 13, color: "var(--text-primary)" }}>
                  {c.name}
                  {c.failCount > 0 && <span className="mono" style={{ marginLeft: 8, fontSize: 11, color: "var(--text-tertiary)" }}>· {c.failCount} occurrence{c.failCount === 1 ? "" : "s"}</span>}
                </span>
                <span className="mono" style={{ fontSize: 10, color: "var(--text-tertiary)" }}>Lvl {c.level}</span>
                <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: meta.color, minWidth: 92, textAlign: "right" }}>{meta.label}</span>
              </div>
            );
          })}
        </div>

        {hiddenCount > 0 && (
          <button type="button" className="btn" style={{ marginTop: 14 }} onClick={() => setShowAll((s) => !s)}>
            {showAll ? "Hide passed & not-tested" : `Show all criteria (${hiddenCount} passed / not-tested)`}
          </button>
        )}

        <p style={{ fontSize: 11, color: "var(--text-tertiary)", lineHeight: 1.5, marginTop: 14, marginBottom: 0 }}>
          &ldquo;Not tested&rdquo; means automation can&rsquo;t evaluate that criterion — it requires manual review, not that it passes.
          Automated testing covers only ~30–40% of WCAG criteria. This is an automated evaluation against {conf.target}, not a
          full conformance audit, and conformance can&rsquo;t be claimed for an entire site from sampled pages (W3C WCAG-EM).
        </p>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Jurisdiction spotlight — EAA statement check + Unruh per-visit
   exposure. The two regimes driving current enforcement volume.
   ────────────────────────────────────────────────────────────── */
function JurisdictionSpotlight({
  result,
  compliance,
  onLegalReport,
}: {
  result: ScanResult;
  compliance: ComplianceResult[];
  onLegalReport: () => void;
}) {
  const unruh = compliance.find((c) => c.framework.id === "california-unruh");
  const eaa = compliance.find((c) => c.framework.id === "eaa");
  const unruhOccurrences = useMemo(
    () => result.issues.filter((i) => i.applicableFrameworks.includes("california-unruh")).length,
    [result]
  );

  if (!unruh && !eaa) return null;

  const hasStatement = result.pageMeta.hasAccessibilityStatement;
  const perVisit = unruhOccurrences * 4_000;
  const fmt = (n: number) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${n.toLocaleString("en-US")}`;

  const cardStyle: React.CSSProperties = {
    border: "1px solid var(--border-default)",
    background: "var(--bg-raised)",
    borderRadius: 6,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  };
  const headStyle: React.CSSProperties = {
    fontSize: 11,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--text-tertiary)",
    display: "flex",
    alignItems: "center",
    gap: 8,
  };
  const bodyStyle: React.CSSProperties = { color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.55 };

  return (
    <section className="dash-section" aria-label="Jurisdiction spotlight">
      <div className="dash-section-head">
        <h2 className="font-display">Jurisdiction spotlight</h2>
        <span className="hint">The two regimes driving enforcement right now</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
        {eaa && (
          <div style={cardStyle}>
            <div className="mono" style={headStyle}>
              <Flag code={flagForRegion(eaa.framework.region)} /> European Accessibility Act · {eaa.percentage}%
            </div>
            <div style={{ fontSize: 15, color: "var(--text-primary)", fontWeight: 600 }}>
              {hasStatement
                ? "Accessibility statement detected"
                : "No accessibility statement detected — the EAA requires one"}
            </div>
            <p style={bodyStyle}>
              Enforceable across 27 member states since June 28, 2025. Penalties are member-state dependent — up to
              4% of revenue in some states.{" "}
              {!hasStatement && "The missing statement alone deducts 8% from your EAA score; publishing one is usually the fastest single fix."}
            </p>
          </div>
        )}
        {unruh && (
          <div style={cardStyle}>
            <div className="mono" style={headStyle}>
              <Flag code={flagForRegion(unruh.framework.region)} /> California Unruh Act · {unruh.percentage}%
            </div>
            <div style={{ fontSize: 15, color: "var(--text-primary)", fontWeight: 600 }}>
              {unruhOccurrences > 0
                ? `${fmt(perVisit)} statutory minimum exposure per affected visit`
                : "No violations currently map to Unruh"}
            </div>
            <p style={bodyStyle}>
              {unruhOccurrences > 0 && (
                <>
                  {unruhOccurrences} violation {unruhOccurrences === 1 ? "occurrence" : "occurrences"} × $4,000
                  statutory minimum, if each barrier is counted separately — and each visit by an affected user can
                  be a separate claim.{" "}
                </>
              )}
              Plaintiffs are increasingly filing in California state court, so federal lawsuit counts understate
              this exposure. Courts vary in how violations are counted — treat figures as reference points, not
              predictions.
            </p>
          </div>
        )}
      </div>
      <div style={{ marginTop: 12 }}>
        <button type="button" className="btn" onClick={onLegalReport}>
          <Download size={13} /> Generate per-jurisdiction legal report
        </button>
      </div>
    </section>
  );
}
