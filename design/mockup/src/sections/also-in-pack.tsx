import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Check, CloudLightning, CloudSun, Sun } from "lucide-react";
import { useState } from "react";
import { BentoTile, BentoTitle } from "@/components/kokonutui/bento-grid";
import { RouteColumn, RouteSection, SectionHeading } from "@/components/layout";
import { Waypoint } from "@/components/route";
import { DAYS } from "@/data/trip";
import { useReduced } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const TRACK = "M24 206 C 70 196, 64 150, 104 140 S 150 122, 150 92 S 196 56, 230 64 S 282 40, 300 22";

function RouteTile() {
  const [hovered, setHovered] = useState(false);
  const reduced = useReduced();
  return (
    <BentoTile className="lg:col-span-5 lg:row-span-2" from="left" index={0} onHoverChange={setHovered}>
      <BentoTitle
        body="Record with GPS on the trail, then import or export the track as GPX."
        title="Route recording and GPX"
      />
      <div className="relative mt-5 flex-1 overflow-hidden rounded-xl border border-rule bg-map" style={{ minHeight: 240 }}>
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="xMidYMid slice" viewBox="0 0 320 230">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <ellipse cx="240" cy="40" key={i} rx={i * 34} ry={i * 19} stroke="var(--contour)" strokeWidth="1" />
          ))}
          <path d={TRACK} stroke="var(--amber)" strokeDasharray="4 6" strokeLinecap="round" strokeOpacity="0.5" strokeWidth="2" />
          <motion.path
            animate={{ pathLength: reduced ? 1 : hovered ? 1 : 0.32 }}
            d={TRACK}
            initial={false}
            stroke="var(--amber)"
            strokeLinecap="round"
            strokeWidth="3"
            transition={{ duration: hovered ? 1.6 : 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
          <circle cx="24" cy="206" fill="var(--amber)" r="5" />
        </svg>
        <div className="absolute right-3 bottom-3 left-3 flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="rounded-full bg-surface px-3 py-1 font-bold text-ink tnum">Every 15 s</span>
          <span className="rounded-full bg-surface px-3 py-1 text-ink-muted">Export GPX</span>
        </div>
      </div>
      <p className="mt-3 text-sm text-fg-muted">Hover the map to walk the track.</p>
    </BentoTile>
  );
}

const FORECAST = [
  { day: "Day 1", sky: "clear", hi: 71, lo: 39, wind: "W 8 mph", Icon: Sun },
  { day: "Day 2", sky: "partly cloudy", hi: 68, lo: 41, wind: "SW 12 mph", Icon: CloudSun },
  { day: "Day 3", sky: "afternoon storms", hi: 63, lo: 38, wind: "W 15 mph", Icon: CloudLightning },
];

function WeatherTile() {
  return (
    <BentoTile className="lg:col-span-7" from="right" index={1}>
      <BentoTitle body="A National Weather Service forecast arrives for each trip day in the US." title="NOAA weather for every trip day" />
      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {FORECAST.map(({ day, sky, hi, lo, wind, Icon }) => (
          <li className="rounded-xl border border-rule bg-ground px-4 py-3" key={day}>
            <div className="flex items-center justify-between">
              <span className="font-bold">{day}</span>
              <Icon aria-hidden="true" className="h-5 w-5 text-fg-muted" strokeWidth={1.75} />
            </div>
            <p className="mt-1 text-sm text-fg-muted">
              {sky.charAt(0).toUpperCase() + sky.slice(1)}
            </p>
            <p className="mt-2 font-display text-xl font-medium tnum">
              {hi}°F / {lo}°F
            </p>
            <p className="text-sm text-fg-muted tnum">wind {wind}</p>
          </li>
        ))}
      </ul>
    </BentoTile>
  );
}

const CHECKS = [
  { label: "Gear", state: "Ready", ok: true, note: "Base weight 4.62 kg, nothing missing" },
  { label: "Calories", state: "Ready", ok: true, note: "Day 2 at 3,250 kcal of 3,000 kcal" },
  { label: "Weather", state: "Check day 3", ok: false, note: "Afternoon storms, wind W 15 mph" },
];

function ReadinessTile() {
  return (
    <BentoTile className="lg:col-span-4" from="left" index={2}>
      <BentoTitle body="Gear, calorie and weather checks before you leave." title="Readiness checks" />
      <ul className="mt-4 space-y-2.5">
        {CHECKS.map((check) => (
          <li className="flex items-start gap-3" key={check.label}>
            <span
              className={cn(
                "mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold",
                check.ok ? "bg-data text-ground" : "border border-fg text-fg"
              )}
            >
              {check.ok ? (
                <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
              ) : (
                <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
              )}
              {check.state}
            </span>
            <span className="min-w-0 text-sm">
              <span className="font-bold">{check.label}.</span> <span className="text-fg-muted">{check.note}</span>
            </span>
          </li>
        ))}
      </ul>
    </BentoTile>
  );
}

const PACKS = [
  { name: "Sierra summer", kg: "4.62 kg" },
  { name: "Desert spring", kg: "5.10 kg" },
  { name: "Late season", kg: "5.88 kg" },
];

function PacksTile() {
  const [loaded, setLoaded] = useState<string | null>(null);
  return (
    <BentoTile className="lg:col-span-3" from="right" index={3}>
      <BentoTitle body="Named sets, loaded onto a trip in one tap." title="Saved packs" />
      <ul className="mt-4 space-y-1.5">
        {PACKS.map((pack) => (
          <li key={pack.name}>
            <button
              aria-pressed={loaded === pack.name}
              className={cn(
                "flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border px-3 text-left text-sm transition-colors",
                loaded === pack.name ? "border-data bg-ground" : "border-rule"
              )}
              onClick={() => setLoaded(pack.name)}
              type="button"
            >
              <span className="font-bold">{pack.name}</span>
              <span className="flex items-center gap-1.5 text-fg-muted tnum">
                <AnimatePresence initial={false}>
                  {loaded === pack.name ? (
                    <motion.span animate={{ scale: 1 }} exit={{ scale: 0.6, opacity: 0 }} initial={{ scale: 0.6 }} key="check">
                      <Check aria-hidden="true" className="h-4 w-4 text-data" strokeWidth={2} />
                    </motion.span>
                  ) : null}
                </AnimatePresence>
                {pack.kg}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </BentoTile>
  );
}

function DebriefTile() {
  return (
    <BentoTile className="lg:col-span-4" from="left" index={4}>
      <BentoTitle body="Close out a trip: what you used, what stayed in the bag." title="Trip debriefs" />
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-rule px-3 py-2">
          <dt className="text-fg-muted">Used every day</dt>
          <dd className="font-bold tnum">17 items</dd>
        </div>
        <div className="rounded-lg border border-rule px-3 py-2">
          <dt className="text-fg-muted">Never unpacked</dt>
          <dd className="font-bold tnum">Liner, 222 g</dd>
        </div>
      </dl>
      <p className="mt-3 text-sm text-fg-muted">Finalized, base weight 4.62 kg joins the trend.</p>
    </BentoTile>
  );
}

function WaterTile() {
  const max = 3;
  return (
    <BentoTile className="lg:col-span-8" from="right" index={5}>
      <BentoTitle body="Planned from each day's miles and climb, from 2.0 L to 3.0 L." title="Water per day" />
      <div
        aria-label={`Water per day: ${DAYS.map((d) => `day ${d.day} ${d.water.toFixed(1)} L`).join(", ")}.`}
        className="mt-5 grid h-36 grid-cols-7 items-end gap-2 sm:gap-3"
        role="img"
      >
        {DAYS.map((day, index) => (
          <div className="flex h-full flex-col justify-end gap-1.5" key={day.day}>
            <span className="text-center text-xs font-bold tnum">{day.water.toFixed(1)} L</span>
            <motion.div
              className="rounded-t-md"
              initial={{ scaleY: 0.25 }}
              style={{ height: `${(day.water / max) * 100}%`, background: "var(--cat-water)", originY: 1 }}
              transition={{ duration: 0.9, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              whileInView={{ scaleY: 1 }}
            />
            <span className="text-center text-xs text-fg-muted tnum">Day {day.day}</span>
          </div>
        ))}
      </div>
    </BentoTile>
  );
}

export function AlsoInPack() {
  return (
    <RouteSection ground="paper" labelledBy="bento-heading" nav="route">
      <RouteColumn className="py-20 lg:py-28">
        <Waypoint id="bento" />
        <SectionHeading id="bento-heading" title="Everything else the trip needs" />
        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          <RouteTile />
          <WeatherTile />
          <ReadinessTile />
          <PacksTile />
          <DebriefTile />
          <WaterTile />
        </div>
      </RouteColumn>
    </RouteSection>
  );
}
