import { expect, test } from '@playwright/test';
import { BASE } from './base';

// These exact paths are compiled into shipped builds of the app (LegalLinks.swift).
const PAGES = [
  ['privacy', 'Privacy Policy'],
  ['terms', 'Terms of Service'],
  ['support', 'Support'],
] as const;

for (const [slug, heading] of PAGES) {
  test(`/${slug} is served at the URL the app opens`, async ({ page }) => {
    const response = await page.goto(`${BASE}/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
  });
}
