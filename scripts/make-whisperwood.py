"""Build the Whisperwood sprite atlas from the concept-art sprite pack.
Dev-time only: `python scripts/make-whisperwood.py` (needs Pillow).

The pack in art/whisperwood/ was cut from a generated concept atlas: soft
edges, an uneven ~2 px grid and far more colours than pixel art uses. Each
sprite is brought down to the scene's art-pixel scale (4 source pixels to 1;
the Wilds scene is 256 x 144 art pixels, the reference screenshot ~900 px
wide) by majority vote over each block after quantising it to a small
palette, with a hard alpha. Every sprite is then snapped to the scene's own
palette (the ramps the procedural painting uses; gatherables keep their own
accent colours too), so sprites and painting share one set of colours; small
details lose their dark fringe and lone stray pixels take their
surroundings' colour. Gatherables get a dark outline (so they read ahead of
the decorative flora, which has none) and a generated hover frame with a
light outline; all frames of one gatherable share a canvas with the same
bottom-centre anchor so they swap in place. Ironroot grows out of a mound
of soil in the scene (its card keeps the whole root). A few are recoloured
to match the ingredient they stand for (silvery Silverleaf, brown Witch's
Ear, ember-red Emberbark, pale Mandrake).

Writes assets/whisperwood/atlas.png and src/rendering/whisperwood-atlas.js
(the frame rectangles). `--preview out.png` also writes an enlarged sheet.
"""
import colorsys
import math
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


def hexes(*cs):
    return [tuple(int(c[i:i + 2], 16) for i in (1, 3, 5)) for c in cs]


# the scene's palette (rendering/regions.js: LEAF, SHRUB, OAKBARK, RSTONE,
# MOSS, the Whisperwood ground and flowers, the outline colour)
SCENE = hexes('#163212', '#2a6a1c', '#3f8f24', '#68bc34', '#b6ea5a',
              '#12300f', '#256018', '#3a8a22', '#5cb030', '#a6e050',
              '#68b83a', '#5aa830', '#428a24', '#7cc846',
              '#1e1008', '#4a2a14', '#6e4220', '#94602e', '#b8844a', '#d8a868',
              '#1e2028', '#555a68', '#7a8090', '#9aa2b0', '#c8d0da',
              '#4f7a31', '#7da447',
              '#ffffff', '#fff3b0', '#ffd23a', '#e8a020', '#1a1218')
# flowers and grass tufts: light greens and petal colours only (no bark or ink)
DETAIL = hexes('#2a6a1c', '#3f8f24', '#68bc34', '#b6ea5a', '#3a8a22', '#5cb030', '#7cc846',
               '#ffffff', '#fff3b0', '#ffd23a', '#e8a020')
# the wood beyond the clearing: the haze greens of the far tree lines
FAR = hexes('#163212', '#1f4a2a', '#2a5e36', '#3a8060', '#4f9068', '#5aa070', '#74baa8',
            '#2a1c14', '#3e2a1c', '#56402c')


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


def dist(a, b):
    return 2 * (a[0] - b[0]) ** 2 + 4 * (a[1] - b[1]) ** 2 + 3 * (a[2] - b[2]) ** 2


def snap(im, palette):
    """Map every opaque pixel to the nearest palette colour."""
    out, cache = im.copy(), {}
    p = out.load()
    for y in range(out.height):
        for x in range(out.width):
            c = p[x, y]
            if c[3]:
                if c[:3] not in cache:
                    cache[c[:3]] = min(palette, key=lambda q: dist(q, c))
                p[x, y] = (*cache[c[:3]], 255)
    return out


def accents(im, n=8):
    """A sprite's own colours that are not foliage green (berries, bells, caps, bark)."""
    px = [c[:3] for c in getattr(im, 'get_flattened_data', im.getdata)() if c[3]]
    flat = Image.new('RGB', (len(px), 1))
    flat.putdata(px)
    q = flat.quantize(n, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    used = {i for _, i in q.getcolors()}
    pal = q.getpalette()
    out = []
    for i in sorted(used):
        c = tuple(pal[i * 3:i * 3 + 3])
        h, s, v = colorsys.rgb_to_hsv(*(k / 255 for k in c))
        if not (hue_in(h, 60, 170) and s > 0.3) and v > 0.08:
            out.append(c)
    return out


def neighbours(p, x, y, w, h):
    return [p[nx, ny] for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)) if 0 <= nx < w and 0 <= ny < h]


def despeckle(im, near=14400):
    """A lone pixel whose neighbours (three or four of them alike) differ from it takes
    their colour, if it is close to it (noise, not a blossom or a berry glint)."""
    out = im.copy()
    src, o = im.load(), out.load()
    for y in range(im.height):
        for x in range(im.width):
            c = src[x, y]
            if not c[3]:
                continue
            ns = neighbours(src, x, y, im.width, im.height)
            if len(ns) == 4 and all(n[3] for n in ns) and c not in ns:
                n, k = Counter(ns).most_common(1)[0]
                if k >= 3 and dist(n, c) < near:
                    o[x, y] = n
    return out


def defringe(im, luma=70):
    """Drop dark pixels on the silhouette edge (soft-alpha halos of the source art)."""
    out = im.copy()
    src, o = im.load(), out.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = src[x, y]
            if a and 0.3 * r + 0.59 * g + 0.11 * b < luma:
                ns = neighbours(src, x, y, im.width, im.height)
                if len(ns) < 4 or any(not n[3] for n in ns):
                    o[x, y] = (0, 0, 0, 0)
    return out


def clean(im, palette, fringe=False):
    im = snap(im, palette)
    if fringe:
        im = trim(defringe(im))
    return despeckle(im)


def bare_trunk(im):
    """Paint over streaks of moss on a trunk: a green pixel with bark on both sides takes the bark's colour."""
    out = im.copy()
    src, o = im.load(), out.load()
    bark = lambda c: c[3] and c[0] > c[1] and c[0] > c[2]
    green = lambda c: c[3] and c[1] > c[0] + 10 and c[1] >= c[2]
    for y in range(im.height):
        for x in range(1, im.width - 1):
            for w in (1, 2, 3):
                if x + w < im.width and all(green(src[x + k, y]) for k in range(w)) and bark(src[x - 1, y]) and bark(src[x + w, y]):
                    for k in range(w):
                        o[x + k, y] = src[x - 1, y]
    # and patches: a green pixel with bark on two or more sides, worked inwards
    for _ in range(4):
        src = out.copy().load()
        for y in range(im.height):
            for x in range(im.width):
                if green(src[x, y]):
                    b = [n for n in neighbours(src, x, y, im.width, im.height) if bark(n)]
                    if len(b) >= 2:
                        o[x, y] = Counter(b).most_common(1)[0][0]
    return out


# bark, dark to light (rendering/regions.js OAKBARK)
BARK = hexes('#1e1008', '#4a2a14', '#6e4220', '#94602e', '#b8844a', '#d8a868')


def bark_texture(im, seed=0):
    """Re-shade each row of a trunk: lit from the left (a light edge, then
    light, mid and dark bark), two long grooves wavering down it, and the
    shade of the crown on the bark just beneath it. A trunk's run includes
    the dark crevices inside it; the outline stays."""
    out = im.copy()
    src, o = im.load(), out.load()
    w, h = im.size
    bark = lambda c: c[3] and c[0] > c[1] + 8 and c[0] > c[2] + 8
    dark = lambda c: c[3] and 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2] < 60
    leaf = lambda c: c[3] and c[1] > c[0] + 10
    for y in range(h):
        x = 0
        while x < w:
            if not bark(src[x, y]):
                x += 1
                continue
            x0 = x
            while x < w and (bark(src[x, y]) or (dark(src[x, y]) and any(bark(src[x + k, y]) for k in (1, 2) if x + k < w))):
                x += 1
            L = x - x0
            if L < 4:
                continue
            tones = []
            for xx in range(x0, x):
                t = (xx - x0 + 0.5) / L
                tone = 4 if t < 0.12 else 3 if t < 0.4 else 2 if t < 0.76 else 1
                # in the crown's shade
                if any(leaf(src[xx, y - k]) or (dark(src[xx, y - k]) and not bark(src[xx, y - k])) for k in range(1, 4) if y - k >= 0):
                    tone -= 1
                tones.append(tone)
            if L >= 7:
                for k, gt in enumerate((0.42, 0.7)):
                    if (y + k * 5 + seed) % 11 == 0:
                        continue
                    gx = round(gt * L + math.sin(y * 0.22 + k * 2.4 + seed) * 1.1)
                    if 1 <= gx < L - 1:
                        tones[gx] = max(0, tones[gx] - 1)
            for k, tone in enumerate(tones):
                o[x0 + k, y] = (*BARK[max(0, tone)], 255)
    return out


def plant(im, keep=0.68):
    """Bury the lower part of a root in a mound of soil, so it grows out of the ground."""
    h = max(1, round(im.height * keep))
    out = Image.new('RGBA', (im.width, h + 2), (0, 0, 0, 0))
    out.paste(im.crop((0, 0, im.width, h)), (0, 0))
    p = out.load()
    cx, m = im.width // 2, max(6, round(im.width * 0.55))
    for row, (c, w) in enumerate(zip(hexes('#6e4220', '#4a2a14', '#4a2a14'), (m - 4, m - 1, m))):
        for x in range(cx - w // 2, cx - w // 2 + w):
            if 0 <= x < out.width:
                p[x, h - 1 + row] = (*c, 255)
    return out


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


def sunlit(h, s, v):
    # the near oaks stand in the clearing's light: lift their shade off black
    return h, s, min(1, v * 1.18 + 0.06)


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


def gatherable(name, idle, extra=None, tint=None, planted=False):
    """idle + hover (+ any extra states), outlined, tinted, snapped to the
    scene palette plus the sprite's own accent colours, and anchored. A
    planted gatherable grows out of a mound in the scene; its card keeps the
    whole plant (`<name>_card`)."""
    def prep(im, bury=False):
        im = trim(down(im))
        im = recolour(im, tint) if tint else im
        im = clean(im, SCENE + accents(im))
        return outline(plant(im) if bury else im, INK)
    base = prep(idle, planted)
    frames = {'idle': base, 'hover': outline(base, GLOW)}
    for k, im in (extra or {}).items():
        frames[k] = prep(im)
    out = {f'{name}_{k}': v for k, v in anchored(frames).items()}
    if planted:
        out[f'{name}_card'] = prep(idle)
    return out


def build():
    S = {}
    # decorative world objects (no outline: they stay behind the gatherables)
    # (the far trees are snapped to the haze greens of the distant tree lines)
    # the great oaks framing the clearing: the finest reduction (3 to 2, one
    # concept-art pixel or so per art pixel), drawn at full scene resolution
    for n in ('oak_round_01', 'oak_round_02', 'oak_wide_03'):
        S[n + '_far'] = clean(recolour(trim(down(load('sprites/trees/' + n))), far), FAR)
        src = load('sprites/trees/' + n)
        near = bare_trunk(clean(recolour(trim(down(src.resize((src.width * 2, src.height * 2), Image.NEAREST), f=3, colours=20)), sunlit), SCENE))
        S[n + '_near'] = bark_texture(near, seed=len(n))
        # the mirrored oaks on the right are shaded after mirroring, so their bark is lit from the left too
        if n != 'oak_round_02':
            S[n + '_near_m'] = bark_texture(near.transpose(Image.Transpose.FLIP_LEFT_RIGHT), seed=len(n) + 3)
    for rel in ('bushes/forest_bush_01', 'bushes/flower_bush_01', 'rocks/mossy_boulder', 'rocks/gray_boulder',
                'rocks/stone_cluster', 'props/tree_stump', 'props/mossy_log'):
        S[rel.split('/')[1]] = clean(trim(down(load('sprites/' + rel), colours=10)), SCENE)
    # small details sit straight on the grass: no dark halo
    for rel in ('details/daisies', 'details/buttercups', 'details/grass_tuft_01', 'details/grass_tuft_02', 'details/grass_tuft_03'):
        S[rel.split('/')[1]] = clean(trim(down(load('sprites/' + rel), colours=8)), DETAIL, fringe=True)
    S['forest_bush_01_far'] = clean(recolour(trim(down(load('sprites/bushes/forest_bush_01'), colours=10)), far), FAR)
    # gatherables, one per real Whisperwood ingredient (materials/wild.js keys)
    G = 'sprites/gatherables/'
    S.update(gatherable('ironroot', load(G + 'raven_ironroot_idle'), {'depleted': load(G + 'raven_ironroot_depleted')}, planted=True))
    S.update(gatherable('silverleaf', load(G + 'herb_idle'), {'harvesting': load(G + 'herb_harvesting'), 'depleted': load(G + 'herb_depleted')}, silvery))
    S.update(gatherable('nightshade', load(G + 'bellflowers')))
    S.update(gatherable('owlberry', load(G + 'red_berries')))
    S.update(gatherable('emberbark', load(G + 'fallen_twigs'), tint=ember))
    S.update(gatherable('witchear', load(G + 'red_mushrooms'), tint=brown_caps))
    S.update(gatherable('mandrake', load(G + 'exposed_root'), tint=pale))
    # a picked-over patch for everything without its own depleted art
    picked = trim(down(load(G + 'herb_depleted')))
    S['picked'] = outline(clean(picked, SCENE + accents(picked)), INK)
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
