// Miscibility. Each material has a 2-D compatibility vector (think: polarity
// and "aetheric" character). Blends of nearby vectors mix; distant vectors
// stay separate and stratify by density. A blend's vector is the
// volume-weighted mean, so a mediating ingredient can act as a co-solvent.

export const COMPAT_FULL = 0.26;
export const COMPAT_NONE = 0.4;

/** Compatibility factor 0..1 from two vectors. */
export function compatFactor(a1, b1, a2, b2) {
  const d = Math.hypot(a1 - a2, b1 - b2);
  if (d <= COMPAT_FULL) return 1;
  if (d >= COMPAT_NONE) return 0;
  return 1 - (d - COMPAT_FULL) / (COMPAT_NONE - COMPAT_FULL);
}

/** @param {{compat:number[]}} m1 @param {{compat:number[]}} m2 */
export function miscible(m1, m2) {
  return compatFactor(m1.compat[0], m1.compat[1], m2.compat[0], m2.compat[1]) > 0.5;
}
