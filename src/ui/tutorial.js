// Guided first order. Each step is one short line in the coach bar — a row
// of the shop's own layout between the top bar and the rooms, so it never
// covers a control — and a pulsing outline on the control to use. Steps
// advance on what actually happens (a harvest, a pour, a dose, a sale).

import { h, btn, clear } from './dom.js';
import { icon } from './icons.js';
import { MAX_SPECIES } from '../reactions/species.js';
import { idComplete } from '../game/testing.js';

export class Tutorial {
  /** @param {import('./lab.js').LabScreen} lab */
  constructor(lab) {
    this.lab = lab;
    this.active = false;
    this.index = 0;
    this.target = null;
    this.flags = {};
    this.shown = -1;
  }

  get steps() {
    const lab = this.lab;
    const st = lab.state;
    const R = st.world.roles;
    const water = st.lookup(R.water), dew = st.lookup(R.dew);
    const volumeOf = (id) => {
      const s = lab.sim.species.slotOf.get(id);
      if (s === undefined) return 0;
      let t = 0;
      for (let i = 0; i < lab.sim.p.count; i++) t += lab.sim.p.comp[i * MAX_SPECIES + s];
      return t * 5;
    };
    const act = (a) => () => /** @type {HTMLElement} */ (lab.el.querySelector(`[data-act="${a}"]`));
    const tab = (id) => () => lab.tabEls[id] && lab.tabEls[id].b;
    const tested = () => st.lab.records.some((r) => r.creature === 'toad' && r.batchId === st.batch.id);
    return [
      { icon: 'stall', text: 'A customer needs a healing potion. Let’s make it!', button: 'Start' },
      { icon: 'seedling', text: 'Everything grows in your garden. Open it.', target: tab('garden'), done: () => lab.view === 'garden' },
      { icon: 'well', text: 'Draw water from the well.', target: act('harvest-well'), done: () => this.flags.harvest_water || st.stock(R.water) >= 280 },
      { icon: 'leaf', text: `Harvest the ${dew.name}.`, target: act('harvest-dew-a'), done: () => st.stock(R.dew) > 0 },
      { icon: 'cauldron', text: 'Back to the cauldron.', target: tab('brew'), done: () => lab.view === 'brew' },
      { icon: 'jar', text: `Tap the ${water.name} jar.`, target: () => lab.jarEls[R.water] && lab.jarEls[R.water].el, done: () => lab.selected === R.water || volumeOf(R.water) >= 45 },
      { icon: 'pour', text: 'Pour 50 ml.', target: act('dose-50'), done: () => volumeOf(R.water) >= 45 },
      { icon: 'jar', text: `Now the ${dew.name}: pour 50 ml of it.`, target: () => (lab.selected === R.dew ? lab.el.querySelector('[data-act="dose-50"]') : lab.jarEls[R.dew] && lab.jarEls[R.dew].el), done: () => volumeOf(R.dew) >= 45 && !lab.sim.emitter.pouring },
      { icon: 'spoon', text: 'Stir: pick the spoon and drag it round the brew.', target: () => lab.toolBtns.spoon, done: () => (lab.sim.tool.stirDistance - (this.flags.stir0 ?? (this.flags.stir0 = lab.sim.tool.stirDistance))) > 8 },
      { icon: 'toad', text: 'What does it do? Only a test can tell. Open the testing room.', target: tab('testing'), done: () => lab.view === 'testing' },
      { icon: 'dropper', text: 'Give the Moss Toad a dose and watch it.', target: act('dose-toad'), done: tested },
      { icon: 'leaf', text: 'Each leaf on its back is 10 Vitality. Set the Vitality slider.', target: () => lab.el.querySelector('[data-prop="vitality"]'), done: () => Number.isFinite(st.idCard.values.vitality) },
      { icon: 'scroll', text: 'No hearts or bubbles means 0. Set every slider — that is your Potion ID.', target: () => lab.el.querySelector('.id-panel'), done: () => idComplete(st.idCard) },
      { icon: 'bottle', text: 'Back to the cauldron and Bottle it.', target: () => (lab.view === 'brew' ? lab.bottleFab : lab.tabEls.brew.b), done: () => this.flags.bottled || !!st.vial },
      { icon: 'deal', text: 'Offer it to the customer.', target: act('sell'), done: () => this.flags.haggle || !!(st.current && st.current.haggle) || this.flags.sold },
      { icon: 'coin', text: 'Ask a higher price, or take the offer.', target: () => lab.el.querySelector('.haggle'), done: () => this.flags.sold },
      { icon: 'seal', text: 'Sold! If a potion fails, its buyer comes back for a refund. Some bluff: only an expert’s seal proves you right.', button: 'Finish' },
    ];
  }

  start(restart = false) {
    if (restart) this.lab.state.tutorial.done = false;
    this.active = true;
    this.index = 0;
    this.flags = {};
    this.lab.state.tutorial.active = true;
    this.show();
  }

  stop() {
    this.active = false;
    this.clearUi();
  }

  finish() {
    this.stop();
    this.lab.state.tutorial.active = false;
    this.lab.state.tutorial.done = true;
  }

  clearUi() {
    const c = this.lab.coach;
    if (c) { clear(c); c.classList.add('hidden'); }
    if (this.target) this.target.classList.remove('highlight');
    this.target = null;
    this.shown = -1;
    if (this.lab.resize) requestAnimationFrame(() => this.lab.resize());
  }

  show() {
    const steps = this.steps;
    const s = steps[this.index];
    if (!s) { this.finish(); return; }
    const lab = this.lab;
    const c = clear(lab.coach);
    c.classList.remove('hidden');
    c.append(
      h('span', { class: 'coach-step', text: `${this.index + 1}/${steps.length}` }),
      icon(s.icon || 'bulb'),
      h('span', { class: 'coach-text', text: s.text }),
      h('span', { class: 'coach-actions' },
        s.button ? btn(s.button, () => this.advance(), { cls: 'primary', act: 'tutorial-next' }) : null,
        btn('', () => this.finish(), { icon: 'close', cls: 'icon', title: 'Skip the tutorial', act: 'tutorial-skip' })));
    this.shown = this.index;
    this.attach(s);
    // the coach bar changed the layout of the room under it
    requestAnimationFrame(() => lab.resize());
  }

  /** Outline the control to use (or the tab of the room it is in). */
  attach(s) {
    let t = s.target ? s.target() : null;
    if (t && !t.offsetParent) {
      const view = t.closest && t.closest('[data-view]');
      const id = view && view.getAttribute('data-view');
      t = id && this.lab.tabEls[id] ? this.lab.tabEls[id].b : null;
    }
    if (t === this.target) return;
    if (this.target) this.target.classList.remove('highlight');
    if (t) t.classList.add('highlight');
    this.target = t;
  }

  /** Kept for layout callers: the coach bar sits in the page flow, nothing to place. */
  place() {}

  advance() {
    this.index++;
    this.show();
  }

  /** @param {string} kind @param {any} [data] */
  notify(kind, data) {
    if (!this.active) return;
    if (kind === 'bottle') this.flags.bottled = true;
    if (kind === 'sold') this.flags.sold = true;
    if (kind === 'haggle') this.flags.haggle = true;
    if (kind === 'harvest' && data === this.lab.state.world.roles.water) this.flags.harvest_water = true;
    if (kind === 'view' && this.index === this.steps.length - 1 && this.flags.sold) { this.finish(); return; }
    if (this.shown === this.index) this.attach(this.steps[this.index]);
  }

  update() {
    if (!this.active) return;
    const s = this.steps[this.index];
    if (!s) return;
    if (s.done && s.done()) this.advance();
    else if (Math.random() < 0.08) this.attach(s); // rooms rebuild their controls
  }
}
