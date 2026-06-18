"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { track } from "@/lib/analytics";

const EASE = [0.22, 1, 0.36, 1] as const;
type Status = "idle" | "submitting" | "success" | "error";

export default function WaitlistCta({
  plan,
  label,
  featured,
}: {
  plan: string;
  label: string;
  featured?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (status === "submitting") return;
      setStatus("submitting");
      setErrorMsg("");
      try {
        const res = await fetch("/api/v1/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, plan }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message ?? "Something went wrong.");
        track("waitlist_submitted", { plan });
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      }
    },
    [email, plan, status]
  );

  return (
    <>
      <button
        type="button"
        className={`btn ${featured ? "primary" : ""}`}
        style={{ justifyContent: "center" }}
        onClick={() => { setOpen(true); setStatus("idle"); }}
      >
        {label}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Join the ${plan} waitlist`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
            style={{ position: "fixed", inset: 0, zIndex: 120, background: "rgba(0,0,0,0.62)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: 24 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE }}
              style={{ width: "min(440px, 100%)", background: "var(--bg-raised)", border: "1px solid var(--border-strong)", borderRadius: 8, boxShadow: "var(--shadow-pop)", overflow: "hidden" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid var(--border-default)" }}>
                <span className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
                  {plan} · early access
                </span>
                <button type="button" className="modal-close" onClick={() => setOpen(false)} aria-label="Close">
                  <X size={16} aria-hidden="true" />
                </button>
              </div>

              <div style={{ padding: 22 }}>
                {status === "success" ? (
                  <div style={{ textAlign: "center", padding: "12px 0" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--pass-bg)", color: "var(--pass)", display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
                      <Check size={22} aria-hidden="true" />
                    </div>
                    <h3 className="font-display" style={{ fontSize: 22, marginBottom: 8 }}>You&rsquo;re on the list.</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.5 }}>
                      We&rsquo;ll email you the moment <b style={{ color: "var(--text-primary)" }}>{plan}</b> opens. No spam — just the launch.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={submit}>
                    <h3 className="font-display" style={{ fontSize: 22, marginBottom: 8 }}>
                      Join the <span style={{ fontStyle: "italic", color: "var(--accent-text)" }}>{plan}</span> waitlist
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: 13.5, lineHeight: 1.5, marginBottom: 16 }}>
                      Get early access (free while in beta) and a heads-up the day it launches.
                    </p>
                    <label htmlFor="waitlist-email" className="sr-only">Email address</label>
                    <input
                      id="waitlist-email"
                      ref={inputRef}
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      autoComplete="email"
                      style={{ width: "100%", background: "var(--bg-input)", border: "1px solid var(--border-strong)", borderRadius: 5, padding: "10px 12px", color: "var(--text-primary)", fontSize: 14, marginBottom: 12 }}
                    />
                    {status === "error" && (
                      <p style={{ color: "var(--severity-critical)", fontSize: 12.5, marginBottom: 12 }}>{errorMsg}</p>
                    )}
                    <button
                      type="submit"
                      className="btn primary"
                      disabled={status === "submitting" || !email.trim()}
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      {status === "submitting" ? "Joining…" : "Join the waitlist"}
                    </button>
                    <p className="mono" style={{ fontSize: 10, color: "var(--text-tertiary)", textAlign: "center", marginTop: 12 }}>
                      One email at launch. No spam, ever.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
