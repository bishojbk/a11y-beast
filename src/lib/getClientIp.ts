import { type NextRequest } from "next/server";

/**
 * Derive the client IP for rate-limit keying from a platform-TRUSTED source.
 *
 * The naive `x-forwarded-for.split(",")[0]` is the *left-most* hop, which is
 * fully attacker-controlled: any client can send `X-Forwarded-For: 1.2.3.4`
 * and the proxy chain only *appends* to it, so the left-most value is whatever
 * the caller invented. Keying a rate limiter off that lets one abuser rotate a
 * single header to mint unlimited buckets and bypass the limit entirely.
 *
 * Trust order (most-trusted first):
 *  1. `x-real-ip` — on Vercel/most reverse proxies this is set by the platform
 *     to the actual connecting IP and is NOT forwarded from the client.
 *  2. `x-vercel-forwarded-for` — Vercel's platform-set connecting IP header.
 *  3. The RIGHT-MOST entry of `x-forwarded-for` — the hop closest to our
 *     trusted edge. Each proxy appends the IP it saw, so the last entry was
 *     written by the proxy we trust, not by the client. (This assumes exactly
 *     one trusted proxy in front, which is the Vercel/edge case here. If more
 *     proxies are added, peel a fixed number of trusted hops instead.)
 *  4. `"unknown"` — fail closed to a shared bucket rather than trusting spoofable
 *     input. Worst case everyone without a trusted IP shares one limit.
 */
export function getClientIp(request: NextRequest): string {
  // Platform-set connecting IP — not forwarded from the client, so not spoofable.
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const vercelFwd = request.headers.get("x-vercel-forwarded-for")?.trim();
  if (vercelFwd) {
    // Vercel sets this to the connecting IP; if it ever carries a chain, the
    // right-most entry is the one our edge wrote.
    const parts = vercelFwd.split(",").map((p) => p.trim()).filter(Boolean);
    const trusted = parts[parts.length - 1];
    if (trusted) return trusted;
  }

  // Fall back to X-Forwarded-For but take the RIGHT-MOST (trusted) entry, never
  // the spoofable left-most one.
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((p) => p.trim()).filter(Boolean);
    const trusted = parts[parts.length - 1];
    if (trusted) return trusted;
  }

  return "unknown";
}
