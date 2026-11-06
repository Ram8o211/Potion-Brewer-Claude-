// The inventory: the whole storeroom at a glance, grouped by effect (each
// ingredient under its strongest one) or by rarity, rarest and strongest
// first. Each line puts its jar on the quick shelf at the cauldron, or takes
// it back off (game/bench.js), so the shelf holds just what the brew at hand
// needs.

import { h, btn, modal, clear, keepScroll } from './dom.js';
import { icon } from './icons.js';
import { rarityTag, effectChips } from './rarity-ui.js';
import { jarCanvas, openIngredient } from './panels.js';
import { inventoryGroups } from '../game/bench.js';
import { audio } from '../audio/audio.js';

/** How the inventory was last arranged (kept for the session). */
const view = { by: /** @type {'effect'|'rarity'} */ ('effect'), empty: false };

/** @param {number} s */
function amount(s) {
  return !isFinite(s) ? '∞' : s >= 1000 ? (s / 1000).toFixed(1) + ' L' : Math.round(s) + ' ml';
}

/** @param {any} lab */
export function openInventory(lab) {
  const st = lab.state;
  const tabs = h('div', { class: 'tabs inv-tabs' });
  const tools = h('div', { class: 'inv-tools' });
  const body = h('div', { class: 'inv-list' });
  const m = modal({ title: 'Inventory', body: [body], wide: true, cls: 'inventory' });
  m.el.insertBefore(tabs, m.body);
  m.el.insertBefore(tools, m.body);
  const stock = (id) => (lab.sandbox ? Infinity : st.stock(id));

  const render = () => {
    clear(tabs);
    for (const [k, label, ic] of /** @type {const} */ ([['effect', 'By effect', 'eye'], ['rarity', 'By rarity', 'gem']])) {
      tabs.appendChild(btn(label, () => { view.by = k; audio.play('select'); render(); }, { icon: ic, cls: view.by === k ? 'active' : '', act: 'inv-by-' + k }));
    }
    const pool = lab.shelfPool();
    const held = pool.filter((id) => stock(id) > 0);
    const shown = view.empty ? pool : held;
    const onShelf = st.bench.ids.filter((id) => pool.includes(id));
    const emptyOn = onShelf.filter((id) => !(stock(id) > 0));
    clear(tools).append(...[
      h('span', { class: 'small muted inv-count', text: `${held.length} held · ${onShelf.length} on the shelf` }),
      btn(view.empty ? 'Hide empty' : 'Show empty', () => { view.empty = !view.empty; render(); }, { cls: view.empty ? 'active' : '', title: 'Also list what you have run out of (and the shop’s reagents)', act: 'inv-empty' }),
      emptyOn.length ? btn('Clear empty jars', () => { for (const id of emptyOn) lab.setOnShelf(id, false); render(); }, { icon: 'trash', title: 'Take the jars you have run out of off the shelf', act: 'inv-tidy' }) : null,
      onShelf.length ? btn('Clear shelf', () => { for (const id of onShelf) lab.setOnShelf(id, false); render(); }, { icon: 'minus', title: 'Put every jar back in the storeroom', act: 'inv-clear' }) : null,
    ].filter(Boolean));
    keepScroll(m.body, () => {
      clear(body);
      if (!shown.length) { body.appendChild(h('div', { class: 'card parch small muted', text: 'The storeroom is empty. Gather in the Wilds, harvest the Garden or buy from the Shop.' })); return; }
      for (const g of inventoryGroups(shown, st.lookup, view.by)) {
        const sec = h('section', { class: 'inv-group', 'data-group': g.key },
          h('h3', { class: 'inv-head' }, icon(g.icon, 'sm'), ` ${g.label} `, h('span', { class: 'muted small', text: `(${g.ids.length})` })));
        for (const id of g.ids) sec.appendChild(line(id));
        body.appendChild(sec);
      }
    });
  };

  /** @param {string} id */
  const line = (id) => {
    const mat = st.lookup(id);
    const s = stock(id);
    const on = lab.onShelf(id);
    const pic = h('button', { class: 'inv-pic', title: 'Inspect', 'aria-label': 'Inspect ' + mat.name }, jarCanvas(mat, 16, 22));
    pic.addEventListener('click', () => openIngredient(lab, id, render));
    const fx = mat.remains ? [h('span', { class: 'muted', text: 'effects unknown — test it' })] : effectChips(mat, 4);
    const toggle = btn(on ? 'On shelf' : 'Shelf', () => { lab.setOnShelf(id, !on); audio.play('select'); render(); },
      { icon: on ? 'check' : 'plus', cls: 'inv-toggle' + (on ? ' active' : ''), title: on ? 'Take it off the quick shelf' : 'Put it on the quick shelf at the cauldron', act: 'shelf-' + id });
    return h('div', { class: 'item parch inv-item' + (s > 0 ? '' : ' locked') + (on ? ' on' : ''), 'data-id': id },
      pic,
      h('div', {},
        h('div', { class: 'title' }, mat.name, rarityTag(mat, { short: true })),
        h('div', { class: 'meta' }, ...(fx.length ? fx : [h('span', { class: 'muted', text: 'no magical effect' })])),
        h('div', { class: 'meta muted', text: s > 0 ? amount(s) : 'none left' })),
      toggle);
  };
  render();
  return m;
}
