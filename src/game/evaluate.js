// Tolerance-based potion assessment and payment.

import { deltaE } from '../core/color.js';
import { viscosityClass } from './measure.js';
import { EFFECTS, EFFECT_INDEX, EFFECT_KEYS, NE } from '../alchemy/effects.js';

export const PROPERTY_LABELS = {
  color: 'Colour', density: 'Density', viscosity: 'Viscosity', temperature: 'Temperature', stability: 'Stability', volatility: 'Volatility',
  charge: 'Charge', quantity: 'Quantity', purity: 'Purity', ...Object.fromEntries(EFFECTS.map((e) => [e.key, e.label])),
};

/**
 * The strongest effect a potion carries that the customer did not ask for
 * (alkaline counts as much as acid).
 * @param {ArrayLike<number>} effects @param {string[]} [exclude]
 */
export function strongestUnwanted(effects, exclude = []) {
  let m = 0, key = '';
  if (!effects) return { value: 0, key };
  for (let k = 0; k < NE; k++) {
    if (exclude.includes(EFFECT_KEYS[k])) continue;
    const v = Math.abs(effects[k] || 0);
    if (v > m) { m = v; key = EFFECT_KEYS[k]; }
  }
  return { value: m, key };
}

/** @param {string} key */
export function isEffectKey(key) {
  return EFFECT_INDEX[key] !== undefined;
}

/**
 * Score a single requirement against a measurement.
 * @param {import('./commissions.js').Requirement} req
 * @param {import('./measure.js').Measurement} m
 * @returns {{score:number, value:number, distance:number, text:string}}
 */
export function scoreRequirement(req, m) {
  let value, d;
  switch (req.key) {
    case 'color':
      d = deltaE(m.lab, /** @type {number[]} */ (req.target));
      value = d;
      break;
    case 'density':
      value = m.density;
      d = Math.abs(value - /** @type {number} */ (req.target));
      break;
    case 'viscosity':
      value = m.viscosity;
      d = Math.abs(Math.log(Math.max(1e-3, value)) - /** @type {number} */ (req.target));
      break;
    case 'temperature':
      value = m.temperature;
      d = Math.abs(value - /** @type {number} */ (req.target));
      break;
    case 'stability':
      value = m.stability;
      break;
    case 'volatility':
      value = m.volatility;
      break;
    case 'charge':
      value = m.charge || 0;
      d = Math.abs(value - /** @type {number} */ (req.target));
      break;
    case 'purity':
      value = strongestUnwanted(m.effects, req.exclude || []).value;
      break;
    default: {
      const k = EFFECT_INDEX[req.key];
      value = k !== undefined && m.effects ? m.effects[k] : 0;
      if (req.kind === 'target') d = Math.abs(value - /** @type {number} */ (req.target));
    }
  }
  let score;
  if (req.kind === 'target') {
    score = d <= req.tol ? 1 : Math.max(0, 1 - (d - req.tol) / Math.max(1e-6, req.zero - req.tol));
  } else if (req.kind === 'min') {
    const t = /** @type {number} */ (req.target);
    score = value >= t ? 1 : Math.max(0, 1 - (t - value) / req.zero);
    d = Math.max(0, t - value);
  } else {
    const t = /** @type {number} */ (req.target);
    score = value <= t ? 1 : Math.max(0, 1 - (value - t) / req.zero);
    d = Math.max(0, value - t);
  }
  return { score, value, distance: d, text: describeValue(req.key, value, m) };
}

/** @param {string} key @param {number} value @param {any} m */
export function describeValue(key, value, m) {
  switch (key) {
    case 'color':
      return `ΔE ${value.toFixed(1)}`;
    case 'density':
      return `${value.toFixed(2)} g/ml`;
    case 'viscosity':
      return `${viscosityClass(value)} (${value < 100 ? value.toFixed(1) : Math.round(value)} cP)`;
    case 'temperature':
      return `${Math.round(value)}°C`;
    case 'charge':
      return `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
    case 'purity':
      return value < 0.05 ? 'pure' : `${value.toFixed(1)}% other magic`;
    default:
      return `${Math.round(value)}`;
  }
}

/**
 * Evaluate a bottled potion for a commission.
 * @param {any} commission
 * @param {import('./measure.js').Measurement} m
 */
export function evaluatePotion(commission, m) {
  const rows = commission.requirements.map((req) => {
    const r = scoreRequirement(req, m);
    return { req, ...r };
  });
  const fill = Math.min(1, m.ml / commission.bottleMl);
  const qScore = fill >= 0.98 ? 1 : fill * fill;
  rows.push({
    req: { key: 'quantity', kind: 'min', target: commission.bottleMl, tol: 0, zero: commission.bottleMl, label: `${commission.bottleMl} ml` },
    score: qScore,
    value: m.ml,
    distance: commission.bottleMl - m.ml,
    text: `${m.ml} ml`,
  });
  let wsum = 0, s = 0;
  for (const r of rows) {
    const w = r.req.key === 'quantity' ? 0.8 : r.req.key === 'color' ? 1.2 : 1;
    wsum += w;
    s += w * r.score;
  }
  let quality = s / wsum;
  // a badly short bottle caps the result
  quality *= 0.5 + 0.5 * qScore;
  const perfect = rows.every((r) => r.score >= 0.999);
  if (perfect) quality = 1;
  const stars = perfect ? 5 : quality >= 0.86 ? 4 : quality >= 0.7 ? 3 : quality >= 0.5 ? 2 : quality >= 0.28 ? 1 : 0;
  let payment = Math.round(commission.budget * (0.12 + 0.88 * Math.pow(quality, 1.6)) * (perfect ? 1.2 : 1));
  if (quality < 0.2) payment = Math.round(commission.budget * 0.05);
  const repDelta = Math.round((quality - 0.45) * (10 + commission.tier * 4)) + (perfect ? 3 : 0) + (commission.contract ? Math.round(quality * 15) : 0);
  return { rows, quality, stars, perfect, payment, repDelta };
}
