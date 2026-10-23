// The farm: the colony of Moon Rabbits is where every potion is tested. The
// hutch scene (tap a rabbit to choose it, or drag the dropper onto it), a
// roster of every rabbit and body with its health, and the chosen rabbit up
// close: its health, a bar per effect channel showing how much of it is
// active in the rabbit right now (where that rabbit degenerates or turns
// aggressive is never shown: every rabbit has its own, hidden, thresholds),
// and what to do — give it a
// dose, purge it, put it down, look back at its trials, recover a body's
// remains or bury it. Buying, feeding, breeding and the purging draughts
// live in the head of the panel.

import { readingSteadiness } from '../../game/experiments.js';
import { h, btn, clear, toast, modal, confirmDialog } from '../dom.js';
import { icon } from '../icons.js';
import { audio } from '../../audio/audio.js';
import { drawRabbit, RABBIT_W, RABBIT_H } from '../../rendering/rabbit.js';
import { HutchScene, HUTCH_W, HUTCH_H } from '../../rendering/hutch-scene.js';
import { EFFECT_BY_KEY } from '../../alchemy/effects.js';
import {
  livingRabbits, bodies, rabbitSnap, rabbitCondition, stageOf, findRabbit, colonyDay, maxHealthOf, degenOf, isFeral,
  RABBIT_MARKS, LETHAL, TRAIT_WORDS, LOVE_MATE, BURNS,
} from '../../game/colony.js';
import { PURGE_BREW_TIME } from '../../game/state.js';

const STAGE_WORD = { kit: 'kit', young: 'youngster', adult: 'adult', elder: 'elder' };
/** Status channels as shown: label, icon and colour. */
export const CHANNELS = RABBIT_MARKS.map((k) => {
  const e = EFFECT_BY_KEY[k === 'acid' || k === 'alkali' ? 'acidity' : k];
  return { key: k, label: k === 'acid' ? 'Acid' : k === 'alkali' ? 'Lye' : e.label, icon: e.icon, color: k === 'alkali' ? [0.78, 0.76, 0.66] : e.color };
});

/** @param {number[]} c */
const rgb = (c) => `rgb(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)})`;

export class HutchPanel {
  /** @param {import('./trials.js').TrialsView} view */
  constructor(view) {
    this.view = view;
    this.lab = view.lab;
    this.el = h('div', { class: 'card parch hutch' });
    this.scene = new HutchScene();
    /** @type {Record<string, {tile:HTMLElement, cv:HTMLCanvasElement, ctx:CanvasRenderingContext2D, key:string, hp:HTMLElement}>} */
    this.tiles = {};
    this.hover = null;
    this._acc = 0;
    this._live = 0;
    /** @type {{portrait?:CanvasRenderingContext2D, hp?:HTMLElement, hpText?:HTMLElement, bars?:Record<string, {fill:HTMLElement, row:HTMLElement, val:HTMLElement}>, id?:string, still?:HTMLElement}} */
    this.d = {};
  }

  get st() {
    return this.lab.state;
  }

  /** Rebuild the panel from the colony (event-driven, not per frame). */
  render() {
    const lab = this.lab, st = this.st, c = st.colony;
    const el = clear(this.el);
    const live = livingRabbits(c);
    const cap = st.cap.hutch;
    const price = lab.sandbox ? 0 : st.rabbitPrice();
    const full = live.length >= cap;
    const fed = c.fedDay === st.day;
    const feral = live.filter((r) => isFeral(r));
    // ---- head: room, buying, feeding, breeding
    el.append(h('div', { class: 'row wrap hutch-head' },
      icon('rabbit'), h('b', { text: 'The hutch' }), h('span', { class: 'small muted', text: `${live.length} of ${cap} places` }),
      feral.length ? h('span', { class: 'feral-warn small' }, icon('claw', 'sm'), ` ${feral.map((r) => r.name).join(', ')} attacking the others!`) : null));
    const manage = [h('div', { class: 'hutch-actions' },
      btn(price ? `Buy · ${price}` : 'Buy', () => this.buy(), { icon: 'plus', act: 'colony-buy', disabled: full || (!lab.sandbox && st.coins < price), title: full ? `The hutch is full (${cap} places): upgrade it at the guild.` : 'Buy an adult rabbit from the breeder' }),
      btn(fed ? 'Fed' : lab.sandbox ? 'Feed' : `Feed · ${st.feedCost()}`, () => this.feed(), { icon: 'leaf', act: 'colony-feed', disabled: fed || !live.length, title: 'Hay and greens: they recover faster and pair up more readily tonight' }),
      btn(c.breed ? 'Breeding on' : 'Breeding off', () => this.toggleBreed(), { icon: 'nest', cls: c.breed ? 'active' : '', act: 'colony-breed', title: 'Let healthy, unrelated adults pair up overnight' }),
      lab.sandbox ? btn('Next day', () => this.nextDay(), { icon: 'clock', act: 'colony-day', title: 'Let a night pass in the hutch' }) : null)];
    // ---- purging draughts
    const brewing = c.still != null;
    this.d.still = h('span', { class: 'small muted still-state', text: '' });
    manage.push(h('div', { class: 'purge-row' },
      icon('purge'), h('b', { class: 'small', text: lab.sandbox ? 'Purges: unlimited' : `Purges: ${c.purges || 0}` }),
      h('span', { class: 'spacer' }),
      lab.sandbox ? null : btn(`Buy · ${st.purgePrice()}`, () => this.buyPurge(), { icon: 'coin', act: 'purge-buy', disabled: st.coins < st.purgePrice(), title: 'A purging draught from the apothecary: washes every potion effect out of a rabbit and stops degeneration' }),
      lab.sandbox ? null : (st.has('still')
        ? btn(brewing ? 'Brewing…' : 'Brew · 1', () => this.brewPurge(), { icon: 'alembic', act: 'purge-brew', disabled: brewing || st.coins < 1, title: 'Brew a purging draught in your still' })
        : h('span', { class: 'small muted', text: 'Brew your own with the Purging Still (guild)' })),
      this.d.still));
    // ---- the scene: rabbits going about their lives
    this.canvas = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(HUTCH_W), height: String(HUTCH_H), class: 'hutch-scene', role: 'img', 'aria-label': `The hutch: ${live.length} rabbits${bodies(c).length ? ` and ${bodies(c).length} bodies` : ''}. Tap a rabbit to choose it.` }));
    this.ctx = /** @type {CanvasRenderingContext2D} */ (this.canvas.getContext('2d'));
    this.canvas.addEventListener('pointerdown', (e) => this.tapScene(e));
    this.canvas.addEventListener('pointermove', (e) => { this.hover = this.hitAt(e); });
    this.canvas.addEventListener('pointerleave', () => { this.hover = null; });
    el.append(h('div', { class: 'hutch-scene-wrap' }, this.canvas));
    this.syncScene();
    // ---- dose the chosen rabbit right here
    const chosen = findRabbit(c, c.focus);
    const view = this.view, dose = view.doseMl(), avail = view.available();
    if (chosen && chosen.alive) {
      el.append(h('div', { class: 'dose-bar' },
        view.dropper,
        btn(`Give ${dose} ml to ${chosen.name}`, () => view.test('rabbit'), { cls: 'primary', icon: 'dropper', act: 'test-rabbit', disabled: dose <= 0 || avail <= 0, title: `Give ${chosen.name} ${dose} ml from the ${view.source === 'vial' ? 'sealed vial' : 'cauldron tap'}` })));
    } else if (chosen) {
      el.append(h('div', { class: 'dose-bar' }, h('span', { class: 'small', text: `${chosen.name} is dead: choose a living rabbit to dose.` })));
    }
    // ---- the roster
    const tiles = h('div', { class: 'rabbit-tiles', role: 'listbox', 'aria-label': 'Rabbits' });
    this.tiles = {};
    const order = { adult: 0, elder: 1, young: 2, kit: 3 };
    const list = c.rabbits.slice().sort((a, b) => (a.alive === b.alive ? 0 : a.alive ? -1 : 1) || order[stageOf(a, st.day)] - order[stageOf(b, st.day)]);
    for (const r of list) {
      const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(RABBIT_W), height: String(RABBIT_H), class: 'rabbit-art', 'aria-hidden': 'true' }));
      const sel = r.id === c.focus;
      const tags = [];
      if (!r.alive) tags.push(icon('skull', 'sm'));
      else {
        if (isFeral(r)) tags.push(icon('claw', 'sm'));
        else if (degenOf(r).length) tags.push(icon('skull', 'sm'));
        if (r.pregnant) tags.push(icon('nest', 'sm'));
        if (r.marks.love >= 8) tags.push(icon('heart', 'sm'));
      }
      const hp = h('i');
      const tile = h('button', {
        class: 'rabbit-tile' + (sel ? ' selected' : '') + (r.alive ? '' : ' dead') + (stageOf(r, st.day) === 'kit' ? ' kit' : '') + (isFeral(r) ? ' feral' : degenOf(r).length ? ' degen' : ''),
        'data-rabbit': r.id, 'data-subject': 'rabbit', role: 'option', 'aria-selected': sel ? 'true' : 'false',
        'aria-label': `${r.name}, ${r.sex === 'f' ? 'doe' : 'buck'}: ${rabbitCondition(r, st.day).join(', ')}`,
      }, cv, h('span', { class: 'rt-name', text: r.name }), r.alive ? h('span', { class: 'bar hp rt-hp' }, hp) : null, h('span', { class: 'rt-tags' }, ...tags));
      tile.addEventListener('click', () => this.view.select(r.id));
      this.tiles[r.id] = { tile, cv, ctx: /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d')), key: '', hp };
      tiles.appendChild(tile);
    }
    if (!c.rabbits.length) tiles.appendChild(h('div', { class: 'small muted', text: 'The hutch is empty. Buy a rabbit to test potions on.' }));
    el.append(tiles);
    // ---- the chosen rabbit
    const f = findRabbit(c, c.focus);
    this.d = { still: this.d.still };
    if (f) el.append(this.detail(f));
    el.append(h('div', { class: 'hutch-manage' }, ...manage));
    if (c.memorial.length) el.append(h('div', { class: 'small muted memorial', text: `Remembered: ${c.memorial.slice(0, 6).map((m) => m.name).join(', ')}${c.memorial.length > 6 ? '…' : ''}` }));
    this.drawTiles(0, true);
    this.live();
  }

  /** @param {any} r */
  detail(r) {
    const lab = this.lab, st = this.st;
    const stage = stageOf(r, st.day);
    const age = st.day - r.born;
    const parents = (r.parents || []).map((id) => (findRabbit(st.colony, id) || st.colony.memorial.find((m) => m.id === id) || { name: '' }).name).filter(Boolean);
    const words = rabbitCondition(r, st.day);
    const portrait = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(RABBIT_W), height: String(RABBIT_H), class: 'rd-portrait', 'aria-hidden': 'true' }));
    this.d.portrait = /** @type {CanvasRenderingContext2D} */ (portrait.getContext('2d'));
    this.d.id = r.id;
    const view = this.view;
    const actions = [];
    if (r.alive) {
      actions.push(btn(lab.sandbox ? 'Purge' : `Purge (${st.colony.purges || 0})`, () => this.purge(r), { icon: 'purge', act: 'rabbit-purge', disabled: !lab.sandbox && !(st.colony.purges > 0), title: 'Give a purging draught: every effect washes out, degeneration stops' }));
      actions.push(btn('Put down', () => this.cull(r), { icon: 'knife', cls: 'danger', act: 'rabbit-cull', title: 'End its life now (the body stays for remains or burial)' }));
    } else {
      actions.push(btn('New rabbit', () => view.replace('rabbit'), { icon: 'plus', act: 'replace-rabbit' }));
      actions.push(btn('Recover remains', () => this.remains(r), { icon: 'bone', cls: 'gold', act: 'rabbit-remains' }));
      actions.push(btn('Bury', () => this.bury(r), { icon: 'trash', cls: 'danger', act: 'rabbit-bury' }));
    }
    actions.push(btn('History', () => this.history(r), { icon: 'scroll', act: 'rabbit-history', disabled: !r.doses.length }));
    // health and status bars
    const hpFill = h('i'), hpText = h('span', { class: 'small hp-text' });
    this.d.hp = hpFill; this.d.hpText = hpText;
    /** @type {Record<string, {fill:HTMLElement, row:HTMLElement, val:HTMLElement}>} */
    const bars = {};
    const grid = h('div', { class: 'status-bars', role: 'list', 'aria-label': `Effects active in ${r.name}` });
    for (const ch of CHANNELS) {
      const fill = h('i', { style: { background: rgb(ch.color) } });
      const val = h('span', { class: 'sb-v' });
      const burns = BURNS.includes(ch.key) ? ' While any of it is active it burns the rabbit, faster the higher it is.' : '';
      const row = h('div', { class: 'sb', role: 'listitem', title: `${ch.label} active in ${r.name}.${burns} Somewhere along this bar — only this rabbit knows where — it starts running out of control.` },
        icon(ch.icon, 'sm'), h('span', { class: 'sb-k', text: ch.label }), h('span', { class: 'sb-bar' }, fill), val);
      bars[ch.key] = { fill, row, val };
      grid.append(row);
    }
    this.d.bars = bars;
    const effects = h('div', { class: 'rd-effects' },
      h('div', { class: 'row rd-effects-head' }, h('b', { class: 'small', text: `Active in ${r.name}` }), h('span', { class: 'spacer' }), h('span', { class: 'small muted', text: 'its limits are hidden' })),
      grid);
    const out = h('div', { class: 'rabbit-detail' + (isFeral(r) ? ' feral' : '') },
      h('div', { class: 'rd-top' },
        portrait,
        h('div', { class: 'rd-info' },
          h('div', { class: 'rd-title' }, h('b', { text: r.name }), h('span', { class: 'small muted', text: ` ${r.sex === 'f' ? 'doe' : 'buck'} · ${STAGE_WORD[stage]}${r.alive ? ` · ${age >= 0 ? `${age} day${age === 1 ? '' : 's'} old` : 'grown'}` : ''}` })),
          h('div', { class: 'small', text: words.join(' · ') }),
          r.alive ? h('div', { class: 'rd-hp' }, icon('heart', 'sm'), h('span', { class: 'bar hp big' }, hpFill), hpText) : null,
          h('div', { class: 'small muted', text: `${r.trials} trial${r.trials === 1 ? '' : 's'}${parents.length ? ` · child of ${parents.join(' and ')}` : ''}` }),
          r.alive ? (() => { const k = readingSteadiness(r, st.day); return h('div', { class: 'small steadiness ' + (k <= 1.02 ? 'ok' : 'warn'), 'data-steadiness': String(Math.round(k * 100) / 100), title: 'How steady its readings are, from its age and health (its own hidden sensitivity is not in it)', text: k <= 1.02 ? 'Readings: steady' : k <= 1.2 ? 'Readings: a little unsteady' : 'Readings: shaky — hurt or very young or old' }); })() : null)),
      r.alive ? effects : null,
      h('div', { class: 'row wrap rd-actions' }, ...actions));
    return out;
  }

  /** Refresh the numbers that change in real time (bars, health, the still). */
  live() {
    const st = this.st, c = st.colony;
    for (const [id, t] of Object.entries(this.tiles)) {
      const r = findRabbit(c, id);
      if (!r || !r.alive || !t.hp) continue;
      const f = r.health / Math.max(1, maxHealthOf(r, st.day));
      t.hp.style.width = Math.round(100 * Math.max(0, Math.min(1, f))) + '%';
      t.hp.style.background = f > 0.6 ? '#7dc24a' : f > 0.25 ? '#f0b84a' : '#e0402c';
    }
    if (this.d.still) this.d.still.textContent = c.still != null ? `still: ${Math.ceil(c.still)} s` : '';
    const r = this.d.id ? findRabbit(c, this.d.id) : null;
    if (!r || !r.alive || !this.d.bars) return;
    const max = maxHealthOf(r, st.day), f = r.health / Math.max(1, max);
    if (this.d.hp) {
      this.d.hp.style.width = Math.round(100 * Math.max(0, Math.min(1, f))) + '%';
      this.d.hp.style.background = f > 0.6 ? '#7dc24a' : f > 0.25 ? '#f0b84a' : '#e0402c';
    }
    if (this.d.hpText) this.d.hpText.textContent = `${Math.max(0, Math.round(r.health))} / ${Math.round(max)}`;
    const dg = degenOf(r);
    for (const [k, b] of Object.entries(this.d.bars)) {
      const v = Math.max(0, Math.min(100, r.marks[k] || 0));
      b.fill.style.width = v.toFixed(1) + '%';
      b.val.textContent = v < 0.5 ? '—' : `${Math.round(v)}%`;
      b.row.classList.toggle('degen', dg.includes(k));
      b.row.classList.toggle('lethal', dg.includes(k) && LETHAL.includes(k));
      b.row.classList.toggle('mating', k === 'love' && v >= LOVE_MATE);
      b.row.classList.toggle('burning', BURNS.includes(k) && v >= 0.5);
      b.row.classList.toggle('zero', v < 0.5);
    }
  }

  syncScene() {
    const st = this.st;
    this.scene.sync(st.colony.rabbits.map((r) => ({ id: r.id, look: r.look, snap: rabbitSnap(r, st.day), mother: r.parents ? r.parents[0] : undefined })));
  }

  /** A dosed rabbit hops and flashes in the scene. @param {string} id @param {string[]} channels */
  poke(id, channels) {
    this.syncScene();
    this.scene.poke(id, channels);
  }

  /** @param {PointerEvent} e */
  hitAt(e) {
    if (!this.canvas) return null;
    const b = this.canvas.getBoundingClientRect();
    return this.scene.hit(((e.clientX - b.left) / b.width) * HUTCH_W, ((e.clientY - b.top) / b.height) * HUTCH_H);
  }

  /** @param {PointerEvent} e */
  tapScene(e) {
    const id = this.hitAt(e);
    if (id) this.view.select(id);
  }

  buy() {
    const lab = this.lab;
    const r = this.st.buyRabbit(lab.sandbox);
    if (!r.ok) { toast('No new rabbit', r.reason, 'rabbit'); audio.play('error'); return; }
    audio.play(r.cost ? 'coin' : 'squeak');
    this.after();
  }

  feed() {
    const lab = this.lab;
    const r = lab.sandbox ? (this.st.colony.fedDay = this.st.day, { ok: true, cost: 0 }) : this.st.feedRabbits();
    if (!r.ok) { toast('Not now', r.reason, 'leaf'); audio.play('error'); return; }
    audio.play('munch');
    this.after();
  }

  toggleBreed() {
    this.st.setBreeding(!this.st.colony.breed);
    audio.play('click');
    this.after();
  }

  buyPurge() {
    const r = this.st.buyPurge(this.lab.sandbox);
    if (!r.ok) { toast('No purge', r.reason, 'purge'); audio.play('error'); return; }
    audio.play('coin');
    this.after();
  }

  brewPurge() {
    const r = this.st.brewPurge(this.lab.sandbox);
    if (!r.ok) { toast('The still', r.reason, 'alembic'); audio.play('error'); return; }
    audio.play('pour');
    toast('The still is working', `A purging draught will be ready in ${PURGE_BREW_TIME} seconds.`, 'alembic', 2500);
    this.after();
  }

  /** @param {any} r */
  purge(r) {
    const res = this.st.purgeRabbit(r.id, this.lab.sandbox);
    if (!res.ok) { toast('No purge', res.reason, 'purge'); audio.play('error'); return; }
    audio.play('glass');
    this.view.rreact[r.id] = 1;
    toast(`${r.name} is purged`, 'Every potion effect washes out of it; anything degenerating has stopped, and so has any aggression or frenzy. What grew for good stays.', 'purge', 3500);
    this.after();
  }

  /** @param {any} r */
  async cull(r) {
    const feral = isFeral(r);
    if (!await confirmDialog(`Put ${r.name} down?`, feral ? `${r.name} is aggressive and is attacking the colony. The body stays: recover its remains or bury it.` : 'It dies at once. The body stays: recover its remains or bury it.', 'Put down', 'danger')) return;
    const res = this.st.cullRabbit(r.id);
    if (!res.ok) { toast('Cannot', res.reason, 'knife'); return; }
    audio.play('toll');
    this.after();
  }

  /** The sandbox never closes the shop: let a night pass by hand. */
  nextDay() {
    const st = this.st;
    st.day++;
    const rep = colonyDay(st.colony, { seed: st.seed, day: st.day, cap: st.cap.hutch });
    audio.play(rep.born.length ? 'birth' : rep.died.length ? 'toll' : 'page');
    const parts = [];
    if (rep.born.length) parts.push(`${rep.born.length} kit${rep.born.length > 1 ? 's' : ''} born`);
    if (rep.grown.length) parts.push(`${rep.grown.map((g) => g.name).join(', ')} grown up`);
    if (rep.died.length) parts.push(`${rep.died.map((d) => d.name).join(', ')} died`);
    toast(`Day ${st.day}`, parts.length ? parts.join(' · ') + '.' : 'A quiet night in the hutch.', 'clock', 3000);
    this.after();
  }

  /** @param {any} r */
  history(r) {
    const st = this.st;
    const rows = r.doses.slice().reverse().map((d) => {
      const rec = st.trials.records.find((x) => x.id === d.rec);
      const text = rec ? rec.observations.map((o) => o.text).join(' ') : d.obs ? `Showed: ${d.obs.replace(/[+-]/g, '').split(',').join(', ')}.` : 'No visible change.';
      return h('div', { class: 'history-row' + (d.died ? ' died' : '') },
        h('div', {}, h('b', { text: `Day ${d.day} · ${d.ml} ml from the ${d.src === 'vial' ? 'vial' : 'tap'}` }), h('div', { class: 'small', text })),
        rec && rec.replay ? btn('Replay', () => { m.close(); this.view.startReplay(rec); }, { icon: 'eye', act: 'replay-' + rec.id }) : null);
    });
    let m;
    m = modal({
      title: `${r.name}’s trials`,
      body: [h('div', { class: 'card parch history' }, ...(rows.length ? rows : [h('div', { class: 'small muted', text: 'No trials yet.' })]),
        r.dosesDropped ? h('div', { class: 'small muted', text: `…and ${r.dosesDropped} earlier.` }) : null)],
    });
  }

  /** @param {any} r */
  async remains(r) {
    const lab = this.lab;
    const traits = r.traits.length ? ` Its body still bears ${r.traits.map((t) => TRAIT_WORDS[t]).join(', ')}.` : '';
    if (!await confirmDialog(`Recover ${r.name}’s remains?`, `Bones, pelt or ash, and whatever residue is left become ingredients on your shelf — once. What ${r.sex === 'f' ? 'she' : 'he'} absorbed in life may linger in them; only trials will tell.${traits}`, 'Recover', 'gold')) return;
    const res = this.st.processRemains(r.id);
    if (!res.ok) { toast('Cannot', res.reason, 'bone'); return; }
    audio.play('crush');
    toast('Remains recovered', res.parts.map((p) => `${p.name} (${p.ml} ml)`).join(', '), 'bone', 5000);
    for (const e of res.events) if (e.type !== 'journal') lab.announce(e);
    lab.buildShelf();
    this.after();
  }

  /** @param {any} r */
  async bury(r) {
    if (!await confirmDialog(`Bury ${r.name}?`, 'Nothing is recovered.', 'Bury', 'danger')) return;
    this.st.buryRabbit(r.id);
    audio.play('toll');
    this.after();
  }

  after() {
    const lab = this.lab;
    lab.refreshHud();
    lab.save();
    this.view.refresh();
  }

  /**
   * Draw the tiles: only when their look changed, plus a slow idle for the
   * living (every few frames).
   * @param {number} t @param {boolean} [force]
   */
  drawTiles(t, force = false) {
    const st = this.st;
    for (const [id, tl] of Object.entries(this.tiles)) {
      const r = findRabbit(st.colony, id);
      if (!r) continue;
      const snap = rabbitSnap(r, st.day);
      const key = JSON.stringify(snap);
      if (!force && !r.alive && key === tl.key) continue;
      tl.key = key;
      drawRabbit(tl.ctx, r.look, snap, r.alive ? t : 0, this.view.rreact[id] || 0, { quality: this.lab.effectiveQuality() === 'low' ? 'low' : 'high' });
    }
  }

  /** @param {number} dt @param {number} t */
  frame(dt, t) {
    if (!this.ctx) return;
    const low = this.lab.effectiveQuality() === 'low';
    this.scene.update(dt);
    this.scene.draw(this.ctx, t, { selected: this.st.colony.focus, hover: this.hover, low });
    this._acc += dt;
    if (this._acc >= (low ? 0.2 : 0.1)) { this._acc = 0; this.drawTiles(t); }
    this._live += dt;
    if (this._live >= 0.25) { this._live = 0; this.live(); }
  }
}
