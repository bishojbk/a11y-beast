import { randomUUID } from "node:crypto";
import { type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { getClientIp } from "@/lib/getClientIp";
import { checkRateLimit, rateLimited } from "@/lib/rateLimit";
import { getDb, users } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { createSession, sameOrigin } from "@/lib/auth/session";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return Response.json({ error: { code: "BAD_ORIGIN", message: "Cross-origin request rejected." } }, { status: 403 });
  }
  if (!checkRateLimit(`signup:${getClientIp(request)}`, 5, 60_000)) return rateLimited();

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: { code: "BAD_JSON", message: "Invalid request body." } }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return Response.json({ error: { code: "INVALID_EMAIL", message: "Enter a valid email address." } }, { status: 400 });
  }
  if (password.length < 8 || password.length > 200) {
    return Response.json(
      { error: { code: "WEAK_PASSWORD", message: "Password must be at least 8 characters." } },
      { status: 400 }
    );
  }

  const db = await getDb();
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing.length) {
    return Response.json(
      { error: { code: "EMAIL_TAKEN", message: "An account with this email already exists — sign in instead." } },
      { status: 409 }
    );
  }

  const id = randomUUID();
  await db.insert(users).values({ id, email, passwordHash: await hashPassword(password) });
  await createSession(id);
  return Response.json({ ok: true, user: { email, plan: "free" } }, { status: 201 });
}

export const maxDuration = 15;
