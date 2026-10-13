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
| Trials | `views/trials.js` | test subjects, the dropper, dose size, source (cauldron tap or vial), reports |
| Book | `views/book.js` | recipes, trial log, laws, journal, ingredients, awards, sales |

The top bar holds the menu (help, settings and saves, tutorial), coins, rank, day
and the Market & Guild, where reagents, common wild herbs and upgrades
are bought (spent test subjects are replaced in the Trials room). On phones in portrait every dialog opens as a
bottom sheet; elsewhere it is a centred panel. The shelf in the Brew room is
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
| Phone landscape (≤ 560 px tall, wider than tall) | icon-only tab rail on the left · cauldron stage · a right column with order strip, shelf, controls and tools |
| Tablet portrait (≥ 700 px wide, taller than wide) | as phone portrait with larger jars, tool labels, 60 px tabs and three subjects per row |
| Desktop (≥ 960 px, wider than tall) | labelled tab rail · stage with the order strip above · side panel with the shelf as a wrapping grid · tools and controls below |

Safe-area insets (`env(safe-area-inset-*)`) pad the top bar, the tab bar
and the sheets, so nothing sits under a notch or the home indicator.

## Touch targets

Every button, tab, dose chip, region tab and deposit button is at least
44 × 44 CSS px (tabs 52 px tall, the dropper and gather buttons 48 px).
`tests/browser/layout.spec.mjs` measures every visible interactive element
in every room on every device profile and fails on anything smaller than
44 px.

## Gestures and their alternatives

Every gesture has a tap alternative, so nothing depends on precise
dragging.

| Gesture | Alternative |
|---|---|
| Drag a jar from the shelf onto the cauldron (pours where the stream falls) | tap the jar, then tap a dose chip, or hold inside the cauldron |
| Drag the spoon / pestle / skimmer in the cauldron | auto-stir toggle; the mortar grinds before pouring |
| Drag the dropper onto a subject | the subject's **Test** button |
| Tap a deposit in the wilds scene | the deposit's **Gather** button in the list |
| Long-press a jar (or right-click) to inspect it | the ingredient list in the Book |

Pointer handling rules:

* A second finger never fights the first: the cauldron canvas follows only
  the pointer that started the gesture.
* Pinch-zoom, double-tap zoom and scroll bounce are blocked over the
  cauldron (`touch-action: none`, `touchmove` prevented), but scrolling
  works everywhere else (`touch-action: pan-y` / `pan-x` on rooms and the
  shelf).
* On the phone shelf, a jar is lifted only by an upward drag, so swiping
  sideways still scrolls the shelf. On desktop, where the shelf is a side
  panel, leaving the shelf lifts the jar.
* A mouse is captured explicitly so a drag keeps reporting outside the
  jar; touch pointers keep native scrolling.

## Readability

Text uses the bundled pixel font at three sizes (`--fs-s/m/l`). Muted text
on parchment uses a darker ink so it keeps contrast. Pour hints sit at the
bottom of the stage, clear of the order strip and chips.

## Graphics presets

Settings → Graphics: **Automatic** (default), **High quality**,
**Balanced** and **Battery saver**. They change only rendering: art-pixel
size, lighting and glow, effects, and for Battery saver a 30 fps draw cap.
Physics, quantities and scores are identical in every mode. Measured
costs are in `docs/PERFORMANCE.md`.

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
