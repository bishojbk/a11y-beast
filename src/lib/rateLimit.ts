// Light in-memory rate limit (resets on cold start) — abuse guard for the
// auth/billing/evidence routes. Same pattern as the waitlist route's inline
// limiter; keyed per route so limits don't bleed across endpoints.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count++;
  return entry.count <= limit;
}

export function rateLimited(): Response {
  return Response.json(
    { error: { code: "RATE_LIMITED", message: "Too many requests. Try again in a minute." } },
    { status: 429 }
  );
}
