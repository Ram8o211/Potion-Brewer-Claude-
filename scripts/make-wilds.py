"""Build the sprite atlases of five Wilds regions from the corrected Wilds pack.
Dev-time only: `python scripts/make-wilds.py` (needs Pillow and NumPy).

The pack in art/wilds/ (Whisperwood, Willow Bank, Ironstone Quarry, Moonfen
and Ember Crags; the Sunlit Meadow has its own pack and scripts/make-meadow.py)
was cut programmatically from generated concept sheets. Each region gets:

- background bands: the pack's parallax strips, cropped clear of the sheet's
  captions and white margins, brought to the 256 px scene width; a band that
  stands in front of another has the sky above it keyed out, so the layer
  behind shows through
- scenery: the curated trees, rocks, structures and flora (no outline, so
  they stay behind the gatherables); fragments of neighbouring sheet cells
  and white bars are dropped, and the white sheet showing through a willow's
  curtain of branches is cleared; the Crags' vent and gusher lose the smoke
  painted above them (the scene animates its own)
- gatherables, one per real ingredient of the region (materials/wild.js
  keys): the mature deposit outlined in ink with a light-outlined hover frame,
  the harvested deposit as its depleted frame and, for a dawn or dusk plant,
  its closed frame and hover; all frames on one bottom-centre anchor
- icons: the ingredient's framed icon, lifted out of its parchment frame, at
  16 px for the shelf and the book and 24 px for its deposit card

Every sprite is resampled by majority vote (`pixelart.fit`, hard alpha) and
snapped to its region's palette: the 64 colours of the region's full scene
preview, plus the sprite's own accent colours.

Writes assets/wilds/<region>.png and src/rendering/wilds-atlas.js (the frame
rectangles). `--preview DIR` also writes enlarged sheets.
"""
import colorsys
import os
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pixelart import INK, GLOW, trim, outline, anchored, accents, snap, despeckle, defringe, pack, fit, recolour, hue_in, down, majority, rim  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'art', 'wilds')
OUT_DIR = os.path.join(ROOT, 'assets', 'wilds')
OUT_JS = os.path.join(ROOT, 'src', 'rendering', 'wilds-atlas.js')
W = 256
# a gatherable's widest frame (deposits stand about 27 px apart), before its outline
MAX_W = 28

BIOME = {'forest': 'Whisperwood', 'river': 'Willow_Bank', 'quarry': 'Ironstone_Quarry', 'moonfen': 'Moonfen', 'crags': 'Ember_Crags'}


def load(biome, rel):
    return Image.open(os.path.join(SRC, biome, rel + '.png')).convert('RGBA')


def palette(biome, n=64):
    im = Image.open(os.path.join(SRC, biome, 'SCENE_PREVIEW.png')).convert('RGB')
    # the preview's caption and frame sit along its top and edges
    im = im.crop((im.width // 40, im.height // 8, im.width - im.width // 40, im.height - im.height // 40))
    q = im.quantize(n, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    pal = q.getpalette()
    return [tuple(pal[i * 3:i * 3 + 3]) for _, i in q.getcolors()] + [INK[:3], (255, 255, 255)]


# ---- cleaning the cut-outs ----------------------------------------------------

def components(a):
    """Label the 8-connected opaque regions of a boolean mask: (labels, [(size, bbox), ...])."""
    h, w = a.shape
    lab = np.zeros((h, w), np.int32)
    parts = []
    for y0 in range(h):
        for x0 in range(w):
            if not a[y0, x0] or lab[y0, x0]:
                continue
            n = len(parts) + 1
            lab[y0, x0] = n
            q = deque([(y0, x0)])
            size, bx0, by0, bx1, by1 = 0, x0, y0, x0, y0
            while q:
                y, x = q.popleft()
                size += 1
                bx0, by0, bx1, by1 = min(bx0, x), min(by0, y), max(bx1, x), max(by1, y)
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        ny, nx = y + dy, x + dx
                        if 0 <= ny < h and 0 <= nx < w and a[ny, nx] and not lab[ny, nx]:
                            lab[ny, nx] = n
                            q.append((ny, nx))
            parts.append((size, (bx0, by0, bx1 + 1, by1 + 1)))
    return lab, parts


def whole(im, keep=0.06):
    """Keep the object, drop what the automated cut-out caught of its neighbours:
    parts smaller than `keep` of the largest, white bars and thin rules."""
    px = np.asarray(im).copy()
    a = px[..., 3] >= 128
    lab, parts = components(a)
    if not parts:
        return im
    big = max(s for s, _ in parts)
    rgb = px[..., :3].astype(int)
    for i, (size, (x0, y0, x1, y1)) in enumerate(parts, 1):
        m = lab == i
        white = ((rgb[m].min(axis=1) > 215).mean()) > 0.5
        # (a rule, a white bar or a slice of a header plank: long and thin)
        thin = min(x1 - x0, y1 - y0) <= 12 and max(x1 - x0, y1 - y0) >= 4 * min(x1 - x0, y1 - y0)
        if size < big * keep or white or (thin and size < big * 0.3):
            px[m] = 0
    px[px[..., 3] < 128] = 0
    px[px[..., 3] >= 128, 3] = 255
    return trim(Image.fromarray(px, 'RGBA'))


def soften(im):
    """A 3 x 3 median over the colours (the alpha untouched): the pack's
    sprites are small and soft, a few source pixels to an art pixel, and
    the block vote would otherwise pick up their noise as stray pixels."""
    out = im.convert('RGB').filter(ImageFilter.MedianFilter(3)).convert('RGBA')
    out.putalpha(im.getchannel('A'))
    return out


def unsheet(im, light=200, sat=0.12):
    """Clear the white of the sheet that shows through gaps in a sprite (a
    willow's hanging branches): pale, greyish pixels."""
    px = np.asarray(im).copy()
    rgb = px[..., :3].astype(int)
    mx, mn = rgb.max(axis=2), rgb.min(axis=2)
    pale = (mn > light) & ((mx - mn) <= sat * mx)
    px[pale] = 0
    return Image.fromarray(px, 'RGBA')


def flood_clear(px, passable, seeds=None):
    """Clear (make transparent) every passable pixel 4-connected to a seed (default: the border)."""
    h, w = passable.shape
    seen = np.zeros((h, w), bool)
    if seeds is None:
        seeds = [(y, x) for y in range(h) for x in (0, w - 1)] + [(y, x) for x in range(w) for y in (0, h - 1)]
    q = deque()
    for y, x in seeds:
        if passable[y, x] and not seen[y, x]:
            seen[y, x] = True
            q.append((y, x))
    while q:
        y, x = q.popleft()
        for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= ny < h and 0 <= nx < w and passable[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True
                q.append((ny, nx))
    out = px.copy()
    out[seen] = 0
    return out


def dehalo(im, light=165):
    """Clear the pale sticker border the cut-outs keep around an object: pale
    pixels reachable from the transparent outside through pale pixels."""
    px = np.asarray(im).copy()
    clear = px[..., 3] < 128
    pale = clear | (px[..., :3].min(axis=2) > light)
    return Image.fromarray(flood_clear(px, pale), 'RGBA')


def edge_halo(im, passes=2):
    """Clear what is left of the cut-outs' light border after resampling:
    khaki, beige or pale pixels on the silhouette that are lighter than the
    sprite just inside them."""
    for _ in range(passes):
        px = np.asarray(im).copy()
        a = px[..., 3] > 0
        rgb = px[..., :3].astype(int)
        luma = rgb @ np.array([0.3, 0.59, 0.11])
        h, w = a.shape
        out = px.copy()
        for y in range(h):
            for x in range(w):
                if not a[y, x]:
                    continue
                ns = [(y + dy, x + dx) for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1))]
                if all(0 <= ny < h and 0 <= nx < w and a[ny, nx] for ny, nx in ns):
                    continue
                inner = [luma[ny, nx] for ny in range(max(0, y - 1), min(h, y + 2)) for nx in range(max(0, x - 1), min(w, x + 2)) if a[ny, nx] and (ny, nx) != (y, x)]
                if not inner:
                    continue
                hh, ss, vv = colorsys.rgb_to_hsv(*(rgb[y, x] / 255))
                khaki = hue_in(hh, 30, 62) and ss < 0.72 and vv > 0.5
                pale = ss < 0.22 and vv > 0.72
                if (khaki or pale) and luma[y, x] - np.mean(inner) > 25:
                    out[y, x] = 0
        im = Image.fromarray(out, 'RGBA')
    return im


def smooth(im):
    """A lone pixel whose four neighbours share one colour takes that colour
    (the specks of a broken outline inside a beam or a stone)."""
    px = np.asarray(im).copy()
    out = px.copy()
    h, w = px.shape[:2]
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            if not px[y, x, 3]:
                continue
            ns = [tuple(px[y + dy, x + dx]) for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1))]
            if ns[0][3] and all(n == ns[0] for n in ns) and ns[0] != tuple(px[y, x]):
                out[y, x] = ns[0]
    return Image.fromarray(out, 'RGBA')


def despur(im):
    """Drop rows one pixel thin with nothing above or below (a flat strand of
    grass along a sprite's foot), which an outline would turn into a long line."""
    px = np.asarray(im).copy()
    a = px[..., 3] > 0
    up = np.zeros_like(a)
    up[1:] = a[:-1]
    down_ = np.zeros_like(a)
    down_[:-1] = a[1:]
    px[a & ~up & ~down_] = 0
    return trim(Image.fromarray(px, 'RGBA'))


def strip(biome, rel, box, h=None, key=None):
    """A background band: cropped clear of captions and margins, `W` px wide.
    `key(r, g, b)` marks the sky above it, keyed out from the top down."""
    # (3 px in from each side: the strips keep a sliver of the sheet's border)
    im = load(biome, 'backgrounds/' + rel if '/' not in rel else rel).crop((box[0] + 3, box[1], box[2] - 3, box[3]))
    if key:
        px = np.asarray(im).copy()
        rgb = px[..., :3].astype(int)
        if isinstance(key, (int, float)):
            # the sky: within `key` of the colours along the band's top
            top = rgb[:2].reshape(-1, 3)
            q = Image.fromarray(top[None].astype(np.uint8), 'RGB').quantize(6, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
            pal = np.array(q.getpalette()[:18]).reshape(6, 3)
            sky = np.min(((rgb[:, :, None, :] - pal[None, None]) ** 2).sum(axis=3), axis=2) < key ** 2
        else:
            sky = np.vectorize(lambda r, g, b: bool(key(r, g, b)), otypes=[bool])(rgb[..., 0], rgb[..., 1], rgb[..., 2])
        seeds = [(0, x) for x in range(sky.shape[1])]
        px = flood_clear(px, sky, seeds)
        # specks of sky colour left floating above the skyline
        lab, parts = components(px[..., 3] >= 128)
        for i, (size, (x0, y0, x1, y1)) in enumerate(parts, 1):
            if y1 < px.shape[0] and size < 400:
                px[lab == i] = 0
        im = Image.fromarray(px, 'RGBA')
    return fit_full(im, W, h)


def fit_full(im, w, h=None, colours=24):
    """`fit` to exactly w x h without trimming the band's transparent top (it keeps its place in the frame)."""
    if h is None:
        h = max(1, round(im.height * w / im.width))
    if im.height < h or im.width < w:
        # stretched: repeat source rows first, so every art pixel has a block to vote over
        k = max(-(-h // im.height), -(-w // im.width))
        im = im.resize((im.width * k, im.height * k), Image.NEAREST)
    px = np.asarray(im).copy()
    # a nearly transparent pixel in each corner pins fit's trim to the whole band
    for c in ((0, 0), (0, -1), (-1, 0), (-1, -1)):
        if px[c][3] < 128:
            px[c] = (0, 0, 0, 1)
    return fit(Image.fromarray(px, 'RGBA'), w, h, colours=colours)


def pool(im, seed=0):
    """Round a rectangle of water into a pool: an oval edge in steps of two pixels."""
    import random
    rnd = random.Random(seed)
    px = np.asarray(im).copy()
    h, w = px.shape[:2]
    for y in range(0, h, 2):
        t = (y + 1 - h / 2) / (h / 2)
        half = w / 2 * (1 - t * t) ** 0.5 - rnd.randint(0, 2) * 2
        l, r = round(w / 2 - half), round(w / 2 + half)
        px[y:y + 2, :max(0, l)] = 0
        px[y:y + 2, max(0, r):] = 0
    return trim(Image.fromarray(px, 'RGBA'))


def hsv(r, g, b):
    return colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)


def desmoke(im, top=8):
    """Clear the smoke a vent breathes in the pack's art (the scene animates
    its own): the plume's colours are the ones in its top `top` rows, plus
    the pale yellows and oranges of a jet of steam; each column is cleared
    from the top down to its first pixel of rock."""
    a = np.array(im)
    plume = {tuple(int(v) for v in a[r, c, :3]) for r in range(top) for c in range(a.shape[1]) if a[r, c, 3]}
    for c in range(a.shape[1]):
        for r in range(a.shape[0]):
            if not a[r, c, 3]:
                continue
            p = tuple(int(v) for v in a[r, c, :3])
            if p not in plume and not (p[0] > 200 and p[1] > 140):
                break
            a[r, c, 3] = 0
    return trim(Image.fromarray(a))


class Region:
    def __init__(self, region):
        self.region = region
        self.biome = BIOME[region]
        self.pal = palette(self.biome)
        self.S = {}

    def clean(self, im, own=10, fringe=False):
        im = edge_halo(snap(im, self.pal + accents(im, own)))
        if fringe:
            im = defringe(im)
        return trim(smooth(despeckle(im)))

    def band(self, name, rel, box, h=None, key=None, own=6, alone=False):
        # (the band's own accents too: the moon, lava, the river's foam; a
        # band `alone` keeps only its own colours — the night sky, whose pale
        # moon would otherwise take the bog's teal)
        im = strip(self.biome, rel, box, h, key)
        self.S[name] = majority(despeckle(snap(im, (accents(im, own) if alone else self.pal + accents(im, own)))))

    def prop(self, name, rel, w=None, h=None, colours=14, own=10, fringe=False, sheet=False, keep=0.06, flip=False, smoke=False):
        """A piece of scenery, cleaned the way the Sunlit Meadow's are: softened,
        resampled, its stray pixels taken into the colour around them and its
        broken outline drawn whole (`rim`; ground cover, `fringe`, has none).
        `smoke`: the vent's painted plume is cleared before the outline is drawn."""
        # ('Biome:path' borrows another biome's prop, snapped to this region's palette)
        biome, rel = rel.split(':') if ':' in rel else (self.biome, rel)
        im = load(biome, 'props/' + rel)
        if sheet:
            im = unsheet(im)
        im = soften(whole(dehalo(im), keep))
        if flip:
            im = im.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        # (the outline adds a pixel on every side: the sprite keeps the size asked for)
        inner = lambda v: v and v - (0 if fringe else 2)
        im = majority(self.clean(fit(im, inner(w), inner(h), colours), own, fringe))
        if smoke:
            im = desmoke(im)
        self.S[name] = im if fringe else rim(im, self.pal)

    def icon(self, key, tol=40):
        """The framed icon, lifted out of its parchment frame: inside the
        frame, the parchment (the colours along the inner edge, flooded in
        from that edge) is cleared, which leaves the object."""
        im = trim(load(self.biome, f'gatherables/{key}/icon'))
        w, h = im.size
        k = round(min(w, h) * 0.13)
        im = im.crop((k, k, w - k, h - k))
        px = np.asarray(im).copy()
        rgb = px[..., :3].astype(int)
        hh, ww = rgb.shape[:2]
        ring = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
        q = Image.fromarray(ring[None].astype(np.uint8), 'RGB').quantize(10, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
        pal = np.array(q.getpalette()[:30]).reshape(10, 3)
        d = np.min(((rgb[:, :, None, :] - pal[None, None]) ** 2).sum(axis=3), axis=2)
        return whole(Image.fromarray(flood_clear(px, (d < tol ** 2) | (px[..., 3] < 128)), 'RGBA'), keep=0.12)

    def gatherable(self, key, h, idle='mature', closed=None, depleted='harvested', tint=None, dh=0.6, tol=40):
        def prep(name, hh):
            im = whole(dehalo(load(self.biome, f'gatherables/{key}/{name}')))
            im = fit(im, h=hh, colours=18)
            if im.width > MAX_W * hh / h:
                im = fit(whole(dehalo(load(self.biome, f'gatherables/{key}/{name}'))), w=round(MAX_W * hh / h), colours=18)
            if tint:
                im = recolour(im, tint)
            # (more of its own colours than scenery keeps: a deposit must read as what it is)
            return outline(despur(self.clean(im, own=16)), INK)
        base = prep(idle, h)
        frames = {'idle': base, 'hover': outline(base, GLOW), 'depleted': prep(depleted, max(8, round(h * dh)))}
        if closed:
            c = prep(closed, h)
            frames['closed'], frames['closed_hover'] = c, outline(c, GLOW)
        self.S.update({f'{key}_{k}': v for k, v in anchored(frames).items()})
        src = self.icon(key, tol)
        for size, name in ((16, 'icon'), (24, 'card')):
            im = fit(src, h=size - 2, colours=32)
            if im.width > size - 2:
                im = fit(src, w=size - 2, colours=32)
            self.S[f'{key}_{name}'] = outline(despeckle(im), INK)

    def glints(self):
        for i in range(4):
            g = Image.open(os.path.join(ROOT, 'art', 'effects', f'glint_frame_0{i}.png')).convert('RGBA')
            self.S[f'glint_{i}'] = trim(down(g, f=2, colours=4, alpha_share=0.25))


def blue_sky(r, g, b):
    h, s, v = hsv(r, g, b)
    return (hue_in(h, 185, 235) and s > 0.12 and v > 0.55) or min(r, g, b) > 200


def white(r, g, b):
    return min(r, g, b) > 205


# ---- the five regions ---------------------------------------------------------

def forest():
    R = Region('forest')
    R.band('sky', 'sky_rays', (2, 2, 442, 76), h=46)
    R.band('distant', 'distant_forest', (0, 8, 444, 60), key=blue_sky)
    R.band('mid', 'mid_treeline', (0, 6, 444, 74), key=blue_sky)
    R.band('near', 'near_treeline', (0, 8, 444, 88), key=blue_sky)
    P = 'CURATED_COMPLETE_OBJECTS/'
    R.prop('oaks', P + 'two_ancient_oaks_composite', h=104, colours=24, own=12)
    R.prop('oak_small', P + 'small_oak_tree', h=60, colours=20)
    R.prop('stones', P + 'mossy_stones_cluster', w=46)
    R.prop('fern', 'trees_bushes_flora/trees_bushes_flora_007', w=34)
    R.prop('log', P + 'woodland_log', w=40, colours=16)
    F = 'trees_bushes_flora/trees_bushes_flora_'
    R.prop('bush_round', F + '003', w=26)
    R.prop('bush_flowers', F + '004', w=26)
    R.prop('bush_small', F + '005', w=20)
    R.prop('fern_small', F + '006', w=20)
    R.prop('stump', F + '017', w=22, colours=16)
    R.prop('leaves_1', F + '012', w=14, colours=10, fringe=True)
    R.prop('leaves_2', F + '011', w=20, colours=10, fringe=True)
    R.prop('sticks', 'rocks_logs_forest_props/rocks_logs_forest_props_003', w=16, colours=8)
    R.prop('snag', 'rocks_logs_forest_props/rocks_logs_forest_props_004', w=12, colours=10)
    R.gatherable('ironroot', 24)
    R.gatherable('silverleaf', 22)
    R.gatherable('nightshade', 22, closed='closed')
    R.gatherable('owlberry', 22)
    R.gatherable('emberbark', 20)
    R.gatherable('witchear', 22, tol=20)
    R.gatherable('mandrake', 22)
    R.glints()
    return R.S


def river():
    R = Region('river')
    R.band('sky', 'sky', (0, 4, 425, 92), h=58)
    R.band('mountains', 'mountains', (0, 8, 425, 57), key=white)
    R.band('pines', 'pine_treeline', (0, 10, 425, 70), key=white)
    R.band('water', 'terrain/water_surface', (4, 14, 410, 72), h=22)
    im = load(R.biome, 'terrain/chalk_bank_strip').crop((2, 12, 292, 64))
    R.S['bank'] = despeckle(snap(fit_full(unsheet(im, light=225, sat=0.05), 150, 20), R.pal))
    P = 'CURATED_COMPLETE_OBJECTS/'
    # (the curated great willow is cut off on its right; these two are whole)
    # (several of the pack's curated bushes, stumps and willows are cut off
    # on their right: whole ones stand in, Whisperwood's bushes recoloured
    # to the river's palette among them)
    R.prop('willow_great', P + 'great_willow_tree', h=96, colours=22, sheet=True)
    R.prop('willow_second', 'willow_trees_bushes/willow_trees_bushes_002', h=88, colours=22, sheet=True, flip=True)
    R.prop('willow_small', 'willow_trees_bushes/willow_trees_bushes_001', h=46, colours=18, sheet=True)
    R.prop('bush_plain', 'Whisperwood:trees_bushes_flora/trees_bushes_flora_003', w=28)
    R.prop('stump', 'riverbank_flora_props/riverbank_flora_props_023', w=22)
    F = 'riverbank_flora_props/riverbank_flora_props_'
    R.prop('grass_1', F + '015', w=12, colours=8, fringe=True)
    R.prop('grass_2', F + '016', w=12, colours=8, fringe=True)
    R.prop('buttercups', F + '009', w=9, colours=8, fringe=True)
    R.prop('post', F + '026', h=20, colours=8)
    R.prop('sign', F + '027', h=20, colours=10)
    R.prop('branch', F + '021', w=24, colours=8)
    R.prop('pebble', 'riverbank_flora_props/riverbank_flora_props_029', w=8, colours=6)
    R.gatherable('riverchalk', 20, tol=20)
    R.gatherable('frostcap', 22)
    R.gatherable('bogbean', 22)
    R.gatherable('willowbark', 20)
    R.gatherable('reedmace', 28)
    # (the pack's mature shell is barely open; its hover art shows the pearl)
    R.gatherable('riverpearl', 18, idle='hover')
    R.glints()
    return R.S


def quarry():
    R = Region('quarry')
    R.band('sky', 'quarry_sky', (0, 2, 416, 90), h=56)
    R.band('far_cliffs', 'distant_cliffs', (0, 8, 416, 77), key=lambda r, g, b: hsv(r, g, b)[1] < 0.35 and b > 215 and b >= r)
    R.band('near_cliffs', 'near_cliffs', (0, 6, 415, 104), key=lambda r, g, b: (b > r + 20 and hsv(r, g, b)[2] > 0.72) or min(r, g, b) > 225)
    P = 'CURATED_COMPLETE_OBJECTS/'
    # (the sheet's white shows between beams and rungs)
    R.prop('crane', P + 'crane_with_lantern_and_stone', h=72, colours=18, sheet=True)
    R.prop('frame', P + 'quarry_support_beam', h=50, colours=14, sheet=True)
    R.prop('ladder', P + 'ladder', h=34, colours=10, sheet=True)
    R.prop('cart', P + 'mine_cart_full', w=34, colours=16)
    R.prop('crate', P + 'wooden_crate', w=12, colours=10)
    C = 'cranes_carts_ladders/cranes_carts_ladders_'
    R.prop('scaffold', C + '002', h=30, colours=12, sheet=True)
    R.prop('rail_fence', C + '013', w=24, colours=10, sheet=True)
    R.prop('blocks', C + '014', w=30, colours=10)
    R.prop('crate_small', C + '011', w=9, colours=8)
    D = 'shrubs_rocks_decorations/shrubs_rocks_decorations_'
    R.prop('shrub_green', D + '002', w=22)
    R.prop('brush_small', D + '009', w=11, colours=8, fringe=True)
    R.prop('pebbles', D + '014', w=14, colours=8)
    R.prop('stone_block', 'quarry_walls/quarry_walls_002', w=22, colours=10)
    R.prop('stone_pillar', 'quarry_walls/quarry_walls_004', h=26, colours=10)
    R.prop('dirt_heap', 'stone_materials/stone_materials_023', w=18, colours=8)
    R.gatherable('emberflint', 18)
    R.gatherable('mica', 18)
    R.gatherable('saltpetre', 18)
    R.gatherable('sulfur', 18)
    R.gatherable('lodestone', 18)
    R.gatherable('cinnabar', 18)
    R.gatherable('stormglass', 19)
    R.glints()
    return R.S


def moonfen():
    R = Region('moonfen')
    R.band('sky', 'night_sky', (3, 6, 422, 75), h=50, own=20, alone=True)
    R.band('hills', 'distant_hills', (0, 8, 424, 53), key=26)
    R.band('treeline', 'swamp_treeline', (0, 10, 425, 83), key=lambda r, g, b: b > g + 25 and b > r + 30 or min(r, g, b) > 200)
    R.band('mist', 'mist_overlay', (0, 12, 425, 42), key=white)
    im = load(R.biome, 'terrain/bog_water_tiles')
    R.S['water'] = pool(despeckle(snap(fit_full(im.crop((4, 26, 188, 68)), 96, 20), R.pal)), seed=1)
    R.S['water_2'] = pool(despeckle(snap(fit_full(im.crop((202, 26, 420, 68)), 112, 20), R.pal)), seed=2)
    P = 'CURATED_COMPLETE_OBJECTS/'
    R.prop('willow_left', P + 'ancient_willow_left', h=100, colours=22, sheet=True)
    # (cut off on its right in the pack: it stands at the right edge of the frame)
    R.prop('willow_center', P + 'ancient_willow_center', h=86, colours=22, sheet=True)
    R.prop('willow_small', P + 'small_willow', h=52, colours=18, sheet=True)
    R.prop('dead_tree', P + 'dead_swamp_tree', h=58, colours=16)
    # (the curated drowned stump and fallen trunk are cut off on their right: whole ones stand in)
    R.prop('stump_drowned', 'decorative_flora/decorative_flora_003', h=20, colours=14)
    R.prop('stump_glowing', P + 'glowing_wooden_stump', h=26, colours=14)
    R.prop('trunk', 'swamp_trees_props/swamp_trees_props_003', w=44, colours=16)
    R.prop('ghost_stumps', P + 'ghost_crystals_and_stumps', w=26, colours=12)
    F = 'plants_crystals_reeds/plants_crystals_reeds_'
    R.prop('cattails', F + '001', h=30, colours=12)
    R.prop('grass_2', F + '014', w=11, colours=8, fringe=True)
    R.prop('grass_3', F + '005', w=10, colours=8, fringe=True)
    R.prop('fiddleheads', F + '011', w=12, colours=8, fringe=True)
    R.prop('pad', F + '008', w=9, colours=6)
    R.prop('night_flowers', F + '012', w=13, colours=10)
    S = 'stepping_rocks/stepping_rocks_'
    R.prop('rock_big', S + '002', w=30, colours=12)
    R.prop('rock_mid', S + '003', w=20, colours=12)
    R.prop('rock_small', S + '006', w=10, colours=8)
    R.prop('stone_flat', S + '001', w=10, colours=8)
    R.gatherable('gravemoss', 20, closed='closed')
    R.gatherable('starquartz', 22)
    R.gatherable('wisplichen', 22)
    # the pack's "mature" moonlily is its bud, closed at dawn; the open bloom is its "hover" art
    R.gatherable('moonlily', 20, idle='hover', closed='mature')
    R.gatherable('toadstool', 20)
    R.gatherable('sirenreed', 24, closed='closed')
    R.glints()
    return R.S


def crags():
    R = Region('crags')
    R.band('sky', 'smoky_sky', (4, 22, 474, 75), h=64)
    R.band('ridges', 'volcanic_ridges', (4, 28, 474, 77), key=lambda r, g, b: r > 120 and r > g * 1.45)
    R.band('fissures', 'lava_ridges', (4, 37, 474, 80), key=lambda r, g, b: r > 120 and r > g * 1.6 and g < 110)
    P = 'CURATED_COMPLETE_OBJECTS/'
    # (the curated crags and lava pool are cut off on their right: the whole
    # ones from the sheet's other export stand in)
    L = 'lava_rock_vents_plants/lava_rock_vents_plants_'
    R.prop('crag_large', L + '001', h=44, colours=16)
    R.prop('crag_tall', L + '002', h=42, colours=16)
    R.prop('crag_medium', L + '003', h=32, colours=14)
    R.prop('crag_small', L + '003', h=24, colours=14, flip=True)
    R.prop('lava_pool', L + '013', w=48, colours=14)
    R.prop('vent', P + 'lava_vent_with_steam', h=38, colours=16, smoke=True)
    R.prop('gusher', P + 'sulfur_steam_gusher', h=46, colours=16, smoke=True)
    R.prop('rock_mound', L + '015', w=36, colours=14)
    R.prop('rock_1', L + '006', w=16, colours=10)
    R.prop('rock_3', L + '023', w=13, colours=10)
    R.prop('lava_pan', L + '018', w=20, colours=10)
    R.prop('dead_brush', L + '017', h=26, colours=10)
    R.prop('ember_brush', L + '020', w=16, colours=8, fringe=True)
    R.prop('ember_brush_small', L + '028', w=12, colours=8, fringe=True)
    R.gatherable('dragonpepper', 22)
    R.gatherable('cinderscale', 20)
    R.gatherable('ashbloom', 22)
    R.gatherable('obsidian', 22)
    R.glints()
    return R.S


BUILDS = {'forest': forest, 'river': river, 'quarry': quarry, 'moonfen': moonfen, 'crags': crags}


def main():
    only = [a for a in sys.argv[1:] if a in BUILDS]
    preview = sys.argv[sys.argv.index('--preview') + 1] if '--preview' in sys.argv else None
    os.makedirs(OUT_DIR, exist_ok=True)
    out = {}
    for region, build in BUILDS.items():
        png = os.path.join(OUT_DIR, region + '.png')
        if only and region not in only:
            continue
        sprites = build()
        atlas, rects = pack(sprites)
        atlas.save(png, optimize=True)
        out[region] = (atlas.size, rects)
        print(f'{region}: {len(rects)} frames, atlas {atlas.width}x{atlas.height}')
        if preview:
            bg = Image.new('RGBA', atlas.size, (200, 180, 150, 255))
            bg.alpha_composite(atlas)
            bg.resize((atlas.width * 3, atlas.height * 3), Image.NEAREST).save(os.path.join(preview, region + '.png'))
    if only:
        return
    lines = [
        '// Generated by scripts/make-wilds.py from art/wilds/ — do not edit.',
        '// Per region: its atlas (assets/wilds/<region>.png) and frame rectangles [x, y, w, h] in art pixels.',
        '',
        '/** @type {Record<string, {url:string, size:[number, number], frames:Record<string, [number, number, number, number]>}>} */',
        'export const ATLASES = {',
    ]
    for region, (size, rects) in out.items():
        lines.append(f"  {region}: {{")
        lines.append(f"    url: 'assets/wilds/{region}.png',")
        lines.append(f'    size: [{size[0]}, {size[1]}],')
        lines.append('    frames: {')
        for k in sorted(rects):
            lines.append(f"      {k}: [{', '.join(str(v) for v in rects[k])}],")
        lines.append('    },')
        lines.append('  },')
    lines += ['};', '']
    with open(OUT_JS, 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(lines))


if __name__ == '__main__':
    main()
