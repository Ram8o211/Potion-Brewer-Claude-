// The game speaks of magic only: customers ask for magical effects, and
// ingredients, journal entries and awards are described by their magic,
// never by colour, weight, thickness, boiling points or other physical
// traits. Also: the haggle floor, the version label, and the guided order
// replayed in a shop that has already sold potions.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { GameState } from '../src/game/state.js';
import { INGREDIENT_SPECS } from '../src/materials/generator.js';
import { PROBLEMS, generateCommission } from '../src/game/commissions.js';
import { ARCHETYPES } from '../src/game/customers.js';
import { processEvent, modernizeJournal, JOURNAL } from '../src/game/journal.js';
import { ACHIEVEMENTS } from '../src/game/state.js';
import { startHaggle, ask } from '../src/game/haggle.js';
import { archetypeOf } from '../src/game/customers.js';
import { Rng } from '../src/core/rng.js';
import { PROP_KEYS } from '../src/alchemy/magic.js';
import { VERSION } from '../src/version.js';

/** Physical or chemical description of a material. */
const PHYSICAL = /\b(boil\w*|densit\w*|dense|colou?rs?|viscos\w*|thick\w*|thin|floats?|floating|light|heavy|syrup\w*|opaque|cloudy|clear|clarity|stabil\w*|vapou?r|melts?|melting|boiling point|g\/ml|cP|layers?|pink|red|green|black|blue|white|purple|golden|yellow)\b/i;
/** What a customer must never ask for: a trait of the potion that is not magic. */
const ASKS_PHYSICAL = /\b(colou?r\w*|densit\w*|viscos\w*|thick\w*|clear|cloudy|syrup\w*|stabil\w*|pink|red|blue|green|golden)\b|\bsomething (cold|hot|warm)\b/i;

test('ingredient lore describes magic only', () => {
  for (const s of INGREDIENT_SPECS) {
    assert.ok(!PHYSICAL.test(s.lore), `${s.role}: "${s.lore}"`);
  }
  // a fresh world carries the lore as each material's description
  const st = GameState.create('wording-1', { tutorial: false });
  for (const id of st.world.ingredients) assert.ok(!PHYSICAL.test(st.lookup(id).description), st.lookup(id).description);
});

test('customers ask only for magical effects', () => {
  for (const [key, list] of Object.entries(PROBLEMS)) {
    assert.ok(PROP_KEYS.includes(key));
    for (const p of list) {
      for (const l of p.lines) assert.ok(!ASKS_PHYSICAL.test(l), `"${l}"`);
      assert.ok(!PHYSICAL.test(p.title), p.title); // e.g. no 'Floating Oil'
    }
  }
  for (const a of ARCHETYPES) for (const l of [...a.pleased, ...a.displeased]) assert.ok(!PHYSICAL.test(l), l);
  // and every requirement of every request is one of the six properties
  const st = GameState.create('wording-2', { tutorial: false });
  for (let k = 0; k < 120; k++) {
    const com = generateCommission(st.commissionContext(), new Rng('w' + k), { tier: k % 5 });
    if (!com) continue;
    for (const r of com.requirements) assert.ok(PROP_KEYS.includes(r.key), r.key);
    assert.ok(!PHYSICAL.test(com.potionName), com.potionName);
  }
});

test('journal entries and awards speak of magic, never of an ingredient’s boiling point or colour', () => {
  const st = GameState.create('wording-3', { tutorial: false });
  const R = st.world.roles;
  const events = [];
  for (const id of st.world.ingredients) {
    events.push({ type: 'phase', to: 'gas', species: id, temp: 101 }, { type: 'phase', to: 'solid', species: id, temp: -4 }, { type: 'ignite', species: id });
  }
  events.push({ type: 'layers', a: R.water, b: R.witchoil }, { type: 'heatmix', a: R.water, b: R.witchoil }, { type: 'transmute' }, { type: 'fade' }, { type: 'crush' });
  const entries = [];
  for (const e of events) entries.push(...processEvent(st, e).entries);
  assert.ok(entries.length >= 7);
  // one entry for boiling, one for freezing and one for fire, whatever boiled, froze or burned
  assert.equal(entries.filter((e) => e.key === 'boil').length, 1);
  assert.equal(Object.keys(st.journal).filter((k) => /^(boil|freeze|fire):/.test(k)).length, 0);
  for (const e of entries) {
    assert.ok(!/°C/.test(e.text), e.text);
    assert.ok(!PHYSICAL.test(e.title) && !PHYSICAL.test(e.text), `${e.title} — ${e.text}`);
  }
  // (award names may be idioms about the player, like 'Green Fingers', but no boiling or phase talk)
  for (const a of ACHIEVEMENTS) assert.ok(!PHYSICAL.test(a.desc) && !/\b(boil\w*|vapou?r|melt\w*|densit\w*|viscos\w*)\b/i.test(a.name), `${a.name}: ${a.desc}`);
});

test('a save written by an earlier build is brought up to date: old lore and old journal wording are replaced', () => {
  const st = GameState.create('wording-4', { tutorial: false });
  const raw = JSON.parse(JSON.stringify(st.toJSON()));
  // what an earlier 2.0 build stored
  const sky = raw.world.materials.find((m) => m.archetype === 'skystone');
  sky.description = 'So light it floats. It lifts whatever drinks it.';
  raw.journal = {
    'boil:water': { key: 'boil:water', title: 'Well Water boils', text: 'It turned to vapour at about 101°C.', day: 2 },
    'boil:dew': { key: 'boil:dew', title: 'Dew boils', text: 'It turned to vapour at about 102°C.', day: 1 },
    'layers:water:witchoil': { key: 'layers:water:witchoil', title: 'Separate layers', text: 'They settle into layers.', day: 3 },
    crush: { key: 'crush', title: 'Smashing stones', text: 'ok', day: 1 },
  };
  const back = GameState.fromJSON(raw);
  assert.ok(!PHYSICAL.test(back.lookup('skystone').description), back.lookup('skystone').description);
  assert.deepEqual(Object.keys(back.journal).sort(), ['boil', 'crush', 'unbound:water:witchoil']);
  assert.equal(back.journal.boil.day, 1, 'the earliest discovery day is kept');
  assert.equal(back.journal.boil.text, JOURNAL.boil.text);
  for (const e of Object.values(back.journal)) assert.ok(!PHYSICAL.test(e.text) && !/°C/.test(e.text), e.text);
  // idempotent
  assert.deepEqual(modernizeJournal(back.journal, back.lookup), back.journal);
});

test('haggling never sells below the customer’s own offer', () => {
  const h = startHaggle({ value: 60 }, archetypeOf('farmer'));
  const offer = h.offer;
  const r = ask(h, Math.max(1, offer - 9));
  assert.equal(r.result, 'deal');
  assert.equal(r.price, offer, 'they pay what they offered, not the lower ask');
});

test('the version shown in the game is the package version', () => {
  const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(VERSION, pkg.version);
});

test('a blank Potion ID is never "out of date"; a written one is once something new is poured', () => {
  const st = GameState.create('wording-5', { tutorial: false });
  st.newBatch();
  st.touchBatch();
  assert.equal(st.idStale, false, 'nothing written yet');
  st.writeId('batch', { vitality: 20 });
  assert.equal(st.idStale, false);
  st.touchBatch();
  assert.equal(st.idStale, true);
});

test('the guided order can be replayed in a shop that has sold before; a shop from 1.x is told what changed', () => {
  const st = GameState.create('wording-6', { tutorial: false });
  st.stats.served = 12;
  const c = st.nextCustomer();
  assert.ok(c && !c.tutorial);
  st.startGuidedOrder();
  assert.equal(st.current, null, 'the browsing customer steps aside');
  const t = st.nextCustomer();
  assert.ok(t && t.tutorial, 'the tutorial customer comes in');
  // a genuine save of the previous release carries the note
  const v3 = JSON.parse(fs.readFileSync(new URL('./fixtures/save-v3.json', import.meta.url), 'utf8'));
  const old = GameState.fromJSON(v3);
  assert.equal(old.whatsNew, 3);
  assert.equal(GameState.fromJSON(JSON.parse(JSON.stringify(old.toJSON()))).whatsNew, 3, 'kept until the player has seen it');
});
