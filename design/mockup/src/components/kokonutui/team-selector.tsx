/**
 * Adapted from KokonutUI "Team Selector" (MIT, kokonutui.com).
 * Kept: overlapping avatars that spring in and out as the count changes, and
 * the shake when the count cannot go any lower. Changed: the plus and minus
 * stepper becomes the seats themselves (each seat is its own 44 px button, so a
 * seat can be claimed or released directly), the DiceBear avatar images are
 * replaced with initials in Topo tokens, and the card chrome is dropped so the
 * seats sit in a gear pool row.
 */

import { motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface SeatPickerProps {
  /** Initials in the claimed seats. The first seat is always "You". */
  claimed: string[];
  seats: number;
  itemLabel: string;
  onToggle: (index: number) => void;
}

const AVATAR = {
  visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 260, damping: 22, mass: 0.6 } },
  hidden: { opacity: 0.4, scale: 0.85, transition: { duration: 0.18, ease: "easeOut" as const } },
};

export function SeatPicker({ claimed, seats, itemLabel, onToggle }: SeatPickerProps) {
  const [shake, setShake] = useState(false);
  const reduced = useReducedMotion() ?? false;

  const handle = (index: number) => {
    if (index === 0) {
      if (!reduced) {
        setShake(true);
        window.setTimeout(() => setShake(false), 300);
      }
      return;
    }
    onToggle(index);
  };

  return (
    <motion.div
      animate={shake ? { x: [-3, 3, -2, 2, 0] } : { x: 0 }}
      className="flex items-center"
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {Array.from({ length: seats }, (_, index) => {
        const who = claimed[index];
        const isClaimed = Boolean(who);
        return (
          <button
            aria-label={
              index === 0
                ? `Your seat on the ${itemLabel}`
                : isClaimed
                  ? `Release ${who}'s seat on the ${itemLabel}`
                  : `Claim seat ${index + 1} on the ${itemLabel}`
            }
            aria-pressed={isClaimed}
            className="flex h-11 w-9 items-center justify-center first:w-11"
            key={index}
            onClick={() => handle(index)}
            type="button"
          >
            <motion.span
              animate={isClaimed ? "visible" : "hidden"}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border text-[0.6875rem] font-bold",
                isClaimed ? "border-transparent bg-data text-ground" : "border-dashed border-fg-muted text-fg-muted"
              )}
              initial={false}
              variants={reduced ? undefined : AVATAR}
            >
              {isClaimed ? who : <Plus aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />}
            </motion.span>
          </button>
        );
      })}
    </motion.div>
  );
}

export default SeatPicker;
