"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Sun, Moon, Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoIcon } from "./Logo";

// The inline theme-init script in layout.tsx mutates <html data-theme="…">
// before hydration. useSyncExternalStore lets us read that value on the
// client while the SSR snapshot stays stable (dark), so hydration matches.
function subscribeTheme(cb: () => void) {
  if (typeof document === "undefined") return () => {};
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => obs.disconnect();
}
function getThemeSnapshot() {
  return document.documentElement.getAttribute("data-theme") !== "light";
}
function getThemeServerSnapshot() {
  return true;
}

const NAV_ITEMS = [
  { href: "/features", label: "Features", desc: "Everything it does, by tier" },
  { href: "/#frameworks", label: "Frameworks", desc: "16 legal frameworks we map to" },
  { href: "/#how", label: "How it works", desc: "Puppeteer · axe-core · 110+ rules" },
  { href: "/pricing", label: "Pricing", desc: "Free · Pro · Agency" },
  { href: "/results?sample=1", label: "Sample report", desc: "See a live results dashboard" },
  { href: "/blog", label: "Blog", desc: "Accessibility law, in plain English" },
  { href: "/about", label: "About", desc: "How it works · what we won't claim" },
];

function ThemeToggle({ large }: { large?: boolean }) {
  const dark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);

  const toggle = () => {
    const next = !dark;
    document.documentElement.setAttribute("data-theme", next ? "" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  if (large) {
    return (
      <button
        onClick={toggle}
        suppressHydrationWarning
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-muted hover:text-foreground bg-surface-overlay border border-edge transition-colors cursor-pointer"
      >
        {dark ? <Sun size={16} /> : <Moon size={16} />}
        <span>{dark ? "Light mode" : "Dark mode"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      suppressHydrationWarning
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 text-faint hover:text-foreground bg-surface-overlay border border-edge"
    >
      {dark ? <Sun size={13} /> : <Moon size={13} />}
    </button>
  );
}

export default function Header({ showNav = true }: { showNav?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 px-6 py-3 transition-all duration-300 ${
        scrolled || mobileOpen ? "bg-background/95 backdrop-blur-md border-b border-edge" : ""
      }`}
      role="banner"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
          <LogoIcon size={26} />
          <span className="mono text-foreground" style={{ fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            A11y Beast
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {showNav && (
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 text-faint hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {showNav && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer text-faint hover:text-foreground bg-surface-overlay border border-edge"
            >
              {mobileOpen ? <X size={14} /> : <Menu size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {showNav && mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-[49px] z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              aria-label="Mobile navigation"
              className="absolute top-full left-0 right-0 z-50 md:hidden bg-background border-b border-edge"
            >
              <div className="px-4 pt-3 pb-5 space-y-1">
                {/* Nav links */}
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between px-4 py-3.5 rounded-xl text-foreground hover:bg-surface-overlay transition-colors group"
                    >
                      <div>
                        <div className="text-sm font-semibold">{item.label}</div>
                        <div className="text-xs text-faint mt-0.5">{item.desc}</div>
                      </div>
                      <ArrowUpRight size={14} className="text-faint group-hover:text-accent transition-colors" />
                    </Link>
                  </motion.div>
                ))}

                {/* Divider */}
                <div className="h-px bg-edge my-2 mx-4" />

                {/* Theme toggle */}
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <ThemeToggle large />
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-2"
                >
                  <Link
                    href="/#scan"
                    onClick={() => setMobileOpen(false)}
                    className="scan-btn flex items-center justify-center gap-2 w-full h-12 rounded-xl text-sm font-semibold"
                  >
                    Scan Your Site
                  </Link>
                </motion.div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
