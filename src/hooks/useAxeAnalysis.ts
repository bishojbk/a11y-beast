"use client";

import { useState, useCallback, useRef } from "react";
import type { ScanResult } from "@/lib/types/scan-result";

export type ScanStage =
  | "idle"
  | "fetching"
  | "rendering"
  | "analyzing"
  | "scoring"
  | "done"
  | "error";

export interface ScanState {
  stage: ScanStage;
  result: ScanResult | null;
  error: string | null;
}

export function useAxeAnalysis() {
  const [state, setState] = useState<ScanState>({
    stage: "idle",
    result: null,
    error: null,
  });
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const cleanup = useCallback(() => {
    if (iframeRef.current?.parentNode) {
      iframeRef.current.parentNode.removeChild(iframeRef.current);
      iframeRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    cleanup();
    setState({ stage: "idle", result: null, error: null });
  }, [cleanup]);

  // ── URL SCAN: Server-side Puppeteer (real browser rendering) ──
  const scanUrl = useCallback(async (url: string) => {
    setState({ stage: "fetching", result: null, error: null });

    try {
      setState((s) => ({ ...s, stage: "rendering" }));

      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scan failed");

      setState((s) => ({ ...s, stage: "analyzing" }));

      // Process the raw axe results into our typed format
      const { processServerResults } = await import("@/lib/analyzer/process-results");
      const result = processServerResults(data, url);

      setState((s) => ({ ...s, stage: "scoring" }));
      await new Promise((r) => setTimeout(r, 300));

      setState({ stage: "done", result, error: null });
    } catch (err) {
      setState({ stage: "error", result: null, error: err instanceof Error ? err.message : "Scan failed" });
    }
  }, []);

  // ── PASTE/UPLOAD: Client-side iframe analysis ──
  const analyzeHtml = useCallback(async (html: string, url: string, method: ScanResult["inputMethod"]) => {
    setState({ stage: "rendering", result: null, error: null });

    try {
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1280px;height:720px;opacity:0;pointer-events:none;";
      document.body.appendChild(iframe);
      iframeRef.current = iframe;

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Timeout rendering")), 15000);
        iframe.onload = () => { clearTimeout(timeout); resolve(); };
        iframe.onerror = () => { clearTimeout(timeout); reject(new Error("Failed to render")); };
        iframe.srcdoc = html;
      });

      if (!iframe.contentDocument) throw new Error("Cannot access iframe document");

      // Brief wait for any inline scripts
      await new Promise((r) => setTimeout(r, 500));

      setState((s) => ({ ...s, stage: "analyzing" }));

      const { analyzeIframe } = await import("@/lib/analyzer");
      const result = await analyzeIframe(iframe, url, method);

      setState((s) => ({ ...s, stage: "scoring" }));
      await new Promise((r) => setTimeout(r, 300));

      setState({ stage: "done", result, error: null });
      cleanup();
    } catch (err) {
      cleanup();
      setState({ stage: "error", result: null, error: err instanceof Error ? err.message : "Analysis failed" });
    }
  }, [cleanup]);

  return {
    ...state,
    scanUrl,
    analyzeHtml,
    reset,
    isScanning: state.stage !== "idle" && state.stage !== "done" && state.stage !== "error",
  };
}
