"""Build the Sunlit Meadow sprite atlas from the concept-art pack.
Dev-time only: `python scripts/make-meadow.py` (needs Pillow and NumPy).

The pack in art/meadow/ (plants, background layers and environment props,
cut from generated concept sheets) is drawn on a soft grid of 8 to 16 source
pixels per art pixel. Each sprite is brought to the size it takes in the
256 x 144 Wilds scene by majority vote over each block of a quantised copy,
with a hard alpha (scripts/pixelart.py `fit`: to an exact size, as these
sheets have no common grid). Everything is then snapped to
one meadow palette: the colours of the pack's full scene preview, so the
layers read as one picture; gatherables keep their own accent colours too.

- background: sky, clouds, far and near mountains, the treeline and birds
- scenery: the oak, bushes, rocks, the fence, flower clumps and grass
  (no outline, so they stay behind the gatherables)
- gatherables, one per real meadow ingredient (materials/wild.js keys):
  the mature clump outlined in ink with a light-outlined hover frame and the
  harvested remnant as its depleted frame, all on one bottom-centre anchor;
  the dawn / dusk plants also have their closed frames (Dreamclover's buds,
  Hemlock's shut seed pods) shown out of their hour
- icons: each ingredient's single flower (or seed head) at 32 px for the
  shelf and the book, and at 48 px for its deposit card (both shown at
  about that many CSS pixels, so their detail is not crowded)

Writes assets/meadow/atlas.png and src/rendering/meadow-atlas.js (the frame
rectangles). `--preview out.png` also writes an enlarged sheet.
"""
import os
import sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'art', 'meadow')
OUT_PNG = os.path.join(ROOT, 'assets', 'meadow', 'atlas.png')
OUT_JS = os.path.join(ROOT, 'src', 'rendering', 'meadow-atlas.js')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pixelart as ww  # noqa: E402
from pixelart import INK, GLOW, trim, outline, anchored, accents, snap, despeckle, defringe, pack, fit  # noqa: E402


def load(rel):
    return Image.open(os.path.join(SRC, rel + '.png')).convert('RGBA')


# The meadow palette: the 64 colours of the pack's full scene preview
# (04_COMPLETE_SCENE_PREVIEWS/01_Full_Sunlit_Meadow_composition.png, median
# cut), plus the outline colour and white.
SCENE = ww.hexes(
    '#fdfdfc', '#ceecfc', '#e1f27c', '#dcf01f', '#b0e3e8', '#99dfae', '#98e236', '#a1e522',
    '#83dd22', '#b3d073', '#d2a677', '#80d35f', '#7dc88d', '#71cd61', '#6ec076', '#5dce4d',
    '#5ac36d', '#5ebc97', '#4dbb80', '#4eb4fd', '#53b441', '#3fb378', '#48ac95', '#37ab74',
    '#32a0fd', '#379bb8', '#41a02f', '#339d30', '#2c9b30', '#2599fd', '#2295fd', '#1c92fd',
    '#1692fd', '#1c983a', '#cd7573', '#4c7670', '#288876', '#26749c', '#198efd', '#1b8c3e',
    '#1b784c', '#168dfd', '#148b38', '#137543', '#067653', '#05773b', '#067834', '#077827',
    '#055f4b', '#045f2f', '#93413e', '#512834', '#1c4542', '#1f131c', '#034f55', '#02424f',
    '#024f2e', '#02432c', '#013b2b', '#012f30', '#012b24', '#022918', '#021218', '#020502',
    '#1a1218', '#ffffff',
)


PAL = SCENE


def clean(im, extra=None, fringe=False):
    """Snap to the meadow palette plus the sprite's own non-green colours (bark, stone, petals)."""
    im = snap(im, PAL + (accents(im, 10) if extra is None else list(extra)))
    if fringe:
        im = trim(defringe(im))
    return despeckle(im)


def scenery(rel, w=None, h=None, colours=14, fringe=False, own=10):
    im = fit(load(rel), w, h, colours)
    return clean(im, accents(im, own), fringe=fringe)


def lift(h, s, v):
    # Hemlock's seed heads are near black in the pack: lift them off the outline colour
    return h, s, min(1, v * 1.3 + 0.08)


def gatherable(key, rel, h, depleted, closed=None, icon=None, tint=None):
    """idle + hover (+ depleted, closed, closed_hover) on one anchor, and the icons."""
    def prep(im, hh):
        im = fit(im, h=hh, colours=18)
        return outline(clean(ww.recolour(im, tint) if tint else im), INK)
    base = prep(load(rel), h)
    frames = {'idle': base, 'hover': outline(base, GLOW), 'depleted': prep(load(depleted), max(8, round(h * 0.5)))}
    if closed:
        c = prep(load(closed), h)
        frames['closed'], frames['closed_hover'] = c, outline(c, GLOW)
    out = {f'{key}_{k}': v for k, v in anchored(frames).items()}
    src = load(icon)
    for size, name in ((32, 'icon'), (48, 'card')):
        im = fit(src, h=size - 2, colours=32)
        if im.width > size - 2:
            im = fit(src, w=size - 2, colours=32)
        im = ww.recolour(im, tint) if tint else im
        # (UI pictures keep the icon's own colours: a small flower has no pixel to spare for its heart)
        out[f'{key}_{name}'] = outline(despeckle(im), INK)
    return out


def build():
    S = {}
    B, E, P = 'background/', 'environment/', 'plants/'
    # sky and distance (full scene width)
    S['sky'] = clean(fit(load(B + 'sky_gradient_01'), 256, 78, colours=10), extra=[])
    S['far_mountains'] = clean(fit(load(B + 'far_mountain_strip_01'), w=256, colours=10))
    S['near_mountains'] = clean(fit(load(B + 'near_mountain_strip_01'), w=256, colours=14))
    S['treeline'] = clean(fit(load(B + 'treeline_strip_01'), w=256, colours=14))
    for i, w in ((1, 44), (2, 22), (3, 32), (5, 26), (6, 46), (8, 30)):
        S[f'cloud_{i}'] = clean(fit(load(B + f'cloud_0{i}'), w=w, colours=6), fringe=True)
    for i in (1, 3):
        S[f'bird_{i}'] = fit(load(B + f'bird_0{i}'), w=6, colours=3, alpha_share=0.4)
    # scenery
    # its bark re-shaded with the Whisperwood oaks' ramp (lit from the left, two grooves)
    S['oak'] = ww.bark_texture(scenery(E + 'oak_tree_01', h=84, colours=32, own=16), seed=3)
    S['fence'] = scenery(E + 'fences_props_atlas_01', w=112, colours=10)
    S['bush_round'] = scenery(E + 'bushes_flora_atlas_01', w=34)
    S['bush_low'] = scenery(E + 'bushes_flora_atlas_03', w=30)
    S['bush_pink'] = scenery(E + 'bushes_flora_atlas_04', w=30)
    S['bush_white'] = scenery(E + 'bushes_flora_atlas_07', w=26)
    S['bush_dark'] = scenery(E + 'bushes_props_atlas_02', w=28)
    S['rock_big'] = scenery(E + 'rocks_flora_atlas_02', w=40)
    S['rock_pair'] = scenery(E + 'rocks_flora_atlas_03', w=30)
    S['rock_mossy'] = scenery(E + 'rocks_flora_atlas_01', w=34)
    for n, src, w in (('daisies', 'flowers_flora_atlas_01', 14), ('pinks', 'flowers_flora_atlas_02', 12), ('yellows', 'flowers_flora_atlas_03', 12),
                      ('mixed', 'flowers_flora_atlas_08', 14), ('daisy_clump', 'flowers_props_atlas_06', 12), ('buttercups', 'flowers_props_atlas_07', 11),
                      ('pink_clump', 'flowers_props_atlas_08', 14), ('posies', 'flowers_props_atlas_09', 14)):
        S['flowers_' + n] = scenery(E + src, w=w, colours=10, fringe=True)
    for i, w in ((1, 26), (2, 14), (3, 14), (4, 13), (5, 9), (6, 9), (7, 7), (8, 8)):
        S[f'grass_{i}'] = scenery(E + f'grass_flora_atlas_0{i}', w=w, colours=8, fringe=True)
    # the foreground grass along the bottom of the frame, larger
    S['grass_near'] = scenery(E + 'grass_flora_atlas_01', w=44, colours=10, fringe=True)
    # gatherables and icons, one per real meadow ingredient
    S.update(gatherable('heartpetal', P + 'Ember_Heartpetal_mature_cluster', 24, P + 'Ember_Heartpetal_harvested_remnant', icon=P + 'Ember_Heartpetal_flower_icon'))
    S.update(gatherable('sunthistle', P + 'Witch_Sunthistle_mature_cluster', 24, P + 'Witch_Sunthistle_harvested_remnant', icon=P + 'Witch_Sunthistle_flower_icon'))
    S.update(gatherable('nettle', P + 'Moss_Nettle_mature_cluster', 25, P + 'Moss_Nettle_harvested_remnant', icon=P + 'Moss_Nettle_plant_icon'))
    S.update(gatherable('dreamclover', P + 'Hollow_Dreamclover_open_blossoms', 22, P + 'Ember_Heartpetal_harvested_remnant',
                        closed=P + 'Hollow_Dreamclover_closed_buds', icon=P + 'Hollow_Dreamclover_flower_icon'))
    S.update(gatherable('beebalm', P + 'Frost_Bee_Balm_mature_cluster', 27, P + 'Frost_Bee_Balm_harvested_remnant', icon=P + 'Frost_Bee_Balm_flower_icon'))
    S.update(gatherable('hemlock', P + 'Thorn_Hemlock_Seed_opened_seed_heads', 27, P + 'Moss_Nettle_harvested_remnant',
                        closed=P + 'Thorn_Hemlock_Seed_closed_seed_pods', icon=P + 'Thorn_Hemlock_Seed_seed_icon', tint=lift))
    # the glint over a fully grown gatherable (the Whisperwood frames)
    for i in range(4):
        S[f'glint_{i}'] = trim(ww.down(Image.open(os.path.join(ROOT, 'art', 'effects', f'glint_frame_0{i}.png')).convert('RGBA'), f=2, colours=4, alpha_share=0.25))
    return S


def main():
    sprites = build()
    atlas, rects = pack(sprites)
    os.makedirs(os.path.dirname(OUT_PNG), exist_ok=True)
    atlas.save(OUT_PNG, optimize=True)
    lines = [
        '// Generated by scripts/make-meadow.py from art/meadow/ — do not edit.',
        '// Frame rectangles [x, y, w, h] in assets/meadow/atlas.png (art pixels).',
        '',
        "export const ATLAS_URL = 'assets/meadow/atlas.png';",
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
        bg = Image.new('RGBA', atlas.size, (200, 180, 150, 255))
        bg.alpha_composite(atlas)
        bg.resize((atlas.width * 4, atlas.height * 4), Image.NEAREST).save(out)


if __name__ == '__main__':
    main()
