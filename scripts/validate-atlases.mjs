// Validates the ingredient texture atlases against the species catalog.
//
//   node scripts/validate-atlases.mjs
//
// Checks that every registered species has every required asset (ordinary
// and Arcane sprite, ordinary and Arcane seed, four growth stages of each),
// that every reference resolves to a frame, that frames lie inside their
// atlas and never overlap (padding included), that backgrounds are
// transparent and alpha is crisp (fully opaque or fully transparent: no
// anti-aliased edges), and that no frame is blank.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readPNG } from './lib/png-codec.mjs';
import { SPECIES_DATA } from '../src/materials/species-data.js';

const DIR = new URL('../assets/atlases/', import.meta.url);

/** @returns {{errors:string[], stats:{atlases:number, frames:number, species:number}}} */
export function validateAtlases() {
  const errors = [];
  const manifest = JSON.parse(readFileSync(new URL('manifest.json', DIR), 'utf8'));
  /** @type {Map<string, {atlas:string, f:any}>} */
  const frames = new Map();
  let total = 0;
  for (const a of manifest.atlases) {
    const meta = JSON.parse(readFileSync(new URL(a.meta, DIR), 'utf8'));
    const im = readPNG(new URL(a.image, DIR));
    if (im.w !== meta.width || im.h !== meta.height) errors.push(`${a.id}: PNG is ${im.w}×${im.h}, metadata says ${meta.width}×${meta.height}`);
    const pad = meta.padding ?? 0;
    const owner = new Int32Array(im.w * im.h).fill(-1);
    const list = Object.entries(meta.frames);
    // pass 1: every frame's own pixels belong to it alone
    list.forEach(([id, f], idx) => {
      total++;
      if (frames.has(id)) errors.push(`${id}: defined in two atlases`);
      frames.set(id, { atlas: a.id, f });
      if (f.x < 0 || f.y < 0 || f.x + f.w > im.w || f.y + f.h > im.h) { errors.push(`${id}: frame outside ${a.id}`); return; }
      if (!Array.isArray(f.pivot) || f.pivot[0] < 0 || f.pivot[0] >= f.w || f.pivot[1] < 0 || f.pivot[1] >= f.h) errors.push(`${id}: pivot outside frame`);
      for (const k of ['species', 'kind', 'rarity', 'biome']) if (!f[k]) errors.push(`${id}: missing ${k}`);
      if (typeof f.arcane !== 'boolean') errors.push(`${id}: missing arcane flag`);
      let opaqueN = 0, clash = false;
      for (let y = f.y; y < f.y + f.h; y++) for (let x = f.x; x < f.x + f.w; x++) {
        const k = y * im.w + x;
        if (owner[k] >= 0 && !clash) { errors.push(`${id}: overlaps ${list[owner[k]][0]}`); clash = true; }
        owner[k] = idx;
        const al = im.px[k] >>> 24;
        if (al && al !== 255 && !clash) { errors.push(`${id}: soft alpha ${al} at ${x},${y}`); clash = true; }
        if (al) opaqueN++;
      }
      if (!opaqueN) errors.push(`${id}: blank frame`);
      // transparent background: the frame is not a solid block (an hourglass may fill its corners, never its sides)
      if (opaqueN >= f.w * f.h) errors.push(`${id}: no transparent background`);
    });
    // pass 2: the padding ring round each frame is clear and reaches no other frame
    list.forEach(([id, f], idx) => {
      for (let y = f.y - pad; y < f.y + f.h + pad; y++) for (let x = f.x - pad; x < f.x + f.w + pad; x++) {
        if (x < 0 || y < 0 || x >= im.w || y >= im.h) continue;
        if (x >= f.x && y >= f.y && x < f.x + f.w && y < f.y + f.h) continue;
        const k = y * im.w + x;
        if (owner[k] >= 0 && owner[k] !== idx) { errors.push(`${id}: padding reaches ${list[owner[k]][0]}`); return; }
        if (im.px[k] >>> 24) { errors.push(`${id}: opaque pixel in its padding`); return; }
      }
    });
    // nothing drawn outside the frames
    for (let k = 0; k < im.px.length; k++) if (owner[k] < 0 && im.px[k] >>> 24) { errors.push(`${a.id}: stray pixel at ${k % im.w},${Math.floor(k / im.w)}`); break; }
  }
  const need = (key, id, kind, arcane, stage) => {
    const got = frames.get(id);
    if (!got) { errors.push(`${key}: missing asset ${id}`); return; }
    const f = got.f;
    if (f.species !== key) errors.push(`${id}: species ${f.species}, expected ${key}`);
    if (f.kind !== kind) errors.push(`${id}: kind ${f.kind}, expected ${kind}`);
    if (f.arcane !== arcane) errors.push(`${id}: arcane ${f.arcane}, expected ${arcane}`);
    if (stage !== undefined && f.stage !== stage) errors.push(`${id}: stage ${f.stage}, expected ${stage}`);
  };
  for (const sp of SPECIES_DATA) {
    const m = manifest.species[sp.key];
    if (!m) { errors.push(`${sp.key}: not in the manifest`); continue; }
    need(sp.key, m.sprite, 'sprite', false);
    need(sp.key, m.arcane, 'sprite', true);
    need(sp.key, m.seed, 'seed', false);
    need(sp.key, m.seedArcane, 'seed', true);
    if (!Array.isArray(m.stages) || m.stages.length !== 4) errors.push(`${sp.key}: needs four growth stages`);
    else m.stages.forEach((id, i) => need(sp.key, id, 'stage', false, i));
    if (!Array.isArray(m.stagesArcane) || m.stagesArcane.length !== 4) errors.push(`${sp.key}: needs four Arcane growth stages`);
    else m.stagesArcane.forEach((id, i) => need(sp.key, id, 'stage', true, i));
    const f = frames.get(m.sprite)?.f;
    if (f && (f.rarity !== sp.rarity || f.biome !== sp.biome)) errors.push(`${sp.key}: atlas metadata disagrees with the catalog (rarity/biome)`);
  }
  for (const key of Object.keys(manifest.species)) if (!SPECIES_DATA.some((s) => s.key === key)) errors.push(`${key}: in the manifest but not in the catalog`);
  return { errors, stats: { atlases: manifest.atlases.length, frames: total, species: Object.keys(manifest.species).length } };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { errors, stats } = validateAtlases();
  if (errors.length) { console.error(errors.slice(0, 50).join('\n')); console.error(`${errors.length} problem(s)`); process.exit(1); }
  console.log(`atlases ok: ${stats.atlases} atlases, ${stats.frames} frames, ${stats.species} species`);
}
