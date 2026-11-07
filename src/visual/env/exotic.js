// The five newer exotic biomes, composed with the same kit as the rest of
// the wilds (side.js, cave.js, objects.js, trees.js), each with a grammar of
// its own:
//
//   Skyshard Archipelago — a bright sky; one low layer of ground along the
//     bottom with violet crystals, and above it nothing but floating isles of
//     every size (drawn apart from the painting, so a finger can push them:
//     rendering/exotic-fx.js).
//   Morphgrove — a dusk-pink grove of wisteria and twisted trunks; pink caps
//     and shifting blooms (the blooms change shape under the finger).
//   Veil Hollow — a hollow of grey-violet forest filled with mist up to the
//     top of the view: a shrine gate, stone lanterns, falls of pale water;
//     the mist parts where a finger stirs it and shows what it hides.
//   Ghostglass Reef — under water: light shafts slanting down, a reef of
//     teal coral cobbles, a sunken ring, tall spectral crystals (drawn apart:
//     they phase clear at a touch), drifting light.
//   Chronoglass Wastes — a violet-to-rose evening over rose hills and a
//     ghostly broken tower; slabs of golden sandstone over cobbled brown
//     rock, broken standing stones, golden-leaved trees, a thin ghost of a
//     clock face in the sky, sandfalls whose grains a touch sends backward
//     or racing.
//
// Pure and deterministic like every region (streamOf(seed, region, part)).

import { sky } from './paint.js';
import { palette, vary, streamOf, lx } from './kit.js';
import { heights, raise, dip, fillSolid, blob, paintTerrain, pool, markOpen, silhouette, mountains, glow, ledges, treeShape } from './side.js';
import { fog, vines, glowShrooms, ruins, fall, moss } from './cave.js';
import { cloud, spire, boulder } from './objects.js';
import { terrainTrees } from './trees.js';
import { fbm1, fbm2 } from '../noise.js';
import { pack, Canvas } from './paint.js';

/** A small pixel sprite drawn apart from the painting (it moves or changes): packed pixels and where it sits. */
function sprite(w, h) { return { w, h, px: new Uint32Array(w * h), x: 0, y: 0 }; }

/**
 * A floating isle as a sprite, painted as the ground is (paintTerrain with the
 * scene's own ground: its grassy crust, its strata, its cobbles), on a
 * shape of its own: a lumpy top with rounded shoulders, an underside of rock
 * hanging off-centre in uneven lobes and points, all in two-pixel steps.
 * @param {any} rng @param {number} w @param {number} h the isle's body (the sprite has room above it for the grass)
 * @param {any} ground paintTerrain's options for the scene's ground
 */
function isleSprite(rng, w, h, ground) {
  const M = 6, H = h + M, icv = new Canvas(rng.int(0, 1e9), w, H), seed = rng.int(0, 1e9);
  const cx = w / 2 + (rng.next() - 0.5) * w * 0.3;
  // a few lobes of rock hanging under it, one of them the lowest point
  const lobes = [];
  for (let i = 0, n = 1 + rng.int(1, 3); i < n; i++) lobes.push([cx + (rng.next() - 0.5) * w * 0.6, (0.18 + rng.next() * 0.3) * (i ? 0.7 : 1), 5 + w * (0.12 + rng.next() * 0.12)]);
  /** @type {number[][]} [x0, shoulder, depth] per pair of columns */
  const cols = [];
  for (let x0 = 0; x0 < w; x0 += 2) {
    // (judged two columns at a time: blocky like the ground's own edges)
    const xm = x0 + 1, u = Math.min(1, Math.abs(xm - cx) / Math.max(cx, w - cx));
    const shoulder = Math.round(Math.pow(u, 3) * 4 + fbm1(xm * 0.18, seed, 2) * 3);
    let depth = 0.55 * Math.pow(1 - u * u, 1.3);
    for (const [lx, ld, lw] of lobes) depth += ld * Math.max(0, 1 - (Math.abs(xm - lx) / lw) ** 2);
    cols.push([x0, shoulder, depth * (0.8 + fbm1(xm * 0.3, seed + 3, 2) * 0.4)]);
  }
  // the deepest point reaches the bottom of the sprite
  const deepest = Math.max(...cols.map(([, sh, d]) => d / Math.max(1, h - sh - 1)));
  /** its top surface, column by column (local px): where plants may grow on it @type {number[][]} */
  const surf = [];
  for (const [x0, shoulder, d] of cols) {
    const y0 = M + shoulder, depth = Math.max(5, Math.round(d / deepest));
    for (let x = x0; x < Math.min(w, x0 + 2); x++) {
      for (let y = y0; y < Math.min(H, y0 + depth); y++) icv.solid[y * w + x] = 1;
      surf.push([x, y0]);
    }
  }
  paintTerrain(icv, { ...ground, seed: ground.seed + seed });
  const sp = /** @type {any} */ (sprite(w, H));
  sp.px.set(icv.pix.px);
  sp.surf = surf;
  return sp;
}

/** A spectral crystal spire as a sprite: lit face, shadow face, a bright ridge and a white apex. */
function crystalSprite(rng, h, cols) {
  const w = Math.max(5, Math.round(h * 0.38)), s = sprite(w + 2, h + 1), cx = Math.floor((w + 2) / 2);
  for (let y = 0; y <= h; y++) {
    const half = y < h * 0.25 ? (y / (h * 0.25)) * (w / 2) : w / 2;
    for (let x = 0; x < w + 2; x++) {
      const dx = x - cx;
      if (Math.abs(dx) > half) continue;
      let c = dx < 0 ? cols[2] : cols[1];
      if (dx === 0) c = cols[3];
      if (y < 2) c = 0xffffffff;
      if (Math.abs(dx) > half - 1) c = cols[0];
      s.px[y * (w + 2) + x] = c;
    }
  }
  void rng;
  return s;
}

/** Set a sprite down in the scene's meta (drawn by rendering/exotic-fx.js). */
function keep(cv, list, s, x, y, extra = {}) {
  s.x = Math.round(x - s.w / 2); s.y = Math.round(y - s.h);
  (cv.meta[list] ||= []).push({ ...s, ...extra });
}

export const skyshard = {
  /** @param {any} cv @param {string} seed */
  compose(cv, seed) {
    const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'skyshard', p);
    const pal = vary(palette({
      leaf: ['#5ac84a', { spread: 0.6 }], leaf2: ['#7ad85a', { spread: 0.6 }], bloom: ['#ffffff', { spread: 0.2 }], bark: '#5a4a3a', rock: '#7a8494',
      cloud: ['#f4f8ff', { spread: 0.2 }], gem: ['#b48cff', { spread: 0.5 }],
    }), s('pal'), 0.8);
    sky(cv, 0, H, ['#3a8ae0', '#5ab0f0', '#8ccaf4', '#c8e6fa', '#e8f4fc']);
    // high wisps, then a sea of cloud far below everything
    const cr = s('clouds');
    for (let i = 0; i < 6; i++) cv.stamp(cloud(cr, cr.int(30, 80), cr.int(8, 16)), pal, cr.int(20, W - 20), cr.int(18, 90), { outline: false, texture: 0 });
    // distant isles, pale with the air between
    const fr = s('far');
    for (let i = 0; i < 6; i++) {
      const x = fr.int(10, W - 10), y = fr.int(70, 120), rx = fr.int(10, 24);
      for (let yy = 0; yy < rx; yy++) for (let xx = -rx; xx <= rx; xx++) {
        const half = rx * (1 - Math.pow(yy / rx, 1.4));
        if (Math.abs(xx) > half) continue;
        cv.set(x + xx, y + yy, pack(yy < 2 ? [0.62, 0.8, 0.62] : [0.62, 0.7, 0.82]));
      }
    }
    fog(cv, '#d8ecfa', 80, 170, 0.35, s('haze').int(0, 1e9));
    // the ground: one low, unbroken layer of land along the bottom; everything
    // above it floats
    const ts = s('terrain'), top = heights(W, ts.int(0, 1e9), { base: 184, amp: 5, freq: 0.018 });
    fillSolid(cv, top);
    const ss = ts.int(0, 1e9), ground = {
      a: '#5a6474', b: '#6a7486', grain: '#9aa4b4', dark: '#2a3040', deep: '#1a2030', cave: '#141a26',
      crust: ['#8ce05a', '#5ac84a', '#3a9a3a', '#2a6a30'], crustH: 4, seed: ss,
      cobble: { stones: ['#6a7486', '#7a8496', '#5a6476', '#8a94a6', '#6e788a', '#76808f'], mortar: '#1a2030', s: 9, moss: ['#3a9a3a', '#8ce05a'] },
      grass: { cols: ['#6ad04a', '#8ce05a', '#4ab03a'], tall: 3, rate: 0.6, flowers: ['#ffffff', '#c8e8ff', '#ffe8a0'] },
      layers: [{ kind: 'band', cols: ['#7a8496', '#8a94a6', '#9aa4b4', '#4a5464'], h: /** @type {[number, number]} */ ([3, 5]) }],
    };
    paintTerrain(cv, ground);
    markOpen(cv);
    // violet crystals and a few low trees on the ground
    const sr = s('crystals'), glows = [];
    for (let i = 0; i < 4; i++) {
      const at = cv.place(spire(sr, sr.int(8, 14)), pal, sr.int(16, W - 16), { foot: [4, 2], range: 40 });
      if (at) { glow(cv, at.fx, at.fy - 7, 26, [0.7, 0.55, 1], 0.4); glows.push([at.fx, at.fy - 7]); }
    }
    terrainTrees(cv, s('trees'), pal, { n: 2, kinds: ['gnarl', 'sparse'], shapes: ['spread', 'lean'], h: [32, 50], gap: 80, look: { mats: ['leaf', 'leaf2'], bloom: { mat: 'bloom', rate: 0.04 } } });
    // above the ground only floating isles, of every size: sprites a finger can
    // push (exotic-fx.js springs them back), painted like the ground; set apart so none overlaps another
    const ir = s('isles');
    const sizes = [16, 22, 30, 40, 52, 66];
    for (let i = sizes.length - 1; i > 0; i--) { const j = ir.int(0, i); [sizes[i], sizes[j]] = [sizes[j], sizes[i]]; }
    const floor = Math.min(...top) - 28, /** @type {number[][]} */ boxes = [];
    for (const w0 of sizes) {
      const w = w0 + ir.int(-2, 2), h = Math.round(w * (0.42 + ir.next() * 0.2)) + 6;
      for (let k = 0; k < 40; k++) {
        const x = ir.int(Math.ceil(w / 2) + 4, W - Math.ceil(w / 2) - 4), y = ir.int(h + 22, floor);
        const box = [x - w / 2 - 8, y - h - 8, x + w / 2 + 8, y + 8];
        if (boxes.some((b) => box[0] < b[2] && b[0] < box[2] && box[1] < b[3] && b[1] < box[3])) continue;
        boxes.push(box);
        keep(cv, 'isles', isleSprite(ir, w, h, ground), x, y);
        break;
      }
    }
    // the isles' tops are ground where the region's plants grow (marked once the painting is done, scene.js,
    // so nothing is painted onto the sky where they rest; the plants on them ride along, exotic-fx.js)
    /** @type {number[]} */
    const late = [];
    for (const is of cv.meta.isles || []) for (const [x, y] of is.surf) {
      const X = is.x + x, Y = is.y + y;
      // (not right at an isle's edge, where it drops away)
      if (x < 2 || x > is.w - 3 || X < 2 || X > W - 3 || Y < 2) continue;
      late.push(Y * W + X, (Y - 1) * W + X);
    }
    cv.meta.openLate = late;
    cv.meta.glows = glows;
    cv.meta.vignette = 0.2;
    cv.meta.wind = 1.2;
    cv.meta.horizon = 120;
  },
};

export const morphgrove = {
  /** @param {any} cv @param {string} seed */
  compose(cv, seed) {
    const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'morphgrove', p);
    const pal = vary(palette({
      leaf: ['#e87ac8', { spread: 0.5 }], leaf2: ['#3aa86a', { spread: 0.6 }], bloom: ['#ffd0f0', { spread: 0.3 }], bark: '#5a3a2a', moss: '#4ab06a', rock: '#5a5470',
      cap: ['#ff8ad8', { spread: 0.4 }], gem: ['#7af0a8', { spread: 0.4 }],
    }), s('pal'), 0.9);
    sky(cv, 0, H, ['#3a2a5a', '#6a3a7a', '#a85a8a', '#e88aa0', '#f8c0b0']);
    mountains(cv, { base: 120, amp: 30, n: 5, seed: s('m').int(0, 1e9), fill: '#5a3a6a', lit: '#7a4a7a', dark: '#4a2a5a' });
    fog(cv, '#c88aa8', 90, 150, 0.3, s('haze').int(0, 1e9));
    const line = silhouette(cv, { base: 132, amp: 7, freq: 0.03, seed: s('tl').int(0, 1e9), fill: '#3a2a4a', rough: 3 });
    const tl = s('tl2');
    for (let x = 4; x < W; x += tl.int(9, 16)) treeShape(cv, x, line[x] + 2, tl.int(14, 26), 'oak', '#3a2a4a', tl.int(0, 1e9));
    const ts = s('terrain'), top = heights(W, ts.int(0, 1e9), { base: 164, amp: 8, freq: 0.016 });
    const rx = ts.int(lx(cv, 140), lx(cv, 240));
    raise(top, rx - 30, rx + 30, Math.min(...top) - 10, 4);
    fillSolid(cv, top);
    ledges(cv, top, ts, 6, { keep: [[rx - 34, rx + 34]] });
    const ss = ts.int(0, 1e9);
    paintTerrain(cv, {
      a: '#3a2a3a', b: '#4a3446', grain: '#7a5a6a', dark: '#1a1018', deep: '#100810', cave: '#0a0608',
      crust: ['#7ae08a', '#4ab06a', '#2a8a5a', '#1e5a40'], crustH: 4, seed: ss,
      cobble: { stones: ['#4a4058', '#5a4e68', '#3e3448', '#6a5a78', '#544862', '#463c52'], mortar: '#0a0610', s: 10, moss: ['#2a8a5a', '#7ae08a'] },
      grass: { cols: ['#5ac87a', '#7ae08a', '#3aa86a'], tall: 4, rate: 0.6, flowers: ['#ff8ad8', '#ffd0f0', '#c8a4ff', '#ffffff'] },
      layers: [{ kind: 'dirt', cols: ['#4a2a3a', '#5a3446', '#7a4a5a', '#a86a7a', '#c8a4b4', '#3a2430'], h: [8, 12] }],
    });
    moss(cv, { cols: ['#7ae08a', '#4ab06a', '#2a8a5a', '#1e5a40'], seed: ss + 1, drape: 10, rate: 0.3, len: 12 });
    markOpen(cv);
    terrainTrees(cv, s('trees'), pal, { n: 3, kinds: ['wisteria', 'gnarl', 'wisteria'], shapes: ['spread', 'lean'], h: [70, 120], gap: 70, ledges: true, look: { mats: ['leaf', 'leaf2'], bloom: { mat: 'bloom', rate: 0.12 }, hang: { mat: 'leaf', rate: 0.35, len: [4, 14] } } });
    const glows = glowShrooms(cv, { n: 6, cap: '#ff8ad8', lit: '#ffe0f4', stem: '#d8c8d8', rgb: [1, 0.5, 0.85], seed: s('caps').int(0, 1e9) });
    // the shifting blooms: points in the grass where a bloom stands that changes shape under the finger (exotic-fx.js)
    const mr = s('morphs'), morphs = [];
    for (let i = 0; i < 7; i++) {
      const x = mr.int(10, W - 10);
      let y = 0;
      while (y < H - 1 && !(cv.open[y * W + x] && cv.solid[(y + 1) * W + x])) y++;
      if (y < H - 2) morphs.push({ x, y, hue: mr.int(0, 2) });
    }
    cv.meta.morphs = morphs;
    cv.meta.glows = glows;
    cv.meta.vignette = 0.4;
    cv.meta.wind = 0.6;
    cv.meta.horizon = 122;
  },
};

export const veilhollow = {
  /** @param {any} cv @param {string} seed */
  compose(cv, seed) {
    const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'veilhollow', p);
    const pal = vary(palette({
      leaf: ['#4a6a5a', { spread: 0.4 }], leaf2: ['#3a5a5a', { spread: 0.4 }], bloom: ['#c8a4ff', { spread: 0.3 }], bark: '#2a2420', moss: '#3a6a4a', rock: '#4a4a58', timber: '#3a2420',
    }), s('pal'), 0.8);
    sky(cv, 0, H, ['#2a2a3a', '#3a3a4e', '#5a5a6e', '#7a7a8a', '#9a9aa8']);
    // the far wood in veils of mist, layer upon layer
    for (let L = 0; L < 3; L++) {
      const line = silhouette(cv, { base: 110 + L * 12, amp: 8, freq: 0.03, seed: s('w' + L).int(0, 1e9), fill: ['#4a4a5e', '#3e3e52', '#323246'][L], rough: 3 });
      const tr = s('t' + L);
      for (let x = 2; x < W; x += tr.int(8, 16)) treeShape(cv, x, line[x] + 2, tr.int(18, 34), tr.next() < 0.5 ? 'pine' : 'oak', ['#4a4a5e', '#3e3e52', '#323246'][L], tr.int(0, 1e9));
      fog(cv, '#9a9ab0', -60, 170, 0.28, s('fog' + L).int(0, 1e9));
    }
    const ts = s('terrain'), top = heights(W, ts.int(0, 1e9), { base: 166, amp: 10, freq: 0.018 });
    const px = ts.int(lx(cv, 120), lx(cv, 260)), hw = ts.int(lx(cv, 20), lx(cv, 30));
    dip(top, px, hw, 14);
    fillSolid(cv, top);
    ledges(cv, top, ts, 7, { keep: [[px - hw - 4, px + hw + 4]], high: 1 });
    const ss = ts.int(0, 1e9);
    paintTerrain(cv, {
      a: '#2a2a32', b: '#34343e', grain: '#5a5a6a', dark: '#121218', deep: '#0a0a10', cave: '#060608',
      crust: ['#5a8a6a', '#3a6a4a', '#2a4a3a', '#1a3428'], crustH: 4, seed: ss,
      cobble: { stones: ['#3a3a48', '#44445a', '#323240', '#4e4e64', '#3e3e50', '#48485c'], mortar: '#08080c', s: 10, moss: ['#2a4a3a', '#5a8a6a'] },
      grass: { cols: ['#4a7a5a', '#5a8a6a', '#3a6a4a'], tall: 4, rate: 0.5, flowers: ['#c8a4ff', '#e8dcff'] },
      layers: [{ kind: 'band', cols: ['#3a3a48', '#4a4a5a', '#5a5a6e', '#22222a'], h: [3, 5] }],
    });
    const pd = pool(cv, px - hw, px + hw, Math.round(top[px]) - 2, { surface: '#c8c8e8', body: ['#3a3a6a', '#2e2e5a', '#24244a', '#1a1a3a'], see: 0.15, bed: ['#1a1a24', '#24242e'] });
    cv.meta.pools = [pd];
    markOpen(cv);
    // veil falls into the pool, from the cliff of the ledge above
    fall(cv, px - 6, 0, { cols: ['#e8e8ff', '#b8b8e8', '#8a8ac8'], w: 2, seed: ss + 3, rgb: [0.75, 0.75, 1] });
    // the shrine gate: two dark posts and a curved lintel; stone lanterns with a warm light
    const gx = ts.int(lx(cv, 40), lx(cv, 100)), gy = Math.round(top[gx]);
    const post = pack([0.16, 0.1, 0.12]), lint = pack([0.3, 0.14, 0.16]), lit = pack([0.5, 0.24, 0.26]);
    for (const ox of [-14, 14]) for (let y = gy - 40; y < gy; y++) for (let x = gx + ox - 2; x <= gx + ox + 1; x++) cv.set(x, y, x === gx + ox - 2 ? lit : post);
    for (let x = gx - 22; x <= gx + 22; x++) { const bend = Math.round(((x - gx) / 22) ** 2 * 3); for (let t = 0; t < 4; t++) cv.set(x, gy - 44 - bend + t, t === 0 ? lit : lint); }
    for (let x = gx - 17; x <= gx + 17; x++) cv.set(x, gy - 34, lint);
    cv.block(gx - 24, gy - 50, gx + 24, gy);
    const glows = [];
    const lr = s('lanterns');
    for (let i = 0; i < 2; i++) {
      const lx = lr.int(20, W - 20), ly = Math.round(top[lx]);
      if (cv.liquid[(ly - 1) * W + lx]) continue;
      for (let y = ly - 12; y < ly; y++) for (let x = lx - 2; x <= lx + 2; x++) cv.set(x, y, pack(y < ly - 8 ? [0.42, 0.42, 0.48] : y < ly - 5 ? [1, 0.8, 0.45] : [0.34, 0.34, 0.4]));
      glow(cv, lx, ly - 7, 26, [1, 0.75, 0.4], 0.5);
      glows.push([lx, ly - 7]);
    }
    const br = s('stones');
    for (let i = 0; i < 3; i++) cv.place(boulder(br, br.int(5, 9), br.int(3, 5), { moss: 'moss' }), pal, br.int(10, W - 10), { sink: 2, foot: [8, 2] });
    vines(cv, new Float32Array(W).fill(0), { cols: ['#8a6ab8', '#6a4a98', '#4a3a78'], leaf: '#a88ad8', flower: '#e8dcff', seed: s('wis').int(0, 1e9), rate: 0.12, len: [10, 40] });
    terrainTrees(cv, s('trees'), pal, { n: 2, kinds: ['gnarl', 'wisteria'], shapes: ['lean', 'tall'], h: [70, 110], dark: 0.25, gap: 90, look: { mats: ['leaf', 'leaf2'], bloom: { mat: 'bloom', rate: 0.08 }, hang: { mat: 'bloom', rate: 0.3, len: [6, 18] } } });
    // the mist fills the hollow up to the top of the view; the mist a finger can part is drawn over the painting (exotic-fx.js)
    cv.meta.mist = { y0: 0, y1: H, seed: s('mist').int(0, 1e9) };
    cv.meta.glows = glows;
    cv.meta.vignette = 0.5;
    cv.meta.wind = 0.4;
    cv.meta.horizon = 120;
  },
};

export const ghostglass = {
  /** @param {any} cv @param {string} seed */
  compose(cv, seed) {
    const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'ghostglass', p);
    const pal = vary(palette({
      leaf: ['#3ad8c8', { spread: 0.5 }], leaf2: ['#c84ad8', { spread: 0.5 }], bloom: ['#ffffff', { spread: 0.2 }], bark: '#2a3a4a', rock: '#2a4a6a', gem: ['#8ae8ff', { spread: 0.5 }],
    }), s('pal'), 0.8);
    sky(cv, 0, H, ['#0a1a3a', '#0e2a52', '#123a6a', '#164a7e', '#1a5a8a']);
    // light shafts slanting down from the surface
    const lr = s('shafts');
    for (let i = 0; i < 5; i++) {
      const x0 = lr.int(0, W), wdt = lr.int(10, 22);
      cv.wash(pack([0.6, 0.85, 1]), (x, y) => { const c = x0 + y * 0.35; return Math.abs(x - c) < wdt ? 0.1 * (1 - y / H) : 0; }, 0, H);
    }
    // the far reef in blue silhouettes, a sunken ring
    silhouette(cv, { base: 120, amp: 14, freq: 0.03, seed: s('far').int(0, 1e9), fill: '#14305a', rough: 4 });
    ruins(cv, { n: 3, fill: '#1e3e6a', line: '#0e2240', rim: '#2e5a8a', seed: s('ruins').int(0, 1e9), floor: 170 });
    fog(cv, '#2a5a8a', 90, 170, 0.25, s('haze').int(0, 1e9));
    const ts = s('terrain'), top = heights(W, ts.int(0, 1e9), { base: 168, amp: 9, freq: 0.02 });
    fillSolid(cv, top);
    ledges(cv, top, ts, 6, { high: 1 });
    const ss = ts.int(0, 1e9);
    paintTerrain(cv, {
      a: '#1e3046', b: '#26384e', grain: '#4a6a8a', dark: '#0a1420', deep: '#060c14', cave: '#04080e',
      crust: ['#6af0e0', '#3ad8c8', '#2aa0a0', '#1e6a78'], crustH: 4, seed: ss,
      cobble: { stones: ['#2a4060', '#34506e', '#24384e', '#3e5a7a', '#2e4664', '#385470'], mortar: '#04080e', s: 9, moss: ['#2aa0a0', '#6af0e0'] },
      grass: { cols: ['#3ad8c8', '#6af0e0', '#c84ad8'], tall: 4, rate: 0.55, flowers: ['#ff8ad8', '#ffffff', '#8ae8ff'] },
      layers: [{ kind: 'band', cols: ['#2a4060', '#3a5474', '#4a6a8a', '#14202e'], h: [3, 5] }],
    });
    markOpen(cv);
    // the spectral crystals: sprites that phase between solid and clear (exotic-fx.js)
    const cr = s('crystals'), palettes = [[pack([0.2, 0.3, 0.6]), pack([0.55, 0.85, 1]), pack([0.35, 0.6, 0.9]), pack([0.9, 1, 1])], [pack([0.35, 0.15, 0.5]), pack([0.95, 0.6, 1]), pack([0.7, 0.4, 0.9]), pack([1, 0.92, 1])]];
    const glows = [];
    for (let i = 0; i < 5; i++) {
      const x = cr.int(14, W - 14);
      let y = 0;
      while (y < H - 1 && !(cv.open[y * W + x] && cv.solid[(y + 1) * W + x])) y++;
      if (y >= H - 2) continue;
      keep(cv, 'crystals', crystalSprite(cr, cr.int(16, 30), palettes[i & 1]), x, y + 1, { phase: 0, rgb: i & 1 ? [0.95, 0.6, 1] : [0.55, 0.85, 1] });
      glow(cv, x, y - 8, 24, i & 1 ? [0.95, 0.6, 1] : [0.55, 0.85, 1], 0.35);
      glows.push([x, y - 8]);
    }
    glows.push(...glowShrooms(cv, { n: 5, cap: '#8ae8ff', lit: '#e8ffff', stem: '#5a8a9a', rgb: [0.55, 0.9, 1], seed: s('caps').int(0, 1e9) }));
    const br = s('boulders');
    for (let i = 0; i < 2; i++) cv.place(boulder(br, br.int(6, 10), br.int(4, 6)), pal, br.int(10, W - 10), { sink: 2, foot: [8, 2] });
    // coral fans and kelp, swaying in the current
    terrainTrees(cv, s('kelp'), pal, { n: 3, kinds: ['willow', 'sparse', 'willow'], shapes: ['tall', 'lean'], h: [40, 80], dark: 0.2, gap: 70, ledges: true, look: { mats: ['leaf', 'leaf2'], bloom: { mat: 'bloom', rate: 0.03 }, hang: { mat: 'leaf', rate: 0.3, len: [4, 12] } } });
    cv.meta.glows = glows;
    cv.meta.underwater = true;
    cv.meta.vignette = 0.55;
    cv.meta.wind = 0.3;
    cv.meta.horizon = 120;
  },
};

/**
 * Broken standing stones of sandstone (drawn before the ground, so their feet
 * are buried): each lit down its left side, shaded down its right, cracked,
 * its top snapped off at a slant.
 */
function standingStones(cv, rng, n, floor, cols) {
  const W = cv.W, [lit, mid, shade, line] = cols.map((c) => pack(c));
  for (let i = 0; i < n; i++) {
    const cx = Math.round(((i + 0.25 + rng.next() * 0.5) / n) * W), w = rng.int(8, 14), h = rng.int(24, 62), slope = (rng.next() - 0.5) * 1.2;
    const top = floor - h;
    for (let x = -Math.floor(w / 2); x < Math.ceil(w / 2); x++) {
      const t = Math.round(top + slope * x + (((x + i) & 3) === 0 ? 2 : 0));
      for (let y = Math.max(0, t); y < floor + 12; y++) {
        const u = x + Math.floor(w / 2);
        let c = u < 2 ? lit : u >= w - 2 ? shade : mid;
        if (y === t) c = lit;
        if (u === 0 || u === w - 1) c = line;
        // a crack or two running down the face
        if (u === Math.floor(w / 2) + ((y >> 3) & 1) - 1 && (y + i * 7) % 23 < 9) c = line;
        // the courses of the blocks
        if ((y - top) % 13 === 12) c = line;
        cv.set(cx + x, y, c);
      }
    }
  }
}

export const chronoglass = {
  /** @param {any} cv @param {string} seed */
  compose(cv, seed) {
    const W = cv.W, H = cv.H, s = (p) => streamOf(seed, 'chronoglass', p);
    const pal = vary(palette({
      leaf: ['#e8a030', { spread: 0.35 }], leaf2: ['#f4c048', { spread: 0.35 }], bloom: ['#ffe080', { spread: 0.2 }], bark: '#4a3020', rock: '#8a6a4a', gem: ['#b48cff', { spread: 0.5 }],
    }), s('pal'), 0.8);
    // a violet evening sky warming to rose at the horizon
    sky(cv, 0, H, ['#3e2766', '#56307e', '#7e4290', '#b0609c', '#d88498']);
    // the ghost of a clock face in the sky: a thin rose ring, twelve short hour marks, two hands
    const cx = s('clock').int(lx(cv, 110), W - lx(cv, 70)), cy = 54, R = 30, ring = pack([0.86, 0.58, 0.72]);
    for (let a = 0; a < 720; a++) { const r = (a * Math.PI) / 360; cv.set(Math.round(cx + Math.cos(r) * R), Math.round(cy + Math.sin(r) * R), ring); }
    for (let hr = 0; hr < 12; hr++) { const r = (hr * Math.PI) / 6, n = hr % 3 ? 2 : 3; for (let t = 0; t < n; t++) cv.set(Math.round(cx + Math.cos(r) * (R - 3 - t)), Math.round(cy + Math.sin(r) * (R - 3 - t)), ring); }
    for (let t = 0; t < 18; t++) cv.set(cx + Math.round(t * 0.55), cy - Math.round(t * 0.85), ring);
    for (let t = 0; t < 12; t++) cv.set(cx - Math.round(t * 0.95), cy + Math.round(t * 0.25), ring);
    // far hills in rose and plum, a broken tower ghostly in the haze between them
    mountains(cv, { base: 128, amp: 22, n: 6, seed: s('m').int(0, 1e9), fill: '#8a4a7e', lit: '#a05a86', dark: '#743e70' });
    const tw = s('tower'), tx = tw.int(Math.round(W * 0.35), Math.round(W * 0.65)), tcol = pack([0.72, 0.45, 0.55]);
    for (const [ox, ww, hh] of [[0, 16, 96], [16, 10, 62]]) for (let x = 0; x < ww; x++) {
      const notch = (x >> 2) % 2 && ox === 0 ? 4 : 0;
      for (let y = 168 - hh + notch; y < 168; y++) cv.set(tx + ox + x, y, tcol);
    }
    fog(cv, '#e09aa0', 90, 175, 0.4, s('haze').int(0, 1e9));
    standingStones(cv, s('stones'), 3, 168, [[0.84, 0.66, 0.42], [0.72, 0.55, 0.36], [0.56, 0.42, 0.28], [0.36, 0.26, 0.18]]);
    // the ground: thick slabs of golden sandstone over cobbled brown rock
    const ts = s('terrain'), top = heights(W, ts.int(0, 1e9), { base: 168, amp: 10, freq: 0.014 });
    fillSolid(cv, top);
    ledges(cv, top, ts, 6, { high: 1 });
    const ss = ts.int(0, 1e9);
    paintTerrain(cv, {
      a: '#5e4230', b: '#6a4c36', grain: '#8a6a4a', dark: '#2a1a10', deep: '#1a0f08', cave: '#140c06',
      crust: ['#fbe08c', '#f2cc6e', '#e6b858', '#d8a448'], crustH: 4, seed: ss,
      cobble: { stones: ['#6e5038', '#7c5c40', '#5e4430', '#8a6a4a', '#664a34', '#74563c'], mortar: '#24160c', s: 11 },
      grass: { cols: ['#e8b040', '#f4cc58', '#c89030'], tall: 4, rate: 0.22 },
      layers: [{ kind: 'band', cols: ['#e0ac50', '#d29a44', '#f0c868', '#a87430'], h: [4, 6] }],
    });
    markOpen(cv);
    // the deepest rock fades into shadow
    cv.wash(0xff0a0604, (x, y) => (y > H - 26 ? ((y - (H - 26)) / 26) * 0.55 : 0), H - 26, H);
    const sr = s('crystals'), glows = [];
    for (let i = 0; i < 3; i++) {
      const at = cv.place(spire(sr, sr.int(8, 14)), pal, sr.int(16, W - 16), { foot: [4, 2], range: 40 });
      if (at) { glow(cv, at.fx, at.fy - 7, 24, [0.75, 0.55, 1], 0.4); glows.push([at.fx, at.fy - 7]); }
    }
    // a few dry, golden-leaved trees of the oasis edges, rustling in the hot wind
    terrainTrees(cv, s('trees'), pal, { n: 2, kinds: ['gnarl', 'gnarl'], shapes: ['spread', 'lean'], h: [44, 70], gap: 90, ledges: true, look: { mats: ['leaf', 'leaf2'], bloom: { mat: 'bloom', rate: 0.03 } } });
    // sandfalls pouring from the ledges: their grains run on in exotic-fx.js, backward or racing when touched
    const falls = [];
    const fr = s('falls');
    for (let i = 0; i < 2; i++) {
      const x = fr.int(30, W - 30);
      let y = 40;
      while (y < H - 1 && !cv.solid[y * W + x]) y++;
      // from the underside of what is above: find a ledge edge to pour from
      falls.push({ x, y0: Math.max(20, y - fr.int(40, 70)), y1: y });
    }
    cv.meta.sandfalls = falls;
    cv.meta.glows = glows;
    cv.meta.vignette = 0.35;
    cv.meta.wind = 0.9;
    cv.meta.horizon = 122;
  },
};
