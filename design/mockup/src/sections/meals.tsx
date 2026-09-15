import { motion } from "motion/react";
import { Bar } from "@/components/charts/bar";
import { BarChart } from "@/components/charts/bar-chart";
import { BarXAxis } from "@/components/charts/bar-x-axis";
import { Grid } from "@/components/charts/grid";
import { RingChart } from "@/components/charts/ring-chart";
import { Ring } from "@/components/charts/ring";
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
  const bars = [
    ...MEALS.map((meal) => ({ meal: meal.meal, kcal: meal.kcal })),
    { meal: "Day total", kcal: MEAL_DAY.totalKcal },
  ];

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
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
              {MACROS.map(([label, value]) => (
                <div className="border-t border-rule pt-2" key={label}>
                  <dt className="map-label text-fg-muted">{label}</dt>
                  <dd className="mt-0.5 font-display text-xl font-medium tnum">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 flex items-center gap-2 font-bold">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-data" />
              250 kcal over target
            </p>
          </Enter>

          <motion.div
            className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
            initial={{ opacity: 0.2, y: -34 }}
            transition={{ duration: 1, ease: EASE_EXPO }}
            viewport={{ once: true, amount: 0.15 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="panel px-5 py-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-xl font-medium">Day 2, by meal</h3>
                <span className="map-label text-fg-muted">kcal</span>
              </div>
              <MountInView className="mt-2" minHeight={260}>
                <div
                  aria-label="Day 2 by meal: breakfast 720 kcal, lunch 880 kcal, dinner 1,050 kcal, snacks 600 kcal, day total 3,250 kcal against a target of 3,000 kcal."
                  role="img"
                >
                  <BarChart
                    animationDuration={reduced ? 0 : 900}
                    aspectRatio="4 / 3"
                    barGap={0.32}
                    data={bars}
                    margin={{ top: 24, right: 8, bottom: 34, left: 8 }}
                    xDataKey="meal"
                  >
                    <Grid
                      highlightRowStroke="var(--data)"
                      highlightRowStrokeDasharray="2,4"
                      highlightRowStrokeWidth={1.5}
                      highlightRowValues={[MEAL_DAY.targetKcal]}
                      numTicksRows={4}
                    />
                    <Bar
                      animationType="grow"
                      dataKey="kcal"
                      fill="var(--data)"
                      lineCap={4}
                      staggerDelay={reduced ? 0 : 0.09}
                    />
                    <BarXAxis showAllLabels />
                  </BarChart>
                </div>
              </MountInView>
              <p className="mt-1 text-sm text-fg-muted">Dashed row: the 3,000 kcal target for the day.</p>
              <ul className="mt-4 space-y-2 border-t border-rule pt-3 text-sm">
                {MEALS.map((meal) => (
                  <li className="flex items-baseline gap-3" key={meal.meal}>
                    <span className="w-[5.5rem] shrink-0 font-bold">{meal.meal}</span>
                    <span className="min-w-0 flex-1 text-fg-muted">
                      {meal.food}, {fmtInt(meal.g)} g
                    </span>
                    <span className="font-bold tnum">{fmtInt(meal.kcal)} kcal</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel flex flex-col px-5 py-5">
              <h3 className="font-display text-xl font-medium">Against the target</h3>
              <MountInView className="mt-4" minHeight={230}>
                <div
                  aria-label="Day total 3,250 kcal against a 3,000 kcal target, 250 kcal over."
                  className="relative mx-auto w-full max-w-[230px]"
                  role="img"
                >
                  <RingChart
                    animationDuration={reduced ? 0 : 1100}
                    baseInnerRadius={70}
                    data={[
                      { label: "Day total", value: MEAL_DAY.totalKcal, maxValue: MEAL_DAY.targetKcal, color: "var(--data)" },
                    ]}
                    strokeWidth={16}
                  >
                    <Ring index={0} lineCap="butt" showGlow={false} />
                  </RingChart>
                  {/* The 250 kcal over target, drawn where the ring passes its own start. */}
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
                    <span className="font-display text-[1.6rem] leading-none font-medium tnum">3,250 kcal</span>
                    <span className="mt-1 text-sm text-fg-muted">of 3,000 kcal</span>
                  </div>
                </div>
              </MountInView>
              <p className="mt-4 text-sm text-fg-muted">
                The dark arc is the 250 kcal the day runs over target, past the ring&rsquo;s own start.
              </p>
            </div>
          </motion.div>
        </div>
      </RouteColumn>
    </RouteSection>
  );
}
