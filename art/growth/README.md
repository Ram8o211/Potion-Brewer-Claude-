# Growth Atlas — source art

`growth_atlas.png` is the *Potion Brewer — Growth Atlas* sheet: one panel per
region, one row per wild ingredient, and three cells per row for its sprout,
ripe and mature stages. The game never loads this file.
`python scripts/make-growth.py` (needs Pillow and NumPy) cuts each cell out of
its parchment, brings all stages down by the same factor (so a sprout stays
small beside its mature plant) to twice the scene's resolution (`RES`: the
scene is drawn on a canvas twice its art-pixel size, so the plants keep
their detail), peels off the parchment's pale rim and outlines them on the
sides and top in a deep shade of each edge's own colour (no flat ink ring
and no line under the foot, so a plant stands in the scene rather than on
it like a sticker), adds a light-outlined
hover frame for the mature stage and packs them into
`assets/growth/atlas.png`, with the frame map in
`src/rendering/growth-atlas.js`.

The rows are matched to the ingredients by their wild key
(`src/materials/wild.js`); the names printed on the sheet carry one world's
name prefixes.
