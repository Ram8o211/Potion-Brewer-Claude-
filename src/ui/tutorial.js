// Guided first brew. Each step highlights the relevant control and waits for
// the player to actually perform the action in the simulation.

import { h, btn } from './dom.js';
import { PHASE } from '../simulation/constants.js';
import { MAX_SPECIES } from '../reactions/species.js';

export class Tutorial {
  /** @param {import('./lab.js').LabScreen} lab */
  constructor(lab) {
    this.lab = lab;
    this.active = false;
    this.index = 0;
    this.box = null;
    this.target = null;
    this.flags = {};
  }

  get steps() {
    const lab = this.lab;
    const st = lab.state;
    const R = st.world.roles;
    const water = st.lookup(R.water), ess = st.lookup(R.essenceA);
    const volumeOf = (id) => {
      const s = lab.sim.species.slotOf.get(id);
      if (s === undefined) return 0;
      let t = 0;
      for (let i = 0; i < lab.sim.p.count; i++) t += lab.sim.p.comp[i * MAX_SPECIES + s];
      return t * 5;
    };
    const brewT = () => {
      const p = lab.sim.p;
      let T = 0, n = 0;
      for (let i = 0; i < p.count; i++) if (p.phase[i] !== PHASE.GAS) { T += p.temp[i]; n++; }
      return n ? T / n : 20;
    };
    return [
      { text: `Welcome to your shop, alchemist! Your very first customer is here. Let’s brew their order together — it only takes a minute.`, button: 'Let’s begin' },
      { text: 'This is the order card. Every line is something the customer wants, with a live meter that fills as your brew matches. Tap the portrait to fold the card away.', target: () => lab.custEl, button: 'Got it' },
      { text: `Tap the jar of ${water.name} on the shelf to pick it up.`, target: () => lab.jarEls[R.water] && lab.jarEls[R.water].el, done: () => lab.selected === R.water },
      { text: `Press and hold inside the cauldron to pour. Pour about 150 ml — or tap the dose buttons (100 + 50).`, target: () => lab.doseEl, done: () => volumeOf(R.water) >= 120 },
      { text: `Now pick up the ${ess.name}.`, target: () => lab.jarEls[R.essenceA] && lab.jarEls[R.essenceA].el, done: () => lab.selected === R.essenceA },
      { text: `Pour about 70 ml of it. Notice how the colour stays where it lands at first — mixing starts where liquids touch.`, target: () => lab.doseEl, done: () => volumeOf(R.essenceA) >= 50 && !lab.sim.emitter.pouring },
      { text: 'Select the spoon and drag it in circles through the brew. Stirring spreads the colour far faster than waiting.', target: () => lab.toolBtns.spoon, done: () => (lab.sim.tool.stirDistance - (this.flags.stir0 ?? (this.flags.stir0 = lab.sim.tool.stirDistance))) > 18 || this.colourScore() > 0.95 },
      { text: 'The customer wants it served warm. Slide the fire control to the right — heat enters through the bottom of the cauldron and spreads.', target: () => lab.furnaceInput.parentElement, done: () => brewT() >= 36 },
      { text: 'Keep an eye on the meters. When they are full, press Bottle! (You can turn the fire down once it is warm.)', target: () => lab.bottleBtn, done: () => this.flags.bottled },
      { text: '', done: () => this.flags.sold, hidden: true },
      { text: 'Splendid — your first sale! Spend coins in the market (bag icon) on reagents and equipment. Save recipes after bottling, and experiment: heating, freezing, kneading and new combinations reveal discoveries in your journal.', button: 'Run my shop!' },
    ];
  }

  colourScore() {
    const r = this.lab.reqEls && this.lab.reqEls.find((x) => x.req.key === 'color');
    return r ? parseFloat(r.meter.style.width) / 100 : 0;
  }

  start(restart = false) {
    if (restart) {
      this.lab.state.tutorial.done = false;
    }
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
    if (this.box) this.box.remove();
    this.box = null;
    if (this.target) this.target.classList.remove('highlight');
    this.target = null;
  }

  show() {
    this.clearUi();
    const steps = this.steps;
    const s = steps[this.index];
    if (!s) { this.finish(); return; }
    if (s.hidden) return;
    const lab = this.lab;
    const actions = h('div', { class: 'tutor-actions' },
      btn('Skip tutorial', () => this.finish(), { act: 'tutorial-skip' }),
      s.button ? btn(s.button, () => this.advance(), { cls: 'primary', act: 'tutorial-next' }) : h('span', { class: 'small muted', text: `Step ${this.index + 1} of ${steps.length}` }),
    );
    this.box = h('div', { class: 'tutor parch', role: 'note' }, h('div', { text: s.text }), actions);
    lab.el.appendChild(this.box);
    const t = s.target ? s.target() : null;
    if (t) { t.classList.add('highlight'); this.target = t; }
    this.place();
  }

  place() {
    if (!this.box) return;
    const lab = this.lab;
    const sr = lab.stageEl.getBoundingClientRect();
    const lr = lab.el.getBoundingClientRect();
    const bw = this.box.offsetWidth;
    // keep the box over the top of the cauldron view, clear of the controls
    this.box.style.left = Math.max(8, sr.left - lr.left + (sr.width - bw) / 2) + 'px';
    this.box.style.top = Math.max(8, sr.top - lr.top + 8) + 'px';
  }

  advance() {
    this.index++;
    this.show();
  }

  /** @param {string} kind @param {any} [data] */
  notify(kind, data) {
    if (!this.active) return;
    if (kind === 'bottle') this.flags.bottled = true;
    if (kind === 'sold') { this.flags.sold = true; }
    void data;
  }

  update() {
    if (!this.active) return;
    const s = this.steps[this.index];
    if (!s) return;
    if (s.done && s.done()) this.advance();
    else if (this.box && Math.random() < 0.05) this.place();
  }
}
