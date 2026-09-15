/**
 * Adapted from KokonutUI "Carousel Cards" (MIT, kokonutui.com).
 * Kept: a horizontal rail of fixed-width cards with previous and next arrow
 * buttons, and native scroll-snap on small screens. Changed: the Airbnb-style
 * experiences with photos, prices and star ratings are gone (the page makes no
 * rating or price claims); on desktop the rail is a motion drag track that
 * snaps to whole cards with momentum; arrow keys move it when it has focus;
 * arrows disable at either end; everything is in Topo tokens.
 */

import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useIsDesktop } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const GAP = 20;

interface DragRailProps {
  label: string;
  cardWidth: number;
  children: ReactNode[];
  className?: string;
}

export function DragRail({ label, cardWidth, children, className }: DragRailProps) {
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion() ?? false;
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [minX, setMinX] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });
  const step = cardWidth + GAP;

  useEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;
      setMinX(Math.min(0, viewport.clientWidth - track.scrollWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [isDesktop, children.length]);

  useMotionValueEvent(x, "change", (value) => {
    setEdges({ start: value > -4, end: value < minX + 4 });
  });

  useEffect(() => {
    setEdges({ start: x.get() > -4, end: x.get() < minX + 4 });
  }, [minX, x]);

  const go = useCallback(
    (direction: 1 | -1) => {
      if (isDesktop) {
        const target = Math.max(minX, Math.min(0, Math.round(x.get() / step) * step - direction * step));
        animate(x, target, reduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 34 });
      } else {
        const viewport = viewportRef.current;
        viewport?.scrollBy({ left: direction * step, behavior: reduced ? "auto" : "smooth" });
      }
    },
    [isDesktop, minX, reduced, step, x]
  );

  const onScroll = () => {
    const viewport = viewportRef.current;
    if (!viewport || isDesktop) return;
    setEdges({
      start: viewport.scrollLeft < 4,
      end: viewport.scrollLeft + viewport.clientWidth > viewport.scrollWidth - 4,
    });
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  };

  const arrow = "flex h-11 w-11 items-center justify-center rounded-full border border-rule bg-card text-fg transition-opacity disabled:opacity-35";

  return (
    <div className={className}>
      <div className="mb-5 flex items-center justify-end gap-2">
        <button aria-label="Previous posts" className={arrow} disabled={edges.start} onClick={() => go(-1)} type="button">
          <ChevronLeft aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <button aria-label="Next posts" className={arrow} disabled={edges.end} onClick={() => go(1)} type="button">
          <ChevronRight aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </div>
      <section
        aria-label={label}
        aria-roledescription="carousel"
        className={cn(
          "no-scrollbar -mx-2 rounded-2xl px-2 py-2",
          isDesktop ? "cursor-grab overflow-hidden active:cursor-grabbing" : "snap-x snap-mandatory overflow-x-auto"
        )}
        onKeyDown={onKeyDown}
        onScroll={onScroll}
        ref={viewportRef}
        tabIndex={0}
      >
        <motion.div
          className="flex w-max"
          drag={isDesktop ? "x" : false}
          dragConstraints={{ left: minX, right: 0 }}
          dragElastic={0.08}
          dragTransition={{
            power: 0.25,
            timeConstant: 220,
            modifyTarget: (target) => Math.max(minX, Math.min(0, Math.round(target / step) * step)),
          }}
          ref={trackRef}
          style={{ x: isDesktop ? x : 0, gap: GAP }}
        >
          {children.map((child, index) => (
            <div
              aria-label={`${index + 1} of ${children.length}`}
              aria-roledescription="slide"
              className="shrink-0 snap-start"
              key={index}
              role="group"
              style={{ width: cardWidth }}
            >
              {child}
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}

export default DragRail;
