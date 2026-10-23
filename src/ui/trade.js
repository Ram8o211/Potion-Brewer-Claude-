// Trading at the counter: writing the potion's label, bargaining with the
// customer over several rounds, the deal, and the customers who come back
// the next day — pleased, or with a complaint to settle.

import { h, btn, modal, toast, coins, clear } from './dom.js';
import { icon } from './icons.js';
import { drawPortrait } from '../rendering/portraits.js';
import { audio } from '../audio/audio.js';
import { EFFECTS, EFFECT_BY_KEY } from '../alchemy/effects.js';
import { draftLabel, openNegotiation as beginNegotiation, proposePrice, acceptOffer, relevantEffects, trustReport, editClaim, proofGaps } from '../game/commerce.js';
import { PURITY_LIMIT } from '../game/requests.js';
import { shortName } from '../game/customers.js';

/**
 * Write (or revise) the vial's label. Trial readings of this batch fill it
 * in; untested effects start from the guild's theory, marked as estimates.
 * @param {any} lab @param {any} vial @param {(label:any)=>void} onDone
 */
export function openIdentify(lab, vial, onDone) {
  const st = lab.state;
  const draft = vial.label ? JSON.parse(JSON.stringify(vial.label)) : draftLabel(vial, lab.vialTheory(vial), st.day);
  const com = st.current;
  const relevant = com ? new Set(relevantEffects(com)) : new Set(EFFECTS.map((e) => e.key));
  const rows = h('div', { class: 'label-rows' });
  // on a phone only one row shows its controls at a time (tap a row to edit it)
  let open = '';
  const render = () => {
    clear(rows);
    for (const e of EFFECTS) {
      const c = draft.claims[e.key];
      const lvl = c.evidence ? c.evidence.level : 'preliminary';
      const src = c.source === 'trial' ? h('span', { class: 'src trial lvl-' + lvl, title: `Measured in trials of this batch: ${c.evidence ? `${c.evidence.n} reading${c.evidence.n === 1 ? '' : 's'} on ${c.evidence.r} rabbit${c.evidence.r === 1 ? '' : 's'}, ±${c.evidence.u}` : 'one reading'}` }, icon('dropper', 'sm'), lvl === 'preliminary' ? ' 1 reading' : ` ${lvl}`)
        : c.kind === 'unknown' ? h('span', { class: 'src unknown', text: 'unknown' })
          : c.source === 'estimate' ? h('span', { class: 'src est', text: `theory${c.spread ? ' ±' + c.spread : ''}` }) : h('span', { class: 'src you', text: 'your claim' });
      const val = c.kind === 'value' ? `${Math.round((c.value || 0) * 10) / 10}%` : c.kind === 'none' ? `none (< ${PURITY_LIMIT}%)` : '?';
      const edit = (op) => () => { draft.claims[e.key] = editClaim(c, e.key, op); render(); };
      const row = h('div', { class: 'label-row' + (relevant.has(e.key) ? ' relevant' : '') + (c.kind === 'unknown' ? ' unknown' : '') + (open === e.key ? ' open' : ''), 'data-claim': e.key },
        icon(e.icon, 'sm'), h('span', { class: 'lk', text: e.label }), src, h('b', { class: 'lv', text: val }),
        h('span', { class: 'lctl' },
          btn('−', edit('down'), { cls: 'small', title: `Claim less ${e.label.toLowerCase()}`, act: `claim-dn-${e.key}` }),
          btn('+', edit('up'), { cls: 'small', title: `Claim more ${e.label.toLowerCase()}`, act: `claim-up-${e.key}` }),
          btn('none', edit('none'), { cls: 'small', act: `claim-none-${e.key}` }),
          btn('?', edit('unknown'), { cls: 'small', title: 'Make no claim', act: `claim-unknown-${e.key}` }),
          c.measured !== undefined && c.source !== 'trial' ? btn('✓', edit('tested'), { cls: 'small', title: 'Use the tested reading', act: `claim-tested-${e.key}` }) : null));
      row.addEventListener('click', (ev) => {
        if (/** @type {HTMLElement} */ (ev.target).closest('.lctl')) return;
        open = open === e.key ? '' : e.key;
        render();
      });
      rows.appendChild(row);
    }
    if (com) {
      const rep = trustReport(com, draft, st.rank);
      const t = rep.trust;
      const gaps = proofGaps(com, draft);
      trustEl.textContent = `${shortName(com.customer.name)} will trust this label ${t >= 0.9 ? 'fully' : t >= 0.7 ? 'well' : t >= 0.5 ? 'somewhat' : 'barely'}: ${rep.reasons.join('; ')}.${gaps.length ? ` Before buying they want ${gaps.some((g) => g.have === 'untested') ? 'the untested effects tested' : 'stronger proof'}.` : ''}`;
    }
  };
  const trustEl = h('div', { class: 'small' });
  let m;
  m = modal({
    title: 'Label the potion',
    wide: true,
    body: [
      h('div', { class: 'card parch' },
        h('div', { class: 'small', text: 'Write down what this potion does. Tested values come from trials of this very batch — one reading counts for less than readings repeated, and those less than readings on several rabbits. The rest are the guild theory’s estimates, or unknown. Customers pay for what you claim — and come back if it is not true.' }),
        h('div', { class: 'small muted', text: com ? 'Highlighted: the effects this order cares about (with a purity rule, all of them).' : '' }),
        trustEl),
      h('div', { class: 'card parch' }, rows),
    ],
    foot: [btn('Seal the label', () => { m.close(); audio.play('page'); onDone(draft); }, { cls: 'primary', icon: 'tag', act: 'label-seal' })],
  });
  render();
  return m;
}

/**
 * Bargain with the customer over the vial. Calls onEnd with the finished
 * negotiation (state 'deal' or 'left'), or with null if the player stops.
 * @param {any} lab @param {any} com @param {any} vial @param {(n:any)=>void} onEnd
 */
export function openNegotiation(lab, com, vial, onEnd) {
  const st = lab.state;
  // the same bottle offered again resumes the talks: patience spent stays spent
  const key = JSON.stringify(vial.label.claims);
  const prev = com.haggle && com.haggle.vialId === vial.id && com.haggle.state === 'open' ? com.haggle : null;
  /** @type {any} */
  let n;
  if (prev && prev.labelKey === key) n = prev;
  else {
    n = beginNegotiation(com, vial, vial.label, st.rank);
    if (prev) {
      // a new label re-prices the bottle, but the customer remembers the haggling
      n.patience = Math.min(n.patience, prev.patience);
      n.round = prev.round;
      n.log.unshift({ who: 'them', text: 'You again — with a new label.' });
    }
  }
  n.vialId = vial.id;
  n.labelKey = key;
  com.haggle = n;
  const persona = com.customer.persona || { haggle: 0.5 };
  const portrait = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'portrait big' }));
  drawPortrait(portrait, com.customer.portrait, n.fit >= 0.7 ? 'happy' : n.fit >= 0.4 ? 'neutral' : 'unhappy');
  const log = h('div', { class: 'haggle-log' });
  const why = h('div', { class: 'haggle-why small' }, h('b', { text: 'What they weigh: ' }),
    ...(n.reasons || []).map((r) => h('span', { class: 'why-chip why-' + r.k + (r.v >= 85 ? ' good' : r.v < 55 ? ' bad' : ''), title: r.text, text: `${WHY[r.k] || r.k} ${r.k === 'temper' ? '' : r.v + '%'} — ${r.text}` })));
  let ask = Math.round(Math.max(n.offer * 1.25, com.budget * 0.9));
  const askEl = h('b', { class: 'ask' });
  const offerEl = h('div', { class: 'offer' });
  const roundsEl = h('div', { class: 'small muted' });
  let ended = false;
  /** Walking away from open talks costs the customer's patience; at the end of it they leave. */
  const walkAway = () => {
    if (n.state !== 'open' || n.round === 0) return;
    n.patience -= 1;
    if (n.patience <= 0) { n.state = 'left'; n.log.push({ who: 'them', text: 'I have wasted enough of my day. Good day to you.' }); }
  };
  const finish = () => { if (ended) return; ended = true; walkAway(); m.close(); onEnd(n.state === 'open' ? null : n); };
  const render = () => {
    clear(log);
    for (const l of n.log.slice(-6)) log.appendChild(h('div', { class: 'line ' + l.who }, h('b', { text: l.who === 'you' ? 'You: ' : `${shortName(com.customer.name)}: ` }), l.text));
    askEl.textContent = `${coins(ask)} coins`;
    offerEl.textContent = `Their offer: ${coins(n.offer)} coins`;
    roundsEl.textContent = n.state === 'open' ? `${persona.haggle > 0.6 ? 'A hard bargainer.' : persona.haggle < 0.3 ? 'An easy-going buyer.' : 'A fair trader.'} ${n.patience <= 1 ? 'Their patience is nearly gone.' : ''}` : '';
    for (const b of [askBtn, takeBtn, minus, plus]) b.disabled = n.state !== 'open';
    if (n.state !== 'open') {
      // the deal is struck (or they left): "Continue" completes it
      const l = walk.querySelector('.lbl');
      if (l) l.textContent = 'Continue';
      walk.setAttribute('data-act', 'haggle-done');
      audio.play(n.state === 'deal' ? 'deal' : 'complaint');
    }
  };
  const minus = btn('−5', () => { ask = Math.max(1, ask - 5); render(); }, { cls: 'small', act: 'ask-down' });
  const plus = btn('+5', () => { ask += 5; render(); }, { cls: 'small', act: 'ask-up' });
  const askBtn = btn('Ask', () => { proposePrice(n, com, ask); if (n.state === 'open') audio.play('talk'); render(); }, { cls: 'primary', icon: 'coin', act: 'ask-price' });
  const takeBtn = btn('Accept their offer', () => { acceptOffer(n); render(); }, { icon: 'deal', act: 'accept-offer' });
  const walk = btn('Not today', () => finish(), { icon: 'door', act: 'walk-away' });
  let m;
  m = modal({
    title: `Bargaining with ${com.customer.name}`,
    wide: true,
    onClose: () => { if (!ended) { ended = true; walkAway(); onEnd(n.state === 'open' ? null : n); } },
    body: [h('div', { class: 'card parch haggle' },
      h('div', { class: 'cust-top' }, portrait, h('div', {},
        h('div', { class: 'cust-name', text: com.customer.name }),
        h('div', { class: 'small muted', text: `${com.customer.title} · wants ${com.potionName.toLowerCase()} · ${vial.ml} ml on offer` }),
        offerEl, roundsEl)),
      why,
      log,
      h('div', { class: 'row wrap haggle-ctl' }, h('span', { class: 'small', text: 'Your price:' }), minus, askEl, plus, askBtn, takeBtn))],
    foot: [walk],
  });
  render();
  return m;
}

/** Names of what a customer weighs in bargaining (commerce.js openNegotiation reasons). */
const WHY = { fit: 'Fit', trust: 'Trust', quantity: 'Measure', temper: 'Temper', history: 'History' };

/**
 * The deal is done: what was paid, and that the customer will report back.
 * @param {any} lab @param {any} com @param {any} sale @param {any} recipe @param {()=>void} onDone
 */
export function showDeal(lab, com, sale, recipe, onDone) {
  const st = lab.state;
  const portrait = /** @type {HTMLCanvasElement} */ (h('canvas'));
  drawPortrait(portrait, com.customer.portrait, 'happy');
  const nameInput = /** @type {HTMLInputElement} */ (h('input', { type: 'text', value: recipe.name, maxlength: '40', 'aria-label': 'Recipe name' }));
  let saved = false;
  const saveBtn = btn('Save recipe', () => {
    if (saved) return;
    saved = true;
    for (const e of st.addRecipe({ ...recipe, name: nameInput.value.trim() || recipe.name })) lab.announce(e);
    toast('Recipe saved', nameInput.value, 'book');
    saveBtn.disabled = true;
  }, { icon: 'book', act: 'save-recipe' });
  let m;
  m = modal({
    title: 'Sold!',
    onClose: onDone,
    body: [h('div', { class: 'card parch' },
      h('div', { class: 'result-head' }, portrait, h('div', {},
        h('div', { class: 'small muted', text: `${com.customer.name} · ${com.customer.title}` }),
        h('div', { text: '“I’ll let you know how it works.”' }))),
      h('div', { class: 'pay', text: `+${coins(sale.price)} coins` }),
      h('div', { class: 'small', style: { textAlign: 'center' }, text: 'They will drink it and come back tomorrow to tell you how it went.' })),
    h('div', { class: 'card parch' }, h('div', { class: 'small muted', text: 'Save this brew to your recipe book:' }), h('div', { class: 'row' }, nameInput, saveBtn))],
    foot: [btn('Continue', () => m.close(), { cls: 'primary', act: 'result-continue' })],
  });
  return m;
}

/**
 * A customer back from yesterday: praise, a legitimate complaint or a
 * dishonest one. The player decides what to do.
 * @param {any} lab @param {any} f follow-up
 */
export function followUpCard(lab, f) {
  const st = lab.state;
  const sale = st.sales.find((s) => s.id === f.saleId);
  const portrait = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'portrait' }));
  drawPortrait(portrait, f.customer.portrait, f.kind === 'praise' ? 'happy' : 'unhappy');
  const act = (a) => () => {
    const r = st.settleFollowUp(f.id, a);
    if (!r) return;
    if (r.refused) { audio.play('error'); toast('Not enough coins', r.text, 'coin'); return; }
    audio.play(f.kind === 'praise' ? 'praise' : r.coins < 0 || r.rep < 0 ? 'complaint' : 'coin');
    toast(f.kind === 'praise' ? 'A happy customer' : 'Complaint settled', `${r.text} ${r.coins ? (r.coins > 0 ? '+' : '') + coins(r.coins) + ' coins. ' : ''}${r.rep ? 'Reputation ' + (r.rep > 0 ? '+' : '') + r.rep + '.' : ''}`, f.kind === 'praise' ? 'heart' : 'talk', 5200);
    for (const e of r.events) lab.announce(e);
    lab.save();
    lab.refreshHud(true);
    lab.views.counter.refresh();
    lab.updateBadges();
  };
  const evidence = sale ? sale.evidence.length : 0;
  const actions = f.kind === 'praise'
    ? [btn('Thank them', act('thank'), { cls: 'primary', icon: 'heart', act: 'fu-thank' })]
    : [btn(`Refund ${coins(f.demand)}`, act('refund'), { icon: 'coin', act: 'fu-refund', disabled: st.coins + 1e-9 < f.demand, title: st.coins + 1e-9 < f.demand ? `You need ${coins(f.demand)} coins to refund in full` : 'Pay the money back' }),
      btn(evidence ? `Dispute (${evidence} trial record${evidence > 1 ? 's' : ''})` : 'Dispute', act('dispute'), { icon: 'scroll', act: 'fu-dispute' }),
      btn('Turn them away', act('dismiss'), { icon: 'door', cls: 'danger', act: 'fu-dismiss' })];
  return h('div', { class: 'card parch followup ' + f.kind, 'data-followup': f.id },
    h('div', { class: 'row' }, portrait, h('div', {},
      h('b', { text: `${f.customer.name} is back` }),
      h('div', { class: 'small muted', text: sale ? `Bought ${sale.potion.toLowerCase()} on day ${sale.day} for ${coins(sale.price)} coins` : '' }))),
    h('div', { class: 'speech', text: '“' + f.text + '”' }),
    f.kind === 'complaint' && sale ? h('div', { class: 'small muted fu-label', text: `Your label for that batch: ${claimSummary(sale.claims)}` }) : null,
    h('div', { class: 'row wrap' }, ...actions));
}

/** One line describing a label's claims. @param {Record<string, any>} claims */
export function claimSummary(claims) {
  const parts = [];
  for (const e of EFFECTS) {
    const c = claims[e.key];
    if (!c || c.kind === 'none') continue;
    parts.push(c.kind === 'unknown' ? `${e.label} ?` : `${e.label} ${Math.round(c.value)}%${c.source === 'trial' ? ' (tested)' : ''}`);
  }
  return parts.length ? parts.join(', ') + '; nothing else' : 'no magical effect';
}

export { EFFECT_BY_KEY };
