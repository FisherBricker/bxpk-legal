---
version: 1
slug: "design-mockup-index-html"
primary_target: "design/mockup/index.html"
related_targets: ["docs/design/site-direction.html"]
---

# Surface brief: bxpk home page (The Traverse)

Scope: the public home page of the bxpk website. Mode: Persuade. Built first as a React prototype in `design/mockup/` (single-file build for review); its section components move into the Astro site as React islands (plan Task 11).

Audience and job: backpackers who count grams, deciding on an iPhone or a desktop whether the app is worth waiting for. Action: join the launch email list, optionally asking for a beta invite. Proof: the app's own mechanism demonstrated with labelled sample data (pack weight by day, resupply, meals, shared gear, seasons). Constraints: Topo identity kept (D9); no em dashes or emoji; every number has a unit; outline icons; reduced motion gets a complete static page; app screenshots are labelled placeholders; no invented ratings, users or press.

## Direction contract

THESIS: The page is a route you walk. A contour map runs the whole length of the page, a trail line draws itself as you scroll, and each feature is a waypoint on that line with its own live instrument. It refuses the category arrangement of a hero, a three-card feature grid and a testimonial strip.

OWN-WORLD: A USGS quadrangle rendered in the app's Topo palette. Map-green grounds (#EDEFE2, #F7F6F0) alternate with spruce night chapters (#191F15, #232A1D). Moss (#5F7040, #A4BC6B on dark) carries data, and amber (#B0763B, #D2A25E) is reserved for the route line, waypoint markers and the you-are-here dot. Contour hairlines are the texture. Jost display at poster scale, Nunito Sans text, tabular numerals, mile markers set like map annotations along the line.

STORY: A visitor sees within one screen that bxpk weighs the whole trip, not just the pack. Walking the route, they believe it because each waypoint shows the instrument working on one sample trip. They leave on the launch list, some asking for the beta.

FIRST VIEWPORT: A full-bleed topo particle field that bends away from the cursor, harder with speed. Top left, at poster scale, "Know what your pack weighs, every day of the trip." Under it, one sentence, then the email field and "Get the launch email", with a "Also invite me to the beta" checkbox. The trailhead marker sits bottom center where the route begins. Pinned right: a slim elevation and pack-weight profile rail with the you-are-here dot at mile 0. A floating pill nav sits at top.

FORM: The Traverse, position 2 on the ordered list of seven grounded structures, dealt by surface concept seed 070279ce.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Signature interaction and motion grammar
- Signature: scroll draws the amber route line down the page (motion/react `useScroll` to `pathLength`). The pinned profile rail's you-are-here dot travels in step, and each waypoint marker lights as the line reaches it.
- Hero: canvas topo particles pushed by pointer position and speed, springing back; tap ripple on touch; static under reduced motion.
- Chapters enter from the side the route approaches from, with staggered children; charts animate once as their waypoint is reached. One authored moment per chapter, never the same entrance everywhere.
- Mobile: no pinned rail (it becomes a slim sticky progress line under the nav), no pinned charts, drag rails become native scroll-snap.

## Unresolved
- Real app screenshots replace the placeholders.
- Pricing is not stated anywhere; the page makes no free or paid claim.
- Whether launch email needs a confirmation step (Task 18 gate).
