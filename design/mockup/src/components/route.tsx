import { motion, useMotionValue, useMotionValueEvent, useScroll } from "motion/react";
import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { type RailBox, type Readout, TripProfile } from "@/components/trip-profile";
import { DAYS, dayOnTrail, elevationAt, fmtInt, walkDay } from "@/data/trip";
import { CAPTURE, useMedia, useReduced } from "@/lib/hooks";

export interface WaypointDef {
  id: string;
  name: string;
  mile: number;
  ft: number;
}

/** The waypoints on the line, in walking order. */
export const WAYPOINTS: WaypointDef[] = [
  { id: "gear", name: "Trailhead", mile: 0, ft: 9360 },
  { id: "meals", name: "Day 2 camp", mile: 17.4, ft: 8050 },
  { id: "resupply", name: "Muir Trail Ranch", mile: 18.0, ft: 7700 },
  { id: "shared", name: "Muir Pass", mile: 38.0, ft: 11955 },
  { id: "guide", name: "LeConte Canyon", mile: 44.6, ft: 8700 },
  { id: "bento", name: "Bishop Pass", mile: 55.0, ft: 11972 },
  { id: "seasons", name: "Trail's end, South Lake", mile: 61.4, ft: 9768 },
];


/**
 * A marker label on the route: it labels the route, not the heading beside it.
 * Desktop sets it in the line's gutter; phones get an inline annotation row with
 * its own amber dot, since the line itself is not drawn there.
 */
export function Waypoint({ id }: { id: string }) {
  const wp = WAYPOINTS.find((w) => w.id === id);
  if (!wp) return null;
  return (
    <p className="map-label mb-6 flex items-center gap-2 text-fg-muted lg:absolute lg:top-1 lg:-left-[136px] lg:mb-0 lg:block lg:w-[124px]" data-waypoint={id}>
      <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-route lg:hidden" />
      <span className="lg:hidden">
        Mile {wp.mile.toFixed(1)}, {wp.name}, {fmtInt(wp.ft)} ft
      </span>
      <span className="hidden lg:inline">
        <span className="text-fg">Mile {wp.mile.toFixed(1)}</span>
        <br />
        {wp.name}
        <br />
        {fmtInt(wp.ft)} ft
      </span>
    </p>
  );
}

interface Point {
  x: number;
  y: number;
}

function knots(start: Point, ys: number[], gutter: number, amp: number): Point[] {
  const pts: Point[] = [start, { x: start.x, y: Math.max(start.y + 40, 24) }, { x: gutter + 60, y: Math.max(ys[0] - 70, 90) }];
  for (const y of ys) {
    const prev = pts[pts.length - 1];
    const dy = y - prev.y;
    const steps = Math.max(1, Math.round(dy / 340));
    for (let k = 1; k < steps; k++) {
      pts.push({ x: gutter + (k % 2 === 1 ? amp : -amp * 0.75), y: prev.y + (dy * k) / steps });
    }
    pts.push({ x: gutter, y });
  }
  return pts;
}

function smoothPath(p: Point[]): string {
  if (p.length < 2) return "";
  let d = `M ${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p[i + 1];
    d += ` C ${(p1.x + (p2.x - p0.x) / 6).toFixed(1)} ${(p1.y + (p2.y - p0.y) / 6).toFixed(1)}, ${(p2.x - (p3.x - p1.x) / 6).toFixed(1)} ${(p2.y - (p3.y - p1.y) / 6).toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

interface Frame {
  y: number;
  mile: number;
  ftOffset: number;
}

interface Pin {
  top: number;
  height: number;
}

interface Measured {
  width: number;
  height: number;
  docTop: number;
  path: string;
  markers: Point[];
  /** Waypoint anchors in document coordinates. */
  anchors: number[];
  frames: Frame[];
  nights: Array<{ y0: number; y1: number }>;
  resupplyPin: Pin | null;
  hero: { left: number; top: number; width: number; height: number } | null;
  heroHeight: number;
}

const EMPTY: Measured = {
  width: 0,
  height: 0,
  docTop: 0,
  path: "",
  markers: [],
  anchors: [],
  frames: [],
  nights: [],
  resupplyPin: null,
  hero: null,
  heroHeight: 1,
};

const START: Readout = { mile: 0, ft: 9360, day: 1, pack: DAYS[0].pack };

/**
 * The rail reads the waypoint whose heading sits at the viewport's vertical
 * centre, interpolating only between consecutive anchors. Pinned chapters hold:
 * the resupply chapter follows the chart's walking day, the trail guide holds at
 * LeConte Canyon.
 */
function readoutAt(center: number, scroll: number, vh: number, m: Measured): Readout {
  const pin = m.resupplyPin;
  if (pin && center >= pin.top + vh / 2 && center <= pin.top + pin.height - vh / 2) {
    const progress = (scroll - pin.top) / Math.max(1, pin.height - vh);
    const day = DAYS[walkDay(progress) - 1];
    return { mile: day.startMi, ft: elevationAt(day.startMi), day: day.day, pack: day.pack };
  }
  const f = m.frames;
  if (!f.length || center <= f[0].y) return START;
  let a = f[f.length - 1];
  let b = a;
  for (let i = 1; i < f.length; i++) {
    if (center < f[i].y) {
      a = f[i - 1];
      b = f[i];
      break;
    }
  }
  const t = b === a ? 0 : (center - a.y) / Math.max(1, b.y - a.y);
  const mile = a.mile + (b.mile - a.mile) * t;
  const ft = elevationAt(mile) + a.ftOffset + (b.ftOffset - a.ftOffset) * t;
  const day = dayOnTrail(mile);
  return { mile, ft, day: day.day, pack: day.pack };
}

export function RouteLine({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  // The drawn line, gutter labels and pinned rail need the full desktop column (the lg breakpoint).
  const isDesktop = useMedia("(min-width: 1024px)", true);
  // Reduced motion (and review captures) get the route fully walked and every marker lit.
  const reduced = useReduced() || CAPTURE;
  const [m, setM] = useState<Measured>(EMPTY);
  const [reached, setReached] = useState(reduced ? WAYPOINTS.length : 0);
  const [onNight, setOnNight] = useState(false);
  const [readout, setReadout] = useState<Readout>(START);
  const [status, setStatus] = useState({ show: true, inRoute: false });
  const drawn = useMotionValue(reduced ? 1 : 0);
  const { scrollY } = useScroll();
  const lookup = useRef<{ len: number[]; y: number[]; total: number }>({ len: [], y: [], total: 1 });

  // Measure the column, anchors, pinned chapters, night chapters and the hero profile, then lay out the line.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const scroll = window.scrollY;
      const vh = window.innerHeight;
      const box = el.getBoundingClientRect();
      const top = box.top + scroll;
      const anchors = WAYPOINTS.map((wp) => {
        const node = el.querySelector(`[data-waypoint="${wp.id}"]`);
        if (!node) return top;
        const r = node.getBoundingClientRect();
        return r.top + scroll + Math.min(r.height, 28) / 2;
      });
      const pinOf = (name: string): Pin | null => {
        const node = el.querySelector(`[data-pin="${name}"]`);
        if (!node) return null;
        const r = node.getBoundingClientRect();
        return { top: r.top + scroll, height: r.height };
      };
      const resupplyPin = pinOf("resupply");
      const guidePin = pinOf("guide");
      const frames: Frame[] = [];
      WAYPOINTS.forEach((wp, i) => {
        const frame = { y: anchors[i], mile: wp.mile, ftOffset: wp.ft - elevationAt(wp.mile) };
        frames.push(frame);
        if (wp.id === "resupply" && resupplyPin) frames.push({ ...frame, y: resupplyPin.top + resupplyPin.height - vh / 2 });
        if (wp.id === "guide" && guidePin) frames.push({ ...frame, y: guidePin.top + guidePin.height - vh / 2 });
      });
      const nights = Array.from(el.querySelectorAll("[data-night]")).map((node) => {
        const r = node.getBoundingClientRect();
        return { y0: r.top + scroll - top, y1: r.bottom + scroll - top };
      });
      const heroNode = document.querySelector("[data-hero-profile]");
      const heroSection = document.getElementById("trailhead");
      const heroRect = heroNode?.getBoundingClientRect();
      const hero = heroRect && heroRect.width > 0 ? { left: heroRect.left, top: heroRect.top + scroll, width: heroRect.width, height: heroRect.height } : null;
      const width = box.width;
      const columnLeft = Math.max(0, (width - 1440) / 2);
      const gutter = columnLeft + 64;
      const startNode = document.querySelector("[data-trailhead-dot]");
      const startRect = startNode?.getBoundingClientRect();
      const start = startRect && startRect.width > 0
        ? { x: startRect.left + startRect.width / 2 - box.left, y: startRect.top + scroll + startRect.height / 2 - top }
        : { x: width / 2, y: 0 };
      const local = anchors.map((y) => y - top);
      setM({
        width,
        height: box.height,
        docTop: top,
        path: smoothPath(knots(start, local, gutter, 30)),
        markers: local.map((y) => ({ x: gutter, y })),
        anchors,
        frames,
        nights,
        resupplyPin,
        hero,
        heroHeight: heroSection?.offsetHeight ?? vh,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    const t = window.setTimeout(measure, 700);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
      window.clearTimeout(t);
    };
  }, [isDesktop]);

  // Length-by-y lookup so the drawn head lines up with the centre of the viewport.
  useEffect(() => {
    const path = pathRef.current;
    if (!path || !m.path) return;
    const total = path.getTotalLength();
    const len: number[] = [];
    const y: number[] = [];
    for (let i = 0; i <= 600; i++) {
      const l = (total * i) / 600;
      len.push(l);
      y.push(path.getPointAtLength(l).y);
    }
    lookup.current = { len, y, total: total || 1 };
  }, [m.path]);

  useEffect(() => {
    if (!m.height) return;
    const update = (scroll: number) => {
      const vh = window.innerHeight;
      const center = scroll + vh / 2;
      const headY = center - m.docTop;
      const { len, y, total } = lookup.current;
      let l = 0;
      if (y.length > 1) {
        // The line may start above the column (at the hero marker), so search the whole lookup.
        let idx = -1;
        for (let i = 0; i < y.length; i++) if (y[i] <= headY) idx = i;
        if (idx >= y.length - 1) l = total;
        else if (idx >= 0) {
          const span = y[idx + 1] - y[idx] || 1;
          l = len[idx] + Math.max(0, Math.min(1, (headY - y[idx]) / span)) * (len[idx + 1] - len[idx]);
        }
      }
      if (!reduced) drawn.set(Math.max(0, Math.min(1, l / total)));

      const next = readoutAt(center, scroll, vh, m);
      setReadout((prev) =>
        Math.abs(prev.mile - next.mile) < 0.05 && prev.day === next.day && Math.abs(prev.ft - next.ft) < 5 ? prev : next
      );
      const last = m.anchors[m.anchors.length - 1] ?? 0;
      const show = center < last + vh * 0.45;
      const inRoute = center > (m.anchors[0] ?? 0) && show;
      setStatus((prev) => (prev.show === show && prev.inRoute === inRoute ? prev : { show, inRoute }));
      if (!reduced) {
        let count = 0;
        for (const a of m.anchors) if (center >= a) count++;
        setReached((prev) => (prev === count ? prev : count));
      }
      const night = m.nights.some((n) => headY > n.y0 && headY < n.y1);
      setOnNight((prev) => (prev === night ? prev : night));
    };
    update(window.scrollY);
    return scrollY.on("change", update);
  }, [drawn, m, reduced, scrollY]);

  return (
    <div className="relative" ref={containerRef}>
      {isDesktop ? (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
          height={m.height || 0}
          width={m.width || 0}
        >
          <defs>
            <clipPath id="route-night-clip">
              {m.nights.map((n) => (
                <rect height={n.y1 - n.y0} key={n.y0} width={m.width} x={0} y={n.y0} />
              ))}
            </clipPath>
          </defs>
          <path d={m.path} fill="none" ref={pathRef} stroke="var(--amber)" strokeDasharray="7 9" strokeLinecap="round" strokeOpacity="0.5" strokeWidth="2" />
          <g clipPath="url(#route-night-clip)">
            <path d={m.path} fill="none" stroke="var(--amber-bright)" strokeDasharray="7 9" strokeLinecap="round" strokeOpacity="0.55" strokeWidth="2" />
          </g>
          <motion.path d={m.path} fill="none" stroke="var(--amber)" strokeLinecap="round" strokeWidth="2.5" style={{ pathLength: drawn }} />
          <g clipPath="url(#route-night-clip)">
            <motion.path d={m.path} fill="none" stroke="var(--amber-bright)" strokeLinecap="round" strokeWidth="2.5" style={{ pathLength: drawn }} />
          </g>
          {m.markers.map((p, i) => {
            const lit = i < reached;
            const onNightChapter = m.nights.some((n) => p.y > n.y0 && p.y < n.y1);
            const stroke = onNightChapter ? "var(--amber-bright)" : "var(--amber)";
            const ground = onNightChapter ? "var(--night)" : "var(--paper)";
            const trailsEnd = i === WAYPOINTS.length - 1;
            return (
              <g key={WAYPOINTS[i].id}>
                {trailsEnd ? <circle cx={p.x} cy={p.y} fill="none" r="15" stroke={stroke} strokeOpacity="0.45" strokeWidth="1.5" /> : null}
                <circle cx={p.x} cy={p.y} fill={ground} r={trailsEnd ? 10 : 8} stroke={stroke} strokeWidth="2.5" />
                <motion.circle
                  animate={{ scale: lit ? 1 : 0 }}
                  cx={p.x}
                  cy={p.y}
                  fill={stroke}
                  initial={{ scale: reduced ? 1 : 0 }}
                  r={trailsEnd ? 5.5 : 4.5}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                />
              </g>
            );
          })}
        </svg>
      ) : null}

      <div className="relative z-10">{children}</div>

      {isDesktop ? (
        <TripInstrument heroHeight={m.heroHeight} hero={m.hero} night={onNight} readout={readout} show={status.show} />
      ) : (
        <motion.div
          animate={{ opacity: status.inRoute ? 1 : 0 }}
          aria-hidden="true"
          className="pointer-events-none fixed top-[72px] right-0 left-0 z-20"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div className="h-[3px] origin-left bg-amber" style={{ scaleX: drawn }} />
          <div className="mt-2 flex justify-center">
            <span className="map-label rounded-full border border-line bg-paper/95 px-3 py-1.5 text-ink shadow-sm">
              Day {readout.day}, mile {readout.mile.toFixed(1)}, {readout.pack.toFixed(2)} kg
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/**
 * The fixed instrument layer: the hero-scale profile at the top of the page,
 * folding into the slim rail as the visitor leaves the hero.
 */
const TripInstrument = memo(function TripInstrument({
  hero,
  heroHeight,
  night,
  readout,
  show,
}: {
  hero: Measured["hero"];
  heroHeight: number;
  night: boolean;
  readout: Readout;
  show: boolean;
}) {
  const reduced = useReduced();
  const { scrollY } = useScroll();
  const [scroll, setScroll] = useState(() => (typeof window === "undefined" ? 0 : window.scrollY));
  const [view, setView] = useState({ w: 1440, h: 900 });
  useMotionValueEvent(scrollY, "change", (v) => {
    // Only the hero-to-rail fold needs per-frame updates.
    if (v < heroHeight * 1.2 || scroll < heroHeight * 1.2) setScroll(v);
  });
  useEffect(() => {
    const size = () => setView({ w: window.innerWidth, h: window.innerHeight });
    size();
    window.addEventListener("resize", size);
    return () => window.removeEventListener("resize", size);
  }, []);

  if (!hero) return null;
  const fold = Math.min(1, Math.max(0, scroll / (heroHeight * 0.62)));
  const t = reduced ? (scroll > heroHeight * 0.45 ? 1 : 0) : fold;
  const top = hero.top - scroll;
  const split = hero.height * 0.7;
  const plot = { x0: hero.left + 8, x1: hero.left + hero.width - 8, y0: top + 64, y1: top + split };
  const strip = { x0: plot.x0, x1: plot.x1, y0: top + split + 30, y1: top + hero.height };
  const rail: RailBox = { x0: view.w - 60, width: 40, y0: 124, y1: view.h - 52 };

  return (
    <motion.div
      animate={{ opacity: show ? 1 : 0 }}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-20 ${night && t > 0.9 ? "night !bg-transparent" : ""}`}
      data-instrument-fold={t.toFixed(2)}
      initial={false}
      transition={{ duration: 0.45 }}
    >
      <svg className="h-full w-full overflow-visible" height={view.h} width={view.w}>
        <TripProfile plot={plot} rail={rail} readout={readout} strip={strip} t={t} />
      </svg>
    </motion.div>
  );
});

/** A static copy of the hero profile for phones, drawn in its own view box. */
export function TripProfileStatic() {
  const w = 420;
  const h = 420;
  const plot = { x0: 6, x1: w - 6, y0: 66, y1: h * 0.66 };
  const strip = { x0: 6, x1: w - 6, y0: h * 0.66 + 40, y1: h };
  return (
    <svg aria-label="Sample trip profile: 61.4 mi from North Lake to South Lake over Piute Pass 11,423 ft, Muir Pass 11,955 ft and Bishop Pass 11,972 ft, with pack weight from 9.22 kg on day 1 to 12.03 kg on day 3 after the Muir Trail Ranch resupply and 7.69 kg on day 7." className="h-auto w-full overflow-visible" role="img" viewBox={`0 0 ${w} ${h}`}>
      <TripProfile plot={plot} rail={{ x0: 0, width: 1, y0: 0, y1: 1 }} readout={START} compact strip={strip} t={0} textScale={1.3} />
    </svg>
  );
}

