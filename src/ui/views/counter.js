// The shop counter: the customer and the magic they ask for, the sealed
// vial with its Potion ID label, the expert's certification, haggling over
// the price — and customers who come back to complain.

import { h, btn, clear, coins, toast, confirmDialog } from '../dom.js';
import { icon } from '../icons.js';
import { audio } from '../../audio/audio.js';
import { drawPortrait } from '../../rendering/portraits.js';
import { drawBottle } from '../../rendering/renderer.js';
import { PROPS, PROP_BY_KEY } from '../../alchemy/magic.js';
import { idComplete, idVector } from '../../game/testing.js';
import { mood } from '../../game/haggle.js';
import { archetypeOf } from '../../game/customers.js';
import { failures } from '../../game/commissions.js';
import * as panels from '../panels.js';

/** @template T @param {T[]} a @returns {T} */
const pick = (a) => a[Math.floor(Math.random() * a.length)];

export class CounterView {
  /** @param {import('../lab.js').LabScreen} lab */
  constructor(lab) {
    this.lab = lab;
    this.el = h('section', { class: 'view view-counter', 'data-view': 'counter' });
    /** what the customer just said (shown in their speech bubble) */
    this.say = '';
    /** @type {string|null} the visitor the line belongs to */
    this.sayFor = null;
    /** @type {null|'happy'|'neutral'|'unhappy'} */
    this.sayMood = null;
    /** @type {null|{customer:any, line:string, mood:'happy'|'neutral'|'unhappy', outcome:any}} a visitor on their way out */
    this.parting = null;
    this.ask = 0;
  }

  /** The current visitor speaks. @param {string} line @param {null|'happy'|'neutral'|'unhappy'} [mo] */
  speak(line, mo = null) {
    const c = this.lab.state.current;
    this.say = line;
    this.sayMood = mo;
    this.sayFor = c ? c.id || c.saleId || c.customer.name : null;
  }

  /**
   * A visitor leaves: their last words stay on the counter until the player
   * opens the door for the next one.
   * @param {any} customer @param {string} line @param {'happy'|'neutral'|'unhappy'} mo @param {any} [outcome]
   */
  part(customer, line, mo, outcome = null) {
    this.parting = { customer, line, mood: mo, outcome };
    this.say = '';
    this.sayFor = null;
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
    const door = () => (st.dayOver ? btn('Close for the night', () => lab.endDay(), { cls: 'gold', icon: 'sun', act: 'end-day' })
      : btn('Open the door', () => lab.bringCustomer(true), { cls: 'gold', icon: 'door', act: 'next-customer' }));
    if (!c) {
      if (this.parting) el.append(this.partingCard(this.parting, door()));
      else el.append(h('div', { class: 'card parch counter-empty' }, door()));
      this.vialCard(el, null);
      return;
    }
    this.parting = null;
    const who = c.id || c.saleId || c.customer.name;
    if (this.sayFor !== who) { this.say = ''; this.sayMood = null; this.sayFor = who; }
    if (c.type === 'complaint') { this.complaintCard(el, c); return; }
    const h0 = c.haggle;
    const mo = this.sayMood || (h0 ? (h0.state === 'walked' ? 'unhappy' : mood(h0) > 0.6 ? 'happy' : mood(h0) > 0.25 ? 'neutral' : 'unhappy') : 'neutral');
    const portrait = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'portrait big' }));
    drawPortrait(portrait, c.customer.portrait, mo);
    el.append(h('div', { class: 'card parch customer-card' },
      h('div', { class: 'cust-top' }, portrait, h('div', {},
        h('div', { class: 'cust-name', text: c.customer.name }),
        h('div', { class: 'small muted' }, c.customer.title, c.contract ? h('span', { class: 'tag' }, icon('charter', 'sm')) : null, c.grand ? h('span', { class: 'tag' }, icon('trophy', 'sm')) : null),
        h('div', { class: 'speech' + (this.say ? ' says' : ''), text: '“' + (this.say || c.dialogue) + '”' }))),
      h('div', { class: 'potion-name' }, c.potionName, h('span', { class: 'bottle-size muted small', title: 'Bottle size' }, icon('bottle', 'sm'), ` ${c.bottleMl} ml`)),
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
    const order = com && com.type === 'order' ? com : null;
    const match = order ? st.labelMatches(order) : false;
    const complete = !!v.label && idComplete(v.label);
    const chips = h('div', { class: 'id-chips' }, ...PROPS.map((p) => {
      const val = label.values[p.key];
      const bad = order && complete && order.requirements.some((r) => r.key === p.key && (val < r.min || val > r.max));
      return h('span', { class: 'id-chip' + (bad ? ' bad' : '') + (Number.isFinite(val) ? '' : ' unknown'), title: p.label }, icon(p.icon, 'sm'), h('span', { class: 'pn', text: p.label }), h('b', { text: Number.isFinite(val) ? String(val) : '?' }));
    }));
    const short = order && v.ml < order.bottleMl - 2;
    const head = h('div', { class: 'row' }, cv, h('div', { class: 'vial-head' },
      h('div', { class: 'row' }, h('b', { class: short ? 'short' : '', title: short ? 'Not a full bottle: they will pay less' : 'In the vial', text: short ? `${Math.round(v.ml)}/${order.bottleMl} ml` : `${Math.round(v.ml)} ml` }), v.certified ? h('span', { class: 'seal', title: 'Certified by an expert' }, icon('seal'), h('span', { class: 'small', text: 'Certified' })) : null,
        v.label && v.label.stale && !v.certified ? h('span', { class: 'warn small', title: 'The ID was written before the last ingredients went in' }, icon('warn', 'sm')) : null),
      chips));
    const card = h('div', { class: 'card parch vial-card' }, head);
    if (order) {
      const h0 = order.haggle;
      if (h0 && h0.state !== 'walked') card.append(this.hagglePanel(order, h0));
      else {
        // what stands between this vial and a sale, in words
        const missing = PROPS.filter((p) => !Number.isFinite(label.values[p.key]));
        if (!complete) {
          card.append(h('div', { class: 'vial-hint', role: 'status' }, icon('toad', 'sm'),
            h('span', { text: missing.length === PROPS.length ? 'No label yet. Test it on the creatures and set its Potion ID.' : 'Set every Potion ID slider (0 where nothing showed):' }),
            missing.length < PROPS.length ? h('span', { class: 'miss' }, ...missing.map((p) => icon(p.icon, 'sm'))) : null));
        } else if (!match) {
          card.append(h('div', { class: 'vial-hint bad', role: 'status' }, icon('close', 'sm'), h('span', { text: 'The label does not promise what they asked for.' })));
        } else {
          card.append(h('div', { class: 'vial-hint ok', role: 'status' }, icon('check', 'sm'), h('span', { text: 'The label promises what they need. Offer it!' })));
        }
        const ready = complete && match;
        const sell = btn('Offer', () => this.startSale(order), { cls: ready ? 'primary' : '', icon: 'deal', act: 'sell', disabled: v.ml < 5 });
        const certify = v.certified ? null : btn(`${st.certifyFee}`, () => this.certify(), { icon: 'seal', title: 'Have an expert alchemist certify it', act: 'certify', disabled: st.coins < st.certifyFee });
        const editId = v.certified ? null : btn(complete ? '' : 'Potion ID', () => { lab.testSource = 'vial'; lab.showView('testing'); }, { icon: 'toad', cls: complete ? 'icon' : 'primary', title: 'Test it and write its ID', act: 'test-vial' });
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

  /** Show the vial to the customer: they read the label, then haggle. */
  startSale(com) {
    const lab = this.lab, st = lab.state;
    const v = st.vial;
    if (!v.label || !idComplete(v.label)) {
      this.speak('What is in it? I won’t buy a potion without its label.', 'neutral');
      audio.play('error');
      this.refresh();
      this.shake('.vial-hint');
      return;
    }
    if (!st.labelMatches(com)) {
      // the label does not promise what they need: they say what is wrong
      const f = failures(com, idVector(v.label))[0];
      const name = f ? PROP_BY_KEY[f.key].label : '';
      this.speak(!f ? 'That is not what I need.' : f.kind === 'weak' ? `That is not what I need. I need more ${name}.` : f.kind === 'strong' ? `Too much ${name} for me.` : `That much ${name} would harm me.`, 'unhappy');
      audio.play('fail');
      this.refresh();
      this.shake('.vial-card');
      return;
    }
    const hg = st.beginHaggle();
    this.ask = Math.max(hg.offer + 1, Math.round(hg.offer * 1.6));
    this.speak(v.ml < com.bottleMl - 2 ? `Not a full bottle… I can give you ${coins(hg.offer)} coins.` : `I can give you ${coins(hg.offer)} coins for it.`, 'neutral');
    audio.play('coin');
    this.refresh();
    const panel = this.el.querySelector('.haggle');
    if (panel && panel.scrollIntoView) panel.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    if (lab.tutorial) lab.tutorial.notify('haggle');
  }

  /** @param {string} sel */
  shake(sel) {
    const el = this.el.querySelector(sel);
    if (!el) return;
    el.classList.remove('shake');
    void (/** @type {HTMLElement} */ (el)).offsetWidth;
    el.classList.add('shake');
    if (el.scrollIntoView) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  /** The haggle: their offer, my price. */
  hagglePanel(com, hg) {
    const finalNote = hg.state === 'final';
    const floor = hg.offer + 1;
    const ask = Math.max(floor, Math.round(this.ask || floor));
    this.ask = ask;
    const offerRow = h('div', { class: 'row offer-row' },
      h('span', { class: 'cap', text: finalNote ? 'Final offer' : 'They offer' }),
      h('span', { class: 'bubble' + (finalNote ? ' final' : '') }, icon('coin', 'sm'), h('b', { text: coins(hg.offer) })),
      h('span', { class: 'spacer' }),
      h('span', { class: 'cap', text: 'Patience' }),
      h('span', { class: 'pips', title: 'Patience' }, ...Array.from({ length: hg.patienceMax }, (_, i) => h('i', { class: i < hg.patience ? 'on' : '' }))));
    const take = btn(`Take ${coins(hg.offer)}`, () => this.doAccept(), { cls: 'primary', icon: 'deal', act: 'take-offer' });
    const noDeal = btn('No deal', () => this.doRefuse(), { icon: 'close', cls: 'danger', title: 'No deal: they leave', act: 'refuse' });
    if (finalNote) return h('div', { class: 'haggle final' }, offerRow, h('div', { class: 'row wrap' }, take, h('span', { class: 'spacer' }), noDeal));
    const askEl = h('b', { class: 'ask-val', text: coins(ask) });
    const askBtn = btn(`Ask ${coins(ask)}`, () => this.doAsk(), { cls: 'gold', icon: 'scales', act: 'ask' });
    const top = Math.max(hg.offer * 3, ask + 10);
    const slider = /** @type {HTMLInputElement} */ (h('input', { type: 'range', min: String(floor), max: String(Math.round(top)), value: String(ask), 'aria-label': 'Your price' }));
    const minus = [btn('−5', () => set(this.ask - 5), { cls: 'small', act: 'ask-m5' }), btn('−1', () => set(this.ask - 1), { cls: 'small', act: 'ask-m1' })];
    // never below their own offer: asking less would only lose money
    const set = (v) => {
      this.ask = Math.max(floor, Math.round(v));
      askEl.textContent = coins(this.ask);
      slider.value = String(this.ask);
      const l = askBtn.querySelector('.lbl');
      if (l) l.textContent = `Ask ${coins(this.ask)}`;
      for (const m of minus) m.disabled = this.ask <= floor;
    };
    slider.addEventListener('input', () => set(Number(slider.value)));
    for (const m of minus) m.disabled = ask <= floor;
    return h('div', { class: 'haggle' }, offerRow,
      h('div', { class: 'row ask-row' }, h('span', { class: 'cap', text: 'You ask' }), ...minus,
        h('span', { class: 'ask-box' }, icon('coin', 'sm'), askEl),
        btn('+1', () => set(this.ask + 1), { cls: 'small', act: 'ask-p1' }), btn('+5', () => set(this.ask + 5), { cls: 'small', act: 'ask-p5' })),
      slider,
      h('div', { class: 'row wrap' }, askBtn, take, h('span', { class: 'spacer' }), noDeal));
  }

  doAsk() {
    const st = this.lab.state;
    const com = st.current;
    const r = st.haggleAsk(this.ask);
    if (!r) return;
    if (r.result === 'deal') return this.closeSale();
    if (r.result === 'walked') {
      audio.play('fail');
      this.walkOut('Too much! Good day.');
      return;
    }
    const arch = archetypeOf(com.customer.archetype);
    if (r.result === 'final') this.speak(`${coins(r.offer)}. Not a coin more.`, 'unhappy');
    else this.speak(`${pick(arch.displeased)} ${coins(r.offer)}, then.`, mood(com.haggle) > 0.5 ? 'neutral' : 'unhappy');
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
    if (st.current && st.current.tutorial) {
      // the first customer always comes round again
      st.current.haggle = null;
      this.speak('Please — I really need it! Make me an offer.', 'unhappy');
      this.refresh();
      return;
    }
    st.haggleRefuse();
    this.walkOut('Suit yourself. Good day.');
  }

  /** The customer leaves without buying. @param {string} line */
  walkOut(line) {
    const lab = this.lab, st = lab.state;
    const c = st.current;
    if (c && c.tutorial) { c.haggle = null; this.speak('That is too much for me… Make me an offer.', 'unhappy'); this.refresh(); return; }
    if (c && c.haggle && c.haggle.state === 'walked') st.declineCustomer();
    if (c) this.part(c.customer, line, 'unhappy', { kind: 'walked' });
    lab.refreshCustomer();
    this.refresh();
    lab.updateBadges();
    lab.save();
  }

  closeSale() {
    const lab = this.lab, st = lab.state;
    const com = st.current;
    const { sale, events } = st.completeSale();
    if (!sale) return;
    audio.play('coin');
    const arch = archetypeOf(com.customer.archetype);
    this.part(com.customer, pick(arch.pleased), 'happy', { kind: 'sold', price: sale.price });
    for (const e of events) lab.announce(e);
    lab.save();
    lab.refreshCustomer();
    lab.refreshHud(true);
    lab.updateBadges();
    this.refresh();
    if (lab.tutorial) lab.tutorial.notify('sold');
  }

  /** A visitor on their way out: their last words, what came of it, and the door. */
  partingCard(p, door) {
    const portrait = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'portrait big' }));
    drawPortrait(portrait, p.customer.portrait, p.mood);
    const o = p.outcome || {};
    const result = o.kind === 'sold' ? h('span', { class: 'outcome ok' }, icon('coin'), h('b', { text: `+${coins(o.price)}` }))
      : o.kind === 'refund' ? h('span', { class: 'outcome bad' }, icon('refund'), h('b', { text: `−${coins(o.amount)}` }))
        : o.kind === 'caught' ? h('span', { class: 'outcome ok' }, icon('seal'), h('b', { text: 'Bluff caught' }))
          : h('span', { class: 'outcome' }, icon('door'));
    return h('div', { class: 'card parch customer-card parting' },
      h('div', { class: 'cust-top' }, portrait, h('div', {},
        h('div', { class: 'cust-name', text: p.customer.name }),
        h('div', { class: 'speech says', text: `“${p.line}”` }))),
      h('div', { class: 'row wrap' }, result, h('span', { class: 'spacer' }), door));
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
    const c = st.current;
    const r = st.resolveComplaint(how);
    if (!r.ok) { this.speak(r.reason || 'Hmph.', 'unhappy'); this.refresh(); return; }
    if (r.outcome === 'caught') { audio.play('fanfare'); this.part(c.customer, 'Ah… well… I must have drunk something else. Good day!', 'unhappy', { kind: 'caught' }); }
    else { audio.play('coin'); this.part(c.customer, r.outcome === 'proven' ? 'Your own seal proves it. My money, please.' : 'Thank you. I hope the next one works.', 'neutral', { kind: 'refund', amount: r.amount }); }
    for (const e of r.events || []) lab.announce(e);
    lab.save();
    lab.refreshHud(true);
    lab.refreshCustomer();
    lab.updateBadges();
    this.refresh();
  }
}
