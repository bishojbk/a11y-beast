/* One-off verification for the email-gated export layer. Run from project root:
   node .verify-emailgate.mjs   (expects the prod server on :3456)              */
import puppeteer from "puppeteer";

const BASE = "http://localhost:3456";
const log = (...a) => console.log("[verify]", ...a);
const fail = (msg) => {
  console.error("[FAIL]", msg);
  process.exitCode = 1;
};

const browser = await puppeteer.launch({ headless: "new" });
try {
  const page = await browser.newPage();
  await page.goto(`${BASE}/results?sample=1`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector(".dash-actions button", { timeout: 30000 });
  await page.evaluate(() => localStorage.removeItem("a11y-beast:report-unlock"));

  const clickBtn = (text) =>
    page.evaluate((t) => {
      const btn = [...document.querySelectorAll("button")].find((b) => b.textContent.trim().includes(t));
      if (!btn) throw new Error("button not found: " + t);
      btn.click();
    }, text);

  // 1. Evidence file while locked → unlock modal
  await clickBtn("Evidence file");
  await page.waitForSelector('div[aria-label="Unlock report downloads"]', { timeout: 4000 });
  log("1. evidence gate modal appears when locked ✓");

  // axe pass with the unlock modal open (forced final motion state)
  await page.addStyleTag({ content: "[style*='opacity']{opacity:1!important}" });
  await page.addScriptTag({ path: "public/axe-core/axe.min.js" });
  const violations = await page.evaluate(async () => {
    const r = await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
    });
    return r.violations.map((v) => `${v.id} ×${v.nodes.length}`);
  });
  if (violations.length) fail("axe violations with unlock modal open: " + violations.join(", "));
  else log("2. axe: 0 violations with unlock modal open ✓");
  await page.keyboard.press("Escape");

  // 2. Download-report dialog: unlock form instead of download buttons
  await clickBtn("Download report");
  await page.waitForSelector('div[role="dialog"] input[type="email"]', { timeout: 4000 });
  const lockedHasDl = await page.evaluate(() =>
    [...document.querySelectorAll('div[role="dialog"] button')].some((b) => b.textContent.includes("Download .md"))
  );
  if (lockedHasDl) fail("download button visible while locked");
  else log("3. report dialog locked: form shown, no download buttons ✓");

  // 3. Submit email → unlocks in place
  await page.type('div[role="dialog"] input[type="email"]', "verify-emailgate@example.com");
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('div[role="dialog"] button')].find((b) =>
      b.textContent.includes("Unlock downloads")
    );
    btn.click();
  });
  await page.waitForFunction(
    () => [...document.querySelectorAll('div[role="dialog"] button')].some((b) => b.textContent.includes("Download .md")),
    { timeout: 10000 }
  );
  log("4. email submit unlocks download buttons in place ✓");
  const stored = await page.evaluate(() => localStorage.getItem("a11y-beast:report-unlock"));
  if (!stored || !stored.includes("verify-emailgate@example.com")) fail("localStorage unlock flag missing/wrong: " + stored);
  else log("5. localStorage unlock flag persisted ✓");
  await page.keyboard.press("Escape");

  // 4. Legal-report dialog unlocked too (cross-instance sync).
  // Wait out the report dialog's exit animation first — its ghost stays in the
  // DOM ~300ms and poisons any unscoped dialog query.
  await new Promise((r) => setTimeout(r, 700));
  await clickBtn("Legal report");
  await new Promise((r) => setTimeout(r, 700));
  const legalState = await page.evaluate(() => {
    const dlg = [...document.querySelectorAll('div[role="dialog"]')].find((d) =>
      (d.getAttribute("aria-label") || "").startsWith("Legal report")
    );
    if (!dlg) return null;
    return {
      hasEmailInput: !!dlg.querySelector('input[type="email"]'),
      hasDownloadMd: [...dlg.querySelectorAll("button")].some((b) => b.textContent.includes("Download .md")),
    };
  });
  if (!legalState) fail("legal dialog did not open");
  else if (legalState.hasEmailInput || !legalState.hasDownloadMd)
    fail("legal dialog still locked after unlock elsewhere: " + JSON.stringify(legalState));
  else log("6. legal dialog unlocked via cross-instance sync ✓");

  log(process.exitCode ? "DONE — WITH FAILURES" : "DONE — all checks passed");
} finally {
  await browser.close();
}
