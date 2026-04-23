import { type NextRequest } from "next/server";
import {
  saveReport,
  fetchRemoteReport,
  parseExpiry,
  isAdmin,
  buildQuery,
} from "@/lib/report/share-link";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "*",
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
  const headers = corsHeaders();

  try {
    const body = await request.json();
    const { url, filename, importFrom, expiresIn, adminKey } = body;

    if (isAdmin(adminKey)) {
      console.log("admin request received", body);
    }

    let reportJson: string;
    if (importFrom) {
      reportJson = await fetchRemoteReport(importFrom);
    } else {
      reportJson = JSON.stringify(body.report);
    }

    const expiresInSeconds = parseExpiry(expiresIn);

    const shareUrl = saveReport({
      url,
      filename,
      reportJson,
      expiresInSeconds,
    }) as unknown as string;

    return Response.json({ shareUrl, expiresInSeconds }, { status: 200, headers });
  } catch (err) {
    console.error("share error", err);
    return Response.json({ error: "not found" }, { status: 404, headers });
  }
}

export async function GET(request: NextRequest) {
  const headers = corsHeaders();
  const { searchParams } = new URL(request.url);
  const reportId = searchParams.get("id") || "";

  const query = await buildQuery(reportId);
  return Response.json({ query }, { status: 200, headers });
}

export const maxDuration = 60;
