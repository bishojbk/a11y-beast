/* Full-site axe sweep, both themes, scroll + final motion state (the corrected
   harness — reveal-gated sections must not be skipped). Run from project root
   with the prod server on :3456:  node .axe-sweep.mjs                        */
import puppeteer from "puppeteer";

const BASE = "http://localhost:3456";
const ROUTES = [
  "/", "/results?sample=1", "/pricing", "/features", "/cli", "/about",
  "/blog", "/blog/ada-wcag-compliance-checklist", "/accessibility-statement-generator",
  "/privacy", "/terms", "/signin", "/signup", "/does-not-exist-404",
];

const browser = await puppeteer.launch({ headless: "new" });
let failures = 0;
try {
  for (const theme of ["light", "dark"]) {
    const page = await browser.newPage();
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    for (const route of ROUTES) {
      await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.evaluate((t) => {
        if (t === "dark") { document.documentElement.setAttribute("data-theme", "dark"); localStorage.setItem("theme", "dark"); }
        else { document.documentElement.removeAttribute("data-theme"); localStorage.setItem("theme", "light"); }
      }, theme);
      // scroll to force whileInView reveals, then pin final state
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let y = 0;
          const step = () => {
            y += 600; window.scrollTo(0, y);
            if (y < document.body.scrollHeight) setTimeout(step, 60);
            else { window.scrollTo(0, 0); resolve(undefined); }
          };
          step();
        });
      });
      await page.addStyleTag({ content: "[style*='opacity']{opacity:1!important}" });
      await new Promise((r) => setTimeout(r, 250));
      await page.addScriptTag({ path: "public/axe-core/axe.min.js" });
      const violations = await page.evaluate(async () => {
        const r = await window.axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
        });
        return r.violations.map((v) => `${v.id} ×${v.nodes.length} [${v.nodes[0]?.target?.join(" ")}]`);
      });
      if (violations.length) {
        failures++;
        console.log(`✗ ${theme} ${route}: ${violations.join("; ")}`);
      } else {
        console.log(`✓ ${theme} ${route}`);
      }
    }
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(failures ? `SWEEP FAILED — ${failures} route/theme combos with violations` : "SWEEP CLEAN — 0 violations everywhere");
process.exit(failures ? 1 : 0);
