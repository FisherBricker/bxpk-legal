// Self-check and golden vectors for the terrain isolines. Run: node scripts/check-isolines.ts
// 1. No two contour lines cross (chords of the smoothed polylines and of the particle layout).
// 2. Prints the golden vectors TERRAIN-SPEC.md records, so a port can assert the same numbers.
import { buildIsolineLayout, heightField, isolines, polylineLength } from "../src/lib/topo/isolines.ts";

type Seg = { line: number; s: [number, number, number, number] };

function cross(a: Seg["s"], b: Seg["s"]): boolean {
  const [x1, y1, x2, y2] = a;
  const [x3, y3, x4, y4] = b;
  const d = (x2 - x1) * (y4 - y3) - (y2 - y1) * (x4 - x3);
  if (Math.abs(d) < 1e-12) return false;
  const t = ((x3 - x1) * (y4 - y3) - (y3 - y1) * (x4 - x3)) / d;
  const u = ((x3 - x1) * (y2 - y1) - (y3 - y1) * (x2 - x1)) / d;
  return t > 1e-9 && t < 1 - 1e-9 && u > 1e-9 && u < 1 - 1e-9;
}

function countCrossings(segs: Seg[]): number {
  const bucket = new Map<string, number[]>();
  const size = 16;
  segs.forEach((seg, idx) => {
    const [ax, ay, bx, by] = seg.s;
    for (let gx = Math.floor(Math.min(ax, bx) / size); gx <= Math.floor(Math.max(ax, bx) / size); gx++) {
      for (let gy = Math.floor(Math.min(ay, by) / size); gy <= Math.floor(Math.max(ay, by) / size); gy++) {
        const key = `${gx},${gy}`;
        (bucket.get(key) ?? bucket.set(key, []).get(key)!).push(idx);
      }
    }
  });
  const seen = new Set<string>();
  let crossings = 0;
  for (const ids of bucket.values()) {
    for (let a = 0; a < ids.length; a++) {
      for (let b = a + 1; b < ids.length; b++) {
        const A = segs[ids[a]];
        const B = segs[ids[b]];
        if (A.line === B.line) continue;
        const key = ids[a] < ids[b] ? `${ids[a]}:${ids[b]}` : `${ids[b]}:${ids[a]}`;
        if (seen.has(key)) continue;
        seen.add(key);
        if (cross(A.s, B.s)) crossings++;
      }
    }
  }
  return crossings;
}

const SEED = 20260915;
let failed = false;

for (const [w, h] of [
  [1440, 900],
  [390, 844],
  [1440, 1100],
]) {
  // ringStep 15 is what the hero field uses (the densest setting on the page).
  const lines = isolines({ width: w, height: h, seed: SEED, ringStep: 15, cell: 6 });
  const lineSegs: Seg[] = [];
  lines.forEach((line, li) => {
    for (let p = 1; p < line.length; p++) lineSegs.push({ line: li, s: [line[p - 1][0], line[p - 1][1], line[p][0], line[p][1]] });
  });
  const layout = buildIsolineLayout({ width: w, height: h, seed: SEED, spacing: w < 600 ? 6.5 : 7.5, ringStep: 15, cell: 6, maxParticles: 9000 });
  const particleSegs: Seg[] = [];
  let li = -1;
  for (let i = 0; i < layout.count; i++) {
    if (!layout.linked[i]) {
      li++;
      continue;
    }
    particleSegs.push({ line: li, s: [layout.homeX[i - 1], layout.homeY[i - 1], layout.homeX[i], layout.homeY[i]] });
  }
  const c1 = countCrossings(lineSegs);
  const c2 = countCrossings(particleSegs);
  console.log(`${w}x${h}: ${lines.length} lines, ${c1} crossings; particle layout ${layout.count} particles, ${c2} crossings`);
  if (c1 || c2) failed = true;
}

// Golden vectors for the port (see TERRAIN-SPEC.md).
const fmt = (v: number) => Number(v.toPrecision(9)).toString();
for (const [w, h] of [
  [390, 240],
  [1440, 900],
]) {
  const field = heightField(w, h, SEED);
  console.log(`\nGolden heights, ${w} x ${h}, seed ${SEED}:`);
  for (let k = 0; k < 12; k++) {
    const x = Math.round(((k * 37 + 11) % 97) / 96 * w * 100) / 100;
    const y = Math.round(((k * 53 + 29) % 89) / 88 * h * 100) / 100;
    console.log(`  h(${x}, ${y}) = ${fmt(field(x, y))}`);
  }
  const lines = isolines({ width: w, height: h, seed: SEED, ringStep: 18, cell: 6 });
  const total = lines.reduce((sum, line) => sum + polylineLength(line), 0);
  console.log(`  isolines (ringStep 18, cell 6, margin 24): ${lines.length} lines, total length ${fmt(total)} px`);
}

if (failed) process.exitCode = 1;
