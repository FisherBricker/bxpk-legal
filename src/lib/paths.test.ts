import { describe, expect, it } from 'vitest';
import { canonicalPath, withBase } from './paths';
import { appStoreUrl } from '../site.config';

describe('withBase', () => {
  it('prefixes the project base the site is served under', () => {
    expect(withBase('/privacy', '/bxpk-legal')).toBe('/bxpk-legal/privacy');
    expect(withBase('/privacy', '/bxpk-legal/')).toBe('/bxpk-legal/privacy');
  });

  it('leaves a root base alone, for after the custom domain', () => {
    expect(withBase('/privacy', '/')).toBe('/privacy');
    expect(withBase('/', '/')).toBe('/');
  });

  it('maps the home page to the base itself', () => {
    expect(withBase('/', '/bxpk-legal')).toBe('/bxpk-legal/');
  });

  it('accepts a path without a leading slash', () => {
    expect(withBase('news', '/bxpk-legal')).toBe('/bxpk-legal/news');
  });

  it('never touches absolute URLs, mail links or fragments', () => {
    expect(withBase('https://apps.apple.com/app/id1', '/bxpk-legal')).toBe('https://apps.apple.com/app/id1');
    expect(withBase('mailto:hi@example.com', '/bxpk-legal')).toBe('mailto:hi@example.com');
    expect(withBase('#features', '/bxpk-legal')).toBe('#features');
  });
});

describe('canonicalPath', () => {
  it('turns index.html into a trailing slash, only as a whole path segment', () => {
    expect(canonicalPath('/bxpk-legal/index.html')).toBe('/bxpk-legal/');
    expect(canonicalPath('/index.html')).toBe('/');
    expect(canonicalPath('/news/index.html')).toBe('/news/');
  });

  it('strips a trailing .html from any other page', () => {
    expect(canonicalPath('/bxpk-legal/privacy.html')).toBe('/bxpk-legal/privacy');
    expect(canonicalPath('/news/html-tips.html')).toBe('/news/html-tips');
    expect(canonicalPath('/news/indexing-your-gear.html')).toBe('/news/indexing-your-gear');
  });

  it('does not shorten a page name that merely ends in "index"', () => {
    expect(canonicalPath('/blog/how-to-reindex.html')).toBe('/blog/how-to-reindex');
  });

  it('leaves a path without .html unchanged', () => {
    expect(canonicalPath('/bxpk-legal/privacy')).toBe('/bxpk-legal/privacy');
    expect(canonicalPath('/')).toBe('/');
  });
});

describe('appStoreUrl', () => {
  it('is null until the app has an App Store id', () => {
    expect(appStoreUrl(null)).toBeNull();
  });
  it('links the numeric id', () => {
    expect(appStoreUrl('1234567890')).toBe('https://apps.apple.com/app/id1234567890');
  });
});
