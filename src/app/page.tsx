"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Code2, GitCompare, Globe, Lock, Trash2, Upload, XCircle } from "lucide-react";
import { loadHistory, clearHistory, type ScanHistoryEntry } from "@/lib/history";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useAxeAnalysis } from "@/hooks/useAxeAnalysis";
import { FRAMEWORKS, getFrameworkDescription, type FrameworkWithTags } from "@/lib/compliance/frameworks";
import { computeConformance } from "@/lib/compliance/wcag-criteria";
import ScanningCard from "@/components/scanner/ScanningCard";
import JsonLd from "@/components/JsonLd";
import { organizationLd, softwareApplicationLd, howToLd } from "@/lib/seo/structured-data";
import { track } from "@/lib/analytics";

/* Shared motion primitives — restrained, ease-out, no springs. Honour
   prefers-reduced-motion via the page-level MotionConfig reducedMotion="user". */
const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const inView = { once: true, amount: 0.18 } as const;

const HOW_STEPS = [
  { idx: "01 / Render", title: "Real browser", desc: "We load your page in a real Chromium browser with JavaScript on — exactly what a visitor gets, not a static guess.", meta: "Puppeteer · SSRF-guarded" },
  { idx: "02 / Check", title: "110+ checks", desc: "axe-core's 96 rules plus 20 of our own run against the rendered accessibility tree.", meta: "axe-core 4.11 · 20 custom" },
  { idx: "03 / Map", title: "16 frameworks", desc: "Each violation is mapped to the specific laws it implicates, with jurisdiction and severity.", meta: "deterministic · not an LLM guess" },
  { idx: "04 / Record", title: "Dated record", desc: "You get a hash-verifiable evidence record. Re-scan anytime; we diff what changed.", meta: "SHA-256 · regression diff" },
];

const SAMPLES = ["shopify.com", "hermes.com", "ticketmaster.com", "stripe.com"];

/* ═══════════════════════════════════════════════════════════════
   Framework → flag + risk (derived from the real FRAMEWORKS list)
   ═══════════════════════════════════════════════════════════════ */
function flagFor(fw: FrameworkWithTags): string {
  const r = fw.region.toLowerCase();
  if (r.includes("ontario") || r.includes("canada")) return "CA";
  if (r.includes("usa") || r.includes("california") || r.includes("federal")) return "US";
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
  US: { bg: "var(--bg-wash)", fg: "var(--text-secondary)" },
  CA: { bg: "var(--bg-wash)", fg: "var(--text-secondary)" },
  EU: { bg: "var(--bg-wash)", fg: "var(--text-secondary)" },
  UK: { bg: "var(--bg-wash)", fg: "var(--text-secondary)" },
  AU: { bg: "var(--bg-wash)", fg: "var(--text-secondary)" },
  IL: { bg: "var(--bg-wash)", fg: "var(--text-secondary)" },
};

function Flag({ code }: { code: string }) {
  const c = FLAG_STYLES[code] ?? { bg: "var(--bg-wash)", fg: "var(--text-secondary)" };
  return (
    <span className="flag-mono" style={{ background: c.bg, color: c.fg, border: "1px solid var(--border-default)" }} aria-hidden="true">
      {code}
    </span>
  );
}

const RISK_CHIP: Record<"high" | "med" | "low", { cls: string; label: string }> = {
  high: { cls: "risk", label: "High risk" },
  med: { cls: "part", label: "Applies" },
  low: { cls: "ok", label: "Lower risk" },
};

/* ═══════════════════════════════════════════════════════════════
   Scanner — 3-tab (URL / paste HTML / upload). Unchanged behaviour.
   ═══════════════════════════════════════════════════════════════ */
type Tab = "url" | "paste" | "upload";

function Scanner({
  onScanUrl,
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
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      onScanUrl(normalized);
    },
    [onScanUrl]
  );

  return (
    <section className="scanner" aria-label="Scan a website">
      <div role="tablist" aria-label="Input method" className="scanner-tabs">
        <button role="tab" id="tab-url" aria-selected={tab === "url"} aria-controls="panel-url" tabIndex={tab === "url" ? 0 : -1} className="scanner-tab" onClick={() => setTab("url")} disabled={isScanning}>
          <Globe size={14} aria-hidden="true" /> URL
        </button>
        <button role="tab" id="tab-paste" aria-selected={tab === "paste"} aria-controls="panel-paste" tabIndex={tab === "paste" ? 0 : -1} className="scanner-tab" onClick={() => setTab("paste")} disabled={isScanning}>
          <Code2 size={14} aria-hidden="true" /> Paste HTML
        </button>
        <button role="tab" id="tab-upload" aria-selected={tab === "upload"} aria-controls="panel-upload" tabIndex={tab === "upload" ? 0 : -1} className="scanner-tab" onClick={() => setTab("upload")} disabled={isScanning}>
          <Upload size={14} aria-hidden="true" /> Upload file
        </button>
      </div>

      <div className="scanner-body">
        {tab === "url" && (
          <div role="tabpanel" id="panel-url" aria-labelledby="tab-url">
            <form onSubmit={(e) => { e.preventDefault(); submit(url); }}>
              <div className="url-row">
                <div className="url-field">
                  <span className="scheme" aria-hidden="true">https://</span>
                  <label htmlFor="scan-url" className="sr-only">Website URL</label>
                  <input id="scan-url" type="text" inputMode="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="yoursite.com" spellCheck={false} autoComplete="url" disabled={isScanning} />
                </div>
                <button type="submit" className="btn-scan" disabled={isScanning || !url.trim()}>
                  Scan a page <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
              <Link href="/pricing" className="crawl-upsell">
                <Lock size={12} aria-hidden="true" />
                <span>Scan your <b>whole site</b></span>
                <span className="tier-pill pro">Pro</span>
                <span className="crawl-upsell-cta"><ArrowRight size={13} aria-hidden="true" /></span>
              </Link>
            </form>
            <div className="sample-row">
              <span className="label">Try:</span>
              {SAMPLES.map((s) => (
                <button key={s} type="button" className="chip" onClick={() => { setUrl(s); submit(s); }} disabled={isScanning}>
                  {s}
                </button>
              ))}
              <Link href="/results?sample=1" className="sample-link">
                or see a sample record <ArrowRight size={12} aria-hidden="true" />
              </Link>
            </div>
            <p className="scanner-trust mono">Free · no signup · your HTML never leaves your browser on paste/upload</p>
          </div>
        )}

        {tab === "paste" && (
          <div role="tabpanel" id="panel-paste" aria-labelledby="tab-paste" className="html-paste">
            <label htmlFor="html-paste" className="sr-only">HTML to analyse</label>
            <textarea id="html-paste" value={html} onChange={(e) => setHtml(e.target.value)} placeholder={'<!doctype html>\n<html>\n  <head><title>Paste your document</title></head>\n  <body>...</body>\n</html>'} disabled={isScanning} spellCheck={false} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span className="mono" style={{ fontSize: 11, color: "var(--text-tertiary)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Analysed in-browser · 0 bytes sent to server
              </span>
              <button type="button" className="btn-scan" disabled={isScanning || !html.trim()} onClick={() => { if (html.trim()) onAnalyzeHtml(html, "pasted.html", "paste"); }}>
                Analyse <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {tab === "upload" && (
          <div role="tabpanel" id="panel-upload" aria-labelledby="tab-upload">
            <label className="file-drop" onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileRef.current?.click(); } }} tabIndex={0}>
              <Upload size={28} aria-hidden="true" />
              <div className="mono" style={{ marginTop: 10, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Drop .html file, or <u>browse</u>
              </div>
              <div style={{ marginTop: 6, fontSize: 12 }}>Max 5 MB. Rendered in an isolated iframe.</div>
              <input ref={fileRef} type="file" accept=".html,.htm,text/html" className="sr-only" disabled={isScanning}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f && f.size <= 5 * 1024 * 1024) {
                    const r = new FileReader();
                    r.onload = () => { if (typeof r.result === "string") onAnalyzeHtml(r.result, f.name, "upload"); };
                    r.readAsText(f);
                  }
                }}
              />
            </label>
          </div>
        )}
      </div>

      <div className="scanner-meta" aria-hidden="true">
        <span><span className="check">●</span> 96 axe-core rules</span>
        <span><span className="check">●</span> 20 custom checks</span>
        <span><span className="check">●</span> 16 legal frameworks</span>
        <span><span className="check">●</span> No data stored</span>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   The evidence-record artifact — the hero thesis (static sample)
   ═══════════════════════════════════════════════════════════════ */
function RecordArtifact() {
  // r=36 circumference ≈ 226.19; 34% coverage → offset ≈ 149.3 (static, no motion)
  const offset = 226.19 * (1 - 0.34);
  return (
    <div className="rc-record-stack" aria-label="Sample accessibility evidence record">
      <div className="rc-record">
        <span className="rc-stamp" aria-hidden="true">SAMPLE</span>
        <div className="rc-rec-mast">
          <div className="ttl">Accessibility Evidence Record</div>
          <div className="sub">
            <span>Target&nbsp; <b>store.example.com</b></span>
            <span>26 Jun 2026 · 14:32 UTC</span>
          </div>
        </div>
        <div className="rc-thin" aria-hidden="true" />
        <div className="rc-cov">
          <div className="rc-ring" role="img" aria-label="Automated coverage 34 percent">
            <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true">
              <circle cx="42" cy="42" r="36" fill="none" stroke="var(--border-default)" strokeWidth="7" />
              <circle cx="42" cy="42" r="36" fill="none" stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" strokeDasharray="226.19" strokeDashoffset={offset} />
            </svg>
            <div className="num"><b>34<span style={{ fontSize: 14 }}>%</span></b><span>coverage</span></div>
          </div>
          <p className="ct"><b>34% automated coverage.</b> Machines catch about a third of WCAG. We tell you which third we checked — and which still needs a human.</p>
        </div>
        <div className="rc-fw-rows">
          <div className="rc-fw-row"><div><div className="n">ADA Title III</div><div className="b">WCAG 2.1 AA basis</div></div><span className="rc-chip risk">At risk</span></div>
          <div className="rc-fw-row"><div><div className="n">European Accessibility Act</div><div className="b">EN 301 549</div></div><span className="rc-chip risk">At risk</span></div>
          <div className="rc-fw-row"><div><div className="n">Section 508</div><div className="b">Revised 508 · WCAG 2.0 AA</div></div><span className="rc-chip part">Partial</span></div>
          <div className="rc-fw-row"><div><div className="n">UK Equality Act</div><div className="b">PSBAR 2018</div></div><span className="rc-chip ok">On track</span></div>
        </div>
        <div className="rc-rec-foot">
          <div className="hash"><b>sha256</b> 7f3a…c41e · 73 issues · 14 critical</div>
          <Link href="/results?sample=1" className="mono" style={{ fontSize: 10.5 }}>verify ↗</Link>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Hero
   ═══════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section className="rc-hero">
      <motion.div className="rc-wrap rc-hero-grid" variants={stagger} initial="hidden" animate="visible" transition={{ delayChildren: 0.05, staggerChildren: 0.08 }}>
        <div className="rc-hero-copy">
          <motion.span variants={fadeUp} className="rc-eyebrow"><span className="rule" aria-hidden="true" />Accessibility evidence, done honestly</motion.span>
          <motion.h1 variants={fadeUp}>The record that proves <em>you tried.</em></motion.h1>
          <motion.p variants={fadeUp} className="rc-lede">
            We render your page in a real browser, run <b>110+ checks</b>, and map every issue to the <b>16 laws</b> it touches — then issue a <b>dated, hash-verifiable record</b> you can hand a client, a regulator, or a court.
          </motion.p>
          <motion.div variants={fadeUp} className="rc-cta-row">
            <a className="rc-btn rc-btn-primary" href="#scan">Scan a page</a>
            <Link className="seemore" href="/results?sample=1">See a sample record <span className="rc-arw" aria-hidden="true">→</span></Link>
          </motion.div>
          <motion.p variants={fadeUp} className="rc-assure"><span className="dot" aria-hidden="true" />Free · no signup · your page is never stored.</motion.p>
        </div>
        <motion.div variants={fadeUp}>
          <RecordArtifact />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Scan band — the real scanner, kept prominent right under the hero
   ═══════════════════════════════════════════════════════════════ */
function ScanBand({
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
    <section className="rc-scan-band" id="scan" style={{ scrollMarginTop: 80 }}>
      <div className="rc-wrap">
        <div className="rc-scan-head">
          <h2>Scan a page</h2>
          <p>Paste a URL, drop in HTML, or upload a file. Results in seconds — no account needed.</p>
        </div>
        <Scanner onScanUrl={onScanUrl} onCrawlUrl={onCrawlUrl} onAnalyzeHtml={onAnalyzeHtml} isScanning={isScanning} />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Honesty band — the differentiator
   ═══════════════════════════════════════════════════════════════ */
function Honesty() {
  return (
    <section className="rc-honesty">
      <motion.div className="rc-wrap" variants={stagger} initial="hidden" whileInView="visible" viewport={inView}>
        <motion.p variants={fadeUp} className="rc-label">The whole pitch</motion.p>
        <motion.p variants={fadeUp} className="big">
          Most scanners imply a clean result means you&rsquo;re compliant. <em>We don&rsquo;t make that claim</em>{" "}— because it isn&rsquo;t true, and it&rsquo;s the one the FTC fines people for.
        </motion.p>
        <div className="cols">
          <motion.p variants={fadeUp}>
            Automated testing catches roughly <b>a third</b> of real accessibility barriers. The honest move isn&rsquo;t a bigger number — it&rsquo;s telling you <b>exactly which third</b>{" "}we checked, which we couldn&rsquo;t, and what a person still needs to review. That candour is the product.
          </motion.p>
          <motion.p variants={fadeUp}>
            Every scan becomes a <b>dated, SHA-256-hashed record</b>{" "}of what you tested and when. Re-scan and we diff the changes. It&rsquo;s not a compliance badge — it&rsquo;s a defensible paper trail of the effort you actually made.
          </motion.p>
        </div>
        <motion.p variants={fadeUp} className="rc-ftc">
          <b>&ldquo;Guaranteed compliance.&rdquo;</b> That&rsquo;s the claim that cost an overlay vendor a <b>$1M FTC settlement.</b>{" "}You&rsquo;ll never see it here.
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   How it works
   ═══════════════════════════════════════════════════════════════ */
function HowItWorks() {
  return (
    <section className="rc-section" id="how">
      <div className="rc-wrap">
        <div className="rc-sec-head">
          <span className="rc-label">How it works</span>
          <h2>Four steps, no magic.</h2>
          <p className="intro">The same pipeline a careful auditor would run by hand — only faster, and written down.</p>
        </div>
        <motion.div className="rc-steps" variants={stagger} initial="hidden" whileInView="visible" viewport={inView}>
          {HOW_STEPS.map((s) => (
            <motion.div key={s.idx} className="rc-step" variants={fadeUp}>
              <div className="idx">{s.idx}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="meta">{s.meta}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Frameworks — calm browsable catalog (click a row for detail)
   ═══════════════════════════════════════════════════════════════ */
function Frameworks() {
  const [selected, setSelected] = useState<FrameworkWithTags | null>(null);
  const closeModal = useCallback(() => setSelected(null), []);
  return (
    <section className="rc-section" id="frameworks" style={{ background: "var(--bg-raised)", borderTop: "1px solid var(--border-default)", borderBottom: "1px solid var(--border-default)" }}>
      <div className="rc-wrap">
        <div className="rc-sec-head">
          <span className="rc-label">The map</span>
          <h2>Sixteen frameworks, one scan.</h2>
          <p className="intro">A clean scan in the US doesn&rsquo;t mean a clean scan in the EU. We check the law in every market your site reaches — and date it.</p>
        </div>
        <div className="rc-cat" role="list" aria-label="Legal frameworks">
          {FRAMEWORKS.map((f, i) => {
            const chip = RISK_CHIP[riskFor(f)];
            return (
              <button key={f.id} type="button" className="rc-cat-row" role="listitem" onClick={() => setSelected(f)} aria-label={`${f.name}, ${f.region} — view details`}>
                <span className="no">{String(i + 1).padStart(2, "0")}</span>
                <span className="name">{f.name}<span className="basis">{f.wcagBasis}</span></span>
                <span className="region">{f.region}</span>
                <span className={`rc-chip ${chip.cls}`}>{chip.label}</span>
              </button>
            );
          })}
        </div>
        <p className="rc-cat-foot">Status reflects enforcement posture, not a verdict on your site. Your scan maps each to <b>your</b> findings.</p>
      </div>
      <FrameworkInfoModal fw={selected} onClose={closeModal} />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Framework info modal — homepage "click a framework for detail"
   ═══════════════════════════════════════════════════════════════ */
function appliesToLabel(a: FrameworkWithTags["appliesTo"]): string {
  return a === "both" ? "Public & private sector" : a === "public" ? "Public sector" : "Private sector";
}

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
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!fw) return;
    if (!openerRef.current) {
      openerRef.current = (document.activeElement as HTMLElement) ?? null;
      closeRef.current?.focus();
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !root.contains(active)) { e.preventDefault(); last.focus(); }
      } else if (active === last || !root.contains(active)) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      const opener = openerRef.current;
      openerRef.current = null;
      opener?.focus?.();
    };
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
          style={{ position: "fixed", inset: 0, zIndex: 120, background: "rgba(20,18,14,0.45)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: 24 }}
        >
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, y: 14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ width: "min(520px, 100%)", maxHeight: "calc(100vh - 48px)", overflow: "auto", background: "var(--bg-overlay)", border: "1px solid var(--border-strong)", borderRadius: 8, boxShadow: "var(--shadow-pop)" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderBottom: "1px solid var(--border-default)", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Flag code={flagFor(fw)} />
                <div>
                  <div className="font-display" style={{ fontSize: 18 }}>{fw.name}</div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{fw.region} · {fw.wcagBasis}</div>
                </div>
              </div>
              <button ref={closeRef} type="button" className="modal-close" onClick={onClose} aria-label="Close"><XCircle size={16} aria-hidden="true" /></button>
            </div>

            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 16 }}>
              {getFrameworkDescription(fw.id) && (
                <p style={{ fontSize: 14.5, color: "var(--text-primary)", lineHeight: 1.55, margin: 0 }}>{getFrameworkDescription(fw.id)}</p>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div><div className="mono" style={lbl}>Who it applies to</div><div style={fld}>{appliesToLabel(fw.appliesTo)}</div></div>
                <div><div className="mono" style={lbl}>WCAG scope</div><div style={fld}>{(() => { const c = computeConformance(fw, []); return `${c.total} success criteria · ${c.target}`; })()}</div></div>
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
                <button type="button" className="btn primary" onClick={() => { onClose(); document.getElementById("scan")?.scrollIntoView({ behavior: "smooth" }); }}>Scan for exposure →</button>
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
   Who's behind it — the human move
   ═══════════════════════════════════════════════════════════════ */
function Who() {
  return (
    <section className="rc-who">
      <motion.div className="rc-wrap rc-who-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={inView}>
        <motion.div variants={fadeUp} className="rc-portrait" aria-hidden="true">
          <div className="av">B</div>
          <span className="ph">your photo here</span>
        </motion.div>
        <motion.div variants={fadeUp}>
          <span className="rc-label" style={{ display: "block", marginBottom: 16 }}>Who&rsquo;s behind the audits</span>
          <blockquote>&ldquo;I built this because I was tired of tools that hand you a green checkmark and a lawsuit. You should know what you actually fixed — and be able to prove it.&rdquo;</blockquote>
          <p className="by"><b>[Your name]</b> — founder<span className="cred">WAS-certified · ex-agency accessibility lead · 200+ audits</span></p>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   For agencies
   ═══════════════════════════════════════════════════════════════ */
function Agencies() {
  return (
    <section className="rc-section rc-agency" id="agencies">
      <motion.div className="rc-wrap rc-ag-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={inView}>
        <motion.div variants={fadeUp}>
          <span className="rc-label">For agencies</span>
          <h2>Resell the record as your own.</h2>
          <ul>
            <li><span className="mk" aria-hidden="true">→</span><span><b>White-label it</b> into the audits you already bill — your logo, your client, your deliverable.</span></li>
            <li><span className="mk" aria-hidden="true">→</span><span><b>Anchor it to the work</b>, not to a scanner. The record belongs in a $1.25k–25k engagement, not a $9 widget.</span></li>
            <li><span className="mk" aria-hidden="true">→</span><span><b>Re-scan on a schedule</b> and hand clients a dated trail that shows the work held up.</span></li>
          </ul>
          <div className="rc-cta-row"><Link className="rc-btn rc-btn-ghost" href="/pricing">Talk to us about white-label</Link></div>
        </motion.div>
        <motion.div variants={fadeUp} className="rc-pricecard" id="pricing-teaser">
          <div className="l">Agency</div>
          <div className="amt">$249<span> / mo</span></div>
          <div className="vs">Brandable records, bulk scans, scheduled re-scans, priority support.</div>
          <div className="anchor"><b>For comparison:</b> a single manual audit runs $1,250–25,000. The record is what you bill it on.</div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Final CTA
   ═══════════════════════════════════════════════════════════════ */
function FinalCta() {
  return (
    <section className="rc-final">
      <motion.div className="rc-wrap" variants={stagger} initial="hidden" whileInView="visible" viewport={inView}>
        <motion.h2 variants={fadeUp}>Run an honest scan.</motion.h2>
        <motion.p variants={fadeUp} className="rc-lede">See exactly where a page stands across sixteen frameworks — and walk away with a record that proves it.</motion.p>
        <motion.div variants={fadeUp} className="rc-cta-row">
          <a className="rc-btn rc-btn-primary" href="#scan">Scan a page</a>
          <Link className="rc-btn rc-btn-ghost" href="/results?sample=1">See a sample record</Link>
        </motion.div>
      </motion.div>
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

  useEffect(() => { setHistory(loadHistory()); }, []);

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
    <section className="rc-section" aria-label="Recent scans" style={{ paddingTop: 56, paddingBottom: 56 }}>
      <div className="rc-wrap">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <h2 style={{ fontSize: 24 }}>Recent scans</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="btn" aria-pressed={comparing} onClick={() => { setComparing((c) => !c); setSelected([]); }}>
              <GitCompare size={13} /> {comparing ? "Done comparing" : "Compare two"}
            </button>
            <button type="button" className="btn" onClick={() => { clearHistory(); setHistory([]); setSelected([]); setComparing(false); }}>
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
              <div key={h.id + i} onClick={comparing ? () => toggleSelect(h.id) : undefined}
                style={{ display: "grid", gridTemplateColumns: comparing ? "auto auto 1fr auto auto" : "auto 1fr auto auto", gap: 14, alignItems: "center", padding: "12px 16px", borderTop: i === 0 ? "none" : "1px solid var(--border-default)", background: isSel ? "var(--bg-overlay)" : "transparent", cursor: comparing ? "pointer" : "default" }}>
                {comparing && (<input type="checkbox" checked={isSel} readOnly aria-label={`Select scan of ${hostOf(h.url)}`} />)}
                <span className="mono" style={{ fontSize: 18, fontWeight: 700, color: scoreColor(h.overall), minWidth: 32 }}>{h.overall}</span>
                <span className="mono" style={{ fontSize: 13, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {hostOf(h.url)}
                  {h.isSite && <span style={{ marginLeft: 8, fontSize: 10, color: "var(--text-tertiary)" }}>SITE · {h.pagesScanned}p</span>}
                </span>
                <span className="mono" style={{ fontSize: 12, color: "var(--text-secondary)" }}>{h.issueCount} issue{h.issueCount === 1 ? "" : "s"}</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{timeAgo(h.timestamp)}</span>
              </div>
            );
          })}
        </div>

        {comparing && pair.length === 2 && <ComparePanel a={pair[0]} b={pair[1]} />}
      </div>
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
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    if (result) {
      setAnnounce("Scan complete — results ready");
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

      Promise.all([import("@/lib/compliance/mapper"), import("@/lib/history")]).then(([{ generateComplianceResults }, { pushHistory }]) => {
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
          frameworks: compliance.map((c) => ({ id: c.framework.id, shortName: c.framework.shortName, percentage: c.percentage })),
        });
      }).catch(() => { /* history is best-effort */ });

      router.push("/results");
    }
  }, [result, site, router]);

  const handleScanUrl = useCallback((url: string) => { setScanTarget(url); scanUrl(url); }, [scanUrl]);
  const handleCrawlUrl = useCallback((url: string, maxPages: number) => { setScanTarget(url); crawlUrl(url, maxPages); }, [crawlUrl]);
  const handleAnalyzeHtml = useCallback((html: string, name: string, method: "paste" | "upload") => { setScanTarget(name); analyzeHtml(html, name, method); }, [analyzeHtml]);

  return (
    <MotionConfig reducedMotion="user">
      <JsonLd data={[organizationLd, softwareApplicationLd, howToLd]} />

      <div className="sr-only" role="status" aria-live="polite">{announce}</div>

      {isScanning ? (
        <main id="main-content" role="main" style={{ flex: 1 }}>
          <ScanningCard target={scanTarget} stage={stage} onCancel={() => window.location.reload()} />
        </main>
      ) : (
        <main id="main-content" role="main" className="rc" style={{ flex: 1 }}>
          <Hero />
          <ScanBand onScanUrl={handleScanUrl} onCrawlUrl={handleCrawlUrl} onAnalyzeHtml={handleAnalyzeHtml} isScanning={isScanning} />
          <Honesty />
          <HowItWorks />
          <Frameworks />
          <RecentScans />
          <Who />
          <Agencies />
          <FinalCta />

          {error && (
            <div role="alert" style={{ maxWidth: 720, margin: "0 auto 40px", padding: "14px 20px", background: "var(--severity-critical-bg)", border: "1px solid color-mix(in oklch, var(--severity-critical) 30%, transparent)", borderRadius: 10, color: "var(--severity-critical)", display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
              <XCircle size={16} aria-hidden="true" /> {error}
            </div>
          )}
        </main>
      )}
    </MotionConfig>
  );
}
