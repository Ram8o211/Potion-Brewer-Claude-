// Builds the ingredient texture atlases (assets/atlases/) from the authored
// ingredient sheet (art/ingredients/source) and the species catalog.
//
//   node scripts/build-atlases.mjs
//
// Pipeline, per species (all deterministic, seeded by the species key):
//   1. source   — the species' ordinary and Arcane cells, sliced from the
//                 sheet by scripts/slice-ingredient-sheet.py (cells.json).
//   2. clean    — hard alpha (no soft or anti-aliased edges), stray specks
//                 removed, colours snapped to a per-sprite palette of
//                 deliberate clusters, a one-pixel ink outline.
//   3. arcane   — the Arcane sprite keeps the species' silhouette and adds
//                 baked magic that reads at icon size: an emissive violet
//                 rim lit from the upper left, luminous rune veins through
//                 its body and a few four-point sparkles.
//   4. seed     — a species-specific propagation form (seed, winged seed,
//                 pip, bulb, spore sac, crystal chip, spat shell or polyp)
//                 in the species' own colours.
//   5. stages   — seed in its bed, sprout (its family's), young and
//                 developing (the mature sprite resampled to 45 % and 70 %
//                 on its own palette), then the mature sprite itself.
//   6. pack     — several atlases by category, two pixels of transparent
//                 padding round every frame, with JSON metadata and one
//                 manifest naming every asset of every species.

import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { readPNG, writePNG } from './lib/png-codec.mjs';
import { SPECIES_DATA } from '../src/materials/species-data.js';
import { Rng } from '../src/core/rng.js';

const ROOT = new URL('../', import.meta.url);
const SRC = new URL('art/ingredients/source/', ROOT);
const OUT = new URL('assets/atlases/', ROOT);
const SPRITES = new URL('art/ingredients/sprites/', ROOT);
mkdirSync(OUT, { recursive: true });
mkdirSync(SPRITES, { recursive: true });

export const ATLAS_VERSION = 1;
const PAD = 2;
const INK = 0xff1a1016;

// Biome order on the sheet (row-major blocks of three)
const SHEET_BIOMES = ['forest', 'meadow', 'river', 'quarry', 'netherwood', 'crags', 'moonfen', 'skyshard', 'morphgrove', 'veilhollow', 'ghostglass', 'chronoglass'];
// cells whose Arcane row on the sheet shows another object: the Arcane sprite is made from the ordinary one
const ARCANE_FROM_ORDINARY = new Set(['ghostglass:2', 'ghostglass:3', 'chronoglass:3']);

// ---------------------------------------------------------------- pixel helpers

const R = (c) => c & 255, G = (c) => (c >>> 8) & 255, B = (c) => (c >>> 16) & 255, A = (c) => c >>> 24;
const rgb = (r, g, b, a = 255) => ((a << 24) | (Math.max(0, Math.min(255, Math.round(b))) << 16) | (Math.max(0, Math.min(255, Math.round(g))) << 8) | Math.max(0, Math.min(255, Math.round(r)))) >>> 0;
const hex = (h) => rgb(parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16));
const lum = (c) => (0.2126 * R(c) + 0.7152 * G(c) + 0.0722 * B(c)) / 255;
const mix = (a, b, t) => rgb(R(a) + (R(b) - R(a)) * t, G(a) + (G(b) - G(a)) * t, B(a) + (B(b) - B(a)) * t);
const sat = (c) => { const mx = Math.max(R(c), G(c), B(c)), mn = Math.min(R(c), G(c), B(c)); return mx ? (mx - mn) / mx : 0; };
const dist2 = (a, b) => (R(a) - R(b)) ** 2 * 0.3 + (G(a) - G(b)) ** 2 * 0.59 + (B(a) - B(b)) ** 2 * 0.11;

const img = (w, h) => ({ w, h, px: new Uint32Array(w * h) });
const at = (im, x, y) => (x < 0 || y < 0 || x >= im.w || y >= im.h ? 0 : im.px[y * im.w + x]);
const put = (im, x, y, c) => { if (x >= 0 && y >= 0 && x < im.w && y < im.h) im.px[y * im.w + x] = c; };
const opaque = (im, x, y) => A(at(im, x, y)) > 0;

function crop(im, x0, y0, w, h) {
  const o = img(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) o.px[y * w + x] = at(im, x + x0, y + y0);
  return o;
}
function pad(im, l, t, r, b) {
  const o = img(im.w + l + r, im.h + t + b);
  for (let y = 0; y < im.h; y++) for (let x = 0; x < im.w; x++) o.px[(y + t) * o.w + x + l] = im.px[y * im.w + x];
  return o;
}
function trim(im) {
  let x0 = im.w, y0 = im.h, x1 = -1, y1 = -1;
  for (let y = 0; y < im.h; y++) for (let x = 0; x < im.w; x++) if (A(im.px[y * im.w + x])) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  return x1 < 0 ? img(1, 1) : crop(im, x0, y0, x1 - x0 + 1, y1 - y0 + 1);
}

/** Median-cut palette of the opaque colours. */
function medianCut(colors, n) {
  let boxes = [colors];
  while (boxes.length < n) {
    let bi = -1, best = -1, axis = 0;
    boxes.forEach((b, i) => {
      if (b.length < 2) return;
      for (let k = 0; k < 3; k++) {
        const f = [R, G, B][k];
        let mn = 255, mx = 0;
        for (const c of b) { const v = f(c); if (v < mn) mn = v; if (v > mx) mx = v; }
        if (mx - mn > best) { best = mx - mn; bi = i; axis = k; }
      }
    });
    if (bi < 0 || best < 6) break;
    const f = [R, G, B][axis], b = boxes[bi].slice().sort((p, q) => f(p) - f(q)), mid = b.length >> 1;
    boxes.splice(bi, 1, b.slice(0, mid), b.slice(mid));
  }
  return boxes.filter((b) => b.length).map((b) => {
    let r = 0, g = 0, bl = 0;
    for (const c of b) { r += R(c); g += G(c); bl += B(c); }
    return rgb(r / b.length, g / b.length, bl / b.length);
  });
}
const nearest = (pal, c) => { let bi = 0, bd = Infinity; for (let i = 0; i < pal.length; i++) { const d = dist2(pal[i], c); if (d < bd) { bd = d; bi = i; } } return pal[bi]; };

/** Components (8-connected) of the opaque pixels, largest first. */
function components(im) {
  const lab = new Int32Array(im.w * im.h), comps = [];
  for (let s = 0; s < lab.length; s++) {
    if (lab[s] || !A(im.px[s])) continue;
    const id = comps.length + 1, stack = [s], list = [];
    lab[s] = id;
    while (stack.length) {
      const k = stack.pop(), x = k % im.w, y = (k / im.w) | 0;
      list.push(k);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= im.w || ny >= im.h) continue;
        const j = ny * im.w + nx;
        if (!lab[j] && A(im.px[j])) { lab[j] = id; stack.push(j); }
      }
    }
    comps.push(list);
  }
  return comps.sort((a, b) => b.length - a.length);
}

/** The ink a pixel on the silhouette's edge takes: its own colour, very dark. */
const inkOf = (c) => mix(rgb(R(c) * 0.3, G(c) * 0.3, B(c) * 0.3), INK, 0.55);

/** Step 2: a cleaned, crisp sprite from a raw cell. */
function clean(raw, colors = 22) {
  const im = img(raw.w, raw.h);
  // hard alpha: no soft halo, no half-transparent pixels
  for (let k = 0; k < raw.px.length; k++) { const c = raw.px[k]; if (A(c) >= 110) im.px[k] = (c | 0xff000000) >>> 0; }
  // stray specks (from a neighbouring cell or the old soft glow) go
  const comps = components(im);
  const keep = new Set(comps[0] || []);
  for (const c of comps.slice(1)) if (c.length >= 10) for (const k of c) keep.add(k);
  for (let k = 0; k < im.px.length; k++) if (!keep.has(k)) im.px[k] = 0;
  // deliberate clusters: snap to a small palette of the sprite's own colours
  const cols = [];
  for (const c of im.px) if (A(c)) cols.push(c);
  const pal = medianCut(cols, colors);
  for (let k = 0; k < im.px.length; k++) if (A(im.px[k])) im.px[k] = nearest(pal, im.px[k]);
  // lone pixels unlike all four neighbours take the commonest neighbour colour (no noise)
  const src = Uint32Array.from(im.px);
  for (let y = 1; y < im.h - 1; y++) for (let x = 1; x < im.w - 1; x++) {
    const c = src[y * im.w + x];
    if (!A(c)) continue;
    const n = [src[y * im.w + x - 1], src[y * im.w + x + 1], src[(y - 1) * im.w + x], src[(y + 1) * im.w + x]];
    if (n.some((q) => !A(q)) || n.includes(c)) continue;
    const counts = new Map();
    for (const q of n) counts.set(q, (counts.get(q) || 0) + 1);
    const [best, cnt] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    if (cnt >= 3) im.px[y * im.w + x] = best;
  }
  // a crisp one-pixel ink outline round the silhouette
  const out = pad(trim(im), 1, 1, 1, 1);
  const base = Uint32Array.from(out.px);
  for (let y = 0; y < out.h; y++) for (let x = 0; x < out.w; x++) {
    const c = base[y * out.w + x];
    if (!A(c)) continue;
    const edge = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const q = x + dx, r = y + dy; return q < 0 || r < 0 || q >= out.w || r >= out.h || !A(base[r * out.w + q]); });
    if (edge && lum(c) > 0.12) out.px[y * out.w + x] = inkOf(c);
  }
  return trim(out);
}

/** The colours a species is made of: its body, its accent and its green (if any). */
function paletteOf(im) {
  const counts = new Map();
  for (const c of im.px) if (A(c) && lum(c) > 0.18) counts.set(c, (counts.get(c) || 0) + 1);
  const list = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c);
  const body = list[0] ?? hex('#8a7a60');
  const accent = list.slice(0, 8).sort((a, b) => sat(b) * (0.5 + lum(b)) - sat(a) * (0.5 + lum(a)))[0] ?? body;
  const green = list.find((c) => G(c) > R(c) * 1.12 && G(c) > B(c) * 1.1 && sat(c) > 0.3) ?? null;
  const light = list.slice(0, 10).sort((a, b) => lum(b) - lum(a))[0] ?? body;
  return { body, accent, green, light, all: list };
}

// ---------------------------------------------------------------- Arcane

const ARC = { rimDark: hex('#5a2fb8'), rim: hex('#8e5cf0'), rimLit: hex('#c8a4ff'), vein: hex('#6ff2ff'), veinCore: hex('#e6ffff'), spark: hex('#ffffff'), sparkArm: hex('#c9b0ff') };

/**
 * Step 3: the Arcane form of a sprite — the same silhouette with baked magic.
 * @param {{w:number,h:number,px:Uint32Array}} base @param {string} seed @param {{veins?:number, sparks?:number, tint?:number, rune?:boolean}} [o]
 */
function arcanize(base, seed, o = {}) {
  const rng = new Rng('arcane-art:' + seed);
  const im = pad(base, 4, 5, 4, 2);
  const src = Uint32Array.from(im.px);
  const op = (x, y) => x >= 0 && y >= 0 && x < im.w && y < im.h && A(src[y * im.w + x]);
  // the emissive rim: outside the ink, lit from the upper left
  let cx = 0, cy = 0, n = 0;
  for (let y = 0; y < im.h; y++) for (let x = 0; x < im.w; x++) if (op(x, y)) { cx += x; cy += y; n++; }
  cx /= Math.max(1, n); cy /= Math.max(1, n);
  for (let y = 0; y < im.h; y++) for (let x = 0; x < im.w; x++) {
    if (op(x, y)) continue;
    const touch = op(x + 1, y) || op(x - 1, y) || op(x, y + 1) || op(x, y - 1);
    if (!touch) continue;
    const lit = (x - cx) + (y - cy) < 0;
    im.px[y * im.w + x] = lit ? ARC.rimLit : ((x + y) & 1 ? ARC.rim : ARC.rimDark);
  }
  // spectral colouring: the body cools toward the arcane hues, cyan above and violet below
  for (let y = 0; y < im.h; y++) for (let x = 0; x < im.w; x++) {
    const c = src[y * im.w + x];
    if (!A(c) || lum(c) < 0.1) continue;
    const t = n ? Math.min(1, Math.max(0, (y - (cy - 8)) / 16)) : 0.5;
    im.px[y * im.w + x] = mix(c, mix(ARC.vein, ARC.rim, t), o.tint ?? 0.16);
  }
  // a glowing rune at the heart of the body (the deepest point inside the silhouette)
  const depth = new Int16Array(im.w * im.h).fill(-1), queue = [];
  for (let y = 0; y < im.h; y++) for (let x = 0; x < im.w; x++) if (!op(x, y)) { depth[y * im.w + x] = 0; queue.push(y * im.w + x); }
  for (let q = 0; q < queue.length; q++) {
    const k = queue[q], x = k % im.w, y = (k / im.w) | 0;
    for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + a, ny = y + b;
      if (nx < 0 || ny < 0 || nx >= im.w || ny >= im.h) continue;
      const j = ny * im.w + nx;
      if (depth[j] < 0) { depth[j] = depth[k] + 1; queue.push(j); }
    }
  }
  let rx = -1, ry = -1, rd = 0;
  for (let y = 0; y < im.h; y++) for (let x = 0; x < im.w; x++) {
    const d = depth[y * im.w + x] - Math.hypot(x - cx, y - cy) * 0.08;
    if (d > rd) { rd = d; rx = x; ry = y; }
  }
  if (o.rune !== false && rx >= 0 && depth[ry * im.w + rx] >= 2) {
    const big = depth[ry * im.w + rx] >= 4;
    const RUNES = big
      ? [['..#..', '.#o#.', '#o*o#', '.#o#.', '..#..'], ['#...#', '.#o#.', '..*..', '.#o#.', '#...#'], ['.###.', '#.o.#', '#o*o#', '#.o.#', '.###.'], ['..#..', '..o..', '#o*o#', '..o..', '..#..']]
      : [['.#.', '#*#', '.#.'], ['#.#', '.*.', '#.#']];
    const g = RUNES[rng.int(0, RUNES.length - 1)], h = g.length >> 1;
    for (let j = 0; j < g.length; j++) for (let i = 0; i < g[j].length; i++) {
      const ch = g[j][i];
      if (ch === '.') continue;
      const x = rx - h + i, y = ry - h + j;
      if (!op(x, y)) continue;
      im.px[y * im.w + x] = ch === '*' ? ARC.veinCore : ch === 'o' ? ARC.vein : ARC.rimDark;
    }
  }
  // rune veins: short luminous paths through the body (never over the ink)
  const interior = [];
  for (let y = 1; y < im.h - 1; y++) for (let x = 1; x < im.w - 1; x++) {
    if (!op(x, y) || !op(x + 1, y) || !op(x - 1, y) || !op(x, y + 1) || !op(x, y - 1)) continue;
    if (lum(src[y * im.w + x]) < 0.1) continue;
    interior.push([x, y]);
  }
  const veins = o.veins ?? Math.max(1, Math.min(2, Math.round(interior.length / 220)));
  for (let v = 0; v < veins && interior.length; v++) {
    let [x, y] = interior[rng.int(0, interior.length - 1)];
    let dx = rng.chance(0.5) ? 1 : -1, dy = rng.chance(0.5) ? 1 : 0;
    const len = rng.int(5, 9);
    for (let s = 0; s < len; s++) {
      if (!op(x, y) || !interior.length) break;
      im.px[y * im.w + x] = s === 0 || s === len >> 1 ? ARC.veinCore : ARC.vein;
      if (rng.chance(0.35)) { [dx, dy] = rng.chance(0.5) ? [dy, dx] : [-dy, -dx]; if (!dx && !dy) dx = 1; }
      const nx = x + dx, ny = y + dy;
      if (!op(nx, ny) || !op(nx + 1, ny) || !op(nx - 1, ny)) { dx = -dx; dy = -dy; if (!op(x + dx, y + dy)) break; }
      x += dx; y += dy;
    }
  }
  // four-point sparkles in the clear space round it
  const free = (x, y) => x >= 2 && y >= 2 && x < im.w - 2 && y < im.h - 2 && [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].every(([a, b]) => !A(im.px[(y + b) * im.w + x + a]));
  const spots = [[2, 2], [im.w - 3, 2], [2, Math.round(im.h * 0.45)], [im.w - 3, Math.round(im.h * 0.4)], [Math.round(im.w * 0.5), 2]];
  let placed = 0;
  const want = o.sparks ?? 3;
  for (const [sx, sy] of rng.shuffle(spots)) {
    if (placed >= want) break;
    let done = false;
    for (let r = 0; r < 4 && !done; r++) for (let dy = -r; dy <= r && !done; dy++) for (let dx = -r; dx <= r && !done; dx++) {
      const x = sx + dx, y = sy + dy;
      if (!free(x, y)) continue;
      put(im, x, y, ARC.spark);
      for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) put(im, x + a, y + b, ARC.sparkArm);
      if (placed === 0) for (const [a, b] of [[2, 0], [-2, 0], [0, 2], [0, -2]]) if (!A(at(im, x + a, y + b))) put(im, x + a, y + b, ARC.rim);
      done = true; placed++;
    }
  }
  return trim(im);
}

// ---------------------------------------------------------------- seeds

const SEED_BROWN = hex('#8a5a32'), SEED_DARK = hex('#4a2c18'), SEED_LIGHT = hex('#d8b080');

/** Draw a filled ellipse. */
function ellipse(im, cx, cy, rx, ry, colAt) {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
    const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
    if (d <= 1.02) put(im, x, y, colAt(x, y, d));
  }
}
/** Ink outline round everything opaque, then trimmed. */
function inkOutline(im) {
  const o = pad(im, 1, 1, 1, 1), base = Uint32Array.from(o.px);
  for (let y = 0; y < o.h; y++) for (let x = 0; x < o.w; x++) {
    if (A(base[y * o.w + x])) continue;
    if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => { const q = x + a, r = y + b; return q >= 0 && r >= 0 && q < o.w && r < o.h && A(base[r * o.w + q]); })) o.px[y * o.w + x] = INK;
  }
  return trim(o);
}
/** Shade a body colour lit from the upper left. */
const shade = (c, x, y, cx, cy) => { const k = (x - cx) + (y - cy); return k < -1.5 ? mix(c, hex('#ffffff'), 0.35) : k > 1.5 ? mix(c, hex('#000000'), 0.35) : c; };

/** Step 4: the seed (or bulb, spore sac, chip, spat…) of a species. */
function seedOf(sp, pal) {
  const im = img(14, 14);
  const body = pal.body, accent = pal.accent;
  const kind = {
    leaf: 'seed', herb: 'seed', grass: 'grain', flower: 'seed', fruit: 'pip', berry: 'pip', vine: 'winged', seedpod: 'winged',
    root: 'bulb', bark: 'bulb', moss: 'spore', fungus: 'spore', crystal: 'chip', stone: 'chip', relic: 'chip', shell: 'spat', coral: 'polyp',
  }[sp.morph];
  if (kind === 'seed') {
    const c = mix(body, SEED_BROWN, 0.45);
    ellipse(im, 7, 7, 3.2, 4.6, (x, y) => (x === 7 && y > 3 && y < 11 ? mix(accent, SEED_LIGHT, 0.3) : shade(c, x, y, 7, 7)));
  } else if (kind === 'grain') {
    const c = mix(body, hex('#c8a050'), 0.4);
    for (let i = 0; i < 3; i++) ellipse(im, 4 + i * 3, 9 - (i % 2) * 2, 1.6, 3, (x, y) => shade(c, x, y, 4 + i * 3, 8));
  } else if (kind === 'pip') {
    const c = mix(accent, SEED_BROWN, 0.25);
    ellipse(im, 5, 8, 2.6, 3.2, (x, y) => shade(c, x, y, 5, 8));
    ellipse(im, 9.5, 7, 2.4, 3, (x, y) => shade(mix(c, body, 0.3), x, y, 9.5, 7));
  } else if (kind === 'winged') {
    const wing = mix(pal.light, hex('#f0e0b0'), 0.4);
    ellipse(im, 4.5, 5, 3.5, 1.8, (x, y) => shade(wing, x, y, 4.5, 5));
    ellipse(im, 9.5, 5, 3.5, 1.8, (x, y) => shade(wing, x, y, 9.5, 5));
    ellipse(im, 7, 8.5, 2.2, 3, (x, y) => shade(mix(body, SEED_BROWN, 0.4), x, y, 7, 8.5));
  } else if (kind === 'bulb') {
    const c = mix(body, hex('#c09060'), 0.35);
    ellipse(im, 7, 9, 4, 3.6, (x, y) => shade(c, x, y, 7, 9));
    const g = pal.green ?? hex('#6aa040');
    for (let y = 2; y < 6; y++) put(im, 7, y, g);
    put(im, 6, 3, g); put(im, 8, 2, g);
    for (let x = 5; x <= 9; x += 2) put(im, x, 13, SEED_DARK);
  } else if (kind === 'spore') {
    const c = mix(body, hex('#e8dcc8'), 0.25);
    ellipse(im, 7, 7.5, 4.6, 4.2, (x, y) => shade(c, x, y, 7, 7.5));
    for (const [x, y] of [[5, 6], [8, 5], [9, 8], [6, 9]]) put(im, x, y, accent);
  } else if (kind === 'chip') {
    const c = body, lt = mix(pal.light, hex('#ffffff'), 0.3), dk = mix(body, hex('#000000'), 0.35);
    const pts = [[7, 1], [11, 6], [9, 12], [4, 12], [3, 6]];
    for (let y = 0; y < 14; y++) for (let x = 0; x < 14; x++) {
      let inside = false;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const [xi, yi] = pts[i], [xj, yj] = pts[j];
        if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
      }
      if (inside) put(im, x, y, x < 7 && y < 7 ? lt : x > 8 || y > 9 ? dk : c);
    }
    put(im, 6, 3, hex('#ffffff'));
  } else if (kind === 'spat') {
    const c = mix(body, hex('#f0e8e0'), 0.2);
    ellipse(im, 7, 8, 5, 3.6, (x, y) => ((x + y) % 3 === 0 ? mix(c, hex('#000000'), 0.18) : shade(c, x, y, 7, 8)));
    put(im, 7, 7, mix(accent, hex('#ffffff'), 0.4));
  } else {
    // polyp: a tiny branching nub
    const c = body;
    for (let y = 6; y < 13; y++) put(im, 7, y, c);
    for (const [x, y] of [[5, 4], [6, 5], [9, 3], [8, 4], [8, 5], [5, 3]]) put(im, x, y, mix(c, pal.light, 0.4));
    ellipse(im, 7, 12, 3, 1.4, () => mix(c, hex('#000000'), 0.25));
  }
  return { im: inkOutline(im), kind };
}

// ---------------------------------------------------------------- growth stages

/** The mature sprite resampled to a fraction of its size on its own palette (no blur, no new colours). */
function resample(sprite, k) {
  const w = Math.max(4, Math.round(sprite.w * k)), h = Math.max(4, Math.round(sprite.h * k));
  const o = img(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const x0 = Math.floor(x / k), x1 = Math.max(x0 + 1, Math.floor((x + 1) / k)), y0 = Math.floor(y / k), y1 = Math.max(y0 + 1, Math.floor((y + 1) / k));
    const counts = new Map();
    let cov = 0, tot = 0;
    for (let j = y0; j < y1; j++) for (let i = x0; i < x1; i++) {
      tot++;
      const c = at(sprite, i, j);
      if (!A(c)) continue;
      cov++;
      if (c === INK || lum(c) < 0.1) continue;
      counts.set(c, (counts.get(c) || 0) + 1);
    }
    if (cov / tot < 0.45) continue;
    const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    o.px[y * w + x] = best ? best[0] : INK;
  }
  const t = trim(o);
  // re-ink its edge
  const base = Uint32Array.from(t.px);
  for (let y = 0; y < t.h; y++) for (let x = 0; x < t.w; x++) {
    const c = base[y * t.w + x];
    if (!A(c)) continue;
    if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => !A(at({ ...t, px: base }, x + a, y + b)))) t.px[y * t.w + x] = inkOf(c);
  }
  return t;
}

const BEDS = {
  soil: [hex('#3a2416'), hex('#5a3a22'), hex('#7a5232')],
  fungal: [hex('#26201c'), hex('#3e342a'), hex('#5a4a3a')],
  crystal: [hex('#3a3a44'), hex('#5a5a66'), hex('#8a8a96')],
  tide: [hex('#7a6a4a'), hex('#b09a6a'), hex('#e0cc96')],
};

/** A small mound of the species' bed, with something on top. */
function mound(bed, top) {
  const cols = BEDS[bed] || BEDS.soil;
  const w = Math.max(14, top ? top.w + 4 : 14), im = img(w, (top ? top.h : 0) + 5);
  const base = im.h - 5;
  for (let y = 0; y < 5; y++) for (let x = 0; x < w; x++) {
    const edge = Math.abs(x - (w - 1) / 2) / ((w - 1) / 2);
    if (y < 2 && edge > 0.75 - y * 0.2) continue;
    put(im, x, base + y, y === 0 ? cols[2] : (x * 7 + y * 3) % 5 === 0 ? cols[2] : y > 2 ? cols[0] : cols[1]);
  }
  if (top) for (let y = 0; y < top.h; y++) for (let x = 0; x < top.w; x++) { const c = top.px[y * top.w + x]; if (A(c)) put(im, x + ((w - top.w) >> 1), y + base - top.h + 2, c); }
  return inkOutline(im);
}

/** The species' sprout: its family's first growth, in its own colours. */
function sprout(sp, pal) {
  const im = img(12, 12);
  const g = pal.green ?? mix(pal.body, hex('#5a9a3a'), 0.6);
  const gd = mix(g, hex('#000000'), 0.3), gl = mix(g, hex('#ffffff'), 0.3);
  if (sp.botanical && sp.morph !== 'fungus' && sp.morph !== 'moss') {
    for (let y = 5; y < 12; y++) put(im, 6, y, gd);
    ellipse(im, 3.5, 5, 2.6, 1.4, (x, y) => (y < 5 ? gl : g));
    ellipse(im, 8.5, 4, 2.6, 1.4, (x, y) => (y < 4 ? gl : g));
    put(im, 6, 3, pal.accent);
  } else if (sp.morph === 'fungus' || sp.morph === 'moss') {
    for (const [x, h] of [[3, 4], [7, 6], [10, 3]]) {
      for (let y = 11; y > 11 - h; y--) put(im, x, y, mix(pal.light, hex('#e8e0d0'), 0.5));
      ellipse(im, x, 11 - h, 1.6, 1, () => pal.body);
    }
  } else if (sp.morph === 'shell' || sp.morph === 'coral') {
    ellipse(im, 6, 9, 3.5, 2.2, (x, y) => shade(pal.body, x, y, 6, 9));
    put(im, 6, 6, pal.light); put(im, 5, 7, pal.light);
  } else {
    const c = pal.body, lt = mix(pal.light, hex('#ffffff'), 0.25);
    for (const [x0, h] of [[3, 5], [6, 8], [9, 4]]) for (let y = 11; y > 11 - h; y--) { put(im, x0, y, y < 11 - h + 2 ? lt : c); if (y > 11 - h + 1) put(im, x0 + 1, y, mix(c, hex('#000000'), 0.3)); }
  }
  return inkOutline(im);
}

// ---------------------------------------------------------------- packing

/** Shelf-pack frames into an atlas of the given width. */
function pack(frames, width) {
  const sorted = frames.slice().sort((a, b) => b.im.h - a.im.h || a.id.localeCompare(b.id));
  let x = PAD, y = PAD, row = 0;
  for (const f of sorted) {
    if (x + f.im.w + PAD > width) { x = PAD; y += row + PAD; row = 0; }
    f.x = x; f.y = y;
    x += f.im.w + PAD;
    row = Math.max(row, f.im.h);
  }
  const height = y + row + PAD;
  // a power-of-two-friendly height (multiple of 16) keeps GPU uploads tidy
  const H = Math.ceil(height / 16) * 16;
  const atlas = img(width, H);
  for (const f of frames) for (let j = 0; j < f.im.h; j++) for (let i = 0; i < f.im.w; i++) atlas.px[(f.y + j) * width + f.x + i] = f.im.px[j * f.im.w + i];
  return atlas;
}

// ---------------------------------------------------------------- build

const cells = JSON.parse(readFileSync(new URL('cells.json', SRC), 'utf8'));
void cells;
const cellPath = (b, row, col) => new URL(`cells/b${String(b).padStart(2, '0')}_r${row}_c${col}.png`, SRC);

const FLORA = new Set(['leaf', 'herb', 'grass', 'flower', 'fruit', 'berry', 'vine', 'seedpod', 'root', 'bark']);
/** @type {Record<string, any[]>} */
const groups = {};
const addFrame = (atlas, f) => (groups[atlas] = groups[atlas] || []).push(f);
const manifestSpecies = {};

for (const sp of SPECIES_DATA) {
  const b = SHEET_BIOMES.indexOf(sp.biome), row = sp.slot < 5 ? 0 : 1, col = sp.slot % 5;
  const ordinary = clean(readPNG(cellPath(b, row, col)));
  const arcSrc = ARCANE_FROM_ORDINARY.has(`${sp.biome}:${sp.slot}`) ? ordinary : clean(readPNG(cellPath(b, row + 2, col)));
  const arcane = arcanize(arcSrc, sp.key);
  const pal = paletteOf(ordinary);
  const seed = seedOf(sp, pal);
  const seedArc = arcanize(seed.im, sp.key + ':seed', { veins: 0, sparks: 1, tint: 0.25 });
  const stages = [mound(sp.bed, seed.im), mound(sp.bed, sprout(sp, pal)), resample(ordinary, 0.45), resample(ordinary, 0.7)];
  const stagesArc = stages.map((s, i) => arcanize(s, `${sp.key}:stage${i}`, { veins: 0, sparks: i >= 2 ? 2 : 1, rune: i >= 2 }));
  const nat = sp.category === 'natural';
  const fam = FLORA.has(sp.morph) ? 'flora' : 'fungi-minerals';
  const meta = { species: sp.key, rarity: sp.rarity, biome: sp.biome, category: sp.category, morph: sp.morph };
  const ids = {
    sprite: `${sp.key}`, arcane: `${sp.key}@arcane`, seed: `${sp.key}@seed`, seedArcane: `${sp.key}@seed-arcane`,
    stages: [0, 1, 2, 3].map((i) => `${sp.key}@stage${i}`), stagesArcane: [0, 1, 2, 3].map((i) => `${sp.key}@stage${i}-arcane`),
  };
  addFrame(`ingredients-${sp.category}-${fam}`, { id: ids.sprite, im: ordinary, ...meta, arcane: false, kind: 'sprite' });
  addFrame(`ingredients-arcane-${sp.category}`, { id: ids.arcane, im: arcane, ...meta, arcane: true, kind: 'sprite' });
  addFrame('seeds', { id: ids.seed, im: seed.im, ...meta, arcane: false, kind: 'seed', form: seed.kind });
  addFrame('seeds', { id: ids.seedArcane, im: seedArc, ...meta, arcane: true, kind: 'seed', form: seed.kind });
  stages.forEach((im, i) => addFrame(`growth-${nat ? 'natural' : 'exotic'}`, { id: ids.stages[i], im, ...meta, arcane: false, kind: 'stage', stage: i }));
  stagesArc.forEach((im, i) => addFrame(`growth-${nat ? 'natural' : 'exotic'}`, { id: ids.stagesArcane[i], im, ...meta, arcane: true, kind: 'stage', stage: i }));
  manifestSpecies[sp.key] = { ...ids, bed: sp.bed, seedForm: seed.kind };
  // the individual source sprites, for editing and review
  writePNG(new URL(`${sp.key}.png`, SPRITES), ordinary);
  writePNG(new URL(`${sp.key}@arcane.png`, SPRITES), arcane);
}

const atlases = [];
for (const [name, frames] of Object.entries(groups).sort()) {
  const width = name.startsWith('growth') ? 512 : name === 'seeds' ? 256 : 512;
  const atlas = pack(frames, width);
  writePNG(new URL(`${name}.png`, OUT), atlas);
  const biomes = [...new Set(frames.map((f) => f.biome))].sort();
  const meta = {
    version: ATLAS_VERSION, atlas: `${name}.png`, width: atlas.w, height: atlas.h, padding: PAD,
    frames: Object.fromEntries(frames.sort((a, b) => a.id.localeCompare(b.id)).map((f) => [f.id, {
      species: f.species, kind: f.kind, rarity: f.rarity, arcane: f.arcane, biome: f.biome, category: f.category, morph: f.morph,
      ...(f.kind === 'stage' ? { stage: f.stage } : {}), ...(f.form ? { form: f.form } : {}),
      x: f.x, y: f.y, w: f.im.w, h: f.im.h, pivot: [Math.floor(f.im.w / 2), f.im.h - 1], native: [f.im.w, f.im.h],
    }])),
  };
  writeFileSync(new URL(`${name}.json`, OUT), JSON.stringify(meta, null, 1) + '\n');
  // which atlases must be ready before play (natural biomes, seeds) and which load lazily (exotic, growth)
  const eager = name === 'seeds' || (name.includes('natural') && !name.startsWith('growth'));
  atlases.push({ id: name, image: `${name}.png`, meta: `${name}.json`, width: atlas.w, height: atlas.h, frames: frames.length, eager, biomes });
  console.log(`${name}: ${atlas.w}×${atlas.h}, ${frames.length} frames`);
}
const manifest = { version: ATLAS_VERSION, generated: 'scripts/build-atlases.mjs', atlases, species: manifestSpecies };
writeFileSync(new URL('manifest.json', OUT), JSON.stringify(manifest, null, 1) + '\n');
console.log(`manifest: ${Object.keys(manifestSpecies).length} species`);
