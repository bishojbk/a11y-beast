import { type NextRequest } from "next/server";
import { generateFix, isAiAvailable } from "@/lib/ai/generate-fix";
import type { AccessibilityIssue } from "@/lib/types/issue";
import type { PageMeta } from "@/lib/types/scan-result";

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
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
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

  if (!isAiAvailable()) {
    return Response.json(
      { error: { code: "AI_UNAVAILABLE", message: "Set ANTHROPIC_API_KEY to enable AI fixes" } },
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
