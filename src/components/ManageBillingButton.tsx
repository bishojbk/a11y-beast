"use client";

import { useCallback, useState } from "react";

export default function ManageBillingButton() {
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const open = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/v1/billing/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? "Something went wrong.");
      window.location.href = data.url;
    } catch (err) {
      setBusy(false);
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }, [busy]);

  return (
    <div>
      <button type="button" className="btn" onClick={open} disabled={busy}>
        {busy ? "Opening…" : "Manage billing"}
      </button>
      {errorMsg && (
        <p role="alert" style={{ color: "var(--severity-critical)", fontSize: 12.5, marginTop: 8 }}>
          {errorMsg}
        </p>
      )}
    </div>
  );
}
