# Interface — source art

`source/sheet1.png` and `source/sheet2.png` (1536 × 1024, transparent): the
interface sprite sheets — frames and panels, room headers, buttons, room
tabs, controls, chips, slots, garden beds, potion shelves, decorations and
icons.

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
