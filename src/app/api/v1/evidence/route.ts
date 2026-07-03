import { randomUUID } from "node:crypto";
import { type NextRequest } from "next/server";
import { and, asc, count, desc, eq } from "drizzle-orm";
import { getClientIp } from "@/lib/getClientIp";
import { checkRateLimit, rateLimited } from "@/lib/rateLimit";
import { getDb, evidenceRecords, type Plan } from "@/lib/db";
import { getSessionUser, sameOrigin } from "@/lib/auth/session";

// Account-backed evidence ledger — the paid artifact. localStorage remains the
// anonymous fallback; signed-in users get durable, cross-device history.
// Per-plan limits (spec: tier-gating §value metric — sites is the lever).
const LIMITS: Record<Plan, { sites: number; perSite: number }> = {
  free: { sites: 1, perSite: 5 },
  pro: { sites: 3, perSite: 24 },
  agency: { sites: 25, perSite: 24 },
};

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url.slice(0, 100);
  }
}

const AUTH_REQUIRED = Response.json(
  { error: { code: "AUTH_REQUIRED", message: "Sign in to keep a server-backed ledger." } },
  { status: 401 }
);

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return AUTH_REQUIRED;
  const site = request.nextUrl.searchParams.get("site") ?? "";
  if (!site) {
    return Response.json({ error: { code: "NO_SITE", message: "site query param is required." } }, { status: 400 });
  }
  const db = await getDb();
  const rows = await db
    .select({
      id: evidenceRecords.id,
      contentHash: evidenceRecords.contentHash,
      scanDate: evidenceRecords.scanDate,
      createdAt: evidenceRecords.createdAt,
      record: evidenceRecords.record,
    })
    .from(evidenceRecords)
    .where(and(eq(evidenceRecords.userId, user.id), eq(evidenceRecords.siteHost, hostOf(site))))
    .orderBy(desc(evidenceRecords.createdAt))
    .limit(24);
  return Response.json({ records: rows });
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return Response.json({ error: { code: "BAD_ORIGIN", message: "Cross-origin request rejected." } }, { status: 403 });
  }
  if (!checkRateLimit(`evidence:${getClientIp(request)}`, 20, 60_000)) return rateLimited();

  const user = await getSessionUser();
  if (!user) return AUTH_REQUIRED;

  let body: { record?: { siteUrl?: string; contentHash?: string; scanDate?: string } };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: { code: "BAD_JSON", message: "Invalid request body." } }, { status: 400 });
  }
  const record = body.record;
  if (!record?.siteUrl || !record.contentHash || !record.scanDate) {
    return Response.json(
      { error: { code: "BAD_RECORD", message: "record needs siteUrl, contentHash and scanDate." } },
      { status: 400 }
    );
  }
  if (JSON.stringify(record).length > 200_000) {
    return Response.json({ error: { code: "TOO_LARGE", message: "Record too large." } }, { status: 413 });
  }

  const limits = LIMITS[user.plan] ?? LIMITS.free;
  const host = hostOf(record.siteUrl);
  const db = await getDb();

  const existing = await db
    .select({
      id: evidenceRecords.id,
      contentHash: evidenceRecords.contentHash,
      siteHost: evidenceRecords.siteHost,
    })
    .from(evidenceRecords)
    .where(and(eq(evidenceRecords.userId, user.id), eq(evidenceRecords.siteHost, host)))
    .orderBy(desc(evidenceRecords.createdAt));

  // Site limit applies only when this would be a NEW site for the account.
  if (!existing.length) {
    const [{ n: siteCount }] = await db
      .select({ n: count() })
      .from(
        db
          .selectDistinct({ h: evidenceRecords.siteHost })
          .from(evidenceRecords)
          .where(eq(evidenceRecords.userId, user.id))
          .as("hosts")
      );
    if (siteCount >= limits.sites) {
      return Response.json(
        {
          error: {
            code: "SITE_LIMIT",
            message: `Your ${user.plan} plan keeps a ledger for ${limits.sites} site${limits.sites === 1 ? "" : "s"}. Upgrade to track more.`,
          },
        },
        { status: 403 }
      );
    }
  }

  // Dedup against the newest entry — same behaviour as the local ledger.
  if (existing[0]?.contentHash === record.contentHash) {
    return Response.json({ ok: true, id: existing[0].id, deduped: true });
  }

  const id = randomUUID();
  await db.insert(evidenceRecords).values({
    id,
    userId: user.id,
    siteHost: host,
    siteUrl: String(record.siteUrl).slice(0, 300),
    contentHash: String(record.contentHash).slice(0, 128),
    scanDate: new Date(record.scanDate),
    record,
  });

  // Trim to the newest perSite records.
  const all = await db
    .select({ id: evidenceRecords.id })
    .from(evidenceRecords)
    .where(and(eq(evidenceRecords.userId, user.id), eq(evidenceRecords.siteHost, host)))
    .orderBy(asc(evidenceRecords.createdAt));
  for (const row of all.slice(0, Math.max(0, all.length - limits.perSite))) {
    await db.delete(evidenceRecords).where(eq(evidenceRecords.id, row.id));
  }

  return Response.json({ ok: true, id }, { status: 201 });
}

export const maxDuration = 15;
