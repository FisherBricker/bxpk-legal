import { Phone, ScreenBars, ScreenCard, ScreenRow, ScreenTabBar, ScreenTitle } from "@/components/phone";

export type ScreenId = "trip" | "itinerary" | "resupply" | "route" | "base";

export const SCREEN_LABEL: Record<ScreenId, string> = {
  trip: "Trip, sample trip with base weight 4.62 kg",
  itinerary: "Itinerary, days with miles, elevation gain and water",
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

function TripScreen() {
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
      <ScreenCard className="mt-3">
        <ScreenRow left="Tent" note="Shelter" right="862 g" />
        <ScreenRow left="Quilt" note="Sleep system" right="652 g" />
      </ScreenCard>
      <ScreenBars rows={3} />
      <ScreenTabBar active={0} />
    </>
  );
}

function ItineraryScreen() {
  return (
    <>
      <ScreenTitle sub="Sample trip" title="Itinerary" />
      <ScreenCard>
        <ScreenRow left="Day 1" note="7.8 mi, 2,310 ft" right="2.5 L" />
        <ScreenRow left="Day 2" note="9.6 mi, 2,940 ft" right="3.0 L" />
        <ScreenRow left="Day 3" note="8.9 mi, 1,880 ft" right="2.5 L" />
      </ScreenCard>
      <ScreenBars rows={4} widths={[66, 74, 58, 70]} />
      <ScreenTabBar active={0} />
    </>
  );
}

function ResupplyScreen() {
  return (
    <>
      <ScreenTitle sub="Resupply" title="Muir Trail Ranch, Day 3" />
      <ScreenCard className="mb-3 px-4 py-3">
        <div className="text-[13px] font-bold tracking-[0.06em] text-ink-muted uppercase">Picked up</div>
        <div className="font-display text-[34px] leading-none font-medium tnum">+4.73 kg</div>
        <div className="mt-1 text-[13px] text-ink-muted">Bucket pickup, food for 5 days and one 230 g canister</div>
      </ScreenCard>
      <ScreenCard>
        <ScreenRow left="Leaving day 2" right="8.76 kg" />
        <ScreenRow left="Leaving day 3" right="12.03 kg" />
      </ScreenCard>
      <ScreenBars rows={3} widths={[60, 72, 52]} />
      <ScreenTabBar active={0} />
    </>
  );
}

function RouteScreen() {
  return (
    <>
      <ScreenTitle sub="Recording" title="Route" />
      <div className="relative overflow-hidden rounded-2xl border border-line bg-map" style={{ height: 300 }}>
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full" fill="none" viewBox="0 0 340 300">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <ellipse
              cx={90}
              cy={220}
              key={i}
              rx={(i + 1) * 38}
              ry={(i + 1) * 22}
              stroke="rgba(95,112,64,0.22)"
              strokeWidth="1"
            />
          ))}
          <path
            d="M40 268 C 96 250, 88 206, 130 190 S 196 168, 206 128 S 250 78, 300 52"
            stroke="var(--amber)"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <circle cx="40" cy="268" fill="var(--amber)" r="6" />
          <circle cx="300" cy="52" fill="var(--paper)" r="7" stroke="var(--amber)" strokeWidth="4" />
        </svg>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3 text-[15px]">
        <span className="font-bold">Every 15 s</span>
        <span className="text-[13px] text-ink-muted">GPS interval</span>
      </div>
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
      <div aria-hidden="true" className="flex h-24 items-end gap-2">
        {[100, 92, 87, 83, 79].map((h, i) => (
          <span
            className="flex-1 rounded-t-sm"
            key={h}
            style={{ height: `${h}%`, background: "var(--moss)", opacity: i === 4 ? 1 : 0.45 }}
          />
        ))}
      </div>
      <div aria-hidden="true" className="mt-2 flex gap-2 text-center text-[11px] text-ink-muted tnum">
        {["5.88", "5.41", "5.10", "4.87", "4.62"].map((kg) => (
          <span className="flex-1" key={kg}>
            {kg} kg
          </span>
        ))}
      </div>
      <ScreenBars rows={2} widths={[68, 54]} />
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
