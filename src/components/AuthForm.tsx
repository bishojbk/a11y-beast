"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { track } from "@/lib/analytics";

type Status = "idle" | "submitting";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--bg-input)",
  border: "1px solid var(--border-strong)",
  borderRadius: 5,
  padding: "10px 12px",
  color: "var(--text-primary)",
  fontSize: 14,
};

export default function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (status === "submitting") return;
      setStatus("submitting");
      setErrorMsg("");
      try {
        const res = await fetch(`/api/v1/auth/${mode}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message ?? "Something went wrong.");
        track(mode === "signup" ? "account_created" : "signed_in", {});
        // Header listens for this to refresh its Account/Sign-in state without
        // a hard reload (client-side nav keeps it mounted).
        window.dispatchEvent(new Event("ab:auth-changed"));
        const next = params.get("next");
        // Only same-site relative paths — never redirect off-site.
        router.replace(next && next.startsWith("/") && !next.startsWith("//") ? next : "/account");
        router.refresh();
      } catch (err) {
        setStatus("idle");
        setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      }
    },
    [email, password, mode, status, router, params]
  );

  return (
    <form onSubmit={submit} style={{ maxWidth: 400 }}>
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="auth-email" className="mono" style={{ display: "block", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 6 }}>
          Email
        </label>
        <input
          id="auth-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="auth-password" className="mono" style={{ display: "block", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 6 }}>
          Password
        </label>
        <input
          id="auth-password"
          type="password"
          required
          minLength={8}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
          style={inputStyle}
        />
      </div>
      {errorMsg && (
        <p role="alert" style={{ color: "var(--severity-critical)", fontSize: 13, marginBottom: 14 }}>
          {errorMsg}
        </p>
      )}
      <button
        type="submit"
        className="btn primary"
        disabled={status === "submitting" || !email.trim() || password.length < 8}
        style={{ width: "100%", justifyContent: "center" }}
      >
        {status === "submitting"
          ? mode === "signup" ? "Creating account…" : "Signing in…"
          : mode === "signup" ? "Create account" : "Sign in"}
      </button>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 16 }}>
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/signin" style={{ color: "var(--accent-text)", textDecoration: "underline" }}>
              Sign in
            </Link>
          </>
        ) : (
          <>
            No account yet?{" "}
            <Link href="/signup" style={{ color: "var(--accent-text)", textDecoration: "underline" }}>
              Create one — free
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
