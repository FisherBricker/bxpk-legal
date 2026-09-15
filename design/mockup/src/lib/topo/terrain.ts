/**
 * Terrain between surveyed points. A trail does not climb in a straight line: it
 * rises, dips over false summits and drops into saddles on the way to a pass.
 *
 * terrainProfile passes exactly through every input point. Between two points it
 * lays a monotone cubic (no overshoot) and adds seeded multi-octave value noise,
 * scaled by the segment's length and elevation change and shaped by a sin²
 * window, so the variation is zero, with zero slope, at both ends. A smooth
 * minimum keeps each segment at or below its higher end (so a pass is the top
 * of its approaches) and a smooth maximum keeps everything at or above the
 * lowest surveyed point. Output is deterministic for a given seed.
 */

export type ProfilePoint = [mile: number, ft: number];

function hash(n: number, seed: number): number {
  let h = Math.imul(n ^ Math.imul(seed, 0x27d4eb2d), 0x9e3779b1);
  h ^= h >>> 15;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  return ((h >>> 0) / 4294967295) * 2 - 1;
}

/** 1D value noise with a quintic fade, range about -1..1. */
function valueNoise(x: number, seed: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * f * (f * (f * 6 - 15) + 10);
  return hash(i, seed) * (1 - u) + hash(i + 1, seed) * u;
}

// Frequencies are in undulations per segment, so short climbs still rise and dip.
const OCTAVES = [
  { freq: 1, weight: 1 },
  { freq: 2.2, weight: 0.5 },
  { freq: 4.6, weight: 0.24 },
];
const WEIGHT_SUM = OCTAVES.reduce((s, o) => s + o.weight, 0);

function smin(a: number, b: number, k: number): number {
  if (k <= 0) return Math.min(a, b);
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - (h * h * k) / 4;
}
const smax = (a: number, b: number, k: number) => -smin(-a, -b, k);

/** Fritsch-Carlson tangents: the cubic never overshoots its surveyed points. */
function tangents(points: ProfilePoint[]): number[] {
  const n = points.length;
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((points[i + 1][1] - points[i][1]) / (points[i + 1][0] - points[i][0]));
  const m: number[] = new Array(n).fill(0);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      m[i] = t * a * d[i];
      m[i + 1] = t * b * d[i];
    }
  }
  return m;
}

/** Elevation at a mile on the generated terrain. */
export function terrainAt(points: ProfilePoint[], mile: number, seed: number, cache?: number[]): number {
  const n = points.length;
  if (mile <= points[0][0]) return points[0][1];
  if (mile >= points[n - 1][0]) return points[n - 1][1];
  const m = cache ?? tangents(points);
  let i = 0;
  while (i < n - 2 && mile > points[i + 1][0]) i++;
  const [m0, e0] = points[i];
  const [m1, e1] = points[i + 1];
  const len = m1 - m0;
  const t = (mile - m0) / len;
  const t2 = t * t;
  const t3 = t2 * t;
  const base = (2 * t3 - 3 * t2 + 1) * e0 + (t3 - 2 * t2 + t) * len * m[i] + (-2 * t3 + 3 * t2) * e1 + (t3 - t2) * len * m[i + 1];

  const amplitude = Math.min(420, Math.max(120, 0.3 * Math.abs(e1 - e0) + 80 * len));
  const cycles = Math.max(2.2, len * 0.75);
  let noise = 0;
  for (let o = 0; o < OCTAVES.length; o++) {
    noise += OCTAVES[o].weight * valueNoise(t * cycles * OCTAVES[o].freq + i * 13.7, seed + o * 7919 + i * 104729);
  }
  const window = Math.sin(Math.PI * t) ** 2;
  let ft = base + (noise / WEIGHT_SUM) * amplitude * window;

  // A segment never rises above its higher end, and nothing drops below the lowest surveyed point.
  const floor = points.reduce((low, p) => Math.min(low, p[1]), Number.POSITIVE_INFINITY);
  const k = 60 * window;
  ft = smin(ft, Math.max(e0, e1), k);
  ft = smax(ft, floor, k);
  return ft;
}

/** Dense [mile, ft] samples of the terrain, including every input point exactly. */
export function terrainProfile(points: ProfilePoint[], samplesPerMile = 8, seed = 61): ProfilePoint[] {
  const m = tangents(points);
  const out: ProfilePoint[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [m0] = points[i];
    const [m1] = points[i + 1];
    const steps = Math.max(4, Math.ceil((m1 - m0) * samplesPerMile));
    for (let s = 0; s < steps; s++) {
      const mile = m0 + ((m1 - m0) * s) / steps;
      out.push([mile, s === 0 ? points[i][1] : terrainAt(points, mile, seed, m)]);
    }
  }
  out.push([...points[points.length - 1]]);
  return out;
}
