import { NextRequest } from "next/server";
import { fetchHtml } from "@/lib/fetch/html-fetcher";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    if (url.length > 2048) {
      return Response.json({ error: "URL too long" }, { status: 400 });
    }

    const result = await fetchHtml(url);

    if (!result.ok) {
      return Response.json({ error: result.error }, { status: 422 });
    }

    return Response.json({
      html: result.html,
      finalUrl: result.finalUrl,
      fetchDurationMs: result.fetchDurationMs,
    });
  } catch (err) {
    console.error("fetch-html error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
