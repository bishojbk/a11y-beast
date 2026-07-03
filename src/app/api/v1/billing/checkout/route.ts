import { type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { getClientIp } from "@/lib/getClientIp";
import { checkRateLimit, rateLimited } from "@/lib/rateLimit";
import { getDb, users } from "@/lib/db";
import { getSessionUser, sameOrigin } from "@/lib/auth/session";
import {
  billingConfigured,
  foundingSeatsLeft,
  getStripe,
  priceId,
  requestOrigin,
  type PriceKey,
} from "@/lib/billing/stripe";

const PRICE_KEYS = new Set<PriceKey>(["pro_monthly", "pro_annual", "agency_founding"]);

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return Response.json({ error: { code: "BAD_ORIGIN", message: "Cross-origin request rejected." } }, { status: 403 });
  }
  if (!checkRateLimit(`checkout:${getClientIp(request)}`, 10, 60_000)) return rateLimited();

  if (!billingConfigured()) {
    return Response.json(
      { error: { code: "BILLING_NOT_CONFIGURED", message: "Checkout isn't open yet — join the waitlist and we'll email you." } },
      { status: 503 }
    );
  }

  const user = await getSessionUser();
  if (!user) {
    return Response.json(
      { error: { code: "AUTH_REQUIRED", message: "Create an account or sign in first." } },
      { status: 401 }
    );
  }

  // Block a second concurrent subscription on the same customer (Stripe allows
  // it → double billing, and two live subs make webhook plan-sync ambiguous).
  // Changing tiers happens through the billing portal, not a fresh checkout.
  if (user.plan !== "free" && user.stripeSubscriptionId) {
    return Response.json(
      {
        error: {
          code: "ALREADY_SUBSCRIBED",
          message: "You already have an active plan. Change or cancel it from your account billing page.",
        },
      },
      { status: 409 }
    );
  }

  let body: { price?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: { code: "BAD_JSON", message: "Invalid request body." } }, { status: 400 });
  }
  const key = body.price as PriceKey;
  if (!PRICE_KEYS.has(key)) {
    return Response.json({ error: { code: "BAD_PRICE", message: "Unknown price." } }, { status: 400 });
  }

  if (key === "agency_founding" && (await foundingSeatsLeft()) <= 0) {
    return Response.json(
      { error: { code: "FOUNDING_FULL", message: "All founding agency seats are taken." } },
      { status: 409 }
    );
  }

  const stripe = getStripe()!;
  const db = await getDb();

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, metadata: { userId: user.id } });
    customerId = customer.id;
    await db.update(users).set({ stripeCustomerId: customerId }).where(eq(users.id, user.id));
  }

  const origin = requestOrigin(request);
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId(key)!, quantity: 1 }],
    success_url: `${origin}/account?upgraded=1`,
    cancel_url: `${origin}/pricing`,
    allow_promotion_codes: true,
    subscription_data: { metadata: { userId: user.id } },
  });

  return Response.json({ url: session.url });
}

export const maxDuration = 30;
