import { describe, expect, it } from 'vitest';
import { withBase } from './paths';
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

describe('appStoreUrl', () => {
  it('is null until the app has an App Store id', () => {
    expect(appStoreUrl(null)).toBeNull();
  });
  it('links the numeric id', () => {
    expect(appStoreUrl('1234567890')).toBe('https://apps.apple.com/app/id1234567890');
  });
});
