// Review captures and behavior checks for the Traverse mockup.
// Usage: node scripts/capture.mjs [baseUrl]   (serve dist/ first, e.g. npx vite preview --port 4179)
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const require = createRequire("/Users/fisher/bxpk-legal/node_modules/");
const { chromium } = require("playwright");

const BASE = process.argv[2] ?? "http://localhost:4179/";
const OUT = path.resolve(import.meta.dirname, "../review");
const ONLY = process.env.ONLY?.split(",");
mkdirSync(OUT, { recursive: true });

const results = { console: [], checks: {} };
const want = (name) => !ONLY || ONLY.includes(name);

function watchConsole(page, label) {
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") results.console.push(`[${label}] ${msg.type()}: ${msg.text()}`);
  });
  page.on("pageerror", (err) => results.console.push(`[${label}] pageerror: ${err.message}`));
}

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = page.viewportSize().height;
  for (let y = 0; y < height; y += Math.round(vh * 0.6)) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(140);
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(1600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1800);
}

async function fullPage(browser, name, options) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  watchConsole(page, name);
  // ?capture lays pinned chapters out flat so the full-page image has no empty sticky runway.
  await page.goto(`${BASE}?capture`, { waitUntil: "load" });
  await settle(page);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
  await context.close();
}

async function viewport(browser, name, options, prepare) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  watchConsole(page, name);
  await page.goto(BASE, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  if (prepare) await prepare(page);
  await page.waitForTimeout(1800);
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  await context.close();
}

async function scrollInto(page, selector, fraction) {
  await page.evaluate(
    ([sel, f]) => {
      const el = document.querySelector(sel);
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + (el.offsetHeight - window.innerHeight) * f);
    },
    [selector, fraction]
  );
}

const browser = await chromium.launch();
const desktop = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };
const mobile = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

if (want("desktop")) await fullPage(browser, "desktop", desktop);
if (want("mobile")) await fullPage(browser, "mobile", { ...mobile, deviceScaleFactor: 1 });
if (want("desktop-first-viewport")) await viewport(browser, "desktop-first-viewport", desktop);
if (want("mobile-first-viewport")) await viewport(browser, "mobile-first-viewport", mobile);
if (want("desktop-reduced-motion")) await fullPage(browser, "desktop-reduced-motion", { ...desktop, reducedMotion: "reduce" });
if (want("desktop-resupply-mid"))
  await viewport(browser, "desktop-resupply-mid", desktop, async (page) => {
    await scrollInto(page, '[data-night]:has(#resupply-heading) > div', 0.02);
    await page.waitForTimeout(1200);
    await scrollInto(page, '[data-night]:has(#resupply-heading) > div', 0.55);
  });
if (want("desktop-walkthrough-mid"))
  await viewport(browser, "desktop-walkthrough-mid", desktop, async (page) => {
    await scrollInto(page, "#guide > div", 0.05);
    await page.waitForTimeout(800);
    await scrollInto(page, "#guide > div", 0.62);
  });

if (want("checks")) {
  const context = await browser.newContext(desktop);
  const page = await context.newPage();
  watchConsole(page, "checks");

  // Form: bad email shows the error, good email shows success.
  await page.goto(BASE, { waitUntil: "load" });
  await page.fill("#hero-email", "not-an-email");
  await page.click('#trailhead button[type="submit"]');
  const errorText = await page.locator("#hero-error").textContent().catch(() => null);
  const describedBy = await page.getAttribute("#hero-email", "aria-describedby");
  await page.fill("#hero-email", "name@example.com");
  await page.click('#trailhead button[type="submit"]');
  const loading = await page.locator('#trailhead button[type="submit"]').textContent();
  await page.waitForTimeout(1500);
  const success = await page.getByText(/on the list\. We.ll email you once, at launch\./).isVisible();
  results.checks.form = { errorText, describedBy, loading, success };

  // Hero field: over the same 1.2 s, a fast zigzag pushes the contours further than a slow drift.
  const sweep = async (span) => {
    await page.goto(BASE, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1200);
    await page.mouse.move(900, 640);
    await page.waitForTimeout(60);
    const steps = 60;
    for (let i = 1; i <= steps; i++) {
      const phase = (i / steps) * Math.PI * 4;
      await page.mouse.move(900 + Math.sin(phase) * span, 640 + Math.cos(phase) * span * 0.25);
      await page.waitForTimeout(20);
    }
    return page.evaluate(() => {
      const c = document.querySelector("[data-topo-field]");
      return {
        peakBent: Number(c.dataset.peakBent),
        peakDisplacement: Number(c.dataset.peakDisplacement),
        peakReach: Number(c.dataset.peakReach),
        peakPush: Number(c.dataset.peakPush),
        particles: Number(c.dataset.particles),
      };
    });
  };
  const slow = await sweep(40);
  const fast = await sweep(420);
  results.checks.heroField = {
    slow,
    fast,
    // The field reacts more when more of it bends at once, with a longer reach and a harder push.
    fastBeatsSlow: fast.peakBent > slow.peakBent && fast.peakReach > slow.peakReach && fast.peakPush > slow.peakPush,
  };

  // Keyboard: tab through the page and note any focused control without a visible ring.
  await page.goto(BASE, { waitUntil: "load" });
  const seen = [];
  const noRing = [];
  for (let i = 0; i < 140; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const ring = (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== "none";
      const r = el.getBoundingClientRect();
      return {
        label: (el.getAttribute("aria-label") || el.textContent || el.tagName).trim().slice(0, 40),
        ring,
        size: [Math.round(r.width), Math.round(r.height)],
      };
    });
    if (!info) continue;
    seen.push(info.label);
    if (!info.ring) noRing.push(info.label);
  }
  const small = await page.evaluate(() =>
    [...document.querySelectorAll("a[href], button, input, [tabindex='0']")]
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(({ el, r }) => r.width > 0 && (r.height < 44 || r.width < 44) && el.type !== "checkbox" && el.type !== "email")
      .map(({ el, r }) => `${(el.getAttribute("aria-label") || el.textContent || el.tagName).trim().slice(0, 30)} ${Math.round(r.width)}x${Math.round(r.height)}`)
  );
  results.checks.keyboard = { reached: seen.length, unique: new Set(seen).size, withoutRing: [...new Set(noRing)], under44: small };
  await context.close();
}

await browser.close();
writeFileSync(path.join(OUT, "checks.json"), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
