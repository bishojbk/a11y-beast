import { billingConfigured, foundingSeatsLeft } from "@/lib/billing/stripe";

// Pricing page probe: are real checkout buttons live, and how many founding
// agency seats remain? Public, cheap, no session needed.
export async function GET() {
  const configured = billingConfigured();
  return Response.json({
    configured,
    foundingSeatsLeft: configured ? await foundingSeatsLeft() : null,
  });
}

export const maxDuration = 15;
