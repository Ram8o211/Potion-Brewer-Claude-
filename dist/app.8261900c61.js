// The Alchemist's Shop 1.0.0 — bundled build
// src/ui/icons.js
const __m3 = (() => {
const PAL = {
k: '#1a1218', K: '#3a2a30', w: '#fff6e0', W: '#c9c0b0', s: '#8a8296', S: '#4a4252',
y: '#ffd75a', Y: '#c48a2c', o: '#ff8a2a', r: '#e0402c', R: '#8a1f1a', b: '#4a8cff', B: '#23458f',
c: '#8fe0ff', g: '#7dc24a', G: '#3a6e24', n: '#a8743f', N: '#5a3a20', p: '#a678ff', P: '#5a3aa8',
m: '#ff5aa8', l: '#fff0b0', t: '#5fd4b4',
};
const ICONS = {
coin: ['....kkkk....', '..kkyyyykk..', '.kyyllyyyyk.', '.kylyyyyYyk.', 'kyylyyyyyYyk', 'kyyyyyyyyYyk', 'kyyyyyyyyYyk', 'kyyyyyyyYYyk', '.kyyyyyYYyk.', '.kyYYYYYyyk.', '..kkyyyykk..', '....kkkk....'],
star: ['.....kk.....', '....kyyk....', '....kyyk....', 'kkkkyyyykkkk', 'kyyyyyyyyyYk', '.kyyyyyyyYk.', '..kyyyyyYk..', '..kyyyyyYk..', '.kyyYkkYYyk.', '.kyYk..kYyk.', 'kyYk....kYyk', 'kkk......kkk'],
sun: ['.....kk.....', '..k..yy..k..', '...k....k...', '....kkkk....', '.k.kyyyyk.k.', 'kyykyllyykyy', 'yykyyyyyYkyk', '.k.kyyyYk.k.', '....kkkk....', '...k....k...', '..k..yy..k..', '.....kk.....'],
menu: ['............', '.kkkkkkkkkk.', '.kwwwwwwwwk.', '.kkkkkkkkkk.', '............', '.kkkkkkkkkk.', '.kwwwwwwwwk.', '.kkkkkkkkkk.', '............', '.kkkkkkkkkk.', '.kwwwwwwwwk.', '.kkkkkkkkkk.'],
spoon: ['.........kk.', '........knk.', '.......knk..', '......knk...', '.....knk....', '....knk.....', '..kkkk......', '.knnnnk.....', 'knnnnnNk....', 'knnnnNNk....', '.kNNNNk.....', '..kkkk......'],
pestle: ['........kk..', '.......kWsk.', '......kWsSk.', '.....kWsSk..', '....kWsSk...', '...kWsSk....', '..kWsSk.....', '.kWWsSk.....', '.kWsSSk.....', 'kWsSSk......', 'kSSSk.......', '.kkk........'],
skimmer: ['..........kk', '.........kyk', '........kyk.', '.......kyk..', '..kkkkkyk...', '.kyWyWykk...', 'kyWsWsWyk...', 'kWsWsWsWk...', 'kyWsWsWyk...', 'kWsWsWsWk...', '.kyWyWyk....', '..kkkkk.....'],
thermo: ['.....kk.....', '....kwwk....', '....kwsk....', '....kwsk....', '....kwrk....', '....kwrk....', '....kwrk....', '....kwrk....', '...krrrrk...', '..krrrrrrk..', '..krrrrRrk..', '...kkkkkk...'],
lens: ['...kkkk.....', '..kccccK....', '.kcwccccK...', 'kcwccccccK..', 'kcccccccck..', 'kccccccccK..', '.kccccccK...', '..kccccKkk..', '...kkkkkNnk.', '.......kNnk.', '........kNnk', '.........kkk'],
flask: ['....kkkk....', '....kwWk....', '....kwWk....', '...kkwWkk...', '..kwwwWWWk..', '.kwmmmmmmWk.', 'kwmmlmmmmmWk', 'kwmmmmmmmmWk', 'kwmmmmmmmPWk', '.kwmmmmmPWk.', '..kkkkkkkk..', '............'],
lid: ['............', '.....kk.....', '....knnk....', '..kkkkkkkk..', '.kSsssssssk.', 'kSsWWWWWWssk', 'kssssssssssk', 'kkkkkkkkkkkk', '............', '............', '............', '............'],
trash: ['....kkkk....', '.kkkkkkkkkk.', 'kWWWWWWWWWWk', '.kkkkkkkkkk.', '.kWsWsWsWsk.', '.kWsWsWsWsk.', '.kWsWsWsWsk.', '.kWsWsWsWsk.', '.kWsWsWsWsk.', '.kWsWsWsWsk.', '..kkkkkkkk..', '............'],
speed: ['............', 'k.....k.....', 'kk....kk....', 'kyk...kyk...', 'kyyk..kyyk..', 'kyyyk.kyyyk.', 'kyyyk.kyyyk.', 'kyyk..kyyk..', 'kyk...kyk...', 'kk....kk....', 'k.....k.....', '............'],
pause: ['............', '.kkkk..kkkk.', '.kwWk..kwWk.', '.kwWk..kwWk.', '.kwWk..kwWk.', '.kwWk..kwWk.', '.kwWk..kwWk.', '.kwWk..kwWk.', '.kwWk..kwWk.', '.kwWk..kwWk.', '.kkkk..kkkk.', '............'],
gear: ['.....kk.....', '..k.kssk.k..', '.ksksWWsksk.', '..kWWkkWWk..', '.ksWk..kWsk.', 'ksWk....kWsk', 'ksWk....kWsk', '.ksWk..kWsk.', '..kWWkkWWk..', '.ksksWWsksk.', '..k.kssk.k..', '.....kk.....'],
bag: ['....kkkk....', '...kN..Nk...', '...kN..Nk...', '..kkkkkkkk..', '.knnnnnnnnk.', 'knnnyynnnnNk', 'knnnyynnnnNk', 'knnnnnnnnnNk', 'knnnnnnnnnNk', 'knnnnnnnnNNk', '.kNNNNNNNNk.', '..kkkkkkkk..'],
book: ['............', '.kkkkkkkkkk.', 'kRrrrrrrrrRk', 'kRryyyyyyrRk', 'kRrrrrrrrrRk', 'kRrrryyrrrRk', 'kRrrryyrrrRk', 'kRrrrrrrrrRk', 'kRrrrrrrrrRk', 'kRwwwwwwwwwk', 'kRkkkkkkkkkk', '.k..........'],
scroll: ['..kkkkkkkk..', '.klllllllllk', 'k.kWWWWWWWlk', '.klllllllllk', '..klNNNNlk..', '..kllllllk..', '..klNNNNlk..', '..kllllllk..', '..klNNNlk...', '.kllllllllk.', 'klllllllll.k', '.kkkkkkkkkk.'],
help: ['...kkkkkk...', '..kyyyyyyk..', '.kyykkkkyyk.', '.kyk....kyk.', '.kk....kyyk.', '......kyyk..', '.....kyyk...', '.....kyk....', '.....kkk....', '.....kyk....', '.....kyk....', '.....kkk....'],
close: ['............', '.kk......kk.', 'krrk....krrk', '.krrk..krrk.', '..krrkkrrk..', '...krrrrk...', '...krrrrk...', '..krrkkrrk..', '.krrk..krrk.', 'krrk....krrk', '.kk......kk.', '............'],
flame: ['.....k......', '....kok.....', '....kook....', '...koyok....', '..koyyok.k..', '..koyyyokok.', '.koyyllyook.', '.koylllyyok.', 'koyylllyyok.', 'koyyllyyyok.', '.kooyyyook..', '..kkkkkkk...'],
snow: ['.....kk.....', '..k..cc..k..', '...kkcckk...', 'k..kcwwck..k', '.kkcwccwckk.', 'kccwcwwcwcck', 'kccwcwwcwcck', '.kkcwccwckk.', 'k..kcwwck..k', '...kkcckk...', '..k..cc..k..', '.....kk.....'],
heart: ['............', '.kkk...kkk..', 'krrrk.krrrk.', 'krlrrkrrrRk.', 'krrrrrrrrRk.', 'krrrrrrrrRk.', '.krrrrrrRk..', '..krrrrRk...', '...krrRk....', '....kRk.....', '.....k......', '............'],
eye: ['............', '...kkkkkk...', '.kkppppppkk.', 'kppkkkkkkppk', 'kpkcwbbbbkpk', 'kpkwbbBBbkpk', 'kpkcbbBBbkpk', 'kppkkkkkkppk', '.kkppppppkk.', '...kkkkkk...', '............', '............'],
shield: ['kkkkkkkkkkkk', 'kWssssssssWk', 'kssyssssysSk', 'ksyyyssyyySk', 'kssyyyyyysSk', 'kssyyyyyysSk', '.ksyyyyyySk.', '.kssyyyysSk.', '..kssyysSk..', '...kssSSk...', '....kSSk....', '.....kk.....'],
scales: ['.....kk.....', '....kyyk....', 'kkkkkyykkkkk', 'kyyyyyyyyyyk', '.k...yy...k.', 'kyk..yy..kyk', 'kyk..yy..kyk', 'kkkk.yy.kkkk', '.....yy.....', '...kkyykk...', '..kyyyyyyk..', '..kkkkkkkk..'],
bubbles: ['.......kk...', '......kcwk..', '......kcck..', '.kkk...kk...', 'kcwck.......', 'kccck..kkk..', '.kkk..kcwck.', '.....kcccck.', '..kk.kcccck.', '.kcwk.kccck.', '.kcck..kkk..', '..kk........'],
weight: ['....kkkk....', '....k..k....', '...kkkkkk...', '..kSssssSk..', '..kssssssk..', '.kSsswWsssk.', '.kssssssssk.', 'kSsssssssssk', 'ksssssssssSk', 'kssssssssSSk', 'kSSSSSSSSSSk', 'kkkkkkkkkkkk'],
drop: ['.....kk.....', '.....kbk....', '....kbbk....', '....kbbbk...', '...kbcbbk...', '...kbcbbbk..', '..kbccbbbk..', '..kbcbbbbBk.', '..kbbbbbbBk.', '..kbbbbbBBk.', '...kbbBBBk..', '....kkkkk...'],
palette: ['...kkkkkk...', '..kllllllk..', '.klrrllbblk.', 'kllrrllbbllk', 'kllllllllllk', 'klggllkklllk', 'klggllk.klk.', 'kllllk...k..', 'klyylk......', '.klyylk.....', '..kllllkk...', '...kkkk.....'],
lock: ['...kkkkkk...', '..kSsssssk..', '..ksk..ksk..', '..ksk..ksk..', '.kkkkkkkkkk.', '.kyyyyyyyyk.', '.kyyykkyyyk.', '.kyyykkyyYk.', '.kyyyykyyYk.', '.kyyyyyyYYk.', '.kkkkkkkkkk.', '............'],
check: ['............', '..........kk', '.........kgk', '........kggk', '.k.....kggk.', 'kgk...kggk..', 'kggk.kggk...', '.kggkggk....', '..kgggk.....', '...kgk......', '....k.......', '............'],
bulb: ['...kkkkk....', '..kllllyk...', '.kllwlllyk..', '.klwllllyk..', '.klllllllyk.', '.kllllllyyk.', '..kllllyyk..', '...kllyyk...', '...kWWWWk...', '...kSSSSk...', '...kWWWWk...', '....kkkk....'],
door: ['..kkkkkkkk..', '.knnnnnnnnk.', '.knNnnnnNnk.', '.knNnnnnNnk.', '.knnnnnnnnk.', '.knNnnnnNnk.', '.knNnnnnyyk.', '.knnnnnnyyk.', '.knNnnnnNnk.', '.knNnnnnNnk.', '.knnnnnnnnk.', 'kkkkkkkkkkkk'],
plus: ['............', '....kkkk....', '....kgGk....', '....kgGk....', '.kkkkgGkkkk.', '.kgggggggGk.', '.kGGGgGGGGk.', '.kkkkgGkkkk.', '....kgGk....', '....kGGk....', '....kkkk....', '............'],
jar: ['...kkkkkk...', '...knnnnk...', '..kkkkkkkk..', '..kcwwwwck..', '.kcwbbbbbck.', '.kwbbbbbbbk.', '.kwbbcbbbbk.', '.kwbbbbbbBk.', '.kwbbbbbbBk.', '.kcbbbbbBck.', '..kkkkkkkk..', '............'],
ladle: ['............', '.......kkkk.', '......kWWsk.', '.....kWsk...', '....kWsk....', '...kWsk.....', '.kkkkk......', 'kWyyyWk.....', 'kyWyWyk.....', 'kWyWyWk.....', '.kkkkk......', '............'],
alembic: ['......kkk...', '.....kyyyk..', '....kykkyk..', '...kyk..kyk.', '..kkkk...kyk', '.kyyyyk...kk', 'kyyyyyyk..kk', 'kyyyyyyyk.kk', 'kyyyyyyyk.k.', '.kyyyyyk....', '..kkkkk.....', '............'],
homunculus: ['...kkkkkk...', '..kyyyyyyk..', '..kykkykyk..', '..kyyyyyyk..', '...kkyykk...', '.kkyyyyyykk.', 'ky.kyyyyk.yk', '...kyyyyk...', '...kykkyk...', '...kyk.kyk..', '..kyyk.kyyk.', '..kkk...kkk.'],
rune: ['kkkkkkkkkkkk', 'kSSSSSSSSSSk', 'kSScSSSScSSk', 'kSSScSScSSSk', 'kSSSScSSSSSk', 'kScccccccSSk', 'kSSSScSSSSSk', 'kSSScSScSSSk', 'kSScSSSScSSk', 'kSSSSSSSSSSk', 'kkkkkkkkkkkk', '............'],
shelf: ['kkkkkkkkkkkk', 'k.kbk.kgk..k', 'k.kbk.kgkkkk', 'k.kbk.kgkryk', 'kNNNNNNNNNNk', 'k..kpk.kyk.k', 'k..kpk.kyk.k', 'kNNNNNNNNNNk', 'k.kkkk.kmk.k', 'k.kWWk.kmk.k', 'kNNNNNNNNNNk', 'k..........k'],
charter: ['.kkkkkkkkkk.', 'klllllllllNk', '.kllllllllk.', '.klNNNNNlk..', '.kllllllllk.', '.klNNNNNNlk.', '.kllllllllk.', '.klNNNlrrrk.', '.kllllrrrrk.', 'klllllrrrrk.', '.kkkkkkrrk..', '.......kk...'],
cauldron: ['............', '..kkkkkkkk..', '.kSSSSSSSSk.', 'kSkkkkkkkkSk', 'kSkggggggkSk', 'kSSkggggkSSk', 'kSSSSSSSSSSk', 'kSSSSSSSSSSk', '.kSSSSSSSSk.', '..kkSSSSkk..', '..kk.kk.kk..', '............'],
fire: ['......k.....', '.....kok....', '....koyok...', '...koyyok.k.', '...koylyokok', '..koyllyyok.', '..koyllyyok.', '...koyyyok..', '.kkkkkkkkkk.', 'kNnnkNNknnNk', '.kNNnnnnNNk.', '..kkkkkkkk..'],
cauldron2: ['............', '..kkkkkkkk..', '.kYYYYYYYYk.', 'kYkkkkkkkkYk', 'kYkbbbbbbkYk', 'koYkbbbbkYok', 'koooooooooYk', 'kooyoooooYYk', '.kooooooYYk.', '..kkooYYkk..', '..kk.kk.kk..', '............'],
cauldron3: ['.k........k.', 'kykkkkkkkkyk', '.kyyyyyyyyk.', 'kykkkkkkkkyk', 'kykppppppkyk', 'kSykppppkySk', 'kSSyyyyyySSk', 'kSSSSSSSSSSk', 'kSSSSSSSSSSk', '.kSSSSSSSSk.', '.kkkSSSSkkk.', '.kk.kkkk.kk.'],
shelf2: ['kkkkkkkkkkkk', 'kbkgkrkykmkk', 'kbkgkrkykmkk', 'kNNNNNNNNNNk', 'kpkykckbkgkk', 'kpkykckbkgkk', 'kNNNNNNNNNNk', 'kmkWkrkpkykk', 'kmkWkrkpkykk', 'kNNNNNNNNNNk', 'k..........k', 'kk........kk'],
furnace: ['..kkkkkkkk..', '.kssssssssk.', 'kssSSSSSSssk', 'ksSkkkkkkSsk', 'ksSkooyokSsk', 'ksSkoyyokSsk', 'ksSkkkkkkSsk', 'kssssssssssk', 'ksSsSsSsSsSk', 'kssssssssssk', 'kkkkkkkkkkkk', '............'],
bellows: ['............', '.kkkkkk.....', 'knnnnnnk....', 'knNnNnnnkkkk', 'knnnnnnnkyyk', 'knNnNnnnkkkk', 'knnnnnnk....', '.kkkkkk.....', '.kN..Nk.....', '.kN..Nk.....', 'kkk..kkk....', '............'],
basin: ['............', '............', 'kkkkkkkkkkkk', 'kWbbbbbbbbWk', 'kWbcbbbcbbWk', '.kWbbbbbbWk.', '.kWWWWWWWWk.', '..kkkkkkkk..', '............', '............', '............', '............'],
hydro: ['.....kk.....', '.....kwk....', '.....kwk....', '.....krk....', '.....kwk....', '.....krk....', '....kwwwk...', '...kwwwwwk..', '...kwyyywk..', '...kwyyywk..', '....kwwwk...', '.....kkk....'],
visco: ['..kkkkkkk...', '..kwbbbbk...', '..kwbbbbk...', '..kwbkkbk...', '..kwkSSkk...', '..kwbkkbk...', '..kwbbbbk...', '..kwbbbbk...', '..kwbbbbk...', '..kwbbbbk...', '..kkkkkkk...', '............'],
assay: ['............', '.kk.kk.kk...', '.kwkkwkkwk..', '.kwkkwkkwk..', '.krkkgkkbk..', '.krkkgkkbk..', '.krkkgkkbk..', 'kkkkkkkkkkk.', 'knnnnnnnnnk.', 'kNNNNNNNNNk.', 'kkkkkkkkkkk.', '............'],
monocle: ['....kkkk....', '...krrrok...', '..kroyyyok..', '..koyyyyyk..', '..kryyyyok..', '..krroyyrk..', '...krrrrk...', '....kkkk.k..', '.........k..', '..........k.', '...........k', '............'],
pour: ['............', '..kkkkkk....', '..knnnnk....', '.kkkkkkkk...', '.kcwwwwck...', 'kwbbbbbbbk..', 'kwbbbbbbbkk.', 'kwbbbbbbbbbk', '.kbbbbbbk.kb', '..kkkkkk...b', '...........b', '...........b'],
};
const cache = new Map();
function iconUrl(name, scale = 1) {
const key = name + ':' + scale;
if (cache.has(key)) return cache.get(key);
const grid = ICONS[name] || ICONS.help;
const n = 12;
const cv = document.createElement('canvas');
cv.width = n * scale;
cv.height = n * scale;
const ctx = cv.getContext('2d');
for (let y = 0; y < n; y++) {
const row = grid[y] || '';
for (let x = 0; x < n; x++) {
const ch = row[x];
if (!ch || ch === '.') continue;
ctx.fillStyle = PAL[ch] || '#ff00ff';
ctx.fillRect(x * scale, y * scale, scale, scale);
}
}
const url = cv.toDataURL();
cache.set(key, url);
return url;
}
function icon(name, cls = '') {
const img = document.createElement('img');
img.src = iconUrl(name, 1);
img.alt = '';
img.className = 'ico ' + cls;
img.draggable = false;
return img;
}
const ICON_NAMES = Object.keys(ICONS);
return { iconUrl, icon, ICON_NAMES, ICONS };
})();
// src/audio/audio.js
const __m4 = (() => {
class AudioEngine {
constructor() {
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
const audio = new AudioEngine();
return { AudioEngine, audio };
})();
// src/ui/dom.js
const __m2 = (() => {
const { icon } = __m3;
const { audio } = __m4;
function h(tag, attrs = {}, ...children) {
const el = document.createElement(tag);
for (const [k, v] of Object.entries(attrs || {})) {
if (v === undefined || v === null || v === false) continue;
if (k === 'class') el.className = v;
else if (k === 'text') el.textContent = v;
else if (k === 'html') el.innerHTML = v;
else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
else el.setAttribute(k, v === true ? '' : String(v));
}
for (const c of children.flat(Infinity)) {
if (c === null || c === undefined || c === false) continue;
el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
}
return el;
}
function btn(label, onClick, opts = {}) {
const b = /** @type {HTMLButtonElement} */ (h('button', { class: 'btn ' + (opts.cls || ''), title: opts.title || label || '', 'aria-label': opts.title || label || '', 'data-act': opts.act || null }));
if (opts.icon) b.appendChild(icon(opts.icon));
if (label) b.appendChild(h('span', { class: opts.icon ? 'lbl' : '' }, label));
b.addEventListener('click', (e) => {
audio.play('click');
onClick && onClick(e);
});
if (opts.disabled) b.disabled = true;
return b;
}
function clear(el) {
while (el.firstChild) el.removeChild(el.firstChild);
return el;
}
let overlayRoot = null;
function setOverlayRoot(root) {
overlayRoot = root;
}
function modal(o) {
const body = h('div', { class: 'modal-body' }, o.body || []);
const head = h('div', { class: 'modal-head' }, h('h2', { text: o.title }));
const box = h('div', { class: 'modal frame ' + (o.wide ? 'wide ' : '') + (o.cls || ''), role: 'dialog', 'aria-label': o.title }, head, body);
if (o.foot && o.foot.length) box.appendChild(h('div', { class: 'modal-foot' }, o.foot));
const ov = h('div', { class: 'overlay' }, box);
let closed = false;
const close = () => {
if (closed) return;
closed = true;
ov.remove();
o.onClose && o.onClose();
};
if (o.closable !== false) {
const x = btn('', close, { icon: 'close', cls: 'icon', title: 'Close' });
head.appendChild(x);
ov.addEventListener('pointerdown', (e) => {
if (e.target === ov) close();
});
}
(overlayRoot || document.body).appendChild(ov);
return { close, el: box, body, head, overlay: ov };
}
function confirmDialog(title, text, okLabel = 'Yes', cls = 'primary') {
return new Promise((resolve) => {
let m;
const ok = btn(okLabel, () => { resolve(true); m.close(); }, { cls });
const no = btn('Cancel', () => { resolve(false); m.close(); });
m = modal({ title, body: h('div', { class: 'card parch', text }), foot: [no, ok], onClose: () => resolve(false) });
});
}
let toastBox = null;
function setToastRoot(root) {
toastBox = h('div', { class: 'toasts', 'aria-live': 'polite' });
root.appendChild(toastBox);
}
function toast(title, text = '', iconName = 'star', ms = 3200) {
if (!toastBox) return;
const t = h('div', { class: 'toast parch' }, icon(iconName), h('div', {}, h('b', { text: title }), text));
toastBox.appendChild(t);
while (toastBox.children.length > 4) toastBox.firstChild.remove();
setTimeout(() => {
t.classList.add('out');
setTimeout(() => t.remove(), 320);
}, ms);
}
function coins(v) {
return (Math.round(v * 10) / 10).toLocaleString('en-US', { maximumFractionDigits: 1 });
}
function starsText(n) {
return '★'.repeat(n) + '☆'.repeat(5 - n);
}
return { h, btn, clear, setOverlayRoot, modal, confirmDialog, setToastRoot, toast, coins, starsText };
})();
// src/core/rng.js
const __m6 = (() => {
function hashString(str) {
let h = 2166136261 >>> 0;
for (let i = 0; i < str.length; i++) {
h ^= str.charCodeAt(i);
h = Math.imul(h, 16777619);
}
h ^= h >>> 16;
h = Math.imul(h, 0x85ebca6b);
h ^= h >>> 13;
h = Math.imul(h, 0xc2b2ae35);
h ^= h >>> 16;
return h >>> 0;
}
class Rng {
constructor(seed) {
const s = typeof seed === 'string' ? hashString(seed) : seed >>> 0;
this.a = s ^ 0x9e3779b9;
this.b = Math.imul(s, 0x85ebca6b) ^ 0x243f6a88;
this.c = Math.imul(s ^ 0x13198a2e, 0xc2b2ae35);
this.d = 1;
for (let i = 0; i < 16; i++) this.next();
}
next() {
let a = this.a, b = this.b, c = this.c, d = this.d;
const t = (((a + b) | 0) + d) | 0;
d = (d + 1) | 0;
a = b ^ (b >>> 9);
b = (c + (c << 3)) | 0;
c = (c << 21) | (c >>> 11);
c = (c + t) | 0;
this.a = a; this.b = b; this.c = c; this.d = d;
return (t >>> 0) / 4294967296;
}
range(lo, hi) { return lo + (hi - lo) * this.next(); }
int(lo, hi) { return lo + Math.floor(this.next() * (hi - lo + 1)); }
pick(arr) { return arr[Math.floor(this.next() * arr.length)]; }
chance(p) { return this.next() < p; }
gauss() {
let u = 0, v = 0;
while (u === 0) u = this.next();
v = this.next();
return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
shuffle(arr) {
const out = arr.slice();
for (let i = out.length - 1; i > 0; i--) {
const j = Math.floor(this.next() * (i + 1));
const t = out[i]; out[i] = out[j]; out[j] = t;
}
return out;
}
weighted(items, weights) {
let total = 0;
for (const w of weights) total += w;
let r = this.next() * total;
for (let i = 0; i < items.length; i++) {
r -= weights[i];
if (r <= 0) return items[i];
}
return items[items.length - 1];
}
fork(label) {
return new Rng((hashString(label) ^ Math.floor(this.next() * 4294967296)) >>> 0);
}
}
return { hashString, Rng };
})();
// src/core/color.js
const __m8 = (() => {
function srgbToLinear(c) {
return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function linearToSrgb(c) {
if (c <= 0) return 0;
if (c >= 1) return 1;
return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}
function rgbToOklab(r, g, b) {
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
function oklabToRgb(L, a, b) {
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
function deltaE(lab1, lab2) {
const dL = lab1[0] - lab2[0], da = lab1[1] - lab2[1], db = lab1[2] - lab2[2];
return Math.sqrt(dL * dL + da * da + db * db) * 100;
}
function hslToRgb(h, s, l) {
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
function rgbToHex(rgb) {
const h = (v) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0');
return '#' + h(rgb[0]) + h(rgb[1]) + h(rgb[2]);
}
function hexToRgb(hex) {
const v = parseInt(hex.replace('#', ''), 16);
return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}
function hueOf(rgb) {
const [, a, b] = rgbToOklab(rgb[0], rgb[1], rgb[2]);
return ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
}
const HUE_NAMES = [
[20, 'crimson'], [45, 'scarlet'], [70, 'amber'], [95, 'golden'], [120, 'olive'],
[150, 'verdant'], [185, 'emerald'], [215, 'teal'], [245, 'azure'], [275, 'cobalt'],
[305, 'violet'], [335, 'magenta'], [360, 'rose'],
];
function describeColor(rgb) {
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
return { srgbToLinear, linearToSrgb, rgbToOklab, oklabToRgb, deltaE, hslToRgb, rgbToHex, hexToRgb, hueOf, describeColor };
})();
// src/materials/schema.js
const __m9 = (() => {
const ASPECTS = ['vitality', 'ardor', 'arcana', 'fortitude'];
const ASPECT_LABELS = ['Vitality', 'Ardor', 'Arcana', 'Fortitude'];
const MATERIAL_DEFAULTS = {
tint: 0.5,
opacity: 0.8,
density: 1.0,
gasDensity: 0.7,
viscosity: 1,
viscTemp: 0.02,
compat: [0.85, 0.1],
conductivity: 1,
heatCapacity: 4.0,
melt: 0,
boil: 100,
latentFusion: 60,
latentVapor: 380,
expansion: 0.0006,
flammability: 0,
ignition: 9999,
combustionHeat: 0,
reactivity: 0.1,
solubility: 0,
solubilityTemp: 0,
binder: 0,
friction: 0.62,
hardness: 0.5,
aspects: [0, 0, 0, 0],
glow: 0,
price: 4,
tier: 0,
product: false,
};
function completeMaterial(def) {
const m = /** @type {MaterialDef} */ ({ archetype: 'custom', description: '', ...MATERIAL_DEFAULTS, ...def });
m.aspects = (m.aspects || [0, 0, 0, 0]).slice(0, 4);
while (m.aspects.length < 4) m.aspects.push(0);
m.compat = m.compat.slice(0, 2);
if (m.boil === null || m.boil === undefined) m.boil = Infinity;
m.look = appearance(m);
return m;
}
const lin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const srgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
function appearance(m) {
return m.color.map((c) => Math.round(srgb(Math.pow(Math.max(0.003, lin(c)), m.tint)) * 1000) / 1000);
}
function volatilityOf(m) {
if (!isFinite(m.boil)) return 0;
const v = (180 - m.boil) / 220;
return Math.max(0, Math.min(1, v)) * 0.85 + m.reactivity * 0.15;
}
function serializeMaterial(m) {
return { ...m, boil: isFinite(m.boil) ? m.boil : 'inf' };
}
function deserializeMaterial(o) {
return completeMaterial({ ...o, boil: o.boil === 'inf' ? Infinity : o.boil });
}
return { ASPECTS, ASPECT_LABELS, MATERIAL_DEFAULTS, completeMaterial, appearance, volatilityOf, serializeMaterial, deserializeMaterial };
})();
// src/materials/names.js
const __m10 = (() => {
const { hueOf } = __m8;
const HUE_PREFIXES = [
[25, ['Bloodroot', 'Crimson', 'Wyrmblood', 'Rosehip', 'Cardinal']],
[55, ['Ember', 'Flamecap', 'Cinnabar', 'Foxfire', 'Saffron']],
[90, ['Amber', 'Marigold', 'Sunpetal', 'Honeydew', 'Gilded']],
[130, ['Mossy', 'Wormwood', 'Fernwater', 'Bogmyrtle', 'Willow']],
[175, ['Verdigris', 'Jadeleaf', 'Emerald', 'Mintwort', 'Glimmerfern']],
[215, ['Tidewater', 'Kelpie', 'Sea-glass', 'Mistral', 'Brinedeep']],
[255, ['Azure', 'Frostmere', 'Moonwell', 'Kingfisher', 'Skyshard']],
[290, ['Cobalt', 'Nightshade', 'Duskbloom', 'Starfall', 'Gloaming']],
[330, ['Violet', 'Hexberry', 'Mandrake', 'Amethyst', 'Witchbell']],
[361, ['Magenta', 'Heartsease', 'Faeblush', 'Rubywort', 'Fireweed']],
];
const NOUNS = {
water: ['Dew', 'Spring Water', 'Rainwater', 'Wellwater', 'Brook Water'],
oil: ['Oil', 'Tallow', 'Lamp Oil', 'Seed Oil', 'Pressing'],
syrup: ['Honey', 'Syrup', 'Treacle', 'Nectar', 'Molasses'],
spirit: ['Spirit', 'Aqua Vitae', 'Brandywine', 'Ether', 'Distillate'],
essence: ['Essence', 'Tincture', 'Extract', 'Ichor', 'Infusion'],
binder: ['Flour', 'Meal', 'Root Starch', 'Bone Meal', 'Clay Dust'],
salt: ['Salt', 'Crystals', 'Alum', 'Saltpetre', 'Brine Salt'],
ember: ['Ember Dust', 'Cinder Powder', 'Sulphur Bloom', 'Firegrit'],
frost: ['Frost Crystal', 'Rime Shard', 'Winter Gem', 'Hailstone'],
metal: ['Quickwater', 'Quicksilver', 'Liquid Pewter', 'Mercurium'],
crystal: ['Moonstone', 'Star Quartz', 'Aether Shard', 'Seer Crystal'],
wax: ['Wax Flakes', 'Tallow Chips', 'Candle Shavings'],
fizz: ['Fizzing Powder', 'Bubble Salts', 'Effervescent Dust'],
spores: ['Glowcap Spores', 'Lantern Moss Spores', 'Wisp Pollen'],
resin: ['Dragon Resin', 'Wyrm Amber', 'Sap of Ages'],
starlight: ['Starlight Tincture', 'Aurora Water', 'Comet Dew'],
moss: ['Troll Moss', 'Ironwort', 'Stonebark Dust'],
vapor: ['Swamp Vapour', 'Marsh Breath', 'Will-o-Gas'],
phoenix: ['Phoenix Ash', 'Sunbird Cinders', 'Rebirth Ash'],
void: ['Void Ink', 'Shadow Ichor', 'Abyssal Tar'],
};
const PLACE = ['Hollow', 'Fen', 'Crag', 'Vale', 'Mere', 'Barrow', 'Thorn', 'Elder', 'Raven', 'Gloam'];
function makeName(rng, color, archetype, used) {
const nouns = NOUNS[archetype] || ['Reagent'];
const hue = hueOf(color);
const sat = Math.max(...color) - Math.min(...color);
for (let attempt = 0; attempt < 30; attempt++) {
let prefix;
if (sat < 0.12 || rng.chance(0.2)) prefix = rng.pick(PLACE);
else prefix = rng.pick(HUE_PREFIXES.find(([lim]) => hue < lim)[1]);
const noun = rng.pick(nouns);
const name = /Quickwater|Quicksilver|Moonstone|Mercurium/.test(noun) && rng.chance(0.6) ? noun : `${prefix} ${noun}`;
if (!used.has(name)) {
used.add(name);
return name;
}
}
const fallback = `${rng.pick(PLACE)} ${rng.pick(nouns)} ${used.size}`;
used.add(fallback);
return fallback;
}
const PRODUCT_WORDS = {
elixir: ['Elixir', 'Restorative', 'Lifewater', 'Vigour Draught'],
ardent: ['Ardent Draught', 'Hearthfire Tonic', 'Blaze Cordial', 'Warming Brew'],
arcane: ['Arcane Tincture', 'Seer’s Philtre', 'Mystic Essence', 'Glimmer Serum'],
salve: ['Fortifying Salve', 'Stoneskin Balm', 'Bulwark Paste', 'Ironhide Unguent'],
caramel: ['Caramel', 'Burnt Treacle', 'Toffee Draught'],
panacea: ['Panacea', 'Cure-all', 'Grand Philtre'],
amalgam: ['Amalgam', 'Silvered Alloy', 'Star Mercury'],
phoenix: ['Phoenix Brew', 'Rebirth Draught', 'Sunfire Elixir'],
varnish: ['Varnish', 'Lacquer', 'Resin Balm'],
frostbloom: ['Frostbloom', 'Rime Essence', 'Winter Philtre'],
lumen: ['Lumen', 'Liquid Light', 'Starglow Serum'],
};
function makeProductName(rng, theme, color, used) {
const words = PRODUCT_WORDS[theme] || ['Brew'];
const hue = hueOf(color);
for (let attempt = 0; attempt < 30; attempt++) {
const prefix = rng.pick(HUE_PREFIXES.find(([lim]) => hue < lim)[1]);
const name = `${prefix} ${rng.pick(words)}`;
if (!used.has(name)) {
used.add(name);
return name;
}
}
const n = `${rng.pick(words)} No. ${used.size}`;
used.add(n);
return n;
}
return { NOUNS, makeName, PRODUCT_WORDS, makeProductName };
})();
// src/materials/generator.js
const __m7 = (() => {
const { Rng } = __m6;
const { hslToRgb } = __m8;
const { completeMaterial } = __m9;
const { makeName, makeProductName } = __m10;
const r2 = (v) => Math.round(v * 100) / 100;
function generateWorld(seed) {
const seedStr = String(seed);
const rng = new Rng('world:' + seedStr);
const usedNames = new Set();
const materials = [];
const roles = {};
let idc = 0;
const nextId = (tag) => `${tag}-${(idc++).toString(36)}`;
const add = (role, d) => {
const id = nextId(role);
const m = completeMaterial({ ...d, id });
m.name = d.name || makeName(rng, m.color, d.archetype, usedNames);
materials.push(m);
roles[role] = id;
return m;
};
const hue = (h, s, l) => hslToRgb(h, s, l);
const soot = add('soot', {
name: 'Soot', form: 'powder', archetype: 'ash', color: [0.17, 0.16, 0.16], tint: 0.9, opacity: 1,
density: 1.1, compat: [0.5, 0.3], friction: 0.72, melt: 3000, boil: Infinity, heatCapacity: 1, conductivity: 0.2,
price: 0, tier: 99, product: true, description: 'Charred residue left by fire.',
});
const smoke = add('smoke', {
name: 'Smoke', form: 'gas', archetype: 'smoke', color: [0.46, 0.44, 0.43], tint: 0.6, opacity: 0.6,
density: 0.8, gasDensity: 1.05, compat: [0.5, 0.3], melt: -200, boil: -150, heatCapacity: 1.2, conductivity: 0.2,
price: 0, tier: 99, product: true, description: 'Choking fumes from burning reagents.',
});
const waterHue = rng.range(185, 215);
const water = add('water', {
form: 'liquid', archetype: 'water', color: hue(waterHue, 0.55, 0.82), tint: 0.12, opacity: 0.5,
density: r2(rng.range(0.98, 1.02)), viscosity: r2(rng.range(0.9, 1.2)), compat: [r2(rng.range(0.83, 0.87)), r2(rng.range(0.08, 0.12))],
boil: Math.round(rng.range(97, 103)), melt: Math.round(rng.range(-1, 1)), heatCapacity: 4.2, conductivity: 1,
gasDensity: 0.62, latentVapor: 380, latentFusion: 60, price: 1, tier: 0,
description: 'Clear, thin and cheap — the base of most brews. The village well refills it for free.',
});
const oilHue = rng.pick([42, 50, 75, 95]);
const oil = add('oil', {
form: 'liquid', archetype: 'oil', color: hue(oilHue, 0.75, 0.55), tint: 0.55, opacity: 0.72,
density: r2(rng.range(0.8, 0.88)), viscosity: Math.round(rng.range(25, 70)), viscTemp: 0.025, compat: [r2(rng.range(0.13, 0.19)), r2(rng.range(0.08, 0.13))],
boil: Math.round(rng.range(260, 310)), melt: Math.round(rng.range(-25, -8)), heatCapacity: 1.9, conductivity: 0.3,
flammability: 0.85, ignition: Math.round(rng.range(215, 250)), combustionHeat: 900, smoke: smoke.id, ash: soot.id,
gasDensity: 2.5, price: 3, tier: 0, aspects: [0, 6, 0, 4], reactivity: 0.15,
description: 'Slick and golden; it will not mix with watery liquids and floats on top of them. Burns readily.',
});
const syrupHue = rng.range(25, 45);
const syrup = add('syrup', {
form: 'liquid', archetype: 'syrup', color: hue(syrupHue, 0.8, rng.range(0.38, 0.48)), tint: 0.7, opacity: 0.86,
density: r2(rng.range(1.36, 1.48)), viscosity: Math.round(rng.range(3500, 9000)), viscTemp: 0.045, compat: [r2(rng.range(0.76, 0.8)), r2(rng.range(0.16, 0.2))],
boil: Math.round(rng.range(180, 200)), melt: -12, heatCapacity: 3.2, conductivity: 0.55,
aspects: [10, 4, 0, 6], price: 5, tier: 0,
description: 'Thick, heavy and sweet. Sinks through watery liquids and flows reluctantly unless warmed.',
});
const spiritHue = rng.pick([120, 150, 280, 300]);
const spirit = add('spirit', {
form: 'liquid', archetype: 'spirit', color: hue(spiritHue, 0.45, 0.85), tint: 0.16, opacity: 0.35,
density: r2(rng.range(0.78, 0.82)), viscosity: r2(rng.range(1.1, 1.4)), compat: [r2(rng.range(0.6, 0.64)), r2(rng.range(0.13, 0.17))],
boil: Math.round(rng.range(68, 80)), melt: -110, heatCapacity: 2.4, conductivity: 0.75, latentVapor: 260,
flammability: 0.75, ignition: Math.round(rng.range(340, 380)), combustionHeat: 700, smoke: smoke.id, gasDensity: 1.5,
aspects: [0, 4, 8, 0], reactivity: 0.3, price: 4, tier: 0,
description: 'A light, volatile spirit. Blends with water, evaporates well below water’s boiling point and is flammable.',
});
const hA = rng.range(0, 360);
const hB = (hA + rng.range(120, 160)) % 360;
const hC = (hA + rng.range(220, 260)) % 360;
const essence = (role, h, asp, tier) =>
add(role, {
form: 'liquid', archetype: 'essence', color: hue(h, rng.range(0.75, 0.9), rng.range(0.42, 0.52)), tint: 1, opacity: 0.8,
density: r2(rng.range(1.02, 1.08)), viscosity: r2(rng.range(1.2, 2.2)), compat: [r2(rng.range(0.81, 0.86)), r2(rng.range(0.1, 0.14))],
boil: Math.round(rng.range(100, 106)), melt: Math.round(rng.range(-6, -3)), heatCapacity: 4.0, conductivity: 0.95,
aspects: asp, reactivity: 0.25, price: tier ? 6 : 4, tier,
description: 'A vividly coloured essence. Mixes freely with watery liquids and stains the whole brew.',
});
const essA = essence('essenceA', hA, [10, 0, 0, 0], 0);
const essB = essence('essenceB', hB, [0, 10, 0, 0], 0);
const binderHue = rng.range(30, 50);
const binder = add('binder', {
form: 'powder', archetype: 'binder', color: hue(binderHue, 0.3, rng.range(0.78, 0.88)), tint: 0.5, opacity: 1,
density: r2(rng.range(1.22, 1.36)), compat: [r2(rng.range(0.79, 0.83)), r2(rng.range(0.13, 0.17))],
friction: r2(rng.range(0.66, 0.76)), binder: r2(rng.range(0.9, 1)), melt: 1500, boil: Infinity, heatCapacity: 1.6, conductivity: 0.3,
flammability: 0.35, ignition: Math.round(rng.range(400, 440)), combustionHeat: 400, ash: soot.id,
aspects: [2, 0, 0, 10], price: 3, tier: 0,
description: 'A fine dry meal that piles like sand. Knead it with a watery liquid and it becomes a dough; add more liquid and it thins to a paste.',
});
const saltHue = rng.range(0, 360);
const salt = add('salt', {
form: 'powder', archetype: 'salt', color: hue(saltHue, 0.35, 0.9), tint: 0.3, opacity: 1,
density: r2(rng.range(1.9, 2.3)), compat: [r2(rng.range(0.84, 0.88)), r2(rng.range(0.08, 0.12))],
friction: r2(rng.range(0.57, 0.64)), solubility: r2(rng.range(0.22, 0.3)), solubilityTemp: 0.0025, melt: 800, boil: Infinity,
heatCapacity: 1.9, conductivity: 1.2, aspects: [6, 0, 0, 2], reactivity: 0.3, price: 3, tier: 0,
description: 'Glittering crystals that dissolve into watery liquids — faster when hot or stirred — making them denser.',
});
const essC = essence('essenceC', hC, [0, 0, 10, 0], 1);
const ember = add('ember', {
form: 'powder', archetype: 'ember', color: hue(rng.range(10, 25), 0.85, 0.5), tint: 0.8, opacity: 1,
density: 1.5, compat: [0.7, 0.3], friction: 0.62, solubility: 0.04, melt: 900, boil: Infinity, heatCapacity: 1.4, conductivity: 0.8,
flammability: 0.9, ignition: Math.round(rng.range(180, 215)), combustionHeat: 1200, ash: soot.id, glow: 0.35,
aspects: [0, 30, 0, 0], reactivity: 0.7, price: 8, tier: 1,
description: 'Warm, faintly glowing grit. Reacts eagerly and catches fire if overheated in open air.',
});
const frost = add('frost', {
form: 'solid', archetype: 'frost', color: hue(rng.range(180, 200), 0.6, 0.86), tint: 0.25, opacity: 0.7,
density: 0.98, compat: [0.85, 0.12], hardness: 0.35, melt: Math.round(rng.range(3, 8)), boil: 102, heatCapacity: 4.0,
conductivity: 1.4, latentFusion: 110, storeTemp: -30, aspects: [0, 0, 2, 12], price: 6, tier: 1,
description: 'Chunks of everlasting rime kept at -30°C. They melt into icy water, chilling the brew — or crush them first.',
});
const metal = add('metal', {
form: 'liquid', archetype: 'metal', color: [0.76, 0.78, 0.82], tint: 0.95, opacity: 1,
density: r2(rng.range(2.9, 3.4)), viscosity: 1.5, compat: [0.5, 0.95], boil: 360, melt: -38, heatCapacity: 1.5, conductivity: 4,
aspects: [0, 0, 4, 14], price: 9, tier: 1,
description: 'A heavy, mirror-bright liquid metal. Mixes with nothing and sinks beneath every other liquid.',
});
const crystal = add('crystal', {
form: 'solid', archetype: 'crystal', color: hue(rng.range(230, 275), 0.5, 0.78), tint: 0.7, opacity: 1,
density: 2.4, compat: [0.62, 0.3], hardness: 0.6, melt: 1200, boil: Infinity, solubility: 0.1, solubilityTemp: 0.002,
heatCapacity: 2, conductivity: 1.5, glow: 0.45, aspects: [0, 0, 30, 6], reactivity: 0.4, price: 14, tier: 2,
description: 'Hard luminous shards. Crush them with the pestle; the grains slowly dissolve into spirits.',
});
const wax = add('wax', {
form: 'powder', archetype: 'wax', color: hue(rng.range(45, 60), 0.6, 0.82), tint: 0.6, opacity: 0.95,
density: 0.92, compat: [0.15, 0.12], friction: 0.55, viscosity: 30, melt: Math.round(rng.range(56, 66)), boil: 360,
heatCapacity: 2.2, conductivity: 0.3, latentFusion: 40, flammability: 0.7, ignition: 250, combustionHeat: 800, smoke: smoke.id, ash: soot.id,
aspects: [0, 2, 0, 8], price: 6, tier: 2,
description: 'Waxy flakes that melt into an oily liquid when warmed and set into a solid cake when cooled.',
});
const fizz = add('fizz', {
form: 'powder', archetype: 'fizz', color: hue(rng.range(0, 360), 0.25, 0.92), tint: 0.2, opacity: 1,
density: 1.6, compat: [0.86, 0.1], friction: 0.6, solubility: 0.3, melt: 700, boil: Infinity, heatCapacity: 1.8,
aspects: [0, 0, 6, 0], reactivity: 0.8, price: 7, tier: 2,
description: 'An effervescent powder. Dissolved together with a certain essence it fizzes, releasing a heavy vapour.',
});
const spores = add('spores', {
form: 'powder', archetype: 'spores', color: hue(rng.range(160, 190), 0.7, 0.55), tint: 0.7, opacity: 1,
density: 0.9, compat: [0.75, 0.24], friction: 0.7, binder: 0.4, melt: 1500, boil: Infinity, heatCapacity: 1.5,
glow: 0.6, aspects: [4, 0, 22, 0], price: 10, tier: 2,
description: 'Softly glowing spores; light enough to float on water until kneaded in.',
});
const resin = add('resin', {
form: 'solid', archetype: 'resin', color: hue(rng.range(0, 15), 0.85, 0.38), tint: 0.9, opacity: 0.95,
density: 1.12, compat: [0.2, 0.2], hardness: 0.45, viscosity: 18000, viscTemp: 0.05, melt: Math.round(rng.range(72, 85)), boil: 380,
heatCapacity: 2, conductivity: 0.3, flammability: 0.6, ignition: 300, combustionHeat: 900, smoke: smoke.id, ash: soot.id,
aspects: [0, 22, 0, 16], price: 16, tier: 3,
description: 'Blood-red resin lumps. They soften into a very thick, oily liquid only when properly heated.',
});
const starlight = add('starlight', {
form: 'liquid', archetype: 'starlight', color: hue(rng.range(200, 240), 0.6, 0.9), tint: 0.6, opacity: 0.55,
density: 0.95, viscosity: 1, compat: [0.8, 0.18], boil: 96, melt: -20, heatCapacity: 3.8, glow: 0.85,
aspects: [6, 0, 45, 0], reactivity: 0.4, price: 25, tier: 3,
description: 'Bottled starlight that glimmers in the dark. Prized by mages.',
});
const moss = add('moss', {
form: 'powder', archetype: 'moss', color: hue(rng.range(85, 110), 0.5, 0.35), tint: 0.75, opacity: 1,
density: 1.15, compat: [0.78, 0.2], friction: 0.78, binder: 0.7, melt: 1500, boil: Infinity, heatCapacity: 1.7,
aspects: [6, 0, 0, 34], price: 15, tier: 3,
description: 'Dried troll moss. Binds into a tough green paste that toughens the drinker.',
});
const vapor = add('vapor', {
form: 'gas', archetype: 'vapor', color: hue(rng.range(90, 130), 0.5, 0.6), tint: 0.6, opacity: 0.5,
density: 1.05, gasDensity: 2.1, compat: [0.8, 0.2], melt: -40, boil: 9, heatCapacity: 3, latentVapor: 200,
aspects: [0, 0, 14, 0], reactivity: 0.5, price: 12, tier: 3,
description: 'A heavy marsh gas that pools low. It condenses into a liquid if the brew is chilled near freezing.',
});
const phoenix = add('phoenix', {
form: 'powder', archetype: 'phoenix', color: hue(rng.range(20, 35), 0.95, 0.55), tint: 0.85, opacity: 1,
density: 1.4, compat: [0.84, 0.15], friction: 0.6, solubility: 0.2, melt: 1200, boil: Infinity, heatCapacity: 1.6, glow: 0.7,
aspects: [20, 55, 0, 0], reactivity: 0.9, price: 40, tier: 4,
description: 'Ash that is still warm a century later. It reacts violently with water.',
});
const voidInk = add('void', {
form: 'liquid', archetype: 'void', color: hue(rng.range(260, 290), 0.6, 0.12), tint: 1, opacity: 1,
density: 1.26, viscosity: 60, compat: [0.35, 0.55], boil: 240, melt: -30, heatCapacity: 2.4,
aspects: [0, 0, 55, 20], reactivity: 0.6, price: 45, tier: 4,
description: 'Ink darker than night. It refuses to mix with water or oil and settles in its own layer.',
});
const reactions = [];
const blendColor = (a, b, shiftHue) => {
const c = hslToRgb(shiftHue, 0.85, 0.48);
return [0, 1, 2].map((k) => r2((a.color[k] + b.color[k]) * 0.15 + c[k] * 0.7));
};
const product = (role, theme, a, b, ra, rb, props) => {
const id = nextId(role);
const tot = ra + (b ? rb : 0);
const dens = (a.density * ra + (b ? b.density * rb : 0)) / tot;
const comp = b ? [r2((a.compat[0] * ra + b.compat[0] * rb) / tot), r2((a.compat[1] * ra + b.compat[1] * rb) / tot)] : a.compat.slice();
const color = props.color || blendColor(a, b || a, rng.range(0, 360));
const m = completeMaterial({
form: 'liquid', archetype: 'product', tint: 1, opacity: 0.85, heatCapacity: 3.6, boil: 108, melt: -8,
viscosity: 2, compat: comp, price: 0, tier: 99, product: true, ...props, id, name: '', color, density: r2(props.density ?? dens),
});
m.name = props.name || makeProductName(rng, theme, color, usedNames);
materials.push(m);
roles[role] = id;
return m;
};
const t = (lo, hi) => Math.round(rng.range(lo, hi) / 5) * 5;
const elixir = product('p_elixir', 'elixir', essA, salt, 2, 1, {
aspects: [70, 0, 6, 4], viscosity: 3, glow: 0.15, description: 'A restorative elixir created by dissolving salt into a vital essence and heating it.',
});
reactions.push({
id: 'r_elixir', name: elixir.name, kind: 'mix', a: essA.id, b: salt.id, ra: 2, rb: 1, products: [{ id: elixir.id, frac: 1 }],
minT: t(40, 55), maxT: 140, rate: 0.35, heat: 25, stir: 0.6,
hint: `Dissolve ${salt.name} in ${essA.name} and keep it hot.`,
});
const ardent = product('p_ardent', 'ardent', essB, ember, 2, 1, {
aspects: [0, 72, 0, 4], viscosity: 2.5, glow: 0.3, description: 'A fiery cordial that warms from the inside out.',
});
reactions.push({
id: 'r_ardent', name: ardent.name, kind: 'contact', a: essB.id, b: ember.id, ra: 2, rb: 1, products: [{ id: ardent.id, frac: 1 }],
minT: t(25, 40), maxT: 160, rate: 0.5, heat: 90, stir: 0.8,
hint: `${ember.name} reacts where it touches warm ${essB.name}. Stirring spreads the reaction.`,
});
const arcane = product('p_arcane', 'arcane', spirit, crystal, 3, 1, {
aspects: [0, 0, 75, 4], viscosity: 1.5, glow: 0.75, boil: 85, tint: 0.9, opacity: 0.7,
description: 'A glimmering tincture of dissolved moonlight, sought by scholars and wizards.',
});
reactions.push({
id: 'r_arcane', name: arcane.name, kind: 'mix', a: spirit.id, b: crystal.id, ra: 3, rb: 1, products: [{ id: arcane.id, frac: 1 }],
minT: t(35, 50), maxT: 70, rate: 0.4, heat: 15, stir: 0.6,
hint: `Crush ${crystal.name} and dissolve it in warm ${spirit.name} — but don't boil the spirit away.`,
});
const salve = product('p_salve', 'salve', binder, syrup, 1, 1, {
form: 'powder', binder: 1, friction: 0.7, solubility: 0, melt: 1500, boil: Infinity, heatCapacity: 2,
aspects: [10, 0, 0, 70], tint: 0.85, description: 'A dense, protective salve baked from dough and syrup.',
});
reactions.push({
id: 'r_salve', name: salve.name, kind: 'mix', a: binder.id, b: syrup.id, ra: 1, rb: 1, products: [{ id: salve.id, frac: 1 }],
minT: t(55, 70), maxT: 130, rate: 0.3, heat: -20, stir: 1.2,
hint: `Knead ${binder.name} with ${syrup.name} into a dough, then bake it gently.`,
});
const fizzGas = product('p_fizzgas', 'arcana', fizz, essB, 1, 1, {
name: 'Fizz Vapour', form: 'gas', gasDensity: 1.7, boil: -60, melt: -120, aspects: [0, 0, 8, 0], reactivity: 0.9, tint: 0.3,
color: [0.85, 0.88, 0.8], density: 0.9, description: 'The heavy bubbles released by a fizzing reaction.',
});
const spent = product('p_spent', 'fortitude', fizz, essB, 1, 1, {
name: 'Spent Salts', form: 'powder', solubility: 0.35, melt: 900, boil: Infinity, aspects: [0, 0, 4, 4], reactivity: 0.7,
color: [0.92, 0.9, 0.85], tint: 0.3, density: r2((fizz.density + essB.density) - 0.9), description: 'What remains after a fizz.',
});
reactions.push({
id: 'r_fizz', name: 'Effervescence', kind: 'mix', a: fizz.id, b: essB.id, ra: 1, rb: 1,
products: [{ id: fizzGas.id, frac: 0.5 }, { id: spent.id, frac: 0.5 }], minT: -10, maxT: 200, rate: 0.6, heat: -25, stir: 0.6,
hint: `${fizz.name} fizzes when dissolved into ${essB.name}. The bubbles make a brew lively and volatile.`,
});
const caramel = product('p_caramel', 'caramel', syrup, null, 1, 0, {
aspects: [14, 16, 0, 8], viscosity: Math.round(syrup.viscosity * 2.5), viscTemp: 0.05, boil: 260, melt: -5,
color: hue(rng.range(15, 30), 0.75, 0.24), tint: 0.95, description: 'Syrup darkened by fierce heat into a deep, warming caramel.',
});
reactions.push({
id: 'r_caramel', name: caramel.name, kind: 'decompose', a: syrup.id, b: null, ra: 1, rb: 0, products: [{ id: caramel.id, frac: 1 }],
minT: t(140, 160), maxT: 400, rate: 0.12, heat: 10, stir: 0.2,
hint: `Heat ${syrup.name} far beyond boiling water and it darkens.`,
});
const panacea = product('p_panacea', 'panacea', elixir, arcane, 1, 1, {
aspects: [85, 0, 62, 10], viscosity: 2, glow: 0.8, boil: 110, description: 'The legendary cure-all: vitality and arcana in perfect union.',
});
reactions.push({
id: 'r_panacea', name: panacea.name, kind: 'mix', a: elixir.id, b: arcane.id, ra: 1, rb: 1, products: [{ id: panacea.id, frac: 1 }],
minT: t(30, 40), maxT: 70, rate: 0.25, heat: 20, stir: 1,
hint: `Blend ${elixir.name} with ${arcane.name} while warm, not hot.`,
});
const amalgam = product('p_amalgam', 'amalgam', metal, crystal, 3, 1, {
aspects: [0, 0, 30, 60], viscosity: 3, compat: metal.compat.slice(), tint: 0.95, opacity: 1, boil: 380, melt: -20,
color: hue(rng.range(200, 260), 0.35, 0.65), description: 'Liquid metal infused with crystal — heavy, shining and protective.',
});
reactions.push({
id: 'r_amalgam', name: amalgam.name, kind: 'contact', a: metal.id, b: crystal.id, ra: 3, rb: 1, products: [{ id: amalgam.id, frac: 1 }],
minT: t(15, 25), maxT: 300, rate: 1.2, heat: 10, stir: 2,
hint: `${metal.name} swallows crushed ${crystal.name} wherever they touch.`,
});
const phoenixBrew = product('p_phoenix', 'phoenix', phoenix, water, 1, 2, {
aspects: [60, 70, 0, 6], viscosity: 2, glow: 0.6, boil: 115, description: 'A blazing brew of rebirth. Dangerous to make, wondrous to drink.',
});
reactions.push({
id: 'r_phoenix', name: phoenixBrew.name, kind: 'mix', a: phoenix.id, b: water.id, ra: 1, rb: 2, products: [{ id: phoenixBrew.id, frac: 1 }],
minT: 15, maxT: 300, rate: 0.5, heat: 160, stir: 0.6,
hint: `${phoenix.name} reacts violently with ${water.name} — keep the heat under control.`,
});
const varnish = product('p_varnish', 'varnish', resin, oil, 1, 1, {
aspects: [0, 22, 0, 56], viscosity: 900, viscTemp: 0.04, compat: [0.18, 0.15], boil: 330, melt: -10, flammability: 0.5, ignition: 280,
combustionHeat: 800, smoke: smoke.id, color: hue(rng.range(10, 25), 0.75, 0.3), description: 'A thick protective varnish of melted resin and oil.',
});
reactions.push({
id: 'r_varnish', name: varnish.name, kind: 'mix', a: resin.id, b: oil.id, ra: 1, rb: 1, products: [{ id: varnish.id, frac: 1 }],
minT: t(85, 100), maxT: 220, rate: 0.3, heat: 15, stir: 1,
hint: `Melt ${resin.name} into hot ${oil.name}.`,
});
const frostbloom = product('p_frostbloom', 'frostbloom', frost, essC, 1, 1, {
aspects: [0, 0, 32, 44], viscosity: 2, melt: -15, color: hue(rng.range(170, 200), 0.8, 0.6), glow: 0.25,
description: 'An icy bloom of crystal patterns suspended in liquid. Only forms in the cold.',
});
reactions.push({
id: 'r_frostbloom', name: frostbloom.name, kind: 'mix', a: frost.id, b: essC.id, ra: 1, rb: 1, products: [{ id: frostbloom.id, frac: 1 }],
minT: -30, maxT: t(5, 10), rate: 0.35, heat: -15, stir: 0.8,
hint: `Melted ${frost.name} and ${essC.name} combine only when kept near freezing.`,
});
const lumen = product('p_lumen', 'lumen', spores, starlight, 1, 1, {
aspects: [6, 0, 85, 0], viscosity: 1.5, glow: 1, color: hue(rng.range(160, 220), 0.9, 0.62), description: 'Liquid light. It glows bright enough to read by.',
});
reactions.push({
id: 'r_lumen', name: lumen.name, kind: 'contact', a: spores.id, b: starlight.id, ra: 1, rb: 1, products: [{ id: lumen.id, frac: 1 }],
minT: t(30, 40), maxT: 75, rate: 0.35, heat: 10, stir: 1,
hint: `${spores.name} bloom when kneaded into warm ${starlight.name}.`,
});
const ingredients = [water, oil, syrup, spirit, essA, essB, binder, salt, essC, ember, frost, metal, crystal, wax, fizz, spores, resin, starlight, moss, vapor, phoenix, voidInk].map((m) => m.id);
const starting = [water, oil, syrup, spirit, essA, essB, binder, salt].map((m) => m.id);
return { seed: seedStr, materials, ingredients, starting, reactions, roles };
}
function makeLookup(world, extra = []) {
const map = new Map();
for (const m of world.materials) map.set(m.id, m);
for (const m of extra) map.set(m.id, m);
return (id) => map.get(id);
}
return { generateWorld, makeLookup };
})();
// src/reactions/species.js
const __m13 = (() => {
const { rgbToOklab, srgbToLinear } = __m8;
const { volatilityOf } = __m9;
const MAX_SPECIES = 16;
const NO_BOIL = 1e6;
class SpeciesTable {
constructor() {
const S = MAX_SPECIES;
this.defs = new Array(S).fill(null);
this.slotOf = new Map();
this.count = 0; // highest used slot + 1
const f = () => new Float32Array(S);
this.density = f();
this.gasDensity = f();
this.lnVisc = f();
this.viscTemp = f();
this.compatA = f();
this.compatB = f();
this.conductivity = f();
this.heatCap = f();
this.melt = f();
this.boil = f();
this.latF = f();
this.latV = f();
this.expansion = f();
this.flam = f();
this.ignition = f();
this.combHeat = f();
this.reactivity = f();
this.volatility = f();
this.solubility = f();
this.solTemp = f();
this.binder = f();
this.friction = f();
this.hardness = f();
this.glow = f();
this.tint = f();
this.opacity = f();
this.labL = f();
this.labA = f();
this.labB = f();
this.absR = f();
this.absG = f();
this.absB = f();
this.isPowder = new Uint8Array(S);
this.aspects = new Float32Array(S * 4);
this.ashSlot = new Int16Array(S).fill(-1);
this.smokeSlot = new Int16Array(S).fill(-1);
}
assign(slot, def, lookup) {
if (this.defs[slot]) this.release(slot);
const free = [];
for (let s = 0; s < slot; s++) if (!this.defs[s]) { this.defs[s] = /** @type {any} */ ({ id: '__hold' + s }); free.push(s); }
const got = this.ensure(def, undefined);
for (const s of free) this.defs[s] = null;
let c = 0;
for (let s = 0; s < MAX_SPECIES; s++) if (this.defs[s]) c = s + 1;
this.count = c;
if (lookup) {
if (def.ash) { const a = lookup(def.ash); if (a) { const as = this.slotOf.get(a.id); if (as !== undefined) this.ashSlot[got] = as; } }
if (def.smoke) { const m = lookup(def.smoke); if (m) { const ms = this.slotOf.get(m.id); if (ms !== undefined) this.smokeSlot[got] = ms; } }
}
return got;
}
ensure(def, lookup) {
const existing = this.slotOf.get(def.id);
if (existing !== undefined) return existing;
let slot = this.defs.indexOf(null);
if (slot < 0) return -1;
this.defs[slot] = def;
this.slotOf.set(def.id, slot);
this.count = Math.max(this.count, slot + 1);
this.density[slot] = def.density;
this.gasDensity[slot] = def.gasDensity;
this.lnVisc[slot] = Math.log(Math.max(0.2, def.viscosity));
this.viscTemp[slot] = def.viscTemp;
this.compatA[slot] = def.compat[0];
this.compatB[slot] = def.compat[1];
this.conductivity[slot] = def.conductivity;
this.heatCap[slot] = def.heatCapacity;
this.melt[slot] = def.melt;
this.boil[slot] = isFinite(def.boil) ? def.boil : NO_BOIL;
this.latF[slot] = def.latentFusion;
this.latV[slot] = def.latentVapor;
this.expansion[slot] = def.expansion;
this.flam[slot] = def.flammability;
this.ignition[slot] = def.ignition;
this.combHeat[slot] = def.combustionHeat;
this.reactivity[slot] = def.reactivity;
this.volatility[slot] = volatilityOf(def);
this.solubility[slot] = def.solubility;
this.solTemp[slot] = def.solubilityTemp;
this.binder[slot] = def.binder;
this.friction[slot] = def.friction;
this.hardness[slot] = def.hardness;
this.glow[slot] = def.glow;
this.tint[slot] = def.tint;
this.opacity[slot] = def.opacity;
const ab = absorbance(def);
this.absR[slot] = ab[0];
this.absG[slot] = ab[1];
this.absB[slot] = ab[2];
const lab = rgbToOklab(def.color[0], def.color[1], def.color[2]);
this.labL[slot] = lab[0];
this.labA[slot] = lab[1];
this.labB[slot] = lab[2];
this.isPowder[slot] = def.form === 'powder' || def.form === 'solid' ? 1 : 0;
for (let k = 0; k < 4; k++) this.aspects[slot * 4 + k] = def.aspects[k] || 0;
if (lookup) {
if (def.ash) {
const a = lookup(def.ash);
if (a) this.ashSlot[slot] = this.ensure(a, lookup);
}
if (def.smoke) {
const s = lookup(def.smoke);
if (s) this.smokeSlot[slot] = this.ensure(s, lookup);
}
}
return slot;
}
release(slot) {
const def = this.defs[slot];
if (!def) return;
this.slotOf.delete(def.id);
this.defs[slot] = null;
this.ashSlot[slot] = -1;
this.smokeSlot[slot] = -1;
for (let s = 0; s < MAX_SPECIES; s++) {
if (this.ashSlot[s] === slot) this.ashSlot[s] = -1;
if (this.smokeSlot[s] === slot) this.smokeSlot[s] = -1;
}
let c = 0;
for (let s = 0; s < MAX_SPECIES; s++) if (this.defs[s]) c = s + 1;
this.count = c;
}
list() {
const out = [];
for (let s = 0; s < this.count; s++) if (this.defs[s]) out.push({ id: this.defs[s].id, slot: s });
return out;
}
}
function absorbance(def) {
return [0, 1, 2].map((k) => -Math.log(Math.max(0.003, srgbToLinear(def.color[k]))) * def.tint);
}
return { MAX_SPECIES, NO_BOIL, SpeciesTable, absorbance };
})();
// src/reactions/mixture.js
const __m14 = (() => {
const { MAX_SPECIES, NO_BOIL } = __m13;
const { rgbToOklab, linearToSrgb } = __m8;
function granularFraction(sp, comp, off, T) {
let liquidPart = 0;
let gran = 0;
const n = sp.count;
for (let s = 0; s < n; s++) {
const f = comp[off + s];
if (f <= 0) continue;
if (sp.isPowder[s] && T < sp.melt[s]) continue;
liquidPart += f;
}
for (let s = 0; s < n; s++) {
const f = comp[off + s];
if (f <= 0 || !sp.isPowder[s] || T >= sp.melt[s]) continue;
const sol = Math.min(0.9, Math.max(0, sp.solubility[s] + sp.solTemp[s] * (T - 20)));
const dissolved = Math.min(f, sol * liquidPart * 1.2);
gran += f - dissolved;
}
return gran;
}
function suspensionLnMult(g, binder) {
const t = Math.min(1, Math.max(0, (g - 0.04) / 0.72));
const s = t * t * (3 - 2 * t);
return (8.5 + 3.5 * binder) * Math.pow(s, 1.5);
}
function mixtureProps(sp, comp, off, T) {
const n = sp.count;
let tot = 0, rho = 0, rhoCp = 0, lnV = 0, lnVw = 0, vT = 0, beta = 0;
let aR = 0, aG = 0, aB = 0, op = 0, glow = 0, vol = 0, volat = 0, react = 0;
const asp = [0, 0, 0, 0];
let tbW = 0, tbSum = 0;
for (let s = 0; s < n; s++) {
const f = comp[off + s];
if (f <= 0) continue;
tot += f;
rho += f * sp.density[s];
rhoCp += f * sp.heatCap[s];
beta += f * sp.expansion[s];
if (!sp.isPowder[s] || T >= sp.melt[s]) {
lnV += f * sp.lnVisc[s];
vT += f * sp.viscTemp[s];
lnVw += f;
}
aR += f * sp.absR[s];
aG += f * sp.absG[s];
aB += f * sp.absB[s];
op += f * sp.opacity[s];
glow += f * sp.glow[s];
volat += f * sp.volatility[s];
react += f * sp.reactivity[s];
for (let k = 0; k < 4; k++) asp[k] += f * sp.aspects[s * 4 + k];
if (sp.boil[s] < NO_BOIL) {
tbSum += f * sp.boil[s];
tbW += f;
vol += f;
}
}
if (tot <= 0) tot = 1;
const g = granularFraction(sp, comp, off, T) / tot;
let binder = 0, bw = 0;
for (let s = 0; s < n; s++) {
const f = comp[off + s];
if (f > 0 && sp.isPowder[s] && T < sp.melt[s]) {
binder += f * sp.binder[s];
bw += f;
}
}
binder = bw > 0 ? binder / bw : 0;
const lnMu20 = lnVw > 0 ? lnV / lnVw : Math.log(1e5);
const kT = lnVw > 0 ? vT / lnVw : 0;
const lnMu = lnMu20 - kT * (T - 20) + suspensionLnMult(g, binder);
const rgb = [linearToSrgb(Math.exp(-aR / tot)), linearToSrgb(Math.exp(-aG / tot)), linearToSrgb(Math.exp(-aB / tot))];
const lab = rgbToOklab(rgb[0], rgb[1], rgb[2]);
return {
density: (rho / tot) * (1 - (beta / tot) * (T - 20)),
density20: rho / tot,
heatCapacity: rhoCp / tot,
viscosity: Math.exp(lnMu),
granular: g,
binder,
color: rgb,
lab,
opacity: op / tot,
glow: glow / tot,
volatility: volat / tot,
reactivity: react / tot,
aspects: asp.map((v) => v / tot),
boil: tbW > 0 ? tbSum / tbW : Infinity,
volatileFraction: vol / tot,
};
}
function zeroComposition(n = MAX_SPECIES) {
return new Float32Array(n);
}
return { granularFraction, suspensionLnMult, mixtureProps, zeroComposition };
})();
// src/game/predict.js
const __m12 = (() => {
const { SpeciesTable, MAX_SPECIES } = __m13;
const { mixtureProps } = __m14;
function predictPlan(world, lookup, plan) {
const vol = new Map();
let total = 0;
for (const ing of plan.ingredients) {
vol.set(ing.id, (vol.get(ing.id) || 0) + ing.n);
total += ing.n;
}
const fired = [];
const lo = Math.min(20, plan.coolTo ?? 20, plan.serveTemp ?? 20);
const hi = Math.max(20, plan.heatTo ?? 20, plan.serveTemp ?? 20);
for (let pass = 0; pass < 3; pass++) {
for (const r of world.reactions) {
const a = vol.get(r.a) || 0;
const b = r.b ? vol.get(r.b) || 0 : Infinity;
if (a <= 0 || b <= 0) continue;
if (r.maxT < lo || r.minT > hi) continue;
const yieldF = r.kind === 'decompose' ? 0.55 : 0.88;
const ext = Math.min(a / r.ra, r.b ? b / r.rb : Infinity) * yieldF;
if (ext <= 0.01) continue;
vol.set(r.a, a - ext * r.ra);
if (r.b) vol.set(r.b, b - ext * r.rb);
const used = ext * (r.ra + (r.b ? r.rb : 0));
for (const pr of r.products) vol.set(pr.id, (vol.get(pr.id) || 0) + used * pr.frac);
fired.push(r.id);
}
}
for (const [id, v] of vol) {
const d = lookup(id);
if (d && d.form === 'gas' && d.boil < (plan.serveTemp ?? 20)) {
total -= v;
vol.set(id, 0);
}
}
const sp = new SpeciesTable();
const comp = new Float32Array(MAX_SPECIES);
for (const [id, v] of vol) {
if (v <= 1e-6) continue;
const def = lookup(id);
if (!def) continue;
const s = sp.ensure(def);
if (s >= 0) comp[s] += v / total;
}
const props = mixtureProps(sp, comp, 0, plan.serveTemp ?? 20);
const composition = {};
for (let s = 0; s < sp.count; s++) if (sp.defs[s] && comp[s] > 1e-5) composition[sp.defs[s].id] = comp[s];
return { ...props, composition, reactions: fired, totalParticles: total };
}
function planCost(plan, priceOf) {
let c = 0;
for (const ing of plan.ingredients) c += (ing.n * 5 / 100) * priceOf(ing.id);
return c;
}
return { predictPlan, planCost };
})();
// src/game/customers.js
const __m15 = (() => {
const { Rng } = __m6;
const ARCHETYPES = [
{
key: 'farmer', title: 'Farmer', styles: ['tonic', 'syrup'], props: ['temperature'], budget: 0.8, strict: 1.3, minRank: 0,
look: { hat: 'straw', outfit: [0.55, 0.42, 0.25], beardChance: 0.5 },
greet: ['Mornin’. The goats are poorly — I need {potion}.', 'Got coin for {potion}, if you can make it proper.', 'My missus sent me for {potion}. Don’t tell her I forgot the colour twice.'],
pleased: ['That’ll do nicely!', 'Smells like a good harvest.'], displeased: ['Hmm. Not quite what she asked for.', 'Bit off, innit?'],
},
{
key: 'innkeeper', title: 'Innkeeper', styles: ['tonic', 'syrup', 'warm'], props: ['temperature', 'quantity'], budget: 0.9, strict: 1.2, minRank: 0,
look: { hat: 'cap', outfit: [0.45, 0.28, 0.2], beardChance: 0.3, apron: true },
greet: ['The common room’s full of coughing travellers. I need {potion}.', 'Make me {potion} — the guests pay well for a warm draught.'],
pleased: ['Perfect, they’ll be singing tonight!', 'On the house next time you visit.'], displeased: ['The regulars will grumble…', 'I’ll water it down and pretend.'],
},
{
key: 'bard', title: 'Bard', styles: ['syrup', 'tonic', 'fizzy'], props: ['viscosity', 'volatility'], budget: 1.0, strict: 1.1, minRank: 0,
look: { hat: 'feather', outfit: [0.6, 0.2, 0.45], beardChance: 0.2 },
greet: ['A sweet, smooth {potion} for my throat — tonight I perform for a duke!', 'Brew me {potion}, alchemist, and I shall write a ballad of you.'],
pleased: ['Magnificent! I feel a song coming on.', 'Ah, honeyed perfection.'], displeased: ['My voice cracks just looking at it.', 'A minor key, I’m afraid.'],
},
{
key: 'healer', title: 'Healer', styles: ['elixir', 'salve', 'syrup'], props: ['viscosity', 'vitality', 'temperature'], budget: 1.15, strict: 0.9, minRank: 0,
look: { hat: 'hood', outfit: [0.85, 0.85, 0.8], beardChance: 0.1 },
greet: ['My patients need {potion}. Precision matters — lives depend on it.', 'I require {potion}, prepared exactly as described.'],
pleased: ['Excellent work. This will save lives.', 'Precisely right. Thank you.'], displeased: ['This won’t do for my patients.', 'Careless. I expected better.'],
},
{
key: 'knight', title: 'Knight', styles: ['elixir', 'heavy', 'salve', 'ardent'], props: ['vitality', 'fortitude', 'density'], budget: 1.25, strict: 1.0, minRank: 1,
look: { hat: 'helm', outfit: [0.6, 0.62, 0.68], beardChance: 0.6 },
greet: ['I ride for the border at dawn. Brew me {potion} — something with backbone.', 'The king’s coin, for {potion}. Make it hearty.'],
pleased: ['A warrior’s draught! My thanks.', 'This will see me through the battle.'], displeased: ['I’ve tasted better from a ditch.', 'Hm. It will have to do.'],
},
{
key: 'traveler', title: 'Traveller', styles: ['ardent', 'tonic', 'warm'], props: ['density', 'temperature', 'ardor'], budget: 1.0, strict: 1.1, minRank: 0,
look: { hat: 'wide', outfit: [0.35, 0.4, 0.3], beardChance: 0.5 },
greet: ['The mountain pass is freezing. I need {potion}, light enough to carry.', 'Long road ahead. {potion}, please — quickly.'],
pleased: ['That’ll keep the frost out of my bones.', 'Safe roads to you, friend.'], displeased: ['Heavy as a stone, this.', 'I’ll manage, I suppose.'],
},
{
key: 'scholar', title: 'Scholar', styles: ['arcane', 'tonic', 'lumen'], props: ['stability', 'arcana'], budget: 1.2, strict: 0.85, minRank: 1,
look: { hat: 'none', outfit: [0.25, 0.3, 0.5], beardChance: 0.4, glasses: true },
greet: ['For my research I require {potion}. It must be perfectly stable.', 'Fascinating shop. I need {potion} — homogeneous, mind you.'],
pleased: ['Remarkable consistency! Exactly as theorised.', 'This will make an excellent footnote.'], displeased: ['Inconsistent results. Disappointing.', 'The data will be noisy.'],
},
{
key: 'witch', title: 'Hedge Witch', styles: ['salve', 'fizzy', 'frost', 'arcane'], props: ['viscosity', 'volatility', 'fortitude'], budget: 1.1, strict: 1.0, minRank: 1,
look: { hat: 'witch', outfit: [0.2, 0.25, 0.2], beardChance: 0 },
greet: ['Hehe… a {potion}, dearie. Thick enough to stand a spoon in.', 'The coven wants {potion}. Don’t ask what for.'],
pleased: ['Wicked work, dearie!', 'The coven will be pleased.'], displeased: ['Pah! A toad could brew better.', 'Too weak, too weak…'],
},
{
key: 'blacksmith', title: 'Blacksmith', styles: ['heavy', 'ardent', 'warm'], props: ['temperature', 'density', 'ardor'], budget: 1.1, strict: 1.1, minRank: 1,
look: { hat: 'bandana', outfit: [0.3, 0.22, 0.18], beardChance: 0.8, apron: true },
greet: ['Need {potion} for quenching. Hot, and heavy.', 'Forge is roaring. Bring me {potion}.'],
pleased: ['Hah! That’s the stuff.', 'Good and solid.'], displeased: ['Too thin. Like my patience.', 'That won’t temper anything.'],
},
{
key: 'noble', title: 'Noble', styles: ['tonic', 'elixir', 'arcane', 'lumen'], props: ['stability', 'color'], budget: 1.6, strict: 0.7, minRank: 2,
look: { hat: 'crown', outfit: [0.5, 0.1, 0.25], beardChance: 0.3 },
greet: ['I require {potion}, and the colour must be EXACT. I shall know.', 'My banquet demands {potion}. Spare no expense — but spare me mistakes.'],
pleased: ['Exquisite. You may be presented at court.', 'Acceptable. More than acceptable.'], displeased: ['Vulgar. Simply vulgar.', 'Did you even look at the colour?'],
},
{
key: 'wizard', title: 'Wizard', styles: ['arcane', 'fizzy', 'frost', 'lumen', 'panacea'], props: ['arcana', 'volatility', 'stability'], budget: 1.5, strict: 0.85, minRank: 2,
look: { hat: 'wizard', outfit: [0.25, 0.2, 0.55], beardChance: 0.9 },
greet: ['Ah, an apprentice of the Art. Prepare {potion} — the stars align tonight.', 'I seek {potion} with unusual properties. Impress me.'],
pleased: ['The aether sings! Splendid.', 'Yes… yes! This will do.'], displeased: ['The aether is offended.', 'Mundane. Utterly mundane.'],
},
{
key: 'hunter', title: 'Hunter', styles: ['tonic', 'heavy', 'salve', 'frost'], props: ['stability', 'volatility', 'temperature'], budget: 1.05, strict: 1.0, minRank: 1,
look: { hat: 'hood', outfit: [0.3, 0.38, 0.22], beardChance: 0.5 },
greet: ['Something that won’t spoil in my pack — {potion}.', 'Big game in the woods. I’ll need {potion}.'],
pleased: ['Good. Steady as a held breath.', 'That’ll keep.'], displeased: ['It’s already separating.', 'Won’t last a day out there.'],
},
];
const FIRST = ['Aldric', 'Bryn', 'Cedric', 'Dagna', 'Edda', 'Fenwick', 'Gwen', 'Hob', 'Isolde', 'Jory', 'Kestrel', 'Liesl', 'Mabry', 'Nell', 'Osric', 'Perrin', 'Quill', 'Rowena', 'Sabine', 'Tamsin', 'Ulric', 'Vesna', 'Wynn', 'Yara', 'Zebedee', 'Agnes', 'Bertram', 'Cora', 'Dunstan', 'Elowen', 'Godric', 'Hilda', 'Ivo', 'Maud', 'Piers', 'Rosalind', 'Tobias', 'Wilda'];
const LAST = ['Ashdown', 'Brightwater', 'Copperpot', 'Dunmore', 'Elderberry', 'Fairweather', 'Greaves', 'Hollins', 'Ironside', 'Juniper', 'Kettleby', 'Larkspur', 'Millward', 'Nettlefold', 'Oakhart', 'Pennywhistle', 'Quarrel', 'Ravensby', 'Stonebridge', 'Thistlewood', 'Underhill', 'Vane', 'Whitlock', 'Yarrow'];
const SKIN = [[0.96, 0.8, 0.66], [0.87, 0.66, 0.5], [0.72, 0.52, 0.36], [0.55, 0.38, 0.26], [0.4, 0.27, 0.18], [0.98, 0.86, 0.76]];
const HAIR = [[0.15, 0.1, 0.07], [0.35, 0.22, 0.12], [0.62, 0.38, 0.18], [0.85, 0.7, 0.4], [0.55, 0.55, 0.55], [0.9, 0.9, 0.88], [0.55, 0.2, 0.1]];
function makeCustomer(rng, arch) {
const name = `${rng.pick(FIRST)} ${rng.pick(LAST)}`;
return {
id: 'c' + Math.floor(rng.next() * 1e9).toString(36),
archetype: arch.key,
title: arch.title,
name,
portrait: {
seed: Math.floor(rng.next() * 1e9),
skin: rng.pick(SKIN),
hair: rng.pick(HAIR),
beard: rng.chance(arch.look.beardChance),
hat: arch.look.hat,
outfit: arch.look.outfit.map((c) => Math.max(0, Math.min(1, c + rng.range(-0.08, 0.08)))),
glasses: !!arch.look.glasses || rng.chance(0.08),
apron: !!arch.look.apron,
eyes: rng.pick([[0.2, 0.35, 0.6], [0.3, 0.2, 0.1], [0.2, 0.45, 0.25], [0.35, 0.35, 0.4]]),
age: rng.range(0, 1),
},
};
}
function archetypeOf(key) {
return ARCHETYPES.find((a) => a.key === key) || ARCHETYPES[0];
}
return { ARCHETYPES, makeCustomer, archetypeOf, Rng };
})();
// src/simulation/constants.js
const __m17 = (() => {
const PHASE = Object.freeze({ LIQUID: 0, POWDER: 1, PASTE: 2, SOLID: 3, GAS: 4 });
const PHASE_NAMES = ['liquid', 'powder', 'paste', 'solid', 'gas'];
const SIM = Object.freeze({
DT: 1 / 120,
RADIUS: 0.05,
SPACING: 0.1,
H: 0.22,
GRAVITY: 34,
MAX_SPEED: 5.0,
AMBIENT: 20,
ML_PER_PARTICLE: 5,
SPOON_RADIUS: 0.42,
SPOON_CORE: 0.12,
PESTLE_RADIUS: 0.17,
ITERATIONS: 3,
});
const TUNE = {
iterations: 3,
epsilon: 30,
cohesionLiquid: 0.06,
cohesionPaste: 0.1,
kCorr: 0.003,
viscBase: 0.08,
viscSlope: 0.085,
maxCorr: 0.03,
buoyancy: 0.5,
massPow: 2,
viscPressure: 1,
viscDampMax: 0.45,
viscDampSlope: 0.22,
};
function formPhase(form) {
if (form === 'powder') return PHASE.POWDER;
if (form === 'solid') return PHASE.SOLID;
if (form === 'gas') return PHASE.GAS;
return PHASE.LIQUID;
}
return { PHASE, PHASE_NAMES, SIM, TUNE, formPhase };
})();
// src/reactions/compatibility.js
const __m18 = (() => {
const COMPAT_FULL = 0.26;
const COMPAT_NONE = 0.4;
function compatFactor(a1, b1, a2, b2) {
const d = Math.hypot(a1 - a2, b1 - b2);
if (d <= COMPAT_FULL) return 1;
if (d >= COMPAT_NONE) return 0;
return 1 - (d - COMPAT_FULL) / (COMPAT_NONE - COMPAT_FULL);
}
function miscible(m1, m2) {
return compatFactor(m1.compat[0], m1.compat[1], m2.compat[0], m2.compat[1]) > 0.5;
}
return { COMPAT_FULL, COMPAT_NONE, compatFactor, miscible };
})();
// src/game/measure.js
const __m16 = (() => {
const { MAX_SPECIES } = __m13;
const { PHASE, SIM } = __m17;
const { compatFactor } = __m18;
const { oklabToRgb } = __m8;
const PROPERTY_KEYS = ['color', 'density', 'viscosity', 'temperature', 'vitality', 'ardor', 'arcana', 'fortitude', 'stability', 'volatility', 'quantity'];
function measureParticles(sim, indices) {
const n = indices.length;
if (!n) return null;
const p = sim.p, sp = sim.species, S = MAX_SPECIES;
const ns = sp.count;
const comp = new Float64Array(ns);
let L = 0, A = 0, B = 0, rho = 0, T = 0, lnMu = 0, glow = 0;
const phases = [0, 0, 0, 0, 0];
for (const i of indices) {
let tot = 0;
for (let s = 0; s < ns; s++) tot += p.comp[i * S + s];
tot = tot || 1;
for (let s = 0; s < ns; s++) comp[s] += p.comp[i * S + s] / tot;
L += p.colL[i]; A += p.colA[i]; B += p.colB[i];
rho += p.rho[i];
T += p.temp[i];
glow += p.glow[i];
const ph = p.phase[i];
phases[ph]++;
let lm = p.lnMu[i];
if (ph === PHASE.POWDER) lm = Math.max(lm, Math.log(2e5));
if (ph === PHASE.SOLID) lm = Math.log(1e7);
if (ph === PHASE.GAS) lm = Math.log(0.02);
lnMu += lm;
}
for (let s = 0; s < ns; s++) comp[s] /= n;
const composition = {};
const aspects = [0, 0, 0, 0];
let volat = 0;
for (let s = 0; s < ns; s++) {
const def = sp.defs[s];
if (!def || comp[s] < 1e-5) continue;
composition[def.id] = comp[s];
for (let k = 0; k < 4; k++) aspects[k] += comp[s] * sp.aspects[s * 4 + k];
volat += comp[s] * (sp.volatility[s] * 70 + sp.reactivity[s] * 30);
}
const lab = [L / n, A / n, B / n];
let het = 0;
for (const i of indices) {
let tot = 0;
for (let s = 0; s < ns; s++) tot += p.comp[i * S + s];
tot = tot || 1;
let d2 = 0;
for (let s = 0; s < ns; s++) {
const d = p.comp[i * S + s] / tot - comp[s];
d2 += d * d;
}
het += Math.sqrt(d2);
}
het /= n;
let cA = 0, cB = 0;
for (const i of indices) { cA += p.cA[i]; cB += p.cB[i]; }
cA /= n; cB /= n;
let incompatible = 0;
for (const i of indices) if (compatFactor(p.cA[i], p.cB[i], cA, cB) < 0.35) incompatible++;
const immiscible = Math.min(incompatible, n - incompatible) / n;
const sediment = (phases[PHASE.POWDER] + phases[PHASE.SOLID]) / n;
const gasFrac = phases[PHASE.GAS] / n;
const stability = clamp(100 - het * 240 - immiscible * 160 - sediment * 70 - gasFrac * 60, 0, 100);
volat += gasFrac * 40;
return {
count: n,
ml: n * SIM.ML_PER_PARTICLE,
composition,
color: oklabToRgb(lab[0], lab[1], lab[2]),
lab,
density: rho / n,
viscosity: Math.exp(lnMu / n),
temperature: T / n,
aspects,
stability,
volatility: clamp(volat, 0, 100),
phases: { liquid: phases[0] / n, powder: phases[1] / n, paste: phases[2] / n, solid: phases[3] / n, gas: phases[4] / n },
glow: glow / n,
};
}
function clamp(v, a, b) {
return v < a ? a : v > b ? b : v;
}
function tapSelection(sim, count) {
const p = sim.p;
const tx = 0, ty = sim.cauldron.depth;
const cand = [];
for (let i = 0; i < p.count; i++) {
const ph = p.phase[i];
if (ph === PHASE.GAS || ph === PHASE.SOLID) continue;
const dx = p.x[i] - tx, dy = p.y[i] - ty;
cand.push([dx * dx * 0.35 + dy * dy, i]);
}
cand.sort((a, b) => a[0] - b[0]);
return cand.slice(0, count).map((c) => c[1]);
}
function probeSelection(sim, x, y, r) {
const p = sim.p, out = [];
const r2 = r * r;
for (let i = 0; i < p.count; i++) {
const dx = p.x[i] - x, dy = p.y[i] - y;
if (dx * dx + dy * dy < r2) out.push(i);
}
return out;
}
function viscosityClass(cP) {
if (cP < 3) return 'watery';
if (cP < 30) return 'thin';
if (cP < 400) return 'syrupy';
if (cP < 8000) return 'thick';
if (cP < 120000) return 'paste';
return 'stiff dough';
}
const VISCOSITY_CLASSES = [
['watery', 0, 3], ['thin', 3, 30], ['syrupy', 30, 400], ['thick', 400, 8000], ['paste', 8000, 120000], ['stiff dough', 120000, 1e9],
];
return { PROPERTY_KEYS, measureParticles, tapSelection, probeSelection, viscosityClass, VISCOSITY_CLASSES };
})();
// src/game/commissions.js
const __m11 = (() => {
const { Rng } = __m6;
const { describeColor } = __m8;
const { predictPlan, planCost } = __m12;
const { ARCHETYPES, makeCustomer, archetypeOf } = __m15;
const { viscosityClass } = __m16;
const { SIM } = __m17;
const STYLE_NOUN = {
tonic: 'Tonic', syrup: 'Cordial', warm: 'Hot Toddy', salve: 'Salve', elixir: 'Elixir', ardent: 'Warming Draught', arcane: 'Arcane Philtre',
fizzy: 'Fizzing Brew', frost: 'Frost Draught', heavy: 'Heavy Draught', lumen: 'Glowing Philtre', panacea: 'Panacea', phoenix: 'Phoenix Brew', varnish: 'Protective Varnish',
};
const STYLE_TIER = { tonic: 0, syrup: 0, warm: 0, salve: 0, elixir: 1, ardent: 1, fizzy: 2, frost: 2, heavy: 1, arcane: 2, lumen: 3, varnish: 3, panacea: 4, phoenix: 4 };
function buildPlan(style, ctx, rng, n) {
const R = ctx.world.roles;
const has = (role) => R[role] && ctx.available.has(R[role]);
const rx = (id) => ctx.world.reactions.find((r) => r.id === id);
const essences = ['essenceA', 'essenceB', 'essenceC'].filter(has);
const parts = (weights) => {
const sum = weights.reduce((a, [, w]) => a + w, 0);
return weights.map(([id, w]) => ({ id, n: Math.max(2, Math.round((w / sum) * n)) }));
};
const room = 20;
switch (style) {
case 'tonic':
case 'warm': {
if (!has('water') || essences.length === 0) return null;
const e1 = R[rng.pick(essences)];
const w = [[R.water, rng.range(1, 3)], [e1, rng.range(0.6, 1.6)]];
if (essences.length > 1 && rng.chance(0.55)) {
let e2 = R[rng.pick(essences)];
if (e2 !== e1) w.push([e2, rng.range(0.3, 1.2)]);
}
const serve = style === 'warm' ? Math.round(rng.range(50, Math.min(85, ctx.cap.maxFlame - 40))) : rng.chance(0.25) ? Math.round(rng.range(35, 55)) : room;
return { ingredients: parts(w), heatTo: serve, coolTo: room, serveTemp: serve };
}
case 'syrup': {
if (!has('syrup') || !has('water')) return null;
const w = [[R.syrup, rng.range(1, 2.4)], [R.water, rng.range(0.8, 2)]];
if (essences.length && rng.chance(0.7)) w.push([R[rng.pick(essences)], rng.range(0.3, 0.9)]);
const serve = rng.chance(0.4) ? Math.round(rng.range(35, 55)) : room;
return { ingredients: parts(w), heatTo: serve, coolTo: room, serveTemp: serve, knead: true };
}
case 'salve': {
if (!has('binder')) return null;
const liquid = has('syrup') && rng.chance(0.3) ? R.syrup : R.water;
const w = [[R.binder, rng.range(1.1, 1.5)], [liquid, 1]];
if (essences.length && rng.chance(0.6)) w.push([R[rng.pick(essences)], rng.range(0.2, 0.4)]);
return { ingredients: parts(w), heatTo: room, coolTo: room, serveTemp: room, knead: true };
}
case 'elixir': {
if (!has('essenceA') || !has('salt') || !has('water')) return null;
const r = rx('r_elixir');
if (r.minT + 5 > ctx.cap.maxFlame - 60) return null;
const w = [[R.essenceA, rng.range(1.6, 2.4)], [R.salt, 1], [R.water, rng.range(0.4, 1.5)]];
const heat = Math.min(r.minT + rng.range(10, 25), 95);
const serve = rng.chance(0.5) ? Math.round(rng.range(40, heat)) : room;
return { ingredients: parts(w), heatTo: heat, coolTo: room, serveTemp: serve, hold: 15 };
}
case 'ardent': {
if (!has('essenceB') || !has('ember')) return null;
const r = rx('r_ardent');
const w = [[R.essenceB, rng.range(1.8, 2.6)], [R.ember, 1]];
if (has('water') && rng.chance(0.5)) w.push([R.water, rng.range(0.3, 1)]);
const heat = Math.min(r.minT + rng.range(10, 25), 90);
return { ingredients: parts(w), heatTo: heat, coolTo: room, serveTemp: Math.round(rng.range(45, heat)), hold: 12 };
}
case 'arcane': {
if (!has('spirit') || !has('crystal') || !ctx.cap.has('pestle')) return null;
const r = rx('r_arcane');
const w = [[R.spirit, rng.range(2.6, 3.4)], [R.crystal, 1]];
if (has('water') && rng.chance(0.4)) w.push([R.water, rng.range(0.4, 1)]);
const heat = Math.min(r.minT + 8, r.maxT - 5, 66);
return { ingredients: parts(w), heatTo: heat, coolTo: room, serveTemp: room, crush: true, hold: 20 };
}
case 'fizzy': {
if (!has('fizz') || !has('essenceB')) return null;
const w = [[R.fizz, 1], [R.essenceB, rng.range(1.5, 2.5)]];
if (has('water') && rng.chance(0.5)) w.push([R.water, rng.range(0.5, 1.5)]);
return { ingredients: parts(w), heatTo: room, coolTo: room, serveTemp: room, hold: 8 };
}
case 'frost': {
if (!has('frost') || !has('essenceC')) return null;
const w = [[R.frost, 1], [R.essenceC, rng.range(0.9, 1.4)]];
return { ingredients: parts(w), heatTo: room, coolTo: Math.max(ctx.cap.minCool, -10), serveTemp: Math.round(rng.range(0, 8)), hold: 15 };
}
case 'heavy': {
if (!has('metal')) return null;
const w = [[R.metal, 3]];
let crush = false;
if (has('crystal') && ctx.cap.has('pestle') && rng.chance(0.6)) { w.push([R.crystal, 1]); crush = true; }
return { ingredients: parts(w), heatTo: room, coolTo: room, serveTemp: room, crush, knead: crush, hold: crush ? 30 : 5 };
}
case 'lumen': {
if (!has('spores') || !has('starlight')) return null;
const r = rx('r_lumen');
const w = [[R.spores, 1], [R.starlight, rng.range(1.2, 1.8)]];
const heat = Math.min(r.minT + 10, r.maxT - 5);
return { ingredients: parts(w), heatTo: heat, coolTo: room, serveTemp: room, knead: true, hold: 15 };
}
case 'varnish': {
if (!has('resin') || !has('oil')) return null;
const r = rx('r_varnish');
if (r.minT + 20 > ctx.cap.maxFlame - 40) return null;
const w = [[R.resin, 1], [R.oil, rng.range(1, 1.4)]];
return { ingredients: parts(w), heatTo: r.minT + 20, coolTo: room, serveTemp: Math.round(rng.range(40, 70)), hold: 20 };
}
case 'panacea': {
if (!['essenceA', 'salt', 'spirit', 'crystal'].every(has) || !ctx.cap.has('pestle')) return null;
const e = rx('r_elixir'), a = rx('r_arcane'), pa = rx('r_panacea');
const heat = Math.min(a.maxT - 5, pa.maxT - 5, Math.max(e.minT + 5, a.minT + 5, pa.minT + 5));
if (heat < e.minT) return null;
const w = [[R.essenceA, 2], [R.salt, 1], [R.spirit, 3], [R.crystal, 1]];
return { ingredients: parts(w), heatTo: heat, coolTo: room, serveTemp: Math.round(rng.range(30, 50)), crush: true, hold: 30 };
}
case 'phoenix': {
if (!has('phoenix') || !has('water')) return null;
const w = [[R.phoenix, 1], [R.water, rng.range(2.5, 3.5)]];
return { ingredients: parts(w), heatTo: 60, coolTo: room, serveTemp: Math.round(rng.range(40, 60)), hold: 10 };
}
}
return null;
}
const ASPECT_KEYS = ['vitality', 'ardor', 'arcana', 'fortitude'];
const STYLE_PROPS = {
tonic: ['color'], warm: ['color', 'temperature'], syrup: ['viscosity', 'density'], salve: ['viscosity'],
elixir: ['vitality'], ardent: ['ardor'], arcane: ['arcana'], fizzy: ['volatility'], frost: ['temperature', 'fortitude'],
heavy: ['density'], lumen: ['arcana'], varnish: ['fortitude', 'viscosity'], panacea: ['vitality', 'arcana'], phoenix: ['vitality', 'ardor'],
};
function makeRequirement(key, pred, tier, strict, rng, plan, style) {
const s = strict;
switch (key) {
case 'color': {
const tol = Math.max(5, (13 - 1.8 * tier) * s);
return { key, kind: 'target', target: pred.lab, rgb: pred.color, tol, zero: tol * 3.2, label: describeColor(pred.color) };
}
case 'density': {
let tol = Math.max(0.025, (0.075 - 0.01 * tier) * s);
if (pred.looseSolids > 0.04) tol = Math.max(tol, 0.05 + 0.5 * pred.looseSolids);
tol = Math.round(tol * 100) / 100;
const t = Math.round((pred.density + rng.range(-0.3, 0.3) * tol) * 100) / 100;
return { key, kind: 'target', target: t, tol, zero: tol * 3, label: `${(t - tol).toFixed(2)}–${(t + tol).toFixed(2)} g/ml` };
}
case 'viscosity': {
if (pred.granular > 0.02 && style !== 'salve') return null;
const f = Math.max(1.6, (3.2 - 0.3 * tier) * s);
const steep = 1 + Math.max(0, (Math.log(pred.viscosity) - Math.log(3000)) / 2.5);
const tol = Math.log(f) * steep;
const t = Math.log(pred.viscosity) + rng.range(-0.3, 0.3) * tol;
return { key, kind: 'target', target: t, tol, zero: tol * 3, label: viscosityClass(Math.exp(t)) };
}
case 'temperature': {
const tol = Math.max(5, (12 - 1.5 * tier) * s);
const t = Math.round(plan.serveTemp ?? 20);
return { key, kind: 'target', target: t, tol, zero: tol * 3, label: `${Math.round(t - tol)}–${Math.round(t + tol)}°C` };
}
case 'stability': {
if (pred.looseSolids > 0.04) return null;
const min = Math.round(Math.min(85, 50 + 8 * tier) * (s < 1 ? 1.05 : 1));
return { key, kind: 'min', target: min, tol: 0, zero: 35, label: `at least ${min}` };
}
case 'volatility': {
const v = pred.volatility * 100 + (plan.ingredients.some((i) => /fizz/.test(i.id)) ? 25 : 0);
if (v > 30) {
const min = Math.round(Math.max(20, v * 0.6));
return { key, kind: 'min', target: min, tol: 0, zero: Math.max(10, min * 0.6), label: `at least ${min}` };
}
const max = Math.round(Math.max(15, v + 12));
return { key, kind: 'max', target: max, tol: 0, zero: 30, label: `at most ${max}` };
}
default: {
const k = ASPECT_KEYS.indexOf(key);
if (k < 0) return null;
const v = pred.aspects[k];
if (v < 6) return null;
const min = Math.max(5, Math.round(v * (0.62 + 0.04 * tier)));
return { key, kind: 'min', target: min, tol: 0, zero: Math.max(8, min * 0.6), label: `at least ${min}` };
}
}
}
function stylesFor(arch, tier, event) {
let styles = arch.styles.filter((s) => STYLE_TIER[s] <= tier);
if (event === 'winter') styles = styles.concat(['warm', 'ardent']).filter((s) => STYLE_TIER[s] <= tier);
if (event === 'plague') styles = styles.concat(['elixir', 'salve']).filter((s) => STYLE_TIER[s] <= tier);
if (event === 'conclave') styles = styles.concat(['arcane', 'lumen']).filter((s) => STYLE_TIER[s] <= tier);
if (event === 'festival') styles = styles.concat(['tonic', 'fizzy']).filter((s) => STYLE_TIER[s] <= tier);
if (!styles.length) styles = ['tonic'];
return styles;
}
function generateCommission(ctx, rng, opts = {}) {
const tier = Math.max(0, Math.min(4, opts.tier ?? Math.min(4, ctx.rank)));
const archetypes = ARCHETYPES.filter((a) => a.minRank <= ctx.rank);
for (let attempt = 0; attempt < 40; attempt++) {
const arch = opts.archetype ? archetypeOf(opts.archetype) : rng.pick(archetypes);
const styles = opts.style ? [opts.style] : stylesFor(arch, tier, ctx.event);
const style = rng.pick(styles);
const bottleMl = [100, 150, 200, 250, 300][tier] * (opts.contract ? 1.5 : 1);
const bottleN = Math.round(bottleMl / SIM.ML_PER_PARTICLE);
const totalN = Math.min(Math.round(bottleN * rng.range(1.7, 2.3)), Math.floor(ctx.cap.size === 'small' ? 900 : 1300));
const plan = buildPlan(style, ctx, rng, totalN);
if (!plan) continue;
if (plan.coolTo < ctx.cap.minCool - 2 && style !== 'frost') continue;
const pred = { ...predictPlan(ctx.world, ctx.lookup, plan), looseSolids: 0 };
let bound = 0;
for (const [id, f] of Object.entries(pred.composition)) {
const d = ctx.lookup(id);
if (d && (d.form === 'powder' || d.form === 'solid') && (d.binder || 0) >= 0.3) bound += f;
}
pred.looseSolids = Math.max(0, pred.granular - bound);
const want = new Set(STYLE_PROPS[style] || ['color']);
if (style !== 'salve' && style !== 'heavy' && style !== 'varnish') want.add('color');
const nReq = [2, 3, 3, 4, 4][tier] + (opts.contract ? 1 : 0);
const extras = arch.props.filter((p) => !want.has(p));
const shuffled = rng.shuffle(extras);
for (const p of shuffled) {
if (want.size >= nReq) break;
if (p === 'quantity' || p === 'color') continue;
if (tier === 0 && (p === 'stability' || p === 'volatility' || ASPECT_KEYS.includes(p))) continue;
want.add(p);
}
if (tier >= 1 && want.size < nReq && !want.has('stability')) want.add('stability');
const reqs = [];
const strict = arch.strict * (opts.contract ? 0.8 : 1);
for (const key of want) {
if (key === 'temperature' && Math.abs((plan.serveTemp ?? 20) - 20) < 6 && style !== 'warm' && style !== 'frost') continue;
const r = makeRequirement(key, pred, tier, strict, rng, plan, style);
if (r) reqs.push(r);
}
if (reqs.length < 1) continue;
const customer = makeCustomer(rng, arch);
const cost = planCost(plan, ctx.priceOf) * (bottleN / pred.totalParticles) * 1.6;
const eventBonus = ctx.event && styles.includes(style) && ['winter', 'plague', 'conclave', 'festival'].includes(ctx.event) ? 1.25 : 1;
const budget = Math.round((14 + cost * (2.6 + 0.45 * tier) + 9 * tier + reqs.length * 5) * arch.budget * eventBonus * (opts.contract ? 2.2 : 1));
const colorWord = pred.color ? describeColor(pred.color) : '';
const potionName = `${style === 'salve' || style === 'heavy' ? '' : capitalize(colorWord) + ' '}${STYLE_NOUN[style]}`.trim();
const greet = rng.pick(arch.greet).replace('{potion}', aOrAn(potionName.toLowerCase()) + ' ' + potionName.toLowerCase());
return {
id: 'q' + Math.floor(rng.next() * 1e9).toString(36),
tier,
style,
contract: !!opts.contract,
potionName,
customer,
dialogue: greet,
requirements: reqs,
bottleMl,
bottleN,
budget: Math.max(12, budget),
reference: plan,
predicted: { density: pred.density, viscosity: pred.viscosity, aspects: pred.aspects, color: pred.color, reactions: pred.reactions },
hintCost: Math.max(3, Math.round(budget * 0.12)),
};
}
return null;
}
function tutorialCommission(ctx, rng) {
const R = ctx.world.roles;
const plan = { ingredients: [{ id: R.water, n: 30 }, { id: R.essenceA, n: 14 }], heatTo: 45, coolTo: 20, serveTemp: 45 };
const pred = predictPlan(ctx.world, ctx.lookup, plan);
const arch = archetypeOf('farmer');
const customer = makeCustomer(rng, arch);
customer.name = 'Old Mabry Hollins';
const colorWord = describeColor(pred.color);
return {
id: 'q-tutorial',
tier: 0,
style: 'warm',
contract: false,
tutorial: true,
potionName: `${capitalize(colorWord)} Tonic`,
customer,
dialogue: `Ah, a new alchemist! My old joints ache. Could you brew me a warm ${colorWord} tonic? Just ${ctx.lookup(R.essenceA).name} thinned with ${ctx.lookup(R.water).name}, served warm.`,
requirements: [
{ key: 'color', kind: 'target', target: pred.lab, rgb: pred.color, tol: 14, zero: 44, label: colorWord },
{ key: 'temperature', kind: 'target', target: 45, tol: 12, zero: 36, label: '33–57°C' },
],
bottleMl: 100,
bottleN: 20,
budget: 30,
reference: plan,
predicted: { density: pred.density, viscosity: pred.viscosity, aspects: pred.aspects, color: pred.color, reactions: [] },
hintCost: 0,
};
}
function capitalize(s) {
return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
function aOrAn(w) {
return /^[aeiou]/i.test(w) ? 'an' : 'a';
}
return { generateCommission, tutorialCommission, STYLE_NOUN };
})();
// src/game/equipment.js
const __m19 = (() => {
const EQUIPMENT = [
{ id: 'hearth', name: 'Stone Hearth', category: 'heat', price: 0, rank: 0, icon: 'fire', desc: 'A modest wood fire under the cauldron. Flame up to ~340°C.', effect: { maxFlame: 340, heatPower: 3.5 } },
{ id: 'bellows', name: 'Bellows & Coal', category: 'heat', price: 120, rank: 1, icon: 'bellows', requires: ['hearth'], desc: 'A hotter, faster fire (up to ~520°C). Boil quickly and reach caramelising heat.', effect: { maxFlame: 520, heatPower: 5.5 } },
{ id: 'athanor', name: 'Athanor Furnace', category: 'heat', price: 700, rank: 3, icon: 'furnace', requires: ['bellows'], desc: 'The alchemist’s self-feeding furnace (up to ~800°C) with fine control.', effect: { maxFlame: 800, heatPower: 8 } },
{ id: 'basin', name: 'Cold-Water Basin', category: 'cold', price: 0, rank: 0, icon: 'basin', desc: 'Cool well water under the cauldron. Chills toward ~4°C but cannot freeze water.', effect: { minCool: 4, coolPower: 4 } },
{ id: 'frostrune', name: 'Frost Rune Plate', category: 'cold', price: 150, rank: 1, icon: 'rune', requires: ['basin'], desc: 'A carved rune that draws heat out to -30°C. Freezes liquids into solid blocks.', effect: { minCool: -30, coolPower: 6 } },
{ id: 'glacial', name: 'Glacial Sigil', category: 'cold', price: 750, rank: 3, icon: 'snow', requires: ['frostrune'], desc: 'Deep cold to -70°C, fast. Condenses even marsh vapour.', effect: { minCool: -70, coolPower: 9 } },
{ id: 'pot', name: 'Iron Pot', category: 'vessel', price: 0, rank: 0, icon: 'cauldron', desc: 'Your first cauldron (about 7 litres).', effect: { size: 'small' } },
{ id: 'copper', name: 'Copper Cauldron', category: 'vessel', price: 320, rank: 2, icon: 'cauldron2', requires: ['pot'], desc: 'A larger vessel (about 10 litres) for big orders and multi-step brews.', effect: { size: 'medium' } },
{ id: 'grand', name: 'Grand Athanor Vessel', category: 'vessel', price: 1800, rank: 4, icon: 'cauldron3', requires: ['copper'], desc: 'A huge vessel (about 13 litres) for the grandest commissions.', effect: { size: 'large' } },
{ id: 'spoon', name: 'Oak Spoon', category: 'tool', price: 0, rank: 0, icon: 'spoon', desc: 'Stirs, folds and kneads.' },
{ id: 'pestle', name: 'Granite Pestle', category: 'tool', price: 35, rank: 0, icon: 'pestle', desc: 'Crushes frozen blocks and crystal chunks into grains.' },
{ id: 'skimmer', name: 'Brass Skimmer', category: 'tool', price: 60, rank: 1, icon: 'skimmer', desc: 'Scoops matter out of the cauldron — remove a floating layer or unwanted grains.' },
{ id: 'stirrer', name: 'Clockwork Stirrer', category: 'tool', price: 110, rank: 1, icon: 'gear', desc: 'A wind-up paddle that stirs in wide circles while you do other things.' },
{ id: 'alembic', name: 'Copper Alembic', category: 'tool', price: 360, rank: 2, icon: 'alembic', desc: 'Captures vapour from under the lid into a receiver flask — distil volatile reagents and pour them back later.' },
{ id: 'homunculus', name: 'Brass Homunculus', category: 'tool', price: 1100, rank: 3, icon: 'homunculus', desc: 'A clockwork assistant that pours, stirs and heats a saved recipe for you — in the real cauldron, at full ingredient cost.' },
{ id: 'thermometer', name: 'Mercury Thermometer', category: 'instrument', price: 0, rank: 0, icon: 'thermo', desc: 'Reads temperatures anywhere in the brew.' },
{ id: 'hydrometer', name: 'Glass Hydrometer', category: 'instrument', price: 45, rank: 0, icon: 'hydro', desc: 'Measures density precisely (g/ml).' },
{ id: 'viscometer', name: 'Falling-Ball Viscometer', category: 'instrument', price: 70, rank: 1, icon: 'visco', desc: 'Measures viscosity precisely instead of by eye.' },
{ id: 'assay', name: 'Assay Kit', category: 'instrument', price: 90, rank: 1, icon: 'assay', desc: 'Measures stability and volatility precisely.' },
{ id: 'lens', name: 'Aether Lens', category: 'instrument', price: 140, rank: 1, icon: 'lens', desc: 'Reveals magical potency (vitality, ardor, arcana, fortitude) as exact numbers.' },
{ id: 'thermal', name: 'Thermal Monocle', category: 'instrument', price: 80, rank: 1, icon: 'monocle', desc: 'Shows the temperature field of the whole cauldron as a heat map.' },
{ id: 'shelf1', name: 'Oak Shelves', category: 'storage', price: 90, rank: 1, icon: 'shelf', desc: 'Store up to 2.5 L of each reagent.', effect: { storage: 2500 } },
{ id: 'shelf2', name: 'Cellar Racks', category: 'storage', price: 260, rank: 2, icon: 'shelf2', requires: ['shelf1'], desc: 'Store up to 6 L of each reagent.', effect: { storage: 6000 } },
{ id: 'charter', name: 'Guild Charter', category: 'guild', price: 400, rank: 2, icon: 'charter', desc: 'Guild membership: 15% off all reagents and access to guild contracts.', effect: { discount: 0.15 } },
];
const STARTING_EQUIPMENT = ['hearth', 'basin', 'pot', 'spoon', 'thermometer'];
const BASE_STORAGE = 1000;
function equipmentById(id) {
return EQUIPMENT.find((e) => e.id === id);
}
const RANKS = [
{ name: 'Apprentice', rep: 0 },
{ name: 'Journeyman', rep: 60 },
{ name: 'Adept', rep: 180 },
{ name: 'Expert', rep: 400 },
{ name: 'Master', rep: 800 },
{ name: 'Grand Alchemist', rep: 1500 },
];
function rankIndex(rep) {
let r = 0;
for (let i = 0; i < RANKS.length; i++) if (rep >= RANKS[i].rep) r = i;
return r;
}
function capabilities(owned) {
const has = owned instanceof Set ? owned : new Set(owned);
const cap = { maxFlame: 340, heatPower: 3.5, minCool: 4, coolPower: 4, size: 'small', storage: BASE_STORAGE, discount: 0, has: (id) => has.has(id) };
for (const e of EQUIPMENT) {
if (!has.has(e.id) || !e.effect) continue;
const f = /** @type {any} */ (e.effect);
if (f.maxFlame && f.maxFlame > cap.maxFlame) { cap.maxFlame = f.maxFlame; cap.heatPower = f.heatPower; }
if (f.minCool !== undefined && f.minCool < cap.minCool) { cap.minCool = f.minCool; cap.coolPower = f.coolPower; }
if (f.size === 'medium' && cap.size === 'small') cap.size = 'medium';
if (f.size === 'large') cap.size = 'large';
if (f.storage && f.storage > cap.storage) cap.storage = f.storage;
if (f.discount) cap.discount = Math.max(cap.discount, f.discount);
}
return cap;
}
return { EQUIPMENT, STARTING_EQUIPMENT, BASE_STORAGE, equipmentById, RANKS, rankIndex, capabilities };
})();
// src/game/state.js
const __m5 = (() => {
const { Rng, hashString } = __m6;
const { generateWorld, makeLookup } = __m7;
const { serializeMaterial, deserializeMaterial } = __m9;
const { generateCommission, tutorialCommission } = __m11;
const { EQUIPMENT, STARTING_EQUIPMENT, RANKS, rankIndex, capabilities, equipmentById } = __m19;
const { SIM } = __m17;
const SAVE_VERSION = 2;
const WORLD_GEN_VERSION = 1;
const MARKET_EVENTS = [
{ key: 'none', name: 'An ordinary day', text: 'Business as usual in the market square.' },
{ key: 'winter', name: 'Bitter Frost', text: 'A cold snap grips the valley — warming draughts pay extra.' },
{ key: 'plague', name: 'Coughing Sickness', text: 'Healers buy restoratives and salves at a premium.' },
{ key: 'conclave', name: 'Mages’ Conclave', text: 'Wizards fill the inns, hungry for arcane brews.' },
{ key: 'festival', name: 'Harvest Festival', text: 'Revellers want colourful tonics and fizzing brews.' },
{ key: 'caravan', name: 'Spice Caravan', text: 'A caravan floods the market — reagents are cheaper today.' },
{ key: 'shortage', name: 'Road Bandits', text: 'Supply wagons were raided — reagents cost more today.' },
];
const ACHIEVEMENTS = [
{ id: 'first_sale', name: 'Open for Business', desc: 'Sell your first potion.', reward: 10 },
{ id: 'perfect', name: 'Flawless', desc: 'Brew a perfect five-star potion.', reward: 25 },
{ id: 'perfect5', name: 'Master of Precision', desc: 'Brew five perfect potions.', reward: 80 },
{ id: 'dough', name: 'Kneaded It', desc: 'Knead a dough from powder and liquid.', reward: 10 },
{ id: 'frozen', name: 'Cold Hands', desc: 'Freeze a liquid solid.', reward: 15 },
{ id: 'crush', name: 'Grind Stone', desc: 'Crush a solid into grains with the pestle.', reward: 10 },
{ id: 'boil', name: 'Rolling Boil', desc: 'Boil a liquid into vapour.', reward: 10 },
{ id: 'condense', name: 'What Goes Up', desc: 'Condense vapour back into liquid.', reward: 15 },
{ id: 'fire', name: 'Singed Eyebrows', desc: 'Set something alight in the cauldron.', reward: 10 },
{ id: 'react1', name: 'Transmutation', desc: 'Discover your first reaction.', reward: 15 },
{ id: 'react5', name: 'Natural Philosopher', desc: 'Discover five reactions.', reward: 60 },
{ id: 'react10', name: 'Chymist Supreme', desc: 'Discover ten reactions.', reward: 150 },
{ id: 'served10', name: 'Regulars', desc: 'Serve ten customers.', reward: 30 },
{ id: 'served50', name: 'Talk of the Town', desc: 'Serve fifty customers.', reward: 120 },
{ id: 'rich', name: 'Gold in the Coffers', desc: 'Hold 1000 coins at once.', reward: 50 },
{ id: 'journeyman', name: 'Journeyman', desc: 'Reach the rank of Journeyman.', reward: 20 },
{ id: 'adept', name: 'Adept', desc: 'Reach the rank of Adept.', reward: 40 },
{ id: 'expert', name: 'Expert', desc: 'Reach the rank of Expert.', reward: 80 },
{ id: 'master', name: 'Master Alchemist', desc: 'Reach the rank of Master.', reward: 150 },
{ id: 'grand', name: 'Grand Alchemist', desc: 'Complete the Grand Commission.', reward: 500 },
{ id: 'recipe', name: 'Written Down', desc: 'Save a recipe to your book.', reward: 10 },
{ id: 'distil', name: 'Spirit Catcher', desc: 'Collect a distillate with the alembic.', reward: 30 },
{ id: 'layers', name: 'Oil and Water', desc: 'Observe immiscible liquids separating into layers.', reward: 10 },
];
class GameState {
constructor(data) {
/** @type {number} */ this.version = data.version;
/** @type {number} */ this.genVersion = data.genVersion;
/** @type {string} */ this.seed = data.seed;
/** @type {import('../materials/generator.js').World} */ this.world = data.world;
/** @type {number} */ this.coins = data.coins;
/** @type {number} */ this.reputation = data.reputation;
/** @type {number} */ this.day = data.day;
/** @type {number} */ this.customerIndex = data.customerIndex;
/** @type {number} */ this.customersPerDay = data.customersPerDay;
/** @type {number} */ this.servedToday = data.servedToday;
/** @type {number} */ this.dayEarnings = data.dayEarnings;
/** @type {number} */ this.daySpending = data.daySpending;
/** @type {Record<string, number>} */ this.inventory = data.inventory;
/** @type {string[]} */ this.equipment = data.equipment;
/** @type {Record<string, JournalEntry>} */ this.journal = data.journal;
/** @type {Record<string, any>} */ this.knowledge = data.knowledge;
/** @type {any[]} */ this.recipes = data.recipes;
/** @type {any[]} */ this.history = data.history;
/** @type {Record<string, number>} */ this.achievements = data.achievements;
/** @type {any} */ this.current = data.current;
this.stats = { served: 0, perfect: 0, earned: 0, spent: 0, brews: 0, declined: 0, bestQuality: 0, ...(data.stats || {}) };
/** @type {{active:boolean, step:number, done:boolean}} */ this.tutorial = { active: false, step: 0, done: true, ...(data.tutorial || {}) };
/** @type {{event:string, mods:Record<string, number>}} */ this.market = data.market || { event: 'none', mods: {} };
/** @type {any} */ this.cauldron = data.cauldron || null;
/** @type {any} */ this.receiver = data.receiver || null;
/** @type {any[]} */ this.brewLog = data.brewLog || [];
/** @type {number} */ this.reliefDay = data.reliefDay || 0;
/** @type {boolean} */ this.grandDone = !!data.grandDone;
/** @type {number} */ this.createdAt = data.createdAt || Date.now();
this.lookup = makeLookup(this.world);
}
static create(seed, opts = {}) {
const world = generateWorld(seed);
const inventory = {};
for (const id of world.starting) inventory[id] = 0;
const R = world.roles;
inventory[R.water] = Infinity;
inventory[R.essenceA] = 300;
inventory[R.essenceB] = 200;
inventory[R.oil] = 200;
inventory[R.syrup] = 200;
inventory[R.spirit] = 200;
inventory[R.binder] = 300;
inventory[R.salt] = 200;
const st = new GameState({
version: SAVE_VERSION,
genVersion: WORLD_GEN_VERSION,
seed,
world,
coins: 60,
reputation: 0,
day: 1,
customerIndex: 0,
customersPerDay: 3,
servedToday: 0,
dayEarnings: 0,
daySpending: 0,
inventory,
equipment: STARTING_EQUIPMENT.slice(),
journal: /** @type {Record<string, JournalEntry>} */ ({}),
knowledge: /** @type {Record<string, any>} */ ({}),
recipes: [],
history: [],
achievements: {},
current: null,
stats: { served: 0, perfect: 0, earned: 0, spent: 0, brews: 0, declined: 0, bestQuality: 0 },
tutorial: { active: opts.tutorial !== false, step: 0, done: opts.tutorial === false },
market: { event: 'none', mods: {} },
cauldron: null,
receiver: null,
brewLog: [],
reliefDay: 0,
grandDone: false,
createdAt: Date.now(),
});
st.rollMarket();
return st;
}
get rank() {
return rankIndex(this.reputation);
}
get rankName() {
return RANKS[this.rank].name;
}
nextRank() {
return RANKS[this.rank + 1] || null;
}
get cap() {
return capabilities(this.equipment);
}
has(id) {
return this.equipment.includes(id);
}
purchasable() {
return this.world.ingredients.filter((id) => (this.lookup(id).tier || 0) <= this.rank);
}
availableSet() {
const s = new Set(this.purchasable());
for (const [id, v] of Object.entries(this.inventory)) if (v > 0) s.add(id);
return s;
}
priceOf(id) {
const m = this.lookup(id);
if (!m) return 0;
if (id === this.world.roles.water) return 0;
const mod = this.market.mods[id] ?? 1;
const ev = this.market.event === 'caravan' ? 0.8 : this.market.event === 'shortage' ? 1.3 : 1;
return Math.max(1, Math.round(m.price * mod * ev * (1 - this.cap.discount) * 10) / 10);
}
stock(id) {
return this.inventory[id] ?? 0;
}
buy(id, ml) {
const room = this.cap.storage - this.stock(id);
const amount = Math.min(ml, room);
if (amount <= 0) return { ok: false, reason: 'Your shelves are full for that reagent.' };
const cost = Math.round((amount / 100) * this.priceOf(id) * 10) / 10;
if (cost > this.coins + 1e-9) return { ok: false, reason: 'Not enough coins.' };
this.coins = round1(this.coins - cost);
this.inventory[id] = this.stock(id) + amount;
this.stats.spent += cost;
this.daySpending += cost;
return { ok: true, amount, cost };
}
sellBack(id, ml) {
const amount = Math.min(ml, this.stock(id));
if (amount <= 0 || !isFinite(this.stock(id))) return { ok: false };
const value = Math.round((amount / 100) * this.priceOf(id) * 0.4 * 10) / 10;
this.inventory[id] -= amount;
this.coins = round1(this.coins + value);
return { ok: true, value };
}
consume(id, ml) {
const s = this.stock(id);
if (!isFinite(s)) return true;
if (s + 1e-6 < ml) return false;
this.inventory[id] = round1(s - ml);
return true;
}
buyEquipment(id) {
const e = equipmentById(id);
if (!e) return { ok: false, reason: 'Unknown item.' };
if (this.has(id)) return { ok: false, reason: 'Already owned.' };
if (e.rank > this.rank) return { ok: false, reason: `Requires the rank of ${RANKS[e.rank].name}.` };
if (e.requires && !e.requires.every((r) => this.has(r))) return { ok: false, reason: 'Requires the previous upgrade.' };
if (this.coins < e.price) return { ok: false, reason: 'Not enough coins.' };
this.coins = round1(this.coins - e.price);
this.equipment.push(id);
this.stats.spent += e.price;
this.daySpending += e.price;
return { ok: true, item: e };
}
commissionContext() {
return {
world: this.world,
lookup: this.lookup,
available: this.availableSet(),
cap: this.cap,
rank: this.rank,
priceOf: (id) => this.priceOf(id),
event: this.market.event,
};
}
nextCustomer() {
if (this.current) return this.current;
if (this.customerIndex >= this.customersPerDay) return null;
const rng = new Rng(hashString(`${this.seed}:${this.day}:${this.customerIndex}`));
let com;
if (this.tutorial.active && !this.tutorial.done && this.stats.served === 0) {
com = tutorialCommission(this.commissionContext(), rng);
} else if (this.rank >= 4 && !this.grandDone && this.customerIndex === 0 && this.day % 2 === 0) {
com = this.grandCommission(rng);
} else {
const contract = this.has('charter') && this.rank >= 2 && this.customerIndex === this.customersPerDay - 1;
const tier = Math.max(0, Math.min(4, this.rank + (rng.chance(0.25) ? -1 : 0) + (rng.chance(0.15) ? 1 : 0)));
com = generateCommission(this.commissionContext(), rng, { tier: Math.min(tier, this.rank + 1), contract });
}
this.current = com;
return com;
}
grandCommission(rng) {
const com = generateCommission(this.commissionContext(), rng, { tier: 4, style: 'panacea', archetype: 'noble', contract: true }) ||
generateCommission(this.commissionContext(), rng, { tier: 4, contract: true });
if (com) {
com.grand = true;
com.customer.name = 'Queen Isolde’s Herald';
com.dialogue = 'By royal decree: the Queen requires a masterwork. Brew it, and the guild shall name you Grand Alchemist.';
com.budget = Math.round(com.budget * 2.5);
}
return com;
}
declineCustomer() {
if (!this.current) return;
if (this.current.tutorial) return;
this.current = null;
this.customerIndex++;
this.stats.declined++;
}
completeSale(ev, measurement) {
const com = this.current;
const events = [];
if (!com) return events;
const oldRank = this.rank;
this.coins = round1(this.coins + ev.payment);
this.reputation = Math.max(0, this.reputation + ev.repDelta);
this.stats.served++;
this.stats.earned += ev.payment;
this.dayEarnings += ev.payment;
this.stats.bestQuality = Math.max(this.stats.bestQuality, ev.quality);
if (ev.perfect) this.stats.perfect++;
this.servedToday++;
this.history.unshift({
day: this.day, customer: com.customer.name, title: com.customer.title, potion: com.potionName, quality: ev.quality, stars: ev.stars,
paid: ev.payment, color: measurement?.color, ml: measurement?.ml,
});
if (this.history.length > 60) this.history.length = 60;
if (com.tutorial) { this.tutorial.done = true; this.tutorial.active = false; }
if (com.grand && ev.quality >= 0.85) { this.grandDone = true; events.push(...this.unlock('grand')); }
this.current = null;
this.customerIndex++;
events.push(...this.unlock('first_sale'));
if (ev.perfect) events.push(...this.unlock('perfect'));
if (this.stats.perfect >= 5) events.push(...this.unlock('perfect5'));
if (this.stats.served >= 10) events.push(...this.unlock('served10'));
if (this.stats.served >= 50) events.push(...this.unlock('served50'));
if (this.coins >= 1000) events.push(...this.unlock('rich'));
const nr = this.rank;
if (nr > oldRank) {
events.push({ type: 'rank', rank: nr, name: RANKS[nr].name });
const ach = ['', 'journeyman', 'adept', 'expert', 'master'][nr];
if (ach) events.push(...this.unlock(ach));
this.customersPerDay = 3 + Math.floor(nr / 2);
}
return events;
}
get dayOver() {
return !this.current && this.customerIndex >= this.customersPerDay;
}
endDay() {
const summary = { day: this.day, earned: this.dayEarnings, spent: this.daySpending, served: this.servedToday };
this.day++;
this.customerIndex = 0;
this.servedToday = 0;
this.dayEarnings = 0;
this.daySpending = 0;
this.current = null;
this.customersPerDay = 3 + Math.floor(this.rank / 2);
this.rollMarket();
return summary;
}
rollMarket() {
const rng = new Rng(hashString(`${this.seed}:market:${this.day}`));
const ev = this.day <= 2 ? MARKET_EVENTS[0] : rng.weighted(MARKET_EVENTS, [5, 1, 1, 1, 1, 1, 1]);
const mods = {};
for (const id of this.world.ingredients) mods[id] = Math.round(rng.range(0.88, 1.12) * 100) / 100;
this.market = { event: ev.key, mods };
}
get marketEvent() {
return MARKET_EVENTS.find((e) => e.key === this.market.event) || MARKET_EVENTS[0];
}
claimRelief() {
if (this.reliefDay === this.day) return 0;
const cheapest = Math.min(...this.purchasable().filter((id) => id !== this.world.roles.water).map((id) => this.priceOf(id)));
if (this.coins >= cheapest * 2) return 0;
this.reliefDay = this.day;
const grant = 25;
this.coins = round1(this.coins + grant);
return grant;
}
discover(e) {
if (this.journal[e.key]) return null;
const entry = { ...e, day: this.day };
this.journal[e.key] = entry;
this.reputation += 1;
return entry;
}
learn(id, fact, value) {
const k = (this.knowledge[id] ||= {});
if (k[fact] !== undefined) return false;
k[fact] = value;
return true;
}
reactionsDiscovered() {
return Object.values(this.journal).filter((e) => e.kind === 'reaction').length;
}
unlock(id) {
if (this.achievements[id]) return [];
const a = ACHIEVEMENTS.find((x) => x.id === id);
if (!a) return [];
this.achievements[id] = Date.now();
this.coins = round1(this.coins + a.reward);
return [{ type: 'achievement', id, name: a.name, desc: a.desc, reward: a.reward }];
}
addRecipe(recipe) {
this.recipes.unshift({ ...recipe, id: 'r' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36) });
return this.unlock('recipe');
}
toJSON() {
return {
version: SAVE_VERSION,
genVersion: this.genVersion,
seed: this.seed,
world: {
seed: this.world.seed,
materials: this.world.materials.map(serializeMaterial),
ingredients: this.world.ingredients,
starting: this.world.starting,
reactions: this.world.reactions,
roles: this.world.roles,
},
coins: this.coins,
reputation: this.reputation,
day: this.day,
customerIndex: this.customerIndex,
customersPerDay: this.customersPerDay,
servedToday: this.servedToday,
dayEarnings: this.dayEarnings,
daySpending: this.daySpending,
inventory: Object.fromEntries(Object.entries(this.inventory).map(([k, v]) => [k, isFinite(v) ? v : 'inf'])),
equipment: this.equipment,
journal: this.journal,
knowledge: this.knowledge,
recipes: this.recipes,
history: this.history,
achievements: this.achievements,
current: this.current,
stats: this.stats,
tutorial: this.tutorial,
market: this.market,
cauldron: this.cauldron,
receiver: this.receiver,
brewLog: this.brewLog,
reliefDay: this.reliefDay,
grandDone: this.grandDone,
createdAt: this.createdAt,
savedAt: Date.now(),
};
}
static fromJSON(raw) {
const data = migrate(raw);
const world = {
...data.world,
materials: data.world.materials.map(deserializeMaterial),
};
const inventory = Object.fromEntries(Object.entries(data.inventory).map(([k, v]) => [k, v === 'inf' ? Infinity : Number(v)]));
return new GameState({ ...data, world, inventory });
}
}
function migrate(raw) {
if (!raw || typeof raw !== 'object') throw new Error('Not a save file');
const d = { ...raw };
if (!d.version) throw new Error('Missing save version');
if (d.version > SAVE_VERSION) throw new Error('This save comes from a newer version of the game');
if (d.version < 2) {
d.market = d.market || { event: 'none', mods: {} };
d.receiver = d.receiver || null;
d.grandDone = !!d.grandDone;
d.reliefDay = d.reliefDay || 0;
d.knowledge = d.knowledge || {};
d.version = 2;
}
if (!d.world || !Array.isArray(d.world.materials)) {
const w = generateWorld(d.seed);
d.world = { ...w, materials: w.materials.map(serializeMaterial) };
}
for (const k of ['journal', 'achievements', 'stats', 'tutorial']) d[k] = d[k] || {};
d.recipes = d.recipes || [];
d.history = d.history || [];
d.brewLog = d.brewLog || [];
d.equipment = d.equipment && d.equipment.length ? d.equipment : STARTING_EQUIPMENT.slice();
return d;
}
function round1(v) {
return Math.round(v * 10) / 10;
}
return { SAVE_VERSION, WORLD_GEN_VERSION, MARKET_EVENTS, ACHIEVEMENTS, GameState, migrate, EQUIPMENT, SIM };
})();
// src/game/persistence.js
const __m20 = (() => {
const { GameState } = __m5;
const KEYS = {
save: 'alchemist-shop.save',
backup: 'alchemist-shop.save.backup',
settings: 'alchemist-shop.settings',
sandbox: 'alchemist-shop.sandbox',
};
function store() {
try {
const s = globalThis.localStorage;
const k = '__t';
s.setItem(k, '1');
s.removeItem(k);
return s;
} catch {
return null;
}
}
function storageAvailable() {
return !!store();
}
function saveGame(state) {
const s = store();
if (!s) return false;
try {
const json = JSON.stringify(state.toJSON());
const prev = s.getItem(KEYS.save);
if (prev) {
try {
JSON.parse(prev); // only keep a valid previous save as backup
s.setItem(KEYS.backup, prev);
} catch {
}
}
s.setItem(KEYS.save, json);
return true;
} catch (e) {
try {
const data = state.toJSON();
data.cauldron = null;
s.setItem(KEYS.save, JSON.stringify(data));
return true;
} catch {
return false;
}
}
}
function loadGame() {
const s = store();
if (!s) return { state: null, error: 'Local storage is unavailable in this browser mode.' };
const raw = s.getItem(KEYS.save);
if (!raw) return { state: null, error: null };
try {
return { state: GameState.fromJSON(JSON.parse(raw)), error: null };
} catch (e) {
const bak = s.getItem(KEYS.backup);
if (bak) {
try {
return { state: GameState.fromJSON(JSON.parse(bak)), error: 'Your save was damaged; the previous autosave was restored.', recovered: true };
} catch {
}
}
return { state: null, error: 'Your save could not be read (' + (e && e.message ? e.message : 'unknown error') + ').' };
}
}
function hasSave() {
const s = store();
return !!(s && s.getItem(KEYS.save));
}
function deleteSave() {
const s = store();
if (!s) return;
s.removeItem(KEYS.save);
s.removeItem(KEYS.backup);
}
function exportSave(state) {
const json = JSON.stringify(state.toJSON(), null, 0);
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `alchemists-shop-${state.seed}-day${state.day}.json`;
document.body.appendChild(a);
a.click();
a.remove();
setTimeout(() => URL.revokeObjectURL(url), 2000);
}
function parseImport(text) {
let raw;
try {
raw = JSON.parse(text);
} catch {
throw new Error('That file is not a valid save (not JSON).');
}
return GameState.fromJSON(raw);
}
function loadJSON(key, fallback) {
const s = store();
if (!s) return fallback;
try {
const v = s.getItem(key);
return v ? { ...fallback, ...JSON.parse(v) } : fallback;
} catch {
return fallback;
}
}
function saveJSON(key, value) {
const s = store();
if (!s) return false;
try {
s.setItem(key, JSON.stringify(value));
return true;
} catch {
return false;
}
}
function removeKey(key) {
const s = store();
if (s) s.removeItem(key);
}
return { KEYS, storageAvailable, saveGame, loadGame, hasSave, deleteSave, exportSave, parseImport, loadJSON, saveJSON, removeKey };
})();
// src/simulation/particles.js
const __m23 = (() => {
const { MAX_SPECIES } = __m13;
const { PHASE } = __m17;
const STATE_FIELDS_F32 = ['x', 'y', 'vx', 'vy', 'temp', 'lat', 'eph', 'restX', 'restY', 'agit', 'burn', 'wet'];
const STATE_FIELDS_I32 = ['group'];
const STATE_FIELDS_U8 = ['phase'];
const STATE_FIELDS_U32 = ['seed'];
const DERIVED_FIELDS = [
'rho20', 'rho', 'invMass', 'rhoCp', 'kappa', 'lnMu20', 'viscT', 'lnMu', 'gran', 'binder',
'tm', 'tb', 'volFrac', 'latF', 'latV', 'beta', 'cA', 'cB', 'colL', 'colA', 'colB',
'opacity', 'flam', 'ign', 'combHeat', 'gasRho', 'glow', 'friction', 'hardness', 'yieldV',
];
class Particles {
constructor(capacity) {
this.capacity = capacity;
this.count = 0;
this.S = MAX_SPECIES;
this.x = new Float32Array(capacity);
this.y = new Float32Array(capacity);
this.px = new Float32Array(capacity);
this.py = new Float32Array(capacity);
this.vx = new Float32Array(capacity);
this.vy = new Float32Array(capacity);
this.temp = new Float32Array(capacity);
this.lat = new Float32Array(capacity);
this.eph = new Float32Array(capacity);
this.restX = new Float32Array(capacity);
this.restY = new Float32Array(capacity);
this.agit = new Float32Array(capacity);
this.burn = new Float32Array(capacity);
this.wet = new Float32Array(capacity);
this.group = new Int32Array(capacity).fill(-1);
this.phase = new Uint8Array(capacity);
this.seed = new Uint32Array(capacity);
this.sleep = new Uint16Array(capacity);
this.dirty = new Uint8Array(capacity);
this.comp = new Float32Array(capacity * MAX_SPECIES);
this.rho20 = new Float32Array(capacity);
this.rho = new Float32Array(capacity);
this.invMass = new Float32Array(capacity);
this.rhoCp = new Float32Array(capacity);
this.kappa = new Float32Array(capacity);
this.lnMu20 = new Float32Array(capacity);
this.viscT = new Float32Array(capacity);
this.lnMu = new Float32Array(capacity);
this.gran = new Float32Array(capacity);
this.binder = new Float32Array(capacity);
this.tm = new Float32Array(capacity);
this.tb = new Float32Array(capacity);
this.volFrac = new Float32Array(capacity);
this.latF = new Float32Array(capacity);
this.latV = new Float32Array(capacity);
this.beta = new Float32Array(capacity);
this.cA = new Float32Array(capacity);
this.cB = new Float32Array(capacity);
this.colL = new Float32Array(capacity);
this.colA = new Float32Array(capacity);
this.colB = new Float32Array(capacity);
this.opacity = new Float32Array(capacity);
this.flam = new Float32Array(capacity);
this.ign = new Float32Array(capacity);
this.combHeat = new Float32Array(capacity);
this.gasRho = new Float32Array(capacity);
this.glow = new Float32Array(capacity);
this.friction = new Float32Array(capacity);
this.hardness = new Float32Array(capacity);
this.yieldV = new Float32Array(capacity);
this._seedCounter = 1;
}
add(x, y, phase, temp) {
if (this.count >= this.capacity) return -1;
const i = this.count++;
this.x[i] = x; this.y[i] = y; this.px[i] = x; this.py[i] = y;
this.vx[i] = 0; this.vy[i] = 0;
this.temp[i] = temp;
this.lat[i] = 0; this.eph[i] = 0;
this.restX[i] = 0; this.restY[i] = 0;
this.agit[i] = 0; this.burn[i] = 0; this.wet[i] = 0;
this.group[i] = -1;
this.phase[i] = phase;
this.seed[i] = (Math.imul(this._seedCounter++, 2654435761) >>> 0) || 1;
this.sleep[i] = 0;
this.dirty[i] = 1;
this.comp.fill(0, i * this.S, (i + 1) * this.S);
return i;
}
copy(dst, src) {
const self = /** @type {any} */ (this);
for (const f of ['x', 'y', 'px', 'py', 'vx', 'vy', 'temp', 'lat', 'eph', 'restX', 'restY', 'agit', 'burn', 'wet', 'group', 'phase', 'seed', 'sleep', 'dirty']) {
self[f][dst] = self[f][src];
}
for (const f of DERIVED_FIELDS) self[f][dst] = self[f][src];
this.comp.copyWithin(dst * this.S, src * this.S, (src + 1) * this.S);
}
remove(i) {
const last = this.count - 1;
if (i !== last) this.copy(i, last);
this.count--;
}
isCondensed(i) {
return this.phase[i] !== PHASE.GAS;
}
}
return { STATE_FIELDS_F32, STATE_FIELDS_I32, STATE_FIELDS_U8, STATE_FIELDS_U32, DERIVED_FIELDS, Particles };
})();
// src/simulation/grid.js
const __m24 = (() => {
class NeighborGrid {
constructor(minX, minY, maxX, maxY, cell, capacity) {
this.minX = minX;
this.minY = minY;
this.cell = cell;
this.inv = 1 / cell;
this.cols = Math.ceil((maxX - minX) / cell) + 1;
this.rows = Math.ceil((maxY - minY) / cell) + 1;
const nCells = this.cols * this.rows;
this.cellStart = new Int32Array(nCells + 1);
this.cellOf = new Int32Array(capacity);
this.sorted = new Int32Array(capacity);
this.pairCap = capacity * 16;
this.pairI = new Int32Array(this.pairCap);
this.pairJ = new Int32Array(this.pairCap);
this.pairCount = 0;
}
build(xs, ys, n) {
const { cols, rows, inv, minX, minY, cellStart, cellOf, sorted } = this;
cellStart.fill(0);
for (let i = 0; i < n; i++) {
let cx = ((xs[i] - minX) * inv) | 0;
let cy = ((ys[i] - minY) * inv) | 0;
if (cx < 0) cx = 0; else if (cx >= cols) cx = cols - 1;
if (cy < 0) cy = 0; else if (cy >= rows) cy = rows - 1;
const c = cy * cols + cx;
cellOf[i] = c;
cellStart[c + 1]++;
}
const nCells = cols * rows;
for (let c = 0; c < nCells; c++) cellStart[c + 1] += cellStart[c];
const cursor = this._cursor && this._cursor.length === nCells ? this._cursor : (this._cursor = new Int32Array(nCells));
cursor.set(cellStart.subarray(0, nCells));
for (let i = 0; i < n; i++) sorted[cursor[cellOf[i]]++] = i;
}
buildPairs(xs, ys, n, r) {
this.build(xs, ys, n);
const r2 = r * r;
const { cols, rows, cellStart, sorted } = this;
let pc = 0;
let pairI = this.pairI, pairJ = this.pairJ;
for (let cy = 0; cy < rows; cy++) {
for (let cx = 0; cx < cols; cx++) {
const c = cy * cols + cx;
const s0 = cellStart[c], s1 = cellStart[c + 1];
if (s0 === s1) continue;
for (let a = s0; a < s1; a++) {
const i = sorted[a];
const xi = xs[i], yi = ys[i];
for (let b = a + 1; b < s1; b++) {
const j = sorted[b];
const dx = xs[j] - xi, dy = ys[j] - yi;
if (dx * dx + dy * dy < r2) {
if (pc >= this.pairCap) { this._grow(); pairI = this.pairI; pairJ = this.pairJ; }
pairI[pc] = i; pairJ[pc] = j; pc++;
}
}
for (let k = 0; k < 4; k++) {
const nx = cx + (k === 0 ? 1 : k === 1 ? -1 : k === 2 ? 0 : 1);
const ny = cy + (k === 0 ? 0 : 1);
if (nx < 0 || nx >= cols || ny >= rows) continue;
const nc = ny * cols + nx;
const t0 = cellStart[nc], t1 = cellStart[nc + 1];
for (let b = t0; b < t1; b++) {
const j = sorted[b];
const dx = xs[j] - xi, dy = ys[j] - yi;
if (dx * dx + dy * dy < r2) {
if (pc >= this.pairCap) { this._grow(); pairI = this.pairI; pairJ = this.pairJ; }
pairI[pc] = i; pairJ[pc] = j; pc++;
}
}
}
}
}
}
this.pairCount = pc;
return pc;
}
_grow() {
const cap = this.pairCap * 2;
const ni = new Int32Array(cap), nj = new Int32Array(cap);
ni.set(this.pairI); nj.set(this.pairJ);
this.pairI = ni; this.pairJ = nj; this.pairCap = cap;
}
query(x, y, r, fn) {
const { cols, rows, inv, minX, minY, cellStart, sorted } = this;
const x0 = Math.max(0, ((x - r - minX) * inv) | 0), x1 = Math.min(cols - 1, ((x + r - minX) * inv) | 0);
const y0 = Math.max(0, ((y - r - minY) * inv) | 0), y1 = Math.min(rows - 1, ((y + r - minY) * inv) | 0);
for (let cy = y0; cy <= y1; cy++) {
for (let cx = x0; cx <= x1; cx++) {
const c = cy * cols + cx;
for (let a = cellStart[c]; a < cellStart[c + 1]; a++) fn(sorted[a]);
}
}
}
}
return { NeighborGrid };
})();
// src/simulation/cauldron.js
const __m25 = (() => {
const { SIM } = __m17;
const CAULDRON_SIZES = {
small: { key: 'small', label: 'Iron Pot', mouth: 1.7, belly: 2.15, neck: 1.1, depth: 3.2, capacity: 1400 },
medium: { key: 'medium', label: 'Copper Cauldron', mouth: 1.95, belly: 2.5, neck: 1.25, depth: 3.6, capacity: 2000 },
large: { key: 'large', label: 'Grand Athanor', mouth: 2.2, belly: 2.85, neck: 1.35, depth: 4.0, capacity: 2700 },
};
const COLUMN = 1.5;
const RES = 0.02;
const INF = 1e20;
function edt1d(f, n, d, v, z) {
let k = 0;
v[0] = 0;
z[0] = -INF;
z[1] = INF;
for (let q = 1; q < n; q++) {
let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
while (s <= z[k]) {
k--;
s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
}
k++;
v[k] = q;
z[k] = s;
z[k + 1] = INF;
}
k = 0;
for (let q = 0; q < n; q++) {
while (z[k + 1] < q) k++;
const dq = q - v[k];
d[q] = dq * dq + f[v[k]];
}
}
function edt2d(mask, w, h, target) {
const g = new Float64Array(w * h);
for (let i = 0; i < w * h; i++) g[i] = mask[i] === target ? 0 : INF;
const n = Math.max(w, h);
const f = new Float64Array(n), d = new Float64Array(n), z = new Float64Array(n + 1);
const v = new Int32Array(n);
for (let x = 0; x < w; x++) {
for (let y = 0; y < h; y++) f[y] = g[y * w + x];
edt1d(f, h, d, v, z);
for (let y = 0; y < h; y++) g[y * w + x] = d[y];
}
for (let y = 0; y < h; y++) {
for (let x = 0; x < w; x++) f[x] = g[y * w + x];
edt1d(f, w, d, v, z);
for (let x = 0; x < w; x++) g[y * w + x] = Math.sqrt(d[x]);
}
return g;
}
class Cauldron {
constructor(sizeKey = 'small') {
const spec = CAULDRON_SIZES[sizeKey] || CAULDRON_SIZES.small;
this.spec = spec;
this.mouth = spec.mouth;
this.belly = spec.belly;
this.neck = spec.neck;
this.depth = spec.depth;
this.capacity = spec.capacity;
this.lidClosed = true;
this.lidY = 0;
this.minX = -spec.belly - 0.5;
this.maxX = spec.belly + 0.5;
this.minY = -COLUMN - 0.4;
this.maxY = spec.depth + 0.5;
this._buildSdf();
this._buildWall();
}
halfWidth(y) {
if (y < 0) return y >= -COLUMN ? this.mouth : 0;
if (y > this.depth) return 0;
if (y <= this.neck) {
return this.mouth + (this.belly - this.mouth) * Math.sin((Math.PI / 2) * (y / this.neck));
}
const t = (y - this.neck) / (this.depth - this.neck);
const p = 2.8;
return this.belly * Math.pow(Math.max(0, 1 - Math.pow(t, p)), 1 / p);
}
_buildSdf() {
const w = Math.ceil((this.maxX - this.minX) / RES) + 1;
const h = Math.ceil((this.maxY - this.minY) / RES) + 1;
this.gw = w;
this.gh = h;
const mask = new Uint8Array(w * h);
for (let gy = 0; gy < h; gy++) {
const y = this.minY + gy * RES;
const hw = this.halfWidth(y);
for (let gx = 0; gx < w; gx++) {
const x = this.minX + gx * RES;
mask[gy * w + gx] = Math.abs(x) < hw ? 1 : 0;
}
}
const dOut = edt2d(mask, w, h, 1); // for outside cells: distance to inside
const dIn = edt2d(mask, w, h, 0); // for inside cells: distance to outside
const sdf = new Float32Array(w * h);
for (let i = 0; i < w * h; i++) {
sdf[i] = mask[i] ? -(dIn[i] - 0.5) * RES : (dOut[i] - 0.5) * RES;
}
this.sdfGrid = sdf;
const gx = new Float32Array(w * h), gy = new Float32Array(w * h);
for (let y = 1; y < h - 1; y++) {
for (let x = 1; x < w - 1; x++) {
const i = y * w + x;
let ax = sdf[i + 1] - sdf[i - 1];
let ay = sdf[i + w] - sdf[i - w];
const l = Math.hypot(ax, ay) || 1;
gx[i] = ax / l;
gy[i] = ay / l;
}
}
this.gradX = gx;
this.gradY = gy;
this._sx = 0; this._sy = 0;
}
sample(x, y) {
const fx = (x - this.minX) / RES, fy = (y - this.minY) / RES;
let ix = fx | 0, iy = fy | 0;
if (ix < 0 || iy < 0 || ix >= this.gw - 1 || iy >= this.gh - 1) {
this.nx = 0; this.ny = 0;
return 1;
}
const tx = fx - ix, ty = fy - iy;
const w = this.gw;
const i = iy * w + ix;
const s = this.sdfGrid, gx = this.gradX, gy = this.gradY;
const a = 1 - tx, b = 1 - ty;
const d = (s[i] * a + s[i + 1] * tx) * b + (s[i + w] * a + s[i + w + 1] * tx) * ty;
let nx = (gx[i] * a + gx[i + 1] * tx) * b + (gx[i + w] * a + gx[i + w + 1] * tx) * ty;
let ny = (gy[i] * a + gy[i + 1] * tx) * b + (gy[i + w] * a + gy[i + w + 1] * tx) * ty;
const l = Math.hypot(nx, ny) || 1;
this.nx = nx / l;
this.ny = ny / l;
return d;
}
roughDist(x, y) {
const ix = ((x - this.minX) / RES) | 0, iy = ((y - this.minY) / RES) | 0;
if (ix < 0 || iy < 0 || ix >= this.gw || iy >= this.gh) return 1;
return this.sdfGrid[iy * this.gw + ix];
}
inside(x, y) {
return y >= 0 && y <= this.depth && Math.abs(x) < this.halfWidth(y);
}
_buildWall() {
const N = 300;
const pts = [];
for (let k = 0; k <= N; k++) {
const y = (k / N) * this.depth;
pts.push([-this.halfWidth(y), y]);
}
for (let k = N; k >= 0; k--) {
const y = (k / N) * this.depth;
pts.push([this.halfWidth(y), y]);
}
const arc = [0];
for (let k = 1; k < pts.length; k++) arc.push(arc[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
const total = arc[arc.length - 1];
const M = 52;
this.wallCount = M;
this.lidCells = 8;
const nCells = M + this.lidCells;
this.cellX = new Float32Array(nCells);
this.cellY = new Float32Array(nCells);
this.cellT = new Float32Array(nCells).fill(SIM.AMBIENT);
this.cellC = new Float32Array(nCells);
this.cellFurnace = new Float32Array(nCells);
let k = 0;
for (let c = 0; c < M; c++) {
const target = ((c + 0.5) / M) * total;
while (k < arc.length - 2 && arc[k + 1] < target) k++;
const t = (target - arc[k]) / Math.max(1e-9, arc[k + 1] - arc[k]);
const x = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * t;
const y = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * t;
this.cellX[c] = x;
this.cellY[c] = y;
this.cellC[c] = 26;
const bottomness = Math.max(0, Math.min(1, (y - (this.depth - 1.5)) / 1.2));
this.cellFurnace[c] = bottomness * Math.exp(-Math.pow(x / (this.belly * 0.75), 2));
}
for (let c = 0; c < this.lidCells; c++) {
const idx = M + c;
this.cellX[idx] = -this.mouth + ((c + 0.5) / this.lidCells) * 2 * this.mouth;
this.cellY[idx] = 0;
this.cellC[idx] = 14;
this.cellFurnace[idx] = 0;
}
const step = 0.04;
this.lw = Math.ceil((this.maxX - this.minX) / step) + 1;
this.lh = Math.ceil((this.depth + 0.3) / step) + 1;
this.lstep = step;
this.lookup = new Int16Array(this.lw * this.lh).fill(-1);
for (let gy = 0; gy < this.lh; gy++) {
const y = gy * step;
for (let gx = 0; gx < this.lw; gx++) {
const x = this.minX + gx * step;
const d = this.sample(x, y);
if (d < -0.35 || d > 0.2) continue;
let best = -1, bd = 1e9;
for (let c = 0; c < M; c++) {
const dd = (this.cellX[c] - x) ** 2 + (this.cellY[c] - y) ** 2;
if (dd < bd) { bd = dd; best = c; }
}
this.lookup[gy * this.lw + gx] = best;
}
}
}
wallCellAt(x, y) {
const gx = Math.round((x - this.minX) / this.lstep);
const gy = Math.round(y / this.lstep);
if (gx < 0 || gy < 0 || gx >= this.lw || gy >= this.lh) return -1;
return this.lookup[gy * this.lw + gx];
}
lidCellAt(x) {
const t = (x + this.mouth) / (2 * this.mouth);
const c = Math.max(0, Math.min(this.lidCells - 1, Math.floor(t * this.lidCells)));
return this.wallCount + c;
}
bottomTemperature() {
let s = 0, w = 0;
for (let c = 0; c < this.wallCount; c++) {
s += this.cellT[c] * this.cellFurnace[c];
w += this.cellFurnace[c];
}
return w > 0 ? s / w : SIM.AMBIENT;
}
lidTemperature() {
let s = 0;
for (let c = 0; c < this.lidCells; c++) s += this.cellT[this.wallCount + c];
return s / this.lidCells;
}
}
return { CAULDRON_SIZES, COLUMN, Cauldron };
})();
// src/simulation/derived.js
const __m26 = (() => {
const { MAX_SPECIES, NO_BOIL } = __m13;
const { granularFraction, suspensionLnMult } = __m14;
const { rgbToOklab, linearToSrgb } = __m8;
const { PHASE } = __m17;
const GAS_MASS = 0.05;
function refreshParticle(sim, i) {
const p = sim.p, sp = sim.species;
const off = i * MAX_SPECIES;
const comp = p.comp;
const T = p.temp[i];
const n = sp.count;
let tot = 0, rho = 0, rhoCp = 0, kap = 0, lnV = 0, lnVw = 0, vT = 0, beta = 0;
let aR = 0, aG = 0, aB = 0, op = 0, flam = 0, ign = 0, ignW = 0, comb = 0, gasR = 0, glow = 0;
let tbS = 0, tbW = 0, tmS = 0, tmW = 0, pmS = 0, pmW = 0, fricS = 0, hardS = 0, binder = 0, latF = 0, latV = 0;
let cA = 0, cB = 0;
for (let s = 0; s < n; s++) {
const f = comp[off + s];
if (f <= 0) continue;
tot += f;
rho += f * sp.density[s];
rhoCp += f * sp.heatCap[s];
kap += f * sp.conductivity[s];
beta += f * sp.expansion[s];
cA += f * sp.compatA[s];
cB += f * sp.compatB[s];
const powder = sp.isPowder[s] === 1;
if (!powder || T >= sp.melt[s]) {
lnV += f * sp.lnVisc[s];
vT += f * sp.viscTemp[s];
lnVw += f;
}
aR += f * sp.absR[s];
aG += f * sp.absG[s];
aB += f * sp.absB[s];
op += f * sp.opacity[s];
glow += f * sp.glow[s];
const fl = sp.flam[s];
if (fl > 0) {
flam += f * fl;
ign += f * fl * sp.ignition[s];
ignW += f * fl;
comb += f * fl * sp.combHeat[s];
}
gasR += f * sp.gasDensity[s];
if (sp.boil[s] < NO_BOIL) {
tbS += f * sp.boil[s];
tbW += f;
}
if (powder) {
pmS += f * sp.melt[s];
pmW += f;
fricS += f * sp.friction[s];
binder += f * sp.binder[s];
} else {
tmS += f * sp.melt[s];
tmW += f;
}
hardS += f * sp.hardness[s];
latF += f * sp.latF[s];
latV += f * sp.latV[s];
}
if (tot <= 1e-6) {
tot = 1;
rho = 1; rhoCp = 4; kap = 1;
}
const inv = 1 / tot;
const gran = granularFraction(sp, comp, off, T) * inv;
const powderFrac = pmW * inv;
const dissolved = Math.max(0, powderFrac - gran);
const rho20 = rho * inv;
const b = beta * inv;
p.rho20[i] = rho20;
const rhoT = rho20 * Math.max(0.6, 1 - b * (T - 20));
p.rho[i] = rhoT;
p.invMass[i] = p.phase[i] === PHASE.GAS ? 1 / GAS_MASS : 1 / rhoT;
p.rhoCp[i] = rhoCp * inv;
p.kappa[i] = kap * inv;
p.beta[i] = b;
p.cA[i] = cA * inv;
p.cB[i] = cB * inv;
const bnd = pmW > 0 ? binder / pmW : 0;
p.binder[i] = bnd;
p.gran[i] = gran;
const lnMu20 = lnVw > 0 ? lnV / lnVw : 11;
const kT = lnVw > 0 ? vT / lnVw : 0;
p.lnMu20[i] = lnMu20;
p.viscT[i] = kT;
p.lnMu[i] = lnMu20 - kT * (Math.min(T, 300) - 20) + suspensionLnMult(gran, bnd);
p.tm[i] = tmW > 0 ? tmS / tmW - 28 * dissolved : pmW > 0 ? pmS / pmW : 0;
p.tb[i] = tbW > 0 ? tbS / tbW : NO_BOIL;
p.volFrac[i] = tbW * inv;
p.latF[i] = latF * inv;
p.latV[i] = latV * inv;
const cr = linearToSrgb(Math.exp(-aR * inv)), cg = linearToSrgb(Math.exp(-aG * inv)), cb = linearToSrgb(Math.exp(-aB * inv));
sim.colR[i] = cr; sim.colG[i] = cg; sim.colB[i] = cb;
const lab = rgbToOklab(cr, cg, cb);
p.colL[i] = lab[0]; p.colA[i] = lab[1]; p.colB[i] = lab[2];
p.opacity[i] = op * inv;
p.flam[i] = flam * inv;
p.ign[i] = ignW > 0 ? ign / ignW : 9999;
p.combHeat[i] = ignW > 0 ? comb / ignW : 0;
p.gasRho[i] = gasR * inv;
p.glow[i] = glow * inv;
p.friction[i] = pmW > 0 ? fricS / pmW : 0.5;
p.hardness[i] = hardS * inv;
const s = Math.max(0, Math.min(1, (gran - 0.34) / 0.42));
p.yieldV[i] = (0.1 + 0.6 * bnd) * Math.pow(s, 1.1);
p.dirty[i] = 0;
}
return { GAS_MASS, refreshParticle };
})();
// src/simulation/rigid.js
const __m27 = (() => {
const { PHASE } = __m17;
const MAX_GROUPS = 2048;
const BOND = 0.135;
const FRESH = -2;
class RigidBodies {
constructor(sim) {
this.sim = sim;
this.start = new Int32Array(MAX_GROUPS + 1);
this.members = new Int32Array(sim.capacity);
this.dirty = new Uint8Array(MAX_GROUPS);
this.used = new Uint8Array(MAX_GROUPS);
this.anyDirty = false;
this.parent = new Int32Array(sim.capacity);
this.active = /** @type {number[]} */ ([]);
}
reset() {
this.dirty.fill(0);
this.used.fill(0);
this.anyDirty = false;
this.active = [];
}
markDirty(g) {
if (g >= 0 && g < MAX_GROUPS) this.dirty[g] = 1;
this.anyDirty = true;
}
alloc() {
for (let g = 0; g < MAX_GROUPS; g++) {
if (!this.used[g]) {
this.used[g] = 1;
return g;
}
}
return -1;
}
setRest(idx) {
const p = this.sim.p;
let cx = 0, cy = 0, m = 0;
for (const i of idx) {
const w = p.rho[i];
cx += p.x[i] * w; cy += p.y[i] * w; m += w;
}
cx /= m; cy /= m;
for (const i of idx) {
p.restX[i] = p.x[i] - cx;
p.restY[i] = p.y[i] - cy;
}
}
update() {
const p = this.sim.p, n = p.count;
let fresh = false;
for (let i = 0; i < n; i++) {
if (p.group[i] === FRESH) { fresh = true; break; }
}
if (fresh || this.anyDirty) this._topology();
const start = this.start;
start.fill(0);
this.used.fill(0);
for (let i = 0; i < n; i++) {
const g = p.group[i];
if (g >= 0) { start[g + 1]++; this.used[g] = 1; }
}
for (let g = 0; g < MAX_GROUPS; g++) start[g + 1] += start[g];
const cur = this._cur || (this._cur = new Int32Array(MAX_GROUPS));
cur.set(start.subarray(0, MAX_GROUPS));
for (let i = 0; i < n; i++) {
const g = p.group[i];
if (g >= 0) this.members[cur[g]++] = i;
}
this.active.length = 0;
for (let g = 0; g < MAX_GROUPS; g++) if (start[g + 1] - start[g] >= 2) this.active.push(g);
}
_find(i) {
const par = this.parent;
while (par[i] !== i) {
par[i] = par[par[i]];
i = par[i];
}
return i;
}
_topology() {
const sim = this.sim, p = sim.p, n = p.count;
const par = this.parent;
for (let i = 0; i < n; i++) par[i] = i;
const { pairI, pairJ, pairCount } = sim.grid;
const B2 = BOND * BOND;
for (let k = 0; k < pairCount; k++) {
const i = pairI[k], j = pairJ[k];
if (p.phase[i] !== PHASE.SOLID || p.phase[j] !== PHASE.SOLID) continue;
const gi = p.group[i], gj = p.group[j];
if (!((gi === gj && gi >= 0) || gi === FRESH || gj === FRESH)) continue;
const dx = p.x[i] - p.x[j], dy = p.y[i] - p.y[j];
if (dx * dx + dy * dy > B2) continue;
const a = this._find(i), b = this._find(j);
if (a !== b) par[a] = b;
}
const comps = new Map();
for (let i = 0; i < n; i++) {
if (p.phase[i] !== PHASE.SOLID) {
p.group[i] = -1;
continue;
}
const r = this._find(i);
let arr = comps.get(r);
if (!arr) comps.set(r, (arr = []));
arr.push(i);
}
const list = [...comps.values()].sort((a, b) => b.length - a.length);
const claimed = new Uint8Array(MAX_GROUPS);
const pending = [];
for (const arr of list) {
const counts = new Map();
let hasFresh = false;
for (const i of arr) {
const g = p.group[i];
if (g >= 0) counts.set(g, (counts.get(g) || 0) + 1);
else hasFresh = true;
}
let best = -1, bc = 0;
for (const [g, c] of counts) if (c > bc && !claimed[g]) { best = g; bc = c; }
if (best < 0) { pending.push(arr); continue; }
claimed[best] = 1;
const changed = hasFresh || counts.size !== 1 || bc !== arr.length || this.dirty[best];
if (changed) {
for (const i of arr) p.group[i] = best;
this.setRest(arr);
}
}
let nextFree = 0;
for (const arr of pending) {
while (nextFree < MAX_GROUPS && claimed[nextFree]) nextFree++;
if (nextFree >= MAX_GROUPS) break;
claimed[nextFree] = 1;
for (const i of arr) p.group[i] = nextFree;
this.setRest(arr);
}
this.dirty.fill(0);
this.anyDirty = false;
}
shapeMatch() {
const p = this.sim.p;
const xs = p.x, ys = p.y, rx = p.restX, ry = p.restY, rho = p.rho;
const start = this.start, mem = this.members;
for (const g of this.active) {
const s0 = start[g], s1 = start[g + 1];
let cx = 0, cy = 0, m = 0;
for (let k = s0; k < s1; k++) {
const i = mem[k];
const w = rho[i];
cx += xs[i] * w; cy += ys[i] * w; m += w;
}
cx /= m; cy /= m;
let a00 = 0, a01 = 0, a10 = 0, a11 = 0;
for (let k = s0; k < s1; k++) {
const i = mem[k];
const w = rho[i];
const qx = xs[i] - cx, qy = ys[i] - cy;
a00 += w * qx * rx[i]; a01 += w * qx * ry[i];
a10 += w * qy * rx[i]; a11 += w * qy * ry[i];
}
const th = Math.atan2(a10 - a01, a00 + a11);
const c = Math.cos(th), s = Math.sin(th);
for (let k = s0; k < s1; k++) {
const i = mem[k];
xs[i] = cx + c * rx[i] - s * ry[i];
ys[i] = cy + s * rx[i] + c * ry[i];
}
}
}
bodyCount() {
return this.active.length;
}
}
return { FRESH, RigidBodies };
})();
// src/simulation/thermal.js
const __m28 = (() => {
const { PHASE, SIM } = __m17;
const KPP = 34; // particle–particle conductance (game-scaled)
const KW = 24; // particle–wall conductance
const KA = 0.35; // free-surface loss to air
const KA_GAS = 0.5; // vapour ↔ headspace air
const RING = 220; // conduction along the iron
const HAMB = 0.5; // iron loss to room
const HAMB_LID = 9; // lid loses heat faster (exposed top)
const RT = 0.16;
function thermalStep(sim, dt) {
const p = sim.p, n = p.count, c = sim.cauldron;
const T = p.temp, C = p.rhoCp, K = p.kappa, ph = p.phase;
const { pairI, pairJ, pairCount } = sim.grid;
const RT2 = RT * RT;
for (let k = 0; k < pairCount; k++) {
const i = pairI[k], j = pairJ[k];
const dT = T[j] - T[i];
if (dT > -0.01 && dT < 0.01) continue;
const dx = p.x[i] - p.x[j], dy = p.y[i] - p.y[j];
const r2 = dx * dx + dy * dy;
if (r2 >= RT2) continue;
const gi = ph[i] === PHASE.GAS, gj = ph[j] === PHASE.GAS;
const f = gi && gj ? 0.4 : gi || gj ? 0.2 : 1;
const ki = K[i], kj = K[j];
const G = KPP * f * ((2 * ki * kj) / (ki + kj + 1e-6)) * (1 - Math.sqrt(r2) / RT);
let Q = G * dT * dt;
const lim = 0.22 * Math.abs(dT) * Math.min(C[i], C[j]);
if (Q > lim) Q = lim; else if (Q < -lim) Q = -lim;
T[i] += Q / C[i];
T[j] -= Q / C[j];
}
const tw = sim.touchWall;
const amb = SIM.AMBIENT;
const n0 = sim.n0;
const lidT = c.lidTemperature();
for (let i = 0; i < n; i++) {
const Ci = C[i];
if (tw[i] === 1 && p.y[i] >= -0.02) {
const cell = c.wallCellAt(p.x[i], p.y[i]);
if (cell >= 0) {
const dT = c.cellT[cell] - T[i];
let Q = KW * Math.min(2, K[i]) * dT * dt * (ph[i] === PHASE.GAS ? 0.6 : 1);
const lim = 0.3 * Math.abs(dT) * Math.min(Ci, c.cellC[cell]);
if (Q > lim) Q = lim; else if (Q < -lim) Q = -lim;
T[i] += Q / Ci;
c.cellT[cell] -= Q / c.cellC[cell];
}
} else if (tw[i] === 2 && c.lidClosed) {
const cell = c.lidCellAt(p.x[i]);
const dT = c.cellT[cell] - T[i];
let Q = KW * 0.8 * Math.min(2, K[i]) * dT * dt;
const lim = 0.3 * Math.abs(dT) * Math.min(Ci, c.cellC[cell]);
if (Q > lim) Q = lim; else if (Q < -lim) Q = -lim;
T[i] += Q / Ci;
c.cellT[cell] -= Q / c.cellC[cell];
}
if (ph[i] !== PHASE.GAS && sim.dens[i] < 0.68 * n0) {
const Q = KA * (c.lidClosed ? 0.4 : 1) * (amb - T[i]) * dt;
T[i] += Q / Ci;
sim.energyOut -= Q;
} else if (ph[i] === PHASE.GAS) {
const Ta = c.lidClosed ? lidT : amb;
const Q = KA_GAS * (Ta - T[i]) * dt;
T[i] += Q / Ci;
sim.energyOut -= Q;
}
}
wallStep(sim, dt);
}
function wallStep(sim, dt) {
const c = sim.cauldron;
const M = c.wallCount, L = c.lidCells;
const Tw = c.cellT, Cw = c.cellC;
const f = sim.furnace;
const amb = SIM.AMBIENT;
const flow = sim._wallFlow || (sim._wallFlow = new Float32Array(Tw.length));
flow.fill(0);
for (let k = 0; k < M - 1; k++) {
const q = RING * (Tw[k + 1] - Tw[k]) * dt;
flow[k] += q; flow[k + 1] -= q;
}
for (let k = 0; k < L - 1; k++) {
const a = M + k, b = M + k + 1;
const q = RING * 0.6 * (Tw[b] - Tw[a]) * dt;
flow[a] += q; flow[b] -= q;
}
const rimG = c.lidClosed ? 8 : 2;
{
const q1 = rimG * (Tw[M] - Tw[0]) * dt;
flow[0] += q1; flow[M] -= q1;
const q2 = rimG * (Tw[M + L - 1] - Tw[M - 1]) * dt;
flow[M - 1] += q2; flow[M + L - 1] -= q2;
}
const s = f.setting;
for (let k = 0; k < M + L; k++) {
let P = 0;
const exp = c.cellFurnace[k];
if (exp > 0 && s > 0) {
const Tf = amb + s * (f.maxFlame - amb);
P = f.heatPower * exp * Math.max(0, Tf - Tw[k]);
} else if (exp > 0 && s < 0) {
const Tc = amb + -s * (f.minCool - amb);
P = f.coolPower * exp * Math.min(0, Tc - Tw[k]);
}
const lidCell = k >= M;
const h = lidCell ? (c.lidClosed ? HAMB_LID : 3) : HAMB;
const loss = h * (amb - Tw[k]);
sim.energyIn += P * dt;
sim.energyOut -= loss * dt;
flow[k] += (P + loss) * dt;
}
for (let k = 0; k < M + L; k++) Tw[k] += flow[k] / Cw[k];
}
return { thermalStep, wallStep };
})();
// src/simulation/phase.js
const __m29 = (() => {
const { PHASE, PHASE_NAMES } = __m17;
const { MAX_SPECIES, NO_BOIL } = __m13;
const { refreshParticle } = __m26;
const { FRESH } = __m27;
const { LIQUID, POWDER, PASTE, SOLID, GAS } = PHASE;
const BOIL_VOLATILE = 0.8;
const DRY_MIN = 0.12;
const DRY_TARGET = 0.86;
const DRY_R = 0.11;
function classifyFluid(sim, i) {
const p = sim.p;
const ph = p.phase[i];
if (ph === GAS || ph === SOLID) return;
if (ph === POWDER && isFrozenGrain(sim, i)) return;
const g = p.gran[i];
let np = ph;
if (ph === POWDER) {
if (g < 0.33) np = LIQUID;
else if (g < 0.72) np = PASTE;
} else if (ph === PASTE) {
if (g > 0.78) np = POWDER;
else if (g < 0.32) np = LIQUID;
} else {
if (g > 0.8) np = POWDER;
else if (g > 0.37) np = PASTE;
}
if (np !== ph) {
p.phase[i] = np;
p.sleep[i] = 0;
if (np === PASTE) sim.emit({ type: 'paste', x: p.x[i], y: p.y[i], species: dominantId(sim, i), binder: p.binder[i] });
if (np === LIQUID && ph === POWDER) sim.emit({ type: 'dissolve', x: p.x[i], y: p.y[i], species: dominantPowderId(sim, i) });
}
}
function isFrozenGrain(sim, i) {
const p = sim.p;
return p.phase[i] === POWDER && p.gran[i] < 0.5 && p.temp[i] < p.tm[i] + 0.5;
}
function dominantId(sim, i) {
const sp = sim.species, off = i * MAX_SPECIES;
let best = -1, bf = 0;
for (let s = 0; s < sp.count; s++) {
const f = sim.p.comp[off + s];
if (f > bf) { bf = f; best = s; }
}
return best >= 0 && sp.defs[best] ? sp.defs[best].id : null;
}
function dominantPowderId(sim, i) {
const sp = sim.species, off = i * MAX_SPECIES;
let best = -1, bf = 0;
for (let s = 0; s < sp.count; s++) {
const f = sim.p.comp[off + s];
if (sp.isPowder[s] && f > bf) { bf = f; best = s; }
}
return best >= 0 && sp.defs[best] ? sp.defs[best].id : null;
}
function changed(sim, i, from, to) {
const p = sim.p;
p.sleep[i] = 0;
p.dirty[i] = 1;
refreshParticle(sim, i);
sim.emit({ type: 'phase', from: PHASE_NAMES[from], to: PHASE_NAMES[to], x: p.x[i], y: p.y[i], species: dominantId(sim, i), temp: p.temp[i] });
}
function phaseStep(sim, dt) {
const p = sim.p, n = p.count;
const T = p.temp, lat = p.lat, C = p.rhoCp;
const n0 = sim.n0;
for (let i = 0; i < n; i++) {
const ph = p.phase[i];
const Ci = C[i];
if (ph === GAS) {
const tb = p.tb[i];
if (T[i] < tb) {
const sat = Math.min(1, sim.nGas[i] / 5);
const contact = sim.touchWall[i] ? 1 : 0;
const cf = 0.08 + 0.92 * Math.max(sat * 0.55, contact);
const e = (tb - T[i]) * Ci * cf;
lat[i] -= e;
T[i] += e / Ci;
if (lat[i] <= -p.latV[i]) {
lat[i] += p.latV[i];
p.eph[i] -= p.latV[i];
T[i] += lat[i] / Ci;
lat[i] = 0;
p.phase[i] = LIQUID;
refreshParticle(sim, i);
classifyFluid(sim, i);
changed(sim, i, GAS, p.phase[i]);
}
} else if (lat[i] < 0) {
const r = Math.min(-lat[i], (T[i] - tb) * Ci);
lat[i] += r;
T[i] -= r / Ci;
}
continue;
}
if (ph === SOLID || (ph === POWDER && p.gran[i] < 0.5 && T[i] < p.tm[i] + 0.5 + (lat[i] > 0 ? 1 : 0))) {
const tm = p.tm[i];
if (T[i] > tm) {
const e = (T[i] - tm) * Ci;
lat[i] += e;
T[i] = tm;
if (lat[i] >= p.latF[i]) {
lat[i] -= p.latF[i];
p.eph[i] += p.latF[i];
T[i] += lat[i] / Ci;
lat[i] = 0;
if (p.group[i] >= 0) sim.rigid.markDirty(p.group[i]);
p.group[i] = -1;
p.phase[i] = LIQUID;
refreshParticle(sim, i);
classifyFluid(sim, i);
changed(sim, i, ph, p.phase[i]);
}
} else if (lat[i] > 0) {
const r = Math.min(lat[i], (tm - T[i]) * Ci);
lat[i] -= r;
T[i] += r / Ci;
}
continue;
}
const tb = p.tb[i];
const tm = p.tm[i];
const volatile = p.volFrac[i];
if (volatile >= DRY_MIN && volatile < BOIL_VOLATILE && tb < NO_BOIL && T[i] > tb) {
const e = (T[i] - tb) * Ci;
lat[i] += e;
T[i] = tb;
if (lat[i] >= 0.5 * p.latV[i]) {
const got = gatherVolatile(sim, i, DRY_TARGET - volatile);
refreshParticle(sim, i);
classifyFluid(sim, i);
if (p.volFrac[i] < BOIL_VOLATILE && got < 0.01) {
spreadVolatile(sim, i);
refreshParticle(sim, i);
classifyFluid(sim, i);
T[i] += lat[i] / C[i];
lat[i] = 0;
}
}
continue;
}
if (ph !== POWDER && volatile >= BOIL_VOLATILE && tb < NO_BOIL && T[i] > tb) {
const e = (T[i] - tb) * Ci;
lat[i] += e;
T[i] = tb;
if (lat[i] >= p.latV[i]) {
if (volatile < 0.999 && gatherVolatile(sim, i, 1 - volatile) > 0) refreshParticle(sim, i);
lat[i] -= p.latV[i];
p.eph[i] += p.latV[i];
T[i] += lat[i] / Ci;
lat[i] = 0;
p.phase[i] = GAS;
refreshParticle(sim, i);
changed(sim, i, ph, GAS);
}
continue;
}
if (ph !== POWDER && T[i] < tm) {
const e = (tm - T[i]) * Ci;
lat[i] -= e;
T[i] = tm;
if (lat[i] <= -p.latF[i]) {
lat[i] += p.latF[i];
p.eph[i] -= p.latF[i];
T[i] += lat[i] / Ci;
lat[i] = 0;
p.phase[i] = SOLID;
p.group[i] = FRESH;
p.vx[i] *= 0.3; p.vy[i] *= 0.3;
changed(sim, i, ph, SOLID);
}
continue;
}
if (lat[i] > 0) {
const r = Math.min(lat[i], Math.max(0, tb - T[i]) * Ci);
lat[i] -= r;
T[i] += r / Ci;
} else if (lat[i] < 0) {
const r = Math.min(-lat[i], Math.max(0, T[i] - tm) * Ci);
lat[i] += r;
T[i] -= r / Ci;
}
if (ph === LIQUID && volatile >= BOIL_VOLATILE && tb < NO_BOIL && T[i] > tb - 40 && sim.dens[i] < 0.7 * n0) {
const e = 0.9 * ((T[i] - (tb - 40)) / 40) * Ci * dt;
T[i] -= e / Ci;
lat[i] += e;
if (lat[i] >= p.latV[i]) {
lat[i] -= p.latV[i];
p.eph[i] += p.latV[i];
T[i] += lat[i] / Ci;
lat[i] = 0;
p.phase[i] = GAS;
refreshParticle(sim, i);
changed(sim, i, ph, GAS);
}
}
}
}
function gatherVolatile(sim, i, need) {
if (need <= 0) return 0;
const p = sim.p, sp = sim.species, S = MAX_SPECIES, ns = sp.count;
const comp = p.comp, oi = i * S;
const x = p.x[i], y = p.y[i];
let vi = 0;
for (let s = 0; s < ns; s++) if (sp.boil[s] < NO_BOIL) vi += comp[oi + s];
let got = 0;
const touched = gatherTouched;
touched.length = 0;
sim.grid.query(x, y, DRY_R, (j) => {
if (got >= need || j === i) return;
const ph = p.phase[j];
if (ph === GAS || ph === SOLID || p.group[j] >= 0) return;
const dx = p.x[j] - x, dy = p.y[j] - y;
if (dx * dx + dy * dy > DRY_R * DRY_R) return;
const oj = j * S;
let vj = 0;
for (let s = 0; s < ns; s++) if (sp.boil[s] < NO_BOIL) vj += comp[oj + s];
const ni = 1 - vi;
const a = Math.min(need - got, vj * 0.5, ni);
if (a <= 1e-4 || vj <= 1e-6 || ni <= 1e-6) return;
const kv = a / vj, kn = a / ni;
for (let s = 0; s < ns; s++) {
if (sp.boil[s] < NO_BOIL) {
const d = comp[oj + s] * kv;
comp[oj + s] -= d;
comp[oi + s] += d;
} else {
const d = comp[oi + s] * kn;
comp[oi + s] -= d;
comp[oj + s] += d;
}
}
vi += a;
got += a;
touched.push(j);
});
for (const j of touched) {
p.sleep[j] = 0;
refreshParticle(sim, j);
classifyFluid(sim, j);
}
return got;
}
const gatherTouched = [];
function spreadVolatile(sim, i) {
const p = sim.p, sp = sim.species, S = MAX_SPECIES, ns = sp.count;
const comp = p.comp, oi = i * S;
const x = p.x[i], y = p.y[i];
const nb = gatherTouched;
nb.length = 0;
sim.grid.query(x, y, DRY_R, (j) => {
if (j === i || nb.length >= 12) return;
const ph = p.phase[j];
if (ph === GAS || ph === SOLID || p.group[j] >= 0) return;
const dx = p.x[j] - x, dy = p.y[j] - y;
if (dx * dx + dy * dy <= DRY_R * DRY_R) nb.push(j);
});
if (!nb.length) return;
let vi = 0;
for (let s = 0; s < ns; s++) if (sp.boil[s] < NO_BOIL) vi += comp[oi + s];
const share = vi / (nb.length + 1);
for (const j of nb) {
const oj = j * S;
let nj = 0;
for (let s = 0; s < ns; s++) if (sp.boil[s] >= NO_BOIL) nj += comp[oj + s];
const a = Math.min(share, nj, vi);
if (a <= 1e-5) continue;
const kv = a / vi, kn = a / nj;
for (let s = 0; s < ns; s++) {
if (sp.boil[s] < NO_BOIL) {
const d = comp[oi + s] * kv;
comp[oi + s] -= d;
comp[oj + s] += d;
} else {
const d = comp[oj + s] * kn;
comp[oj + s] -= d;
comp[oi + s] += d;
}
}
vi -= a;
p.sleep[j] = 0;
refreshParticle(sim, j);
classifyFluid(sim, j);
}
}
return { classifyFluid, isFrozenGrain, dominantId, phaseStep };
})();
// src/reactions/diffusion.js
const __m30 = (() => {
const { PHASE } = __m17;
const { MAX_SPECIES } = __m13;
const { compatFactor } = __m18;
const { LIQUID, POWDER, PASTE, SOLID, GAS } = PHASE;
const RD = 0.16;
function diffusionStep(sim, dt) {
const p = sim.p, comp = p.comp, S = MAX_SPECIES;
const ns = sim.species.count;
const sp = sim.species;
const { pairI, pairJ, pairCount } = sim.grid;
const RD2 = RD * RD;
const chg = sim.tmpA;
const n = p.count;
for (let i = 0; i < n; i++) chg[i] = 0;
const ph = p.phase;
for (let k = 0; k < pairCount; k++) {
const i = pairI[k], j = pairJ[k];
const pi = ph[i], pj = ph[j];
if (pi === SOLID || pj === SOLID) continue;
const gi = pi === GAS, gj = pj === GAS;
if (gi !== gj) continue;
if (
Math.abs(p.rho20[i] - p.rho20[j]) < 1e-5 &&
Math.abs(p.colL[i] - p.colL[j]) < 1e-5 &&
Math.abs(p.colA[i] - p.colA[j]) < 1e-5 &&
Math.abs(p.colB[i] - p.colB[j]) < 1e-5 &&
Math.abs(p.cA[i] - p.cA[j]) < 1e-5 &&
Math.abs(p.gran[i] - p.gran[j]) < 1e-5
) continue;
const dx = p.x[i] - p.x[j], dy = p.y[i] - p.y[j];
const r2 = dx * dx + dy * dy;
if (r2 >= RD2) continue;
const c = compatFactor(p.cA[i], p.cB[i], p.cA[j], p.cB[j]);
if (c <= 0) continue;
const w = 1 - Math.sqrt(r2) / RD;
const agit = Math.max(p.agit[i], p.agit[j]);
let rate;
const fi = pi === LIQUID || pi === PASTE, fj = pj === LIQUID || pj === PASTE;
if (gi) {
rate = 2.4;
} else if (fi && fj) {
const lnMu = Math.min(p.lnMu[i], p.lnMu[j]);
const Tm = 0.5 * (p.temp[i] + p.temp[j]);
const fD = Math.max(0.03, Math.min(1, Math.exp(-0.5 * Math.max(0, lnMu)))) * Math.max(0.3, (Tm + 273) / 293);
rate = 0.5 * fD + 11 * agit * Math.max(0.35, fD);
} else if (fi || fj) {
const g = fi ? j : i;
const q = p.gran[g];
const sol = solubilityOf(sim, g);
const bind = p.binder[g];
const frozen = q < 0.5; // crushed frozen liquid grains mix like the liquid they are
if (bind < 0.05 && sol <= 0 && !frozen) continue;
const Tg = p.temp[g];
const knead = Math.min(p.agit[i], p.agit[j]);
let base = q > 0.8 ? 0.5 * bind : 0; // contact surfaces wet, the bulk does not
base += sol * 0.9 * Math.max(0.3, 1 + (Tg - 20) / 40); // soluble grains dissolve slowly at rest
rate = base + 8 * knead * Math.max(bind, sol * 2, frozen ? 1 : 0);
} else {
if (p.gran[i] > 0.97 && p.gran[j] > 0.97) continue;
rate = 2.2 * agit;
}
let kx = rate * c * w * dt;
if (kx > 0.45) kx = 0.45;
if (kx < 1e-5) continue;
const oi = i * S, oj = j * S;
let m = 0;
for (let s = 0; s < ns; s++) {
const a = comp[oi + s], b = comp[oj + s];
if (a === b) continue;
const d = (b - a) * kx;
comp[oi + s] = a + d;
comp[oj + s] = b - d;
m += d < 0 ? -d : d;
}
chg[i] += m;
chg[j] += m;
void sp;
}
for (let i = 0; i < n; i++) {
const m = chg[i];
if (m <= 0) continue;
p.wet[i] = Math.min(1, p.wet[i] * 0.96 + m * 12);
sim.compChange[i] += m;
if (sim.compChange[i] > 0.004) {
sim.compChange[i] = 0;
p.dirty[i] = 1;
}
}
}
function solubilityOf(sim, i) {
const p = sim.p, sp = sim.species, off = i * MAX_SPECIES;
let s = 0, w = 0;
for (let k = 0; k < sp.count; k++) {
const f = p.comp[off + k];
if (f > 0 && sp.isPowder[k]) {
s += f * sp.solubility[k];
w += f;
}
}
return w > 0 ? s / w : 0;
}
return { diffusionStep };
})();
// src/reactions/reactions.js
const __m31 = (() => {
const { MAX_SPECIES } = __m13;
const { PHASE } = __m17;
const { GAS, SOLID } = PHASE;
class ReactionSystem {
constructor(sim, rules) {
this.sim = sim;
this.rules = rules;
this.lastEvent = {};
this.progress = /** @type {Record<string, number>} */ ({});
this.burned = 0;
this._acc = new Float32Array(MAX_SPECIES);
}
setRules(rules) {
this.rules = rules;
}
needsSlot(id) {
void id;
return false;
}
step(dt) {
const sim = this.sim, p = sim.p, sp = sim.species, S = MAX_SPECIES;
const n = p.count;
for (const rule of this.rules) {
const sa = sp.slotOf.get(rule.a);
if (sa === undefined) continue;
let sb = -1;
if (rule.b) {
const t = sp.slotOf.get(rule.b);
if (t === undefined) continue;
sb = t;
}
if (rule.kind === 'contact') this._contact(rule, sa, sb, dt);
else this._local(rule, sa, sb, dt);
}
this._combustion(dt);
for (let i = 0; i < n; i++) if (p.burn[i] > 0) p.burn[i] *= 0.93;
void S;
}
_productSlots(rule) {
const sim = this.sim;
const out = [];
for (const pr of rule.products) {
const def = sim.lookup(pr.id);
if (!def) return null;
const s = sim.slotFor(def);
if (s < 0) return null;
out.push([s, pr.frac]);
}
return out;
}
_rateT(rule, T) {
if (T < rule.minT || T > rule.maxT) return 0;
return 1 + Math.min(3, (T - rule.minT) / 40);
}
_local(rule, sa, sb, dt) {
const sim = this.sim, p = sim.p, S = MAX_SPECIES;
let prods = null;
const n = p.count;
for (let i = 0; i < n; i++) {
if (p.phase[i] === SOLID) continue;
const off = i * S;
const fa = p.comp[off + sa];
if (fa < 0.004) continue;
let lim = fa / rule.ra;
if (sb >= 0) {
const fb = p.comp[off + sb];
if (fb < 0.004) continue;
lim = Math.min(lim, fb / rule.rb);
}
const tf = this._rateT(rule, p.temp[i]);
if (tf <= 0) continue;
let ext = rule.rate * dt * tf * lim * (1 + rule.stir * Math.min(3, p.agit[i]));
if (ext > lim) ext = lim;
if (ext < 1e-6) continue;
if (!prods) {
prods = this._productSlots(rule);
if (!prods) return;
}
const used = ext * (rule.ra + (sb >= 0 ? rule.rb : 0));
p.comp[off + sa] -= ext * rule.ra;
if (sb >= 0) p.comp[off + sb] -= ext * rule.rb;
for (const [s, f] of prods) p.comp[off + s] += used * f;
p.temp[i] += (rule.heat * used) / p.rhoCp[i];
p.dirty[i] = 1;
p.wet[i] = Math.min(1, p.wet[i] + 0.3);
this.progress[rule.id] = (this.progress[rule.id] || 0) + used;
this._event(rule, i);
}
}
_contact(rule, sa, sb, dt) {
const sim = this.sim, p = sim.p, S = MAX_SPECIES;
const { pairI, pairJ, pairCount } = sim.grid;
let prods = null;
for (let k = 0; k < pairCount; k++) {
let i = pairI[k], j = pairJ[k];
if (p.phase[i] === GAS || p.phase[j] === GAS) continue;
let fa = p.comp[i * S + sa], fb = p.comp[j * S + sb];
if (fa < 0.004 || fb < 0.004) {
const fa2 = p.comp[j * S + sa], fb2 = p.comp[i * S + sb];
if (fa2 < 0.004 || fb2 < 0.004) continue;
const t = i; i = j; j = t;
fa = fa2; fb = fb2;
}
const dx = p.x[i] - p.x[j], dy = p.y[i] - p.y[j];
const r2 = dx * dx + dy * dy;
if (r2 > 0.0144) continue;
const T = 0.5 * (p.temp[i] + p.temp[j]);
const tf = this._rateT(rule, T);
if (tf <= 0) continue;
const lim = Math.min(fa / rule.ra, fb / rule.rb);
let ext = rule.rate * dt * tf * lim * (1 + rule.stir * Math.min(3, Math.max(p.agit[i], p.agit[j])));
if (ext > lim) ext = lim;
if (ext < 1e-6) continue;
if (!prods) {
prods = this._productSlots(rule);
if (!prods) return;
}
const ua = ext * rule.ra, ub = ext * rule.rb;
p.comp[i * S + sa] -= ua;
p.comp[j * S + sb] -= ub;
for (const [s, f] of prods) {
p.comp[i * S + s] += ua * f;
p.comp[j * S + s] += ub * f;
}
p.temp[i] += (rule.heat * ua) / p.rhoCp[i];
p.temp[j] += (rule.heat * ub) / p.rhoCp[j];
p.dirty[i] = 1; p.dirty[j] = 1;
p.wet[i] = Math.min(1, p.wet[i] + 0.3);
p.wet[j] = Math.min(1, p.wet[j] + 0.3);
this.progress[rule.id] = (this.progress[rule.id] || 0) + ua + ub;
this._event(rule, i);
}
}
_event(rule, i) {
const sim = this.sim;
const last = this.lastEvent[rule.id];
if (last !== undefined && sim.time - last < 2.5) return;
this.lastEvent[rule.id] = sim.time;
sim.emit({ type: 'reaction', rule: rule.id, name: rule.name, x: sim.p.x[i], y: sim.p.y[i], heat: rule.heat });
}
_combustion(dt) {
const sim = this.sim, p = sim.p, sp = sim.species, S = MAX_SPECIES;
const n = p.count;
const n0 = sim.n0;
const lid = sim.cauldron.lidClosed;
const c = sim.cauldron;
for (let i = 0; i < n; i++) {
if (p.flam[i] < 0.03) continue;
if (p.temp[i] < p.ign[i]) {
if (sim.touchWall[i] !== 1 || sim.oxygen < 0.04 || sim.dens[i] >= 0.78 * n0) continue;
const cell = c.wallCellAt(p.x[i], p.y[i]);
if (cell < 0 || c.cellT[cell] < p.ign[i] + 60) continue;
const Q = (p.ign[i] - p.temp[i]) * p.rhoCp[i];
p.temp[i] = p.ign[i];
c.cellT[cell] -= Q / c.cellC[cell];
}
const gas = p.phase[i] === GAS;
const exposed = gas || sim.dens[i] < 0.78 * n0 || sim.nGas[i] > 0;
if (!exposed || sim.oxygen < 0.04) continue;
const off = i * S;
const rate = (gas ? 1.6 : 0.28) * dt * Math.min(1, sim.oxygen * 1.5) * (1 + Math.min(1.5, (p.temp[i] - p.ign[i]) / 150));
let heat = 0, burnt = 0;
for (let s = 0; s < sp.count; s++) {
const fl = sp.flam[s];
if (fl <= 0) continue;
const f = p.comp[off + s];
if (f <= 0) continue;
const target = sp.isPowder[s] ? sp.ashSlot[s] : sp.smokeSlot[s];
if (target < 0) continue;
const amt = Math.min(f, f * fl * rate + 0.002 * dt * 60);
p.comp[off + s] -= amt;
p.comp[off + target] += amt;
heat += amt * sp.combHeat[s];
burnt += amt;
}
if (burnt <= 0) continue;
this._flameHeat(i, heat);
p.burn[i] = Math.min(1, p.burn[i] + 0.35 + burnt * 4);
p.dirty[i] = 1;
p.sleep[i] = 0;
this.burned += burnt;
if (lid) sim.oxygen = Math.max(0, sim.oxygen - burnt * 0.03);
const last = this.lastEvent.__fire;
if (last === undefined || sim.time - last > 1.5) {
this.lastEvent.__fire = sim.time;
sim.emit({ type: 'ignite', x: p.x[i], y: p.y[i], species: sp.defs[maxFlamSlot(sim, i)]?.id });
}
}
}
_flameHeat(i, heat) {
const sim = this.sim, p = sim.p;
const R = 0.16, R2 = R * R;
const x = p.x[i], y = p.y[i];
let wsum = 0;
const nb = this._nb || (this._nb = { idx: new Int32Array(64), w: new Float32Array(64), n: 0 });
nb.n = 0;
sim.grid.query(x, y, R, (j) => {
if (j === i || nb.n >= 64) return;
const dx = p.x[j] - x, dy = p.y[j] - y;
const d2 = dx * dx + dy * dy;
if (d2 >= R2) return;
let w = 1 - Math.sqrt(d2) / R;
if (p.phase[j] !== GAS) w *= 1.5;
nb.idx[nb.n] = j; nb.w[nb.n] = w; nb.n++;
wsum += w;
});
const share = wsum > 0 ? 0.6 : 0;
p.temp[i] += (heat * (1 - share)) / p.rhoCp[i];
if (share > 0) {
const k = (heat * share) / wsum;
for (let a = 0; a < nb.n; a++) {
const j = nb.idx[a];
p.temp[j] += (k * nb.w[a]) / p.rhoCp[j];
if (p.sleep[j]) p.sleep[j] = 0;
}
}
}
}
function maxFlamSlot(sim, i) {
const sp = sim.species, off = i * MAX_SPECIES;
let best = 0, bf = -1;
for (let s = 0; s < sp.count; s++) {
const v = sim.p.comp[off + s] * sp.flam[s];
if (v > bf) { bf = v; best = s; }
}
return best;
}
return { ReactionSystem };
})();
// src/simulation/tools.js
const __m32 = (() => {
const { PHASE, SIM } = __m17;
const { MAX_SPECIES } = __m13;
const { LIQUID, POWDER, PASTE, SOLID, GAS } = PHASE;
const TOOL_SPECS = {
spoon: { core: SIM.SPOON_CORE, reach: SIM.SPOON_RADIUS, entrain: [0.2, 0.09, 0.3, 0.035, 0.12], drag: 0.55 },
pestle: { core: SIM.PESTLE_RADIUS, reach: 0.26, entrain: [0.12, 0.12, 0.2, 0.08, 0.06], drag: 0.35 },
skimmer: { core: 0.08, reach: 0.24, entrain: [0.05, 0.05, 0.05, 0.02, 0.05], drag: 0.2 },
};
class ToolState {
constructor() {
this.type = 'spoon';
this.active = false;
this.tx = 0; this.ty = 1.5;
this.x = 0; this.y = 1.5;
this.x0 = 0; this.y0 = 1.5;
this.fsx = 0; this.fsy = 1.5;
this.vx = 0; this.vy = 0;
this.auto = false;
this.autoPhase = 0;
this.autoCenterX = 0;
this.autoCenterY = 2.2;
this.autoRadius = 0.9;
this.speed = 0;
this.skimmed = /** @type {Record<string, number>} */ ({});
this._skimAcc = 0;
this.stirDistance = 0;
}
setTarget(x, y, active) {
this.tx = x;
this.ty = y;
if (active && !this.active) {
this.x = x; this.y = y; this.x0 = x; this.y0 = y; this.fsx = x; this.fsy = y;
}
this.active = active;
}
beginFrame() {
this.fsx = this.x;
this.fsy = this.y;
}
substep(k, n) {
if (this.auto && this.type === 'spoon') {
this.active = true;
this.autoPhase += SIM.DT * 2.1;
this.tx = this.autoCenterX + Math.cos(this.autoPhase) * this.autoRadius;
this.ty = this.autoCenterY + Math.sin(this.autoPhase) * this.autoRadius * 0.45;
this.fsx = this.x; this.fsy = this.y;
k = 0; n = 1;
}
const t = (k + 1) / n;
this.x0 = this.x;
this.y0 = this.y;
this.x = this.fsx + (this.tx - this.fsx) * t;
this.y = this.fsy + (this.ty - this.fsy) * t;
let vx = (this.x - this.x0) / SIM.DT, vy = (this.y - this.y0) / SIM.DT;
const s = Math.hypot(vx, vy);
const vmax = 5.5;
if (s > vmax) { vx *= vmax / s; vy *= vmax / s; }
this.vx = vx; this.vy = vy;
this.speed = Math.min(vmax, s);
if (this.active) this.stirDistance += Math.hypot(this.x - this.x0, this.y - this.y0);
}
endFrame() {}
}
function clampToInterior(sim, x, y, r) {
const c = sim.cauldron;
for (let it = 0; it < 3; it++) {
const d = c.sample(x, y);
if (d <= -r) break;
x -= c.nx * (d + r);
y -= c.ny * (d + r);
}
if (c.lidClosed && y < r) y = r;
return [x, y];
}
function toolForces(sim, dt) {
const t = sim.tool;
if (!t.active || t.type === 'none') return;
const spec = TOOL_SPECS[t.type];
const p = sim.p, n = p.count;
const R = spec.reach, R2 = R * R;
const sf = Math.min(1, t.speed / 0.35);
for (let i = 0; i < n; i++) {
const dx = p.x[i] - t.x, dy = p.y[i] - t.y;
const d2 = dx * dx + dy * dy;
if (d2 >= R2) continue;
p.sleep[i] = 0;
if (sf <= 0) continue;
const f = 1 - Math.sqrt(d2) / R;
const k = spec.entrain[p.phase[i]] * f * f * sf;
p.vx[i] += (t.vx - p.vx[i]) * k;
p.vy[i] += (t.vy - p.vy[i]) * k;
}
if (t.type === 'skimmer') skim(sim, dt);
}
function toolConstraints(sim, dt) {
const t = sim.tool;
if (!t.active || t.type === 'none') return;
const spec = TOOL_SPECS[t.type];
const p = sim.p, n = p.count;
const ax = t.x0, ay = t.y0, bx = t.x, by = t.y;
const ex = bx - ax, ey = by - ay;
const el2 = ex * ex + ey * ey;
const rr = spec.core + SIM.RADIUS * 0.9;
const pestle = t.type === 'pestle';
const mvx = ex, mvy = ey;
const minX = Math.min(ax, bx) - rr, maxX = Math.max(ax, bx) + rr;
const minY = Math.min(ay, by) - rr, maxY = Math.max(ay, by) + rr;
for (let i = 0; i < n; i++) {
const x = p.x[i], y = p.y[i];
if (x < minX || x > maxX || y < minY || y > maxY) continue;
let s = el2 > 1e-12 ? ((x - ax) * ex + (y - ay) * ey) / el2 : 1;
if (s < 0) s = 0; else if (s > 1) s = 1;
const cx = ax + ex * s, cy = ay + ey * s;
const dx = x - cx, dy = y - cy;
const d2 = dx * dx + dy * dy;
if (d2 >= rr * rr) continue;
let d = Math.sqrt(d2);
let nx, ny;
if (d < 1e-6) {
const ml = Math.hypot(mvx, mvy) || 1;
nx = mvx / ml; ny = mvy / ml; d = 0;
} else { nx = dx / d; ny = dy / d; }
const pen = rr - d;
const ph = p.phase[i];
if (ph === GAS) {
p.x[i] += nx * pen; p.y[i] += ny * pen;
continue;
}
p.x[i] += nx * pen;
p.y[i] += ny * pen;
const tn = mvx * nx + mvy * ny;
const tx = mvx - tn * nx, ty = mvy - tn * ny;
const drag = ph === PASTE ? spec.drag * 1.3 : ph === POWDER ? spec.drag * 0.8 : spec.drag;
p.x[i] += tx * drag;
p.y[i] += ty * drag;
if (pestle && (ph === SOLID || ph === POWDER)) crush(sim, i, pen, t.speed, dt);
}
}
function crush(sim, i, pen, speed, dt) {
const p = sim.p;
if (p.phase[i] !== SOLID) return;
const hard = 0.25 + p.hardness[i] * 1.5;
sim.dmg[i] += (pen * 40 + speed * 1.2) * dt * 3;
if (sim.dmg[i] < hard) return;
sim.dmg[i] = 0;
const g = p.group[i];
if (g >= 0) sim.rigid.markDirty(g);
p.group[i] = -1;
p.phase[i] = POWDER;
p.sleep[i] = 0;
p.dirty[i] = 1;
p.vx[i] += (sim.rand() - 0.5) * 0.8;
p.vy[i] -= sim.rand() * 0.6;
sim.emit({ type: 'crush', x: p.x[i], y: p.y[i] });
sim.grid.query(p.x[i], p.y[i], 0.14, (j) => {
if (p.phase[j] === SOLID && p.group[j] === g) sim.dmg[j] += hard * 0.35;
});
}
function skim(sim, dt) {
const t = sim.tool, p = sim.p;
t._skimAcc += dt * 45;
if (t._skimAcc < 1) return;
const R2 = 0.22 * 0.22;
const victims = [];
for (let i = 0; i < p.count && victims.length < t._skimAcc; i++) {
if (p.phase[i] === SOLID) continue;
const dx = p.x[i] - t.x, dy = p.y[i] - t.y;
if (dx * dx + dy * dy < R2) victims.push(i);
}
t._skimAcc -= Math.max(1, victims.length);
if (t._skimAcc < 0) t._skimAcc = 0;
victims.sort((a, b) => b - a);
const sp = sim.species;
for (const i of victims) {
for (let s = 0; s < sp.count; s++) {
const f = p.comp[i * MAX_SPECIES + s];
if (f > 0 && sp.defs[s]) t.skimmed[sp.defs[s].id] = (t.skimmed[sp.defs[s].id] || 0) + f;
}
sim.removeParticle(i);
}
if (victims.length) sim.emit({ type: 'skim', count: victims.length, x: t.x, y: t.y });
}
return { TOOL_SPECS, ToolState, clampToInterior, toolForces, toolConstraints, LIQUID };
})();
// src/simulation/emitter.js
const __m33 = (() => {
const { PHASE, SIM, formPhase } = __m17;
const { COLUMN } = __m25;
class Emitter {
constructor(sim) {
this.sim = sim;
this.active = null;
this.acc = 0;
this.chunkTimer = 0;
this.blocked = 0;
this.poured = /** @type {Record<string, number>} */ ({});
}
start(def, opts = {}) {
this.active = {
def,
x: opts.x ?? 0,
rate: opts.rate ?? (def.form === 'powder' ? 55 : def.form === 'gas' ? 30 : 75),
remaining: opts.amount ?? Infinity,
temp: opts.temp,
spawned: 0,
};
this.acc = 0;
this.blocked = 0;
this.chunkTimer = 0;
}
setX(x) {
if (this.active) this.active.x = x;
}
stop() {
if (this.active && this.active.spawned > 0) {
this.sim.emit({ type: 'pourEnd', id: this.active.def.id, amount: this.active.spawned });
}
this.active = null;
}
get pouring() {
return !!this.active;
}
spawnY() {
return this.sim.cauldron.lidClosed ? 0.1 : -COLUMN * 0.55;
}
_free(x, y, r) {
const p = this.sim.p, r2 = r * r;
for (let i = 0; i < p.count; i++) {
const dx = p.x[i] - x, dy = p.y[i] - y;
if (dx * dx + dy * dy < r2) return false;
}
return true;
}
step(dt) {
const a = this.active;
if (!a) return;
const sim = this.sim;
if (a.remaining <= 0) {
this.stop();
return;
}
if (sim.p.count >= sim.maxParticles) {
this.blocked += dt;
if (this.blocked > 0.5) {
sim.emit({ type: 'full' });
this.stop();
}
return;
}
const mouth = sim.cauldron.mouth;
const form = a.def.form;
if (form === 'solid') {
this.chunkTimer -= dt;
if (this.chunkTimer > 0) return;
this.chunkTimer = 0.32;
const size = Math.min(a.remaining, a.remaining >= 12 ? 12 : 7);
if (this._spawnChunk(a, size)) {
a.remaining -= size;
a.spawned += size;
this.poured[a.def.id] = (this.poured[a.def.id] || 0) + size;
}
return;
}
this.acc += a.rate * dt;
let guard = 4;
while (this.acc >= 1 && a.remaining > 0 && guard-- > 0) {
const spread = form === 'powder' ? 0.09 : form === 'gas' ? 0.3 : 0.16;
const x = Math.max(-mouth + 0.12, Math.min(mouth - 0.12, a.x + (sim.rand() - 0.5) * spread));
const y = this.spawnY() + (sim.rand() - 0.5) * 0.04;
if (!this._free(x, y, 0.078)) {
this.blocked += dt;
break;
}
const ph = formPhase(form);
const i = sim.addParticle(a.def, x, y, ph, a.temp);
if (i < 0) break;
const p = sim.p;
p.vx[i] = (sim.rand() - 0.5) * (form === 'powder' ? 0.35 : 0.15);
p.vy[i] = form === 'gas' ? 0.2 : sim.cauldron.lidClosed ? 1.4 : 2.2;
a.remaining--;
a.spawned++;
this.acc -= 1;
this.blocked = 0;
this.poured[a.def.id] = (this.poured[a.def.id] || 0) + 1;
}
if (this.acc > 3) this.acc = 3;
}
_spawnChunk(a, size) {
const sim = this.sim;
const offs = [[0, 0]];
const s = SIM.SPACING;
for (let k = 0; k < 6; k++) offs.push([Math.cos((k * Math.PI) / 3) * s, Math.sin((k * Math.PI) / 3) * s]);
if (size > 7) {
for (let k = 0; k < 6; k++) offs.push([Math.cos((k * Math.PI) / 3 + Math.PI / 6) * s * 1.732, Math.sin((k * Math.PI) / 3 + Math.PI / 6) * s * 1.732]);
}
offs.length = Math.min(offs.length, size);
const mouth = sim.cauldron.mouth;
const cx = Math.max(-mouth + 0.3, Math.min(mouth - 0.3, a.x + (sim.rand() - 0.5) * 0.3));
const cy = this.spawnY() + 0.12;
const ang = sim.rand() * Math.PI * 2;
const ca = Math.cos(ang), sa = Math.sin(ang);
const pts = offs.map(([ox, oy]) => [cx + ca * ox - sa * oy, cy + sa * ox + ca * oy]);
for (const [x, y] of pts) if (!this._free(x, y, 0.085)) return false;
const g = sim.rigid.alloc();
if (g < 0) return false;
const idx = [];
for (const [x, y] of pts) {
const i = sim.addParticle(a.def, x, y, PHASE.SOLID, a.temp);
if (i < 0) break;
sim.p.group[i] = g;
sim.p.vy[i] = 1.2;
idx.push(i);
}
sim.rigid.setRest(idx);
sim.rigid.markDirty(g);
return idx.length > 0;
}
}
return { Emitter };
})();
// src/simulation/world.js
const __m22 = (() => {
const { PHASE, SIM, TUNE, formPhase } = __m17;
const { Particles } = __m23;
const { NeighborGrid } = __m24;
const { Cauldron, COLUMN } = __m25;
const { SpeciesTable, MAX_SPECIES } = __m13;
const { refreshParticle } = __m26;
const { RigidBodies } = __m27;
const { thermalStep } = __m28;
const { phaseStep, classifyFluid } = __m29;
const { diffusionStep } = __m30;
const { ReactionSystem } = __m31;
const { ToolState, toolForces, toolConstraints } = __m32;
const { Emitter } = __m33;
const { LIQUID, POWDER, PASTE, SOLID, GAS } = PHASE;
const MODE = Object.freeze({ PBF: 0, GRAN: 1, COH: 2, RIGID: 3, GAS: 4 });
const M_PBF = 0, M_GRAN = 1, M_COH = 2, M_RIGID = 3, M_GAS = 4;
const H = SIM.H;
const H2 = H * H;
const R = SIM.RADIUS;
const D = 2 * R;
const POLY6 = 4 / (Math.PI * Math.pow(H, 8));
const SPIKY = 30 / (Math.PI * Math.pow(H, 5));
const SLEEP_STEPS = 50;
const SLEEP_V = 0.09;
const MASS_SCALE = 1.4;
const VISC_COH = 150;
const LN_VISC_COH = Math.log(VISC_COH);
const COH_REACH = 1.3 * D;
const W = (r2) => {
const t = H2 - r2;
return t > 0 ? POLY6 * t * t * t : 0;
};
function restDensity(spacing) {
let n = 0;
for (let a = -5; a <= 5; a++) {
for (let b = -5; b <= 5; b++) {
const x = (a + b * 0.5) * spacing;
const y = b * spacing * Math.sqrt(3) * 0.5;
n += W(x * x + y * y);
}
}
return n;
}
class Simulation {
constructor(opts = {}) {
this.cauldron = new Cauldron(opts.size || 'small');
const cap = opts.capacity || this.cauldron.capacity + 400;
this.capacity = cap;
this.maxParticles = this.cauldron.capacity;
this.p = new Particles(cap);
this.species = new SpeciesTable();
this.lookup = opts.lookup || (() => undefined);
const c = this.cauldron;
this.grid = new NeighborGrid(c.minX, c.minY, c.maxX, c.maxY, H + 0.02, cap);
const f32 = () => new Float32Array(cap);
this.colR = f32();
this.colG = f32();
this.colB = f32();
this.dens = f32();
this.lambda = f32();
this.gradX = f32();
this.gradY = f32();
this.sumG2 = f32();
this.tmpA = f32();
this.tmpB = f32();
this.tmpC = f32();
this.tmpD = f32();
this.dmg = f32();
this.compChange = f32();
this.envRho = f32();
this.immersion = f32();
this.fw = f32();
this.fric = f32();
this.coh = f32();
this.damp = f32();
this.pbf = f32();
this.mode = new Uint8Array(cap);
this.nCond = new Uint8Array(cap);
this.nGas = new Uint8Array(cap);
this.touchWall = new Uint8Array(cap);
this.rhoRef = 1;
this.n0 = restDensity(SIM.SPACING);
this.n0Gas = this.n0 * 0.32;
this._wallFlow = null;
this._pairCap = 0;
/** @type {Int32Array} */ this.actK = null;
/** @type {Float32Array} */ this.actGm = null;
/** @type {Float32Array} */ this.actUx = null;
/** @type {Float32Array} */ this.actUy = null;
/** @type {Float32Array} */ this.actSc = null;
/** @type {Int32Array} */ this.cK = null;
this.cN = 0;
this.rigid = new RigidBodies(this);
this.tool = new ToolState();
this.emitter = new Emitter(this);
this.reactions = new ReactionSystem(this, opts.reactions || []);
this.furnace = { setting: 0, maxFlame: 340, heatPower: 3.5, minCool: 4, coolPower: 6 };
this.oxygen = 1;
this.events = [];
this.time = 0;
this.steps = 0;
this.accumulator = 0;
this.energyIn = 0;
this.energyOut = 0;
this.vented = /** @type {Record<string, number>} */ ({});
this._rng = 12345;
this.stats = { stepMs: 0, steps: 0, pairs: 0, awake: 0 };
this.paused = false;
}
rand() {
this._rng = (Math.imul(this._rng, 1664525) + 1013904223) >>> 0;
return this._rng / 4294967296;
}
emit(e) {
if (this.events.length < 400) this.events.push(e);
}
get count() {
return this.p.count;
}
slotFor(def) {
return this.species.ensure(def, this.lookup);
}
addParticle(def, x, y, phase, temp) {
const slot = this.slotFor(def);
if (slot < 0) return -1;
if (this.p.count >= this.maxParticles) return -1;
const ph = phase !== undefined ? phase : formPhase(def.form);
const i = this.p.add(x, y, ph, temp !== undefined ? temp : def.storeTemp ?? SIM.AMBIENT);
if (i < 0) return -1;
this.p.comp[i * MAX_SPECIES + slot] = 1;
refreshParticle(this, i);
this.envRho[i] = this.p.rho[i];
this.immersion[i] = 0;
return i;
}
removeParticle(i) {
const p = this.p;
this.wakeAround(p.x[i], p.y[i], 0.3);
if (p.group[i] >= 0) this.rigid.markDirty(p.group[i]);
p.remove(i);
const last = p.count;
if (i !== last) {
for (const arr of [this.colR, this.colG, this.colB, this.dmg, this.dens, this.compChange, this.envRho, this.immersion, this.fric, this.coh, this.damp, this.pbf]) arr[i] = arr[last];
for (const arr of [this.touchWall, this.nCond, this.nGas, this.mode]) arr[i] = arr[last];
}
}
wakeAround(x, y, r) {
const p = this.p, r2 = r * r;
for (let k = 0; k < p.count; k++) {
const dx = p.x[k] - x, dy = p.y[k] - y;
if (dx * dx + dy * dy < r2) p.sleep[k] = 0;
}
}
isAsleep(i) {
return this.p.sleep[i] >= SLEEP_STEPS;
}
inventory() {
const p = this.p, sp = this.species, S = MAX_SPECIES;
const tot = new Float64Array(S);
for (let i = 0; i < p.count; i++) for (let s = 0; s < sp.count; s++) tot[s] += p.comp[i * S + s];
const out = {};
for (let s = 0; s < sp.count; s++) if (sp.defs[s] && tot[s] > 1e-6) out[sp.defs[s].id] = tot[s];
return out;
}
totalMass() {
const p = this.p, sp = this.species, S = MAX_SPECIES;
let m = 0;
for (let i = 0; i < p.count; i++) for (let s = 0; s < sp.count; s++) m += p.comp[i * S + s] * sp.density[s];
return m;
}
totalEnergy() {
const p = this.p;
let e = 0;
for (let i = 0; i < p.count; i++) e += p.rhoCp[i] * p.temp[i] + p.lat[i] + p.eph[i];
const c = this.cauldron;
for (let k = 0; k < c.cellT.length; k++) e += c.cellC[k] * c.cellT[k];
return e;
}
advance(frameDt, speed = 1, maxSteps = 6) {
if (this.paused) return 0;
this.accumulator += Math.min(frameDt, 0.1) * speed;
let n = Math.floor(this.accumulator / SIM.DT);
if (n > maxSteps) {
n = maxSteps;
this.accumulator = 0;
} else {
this.accumulator -= n * SIM.DT;
}
const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
this.tool.beginFrame();
for (let k = 0; k < n; k++) {
this.tool.substep(k, n);
this.step();
}
if (n > 0 && typeof performance !== 'undefined') {
const ms = (performance.now() - t0) / n;
this.stats.stepMs = this.stats.stepMs * 0.9 + ms * 0.1;
}
this.stats.steps = n;
return n;
}
step() {
const dt = SIM.DT;
const p = this.p;
this.time += dt;
this.steps++;
this.emitter.step(dt);
this._refreshDerived();
this._computeModes();
this._applyForces(dt);
toolForces(this, dt);
this._predict(dt);
this.stats.pairs = this.grid.buildPairs(p.x, p.y, p.count, H + 0.012);
this.rigid.update();
this._buildContactList();
for (let it = 0; it < TUNE.iterations; it++) {
this._fluidConstraints(it);
this._contacts();
toolConstraints(this, dt);
this._boundary();
this.rigid.shapeMatch();
}
this._updateVelocities(dt);
this._viscosity();
this._viscousSmoothing();
this._sleepUpdate();
this._percolate();
if (this.steps % 2 === 0) {
const dt2 = dt * 2;
thermalStep(this, dt2);
diffusionStep(this, dt2);
this.reactions.step(dt2);
phaseStep(this, dt2);
this._oxygen(dt2);
}
this._vent();
}
_refreshDerived() {
const p = this.p, n = p.count;
const chunk = Math.max(48, Math.ceil(n / 12));
const start = (this.steps * chunk) % Math.max(1, n);
for (let k = 0; k < chunk && k < n; k++) p.dirty[(start + k) % n] = 1;
for (let i = 0; i < n; i++) {
if (!p.dirty[i]) continue;
const before = p.phase[i];
refreshParticle(this, i);
if (p.phase[i] !== GAS && p.phase[i] !== SOLID) classifyFluid(this, i);
if (p.phase[i] !== before) p.sleep[i] = 0;
}
}
_computeModes() {
const p = this.p, n = p.count;
const mode = this.mode, fric = this.fric, coh = this.coh, damp = this.damp, pbf = this.pbf;
for (let i = 0; i < n; i++) {
const ph = p.phase[i];
pbf[i] = 0;
if (ph === GAS) { mode[i] = M_GAS; continue; }
if (ph === SOLID) { mode[i] = M_RIGID; fric[i] = 0.45; coh[i] = 0; damp[i] = 0; continue; }
if (ph === POWDER) {
mode[i] = M_GRAN;
const g = p.gran[i];
const wet = g < 0.97 && g > 0.5 ? Math.min(1, (0.97 - g) * 5) : 0; // damp grains clump
fric[i] = p.friction[i] + wet * 0.25;
coh[i] = wet * 0.3;
damp[i] = wet * 0.1;
continue;
}
if (ph === PASTE) {
mode[i] = M_COH;
const s = Math.max(0, Math.min(1, (p.gran[i] - 0.34) / 0.42));
const b = p.binder[i];
fric[i] = 0.22 + 0.85 * s * (0.45 + 0.55 * b);
coh[i] = 0.1 + 0.3 * s * (0.4 + 0.6 * b);
damp[i] = 0.12 + 0.2 * s;
continue;
}
if (p.lnMu[i] >= LN_VISC_COH) {
mode[i] = M_COH;
const l10 = p.lnMu[i] / Math.LN10;
fric[i] = 0;
coh[i] = 0.05;
damp[i] = Math.max(0.02, Math.min(TUNE.viscDampMax, (l10 - 2.1) * TUNE.viscDampSlope));
pbf[i] = TUNE.viscPressure;
} else {
mode[i] = M_PBF;
fric[i] = 0; coh[i] = 0; damp[i] = 0;
pbf[i] = 1;
}
}
}
_applyForces(dt) {
const p = this.p, n = p.count;
const g = SIM.GRAVITY;
const nCond = this.nCond;
const buoy = TUNE.buoyancy;
for (let i = 0; i < n; i++) {
if (p.sleep[i] >= SLEEP_STEPS) {
p.vx[i] = 0;
p.vy[i] = 0;
continue;
}
if (p.phase[i] === GAS) {
const rhoG = (p.gasRho[i] * 293) / (p.temp[i] + 273);
let ay = (g * 0.22 * (rhoG - 1)) / Math.max(0.4, rhoG);
if (nCond[i] >= 3) ay = -g * 1.6;
p.vy[i] += ay * dt;
const jit = 0.066 * Math.sqrt(Math.max(30, p.temp[i] + 273) / 373);
p.vx[i] += (this.rand() - 0.5) * jit;
p.vy[i] += (this.rand() - 0.5) * jit;
const drag = Math.exp(-2.6 * dt);
p.vx[i] *= drag;
p.vy[i] *= drag;
} else {
const b = (this.immersion[i] * (p.rho[i] - this.rhoRef)) / this.rhoRef;
p.vy[i] += g * Math.max(0.3, 1 + b * buoy) * dt;
}
}
}
_predict(dt) {
const p = this.p, n = p.count;
const vmax = SIM.MAX_SPEED;
for (let i = 0; i < n; i++) {
p.px[i] = p.x[i];
p.py[i] = p.y[i];
if (p.sleep[i] >= SLEEP_STEPS) continue;
let vx = p.vx[i], vy = p.vy[i];
const sp2 = vx * vx + vy * vy;
if (sp2 > vmax * vmax) {
const s = vmax / Math.sqrt(sp2);
vx *= s; vy *= s;
p.vx[i] = vx; p.vy[i] = vy;
}
p.x[i] += vx * dt;
p.y[i] += vy * dt;
}
}
_invm(i) {
if (this.p.sleep[i] >= SLEEP_STEPS) return 0;
if (this.p.phase[i] === GAS) return 1;
const r = this.p.rho[i];
return TUNE.massPow === 2 ? 1 / (r * r) : Math.pow(r, -TUNE.massPow);
}
_fluidConstraints(iter) {
const p = this.p, n = p.count;
const { pairI, pairJ, pairCount } = this.grid;
const dens = this.dens, gx = this.gradX, gy = this.gradY, s2 = this.sumG2, lam = this.lambda;
const nCond = this.nCond, nGas = this.nGas;
const xs = p.x, ys = p.y, mode = this.mode, pbf = this.pbf;
const W0 = POLY6 * H2 * H2 * H2;
const n0 = this.n0, n0g = this.n0Gas;
const fw = this.fw;
const sleep = p.sleep, phase = p.phase, rho = p.rho, mp = TUNE.massPow;
for (let i = 0; i < n; i++) {
const r = rho[i];
fw[i] = sleep[i] >= SLEEP_STEPS ? 0 : phase[i] === GAS ? 1 : mp === 2 ? 1 / (r * r) : Math.pow(r, -mp);
dens[i] = W0;
gx[i] = 0; gy[i] = 0; s2[i] = 0;
if (iter === 0) { nCond[i] = 0; nGas[i] = 0; }
}
if (this._pairCap !== this.grid.pairCap) {
this._pairCap = this.grid.pairCap;
this.actK = new Int32Array(this._pairCap);
this.actGm = new Float32Array(this._pairCap);
this.actUx = new Float32Array(this._pairCap);
this.actUy = new Float32Array(this._pairCap);
this.actSc = new Float32Array(this._pairCap);
}
const actK = this.actK, actGm = this.actGm, actUx = this.actUx, actUy = this.actUy, actSc = this.actSc;
const kCorr = TUNE.kCorr;
const Wdq = W(0.3 * H * (0.3 * H));
let na = 0;
for (let k = 0; k < pairCount; k++) {
const i = pairI[k], j = pairJ[k];
const dx = xs[i] - xs[j], dy = ys[i] - ys[j];
const r2 = dx * dx + dy * dy;
if (r2 >= H2 || r2 < 1e-12) continue;
const mi = mode[i], mj = mode[j];
const gi = mi === M_GAS, gj = mj === M_GAS;
if (iter === 0) {
if (gi && !gj) nCond[i]++;
else if (gj && !gi) nCond[j]++;
else if (gi && gj) { nGas[i]++; nGas[j]++; }
else { nCond[i]++; nCond[j]++; }
}
if (gi !== gj) continue;
const fi = gi || pbf[i] > 0;
const fj = gj || pbf[j] > 0;
if (!fi && !fj) continue;
const r = Math.sqrt(r2);
const t = H2 - r2;
const w = POLY6 * t * t * t;
const hr = H - r;
const gm = (SPIKY * hr * hr) / (gi ? n0g : n0); // |∇W| / n0
const ux = dx / r, uy = dy / r;
if (fi) {
dens[i] += w;
gx[i] -= gm * ux; gy[i] -= gm * uy;
s2[i] += fw[j] * gm * gm;
}
if (fj) {
dens[j] += w;
gx[j] += gm * ux; gy[j] += gm * uy;
s2[j] += fw[i] * gm * gm;
}
actK[na] = k;
actGm[na] = gm;
actUx[na] = ux;
actUy[na] = uy;
if (!gi && fi && fj) {
const q = w / Wdq;
actSc[na] = kCorr * q * q * q * q; // artificial pressure (anti-clumping)
} else actSc[na] = 0;
na++;
}
const cohL = TUNE.cohesionLiquid, eps = TUNE.epsilon;
for (let i = 0; i < n; i++) {
const m = mode[i];
if (pbf[i] > 0) {
let C = dens[i] / n0 - 1;
if (C < 0) C *= cohL; // mild surface tension
const den = fw[i] * (gx[i] * gx[i] + gy[i] * gy[i]) + s2[i] + eps;
lam[i] = (-C / den) * pbf[i];
} else if (m === M_GAS) {
let C = dens[i] / n0g - 1;
if (C < 0) C = 0;
const den = fw[i] * (gx[i] * gx[i] + gy[i] * gy[i]) + s2[i] + 40;
lam[i] = (-C / den) * 0.25;
} else {
lam[i] = 0;
}
}
const mc = TUNE.maxCorr;
for (let a = 0; a < na; a++) {
const k = actK[a];
const i = pairI[k], j = pairJ[k];
let s = lam[i] + lam[j] - actSc[a];
if (s === 0) continue;
if (s > 0 && (pbf[i] === 0 || pbf[j] === 0) && mode[i] !== M_GAS) s = 0;
const mag = -s * actGm[a];
const ux = actUx[a], uy = actUy[a];
let di = mag * fw[i], dj = mag * fw[j];
if (di > mc) di = mc; else if (di < -mc) di = -mc;
if (dj > mc) dj = mc; else if (dj < -mc) dj = -mc;
xs[i] += ux * di; ys[i] += uy * di;
xs[j] -= ux * dj; ys[j] -= uy * dj;
}
}
_buildContactList() {
const p = this.p;
const { pairI, pairJ, pairCount } = this.grid;
if (!this.cK || this.cK.length < pairCount) this.cK = new Int32Array(this.grid.pairCap);
const mode = this.mode, xs = p.x, ys = p.y, grp = p.group;
let nc = 0;
const lim2 = (COH_REACH + 0.01) * (COH_REACH + 0.01);
for (let k = 0; k < pairCount; k++) {
const i = pairI[k], j = pairJ[k];
const mi = mode[i], mj = mode[j];
if (mi === M_PBF && mj === M_PBF) continue;
if (mi === M_GAS && mj === M_GAS) continue;
if (mi === M_RIGID && mj === M_RIGID && grp[i] === grp[j] && grp[i] >= 0) continue;
const dx = xs[j] - xs[i], dy = ys[j] - ys[i];
if (dx * dx + dy * dy > lim2) continue;
this.cK[nc++] = k;
}
this.cN = nc;
}
_contacts() {
const p = this.p;
const { pairI, pairJ } = this.grid;
const cK = this.cK, cN = this.cN;
const xs = p.x, ys = p.y, pxs = p.px, pys = p.py;
const mode = this.mode, fric = this.fric, coh = this.coh, damp = this.damp;
const sleep = p.sleep;
for (let a = 0; a < cN; a++) {
const k = cK[a];
const i = pairI[k], j = pairJ[k];
const mi = mode[i], mj = mode[j];
const gi = mi === M_GAS, gj = mj === M_GAS;
const solidI = mi === M_GRAN || mi === M_COH || mi === M_RIGID;
const solidJ = mj === M_GRAN || mj === M_COH || mj === M_RIGID;
const both = solidI && solidJ;
const pbf = this.pbf;
if (pbf[i] > 0 && pbf[j] > 0) {
const dp = Math.max(damp[i], damp[j]);
if (dp <= 0) continue;
const dx = xs[j] - xs[i], dy = ys[j] - ys[i];
const d2 = dx * dx + dy * dy;
if (d2 >= COH_REACH * COH_REACH) continue;
const imi = sleep[i] >= SLEEP_STEPS ? 0 : p.invMass[i];
const imj = sleep[j] >= SLEEP_STEPS ? 0 : p.invMass[j];
const nm = imi + imj;
if (nm <= 0) continue;
const rx = (xs[i] - pxs[i]) - (xs[j] - pxs[j]);
const ry = (ys[i] - pys[i]) - (ys[j] - pys[j]);
const f = dp * (1 - Math.sqrt(d2) / COH_REACH);
xs[i] -= rx * f * (imi / nm); ys[i] -= ry * f * (imi / nm);
xs[j] += rx * f * (imj / nm); ys[j] += ry * f * (imj / nm);
continue;
}
let dmin;
if (both) dmin = D;
else if (gi || gj) dmin = 0.082;
else dmin = 0.09;
const dx = xs[j] - xs[i], dy = ys[j] - ys[i];
const d2 = dx * dx + dy * dy;
if (d2 < 1e-12) continue;
let cp = 0;
if (both) {
cp = Math.min(coh[i], coh[j]);
if (cp === 0 && (mi === M_COH || mj === M_COH)) cp = 0.5 * Math.max(coh[i], coh[j]);
}
const reach = cp > 0 ? COH_REACH : dmin;
if (d2 >= reach * reach) continue;
const d = Math.sqrt(d2);
const nx = dx / d, ny = dy / d;
const aslI = sleep[i] >= SLEEP_STEPS, aslJ = sleep[j] >= SLEEP_STEPS;
let imi = aslI ? 0 : p.invMass[i];
let imj = aslJ ? 0 : p.invMass[j];
if (both) {
imi *= Math.exp(-MASS_SCALE * ys[i]);
imj *= Math.exp(-MASS_SCALE * ys[j]);
}
const norm = imi + imj;
if (norm <= 0) continue;
const wi = imi / norm, wj = imj / norm;
if (d >= dmin) {
const pull = (d - dmin) * cp;
xs[i] += nx * pull * wi; ys[i] += ny * pull * wi;
xs[j] -= nx * pull * wj; ys[j] -= ny * pull * wj;
} else {
const C = dmin - d;
if (aslJ && !aslI && (C > 0.012 || Math.abs(p.vx[i]) + Math.abs(p.vy[i]) > 1.2)) sleep[j] = 0;
if (aslI && !aslJ && (C > 0.012 || Math.abs(p.vx[j]) + Math.abs(p.vy[j]) > 1.2)) sleep[i] = 0;
xs[i] -= nx * C * wi; ys[i] -= ny * C * wi;
xs[j] += nx * C * wj; ys[j] += ny * C * wj;
if (both) {
const mus = mi === M_RIGID || mj === M_RIGID ? 0.45 : mi === mj ? Math.min(fric[i], fric[j]) : 0.5 * (fric[i] + fric[j]);
if (mus > 0) {
const rx = (xs[i] - pxs[i]) - (xs[j] - pxs[j]);
const ry = (ys[i] - pys[i]) - (ys[j] - pys[j]);
const rn = rx * nx + ry * ny;
const tx = rx - rn * nx, ty = ry - rn * ny;
const tl = Math.sqrt(tx * tx + ty * ty);
if (tl > 1e-9) {
const f = tl < mus * C ? 1 : Math.min((mus * 0.78 * C) / tl, 1);
xs[i] -= tx * f * wi; ys[i] -= ty * f * wi;
xs[j] += tx * f * wj; ys[j] += ty * f * wj;
}
}
}
}
let dp = 0;
if (mi === M_COH || mj === M_COH) dp = Math.max(damp[i], damp[j]) * (both ? 1 : 0.5);
else if (both) dp = Math.min(damp[i], damp[j]);
if (dp > 0) {
const rx = (xs[i] - pxs[i]) - (xs[j] - pxs[j]);
const ry = (ys[i] - pys[i]) - (ys[j] - pys[j]);
const f = dp * (1 - Math.max(0, d - dmin) / (COH_REACH - dmin + 1e-6));
xs[i] -= rx * f * wi; ys[i] -= ry * f * wi;
xs[j] += rx * f * wj; ys[j] += ry * f * wj;
}
}
}
_boundary() {
const p = this.p, n = p.count, c = this.cauldron;
const xs = p.x, ys = p.y, pxs = p.px, pys = p.py;
const mode = this.mode;
const lidClosed = c.lidClosed;
const tw = this.touchWall;
for (let i = 0; i < n; i++) {
if (p.sleep[i] >= SLEEP_STEPS) continue;
let x = xs[i], y = ys[i];
tw[i] = 0;
if (c.roughDist(x, y) < -0.12 && y > 0.12) continue; // far from every wall and the lid
const m = mode[i];
const r = m === M_GAS ? 0.045 : R;
const d = c.sample(x, y);
if (d > -r) {
const pen = d + r;
const nx = c.nx, ny = c.ny;
x -= nx * pen;
y -= ny * pen;
tw[i] = 1;
const rx = x - pxs[i], ry = y - pys[i];
const rn = rx * nx + ry * ny;
const tx = rx - rn * nx, ty = ry - rn * ny;
const tl = Math.sqrt(tx * tx + ty * ty);
if (tl > 1e-9) {
let f = 0;
if (m === M_GRAN || m === M_COH) {
const mus = Math.max(0.1, this.fric[i] * 0.85);
f = tl < mus * pen ? 1 : Math.min((mus * 0.75 * pen) / tl, 1);
if (m === M_COH) f = Math.max(f, this.damp[i]);
} else if (m === M_RIGID) {
f = tl < 0.4 * pen ? 1 : Math.min((0.3 * pen) / tl, 1);
} else if (m === M_PBF) {
f = Math.min(0.5, 0.012 * Math.max(0, p.lnMu[i] - 2.3));
}
x -= tx * f;
y -= ty * f;
}
} else if (d > -r - 0.02) {
tw[i] = 1;
}
if (lidClosed && y < r && Math.abs(x) <= c.mouth + 0.05) {
y = r; // lid underside
tw[i] = 2;
if (m !== M_GAS && m !== M_PBF) x -= (x - pxs[i]) * 0.5;
} else if (y < -COLUMN + r) {
y = -COLUMN + r;
}
xs[i] = x;
ys[i] = y;
}
}
_updateVelocities(dt) {
const p = this.p, n = p.count;
const inv = 1 / dt;
const vmax = SIM.MAX_SPEED;
for (let i = 0; i < n; i++) {
if (p.sleep[i] >= SLEEP_STEPS) {
p.x[i] = p.px[i];
p.y[i] = p.py[i];
p.vx[i] = 0; p.vy[i] = 0;
continue;
}
let vx = (p.x[i] - p.px[i]) * inv;
let vy = (p.y[i] - p.py[i]) * inv;
const s2 = vx * vx + vy * vy;
if (s2 > vmax * vmax) {
const s = vmax / Math.sqrt(s2);
vx *= s; vy *= s;
}
p.vx[i] = vx;
p.vy[i] = vy;
}
}
_viscosity() {
const p = this.p, n = p.count;
const { pairI, pairJ, pairCount } = this.grid;
const xs = p.x, ys = p.y, vx = p.vx, vy = p.vy, mode = this.mode;
const sumW = this.tmpA, shear = this.lambda, envW = this.gradX, envR = this.gradY;
for (let i = 0; i < n; i++) { sumW[i] = 0; shear[i] = 0; envW[i] = 0; envR[i] = 0; }
const LN10 = Math.LN10;
const vb = TUNE.viscBase, vs = TUNE.viscSlope;
for (let k = 0; k < pairCount; k++) {
const i = pairI[k], j = pairJ[k];
const mi = mode[i], mj = mode[j];
if (mi === M_GAS || mj === M_GAS) continue;
const dx = xs[i] - xs[j], dy = ys[i] - ys[j];
const r2 = dx * dx + dy * dy;
if (r2 >= H2) continue;
const w = 1 - Math.sqrt(r2) / H;
const dvx = vx[j] - vx[i], dvy = vy[j] - vy[i];
const dvl = Math.abs(dvx) + Math.abs(dvy);
shear[i] += dvl * w; shear[j] += dvl * w;
sumW[i] += w; sumW[j] += w;
const fi = mi === M_PBF || mi === M_COH, fj = mj === M_PBF || mj === M_COH;
if (fj) { envW[i] += w; envR[i] += w * p.rho[j]; }
if (fi) { envW[j] += w; envR[j] += w * p.rho[i]; }
let c;
if (mi === M_PBF && mj === M_PBF) {
const lnMu = 0.5 * (p.lnMu[i] + p.lnMu[j]);
c = vb + vs * Math.max(0, lnMu / LN10);
if (c > 0.6) c = 0.6;
} else if (mi === M_PBF || mj === M_PBF) {
const lnMu = mi === M_PBF ? p.lnMu[i] : p.lnMu[j];
c = 0.08 + 0.07 * Math.max(0, lnMu / LN10);
if (dvl > 1.4) { wakeIfAsleep(p, i); wakeIfAsleep(p, j); }
} else continue;
const kk = (c * w) / 4.2;
const ri = p.rho[i], rj = p.rho[j];
const sm = 2 / (ri + rj);
const ai = p.sleep[i] >= SLEEP_STEPS ? 0 : kk * rj * sm;
const aj = p.sleep[j] >= SLEEP_STEPS ? 0 : kk * ri * sm;
vx[i] += dvx * ai; vy[i] += dvy * ai;
vx[j] -= dvx * aj; vy[j] -= dvy * aj;
}
let refW = 0, refR = 0;
for (let i = 0; i < n; i++) {
const sw = sumW[i];
p.agit[i] = p.agit[i] * 0.92 + (sw > 0 ? shear[i] / sw : 0) * 0.08;
const ew = envW[i];
if (ew > 0.05) {
this.envRho[i] = envR[i] / ew;
this.immersion[i] = Math.min(1, ew / 2.5);
refW += this.immersion[i];
refR += this.immersion[i] * p.rho[i];
} else {
this.envRho[i] = p.rho[i];
this.immersion[i] = 0;
}
}
if (refW > 1) this.rhoRef = refR / refW;
}
_viscousSmoothing() {
const p = this.p, n = p.count;
const { pairI, pairJ, pairCount } = this.grid;
const mode = this.mode, xs = p.x, ys = p.y;
const alpha = this.tmpA, sx = this.tmpB, sy = this.tmpC, sw = this.tmpD;
let any = false;
for (let i = 0; i < n; i++) {
alpha[i] = mode[i] === M_COH ? Math.min(0.9, this.damp[i] * 2.5) : 0;
if (alpha[i] > 0) any = true;
}
if (!any) return;
const vx = p.vx, vy = p.vy;
const tw = this.touchWall;
for (let sweep = 0; sweep < 2; sweep++) {
for (let i = 0; i < n; i++) { sx[i] = 0; sy[i] = 0; sw[i] = 0; }
for (let k = 0; k < pairCount; k++) {
const i = pairI[k], j = pairJ[k];
if (alpha[i] === 0 && alpha[j] === 0) continue;
if (mode[i] === M_GAS || mode[j] === M_GAS) continue;
const dx = xs[i] - xs[j], dy = ys[i] - ys[j];
const r2 = dx * dx + dy * dy;
if (r2 >= H2) continue;
const w = 1 - Math.sqrt(r2) / H;
sx[i] += vx[j] * w; sy[i] += vy[j] * w; sw[i] += w;
sx[j] += vx[i] * w; sy[j] += vy[i] * w; sw[j] += w;
}
for (let i = 0; i < n; i++) {
const a = alpha[i];
if (a === 0) continue;
let Wt = sw[i];
if (tw[i]) Wt += 1.2; // no-slip iron wall
if (Wt <= 0) continue;
vx[i] += (sx[i] / Wt - vx[i]) * a;
vy[i] += (sy[i] / Wt - vy[i]) * a;
}
}
}
_percolate() {
const p = this.p, n = p.count, mode = this.mode, nCond = this.nCond;
const R = 0.085, R2 = R * R;
for (let i = 0; i < n; i++) {
if (mode[i] !== M_GAS || nCond[i] < 3 || this.rand() > 0.2) continue;
const x = p.x[i], y = p.y[i];
let best = -1, by = y - 0.015;
this.grid.query(x, y, R, (j) => {
const mj = mode[j];
if (mj !== M_COH && mj !== M_GRAN) return;
if (p.y[j] >= by) return;
const dx = p.x[j] - x, dy = p.y[j] - y;
if (dx * dx + dy * dy > R2 || Math.abs(dx) > 0.6 * -dy + 0.02) return;
best = j; by = p.y[j];
});
if (best < 0) continue;
const j = best;
p.x[i] = p.x[j]; p.y[i] = p.y[j];
p.x[j] = x; p.y[j] = y;
p.sleep[j] = 0;
}
}
_sleepUpdate() {
const p = this.p, n = p.count;
const check = this.steps % 30 === 0;
const mode = this.mode;
for (let i = 0; i < n; i++) {
const m = mode[i];
const canSleep = m === M_GRAN || (m === M_COH && this.fric[i] > 0.35);
if (!canSleep) { p.sleep[i] = 0; continue; }
if (p.sleep[i] >= SLEEP_STEPS) {
if (check && !this._supported(i)) p.sleep[i] = 0;
continue;
}
const v2 = p.vx[i] * p.vx[i] + p.vy[i] * p.vy[i];
if (v2 < SLEEP_V * SLEEP_V && this.nCond[i] >= 2) p.sleep[i]++;
else p.sleep[i] = 0;
}
}
_supported(i) {
const p = this.p;
if (this.touchWall[i]) return true;
const x = p.x[i], y = p.y[i];
let below = 0;
this.grid.query(x, y, 0.12, (j) => {
if (j === i || p.phase[j] === GAS) return;
const dx = p.x[j] - x, dy = p.y[j] - y;
if (dy > 0.025 && dx * dx + dy * dy < 0.0135) below++;
});
return below > 0;
}
_oxygen(dt) {
const c = this.cauldron;
const rate = c.lidClosed ? 0.004 : 0.6;
this.oxygen += (1 - this.oxygen) * Math.min(1, rate * dt);
}
_vent() {
const p = this.p, c = this.cauldron;
if (c.lidClosed) return;
for (let i = p.count - 1; i >= 0; i--) {
if (p.phase[i] === GAS && p.y[i] < -COLUMN + 0.12) {
const sp = this.species;
for (let s = 0; s < sp.count; s++) {
const f = p.comp[i * MAX_SPECIES + s];
if (f > 0 && sp.defs[s]) this.vented[sp.defs[s].id] = (this.vented[sp.defs[s].id] || 0) + f;
}
this.removeParticle(i);
}
}
}
compactSpecies() {
const p = this.p, sp = this.species, S = MAX_SPECIES;
for (let s = 0; s < sp.count; s++) {
if (!sp.defs[s]) continue;
let used = false;
for (let i = 0; i < p.count && !used; i++) if (p.comp[i * S + s] > 1e-7) used = true;
if (!used && !this.reactions.needsSlot(sp.defs[s].id)) sp.release(s);
}
}
clear() {
this.p.count = 0;
this.rigid.reset();
this.emitter.stop();
for (let s = 0; s < MAX_SPECIES; s++) if (this.species.defs[s]) this.species.release(s);
this.vented = {};
}
}
function wakeIfAsleep(p, i) {
if (p.sleep[i] >= SLEEP_STEPS) p.sleep[i] = 0;
}
return { MODE, SLEEP_STEPS, Simulation, formPhase };
})();
// src/simulation/snapshot.js
const __m34 = (() => {
const { MAX_SPECIES } = __m13;
const { refreshParticle } = __m26;
const { Simulation } = __m22;
const F32_FIELDS = ['x', 'y', 'vx', 'vy', 'temp', 'lat', 'eph', 'restX', 'restY', 'agit', 'burn', 'wet'];
const SNAPSHOT_VERSION = 1;
function toBase64(view) {
const bytes = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
let bin = '';
const CH = 0x8000;
for (let i = 0; i < bytes.length; i += CH) bin += String.fromCharCode.apply(null, /** @type {any} */ (bytes.subarray(i, i + CH)));
return btoa(bin);
}
function fromBase64(b64) {
const bin = atob(b64);
const out = new Uint8Array(bin.length);
for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
return out;
}
function snapshotSim(sim, sizeKey) {
const p = sim.p, n = p.count;
const f = new Float32Array(n * F32_FIELDS.length);
F32_FIELDS.forEach((name, k) => {
const src = /** @type {Float32Array} */ (/** @type {any} */ (p)[name]);
for (let i = 0; i < n; i++) f[k * n + i] = src[i];
});
const S = MAX_SPECIES;
const used = sim.species.count;
const comp = new Float32Array(n * used);
for (let i = 0; i < n; i++) for (let s = 0; s < used; s++) comp[i * used + s] = p.comp[i * S + s];
const c = sim.cauldron;
return {
v: SNAPSHOT_VERSION,
size: sizeKey,
n,
used,
time: sim.time,
lid: c.lidClosed,
furnace: { ...sim.furnace },
oxygen: sim.oxygen,
rng: sim._rng,
species: sim.species.defs.slice(0, used).map((d) => (d ? d.id : null)),
f32: toBase64(f),
comp: toBase64(comp),
group: toBase64(p.group.slice(0, n)),
phase: toBase64(p.phase.slice(0, n)),
seed: toBase64(p.seed.slice(0, n)),
walls: Array.from(c.cellT, (t) => Math.round(t * 100) / 100),
vented: { ...sim.vented },
progress: { ...sim.reactions.progress },
};
}
function restoreSim(snap, env) {
const sim = new Simulation({ size: snap.size, lookup: env.lookup, reactions: env.reactions || [] });
applySnapshot(sim, snap, env);
return sim;
}
function applySnapshot(sim, snap, env) {
sim.clear();
const used = snap.used;
const slotMap = new Int32Array(used).fill(-1);
snap.species.forEach((id, s) => {
if (!id) return;
const def = env.lookup(id);
if (def) slotMap[s] = sim.species.assign(s, def, env.lookup);
});
const n = Math.min(snap.n, sim.capacity);
const fb = fromBase64(snap.f32);
const f = new Float32Array(fb.buffer, fb.byteOffset, fb.byteLength / 4);
const cb = fromBase64(snap.comp);
const comp = new Float32Array(cb.buffer, cb.byteOffset, cb.byteLength / 4);
const gb = fromBase64(snap.group);
const group = new Int32Array(gb.buffer, gb.byteOffset, gb.byteLength / 4);
const phase = fromBase64(snap.phase);
const sb = fromBase64(snap.seed);
const seed = new Uint32Array(sb.buffer, sb.byteOffset, sb.byteLength / 4);
const p = sim.p;
const S = MAX_SPECIES;
p.count = n;
for (let i = 0; i < n; i++) {
F32_FIELDS.forEach((name, k) => {
/** @type {any} */ (p)[name][i] = f[k * snap.n + i];
});
p.px[i] = p.x[i];
p.py[i] = p.y[i];
p.group[i] = group[i];
p.phase[i] = phase[i];
p.seed[i] = seed[i];
p.sleep[i] = 0;
p.comp.fill(0, i * S, (i + 1) * S);
for (let s = 0; s < used; s++) {
const v = comp[i * used + s];
if (v > 0 && slotMap[s] >= 0) p.comp[i * S + slotMap[s]] += v;
}
refreshParticle(sim, i);
sim.envRho[i] = p.rho[i];
}
const c = sim.cauldron;
c.lidClosed = snap.lid;
if (Array.isArray(snap.walls) && snap.walls.length === c.cellT.length) c.cellT.set(snap.walls);
Object.assign(sim.furnace, snap.furnace || {});
sim.oxygen = snap.oxygen ?? 1;
if (snap.rng) sim._rng = snap.rng;
sim.time = snap.time || 0;
sim.vented = { ...(snap.vented || {}) };
sim.reactions.progress = { ...(snap.progress || {}) };
for (let i = 0; i < n; i++) if (p.group[i] >= 0) sim.rigid.used[p.group[i]] = 1;
}
return { SNAPSHOT_VERSION, toBase64, fromBase64, snapshotSim, restoreSim, applySnapshot };
})();
// src/rendering/art.js
const __m36 = (() => {
const { Rng } = __m6;
const PAL = {
night0: '#0d0a10', night1: '#17121c', night2: '#221a28',
stone0: '#2c2632', stone1: '#3a3341', stone2: '#4a4252', stone3: '#5d5465', stone4: '#73697b', mortar: '#241e29',
wood0: '#24160f', wood1: '#3a2416', wood2: '#52321d', wood3: '#6d4527', wood4: '#8b5a31', wood5: '#a9743f',
iron0: '#121014', iron1: '#1e1b22', iron2: '#2c2831', iron3: '#3d3844', iron4: '#545060', iron5: '#716c7c',
copper0: '#4a2416', copper1: '#7a3c1f', copper2: '#a8582a', copper3: '#d27f3e', brass: '#e8b45c', brassHi: '#ffe39a',
fire0: '#7a1f0c', fire1: '#c2410f', fire2: '#ff7a1c', fire3: '#ffb444', fire4: '#ffe58a', fire5: '#fffbe0',
frost0: '#2a4f7a', frost1: '#4c86c4', frost2: '#8fc7f2', frost3: '#dff4ff',
parch0: '#8f7651', parch1: '#c2a678', parch2: '#e6d3a5', parch3: '#f6ead0',
leaf0: '#1f3318', leaf1: '#335224', leaf2: '#4f7a31', leaf3: '#7da447',
glass: '#9fd4e8', glassHi: '#e9fbff', candle: '#efe2c4', magic: '#8c6cff', magicHi: '#c9b7ff',
};
function hex2rgb(hex) {
const v = parseInt(hex.slice(1), 16);
return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}
function rgbStr(c, scale = 1) {
const m = c[0] <= 1 && c[1] <= 1 && c[2] <= 1 ? 255 : 1;
return `rgb(${Math.round(Math.min(255, c[0] * m * scale))},${Math.round(Math.min(255, c[1] * m * scale))},${Math.round(Math.min(255, c[2] * m * scale))})`;
}
function mixHex(a, b, t) {
const A = hex2rgb(a), B = hex2rgb(b);
return `rgb(${Math.round(A[0] + (B[0] - A[0]) * t)},${Math.round(A[1] + (B[1] - A[1]) * t)},${Math.round(A[2] + (B[2] - A[2]) * t)})`;
}
function R(ctx, x, y, w, h, c) {
ctx.fillStyle = c;
ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
}
function paintBackground(ctx, W, H, L) {
const rng = new Rng('backdrop');
R(ctx, 0, 0, W, H, PAL.stone1);
const bh = Math.max(4, Math.round(L.scale * 0.17));
const bw = bh * 2 + 2;
for (let y = 0, row = 0; y < L.floorY; y += bh, row++) {
const off = row % 2 ? Math.round(bw / 2) : 0;
for (let x = -off; x < W; x += bw) {
const shade = rng.next();
const c = shade < 0.15 ? PAL.stone0 : shade < 0.55 ? PAL.stone1 : shade < 0.9 ? PAL.stone2 : PAL.stone3;
R(ctx, x + 1, y + 1, bw - 1, bh - 1, c);
R(ctx, x + 1, y + 1, bw - 2, 1, mixHex(c === PAL.stone0 ? PAL.stone0 : PAL.stone2, PAL.stone4, 0.35));
if (rng.chance(0.25)) R(ctx, x + 2 + rng.int(0, bw - 5), y + 2 + rng.int(0, Math.max(0, bh - 4)), 1, 1, PAL.stone0);
}
R(ctx, 0, y, W, 1, PAL.mortar);
}
const g = ctx.createRadialGradient(L.cx, L.floorY * 0.75, L.scale * 1.5, L.cx, L.floorY * 0.6, Math.max(W, H) * 0.85);
g.addColorStop(0, 'rgba(0,0,0,0)');
g.addColorStop(1, 'rgba(6,4,10,0.62)');
ctx.fillStyle = g;
ctx.fillRect(0, 0, W, H);
const beamH = Math.max(5, Math.round(L.scale * 0.22));
R(ctx, 0, Math.round(L.scale * 0.15), W, beamH, PAL.wood1);
R(ctx, 0, Math.round(L.scale * 0.15), W, 1, PAL.wood3);
R(ctx, 0, Math.round(L.scale * 0.15) + beamH - 1, W, 1, PAL.wood0);
for (let x = 6; x < W; x += Math.round(L.scale * 1.7)) {
R(ctx, x, Math.round(L.scale * 0.15) + 2, 2, 2, PAL.iron3);
}
const side = (W - L.scale * 6) / 2;
if (side > L.scale * 0.6 || W > H) {
const ww = Math.round(L.scale * 0.95), wh = Math.round(L.scale * 1.25);
const wx = Math.round(Math.max(4, L.cx - L.scale * 3.8 - ww / 2)), wy = Math.round(L.scale * 0.65);
R(ctx, wx - 2, wy - 2, ww + 4, wh + 4, PAL.wood1);
const sky = ctx.createLinearGradient(0, wy, 0, wy + wh);
sky.addColorStop(0, '#1c2350');
sky.addColorStop(1, '#3a3166');
ctx.fillStyle = sky;
ctx.fillRect(wx, wy, ww, wh);
for (let k = 0; k < 9; k++) R(ctx, wx + rng.int(1, ww - 2), wy + rng.int(1, wh - 2), 1, 1, '#d8d6ff');
const mr = Math.max(2, Math.round(ww * 0.17));
ctx.fillStyle = '#f2ecc8';
ctx.beginPath();
ctx.arc(wx + ww * 0.68, wy + wh * 0.28, mr, 0, Math.PI * 2);
ctx.fill();
R(ctx, wx + ww / 2 - 1, wy, 2, wh, PAL.wood2);
R(ctx, wx, wy + wh / 2 - 1, ww, 2, PAL.wood2);
R(ctx, wx - 3, wy + wh + 2, ww + 6, 3, PAL.wood3);
}
const shelfY = [Math.round(L.scale * 1.05), Math.round(L.scale * 2.15)];
const shelfSpan = Math.round(L.scale * 1.55);
const sides = W > L.scale * 6.2 ? [L.cx + L.scale * 3.0, L.cx - L.scale * 3.0 - shelfSpan] : [W - shelfSpan - 2, 2];
let jarIndex = 0;
for (const sx0 of sides) {
const sx = Math.round(sx0);
if (sx + shelfSpan < 0 || sx > W) continue;
for (const sy of shelfY) {
R(ctx, sx + 2, sy, 2, 4, PAL.iron3);
R(ctx, sx + shelfSpan - 4, sy, 2, 4, PAL.iron3);
R(ctx, sx, sy - 2, shelfSpan, 3, PAL.wood3);
R(ctx, sx, sy - 2, shelfSpan, 1, PAL.wood5);
R(ctx, sx, sy + 1, shelfSpan, 1, PAL.wood0);
let x = sx + 3;
while (x < sx + shelfSpan - 6) {
const kind = rng.next();
if (kind < 0.62 && L.jars.length) {
const jar = L.jars[jarIndex++ % L.jars.length];
const jw = Math.max(4, Math.round(L.scale * (0.16 + rng.next() * 0.06)));
const jh = Math.max(6, Math.round(L.scale * (0.22 + rng.next() * 0.12)));
drawJar(ctx, x, sy - 2 - jh, jw, jh, jar.color, jar.form);
x += jw + 2;
} else if (kind < 0.85) {
const n = rng.int(2, 4);
for (let b = 0; b < n; b++) {
const bh2 = Math.round(L.scale * (0.24 + rng.next() * 0.08));
const c = rng.pick([PAL.copper1, PAL.leaf1, PAL.frost0, PAL.wood2, '#5a2340']);
R(ctx, x, sy - 2 - bh2, 3, bh2, c);
R(ctx, x, sy - 2 - bh2 + 2, 3, 1, PAL.brass);
x += 3;
}
x += 2;
} else {
const mw = Math.round(L.scale * 0.2);
R(ctx, x, sy - 2 - mw * 0.6, mw, mw * 0.6, PAL.stone3);
R(ctx, x + 1, sy - 2 - mw * 0.6, mw - 2, 1, PAL.stone4);
x += mw + 3;
}
}
}
}
for (let k = 0; k < 6; k++) {
const hx = Math.round((k + 0.5) * (W / 6) + rng.range(-8, 8));
if (Math.abs(hx - L.cx) < L.scale * 1.6) continue;
const top = Math.round(L.scale * 0.15) + beamH;
const len = Math.round(L.scale * rng.range(0.35, 0.6));
R(ctx, hx, top, 1, 3, PAL.parch0);
for (let y = 0; y < len; y++) {
const wdt = Math.max(1, Math.round((1 - Math.abs(y / len - 0.45)) * 4));
R(ctx, hx - Math.floor(wdt / 2), top + 3 + y, wdt, 1, y % 3 === 0 ? PAL.leaf3 : y % 2 ? PAL.leaf1 : PAL.leaf2);
}
}
R(ctx, 0, L.floorY, W, H - L.floorY, PAL.wood1);
const ph = Math.max(3, Math.round(L.scale * 0.12));
for (let y = L.floorY; y < H; y += ph) {
R(ctx, 0, y, W, 1, PAL.wood0);
for (let x = rng.int(0, 30); x < W; x += rng.int(18, 40)) R(ctx, x, y, 1, ph, PAL.wood0);
}
R(ctx, 0, L.floorY, W, 2, PAL.wood3);
}
function drawJar(ctx, x, y, w, h, color, form) {
const c = color;
const glass = form === 'powder' || form === 'solid' ? PAL.parch1 : PAL.glass;
R(ctx, x, y + 2, w, h - 2, 'rgba(160,210,230,0.18)');
const fill = form === 'gas' ? 0.5 : 0.72;
const fy = y + 2 + Math.round((h - 2) * (1 - fill));
R(ctx, x, fy, w, y + h - fy, rgbStr(c));
R(ctx, x, fy, w, 1, rgbStr(c, 1.35));
if (form === 'powder') for (let k = 0; k < w; k += 2) R(ctx, x + k, fy + 1 + (k % 3), 1, 1, rgbStr(c, 0.7));
R(ctx, x, y + 2, 1, h - 2, 'rgba(255,255,255,0.35)');
R(ctx, x + w - 1, y + 2, 1, h - 2, 'rgba(0,0,0,0.35)');
R(ctx, x, y + h - 1, w, 1, 'rgba(0,0,0,0.4)');
R(ctx, x + 1, y, w - 2, 2, form === 'powder' || form === 'solid' ? PAL.wood4 : PAL.wood5);
R(ctx, x + 1, y + Math.round(h * 0.45), w - 2, Math.max(1, Math.round(h * 0.18)), glass);
}
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
function renderCauldron(c, v) {
const s = v.scale;
const wall = 0.16, rim = 0.28;
const x0 = Math.floor(v.ox + (-c.belly - 0.6) * s), x1 = Math.ceil(v.ox + (c.belly + 0.6) * s);
const y0 = Math.floor(v.oy + -0.25 * s), y1 = Math.ceil(v.oy + (c.depth + 0.75) * s);
const w = x1 - x0, h = y1 - y0;
const cv = makeCanvas(w, h);
const ctx = cv.getContext('2d');
const img = ctx.createImageData(w, h);
const d = img.data;
const iron = [PAL.iron0, PAL.iron1, PAL.iron2, PAL.iron3, PAL.iron4, PAL.iron5].map(hex2rgb);
const rng = new Rng('cauldron');
const wallPix = [];
for (let py = 0; py < h; py++) {
const wy = (py + y0 + 0.5 - v.oy) / s;
for (let px = 0; px < w; px++) {
const wx = (px + x0 + 0.5 - v.ox) / s;
let dist = c.sample(wx, wy);
let isRim = false;
if (wy < 0.12 && wy > -0.12 && Math.abs(wx) < c.mouth + rim && Math.abs(wx) > c.mouth - 0.02) { isRim = true; }
if (wy < -0.02) continue;
if (dist <= 0 && wy >= 0 && !isRim) {
const depthT = Math.min(1, wy / c.depth);
const bayer = (BAYER4[(px & 3) + (py & 3) * 4] + 0.5) / 16;
const shade = 1.1 - depthT * 1.1 + Math.max(0, 0.6 + dist * 6);
const k2 = Math.max(0, Math.min(2, Math.floor(shade + bayer)));
const col2 = iron[k2];
const o2 = (py * w + px) * 4;
d[o2] = col2[0]; d[o2 + 1] = col2[1]; d[o2 + 2] = col2[2]; d[o2 + 3] = 255;
continue;
}
if (!(dist > 0 && dist < wall) && !isRim) continue;
const nx = c.nx, ny = c.ny;
let lum = 2.2 - nx * 1.4 - ny * 1.1;
lum += (rng.next() - 0.5) * 0.6; // hammered texture
if (isRim) lum = wy < -0.06 ? 4.3 : wy < 0.03 ? 3.4 : 1.8;
if (dist < 0.03 && !isRim) lum -= 0.8; // inner edge shadow
const k = Math.max(0, Math.min(5, Math.round(lum)));
const col = iron[k];
const o = (py * w + px) * 4;
d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2]; d[o + 3] = 255;
if (!isRim) {
const cell = c.wallCellAt(Math.max(-c.belly, Math.min(c.belly, wx - nx * dist)), Math.min(c.depth, wy - ny * dist));
if (cell >= 0) wallPix.push(px, py, cell);
}
}
}
ctx.putImageData(img, 0, 0);
const legW = Math.max(3, Math.round(0.18 * s));
for (const lx of [-c.belly * 0.62, c.belly * 0.62]) {
const px = Math.round(v.ox + lx * s - x0 - legW / 2);
const top = Math.round(v.oy + (c.depth - 0.45) * s - y0);
const bot = Math.round(v.oy + (c.depth + 0.7) * s - y0);
R(ctx, px, top, legW, bot - top, PAL.iron2);
R(ctx, px, top, 1, bot - top, PAL.iron4);
R(ctx, px - 1, bot - 2, legW + 2, 2, PAL.iron3);
}
const hy = Math.round(v.oy + 0.55 * s - y0);
for (const sgn of [-1, 1]) {
const hx = Math.round(v.ox + sgn * (c.halfWidth(0.55) + wall + 0.06) * s - x0);
ctx.strokeStyle = PAL.iron4;
ctx.lineWidth = Math.max(1, Math.round(s * 0.035));
ctx.beginPath();
ctx.arc(hx, hy, Math.max(3, Math.round(s * 0.13)), 0, Math.PI * 2);
ctx.stroke();
}
return { canvas: cv, x: x0, y: y0, wallPix };
}
function makeCanvas(w, h) {
const cv = document.createElement('canvas');
cv.width = Math.max(1, w);
cv.height = Math.max(1, h);
const ctx = cv.getContext('2d');
ctx.imageSmoothingEnabled = false;
return cv;
}
function paintHearth(ctx, c, v) {
const s = v.scale;
const left = Math.round(v.ox - (c.belly + 0.55) * s), right = Math.round(v.ox + (c.belly + 0.55) * s);
const top = Math.round(v.oy + (c.depth + 0.55) * s), bot = Math.round(v.oy + (c.depth + 1.0) * s);
const rng = new Rng('hearth');
const sw = Math.max(5, Math.round(s * 0.32)), sh = Math.max(3, Math.round(s * 0.16));
for (let y = top, row = 0; y < bot; y += sh, row++) {
for (let x = left - (row % 2 ? sw / 2 : 0); x < right; x += sw) {
const c0 = rng.pick([PAL.stone2, PAL.stone3, PAL.stone2, PAL.stone4]);
R(ctx, x + 1, y + 1, sw - 1, sh - 1, c0);
R(ctx, x + 1, y + 1, sw - 2, 1, PAL.stone4);
}
}
R(ctx, left, top, right - left, 1, PAL.stone4);
}
return { PAL, hex2rgb, rgbStr, mixHex, paintBackground, drawJar, renderCauldron, makeCanvas, paintHearth, rect: R };
})();
// src/rendering/fluid.js
const __m37 = (() => {
const { PHASE } = __m17;
const { LIQUID, POWDER, PASTE, SOLID, GAS } = PHASE;
function hash01(n) {
n = Math.imul(n ^ (n >>> 15), 0x2c1b3c6d);
n = Math.imul(n ^ (n >>> 12), 0x297a2d39);
n ^= n >>> 15;
return (n >>> 0) / 4294967296;
}
class FluidRenderer {
constructor() {
this.cap = 0;
this.w = 0;
this.h = 0;
this.canvas = null;
this.ctx = null;
this.image = null;
this.thermal = false;
}
_alloc(w, h) {
const n = w * h;
if (n > this.cap) {
this.cap = n;
this.wl = new Float32Array(n); // liquid weight
this.wb = new Float32Array(n); // smoothed liquid weight (surface shape)
this.wt = new Float32Array(n); // blur scratch
this.cr = new Float32Array(n);
this.cg = new Float32Array(n);
this.cb = new Float32Array(n);
this.op = new Float32Array(n); // opacity accum
this.pw = new Float32Array(n); // paste weight
this.tx = new Float32Array(n); // texture accum
this.gl = new Float32Array(n); // glow accum
this.ht = new Float32Array(n); // heat accum (temperature-weighted)
this.ws = new Float32Array(n); // solid weight
this.sr = new Float32Array(n);
this.sg = new Float32Array(n);
this.sb = new Float32Array(n);
this.wg = new Float32Array(n); // gas weight
this.gr = new Float32Array(n);
this.gg = new Float32Array(n);
this.gb = new Float32Array(n);
this.grain = new Uint32Array(n); // packed grain colour (0 = none)
}
if (w !== this.w || h !== this.h || !this.canvas) {
this.w = w;
this.h = h;
if (typeof OffscreenCanvas !== 'undefined') this.canvas = new OffscreenCanvas(w, h);
else {
this.canvas = document.createElement('canvas');
this.canvas.width = w;
this.canvas.height = h;
}
this.ctx = /** @type {any} */ (this.canvas).getContext('2d');
this.image = this.ctx.createImageData(w, h);
}
}
render(sim, view, time) {
const p = sim.p, n = p.count;
if (n === 0) return null;
const s = view.scale;
let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
for (let i = 0; i < n; i++) {
const x = p.x[i] * s + view.ox, y = p.y[i] * s + view.oy;
if (x < minX) minX = x; if (x > maxX) maxX = x;
if (y < minY) minY = y; if (y > maxY) maxY = y;
}
const pad = Math.ceil(0.16 * s) + 2;
const bx = Math.floor(minX) - pad, by = Math.floor(minY) - pad;
const w = Math.ceil(maxX) + pad - bx, h = Math.ceil(maxY) + pad - by;
if (w <= 0 || h <= 0 || w * h > 4e6) return null;
this._alloc(w, h);
const N = w * h;
const { wl, cr, cg, cb, op, pw, tx, gl, ht, ws, sr, sg, sb, wg, gr, gg, gb, grain } = this;
wl.fill(0, 0, N); cr.fill(0, 0, N); cg.fill(0, 0, N); cb.fill(0, 0, N); op.fill(0, 0, N);
pw.fill(0, 0, N); tx.fill(0, 0, N); gl.fill(0, 0, N); ht.fill(0, 0, N);
ws.fill(0, 0, N); sr.fill(0, 0, N); sg.fill(0, 0, N); sb.fill(0, 0, N);
wg.fill(0, 0, N); gr.fill(0, 0, N); gg.fill(0, 0, N); gb.fill(0, 0, N);
grain.fill(0, 0, N);
const rl = 0.092 * s; // liquid kernel radius (px), ~1.85 particle radii
const rs = 0.085 * s; // solid
const rgas = 0.23 * s; // gas (wide, soft kernel so packed vapour reads as fog)
const rgrain = Math.max(1.2, 0.05 * s * 1.02);
const RL = Math.ceil(rl), RS = Math.ceil(rs), RG = Math.ceil(rgas), RGR = Math.ceil(rgrain);
const colR = sim.colR, colG = sim.colG, colB = sim.colB;
const T = p.temp;
for (let i = 0; i < n; i++) {
const ph = p.phase[i];
const fx = p.x[i] * s + view.ox - bx, fy = p.y[i] * s + view.oy - by;
const r = colR[i], g = colG[i], b = colB[i];
const seed = p.seed[i];
if (ph === LIQUID || ph === PASTE) {
const isPaste = ph === PASTE ? 1 : 0;
const tex = hash01(seed) * 2 - 1;
const o = Math.max(0.35, p.opacity[i]);
const glow = p.glow[i] + p.burn[i];
const cx = fx | 0, cy = fy | 0;
const inv = 1 / (rl * rl);
for (let dy = -RL; dy <= RL; dy++) {
const yy = cy + dy;
if (yy < 0 || yy >= h) continue;
const ddy = yy + 0.5 - fy;
const row = yy * w;
for (let dx = -RL; dx <= RL; dx++) {
const xx = cx + dx;
if (xx < 0 || xx >= w) continue;
const ddx = xx + 0.5 - fx;
let q = 1 - (ddx * ddx + ddy * ddy) * inv;
if (q <= 0) continue;
q *= q;
const k = row + xx;
wl[k] += q; cr[k] += q * r; cg[k] += q * g; cb[k] += q * b;
op[k] += q * o; pw[k] += q * isPaste; tx[k] += q * tex; gl[k] += q * glow; ht[k] += q * T[i];
}
}
} else if (ph === POWDER) {
const frozen = p.gran[i] < 0.5;
const damp = !frozen && p.gran[i] < 0.96 ? Math.min(0.45, (0.97 - p.gran[i]) * 1.6) : 0;
const cx = Math.round(fx), cy = Math.round(fy);
for (let dy = -RGR; dy <= RGR; dy++) {
for (let dx = -RGR; dx <= RGR; dx++) {
if (dx * dx + dy * dy > rgrain * rgrain + 0.5) continue;
const xx = cx + dx, yy = cy + dy;
if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
const hv = hash01(seed + (dx + 7) * 31 + (dy + 7) * 977);
let lum = hv < 0.18 ? 0.62 : 0.84 + hv * 0.28;
if (frozen) lum = 0.95 + hv * 0.12;
lum *= 1 - damp;
if (p.burn[i] > 0.1) lum *= 1 + p.burn[i];
const R8 = clamp255(r * lum * 255), G8 = clamp255(g * lum * 255), B8 = clamp255(b * lum * 255);
grain[yy * w + xx] = 0xff000000 | (B8 << 16) | (G8 << 8) | R8;
}
}
if (p.glow[i] > 0.05 || p.burn[i] > 0.05) {
const k = Math.min(h - 1, Math.max(0, cy)) * w + Math.min(w - 1, Math.max(0, cx));
gl[k] += p.glow[i] + p.burn[i];
}
} else if (ph === SOLID) {
const cx = fx | 0, cy = fy | 0;
const inv = 1 / (rs * rs);
for (let dy = -RS; dy <= RS; dy++) {
const yy = cy + dy;
if (yy < 0 || yy >= h) continue;
const ddy = yy + 0.5 - fy;
for (let dx = -RS; dx <= RS; dx++) {
const xx = cx + dx;
if (xx < 0 || xx >= w) continue;
const ddx = xx + 0.5 - fx;
const q = 1 - (ddx * ddx + ddy * ddy) * inv;
if (q <= 0) continue;
const k = yy * w + xx;
ws[k] += q; sr[k] += q * r; sg[k] += q * g; sb[k] += q * b;
gl[k] += q * p.glow[i] * 0.5;
}
}
} else if (ph === GAS) {
const cx = fx | 0, cy = fy | 0;
const inv = 1 / (rgas * rgas);
const gr0 = r * 0.5 + 0.5, gg0 = g * 0.5 + 0.5, gb0 = b * 0.5 + 0.5;
for (let dy = -RG; dy <= RG; dy++) {
const yy = cy + dy;
if (yy < 0 || yy >= h) continue;
const ddy = yy + 0.5 - fy;
for (let dx = -RG; dx <= RG; dx++) {
const xx = cx + dx;
if (xx < 0 || xx >= w) continue;
const ddx = xx + 0.5 - fx;
let q = 1 - (ddx * ddx + ddy * ddy) * inv;
if (q <= 0) continue;
q *= q;
const k = yy * w + xx;
wg[k] += q; gr[k] += q * gr0; gg[k] += q * gg0; gb[k] += q * gb0;
}
}
}
}
const wb = this.wb, wt = this.wt;
for (let y = 0; y < h; y++) {
const row = y * w;
for (let x = 0; x < w; x++) {
const k = row + x;
const l = x > 0 ? wl[k - 1] : 0, r = x < w - 1 ? wl[k + 1] : 0;
const l2 = x > 1 ? wl[k - 2] : 0, r2 = x < w - 2 ? wl[k + 2] : 0;
const l3 = x > 2 ? wl[k - 3] : 0, r3 = x < w - 3 ? wl[k + 3] : 0;
wt[k] = (wl[k] * 4 + (l + r) * 3 + (l2 + r2) * 2 + (l3 + r3)) * (1 / 16);
}
}
for (let y = 0; y < h; y++) {
const row = y * w;
for (let x = 0; x < w; x++) {
const k = row + x;
const u = y > 0 ? wt[k - w] : 0, d = y < h - 1 ? wt[k + w] : 0;
wb[k] = (wt[k] * 2 + u + d) * 0.25;
}
}
const data = this.image.data;
const thr = 0.3; // liquid surface threshold
if (!this.surf || this.surf.length < w) this.surf = new Int32Array(w);
const surf = this.surf;
for (let x = 0; x < w; x++) {
let y = 0;
while (y < h && wb[y * w + x] <= thr) y++;
surf[x] = y;
}
const depthScale = 1 / Math.max(6, 0.9 * s);
const thermal = this.thermal;
const shimmer = Math.sin(time * 2.1);
for (let y = 0; y < h; y++) {
const row = y * w;
for (let x = 0; x < w; x++) {
const k = row + x;
let R = 0, G = 0, B = 0, A = 0;
const gp = grain[k];
if (gp) {
R = (gp & 255) / 255; G = ((gp >>> 8) & 255) / 255; B = ((gp >>> 16) & 255) / 255; A = 1;
}
const sw = ws[k];
if (sw > 0.45) {
const inv = 1 / sw;
let r = sr[k] * inv, g = sg[k] * inv, b = sb[k] * inv;
const up = y > 0 ? ws[k - w] : 0, left = x > 0 ? ws[k - 1] : 0, down = y < h - 1 ? ws[k + w] : 0, right = x < w - 1 ? ws[k + 1] : 0;
const edge = up < 0.45 || left < 0.45 || down < 0.45 || right < 0.45;
let l = 0.78 + 0.22 * Math.min(1, sw / 1.6);
r = r * 0.55 + 0.42; g = g * 0.55 + 0.45; b = b * 0.55 + 0.5;
if (edge) l = up < 0.45 || left < 0.45 ? 1.18 : 0.72;
else if (((x * 7 + y * 13) % 23) === 0) l = 1.12;
R = r * l; G = g * l; B = b * l; A = 0.96;
}
if (wb[k] > thr) {
let kc = k, lw = wl[k];
if (lw < 0.06) {
if (x > 0 && wl[k - 1] > lw) { kc = k - 1; lw = wl[kc]; }
if (x < w - 1 && wl[k + 1] > lw) { kc = k + 1; lw = wl[kc]; }
if (y < h - 1 && wl[k + w] > lw) { kc = k + w; lw = wl[kc]; }
if (y > 0 && wl[k - w] > lw) { kc = k - w; lw = wl[kc]; }
if (lw < 1e-4) continue;
}
const inv = 1 / lw;
let r = cr[kc] * inv, g = cg[kc] * inv, b = cb[kc] * inv;
const paste = pw[kc] * inv;
let a = Math.min(0.97, Math.max(0.84, op[kc] * inv + 0.1));
const tex = tx[kc] * inv;
const up = y > 0 ? wb[k - w] : 0;
const down = y < h - 1 ? wb[k + w] : 0;
let l = 1;
if (paste > 0.5) {
a = 1;
l = 0.9 + tex * 0.09;
if (up <= thr) l = 1.12;
else if (down <= thr || (x > 0 && wb[k - 1] <= thr) || (x < w - 1 && wb[k + 1] <= thr)) l = 0.7;
} else {
const clear = Math.max(0, 1 - op[kc] * inv);
const ct = clear * 0.45;
r = r * (1 - ct) + 0.42 * ct; g = g * (1 - ct) + 0.6 * ct; b = b * (1 - ct) + 0.82 * ct;
l = (0.98 + tex * 0.03) * (1 - clear * 0.55);
if (up <= thr) l = 1.28; // meniscus highlight
else if (y > 1 && wb[k - 2 * w] <= thr) l = 1.1;
const depth = (y - surf[x]) * depthScale;
l *= 1 - Math.min(0.42, depth * 0.16);
if (down <= thr) l *= 0.78;
}
const temp = ht[kc] * inv;
if (thermal) {
const tt = Math.max(0, Math.min(1, (temp + 20) / 140));
r = tt; g = 0.25 + 0.3 * (1 - Math.abs(tt - 0.5) * 2); b = 1 - tt;
a = 0.9;
} else if (temp > 70) {
const hh = Math.min(0.25, (temp - 70) / 400);
r += hh; g += hh * 0.3;
}
r *= l; g *= l; b *= l;
R = R * (1 - a) + r * a; G = G * (1 - a) + g * a; B = B * (1 - a) + b * a;
A = A + (1 - A) * a;
}
const gw = wg[k];
if (gw > 0.04) {
const inv = 1 / gw;
const a = 0.7 * (1 - Math.exp(-gw * 0.55)) * (0.9 + 0.1 * shimmer);
const r = gr[k] * inv, g = gg[k] * inv, b = gb[k] * inv;
R = R * (1 - a) + r * a; G = G * (1 - a) + g * a; B = B * (1 - a) + b * a;
A = A + (1 - A) * a;
}
const gv = gl[k];
if (gv > 0.02) {
const e = Math.min(0.6, gv * 0.25);
R += e; G += e * 0.85; B += e * 0.55;
A = Math.max(A, Math.min(0.8, e * 1.2));
}
const o = k * 4;
if (A <= 0.003) {
data[o + 3] = 0;
continue;
}
data[o] = clamp255(R * 255);
data[o + 1] = clamp255(G * 255);
data[o + 2] = clamp255(B * 255);
data[o + 3] = clamp255(A * 255);
}
}
this.ctx.putImageData(this.image, 0, 0);
return { canvas: this.canvas, x: bx, y: by };
}
}
function clamp255(v) {
return v < 0 ? 0 : v > 255 ? 255 : v | 0;
}
return { FluidRenderer };
})();
// src/rendering/effects.js
const __m38 = (() => {
const { PAL, hex2rgb } = __m36;
const MAX = 900;
const FIRE_RAMP = [PAL.fire5, PAL.fire4, PAL.fire3, PAL.fire2, PAL.fire1, PAL.fire0].map(hex2rgb);
class Effects {
constructor() {
this.x = new Float32Array(MAX);
this.y = new Float32Array(MAX);
this.vx = new Float32Array(MAX);
this.vy = new Float32Array(MAX);
this.life = new Float32Array(MAX);
this.maxLife = new Float32Array(MAX);
this.size = new Float32Array(MAX);
this.kind = new Uint8Array(MAX); // 0 flame,1 spark,2 steam,3 dust,4 sparkle,5 frost,6 splash,7 smoke
this.r = new Uint8Array(MAX);
this.g = new Uint8Array(MAX);
this.b = new Uint8Array(MAX);
this.n = 0;
this.seed = 1;
}
rand() {
this.seed = (Math.imul(this.seed, 1664525) + 1013904223) >>> 0;
return this.seed / 4294967296;
}
add(kind, x, y, vx, vy, life, size, rgb) {
if (this.n >= MAX) return;
const i = this.n++;
this.kind[i] = kind;
this.x[i] = x; this.y[i] = y; this.vx[i] = vx; this.vy[i] = vy;
this.life[i] = life; this.maxLife[i] = life; this.size[i] = size;
const c = rgb || [255, 255, 255];
this.r[i] = c[0]; this.g[i] = c[1]; this.b[i] = c[2];
}
fire(cx, cy, width, intensity, scale, dt) {
const count = intensity * 90 * dt * (scale / 50);
let k = count;
while (k > 0) {
if (k < 1 && this.rand() > k) break;
k -= 1;
const x = cx + (this.rand() - 0.5) * width;
const life = 0.25 + this.rand() * 0.45 * (0.6 + intensity * 0.6);
this.add(0, x, cy, (this.rand() - 0.5) * scale * 0.2, -scale * (0.5 + this.rand() * 0.9 * intensity), life, Math.max(1, scale * (0.04 + this.rand() * 0.05)));
}
if (this.rand() < intensity * dt * 6) this.add(1, cx + (this.rand() - 0.5) * width, cy, (this.rand() - 0.5) * scale * 0.5, -scale * (1 + this.rand()), 0.8, 1, hex2rgb(PAL.fire4));
}
frost(cx, cy, width, intensity, scale, dt) {
const count = intensity * 30 * dt;
if (this.rand() < count) {
this.add(5, cx + (this.rand() - 0.5) * width, cy + this.rand() * scale * 0.1, (this.rand() - 0.5) * scale * 0.15, -scale * 0.12 * this.rand(), 1.2 + this.rand(), 1, hex2rgb(PAL.frost3));
}
}
burst(kind, x, y, n, scale, rgb, speed = 1) {
for (let k = 0; k < n; k++) {
const a = this.rand() * Math.PI * 2;
const v = scale * (0.3 + this.rand() * 0.9) * speed;
this.add(kind, x, y, Math.cos(a) * v, Math.sin(a) * v - scale * 0.2, 0.4 + this.rand() * 0.6, kind === 4 ? 2 : 1, rgb);
}
}
update(dt) {
let j = 0;
for (let i = 0; i < this.n; i++) {
const life = this.life[i] - dt;
if (life <= 0) continue;
const k = this.kind[i];
let vx = this.vx[i], vy = this.vy[i];
if (k === 1 || k === 6 || k === 3) vy += 60 * dt; // gravity for sparks, splashes, dust
if (k === 2 || k === 7) { vy -= 8 * dt; vx *= 0.98; }
if (k === 0) { vx *= 0.94; }
if (k === 5) { vy += 2 * dt; }
this.x[j] = this.x[i] + vx * dt;
this.y[j] = this.y[i] + vy * dt;
this.vx[j] = vx; this.vy[j] = vy;
this.life[j] = life; this.maxLife[j] = this.maxLife[i];
this.size[j] = this.size[i]; this.kind[j] = k;
this.r[j] = this.r[i]; this.g[j] = this.g[i]; this.b[j] = this.b[i];
j++;
}
this.n = j;
}
draw(ctx) {
for (let i = 0; i < this.n; i++) {
const t = 1 - this.life[i] / this.maxLife[i];
const k = this.kind[i];
let r = this.r[i], g = this.g[i], b = this.b[i], a = 1;
let sz = this.size[i];
if (k === 0) {
const c = FIRE_RAMP[Math.min(FIRE_RAMP.length - 1, Math.floor(t * FIRE_RAMP.length))];
r = c[0]; g = c[1]; b = c[2];
sz = Math.max(1, sz * (1 - t * 0.7));
a = 1 - t * 0.4;
} else if (k === 2 || k === 7) {
a = 0.35 * (1 - t);
sz = sz * (1 + t * 2);
} else if (k === 4) {
a = 1 - t;
sz = (t < 0.5 ? 2 : 1);
} else {
a = 1 - t * t;
}
ctx.globalAlpha = a;
ctx.fillStyle = `rgb(${r},${g},${b})`;
const s = Math.max(1, Math.round(sz));
ctx.fillRect(Math.round(this.x[i] - s / 2), Math.round(this.y[i] - s / 2), s, s);
if (k === 4 && t < 0.5) {
ctx.fillRect(Math.round(this.x[i]) - 2, Math.round(this.y[i]), 5, 1);
ctx.fillRect(Math.round(this.x[i]), Math.round(this.y[i]) - 2, 1, 5);
}
}
ctx.globalAlpha = 1;
}
}
return { Effects };
})();
// src/rendering/renderer.js
const __m35 = (() => {
const { PAL, paintBackground, renderCauldron, paintHearth, makeCanvas, rgbStr, hex2rgb, drawJar, rect } = __m36;
const { FluidRenderer } = __m37;
const { Effects } = __m38;
const { COLUMN } = __m25;
const { PHASE } = __m17;
const VIEW_TOP = -1.25;
class Renderer {
constructor(canvas) {
this.canvas = canvas;
this.ctx = canvas.getContext('2d', { alpha: false });
this.fluid = new FluidRenderer();
this.fx = new Effects();
this.W = 0;
this.H = 0;
this.artPx = 1;
this.view = { scale: 50, ox: 0, oy: 0 };
this.bg = null;
this.cauldronArt = null;
this.heatCanvas = null;
this.frame = 0;
this.jars = [];
this.quality = 'high';
this._key = '';
}
resize(cssW, cssH, cauldron, jars, quality = 'high') {
const base = Math.min(cssW * 0.85, cssH);
let artPx = Math.max(1, Math.round(base / 380));
if (quality === 'low') artPx += 1;
const W = Math.max(64, Math.round(cssW / artPx));
const H = Math.max(64, Math.round(cssH / artPx));
const key = `${W}x${H}:${cauldron.spec.key}:${jars.length}:${quality}`;
this.cauldron = cauldron;
if (key === this._key) return;
this._key = key;
this.artPx = artPx;
this.quality = quality;
this.canvas.width = W;
this.canvas.height = H;
this.canvas.style.width = cssW + 'px';
this.canvas.style.height = cssH + 'px';
this.W = W;
this.H = H;
this.ctx = this.canvas.getContext('2d', { alpha: false });
this.ctx.imageSmoothingEnabled = false;
const c = cauldron;
const viewW = 2 * (c.belly + 0.55);
const viewTop = VIEW_TOP, viewBot = c.depth + 1.0;
const viewH = viewBot - viewTop;
const s = Math.min(W / viewW, H / viewH);
this.view = { scale: s, ox: Math.round(W / 2), oy: Math.round((H - viewH * s) / 2 - viewTop * s) };
this.jars = jars;
this.bg = makeCanvas(W, H);
const bctx = this.bg.getContext('2d');
bctx.imageSmoothingEnabled = false;
const floorY = Math.round(this.view.oy + (c.depth + 0.72) * s);
paintBackground(bctx, W, H, { cx: this.view.ox, floorY, scale: s, jars });
paintHearth(bctx, c, this.view);
this.cauldronArt = renderCauldron(c, this.view);
this.heatCanvas = makeCanvas(this.cauldronArt.canvas.width, this.cauldronArt.canvas.height);
this.heatCtx = this.heatCanvas.getContext('2d');
this.heatImg = this.heatCtx.createImageData(this.heatCanvas.width, this.heatCanvas.height);
}
toWorld(cssX, cssY) {
const X = cssX / this.artPx, Y = cssY / this.artPx;
return [(X - this.view.ox) / this.view.scale, (Y - this.view.oy) / this.view.scale];
}
toScreen(x, y) {
return [x * this.view.scale + this.view.ox, y * this.view.scale + this.view.oy];
}
render(st) {
const { ctx, view } = this;
const sim = st.sim;
const c = sim.cauldron;
const s = view.scale;
this.frame++;
ctx.drawImage(this.bg, 0, 0);
const setting = sim.furnace.setting;
const fireX = view.ox, fireY = Math.round(view.oy + (c.depth + 0.52) * s);
const fireW = c.belly * 1.15 * s;
rect(ctx, fireX - fireW / 2, fireY, fireW, Math.max(2, s * 0.06), setting > 0.02 ? PAL.fire0 : PAL.stone0);
if (setting > 0.02) {
this.fx.fire(fireX, fireY, fireW * 0.9, setting * (0.6 + 0.4 * sim.furnace.maxFlame / 520), s, st.dt);
for (let k = 0; k < fireW; k += 3) {
const flick = Math.sin(st.time * 9 + k) * 0.5 + 0.5;
if (flick > 0.5) rect(ctx, fireX - fireW / 2 + k, fireY, 2, 1, PAL.fire2);
}
} else if (setting < -0.02) {
rect(ctx, fireX - fireW / 2, fireY - 1, fireW, Math.max(2, s * 0.05), PAL.frost1);
rect(ctx, fireX - fireW / 2, fireY - 1, fireW, 1, PAL.frost3);
this.fx.frost(fireX, fireY, fireW, -setting, s, st.dt);
}
const ca = this.cauldronArt;
ctx.drawImage(ca.canvas, ca.x, ca.y);
if (this.frame % 4 === 0) this._updateHeat(c);
ctx.drawImage(this.heatCanvas, ca.x, ca.y);
this.fluid.thermal = !!st.thermal;
const fr = this.fluid.render(sim, view, st.time);
if (fr) ctx.drawImage(fr.canvas, fr.x, fr.y);
this._drawLid(c, st);
if (st.alembic) this._drawAlembic(c, st);
this._drawTap(c, st);
if (st.pour && st.pour.active) this._drawPour(c, st);
const tool = st.tool;
if (tool && (tool.active || st.toolHover) && tool.type !== 'none') this._drawTool(c, tool, st);
if (st.stirrer) this._drawStirrer(c, st);
const p = sim.p;
for (let i = 0; i < p.count; i++) {
const b = p.burn[i];
if (b > 0.2 && this.fx.rand() < b * 0.5) {
const [fx, fy] = this.toScreen(p.x[i], p.y[i]);
this.fx.add(0, fx + (this.fx.rand() - 0.5) * s * 0.08, fy - 1, (this.fx.rand() - 0.5) * s * 0.1, -s * (0.4 + this.fx.rand() * 0.6), 0.25 + this.fx.rand() * 0.25, Math.max(1, s * 0.035));
if (this.fx.rand() < 0.04) this.fx.add(1, fx, fy, (this.fx.rand() - 0.5) * s, -s * (0.8 + this.fx.rand()), 0.6, 1, [255, 220, 120]);
}
}
this.fx.update(st.dt);
this.fx.draw(ctx);
if (st.probe) {
const [px, py] = this.toScreen(st.probe.x, st.probe.y);
const r = Math.round(st.probe.r * s);
ctx.strokeStyle = PAL.brassHi;
ctx.lineWidth = 1;
ctx.beginPath();
ctx.arc(Math.round(px) + 0.5, Math.round(py) + 0.5, r, 0, Math.PI * 2);
ctx.stroke();
rect(ctx, px - 3, py, 7, 1, PAL.brassHi);
rect(ctx, px, py - 3, 1, 7, PAL.brassHi);
}
if (this.quality !== 'low') this._lighting(c, st);
}
_updateHeat(c) {
const ca = this.cauldronArt;
const img = this.heatImg;
const d = img.data;
d.fill(0);
const wp = ca.wallPix;
for (let k = 0; k < wp.length; k += 3) {
const T = c.cellT[wp[k + 2]];
const o = (wp[k + 1] * img.width + wp[k]) * 4;
if (T > 140) {
const a = Math.min(1, (T - 140) / 360);
d[o] = 255; d[o + 1] = Math.round(60 + 120 * a * a); d[o + 2] = 20; d[o + 3] = Math.round(a * 200);
} else if (T < 2) {
const a = Math.min(1, (2 - T) / 40);
const speck = ((wp[k] * 7 + wp[k + 1] * 13) % 5) === 0 ? 1 : 0.55;
d[o] = 210; d[o + 1] = 240; d[o + 2] = 255; d[o + 3] = Math.round(a * 190 * speck);
}
}
this.heatCtx.putImageData(img, 0, 0);
}
_drawLid(c, st) {
const { ctx, view } = this;
const s = view.scale;
const lw = Math.round((c.mouth + 0.22) * 2 * s);
if (c.lidClosed) {
const x = Math.round(view.ox - lw / 2), y = Math.round(view.oy - 0.12 * s);
const h = Math.max(3, Math.round(0.12 * s));
rect(ctx, x, y, lw, h, PAL.iron3);
rect(ctx, x, y, lw, 1, PAL.iron5);
rect(ctx, x + 2, y - Math.round(0.08 * s), lw - 4, Math.round(0.08 * s), PAL.iron2);
rect(ctx, x + 2, y - Math.round(0.08 * s), lw - 4, 1, PAL.iron4);
const kw = Math.max(3, Math.round(0.2 * s));
rect(ctx, view.ox - kw / 2 - Math.round(0.9 * s), y - Math.round(0.2 * s), kw, Math.round(0.12 * s), PAL.wood4);
const px = Math.round(view.ox + (st.pour && st.pour.active ? st.pour.x : 0.6) * s);
const fw = Math.max(4, Math.round(0.22 * s));
rect(ctx, px - fw / 2, y - Math.round(0.18 * s), fw, Math.round(0.1 * s), PAL.brass);
rect(ctx, px - fw / 4, y - Math.round(0.1 * s), fw / 2, Math.round(0.14 * s), PAL.copper2);
rect(ctx, px - fw / 2, y - Math.round(0.18 * s), fw, 1, PAL.brassHi);
} else {
const lh = Math.round(lw * 0.42);
const x = Math.round(view.ox - (c.belly * 0.62 + 0.2) * s - lh * 0.35), y = Math.round(view.oy + (c.depth + 0.55) * s);
ctx.save();
ctx.translate(x, y);
ctx.rotate(-0.35);
const th = Math.max(3, Math.round(0.11 * s));
rect(ctx, -th, -lh, th, lh, PAL.iron3);
rect(ctx, -th, -lh, 1, lh, PAL.iron5);
rect(ctx, 0, -lh * 0.6, Math.max(2, Math.round(th * 0.8)), Math.round(lh * 0.2), PAL.wood4);
ctx.restore();
}
}
_drawTap(c, st) {
const { ctx, view } = this;
const s = view.scale;
const tx = Math.round(view.ox + (c.halfWidth(c.depth - 0.35) + 0.16) * s);
const ty = Math.round(view.oy + (c.depth - 0.35) * s);
const tw = Math.max(4, Math.round(0.25 * s)), th = Math.max(2, Math.round(0.07 * s));
rect(ctx, tx, ty, tw, th, PAL.brass);
rect(ctx, tx, ty, tw, 1, PAL.brassHi);
rect(ctx, tx + tw - th, ty + th, th, th * 2, PAL.copper2);
rect(ctx, tx + Math.round(tw / 3), ty - th, th, th, PAL.copper3); // valve handle
const b = st.bottling;
const bw = Math.max(6, Math.round(0.34 * s)), bh = Math.max(9, Math.round(0.55 * s));
const bx = tx + tw - th / 2 - bw / 2, by = Math.round(view.oy + (c.depth + 0.55) * s) - bh;
if (b) {
const sx = Math.round(tx + tw - th / 2), sy = ty + th * 3;
if (b.progress < 1) rect(ctx, sx - 1, sy, 2, by + bh * (1 - b.progress * 0.8) - sy, rgbStr(b.color));
drawBottle(ctx, bx, by, bw, bh, b.color, b.progress);
} else if (st.showBottle) {
drawBottle(ctx, bx, by, bw, bh, [0.5, 0.5, 0.5], 0);
}
}
_drawPour(c, st) {
const { ctx, view } = this;
const s = view.scale;
const def = st.pour.def;
const x = Math.round(view.ox + st.pour.x * s);
const jarW = Math.max(6, Math.round(0.36 * s)), jarH = Math.max(9, Math.round(0.55 * s));
const jy = Math.round(view.oy + (VIEW_TOP + 0.04) * s);
ctx.save();
ctx.translate(x - jarW * 0.2, jy + jarH * 0.5);
ctx.rotate(2.0);
drawJar(ctx, -jarW / 2, -jarH / 2, jarW, jarH, def.look || def.color, def.form);
ctx.restore();
const entry = c.lidClosed ? view.oy - 0.25 * s : view.oy + (-COLUMN * 0.55) * s;
const col = rgbStr(def.look || def.color);
if (def.form === 'powder') {
for (let y = jy + jarH; y < entry; y += 2) {
if (((y * 7 + this.frame) % 5) < 3) rect(ctx, x + Math.round(Math.sin(y + this.frame) * 1.2), y, 1, 1, col);
}
} else if (def.form === 'liquid') {
rect(ctx, x - 1, jy + jarH, 2, entry - jy - jarH, col);
rect(ctx, x - 1, jy + jarH, 1, entry - jy - jarH, rgbStr(def.look || def.color, 1.3));
}
}
_drawTool(c, tool, st) {
const { ctx, view } = this;
const s = view.scale;
const [tx, ty] = this.toScreen(tool.x, tool.y);
const pivotX = view.ox + (tool.x >= 0 ? 1 : -1) * (c.mouth + 0.7) * s;
const pivotY = view.oy + (VIEW_TOP - 0.1) * s;
const ang = Math.atan2(pivotY - ty, pivotX - tx);
const len = Math.hypot(pivotX - tx, pivotY - ty);
ctx.save();
ctx.translate(Math.round(tx), Math.round(ty));
ctx.rotate(ang);
if (tool.type === 'spoon') {
const hw = Math.max(2, Math.round(0.055 * s));
rect(ctx, 0, -hw / 2, len, hw, PAL.wood4);
rect(ctx, 0, -hw / 2, len, 1, PAL.wood5);
const br = Math.max(3, Math.round(0.12 * s));
ctx.fillStyle = PAL.wood3;
ctx.beginPath();
ctx.ellipse(0, 0, br * 1.3, br, 0, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = PAL.wood5;
ctx.fillRect(-br, -br + 1, br, 1);
} else if (tool.type === 'pestle') {
const hw = Math.max(3, Math.round(0.11 * s));
rect(ctx, 0, -hw / 2, len * 0.75, hw, PAL.stone3);
rect(ctx, 0, -hw / 2, len * 0.75, 1, PAL.stone4);
const br = Math.max(4, Math.round(0.17 * s));
ctx.fillStyle = PAL.stone4;
ctx.beginPath();
ctx.arc(0, 0, br, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = PAL.stone2;
ctx.fillRect(-br + 1, 1, br * 2 - 2, 1);
} else if (tool.type === 'skimmer') {
const hw = Math.max(2, Math.round(0.045 * s));
rect(ctx, 0, -hw / 2, len, hw, PAL.brass);
const br = Math.max(4, Math.round(0.2 * s));
ctx.strokeStyle = PAL.brassHi;
ctx.lineWidth = 1;
ctx.beginPath();
ctx.arc(0, 0, br, 0, Math.PI * 2);
ctx.stroke();
for (let k = -br + 2; k < br - 1; k += 2) rect(ctx, k, -br + 2, 1, br * 2 - 4, 'rgba(232,180,92,0.6)');
}
ctx.restore();
if (tool.active && tool.type === 'spoon' && this.quality === 'high') {
ctx.strokeStyle = 'rgba(255,240,200,0.12)';
ctx.beginPath();
ctx.arc(Math.round(tx) + 0.5, Math.round(ty) + 0.5, Math.round(0.42 * s), 0, Math.PI * 2);
ctx.stroke();
}
}
_drawStirrer(c, st) {
const { ctx, view } = this;
const s = view.scale;
const x = Math.round(view.ox - (c.mouth + 0.45) * s), y = Math.round(view.oy - 0.45 * s);
const w = Math.round(0.42 * s), h = Math.round(0.32 * s);
rect(ctx, x, y, w, h, PAL.copper1);
rect(ctx, x, y, w, 1, PAL.copper3);
const a = st.time * 4;
rect(ctx, x + w / 2 + Math.cos(a) * w * 0.25 - 1, y + h / 2 + Math.sin(a) * h * 0.25 - 1, 3, 3, PAL.brassHi);
}
_drawAlembic(c, st) {
const { ctx, view } = this;
const s = view.scale;
const x = Math.round(view.ox + (c.mouth - 0.1) * s), y = Math.round(view.oy - 0.4 * s);
ctx.strokeStyle = PAL.copper2;
ctx.lineWidth = Math.max(1, Math.round(0.05 * s));
ctx.beginPath();
ctx.moveTo(x, y + 0.3 * s);
ctx.quadraticCurveTo(x + 0.4 * s, y - 0.5 * s, x + 1.0 * s, y + 0.2 * s);
ctx.stroke();
const fx = Math.round(x + 1.0 * s), fy = Math.round(y + 0.2 * s);
const r = st.receiver;
const fw = Math.round(0.4 * s), fh = Math.round(0.5 * s);
drawBottle(ctx, fx - fw / 2, fy, fw, fh, r && r.color ? r.color : [0.6, 0.7, 0.8], r ? Math.min(1, r.count / 80) : 0);
}
_lighting(c, st) {
const { ctx, view } = this;
const s = view.scale;
const setting = st.sim.furnace.setting;
ctx.globalCompositeOperation = 'lighter';
if (setting > 0.02) {
const flick = 0.85 + Math.sin(st.time * 11) * 0.08 + Math.sin(st.time * 17.3) * 0.05;
const g = ctx.createRadialGradient(view.ox, view.oy + (c.depth + 0.6) * s, 0, view.ox, view.oy + (c.depth + 0.6) * s, s * 2.6);
g.addColorStop(0, `rgba(255,120,40,${0.32 * setting * flick})`);
g.addColorStop(1, 'rgba(255,120,40,0)');
ctx.fillStyle = g;
ctx.fillRect(0, 0, this.W, this.H);
} else if (setting < -0.02) {
const g = ctx.createRadialGradient(view.ox, view.oy + (c.depth + 0.6) * s, 0, view.ox, view.oy + (c.depth + 0.6) * s, s * 2.2);
g.addColorStop(0, `rgba(90,170,255,${0.22 * -setting})`);
g.addColorStop(1, 'rgba(90,170,255,0)');
ctx.fillStyle = g;
ctx.fillRect(0, 0, this.W, this.H);
}
const p = st.sim.p;
let glow = 0, gr = 0, gg = 0, gb = 0;
const step = Math.max(1, Math.floor(p.count / 300));
for (let i = 0; i < p.count; i += step) {
const e = p.glow[i] + p.burn[i] * 1.5;
if (e > 0.05) { glow += e; gr += st.sim.colR[i] * e; gg += st.sim.colG[i] * e; gb += st.sim.colB[i] * e; }
}
if (glow > 0.5) {
const a = Math.min(0.35, glow * step * 0.002);
const col = `${Math.round(gr / glow * 255)},${Math.round(gg / glow * 255)},${Math.round(gb / glow * 255)}`;
const g = ctx.createRadialGradient(view.ox, view.oy + c.depth * 0.6 * s, 0, view.ox, view.oy + c.depth * 0.6 * s, s * 3);
g.addColorStop(0, `rgba(${col},${a})`);
g.addColorStop(1, `rgba(${col},0)`);
ctx.fillStyle = g;
ctx.fillRect(0, 0, this.W, this.H);
}
ctx.globalCompositeOperation = 'source-over';
}
onEvent(e) {
const [x, y] = this.toScreen(e.x ?? 0, e.y ?? 0);
const s = this.view.scale;
switch (e.type) {
case 'reaction': this.fx.burst(4, x, y, 14, s * 0.6, [255, 230, 140], 1); break;
case 'crush': this.fx.burst(3, x, y, 4, s * 0.3, [210, 210, 220], 0.6); break;
case 'ignite': this.fx.burst(1, x, y, 10, s * 0.8, hex2rgb(PAL.fire3), 1); break;
case 'phase':
if (e.to === 'solid') this.fx.burst(5, x, y, 3, s * 0.2, hex2rgb(PAL.frost3), 0.3);
else if (e.to === 'gas' && this.fx.rand() < 0.5) this.fx.add(6, x, y, (this.fx.rand() - 0.5) * s * 0.4, -s * 0.6, 0.35, 1, [235, 240, 250]);
break;
case 'paste': if (this.fx.rand() < 0.2) this.fx.burst(4, x, y, 2, s * 0.2, [255, 240, 210], 0.3); break;
case 'dissolve': this.fx.burst(4, x, y, 2, s * 0.15, [220, 240, 255], 0.3); break;
}
}
}
function drawBottle(ctx, x, y, w, h, color, fill) {
x = Math.round(x); y = Math.round(y);
const neck = Math.max(2, Math.round(w * 0.35));
const nh = Math.round(h * 0.3);
rect(ctx, x + (w - neck) / 2, y, neck, nh, 'rgba(170,220,240,0.35)');
rect(ctx, x + (w - neck) / 2, y - 2, neck, 2, PAL.wood4);
rect(ctx, x, y + nh, w, h - nh, 'rgba(170,220,240,0.28)');
const fh = Math.round((h - nh - 1) * Math.max(0, Math.min(1, fill)));
if (fh > 0) {
rect(ctx, x + 1, y + h - 1 - fh, w - 2, fh, rgbStr(color));
rect(ctx, x + 1, y + h - 1 - fh, w - 2, 1, rgbStr(color, 1.3));
}
rect(ctx, x, y + nh, 1, h - nh, 'rgba(255,255,255,0.55)');
rect(ctx, x + w - 1, y + nh, 1, h - nh, 'rgba(0,0,0,0.35)');
rect(ctx, x, y + h - 1, w, 1, 'rgba(0,0,0,0.4)');
}
return { Renderer, drawBottle, PHASE };
})();
// src/rendering/portraits.js
const __m39 = (() => {
const { Rng } = __m6;
const S = 32;
const shade = (c, f) => `rgb(${Math.round(Math.min(255, c[0] * 255 * f))},${Math.round(Math.min(255, c[1] * 255 * f))},${Math.round(Math.min(255, c[2] * 255 * f))})`;
function drawPortrait(canvas, pt, mood = 'neutral') {
canvas.width = S;
canvas.height = S;
const ctx = canvas.getContext('2d');
const rng = new Rng(pt.seed || 1);
const P = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
P(0, 0, S, S, '#2a1f2e');
for (let y = 0; y < S; y += 4) P(0, y, S, 1, '#251b29');
P(0, 22, S, 10, '#3a2a24');
const skin = pt.skin, hair = pt.hair, out = pt.outfit;
P(4, 25, 24, 7, shade(out, 1));
P(4, 25, 24, 1, shade(out, 1.25));
P(14, 25, 4, 7, shade(out, 0.75));
if (pt.apron) { P(10, 27, 12, 5, '#d8cfb8'); P(10, 27, 12, 1, '#efe6d0'); }
P(13, 21, 6, 4, shade(skin, 0.85));
const wide = rng.int(0, 2);
const hx = 9 - wide, hw = 14 + wide * 2;
P(hx + 1, 7, hw - 2, 15, shade(skin, 1));
P(hx, 9, hw, 11, shade(skin, 1));
P(hx + 1, 21, hw - 2, 1, shade(skin, 0.8));
P(hx + hw - 2, 9, 2, 11, shade(skin, 0.88)); // side shading
P(hx - 1, 13, 1, 3, shade(skin, 0.85));
P(hx + hw, 13, 1, 3, shade(skin, 0.85));
const ey = 13;
const e = pt.eyes || [0.2, 0.3, 0.5];
P(12, ey, 3, 2, '#f4efe6');
P(18, ey, 3, 2, '#f4efe6');
P(13, ey, 2, 2, shade(e, 1));
P(19, ey, 2, 2, shade(e, 1));
P(13, ey, 1, 1, '#120c10');
P(19, ey, 1, 1, '#120c10');
const browC = shade(hair, 0.8);
const browY = mood === 'unhappy' ? ey - 2 : ey - 2;
P(12, browY, 3, 1, browC);
P(18, browY, 3, 1, browC);
if (mood === 'unhappy') { P(14, browY + 1, 1, 1, browC); P(18, browY + 1, 1, 1, browC); }
P(16, 15, 1, 3, shade(skin, 0.78));
P(15, 17, 2, 1, shade(skin, 0.78));
const my = 19;
if (mood === 'happy') { P(13, my, 7, 1, '#6a2a2a'); P(12, my - 1, 1, 1, '#6a2a2a'); P(20, my - 1, 1, 1, '#6a2a2a'); P(14, my + 1, 5, 1, '#8a3a3a'); }
else if (mood === 'unhappy') { P(13, my + 1, 7, 1, '#6a2a2a'); P(12, my + 2, 1, 1, '#6a2a2a'); P(20, my + 2, 1, 1, '#6a2a2a'); }
else P(14, my, 5, 1, '#6a2a2a');
if (pt.age > 0.7) { P(11, 16, 1, 2, shade(skin, 0.8)); P(21, 16, 1, 2, shade(skin, 0.8)); }
if (pt.beard) {
const bc = shade(hair, 1);
P(hx + 1, 17, hw - 2, 5, bc);
P(hx + 2, 22, hw - 4, 2, bc);
P(14, 19, 5, 1, mood === 'happy' ? '#6a2a2a' : shade(hair, 0.7));
P(hx + 1, 17, 1, 3, shade(hair, 0.8));
}
if (pt.glasses) {
ctx.strokeStyle = '#d8b65c';
ctx.lineWidth = 1;
ctx.strokeRect(11.5, ey - 0.5, 4, 3);
ctx.strokeRect(17.5, ey - 0.5, 4, 3);
P(15, ey, 3, 1, '#d8b65c');
}
const hc = shade(hair, 1), hd = shade(hair, 0.75);
const hat = pt.hat;
const hairTop = () => { P(hx, 6, hw, 4, hc); P(hx - 1, 8, 2, 6, hc); P(hx + hw - 1, 8, 2, 6, hd); P(hx + 2, 5, hw - 4, 1, hc); };
switch (hat) {
case 'straw':
hairTop();
P(hx - 4, 7, hw + 8, 2, '#d8b65c'); P(hx - 4, 7, hw + 8, 1, '#efd27a');
P(hx + 1, 3, hw - 2, 4, '#d8b65c'); P(hx + 1, 6, hw - 2, 1, '#8a3a2a');
break;
case 'cap':
hairTop();
P(hx, 4, hw, 4, '#5a4a6a'); P(hx + hw - 2, 7, 5, 1, '#5a4a6a');
break;
case 'feather':
hairTop();
P(hx - 1, 4, hw + 2, 4, '#7a2a5a'); P(hx - 1, 4, hw + 2, 1, '#9a3a7a');
P(hx + hw - 2, 0, 2, 5, '#e8e0a0'); P(hx + hw - 1, 0, 1, 2, '#ffffff');
break;
case 'hood':
P(hx - 2, 4, hw + 4, 6, shade(out, 0.9)); P(hx - 2, 9, 3, 13, shade(out, 0.9)); P(hx + hw - 1, 9, 3, 13, shade(out, 0.8));
P(hx, 4, hw, 1, shade(out, 1.2));
break;
case 'helm':
P(hx - 1, 4, hw + 2, 8, '#8a8a96'); P(hx - 1, 4, hw + 2, 1, '#b8b8c4'); P(15, 7, 2, 7, '#6a6a76');
P(hx - 1, 11, 2, 5, '#8a8a96'); P(hx + hw - 1, 11, 2, 5, '#6a6a76');
break;
case 'wide':
hairTop();
P(hx - 5, 7, hw + 10, 2, '#4a3a2a'); P(hx + 1, 2, hw - 2, 5, '#4a3a2a'); P(hx + 1, 5, hw - 2, 1, '#8a6a3a');
break;
case 'witch':
P(hx - 1, 8, 2, 12, hc); P(hx + hw - 1, 8, 2, 12, hd);
P(hx - 5, 7, hw + 10, 2, '#1e2a1e'); P(hx + 2, 3, hw - 4, 4, '#1e2a1e'); P(hx + 4, 0, hw - 8, 3, '#1e2a1e'); P(hx + 7, -1, 3, 2, '#1e2a1e');
P(hx + 2, 6, hw - 4, 1, '#7a3aa8');
break;
case 'bandana':
hairTop();
P(hx, 5, hw, 3, '#a8302a'); P(hx + hw, 6, 3, 2, '#a8302a');
break;
case 'crown':
hairTop();
P(hx + 1, 3, hw - 2, 3, '#e8b45c'); P(hx + 1, 1, 2, 2, '#e8b45c'); P(15, 1, 2, 2, '#e8b45c'); P(hx + hw - 3, 1, 2, 2, '#e8b45c');
P(15, 4, 2, 1, '#e0402c');
break;
case 'wizard':
P(hx - 1, 8, 2, 8, '#d8d8e0'); P(hx + hw - 1, 8, 2, 8, '#b8b8c0');
P(hx - 3, 7, hw + 6, 2, '#3a2a7a'); P(hx + 1, 3, hw - 2, 4, '#3a2a7a'); P(hx + 4, 0, hw - 8, 3, '#3a2a7a');
P(hx + 3, 4, 1, 1, '#ffe39a'); P(hx + hw - 5, 2, 1, 1, '#ffe39a');
break;
default:
hairTop();
if (rng.chance(0.5)) P(hx - 1, 8, 2, 10, hc);
}
}
return { drawPortrait };
})();
// src/game/evaluate.js
const __m40 = (() => {
const { deltaE } = __m8;
const { viscosityClass } = __m16;
const ASPECTS = ['vitality', 'ardor', 'arcana', 'fortitude'];
const PROPERTY_LABELS = {
color: 'Colour', density: 'Density', viscosity: 'Viscosity', temperature: 'Temperature', vitality: 'Vitality', ardor: 'Ardor',
arcana: 'Arcana', fortitude: 'Fortitude', stability: 'Stability', volatility: 'Volatility', quantity: 'Quantity',
};
function scoreRequirement(req, m) {
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
default: {
const k = ASPECTS.indexOf(req.key);
value = k >= 0 ? m.aspects[k] : 0;
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
function describeValue(key, value, m) {
switch (key) {
case 'color':
return `ΔE ${value.toFixed(1)}`;
case 'density':
return `${value.toFixed(2)} g/ml`;
case 'viscosity':
return `${viscosityClass(value)} (${value < 100 ? value.toFixed(1) : Math.round(value)} cP)`;
case 'temperature':
return `${Math.round(value)}°C`;
default:
return `${Math.round(value)}`;
}
}
function evaluatePotion(commission, m) {
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
quality *= 0.5 + 0.5 * qScore;
const perfect = rows.every((r) => r.score >= 0.999);
if (perfect) quality = 1;
const stars = perfect ? 5 : quality >= 0.86 ? 4 : quality >= 0.7 ? 3 : quality >= 0.5 ? 2 : quality >= 0.28 ? 1 : 0;
let payment = Math.round(commission.budget * (0.12 + 0.88 * Math.pow(quality, 1.6)) * (perfect ? 1.2 : 1));
if (quality < 0.2) payment = Math.round(commission.budget * 0.05);
const repDelta = Math.round((quality - 0.45) * (10 + commission.tier * 4)) + (perfect ? 3 : 0) + (commission.contract ? Math.round(quality * 15) : 0);
return { rows, quality, stars, perfect, payment, repDelta };
}
return { PROPERTY_LABELS, scoreRequirement, describeValue, evaluatePotion };
})();
// src/game/journal.js
const __m41 = (() => {
function processEvent(state, e) {
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
if (m) {
state.learn(e.id, 'seen', true);
add({ key: 'ing:' + e.id, title: m.name, text: m.description, kind: 'ingredient', material: e.id });
}
break;
}
case 'phase': {
const id = e.species;
if (!id) break;
const T = Math.round(e.temp);
if (e.to === 'gas') {
state.learn(id, 'boil', T);
add({ key: `boil:${id}`, title: `${name(id)} boils`, text: `${name(id)} turned to vapour at about ${T}°C. With the lid on, the vapour gathers under it and can condense again.`, kind: 'phase', material: id });
achievements.push(...state.unlock('boil'));
} else if (e.from === 'gas') {
add({ key: `condense:${id}`, title: `${name(id)} condenses`, text: `Vapour of ${name(id)} condensed back into droplets on a cool surface.`, kind: 'phase', material: id });
achievements.push(...state.unlock('condense'));
} else if (e.to === 'solid') {
state.learn(id, 'melt', T);
add({ key: `freeze:${id}`, title: `${name(id)} freezes`, text: `${name(id)} froze solid at about ${T}°C, forming a block shaped like the liquid. The pestle can crush it.`, kind: 'phase', material: id });
achievements.push(...state.unlock('frozen'));
} else if (e.from === 'solid' || (e.from === 'powder' && e.to !== 'powder')) {
state.learn(id, 'melt', T);
add({ key: `melt:${id}`, title: `${name(id)} melts`, text: `${name(id)} melted at about ${T}°C.`, kind: 'phase', material: id });
}
break;
}
case 'paste': {
const id = e.species;
if (e.binder > 0.4) {
add({ key: `dough:${id}`, title: 'A dough forms', text: `Kneading the powder with liquid turned it into a thick, cohesive dough. More liquid thins it into a paste and eventually a liquid.`, kind: 'mixing', material: id });
achievements.push(...state.unlock('dough'));
}
break;
}
case 'dissolve': {
const id = e.species;
if (id) {
state.learn(id, 'soluble', true);
add({ key: `dissolve:${id}`, title: `${name(id)} dissolves`, text: `${name(id)} dissolved into the liquid. Heat and stirring make it dissolve faster.`, kind: 'mixing', material: id });
}
break;
}
case 'reaction': {
const rule = state.world.reactions.find((r) => r.id === e.rule);
if (!rule) break;
const prods = rule.products.map((p) => name(p.id)).join(' and ');
const before = state.reactionsDiscovered();
add({
key: `reaction:${rule.id}`,
title: `Reaction: ${rule.name}`,
text: `${name(rule.a)}${rule.b ? ' + ' + name(rule.b) : ''} → ${prods}. ${rule.minT > -20 ? `Needs at least ${rule.minT}°C` : `Needs cold below ${rule.maxT}°C`}${rule.maxT < 200 && rule.minT > -20 ? ` and stops above ${rule.maxT}°C` : ''}. ${rule.heat > 50 ? 'It releases a lot of heat!' : rule.heat < 0 ? 'It draws heat in.' : ''} ${rule.hint || ''}`,
kind: 'reaction',
material: rule.products[0].id,
});
for (const p of rule.products) state.learn(p.id, 'seen', true);
const after = state.reactionsDiscovered();
if (after > before) {
if (after >= 1) achievements.push(...state.unlock('react1'));
if (after >= 5) achievements.push(...state.unlock('react5'));
if (after >= 10) achievements.push(...state.unlock('react10'));
}
break;
}
case 'ignite': {
const id = e.species;
add({ key: `fire:${id}`, title: `${name(id)} burns`, text: `${name(id)} caught fire where it met the air. Fire needs oxygen — closing the lid starves it.`, kind: 'fire', material: id });
if (id) state.learn(id, 'flammable', true);
achievements.push(...state.unlock('fire'));
break;
}
case 'crush':
achievements.push(...state.unlock('crush'));
add({ key: 'crush', title: 'Crushing', text: 'The pestle breaks solid blocks and crystals into grains without losing any material.', kind: 'tool' });
break;
case 'layers': {
add({ key: `layers:${e.a}:${e.b}`, title: 'Immiscible layers', text: `${name(e.a)} and ${name(e.b)} refuse to mix and separate into layers by density.`, kind: 'mixing', material: e.a });
state.learn(e.a, 'immiscible', true);
achievements.push(...state.unlock('layers'));
break;
}
}
return { entries, achievements };
}
return { processEvent };
})();
// src/game/autobrew.js
const __m42 = (() => {
const { PHASE, SIM } = __m17;
const { MAX_SPECIES } = __m13;
class AutoBrewer {
constructor(sim, plan, lookup, opts = {}) {
this.sim = sim;
this.plan = plan;
this.lookup = lookup;
this.scale = opts.scale || 1;
this.onPour = opts.onPour;
this.stage = 'pour';
this.ingIndex = 0;
this.t = 0;
this.stageT = 0;
this.phase = 0;
this.status = 'Preparing';
this.failed = false;
}
get done() {
return this.stage === 'done';
}
meanTemp() {
const p = this.sim.p;
let s = 0, n = 0;
for (let i = 0; i < p.count; i++) if (p.phase[i] !== PHASE.GAS) { s += p.temp[i]; n++; }
return n ? s / n : SIM.AMBIENT;
}
control(target) {
const T = this.meanTemp();
const f = this.sim.furnace;
const err = target - T;
f.setting = Math.max(-1, Math.min(1, err / 12));
return Math.abs(err);
}
stir(strength = 1) {
const sim = this.sim, t = sim.tool;
t.type = 'spoon';
this.phase += SIM.DT * 2.6;
const c = sim.cauldron;
let minY = c.depth, n = 0;
const p = sim.p;
for (let i = 0; i < p.count; i += 7) if (p.phase[i] !== PHASE.GAS) { minY = Math.min(minY, p.y[i]); n++; }
const top = n ? minY : c.depth - 1;
const cy = (top + c.depth) / 2;
const ry = Math.max(0.12, (c.depth - top) / 2 - 0.15);
const rx = c.halfWidth(cy) * 0.68 * strength;
t.setTarget(Math.cos(this.phase) * rx, cy + Math.sin(this.phase * 1.7) * ry, true);
t.beginFrame();
t.substep(0, 1);
}
release() {
const t = this.sim.tool;
t.setTarget(t.x, t.y, false);
}
tick() {
const dt = SIM.DT;
this.t += dt;
this.stageT += dt;
const sim = this.sim, plan = this.plan;
if (this.t > 300) { this.failed = true; this.finish(); return; }
switch (this.stage) {
case 'pour': {
if (sim.emitter.pouring) { this.stir(0.6); return; }
if (this.ingIndex >= plan.ingredients.length) {
this.next(plan.crush ? 'crush' : 'stir');
return;
}
const ing = plan.ingredients[this.ingIndex++];
const n = Math.max(1, Math.round(ing.n * this.scale));
if (this.onPour && !this.onPour(ing.id, n)) { this.failed = true; this.finish(); return; }
const def = this.lookup(ing.id);
sim.emitter.start(def, { x: (this.ingIndex % 2 ? -0.35 : 0.35), amount: n, rate: def.form === 'powder' ? 70 : 110 });
this.status = `Pouring ${def.name}`;
return;
}
case 'crush': {
this.status = 'Grinding solids';
const p = sim.p;
let solids = 0, sx = 0, sy = 0;
for (let i = 0; i < p.count; i++) if (p.phase[i] === PHASE.SOLID) { solids++; sx += p.x[i]; sy += p.y[i]; }
if (solids === 0 || this.stageT > 25) { this.release(); this.next('stir'); return; }
const t = sim.tool;
t.type = 'pestle';
this.phase += dt * 9;
const cx = sx / solids, cy = sy / solids;
t.setTarget(cx + Math.sin(this.phase * 0.6) * 0.35, cy + Math.abs(Math.sin(this.phase)) * 0.3 - 0.05, true);
t.beginFrame();
t.substep(0, 1);
return;
}
case 'stir': {
this.status = 'Stirring';
this.stir(1);
this.control(Math.min(plan.heatTo ?? 20, 60));
const need = plan.knead ? 14 : 7;
if (this.stageT > need) this.next('heat');
return;
}
case 'heat': {
const target = plan.heatTo ?? 20;
const cold = (plan.coolTo ?? 20) < 15 && target <= 25;
const goal = cold ? plan.coolTo : target;
this.status = cold ? 'Chilling' : `Heating to ${Math.round(goal)}°C`;
const err = this.control(goal);
if (this.stageT % 3 < 1.5) this.stir(0.8); else this.release();
if (err < 4 || this.stageT > 70) this.next('hold');
return;
}
case 'hold': {
const cold = (plan.coolTo ?? 20) < 15 && (plan.heatTo ?? 20) <= 25;
this.control(cold ? plan.coolTo : plan.heatTo ?? 20);
this.status = 'Letting it react';
if (this.stageT % 2.5 < 1.5) this.stir(0.9); else this.release();
if (this.stageT > (plan.hold ?? 6) + 4) this.next('serve');
return;
}
case 'serve': {
const err = this.control(plan.serveTemp ?? 20);
this.status = `Bringing to ${Math.round(plan.serveTemp ?? 20)}°C`;
if (this.stageT % 2 < 1.2) this.stir(0.8); else this.release();
if ((err < 3 && this.stageT > 3) || this.stageT > 60) this.finish();
return;
}
}
}
next(s) {
this.stage = s;
this.stageT = 0;
}
finish() {
this.release();
this.sim.furnace.setting = 0;
this.stage = 'done';
this.status = this.failed ? 'Stopped' : 'Ready to bottle';
}
}
function runPlanHeadless(sim, plan, lookup) {
const ab = new AutoBrewer(sim, plan, lookup);
let guard = 0;
while (!ab.done && guard++ < 120 * 400) {
ab.tick();
sim.step();
}
return ab;
}
function speciesFraction(sim, id) {
const s = sim.species.slotOf.get(id);
if (s === undefined) return 0;
let t = 0;
for (let i = 0; i < sim.p.count; i++) t += sim.p.comp[i * MAX_SPECIES + s];
return t / Math.max(1, sim.p.count);
}
return { AutoBrewer, runPlanHeadless, speciesFraction };
})();
// src/ui/panels.js
const __m43 = (() => {
const { h, btn, modal, toast, coins, starsText, confirmDialog, clear } = __m2;
const { icon } = __m3;
const { drawPortrait } = __m39;
const { drawJar } = __m36;
const { EQUIPMENT, RANKS } = __m19;
const { ACHIEVEMENTS } = __m5;
const { PROPERTY_LABELS } = __m40;
const { viscosityClass } = __m16;
const { ASPECT_LABELS } = __m9;
const { compatFactor } = __m18;
const { describeColor, rgbToHex } = __m8;
const { SIM } = __m17;
const { exportSave, parseImport, saveGame } = __m20;
const { audio } = __m4;
const { archetypeOf } = __m15;
const CAT_LABEL = { heat: 'Heating', cold: 'Cooling', vessel: 'Cauldrons', tool: 'Tools', instrument: 'Instruments', storage: 'Storage', guild: 'Guild' };
function jarCanvas(m, w = 22, hh = 30) {
const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(w), height: String(hh), style: { width: w * 2 + 'px', height: hh * 2 + 'px' } }));
drawJar(cv.getContext('2d'), 2, 0, w - 4, hh, m.look || m.color, m.form);
return cv;
}
function swatch(rgb) {
return h('span', { class: 'swatch', style: { background: rgbToHex(rgb), display: 'inline-block', width: '18px', height: '12px', boxShadow: '0 0 0 1px #2b1d14', verticalAlign: 'middle' } });
}
function openShop(lab, tab = 'reagents') {
const st = lab.state;
const body = h('div');
const tabs = h('div', { class: 'tabs' });
let current = tab;
const m = modal({ title: 'Market & Guild', body: [tabs, body], wide: true, onClose: () => lab.refreshHud(true) });
m.el.insertBefore(tabs, m.body);
const coinLine = h('div', { class: 'row', style: { justifyContent: 'flex-end', padding: '0 12px' } });
m.el.insertBefore(coinLine, m.body);
const renderTabs = () => {
clear(tabs);
for (const [k, label] of [['reagents', 'Reagents'], ['equipment', 'Equipment'], ['sell', 'Sell surplus']]) {
tabs.appendChild(btn(label, () => { current = k; render(); }, { cls: current === k ? 'active' : '', act: 'shop-tab-' + k }));
}
};
const render = () => {
renderTabs();
clear(coinLine).append(icon('coin'), h('span', { text: coins(st.coins) + ' coins' }), h('span', { class: 'muted small', text: ` · ${st.marketEvent.name}` }));
clear(m.body);
if (current === 'reagents') renderReagents(lab, m.body, render);
else if (current === 'equipment') renderEquipment(lab, m.body, render);
else renderSell(lab, m.body, render);
};
render();
audio.play('page');
return m;
}
function renderReagents(lab, body, rerender) {
const st = lab.state;
body.appendChild(h('div', { class: 'muted small', text: `Prices per 100 ml. Shelf space: ${st.cap.storage} ml per reagent. Water from the well is free.` }));
const list = h('div', { class: 'list' });
for (const id of st.world.ingredients) {
const mt = st.lookup(id);
const locked = mt.tier > st.rank;
const price = st.priceOf(id);
const stock = st.stock(id);
const buyRow = h('div', { class: 'row buy-row', style: { flexWrap: 'wrap', justifyContent: 'flex-end' } });
if (!locked && id !== st.world.roles.water) {
for (const ml of [100, 250, 500]) {
const cost = Math.round((ml / 100) * price * 10) / 10;
const b = btn(`+${ml} ml`, () => {
const r = st.buy(id, ml);
if (r.ok) { audio.play('purchase'); lab.updateShelf(); } else { audio.play('error'); toast('Cannot buy', r.reason, 'lock'); }
rerender();
}, { cls: 'small', disabled: st.coins < cost || stock >= st.cap.storage, act: `buy-${id}-${ml}`, title: `Buy ${ml} ml for ${coins(cost)} coins` });
b.appendChild(h('span', { class: 'price' }, icon('coin'), coins(cost)));
buyRow.appendChild(b);
}
}
list.appendChild(h('div', { class: 'item parch' + (locked ? ' locked' : '') },
jarCanvas(mt, 18, 24),
h('div', {},
h('div', { class: 'title', text: mt.name }),
h('div', { class: 'meta', text: locked ? `Unlocks at the rank of ${RANKS[mt.tier].name}.` : mt.description }),
h('div', { class: 'meta', text: locked ? '' : `${mt.form} · ${coins(price)} per 100 ml · in stock: ${isFinite(stock) ? Math.round(stock) + ' ml' : 'unlimited'}` }),
),
locked ? icon('lock') : buyRow,
));
}
body.appendChild(list);
}
function renderEquipment(lab, body, rerender) {
const st = lab.state;
for (const cat of Object.keys(CAT_LABEL)) {
const items = EQUIPMENT.filter((e) => e.category === cat);
body.appendChild(h('h3', { class: 'muted', style: { margin: '10px 0 2px', fontWeight: 'normal' }, text: CAT_LABEL[cat] }));
const list = h('div', { class: 'list' });
for (const e of items) {
const owned = st.has(e.id);
const rankOk = e.rank <= st.rank;
const reqOk = !e.requires || e.requires.every((r) => st.has(r));
let action;
if (owned) action = h('span', { class: 'row' }, icon('check'), h('span', { class: 'small', text: 'Owned' }));
else if (!rankOk) action = h('span', { class: 'small muted', text: RANKS[e.rank].name });
else action = btn(`${coins(e.price)}`, async () => {
const ok = await confirmDialog(`Buy ${e.name}?`, `${e.desc}\n\nCost: ${e.price} coins.`, 'Buy');
if (!ok) return;
const r = st.buyEquipment(e.id);
if (r.ok) {
audio.play('purchase');
toast(`${e.name} installed`, e.desc, e.icon);
lab.buildActions();
lab.refreshCapabilities();
lab.save();
} else { audio.play('error'); toast('Cannot buy', r.reason, 'lock'); }
rerender();
}, { icon: 'coin', cls: 'gold', disabled: st.coins < e.price || !reqOk, act: 'equip-' + e.id });
list.appendChild(h('div', { class: 'item parch' + (owned || rankOk ? '' : ' locked') },
h('img', { src: icon(e.icon).src, class: 'ico lg', alt: '' }),
h('div', {}, h('div', { class: 'title', text: e.name }), h('div', { class: 'meta', text: e.desc + (!reqOk && !owned ? ' (requires the previous upgrade)' : '') })),
action,
));
}
body.appendChild(list);
}
}
function renderSell(lab, body, rerender) {
const st = lab.state;
body.appendChild(h('div', { class: 'muted small', text: 'The merchant buys back reagents at 40% of today’s price.' }));
const list = h('div', { class: 'list' });
for (const id of st.world.ingredients) {
const s = st.stock(id);
if (!isFinite(s) || s < 100) continue;
const mt = st.lookup(id);
const val = Math.round(st.priceOf(id) * 0.4 * 10) / 10;
list.appendChild(h('div', { class: 'item parch' }, jarCanvas(mt, 18, 24),
h('div', {}, h('div', { class: 'title', text: mt.name }), h('div', { class: 'meta', text: `${Math.round(s)} ml in stock · ${coins(val)} per 100 ml` })),
btn('Sell 100 ml', () => { const r = st.sellBack(id, 100); if (r.ok) { audio.play('coin'); lab.updateShelf(); } rerender(); }, { act: 'sell-' + id }),
));
}
if (!list.children.length) list.appendChild(h('div', { class: 'card parch', text: 'Nothing worth selling right now.' }));
body.appendChild(list);
}
function openIngredient(lab, id) {
const st = lab.state;
const m = st.lookup(id);
if (!m) return;
const k = st.knowledge[id] || {};
const has = (e) => lab.sandbox || st.has(e);
const tags = [];
tags.push(m.form);
if (m.form === 'powder') tags.push(m.friction > 0.68 ? 'piles steeply' : 'pours like sand');
else if (m.form === 'liquid') tags.push(m.viscosity < 3 ? 'thin' : m.viscosity < 300 ? 'syrupy' : 'very thick');
if (m.binder > 0.3) tags.push('forms dough');
if (m.solubility > 0.05) tags.push('soluble');
if (k.flammable || m.flammability > 0.3) tags.push(k.flammable ? 'flammable (seen)' : 'smells flammable');
if (m.glow > 0.2) tags.push('glows');
const water = st.lookup(st.world.roles.water);
const mixWater = compatFactor(m.compat[0], m.compat[1], water.compat[0], water.compat[1]) > 0.5;
tags.push(mixWater ? 'mixes with water' : 'does not mix with water');
const facts = h('div', { class: 'kv' },
h('span', { class: 'k', text: 'Colour' }), h('span', {}, swatch(m.look || m.color), ' ' + describeColor(m.look || m.color)),
h('span', { class: 'k', text: 'Density' }), h('span', { text: has('hydrometer') ? `${m.density.toFixed(2)} g/ml` : m.density > 1.3 ? 'heavy' : m.density < 0.9 ? 'light' : 'like water' }),
h('span', { class: 'k', text: m.form === 'powder' ? 'Grains' : 'Viscosity' }), h('span', { text: m.form === 'powder' ? `piles at ≈${Math.round(Math.atan(m.friction) * 180 / Math.PI)}°` + (m.solubility > 0.05 ? ', dissolves in water' : '') : has('viscometer') ? `${m.viscosity} cP` : viscosityClass(m.viscosity) }),
h('span', { class: 'k', text: 'Melts' }), h('span', { text: k.melt !== undefined ? `≈${k.melt}°C (observed)` : m.form === 'liquid' ? 'unknown (freeze it to find out)' : 'unknown' }),
h('span', { class: 'k', text: 'Boils' }), h('span', { text: k.boil !== undefined ? `≈${k.boil}°C (observed)` : isFinite(m.boil) ? 'unknown (heat it to find out)' : 'does not boil' }),
h('span', { class: 'k', text: 'Price' }), h('span', { text: `${coins(st.priceOf(id))} / 100 ml` }),
);
const asp = h('div', { class: 'aspect-bars' });
ASPECT_LABELS.forEach((label, i) => {
const v = m.aspects[i];
asp.append(h('span', { text: label }), h('div', { class: 'bar' }, h('i', { style: { width: Math.min(100, v) + '%' } })), h('span', { text: has('lens') ? String(Math.round(v)) : v >= 20 ? 'strong' : v >= 6 ? 'faint' : '—' }));
});
const reactions = st.world.reactions.filter((r) => (r.a === id || r.b === id) && st.journal['reaction:' + r.id]);
modal({
title: m.name,
body: [
h('div', { class: 'card parch ing-card' }, jarCanvas(m, 22, 30), h('div', {}, h('div', { text: m.description }), h('div', {}, ...tags.map((t) => h('span', { class: 'tag', text: t }))))),
h('div', { class: 'card parch' }, facts),
h('div', { class: 'card parch' }, h('div', { class: 'small muted', text: 'Magical potency' }), asp),
reactions.length ? h('div', { class: 'card parch' }, h('div', { class: 'small muted', text: 'Known reactions' }), ...reactions.map((r) => h('div', { class: 'small', text: `• ${r.name}: ${r.hint || ''}` }))) : null,
],
});
}
function openHint(lab) {
const st = lab.state;
const com = st.current;
if (!com) return;
const show = () => {
const ref = com.reference;
const total = ref.ingredients.reduce((a, b) => a + b.n, 0);
const rows = ref.ingredients.map((i) => h('div', { class: 'row' }, jarCanvas(st.lookup(i.id), 12, 16), h('span', { text: `${Math.round((i.n / total) * 100)}%  ${st.lookup(i.id).name}` })));
const steps = [];
if (ref.crush) steps.push('Crush the solid chunks with the pestle.');
if (ref.knead) steps.push('Stir and knead thoroughly.');
else steps.push('Stir until the colour is even.');
if ((ref.heatTo ?? 20) > 30) steps.push(`Heat to about ${Math.round(ref.heatTo)}°C and hold it there a while.`);
if ((ref.coolTo ?? 20) < 12) steps.push(`Chill it to about ${Math.round(ref.coolTo)}°C.`);
steps.push(`Serve at about ${Math.round(ref.serveTemp ?? 20)}°C; bottle at least ${com.bottleMl} ml.`);
modal({
title: 'Guild advice',
body: [
h('div', { class: 'card parch' }, h('div', { class: 'small muted', text: 'A guild alchemist would try roughly:' }), ...rows),
h('div', { class: 'card parch' }, ...steps.map((s) => h('div', { class: 'small', text: '• ' + s }))),
h('div', { class: 'small muted', text: 'Other approaches can work too — the customer only cares about the result.' }),
],
});
};
if (com.hintBought || !com.hintCost) { com.hintBought = true; show(); return; }
confirmDialog('Ask the guild?', `A guild alchemist will suggest an approach for ${com.hintCost} coins.`, 'Pay').then((ok) => {
if (!ok) return;
if (st.coins < com.hintCost) { toast('Not enough coins', '', 'coin'); return; }
st.coins = Math.round((st.coins - com.hintCost) * 10) / 10;
com.hintBought = true;
audio.play('coin');
lab.refreshHud();
show();
});
}
function showResult(lab, com, meas, ev, recipe, onDone) {
const st = lab.state;
const mood = ev.quality >= 0.7 ? 'happy' : ev.quality >= 0.4 ? 'neutral' : 'unhappy';
const portrait = /** @type {HTMLCanvasElement} */ (h('canvas'));
drawPortrait(portrait, com.customer.portrait, mood);
const arch = com.customer.title;
const quote = ev.quality >= 0.7 ? pick(com, 'pleased') : pick(com, 'displeased');
const table = h('table', { class: 'result-rows' });
for (const r of ev.rows) {
const label = PROPERTY_LABELS[r.req.key] || r.req.key;
const target = r.req.key === 'color' ? h('span', {}, swatch(r.req.rgb), ' ' + r.req.label) : h('span', { text: r.req.label });
const got = r.req.key === 'color' ? h('span', {}, swatch(meas.color), ' ' + r.text) : h('span', { text: r.text });
table.appendChild(h('tr', {}, h('td', {}, icon(r.score >= 0.999 ? 'check' : r.score > 0.5 ? 'star' : 'close', 'sm'), ' ' + label), h('td', {}, target), h('td', {}, got), h('td', { class: 'sc', text: Math.round(r.score * 100) + '%' })));
}
const nameInput = /** @type {HTMLInputElement} */ (h('input', { type: 'text', value: recipe.name, maxlength: '40', 'aria-label': 'Recipe name' }));
let saved = false;
const saveBtn = btn('Save recipe', () => {
if (saved) return;
saved = true;
const evs = st.addRecipe({ ...recipe, name: nameInput.value.trim() || recipe.name });
for (const e of evs) lab.announce(e);
toast('Recipe saved', nameInput.value, 'book');
saveBtn.disabled = true;
}, { icon: 'book', act: 'save-recipe' });
let m;
const done = btn('Continue', () => m.close(), { cls: 'primary', act: 'result-continue' });
m = modal({
title: ev.perfect ? 'A perfect potion!' : ev.quality >= 0.7 ? 'Sold!' : ev.quality >= 0.4 ? 'Sold — grudgingly' : 'Disappointing…',
closable: true,
onClose: onDone,
body: [
h('div', { class: 'card parch' },
h('div', { class: 'result-head' }, portrait, h('div', {},
h('div', { class: 'small muted', text: `${com.customer.name} · ${arch}` }),
h('div', { text: '“' + quote + '”' }),
h('div', { class: 'stars', text: starsText(ev.stars) }))),
h('div', { class: 'pay', text: `+${coins(ev.payment)} coins` }),
h('div', { class: 'small', style: { textAlign: 'center' }, text: `Reputation ${ev.repDelta >= 0 ? '+' : ''}${ev.repDelta} · quality ${Math.round(ev.quality * 100)}%` }),
h('div', { class: 'quality-bar' }, h('i', { style: { width: Math.round(ev.quality * 100) + '%' } })),
table),
h('div', { class: 'card parch' }, h('div', { class: 'small muted', text: 'Save this preparation to your recipe book:' }), h('div', { class: 'row' }, nameInput, saveBtn)),
],
foot: [done],
});
if (ev.perfect) audio.play('fanfare');
}
function pick(com, key) {
const lines = archetypeOf(com.customer.archetype)[key] || ['Hmm.'];
return lines[Math.floor(Math.random() * lines.length)];
}
function showDaySummary(lab, summary, onDone) {
const st = lab.state;
const net = summary.earned - summary.spent;
modal({
title: `Day ${summary.day} is over`,
onClose: onDone,
body: [
h('div', { class: 'card parch' },
h('div', { class: 'kv' },
h('span', { class: 'k', text: 'Customers served' }), h('span', { text: String(summary.served) }),
h('span', { class: 'k', text: 'Earned' }), h('span', { text: coins(summary.earned) }),
h('span', { class: 'k', text: 'Spent' }), h('span', { text: coins(summary.spent) }),
h('span', { class: 'k', text: 'Net' }), h('span', { text: (net >= 0 ? '+' : '') + coins(net) }),
h('span', { class: 'k', text: 'Rank' }), h('span', { text: `${st.rankName} (${st.reputation} rep)` }),
)),
h('div', { class: 'card parch' }, h('b', { text: `Tomorrow: ${st.marketEvent.name}` }), h('div', { class: 'small', text: st.marketEvent.text })),
st.nextRank() ? h('div', { class: 'small muted', text: `Next rank: ${st.nextRank().name} at ${st.nextRank().rep} reputation.` }) : null,
],
foot: [btn('Open the shop', () => document.querySelector('.overlay .modal-head .btn').dispatchEvent(new MouseEvent('click')), { cls: 'primary', act: 'next-day' })],
});
}
function showAnalysis(lab, m, recipe, title = 'Analysis of the brew') {
const st = lab.state;
const comp = Object.entries(m.composition).sort((a, b) => b[1] - a[1]);
const has = (e) => lab.sandbox || st.has(e);
const level = (v) => (v >= 66 ? 'high' : v >= 33 ? 'moderate' : 'low');
const density = has('hydrometer') ? `${m.density.toFixed(3)} g/ml` : `${m.density > 1.3 ? 'heavy' : m.density < 0.9 ? 'light' : 'like water'} (hydrometer for exact)`;
const visc = has('viscometer') ? `${viscosityClass(m.viscosity)} (${m.viscosity < 100 ? m.viscosity.toFixed(1) : Math.round(m.viscosity)} cP)` : viscosityClass(m.viscosity);
const assay = (v) => (has('assay') ? String(Math.round(v)) : `${level(v)} (assay kit for exact)`);
const aspect = (v) => (has('lens') ? String(Math.round(v)) : v >= 20 ? 'strong' : v >= 6 ? 'faint' : '—');
modal({
title,
body: [
h('div', { class: 'card parch' }, h('div', { class: 'kv' },
h('span', { class: 'k', text: 'Colour' }), h('span', {}, swatch(m.color), ' ' + describeColor(m.color)),
h('span', { class: 'k', text: 'Volume' }), h('span', { text: `${m.ml} ml` }),
h('span', { class: 'k', text: 'Temperature' }), h('span', { text: `${Math.round(m.temperature)}°C` }),
h('span', { class: 'k', text: 'Density' }), h('span', { text: density }),
h('span', { class: 'k', text: 'Viscosity' }), h('span', { text: visc }),
h('span', { class: 'k', text: 'Stability' }), h('span', { text: assay(m.stability) }),
h('span', { class: 'k', text: 'Volatility' }), h('span', { text: assay(m.volatility) }),
...['vitality', 'ardor', 'arcana', 'fortitude'].flatMap((k, i) => [h('span', { class: 'k', text: PROPERTY_LABELS[k] }), h('span', { text: aspect(m.aspects[i]) })]),
)),
h('div', { class: 'card parch' }, h('div', { class: 'small muted', text: 'Composition' }), ...comp.map(([id, f]) => h('div', { class: 'small', text: `${(f * 100).toFixed(1)}%  ${st.lookup(id) ? st.lookup(id).name : id}` }))),
lab.sandbox ? null : h('div', { class: 'row' }, btn('Save as recipe', () => { const ev = st.addRecipe({ ...recipe, name: 'Experiment ' + (st.recipes.length + 1) }); for (const e of ev) lab.announce(e); toast('Recipe saved', '', 'book'); }, { icon: 'book' })),
],
});
}
function openRecipes(lab) {
const st = lab.state;
const body = h('div');
const m = modal({ title: 'Recipe Book', body, wide: true });
const render = () => {
clear(m.body);
if (!st.recipes.length) {
m.body.appendChild(h('div', { class: 'card parch', text: 'Your recipe book is empty. After bottling a potion you can save how you made it here, then prepare it again later.' }));
return;
}
for (const r of st.recipes) {
const ing = r.ingredients.map((i) => `${i.ml} ml ${st.lookup(i.id) ? st.lookup(i.id).name : '?'}`).join(', ');
const steps = [];
if (r.crushed) steps.push('crush solids');
if (r.stirSeconds) steps.push(`stir ~${r.stirSeconds}s`);
if (r.maxTemp > 30) steps.push(`heat to ${r.maxTemp}°C`);
if (r.minTemp < 12) steps.push(`chill to ${r.minTemp}°C`);
steps.push(`serve at ${r.serveTemp}°C`);
const canAfford = r.ingredients.every((i) => lab.sandbox || st.stock(i.id) >= i.ml);
const actions = h('div', { class: 'row', style: { flexWrap: 'wrap' } },
btn('Prepare', () => { prepareRecipe(lab, r); m.close(); }, { icon: 'pour', disabled: !canAfford, title: canAfford ? 'Pour all ingredients' : 'Not enough stock', act: 'prepare' }),
st.has('homunculus') ? btn('Homunculus', () => { lab.startHomunculus(r); m.close(); }, { icon: 'homunculus', disabled: !canAfford, act: 'homunculus' }) : null,
btn('', async () => { const name = prompt('Rename recipe', r.name); if (name) { r.name = name.slice(0, 40); render(); } }, { icon: 'scroll', cls: 'icon', title: 'Rename' }),
btn('', async () => { if (await confirmDialog('Delete recipe?', r.name, 'Delete', 'danger')) { st.recipes.splice(st.recipes.indexOf(r), 1); render(); } }, { icon: 'trash', cls: 'icon danger', title: 'Delete' }),
);
m.body.appendChild(h('div', { class: 'item parch' },
swatch(r.result.color),
h('div', {},
h('div', { class: 'title', text: r.name }),
h('div', { class: 'meta', text: ing }),
h('div', { class: 'meta', text: steps.join(' · ') }),
h('div', { class: 'meta', text: `Result: ${describeColor(r.result.color)}, ${viscosityClass(r.result.viscosity)}, ${r.result.density.toFixed(2)} g/ml${r.quality !== null && r.quality !== undefined ? ` · sold at ${Math.round(r.quality * 100)}% quality` : ''}` }),
),
actions,
));
}
};
render();
audio.play('page');
}
function prepareRecipe(lab, r) {
const queue = r.ingredients.slice();
const next = () => {
if (!queue.length) {
toast('Ingredients poured', `Now ${r.stirSeconds ? 'stir' : 'mix'}${r.maxTemp > 30 ? `, heat to ${r.maxTemp}°C` : ''}${r.minTemp < 12 ? `, chill to ${r.minTemp}°C` : ''} and serve at ${r.serveTemp}°C.`, 'book', 6000);
return;
}
if (lab.sim.emitter.pouring) { setTimeout(next, 200); return; }
const i = queue.shift();
lab.selectIngredient(i.id);
lab.startPour(lab.pourX, Math.round(i.ml / SIM.ML_PER_PARTICLE));
setTimeout(next, 250);
};
next();
}
function openJournal(lab, tab = 'discoveries') {
const st = lab.state;
const tabs = h('div', { class: 'tabs' });
const m = modal({ title: 'Alchemist’s Journal', body: [], wide: true });
m.el.insertBefore(tabs, m.body);
let current = tab;
const render = () => {
clear(tabs);
for (const [k, label] of [['discoveries', 'Discoveries'], ['ingredients', 'Encyclopedia'], ['achievements', 'Achievements'], ['history', 'Sales']]) {
tabs.appendChild(btn(label, () => { current = k; render(); }, { cls: current === k ? 'active' : '', act: 'journal-tab-' + k }));
}
clear(m.body);
if (current === 'discoveries') {
const entries = Object.values(st.journal).filter((e) => e.kind !== 'ingredient').sort((a, b) => b.day - a.day);
const total = st.world.reactions.length;
m.body.appendChild(h('div', { class: 'small muted', text: `Reactions discovered: ${st.reactionsDiscovered()} of ${total}. Keep experimenting — heat, cold, stirring and new combinations all reveal secrets.` }));
if (!entries.length) m.body.appendChild(h('div', { class: 'card parch', text: 'Nothing recorded yet. Watch closely as you brew: boiling, freezing, dough, dissolving and reactions are all noted here.' }));
for (const e of entries) {
m.body.appendChild(h('div', { class: 'card parch' }, h('div', { class: 'row' }, icon(e.kind === 'reaction' ? 'eye' : e.kind === 'fire' ? 'flame' : e.kind === 'phase' ? 'thermo' : 'scroll'), h('b', { text: e.title }), h('span', { class: 'spacer' }), h('span', { class: 'small muted', text: `Day ${e.day}` })), h('div', { class: 'small', text: e.text })));
}
} else if (current === 'ingredients') {
const list = h('div', { class: 'list' });
const ids = st.world.ingredients.concat(st.world.materials.filter((x) => x.product && (st.knowledge[x.id] || {}).seen).map((x) => x.id));
for (const id of ids) {
const mt = st.lookup(id);
const known = mt.tier <= st.rank || (st.knowledge[id] || {}).seen;
list.appendChild(h('div', { class: 'item parch' + (known ? '' : ' locked') }, jarCanvas(mt, 14, 18),
h('div', {}, h('div', { class: 'title', text: known ? mt.name : '???' }), h('div', { class: 'meta', text: known ? mt.description : 'Not yet available.' })),
known ? btn('', () => openIngredient(lab, id), { icon: 'lens', cls: 'icon', title: 'Inspect' }) : icon('lock'),
));
}
m.body.appendChild(list);
} else if (current === 'achievements') {
const list = h('div', { class: 'list' });
for (const a of ACHIEVEMENTS) {
const got = !!st.achievements[a.id];
list.appendChild(h('div', { class: 'item parch' + (got ? '' : ' locked') }, icon(got ? 'star' : 'lock'), h('div', {}, h('div', { class: 'title', text: a.name }), h('div', { class: 'meta', text: a.desc })), h('span', { class: 'price' }, icon('coin', 'sm'), String(a.reward))));
}
m.body.appendChild(list);
} else {
if (!st.history.length) m.body.appendChild(h('div', { class: 'card parch', text: 'No sales yet.' }));
for (const s of st.history) {
m.body.appendChild(h('div', { class: 'item parch' }, s.color ? swatch(s.color) : icon('flask'), h('div', {}, h('div', { class: 'title', text: s.potion }), h('div', { class: 'meta', text: `Day ${s.day} · ${s.customer} (${s.title}) · ${Math.round(s.quality * 100)}%` })), h('span', {}, h('span', { class: 'stars', text: starsText(s.stars) }), h('div', { class: 'small', text: `+${coins(s.paid)}` }))));
}
}
};
render();
audio.play('page');
}
function openPause(lab) {
const app = lab.app;
let m;
const items = [
btn('Resume', () => m.close(), { cls: 'primary', icon: 'speed', act: 'resume' }),
btn('How to play', () => { m.close(); openHelp(); }, { icon: 'help', act: 'help' }),
btn('Settings & saves', () => { m.close(); openSettings(app, lab); }, { icon: 'gear', act: 'settings' }),
];
if (lab.state.receiver && lab.state.receiver.count) items.push(btn('Pour back distillate', () => { lab.pourReceiver(); m.close(); }, { icon: 'alembic' }));
if (!lab.sandbox) items.push(btn('Restart tutorial', () => { m.close(); lab.tutorial && lab.tutorial.start(true); }, { icon: 'bulb' }));
items.push(btn(lab.sandbox ? 'Leave experiment' : 'Save & quit to menu', () => { m.close(); app.showMenu(); }, { icon: 'door', act: 'quit' }));
m = modal({ title: lab.sandbox ? 'Free Experiment' : 'Paused', body: h('div', { class: 'list' }, items) });
}
function openHelp() {
const sec = (title, lines) => h('div', { class: 'card parch' }, h('h3', { text: title }), ...lines.map((l) => h('div', { class: 'small', text: '• ' + l })));
modal({
title: 'How to play',
wide: true,
body: [
sec('Your shop', ['Customers ask for potions with particular colour, thickness, temperature, potency and more. Their order card shows each requirement and a live meter of how well your brew matches.', 'Bottle when you are happy — the potion is drawn from the tap at the bottom of the cauldron, so the lowest layer comes out first.', 'Better matches earn more coins and reputation. Reputation unlocks ranks, reagents and equipment.']),
sec('Brewing', ['Tap a jar on the shelf, then hold your finger (or the mouse) inside the cauldron to pour. Dose buttons pour exact amounts.', 'Stir with the spoon: drag through the brew. Mixing starts where liquids touch and spreads; stirring speeds it up dramatically.', 'Powders pile up like sand. Knead a binding powder with a watery liquid to make dough; add more liquid to thin it.', 'Slide the fire control right to heat from below, left to cool. Heat spreads through the brew gradually.', 'Keep the lid on to trap vapour; let things cool and the vapour condenses back. Open the lid to let it escape.', 'Freeze liquids into blocks, then crush them with the pestle. Some reagents react when mixed, heated or chilled — discoveries go into your journal.']),
sec('Controls', ['Keys: 1 pour · 2 spoon · 3 pestle · 4 skimmer · 5 inspect · L lid · B bottle · F time speed · A auto-stir · arrows fire · S shop · R recipes · J journal · Esc menu.', 'Long-press (or right-click) a jar to inspect a reagent.', 'Use the time-speed button to skip waiting while things heat, cool or react.']),
sec('Tips', ['Ask the guild for advice on a difficult order — it costs a few coins.', 'Instruments like the hydrometer, viscometer, assay kit and aether lens turn rough guesses into exact readings.', 'If you run out of money, the guild will help a struggling apprentice once a day — and water from the well is always free.']),
],
});
}
function openSettings(app, lab) {
const s = app.settings;
const vol = (key, label) => {
const inp = /** @type {HTMLInputElement} */ (h('input', { type: 'range', class: 'vol', min: '0', max: '100', value: String(Math.round(s[key] * 100)), 'aria-label': label }));
inp.addEventListener('input', () => { s[key] = Number(inp.value) / 100; app.applySettings(); });
return h('div', { class: 'toggle-row' }, h('span', { text: label }), inp);
};
const check = (key, label, after) => {
const inp = /** @type {HTMLInputElement} */ (h('input', { type: 'checkbox', 'aria-label': label }));
inp.checked = !!s[key];
inp.addEventListener('change', () => { s[key] = inp.checked; app.applySettings(); after && after(); });
return h('div', { class: 'toggle-row' }, h('span', { text: label }), inp);
};
const quality = /** @type {HTMLSelectElement} */ (h('select', { 'aria-label': 'Graphics quality', style: { width: '50%' } }, ...['auto', 'high', 'medium', 'low'].map((q) => h('option', { value: q, text: q === 'auto' ? 'automatic' : q }))));
quality.value = s.quality;
quality.addEventListener('change', () => { s.quality = /** @type {any} */ (quality.value); app.applySettings(); if (lab) lab.resize(true); });
const fileIn = /** @type {HTMLInputElement} */ (h('input', { type: 'file', accept: '.json,application/json', class: 'hidden' }));
fileIn.addEventListener('change', async () => {
const f = fileIn.files && fileIn.files[0];
if (!f) return;
try {
const st = parseImport(await f.text());
if (await confirmDialog('Import this save?', `World "${st.seed}", day ${st.day}, ${coins(st.coins)} coins. Your current game will be replaced.`, 'Import')) {
saveGame(st);
toast('Save imported', '', 'check');
app.startGame(st);
}
} catch (e) {
toast('Import failed', e.message, 'close', 5000);
}
});
const saveSection = lab && !lab.sandbox ? h('div', { class: 'card parch' },
h('h3', { text: 'Saves' }),
h('div', { class: 'small', text: 'The game saves automatically on this device. Export a file to back it up or move it to another device.' }),
h('div', { class: 'row', style: { flexWrap: 'wrap', marginTop: '6px' } },
btn('Export save', () => { lab.save(); exportSave(lab.state); }, { icon: 'scroll', act: 'export' }),
btn('Import save', () => fileIn.click(), { icon: 'plus', act: 'import' }),
fileIn,
)) : h('div', { class: 'card parch' }, h('h3', { text: 'Saves' }), h('div', { class: 'row', style: { flexWrap: 'wrap' } }, btn('Import save', () => fileIn.click(), { icon: 'plus', act: 'import' }), fileIn));
modal({
title: 'Settings',
onClose: () => app.saveSettings(),
body: [
h('div', { class: 'card parch' }, h('h3', { text: 'Sound' }), vol('master', 'Master volume'), vol('sfx', 'Effects'), vol('music', 'Music'), check('musicOn', 'Play music', () => audio.music(s.musicOn)), check('muted', 'Mute everything')),
h('div', { class: 'card parch' }, h('h3', { text: 'Display' }), h('div', { class: 'toggle-row' }, h('span', { text: 'Graphics quality' }), quality), check('showFps', 'Show performance stats')),
saveSection,
h('div', { class: 'card parch small' }, 'The Alchemist’s Shop — all art, sound, font and code made for this game. Runs fully offline.'),
],
});
}
return { openShop, openIngredient, openHint, showResult, showDaySummary, showAnalysis, openRecipes, openJournal, openPause, openHelp, openSettings };
})();
// src/ui/tutorial.js
const __m44 = (() => {
const { h, btn } = __m2;
const { PHASE } = __m17;
const { MAX_SPECIES } = __m13;
class Tutorial {
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
this.box.style.left = Math.max(8, sr.left - lr.left + (sr.width - bw) / 2) + 'px';
this.box.style.top = Math.max(8, sr.top - lr.top + 8) + 'px';
}
advance() {
this.index++;
this.show();
}
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
return { Tutorial };
})();
// src/ui/lab.js
const __m21 = (() => {
const { Simulation } = __m22;
const { PHASE, SIM } = __m17;
const { snapshotSim, applySnapshot } = __m34;
const { clampToInterior } = __m32;
const { MAX_SPECIES } = __m13;
const { compatFactor } = __m18;
const { Renderer } = __m35;
const { drawPortrait } = __m39;
const { drawJar } = __m36;
const { measureParticles, tapSelection, probeSelection, viscosityClass } = __m16;
const { evaluatePotion, scoreRequirement, PROPERTY_LABELS, describeValue } = __m40;
const { processEvent } = __m41;
const { saveGame, saveJSON, KEYS } = __m20;
const { AutoBrewer } = __m42;
const { RANKS } = __m19;
const { describeColor, rgbToHex } = __m8;
const { h, btn, clear, toast, coins, confirmDialog } = __m2;
const { icon, iconUrl } = __m3;
const { audio } = __m4;
const panels = __m43;
const { Tutorial } = __m44;
const REQ_ICON = { color: 'palette', density: 'weight', viscosity: 'drop', temperature: 'thermo', vitality: 'heart', ardor: 'flame', arcana: 'eye', fortitude: 'shield', stability: 'scales', volatility: 'bubbles', quantity: 'flask' };
const TOOL_DEFS = [
{ id: 'pour', label: 'Pour', icon: 'pour', key: '1' },
{ id: 'spoon', label: 'Spoon', icon: 'spoon', key: '2' },
{ id: 'pestle', label: 'Pestle', icon: 'pestle', key: '3', needs: 'pestle' },
{ id: 'skimmer', label: 'Skimmer', icon: 'ladle', key: '4', needs: 'skimmer' },
{ id: 'probe', label: 'Inspect', icon: 'lens', key: '5' },
];
class LabScreen {
constructor(app, state, opts = {}) {
this.app = app;
this.state = state;
this.sandbox = !!opts.sandbox;
this.tool = 'spoon';
this.selected = null;
this.speed = 1;
this.pointer = { down: false, x: 0, y: 0, id: -1, wx: 0, wy: 0 };
this.pourX = 0.3;
this.lastPoured = {};
this.bottling = null;
this.probe = null;
this.thermal = false;
this.autoStir = false;
this.alembicOpen = false;
this.autoBrewer = null;
this.time = 0;
this.hudTimer = 0;
this.assayTimer = 0;
this.saveTimer = 0;
this.layerTimer = 0;
this.assay = null;
this.running = false;
this.fpsAcc = { t: 0, n: 0, fps: 0 };
this.perf = { intervals: new Float32Array(600), work: new Float32Array(600), n: 0, physMs: 0, renderMs: 0 };
this.stirLevel = 0;
this.lastBoil = 0;
this._raf = 0;
this.pendingCustomer = 0;
}
mount(root) {
this.root = root;
const st = this.state;
const cap = st.cap;
this.cap = cap;
this.sim = new Simulation({ size: /** @type {any} */ (cap.size), lookup: st.lookup, reactions: st.world.reactions });
this._applyFurnaceCaps();
if (st.cauldron) {
try {
applySnapshot(this.sim, st.cauldron, { lookup: st.lookup });
} catch (e) {
console.warn('Could not restore cauldron', e);
}
}
this.buildDom();
this.renderer = new Renderer(this.canvas);
this.autoQuality = /** @type {'high'|'medium'|'low'} */ ('high');
this.qualityCheck = { t: 0, slow: 0, frames: 0 };
this.renderer.quality = this.effectiveQuality();
this.onResize = () => this.resize();
window.addEventListener('resize', this.onResize);
this.resizeObs = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => this.resize()) : null;
if (this.resizeObs) this.resizeObs.observe(this.stageEl);
this.resize();
this.bindInput();
this.selectTool('spoon');
if (!this.sandbox) {
if (!st.current && !st.dayOver) this.bringCustomer(false);
this.tutorial = new Tutorial(this);
if (st.tutorial.active && !st.tutorial.done) this.tutorial.start();
}
this.refreshHud(true);
this.running = true;
this.lastT = performance.now();
const loop = (t) => {
if (!this.running) return;
this._raf = requestAnimationFrame(loop);
this.frame(t);
};
this._raf = requestAnimationFrame(loop);
this.onVis = () => {
if (document.hidden) this.save();
};
document.addEventListener('visibilitychange', this.onVis);
this.onUnload = () => this.save();
window.addEventListener('pagehide', this.onUnload);
audio.music(this.app.settings.music > 0 && this.app.settings.musicOn);
}
unmount() {
this.save();
this.running = false;
cancelAnimationFrame(this._raf);
window.removeEventListener('resize', this.onResize);
window.removeEventListener('keydown', this.onKey);
document.removeEventListener('visibilitychange', this.onVis);
window.removeEventListener('pagehide', this.onUnload);
if (this.resizeObs) this.resizeObs.disconnect();
if (this.tutorial) this.tutorial.stop();
audio.update({ fire: 0, stir: 0, pour: 0, boil: 0, cold: 0 }, 0);
this.el.remove();
}
_applyFurnaceCaps() {
const cap = this.state.cap;
Object.assign(this.sim.furnace, { maxFlame: cap.maxFlame, heatPower: cap.heatPower, minCool: cap.minCool, coolPower: cap.coolPower });
}
refreshCapabilities() {
const cap = this.state.cap;
if (cap.size !== this.cap.size) {
const snap = snapshotSim(this.sim, this.cap.size);
snap.size = cap.size;
const sim = new Simulation({ size: /** @type {any} */ (cap.size), lookup: this.state.lookup, reactions: this.state.world.reactions });
applySnapshot(sim, snap, { lookup: this.state.lookup });
this.sim = sim;
toast('New cauldron installed', `Your ${cap.size === 'medium' ? 'Copper Cauldron' : 'Grand Athanor Vessel'} is ready.`, 'cauldron');
}
this.cap = cap;
this._applyFurnaceCaps();
this.buildTools();
this.buildShelf();
this.resize(true);
this.refreshHud(true);
}
buildDom() {
const st = this.state;
this.el = h('div', { class: 'screen lab', 'data-mode': this.sandbox ? 'sandbox' : 'game' });
this.coinEl = h('span', { class: 'coins-val' });
this.rankName = h('div', { class: 'rankname' });
this.rankBar = h('i');
this.dayEl = h('div', { class: 'day' });
const nav = h('div', { class: 'nav-buttons' },
btn('', () => panels.openShop(this), { icon: 'bag', cls: 'icon', title: 'Shop & Guild (S)', act: 'shop' }),
btn('', () => panels.openRecipes(this), { icon: 'book', cls: 'icon', title: 'Recipe book (R)', act: 'recipes' }),
btn('', () => panels.openJournal(this), { icon: 'scroll', cls: 'icon', title: 'Journal (J)', act: 'journal' }),
);
if (this.sandbox) nav.firstChild.remove();
this.topbar = h('header', { class: 'topbar frame' },
btn('', () => panels.openPause(this), { icon: 'menu', cls: 'icon', title: 'Menu (Esc)', act: 'menu' }),
this.sandbox
? h('div', { class: 'stat' }, icon('flask'), h('span', { text: 'Free Experiment' }))
: h('div', { class: 'stat' }, icon('coin'), this.coinEl),
this.sandbox ? null : h('div', { class: 'rankrow' }, icon('star', 'rank-ico'), h('div', { class: 'stat rankbox' }, this.rankName, h('div', { class: 'bar' }, this.rankBar))),
this.sandbox ? null : this.dayEl,
h('div', { class: 'spacer' }),
nav,
);
this.custEl = h('section', { class: 'customer parch', 'aria-live': 'polite' });
this.brewPanel = h('div', { class: 'brew-panel' });
this.leftCol = h('div', { class: 'left-col' }, this.custEl, this.brewPanel);
if (this.sandbox) this.custEl.classList.add('hidden');
this.canvas = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'view', 'aria-label': 'Cauldron' }));
this.readout = h('div', { class: 'readout parch hidden' });
this.chips = h('div', { class: 'hud-chips' });
this.pourHint = h('div', { class: 'pour-hint chip hidden' });
this.stageEl = h('main', { class: 'stage' }, this.canvas, this.readout, this.chips, this.pourHint);
this.furnaceInput = /** @type {HTMLInputElement} */ (h('input', { type: 'range', min: '-100', max: '100', step: '1', value: '0', 'aria-label': 'Fire and frost control' }));
this.furnaceInput.addEventListener('input', () => {
const v = Number(this.furnaceInput.value) / 100;
this.setFurnace(Math.abs(v) < 0.06 ? 0 : v);
});
this.furnaceLabel = h('span', { class: 'flabel' });
this.furnaceIcon = icon('flame');
this.actions = h('div', { class: 'actions' });
this.controls = h('section', { class: 'controls frame' },
h('div', { class: 'furnace' }, this.furnaceIcon, this.furnaceInput, this.furnaceLabel),
this.actions,
);
this.toolsEl = h('div', { class: 'tools', role: 'toolbar' });
this.shelfEl = h('div', { class: 'shelf', role: 'listbox', 'aria-label': 'Ingredient shelf' });
this.doseEl = h('div', { class: 'dose' });
this.toolbar = h('nav', { class: 'toolbar frame' }, this.toolsEl);
this.shelfWrap = h('div', { class: 'shelf-wrap frame' }, h('div', { class: 'shelf-title small muted', text: 'Reagent shelf' }), this.shelfEl);
this.side = h('div', { class: 'side' }, this.shelfWrap, this.controls);
this.el.append(this.topbar, this.leftCol, this.stageEl, this.side, this.toolbar);
this.root.appendChild(this.el);
this.buildTools();
this.buildShelf();
this.buildDose();
this.placeDose();
}
placeDose() {
const desktop = window.matchMedia('(min-width: 960px) and (min-aspect-ratio: 1/1)').matches;
const parent = desktop ? this.shelfWrap : this.stageEl;
if (this.doseEl.parentElement !== parent) parent.appendChild(this.doseEl);
this.doseEl.classList.toggle('hidden', !desktop && this.tool !== 'pour');
}
buildActions() {
this.actionSets = [];
for (const container of [this.actions, this.mobileActs].filter(Boolean)) {
const a = clear(container);
const set = {};
set.lid = btn('', () => this.toggleLid(), { icon: 'lid', cls: 'icon', title: 'Lid on/off (L)', act: 'lid' });
set.stir = btn('', () => {}, { icon: 'gear', cls: 'icon', title: this.state.has('stirrer') ? 'Clockwork stirrer on/off (A)' : 'Hold to stir automatically', act: 'autostir' });
const startAuto = (e) => { e.preventDefault(); if (this.state.has('stirrer')) this.setAutoStir(!this.autoStir); else this.setAutoStir(true); };
const stopAuto = () => { if (!this.state.has('stirrer')) this.setAutoStir(false); };
set.stir.addEventListener('pointerdown', startAuto);
set.stir.addEventListener('pointerup', stopAuto);
set.stir.addEventListener('pointerleave', stopAuto);
set.stir.addEventListener('pointercancel', stopAuto);
set.speed = btn('1\u00d7', () => this.cycleSpeed(), { icon: 'speed', cls: 'icon', title: 'Time speed (F)', act: 'speed' });
a.append(set.lid, set.stir, set.speed);
if (this.state.has('thermal')) {
set.thermal = btn('', () => this.toggleThermal(), { icon: 'monocle', cls: 'icon', title: 'Heat map (T)', act: 'thermal' });
a.append(set.thermal);
}
if (this.state.has('alembic')) {
set.alembic = btn('', () => this.toggleAlembic(), { icon: 'alembic', cls: 'icon', title: 'Alembic valve', act: 'alembic' });
a.append(set.alembic);
}
a.append(btn('', () => this.emptyCauldron(), { icon: 'trash', cls: 'icon danger', title: 'Empty the cauldron', act: 'empty' }));
this.actionSets.push(set);
}
this.syncActions();
}
syncActions() {
for (const set of this.actionSets || []) {
set.lid.classList.toggle('active', !this.sim.cauldron.lidClosed);
set.lid.title = this.sim.cauldron.lidClosed ? 'Lid closed — tap to open (L)' : 'Lid open — tap to close (L)';
set.stir.classList.toggle('active', this.autoStir);
set.speed.classList.toggle('active', this.speed > 1);
const l = set.speed.querySelector('.lbl');
if (l) l.textContent = this.speed + '\u00d7';
if (set.thermal) set.thermal.classList.toggle('active', this.thermal);
if (set.alembic) set.alembic.classList.toggle('active', this.alembicOpen);
}
}
toggleThermal() {
this.thermal = !this.thermal;
this.syncActions();
}
buildTools() {
const t = clear(this.toolsEl);
this.toolBtns = {};
for (const d of TOOL_DEFS) {
if (d.needs && !this.state.has(d.needs)) continue;
const b = btn(d.label, () => this.selectTool(d.id), { icon: d.icon, title: `${d.label} (${d.key})`, act: 'tool-' + d.id });
this.toolBtns[d.id] = b;
t.appendChild(b);
}
t.appendChild(btn('Sample', () => this.sampleVial(), { icon: 'jar', title: 'Draw a test vial from the tap and analyse it', act: 'sample' }));
if (this.sandbox) t.appendChild(btn('Analyse', () => this.analyseAll(), { icon: 'assay', title: 'Analyse the whole brew', act: 'analyse' }));
t.appendChild(h('div', { class: 'sep' }));
this.mobileActs = h('div', { class: 'acts' });
t.appendChild(this.mobileActs);
if (this.actions) this.buildActions();
if (this.tool) this.selectTool(this.tool, true);
}
buildShelf() {
const sh = clear(this.shelfEl);
this.jarEls = {};
const st = this.state;
const ids = this.sandbox ? st.world.ingredients : st.world.ingredients.filter((id) => st.lookup(id).tier <= st.rank || st.stock(id) > 0);
const labels = shelfLabels(ids.map((id) => st.lookup(id).name));
for (const [n, id] of ids.entries()) {
const m = st.lookup(id);
const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: '15', height: '20' }));
const ctx = cv.getContext('2d');
drawJar(ctx, 1, 0, 13, 20, m.look || m.color, m.form);
const stock = h('span', { class: 'jstock' });
const el = h('button', { class: 'jar', title: m.name, 'aria-label': m.name, 'data-id': id, role: 'option' }, stock, cv, h('span', { class: 'jname', text: labels[n] }));
let pressTimer = 0;
el.addEventListener('pointerdown', () => { pressTimer = /** @type {any} */ (setTimeout(() => { pressTimer = -1; panels.openIngredient(this, id); }, 550)); });
const cancel = () => { if (pressTimer > 0) clearTimeout(pressTimer); };
el.addEventListener('pointerup', cancel);
el.addEventListener('pointerleave', cancel);
el.addEventListener('click', () => {
if (pressTimer === -1) { pressTimer = 0; return; }
this.selectIngredient(id);
});
el.addEventListener('contextmenu', (e) => { e.preventDefault(); panels.openIngredient(this, id); });
this.jarEls[id] = { el, stock };
sh.appendChild(el);
}
this.updateShelf();
}
buildDose() {
const d = clear(this.doseEl);
d.append(h('span', { class: 'muted dose-note', text: 'Dose:' }));
for (const ml of [25, 50, 100, 250]) {
d.append(btn(`${ml} ml`, () => this.pourDose(ml), { title: `Pour exactly ${ml} ml`, act: 'dose-' + ml }));
}
d.append(h('span', { class: 'muted dose-note', text: 'ml · or hold in the cauldron' }));
}
resize(force = false) {
this.placeDose();
const r = this.stageEl.getBoundingClientRect();
if (r.width < 10 || r.height < 10) return;
const st = this.state;
const jars = st.world.ingredients.slice(0, 14).map((id) => ({ color: st.lookup(id).look || st.lookup(id).color, form: st.lookup(id).form }));
if (force) this.renderer._key = '';
this.renderer.resize(Math.floor(r.width), Math.floor(r.height), this.sim.cauldron, jars, this.effectiveQuality());
}
effectiveQuality() {
const q = this.app.settings.quality;
return q === 'auto' || !q ? this.autoQuality : q;
}
adaptQuality(dt, workMs) {
const qc = this.qualityCheck;
qc.t += dt; qc.frames++;
if (workMs > 15) qc.slow++;
if (qc.t < 1.2) return;
const slowShare = qc.slow / Math.max(1, qc.frames);
qc.t = 0; qc.slow = 0; qc.frames = 0;
if (this.app.settings.quality !== 'auto' || slowShare < 0.5 || this.autoQuality === 'low') return;
this.autoQuality = this.autoQuality === 'high' ? 'medium' : 'low';
this.resize(true);
}
bindInput() {
const cv = this.canvas;
const pos = (e) => {
const r = cv.getBoundingClientRect();
return [e.clientX - r.left, e.clientY - r.top];
};
cv.addEventListener('pointerdown', (e) => {
if (this.pointer.down) return;
audio.unlock();
cv.setPointerCapture(e.pointerId);
const [x, y] = pos(e);
this.pointer = { down: true, x, y, id: e.pointerId, wx: 0, wy: 0 };
this.pointerWorld();
this.onPointerStart();
e.preventDefault();
});
cv.addEventListener('pointermove', (e) => {
const [x, y] = pos(e);
if (this.pointer.down && e.pointerId !== this.pointer.id) return;
this.pointer.x = x;
this.pointer.y = y;
this.pointerWorld();
this.hover = !this.pointer.down && e.pointerType === 'mouse';
if (this.pointer.down) this.onPointerMove();
else if (this.hover) this.onHover();
});
const end = (e) => {
if (!this.pointer.down || e.pointerId !== this.pointer.id) return;
this.pointer.down = false;
this.onPointerEnd();
};
cv.addEventListener('pointerup', end);
cv.addEventListener('pointercancel', end);
cv.addEventListener('pointerleave', () => { this.hover = false; });
cv.addEventListener('contextmenu', (e) => e.preventDefault());
this.onKey = (e) => this.handleKey(e);
window.addEventListener('keydown', this.onKey);
}
pointerWorld() {
const [wx, wy] = this.renderer.toWorld(this.pointer.x, this.pointer.y);
this.pointer.wx = wx;
this.pointer.wy = wy;
}
onPointerStart() {
const { wx, wy } = this.pointer;
if (this.tool === 'pour') {
if (!this.selected) { toast('Choose a reagent', 'Tap a jar on the shelf first.', 'jar'); return; }
this.startPour(wx);
} else if (this.tool === 'probe') {
this.probe = { x: wx, y: wy, r: 0.22 };
this.updateProbe();
} else {
this.setAutoStir(false);
const [x, y] = clampToInterior(this.sim, wx, wy, 0.1);
this.sim.tool.type = /** @type {any} */ (this.tool);
this.sim.tool.setTarget(x, y, true);
}
}
onPointerMove() {
const { wx, wy } = this.pointer;
if (this.tool === 'pour') {
this.pourX = this.clampPourX(wx);
this.sim.emitter.setX(this.pourX);
} else if (this.tool === 'probe') {
this.probe = { x: wx, y: wy, r: 0.22 };
} else {
const [x, y] = clampToInterior(this.sim, wx, wy, 0.1);
this.sim.tool.setTarget(x, y, true);
}
}
onHover() {
if (this.tool === 'spoon' || this.tool === 'pestle' || this.tool === 'skimmer') {
const [x, y] = clampToInterior(this.sim, this.pointer.wx, this.pointer.wy, 0.1);
if (!this.sim.tool.active) { this.sim.tool.x = x; this.sim.tool.y = y; this.sim.tool.tx = x; this.sim.tool.ty = y; }
}
}
onPointerEnd() {
if (this.tool === 'pour') {
if (this.sim.emitter.pouring && !this.sim.emitter.active.dose) this.sim.emitter.stop();
} else if (this.tool === 'probe') {
} else {
const t = this.sim.tool;
t.setTarget(t.x, t.y, false);
}
}
handleKey(e) {
if (e.target && /** @type {HTMLElement} */ (e.target).tagName === 'INPUT' && /** @type {any} */ (e.target).type !== 'range') return;
if (document.querySelector('.overlay')) {
if (e.key === 'Escape') { const x = /** @type {HTMLElement} */ (document.querySelector('.overlay .modal-head .btn')); if (x) x.click(); }
return;
}
const k = e.key.toLowerCase();
const def = TOOL_DEFS.find((d) => d.key === k);
if (def && this.toolBtns[def.id]) { this.selectTool(def.id); return; }
if (k === 'l') this.toggleLid();
else if (k === 'f') this.cycleSpeed();
else if (k === 'b' && !this.sandbox) this.startBottling();
else if (k === 's' && !this.sandbox) panels.openShop(this);
else if (k === 'r' && !this.sandbox) panels.openRecipes(this);
else if (k === 'j' && !this.sandbox) panels.openJournal(this);
else if (k === 'a') this.setAutoStir(!this.autoStir);
else if (k === 't' && this.state.has('thermal')) this.toggleThermal();
else if (k === 'escape') panels.openPause(this);
else if (k === 'arrowup' || k === 'arrowright') { this.setFurnace(Math.min(1, this.sim.furnace.setting + 0.1)); }
else if (k === 'arrowdown' || k === 'arrowleft') { this.setFurnace(Math.max(-1, this.sim.furnace.setting - 0.1)); }
else if (k === '0') this.setFurnace(0);
}
selectTool(id, silent = false) {
this.tool = id;
for (const [k, b] of Object.entries(this.toolBtns || {})) b.classList.toggle('active', k === id);
if (id !== 'probe') { this.probe = null; this.readout.classList.add('hidden'); }
if (id === 'spoon' || id === 'pestle' || id === 'skimmer') this.sim.tool.type = /** @type {any} */ (id);
if (id !== 'pour' && this.sim.emitter.pouring && !(this.sim.emitter.active && this.sim.emitter.active.dose)) this.sim.emitter.stop();
this.pourHint.classList.toggle('hidden', id !== 'pour');
this.updatePourHint();
if (this.doseEl) this.placeDose();
if (!silent) audio.play('select');
if (this.tutorial) this.tutorial.notify('tool', id);
}
selectIngredient(id) {
this.selected = id;
for (const [k, j] of Object.entries(this.jarEls)) j.el.classList.toggle('selected', k === id);
this.selectTool('pour', true);
audio.play('select');
this.updatePourHint();
if (this.tutorial) this.tutorial.notify('select', id);
}
updatePourHint() {
if (this.tool !== 'pour') return;
const m = this.selected ? this.state.lookup(this.selected) : null;
this.pourHint.textContent = m ? `Hold in the cauldron to pour ${m.name}` : 'Tap a reagent jar on the shelf';
}
clampPourX(x) {
const m = this.sim.cauldron.mouth - 0.15;
return Math.max(-m, Math.min(m, x));
}
canPour(id) {
if (this.sandbox) return Infinity;
return Math.floor(this.state.stock(id) / SIM.ML_PER_PARTICLE);
}
startPour(x, amount) {
const id = this.selected;
if (!id) return;
const avail = this.canPour(id);
if (avail <= 0) {
audio.play('error');
toast('Out of stock', `Buy more ${this.state.lookup(id).name} in the shop.`, 'bag');
return;
}
if (this.sim.p.count >= this.sim.maxParticles - 2) {
toast('The cauldron is full', 'Bottle, skim or empty it first.', 'cauldron');
return;
}
this.pourX = this.clampPourX(x);
const def = this.state.lookup(id);
const n = Math.min(avail, amount ?? Infinity);
this.sim.emitter.start(def, { x: this.pourX, amount: n });
this.sim.emitter.active.dose = amount !== undefined;
this.lastPoured[id] = this.sim.emitter.poured[id] || 0;
if (this.tutorial) this.tutorial.notify('pour', id);
}
pourDose(ml) {
if (!this.selected) { toast('Choose a reagent', 'Tap a jar on the shelf first.', 'jar'); return; }
if (this.tool !== 'pour') this.selectTool('pour', true);
this.startPour(this.pourX, Math.round(ml / SIM.ML_PER_PARTICLE));
}
accountPours() {
const em = this.sim.emitter;
for (const [id, total] of Object.entries(em.poured)) {
const prev = this.lastPoured[id] || 0;
const d = total - prev;
if (d <= 0) continue;
this.lastPoured[id] = total;
const ml = d * SIM.ML_PER_PARTICLE;
if (!this.sandbox) {
this.state.consume(id, ml);
if (this.state.stock(id) < SIM.ML_PER_PARTICLE && em.active && em.active.def.id === id) em.stop();
}
this.logPour(id, ml);
}
}
logPour(id, ml) {
const log = this.state.brewLog;
const last = log[log.length - 1];
if (last && last.type === 'pour' && last.id === id) last.ml += ml;
else log.push({ type: 'pour', id, ml, t: Math.round(this.sim.time) });
this.state.stats.brews = this.state.stats.brews || 0;
}
setFurnace(v) {
this.sim.furnace.setting = v;
this.furnaceInput.value = String(Math.round(v * 100));
if (this.tutorial) this.tutorial.notify('furnace', v);
}
toggleLid() {
const c = this.sim.cauldron;
c.lidClosed = !c.lidClosed;
audio.play('lid');
this.state.brewLog.push({ type: 'lid', closed: c.lidClosed, t: Math.round(this.sim.time) });
this.refreshHud();
}
toggleAlembic() {
this.alembicOpen = !this.alembicOpen;
this.syncActions();
toast(this.alembicOpen ? 'Alembic valve open' : 'Alembic valve closed', this.alembicOpen ? 'Vapour under the lid is drawn into the receiver flask.' : '', 'alembic', 2000);
}
cycleSpeed() {
this.speed = this.speed === 1 ? 2 : this.speed === 2 ? 4 : 1;
this.syncActions();
}
setAutoStir(on) {
if (this.autoStir === on) return;
this.autoStir = on;
const t = this.sim.tool;
const upgraded = this.state.has('stirrer');
t.auto = on;
if (on) {
t.type = 'spoon';
const c = this.sim.cauldron;
t.autoCenterX = 0;
t.autoCenterY = c.depth - 0.75;
t.autoRadius = upgraded ? c.belly * 0.55 : c.belly * 0.32;
t.autoPhase = 0;
} else {
t.setTarget(t.x, t.y, false);
}
this.syncActions();
}
async emptyCauldron() {
if (this.sim.p.count === 0) return;
const ok = await confirmDialog('Empty the cauldron?', 'Everything in the cauldron will be poured away. Ingredients are not refunded.', 'Empty it', 'danger');
if (!ok) return;
this.sim.clear();
this.state.brewLog = [];
this.lastPoured = {};
audio.play('splash');
this.save();
}
bringCustomer(withSound = true) {
const st = this.state;
if (this.sandbox) return;
const c = st.nextCustomer();
if (c && withSound) audio.play('bell');
this.refreshCustomer();
}
refreshCustomer() {
const st = this.state;
const el = clear(this.custEl);
const com = st.current;
this.reqEls = [];
el.classList.toggle('empty', !com);
if (com && !this._custInit) { this._custInit = true; el.classList.add('collapsed'); }
if (!com) {
if (st.dayOver) {
el.append(h('div', { class: 'empty-msg' }, `The last customer has left. Day ${st.day} is over.`),
h('div', { class: 'cust-actions' }, btn('Close shop for the night', () => this.endDay(), { cls: 'gold', icon: 'sun', act: 'end-day' })));
} else {
el.append(h('div', { class: 'empty-msg' }, 'The shop is quiet. Experiment, or call in the next customer.'),
h('div', { class: 'cust-actions' }, btn('Open the door', () => this.bringCustomer(true), { cls: 'gold', icon: 'door', act: 'next-customer' })));
}
return;
}
const portrait = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'portrait' }));
drawPortrait(portrait, com.customer.portrait, 'neutral');
this.portraitEl = portrait;
const list = h('ul', { class: 'reqs' });
for (const req of com.requirements) {
const now = h('span', { class: 'now' });
const meter = h('i');
const target = req.key === 'color'
? h('span', {}, h('span', { class: 'swatch', style: { background: rgbToHex(req.rgb) } }), req.label)
: h('span', { text: req.label });
const li = h('li', { class: 'req', title: PROPERTY_LABELS[req.key] }, icon(REQ_ICON[req.key] || 'star'), h('span', {}, h('span', { class: 'lbl-k', text: PROPERTY_LABELS[req.key] + ' ' }), target), now, h('div', { class: 'meter' }, meter));
list.appendChild(li);
this.reqEls.push({ req, li, now, meter });
}
const qNow = h('span', { class: 'now' });
const qMeter = h('i');
const qli = h('li', { class: 'req' }, icon('flask'), h('span', {}, h('span', { class: 'lbl-k', text: 'Quantity ' }), `${com.bottleMl} ml`), qNow, h('div', { class: 'meter' }, qMeter));
list.appendChild(qli);
this.reqEls.push({ req: { key: 'quantity' }, li: qli, now: qNow, meter: qMeter });
const info = h('div', { class: 'cust-info' },
h('div', { class: 'cust-head' }, h('span', { class: 'cust-name', text: `${com.customer.name} · ${com.customer.title}${com.contract ? ' · Guild contract' : ''}${com.grand ? ' · Grand Commission' : ''}` }),
h('span', { class: 'budget' }, icon('coin', 'sm'), ` up to ${coins(com.budget)}`)),
h('div', { class: 'potion-name', text: com.potionName }),
h('div', { class: 'dialogue', text: '“' + com.dialogue + '”' }),
list,
);
this.bottleBtn = btn('Bottle', () => this.startBottling(), { icon: 'flask', cls: 'primary', title: 'Bottle the potion (B)', act: 'bottle' });
const more = btn('', () => this.custEl.classList.toggle('collapsed'), { icon: 'scroll', cls: 'icon', title: 'Show the full order', act: 'cust-more' });
const side = h('div', { class: 'cust-side' }, this.bottleBtn, more);
const actions = h('div', { class: 'cust-actions' },
btn(com.hintCost ? `Advice (${com.hintCost})` : 'Advice', () => panels.openHint(this), { icon: 'bulb', cls: 'extra', title: 'Ask the guild for advice', act: 'hint' }),
com.tutorial ? null : btn('Decline', () => this.decline(), { icon: 'door', cls: 'extra', title: 'Send the customer away', act: 'decline' }),
);
el.append(portrait, info, side, actions);
portrait.addEventListener('click', () => this.custEl.classList.toggle('collapsed'));
this.updateAssay(true);
}
async decline() {
const ok = await confirmDialog('Decline this order?', 'The customer will leave without paying. Your reputation is not affected.', 'Decline', 'danger');
if (!ok) return;
this.state.declineCustomer();
this.refreshCustomer();
setTimeout(() => this.bringCustomer(true), 900);
}
endDay() {
const summary = this.state.endDay();
this.save();
panels.showDaySummary(this, summary, () => {
const relief = this.state.claimRelief();
if (relief) toast('Guild stipend', `The guild lends a struggling apprentice ${relief} coins.`, 'coin', 4000);
this.buildShelf();
this.bringCustomer(true);
this.refreshHud(true);
});
}
startBottling() {
if (this.sandbox || this.bottling) return;
const com = this.state.current;
if (!com) { toast('No order', 'Wait for a customer before bottling.', 'door'); return; }
const sel = tapSelection(this.sim, com.bottleN);
if (sel.length < 1) { toast('Nothing to bottle', 'There is no liquid at the tap.', 'flask'); audio.play('error'); return; }
const m = measureParticles(this.sim, sel);
this.sim.emitter.stop();
this.setAutoStir(false);
this.bottling = { total: sel.length, removed: 0, progress: 0, color: m.color, measurement: m, commission: com, t: 0 };
audio.play('glass');
if (this.tutorial) this.tutorial.notify('bottle');
}
stepBottling(dt) {
const b = this.bottling;
if (!b) return;
b.t += dt;
const target = Math.min(b.total, Math.ceil(b.total * Math.min(1, b.t / 1.4)));
const k = target - b.removed;
if (k > 0) {
const sel = tapSelection(this.sim, k).sort((a, c) => c - a);
for (const i of sel) this.sim.removeParticle(i);
b.removed += k;
}
b.progress = b.removed / Math.max(1, b.commission.bottleN);
if (b.t > 1.8) this.finishBottling();
}
finishBottling() {
const b = this.bottling;
this.bottling = null;
const ev = evaluatePotion(b.commission, b.measurement);
audio.play(ev.quality >= 0.7 ? 'coin' : 'fail');
const recipe = this.recipeDraft(b.measurement, ev, b.commission);
panels.showResult(this, b.commission, b.measurement, ev, recipe, () => {
const events = this.state.completeSale(ev, b.measurement);
for (const e of events) this.announce(e);
this.state.brewLog = this.state.brewLog.filter(() => false);
this.lastPoured = {};
this.save();
this.refreshCustomer();
this.refreshHud(true);
if (this.tutorial) this.tutorial.notify('sold');
if (!this.state.dayOver) setTimeout(() => this.bringCustomer(true), 1400);
});
}
recipeDraft(m, ev, com) {
const st = this.state;
const ing = [];
for (const e of st.brewLog) if (e.type === 'pour') ing.push({ id: e.id, ml: e.ml });
const agg = [];
for (const i of ing) {
const last = agg[agg.length - 1];
if (last && last.id === i.id) last.ml += i.ml;
else agg.push({ ...i });
}
const stats = st.brewLog.find((e) => e.type === 'stats') || {};
return {
name: com ? com.potionName : 'Experiment',
ingredients: agg,
maxTemp: Math.round(stats.maxT ?? m.temperature),
minTemp: Math.round(stats.minT ?? m.temperature),
serveTemp: Math.round(m.temperature),
stirSeconds: Math.round(stats.stir || 0),
crushed: !!stats.crushed,
lid: this.sim.cauldron.lidClosed,
result: { color: m.color, density: m.density, viscosity: m.viscosity, aspects: m.aspects, stability: m.stability, volatility: m.volatility, ml: m.ml },
quality: ev ? ev.quality : null,
customer: com ? com.customer.title : null,
day: st.day,
};
}
trackBrew(dt) {
const log = this.state.brewLog;
let s = log.find((e) => e.type === 'stats');
if (!s) { s = { type: 'stats', maxT: -1e9, minT: 1e9, stir: 0, crushed: false }; log.push(s); }
const p = this.sim.p;
if (p.count === 0) return;
let T = 0, n = 0;
for (let i = 0; i < p.count; i += 3) if (p.phase[i] !== PHASE.GAS) { T += p.temp[i]; n++; }
if (n) {
T /= n;
s.maxT = Math.max(s.maxT, T);
s.minT = Math.min(s.minT, T);
}
const t = this.sim.tool;
if (t.active && t.type === 'spoon' && t.speed > 0.2) s.stir += dt;
}
sampleVial() {
const n = this.state.current ? this.state.current.bottleN : 20;
const m = measureParticles(this.sim, tapSelection(this.sim, n));
if (!m) { toast('Nothing to sample', 'The cauldron is empty.', 'flask'); return; }
audio.play('glass');
panels.showAnalysis(this, m, this.recipeDraft(m, null, null), `Test vial · ${m.ml} ml from the tap`);
}
analyseAll() {
const sel = [];
for (let i = 0; i < this.sim.p.count; i++) if (this.sim.p.phase[i] !== PHASE.GAS) sel.push(i);
const m = measureParticles(this.sim, sel);
if (!m) { toast('Nothing to analyse', 'The cauldron is empty.', 'flask'); return; }
panels.showAnalysis(this, m, this.recipeDraft(m, null, null));
}
announce(e) {
if (e.type === 'achievement') {
toast(`Achievement: ${e.name}`, `${e.desc} (+${e.reward} coins)`, 'star', 4200);
audio.play('fanfare');
} else if (e.type === 'rank') {
toast(`Promoted to ${e.name}!`, 'New customers, reagents and equipment are available.', 'charter', 5000);
audio.play('fanfare');
this.buildShelf();
}
}
updateAssay(force = false) {
const com = this.state.current;
if (!com || !this.reqEls || !this.reqEls.length) return;
const sel = tapSelection(this.sim, com.bottleN);
const m = sel.length ? measureParticles(this.sim, sel) : null;
this.assay = m;
const cap = this.state;
for (const r of this.reqEls) {
let score = 0, text = '—';
if (m) {
if (r.req.key === 'quantity') {
const f = Math.min(1, m.ml / com.bottleMl);
score = f >= 0.98 ? 1 : f * f;
text = `${m.ml} ml`;
} else {
const s = scoreRequirement(r.req, m);
score = s.score;
text = this.readable(r.req.key, s.value, m, cap);
}
}
r.now.textContent = text;
r.meter.style.width = Math.round(score * 100) + '%';
r.meter.style.background = score >= 0.999 ? '#4c8a2a' : score > 0.6 ? '#c08a2a' : '#a83a2a';
r.li.classList.toggle('ok', score >= 0.999);
}
if (this.bottleBtn) this.bottleBtn.disabled = !m;
void force;
}
readable(key, value, m, st) {
const has = (id) => this.sandbox || st.has(id);
switch (key) {
case 'color': return value < 1 ? 'exact' : `ΔE ${value.toFixed(0)}`;
case 'temperature': return `${Math.round(value)}°C`;
case 'density': return has('hydrometer') ? `${value.toFixed(2)}` : '? (hydrometer)';
case 'viscosity': return has('viscometer') ? `${value < 100 ? value.toFixed(1) : Math.round(value)} cP` : viscosityClass(value);
case 'stability': case 'volatility': return has('assay') ? `${Math.round(value)}` : value > 66 ? 'high' : value > 33 ? 'medium' : 'low';
default: return has('lens') ? `${Math.round(value)}` : value >= 45 ? 'strong' : value >= 20 ? 'moderate' : value >= 6 ? 'faint' : 'none';
}
}
updateBrewPanel() {
const el = this.brewPanel;
if (!el || el.offsetParent === null) return;
const sim = this.sim, p = sim.p, st = this.state;
const n = p.count;
clear(el);
const card = h('div', { class: 'card parch brew-card' }, h('div', { class: 'row' }, icon('cauldron'), h('b', { text: 'In the cauldron' })));
el.appendChild(card);
if (!n) { card.append(h('div', { class: 'small muted', text: 'Empty. Pick a reagent and pour.' })); return; }
let tmin = 1e9, tmax = -1e9, tsum = 0, tn = 0;
const phases = [0, 0, 0, 0, 0];
for (let i = 0; i < n; i++) {
phases[p.phase[i]]++;
if (p.phase[i] === PHASE.GAS) continue;
const T = p.temp[i];
tmin = Math.min(tmin, T); tmax = Math.max(tmax, T); tsum += T; tn++;
}
const inv = sim.inventory();
const tot = Object.values(inv).reduce((a, b) => a + b, 0) || 1;
const comp = Object.entries(inv).sort((a, b) => b[1] - a[1]).slice(0, 6);
card.append(
h('div', { class: 'small', text: `${n * SIM.ML_PER_PARTICLE} ml · ${tn ? Math.round(tsum / tn) : '—'}°C${tn ? ` (${Math.round(tmin)}–${Math.round(tmax)})` : ''} · lid ${sim.cauldron.lidClosed ? 'on' : 'off'}` }),
h('div', { class: 'phase-bar' }, ...['liquid', 'powder', 'paste', 'solid', 'gas'].map((name, k) => phases[k] ? h('i', { class: 'ph-' + name, title: name, style: { flexGrow: String(phases[k]) } }) : null)),
h('div', { class: 'small muted', text: ['liquid', 'powder', 'paste', 'solid', 'vapour'].map((name, k) => (phases[k] ? `${name} ${Math.round((phases[k] / n) * 100)}%` : '')).filter(Boolean).join(' · ') }),
...comp.map(([id, v]) => {
const m = st.lookup(id);
return h('div', { class: 'row small' }, h('span', { class: 'swatch', style: { background: rgbToHex(m ? m.look || m.color : [0.5, 0.5, 0.5]), display: 'inline-block', width: '12px', height: '10px', boxShadow: '0 0 0 1px #2b1d14' } }), h('span', { text: `${Math.round((v / tot) * 100)}% ${m ? m.name : id}` }));
}),
);
}
updateProbe() {
if (!this.probe) return;
const sel = probeSelection(this.sim, this.probe.x, this.probe.y, this.probe.r);
const el = clear(this.readout);
el.classList.remove('hidden');
if (!sel.length) {
const c = this.sim.cauldron;
const wall = c.wallCellAt(this.probe.x, this.probe.y);
el.append(h('div', { text: wall >= 0 ? `Iron wall: ${Math.round(c.cellT[wall])}°C` : 'Empty space' }));
return;
}
const m = measureParticles(this.sim, sel);
const st = this.state;
const comp = Object.entries(m.composition).sort((a, b) => b[1] - a[1]).slice(0, 3);
const phase = Object.entries(m.phases).sort((a, b) => b[1] - a[1])[0][0];
el.append(
h('div', { class: 'rrow' }, h('span', { class: 'swatch', style: { background: rgbToHex(m.color), display: 'inline-block', width: '14px', height: '10px', boxShadow: '0 0 0 1px #2b1d14' } }), h('b', { text: `${describeColor(m.color)} ${phase}` })),
h('div', { text: `${Math.round(m.temperature)}°C · ${this.readable('viscosity', m.viscosity, m, st)}` }),
h('div', { text: `Density ${this.readable('density', m.density, m, st)}` }),
...comp.map(([id, f]) => h('div', { text: `${Math.round(f * 100)}% ${st.lookup(id) ? st.lookup(id).name : id}` })),
h('div', { text: ['vitality', 'ardor', 'arcana', 'fortitude'].map((k, i) => (m.aspects[i] >= 6 ? `${PROPERTY_LABELS[k]} ${this.readable(k, m.aspects[i], m, st)}` : '')).filter(Boolean).join(' · ') || 'No magical potency' }),
);
}
refreshHud(full = false) {
const st = this.state;
if (!this.sandbox) {
this.coinEl.textContent = coins(st.coins);
const r = st.rank, next = RANKS[r + 1];
this.rankName.textContent = RANKS[r].name;
const prog = next ? (st.reputation - RANKS[r].rep) / (next.rep - RANKS[r].rep) : 1;
this.rankBar.style.width = Math.round(Math.min(1, prog) * 100) + '%';
this.rankBar.parentElement.title = `Reputation ${st.reputation}${next ? ' / ' + next.rep : ''}`;
clear(this.dayEl).append(h('span', { text: `Day ${st.day} · ${Math.min(st.customerIndex + (st.current ? 1 : 0), st.customersPerDay)}/${st.customersPerDay}` }), h('span', { class: 'event', text: st.marketEvent.key !== 'none' ? st.marketEvent.name : '' }));
}
this.syncActions();
const f = this.sim.furnace.setting;
const c = this.sim.cauldron;
const label = f > 0.02 ? `Fire ${Math.round(f * 100)}%` : f < -0.02 ? `Frost ${Math.round(-f * 100)}%` : 'Off';
this.furnaceLabel.textContent = `${label} · ${Math.round(c.bottomTemperature())}°C`;
const want = iconUrl(f < -0.02 ? 'snow' : 'flame');
if (this.furnaceIcon.src !== want) this.furnaceIcon.src = want;
if (full) this.updateShelf();
this.updateChips();
}
updateShelf() {
if (!this.jarEls) return;
for (const [id, j] of Object.entries(this.jarEls)) {
const s = this.sandbox ? Infinity : this.state.stock(id);
j.stock.textContent = isFinite(s) ? (s >= 1000 ? (s / 1000).toFixed(1) + 'L' : String(Math.round(s))) : '∞';
j.el.classList.toggle('empty', s < SIM.ML_PER_PARTICLE);
}
}
updateChips() {
const c = clear(this.chips);
const sim = this.sim;
const p = sim.p;
let T = 0, n = 0, gas = 0;
for (let i = 0; i < p.count; i++) { if (p.phase[i] === PHASE.GAS) gas++; else { T += p.temp[i]; n++; } }
c.append(h('div', { class: 'chip', text: `${p.count * SIM.ML_PER_PARTICLE} ml / ${sim.maxParticles * SIM.ML_PER_PARTICLE} ml` }));
if (n) c.append(h('div', { class: 'chip', text: `Brew ${Math.round(T / n)}°C` }));
if (gas > 0) c.append(h('div', { class: 'chip', text: `Vapour ${gas * SIM.ML_PER_PARTICLE} ml${sim.cauldron.lidClosed ? '' : ' (escaping!)'}` }));
if (this.autoBrewer) c.append(h('div', { class: 'chip', text: `Homunculus: ${this.autoBrewer.status}` }));
if (this.state.receiver && this.state.receiver.count) c.append(h('div', { class: 'chip', text: `Receiver ${this.state.receiver.count * SIM.ML_PER_PARTICLE} ml` }));
if (this.app.settings.showFps) c.append(h('div', { class: 'chip', text: `${this.fpsAcc.fps} fps · ${sim.stats.stepMs.toFixed(1)} ms/step · ${p.count} particles` }));
}
frame(t) {
const tw0 = performance.now();
const pf = this.perf;
pf.intervals[pf.n % 600] = t - this.lastT;
let dt = (t - this.lastT) / 1000;
this.lastT = t;
if (dt > 0.1) dt = 0.1;
this.time += dt;
const fa = this.fpsAcc;
fa.t += dt; fa.n++;
if (fa.t >= 1) { fa.fps = Math.round(fa.n / fa.t); fa.t = 0; fa.n = 0; }
const modalOpen = !!document.querySelector('.overlay');
const sim = this.sim;
if (this.autoBrewer) {
const n = Math.min(12, Math.round((dt * this.speed) / SIM.DT));
for (let k = 0; k < n; k++) {
this.autoBrewer.tick();
sim.step();
if (this.autoBrewer.done) { toast('Homunculus finished', this.autoBrewer.failed ? 'It stopped — check your stock.' : 'The brew is ready to bottle.', 'homunculus'); this.autoBrewer = null; this.setFurnace(0); break; }
}
this.accountPours();
} else {
const cap = this.speed > 1 ? 10 : 6;
const budget = Math.max(8, Math.min(22, 30 - this.perf.renderMs));
const maxSteps = Math.max(1, Math.min(cap, Math.floor(budget / Math.max(0.3, sim.stats.stepMs || 1))));
sim.advance(dt, this.speed, maxSteps);
this.accountPours();
}
const tw1 = performance.now();
if (this.alembicOpen) this.collectVapour();
this.stepBottling(dt);
this.trackBrew(dt);
if (sim.events.length) {
const evs = sim.events.splice(0);
for (const e of evs) this.handleSimEvent(e);
}
this.hudTimer += dt;
this.assayTimer += dt;
this.saveTimer += dt;
this.layerTimer += dt;
if (this.hudTimer > 0.25) { this.hudTimer = 0; this.refreshHud(); this.updateShelf(); if (this.probe) this.updateProbe(); this.updateBrewPanel(); }
if (this.assayTimer > 0.35 && !this.bottling) { this.assayTimer = 0; this.updateAssay(); }
if (this.layerTimer > 2) { this.layerTimer = 0; this.detectLayers(); }
if (this.saveTimer > 15) { this.saveTimer = 0; this.save(); }
if (this.tutorial) this.tutorial.update();
const tool = sim.tool;
const stirTarget = tool.active && tool.type !== 'skimmer' ? Math.min(1, tool.speed / 2.5) : 0;
this.stirLevel += (stirTarget - this.stirLevel) * Math.min(1, dt * 10);
let boiling = 0;
if (sim.steps % 30 === 0) { for (let i = 0; i < sim.p.count; i++) if (sim.p.phase[i] === PHASE.GAS && sim.nCond[i] >= 3) boiling++; this.lastBoil = boiling; }
audio.update({ fire: Math.max(0, sim.furnace.setting), cold: Math.max(0, -sim.furnace.setting), stir: this.stirLevel, pour: sim.emitter.pouring ? 1 : 0, boil: Math.min(1, this.lastBoil / 30) }, dt);
const tw2 = performance.now();
const em = sim.emitter;
this.renderer.render({
sim,
time: this.time,
dt: modalOpen ? dt * 0.5 : dt,
pour: { active: em.pouring, x: em.active ? em.active.x : this.pourX, def: em.active ? em.active.def : null },
tool: { type: tool.type, x: tool.x, y: tool.y, active: tool.active },
toolHover: this.hover && (this.tool === 'spoon' || this.tool === 'pestle' || this.tool === 'skimmer'),
bottling: this.bottling ? { progress: this.bottling.progress, color: this.bottling.color } : null,
showBottle: !!this.state.current && !this.sandbox,
probe: this.tool === 'probe' ? this.probe : null,
thermal: this.thermal,
alembic: this.state.has('alembic'),
receiver: this.state.receiver,
stirrer: this.state.has('stirrer') && this.autoStir,
});
const tw3 = performance.now();
pf.work[pf.n % 600] = tw3 - tw0;
this.adaptQuality(dt, tw3 - tw0);
pf.n++;
pf.physMs = pf.physMs * 0.95 + (tw1 - tw0) * 0.05;
pf.renderMs = pf.renderMs * 0.95 + (tw3 - tw2) * 0.05;
}
perfReport() {
const pf = this.perf;
const m = Math.min(pf.n, 600);
const iv = Array.from(pf.intervals.slice(0, m)).sort((a, b) => a - b);
const wk = Array.from(pf.work.slice(0, m)).sort((a, b) => a - b);
const q = (a, f) => (a.length ? a[Math.min(a.length - 1, Math.floor(a.length * f))] : 0);
const mean = iv.reduce((a, b) => a + b, 0) / Math.max(1, m);
return {
frames: m,
fps: mean > 0 ? 1000 / mean : 0,
intervalP50: q(iv, 0.5), intervalP95: q(iv, 0.95), intervalP99: q(iv, 0.99),
workP50: q(wk, 0.5), workP95: q(wk, 0.95),
physMs: pf.physMs, renderMs: pf.renderMs, stepMs: this.sim.stats.stepMs,
particles: this.sim.p.count,
};
}
handleSimEvent(e) {
this.renderer.onEvent(e);
switch (e.type) {
case 'reaction': audio.play('reaction'); break;
case 'crush': if (Math.random() < 0.5) audio.play('crush'); break;
case 'ignite': audio.play('ignite'); break;
case 'phase': if (e.to === 'solid' && Math.random() < 0.15) audio.play('freeze'); break;
case 'full': toast('The cauldron is full', 'Bottle, skim or empty it before adding more.', 'cauldron'); break;
}
if (this.sandbox) return;
const r = processEvent(this.state, e);
for (const entry of r.entries) {
if (entry.kind === 'ingredient') continue;
toast(entry.kind === 'reaction' ? 'New reaction discovered!' : 'Discovery', entry.title, entry.kind === 'reaction' ? 'eye' : 'scroll', 3800);
audio.play('discover');
}
for (const a of r.achievements) this.announce(a);
}
detectLayers() {
if (this.sandbox) return;
const sim = this.sim, p = sim.p, sp = sim.species;
const counts = new Map();
for (let i = 0; i < p.count; i++) {
if (p.phase[i] !== PHASE.LIQUID) continue;
let best = -1, bf = 0.8;
for (let s = 0; s < sp.count; s++) if (p.comp[i * MAX_SPECIES + s] > bf) { bf = p.comp[i * MAX_SPECIES + s]; best = s; }
if (best >= 0) counts.set(best, (counts.get(best) || 0) + 1);
}
const slots = [...counts.entries()].filter(([, c]) => c >= 15).map(([s]) => s);
for (let a = 0; a < slots.length; a++) for (let b = a + 1; b < slots.length; b++) {
const A = slots[a], B = slots[b];
if (compatFactor(sp.compatA[A], sp.compatB[A], sp.compatA[B], sp.compatB[B]) < 0.2) {
const ids = [sp.defs[A].id, sp.defs[B].id].sort();
this.handleSimEvent({ type: 'layers', a: ids[0], b: ids[1] });
}
}
}
collectVapour() {
const sim = this.sim, p = sim.p, c = sim.cauldron;
if (!c.lidClosed) return;
const st = this.state;
st.receiver = st.receiver || { count: 0, comp: {}, color: [0.7, 0.8, 0.9] };
const rec = st.receiver;
let took = 0;
for (let i = p.count - 1; i >= 0 && took < 3; i--) {
if (p.phase[i] !== PHASE.GAS || p.y[i] > 0.25 || p.x[i] < c.mouth * 0.3) continue;
for (let s = 0; s < sim.species.count; s++) {
const f = p.comp[i * MAX_SPECIES + s];
if (f > 0 && sim.species.defs[s]) rec.comp[sim.species.defs[s].id] = (rec.comp[sim.species.defs[s].id] || 0) + f;
}
rec.color = [sim.colR[i], sim.colG[i], sim.colB[i]];
rec.count++;
sim.removeParticle(i);
took++;
}
if (took && rec.count >= 4) {
const r = st.unlock('distil');
for (const a of r) this.announce(a);
}
}
pourReceiver() {
const rec = this.state.receiver;
if (!rec || !rec.count) return;
const sim = this.sim;
const total = Object.values(rec.comp).reduce((a, b) => a + b, 0) || 1;
const ids = Object.keys(rec.comp);
let made = 0;
for (let k = 0; k < rec.count; k++) {
const x = (Math.random() - 0.5) * sim.cauldron.mouth;
const i = sim.addParticle(this.state.lookup(ids[0]), x, 0.2 + Math.random() * 0.2, PHASE.LIQUID, 20);
if (i < 0) break;
sim.p.comp.fill(0, i * MAX_SPECIES, (i + 1) * MAX_SPECIES);
for (const id of ids) {
const s = sim.slotFor(this.state.lookup(id));
if (s >= 0) sim.p.comp[i * MAX_SPECIES + s] += rec.comp[id] / total;
}
sim.p.dirty[i] = 1;
made++;
}
this.state.receiver = null;
toast('Distillate poured back', `${made * SIM.ML_PER_PARTICLE} ml returned to the cauldron.`, 'alembic');
}
startHomunculus(recipe) {
const plan = {
ingredients: recipe.ingredients.map((i) => ({ id: i.id, n: Math.round(i.ml / SIM.ML_PER_PARTICLE) })),
heatTo: recipe.maxTemp, coolTo: recipe.minTemp, serveTemp: recipe.serveTemp, knead: recipe.stirSeconds > 12, crush: recipe.crushed, hold: 12,
};
this.autoBrewer = new AutoBrewer(this.sim, plan, this.state.lookup, {
onPour: (id, n) => {
const ml = n * SIM.ML_PER_PARTICLE;
if (!this.sandbox && this.state.stock(id) < ml) return false;
return true;
},
});
toast('The homunculus gets to work', recipe.name, 'homunculus');
}
save() {
if (this.sandbox) {
saveJSON(KEYS.sandbox, { seed: this.state.seed, cauldron: snapshotSim(this.sim, this.cap.size) });
return;
}
this.state.cauldron = snapshotSim(this.sim, this.cap.size);
saveGame(this.state);
}
}
function shelfLabels(names) {
const last = names.map((nm) => nm.split(' ').slice(-1)[0]);
return names.map((nm, i) => {
if (last.filter((l) => l === last[i]).length < 2) return last[i];
const words = nm.split(' ');
return words.length > 1 ? words[0] : nm;
});
}
return { LabScreen, describeValue };
})();
// src/materials/reference.js
const __m46 = (() => {
const { completeMaterial } = __m9;
const REF = {};
const add = (d) => (REF[d.id] = completeMaterial(d));
add({ id: 'water', name: 'Spring Water', form: 'liquid', archetype: 'water', color: [0.62, 0.8, 0.95], tint: 0.12, opacity: 0.55,
density: 1.0, viscosity: 1, compat: [0.85, 0.1], conductivity: 1, heatCapacity: 4.2, melt: 0, boil: 100, gasDensity: 0.62, latentVapor: 380, latentFusion: 60 });
add({ id: 'oil', name: 'Lamp Oil', form: 'liquid', archetype: 'oil', color: [0.95, 0.72, 0.25], tint: 0.6, opacity: 0.75,
density: 0.82, viscosity: 40, compat: [0.15, 0.1], conductivity: 0.3, heatCapacity: 1.8, melt: -20, boil: 280, flammability: 0.9, ignition: 230, combustionHeat: 900, smoke: 'smoke' });
add({ id: 'honey', name: 'Bog Honey', form: 'liquid', archetype: 'syrup', color: [0.9, 0.62, 0.12], tint: 0.7, opacity: 0.85,
density: 1.42, viscosity: 6000, viscTemp: 0.045, compat: [0.78, 0.18], conductivity: 0.6, heatCapacity: 3.2, melt: -10, boil: 190 });
add({ id: 'spirit', name: 'Moon Spirit', form: 'liquid', archetype: 'spirit', color: [0.82, 0.95, 0.85], tint: 0.15, opacity: 0.4,
density: 0.79, viscosity: 1.2, compat: [0.55, 0.15], conductivity: 0.8, heatCapacity: 2.4, melt: -110, boil: 72, gasDensity: 1.5, flammability: 0.8, ignition: 360, combustionHeat: 700, smoke: 'smoke', latentVapor: 260 });
add({ id: 'quick', name: 'Quickwater', form: 'liquid', archetype: 'metal', color: [0.78, 0.8, 0.84], tint: 0.9, opacity: 1,
density: 3.2, viscosity: 1.5, compat: [0.5, 0.95], conductivity: 4, heatCapacity: 1.6, melt: -38, boil: 360 });
add({ id: 'red', name: 'Crimson Essence', form: 'liquid', archetype: 'essence', color: [0.86, 0.12, 0.16], tint: 1, opacity: 0.8,
density: 1.04, viscosity: 1.5, compat: [0.82, 0.12], melt: -5, boil: 104 });
add({ id: 'blue', name: 'Azure Tincture', form: 'liquid', archetype: 'essence', color: [0.12, 0.3, 0.9], tint: 1, opacity: 0.8,
density: 1.06, viscosity: 1.5, compat: [0.84, 0.12], melt: -5, boil: 104 });
add({ id: 'sand', name: 'River Sand', form: 'powder', archetype: 'sand', color: [0.78, 0.66, 0.45], tint: 0.6, opacity: 1,
density: 1.6, compat: [0.8, 0.2], friction: 0.65, melt: 1500, boil: Infinity, heatCapacity: 1.3, conductivity: 0.4 });
add({ id: 'flour', name: 'Mill Dust', form: 'powder', archetype: 'binder', color: [0.93, 0.9, 0.82], tint: 0.5, opacity: 1,
density: 1.3, compat: [0.8, 0.15], friction: 0.72, binder: 1, melt: 1500, boil: Infinity, heatCapacity: 1.6, conductivity: 0.3, flammability: 0.4, ignition: 420, combustionHeat: 400, ash: 'soot' });
add({ id: 'salt', name: 'Sun Salt', form: 'powder', archetype: 'salt', color: [0.97, 0.93, 0.98], tint: 0.2, opacity: 1,
density: 2.1, compat: [0.86, 0.1], friction: 0.6, solubility: 0.25, solubilityTemp: 0.002, melt: 800, boil: Infinity, heatCapacity: 1.9, conductivity: 1.2 });
add({ id: 'wax', name: 'Bee Wax Flakes', form: 'powder', archetype: 'wax', color: [0.98, 0.9, 0.6], tint: 0.6, opacity: 0.95,
density: 0.92, compat: [0.15, 0.12], friction: 0.55, viscosity: 30, melt: 62, boil: 360, heatCapacity: 2.2, conductivity: 0.3, latentFusion: 40, flammability: 0.7, ignition: 250, combustionHeat: 800, smoke: 'smoke', ash: 'soot' });
add({ id: 'crystal', name: 'Moonstone Shard', form: 'solid', archetype: 'crystal', color: [0.7, 0.75, 1.0], tint: 0.8, opacity: 1,
density: 2.4, compat: [0.7, 0.4], friction: 0.6, melt: 1200, boil: Infinity, hardness: 0.6, heatCapacity: 2, conductivity: 1.5, aspects: [0, 0, 40, 10], glow: 0.4 });
add({ id: 'soot', name: 'Soot', form: 'powder', archetype: 'ash', color: [0.18, 0.17, 0.17], tint: 0.9, opacity: 1,
density: 1.1, compat: [0.5, 0.3], friction: 0.7, melt: 3000, boil: Infinity, heatCapacity: 1, conductivity: 0.2 });
add({ id: 'smoke', name: 'Smoke', form: 'gas', archetype: 'smoke', color: [0.45, 0.43, 0.42], tint: 0.6, opacity: 0.6,
density: 0.9, gasDensity: 0.9, compat: [0.5, 0.3], melt: -200, boil: -150, heatCapacity: 1.2, conductivity: 0.2 });
add({ id: 'vapor', name: 'Swamp Vapour', form: 'gas', archetype: 'gas', color: [0.5, 0.8, 0.4], tint: 0.5, opacity: 0.5,
density: 1.1, gasDensity: 2.2, compat: [0.6, 0.3], melt: -90, boil: 8, heatCapacity: 2.0 });
const refLookup = (id) => REF[id];
return { REF, refLookup };
})();
// src/ui/menu.js
const __m45 = (() => {
const { h, btn } = __m2;
const { Renderer } = __m35;
const { Simulation } = __m22;
const { REF, refLookup } = __m46;
const { hasSave, loadGame } = __m20;
const { audio } = __m4;
class MenuScreen {
constructor(app) {
this.app = app;
this.running = false;
}
mount(root) {
const app = this.app;
this.canvas = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'menu-bg', 'aria-hidden': 'true' }));
const save = hasSave() ? loadGame().state : null;
const panel = h('div', { class: 'menu-panel frame' },
h('h1', { text: 'The Alchemist’s Shop' }),
h('div', { class: 'subtitle', text: 'Brew. Experiment. Prosper.' }),
save ? btn(`Continue — Day ${save.day}, ${save.rankName}`, () => app.continueGame(), { cls: 'primary', icon: 'door', act: 'continue' }) : null,
btn('New Shop', () => app.newGameDialog(), { cls: save ? '' : 'primary', icon: 'plus', act: 'new-game' }),
btn('Free Experiment', () => app.startSandbox(), { icon: 'flask', act: 'sandbox' }),
h('div', { class: 'row' }, btn('How to play', () => app.openHelp(), { icon: 'help', act: 'help' }), btn('Settings', () => app.openSettings(), { icon: 'gear', act: 'menu-settings' })),
h('div', { class: 'footer', text: 'Works offline · progress saves on this device' }),
);
this.el = h('div', { class: 'screen menu' }, this.canvas, panel);
root.appendChild(this.el);
this.sim = new Simulation({ size: 'small', lookup: refLookup });
this.sim.cauldron.lidClosed = false;
this.sim.furnace.setting = 0.55;
this.renderer = new Renderer(this.canvas);
this.renderer.quality = 'medium';
this.resize = () => {
const r = this.el.getBoundingClientRect();
const jars = Object.values(REF).slice(0, 12).map((m) => ({ color: m.look || m.color, form: m.form }));
this.renderer.resize(Math.floor(r.width), Math.floor(r.height), this.sim.cauldron, jars, 'medium');
};
window.addEventListener('resize', this.resize);
this.resize();
this.t = 0;
this.script = 0;
this.running = true;
let last = performance.now();
const loop = (now) => {
if (!this.running) return;
this.raf = requestAnimationFrame(loop);
const dt = Math.min(0.05, (now - last) / 1000);
last = now;
this.t += dt;
this.demo();
this.sim.advance(dt, 1, 3);
this.sim.events.length = 0;
this.renderer.render({ sim: this.sim, time: this.t, dt, pour: { active: this.sim.emitter.pouring, x: this.sim.emitter.active ? this.sim.emitter.active.x : 0, def: this.sim.emitter.active ? this.sim.emitter.active.def : null }, tool: { type: 'spoon', x: this.sim.tool.x, y: this.sim.tool.y, active: this.sim.tool.active } });
};
this.raf = requestAnimationFrame(loop);
audio.music(app.settings.musicOn && app.settings.music > 0);
}
demo() {
const sim = this.sim;
const steps = [
[0.3, () => sim.emitter.start(REF.water, { x: -0.4, amount: 120 })],
[2.5, () => sim.emitter.start(REF.red, { x: 0.6, amount: 30 })],
[4.5, () => sim.emitter.start(REF.blue, { x: -0.7, amount: 30 })],
[7, () => { sim.tool.auto = true; sim.tool.autoCenterY = sim.cauldron.depth - 0.5; sim.tool.autoRadius = 0.7; }],
[12, () => { sim.tool.auto = false; sim.tool.setTarget(0, 2, false); }],
[13, () => sim.emitter.start(REF.sand, { x: 0.8, amount: 40 })],
[16, () => sim.emitter.start(REF.oil, { x: 0, amount: 40 })],
];
while (this.script < steps.length && this.t >= steps[this.script][0]) steps[this.script++][1]();
if (this.t > 24 && sim.p.count > 0) {
for (let k = 0; k < 3 && sim.p.count > 0; k++) sim.removeParticle(sim.p.count - 1);
if (sim.p.count === 0) { this.t = 0; this.script = 0; sim.clear(); }
}
}
unmount() {
this.running = false;
cancelAnimationFrame(this.raf);
window.removeEventListener('resize', this.resize);
this.el.remove();
}
}
return { MenuScreen };
})();
// src/ui/app.js
const __m1 = (() => {
const { h, btn, modal, toast, setOverlayRoot, setToastRoot, confirmDialog, clear } = __m2;
const { icon } = __m3;
const { audio } = __m4;
const { GameState } = __m5;
const { EQUIPMENT } = __m19;
const { loadGame, saveGame, hasSave, deleteSave, loadJSON, saveJSON, KEYS, storageAvailable } = __m20;
const { LabScreen } = __m21;
const { MenuScreen } = __m45;
const { openSettings, openHelp } = __m43;
const { Rng } = __m6;
const DEFAULT_SETTINGS = { master: 0.8, sfx: 0.8, music: 0.35, musicOn: true, muted: false, quality: 'auto', showFps: false };
const SEED_WORDS = ['amber', 'ashen', 'brine', 'copper', 'dusk', 'elder', 'fen', 'gloam', 'hollow', 'iron', 'juniper', 'kelp', 'lantern', 'moon', 'nettle', 'oak', 'pewter', 'quill', 'raven', 'sage', 'thorn', 'umber', 'vale', 'willow', 'wyrm', 'yarrow'];
class App {
constructor(root) {
this.root = root;
this.settings = loadJSON(KEYS.settings, { ...DEFAULT_SETTINGS });
this.screen = null;
setOverlayRoot(root);
setToastRoot(root);
this.applySettings();
const unlock = () => {
audio.unlock();
audio.music(this.settings.musicOn && this.settings.music > 0);
};
root.addEventListener('pointerdown', unlock, { capture: true });
root.addEventListener('keydown', unlock, { capture: true });
}
applySettings() {
const s = this.settings;
audio.setVolumes({ master: s.master, sfx: s.sfx, music: s.music, muted: s.muted });
}
saveSettings() {
saveJSON(KEYS.settings, this.settings);
}
_swap(screen) {
if (this.screen && this.screen.unmount) this.screen.unmount();
clear(this.root);
setToastRoot(this.root);
this.screen = screen;
screen.mount(this.root);
}
start() {
this.showMenu();
if (!storageAvailable()) toast('Saving unavailable', 'This browser mode blocks local storage, so progress cannot be saved.', 'lock', 6000);
}
showMenu() {
this._swap(new MenuScreen(this));
}
continueGame() {
const { state, error } = loadGame();
if (state) this.startGame(state);
if (error) toast('Save problem', error, 'scroll', 6000);
}
startGame(state) {
try {
this._swap(new LabScreen(this, state));
} catch (e) {
console.error(e);
toast('Could not start', String(e && e.message), 'close', 6000);
this.showMenu();
}
}
newGameDialog() {
const rng = new Rng(Date.now() >>> 0);
const seedIn = /** @type {HTMLInputElement} */ (h('input', { type: 'text', value: `${rng.pick(SEED_WORDS)}-${rng.pick(SEED_WORDS)}-${rng.int(10, 99)}`, maxlength: '32', 'aria-label': 'World seed' }));
const tut = /** @type {HTMLInputElement} */ (h('input', { type: 'checkbox', 'aria-label': 'Play the tutorial' }));
tut.checked = true;
let m;
const go = async () => {
if (hasSave()) {
const ok = await confirmDialog('Start a new shop?', 'Your current saved game will be replaced. Export it first from Settings if you want to keep it.', 'Start anew', 'danger');
if (!ok) return;
}
const seed = seedIn.value.trim() || 'alchemy';
const st = GameState.create(seed, { tutorial: tut.checked });
deleteSave();
saveGame(st);
m.close();
this.startGame(st);
};
m = modal({
title: 'A New Shop',
body: [
h('div', { class: 'card parch' },
h('div', { class: 'small', text: 'Every world has its own reagents, reactions and customers, generated from its seed. Share a seed to share a world.' }),
h('label', { class: 'field' }, 'World seed', seedIn),
h('div', { class: 'toggle-row' }, h('span', { text: 'Guided first brew (recommended)' }), tut)),
],
foot: [btn('Open my shop', go, { cls: 'primary', icon: 'door', act: 'start-game' })],
});
}
startSandbox() {
const saved = loadJSON(KEYS.sandbox, null);
const existing = loadGame().state;
const seed = existing ? existing.seed : saved && saved.seed ? saved.seed : 'experiment';
const st = GameState.create(seed, { tutorial: false });
for (const id of st.world.ingredients) st.inventory[id] = Infinity;
st.equipment = EQUIPMENT.map((e) => e.id);
st.reputation = 99999;
st.current = null;
if (saved && saved.seed === seed && saved.cauldron) st.cauldron = saved.cauldron;
this._swap(new LabScreen(this, st, { sandbox: true }));
toast('Free Experiment', 'Unlimited reagents and every tool. Nothing here affects your shop.', 'flask', 4500);
}
openSettings() {
openSettings(this, null);
}
openHelp() {
openHelp();
}
}
return { App, icon };
})();
// src/main.js
const __m0 = (() => {
const { App } = __m1;
const root = document.getElementById('app');
const app = new App(root);
/** @type {any} */ (window).__alchemist = app;
app.start();
if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !/[?&]nosw/.test(location.search)) {
window.addEventListener('load', () => {
navigator.serviceWorker.register('./sw.js').catch(() => {});
});
}
return {  };
})();