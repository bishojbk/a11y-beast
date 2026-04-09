import { validateUrl, FETCH_LIMITS } from "./ssrf-guard";

export interface FetchResult {
  ok: boolean;
  html?: string;
  finalUrl?: string;
  statusCode?: number;
  error?: string;
  fetchDurationMs: number;
}

export async function fetchHtml(url: string): Promise<FetchResult> {
  const start = Date.now();

  // Validate URL
  const validation = validateUrl(url);
  if (!validation.safe || !validation.url) {
    return { ok: false, error: validation.reason ?? "Invalid URL", fetchDurationMs: Date.now() - start };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_LIMITS.timeoutMs);

    const response = await fetch(validation.url.toString(), {
      method: "GET",
      headers: {
        "User-Agent": FETCH_LIMITS.userAgent,
        "Accept": "text/html,application/xhtml+xml,*/*",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return {
        ok: false,
        statusCode: response.status,
        error: `Server returned ${response.status} ${response.statusText}`,
        fetchDurationMs: Date.now() - start,
      };
    }

    // Check content type
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return { ok: false, error: `Not an HTML page (${contentType})`, fetchDurationMs: Date.now() - start };
    }

    // Read body with size limit
    const reader = response.body?.getReader();
    if (!reader) {
      return { ok: false, error: "No response body", fetchDurationMs: Date.now() - start };
    }

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > FETCH_LIMITS.maxBodyBytes) {
        reader.cancel();
        return { ok: false, error: `Page exceeds ${FETCH_LIMITS.maxBodyBytes / 1024 / 1024}MB limit`, fetchDurationMs: Date.now() - start };
      }
      chunks.push(value);
    }

    const decoder = new TextDecoder("utf-8");
    let html = chunks.map((c) => decoder.decode(c, { stream: true })).join("") + decoder.decode();

    // Inject <base href> so relative URLs (CSS, JS, images) resolve to the
    // original domain when the HTML is rendered inside an iframe via srcdoc.
    // This is what makes the scanned page actually render properly.
    const finalUrl = response.url;
    const baseUrl = new URL(finalUrl);
    const baseHref = `${baseUrl.protocol}//${baseUrl.host}/`;
    const baseTag = `<base href="${baseHref}">`;

    // Remove any existing <base> tags to avoid conflicts (only the first <base> is honored)
    html = html.replace(/<base\s[^>]*>/gi, "");

    // Inject charset meta if missing to ensure proper encoding in srcdoc iframe
    const hasCharset = /<meta[^>]+charset/i.test(html);
    const charsetTag = hasCharset ? "" : '<meta charset="utf-8">';

    if (html.includes("<head>")) {
      html = html.replace("<head>", `<head>${charsetTag}${baseTag}`);
    } else if (html.includes("<head ")) {
      html = html.replace(/<head\s[^>]*>/, (match) => `${match}${charsetTag}${baseTag}`);
    } else if (html.includes("<html")) {
      // No <head> tag — inject one
      html = html.replace(/<html[^>]*>/, (match) => `${match}<head>${charsetTag}${baseTag}</head>`);
    } else {
      // Bare HTML — prepend base tag
      html = `${charsetTag}${baseTag}${html}`;
    }

    return {
      ok: true,
      html,
      finalUrl,
      statusCode: response.status,
      fetchDurationMs: Date.now() - start,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Fetch failed";
    if (message.includes("abort")) {
      return { ok: false, error: `Timeout: page took longer than ${FETCH_LIMITS.timeoutMs / 1000}s`, fetchDurationMs: Date.now() - start };
    }
    return { ok: false, error: message, fetchDurationMs: Date.now() - start };
  }
}
