export interface ContourLayout {
  count: number;
  homeX: Float32Array;
  homeY: Float32Array;
  /** 1 when particle i continues the contour line from particle i - 1. */
  linked: Uint8Array;
  spacing: number;
}

export interface ContourOptions {
  width: number;
  height: number;
  seed: number;
  spacing?: number;
  ringStep?: number;
  maxParticles?: number;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MARGIN = 40;
const ASPECT = 1.9; // matches ContourPanel's ellipse proportions in the app

interface Ring { cx: number; cy: number; radius: number; a3: number; a5: number; p3: number; p5: number }

function rings(width: number, height: number, ringStep: number, rand: () => number): Ring[] {
  const centers = [
    { cx: width * 0.22, cy: height * 1.45, reach: Math.hypot(width, height) * 1.15 },
    { cx: width * 0.95, cy: -height * 0.55, reach: Math.hypot(width, height) * 0.95 },
  ];
  const out: Ring[] = [];
  for (const c of centers) {
    const a3 = 0.03 + rand() * 0.05;
    const a5 = 0.015 + rand() * 0.03;
    const p3 = rand() * Math.PI * 2;
    const p5 = rand() * Math.PI * 2;
    for (let r = ringStep; r < c.reach; r += ringStep) {
      out.push({ cx: c.cx, cy: c.cy, radius: r, a3, a5, p3, p5 });
    }
  }
  return out;
}

function ringPoint(ring: Ring, theta: number): [number, number] {
  const warp = 1 + ring.a3 * Math.sin(3 * theta + ring.p3) + ring.a5 * Math.sin(5 * theta + ring.p5);
  const r = ring.radius * warp;
  return [ring.cx + Math.cos(theta) * r * ASPECT, ring.cy + Math.sin(theta) * r];
}

function inside(x: number, y: number, width: number, height: number): boolean {
  return x >= -MARGIN && x <= width + MARGIN && y >= -MARGIN && y <= height + MARGIN;
}

function layoutWith(width: number, height: number, seed: number, spacing: number, ringStep: number) {
  const xs: number[] = [];
  const ys: number[] = [];
  const links: number[] = [];
  for (const ring of rings(width, height, ringStep, mulberry32(seed))) {
    const circumference = 2 * Math.PI * ring.radius * Math.sqrt((ASPECT * ASPECT + 1) / 2);
    const steps = Math.max(12, Math.ceil(circumference / spacing));
    let previousKept = false;
    for (let s = 0; s < steps; s++) {
      const [x, y] = ringPoint(ring, (s / steps) * Math.PI * 2);
      if (!inside(x, y, width, height)) {
        previousKept = false;
        continue;
      }
      xs.push(x);
      ys.push(y);
      links.push(previousKept ? 1 : 0);
      previousKept = true;
    }
  }
  return { xs, ys, links };
}

export function buildContours({ width, height, seed, spacing = 9, ringStep = 26, maxParticles = 3500 }: ContourOptions): ContourLayout {
  const validSpacing = Number.isFinite(spacing) && spacing > 0 ? spacing : 9;
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0 ||
    !Number.isFinite(spacing) ||
    spacing <= 0 ||
    !Number.isFinite(ringStep) ||
    ringStep <= 0 ||
    !Number.isFinite(maxParticles) ||
    maxParticles <= 0
  ) {
    return { count: 0, homeX: new Float32Array(), homeY: new Float32Array(), linked: new Uint8Array(), spacing: validSpacing };
  }
  let s = spacing;
  let step = ringStep;
  let result = layoutWith(width, height, seed, s, step);
  // Over budget: space particles and rings out together, which keeps the look and cuts count
  // roughly with the square of the scale.
  while (result.xs.length > maxParticles) {
    const scale = Math.sqrt(result.xs.length / maxParticles) * 1.02;
    s *= scale;
    step *= scale;
    result = layoutWith(width, height, seed, s, step);
  }
  return {
    count: result.xs.length,
    homeX: Float32Array.from(result.xs),
    homeY: Float32Array.from(result.ys),
    linked: Uint8Array.from(result.links),
    spacing: s,
  };
}
