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
            <LogoIcon size={22} />
            <span
              className="mono"
              style={{ letterSpacing: "0.1em", fontSize: 13, color: "var(--text-primary)" }}
            >
              A11Y&nbsp;·&nbsp;BEAST
            </span>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, maxWidth: "38ch", lineHeight: 1.55 }}>
            Open-source. Scan data stored only in your browser session. Not legal advice — automated tools catch
            30–40% of WCAG issues. For the rest, pair us with an audit.
          </p>
        </div>

        <div>
          <h5
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
          </h5>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Web scanner", href: "/", internal: true },
              { label: "CLI (npx accesslens)", href: "#cli", internal: false },
              { label: "Sample report", href: "/results?sample=1", internal: true },
              { label: "API", href: "#api", internal: false },
            ].map((l) =>
              l.internal ? (
                <li key={l.label}>
                  <Link href={l.href} style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                    {l.label}
                  </Link>
                </li>
              ) : (
                <li key={l.label}>
                  <a href={l.href} style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                    {l.label}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        <div>
          <h5
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
          </h5>
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
          <h5
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
          </h5>
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
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--text-secondary)", fontSize: 14 }}
              >
                WCAG 2.2 cheatsheet
              </a>
            </li>
            <li>
              <a
                href="https://www.deque.com/axe/core-documentation/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--text-secondary)", fontSize: 14 }}
              >
                axe-core docs
              </a>
            </li>
            <li>
              <a href="#oss" style={{ color: "var(--text-secondary)", fontSize: 14 }}>
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
          fontFamily: "var(--font-outfit), system-ui, sans-serif",
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
    </footer>
  );
}
