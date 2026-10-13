// The shop counter: the customer, their full order (with which effects you
// have verified), the sealed vial waiting to be served, and the day.

import { h, btn, clear, coins, toast, confirmDialog } from '../dom.js';
import { icon } from '../icons.js';
import { drawPortrait } from '../../rendering/portraits.js';
import { drawBottle } from '../../rendering/renderer.js';
import { PROPERTY_LABELS } from '../../game/evaluate.js';
import { EFFECT_BY_KEY } from '../../alchemy/effects.js';
import { missingEffects, requiredEffects } from '../../game/experiments.js';
import { describeColor, rgbToHex } from '../../core/color.js';
import { viscosityClass } from '../../game/measure.js';
import * as panels from '../panels.js';

export class CounterView {
  /** @param {import('../lab.js').LabScreen} lab */
  constructor(lab) {
    this.lab = lab;
    this.el = h('section', { class: 'view view-counter', 'data-view': 'counter' });
  }

  build() {
    this.refresh();
  }

  refresh() {
    const lab = this.lab, st = lab.state;
    const el = clear(this.el);
    if (lab.sandbox) {
      el.append(h('div', { class: 'card parch' }, h('h3', { text: 'Free Experiment' }), h('div', { class: 'small', text: 'No customers here: every reagent, tool and subject is yours to play with. Bottle nothing, test everything.' })));
      return;
    }
    const com = st.current;
    if (!com) {
      el.append(h('div', { class: 'card parch counter-empty' },
        h('div', { text: st.dayOver ? `The last customer has left. Day ${st.day} is over.` : 'The shop is quiet.' }),
        h('div', { class: 'row wrap' },
          st.dayOver ? btn('Close shop for the night', () => lab.endDay(), { cls: 'gold', icon: 'sun', act: 'end-day' })
            : btn('Open the door', () => lab.bringCustomer(true), { cls: 'gold', icon: 'door', act: 'next-customer' }))));
      this.vialCard(el);
      return;
    }
    const portrait = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'portrait big' }));
    drawPortrait(portrait, com.customer.portrait, 'neutral');
    const cert = lab.currentCert();
    const vialCert = st.vial ? st.vial.cert || {} : null;
    const list = h('ul', { class: 'reqs full' });
    for (const req of com.requirements) {
      const isFx = !!EFFECT_BY_KEY[req.key];
      const label = PROPERTY_LABELS[req.key] || req.key;
      let status = null;
      if (isFx) {
        const v = vialCert && vialCert[req.key] !== undefined ? vialCert[req.key] : cert.values[req.key];
        status = v === undefined ? h('span', { class: 'fx-status unknown', text: '? untested' }) : h('span', { class: 'fx-status known', text: `✓ ${Math.round(v)}` });
      }
      const target = req.key === 'color' ? h('span', {}, h('span', { class: 'swatch', style: { background: rgbToHex(req.rgb) } }), req.label) : h('span', { text: req.label });
      list.appendChild(h('li', { class: 'req' + (req.limit ? ' limit' : '') }, icon(isFx ? EFFECT_BY_KEY[req.key].icon : lab.reqIcon(req.key)), h('span', {}, h('span', { class: 'lbl-k', text: (req.limit ? 'Limit: ' : '') + label + ' ' }), target), status));
    }
    list.appendChild(h('li', { class: 'req' }, icon('flask'), h('span', {}, h('span', { class: 'lbl-k', text: 'Quantity ' }), `${com.bottleMl} ml`)));
    el.append(h('div', { class: 'card parch customer-card' },
      h('div', { class: 'cust-top' }, portrait, h('div', {},
        h('div', { class: 'cust-name', text: `${com.customer.name}` }),
        h('div', { class: 'small muted', text: `${com.customer.title}${com.contract ? ' · Guild contract' : ''}${com.grand ? ' · Grand Commission' : ''}` }),
        h('div', { class: 'budget' }, icon('coin', 'sm'), ` up to ${coins(com.budget)}`))),
      h('div', { class: 'speech', text: '“' + com.dialogue + '”' }),
      h('div', { class: 'potion-name', text: com.potionName }),
      list,
      com.effectOrder ? h('div', { class: 'small muted', text: 'Effects can only be known by testing this batch in the Trials room. Unwanted effects must stay below the limits.' }) : null,
      h('div', { class: 'row wrap cust-actions' },
        btn(com.hintCost ? `Advice (${com.hintCost})` : 'Advice', () => panels.openHint(lab), { icon: 'bulb', act: 'hint' }),
        com.tutorial ? null : btn('Decline', () => lab.decline(), { icon: 'door', act: 'decline' }),
        btn('To the cauldron', () => lab.showView('brew'), { icon: 'cauldron', cls: 'primary', act: 'go-brew' }))));
    this.vialCard(el);
    void requiredEffects;
  }

  /** @param {HTMLElement} el */
  vialCard(el) {
    const lab = this.lab, st = lab.state;
    const v = st.vial;
    if (!v) {
      if (st.current) el.append(h('div', { class: 'card parch small muted', text: 'Brew in the cauldron, test it in the Trials room, then Bottle it to serve here.' }));
      return;
    }
    const com = st.current;
    const m = v.m;
    const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: '24', height: '32', class: 'vial-art' }));
    const ctx = cv.getContext('2d');
    drawBottle(ctx, 2, 3, 20, 29, m.color, Math.min(1, v.ml / Math.max(1, com ? com.bottleMl : v.ml)));
    const has = (e) => lab.sandbox || st.has(e);
    const need = com ? missingEffects(com, v.cert || {}) : [];
    const ok = com && v.ml >= 5 && need.length === 0;
    const serve = btn(com ? `Serve ${com.customer.name.split(' ')[0]}` : 'No customer', () => lab.serveVial(), { cls: 'primary', icon: 'coin', disabled: !ok, act: 'serve' });
    const testB = btn('Test a dose', () => { lab.trialSource = 'vial'; lab.showView('trials'); }, { icon: 'dropper', act: 'test-vial' });
    const back = btn('Pour back', () => lab.pourBackVial(), { icon: 'pour', act: 'pour-back' });
    const discard = btn('Discard', async () => { if (await confirmDialog('Discard the vial?', 'The potion is poured away. Ingredients are not refunded.', 'Discard', 'danger')) lab.discardVial(); }, { icon: 'trash', cls: 'danger', act: 'discard' });
    el.append(h('div', { class: 'card parch vial-card' },
      h('div', { class: 'row' }, cv, h('div', {},
        h('b', { text: `Sealed vial · ${Math.round(v.ml)} ml` }),
        h('div', { class: 'small' }, h('span', { class: 'swatch', style: { background: rgbToHex(m.color) } }), ` ${describeColor(m.color)} · ${Math.round(m.temperature)}°C · ${has('viscometer') ? `${m.viscosity < 100 ? m.viscosity.toFixed(1) : Math.round(m.viscosity)} cP` : viscosityClass(m.viscosity)}${has('hydrometer') ? ` · ${m.density.toFixed(2)} g/ml` : ''}`),
        h('div', { class: 'small' }, 'Verified: ', Object.keys(v.cert || {}).length ? Object.entries(v.cert).map(([k, x]) => h('span', { class: 'fx-chip' }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ` ${Math.round(x)}`)) : h('span', { class: 'muted', text: 'nothing — effects unknown' })))),
      need.length ? h('div', { class: 'warn small', text: `Not yet verified: ${need.map((k) => EFFECT_BY_KEY[k].label).join(', ')}. A customer will not drink a potion of unknown effect — test a dose first.` }) : null,
      com && v.ml < com.bottleMl ? h('div', { class: 'small muted', text: `Short of the ${com.bottleMl} ml ordered; the customer pays less.` }) : null,
      h('div', { class: 'row wrap' }, serve, testB, back, discard)));
    void toast;
  }
}
