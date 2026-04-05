import { NextRequest } from "next/server";
import { puppeteerScan } from "@/lib/fetch/puppeteer-scanner";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }
    if (url.length > 2048) {
      return Response.json({ error: "URL too long" }, { status: 400 });
    }

    const result = await puppeteerScan(url);

    if (!result.ok) {
      return Response.json({ error: result.error }, { status: 422 });
    }

    return Response.json({
      finalUrl: result.finalUrl,
      fetchDurationMs: result.fetchDurationMs,
      axeResults: result.axeResults,
      customIssues: result.customIssues ?? [],
      pageMeta: result.pageMeta,
    });
  } catch (err) {
    console.error("Scan error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
