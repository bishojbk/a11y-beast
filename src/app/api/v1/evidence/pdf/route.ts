import { type NextRequest } from "next/server";
import { getClientIp } from "@/lib/getClientIp";
import { checkRateLimit, rateLimited } from "@/lib/rateLimit";
import { getSessionUser, sameOrigin } from "@/lib/auth/session";
import { tryAcquireRenderSlot, releaseRenderSlot } from "@/lib/scan-semaphore";
import { getBrowser } from "@/lib/fetch/puppeteer-scanner";
import { renderEvidenceHtml, type EvidenceRecord } from "@/lib/report/evidence-file";
import type { EvidenceDiff } from "@/lib/report/evidence-ledger";
import type { Severity } from "@/lib/types/issue";

// The record arrives as untrusted JSON and parts of it are interpolated into
// HTML unescaped by the renderer (numbers, severity/level enums). Rebuild it
// field-by-field so nothing but expected shapes reaches the template.
const SEVERITIES = new Set<Severity>(["critical", "major", "minor", "best-practice"]);
const LEVELS = new Set(["A", "AA", "AAA", "—"]);

function sanitizeRecord(raw: unknown): EvidenceRecord | null {
  const r = raw as Record<string, unknown>;
  if (!r || typeof r !== "object") return null;
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
  const num = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  const summary = (r.summary ?? {}) as Record<string, unknown>;
  const bySeverityRaw = (summary.bySeverity ?? {}) as Record<string, unknown>;
  const bySeverity = {} as Record<Severity, number>;
  for (const s of SEVERITIES) bySeverity[s] = num(bySeverityRaw[s]);
  const clausesRaw = Array.isArray(r.clauses) ? r.clauses.slice(0, 200) : [];
  const clauses = clausesRaw.map((c) => {
    const cl = c as Record<string, unknown>;
    return {
      criterion: str(cl.criterion, 20) || "—",
      name: str(cl.name, 120),
      level: (LEVELS.has(String(cl.level)) ? String(cl.level) : "—") as EvidenceRecord["clauses"][number]["level"],
      issueCount: num(cl.issueCount),
      severity: (SEVERITIES.has(cl.severity as Severity) ? cl.severity : "minor") as Severity,
    };
  });
  if (!str(r.siteUrl, 300)) return null;
  return {
    siteUrl: str(r.siteUrl, 300),
    pageTitle: str(r.pageTitle, 200),
    generatedAt: str(r.generatedAt, 40) || new Date().toISOString(),
    scanDate: str(r.scanDate, 40) || new Date().toISOString(),
    toolVersion: str(r.toolVersion, 120) || "A11y Beast (axe-core + custom checks)",
    standard: str(r.standard, 120) || "EN 301 549 V3.2.1 (WCAG 2.1 level AA)",
    status: "Partially conformant",
    summary: {
      totalIssues: num(summary.totalIssues),
      affectedCriteria: num(summary.affectedCriteria),
      bySeverity,
      coverageScore: num(summary.coverageScore),
    },
    clauses,
    contentHash: str(r.contentHash, 128),
  };
}

function sanitizeDiff(raw: unknown): EvidenceDiff | undefined {
  const d = raw as Record<string, unknown>;
  if (!d || typeof d !== "object") return undefined;
  const strs = (v: unknown) =>
    Array.isArray(v) ? v.slice(0, 100).map((x) => String(x).slice(0, 20)) : [];
  const num = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  if (typeof d.sinceDate !== "string") return undefined;
  return {
    sinceDate: d.sinceDate.slice(0, 40),
    resolvedCriteria: strs(d.resolvedCriteria),
    newCriteria: strs(d.newCriteria),
    prevTotalIssues: num(d.prevTotalIssues),
    currTotalIssues: num(d.currTotalIssues),
    netIssueDelta: num(d.netIssueDelta),
  };
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return Response.json({ error: { code: "BAD_ORIGIN", message: "Cross-origin request rejected." } }, { status: 403 });
  }
  if (!checkRateLimit(`evidence-pdf:${getClientIp(request)}`, 5, 60_000)) return rateLimited();

  const user = await getSessionUser();
  if (!user || (user.plan !== "pro" && user.plan !== "agency")) {
    return Response.json(
      {
        error: {
          code: "PRO_FEATURE",
          message: user
            ? "The styled evidence PDF is a Pro feature — upgrade at /pricing."
            : "The styled evidence PDF is a Pro feature — sign in with a Pro account.",
        },
      },
      { status: 402 }
    );
  }

  let body: { record?: unknown; diff?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: { code: "BAD_JSON", message: "Invalid request body." } }, { status: 400 });
  }
  const record = sanitizeRecord(body.record);
  if (!record) {
    return Response.json({ error: { code: "BAD_RECORD", message: "record is missing or malformed." } }, { status: 400 });
  }

  // White-label attribution: Agency plan only, from the account's saved brand.
  const branding =
    user.plan === "agency" && user.brandName ? { preparedBy: user.brandName.slice(0, 80) } : undefined;
  const html = renderEvidenceHtml(record, sanitizeDiff(body.diff), branding);

  if (!tryAcquireRenderSlot()) {
    return Response.json(
      { error: { code: "SERVER_BUSY", message: "Too many renders in progress. Try again shortly." } },
      { status: 503, headers: { "Retry-After": "10" } }
    );
  }

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    let pdf: Uint8Array;
    try {
      await page.setContent(html, { waitUntil: "load", timeout: 15_000 });
      pdf = await page.pdf({
        format: "a4",
        printBackground: true,
        margin: { top: "14mm", bottom: "14mm", left: "12mm", right: "12mm" },
      });
    } finally {
      await page.close().catch(() => {});
    }

    const host = (() => {
      try {
        return new URL(record.siteUrl).host.replace(/[^\w.-]+/g, "_");
      } catch {
        return "site";
      }
    })();
    const date = record.scanDate.slice(0, 10);
    return new Response(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="evidence-record-${host}-${date}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("evidence pdf error:", err);
    return Response.json({ error: { code: "RENDER_FAILED", message: "PDF generation failed." } }, { status: 500 });
  } finally {
    releaseRenderSlot();
  }
}

export const maxDuration = 60;
