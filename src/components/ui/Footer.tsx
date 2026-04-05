"use client";

import { ShieldCheck, Zap, Lock, Eye } from "lucide-react";
import { LogoIcon } from "./Logo";

export default function Footer() {
  return (
    <footer className="px-6 pt-16 pb-8" role="contentinfo" style={{ borderTop: "1px solid var(--border-default)", background: "var(--bg-raised)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-primary)" }}>Product</h3>
            <ul className="space-y-2.5 text-xs" style={{ color: "var(--text-secondary)" }}>
              <li><a href="/#features" className="hover:underline underline-offset-2">Features</a></li>
              <li><a href="/#how-it-works" className="hover:underline underline-offset-2">How It Works</a></li>
              <li><a href="/#standards" className="hover:underline underline-offset-2">Standards</a></li>
              <li><a href="/#why-a11y" className="hover:underline underline-offset-2">Why Accessibility</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-primary)" }}>Standards</h3>
            <ul className="space-y-2.5 text-xs" style={{ color: "var(--text-secondary)" }}>
              <li>WCAG 2.2 (A & AA)</li>
              <li>ADA Title II & III</li>
              <li>European Accessibility Act</li>
              <li>Section 508 &middot; AODA &middot; DDA</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-primary)" }}>Resources</h3>
            <ul className="space-y-2.5 text-xs" style={{ color: "var(--text-secondary)" }}>
              <li><a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-2">WCAG Guidelines</a></li>
              <li><a href="https://www.deque.com/axe/core-documentation/" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-2">axe-core Docs</a></li>
              <li><a href="https://webaim.org/resources/contrastchecker/" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-2">Contrast Checker</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-primary)" }}>Legal</h3>
            <ul className="space-y-2.5 text-xs" style={{ color: "var(--text-secondary)" }}>
              <li>AGPL-3.0 License</li>
              <li>No data collected</li>
              <li>Not legal advice</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-6 mb-6 text-xs" style={{ borderTop: "1px solid var(--border-default)", borderBottom: "1px solid var(--border-default)", color: "var(--text-tertiary)" }}>
          <span className="flex items-center gap-1.5"><ShieldCheck size={14} style={{ color: "var(--pass)" }} aria-hidden="true" /> Open Source</span>
          <span className="flex items-center gap-1.5"><Zap size={14} style={{ color: "var(--severity-minor)" }} aria-hidden="true" /> Powered by axe-core</span>
          <span className="flex items-center gap-1.5"><Lock size={14} style={{ color: "var(--accent)" }} aria-hidden="true" /> Client-side + Puppeteer</span>
          <span className="flex items-center gap-1.5"><Eye size={14} style={{ color: "var(--severity-major)" }} aria-hidden="true" /> Zero false positives</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
          <div className="flex items-center gap-2">
            <LogoIcon size={18} />
            <span>A11y Beast &copy; {new Date().getFullYear()}</span>
          </div>
          <span>Next.js &middot; axe-core &middot; Tailwind &middot; Framer Motion</span>
        </div>
      </div>
    </footer>
  );
}
