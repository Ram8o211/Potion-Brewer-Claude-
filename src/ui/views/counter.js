// The shop counter: yesterday's customers coming back with their verdict,
// the current customer and their full order (with which effects you have
// verified), the sealed vial — labelled, then bargained over — and the
// potion shelves, where sealed bottles wait until they are needed.

import { h, btn, clear, coins, confirmDialog } from '../dom.js';
import { icon } from '../icons.js';
import { drawPortrait } from '../../rendering/portraits.js';
import { drawBottle } from '../../rendering/renderer.js';
import { PROPERTY_LABELS, scoreRequirement } from '../../game/evaluate.js';
import { techniqueById } from '../../game/commissions.js';
import { EFFECT_INDEX, NE } from '../../alchemy/effects.js';
import { EFFECT_BY_KEY } from '../../alchemy/effects.js';
import { missingEffects } from '../../game/experiments.js';
import { relevantEffects } from '../../game/commerce.js';
import * as trade from '../trade.js';
import { describeColor, rgbToHex } from '../../core/color.js';
import { viscosityClass } from '../../game/measure.js';
import * as panels from '../panels.js';
import { shortName } from '../../game/customers.js';

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
      el.append(h('div', { class: 'card parch' }, h('h3', { text: 'Free Experiment' }), h('div', { class: 'small', text: 'No customers here: every reagent, tool and subject is yours to play with. Bottle what you like, test everything.' })));
      this.vialCard(el);
      return;
    }
    for (const f of st.dueFollowUps()) el.append(trade.followUpCard(lab, f));
    const com = st.current;
    if (!com) {
      el.append(h('div', { class: 'card parch counter-empty' },
        h('div', { text: st.dayOver ? `The last customer has left. Day ${st.day} is over.` : st.opened ? 'The shop is quiet.' : `Dawn of day ${st.day}. The shop is still closed.` }),
        h('div', { class: 'small muted', text: st.dayOver ? 'Dusk: the twilight plants are open in the wilds until you close for the night.' : st.opened ? '' : 'Dawn flowers are open in the wilds only until you open the door. Brew ahead for the shelves, or open up when you are ready.' }),
        h('div', { class: 'row wrap' },
          st.dayOver ? btn('Close shop for the night', () => lab.endDay(), { cls: 'gold', icon: 'sun', act: 'end-day' })
            : btn(st.opened ? 'Next customer' : 'Open the door', () => lab.bringCustomer(true), { cls: 'gold', icon: 'door', act: 'next-customer' }))));
      this.vialCard(el);
      this.shelfCard(el);
      return;
    }
    const portrait = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'portrait big' }));
    drawPortrait(portrait, com.customer.portrait, 'neutral');
    const cert = lab.currentCert();
    const vialCert = st.vial ? st.vial.cert || {} : null;
    const list = h('ul', { class: 'reqs full' });
    // with a vial waiting, only its own trials count: that is what will be sold
    const known = (k) => (vialCert ? vialCert[k] : cert.values[k]);
    for (const req of com.requirements) {
      const isFx = !!EFFECT_BY_KEY[req.key];
      const label = PROPERTY_LABELS[req.key] || req.key;
      let status = null;
      if (isFx) {
        const v = known(req.key);
        status = v === undefined ? h('span', { class: 'fx-status unknown', text: '? untested' }) : h('span', { class: 'fx-status known', text: `✓ ${Math.round(v)}` });
      } else if (req.key === 'purity') {
        // purity is known only once every other channel has been measured
        const others = relevantEffects({ requirements: [req] });
        const vals = others.map(known);
        const open = vals.filter((v) => v === undefined).length;
        const worst = Math.max(0, ...vals.filter((v) => v !== undefined).map((v) => Math.abs(v)));
        status = open ? h('span', { class: 'fx-status unknown', text: `? ${open} untested` }) : h('span', { class: 'fx-status known', text: `✓ ${worst.toFixed(1)}` });
      }
      const target = req.key === 'color' ? h('span', {}, h('span', { class: 'swatch', style: { background: rgbToHex(req.rgb) } }), req.label) : h('span', { text: req.label });
      list.appendChild(h('li', { class: 'req' + (req.limit || req.key === 'purity' ? ' limit' : '') }, icon(isFx ? EFFECT_BY_KEY[req.key].icon : lab.reqIcon(req.key)), h('span', {}, h('span', { class: 'lbl-k', text: (req.limit ? 'Limit: ' : '') + label + ' ' }), target), status));
    }
    list.appendChild(h('li', { class: 'req' }, icon('flask'), h('span', {}, h('span', { class: 'lbl-k', text: 'Quantity ' }), `${com.bottleMl} ml`)));
    el.append(h('div', { class: 'card parch customer-card' },
      h('div', { class: 'cust-top' }, portrait, h('div', {},
        h('div', { class: 'cust-name', text: `${com.customer.name}` }),
        h('div', { class: 'small muted', text: `${com.customer.title}${com.contract ? ' · Guild contract' : ''}${com.grand ? ' · Grand Commission' : ''}` }),
        h('div', { class: 'budget' }, icon('coin', 'sm'), ` up to ${coins(com.budget)}`))),
      com.patron ? h('div', { class: 'small patron ' + (com.patron.trust > 0.2 ? 'ok' : com.patron.trust < -0.2 ? 'warn' : 'muted'), text: `A returning customer (${com.patron.visits} earlier visit${com.patron.visits === 1 ? '' : 's'}): ${com.patron.trust > 0.2 ? 'they trust your shop — less haggling, a bigger purse' : com.patron.trust < -0.2 ? 'they were let down before and want proof this time' : 'they know your shop'}.` }) : null,
      h('div', { class: 'speech', text: '“' + com.dialogue + '”' }),
      h('div', { class: 'potion-name', text: com.potionName }),
      list,
      this.techCard(com),
      this.supplyCard(com),
      this.shelfMatches(com),
      com.effectOrder ? h('div', { class: 'small muted', text: 'Effects can only be known by testing this batch in the Trials room. Customers pay for what your label claims — and come back tomorrow if it was not true.' }) : null,
      h('div', { class: 'row wrap cust-actions' },
        btn(com.hintCost ? `Advice (${com.hintCost})` : 'Advice', () => panels.openHint(lab), { icon: 'bulb', act: 'hint' }),
        com.tutorial ? null : btn('Decline', () => lab.decline(), { icon: 'door', act: 'decline' }),
        btn('To the cauldron', () => lab.showView('brew'), { icon: 'cauldron', cls: 'primary', act: 'go-brew' }))));
    this.vialCard(el);
    this.shelfCard(el);
  }

  /** What the order's techniques ask of the alchemist (one line each). @param {any} com */
  techCard(com) {
    const ts = (com.techniques || []).map(techniqueById).filter(Boolean);
    if (!ts.length) return null;
    const st = this.lab.state;
    return h('div', { class: 'small tech-card' }, h('b', { text: 'What it takes: ' }),
      ...ts.map((t) => h('div', { class: 'tech', 'data-tech': t.id }, h('span', { class: st.journal['technique:' + t.id] ? 'ok' : '', text: `${t.name}${st.journal['technique:' + t.id] ? ' ✓' : ''}: ` }), t.lesson)));
  }

  /**
   * How much to brew and where the wanted effects can be had today — from
   * what the shop knows of its ingredients, never the hidden plan.
   * @param {any} com
   */
  supplyCard(com) {
    const sup = com.supplies;
    if (!sup || com.tutorial) return null;
    const st = this.lab.state;
    const where = { shelf: 'on the shelf', wilds: 'in the wilds', market: 'at the market' };
    return h('details', { class: 'small supply-card' }, h('summary', { text: `Plan for about ${sup.brewMl} ml of brew (the bottle and a few test doses)` }),
      ...sup.carriers.map((c) => h('div', {}, h('b', { text: `${EFFECT_BY_KEY[c.key].label}${c.sign < 0 ? ' (alkaline)' : ''}: ` }),
        c.carriers.length ? c.carriers.map((x) => `${st.lookup(x.id).name} (${where[x.where] || x.where})`).join(', ') : 'nothing you can get today carries it')),
      h('div', { class: 'muted', text: 'Every one of them brings side effects: plan what will cancel them. Long-press a jar on the shelf to see its effects.' }));
  }

  /**
   * Shelved bottles whose own evidence and visible qualities already meet
   * this order (judged on their trials, never on hidden truth).
   * @param {any} com
   */
  shelfMatches(com) {
    const st = this.lab.state;
    if (!st.bottles.length) return null;
    const fits = [];
    for (const b of st.bottles) {
      if (!b.m) continue;
      const cert = b.cert || {};
      const fx = new Array(NE).fill(0);
      let untested = 0;
      for (const r of com.requirements) {
        if (r.key === 'purity') { for (const e of Object.keys(EFFECT_INDEX)) if (!(r.exclude || []).includes(e) && cert[e] === undefined) untested++; continue; }
        if (EFFECT_BY_KEY[r.key] && cert[r.key] === undefined) untested++;
      }
      for (const [k, v] of Object.entries(cert)) fx[EFFECT_INDEX[k]] = v;
      const m = { ...b.m, effects: fx, ml: b.ml };
      const ok = com.requirements.every((r) => scoreRequirement(r, /** @type {any} */ (m)).score >= 0.999) && b.ml >= com.bottleMl;
      if (ok || (untested && com.requirements.filter((r) => !EFFECT_BY_KEY[r.key] && r.key !== 'purity').every((r) => scoreRequirement(r, /** @type {any} */ (m)).score >= 0.999))) fits.push({ b, ok: ok && !untested });
    }
    if (!fits.length) return null;
    const sure = fits.filter((f) => f.ok).length;
    return h('div', { class: 'small shelf-match ' + (sure ? 'ok' : 'muted'), text: sure ? `On your shelves: ${sure} tested bottle${sure === 1 ? '' : 's'} already meet${sure === 1 ? 's' : ''} this order — take it down and offer it.` : `On your shelves: ${fits.length} bottle${fits.length === 1 ? '' : 's'} look${fits.length === 1 ? 's' : ''} right but ${fits.length === 1 ? 'is' : 'are'} not fully tested for this order.` });
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
    const first = com ? shortName(com.customer.name) : '';
    const serve = com ? btn(`Offer to ${first}`, () => lab.serveVial(), { cls: 'primary', icon: 'deal', disabled: v.ml < 5, act: 'serve' }) : null;
    const labelB = btn(v.label ? 'Revise label' : 'Label', () => lab.identifyVial(), { icon: 'tag', act: 'label' });
    const testB = btn('Test a dose', () => { lab.trialSource = 'vial'; lab.showView('trials'); }, { icon: 'dropper', act: 'test-vial' });
    const back = btn('Pour back', () => lab.pourBackVial(), { icon: 'pour', act: 'pour-back' });
    const store = lab.sandbox ? null : btn('Put on shelf', () => lab.shelveVial(), { icon: 'shelf2', act: 'shelve-vial', disabled: st.bottleRoom <= 0, title: st.bottleRoom <= 0 ? 'The potion shelves are full' : 'Keep this bottle on the potion shelves' });
    const discard = btn('Discard', async () => { if (await confirmDialog('Discard the vial?', 'The potion is poured away. Ingredients are not refunded.', 'Discard', 'danger')) lab.discardVial(); }, { icon: 'trash', cls: 'danger', act: 'discard' });
    el.append(h('div', { class: 'card parch vial-card' },
      h('div', { class: 'row' }, cv, h('div', {},
        h('b', { text: `Sealed vial · ${Math.round(v.ml)} ml` }),
        h('div', { class: 'small' }, h('span', { class: 'swatch', style: { background: rgbToHex(m.color) } }), ` ${describeColor(m.color)} · ${Math.round(m.temperature)}°C · ${has('viscometer') ? `${m.viscosity < 100 ? m.viscosity.toFixed(1) : Math.round(m.viscosity)} cP` : viscosityClass(m.viscosity)}${has('hydrometer') ? ` · ${m.density.toFixed(2)} g/ml` : ''}`),
        h('div', { class: 'small' }, 'Verified: ', Object.keys(v.cert || {}).length ? Object.entries(v.cert).map(([k, x]) => h('span', { class: 'fx-chip' }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ` ${Math.round(x)}`)) : h('span', { class: 'muted', text: 'nothing — effects unknown' })),
        v.label ? h('div', { class: 'small label-line' }, icon('tag', 'sm'), ` ${trade.claimSummary(v.label.claims)}`) : null)),
      need.length && com ? h('div', { class: 'warn small', text: `Not yet tested: ${need.map((k) => EFFECT_BY_KEY[k].label).join(', ')}. You may still sell on the guild's theory, but ${first} will trust an untested label less${com.customer.persona && com.customer.persona.proof >= 0.8 ? ' — and this customer insists on proof' : ''}.` }) : null,
      com && v.ml < com.bottleMl ? h('div', { class: 'small muted', text: `Short of the ${com.bottleMl} ml ordered; the customer pays less.` }) : null,
      h('div', { class: 'row wrap' }, serve, labelB, testB, store, back, discard)));
  }

  /**
   * The potion shelves: sealed bottles kept for later, each with its exact
   * contents. Tap a bottle to see it; take it down to the counter to serve
   * or test it (a bottle already there goes up in its place).
   * @param {HTMLElement} el
   */
  shelfCard(el) {
    const lab = this.lab, st = lab.state;
    if (lab.sandbox) return;
    lab.freshBottles();
    const cap = st.cap.bottles;
    if (this.sel && !st.bottles.some((b) => b.id === this.sel)) this.sel = null;
    const grid = h('div', { class: 'bottle-shelf', role: 'listbox', 'aria-label': 'Potion shelves' });
    const rows = Math.ceil(cap / 6);
    for (let i = 0; i < rows * 6; i++) {
      const b = st.bottles[i];
      if (!b) {
        grid.appendChild(h('div', { class: 'bottle-slot' + (i < cap ? ' empty' : ' locked'), 'aria-hidden': 'true' }));
        continue;
      }
      const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: '16', height: '22', class: 'vial-art' }));
      drawBottle(/** @type {CanvasRenderingContext2D} */ (cv.getContext('2d')), 2, 2, 12, 19, b.m ? b.m.color : [0.5, 0.5, 0.5], Math.min(1, b.ml / Math.max(1, b.bottledMl || b.ml)));
      const slot = h('button', { class: 'bottle-slot' + (this.sel === b.id ? ' active' : ''), role: 'option', 'aria-selected': this.sel === b.id ? 'true' : 'false', 'aria-label': `${b.label && b.label.name ? b.label.name : 'Bottle'}, ${Math.round(b.ml)} ml`, 'data-act': 'bottle-slot', 'data-id': b.id },
        cv, h('span', { class: 'bml', text: `${Math.round(b.ml)}` }));
      slot.addEventListener('click', () => { this.sel = this.sel === b.id ? null : b.id; this.refresh(); });
      grid.appendChild(slot);
    }
    const b = this.sel ? st.bottles.find((x) => x.id === this.sel) : null;
    let detail = null;
    if (b) {
      const m = b.m || {};
      const fx = Object.entries(b.cert || {});
      detail = h('div', { class: 'bottle-detail' },
        h('div', { class: 'small' }, h('span', { class: 'swatch', style: { background: rgbToHex(m.color || [0.5, 0.5, 0.5]) } }), ` ${describeColor(m.color || [0.5, 0.5, 0.5])} · ${Math.round(b.ml)} ml · ${Math.round(m.temperature ?? 20)}°C · bottled on day ${b.day || st.day}`),
        h('div', { class: 'small' }, 'Verified: ', fx.length ? fx.map(([k, x]) => h('span', { class: 'fx-chip' }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ` ${Math.round(x)}`)) : h('span', { class: 'muted', text: 'nothing — effects unknown' })),
        b.label ? h('div', { class: 'small label-line' }, icon('tag', 'sm'), ` ${trade.claimSummary(b.label.claims)}`) : null,
        h('div', { class: 'row wrap' },
          btn(st.vial ? 'Swap onto the counter' : 'Take to the counter', () => lab.takeBottle(b.id), { icon: 'deal', cls: 'primary', act: 'take-bottle' }),
          btn('Pour back', () => lab.pourBackBottle(b.id), { icon: 'pour', act: 'pour-back-bottle' }),
          btn('Discard', async () => { if (await confirmDialog('Discard the bottle?', 'The potion is poured away. Ingredients are not refunded.', 'Discard', 'danger')) lab.discardBottle(b.id); }, { icon: 'trash', cls: 'danger', act: 'discard-bottle' })));
    }
    el.append(h('div', { class: 'card parch shelf-card' },
      h('div', { class: 'row' }, icon('shelf2'), h('b', { text: `Potion shelves · ${st.bottles.length}/${cap}` })),
      st.bottles.length ? null : h('div', { class: 'small muted', text: 'Bottle a brew onto the shelves whenever you like, to keep it for a later customer, test it later or pour it back into a new brew. More shelving is sold at the Guild.' }),
      grid, detail));
  }
}
