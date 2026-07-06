"use client";

import Link from "next/link";
import { LogoIcon } from "./Logo";

export default function Footer() {
  return (
    <footer
      className="footer"
      role="contentinfo"
      style={{
        borderTop: "1px solid var(--border-default)",
        padding: "60px 28px 40px",
      }}
    >
      <div
        className="footer-inner"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 40,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <LogoIcon size={24} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--text-primary)" }}>
              A11y Beast
            </span>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 13.5, maxWidth: "38ch", lineHeight: 1.6 }}>
            An honest accessibility scanner that maps every issue to the laws it touches — and writes down what you
            tested. Not legal advice; automation catches ~30–40% of WCAG, so pair us with a human review for the rest.
          </p>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16, fontSize: 12.5, color: "var(--pass)", fontWeight: 600 }}
          >
            <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--pass)" }} />
            This site passes its own scan · 0 violations
          </span>
        </div>

        <div>
          <h2
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--text-tertiary)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: 14,
              fontWeight: 500,
            }}
          >
            Product
          </h2>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {([
              { label: "Web scanner", href: "/#scan", internal: true },
              { label: "Features", href: "/features", internal: true },
              { label: "CLI", href: "/cli", internal: true, badge: "Pro" },
              { label: "Sample report", href: "/results?sample=1", internal: true },
            ] as { label: string; href: string; internal: boolean; badge?: string }[]).map((l) => {
              const inner = (
                <>
                  {l.label}
                  {l.badge && (
                    <span
                      className="mono"
                      style={{
                        marginLeft: 7,
                        fontSize: 9,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--accent-text)",
                        background: "var(--accent-wash)",
                        border: "1px solid var(--accent-line)",
                        borderRadius: 3,
                        padding: "1px 5px",
                        verticalAlign: "middle",
                      }}
                    >
                      {l.badge}
                    </span>
                  )}
                </>
              );
              return l.internal ? (
                <li key={l.label}>
                  <Link href={l.href} style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                    {inner}
                  </Link>
                </li>
              ) : (
                <li key={l.label}>
                  <a href={l.href} style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                    {inner}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h2
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--text-tertiary)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: 14,
              fontWeight: 500,
            }}
          >
            Frameworks
          </h2>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              "ADA Title II & III",
              "EAA + EN 301 549",
              "UK Equality Act",
              "Section 508",
              "All 16 ›",
            ].map((l) => (
              <li key={l}>
                <Link href="/#frameworks" style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--text-tertiary)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: 14,
              fontWeight: 500,
            }}
          >
            Resources
          </h2>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            <li>
              <Link href="/blog" style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                Blog
              </Link>
            </li>
            <li>
              <Link href="/accessibility-statement-generator" style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                Statement generator
              </Link>
            </li>
            <li>
              <a
                href="https://www.w3.org/WAI/standards-guidelines/wcag/"
                style={{ color: "var(--text-secondary)", fontSize: 14 }}
              >
                WCAG 2.2 cheatsheet
              </a>
            </li>
            <li>
              <a
                href="https://www.deque.com/axe/core-documentation/"
                style={{ color: "var(--text-secondary)", fontSize: 14 }}
              >
                axe-core docs
              </a>
            </li>
            <li>
              <a
                href="https://github.com/bishojbk/a11y-beast"
                style={{ color: "var(--text-secondary)", fontSize: 14 }}
              >
                Open-source (AGPL-3.0)
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        className="footer-legal"
        style={{
          maxWidth: 1280,
          margin: "60px auto 0",
          paddingTop: 24,
          borderTop: "1px solid var(--border-default)",
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          fontSize: 11,
          color: "var(--text-tertiary)",
          letterSpacing: "0.06em",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span>
          <Link href="/privacy" style={{ color: "inherit", textDecoration: "underline" }}>Privacy</Link>
          {" · "}
          <Link href="/terms" style={{ color: "inherit", textDecoration: "underline" }}>Terms</Link>
        </span>
        <span>A11Y BEAST · BUILT OPEN · AGPL-3.0</span>
        <span>AXE-CORE BY DEQUE SYSTEMS · MPL-2.0</span>
        <span>NOT LEGAL ADVICE · USE WITH AN AUDIT</span>
      </div>

      <div style={{ textAlign: "center", padding: "16px 0 0", fontSize: 13, color: "var(--text-tertiary)" }}>
        Made by <a href="https://github.com/bishojbk" style={{ color: "inherit", textDecoration: "underline" }}>EJR</a>
      </div>
    </footer>
  );
}
