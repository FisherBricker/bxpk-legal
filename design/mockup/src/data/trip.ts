// The sample trip. Every number on the page comes from here, and they reconcile.

export const TRIP = {
  name: "Sample trip: North Lake to South Lake, 7 days, 61.4 mi",
  baseKg: 4.62,
  wornKg: 1.18,
  miles: 61.4,
};

import { terrainAt, terrainProfile } from "@/lib/topo/terrain";
import { PROFILE } from "./profile";

export { NAMED_POINTS, PROFILE } from "./profile";

export const TERRAIN_SEED = 61;

/** The drawn terrain: dense samples that pass through every surveyed point. Every elevation graphic uses this. */
export const TERRAIN = terrainProfile(PROFILE, 10, TERRAIN_SEED);

/** Elevation at a mile, read from the same terrain the profiles draw, so readouts match the line. */
export function elevationAt(mile: number): number {
  return terrainAt(PROFILE, mile, TERRAIN_SEED);
}

export interface Day {
  day: number;
  startMi: number;
  miles: number;
  gainFt: number;
  base: number;
  food: number;
  water: number;
  fuel: number;
  pack: number;
  skinOut: number;
}

export const DAYS: Day[] = [
  { day: 1, startMi: 0, miles: 7.8, gainFt: 2310, base: 4.62, food: 1.8, water: 2.5, fuel: 0.3, pack: 9.22, skinOut: 10.4 },
  { day: 2, startMi: 7.8, miles: 9.6, gainFt: 2940, base: 4.62, food: 0.9, water: 3.0, fuel: 0.24, pack: 8.76, skinOut: 9.94 },
  { day: 3, startMi: 17.4, miles: 8.9, gainFt: 1880, base: 4.62, food: 4.5, water: 2.5, fuel: 0.41, pack: 12.03, skinOut: 13.21 },
  { day: 4, startMi: 26.3, miles: 10.2, gainFt: 2450, base: 4.62, food: 3.6, water: 3.0, fuel: 0.35, pack: 11.57, skinOut: 12.75 },
  { day: 5, startMi: 36.5, miles: 8.1, gainFt: 1460, base: 4.62, food: 2.7, water: 2.0, fuel: 0.29, pack: 9.61, skinOut: 10.79 },
  { day: 6, startMi: 44.6, miles: 8.6, gainFt: 2700, base: 4.62, food: 1.8, water: 2.5, fuel: 0.23, pack: 9.15, skinOut: 10.33 },
  { day: 7, startMi: 53.2, miles: 8.2, gainFt: 1230, base: 4.62, food: 0.9, water: 2.0, fuel: 0.17, pack: 7.69, skinOut: 8.87 },
];

/** The day whose walk covers this mile. A camp at the end of a day belongs to that day. */
export function dayOnTrail(mile: number): Day {
  for (const d of DAYS) if (mile <= d.startMi + d.miles + 1e-6) return d;
  return DAYS[DAYS.length - 1];
}

/** The day the pinned resupply chart has walked to, from its scroll progress (0 to 1). */
export function walkDay(progress: number): number {
  return Math.min(7, Math.max(1, Math.ceil(progress * 7.4)));
}

export const RESUPPLY = { name: "Muir Trail Ranch", mile: 18.0, day: 3, pickupKg: 4.73, foodKg: 4.5, fuelG: 230 };

/** Days encoded as dates so bklit's time axis can carry them. Year 2001 reads as "Day N". */
export const dayDate = (n: number) => new Date(2001, 0, n);

export interface GearItem {
  name: string;
  g: number;
  role: "Packed" | "Worn";
}
export interface Category {
  id: string;
  label: string;
  color: string;
  items: GearItem[];
}

const packed = (name: string, g: number): GearItem => ({ name, g, role: "Packed" });

export const CATEGORIES: Category[] = [
  { id: "shelter", label: "Shelter", color: "var(--cat-shelter)", items: [packed("Two-person trekking pole tent", 862), packed("Polycryo footprint", 188), packed("8 titanium stakes", 96)] },
  { id: "sleep", label: "Sleep system", color: "var(--cat-sleep)", items: [packed("Quilt rated 20°F", 652), packed("Insulated air pad regular", 410), packed("Sleeping bag liner", 222)] },
  { id: "pack", label: "Pack", color: "var(--cat-pack)", items: [packed("55 L frameless pack", 820)] },
  { id: "clothing", label: "Clothing", color: "var(--cat-clothing)", items: [packed("Puffy jacket", 280), packed("Rain jacket", 196)] },
  { id: "cooking", label: "Cooking", color: "var(--cat-cooking)", items: [packed("Stove", 73), packed("750 mL titanium pot", 109), packed("Long spoon", 17), packed("Mini lighter", 12), packed("Bear canister lid kit", 171)] },
  { id: "water", label: "Water", color: "var(--cat-water)", items: [packed("Squeeze filter", 85), packed("Two 1 L bottles", 111)] },
  { id: "electronics", label: "Electronics", color: "var(--cat-electronics)", items: [packed("Headlamp", 54), packed("Power bank 10,000 mAh", 160)] },
  { id: "misc", label: "Misc", color: "var(--cat-misc)", items: [packed("First aid kit", 72), packed("Repair kit", 30)] },
];

export const WORN: GearItem[] = [
  { name: "Wind shirt", g: 58, role: "Worn" },
  { name: "Trail runners", g: 590, role: "Worn" },
  { name: "Trekking poles", g: 470, role: "Worn" },
  { name: "Sun hat", g: 62, role: "Worn" },
];

export const catTotal = (c: Category) => c.items.reduce((s, i) => s + i.g, 0);

export const MEALS = [
  { meal: "Breakfast", kcal: 720, food: "Granola with milk powder", g: 140 },
  { meal: "Lunch", kcal: 880, food: "Tortillas and peanut butter", g: 190 },
  { meal: "Dinner", kcal: 1050, food: "Freeze-dried chili", g: 230 },
  { meal: "Snacks", kcal: 600, food: "Trail mix and bars", g: 252 },
];
export const MEAL_DAY = { targetKcal: 3000, totalKcal: 3250, fatG: 118, carbsG: 402, proteinG: 131, foodG: 812, boilMl: 1450 };

export interface Pool {
  id: string;
  item: string;
  g: number;
  seats: number;
  /** Initials in claimed seats; "You" is always seat one. */
  claimed: string[];
}
export const POOLS: Pool[] = [
  { id: "tent", item: "Two-person trekking pole tent", g: 1146, seats: 2, claimed: ["You", "JW"] },
  { id: "stove", item: "Stove, pot and 230 g fuel canister", g: 612, seats: 3, claimed: ["You", "JW", "RF"] },
  { id: "filter", item: "Squeeze water filter", g: 85, seats: 3, claimed: ["You", "RF"] },
];

export const SEASONS = [
  { label: "Spring 2025", date: new Date(2025, 3, 15), kg: 5.88 },
  { label: "Summer 2025", date: new Date(2025, 6, 15), kg: 5.41 },
  { label: "Fall 2025", date: new Date(2025, 9, 15), kg: 5.1 },
  { label: "Spring 2026", date: new Date(2026, 3, 15), kg: 4.87 },
  { label: "Summer 2026", date: new Date(2026, 6, 15), kg: 4.62 },
];
export const GOAL_KG = 4.0;

export const fmtKg = (kg: number) => `${kg.toFixed(2)} kg`;
export const fmtInt = (n: number) => Math.round(n).toLocaleString("en-US");
export const fmtMi = (mi: number) => `${mi.toFixed(1)} mi`;
export const fmtFt = (ft: number) => `${fmtInt(ft)} ft`;
