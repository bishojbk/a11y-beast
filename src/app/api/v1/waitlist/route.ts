import { type NextRequest } from "next/server";
import { getClientIp } from "@/lib/getClientIp";

// Light in-memory rate limit (resets on cold start) — abuse guard.
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT;
}

// Simple, permissive email check — we just want to avoid obvious junk.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: { code: "RATE_LIMITED", message: "Too many requests. Try again in a minute." } },
      { status: 429 }
    );
  }

  let body: { email?: string; plan?: string; note?: string; url?: string; source?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: { code: "BAD_JSON", message: "Invalid request body." } }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const plan = String(body.plan ?? "").trim().slice(0, 40) || "unspecified";
  const note = String(body.note ?? "").trim().slice(0, 500);
  // Optional: the URL being monitored (from the "monitor this page" opt-in) and
  // the lead source, so monitor leads are distinguishable from pricing waitlist
  // leads in the sheet/logs. Defaults keep the existing waitlist behavior intact.
  const url = String(body.url ?? "").trim().slice(0, 300);
  const source = String(body.source ?? "").trim().slice(0, 40) || "pricing";

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return Response.json(
      { error: { code: "INVALID_EMAIL", message: "Enter a valid email address." } },
      { status: 400 }
    );
  }

  const lead = {
    email,
    plan,
    note,
    url: url || null,
    source,
    referer: request.headers.get("referer") ?? null,
    at: new Date().toISOString(),
  };

  // Forward to a webhook the owner configures (Google Apps Script → Sheet,
  // Zapier/Make, Slack/Discord incoming webhook, etc.). No DB or vendor lock-in.
  const webhook = process.env.WAITLIST_WEBHOOK_URL;
  let delivered = false;
  if (webhook) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 5000);
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
        signal: ctrl.signal,
      });
      clearTimeout(t);
      delivered = res.ok;
    } catch {
      delivered = false;
    }
  }

  // Always record server-side so a lead is never silently lost even if the
  // webhook is unset or down (visible in Vercel logs as a fallback).
  console.log("[waitlist]", JSON.stringify(lead), "delivered:", delivered);

  return Response.json({ ok: true }, { status: 200 });
}

export const maxDuration = 15;
