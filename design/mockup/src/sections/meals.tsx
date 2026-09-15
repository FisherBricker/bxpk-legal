import { motion } from "motion/react";
import { RingChart } from "@/components/charts/ring-chart";
import { Ring } from "@/components/charts/ring";
import { MealsChart } from "@/components/meals-chart";
import { RouteColumn, RouteSection, SectionHeading } from "@/components/layout";
import { Enter, MountInView } from "@/components/motion-helpers";
import { Waypoint } from "@/components/route";
import { MEAL_DAY, MEALS, fmtInt } from "@/data/trip";
import { EASE_EXPO, useReduced } from "@/lib/hooks";

const MACROS: [string, string][] = [
  ["Fat", "118 g"],
  ["Carbs", "402 g"],
  ["Protein", "131 g"],
  ["Food", "812 g"],
  ["Boil water", "1,450 mL"],
];

export function Meals() {
  const reduced = useReduced();

  return (
    <RouteSection ground="map" labelledBy="meals-heading" nav="route">
      <RouteColumn className="py-20 lg:py-28">
        <Waypoint id="meals" />
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <Enter from="left">
            <SectionHeading
              body="Your daily calorie target comes from your pack weight and the miles ahead. Place food into breakfast, lunch, dinner and snacks, and each day shows its kcal, grams of food and the boil water you will need."
              id="meals-heading"
              title="Meals planned to the calorie"
            />
            <p className="mt-8 flex flex-wrap gap-x-5 gap-y-1.5 text-[1.0625rem] tnum">
              {MACROS.map(([label, value]) => (
                <span key={label}>
                  <span className="text-fg-muted">{label}</span> <span className="font-bold">{value}</span>
                </span>
              ))}
            </p>
            <p className="mt-6 flex items-center gap-2 font-bold">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-data" />
              250 kcal over target
            </p>
          </Enter>

          <motion.div
            className="grid items-start gap-6"
            initial={{ opacity: 0.2, y: -34 }}
            transition={{ duration: 1, ease: EASE_EXPO }}
            viewport={{ once: true, amount: 0.15 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="panel panel-chart px-5 py-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-xl font-medium">Day 2, by meal</h3>
                <span className="text-sm text-fg-muted tnum">3,250 kcal</span>
              </div>
              <MountInView className="mt-2" minHeight={170}>
                <MealsChart />
              </MountInView>
            </div>

            <div className="grid items-start gap-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <div className="panel panel-chart flex flex-col px-5 py-5">
                <h3 className="font-display text-xl font-medium">Against the target</h3>
                <MountInView className="mt-4" minHeight={210}>
                  <div
                    aria-label="Day total 3,250 kcal against a 3,000 kcal target, 250 kcal over."
                    className="relative mx-auto w-full max-w-[210px]"
                    role="img"
                  >
                    <RingChart
                      animationDuration={reduced ? 0 : 1100}
                      baseInnerRadius={64}
                      data={[{ label: "Day total", value: MEAL_DAY.totalKcal, maxValue: MEAL_DAY.targetKcal, color: "var(--data)" }]}
                      strokeWidth={15}
                    >
                      <Ring index={0} lineCap="butt" showGlow={false} />
                    </RingChart>
                    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 200 200">
                      <circle
                        cx="100"
                        cy="100"
                        fill="none"
                        r="68"
                        stroke="var(--fg)"
                        strokeDasharray={`${(250 / 3000) * 2 * Math.PI * 68} ${2 * Math.PI * 68}`}
                        strokeWidth="14"
                        transform="rotate(-90 100 100)"
                      />
                      <line stroke="var(--card)" strokeWidth="2" x1="100" x2="100" y1="25" y2="39" />
                    </svg>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-display text-[1.45rem] leading-none font-medium tnum">3,250 kcal</span>
                      <span className="mt-1 text-sm text-fg-muted">of 3,000 kcal</span>
                    </div>
                  </div>
                </MountInView>
              </div>

              <div className="panel px-5 py-5">
                <h3 className="font-display text-xl font-medium">On the menu</h3>
                <ul className="mt-3 divide-y divide-[var(--rule)] text-sm">
                  {MEALS.map((meal) => (
                    <li className="flex items-baseline gap-3 py-2.5" key={meal.meal}>
                      <span className="w-[5.25rem] shrink-0 font-bold">{meal.meal}</span>
                      <span className="min-w-0 flex-1 text-fg-muted">
                        {meal.food}, {fmtInt(meal.g)} g
                      </span>
                      <span className="font-bold tnum">{fmtInt(meal.kcal)} kcal</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </RouteColumn>
    </RouteSection>
  );
}
