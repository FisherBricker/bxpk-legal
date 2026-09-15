/**
 * Adapted from KokonutUI "Smooth Tab" (MIT, kokonutui.com).
 * Kept: the spring-driven indicator that slides under the selected tab and the
 * directional AnimatePresence swap of the panel. Changed: blue, purple and
 * emerald tab colors and the blurred waveform card are gone; the indicator is
 * moss, the panel holds real content, the toolbar is full width, arrow keys
 * move between tabs as the ARIA tabs pattern expects, and the blur filter is
 * dropped from the transition.
 */

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface SmoothTabItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface SmoothTabProps {
  items: SmoothTabItem[];
  label: string;
  className?: string;
}

const slide = {
  enter: (direction: number) => ({ x: direction > 0 ? "40%" : "-40%", opacity: 0.2 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? "40%" : "-40%", opacity: 0 }),
};

export function SmoothTab({ items, label, className }: SmoothTabProps) {
  const [selected, setSelected] = React.useState(items[0].id);
  const [direction, setDirection] = React.useState(0);
  const [indicator, setIndicator] = React.useState({ width: 0, left: 0 });
  const buttons = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const listRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const baseId = React.useId();

  React.useLayoutEffect(() => {
    const update = () => {
      const button = buttons.current.get(selected);
      const list = listRef.current;
      if (!button || !list) return;
      const b = button.getBoundingClientRect();
      const l = list.getBoundingClientRect();
      setIndicator({ width: b.width, left: b.left - l.left });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [selected]);

  const select = (id: string, focus = false) => {
    const from = items.findIndex((item) => item.id === selected);
    const to = items.findIndex((item) => item.id === id);
    setDirection(to > from ? 1 : -1);
    setSelected(id);
    if (focus) buttons.current.get(id)?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const index = items.findIndex((item) => item.id === selected);
    if (event.key === "ArrowRight") {
      event.preventDefault();
      select(items[(index + 1) % items.length].id, true);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      select(items[(index - 1 + items.length) % items.length].id, true);
    }
  };

  const current = items.find((item) => item.id === selected) ?? items[0];

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div
        aria-label={label}
        className="relative grid grid-cols-4 gap-1 rounded-full border border-rule bg-card p-1"
        onKeyDown={onKeyDown}
        ref={listRef}
        role="tablist"
      >
        <motion.div
          animate={{ width: indicator.width, x: indicator.left - 4 }}
          className="absolute top-1 bottom-1 left-1 rounded-full bg-data"
          initial={false}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 32 }}
        />
        {items.map((item) => {
          const isSelected = item.id === selected;
          return (
            <button
              aria-controls={`${baseId}-panel`}
              aria-selected={isSelected}
              className={cn(
                "relative z-[1] min-h-11 rounded-full px-2 text-sm font-bold transition-colors duration-300",
                isSelected ? "text-ground" : "text-fg-muted"
              )}
              id={`${baseId}-${item.id}`}
              key={item.id}
              onClick={() => select(item.id)}
              ref={(element) => {
                if (element) buttons.current.set(item.id, element);
                else buttons.current.delete(item.id);
              }}
              role="tab"
              tabIndex={isSelected ? 0 : -1}
              type="button"
            >
              {item.title}
            </button>
          );
        })}
      </div>
      <div className="relative overflow-hidden">
        <AnimatePresence custom={direction} initial={false} mode="popLayout">
          <motion.div
            animate="center"
            aria-labelledby={`${baseId}-${current.id}`}
            custom={direction}
            exit="exit"
            id={`${baseId}-panel`}
            initial="enter"
            key={current.id}
            role="tabpanel"
            transition={reduced ? { duration: 0 } : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            variants={slide}
          >
            {current.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SmoothTab;
