import { ArrowRight, ExternalLink } from "lucide-react";
import { ContourRings } from "@/components/kokonutui/background-paths";
import { SlideTextButton } from "@/components/kokonutui/slide-text-button";
import { PlainSection } from "@/components/layout";
import { Enter } from "@/components/motion-helpers";

function ContourCover() {
  return (
    <div className="relative h-full bg-map">
    <ContourRings height={260} seed={61} stroke="var(--contour)" width={600} ringStep={18} />
    <svg aria-hidden="true" className="relative h-full w-full" fill="none" preserveAspectRatio="xMidYMid slice" viewBox="0 0 600 260">
      <path d="M40 220 C 120 200, 150 150, 230 150 S 330 120, 380 90 S 470 70, 560 40" stroke="var(--amber)" strokeDasharray="6 7" strokeLinecap="round" strokeWidth="2.5" />
      <circle cx="380" cy="90" fill="var(--amber)" r="6" />
    </svg>
    </div>
  );
}

const ROWS = [
  { title: "Why the app asks for your height and weight", meta: ["Update", "13 September 2026"], date: "2026-09-13", external: false },
  {
    title: "Planning resupply boxes for a week in the Sierra",
    meta: ["Link, publication.example", "3 September 2026"],
    date: "2026-09-03",
    external: true,
  },
];

const RELEASE = {
  New: [
    ["Hourly weather.", "Tap any trip day for its hour-by-hour forecast."],
    ["GPS interval.", "Record a point on every fix, or every 15 s, 30 s or 60 s, to save battery."],
    ["Packs.", "Save named sets of gear and systems, and load one onto a trip in one tap."],
  ],
  Improved: [
    ["", "The resupply chart shows one bar per trip day, falling as food is eaten and jumping at each stop."],
    ["", "Text follows your iPhone's text size, and every screen works with VoiceOver."],
  ],
  Fixed: [["", "Email accounts can reset a forgotten password from the sign-in screen."]],
};

export function News() {
  return (
    <PlainSection className="py-24 lg:py-32" ground="paper" id="releases" labelledBy="news-heading" nav="releases">
      <h2 className="display-2" id="news-heading">
        From the trail office
      </h2>
      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Enter from="left">
          <div className="flex items-center justify-between gap-4 border-b border-ink pb-3">
            <h3 className="font-display text-2xl font-medium" id="news">
              News
            </h3>
            <SlideTextButton href="#news" hoverText="All news" text="All news" />
          </div>
          <a className="panel group mt-6 block overflow-hidden no-underline" href="#news">
            <div className="h-44 overflow-hidden border-b border-line">
              <div className="h-full transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-[1.03]">
                <ContourCover />
              </div>
            </div>
            <div className="px-6 pt-5 pb-6">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
                <span className="rounded-full bg-map px-2.5 py-0.5 font-bold text-ink">Guide</span>
                <time dateTime="2026-09-09">9 September 2026</time>
                <span>5 min read</span>
              </p>
              <h4 className="mt-3 font-display text-[1.75rem] leading-tight font-medium group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                Find your heaviest day before you leave
              </h4>
              <p className="mt-2 text-ink-muted">
                Food and water swing a pack by several pounds over a week. How the day-by-day chart shows where the
                weight lands, and what to move when a resupply day runs heavy.
              </p>
            </div>
          </a>
          <ul className="m-0 mt-4 list-none p-0">
            {ROWS.map((row) => (
              <li key={row.title}>
                <a
                  className="group flex min-h-11 items-center justify-between gap-4 border-b border-line py-4 no-underline"
                  href="#news"
                >
                  <span>
                    <span className="block text-[1.0625rem] font-bold group-hover:underline group-hover:underline-offset-4">
                      {row.title}
                    </span>
                    <span className="mt-0.5 flex flex-wrap gap-x-3 text-sm text-ink-muted">
                      <span>{row.meta[0]}</span>
                      <time dateTime={row.date}>{row.meta[1]}</time>
                    </span>
                  </span>
                  {row.external ? (
                    <ExternalLink aria-label="Opens another site" className="h-5 w-5 shrink-0 text-moss" strokeWidth={1.75} />
                  ) : (
                    <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0 text-moss transition-transform group-hover:translate-x-1" strokeWidth={1.75} />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </Enter>

        <Enter delay={0.1} from="right">
          <div className="flex items-center justify-between gap-4 border-b border-ink pb-3">
            <h3 className="font-display text-2xl font-medium">Releases</h3>
            <SlideTextButton href="#releases" hoverText="All releases" text="All releases" />
          </div>
          <article className="panel mt-6 px-6 pt-6 pb-5">
            <header className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="font-display text-[1.75rem] leading-tight font-medium">Pre-release build</h4>
              <time className="text-ink-muted" dateTime="2026-09-13">
                13 September 2026
              </time>
            </header>
            {(Object.keys(RELEASE) as (keyof typeof RELEASE)[]).map((group) => (
              <section className="mt-6" key={group}>
                <h5 className="map-label text-moss">{group}</h5>
                <ul className="m-0 mt-2 list-none space-y-2.5 p-0">
                  {RELEASE[group].map(([lead, text]) => (
                    <li className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-2" key={text}>
                      <span aria-hidden="true" className="mt-[0.6rem] h-1.5 w-1.5 rounded-full bg-ink-muted" />
                      <span>
                        {lead ? <b className="font-bold">{lead} </b> : null}
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </article>
        </Enter>
      </div>
    </PlainSection>
  );
}
