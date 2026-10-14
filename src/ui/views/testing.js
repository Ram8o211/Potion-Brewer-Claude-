// The testing room: give 10 ml of the brew (from the cauldron tap, or from
// the sealed vial) to a creature and watch what it does. Nothing is written
// down: the creature's reaction is the only reading. Then set the Potion ID —
// your estimate of each property — with the sliders below. The ID labels the
// batch (and the vial bottled from it); customers buy on what the label says.

import { h, btn, clear, toast } from '../dom.js';
import { icon } from '../icons.js';
import { audio } from '../../audio/audio.js';
import { CREATURES, CREATURE_BY_ID, DOSE_ML, healthNow, lastTrialOf } from '../../game/testing.js';
import { PROPS } from '../../alchemy/magic.js';
import { drawCreature, CAGE_W, CAGE_H } from '../../rendering/creatures.js';

export class TestingView {
  /** @param {import('../lab.js').LabScreen} lab */
  constructor(lab) {
    this.lab = lab;
    this.el = h('section', { class: 'view view-testing', 'data-view': 'testing' });
    this.cards = {};
    /** @type {Record<string, {levels:Record<string, number>, start:number}>} */
    this.react = {};
    this.time = 0;
    this.drag = null;
  }

  get source() {
    const lab = this.lab;
    return lab.testSource === 'vial' && lab.state.vial ? 'vial' : 'cauldron';
  }

  available() {
    const lab = this.lab;
    if (this.source === 'vial') return lab.state.vial ? lab.state.vial.ml : 0;
    return lab.tapAvailable();
  }

  build() {
    const lab = this.lab, st = lab.state;
    const el = clear(this.el);
    this.head = h('div', { class: 'test-head' });
    this.dropper = h('div', { class: 'dropper', role: 'button', tabindex: '0', 'aria-label': 'Dropper: drag it onto a creature' }, icon('dropper', 'lg'), h('span', { class: 'small', text: `${DOSE_ML} ml` }));
    this.bindDropper();
    const grid = h('div', { class: 'creatures' });
    this.cards = {};
    for (const c of CREATURES) {
      if (!lab.sandbox && !st.creatureAvailable(c.id)) {
        grid.appendChild(h('div', { class: 'creature locked parch' }, icon('lock'), icon(c.id === 'wisp' ? 'wisp' : 'help')));
        continue;
      }
      const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(CAGE_W), height: String(CAGE_H), class: 'cage', 'aria-hidden': 'true' }));
      const hp = h('i');
      const doseB = btn('', () => this.test(c.id), { cls: 'primary', icon: 'dropper', title: `Give ${DOSE_ML} ml`, act: 'dose-' + c.id });
      const replayB = btn('', () => this.replay(c.id), { icon: 'replay', cls: 'icon', title: 'Watch the last reaction again', act: 'replay-' + c.id });
      const replaceB = btn('', () => this.replace(c.id), { icon: 'plus', cls: 'gold', title: 'Replace', act: 'replace-' + c.id });
      const shows = h('div', { class: 'shows', title: 'Shows' }, ...c.shows.map((k) => icon(PROPS.find((p) => p.key === k).icon, 'sm')));
      const card = h('div', { class: 'creature parch', 'data-creature': c.id },
        cv,
        h('div', { class: 'creature-name' }, h('span', { text: c.name }), shows),
        h('div', { class: 'bar hp' }, hp),
        h('div', { class: 'creature-actions' }, doseB, replayB, replaceB));
      this.cards[c.id] = { card, cv, ctx: cv.getContext('2d'), hp, doseB, replayB, replaceB };
      grid.appendChild(card);
    }
    this.idPanel = h('div', { class: 'id-panel parch' });
    el.append(this.head, grid, this.idPanel);
    this.refresh();
  }

  refresh() {
    const lab = this.lab, st = lab.state;
    if (!this.head) return;
    // ---- source: the cauldron tap or the sealed vial
    const head = clear(this.head);
    const src = this.source;
    head.append(h('div', { class: 'seg', role: 'radiogroup', 'aria-label': 'Draw the dose from' },
      btn(`${Math.round(lab.tapAvailable())}`, () => { lab.testSource = 'cauldron'; this.refresh(); }, { icon: 'cauldron', cls: src === 'cauldron' ? 'active' : '', title: 'From the cauldron tap', act: 'src-cauldron' }),
      st.vial ? btn(`${Math.round(st.vial.ml)}`, () => { lab.testSource = 'vial'; this.refresh(); }, { icon: 'bottle', cls: src === 'vial' ? 'active' : '', title: 'From the sealed vial', act: 'src-vial' }) : null),
    h('span', { class: 'spacer' }), this.dropper);
    // ---- creatures
    const avail = this.available();
    const now = Date.now();
    for (const [id, c] of Object.entries(this.cards)) {
      const s = st.lab.creatures[id];
      const hpNow = healthNow(s, now);
      c.hp.style.width = Math.round(hpNow) + '%';
      c.hp.style.background = hpNow > 60 ? '#7dc24a' : hpNow > 25 ? '#f0b84a' : '#e0402c';
      c.card.classList.toggle('spent', !s.alive);
      c.doseB.disabled = !s.alive || avail < DOSE_ML / 2;
      c.doseB.classList.toggle('hidden', !s.alive);
      c.replayB.disabled = !lastTrialOf(st.lab, id);
      const cost = lab.sandbox ? 0 : Math.ceil(CREATURE_BY_ID[id].cost * (st.has('kennel') ? 0.5 : 1));
      c.replaceB.classList.toggle('hidden', s.alive);
      const rl = c.replaceB.querySelector('.lbl');
      if (rl) rl.textContent = String(cost);
      else c.replaceB.appendChild(h('span', { class: 'lbl', text: String(cost) }));
    }
    if (!this.idRows || this._idKind !== this.idTarget().kind) this.renderId();
    else this.syncId();
  }

  /** Where the ID being written goes: the vial's label or the batch's. */
  idTarget() {
    const st = this.lab.state;
    if (this.source === 'vial' && st.vial) return { kind: /** @type {'vial'} */ ('vial'), values: st.vial.label ? st.vial.label.values : {}, certified: !!st.vial.certified, stale: false };
    const own = st.idCard.batchId === st.batch.id;
    return { kind: /** @type {'batch'} */ ('batch'), values: own ? st.idCard.values : {}, certified: false, stale: own && st.idStale };
  }

  /**
   * The Potion ID: one named slider per property, set by eye from the
   * reactions. Built once per render; edits update the rows in place so a
   * slider keeps its focus (keyboard) and its pointer.
   */
  renderId() {
    const el = clear(this.idPanel);
    this._idKind = this.idTarget().kind;
    this.idTitle = h('div', { class: 'row id-title' });
    /** @type {Record<string, {inp: HTMLInputElement, out: HTMLElement, row: HTMLElement}>} */
    this.idRows = {};
    const rows = h('div', { class: 'id-rows' });
    for (const p of PROPS) {
      const out = h('b', { class: 'id-val' });
      const inp = /** @type {HTMLInputElement} */ (h('input', { type: 'range', min: '0', max: '100', step: '1', value: '0', 'aria-label': p.label, 'data-prop': p.key }));
      inp.style.setProperty('--c', `rgb(${p.color.map((x) => Math.round(x * 255)).join(',')})`);
      inp.addEventListener('input', () => { out.textContent = inp.value; inp.classList.remove('unset'); });
      inp.addEventListener('change', () => this.setValue(p.key, Number(inp.value)));
      // an unset slider already rests at 0: a tap or a key on it means "0",
      // even though the value did not change and no 'change' event fires
      const commitUnset = () => { if (inp.classList.contains('unset') || !Number.isFinite(this.idTarget().values[p.key])) this.setValue(p.key, Number(inp.value)); };
      inp.addEventListener('pointerup', commitUnset);
      inp.addEventListener('keyup', (e) => { if (/^(Home|End|Arrow|Page)/.test(e.key)) commitUnset(); });
      const row = h('div', { class: 'id-row' }, icon(p.icon), h('span', { class: 'id-name', text: p.label }), inp, out);
      this.idRows[p.key] = { inp, out, row };
      rows.append(row);
    }
    el.append(this.idTitle, rows);
    this.syncId();
  }

  /** Show the target's values without rebuilding the sliders. */
  syncId() {
    if (!this.idRows) return;
    const tgt = this.idTarget();
    const unset = PROPS.filter((p) => !Number.isFinite(tgt.values[p.key])).length;
    // (append() would write a null as the text "null")
    clear(this.idTitle).append(...[icon('scroll'), h('b', { text: 'Potion ID' }), icon(tgt.kind === 'vial' ? 'bottle' : 'cauldron', 'sm'),
      tgt.certified ? h('span', { class: 'seal' }, icon('seal', 'sm')) : null,
      tgt.stale ? h('span', { class: 'warn', title: 'Ingredients were added after this ID was written' }, icon('warn', 'sm')) : null,
      h('span', { class: 'spacer' }),
      !tgt.certified && unset > 0 && unset < PROPS.length ? btn('? → 0', () => this.zeroRest(), { title: 'Set every property the creatures did not show to 0', act: 'id-rest-zero' }) : null,
      tgt.certified ? null : btn('', () => this.clearId(), { icon: 'trash', cls: 'icon', title: 'Clear the ID', act: 'id-clear' })].filter(Boolean));
    for (const p of PROPS) {
      const r = this.idRows[p.key];
      const v = tgt.values[p.key];
      const known = Number.isFinite(v);
      if (document.activeElement !== r.inp || known) r.inp.value = String(known ? v : 0);
      r.inp.classList.toggle('unset', !known);
      r.inp.disabled = tgt.certified;
      r.out.textContent = known ? String(v) : '?';
      r.row.classList.toggle('unset', !known);
    }
  }

  /** @param {string} key @param {number} v */
  setValue(key, v) {
    const lab = this.lab, st = lab.state;
    const tgt = this.idTarget();
    if (tgt.certified) return;
    const values = { ...Object.fromEntries(PROPS.map((p) => [p.key, null])), ...tgt.values, [key]: v };
    this.writeValues(tgt.kind, values, key);
  }

  /** Every property not yet set becomes 0 ("nothing showed"). */
  zeroRest() {
    const tgt = this.idTarget();
    if (tgt.certified) return;
    const values = Object.fromEntries(PROPS.map((p) => [p.key, Number.isFinite(tgt.values[p.key]) ? tgt.values[p.key] : 0]));
    this.writeValues(tgt.kind, values, null);
  }

  /** @param {'batch'|'vial'} kind @param {Record<string, number|null>} values @param {string|null} key */
  writeValues(kind, values, key) {
    const lab = this.lab, st = lab.state;
    st.writeId(kind, values);
    lab.save();
    lab.views.counter.refresh();
    if (lab.tutorial) lab.tutorial.notify('id', key);
    this.syncId();
  }

  clearId() {
    const lab = this.lab, st = lab.state;
    const tgt = this.idTarget();
    st.writeId(tgt.kind, Object.fromEntries(PROPS.map((p) => [p.key, null])));
    lab.save();
    lab.views.counter.refresh();
    this.syncId();
  }

  /** @param {string} id */
  test(id) {
    const lab = this.lab, st = lab.state;
    const s = st.lab.creatures[id];
    if (!s || !s.alive) return;
    let dose, ml, ctx;
    try {
      if (this.source === 'vial') {
        const r = lab.vialDose(DOSE_ML);
        if (!r) { toast('The vial is empty', '', 'bottle'); return; }
        ({ dose, ml } = r);
        ctx = { ml, source: 'vial', batchId: r.batchId, rev: r.rev };
      } else {
        const r = lab.drawDose(DOSE_ML);
        if (!r) { toast('Nothing to test', 'Brew something first.', 'cauldron'); return; }
        ({ dose, ml } = r);
        ctx = { ml, source: 'cauldron', batchId: st.batch.id, rev: st.batch.rev };
      }
      const { record, events } = st.recordTrial(id, dose, ctx);
      this.react[id] = { levels: record.levels, start: this.time };
      audio.play(record.died ? 'fail' : 'discover');
      for (const e of events) lab.announce(e);
      if (lab.tutorial) lab.tutorial.notify('trial', id);
      lab.save();
    } catch (e) {
      toast('Cannot', String(e && e.message), 'close');
    }
    this.refresh();
    lab.views.counter.refresh();
  }

  /** @param {string} id */
  replay(id) {
    const r = lastTrialOf(this.lab.state.lab, id);
    if (!r) return;
    this.react[id] = { levels: r.levels, start: this.time };
    audio.play('select');
  }

  /** @param {string} id */
  replace(id) {
    const lab = this.lab;
    const r = lab.state.replaceCreature(id, lab.sandbox);
    if (!r.ok) { toast('Cannot replace', r.reason, 'coin'); audio.play('error'); return; }
    audio.play(r.cost ? 'coin' : 'click');
    delete this.react[id];
    lab.refreshHud();
    lab.save();
    this.refresh();
  }

  bindDropper() {
    const d = this.dropper;
    let ghost = null;
    const target = (x, y) => {
      const el = document.elementFromPoint(x, y);
      const card = el && /** @type {HTMLElement} */ (el).closest ? /** @type {HTMLElement} */ (el).closest('[data-creature]') : null;
      return card ? card.getAttribute('data-creature') : null;
    };
    d.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      d.setPointerCapture(e.pointerId);
      ghost = h('div', { class: 'drag-ghost' }, icon('dropper', 'lg'));
      document.body.appendChild(ghost);
      this.drag = { id: e.pointerId };
      move(e);
    });
    const move = (e) => {
      if (!this.drag || !ghost) return;
      ghost.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 34}px)`;
      const id = target(e.clientX, e.clientY);
      for (const [k, c] of Object.entries(this.cards)) c.card.classList.toggle('drop-hover', k === id);
    };
    const end = (e) => {
      if (!this.drag) return;
      this.drag = null;
      if (ghost) ghost.remove();
      ghost = null;
      for (const c of Object.values(this.cards)) c.card.classList.remove('drop-hover');
      const id = target(e.clientX, e.clientY);
      if (id) this.test(id);
    };
    d.addEventListener('pointermove', move);
    d.addEventListener('pointerup', end);
    d.addEventListener('pointercancel', () => { this.drag = null; if (ghost) ghost.remove(); ghost = null; });
  }

  /** Animate the creatures (only while visible). @param {number} dt */
  frame(dt) {
    this.time += dt;
    const st = this.lab.state;
    const now = Date.now();
    for (const [id, c] of Object.entries(this.cards)) {
      const r = this.react[id];
      const s = st.lab.creatures[id];
      drawCreature(c.ctx, id, { alive: s.alive, health: healthNow(s, now) }, this.time, r ? { levels: r.levels, age: this.time - r.start } : null);
      if (r && this.time - r.start > 11) delete this.react[id];
    }
    this._acc = (this._acc || 0) + dt;
    if (this._acc > 2) { this._acc = 0; this.refreshHealth(); }
  }

  refreshHealth() {
    const st = this.lab.state, now = Date.now();
    for (const [id, c] of Object.entries(this.cards)) {
      const hpNow = healthNow(st.lab.creatures[id], now);
      c.hp.style.width = Math.round(hpNow) + '%';
    }
  }
}
