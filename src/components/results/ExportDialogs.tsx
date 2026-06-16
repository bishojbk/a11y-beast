"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Download, X } from "lucide-react";
import type { ScanResult } from "@/lib/types/scan-result";
import type { ComplianceResult } from "@/lib/types/compliance";
import { getEffort, type EffortLevel } from "@/lib/analyzer/effort";
import { getFrameworkById } from "@/lib/compliance/frameworks";
import { computeConformance } from "@/lib/compliance/wcag-criteria";

const DIALOG_EASE = [0.22, 1, 0.36, 1] as const;

/* ═══════════════════════════════════════════════════════════════
   Shared modal shell
   ═══════════════════════════════════════════════════════════════ */
function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: DIALOG_EASE }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.62)",
            backdropFilter: "blur(6px)",
            display: "grid",
            placeItems: "center",
            padding: 24,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.32, ease: DIALOG_EASE }}
            style={{
              width: "min(720px, 100%)",
              maxHeight: "calc(100vh - 48px)",
              display: "flex",
              flexDirection: "column",
              background: "var(--bg-raised)",
              border: "1px solid var(--border-strong)",
              borderRadius: 8,
              boxShadow: "0 40px 120px rgba(0,0,0,0.55)",
              overflow: "hidden",
            }}
          >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px",
            borderBottom: "1px solid var(--border-default)",
            gap: 12,
          }}
        >
          <span
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
            }}
          >
            {title}
          </span>
          <button
            ref={closeRef}
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div style={{ padding: 18, overflow: "auto" }}>{children}</div>

        {footer && (
          <div
            style={{
              padding: "12px 18px",
              borderTop: "1px solid var(--border-default)",
              background: "var(--bg-overlay)",
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {footer}
          </div>
        )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GitHub Action dialog — shows a copyable workflow YAML
   ═══════════════════════════════════════════════════════════════ */
function buildWorkflowYaml(targetUrl: string, threshold: number): string {
  return `name: Accessibility check
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      # Scan the target URL with A11y Beast CLI.
      # Exits with code 1 if the overall score drops below the threshold,
      # which fails the workflow run.
      - name: A11y Beast scan
        run: |
          npx -y accesslens scan "${targetUrl}" \\
            --threshold ${threshold} \\
            --format json \\
            --output a11y-report.json
        env:
          # Set ANTHROPIC_API_KEY to also generate AI fix suggestions
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}

      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: a11y-report
          path: a11y-report.json
`;
}

export function GithubActionDialog({
  open,
  onClose,
  targetUrl,
  currentScore,
}: {
  open: boolean;
  onClose: () => void;
  targetUrl: string;
  currentScore: number;
}) {
  const [threshold, setThreshold] = useState<number>(Math.max(60, Math.min(95, currentScore)));
  const [copied, setCopied] = useState(false);

  const yaml = buildWorkflowYaml(targetUrl || "https://your-site.com", threshold);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }, [yaml]);

  const download = useCallback(() => {
    const blob = new Blob([yaml], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "a11y-beast.yml";
    a.click();
    URL.revokeObjectURL(url);
  }, [yaml]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="GitHub Action · .github/workflows/a11y-beast.yml"
      footer={
        <>
          <button type="button" className="btn" onClick={download}>
            <Download size={13} aria-hidden="true" /> Download .yml
          </button>
          <button type="button" className="btn primary" onClick={copy}>
            {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
            {copied ? "Copied" : "Copy workflow"}
          </button>
        </>
      }
    >
      <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 14, lineHeight: 1.55 }}>
        Drop this into <span className="mono" style={{ color: "var(--text-primary)" }}>.github/workflows/a11y-beast.yml</span>.
        It runs the{" "}
        <span className="mono" style={{ color: "var(--accent-text)" }}>accesslens</span>{" "}
        CLI on every PR and push to <span className="mono">main</span>, and fails the build if your score drops below
        the threshold. Report is uploaded as a workflow artifact.
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <label htmlFor="threshold-input" className="mono" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
          Fail threshold
        </label>
        <input
          id="threshold-input"
          type="number"
          min={0}
          max={100}
          value={threshold}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            if (!Number.isNaN(n)) setThreshold(Math.max(0, Math.min(100, n)));
          }}
          className="mono"
          style={{
            width: 68,
            background: "var(--bg-input)",
            border: "1px solid var(--border-strong)",
            borderRadius: 6,
            padding: "4px 8px",
            color: "var(--text-primary)",
            fontSize: 13,
          }}
        />
        <span className="mono" style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
          · current score {currentScore}
        </span>
      </div>

      <pre
        className="mono"
        style={{
          background: "var(--bg-code)",
          border: "1px solid var(--border-default)",
          borderRadius: 8,
          padding: 14,
          fontSize: 12.5,
          lineHeight: 1.5,
          color: "var(--text-primary)",
          overflow: "auto",
          margin: 0,
          maxHeight: 340,
        }}
      >
        {yaml}
      </pre>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Markdown report generator
   ═══════════════════════════════════════════════════════════════ */
function escapeMdTableCell(s: string): string {
  return s.replace(/\|/g, "\\|").replace(/\n/g, " ").slice(0, 140);
}

export function buildMarkdownReport(
  result: ScanResult,
  compliance: ComplianceResult[],
  aiFixes: Record<string, string>
): string {
  const { url, scanDurationMs, timestamp, totalRulesRun, passedRules, score, issues, pageMeta } = result;

  const lines: string[] = [];
  lines.push(`# A11y Beast scan — ${url}`);
  lines.push("");
  lines.push(`> Scanned ${new Date(timestamp).toISOString()} · ${(scanDurationMs / 1000).toFixed(2)}s · ${totalRulesRun} rules run · ${passedRules} passed · **${issues.length} issues**`);
  lines.push("");
  lines.push(`**Score: ${score.overall} / 100 · Grade ${score.grade}**`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("| --- | --- |");
  lines.push(`| Critical | ${score.bySeverity.critical ?? 0} |`);
  lines.push(`| Major | ${score.bySeverity.major ?? 0} |`);
  lines.push(`| Minor | ${score.bySeverity.minor ?? 0} |`);
  lines.push(`| Best practice | ${score.bySeverity["best-practice"] ?? 0} |`);
  lines.push(`| Has skip link | ${pageMeta.hasSkipLink ? "yes" : "no"} |`);
  lines.push(`| Has accessibility statement | ${pageMeta.hasAccessibilityStatement ? "yes" : "no"} |`);
  lines.push(`| &lt;html lang&gt; | ${pageMeta.lang || "(not set)"} |`);
  lines.push("");

  lines.push("## Compliance by framework");
  lines.push("");
  lines.push("| Framework | Region | WCAG basis | Score | Failing rules |");
  lines.push("| --- | --- | --- | ---: | ---: |");
  for (const cr of compliance) {
    const f = cr.framework;
    lines.push(
      `| ${escapeMdTableCell(f.name)} | ${escapeMdTableCell(f.region)} | ${f.wcagBasis} | ${cr.percentage}% | ${cr.failedCount} |`
    );
  }
  lines.push("");

  // POUR
  lines.push("## POUR breakdown");
  lines.push("");
  lines.push("| Principle | Passed | Failed |");
  lines.push("| --- | ---: | ---: |");
  for (const p of ["perceivable", "operable", "understandable", "robust"] as const) {
    const d = score.byPrinciple[p];
    lines.push(`| ${p[0].toUpperCase() + p.slice(1)} | ${d.passed} | ${d.failed} |`);
  }
  lines.push("");

  // Issues grouped by rule
  const byRule = new Map<string, { issue: typeof issues[number]; count: number }>();
  for (const i of issues) {
    const existing = byRule.get(i.ruleId);
    if (!existing) byRule.set(i.ruleId, { issue: i, count: 1 });
    else existing.count += 1;
  }
  const sorted = Array.from(byRule.values()).sort((a, b) => {
    const order = { critical: 0, major: 1, minor: 2, "best-practice": 3 } as const;
    if (order[a.issue.severity] !== order[b.issue.severity]) return order[a.issue.severity] - order[b.issue.severity];
    return b.count - a.count;
  });

  lines.push(`## Issues (${sorted.length} unique rules, ${issues.length} occurrences)`);
  lines.push("");

  for (const { issue, count } of sorted) {
    const sev = issue.severity.toUpperCase();
    lines.push(`### [${sev}] ${issue.fixSuggestion || issue.ruleId}`);
    lines.push("");
    const meta: string[] = [];
    if (issue.wcagCriterion) meta.push(`WCAG ${issue.wcagCriterion.number} ${issue.wcagCriterion.level}`);
    meta.push(`rule: \`${issue.ruleId}\``);
    meta.push(`${count} ${count === 1 ? "occurrence" : "occurrences"}`);
    if (issue.impact.length) meta.push(`affects: ${issue.impact.join(", ")}`);
    if (issue.applicableFrameworks.length) meta.push(`applicable: ${issue.applicableFrameworks.slice(0, 8).join(", ")}`);
    lines.push(`> ${meta.join(" · ")}`);
    lines.push("");
    lines.push(issue.description);
    lines.push("");
    if (issue.element.selector) {
      lines.push(`**Selector:** \`${issue.element.selector}\``);
      lines.push("");
    }
    if (issue.element.html) {
      lines.push("```html");
      lines.push(issue.element.html);
      lines.push("```");
      lines.push("");
    }
    const fix = aiFixes[issue.id];
    if (fix) {
      lines.push("**Suggested fix:**");
      lines.push("");
      lines.push("```html");
      lines.push(fix);
      lines.push("```");
      lines.push("");
    }
    if (issue.whyItMatters) {
      lines.push(`_${issue.whyItMatters.slice(0, 400)}_`);
      lines.push("");
    }
    lines.push("---");
    lines.push("");
  }

  lines.push("");
  lines.push(
    "> Generated by [A11y Beast](https://github.com/bishojbk/a11y-beast). Automated testing catches ~30–40% of WCAG issues. Not legal advice — pair with a manual audit."
  );
  lines.push("");
  return lines.join("\n");
}

/* ═══════════════════════════════════════════════════════════════
   Per-jurisdiction legal report generator
   ═══════════════════════════════════════════════════════════════ */
function riskBand(pct: number): string {
  if (pct >= 90) return "Low";
  if (pct >= 75) return "Moderate";
  if (pct >= 50) return "High";
  return "Severe";
}

export function buildLegalReport(result: ScanResult, cr: ComplianceResult): string {
  const { url, timestamp, issues, pageMeta } = result;
  const f = cr.framework;
  const mapped = issues.filter((i) => i.applicableFrameworks.includes(f.id));

  // Group mapped issues by rule, tally occurrences, attach effort
  const byRule = new Map<string, { issue: typeof issues[number]; count: number }>();
  for (const i of mapped) {
    const existing = byRule.get(i.ruleId);
    if (!existing) byRule.set(i.ruleId, { issue: i, count: 1 });
    else existing.count += 1;
  }
  const sorted = Array.from(byRule.values()).sort((a, b) => {
    const order = { critical: 0, major: 1, minor: 2, "best-practice": 3 } as const;
    if (order[a.issue.severity] !== order[b.issue.severity]) return order[a.issue.severity] - order[b.issue.severity];
    return b.count - a.count;
  });

  const lines: string[] = [];
  lines.push(`# ${f.name} — accessibility compliance report`);
  lines.push("");
  lines.push(`**Site:** ${url}`);
  lines.push(`**Scanned:** ${new Date(timestamp).toISOString()} · A11y Beast automated scan`);
  lines.push(`**Jurisdiction:** ${f.region} · **Standard:** ${f.wcagBasis} · **Applies to:** ${f.appliesTo === "both" ? "public & private sector" : `${f.appliesTo} sector`}`);
  lines.push("");

  lines.push("## Executive summary");
  lines.push("");
  lines.push(`- **Automated-coverage indicator: ${cr.percentage}%** (${riskBand(cr.percentage)} risk signal) — an automated triage indicator against ${f.wcagBasis}, **not** a WCAG conformance determination.`);
  lines.push(`- ${cr.passedCount} of ${cr.totalApplicable} applicable automated rules passed · ${cr.failedCount} failing rules · ${mapped.length} violation occurrences mapped to ${f.shortName}`);
  lines.push(`- WCAG conformance is assessed pass/fail per success criterion; this report covers only the ~30–40% of criteria that automated testing can evaluate.`);
  lines.push(`- **Enforcement context:** ${f.penalties}`);
  if (f.enforcementDate) {
    lines.push(`- **Enforcement date:** ${new Date(f.enforcementDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}${f.deadlineAlert ? ` — ${f.deadlineAlert}` : ""}`);
  }
  lines.push("");

  // Framework-specific signals
  const signals: string[] = [];
  if (f.id === "eaa" || f.id === "en-301-549" || f.id === "eu-wad" || f.id === "equality-act-2010") {
    signals.push(
      pageMeta.hasAccessibilityStatement
        ? "Accessibility statement: **detected**."
        : "Accessibility statement: **not detected** — this framework expects a published accessibility statement; its absence is penalised in the score above."
    );
  }
  if (f.id === "california-unruh") {
    signals.push(
      `Per-visit statutory exposure: **${mapped.length} violation occurrences × $4,000 statutory minimum = $${(mapped.length * 4000).toLocaleString("en-US")} per affected visit** if each barrier is counted separately. Courts vary in how violations are counted; treat as a reference point, not a prediction.`
    );
  }
  if (!pageMeta.hasSkipLink) signals.push("Skip-navigation link: not detected.");
  if (!pageMeta.lang) signals.push("`<html lang>` attribute: not set.");
  if (signals.length) {
    lines.push("## Framework-specific signals");
    lines.push("");
    for (const s of signals) lines.push(`- ${s}`);
    lines.push("");
  }

  // Per-success-criterion conformance — the audit-grade view.
  const fwFull = getFrameworkById(f.id);
  if (fwFull) {
    const conf = computeConformance(fwFull, issues, result.passedRuleTags);
    lines.push(`## Conformance by success criterion (${conf.target})`);
    lines.push("");
    lines.push(
      `Failed: **${conf.fail}** · Needs manual review: **${conf.needsReview}** · Passed (automated): **${conf.pass}** · ` +
        `Not tested by automation: **${conf.notTested}** · Applicable criteria: **${conf.total}**`
    );
    lines.push("");
    lines.push("WCAG conformance is pass/fail per success criterion. \"Not tested\" criteria require manual review — automation cannot evaluate them.");
    lines.push("");
    const failed = conf.criteria.filter((c) => c.status === "fail");
    if (failed.length) {
      lines.push("**Failed criteria:**");
      lines.push("");
      for (const c of failed) lines.push(`- ${c.number} ${c.name} (Level ${c.level}) — ${c.failCount} occurrence${c.failCount === 1 ? "" : "s"}`);
      lines.push("");
    }
    const nr = conf.criteria.filter((c) => c.status === "needs-review");
    if (nr.length) {
      lines.push("**Needs manual review:**");
      lines.push("");
      for (const c of nr) lines.push(`- ${c.number} ${c.name} (Level ${c.level})`);
      lines.push("");
    }
  }

  lines.push(`## Findings mapped to ${f.shortName}`);
  lines.push("");
  if (sorted.length === 0) {
    lines.push("No automated findings map to this framework. Manual review is still required for full coverage.");
    lines.push("");
  } else {
    lines.push("| Severity | Rule | WCAG | Occurrences | Est. effort |");
    lines.push("| --- | --- | --- | ---: | --- |");
    for (const { issue, count } of sorted) {
      const eff = getEffort(issue.ruleId);
      const wcag = issue.wcagCriterion ? `${issue.wcagCriterion.number} ${issue.wcagCriterion.level}` : "—";
      lines.push(`| ${issue.severity} | \`${issue.ruleId}\` — ${escapeMdTableCell(issue.fixSuggestion || issue.description)} | ${wcag} | ${count} | ${eff.label} (${eff.estimate}) |`);
    }
    lines.push("");
  }

  // Remediation plan grouped by effort
  const phases: Array<{ level: EffortLevel; title: string }> = [
    { level: "quick-fix", title: "Phase 1 — quick fixes (minutes each)" },
    { level: "medium", title: "Phase 2 — structural fixes (15–60 min each)" },
    { level: "refactor", title: "Phase 3 — refactors (1–4 h each)" },
  ];
  lines.push("## Remediation plan");
  lines.push("");
  for (const phase of phases) {
    const items = sorted.filter(({ issue }) => getEffort(issue.ruleId).level === phase.level);
    if (!items.length) continue;
    lines.push(`### ${phase.title}`);
    lines.push("");
    for (const { issue, count } of items) {
      lines.push(`- \`${issue.ruleId}\` (${count} ${count === 1 ? "occurrence" : "occurrences"}): ${issue.fixSuggestion || issue.description}`);
    }
    lines.push("");
  }

  lines.push("## Method & limitations");
  lines.push("");
  lines.push(
    "Findings come from an automated scan (axe-core + 20 custom checks) of a real browser render of a single page. " +
      `WCAG conformance is assessed pass/fail per success criterion against ${f.wcagBasis} (the version ${f.shortName} legally cites), and W3C defines no single-number conformance metric. ` +
      "Automated testing evaluates only ~30–40% of WCAG criteria; the remainder require manual expert review, and a single automated scan cannot establish conformance for a page — let alone an entire site (W3C WCAG-EM). " +
      "The coverage percentage here is an automated triage indicator, **not** a conformance determination. Actual exposure depends on jurisdiction, entity type and size, applicable exemptions, timing, and case facts. " +
      "Damage and penalty figures are historical or statutory reference points, not predictions."
  );
  if (f.id === "eaa") {
    lines.push("");
    lines.push("EAA penalties are set independently by each EU member state; consult the transposition law of each state where you operate.");
  }
  lines.push("");
  lines.push(`This report is not legal advice. Consult counsel before acting on it. Framework reference: ${f.url}`);
  lines.push("");
  return lines.join("\n");
}

export function LegalReportDialog({
  open,
  onClose,
  result,
  compliance,
}: {
  open: boolean;
  onClose: () => void;
  result: ScanResult;
  compliance: ComplianceResult[];
}) {
  const [copied, setCopied] = useState(false);
  const sorted = useMemo(() => [...compliance].sort((a, b) => a.percentage - b.percentage), [compliance]);
  const [fwId, setFwId] = useState<string | null>(null);
  const selected = sorted.find((c) => c.framework.id === fwId) ?? sorted[0];
  const markdown = open && selected ? buildLegalReport(result, selected) : "";

  const filename = useCallback(
    (ext: string) => {
      const host = (() => {
        try {
          return new URL(result.url).host.replace(/[^\w.-]+/g, "_");
        } catch {
          return "site";
        }
      })();
      const date = new Date(result.timestamp).toISOString().slice(0, 10);
      return `a11y-beast-${selected?.framework.id ?? "legal"}-${host}-${date}.${ext}`;
    },
    [result, selected]
  );

  const download = useCallback(() => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename("md");
    a.click();
    URL.revokeObjectURL(a.href);
  }, [markdown, filename]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }, [markdown]);

  const preview = markdown.slice(0, 3000);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Legal report · per jurisdiction"
      footer={
        <>
          <button type="button" className="btn" onClick={copy}>
            {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
            {copied ? "Copied" : "Copy markdown"}
          </button>
          <button type="button" className="btn primary" onClick={download}>
            <Download size={13} aria-hidden="true" /> Download .md
          </button>
        </>
      }
    >
      <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 14, lineHeight: 1.55 }}>
        A jurisdiction-specific report for your legal or compliance team: executive summary, every finding mapped to
        the selected framework, a phased remediation plan, and the method &amp; limitations language counsel will ask
        for. Pick the framework you&rsquo;re answering to.
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <label
          htmlFor="legal-fw-select"
          className="mono"
          style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}
        >
          Framework
        </label>
        <select
          id="legal-fw-select"
          value={selected?.framework.id ?? ""}
          onChange={(e) => setFwId(e.target.value)}
          className="mono"
          style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border-strong)",
            borderRadius: 6,
            padding: "5px 8px",
            color: "var(--text-primary)",
            fontSize: 13,
            maxWidth: "100%",
          }}
        >
          {sorted.map((c) => (
            <option key={c.framework.id} value={c.framework.id}>
              {c.framework.shortName} · {c.framework.region} · {c.percentage}%
            </option>
          ))}
        </select>
        {selected && (
          <span className="mono" style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
            · {riskBand(selected.percentage)} risk
          </span>
        )}
      </div>

      <pre
        className="mono"
        style={{
          background: "var(--bg-code)",
          border: "1px solid var(--border-default)",
          borderRadius: 8,
          padding: 14,
          fontSize: 12,
          lineHeight: 1.55,
          color: "var(--text-secondary)",
          overflow: "auto",
          margin: 0,
          maxHeight: 360,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {preview}
        {markdown.length > preview.length && "\n\n…"}
      </pre>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Download report dialog
   ═══════════════════════════════════════════════════════════════ */
export function DownloadReportDialog({
  open,
  onClose,
  result,
  compliance,
  aiFixes,
}: {
  open: boolean;
  onClose: () => void;
  result: ScanResult;
  compliance: ComplianceResult[];
  aiFixes: Record<string, string>;
}) {
  const [copied, setCopied] = useState(false);
  const markdown = open ? buildMarkdownReport(result, compliance, aiFixes) : "";

  const download = useCallback(() => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const host = (() => {
      try {
        return new URL(result.url).host.replace(/[^\w.-]+/g, "_");
      } catch {
        return "site";
      }
    })();
    const date = new Date(result.timestamp).toISOString().slice(0, 10);
    a.download = `a11y-beast-${host}-${date}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [markdown, result]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }, [markdown]);

  const downloadJson = useCallback(() => {
    const json = JSON.stringify(result, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const host = (() => {
      try {
        return new URL(result.url).host.replace(/[^\w.-]+/g, "_");
      } catch {
        return "site";
      }
    })();
    const date = new Date(result.timestamp).toISOString().slice(0, 10);
    a.download = `a11y-beast-${host}-${date}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [result]);

  const preview = markdown.slice(0, 3000);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Download report · PR-ready markdown"
      footer={
        <>
          <button type="button" className="btn" onClick={downloadJson}>
            <Download size={13} aria-hidden="true" /> JSON
          </button>
          <button type="button" className="btn" onClick={copy}>
            {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
            {copied ? "Copied" : "Copy markdown"}
          </button>
          <button type="button" className="btn primary" onClick={download}>
            <Download size={13} aria-hidden="true" /> Download .md
          </button>
        </>
      }
    >
      <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 14, lineHeight: 1.55 }}>
        Generates a markdown report grouping every issue by rule, with severity, affected disability groups, WCAG
        criterion, failing selector/HTML, and any AI fixes you&rsquo;ve requested. Paste it into a PR description, a
        Linear ticket, or a Notion doc.
      </p>
      <pre
        className="mono"
        style={{
          background: "var(--bg-code)",
          border: "1px solid var(--border-default)",
          borderRadius: 8,
          padding: 14,
          fontSize: 12,
          lineHeight: 1.55,
          color: "var(--text-secondary)",
          overflow: "auto",
          margin: 0,
          maxHeight: 360,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {preview}
        {markdown.length > preview.length && "\n\n…"}
      </pre>
    </Modal>
  );
}
