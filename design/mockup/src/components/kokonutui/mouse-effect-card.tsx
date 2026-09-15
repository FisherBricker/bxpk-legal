/**
 * Adapted from KokonutUI "Mouse Effect Card" (MIT, kokonutui.com).
 * Kept: a field of dots that repel from the cursor inside a radius, each pushed
 * by (1 - distance / radius) * strength along the line from the cursor and
 * sprung back home, with a proximity brightness boost.
 * Changed: the original renders every dot as its own motion div on a square
 * grid with a looping opacity pulse; a full-width band would need thousands of
 * those, so this draws the same math on one canvas. The dots sit on contour
 * rings (the app's ContourPanel geometry) in moss on the night ground, there
 * is no idle pulse, and the field is static under reduced motion and on touch.
 * The card's title, CTA buttons and blur halos are replaced by the band's own
 * content passed as children.
 */

import { type ReactNode, useEffect, useRef } from "react";
import { buildContours } from "@/lib/topo/contours";
import { useIsTouch, useReduced } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const RADIUS = 120;
const STRENGTH = 26;
const SPRING = 0.14;

export function ContourDotBand({ children, className }: { children: ReactNode; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReduced();
  const touch = useIsTouch();

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!host || !canvas || !ctx) return;
    const still = reduced || touch;

    let homeX: Float32Array = new Float32Array();
    let homeY: Float32Array = new Float32Array();
    let offX: Float32Array = new Float32Array();
    let offY: Float32Array = new Float32Array();
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    const mouse = { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const rest = new Path2D();
      const near = new Path2D();
      for (let i = 0; i < homeX.length; i++) {
        const x = homeX[i] + offX[i];
        const y = homeY[i] + offY[i];
        const d = Math.hypot(homeX[i] - mouse.x, homeY[i] - mouse.y);
        if (d < RADIUS * 1.2) near.rect(x - 1.4, y - 1.4, 2.8, 2.8);
        else rest.rect(x - 1, y - 1, 2, 2);
      }
      ctx.fillStyle = "rgba(164,188,107,0.4)";
      ctx.fill(rest);
      ctx.fillStyle = "rgba(164,188,107,0.9)";
      ctx.fill(near);
    };

    const measure = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.round(rect.width);
      height = Math.round(rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const layout = buildContours({ width, height, seed: 70279, spacing: 15, ringStep: 30, maxParticles: 2600 });
      homeX = layout.homeX;
      homeY = layout.homeY;
      offX = new Float32Array(layout.count);
      offY = new Float32Array(layout.count);
      canvas.dataset.dots = String(layout.count);
      draw();
    };

    const frame = () => {
      let moving = 0;
      for (let i = 0; i < homeX.length; i++) {
        let tx = 0;
        let ty = 0;
        const dx = homeX[i] - mouse.x;
        const dy = homeY[i] - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < RADIUS && d > 0.001) {
          const force = (1 - d / RADIUS) * STRENGTH;
          tx = (dx / d) * force;
          ty = (dy / d) * force;
        }
        offX[i] += (tx - offX[i]) * SPRING;
        offY[i] += (ty - offY[i]) * SPRING;
        moving += Math.abs(tx - offX[i]) + Math.abs(ty - offY[i]);
      }
      draw();
      if (moving > 0.5) raf = requestAnimationFrame(frame);
      else running = false;
    };

    const wake = () => {
      if (running || still) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const onMove = (event: PointerEvent) => {
      if (still || event.pointerType !== "mouse") return;
      const rect = host.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      wake();
    };
    const onLeave = () => {
      mouse.x = Number.POSITIVE_INFINITY;
      mouse.y = Number.POSITIVE_INFINITY;
      wake();
    };

    measure();
    canvas.dataset.mode = still ? "static" : "live";
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, touch]);

  return (
    <div className={cn("relative isolate overflow-hidden", className)} ref={hostRef}>
      <canvas aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full" ref={canvasRef} />
      {children}
    </div>
  );
}

export default ContourDotBand;
