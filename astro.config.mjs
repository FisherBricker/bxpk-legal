import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages serves this repo at fisherbricker.github.io/bxpk-legal until Task 14 sets a custom
// domain; CI passes SITE_URL and BASE_PATH from repository variables so the switch is config only.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://fisherbricker.github.io',
  base: process.env.BASE_PATH ?? '/bxpk-legal',
  // privacy.html, not privacy/index.html: GitHub Pages then serves /privacy with no redirect hop,
  // byte-for-byte the URL the app has always opened.
  build: { format: 'file' },
  integrations: [sitemap()],
});
