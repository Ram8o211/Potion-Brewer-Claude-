// Turns simulation events into discoveries: journal entries and achievements.
// Entries speak of magic only: what heat, frost and fire do to a brew's
// magic, never an ingredient's boiling point, colour or weight.

/** Entries that do not depend on the ingredients involved. */
export const JOURNAL = {
  boil: { key: 'boil', title: 'Magic in the steam', text: 'Too much heat sends the brew’s magic up with the steam. The lid keeps it in.', kind: 'phase' },
  freeze: { key: 'freeze', title: 'Ice-locked brew', text: 'Deep frost locks the brew: the spoon cannot move it until it thaws, or the pestle breaks it.', kind: 'phase' },
  fire: { key: 'fire', title: 'Burnt magic', text: 'Too fierce a fire burns magic out of the brew for good. The lid smothers the flame.', kind: 'fire' },
};

/** Two ingredients whose magic will not join while cold. */
function unbound(a, b, ida, idb) {
  return { key: `unbound:${ida}:${idb}`, title: 'Unbound magic', text: `${a} and ${b} will not share their magic while cold. Heat binds them.`, kind: 'mixing', material: ida };
}

/** ...and once heated, it did. */
function bound(a, b, ida, idb) {
  return { key: `bound:${ida}:${idb}`, title: 'Bound by heat', text: `Once hot, the magic of ${a} and ${b} joined — and stays joined.`, kind: 'mixing', material: ida };
}

/**
 * Bring journal entries written by earlier builds up to date (they named
 * boiling and freezing points, flammable ingredients and layers). Idempotent.
 * @param {Record<string, any>} journal @param {(id:string)=>any} lookup
 * @returns {Record<string, any>}
 */
export function modernizeJournal(journal, lookup) {
  if (!journal || typeof journal !== 'object') return {};
  const name = (id) => (id && lookup(id) ? lookup(id).name : 'a mixture');
  /** @type {Record<string, any>} */
  const out = {};
  const keep = (entry, day) => { const old = out[entry.key]; out[entry.key] = { ...entry, day: old ? Math.min(old.day, day) : day }; };
  for (const [key, e] of Object.entries(journal)) {
    const day = e && Number.isFinite(e.day) ? e.day : 1;
    const m = /^(boil|freeze|fire|layers|heatmix):([^:]+)(?::(.+))?$/.exec(key);
    if (!m) { out[key] = e; continue; }
    if (m[1] === 'boil' || m[1] === 'freeze' || m[1] === 'fire') keep(JOURNAL[m[1]], day);
    else if (m[1] === 'layers') keep(unbound(name(m[2]), name(m[3]), m[2], m[3]), day);
    else keep(bound(name(m[2]), name(m[3]), m[2], m[3]), day);
  }
  return out;
}

/**
 * @param {import('./state.js').GameState} state
 * @param {any} e simulation event
 * @returns {{entries: any[], achievements: any[]}}
 */
export function processEvent(state, e) {
  const entries = [];
  const achievements = [];
  const L = state.lookup;
  const name = (id) => (id && L(id) ? L(id).name : 'a mixture');
  const add = (entry) => {
    const r = state.discover(entry);
    if (r) entries.push(r);
  };
  switch (e.type) {
    case 'pourEnd': {
      const m = L(e.id);
      if (m) state.learn(e.id, 'seen', true);
      break;
    }
    case 'phase': {
      if (!e.species) break;
      if (e.to === 'gas') {
        add(JOURNAL.boil);
        achievements.push(...state.unlock('boil'));
      } else if (e.to === 'solid') {
        add(JOURNAL.freeze);
        achievements.push(...state.unlock('frozen'));
      }
      break;
    }
    case 'transmute': {
      add({ key: 'transmute', title: 'A super transition', text: 'The brew crossed its super-transition temperature: its whole magic poured into a single property and the rest vanished. Blends average the thresholds of their ingredients, weighted by their magic.', kind: 'magic' });
      achievements.push(...state.unlock('super'));
      break;
    }
    case 'fade': {
      add({ key: 'fade', title: 'Fading magic', text: 'Overheated, the brew’s magic began to burn away. Every blend has a fading temperature: the magic-weighted mean of its ingredients’.', kind: 'magic' });
      achievements.push(...state.unlock('fade'));
      break;
    }
    case 'heatmix': {
      add(bound(name(e.a), name(e.b), e.a, e.b));
      achievements.push(...state.unlock('heatmix'));
      break;
    }
    case 'ignite': {
      add(JOURNAL.fire);
      achievements.push(...state.unlock('fire'));
      break;
    }
    case 'crush':
      achievements.push(...state.unlock('crush'));
      add({ key: 'crush', title: 'Smashing stones', text: 'The pestle smashes whole stones into powder without losing any. Only powder dissolves, and hot water draws out far more magic.', kind: 'tool' });
      break;
    case 'layers': {
      add(unbound(name(e.a), name(e.b), e.a, e.b));
      break;
    }
  }
  return { entries, achievements };
}
