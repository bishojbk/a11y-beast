import { Agent, fetch as undiciFetch, type RequestInit, type Response } from "undici";
import { validateUrl, FETCH_LIMITS, type ValidationResult } from "./ssrf-guard";

/**
 * SSRF-hardened fetch.
 *
 * Plain `fetch(url, { redirect: "follow" })` is an open SSRF even after the
 * initial URL is validated: a public, validated origin can 30x-redirect to
 * `169.254.169.254` or `127.0.0.1` and the body of that internal host is
 * returned to the caller. This helper closes that hole by:
 *
 *   1. Re-running `validateUrl()` on every hop (initial + each redirect target),
 *      resolving relative `Location` headers against the current URL.
 *   2. Following redirects manually with `redirect: "manual"`, capped at
 *      `FETCH_LIMITS.maxRedirects`.
 *   3. Pinning each connection to the exact IP that `validateUrl()` vetted, via
 *      an undici `Agent` whose `connect.lookup` forces that address while the
 *      `Host` header still carries the real hostname. This defeats DNS
 *      rebinding (the address checked is the address connected to).
 *
 * We use undici's own `fetch` (not the global one) so the `Agent` dispatcher and
 * the fetch implementation are guaranteed version-compatible.
 *
 * Returns the final non-redirect `Response` plus the validated final URL and the
 * dispatcher used for it. The caller owns content-type / body-size enforcement
 * and body consumption, and MUST call `result.dispose()` once the body is fully
 * read (or on error) so the pinned connection pool is released.
 */
export interface SafeFetchResult {
  response: Response;
  finalUrl: string;
  /** Releases the pinned dispatcher. Idempotent. Call after consuming the body. */
  dispose: () => Promise<void>;
}

/** Build a dispatcher that forces every connection for this hop to a vetted IP. */
function pinnedAgent(addresses: string[]): Agent {
  const pinned = addresses[0];
  return new Agent({
    connect: {
      // undici/Node dns.lookup callback form. We ignore the requested hostname
      // and always hand back the address we already vetted for this hop, so a
      // concurrent rebind can't redirect the socket to a private host.
      lookup(_hostname, _options, callback) {
        callback(null, [{ address: pinned, family: pinned.includes(":") ? 6 : 4 }]);
      },
    },
  });
}

export async function safeFetch(
  initialUrl: string,
  init: Omit<RequestInit, "redirect" | "dispatcher"> = {},
): Promise<SafeFetchResult> {
  // Validate + pin the first hop.
  let validation: ValidationResult = await validateUrl(initialUrl);
  if (!validation.safe || !validation.url || !validation.addresses?.length) {
    throw new Error(validation.reason ?? "Blocked URL");
  }

  let currentUrl = validation.url;
  let agent = pinnedAgent(validation.addresses);

  try {
    for (let hop = 0; ; hop++) {
      const response = await undiciFetch(currentUrl.toString(), {
        ...init,
        redirect: "manual",
        dispatcher: agent,
      });

      // Not a redirect — this is the final response. Hand the live dispatcher
      // to the caller so the body stays readable; they dispose() when done.
      if (response.status < 300 || response.status >= 400) {
        const finalAgent = agent;
        return {
          response,
          finalUrl: currentUrl.toString(),
          dispose: () => finalAgent.close().catch(() => {}),
        };
      }

      // Redirect: enforce the hop cap, then re-validate + re-pin the target.
      if (hop >= FETCH_LIMITS.maxRedirects) {
        // Drain so the socket can be released before we bail.
        await response.body?.cancel().catch(() => {});
        throw new Error(`Too many redirects (>${FETCH_LIMITS.maxRedirects})`);
      }

      const location = response.headers.get("location");
      await response.body?.cancel().catch(() => {});
      if (!location) {
        throw new Error(`Redirect ${response.status} with no Location header`);
      }

      let nextUrl: string;
      try {
        nextUrl = new URL(location, currentUrl).toString();
      } catch {
        throw new Error(`Redirect to invalid URL: ${location}`);
      }

      validation = await validateUrl(nextUrl);
      if (!validation.safe || !validation.url || !validation.addresses?.length) {
        throw new Error(`Blocked redirect to ${nextUrl}: ${validation.reason ?? "unsafe"}`);
      }

      // Swap the dispatcher to one pinned at the new target's vetted IP.
      const previousAgent = agent;
      currentUrl = validation.url;
      agent = pinnedAgent(validation.addresses);
      await previousAgent.close().catch(() => {});
    }
  } catch (err) {
    await agent.close().catch(() => {});
    throw err;
  }
}
