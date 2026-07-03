import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server-only DB drivers: pg is CJS with dynamic requires, PGlite ships WASM
  // assets — neither survives bundling. Loaded from node_modules at runtime.
  serverExternalPackages: ["pg", "@electric-sql/pglite"],
};

export default nextConfig;
