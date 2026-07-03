import Stripe from "stripe";
import { count, eq } from "drizzle-orm";
import { getDb, users, type Plan } from "@/lib/db";

// Founding-agency cap — stated publicly on the pricing page. When the count of
// agency-plan accounts reaches this, founding checkout closes.
export const FOUNDING_AGENCY_CAP = 20;

export type PriceKey = "pro_monthly" | "pro_annual" | "agency_founding";

let client: Stripe | null = null;

/** Null until STRIPE_SECRET_KEY is configured — every billing route degrades gracefully. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!client) client = new Stripe(key);
  return client;
}

export function priceId(key: PriceKey): string | undefined {
  return {
    pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    pro_annual: process.env.STRIPE_PRICE_PRO_ANNUAL,
    agency_founding: process.env.STRIPE_PRICE_AGENCY_FOUNDING,
  }[key];
}

export function billingConfigured(): boolean {
  return Boolean(
    getStripe() && priceId("pro_monthly") && priceId("pro_annual") && priceId("agency_founding")
  );
}

export function planForPriceId(id: string): Plan | null {
  if (id === priceId("pro_monthly") || id === priceId("pro_annual")) return "pro";
  if (id === priceId("agency_founding")) return "agency";
  return null;
}

export async function foundingSeatsLeft(): Promise<number> {
  const db = await getDb();
  const [{ n }] = await db.select({ n: count() }).from(users).where(eq(users.plan, "agency"));
  return Math.max(0, FOUNDING_AGENCY_CAP - n);
}

const ACTIVE_STATUSES = new Set(["active", "trialing", "past_due"]);

/** Mirror a Stripe subscription onto the owning user row (webhook + checkout). */
export async function syncSubscription(sub: Stripe.Subscription): Promise<void> {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const item = sub.items.data[0];
  const plan: Plan =
    ACTIVE_STATUSES.has(sub.status) && item ? planForPriceId(item.price.id) ?? "free" : "free";
  // API 2025+ moved current_period_end onto the subscription item.
  const periodEnd =
    (item as unknown as { current_period_end?: number })?.current_period_end ??
    (sub as unknown as { current_period_end?: number }).current_period_end;

  const db = await getDb();
  const byCustomer = await db
    .update(users)
    .set({
      plan,
      stripeSubscriptionId: sub.id,
      planRenewsAt: periodEnd ? new Date(periodEnd * 1000) : null,
    })
    .where(eq(users.stripeCustomerId, customerId))
    .returning({ id: users.id });

  // Fallback: customer not linked yet (shouldn't happen — checkout links first).
  if (!byCustomer.length) {
    const userId = sub.metadata?.userId;
    if (userId) {
      await db
        .update(users)
        .set({
          plan,
          stripeCustomerId: customerId,
          stripeSubscriptionId: sub.id,
          planRenewsAt: periodEnd ? new Date(periodEnd * 1000) : null,
        })
        .where(eq(users.id, userId));
    }
  }
}

/** Origin for redirect URLs: SITE_URL env wins, else the request's forwarded host. */
export function requestOrigin(request: Request): string {
  const envUrl = process.env.SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "localhost:3000";
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}
