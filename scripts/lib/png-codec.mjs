// A minimal, dependency-free PNG codec for the asset pipeline and the tests:
// decodes 8-bit greyscale/RGB/RGBA/palette PNGs (non-interlaced) and encodes
// RGBA. Pixels are returned as packed 0xAABBGGRR (little-endian RGBA bytes,
// the layout of visual/pixels.js and of canvas ImageData viewed as Uint32).

import { inflateSync, deflateSync } from 'node:zlib';
import { readFileSync, writeFileSync } from 'node:fs';

const SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/**
 * @param {Buffer|Uint8Array} data
 * @returns {{w:number, h:number, px:Uint32Array}}
 */
export function decodePNG(data) {
  const buf = Buffer.from(data);
  if (!buf.subarray(0, 8).equals(SIG)) throw new Error('not a PNG');
  let o = 8, w = 0, h = 0, depth = 8, type = 6, interlace = 0;
  /** @type {Buffer[]} */
  const idat = [];
  let plte = null, trns = null;
  while (o < buf.length) {
    const len = buf.readUInt32BE(o), kind = buf.toString('latin1', o + 4, o + 8), body = buf.subarray(o + 8, o + 8 + len);
    if (kind === 'IHDR') { w = body.readUInt32BE(0); h = body.readUInt32BE(4); depth = body[8]; type = body[9]; interlace = body[12]; }
    else if (kind === 'PLTE') plte = body;
    else if (kind === 'tRNS') trns = body;
    else if (kind === 'IDAT') idat.push(body);
    else if (kind === 'IEND') break;
    o += 12 + len;
  }
  if (depth !== 8 || interlace) throw new Error(`unsupported PNG (depth ${depth}, interlace ${interlace})`);
  const ch = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[type];
  if (!ch) throw new Error(`unsupported colour type ${type}`);
  const raw = inflateSync(Buffer.concat(idat));
  const stride = w * ch, px = new Uint32Array(w * h);
  let prev = new Uint8Array(stride), cur = new Uint8Array(stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let i = 0; i < stride; i++) {
      const a = i >= ch ? cur[i - ch] : 0, b = prev[i], c = i >= ch ? prev[i - ch] : 0;
      let v = line[i];
      if (f === 1) v += a;
      else if (f === 2) v += b;
      else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      cur[i] = v & 255;
    }
    for (let x = 0; x < w; x++) {
      let r, g, bl, al = 255;
      if (type === 6) { r = cur[x * 4]; g = cur[x * 4 + 1]; bl = cur[x * 4 + 2]; al = cur[x * 4 + 3]; }
      else if (type === 2) { r = cur[x * 3]; g = cur[x * 3 + 1]; bl = cur[x * 3 + 2]; }
      else if (type === 0) { r = g = bl = cur[x]; }
      else if (type === 4) { r = g = bl = cur[x * 2]; al = cur[x * 2 + 1]; }
      else { const k = cur[x]; r = plte[k * 3]; g = plte[k * 3 + 1]; bl = plte[k * 3 + 2]; al = trns && k < trns.length ? trns[k] : 255; }
      px[y * w + x] = ((al << 24) | (bl << 16) | (g << 8) | r) >>> 0;
    }
    [prev, cur] = [cur, prev];
  }
  return { w, h, px };
}

function chunk(kind, body) {
  const len = Buffer.alloc(4); len.writeUInt32BE(body.length);
  const kb = Buffer.from(kind, 'latin1');
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([kb, body])));
  return Buffer.concat([len, kb, body, crc]);
}

/**
 * Encode packed RGBA pixels as a PNG (lossless; filter chosen per row).
 * @param {number} w @param {number} h @param {Uint32Array} px
 */
export function encodePNG(w, h, px) {
  const stride = w * 4, raw = Buffer.alloc((stride + 1) * h);
  const line = Buffer.alloc(stride), prev = Buffer.alloc(stride);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = px[y * w + x];
      // fully transparent pixels are stored as transparent black (clean edges, smaller files)
      if (!(c >>> 24)) { line[x * 4] = line[x * 4 + 1] = line[x * 4 + 2] = line[x * 4 + 3] = 0; continue; }
      line[x * 4] = c & 255; line[x * 4 + 1] = (c >>> 8) & 255; line[x * 4 + 2] = (c >>> 16) & 255; line[x * 4 + 3] = c >>> 24;
    }
    // up filter when it helps (cheap heuristic: sum of absolute residuals)
    let s0 = 0, s2 = 0;
    for (let i = 0; i < stride; i++) { s0 += line[i]; const d = (line[i] - prev[i]) & 255; s2 += d < 128 ? d : 256 - d; }
    const o = y * (stride + 1);
    if (y > 0 && s2 < s0) { raw[o] = 2; for (let i = 0; i < stride; i++) raw[o + 1 + i] = (line[i] - prev[i]) & 255; }
    else { raw[o] = 0; line.copy(raw, o + 1); }
    line.copy(prev);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([SIG, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

/** @param {string|URL} path */
export const readPNG = (path) => decodePNG(readFileSync(path));
/** @param {string|URL} path @param {{w:number,h:number,px:Uint32Array}} img */
export const writePNG = (path, img) => writeFileSync(path, encodePNG(img.w, img.h, img.px));
