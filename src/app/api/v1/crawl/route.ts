import { type NextRequest } from "next/server";
import { crawlSite } from "@/lib/fetch/crawler";
import { aggregateSite } from "@/lib/analyzer/aggregate";
import { generateComplianceResults } from "@/lib/compliance/mapper";
import { getEffort } from "@/lib/analyzer/effort";

// Crawling is heavier than a single scan — stricter limit.
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60_000;

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
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = checkRateLimit(ip);

  const headers = {
    ...corsHeaders(),
    "X-RateLimit-Limit": String(RATE_LIMIT),
    "X-RateLimit-Remaining": String(rate.remaining),
    "X-RateLimit-Reset": String(Math.ceil(rate.resetAt / 1000)),
  };

  if (!rate.allowed) {
    return Response.json(
      { error: { code: "RATE_LIMITED", message: "Too many crawls. Try again in a minute." } },
      { status: 429, headers }
    );
  }

  try {
    const body = await request.json();
    const { url, maxPages } = body as { url?: string; maxPages?: number };

    if (!url || typeof url !== "string") {
      return Response.json(
        { error: { code: "INVALID_URL", message: "url is required and must be a string" } },
        { status: 400, headers }
      );
    }
    if (url.length > 2048) {
      return Response.json(
        { error: { code: "URL_TOO_LONG", message: "URL must be under 2048 characters" } },
        { status: 400, headers }
      );
    }

    const start = Date.now();
    const outcome = await crawlSite(url, { maxPages: typeof maxPages === "number" ? maxPages : undefined });

    if (outcome.pages.length === 0) {
      const reason = outcome.failed[0]?.error ?? "No pages could be scanned";
      return Response.json(
        { error: { code: "CRAWL_FAILED", message: reason } },
        { status: 422, headers }
      );
    }

    const site = aggregateSite(url, outcome, Date.now() - start);

    const compliance = generateComplianceResults(site.aggregate.issues, site.aggregate.passedRules, {
      hasAccessibilityStatement: site.aggregate.pageMeta.hasAccessibilityStatement,
      hasSkipLink: site.aggregate.pageMeta.hasSkipLink,
      lang: site.aggregate.pageMeta.lang,
    }, site.aggregate.passedRuleTags);

    const effort: Record<string, { label: string; estimate: string }> = {};
    for (const issue of site.aggregate.issues) {
      if (!effort[issue.ruleId]) {
        const e = getEffort(issue.ruleId);
        effort[issue.ruleId] = { label: e.label, estimate: e.estimate };
      }
    }

    return Response.json(
      {
        site,
        compliance: compliance.map((c) => ({
          framework: {
            id: c.framework.id,
            name: c.framework.shortName,
            region: c.framework.region,
            penalties: c.framework.penalties,
            deadlineAlert: c.framework.deadlineAlert ?? null,
          },
          percentage: c.percentage,
          passedCount: c.passedCount,
          failedCount: c.failedCount,
          totalApplicable: c.totalApplicable,
          failingRuleIds: c.failingRuleIds,
        })),
        effort,
        meta: {
          version: "0.1.0",
          engine: "axe-core 4.11.2 + 20 custom checks",
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200, headers }
    );
  } catch (err) {
    console.error("API v1 crawl error:", err);
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500, headers }
    );
  }
}

export const maxDuration = 60;
