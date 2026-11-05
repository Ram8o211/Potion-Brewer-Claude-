// Renders review sheets of the ingredient atlases (docs/screenshots/atlas-*.png):
// per biome, every species' ordinary and Arcane sprite, seeds and growth stages,
// on a dark backdrop at an integer nearest-neighbour scale.
//   node scripts/atlas-preview.mjs
import { readFileSync, mkdirSync } from 'node:fs';
import { readPNG, writePNG } from './lib/png-codec.mjs';
import { SPECIES_DATA } from '../src/materials/species-data.js';

const DIR = new URL('../assets/atlases/', import.meta.url);
const OUT = new URL('../docs/screenshots/', import.meta.url);
mkdirSync(OUT, { recursive: true });
const manifest = JSON.parse(readFileSync(new URL('manifest.json', DIR), 'utf8'));
const frames = new Map();
for (const a of manifest.atlases) {
  const meta = JSON.parse(readFileSync(new URL(a.meta, DIR), 'utf8')), im = readPNG(new URL(a.image, DIR));
  for (const [id, f] of Object.entries(meta.frames)) frames.set(id, { ...f, im });
}
const S = 3, CW = 64, CH = 58;
function sheet(name, rows, cols, cellAt) {
  const w = cols * CW * S, h = rows * CH * S, px = new Uint32Array(w * h).fill(0xff302624);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const id = cellAt(r, c);
    const f = id && frames.get(id);
    if (!f) continue;
    const ox = c * CW * S + Math.floor((CW - f.w) / 2) * S, oy = r * CH * S + (CH - 2 - f.h) * S;
    for (let y = 0; y < f.h; y++) for (let x = 0; x < f.w; x++) {
      const p = f.im.px[(f.y + y) * f.im.w + f.x + x];
      if (!(p >>> 24)) continue;
      for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) px[(oy + y * S + j) * w + ox + x * S + i] = p;
    }
  }
  writePNG(new URL(name, OUT), { w, h, px });
}
const biomes = [...new Set(SPECIES_DATA.map((s) => s.biome))];
// ordinary over Arcane, one row pair per biome
sheet('atlas-ordinary-vs-arcane.png', biomes.length * 2, 10, (r, c) => {
  const sp = SPECIES_DATA.filter((s) => s.biome === biomes[r >> 1]).sort((a, b) => a.slot - b.slot)[c];
  return sp && (r & 1 ? manifest.species[sp.key].arcane : manifest.species[sp.key].sprite);
});
// growth: seed, stages 0..3, mature — ordinary then Arcane — for one species of each biome
sheet('atlas-growth-stages.png', biomes.length, 12, (r, c) => {
  const sp = SPECIES_DATA.filter((s) => s.biome === biomes[r])[r % 10];
  const m = manifest.species[sp.key];
  const ord = [m.seed, ...m.stages, m.sprite], arc = [m.seedArcane, ...m.stagesArcane, m.arcane];
  return c < 6 ? ord[c] : arc[c - 6];
});
console.log('wrote docs/screenshots/atlas-*.png');
