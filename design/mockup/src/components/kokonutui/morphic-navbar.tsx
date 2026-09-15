/**
 * Adapted from KokonutUI "Morphic Navbar" (MIT, kokonutui.com).
 * The original is a black-on-white segmented bar of Next.js links where the
 * active segment detaches into a rounded pill. Kept: the morph, including the
 * way the segments either side of the active link round off their inner edges.
 * Changed: Topo tokens instead of black and white, in-page anchors instead of
 * next/link, a floating pill that condenses on scroll and hides on scroll down,
 * a launch CTA, and a mobile sheet.
 */

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Mark, Wordmark } from "@/components/mark";
import { useIsDesktop, useReduced } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export interface NavItem {
  id: string;
  name: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "route", name: "Route", href: "#route" },
  { id: "guide", name: "Trail guide", href: "#guide" },
  { id: "community", name: "Community", href: "#community" },
  { id: "releases", name: "Releases", href: "#releases" },
  { id: "support", name: "Support", href: "#support" },
];

function focusSignup(reduced: boolean) {
  const field = document.getElementById("hero-email");
  const hero = document.getElementById("trailhead");
  (field ?? hero)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  window.setTimeout(() => field?.focus({ preventScroll: true }), reduced ? 0 : 420);
}

export function Navbar() {
  const [active, setActive] = useState<string>("route");
  const [condensed, setCondensed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // The nav's CTA would repeat the hero's own button, so it waits until the hero form has scrolled away.
  const [formOnScreen, setFormOnScreen] = useState(true);
  const lastY = useRef(0);
  const { scrollY } = useScroll();
  const isDesktop = useIsDesktop();
  const reduced = useReduced();

  useMotionValueEvent(scrollY, "change", (y) => {
    setCondensed(y > 40);
    const goingDown = y > lastY.current && y > 220;
    lastY.current = y;
    const hide = goingDown && !menuOpen;
    setHidden(hide);
    // Anything pinned under the nav (the phone route-progress line) follows it up and down.
    document.documentElement.style.setProperty("--nav-bottom", hide ? "0px" : "68px");
  });

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-nav]"));
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.getAttribute("data-nav") ?? "route");
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const form = document.getElementById("hero-signup");
    if (!form) return;
    const observer = new IntersectionObserver(([entry]) => setFormOnScreen(entry.isIntersecting), { threshold: 0 });
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const isActive = (id: string) => active === id;

  return (
    <motion.header
      animate={{ y: hidden ? -120 : 0 }}
      className="fixed top-0 right-0 left-0 z-50 flex justify-center px-3 pt-3 sm:px-6 sm:pt-4"
      initial={false}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <div
        className={cn(
          "flex w-full max-w-[86rem] items-center gap-2 rounded-full px-2.5 py-2 transition-[background-color,box-shadow,padding] duration-300",
          condensed
            ? "bg-paper/95 py-1.5 shadow-[0_10px_30px_-18px_rgba(28,46,30,0.55)] backdrop-blur-sm"
            : "bg-transparent"
        )}
      >
        <a
          className="flex min-h-11 items-center gap-2 rounded-full px-2 text-ink no-underline"
          href="#trailhead"
          onClick={() => setMenuOpen(false)}
        >
          <Mark className="h-7 w-7" knockout="var(--map)" />
          <Wordmark className="hidden sm:inline" />
          <span className="sr-only">Backpack Weight Tracker home</span>
        </a>

        {isDesktop ? (
          <>
            <nav aria-label="Sections" className="mx-auto">
              <ul className="flex items-center rounded-full bg-[color-mix(in_srgb,var(--ink)_7%,transparent)] p-0.5">
                {NAV_ITEMS.map((item, index) => {
                  const previous = NAV_ITEMS[index - 1];
                  const next = NAV_ITEMS[index + 1];
                  return (
                    <li key={item.id}>
                      <a
                        aria-current={isActive(item.id) ? "true" : undefined}
                        className={cn(
                          "flex min-h-11 items-center px-4 text-[0.9375rem] font-semibold no-underline transition-colors duration-300",
                          isActive(item.id)
                            ? "mx-1 rounded-full bg-moss text-paper"
                            : cn(
                                "text-ink/75 hover:text-ink",
                                (index === 0 || isActive(previous?.id ?? "")) && "rounded-l-full",
                                (index === NAV_ITEMS.length - 1 || isActive(next?.id ?? "")) && "rounded-r-full"
                              )
                        )}
                        href={item.href}
                      >
                        {item.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <motion.div animate={{ opacity: formOnScreen ? 0 : 1 }} inert={formOnScreen} initial={false} transition={{ duration: 0.3 }}>
              <button
                className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-[0.9375rem] font-bold text-paper"
                onClick={() => focusSignup(reduced)}
                type="button"
              >
                Get the launch email
              </button>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div
              animate={{ opacity: formOnScreen ? 0 : 1 }}
              className="ml-auto"
              inert={formOnScreen}
              initial={false}
              transition={{ duration: 0.3 }}
            >
              <button
                className="inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-[0.875rem] font-bold text-paper"
                onClick={() => {
                  setMenuOpen(false);
                  focusSignup(reduced);
                }}
                type="button"
              >
                Get the launch email
              </button>
            </motion.div>
            <button
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-ink"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              {menuOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
            </button>
          </>
        )}
      </div>

      <AnimatePresence>
        {menuOpen && !isDesktop ? (
          <motion.nav
            animate={{ opacity: 1, y: 0 }}
            aria-label="Sections"
            className="absolute top-[72px] right-3 left-3 rounded-3xl border border-line bg-paper p-3 shadow-[0_24px_60px_-30px_rgba(28,46,30,0.6)]"
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex justify-end">
              <button
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-full text-ink"
                onClick={() => setMenuOpen(false)}
                type="button"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    className="flex min-h-14 items-center border-b border-line font-display text-2xl font-medium no-underline last:border-b-0"
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;
