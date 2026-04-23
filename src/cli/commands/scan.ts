import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import { puppeteerScan, puppeteerScanHtml, closeBrowser } from "@/lib/fetch/puppeteer-scanner";
import { processServerResults } from "@/lib/analyzer/process-results";
import { generateComplianceResults } from "@/lib/compliance/mapper";
import { getEffort } from "@/lib/analyzer/effort";
import type { ScanResult } from "@/lib/types/scan-result";
import type { ComplianceResult } from "@/lib/types/compliance";
import type { AiFix } from "@/lib/ai/generate-fix";
import { Spinner } from "../utils/spinner.js";
import * as log from "../utils/logger.js";
import { setVerbose } from "../utils/logger.js";
import { formatTable } from "../formatters/table.js";
import { formatJson } from "../formatters/json.js";
import { formatHtml } from "../formatters/html.js";

interface ScanOptions {
  html?: boolean;
  format: string;
  output?: string;
  threshold?: number;
  frameworks?: string;
  timeout: number;
  fix?: boolean;
  verbose?: boolean;
}

export async function scanCommand(target: string, opts: ScanOptions) {
  if (opts.verbose) setVerbose(true);

  const spinner = new Spinner();
  let scanResult: ScanResult;
  let compliance: ComplianceResult[];

  try {
    // ── Scan ──
    if (opts.html) {
      const filePath = resolve(target);
      if (!existsSync(filePath)) {
        log.error(`File not found: ${filePath}`);
        process.exit(1);
      }
      spinner.start("Reading HTML file...");
      const html = readFileSync(filePath, "utf-8");
      spinner.update("Rendering in browser...");
      log.debug(`File: ${filePath} (${html.length} bytes)`);
      const raw = await puppeteerScanHtml(html, filePath);
      if (!raw.ok) {
        spinner.stop();
        log.error(raw.error ?? "Scan failed");
        process.exit(1);
      }
      spinner.update("Processing results...");
      scanResult = processServerResults(raw as any, `file://${filePath}`);
    } else {
      const url = /^https?:\/\//i.test(target) ? target : `https://${target}`;
      spinner.start(`Scanning ${url}...`);
      log.debug(`URL: ${url}, timeout: ${opts.timeout}ms`);
      const raw = await puppeteerScan(url);
      if (!raw.ok) {
        spinner.stop();
        log.error(raw.error ?? "Scan failed");
        process.exit(1);
      }
      spinner.update("Processing results...");
      scanResult = processServerResults(raw as any, url);
    }

    // ── Compliance ──
    spinner.update("Mapping legal frameworks...");
    compliance = generateComplianceResults(
      scanResult.issues,
      scanResult.passedRules,
      {
        hasAccessibilityStatement: scanResult.pageMeta.hasAccessibilityStatement,
        hasSkipLink: scanResult.pageMeta.hasSkipLink,
        lang: scanResult.pageMeta.lang,
      }
    );

    // Filter frameworks if specified
    if (opts.frameworks) {
      const ids = opts.frameworks.split(",").map((s) => s.trim().toLowerCase());
      compliance = compliance.filter((c) => ids.includes(c.framework.id));
    }

    // ── Effort map ──
    const effortMap: Record<string, ReturnType<typeof getEffort>> = {};
    for (const issue of scanResult.issues) {
      if (!effortMap[issue.ruleId]) effortMap[issue.ruleId] = getEffort(issue.ruleId);
    }

    // ── AI Fix Generation ──
    let fixMap: Record<string, AiFix> = {};
    if (opts.fix) {
      try {
        const { generateFix, isAiAvailable } = await import("../../lib/ai/generate-fix.js");
        if (!isAiAvailable()) {
          log.warn("--fix requires ANTHROPIC_API_KEY environment variable. Skipping fixes.");
        } else {
          const fixable = scanResult.issues.filter((i) => i.severity === "critical" || i.severity === "major");
          if (fixable.length > 0) {
            spinner.update(`Generating AI fixes for ${fixable.length} issues...`);
            for (let idx = 0; idx < fixable.length; idx++) {
              const issue = fixable[idx];
              spinner.update(`Fixing ${idx + 1}/${fixable.length}: ${issue.ruleId}`);
              const res = await generateFix(issue, scanResult.pageMeta);
              if (res.ok) {
                fixMap[issue.id] = res.fix;
              } else {
                log.debug(`Fix failed for ${issue.ruleId}: ${res.error}`);
              }
            }
          }
        }
      } catch (err) {
        log.debug(`AI fix error: ${err instanceof Error ? err.message : "unknown"}`);
      }
    }

    spinner.stop(`\x1b[32m✓\x1b[0m Scan complete — score: ${scanResult.score.overall}/100 (${scanResult.score.grade})${Object.keys(fixMap).length > 0 ? ` — ${Object.keys(fixMap).length} fixes generated` : ""}`);

    // ── Format output ──
    let output: string;
    switch (opts.format) {
      case "json":
        output = formatJson(scanResult, compliance, effortMap, fixMap);
        break;
      case "html":
        output = formatHtml(scanResult, compliance, effortMap);
        break;
      case "table":
      default:
        output = formatTable(scanResult, compliance, effortMap, fixMap);
        break;
    }

    // ── Write output ──
    if (opts.output) {
      writeFileSync(opts.output, output, "utf-8");
      log.success(`Report written to ${opts.output}`);
    } else {
      process.stdout.write(output);
      if (opts.format === "table") process.stdout.write("\n");
    }

    // ── Threshold check ──
    let exitCode = 0;

    if (opts.threshold !== undefined && scanResult.score.overall < opts.threshold) {
      log.warn(`Score ${scanResult.score.overall} is below threshold ${opts.threshold}`);
      exitCode = 1;
    }

    if (scanResult.score.bySeverity.critical > 0) {
      log.warn(`${scanResult.score.bySeverity.critical} critical issue(s) found`);
      exitCode = 1;
    }

    await closeBrowser();
    process.exit(exitCode);
  } catch (err) {
    spinner.stop();
    log.error(err instanceof Error ? err.message : "Unexpected error");
    await closeBrowser();
    process.exit(1);
  }
}
