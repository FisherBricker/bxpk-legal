import type { ContourLayout } from './contours';

export interface Pointer { x: number; y: number; speed: number; active: boolean }
export interface ParticleState { x: Float32Array; y: Float32Array; vx: Float32Array; vy: Float32Array }

/** Tuned for feel, not realism. DESIGN.md records the owner's notes on reach and spring. */
export const PHYSICS = {
  radius: 90, // px of reach with a still pointer
  radiusPerSpeed: 0.06, // extra reach per px/s of pointer speed
  maxRadius: 220,
  push: 2600, // px/s² at the pointer
  speedBoost: 0.0015, // extra push per px/s
  maxBoost: 3,
  stiffness: 22, // spring back to the contour line
  damping: 8,
  maxDt: 1 / 30,
};

export function createState(layout: ContourLayout): ParticleState {
  return { x: layout.homeX.slice(), y: layout.homeY.slice(), vx: new Float32Array(layout.count), vy: new Float32Array(layout.count) };
}

export function step(state: ParticleState, layout: ContourLayout, pointer: Pointer, dt: number): void {
  const h = Number.isFinite(dt) ? Math.min(Math.max(dt, 0), PHYSICS.maxDt) : 0;
  const reach = Math.min(PHYSICS.maxRadius, PHYSICS.radius + pointer.speed * PHYSICS.radiusPerSpeed);
  const reach2 = reach * reach;
  const strength = PHYSICS.push * (1 + Math.min(PHYSICS.maxBoost, pointer.speed * PHYSICS.speedBoost));
  const friction = Math.exp(-PHYSICS.damping * h);
  const { x, y, vx, vy } = state;

  for (let i = 0; i < layout.count; i++) {
    let ax = (layout.homeX[i] - x[i]) * PHYSICS.stiffness;
    let ay = (layout.homeY[i] - y[i]) * PHYSICS.stiffness;
    if (pointer.active) {
      const dx = x[i] - pointer.x;
      const dy = y[i] - pointer.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < reach2 && d2 > 1e-4) {
        const d = Math.sqrt(d2);
        const falloff = 1 - d / reach;
        const force = falloff * falloff * strength;
        ax += (dx / d) * force;
        ay += (dy / d) * force;
      }
    }
    vx[i] = (vx[i] + ax * h) * friction;
    vy[i] = (vy[i] + ay * h) * friction;
    x[i] += vx[i] * h;
    y[i] += vy[i] * h;
  }
}
