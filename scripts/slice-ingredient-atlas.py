"""Slice the ingredient atlas sheets (art/ingredients/source/atlas-ordinary.png
and atlas-arcane.png: 12 biome rows of 10 species, each a 24x24 sprite drawn
at 3x on a card) into native 24x24 RGBA sprites, pixel for pixel:
art/ingredients/source/native/<key>.png and <key>@arcane.png.

  python3 scripts/slice-ingredient-atlas.py

Rows follow scripts/build-atlases.mjs SHEET_BIOMES, columns the species'
slots. Every native pixel is the centre of its 3x3 block; the card's
background colour is transparent. Nothing is recoloured or cleaned."""
import json, os, subprocess, sys
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC = os.path.join(ROOT, 'art', 'ingredients', 'source')
OUT = os.path.join(SRC, 'native')
BIOMES = ['forest', 'meadow', 'river', 'quarry', 'netherwood', 'crags', 'moonfen', 'skyshard', 'morphgrove', 'veilhollow', 'ghostglass', 'chronoglass']
CELL_X, CELL_Y, STEP_X, STEP_Y = 36, 92, 151, 132   # top-left of the first card, and the card pitch
BOX_X, BOX_Y, K, N = 34, 11, 3, 24                  # the sprite's 24x24 box inside a card, at 3x
TEXT_Y = 80                                          # the card's caption starts here (never sprite)

species = json.loads(subprocess.check_output(['node', '-e',
  "import('./src/materials/species-data.js').then(m=>console.log(JSON.stringify(m.SPECIES_DATA.map(s=>[s.key,s.biome,s.slot]))))"], cwd=ROOT))
os.makedirs(OUT, exist_ok=True)
for suffix, name in (('', 'atlas-ordinary.png'), ('@arcane', 'atlas-arcane.png')):
    sheet = Image.open(os.path.join(SRC, name)).convert('RGB')
    for key, biome, slot in species:
        X, Y = CELL_X + STEP_X * slot, CELL_Y + STEP_Y * BIOMES.index(biome)
        bg = sheet.getpixel((X + 5, Y + 5))
        out = Image.new('RGBA', (N, N), (0, 0, 0, 0))
        for j in range(N):
            sy = Y + BOX_Y + K * j + 1
            if sy - Y >= TEXT_Y: continue
            for i in range(N):
                c = sheet.getpixel((X + BOX_X + K * i + 1, sy))
                if c != bg: out.putpixel((i, j), c + (255,))
        if out.getbbox() is None: sys.exit(f'empty sprite: {key}{suffix}')
        out.save(os.path.join(OUT, f'{key}{suffix}.png'))
print(f'{len(species)} species sliced into {OUT}')
