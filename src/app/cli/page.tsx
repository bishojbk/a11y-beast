import type { Metadata } from "next";
import Link from "next/link";
import PageContainer from "@/components/ui/PageContainer";

export const metadata: Metadata = {
  title: "CLI",
  description:
    "The A11y Beast command-line scanner. Run 125+ accessibility checks in a real browser, map findings to 16 legal frameworks, and fail a CI build on regressions — scan and benchmark from your terminal.",
  alternates: { canonical: "/cli" },
};

// Match the forensic-editorial system used across the content pages (see /about).
const kicker: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--text-tertiary)",
};
const h2: React.CSSProperties = {
  fontSize: "clamp(22px, 3vw, 30px)",
  lineHeight: 1.15,
  marginTop: 56,
  marginBottom: 16,
};
const body: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: 16,
  lineHeight: 1.65,
  marginBottom: 16,
};

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre
      style={{
        fontFamily: "var(--font-mono), ui-monospace, monospace",
        fontSize: 13.5,
        lineHeight: 1.6,
        background: "var(--bg-raised)",
        border: "1px solid var(--border-default)",
        borderRadius: 8,
        padding: "16px 18px",
        overflowX: "auto",
        color: "var(--text-primary)",
        margin: "0 0 16px",
      }}
    >
      <code>{children}</code>
    </pre>
  );
}

interface Opt {
  flag: string;
  desc: string;
}

function Options({ rows }: { rows: Opt[] }) {
  return (
    <div style={{ overflowX: "auto", border: "1px solid var(--border-default)", borderRadius: 8, marginBottom: 16 }}>
      <table style={{ width: "100%", minWidth: 460, borderCollapse: "collapse", fontSize: 14 }}>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.flag} style={{ borderTop: i === 0 ? "none" : "1px solid var(--border-faint)" }}>
              <td
                className="mono"
                style={{
                  padding: "11px 16px",
                  whiteSpace: "nowrap",
                  verticalAlign: "top",
                  color: "var(--accent-text)",
                  fontSize: 13,
                }}
              >
                {r.flag}
              </td>
              <td style={{ padding: "11px 16px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CliPage() {
  return (
    <PageContainer>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={kicker}>CLI · scan from your terminal</span>
          <span
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent-text)",
              background: "var(--accent-wash)",
              border: "1px solid var(--accent-line)",
              borderRadius: 3,
              padding: "2px 7px",
            }}
          >
            Pro
          </span>
        </div>
        <h1
          className="font-display"
          style={{ fontSize: "clamp(34px, 5vw, 52px)", lineHeight: 1.05, marginBottom: 20 }}
        >
          The whole engine, in your terminal.
        </h1>
        <p style={{ ...body, fontSize: 18 }}>
          The <code className="mono" style={{ color: "var(--accent-text)" }}>accesslens</code> CLI runs the same
          real-browser scan as the web app — 125+ checks mapped to 16 legal frameworks — so you can audit a URL,
          script a report, or <strong>fail a CI build when accessibility regresses</strong>. It also bundles the
          public benchmark used on the About page.
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            background: "var(--accent-wash)",
            border: "1px solid var(--accent-line)",
            borderRadius: 8,
            padding: "14px 16px",
            margin: "24px 0 8px",
            fontSize: 14,
            lineHeight: 1.55,
            color: "var(--text-secondary)",
          }}
        >
          <span aria-hidden="true">🔑</span>
          <span>
            <strong style={{ color: "var(--text-primary)" }}>The CLI is a Pro feature.</strong> The published
            command-line tool and CI gating ship from the{" "}
            <Link href="/pricing" style={{ color: "var(--accent-text)" }}>Pro tier</Link> up (founding access open
            now). The engine itself is source-available under <strong>AGPL-3.0</strong>, and a public{" "}
            <code className="mono">npx</code> release is being prepared. The commands below are the stable interface —
            they won&rsquo;t change when it lands.
          </span>
        </div>

        <h2 className="font-display" style={h2}>Scan a page</h2>
        <p style={body}>Point it at a live URL or a local HTML file:</p>
        <CodeBlock>{`npx accesslens scan https://example.com

# fail CI if the score drops below 90
npx accesslens scan https://example.com --threshold 90

# write a self-contained HTML report
npx accesslens scan https://example.com -f html -o report.html

# scan a local file before you ship it
npx accesslens scan ./dist/index.html --html`}</CodeBlock>
        <Options
          rows={[
            { flag: "<target>", desc: "URL to scan, or path to a .html file (use --html for files)." },
            { flag: "--html", desc: "Treat the target as a local HTML file path instead of a URL." },
            { flag: "-f, --format <type>", desc: "Output format: table (default), json, or html." },
            { flag: "-o, --output <path>", desc: "Write output to a file instead of stdout." },
            { flag: "-t, --threshold <score>", desc: "Minimum score 0–100. Exits with code 1 if the page scores below it — the CI gate." },
            { flag: "--frameworks <ids>", desc: "Comma-separated framework IDs to include, e.g. ada-title-iii,eaa." },
            { flag: "--timeout <ms>", desc: "Navigation timeout in milliseconds (default 30000)." },
            { flag: "--fix", desc: "Generate AI-powered fixes for critical/major issues. Requires ANTHROPIC_API_KEY." },
            { flag: "-v, --verbose", desc: "Show detailed progress." },
          ]}
        />

        <h2 className="font-display" style={h2}>In CI (GitHub Action)</h2>
        <p style={body}>
          The non-zero exit code from <code className="mono">--threshold</code> is all you need to block a merge:
        </p>
        <CodeBlock>{`- name: Accessibility gate
  run: npx accesslens scan \${{ env.PREVIEW_URL }} --threshold 90`}</CodeBlock>

        <h2 className="font-display" style={h2}>Benchmark the engine</h2>
        <p style={body}>
          Reproduce the public comparison against axe-core, Pa11y and Lighthouse on your own URL set:
        </p>
        <CodeBlock>{`npx accesslens benchmark --urls https://example.com,https://example.org

# or from a file, one URL per line
npx accesslens benchmark --urls-file sites.txt --tools all`}</CodeBlock>
        <Options
          rows={[
            { flag: "--urls <list>", desc: "Comma-separated URLs to benchmark." },
            { flag: "--urls-file <path>", desc: "File with one URL per line (lines starting with # are ignored)." },
            { flag: "--tools <list>", desc: "Comma-separated: beast, axe-raw, pa11y, lighthouse — or 'all' (default)." },
            { flag: "--output-dir <path>", desc: "Where to write benchmark.md + benchmark.json (default ./benchmark-results)." },
            { flag: "--timeout <ms>", desc: "Per-tool navigation timeout in ms (default 45000)." },
            { flag: "-v, --verbose", desc: "Show detailed progress." },
          ]}
        />

        <p style={{ ...body, fontSize: 14, marginTop: 40, color: "var(--text-tertiary)" }}>
          Like the web app, the CLI reports an automated indicator mapped to legal risk — not a compliance verdict.
          Automated testing catches ~30–40% of WCAG success criteria; pair it with a manual audit for the rest.
        </p>

        <div
          style={{
            marginTop: 48,
            paddingTop: 32,
            borderTop: "1px solid var(--border-faint)",
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <Link href="/#scan" className="scan-btn" style={{ display: "inline-flex", alignItems: "center", height: 44, padding: "0 22px", borderRadius: 6, fontSize: 14, fontWeight: 600 }}>
            Scan in the browser
          </Link>
          <Link
            href="/pricing"
            style={{ display: "inline-flex", alignItems: "center", height: 44, padding: "0 22px", borderRadius: 6, fontSize: 14, fontWeight: 600, border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
          >
            Get founding access
          </Link>
        </div>
    </PageContainer>
  );
}
