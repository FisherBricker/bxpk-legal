/**
 * The app's imperial display rules, mirrored from UnitConversion.swift
 * (BackpackWeightTracker/Sources/Support/UnitConversion.swift). Every weight on the
 * page is stored in grams and formatted here, so the page reads exactly as the app does.
 * No imports, so node scripts can load it directly.
 */

export const GRAMS_PER_OUNCE = 28.349523125;
export const GRAMS_PER_POUND = GRAMS_PER_OUNCE * 16;

/** displayString(grams:unit: .imperial): "%.2f lb" from 1 lb up, "%.1f oz" below. */
export function formatWeight(grams: number): string {
  if (grams >= GRAMS_PER_POUND) return `${(grams / GRAMS_PER_POUND).toFixed(2)} lb`;
  return `${(grams / GRAMS_PER_OUNCE).toFixed(1)} oz`;
}

export const toPounds = (grams: number) => grams / GRAMS_PER_POUND;
