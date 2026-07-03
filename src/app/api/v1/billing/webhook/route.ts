import { type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe, syncSubscription } from "@/lib/billing/stripe";

// Stripe → us. Signature-verified; no session, no rate limit (Stripe retries).
export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return Response.json({ error: { code: "BILLING_NOT_CONFIGURED", message: "Webhook not configured." } }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: { code: "NO_SIGNATURE", message: "Missing stripe-signature." } }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return Response.json({ error: { code: "BAD_SIGNATURE", message: "Signature verification failed." } }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.mode === "subscription" && session.subscription) {
          const subId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
          const sub = await stripe.subscriptions.retrieve(subId);
          await syncSubscription(sub);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        // Re-fetch the live subscription instead of trusting the (possibly
        // stale, out-of-order) event payload — Stripe does not guarantee
        // delivery order. A deleted sub is still retrievable (status=canceled),
        // so this yields current truth. syncSubscription's isCurrent guard is
        // the second line of defence.
        const fresh = await stripe.subscriptions.retrieve(event.data.object.id);
        await syncSubscription(fresh);
        break;
      }
      default:
        break; // unhandled event types are fine
    }
  } catch (err) {
    console.error("[stripe-webhook]", event.type, err);
    return Response.json({ error: { code: "SYNC_FAILED", message: "Processing failed." } }, { status: 500 });
  }

  return Response.json({ received: true });
}

export const maxDuration = 30;
