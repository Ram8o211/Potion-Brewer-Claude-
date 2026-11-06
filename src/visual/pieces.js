// The whole pieces wild ingredients are poured into the cauldron as, drawn
// procedurally from each species' visual identity (render.js pieceFrame):
// four related pieces per species, laid out as cells of one readable pixel
// atlas that the cauldron renderer samples (rendering/fluid.js) and whose
// silhouettes the physics fits its particles to (materials/shapes.js).
//
// The atlas keeps the layout skins have always had — species in key order,
// four PIECE_CELL cells each — so a saved cauldron's particles keep their
// skins. Which world's look a species' cells show is set by registering
// the material being poured (its `vis`); until one is, a species is drawn
// from the identity of its archetype, so tests and tools need no world.

import { WILD_SPECS } from '../materials/wild.js';
import { hslToRgb } from '../core/color.js';
import { identityOf, identityKey, validIdentity } from './identity.js';
import { describe } from './descriptor.js';
import { pieceFrame, pieceArt, PIECE_PX, PIECE_GRID } from './render.js';
import { SPECIES } from '../materials/catalog.js';
import { atlasFrame, spriteAsset, plantFrame, plantAsset } from './atlas.js';
import { Pixels } from './pixels.js';

/** Cell size in the atlas (art pixels) and the silhouette grid of a piece. */
export const PIECE_CELL = PIECE_PX;
export const PIECE_MASK = PIECE_GRID;
/** The least silhouette (mask cells) a piece cut from an atlas sprite is fitted to. */
const MIN_MASK = 48;

/**
 * Species with pieces, in skin order: the legacy archetypes first (in key
 * order, as saved cauldrons have always counted them), then every catalog
 * species in its ordinary and its Arcane form — whose pieces are shards of
 * its atlas sprite, so what is poured is what the stores show.
 */
export const PIECE_KEYS = [...WILD_SPECS.map((s) => s.key).sort(), ...SPECIES.flatMap((s) => ['sp:' + s.key, 'sp:' + s.key + '@arcane'])];

/** The piece key of a material: its catalog species and form, or its legacy archetype. @param {any} def */
export function pieceKeyOf(def) {
  const w = def && def.wild;
  if (!w) return '';
  return w.catalog ? `sp:${w.key}${w.arcane ? '@arcane' : ''}` : w.key;
}

/** A catalog piece key's species and form. @param {string} key */
function catalogPiece(key) {
  if (!key.startsWith('sp:')) return null;
  const arcane = key.endsWith('@arcane');
  return { species: key.slice(3, arcane ? -7 : undefined), arcane };
}

/**
 * The four shards an atlas sprite breaks into: four seed points spread over
 * its opaque pixels (farthest-point sampling, evened out by a few rounds of
 * k-means), each shard the pixels nearest its seed (the largest connected
 * part of it), centred in a PIECE_CELL square. Deterministic.
 * @param {Pixels} src
 */
function atlasShards(src) {
  const pts = [];
  for (let y = 0; y < src.h; y++) for (let x = 0; x < src.w; x++) if (src.px[y * src.w + x] >>> 24) pts.push([x, y]);
  if (!pts.length) pts.push([src.w >> 1, src.h >> 1]);
  const seeds = [pts[0]];
  const dist = pts.map(([x, y]) => (x - pts[0][0]) ** 2 + (y - pts[0][1]) ** 2);
  while (seeds.length < 4) {
    let bi = 0;
    for (let k = 1; k < pts.length; k++) if (dist[k] > dist[bi]) bi = k;
    const [x, y] = pts[bi];
    seeds.push([x, y]);
    for (let k = 0; k < pts.length; k++) dist[k] = Math.min(dist[k], (pts[k][0] - x) ** 2 + (pts[k][1] - y) ** 2);
  }
  const owner = new Int8Array(pts.length);
  for (let it = 0; it < 6; it++) {
    const sx = [0, 0, 0, 0], sy = [0, 0, 0, 0], n = [0, 0, 0, 0];
    pts.forEach(([x, y], k) => {
      let bv = Infinity, bs = 0;
      for (let s = 0; s < 4; s++) { const d = (x - seeds[s][0]) ** 2 + (y - seeds[s][1]) ** 2; if (d < bv) { bv = d; bs = s; } }
      owner[k] = bs; sx[bs] += x; sy[bs] += y; n[bs]++;
    });
    for (let s = 0; s < 4; s++) if (n[s]) seeds[s] = [sx[s] / n[s], sy[s] / n[s]];
  }
  const out = [];
  for (let s = 0; s < 4; s++) {
    const own = new Uint8Array(src.w * src.h);
    pts.forEach(([x, y], k) => { if (owner[k] === s) own[y * src.w + x] = 1; });
    // keep its largest connected part
    const lab = new Int32Array(src.w * src.h);
    let best = 0, bestN = 0, id = 0;
    for (let k = 0; k < own.length; k++) {
      if (!own[k] || lab[k]) continue;
      id++;
      let cnt = 0;
      const stack = [k];
      lab[k] = id;
      while (stack.length) {
        const q = /** @type {number} */ (stack.pop()), x = q % src.w, y = (q / src.w) | 0;
        cnt++;
        for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
          if (nx < 0 || ny < 0 || nx >= src.w || ny >= src.h) continue;
          const j = ny * src.w + nx;
          if (own[j] && !lab[j]) { lab[j] = id; stack.push(j); }
        }
      }
      if (cnt > bestN) { bestN = cnt; best = id; }
    }
    let x0 = src.w, y0 = src.h, x1 = -1, y1 = -1;
    for (let k = 0; k < own.length; k++) if (lab[k] === best) { const x = k % src.w, y = (k / src.w) | 0; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    const cell = new Pixels(PIECE_CELL, PIECE_CELL);
    if (x1 >= 0) {
      const w = x1 - x0 + 1, h = y1 - y0 + 1;
      // a shard larger than its cell is shown at half size (nearest neighbour, crisp)
      const k = w > PIECE_CELL - 2 || h > PIECE_CELL - 2 ? 2 : 1;
      const ox = Math.floor((PIECE_CELL - Math.ceil(w / k)) / 2), oy = Math.floor((PIECE_CELL - Math.ceil(h / k)) / 2);
      for (let y = 0; y < h; y += k) for (let x = 0; x < w; x += k) {
        const q = (y0 + y) * src.w + x0 + x;
        if (lab[q] === best) cell.px[(oy + y / k) * PIECE_CELL + ox + x / k] = src.px[q];
      }
    }
    const kk = PIECE_CELL / PIECE_MASK, mask = new Uint8Array(PIECE_MASK * PIECE_MASK);
    for (let y = 0; y < PIECE_MASK; y++) for (let x = 0; x < PIECE_MASK; x++) {
      let c = 0;
      for (let j = 0; j < kk; j++) for (let i = 0; i < kk; i++) if (cell.px[(y * kk + j) * PIECE_CELL + x * kk + i] >>> 24) c++;
      mask[y * PIECE_MASK + x] = c * 2 >= kk * kk ? 1 : 0;
    }
    // a slender shard (a stem, a petal's tip) is given a little more body to fit its particles in
    for (let grow = 0; grow < 4 && mask.reduce((n, m) => n + m, 0) < MIN_MASK; grow++) {
      const prev = mask.slice();
      for (let y = 0; y < PIECE_MASK; y++) for (let x = 0; x < PIECE_MASK; x++) {
        if (prev[y * PIECE_MASK + x]) continue;
        if ((x > 0 && prev[y * PIECE_MASK + x - 1]) || (x < PIECE_MASK - 1 && prev[y * PIECE_MASK + x + 1]) || (y > 0 && prev[(y - 1) * PIECE_MASK + x]) || (y < PIECE_MASK - 1 && prev[(y + 1) * PIECE_MASK + x])) mask[y * PIECE_MASK + x] = 1;
      }
    }
    out.push({ pix: cell, mask });
  }
  return out;
}

/** A cell drawn at another size (nearest neighbour: the atlas's pixels, crisp). @param {Pixels} cell @param {number} size */
function scaledCell(cell, size) {
  const out = new Pixels(size, size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) out.px[y * size + x] = cell.px[Math.floor((y * cell.h) / size) * cell.w + Math.floor((x * cell.w) / size)];
  return out;
}

/** catalog piece key → its four shards @type {Map<string, {pix:Pixels, mask:Uint8Array}[]>} */
const atlasCells = new Map();
const INDEX = Object.fromEntries(PIECE_KEYS.map((k, i) => [k, i]));

export const PIECE_ART = {
  ready: true,
  width: PIECE_CELL * 4,
  height: PIECE_CELL * PIECE_KEYS.length,
  /** packed ABGR pixels (little-endian RGBA bytes) */
  px: new Uint32Array(PIECE_CELL * 4 * PIECE_CELL * PIECE_KEYS.length),
};

/** key → the identity its cells are drawn from @type {Record<string, any>} */
const shown = {};
/** key → identity cache key of what is painted now @type {Record<string, string>} */
const painted = {};
/** key → its four silhouettes @type {Record<string, Uint8Array[]>} */
const masks = {};
/** @type {((key:string)=>void)[]} */
const listeners = [];

/** Be told when a species' pieces are redrawn (to drop what was fitted to the old ones). @param {(key:string)=>void} fn */
export function onPiecesChanged(fn) { listeners.push(fn); }

/** The identity of a species' archetype (no world). @param {string} key */
export function archetypeIdentity(key) {
  const s = WILD_SPECS.find((x) => x.key === key);
  if (!s) return null;
  const [h, sat, l] = s.hue;
  return identityOf({ id: 'wild-' + key, color: hslToRgb(h, sat, l), effects: s.fx, glow: s.glow || 0, wild: { key, shape: s.shape, region: s.region, rare: !!s.rare } }, '');
}

/**
 * Show this material's look on its species' pieces (the material about to
 * be poured, or one already in the brew). Cheap when nothing changes.
 * @param {any} def
 */
export function registerSpecies(def) {
  // (a catalog species' pieces come from its atlas sprite, the same in every world)
  if (!def || !def.wild || def.wild.catalog || !(def.wild.key in INDEX) || !validIdentity(def.vis)) return;
  const key = def.wild.key;
  if (shown[key] === def.vis) return;
  shown[key] = def.vis;
}

/** Paint a species' cells for the identity it should show (once per change). @param {string} key */
export function ensurePieces(key) {
  if (!(key in INDEX)) return null;
  const cp = catalogPiece(key);
  if (cp) {
    let cells = atlasCells.get(key);
    if (!cells) {
      // (the species' grown plant from its icon art — what the stores and the wilds show)
      const fr = plantAsset(cp.species, 'mature') ? plantFrame(cp.species, 'mature', cp.arcane) : atlasFrame(spriteAsset(cp.species, cp.arcane));
      // (its atlas is still loading: nothing to paint yet)
      if (!fr) return null;
      cells = atlasShards(fr.pix);
      atlasCells.set(key, cells);
      const row = INDEX[key] * PIECE_CELL, W = PIECE_ART.width;
      cells.forEach((c, v) => { for (let y = 0; y < PIECE_CELL; y++) for (let x = 0; x < PIECE_CELL; x++) PIECE_ART.px[(row + y) * W + v * PIECE_CELL + x] = c.pix.px[y * PIECE_CELL + x]; });
      palettes.clear();
    }
    return cells.map((c) => c.mask);
  }
  const id = shown[key] || (shown[key] = archetypeIdentity(key));
  const ik = identityKey(id);
  if (painted[key] === ik) return masks[key];
  const d = describe(id), row = INDEX[key] * PIECE_CELL, W = PIECE_ART.width;
  const out = [];
  for (let v = 0; v < 4; v++) {
    const f = pieceFrame(d, v);
    for (let y = 0; y < PIECE_CELL; y++) for (let x = 0; x < PIECE_CELL; x++) PIECE_ART.px[(row + y) * W + v * PIECE_CELL + x] = f.pix.px[y * PIECE_CELL + x];
    out.push(f.mask);
  }
  masks[key] = out;
  const changed = painted[key] !== undefined;
  painted[key] = ik;
  palettes.clear();
  if (changed) for (const fn of listeners) fn(key);
  return out;
}

/** skin|size → a piece drawn at that size @type {Map<string, {px:Uint32Array, size:number}>} */
const sized = new Map();

/**
 * Piece `skin` drawn at `size` art pixels (square), as the menus' icons
 * and the wilds' plants are drawn: one art pixel to one screen pixel at the
 * size the cauldron shows it (cached; redrawn when the species' look changes).
 * @param {number} skin @param {number} size
 */
export function pieceSprite(skin, size) {
  const c = skinCell(skin);
  if (!c) return null;
  if (catalogPiece(c.key)) {
    if (!ensurePieces(c.key)) return null;
    const k = `${skin}|${size}|atlas`;
    let got = sized.get(k);
    if (!got) {
      if (sized.size > 256) sized.clear();
      const cell = /** @type {any} */ (atlasCells.get(c.key))[c.v];
      got = { px: scaledCell(cell.pix, size).px, size };
      sized.set(k, got);
    }
    return got;
  }
  ensurePieces(c.key);
  const k = `${skin}|${size}|${painted[c.key]}`;
  let got = sized.get(k);
  if (!got) {
    if (sized.size > 256) sized.clear();
    const f = pieceArt(describe(shown[c.key]), c.v, size);
    got = { px: f.px, size: f.w };
    sized.set(k, got);
  }
  return got;
}

/** The silhouette of piece v of a species (PIECE_MASK square, 1 = solid). @param {string} key @param {number} v */
export function pieceMask(key, v) {
  const m = ensurePieces(key);
  return m ? m[v & 3] : null;
}

/** The species and variant of a skin id (1..), and its cell. @param {number} skin */
export function skinCell(skin) {
  const n = skin - 1, key = PIECE_KEYS[n >> 2];
  if (!key) return null;
  return { key, v: n & 3, cx: (n & 3) * PIECE_CELL, cy: (n >> 2) * PIECE_CELL };
}

/** @type {Map<number, Uint32Array>} */
const palettes = new Map();

/** Drop every palette and fitted piece read from the atlas (after its pixels were replaced, e.g. by a test's stand-in). */
export function forgetPieces() {
  palettes.clear();
  for (const fn of listeners) fn('');
}

/**
 * Every opaque pixel of a piece, the palette for grains whose own spot in
 * it falls outside the drawing.
 * @param {number} skin
 */
export function piecePalette(skin) {
  let pal = palettes.get(skin);
  if (pal) return pal;
  const c = skinCell(skin);
  if (!c) return null;
  ensurePieces(c.key);
  const out = [];
  for (let y = c.cy; y < c.cy + PIECE_CELL; y++) for (let x = c.cx; x < c.cx + PIECE_CELL; x++) {
    const p = PIECE_ART.px[y * PIECE_ART.width + x];
    if (p >>> 31) out.push(p);
  }
  pal = Uint32Array.from(out.length ? out : [0xff808080]);
  palettes.set(skin, pal);
  return pal;
}
