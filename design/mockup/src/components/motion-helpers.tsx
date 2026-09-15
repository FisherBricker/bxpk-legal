import { motion, useInView, type Transition } from "motion/react";
import { type ReactNode, useRef } from "react";
import { EASE_EXPO, useReduced } from "@/lib/hooks";

type Side = "left" | "right" | "top" | "bottom" | "scale";

const OFFSET: Record<Side, { x?: number; y?: number; scale?: number }> = {
  left: { x: -44 },
  right: { x: 44 },
  top: { y: -32 },
  bottom: { y: 36 },
  scale: { scale: 0.96 },
};

/**
 * One authored entrance. Motion starts from a small offset at reduced opacity,
 * never from nothing, so a failed animation still leaves readable content.
 */
export function Enter({
  amount = 0.25,
  children,
  className = "",
  delay = 0,
  from = "bottom",
  transition,
}: {
  amount?: number;
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: Side;
  transition?: Transition;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.2, ...OFFSET[from] }}
      transition={transition ?? { duration: 0.95, delay, ease: EASE_EXPO }}
      viewport={{ once: true, amount }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Charts animate once, as their waypoint is reached: mount them when they come
 * into view, and immediately when the visitor asked for reduced motion.
 */
export function MountInView({
  children,
  className = "",
  minHeight,
}: {
  children: ReactNode;
  className?: string;
  minHeight?: number | string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReduced();
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <div className={className} ref={ref} style={{ minHeight }}>
      {inView || reduced ? children : null}
    </div>
  );
}
