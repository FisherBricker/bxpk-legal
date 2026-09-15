/**
 * Adapted from KokonutUI "Card Stack" (MIT, kokonutui.com).
 * Kept: the deck of overlapping cards with a small rotation per card, the
 * spring that settles them, and the reduced-motion branch that flattens the
 * rotations. Changed: the deck is a real list of gear categories rather than
 * four demo products, one card expands at a time instead of the whole deck
 * fanning, the glass/blur card treatment is replaced with Topo panels, the
 * next/image product art is gone, and each card is a keyboard-operable button
 * that reports hover so the donut beside it can highlight the same category.
 */

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { type Category, catTotal, fmtInt } from "@/data/trip";
import { cn } from "@/lib/utils";

interface GearCardStackProps {
  categories: Category[];
  expanded: string | null;
  onExpandedChange: (id: string | null) => void;
  hovered: number | null;
  onHoveredChange: (index: number | null) => void;
}

export function GearCardStack({
  categories,
  expanded,
  onExpandedChange,
  hovered,
  onHoveredChange,
}: GearCardStackProps) {
  const reduced = useReducedMotion() ?? false;
  const spring = reduced
    ? { duration: 0.2, ease: "easeOut" as const }
    : { type: "spring" as const, stiffness: 220, damping: 28, mass: 1 };

  return (
    <ul className="relative m-0 list-none p-0">
      {categories.map((category, index) => {
        const isOpen = expanded === category.id;
        const isHot = hovered === index;
        const total = catTotal(category);
        return (
          <motion.li
            animate={{ rotate: reduced || isOpen || isHot ? 0 : index % 2 === 0 ? -0.35 : 0.4 }}
            className={cn("relative", index > 0 && "-mt-3")}
            key={category.id}
            layout
            onPointerEnter={() => onHoveredChange(index)}
            onPointerLeave={() => onHoveredChange(null)}
            style={{ zIndex: isOpen || isHot ? 30 : index }}
            transition={spring}
          >
            <motion.div
              animate={{ y: isHot && !isOpen ? -4 : 0 }}
              className={cn(
                "panel overflow-hidden",
                isHot || isOpen ? "border-data" : "border-rule"
              )}
              layout
              transition={spring}
            >
              <button
                aria-controls={`gear-${category.id}`}
                aria-expanded={isOpen}
                className="flex min-h-[3.25rem] w-full items-center gap-3 px-4 py-3 text-left"
                onClick={() => onExpandedChange(isOpen ? null : category.id)}
                onFocus={() => onHoveredChange(index)}
                onBlur={() => onHoveredChange(null)}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className="h-7 w-[3px] shrink-0 rounded-full"
                  style={{ background: category.color }}
                />
                <span className="flex-1 font-bold">{category.label}</span>
                <span className="text-sm text-fg-muted tnum">
                  {category.items.length} {category.items.length === 1 ? "item" : "items"}
                </span>
                <span className="w-[4.75rem] text-right font-bold tnum">{fmtInt(total)} g</span>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={spring}>
                  <ChevronDown aria-hidden="true" className="h-4 w-4 text-fg-muted" strokeWidth={1.75} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    animate={{ height: "auto", opacity: 1 }}
                    className="overflow-hidden"
                    exit={{ height: 0, opacity: 0 }}
                    id={`gear-${category.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    key="items"
                    transition={{ duration: reduced ? 0 : 0.36, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ul className="m-0 list-none border-t border-rule px-4 py-1">
                      {category.items.map((item) => (
                        <li
                          className="flex items-center gap-3 border-b border-rule py-2 text-[0.9375rem] last:border-b-0"
                          key={item.name}
                        >
                          <span className="min-w-0 flex-1 truncate">{item.name}</span>
                          <span className="map-label text-fg-muted">{item.role}</span>
                          <span className="w-[4.75rem] text-right font-bold tnum">{fmtInt(item.g)} g</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          </motion.li>
        );
      })}
    </ul>
  );
}

export default GearCardStack;
