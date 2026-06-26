import { type NextRequest } from "next/server";
import { saveReport, parseExpiry } from "@/lib/report/share-link";
import { getClientIp } from "@/lib/getClientIp";

// Per-IP in-memory rate limit (resets on cold start) — mirrors the sibling
// routes (scan/crawl/fix). Without this, an attacker could fill ephemeral /tmp
// with report blobs by hammering this endpoint.
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

// Cap the serialized report body. Reports are JSON; 256KB is generous for a
// scan result while preventing an oversized payload from filling /tmp.
const MAX_BODY_BYTES = 256 * 1024;

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1, resetAt: now + RATE_WINDOW_MS };
  }
  entry.count++;
  if (entry.count > RATE_LIMIT) return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  return { allowed: true, remaining: RATE_LIMIT - entry.count, resetAt: entry.resetAt };
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(ip);

  const headers = {
    ...corsHeaders(),
    "X-RateLimit-Limit": String(RATE_LIMIT),
    "X-RateLimit-Remaining": String(rate.remaining),
    "X-RateLimit-Reset": String(Math.ceil(rate.resetAt / 1000)),
  };

  if (!rate.allowed) {
    return Response.json(
      { error: { code: "RATE_LIMITED", message: "Too many requests. Try again in a minute." } },
      { status: 429, headers }
    );
  }

  // Share links are gated OFF by default (mirrors how fix/crawl gate paid/heavy
  // features). There is no /share/[token] consume route, and /tmp is ephemeral
  // on serverless (wiped between invocations / not shared across instances), so
  // an enabled endpoint would hand out share URLs that resolve to nothing. Flip
  // ENABLE_SHARE=true only once a durable store + a consume route exist.
  if (process.env.ENABLE_SHARE !== "true") {
    return Response.json(
      { error: { code: "SHARE_DISABLED", message: "Shareable report links are not enabled." } },
      { status: 501, headers }
    );
  }

  try {
    const body = await request.json();
    const { url, filename, expiresIn, report } = body ?? {};

    if (typeof url !== "string" || typeof filename !== "string" || report === undefined) {
      return Response.json(
        { error: { code: "INVALID_INPUT", message: "url, filename and report are required." } },
        { status: 400, headers }
      );
    }

    const reportJson = JSON.stringify(report);

    // Serialized-body size cap: reject oversized reports before writing to disk.
    if (Buffer.byteLength(reportJson, "utf8") > MAX_BODY_BYTES) {
      return Response.json(
        { error: { code: "PAYLOAD_TOO_LARGE", message: "Report is too large to share." } },
        { status: 413, headers }
      );
    }

    const expiresInSeconds = parseExpiry(expiresIn);

    const shareUrl = await saveReport({ url, filename, reportJson, expiresInSeconds });

    return Response.json({ shareUrl, expiresInSeconds }, { status: 200, headers });
  } catch (err) {
    console.error("share error", err instanceof Error ? err.message : "unknown");
    return Response.json(
      { error: { code: "SHARE_FAILED", message: "Could not create share link." } },
      { status: 400, headers }
    );
  }
}

export const maxDuration = 60;
