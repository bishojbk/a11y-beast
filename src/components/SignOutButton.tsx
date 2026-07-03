"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";

export default function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const signOut = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      await fetch("/api/v1/auth/signout", { method: "POST" });
      track("signed_out", {});
      window.dispatchEvent(new Event("ab:auth-changed"));
    } finally {
      router.push("/");
      router.refresh();
    }
  }, [busy, router]);

  return (
    <button type="button" className="btn" onClick={signOut} disabled={busy}>
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
