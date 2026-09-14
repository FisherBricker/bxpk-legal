export const SITE = {
  name: 'bxpk',
  appName: 'Backpack Weight Tracker',
  description: 'Know what your pack weighs, every day of the trip.',
  /** The numeric App Store id, once the app is live. Null shows "Coming soon". */
  appStoreId: null as string | null,
};

export function appStoreUrl(id: string | null = SITE.appStoreId): string | null {
  return id ? `https://apps.apple.com/app/id${id}` : null;
}
