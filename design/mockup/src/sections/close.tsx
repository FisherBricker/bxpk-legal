import { motion } from "motion/react";
import { ContourPaths } from "@/components/kokonutui/background-paths";
import { ContourDotBand } from "@/components/kokonutui/mouse-effect-card";
import { Mark, Wordmark } from "@/components/mark";
import { SignupForm } from "@/components/signup-form";
import { EASE_EXPO } from "@/lib/hooks";

export function Close() {
  return (
    <section aria-labelledby="close-heading" className="night bg-night text-night-ink">
      <ContourDotBand>
        <div className="mx-auto w-full max-w-[82rem] px-5 py-28 sm:px-10 lg:py-40">
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
