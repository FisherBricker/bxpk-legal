# Product

<!-- impeccable:product-schema 1 -->

Scope: the public website for Backpack Weight Tracker ("bxpk"), served from this repository at
`https://fisherbricker.github.io/bxpk-legal/`. The iOS app itself lives in the separate `bxpk` repo.

Provenance: written during Task 3 of the site plan with no owner available to interview. Every fact
below comes from the site spec (`bxpk/docs/superpowers/specs/2026-09-13-bxpk-website-design.md`),
the brand guide (`bxpk/branding/BRAND.md`), the approved app direction
(`bxpk/docs/design/DESIGN_DECISIONS.md`) and the published legal pages in `src/content/legal/`.
Items marked **(inferred)** are reasoned from those sources and need the owner's confirmation at the
design gate.

## Platform

web

## Stack

Astro 7 static site with Markdown content collections, built by GitHub Actions and deployed to GitHub
Pages (spec D5). Already in place in this repository.

## Users

- **Primary: backpackers who count grams.** People planning multi-day trips who already track gear
  weight, often in a spreadsheet, and want base weight, food, water and fuel accounted for day by day.
  They reach the site from an iPhone (iOS Safari 17 and later) or a desktop browser, usually while
  deciding whether the app is worth installing. **(inferred: the phone share of traffic is the larger
  one; the spec only requires both.)**
- **Existing app users** arriving from the app's own links to the privacy policy, terms and support
  page, and returning for release notes and updates.

## Product Purpose

Backpack Weight Tracker is an iPhone app for planning what goes in the pack and what it weighs on every
day of a trip. The site exists to explain what the app does, list its real features, send people to
the App Store, host the legal and support pages the app links to, and let the owner publish release
notes, updates, stories, guides and links to outside coverage.

Success: a visitor understands within one screen what the app is and that it is coming to the App
Store, can find any feature or legal page in seconds on a phone, and the legal URLs never break.

## Positioning

Weight as a measurement, carried through the whole trip: not a single pack total, but base weight,
worn weight, consumables and skin-out weight per trip day, falling as food is eaten and jumping at
each resupply, alongside meal plans in kcal and grams, boil water in mL, and gear shared across a
group by seat.

## Operating Context

- Gear lists by category, each item packed, worn or consumable, with active and archived states.
- Packs: named sets of gear and systems applied to a trip in one tap.
- Trips: itinerary (mi, ft gain, water L per day), resupply points with a one-bar-per-day pack weight
  chart, meal plans per day against a calorie target, route recording and GPX import and export,
  NOAA weather per trip day (United States only), readiness checks, participants and invitations.
- Shared gear pool: claim a seat on a group item and carry your share of its grams.
- Trail community: weight-forward posts, forums, friends, comments and votes, trip debriefs,
  achievements.
- Sign-in with email, Apple or Google; data syncs through Google Firebase.

## Capabilities and Constraints

- **App Store status:** unreleased. The call to action is "Coming soon to the App Store" with no
  Apple badge until an App Store id exists (spec D2, `src/site.config.ts` `appStoreId: null`).
- **Requires** iPhone on iOS 17 or later. Offered in the United States and Canada.
- **Legal URLs** `/privacy`, `/terms`, `/support` under the site base must never 404.
- **Owner publishing** from the GitHub web editor with no local tooling: drafts and scheduled dates.
- **Browsers:** iOS Safari 17 and later, current desktop Safari, Chrome, Firefox and Edge.
- **Budgets:** home page JavaScript at most 60 KB gzipped, CLS under 0.1, LCP under 2.5 s on a
  mid-range phone over 4G.
- **No third-party trackers, analytics or remote fonts** on the site, so no cookie banner.
- **Content visible without JavaScript;** motion is an enhancement.
- **Domain:** `fisherbricker.github.io/bxpk-legal` until ownership of `bxpk.com` is confirmed (D1).
- **Non-goals:** CMS, comments, newsletter signup, analytics, localisation, a web version of the app.
- **Undecided:** pricing and whether the app is free are not stated anywhere; the site must not claim
  either. The support email address is still a placeholder in `support.md`.

## Brand Commitments

- Names: the app is **Backpack Weight Tracker**; the short brand is **bxpk**, set in lowercase.
- Anchors (BRAND.md §1): **Capable, Unfussy, Grounded, Precise, Companionable.** Reads "trail" before
  it reads "app". No neon, no maximalist gradients, no cold enterprise tone, no alarm-style urgency.
- Mark: **CS-02**, centered switchbacks forming an X, amber crossing over moss (DESIGN_DECISIONS.md,
  Brand). Light surfaces use the deepened tones.
- Approved app direction: **Topo** (contour-line texture in each hero, weight shown as
  instrumentation), light and dark both shipping.
- Copy rules (owner mandates): no em dashes, no emoji, outline stroke icons only, every number carries
  its unit.
- Visual inspirations named in BRAND.md §2: USGS quadrangle maps, mid-century park and expedition
  posters, gear hang-tags and spec sheets, trail blazes and enamel patches.
- Owner's stated site references: lovable.dev website-inspiration guides and land-book.com, as a
  general quality bar.
- Visual direction changes go to the owner as mockups for approval before they are built.

## Evidence on Hand

- Real product facts: the legal pages in `src/content/legal/`, the app's shipped feature record in
  `bxpk/docs/design/DESIGN_DECISIONS.md`, and the brand marks in `bxpk/branding/marks/`.
- Real release history exists as merged PRs in the `bxpk` repo, usable as source for release notes.
- **Absent, and not to be fabricated:** App Store id and rating, download counts, testimonials,
  press coverage, community size, pricing, and App Store screenshots. Sample trips, posts and
  release notes used in mockups must be labelled as samples.

## Product Principles

1. **Say the number and move on.** Every claim the site makes is a measurement or a feature the app
   actually has, with its unit.
2. **Honest about status.** Coming soon means coming soon: no badge, no fake ratings, no invented
   social proof.
3. **The trail comes first.** The site should feel like planning a trip, not like buying software.
4. **Private by default on the site too.** Nothing on the site tracks the visitor.
5. **The owner can keep it current alone.** Publishing a release note or story never needs a
   developer.

## Accessibility & Inclusion

WCAG 2.2 AA: text contrast, keyboard focus, landmarks, alt text, 44 px touch targets.
`prefers-reduced-motion: reduce` gets a complete, static, fully visible page.
