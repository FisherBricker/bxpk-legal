/**
 * Adapted from KokonutUI "Background Paths" (MIT, kokonutui.com).
 * The original draws slow-floating waves stroked with a three-color demo gradient.
 * Kept: a full-bleed SVG of hairline paths behind a band, drawn in with
 * pathLength. Changed: the paths are now isolines of the page's one height field
 * (src/lib/topo/isolines.ts), sized to the band they sit in, so every contour
 * texture on the page agrees with the hero and none of them cross. One token
 * color, no gradients, no endless loops; drawn in once when reached, and fully
 * drawn under reduced motion.
 */

import { motion, useReducedMotion } from "motion/react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { isolinePaths } from "@/lib/topo/isolines";

interface ContourPathsProps {
  /** Distinct seed per band so no two sections carry the same sheet. */
  seed?: number;
  className?: string;
  /** Stroke color. Defaults to the section's contour texture token. */
  stroke?: string;
  /** Draw the lines in on entry instead of showing them at once. */
  drawIn?: boolean;
  /** Average px between lines. */
  ringStep?: number;
}

export const ContourPaths = memo(function ContourPaths({
  seed = 7,
  className = "",
  stroke = "var(--topo-texture)",
  drawIn = false,
  ringStep = 30,
}: ContourPathsProps) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width / 20) * 20;
      const h = Math.round(entry.contentRect.height / 20) * 20;
      setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const paths = useMemo(() => (size.w && size.h ? isolinePaths(size.w, size.h, seed, ringStep, 16) : []), [size, seed, ringStep]);

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      fill="none"
      preserveAspectRatio="none"
      ref={ref}
      viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
    >
      {paths.map((d, index) =>
        drawIn && !reduced ? (
          <motion.path
            d={d}
            initial={{ pathLength: 0 }}
            key={index}
            stroke={stroke}
            strokeLinecap="round"
            strokeWidth={1}
            transition={{ duration: 1.6, delay: Math.min(index * 0.04, 0.8), ease: [0.16, 1, 0.3, 1] }}
            vectorEffect="non-scaling-stroke"
            viewport={{ once: true, amount: 0.2 }}
            whileInView={{ pathLength: 1 }}
          />
        ) : (
          <path d={d} key={index} stroke={stroke} strokeLinecap="round" strokeWidth={1} vectorEffect="non-scaling-stroke" />
        )
      )}
    </svg>
  );
});

/** The same field at a fixed size, for small surfaces such as phone screens and story covers. */
export const ContourRings = memo(function ContourRings({
  seed = 3,
  className = "",
  stroke = "var(--topo-texture)",
  width = 400,
  height = 400,
  ringStep = 22,
}: {
  seed?: number;
  className?: string;
  stroke?: string;
  width?: number;
  height?: number;
  ringStep?: number;
}) {
  const paths = useMemo(() => isolinePaths(width, height, seed, ringStep, 12), [width, height, seed, ringStep]);
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      viewBox={`0 0 ${width} ${height}`}
    >
      {paths.map((d, i) => (
        <path d={d} key={i} stroke={stroke} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
});
