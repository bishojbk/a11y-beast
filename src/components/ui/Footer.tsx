"use client";

import { ShieldCheck, Zap, Lock, Eye } from "lucide-react";
import { LogoIcon } from "./Logo";

export default function Footer() {
  return (
    <footer className="relative px-6 pt-20 pb-10" role="contentinfo" style={{ background: "var(--bg-raised)" }}>
      {/* Gradient top separator */}
      <div className="section-separator absolute top-0 left-0 right-0" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] mb-5" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>Product</h3>
            <ul className="space-y-3 text-xs" style={{ color: "var(--text-tertiary)" }}>
              {[
                { label: "Features", href: "/#features" },
                { label: "How It Works", href: "/#how-it-works" },
                { label: "Standards", href: "/#standards" },
                { label: "Why Accessibility", href: "/#why-a11y" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition-colors duration-200 hover:text-[var(--text-primary)]">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] mb-5" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>Standards</h3>
            <ul className="space-y-3 text-xs" style={{ color: "var(--text-tertiary)" }}>
              <li>WCAG 2.2 (A & AA)</li>
              <li>ADA Title II & III</li>
              <li>European Accessibility Act</li>
              <li>Section 508 &middot; AODA &middot; DDA</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] mb-5" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>Resources</h3>
            <ul className="space-y-3 text-xs" style={{ color: "var(--text-tertiary)" }}>
              <li><a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-[var(--text-primary)]">WCAG Guidelines</a></li>
              <li><a href="https://www.deque.com/axe/core-documentation/" target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-[var(--text-primary)]">axe-core Docs</a></li>
              <li><a href="https://webaim.org/resources/contrastchecker/" target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-[var(--text-primary)]">Contrast Checker</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] mb-5" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>Legal</h3>
            <ul className="space-y-3 text-xs" style={{ color: "var(--text-tertiary)" }}>
              <li>AGPL-3.0 License</li>
              <li>No data collected</li>
              <li>Not legal advice</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-6 mb-8 text-[11px] rounded-xl"
          style={{ background: "var(--glass-bg)", border: "1px solid var(--border-default)", color: "var(--text-tertiary)" }}>
          <span className="flex items-center gap-1.5"><ShieldCheck size={13} style={{ color: "var(--pass)" }} aria-hidden="true" /> Open Source</span>
          <span className="flex items-center gap-1.5"><Zap size={13} style={{ color: "var(--severity-minor)" }} aria-hidden="true" /> Powered by axe-core</span>
          <span className="flex items-center gap-1.5"><Lock size={13} style={{ color: "var(--accent)" }} aria-hidden="true" /> Client-side + Puppeteer</span>
          <span className="flex items-center gap-1.5"><Eye size={13} style={{ color: "var(--accent-tertiary)" }} aria-hidden="true" /> Zero false positives</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
          <div className="flex items-center gap-2.5">
            <div style={{ filter: "drop-shadow(0 0 6px rgba(139,92,246,0.3))" }}>
              <LogoIcon size={18} />
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>A11y Beast</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <span className="font-mono text-[10px]" style={{ color: "var(--text-tertiary)", opacity: 0.6 }}>Next.js &middot; axe-core &middot; Tailwind &middot; Framer Motion</span>
        </div>
      </div>
    </footer>
  );
}
