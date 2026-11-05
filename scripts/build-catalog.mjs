// Builds the permanent ingredient species catalog (src/materials/species-data.js)
// from the authored table below and the rarity rules (src/materials/rarity.js).
//
//   node scripts/build-catalog.mjs          write the catalog
//   node scripts/build-catalog.mjs --check  fail if the committed catalog differs
//
// The authored part is each species' identity: its biome and place on the
// ingredient sheet (art/ingredients/), name, morphology, fixed rarity and
// dominant effect. Its numbers — magnitudes, secondary effects, Arcane
// threshold and gain, physical properties — are drawn here once, from a
// stream seeded by its key, within its tier's explicit constraints, then
// committed: a species' magic never changes between worlds, saves or
// regenerations. Every generated species is validated before writing.

import { writeFileSync, readFileSync } from 'node:fs';
import { Rng } from '../src/core/rng.js';
import { RARITY, ARCANE, validateSpecies, opposed } from '../src/materials/rarity.js';
import { BIOMES, BIOME_BY_ID } from '../src/game/biomes.js';

const OUT = new URL('../src/materials/species-data.js', import.meta.url);

// [slot on the biome's sheet block (0..9), key, name, morphology, rarity, dominant (default: the biome's; a trailing '-' for the
//  negative direction, i.e. alkaline), flavour, optional authored secondary effects (strongest first)]
/** @type {Record<string, any[][]>} */
const TABLE = {
  forest: [
    [0, 'silverleaf', 'Silverleaf', 'leaf', 'common', null, 'Soft silvery leaves prized by healers, with a frosty bite.'],
    [1, 'honeycap', 'Honeycap', 'fungus', 'common', null, 'A golden mushroom that smells of honey and warm bread: it heals, and its warmth cancels a frosty herb.', ['fire']],
    [2, 'dawnblossom', 'Dawnblossom', 'flower', 'uncommon', null, 'Pale pink flowers that open with the first light.'],
    [3, 'dewpear', 'Dewpear', 'fruit', 'uncommon', 'swiftness', 'A green pear so light and quick it seems to roll uphill.'],
    [4, 'heartwood-mandrake', 'Heartwood Mandrake', 'root', 'rare', null, 'A drowsy root with a face, grown from the heart of old oaks.'],
    [5, 'mossback-bark', 'Mossback Bark', 'bark', 'uncommon', null, 'Bark slabs furred with living moss that mends what it touches.'],
    [6, 'stagthorn-vine', 'Stagthorn Vine', 'vine', 'rare', null, 'A golden vine branching like antlers, rooted in fern hollows.'],
    [7, 'hearthnut', 'Hearthnut', 'stone', 'common', 'acidity-', 'Speckled brown nuts with a chalky, alkaline shell that settles acids.'],
    [8, 'heartberry', 'Heartberry', 'fruit', 'unique', null, 'A single heart-shaped fruit that beats faintly in the hand.'],
    [9, 'everbloom-chalice', 'Everbloom Chalice', 'fungus', 'legendary', null, 'A green cup-fungus that is always full of healing dew.'],
  ],
  meadow: [
    [0, 'meadow-daisy', 'Meadow Daisy', 'flower', 'common', null, 'Plain white daisies, the first love-charm every child learns.'],
    [1, 'goldenrush', 'Goldenrush Grass', 'grass', 'common', 'swiftness', 'Wind-combed golden grass that never stands still.'],
    [2, 'brightberry', 'Brightberry', 'berry', 'common', null, 'Glossy red berries, sweet and a little sour.'],
    [3, 'honeyclover', 'Honeyclover', 'flower', 'uncommon', null, 'Round golden clover heads humming with bees.'],
    [4, 'suncrown', 'Suncrown Flower', 'flower', 'uncommon', 'fire', 'A sunflower that keeps the day’s warmth in its seeds.'],
    [5, 'meadowcrystal', 'Meadowcrystal Shard', 'crystal', 'rare', null, 'A clear pink-hearted crystal pushed up among the grass roots.'],
    [6, 'prism-petal', 'Prism Petal', 'flower', 'rare', null, 'A single petal that splits the sun into every colour.'],
    [7, 'lovelace-orchid', 'Lovelace Orchid', 'flower', 'uncommon', null, 'A frilled cream-and-pink orchid that turns towards voices.'],
    [8, 'radiant-sunbloom', 'Radiant Sunbloom', 'flower', 'unique', null, 'A blossom shaped like the sun, warm with devotion.'],
    [9, 'eternal-rose', 'Eternal Rose', 'flower', 'legendary', null, 'A rose that has never wilted since it first opened.'],
  ],
  river: [
    [0, 'willowleaf', 'Willowleaf Sprig', 'leaf', 'common', null, 'Long drooping willow leaves, cold to the touch.'],
    [1, 'reedcap', 'Reedcap', 'fungus', 'common', 'death', 'A pale riverside mushroom with a grave chill about it.'],
    [2, 'riverlotus', 'Riverlotus', 'flower', 'uncommon', null, 'A white water-lily that floats on the coldest pools.'],
    [3, 'bubbleberry', 'Bubbleberry', 'berry', 'common', null, 'Blue berries full of icy juice that fizzes on the tongue.'],
    [4, 'tidebloom', 'Tidebloom', 'flower', 'uncommon', null, 'A cyan flower that opens and closes with the river’s flow.'],
    [5, 'streampearl', 'Streampearl Oyster', 'shell', 'rare', null, 'A freshwater mussel holding a pearl of frozen light.'],
    [6, 'frostlotus', 'Frostlotus', 'flower', 'rare', null, 'A lotus whose petals are rimed with frost even in summer.'],
    [7, 'rimefeather', 'Rimefeather Reed', 'grass', 'uncommon', 'swiftness', 'Blue reeds that bend and spring back faster than the eye.'],
    [8, 'nixie-torc', 'Nixie Torc', 'relic', 'unique', null, 'A ring of river-gold the nixies leave on the bank, ice-cold.'],
    [9, 'everfrost-pearlbloom', 'Everfrost Pearlbloom', 'flower', 'legendary', null, 'A crystalline flower around a pearl that never thaws.'],
  ],
  quarry: [
    [0, 'stonewort', 'Stonewort', 'flower', 'common', null, 'Tough little white flowers rooted in cracks of the rock.'],
    [1, 'quarrycap', 'Quarrycap', 'fungus', 'common', null, 'A stout tan mushroom that grows on the spoil heaps.'],
    [2, 'ironbloom', 'Ironbloom Shrub', 'flower', 'uncommon', null, 'Spiky red leaves stiff as iron filings.'],
    [3, 'stoneberry', 'Stoneberry', 'berry', 'common', 'acidity', 'Hard purple berries that etch the stone they fall on.'],
    [4, 'orebud', 'Orebud Cluster', 'crystal', 'uncommon', null, 'Amber crystals budding from grey rock like seeds.'],
    [5, 'ferric-crystal', 'Ferric Crystal', 'crystal', 'rare', null, 'Smoky iron-grey prisms, heavy as a hammer head.'],
    [6, 'gravelpod', 'Gravelpod', 'stone', 'uncommon', null, 'Lumpy mauve pods that crack open into gravel.'],
    [7, 'ammonite-coil', 'Ammonite Coil', 'stone', 'rare', null, 'A spiral stone, the strength of ages curled inside.'],
    [8, 'emberheart-geode', 'Emberheart Geode', 'crystal', 'unique', null, 'A geode with a violet fire burning at its core.'],
    [9, 'titan-root', 'Titan Root', 'root', 'legendary', null, 'Golden roots that split boulders as they grow.'],
  ],
  netherwood: [
    [0, 'nethercap', 'Nethercap', 'fungus', 'common', null, 'A violet spotted toadstool glowing in the cavern dark.'],
    [1, 'gloommoss', 'Gloommoss Tuft', 'moss', 'common', null, 'Teal moss that sweats a bitter, tingling dew.'],
    [2, 'umbrabell', 'Umbrabell', 'flower', 'uncommon', null, 'Drooping violet bells that ring with spores.'],
    [3, 'shadefruit', 'Shadefruit', 'berry', 'common', 'death', 'Dusky purple berries that taste of the grave.'],
    [4, 'sporelantern', 'Sporelantern', 'vine', 'uncommon', null, 'Glowing yellow-green pods hanging in pairs from a vine.'],
    [5, 'wraithvine', 'Wraithvine', 'vine', 'uncommon', 'death', 'A grey creeping vine that withers what it wraps.'],
    [6, 'nightbloom-lotus', 'Nightbloom Lotus', 'flower', 'legendary', null, 'A great violet lotus that opens only in perfect darkness.'],
    [7, 'umbral-amethyst', 'Umbral Amethyst', 'crystal', 'rare', null, 'Purple crystals grown on poisoned water.'],
    [8, 'thornhalo', 'Thornhalo', 'relic', 'unique', null, 'A ring of black thorns that grows around nothing at all.'],
    [9, 'venomlily', 'Venomlily', 'flower', 'rare', null, 'A pale pink lily, beautiful and deadly to touch.'],
  ],
  crags: [
    [0, 'emberleaf', 'Emberleaf Herb', 'leaf', 'common', null, 'Red leaves that crackle and smoke when crushed.'],
    [1, 'cindershroom', 'Cindershroom', 'fungus', 'common', null, 'A soot-brown mushroom that grows on warm ash.'],
    [2, 'firebramble', 'Firebramble', 'berry', 'common', null, 'Fiery red berries on a thorny bramble.'],
    [3, 'sulfurvine', 'Sulfurvine Pods', 'vine', 'uncommon', 'acidity', 'Yellow pods that burst with stinking sulphur.'],
    [4, 'flamecrest', 'Flamecrest Flower', 'flower', 'rare', null, 'A blossom of living flame that never burns down.'],
    [5, 'blazestone', 'Blazestone Crystal', 'crystal', 'rare', null, 'Red crystals that hold the heat of the magma.'],
    [6, 'phoenix-heartseed', 'Phoenix Heartseed', 'seedpod', 'unique', null, 'A seed wrapped in flame, said to fall from a phoenix.'],
    [7, 'ashcactus', 'Ashcactus', 'herb', 'uncommon', null, 'A squat cactus crowned with orange blooms.'],
    [8, 'everburning-sunheart', 'Everburning Sunheart', 'flower', 'legendary', null, 'A burst of sunfire that has burned since the mountain was born.'],
    [9, 'cinderpod', 'Cinderpod', 'stone', 'uncommon', 'strength', 'A dark rock egg veined with cooling lava.'],
  ],
  moonfen: [
    [0, 'moonreed', 'Moonreed Frond', 'grass', 'common', null, 'Silver fronds that catch the moonlight and keep it.'],
    [1, 'fenmilk-cap', 'Fenmilk Cap', 'fungus', 'common', 'frost', 'A pale blue mushroom weeping cold milk.'],
    [2, 'duskbell', 'Duskbell', 'flower', 'uncommon', null, 'Lavender bells that ring only at dusk.'],
    [3, 'dreamberry', 'Dreamberry', 'berry', 'common', 'love', 'Purple berries that bring dreams of someone dear.'],
    [4, 'moonlotus', 'Moonlotus', 'flower', 'rare', null, 'A pink lotus with a lamp of moonlight at its heart.'],
    [5, 'sleepglass', 'Sleepglass Shard', 'crystal', 'uncommon', null, 'A blue crystal shard that hums when held to the ear.'],
    [6, 'moonveil-bloom', 'Moonveil Bloom', 'flower', 'rare', null, 'A violet water flower veiled in silver light.'],
    [7, 'mirepod-shell', 'Mirepod Shell', 'shell', 'uncommon', null, 'A spiral snail shell from the bog, pearly inside.'],
    [8, 'wisp-reliquary', 'Wisp Reliquary', 'relic', 'unique', null, 'A golden curl of bog-iron around a captured wisp-light.'],
    [9, 'starfall-lotus', 'Starfall Lotus', 'flower', 'legendary', null, 'A deep violet lotus that bloomed where a star fell.'],
  ],
  skyshard: [
    [0, 'skyspray', 'Skyspray Herb', 'herb', 'common', null, 'White sky-daisies that float an inch above the soil.'],
    [1, 'cloudcap', 'Cloudcap', 'fungus', 'common', null, 'A puffy white mushroom light as a cloud.'],
    [2, 'airstar', 'Airstar Flower', 'flower', 'uncommon', null, 'Star-shaped flowers that turn in the wind like vanes.'],
    [3, 'skyberry', 'Skyberry', 'berry', 'common', 'swiftness', 'Blue berries that fall upward when shaken loose.'],
    [4, 'updraft-seedwing', 'Updraft Seedwing', 'seedpod', 'rare', null, 'A golden winged seed that rides every updraft.'],
    [5, 'zephyr-starbloom', 'Zephyr Starbloom', 'flower', 'uncommon', null, 'A pale star flower whose leaves are feather-light.'],
    [6, 'featherpetal', 'Featherpetal', 'flower', 'rare', null, 'A pink blossom with petals like down feathers.'],
    [7, 'skyshard-geode', 'Skyshard Geode', 'crystal', 'unique', null, 'An open geode of floating violet crystal.'],
    [8, 'windfern', 'Windfern', 'leaf', 'uncommon', null, 'Bright green fronds that lift any soil they grow in.'],
    [9, 'cloudprism', 'Cloudprism Crystal', 'crystal', 'legendary', null, 'A crystal of solid sky that weighs less than nothing.'],
  ],
  morphgrove: [
    [0, 'morphleaf', 'Morphleaf Sprig', 'leaf', 'common', null, 'Leaves that never grow the same shape twice.'],
    [1, 'shapecap', 'Shapecap', 'fungus', 'common', null, 'A mushroom whose cap shifts from round to fluted.'],
    [2, 'twinsprout', 'Twinsprout', 'herb', 'common', 'vitality', 'A sprout that is two seedlings one moment, one the next.'],
    [3, 'graftberry', 'Graftberry', 'berry', 'uncommon', null, 'Cherries that ripen into whatever fruit is near.'],
    [4, 'formblossom', 'Formblossom', 'flower', 'uncommon', null, 'A ringed pink flower rearranging its own petals.'],
    [5, 'mimic-eye', 'Mimic Eye', 'relic', 'rare', null, 'A mossy stone eye that copies what it looks at.'],
    [6, 'crownbloom', 'Crownbloom', 'flower', 'unique', null, 'A golden crown of petals with a violet heart.'],
    [7, 'shifting-root', 'Shifting Root', 'root', 'uncommon', null, 'A root that crawls to a new place every night.'],
    [8, 'splice-bud', 'Splice Bud', 'flower', 'rare', null, 'A tight bud of many plants grafted into one.'],
    [9, 'polymorph-lotus', 'Polymorph Lotus', 'flower', 'legendary', null, 'A prismatic lotus that is every flower at once.'],
  ],
  veilhollow: [
    [0, 'veilfern', 'Veilfern Frond', 'leaf', 'common', null, 'Lilac fern fronds you only see from the corner of the eye.'],
    [1, 'hollowcap', 'Hollowcap', 'fungus', 'common', null, 'A violet mushroom that leaves no shadow.'],
    [2, 'ghostbud', 'Ghostbud', 'flower', 'uncommon', null, 'Translucent white tulips, there and then not.'],
    [3, 'veilberry', 'Veilberry', 'berry', 'common', 'death', 'Dusky berries with a grave, numbing juice.'],
    [4, 'hollowbloom', 'Hollowbloom', 'flower', 'uncommon', null, 'A pale pink flower whose middle you can see through.'],
    [5, 'veilglass', 'Veilglass Crystal', 'crystal', 'rare', null, 'A violet crystal that bends the light around itself.'],
    [6, 'shroud-orchid', 'Shroud Orchid', 'flower', 'uncommon', null, 'An orchid wrapped in a veil of mist.'],
    [7, 'mistpebble', 'Mistpebble', 'stone', 'rare', null, 'Purple pebbles that fog over when looked at.'],
    [8, 'eclipse-eye', 'Eclipse Eye', 'relic', 'legendary', null, 'A black orb ringed with golden light, the eye of an eclipse.'],
    [9, 'veil-circlet', 'Veil Circlet', 'relic', 'unique', null, 'A thorny circlet that hides whoever holds it.'],
  ],
  ghostglass: [
    [0, 'reefmoss', 'Reefmoss Coral', 'coral', 'common', null, 'Teal coral fronds that sway in water that is not there.'],
    [1, 'glasscap', 'Glasscap', 'fungus', 'common', null, 'A glassy mushroom you can see the reef through.'],
    [2, 'coralberry', 'Coralberry', 'berry', 'common', 'frost', 'Cold red berries clustered like coral polyps.'],
    [3, 'reefbud', 'Reefbud', 'flower', 'uncommon', null, 'A pink bud that opens underwater only.'],
    [4, 'ghostglass-coral', 'Ghostglass Coral', 'coral', 'rare', null, 'Blue-white coral that drifts through solid rock.'],
    [5, 'pearlshell', 'Pearlshell Oyster', 'shell', 'uncommon', null, 'An oyster whose pearl phases in and out of its shell.'],
    [6, 'spectral-anemone', 'Spectral Anemone', 'coral', 'rare', null, 'A magenta anemone of light rather than flesh.'],
    [7, 'shellfern', 'Shellfern Frond', 'leaf', 'uncommon', null, 'Pale fern fronds that grow on old shells.'],
    [8, 'phantom-pearl', 'Phantom Pearl', 'shell', 'unique', null, 'A violet pearl in a setting of blue nacre, half not here.'],
    [9, 'ghostcrown-coral', 'Ghostcrown Coral', 'coral', 'legendary', null, 'A crown of magenta coral that passes through anything.'],
  ],
  chronoglass: [
    [0, 'timeweed', 'Timeweed Sprig', 'grass', 'common', null, 'Golden weeds that grow backward at noon.'],
    [1, 'sandskirt-cap', 'Sandskirt Cap', 'fungus', 'common', null, 'A sandy mushroom ringed like an old tree.'],
    [2, 'hourberry', 'Hourberry', 'berry', 'common', 'swiftness', 'Orange berries that ripen in an hour and rot in a minute.'],
    [3, 'chronovine', 'Chronovine', 'vine', 'uncommon', null, 'A vine that grows pocket-watch fruit.'],
    [4, 'epochbloom', 'Epochbloom', 'flower', 'rare', null, 'A flower with a clock face that tells the hour it was picked.'],
    [5, 'chronoglass-shard', 'Chronoglass Shard', 'crystal', 'uncommon', null, 'A violet shard of glass fused by time, not heat.'],
    [6, 'pendulum-pods', 'Pendulum Pods', 'vine', 'uncommon', null, 'Golden pods swinging on a branch in perfect time.'],
    [7, 'sundial-stone', 'Sundial Stone', 'relic', 'rare', null, 'A weathered sundial that casts tomorrow’s shadow.'],
    [8, 'aeon-circlet', 'Aeon Circlet', 'relic', 'unique', null, 'A golden circlet of hours set with sand-glass gems.'],
    [9, 'hourglass-of-ages', 'Hourglass of Ages', 'relic', 'legendary', null, 'An hourglass whose sand has fallen since the first day.'],
  ],
};

/** Morphology → physical template, legacy sprite/physics shape, gathering method, extraction, garden bed. */
const MORPH = {
  leaf: { shape: 'leaf', density: 0.72, hardness: 0.22, sol: 0.18, solT: 0.0015, gather: 'pick', steep: ['water', [40, 50], [80, 90]], bed: 'soil', botanical: true },
  herb: { shape: 'sprig', density: 0.74, hardness: 0.2, sol: 0.17, solT: 0.0015, gather: 'pick', steep: ['water', [40, 50], [80, 90]], bed: 'soil', botanical: true },
  grass: { shape: 'reed', density: 0.7, hardness: 0.25, sol: 0.16, solT: 0.0015, gather: 'scrape', steep: ['water', [35, 40], [80, 85]], bed: 'soil', botanical: true },
  flower: { shape: 'flower', density: 0.62, hardness: 0.15, sol: 0.2, solT: 0.001, gather: 'pick', steep: ['water', [30, 35], [65, 70]], bed: 'soil', botanical: true },
  fruit: { shape: 'berry', density: 0.98, hardness: 0.12, sol: 0.22, solT: 0.0012, gather: 'pick', steep: ['water', [30, 35], [60, 65]], bed: 'soil', botanical: true },
  berry: { shape: 'berry', density: 0.98, hardness: 0.12, sol: 0.22, solT: 0.0012, gather: 'pick', steep: ['water', [30, 35], [60, 65]], bed: 'soil', botanical: true },
  vine: { shape: 'bean', density: 0.9, hardness: 0.22, sol: 0.18, solT: 0.0015, gather: 'pick', steep: ['spirit', [25, 30], [55, 60]], bed: 'soil', botanical: true },
  seedpod: { shape: 'seed', density: 1.05, hardness: 0.3, sol: 0.15, solT: 0.0015, gather: 'pick', steep: ['water', [40, 45], [80, 85]], bed: 'soil', botanical: true },
  root: { shape: 'root', density: 1.08, hardness: 0.45, sol: 0.12, solT: 0.002, gather: 'dig', steep: ['water', [60, 70], [90, 100]], bed: 'soil', botanical: true },
  bark: { shape: 'bark', density: 0.88, hardness: 0.4, sol: 0.12, solT: 0.002, gather: 'scrape', steep: ['water', [45, 50], [85, 90]], bed: 'soil', botanical: true },
  moss: { shape: 'moss', density: 0.8, hardness: 0.2, sol: 0.16, solT: 0.0012, gather: 'scrape', steep: ['water', [15, 20], [45, 50]], bed: 'fungal', botanical: true },
  fungus: { shape: 'cap', density: 0.92, hardness: 0.22, sol: 0.17, solT: 0.0012, gather: 'pick', steep: ['water', [20, 25], [55, 60]], bed: 'fungal', botanical: true },
  crystal: { shape: 'crystal', density: 1.8, hardness: 0.65, sol: 0.08, solT: 0.002, gather: 'mine', steep: ['spirit', [30, 35], [60, 65]], bed: 'crystal', botanical: false },
  stone: { shape: 'stone', density: 1.6, hardness: 0.6, sol: 0.06, solT: 0.003, gather: 'mine', steep: ['water', [75, 80], [150, 160]], bed: 'crystal', botanical: false },
  relic: { shape: 'nugget', density: 2.0, hardness: 0.7, sol: 0.06, solT: 0.003, gather: 'mine', steep: ['spirit', [55, 60], [110, 120]], bed: 'crystal', botanical: false },
  shell: { shape: 'shell', density: 1.6, hardness: 0.55, sol: 0.08, solT: 0.002, gather: 'pick', steep: ['water', [50, 55], [85, 90]], bed: 'tide', botanical: false },
  coral: { shape: 'crust', density: 1.4, hardness: 0.5, sol: 0.09, solT: 0.002, gather: 'scrape', steep: ['water', [40, 45], [80, 85]], bed: 'tide', botanical: false },
};

const BASE_PRICE = { common: 8, uncommon: 13, rare: 22, unique: 45, legendary: 110 };

/**
 * Effects with an opposite that cancels them in a brew (alchemy/effects.js
 * interact): fire–frost, life–death, vitality mends poison, acid–alkali,
 * weight–levitation, phasing–time. A species' strongest side effect is
 * always one of these, so an impure ingredient can be purified by mixing it
 * with one that carries the opposite — the craft of the lower tiers.
 */
const CANCELLABLE = ['fire', 'frost', 'death', 'toxicity', 'acidity', 'vitality', 'strength', 'levitation', 'temporal', 'phasing'];

/** Pick the secondary effects of a species: from its biome's minor pool, never opposing what it already carries. */
function secondaries(rng, biome, dominant, rarity) {
  const r = RARITY[rarity];
  const n = r.secondaries[0] === r.secondaries[1] ? r.secondaries[0] : rng.int(r.secondaries[0], r.secondaries[1]);
  const pool = rng.shuffle([...biome.minor, biome.effect].filter((e) => e !== dominant));
  const ok = (e, out) => !opposed(e, dominant) && !out.some((o) => o === e || opposed(o, e));
  const out = [];
  // the strongest: something an opposite can cancel (from the biome's own pool when it has one)
  const first = pool.find((e) => CANCELLABLE.includes(e) && ok(e, out)) || CANCELLABLE.find((e) => ok(e, out));
  if (n > 0 && first) out.push(first);
  for (const e of pool) {
    if (out.length >= n) break;
    if (ok(e, out)) out.push(e);
  }
  return out;
}

const round1 = (v) => Math.round(v * 10) / 10;

function buildSpecies() {
  const out = [];
  const seenKeys = new Set();
  for (const biome of BIOMES) {
    const rows = TABLE[biome.id];
    if (!rows || rows.length !== 10) throw new Error(`${biome.id}: needs 10 species`);
    for (const [slot, key, name, morph, rarity, domSpec, flavour, authored] of rows) {
      const neg = typeof domSpec === 'string' && domSpec.endsWith('-');
      const domOverride = neg ? domSpec.slice(0, -1) : domSpec;
      if (seenKeys.has(key)) throw new Error(`duplicate key ${key}`);
      seenKeys.add(key);
      const m = MORPH[morph];
      if (!m) throw new Error(`${key}: unknown morphology ${morph}`);
      const r = RARITY[rarity];
      const rng = new Rng('species:' + key);
      const dominant = domOverride || biome.effect;
      const mag = round1(rng.range(r.dominant[0] + 0.5, r.dominant[1] - 0.5));
      /** @type {Record<string, number>} */
      const fx = { [dominant]: neg ? -mag : mag };
      const secs = authored ? authored.slice() : secondaries(rng, biome, dominant, rarity);
      if (authored && RARITY[rarity].secondaries[1] > secs.length && secs.length < RARITY[rarity].secondaries[1]) {
        // an authored list may be completed with a trace from the biome's pool
        for (const e of secondaries(rng, biome, dominant, rarity)) if (secs.length < RARITY[rarity].secondaries[1] && !secs.includes(e) && !secs.some((o) => opposed(o, e)) && !opposed(e, dominant)) { secs.push(e); break; }
      }
      secs.forEach((e, i) => {
        // the strongest secondary (cancellable) reaches the tier's floor; a second one is a trace
        const lo = i === 0 ? r.ratio[0] + 0.01 : 0.03;
        const hi = i === 0 ? r.ratio[1] - 0.01 : 0.055;
        let v = Math.max(1, round1(mag * rng.range(Math.max(lo, 0.001), Math.max(hi, lo + 0.001))));
        if (v / mag > r.ratio[1]) v = Math.floor(mag * r.ratio[1] * 10) / 10;
        if (i === 0 && v / mag < r.ratio[0]) v = Math.ceil(mag * r.ratio[0] * 10) / 10;
        // acidity as a side effect is sometimes alkaline (it settles acids)
        // (and never the same direction as an acidic dominant, which would just add to it)
        fx[e] = e === 'acidity' && (rng.chance(0.4) || neg) ? -v : v;
      });
      const band = biome.arcaneSign < 0 ? ARCANE.coldThreshold : ARCANE.threshold;
      const thr = Math.round(biome.arcaneSign * rng.range(band[0], band[1]) / 10) * 10;
      const gain = Math.round(rng.range(ARCANE.gain[0], ARCANE.gain[1]) * 10) / 10;
      const sp = {
        key, name, biome: biome.id, category: biome.category, slot, morph, rarity, dominant, fx,
        arcane: { thr, gain },
        shape: m.shape, bed: m.bed, botanical: m.botanical,
        form: 'solid', density: Math.round(m.density * rng.range(0.96, 1.04) * 100) / 100, hardness: m.hardness,
        sol: Math.round(m.sol * rng.range(0.92, 1.08) * 1000) / 1000, solT: m.solT,
        gather: m.gather,
        // frost-bearing plants give their cold up only to ice-cold water (as Frostcap always did): a cold steep
        steep: dominant === 'frost' && m.botanical ? { into: 'water', lo: [1, 2], hi: [12, 14] } : { into: m.steep[0], lo: m.steep[1], hi: m.steep[2] },
        price: Math.round(BASE_PRICE[rarity] * rng.range(0.9, 1.15)),
        lore: flavour,
      };
      const problems = validateSpecies(sp);
      if (problems.length) throw new Error(problems.join('\n'));
      out.push(sp);
    }
  }
  return out;
}

const species = buildSpecies();
const header = `// GENERATED by scripts/build-catalog.mjs — do not edit by hand.
//
// The permanent ingredient species catalog: 120 species, ten per biome,
// each with one fixed rarity, one dominant effect, its rarity's secondary
// effects, an Arcane variant profile (threshold on the −1000…+1000 scale and
// awakening gain) and its physical template. See materials/catalog.js.

`;
const body = header + 'export const SPECIES_DATA = ' + JSON.stringify(species, null, 1).replace(/\n\s*/g, ' ').replace(/\{ "key"/g, '\n  { "key"').replace(/\] \}\]$/, ']}\n]') + ';\n';
if (process.argv.includes('--check')) {
  const cur = readFileSync(OUT, 'utf8');
  if (cur !== body) { console.error('species-data.js is out of date: run node scripts/build-catalog.mjs'); process.exit(1); }
  console.log(`catalog up to date (${species.length} species)`);
} else {
  writeFileSync(OUT, body);
  const count = {};
  for (const s of species) count[s.rarity] = (count[s.rarity] || 0) + 1;
  console.log(`wrote ${species.length} species`, count);
}
void BIOME_BY_ID;
