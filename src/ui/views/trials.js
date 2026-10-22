// The trials room: give measured doses of the brew (or of a sealed vial) to
// test subjects and watch what happens. Every dose is real matter removed
// from the cauldron tap or the vial. A subject reveals only the effects it
// responds to; the report compares what was observed with the guild's naive
// theory, so surprises point at hidden laws. The Moon Rabbits are a colony
// of individuals (the hutch below the subjects); the rabbit card shows the
// chosen one, and a rabbit's trial can be replayed without spending a drop.

import { h, btn, clear, toast } from '../dom.js';
import { icon } from '../icons.js';
import { audio } from '../../audio/audio.js';
import { SUBJECTS, SUBJECT_BY_ID, DOSES, missingEffects, suggestSubjects } from '../../game/experiments.js';
import { EFFECTS, EFFECT_BY_KEY, EFFECT_INDEX, potencyWord } from '../../alchemy/effects.js';
import { drawSubject, SUBJECT_W, SUBJECT_H } from '../../rendering/scenes.js';
import { SIM } from '../../simulation/constants.js';
import { applyTrials } from '../../game/commerce.js';
import { drawRabbit } from '../../rendering/rabbit.js';
import { focusRabbit, findRabbit, rabbitSnap, decodeSnap, stageOf, lookFromSeed, RABBIT_MARKS } from '../../game/colony.js';
import { HutchPanel } from './hutch.js';

const STAGE_WORD = { kit: 'kit', young: 'youngster', adult: 'adult', elder: 'elder' };
/** how long a replay runs (s) */
const REPLAY_T = 3.2;

export class TrialsView {
  /** @param {import('../lab.js').LabScreen} lab */
  constructor(lab) {
    this.lab = lab;
    this.el = h('section', { class: 'view view-trials', 'data-view': 'trials' });
    this.cards = {};
    this.react = {};
    this.time = 0;
    this.last = null;
    this.drag = null;
    /** per-rabbit reaction flash (by rabbit id) */
    /** @type {Record<string, number>} */
    this.rreact = {};
    /** a trial being replayed on the rabbit card: no state changes, no doses */
    /** @type {{rec:any, t:number}|null} */
    this.replay = null;
    this.hutch = new HutchPanel(this);
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

  build() {
    const lab = this.lab, st = lab.state;
    const el = clear(this.el);
    this.head = h('div', { class: 'trials-head card parch' });
    this.status = h('div', { class: 'trials-status small' });
    this.dropper = h('div', { class: 'dropper', role: 'button', tabindex: '0', 'aria-label': 'Dropper: drag onto a subject to give it the dose' }, icon('dropper', 'lg'), h('span', { class: 'small', text: 'Drag onto a subject' }));
    this.bindDropper();
    const grid = h('div', { class: 'subjects' });
    this.cards = {};
    for (const s of SUBJECTS) {
      if (!lab.sandbox && !st.subjectAvailable(s.id)) {
        grid.appendChild(h('div', { class: 'subject locked parch' }, icon('lock'), h('div', { class: 'small', text: `${s.name}: buy the ${s.needs === 'lantern' ? 'Wisp Lantern' : s.needs} at the guild` })));
        continue;
      }
      const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(SUBJECT_W), height: String(SUBJECT_H), class: 'subject-art', 'aria-hidden': 'true' }));
      const hp = h('i');
      const btnTest = btn('Test', () => this.test(s.id), { cls: 'primary', icon: 'dropper', act: 'test-' + s.id });
      const btnReplace = btn('Replace', () => this.replace(s.id), { icon: 'plus', act: 'replace-' + s.id });
      const reveals = h('div', { class: 'reveals', title: 'Responds to' }, ...s.reveals.map((k) => icon(EFFECT_BY_KEY[k].icon, 'sm')));
      const sub = s.id === 'rabbit' ? h('div', { class: 'subject-sub small' }) : null;
      const card = h('div', { class: 'subject parch', 'data-subject': s.id },
        cv,
        h('div', { class: 'subject-name', text: s.name }),
        sub,
        h('div', { class: 'bar hp' }, hp),
        reveals,
        h('div', { class: 'subject-actions' }, btnTest, btnReplace));
      this.cards[s.id] = { card, cv, ctx: cv.getContext('2d'), hp, btnTest, btnReplace, sub };
      grid.appendChild(card);
    }
    this.report = h('div', { class: 'trial-report' });
    el.append(this.head, this.status, h('div', { class: 'dropper-row' }, this.dropper, h('div', { class: 'small muted', text: 'or press Test on a subject' })), grid, this.hutch.el, this.report);
    if (!lab.sandbox && st.firstTip('colony')) toast('The rabbit hutch', 'Your Moon Rabbits are a colony now: choose one to dose, keep them fed, and healthy pairs have kits overnight.', 'rabbit', 6500);
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

  /** Replay a rabbit trial on the rabbit card (nothing is consumed or changed). @param {any} rec */
  startReplay(rec) {
    if (!rec || !rec.replay) return;
    this.replay = { rec, t: 0 };
    this.last = rec;
    this.renderReport();
    const ol = this.report.querySelector('.obs-list');
    if (ol) ol.classList.add('replaying');
    audio.play(rec.died ? 'toll' : 'squeak');
    const card = this.cards.rabbit && this.cards.rabbit.card;
    if (card && card.scrollIntoView) card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
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
    head.append(h('div', { class: 'row wrap' }, seg), h('div', { class: 'row wrap' }, doses));
    if (st.vial) {
      // the iterate loop: test the vial, pour the rest back, improve, bottle again
      head.append(h('div', { class: 'row wrap vial-row' },
        h('span', { class: 'small muted', text: `Vial: ${Math.round(st.vial.ml)} ml of ${Math.round(st.vial.bottledMl || st.vial.ml)} ml bottled` }),
        btn('Pour back', () => lab.pourBackVial(), { icon: 'pour', act: 'trials-pour-back', title: 'Return the rest of the vial to the cauldron' }),
        btn('Discard', () => { lab.discardVial(); this.refresh(); }, { icon: 'trash', cls: 'danger', act: 'trials-discard' })));
    }
    // ---- what this batch is known to do
    const status = clear(this.status);
    const cert = src === 'vial' ? { values: st.vial.cert || {}, stale: [], changed: false } : lab.currentCert();
    const known = Object.entries(cert.values);
    const com = st.current;
    const need = com ? missingEffects(com, cert.values) : [];
    status.append(h('div', { class: 'row wrap' },
      h('b', { text: src === 'vial' ? 'This vial: ' : 'This batch: ' }),
      known.length ? known.map(([k, v]) => h('span', { class: 'fx-chip', title: EFFECT_BY_KEY[k].label }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ` ${Math.round(v)}`)) : h('span', { class: 'muted', text: 'effects unknown — nothing tested yet' })));
    if (cert.changed && src === 'cauldron') status.append(h('div', { class: 'warn small', text: 'Earlier trials of this batch are outdated: you added ingredients since.' }));
    if (cert.stale.length) status.append(h('div', { class: 'warn small', text: `The brew has changed since it was tested (${cert.stale.map((k) => EFFECT_BY_KEY[k].label).join(', ')}): reactions, heat or settling. Test again.` }));
    if (com && need.length) {
      const sugg = suggestSubjects(need, (id) => lab.sandbox || st.subjectAvailable(id)).map((id) => SUBJECT_BY_ID[id].name);
      status.append(h('div', { class: 'small' }, h('span', { text: `The order still needs: ` }), ...need.map((k) => h('span', { class: 'fx-chip need' }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ' ' + EFFECT_BY_KEY[k].label)), sugg.length ? h('span', { class: 'muted', text: ` · try the ${sugg.join(' and the ')}` }) : null));
    } else if (com && com.effectOrder) {
      status.append(h('div', { class: 'ok small', text: 'Every effect the order asks about has been verified for this ' + (src === 'vial' ? 'vial.' : 'batch.') }));
    }
    // ---- subject cards
    const avail = this.available();
    const dose = Math.min(lab.trialDose, avail);
    for (const [id, c] of Object.entries(this.cards)) {
      const s = st.trials.subjects[id];
      // a rabbit's health shows only as a coarse band (rabbits are described, not measured)
      const band = id === 'rabbit' ? rabbitSnap(s, st.day).hp : -1;
      const hp = band >= 0 ? [100, 60, 30, 8][band] : s.health;
      c.hp.style.width = Math.round(s.alive ? hp : 0) + '%';
      c.hp.style.background = hp > 60 ? '#7dc24a' : hp > 25 ? '#f0b84a' : '#e0402c';
      c.card.classList.toggle('spent', !s.alive);
      c.btnTest.disabled = !s.alive || dose < SIM.ML_PER_PARTICLE;
      const lbl = c.btnTest.querySelector('.lbl');
      if (lbl) lbl.textContent = `Test ${Math.max(SIM.ML_PER_PARTICLE, Math.floor(dose / SIM.ML_PER_PARTICLE) * SIM.ML_PER_PARTICLE)} ml`;
      const cost = lab.sandbox ? 0 : Math.ceil(SUBJECT_BY_ID[id].cost * (st.has('kennel') ? 0.5 : 1));
      c.btnReplace.classList.toggle('hidden', s.alive);
      const rl = c.btnReplace.querySelector('.lbl');
      if (rl) rl.textContent = id === 'rabbit' ? (cost ? `New rabbit · ${cost}` : 'New rabbit') : cost ? `Replace · ${cost}` : 'Replace';
      if (id === 'rabbit' && c.sub) {
        const r = focusRabbit(st.colony);
        c.sub.textContent = r ? `${r.name} · ${r.sex === 'f' ? 'doe' : 'buck'} · ${r.alive ? STAGE_WORD[stageOf(r, st.day)] : 'dead'}` : 'no rabbit';
        c.card.classList.toggle('rabbit-dead', !!r && !r.alive);
      }
    }
    this.hutch.render();
    this.renderReport();
  }

  renderReport() {
    const lab = this.lab, st = lab.state;
    const r = this.last || st.trials.records[0];
    const el = clear(this.report);
    if (!r) {
      el.append(h('div', { class: 'card parch small', text: 'A mixture’s effects are unknown until you test it. You know what each plain ingredient does — but mixing, heat and reactions change things. Give a dose to a subject that responds to the effects you care about.' }));
      return;
    }
    const subj = SUBJECT_BY_ID[r.subjectId];
    const rows = h('div', { class: 'reading-rows' });
    for (const key of r.revealed) {
      const e = EFFECT_BY_KEY[key];
      const v = r.values[key], th = r.theory[key] ?? 0;
      const anomaly = r.anomalies.includes(key);
      const width = (x) => Math.min(100, Math.abs(x)) + '%';
      const err = r.err && r.err[key] !== undefined ? Math.max(1, Math.round(r.err[key])) : 0;
      rows.appendChild(h('div', { class: 'reading' + (anomaly ? ' anomaly' : ''), title: e.desc },
        icon(e.icon, 'sm'), h('span', { class: 'rk', text: e.label }),
        h('div', { class: 'rbar' }, h('i', { class: 'obs', style: { width: width(v), background: rgb(e.color) } }), h('i', { class: 'th', style: { left: width(th) } })),
        h('span', { class: 'rv', text: v === 0 ? (err ? `none · ±${err}` : 'none') : `${Math.round(v)}${err ? ` ±${err}` : ''} · ${potencyWord(v, key)}` })));
    }
    const laws = r.lawsFound.map((id) => (st.world.laws || []).find((l) => l.id === id)).filter(Boolean);
    const who = r.rabbitName ? `${r.rabbitName} (${subj.name})` : subj.name;
    const body = r.rabbitId ? findRabbit(st.colony, r.rabbitId) : null;
    el.append(h('div', { class: 'card parch report' },
      h('div', { class: 'row' }, icon('dropper'), h('b', { text: `Trial ${r.serial}: ${who}` }), h('span', { class: 'spacer' }), h('span', { class: 'small muted', text: `${r.ml} ml from the ${r.source === 'vial' ? 'vial' : 'tap'}` })),
      h('ul', { class: 'obs-list' }, ...r.observations.map((o) => h('li', { class: 'tone-' + o.tone, text: o.text }))),
      rows,
      h('div', { class: 'small muted', text: `Bar: observed${r.err ? ' (± how sure the reading is: small doses and young or old animals read less precisely)' : ''}. Tick: what the guild’s theory predicts from the known ingredients.` }),
      r.anomalies.length ? h('div', { class: 'warn small', text: `Unexpected: ${r.anomalies.map((k) => EFFECT_BY_KEY[k].label).join(', ')} differs from theory. Something in this mixture interacts — repeat with variations to find out what.` }) : null,
      ...laws.map((L) => h('div', { class: 'law-found' }, icon('star'), h('div', {}, h('b', { text: `Law discovered: ${L.name}` }), h('div', { class: 'small', text: L.lore + ' Your theory now accounts for it.' })))),
      r.died ? h('div', { class: 'bad small', text: r.rabbitName ? `${r.rabbitName} did not survive. ${body ? 'The body stays in the hutch: recover its remains or bury it.' : ''} A potion that kills a rabbit should not be sold as a remedy.` : 'The subject did not survive. A potion that kills a rabbit should not be sold as a remedy.' }) : null,
      r.replay ? h('div', { class: 'row' }, btn('Replay', () => this.startReplay(r), { icon: 'eye', act: 'replay-trial', title: 'Watch this trial again — nothing is used up' })) : null,
    ));
  }

  /** @param {string} id */
  test(id) {
    const lab = this.lab, st = lab.state;
    const s = st.trials.subjects[id];
    if (!s || !s.alive) {
      toast(id === 'rabbit' ? 'Choose a living rabbit' : 'This subject is spent', id === 'rabbit' ? 'The chosen rabbit is dead: pick another in the hutch, or buy one.' : 'Replace it for a fresh trial.', id === 'rabbit' ? 'rabbit' : 'close');
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
        ctx = { ml, source: 'vial', batchId: st.vial ? st.vial.batchId : r.batchId, rev: st.vial ? st.vial.rev : r.rev, theory: r.theory, parts: r.parts };
      } else {
        const r = lab.drawDose(want);
        if (!r) { toast('Nothing to test', 'Pour and mix a brew first; the dose is drawn from the tap at the bottom.', 'flask'); return; }
        ({ dose, ml } = r);
        ctx = { ml, source: 'cauldron', batchId: st.batch.id, rev: st.batch.rev, theory: lab.theory(), parts: lab.batchParts() };
      }
      const rabbit = id === 'rabbit' ? focusRabbit(st.colony) : null;
      if (rabbit) /** @type {any} */ (ctx).rabbitId = rabbit.id;
      const { record, events } = st.recordTrial(id, dose, ctx);
      if (this.source === 'vial' && st.vial) {
        // the vial is sealed: its certificate grows with every trial of it
        st.vial.cert = { ...(st.vial.cert || {}), ...record.values };
        st.vial.certRecords = { ...(st.vial.certRecords || {}), ...Object.fromEntries(Object.keys(record.values).map((k) => [k, record.id])) };
        if (st.vial.label) applyTrials(st.vial.label, record.values, record.id);
      }
      this.last = record;
      this.replay = null;
      this.react[id] = 1;
      if (rabbit) {
        this.rreact[rabbit.id] = 1;
        this.hutch.poke(rabbit.id, record.replay && record.replay.rx ? record.replay.rx.split(',') : []);
        audio.play(record.died ? 'toll' : record.observations.some((o) => o.tone === 'bad') ? 'thump' : 'squeak');
      } else audio.play(record.died ? 'fail' : record.observations.some((o) => o.tone === 'bad') ? 'crush' : 'discover');
      for (const e of events) {
        if (e.type === 'law') { toast(`Law discovered: ${e.name}`, e.lore, 'star', 6000); audio.play('fanfare'); }
        else if (e.type === 'rabbit-died') toast(`${e.name} died`, 'The body stays in the hutch. Recover its remains — once — or bury it.', 'skull', 5000);
        else lab.announce(e);
      }
      if (lab.tutorial) lab.tutorial.notify('trial', id);
      lab.save();
    } catch (e) {
      toast('Cannot test', String(e && e.message), 'close');
    }
    // re-measure now so the certificate this trial earned shows at once
    lab.updateAssay(true);
    this.refresh();
    lab.refreshCustomer();
    lab.views.counter.refresh();
    lab.updateBadges();
    // on a phone the report sits below the subjects: bring it into view
    if (this.report && this.report.scrollIntoView) this.report.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
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

  bindDropper() {
    const d = this.dropper;
    let ghost = null;
    const target = (x, y) => {
      const el = document.elementFromPoint(x, y);
      // a rabbit in the hutch scene is a target too
      if (el && el === this.hutch.canvas) {
        const id = this.hutch.hitAt(/** @type {any} */ ({ clientX: x, clientY: y }));
        return id ? 'rabbit:' + id : null;
      }
      const card = el && /** @type {HTMLElement} */ (el).closest ? /** @type {HTMLElement} */ (el).closest('[data-subject]') : null;
      if (card && card.hasAttribute('data-rabbit')) return 'rabbit:' + card.getAttribute('data-rabbit');
      return card ? card.getAttribute('data-subject') : null;
    };
    const targets = () => [...Object.entries(this.cards).map(([k, c]) => /** @type {[string, HTMLElement]} */ ([k, c.card])), ...Object.entries(this.hutch.tiles).map(([k, t]) => /** @type {[string, HTMLElement]} */ (['rabbit:' + k, t.tile]))];
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
      this.hutch.hover = id && id.startsWith('rabbit:') ? id.slice(7) : null;
    };
    const end = (e) => {
      if (!this.drag) return;
      this.drag = null;
      if (ghost) ghost.remove();
      ghost = null;
      for (const [, el] of targets()) el.classList.remove('drop-hover');
      const id = target(e.clientX, e.clientY);
      if (id && id.startsWith('rabbit:')) {
        // dropped on a rabbit in the roster: choose it, then dose it
        const r = findRabbit(this.lab.state.colony, id.slice(7));
        if (r && !r.alive) { this.select(r.id); toast(`${r.name} is dead`, 'Choose a living rabbit to dose.', 'skull'); return; }
        this.lab.state.selectRabbit(id.slice(7));
        this.test('rabbit');
      } else if (id) this.test(id);
    };
    d.addEventListener('pointermove', move);
    d.addEventListener('pointerup', end);
    d.addEventListener('pointercancel', () => { this.drag = null; if (ghost) ghost.remove(); ghost = null; });
    d.addEventListener('keydown', (e) => { if (e.key === 'Enter') toast('Dropper', 'Use the Test buttons on the subjects.', 'dropper'); });
  }

  /** Animate the subjects (only while visible). @param {number} dt */
  frame(dt) {
    this.time += dt;
    const st = this.lab.state;
    const low = this.lab.effectiveQuality() === 'low';
    for (const [id, c] of Object.entries(this.cards)) {
      const r = this.react[id] || 0;
      if (id === 'rabbit') this.drawRabbitCard(c, dt, low);
      else drawSubject(c.ctx, id, st.trials.subjects[id], this.time, r);
      if (r > 0) this.react[id] = Math.max(0, r - dt * 1.4);
    }
    for (const [rid, r] of Object.entries(this.rreact)) if (r > 0) this.rreact[rid] = Math.max(0, r - dt * 1.4);
    this.hutch.frame(dt, this.time);
  }

  /**
   * The rabbit card: the chosen rabbit, or a replay — the rabbit as it was
   * before the dose, then the change, from the trial's own snapshots.
   * @param {any} c @param {number} dt @param {boolean} low
   */
  drawRabbitCard(c, dt, low) {
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
      if (rp.t < 0.6) drawRabbit(c.ctx, look, before, this.time, 0, { quality });
      else {
        // a death plays out: collapse first, then the body
        const dying = before.alive && !after.alive && rp.t < 1.3;
        const snap = dying ? { ...after, alive: true, hp: /** @type {3} */ (3) } : after;
        drawRabbit(c.ctx, look, snap, this.time, Math.max(0, 1 - (rp.t - 0.6) * 1.2), { quality, react });
      }
      if (rp.t > REPLAY_T) {
        this.replay = null;
        const ol = this.report && this.report.querySelector('.obs-list');
        if (ol) ol.classList.remove('replaying');
      }
      return;
    }
    const r = focusRabbit(st.colony);
    if (!r) { c.ctx.clearRect(0, 0, c.cv.width, c.cv.height); return; }
    const react = this.rreact[r.id] || 0;
    const last = react > 0 && this.last && this.last.rabbitId === r.id && this.last.replay ? this.last.replay.rx.split(',').filter((k) => RABBIT_MARKS.includes(k)) : [];
    drawRabbit(c.ctx, r.look, rabbitSnap(r, st.day), this.time, react, { quality, react: last });
  }
}

/** @param {number[]} c */
function rgb(c) {
  return `rgb(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)})`;
}

export { EFFECTS, EFFECT_INDEX };
