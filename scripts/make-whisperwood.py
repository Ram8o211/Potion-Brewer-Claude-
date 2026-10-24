"""Build the Whisperwood sprite atlas from the concept-art sprite pack.
Dev-time only: `python scripts/make-whisperwood.py` (needs Pillow).

The pack in art/whisperwood/ was cut from a generated concept atlas: soft
edges, an uneven ~2 px grid and far more colours than pixel art uses. Each
sprite is brought down to the scene's art-pixel scale (4 source pixels to 1;
the Wilds scene is 256 x 144 art pixels, the reference screenshot ~900 px
wide) by majority vote over each block after quantising it to a small
palette, with a hard alpha. Gatherables get a dark outline (so they read
ahead of the decorative flora, which has none) and a generated hover frame
with a light outline (and a flat silhouette for one out of reach); all frames of one gatherable share a canvas with the
same bottom-centre anchor so they swap in place. A few are recoloured to
match the ingredient they stand for (silvery Silverleaf, brown Witch's Ear,
ember-red Emberbark, pale Mandrake).

Writes assets/whisperwood/atlas.png and src/rendering/whisperwood-atlas.js
(the frame rectangles). `--preview out.png` also writes an enlarged sheet.
"""
import colorsys
import os
import sys
from collections import Counter
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'art', 'whisperwood')
OUT_PNG = os.path.join(ROOT, 'assets', 'whisperwood', 'atlas.png')
OUT_JS = os.path.join(ROOT, 'src', 'rendering', 'whisperwood-atlas.js')

INK = (26, 18, 24, 255)      # the game's outline colour (#1a1218)
GLOW = (255, 243, 196, 255)  # hover outline: warm parchment white
LOCKED = (22, 52, 20, 255)   # silhouette of a gatherable out of reach


def load(rel):
    return Image.open(os.path.join(SRC, rel + '.png')).convert('RGBA')


def down(im, f=4, colours=14, alpha_share=0.5):
    """Block-majority downsample to art pixels, on the grid offset that best fits the source."""
    opaque = [px for px in getattr(im, 'get_flattened_data', im.getdata)() if px[3] >= 128]
    fill = Counter(px[:3] for px in opaque).most_common(1)[0][0]
    flat = Image.new('RGB', im.size, fill)
    flat.paste(im.convert('RGB'), mask=im.getchannel('A').point(lambda a: 255 if a >= 128 else 0))
    q = flat.quantize(colours, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    pal, qp, ap = q.getpalette(), q.load(), im.getchannel('A').load()

    def sample(ox, oy):
        W, H = (im.width + ox + f - 1) // f, (im.height + oy + f - 1) // f
        out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        o, purity = out.load(), 0
        for y in range(H):
            for x in range(W):
                c, n, tot = Counter(), 0, 0
                for yy in range(max(0, y * f - oy), min(im.height, y * f - oy + f)):
                    for xx in range(max(0, x * f - ox), min(im.width, x * f - ox + f)):
                        tot += 1
                        if ap[xx, yy] >= 128:
                            n += 1
                            c[qp[xx, yy]] += 1
                if n and n >= tot * alpha_share:
                    i, k = c.most_common(1)[0]
                    purity += k
                    o[x, y] = (pal[i * 3], pal[i * 3 + 1], pal[i * 3 + 2], 255)
        return purity, out

    return max((sample(ox, oy) for oy in range(f) for ox in range(f)), key=lambda r: r[0])[1]


def trim(im):
    box = im.getchannel('A').getbbox()
    return im.crop(box) if box else im


def outline(im, colour):
    """Grow the silhouette by one pixel (4-neighbourhood) in the given colour."""
    out = Image.new('RGBA', (im.width + 2, im.height + 2), (0, 0, 0, 0))
    out.paste(im, (1, 1))
    src, o = out.copy().load(), out.load()
    for y in range(out.height):
        for x in range(out.width):
            if src[x, y][3]:
                continue
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < out.width and 0 <= ny < out.height and src[nx, ny][3]:
                    o[x, y] = colour
                    break
    return out


def recolour(im, fn):
    """Apply fn(h, s, v) -> (h, s, v) (all 0..1) to every opaque pixel."""
    out = im.copy()
    p = out.load()
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = p[x, y]
            if not a:
                continue
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            h, s, v = fn(h, s, v)
            r, g, b = colorsys.hsv_to_rgb(h % 1, max(0, min(1, s)), max(0, min(1, v)))
            p[x, y] = (round(r * 255), round(g * 255), round(b * 255), a)
    return out


def hue_in(h, lo, hi):
    h *= 360
    return lo <= h <= hi if lo <= hi else h >= lo or h <= hi


def silvery(h, s, v):
    # leafy greens toward a pale sage: Silverleaf's "soft silvery leaves"
    if hue_in(h, 50, 170) and s > 0.15:
        return 115 / 360, s * 0.32, min(1, v * 1.06 + 0.06)
    return h, s, v


def brown_caps(h, s, v):
    # red toadstool caps toward a leathery tan-brown (Witch's Ear is a shelf fungus)
    if hue_in(h, 330, 25) and s > 0.25:
        return 28 / 360, s * 0.7, v * 0.72
    return h, s, v


def ember(h, s, v):
    # brown twigs toward a resinous red bark
    if hue_in(h, 10, 45) and s > 0.2:
        return 10 / 360, min(1, s * 1.2), v
    return h, s, v


def pale(h, s, v):
    # Mandrake's pale root flesh
    if hue_in(h, 10, 45):
        return 36 / 360, s * 0.8, min(1, v * 1.15 + 0.05)
    return h, s, v


def far(h, s, v):
    # back-row trees: darker and cooler so they sit behind the clearing
    return h + 0.02, s * 0.85, v * 0.88


def anchored(frames):
    """Pad frames to one canvas, bottom-centre aligned, so states swap in place."""
    W, H = max(f.width for f in frames.values()), max(f.height for f in frames.values())
    out = {}
    for k, f in frames.items():
        c = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        c.paste(f, ((W - f.width) // 2, H - f.height))
        out[k] = c
    return out


def gatherable(name, idle, extra=None, tint=None):
    """idle + hover (+ any extra states), outlined, tinted and anchored."""
    def prep(im):
        im = trim(down(im))
        return outline(recolour(im, tint) if tint else im, INK)
    base = prep(idle)
    # out of reach (a higher guild rank): a flat shadow of the plant
    shadow = Image.new('RGBA', base.size, (0, 0, 0, 0))
    shadow.paste(Image.new('RGBA', base.size, LOCKED), mask=base.getchannel('A'))
    frames = {'idle': base, 'hover': outline(base, GLOW), 'locked': shadow}
    for k, im in (extra or {}).items():
        frames[k] = prep(im)
    return {f'{name}_{k}': v for k, v in anchored(frames).items()}


def build():
    S = {}
    # decorative world objects (no outline: they stay behind the gatherables)
    for n in ('oak_round_01', 'oak_round_02', 'oak_wide_03'):
        im = trim(down(load('sprites/trees/' + n)))
        S[n] = im
        S[n + '_far'] = recolour(im, far)
    for rel in ('bushes/forest_bush_01', 'bushes/flower_bush_01', 'rocks/mossy_boulder', 'rocks/gray_boulder',
                'rocks/stone_cluster', 'props/tree_stump', 'props/fallen_log', 'props/mossy_log',
                'details/daisies', 'details/buttercups', 'details/grass_tuft_01', 'details/grass_tuft_02',
                'details/grass_tuft_03', 'details/grass_tuft_04', 'details/grass_tuft_05'):
        S[rel.split('/')[1]] = trim(down(load('sprites/' + rel), colours=10))
    S['forest_bush_01_far'] = recolour(S['forest_bush_01'], far)
    # gatherables, one per real Whisperwood ingredient (materials/wild.js keys)
    G = 'sprites/gatherables/'
    S.update(gatherable('ironroot', load(G + 'raven_ironroot_idle'), {'depleted': load(G + 'raven_ironroot_depleted')}))
    S.update(gatherable('silverleaf', load(G + 'herb_idle'), {'harvesting': load(G + 'herb_harvesting'), 'depleted': load(G + 'herb_depleted')}, silvery))
    S.update(gatherable('nightshade', load(G + 'bellflowers')))
    S.update(gatherable('owlberry', load(G + 'red_berries')))
    S.update(gatherable('emberbark', load(G + 'fallen_twigs'), tint=ember))
    S.update(gatherable('witchear', load(G + 'red_mushrooms'), tint=brown_caps))
    S.update(gatherable('mandrake', load(G + 'exposed_root'), tint=pale))
    # a picked-over patch for everything without its own depleted art
    S['picked'] = outline(trim(down(load(G + 'herb_depleted'))), INK)
    # the glint over a fully grown gatherable (16 px frames at half scale)
    for i in range(4):
        S[f'glint_{i}'] = trim(down(load(f'effects/glint_frame_0{i}'), f=2, colours=4, alpha_share=0.25))
    return S


def pack(sprites, width=256, gap=1):
    order = sorted(sprites, key=lambda k: (-sprites[k].height, k))
    x = y = row = 0
    rects = {}
    for k in order:
        im = sprites[k]
        if x + im.width > width:
            x, y, row = 0, y + row + gap, 0
        rects[k] = (x, y, im.width, im.height)
        x += im.width + gap
        row = max(row, im.height)
    atlas = Image.new('RGBA', (width, y + row), (0, 0, 0, 0))
    for k, (x, y, _, _) in rects.items():
        atlas.paste(sprites[k], (x, y))
    return atlas, rects


def main():
    sprites = build()
    atlas, rects = pack(sprites)
    os.makedirs(os.path.dirname(OUT_PNG), exist_ok=True)
    atlas.save(OUT_PNG, optimize=True)
    lines = [
        '// Generated by scripts/make-whisperwood.py from art/whisperwood/ — do not edit.',
        '// Frame rectangles [x, y, w, h] in assets/whisperwood/atlas.png (art pixels).',
        '',
        "export const ATLAS_URL = 'assets/whisperwood/atlas.png';",
        f'export const ATLAS_SIZE = [{atlas.width}, {atlas.height}];',
        '',
        '/** @type {Record<string, [number, number, number, number]>} */',
        'export const FRAMES = {',
    ]
    for k in sorted(rects):
        lines.append(f"  {k}: [{', '.join(str(v) for v in rects[k])}],")
    lines += ['};', '']
    with open(OUT_JS, 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(lines))
    print(f'{len(rects)} frames, atlas {atlas.width}x{atlas.height} -> {os.path.relpath(OUT_PNG, ROOT)}')
    if '--preview' in sys.argv:
        out = sys.argv[sys.argv.index('--preview') + 1]
        bg = Image.new('RGBA', atlas.size, (96, 150, 70, 255))
        bg.alpha_composite(atlas)
        bg.resize((atlas.width * 4, atlas.height * 4), Image.NEAREST).save(out)


if __name__ == '__main__':
    main()
