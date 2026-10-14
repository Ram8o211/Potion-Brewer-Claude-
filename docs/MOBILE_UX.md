# Mobile UX

The shop is designed for a phone held upright first; landscape phones,
tablets and desktop rearrange the same rooms instead of being separate
layouts.

## Rooms and navigation

The shop screen (`src/ui/lab.js`) is a shell around five rooms. A bottom
tab bar switches between them; in landscape and on desktop it becomes a
left rail so the cauldron keeps the full height.

| Tab | Room | What happens there |
|---|---|---|
| Counter | `views/counter.js` | the customer and their request as icon chips, the labelled vial, Offer and Certify, haggling, returning customers, the day summary |
| Brew | the cauldron | live simulation, shelf, dose buttons, mortar, fire/frost slider, tools (pour, spoon, pestle, skimmer), lid, bottling |
| Garden | `views/garden.js` | the painted garden (tap a bed to harvest it, or to water it when dry) and one row per bed with plant, water and harvest buttons |
| Testing | `views/testing.js` | the dose source (cauldron or vial), the dropper, the creatures' cages and the Potion ID sliders |
| Book | `views/book.js` | recipes, ingredients, journal, achievements, sales |

The top bar holds the menu (help, settings and saves, tutorial), coins,
reputation and the day, and the Guild Shop, where equipment is bought.
Ingredients cannot be bought: they grow in the garden. Dead creatures are
replaced in the Testing room. On phones in portrait every dialog opens as
a bottom sheet; elsewhere it is a centred panel. The shelf in the Brew
room is the inventory: each jar shows its stock. Tabs carry badges. The
Counter shows **!** for a new customer or a returning one, and **1** when
a sealed vial is waiting. The Garden shows how many beds are ripe.
Keyboard shortcuts (C, V, G, T, J) switch rooms on desktop.

### A small HUD that never covers a control

* Requests, labels, Potion IDs and ingredient cards are icons with
  numbers (leaf ≥ 30, skull ≤ 10), not sentences.
* Notifications (a discovery, a rank, a refund) appear in the top bar's
  **status line**, between the coins and the shop button. They never
  float over the rooms.
* The tutorial coach has its **own grid row** under the top bar. It is
  one short line with an icon, a step counter and a skip button. It
  highlights its target, or the room tab where the target is.
* `tests/browser/layout.spec.mjs` opens every room with the coach and a
  long notification showing. The guided-order test checks before every
  click. Both fail if the coach row or the status line overlaps any
  visible button, jar or slider (each clipped to its own scroll box) on
  every device profile.

The cauldron simulation keeps running in every room (a fire left burning
keeps burning), but it is drawn only while the Brew room is visible.

## Layouts

| Viewport | Arrangement |
|---|---|
| Phone portrait (taller than wide) | top bar · coach row (tutorial only) · order strip · cauldron stage · fire/lid controls · tools · dose chips and a horizontally scrolling shelf · bottom tab bar |
| Phone landscape (≤ 560 px tall, wider than tall) | icon-only tab rail on the left · cauldron stage · a right column with order strip, a wrapping shelf, controls and tools |
| Tablet portrait (≥ 700 px wide, taller than wide) | as phone portrait with larger jars, tool labels, 60 px tabs and more creatures per row |
| Desktop (≥ 960 px, wider than tall) | labelled tab rail · stage with the order strip above · side panel with the shelf as a wrapping grid · tools and controls below |

In phone landscape and on desktop the Garden puts the scene beside the
bed list, and the Testing room puts the creatures beside the Potion ID
panel. Only the lists scroll, so the scene and the sliders stay in reach.

Safe-area insets (`env(safe-area-inset-*)`) pad the top bar, the tab bar
and the sheets, so nothing sits under a notch or the home indicator.

## Touch targets

Every button, tab, dose chip, bed button, creature button and ID or
price slider is at least 44 × 44 CSS px (tabs 52 px tall, the dropper
48 px).
`tests/browser/layout.spec.mjs` measures every visible interactive element
in every room on every device profile and fails on anything smaller than
44 px.

## Gestures and their alternatives

Every gesture except skimming has a tap or hold alternative, so almost
nothing depends on precise dragging.

| Gesture | Alternative |
|---|---|
| Drag a jar from the shelf onto the cauldron (pours where the stream falls) | tap the jar, then tap a dose chip, or hold inside the cauldron |
| Drag the spoon to stir | hold the stir button (or toggle it with the clockwork stirrer upgrade) |
| Strike stones with the pestle in the pot | switch on the mortar so stones are smashed to powder before pouring |
| Drag the skimmer | none |
| Drag the dropper onto a creature | the creature's dose button |
| Tap a bed in the garden scene | the bed's harvest or water button in the list |
| Drag the price slider while haggling | the −5, −1, +1 and +5 buttons |
| Long-press a jar (or right-click) to inspect it | the ingredient list in the Book |

Pointer handling rules:

* A second finger never fights the first: the cauldron canvas follows only
  the pointer that started the gesture.
* Pinch-zoom, double-tap zoom and scroll bounce are blocked over the
  cauldron (`touch-action: none`, `touchmove` prevented), but scrolling
  works everywhere else (`touch-action: pan-y` / `pan-x` on rooms and the
  shelf).
* A jar is lifted by a drag *across* its shelf's scroll direction, so
  scrolling along the shelf keeps working. The portrait shelf scrolls
  sideways, so an upward drag lifts the jar. In landscape and on desktop
  the shelf is a column that scrolls up and down, so a sideways drag lifts
  it. Dragging out of the shelf always lifts the jar.
* A mouse is captured explicitly so a drag keeps reporting outside the
  jar; touch pointers keep native scrolling.

## Readability

Text uses the bundled pixel font at three sizes (`--fs-s/m/l`). Muted text
on parchment uses a darker ink so it keeps contrast. Creature reactions
have no text at all: what a potion does is read from the pictures, and
the replay button shows the last reaction again.

## Graphics presets

Settings → Graphics offers **Automatic** (the default), **High quality**,
**Balanced** and **Battery saver**. They change only rendering:
* High quality uses the finest art pixels and every glow.
* Balanced keeps the lighting at full frame rate with coarser pixels on
  large canvases.
* Battery saver uses coarser pixels, no lighting and a 30 fps draw cap.

Physics, quantities and magic are identical in every mode. Measured costs
are in `docs/PERFORMANCE.md`.

## Offline and installability

The production build is a PWA: `manifest.webmanifest`, icons, and a
service worker that precaches the fingerprinted bundle, stylesheet and
font. `tests/browser/offline.spec.mjs` cuts the network and keeps playing,
and `tests/browser/subpath.spec.mjs` serves the build under
`/Potion-Brewer-Claude-/` as GitHub Pages would.

## What was verified, and how

* Chromium device emulation (Playwright) for phone portrait 390×844,
  phone landscape 844×390, tablet 820×1180 and desktop 1440×900, with
  touch input sent through the DevTools protocol on the touch profiles.
* Screenshots of each room on each profile, in `docs/screenshots/`.
* **Not verified on physical phones or tablets, and not in Safari or
  Firefox.**
