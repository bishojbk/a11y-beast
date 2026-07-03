"use client";

import { useCallback, useState } from "react";

// Agency white-label: the "Prepared by" name stamped on evidence PDFs.
export default function BrandingForm({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const save = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (status === "saving") return;
      setStatus("saving");
      setErrorMsg("");
      try {
        const res = await fetch("/api/v1/account/brand", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brandName: value }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message ?? "Something went wrong.");
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 1800);
      } catch (err) {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      }
    },
    [value, status]
  );

  return (
    <form onSubmit={save} style={{ maxWidth: 420 }}>
      <label
        htmlFor="brand-name"
        className="mono"
        style={{ display: "block", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 6 }}
      >
        Prepared-by name on evidence PDFs
      </label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          id="brand-name"
          type="text"
          maxLength={80}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Your Studio Ltd."
          style={{
            flex: "1 1 220px",
            background: "var(--bg-input)",
            border: "1px solid var(--border-strong)",
            borderRadius: 5,
            padding: "9px 12px",
            color: "var(--text-primary)",
            fontSize: 14,
          }}
        />
        <button type="submit" className="btn" disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save"}
        </button>
      </div>
      {status === "error" && (
        <p role="alert" style={{ color: "var(--severity-critical)", fontSize: 12.5, marginTop: 8 }}>
          {errorMsg}
        </p>
      )}
      <p style={{ fontSize: 12.5, color: "var(--text-tertiary)", marginTop: 8, lineHeight: 1.5 }}>
        Shown as &ldquo;Prepared by&rdquo; on the record, with the engine credited honestly in the footer. Leave
        empty to remove.
      </p>
    </form>
  );
}
