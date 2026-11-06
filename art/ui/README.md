# Interface — source art

`source/sheet1.png` and `source/sheet2.png` (1536 × 1024, transparent): the
interface sprite sheets — frames and panels, room headers, buttons, room
tabs, controls, chips, slots, garden beds, potion shelves, decorations and
icons.

`source/garden1.png` and `source/garden2.png` (1448 × 1086, transparent): the
garden sheets — sky, treeline, hedges, fences, lawn tiles, flowers and props,
the beds (soil, fungal, mineral, tide; each plain, dry, watered, greenhouse,
Arcane chamber, ripe), the bed thumbnails for the plot cards, the chosen and
ripe corner markers, water drops, the moisture gauge, seed frames and the
garden's count icons. The sheet's own growing plants are not used: crops are
drawn from the ingredient atlases' growth stages on top of the beds.

`scripts/slice-ui-sheets.py` finds every sprite on them, names it, keys the
icons out of their backings and writes the ones the game references to
`assets/ui` (palette-quantized). Run it again after changing the sheets or
after referencing a new sprite from `src/` or `styles/`:

    python3 scripts/slice-ui-sheets.py              # → assets/ui
    python3 scripts/slice-ui-sheets.py --all DIR    # the whole named library

The stylesheet draws frames, cards, buttons and tabs as nine-slice
`border-image`s on a `::before` layer, so a sprite never changes an
element's size; `src/ui/icons.js` (`SPRITE_ICONS`) lists the icons taken
from the sheet.
