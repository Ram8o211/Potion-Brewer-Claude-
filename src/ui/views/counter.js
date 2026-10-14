// The shop counter: the customer and the magic they ask for, the sealed
// vial with its Potion ID label, the expert's certification, haggling over
// the price — and customers who come back to complain.

import { h, btn, clear, coins, toast, confirmDialog } from '../dom.js';
import { icon } from '../icons.js';
import { audio } from '../../audio/audio.js';
import { drawPortrait } from '../../rendering/portraits.js';
import { drawBottle } from '../../rendering/renderer.js';
import { PROPS, PROP_BY_KEY } from '../../alchemy/magic.js';
import { idComplete } from '../../game/testing.js';
import { mood } from '../../game/haggle.js';
import { archetypeOf } from '../../game/customers.js';
import * as panels from '../panels.js';

export class CounterView {
  /** @param {import('../lab.js').LabScreen} lab */
  constructor(lab) {
    this.lab = lab;
    this.el = h('section', { class: 'view view-counter', 'data-view': 'counter' });
    /** a line the customer just said (haggling) */
    this.say = '';
    this.ask = 0;
  }

  build() {
    this.refresh();
  }

  refresh() {
    const lab = this.lab, st = lab.state;
    const el = clear(this.el);
    if (lab.sandbox) {
      el.append(h('div', { class: 'card parch' }, icon('flask'), ' Free Experiment'));
      return;
    }
    const c = st.current;
    if (!c) {
      el.append(h('div', { class: 'card parch counter-empty' },
        st.dayOver ? btn('Close for the night', () => lab.endDay(), { cls: 'gold', icon: 'sun', act: 'end-day' })
          : btn('Open the door', () => lab.bringCustomer(true), { cls: 'gold', icon: 'door', act: 'next-customer' })));
      this.vialCard(el, null);
      return;
    }
    if (c.type === 'complaint') { this.complaintCard(el, c); return; }
    const h0 = c.haggle;
    const mo = h0 ? (h0.state === 'walked' ? 'unhappy' : mood(h0) > 0.6 ? 'happy' : mood(h0) > 0.25 ? 'neutral' : 'unhappy') : 'neutral';
    const portrait = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'portrait big' }));
    drawPortrait(portrait, c.customer.portrait, mo);
    el.append(h('div', { class: 'card parch customer-card' },
      h('div', { class: 'cust-top' }, portrait, h('div', {},
        h('div', { class: 'cust-name', text: c.customer.name }),
        h('div', { class: 'small muted' }, c.customer.title, c.contract ? h('span', { class: 'tag' }, icon('charter', 'sm')) : null, c.grand ? h('span', { class: 'tag' }, icon('trophy', 'sm')) : null),
        h('div', { class: 'speech', text: '“' + c.dialogue + '”' }))),
      h('div', { class: 'potion-name' }, c.potionName, h('span', { class: 'muted small', text: ` · ${c.bottleMl} ml` })),
      panels.reqChips(c.requirements, 'big'),
      h('div', { class: 'row wrap cust-actions' },
        btn(c.hintCost ? `${c.hintCost}` : '', () => panels.openHint(lab), { icon: 'bulb', title: 'Guild advice', act: 'hint' }),
        c.tutorial ? null : btn('', () => lab.decline(), { icon: 'door', cls: 'icon', title: 'Send away', act: 'decline' }),
        h('span', { class: 'spacer' }),
        st.vial ? null : btn('Brew', () => lab.showView('brew'), { icon: 'cauldron', cls: 'primary', act: 'go-brew' }))));
    this.vialCard(el, c);
  }

  /** The sealed vial: its label, the expert's seal, and what to do with it. */
  vialCard(el, com) {
    const lab = this.lab, st = lab.state;
    const v = st.vial;
    if (!v) {
      if (com) el.append(h('div', { class: 'card parch steps small' }, icon('cauldron'), ' → ', icon('toad'), ' → ', icon('bottle'), ' → ', icon('deal')));
      return;
    }
    const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: '24', height: '32', class: 'vial-art' }));
    drawBottle(cv.getContext('2d'), 2, 3, 20, 29, v.m.color, Math.min(1, v.ml / Math.max(1, com ? com.bottleMl : v.ml)));
    const label = v.label || { values: {} };
    const match = com ? st.labelMatches(com) : false;
    const complete = !!v.label && idComplete(v.label);
    const chips = h('div', { class: 'id-chips' }, ...PROPS.map((p) => {
      const val = label.values[p.key];
      const bad = com && complete && com.requirements.some((r) => r.key === p.key && (val < r.min || val > r.max));
      return h('span', { class: 'id-chip' + (bad ? ' bad' : '') + (Number.isFinite(val) ? '' : ' unknown'), title: p.label }, icon(p.icon, 'sm'), h('b', { text: Number.isFinite(val) ? String(val) : '?' }));
    }));
    const head = h('div', { class: 'row' }, cv, h('div', { class: 'vial-head' },
      h('div', { class: 'row' }, h('b', { text: `${Math.round(v.ml)} ml` }), v.certified ? h('span', { class: 'seal', title: 'Certified by an expert' }, icon('seal'), h('span', { class: 'small', text: 'Certified' })) : null,
        v.label && v.label.stale && !v.certified ? h('span', { class: 'warn small', title: 'The ID was written before the last ingredients went in' }, icon('warn', 'sm')) : null),
      chips));
    const card = h('div', { class: 'card parch vial-card' }, head);
    if (com && com.type === 'order') {
      const h0 = com.haggle;
      if (h0 && h0.state !== 'walked') card.append(this.hagglePanel(com, h0));
      else {
        const sell = btn('Offer', () => this.startSale(com), { cls: 'primary', icon: 'deal', act: 'sell', disabled: v.ml < 5 });
        const certify = v.certified ? null : btn(`${st.certifyFee}`, () => this.certify(), { icon: 'seal', title: 'Have an expert alchemist certify it', act: 'certify', disabled: st.coins < st.certifyFee });
        const editId = v.certified ? null : btn('', () => { lab.testSource = 'vial'; lab.showView('testing'); }, { icon: 'toad', cls: 'icon', title: 'Test it and write its ID', act: 'test-vial' });
        if (complete) card.append(h('div', { class: 'match ' + (match ? 'ok' : 'bad') }, icon(match ? 'check' : 'close', 'sm')));
        card.append(h('div', { class: 'row wrap' }, sell, certify, editId, h('span', { class: 'spacer' }), this.vialMenu()));
      }
    } else {
      card.append(h('div', { class: 'row wrap' }, v.certified ? null : btn(`${st.certifyFee}`, () => this.certify(), { icon: 'seal', title: 'Certify', act: 'certify', disabled: st.coins < st.certifyFee }), h('span', { class: 'spacer' }), this.vialMenu()));
    }
    el.append(card);
  }

  vialMenu() {
    const lab = this.lab;
    return h('div', { class: 'row' },
      btn('', () => lab.pourBackVial(), { icon: 'pour', cls: 'icon', title: 'Pour back into the cauldron', act: 'pour-back' }),
      btn('', async () => { if (await confirmDialog('Empty the vial?', '', 'Empty', 'danger')) lab.discardVial(); }, { icon: 'trash', cls: 'icon danger', title: 'Empty the vial', act: 'discard' }));
  }

  async certify() {
    const lab = this.lab, st = lab.state;
    const ok = await confirmDialog('Ask an expert?', `An expert alchemist measures the potion exactly and seals it. Proof against false complaints. ${st.certifyFee} coins.`, 'Certify', 'gold');
    if (!ok) return;
    const r = st.certifyVial();
    if (!r.ok) { toast('Cannot certify', r.reason, 'seal'); audio.play('error'); return; }
    audio.play('coin');
    for (const e of r.events) lab.announce(e);
    lab.refreshHud();
    lab.save();
    this.refresh();
  }

  /** Show the vial to the customer: they look at the label, then haggle. */
  startSale(com) {
    const lab = this.lab, st = lab.state;
    const v = st.vial;
    if (!v.label || !idComplete(v.label)) {
      toast('Label it first', 'Test it on the creatures and write its Potion ID.', 'toad');
      audio.play('error');
      return;
    }
    if (!st.labelMatches(com)) {
      // the label does not promise what they need
      this.say = 'That is not what I need.';
      audio.play('fail');
      const card = this.el.querySelector('.vial-card');
      if (card) card.classList.add('shake');
      setTimeout(() => this.refresh(), 450);
      toast(com.customer.name.split(' ')[0], 'That is not what I need.', 'close', 2600);
      return;
    }
    const hg = st.beginHaggle();
    this.ask = Math.round(hg.offer * 1.6);
    this.say = `${coins(hg.offer)}?`;
    audio.play('coin');
    this.refresh();
    if (lab.tutorial) lab.tutorial.notify('haggle');
  }

  /** The haggle: their offer, my price. */
  hagglePanel(com, hg) {
    const ask = Math.max(1, Math.round(this.ask || hg.offer + 1));
    const askEl = h('b', { class: 'ask-val', text: coins(ask) });
    const set = (v) => { this.ask = Math.max(1, Math.round(v)); askEl.textContent = coins(this.ask); slider.value = String(this.ask); };
    const top = Math.max(hg.offer * 3, ask + 10);
    const slider = /** @type {HTMLInputElement} */ (h('input', { type: 'range', min: String(Math.max(1, hg.offer)), max: String(Math.round(top)), value: String(ask), 'aria-label': 'Your price' }));
    slider.addEventListener('input', () => set(Number(slider.value)));
    const pips = h('span', { class: 'pips', title: 'Patience' }, ...Array.from({ length: hg.patienceMax }, (_, i) => h('i', { class: i < hg.patience ? 'on' : '' })));
    const finalNote = hg.state === 'final';
    return h('div', { class: 'haggle' },
      h('div', { class: 'row offer-row' }, h('span', { class: 'bubble' + (finalNote ? ' final' : '') }, icon('coin', 'sm'), h('b', { text: coins(hg.offer) }), finalNote ? h('span', { class: 'small', text: ' final' }) : null), h('span', { class: 'spacer' }), pips),
      h('div', { class: 'row ask-row' },
        btn('−5', () => set(this.ask - 5), { cls: 'small', act: 'ask-m5' }), btn('−1', () => set(this.ask - 1), { cls: 'small', act: 'ask-m1' }),
        h('span', { class: 'ask-box' }, icon('coin', 'sm'), askEl),
        btn('+1', () => set(this.ask + 1), { cls: 'small', act: 'ask-p1' }), btn('+5', () => set(this.ask + 5), { cls: 'small', act: 'ask-p5' })),
      slider,
      h('div', { class: 'row wrap' },
        finalNote ? null : btn('Ask', () => this.doAsk(), { cls: 'gold', icon: 'scales', act: 'ask' }),
        btn(`Take ${coins(hg.offer)}`, () => this.doAccept(), { cls: 'primary', icon: 'deal', act: 'take-offer' }),
        h('span', { class: 'spacer' }),
        btn('', () => this.doRefuse(), { icon: 'close', cls: 'icon danger', title: 'No deal', act: 'refuse' })));
  }

  doAsk() {
    const st = this.lab.state;
    const r = st.haggleAsk(this.ask);
    if (!r) return;
    if (r.result === 'deal') return this.closeSale();
    if (r.result === 'walked') { audio.play('fail'); toast(st.current.customer.name.split(' ')[0], 'Too much! Good day.', 'door', 2600); this.walkOut(); return; }
    audio.play(r.result === 'final' ? 'error' : 'coin');
    this.ask = Math.max(r.offer + 1, Math.round((this.ask + r.offer) / 2 + 1));
    this.refresh();
  }

  doAccept() {
    const r = this.lab.state.haggleAccept();
    if (r && r.result === 'deal') this.closeSale();
  }

  doRefuse() {
    const st = this.lab.state;
    if (st.current && st.current.tutorial) { toast('Not this one', 'Your first customer needs this potion.', 'heart'); return; }
    st.haggleRefuse();
    this.walkOut();
  }

  walkOut() {
    const lab = this.lab, st = lab.state;
    // the first customer always comes round again
    if (st.current && st.current.tutorial) { st.current.haggle = null; this.refresh(); return; }
    if (st.current && st.current.haggle && st.current.haggle.state === 'walked') st.declineCustomer();
    lab.refreshCustomer();
    this.refresh();
    lab.save();
    setTimeout(() => lab.bringCustomer(true), 900);
  }

  closeSale() {
    const lab = this.lab, st = lab.state;
    const com = st.current;
    const { sale, events } = st.completeSale();
    if (!sale) return;
    audio.play('coin');
    const arch = archetypeOf(com.customer.archetype);
    toast(`+${coins(sale.price)}`, arch.pleased[Math.floor(Math.random() * arch.pleased.length)], 'coin', 3000);
    for (const e of events) lab.announce(e);
    lab.save();
    lab.refreshCustomer();
    lab.refreshHud(true);
    this.refresh();
    if (lab.tutorial) lab.tutorial.notify('sold');
    if (!st.dayOver) setTimeout(() => lab.bringCustomer(true), 1300);
  }

  /** A customer is back: the potion failed them (or so they say). */
  complaintCard(el, c) {
    const lab = this.lab, st = lab.state;
    const portrait = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'portrait big' }));
    drawPortrait(portrait, c.customer.portrait, 'unhappy');
    const p = PROP_BY_KEY[c.complaint.key];
    const line = c.complaint.how === 'weak' ? `Your ${c.potionName.toLowerCase()} did nothing!` : c.complaint.how === 'strong' ? 'Far too strong!' : 'It made me ill!';
    el.append(h('div', { class: 'card parch customer-card complaint' },
      h('div', { class: 'cust-top' }, portrait, h('div', {},
        h('div', { class: 'cust-name', text: c.customer.name }),
        h('div', { class: 'speech', text: `“${line} I want my money back.”` }))),
      h('div', { class: 'row complaint-issue' }, icon(p.icon, 'lg'), icon(c.complaint.how === 'weak' ? 'down' : c.complaint.how === 'strong' ? 'up' : 'warn', 'lg'), h('span', { class: 'spacer' }), icon('refund'), h('b', { class: 'price-big', text: coins(c.price) })),
      h('div', { class: 'row wrap' },
        btn(`Refund ${coins(c.price)}`, () => this.resolve('refund'), { cls: 'danger', icon: 'refund', act: 'refund' }),
        c.certified ? btn('Certificate', () => this.resolve('certificate'), { cls: 'gold', icon: 'seal', act: 'show-certificate' }) : null)));
    this.vialCard(el, null);
    void st;
  }

  resolve(how) {
    const lab = this.lab, st = lab.state;
    const r = st.resolveComplaint(how);
    if (!r.ok) { toast('Cannot', r.reason || '', 'close'); return; }
    if (r.outcome === 'caught') { audio.play('fanfare'); toast('Caught bluffing!', 'They leave red-faced.', 'seal', 3500); }
    else { audio.play('coin'); toast(`−${coins(r.amount)}`, r.outcome === 'proven' ? 'The certificate proves them right.' : 'Refunded.', 'refund', 3000); }
    for (const e of r.events || []) lab.announce(e);
    lab.save();
    lab.refreshHud(true);
    lab.refreshCustomer();
    this.refresh();
    setTimeout(() => lab.bringCustomer(true), 900);
  }
}
