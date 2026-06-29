"use client";

import { useState } from "react";
import { FileText, Check } from "lucide-react";
import { track } from "@/lib/analytics";

// Demand probe for PDF / document accessibility checking. NOT a live feature —
// this is an honest "would you use this?" signal capture so we build it only if
// real interest shows up (and ideally only after an agency says they'd pay).
// Posts to the same lead pipeline as the waitlist, tagged source:"pdf". The copy
// must never imply PDF checking exists yet — it explicitly says "in development".
type Status = "idle" | "submitting" | "success" | "error";

export default function PdfInterestCta() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting" || !email.trim()) return;
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/v1/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "pdf", plan: "pdf", note: "interest: PDF/document accessibility checks" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? "Something went wrong.");
      track("pdf_interest_submitted", {});
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <section
      aria-label="Register interest in PDF and document accessibility checks"
      style={{
        border: "1px solid var(--border-default)",
        borderLeft: "3px solid var(--accent-text)",
        borderRadius: 10,
        background: "var(--bg-raised)",
        padding: "20px 22px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 16,
        marginTop: 8,
      }}
    >
      <FileText size={22} aria-hidden="true" style={{ color: "var(--accent-text)", flexShrink: 0 }} />

      {status === "success" ? (
        <div role="status" style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 240 }}>
          <span style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--pass-bg)", color: "var(--pass)", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <Check size={15} aria-hidden="true" />
          </span>
          <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            <b style={{ color: "var(--text-primary)" }}>Noted — thank you.</b> We&rsquo;ll email you if PDF checks land in
            Pro. Every reply helps us decide what to build next.
          </span>
        </div>
      ) : (
        <>
          <div style={{ flex: "1 1 300px", minWidth: 240 }}>
            <div className="font-display" style={{ fontSize: 16, color: "var(--text-primary)", marginBottom: 3 }}>
              Document (PDF) accessibility — <span style={{ fontStyle: "italic", color: "var(--accent-text)" }}>in development</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              PDFs are where a lot of real legal risk hides — Section 508, ADA Title II, the EAA&rsquo;s EN 301 549 §10.
              We&rsquo;re deciding whether to build PDF/UA&nbsp;+&nbsp;WCAG document checks into Pro. It&rsquo;s{" "}
              <b>not built yet</b> — if your clients would use it, tell us and we&rsquo;ll prioritise it.
            </div>
          </div>
          <form onSubmit={submit} style={{ display: "flex", gap: 8, flex: "1 1 320px", flexWrap: "wrap" }}>
            <label htmlFor="pdf-interest-email" className="sr-only">Email address to register interest in PDF checks</label>
            <input
              id="pdf-interest-email"
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
              {status === "submitting" ? "Sending…" : "I'd use this"}
            </button>
            {status === "error" && (
              <p role="alert" style={{ flexBasis: "100%", margin: 0, color: "var(--severity-critical)", fontSize: 12.5 }}>{errorMsg}</p>
            )}
          </form>
        </>
      )}
    </section>
  );
}
