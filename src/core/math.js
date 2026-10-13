// Small numeric helpers shared across modules.

/** @param {number} v @param {number} lo @param {number} hi */
export const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
/** @param {number} a @param {number} b @param {number} t */
export const lerp = (a, b, t) => a + (b - a) * t;
/** @param {number} e0 @param {number} e1 @param {number} x */
export function smoothstep(e0, e1, x) {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}
/** Round to n decimals. @param {number} v @param {number} n */
export const roundTo = (v, n) => {
  const p = Math.pow(10, n);
  return Math.round(v * p) / p;
};
