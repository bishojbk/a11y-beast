import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Build artifacts and vendored/non-source files — not ours to lint.
    // These accounted for the bulk of the pre-existing lint "baseline".
    "dist/**",
    "public/axe-core/**",
    "design_handoff_a11y_beast/**",
  ]),
]);

export default eslintConfig;
