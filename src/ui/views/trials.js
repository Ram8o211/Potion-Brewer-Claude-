// The trials room is the rabbit farm: every test is a real, measured dose of
// the brew (or of a sealed vial) given to one of the colony's Moon Rabbits,
// right where they live. A rabbit shows every effect, but each one feels a
// potion a little differently and every dose varies, so one reading is only
// a rough guess: the batch estimate pools every trial of the batch and
// narrows as more *different* rabbits are tested. Dosing the same rabbit
// again piles the effect up in it until it degenerates. Any trial can be
// replayed on the chosen rabbit's portrait without spending a drop.

import { h, btn, clear, toast } from '../dom.js';
import { icon } from '../icons.js';
import { audio } from '../../audio/audio.js';
import { SUBJECT_BY_ID, DOSES, missingEffects } from '../../game/experiments.js';
import { EFFECTS, EFFECT_BY_KEY, EFFECT_INDEX, EFFECT_KEYS, potencyWord } from '../../alchemy/effects.js';
import { SIM } from '../../simulation/constants.js';
import { applyTrials } from '../../game/commerce.js';
import { summarize, addSamples } from '../../game/experiments.js';
import { drawRabbit } from '../../rendering/rabbit.js';
import { focusRabbit, findRabbit, rabbitSnap, decodeSnap, lookFromSeed, RABBIT_MARKS } from '../../game/colony.js';
import { HutchPanel } from './hutch.js';

/** how long a replay runs (s) */
const REPLAY_T = 3.2;

export class TrialsView {
  /** @param {import('../lab.js').LabScreen} lab */
  constructor(lab) {
    this.lab = lab;
    this.el = h('section', { class: 'view view-trials', 'data-view': 'trials' });
    this.time = 0;
    this.last = null;
    this.drag = null;
    /** per-rabbit reaction flash (by rabbit id) */
    /** @type {Record<string, number>} */
    this.rreact = {};
    /** a trial being replayed on the rabbit's portrait: no state changes, no doses */
    /** @type {{rec:any, t:number}|null} */
    this.replay = null;
    this.hutch = new HutchPanel(this);
    /** kept for the tutorial: the card to point at */
    /** @type {Record<string, {card:HTMLElement}>} */
    this.cards = {};
  }

  get source() {
    const lab = this.lab;
    if (lab.trialSource === 'vial' && lab.state.vial) return 'vial';
    return 'cauldron';
  }

  available() {
    const lab = this.lab;
    if (this.source === 'vial') return lab.state.vial ? lab.state.vial.ml : 0;
    return lab.tapAvailable();
  }

  /** The dose the next test gives (what is available, in whole particles). */
  doseMl() {
    const d = Math.min(this.lab.trialDose, this.available());
    return d < SIM.ML_PER_PARTICLE ? this.lab.trialDose : Math.floor(d / SIM.ML_PER_PARTICLE) * SIM.ML_PER_PARTICLE;
  }

  build() {
    const lab = this.lab, st = lab.state;
    const el = clear(this.el);
    this.head = h('div', { class: 'trials-head card parch' });
    this.status = h('div', { class: 'trials-status small' });
    this.dropper = h('div', { class: 'dropper', role: 'button', tabindex: '0', 'aria-label': 'Dropper: drag onto a rabbit to give it the dose' }, icon('dropper', 'lg'), h('span', { class: 'small', text: 'Drag onto a rabbit' }));
    this.bindDropper();
    this.report = h('div', { class: 'trial-report' });
    el.append(this.head, this.status, this.hutch.el, this.report);
    this.cards = { rabbit: { card: this.hutch.el } };
    if (!lab.sandbox && st.firstTip('farm')) toast('The rabbit farm', 'Test on several different rabbits: each one feels a potion a little differently. Too much in one rabbit and the effect runs out of control.', 'rabbit', 7000);
    this.refresh();
  }

  /** Choose the rabbit the next dose goes to. @param {string} id */
  select(id) {
    const st = this.lab.state;
    if (!st.selectRabbit(id)) return;
    const r = findRabbit(st.colony, id);
    audio.play(r && r.alive ? 'squeak' : 'click');
    this.replay = null;
    this.lab.save();
    this.refresh();
  }

  /** Replay a rabbit trial on the portrait (nothing is consumed or changed). @param {any} rec */
  startReplay(rec) {
    if (!rec || !rec.replay) return;
    if (rec.rabbitId && findRabbit(this.lab.state.colony, rec.rabbitId)) {
      this.lab.state.selectRabbit(rec.rabbitId);
      this.refresh();
    }
    this.replay = { rec, t: 0 };
    this.last = rec;
    this.renderReport();
    const ol = this.report.querySelector('.obs-list');
    if (ol) ol.classList.add('replaying');
    audio.play(rec.died ? 'toll' : 'squeak');
    const p = this.hutch.el.querySelector('.rabbit-detail');
    if (p && p.scrollIntoView) p.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  refresh() {
    const lab = this.lab, st = lab.state;
    if (!this.head) return;
    // ---- source & dose
    const head = clear(this.head);
    const src = this.source;
    const seg = h('div', { class: 'seg', role: 'radiogroup', 'aria-label': 'Sample source' },
      btn(`Cauldron tap · ${Math.round(lab.tapAvailable())} ml`, () => { lab.trialSource = 'cauldron'; this.refresh(); }, { cls: src === 'cauldron' ? 'active' : '', act: 'src-cauldron' }),
      st.vial ? btn(`Sealed vial · ${Math.round(st.vial.ml)} ml`, () => { lab.trialSource = 'vial'; this.refresh(); }, { cls: src === 'vial' ? 'active' : '', act: 'src-vial' }) : null);
    const doses = h('div', { class: 'seg', role: 'radiogroup', 'aria-label': 'Dose' }, h('span', { class: 'small muted', text: 'Dose' }),
      ...DOSES.map((ml) => btn(`${ml} ml`, () => { lab.trialDose = ml; this.refresh(); }, { cls: lab.trialDose === ml ? 'active' : '', act: 'dose-' + ml })));
    head.append(h('div', { class: 'row wrap' }, seg), h('div', { class: 'row wrap' }, doses, h('span', { class: 'spacer' }), this.dropper));
    if (st.vial) {
      // the iterate loop: test the vial, pour the rest back, improve, bottle again
      head.append(h('div', { class: 'row wrap vial-row' },
        h('span', { class: 'small muted', text: `Vial: ${Math.round(st.vial.ml)} ml of ${Math.round(st.vial.bottledMl || st.vial.ml)} ml bottled` }),
        btn('Pour back', () => lab.pourBackVial(), { icon: 'pour', act: 'trials-pour-back', title: 'Return the rest of the vial to the cauldron' }),
        btn('Discard', () => { lab.discardVial(); this.refresh(); }, { icon: 'trash', cls: 'danger', act: 'trials-discard' })));
    }
    // ---- what this batch is known to do
    const status = clear(this.status);
    const cert = this.estimate();
    const known = Object.entries(cert.values);
    const com = st.current;
    const need = com ? missingEffects(com, cert.values) : [];
    status.append(h('div', { class: 'row wrap' },
      h('b', { text: src === 'vial' ? 'This vial: ' : 'This batch: ' }),
      known.length ? known.filter(([, v]) => v !== 0).map(([k, v]) => h('span', { class: 'fx-chip', title: `${EFFECT_BY_KEY[k].label}: ${cert.n[k]} reading${cert.n[k] === 1 ? '' : 's'} on ${cert.rabbits[k]} rabbit${cert.rabbits[k] === 1 ? '' : 's'}` }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ` ${Math.round(v)} ±${Math.max(1, Math.round(cert.spread[k] || 0))}`)) : h('span', { class: 'muted', text: 'effects unknown — nothing tested yet' }),
      known.length && known.every(([, v]) => v === 0) ? h('span', { class: 'muted', text: 'no effect seen' }) : null));
    if (known.length) {
      const nr = Math.max(...Object.values(cert.rabbits));
      status.append(h('div', { class: nr >= 3 ? 'ok small' : 'warn small', text: nr >= 3 ? `Estimated from ${nr} different rabbits.` : `Only ${nr} rabbit${nr === 1 ? '' : 's'} tested: each one reads a potion a little differently — test on others before you trust it.` }));
    }
    if (cert.changed && src === 'cauldron') status.append(h('div', { class: 'warn small', text: 'Earlier trials of this batch are outdated: you added ingredients since.' }));
    if (cert.stale.length) status.append(h('div', { class: 'warn small', text: `The brew has changed since it was tested (${cert.stale.map((k) => EFFECT_BY_KEY[k].label).join(', ')}): reactions, heat or settling. Test again.` }));
    if (com && need.length) {
      status.append(h('div', { class: 'small' }, h('span', { text: 'The order still needs: ' }), ...need.map((k) => h('span', { class: 'fx-chip need' }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ' ' + EFFECT_BY_KEY[k].label))));
    } else if (com && com.effectOrder) {
      status.append(h('div', { class: 'ok small', text: 'Every effect the order asks about has been tested for this ' + (src === 'vial' ? 'vial.' : 'batch.') }));
    }
    this.hutch.render();
    this.renderReport();
  }

  /** The pooled estimate of the source being tested (batch or vial). */
  estimate() {
    const lab = this.lab, st = lab.state;
    if (this.source === 'vial' && st.vial) return { ...summarize(st.vial.samples || {}), ...vialFallback(st.vial), stale: [], changed: false };
    return { spread: {}, n: {}, rabbits: {}, ...lab.currentCert() };
  }

  renderReport() {
    const lab = this.lab, st = lab.state;
    const r = this.last || st.trials.records[0];
    const el = clear(this.report);
    if (!r) {
      el.append(h('div', { class: 'card parch small', text: 'A mixture’s effects are unknown until you test it. You know what each plain ingredient does — but mixing, heat and reactions change things. Choose a rabbit and give it a dose; then test other rabbits too, because each one reads a potion a little differently.' }));
      return;
    }
    const subj = SUBJECT_BY_ID[r.subjectId] || SUBJECT_BY_ID.rabbit;
    const rows = h('div', { class: 'reading-rows' });
    const quiet = [];
    for (const key of r.revealed) {
      const e = EFFECT_BY_KEY[key];
      const v = r.values[key], th = r.theory[key] ?? 0;
      if (v === 0 && Math.abs(th) < 0.5 && !r.anomalies.includes(key)) { quiet.push(e); continue; }
      const anomaly = r.anomalies.includes(key);
      const width = (x) => Math.min(100, Math.abs(x)) + '%';
      const err = r.err && r.err[key] !== undefined ? Math.max(1, Math.round(r.err[key])) : 0;
      rows.appendChild(h('div', { class: 'reading' + (anomaly ? ' anomaly' : ''), title: e.desc },
        icon(e.icon, 'sm'), h('span', { class: 'rk', text: e.label }),
        h('div', { class: 'rbar' }, h('i', { class: 'obs', style: { width: width(v), background: rgb(e.color) } }), h('i', { class: 'th', style: { left: width(th) } })),
        h('span', { class: 'rv', text: v === 0 ? 'none' : `${Math.round(v)}${err ? ` ±${err}` : ''} · ${potencyWord(v, key)}` })));
    }
    const laws = r.lawsFound.map((id) => (st.world.laws || []).find((l) => l.id === id)).filter(Boolean);
    const who = r.rabbitName ? r.rabbitName : subj.name;
    const body = r.rabbitId ? findRabbit(st.colony, r.rabbitId) : null;
    el.append(h('div', { class: 'card parch report' },
      h('div', { class: 'row' }, icon('dropper'), h('b', { text: `Trial ${r.serial}: ${who}` }), h('span', { class: 'spacer' }), h('span', { class: 'small muted', text: `${r.ml} ml from the ${r.source === 'vial' ? 'vial' : 'tap'}` })),
      h('ul', { class: 'obs-list' }, ...r.observations.map((o) => h('li', { class: 'tone-' + o.tone, text: o.text }))),
      rows,
      quiet.length ? h('div', { class: 'small muted quiet' }, 'Nothing seen: ', ...quiet.map((e) => icon(e.icon, 'sm'))) : null,
      h('div', { class: 'small muted', text: 'Bar: what this rabbit showed (± how far one reading can be off). Tick: what the guild’s theory predicts. One rabbit’s reading is biased by its own nature: average several rabbits.' }),
      r.anomalies.length ? h('div', { class: 'warn small', text: `Unexpected: ${r.anomalies.map((k) => EFFECT_BY_KEY[k].label).join(', ')} differs from theory. Something in this mixture interacts — repeat with variations to find out what.` }) : null,
      ...laws.map((L) => h('div', { class: 'law-found' }, icon('star'), h('div', {}, h('b', { text: `Law discovered: ${L.name}` }), h('div', { class: 'small', text: L.lore + ' Your theory now accounts for it.' })))),
      r.died ? h('div', { class: 'bad small', text: `${who} did not survive. ${body ? 'The body stays in the hutch: recover its remains or bury it.' : ''} A potion that kills a rabbit should not be sold as a remedy.` }) : null,
      r.replay ? h('div', { class: 'row' }, btn('Replay', () => this.startReplay(r), { icon: 'eye', act: 'replay-trial', title: 'Watch this trial again — nothing is used up' })) : null,
    ));
    // the pooled estimate of the batch, effect by effect
    const cert = this.estimate();
    const keys = EFFECT_KEYS.filter((k) => cert.values[k] !== undefined && (cert.values[k] !== 0 || (cert.spread[k] || 0) > 1));
    if (keys.length) {
      const est = h('div', { class: 'reading-rows' });
      for (const k of keys) {
        const e = EFFECT_BY_KEY[k], v = cert.values[k], s = cert.spread[k] || 0;
        const lo = Math.max(0, Math.abs(v) - s), hi = Math.min(100, Math.abs(v) + s);
        est.appendChild(h('div', { class: 'reading', title: `${cert.n[k]} reading${cert.n[k] === 1 ? '' : 's'} on ${cert.rabbits[k]} rabbit${cert.rabbits[k] === 1 ? '' : 's'}` },
          icon(e.icon, 'sm'), h('span', { class: 'rk', text: e.label }),
          h('div', { class: 'rbar' }, h('i', { class: 'range', style: { left: lo + '%', width: Math.max(1, hi - lo) + '%', background: rgb(e.color) } }), h('i', { class: 'th mean', style: { left: Math.min(100, Math.abs(v)) + '%' } })),
          h('span', { class: 'rv', text: `${Math.round(v)} ±${Math.max(1, Math.round(s))} · ${cert.rabbits[k]} rabbit${cert.rabbits[k] === 1 ? '' : 's'}` })));
      }
      el.append(h('div', { class: 'card parch report estimate' },
        h('div', { class: 'row' }, icon('scales'), h('b', { text: this.source === 'vial' ? 'Vial estimate' : 'Batch estimate' })),
        est,
        h('div', { class: 'small muted', text: 'The mean of every trial of this brew. The band narrows as you test more different rabbits; the label you sell with uses this mean.' })));
    }
  }

  /** @param {string} [id] always the chosen rabbit */
  test(id = 'rabbit') {
    void id;
    const lab = this.lab, st = lab.state;
    const rabbit = focusRabbit(st.colony);
    if (!rabbit || !rabbit.alive) {
      toast('Choose a living rabbit', 'The chosen rabbit is dead: pick another in the hutch, or buy one.', 'rabbit');
      this.refresh();
      return;
    }
    const want = lab.trialDose;
    let dose, ml, ctx;
    try {
      if (this.source === 'vial') {
        const r = lab.vialDose(want);
        if (!r) { toast('Not enough potion', 'The vial is empty.', 'bottle'); return; }
        ({ dose, ml } = r);
        ctx = { ml, source: 'vial', batchId: r.batchId, rev: r.rev, theory: r.theory, parts: r.parts };
      } else {
        const r = lab.drawDose(want);
        if (!r) { toast('Nothing to test', 'Pour and mix a brew first; the dose is drawn from the tap at the bottom.', 'flask'); return; }
        ({ dose, ml } = r);
        ctx = { ml, source: 'cauldron', batchId: st.batch.id, rev: st.batch.rev, theory: lab.theory(), parts: lab.batchParts() };
      }
      /** @type {any} */ (ctx).rabbitId = rabbit.id;
      const vial = this.source === 'vial' ? st.vial : null;
      const { record, events } = st.recordTrial('rabbit', dose, ctx);
      if (vial) {
        // the vial is sealed: its estimate pools every trial of it
        vial.samples = addSamples(vial.samples || seedSamples(vial), record);
        const sum = summarize(vial.samples);
        vial.cert = sum.values;
        vial.certRecords = sum.records;
        if (vial.label) applyTrials(vial.label, Object.fromEntries(Object.keys(record.values).map((k) => [k, sum.values[k]])), record.id);
      }
      this.last = record;
      this.replay = null;
      this.rreact[rabbit.id] = 1;
      this.hutch.poke(rabbit.id, record.replay && record.replay.rx ? record.replay.rx.split(',') : []);
      audio.play(record.died ? 'toll' : record.observations.some((o) => o.tone === 'bad') ? 'thump' : 'squeak');
      if (record.degen && record.degen.length && !record.died) toast(`${rabbit.name} is degenerating!`, 'An effect has piled up past what its body can hold and is running out of control. Purge it — or put it down before it is too late.', 'claw', 6000);
      for (const e of events) {
        if (e.type === 'law') { toast(`Law discovered: ${e.name}`, e.lore, 'star', 6000); audio.play('fanfare'); }
        else if (e.type === 'rabbit-died') toast(`${e.name} died`, 'The body stays in the hutch. Recover its remains — once — or bury it.', 'skull', 5000);
        else lab.announce(e);
      }
      if (lab.tutorial) lab.tutorial.notify('trial', 'rabbit');
      lab.save();
    } catch (e) {
      toast('Cannot test', String(e && e.message), 'close');
    }
    // re-measure now so the estimate this trial earned shows at once
    lab.updateAssay(true);
    this.refresh();
    lab.refreshCustomer();
    lab.views.counter.refresh();
    lab.updateBadges();
  }

  /** @param {string} id */
  replace(id) {
    const lab = this.lab;
    const r = lab.state.replaceSubject(id, lab.sandbox);
    if (!r.ok) { toast('Cannot replace', r.reason, 'coin'); audio.play('error'); return; }
    audio.play(r.cost ? 'coin' : 'click');
    lab.refreshHud();
    lab.save();
    this.refresh();
  }

  /**
   * Things that happened in the hutch in real time (the lab ticks the
   * colony every frame, whichever room is open).
   * @param {any[]} events
   */
  colonyEvents(events) {
    if (!events.length) return;
    let rebuild = false;
    for (const e of events) {
      if (e.type === 'attack') {
        this.hutch.scene.attack && this.hutch.scene.attack(e.from, e.to);
        this.rreact[e.to] = 1;
        if (this.lab.view === 'trials') audio.play('thump');
        if (e.killed) rebuild = true;
      } else if (e.type === 'rabbit-died') {
        rebuild = true;
        toast(`${e.name} died`, e.by ? `${e.by} mauled ${e.name} to death. Put the feral rabbit down or purge it before it kills again.` : `The degeneration ran its course. The body stays in the hutch.`, 'skull', 5000);
        audio.play('toll');
      } else if (e.type === 'trait') rebuild = true;
      else if (e.type === 'purge-brewed') { toast('A purging draught is ready', 'The still has finished brewing.', 'purge', 2500); rebuild = true; }
    }
    if (rebuild && this.head) this.refresh();
    else if (this.head) this.hutch.syncScene();
  }

  bindDropper() {
    const d = this.dropper;
    let ghost = null;
    const target = (x, y) => {
      const el = document.elementFromPoint(x, y);
      if (el && el === this.hutch.canvas) {
        const id = this.hutch.hitAt(/** @type {any} */ ({ clientX: x, clientY: y }));
        return id || null;
      }
      const tile = el && /** @type {HTMLElement} */ (el).closest ? /** @type {HTMLElement} */ (el).closest('[data-rabbit]') : null;
      if (tile) return tile.getAttribute('data-rabbit');
      const det = el && /** @type {HTMLElement} */ (el).closest ? /** @type {HTMLElement} */ (el).closest('.rabbit-detail') : null;
      return det ? this.lab.state.colony.focus : null;
    };
    const targets = () => Object.entries(this.hutch.tiles).map(([k, t]) => /** @type {[string, HTMLElement]} */ ([k, t.tile]));
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
      for (const [k, el] of targets()) el.classList.toggle('drop-hover', k === id);
      this.hutch.hover = id;
    };
    const end = (e) => {
      if (!this.drag) return;
      this.drag = null;
      if (ghost) ghost.remove();
      ghost = null;
      for (const [, el] of targets()) el.classList.remove('drop-hover');
      const id = target(e.clientX, e.clientY);
      if (!id) return;
      const r = findRabbit(this.lab.state.colony, id);
      if (r && !r.alive) { this.select(r.id); toast(`${r.name} is dead`, 'Choose a living rabbit to dose.', 'skull'); return; }
      this.lab.state.selectRabbit(id);
      this.test('rabbit');
    };
    d.addEventListener('pointermove', move);
    d.addEventListener('pointerup', end);
    d.addEventListener('pointercancel', () => { this.drag = null; if (ghost) ghost.remove(); ghost = null; });
    d.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.test('rabbit'); });
  }

  /** Animate the farm (only while visible). @param {number} dt */
  frame(dt) {
    this.time += dt;
    const low = this.lab.effectiveQuality() === 'low';
    for (const [rid, r] of Object.entries(this.rreact)) if (r > 0) this.rreact[rid] = Math.max(0, r - dt * 1.4);
    this.hutch.frame(dt, this.time);
    this.drawPortrait(dt, low);
  }

  /**
   * The chosen rabbit's portrait, or a replay — the rabbit as it was before
   * the dose, then the change, from the trial's own snapshots.
   * @param {number} dt @param {boolean} low
   */
  drawPortrait(dt, low) {
    const ctx = this.hutch.d.portrait;
    if (!ctx) return;
    const st = this.lab.state;
    const quality = low ? 'low' : 'high';
    if (this.replay) {
      const rp = this.replay;
      rp.t += dt;
      const rec = rp.rec;
      const who = findRabbit(st.colony, rec.rabbitId) || st.colony.memorial.find((m) => m.id === rec.rabbitId);
      const look = who ? who.look : lookFromSeed(rec.rabbitId || 'x');
      const before = decodeSnap(rec.replay.b), after = decodeSnap(rec.replay.a);
      const react = rec.replay.rx ? rec.replay.rx.split(',').filter((k) => RABBIT_MARKS.includes(k)) : [];
      if (rp.t < 0.6) drawRabbit(ctx, look, before, this.time, 0, { quality });
      else {
        // a death plays out: collapse first, then the body
        const dying = before.alive && !after.alive && rp.t < 1.3;
        const snap = dying ? { ...after, alive: true, hp: /** @type {3} */ (3) } : after;
        drawRabbit(ctx, look, snap, this.time, Math.max(0, 1 - (rp.t - 0.6) * 1.2), { quality, react });
      }
      if (rp.t > REPLAY_T) {
        this.replay = null;
        const ol = this.report && this.report.querySelector('.obs-list');
        if (ol) ol.classList.remove('replaying');
      }
      return;
    }
    const r = this.hutch.d.id ? findRabbit(st.colony, this.hutch.d.id) : focusRabbit(st.colony);
    if (!r) { ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); return; }
    const react = this.rreact[r.id] || 0;
    const last = react > 0 && this.last && this.last.rabbitId === r.id && this.last.replay ? this.last.replay.rx.split(',').filter((k) => RABBIT_MARKS.includes(k)) : [];
    drawRabbit(ctx, r.look, rabbitSnap(r, st.day), this.time, react, { quality, react: last });
  }
}

/** A vial bottled before samples existed: its certificate counts as one reading per effect. @param {any} v */
function seedSamples(v) {
  /** @type {Record<string, {v:number, r:string, rec:string}[]>} */
  const s = {};
  for (const [k, x] of Object.entries(v.cert || {})) s[k] = [{ v: Number(x) || 0, r: 'bottled', rec: (v.certRecords || {})[k] || '' }];
  return s;
}

/** Estimate fields for a vial with a certificate but no samples. @param {any} v */
function vialFallback(v) {
  if (v.samples) return {};
  return summarize(seedSamples(v));
}

/** @param {number[]} c */
function rgb(c) {
  return `rgb(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)})`;
}

export { EFFECTS, EFFECT_INDEX };
