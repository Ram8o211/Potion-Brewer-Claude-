// Visual QA for the wild ingredients in place: every region of a world with
// its stands placed as the game places them (on the ground, hanging from
// branches and roofs, on rock faces and trunks), every plant grown, into
// one enlarged PNG per region.
//
//   node scripts/wilds.mjs outdir [--region forest] [--scale 2] [--marks] [seed ...]
//
// --marks outlines each plant's anchor (red: ground, cyan: hanging, yellow: wall or trunk).
import fs from 'node:fs';
import path from 'node:path';
import { sceneOf, SCENE_W, SCENE_H } from '../src/visual/env/scene.js';
import { PlantGround } from '../src/rendering/wild-scene.js';
import { silhouetteOf, plantFrameOf, mountsOf, variantOf, emitColour } from '../src/rendering/species-sprites.js';
import { GameState } from '../src/game/state.js';
import { REGIONS, depositStatus } from '../src/game/gathering.js';
import { Pixels } from '../src/visual/pixels.js';
import { encodePng } from './lib/png.mjs';

const args = process.argv.slice(2);
const out = args.shift() || '.';
const opt = (k, d) => { const i = args.indexOf(k); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const flag = (k) => { const i = args.indexOf(k); if (i < 0) return false; args.splice(i, 1); return true; };
const only = opt('--region', null), S = Number(opt('--scale', 2)), marks = flag('--marks');
const seeds = args.length ? args : ['wilds'];
fs.mkdirSync(out, { recursive: true });
for (const seed of seeds) {
  const st = GameState.create(seed, { tutorial: false });
  for (const r of REGIONS) {
    if (only && r.id !== only) continue;
    const sc = sceneOf(r.id, st.seed), ground = new PlantGround(r.id, st.seed);
    const plants = [];
    for (const d of st.deposits.filter((x) => x.region === r.id)) {
      const m = st.lookup(d.materialId);
      // a fuller stand than a fresh world's: as many plants again
      for (const p of depositStatus(st.gathering, d).plants) for (const k of ['', '+']) plants.push({ ...p, id: p.id + k, x: (p.x + (k ? 0.37 : 0)) % 1, m, variant: variantOf(p.id + k) });
    }
    const t0 = performance.now();
    const spots = ground.place(plants, (p, mount, flip) => silhouetteOf(p.m, { mount, variant: p.variant, flip }), (p) => mountsOf(p.m));
    const ms = performance.now() - t0;
    const pix = new Pixels(SCENE_W, SCENE_H);
    pix.px.set(sc.pix.px);
    const placed = plants.map((p) => ({ ...p, ...spots[p.id] })).sort((a, b) => a.y - b.y);
    const count = {};
    /** @type {number[][]} */
    const halos = [];
    for (const p of placed) {
      count[p.mount] = (count[p.mount] || 0) + 1;
      const f = plantFrameOf(p.m, 'mature', { mount: p.mount, variant: p.variant, flip: p.flip, light: p.light });
      const x = Math.round(p.x * SCENE_W), y = Math.round(p.y * SCENE_H);
      if (p.mount === 'ground') {
        // its shadow, cast to the right
        const hw = Math.max(3, Math.round(f.pix.w * 0.34)), ox = Math.round(hw * 0.3) + 1;
        for (const [dx, dy, w] of [[-hw + ox, -1, hw * 2], [-hw + ox + 1, 0, hw * 2 - 2], [-(hw >> 1) + ox, 1, hw]]) for (let i = 0; i < w; i++) pix.blend(x + dx + i, y + dy, 0xff10100a, 0.35);
      }
      pix.draw(f.pix, x - f.ax, y - f.ay);
      const c = emitColour(p.m);
      if (c) for (const [gx, gy] of f.glows.filter((_, i) => i % Math.ceil(f.glows.length / 8) === 0)) halos.push([x - f.ax + gx, y - f.ay + gy, ...c.match(/\d+/g).map(Number)]);
      if (marks) pix.set(x, y, p.mount === 'ground' ? 0xff0000ff : p.mount === 'hang' ? 0xffffff00 : 0xff00ffff);
    }
    // what glows lights its surroundings
    for (const [hx, hy, r, g, b] of halos) for (let j = -5; j <= 5; j++) for (let i = -5; i <= 5; i++) {
      const d = Math.hypot(i, j);
      if (d > 5) continue;
      const x = hx + i, y = hy + j, k = y * SCENE_W + x;
      if (x < 0 || y < 0 || x >= SCENE_W || y >= SCENE_H) continue;
      const c = pix.px[k], a = 0.17 * (1 - d / 5) ** 1.5;
      pix.px[k] = (0xff000000 | (Math.min(255, ((c >>> 16) & 255) + b * a) << 16) | (Math.min(255, ((c >>> 8) & 255) + g * a) << 8) | Math.min(255, (c & 255) + r * a)) >>> 0;
    }
    const big = new Uint8Array(SCENE_W * S * SCENE_H * S * 4);
    for (let y = 0; y < SCENE_H * S; y++) for (let x = 0; x < SCENE_W * S; x++) {
      const c = pix.px[Math.floor(y / S) * SCENE_W + Math.floor(x / S)], k = (y * SCENE_W * S + x) * 4;
      big[k] = c & 255; big[k + 1] = (c >>> 8) & 255; big[k + 2] = (c >>> 16) & 255; big[k + 3] = 255;
    }
    const file = path.join(out, `wilds-${r.id}-${seed}.png`);
    fs.writeFileSync(file, encodePng(SCENE_W * S, SCENE_H * S, big));
    console.log(`${file} ${placed.length} plants (${Object.entries(count).map(([k, v]) => `${v} ${k}`).join(', ')}) placed in ${ms.toFixed(0)} ms`);
  }
}
