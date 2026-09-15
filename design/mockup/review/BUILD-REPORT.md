# Build report: bxpk home page mockup, "The Traverse"

Project: `design/mockup/` on `design/site-direction`. Build: `npm run build` (TypeScript clean, then Vite) produces `dist/index.html`, one self-contained file of **826 kB (295 kB gzip)** with Jost and Nunito Sans (latin subsets) inlined.

## What was built, section by section

**Shell.** Topo tokens as CSS custom properties plus Tailwind v4 `@theme`, with contextual roles (`--ground`, `--fg`, `--data`, `--route`, `--topo`) that flip inside `.night` chapters. bklit's `--chart-*`, `--border`, `--foreground` and friends map onto those roles, so every chart re-themes on night grounds automatically. Selection color, 2 px focus outline in moss (moss-bright on night), scrollbar color and link underline offset come from the palette. The app sits in `<MotionConfig reducedMotion="user">`. `main` clips horizontal overflow so side entrances never scroll a phone sideways.

**0. Floating pill nav** (`kokonutui/morphic-navbar.tsx`). Kept the morph: the active link detaches into a moss pill and its neighbors round their inner edges. Condenses to a paper pill with soft shadow after 40 px, hides on scroll down, returns on scroll up. The CTA scrolls to the hero form and focuses the email field. Mobile: mark, CTA and a 44 px menu button opening a sheet (Escape closes). Active link follows `data-nav` sections through an IntersectionObserver.

**1. Trailhead.** Full-bleed `--map` hero with the canvas contour field on the tested `contours.ts`, `physics.ts` and `pointer.ts` (spacing 7.5 px, ring step 18 px, first frame guarded). Lines run through `linked` particles, dots at rest, brighter dots where bent, and the particles under the copy stay quiet. Word-by-word h1 reveal, lead, `SignupForm`, plain-text App Store status, amber trailhead marker with "Walk the route". Touch gets a tap ripple and no hover. Reduced motion draws the field once.

**2. Route line and rail** (`components/route.tsx`). One SVG over the route sections: dashed amber for the unwalked route, a solid stroke whose `pathLength` follows scroll through a length-by-y lookup, so the drawn head sits at 58% of the viewport. The line leaves from under the hero marker and meanders down the content gutter through each waypoint. Night chapters get amber-bright through a clip path. Markers fill with a spring when the line reaches them, and trail's end has a larger ringed marker. Desktop rail: the elevation profile as a vertical moss strip (mile 0 top, 61.4 mi bottom), the you-are-here dot on a spring, and a readout of mile, ft, day and pack kg interpolated from the waypoints, clamped inside the rail. It switches to night colors over night chapters and fades after trail's end. Mobile: a 3 px amber progress line under the nav plus a "Day 3, mile 18.0, 12.03 kg" pill, shown only on the route. Faint contour hairlines (`background-paths`) sit behind every route section.

**3. Gear list** (`kokonutui/card-stack.tsx` + bklit `PieChart`). Eight overlapping category cards with a slight alternating rotation and card-stack's spring. Each card is a button that expands to its items with grams and role. The donut shows category share of 4,620 g, with my own center reading "4.62 kg base", or the hovered category. Hovering or focusing a card highlights its slice, and hovering a slice or legend row highlights the card. Cards enter from the left, the chart from the right.

**4. Meals** (bklit `BarChart` + `RingChart`). Bars for the four meals plus the day total, growing in stagger, with a dashed `Grid` highlight row at the 3,000 kcal target. The ring runs 3,250 of 3,000 kcal, and an overlay arc marks the 250 kcal past its start. Macro strip, meal list with grams, and the moss "250 kcal over target" note. The chart column drops in from above.

**5. Resupply, night, pinned 300vh** (bklit `ComposedChart`, stacked `SeriesBar` + step `Line`). Base (moss-bright), food, water and fuel segments, and a skin-out step line dashed from the current day. A scrim over the unwalked days retreats as the section scrolls, so the days walk in. The amber resupply marker and "+4.73 kg" appear when day 3 is reached. Axis labels read "Day 1" to "Day 7". Custom kg ticks sit clear of the first bar. The three facts sit on the left, and the Resupply phone overlaps the panel edge. Not pinned on mobile or under reduced motion; there it shows all 7 days.

**6. Shared gear** (`kokonutui/team-selector.tsx` rewritten as `SeatPicker`). Initials avatars that spring in and out, one 44 px button per seat, and the shake when you try to release your own seat. "g each", "You carry" and "Saved vs going solo" roll with NumberFlow. Rounding is honest: claiming the third filter seat gives 28 g each, 805 g carried and 1,038 g saved. Rows enter from the right in stagger.

**7. Trail guide, night, pinned 400vh.** The phone swaps sides per chapter with a spring layout animation, and its screen crossfades. Captions enter from the side opposite the phone, with two stat cards each. The Plan / Pack / Walk / Share index at the bottom has a sliding moss pill and jumps to its chapter. Mobile uses `kokonutui/smooth-tab.tsx` (indicator spring kept, arrow-key tabs added). Reduced motion lays the four chapters out statically.

**8. Also in the pack** (`kokonutui/bento-grid.tsx`). Asymmetric 12-column bento. Tiles tilt up to 6 degrees on a low-bounce spring and enter from alternating sides. Each tile is a working demonstration:
- a GPX track that walks when hovered
- a 3-day NOAA strip
- readiness chips
- saved packs that load on click
- a trip debrief
- water per day bars

**9. Trail's end, Seasons** (bklit `LineChart`, `ReferenceArea`, `ProjectionLine`, `ChartMarkers`). Five seasons with markers, a hatched goal band up to 4.00 kg labelled "Goal: 4.00 kg", a dashed projection from Summer 2026 to the goal, and swap markers at Fall 2025 and Spring 2026. The line draws in when the chart mounts in view.

**10. Community** (`kokonutui/carousel-cards.tsx` rewritten as `DragRail`). Desktop: a motion drag track with momentum that snaps to whole cards. Arrow buttons disable at the ends, and keyboard arrows work when the rail is focused. Mobile: native scroll-snap. Five register cards on ruled paper with a binding strip. Each has a handle, a time, base weight, a category fingerprint bar (`role="img"` with percentages) and a note. The rail is labelled "Sample posts".

**11. Phone placeholder** (`components/phone.tsx`, `phone-screens.tsx`). Straight-on frame at iPhone 17 proportions, `--night` with a 1 px moss rim, Dynamic Island, and a 9:41 status bar with outline glyphs. Five token-colored skeleton screens (Trip, Itinerary, Resupply, Route, Base weight) with real text in the top rows and a contour texture. Every phone is captioned "Screen preview. App screenshots coming soon."

**12. Privacy, night** (`kokonutui/scroll-text.tsx`). The original's -45% band IntersectionObserver now watches the page: the statement crossing mid-screen brightens and its detail sentence opens. The heading sticks on desktop. "Read the privacy policy" uses `slide-text-button`.

**13. From the trail office.** Featured story with an SVG contour cover, two rows (the external one carries an outline icon), and the pre-release changelog. "All news" and "All releases" use `slide-text-button`.

**14. Close, night** (`kokonutui/mouse-effect-card.tsx` rewritten as `ContourDotBand`). The card's repulsion math, `(1 - d / r) * strength` with a spring home and a proximity boost, drawn on one canvas. Moss dots sit on contour rings. Static under reduced motion and on touch. The night `SignupForm` and "Coming soon to the App Store" follow.

**15. Footer.** `background-paths` in its ridge shape draws in once, followed by the mark, the operator line, eight 44 px links and the illustrations note.

**Removed:** AI brand logo files, `shimmering-text`, `spotlight-cards`, and shadcn `button` / `badge` / `card` (nothing imports them; `chart-loading-label` now uses plain text).

### bklit source edits
- `chart-formatters.ts`: trip days (year 2001) print "Day N"; the 15th of Jan, Apr, Jul or Oct prints the season.
- `x-axis.tsx`: keeps data-aligned labels when a projection extends the scale.
- `markers/chart-markers.tsx`: the "↗" glyph is now a lucide icon.
- `chart-loading-label.tsx`: plain text instead of the shimmer.
- `reference-area` and `markers` were added from the registry.
- Unicode arrows in code comments became words.

## Deviations from the brief
1. **mouse-effect-card renders on canvas.** The original uses one motion div per dot, which would mean thousands of nodes across a full-width band. The math is kept.
2. **Meals bar chart has a fifth "Day total" bar.** A 3,000 kcal target row cannot appear on a per-meal scale that tops out at 1,050 kcal. With the total bar, the target row sits in range and every bar stays honest.
3. **The ring shows the overage with an overlay arc.** bklit's ring does not clamp, so 3,250 of 3,000 kcal wraps past its start. The dark arc makes that 250 kcal wrap visible.
4. **Resupply days walk in through a scrim.** All 7 days render under a retreating scrim, and the skin-out line is dashed from the current day. Feeding partial data would rescale the axis on every step.
5. **Resupply kg ticks are a small custom child, not `YAxis`.** bklit's YAxis sits flush against the plot edge, where the first stacked bar covered its labels.
6. **The hero field check compares how much of the field bends.** The brief asks for a fast sweep to beat a slow one. Over 1.2 s, the fast sweep bends 1,070 particles versus 91 for the slow drift, with 212 px versus 102 px reach and 10,400 versus 3,355 push. Peak single-particle displacement is slightly lower for the fast sweep (67 px versus 72 px), because a slow pointer dwells on the same particles.
7. **Full-page captures load `?capture`.** That lays pinned chapters out flat, draws the route fully and opens every privacy line, so the image has no empty sticky runway. The viewport captures show the real pinned behavior.
8. **The rail is visible in the hero.** The brief says the rail fades out "before the trailhead", but the binding contract's first viewport puts the dot at mile 0 in the hero. The rail follows the contract and fades after trail's end. The mobile pill only appears on the route.
9. **Amber is never used for text.** Waypoint and rail mile labels use ink, because amber small text fails AA on light grounds and amber is route-only. The email error state uses a 2 px ink border instead of amber.
10. **No eyebrow labels on the walkthrough chapters.** "Chapter N of 4" kickers were removed; the chapter index carries progress.

## Verification
- `npm run build` passes, TypeScript clean. `dist/index.html` is one 826 kB file. It contains no external `http` references except inert XML namespace strings, a React error-URL string and the Tailwind license comment. There is no `apps.apple.com`.
- Screenshots, each opened and checked:
  - `review/desktop.png` (1440, full page)
  - `review/mobile.png` (390, full page)
  - `review/desktop-first-viewport.png`
  - `review/mobile-first-viewport.png`
  - `review/desktop-reduced-motion.png`
  - `review/desktop-resupply-mid.png` (day 5 of 7, resupply marker lit)
  - `review/desktop-walkthrough-mid.png` (chapter 3, Walk, phone at left)
- Scripts, with results in `review/checks.json`:
  - `scripts/capture.mjs`: captures plus checks.
  - `scripts/dev-warnings.mjs`: walks the dev server at desktop, reduced and mobile, and exercises cards, seats, the rail, the menu and tabs.
- Console:
  - Zero errors and zero React warnings in production and dev.
  - One dev-only notice from Motion itself when the device has reduced motion on ("You have Reduced Motion enabled"). It is informational and is not emitted in the build.
- Form: a bad email shows "Enter an email like name@example.com", tied with `aria-describedby="hero-error"`. A good email shows "Sending", then the success state.
- Keyboard: 138 tabs across the page, every focused control has a visible ring, and every target is at least 44 px (except the visually hidden skip link).
- Grep of `src/`: no em or en dashes, no emoji, and none of lorem, aurora, purple, emerald, violet or glass.
- Mobile has no horizontal overflow (scrollWidth 390).

## Known gaps
- Charts use bklit's default hover tooltips, which are not keyboard reachable. Every chart has a full `aria-label` with its numbers.
- The Motion dev notice under reduced motion cannot be silenced without patching Motion.
- The walkthrough phone moves by a layout animation between flex sides, not a scroll-scrubbed position: it glides on each chapter change rather than tracking the scroll continuously.
- Community post counts (votes, comments) and packs, debriefs and forecasts are sample content, labelled in the section and the footer.
- Contrast was checked by token math (the old mockup's measured table), not with an automated audit tool.
- Some components have minor indentation drift from scripted edits; there is no formatter in the project.

## Fix round 1

1. **Hero trip profile that becomes the rail.**
   - A new `components/trip-profile.tsx` draws the sample route's elevation profile large in the hero's right half. It has hairlines at 8,000, 10,000 and 12,000 ft and annotations with mile and ft at Trailhead, Piute Pass, Muir Trail Ranch, Muir Pass, Bishop Pass and South Lake.
   - Under the profile, a day-by-day pack weight strip (Day 1 9.22 kg to Day 7 7.69 kg) aligns each bar to that day's miles. Day 3 carries the amber resupply dot.
   - The amber you-are-here dot sits at mile 0.
   - The profile is one fixed instrument layer (`TripInstrument` in `route.tsx`). Every profile point, the baseline, the fill and the dot are interpolated from hero geometry to rail geometry with `useScroll`. The line folds from horizontal (mile across, elevation up) into the vertical rail (mile down, elevation sideways) as the hero scrolls out. Annotations and the strip fade out, and the rail scale and readout fade in. Measured fold at 1440 x 900: 0 at the top, 0.81 after 450 px.
   - There is no separate rail in the hero.
   - The "Trailhead, mile 0, 9,360 ft" marker and "Walk the route" sit under the profile inside the first viewport, and the amber route line now starts at that marker.
   - The headline scales with viewport height (`min(clamp(...), 9.6svh)`). Headline, lead, form and profile all fit at 1440 x 900 and 1280 x 800 (both checked by screenshot).
   - The topo field keeps the profile area quiet (`quietRefs`).
   - Phones get a static copy of the profile under the form, with compact labels.
   - Reduced motion swaps profile to rail in one step with no fold.
2. **Rail anchored to waypoints.**
   - The rail reads the viewport's vertical centre against waypoint anchors (the waypoint label next to each heading) and interpolates only between consecutive anchors. At an anchor it shows that waypoint's exact mile and ft, the day that mile falls on (`dayOnTrail`, where a camp belongs to the day that ends there) and that day's pack weight.
   - Inside the pinned resupply chapter, the day comes from the chart's own `walkDay` helper, with that day's start mile. The recaptured mid-scroll shows "Mile 36.5, Day 5, 9.61 kg" beside a chart walked to day 5.
   - Inside the pinned walkthrough, the rail holds at mile 44.6.
   - The drawn route head moved to the viewport centre to match.
   - The scale labels "0 mi" and "61.4 mi" now sit above and below the strip, clear of the line.
3. **Explanatory copy removed.**
   - Deleted: "Walking the section moves the trip forward one day at a time. Day N of 7.", "Dashed row...", "The dark arc...", "Claim or release a seat..." and "Hover the map to walk the track."
   - Open seats now have a 1.5 px dashed outline with a plus icon, a pointer cursor, a moss hover state and the label "Claim seat on Squeeze water filter". Your own seat keeps the default cursor.
   - The GPX track tile now draws itself when it scrolls into view and walks again on hover. It no longer needs a hint.
4. **Phone screens filled.**
   - Screens are a flex column, and `ScreenBars` fills the remaining height with quiet rows down to the tab bar, so no screen has an empty band.
   - Trip: the Shelter, Sleep system and Pack rows with grams.
   - Itinerary: all 7 days with mi, ft and L, plus two forecast rows.
   - Resupply: the bucket contents (breakfasts 0.70 kg, lunches 0.95 kg, dinners 1.15 kg, snacks 1.70 kg and a 230 g canister, summing to 4.73 kg) and the leaving rows.
   - Route: a splits list under the map.
   - Base weight: the five-season list.
5. **Seasons chart.**
   - bklit `LineChart` gained an explicit `yDomain` prop (edited `line-chart.tsx` and `time-series-chart-shell.tsx`, where an explicit domain now also skips nicing and projection widening). The chart uses 3.5 kg to 6.5 kg.
   - The hatched fill is gone. The goal is a dashed moss highlight row at 4.00 kg labelled "Goal: 4.00 kg".
   - The projection and both swap markers stay.
   - "Axis starts at 3.5 kg" sits inside the chart panel.
6. **Meals chart.**
   - It is now one horizontal stacked bklit `BarChart` for day 2 (`components/meals-chart.tsx`). Segments Breakfast 720 kcal, Lunch 880 kcal, Dinner 1,050 kcal and Snacks 600 kcal are labelled under each segment; on phones the labels alternate between two rows.
   - An ink tick marks "Target 3,000 kcal", and the 250 kcal past it carries a hatch and a "+250 kcal" label.
   - bklit's horizontal stacked bars measured each segment from zero to its own value. I fixed `bar.tsx` so a segment spans its offset to its offset plus its value.
   - The ring and the meal table stay, now in their own two panels.
7. **Close band.**
   - The right half now holds the amber route line arriving at the ringed trail's end marker, a map-tag card ("Trail's end, South Lake, Mile 61.4, 9,768 ft", with Walked 7 days, 61.4 mi; At trail's end 7.69 kg; Picked up at Muir Trail Ranch 4.73 kg) and the Base weight phone. The phone is hidden on phones.
   - Dots at rest are 2 px at 40% moss-bright; dots near the cursor are 2.8 px.
8. **Phones (390 px).**
   - The route line and its gutter labels are not drawn below 1024 px. Each waypoint becomes an inline annotation row with an amber dot ("Mile 18.0, Muir Trail Ranch, 7,700 ft"), and the content column is no longer padded for a gutter.
   - The pack-weight chart labels every other day below 640 px.
   - No hover hints remain.
9. **Nav CTA.** An IntersectionObserver on the hero form hides the nav's "Get the launch email" on desktop and mobile. It is transparent and `inert`, so it is not focusable and holds its layout space, and it fades in once the form leaves the screen.
10. **Water per day.** The bars now use `color-mix(in srgb, var(--cat-water) 42%, var(--card))`, with value labels in ink.

**Verification, round 1:**
- `npm run build` passes with TypeScript clean. `dist/index.html` is 830 kB (295 kB gzip).
- All seven screenshots were recaptured over the same files. Full pages use `?capture`; the two mid-scroll shots are real pinned behaviour.
- Console: zero errors in production. The dev walk shows only Motion's own reduced-motion notice.
- Form: error and success both pass.
- Keyboard: 138 tabs, every control shows a focus ring, and every target is 44 px or more.
- Hero field: the fast sweep bends 1,282 particles against 104 for the slow drift.
- Grep: no dashes, emoji or banned words, and none of the removed hint sentences remain in `src/`.
