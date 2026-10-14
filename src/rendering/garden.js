// The alchemist's garden, painted at a low art resolution: the well, the
// plant beds and the crystal beds, each drawn as it is now (how far grown,
// whether the soil is moist), with a little ambient animation.

import { Rng } from '../core/rng.js';
import { BEDS } from '../game/garden.js';
import { drawRaw } from './scenes.js';

export const GARDEN_W = 192;
export const GARDEN_H = 120;

/** @param {CanvasRenderingContext2D} ctx */
function R(ctx, x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
}
/** @param {number[]} rgb @param {number} [k] */
function css(rgb, k = 1) {
  return `rgb(${Math.round(Math.min(255, rgb[0] * 255 * k))},${Math.round(Math.min(255, rgb[1] * 255 * k))},${Math.round(Math.min(255, rgb[2] * 255 * k))})`;
}

const PLOTS = BEDS.filter((b) => b.kind !== 'well');

/** Where a bed sits in the scene (art pixels). @param {string} id */
export function bedRect(id) {
  if (id === 'well') return { x: 4, y: 44, w: 32, h: 44 };
  const i = PLOTS.findIndex((b) => b.id === id);
  const col = i % 5, row = Math.floor(i / 5);
  return { x: 42 + col * 30, y: 18 + row * 33, w: 28, h: 31 };
}

/** Which bed is under an art-pixel position. */
export function bedAt(x, y) {
  for (const b of BEDS) {
    const r = bedRect(b.id);
    if (x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) return b.id;
  }
  return null;
}

/** The static backdrop: sky, fence, lawn and paths. @param {CanvasRenderingContext2D} ctx @param {string} seed */
export function paintGarden(ctx, seed) {
  const W = GARDEN_W, H = GARDEN_H;
  const rng = new Rng('garden:' + seed);
  for (let y = 0; y < 14; y++) R(ctx, 0, y, W, 1, css([0.55 + y * 0.01, 0.72 + y * 0.008, 0.92]));
  // the cottage wall and fence at the back
  R(ctx, 0, 10, W, 6, '#6d4527');
  for (let x = 0; x < W; x += 6) { R(ctx, x, 6, 4, 10, '#a9743f'); R(ctx, x, 6, 4, 1, '#c99a5f'); }
  // lawn
  for (let y = 16; y < H; y++) R(ctx, 0, y, W, 1, css([0.33, 0.52, 0.22], 0.92 + ((y * 7) % 5) * 0.02));
  for (let i = 0; i < 500; i++) R(ctx, rng.int(0, W - 1), rng.int(16, H - 1), 1, 1, rng.chance(0.5) ? '#4f7a31' : '#6d9a42');
  // a path along the beds
  R(ctx, 38, 16, 3, H - 16, '#b8a07a');
  for (let i = 0; i < 40; i++) R(ctx, 38 + rng.int(0, 2), rng.int(16, H - 1), 1, 1, '#8a7656');
  // a few flowers in the lawn
  for (let i = 0; i < 24; i++) {
    const x = rng.int(0, 36), y = rng.int(92, H - 2);
    R(ctx, x, y, 1, 1, rng.pick(['#ffe58a', '#ff9fc7', '#ffffff', '#c9b7ff']));
  }
}

/**
 * Draw every bed as it is now.
 * @param {CanvasRenderingContext2D} ctx
 * @param {(id:string)=>any} status bed id → bed status (garden.js bedStatus), or null if not planted
 * @param {(role:string)=>number[]} colorOf ingredient colour of a role
 * @param {number} t seconds
 * @param {(id:string)=>boolean} locked beds the shop's rank cannot plant yet
 */
export function drawBeds(ctx, status, colorOf, t, locked) {
  for (const b of BEDS) {
    const r = bedRect(b.id);
    const st = status(b.id);
    if (b.kind === 'well') { well(ctx, r, st, t); continue; }
    if (!st || !st.owned) { emptyPlot(ctx, r, locked(b.id)); continue; }
    if (b.kind === 'stone') {
      R(ctx, r.x + 1, r.y + r.h - 8, r.w - 2, 7, '#7d7268');
      for (let k = 0; k < 8; k++) R(ctx, r.x + 2 + ((k * 7) % (r.w - 4)), r.y + r.h - 7 + (k % 3) * 2, 2, 1, '#9a8f84');
      const c = colorOf(b.role);
      const g = st.growth;
      if (g > 0.03) {
        drawRaw(ctx, r.x + 6, r.y + r.h - 20, b.role === 'sunstone' || b.role === 'bloodstone' || b.role === 'blight' ? 'stone' : 'crystal', c, Math.max(0.2, g));
        if (g > 0.5) drawRaw(ctx, r.x + 14, r.y + r.h - 19, 'crystal', c, Math.max(0.2, g - 0.4));
      }
      if (g >= 0.999 && Math.sin(t * 3 + r.x) > 0.8) R(ctx, r.x + 12, r.y + r.h - 18, 1, 1, '#ffffff');
    } else {
      const moist = st.moist;
      R(ctx, r.x + 1, r.y + r.h - 7, r.w - 2, 6, moist ? '#3a2416' : '#8b6a45');
      for (let k = 0; k < 6; k++) R(ctx, r.x + 3 + k * 4, r.y + r.h - 5, 2, 1, moist ? '#24160f' : '#a8875c');
      plant(ctx, b.role, r, st.growth, colorOf(b.role), t, moist);
    }
    // ripeness bar under the bed
    R(ctx, r.x + 2, r.y + r.h - 1, r.w - 4, 1, '#24160f');
    R(ctx, r.x + 2, r.y + r.h - 1, Math.round((r.w - 4) * st.growth), 1, st.ready ? '#9fe06a' : '#c08a2a');
  }
}

function emptyPlot(ctx, r, locked) {
  R(ctx, r.x + 2, r.y + r.h - 8, r.w - 4, 6, locked ? '#3f5a28' : '#5a7a34');
  // a little sign: + to plant, a lock when the guild does not allow it yet
  R(ctx, r.x + r.w / 2 - 1, r.y + r.h - 16, 2, 9, '#6d4527');
  R(ctx, r.x + r.w / 2 - 5, r.y + r.h - 20, 10, 6, locked ? '#5a5060' : '#c2a678');
  if (locked) { R(ctx, r.x + r.w / 2 - 2, r.y + r.h - 19, 4, 4, '#2b1d14'); R(ctx, r.x + r.w / 2 - 1, r.y + r.h - 18, 2, 1, '#e8b45c'); }
  else { R(ctx, r.x + r.w / 2 - 1, r.y + r.h - 19, 2, 4, '#3f6e2a'); R(ctx, r.x + r.w / 2 - 2, r.y + r.h - 18, 4, 2, '#3f6e2a'); }
}

function well(ctx, r, st, t) {
  const fill = st ? st.growth : 1;
  R(ctx, r.x + 2, r.y + 4, 2, r.h - 20, '#52321d'); R(ctx, r.x + r.w - 4, r.y + 4, 2, r.h - 20, '#52321d');
  R(ctx, r.x, r.y, r.w, 5, '#8a1f1a'); R(ctx, r.x + 2, r.y + 1, r.w - 4, 1, '#c04a2a');
  R(ctx, r.x + r.w / 2 - 1, r.y + 5, 1, 8, '#2b1d14');
  R(ctx, r.x + r.w / 2 - 3, r.y + 13, 6, 4, '#8b5a31');
  R(ctx, r.x + 1, r.y + r.h - 16, r.w - 2, 14, '#5d5465');
  for (let x = r.x + 1; x < r.x + r.w - 1; x += 5) R(ctx, x, r.y + r.h - 16, 4, 3, '#73697b');
  R(ctx, r.x + 4, r.y + r.h - 12, r.w - 8, 8, '#1a1a2a');
  const wh = Math.round(7 * fill);
  if (wh > 0) R(ctx, r.x + 4, r.y + r.h - 4 - wh, r.w - 8, wh, '#4c86c4');
  if (wh > 0 && Math.sin(t * 2) > 0) R(ctx, r.x + 6 + Math.round(Math.sin(t) * 3), r.y + r.h - 4 - wh, 4, 1, '#8fc7f2');
}

function plant(ctx, role, r, g, color, t, moist) {
  const base = r.y + r.h - 7;
  const h = Math.max(2, Math.round(18 * Math.min(1, g * 1.4)));
  const cx = r.x + r.w / 2;
  const sway = Math.round(Math.sin(t * 1.6 + r.x) * (moist ? 1 : 0));
  const leafC = moist ? '#4f9a31' : '#8a8a3a';
  const c = css(color), c2 = css(color, 0.7);
  if (role === 'sap') {
    // an ember tree: trunk and a fiery crown, amber drops when ripe
    R(ctx, cx - 1, base - h, 2, h, '#52321d');
    const cw = Math.max(3, Math.round(16 * g));
    R(ctx, cx - cw / 2 + sway, base - h - 4, cw, Math.max(2, Math.round(8 * g)), '#c04a2a');
    R(ctx, cx - cw / 2 + 1 + sway, base - h - 4, cw - 2, 2, '#ff8a2a');
  } else if (role === 'witchoil') {
    // a hexberry bush
    const bw = Math.max(3, Math.round(18 * g));
    R(ctx, cx - bw / 2, base - Math.round(h * 0.7), bw, Math.round(h * 0.7), '#2a4f2a');
    R(ctx, cx - bw / 2 + 1, base - Math.round(h * 0.7), bw - 2, 2, '#3f6e3a');
  } else {
    // lilies: a stem, leaves and a bloom
    R(ctx, cx + sway, base - h, 1, h, '#335224');
    R(ctx, cx - 4, base - Math.round(h * 0.4), 4, 2, leafC); R(ctx, cx + 1, base - Math.round(h * 0.6), 4, 2, leafC);
    if (g > 0.3) { R(ctx, cx - 2 + sway, base - h - 3, 5, 3, c); R(ctx, cx + sway, base - h - 4, 1, 1, '#ffffff'); }
  }
  // the harvest: drops, berries or sap beads, one per fifth of growth
  const n = g >= 0.2 ? Math.floor(g * 5) : 0;
  for (let i = 0; i < n; i++) {
    const x = cx - 7 + ((i * 5) % 15), y = base - 4 - ((i * 7) % Math.max(3, h));
    R(ctx, x, y, 2, 2, c2); R(ctx, x, y, 1, 1, c);
  }
}
