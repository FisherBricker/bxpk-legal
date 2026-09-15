// The sample trip. Every number on the page comes from here, and they reconcile with the app's
// seeded showcase account (Rowan Ashford). Weights are stored in grams and shown through
// formatWeight, which mirrors the app's imperial display rules.

export { formatWeight } from "@/lib/units";

export const TRIP = {
  name: "Sample trip: North Lake to South Lake, 7 days, 61.4 mi",
  baseG: 4620,
  wornG: 1180,
  miles: 61.4,
};

export const PEOPLE = {
  me: { name: "Rowan Ashford", handle: "@rowanashford", initials: "RA" },
  petra: { name: "Petra Lindqvist", handle: "@petralindqvist", initials: "PL" },
  cedar: { name: "Cedar Finch", handle: "@cedarfinch", initials: "CF" },
} as const;

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
  /** Litres of water, as the app's itinerary shows it (%.1f L). */
  waterL: number;
  baseG: number;
  foodG: number;
  waterG: number;
  fuelG: number;
  packG: number;
  skinOutG: number;
}

const day = (d: number, startMi: number, miles: number, gainFt: number, waterL: number, foodG: number, fuelG: number, packG: number, skinOutG: number): Day => ({
  day: d, startMi, miles, gainFt, waterL, baseG: 4620, foodG, waterG: waterL * 1000, fuelG, packG, skinOutG,
});

export const DAYS: Day[] = [
  day(1, 0, 7.8, 2310, 2.5, 1800, 300, 9220, 10400),
  day(2, 7.8, 9.6, 2940, 3.0, 900, 240, 8760, 9940),
  day(3, 17.4, 8.9, 1880, 2.5, 4500, 410, 12030, 13210),
  day(4, 26.3, 10.2, 2450, 3.0, 3600, 350, 11570, 12750),
  day(5, 36.5, 8.1, 1460, 2.0, 2700, 290, 9610, 10790),
  day(6, 44.6, 8.6, 2700, 2.5, 1800, 230, 9150, 10330),
  day(7, 53.2, 8.2, 1230, 2.0, 900, 170, 7690, 8870),
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

/** Muir Trail Ranch, day 3: food for days 3 to 7 and one 230 g canister. */
export const RESUPPLY = {
  name: "Muir Trail Ranch",
  mile: 18.0,
  day: 3,
  pickupG: 4730,
  foodG: 4500,
  fuelG: 230,
  /** Bucket contents by meal slot, days 3 to 7, from the seeded meal plan. */
  bucket: [
    { label: "Breakfasts", g: 775 },
    { label: "Lunches", g: 1111 },
    { label: "Dinners", g: 1235 },
    { label: "Snacks", g: 1379 },
  ],
};

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
const worn = (name: string, g: number): GearItem => ({ name, g, role: "Worn" });

/** The seeded gear list. Worn items sit in Clothing, the only category the app lets be worn. */
export const CATEGORIES: Category[] = [
  { id: "shelter", label: "Shelter", color: "var(--cat-shelter)", items: [packed("Two-person trekking pole tent", 862), packed("Polycryo footprint", 188), packed("8 titanium stakes", 96)] },
  { id: "sleep", label: "Sleep system", color: "var(--cat-sleep)", items: [packed("Quilt rated 20°F", 652), packed("Insulated air pad, regular", 410), packed("Sleeping bag liner", 222)] },
  { id: "pack", label: "Pack", color: "var(--cat-pack)", items: [packed("55 L frameless pack", 820)] },
  {
    id: "clothing",
    label: "Clothing",
    color: "var(--cat-clothing)",
    items: [packed("Puffy jacket", 280), packed("Rain jacket", 196), worn("Wind shirt", 58), worn("Trail runners", 590), worn("Trekking poles", 470), worn("Sun hat", 62)],
  },
  { id: "cooking", label: "Cooking", color: "var(--cat-cooking)", items: [packed("Stove", 73), packed("750 mL titanium pot", 109), packed("Long spoon", 17), packed("Mini lighter", 12), packed("Bear canister lid kit", 171)] },
  { id: "water", label: "Water", color: "var(--cat-water)", items: [packed("Squeeze filter", 85), packed("Two 1 L bottles", 111)] },
  { id: "electronics", label: "Electronics", color: "var(--cat-electronics)", items: [packed("Headlamp", 54), packed("Power bank, 10,000 mAh", 160)] },
  { id: "misc", label: "Misc", color: "var(--cat-misc)", items: [packed("First aid kit", 72), packed("Repair kit", 30)] },
];

/** Packed grams in a category: its share of base weight. Worn items stay out of base weight. */
export const catTotal = (c: Category) => c.items.reduce((s, i) => s + (i.role === "Packed" ? i.g : 0), 0);

/** Day 2 of the seeded meal plan (900 g of food). */
export const MEALS = [
  { meal: "Breakfast", kcal: 720, food: "Granola with milk powder", g: 155 },
  { meal: "Lunch", kcal: 880, food: "Tortillas and peanut butter", g: 211 },
  { meal: "Dinner", kcal: 1050, food: "Freeze-dried chili", g: 255 },
  { meal: "Snacks", kcal: 600, food: "Trail mix and bars", g: 279 },
];
export const MEAL_DAY = { targetKcal: 3000, totalKcal: 3250, fatG: 118, carbsG: 402, proteinG: 131, foodG: 900, boilMl: 1450 };

export interface Pool {
  id: string;
  item: string;
  g: number;
  seats: number;
  /** Who holds each seat, as the Rae Lakes Loop shared gear is seeded. Every seat is taken. */
  claimed: Array<keyof typeof PEOPLE>;
}
export const POOLS: Pool[] = [
  { id: "tent", item: "Two-person trekking pole tent", g: 1146, seats: 2, claimed: ["petra", "me"] },
  { id: "stove", item: "Stove, pot and 230 g fuel canister", g: 612, seats: 3, claimed: ["cedar", "me", "petra"] },
  { id: "filter", item: "Squeeze water filter", g: 85, seats: 2, claimed: ["petra", "me"] },
];

export const SEASONS = [
  { label: "Spring 2025", date: new Date(2025, 3, 15), g: 5880 },
  { label: "Summer 2025", date: new Date(2025, 6, 15), g: 5410 },
  { label: "Fall 2025", date: new Date(2025, 9, 15), g: 5100 },
  { label: "Spring 2026", date: new Date(2026, 3, 15), g: 4870 },
  { label: "Summer 2026", date: new Date(2026, 6, 15), g: 4620 },
];
export const GOAL_G = 4000;

export const fmtInt = (n: number) => Math.round(n).toLocaleString("en-US");
export const fmtMi = (mi: number) => `${mi.toFixed(1)} mi`;
export const fmtFt = (ft: number) => `${fmtInt(ft)} ft`;
