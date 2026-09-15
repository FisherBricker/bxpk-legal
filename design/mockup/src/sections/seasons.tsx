import { Repeat } from "lucide-react";
import { useChartStable } from "@/components/charts/chart-context";
import { Grid } from "@/components/charts/grid";
import { Line } from "@/components/charts/line";
import { LineChart } from "@/components/charts/line-chart";
import { ChartMarkers } from "@/components/charts/markers";
import { ProjectionLine } from "@/components/charts/projection-line";
import { buildProjectionPath } from "@/components/charts/projection-utils";
import { ReferenceArea } from "@/components/charts/reference-area";
import { XAxis } from "@/components/charts/x-axis";
import { YAxis } from "@/components/charts/y-axis";
import { RouteColumn, RouteSection, SectionHeading } from "@/components/layout";
import { Enter, MountInView } from "@/components/motion-helpers";
import { Waypoint } from "@/components/route";
import { GOAL_KG, SEASONS } from "@/data/trip";
import { useReduced } from "@/lib/hooks";

const ROWS = SEASONS.map((season) => ({ date: season.date, kg: season.kg }));

const PROJECTION = buildProjectionPath({
  sourceData: ROWS,
  seriesKey: "kg",
  mode: "target",
  endValue: GOAL_KG,
  horizonPoints: 4,
});

const SWAPS = [
  { date: SEASONS[2].date, title: "Tent swap, 680 g lighter" },
  { date: SEASONS[3].date, title: "Quilt for sleeping bag, 410 g lighter" },
];

function GoalLabel() {
  const { yScale, innerWidth } = useChartStable();
  const y = yScale(GOAL_KG) ?? 0;
  return (
    <text fill="var(--data)" fontSize="12" fontWeight="700" textAnchor="end" x={innerWidth - 4} y={y - 8}>
      Goal: 4.00 kg
    </text>
  );
}

export function Seasons() {
  const reduced = useReduced();
  return (
    <RouteSection ground="map" labelledBy="seasons-heading" nav="route">
      <RouteColumn className="pt-20 pb-28 lg:pt-28 lg:pb-36">
        <Waypoint id="seasons" />
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <Enter from="left">
            <SectionHeading
              body="Finalize a trip and its base weight joins your trend, next to the goal you set."
              id="seasons-heading"
              title="Lighter, trip after trip"
            />
            <ul className="mt-8 space-y-3">
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
          <Enter from="right">
            <div className="panel px-4 py-5 sm:px-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-display text-xl font-medium">Base weight by season</h3>
                <span className="map-label text-fg-muted">Sample profile</span>
              </div>
              <MountInView className="mt-3" minHeight={300}>
                <div
                  aria-label="Base weight by season, sample profile: Spring 2025 5.88 kg, Summer 2025 5.41 kg, Fall 2025 5.10 kg after a tent swap 680 g lighter, Spring 2026 4.87 kg after swapping a sleeping bag for a quilt 410 g lighter, Summer 2026 4.62 kg. Projected toward a 4.00 kg goal."
                  role="img"
                >
                  <LineChart
                    animationDuration={reduced ? 0 : 1400}
                    aspectRatio="16 / 9"
                    data={ROWS}
                    margin={{ top: 30, right: 24, bottom: 36, left: 52 }}
                  >
                    <Grid numTicksRows={4} />
                    <ReferenceArea
                      pattern="diagonal"
                      patternColor="rgba(95,112,64,0.28)"
                      stroke="var(--data)"
                      strokeStyle="dashed"
                      y1={0}
                      y2={GOAL_KG}
                    />
                    <YAxis formatValue={(value) => `${value} kg`} numTicks={4} />
                    <Line dataKey="kg" fadeEdges={false} showMarkers stroke="var(--data)" strokeWidth={2.5} />
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
                    <XAxis numTicks={5} tickMode="data" />
                  </LineChart>
                </div>
              </MountInView>
            </div>
          </Enter>
        </div>
      </RouteColumn>
    </RouteSection>
  );
}
