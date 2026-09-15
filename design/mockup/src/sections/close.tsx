import { motion } from "motion/react";
import { useMemo, useRef } from "react";
import { ContourPaths } from "@/components/kokonutui/background-paths";
import { Mark, Wordmark } from "@/components/mark";
import { PhonePreview } from "@/components/phone-screens";
import { SignupForm } from "@/components/signup-form";
import { DAYS, formatWeight, RESUPPLY } from "@/data/trip";
import { TopoField } from "@/components/topo-field";
import { EASE_EXPO } from "@/lib/hooks";

const SUMMARY: [string, string][] = [
  ["7 days, 61.4 mi", "walked"],
  [formatWeight(DAYS[6].packG), "at trail's end"],
  [formatWeight(RESUPPLY.pickupG), "picked up at Muir Trail Ranch"],
];

/** The sample trip, closed out: the route line arriving at its amber end marker, a map tag and the Base weight screen. */
function TrailsEnd({ tagRef }: { tagRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <motion.div
      className="relative mx-auto w-full max-w-[30rem]"
      initial={{ opacity: 0.2, x: 40 }}
      ref={tagRef}
      transition={{ duration: 1.1, ease: EASE_EXPO }}
      viewport={{ once: true, amount: 0.3 }}
      whileInView={{ opacity: 1, x: 0 }}
    >
      <svg aria-hidden="true" className="absolute top-0 left-0 h-[220px] w-[260px] overflow-visible" fill="none" viewBox="0 0 260 220">
        <path d="M-40 -60 C 30 -10, 10 60, 70 90 S 150 120, 150 188" stroke="var(--amber-bright)" strokeLinecap="round" strokeWidth="2.5" />
        <circle cx="150" cy="196" r="17" stroke="var(--amber-bright)" strokeOpacity="0.45" strokeWidth="1.5" />
        <circle cx="150" cy="196" fill="var(--night)" r="11" stroke="var(--amber-bright)" strokeWidth="2.5" />
        <circle cx="150" cy="196" fill="var(--amber-bright)" r="6" />
      </svg>
      <div className="relative flex items-start gap-6 pt-[228px] sm:pt-40">
        <div className="panel relative z-10 w-full max-w-[18rem] px-5 py-4 sm:mt-24">
          <p className="leading-snug">
            <span className="font-display text-2xl font-medium">South Lake</span>{" "}
            <span className="text-sm text-fg-muted">trail&rsquo;s end, <span className="whitespace-nowrap">mile 61.4</span>, <span className="whitespace-nowrap">9,768 ft</span></span>
          </p>
          <ul className="mt-4 space-y-1.5 border-t border-rule pt-3 text-[0.9375rem]">
            {SUMMARY.map(([value, label]) => (
              <li key={label}>
                <span className="font-bold tnum">{value}</span> <span className="text-fg-muted">{label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden shrink-0 sm:block sm:-ml-10">
          <PhonePreview id="base" width={210} />
        </div>
      </div>
    </motion.div>
  );
}

export function Close() {
  const copyRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const quietRefs = useMemo(() => [copyRef, tagRef], []);
  return (
    <section aria-labelledby="close-heading" className="night relative isolate overflow-hidden bg-night text-night-ink">
      {/* The page ends inside the map: the same isoline field, at night, bending from the cursor. */}
      <TopoField quietRefs={quietRefs} seed={61420} tone="night" />
      <div className="relative mx-auto grid w-full max-w-[82rem] items-center gap-16 px-5 py-28 sm:px-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:py-36">
        <motion.div
          className="max-w-[48rem]"
          initial={{ opacity: 0.2, scale: 0.97 }}
          ref={copyRef}
          transition={{ duration: 1.1, ease: EASE_EXPO }}
          viewport={{ once: true, amount: 0.35 }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <Mark className="h-14 w-14" />
          <h2 className="display-1 mt-8 max-w-[14ch]" id="close-heading">
            Weigh it at home. Carry it with confidence.
          </h2>
          <p className="lead mt-6">Backpack Weight Tracker for iPhone, offered in the United States and Canada.</p>
          <SignupForm className="mt-10" idPrefix="close" tone="night" />
          <p className="mt-4 text-sm text-fg-muted">Coming soon to the App Store</p>
        </motion.div>
        <TrailsEnd tagRef={tagRef} />
      </div>
    </section>
  );
}

const FOOTER_LINKS = [
  { name: "Route", href: "#route" },
  { name: "Trail guide", href: "#guide" },
  { name: "Community", href: "#community" },
  { name: "Releases", href: "#releases" },
  { name: "News", href: "#news" },
  { name: "Privacy", href: "#privacy" },
  { name: "Terms", href: "#terms" },
  { name: "Support", href: "#support" },
];

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-paper text-ink" data-nav="support" id="support">
      <div aria-hidden="true" className="relative h-40 sm:h-52">
        <ContourPaths drawIn ringStep={16} seed={15} stroke="rgba(95,112,64,0.3)" />
      </div>
      <div className="mx-auto flex w-full max-w-[82rem] flex-col gap-10 px-5 pb-12 sm:px-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-[26rem]">
          <a className="inline-flex min-h-11 items-center gap-2 no-underline" href="#trailhead">
            <Mark className="h-8 w-8" />
            <Wordmark />
            <span className="sr-only">Back to the top</span>
          </a>
          <p className="mt-3 text-sm text-ink-muted">
            Backpack Weight Tracker. Operated by Fisher Bricker. Forecasts from the US National Weather Service.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="m-0 grid list-none grid-cols-2 gap-x-6 p-0 sm:grid-cols-4">
            {FOOTER_LINKS.map((link) => (
              <li key={link.name}>
                <a className="flex min-h-11 items-center font-semibold no-underline hover:underline" href={link.href}>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto flex w-full max-w-[82rem] flex-col gap-4 border-t border-line px-5 py-5 sm:px-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-ink-muted">
          <span className="map-label">bxpk quadrangle · North Lake to South Lake · Sample trip</span>
          <span className="flex items-center gap-2 text-xs tnum">
            <svg aria-hidden="true" className="h-2.5 w-[120px]" viewBox="0 0 120 10">
              {[0, 1, 2, 3, 4].map((i) => (
                <rect fill={i % 2 ? "transparent" : "var(--ink-muted)"} height="4" key={i} stroke="var(--ink-muted)" strokeWidth="0.75" width="24" x={i * 24} y="3" />
              ))}
            </svg>
            <span>0 to 5 mi</span>
          </span>
          <span className="text-xs">Contour interval 200 ft</span>
        </div>
        <p className="text-sm text-ink-muted">Sample trip, posts and releases shown on this page are illustrations.</p>
      </div>
    </footer>
  );
}
