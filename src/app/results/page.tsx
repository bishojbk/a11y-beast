"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, AlertTriangle, CheckCircle2, XCircle, AlertCircle, Info, Clock,
  Shield, Scale, Globe, Eye, Users, Code, Wrench, FileWarning, ExternalLink,
  ChevronRight, BarChart3, PieChart, Gauge, ListChecks, ShieldAlert, Gavel,
  type LucideIcon,
} from "lucide-react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import type { ScanResult } from "@/lib/types/scan-result";
import type { AccessibilityIssue, Severity } from "@/lib/types/issue";
import type { ComplianceResult } from "@/lib/types/compliance";

/* ── Variants ── */
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const vpOnce = { once: true, amount: 0.01 };

/* ── Severity Config ── */
const SEV: Record<Severity, { Icon: LucideIcon; color: string; bg: string; label: string }> = {
  critical: { Icon: XCircle, color: "var(--severity-critical)", bg: "var(--severity-critical-bg)", label: "Critical" },
  major: { Icon: AlertTriangle, color: "var(--severity-major)", bg: "var(--severity-major-bg)", label: "Major" },
  minor: { Icon: AlertCircle, color: "var(--severity-minor)", bg: "var(--severity-minor-bg)", label: "Minor" },
  "best-practice": { Icon: Info, color: "var(--severity-info)", bg: "var(--severity-info-bg)", label: "Best Practice" },
};

/* ── Small Components ── */
function AnimatedNum({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const from = prev.current; const diff = value - from; const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / 1200, 1);
      setDisplay(Math.round(from + diff * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(tick); else prev.current = value;
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <>{display}</>;
}

function ScoreGauge({ score, grade }: { score: number; grade: string }) {
  const circ = 2 * Math.PI * 45;
  const offset = circ - (score / 100) * circ;
  const color = score >= 90 ? "var(--pass)" : score >= 70 ? "var(--severity-minor)" : score >= 50 ? "var(--severity-major)" : "var(--severity-critical)";
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" role="meter" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label={`Score: ${score}`}>
          <circle cx="50" cy="50" r="45" stroke="var(--border-default)" strokeWidth="5" fill="none" />
          <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset} className="animate-score-ring" style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color }}><AnimatedNum value={score} /></span>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>/ 100</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Gauge size={16} style={{ color }} aria-hidden="true" />
        <span className="text-xl font-bold" style={{ color }}>Grade: {grade}</span>
      </div>
    </div>
  );
}

function StatCard({ value, label, Icon, color }: { value: number | string; Icon: LucideIcon; label: string; color: string }) {
  return (
    <motion.div variants={fadeUp} className="rounded-[var(--radius-lg)] p-4 flex items-center gap-3"
      style={{ background: "var(--bg-raised)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)" }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, color }}>
        <Icon size={18} aria-hidden="true" />
      </div>
      <div>
        <div className="text-xl font-bold" style={{ color }}>{typeof value === "number" ? <AnimatedNum value={value} /> : value}</div>
        <div className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{label}</div>
      </div>
    </motion.div>
  );
}

function IssueCard({ issue, index, effort }: { issue: AccessibilityIssue; index: number; effort: { label: string; color: string; bg: string; estimate: string } }) {
  const [open, setOpen] = useState(false);
  const s = SEV[issue.severity];

  return (
    <motion.div variants={fadeUp} className="rounded-[var(--radius-md)] overflow-hidden transition-all hover:shadow-md"
      style={{ background: "var(--bg-raised)", border: "1px solid var(--border-default)" }}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.bg, color: s.color }}>
            <s.Icon size={16} aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{issue.fixSuggestion || issue.description}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ color: s.color, background: s.bg }}>
                <s.Icon size={10} aria-hidden="true" /> {s.label}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ color: effort.color, background: effort.bg }}>
                <Wrench size={9} aria-hidden="true" /> {effort.label} ~{effort.estimate}
              </span>
              {issue.wcagCriterion && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: "var(--bg-code)", color: "var(--text-tertiary)" }}>
                  WCAG {issue.wcagCriterion.number}
                </span>
              )}
            </div>
            <p className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>{issue.description}</p>
            <div className="flex flex-wrap gap-3 text-xs" style={{ color: "var(--text-tertiary)" }}>
              <span className="flex items-center gap-1"><Code size={11} aria-hidden="true" /> <code className="font-mono text-[10px]" style={{ color: "var(--text-secondary)" }}>{issue.element.selector.slice(0, 50)}</code></span>
              {issue.impact.length > 0 && <span className="flex items-center gap-1"><Users size={11} aria-hidden="true" /> {issue.impact.join(", ")}</span>}
              {issue.needsManualReview && <span className="flex items-center gap-1"><Eye size={11} aria-hidden="true" /> Needs manual review</span>}
            </div>
            <button onClick={() => setOpen(!open)} aria-expanded={open}
              className="mt-2 text-xs cursor-pointer flex items-center gap-1 transition-colors" style={{ color: "var(--text-link)" }}>
              <ChevronRight size={12} style={{ transform: open ? "rotate(90deg)" : "", transition: "transform 0.2s" }} aria-hidden="true" />
              {open ? "Hide" : "Show"} code & legal details
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="overflow-hidden px-4 pb-4" style={{ borderTop: "1px solid var(--border-default)" }}>
            <div className="pt-3 space-y-3">
              <pre className="text-[11px] rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all"
                style={{ background: "var(--bg-code)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                {issue.element.html}
              </pre>
              {issue.applicableFrameworks.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider mb-1.5 font-semibold flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                    <Gavel size={11} aria-hidden="true" /> Applicable Laws
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {issue.applicableFrameworks.slice(0, 10).map((f) => (
                      <span key={f} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: "var(--severity-critical-bg)", color: "var(--severity-critical)" }}>
                        <ShieldAlert size={9} aria-hidden="true" /> {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {issue.whyItMatters && (
                <p className="text-[11px] flex items-start gap-1.5" style={{ color: "var(--text-tertiary)" }}>
                  <FileWarning size={12} className="flex-shrink-0 mt-0.5" aria-hidden="true" /> {issue.whyItMatters.slice(0, 200)}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function ResultsPage() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [compliance, setCompliance] = useState<ComplianceResult[]>([]);
  const [effortMap, setEffortMap] = useState<Record<string, { label: string; color: string; bg: string; estimate: string }>>({});
  const [activeTab, setActiveTab] = useState<"issues" | "compliance" | "passed">("issues");
  const defaultEffort = { label: "Medium", color: "var(--severity-minor)", bg: "var(--severity-minor-bg)", estimate: "15-60 min" };

  useEffect(() => {
    const stored = sessionStorage.getItem("a11y-beast-result");
    if (!stored) return;
    try {
      const parsed: ScanResult = JSON.parse(stored);
      setResult(parsed);
      import("@/lib/compliance/mapper").then(({ generateComplianceResults }) => {
        setCompliance(generateComplianceResults(parsed.issues, parsed.passedRules, {
          hasAccessibilityStatement: parsed.pageMeta.hasAccessibilityStatement,
          hasSkipLink: parsed.pageMeta.hasSkipLink,
          lang: parsed.pageMeta.lang,
        }));
      });
      import("@/lib/analyzer/effort").then(({ getEffort }) => {
        const map: Record<string, typeof defaultEffort> = {};
        for (const issue of parsed.issues) { if (!map[issue.ruleId]) map[issue.ruleId] = getEffort(issue.ruleId); }
        setEffortMap(map);
      });
    } catch { /* invalid data */ }
  }, []);

  if (!result) {
    return (
      <>
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
          <ListChecks size={48} style={{ color: "var(--text-tertiary)" }} aria-hidden="true" />
          <h1 className="text-2xl font-bold mt-4 mb-2" style={{ color: "var(--text-primary)" }}>No scan results</h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Run a scan from the homepage to see results here.</p>
          <Link href="/" className="h-11 px-6 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
            style={{ background: "var(--accent)", color: "var(--text-inverse)", boxShadow: "var(--shadow-glow)" }}>
            <ArrowLeft size={14} /> Back to Scanner
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const { score, issues, pageMeta } = result;

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 px-6 py-8" role="main">
        <div className="max-w-6xl mx-auto">

          {/* ── Back + URL ── */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-80" style={{ color: "var(--text-link)" }}>
              <ArrowLeft size={14} /> New Scan
            </Link>
            <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
              <Globe size={13} aria-hidden="true" />
              <span className="font-mono" style={{ color: "var(--text-secondary)" }}>{result.url}</span>
              <span>&middot;</span>
              <Clock size={13} aria-hidden="true" />
              <span>{result.scanDurationMs}ms</span>
              <span>&middot;</span>
              <span>{result.totalRulesRun} rules</span>
            </div>
          </div>

          {/* ── Score + Stats ── */}
          <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-8">
            <motion.div variants={fadeUp} className="rounded-[var(--radius-xl)] p-6 flex flex-col items-center justify-center"
              style={{ background: "var(--bg-raised)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-md)" }}>
              <ScoreGauge score={score.overall} grade={score.grade} />
              <p className="text-xs text-center mt-3 max-w-[200px]" style={{ color: "var(--text-tertiary)" }}>
                {score.overall >= 90 ? "Excellent! Few issues found." : score.overall >= 70 ? "Good, but issues need attention." : score.overall >= 50 ? "Multiple issues found." : "Significant issues. Action needed."}
              </p>
            </motion.div>

            <div className="lg:col-span-3 space-y-4">
              <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                <StatCard value={issues.length} label="Total Issues" Icon={AlertTriangle} color="var(--severity-critical)" />
                <StatCard value={score.bySeverity.critical} label="Critical" Icon={XCircle} color="var(--severity-critical)" />
                <StatCard value={score.bySeverity.major} label="Major" Icon={AlertTriangle} color="var(--severity-major)" />
                <StatCard value={score.bySeverity.minor} label="Minor" Icon={AlertCircle} color="var(--severity-minor)" />
                <StatCard value={result.passedRules} label="Passed" Icon={CheckCircle2} color="var(--pass)" />
                <StatCard value={result.incompleteRules} label="Review" Icon={Eye} color="var(--incomplete)" />
              </motion.div>

              {/* Page meta */}
              <motion.div variants={fadeUp} className="rounded-[var(--radius-lg)] p-4"
                style={{ background: "var(--bg-raised)", border: "1px solid var(--border-default)" }}>
                <h3 className="text-xs font-semibold mb-3 flex items-center gap-1.5" style={{ color: "var(--text-primary)" }}>
                  <FileWarning size={13} aria-hidden="true" /> Page Analysis
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 text-center text-xs">
                  {[
                    { v: pageMeta.imageCount, l: "Images", c: "var(--text-primary)" },
                    { v: pageMeta.imagesWithoutAlt, l: "Missing Alt", c: pageMeta.imagesWithoutAlt > 0 ? "var(--severity-critical)" : "var(--pass)" },
                    { v: pageMeta.linkCount, l: "Links", c: "var(--text-primary)" },
                    { v: pageMeta.headingCount, l: "Headings", c: "var(--text-primary)" },
                  ].map((s) => (
                    <div key={s.l}><div className="text-lg font-bold" style={{ color: s.c }}>{s.v}</div><div style={{ color: "var(--text-tertiary)" }}>{s.l}</div></div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                  {[
                    { l: "Title", ok: pageMeta.title !== "(no title)", Icon: FileWarning },
                    { l: "Language", ok: pageMeta.lang !== "(not set)", Icon: Globe },
                    { l: "Has <h1>", ok: pageMeta.hasH1, Icon: ListChecks },
                    { l: "Skip link", ok: pageMeta.hasSkipLink, Icon: ArrowLeft },
                    { l: "A11y statement", ok: pageMeta.hasAccessibilityStatement, Icon: Shield },
                  ].map((c) => (
                    <div key={c.l} className="flex items-center gap-1.5">
                      {c.ok ? <CheckCircle2 size={12} style={{ color: "var(--pass)" }} aria-hidden="true" /> : <XCircle size={12} style={{ color: "var(--severity-critical)" }} aria-hidden="true" />}
                      <span style={{ color: "var(--text-secondary)" }}>{c.l}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* ── POUR ── */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vpOnce} className="rounded-[var(--radius-lg)] p-5 mb-8"
            style={{ background: "var(--bg-raised)", border: "1px solid var(--border-default)" }}>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-1.5" style={{ color: "var(--text-primary)" }}>
              <PieChart size={15} aria-hidden="true" /> POUR Principles
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(["perceivable", "operable", "understandable", "robust"] as const).map((p) => {
                const data = score.byPrinciple[p];
                const total = data.passed + data.failed;
                const pct = total > 0 ? Math.round((data.passed / total) * 100) : 100;
                const color = pct >= 90 ? "var(--pass)" : pct >= 70 ? "var(--severity-minor)" : "var(--severity-critical)";
                return (
                  <div key={p} className="text-center rounded-[var(--radius-md)] p-3" style={{ background: "var(--bg-overlay)" }}>
                    <div className="text-2xl font-bold" style={{ color }}>{pct}%</div>
                    <div className="text-xs capitalize font-medium" style={{ color: "var(--text-secondary)" }}>{p}</div>
                    <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{data.failed} issue{data.failed !== 1 ? "s" : ""}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ── Tabs ── */}
          <div role="tablist" aria-label="Results view" className="flex gap-1 p-1 rounded-[var(--radius-md)] mb-6 w-fit"
            style={{ background: "var(--bg-overlay)" }}>
            {([
              { key: "issues" as const, label: `Issues (${issues.length})`, Icon: AlertTriangle },
              { key: "compliance" as const, label: `Compliance (${compliance.length})`, Icon: Scale },
              { key: "passed" as const, label: `Passed (${result.passedRules})`, Icon: CheckCircle2 },
            ]).map((t) => (
              <button key={t.key} role="tab" aria-selected={activeTab === t.key} onClick={() => setActiveTab(t.key)}
                className="px-4 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5"
                style={{ background: activeTab === t.key ? "var(--bg-raised)" : "transparent", color: activeTab === t.key ? "var(--text-primary)" : "var(--text-tertiary)", boxShadow: activeTab === t.key ? "var(--shadow-sm)" : "none" }}>
                <t.Icon size={13} aria-hidden="true" /> {t.label}
              </button>
            ))}
          </div>

          {/* ── Issues ── */}
          {activeTab === "issues" && (
            <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-3">
              {issues.length > 0 ? issues.map((issue, i) => (
                <IssueCard key={issue.id} issue={issue} index={i} effort={effortMap[issue.ruleId] ?? defaultEffort} />
              )) : (
                <div className="rounded-[var(--radius-lg)] p-10 text-center" style={{ background: "var(--bg-raised)", border: "1px solid var(--border-default)" }}>
                  <CheckCircle2 size={36} className="mx-auto mb-3" style={{ color: "var(--pass)" }} aria-hidden="true" />
                  <p className="font-semibold text-lg" style={{ color: "var(--pass)" }}>No issues found</p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Automated tools detect ~30-40% of issues. Manual testing recommended.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Compliance ── */}
          {activeTab === "compliance" && (
            <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {compliance.map((cr) => {
                const pct = cr.percentage;
                const color = pct >= 90 ? "var(--pass)" : pct >= 70 ? "var(--severity-minor)" : pct >= 50 ? "var(--severity-major)" : "var(--severity-critical)";
                return (
                  <motion.div key={cr.framework.id} variants={fadeUp} className="rounded-[var(--radius-lg)] p-4"
                    style={{ background: "var(--bg-raised)", border: "1px solid var(--border-default)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Scale size={14} style={{ color }} aria-hidden="true" />
                        <div>
                          <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{cr.framework.shortName}</h4>
                          <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{cr.framework.region}</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold" style={{ color }}>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: "var(--border-default)" }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <div className="text-[10px] flex justify-between" style={{ color: "var(--text-tertiary)" }}>
                      <span className="flex items-center gap-1"><ShieldAlert size={9} aria-hidden="true" /> {cr.failedCount} failing</span>
                      <span>{cr.framework.penalties.slice(0, 35)}</span>
                    </div>
                    {cr.framework.deadlineAlert && (
                      <div className="mt-2 text-[10px] px-2 py-1 rounded flex items-center gap-1"
                        style={{ background: "var(--severity-critical-bg)", color: "var(--severity-critical)" }}>
                        <Clock size={10} aria-hidden="true" /> {cr.framework.deadlineAlert}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* ── Passed ── */}
          {activeTab === "passed" && (
            <div className="rounded-[var(--radius-lg)] p-6" style={{ background: "var(--bg-raised)", border: "1px solid var(--border-default)" }}>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={16} style={{ color: "var(--pass)" }} aria-hidden="true" />
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{result.passedRules} rules passed</span>
              </div>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{result.inapplicableRules} rules were not applicable to this page.</p>
            </div>
          )}

          {/* ── Disclaimer ── */}
          <div className="mt-10 rounded-[var(--radius-md)] p-4 text-[11px] leading-relaxed flex items-start gap-2"
            style={{ background: "var(--bg-overlay)", color: "var(--text-tertiary)" }}>
            <Info size={14} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p><b style={{ color: "var(--text-secondary)" }}>Disclaimer:</b> Automated testing detects approximately 30-40% of accessibility issues. This scan does not constitute a legal compliance assessment. For full conformance, manual testing by qualified experts is strongly recommended.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
