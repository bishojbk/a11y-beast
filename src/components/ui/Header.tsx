"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, Sun, Moon, ScanSearch, BarChart3 } from "lucide-react";
import { LogoIcon } from "./Logo";

function ThemeToggle() {
  const [dark, setDark] = useState(true);
  useEffect(() => { setDark(document.documentElement.getAttribute("data-theme") !== "light"); }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  return (
    <button onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer text-sm transition-all hover:scale-105"
      style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}

export default function Header({ showNav = true }: { showNav?: boolean }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl px-6 py-3" role="banner"
      style={{ background: "color-mix(in srgb, var(--bg-base) 80%, transparent)", borderBottom: "1px solid var(--border-default)" }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="transition-transform group-hover:scale-110" style={{ filter: "drop-shadow(0 0 8px rgba(99,102,241,0.3))" }}>
            <LogoIcon size={32} />
          </div>
          <span className="text-base font-bold" style={{ color: "var(--text-primary)" }}>A11y Beast</span>
        </Link>

        <div className="flex items-center gap-4">
          {showNav && (
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
              <Link href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                style={{ color: "var(--text-secondary)" }}>
                <Home size={13} /> Home
              </Link>
              <Link href="/#features" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                style={{ color: "var(--text-secondary)" }}>
                <ScanSearch size={13} /> Features
              </Link>
              <Link href="/#standards" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                style={{ color: "var(--text-secondary)" }}>
                <BarChart3 size={13} /> Standards
              </Link>
            </nav>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
