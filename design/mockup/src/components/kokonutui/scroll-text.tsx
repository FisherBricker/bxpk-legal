/**
 * Adapted from KokonutUI "Scroll Text" (MIT, kokonutui.com).
 * Kept: an IntersectionObserver with a narrow band at the middle of the root
 * (rootMargin -45% top and bottom) that picks the active line, and the color
 * change that highlights it. Changed: the observer watches the page instead of
 * a 300 px inner scroller, the lines are statements with a detail sentence that
 * opens with the active line, the swinging entrance (rotate plus 100 px slide
 * from opacity 0) is removed, and under reduced motion every line and detail is
 * shown at once.
 */

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CAPTURE } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export interface ScrollStatement {
  line: string;
  detail: string;
}

export function ScrollStatements({ items, className }: { items: ScrollStatement[]; className?: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const reduced = (useReducedMotion() ?? false) || CAPTURE;

  useEffect(() => {
    if (reduced) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = refs.current.indexOf(entry.target as HTMLLIElement);
            if (index >= 0) setActive(index);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    for (const element of refs.current) if (element) observer.observe(element);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <ol className={cn("m-0 list-none p-0", className)}>
      {items.map((item, index) => {
        const isActive = reduced || index === active;
        return (
          <li
            aria-current={!reduced && index === active ? "true" : undefined}
            className="border-t border-rule py-8 first:border-t-0 lg:py-12"
            key={item.line}
            ref={(element) => {
              refs.current[index] = element;
            }}
          >
            <p
              className={cn(
                "font-display text-[clamp(1.75rem,1.1rem+2.1vw,3.25rem)] leading-[1.08] font-medium transition-colors duration-500",
                isActive ? "text-fg" : "text-fg-muted/70"
              )}
            >
              {item.line}
            </p>
            <motion.div
              animate={{ gridTemplateRows: isActive ? "1fr" : "0fr", opacity: isActive ? 1 : 0.35 }}
              className="grid"
              initial={false}
              transition={{ duration: reduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="overflow-hidden text-lg leading-relaxed text-fg-muted">
                <span className="block max-w-[46ch] pt-3">{item.detail}</span>
              </p>
            </motion.div>
          </li>
        );
      })}
    </ol>
  );
}

export default ScrollStatements;
