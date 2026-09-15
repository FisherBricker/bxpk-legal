import { useEffect, useRef } from "react";
import { buildContours, type ContourLayout } from "@/lib/topo/contours";
import { createState, type ParticleState, PHYSICS, step } from "@/lib/topo/physics";
import { createPointerTracker } from "@/lib/topo/pointer";
import { useReduced } from "@/lib/hooks";

interface TopoFieldProps {
  /** Rectangle (relative to the field) whose particles stay quiet so text keeps its ground. */
  quietRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  seed?: number;
}

const LINE = "rgba(95,112,64,0.22)";
const DOT_REST = "rgba(95,112,64,0.45)";
const DOT_LIVE = "rgba(95,112,64,0.95)";

/**
 * The hero's contour particle field: contour lines drawn through linked particles,
 * dots at rest, pushed away from the pointer harder the faster it moves.
 * Uses the app's tested topo physics (contours.ts, physics.ts, pointer.ts).
 */
export function TopoField({ quietRef, className = "", seed = 20260915 }: TopoFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReduced();

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let layout: ContourLayout | null = null;
    let state: ParticleState | null = null;
    let quiet: Uint8Array = new Uint8Array();
    let width = 0;
    let height = 0;
    let raf = 0;
    let lastTime = -1;
    let running = false;
    let visible = true;
    let maxDisplacement = 0;
    let peakReach = 0;
    let peakPush = 0;
    let peakLive = 0;
    const tracker = createPointerTracker();

    function measure() {
      const rect = host!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      layout = buildContours({ width, height, seed, spacing: width < 600 ? 6.5 : 7.5, ringStep: 18, maxParticles: 6000 });
      state = createState(layout);
      quiet = new Uint8Array(layout.count);
      const quietEl = quietRef?.current;
      if (quietEl) {
        const hostRect = host!.getBoundingClientRect();
        const q = quietEl.getBoundingClientRect();
        const x0 = q.left - hostRect.left - 28;
        const x1 = q.right - hostRect.left + 28;
        const y0 = q.top - hostRect.top - 28;
        const y1 = q.bottom - hostRect.top + 28;
        for (let i = 0; i < layout.count; i++) {
          const x = layout.homeX[i];
          const y = layout.homeY[i];
          quiet[i] = x > x0 && x < x1 && y > y0 && y < y1 ? 1 : 0;
        }
      }
      canvas!.dataset.particles = String(layout.count);
      draw();
    }

    function draw() {
      if (!layout || !state) return;
      ctx!.clearRect(0, 0, width, height);
      ctx!.lineWidth = 1;
      ctx!.strokeStyle = LINE;
      ctx!.beginPath();
      for (let i = 0; i < layout.count; i++) {
        if (layout.linked[i]) ctx!.lineTo(state.x[i], state.y[i]);
        else ctx!.moveTo(state.x[i], state.y[i]);
      }
      ctx!.stroke();

      const rest = new Path2D();
      const live = new Path2D();
      let peak = 0;
      let liveCount = 0;
      for (let i = 0; i < layout.count; i++) {
        const dx = state.x[i] - layout.homeX[i];
        const dy = state.y[i] - layout.homeY[i];
        const d = Math.abs(dx) + Math.abs(dy);
        if (d > peak) peak = d;
        if (d > 4) {
          live.rect(state.x[i] - 1.1, state.y[i] - 1.1, 2.2, 2.2);
          liveCount++;
        }
        else if (!quiet[i]) rest.rect(state.x[i] - 0.75, state.y[i] - 0.75, 1.5, 1.5);
      }
      ctx!.fillStyle = DOT_REST;
      ctx!.fill(rest);
      ctx!.fillStyle = DOT_LIVE;
      ctx!.fill(live);
      if (peak > maxDisplacement) maxDisplacement = peak;
      canvas!.dataset.displacement = peak.toFixed(2);
      canvas!.dataset.peakDisplacement = maxDisplacement.toFixed(2);
      // How much of the field is bent at once: particles pushed more than 4 px off their contour.
      if (liveCount > peakLive) peakLive = liveCount;
      canvas!.dataset.peakBent = String(peakLive);
    }

    function frame(time: number) {
      if (!layout || !state || !visible) {
        running = false;
        return;
      }
      // Guard the first frame: step must never see an undefined or huge delta.
      const dt = lastTime < 0 ? 1 / 60 : Math.min((time - lastTime) / 1000, 1 / 30);
      lastTime = time;
      tracker.tick(dt);
      const pointer = tracker.read();
      canvas!.dataset.speed = pointer.speed.toFixed(1);
      // Expose the speed-scaled reach and push the physics used this frame (and their peaks), for review.
      if (pointer.active) {
        const reach = Math.min(PHYSICS.maxRadius, PHYSICS.radius + pointer.speed * PHYSICS.radiusPerSpeed);
        const push = PHYSICS.push * (1 + Math.min(PHYSICS.maxBoost, pointer.speed * PHYSICS.speedBoost));
        peakReach = Math.max(peakReach, reach);
        peakPush = Math.max(peakPush, push);
        canvas!.dataset.peakReach = peakReach.toFixed(0);
        canvas!.dataset.peakPush = peakPush.toFixed(0);
      }
      step(state, layout, pointer, dt);
      draw();
      let energy = 0;
      for (let i = 0; i < layout.count; i++) energy += Math.abs(state.vx[i]) + Math.abs(state.vy[i]);
      if (energy > 4 || pointer.active) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
        lastTime = -1;
      }
    }

    function wake() {
      if (running || !visible || reduced) return;
      running = true;
      lastTime = -1;
      raf = requestAnimationFrame(frame);
    }

    const localPoint = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top] as const;
    };

    const onMove = (e: PointerEvent) => {
      if (reduced || e.pointerType !== "mouse") return;
      const [x, y] = localPoint(e);
      tracker.move(x, y, e.timeStamp || performance.now());
      wake();
    };
    const onDown = (e: PointerEvent) => {
      if (reduced) return;
      const [x, y] = localPoint(e);
      const now = e.timeStamp || performance.now();
      if (e.pointerType === "mouse") {
        tracker.move(x, y, now);
      } else {
        // Touch: a tap sends a ripple out from the finger, then the field settles.
        tracker.move(x + 140, y + 140, now - 40);
        tracker.move(x, y, now);
        window.setTimeout(() => {
          tracker.leave();
          wake();
        }, 220);
      }
      wake();
    };
    const onLeave = () => {
      tracker.leave();
      wake();
    };

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerdown", onDown, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointercancel", onLeave);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    io.observe(host);

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(measure, 150);
    });
    ro.observe(host);

    const start = () => {
      measure();
      canvas.dataset.mode = reduced ? "static" : "live";
    };
    if (document.fonts?.ready) document.fonts.ready.then(start).catch(start);
    else start();

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointercancel", onLeave);
    };
  }, [quietRef, reduced, seed]);

  return <canvas aria-hidden="true" className={`absolute inset-0 h-full w-full ${className}`} data-topo-field="" ref={canvasRef} />;
}
