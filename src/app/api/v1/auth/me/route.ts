import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  return Response.json({
    user: user ? { email: user.email, plan: user.plan, createdAt: user.createdAt } : null,
  });
}

export const maxDuration = 15;
