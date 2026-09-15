/**
 * Adapted from KokonutUI "Background Paths" (MIT, kokonutui.com).
 * The original draws slow-floating gradient waves in purple, pink and blue.
 * Here the same path generator is retuned into quadrangle contour hairlines:
 * one token color, no gradients, no endless loops, drawn in once when the band
 * is reached, and fully drawn under reduced motion.
 */

import { motion, useReducedMotion } from "motion/react";
import { memo, useMemo } from "react";
import { mulberry32 } from "@/lib/topo/contours";

interface ContourPathsProps {
  /** Distinct seed per band so no two sections carry the same contour. */
  seed?: number;
  /** Number of hairlines. */
  count?: number;
  className?: string;
  /** Stroke color. Defaults to the section's contour token. */
  stroke?: string;
  /** Draw the lines in on entry instead of showing them at once. */
  drawIn?: boolean;
  /** "contour" wanders across the band, "ridge" rises to a summit. */
  shape?: "contour" | "ridge";
}

function buildPath(index: number, rand: () => number, shape: "contour" | "ridge"): string {
  const segments = 8;
  const amplitude = shape === "ridge" ? 90 + index * 6 : 46 + index * 3;
  const phase = rand() * Math.PI * 2;
  const drift = shape === "ridge" ? index * 26 : index * 34;
  const points: Array<[number, number]> = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = -100 + t * 1400;
    const crest = shape === "ridge" ? Math.sin(t * Math.PI) * amplitude : 0;
    const wave =
      Math.sin(t * Math.PI * 2.1 + phase) * amplitude * 0.5 +
      Math.cos(t * Math.PI * 3.4 + phase) * amplitude * 0.22;
    points.push([x, 340 + drift - crest + wave]);
  }
  return points
    .map(([x, y], i) => {
      if (i === 0) return `M ${x.toFixed(1)} ${y.toFixed(1)}`;
      const [px, py] = points[i - 1];
      const cx1 = px + (x - px) * 0.4;
      const cx2 = px + (x - px) * 0.6;
      return `C ${cx1.toFixed(1)} ${py.toFixed(1)}, ${cx2.toFixed(1)} ${y.toFixed(1)}, ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export const ContourPaths = memo(function ContourPaths({
  seed = 7,
  count = 9,
  className = "",
  stroke = "var(--topo)",
  drawIn = false,
  shape = "contour",
}: ContourPathsProps) {
  const reduced = useReducedMotion() ?? false;
  const paths = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: count }, (_, i) => buildPath(i, rand, shape));
  }, [count, seed, shape]);

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1200 700"
    >
      {paths.map((d, index) =>
        drawIn && !reduced ? (
          <motion.path
            d={d}
            initial={{ pathLength: 0 }}
            key={d}
            stroke={stroke}
            strokeLinecap="round"
            strokeWidth={1}
            transition={{ duration: 1.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.2 }}
            whileInView={{ pathLength: 1 }}
          />
        ) : (
          <path d={d} key={d} stroke={stroke} strokeLinecap="round" strokeWidth={1} />
        )
      )}
    </svg>
  );
});

/** Nested contour rings, the app's ContourPanel geometry, used as a quiet texture. */
export const ContourRings = memo(function ContourRings({
  seed = 3,
  className = "",
  stroke = "var(--topo)",
  rings = 9,
}: {
  seed?: number;
  className?: string;
  stroke?: string;
  rings?: number;
}) {
  const geometry = useMemo(() => {
    const r = mulberry32(seed);
    return { cx: 60 + r() * 240, cy: 250 + r() * 140, step: 15 + r() * 9 };
  }, [seed]);
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 400 400"
    >
      {Array.from({ length: rings }, (_, i) => (
        <ellipse
          cx={geometry.cx}
          cy={geometry.cy}
          key={i}
          rx={(i + 1) * geometry.step * 1.9}
          ry={(i + 1) * geometry.step}
          stroke={stroke}
          strokeWidth={1}
        />
      ))}
    </svg>
  );
});
