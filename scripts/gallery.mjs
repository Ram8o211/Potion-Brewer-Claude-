// Visual QA for the procedural species: renders every wild ingredient of one
// or more worlds — sprout, ripe, mature, three more variants of it, the
// mature plant on each of its other mounts (hanging, on a rock face or a
// trunk), closed, its icon and the four cauldron pieces — into one enlarged
// PNG sheet, a row per species.
//
//   node scripts/gallery.mjs out.png [seed ...] [--family flower] [--scale 4]
import fs from 'node:fs';
import { generateWorld } from '../src/materials/generator.js';
import { identityOf } from '../src/visual/identity.js';
import { describe } from '../src/visual/descriptor.js';
import { plantFrame, iconFrame, pieceFrame, Pixels } from '../src/visual/render.js';
import { FAMILIES } from '../src/visual/families/index.js';
import { familyOf } from '../src/visual/taxonomy.js';
import { mountsOfForm, frameMount } from '../src/visual/growth.js';
import { encodePng } from './lib/png.mjs';

const args = process.argv.slice(2);
const out = args.shift() || 'gallery.png';
const opt = (k, dflt) => { const i = args.indexOf(k); if (i < 0) return dflt; const v = args[i + 1]; args.splice(i, 2); return v; };
const fam = opt('--family', null), scale = Number(opt('--scale', 3)), only = opt('--key', null);
const seeds = args.length ? args : ['gallery'];

const BG = { forest: [46, 74, 40], netherwood: [24, 26, 40], meadow: [86, 128, 60], river: [70, 96, 92], quarry: [112, 98, 84], moonfen: [26, 34, 48], crags: [48, 30, 30] };
const rows = [];
for (const seed of seeds) {
  const world = generateWorld(seed);
  for (const id of world.wild) {
    const m = /** @type {any} */ (world.materials.find((x) => x.id === id));
    if (only && m.wild.key !== only) continue;
    if (fam && familyOf(m.wild.shape) !== fam) continue;
    if (!FAMILIES[familyOf(m.wild.shape)]) continue;
    const d = describe(m.vis || identityOf(m, seed));
    /** @type {any[]} */
    const cells = [plantFrame(d, 0), plantFrame(d, 1), plantFrame(d, 2), plantFrame(d, 2, { variant: 1 }), plantFrame(d, 2, { variant: 2 }), plantFrame(d, 2, { variant: 3 })];
    for (const mount of new Set(mountsOfForm(m.wild.shape).map(([k]) => frameMount(k)))) if (mount !== 'ground') cells.push({ ...plantFrame(d, 2, { mount }), mount });
    if (m.wild.dawn || m.wild.dusk) cells.push(plantFrame(d, 2, { closed: true }));
    cells.push(iconFrame(d));
    for (let v = 0; v < 4; v++) cells.push({ pix: pieceFrame(d, v).pix, ax: 20, ay: 40, glints: [] });
    rows.push({ cells, bg: BG[m.wild.region] || [40, 40, 40] });
  }
}
const CELL = 64, W = CELL * 14, H = CELL * rows.length;
const sheet = new Pixels(W, Math.max(1, H));
rows.forEach((r, j) => {
  const bg = (255 << 24 | r.bg[2] << 16 | r.bg[1] << 8 | r.bg[0]) >>> 0;
  sheet.rect(0, j * CELL, W, CELL, bg);
  r.cells.forEach((/** @type {any} */ c, i) => {
    sheet.rect(i * CELL, j * CELL + CELL - 1, CELL, 1, 0xff000000);
    // a hanging plant from the top of its cell, one on a wall from its left side, the rest standing on its floor
    const x = c.mount === 'wall' ? i * CELL + 3 - c.ax : i * CELL + Math.round(CELL / 2 - c.ax), y = c.mount === 'hang' ? j * CELL + 2 - c.ay : c.mount === 'wall' ? j * CELL + CELL / 2 - c.ay : j * CELL + CELL - 4 - c.ay;
    if (c.mount) sheet.rect(c.mount === 'wall' ? i * CELL : i * CELL, j * CELL, c.mount === 'wall' ? 2 : CELL, c.mount === 'wall' ? CELL : 1, 0xff504040);
    sheet.draw(c.pix, x, y);
  });
});
const S = scale, big = new Uint8Array(W * S * H * S * 4);
for (let y = 0; y < H * S; y++) for (let x = 0; x < W * S; x++) {
  const c = sheet.px[Math.floor(y / S) * W + Math.floor(x / S)], k = (y * W * S + x) * 4;
  big[k] = c & 255; big[k + 1] = (c >>> 8) & 255; big[k + 2] = (c >>> 16) & 255; big[k + 3] = 255;
}
fs.writeFileSync(out, encodePng(W * S, H * S, big));
console.log(`${rows.length} species → ${out}`);
