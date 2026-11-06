"""Slice the ingredient icon sheet (art/ingredients/source/icons-sheet.png:
12 biome rows of 10 species, each icon drawn at 3x in a 192x192 cell on a
transparent ground) into one native icon atlas, pixel for pixel:
assets/ingredients/icons.png (64x64 cells, the same rows and columns) and
the box each icon fills in it: src/visual/ingredient-icons.js.

  python3 scripts/slice-ingredient-icons.py

Rows follow the biomes' atlas order (scripts/build-atlases.mjs SHEET_BIOMES),
columns the species' slots. Every native pixel is the centre of its 3x3
block; lone specks are dropped, the contour is cleaned and outlined
(polish), and the atlas is palette-quantized."""
import json, os, subprocess, sys
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC = os.path.join(ROOT, 'art', 'ingredients', 'source', 'icons-sheet.png')
OUT = os.path.join(ROOT, 'assets', 'ingredients', 'icons.png')
TABLE = os.path.join(ROOT, 'src', 'visual', 'ingredient-icons.js')
PLANTS = os.path.join(ROOT, 'assets', 'atlases', 'ingredient-plants.png')
BIOMES = ['forest', 'meadow', 'river', 'quarry', 'netherwood', 'crags', 'moonfen', 'skyshard', 'morphgrove', 'veilhollow', 'ghostglass', 'chronoglass']
CELL, K = 192, 3
N = CELL // K

def polish(cell):
    """Clean contours: fill one-pixel notches (thin stems and roots are kept), then
    draw a 1-pixel outline just outside the shape in a darkened shade of the
    colour it borders (a selective outline)."""
    px = cell.load()
    W, H = cell.size
    op = lambda x, y: 0 <= x < W and 0 <= y < H and px[x, y][3] > 0
    N4 = ((1, 0), (-1, 0), (0, 1), (0, -1))
    notches = [(x, y) for y in range(H) for x in range(W) if not op(x, y) and sum(op(x + a, y + b) for a, b in N4) >= 3]
    for x, y in notches:
        cs = [px[x + a, y + b] for a, b in N4 if op(x + a, y + b)]
        px[x, y] = tuple(sum(c[i] for c in cs) // len(cs) for i in range(3)) + (255,)
    rim = {}
    for y in range(H):
        for x in range(W):
            if op(x, y): continue
            cs = [px[x + a, y + b] for a, b in N4 if op(x + a, y + b)]
            if not cs: continue
            r, g, b = (sum(c[i] for c in cs) / len(cs) for i in range(3))
            # darker and a little cooler than what it borders, never pure black
            rim[(x, y)] = (int(r * 0.26 + 12), int(g * 0.24 + 9), int(b * 0.30 + 16), 255)
    for q, c in rim.items(): px[q] = c

species = json.loads(subprocess.check_output(['node', '-e',
  "import('./src/materials/species-data.js').then(m=>console.log(JSON.stringify(m.SPECIES_DATA.map(s=>[s.key,s.biome,s.slot]))))"], cwd=ROOT))
sheet = Image.open(SRC).convert('RGBA')
if sheet.size != (CELL * 10, CELL * len(BIOMES)): sys.exit(f'unexpected sheet size {sheet.size}')
atlas = Image.new('RGBA', (N * 10, N * len(BIOMES)), (0, 0, 0, 0))
boxes = {}
raw_cells = {}
for key, biome, slot in species:
    row = BIOMES.index(biome)
    X, Y = slot * CELL, row * CELL
    cell = Image.new('RGBA', (N, N), (0, 0, 0, 0))
    for j in range(N):
        for i in range(N):
            c = sheet.getpixel((X + K * i + 1, Y + K * j + 1))
            if c[3] >= 128: cell.putpixel((i, j), c[:3] + (255,))
    # a speck (an island of 3 pixels or fewer) is not part of the icon; sparkles are larger
    px, seen = cell.load(), set()
    for j in range(N):
        for i in range(N):
            if not px[i, j][3] or (i, j) in seen: continue
            group, todo = [], [(i, j)]
            seen.add((i, j))
            while todo:
                x, y = todo.pop(); group.append((x, y))
                for a in (-1, 0, 1):
                    for b in (-1, 0, 1):
                        q = (x + a, y + b)
                        if 0 <= q[0] < N and 0 <= q[1] < N and q not in seen and px[q][3]: seen.add(q); todo.append(q)
            if len(group) <= 3:
                for q in group: px[q] = (0, 0, 0, 0)
    raw_cells[key] = cell.copy()
    polish(cell)
    bb = cell.getbbox()
    if bb is None: sys.exit(f'empty icon: {key}')
    atlas.paste(cell, (slot * N, row * N))
    boxes[key] = [slot * N + bb[0], row * N + bb[1], bb[2] - bb[0], bb[3] - bb[1]]
os.makedirs(os.path.dirname(OUT), exist_ok=True)
# palette-quantized (as the interface sheets are): a quarter of the bytes, no visible change
atlas.quantize(colors=256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE).save(OUT, optimize=True)
# ---- the plants in the Wilds (and growing in the Garden): the same art at three sizes, at the
# scene's detail (2 art pixels per scene pixel), so they stand at the size the wilds were drawn for.
# Each is box-filtered down from the clean cell, its alpha cut at a half, then polished and outlined
# at its own size (an outline is never scaled).
PLANT_SIZES = (('mature', 30), ('ripe', 23), ('sprout', 15))
PLANT_CELL = 34
plants = Image.new('RGBA', (PLANT_CELL * len(PLANT_SIZES) * 10, PLANT_CELL * len(BIOMES)), (0, 0, 0, 0))
plant_boxes = {}
for key, biome, slot in species:
    cell = raw_cells[key]
    bb = cell.getbbox()
    src = cell.crop(bb)
    w0, h0 = src.size
    plant_boxes[key] = {}
    for n, (stage, size) in enumerate(PLANT_SIZES):
        f = min(1.0, (size - 2) / max(w0, h0))
        w, h = max(1, round(w0 * f)), max(1, round(h0 * f))
        # (Pillow weighs colours by alpha when it resizes RGBA: transparent pixels lend no colour to the edge)
        small = src.resize((w, h), Image.BOX)
        out = Image.new('RGBA', (w + 2, h + 2), (0, 0, 0, 0))
        q, o = small.load(), out.load()
        for j in range(h):
            for i in range(w):
                r, g, b, a = q[i, j]
                if a >= 128: o[i + 1, j + 1] = (r, g, b, 255)
        polish(out)
        X = (slot * len(PLANT_SIZES) + n) * PLANT_CELL
        Y = BIOMES.index(biome) * PLANT_CELL
        bb2 = out.getbbox()
        out = out.crop(bb2)
        plants.paste(out, (X, Y))
        plant_boxes[key][stage] = [X, Y, out.size[0], out.size[1]]
# palette-quantized like the icons (the atlas loader reads palette PNGs too)
plants.quantize(colors=256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE).save(PLANTS, optimize=True)

with open(TABLE, 'w') as f:
    f.write('// Generated by scripts/slice-ingredient-icons.py — do not edit.\n')
    f.write('// Each catalog species\' icon in assets/ingredients/icons.png: [x, y, w, h] in native pixels.\n\n')
    f.write("export const ICON_SHEET = 'assets/ingredients/icons.png';\n\n")
    f.write('/** @type {Record<string, [number, number, number, number]>} */\nexport const ICON_BOXES = {\n')
    for key, _, _ in species: f.write(f"  '{key}': {json.dumps(boxes[key])},\n")
    f.write('};\n\n')
    f.write("/** Each species' plant at its three sizes (sprout, ripe, mature) in assets/atlases/ingredient-plants.png: [x, y, w, h]. */\n")
    f.write("export const PLANT_SHEET = 'ingredient-plants.png';\n")
    f.write('/** @type {Record<string, Record<\'sprout\'|\'ripe\'|\'mature\', [number, number, number, number]>>} */\nexport const PLANT_BOXES = {\n')
    for key, _, _ in species: f.write(f"  '{key}': {json.dumps(plant_boxes[key], separators=(', ', ': '))},\n")
    f.write('};\n')
print(f'{len(species)} icons sliced into {OUT}')
