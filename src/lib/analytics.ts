// Thin Mixpanel wrapper — explicit events only, no autocapture noise.
// Token-gated: if NEXT_PUBLIC_MIXPANEL_TOKEN is unset (local/dev, or before
// launch), every call is a safe no-op, so the app works identically with or
// without analytics. Set the env var in Vercel to turn it on.
import mixpanel from "mixpanel-browser";

const TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
let started = false;

export function initAnalytics(): void {
  if (started || !TOKEN || typeof window === "undefined") return;
  try {
    mixpanel.init(TOKEN, {
      persistence: "localStorage",
      track_pageview: false, // Vercel Analytics handles pageviews; we track funnel events
      ignore_dnt: false,     // respect "Do Not Track"
    });
    started = true;
  } catch {
    /* analytics must never break the app */
  }
}

export function track(event: string, props?: Record<string, unknown>): void {
  if (!TOKEN || typeof window === "undefined") return;
  if (!started) initAnalytics();
  if (!started) return;
  try {
    mixpanel.track(event, props);
  } catch {
    /* swallow — never break the app for analytics */
  }
}
