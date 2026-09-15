import { motion, stagger } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { SignupForm } from "@/components/signup-form";
import { TopoField } from "@/components/topo-field";
import { EASE_EXPO, useReduced } from "@/lib/hooks";

const HEADLINE = "Know what your pack weighs, every day of the trip.";

function WordReveal({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <motion.h1
      animate="show"
      aria-label={text}
      className="display-1 max-w-[13.5ch]"
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

export function Trailhead() {
  const copyRef = useRef<HTMLDivElement>(null);
  const reduced = useReduced();

  return (
    <section
      aria-labelledby="trailhead-heading"
      className="relative isolate min-h-[100svh] overflow-hidden bg-map"
      data-nav="route"
      id="trailhead"
    >
      <TopoField quietRef={copyRef} />
      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[90rem] flex-col justify-center px-5 pt-32 pb-40 sm:px-10 lg:pr-[190px]">
        <div className="max-w-[46rem]" ref={copyRef}>
          <span className="sr-only" id="trailhead-heading">
            {HEADLINE}
          </span>
          <WordReveal text={HEADLINE} />
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="lead mt-6"
            initial={{ opacity: 0.35, y: 14 }}
            transition={{ duration: 0.9, delay: 0.35, ease: EASE_EXPO }}
          >
            Backpack Weight Tracker keeps your gear list in grams, then carries it through the whole trip:
            base weight, food, water and fuel for each day, resupply stops, and the gear your group splits.
          </motion.p>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0.35, y: 14 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE_EXPO }}
          >
            <SignupForm className="mt-8" idPrefix="hero" />
            <p className="mt-4 text-sm text-ink-muted">
              Coming soon to the App Store, for iPhone on iOS 17 and later
            </p>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute right-0 bottom-7 left-0 flex flex-col items-center gap-3">
        <div className="pointer-events-auto flex flex-col items-center gap-2">
          <span className="map-label flex items-center gap-2 rounded-full border border-amber/40 bg-map/85 px-3 py-1.5 text-ink">
            <span className="relative flex h-3 w-3">
              {reduced ? null : (
                <motion.span
                  animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                  className="absolute inset-0 rounded-full bg-amber"
                  transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
                />
              )}
              <span className="relative h-3 w-3 rounded-full bg-amber" />
            </span>
            Trailhead, mile 0, 9,360 ft
          </span>
          <a
            className="flex min-h-11 items-center gap-1.5 text-sm font-bold text-ink no-underline"
            href="#route"
          >
            Walk the route
            <ChevronDown aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
