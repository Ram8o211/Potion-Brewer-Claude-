import test from 'node:test';
import assert from 'node:assert/strict';
import { interact, cutoffEffects, EFFECT_CUTOFF, NE, E } from '../src/alchemy/effects.js';

test('effects under 1% are switched to zero', () => {
  assert.equal(EFFECT_CUTOFF, 1);
  const e = new Float64Array(NE);
  e[E.VIT] = 0.99; e[E.STR] = 1; e[E.LOVE] = 5; e[E.ACID] = -0.6; e[E.FIRE] = -1.5;
  cutoffEffects(e);
  assert.equal(e[E.VIT], 0);
  assert.equal(e[E.STR], 1);
  assert.equal(e[E.LOVE], 5);
  assert.equal(e[E.ACID], 0);
  assert.equal(e[E.FIRE], -1.5);
});

test('interact leaves no trace below the cut-off', () => {
  const e = new Float64Array(NE);
  e[E.FIRE] = 10.5; e[E.FROST] = 10; // opposition leaves 0.5 fire
  e[E.ACID] = -0.4; e[E.ARC] = 0.8; e[E.TRANS] = 30;
  interact(e, []);
  for (let k = 0; k < NE; k++) assert.ok(e[k] === 0 || Math.abs(e[k]) >= 1, `channel ${k} = ${e[k]}`);
  assert.equal(e[E.FIRE], 0);
  assert.equal(e[E.TRANS], 30);
});
