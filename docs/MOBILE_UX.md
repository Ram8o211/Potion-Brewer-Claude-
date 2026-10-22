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
| Counter | `views/counter.js` | the customer, the full order with which effects are already verified, the sealed vial, serving, the day summary |
| Brew | the cauldron | live simulation, shelf, dose buttons, fire/frost slider, tools (pour, spoon, pestle, skimmer, probe), lid, mortar, bottling |
| Wilds | `views/wilds.js` | regions, a painted scene with tappable deposits and the same deposits as a list |
| Trials | `views/trials.js`, `views/hutch.js` | the rabbit farm: the hutch scene, a Give button and the dropper right under it, the roster, the chosen rabbit's health and status bars, purge / put down, dose size, source (cauldron tap or vial), reports and the batch estimate |
| Book | `views/book.js` | recipes, trial log, laws, journal, ingredients, awards, sales |

The top bar holds the menu (help, settings and saves, tutorial), coins,
rank, day and the Market & Guild, where reagents, common wild herbs and
upgrades are bought (dead rabbits are replaced in the Trials room).
On phones in portrait every dialog opens as a bottom sheet; elsewhere it is
a centred panel. The shelf in the Brew room is
the inventory: each jar shows its stock. Tabs carry badges: the Counter
shows **1** when a sealed vial is waiting and **!** for a new customer; the
Trials tab shows **?** while the order still needs effects you have not
verified. Keyboard shortcuts (C, V, W, T, J) switch rooms on desktop.

The cauldron simulation keeps running in every room (a fire left burning
keeps burning), but it is drawn only while the Brew room is visible.

## Layouts

| Viewport | Arrangement |
|---|---|
| Phone portrait (taller than wide) | top bar · order strip · cauldron stage · fire/lid controls · tools · dose chips and a horizontally scrolling shelf · bottom tab bar |
| Phone landscape (≤ 560 px tall, wider than tall) | icon-only tab rail on the left · cauldron stage · a right column with order strip, a wrapping shelf, controls and tools |
| Tablet portrait (≥ 700 px wide, taller than wide) | as phone portrait with larger jars, tool labels, 60 px tabs and three subjects per row |
| Desktop (≥ 960 px, wider than tall) | labelled tab rail · stage with the order strip above · side panel with the shelf as a wrapping grid · tools and controls below |

In phone landscape and on desktop the Wilds put the scene beside the
deposit list. The region tabs and the scene stay put, and only the list
scrolls, so the scene is always there to tap.

Safe-area insets (`env(safe-area-inset-*)`) pad the top bar, the tab bar
and the sheets, so nothing sits under a notch or the home indicator.

## Touch targets

Every button, tab, dose chip, region tab and deposit button is at least
44 × 44 CSS px (tabs 52 px tall, the dropper and gather buttons 48 px).
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
| Strike with the pestle to crush | switch on "Ground" so the mortar grinds before pouring |
| Drag the skimmer | none |
| Drag the dropper onto a rabbit | tap the rabbit, then **Give** |
| Tap a deposit in the wilds scene | the deposit's **Gather** button in the list |
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
on parchment uses a darker ink so it keeps contrast. Pour hints sit at the
bottom of the stage, clear of the order strip and chips.

## Graphics presets

Settings → Graphics offers **Automatic** (the default), **High quality**,
**Balanced** and **Battery saver**. They change only rendering:
* High quality uses the finest art pixels and every glow.
* Balanced keeps the lighting at full frame rate with coarser pixels on
  large canvases.
* Battery saver uses coarser pixels, no lighting and a 30 fps draw cap.

Physics, quantities and scores are identical in every mode. Measured costs
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
