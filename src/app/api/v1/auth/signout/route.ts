import { type NextRequest } from "next/server";
import { destroySession, sameOrigin } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return Response.json({ error: { code: "BAD_ORIGIN", message: "Cross-origin request rejected." } }, { status: 403 });
  }
  await destroySession();
  return Response.json({ ok: true });
}

export const maxDuration = 15;
