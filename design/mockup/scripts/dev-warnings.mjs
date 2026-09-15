// Walks the page on the dev server (where React reports its warnings) at desktop and phone
// widths, with and without reduced motion, and lists every console error or warning.
// Usage: node scripts/dev-warnings.mjs [devUrl]   (run `npm run dev` first)
import { createRequire } from "node:module";

const require = createRequire("/Users/fisher/bxpk-legal/node_modules/");
const { chromium } = require("playwright");
const BASE = process.argv[2] ?? "http://localhost:5179/";

const browser = await chromium.launch();
const messages = [];
const runs = [
  ["desktop", { viewport: { width: 1440, height: 900 } }],
  ["desktop-reduced", { viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" }],
  ["mobile", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }],
];

for (const [label, options] of runs) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  page.on("console", (msg) => {
    if (["error", "warning"].includes(msg.type()) && !msg.text().includes("[vite]")) messages.push(`[${label}] ${msg.type()}: ${msg.text()}`);
  });
  page.on("pageerror", (err) => messages.push(`[${label}] pageerror: ${err.message}`));
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForTimeout(1000);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(90);
  }
  // Exercise the interactive pieces.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const cards = page.locator('button[aria-controls^="gear-"]');
  if (await cards.count()) await cards.nth(2).click();
  const seat = page.getByRole("button", { name: /Claim seat on Squeeze/ });
  if (await seat.count()) await seat.click();
  const next = page.getByRole("button", { name: "Next posts" });
  if (await next.count()) await next.click();
  if (label === "mobile") {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.waitForTimeout(300);
    await page.keyboard.press("Escape");
    const tab = page.getByRole("tab", { name: "Walk" });
    if (await tab.count()) await tab.click();
  }
  await page.waitForTimeout(800);
  await context.close();
}

await browser.close();
console.log(messages.length ? messages.join("\n") : "No console errors or warnings.");
