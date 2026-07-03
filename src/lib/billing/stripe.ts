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

/** Mirror a Stripe subscription onto the owning user row (webhook + checkout).
 *  Three safety rules, because Stripe does not guarantee event ordering and a
 *  customer can briefly hold two subscriptions:
 *   1. An ACTIVE sub with a price we don't recognise (e.g. a rotated/re-priced
 *      price id) never downgrades a paying customer — keep their plan, log it.
 *   2. An INACTIVE event for a subscription that is NOT the user's current one
 *      is ignored (a stale/out-of-order or old-sub-lapsing event must not wipe
 *      the live plan).
 *   3. An ACTIVE event always takes ownership (handles re-subscribe with a new
 *      sub id on the same customer). */
export async function syncSubscription(sub: Stripe.Subscription): Promise<void> {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const item = sub.items.data[0];
  const active = ACTIVE_STATUSES.has(sub.status) && !!item;
  const mappedPlan = item ? planForPriceId(item.price.id) : null;
  // API 2025+ moved current_period_end onto the subscription item.
  const periodEnd =
    (item as unknown as { current_period_end?: number })?.current_period_end ??
    (sub as unknown as { current_period_end?: number }).current_period_end;

  const db = await getDb();
  const userId = sub.metadata?.userId;
  const row =
    (await db.select().from(users).where(eq(users.stripeCustomerId, customerId)).limit(1))[0] ??
    (userId ? (await db.select().from(users).where(eq(users.id, userId)).limit(1))[0] : undefined);
  if (!row) {
    console.error("[stripe] syncSubscription: no user for customer", customerId, "sub", sub.id);
    return;
  }

  const isCurrent = !row.stripeSubscriptionId || row.stripeSubscriptionId === sub.id;
  // Rule 2: ignore inactive events for a non-current subscription.
  if (!active && !isCurrent) return;

  // Rule 1: unrecognised active price → keep the existing plan, don't fail open.
  if (active && mappedPlan === null) {
    console.error("[stripe] unrecognised active price", item?.price.id, "sub", sub.id, "— keeping plan", row.plan);
  }
  const plan: Plan = active ? mappedPlan ?? row.plan : "free";

  // Founding-cap backstop: the checkout pre-check can be beaten by concurrent /
  // long-lived unpaid sessions (a created session stays payable for hours). We
  // can't refuse a completed payment, but a loud alert lets the founder refund
  // or close signups. A hard guarantee would need a seat-reservation table.
  if (plan === "agency" && row.plan !== "agency" && (await foundingSeatsLeft()) <= 0) {
    console.error(
      "[stripe] FOUNDING CAP EXCEEDED — granting agency to",
      row.email,
      "past the",
      FOUNDING_AGENCY_CAP,
      "seat cap. Review/refund and close founding signups."
    );
  }

  await db
    .update(users)
    .set({
      plan,
      stripeCustomerId: customerId,
      // Rule 3: active event owns the row; deactivation of the current sub clears it.
      stripeSubscriptionId: active ? sub.id : null,
      planRenewsAt: active && periodEnd ? new Date(periodEnd * 1000) : null,
    })
    .where(eq(users.id, row.id));
}

/** Origin for redirect URLs: SITE_URL env wins, else the request's forwarded host. */
export function requestOrigin(request: Request): string {
  const envUrl = process.env.SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "localhost:3000";
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}
