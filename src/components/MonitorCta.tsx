"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { track } from "@/lib/analytics";

// Free "monitor this page" opt-in — the email-capture hook shown after a scan.
// Posts to the same lead pipeline as the waitlist, tagged source:"monitor" with
// the URL. Level 1 (concierge): leads land in the sheet/logs and weekly re-scans
// are handled manually until the automated version (cron + email) is built.
// See docs/monitoring-feature-spec.md.
type Status = "idle" | "submitting" | "success" | "error";

export default function MonitorCta({ url }: { url: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  let host = url;
  try { host = new URL(url).host; } catch { /* keep raw url */ }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting" || !email.trim()) return;
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/v1/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, url, source: "monitor", plan: "monitor" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? "Something went wrong.");
      track("monitor_optin_submitted", { url });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div className="monitor-cta">
      <section
        aria-label="Get early access to free weekly accessibility monitoring"
        style={{
          border: "1px solid var(--border-default)",
          borderLeft: "3px solid var(--accent-text)",
          borderRadius: 8,
          background: "var(--bg-raised)",
          padding: "18px 20px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Bell size={20} aria-hidden="true" style={{ color: "var(--accent-text)", flexShrink: 0 }} />

        {status === "success" ? (
          <div role="status" style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 240 }}>
            <span style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--pass-bg)", color: "var(--pass)", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Check size={15} aria-hidden="true" />
            </span>
            <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              <b style={{ color: "var(--text-primary)" }}>You&rsquo;re on the list.</b> We&rsquo;ll email you the moment free weekly monitoring goes live for{" "}
              <b className="mono" style={{ color: "var(--text-primary)" }}>{host}</b> — then flag new accessibility issues as they appear.
            </span>
          </div>
        ) : (
          <>
            <div style={{ flex: "1 1 280px", minWidth: 240 }}>
              <div className="font-display" style={{ fontSize: 16, color: "var(--text-primary)", marginBottom: 2 }}>
                Keep an eye on <span className="mono">{host}</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.45 }}>
                Free weekly monitoring is on the way — leave your email and you&rsquo;ll be first to get it. We&rsquo;ll email you <b>only</b> when new accessibility issues appear. No signup.
              </div>
            </div>
            <form onSubmit={submit} style={{ display: "flex", gap: 8, flex: "1 1 320px", flexWrap: "wrap" }}>
              <label htmlFor="monitor-email" className="sr-only">Email address for weekly monitoring</label>
              <input
                id="monitor-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                style={{ flex: "1 1 180px", minWidth: 0, background: "var(--bg-input)", border: "1px solid var(--border-strong)", borderRadius: 5, padding: "9px 12px", color: "var(--text-primary)", fontSize: 14 }}
              />
              <button
                type="submit"
                className="btn primary"
                disabled={status === "submitting" || !email.trim()}
                style={{ justifyContent: "center", whiteSpace: "nowrap" }}
              >
                {status === "submitting" ? "Adding you…" : "Get early access"}
              </button>
              {status === "error" && (
                <p role="alert" style={{ flexBasis: "100%", margin: 0, color: "var(--severity-critical)", fontSize: 12.5 }}>{errorMsg}</p>
              )}
            </form>
          </>
        )}
      </section>
    </div>
  );
}
