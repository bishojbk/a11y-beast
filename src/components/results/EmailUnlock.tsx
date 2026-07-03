"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Unlock, X } from "lucide-react";
import { track } from "@/lib/analytics";

const STORAGE_KEY = "a11y-beast:report-unlock";
const UNLOCK_EVENT = "a11ybeast:report-unlock";
const EASE = [0.22, 1, 0.36, 1] as const;

/* ══════════════════════════════════════════════════════════════
   useEmailUnlock — one email, once, unlocks every export on this
   browser. The flag lives in localStorage; instances stay in sync
   via a custom event (same tab) + the storage event (other tabs).
   ══════════════════════════════════════════════════════════════ */
export function useEmailUnlock(): { unlocked: boolean; unlock: (email: string) => void } {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        setUnlocked(Boolean(localStorage.getItem(STORAGE_KEY)));
      } catch {
        /* storage unavailable — stay locked; the form still submits */
      }
    };
    read();
    window.addEventListener(UNLOCK_EVENT, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(UNLOCK_EVENT, read);
      window.removeEventListener("storage", read);
    };
  }, []);

  const unlock = useCallback((email: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, at: new Date().toISOString() }));
    } catch {
      /* quota/unavailable — unlock still applies for this page view */
    }
    setUnlocked(true);
    window.dispatchEvent(new Event(UNLOCK_EVENT));
  }, []);

  return { unlocked, unlock };
}

type Status = "idle" | "submitting" | "error";

/* ══════════════════════════════════════════════════════════════
   EmailUnlockInline — compact one-row form that sits where the
   download buttons would be (dialog footers). Posts to the
   existing waitlist API tagged source:"report_unlock".
   ══════════════════════════════════════════════════════════════ */
export function EmailUnlockInline({
  context,
  scanUrl,
  onUnlocked,
}: {
  context: string;
  scanUrl?: string;
  onUnlocked: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputId = `unlock-email-${context}`;

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
          body: JSON.stringify({ email, source: "report_unlock", plan: "free-report", url: scanUrl }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message ?? "Something went wrong.");
        track("report_unlock_submitted", { context });
        onUnlocked(email);
      } catch (err) {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      }
    },
    [email, context, scanUrl, status, onUnlocked]
  );

  return (
    <form onSubmit={submit} style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
          style={{
            flex: "1 1 200px",
            background: "var(--bg-input)",
            border: "1px solid var(--border-strong)",
            borderRadius: 5,
            padding: "8px 10px",
            color: "var(--text-primary)",
            fontSize: 13.5,
          }}
        />
        <button
          type="submit"
          className="btn primary"
          disabled={status === "submitting" || !email.trim()}
          style={{ justifyContent: "center" }}
        >
          <Unlock size={13} aria-hidden="true" /> {status === "submitting" ? "Unlocking…" : "Unlock downloads"}
        </button>
      </div>
      {status === "error" && (
        <p style={{ color: "var(--severity-critical)", fontSize: 12.5, marginTop: 8, marginBottom: 0 }}>{errorMsg}</p>
      )}
      <p className="mono" style={{ fontSize: 10, color: "var(--text-tertiary)", marginTop: 8, marginBottom: 0 }}>
        Free — your email once unlocks every export on this browser. We&rsquo;ll only email you about launch updates.
      </p>
    </form>
  );
}

/* ══════════════════════════════════════════════════════════════
   EmailUnlockModal — for direct actions with no dialog of their
   own (the Evidence file button). Same overlay pattern as
   WaitlistCta.
   ══════════════════════════════════════════════════════════════ */
export function EmailUnlockModal({
  open,
  onClose,
  scanUrl,
  onUnlocked,
}: {
  open: boolean;
  onClose: () => void;
  scanUrl?: string;
  onUnlocked: (email: string) => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => headingRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Unlock report downloads"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 120,
            background: "rgba(0,0,0,0.62)",
            backdropFilter: "blur(6px)",
            display: "grid",
            placeItems: "center",
            padding: 24,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{
              width: "min(460px, 100%)",
              background: "var(--bg-raised)",
              border: "1px solid var(--border-strong)",
              borderRadius: 8,
              boxShadow: "var(--shadow-pop)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                borderBottom: "1px solid var(--border-default)",
              }}
            >
              <span
                className="mono"
                style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-tertiary)" }}
              >
                Evidence file · free unlock
              </span>
              <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <div style={{ padding: 22 }}>
              <h3 ref={headingRef} tabIndex={-1} className="font-display" style={{ fontSize: 21, marginBottom: 8, outline: "none" }}>
                Unlock report downloads
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 13.5, lineHeight: 1.55, marginBottom: 16 }}>
                Your email once unlocks every export on this browser — the markdown report, per-jurisdiction legal
                reports, and the dated evidence file. The on-screen findings stay free either way.
              </p>
              <EmailUnlockInline context="evidence" scanUrl={scanUrl} onUnlocked={onUnlocked} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
