/**
 * Adapted from KokonutUI "Team Selector" (MIT, kokonutui.com).
 * Kept: overlapping avatars that spring in one after another. Changed: the plus
 * and minus stepper is gone. In the app's seeded shared gear every seat on every
 * item is already claimed, so the seats are shown as they stand, with initials in
 * Topo tokens instead of DiceBear images, and nothing on the page pretends to be
 * claimable. The DiceBear avatar images and the card chrome are dropped.
 */

import { motion, useReducedMotion } from "motion/react";

export interface SeatHolder {
  name: string;
  initials: string;
}

export function SeatRow({ holders, itemLabel }: { holders: SeatHolder[]; itemLabel: string }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <div
      aria-label={`${itemLabel}: seats held by ${holders.map((h) => h.name).join(" and ")}`}
      className="flex items-center"
      role="img"
    >
      {holders.map((holder, index) => (
        <motion.span
          aria-hidden="true"
          className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--ground)] bg-data text-[0.75rem] font-bold text-ground first:ml-0"
          initial={reduced ? false : { opacity: 0.3, scale: 0.85 }}
          key={holder.name}
          title={holder.name}
          transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.6, delay: index * 0.08 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          {holder.initials}
        </motion.span>
      ))}
    </div>
  );
}

export default SeatRow;
