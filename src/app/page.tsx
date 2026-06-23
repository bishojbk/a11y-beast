"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Code2, GitCompare, Globe, Trash2, Upload, XCircle } from "lucide-react";
import { loadHistory, clearHistory, type ScanHistoryEntry } from "@/lib/history";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { useAxeAnalysis } from "@/hooks/useAxeAnalysis";
import { FRAMEWORKS, getFrameworkDescription, type FrameworkWithTags } from "@/lib/compliance/frameworks";
import { computeConformance } from "@/lib/compliance/wcag-criteria";
import ScanningCard from "@/components/scanner/ScanningCard";
import JsonLd from "@/components/JsonLd";
import { organizationLd, softwareApplicationLd, howToLd } from "@/lib/seo/structured-data";
import { track } from "@/lib/analytics";

/* Shared motion primitives — restrained, ease-out-expo, no springs */
const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const inView = { once: true, amount: 0.15 } as const;

/* ═══════════════════════════════════════════════════════════════
   Static data — lawsuit ticker + HOW_STEPS
   (curated, not live — see handoff §data.js)
   ═══════════════════════════════════════════════════════════════ */
const LAWSUITS: ReadonlyArray<{ date: string; tag: string; msg: string }> = [
  { date: "2025.11.18", tag: "ADA III", msg: "S.D.N.Y · Hospitality co. sued for inaccessible booking flow" },
  { date: "2025.11.14", tag: "Unruh", msg: "California class action · $4M settlement, retail e-comm" },
  { date: "2025.11.09", tag: "EAA", msg: "Austria — BKS Bank fined for non-compliant online banking" },
  { date: "2025.11.03", tag: "ADA III", msg: "C.D. Cal · fitness platform settles for $1.2M, remediation" },
  { date: "2025.10.28", tag: "UK EA", msg: "EHRC compliance notice issued to national retailer" },
  { date: "2025.10.21", tag: "ADA III", msg: "E.D.N.Y · 142-plaintiff serial filer, university sites" },
  { date: "2025.10.14", tag: "AODA", msg: "Ontario — CAD $110K/day penalty affirmed on appeal" },
  { date: "2025.10.08", tag: "EAA", msg: "Germany — BFSG enforcement action, fintech onboarding" },
  { date: "2025.09.30", tag: "Sec 508", msg: "GSA procurement disqualification, federal vendor" },
  { date: "2025.09.22", tag: "Unruh", msg: "San Francisco · per-visit damages affirmed" },
  { date: "2025.09.15", tag: "SI 5568", msg: "Israel — ILS 150K fine, second-offense news publisher" },
  { date: "2025.09.03", tag: "ADA III", msg: "S.D. Fla · hotel reservation system, $85K settlement" },
];

const HOW_STEPS = [
  {
    idx: "01",
    tag: "Fetch",
    title: "Fetch the page",
    desc: "Puppeteer pulls a real browser render — SPAs, JS-gated content and all. SSRF-guarded, private IPs blocked.",
  },
  {
    idx: "02",
    tag: "Render",
    title: "Render the DOM",
    desc: "Full document, computed styles, role tree, focus order. No static parsing shortcuts — what users actually see.",
  },
  {
    idx: "03",
    tag: "Analyse",
    title: "Run 125+ rules",
    desc: "axe-core's 105 rules plus 20 custom checks axe-core doesn't catch: heading gaps, small text, suspicious alt, zoom-lock.",
  },
  {
    idx: "04",
    tag: "Map",
    title: "Map to 16 laws",
    desc: "Every finding scored against jurisdiction WCAG scope, severity multiplier, deadline exposure. One scan, 16 verdicts.",
  },
];

const SAMPLES = ["shopify.com", "hermes.com", "ticketmaster.com", "stripe.com"];

/* ═══════════════════════════════════════════════════════════════
   Framework → flag + risk (derived from the real FRAMEWORKS list)
   ═══════════════════════════════════════════════════════════════ */
function flagFor(fw: FrameworkWithTags): string {
  const r = fw.region.toLowerCase();
  if (r.includes("california")) return "CA";
  if (r.includes("usa") || r.includes("federal")) return "US";
  if (r.includes("ontario") || r.includes("canada")) return "CA";
  if (r.includes("eu")) return "EU";
  if (r.includes("united kingdom") || r.includes("uk")) return "UK";
  if (r.includes("australia")) return "AU";
  if (r.includes("japan")) return "JP";
  if (r.includes("india")) return "IN";
  if (r.includes("korea")) return "KR";
  if (r.includes("new zealand")) return "NZ";
  if (r.includes("israel")) return "IL";
  return "—";
}

function riskFor(fw: FrameworkWithTags): "high" | "med" | "low" {
  const mult = fw.bonusPenalties.severityMultiplier ?? 1;
  if (fw.bonusPenalties.elementCountWeight && fw.bonusPenalties.elementCountWeight > 0) return "high";
  if (mult >= 1.2) return "high";
  if (mult >= 1.0) return "med";
  return "low";
}

const FLAG_STYLES: Record<string, { bg: string; fg: string }> = {
  US: { bg: "#1a2547", fg: "#E8EAF2" },
  CA: { bg: "#3a1f20", fg: "#E8D4D4" },
  EU: { bg: "#1a2b4a", fg: "#F0D96A" },
  UK: { bg: "#1e2747", fg: "#E8EAF2" },
  AU: { bg: "#1a2747", fg: "#E8EAF2" },
  JP: { bg: "#2c1417", fg: "#E8D4D4" },
  IN: { bg: "#33260f", fg: "#F0C87A" },
  KR: { bg: "#1b2a3f", fg: "#E8EAF2" },
  NZ: { bg: "#1a2747", fg: "#E8EAF2" },
  IL: { bg: "#1a2a3f", fg: "#E8EAF2" },
};

function Flag({ code }: { code: string }) {
  const c = FLAG_STYLES[code] ?? { bg: "var(--bg-overlay)", fg: "var(--text-secondary)" };
  return (
    <span className="flag-mono" style={{ background: c.bg, color: c.fg }} aria-hidden="true">
      {code}
    </span>
  );
}

function formatDeadline(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ═══════════════════════════════════════════════════════════════
   Scanner — 3-tab (URL / paste HTML / upload)
   ═══════════════════════════════════════════════════════════════ */
type Tab = "url" | "paste" | "upload";

const PAGE_OPTIONS = [3, 5, 8, 12] as const;

function Scanner({
  onScanUrl,
  onCrawlUrl,
  onAnalyzeHtml,
  isScanning,
}: {
  onScanUrl: (url: string) => void;
  onCrawlUrl: (url: string, maxPages: number) => void;
  onAnalyzeHtml: (html: string, name: string, method: "paste" | "upload") => void;
  isScanning: boolean;
}) {
  const [tab, setTab] = useState<Tab>("url");
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [crawl, setCrawl] = useState(false);
  const [maxPages, setMaxPages] = useState<number>(5);
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      if (crawl) onCrawlUrl(normalized, maxPages);
      else onScanUrl(normalized);
    },
    [onScanUrl, onCrawlUrl, crawl, maxPages]
  );

  return (
    <section className="scanner" aria-label="Scan a website">
      <div role="tablist" aria-label="Input method" className="scanner-tabs">
        <button
          role="tab"
          id="tab-url"
          aria-selected={tab === "url"}
          aria-controls="panel-url"
          tabIndex={tab === "url" ? 0 : -1}
          className="scanner-tab"
          onClick={() => setTab("url")}
          disabled={isScanning}
        >
          <Globe size={14} aria-hidden="true" /> URL
        </button>
        <button
          role="tab"
          id="tab-paste"
          aria-selected={tab === "paste"}
          aria-controls="panel-paste"
          tabIndex={tab === "paste" ? 0 : -1}
          className="scanner-tab"
          onClick={() => setTab("paste")}
          disabled={isScanning}
        >
          <Code2 size={14} aria-hidden="true" /> Paste HTML
        </button>
        <button
          role="tab"
          id="tab-upload"
          aria-selected={tab === "upload"}
          aria-controls="panel-upload"
          tabIndex={tab === "upload" ? 0 : -1}
          className="scanner-tab"
          onClick={() => setTab("upload")}
          disabled={isScanning}
        >
          <Upload size={14} aria-hidden="true" /> Upload file
        </button>
      </div>

      <div className="scanner-body">
        {tab === "url" && (
          <div role="tabpanel" id="panel-url" aria-labelledby="tab-url">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(url);
              }}
            >
              <div className="url-row">
                <div className="url-field">
                  <span className="scheme" aria-hidden="true">https://</span>
                  <label htmlFor="scan-url" className="sr-only">
                    Website URL
                  </label>
                  <input
                    id="scan-url"
                    type="text"
                    inputMode="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="yoursite.com"
                    spellCheck={false}
                    autoComplete="url"
                    disabled={isScanning}
                  />
                </div>
                <button type="submit" className="btn-scan" disabled={isScanning || !url.trim()}>
                  {crawl ? "Scan whole site" : "Scan for legal risk"} <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 12,
                  flexWrap: "wrap",
                }}
              >
                <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={crawl}
                    onChange={(e) => setCrawl(e.target.checked)}
                    disabled={isScanning}
                  />
                  Scan the whole site (crawl)
                </label>
                {crawl && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <label htmlFor="max-pages" className="mono" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
                      Up to
                    </label>
                    <select
                      id="max-pages"
                      value={maxPages}
                      onChange={(e) => setMaxPages(Number(e.target.value))}
                      disabled={isScanning}
                      className="mono"
                      style={{ background: "var(--bg-input)", border: "1px solid var(--border-strong)", borderRadius: 6, padding: "3px 6px", color: "var(--text-primary)", fontSize: 12 }}
                    >
                      {PAGE_OPTIONS.map((n) => (
                        <option key={n} value={n}>{n} pages</option>
                      ))}
                    </select>
                    <span className="mono" style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
                      · same-origin, robots-aware
                    </span>
                  </span>
                )}
              </div>
            </form>
            <div className="sample-row">
              <span className="label">Try:</span>
              {SAMPLES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="chip"
                  onClick={() => {
                    setUrl(s);
                    submit(s);
                  }}
                  disabled={isScanning}
                >
                  {s}
                </button>
              ))}
              <Link href="/results?sample=1" className="sample-link">
                or see a sample report <ArrowRight size={12} aria-hidden="true" />
              </Link>
            </div>
            <p className="scanner-trust mono">
              Free · no signup · your HTML never leaves your browser on paste/upload
            </p>
          </div>
        )}

        {tab === "paste" && (
          <div role="tabpanel" id="panel-paste" aria-labelledby="tab-paste" className="html-paste">
            <label htmlFor="html-paste" className="sr-only">
              HTML to analyse
            </label>
            <textarea
              id="html-paste"
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder={'<!doctype html>\n<html>\n  <head><title>Paste your document</title></head>\n  <body>...</body>\n</html>'}
              disabled={isScanning}
              spellCheck={false}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 12,
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <span
                className="mono"
                style={{ fontSize: 11, color: "var(--text-tertiary)", letterSpacing: "0.08em", textTransform: "uppercase" }}
              >
                Analysed in-browser · 0 bytes sent to server
              </span>
              <button
                type="button"
                className="btn-scan"
                disabled={isScanning || !html.trim()}
                onClick={() => {
                  if (html.trim()) onAnalyzeHtml(html, "pasted.html", "paste");
                }}
              >
                Analyse <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {tab === "upload" && (
          <div role="tabpanel" id="panel-upload" aria-labelledby="tab-upload">
            <label
              className="file-drop"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileRef.current?.click();
                }
              }}
              tabIndex={0}
            >
              <Upload size={28} aria-hidden="true" />
              <div
                className="mono"
                style={{ marginTop: 10, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}
              >
                Drop .html file, or <u>browse</u>
              </div>
              <div style={{ marginTop: 6, fontSize: 12 }}>
                Max 5 MB. Rendered in an isolated iframe.
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".html,.htm,text/html"
                className="sr-only"
                disabled={isScanning}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f && f.size <= 5 * 1024 * 1024) {
                    const r = new FileReader();
                    r.onload = () => {
                      if (typeof r.result === "string") onAnalyzeHtml(r.result, f.name, "upload");
                    };
                    r.readAsText(f);
                  }
                }}
              />
            </label>
          </div>
        )}
      </div>

      <div className="scanner-meta" aria-hidden="true">
        <span><span className="check">●</span> 105 axe-core rules</span>
        <span><span className="check">●</span> 20 custom checks</span>
        <span><span className="check">●</span> 16 legal frameworks</span>
        <span><span className="check">●</span> No data stored</span>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Indictment — signature hero interaction. Cycles through real
   violations and "indicts" the specific laws each one breaks,
   stamping the law badges in one at a time. The whole product
   thesis ("we say which laws") in a single animated glance.
   ═══════════════════════════════════════════════════════════════ */
const INDICTMENTS: ReadonlyArray<{ rule: string; wcag: string; selector: string; laws: string[] }> = [
  { rule: "Image missing alt text", wcag: "1.1.1", selector: "img.hero-banner", laws: ["ADA III", "EAA", "Unruh", "Section 508"] },
  { rule: "Button has no accessible name", wcag: "4.1.2", selector: "button.icon-only", laws: ["ADA III", "EAA", "AODA", "Equality Act"] },
  { rule: "Text contrast below 4.5:1", wcag: "1.4.3", selector: ".muted-label", laws: ["ADA III", "EAA", "EN 301 549", "Unruh"] },
  { rule: "Form input without a label", wcag: "3.3.2", selector: "input#email", laws: ["ADA III", "Section 508", "EAA", "DDA"] },
];

function Indictment() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % INDICTMENTS.length), 3600);
    return () => clearInterval(t);
  }, [paused]);

  const cur = INDICTMENTS[idx];
  return (
    <div
      className="indict"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="indict-label">
        <span className="dot" aria-hidden="true" /> One violation · {INDICTMENTS.length} verdicts
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <div className="indict-finding">
            <span className="indict-sev" aria-hidden="true" />
            <div>
              <div className="indict-rule">{cur.rule}</div>
              <div className="indict-meta mono">
                WCAG {cur.wcag} · <span className="indict-sel">{cur.selector}</span>
              </div>
            </div>
          </div>

          <div className="indict-arrow mono" aria-hidden="true">↓ indicts</div>

          <ul className="indict-laws" aria-label={`Laws implicated: ${cur.laws.join(", ")}`}>
            {cur.laws.map((law, i) => (
              <motion.li
                key={law}
                className="indict-law"
                initial={{ opacity: 0, scale: 0.9, x: -6 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.32, ease: EASE, delay: 0.25 + i * 0.12 }}
              >
                {law}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>

      <div className="indict-foot mono">Illustrative · your scan maps every finding to all 16</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Hero
   ═══════════════════════════════════════════════════════════════ */
function Hero({
  onScanUrl,
  onCrawlUrl,
  onAnalyzeHtml,
  isScanning,
}: {
  onScanUrl: (url: string) => void;
  onCrawlUrl: (url: string, maxPages: number) => void;
  onAnalyzeHtml: (html: string, name: string, method: "paste" | "upload") => void;
  isScanning: boolean;
}) {
  return (
    <section className="hero" id="main-content">
      <motion.div
        className="hero-inner"
        variants={stagger}
        initial="hidden"
        animate="visible"
        transition={{ delayChildren: 0.05, staggerChildren: 0.09 }}
      >
        <div className="hero-main">
          <motion.span variants={fadeUp} className="hero-eyebrow">
            <span className="dot" /> 5,000+ digital accessibility lawsuits filed in 2025
          </motion.span>
          <motion.h1 variants={fadeUp} className="hero-title">
            Most tools say you fail <span className="wcag-mono">WCAG&nbsp;1.1.1.</span>
            <br />
            We say <span className="ember">you&rsquo;re breaking 16 laws.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="hero-lede">
            Know exactly which of <b>16 laws</b> your site is exposed under — and the code to fix each issue.
            We render your page in a real browser and run 125+ checks against every framework. Real findings,{" "}
            <b>not an overlay widget</b>.
          </motion.p>
        </div>

        <motion.aside variants={fadeUp} className="hero-aside" aria-label="How one violation maps to the law">
          <Indictment />
        </motion.aside>

        <motion.div variants={fadeUp} className="hero-scanner" id="scan" style={{ scrollMarginTop: 90 }}>
          <Scanner onScanUrl={onScanUrl} onCrawlUrl={onCrawlUrl} onAnalyzeHtml={onAnalyzeHtml} isScanning={isScanning} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Ticker
   ═══════════════════════════════════════════════════════════════ */
function Ticker() {
  const items = [...LAWSUITS, ...LAWSUITS];
  return (
    <div className="ticker" aria-label="Recent accessibility enforcement — curated sample">
      <div className="ticker-track">
        {items.map((l, i) => (
          <span key={i} className="ticker-item">
            <span className="date">{l.date}</span>
            <span className="tag">[{l.tag}]</span>
            <span>{l.msg}</span>
            <span className="tick-sep">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Stats strip
   ═══════════════════════════════════════════════════════════════ */
function Stats() {
  const s = [
    { num: "3,117", sub: "", label: "Federal web accessibility lawsuits in 2025", extra: "Up 27% YoY — Seyfarth Shaw" },
    { num: "1,416", sub: "", label: "2025 lawsuits hit sites running an a11y widget", extra: "Overlays don't stop lawsuits — UsableNet" },
    { num: "$4,000", sub: "/visit", label: "California Unruh minimum damages", extra: "Per violation, per visitor" },
    { num: "16", sub: "laws", label: "Frameworks we map your scan to", extra: "1 scan, 16 verdicts" },
  ];
  return (
    <motion.section
      className="stats"
      aria-label="Why legal risk matters"
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
    >
      {s.map((x) => (
        <motion.div key={x.label} className="stat" variants={fadeUp}>
          <div className="stat-num">
            {x.num}
            {x.sub && <span className="sub">{x.sub}</span>}
          </div>
          <div className="stat-label">{x.label}</div>
          <div className="stat-sub">{x.extra}</div>
        </motion.div>
      ))}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Frameworks centerpiece — 4×4 grid driven by real FRAMEWORKS
   ═══════════════════════════════════════════════════════════════ */
function Frameworks() {
  const [selected, setSelected] = useState<FrameworkWithTags | null>(null);
  return (
    <section className="frameworks" id="frameworks">
      <div className="fw-inner">
        <div className="section-head">
          <div>
            <div className="kicker">The map · 16 frameworks</div>
            <h2>
              One scan.
              <br />
              Sixteen jurisdictions.
              <br />
              Sixteen verdicts.
            </h2>
          </div>
          <p className="desc">
            Every WCAG failure we detect is scored separately against each framework&rsquo;s applicable WCAG tags,
            severity multipliers, per-violation rules, and jurisdictional penalties. You see where you&rsquo;re actually
            exposed, not just where you fail in theory.
          </p>
        </div>

        <motion.div
          className="fw-grid"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
        >
          {FRAMEWORKS.map((f, i) => {
            const risk = riskFor(f);
            const deadline = formatDeadline(f.enforcementDate);
            return (
              <motion.article
                key={f.id}
                className={`fw-cell ${i === 1 ? "active" : ""}`}
                role="button"
                tabIndex={0}
                aria-label={`${f.name}, ${f.region}, ${risk} risk — view details`}
                variants={fadeUp}
                onClick={() => setSelected(f)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(f); }
                }}
              >
                <div>
                  <div className="fw-top">
                    <span className="fw-num">{String(i + 1).padStart(2, "0")} / 16</span>
                    <Flag code={flagFor(f)} />
                  </div>
                  <div className="fw-name">{f.name}</div>
                  <div className="fw-region">{f.region}</div>
                  {deadline && <span className="fw-deadline">◆ {deadline}</span>}
                </div>
                <div>
                  <div className="fw-penalty">{f.penalties}</div>
                  <div className="fw-meta">
                    <span className="fw-wcag">{f.wcagBasis}</span>
                    <span className={`fw-risk ${risk}`}>{risk} risk</span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
      <FrameworkInfoModal fw={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Framework info modal — homepage "click a framework for detail"
   ═══════════════════════════════════════════════════════════════ */
function appliesToLabel(a: FrameworkWithTags["appliesTo"]): string {
  return a === "both" ? "Public & private sector" : a === "public" ? "Public sector" : "Private sector";
}

/** Plain-English description of how our scorer weights this specific framework
 *  (derived from its real bonusPenalties — describes OUR method, not new legal claims). */
function scoringFactors(fw: FrameworkWithTags): string[] {
  const b = fw.bonusPenalties;
  const out: string[] = [];
  if (b.severityMultiplier && b.severityMultiplier >= 1.2) out.push(`High-litigation: violations weighted ${b.severityMultiplier}× in scoring`);
  if (b.elementCountWeight && b.elementCountWeight > 0) out.push("Per-violation statute — every affected element adds exposure");
  if (b.missingA11yStatement) out.push("A published accessibility statement is expected");
  if (b.missingSkipLink) out.push("A skip-navigation link is expected");
  if (b.missingLang) out.push("Page language must be declared (lang attribute)");
  return out;
}

function FrameworkInfoModal({ fw, onClose }: { fw: FrameworkWithTags | null; onClose: () => void }) {
  useEffect(() => {
    if (!fw) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [fw, onClose]);

  const fld: React.CSSProperties = { fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55 };
  const lbl: React.CSSProperties = { fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 4 };

  return (
    <AnimatePresence>
      {fw && (
        <motion.div
          role="dialog" aria-modal="true" aria-label={`${fw.name} details`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          style={{ position: "fixed", inset: 0, zIndex: 120, background: "rgba(0,0,0,0.62)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: 24 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ width: "min(520px, 100%)", maxHeight: "calc(100vh - 48px)", overflow: "auto", background: "var(--bg-raised)", border: "1px solid var(--border-strong)", borderRadius: 8, boxShadow: "var(--shadow-pop)" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderBottom: "1px solid var(--border-default)", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Flag code={flagFor(fw)} />
                <div>
                  <div className="font-display" style={{ fontSize: 17 }}>{fw.name}</div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{fw.region} · {fw.wcagBasis}</div>
                </div>
              </div>
              <button type="button" className="modal-close" onClick={onClose} aria-label="Close"><XCircle size={16} aria-hidden="true" /></button>
            </div>

            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 16 }}>
              {getFrameworkDescription(fw.id) && (
                <p style={{ fontSize: 14.5, color: "var(--text-primary)", lineHeight: 1.55, margin: 0 }}>
                  {getFrameworkDescription(fw.id)}
                </p>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div><div className="mono" style={lbl}>Who it applies to</div><div style={fld}>{appliesToLabel(fw.appliesTo)}</div></div>
                <div>
                  <div className="mono" style={lbl}>WCAG scope</div>
                  <div style={fld}>{(() => { const c = computeConformance(fw, []); return `${c.total} success criteria · ${c.target}`; })()}</div>
                </div>
              </div>
              <div><div className="mono" style={lbl}>Penalties / enforcement</div><div style={fld}>{fw.penalties}</div></div>
              {scoringFactors(fw).length > 0 && (
                <div>
                  <div className="mono" style={lbl}>What raises exposure here</div>
                  <ul style={{ ...fld, margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 4 }}>
                    {scoringFactors(fw).map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              )}
              {fw.enforcementDate && (
                <div>
                  <div className="mono" style={lbl}>Key date</div>
                  <div style={fld}>
                    {new Date(fw.enforcementDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    {fw.deadlineAlert ? ` — ${fw.deadlineAlert}` : ""}
                  </div>
                </div>
              )}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 4 }}>
                <a href={fw.url} target="_blank" rel="noopener noreferrer" className="btn">Read the law ↗</a>
                <button type="button" className="btn primary" onClick={() => { onClose(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                  Scan for exposure →
                </button>
              </div>
              <p style={{ fontSize: 11, color: "var(--text-tertiary)", lineHeight: 1.5, margin: 0 }}>
                Penalty figures are historical or statutory reference points, not predictions, and vary by jurisdiction and case. Not legal advice.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   How it works
   ═══════════════════════════════════════════════════════════════ */
function HowItWorks() {
  return (
    <section className="section" id="how">
      <div className="section-head">
        <div>
          <div className="kicker">Under the hood</div>
          <h2>How the free accessibility checker works</h2>
        </div>
        <p className="desc">
          <strong>Real browsers. Real rules. Real penalties.</strong> Most scanners lint static HTML and miss anything rendered by JavaScript. We render every page in headless
          Chromium, run the full axe-core suite and our 20 custom checks, then map every finding to legal frameworks in
          one pass.
        </p>
      </div>
      <motion.div
        className="how-steps"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
      >
        {HOW_STEPS.map((s) => (
          <motion.div key={s.idx} className="how-step" variants={fadeUp}>
            <div>
              <span className="tag">{s.tag}</span>
              <div style={{ display: "flex", gap: 10, alignItems: "baseline", marginTop: 4 }}>
                <span className="idx">{s.idx}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
            <div className="rule">───────</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Trust bar — honest credibility signals (no fabricated counts).
   The per-device scan count is real localStorage data.
   ═══════════════════════════════════════════════════════════════ */
const TRUST_SIGNALS = [
  "Real-browser rendering",
  "125+ checks · axe-core + 20 custom",
  "Benchmarked vs axe-core, Lighthouse & Pa11y",
  "WCAG-EM aligned methodology",
  "No overlay — code-level findings",
];

function TrustBar() {
  const [localScans, setLocalScans] = useState(0);
  useEffect(() => {
    setLocalScans(loadHistory().length);
  }, []);

  return (
    <section className="trustbar" aria-label="Why this scan is credible">
      <div className="trustbar-inner">
        {localScans > 0 && (
          <span className="trustbar-item trustbar-count mono">
            <span className="dot" aria-hidden="true" /> {localScans} scan{localScans === 1 ? "" : "s"} run in this browser
          </span>
        )}
        {TRUST_SIGNALS.map((s) => (
          <span key={s} className="trustbar-item mono">
            <span className="tick" aria-hidden="true">✓</span> {s}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Recent scans + compare (localStorage, no backend)
   ═══════════════════════════════════════════════════════════════ */
function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

function scoreColor(n: number): string {
  return n >= 90 ? "var(--pass)" : n >= 60 ? "var(--severity-minor)" : "var(--severity-critical)";
}

function hostOf(url: string): string {
  try { return new URL(url).host; } catch { return url; }
}

function Delta({ n, suffix = "", invert = false }: { n: number; suffix?: string; invert?: boolean }) {
  const good = invert ? n < 0 : n > 0;
  const color = n === 0 ? "var(--text-tertiary)" : good ? "var(--pass)" : "var(--severity-critical)";
  return <span style={{ color, fontWeight: 600 }}>{n > 0 ? "+" : ""}{n}{suffix}</span>;
}

function ComparePanel({ a, b }: { a: ScanHistoryEntry; b: ScanHistoryEntry }) {
  // a = older, b = newer (sorted by caller)
  const overallDelta = b.overall - a.overall;
  const issueDelta = b.issueCount - a.issueCount;
  const fwDeltas = b.frameworks
    .map((fb) => {
      const fa = a.frameworks.find((x) => x.id === fb.id);
      return fa ? { shortName: fb.shortName, delta: fb.percentage - fa.percentage, now: fb.percentage } : null;
    })
    .filter((x): x is { shortName: string; delta: number; now: number } => !!x && x.delta !== 0)
    .sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta))
    .slice(0, 6);

  return (
    <div style={{ marginTop: 14, padding: 16, border: "1px solid var(--border-default)", borderRadius: 10, background: "var(--bg-overlay)" }}>
      <div className="mono" style={{ fontSize: 11, color: "var(--text-tertiary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
        {hostOf(a.url)} · {timeAgo(a.timestamp)} → {timeAgo(b.timestamp)}
      </div>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: fwDeltas.length ? 12 : 0 }}>
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Overall score: <b style={{ color: "var(--text-primary)" }}>{a.overall} → {b.overall}</b> <Delta n={overallDelta} />
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Issues: <b style={{ color: "var(--text-primary)" }}>{a.issueCount} → {b.issueCount}</b> <Delta n={issueDelta} invert />
        </div>
      </div>
      {fwDeltas.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {fwDeltas.map((f) => (
            <span key={f.shortName} className="mono" style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
              {f.shortName} {f.now}% <Delta n={f.delta} suffix="pt" />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function RecentScans() {
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [comparing, setComparing] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  // localStorage can only be read after mount — doing it during render would
  // cause an SSR hydration mismatch, so the one-shot setState here is intentional.
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  if (history.length === 0) return null;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const pair = selected
    .map((id) => history.find((h) => h.id === id))
    .filter((x): x is ScanHistoryEntry => !!x)
    .sort((x, y) => new Date(x.timestamp).getTime() - new Date(y.timestamp).getTime());

  return (
    <section className="dash-section" aria-label="Recent scans" style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <h2 className="font-display" style={{ fontSize: 22 }}>Recent scans</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            className="btn"
            aria-pressed={comparing}
            onClick={() => { setComparing((c) => !c); setSelected([]); }}
          >
            <GitCompare size={13} /> {comparing ? "Done comparing" : "Compare two"}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => { clearHistory(); setHistory([]); setSelected([]); setComparing(false); }}
          >
            <Trash2 size={13} /> Clear
          </button>
        </div>
      </div>

      {comparing && (
        <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 10 }}>
          Pick two scans to see what changed. {pair.length < 2 ? `${2 - pair.length} more to select.` : ""}
        </p>
      )}

      <div style={{ border: "1px solid var(--border-default)", borderRadius: 10, overflow: "hidden" }}>
        {history.map((h, i) => {
          const isSel = selected.includes(h.id);
          return (
            <div
              key={h.id + i}
              onClick={comparing ? () => toggleSelect(h.id) : undefined}
              style={{
                display: "grid",
                gridTemplateColumns: comparing ? "auto auto 1fr auto auto" : "auto 1fr auto auto",
                gap: 14,
                alignItems: "center",
                padding: "12px 16px",
                borderTop: i === 0 ? "none" : "1px solid var(--border-default)",
                background: isSel ? "var(--bg-overlay)" : "transparent",
                cursor: comparing ? "pointer" : "default",
              }}
            >
              {comparing && (
                <input type="checkbox" checked={isSel} readOnly aria-label={`Select scan of ${hostOf(h.url)}`} />
              )}
              <span className="mono" style={{ fontSize: 18, fontWeight: 700, color: scoreColor(h.overall), minWidth: 32 }}>
                {h.overall}
              </span>
              <span className="mono" style={{ fontSize: 13, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {hostOf(h.url)}
                {h.isSite && <span style={{ marginLeft: 8, fontSize: 10, color: "var(--text-tertiary)" }}>SITE · {h.pagesScanned}p</span>}
              </span>
              <span className="mono" style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                {h.issueCount} issue{h.issueCount === 1 ? "" : "s"}
              </span>
              <span className="mono" style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
                {timeAgo(h.timestamp)}
              </span>
            </div>
          );
        })}
      </div>

      {comparing && pair.length === 2 && <ComparePanel a={pair[0]} b={pair[1]} />}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main page
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const router = useRouter();
  const { stage, result, site, error, scanUrl, crawlUrl, analyzeHtml, isScanning } = useAxeAnalysis();
  const [scanTarget, setScanTarget] = useState<string>("");

  useEffect(() => {
    if (result) {
      sessionStorage.setItem("a11y-beast-result", JSON.stringify(result));
      if (site) sessionStorage.setItem("a11y-beast-site", JSON.stringify(site));
      else sessionStorage.removeItem("a11y-beast-site");

      track("scan_completed", {
        url: result.url,
        is_site: !!site,
        pages_scanned: site?.stats.scanned ?? 1,
        issue_count: result.issues.length,
        score: result.score.overall,
        grade: result.score.grade,
      });

      // Capture a trimmed history entry (summary metrics only).
      Promise.all([
        import("@/lib/compliance/mapper"),
        import("@/lib/history"),
      ]).then(([{ generateComplianceResults }, { pushHistory }]) => {
        const compliance = generateComplianceResults(result.issues, result.passedRules, {
          hasAccessibilityStatement: result.pageMeta.hasAccessibilityStatement,
          hasSkipLink: result.pageMeta.hasSkipLink,
          lang: result.pageMeta.lang,
        }, result.passedRuleTags);
        pushHistory({
          id: result.id,
          url: result.url,
          timestamp: result.timestamp,
          isSite: !!site,
          pagesScanned: site?.stats.scanned,
          overall: result.score.overall,
          grade: result.score.grade,
          issueCount: result.issues.length,
          bySeverity: result.score.bySeverity,
          frameworks: compliance.map((c) => ({
            id: c.framework.id,
            shortName: c.framework.shortName,
            percentage: c.percentage,
          })),
        });
      }).catch(() => { /* history is best-effort */ });

      router.push("/results");
    }
  }, [result, site, router]);

  const handleScanUrl = useCallback(
    (url: string) => {
      setScanTarget(url);
      scanUrl(url);
    },
    [scanUrl]
  );

  const handleCrawlUrl = useCallback(
    (url: string, maxPages: number) => {
      setScanTarget(url);
      crawlUrl(url, maxPages);
    },
    [crawlUrl]
  );

  const handleAnalyzeHtml = useCallback(
    (html: string, name: string, method: "paste" | "upload") => {
      setScanTarget(name);
      analyzeHtml(html, name, method);
    },
    [analyzeHtml]
  );

  return (
    <MotionConfig reducedMotion="user">
      <JsonLd data={[organizationLd, softwareApplicationLd, howToLd]} />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <Header />

      {isScanning ? (
        <ScanningCard
          target={scanTarget}
          stage={stage}
          onCancel={() => window.location.reload()}
        />
      ) : (
        <main id="main-content" role="main" style={{ flex: 1 }}>
          <Hero onScanUrl={handleScanUrl} onCrawlUrl={handleCrawlUrl} onAnalyzeHtml={handleAnalyzeHtml} isScanning={isScanning} />
          <TrustBar />
          <Ticker />
          <RecentScans />
          <Stats />
          <Frameworks />
          <HowItWorks />

          {error && (
            <div
              role="alert"
              style={{
                maxWidth: 720,
                margin: "0 auto 40px",
                padding: "14px 20px",
                background: "var(--severity-critical-bg)",
                border: "1px solid color-mix(in oklch, var(--severity-critical) 30%, transparent)",
                borderRadius: 10,
                color: "var(--severity-critical)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 13,
              }}
            >
              <XCircle size={16} aria-hidden="true" /> {error}
            </div>
          )}
        </main>
      )}

      <Footer />
    </MotionConfig>
  );
}
