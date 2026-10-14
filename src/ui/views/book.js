// The alchemist's book: recipes, the ingredients and their magic, the
// journal, awards and the sales ledger (with refunds).

import { h, btn, clear, coins } from '../dom.js';
import { icon } from '../icons.js';
import { audio } from '../../audio/audio.js';
import * as panels from '../panels.js';
import { PROPS, PROP_BY_KEY } from '../../alchemy/magic.js';
import { rgbToHex } from '../../core/color.js';

const TABS = [
  ['recipes', 'Recipes', 'book'], ['ingredients', 'Ingredients', 'leaf'], ['journal', 'Journal', 'scroll'],
  ['achievements', 'Awards', 'trophy'], ['sales', 'Sales', 'coin'],
];

export class BookView {
  /** @param {import('../lab.js').LabScreen} lab */
  constructor(lab) {
    this.lab = lab;
    this.el = h('section', { class: 'view view-book', 'data-view': 'book' });
    this.tab = 'recipes';
  }

  build() {
    const el = clear(this.el);
    this.tabs = h('div', { class: 'book-tabs', role: 'tablist' });
    this.body = h('div', { class: 'book-body' });
    el.append(this.tabs, this.body);
    this.refresh();
  }

  /** @param {string} t */
  open(t) {
    this.tab = t;
    this.refresh();
  }

  refresh() {
    if (!this.tabs) return;
    const tabs = clear(this.tabs);
    for (const [k, label, ic] of TABS) {
      if (this.lab.sandbox && (k === 'sales' || k === 'achievements')) continue;
      tabs.appendChild(btn(label, () => { this.tab = k; audio.play('page'); this.refresh(); }, { icon: ic, cls: this.tab === k ? 'active' : '', act: 'book-' + k }));
    }
    const body = clear(this.body);
    const lab = this.lab;
    switch (this.tab) {
      case 'recipes': panels.renderRecipes(lab, body); break;
      case 'ingredients': this.renderIngredients(body); break;
      case 'sales': this.renderSales(body); break;
      default: panels.renderJournal(lab, body, this.tab);
    }
  }

  /** Every ingredient's magic, as the player knows it. @param {HTMLElement} body */
  renderIngredients(body) {
    const lab = this.lab, st = lab.state;
    const avail = st.availableSet();
    const list = h('div', { class: 'list' });
    for (const id of st.world.ingredients) {
      const m = st.lookup(id);
      const seen = lab.sandbox || avail.has(id);
      list.appendChild(h('div', { class: 'item parch' + (seen ? '' : ' locked') },
        h('span', { class: 'swatch big', style: { background: rgbToHex(m.look || m.color) } }),
        h('div', {},
          h('div', { class: 'title', text: m.name }),
          h('div', { class: 'meta' }, ...panels.magicChips(m.magic)),
          h('div', { class: 'meta' }, ...panels.thresholdChips(m))),
        btn('', () => panels.openIngredient(lab, id), { icon: 'eye', cls: 'icon', title: 'Its magic', act: 'inspect-' + id })));
    }
    body.appendChild(list);
  }

  /** The ledger: every sale, and what became of it. @param {HTMLElement} body */
  renderSales(body) {
    const st = this.lab.state;
    body.appendChild(h('div', { class: 'row small ledger-sum' },
      icon('coin', 'sm'), ` ${coins(st.stats.earned)}`, h('span', { class: 'spacer' }),
      icon('refund', 'sm'), ` ${coins(st.stats.refunded)}`, h('span', { class: 'spacer' }),
      icon('seal', 'sm'), ` ${st.stats.certified}`, h('span', { class: 'spacer' }),
      icon('deal', 'sm'), ` ${st.stats.served}`));
    if (!st.sales.length) { body.appendChild(h('div', { class: 'card parch small muted', text: '—' })); return; }
    for (const s of st.sales.slice(0, 40)) {
      const outcome = s.resolved === 'refunded' ? icon('refund') : s.resolved === 'caught' ? icon('seal') : s.complaint ? icon('clock') : icon('check');
      body.appendChild(h('div', { class: 'item parch' },
        h('span', { class: 'swatch big', style: { background: rgbToHex(s.color || [0.5, 0.5, 0.5]) } }),
        h('div', {},
          h('div', { class: 'title', text: s.potion }),
          h('div', { class: 'meta', text: `${s.customer.name} · day ${s.day}` }),
          h('div', { class: 'meta' }, ...s.requirements.map((r) => h('span', { class: 'fx-chip' }, icon(PROP_BY_KEY[r.key].icon, 'sm'), r.kind === 'limit' ? `≤${r.max}` : r.max >= 100 ? `≥${r.min}` : `${r.min}–${r.max}`))),
          s.certified ? h('div', { class: 'meta' }, icon('seal', 'sm'), ...PROPS.map((p) => h('span', { class: 'fx-chip dim' }, icon(p.icon, 'sm'), ` ${s.certified[p.key]}`))) : null),
        h('span', { class: 'sale-side' }, h('b', { text: coins(s.price) }), outcome)));
    }
  }
}
