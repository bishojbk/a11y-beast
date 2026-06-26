/**
 * Global in-flight concurrency cap for Puppeteer renders (per server instance).
 *
 * Per-IP rate limiting alone does not bound *concurrent* Chrome processes: an
 * abuser rotating the spoofable XFF header (or simply many distinct IPs) could
 * spawn one render each and exhaust the box's memory/CPU. This counter caps the
 * number of simultaneous renders so the worst case is bounded regardless of how
 * many distinct rate-limit buckets exist.
 *
 * In-memory only — resets on cold start and is not shared across serverless
 * instances. That is fine as a per-instance guard; a global limiter would need
 * a shared store (Redis/Upstash) and is out of scope here.
 */

// Conservative default for a single serverless instance / small box. Override
// via SCAN_MAX_CONCURRENCY if the host has more headroom.
const MAX_CONCURRENT_RENDERS = (() => {
  const n = Number.parseInt(process.env.SCAN_MAX_CONCURRENCY ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : 3;
})();

let inFlight = 0;

/**
 * Try to acquire a render slot. Returns true if a slot was reserved (caller MUST
 * call release() in a finally block) or false if the cap is already reached
 * (caller should reject the request with 503).
 */
export function tryAcquireRenderSlot(): boolean {
  if (inFlight >= MAX_CONCURRENT_RENDERS) return false;
  inFlight++;
  return true;
}

/** Release a previously acquired render slot. Never drops below zero. */
export function releaseRenderSlot(): void {
  if (inFlight > 0) inFlight--;
}

export function maxConcurrentRenders(): number {
  return MAX_CONCURRENT_RENDERS;
}
