import type { Metadata } from "next";
import Link from "next/link";
import PageContainer from "@/components/ui/PageContainer";

export const metadata: Metadata = {
  title: "CLI",
  description:
    "The A11y Beast command-line scanner. Run 110+ accessibility checks in a real browser, map findings to 16 legal frameworks, and fail a CI build on regressions — scan and benchmark from your terminal.",
  alternates: { canonical: "/cli" },
};

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="doc-code">
      <code>{children}</code>
    </pre>
  );
}

interface Opt {
  flag: string;
  desc: string;
}

function Options({ rows }: { rows: Opt[] }) {
  const th: React.CSSProperties = {
    padding: "11px 16px",
    textAlign: "left",
    fontSize: 11,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "var(--text-tertiary)",
    fontWeight: 600,
  };
  return (
    <div className="opt-table-wrap">
      <table className="opt-table">
        <caption className="sr-only">CLI options</caption>
        <thead>
          <tr>
            <th scope="col" style={th}>Flag</th>
            <th scope="col" style={th}>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.flag}>
              <td className="flag">{r.flag}</td>
              <td className="opt-desc">{r.desc}</td>
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
      <div className="doc-eyebrow">
        CLI · scan from your terminal <span className="pill">Pro</span>
      </div>
      <h1 className="doc-title">The whole engine, in your terminal.</h1>
      <p className="doc-lead">
        The <code className="mono" style={{ color: "var(--accent-text)" }}>accesslens</code> CLI runs the same
        real-browser scan as the web app — 110+ checks mapped to 16 legal frameworks — so you can audit a URL, script a
        report, or <strong>fail a CI build when accessibility regresses</strong>. It also bundles the public benchmark
        used on the About page.
      </p>

      <div className="callout accent">
        <span aria-hidden="true">🔑</span>
        <span>
          <strong>The CLI is a Pro feature.</strong> The published command-line tool and CI gating ship from the{" "}
          <Link href="/pricing">Pro tier</Link> up (founding access open now). The engine itself is source-available
          under <strong>AGPL-3.0</strong>, and a public <code className="mono">npx</code> release is being prepared. The
          commands below are the stable interface — they won’t change when it lands.
        </span>
      </div>

      <section className="doc-section">
        <div className="doc-section-head">
          <span className="doc-num">01</span>
          <h2 className="doc-h2">Scan a page</h2>
        </div>
        <p className="doc-p">Point it at a live URL or a local HTML file:</p>
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
      </section>

      <section className="doc-section">
        <div className="doc-section-head">
          <span className="doc-num">02</span>
          <h2 className="doc-h2">In CI (GitHub Action)</h2>
        </div>
        <p className="doc-p">
          The non-zero exit code from <code className="mono">--threshold</code> is all you need to block a merge:
        </p>
        <CodeBlock>{`- name: Accessibility gate
  run: npx accesslens scan \${{ env.PREVIEW_URL }} --threshold 90`}</CodeBlock>
      </section>

      <section className="doc-section">
        <div className="doc-section-head">
          <span className="doc-num">03</span>
          <h2 className="doc-h2">Benchmark the engine</h2>
        </div>
        <p className="doc-p">
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
      </section>

      <p className="doc-note">
        Like the web app, the CLI reports an automated indicator mapped to legal risk — not a compliance verdict.
        Automated testing catches ~30–40% of WCAG success criteria; pair it with a manual audit for the rest.
      </p>

      <div className="cta-band">
        <Link href="/#scan" className="scan-btn btn-lg">
          Scan in the browser
        </Link>
        <Link href="/pricing" className="btn-lg outline">
          Get founding access
        </Link>
      </div>
    </PageContainer>
  );
}
