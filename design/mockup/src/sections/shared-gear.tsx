import NumberFlow from "@number-flow/react";
import { motion, stagger, useInView } from "motion/react";
import { useRef } from "react";
import { SeatRow } from "@/components/kokonutui/team-selector";
import { RouteColumn, RouteSection, SectionHeading } from "@/components/layout";
import { Waypoint } from "@/components/route";
import { formatWeight, PEOPLE, POOLS } from "@/data/trip";
import { EASE_EXPO, useReduced } from "@/lib/hooks";
import { toPounds } from "@/lib/units";

/** Rowan's share of each item: the app divides the item's weight by its seats. */
const share = (pool: (typeof POOLS)[number]) => pool.g / pool.seats;
const CARRY_G = POOLS.reduce((sum, pool) => sum + share(pool), 0);
const SOLO_G = POOLS.reduce((sum, pool) => sum + pool.g, 0);
const LB_FORMAT = { minimumFractionDigits: 2, maximumFractionDigits: 2 } as const;

export function SharedGear() {
  const sentenceRef = useRef<HTMLParagraphElement>(null);
  const inView = useInView(sentenceRef, { once: true, amount: 0.6 });
  const reduced = useReduced();
  // The numbers roll up once, on entry. Both are over 1 lb, so they read as the app formats them.
  const shown = inView || reduced;

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
              body="Put the tent, the stove and the filter into a group pool. Friends claim a seat on each item, and everyone carries their share of the weight instead of guessing at the trailhead."
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
              {POOLS.map((pool) => (
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
                        {formatWeight(pool.g)}, {pool.claimed.length} of {pool.seats} seats claimed
                      </p>
                    </div>
                    <SeatRow holders={pool.claimed.map((key) => PEOPLE[key])} itemLabel={pool.item} />
                    <p className="text-right font-display text-xl font-medium whitespace-nowrap tnum">{formatWeight(share(pool))} each</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
            <p
              className="mt-8 font-display text-[clamp(1.5rem,1.1rem+1.2vw,2.25rem)] leading-snug font-medium tnum"
              ref={sentenceRef}
            >
              <span className="sr-only">
                {PEOPLE.me.name} carries {formatWeight(CARRY_G)}, {formatWeight(SOLO_G - CARRY_G)} less than going solo.
              </span>
              <span aria-hidden="true">
                {PEOPLE.me.name.split(" ")[0]} carries{" "}
                <NumberFlow format={LB_FORMAT} suffix=" lb" value={shown ? Number(toPounds(CARRY_G).toFixed(2)) : 0} />,{" "}
                <NumberFlow format={LB_FORMAT} suffix=" lb" value={shown ? Number(toPounds(SOLO_G - CARRY_G).toFixed(2)) : 0} /> less
                than going solo.
              </span>
            </p>
          </div>
        </div>
      </RouteColumn>
    </RouteSection>
  );
}
