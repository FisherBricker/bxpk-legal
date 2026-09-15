import { ContourRings } from "@/components/kokonutui/background-paths";
import { Phone, ScreenBars, ScreenCard, ScreenRow, ScreenTabBar, ScreenTitle } from "@/components/phone";
import { CATEGORIES, catTotal, DAYS, fmtInt, formatWeight, GOAL_G, RESUPPLY, SEASONS, TRIP } from "@/data/trip";

export type ScreenId = "trip" | "itinerary" | "resupply" | "route" | "base";

/**
 * Real app screenshots, once captured, go here by screen (for example trip: tripScreenshot).
 * Any screen without one keeps its skeleton.
 */
export const SCREEN_IMAGES: Partial<Record<ScreenId, string>> = {};

export const SCREEN_LABEL: Record<ScreenId, string> = {
  trip: `Trip, sample trip with base weight ${formatWeight(TRIP.baseG)}`,
  itinerary: "Itinerary, seven days with miles, elevation gain and water",
  resupply: "Resupply at Muir Trail Ranch on day 3",
  route: "Route recording, a point every 15 s",
  base: `Base weight ${formatWeight(TRIP.baseG)} against a ${formatWeight(GOAL_G)} goal`,
};

function Strip({ items }: { items: [string, string][] }) {
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-surface">
      {items.map(([value, label], i) => (
        <div
          className="px-3 py-2.5 text-center"
          key={label}
          style={{
            borderTop: i > 1 ? "1px solid var(--line)" : undefined,
            borderLeft: i % 2 === 1 ? "1px solid var(--line)" : undefined,
          }}
        >
          <div className="text-[15px] font-bold tnum">{value}</div>
          <div className="text-[11px] font-bold tracking-[0.06em] text-ink-muted uppercase">{label}</div>
        </div>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <div className="mt-4 mb-1.5 text-[12px] font-bold tracking-[0.08em] text-ink-muted uppercase">{children}</div>;
}

function TripScreen() {
  const shown = CATEGORIES.slice(0, 3);
  return (
    <>
      <ScreenTitle sub="Trips" title="Sample trip" />
      <ScreenCard className="mb-3 px-4 py-3">
        <div className="text-[13px] font-bold tracking-[0.06em] text-ink-muted uppercase">Base weight</div>
        <div className="font-display text-[34px] leading-none font-medium tnum">{formatWeight(TRIP.baseG)}</div>
        <div className="mt-1 text-[13px] text-ink-muted">7 days, 61.4 mi</div>
      </ScreenCard>
      <Strip
        items={[
          [formatWeight(TRIP.wornG), "Worn"],
          [formatWeight(DAYS[0].foodG + DAYS[0].waterG + DAYS[0].fuelG), "Consumables"],
          [formatWeight(DAYS[0].packG), "Pack"],
          [formatWeight(DAYS[0].skinOutG), "Skin-out"],
        ]}
      />
      {shown.map((category) => (
        <div key={category.id}>
          <SectionLabel>{`${category.label}, ${formatWeight(catTotal(category))}`}</SectionLabel>
          <ScreenCard>
            {category.items.map((item) => (
              <ScreenRow key={item.name} left={item.name} right={formatWeight(item.g)} />
            ))}
          </ScreenCard>
        </div>
      ))}
      <ScreenBars />
      <ScreenTabBar active={0} />
    </>
  );
}

function ItineraryScreen() {
  return (
    <>
      <ScreenTitle sub="Sample trip" title="Itinerary" />
      <ScreenCard>
        {DAYS.map((day) => (
          <ScreenRow
            key={day.day}
            left={`Day ${day.day}`}
            note={`${day.miles.toFixed(1)} mi, ${day.gainFt.toFixed(0)} ft`}
            right={`${day.waterL.toFixed(1)} L`}
          />
        ))}
      </ScreenCard>
      <SectionLabel>Forecast</SectionLabel>
      <ScreenCard>
        <ScreenRow left="Day 1, clear" note="wind W 8 mph" right="71°F / 39°F" />
        <ScreenRow left="Day 2, partly cloudy" note="wind SW 12 mph" right="68°F / 41°F" />
      </ScreenCard>
      <ScreenBars />
      <ScreenTabBar active={0} />
    </>
  );
}

function ResupplyScreen() {
  return (
    <>
      <ScreenTitle sub="Resupply" title="Muir Trail Ranch, Day 3" />
      <ScreenCard className="mb-1 px-4 py-3">
        <div className="text-[13px] font-bold tracking-[0.06em] text-ink-muted uppercase">Picked up</div>
        <div className="font-display text-[34px] leading-none font-medium tnum">+{formatWeight(RESUPPLY.pickupG)}</div>
        <div className="mt-1 text-[13px] text-ink-muted">Bucket pickup, mile 18.0</div>
      </ScreenCard>
      <SectionLabel>In the bucket</SectionLabel>
      <ScreenCard>
        {RESUPPLY.bucket.map((slot) => (
          <ScreenRow key={slot.label} left={slot.label} note="5 days" right={formatWeight(slot.g)} />
        ))}
        <ScreenRow left="Fuel canister" right={formatWeight(RESUPPLY.fuelG)} />
      </ScreenCard>
      <SectionLabel>Pack weight</SectionLabel>
      <ScreenCard>
        <ScreenRow left="Leaving day 2" right={formatWeight(DAYS[1].packG)} />
        <ScreenRow left="Leaving day 3" right={formatWeight(DAYS[2].packG)} />
      </ScreenCard>
      <ScreenBars />
      <ScreenTabBar active={0} />
    </>
  );
}

function RouteScreen() {
  return (
    <>
      <ScreenTitle sub="Recording" title="Route" />
      <div className="relative shrink-0 overflow-hidden rounded-2xl border border-line bg-map" style={{ height: 270 }}>
        <ContourRings height={270} seed={27} stroke="rgba(95,112,64,0.24)" width={340} ringStep={16} />
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full" fill="none" viewBox="0 0 340 270">

          <path d="M40 240 C 96 222, 88 186, 130 170 S 196 148, 206 112 S 250 70, 300 46" stroke="var(--amber)" strokeLinecap="round" strokeWidth="4" />
          <circle cx="40" cy="240" fill="var(--amber)" r="6" />
          <circle cx="300" cy="46" fill="var(--paper)" r="7" stroke="var(--amber)" strokeWidth="4" />
        </svg>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3 text-[15px]">
        <span className="font-bold">Every 15 s</span>
        <span className="text-[13px] text-ink-muted">GPS interval</span>
      </div>
      <SectionLabel>Splits</SectionLabel>
      <ScreenCard>
        {DAYS.slice(0, 4).map((day) => (
          <ScreenRow key={day.day} left={`Day ${day.day}`} note={`${day.gainFt.toFixed(0)} ft`} right={`${day.miles.toFixed(1)} mi`} />
        ))}
      </ScreenCard>
      <ScreenBars />
      <ScreenTabBar active={0} />
    </>
  );
}

function BaseWeightScreen() {
  return (
    <>
      <ScreenTitle sub="Profile" title="Base weight" />
      <ScreenCard className="mb-3 px-4 py-4 text-center">
        <div className="font-display text-[46px] leading-none font-medium tnum">{formatWeight(TRIP.baseG)}</div>
        <div className="mt-2 text-[14px] text-ink-muted">{formatWeight(TRIP.baseG - GOAL_G)} to your {formatWeight(GOAL_G)} goal</div>
      </ScreenCard>
      <div aria-hidden="true" className="flex h-24 shrink-0 items-end gap-2">
        {SEASONS.map((season, i) => (
          <span
            className="flex-1 rounded-t-sm"
            key={season.label}
            style={{ height: `${(season.g / SEASONS[0].g) * 100}%`, background: "var(--moss)", opacity: i === 4 ? 1 : 0.45 }}
          />
        ))}
      </div>
      <SectionLabel>Seasons</SectionLabel>
      <ScreenCard>
        {[...SEASONS].reverse().map((season) => (
          <ScreenRow key={season.label} left={season.label} right={formatWeight(season.g)} />
        ))}
      </ScreenCard>
      <ScreenBars />
      <ScreenTabBar active={3} />
    </>
  );
}

const SCREENS: Record<ScreenId, () => React.ReactElement> = {
  trip: TripScreen,
  itinerary: ItineraryScreen,
  resupply: ResupplyScreen,
  route: RouteScreen,
  base: BaseWeightScreen,
};

export function PhoneScreen({ id }: { id: ScreenId }) {
  const Screen = SCREENS[id];
  return <Screen />;
}

export function PhonePreview({
  id,
  width = 300,
  caption = true,
  className = "",
  src = SCREEN_IMAGES[id],
}: {
  id: ScreenId;
  width?: number;
  caption?: boolean;
  className?: string;
  src?: string;
}) {
  return (
    <Phone caption={caption} className={className} label={SCREEN_LABEL[id]} src={src} width={width}>
      <PhoneScreen id={id} />
    </Phone>
  );
}
