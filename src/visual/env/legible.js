// The last pass on a wild region's painting, so it reads at a glance as
// the farm's enclosures do (pens.js): what stands in the scene is told
// apart from what is behind it, and the ground is never one even texture.
//
//   - the ground: level bands of slightly lighter and darker rock, boulders
//     bedded in it (lit on top, shadowed under), and roots reaching down
//     from the grass in the green regions;
//   - its edges: where a pillar, a ledge or a bank meets the air it is lit
//     along its left side, and a contact shadow falls on the backdrop
//     beside and under it, so rock never melts into the haze behind;
//   - the props in the scene (carts, crates, stumps, wheels, torches…) get
//     a soft line round them and keep their colour; trees are left exactly
//     as painted (an outline round leaves only dirties them);
//   - the trees' crowns are lifted clear of their backdrop: lighter (and a
//     touch richer) against a dark cavern or night wood, darker against a
//     pale sky or haze, by as much as each crown needs and no more, keeping
//     its own light and shade, with a lit rim along its upper edge;
//   - the backdrop (sky, far hills and trees, mist) loses a touch of colour.
//
// A pure function of the composed canvas and its masks; applied alike to
// the painting and to its copy without the swaying foliage (paint.js).

import { hash2, fbm2, noise2 } from '../noise.js';
import { mixPacked } from '../color.js';
import { Rng } from '../../core/rng.js';

const luma = (c) => 0.3 * (c & 255) + 0.59 * ((c >>> 8) & 255) + 0.11 * ((c >>> 16) & 255);
const clampI = (v, a, b) => (v < a ? a : v > b ? b : v);
function saturate(c, k) {
  const r = c & 255, g = (c >>> 8) & 255, b = (c >>> 16) & 255, l = luma(c);
  const f = (v) => clampI(Math.round(l + (v - l) * k), 0, 255);
  return ((c & 0xff000000) | (f(b) << 16) | (f(g) << 8) | f(r)) >>> 0;
}
const INK = 0xff100810, WHITE = 0xffffffff, BLACK = 0xff000000, BOULDER = 0xff8c949c;

/** Regions whose ground is held together by roots. */
const ROOTED = new Set(['forest', 'meadow', 'river', 'netherwood', 'moonfen', 'skydrift', 'veilmist', 'dreamspire']);

/**
 * Make a composed region read: see the head of the file.
 * @param {any} cv the region's Canvas (paint.js), its composition done, not yet finished
 * @param {string} region
 */
export function legible(cv, region) {
  const W = cv.W, H = cv.H, N = W * H, S = cv.solid, seed = cv.seed;
  const thing = (k) => cv.things[k] === 1 || cv.trees[k] === 1;
  const ground = (k) => S[k] === 1 || cv.rock[k] === 1;
  // depth of each ground pixel below the air above it
  const depth = new Uint16Array(N);
  for (let x = 0; x < W; x++) { let d = 0; for (let y = 0; y < H; y++) { const k = y * W + x; d = ground(k) ? (y && ground(k - W) ? d + 1 : 0) : 0; depth[k] = d; } }
  const layers = cv.sw ? [cv.pix.px, cv.sw.bare] : [cv.pix.px], orig = cv.pix.px.slice();

  // ---- the backdrop's ambient tone
  let r = 0, g = 0, b = 0, n = 0, L = 0;
  for (let k = 0; k < N; k++) {
    if (ground(k) || thing(k) || cv.liquid[k] || cv.cave[k]) continue;
    const c = cv.pix.px[k];
    if (!(c >>> 24)) continue;
    r += c & 255; g += (c >>> 8) & 255; b += (c >>> 16) & 255; L += luma(c); n++;
  }
  const amb = n ? (255 << 24 | Math.round(b / n) << 16 | Math.round(g / n) << 8 | Math.round(r / n)) >>> 0 : BLACK, mean = n ? L / n : 128;

  for (const px of layers) {
    for (let k = 0; k < N; k++) {
      const c = px[k];
      if (!(c >>> 24)) continue;
      const x = k % W, y = (k - x) / W;
      if (ground(k)) {
        const d = depth[k];
        if (d < 3 || (cv.stratum && cv.stratum[k])) continue; // the crust and grass on top, and the strata, stay as painted
        // layers lying roughly level, each a shade lighter or darker — clean bands, no dither
        const lay = Math.floor((y + noise2(x * 0.025, 0, seed + 3) * 10) / 12), which = hash2(lay, 7, seed);
        px[k] = which > 0.7 ? mixPacked(c, WHITE, 0.06) : which < 0.3 ? mixPacked(c, BLACK, 0.09) : c;
        continue;
      }
      if (cv.things[k]) { px[k] = saturate(c, 1.1); continue; }
      if (cv.trees[k] || cv.liquid[k] || cv.cave[k]) continue;
      // the backdrop: a touch less colour, a faint veil of its ambient
      px[k] = mixPacked(c, amb, 0.03);
    }
  }

  // ---- bedded boulders, roots and grit (painted into both layers)
  const rng = new Rng(seed ^ 0x51ab);
  const put = (x, y, c) => { if (x < 0 || y < 0 || x >= W || y >= H) return; const k = y * W + x; if (!ground(k) || depth[k] < 3) return; for (const px of layers) px[k] = c; };
  const shade = (x, y, t, toward = BLACK) => { if (x < 0 || y < 0 || x >= W || y >= H) return; const k = y * W + x; if (!ground(k) || depth[k] < 3) return; for (const px of layers) px[k] = mixPacked(px[k], toward, t); };
  /** @type {number[][]} */
  const bedded = [];
  for (let i = 0; i < N / 520; i++) {
    const cx = rng.int(4, W - 5), cy = rng.int(4, H - 3), k0 = cy * W + cx;
    const rx = rng.range(3, 8.5), ry = rx * rng.range(0.5, 0.7);
    if (!ground(k0) || depth[k0] < ry + 5) continue;
    // (bedded in the rock under the strata, never in the sand or soil)
    if (cv.stratum && (cv.stratum[k0] || cv.stratum[Math.max(0, k0 - Math.ceil(ry + 1) * W)])) continue;
    // a boulder apart from the others
    if (bedded.some(([x, y, r]) => Math.abs(x - cx) < r + rx + 2 && Math.abs(y - cy) < (r + rx) * 0.6 + 2)) continue;
    bedded.push([cx, cy, rx]);
    // one solid stone (the cobbles' mortar does not show through it): its colour the rock's own, paler
    let ar = 0, ag = 0, ab = 0, an = 0;
    for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const c = cv.pix.px[y * W + x]; ar += c & 255; ag += (c >>> 8) & 255; ab += (c >>> 16) & 255; an++;
    }
    const base = mixPacked((255 << 24 | Math.round(ab / an) << 16 | Math.round(ag / an) << 8 | Math.round(ar / an)) >>> 0, BOULDER, 0.42);
    const tones = [mixPacked(base, WHITE, 0.42), mixPacked(base, WHITE, 0.2), base, mixPacked(base, BLACK, 0.22), mixPacked(base, BLACK, 0.42)];
    for (let y = Math.floor(cy - ry - 1); y <= cy + ry + 1; y++) for (let x = Math.floor(cx - rx - 1); x <= cx + rx + 1; x++) {
      const u = (x + 0.5 - cx) / rx, v = (y + 0.5 - cy) / ry, e = u * u + v * v;
      if (e > 1.3) continue;
      if (e > 1) { shade(x, y, v > 0 ? 0.6 : 0.4, INK); continue; }
      // a dome lit on its upper left: a bright cap, a lit shoulder, the body, its underside in shade, a dark rim below
      const lit = -(u * 0.5 + v * 0.9) + (1 - e) * 0.25;
      let t = lit > 0.75 && e < 0.45 ? 0 : lit > 0.4 ? 1 : lit > -0.1 ? 2 : lit > -0.55 ? 3 : 4;
      if (e > 0.75 && v > 0.3) t = 4;
      // a crack or a pit now and then
      if (e < 0.8 && hash2(x, y, seed + 31) < 0.03) t = 4;
      put(x, y, tones[t]);
    }
  }
  if (ROOTED.has(region)) {
    const root = [0xff1a2a3a, 0xff2a4458, 0xff3a5a74];
    for (let x = 0; x < W; x++) {
      if (hash2(x, 3, seed) > 0.05) continue;
      // from the bottom of the crust in this column
      let y = 0;
      while (y < H - 1 && !(ground(y * W + x) && depth[y * W + x] === 3)) y++;
      if (y >= H - 2) continue;
      let px_ = x;
      const len = 5 + Math.floor(hash2(x, 4, seed) * 12);
      for (let j = 0; j < len; j++) {
        put(px_, y + j, root[j < len - 3 ? 2 : 1]); put(px_ + 1, y + j, root[0]);
        if (hash2(x, j, seed + 5) < 0.3) px_ += hash2(x, j, seed + 6) < 0.5 ? -1 : 1;
      }
    }
  }

  // ---- edges: lit rims on the ground's left faces, soft contact shadows on the backdrop beside and under it, a line round props (never round trees)
  const isG = new Uint8Array(N), isT = new Uint8Array(N);
  for (let k = 0; k < N; k++) { isG[k] = ground(k) ? 1 : 0; isT[k] = cv.things[k] ? 1 : 0; }
  for (const px of layers) {
    const src = px.slice();
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const k = y * W + x;
      if (isG[k]) {
        // a face toward the light, on the left side of a pillar or a ledge
        if (x > 0 && !isG[k - 1] && !isT[k - 1] && !cv.trees[k - 1] && !cv.liquid[k - 1] && depth[k] >= 2) px[k] = mixPacked(src[k], WHITE, 0.1);
        continue;
      }
      if (cv.liquid[k] || !(src[k] >>> 24)) continue;
      if (isT[k] || cv.trees[k]) continue;
      // the backdrop beside or under a piece of ground (not above it, where the grass is)
      const gR = x < W - 1 && isG[k + 1], gL = x > 0 && isG[k - 1], gU = y > 0 && isG[k - W];
      const tN = (x > 0 && isT[k - 1]) || (x < W - 1 && isT[k + 1]) || (y > 0 && isT[k - W]) || (y < H - 1 && isT[k + W]);
      if (tN) { const deep = (x > 0 && isT[k - 1]) || (y > 0 && isT[k - W]); px[k] = mixPacked(src[k], INK, deep ? 0.45 : 0.28); }
      else if (gU) px[k] = mixPacked(src[k], INK, 0.32);
      else if (gL) px[k] = mixPacked(src[k], INK, 0.26);
      else if (gR) px[k] = mixPacked(src[k], INK, 0.18);
    }
  }

  // ---- the trees' crowns stand clear of what is behind them
  crowns(cv, layers);

  // the swaying foliage keeps its own colours: each leaf takes what its pixel became (one hidden under another, a thing's richer colour)
  if (cv.sw) {
    const sw = cv.sw, px = cv.pix.px;
    for (let i = 0; i < sw.k.length; i++) if (sw.c[i] === orig[sw.k[i]]) sw.c[i] = px[sw.k[i]];
  }
}

/**
 * Lift the trees' crowns clear of what lies behind them (see the head of
 * the file). The backdrop's lightness round each crown and the crown's own
 * (both blurred, so a crown keeps its light and shade) set how far its
 * pixels are scaled: up where the backdrop is dark, down where it is pale,
 * until the two are at least CONTRAST apart. The pixels on its upper and
 * left edge, against a dark backdrop, are lit a little more. Only the
 * leaves (the crown's swaying pixels) change; trunks and boughs keep their
 * bark's colour.
 * @param {any} cv @param {Uint32Array[]} layers
 */
function crowns(cv, layers) {
  const W = cv.W, H = cv.H, N = W * H, T = cv.trees, px = cv.pix.px, CONTRAST = 46, R = 9;
  const back = (/** @type {number} */ k) => !T[k] && !cv.solid[k] && !cv.rock[k] && !cv.liquid[k] && !cv.things[k] && !cv.props[k];
  // blurred lightness of the backdrop and of the crowns (box sums over integral images)
  const sum = (/** @type {(k:number) => number} */ val, /** @type {(k:number) => boolean} */ use) => {
    const I = new Float64Array((W + 1) * (H + 1)), C = new Float64Array((W + 1) * (H + 1));
    for (let y = 0; y < H; y++) {
      let rs = 0, rc = 0;
      for (let x = 0; x < W; x++) {
        const k = y * W + x;
        if (use(k)) { rs += val(k); rc++; }
        const q = (y + 1) * (W + 1) + x + 1;
        I[q] = I[q - W - 1] + rs; C[q] = C[q - W - 1] + rc;
      }
    }
    return (/** @type {number} */ x, /** @type {number} */ y) => {
      const x0 = Math.max(0, x - R), y0 = Math.max(0, y - R), x1 = Math.min(W, x + R + 1), y1 = Math.min(H, y + R + 1);
      const a = y0 * (W + 1) + x0, b = y0 * (W + 1) + x1, c = y1 * (W + 1) + x0, d = y1 * (W + 1) + x1;
      const n = C[d] - C[b] - C[c] + C[a];
      return n > 0 ? [(I[d] - I[b] - I[c] + I[a]) / n, n] : [-1, 0];
    };
  };
  let any = false;
  for (let k = 0; k < N; k++) if (T[k]) { any = true; break; }
  if (!any) return;
  const bg = sum((k) => luma(px[k]), back), tr = sum((k) => luma(px[k]), (k) => T[k] === 1);
  /** the pixels where a swaying leaf shows (not where something painted later covers it) */
  const home = new Uint8Array(N);
  if (cv.sw) { const sw = cv.sw; for (let i = 0; i < sw.k.length; i++) if (sw.c[i] === px[sw.k[i]]) home[sw.k[i]] = 1; }
  const scale = (/** @type {number} */ c, /** @type {number} */ f, /** @type {number} */ add) => {
    const r = c & 255, g = (c >>> 8) & 255, b = (c >>> 16) & 255;
    const m = (/** @type {number} */ v) => clampI(Math.round(v * f + add), 0, 255);
    return ((c & 0xff000000) | (m(b) << 16) | (m(g) << 8) | m(r)) >>> 0;
  };
  const lit = (/** @type {number} */ x, /** @type {number} */ y) => (x > 0 && back(y * W + x - 1)) || (y > 0 && back((y - 1) * W + x));
  // (the leaves only — the swaying pixels of a crown — never its trunk and boughs; and only in the
  // painting itself: in the one without the swaying foliage, what shows there is the backdrop)
  {
    const L = layers[0];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const k = y * W + x;
      if (!T[k] || !home[k]) continue;
      const [b, nb] = bg(x, y);
      if (nb < 6) continue;
      const [t] = tr(x, y), c = L[k];
      let f = 1, add = 0;
      if (b < 110) {
        // a dark backdrop: the crown lighter, up to the contrast it needs
        if (t < b + CONTRAST) { f = Math.min(2.3, (b + CONTRAST) / Math.max(12, t)); add = Math.max(0, (b + CONTRAST - t * f)) * 0.6; }
      } else if (t > b - CONTRAST) f = Math.max(0.88, (b - CONTRAST) / Math.max(1, t));
      // its edge toward the light, against the backdrop, lit a little more
      if (lit(x, y) && b < 110) { f *= 1.12; add += 6; }
      if (f !== 1 || add) L[k] = saturate(scale(c, f, add), f > 1 ? 1.05 : 1);
    }
  }
}
