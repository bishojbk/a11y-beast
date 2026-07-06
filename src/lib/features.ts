// Accounts + billing UI are hidden until the paid product goes live. The launch
// surface is just the free scanner + email capture (the founding-access CTA is
// email-only via the waitlist). Sign-in, the account page, and the server-backed
// ledger only earn their place once someone is actually paying.
//
// To re-enable (do this together with turning Stripe on): set
// NEXT_PUBLIC_ACCOUNTS_ENABLED=true, plus DATABASE_URL and the STRIPE_* vars.
// NEXT_PUBLIC_ is inlined at build time, so a redeploy is required to flip it.
export const ACCOUNTS_ENABLED = process.env.NEXT_PUBLIC_ACCOUNTS_ENABLED === "true";
