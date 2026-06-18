"use client";

import { useEffect } from "react";
import { initAnalytics } from "@/lib/analytics";

// Initializes Mixpanel once on the client. No-op when the token is unset.
export default function AnalyticsInit() {
  useEffect(() => {
    initAnalytics();
  }, []);
  return null;
}
