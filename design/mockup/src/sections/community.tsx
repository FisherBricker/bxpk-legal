import { ArrowDown, MessageSquare, ThumbsUp } from "lucide-react";
import { DragRail } from "@/components/kokonutui/carousel-cards";
import { PlainSection, SectionHeading } from "@/components/layout";
import { Enter } from "@/components/motion-helpers";
import { useIsDesktop } from "@/lib/hooks";

type Fingerprint = [string, number][];

interface RegisterPost {
  handle: string;
  initials: string;
  when: string;
  kind: string;
  baseKg: string;
  delta?: string;
  title?: string;
  note: string;
  votes: number;
  comments: number;
  fingerprint: Fingerprint;
}

const POSTS: RegisterPost[] = [
  {
    handle: "juniper.walks",
    initials: "JW",
    when: "2 h ago",
    kind: "Posted a loadout",
    baseKg: "4.21 kg",
    delta: "0.64 kg lighter since June",
    note: "Swapped the freestanding tent for a trekking pole shelter and finally left the second fleece at home.",
    votes: 48,
    comments: 12,
    fingerprint: [["shelter", 22], ["sleep", 31], ["pack", 18], ["clothing", 11], ["cooking", 8], ["water", 5], ["electronics", 3], ["misc", 2]],
  },
  {
    handle: "ridge.and.fern",
    initials: "RF",
    when: "5 h ago",
    kind: "Shelters forum",
    baseKg: "5.34 kg",
    title: "Trekking pole tent or freestanding for the Sierra in October?",
    note: "Cold nights and granite pads. Base weight 5.34 kg now, and the tent is the biggest line on it.",
    votes: 23,
    comments: 31,
    fingerprint: [["shelter", 30], ["sleep", 27], ["pack", 16], ["clothing", 12], ["cooking", 7], ["water", 4], ["electronics", 3], ["misc", 1]],
  },
  {
    handle: "high.route.hen",
    initials: "HR",
    when: "1 d ago",
    kind: "Posted a loadout",
    baseKg: "4.88 kg",
    delta: "Food at 0.68 kg per day",
    note: "Got food down to 0.68 kg per day at 3,100 kcal by trading dinner potatoes for olive oil and tortillas.",
    votes: 36,
    comments: 9,
    fingerprint: [["shelter", 24], ["sleep", 28], ["pack", 17], ["clothing", 13], ["cooking", 9], ["water", 4], ["electronics", 4], ["misc", 1]],
  },
  {
    handle: "trail.of.crumbs",
    initials: "TC",
    when: "2 d ago",
    kind: "Resupply forum",
    baseKg: "5.02 kg",
    title: "Is 4.73 kg too much food for 5 days out of a Muir Trail Ranch bucket?",
    note: "Planning 900 g per day plus one 230 g canister. Would you cut a day of snacks or carry it?",
    votes: 11,
    comments: 17,
    fingerprint: [["shelter", 25], ["sleep", 26], ["pack", 18], ["clothing", 12], ["cooking", 9], ["water", 5], ["electronics", 3], ["misc", 2]],
  },
  {
    handle: "alpine.ash",
    initials: "AA",
    when: "3 d ago",
    kind: "Posted a gear swap",
    baseKg: "4.47 kg",
    delta: "0.21 kg lighter since May",
    note: "Traded the 1.1 L pot set for a 750 mL titanium pot and a long spoon. Same dinners, 214 g gone.",
    votes: 29,
    comments: 6,
    fingerprint: [["shelter", 26], ["sleep", 29], ["pack", 18], ["clothing", 11], ["cooking", 7], ["water", 5], ["electronics", 3], ["misc", 1]],
  },
];

const CATEGORY_NAMES: Record<string, string> = {
  shelter: "shelter",
  sleep: "sleep system",
  pack: "pack",
  clothing: "clothing",
  cooking: "cooking",
  water: "water",
  electronics: "electronics",
  misc: "misc",
};

function RegisterCard({ post }: { post: RegisterPost }) {
  return (
    <article
      className="relative flex h-full flex-col overflow-hidden rounded-lg border border-line text-ink"
      style={{
        background:
          "repeating-linear-gradient(to bottom, transparent 0, transparent 27px, rgba(95,112,64,0.12) 27px, rgba(95,112,64,0.12) 28px), #FCFBF6",
      }}
    >
      <div aria-hidden="true" className="flex h-7 items-center justify-center gap-10 border-b border-line bg-map">
        {[0, 1, 2].map((i) => (
          <span className="h-2.5 w-2.5 rounded-full border border-ink-muted/40 bg-paper" key={i} />
        ))}
      </div>
      <div className="flex flex-1 flex-col px-5 pt-4 pb-4">
        <header className="flex items-center gap-3">
          <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-moss text-sm font-bold text-paper">
            {post.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate font-bold">{post.handle}</p>
            <p className="text-sm text-ink-muted">
              {post.when}, {post.kind}
            </p>
          </div>
        </header>
        <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-display text-[2.125rem] leading-none font-medium tnum">{post.baseKg}</span>
          <span className="text-sm text-ink-muted">base weight</span>
        </div>
        {post.delta ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-sm font-bold text-moss">
            <ArrowDown aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
            {post.delta}
          </p>
        ) : null}
        <div
          aria-label={`Category breakdown: ${post.fingerprint.map(([id, pct]) => `${CATEGORY_NAMES[id]} ${pct}%`).join(", ")}`}
          className="mt-4 flex h-2 overflow-hidden rounded-full"
          role="img"
        >
          {post.fingerprint.map(([id, pct]) => (
            <span key={id} style={{ width: `${pct}%`, background: `var(--cat-${id})` }} />
          ))}
        </div>
        {post.title ? <h3 className="mt-4 font-sans text-[1.0625rem] leading-snug font-bold">{post.title}</h3> : null}
        <p className="mt-3 flex-1 leading-[28px] text-ink">{post.note}</p>
        <footer className="mt-4 flex items-center gap-4 text-sm text-ink-muted tnum">
          <span className="flex items-center gap-1.5">
            <ThumbsUp aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
            {post.votes} votes
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquare aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
            {post.comments} comments
          </span>
        </footer>
      </div>
    </article>
  );
}

export function Community() {
  const isDesktop = useIsDesktop();
  return (
    <PlainSection className="overflow-hidden py-24 lg:py-32" ground="paper" id="community" labelledBy="community-heading" nav="community">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end">
        <Enter from="left">
          <SectionHeading
            body="Post a loadout with its base weight and category breakdown, ask the forums about a shelter, and see what your friends cut before the season starts."
            id="community-heading"
            title="A trail community that talks in grams"
          />
          <p className="mt-5 inline-flex items-center rounded-full border border-line px-3 py-1 text-sm font-bold text-ink-muted">
            Sample posts
          </p>
        </Enter>
      </div>
      <Enter className="mt-6" from="right">
        <DragRail cardWidth={isDesktop ? 340 : 290} label="Sample trail register posts">
          {POSTS.map((post) => (
            <RegisterCard key={post.handle} post={post} />
          ))}
        </DragRail>
      </Enter>
    </PlainSection>
  );
}
