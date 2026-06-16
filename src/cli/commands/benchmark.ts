import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { closeBrowser } from "@/lib/fetch/puppeteer-scanner";
import { runBenchmark, DEFAULT_URLS, ALL_TOOLS } from "@/benchmark/run";
import type { ToolName } from "@/benchmark/types";
import { renderMarkdown, renderJson, renderStdoutSummary } from "@/benchmark/report";
import * as log from "../utils/logger.js";
import { setVerbose } from "../utils/logger.js";

export interface BenchmarkOptions {
  urls?: string;
  urlsFile?: string;
  tools: string;
  outputDir: string;
  timeout: number;
  verbose?: boolean;
}

function parseUrls(opts: BenchmarkOptions): string[] {
  if (opts.urlsFile) {
    const abs = resolve(opts.urlsFile);
    if (!existsSync(abs)) {
      log.error(`URL file not found: ${abs}`);
      process.exit(1);
    }
    return readFileSync(abs, "utf-8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
  }
  if (opts.urls) {
    return opts.urls.split(",").map((u) => u.trim()).filter(Boolean);
  }
  return DEFAULT_URLS;
}

function parseTools(raw: string): ToolName[] {
  if (raw === "all") return ALL_TOOLS;
  const wanted = raw.split(",").map((t) => t.trim()) as ToolName[];
  const bad = wanted.filter((t) => !ALL_TOOLS.includes(t));
  if (bad.length) {
    log.error(`Unknown tool(s): ${bad.join(", ")}. Valid: ${ALL_TOOLS.join(", ")}`);
    process.exit(1);
  }
  return wanted;
}

export async function benchmarkCommand(opts: BenchmarkOptions) {
  if (opts.verbose) setVerbose(true);

  const urls = parseUrls(opts);
  const tools = parseTools(opts.tools);
  const outputDir = resolve(opts.outputDir);

  if (urls.length === 0) {
    log.error("No URLs to scan");
    process.exit(1);
  }

  log.info(`Benchmarking ${urls.length} URL(s) across ${tools.length} tool(s) → ${outputDir}`);
  log.debug(`URLs: ${urls.join(", ")}`);
  log.debug(`Tools: ${tools.join(", ")}`);

  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  const started = Date.now();
  try {
    const report = await runBenchmark({
      urls,
      tools,
      timeoutMs: opts.timeout,
      onProgress: ({ url, tool, phase, run }) => {
        if (phase === "start") {
          log.info(`${tool} → ${url}`);
        } else if (run) {
          if (!run.ok) log.warn(`${tool} failed on ${url}: ${run.error ?? "unknown error"}`);
          else log.success(`${tool} ${url} · ${run.uniqueRuleCount} rule(s) · ${(run.durationMs / 1000).toFixed(1)}s`);
        }
      },
    });

    const md = renderMarkdown(report);
    const json = renderJson(report);
    const mdPath = join(outputDir, "benchmark.md");
    const jsonPath = join(outputDir, "benchmark.json");
    writeFileSync(mdPath, md, "utf-8");
    writeFileSync(jsonPath, json, "utf-8");

    process.stdout.write("\n" + renderStdoutSummary(report.runs, report.tools) + "\n\n");
    log.success(`Wrote ${mdPath}`);
    log.success(`Wrote ${jsonPath}`);
    log.info(`Total wall time: ${((Date.now() - started) / 1000).toFixed(1)}s`);
  } finally {
    await closeBrowser();
  }
}
