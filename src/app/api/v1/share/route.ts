import { type NextRequest } from "next/server";
import { saveReport, parseExpiry } from "@/lib/report/share-link";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
  const headers = corsHeaders();

  try {
    const body = await request.json();
    const { url, filename, expiresIn, report } = body ?? {};

    if (typeof url !== "string" || typeof filename !== "string" || report === undefined) {
      return Response.json(
        { error: { code: "INVALID_INPUT", message: "url, filename and report are required." } },
        { status: 400, headers }
      );
    }

    const reportJson = JSON.stringify(report);
    const expiresInSeconds = parseExpiry(expiresIn);

    const shareUrl = await saveReport({ url, filename, reportJson, expiresInSeconds });

    return Response.json({ shareUrl, expiresInSeconds }, { status: 200, headers });
  } catch (err) {
    console.error("share error", err instanceof Error ? err.message : "unknown");
    return Response.json(
      { error: { code: "SHARE_FAILED", message: "Could not create share link." } },
      { status: 400, headers }
    );
  }
}

export const maxDuration = 60;
