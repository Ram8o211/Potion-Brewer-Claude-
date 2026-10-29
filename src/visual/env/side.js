// The side view of a wild region, after Noita: no perspective, only flat
// layers. A banded sky, flat silhouettes of the distance behind, and in
// front a cross-section of the ground itself — solid terrain whose surface
// is the only place things grow, painted as a mottled material (two
// colours in broad blotches, a few stones and grains) under a crust of
// grass, moss or ash, with ledges, overhangs and cave pockets; liquids lie
// in its hollows as flat pools; light sources glow over everything.
//
// The terrain lives in the canvas' `solid` map (1: ground), liquids in its
// `liquid` map; `markOpen` turns the dry surface into the open ground
// plants stand on (the surface row and the row of air above it).

import { fbm1, fbm2, hash2, noise2 } from '../noise.js';
import { mixPacked, pack, hex } from '../color.js';

/** Packed colour from '#rrggbb'. @param {string} h */
export const col = (h) => pack(hex(h));

/**
 * A surface line across the scene: base ± amp of low noise, with plateaus
 * (heights rounded to `step` pixels) so plants find level ground.
 * @param {number} W @param {number} seed @param {{base:number, amp:number, freq?:number, step?:number}} o
 */
export function heights(W, seed, o) {
  const top = new Float32Array(W), step = o.step ?? 2, f = o.freq ?? 0.012;
  for (let x = 0; x < W; x++) top[x] = Math.round((o.base + (fbm1(x * f, seed, 3) - 0.5) * 2 * o.amp) / step) * step;
  return top;
}

/** Lower the surface in a smooth hollow round cx (a basin for a pool, a river bed). */
export function dip(top, cx, hw, depth, flat = 0.4) {
  for (let x = Math.max(0, Math.floor(cx - hw)); x <= Math.min(top.length - 1, Math.ceil(cx + hw)); x++) {
    const u = Math.abs(x - cx) / hw, t = u < flat ? 1 : Math.cos(((u - flat) / (1 - flat)) * Math.PI / 2);
    top[x] = Math.round(Math.max(top[x], top[x] + depth * t * t));
  }
}

/** Raise a flat-topped mound or terrace step. */
export function raise(top, x0, x1, y, slope = 4) {
  for (let x = Math.max(0, Math.floor(x0 - slope * 3)); x <= Math.min(top.length - 1, Math.ceil(x1 + slope * 3)); x++) {
    const out = x < x0 ? (x0 - x) / slope : x > x1 ? (x - x1) / slope : 0;
    top[x] = Math.min(top[x], Math.round(y + out * out));
  }
}

/** Fill the ground below a surface line (kept as the scene's ground line). @param {any} cv @param {Float32Array} top */
export function fillSolid(cv, top) {
  cv.ground = top;
  for (let x = 0; x < cv.W; x++) for (let y = Math.max(0, Math.round(top[x])); y < cv.H; y++) cv.solid[y * cv.W + x] = 1;
}

/**
 * A lumpy blob of ground (v = 1: a floating ledge or outcrop) or of air
 * carved out of it (v = 0: a cave pocket, marked as cave).
 */
export function blob(cv, cx, cy, rx, ry, seed, v = 1, rough = 0.35) {
  for (let y = Math.floor(cy - ry * 1.4); y <= Math.ceil(cy + ry * 1.4); y++) for (let x = Math.floor(cx - rx * 1.4); x <= Math.ceil(cx + rx * 1.4); x++) {
    if (x < 0 || y < 0 || x >= cv.W || y >= cv.H) continue;
    const e = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + (fbm2(x * 0.08, y * 0.12, seed, 2) - 0.5) * rough * 2;
    if (e > 1) continue;
    // a ledge has a level top: its upper third is cut flat
    if (v && y < cy - ry * 0.55) continue;
    const k = y * cv.W + x;
    if (v) cv.solid[k] = 1; else if (cv.solid[k]) { cv.solid[k] = 0; cv.cave[k] = 1; }
  }
}

/**
 * Paint the terrain: crust on top, the mottled material below darkening
 * in steps with depth, stones and grains in it, dark rims where it meets
 * the air at its sides and underneath, and caves as a dark hollow.
 * @param {any} cv
 *   rocks: stones set in the ground (lit on top); strata: horizontal bands
 *   of the second colour instead of blotches; seams: streaks of ore
 * @param {{a:string, b:string, grain:string, dark:string, crust:string[], crustH?:number, deep:string, cave:string, seed:number, blot?:number,
 *   grass?:{cols:string[], tall?:number, flowers?:string[], rate?:number}, rocks?:{cols:string[], n:number, r?:number}, strata?:boolean, seams?:{cols:string[], n:number}}} o
 */
export function paintTerrain(cv, o) {
  const W = cv.W, H = cv.H, S = cv.solid;
  const A = col(o.a), B = col(o.b), G = col(o.grain), D = col(o.dark), deep = col(o.deep), cave = col(o.cave), crust = o.crust.map(col);
  const ch = o.crustH ?? 3, blot = o.blot ?? 0.06;
  for (let x = 0; x < W; x++) {
    let d = 0;
    for (let y = 0; y < H; y++) {
      const k = y * W + x;
      if (!S[k]) {
        d = 0;
        if (cv.cave[k]) {
          // the back wall of a cave: the material in deep shade
          const m = fbm2(x * blot, y * blot * 1.3, o.seed + 5, 2) > 0.5;
          cv.set(x, y, mixPacked(m ? B : A, cave, 0.78));
        }
        continue;
      }
      const airAbove = y === 0 || !S[k - W];
      if (airAbove) d = 0; else d++;
      let c;
      if (d < ch) c = crust[Math.min(crust.length - 1, d)];
      else {
        const m = o.strata ? (Math.floor((y + fbm1(x * 0.02, o.seed, 2) * 14) / 7) % 2 ? 0.6 : 0.4) + (fbm2(x * blot, y * blot, o.seed, 2) - 0.5) * 0.3
          : fbm2(x * blot, y * blot * 1.3, o.seed, 2) + (noise2(x * 0.3, y * 0.3, o.seed + 9) - 0.5) * 0.08;
        c = m > 0.52 ? B : A;
        const g = hash2(x >> 1, y >> 1, o.seed + 3);
        if (g > 0.955) c = G; else if (g < 0.03) c = D;
        // deeper is darker, in flat steps (measured from the main ground, so a ledge's column leaves no streak)
        const dd = cv.ground ? Math.min(d, Math.max(0, y - cv.ground[x])) : d;
        const t = Math.min(4, Math.floor((dd - ch) / 14));
        if (t > 0) c = mixPacked(c, deep, t * 0.16);
      }
      // rims against air at the sides and below
      const below = y < H - 1 && !S[k + W], side = (x > 0 && !S[k - 1]) || (x < W - 1 && !S[k + 1]);
      if (below || (side && d >= ch)) c = mixPacked(c, D, 0.55);
      cv.set(x, y, c);
    }
  }
  if (o.rocks) inclusions(cv, o.rocks, ch, o.seed);
  if (o.seams) seams(cv, o.seams, ch, o.seed);
  if (o.grass) grass(cv, o.grass, o.seed);
}

/** Depth below the surface of a ground pixel (rows of ground above it). */
function depthAt(cv, x, y) {
  let d = 0;
  while (y - d - 1 >= 0 && cv.solid[(y - d - 1) * cv.W + x]) d++;
  return d;
}

/** Stones set in the ground: lumps of a lighter rock, lit along their tops, dark beneath. */
function inclusions(cv, r, ch, seed) {
  const [lit, mid, dark] = r.cols.map(col);
  for (let i = 0; i < r.n; i++) {
    const cx = Math.floor(hash2(i, 1, seed + 40) * cv.W), cy = Math.floor(hash2(i, 2, seed + 40) * cv.H);
    if (!cv.solid[cy * cv.W + cx] || depthAt(cv, cx, cy) < ch + 3) continue;
    const rx = 2 + hash2(i, 3, seed + 40) * (r.r ?? 5), ry = rx * (0.5 + hash2(i, 4, seed + 40) * 0.3);
    for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
      if (x < 0 || y < 0 || x >= cv.W || y >= cv.H || !cv.solid[y * cv.W + x]) continue;
      const e = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + (hash2(x >> 1, y >> 1, seed + i) - 0.5) * 0.5;
      if (e > 1) continue;
      cv.set(x, y, y < cy - ry * 0.45 ? lit : e > 0.7 && y > cy ? dark : mid);
    }
  }
}

/** Seams of ore: thin wavering horizontal streaks of colour in the ground. */
function seams(cv, sm, ch, seed) {
  const cols = sm.cols.map(col);
  for (let i = 0; i < sm.n; i++) {
    const y0 = Math.floor(hash2(i, 5, seed + 50) * cv.H), x0 = Math.floor(hash2(i, 6, seed + 50) * cv.W), len = 20 + Math.floor(hash2(i, 7, seed + 50) * 60);
    const c = cols[i % cols.length];
    for (let x = x0; x < Math.min(cv.W, x0 + len); x++) {
      const y = Math.round(y0 + (fbm1(x * 0.05, seed + i, 2) - 0.5) * 8);
      for (const yy of [y, y + (hash2(x, i, seed) > 0.6 ? 1 : 0)]) if (yy > 0 && yy < cv.H && cv.solid[yy * cv.W + x] && depthAt(cv, x, yy) >= ch + 2) cv.set(x, yy, c);
    }
  }
}

/** A flat silhouette hanging from the top of the scene (a canopy, a cave roof) down to a noise line. */
export function hanging(cv, o) {
  const fill = col(o.fill), rim = o.rim ? col(o.rim) : fill, line = new Float32Array(cv.W);
  for (let x = 0; x < cv.W; x++) {
    line[x] = Math.round(o.base + (fbm1(x * o.freq, o.seed, 4) - 0.5) * 2 * o.amp + (o.rough ? (hash2(x >> 1, 1, o.seed) - 0.5) * o.rough : 0));
    for (let y = 0; y <= Math.min(cv.H - 1, line[x]); y++) cv.set(x, y, y === line[x] ? rim : fill);
  }
  return line;
}

/** Blades of grass (and a flower now and then) standing on the crust. */
function grass(cv, g, seed) {
  const cols = g.cols.map(col), fl = (g.flowers || []).map(col), tall = g.tall ?? 3, rate = g.rate ?? 0.6;
  for (let x = 0; x < cv.W; x++) for (let y = 1; y < cv.H; y++) {
    const k = y * cv.W + x;
    if (!cv.solid[k] || cv.solid[k - cv.W] || cv.liquid[k - cv.W]) continue;
    const r = hash2(x, y, seed + 21);
    if (r > rate) continue;
    const h = 1 + Math.floor(hash2(x, y, seed + 22) * tall);
    for (let j = 1; j <= h; j++) if (y - j >= 0 && !cv.solid[k - j * cv.W]) cv.set(x, y - j, cols[(j + (r > rate * 0.5 ? 1 : 0)) % cols.length]);
    if (fl.length && hash2(x, y, seed + 23) < 0.025) cv.set(x, y - h - 1, fl[Math.floor(hash2(x, y, seed + 24) * fl.length)]);
  }
}

/**
 * A pool: every pixel of air in [x0, x1] from `level` down to the ground
 * becomes liquid — a bright surface line, the body in flat bands, faintly
 * showing what lies behind it.
 * Its bed (the ground it touches) is repainted in `bed` (mud, silt, slag).
 * @param {any} cv @param {{surface:string, body:string[], see?:number, bed?:string[]}} o
 */
export function pool(cv, x0, x1, level, o) {
  const surf = col(o.surface), body = o.body.map(col), see = o.see ?? 0.15, bed = (o.bed || []).map(col);
  for (let x = Math.max(0, x0); x <= Math.min(cv.W - 1, x1); x++) {
    for (let y = level; y < cv.H; y++) {
      const k = y * cv.W + x;
      if (cv.solid[k]) break;
      cv.liquid[k] = 1;
      const d = y - level, c = d === 0 ? surf : body[Math.min(body.length - 1, Math.floor(d / 4))];
      cv.pix.px[k] = mixPacked(c, cv.pix.px[k], d === 0 ? 0 : see);
    }
  }
  if (bed.length) for (let y = level; y < cv.H; y++) for (let x = Math.max(0, x0 - 3); x <= Math.min(cv.W - 1, x1 + 3); x++) {
    const k = y * cv.W + x;
    if (!cv.solid[k]) continue;
    let near = 9;
    for (let j = -3; j <= 0; j++) for (let i = -3; i <= 3; i++) {
      const xx = x + i, yy = y + j;
      if (xx >= 0 && yy >= 0 && xx < cv.W && cv.liquid[yy * cv.W + xx]) near = Math.min(near, Math.max(Math.abs(i), -j));
    }
    if (near < 3) cv.pix.px[k] = bed[Math.min(bed.length - 1, near + (hash2(x, y, 77) > 0.8 ? 1 : 0))];
  }
  return { x0, x1, level };
}

/**
 * The open ground: every dry surface pixel (ground with air above) and the
 * air pixel above it, away from the edges and out of liquids.
 */
export function markOpen(cv, minY = 30) {
  const W = cv.W, S = cv.solid, L = cv.liquid;
  for (let y = Math.max(1, minY); y < cv.H; y++) for (let x = 2; x < W - 2; x++) {
    const k = y * W + x;
    if (!S[k] || S[k - W] || L[k - W] || L[k]) continue;
    cv.open[k] = 1; cv.open[k - W] = 1;
  }
}

/**
 * Ledges jutting out over the ground, spread across the scene in two tiers
 * so more can grow: n about 32–46 pixels above the ground under them (clear
 * of the columns in `keep`, [x0, x1] ranges such as pools; `rise` sets
 * other heights), most of them on a column of rock, and over the middle
 * ones a higher tier of n − 2, 42 pixels higher again, which may hang over
 * anything.
 */
export function ledges(cv, top, rng, n, o = {}) {
  const keep = o.keep || [], r0 = o.rise || [32, 46];
  for (const [tier, count, rise] of /** @type {[number, number, number[]][]} */ ([[0, n, r0], [1, n - 2, [r0[0] + 42, r0[1] + 42]]])) for (let i = 0; i < count; i++) {
    const x = Math.round((tier ? i + 1.5 : i + 0.5) * cv.W / n + rng.int(-14, 14)), rx = rng.int(18, 26);
    if (!tier && keep.some(([a, b]) => x + rx > a && x - rx < b)) continue;
    const ground = Math.min(top[Math.max(0, x - rx)], top[Math.min(cv.W - 1, x)], top[Math.min(cv.W - 1, x + rx)]);
    // never so high that what grows on it would reach out of the scene
    const y = Math.max(60, Math.round(ground) - rng.int(rise[0], rise[1]));
    if (ground - y < 24) continue;
    blob(cv, x, y, rx, rng.int(6, 8), rng.int(0, 1e9), 1);
    // most low ledges stand on a column of rock at one end: an overhang, not an island
    if (!tier && rng.next() < 0.7) column(cv, x + (rng.next() < 0.5 ? -1 : 1) * Math.round(rx * 0.55), y + 2, rng.int(4, 7), rng.int(0, 1e9));
  }
}

/** A column of ground from (x, y) down to the ground, widening toward its foot, its edges ragged. */
function column(cv, x, y, w, seed) {
  for (let yy = y; yy < cv.H; yy++) {
    const ground = cv.ground ? cv.ground[Math.max(0, Math.min(cv.W - 1, x))] : cv.H;
    if (yy > ground + 2) break;
    const t = (yy - y) / Math.max(1, ground - y), hw = w / 2 + t * t * w * 0.8 + (hash2(yy >> 1, 0, seed) - 0.5) * 2;
    for (let xx = Math.round(x - hw); xx <= Math.round(x + hw); xx++) if (xx >= 0 && xx < cv.W) cv.solid[yy * cv.W + xx] = 1;
  }
}

/** The row of the main ground's surface in a column (where trees and the like stand; ledges above it are ignored). */
export function surfaceAt(cv, x) {
  x = Math.max(0, Math.min(cv.W - 1, Math.round(x)));
  if (cv.ground) return Math.round(cv.ground[x]);
  for (let y = 0; y < cv.H; y++) if (cv.solid[y * cv.W + x]) return y;
  return cv.H - 1;
}

/**
 * A flat silhouette of the distance: one colour below a noise line (with a
 * lighter rim), e.g. hills, mountains, a far wood's canopy.
 * @param {any} cv @param {{base:number, amp:number, freq:number, seed:number, fill:string, rim?:string, peaks?:number, rough?:number, bottom?:number}} o
 */
export function silhouette(cv, o) {
  const fill = col(o.fill), rim = o.rim ? col(o.rim) : fill, line = new Float32Array(cv.W);
  for (let x = 0; x < cv.W; x++) {
    let v = fbm1(x * o.freq, o.seed, 4);
    if (o.peaks) v = Math.pow(v, 1 / (1 + o.peaks));
    line[x] = Math.round(o.base - (v - 0.5) * 2 * o.amp - (o.rough ? (hash2(x >> 1, 0, o.seed) - 0.5) * o.rough : 0));
    for (let y = Math.max(0, line[x]); y < (o.bottom ?? cv.H); y++) cv.set(x, y, y === line[x] ? rim : fill);
  }
  return line;
}

/** A flat silhouette of a tree (pine, round-crowned or bare) standing at (x, y). */
export function treeShape(cv, x, y, h, kind, c, seed) {
  const fill = col(c), tw = Math.max(1, Math.round(h / 14));
  const put = (px, py) => { if (px >= 0 && py >= 0 && px < cv.W && py < cv.H) cv.pix.px[py * cv.W + px] = fill; };
  for (let j = 0; j < h * (kind === 'pine' ? 0.9 : 0.6); j++) for (let i = -tw; i < tw; i++) put(Math.round(x + i), Math.round(y - j));
  if (kind === 'pine') {
    for (let j = 0; j < h * 0.85; j++) {
      const t = j / (h * 0.85), w = Math.round((1 - t) * h * 0.28 * (0.8 + 0.4 * ((j >> 2) % 2)));
      for (let i = -w; i <= w; i++) put(Math.round(x + i), Math.round(y - h * 0.15 - j));
    }
  } else if (kind === 'dead') {
    for (let b = 0; b < 4; b++) {
      const s = b % 2 ? 1 : -1, y0 = y - h * (0.35 + b * 0.12);
      for (let i = 0; i < h * 0.2; i++) put(Math.round(x + s * i), Math.round(y0 - i * 0.7));
    }
  } else {
    const r = h * 0.3, cy = y - h * 0.65;
    for (let j = -r; j <= r; j++) for (let i = -r * 1.2; i <= r * 1.2; i++) {
      if ((i / 1.2) ** 2 + j ** 2 + (hash2(Math.round(x + i) >> 1, Math.round(cy + j) >> 1, seed) - 0.5) * r * 1.2 <= r * r) put(Math.round(x + i), Math.round(cy + j));
    }
  }
}

/**
 * Light from a source, added in flat steps: a disc fading out to radius r.
 * Recorded in meta.lights for the flicker the animation adds.
 * @param {any} cv @param {number} x @param {number} y @param {number} r @param {number[]} rgb @param {number} k
 */
export function glow(cv, x, y, r, rgb, k) {
  cv.light(rgb, (px, py) => { const d = Math.hypot(px - x, py - y) / r; return d >= 1 ? 0 : (1 - d) * (1 - d) * k; }, Math.floor(y - r), Math.ceil(y + r));
  (cv.meta.lights ||= []).push([Math.round(x), Math.round(y), r, rgb]);
}

/**
 * Where loose grains trickle from: undersides of overhangs and ledges
 * (ground with air below) — [x, y, how far they fall before they land].
 */
export function drips(cv, seed, n) {
  const out = [];
  for (let y = 20; y < cv.H - 10; y++) for (let x = 4; x < cv.W - 4; x++) {
    const k = y * cv.W + x;
    if (!cv.solid[k] || cv.solid[k + cv.W] || cv.liquid[k + cv.W] || hash2(x, y, seed) > 0.05) continue;
    let fall = 1;
    while (y + fall < cv.H && !cv.solid[k + fall * cv.W] && !cv.liquid[k + fall * cv.W]) fall++;
    if (fall > 6) out.push([x, y + 1, fall - 1]);
  }
  return out.filter((_, i) => i % Math.max(1, Math.floor(out.length / n)) === 0).slice(0, n);
}
