import { motion } from "motion/react";
import { ContourPaths } from "@/components/kokonutui/background-paths";
import { ContourDotBand } from "@/components/kokonutui/mouse-effect-card";
import { Mark, Wordmark } from "@/components/mark";
import { PhonePreview } from "@/components/phone-screens";
import { SignupForm } from "@/components/signup-form";
import { EASE_EXPO } from "@/lib/hooks";

const SUMMARY: [string, string][] = [
  ["Walked", "7 days, 61.4 mi"],
  ["At trail's end", "7.69 kg"],
  ["Picked up at Muir Trail Ranch", "4.73 kg"],
];

/** The sample trip, closed out: the route line arriving at its amber end marker, a map tag and the Base weight screen. */
function TrailsEnd() {
  return (
    <motion.div
      className="relative mx-auto w-full max-w-[30rem]"
      initial={{ opacity: 0.2, x: 40 }}
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
        <div className="panel relative z-10 w-full max-w-[17rem] px-5 py-4 sm:mt-24">
          <p className="map-label text-fg">Trail&rsquo;s end</p>
          <p className="mt-1 font-display text-2xl leading-tight font-medium">South Lake</p>
          <p className="map-label mt-1 text-fg-muted">Mile 61.4, 9,768 ft</p>
          <dl className="mt-4 space-y-2.5 border-t border-rule pt-3">
            {SUMMARY.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-fg-muted">{label}</dt>
                <dd className="font-display text-lg font-medium tnum">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="hidden shrink-0 sm:block sm:-ml-10">
          <PhonePreview id="base" width={210} />
        </div>
      </div>
    </motion.div>
  );
}

export function Close() {
  return (
    <section aria-labelledby="close-heading" className="night bg-night text-night-ink">
      <ContourDotBand>
        <div className="mx-auto grid w-full max-w-[82rem] items-center gap-16 px-5 py-28 sm:px-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:py-36">
          <motion.div
            className="max-w-[48rem]"
            initial={{ opacity: 0.2, scale: 0.97 }}
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
          <TrailsEnd />
        </div>
      </ContourDotBand>
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
        <ContourPaths className="opacity-100" count={7} drawIn seed={15} shape="ridge" stroke="rgba(95,112,64,0.3)" />
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
      <div className="mx-auto w-full max-w-[82rem] border-t border-line px-5 py-5 sm:px-10">
        <p className="text-sm text-ink-muted">Sample trip, posts and releases shown on this page are illustrations.</p>
      </div>
    </footer>
  );
}
