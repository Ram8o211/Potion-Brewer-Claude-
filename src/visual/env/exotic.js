// Shared scenery of the exotic biomes: floating isles, coral, kelp, giant
// clams, lightning rods, giant sleeping flowers and the far silhouettes they
// stand against. Each is drawn straight into the region's canvas in the
// wilds' flat style (a few clean tones per material, lit from the upper
// left, a dark rim against the air) and marked as scenery, so plants are
// never placed over it.

import { col } from './side.js';
import { fbm1, fbm2, hash2 } from '../noise.js';
import { mixPacked } from '../color.js';

/** A shade between two packed colours. */
const mix = mixPacked;

/**
 * A floating isle painted straight into the scenery behind the terrain (a
 * far one: flat tones, a lit rim on its grassy top, a tapering rocky
 * underside, a thin waterfall now and then).
 * @param {any} cv @param {number} cx @param {number} cy top centre @param {number} w @param {number} h depth of its underside
 * @param {{grass:string, rock:string, dark:string, lit:string, water?:string}} c @param {number} seed
 */
export function farIsle(cv, cx, cy, w, h, c, seed) {
  const G = col(c.grass), R = col(c.rock), D = col(c.dark), L = col(c.lit);
  for (let x = Math.floor(cx - w / 2); x <= cx + w / 2; x++) {
    if (x < 0 || x >= cv.W) continue;
    const u = (x - cx) / (w / 2), top = cy + Math.round((fbm1(x * 0.2, seed, 2) - 0.5) * 2), under = cy + h * Math.pow(Math.max(0, 1 - u * u), 0.8) * (0.7 + fbm1(x * 0.15, seed + 3, 2) * 0.6);
    for (let y = top; y <= under; y++) {
      if (y < 0 || y >= cv.H) continue;
      const d = y - top;
      cv.set(x, y, d === 0 ? L : d < 3 ? G : y > under - 2 ? D : u < -0.2 ? mix(R, L, 0.15) : R);
    }
  }
  if (c.water && hash2(cx, cy, seed) < 0.6) {
    const wx = Math.round(cx + (hash2(cx, 2, seed) - 0.5) * w * 0.6), W2 = col(c.water);
    for (let y = cy + 2; y < Math.min(cv.H, cy + h + 40); y++) if (hash2(wx, y >> 2, seed) > 0.12) cv.set(wx, y, mix(W2, 0xffffffff, (y - cy) / (h + 60)));
  }
}

/**
 * A sea of cloud below everything (the floating world's floor): rows of
 * heaped puffs, lit on top, paling toward the horizon.
 * @param {any} cv @param {number} y0 @param {string[]} cols light → shade @param {number} seed
 */
export function cloudSea(cv, y0, cols, seed) {
  const C = cols.map(col);
  for (let row = 0; row < 4; row++) {
    const base = y0 + row * 12, r0 = 10 - row;
    for (let i = -1; i < cv.W / 14 + 2; i++) {
      const cx = i * 14 + Math.round(hash2(i, row, seed) * 10) + (row & 1) * 7, r = r0 + Math.round(hash2(i, row + 9, seed) * 6);
      for (let y = base - r; y < cv.H; y++) for (let x = cx - r - 2; x <= cx + r + 2; x++) {
        if (x < 0 || x >= cv.W || y < 0) continue;
        const dx = (x - cx) / (r + 2), dy = (y - base) / r;
        if (dy < 0 && dx * dx + dy * dy > 1) continue;
        const lit = dy < -0.55 && dx < 0.3 ? 0 : dy < -0.2 ? 1 : 2;
        cv.set(x, y, mix(C[Math.min(C.length - 1, lit + row)], C[C.length - 1], row * 0.08));
      }
    }
  }
}

/**
 * Coral: a branching growth from a foot, its arms rounded and thick, lit
 * on their upper left, knobbed tips; marked as scenery.
 * @param {any} cv @param {number} x foot @param {number} y foot @param {number} h @param {string[]} cs [dark, mid, light, tip] @param {number} seed
 */
export function coral(cv, x, y, h, cs, seed) {
  const [D, M, L, T] = cs.map(col);
  /** @type {[number, number, number][]} */
  const dots = [];
  const grow = (px, py, ang, len, w, depth) => {
    const steps = Math.max(2, Math.round(len));
    let cx = px, cy = py;
    for (let i = 0; i < steps; i++) {
      cx += Math.cos(ang); cy += Math.sin(ang);
      ang += (hash2(Math.round(cx), Math.round(cy), seed) - 0.5) * 0.3;
      dots.push([cx, cy, w]);
    }
    if (depth <= 0 || len < 3) { dots.push([cx, cy, w + 0.8]); return; }
    for (const s of [-1, 1]) if (hash2(depth, s + Math.round(cx), seed + 7) < 0.8) grow(cx, cy, ang + s * (0.45 + hash2(depth, s, seed) * 0.3), len * 0.68, Math.max(0.9, w * 0.78), depth - 1);
  };
  grow(x, y, -Math.PI / 2 + (hash2(x, y, seed) - 0.5) * 0.3, h * 0.42, 2.2, 3);
  const put = (/** @type {number} */ xx, /** @type {number} */ yy, /** @type {number} */ c) => { if (xx >= 0 && yy >= 0 && xx < cv.W && yy < cv.H) cv.setThing(xx, yy, c); };
  // outline, body, light: three passes so arms overlap cleanly
  for (const pass of [0, 1, 2]) for (const [cx, cy, w] of dots) {
    const r = pass === 0 ? w + 1 : w;
    for (let yy = Math.floor(cy - r); yy <= cy + r; yy++) for (let xx = Math.floor(cx - r); xx <= cx + r; xx++) {
      const d = Math.hypot(xx - cx, yy - cy);
      if (d > r + 0.2) continue;
      if (pass === 0) put(xx, yy, D);
      else if (pass === 1) put(xx, yy, M);
      else if (xx - cx + yy - cy < -r * 0.5) put(xx, yy, L);
    }
  }
  for (const [cx, cy, w] of dots) if (w > 2.2) put(Math.round(cx), Math.round(cy - 1), T);
  cv.claim(Math.round(x - h * 0.5), y - h, Math.round(x + h * 0.5), y);
  cv.block(x - h * 0.4, y - h, x + h * 0.4, y + 1);
}

/**
 * A strand of kelp rising from the ground, waving (painted still), its
 * blades lit on one side.
 * @param {any} cv @param {number} x @param {number} y @param {number} h @param {string[]} cs [dark, mid, light] @param {number} seed
 */
export function kelp(cv, x, y, h, cs, seed) {
  const [D, M, L] = cs.map(col);
  for (let j = 0; j < h; j++) {
    const xx = Math.round(x + Math.sin(j * 0.18 + seed) * 2.5), yy = y - j;
    if (yy < 0) break;
    cv.setThing(xx - 1, yy, D); cv.setThing(xx, yy, M); cv.setThing(xx + 1, yy, j % 7 < 3 ? L : M); cv.setThing(xx + 2, yy, D);
    if (j % 9 === 4) for (let k = 1; k <= 4; k++) cv.setThing(xx + 2 + k, yy - (k >> 1), k === 4 ? D : L);
  }
  cv.claim(x - 3, y - h, x + 7, y);
  cv.block(x - 3, y - h, x + 7, y + 1);
}

/**
 * A giant clam lying open on the ground: a ribbed lower shell, a pearl.
 * @param {any} cv @param {number} x @param {number} y @param {number} r @param {string[]} cs [dark, mid, light, pearl]
 */
export function clam(cv, x, y, r, cs) {
  const [D, M, L, P] = cs.map(col);
  for (let yy = -Math.round(r * 0.9); yy <= 0; yy++) for (let xx = -r - 1; xx <= r + 1; xx++) {
    const d = (xx / (r + 1)) ** 2 + (yy / (r * 0.9)) ** 2;
    if (d > 1) continue;
    const edge = d > 0.78, rib = Math.abs(Math.round(Math.atan2(yy, xx) * 4)) % 2 === 0;
    cv.setThing(x + xx, y + yy, edge ? D : yy < -r * 0.5 && xx < 0 ? L : rib ? M : mix(M, D, 0.25));
  }
  for (let xx = -r; xx <= r; xx++) cv.setThing(x + xx, y - Math.round(r * 0.45), D);
  cv.setThing(x, y - Math.round(r * 0.45) - 1, P); cv.setThing(x + 1, y - Math.round(r * 0.45) - 1, P); cv.setThing(x, y - Math.round(r * 0.45) - 2, 0xffffffff);
  cv.claim(x - r - 1, y - r, x + r + 1, y);
  cv.block(x - r - 1, y - r, x + r + 2, y + 1);
}

/**
 * A lightning rod of crystal: a tall faceted shard on a stony foot, its
 * tip bright. Returns its tip.
 * @param {any} cv @param {number} x @param {number} y foot @param {number} h @param {string[]} cs [dark, mid, light, tip]
 */
export function rod(cv, x, y, h, cs) {
  const [D, M, L, T] = cs.map(col);
  const w = Math.max(2, Math.round(h / 9));
  for (let j = 0; j < h; j++) {
    const half = Math.max(0, Math.round(w * (1 - Math.pow(j / h, 2))));
    for (let dx = -half - 1; dx <= half + 1; dx++) {
      const c = Math.abs(dx) === half + 1 ? D : dx < 0 ? L : dx === 0 ? M : mix(M, D, 0.3);
      cv.setThing(x + dx, y - j, j > h - 3 ? T : c);
    }
  }
  // the stony foot
  for (let dx = -w - 3; dx <= w + 3; dx++) for (let j = 0; j < 3; j++) if (Math.abs(dx) < w + 3 - j) cv.setThing(x + dx, y - j, j === 2 ? 0xff6a6058 : 0xff4a4440);
  cv.claim(x - w - 3, y - h, x + w + 3, y);
  cv.block(x - w - 4, y - h - 2, x + w + 5, y + 1);
  return [x, y - h];
}

/**
 * A giant sleeping flower: a long curving stalk, a drooping bulb of
 * petals, two broad leaves at its foot. Returns where its bulb hangs.
 * @param {any} cv @param {number} x @param {number} y @param {number} h @param {{stem:string[], petal:string[], leaf:string[]}} c @param {number} seed
 */
export function sleeper(cv, x, y, h, c, seed) {
  const S = c.stem.map(col), P = c.petal.map(col), Lf = c.leaf.map(col);
  const lean = (hash2(x, y, seed) - 0.5) * 18;
  let tx = x, ty = y;
  for (let j = 0; j < h; j++) {
    const u = j / h, xx = Math.round(x + lean * u * u), yy = y - j;
    cv.setThing(xx - 1, yy, S[0]); cv.setThing(xx, yy, S[1]); cv.setThing(xx + 1, yy, S[2] ?? S[1]);
    tx = xx; ty = yy;
  }
  // the bulb, hanging over its stalk's tip, petals closed in sleep
  const r = Math.max(5, Math.round(h * 0.16)), bx = tx + Math.sign(lean || 1) * Math.round(r * 0.6), by = ty + Math.round(r * 0.7);
  for (let yy = -r; yy <= Math.round(r * 1.3); yy++) for (let xx = -r; xx <= r; xx++) {
    const d = (xx / r) ** 2 + (yy / (yy < 0 ? r : r * 1.3)) ** 2;
    if (d > 1) continue;
    const rib = Math.abs(xx) % 3 === 0 && yy > -r * 0.3;
    cv.setThing(bx + xx, by + yy, d > 0.8 ? P[0] : xx + yy < -r * 0.6 ? P[3] ?? P[2] : rib ? P[1] : P[2]);
  }
  // two broad leaves at its foot
  for (const s of [-1, 1]) for (let k = 0; k < 10; k++) {
    const lx = x + s * k, ly = y - Math.round(Math.sin(k / 10 * Math.PI) * 4) - 1;
    cv.setThing(lx, ly, Lf[0]); cv.setThing(lx, ly - 1, Lf[1]); if (k > 2 && k < 8) cv.setThing(lx, ly - 2, Lf[2] ?? Lf[1]);
  }
  cv.claim(Math.min(x, bx) - r - 2, ty - 2, Math.max(x, bx) + r + 2, y);
  cv.block(Math.min(x, bx) - r - 2, ty - 2, Math.max(x, bx) + r + 2, y + 1);
  return [bx, by + Math.round(r * 1.3)];
}

/**
 * Far branching silhouettes (a coral forest, giant flowers) in one flat
 * colour with a lit rim, standing on a line.
 * @param {any} cv @param {{n:number, base:number, h:[number, number], fill:string, rim:string, seed:number, kind:'coral'|'bloom'|'spire'}} o
 */
export function farShapes(cv, o) {
  const F = col(o.fill), R = col(o.rim);
  const dot = (x, y, r, c) => { for (let yy = Math.floor(y - r); yy <= y + r; yy++) for (let xx = Math.floor(x - r); xx <= x + r; xx++) if (xx >= 0 && yy >= 0 && xx < cv.W && yy < cv.H && Math.hypot(xx - x, yy - y) <= r) cv.set(xx, yy, c); };
  for (let i = 0; i < o.n; i++) {
    const x = Math.round(((i + 0.2 + hash2(i, 1, o.seed) * 0.6) / o.n) * cv.W), h = o.h[0] + hash2(i, 2, o.seed) * (o.h[1] - o.h[0]);
    if (o.kind === 'spire') {
      for (let j = 0; j < h; j++) { const w = Math.max(1, Math.round((1 - j / h) * h * 0.14)); for (let dx = -w; dx <= w; dx++) cv.set(x + dx, o.base - j, dx === -w ? R : F); }
      continue;
    }
    if (o.kind === 'bloom') {
      const lean = (hash2(i, 3, o.seed) - 0.5) * 20;
      for (let j = 0; j < h; j++) { const u = j / h; dot(x + lean * u * u, o.base - j, 1.5, F); }
      const r = h * 0.14;
      dot(x + lean + Math.sign(lean) * r * 0.5, o.base - h + r * 0.8, r, F);
      dot(x + lean + Math.sign(lean) * r * 0.5 - 1, o.base - h + r * 0.4, r * 0.6, R);
      continue;
    }
    // coral: a fan of arms
    const arms = 3 + Math.floor(hash2(i, 4, o.seed) * 3);
    for (let a = 0; a < arms; a++) {
      const ang = -Math.PI / 2 + (a - (arms - 1) / 2) * 0.35;
      let cx = x, cy = o.base, an = ang;
      for (let j = 0; j < h; j++) {
        cx += Math.cos(an); cy += Math.sin(an); an += (fbm1(j * 0.2 + a, o.seed + i, 2) - 0.5) * 0.25;
        dot(cx, cy, Math.max(1, 2.5 * (1 - j / h) + 1), j > h - 3 ? R : F);
      }
    }
  }
}

/**
 * Banks of mist lying over a region (flat bands, broken by noise).
 * @param {any} cv @param {number} c packed colour @param {[number, number, number][]} bands [y, half height, strength] @param {number} seed
 */
export function mistBands(cv, c, bands, seed) {
  cv.wash(c, (x, y) => {
    let a = 0;
    for (const [by, hh, k] of bands) a += Math.exp(-(((y - by) / hh) ** 2)) * k;
    return a * (fbm2(x * 0.02, y * 0.05, seed, 3) > 0.48 ? 1 : 0.55);
  }, 0, cv.H);
}

/** Every open, dry surface pixel of the main ground and ledges, as [x, y]. @param {any} cv @param {number} [minY] */
export function openSpots(cv, minY = 40) {
  const out = [];
  for (let y = minY; y < cv.H - 2; y++) for (let x = 6; x < cv.W - 6; x++) {
    const k = y * cv.W + x;
    if (cv.open[k] && cv.solid[k] && !cv.solid[k - cv.W] && !cv.liquid[k - cv.W]) out.push([x, y]);
  }
  return out;
}
