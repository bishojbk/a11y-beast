"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Shield, Scale, Zap, Globe, Lock, Eye, Code, FileSearch,
  ArrowRight, CheckCircle2, XCircle,
  Upload, ClipboardPaste, Search,
  BarChart3, Users, Gavel, ShieldCheck, BrainCircuit,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useAxeAnalysis, type ScanStage } from "@/hooks/useAxeAnalysis";
import type { ScanResult } from "@/lib/types/scan-result";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

const STAGES: { key: ScanStage; label: string }[] = [
  { key: "fetching", label: "Fetching page HTML..." },
  { key: "rendering", label: "Rendering page (CSS, JS, images)..." },
  { key: "analyzing", label: "Running 105+ WCAG rules + 20 custom checks..." },
  { key: "scoring", label: "Mapping to 16 legal frameworks..." },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const vpOnce = { once: true, amount: 0.01 };

/* ── Floating Orbs ── */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute top-[15%] left-[10%] w-80 h-80 rounded-full blur-[120px] opacity-[0.14]"
        style={{ background: "var(--accent)", animation: "float-orb-1 25s ease-in-out infinite" }} />
      <div className="absolute bottom-[20%] right-[8%] w-96 h-96 rounded-full blur-[140px] opacity-[0.10]"
        style={{ background: "var(--accent-secondary)", animation: "float-orb-2 30s ease-in-out infinite" }} />
      <div className="absolute top-[40%] right-[25%] w-56 h-56 rounded-full blur-[100px] opacity-[0.07]"
        style={{ background: "var(--accent-tertiary)", animation: "float-orb-3 22s ease-in-out infinite" }} />
      <div className="absolute bottom-[10%] left-[30%] w-44 h-44 rounded-full blur-[90px] opacity-[0.06]"
        style={{ background: "var(--accent)", animation: "float-orb-2 28s ease-in-out infinite reverse" }} />
    </div>
  );
}

/* ── Scan Progress ── */
function ScanProgress({ stage }: { stage: ScanStage }) {
  const idx = STAGES.findIndex((s) => s.key === stage);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-sm mx-auto mt-10 space-y-3">
      {STAGES.map((s, i) => (
        <motion.div key={s.key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: i <= idx ? 1 : 0.2, x: 0 }} transition={{ delay: i * 0.1, duration: 0.4 }}
          className="flex items-center gap-3 text-xs">
          {i < idx ? (
            <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--pass-bg)", color: "var(--pass)" }}>
              <CheckCircle2 size={13} />
            </span>
          ) : i === idx ? (
            <span className="w-5 h-5 rounded-full animate-scan-pulse" style={{ background: "var(--accent)", boxShadow: "0 0 12px var(--accent-glow)" }} />
          ) : (
            <span className="w-5 h-5 rounded-full" style={{ background: "var(--border-default)" }} />
          )}
          <span style={{ color: i <= idx ? "var(--text-primary)" : "var(--text-tertiary)" }}>{s.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ── Scanner Input with Tabs ── */
type InputTab = "url" | "paste" | "upload";

function ScannerInput({ onScanUrl, onAnalyzeHtml, isScanning }: {
  onScanUrl: (url: string) => void;
  onAnalyzeHtml: (html: string, name: string, method: "paste" | "upload") => void;
  isScanning: boolean;
}) {
  const [tab, setTab] = useState<InputTab>("url");
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const tabs: { key: InputTab; label: string; Icon: LucideIcon }[] = [
    { key: "url", label: "URL", Icon: Search },
    { key: "paste", label: "Paste HTML", Icon: ClipboardPaste },
    { key: "upload", label: "Upload", Icon: Upload },
  ];

  return (
    <div className="w-full">
      <div role="tablist" aria-label="Scan input method" className="flex gap-1 p-1 rounded-xl mb-5 w-fit mx-auto"
        style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-default)" }}>
        {tabs.map((t) => (
          <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)} disabled={isScanning}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            style={{
              background: tab === t.key ? "var(--bg-raised)" : "transparent",
              color: tab === t.key ? "var(--text-primary)" : "var(--text-tertiary)",
              boxShadow: tab === t.key ? "var(--shadow-sm)" : "none",
            }}>
            <t.Icon size={12} aria-hidden="true" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "url" && (
        <form onSubmit={(e) => {
          e.preventDefault();
          const raw = url.trim();
          if (!raw) return;
          // Normalize: prepend https:// if user typed a bare domain like "example.com" or "www.example.com"
          const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
          onScanUrl(normalized);
        }} className="flex gap-2.5 scanner-input rounded-xl p-1.5"
          style={{ background: "var(--bg-input)", border: "1px solid var(--border-strong)" }}>
          <label htmlFor="url-input" className="sr-only">Website URL to scan</label>
          <input id="url-input" type="text" inputMode="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="example.com" disabled={isScanning} autoComplete="url"
            className="flex-1 h-11 px-4 rounded-lg text-sm transition-all outline-none bg-transparent"
            style={{ color: "var(--text-primary)" }} />
          <button type="submit" disabled={isScanning || !url.trim()}
            className="scan-btn h-11 px-8 rounded-lg text-sm font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ color: "var(--text-inverse)" }}>
            <span>{isScanning ? "Scanning..." : "Scan"}</span>
          </button>
        </form>
      )}

      {tab === "paste" && (
        <div className="space-y-3">
          <label htmlFor="html-paste" className="sr-only">HTML code to analyze</label>
          <textarea id="html-paste" value={html} onChange={(e) => setHtml(e.target.value)} placeholder="Paste your HTML here..." rows={7} disabled={isScanning}
            className="w-full rounded-xl p-4 text-xs outline-none resize-y scanner-input"
            style={{ background: "var(--bg-input)", border: "1px solid var(--border-strong)", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }} />
          <button onClick={() => { if (html.trim()) onAnalyzeHtml(html, "pasted-html", "paste"); }} disabled={isScanning || !html.trim()}
            className="scan-btn h-11 px-8 rounded-lg text-sm font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ color: "var(--text-inverse)" }}>
            <span>Analyze HTML</span>
          </button>
        </div>
      )}

      {tab === "upload" && (
        <div className="flex flex-col items-center gap-3">
          <label htmlFor="file-upload" tabIndex={0} role="button"
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileRef.current?.click(); } }}
            className="w-full rounded-xl p-12 text-center cursor-pointer transition-all duration-300 hover:scale-[1.01] glass-strong gradient-border-card"
            style={{ borderColor: "var(--border-default)" }}>
            <Upload size={28} className="mx-auto mb-3" style={{ color: "var(--accent)" }} aria-hidden="true" />
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Drop .html file here or click to browse</p>
            <p className="text-xs mt-1.5" style={{ color: "var(--text-tertiary)" }}>Accepts .html and .htm files, max 5MB</p>
          </label>
          <input ref={fileRef} id="file-upload" type="file" accept=".html,.htm" className="sr-only"
            onChange={(e) => { const f = e.target.files?.[0]; if (f && f.size <= 5*1024*1024) { const r = new FileReader(); r.onload = () => { if (typeof r.result === "string") onAnalyzeHtml(r.result, f.name, "upload"); }; r.readAsText(f); } }} />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════ MAIN PAGE ═══════════════════════════════ */

export default function Home() {
  const { stage, result, error, scanUrl, analyzeHtml, isScanning } = useAxeAnalysis();

  useEffect(() => {
    if (result) {
      sessionStorage.setItem("a11y-beast-result", JSON.stringify(result));
      window.location.href = "/results";
    }
  }, [result]);

  const handleAnalyzeHtml = useCallback((html: string, name: string, method: "paste" | "upload") => {
    analyzeHtml(html, name, method);
  }, [analyzeHtml]);

  return (
    <div className="flex flex-col min-h-screen">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
        style={{ background: "var(--accent)", color: "var(--text-inverse)" }}>Skip to main content</a>

      <div aria-live="polite" aria-atomic="true" className="sr-only" role="status">
        {stage === "fetching" && "Fetching page content."}
        {stage === "analyzing" && "Running accessibility analysis."}
        {stage === "scoring" && "Calculating scores."}
        {stage === "error" && error && `Error: ${error}`}
      </div>

      <Header />

      <main id="main-content" className="flex-1" role="main">
        {/* ══════════════════════════════════════════
            HERO — Aurora Background + Floating Orbs
            ══════════════════════════════════════════ */}
        <section className={`aurora-hero relative ${isScanning ? "py-12" : "min-h-[88vh] flex items-center"} transition-all duration-700`}>
          <FloatingOrbs />
          <div className="dot-grid absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 text-center px-6 w-full">
            {!isScanning && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}>
                <div className="glass inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-medium mb-8"
                  style={{ color: "var(--accent)" }}>
                  <Sparkles size={11} aria-hidden="true" />
                  Free &middot; Open Source &middot; Puppeteer + axe-core
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]"
                  style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.04em" }}>
                  <span style={{ color: "var(--text-primary)" }}>The Ultimate</span>
                  <br />
                  <span className="gradient-text-animated">Accessibility Checker</span>
                </h1>

                <p className="text-base md:text-lg mb-12 max-w-xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  125+ rules. 16 global legal frameworks. 20 custom checks beyond axe-core.
                  <br className="hidden md:block" />
                  Real browser rendering via Puppeteer. Accurate results.
                </p>
              </motion.div>
            )}

            {/* Scanner Card — Glass with Glow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto glass-strong rounded-2xl p-6 glow-accent"
            >
              <ScannerInput onScanUrl={scanUrl} onAnalyzeHtml={handleAnalyzeHtml} isScanning={isScanning} />
            </motion.div>

            {!isScanning && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
                <div className="flex items-center justify-center gap-5 mt-8 flex-wrap text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                  {["WCAG 2.2", "ADA", "EAA", "Section 508", "AODA", "DDA"].map((s) => (
                    <span key={s} className="flex items-center gap-1.5"><CheckCircle2 size={10} style={{ color: "var(--pass)" }} aria-hidden="true" /> {s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-8 mt-4 flex-wrap text-[10px]" style={{ color: "var(--text-tertiary)", opacity: 0.7 }}>
                  <span className="flex items-center gap-1"><Shield size={10} aria-hidden="true" /> Open Source</span>
                  <span className="flex items-center gap-1"><Zap size={10} aria-hidden="true" /> 125+ Rules</span>
                  <span className="flex items-center gap-1"><Lock size={10} aria-hidden="true" /> SSRF Protected</span>
                  <span className="flex items-center gap-1"><Globe size={10} aria-hidden="true" /> 16 Frameworks</span>
                </div>
              </motion.div>
            )}

            {isScanning && <ScanProgress stage={stage} />}

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 max-w-lg mx-auto p-4 rounded-xl text-sm flex items-center gap-2.5"
                style={{ background: "var(--severity-critical-bg)", border: "1px solid rgba(244,63,94,0.2)", color: "var(--severity-critical)" }}>
                <XCircle size={16} aria-hidden="true" /> {error}
              </motion.div>
            )}
          </div>
        </section>

        {/* ═══ LANDING SECTIONS ═══ */}
        {!isScanning && (
          <>
            {/* ── Why Accessibility ── */}
            <section id="why-a11y" className="relative py-24 px-6 scroll-mt-16">
              <div className="section-separator absolute top-0 left-0 right-0" />

              <div className="max-w-5xl mx-auto">
                <motion.div initial="hidden" whileInView="visible" viewport={vpOnce} variants={stagger} className="text-center mb-16">
                  <motion.p variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>
                    Why It Matters
                  </motion.p>
                  <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5"
                    style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}>
                    Why your website needs accessibility
                  </motion.h2>
                  <motion.p variants={fadeUp} className="text-base max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Web accessibility isn&rsquo;t optional. It&rsquo;s a legal obligation, a business advantage, and simply the right thing to do.
                  </motion.p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vpOnce} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
                  {[
                    { value: "1.3B", label: "People with disabilities", sub: "16% of global population", Icon: Users },
                    { value: "5,114", label: "ADA lawsuits in 2025", sub: "Up 27% year over year", Icon: Gavel },
                    { value: "96.3%", label: "Top 1M sites have issues", sub: "WebAIM Million report", Icon: BarChart3 },
                    { value: "$13T", label: "Spending power of PWD", sub: "Return on Disability Group", Icon: Globe },
                  ].map((stat) => (
                    <motion.div key={stat.label} variants={fadeUp}
                      className="rounded-2xl p-5 text-center gradient-border-card transition-all duration-300 hover:-translate-y-1"
                      style={{ background: "var(--bg-raised)" }}>
                      <stat.Icon size={18} className="mx-auto mb-3" style={{ color: "var(--accent)" }} aria-hidden="true" />
                      <div className="text-2xl md:text-3xl font-extrabold" style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>{stat.value}</div>
                      <div className="text-xs font-medium mt-1" style={{ color: "var(--text-primary)" }}>{stat.label}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{stat.sub}</div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Case Cards */}
                <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vpOnce} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {([
                    { Icon: Users, color: "var(--accent)", title: "The Human Case", points: ["1.3 billion people live with disabilities — larger than China's population", "Everyone benefits: captions in noisy places, contrast in sunlight, keyboard for power users"] },
                    { Icon: Gavel, color: "var(--severity-critical)", title: "The Legal Case", points: ["5,114 ADA lawsuits in 2025 — 77% target eCommerce", "California Unruh Act: $4,000 minimum per violation per visit"] },
                    { Icon: BarChart3, color: "var(--pass)", title: "The Business Case", points: ["$13 trillion annual spending power of people with disabilities", "Accessible sites rank higher — Google rewards semantic HTML and alt text"] },
                    { Icon: Code, color: "var(--severity-minor)", title: "The Technical Case", points: ["Accessible code is better code — semantic HTML, proper ARIA", "Catch issues early in development before they become expensive"] },
                  ] as { Icon: LucideIcon; color: string; title: string; points: string[] }[]).map((p) => (
                    <motion.div key={p.title} variants={fadeUp}
                      className="rounded-2xl p-6 gradient-border-card transition-all duration-300 hover:-translate-y-1"
                      style={{ background: "var(--bg-raised)" }}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: `color-mix(in srgb, ${p.color} 10%, transparent)`, color: p.color }}>
                          <p.Icon size={18} aria-hidden="true" />
                        </div>
                        <h3 className="text-base font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{p.title}</h3>
                      </div>
                      <ul className="space-y-2.5">
                        {p.points.map((pt, i) => (
                          <li key={i} className="flex gap-2.5 text-xs leading-relaxed">
                            <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5" style={{ color: p.color }} aria-hidden="true" />
                            <span style={{ color: "var(--text-secondary)" }}>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </motion.div>

                {/* WCAG Explainer */}
                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vpOnce}
                  className="mt-8 rounded-2xl p-6 gradient-border-card"
                  style={{ background: "var(--bg-raised)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}>
                      <FileSearch size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>What is WCAG?</h3>
                      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Web Content Accessibility Guidelines — the global standard</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                    {[
                      { letter: "P", name: "Perceivable", desc: "Content presentable in ways users can perceive", color: "var(--accent)" },
                      { letter: "O", name: "Operable", desc: "UI operable via keyboard, enough time, navigable", color: "var(--pass)" },
                      { letter: "U", name: "Understandable", desc: "Readable, predictable, helps avoid mistakes", color: "var(--severity-minor)" },
                      { letter: "R", name: "Robust", desc: "Works with assistive tech and future agents", color: "var(--severity-major)" },
                    ].map((p) => (
                      <div key={p.letter} className="rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5"
                        style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-default)" }}>
                        <div className="text-2xl font-extrabold" style={{ color: p.color, fontFamily: "var(--font-display)" }}>{p.letter}</div>
                        <div className="text-xs font-semibold mt-1" style={{ color: "var(--text-primary)" }}>{p.name}</div>
                        <div className="text-[10px] mt-0.5 leading-snug" style={{ color: "var(--text-tertiary)" }}>{p.desc}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* ── Features ── */}
            <section id="features" className="relative py-24 px-6 scroll-mt-16" style={{ background: "var(--bg-raised)" }}>
              <div className="section-separator absolute top-0 left-0 right-0" />
              <div className="max-w-5xl mx-auto">
                <motion.div initial="hidden" whileInView="visible" viewport={vpOnce} variants={stagger} className="text-center mb-16">
                  <motion.p variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>
                    Features
                  </motion.p>
                  <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5"
                    style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}>
                    More than a WCAG checker
                  </motion.h2>
                </motion.div>
                <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vpOnce} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {([
                    { Icon: ShieldCheck, title: "Accessibility Score", desc: "0-100 score with A-F grade. Track improvements over time." },
                    { Icon: Scale, title: "Legal Risk Mapping", desc: "Every issue mapped to ADA, EAA, Section 508, and 13 more laws." },
                    { Icon: Code, title: "Code-Level Fixes", desc: "Exact HTML element, CSS selector, and fix guidance for every issue." },
                    { Icon: BarChart3, title: "POUR Breakdown", desc: "Perceivable, Operable, Understandable, Robust principle analysis." },
                    { Icon: Users, title: "Impact Analysis", desc: "Visual, motor, cognitive, or auditory — who is affected and how." },
                    { Icon: Gavel, title: "Compliance Dashboard", desc: "Per-framework pass/fail with deadline alerts and penalty info." },
                  ] as { Icon: LucideIcon; title: string; desc: string }[]).map((f) => (
                    <motion.div key={f.title} variants={fadeUp}
                      className="rounded-2xl p-6 gradient-border-card transition-all duration-300 hover:-translate-y-1.5"
                      style={{ background: "var(--bg-base)", boxShadow: "var(--shadow-sm)" }}>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                        style={{ background: "var(--accent-subtle)", color: "var(--accent)", border: "1px solid var(--border-default)" }}>
                        <f.Icon size={20} aria-hidden="true" />
                      </div>
                      <h3 className="text-sm font-bold mb-2" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{f.title}</h3>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* ── How It Works ── */}
            <section id="how-it-works" className="relative py-24 px-6 scroll-mt-16">
              <div className="section-separator absolute top-0 left-0 right-0" />
              <div className="max-w-4xl mx-auto">
                <motion.div initial="hidden" whileInView="visible" viewport={vpOnce} variants={stagger} className="text-center mb-16">
                  <motion.p variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>
                    How It Works
                  </motion.p>
                  <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5"
                    style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}>
                    Three ways to scan
                  </motion.h2>
                </motion.div>
                <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vpOnce} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {([
                    { Icon: Search, step: "01", title: "Enter a URL", desc: "Puppeteer renders the full page — JS, CSS, images. Then axe-core + 20 custom checks run against the live DOM." },
                    { Icon: ClipboardPaste, step: "02", title: "Paste HTML", desc: "Paste raw HTML for instant client-side analysis. No server round-trip. Great for testing components." },
                    { Icon: Upload, step: "03", title: "Upload a File", desc: "Drag and drop .html files. 100% client-side. Perfect for testing before deployment." },
                  ] as { Icon: LucideIcon; step: string; title: string; desc: string }[]).map((s, i) => (
                    <motion.div key={s.step} variants={fadeUp} className="text-center group">
                      <div className="relative w-16 h-16 mx-auto mb-5">
                        <div className="absolute inset-0 rounded-2xl transition-all duration-300 group-hover:scale-110"
                          style={{ background: "var(--accent-subtle)", border: "1px solid var(--border-default)" }} />
                        <div className="relative w-full h-full flex items-center justify-center" style={{ color: "var(--accent)" }}>
                          <s.Icon size={24} aria-hidden="true" />
                        </div>
                      </div>
                      <div className="text-[10px] font-extrabold uppercase tracking-[0.25em] mb-2.5"
                        style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>Step {s.step}</div>
                      <h3 className="text-base font-bold mb-2.5" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{s.title}</h3>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* ── Standards ── */}
            <section id="standards" className="relative py-24 px-6 scroll-mt-16" style={{ background: "var(--bg-raised)" }}>
              <div className="section-separator absolute top-0 left-0 right-0" />
              <div className="max-w-5xl mx-auto">
                <motion.div initial="hidden" whileInView="visible" viewport={vpOnce} variants={stagger} className="text-center mb-16">
                  <motion.p variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>
                    Global Coverage
                  </motion.p>
                  <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5"
                    style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}>
                    16 legal frameworks. 6 continents.
                  </motion.h2>
                </motion.div>
                <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vpOnce} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[
                    { name: "ADA Title III", region: "USA", risk: "5,114 lawsuits in 2025" },
                    { name: "Section 508", region: "US Federal", risk: "Procurement required" },
                    { name: "EAA", region: "EU (27 states)", risk: "Up to 4% revenue" },
                    { name: "EN 301 549", region: "EU", risk: "Harmonised standard" },
                    { name: "Equality Act", region: "UK", risk: "Compensation orders" },
                    { name: "AODA", region: "Canada", risk: "CAD 100K/day" },
                    { name: "ACA", region: "Canada Federal", risk: "CAD 250K/violation" },
                    { name: "DDA", region: "Australia", risk: "Court orders" },
                    { name: "Unruh Act", region: "California", risk: "$4K/violation" },
                    { name: "ADA Title II", region: "USA", risk: "Deadline: Apr 2026" },
                    { name: "JIS X 8341", region: "Japan", risk: "Since 2024" },
                    { name: "KDDA", region: "South Korea", risk: "All orgs since 2013" },
                    { name: "RPD Act", region: "India", risk: "Gov mandate" },
                    { name: "NZ WAS 1.1", region: "New Zealand", risk: "Gov standard" },
                    { name: "SI 5568", region: "Israel", risk: "ILS 75K offense" },
                    { name: "EU WAD", region: "EU Public Sector", risk: "Monitoring" },
                  ].map((fw) => (
                    <motion.div key={fw.name} variants={fadeUp}
                      className="rounded-xl p-4 gradient-border-card transition-all duration-300 hover:-translate-y-0.5"
                      style={{ background: "var(--bg-base)" }}>
                      <div className="flex items-start justify-between mb-1.5">
                        <h4 className="text-xs font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{fw.name}</h4>
                        <Scale size={11} style={{ color: "var(--text-tertiary)" }} aria-hidden="true" />
                      </div>
                      <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{fw.region}</p>
                      <p className="text-[10px] mt-1.5 font-medium" style={{ color: "var(--severity-major)" }}>{fw.risk}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* ── CTA ── */}
            <section className="aurora-hero relative py-28 px-6 overflow-hidden">
              <div className="section-separator absolute top-0 left-0 right-0" />
              <FloatingOrbs />
              <div className="relative z-10 max-w-2xl mx-auto text-center">
                <motion.div initial="hidden" whileInView="visible" viewport={vpOnce} variants={stagger}>
                  <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5"
                    style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}>
                    Ready to check your site?
                  </motion.h2>
                  <motion.p variants={fadeUp} className="text-base mb-10" style={{ color: "var(--text-secondary)" }}>
                    Free. Open source. No account required.
                  </motion.p>
                  <motion.div variants={fadeUp}>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className="scan-btn h-12 px-8 rounded-xl text-sm font-bold cursor-pointer inline-flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95"
                      style={{ color: "var(--text-inverse)" }}>
                      <span className="flex items-center gap-2">Scan Now <ArrowRight size={15} /></span>
                    </button>
                  </motion.div>
                </motion.div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
