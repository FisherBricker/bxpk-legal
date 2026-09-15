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
