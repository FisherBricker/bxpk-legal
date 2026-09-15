import { curveStepAfter } from "@visx/curve";
import { motion } from "motion/react";
import { useChartStable } from "@/components/charts/chart-context";
import { ComposedChart } from "@/components/charts/composed-chart";
import { Grid } from "@/components/charts/grid";
import { Line } from "@/components/charts/line";
import { SeriesBar } from "@/components/charts/series-bar";
import { XAxis } from "@/components/charts/x-axis";
import { DAYS, dayDate, formatWeight, RESUPPLY } from "@/data/trip";
import { toPounds } from "@/lib/units";
import { useMedia } from "@/lib/hooks";

export const STACK = [
  { key: "base", label: "Base", color: "#A4BC6B" },
  { key: "food", label: "Food", color: "#DCE2CC" },
  { key: "water", label: "Water", color: "#7C9CC4" },
  { key: "fuel", label: "Fuel", color: "#8A8F87" },
] as const;

const ROWS = DAYS.map((day) => ({
  date: dayDate(day.day),
  // Plotted in pounds; every label goes through formatWeight.
  base: toPounds(day.baseG),
  food: toPounds(day.foodG),
  water: toPounds(day.waterG),
  fuel: toPounds(day.fuelG),
  skinOut: toPounds(day.skinOutG),
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
      fill="var(--card)"
      height={innerHeight}
      initial={false}
      opacity={0.8}
      transition={{ type: "spring", stiffness: 120, damping: 24 }}
      width={Math.max(0, innerWidth - x) + 32}
      y={0}
    />
  );
}

/**
/** Round pound ticks on the weight axis. */
const LB_TICKS = [0, 10, 20, 30];

/**
 * Pound ticks set clear of the first bar. bklit's YAxis sits flush against
 * the plot edge, where a stacked bar centred on day 1 would cover its labels.
 */
function KgTicks() {
  const { yScale, columnWidth } = useChartStable();
  const x = -Math.min(54, columnWidth * 0.8) / 2 - 10;
  return (
    <g>
      {LB_TICKS.map((value) => (
        <text
          dominantBaseline="middle"
          fill="var(--chart-label)"
          fontSize="12"
          key={value}
          textAnchor="end"
          x={x}
          y={yScale(value)}
        >
          {value} lb
        </text>
      ))}
    </g>
  );
}

// Render outside the series reveal clip, like bklit's own axes.
(KgTicks as unknown as { __isPostOverlay: boolean }).__isPostOverlay = true;

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
        y1={4}
        y2={innerHeight}
      />
      <circle cx={x} cy={4} fill="var(--amber-bright)" r="5" />
      <text fill="var(--amber-bright)" fontSize="12" fontWeight="700" x={x + 10} y={8}>
        +{formatWeight(RESUPPLY.pickupG)}
      </text>
    </motion.g>
  );
}

export function ResupplyChart({ throughDay }: { throughDay: number }) {
  // Seven "Day N" labels crowd a phone-width chart, so narrow widths label every other day.
  const roomy = useMedia("(min-width: 640px)", true);
  return (
    <div
      aria-label={`Pack weight for each day of the sample trip: ${DAYS.map((d) => `day ${d.day} ${formatWeight(d.packG)}${d.day === RESUPPLY.day ? ` after a ${formatWeight(RESUPPLY.pickupG)} resupply at Muir Trail Ranch` : ""}`).join(", ")}. Each bar stacks base weight ${formatWeight(DAYS[0].baseG)} with that day's food, water and fuel, and the line is skin-out weight.`}
      role="img"
    >
      <ComposedChart
        animationDuration={1000}
        aspectRatio="5 / 4"
        barGap={2}
        data={ROWS}
        margin={{ top: 20, right: 18, bottom: 34, left: 76 }}
        maxBarSize={54}
        stacked
      >
        <Grid rowTickValues={LB_TICKS} />
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
        <KgTicks />
        <UnwalkedDays throughDay={throughDay} />
        <ResupplyMarker visible={throughDay >= RESUPPLY.day} />
        <XAxis numTicks={roomy ? 7 : 4} />
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
