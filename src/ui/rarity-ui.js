// Small shared pieces of interface for the species catalog: rarity and
// Arcane badges, native creature names, effect chips.

import { h } from './dom.js';
import { icon } from './icons.js';
import { RARITY } from '../materials/rarity.js';
import { EFFECT_BY_KEY } from '../alchemy/effects.js';

/** Names of the biomes' native creatures (game/biomes.js `creature`). */
export const CREATURE_NAMES = {
  fox: 'Fox', hare: 'Hare', otter: 'River Otter', beetle: 'Rock Beetle', cavemoth: 'Cave Moth', salamander: 'Salamander',
  wisp: 'Will-o’-Wisp', cloudray: 'Cloud Ray', mimic: 'Mimic Lizard', shroudmoth: 'Shroud Moth', axolotl: 'Spectral Axolotl', scarab: 'Hourglass Scarab',
};

/** A material's rarity (catalog species), or null. @param {any} m */
export const rarityOf = (m) => (m && m.wild && m.wild.rarity ? RARITY[/** @type {'common'} */ (m.wild.rarity)] : null);

/**
 * A compact rarity tag (and an Arcane one) for a catalog ingredient.
 * @param {any} m @param {{short?:boolean}} [o]
 */
export function rarityTag(m, o = {}) {
  const r = rarityOf(m);
  if (!r) return null;
  const tags = h('span', { class: 'rar-tags' },
    h('span', { class: `tag rarity r-${r.id}`, title: `${r.label}: ${r.visual}`, text: o.short ? r.label[0] : r.label }));
  if (m.wild.arcane) tags.appendChild(h('span', { class: 'tag arcane', title: 'Arcane: only Arcane ingredients can awaken past their threshold' }, icon('awaken', 'sm'), o.short ? '' : ' Arcane'));
  return tags;
}

/** Chips of a material's effects, strongest first. @param {any} m @param {number} [n] */
export function effectChips(m, n = 3) {
  const fx = Object.entries((m && m.effects) || {}).filter(([, v]) => Math.abs(v) >= 1).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, n);
  return fx.map(([k, v]) => h('span', { class: 'fx-chip', title: EFFECT_BY_KEY[k].label }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ` ${Math.round(v)}`));
}
