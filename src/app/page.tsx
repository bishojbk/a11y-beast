"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Shield, Scale, Zap, Globe, Lock, Eye, Code, FileSearch,
  ArrowRight, CheckCircle2, XCircle,
  Monitor, Smartphone, Upload, ClipboardPaste, Search,
  BarChart3, Users, Gavel, ShieldCheck, BrainCircuit,
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

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const vpOnce = { once: true, amount: 0.01 };

/* ── Scan Progress ── */
function ScanProgress({ stage }: { stage: ScanStage }) {
  const idx = STAGES.findIndex((s) => s.key === stage);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xs mx-auto mt-10 space-y-2.5">
      {STAGES.map((s, i) => (
        <motion.div key={s.key} initial={{ opacity: 0, x: -8 }} animate={{ opacity: i <= idx ? 1 : 0.25, x: 0 }} transition={{ delay: i * 0.08 }}
          className="flex items-center gap-2.5 text-xs">
          {i < idx ? (
            <span className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "var(--pass-bg)", color: "var(--pass)" }}>
              <CheckCircle2 size={12} />
            </span>
          ) : i === idx ? (
            <span className="w-4 h-4 rounded-full animate-scan-pulse" style={{ background: "var(--accent)" }} />
          ) : (
            <span className="w-4 h-4 rounded-full" style={{ background: "var(--border-default)" }} />
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
    <div className="max-w-2xl mx-auto w-full">
      <div role="tablist" aria-label="Scan input method" className="flex gap-1 p-1 rounded-[var(--radius-md)] mb-4 w-fit mx-auto" style={{ background: "var(--bg-overlay)" }}>
        {tabs.map((t) => (
          <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)} disabled={isScanning}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            style={{ background: tab === t.key ? "var(--bg-raised)" : "transparent", color: tab === t.key ? "var(--text-primary)" : "var(--text-tertiary)", boxShadow: tab === t.key ? "var(--shadow-sm)" : "none" }}>
            <t.Icon size={13} aria-hidden="true" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "url" && (
        <form onSubmit={(e) => { e.preventDefault(); if (url.trim()) onScanUrl(url.trim()); }} className="flex gap-2">
          <label htmlFor="url-input" className="sr-only">Website URL to scan</label>
          <input id="url-input" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" disabled={isScanning} autoComplete="url"
            className="flex-1 h-12 px-4 rounded-[var(--radius-md)] text-sm transition-all outline-none"
            style={{ background: "var(--bg-input)", border: "1px solid var(--border-strong)", color: "var(--text-primary)" }} />
          <button type="submit" disabled={isScanning || !url.trim()}
            className="h-12 px-7 rounded-[var(--radius-md)] text-sm font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{ background: "var(--accent)", color: "var(--text-inverse)", boxShadow: "var(--shadow-glow)" }}>
            {isScanning ? "Scanning..." : "Scan"}
          </button>
        </form>
      )}

      {tab === "paste" && (
        <div className="space-y-3">
          <label htmlFor="html-paste" className="sr-only">HTML code to analyze</label>
          <textarea id="html-paste" value={html} onChange={(e) => setHtml(e.target.value)} placeholder="Paste your HTML here..." rows={8} disabled={isScanning}
            className="w-full rounded-[var(--radius-md)] p-4 text-xs outline-none resize-y"
            style={{ background: "var(--bg-input)", border: "1px solid var(--border-strong)", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }} />
          <button onClick={() => { if (html.trim()) onAnalyzeHtml(html, "pasted-html", "paste"); }} disabled={isScanning || !html.trim()}
            className="h-10 px-6 rounded-[var(--radius-md)] text-sm font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "var(--accent)", color: "var(--text-inverse)", boxShadow: "var(--shadow-glow)" }}>
            Analyze HTML
          </button>
        </div>
      )}

      {tab === "upload" && (
        <div className="flex flex-col items-center gap-3">
          <label htmlFor="file-upload" tabIndex={0} role="button"
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileRef.current?.click(); } }}
            className="w-full rounded-[var(--radius-lg)] p-10 text-center cursor-pointer transition-all hover:scale-[1.01]"
            style={{ border: "2px dashed var(--border-strong)", background: "var(--accent-subtle)" }}>
            <Upload size={28} className="mx-auto mb-2" style={{ color: "var(--text-tertiary)" }} aria-hidden="true" />
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Drop .html file here or click to browse</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Accepts .html and .htm files, max 5MB</p>
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

      <main id="main-content" className="flex-1 px-6" role="main">
        {/* ── Hero + Scanner ── */}
        <section className={`${isScanning ? "py-10" : "py-16 md:py-24"} transition-all`}>
          <div className="text-center">
            {!isScanning && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium mb-6"
                  style={{ background: "var(--accent-subtle)", color: "var(--accent)", border: "1px solid var(--border-default)" }}>
                  Free &middot; Open Source &middot; Puppeteer + axe-core
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
                  The Ultimate<br />Accessibility Checker
                </h1>
                <p className="text-base md:text-lg mb-10 max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
                  125+ rules. 16 global legal frameworks. 20 custom checks beyond axe-core.<br />Real browser rendering via Puppeteer. Accurate results.
                </p>
              </motion.div>
            )}

            <ScannerInput onScanUrl={scanUrl} onAnalyzeHtml={handleAnalyzeHtml} isScanning={isScanning} />

            {!isScanning && (
              <>
                <div className="flex items-center justify-center gap-4 mt-6 flex-wrap text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                  {["WCAG 2.2", "ADA", "EAA", "Section 508", "AODA", "DDA"].map((s) => (
                    <span key={s} className="flex items-center gap-1"><CheckCircle2 size={10} style={{ color: "var(--pass)" }} aria-hidden="true" /> {s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-6 mt-3 flex-wrap text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                  <span className="flex items-center gap-1"><Shield size={10} aria-hidden="true" /> Open Source</span>
                  <span className="flex items-center gap-1"><Zap size={10} aria-hidden="true" /> 125+ Rules</span>
                  <span className="flex items-center gap-1"><Lock size={10} aria-hidden="true" /> SSRF Protected</span>
                  <span className="flex items-center gap-1"><Globe size={10} aria-hidden="true" /> 16 Frameworks</span>
                </div>
              </>
            )}

            {isScanning && <ScanProgress stage={stage} />}

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 max-w-lg mx-auto p-4 rounded-[var(--radius-md)] text-sm flex items-center gap-2"
                style={{ background: "var(--severity-critical-bg)", border: "1px solid var(--severity-critical)", color: "var(--severity-critical)" }}>
                <XCircle size={16} aria-hidden="true" /> {error}
              </motion.div>
            )}
          </div>
        </section>

        {/* ═══ LANDING SECTIONS ═══ */}
        {!isScanning && (
          <>
            {/* ── Why Accessibility ── */}
            <section id="why-a11y" className="py-20 scroll-mt-16" style={{ borderTop: "1px solid var(--border-default)" }}>
              <div className="max-w-5xl mx-auto">
                <motion.div initial="hidden" whileInView="visible" viewport={vpOnce} variants={stagger} className="text-center mb-14">
                  <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>Why It Matters</motion.p>
                  <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ color: "var(--text-primary)" }}>Why your website needs accessibility</motion.h2>
                  <motion.p variants={fadeUp} className="text-base max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Web accessibility isn&rsquo;t optional. It&rsquo;s a legal obligation, a business advantage, and simply the right thing to do.
                  </motion.p>
                </motion.div>

                <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vpOnce} className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
                  {[
                    { value: "1.3B", label: "People with disabilities", sub: "16% of global population", Icon: Users },
                    { value: "5,114", label: "ADA lawsuits in 2025", sub: "Up 27% year over year", Icon: Gavel },
                    { value: "96.3%", label: "Top 1M sites have issues", sub: "WebAIM Million report", Icon: BarChart3 },
                    { value: "$13T", label: "Spending power of PWD", sub: "Return on Disability Group", Icon: Globe },
                  ].map((stat) => (
                    <motion.div key={stat.label} variants={fadeUp} className="rounded-[var(--radius-lg)] p-4 text-center"
                      style={{ background: "var(--bg-raised)", border: "1px solid var(--border-default)" }}>
                      <stat.Icon size={20} className="mx-auto mb-2" style={{ color: "var(--accent)" }} aria-hidden="true" />
                      <div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>{stat.value}</div>
                      <div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{stat.label}</div>
                      <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{stat.sub}</div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vpOnce} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {([
                    { Icon: Users, color: "var(--accent)", title: "The Human Case", points: ["1.3 billion people live with disabilities — larger than China's population", "Everyone benefits: captions in noisy places, contrast in sunlight, keyboard for power users"] },
                    { Icon: Gavel, color: "var(--severity-critical)", title: "The Legal Case", points: ["5,114 ADA lawsuits in 2025 — 77% target eCommerce", "California Unruh Act: $4,000 minimum per violation per visit"] },
                    { Icon: BarChart3, color: "var(--pass)", title: "The Business Case", points: ["$13 trillion annual spending power of people with disabilities", "Accessible sites rank higher — Google rewards semantic HTML and alt text"] },
                    { Icon: Code, color: "var(--severity-minor)", title: "The Technical Case", points: ["Accessible code is better code — semantic HTML, proper ARIA", "Catch issues early in development before they become expensive"] },
                  ] as { Icon: LucideIcon; color: string; title: string; points: string[] }[]).map((p) => (
                    <motion.div key={p.title} variants={fadeUp} className="rounded-[var(--radius-lg)] p-5"
                      style={{ background: "var(--bg-raised)", border: "1px solid var(--border-default)" }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `color-mix(in srgb, ${p.color} 12%, transparent)`, color: p.color }}>
                          <p.Icon size={18} aria-hidden="true" />
                        </div>
                        <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>{p.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {p.points.map((pt, i) => (
                          <li key={i} className="flex gap-2 text-xs leading-relaxed">
                            <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5" style={{ color: p.color }} aria-hidden="true" />
                            <span style={{ color: "var(--text-secondary)" }}>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </motion.div>

                {/* WCAG explainer */}
                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vpOnce} className="mt-10 rounded-[var(--radius-lg)] p-5"
                  style={{ background: "var(--bg-raised)", border: "1px solid var(--border-default)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}>
                      <FileSearch size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>What is WCAG?</h3>
                      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Web Content Accessibility Guidelines — the global standard</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {[
                      { letter: "P", name: "Perceivable", desc: "Content presentable in ways users can perceive", color: "var(--accent)" },
                      { letter: "O", name: "Operable", desc: "UI operable via keyboard, enough time, navigable", color: "var(--pass)" },
                      { letter: "U", name: "Understandable", desc: "Readable, predictable, helps avoid mistakes", color: "var(--severity-minor)" },
                      { letter: "R", name: "Robust", desc: "Works with assistive tech and future agents", color: "var(--severity-major)" },
                    ].map((p) => (
                      <div key={p.letter} className="rounded-[var(--radius-md)] p-3" style={{ background: "var(--bg-overlay)" }}>
                        <div className="text-lg font-bold" style={{ color: p.color }}>{p.letter}</div>
                        <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{p.name}</div>
                        <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{p.desc}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* ── Features ── */}
            <section id="features" className="py-20 scroll-mt-16" style={{ background: "var(--bg-raised)", borderTop: "1px solid var(--border-default)", borderBottom: "1px solid var(--border-default)" }}>
              <div className="max-w-5xl mx-auto">
                <motion.div initial="hidden" whileInView="visible" viewport={vpOnce} variants={stagger} className="text-center mb-14">
                  <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>Features</motion.p>
                  <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ color: "var(--text-primary)" }}>More than a WCAG checker</motion.h2>
                </motion.div>
                <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vpOnce} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {([
                    { Icon: ShieldCheck, title: "Accessibility Score", desc: "0-100 score with A-F grade. Track improvements." },
                    { Icon: Scale, title: "Legal Risk Mapping", desc: "Every issue mapped to ADA, EAA, Section 508, and 13 more laws." },
                    { Icon: Code, title: "Code-Level Fixes", desc: "Exact HTML element, CSS selector, and fix guidance." },
                    { Icon: BarChart3, title: "POUR Breakdown", desc: "Perceivable, Operable, Understandable, Robust principles." },
                    { Icon: Users, title: "Impact Analysis", desc: "Visual, motor, cognitive, or auditory — who is affected." },
                    { Icon: Gavel, title: "Compliance Dashboard", desc: "Per-framework pass/fail with deadline alerts." },
                  ] as { Icon: LucideIcon; title: string; desc: string }[]).map((f) => (
                    <motion.div key={f.title} variants={fadeUp} whileHover={{ y: -3 }} className="rounded-[var(--radius-lg)] p-5"
                      style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)" }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}>
                        <f.Icon size={20} aria-hidden="true" />
                      </div>
                      <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* ── How It Works ── */}
            <section id="how-it-works" className="py-20 scroll-mt-16">
              <div className="max-w-4xl mx-auto">
                <motion.div initial="hidden" whileInView="visible" viewport={vpOnce} variants={stagger} className="text-center mb-14">
                  <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>How It Works</motion.p>
                  <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ color: "var(--text-primary)" }}>Three ways to scan</motion.h2>
                </motion.div>
                <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={vpOnce} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {([
                    { Icon: Search, step: "1", title: "Enter a URL", desc: "Puppeteer renders the full page — JS, CSS, images. Then axe-core + 20 custom checks run against the live DOM." },
                    { Icon: ClipboardPaste, step: "2", title: "Paste HTML", desc: "Paste raw HTML for instant client-side analysis. No server round-trip. Great for testing components." },
                    { Icon: Upload, step: "3", title: "Upload a File", desc: "Drag and drop .html files. 100% client-side. Perfect for testing before deployment." },
                  ] as { Icon: LucideIcon; step: string; title: string; desc: string }[]).map((s) => (
                    <motion.div key={s.step} variants={fadeUp} className="text-center">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: "var(--accent-subtle)", color: "var(--accent)", border: "1px solid var(--border-default)" }}>
                        <s.Icon size={24} aria-hidden="true" />
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-tertiary)" }}>Step {s.step}</div>
                      <h3 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* ── Standards ── */}
            <section id="standards" className="py-20 scroll-mt-16" style={{ background: "var(--bg-raised)", borderTop: "1px solid var(--border-default)", borderBottom: "1px solid var(--border-default)" }}>
              <div className="max-w-5xl mx-auto">
                <motion.div initial="hidden" whileInView="visible" viewport={vpOnce} variants={stagger} className="text-center mb-14">
                  <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>Global Coverage</motion.p>
                  <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ color: "var(--text-primary)" }}>16 legal frameworks. 6 continents.</motion.h2>
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
                    <motion.div key={fw.name} variants={fadeUp} className="rounded-[var(--radius-md)] p-3.5"
                      style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)" }}>
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{fw.name}</h4>
                        <Scale size={11} style={{ color: "var(--text-tertiary)" }} aria-hidden="true" />
                      </div>
                      <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{fw.region}</p>
                      <p className="text-[10px] mt-1" style={{ color: "var(--severity-major)" }}>{fw.risk}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-20">
              <div className="max-w-2xl mx-auto text-center">
                <motion.div initial="hidden" whileInView="visible" viewport={vpOnce} variants={stagger}>
                  <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ color: "var(--text-primary)" }}>
                    Ready to check your site?
                  </motion.h2>
                  <motion.p variants={fadeUp} className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>
                    Free. Open source. No account required.
                  </motion.p>
                  <motion.div variants={fadeUp}>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className="h-11 px-6 rounded-[var(--radius-md)] text-sm font-semibold cursor-pointer inline-flex items-center gap-2 transition-all"
                      style={{ background: "var(--accent)", color: "var(--text-inverse)", boxShadow: "var(--shadow-glow)" }}>
                      Scan Now <ArrowRight size={14} />
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
