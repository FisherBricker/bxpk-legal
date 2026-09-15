// Self-check for the elevation terrain. Run: node scripts/check-terrain.ts
import { NAMED_POINTS, PASSES, PROFILE } from "../src/data/profile.ts";
import { terrainAt, terrainProfile } from "../src/lib/topo/terrain.ts";

const SEED = 61;
const failures: string[] = [];
const check = (ok: boolean, message: string) => {
  if (!ok) failures.push(message);
};

// 1. Passes through every surveyed and named point within 1 ft.
for (const [mile, ft] of PROFILE) {
  const got = terrainAt(PROFILE, mile, SEED);
  check(Math.abs(got - ft) <= 1, `mile ${mile}: expected ${ft} ft, got ${got.toFixed(1)} ft`);
}
for (const p of NAMED_POINTS) check(Math.abs(terrainAt(PROFILE, p.mile, SEED) - p.ft) <= 1, `${p.name} is off its point`);

// 2. No segment between points is a straight or monotonic run: at least one local reversal.
const floor = Math.min(...PROFILE.map((p) => p[1]));
for (let i = 0; i < PROFILE.length - 1; i++) {
  const [m0, e0] = PROFILE[i];
  const [m1, e1] = PROFILE[i + 1];
  const samples: number[] = [];
  for (let s = 0; s <= 400; s++) samples.push(terrainAt(PROFILE, m0 + ((m1 - m0) * s) / 400, SEED));
  let reversals = 0;
  let dir = 0;
  for (let s = 1; s < samples.length; s++) {
    const step = samples[s] - samples[s - 1];
    if (Math.abs(step) < 0.05) continue;
    const next = Math.sign(step);
    if (dir !== 0 && next !== dir) reversals++;
    dir = next;
  }
  const chord = (s: number) => e0 + ((e1 - e0) * s) / 400;
  const deviation = Math.max(...samples.map((v, s) => Math.abs(v - chord(s))));
  check(reversals >= 1 || deviation >= 80, `segment ${m0} to ${m1} mi is monotonic (deviation ${deviation.toFixed(0)} ft)`);

  // 3. Ceiling: never above the segment's higher end (so a pass tops its approaches). Floor: never below the lowest point.
  const ceiling = Math.max(e0, e1);
  check(Math.max(...samples) <= ceiling + 0.5, `segment ${m0} to ${m1} mi rises above ${ceiling} ft`);
  check(Math.min(...samples) >= floor - 0.5, `segment ${m0} to ${m1} mi drops below ${floor} ft`);
}
for (const pass of PASSES) {
  const ft = PROFILE.find((p) => p[0] === pass)![1];
  const i = PROFILE.findIndex((p) => p[0] === pass);
  for (let mile = PROFILE[i - 1][0]; mile <= PROFILE[i + 1][0]; mile += 0.01) {
    check(terrainAt(PROFILE, mile, SEED) <= ft + 0.5, `approach to the pass at mile ${pass} exceeds it at mile ${mile.toFixed(2)}`);
  }
}

// 4. Smooth: no spikes. The slope may not jump between neighbouring samples at 8 samples per mile.
const dense = terrainProfile(PROFILE, 8, SEED);
let worstBend = 0;
for (let s = 2; s < dense.length; s++) {
  const a = (dense[s - 1][1] - dense[s - 2][1]) / (dense[s - 1][0] - dense[s - 2][0]);
  const b = (dense[s][1] - dense[s - 1][1]) / (dense[s][0] - dense[s - 1][0]);
  worstBend = Math.max(worstBend, Math.abs(b - a));
}
check(worstBend < 1200, `slope jumps by ${worstBend.toFixed(0)} ft/mi between samples`);

// 5. Deterministic.
check(JSON.stringify(terrainProfile(PROFILE, 8, SEED)) === JSON.stringify(dense), "terrain is not deterministic");

console.log(`${dense.length} samples, worst slope change ${worstBend.toFixed(0)} ft/mi between samples`);
if (failures.length) {
  console.log(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Terrain passes every point, varies on every segment, keeps the pass ceilings and the floor, and is deterministic.");
}
