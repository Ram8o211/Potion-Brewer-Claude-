"""Build the ingredient piece atlas from the hand-picked piece art.
Dev-time only: `python scripts/make-ingredient-pieces.py` (needs Pillow and NumPy).

art/icons/pieces_sheet.png holds, for every wild ingredient, a set of four
painted pieces (2 x 2) on a transparent sheet, laid out exactly like the
icon sheet (art/icons/ingredients_sheet.png): same rows, same reading order
(KEYS). These are what goes into the cauldron: every whole object poured
takes one of its ingredient's four pieces at random.

Each set is found by its opaque pixels (rows, then sets within a row, split
at transparent gaps), split into its four pieces at the emptiest lines
through its middle, cleaned (the sheet's faint, coloured fringe is dropped:
the cauldron draws a piece fully opaque or not at all, with a dark rim baked
in), fitted into a CELL px square (centred, aspect kept) and packed into a
grid, one ingredient per row, snapped to 256 colours. A MASK x MASK
silhouette of every piece goes with it: the simulation lays a poured
object's particles out over it (materials/shapes.js), so what tumbles and
collides is the shape that is drawn.

Writes assets/icons/pieces.png and src/materials/pieces.js (the frames and
silhouettes).
"""
import os
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'art', 'icons', 'pieces_sheet.png')
OUT = os.path.join(ROOT, 'assets', 'icons', 'pieces.png')
JS = os.path.join(ROOT, 'src', 'materials', 'pieces.js')
CELL, PAD, MASK = 40, 1, 20
ALPHA = 150  # opacity a piece pixel needs (the rest is fringe)

# the sheet's sets in reading order (materials/wild.js keys), as on the icon sheet
KEYS = [
    'ironroot', 'silverleaf', 'nightshade', 'emberbark', 'owlberry', 'witchear', 'mandrake',
    'heartpetal', 'sunthistle', 'nettle', 'dreamclover', 'sulfur', 'lodestone', 'cinnabar',
    'emberflint', 'mica', 'saltpetre', 'willowbark', 'reedmace', 'riverpearl',
    'riverchalk', 'frostcap', 'bogbean', 'beebalm', 'hemlock', 'ashbloom', 'obsidian',
    'dragonpepper', 'cinderscale', 'moonlily', 'toadstool', 'sirenreed', 'gravemoss', 'starquartz',
    'wisplichen', 'stormglass',
]


def runs(v, gap):
    idx = np.where(v)[0]
    out, s, p = [], idx[0], idx[0]
    for i in idx[1:]:
        if i - p > gap:
            out.append((s, p + 1))
            s = i
        p = i
    out.append((s, p + 1))
    return out


def sets(m):
    boxes = []
    for y0, y1 in runs(m.sum(1) > 0, 12):
        for x0, x1 in runs(m[y0:y1].sum(0) > 0, 12):
            ys = np.where(m[y0:y1, x0:x1].sum(1) > 0)[0]
            if (x1 - x0) * (ys[-1] - ys[0]) < 3000:
                continue  # a stray speck
            boxes.append((int(x0), int(y0 + ys[0]), int(x1), int(y0 + ys[-1] + 1)))
    return boxes


def split(v):
    """The emptiest line through the middle third of a profile."""
    n = len(v)
    lo, hi = n // 3, n - n // 3
    return lo + int(np.argmin(v[lo:hi]))


def components(m):
    """Label 4-connected components of a boolean mask (no SciPy needed)."""
    lab = np.zeros(m.shape, np.int32)
    sizes = [0]
    h, w = m.shape
    for y in range(h):
        for x in range(w):
            if not m[y, x] or lab[y, x]:
                continue
            k = len(sizes)
            stack, n = [(y, x)], 0
            lab[y, x] = k
            while stack:
                cy, cx = stack.pop()
                n += 1
                for ny, nx in ((cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)):
                    if 0 <= ny < h and 0 <= nx < w and m[ny, nx] and not lab[ny, nx]:
                        lab[ny, nx] = k
                        stack.append((ny, nx))
            sizes.append(n)
    return lab, sizes


def piece(a):
    """Crop one piece: its main body and any sizeable parts beside it, fringe dropped."""
    m = a[..., 3] >= ALPHA
    lab, sizes = components(m)
    big = max(sizes)
    keep = np.isin(lab, [k for k, n in enumerate(sizes) if k and n >= big * 0.06])
    ys, xs = np.where(keep)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    out = a[y0:y1, x0:x1].copy()
    out[..., 3] = np.where(keep[y0:y1, x0:x1], 255, 0)
    out[out[..., 3] == 0] = 0
    return Image.fromarray(out, 'RGBA')


def rim(cell):
    """Hard alpha and a dark rim on the outermost pixels, so the piece reads against the brew."""
    a = np.array(cell).astype(np.float32)
    on = a[..., 3] >= 128
    pad = np.pad(on, 1)
    edge = on & ~(pad[:-2, 1:-1] & pad[2:, 1:-1] & pad[1:-1, :-2] & pad[1:-1, 2:])
    a[..., :3][edge] *= 0.55
    a[..., 3] = np.where(on, 255, 0)
    a[~on] = 0
    return Image.fromarray(a.round().astype(np.uint8), 'RGBA'), on


def main():
    img = Image.open(SRC).convert('RGBA')
    a = np.array(img)
    boxes = sets(a[..., 3] >= ALPHA)
    assert len(boxes) == len(KEYS), f'{len(boxes)} sets on the sheet, {len(KEYS)} keys'
    sheet = Image.new('RGBA', (4 * CELL, len(KEYS) * CELL), (0, 0, 0, 0))
    out = {}
    for row, (key, (x0, y0, x1, y1)) in enumerate(zip(KEYS, boxes)):
        s = a[y0:y1, x0:x1]
        m = s[..., 3] >= ALPHA
        sx, sy = split(m.sum(0)), split(m.sum(1))
        quads = [s[:sy, :sx], s[:sy, sx:], s[sy:, :sx], s[sy:, sx:]]
        frames = []
        for n, q in enumerate(quads):
            p = piece(q)
            k = (CELL - 2 * PAD) / max(p.size)
            p = p.resize((max(1, round(p.width * k)), max(1, round(p.height * k))), Image.LANCZOS)
            cell = Image.new('RGBA', (CELL, CELL), (0, 0, 0, 0))
            cell.alpha_composite(p, ((CELL - p.width) // 2, (CELL - p.height) // 2))
            cell, on = rim(cell)
            cx, cy = n * CELL, row * CELL
            sheet.alpha_composite(cell, (cx, cy))
            r = CELL // MASK
            sil = on.reshape(MASK, r, MASK, r).mean((1, 3)) >= 0.5
            rows = [''.join('1' if b else '0' for b in line) for line in sil]
            hexrows = ''.join(f'{int(bits, 2):0{(MASK + 3) // 4}x}' for bits in rows)
            frames.append((cx, cy, hexrows))
        out[key] = frames
    sheet.quantize(256, method=Image.FASTOCTREE, dither=Image.Dither.NONE).save(OUT, optimize=True)
    lines = [
        '// Generated by scripts/make-ingredient-pieces.py from art/icons/ — do not edit.',
        '// The four painted pieces of every wild ingredient: the top-left corner of',
        '// each piece\'s PIECE_CELL px cell in PIECES_URL, and its PIECE_MASK square',
        '// silhouette (rows of hex digits, most significant bit leftmost).',
        '',
        "export const PIECES_URL = 'assets/icons/pieces.png';",
        f'export const PIECES_SIZE = /** @type {{[number, number]}} */ ([{sheet.width}, {sheet.height}]);',
        f'export const PIECE_CELL = {CELL};',
        f'export const PIECE_MASK = {MASK};',
        '/** @type {Record<string, [number, number, string][]>} */',
        'export const PIECES = {',
    ]
    for k in sorted(out):
        lines.append(f'  {k}: [')
        for (x, y, m) in out[k]:
            lines.append(f"    [{x}, {y}, '{m}'],")
        lines.append('  ],')
    lines += ['};', '']
    with open(JS, 'w') as f:
        f.write('\n'.join(lines))
    print(f'wrote {OUT} ({sheet.width}x{sheet.height}) and {JS}')


if __name__ == '__main__':
    main()
