import type { ContourLayout } from "./contours";

/**
 * Alpine terrain as isolines of ONE continuous height field, so contour lines
 * nest and never cross. The field is written to be ported line for line: all
 * hashing is 32-bit unsigned integer math with explicit wrapping, and everything
 * else is plain IEEE double arithmetic plus floor, abs, sqrt and exp.
 * TERRAIN-SPEC.md is the portable description; the constants below are the spec.
 */

export type Polyline = Array<[number, number]>;

/* ------------------------------------------------------------------ */
/* Constants (see TERRAIN-SPEC.md)                                      */
/* ------------------------------------------------------------------ */

export const TERRAIN = {
  /** Pixels (points) per unit of noise space: terrain feature size is absolute, not relative to the panel. */
  featurePx: 560,
  /** Domain warp strength, in noise units. */
  warp: 0.45,
  warpOctaves: 3,
  /** Ridged multifractal. */
  ridgeOctaves: 4,
  ridgeOffset: 1.0,
  ridgeScale: 1.0,
  ridgeGain: 1.6,
  ridgeLacunarity: 2.0,
  ridgePersistence: 0.5,
  /** Broad elevation (valleys and benches). */
  baseOctaves: 3,
  baseFrequency: 0.35,
  /** Ruggedness rises with broad elevation: ridge weight goes from ruggedLow to 1 across the base range. */
  ruggedLow: 0.35,
  /** Weights of the three terms. */
  ridgeWeight: 1.0,
  baseWeight: 0.9,
  summitWeight: 0.9,
  /** Drainage network: subtracted ridged term at this frequency and weight. */
  valleyFrequency: 1.7,
  valleyWeight: 0.35,
  /** The two anchor summits (the app ContourPanel's centres), as fractions of the panel. */
  summits: [
    { fx: 0.22, fy: 1.45, sigmaDiag: 0.62, amp: 1.0 },
    { fx: 0.95, fy: -0.55, sigmaDiag: 0.5, amp: 0.9 },
  ],
  summitAspect: 1.9,
  /** fBm */
  fbmLacunarity: 2.03,
  fbmPersistence: 0.5,
  /** Polyline pruning, in px. */
  minLoopPx: 70,
  minOpenPx: 24,
} as const;

const SQRT_HALF = 0.7071067811865476;
const GRADIENTS: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [SQRT_HALF, SQRT_HALF],
  [-SQRT_HALF, SQRT_HALF],
  [SQRT_HALF, -SQRT_HALF],
  [-SQRT_HALF, -SQRT_HALF],
];

/* ------------------------------------------------------------------ */
/* Portable noise                                                       */
/* ------------------------------------------------------------------ */

/** 32-bit integer hash of a lattice point. Inputs are int32; output is uint32. */
export function hash2(ix: number, iy: number, seed: number): number {
  let h = (seed ^ Math.imul(ix, 0x27d4eb2d)) >>> 0;
  h = (h ^ Math.imul(iy, 0x165667b1)) >>> 0;
  h = (h ^ (h >>> 15)) >>> 0;
  h = Math.imul(h, 0x2c1b3c6d) >>> 0;
  h = (h ^ (h >>> 12)) >>> 0;
  h = Math.imul(h, 0x297a2d39) >>> 0;
  h = (h ^ (h >>> 15)) >>> 0;
  return h;
}

/** 2D gradient noise, range about -0.71 to 0.71. */
export function gradientNoise(x: number, y: number, seed: number): number {
  const fx0 = Math.floor(x);
  const fy0 = Math.floor(y);
  const ix = fx0 | 0;
  const iy = fy0 | 0;
  const tx = x - fx0;
  const ty = y - fy0;
  const dot = (gx: number, gy: number, dx: number, dy: number) => {
    const g = GRADIENTS[hash2(gx, gy, seed) & 7];
    return g[0] * dx + g[1] * dy;
  };
  const n00 = dot(ix, iy, tx, ty);
  const n10 = dot((ix + 1) | 0, iy, tx - 1, ty);
  const n01 = dot(ix, (iy + 1) | 0, tx, ty - 1);
  const n11 = dot((ix + 1) | 0, (iy + 1) | 0, tx - 1, ty - 1);
  const u = tx * tx * tx * (tx * (tx * 6 - 15) + 10);
  const v = ty * ty * ty * (ty * (ty * 6 - 15) + 10);
  const a = n00 + (n10 - n00) * u;
  const b = n01 + (n11 - n01) * u;
  return a + (b - a) * v;
}

/** Seed for octave o of a stream: explicit uint32 wrap. */
export const octaveSeed = (seed: number, stream: number, octave: number) =>
  (seed + Math.imul(stream, 0x9e3779b1) + Math.imul(octave, 0x85ebca6b)) >>> 0;

export function fbm(x: number, y: number, octaves: number, seed: number, stream: number): number {
  let sum = 0;
  let norm = 0;
  let amp = 1;
  let freq = 1;
  for (let o = 0; o < octaves; o++) {
    sum += amp * gradientNoise(x * freq, y * freq, octaveSeed(seed, stream, o));
    norm += amp;
    amp *= TERRAIN.fbmPersistence;
    freq *= TERRAIN.fbmLacunarity;
  }
  return sum / norm;
}

/** Ridged multifractal: sharp crests where the noise crosses zero, with weight feedback so crests stay coherent. */
export function ridged(x: number, y: number, seed: number, stream: number): number {
  let sum = 0;
  let norm = 0;
  let amp = 1;
  let freq = 1;
  let weight = 1;
  for (let o = 0; o < TERRAIN.ridgeOctaves; o++) {
    const n = gradientNoise(x * freq, y * freq, octaveSeed(seed, stream, o));
    let signal = TERRAIN.ridgeOffset - Math.abs(n) * TERRAIN.ridgeScale;
    if (signal < 0) signal = 0;
    signal *= signal;
    signal *= weight;
    weight = signal * TERRAIN.ridgeGain;
    if (weight > 1) weight = 1;
    if (weight < 0) weight = 0;
    sum += signal * amp;
    norm += amp;
    amp *= TERRAIN.ridgePersistence;
    freq *= TERRAIN.ridgeLacunarity;
  }
  return sum / norm;
}

/** Height at pixel (x, y) of a width x height panel. */
export function heightField(width: number, height: number, seed: number): (x: number, y: number) => number {
  const diag = Math.sqrt(width * width + height * height);
  const summits = TERRAIN.summits.map((s) => ({
    cx: width * s.fx,
    cy: height * s.fy,
    inv2s2: 1 / (2 * (diag * s.sigmaDiag) * (diag * s.sigmaDiag)),
    amp: s.amp,
  }));
  return (x, y) => {
    const px = x / TERRAIN.featurePx;
    const py = y / TERRAIN.featurePx;
    const wx = fbm(px + 5.2, py + 1.3, TERRAIN.warpOctaves, seed, 1);
    const wy = fbm(px - 3.7, py + 8.1, TERRAIN.warpOctaves, seed, 2);
    const qx = px + TERRAIN.warp * wx;
    const qy = py + TERRAIN.warp * wy;
    const r = ridged(qx, qy, seed, 3);
    // Drainages: a second ridged network, subtracted, carves V creases that point upslope.
    const valley = ridged(qx * TERRAIN.valleyFrequency + 17.3, qy * TERRAIN.valleyFrequency - 9.1, seed, 5);
    const base = fbm(qx * TERRAIN.baseFrequency, qy * TERRAIN.baseFrequency, TERRAIN.baseOctaves, seed, 4);
    let summit = 0;
    for (const s of summits) {
      const dx = (x - s.cx) / TERRAIN.summitAspect;
      const dy = y - s.cy;
      summit += s.amp * Math.exp(-(dx * dx + dy * dy) * s.inv2s2);
    }
    let rugged = (base + 0.3) / 0.6;
    if (rugged < 0) rugged = 0;
    if (rugged > 1) rugged = 1;
    rugged = TERRAIN.ruggedLow + (1 - TERRAIN.ruggedLow) * rugged;
    return (
      TERRAIN.ridgeWeight * r * rugged -
      TERRAIN.valleyWeight * valley * rugged +
      TERRAIN.baseWeight * base +
      TERRAIN.summitWeight * summit
    );
  };
}

/* ------------------------------------------------------------------ */
/* Isolines                                                             */
/* ------------------------------------------------------------------ */

export interface FieldGrid {
  x0: number;
  y0: number;
  cell: number;
  nx: number;
  ny: number;
  values: Float64Array;
  min: number;
  max: number;
  /** Mean gradient magnitude in height per px. */
  meanSlope: number;
}

export function sampleField(width: number, height: number, seed: number, cell: number, margin: number): FieldGrid {
  const field = heightField(width, height, seed);
  const x0 = -margin;
  const y0 = -margin;
  const nx = Math.ceil((width + margin * 2) / cell);
  const ny = Math.ceil((height + margin * 2) / cell);
  const cols = nx + 1;
  const values = new Float64Array(cols * (ny + 1));
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (let j = 0; j <= ny; j++) {
    for (let i = 0; i <= nx; i++) {
      const v = field(x0 + i * cell, y0 + j * cell);
      values[j * cols + i] = v;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  let slope = 0;
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const gx = (values[j * cols + i + 1] - values[j * cols + i]) / cell;
      const gy = (values[(j + 1) * cols + i] - values[j * cols + i]) / cell;
      slope += Math.sqrt(gx * gx + gy * gy);
    }
  }
  return { x0, y0, cell, nx, ny, values, min, max, meanSlope: slope / (nx * ny) };
}

export const polylineLength = (line: Polyline) => {
  let length = 0;
  for (let p = 1; p < line.length; p++) {
    const dx = line[p][0] - line[p - 1][0];
    const dy = line[p][1] - line[p - 1][1];
    length += Math.sqrt(dx * dx + dy * dy);
  }
  return length;
};

/**
 * One Chaikin corner-cutting pass: each segment AB becomes the points at 1/4 and 3/4.
 * Closed loops wrap; open lines keep their two end points.
 */
export function chaikin(line: Polyline, closed: boolean): Polyline {
  const pts = closed ? line.slice(0, -1) : line;
  const n = pts.length;
  const out: Polyline = [];
  if (!closed) out.push(pts[0]);
  const segments = closed ? n : n - 1;
  for (let i = 0; i < segments; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    out.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]]);
    out.push([0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]);
  }
  if (closed) out.push(out[0]);
  else out.push(pts[n - 1]);
  return out;
}

/** Marching squares at a fixed interval chosen so neighbouring lines sit about `spacing` px apart on average. */
export function extractIsolines(grid: FieldGrid, spacing: number): Polyline[] {
  const { x0, y0, cell, nx, ny, values, min, max } = grid;
  const cols = nx + 1;
  const interval = grid.meanSlope * spacing;
  if (!(interval > 0)) return [];
  const count = Math.floor((max - min) / interval);
  const H = cols * (ny + 1);
  const lines: Polyline[] = [];

  for (let k = 0; k < count; k++) {
    const level = min + interval * (k + 0.5);
    const points = new Map<number, [number, number]>();
    const segA: number[] = [];
    const segB: number[] = [];
    const adj = new Map<number, number[]>();
    const edgePoint = (key: number, ax: number, ay: number, av: number, bx: number, by: number, bv: number) => {
      if (!points.has(key)) {
        const t = (level - av) / (bv - av);
        points.set(key, [ax + (bx - ax) * t, ay + (by - ay) * t]);
      }
      return key;
    };
    const link = (a: number, b: number) => {
      const id = segA.length;
      segA.push(a);
      segB.push(b);
      (adj.get(a) ?? adj.set(a, []).get(a)!).push(id);
      (adj.get(b) ?? adj.set(b, []).get(b)!).push(id);
    };

    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const tl = values[j * cols + i];
        const tr = values[j * cols + i + 1];
        const br = values[(j + 1) * cols + i + 1];
        const bl = values[(j + 1) * cols + i];
        const idx = (tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0);
        if (idx === 0 || idx === 15) continue;
        const xa = x0 + i * cell;
        const xb = xa + cell;
        const ya = y0 + j * cell;
        const yb = ya + cell;
        const top = () => edgePoint(j * cols + i, xa, ya, tl, xb, ya, tr);
        const bottom = () => edgePoint((j + 1) * cols + i, xa, yb, bl, xb, yb, br);
        const left = () => edgePoint(H + j * cols + i, xa, ya, tl, xa, yb, bl);
        const right = () => edgePoint(H + j * cols + i + 1, xb, ya, tr, xb, yb, br);
        const centreHigh = (tl + tr + br + bl) / 4 > level;
        switch (idx) {
          case 1:
          case 14:
            link(left(), bottom());
            break;
          case 2:
          case 13:
            link(bottom(), right());
            break;
          case 3:
          case 12:
            link(left(), right());
            break;
          case 4:
          case 11:
            link(top(), right());
            break;
          case 6:
          case 9:
            link(top(), bottom());
            break;
          case 7:
          case 8:
            link(top(), left());
            break;
          case 5:
            if (centreHigh) {
              link(left(), top());
              link(bottom(), right());
            } else {
              link(top(), right());
              link(left(), bottom());
            }
            break;
          case 10:
            if (centreHigh) {
              link(top(), right());
              link(left(), bottom());
            } else {
              link(left(), top());
              link(bottom(), right());
            }
            break;
        }
      }
    }

    const used = new Uint8Array(segA.length);
    const walk = (start: number) => {
      const chain: Polyline = [points.get(start)!];
      let key = start;
      let closed = false;
      for (;;) {
        const next = (adj.get(key) ?? []).find((id) => !used[id]);
        if (next === undefined) break;
        used[next] = 1;
        key = segA[next] === key ? segB[next] : segA[next];
        chain.push(points.get(key)!);
        if (key === start) {
          closed = true;
          break;
        }
      }
      const length = polylineLength(chain);
      if (chain.length > 2 && length >= (closed ? TERRAIN.minLoopPx : TERRAIN.minOpenPx)) lines.push(chaikin(chain, closed));
    };
    // Open lines first, in ascending key order (they end at the grid border), then closed loops in segment order.
    const keys = [...adj.keys()].sort((a, b) => a - b);
    for (const key of keys) {
      const ids = adj.get(key)!;
      if (ids.length === 1 && !used[ids[0]]) walk(key);
    }
    for (let id = 0; id < segA.length; id++) if (!used[id]) walk(segA[id]);
  }
  return lines;
}

interface IsolineOptions {
  width: number;
  height: number;
  seed: number;
  /** Average spacing between neighbouring lines, in px. */
  ringStep?: number;
  /** Marching-squares cell size, in px. */
  cell?: number;
  margin?: number;
}

export function isolines({ width, height, seed, ringStep = 18, cell = 6, margin = 24 }: IsolineOptions): Polyline[] {
  if (!(width > 0 && height > 0)) return [];
  return extractIsolines(sampleField(width, height, seed, cell, margin), ringStep);
}

/** Particles along each isoline at a fixed spacing, linked only along their own line. */
export function buildIsolineLayout({
  maxParticles = 6000,
  spacing = 7.5,
  width,
  height,
  seed,
  ringStep = 18,
  cell = 6,
  margin = 24,
}: IsolineOptions & { spacing?: number; maxParticles?: number }): ContourLayout {
  if (!(width > 0 && height > 0)) {
    return { count: 0, homeX: new Float32Array(), homeY: new Float32Array(), linked: new Uint8Array(), spacing };
  }
  const grid = sampleField(width, height, seed, cell, margin);
  let step = ringStep;
  for (let attempt = 0; ; attempt++) {
    const xs: number[] = [];
    const ys: number[] = [];
    const links: number[] = [];
    for (const line of extractIsolines(grid, step)) {
      let travelled = 0;
      let next = 0;
      for (let p = 1; p < line.length; p++) {
        const [ax, ay] = line[p - 1];
        const [bx, by] = line[p];
        const length = Math.hypot(bx - ax, by - ay);
        while (length > 0 && next <= travelled + length) {
          const t = (next - travelled) / length;
          xs.push(ax + (bx - ax) * t);
          ys.push(ay + (by - ay) * t);
          links.push(next === 0 ? 0 : 1);
          next += spacing;
        }
        travelled += length;
      }
    }
    if (xs.length <= maxParticles || attempt >= 6) {
      return { count: xs.length, homeX: Float32Array.from(xs), homeY: Float32Array.from(ys), linked: Uint8Array.from(links), spacing };
    }
    // Over budget: widen the line spacing (fewer lines) rather than thinning particles along a line.
    step *= (xs.length / maxParticles) * 1.03;
  }
}

/** SVG path data for the same field, for static contour textures. */
export function isolinePaths(width: number, height: number, seed: number, ringStep = 26, cell = 10): string[] {
  return isolines({ width, height, seed, ringStep, cell, margin: cell * 2 }).map((line) =>
    line.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("")
  );
}
