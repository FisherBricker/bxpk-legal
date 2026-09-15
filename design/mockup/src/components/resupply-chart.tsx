import { curveStepAfter } from "@visx/curve";
import { motion } from "motion/react";
import { useChartStable } from "@/components/charts/chart-context";
import { ComposedChart } from "@/components/charts/composed-chart";
import { Grid } from "@/components/charts/grid";
import { Line } from "@/components/charts/line";
import { SeriesBar } from "@/components/charts/series-bar";
import { XAxis } from "@/components/charts/x-axis";
import { YAxis } from "@/components/charts/y-axis";
import { DAYS, dayDate, RESUPPLY } from "@/data/trip";

export const STACK = [
  { key: "base", label: "Base", color: "#A4BC6B" },
  { key: "food", label: "Food", color: "#DCE2CC" },
  { key: "water", label: "Water", color: "#7C9CC4" },
  { key: "fuel", label: "Fuel", color: "#8A8F87" },
] as const;

const ROWS = DAYS.map((day) => ({
  date: dayDate(day.day),
  base: day.base,
  food: day.food,
  water: day.water,
  fuel: day.fuel,
  skinOut: day.skinOut,
}));

/**
 * The days not yet walked sit under a scrim in the ground color, so the stack
 * reveals one day at a time as the section scrolls.
 */
function UnwalkedDays({ throughDay }: { throughDay: number }) {
  const { xScale, innerWidth, innerHeight, columnWidth } = useChartStable();
  if (throughDay >= ROWS.length) return null;
  const edge = (xScale(dayDate(throughDay + 1)) ?? 0) - columnWidth / 2;
  const x = Math.max(0, Math.min(edge, innerWidth));
  return (
    <motion.rect
      animate={{ x }}
      fill="var(--ground)"
      height={innerHeight + 24}
      initial={false}
      opacity={0.78}
      transition={{ type: "spring", stiffness: 120, damping: 24 }}
      width={Math.max(0, innerWidth - x) + 8}
      y={-12}
    />
  );
}

/** The resupply stop, marked on the day it lands. */
function ResupplyMarker({ visible }: { visible: boolean }) {
  const { xScale, innerHeight } = useChartStable();
  const x = xScale(dayDate(RESUPPLY.day)) ?? 0;
  return (
    <motion.g animate={{ opacity: visible ? 1 : 0 }} initial={false} transition={{ duration: 0.5 }}>
      <line
        stroke="var(--amber-bright)"
        strokeDasharray="4 5"
        strokeWidth="1.5"
        x1={x}
        x2={x}
        y1={-8}
        y2={innerHeight}
      />
      <circle cx={x} cy={-8} fill="var(--amber-bright)" r="5" />
      <text
        fill="var(--amber-bright)"
        fontSize="12"
        fontWeight="700"
        textAnchor="middle"
        x={x}
        y={-18}
      >
        +4.73 kg
      </text>
    </motion.g>
  );
}

export function ResupplyChart({ throughDay, animate = true }: { throughDay: number; animate?: boolean }) {
  return (
    <div
      aria-label="Pack weight for each day of the sample trip: day 1 9.22 kg, day 2 8.76 kg, day 3 12.03 kg after a 4.73 kg resupply at Muir Trail Ranch, day 4 11.57 kg, day 5 9.61 kg, day 6 9.15 kg, day 7 7.69 kg. Each bar stacks base weight 4.62 kg with that day's food, water and fuel, and the line is skin-out weight."
      role="img"
    >
      <ComposedChart
        animationDuration={animate ? 1000 : 0}
        aspectRatio="16 / 9"
        barGap={2}
        data={ROWS}
        margin={{ top: 46, right: 18, bottom: 34, left: 44 }}
        maxBarSize={54}
        stacked
      >
        <Grid numTicksRows={4} />
        <YAxis formatValue={(value) => `${value} kg`} numTicks={4} />
        {STACK.map((segment) => (
          <SeriesBar dataKey={segment.key} fill={segment.color} key={segment.key} radius={2} />
        ))}
        <Line
          curve={curveStepAfter}
          dashArray="5,5"
          dashFromIndex={throughDay - 1}
          dataKey="skinOut"
          fadeEdges={false}
          showHighlight={false}
          stroke="var(--night-ink)"
          strokeWidth={2}
        />
        <UnwalkedDays throughDay={throughDay} />
        <ResupplyMarker visible={throughDay >= RESUPPLY.day} />
        <XAxis numTicks={7} />
      </ComposedChart>
    </div>
  );
}

export function StackLegend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
      {STACK.map((segment) => (
        <li className="flex items-center gap-2" key={segment.key}>
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[3px]" style={{ background: segment.color }} />
          {segment.label}
        </li>
      ))}
      <li className="flex items-center gap-2">
        <span aria-hidden="true" className="h-0.5 w-5 bg-night-ink" />
        Skin-out weight
      </li>
      <li className="flex items-center gap-2">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-amber-bright" />
        Resupply
      </li>
    </ul>
  );
}
