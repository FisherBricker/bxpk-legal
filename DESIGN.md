---
name: bxpk website
description: The Topo quadrangle for the web. The home page is a route you walk, and every feature is a waypoint with a working instrument.
colors:
  map: "#edefe2"
  paper: "#f7f6f0"
  surface: "#ffffff"
  ink: "#1c2e1e"
  ink-muted: "#5f665a"
  line: "#e2e0d6"
  night: "#191f15"
  night-2: "#232a1d"
  night-ink: "#e7eadf"
  night-muted: "#98a08a"
  night-line: "#2e3626"
  moss: "#5f7040"
  moss-bright: "#a4bc6b"
  amber: "#b0763b"
  amber-bright: "#d2a25e"
  contour: "rgba(95, 112, 64, 0.22)"
  contour-night: "rgba(164, 188, 107, 0.1)"
  cat-shelter: "#4c6444"
  cat-sleep: "#6b5b8f"
  cat-pack: "#8f6e5b"
  cat-clothing: "#7b8f5a"
  cat-water: "#3a5e8c"
  cat-cooking: "#c05b3a"
  cat-electronics: "#c9a227"
  cat-misc: "#8a8f87"
typography:
  display:
    fontFamily: "Jost Variable, Futura, Avenir Next, ui-sans-serif, sans-serif"
    fontSize: "clamp(3rem, 1.2rem + 5.4vw, 6rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Jost Variable, Futura, Avenir Next, ui-sans-serif, sans-serif"
    fontSize: "clamp(2.25rem, 1.35rem + 2.9vw, 4.25rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.018em"
  title:
    fontFamily: "Jost Variable, Futura, Avenir Next, ui-sans-serif, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Nunito Sans Variable, Avenir Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1rem + 0.35vw, 1.3125rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Nunito Sans Variable, Avenir Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "\"tnum\" 1"
  label:
    fontFamily: "Jost Variable, Futura, Avenir Next, ui-sans-serif, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.08em"
    fontFeature: "\"tnum\" 1"
rounded:
  swatch: "3px"
  panel: "8px"
  control: "12px"
  screen-card: "16px"
  sheet: "24px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  gutter: "20px"
  gutter-wide: "40px"
  stage: "64px"
  section: "96px"
  section-wide: "144px"
  route-gutter-phone: "48px"
  route-gutter: "240px"
  rail-gutter: "190px"
components:
  button-primary:
    backgroundColor: "{colors.moss}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  button-primary-night:
    backgroundColor: "{colors.moss-bright}"
    textColor: "{colors.night}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  button-nav-cta:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  input-email:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "48px"
  input-email-night:
    backgroundColor: "{colors.night-2}"
    textColor: "{colors.night-ink}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "48px"
  nav-link-active:
    backgroundColor: "{colors.moss}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  chapter-tab-active:
    backgroundColor: "{colors.moss-bright}"
    textColor: "{colors.night}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  panel:
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "24px"
  panel-night:
    backgroundColor: "{colors.night-2}"
    textColor: "{colors.night-ink}"
    rounded: "{rounded.panel}"
    padding: "24px"
  category-tick:
    rounded: "{rounded.pill}"
    width: "3px"
    height: "12px"
  seat-button:
    rounded: "{rounded.pill}"
    size: "44px"
  map-tag:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
---

# Design System: bxpk website

## Overview

**Creative North Star: "The Quadrangle You Walk"**

The site is a USGS quadrangle printed in the app's Topo palette. Light map-green sheets alternate with spruce night chapters, contour hairlines are the only texture, and weight is shown as instrumentation rather than described. The home page is a single route: an amber trail line leaves the trailhead marker in the first viewport, draws itself down the page with scroll, and lights a waypoint marker at each feature. A pinned elevation and pack-weight rail tracks the visitor's mile, day and kilograms beside the content.

Density is that of a good map sheet: generous grounds with precise, small annotations set against poster-scale Jost headlines. Every figure is a measurement with its unit in tabular numerals. Decoration earns its place only if it is cartographic (isolines, neatlines, a scale bar, mile annotations) or a working instrument (profile, charts, seat picker). This system is brand-pinned: the Topo palette, the app's category palette, the CS-02 mark, outline icons, no emoji and no em dashes all come from the app repo and are not the website's to change.

Confirmed rejections from the brief and the brand: the category arrangement of a hero, a three-card feature grid and a testimonial strip; neon or saturated gradients; invented ratings, users or press; alarm-style urgency.

**Key Characteristics:**
- Two grounds that flip every role: light map sheets and spruce night chapters.
- Amber is the route and nothing else; moss carries data; categories keep the app's palette.
- Contours are isolines of one height field, so lines nest and never cross.
- Poster-scale Jost display over Nunito Sans text, tabular numerals everywhere.
- Hairline map-sheet panels with an 8px radius and almost no lift.
- One authored entrance per section, from the side the route approaches; reduced motion gets a complete static page.

## Colors

A matte, earth-toned topographic palette: map greens and warm paper by day, deep spruce by night, with one amber line running through both.

### Primary
- **Survey Moss** (moss): the data color on light grounds. Every non-category chart series, the primary button, the active nav pill, the focus ring and text selection. Also the brand's green switchback stroke in light-surface form.
- **Lichen Moss** (moss-bright): moss's night counterpart. Data series, focus ring, selection, the primary button and the active chapter tab on spruce grounds; the rail's elevation strip.

### Secondary
- **Trail Amber** (amber): the route on light grounds. The dashed unwalked route, the solid drawn route, waypoint marker rings, the you-are-here dot, the trailhead pulse, the 3px phone progress line and route events such as the resupply dot.
- **Lantern Amber** (amber-bright): the same roles on spruce grounds, applied to the route through a clip path wherever it crosses a night chapter.

### Tertiary: Gear categories (brand-pinned)
The app's category palette, unchanged, used wherever gear is broken down by category (gear cards, the base weight donut, community fingerprint bars):
- **Shelter Forest** (cat-shelter), **Sleep Twilight** (cat-sleep), **Pack Brown** (cat-pack), **Clothing Moss** (cat-clothing), **Water Blue** (cat-water), **Cooking Ember** (cat-cooking), **Electronics Yellow** (cat-electronics), **Misc Stone** (cat-misc).

### Neutral
- **Quadrangle Green** (map): the hero ground and the header strip of register cards. The page's first sheet.
- **Survey Paper** (paper): the default page ground for light route sections, community and news.
- **Plate White** (surface): input fields, phone screen cards, and mixed into panel fills (55% for panels, 85% for chart panels).
- **Contour Ink** (ink): all text and hairline-weight chart marks on light grounds; the nav CTA fill; the target tick in the meals chart; the error border.
- **Faded Ink** (ink-muted): secondary text, axis labels, captions.
- **Sheet Line** (line): 1px hairlines, panel borders, dividers.
- **Spruce Night** (night): night chapter ground (resupply, trail guide, privacy, close) and the phone frame.
- **Spruce Card** (night-2): panels, fields and chapter tab tracks on night grounds.
- **Night Ink** (night-ink) and **Night Stone** (night-muted): text and secondary text on night.
- **Night Line** (night-line): hairlines on night.
- **Contour** (contour, contour-night): isoline hairlines on each ground; section sheets use a quieter 0.14 (light) and 0.10 (night) alpha texture.

### Named Rules
**The Route Only Rule.** Amber marks the route, its markers, the you-are-here dot and events that happen on the route (the resupply stop). It never fills a button, a panel or body text. Amber text is allowed only as a short bold route-event label on a night ground (the "+4.73 kg" resupply label); on light grounds route labels are set in ink, because small amber text fails AA there.

**The Night Flip Rule.** Components read contextual roles (ground, fg, fg-muted, rule, card, data, route, topo), never raw tokens, so a component dropped into a `.night` chapter re-themes itself, charts included. Adding a new chart means mapping its variables onto these roles, not choosing new colors.

**The Pinned Category Rule.** Gear categories use the app's category palette and nothing else, in every chart that breaks gear down by category. Categories appear as short tick marks (3 x 12px) or round swatches, never as full-height colored side stripes. Moss carries every series that is not a gear category.

## Typography

**Display Font:** Jost (with Futura, Avenir Next, sans-serif)
**Body Font:** Nunito Sans (with Avenir Next, system-ui, sans-serif)
**Label Font:** Jost, uppercase and tracked, as map annotation

**Character:** Jost is the park-poster geometric, set large and slightly tight; Nunito Sans is the soft, legible field-notes text beside it. Both are self-hosted variable fonts with latin subsets; the Futura and Avenir Next fallbacks keep the app's typographic lineage.

### Hierarchy
- **Display** (500, clamp(3rem, 1.2rem + 5.4vw, 6rem), 0.98): the hero headline and the closing headline only. In the hero it is also capped at 9.6svh so headline, lead, form and profile fit a 1280 x 800 viewport; it reveals word by word.
- **Headline** (500, clamp(2.25rem, 1.35rem + 2.9vw, 4.25rem), 1.02): one per section, the section heading at the waypoint.
- **Title** (500, 1.5rem to 1.75rem, about 1.25): panel and card titles, chapter captions, the South Lake map tag place name, the mobile menu links.
- **Lead** (400, clamp(1.125rem, 1rem + 0.35vw, 1.3125rem), 1.55): the sentence under a headline, in fg-muted, max 62ch.
- **Body** (400, 1.0625rem, 1.6): running text in fg-muted, max 68ch; lists and tables drop to 0.9375rem or 0.875rem. Tabular numerals are on by default for the whole body.
- **Label** (500, 0.8125rem, 0.08em, uppercase): map annotations. Waypoint mile markers (0.6875rem, 0.06em, set vertically in the phone gutter), rail readouts, trip profile place names, fact labels in a data list, sample disclosures and the footer sheet-title block.

### Named Rules
**The Unit Rule.** Every number carries its unit (kg, g, kcal, mL, L, mi, ft, degrees F, %) and sits in tabular numerals. A figure without a unit is a defect.

**The Map Annotation Rule.** Uppercase tracked Jost labels annotate a place, a measurement, a data field or a sample disclosure, the way labels sit on a quadrangle. They are never a kicker or eyebrow above a section heading; the waypoint's mile annotation sits beside the heading in the route gutter, not over it.

## Layout

The page is a vertical traverse. Route sections use a content column (max 90rem) that gives its left gutter to the route line and its right gutter to the rail: 240px left and 190px right at 1024px and wider. Below 1024px the rail disappears and the route runs in a 48px left gutter with a 12px track, with the content padded clear. Sections off the route (community, privacy, news, close, footer) use a plain column of max 82rem with 20px side padding, 40px from 640px.

Vertical rhythm is sheet-sized: route sections run 80 to 112px of padding, plain night sections 96px, growing to 144px on wide screens. Inside sections the working steps are 8, 12, 16 and 24px; two-column splits use 40 to 64px gaps, typically 5:7 (copy to instrument) or 7:5 on the close. The walkthrough keeps 64px between its heading and its stage. Gaps between panels appear only where a heading sits.

Two chapters pin on desktop: resupply for 300vh (the chart walks day by day under a retreating scrim) and the trail guide for 400vh (the phone swaps sides per chapter). Pinning requires a viewport of at least 880px and no reduced-motion request; otherwise both lay out flat and complete.

Breakpoints in use: 640px (side padding, chart label density), 880px (desktop behavior, pinning, desktop nav), 1024px (route gutter and rail, hero two-column), 1280px (resupply panel and phone overlap).

**The Gutter Belongs to the Route Rule.** On route sections nothing but the route line, its markers and its mile annotations may occupy the left gutter, and nothing but the rail may occupy the right. Content never pads itself into either.

## Elevation & Depth

Depth is cartographic, not physical. Surfaces are flat sheets separated by ground changes (map, paper, night) and 1px hairlines. The only lift belongs to objects that float above the map: the condensed nav, the mobile menu sheet and the phone frame. Night surfaces carry no shadow at all.

### Shadow Vocabulary
- **Sheet edge** (`box-shadow: 0 1px 0 rgba(28, 46, 30, 0.05)`): every light panel. It reads as the edge of a printed sheet, not as lift.
- **Floating nav** (`box-shadow: 0 10px 30px -18px rgba(28, 46, 30, 0.55)`): the nav once it condenses after 40px of scroll, with a paper fill at 95% and a light backdrop blur.
- **Menu sheet** (`box-shadow: 0 24px 60px -30px rgba(28, 46, 30, 0.6)`): the mobile menu.
- **Device** (`box-shadow: inset 0 0 0 1px var(--moss), 0 40px 70px -40px rgba(16, 20, 13, 0.65)`): the phone placeholder, its moss rim drawn as an inset hairline.

### Named Rules
**The Map Sheet Rule.** A panel is a 1px rule, an 8px radius, a paper-tinted fill and the sheet-edge shadow. If a panel looks lifted, it is wrong; on night grounds it is flat night-2.

**The One Field Rule.** Every contour texture (hero particles, section sheets, phone screens, the route map, the news cover, the close band, the footer ridge) is drawn from one height field with two summits, as isolines at a fixed interval. Lines nest and never cross.

## Shapes

Soft, small corners on sheets and controls, full pills for anything that selects or marks. Panels and register cards use 8px; inputs and the primary button use 12px; phone screen cards use 16px; the mobile menu sheet uses 24px. The nav, chapter tabs, avatars, seat buttons, waypoint markers and category ticks are fully round. Legend swatches are 3px squares. Lines are round-capped: the route is 2px dashed (7 on, 9 off) at half opacity for the unwalked route and 2.5px solid where drawn; contours are 1px non-scaling hairlines. Waypoint markers are 8px rings (10px with an outer 15px ring at trail's end) that fill with a spring when the line reaches them.

Recurring cartographic geometry: the neatline (a hairline with ticks every 48px) along the top of the first route sheet and the bottom of the last; the footer's sheet-title block with a five-segment scale bar and contour interval; register cards ruled every 28px with a binding strip.

## Components

### Buttons
Tactile and plain: solid fills, no gradients, a 1px lift.
- **Shape:** gently rounded (12px) for the form; full pill (9999px) in the nav.
- **Primary:** data fill with ground-colored bold text, 48px tall, 20px side padding. Moss with paper text on light grounds, lichen moss with spruce text on night.
- **Hover / Focus:** lifts 1px on hover and presses 1px on tap; a 2px data-colored outline at 3px offset on focus. While sending, a spinning outline loader and "Sending".
- **Nav CTA:** ink pill with paper text, 44px. It stays transparent and inert while the hero form is on screen, then fades in over 0.3s.
- **Text link button:** the label slides up to reveal a duplicate with a data-colored arrow, 0.3s on the expo ease, on hover and on focus.

### Chips
- **Chapter tabs:** a card-colored pill track with a 1px rule; the active chapter is a data-filled pill that slides between tabs on a spring (stiffness 380 to 400, damping 32). Arrow keys move between tabs on mobile.

### Cards / Containers
- **Corner Style:** 8px.
- **Background:** surface mixed 55% into paper (85% for chart panels); night-2 on night.
- **Shadow Strategy:** sheet edge only (see Elevation & Depth).
- **Border:** 1px rule.
- **Internal Padding:** 20 to 24px.
- **Register card (community):** a ruled-paper card with a map-green binding strip, initials avatar, base weight and a category fingerprint bar labelled with percentages.
- **Map tag (close):** a panel carrying a place name in title type, its mile and ft, and three measured facts.

### Inputs / Fields
- **Style:** 48px tall, 12px radius, 1px rule border, plate white on light grounds and night-2 on night, 16px side padding; a bold label above.
- **Focus:** the global 2px data outline at 3px offset.
- **Error:** a 2px ink border and an ink error sentence tied by aria-describedby. Errors never use amber or red.
- **Checkbox:** 20px, accent in the data color, inside a 44px row.

### Navigation
- **Floating pill nav** (adapted KokonutUI Morphic Navbar): mark and wordmark left, a segmented link track (ink at 7% on transparent) centered, the CTA right. The active link detaches into a moss pill and its neighbors round their inner edges. Transparent at the top, condensed to a paper pill after 40px, hidden on scroll down past 220px and returned on scroll up (spring 260 / 30). Links are 0.9375rem semibold, 44px tall.
- **Mobile:** mark, CTA and a 44px round menu button; the sheet drops 8px and fades in over 0.25s, links set in title type 56px tall, Escape closes.
- **Progress:** on phones a 3px amber progress line with a 20% amber track sits under the nav and follows it when it hides.

### Route line, markers and rail (signature)
The amber route line is one SVG over the route sections whose solid stroke follows scroll with its head at the viewport center. The desktop hero shows the trip instrument at hero scale (the elevation profile with place annotations, hairlines at 8,000, 10,000 and 12,000 ft, a 7-day pack weight strip with the amber resupply dot on day 3, and the you-are-here dot at mile 0). On scroll the same instrument folds into the slim pinned rail: mile runs down, elevation runs sideways, and the readout gives mile, ft, day and kg interpolated between waypoint anchors. The rail switches to night colors over night chapters and fades after trail's end. Under reduced motion profile and rail swap in one step.

### Seat picker (signature)
Data-filled 36px initials circles in 44px buttons that spring in and out (stiffness 260, damping 22, mass 0.6). An open seat is a 1.5px dashed round outline with a plus icon and a moss hover; your own seat shakes when you try to release it. Totals roll with NumberFlow.

### Phone placeholder
An iPhone-proportioned spruce frame with a moss hairline rim, 65px outer and 53px screen radius, a Dynamic Island and a 9:41 status bar with outline glyphs. Screens are paper with contour texture and filled rows; every phone is captioned "Screen preview. App screenshots coming soon."

### Per-section record: components, re-theming and reveals

| Section | Ground | Component used | Re-theme | Reveal |
| --- | --- | --- | --- | --- |
| Nav | transparent, then paper | KokonutUI Morphic Navbar | Topo tokens replace black and white; floating, condensing, hiding pill; launch CTA; mobile sheet | Slides away on scroll down, returns on scroll up |
| 1. Trailhead | map | Canvas isoline particle field on the app's tested topo physics; trip profile instrument | Moss lines and dots on map, quiet zones behind copy and profile | Headline rises word by word from below (0.045s stagger, 0.9s); lead and form rise 14px from 0.35 opacity at 0.35s and 0.5s |
| 2. Route and rail | all route sections | Custom SVG route; KokonutUI Background Paths as contour sheets | Background Paths strokes become isolines at topo-texture alpha | Line draws with scroll; markers fill on a spring (260 / 20) as reached |
| 3. Gear list | paper | KokonutUI Card Stack; bklit PieChart | Category ticks instead of stripes; donut slices in the category palette with center "4.62 kg base"; slice and card hover linked | Cards from the left, chart from the right |
| 4. Meals | paper | bklit BarChart (horizontal stacked) and RingChart | Moss sequential segments, ink target tick, hatched overage; ring in the data color with an overage arc | Copy from the left; chart column drops in from above (34px) |
| 5. Resupply | night, pinned 300vh | bklit ComposedChart with stacked SeriesBar and step Line | Base in lichen moss, skin-out line in night ink dashed from the current day, amber-bright resupply marker, custom kg ticks | Pinned: days walk in under a retreating scrim. Unpinned: copy from the left, chart from the right |
| 6. Shared gear | paper | KokonutUI Team Selector rewritten as the seat picker | Initials in Topo tokens, card chrome dropped, 44px seats | Heading from the left (36px); rows enter in a 0.12s stagger |
| 7. Trail guide | night, pinned 400vh | KokonutUI Smooth Tab (mobile) | Data-filled sliding pill on a card track; arrow-key tabs added | Phone swaps sides on a layout spring (90 / 20); captions enter 64px from the side opposite the phone |
| 8. Seasons (trail's end) | paper | bklit LineChart, ReferenceArea, ProjectionLine, ChartMarkers | Data-colored line, dashed moss goal row at 4.00 kg, dashed projection, outline swap icons, explicit 3.5 to 6.5 kg domain | Copy from the left (second block 0.1s later), chart from the right; line draws on mount |
| 9. Community | paper | KokonutUI Carousel Cards rewritten as a drag rail | Register cards on ruled paper; momentum drag that snaps to whole cards (260 / 34); native scroll-snap on phones | Heading from the left, rail from the right |
| 10. Privacy | night | KokonutUI Scroll Text | The statement crossing mid-screen brightens from 0.35 opacity and opens its detail | Scroll-lit statements; sticky heading on desktop |
| 11. News and releases | paper | KokonutUI Slide Text Button | Data-colored arrow, expo ease | Featured story from the left, releases from the right (0.1s later) |
| 12. Close | night | Night isoline particle field (replaces Mouse Effect Card) | Dots at rest 2px at 40% lichen moss, 2.8px near the cursor | Copy scales up from 0.97; map tag enters 40px from the right |
| 13. Footer | paper | KokonutUI Background Paths as the ridge | Isoline ridge in topo texture | Ridge draws in once over 1.6s (0.04s per line, capped at 0.8s) |

Default entrance: from a 44px side offset (32 to 36px vertical) at 0.2 opacity, never from zero, over 0.95s on the expo ease (cubic-bezier(0.16, 1, 0.3, 1)), once, at 25% in view. Charts mount when their waypoint comes into view and animate once.

### Hero physics feel
The hero field is contour lines drawn through linked particles that sit 7.5px apart (6.5px on phones) along isolines 18px apart, up to 6,000 particles. The pointer pushes particles away with a squared falloff: reach is 90px for a still pointer, plus 0.06px per px/s of speed, capped at 220px; push is 2,600 px/s squared, boosted by 0.0015 per px/s up to 3 times. Particles spring home with stiffness 22 and damping 8. The feel is a soft wake that grows with speed: a fast sweep bends about 1,200 particles where a slow drift bends about 90, with twice the reach, while a slow pointer dwells and displaces a few particles slightly further. Particles within 28px of the copy and the profile stay quiet. Touch gets a tap ripple and no hover; reduced motion draws the field once, static.

### Owner approval
**Status: PENDING.** The owner has not approved this mockup.
- Approval date: pending
- Owner notes: pending

## Do's and Don'ts

### Do:
- **Do** build every component from the contextual roles (ground, fg, fg-muted, rule, card, data, route, topo) so it re-themes inside a `.night` chapter.
- **Do** keep amber for the route, its markers, the you-are-here dot and route events such as a resupply stop.
- **Do** color gear categories only from the app's category palette, as 3 x 12px ticks or round swatches, and carry every other series in moss (lichen moss on night).
- **Do** give every number its unit in tabular numerals.
- **Do** draw contour texture from the one isoline height field, 1px non-scaling hairlines that nest and never cross.
- **Do** build panels as map sheets: 1px rule, 8px radius, paper-tinted fill, the 1px sheet-edge shadow, flat on night.
- **Do** give each section one authored entrance from the side the route approaches, starting at 0.2 opacity, on the expo ease, once.
- **Do** give reduced motion a complete static page: no pinning, charts shown in full, the route drawn, every privacy line open.
- **Do** keep every interactive target at least 44px and every focus visible with the 2px data outline at 3px offset.
- **Do** use outline stroke icons (1.75px stroke) and label app screens as previews until real screenshots exist.

### Don't:
- **Don't** use amber for buttons, fills, body text, or any text on a light ground.
- **Don't** use full-height colored side stripes on cards or rows.
- **Don't** set uppercase tracked labels as kickers or eyebrows above headings; they annotate places, measurements and data only.
- **Don't** lift panels with soft drop shadows or put shadows on night surfaces.
- **Don't** draw crossing contour meshes or decorative waves unrelated to the height field.
- **Don't** use neon, saturated gradients, emoji or em dashes.
- **Don't** show ratings, download counts, testimonials, press or an App Store badge that do not exist.
- **Don't** start an entrance from zero opacity, or repeat the same entrance in every section.
- **Don't** mark errors in amber or red; use a 2px ink border and a plain sentence.
