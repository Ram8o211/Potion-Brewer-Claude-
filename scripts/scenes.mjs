// Visual QA for the procedural wild environments: renders regions of one or
// more worlds into PNGs (enlarged), optionally with the open ground tinted.
//
//   node scripts/scenes.mjs outdir [--region meadow] [--scale 2] [--ground] [seed ...]
import fs from 'node:fs';
import path from 'node:path';
import { sceneOf, SCENE_W, SCENE_H } from '../src/visual/env/scene.js';
import { encodePng } from './lib/png.mjs';

const args = process.argv.slice(2);
const out = args.shift() || '.';
const opt = (k, d) => { const i = args.indexOf(k); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const flag = (k) => { const i = args.indexOf(k); if (i < 0) return false; args.splice(i, 1); return true; };
const only = opt('--region', null), S = Number(opt('--scale', 2)), showGround = flag('--ground');
const seeds = args.length ? args : ['scenes'];
fs.mkdirSync(out, { recursive: true });
for (const seed of seeds) {
  for (const region of only ? [only] : ['meadow', 'forest', 'netherwood', 'river', 'quarry', 'moonfen', 'crags']) {
    const t0 = performance.now();
    const sc = sceneOf(region, seed);
    const ms = performance.now() - t0;
    const big = new Uint8Array(SCENE_W * S * SCENE_H * S * 4);
    for (let y = 0; y < SCENE_H * S; y++) for (let x = 0; x < SCENE_W * S; x++) {
      const k0 = Math.floor(y / S) * SCENE_W + Math.floor(x / S), c = sc.pix.px[k0], k = (y * SCENE_W * S + x) * 4;
      let r = c & 255, g = (c >>> 8) & 255, b = (c >>> 16) & 255;
      if (showGround && sc.open[k0]) { r = (r + 255) / 2; b = b / 2; }
      big[k] = r; big[k + 1] = g; big[k + 2] = b; big[k + 3] = 255;
    }
    const file = path.join(out, `${region}-${seed}.png`);
    fs.writeFileSync(file, encodePng(SCENE_W * S, SCENE_H * S, big));
    console.log(`${file} ${ms.toFixed(0)} ms`);
  }
}
