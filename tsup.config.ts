import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cli/index.ts"],
  format: ["cjs"],
  target: "node20",
  outDir: "dist/cli",
  clean: true,
  dts: false,
  splitting: false,
  banner: { js: "#!/usr/bin/env node" },
  external: ["puppeteer", "@sparticuz/chromium", "@anthropic-ai/sdk", "fsevents", "pa11y", "lighthouse"],
  noExternal: ["commander"],
  tsconfig: "tsconfig.cli.json",
});
