import type { Pointer } from './physics';

export interface PointerTracker {
  move(x: number, y: number, timeMs: number): void;
  leave(): void;
  tick(dt: number): void;
  read(): Pointer;
}

export function createPointerTracker(): PointerTracker {
  const state: Pointer = { x: 0, y: 0, speed: 0, active: false };
  let lastTime = -1;

  return {
    move(x, y, timeMs) {
      if (state.active && lastTime >= 0) {
        const elapsed = Math.max(timeMs - lastTime, 1) / 1000;
        const instant = Math.hypot(x - state.x, y - state.y) / elapsed;
        state.speed = state.speed * 0.6 + instant * 0.4; // smooths jittery event timing
      }
      state.x = x;
      state.y = y;
      state.active = true;
      lastTime = timeMs;
    },
    leave() {
      state.active = false;
      state.speed = 0;
      lastTime = -1;
    },
    tick(dt) {
      state.speed *= Math.exp(-4 * dt);
    },
    read() {
      return { ...state };
    },
  };
}
