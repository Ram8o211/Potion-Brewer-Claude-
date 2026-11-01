// The last pass on a wild region's painting, so it reads at a glance as
// the farm's enclosures do (pens.js): what stands in the scene is told
// apart from what is behind it, and the ground is never one even texture.
//
//   - the ground: broad strata of lighter and darker rock stepped in by an
//     ordered dither, boulders bedded in it (lit on top, shadowed under),
//     roots reaching down from the grass in the green regions, and grit;
//   - its edges: where a pillar, a ledge or a bank meets the air it is lit
//     along its left side, and a contact shadow falls on the backdrop
//     beside and under it, so rock never melts into the haze behind;
//   - the things in the scene (trees, carts, crates, stumps, wheels…) are
//     inked round and kept vivid;
//   - the backdrop (sky, far hills and trees, mist) is set back: a little
//     less colour and contrast, a veil of its own ambient tone.
//
// A pure function of the composed canvas and its masks; applied alike to
// the painting and to its copy without the swaying foliage (paint.js).

import { hash2, fbm2, noise2 } from '../noise.js';
import { mixPacked } from '../color.js';
import { Rng } from '../../core/rng.js';

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const bayer = (x, y) => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
const luma = (c) => 0.3 * (c & 255) + 0.59 * ((c >>> 8) & 255) + 0.11 * ((c >>> 16) & 255);
const clampI = (v, a, b) => (v < a ? a : v > b ? b : v);
function saturate(c, k) {
  const r = c & 255, g = (c >>> 8) & 255, b = (c >>> 16) & 255, l = luma(c);
  const f = (v) => clampI(Math.round(l + (v - l) * k), 0, 255);
  return ((c & 0xff000000) | (f(b) << 16) | (f(g) << 8) | f(r)) >>> 0;
}
const INK = 0xff100810, WHITE = 0xffffffff, BLACK = 0xff000000, TOPSOIL = 0xff142030, BOULDER = 0xff8c949c;

/** Regions whose ground is held together by roots. */
const ROOTED = new Set(['forest', 'meadow', 'river', 'netherwood', 'moonfen']);

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
        if (d < 3) continue; // the crust and grass on top stay as painted
        // strata: broad bands of lighter and darker rock, stepped in by a dither
        // layers lying roughly level, each its own shade, their boundaries wavering and stepped by a dither
        const lay = (y + noise2(x * 0.025, 0, seed + 3) * 10) / 11, f = lay - Math.floor(lay), which = hash2(Math.floor(lay), 7, seed);
        let q = c;
        const edge = f < 0.14 && bayer(x, y) < 0.75;
        if (edge) q = mixPacked(q, BLACK, 0.3);
        else if (which > 0.66) q = mixPacked(q, WHITE, 0.09);
        else if (which < 0.33) q = mixPacked(q, BLACK, 0.14);
        // under the crust, a band of darker topsoil
        if (d < 9 && bayer(x, y) < (9 - d) / 8) q = mixPacked(q, TOPSOIL, 0.18);
        px[k] = q;
        continue;
      }
      if (thing(k)) { px[k] = saturate(c, 1.12); continue; }
      if (cv.liquid[k] || cv.cave[k]) continue;
      // the backdrop: less colour, flatter tones, a veil of its ambient
      let q = saturate(c, 0.82);
      const t = (mean - luma(q)) * 0.1;
      q = mixPacked(q, t > 0 ? WHITE : BLACK, Math.min(0.25, Math.abs(t) / 255));
      px[k] = mixPacked(q, amb, 0.08);
    }
  }

  // ---- bedded boulders, roots and grit (painted into both layers)
  const rng = new Rng(seed ^ 0x51ab);
  const put = (x, y, c) => { if (x < 0 || y < 0 || x >= W || y >= H) return; const k = y * W + x; if (!ground(k) || depth[k] < 3) return; for (const px of layers) px[k] = c; };
  const shade = (x, y, t, toward = BLACK) => { if (x < 0 || y < 0 || x >= W || y >= H) return; const k = y * W + x; if (!ground(k) || depth[k] < 3) return; for (const px of layers) px[k] = mixPacked(px[k], toward, t); };
  for (let i = 0; i < N / 900; i++) {
    const cx = rng.int(4, W - 5), cy = rng.int(4, H - 3), k0 = cy * W + cx;
    if (!ground(k0) || depth[k0] < 8) continue;
    const rx = rng.range(2.5, 6), ry = rx * rng.range(0.5, 0.75);
    for (let y = Math.floor(cy - ry - 1); y <= cy + ry + 1; y++) for (let x = Math.floor(cx - rx - 1); x <= cx + rx + 1; x++) {
      const u = (x + 0.5 - cx) / rx, v = (y + 0.5 - cy) / ry, e = u * u + v * v;
      if (e > 1.3) continue;
      if (e > 1) { shade(x, y, v > 0 ? 0.75 : 0.5, INK); continue; }
      // a boulder of paler rock, lit on its upper left, its underside in shade
      const lit = -(u * 0.5 + v * 0.9);
      shade(x, y, 0.3, BOULDER);
      shade(x, y, lit > 0.45 ? 0.35 : lit > 0 ? 0.15 : lit < -0.45 ? 0.35 : 0.08, lit > 0 ? WHITE : BLACK);
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
  for (let i = 0; i < N / 400; i++) {
    const x = rng.int(0, W - 1), y = rng.int(0, H - 1);
    shade(x, y, 0.2, rng.next() < 0.5 ? WHITE : BLACK);
  }

  // ---- edges: lit rims on the ground's left faces, contact shadows on the backdrop beside and under it, ink round things
  const isG = new Uint8Array(N), isT = new Uint8Array(N);
  for (let k = 0; k < N; k++) { isG[k] = ground(k) ? 1 : 0; isT[k] = thing(k) ? 1 : 0; }
  for (const px of layers) {
    const src = px.slice();
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const k = y * W + x;
      if (isG[k]) {
        // a face toward the light, on the left side of a pillar or a ledge
        if (x > 0 && !isG[k - 1] && !isT[k - 1] && !cv.liquid[k - 1] && depth[k] >= 2) px[k] = mixPacked(src[k], WHITE, 0.16);
        continue;
      }
      if (cv.liquid[k] || !(src[k] >>> 24)) continue;
      if (isT[k]) continue;
      // the backdrop beside or under a piece of ground (not above it, where the grass is)
      const gR = x < W - 1 && isG[k + 1], gL = x > 0 && isG[k - 1], gU = y > 0 && isG[k - W];
      const tN = (x > 0 && isT[k - 1]) || (x < W - 1 && isT[k + 1]) || (y > 0 && isT[k - W]) || (y < H - 1 && isT[k + W]);
      if (tN) { const deep = (x > 0 && isT[k - 1]) || (y > 0 && isT[k - W]); px[k] = mixPacked(src[k], INK, deep ? 0.6 : 0.4); }
      else if (gU) px[k] = mixPacked(src[k], INK, 0.5);
      else if (gL) px[k] = mixPacked(src[k], INK, 0.42);
      else if (gR) px[k] = mixPacked(src[k], INK, 0.3);
    }
  }

  // the swaying foliage keeps its own colours: each leaf takes what its pixel became (one hidden under another, a thing's richer colour)
  if (cv.sw) {
    const sw = cv.sw, px = cv.pix.px;
    for (let i = 0; i < sw.k.length; i++) sw.c[i] = sw.c[i] === orig[sw.k[i]] ? px[sw.k[i]] : saturate(sw.c[i], 1.12);
  }
}
