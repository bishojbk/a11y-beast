import { lookup } from "node:dns/promises";

const PRIVATE_RANGES = [
  // IPv4 private/reserved
  { start: "0.0.0.0", end: "0.255.255.255" },
  { start: "10.0.0.0", end: "10.255.255.255" },
  { start: "100.64.0.0", end: "100.127.255.255" },
  { start: "127.0.0.0", end: "127.255.255.255" },
  { start: "169.254.0.0", end: "169.254.255.255" },
  { start: "172.16.0.0", end: "172.31.255.255" },
  { start: "192.0.0.0", end: "192.0.0.255" },
  { start: "192.168.0.0", end: "192.168.255.255" },
  { start: "198.18.0.0", end: "198.19.255.255" },
  // Cloud metadata endpoints
  { start: "169.254.169.254", end: "169.254.169.254" },
];

const BLOCKED_HOSTNAMES = [
  "localhost",
  "metadata.google.internal",
  "metadata.google.internal.",
];

const BLOCKED_SUFFIXES = [".local", ".internal", ".localhost", ".test"];

function ipToNumber(ip: string): number {
  const parts = ip.split(".").map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function isPrivateIp(ip: string): boolean {
  // IPv6 loopback, mapped, link-local, and private ranges
  const lower = ip.toLowerCase();
  if (
    lower === "::1" ||
    lower === "::ffff:127.0.0.1" ||
    lower.startsWith("fc00:") ||
    lower.startsWith("fd") ||
    lower.startsWith("fe80:") ||     // Link-local
    lower.startsWith("ff") ||        // Multicast
    lower.startsWith("::ffff:10.") ||
    lower.startsWith("::ffff:172.") ||
    lower.startsWith("::ffff:192.168.") ||
    lower.startsWith("::ffff:127.") ||
    lower === "::"                    // Unspecified
  ) {
    return true;
  }

  // IPv4
  if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)) return false;

  const ipNum = ipToNumber(ip);
  for (const range of PRIVATE_RANGES) {
    const start = ipToNumber(range.start);
    const end = ipToNumber(range.end);
    if (ipNum >= start && ipNum <= end) return true;
  }
  return false;
}

export interface ValidationResult {
  safe: boolean;
  url: URL | null;
  reason?: string;
}

export async function validateUrl(input: string): Promise<ValidationResult> {
  // 1. Parse URL
  let url: URL;
  try {
    const raw = input.startsWith("http") ? input : `https://${input}`;
    url = new URL(raw);
  } catch {
    return { safe: false, url: null, reason: "Invalid URL format" };
  }

  // 2. Protocol — only http/https
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { safe: false, url: null, reason: `Protocol '${url.protocol}' not allowed. Use http or https.` };
  }

  // 3. Port — only 80/443/default
  if (url.port && url.port !== "80" && url.port !== "443") {
    return { safe: false, url: null, reason: `Port ${url.port} not allowed. Only 80 and 443 are accepted.` };
  }

  // 4. Blocked hostnames
  const hostname = url.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.includes(hostname)) {
    return { safe: false, url, reason: `Hostname '${hostname}' is blocked.` };
  }

  // 5. Blocked suffixes
  for (const suffix of BLOCKED_SUFFIXES) {
    if (hostname.endsWith(suffix)) {
      return { safe: false, url, reason: `Hostname ending in '${suffix}' is blocked.` };
    }
  }

  // 6. Check if hostname is a literal IPv4
  const isLiteralIpv4 = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname);
  if (isLiteralIpv4) {
    if (isPrivateIp(hostname)) {
      return { safe: false, url, reason: "Private/reserved IP addresses are blocked." };
    }
  }

  // 7. Block IPv6 literals
  if (hostname.startsWith("[")) {
    return { safe: false, url, reason: "IPv6 literal addresses are not allowed." };
  }

  // 8. DNS resolution — catch DNS rebinding and public hostnames that resolve
  // to private IPs. Literal IPs have already been checked above.
  if (!isLiteralIpv4) {
    try {
      const addresses = await lookup(hostname, { all: true });
      for (const { address } of addresses) {
        if (isPrivateIp(address)) {
          return {
            safe: false,
            url,
            reason: `Hostname '${hostname}' resolves to a private/reserved IP (${address}).`,
          };
        }
      }
    } catch {
      return { safe: false, url, reason: `Could not resolve hostname '${hostname}'.` };
    }
  }

  return { safe: true, url };
}

export const FETCH_LIMITS = {
  maxBodyBytes: 5 * 1024 * 1024, // 5MB
  timeoutMs: 15_000,
  maxRedirects: 3,
  userAgent: "A11yBeast/1.0 (accessibility-checker; +https://a11ybeast.com)",
};
