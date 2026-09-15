import NumberFlow from "@number-flow/react";
import { motion, stagger } from "motion/react";
import { useState } from "react";
import { SeatPicker } from "@/components/kokonutui/team-selector";
import { RouteColumn, RouteSection, SectionHeading } from "@/components/layout";
import { Waypoint } from "@/components/route";
import { fmtInt, POOLS } from "@/data/trip";
import { EASE_EXPO } from "@/lib/hooks";

const FRIENDS = ["JW", "RF", "AM"];

export function SharedGear() {
  const [claims, setClaims] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(POOLS.map((pool) => [pool.id, pool.claimed]))
  );

  const toggle = (poolId: string, index: number) => {
    setClaims((previous) => {
      const seats = [...previous[poolId]];
      if (seats[index]) {
        seats.splice(index, 1);
      } else {
        const taken = new Set(seats);
        const next = FRIENDS.find((friend) => !taken.has(friend)) ?? "AM";
        seats.push(next);
      }
      return { ...previous, [poolId]: seats };
    });
  };

  const share = (pool: (typeof POOLS)[number]) => Math.round(pool.g / Math.max(1, claims[pool.id].length));
  const youCarry = POOLS.reduce((sum, pool) => sum + share(pool), 0);
  const solo = POOLS.reduce((sum, pool) => sum + pool.g, 0);

  return (
    <RouteSection ground="paper" labelledBy="shared-heading" nav="route">
      <RouteColumn className="py-20 lg:py-28">
        <Waypoint id="shared" />
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <motion.div
            initial={{ opacity: 0.2, x: -36 }}
            transition={{ duration: 0.9, ease: EASE_EXPO }}
            viewport={{ once: true, amount: 0.3 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <SectionHeading
              body="Put the tent, the stove and the filter into a group pool. Friends claim a seat on each item, and everyone carries their share of the grams instead of guessing at the trailhead."
              id="shared-heading"
              title="Shared gear, split fairly"
            />
          </motion.div>

          <div>
          <motion.ul
            className="m-0 list-none p-0"
            initial="hidden"
            transition={{ delayChildren: stagger(0.12) }}
            viewport={{ once: true, amount: 0.25 }}
            whileInView="show"
          >
            {POOLS.map((pool) => {
              const seats = claims[pool.id];
              return (
                <motion.li
                  className="border-t border-rule py-5 last:border-b"
                  key={pool.id}
                  transition={{ duration: 0.8, ease: EASE_EXPO }}
                  variants={{ hidden: { opacity: 0.2, x: 44 }, show: { opacity: 1, x: 0 } }}
                >
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <div className="min-w-[14rem] flex-1">
                      <p className="font-bold">{pool.item}</p>
                      <p className="mt-0.5 text-sm text-fg-muted tnum">
                        {fmtInt(pool.g)} g, {seats.length} of {pool.seats} seats claimed
                      </p>
                    </div>
                    <SeatPicker
                      claimed={seats}
                      itemLabel={pool.item}
                      onToggle={(index) => toggle(pool.id, index)}
                      seats={pool.seats}
                    />
                    <p className="w-[6.5rem] text-right font-display text-xl font-medium tnum">
                      <NumberFlow suffix=" g each" value={share(pool)} />
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
          <p className="mt-8 font-display text-[clamp(1.5rem,1.1rem+1.2vw,2.25rem)] leading-snug font-medium tnum" aria-live="polite">
            You carry <NumberFlow suffix=" g" value={youCarry} />, <NumberFlow suffix=" g" value={solo - youCarry} /> less than going solo.
          </p>
          </div>
        </div>

      </RouteColumn>
    </RouteSection>
  );
}
