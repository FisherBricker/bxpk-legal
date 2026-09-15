import { DAYS, fmtInt, formatWeight, RESUPPLY, TERRAIN } from "@/data/trip";

/**
 * The trip instrument: the sample route's elevation profile with its day-by-day
 * pack weight. At t = 0 it is drawn large in the hero (mile left to right,
 * elevation up); at t = 1 the same line has folded into the slim rail (mile top
 * to bottom, elevation as a sideways excursion). Every point is interpolated, so
 * the rail is visibly the hero profile condensed.
 */

export interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface RailBox {
  x0: number;
  width: number;
  y0: number;
  y1: number;
}

export interface Readout {
  mile: number;
  ft: number;
  day: number;
  /** Pack weight that day, in grams. */
  packG: number;
}

const END_MILE = 61.4;
const MIN_FT = 7400;
const MAX_FT = 12200;
const PEAK_PACK_G = 12030;

const NAMED = [
  { name: "Trailhead", mile: 0, ft: 9360, place: "below-start" },
  { name: "Piute Pass", mile: 5.5, ft: 11423, place: "above" },
  { name: "Muir Trail Ranch", mile: 18.0, ft: 7700, place: "below" },
  { name: "Muir Pass", mile: 38.0, ft: 11955, place: "above" },
  { name: "Bishop Pass", mile: 55.0, ft: 11972, place: "above" },
  { name: "South Lake", mile: 61.4, ft: 9768, place: "below-end" },
] as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function heroPoint(box: Box, mile: number, ft: number): [number, number] {
  return [
    box.x0 + (mile / END_MILE) * (box.x1 - box.x0),
    box.y1 - ((ft - MIN_FT) / (MAX_FT - MIN_FT)) * (box.y1 - box.y0),
  ];
}

export function railPoint(rail: RailBox, mile: number, ft: number): [number, number] {
  return [rail.x0 + ((ft - MIN_FT) / (MAX_FT - MIN_FT)) * rail.width, rail.y0 + (mile / END_MILE) * (rail.y1 - rail.y0)];
}

interface TripProfileProps {
  /** 0 = hero profile, 1 = rail. */
  t: number;
  plot: Box;
  strip: Box;
  rail: RailBox;
  readout: Readout;
  /** Text size multiplier for the static phone version drawn in a viewBox. */
  textScale?: number;
  /** Phone width: shorter labels so neighbouring passes and days do not collide. */
  compact?: boolean;
}

export function TripProfile({ t: rawT, plot, strip, rail, readout, textScale = 1, compact = false }: TripProfileProps) {
  const t = ease(clamp01(rawT));
  const heroFade = clamp01(1 - rawT * 2.4);
  const railFade = clamp01((rawT - 0.62) / 0.38);
  const at = (mile: number, ft: number): [number, number] => {
    const h = heroPoint(plot, mile, ft);
    const r = railPoint(rail, mile, ft);
    return [lerp(h[0], r[0], t), lerp(h[1], r[1], t)];
  };
  // Baseline: along the bottom of the hero plot, down the left edge of the rail strip.
  const base0: [number, number] = [lerp(plot.x0, rail.x0, t), lerp(plot.y1, rail.y0, t)];
  const base1: [number, number] = [lerp(plot.x1, rail.x0, t), lerp(plot.y1, rail.y1, t)];
  // The generated terrain: it undulates between surveyed points and passes exactly through each one.
  const line = TERRAIN.map(([mile, ft]) => at(mile, ft));
  const d = line.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${d} L${base1[0].toFixed(1)} ${base1[1].toFixed(1)} L${base0[0].toFixed(1)} ${base0[1].toFixed(1)} Z`;

  const you = at(readout.mile, readout.ft);
  const heroYou = heroPoint(plot, 0, 9360);
  const railYou = railPoint(rail, readout.mile, readout.ft);
  const dot: [number, number] = [lerp(heroYou[0], railYou[0], t), lerp(heroYou[1], railYou[1], t)];
  const readoutY = Math.min(Math.max(dot[1] - 26, rail.y0 + 6), rail.y1 - 64);
  const fs = (px: number) => px * textScale;
  // Bars stay a quiet strip under the profile, never a second headline chart.
  const stripH = Math.min(strip.y1 - strip.y0 - fs(34), fs(64));
  const stripTop = strip.y1 - fs(34) - stripH;

  return (
    <g>
      {/* Elevation hairlines, hero only */}
      <g opacity={heroFade}>
        {[8000, 10000, 12000].map((ft) => {
          const [, y] = heroPoint(plot, 0, ft);
          // Labels sit where the line leaves room: under 12,000 ft, over the lower two.
          const labelY = ft === 12000 ? y + fs(15) : y - fs(5);
          return (
            <g key={ft}>
              <line stroke="var(--fg-muted)" strokeDasharray="2 5" strokeOpacity={0.35} x1={plot.x0} x2={plot.x1} y1={y} y2={y} />
              <text className="tnum" fill="var(--fg-muted)" fontSize={fs(11)} textAnchor="end" x={plot.x1} y={labelY}>
                {fmtInt(ft)} ft
              </text>
            </g>
          );
        })}
      </g>

      <path d={area} fill="var(--data)" opacity={lerp(0.12, 0.08, t)} />
      <line stroke="var(--fg-muted)" strokeOpacity={0.5} x1={base0[0]} x2={base1[0]} y1={base0[1]} y2={base1[1]} />
      <path d={d} fill="none" stroke="var(--data)" strokeLinejoin="round" strokeWidth={lerp(2.5, 1.5, t)} />

      {/* Named places along the route, hero only */}
      <g opacity={heroFade}>
        {NAMED.map((p) => {
          const [x, y] = at(p.mile, p.ft);
          const above = p.place === "above";
          const anchor = p.place === "below-start" ? "start" : p.place === "below-end" ? "end" : "middle";
          const ty = above ? y - fs(30) : y + fs(22);
          return (
            <g key={p.name}>
              <line stroke="var(--fg-muted)" strokeOpacity={0.6} x1={x} x2={x} y1={above ? y - fs(6) : y + fs(6)} y2={above ? y - fs(14) : y + fs(8)} />
              <circle cx={x} cy={y} fill="var(--ground)" r={3} stroke="var(--data)" strokeWidth={1.5} />
              <text className="map-label" fill="var(--fg)" fontSize={fs(11.5)} textAnchor={anchor} x={x} y={ty}>
                {p.name}
              </text>
              <text className="tnum" fill="var(--fg-muted)" fontSize={fs(11.5)} textAnchor={anchor} x={x} y={ty + fs(14)}>
                {compact ? `${fmtInt(p.ft)} ft` : `Mile ${p.mile.toFixed(1)}, ${fmtInt(p.ft)} ft`}
              </text>
            </g>
          );
        })}
      </g>

      {/* Pack weight per day, aligned to each day's miles, hero only */}
      <g opacity={heroFade}>
        {DAYS.map((day) => {
          const [xa] = heroPoint(plot, day.startMi, 0);
          const [xb] = heroPoint(plot, day.startMi + day.miles, 0);
          const h = (day.packG / PEAK_PACK_G) * stripH;
          const x = xa + 2;
          const w = Math.max(4, xb - xa - 4);
          const top = stripTop + stripH - h;
          const labelled = !compact || day.day === 1 || day.day === RESUPPLY.day || day.day === DAYS.length;
          const anchor = compact && day.day === 1 ? "start" : compact && day.day === DAYS.length ? "end" : "middle";
          const lx = anchor === "start" ? x : anchor === "end" ? x + w : x + w / 2;
          return (
            <g key={day.day}>
              <rect fill="var(--data)" height={h} opacity={day.day === RESUPPLY.day ? 0.72 : 0.36} rx={2} width={w} x={x} y={top} />
              {labelled ? (
              <>
              <text fill="var(--fg)" fontSize={fs(11)} fontWeight={700} textAnchor={anchor} x={lx} y={stripTop + stripH + fs(14)}>
                Day {day.day}
              </text>
              <text className="tnum" fill="var(--fg-muted)" fontSize={fs(11)} textAnchor={anchor} x={lx} y={stripTop + stripH + fs(28)}>
                {formatWeight(day.packG)}
              </text>
              </>
              ) : null}
            </g>
          );
        })}
        {(() => {
          const [x] = heroPoint(plot, RESUPPLY.mile, 0);
          const top = stripTop + stripH - (DAYS[2].packG / PEAK_PACK_G) * stripH;
          return <circle cx={x + 4} cy={top - 7} fill="var(--route)" r={4.5} />;
        })()}
      </g>

      {/* Rail scale and readout */}
      <g opacity={railFade}>
        <text className="map-label" fill="var(--fg-muted)" fontSize={11} textAnchor="middle" x={rail.x0 + rail.width / 2} y={rail.y0 - 12}>
          0 mi
        </text>
        <text className="map-label" fill="var(--fg-muted)" fontSize={11} textAnchor="middle" x={rail.x0 + rail.width / 2} y={rail.y1 + 22}>
          61.4 mi
        </text>
        <line stroke="var(--route)" strokeOpacity={0.6} x1={rail.x0 - 12} x2={you[0]} y1={dot[1]} y2={dot[1]} />
        <g transform={`translate(${rail.x0 - 16} ${readoutY})`}>
          <text className="map-label" fill="var(--fg)" fontSize={12} textAnchor="end" y={12}>
            Mile {readout.mile.toFixed(1)}
          </text>
          <text className="map-label" fill="var(--fg-muted)" fontSize={12} textAnchor="end" y={28}>
            {fmtInt(readout.ft)} ft
          </text>
          <text fill="var(--fg)" fontSize={13} fontWeight={700} textAnchor="end" y={48}>
            Day {readout.day}
          </text>
          <text className="tnum" fill="var(--fg)" fontSize={13} fontWeight={700} textAnchor="end" y={64}>
            {formatWeight(readout.packG)}
          </text>
        </g>
      </g>

      {/* You are here */}
      <circle cx={dot[0]} cy={dot[1]} fill="var(--route)" r={lerp(7, 5, t)} stroke="var(--ground)" strokeWidth={3} />
    </g>
  );
}
