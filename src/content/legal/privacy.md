---
title: Privacy Policy
---

# Privacy Policy

**Effective: 25 September 2026**

This policy explains what Backpack Weight Tracker collects, why, who it is shared with, and what
you can do about it. It is written to be read, not to be survived.

## Who we are

Backpack Weight Tracker ("the app", "we", "us") is operated by Fisher Bricker, in Oregon, United
States. Contact us through the [support page](https://fisherbricker.github.io/bxpk-legal/support).

## What we collect

**Your account.** Email address and a handle, so you can sign in and other people can find you.
Sign-in is handled by Firebase Authentication. If you sign in with Apple or Google, we receive what
that service passes us, usually an email address and a name. With Sign in with Apple you can choose
to share a private relay address instead of your real one. We also record which version of the
Terms of Service you accepted, and when.

**What you put in the app.** Gear (names, categories, weights, prices, notes and purchase links),
trips, packs, meal plans, food, fuel, resupply points, itineraries, trip notes, and the location you
choose for a trip. Routes you plan, meaning the points you place on the map and the path between
them. Posts, forum discussions, comments and reactions, and the photos and videos you attach to
them. What you link to a post: a copy of one of your trips (the details you choose to show, such as
its numbers, its gear list and its route) and of the gear you spotlight. A post's sound, if you add
one: a recording you make in the app, or the sound taken from one of your own videos. Your display
name and profile photo. Items you save for later, including routes you save from other people's
posts.

**Body measurements, if you enter them.** Height, body weight, birthdate and biological sex. These
are used for one thing: estimating how many calories a day of walking with a given pack weight is
likely to burn. Your birthdate is also used to confirm you meet the minimum age. They are stored
separately from your profile, they are never shown to other people, and they are never sold or used
for advertising.

**Who you are connected to.** Your friends, the people you follow and who follow you, the trips you
share, and the gear you have claimed a share of.

**Your weight and trip history.** Your profile keeps a history of your base weight, a short summary
of recently finished trips (name, date, distance and climb), and the achievements you have earned.

**Device checks.** We use Apple's App Attest to confirm requests come from a genuine copy of the
app, and Apple's DeviceCheck to recognise a device that has previously been banned. Neither
reveals who you are, and neither can be used to track you across other apps.

**Crash reports.** When the app crashes, or a sync keeps failing, Firebase Crashlytics sends us a
report: the app version, device model, iOS version, and what the app was doing at the time. Reports
are not linked to your account. We use them only to find and fix problems.

**App configuration.** The app checks Firebase Remote Config for settings such as the oldest version
we still support. This uses an identifier Firebase assigns to the installation, not your account.

**Advertising data.** The app shows ads through Google AdMob. If you allow tracking when iOS asks,
AdMob may use your device's advertising identifier to personalise ads. If you decline, you see the
same number of ads, chosen without it. See [how Google uses
information](https://policies.google.com/technologies/partner-sites).

**Your microphone** is used only while you record a sound for a post, and only after iOS asks
your permission. Nothing is recorded at any other time.

We do not use your contacts, your camera, Apple Health or motion data. Photos and videos are chosen
with the iOS picker, which gives the app only the items you pick.

## Location

**Your device's location** is used to show where you are on a map, and to record a route while you
are recording one, including in the background if you allow it. A recorded route stays on your
phone. It leaves only if you export or share the GPX file yourself, or share the route on a post.

**Routes you plan** are sent to our servers so the path between your points can be worked out along
trails and roads, and so its height and climb can be measured. A planned route is saved with its
trip, synced to your other devices, and visible to the people on that trip.

**Routes you share on a post.** When you link a trip to a post, you choose whether to share its
planned route or its recorded route, or neither. A shared route is copied into the post and can be
seen by everyone who can see the post. By default the first and last 500 metres are cut off the
shared copy, along with any points and markers there, so it does not show where you started, for
example your home; you can turn that off for a trailhead. Anyone who can see the post can save a copy
of the route to their own private list and plan a trip from it. They are not told who else saved it,
and you are not told who saved yours.

**A trip's location** is the place you pick in the app's location search. It is stored with the
trip, and it is sent to the US National Weather Service to fetch that trip's forecast and alerts.
Location search itself is provided by Apple Maps.

**Offline maps.** When you download a map for a trip, the area you asked for is sent to our servers
so the download can be cut to size. The prepared download is kept for up to 60 days so it can be
fetched again.

**Sounds you post.** A recording, or the sound taken from one of your videos, is stripped of the
details stored inside the file, including any location, before it is uploaded, and our servers strip
it again after upload.

**Photos and videos you post.** Photos are re-saved by the app before upload, which removes any
location or camera details stored inside them. Videos are uploaded as they are, so a video may
still carry the place it was recorded if your camera stored one. You can stop the Camera app from
storing it in iOS Settings → Privacy & Security → Location Services → Camera.

We do not track your location in the background for any other purpose, and we do not use it for
advertising.

## How we use it

- To run the app: sign-in, syncing your data between devices, planning routes, preparing offline
  maps, trips you share, friends, posts and forums.
- To suggest gear changes, as described below.
- To keep people safe: filtering slurs from posts and comments, reviewing reports, removing content
  that breaks the [Terms of Service](https://fisherbricker.github.io/bxpk-legal/terms), limiting how
  fast one account can post or upload, and preventing banned accounts from returning.
- To fix problems, using crash reports.
- To show ads, as described above.

We do not sell personal information, and we do not use your gear, trips, routes, posts or body
measurements to target ads.

## Gear suggestions

The app can suggest lighter or better-suited gear. By default these suggestions are made by our
servers using **Google's Gemini** service: when you ask for them, the name, category, weight and
price of each item in your gear list are sent to Google to produce them. We keep a record of how
each of your item names was classified, so the same item is not sent again every time. Nothing else
about you, such as your name, email, trips or location, is included.

If you choose instead to add your own **Anthropic or OpenAI** API key, your gear list is sent from
your phone directly to that provider, under your own account with them, and is subject to their
terms and privacy policy. It does not pass through us. Your key is stored in your phone's keychain
and is never sent to us.

Some gear shows a link to buy it from Amazon. Tapping one sends the item's name to Amazon as a
search. We may earn a commission from qualifying purchases made through those links.

## Who we share it with

- **Google Firebase and Google Cloud** store and sync your data, handle sign-in, run our servers,
  work out planned routes, prepare offline maps, and receive crash reports. They act on our behalf.
- **Google Gemini** receives your gear list when the app makes gear suggestions, as described above.
  It acts on our behalf.
- **Google AdMob** serves ads. Where you have allowed tracking, it may use your advertising
  identifier.
- **Apple** provides sign-in, location search, App Attest and DeviceCheck.
- **The US National Weather Service** receives a trip's location when a forecast is fetched.
- **Anthropic or OpenAI**, only if you add your own API key, as described above.
- **Amazon**, only if you tap a buy link, as described above.
- **Other people in the app**, as described in the next section.
- **Authorities**, where the law requires it, or where it is necessary to protect someone's safety.

If the app is ever sold or transferred, your information would move with it, under a policy at least
as protective as this one.

## What other people can see

- **Your profile** is visible to anyone signed in: your handle, display name and photo, your base
  weight and its history, a summary of your recently finished trips, your achievements, and how many
  people follow you. That is how search and friend requests work. Your privacy setting in Settings
  decides where the app displays your weights and trips, but it does not stop another signed-in
  account from reading them.
- **Your posts and comments** are visible according to the audience you choose when posting. Forum
  discussions are always public, and so is anything linked to one. Comments can be seen by anyone
  who can see the post. You can turn comments on your post off, and delete comments on it.
- **Reactions.** Like and dislike counts are visible to anyone who can see the post. Who liked
  something is visible too. Who disliked something is not: only the person who disliked it can see
  their own dislike, and the post's author cannot. A post with ten or more dislikes than likes is
  taken out of feeds and forums but stays on its author's profile; a comment like that is folded
  away behind a tap.
- **What you link to a post** (a copy of a trip, its route, your gear) is visible to everyone who can
  see the post. It is a copy made when you post: changing or deleting the trip or the gear afterwards
  does not change the post, and editing the post makes a fresh copy. The photo and video files
  attached to a post are stored behind links, and anyone who has one of those links can open the
  file.
- **Auto-Share** posts a highlight when you finalize a trip or earn an achievement. It is on by
  default and can be turned off in Settings.
- **A public profile**, if you turn it on in Settings, lets anyone follow you without a friend
  request.
- **Your gear closet**, meaning your gear, gear systems, packs and pantry, can be viewed by your
  friends.
- **Your trips** are visible only to you, unless you share a trip with someone or post about it.
  A post shows only the copy you chose to link, never the trip itself.
  People on a trip can see its gear, weights, itinerary and planned route. The names and weights of
  gear shared on a trip, and the names of its resupply points, can be read by other signed-in
  accounts that know the trip.
- **Your body measurements and settings are never visible to anyone else.**

## Where it is stored

Google Firebase, on Google Cloud infrastructure in the United States. Data is encrypted in transit
and at rest. The app is offered in the United States and Canada. If you are in Canada, your
information is stored and processed in the United States and is subject to the laws there.

No method of storage or transmission is completely secure, but we protect your information with
industry-standard measures, including access rules that limit what each account can read and write.

## How long we keep it

Until you delete it. Deleting an item deletes it. Deleting your account is covered below. The
exceptions are these:

- **Photos attached to trips and forum discussions** are deleted automatically one year after they
  were uploaded.
- **Crash reports** are kept for up to 90 days.
- **Prepared offline map downloads** are kept for up to 60 days.
- **Content taken down after a report**, described next.

When a post or comment is removed because enough people reported it, we do not delete it
immediately. It is held for review so a mistaken report can be corrected. While it is held:

- **It is not visible to anyone**, not in feeds, forums, search, saved items, or on the profile that
  posted it. Being reviewed and being visible are not the same thing.
- **If review finds the report was wrong, it is restored** and becomes visible again exactly as it
  was.
- **If the report was right, it stays removed** and is kept for our records rather than deleted
  outright, in case it is needed later: for a repeat-offense pattern, a legal request, or a
  reporting obligation that applies to that kind of content.

## Deleting your account

**Settings → Delete Account.** It is immediate and cannot be undone. It removes your account,
profile, handle, photo, gear, trips, planned routes, meal plans, itineraries, friendships,
invitations, your posts and comments and the routes shared on them, the routes you saved from other
people's posts, the sounds you added to posts, and the photos you attached to trips and forum
discussions.

During the beta, a few things are not yet removed automatically when an account is deleted: photos
and videos attached to feed posts and gear showcases, achievement share images, saved items, your
entry in other people's follower lists, and the records we keep about your gear suggestions and
upload limits. We are fixing this. Until then, ask us through the
[support page](https://fisherbricker.github.io/bxpk-legal/support) after deleting your account and
we will remove them by hand.

A few things deliberately survive, and none of them identifies you:

- **A comment of yours that other people replied to** stays as "Deleted user" with the text removed,
  so the conversation underneath still makes sense to the people who took part in it.
- **A route someone else saved from one of your posts** stays in their private list, because they
  chose to keep it. Your name, handle and account are removed from it and it reads "Deleted user".
- **Gear you shared on someone else's trip** keeps its weight but loses its name and your identity,
  so their pack calculations do not silently change.
- **A post or comment of yours taken down after a report** stays exactly as described above, under
  review or on record, with your name and identity removed the same way. Deleting your account is
  not a way to make reported content disappear before it has been looked at.
- **A device ban.** If your account was banned, the mark Apple's DeviceCheck holds for that device is
  not cleared by deleting the account.

Reports you filed about other people are kept, because they are records about those people rather
than about you.

## Your rights

Wherever you live, you can:

- **Access** the personal information we hold about you.
- **Correct** it. Most of it you can edit directly in the app.
- **Delete** it, in the app or by asking us.
- **Get a copy** of it in a portable format.
- **Withdraw consent** for tracking at any time in iOS Settings → Privacy & Security → Tracking.

**California, Oregon and other US states with privacy laws.** You have the rights above, and the
right to opt out of the "sale" or "sharing" of personal information and of targeted advertising. We
do not sell personal information. Personalised advertising through AdMob can count as "sharing" or
targeted advertising under some of these laws; turning off tracking in iOS Settings opts you out of
it. We will not treat you differently for using any of these rights. If we turn down a request, you
can ask us to reconsider, and we will explain our answer.

**Canada.** You have the rights above under PIPEDA and applicable provincial law, and you can
complain to the Office of the Privacy Commissioner of Canada.

To make a request, contact us through the
[support page](https://fisherbricker.github.io/bxpk-legal/support). We will confirm the request comes
from the account holder and respond within 30 days. You can use an authorised agent, who will need
your written permission.

## Beta testing

Before the app is on the App Store, it is available as a beta through Apple's TestFlight. If you
take part, Apple shares with us the email address or name you joined with, the feedback and
screenshots you send through TestFlight, and crash and usage information about the beta, under
[Apple's TestFlight terms](https://www.apple.com/legal/internet-services/itunes/testflight/). We use
it only to improve the app. Everything else in this policy applies to the beta in the same way.

## Children

You must be 13 or older to use the app. We ask for a birthdate when you set up your profile, and an
account that gives an age under 13 is deleted rather than kept. If you believe a child under 13 has
given us information, contact us and we will delete it.

## This website

These pages are hosted on GitHub Pages. They set no cookies and run no analytics or advertising.
GitHub may record your IP address and browser details in its own server logs when you visit, under
[GitHub's privacy statement](https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement).

## Changes

If this policy changes in a way that matters, we will tell you in the app before the change takes
effect, rather than quietly updating this page. The effective date at the top always shows the
current version.

## Contact

[Support page](https://fisherbricker.github.io/bxpk-legal/support).
