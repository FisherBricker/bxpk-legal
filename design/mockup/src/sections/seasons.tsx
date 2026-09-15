import { Repeat } from "lucide-react";
import { useChartStable } from "@/components/charts/chart-context";
import { Grid } from "@/components/charts/grid";
import { Line } from "@/components/charts/line";
import { LineChart } from "@/components/charts/line-chart";
import { ChartMarkers } from "@/components/charts/markers";
import { ProjectionLine } from "@/components/charts/projection-line";
import { buildProjectionPath } from "@/components/charts/projection-utils";
import { XAxis } from "@/components/charts/x-axis";
import { YAxis } from "@/components/charts/y-axis";
import { Neatline, RouteColumn, RouteSection, SectionHeading } from "@/components/layout";
import { Enter, MountInView } from "@/components/motion-helpers";
import { Waypoint } from "@/components/route";
import { formatWeight, GOAL_G, SEASONS } from "@/data/trip";
import { toPounds } from "@/lib/units";
import { useIsDesktop, useReduced } from "@/lib/hooks";

// Plotted in pounds; labels go through formatWeight.
const ROWS = SEASONS.map((season) => ({ date: season.date, lb: toPounds(season.g) }));
const GOAL_LB = toPounds(GOAL_G);
/** Round pound ticks; the axis does not start at zero, and the chart says so. */
const LB_TICKS = [8, 9, 10, 11, 12, 13, 14];

const PROJECTION = buildProjectionPath({
  sourceData: ROWS,
  seriesKey: "lb",
  mode: "target",
  endValue: GOAL_LB,
  horizonPoints: 4,
});

const SWAPS = [
  { date: SEASONS[2].date, title: `Tent swap, ${formatWeight(680)} lighter` },
  { date: SEASONS[3].date, title: `Quilt for sleeping bag, ${formatWeight(410)} lighter` },
];

function GoalLabel() {
  const { yScale } = useChartStable();
  const y = yScale(GOAL_LB) ?? 0;
  return (
    <text fill="var(--data)" fontSize="12" fontWeight="700" x={8} y={y - 8}>
      Goal: {formatWeight(GOAL_G)}
    </text>
  );
}

export function Seasons() {
  const reduced = useReduced();
  const isDesktop = useIsDesktop();
  return (
    <RouteSection ground="map" labelledBy="seasons-heading" nav="route">
      <RouteColumn className="pt-20 pb-28 lg:pt-28 lg:pb-36">
        <Waypoint id="seasons" />
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <Enter from="left">
            <SectionHeading
              body="Finalize a trip and its base weight joins your trend, next to the goal you set."
              id="seasons-heading"
              title="Lighter, trip after trip"
            />
          </Enter>
          <Enter delay={0.1} from="left">
            <ul className="space-y-3">
              {SWAPS.map((swap) => (
                <li className="flex items-start gap-3" key={swap.title}>
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-rule bg-card">
                    <Repeat aria-hidden="true" className="h-3.5 w-3.5 text-data" strokeWidth={1.75} />
                  </span>
                  <span className="font-bold">{swap.title}</span>
                </li>
              ))}
            </ul>
          </Enter>
        </div>
        <Enter className="mt-10" from="right">
            <div className="panel panel-chart px-4 py-5 sm:px-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-display text-xl font-medium">Base weight by season</h3>
                <span className="map-label text-fg-muted">Sample profile</span>
              </div>
              <MountInView className="mt-3" minHeight={240}>
                <div
                  aria-label={`Base weight by season, sample profile: ${SEASONS.map((s, i) => `${s.label} ${formatWeight(s.g)}${i === 2 ? ` after a tent swap ${formatWeight(680)} lighter` : i === 3 ? ` after swapping a sleeping bag for a quilt ${formatWeight(410)} lighter` : ""}`).join(", ")}. Projected toward a ${formatWeight(GOAL_G)} goal.`}
                  role="img"
                >
                  <LineChart
                    animationDuration={reduced ? 0 : 1400}
                    aspectRatio={isDesktop ? "21 / 8" : "4 / 3"}
                    data={ROWS}
                    yDomain={[8, 14]}
                    margin={{ top: 30, right: 24, bottom: 36, left: 52 }}
                  >
                    <Grid
                      highlightRowStroke="var(--data)"
                      highlightRowStrokeDasharray="5,4"
                      highlightRowStrokeWidth={1.5}
                      highlightRowValues={[GOAL_LB]}
                      rowTickValues={LB_TICKS}
                    />
                    <YAxis formatValue={(value) => `${value} lb`} numTicks={6} />
                    <Line dataKey="lb" fadeEdges={false} showMarkers stroke="var(--data)" strokeWidth={2.5} />
                    <ProjectionLine data={PROJECTION} stroke="var(--data)" strokeDasharray="5,5" />
                    <GoalLabel />
                    <ChartMarkers
                      animate={!reduced}
                      items={SWAPS.map((swap) => ({
                        date: swap.date,
                        icon: <Repeat aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />,
                        title: swap.title,
                      }))}
                      size={26}
                    />
                    <XAxis numTicks={isDesktop ? 5 : 3} tickMode="data" />
                  </LineChart>
                </div>
              </MountInView>
              <p className="mt-2 text-xs text-fg-muted">Axis starts at 8 lb</p>
            </div>
        </Enter>
      </RouteColumn>
      <Neatline edge="bottom" />
    </RouteSection>
  );
}
