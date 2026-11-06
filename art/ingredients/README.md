# Ingredients — source art

`source/icons-sheet.png` (1920 × 2304, transparent): the harvested-ingredient
icons — 12 biome rows (Whisperwood, Sunlit Meadow, Willow Bank, Ironstone
Quarry, Netherwood, Ember Crags, Moonfen, Skyshard, Morphgrove, Veil Hollow,
Ghostglass Reef, Chronoglass Wastes) of 10 species each, in the species'
slot order, drawn at 3× in 192 px cells. They are the ingredient's picture
everywhere an ingredient is listed: the quick shelf, the inventory, the
shop, the book, the ingredient sheet and the Wilds' cards. An Arcane
specimen uses its species' icon with a violet outline. The plants growing
in the Wilds and the Garden are still drawn from the growth atlases.

`scripts/slice-ingredient-icons.py` cuts it, pixel for pixel, into
`assets/ingredients/icons.png` (64 px cells) and writes the box of each
icon to `src/visual/ingredient-icons.js`:

    python3 scripts/slice-ingredient-icons.py
