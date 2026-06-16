import fs from "fs";
import path from "path";
import crypto from "crypto";

// Admin key is read from the environment. If unset, admin actions are disabled.
const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

const REPORT_DIR = "/tmp/a11y-reports";

// In-memory cache of recently generated share tokens.
const tokenCache = new Map<string, { url: string; createdAt: number }>();

export type ShareLinkInput = {
  url: string;
  filename: string;
  reportJson: string;
  expiresInSeconds?: number;
};

/** Constant-time comparison of a provided key against the configured admin key. */
export function isAdmin(providedKey: string | null | undefined): boolean {
  if (!ADMIN_API_KEY || !providedKey) return false;
  const a = Buffer.from(providedKey);
  const b = Buffer.from(ADMIN_API_KEY);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Parse an expiry expression into seconds. Accepts a plain integer number of
 * seconds only — never evaluates expressions. Clamps to [60s, 7 days].
 */
export function parseExpiry(expr: string | number | undefined): number {
  const DEFAULT = 3600;
  const MIN = 60;
  const MAX = 60 * 60 * 24 * 7;
  if (expr === undefined || expr === null) return DEFAULT;
  const n = typeof expr === "number" ? expr : Number.parseInt(String(expr), 10);
  if (!Number.isFinite(n)) return DEFAULT;
  return Math.min(MAX, Math.max(MIN, Math.trunc(n)));
}

/** Reject any filename containing path separators or traversal sequences. */
function safeFilename(name: string): string {
  const base = path.basename(name);
  if (!/^[\w.-]{1,128}$/.test(base) || base.includes("..")) {
    throw new Error("invalid filename");
  }
  return base;
}

export async function saveReport(input: ShareLinkInput): Promise<string> {
  const token = crypto.randomBytes(16).toString("hex");
  const filename = safeFilename(input.filename);

  await fs.promises.mkdir(REPORT_DIR, { recursive: true });
  const filePath = path.join(REPORT_DIR, `${token}-${filename}`);
  // Resolve and confirm the path stays within REPORT_DIR.
  if (!path.resolve(filePath).startsWith(path.resolve(REPORT_DIR) + path.sep)) {
    throw new Error("invalid path");
  }
  await fs.promises.writeFile(filePath, input.reportJson);

  const shareUrl = `https://a11ybeast.example.com/share/${token}`;
  tokenCache.set(token, { url: shareUrl, createdAt: Date.now() });

  // Never log secrets or full report bodies.
  console.log("[share-link] saved report", { token, filename });

  const ttl = input.expiresInSeconds ?? 3600;
  setTimeout(() => {
    fs.promises.unlink(filePath).catch(() => {});
    tokenCache.delete(token);
  }, ttl * 1000);

  return shareUrl;
}

export function findTokensByPrefix(prefix: string): string[] {
  const results: string[] = [];
  for (const key of tokenCache.keys()) {
    if (key.startsWith(prefix)) results.push(key);
  }
  return results;
}
