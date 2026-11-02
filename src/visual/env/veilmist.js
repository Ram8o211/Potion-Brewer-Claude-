// The Veilmist Glade (exotic, invisibility): a pale, overcast sky; rows of
// ghostly white trees fading into banks of mist; in front a glade of
// silver moss over pale clay and blue-grey stones, white birches and
// weeping willows with silvery leaves, a still pool, glass-clear crystals,
// a faded shrine. Everything is a little washed out, a little half there.
// A veil of mist lies over it all (wild-scene.js): the finger wipes it
// away, and it slowly closes again.

import { sky } from './paint.js';
import { palette, vary, streamOf } from './kit.js';
import { heights, dip, fillSolid, ledges, paintTerrain, pool, markOpen, glow, silhouette } from './side.js';
import { fog, moss, ruins, glowShrooms, veins, WATER_VEINS } from './cave.js';
import { spire, cairn, reeds } from './objects.js';
import { terrainTrees, treeRow } from './trees.js';
import { mistBands } from './exotic.js';
import { pack } from '../color.js';

export function compose(cv, seed) {
  const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'veilmist', p);
  const pal = vary(palette({
    leaf: ['#a8d0c4', { spread: 0.5, cool: 0.5 }], leaf2: ['#c8e0dc', { spread: 0.5 }], bloom: ['#ffffff', { spread: 0.2 }], bark: '#d8dce0', wood: '#8a8478', rock: ['#9aa4b0', { spread: 0.4 }],
    reed: ['#7a948a', { spread: 0.4 }], cattail: '#6a6460', gem: ['#d8f4ff', { spread: 0.3 }], moss: '#8ab4a4',
  }), s('pal'), 0.7);
  const dusk = s('tod').next() < 0.35;
  sky(cv, 0, H, dusk ? ['#5a6488', '#8a90b0', '#c0c4d8', '#e4e4ee'] : ['#94a6bc', '#b4c4d4', '#d4dee8', '#eef2f6'], 10);
  // the far glade: ghost trees in rows, fading into the mist
  const fl = silhouette(cv, { base: 136, amp: 6, freq: 0.02, seed: s('far').int(0, 1e9), fill: '#c4ced8', rim: '#d8e0e8' });
  treeRow(cv, s('row1'), pal, { line: fl, gap: [10, 18], h: [40, 60], haze: '#dde4ec', fade: 0.75, kind: 'birch' });
  fog(cv, '#e8eef4', 90, 160, 0.4, s('fog1').int(0, 1e9));
  const nl = silhouette(cv, { base: 146, amp: 5, freq: 0.03, seed: s('near').int(0, 1e9), fill: '#aab6c4', rim: '#c4ced8' });
  treeRow(cv, s('row2'), pal, { line: nl, gap: [14, 24], h: [50, 76], haze: '#d4dce6', fade: 0.55, kind: s('rowk').next() < 0.5 ? 'birch' : 'willow' });
  ruins(cv, { n: 3, fill: '#b8c2ce', line: '#9aa6b4', rim: '#d4dce6', seed: s('ruins').int(0, 1e9), floor: 168 });
  fog(cv, '#e4eaf0', 120, 190, 0.35, s('fog2').int(0, 1e9));
  // the glade: gentle ground, a still pool, a ledge or two of pale rock
  const ts = s('terrain'), top = heights(W, ts.int(0, 1e9), { base: ts.int(160, 170), amp: ts.int(5, 11), freq: 0.012 });
  const pools = [];
  if (ts.next() < 0.75) {
    const px = ts.int(60, W - 60), hw = ts.int(20, 34);
    pools.push({ x: px, hw, level: Math.round(top[px]) + 2 });
    dip(top, px, hw, ts.int(10, 15));
  }
  fillSolid(cv, top);
  ledges(cv, top, ts, ts.int(5, 9), { keep: pools.map((p) => [p.x - p.hw - 4, p.x + p.hw + 4]) });
  const ss = ts.int(0, 1e9);
  paintTerrain(cv, {
    a: '#7a8494', b: '#8a94a4', grain: '#b4bcc8', dark: '#2a303c', deep: '#1a1e28', cave: '#12141c',
    crust: ['#e4f6ec', '#aed0c0', '#7aa494', '#587a6e'], crustH: 4, seed: ss,
    cobble: { stones: ['#5e6a7e', '#525e72', '#6a768a', '#48546a', '#76829a', '#5a667a'], mortar: '#0c1018', s: 10, moss: ['#6a9084', '#b8dccc'] },
    grass: { cols: ['#b8d8c8', '#d4ece0', '#94bcac'], tall: 4, rate: 0.6, flowers: ['#ffffff', '#e8f4ff', '#f4e8ff'] },
    layers: [
      { kind: 'clay', cols: ['#b4bcc8', '#a4acba', '#c4ccd6', '#98a2b0'], h: [8, 12] },
      { kind: 'band', cols: ['#6a7484', '#7a8494', '#9aa4b2', '#2a303c'], h: [3, 5] },
    ],
  });
  moss(cv, { cols: ['#d4ece0', '#aed0c0', '#88b0a0', '#6a9084'], seed: ss + 1, drape: 10, rate: 0.28, len: 14 });
  cv.meta.pools = pools.map((p) => pool(cv, p.x - p.hw, p.x + p.hw, p.level, { surface: '#ffffff', body: ['#c4d4e4', '#a4b8cc', '#8aa0b8', '#7088a4'], see: 0.3, bed: ['#6a7484', '#7a8494', '#5a6474'] }));
  cv.meta.pools.forEach((p, i) => veins(cv, p, { ...WATER_VEINS(ss + 4 + i, ['#d4e4f4', '#a4b8cc', '#8aa0b8', '#7088a4']), n: 2, reach: 30 }));
  markOpen(cv);
  // white birches and silvery willows
  const look = { mats: ['leaf', 'leaf2'], bloom: { mat: 'bloom', rate: 0.08 }, hang: { mat: 'leaf2', rate: 0.25, len: /** @type {[number, number]} */ ([4, 14]) } };
  terrainTrees(cv, s('trees'), pal, { n: s('trees').int(3, 6), kinds: ['birch', 'willow', 'sparse', 'birch'], h: [50, 104], gap: 50, ledges: true, look });
  // glass crystals, a cairn, reeds at the pool, pale glowing caps
  const sr = s('stones');
  for (let i = 0; i < sr.int(2, 4); i++) {
    const at = cv.place(spire(sr, sr.int(8, 16)), pal, sr.int(16, W - 16), { foot: [4, 2], range: 40 });
    if (at) glow(cv, at.fx, at.fy - 8, 26, [0.85, 0.95, 1], 0.35);
  }
  cv.place(cairn(sr, 6), pal, sr.int(20, W - 20), { foot: [6, 2], range: 60 });
  const rr = s('reeds');
  for (const p of pools) for (const side of [-1, 1]) cv.place(reeds(rr, rr.int(10, 16), rr.int(3, 5), { heads: 0.3 }), pal, p.x + side * (p.hw + 6), { range: 20, step: 2 });
  const glows = glowShrooms(cv, { n: 5, cap: '#e8f4ff', lit: '#ffffff', stem: '#a8b4c0', rgb: [0.85, 0.92, 1], seed: s('caps').int(0, 1e9) });
  // banks of mist lying low over the glade
  mistBands(cv, pack([0.94, 0.96, 1]), [[150, 9, 0.2], [178, 7, 0.14], [120, 7, 0.12]], s('mist').int(0, 1e9));
  cv.meta.glows = glows;
  cv.meta.mist = true;
  cv.meta.vignette = 0.25;
  cv.meta.wind = 0.5;
  cv.meta.horizon = 140;
}
