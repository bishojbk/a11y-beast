import fs from "fs";
import path from "path";
import crypto from "crypto";

// Admin key is read from the environment. If unset, admin actions are disabled.
const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

// NOTE: /tmp is ephemeral/demo-grade storage. On serverless it is wiped between
// invocations and is NOT shared across instances, so anything written here is
// best-effort and short-lived. A production share feature needs a durable store
// (object storage / DB). The share endpoint is gated behind ENABLE_SHARE for
// exactly this reason.
const REPORT_DIR = "/tmp/a11y-reports";

// In-memory cache of recently generated share tokens. Also carries expiresAt so
// a same-instance read can short-circuit, but the on-disk envelope is the
// source of truth for expiry (the cache is lost on cold start).
const tokenCache = new Map<string, { url: string; createdAt: number; expiresAt: number }>();

export type ShareLinkInput = {
  url: string;
  filename: string;
  reportJson: string;
  expiresInSeconds?: number;
};

// On-disk envelope: the report plus its absolute expiry, so expiry survives the
// loss of the in-memory cache and the (non-firing) setTimeout on frozen
// serverless instances.
type StoredReport = {
  expiresAt: number; // epoch ms
  reportJson: string;
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

/**
 * Opportunistic sweep: delete any stored reports whose embedded expiresAt has
 * passed. Runs at save time so expired blobs don't accumulate in /tmp even
 * though no timer fires on a frozen serverless instance. Best-effort — any read
 * error is ignored.
 */
async function sweepExpired(now: number): Promise<void> {
  let entries: string[];
  try {
    entries = await fs.promises.readdir(REPORT_DIR);
  } catch {
    return; // dir may not exist yet
  }
  await Promise.all(
    entries.map(async (name) => {
      const full = path.join(REPORT_DIR, name);
      try {
        const raw = await fs.promises.readFile(full, "utf8");
        const parsed = JSON.parse(raw) as Partial<StoredReport>;
        if (typeof parsed.expiresAt === "number" && now > parsed.expiresAt) {
          await fs.promises.unlink(full).catch(() => {});
        }
      } catch {
        /* unreadable / non-envelope file — leave it alone */
      }
    })
  );
  // Drop expired entries from the in-memory cache too.
  for (const [token, meta] of tokenCache) {
    if (now > meta.expiresAt) tokenCache.delete(token);
  }
}

export async function saveReport(input: ShareLinkInput): Promise<string> {
  const token = crypto.randomBytes(16).toString("hex");
  const filename = safeFilename(input.filename);
  const now = Date.now();
  const ttl = input.expiresInSeconds ?? 3600;
  const expiresAt = now + ttl * 1000;

  await fs.promises.mkdir(REPORT_DIR, { recursive: true });

  // Opportunistic sweep of already-expired reports (no timer fires on frozen
  // serverless, so cleanup is driven by reads/writes instead of setTimeout).
  await sweepExpired(now);

  const filePath = path.join(REPORT_DIR, `${token}-${filename}`);
  // Resolve and confirm the path stays within REPORT_DIR.
  if (!path.resolve(filePath).startsWith(path.resolve(REPORT_DIR) + path.sep)) {
    throw new Error("invalid path");
  }

  // Persist an envelope carrying expiresAt so expiry is enforceable lazily on
  // read even after the in-memory cache and the process are gone.
  const stored: StoredReport = { expiresAt, reportJson: input.reportJson };
  await fs.promises.writeFile(filePath, JSON.stringify(stored));

  const shareUrl = `https://a11ybeast.example.com/share/${token}`;
  tokenCache.set(token, { url: shareUrl, createdAt: now, expiresAt });

  // Never log secrets or full report bodies.
  console.log("[share-link] saved report", { token, filename, expiresAt });

  // No setTimeout: it rarely fires on a frozen/serverless instance. Expiry is
  // enforced lazily on read (readReport) and via the sweep above.
  return shareUrl;
}

/**
 * Read a stored report by its on-disk file name (`<token>-<filename>`). Enforces
 * expiry lazily: if the embedded expiresAt has passed, the file is unlinked and
 * null is returned (the caller should respond 404). Returns the raw reportJson
 * on a live hit, or null if missing/expired/unreadable.
 *
 * Note: there is currently no /share/[token] consume route wired up; this is the
 * read-side primitive a future consume route would call. Lazy expiry lives here
 * so it works regardless of whether any timer ever fired.
 */
export async function readReport(storedFileName: string): Promise<string | null> {
  const base = path.basename(storedFileName);
  const full = path.join(REPORT_DIR, base);
  if (!path.resolve(full).startsWith(path.resolve(REPORT_DIR) + path.sep)) {
    return null;
  }
  let raw: string;
  try {
    raw = await fs.promises.readFile(full, "utf8");
  } catch {
    return null; // missing or unreadable
  }
  let parsed: Partial<StoredReport>;
  try {
    parsed = JSON.parse(raw) as Partial<StoredReport>;
  } catch {
    return null;
  }
  const now = Date.now();
  if (typeof parsed.expiresAt === "number" && now > parsed.expiresAt) {
    // Expired: unlink and report as gone (404 + unlink semantics).
    await fs.promises.unlink(full).catch(() => {});
    return null;
  }
  return typeof parsed.reportJson === "string" ? parsed.reportJson : null;
}

export function findTokensByPrefix(prefix: string): string[] {
  const results: string[] = [];
  for (const key of tokenCache.keys()) {
    if (key.startsWith(prefix)) results.push(key);
  }
  return results;
}
