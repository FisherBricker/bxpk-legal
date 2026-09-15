import { useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { RouteColumn, RouteSection, SectionHeading } from "@/components/layout";
import { Enter, MountInView } from "@/components/motion-helpers";
import { PhonePreview } from "@/components/phone-screens";
import { ResupplyChart, StackLegend } from "@/components/resupply-chart";
import { Waypoint } from "@/components/route";
import { walkDay } from "@/data/trip";
import { usePinned } from "@/lib/hooks";

const FACTS: [string, string][] = [
  ["Heaviest day", "Day 3, 12.03 kg"],
  ["Picked up at Muir Trail Ranch", "4.73 kg"],
  ["Trail's end", "7.69 kg"],
];

export function Resupply() {
  const pinned = usePinned();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [throughDay, setThroughDay] = useState(pinned ? 1 : 7);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!pinned) return;
    const day = walkDay(progress);
    setThroughDay((previous) => (previous === day ? previous : day));
  });

  const copy = (
    <>
      <SectionHeading
        body="Food and water come off the scale as the days pass and go back on at each resupply. See your heaviest day at the kitchen table, not halfway up the climb."
        id="resupply-heading"
        title="Pack weight for every day of the trip"
      />
      <dl className="mt-8 space-y-4">
        {FACTS.map(([label, value]) => (
          <div className="border-t border-rule pt-3" key={label}>
            <dt className="map-label text-fg-muted">{label}</dt>
            <dd className="mt-1 font-display text-2xl font-medium tnum">{value}</dd>
          </div>
        ))}
      </dl>
    </>
  );

  const chart = (
    <div className="panel px-4 py-5 sm:px-6 xl:pr-16">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-xl font-medium">Pack weight by day</h3>
        <span className="map-label text-fg-muted">Sample trip, 7 days</span>
      </div>
      <MountInView className="mt-3" minHeight={240}>
        <ResupplyChart throughDay={throughDay} />
      </MountInView>
      <div className="mt-4 border-t border-rule pt-4">
        <StackLegend />
      </div>
    </div>
  );

  return (
    <RouteSection ground="night" labelledBy="resupply-heading" nav="route">
      <div className="relative" data-pin={pinned ? "resupply" : undefined} ref={sectionRef} style={pinned ? { height: "300vh" } : undefined}>
        {pinned ? (
          <RouteColumn className="absolute top-24 right-0 left-0">
            <Waypoint id="resupply" />
          </RouteColumn>
        ) : null}
        <div className={pinned ? "sticky top-0 flex h-screen items-center" : ""}>
          <RouteColumn className={pinned ? "w-full py-10" : "w-full py-24"}>
            {pinned ? null : <Waypoint id="resupply" />}
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
              {pinned ? <div>{copy}</div> : <Enter from="left">{copy}</Enter>}
              <div className="flex flex-col items-center gap-8 xl:flex-row xl:items-start xl:gap-0">
                <div className="w-full min-w-0 flex-1 xl:pr-6">{pinned ? chart : <Enter from="right">{chart}</Enter>}</div>
                <div className="shrink-0 xl:-ml-14 xl:pt-24">
                  <PhonePreview id="resupply" width={176} />
                </div>
              </div>
            </div>
          </RouteColumn>
        </div>
      </div>
    </RouteSection>
  );
}
