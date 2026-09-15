/**
 * Adapted from KokonutUI "Bento Grid" (MIT, kokonutui.com).
 * Kept: the tile that tilts toward the pointer (rotateX/rotateY from pointer
 * position, lifted in Z) and the idea that every tile carries a small working
 * demonstration instead of an icon. Changed: the AI demo content, partner logos,
 * gradients and glass blur are gone; tilt is capped at 6 degrees on a low-bounce
 * spring; tiles are Topo panels in an asymmetric 12-column layout; tiles enter
 * from alternating sides; nothing is a link, so no tile pretends to navigate.
 */

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const MAX_TILT = 6;

export function BentoTile({
  children,
  className = "",
  from = "left",
  index = 0,
  onHoverChange,
}: {
  children: ReactNode;
  className?: string;
  from?: "left" | "right";
  index?: number;
  onHoverChange?: (hovered: boolean) => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]), spring);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
    onHoverChange?.(false);
  };

  return (
    <motion.div
      className={cn("min-w-0 [perspective:900px]", className)}
      initial={{ opacity: 0.2, x: from === "left" ? -48 : 48 }}
      transition={{ duration: 0.9, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, amount: 0.3 }}
      whileInView={{ opacity: 1, x: 0 }}
    >
      <motion.div
        className="panel relative h-full overflow-hidden p-5 sm:p-6"
        onPointerEnter={() => onHoverChange?.(true)}
        onPointerLeave={reset}
        onPointerMove={onPointerMove}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <div className="relative flex h-full flex-col" style={{ transform: "translateZ(18px)" }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function BentoTitle({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-display text-[1.375rem] leading-tight font-medium">{title}</h3>
      <p className="mt-1.5 text-[0.9375rem] text-fg-muted">{body}</p>
    </div>
  );
}
