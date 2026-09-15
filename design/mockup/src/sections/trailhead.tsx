import { motion, stagger } from "motion/react";
import { useMemo, useRef } from "react";
import { TripProfileStatic } from "@/components/route";
import { SignupForm } from "@/components/signup-form";
import { TopoField } from "@/components/topo-field";
import { EASE_EXPO, useMedia, useReduced } from "@/lib/hooks";

const HEADLINE = "Know what your pack weighs, every day of the trip.";

function WordReveal({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <motion.h1
      animate="show"
      aria-label={text}
      className="display-1 max-w-[13.5ch] lg:text-[min(clamp(3rem,1.2rem+5.4vw,6rem),9.6svh)]"
      initial="hidden"
      transition={{ delayChildren: stagger(0.045) }}
    >
      {words.map((word, index) => (
        <span aria-hidden="true" className="inline-block overflow-hidden pb-[0.06em] align-bottom" key={`${word}-${index}`}>
          <motion.span
            className="inline-block"
            transition={{ duration: 0.9, ease: EASE_EXPO }}
            variants={{ hidden: { y: "108%" }, show: { y: 0 } }}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}

function TrailheadMarker() {
  const reduced = useReduced();
  return (
    <div className="flex min-h-11 flex-wrap items-center gap-x-4 gap-y-1">
      <span className="map-label flex items-center gap-2.5 text-ink">
        <span className="relative flex h-3.5 w-3.5" data-trailhead-dot="">
          {reduced ? null : (
            <motion.span
              animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
              className="absolute inset-0 rounded-full bg-amber"
              transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
            />
          )}
          <span className="relative h-3.5 w-3.5 rounded-full bg-amber" />
        </span>
        Trailhead, mile 0, 9,360 ft
      </span>
    </div>
  );
}

export function Trailhead() {
  const copyRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const quietRefs = useMemo(() => [copyRef, profileRef], []);
  const wide = useMedia("(min-width: 1024px)", true);

  return (
    <section
      aria-labelledby="trailhead-heading"
      className="relative isolate min-h-[100svh] overflow-hidden bg-map"
      data-nav="route"
      id="trailhead"
    >
      <TopoField quietRefs={quietRefs} />
      <div className="relative mx-auto grid min-h-[100svh] w-full max-w-[90rem] items-center gap-10 px-5 pt-28 pb-12 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12 lg:pt-24 lg:pb-8">
        <div className="max-w-[46rem]" ref={copyRef}>
          <span className="sr-only" id="trailhead-heading">
            {HEADLINE}
          </span>
          <WordReveal text={HEADLINE} />
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="lead mt-5 lg:text-[1.125rem]"
            initial={{ opacity: 0.35, y: 14 }}
            transition={{ duration: 0.9, delay: 0.35, ease: EASE_EXPO }}
          >
            Backpack Weight Tracker keeps your gear list down to the last ounce, then carries it through the whole trip:
            base weight, food, water and fuel for each day, resupply stops, and the gear your group splits.
          </motion.p>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            id="hero-signup"
            initial={{ opacity: 0.35, y: 14 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE_EXPO }}
          >
            <SignupForm className="mt-6" idPrefix="hero" />
            <p className="mt-3 text-sm text-ink-muted">Coming soon to the App Store, for iPhone on iOS 17 and later</p>
          </motion.div>
        </div>

        <div className="flex flex-col gap-3">
          {wide ? (
            // The fixed trip instrument draws the profile over this space and folds it into the rail on scroll.
            <div className="h-[clamp(380px,calc(100svh-250px),580px)] w-full" data-hero-profile="" ref={profileRef} />
          ) : (
            <div className="w-full" ref={profileRef}>
              <TripProfileStatic />
            </div>
          )}
          <TrailheadMarker />
        </div>
      </div>
    </section>
  );
}
