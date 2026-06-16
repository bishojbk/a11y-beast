import { runBeast } from "./runners/beast";
import { runAxeRaw } from "./runners/axe-raw";
import { runPa11y } from "./runners/pa11y";
import { runLighthouse } from "./runners/lighthouse";
import type { BenchReport, BenchRun, ToolName } from "./types";

const RUNNERS: Record<ToolName, (url: string, timeoutMs: number) => Promise<BenchRun>> = {
  beast: runBeast,
  "axe-raw": runAxeRaw,
  pa11y: runPa11y,
  lighthouse: runLighthouse,
};

export interface BenchmarkArgs {
  urls: string[];
  tools: ToolName[];
  timeoutMs: number;
  onProgress?: (evt: { url: string; tool: ToolName; phase: "start" | "end"; run?: BenchRun }) => void;
}

/**
 * Runs each (url, tool) pair sequentially. Sequential on purpose — each runner
 * launches its own Chromium, so parallel execution would fight over CPU and
 * produce noisy timing numbers.
 */
export async function runBenchmark(args: BenchmarkArgs): Promise<BenchReport> {
  const runs: BenchRun[] = [];
  for (const url of args.urls) {
    for (const tool of args.tools) {
      args.onProgress?.({ url, tool, phase: "start" });
      const runner = RUNNERS[tool];
      const run = await runner(url, args.timeoutMs);
      runs.push(run);
      args.onProgress?.({ url, tool, phase: "end", run });
    }
  }
  return {
    timestamp: new Date().toISOString(),
    urls: args.urls,
    tools: args.tools,
    runs,
  };
}

export const DEFAULT_URLS: string[] = [
  "https://shopify.com",
  "https://stripe.com",
  "https://hermes.com",
  "https://ticketmaster.com",
  "https://github.com",
  "https://www.usa.gov",
  "https://news.ycombinator.com",
];

export const ALL_TOOLS: ToolName[] = ["beast", "axe-raw", "pa11y", "lighthouse"];
