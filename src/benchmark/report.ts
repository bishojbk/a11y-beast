import type { BenchReport, BenchRun, ToolName } from "./types";

const TOOL_LABEL: Record<ToolName, string> = {
  beast: "A11y Beast",
  "axe-raw": "axe-core raw",
  pa11y: "Pa11y",
  lighthouse: "Lighthouse",
};

function pad(value: string | number, width: number): string {
  const s = String(value);
  return s.length >= width ? s : s + " ".repeat(width - s.length);
}

function fmtMs(ms: number): string {
  if (ms <= 0) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Markdown comparison matrix — one section per URL plus an aggregate table.
 * Designed so the same doc can back the marketing page and live in the repo
 * as a snapshot PRs can diff against.
 */
export function renderMarkdown(report: BenchReport): string {
  const { urls, tools, runs, timestamp } = report;
  const out: string[] = [];

  out.push(`# Accessibility scanner benchmark`);
  out.push("");
  out.push(`- **Generated:** ${timestamp}`);
  out.push(`- **URLs scanned:** ${urls.length}`);
  out.push(`- **Tools compared:** ${tools.map((t) => TOOL_LABEL[t]).join(", ")}`);
  out.push("");
  out.push("> Each tool runs in its own Chromium instance. Issues are collapsed by rule id — one row per rule, occurrences summed in the rightmost column of each per-URL section.");
  out.push("");

  // ── Aggregate table ──
  out.push(`## Aggregate`);
  out.push("");
  out.push(`| Tool | URLs OK | Unique rules (total) | Issues (total) | Avg duration | Legal mapping |`);
  out.push(`| --- | ---: | ---: | ---: | ---: | :---: |`);
  for (const tool of tools) {
    const toolRuns = runs.filter((r) => r.tool === tool);
    const okRuns = toolRuns.filter((r) => r.ok);
    const totalRules = okRuns.reduce((acc, r) => acc + r.uniqueRuleCount, 0);
    const totalIssues = okRuns.reduce((acc, r) => acc + r.issues.reduce((a, i) => a + i.occurrences, 0), 0);
    const avgMs = okRuns.length ? Math.round(okRuns.reduce((acc, r) => acc + r.durationMs, 0) / okRuns.length) : 0;
    const legal = toolRuns[0]?.legalMapping ?? false;
    out.push(`| ${TOOL_LABEL[tool]} | ${okRuns.length}/${toolRuns.length} | ${totalRules} | ${totalIssues} | ${fmtMs(avgMs)} | ${legal ? "✓" : "—"} |`);
  }
  out.push("");

  // ── Per-URL sections ──
  for (const url of urls) {
    out.push(`## ${url}`);
    out.push("");
    out.push(`| Tool | Status | Unique rules | Issues | Duration |`);
    out.push(`| --- | :---: | ---: | ---: | ---: |`);
    for (const tool of tools) {
      const run = runs.find((r) => r.tool === tool && r.url === url);
      if (!run) {
        out.push(`| ${TOOL_LABEL[tool]} | skipped | — | — | — |`);
        continue;
      }
      if (!run.ok) {
        out.push(`| ${TOOL_LABEL[tool]} | ❌ ${run.error ?? "error"} | — | — | ${fmtMs(run.durationMs)} |`);
        continue;
      }
      const occ = run.issues.reduce((a, i) => a + i.occurrences, 0);
      out.push(`| ${TOOL_LABEL[tool]} | ✓ | ${run.uniqueRuleCount} | ${occ} | ${fmtMs(run.durationMs)} |`);
    }
    out.push("");

    // Rule overlap across tools for this URL
    const okRuns = runs.filter((r) => r.url === url && r.ok);
    if (okRuns.length > 1) {
      const ruleToTools = new Map<string, Set<ToolName>>();
      for (const run of okRuns) {
        for (const i of run.issues) {
          const set = ruleToTools.get(i.ruleId) ?? new Set<ToolName>();
          set.add(run.tool);
          ruleToTools.set(i.ruleId, set);
        }
      }
      const shared = Array.from(ruleToTools.entries()).filter(([, set]) => set.size > 1);
      const beastOnly = Array.from(ruleToTools.entries()).filter(([, set]) => set.size === 1 && set.has("beast"));
      out.push(`- Rules surfaced by ≥2 tools: **${shared.length}**`);
      out.push(`- Rules surfaced only by A11y Beast: **${beastOnly.length}**${beastOnly.length > 0 ? ` (\`${beastOnly.slice(0, 5).map(([r]) => r).join("`, `")}\`${beastOnly.length > 5 ? ", …" : ""})` : ""}`);
      out.push("");
    }
  }

  return out.join("\n");
}

export function renderJson(report: BenchReport): string {
  return JSON.stringify(report, null, 2);
}

/**
 * Compact one-screen text table for the CLI's stdout once a run finishes —
 * same data the markdown uses, minus the per-URL breakdown.
 */
export function renderStdoutSummary(runs: BenchRun[], tools: ToolName[]): string {
  const cols = ["Tool", "OK", "Rules", "Issues", "Avg dur", "Legal"];
  const widths = [12, 8, 8, 10, 10, 7];
  const lines: string[] = [];
  lines.push(cols.map((c, i) => pad(c, widths[i])).join("  "));
  lines.push(widths.map((w) => "─".repeat(w)).join("  "));
  for (const tool of tools) {
    const toolRuns = runs.filter((r) => r.tool === tool);
    const ok = toolRuns.filter((r) => r.ok);
    const total = ok.reduce((a, r) => a + r.uniqueRuleCount, 0);
    const issues = ok.reduce((a, r) => a + r.issues.reduce((b, i) => b + i.occurrences, 0), 0);
    const avg = ok.length ? Math.round(ok.reduce((a, r) => a + r.durationMs, 0) / ok.length) : 0;
    const legal = toolRuns[0]?.legalMapping ? "yes" : "no";
    lines.push(
      [
        pad(TOOL_LABEL[tool], widths[0]),
        pad(`${ok.length}/${toolRuns.length}`, widths[1]),
        pad(total, widths[2]),
        pad(issues, widths[3]),
        pad(fmtMs(avg), widths[4]),
        pad(legal, widths[5]),
      ].join("  ")
    );
  }
  return lines.join("\n");
}
