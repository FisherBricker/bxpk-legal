import { expect, test } from '@playwright/test';
import { BASE } from './base';

// The sitemap is the source of truth for each page's canonical URL. If they drift, search
// engines see two URLs for one page. Read every <loc> from the built sitemap and check the
// page it points to declares that exact URL as its canonical.
test('every page canonical matches its sitemap entry', async ({ page, baseURL }) => {
  const sitemapUrl = new URL(`${BASE}/sitemap-0.xml`, baseURL).toString();
  const response = await page.request.get(sitemapUrl);
  expect(response.status()).toBe(200);
  const xml = await response.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(locs.length).toBeGreaterThan(0);

  for (const loc of locs) {
    const locUrl = new URL(loc);
    const previewUrl = new URL(locUrl.pathname, baseURL).toString();
    await page.goto(previewUrl);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical, `canonical for ${previewUrl}`).toBe(loc);
  }
});
