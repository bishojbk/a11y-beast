import { type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { getClientIp } from "@/lib/getClientIp";
import { checkRateLimit, rateLimited } from "@/lib/rateLimit";
import { getDb, users } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, sameOrigin } from "@/lib/auth/session";

// One uniform failure message — never reveal whether the email exists.
const FAIL = Response.json.bind(Response, {
  error: { code: "BAD_CREDENTIALS", message: "Email or password is incorrect." },
});

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return Response.json({ error: { code: "BAD_ORIGIN", message: "Cross-origin request rejected." } }, { status: 403 });
  }
  if (!checkRateLimit(`signin:${getClientIp(request)}`, 10, 60_000)) return rateLimited();

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: { code: "BAD_JSON", message: "Invalid request body." } }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  if (!email || !password) return FAIL({ status: 401 });

  const db = await getDb();
  const row = (await db.select().from(users).where(eq(users.email, email)).limit(1))[0];
  if (!row || !(await verifyPassword(password, row.passwordHash))) return FAIL({ status: 401 });

  await createSession(row.id);
  return Response.json({ ok: true, user: { email: row.email, plan: row.plan } });
}

export const maxDuration = 15;
