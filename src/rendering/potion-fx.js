// The look of each effect inside a brew. Every effect a potion carries
// leaves its own mark in the liquid where it is, as strong as its share of
// the magic there:
//   vitality        a slow double heartbeat and soft motes of life rising
//   strength        heavy molten bands rolling slowly, like liquid metal
//   love            little hearts drifting up
//   arcana          stars twinkling in and out deep in the brew
//   transformation  iridescent bands sweeping through the hues
//   fire            flickering heat and embers racing to the surface
//   frost           snowflake crystals drifting down, a frosted rim
//   acidity         a fizz of fine bubbles popping at the surface
//   toxicity        murky blotches roiling, fat sluggish bubbles
//   death           shadows creeping through it, dark motes sinking
// Patterns are laid out in screen pixels (so they stay crisp pixel art) and
// animated in time; fluid.js calls potionFx per liquid pixel.

import { EFFECTS } from '../alchemy/effects.js';

const K = Object.fromEntries(EFFECTS.map((e, k) => [e.key, k]));
const COL = EFFECTS.map((e) => e.color);

/** Small integer hash → [0,1). */
function hash01(n) {
  n = Math.imul(n ^ (n >>> 15), 0x2c1b3c6d);
  n = Math.imul(n ^ (n >>> 12), 0x297a2d39);
  n ^= n >>> 15;
  return (n >>> 0) / 4294967296;
}

function cellHash(cx, cy, salt) {
  return hash01(Math.imul(cx, 73856093) ^ Math.imul(cy, 19349663) ^ Math.imul(salt, 83492791));
}

/** Smooth value noise. */
function vnoise(x, y, salt) {
  const ix = Math.floor(x), iy = Math.floor(y);
  let fx = x - ix, fy = y - iy;
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
  const a = cellHash(ix, iy, salt), b = cellHash(ix + 1, iy, salt), c = cellHash(ix, iy + 1, salt), d = cellHash(ix + 1, iy + 1, salt);
  return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
}

/**
 * Is there a dot (bubble, star, heart…) at this pixel? The screen is cut
 * into C×C cells scrolled vertically by `scroll` px; a cell holds a dot with
 * probability `prob`. Sets dX, dY (pixel offset from the dot's centre) and
 * dH (the dot's own random value in [0,1)).
 */
let dX = 0, dY = 0, dH = 0;
function cellDot(sx, sy, C, scroll, prob, salt, m) {
  if (prob <= 0) return false;
  const yy = sy + Math.floor(scroll);
  const cx = Math.floor(sx / C), cy = Math.floor(yy / C);
  const h = cellHash(cx, cy, salt);
  if (h >= prob) return false;
  dH = h / prob;
  const span = C - 2 * m;
  dX = sx - (cx * C + m + Math.floor(cellHash(cx, cy, salt + 7) * span));
  dY = yy - (cy * C + m + Math.floor(cellHash(cx, cy, salt + 13) * span));
  return true;
}

/** Output colour (fc) and helpers to mix into it. */
export const fc = [0, 0, 0];
function mixTo(c, t, l = 1) {
  fc[0] += (c[0] * l - fc[0]) * t; fc[1] += (c[1] * l - fc[1]) * t; fc[2] += (c[2] * l - fc[2]) * t;
}
function shade(f) { fc[0] *= f; fc[1] *= f; fc[2] *= f; }

const IR = [0, 0, 0], GREY = [0, 0, 0];
const WHITE = [1, 1, 1], BLACK = [0.04, 0.03, 0.06], EMBER = [1, 0.86, 0.4], ASH = [0.2, 0.18, 0.24];
// a 5×4 pixel heart, rows top to bottom, centred on column 2, row 1
const HEART = [0b01010, 0b11111, 0b01110, 0b00100];

/**
 * Apply the effects' looks to the liquid colour in fc.
 * @param {Float32Array} f per-effect magic field @param {number} o its offset for this pixel
 * @param {number} mask effects present anywhere @param {number} inv 1 / kernel weight
 * @param {number} sx @param {number} sy screen pixel
 * @param {number} time seconds @param {number} below px below the surface
 * @param {boolean} edge on the liquid's outline
 */
export function potionFx(f, o, mask, inv, sx, sy, time, below, edge) {
  for (let m = mask, k = 0; m; m >>>= 1, k++) {
    if (!(m & 1)) continue;
    // a square root: a plain brew still shows its character, an awakened one in full
    const A = Math.min(1, Math.sqrt(f[o + k] * inv) * 1.3);
    if (A < 0.03) continue;
    const c = COL[k];
    switch (k) {
      case K.vitality: {
        // lub-dub: two quick swells every 1.2 s
        const t = (time / 1.2) % 1;
        const beat = Math.exp(-Math.pow((t - 0.1) / 0.05, 2)) + 0.6 * Math.exp(-Math.pow((t - 0.3) / 0.05, 2));
        mixTo(c, A * (0.12 + 0.4 * beat), 1.2);
        // motes of life: a bright point with a soft halo, drifting up
        if (cellDot(sx, sy, 9, time * 6, A * 0.5, 101, 1)) {
          const d = Math.abs(dX) + Math.abs(dY);
          if (d === 0) mixTo(WHITE, 0.75, 1); else if (d === 1) mixTo(c, 0.55, 1.3);
        }
        break;
      }
      case K.strength: {
        // heavy horizontal bands, slowly rolling and swelling
        const wv = sy * 0.45 + Math.sin(sx * 0.06 + time * 0.5) * 2.2 + time * 0.6;
        const band = wv - Math.floor(wv / 4) * 4;
        if (band < 1) { mixTo(c, A * 0.4, 1.25); } else if (band >= 3) shade(1 - A * 0.22);
        break;
      }
      case K.love: {
        if (cellDot(sx, sy, 11, time * 4.5, A * 0.5, 211, 3)) {
          const wob = Math.round(Math.sin(time * 2 + dH * 9) * 1);
          const hx = dX + 2 - wob, hy = dY + 1;
          if (hx >= 0 && hx < 5 && hy >= 0 && hy < 4 && (HEART[hy] >> (4 - hx)) & 1) mixTo(c, 0.8, 1.2);
        }
        mixTo(c, A * 0.12);
        break;
      }
      case K.arcana: {
        mixTo(c, A * 0.1, 0.8);
        if (cellDot(sx, sy, 8, 0, A * 0.6, 307, 2)) {
          const tw = Math.max(0, Math.sin(time * (1.5 + dH * 2) + dH * 40));
          const ax = Math.abs(dX), ay = Math.abs(dY);
          if (ax === 0 && ay === 0 && tw > 0.1) mixTo(WHITE, 0.5 + 0.5 * tw, 1);
          else if (tw > 0.45 && ((ax === 0 && ay === 1) || (ay === 0 && ax === 1))) mixTo(c, 0.85, 1.5);
          else if (tw > 0.8 && ((ax === 0 && ay === 2) || (ay === 0 && ax === 2))) mixTo(c, 0.6, 1.3);
        }
        break;
      }
      case K.transformation: {
        // iridescent bands: the colour turns through the hues as they sweep by
        const h = (sx * 0.05 - sy * 0.035 + time * 0.35) * 6.2832;
        IR[0] = 0.5 + 0.5 * Math.cos(h); IR[1] = 0.5 + 0.5 * Math.cos(h - 2.094); IR[2] = 0.5 + 0.5 * Math.cos(h + 2.094);
        mixTo(IR, A * 0.45, Math.max(fc[0], fc[1], fc[2], 0.25) * 1.1);
        break;
      }
      case K.fire: {
        // flickering heat, hottest at the surface, and embers racing up
        const fl = vnoise(sx * 0.18, sy * 0.12 + time * 3, 401);
        mixTo(c, A * (0.15 + 0.45 * fl) * (below < 8 ? 1.4 : 1), 1.25);
        if (fl > 0.72) mixTo(EMBER, A * (fl - 0.72) * 2.5, 1.1);
        if (cellDot(sx, sy, 7, time * 22, A * 0.55, 409, 1) && dX === 0) {
          if (dY === 0) mixTo(EMBER, 0.95, 1.15); else if (dY === 1) mixTo(c, 0.85, 1.2); else if (dY === 2) mixTo(c, 0.45, 1);
        }
        break;
      }
      case K.frost: {
        if (edge) mixTo(WHITE, A * 0.6, 0.95);
        mixTo(c, A * 0.12);
        if (cellDot(sx, sy, 10, -time * 1.5, A * 0.6, 503, 2)) {
          const ax = Math.abs(dX), ay = Math.abs(dY);
          const flake = (ax === 0 && ay === 0) || (ax === 1 && ay === 1) || (ax === 0 && ay === 2) || (ay === 0 && ax === 2);
          if (flake) mixTo(WHITE, ax + ay === 0 ? 1 : 0.8, 1);
        }
        break;
      }
      case K.acidity: {
        // a fizz: many fine bubbles rising fast, popping at the surface
        if (cellDot(sx, sy, 5, time * 16, A * 0.5, 601, 0) && dX === 0 && dY === 0) mixTo(c, 0.7, 1.35);
        if (below <= 1 && cellHash(sx, Math.floor(time * 8), 607) < A * 0.4) mixTo(WHITE, 0.6, 1);
        break;
      }
      case K.toxicity: {
        const n = vnoise(sx * 0.1 + time * 0.15, sy * 0.1 - time * 0.25, 701);
        if (n > 0.5) mixTo(c, A * Math.min(1, (n - 0.5) * 2.2) * 0.7, 0.65);
        // fat, sluggish bubbles: a round rim with a pale glint
        if (cellDot(sx, sy, 13, time * 2.5, A * 0.35, 709, 3)) {
          const bx = dX + 0.5, by = dY + 0.5, r2 = bx * bx + by * by;
          if (r2 < 4.4) mixTo(c, r2 > 1.6 ? 0.85 : bx < 0 && by < 0 ? 0.6 : 0.3, r2 > 1.6 ? 0.6 : 1.35);
        }
        break;
      }
      case K.death: {
        // shadows creeping through, desaturating what they touch
        const n = vnoise(sx * 0.06 - time * 0.1, sy * 0.07 + time * 0.2, 801);
        GREY[0] = GREY[1] = GREY[2] = (fc[0] + fc[1] + fc[2]) / 3;
        mixTo(GREY, A * 0.45);
        if (n > 0.5) mixTo(BLACK, A * (n - 0.5) * 1.5);
        if (cellDot(sx, sy, 9, -time * 3, A * 0.35, 809, 1) && dX === 0 && dY === 0) mixTo(ASH, 0.8);
        mixTo(c, A * 0.08);
        break;
      }
    }
  }
}
