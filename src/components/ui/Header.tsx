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
      className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer text-sm transition-all duration-300 hover:scale-110 active:scale-95"
      style={{
        background: "var(--glass-bg-strong)",
        border: "1px solid var(--glass-border)",
        color: "var(--text-secondary)",
        backdropFilter: "blur(8px)",
      }}>
      {dark ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}

export default function Header({ showNav = true }: { showNav?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 px-6 py-3 transition-all duration-500"
      role="banner"
      style={{
        background: scrolled
          ? "color-mix(in srgb, var(--bg-base) 85%, transparent)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(120%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(120%)" : "none",
        borderBottom: scrolled ? "1px solid var(--glass-border)" : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
            style={{ filter: "drop-shadow(0 0 10px rgba(139,92,246,0.4))" }}>
            <LogoIcon size={30} />
          </div>
          <span className="text-sm font-bold tracking-tight" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
            A11y Beast
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {showNav && (
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-0.5 mr-2">
              {[
                { href: "/", label: "Home", Icon: Home },
                { href: "/#features", label: "Features", Icon: ScanSearch },
                { href: "/#standards", label: "Standards", Icon: BarChart3 },
              ].map((item) => (
                <Link key={item.href} href={item.href}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                  style={{ color: "var(--text-tertiary)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--text-primary)";
                    e.currentTarget.style.background = "var(--glass-bg-strong)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-tertiary)";
                    e.currentTarget.style.background = "transparent";
                  }}>
                  <item.Icon size={13} /> {item.label}
                </Link>
              ))}
            </nav>
          )}
          <ThemeToggle />
        </div>
      </div>

      {/* Gradient accent line — visible when scrolled */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500"
        style={{
          opacity: scrolled ? 1 : 0,
          background: "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.28) 30%, rgba(59,130,246,0.18) 50%, rgba(236,72,153,0.28) 70%, transparent 100%)",
        }}
      />
    </header>
  );
}
