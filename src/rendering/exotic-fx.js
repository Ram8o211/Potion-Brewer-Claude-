// The exotic biomes' living details and their touch interactions — all
// decorative, none of them changes the game:
//
//   Moonfen      the wisps' lights answer a touch with spectral ripples;
//   Skyshard     drifting isles: drag or flick them and they swing back to
//                where they float, on a lightly damped (springy) spring,
//                the small ones flung further than the big;
//   Morphgrove   its blooms change shape when the finger brushes them;
//   Veil Hollow  a low mist the finger parts, showing what it hides, which
//                settles back slowly;
//   Ghostglass   spectral crystals that turn clear at a touch, then solid;
//   Chronoglass  sandfalls whose grains run backward, then race, when touched.
//
// State lives per scene (region and its generation's seed), updated by
// step(dt) and pushed by the finger's sweeps (push), and drawn each frame
// over the painting (draw). Everything is bounded (offsets, counts) and
// costs a few hundred pixel writes a frame at most.

import { sceneOf, SCENE_W, SCENE_H } from '../visual/env/scene.js';

/** @type {Map<string, any>} */
const states = new Map();

/** A sprite's canvas (made once). @param {{w:number, h:number, px:Uint32Array, cv?:any}} s */
function canvasOf(s) {
  if (s.cv) return s.cv;
  const c = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(s.w, s.h) : /** @type {any} */ (document.createElement('canvas'));
  c.width = s.w; c.height = s.h;
  const ctx = c.getContext('2d'), img = ctx.createImageData(s.w, s.h);
  new Uint32Array(img.data.buffer).set(s.px);
  ctx.putImageData(img, 0, 0);
  s.cv = c;
  return c;
}

/** The state of a scene's exotic details (made on first use). @param {string} region @param {string} seed */
function stateOf(region, seed) {
  const key = region + ':' + seed;
  let st = states.get(key);
  if (st) return st;
  const meta = sceneOf(region, seed).meta;
  st = {
    region, meta, t: 0,
    isles: (meta.isles || []).map((s) => ({ s, ox: 0, oy: 0, vx: 0, vy: 0 })),
    ripples: /** @type {{x:number, y:number, t:number}[]} */ ([]),
    morphs: (meta.morphs || []).map((m) => ({ ...m, shape: 0, cool: 0 })),
    crystals: (meta.crystals || []).map((s) => ({ s, a: 1, target: 1, hold: 0 })),
    falls: (meta.sandfalls || []).map((f) => ({ ...f, phase: 0, speed: 40, mode: 'run', left: 0 })),
    mist: null,
  };
  if (meta.mist) {
    const cw = 6, nx = Math.ceil(SCENE_W / cw), ny = Math.ceil((meta.mist.y1 - meta.mist.y0) / cw);
    const base = new Float32Array(nx * ny);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const v = 0.5 + 0.5 * Math.sin(i * 0.37 + meta.mist.seed % 7) * Math.cos(j * 0.6 + i * 0.11);
      base[j * nx + i] = Math.min(1, 0.42 + v * 0.42 + j / ny * 0.16);
    }
    st.mist = { cw, nx, ny, y0: meta.mist.y0, base, cur: base.slice() };
  }
  if (states.size >= 6) states.delete(/** @type {string} */ (states.keys().next().value));
  states.set(key, st);
  return st;
}

/** Does this region have exotic details at all? @param {string} region */
export const hasExotic = (region) => ['moonfen', 'skyshard', 'morphgrove', 'veilhollow', 'ghostglass', 'chronoglass'].includes(region);

/** Distance from a point to a segment. */
function segDist(px, py, x0, y0, x1, y1) {
  const dx = x1 - x0, dy = y1 - y0, L = dx * dx + dy * dy;
  const t = L ? Math.max(0, Math.min(1, ((px - x0) * dx + (py - y0) * dy) / L)) : 0;
  return Math.hypot(px - (x0 + t * dx), py - (y0 + t * dy));
}

/**
 * The finger swept from (x0, y0) to (x1, y1) (scene pixels).
 * @param {string} region @param {string} seed
 */
export function exoticPush(region, seed, x0, y0, x1, y1) {
  if (!hasExotic(region)) return;
  const st = stateOf(region, seed), vx = x1 - x0, vy = y1 - y0;
  for (const is of st.isles) {
    const s = is.s, cx = s.x + is.ox + s.w / 2, cy = s.y + is.oy + s.h / 2;
    if (segDist(cx, cy, x0, y0, x1, y1) < Math.max(s.w, s.h) * 0.6) { const kick = 10 / Math.max(0.8, Math.sqrt(s.w / 30)); is.vx += vx * kick; is.vy += vy * kick; }
  }
  if (region === 'moonfen') for (const [gx, gy] of st.meta.glows || []) {
    if (segDist(gx, gy, x0, y0, x1, y1) < 14 && st.ripples.length < 24 && !st.ripples.some((r) => r.x === gx && r.y === gy && st.t - r.t < 0.5)) st.ripples.push({ x: gx, y: gy, t: st.t });
  }
  for (const m of st.morphs) if (m.cool <= 0 && segDist(m.x, m.y - 3, x0, y0, x1, y1) < 9) { m.shape = (m.shape + 1) % 4; m.cool = 0.45; }
  for (const c of st.crystals) {
    const s = c.s;
    if (c.hold <= 0 && segDist(s.x + s.w / 2, s.y + s.h / 2, x0, y0, x1, y1) < Math.max(6, s.w)) { c.target = c.target > 0.5 ? 0.2 : 1; c.hold = 0.6; }
  }
  for (const f of st.falls) if (f.mode === 'run' && Math.abs(f.x - (x0 + x1) / 2) < 10 && (y0 + y1) / 2 > f.y0 && (y0 + y1) / 2 < f.y1) { f.mode = 'back'; f.left = 2.5; }
  const m = st.mist;
  if (m) {
    const steps = Math.max(1, Math.ceil(Math.hypot(vx, vy) / 3));
    for (let k = 0; k <= steps; k++) {
      const x = x0 + (vx * k) / steps, y = y0 + (vy * k) / steps;
      for (let j = 0; j < m.ny; j++) for (let i = 0; i < m.nx; i++) {
        const d = Math.hypot(i * m.cw + m.cw / 2 - x, m.y0 + j * m.cw + m.cw / 2 - y);
        if (d < 16) m.cur[j * m.nx + i] *= 0.4 + (d / 16) * 0.6;
      }
    }
  }
}

/** Advance the details by dt seconds. @param {string} region @param {string} seed @param {number} dt */
export function exoticStep(region, seed, dt) {
  if (!hasExotic(region)) return;
  const st = stateOf(region, seed);
  dt = Math.min(dt, 0.05);
  st.t += dt;
  // the isles: a spring toward where they float, damped so they bob a few times and settle; never pushed far
  for (const is of st.isles) {
    const k = 26, c = 1.6;
    is.vx += (-k * is.ox - c * is.vx) * dt; is.vy += (-k * is.oy - c * is.vy) * dt;
    is.ox += is.vx * dt; is.oy += is.vy * dt;
    const lim = 32, r = Math.hypot(is.ox, is.oy);
    if (r > lim) { is.ox *= lim / r; is.oy *= lim / r; is.vx *= 0.5; is.vy *= 0.5; }
  }
  st.ripples = st.ripples.filter((r) => st.t - r.t < 1.6);
  for (const m of st.morphs) m.cool -= dt;
  for (const c of st.crystals) { c.a += (c.target - c.a) * Math.min(1, dt * 5); c.hold -= dt; if (c.target < 0.5 && c.hold < -2.5) c.target = 1; }
  for (const f of st.falls) {
    f.left -= dt;
    if (f.mode === 'back' && f.left <= 0) { f.mode = 'race'; f.left = 2; }
    else if (f.mode === 'race' && f.left <= 0) f.mode = 'run';
    const target = f.mode === 'back' ? -55 : f.mode === 'race' ? 140 : 40;
    f.speed += (target - f.speed) * Math.min(1, dt * 4);
    f.phase += f.speed * dt;
  }
  const m = st.mist;
  if (m) for (let i = 0; i < m.cur.length; i++) m.cur[i] += (m.base[i] - m.cur[i]) * Math.min(1, dt * 0.18);
}

/** A pixel. */
function px(ctx, x, y, c, w = 1, h = 1) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); }
const rnd = (i, k = 0) => { const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return v - Math.floor(v); };

/** Bloom shapes (offsets from the stem's top), four per bloom. */
const BLOOMS = [
  [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]],
  [[0, 0], [-1, -1], [1, -1], [-1, 1], [1, 1], [0, -2], [-2, 0], [2, 0]],
  [[0, 0], [-1, 0], [1, 0], [-1, 1], [1, 1], [0, -1], [-2, 2], [2, 2]],
  [[0, 0], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [2, -1]],
];
const BLOOM_COLS = [['#ff8ad8', '#ffd0f0'], ['#7af0a8', '#e0ffe8'], ['#c8a4ff', '#f0e8ff']];

/**
 * Draw the details over the painting.
 * @param {CanvasRenderingContext2D} ctx @param {string} region @param {number} t @param {string} seed
 */
export function exoticDraw(ctx, region, t, seed) {
  if (!hasExotic(region)) return;
  const st = stateOf(region, seed), W = SCENE_W, H = SCENE_H;
  if (region === 'moonfen') {
    for (const r of st.ripples) {
      const age = st.t - r.t, R = 3 + age * 22, a = Math.max(0, 1 - age / 1.6);
      ctx.globalAlpha = a * 0.85;
      for (let k = 0; k < 28; k++) { const an = (k / 28) * Math.PI * 2; px(ctx, r.x + Math.cos(an) * R, r.y + Math.sin(an) * R * 0.4, '#bff4ff'); }
      if (age > 0.3) { const R2 = R - 7; for (let k = 0; k < 20; k++) { const an = (k / 20) * Math.PI * 2; px(ctx, r.x + Math.cos(an) * R2, r.y + Math.sin(an) * R2 * 0.4, '#6ad0ff'); } }
      ctx.globalAlpha = 1;
    }
  }
  if (region === 'skyshard') {
    // the wind streaming past, then the drifting isles bobbing on their springs
    for (let i = 0; i < 10; i++) { const x = ((t * (30 + i * 4) + rnd(i) * W) % (W + 40)) - 20, y = 20 + rnd(i, 1) * 120; px(ctx, x, y, 'rgba(255,255,255,0.55)', 6 + (i % 3) * 2, 1); }
    for (const is of st.isles) {
      const s = is.s, bob = Math.sin(t * 0.9 + s.x * 0.05) * 1.5;
      ctx.drawImage(canvasOf(s), Math.round(s.x + is.ox), Math.round(s.y + is.oy + bob));
    }
  }
  if (region === 'morphgrove') {
    for (const m of st.morphs) {
      const [c0, c1] = BLOOM_COLS[m.hue % BLOOM_COLS.length], sway = Math.round(Math.sin(t * 1.4 + m.x) * 0.6);
      px(ctx, m.x, m.y - 3, '#3a8a5a', 1, 3);
      for (const [dx, dy] of BLOOMS[m.shape]) px(ctx, m.x + dx + sway, m.y - 5 + dy, dx === 0 && dy === 0 ? c1 : c0);
      if (m.cool > 0) for (let k = 0; k < 4; k++) px(ctx, m.x + Math.cos(k * 1.6 + t * 6) * 4, m.y - 5 + Math.sin(k * 1.6 + t * 6) * 3, '#e0ffe8');
    }
  }
  if (region === 'veilhollow' && st.mist) {
    const m = st.mist;
    for (let j = 0; j < m.ny; j++) for (let i = 0; i < m.nx; i++) {
      const v = m.cur[j * m.nx + i];
      if (v < 0.05) continue;
      const drift = Math.sin(t * 0.3 + j * 0.7) * 3;
      ctx.fillStyle = `rgba(206,204,232,${(v * 0.42).toFixed(3)})`;
      ctx.fillRect(Math.round(i * m.cw + drift), m.y0 + j * m.cw, m.cw, m.cw);
    }
    for (let i = 0; i < 8; i++) { const x = (rnd(i) * W + Math.sin(t * 0.4 + i) * 20 + W) % W, y = 80 + rnd(i, 2) * 80 + Math.sin(t * 0.6 + i) * 6; if (Math.sin(t * 1.5 + i * 2) > 0) px(ctx, x, y, '#e8dcff'); }
  }
  if (region === 'ghostglass') {
    // bubbles rising, light drifting
    for (let i = 0; i < 16; i++) { const age = (t * 0.12 + rnd(i)) % 1, x = rnd(i, 1) * W + Math.sin(t * 2 + i) * 2, y = H - age * H; px(ctx, x, y, age < 0.85 ? 'rgba(200,240,255,0.7)' : 'rgba(255,255,255,0.9)'); }
    for (const c of st.crystals) {
      const s = c.s;
      ctx.globalAlpha = c.a;
      ctx.drawImage(canvasOf(s), s.x, s.y);
      ctx.globalAlpha = 1;
      if (c.a < 0.7) for (let k = 0; k < 6; k++) px(ctx, s.x + rnd(k, s.x) * s.w, s.y + ((t * 20 + k * 7) % s.h), 'rgba(200,250,255,0.8)');
    }
  }
  if (region === 'chronoglass') {
    for (const f of st.falls) {
      const L = f.y1 - f.y0, n = Math.max(6, Math.round(L / 3));
      for (let i = 0; i < n; i++) {
        const y = f.y0 + ((((f.phase + (i * L) / n) % L) + L) % L), x = f.x + Math.round(Math.sin(i * 1.7) * 1.2);
        px(ctx, x, y, f.mode === 'back' ? '#d8c8ff' : f.mode === 'race' ? '#fff0c0' : (i & 1 ? '#f0c878' : '#d8a858'));
      }
      px(ctx, f.x - 2, f.y1 - 1, '#e8c088', 5, 1);
    }
    // sand glimmers floating up, a few running the wrong way
    for (let i = 0; i < 12; i++) { const dir = i % 4 === 0 ? -1 : 1, age = ((t * 0.1 * dir + rnd(i)) % 1 + 1) % 1; px(ctx, rnd(i, 3) * W, H * 0.9 - age * 100, i % 3 ? '#ffe8b0' : '#d8b8ff'); }
  }
}
