import { type NextRequest } from "next/server";
import { getSessionUser, sameOrigin } from "@/lib/auth/session";
import { getStripe, requestOrigin } from "@/lib/billing/stripe";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return Response.json({ error: { code: "BAD_ORIGIN", message: "Cross-origin request rejected." } }, { status: 403 });
  }
  const stripe = getStripe();
  if (!stripe) {
    return Response.json({ error: { code: "BILLING_NOT_CONFIGURED", message: "Billing isn't configured yet." } }, { status: 503 });
  }
  const user = await getSessionUser();
  if (!user?.stripeCustomerId) {
    return Response.json({ error: { code: "NO_CUSTOMER", message: "No billing profile on this account." } }, { status: 400 });
  }
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${requestOrigin(request)}/account`,
  });
  return Response.json({ url: session.url });
}

export const maxDuration = 30;
