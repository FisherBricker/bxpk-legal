import { Phone, ScreenBars, ScreenCard, ScreenRow, ScreenTabBar, ScreenTitle } from "@/components/phone";
import { CATEGORIES, catTotal, DAYS, fmtInt, SEASONS } from "@/data/trip";

export type ScreenId = "trip" | "itinerary" | "resupply" | "route" | "base";

export const SCREEN_LABEL: Record<ScreenId, string> = {
  trip: "Trip, sample trip with base weight 4.62 kg",
  itinerary: "Itinerary, seven days with miles, elevation gain and water",
  resupply: "Resupply at Muir Trail Ranch on day 3",
  route: "Route recording, a point every 15 s",
  base: "Base weight 4.62 kg against a 4.00 kg goal",
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
        <div className="font-display text-[34px] leading-none font-medium tnum">4.62 kg</div>
        <div className="mt-1 text-[13px] text-ink-muted">7 days, 61.4 mi</div>
      </ScreenCard>
      <Strip
        items={[
          ["1.18 kg", "Worn"],
          ["4.60 kg", "Consumables"],
          ["9.22 kg", "Pack"],
          ["10.40 kg", "Skin-out"],
        ]}
      />
      {shown.map((category) => (
        <div key={category.id}>
          <SectionLabel>{`${category.label}, ${fmtInt(catTotal(category))} g`}</SectionLabel>
          <ScreenCard>
            {category.items.map((item) => (
              <ScreenRow key={item.name} left={item.name} right={`${fmtInt(item.g)} g`} />
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
            note={`${day.miles.toFixed(1)} mi, ${fmtInt(day.gainFt)} ft`}
            right={`${day.water.toFixed(1)} L`}
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
        <div className="font-display text-[34px] leading-none font-medium tnum">+4.73 kg</div>
        <div className="mt-1 text-[13px] text-ink-muted">Bucket pickup, mile 18.0</div>
      </ScreenCard>
      <SectionLabel>In the bucket</SectionLabel>
      <ScreenCard>
        <ScreenRow left="Breakfasts" note="5 days" right="0.70 kg" />
        <ScreenRow left="Lunches" note="5 days" right="0.95 kg" />
        <ScreenRow left="Dinners" note="5 days" right="1.15 kg" />
        <ScreenRow left="Snacks" note="5 days" right="1.70 kg" />
        <ScreenRow left="Fuel canister" right="230 g" />
      </ScreenCard>
      <SectionLabel>Pack weight</SectionLabel>
      <ScreenCard>
        <ScreenRow left="Leaving day 2" right="8.76 kg" />
        <ScreenRow left="Leaving day 3" right="12.03 kg" />
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
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full" fill="none" viewBox="0 0 340 270">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <ellipse cx={90} cy={210} key={i} rx={(i + 1) * 38} ry={(i + 1) * 22} stroke="rgba(95,112,64,0.22)" strokeWidth="1" />
          ))}
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
          <ScreenRow key={day.day} left={`Day ${day.day}`} note={`${fmtInt(day.gainFt)} ft`} right={`${day.miles.toFixed(1)} mi`} />
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
        <div className="font-display text-[46px] leading-none font-medium tnum">4.62 kg</div>
        <div className="mt-2 text-[14px] text-ink-muted">0.62 kg to your 4.00 kg goal</div>
      </ScreenCard>
      <div aria-hidden="true" className="flex h-24 shrink-0 items-end gap-2">
        {SEASONS.map((season, i) => (
          <span
            className="flex-1 rounded-t-sm"
            key={season.label}
            style={{ height: `${(season.kg / 5.88) * 100}%`, background: "var(--moss)", opacity: i === 4 ? 1 : 0.45 }}
          />
        ))}
      </div>
      <SectionLabel>Seasons</SectionLabel>
      <ScreenCard>
        {[...SEASONS].reverse().map((season) => (
          <ScreenRow key={season.label} left={season.label} right={`${season.kg.toFixed(2)} kg`} />
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
}: {
  id: ScreenId;
  width?: number;
  caption?: boolean;
  className?: string;
}) {
  return (
    <Phone caption={caption} className={className} label={SCREEN_LABEL[id]} width={width}>
      <PhoneScreen id={id} />
    </Phone>
  );
}
