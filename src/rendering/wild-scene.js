// The wilds' scene in the interface: each region's procedural environment
// (visual/env/scene.js) as a cached canvas, where each plant stands on its
// open ground, which plant a tap lands on, and the moving parts drawn over
// the still painting every frame (birds, motes, river glints, wisps,
// embers, the steam of the crags' vents).

import { sceneOf, SCENE_W, SCENE_H } from '../visual/env/scene.js';
import { MIN_HIT } from './species-sprites.js';

export { SCENE_W, SCENE_H };

/** @type {Map<string, HTMLCanvasElement>} */
const canvases = new Map();

/** A region's painted scene as a canvas (browser), made once per world and region. @param {string} region @param {string} seed */
export function sceneCanvas(region, seed) {
  const k = region + ':' + seed;
  let cv = canvases.get(k);
  if (!cv) {
    cv = sceneOf(region, seed).pix.toCanvas();
    if (canvases.size >= 6) canvases.delete(/** @type {string} */ (canvases.keys().next().value));
    canvases.set(k, cv);
  }
  return cv;
}

/** The room a plant keeps round itself where the ground allows (scene pixels). */
const ROOM = 3;

/**
 * @typedef {{w:number, h:number, ax:number, ay:number, m:Uint8Array}} Silhouette
 */

/**
 * Where the plants of a region stand. A plant keeps its spot once it has
 * one, so it grows in place; a new sprout takes the open ground nearest the
 * random spot it came up at: its foot on open ground (never in water, lava,
 * a rock or a cliff), its whole grown silhouette in front of any scenery it
 * overlaps (never peeking out from behind a trunk or a bush), and a little
 * room from every other plant, so a stand never crowds into a clump.
 */
export class PlantGround {
  /** @param {string} region @param {string} seed */
  constructor(region, seed) {
    const sc = sceneOf(region, seed);
    this.region = region;
    this.open = sc.open;
    this.depth = sc.depth;
    this.top = Math.max(1, sc.top);
    /** plant id → its spot in scene pixels and the silhouette it was placed with @type {Map<string, {x:number, y:number, s:Silhouette}>} */
    this.spots = new Map();
  }

  /**
   * Each plant's spot, as fractions of the scene.
   * @param {{id:string, x:number, y:number}[]} plants oldest first
   * @param {(p:any)=>Silhouette|null} shapeOf
   * @returns {Record<string, {x:number, y:number}>}
   */
  place(plants, shapeOf) {
    const W = SCENE_W, H = SCENE_H, G = this.open, D = this.depth;
    /** @type {Record<string, {x:number, y:number}>} */
    const out = {};
    for (const p of plants) out[p.id] = { x: p.x, y: p.y };
    const here = new Set(plants.map((p) => p.id));
    for (const id of [...this.spots.keys()]) if (!here.has(id)) this.spots.delete(id);
    const fresh = plants.filter((p) => !this.spots.has(p.id) && shapeOf(p));
    if (fresh.length) {
      const roomy = new Uint8Array(W * H), tight = new Uint8Array(W * H);
      const mark = (/** @type {{x:number, y:number, s:Silhouette}} */ q) => {
        stampMask(roomy, q.s, q.x, q.y, ROOM);
        stampMask(tight, q.s, q.x, q.y, 0);
      };
      for (const q of this.spots.values()) mark(q);
      for (const p of fresh) {
        const s = /** @type {Silhouette} */ (shapeOf(p)), sw = Math.max(3, Math.round(s.w * 0.3));
        /** @param {Uint8Array} taken @param {number} ax @param {number} ay */
        const fits = (taken, ax, ay) => {
          const left = ax - s.ax, top = ay - s.ay;
          if (ay < this.top || ay > H - 3 || left < 1 || left + s.w > W - 1 || top < 1) return false;
          for (let y = ay - 1; y <= ay; y++) for (let x = ax - (sw >> 1); x < ax - (sw >> 1) + sw; x++) if (!G[y * W + x]) return false;
          for (let j = 0; j < s.h; j++) for (let i = 0; i < s.w; i++) {
            if (!s.m[j * s.w + i]) continue;
            const k = (top + j) * W + left + i;
            if (taken[k] || D[k] > ay) return false;
          }
          return true;
        };
        // where it came up (gathering.js sprouts at 0.56..0.9 of the scene's height) maps onto this region's own ground
        const ox = Math.round(p.x * W), oy = Math.round(this.top + Math.max(0, Math.min(1, (p.y - 0.56) / 0.34)) * (H - 4 - this.top));
        /** @type {[number, number, number][]} */
        const tries = [[0, ox, oy]];
        for (let y = this.top; y <= H - 3; y += 2) for (let x = (y + ox) & 1; x < W; x += 3) if (G[y * W + x]) tries.push([(x - ox) ** 2 + ((y - oy) * 1.6) ** 2, x, y]);
        tries.sort((a, b) => a[0] - b[0]);
        // no roomy ground left: the nearest spot it fits at all, else where it came up
        const spot = tries.find(([, x, y]) => fits(roomy, x, y)) || tries.find(([, x, y]) => fits(tight, x, y));
        const [, x, y] = spot || [0, ox, oy];
        const q = { x, y, s };
        mark(q);
        this.spots.set(p.id, q);
      }
    }
    for (const [id, q] of this.spots) out[id] = { x: q.x / W, y: q.y / H };
    return out;
  }
}

/** Mark a silhouette standing at (ax, ay), grown by `grow`, in a scene grid. */
function stampMask(grid, s, ax, ay, grow) {
  const W = SCENE_W, H = SCENE_H, left = ax - s.ax, top = ay - s.ay;
  for (let j = 0; j < s.h; j++) for (let i = 0; i < s.w; i++) {
    if (!s.m[j * s.w + i]) continue;
    for (let y = Math.max(0, top + j - grow); y <= Math.min(H - 1, top + j + grow); y++) for (let x = Math.max(0, left + i - grow); x <= Math.min(W - 1, left + i + grow); x++) grid[y * W + x] = 1;
  }
}

/**
 * Where a plant stands and what can be tapped: its frame's box anchored at
 * its foot, grown to at least MIN_HIT square.
 * @param {{x:number, y:number}} p @param {{w:number, h:number, ax:number, ay:number}|null} f its frame @param {number} W @param {number} H
 */
export function plantBox(p, f, W = SCENE_W, H = SCENE_H) {
  const ax = Math.round(p.x * W), ay = Math.round(p.y * H);
  const w = f ? f.w : 16, h = f ? f.h : 16;
  const hw = Math.max(w, MIN_HIT) / 2, hh = Math.max(h, MIN_HIT);
  return { ax, ay, w, h, x0: ax - hw, x1: ax + hw, y0: ay - hh, y1: ay + 3 };
}

/**
 * The plant under a scene point: the front-most (lowest on screen) box that
 * contains it, else the nearest box within `slop` pixels. Only plants are ever
 * hit — the scenery is part of the painting and never takes a tap.
 * @template {{x:number, y:number}} P
 * @param {P[]} plants @param {(p:P)=>{w:number, h:number, ax:number, ay:number}|null} frameOf @param {number} px @param {number} py @param {number} [W] @param {number} [H] @param {number} [slop]
 * @returns {P | null}
 */
export function hitPlant(plants, frameOf, px, py, W = SCENE_W, H = SCENE_H, slop = 5) {
  /** @type {P | null} */
  let best = null, bestY = -Infinity, near = null, nearD = slop * slop;
  for (const p of plants) {
    const b = plantBox(p, frameOf(p), W, H);
    if (px >= b.x0 && px <= b.x1 && py >= b.y0 && py <= b.y1) {
      if (b.ay > bestY) { bestY = b.ay; best = p; }
      continue;
    }
    const dx = Math.max(b.x0 - px, 0, px - b.x1), dy = Math.max(b.y0 - py, 0, py - b.y1), dd = dx * dx + dy * dy;
    if (dd <= nearD) { nearD = dd; near = p; }
  }
  return best || near;
}

/** @param {CanvasRenderingContext2D} ctx */
function px(ctx, x, y, c, w = 1, h = 1) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); }

/** A soft disc of light. @param {CanvasRenderingContext2D} ctx */
function halo(ctx, x, y, r, c, a) {
  ctx.globalAlpha = a;
  for (let k = r; k > 0; k -= 2) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(Math.round(x), Math.round(y), k, 0, Math.PI * 2); ctx.fill(); }
  ctx.globalAlpha = 1;
}

const STEAM = ['#fff0b0', '#f49e39', '#e56522', '#8a4a50', '#6a4457', '#4e3040'];

/**
 * The moving parts of a region, drawn over its painting each frame. Cheap:
 * a few dozen pixels, positions from the time alone (no state).
 * @param {CanvasRenderingContext2D} ctx @param {string} region @param {number} t seconds @param {string} seed
 */
export function animateRegion(ctx, region, t, seed) {
  const W = SCENE_W, H = SCENE_H, meta = sceneOf(region, seed).meta;
  if (region === 'meadow' || region === 'river' || region === 'quarry') {
    // birds crossing the sky, two wingbeats apart
    for (let i = 0; i < 3; i++) {
      const x = ((t * (7 + i * 2) + i * 130) % (W + 30)) - 15, y = 16 + i * 11 + Math.sin(t * 1.5 + i) * 3, up = Math.sin(t * 9 + i * 2) > 0 ? 1 : 0;
      for (const [dx, dy] of [[0, 0], [-1, -up], [1, -up], [-2, 1 - up * 2], [2, 1 - up * 2]]) px(ctx, x + dx, y + dy, '#2a2024');
    }
  }
  if (region === 'meadow') for (let i = 0; i < 5; i++) {
    // butterflies over the flowers
    const x = W * (0.12 + i * 0.18) + Math.sin(t * 0.8 + i * 3) * 22, y = H * 0.68 + Math.sin(t * 1.6 + i) * 12, open = Math.sin(t * 13 + i) > 0;
    const c = ['#ffe58a', '#ff9fc7', '#ffffff', '#c9b7ff', '#ffb070'][i];
    px(ctx, x - (open ? 2 : 1), y, c, open ? 2 : 1, 2); px(ctx, x + 1, y, c, open ? 2 : 1, 2); px(ctx, x, y, '#2a1a12', 1, 2);
  }
  if (region === 'forest') for (let i = 0; i < 16; i++) {
    // motes drifting in the light, and the odd leaf falling
    const x = (i * 41 + Math.sin(t * 0.5 + i) * 8) % W, y = 40 + ((i * 29 + t * 5) % 120);
    if (Math.sin(t * 2 + i * 1.7) > 0.3) px(ctx, x, y, '#fff2b0');
    if (i < 3) { const ly = ((t * 9 + i * 70) % (H + 20)) - 10, lx = (i * 120 + 60 + Math.sin(t * 1.3 + i) * 14) % W; px(ctx, lx, ly, i % 2 ? '#c88a2a' : '#8aa83a', 2, 1); }
  }
  if (region === 'river' && meta.river) for (let i = 0; i < 14; i++) {
    // glints carried down the stream
    const rows = meta.river.rows, y0 = Math.max(meta.horizon || 96, 100), span = H - y0;
    const y = Math.round(y0 + ((t * (6 + (i % 3) * 2) + i * 17) % span)), r = rows[Math.min(H - 1, y)];
    if (!r) continue;
    const x = r[0] + Math.sin(i * 2.3) * r[1] * 0.7;
    px(ctx, x, y, '#dff4ff', 2 + Math.round((y - y0) / span * 3), 1);
  }
  if (region === 'quarry') {
    for (let i = 0; i < 8; i++) { const x = (i * 47 + t * 6) % W, y = 80 + Math.sin(t * 0.8 + i) * 12 + i * 8; ctx.globalAlpha = 0.6; px(ctx, x, y, '#fff0d8'); ctx.globalAlpha = 1; }
    if (meta.lantern) halo(ctx, meta.lantern[0], meta.lantern[1], 10, '#ffc060', 0.06 + 0.04 * Math.sin(t * 9));
  }
  if (region === 'moonfen') {
    for (let i = 0; i < 8; i++) {
      // wisps drifting over the pools
      const x = W * (0.08 + i * 0.12) + Math.sin(t * 0.6 + i * 2) * 14, y = H * (0.6 + 0.07 * (i % 3)) + Math.sin(t * 1.2 + i) * 7;
      halo(ctx, x, y, 7, '#5fd4e8', 0.07);
      px(ctx, x - 1, y - 2, '#8fe0ff', 2, 4); px(ctx, x - 1, y, '#e9fbff', 2, 2); px(ctx, x, y - 4 + Math.round(Math.sin(t * 8 + i)), '#5fd4e8', 1, 2);
    }
    for (const [gx, gy] of meta.glows || []) halo(ctx, gx, gy, 9, '#b090ff', 0.05 + 0.04 * Math.sin(t * 2 + gx));
    for (let i = 0; i < 10; i++) if (Math.sin(t * 3 + i * 2.1) > 0.6) px(ctx, (i * 53 + Math.sin(t + i) * 10) % W, 120 + (i * 31) % 90, '#d8ff8a');
  }
  if (region === 'crags') {
    for (const v of meta.vents || []) {
      // steam: puffs lit by the vent, swelling, cooling to grey and drifting off
      for (let k = 13; k >= 0; k--) {
        const age = (t * 0.18 + k / 14) % 1, x = v.x + age * 10 + Math.sin(age * 5 + k) * (1 + age * 2), y = v.y - age * 46;
        const r = Math.max(2, Math.round(v.r * (0.6 + age * 1.3)));
        ctx.globalAlpha = age < 0.55 ? 0.75 : ((1 - age) / 0.45) * 0.75;
        ctx.fillStyle = STEAM[Math.min(STEAM.length - 1, Math.floor(Math.sqrt(age) * STEAM.length))];
        ctx.beginPath(); ctx.arc(Math.round(x), Math.round(y), r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      px(ctx, v.x - 1, v.y - 1 - (Math.sin(t * 9) > 0 ? 1 : 0), STEAM[0], 2, 2);
    }
    if (meta.crater) for (let k = 0; k < 6; k++) {
      const age = (t * 0.07 + k / 6) % 1;
      ctx.globalAlpha = 0.35 * (1 - age);
      ctx.fillStyle = '#3a2a2e';
      ctx.beginPath(); ctx.arc(Math.round(meta.crater[0] + age * 30), Math.round(meta.crater[1] - age * 36), Math.round(3 + age * 9), 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    for (let i = 0; i < 16; i++) {
      // embers rising from the lava
      const y = H * 0.95 - ((t * 14 + i * 13) % 110), x = W * (0.04 + i * 0.06) + Math.sin(t + i) * 5;
      px(ctx, x, y, i % 3 ? '#ffb444' : '#ff7a1c');
    }
    if (meta.flow) for (let i = 0; i < 10; i++) {
      // the lava's surface churns
      const y = Math.round(110 + ((i * 23 + t * 4) % 100)), r = meta.flow[y];
      if (r && Math.sin(t * 4 + i * 1.9) > 0.2) px(ctx, r[0] + Math.sin(i * 1.7) * r[1] * 0.6, y, '#ffe680', 2, 1);
    }
  }
}
