import Link from "next/link";
import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";

export default function NotFound() {
  return (
      <main id="main-content" role="main" style={{ flex: 1 }}>
        <div className="err-wrap">
          <div className="err-inner">
            <div className="err-code" aria-hidden="true">404</div>
            <h1 className="err-title">
              This page failed to render.
              <br />
              Ironic, given what we do.
            </h1>
            <p className="err-lede">
              Whatever you were looking for isn&rsquo;t here. It may have moved, it may never have existed, it may have
              been removed in a silent deploy. We can&rsquo;t scan the void — try one of these instead.
            </p>
            <div className="err-actions">
              <Link href="/#scan" className="btn primary">
                <ArrowRight size={13} /> Back to scanner
              </Link>
              <Link href="/results" className="btn">
                <ExternalLink size={13} /> See a sample report
              </Link>
              <a
                href="https://www.w3.org/WAI/standards-guidelines/wcag/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                <BookOpen size={13} /> Read the docs
              </a>
            </div>

            <div className="err-row">
              <div className="err-card">
                <div className="lbl">Scan failed</div>
                <h4>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--severity-critical)" }} />
                  Can&rsquo;t reach target
                </h4>
                <p>
                  The target returned{" "}
                  <span className="mono">ERR_CONNECTION_REFUSED</span> after three retries. Check the URL, or wait if
                  it&rsquo;s rate-limiting us.
                </p>
                <div
                  className="mono"
                  style={{ marginTop: 12, fontSize: 11, color: "var(--text-tertiary)", letterSpacing: "0.08em" }}
                >
                  HTTP 000 · DNS ok · SSRF clear
                </div>
              </div>
              <div className="err-card">
                <div className="lbl">Rate limited</div>
                <h4>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--severity-major)" }} />
                  Slow down — 5 scans / min
                </h4>
                <p>
                  We throttle anonymous scans to keep the service free. Wait a minute, or sign in for unlimited scans.
                </p>
                <div
                  className="mono"
                  style={{ marginTop: 12, fontSize: 11, color: "var(--text-tertiary)", letterSpacing: "0.08em" }}
                >
                  HTTP 429 · retry in 34s
                </div>
              </div>
            </div>

            <div className="err-trace">
              ─── A11Y/BEAST · ERR_NOT_FOUND · TRACE c4f2-9001-18a7-e03b ───
            </div>
          </div>
        </div>
      </main>
  );
}
