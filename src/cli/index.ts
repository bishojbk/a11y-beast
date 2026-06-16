import { Command } from "commander";
import { scanCommand } from "./commands/scan.js";
import { benchmarkCommand } from "./commands/benchmark.js";

const program = new Command();

program
  .name("accesslens")
  .description("Accessibility scanner — 125+ WCAG rules, 16 legal frameworks, real browser rendering")
  .version("0.1.0");

program
  .command("scan")
  .description("Scan a URL or local HTML file for accessibility issues")
  .argument("<target>", "URL to scan or path to .html file (use --html for files)")
  .option("--html", "Treat target as a local HTML file path instead of a URL")
  .option("-f, --format <type>", "Output format: table, json, html", "table")
  .option("-o, --output <path>", "Write output to file instead of stdout")
  .option("-t, --threshold <score>", "Minimum score (0-100). Exit code 1 if below.", parseInt)
  .option("--frameworks <ids>", "Comma-separated framework IDs to include (e.g. ada-title-iii,eaa)")
  .option("--timeout <ms>", "Navigation timeout in milliseconds", parseInt, 30000)
  .option("--fix", "Generate AI-powered fixes for critical/major issues (requires ANTHROPIC_API_KEY)")
  .option("-v, --verbose", "Show detailed progress")
  .action(scanCommand);

program
  .command("benchmark")
  .description("Compare A11y Beast against other scanners (axe-core, Pa11y, Lighthouse) on a URL set")
  .option("--urls <list>", "Comma-separated URLs to benchmark")
  .option("--urls-file <path>", "File with one URL per line (lines starting with # are ignored)")
  .option("--tools <list>", "Comma-separated tools: beast, axe-raw, pa11y, lighthouse — or 'all'", "all")
  .option("--output-dir <path>", "Directory to write benchmark.md + benchmark.json", "./benchmark-results")
  .option("--timeout <ms>", "Per-tool navigation timeout in ms", parseInt, 45000)
  .option("-v, --verbose", "Show detailed progress")
  .action(benchmarkCommand);

// Default to scan if first arg looks like a URL
program.parse();
