import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SmoothTab } from "@/components/kokonutui/smooth-tab";
import { RouteColumn, RouteSection } from "@/components/layout";
import { Phone } from "@/components/phone";
import { PhonePreview, PhoneScreen, SCREEN_LABEL, type ScreenId } from "@/components/phone-screens";
import { Waypoint } from "@/components/route";
import { EASE_EXPO, useIsDesktop, useReduced } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface Chapter {
  id: string;
  name: string;
  title: string;
  body: string;
  screen: ScreenId;
  stats: [string, string][];
}

const CHAPTERS: Chapter[] = [
  {
    id: "plan",
    name: "Plan",
    title: "Map the days.",
    body: "Enter miles and elevation gain for each day, or import a GPX track. Water per day comes with it, and a NOAA forecast arrives for every trip day in the US.",
    screen: "itinerary",
    stats: [
      ["Day 3", "8.9 mi, 1,880 ft, 2.5 L"],
      ["Day 1 forecast", "Clear, 71°F / 39°F"],
    ],
  },
  {
    id: "pack",
    name: "Pack",
    title: "Load the pack.",
    body: "Pick a saved pack or add items one at a time. Base weight shows up with the first item, and worn, consumable and skin-out weights follow as you go.",
    screen: "trip",
    stats: [
      ["Base weight", "4.62 kg"],
      ["Skin-out, day 1", "10.40 kg"],
    ],
  },
  {
    id: "walk",
    name: "Walk",
    title: "Record the route.",
    body: "Record your route with GPS on the trail, at every fix or every 15 s, 30 s or 60 s to save battery, and export it as GPX.",
    screen: "route",
    stats: [
      ["GPS interval", "Every 15 s"],
      ["Track", "61.4 mi, as GPX"],
    ],
  },
  {
    id: "share",
    name: "Share",
    title: "Debrief and share.",
    body: "Back home, finalize the trip. Your base weight joins your profile's trend, and you can post the loadout to the community.",
    screen: "base",
    stats: [
      ["Base weight", "4.62 kg"],
      ["To your goal", "0.62 kg"],
    ],
  },
];

function Caption({ chapter, index }: { chapter: Chapter; index: number }) {
  return (
    <div className="max-w-[34rem]" data-chapter={index + 1}>
      <h3 className="font-display text-[clamp(2.25rem,1.3rem+2.2vw,3.75rem)] leading-[1.02] font-medium">
        {chapter.title}
      </h3>
      <p className="mt-5 text-lg leading-relaxed text-fg-muted">{chapter.body}</p>
      <dl className="mt-7 grid gap-3 sm:grid-cols-2">
        {chapter.stats.map(([label, value], i) => (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-rule bg-card px-4 py-3"
            initial={{ opacity: 0.2, y: 16 }}
            key={label}
            transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: EASE_EXPO }}
          >
            <dt className="map-label text-fg-muted">{label}</dt>
            <dd className="mt-1 font-display text-xl font-medium tnum">{value}</dd>
          </motion.div>
        ))}
      </dl>
    </div>
  );
}

function PinnedWalkthrough() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [phoneWidth, setPhoneWidth] = useState(270);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const next = Math.min(3, Math.max(0, Math.floor(progress * 4)));
    setActive((previous) => (previous === next ? previous : next));
  });

  useEffect(() => {
    const size = () => setPhoneWidth(Math.round(Math.max(210, Math.min(290, (window.innerHeight - 330) / 2.11))));
    size();
    window.addEventListener("resize", size);
    return () => window.removeEventListener("resize", size);
  }, []);

  const jump = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const travel = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + travel * ((index + 0.5) / 4), behavior: "smooth" });
  };

  const chapter = CHAPTERS[active];
  const phoneLeft = active % 2 === 0;

  return (
    <div className="relative" ref={sectionRef} style={{ height: "400vh" }}>
      <RouteColumn className="absolute top-24 right-0 left-0">
        <Waypoint id="guide" />
      </RouteColumn>
      <div className="sticky top-0 flex h-screen flex-col">
        <RouteColumn className="flex w-full flex-1 flex-col pt-24 pb-6">
          <h2 className="display-2 max-w-[20ch]" id="guide-heading">
            Plan a trip, start to finish
          </h2>
          <div className={cn("relative mt-4 flex flex-1 items-center gap-12", phoneLeft ? "flex-row" : "flex-row-reverse")}>
            <motion.div layout className="shrink-0" transition={{ type: "spring", stiffness: 90, damping: 20 }}>
              <Phone label={SCREEN_LABEL[chapter.screen]} width={phoneWidth}>
                <div className="relative h-full">
                  <AnimatePresence initial={false}>
                    <motion.div
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                      key={chapter.screen}
                      transition={{ duration: 0.5, ease: EASE_EXPO }}
                    >
                      <PhoneScreen id={chapter.screen} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </Phone>
            </motion.div>
            <div className="relative min-w-0 flex-1">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: phoneLeft ? -24 : 24 }}
                  initial={{ opacity: 0.2, x: phoneLeft ? 64 : -64 }}
                  key={chapter.id}
                  transition={{ duration: 0.6, ease: EASE_EXPO }}
                >
                  <Caption chapter={chapter} index={active} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <nav aria-label="Trail guide chapters" className="mt-4 flex justify-center">
            <ol className="m-0 flex list-none gap-1 rounded-full border border-rule bg-card p-1">
              {CHAPTERS.map((item, index) => (
                <li key={item.id}>
                  <button
                    aria-current={index === active ? "step" : undefined}
                    className={cn(
                      "relative min-h-11 rounded-full px-5 text-sm font-bold transition-colors",
                      index === active ? "text-ground" : "text-fg-muted hover:text-fg"
                    )}
                    onClick={() => jump(index)}
                    type="button"
                  >
                    {index === active ? (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-data"
                        layoutId="guide-chapter"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    <span className="relative">{item.name}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </RouteColumn>
      </div>
    </div>
  );
}

function StaticWalkthrough() {
  return (
    <RouteColumn className="py-24">
      <Waypoint id="guide" />
      <h2 className="display-2 max-w-[20ch]" id="guide-heading">
        Plan a trip, start to finish
      </h2>
      <ol className="m-0 mt-12 list-none space-y-16 p-0">
        {CHAPTERS.map((chapter, index) => (
          <li
            className={cn("flex flex-col items-center gap-10 md:flex-row", index % 2 === 1 && "md:flex-row-reverse")}
            key={chapter.id}
          >
            <PhonePreview id={chapter.screen} width={250} />
            <Caption chapter={chapter} index={index} />
          </li>
        ))}
      </ol>
    </RouteColumn>
  );
}

function TabbedWalkthrough() {
  return (
    <RouteColumn className="py-20">
      <Waypoint id="guide" />
      <h2 className="display-2" id="guide-heading">
        Plan a trip, start to finish
      </h2>
      <SmoothTab
        className="mt-8"
        items={CHAPTERS.map((chapter, index) => ({
          id: chapter.id,
          title: chapter.name,
          content: (
            <div className="flex flex-col items-center gap-6">
              <Caption chapter={chapter} index={index} />
              <PhonePreview id={chapter.screen} width={240} />
            </div>
          ),
        }))}
        label="Trail guide chapters"
      />
    </RouteColumn>
  );
}

export function Walkthrough() {
  const isDesktop = useIsDesktop();
  const reduced = useReduced();
  return (
    <RouteSection ground="night" id="guide" labelledBy="guide-heading" nav="guide">
      {!isDesktop ? <TabbedWalkthrough /> : reduced ? <StaticWalkthrough /> : <PinnedWalkthrough />}
    </RouteSection>
  );
}
