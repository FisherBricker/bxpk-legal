import { Bar } from "@/components/charts/bar";
import { BarChart } from "@/components/charts/bar-chart";
import { useChartStable } from "@/components/charts/chart-context";
import { MEAL_DAY, MEALS, fmtInt } from "@/data/trip";
import { useMedia, useReduced } from "@/lib/hooks";

const SEGMENTS = [
  { key: "breakfast", color: "#C9D3AE" },
  { key: "lunch", color: "#A4B47D" },
  { key: "dinner", color: "#7B8F5A" },
  { key: "snacks", color: "#5F7040" },
] as const;

const ROW = {
  day: "Day 2",
  breakfast: MEALS[0].kcal,
  lunch: MEALS[1].kcal,
  dinner: MEALS[2].kcal,
  snacks: MEALS[3].kcal,
};

/** Meal names and kcal under each segment, the target tick, and the kcal past it. */
function Annotations() {
  const { yScale, barScale, bandWidth = 0, innerWidth } = useChartStable();
  const top = barScale?.("Day 2") ?? 0;
  const bottom = top + bandWidth;
  // On a phone the segments are too short for side-by-side labels, so the labels alternate between two rows.
  const narrow = innerWidth < 360;
  const target = yScale(MEAL_DAY.targetKcal);
  const total = yScale(MEAL_DAY.totalKcal);
  let offset = 0;
  return (
    <g>
      <defs>
        <pattern height="6" id="kcal-over" patternTransform="rotate(45)" patternUnits="userSpaceOnUse" width="6">
          <line stroke="var(--paper)" strokeOpacity="0.85" strokeWidth="2.5" x1="0" x2="0" y1="0" y2="6" />
        </pattern>
      </defs>
      {MEALS.map((meal, index) => {
        const x0 = yScale(offset);
        offset += meal.kcal;
        const mid = Math.max((x0 + yScale(offset)) / 2, 30);
        const row = narrow ? index % 2 : 0;
        return (
          <g key={meal.meal}>
            <text fill="var(--fg)" fontSize="12" fontWeight="700" textAnchor="middle" x={mid} y={bottom + 18 + row * 32}>
              {meal.meal}
            </text>
            <text className="tnum" fill="var(--fg-muted)" fontSize="12" textAnchor="middle" x={mid} y={bottom + 32 + row * 32}>
              {fmtInt(meal.kcal)} kcal
            </text>
          </g>
        );
      })}
      <rect fill="url(#kcal-over)" height={bandWidth} width={Math.max(0, total - target)} x={target} y={top} />
      <text fill="var(--fg)" fontSize="12" fontWeight="700" x={total + 8} y={top + bandWidth / 2 + 4}>
        +250 kcal
      </text>
      <line stroke="var(--fg)" strokeWidth="2" x1={target} x2={target} y1={top - 12} y2={bottom + 4} />
      <text fill="var(--fg)" fontSize="12" fontWeight="700" textAnchor="middle" x={target} y={top - 18}>
        Target 3,000 kcal
      </text>
    </g>
  );
}

export function MealsChart() {
  const reduced = useReduced();
  const roomy = useMedia("(min-width: 640px)", true);
  return (
    <div
      aria-label="Day 2 meals stacked against the day's 3,000 kcal target: breakfast 720 kcal, lunch 880 kcal, dinner 1,050 kcal, snacks 600 kcal, 3,250 kcal in all, 250 kcal over target."
      role="img"
    >
      <BarChart
        animationDuration={reduced ? 0 : 900}
        aspectRatio={roomy ? "16 / 5" : "3 / 2"}
        barGap={0.1}
        data={[ROW]}
        margin={{ top: 40, right: 74, bottom: roomy ? 48 : 80, left: 4 }}
        orientation="horizontal"
        stacked
        stackGap={2}
        xDataKey="day"
      >
        {SEGMENTS.map((segment) => (
          <Bar
            animationType="grow"
            dataKey={segment.key}
            fill={segment.color}
            key={segment.key}
            lineCap={3}
            staggerDelay={reduced ? 0 : 0.12}
          />
        ))}
        <Annotations />
      </BarChart>
    </div>
  );
}
