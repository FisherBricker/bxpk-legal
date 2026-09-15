import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { dayAt, elevationAt, fmtInt, PROFILE } from "@/data/trip";
import { CAPTURE, useIsDesktop, useReduced } from "@/lib/hooks";

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

const END_MILE = 61.4;

/** A marker label on the route line: it labels the route, not the heading below it. */
export function Waypoint({ id }: { id: string }) {
  const wp = WAYPOINTS.find((w) => w.id === id);
  if (!wp) return null;
  return (
    <p
      className="map-label mb-6 text-fg-muted lg:absolute lg:top-1 lg:-left-[136px] lg:mb-0 lg:w-[124px]"
      data-waypoint={id}
    >
      <span className="text-fg">Mile {wp.mile.toFixed(1)}</span>
      <br />
      {wp.name}
      <br />
      {fmtInt(wp.ft)} ft
    </p>
  );
}

interface Point {
  x: number;
  y: number;
}

function knots(width: number, ys: number[], gutter: number, amp: number): Point[] {
  const pts: Point[] = [{ x: width * 0.5, y: 0 }];
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
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

interface Measured {
  width: number;
  height: number;
  path: string;
  markers: Point[];
  ys: number[];
  nights: Array<{ y0: number; y1: number }>;
  docTop: number;
}

const EMPTY: Measured = { width: 0, height: 0, path: "", markers: [], ys: [], nights: [], docTop: 0 };

/** Elevation profile drawn as a vertical strip: mile 0 at top, 61.4 mi at the bottom. */
function profileStripPath(w: number, h: number): string {
  const minFt = 7400;
  const maxFt = 12200;
  const x = (ft: number) => 8 + ((ft - minFt) / (maxFt - minFt)) * (w - 16);
  return PROFILE.map(([mi, ft], i) => `${i === 0 ? "M" : "L"} ${x(ft).toFixed(1)} ${((mi / END_MILE) * h).toFixed(1)}`).join(" ");
}

export function RouteLine({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  // Reduced motion (and review captures) get the route fully walked and every marker lit.
  const reduced = useReduced() || CAPTURE;
  const [m, setM] = useState<Measured>(EMPTY);
  const [reached, setReached] = useState(reduced ? WAYPOINTS.length : 0);
  const [railH, setRailH] = useState(0);
  const [onNight, setOnNight] = useState(false);
  const [rail, setRail] = useState({ mile: 0, ft: 9360, day: 1, pack: 9.22, show: false, inRoute: false });
  const drawn = useMotionValue(reduced ? 1 : 0);
  const mileMV = useMotionValue(0);
  const smoothMile = useSpring(mileMV, { stiffness: 140, damping: 26, mass: 0.6 });
  const { scrollY } = useScroll();
  const lookup = useRef<{ len: number[]; y: number[]; total: number }>({ len: [], y: [], total: 1 });

  // Measure the column, the waypoint anchors and the night chapters, then lay out the line.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      const top = box.top + window.scrollY;
      const anchors = WAYPOINTS.map((wp) => {
        const node = el.querySelector(`[data-waypoint="${wp.id}"]`);
        if (!node) return 0;
        const r = node.getBoundingClientRect();
        return r.top + window.scrollY - top + Math.min(r.height, 28) / 2;
      });
      const nights = Array.from(el.querySelectorAll("[data-night]")).map((node) => {
        const r = node.getBoundingClientRect();
        return { y0: r.top + window.scrollY - top, y1: r.bottom + window.scrollY - top };
      });
      const width = box.width;
      // The line lives in the content column's left gutter, not the window's.
      const columnLeft = Math.max(0, (width - 1440) / 2);
      const gutter = width >= 880 ? columnLeft + 64 : 14;
      const amp = width >= 880 ? 30 : 6;
      const pts = knots(width, anchors, gutter, amp);
      setM({
        width,
        height: box.height,
        path: smoothPath(pts),
        markers: anchors.map((y) => ({ x: gutter, y })),
        ys: anchors,
        nights,
        docTop: top,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("load", measure);
    const t = window.setTimeout(measure, 600);
    return () => {
      ro.disconnect();
      window.removeEventListener("load", measure);
      window.clearTimeout(t);
    };
  }, []);

  // Build the length-by-y lookup so the drawn head lines up with the scroll position.
  useEffect(() => {
    const path = pathRef.current;
    if (!path || !m.path) return;
    const total = path.getTotalLength();
    const samples = 500;
    const len: number[] = [];
    const y: number[] = [];
    for (let i = 0; i <= samples; i++) {
      const l = (total * i) / samples;
      const p = path.getPointAtLength(l);
      len.push(l);
      y.push(p.y);
    }
    lookup.current = { len, y, total: total || 1 };
  }, [m.path]);

  useEffect(() => {
    if (!m.height) return;
    const railTrack = railRef.current;
    const update = (scroll: number) => {
      const headY = scroll + window.innerHeight * 0.58 - m.docTop;
      const { len, y, total } = lookup.current;
      let l = 0;
      if (y.length > 1) {
        if (headY <= y[0]) l = 0;
        else if (headY >= y[y.length - 1]) l = total;
        else {
          let lo = 0;
          let hi = y.length - 1;
          while (hi - lo > 1) {
            const mid = (lo + hi) >> 1;
            if (y[mid] <= headY) lo = mid;
            else hi = mid;
          }
          const span = y[hi] - y[lo] || 1;
          l = len[lo] + ((headY - y[lo]) / span) * (len[hi] - len[lo]);
        }
      }
      if (!reduced) drawn.set(Math.max(0, Math.min(1, l / total)));

      // Mile from the drawn head, interpolated between waypoint anchors.
      let mile = 0;
      if (m.ys.length) {
        if (headY <= m.ys[0]) mile = 0;
        else if (headY >= m.ys[m.ys.length - 1]) mile = END_MILE;
        else {
          for (let i = 1; i < m.ys.length; i++) {
            if (headY <= m.ys[i]) {
              const t = (headY - m.ys[i - 1]) / (m.ys[i] - m.ys[i - 1] || 1);
              mile = WAYPOINTS[i - 1].mile + t * (WAYPOINTS[i].mile - WAYPOINTS[i - 1].mile);
              break;
            }
          }
        }
      }
      mileMV.set(mile);
      const day = dayAt(mile);
      // Visible from the trailhead (the hero) until the trail ends.
      const show = headY < m.height + 120;
      // The mobile progress line and pill only appear once the visitor is on the route itself.
      const inRoute = headY > (m.ys[0] ?? 0) && show;
      setRail((prev) => {
        const next = { mile, ft: elevationAt(mile), day: day.day, pack: day.pack, show, inRoute };
        return Math.abs(next.mile - prev.mile) < 0.05 && next.show === prev.show && next.inRoute === prev.inRoute
          ? prev
          : next;
      });
      if (!reduced) {
        let count = 0;
        for (const wy of m.ys) if (headY >= wy) count++;
        setReached((prev) => (prev === count ? prev : count));
      }
      const center = scroll + window.innerHeight * (railTrack ? 0.5 : 0.5) - m.docTop;
      const night = m.nights.some((n) => center > n.y0 && center < n.y1);
      setOnNight((prev) => (prev === night ? prev : night));
    };
    update(window.scrollY);
    const unsubscribe = scrollY.on("change", update);
    return unsubscribe;
  }, [drawn, m, mileMV, reduced, scrollY]);

  useLayoutEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setRailH(el.clientHeight));
    ro.observe(el);
    setRailH(el.clientHeight);
    return () => ro.disconnect();
  }, [isDesktop]);

  const dotY = useTransform(smoothMile, (mile) => (mile / END_MILE) * railH);
  // The readout follows the dot but stays inside the rail, clear of the scale labels.
  const labelY = useTransform(dotY, (y) => Math.min(Math.max(y - 30, 24), Math.max(24, railH - 96)));
  const railOpacity = rail.show ? 1 : 0;
  const barScale = useTransform(drawn, (v) => v);


  return (
    <div className="relative" ref={containerRef}>
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
        {/* Unwalked route: dashed */}
        <path d={m.path} fill="none" ref={pathRef} stroke="var(--amber)" strokeDasharray="7 9" strokeLinecap="round" strokeOpacity="0.5" strokeWidth="2" />
        <g clipPath="url(#route-night-clip)">
          <path d={m.path} fill="none" stroke="var(--amber-bright)" strokeDasharray="7 9" strokeLinecap="round" strokeOpacity="0.55" strokeWidth="2" />
        </g>
        {/* Walked route: solid, drawn by scroll */}
        <motion.path
          d={m.path}
          fill="none"
          stroke="var(--amber)"
          strokeLinecap="round"
          strokeWidth="2.5"
          style={{ pathLength: drawn }}
        />
        <g clipPath="url(#route-night-clip)">
          <motion.path
            d={m.path}
            fill="none"
            stroke="var(--amber-bright)"
            strokeLinecap="round"
            strokeWidth="2.5"
            style={{ pathLength: drawn }}
          />
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

      <div className="relative z-10">{children}</div>

      {/* Desktop: the pinned elevation and pack-weight rail */}
      {isDesktop ? (
        <motion.div
          animate={{ opacity: railOpacity }}
          aria-hidden="true"
          className={`fixed top-24 right-4 bottom-6 z-20 hidden w-[132px] lg:block ${onNight ? "night" : ""}`}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="relative h-full" ref={railRef}>
            <div className="absolute top-0 right-0 bottom-0 w-[56px]">
              <svg className="h-full w-full overflow-visible" fill="none" height={railH} width={56}>
                <line stroke="var(--rule)" strokeWidth="1" x1="4" x2="4" y1="0" y2={railH} />
                <path d={profileStripPath(56, railH)} stroke="var(--data)" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
            <motion.div className="absolute top-0 right-0 left-0" style={{ y: dotY }}>
              <span className="absolute top-[-5px] right-[6px] block h-2.5 w-2.5 rounded-full bg-route ring-3 ring-[var(--ground)]" />
              <span className="absolute top-[-1px] right-[16px] block h-px w-[46px] bg-route/60" />
            </motion.div>
            <motion.div className="absolute top-0 right-[62px] w-[70px] text-right" style={{ y: labelY }}>
              <div className="map-label text-fg">Mile {rail.mile.toFixed(1)}</div>
              <div className="map-label text-fg-muted">{fmtInt(rail.ft)} ft</div>
              <div className="mt-1.5 text-[0.8125rem] leading-tight font-bold text-fg tnum">
                Day {rail.day}
                <br />
                {rail.pack.toFixed(2)} kg
              </div>
            </motion.div>
            <span className="map-label absolute top-0 right-[6px] text-fg-muted">0 mi</span>
            <span className="map-label absolute right-[6px] bottom-0 text-fg-muted">61.4 mi</span>
          </div>
        </motion.div>
      ) : null}

      {/* Mobile: a slim progress line under the nav and a compact pill */}
      {!isDesktop ? (
        <motion.div
          animate={{ opacity: rail.inRoute ? 1 : 0 }}
          aria-hidden="true"
          className="pointer-events-none fixed top-[72px] right-0 left-0 z-20 lg:hidden"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div className="h-[3px] origin-left bg-amber" style={{ scaleX: barScale }} />
          <div className="mt-2 flex justify-center">
            <span className="map-label rounded-full border border-line bg-paper/95 px-3 py-1.5 text-ink shadow-sm">
              Day {rail.day}, mile {rail.mile.toFixed(1)}, {rail.pack.toFixed(2)} kg
            </span>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
