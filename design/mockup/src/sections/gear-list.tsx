import { useState } from "react";
import { PieChart } from "@/components/charts/pie-chart";
import { PieSlice } from "@/components/charts/pie-slice";
import { GearCardStack } from "@/components/kokonutui/card-stack";
import { RouteColumn, RouteSection, SectionHeading } from "@/components/layout";
import { Enter, MountInView } from "@/components/motion-helpers";
import { Waypoint } from "@/components/route";
import { CATEGORIES, catTotal, fmtInt } from "@/data/trip";
import { useReduced } from "@/lib/hooks";

const CATEGORY_COLORS: Record<string, string> = {
  shelter: "#4C6444",
  sleep: "#6B5B8F",
  pack: "#8F6E5B",
  clothing: "#7B8F5A",
  cooking: "#C05B3A",
  water: "#3A5E8C",
  electronics: "#C9A227",
  misc: "#8A8F87",
};

export function GearList() {
  const [expanded, setExpanded] = useState<string | null>("shelter");
  const [hovered, setHovered] = useState<number | null>(null);
  const reduced = useReduced();

  const slices = CATEGORIES.map((category) => ({
    label: category.label,
    value: catTotal(category),
    color: CATEGORY_COLORS[category.id],
  }));
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const active = hovered === null ? null : slices[hovered];

  return (
    <RouteSection ground="paper" id="route" labelledBy="gear-heading" nav="route">
      <RouteColumn className="pt-24 pb-20 lg:pt-32 lg:pb-28">
        <Waypoint id="gear" />
        <SectionHeading
          body="Sort every item by category and mark it packed, worn or consumable. Base weight and skin-out weight update as you type. Group items into systems, save a whole pack, and load it onto a trip in one tap."
          id="gear-heading"
          title="Your gear list, down to the gram"
        />
        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <Enter className="min-w-0" from="left">
            <GearCardStack
              categories={CATEGORIES}
              expanded={expanded}
              hovered={hovered}
              onExpandedChange={setExpanded}
              onHoveredChange={setHovered}
            />
            <p className="mt-6 text-sm text-fg-muted">
              Worn, and not in base weight: wind shirt 58 g, trail runners 590 g, trekking poles 470 g, sun hat 62 g.
            </p>
          </Enter>
          <Enter className="min-w-0" from="right">
            <div className="panel px-5 py-6">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl font-medium">Share of base weight</h3>
                <span className="text-sm text-fg-muted tnum">8 categories</span>
              </div>
              <MountInView className="relative mt-4" minHeight={280}>
                <PieChart
                  cornerRadius={2}
                  data={slices}
                  enterTransition={reduced ? { duration: 0 } : undefined}
                  hoveredIndex={hovered}
                  innerRadius={88}
                  onHoverChange={setHovered}
                  padAngle={0.018}
                >
                  {slices.map((slice, index) => (
                    <PieSlice hoverEffect="translate" index={index} key={slice.label} showGlow={false} />
                  ))}
                </PieChart>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-display text-[1.75rem] leading-none font-medium tnum">
                    {active ? `${fmtInt(active.value)} g` : "4.62 kg"}
                  </span>
                  <span className="mt-1 max-w-[9rem] text-sm text-fg-muted">
                    {active ? active.label : "base"}
                  </span>
                </div>
              </MountInView>
              <p className="sr-only" role="img" aria-label={`Category share of the 4,620 g base weight: ${slices
                .map((slice) => `${slice.label} ${fmtInt(slice.value)} g`)
                .join(", ")}.`} />
              <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                {slices.map((slice, index) => (
                  <li
                    className="flex items-center gap-2"
                    key={slice.label}
                    onPointerEnter={() => setHovered(index)}
                    onPointerLeave={() => setHovered(null)}
                  >
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: slice.color }} />
                    <span className="min-w-0 flex-1 truncate">{slice.label}</span>
                    <span className="text-fg-muted tnum">{Math.round((slice.value / total) * 100)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </Enter>
        </div>
      </RouteColumn>
    </RouteSection>
  );
}
