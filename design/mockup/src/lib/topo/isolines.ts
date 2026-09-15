import type { ContourLayout } from "./contours";

/**
 * Terrain as isolines of ONE height field, so contour lines nest and never cross.
 * Two summits sit at the app ContourPanel's two centres, (0.22w, 1.45h) and
 * (0.95w, -0.55h), stretched 1.9:1 like its ellipses and warped by the same two
 * low harmonics as contours.ts. Lines come out of marching squares on a coarse
 * grid, then particles are placed along each line.
 */

export type Polyline = Array<[number, number]>;

const ASPECT = 1.9;

function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function heightField(width: number, height: number, seed: number): (x: number, y: number) => number {
  const rand = seeded(seed);
  const diag = Math.hypot(width, height);
  const summits = [
    { cx: width * 0.22, cy: height * 1.45, sigma: diag * 0.62, amp: 1 },
    { cx: width * 0.95, cy: -height * 0.55, sigma: diag * 0.5, amp: 0.9 },
  ].map((s) => ({
    ...s,
    a3: 0.03 + rand() * 0.05,
    a5: 0.015 + rand() * 0.03,
    p3: rand() * Math.PI * 2,
    p5: rand() * Math.PI * 2,
  }));
  return (x, y) => {
    let h = 0;
    for (const s of summits) {
      const dx = (x - s.cx) / ASPECT;
      const dy = y - s.cy;
      const theta = Math.atan2(dy, dx);
      const warp = 1 + s.a3 * Math.sin(3 * theta + s.p3) + s.a5 * Math.sin(5 * theta + s.p5);
      const r = Math.hypot(dx, dy) / warp / s.sigma;
      h += s.amp * Math.exp(-0.5 * r * r);
    }
    return h;
  };
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
  /** Scale the number of levels (used to fit a particle budget). */
  levelScale?: number;
}

/** Contour polylines of the height field at a fixed interval. */
export function isolines({ width, height, seed, ringStep = 18, cell = 9, margin = 40, levelScale = 1 }: IsolineOptions): Polyline[] {
  if (!(width > 0 && height > 0)) return [];
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
  const count = Math.max(6, Math.round((Math.hypot(width, height) / ringStep) * levelScale));
  const interval = (max - min) / count;
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
      for (;;) {
        const next = (adj.get(key) ?? []).find((id) => !used[id]);
        if (next === undefined) break;
        used[next] = 1;
        key = segA[next] === key ? segB[next] : segA[next];
        chain.push(points.get(key)!);
        if (key === start) break;
      }
      if (chain.length > 2) lines.push(chain);
    };
    // Open lines first (they end at the grid border), then closed loops.
    for (const [key, ids] of adj) if (ids.length === 1 && !used[ids[0]]) walk(key);
    for (let id = 0; id < segA.length; id++) if (!used[id]) walk(segA[id]);
  }
  return lines;
}

/** Particles along each isoline at a fixed spacing, linked only along their own line. */
export function buildIsolineLayout({
  maxParticles = 6000,
  spacing = 7.5,
  ...options
}: IsolineOptions & { spacing?: number; maxParticles?: number }): ContourLayout {
  let levelScale = 1;
  for (let attempt = 0; attempt < 6; attempt++) {
    const xs: number[] = [];
    const ys: number[] = [];
    const links: number[] = [];
    for (const line of isolines({ ...options, levelScale })) {
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
    if (xs.length <= maxParticles || attempt === 5) {
      return {
        count: xs.length,
        homeX: Float32Array.from(xs),
        homeY: Float32Array.from(ys),
        linked: Uint8Array.from(links),
        spacing,
      };
    }
    levelScale *= Math.sqrt(maxParticles / xs.length) * 0.95;
  }
  throw new Error("unreachable");
}

/** SVG path data for the same field, for static contour textures. */
export function isolinePaths(width: number, height: number, seed: number, ringStep = 26, cell = 14): string[] {
  return isolines({ width, height, seed, ringStep, cell, margin: cell * 2 }).map((line) =>
    line.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("")
  );
}
