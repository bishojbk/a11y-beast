import { type NextRequest } from "next/server";
import { generateFix, isAiAvailable } from "@/lib/ai/generate-fix";
import type { AccessibilityIssue } from "@/lib/types/issue";
import type { PageMeta } from "@/lib/types/scan-result";
import { getClientIp } from "@/lib/getClientIp";

const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1, resetAt: now + RATE_WINDOW_MS };
  }
  entry.count++;
  return {
    allowed: entry.count <= RATE_LIMIT,
    remaining: Math.max(0, RATE_LIMIT - entry.count),
    resetAt: entry.resetAt,
  };
}

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: cors });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(ip);

  const headers = {
    ...cors,
    "X-RateLimit-Limit": String(RATE_LIMIT),
    "X-RateLimit-Remaining": String(rate.remaining),
    "X-RateLimit-Reset": String(Math.ceil(rate.resetAt / 1000)),
  };

  if (!rate.allowed) {
    return Response.json(
      { error: { code: "RATE_LIMITED", message: "Too many requests. Wait a moment." } },
      { status: 429, headers }
    );
  }

  // AI fixes are a Pro feature backed by a paid Anthropic call. Gate behind an
  // explicit flag (default OFF) so a public spike / abuse can't run up an
  // unbounded bill before billing + a durable rate limiter exist. Returning 501
  // makes the results page degrade gracefully (it probes this route and hides
  // AI fixes on 501) — no broken UI, no Claude calls. Flip ENABLE_AI_FIX=true
  // once requests are entitlement-gated.
  if (process.env.ENABLE_AI_FIX !== "true" || !isAiAvailable()) {
    return Response.json(
      { error: { code: "AI_UNAVAILABLE", message: "AI fixes are a Pro feature (founding access)." } },
      { status: 501, headers }
    );
  }

  try {
    const body = await request.json();
    const { issue, pageMeta } = body as { issue?: AccessibilityIssue; pageMeta?: PageMeta };

    if (!issue?.ruleId || !issue?.element) {
      return Response.json(
        { error: { code: "INVALID_INPUT", message: "issue with ruleId and element is required" } },
        { status: 400, headers }
      );
    }
    if (!pageMeta?.url) {
      return Response.json(
        { error: { code: "INVALID_INPUT", message: "pageMeta with url is required" } },
        { status: 400, headers }
      );
    }

    // Cap the attacker-controllable payload before it reaches the LLM, so an
    // oversized element snippet can't balloon input tokens (and cost) per call.
    if (JSON.stringify(issue).length > 24_000) {
      return Response.json(
        { error: { code: "INPUT_TOO_LARGE", message: "issue payload too large" } },
        { status: 413, headers }
      );
    }

    const result = await generateFix(issue, pageMeta);

    if (!result.ok) {
      const status = result.code === "RATE_LIMITED" ? 429 : 502;
      return Response.json({ error: { code: result.code, message: result.error } }, { status, headers });
    }

    return Response.json({ fix: result.fix, usage: result.tokenUsage }, { status: 200, headers });
  } catch (err) {
    console.error("API v1 fix error:", err);
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500, headers }
    );
  }
}

export const maxDuration = 30;
