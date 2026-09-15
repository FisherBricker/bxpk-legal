import { defineConfig, devices } from '@playwright/test';
import { BASE } from './tests/e2e/base';

// The health-check URL must resolve under BASE: the site has no route at bare "/" once Astro is
// configured with `base`, so checking "http://localhost:4321" alone 404s and the server never
// reads as ready.
export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: `http://localhost:4321${BASE}` },
  webServer: { command: 'npm run build && npm run preview', url: `http://localhost:4321${BASE}/`, reuseExistingServer: !process.env.CI, timeout: 180_000 },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'desktop-safari', use: { ...devices['Desktop Safari'] } },
    { name: 'desktop-firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'iphone', use: { ...devices['iPhone 15'] } },
  ],
});
