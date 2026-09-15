/**
 * An internal link under the base the site is served from.
 *
 * GitHub Pages serves this repository under /bxpk-legal until a custom domain is set, and at the
 * root after. Every internal link goes through here so that switch is one config value, not a
 * search through every page.
 */
export function withBase(path: string, base: string = import.meta.env.BASE_URL): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(path) || path.startsWith('#')) return path;
  const prefix = base.replace(/\/+$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${prefix}${suffix}` || '/';
}

/**
 * The clean URL a `build.format: 'file'` page's on-disk pathname corresponds to.
 *
 * Astro.url.pathname ends in .html (or /index.html for a directory's home page); the sitemap
 * lists the clean form instead, so the canonical link must match that, not the filename. Only
 * strip "index.html" when it is a whole path segment (`/x/index.html` -> `/x/`), so a page whose
 * name merely ends in "index" (`/blog/how-to-reindex.html`) keeps its full name.
 */
export function canonicalPath(pathname: string): string {
  return pathname.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '');
}
