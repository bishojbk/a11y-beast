"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import type { ScanStage } from "@/hooks/useAxeAnalysis";

const EASE = [0.22, 1, 0.36, 1] as const;

const STAGES: ReadonlyArray<{
  key: ScanStage;
  label: string;
  sub: string;
}> = [
  { key: "fetching", label: "Fetching document", sub: "Puppeteer · Chromium 143 · SSRF-guarded" },
  { key: "rendering", label: "Rendering the DOM", sub: "JavaScript executed · accessibility tree built" },
  { key: "analyzing", label: "Running 125+ rules", sub: "axe-core 4.11.2 · 20 custom checks" },
  { key: "scoring", label: "Mapping to 16 legal frameworks", sub: "WCAG basis · severity multipliers · deadlines" },
];

const LOG_LINES_BY_STAGE: Record<Exclude<ScanStage, "idle" | "done" | "error">, ReadonlyArray<{ tag: "ok" | "warn" | "err"; msg: string }>> = {
  fetching: [
    { tag: "ok", msg: "Puppeteer bootstrapped — Chromium 143" },
    { tag: "ok", msg: "SSRF guard passed — public IP, port 443, https" },
    { tag: "ok", msg: "Opening target page…" },
  ],
  rendering: [
    { tag: "ok", msg: "Response received — parsing document" },
    { tag: "ok", msg: "DOMContentLoaded — collecting accessibility tree" },
    { tag: "ok", msg: "Injecting axe-core 4.11.2" },
  ],
  analyzing: [
    { tag: "ok", msg: "105 axe rules queued" },
    { tag: "warn", msg: "Running color-contrast, image-alt, label…" },
    { tag: "ok", msg: "Custom checks — heading gaps, skip link, zoom lock" },
  ],
  crawling: [
    { tag: "ok", msg: "Reading robots.txt — honouring disallow rules" },
    { tag: "ok", msg: "Discovering same-origin pages…" },
    { tag: "warn", msg: "Scanning pages in parallel — this can take a moment" },
  ],
  scoring: [
    { tag: "ok", msg: "Mapping issues → 16 legal frameworks" },
    { tag: "ok", msg: "Computing per-framework scores…" },
    { tag: "ok", msg: "Preparing verdicts…" },
  ],
};

function fmtTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

interface LogEntry {
  t: string;
  tag: "ok" | "warn" | "err";
  msg: string;
}

export default function ScanningCard({
  target,
  stage,
  onCancel,
}: {
  target: string;
  stage: ScanStage;
  onCancel?: () => void;
}) {
  const [log, setLog] = useState<LogEntry[]>([]);
  const startRef = useRef<number | null>(null);
  const lastStageRef = useRef<ScanStage>("idle");

  // Push a batch of log lines whenever the stage transitions forward
  useEffect(() => {
    if (stage === "idle" || stage === "done" || stage === "error") return;
    if (stage === lastStageRef.current) return;
    lastStageRef.current = stage;
    if (startRef.current === null) startRef.current = performance.now();

    const batch = LOG_LINES_BY_STAGE[stage];
    if (!batch) return;

    let cancelled = false;
    batch.forEach((line, i) => {
      setTimeout(() => {
        if (cancelled) return;
        const t = fmtTime(performance.now() - (startRef.current ?? performance.now()));
        setLog((prev) => [...prev, { t, tag: line.tag, msg: line.msg }]);
      }, 120 + i * 360);
    });

    return () => {
      cancelled = true;
    };
  }, [stage]);

  // The crawl flow has no dedicated stepper row — surface it on the "analyzing"
  // step so the stepper shows mid-progress rather than jumping to complete.
  const effectiveStage: ScanStage = stage === "crawling" ? "analyzing" : stage;
  const activeIdx = STAGES.findIndex((s) => s.key === effectiveStage);
  const idxForUI = activeIdx === -1 ? STAGES.length : activeIdx;

  // The activity verb shown only on the *active* row. Done rows read "done" and
  // not-yet-started rows read "queued", so the status always matches the icon.
  const ACTIVE_LABEL: Partial<Record<ScanStage, string>> = {
    fetching: "fetching…",
    rendering: "parsing…",
    analyzing: "running…",
    scoring: "mapping…",
  };

  return (
    <div className="scanning-wrap">
      <motion.div
        className="scanning-card"
        role="status"
        aria-live="polite"
        aria-label="Scanning progress"
        initial={{ opacity: 0, y: 12, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="scanning-target">
          Scanning <b className="mono">{target || "your page"}</b>
        </div>
        <h2 className="scanning-title">
          {idxForUI < STAGES.length
            ? "This takes a moment. We do it properly."
            : "Scan complete. Preparing verdicts…"}
        </h2>

        <div className="stages">
          {STAGES.map((s, i) => {
            const state = i < idxForUI ? "done" : i === idxForUI ? "active" : "queued";
            const status =
              state === "done"
                ? "done"
                : state === "active"
                  ? stage === "crawling"
                    ? "crawling…"
                    : ACTIVE_LABEL[s.key] ?? "working…"
                  : "queued";
            return (
              <div key={s.key} className={`stage ${state}`}>
                <div className="stage-icon" aria-hidden="true">
                  {state === "done" ? (
                    <Check size={12} />
                  ) : state === "active" ? (
                    <Loader2 size={13} className="stage-spin" />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </div>
                <div className="stage-label">
                  {s.label}
                  <span className="sub">{s.sub}</span>
                </div>
                <div className={`stage-count mono ${state}`}>{status}</div>
              </div>
            );
          })}
        </div>

        <div className="scanning-log" aria-hidden="true">
          <AnimatePresence initial={false}>
            {log.map((l, i) => (
              <motion.span
                key={i}
                className="log-line"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.32, ease: EASE }}
              >
                <span className="t">[{l.t}]</span>
                {l.tag === "ok" && <span className="tag-ok">OK</span>}
                {l.tag === "warn" && <span className="tag-warn">WARN</span>}
                {l.tag === "err" && <span className="tag-err">ERR</span>}
                {l.msg}
              </motion.span>
            ))}
          </AnimatePresence>
          <span className="log-cursor" aria-hidden="true">▋</span>
        </div>

        <div className="scanning-footer">
          <span>Real scan · not legal advice</span>
          {onCancel && (
            <button type="button" className="btn-ghost" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
