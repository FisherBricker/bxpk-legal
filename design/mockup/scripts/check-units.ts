// Checks formatWeight against the app's UnitConversion.displayString (imperial). Run: node scripts/check-units.ts
import { formatWeight } from "../src/lib/units.ts";

const cases: Array<[number, string]> = [
  [4620, "10.19 lb"],
  [862, "1.90 lb"],
  [96, "3.4 oz"],
  [58, "2.0 oz"],
  [12030, "26.52 lb"],
  [820, "1.81 lb"],
  [85, "3.0 oz"],
  [453.59237, "1.00 lb"],
  [453.5, "16.0 oz"],
];
let failed = 0;
for (const [grams, expected] of cases) {
  const got = formatWeight(grams);
  if (got !== expected) {
    failed++;
    console.log(`FAIL ${grams} g: expected "${expected}", got "${got}"`);
  }
}
console.log(failed ? `${failed} of ${cases.length} failed` : `formatWeight matches the app on all ${cases.length} cases`);
if (failed) process.exitCode = 1;
