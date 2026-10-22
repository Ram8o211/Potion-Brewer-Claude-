// The hutch, in the Trials room: the colony of Moon Rabbits living their
// lives in a little scene (tap one to choose it), a roster of every rabbit
// and body, what the chosen one looks like in words, and what to do —
// buy, feed, let them breed, look back at a rabbit's trials (and replay
// them), recover a body's remains or bury it. Nothing here shows a hidden
// number: rabbits are described, never measured.

import { h, btn, clear, toast, modal, confirmDialog } from '../dom.js';
import { icon } from '../icons.js';
import { audio } from '../../audio/audio.js';
import { drawRabbit, RABBIT_W, RABBIT_H } from '../../rendering/rabbit.js';
import { HutchScene, HUTCH_W, HUTCH_H } from '../../rendering/hutch-scene.js';
import { livingRabbits, bodies, rabbitSnap, rabbitCondition, stageOf, findRabbit, colonyDay, TRAIT_WORDS } from '../../game/colony.js';

const STAGE_WORD = { kit: 'kit', young: 'youngster', adult: 'adult', elder: 'elder' };

export class HutchPanel {
  /** @param {import('./trials.js').TrialsView} view */
  constructor(view) {
    this.view = view;
    this.lab = view.lab;
    this.el = h('div', { class: 'card parch hutch' });
    this.scene = new HutchScene();
    /** @type {Record<string, {tile:HTMLElement, cv:HTMLCanvasElement, ctx:CanvasRenderingContext2D, key:string}>} */
    this.tiles = {};
    this.hover = null;
    this._acc = 0;
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
    // ---- head: room, buying, feeding, breeding
    el.append(h('div', { class: 'row wrap hutch-head' },
      icon('rabbit'), h('b', { text: 'The hutch' }), h('span', { class: 'small muted', text: `${live.length} of ${cap} places` }),
      h('span', { class: 'spacer' }),
      btn(price ? `Buy · ${price}` : 'Buy', () => this.buy(), { icon: 'plus', act: 'colony-buy', disabled: full || (!lab.sandbox && st.coins < price), title: full ? `The hutch is full (${cap} places): upgrade it at the guild.` : 'Buy an adult rabbit from the breeder' }),
      btn(fed ? 'Fed' : lab.sandbox ? 'Feed' : `Feed · ${st.feedCost()}`, () => this.feed(), { icon: 'leaf', act: 'colony-feed', disabled: fed || !live.length, title: 'Hay and greens: they recover faster and pair up more readily tonight' }),
      btn(c.breed ? 'Breeding on' : 'Breeding off', () => this.toggleBreed(), { icon: 'nest', cls: c.breed ? 'active' : '', act: 'colony-breed', title: 'Let healthy, unrelated adults pair up overnight' }),
      lab.sandbox ? btn('Next day', () => this.nextDay(), { icon: 'clock', act: 'colony-day', title: 'Let a night pass in the hutch' }) : null));
    // ---- the scene: rabbits going about their lives
    this.canvas = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(HUTCH_W), height: String(HUTCH_H), class: 'hutch-scene', role: 'img', 'aria-label': `The hutch: ${live.length} rabbits${bodies(c).length ? ` and ${bodies(c).length} bodies` : ''}. Tap a rabbit to choose it.` }));
    this.ctx = /** @type {CanvasRenderingContext2D} */ (this.canvas.getContext('2d'));
    this.canvas.addEventListener('pointerdown', (e) => this.tapScene(e));
    this.canvas.addEventListener('pointermove', (e) => { this.hover = this.hitAt(e); });
    this.canvas.addEventListener('pointerleave', () => { this.hover = null; });
    el.append(h('div', { class: 'hutch-scene-wrap' }, this.canvas));
    this.syncScene();
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
        if (r.pregnant) tags.push(icon('nest', 'sm'));
        if (r.marks.love >= 8) tags.push(icon('heart', 'sm'));
      }
      const tile = h('button', {
        class: 'rabbit-tile' + (sel ? ' selected' : '') + (r.alive ? '' : ' dead') + (stageOf(r, st.day) === 'kit' ? ' kit' : ''),
        'data-rabbit': r.id, 'data-subject': 'rabbit', role: 'option', 'aria-selected': sel ? 'true' : 'false',
        'aria-label': `${r.name}, ${r.sex === 'f' ? 'doe' : 'buck'}: ${rabbitCondition(r, st.day).join(', ')}`,
      }, cv, h('span', { class: 'rt-name', text: r.name }), h('span', { class: 'rt-tags' }, ...tags));
      tile.addEventListener('click', () => this.view.select(r.id));
      this.tiles[r.id] = { tile, cv, ctx: /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d')), key: '' };
      tiles.appendChild(tile);
    }
    if (!c.rabbits.length) tiles.appendChild(h('div', { class: 'small muted', text: 'The hutch is empty. Buy a rabbit to test potions on.' }));
    el.append(tiles);
    // ---- the chosen rabbit
    const f = findRabbit(c, c.focus);
    if (f) el.append(this.detail(f));
    if (c.memorial.length) el.append(h('div', { class: 'small muted memorial', text: `Remembered: ${c.memorial.slice(0, 6).map((m) => m.name).join(', ')}${c.memorial.length > 6 ? '…' : ''}` }));
    this.drawTiles(0, true);
  }

  /** @param {any} r */
  detail(r) {
    const st = this.st;
    const stage = stageOf(r, st.day);
    const age = st.day - r.born;
    const parents = (r.parents || []).map((id) => (findRabbit(st.colony, id) || st.colony.memorial.find((m) => m.id === id) || { name: '' }).name).filter(Boolean);
    const words = rabbitCondition(r, st.day);
    const actions = [btn('History', () => this.history(r), { icon: 'scroll', act: 'rabbit-history', disabled: !r.doses.length })];
    if (!r.alive) {
      actions.push(btn('Recover remains', () => this.remains(r), { icon: 'bone', cls: 'gold', act: 'rabbit-remains' }));
      actions.push(btn('Bury', () => this.bury(r), { icon: 'trash', cls: 'danger', act: 'rabbit-bury' }));
    }
    return h('div', { class: 'rabbit-detail' },
      h('div', { class: 'rd-title' }, h('b', { text: r.name }), h('span', { class: 'small muted', text: ` ${r.sex === 'f' ? 'doe' : 'buck'} · ${STAGE_WORD[stage]}${r.alive ? ` · ${age >= 0 ? `${age} day${age === 1 ? '' : 's'} old` : 'grown'}` : ''}` })),
      h('div', { class: 'small', text: words.join(' · ') }),
      h('div', { class: 'small muted', text: `${r.trials} trial${r.trials === 1 ? '' : 's'}${parents.length ? ` · child of ${parents.join(' and ')}` : ''}` }),
      h('div', { class: 'row wrap rd-actions' }, ...actions));
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
  }
}
