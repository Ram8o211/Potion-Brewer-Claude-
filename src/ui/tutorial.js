// The guided tour: the first brew, step by step, and a visit to every room
// and control of the shop. Each step outlines the control it talks about;
// an action step waits for the player to really do it (in the simulation),
// an info step waits for "Next". The tour docks in its own strip between the
// top bar and the rooms (lab.tutorSlot), so it never covers a control.

import { h, btn, placeToasts } from './dom.js';
import { PHASE } from '../simulation/constants.js';
import { TUTORIAL_HERBS } from '../game/commissions.js';
import { shortName } from '../game/customers.js';

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

  /**
   * The steps. `text` says what to look at or do; `target` is the control to
   * outline; `done` (action steps) advances once the player has done it;
   * `button` (info steps) labels the button that moves on.
   * @returns {{text:string, target?:()=>any, done?:()=>boolean, button?:string}[]}
   */
  get steps() {
    const lab = this.lab;
    const st = lab.state;
    const R = st.world.roles;
    const water = st.lookup(R.water);
    const H = TUTORIAL_HERBS, leaf = st.lookup(H.healer), sun = st.lookup(H.warmer);
    /** ml of an ingredient poured into this batch */
    const poured = (id) => st.brewLog.reduce((a, e) => a + (e.type === 'pour' && e.id === id ? e.ml : 0), 0);
    const brewT = () => {
      const p = lab.sim.p;
      let T = 0, n = 0;
      for (let i = 0; i < p.count; i++) if (p.phase[i] !== PHASE.GAS) { T += p.temp[i]; n++; }
      return n ? T / n : 20;
    };
    /** whole herbs and stones still in the pot */
    const wholeSolids = () => {
      const p = lab.sim.p;
      let n = 0;
      for (let i = 0; i < p.count; i++) if (p.phase[i] === PHASE.SOLID) n++;
      return n;
    };
    const tab = (id) => () => lab.tabEls[id] && lab.tabEls[id].b;
    const q = (sel) => () => /** @type {HTMLElement|null} */ (lab.el.querySelector(sel));
    const inView = (id) => () => lab.view === id;
    const rabbitTested = () => st.trials.records.some((r) => r.subjectId === 'rabbit' && r.batchId === st.batch.id);
    const who = st.current && st.current.customer ? shortName(st.current.customer.name) : 'the customer';
    return [
      // ---- the shop
      { text: 'Welcome to your shop, alchemist! This tour shows every part of it while you brew your first order. Follow the glowing outline: do what it asks, or press Next.', button: 'Let’s begin' },
      { text: 'The top bar: ☰ opens the menu (how to play, settings, this tour). Then your coins, your rank (its bar fills with reputation), the day and which customer of the day this is. Shop sells ingredients and equipment.', target: () => lab.topbar, button: 'Next' },
      { text: 'Five rooms along the edge: Counter (customers), Brew (the cauldron), Wilds (gathering), Trials (testing on rabbits) and Book (recipes and notes). A red mark means something is waiting there.', target: () => lab.tabbar, button: 'Next' },
      { text: 'A customer is waiting. Open the Counter.', target: tab('counter'), done: inView('counter') },
      { text: 'The order: every line must be met — the effect and its strength, purity (no other effect above a limit) and the quantity. “?” means not tested yet. Advice buys a hint; Decline sends a customer away.', target: q('.customer-card .reqs'), button: 'Next' },
      { text: 'Let’s brew it. Press “Brew it”.', target: () => lab.el.querySelector('[data-act=go-brew]') || tab('brew')(), done: inView('brew') },
      // ---- the first brew
      { text: 'The order strip stays above the cauldron: each chip fills as the brew meets that line of the order. Tap the strip to go back to the Counter.', target: () => lab.strip, button: 'Next' },
      { text: `Tap the jar of ${water.name} on the shelf to pick it up. The small number on a jar is how many ml you have.`, target: () => lab.jarEls[R.water] && lab.jarEls[R.water].el, done: () => lab.selected === R.water },
      { text: 'Pour about 110 ml: tap 100, then 25. You can also hold your finger in the cauldron to pour freely, or drag a jar onto it.', target: () => lab.doseEl, done: () => poured(R.water) >= 95 },
      { text: `Now pick up the ${leaf.name}. Tip: long-press (or right-click) any jar to read what it does — this one heals, but leaves a frosty bite.`, target: () => lab.jarEls[H.healer] && lab.jarEls[H.healer].el, done: () => lab.selected === H.healer },
      { text: 'Pour 50 ml. The leaves go in whole — and whole leaves give up almost nothing, so you will crush them in a moment.', target: () => lab.doseEl, done: () => poured(H.healer) >= 45 && !lab.sim.emitter.pouring },
      { text: `Nothing that grows is pure, but opposites cancel: fire–frost, life–death, acid–alkali. Pick up the ${sun.name}: its fire cancels the leaf’s frost.`, target: () => lab.jarEls[H.warmer] && lab.jarEls[H.warmer].el, done: () => lab.selected === H.warmer },
      { text: 'Pour 25 ml — half as much as the leaf, so fire and frost balance out.', target: () => lab.doseEl, done: () => poured(H.warmer) >= 20 && !lab.sim.emitter.pouring },
      { text: 'Now choose Crush (the pestle) and drag it back and forth over the leaves at the bottom of the pot. Only crushed herbs give up their magic — nothing is ground for you.', target: () => lab.toolBtns.pestle, done: () => wholeSolids() <= 3 || (lab.tool === 'pestle' && (lab.sim.tool.stirDistance - (this.flags.crush0 ?? (this.flags.crush0 = lab.sim.tool.stirDistance))) > 25) },
      { text: 'Choose Stir and drag circles through the brew: stirring spreads the magic evenly. (Auto, further along, stirs for you while you hold it.)', target: () => lab.toolBtns.spoon, done: () => (lab.sim.tool.stirDistance - (this.flags.stir0 ?? (this.flags.stir0 = lab.sim.tool.stirDistance))) > 12 || lab.sim.tool.auto || brewT() >= 40 },
      { text: 'Herbs steep only when warm. Slide the fire control right (left cools) and bring the brew to about 60 °C. The lid keeps steam in; with the lid off, boiling makes a brew smaller and stronger.', target: () => lab.controls, done: () => brewT() >= 50 },
      { text: 'The other tools: Crush (whole herbs, stones, ice), Inspect (tap a spot to read it), Sample (what a bottle would hold), 1× (speeds up time), Empty. Tap the ml · °C readout over the cauldron to see what is inside.', target: () => lab.toolbar, button: 'Next' },
      // ---- the trial
      { text: 'Does it really heal? What a mixture does is unknown until it is tested. Open the Trials room.', target: tab('trials'), done: inView('trials') },
      { text: 'Choose a rabbit (tap it) and press Give — or drag the dropper onto it. The dose is real potion from the cauldron’s tap.', target: () => document.querySelector('[data-act=test-rabbit]') || lab.views.trials.hutch.el, done: rabbitTested },
      { text: 'The result: each effect the rabbit showed, with a ± margin. One reading is a rough guess; a second rabbit narrows it most — and demanding customers insist on that.', target: q('.estimate-card'), button: 'Next' },
      { text: 'Look after your rabbits here: buy, feed, breed, and purge one to wash a potion out. Too much of an effect can make a rabbit sick, wild or dead — every rabbit has its own hidden limits.', target: q('.hutch-manage'), button: 'Next' },
      { text: 'Back to the cauldron.', target: tab('brew'), done: inView('brew') },
      // ---- selling
      { text: 'Press Bottle and choose 100 ml (the order’s quantity). A bottle goes to the counter, or onto your potion shelves for later.', target: () => lab.bottleFab, done: () => this.flags.bottled },
      { text: `Your vial is on the counter, labelled from your trial. Press “Sell to ${who}”, agree on a price, then save the recipe to your book.`, target: () => document.querySelector('[data-act=serve]') || tab('counter')(), done: () => this.flags.sold },
      { text: 'Splendid — your first sale! The customer comes back tomorrow: pleased, or with a complaint you can refund, dispute with your trial records, or refuse. The potion shelves below keep sealed bottles for later customers.', target: () => lab.el.querySelector('.view-counter .shelf-card') || tab('counter')(), button: 'Next' },
      // ---- the rest of the shop
      { text: 'Ingredients run out. Open the Wilds to gather more.', target: tab('wilds'), done: inView('wilds') },
      { text: 'Slide a finger across a mature plant in the picture to shake it: its fruit or bloom falls to the ground, and a tap on it gathers it. Each ingredient is listed below once you have gathered it. Plants grow from sprout to ripe to mature; only mature ones can be harvested, and new sprouts come up until the ground is full. Thorough digs a plant out for twice as much, but its kind sprouts slowly. Some flowers open only at dawn or at dusk. New regions open as your rank rises.', target: q('.view-wilds .deposits'), button: 'Next' },
      { text: 'Now open the Book.', target: tab('book'), done: inView('book') },
      { text: 'The Book keeps your recipes (Prepare pours one again), every trial, the laws of magic you discover, all ingredients, your journal, awards and sales.', target: q('.book-tabs'), button: 'Next' },
      { text: 'The Shop sells ingredients, buys your surplus, and offers equipment: each piece lets you do something new (deep cold, a stirrer, a bigger cauldron, more shelves…).', target: q('[data-act=shop]'), button: 'Next' },
      { text: 'That is a day: at dawn gather in the Wilds, then open the door at the Counter; brew, test, bottle and sell; when the last customer has gone, close the shop. ☰ → How to play explains everything in detail. Good luck!', target: tab('counter'), button: 'Run my shop!' },
    ];
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
    this.lab.el.classList.remove('touring');
    if (this.target) this.target.classList.remove('highlight');
    this.target = null;
    placeToasts();
  }

  show() {
    this.clearUi();
    const steps = this.steps;
    const s = steps[this.index];
    if (!s) { this.finish(); return; }
    const lab = this.lab;
    const actions = h('div', { class: 'tutor-actions' },
      h('span', { class: 'tutor-step', text: `${this.index + 1}/${steps.length}` }),
      btn('End tour', () => this.finish(), { act: 'tutorial-skip', title: 'End the guided tour (restart it from ☰ Menu)' }),
      s.button
        ? btn(s.button, () => this.advance(), { cls: 'primary', act: 'tutorial-next' })
        : btn('Skip step', () => this.advance(), { act: 'tutorial-skip-step', title: 'Move on without doing this step' }),
    );
    this.box = h('div', { class: 'tutor parch' + (s.button ? '' : ' waiting'), role: 'note' }, h('div', { class: 'tutor-text', text: s.text }), actions);
    lab.tutorSlot.appendChild(this.box);
    lab.el.classList.add('touring');
    const t = s.target ? s.target() : null;
    if (t) { t.classList.add('highlight'); this.target = t; }
    placeToasts();
  }

  advance() {
    this.index++;
    this.show();
  }

  /** @param {string} kind @param {any} [data] */
  notify(kind, data) {
    if (!this.active) return;
    if (kind === 'bottle') this.flags.bottled = true;
    if (kind === 'view') {
      // the closing note never blocks a room the player has moved on to
      if (this.index === this.steps.length - 1) { this.finish(); return; }
      this.show();
    }
    if (kind === 'sold') { this.flags.sold = true; }
    void data;
  }

  update() {
    if (!this.active) return;
    const s = this.steps[this.index];
    if (!s) return;
    if (s.done && s.done()) this.advance();
    else if (this.box && Math.random() < 0.05) {
      // targets can be rebuilt (room refreshes): re-attach the highlight
      const t = s.target ? s.target() : null;
      if (t && t !== this.target) { if (this.target) this.target.classList.remove('highlight'); t.classList.add('highlight'); this.target = t; }
    }
  }
}
