// Procedural sound design with the Web Audio API — no sample files.
// The context is created on the first user gesture (autoplay rules); all
// sounds respect the master / effects / music volumes and mute.

export class AudioEngine {
  constructor() {
    /** @type {AudioContext|null} */
    this.ctx = null;
    this.master = null;
    this.sfx = null;
    this.musicGain = null;
    this.noise = null;
    this.loops = {};
    this.settings = { master: 0.8, sfx: 0.8, music: 0.35, muted: false };
    this.musicOn = false;
    this._musicTimer = 0;
    this._nextNote = 0;
    this._step = 0;
    this._bubbleAcc = 0;
    this._crackleAcc = 0;
  }

  /** Create/resume the audio context (call from a user gesture). */
  unlock() {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || /** @type {any} */ (window).webkitAudioContext;
        if (!AC) return;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.connect(this.ctx.destination);
        this.sfx = this.ctx.createGain();
        this.sfx.connect(this.master);
        this.musicGain = this.ctx.createGain();
        this.musicGain.connect(this.master);
        const len = this.ctx.sampleRate * 2;
        const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d = buf.getChannelData(0);
        let b = 0;
        for (let i = 0; i < len; i++) {
          const white = Math.random() * 2 - 1;
          b = (b + 0.02 * white) / 1.02; // brownish
          d[i] = white * 0.6 + b * 3;
        }
        this.noise = buf;
        this._applyVolumes();
        for (const name of ['fire', 'stir', 'pour', 'boil', 'cold']) this._makeLoop(name);
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
    } catch {
      this.ctx = null;
    }
  }

  /** @param {Partial<{master:number, sfx:number, music:number, muted:boolean}>} s */
  setVolumes(s) {
    Object.assign(this.settings, s);
    this._applyVolumes();
  }

  _applyVolumes() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const m = this.settings.muted ? 0 : this.settings.master;
    this.master.gain.setTargetAtTime(m, t, 0.05);
    this.sfx.gain.setTargetAtTime(this.settings.sfx, t, 0.05);
    this.musicGain.gain.setTargetAtTime(this.settings.music * 0.5, t, 0.2);
  }

  _makeLoop(name) {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    if (name === 'fire') { filter.type = 'lowpass'; filter.frequency.value = 500; }
    else if (name === 'stir') { filter.type = 'bandpass'; filter.frequency.value = 700; filter.Q.value = 1.2; }
    else if (name === 'pour') { filter.type = 'bandpass'; filter.frequency.value = 1200; filter.Q.value = 2; }
    else if (name === 'boil') { filter.type = 'lowpass'; filter.frequency.value = 300; }
    else { filter.type = 'highpass'; filter.frequency.value = 4000; }
    src.connect(filter).connect(gain).connect(this.sfx);
    src.start(0, Math.random() * 1.5);
    this.loops[name] = { gain, filter };
  }

  /**
   * Continuous sound levels, called every frame.
   * @param {{fire:number, stir:number, pour:number, boil:number, cold:number}} lv 0..1
   */
  update(lv, dt) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    const set = (n, v, f) => {
      const l = this.loops[n];
      if (!l) return;
      l.gain.gain.setTargetAtTime(v, t, 0.08);
      if (f) l.filter.frequency.setTargetAtTime(f, t, 0.1);
    };
    set('fire', lv.fire * 0.22);
    set('stir', Math.min(1, lv.stir) * 0.16, 500 + lv.stir * 700);
    set('pour', lv.pour * 0.12, 900 + Math.sin(t * 13) * 300 + 400);
    set('boil', lv.boil * 0.12);
    set('cold', lv.cold * 0.03);
    // crackles and bubble pops
    this._crackleAcc += dt * lv.fire * 7;
    while (this._crackleAcc > 1) { this._crackleAcc -= Math.random() * 2; this._crackle(); }
    this._bubbleAcc += dt * lv.boil * 14;
    while (this._bubbleAcc > 1) { this._bubbleAcc -= 1 + Math.random(); this._bubble(); }
  }

  _env(node, t, a, peak, decay) {
    node.gain.setValueAtTime(0.0001, t);
    node.gain.exponentialRampToValueAtTime(peak, t + a);
    node.gain.exponentialRampToValueAtTime(0.0001, t + a + decay);
  }

  _tone(freq, type, t, peak, decay, dest = this.sfx, attack = 0.005) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    this._env(g, t, attack, peak, decay);
    o.connect(g).connect(dest);
    o.start(t);
    o.stop(t + attack + decay + 0.05);
    return o;
  }

  _noiseBurst(t, peak, decay, type, freq, q = 1) {
    const s = this.ctx.createBufferSource();
    s.buffer = this.noise;
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = this.ctx.createGain();
    this._env(g, t, 0.004, peak, decay);
    s.connect(f).connect(g).connect(this.sfx);
    s.start(t, Math.random());
    s.stop(t + decay + 0.1);
  }

  _crackle() {
    const t = this.ctx.currentTime + Math.random() * 0.05;
    this._noiseBurst(t, 0.08 + Math.random() * 0.08, 0.03, 'highpass', 2000 + Math.random() * 2000);
  }

  _bubble() {
    const t = this.ctx.currentTime + Math.random() * 0.05;
    const o = this._tone(180 + Math.random() * 260, 'sine', t, 0.05, 0.08);
    o.frequency.exponentialRampToValueAtTime(500 + Math.random() * 300, t + 0.07);
  }

  /** One-shot sound effects. @param {string} name */
  play(name, opts = {}) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime + 0.01;
    switch (name) {
      case 'click':
        this._tone(900, 'square', t, 0.03, 0.03);
        break;
      case 'select':
        this._tone(660, 'triangle', t, 0.06, 0.06);
        this._tone(990, 'triangle', t + 0.04, 0.05, 0.06);
        break;
      case 'error':
        this._tone(140, 'sawtooth', t, 0.06, 0.18);
        break;
      case 'glass':
        this._tone(2350, 'sine', t, 0.12, 0.5);
        this._tone(3520, 'sine', t + 0.01, 0.06, 0.35);
        this._tone(4900, 'sine', t + 0.015, 0.03, 0.2);
        break;
      case 'coin':
        [988, 1319, 1976].forEach((f, k) => this._tone(f, 'square', t + k * 0.07, 0.05, 0.12));
        break;
      case 'purchase':
        this._tone(523, 'triangle', t, 0.08, 0.1);
        this._tone(784, 'triangle', t + 0.08, 0.08, 0.16);
        this._noiseBurst(t, 0.05, 0.08, 'bandpass', 3000, 3);
        break;
      case 'bell':
        [1, 2.76, 5.4].forEach((m, k) => this._tone(740 * m, 'sine', t + k * 0.003, 0.09 / (k + 1), 1.2 / (k + 1)));
        this._tone(560, 'sine', t + 0.25, 0.06, 1.0);
        break;
      case 'discover':
        [523, 659, 784, 1047].forEach((f, k) => this._tone(f, 'triangle', t + k * 0.09, 0.08, 0.3));
        break;
      case 'fanfare':
        [523, 659, 784, 1047, 1319].forEach((f, k) => this._tone(f, 'square', t + k * 0.1, 0.05, 0.25));
        [523, 659, 784].forEach((f) => this._tone(f, 'triangle', t + 0.55, 0.06, 1.0));
        break;
      case 'crush':
        this._noiseBurst(t, 0.25, 0.12, 'lowpass', 900);
        this._tone(90, 'sine', t, 0.15, 0.12);
        break;
      case 'reaction':
        this._noiseBurst(t, 0.12, 0.35, 'highpass', 3500);
        [880, 1175, 1568].forEach((f, k) => this._tone(f, 'sine', t + k * 0.05, 0.04, 0.4));
        break;
      case 'freeze':
        for (let k = 0; k < 4; k++) this._tone(2600 + Math.random() * 1800, 'sine', t + k * 0.05, 0.03, 0.25);
        break;
      case 'ignite':
        this._noiseBurst(t, 0.25, 0.5, 'lowpass', 1200);
        break;
      case 'splash':
        this._noiseBurst(t, 0.1, 0.15, 'bandpass', 900, 1.5);
        break;
      case 'lid':
        this._tone(220, 'square', t, 0.06, 0.08);
        this._noiseBurst(t, 0.08, 0.06, 'bandpass', 1500, 2);
        break;
      case 'page':
        this._noiseBurst(t, 0.07, 0.12, 'bandpass', 2500, 0.8);
        break;
      case 'fail':
        [392, 330, 262].forEach((f, k) => this._tone(f, 'triangle', t + k * 0.12, 0.06, 0.25));
        break;
    }
    void opts;
  }

  /** Gentle procedural lute music. @param {boolean} on */
  music(on) {
    this.musicOn = on;
    if (!this.ctx) return;
    if (on && !this._musicTimer) {
      this._nextNote = this.ctx.currentTime + 0.2;
      this._musicTimer = /** @type {any} */ (setInterval(() => this._scheduleMusic(), 120));
    } else if (!on && this._musicTimer) {
      clearInterval(this._musicTimer);
      this._musicTimer = 0;
    }
  }

  _scheduleMusic() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const scale = [146.8, 164.8, 174.6, 196, 220, 246.9, 261.6, 293.7, 329.6, 349.2, 392, 440];
    const beat = 0.43;
    while (this._nextNote < this.ctx.currentTime + 0.5) {
      const t = this._nextNote;
      const bar = Math.floor(this._step / 8) % 4;
      const chordRoot = [0, 3, 4, 2][bar];
      if (this._step % 8 === 0) this._pluck(scale[chordRoot] / 2, t, 0.06, 2.4);
      if (this._step % 2 === 0 || Math.random() < 0.3) {
        const deg = chordRoot + [0, 2, 4, 7, 5, 2, 4, 9][this._step % 8] + (Math.random() < 0.2 ? 1 : 0);
        this._pluck(scale[deg % scale.length], t, 0.035, 1.1);
      }
      this._step++;
      this._nextNote += beat / 2;
    }
  }

  _pluck(f, t, peak, decay) {
    const o = this.ctx.createOscillator();
    const o2 = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(f * 6, t);
    lp.frequency.exponentialRampToValueAtTime(f * 1.5, t + decay);
    o.type = 'triangle'; o2.type = 'square';
    o.frequency.value = f; o2.frequency.value = f * 2.001;
    const g2 = this.ctx.createGain();
    g2.gain.value = 0.15;
    this._env(g, t, 0.004, peak, decay);
    o.connect(lp); o2.connect(g2).connect(lp);
    lp.connect(g).connect(this.musicGain);
    o.start(t); o2.start(t);
    o.stop(t + decay + 0.1); o2.stop(t + decay + 0.1);
  }
}

export const audio = new AudioEngine();
