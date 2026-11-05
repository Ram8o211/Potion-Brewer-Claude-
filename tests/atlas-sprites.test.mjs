// The catalog species are drawn from the ingredient atlases: one identity
// in the wilds, in the menus and in the cauldron; Arcane specimens have
// their own (related) art; garden stages and seeds load from their atlases.
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateWorld, makeLookup } from '../src/materials/generator.js';
import { atlasFrame, spriteAsset, seedAsset, stageAsset, SPECIES_ASSETS, ATLASES, neededAtlases } from '../src/visual/atlas.js';
import { plantFrameOf, iconFrameOf, mountsOf, isAtlasMaterial } from '../src/rendering/species-sprites.js';
import { PIECE_ART, PIECE_KEYS, ensurePieces, pieceKeyOf, PIECE_CELL } from '../src/visual/pieces.js';
import { skinOf, hasPieces } from '../src/materials/shapes.js';
import { SPECIES, materialIdOf } from '../src/materials/catalog.js';

const world = generateWorld('atlas-sprites');
const lookup = makeLookup(world);
const colours = (pix) => { const s = new Set(); for (const c of pix.px) if (c >>> 24) s.add(c); return s; };

test('every catalog species has its sprite, its Arcane sprite, seeds and four stages of each, all loadable', () => {
  for (const s of SPECIES) {
    for (const arcane of [false, true]) {
      const f = atlasFrame(spriteAsset(s.key, arcane));
      assert.ok(f && f.pix.w >= 16 && f.pix.h >= 12, `${s.key}${arcane ? ' Arcane' : ''} sprite`);
      assert.ok(atlasFrame(seedAsset(s.key, arcane)), `${s.key} seed`);
      for (let k = 0; k < 4; k++) assert.ok(atlasFrame(stageAsset(s.key, arcane, k)), `${s.key} stage ${k}`);
    }
  }
  assert.equal(Object.keys(SPECIES_ASSETS).length, SPECIES.length);
});

test('one ingredient, one look: its plant in the wilds and its icon in the menus are the very same pixels', () => {
  for (const s of SPECIES.slice(0, 40)) {
    for (const arcane of [false, true]) {
      const m = lookup(materialIdOf(s.key, arcane));
      assert.ok(isAtlasMaterial(m));
      const icon = /** @type {any} */ (iconFrameOf(m)), plant = /** @type {any} */ (plantFrameOf(m, 'mature', { k: 2 }));
      assert.equal(icon.pix.hash(), plant.pix.hash(), `${m.name}: the wilds and the menus show the same sprite`);
      assert.deepEqual(mountsOf(m), [['ground', 1]]);
    }
  }
});

test('an Arcane specimen keeps its species’ silhouette but is visibly different', () => {
  for (const s of SPECIES) {
    const a = /** @type {any} */ (atlasFrame(spriteAsset(s.key, false))), b = /** @type {any} */ (atlasFrame(spriteAsset(s.key, true)));
    assert.notEqual(a.pix.hash(), b.pix.hash(), `${s.key}: Arcane art differs`);
    // related: about the same amount of drawing (a rim and sparkles add some; the sheet's Arcane drawings spread a little wider)
    const area = (pix) => pix.px.reduce((n, c) => n + (c >>> 24 ? 1 : 0), 0);
    const r = area(b.pix) / area(a.pix);
    assert.ok(r > 0.7 && r < 2.6, `${s.key}: a related silhouette (${r.toFixed(2)}× the ordinary area)`);
    // the arcane palette: a violet rim and luminous cyan runes the ordinary sprite does not have
    const ca = colours(a.pix), cb = colours(b.pix);
    const fresh = [...cb].filter((c) => !ca.has(c)).length;
    assert.ok(fresh >= 4, `${s.key}: Arcane colours of its own (${fresh})`);
  }
});

test('poured into the cauldron, an ingredient breaks into shards of its own sprite — the Arcane form into Arcane shards', () => {
  for (const s of SPECIES.filter((x, i) => i % 7 === 0)) {
    for (const arcane of [false, true]) {
      const m = lookup(materialIdOf(s.key, arcane));
      assert.ok(hasPieces(m), `${m.name} is poured as pieces`);
      const key = pieceKeyOf(m);
      assert.ok(PIECE_KEYS.includes(key));
      const masks = ensurePieces(key);
      assert.ok(masks && masks.length === 4, `${m.name}: four pieces`);
      const sprite = colours(/** @type {any} */ (atlasFrame(spriteAsset(s.key, arcane))).pix);
      const skin = skinOf(m, 0), row = Math.floor((skin - 1) / 4) * PIECE_CELL;
      let inSprite = 0, n = 0;
      for (let y = row; y < row + PIECE_CELL; y++) for (let x = 0; x < PIECE_CELL * 4; x++) {
        const c = PIECE_ART.px[y * PIECE_ART.width + x];
        if (!(c >>> 24)) continue;
        n++;
        if (sprite.has(c)) inSprite++;
      }
      assert.ok(n > 40 && inSprite === n, `${m.name}: every piece pixel comes from its sprite (${inSprite}/${n})`);
    }
  }
  // the ordinary and Arcane forms have pieces of their own
  const o = lookup(materialIdOf('silverleaf')), a = lookup(materialIdOf('silverleaf', true));
  assert.notEqual(skinOf(o, 0), skinOf(a, 0));
});

test('atlases load lazily: a fresh save needs its biome’s and its stores’ atlases, not every one', () => {
  const need = neededAtlases(['forest'], ['silverleaf']);
  assert.ok(need.length < ATLASES.length, `${need.length} of ${ATLASES.length}`);
  assert.ok(need.includes('seeds'));
  assert.ok(!need.some((id) => id.startsWith('growth')), 'growth stages load with the garden');
  assert.ok(!need.includes('ingredients-exotic-flora'), 'exotic sprites wait for an exotic biome');
  assert.ok(neededAtlases(['forest', 'moonfen'], []).includes('ingredients-exotic-flora'));
});
