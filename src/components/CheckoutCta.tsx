"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import WaitlistCta from "@/components/WaitlistCta";

// Real checkout button once billing is configured; before that it stays the
// honest waitlist CTA (nothing pretends to be buyable that isn't).
export default function CheckoutCta({
  price,
  plan,
  label,
  featured,
  configured,
}: {
  price: string;
  plan: string;
  label: string;
  featured?: boolean;
  configured: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const checkout = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setErrorMsg("");
    try {
      track("checkout_clicked", { price });
      const res = await fetch("/api/v1/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push("/signup?next=/pricing");
        return;
      }
      if (!res.ok) throw new Error(data.error?.message ?? "Something went wrong.");
      window.location.href = data.url;
    } catch (err) {
      setBusy(false);
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }, [busy, price, router]);

  if (!configured) return <WaitlistCta plan={plan} label={label} featured={featured} />;

  return (
    <div>
      <button
        type="button"
        className={`btn ${featured ? "primary" : ""}`}
        style={{ width: "100%", justifyContent: "center" }}
        onClick={checkout}
        disabled={busy}
      >
        {busy ? "Opening checkout…" : label}
      </button>
      {errorMsg && (
        <p role="alert" style={{ color: "var(--severity-critical)", fontSize: 12, marginTop: 8, textAlign: "center" }}>
          {errorMsg}
        </p>
      )}
    </div>
  );
}
