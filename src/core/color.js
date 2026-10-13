// Color science helpers. Mixing and color matching are done in OKLab, a
// perceptually uniform space, so "50/50 red/blue" reads as an intermediate hue
// and color tolerances in commissions feel fair to the eye.

/** @param {number} c 0..1 sRGB channel @returns {number} linear */
export function srgbToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
/** @param {number} c linear channel @returns {number} sRGB 0..1 */
export function linearToSrgb(c) {
  if (c <= 0) return 0;
  if (c >= 1) return 1;
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

/**
 * sRGB (0..1) → OKLab.
 * @param {number} r @param {number} g @param {number} b
 * @returns {[number, number, number]}
 */
export function rgbToOklab(r, g, b) {
  const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

/**
 * OKLab → sRGB (0..1), clamped.
 * @param {number} L @param {number} a @param {number} b
 * @returns {[number, number, number]}
 */
export function oklabToRgb(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_;
  return [
    linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

/** Perceptual distance (ΔE in OKLab ×100). @param {number[]} lab1 @param {number[]} lab2 */
export function deltaE(lab1, lab2) {
  const dL = lab1[0] - lab2[0], da = lab1[1] - lab2[1], db = lab1[2] - lab2[2];
  return Math.sqrt(dL * dL + da * da + db * db) * 100;
}

/** @param {number} h 0..360 @param {number} s 0..1 @param {number} l 0..1 @returns {[number,number,number]} */
export function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [r + m, g + m, b + m];
}

/** @param {number[]} rgb 0..1 @returns {string} #rrggbb */
export function rgbToHex(rgb) {
  const h = (v) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0');
  return '#' + h(rgb[0]) + h(rgb[1]) + h(rgb[2]);
}

/** @param {string} hex @returns {[number,number,number]} */
export function hexToRgb(hex) {
  const v = parseInt(hex.replace('#', ''), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

/** Hue (degrees) of an sRGB color, via OKLCh. @param {number[]} rgb */
export function hueOf(rgb) {
  const [, a, b] = rgbToOklab(rgb[0], rgb[1], rgb[2]);
  return ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
}

/** @type {[number, string][]} */
const HUE_NAMES = [
  [20, 'crimson'], [45, 'scarlet'], [70, 'amber'], [95, 'golden'], [120, 'olive'],
  [150, 'verdant'], [185, 'emerald'], [215, 'teal'], [245, 'azure'], [275, 'cobalt'],
  [305, 'violet'], [335, 'magenta'], [360, 'rose'],
];

/** Human-readable color name. @param {number[]} rgb */
export function describeColor(rgb) {
  const [L, a, b] = rgbToOklab(rgb[0], rgb[1], rgb[2]);
  const C = Math.sqrt(a * a + b * b);
  let base;
  if (C < 0.035) {
    base = L > 0.85 ? 'clear white' : L > 0.6 ? 'pale grey' : L > 0.35 ? 'slate grey' : 'inky black';
    return base;
  }
  const hue = ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
  base = HUE_NAMES.find(([lim]) => hue < lim)[1];
  const tone = L > 0.82 ? 'pale ' : L < 0.42 ? 'deep ' : C < 0.08 ? 'dusky ' : '';
  return tone + base;
}
