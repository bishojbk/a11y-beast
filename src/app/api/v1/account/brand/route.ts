import { type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { getClientIp } from "@/lib/getClientIp";
import { checkRateLimit, rateLimited } from "@/lib/rateLimit";
import { getDb, users } from "@/lib/db";
import { getSessionUser, sameOrigin } from "@/lib/auth/session";

// Agency white-label: the "Prepared by" name stamped on evidence PDFs.
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return Response.json({ error: { code: "BAD_ORIGIN", message: "Cross-origin request rejected." } }, { status: 403 });
  }
  if (!checkRateLimit(`brand:${getClientIp(request)}`, 10, 60_000)) return rateLimited();

  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: { code: "AUTH_REQUIRED", message: "Sign in first." } }, { status: 401 });
  }
  if (user.plan !== "agency") {
    return Response.json(
      { error: { code: "AGENCY_FEATURE", message: "White-label branding is an Agency feature." } },
      { status: 402 }
    );
  }

  let body: { brandName?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: { code: "BAD_JSON", message: "Invalid request body." } }, { status: 400 });
  }
  const brandName = String(body.brandName ?? "").trim().slice(0, 80);

  const db = await getDb();
  await db.update(users).set({ brandName: brandName || null }).where(eq(users.id, user.id));
  return Response.json({ ok: true, brandName: brandName || null });
}

export const maxDuration = 15;
