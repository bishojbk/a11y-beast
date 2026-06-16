import type { MetadataRoute } from "next";

const SITE_URL = "https://accesslens-green.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /results is per-session (or the sample) and /api is not crawlable content.
      disallow: ["/results", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
