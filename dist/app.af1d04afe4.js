// The Alchemist's Shop 2.0.0 — bundled build
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
flask: ['....kkkk....', '....kwWk....', '....kwWk....', '...kkwWkk...', '..kwwwWWWk..', '.kwmmmmmmWk.', 'kwmmlmmmmmWk', 'kwmmmmmmmmWk', 'kwmmmmmmmPWk', '.kwmmmmmPWk.', '..kkkkkkkk..', '............'],
lid: ['............', '.....kk.....', '....knnk....', '..kkkkkkkk..', '.kSsssssssk.', 'kSsWWWWWWssk', 'kssssssssssk', 'kkkkkkkkkkkk', '............', '............', '............', '............'],
trash: ['....kkkk....', '.kkkkkkkkkk.', 'kWWWWWWWWWWk', '.kkkkkkkkkk.', '.kWsWsWsWsk.', '.kWsWsWsWsk.', '.kWsWsWsWsk.', '.kWsWsWsWsk.', '.kWsWsWsWsk.', '.kWsWsWsWsk.', '..kkkkkkkk..', '............'],
speed: ['............', 'k.....k.....', 'kk....kk....', 'kyk...kyk...', 'kyyk..kyyk..', 'kyyyk.kyyyk.', 'kyyyk.kyyyk.', 'kyyk..kyyk..', 'kyk...kyk...', 'kk....kk....', 'k.....k.....', '............'],
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
scales: ['.....kk.....', '....kyyk....', 'kkkkkyykkkkk', 'kyyyyyyyyyyk', '.k...yy...k.', 'kyk..yy..kyk', 'kyk..yy..kyk', 'kkkk.yy.kkkk', '.....yy.....', '...kkyykk...', '..kyyyyyyk..', '..kkkkkkkk..'],
drop: ['.....kk.....', '.....kbk....', '....kbbk....', '....kbbbk...', '...kbcbbk...', '...kbcbbbk..', '..kbccbbbk..', '..kbcbbbbBk.', '..kbbbbbbBk.', '..kbbbbbBBk.', '...kbbBBBk..', '....kkkkk...'],
lock: ['...kkkkkk...', '..kSsssssk..', '..ksk..ksk..', '..ksk..ksk..', '.kkkkkkkkkk.', '.kyyyyyyyyk.', '.kyyykkyyyk.', '.kyyykkyyYk.', '.kyyyykyyYk.', '.kyyyyyyYYk.', '.kkkkkkkkkk.', '............'],
check: ['............', '..........kk', '.........kgk', '........kggk', '.k.....kggk.', 'kgk...kggk..', 'kggk.kggk...', '.kggkggk....', '..kgggk.....', '...kgk......', '....k.......', '............'],
bulb: ['...kkkkk....', '..kllllyk...', '.kllwlllyk..', '.klwllllyk..', '.klllllllyk.', '.kllllllyyk.', '..kllllyyk..', '...kllyyk...', '...kWWWWk...', '...kSSSSk...', '...kWWWWk...', '....kkkk....'],
door: ['..kkkkkkkk..', '.knnnnnnnnk.', '.knNnnnnNnk.', '.knNnnnnNnk.', '.knnnnnnnnk.', '.knNnnnnNnk.', '.knNnnnnyyk.', '.knnnnnnyyk.', '.knNnnnnNnk.', '.knNnnnnNnk.', '.knnnnnnnnk.', 'kkkkkkkkkkkk'],
plus: ['............', '....kkkk....', '....kgGk....', '....kgGk....', '.kkkkgGkkkk.', '.kgggggggGk.', '.kGGGgGGGGk.', '.kkkkgGkkkk.', '....kgGk....', '....kGGk....', '....kkkk....', '............'],
jar: ['...kkkkkk...', '...knnnnk...', '..kkkkkkkk..', '..kcwwwwck..', '.kcwbbbbbck.', '.kwbbbbbbbk.', '.kwbbcbbbbk.', '.kwbbbbbbBk.', '.kwbbbbbbBk.', '.kcbbbbbBck.', '..kkkkkkkk..', '............'],
ladle: ['............', '.......kkkk.', '......kWWsk.', '.....kWsk...', '....kWsk....', '...kWsk.....', '.kkkkk......', 'kWyyyWk.....', 'kyWyWyk.....', 'kWyWyWk.....', '.kkkkk......', '............'],
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
monocle: ['....kkkk....', '...krrrok...', '..kroyyyok..', '..koyyyyyk..', '..kryyyyok..', '..krroyyrk..', '...krrrrk...', '....kkkk.k..', '.........k..', '..........k.', '...........k', '............'],
pour: ['............', '..kkkkkk....', '..knnnnk....', '.kkkkkkkk...', '.kcwwwwck...', 'kwbbbbbbbk..', 'kwbbbbbbbkk.', 'kwbbbbbbbbbk', '.kbbbbbbk.kb', '..kkkkkk...b', '...........b', '...........b'],
rose: ['....kkkk....', '...kmmmmk...', '..kmmlmmmk..', '..kmlmmlmk..', '..kmmmmmmk..', '...kmmmmk...', '....kkkk.k..', '.....kg.kgk.', '..kk.kgkgk..', '.kgGkkgGk...', '..kkk.kgk...', '......kk....'],
skull: ['............', '...kkkkkk...', '..kwwwwwwk..', '.kwwwwwwwWk.', '.kwkkwwkkWk.', '.kwkkwwkkWk.', '.kwwwkkwwWk.', '..kwwwwwWk..', '...kwkwkWk..', '...kwkwkk...', '....kkkk....', '............'],
mortar: ['..........kk', '.........kWk', '........kWk.', '.......kWk..', '......kWk...', '.kkkkkWkkkk.', 'kWWWWsWWWWsk', '.kssssssssk.', '.kssssssssk.', '..kssssssk..', '...kkkkkk...', '..kkkkkkkk..'],
seedling: ['............', '...kk..kk...', '..kgGkkgGk..', '..kggGkggk..', '...kgGgGk...', '.....kGk....', '.....kGk....', '..kkkkkkkk..', '..knnnnnnk..', '..knNnnnnk..', '...knnnnk...', '...kkkkkk...'],
stone: ['............', '............', '....kkkkk...', '..kkWWWsskk.', '.kWWsssssSk.', '.kWssssssSSk', 'kWsssssssSSk', 'kssssssssSSk', 'kSssssssSSSk', '.kSSSSSSSSk.', '..kkkkkkkk..', '............'],
wisp: ['.....k......', '....kck.....', '....kcck....', '...kcwck....', '..kcwwwck...', '..kcwlwck...', '.kcwwlwwck..', '.kcwlllwck..', '.kcwwlwwck..', '..kcwwwck...', '...kccck....', '....kkk.....'],
satchel: ['...kkkkkk...', '..kN....Nk..', '.kN......Nk.', 'kkkkkkkkkkkk', 'knnnnnnnnnnk', 'knnnkyykknnk', 'knnnkyykknnk', 'knnnnkknnnNk', 'knnnnnnnnnNk', 'knnnnnnnnNNk', '.kNNNNNNNNk.', '..kkkkkkkk..'],
stall: ['kkkkkkkkkkkk', 'krrwwrrwwrrk', 'krrwwrrwwrrk', '.kkkkkkkkkk.', '.kn......nk.', '.kn.kmk..nk.', '.kn.kmk..nk.', 'kkkkkkkkkkkk', 'knnnnnnnnnnk', 'knNnnnnnNnnk', 'knnnnnnnnnnk', 'kkkkkkkkkkkk'],
dropper: ['..........kk', '.........kmk', '........kmmk', '.......kmmk.', '......kwWk..', '.....kwWk...', '....kwWk....', '...kwWk.....', '..kwWk......', '.kcWk.......', '.kck........', '..k.........'],
leaf: ['..........kk', '........kkgk', '......kkgggk', '....kkgggGgk', '...kgggGgggk', '..kggGgggggk', '..kgGgggggk.', '.kgGgggggk..', '.kGgggGkk...', 'kGgkkkk.....', 'kk..........', '............'],
gem: ['............', '...kkkkkk...', '..kpwppPPk..', '.kpwpppPPPk.', 'kkkkkkkkkkkk', '.kpwpppPPk..', '..kpwppPk...', '...kpwPk....', '....kpk.....', '.....k......', '............', '............'],
spark: ['.....k......', '....kyk.....', '....kyk..k..', '.k..kyk.kyk.', 'kyk.kyykyk..', '.kyykyyyk...', '..kyyllyyk..', '...kyyykyyk.', '..kyk.kyk.k.', '.kyk..kyk...', '..k....k....', '............'],
bottle: ['....kkkk....', '....knnk....', '....kWWk....', '...kwwWWk...', '..kwmmmmWk..', '.kwmmlmmmWk.', '.kwmmmmmmWk.', '.kwmmmmmmPk.', '.kwmmmmmPWk.', '..kwmmmPWk..', '...kkkkkk...', '............'],
trophy: ['.kkkkkkkkkk.', 'kykyyyyyykyk', 'kyykyyyykyyk', '.kyyyyyyyyk.', '..kyyyyyYk..', '...kyyyYk...', '....kyYk....', '.....kk.....', '....kyYk....', '...kkkkkk...', '..kyyyyyYk..', '..kkkkkkkk..'],
feather: ['..........kk', '........kkpk', '.......kppPk', '......kpwpk.', '.....kpwppk.', '....kpwppk..', '...kpwppk...', '..kpwppk....', '..kwppk.....', '.kkkkk......', 'kk..........', '............'],
toad: ['............', '..kk....kk..', '.kwkk..kkwk.', '.kkggkkggkk.', '.kggggggggk.', 'kggggggggggk', 'kgGggggggGgk', 'kggkkkkkkggk', '.kgggggggGk.', 'kGk.kkkk.kGk', 'kk........kk', '............'],
salamander: ['............', '.kk.........', 'kook........', 'kkoyok..kk..', '..kooykkook.', '...kooooook.', '..kokoooyok.', '.kok.kooook.', '.kk..kokkok.', '.....kk..kk.', '............', '............'],
moth: ['..k......k..', '...k....k...', '.kkkk..kkkk.', 'kpwppkkppwpk', 'kppwpkkpwppk', '.kpppkkpppk.', '..kkpkkpkk..', '...kpkkpk...', '..kppkkppk..', '..kkk..kkk..', '............', '............'],
sprout: ['....kk.kk...', '...kgGkgGk..', '....kgkgk...', '.....kGk....', '...kkkkkk...', '..knnnnnnk..', '..knwnnwnk..', '..knnkknnk..', '..knnnnnnk..', '...knnnnk...', '..kk.kk.kk..', '............'],
can: ['............', '..kkkk......', '.k....k.....', '.kkkkkkkk..k', 'kbbbbbbbbkkb', 'kbcbbbbbbbk.', 'kbbbbbbbbk..', 'kbbbbbbbbk..', 'kbbbbbbbBk..', '.kBBBBBBk...', '..kkkkkk....', '............'],
seal: ['...kkkkkk...', '..krrrrrrk..', '.krrlrrrrRk.', 'krrlrrrrrrRk', 'krrrryyrrrRk', 'krrryyyyrrRk', 'krrrryyrrrRk', '.krrrrrrrRk.', '..kRRRRRRk..', '..kbk..kbk..', '.kbbk..kbbk.', '.kkk....kkk.'],
deal: ['............', '............', 'kk........kk', 'kNk..kk..kNk', 'kNnkkyykknNk', 'kNnyyyyyynNk', 'kNnyykyykyNk', '.kkyyyyyyyk.', '...kyyyyk...', '....kkkk....', '............', '............'],
refund: ['....kkkk....', '..kkyyyykk..', '.kyyyyyyyyk.', '.kyykyyyyyk.', 'kyykkkkkkyyk', 'kykkkkkkkkyk', 'kyykkkkkkyyk', 'kyyykyyyyyyk', '.kyyyyyyyyk.', '.kyyyyyyyyk.', '..kkyyyykk..', '....kkkk....'],
up: ['.....kk.....', '....kggk....', '...kggggk...', '..kggggggk..', '.kkkkggkkkk.', '....kggk....', '....kggk....', '....kggk....', '....kggk....', '....kggk....', '....kkkk....', '............'],
down: ['............', '....kkkk....', '....krrk....', '....krrk....', '....krrk....', '....krrk....', '....krrk....', '.kkkkrrkkkk.', '..krrrrrrk..', '...krrrrk...', '....krrk....', '.....kk.....'],
warn: ['.....kk.....', '....kyyk....', '....kyyk....', '...kyykyk...', '...kykkyk...', '..kyykkyyk..', '..kyykkyyk..', '.kyyyyyyyyk.', '.kyyykkyyyk.', 'kyyyykkyyyyk', 'kkkkkkkkkkkk', '............'],
well: ['..kkkkkkkk..', '.kN......Nk.', 'kN........Nk', 'kkkkkkkkkkkk', 'knnnnnnnnnnk', 'kbbbbbbbbbbk', 'kbcbbbbbbbbk', 'knnnnnnnnnnk', '.knnnnnnnnk.', '.knnnnnnnnk.', '..kkkkkkkk..', '............'],
replay: ['...kkkkk....', '..kwwwwwk.k.', '.kwkkkkkwkwk', 'kwk....kwwwk', 'kwk...kwwwwk', 'kwk....kkkkk', 'kwk.........', 'kwk......kk.', '.kwk....kwk.', '..kwkkkkwk..', '...kwwwwk...', '....kkkk....'],
clock: ['...kkkkkk...', '..kwwwwwwk..', '.kwwwkwwwwk.', 'kwwwwkwwwwWk', 'kwwwwkwwwwWk', 'kwwwwkkkkwWk', 'kwwwwwwwwwWk', 'kwwwwwwwwwWk', '.kwwwwwwwWk.', '..kWWWWWWk..', '...kkkkkk...', '............'],
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
noticeHost = null;
notices.length = 0;
}
let noticeHost = null;
const notices = [];
let noticeTimer = 0;
function setNoticeHost(el) {
noticeHost = el;
notices.length = 0;
if (noticeTimer) clearTimeout(noticeTimer);
noticeTimer = 0;
}
function nextNotice() {
noticeTimer = 0;
if (!noticeHost || !noticeHost.isConnected) return;
const n = notices.shift();
clear(noticeHost);
if (!n) { noticeHost.classList.remove('on'); return; }
noticeHost.classList.add('on');
noticeHost.title = n.text ? `${n.title} — ${n.text}` : n.title;
noticeHost.append(h('div', { class: 'notice-msg' }, icon(n.icon, 'sm'), h('b', { text: n.title }), n.text ? h('span', { text: n.text }) : null));
noticeTimer = /** @type {any} */ (setTimeout(nextNotice, notices.length ? Math.min(n.ms, 1600) : n.ms));
}
function toast(title, text = '', iconName = 'star', ms = 3200) {
if (noticeHost && noticeHost.isConnected) {
notices.push({ title, text, icon: iconName, ms });
while (notices.length > 4) notices.shift();
if (!noticeTimer) nextNotice();
return;
}
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
return { h, btn, clear, setOverlayRoot, modal, confirmDialog, setToastRoot, setNoticeHost, toast, coins, starsText };
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
glow: 0,
price: 4,
tier: 0,
product: false,
};
function completeMaterial(def) {
const m = /** @type {MaterialDef} */ ({ archetype: 'custom', description: '', ...MATERIAL_DEFAULTS, ...def });
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
return { MATERIAL_DEFAULTS, completeMaterial, appearance, volatilityOf, serializeMaterial, deserializeMaterial };
})();
// src/materials/generator.js
const __m7 = (() => {
const { Rng } = __m6;
const { hslToRgb } = __m8;
const { completeMaterial } = __m9;
const INGREDIENT_SPECS = [
{ role: 'water', kind: 'water', names: ['Well Water'], form: 'liquid', hue: [202, 0.5, 0.84], tint: 0.12, opacity: 0.5,
density: 1.0, viscosity: 1, compat: [0.85, 0.1], boil: 100, melt: 0, heatCapacity: 4.2, gasDensity: 0.62, latentVapor: 380,
magic: {}, lore: 'Plain water from your well. It has no magic: it carries and dilutes.' },
{ role: 'dew', kind: 'liquid', names: ['Moonwell Dew', 'Dawn Dew', 'Silver Dew', 'Lily Dew'], form: 'liquid', hue: [150, 0.42, 0.74], tint: 0.42, opacity: 0.55,
density: 1.02, viscosity: 1.6, compat: [0.84, 0.12], boil: 102, melt: -4, heatCapacity: 4.0,
magic: { vitality: 56, charm: 14, levity: 8 }, fadeT: 72, superT: -520, superKey: 'vitality',
lore: 'Dew from the moon lilies. It mends and soothes.' },
{ role: 'sap', kind: 'liquid', names: ['Ember Sap', 'Cinder Sap', 'Hearth Sap'], form: 'liquid', hue: [16, 0.85, 0.42], tint: 0.85, opacity: 0.85,
density: 1.18, viscosity: 60, viscTemp: 0.04, compat: [0.63, 0.28], boil: 190, melt: -12, heatCapacity: 3.0,
flammability: 0.4, ignition: 270, combustionHeat: 700,
magic: { ardor: 62, vitality: 12, bane: 6 }, fadeT: 150, superT: 1300, superKey: 'ardor',
lore: 'Warm sap of the ember tree. Slow to blend while cold.' },
{ role: 'frostmilk', kind: 'liquid', names: ['Frostmilk', 'Rime Milk', 'Snowcap Milk'], form: 'liquid', hue: [196, 0.35, 0.9], tint: 0.4, opacity: 0.92,
density: 1.04, viscosity: 3, compat: [0.85, 0.13], boil: 99, melt: -9, heatCapacity: 4.0,
magic: { frost: 60, levity: 12, charm: 6 }, fadeT: 46, superT: -46, superKey: 'frost',
lore: 'Milk of the frost lily. Its magic dies in the smallest heat.' },
{ role: 'witchoil', kind: 'liquid', names: ['Witch Oil', 'Nightshade Oil', 'Hexberry Oil'], form: 'liquid', hue: [285, 0.55, 0.3], tint: 0.9, opacity: 0.9,
density: 0.86, viscosity: 28, viscTemp: 0.03, compat: [0.44, 0.24], boil: 240, melt: -20, heatCapacity: 2.0,
flammability: 0.7, ignition: 235, combustionHeat: 850,
magic: { bane: 46, levity: 26, charm: 10 }, fadeT: 125, superT: 94, superKey: 'levity',
lore: 'Pressed from hexberries. It floats apart from water until both are hot.' },
{ role: 'sunstone', kind: 'stone', shape: 'stone', names: ['Sunstone', 'Daystone', 'Gold Topaz'], hue: [42, 0.85, 0.58], density: 2.2, hardness: 0.6,
sol: 0.12, solT: 0.0025, glow: 0.35, magic: { ardor: 70, vitality: 20 }, fadeT: 220, superT: 1650, superKey: 'ardor',
lore: 'A stone that stores the sun. Grind it; hot water draws its warmth.' },
{ role: 'glacite', kind: 'stone', shape: 'crystal', names: ['Glacite', 'Rime Crystal', 'Ice Spar'], hue: [190, 0.55, 0.8], density: 1.9, hardness: 0.5,
sol: 0.15, solT: 0.002, glow: 0.2, magic: { frost: 72, levity: 10 }, fadeT: 58, superT: -1450, superKey: 'frost',
lore: 'A crystal that never warms. Dissolve it gently.' },
{ role: 'heartstone', kind: 'stone', shape: 'crystal', names: ['Heartstone', 'Rose Quartz', 'Amour Spar'], hue: [335, 0.55, 0.72], density: 2.3, hardness: 0.55,
sol: 0.12, solT: 0.0025, glow: 0.25, magic: { charm: 68, vitality: 14 }, fadeT: 110, superT: 950, superKey: 'charm',
lore: 'Pink crystal of affection.' },
{ role: 'bloodstone', kind: 'stone', shape: 'stone', names: ['Bloodstone', 'Heartwood Garnet', 'Life Jasper'], hue: [356, 0.6, 0.38], density: 2.5, hardness: 0.65,
sol: 0.1, solT: 0.003, glow: 0, magic: { vitality: 66, ardor: 12, bane: 4 }, fadeT: 100, superT: 2100, superKey: 'vitality',
lore: 'A dark red stone that beats faintly. It gives life, with a little sting.' },
{ role: 'skystone', kind: 'stone', shape: 'crystal', names: ['Skystone', 'Cloud Pumice', 'Wind Opal'], hue: [245, 0.35, 0.86], density: 0.75, hardness: 0.35,
sol: 0.14, solT: 0.002, glow: 0.3, magic: { levity: 70, frost: 8 }, fadeT: 160, superT: -950, superKey: 'levity',
lore: 'So light it floats. It lifts whatever drinks it.' },
{ role: 'blight', kind: 'stone', shape: 'stone', names: ['Blight Agate', 'Grave Agate', 'Murk Stone'], hue: [95, 0.4, 0.3], density: 2.0, hardness: 0.6,
sol: 0.11, solT: 0.0025, glow: 0, magic: { bane: 74, frost: 10 }, fadeT: 180, superT: -2250, superKey: 'bane',
lore: 'A green-black stone. Its magic withers what it touches.' },
];
const SPEC_BY_ROLE = Object.fromEntries(INGREDIENT_SPECS.map((s) => [s.role, s]));
const r2 = (v) => Math.round(v * 100) / 100;
function generateWorld(seed) {
const seedStr = String(seed);
const rng = new Rng('garden-world:' + seedStr);
const materials = [];
const roles = {};
const soot = completeMaterial({
id: 'soot', name: 'Soot', form: 'powder', archetype: 'ash', color: [0.17, 0.16, 0.16], tint: 0.9, opacity: 1,
density: 1.1, compat: [0.5, 0.3], friction: 0.72, melt: 3000, boil: Infinity, heatCapacity: 1, conductivity: 0.2,
price: 0, tier: 99, product: true, description: 'What burning leaves behind. No magic survives a fire.',
});
const smoke = completeMaterial({
id: 'smoke', name: 'Smoke', form: 'gas', archetype: 'smoke', color: [0.46, 0.44, 0.43], tint: 0.6, opacity: 0.6,
density: 0.8, gasDensity: 1.05, compat: [0.5, 0.3], melt: -200, boil: -150, heatCapacity: 1.2, conductivity: 0.2,
price: 0, tier: 99, product: true, description: 'Smoke of something that burned.',
});
materials.push(soot, smoke);
roles.soot = soot.id;
roles.smoke = smoke.id;
for (const s of INGREDIENT_SPECS) {
const [h, sat, l] = s.hue;
const color = hslToRgb((h + rng.range(-7, 7) + 360) % 360, Math.min(1, sat * rng.range(0.92, 1.08)), Math.min(0.94, l * rng.range(0.95, 1.05)));
const magic = {};
for (const [k, v] of Object.entries(s.magic)) magic[k] = Math.round(v * rng.range(0.9, 1.1));
const name = rng.pick(s.names);
const stone = s.kind === 'stone';
const sup = s.superT === undefined ? undefined : Math.abs(s.superT) < 200 ? Math.round(s.superT + rng.range(-5, 5)) : Math.round(s.superT * rng.range(0.92, 1.08));
const fade = s.fadeT === undefined ? undefined : Math.round(s.fadeT * rng.range(0.94, 1.06));
const common = {
id: s.role, name, archetype: s.role, color, magic, description: s.lore, product: false, tier: 0,
kind: /** @type {any} */ (s.kind), fadeT: fade, superT: sup, superKey: s.superKey,
price: s.kind === 'water' ? 0 : stone ? 10 : 8, econd: 0.05, charge: 0, reactivity: 0.1,
};
let m;
if (stone) {
m = completeMaterial({
...common, form: 'solid', shape: s.shape, tint: 0.8, opacity: 1,
density: r2(s.density * rng.range(0.97, 1.03)), compat: [r2(rng.range(0.81, 0.85)), r2(rng.range(0.12, 0.16))],
hardness: s.hardness, friction: r2(rng.range(0.6, 0.7)), binder: 0,
solubility: r2(s.sol * rng.range(0.92, 1.08)), solubilityTemp: s.solT, melt: 1500, boil: Infinity,
heatCapacity: 1.8, conductivity: 0.6, flammability: 0, glow: s.glow || 0,
});
/** @type {any} */ (m).crushable = true;
} else {
m = completeMaterial({
...common, form: 'liquid', tint: s.tint, opacity: s.opacity,
density: r2(s.density * rng.range(0.98, 1.02)), viscosity: s.viscosity, viscTemp: s.viscTemp ?? 0.02, compat: s.compat.slice(),
boil: s.boil, melt: s.melt, heatCapacity: s.heatCapacity, gasDensity: s.gasDensity ?? 1.2, latentVapor: s.latentVapor ?? 300,
flammability: s.flammability || 0, ignition: s.ignition || 9999, combustionHeat: s.combustionHeat || 0,
smoke: s.flammability ? smoke.id : undefined, ash: s.flammability ? soot.id : undefined,
});
}
materials.push(m);
roles[s.role] = m.id;
}
const ingredients = INGREDIENT_SPECS.map((s) => roles[s.role]);
const starting = ['water', 'dew', 'sap', 'sunstone', 'bloodstone'].map((r) => roles[r]);
return { seed: seedStr, materials, ingredients, starting, reactions: [], roles };
}
function makeLookup(world, extra = []) {
const map = new Map();
for (const m of world.materials) map.set(m.id, m);
for (const m of extra) map.set(m.id, m);
return (id) => map.get(id);
}
return { INGREDIENT_SPECS, SPEC_BY_ROLE, generateWorld, makeLookup };
})();
// src/alchemy/magic.js
const __m13 = (() => {
const PROPS = [
{ key: 'vitality', label: 'Vitality', icon: 'leaf', color: [0.42, 0.86, 0.38] },
{ key: 'ardor', label: 'Ardor', icon: 'flame', color: [1, 0.52, 0.2] },
{ key: 'frost', label: 'Frost', icon: 'snow', color: [0.55, 0.87, 1] },
{ key: 'levity', label: 'Levity', icon: 'feather', color: [0.8, 0.68, 1] },
{ key: 'charm', label: 'Charm', icon: 'heart', color: [1, 0.45, 0.7] },
{ key: 'bane', label: 'Bane', icon: 'skull', color: [0.76, 0.8, 0.22] },
];
const NP = PROPS.length;
const PROP_KEYS = PROPS.map((e) => e.key);
const PROP_INDEX = Object.fromEntries(PROP_KEYS.map((k, i) => [k, i]));
const PROP_BY_KEY = Object.fromEntries(PROPS.map((e) => [e.key, e]));
const P = Object.freeze({ VIT: 0, ARD: 1, FRO: 2, LEV: 3, CHA: 4, BAN: 5 });
const MAX_MAGIC = 100;
const FADE_RATE = 0.004;
const SUPER_GAIN = 1.35;
const SUPER_RATE = 0.2;
const NO_THRESHOLD = 1e6;
const LEACH_WET = 0.12;
const LEACH_DRY = 0.05;
const STEEP_SPAN = 70;
function magicVector(def) {
const v = new Array(NP).fill(0);
if (def && def.magic) for (let k = 0; k < NP; k++) v[k] = Number(def.magic[PROP_KEYS[k]]) || 0;
return v;
}
function magicWeight(def) {
return magicVector(def).reduce((a, b) => a + Math.max(0, b), 0);
}
function toRecord(vec) {
const o = {};
for (let k = 0; k < NP; k++) o[PROP_KEYS[k]] = Math.round(vec[k] * 10) / 10;
return o;
}
function fromRecord(rec) {
const v = new Array(NP).fill(0);
if (rec) for (let k = 0; k < NP; k++) v[k] = Number(rec[PROP_KEYS[k]]) || 0;
return v;
}
function naturalMagic(sp, comp, off, T, steepT, out) {
for (let k = 0; k < NP; k++) out[k] = 0;
const n = sp.count;
let tot = 0, liquid = 0;
for (let s = 0; s < n; s++) {
const f = comp[off + s];
if (f <= 0) continue;
tot += f;
if (!sp.isPowder[s] || T >= sp.melt[s]) liquid += f;
}
if (tot <= 1e-9) return 0;
const wet = liquid / tot > 0.05;
const Te = wet && steepT > T ? steepT : T;
const leach = wet ? LEACH_WET + (1 - LEACH_WET) * Math.min(1, Math.max(0, (Te - 20) / STEEP_SPAN)) : LEACH_DRY;
for (let s = 0; s < n; s++) {
const f = comp[off + s];
if (f <= 0 || sp.magW[s] <= 0) continue;
let avail = f;
if (sp.isPowder[s] && T < sp.melt[s]) {
const sol = Math.min(0.9, Math.max(0, sp.solubility[s] + sp.solTemp[s] * (Te - 20)));
const dissolved = Math.min(f, sol * liquid * 1.2);
avail = dissolved + leach * (f - dissolved);
}
const base = s * NP;
for (let k = 0; k < NP; k++) {
const e = sp.mag[base + k];
if (e !== 0) out[k] += avail * e;
}
}
const inv = 1 / tot;
let sum = 0;
for (let k = 0; k < NP; k++) { out[k] *= inv; if (out[k] > 0) sum += out[k]; }
return sum;
}
function thresholds(sp, comp, off, out = { fade: NO_THRESHOLD, super: NO_THRESHOLD, key: -1, weight: 0 }) {
let w = 0, fade = 0, sup = 0;
const votes = voteScratch;
for (let k = 0; k < NP; k++) votes[k] = 0;
for (let s = 0; s < sp.count; s++) {
const f = comp[off + s];
if (f <= 0) continue;
const mw = f * sp.magW[s];
if (mw <= 0) continue;
w += mw;
fade += mw * sp.fadeT[s];
sup += mw * sp.superT[s];
const key = sp.superK[s];
if (key >= 0) votes[key] += mw;
}
if (w <= 1e-9) {
out.fade = NO_THRESHOLD; out.super = NO_THRESHOLD; out.key = -1; out.weight = 0;
return out;
}
let best = -1, bv = 0;
for (let k = 0; k < NP; k++) if (votes[k] > bv) { bv = votes[k]; best = k; }
out.fade = fade / w;
out.super = sup / w;
out.key = best;
out.weight = w;
return out;
}
const voteScratch = new Float64Array(NP);
function beyondSuper(T, ts) {
if (ts >= NO_THRESHOLD * 0.5) return false;
return ts >= 20 ? T >= ts : T <= ts;
}
function particleMagic(sp, comp, off, T, steepT, vig, ss, key, out) {
const sum = naturalMagic(sp, comp, off, T, steepT, out);
if (ss > 1e-4 && key >= 0) {
const c = Math.min(MAX_MAGIC, SUPER_GAIN * sum);
for (let k = 0; k < NP; k++) out[k] = (1 - ss) * out[k] + (k === key ? ss * c : 0);
}
for (let k = 0; k < NP; k++) {
let v = out[k] * vig;
if (v < 0) v = 0; else if (v > MAX_MAGIC) v = MAX_MAGIC;
out[k] = v;
}
return out;
}
const one = new Float64Array(NP);
function sampleMagic(sim, indices) {
const p = sim.p, sp = sim.species, S = p.S;
const sum = new Float64Array(NP);
let wv = 0, wsum = 0, ws = 0, wst = 0;
const n = indices.length;
for (let q = 0; q < n; q++) {
const i = indices[q];
particleMagic(sp, p.comp, i * S, p.temp[i], p.stp[i], p.vig[i], p.ss[i], p.sk[i], one);
for (let k = 0; k < NP; k++) sum[k] += one[k];
const w = p.mw[i];
if (w > 0) { wsum += w; wv += w * p.vig[i]; ws += w * p.ss[i]; wst += w * p.stp[i]; }
}
if (n) for (let k = 0; k < NP; k++) sum[k] /= n;
return {
magic: sum,
vig: wsum > 0 ? wv / wsum : 1,
ss: wsum > 0 ? ws / wsum : 0,
steep: wsum > 0 ? wst / wsum : -300,
};
}
function blendOf(parts, lookup) {
const v = new Float64Array(NP);
let tot = 0;
for (const p of parts) tot += p.ml;
if (tot <= 0) return v;
for (const p of parts) {
const ev = magicVector(lookup(p.id));
for (let k = 0; k < NP; k++) v[k] += (ev[k] * p.ml) / tot;
}
return v;
}
function dominantProp(v, min = 2) {
let best = -1, bv = min;
for (let k = 0; k < NP; k++) if (v[k] > bv) { bv = v[k]; best = k; }
return best;
}
function propCss(k, a = 1) {
const c = PROPS[k].color;
return `rgba(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)},${a})`;
}
return { PROPS, NP, PROP_KEYS, PROP_INDEX, PROP_BY_KEY, P, MAX_MAGIC, FADE_RATE, SUPER_GAIN, SUPER_RATE, NO_THRESHOLD, LEACH_WET, LEACH_DRY, STEEP_SPAN, magicVector, magicWeight, toRecord, fromRecord, naturalMagic, thresholds, beyondSuper, particleMagic, sampleMagic, blendOf, dominantProp, propCss };
})();
// src/reactions/species.js
const __m12 = (() => {
const { rgbToOklab, srgbToLinear } = __m8;
const { volatilityOf } = __m9;
const { NP, magicVector, NO_THRESHOLD, PROP_INDEX } = __m13;
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
this.mag = new Float32Array(S * NP);
this.magW = f();
this.fadeT = f();
this.superT = f();
this.superK = new Int8Array(S).fill(-1);
this.econd = f();
this.echarge = f();
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
const mv = magicVector(def);
let mw = 0;
for (let k = 0; k < NP; k++) { this.mag[slot * NP + k] = mv[k]; mw += Math.max(0, mv[k]); }
this.magW[slot] = mw;
this.fadeT[slot] = Number.isFinite(def.fadeT) ? def.fadeT : NO_THRESHOLD;
this.superT[slot] = Number.isFinite(def.superT) ? def.superT : NO_THRESHOLD;
this.superK[slot] = def.superKey && PROP_INDEX[def.superKey] !== undefined ? PROP_INDEX[def.superKey] : -1;
this.econd[slot] = def.econd ?? 0.05;
this.echarge[slot] = def.charge ?? 0;
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
const { MAX_SPECIES, NO_BOIL } = __m12;
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
const __m11 = (() => {
const { SpeciesTable, MAX_SPECIES } = __m12;
const { mixtureProps } = __m14;
const { particleMagic, thresholds, beyondSuper, FADE_RATE, NP } = __m13;
function predictPlan(world, lookup, plan) {
const vol = new Map();
let total = 0;
for (const ing of plan.ingredients) {
vol.set(ing.id, (vol.get(ing.id) || 0) + ing.n);
total += ing.n;
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
const serve = plan.serveTemp ?? 20;
const hi = Math.max(20, plan.heatTo ?? 20, serve);
const lo = Math.min(20, plan.coolTo ?? 20, serve);
const thr = thresholds(sp, comp, 0);
const hot = (plan.hold ?? 6) + 10;
const vig = thr.fade < hi ? Math.exp(-FADE_RATE * (hi - thr.fade) * hot) : 1;
const ss = beyondSuper(hi, thr.super) || beyondSuper(lo, thr.super) ? 1 : 0;
const steep = (plan.hold ?? 0) >= 6 ? hi : Math.max(serve, Math.min(hi, 40));
const magic = particleMagic(sp, comp, 0, serve, steep, vig, ss, thr.key, new Array(NP).fill(0));
const props = mixtureProps(sp, comp, 0, serve);
const composition = {};
for (let s = 0; s < sp.count; s++) if (sp.defs[s] && comp[s] > 1e-5) composition[sp.defs[s].id] = comp[s];
void world;
return { ...props, magic, composition, totalParticles: total, thresholds: { ...thr }, vig, ss };
}
return { predictPlan };
})();
// src/game/customers.js
const __m15 = (() => {
const { Rng } = __m6;
const ARCHETYPES = [
{ key: 'farmer', title: 'Farmer', wants: ['vitality', 'bane', 'frost'], budget: 0.8, open: 0.62, patience: 4, concession: 0.45, bluff: 0.05, minRank: 0,
look: { hat: 'straw', outfit: [0.55, 0.42, 0.25], beardChance: 0.5 },
pleased: ['That’ll do nicely!', 'Fair enough.'], displeased: ['Robbery!', 'You drive a hard bargain.'] },
{ key: 'innkeeper', title: 'Innkeeper', wants: ['ardor', 'charm', 'vitality'], budget: 0.95, open: 0.58, patience: 4, concession: 0.4, bluff: 0.12, minRank: 0,
look: { hat: 'cap', outfit: [0.45, 0.28, 0.2], beardChance: 0.3, apron: true },
pleased: ['Deal!', 'The guests will be pleased.'], displeased: ['Pricey…', 'Hmph.'] },
{ key: 'bard', title: 'Bard', wants: ['charm', 'levity', 'vitality'], budget: 1.0, open: 0.5, patience: 5, concession: 0.35, bluff: 0.2, minRank: 0,
look: { hat: 'feather', outfit: [0.6, 0.2, 0.45], beardChance: 0.2 },
pleased: ['A song for you!', 'Splendid.'], displeased: ['A minor key, that price.', 'Alas, my purse.'] },
{ key: 'healer', title: 'Healer', wants: ['vitality', 'frost'], budget: 1.15, open: 0.66, patience: 3, concession: 0.5, bluff: 0.02, minRank: 0,
look: { hat: 'hood', outfit: [0.85, 0.85, 0.8], beardChance: 0.1 },
pleased: ['Thank you.', 'This will save lives.'], displeased: ['Too dear.', 'Lives depend on it…'] },
{ key: 'knight', title: 'Knight', wants: ['vitality', 'ardor', 'levity'], budget: 1.25, open: 0.64, patience: 3, concession: 0.5, bluff: 0.06, minRank: 1,
look: { hat: 'helm', outfit: [0.6, 0.62, 0.68], beardChance: 0.6 },
pleased: ['Agreed.', 'For the realm!'], displeased: ['Outrageous.', 'Very well.'] },
{ key: 'traveler', title: 'Traveller', wants: ['ardor', 'levity', 'vitality'], budget: 1.0, open: 0.55, patience: 4, concession: 0.4, bluff: 0.15, minRank: 0,
look: { hat: 'wide', outfit: [0.35, 0.4, 0.3], beardChance: 0.5 },
pleased: ['Safe roads.', 'Done.'], displeased: ['Steep.', 'I have a long road…'] },
{ key: 'scholar', title: 'Scholar', wants: ['levity', 'frost', 'charm'], budget: 1.2, open: 0.6, patience: 5, concession: 0.3, bluff: 0.04, minRank: 1,
look: { hat: 'none', outfit: [0.25, 0.3, 0.5], beardChance: 0.4, glasses: true },
pleased: ['Most reasonable.', 'Accepted.'], displeased: ['Hm. Expensive data.', 'Acceptable.'] },
{ key: 'witch', title: 'Hedge Witch', wants: ['bane', 'levity', 'charm'], budget: 1.1, open: 0.48, patience: 6, concession: 0.28, bluff: 0.3, minRank: 1,
look: { hat: 'witch', outfit: [0.2, 0.25, 0.2], beardChance: 0 },
pleased: ['Hehe… deal.', 'Wicked.'], displeased: ['Pah!', 'Thief…'] },
{ key: 'blacksmith', title: 'Blacksmith', wants: ['ardor', 'frost', 'vitality'], budget: 1.1, open: 0.62, patience: 3, concession: 0.5, bluff: 0.06, minRank: 1,
look: { hat: 'bandana', outfit: [0.3, 0.22, 0.18], beardChance: 0.8, apron: true },
pleased: ['Hah! Done.', 'Solid.'], displeased: ['Too much.', 'Fine.'] },
{ key: 'noble', title: 'Noble', wants: ['charm', 'levity', 'vitality'], budget: 1.6, open: 0.5, patience: 3, concession: 0.4, bluff: 0.25, minRank: 2,
look: { hat: 'crown', outfit: [0.5, 0.1, 0.25], beardChance: 0.3 },
pleased: ['Acceptable.', 'Very well.'], displeased: ['Vulgar haggling.', 'Must I?'] },
{ key: 'wizard', title: 'Wizard', wants: ['levity', 'frost', 'ardor', 'bane'], budget: 1.5, open: 0.6, patience: 4, concession: 0.4, bluff: 0.08, minRank: 2,
look: { hat: 'wizard', outfit: [0.25, 0.2, 0.55], beardChance: 0.9 },
pleased: ['The aether approves.', 'Done.'], displeased: ['Greedy.', 'Hmm.'] },
{ key: 'hunter', title: 'Hunter', wants: ['bane', 'frost', 'vitality'], budget: 1.05, open: 0.6, patience: 4, concession: 0.42, bluff: 0.1, minRank: 1,
look: { hat: 'hood', outfit: [0.3, 0.38, 0.22], beardChance: 0.5 },
pleased: ['Good.', 'That’ll keep.'], displeased: ['Hm.', 'Steep for a hunter.'] },
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
const __m16 = (() => {
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
const __m17 = (() => {
const COMPAT_FULL = 0.26;
const COMPAT_NONE = 0.4;
const HEAT_MIX = 0.0028;
function compatFactor(a1, b1, a2, b2) {
const d = Math.hypot(a1 - a2, b1 - b2);
if (d <= COMPAT_FULL) return 1;
if (d >= COMPAT_NONE) return 0;
return 1 - (d - COMPAT_FULL) / (COMPAT_NONE - COMPAT_FULL);
}
function compatFactorT(a1, b1, a2, b2, T) {
const d = Math.hypot(a1 - a2, b1 - b2);
const w = T > 20 ? HEAT_MIX * (T - 20) : 0;
const full = COMPAT_FULL + w, none = COMPAT_NONE + w;
if (d <= full) return 1;
if (d >= none) return 0;
return 1 - (d - full) / (none - full);
}
function fullMixTemperature(c1, c2) {
const d = Math.hypot(c1[0] - c2[0], c1[1] - c2[1]);
if (d <= COMPAT_FULL) return -Infinity;
return 20 + (d - COMPAT_FULL) / HEAT_MIX;
}
function miscible(m1, m2) {
return compatFactor(m1.compat[0], m1.compat[1], m2.compat[0], m2.compat[1]) > 0.5;
}
return { COMPAT_FULL, COMPAT_NONE, HEAT_MIX, compatFactor, compatFactorT, fullMixTemperature, miscible };
})();
// src/game/commissions.js
const __m10 = (() => {
const { predictPlan } = __m11;
const { ARCHETYPES, makeCustomer, archetypeOf } = __m15;
const { SIM } = __m16;
const { PROP_INDEX, PROP_KEYS, PROP_BY_KEY, NP, magicVector, magicWeight } = __m13;
const { compatFactorT } = __m17;
const PROBLEMS = {
vitality: [
{ title: 'Healing Draught', lines: ['A boar gored my leg. It has to mend.', 'My child has a fever that will not lift.', 'I need my strength back after the winter sickness.'], drunk: true },
{ title: 'Growth Tonic', lines: ['My orchard is wilting. Something to bring it back to life.', 'The old oak by the mill is dying.'], drunk: false },
],
ardor: [
{ title: 'Warming Draught', lines: ['The pass is frozen and I must cross it tonight.', 'My bones ache with cold all winter.'], drunk: true, avoid: ['frost'] },
{ title: 'Forge Kindling', lines: ['My forge will not get hot enough for star-iron.', 'The kiln keeps going out.'], drunk: false, avoid: ['frost'] },
],
frost: [
{ title: 'Fever Cooler', lines: ['A burning fever. Something cold, but gentle.', 'Dragon-burn on my arm. Cool it!'], drunk: true, avoid: ['ardor'] },
{ title: 'Larder Frost', lines: ['The summer heat spoils my larder.', 'I must keep the fish fresh to market.'], drunk: false, avoid: ['ardor'] },
],
levity: [
{ title: 'Feather Draught', lines: ['I must cross the gorge where the bridge fell.', 'The bell is too heavy to hoist into the tower.'], drunk: true },
{ title: 'Floating Oil', lines: ['My barge is stuck on the shoal.', 'Make the cart light enough for the mud road.'], drunk: false },
],
charm: [
{ title: 'Love Philtre', lines: ['There is someone at the mill I hope will notice me…', 'My husband has forgotten how to smile at me.'], drunk: true },
{ title: 'Calming Charm', lines: ['My bull has gone wild. Something to calm him.', 'Tomorrow I must win over the toll-master.'], drunk: true },
],
bane: [
{ title: 'Pest Bane', lines: ['Rats in the granary. Deadly to them, please.', 'Slugs are eating every cabbage I grow.'], drunk: false },
{ title: 'Weed Killer', lines: ['Blightweed is choking the barley.', 'Thorns have overgrown the old chapel.'], drunk: false },
],
};
const ROOM = 20;
const BOTTLE_ML = [100, 120, 150, 180, 200];
function blendable(defs, T) {
const liquids = defs.filter((d) => d.form === 'liquid');
for (let a = 0; a < liquids.length; a++) for (let b = a + 1; b < liquids.length; b++) {
if (compatFactorT(liquids[a].compat[0], liquids[a].compat[1], liquids[b].compat[0], liquids[b].compat[1], T) < 0.95) return false;
}
for (const d of defs) {
if (d.form === 'liquid') continue;
if (!liquids.some((l) => compatFactorT(d.compat[0], d.compat[1], l.compat[0], l.compat[1], T) > 0.8)) return false;
}
return true;
}
function buildPlan(key, key2, ctx, rng, n) {
const k = PROP_INDEX[key];
const water = ctx.lookup(ctx.world.roles.water);
const cands = [...ctx.available].map(ctx.lookup).filter((m) => m && m.kind !== 'water' && (m.magic?.[key] || 0) >= 25);
if (!cands.length) return null;
const stockOf = (m) => (ctx.stock ? ctx.stock[m.id] || 0 : 100);
const main = rng.weighted(cands, cands.map((m) => (m.magic[key] || 0) * (0.6 + Math.min(1, stockOf(m) / 120))));
const parts = [main];
if (key2) {
const c2 = [...ctx.available].map(ctx.lookup).filter((m) => m && m !== main && m.kind !== 'water' && (m.magic?.[key2] || 0) >= 25);
if (!c2.length) return null;
parts.push(rng.pick(c2));
}
const fade = Math.min(...parts.map((m) => m.fadeT ?? 999));
const supers = parts.map((m) => m.superT).filter((t) => Number.isFinite(t) && t > ROOM);
const ceiling = Math.min(fade - 8, ...supers.map((t) => t - 12), ctx.cap.maxFlame - 40, 92);
const hasStone = parts.some((m) => m.form === 'solid');
const heatTo = hasStone ? Math.max(ROOM, Math.min(ceiling, rng.range(55, 75))) : ROOM;
const useWater = parts.some((m) => m.form === 'solid') || rng.chance(0.85);
const defs = useWater ? [...parts, water] : parts.slice();
if (!blendable(defs, Math.max(heatTo, ROOM))) return null;
const share = rng.range(0.4, 0.75);
const n1 = Math.max(3, Math.round(n * share * (key2 ? 0.7 : 1)));
const n2 = key2 ? Math.max(3, Math.round(n * share * rng.range(0.3, 0.5))) : 0;
const ingredients = [];
const left = n - n1 - n2;
if (useWater && left > 0) ingredients.push({ id: water.id, n: left });
ingredients.push({ id: main.id, n: useWater ? n1 : n - n2, ground: main.form === 'solid' ? true : undefined });
if (key2) ingredients.push({ id: parts[1].id, n: n2, ground: parts[1].form === 'solid' ? true : undefined });
return { ingredients, heatTo: Math.round(heatTo), coolTo: ROOM, serveTemp: ROOM, knead: hasStone, hold: hasStone ? 16 : 6 };
}
function buildSuperPlan(key, ctx, rng, n) {
const k = PROP_INDEX[key];
const mats = [...ctx.available].map(ctx.lookup).filter((m) => m && m.kind !== 'water' && Number.isFinite(m.superT));
const water = ctx.lookup(ctx.world.roles.water);
const hot = Math.min(ctx.cap.maxFlame - 30, 96);
const cold = Math.max(ctx.cap.minCool + 20, ctx.cap.minCool * 0.45);
const options = [];
const tryBlend = (a, b, fa) => {
const wa = magicWeight(a) * fa, wb = b ? magicWeight(b) * (1 - fa) : 0;
const T = (wa * a.superT + (b ? wb * b.superT : 0)) / (wa + wb);
const votes = new Array(NP).fill(0);
votes[PROP_INDEX[a.superKey]] += wa;
if (b) votes[PROP_INDEX[b.superKey]] += wb;
if (votes.indexOf(Math.max(...votes)) !== k) return;
const reach = T > ROOM ? T <= hot - 4 && T >= 35 : T >= cold + 4 && T <= 2;
if (!reach) return;
const defs = b ? [a, b] : [a];
const target = T > ROOM ? Math.round(T + 6) : Math.round(T - 10);
if (!blendable(defs, Math.max(ROOM, T > ROOM ? target : ROOM))) return;
options.push({ a, b, fa, T, target });
};
for (const a of mats) {
tryBlend(a, null, 1);
for (const b of mats) if (b !== a) for (let f = 0.3; f <= 0.75; f += 0.05) tryBlend(a, b, f);
}
if (!options.length) return null;
const o = rng.pick(options);
const withWater = blendable(o.b ? [o.a, o.b, water] : [o.a, water], Math.max(ROOM, o.T > ROOM ? o.target : ROOM)) && rng.chance(0.5);
const nw = withWater ? Math.round(n * 0.15) : 0;
const na = Math.max(3, Math.round((n - nw) * o.fa));
const nb = o.b ? Math.max(3, n - nw - na) : 0;
const ingredients = [];
if (nw) ingredients.push({ id: water.id, n: nw });
ingredients.push({ id: o.a.id, n: o.b ? na : n - nw, ground: o.a.form === 'solid' ? true : undefined });
if (o.b) ingredients.push({ id: o.b.id, n: nb, ground: o.b.form === 'solid' ? true : undefined });
const defs = ingredients.map((i) => ctx.lookup(i.id));
const hasStone = defs.some((d) => d.form === 'solid');
if (o.T > ROOM) return { ingredients, heatTo: o.target, coolTo: ROOM, serveTemp: ROOM, knead: hasStone, stir: 16, hold: 12 };
const steep = hasStone ? Math.max(ROOM, Math.min(70, ...defs.map((d) => (d.fadeT ?? 999) - 10))) : ROOM;
return { ingredients, heatTo: steep > 30 ? Math.round(steep) : ROOM, coolTo: o.target, serveTemp: ROOM, knead: hasStone, stir: 16, hold: 30 };
}
const r5 = (v) => Math.round(v / 5) * 5;
function requirementsFor(m, wanted, problem, tier, superReq, rng) {
const reqs = [];
for (const key of wanted) {
const v = m[PROP_INDEX[key]];
if (v < 12) return [];
if (superReq) { reqs.push({ key, min: Math.max(40, Math.floor((v - 12) / 5) * 5), max: 100, kind: 'want' }); continue; }
if (tier >= 2 && rng.chance(0.55)) {
const tol = Math.max(10, r5(v * 0.25));
const c = r5(v);
reqs.push({ key, min: Math.max(5, c - tol), max: Math.min(100, c + tol), kind: 'range' });
} else {
const min = Math.max(5, Math.floor((v * rng.range(0.6, 0.75)) / 5) * 5);
reqs.push({ key, min, max: 100, kind: 'want' });
}
}
const limits = new Set();
if (problem.drunk) limits.add('bane');
for (const a of problem.avoid || []) limits.add(a);
if (superReq) for (const k of PROP_KEYS) if (!wanted.includes(k)) limits.add(k);
if (tier >= 2) {
const extra = PROP_KEYS.filter((k) => !wanted.includes(k) && !limits.has(k) && m[PROP_INDEX[k]] >= 4);
if (extra.length) limits.add(rng.pick(extra));
}
for (const key of limits) {
if (wanted.includes(key)) continue;
const v = m[PROP_INDEX[key]];
const max = superReq ? Math.max(10, Math.ceil((v + 6) / 5) * 5) : Math.max(5, Math.ceil((v + 7 + (tier < 2 ? 5 : 0)) / 5) * 5);
if (max >= 100) continue;
reqs.push({ key, min: 0, max, kind: 'limit' });
}
return reqs;
}
function generateCommission(ctx, rng, opts = {}) {
const tier = Math.max(0, Math.min(4, opts.tier ?? Math.min(4, ctx.rank)));
const archetypes = ARCHETYPES.filter((a) => a.minRank <= ctx.rank);
for (let attempt = 0; attempt < 40; attempt++) {
const arch = opts.archetype ? archetypeOf(opts.archetype) : rng.pick(archetypes);
let wants = arch.wants.slice();
if (ctx.event === 'winter') wants.push('ardor', 'ardor');
if (ctx.event === 'plague') wants.push('vitality', 'vitality');
if (ctx.event === 'festival') wants.push('charm', 'charm');
if (ctx.event === 'heatwave') wants.push('frost', 'frost');
const key = opts.key || rng.pick(wants);
const problem = rng.pick(PROBLEMS[key]);
const bottleMl = BOTTLE_ML[tier] * (opts.contract ? 1.5 : 1);
const bottleN = Math.round(bottleMl / SIM.ML_PER_PARTICLE);
const vessel = { pot: 310, copper: 440, grand: 600 }[ctx.cap.size] || 310;
const totalN = Math.min(bottleN + 5, Math.floor(vessel * 0.45));
const superReq = !!opts.super || (tier >= 3 && attempt < 20 && rng.chance(0.3));
let key2 = null;
if (!superReq && tier >= 2 && rng.chance(0.4)) {
const others = PROP_KEYS.filter((k) => k !== key && !(problem.avoid || []).includes(k) && k !== 'bane');
key2 = rng.pick(others);
}
const plan = superReq ? buildSuperPlan(key, ctx, rng, totalN) : buildPlan(key, key2, ctx, rng, totalN);
if (!plan) continue;
const pred = predictPlan(ctx.world, ctx.lookup, plan);
const wanted = key2 ? [key, key2] : [key];
const reqs = requirementsFor(Array.from(pred.magic), wanted, problem, tier, superReq, rng);
if (!reqs.length) continue;
if (!reqs.every((r) => pred.magic[PROP_INDEX[r.key]] >= r.min + (r.min > 0 ? 3 : 0) && pred.magic[PROP_INDEX[r.key]] <= r.max - 3)) continue;
const customer = makeCustomer(rng, arch);
const eventBonus = ctx.event && ['winter', 'plague', 'festival', 'heatwave'].includes(ctx.event) && wants.slice(arch.wants.length).includes(key) ? 1.25 : 1;
const value = Math.round((34 + 20 * tier + 7 * reqs.length + (superReq ? 50 : 0)) * arch.budget * Math.pow(bottleMl / 120, 0.7) * eventBonus * (opts.contract ? 1.8 : 1));
return {
id: 'q' + Math.floor(rng.next() * 1e9).toString(36),
type: 'order',
tier,
key,
problem: problem.title,
contract: !!opts.contract,
super: superReq,
potionName: problem.title,
customer,
dialogue: rng.pick(problem.lines),
requirements: reqs,
bottleMl,
bottleN,
value: Math.max(15, value),
bluff: arch.bluff,
reference: plan,
predicted: { magic: pred.magic.map((v) => Math.round(v * 10) / 10) },
hintCost: Math.max(3, Math.round(value * 0.12)),
};
}
return null;
}
function tutorialCommission(ctx, rng) {
const R = ctx.world.roles;
const plan = { ingredients: [{ id: R.water, n: 10 }, { id: R.dew, n: 10 }], heatTo: ROOM, coolTo: ROOM, serveTemp: ROOM, hold: 6 };
const pred = predictPlan(ctx.world, ctx.lookup, plan);
const vit = Math.max(10, Math.floor((pred.magic[PROP_INDEX.vitality] * 0.6) / 5) * 5);
const customer = makeCustomer(rng, archetypeOf('farmer'));
customer.name = 'Old Mabry Hollins';
return {
id: 'q-tutorial',
type: 'order',
tier: 0,
key: 'vitality',
problem: 'Healing Draught',
contract: false,
super: false,
tutorial: true,
potionName: 'Healing Draught',
customer,
dialogue: 'My old joints ache. Something to heal them — and nothing that sickens me.',
requirements: [
{ key: 'vitality', min: vit, max: 100, kind: 'want' },
{ key: 'bane', min: 0, max: 10, kind: 'limit' },
],
bottleMl: 80,
bottleN: 16,
value: 44,
bluff: 0,
reference: plan,
predicted: { magic: pred.magic.map((v) => Math.round(v * 10) / 10) },
hintCost: 0,
};
}
function meets(com, v, grace = 0) {
return com.requirements.every((r) => {
const x = v[PROP_INDEX[r.key]];
return x >= r.min - grace && x <= r.max + grace;
});
}
function failures(com, v, grace = 0) {
const out = [];
for (const r of com.requirements) {
const x = v[PROP_INDEX[r.key]];
if (x < r.min - grace) out.push({ key: r.key, kind: /** @type {'weak'} */ ('weak') });
else if (x > r.max + grace) out.push({ key: r.key, kind: r.kind === 'limit' ? /** @type {'side'} */ ('side') : /** @type {'strong'} */ ('strong') });
}
return out;
}
function reqText(r) {
if (r.kind === 'limit') return `≤${r.max}`;
if (r.max >= 100) return `≥${r.min}`;
return `${r.min}–${r.max}`;
}
return { PROBLEMS, generateCommission, tutorialCommission, meets, failures, reqText, magicVector, PROP_BY_KEY };
})();
// src/game/equipment.js
const __m18 = (() => {
const EQUIPMENT = [
{ id: 'hearth', name: 'Stone Hearth', category: 'heat', price: 0, rank: 0, icon: 'fire', desc: 'A wood fire under the cauldron.', effect: { maxFlame: 340, heatPower: 3.5 } },
{ id: 'bellows', name: 'Bellows & Coal', category: 'heat', price: 120, rank: 1, icon: 'bellows', requires: ['hearth'], desc: 'A hotter, faster fire.', effect: { maxFlame: 520, heatPower: 5.5 } },
{ id: 'athanor', name: 'Athanor Furnace', category: 'heat', price: 650, rank: 3, icon: 'furnace', requires: ['bellows'], desc: 'The fiercest, finest fire.', effect: { maxFlame: 800, heatPower: 8 } },
{ id: 'basin', name: 'Cold-Water Basin', category: 'cold', price: 0, rank: 0, icon: 'basin', desc: 'Cools toward 4°C.', effect: { minCool: 4, coolPower: 4 } },
{ id: 'frostrune', name: 'Frost Rune Plate', category: 'cold', price: 150, rank: 1, icon: 'rune', requires: ['basin'], desc: 'Cold down to -30°C.', effect: { minCool: -30, coolPower: 6 } },
{ id: 'glacial', name: 'Glacial Sigil', category: 'cold', price: 600, rank: 3, icon: 'snow', requires: ['frostrune'], desc: 'Deep cold to -70°C.', effect: { minCool: -70, coolPower: 9 } },
{ id: 'pot', name: 'Iron Pot', category: 'vessel', price: 0, rank: 0, icon: 'cauldron', desc: 'Your first cauldron.', effect: { size: 'pot' } },
{ id: 'copper', name: 'Copper Cauldron', category: 'vessel', price: 320, rank: 2, icon: 'cauldron2', requires: ['pot'], desc: 'A larger cauldron.', effect: { size: 'copper' } },
{ id: 'grand', name: 'Grand Vessel', category: 'vessel', price: 1500, rank: 4, icon: 'cauldron3', requires: ['copper'], desc: 'A huge cauldron.', effect: { size: 'grand' } },
{ id: 'spoon', name: 'Oak Spoon', category: 'tool', price: 0, rank: 0, icon: 'spoon', desc: 'Stirs and blends.' },
{ id: 'mortar', name: 'Stone Mortar', category: 'tool', price: 0, rank: 0, icon: 'mortar', desc: 'Smashes stones to powder before they go in.' },
{ id: 'pestle', name: 'Granite Pestle', category: 'tool', price: 35, rank: 0, icon: 'pestle', desc: 'Smashes stones and ice inside the pot.' },
{ id: 'skimmer', name: 'Brass Skimmer', category: 'tool', price: 60, rank: 1, icon: 'skimmer', desc: 'Lifts matter out of the pot.' },
{ id: 'stirrer', name: 'Clockwork Stirrer', category: 'tool', price: 110, rank: 1, icon: 'gear', desc: 'Stirs on its own.' },
{ id: 'homunculus', name: 'Brass Homunculus', category: 'tool', price: 900, rank: 3, icon: 'homunculus', desc: 'Brews a saved recipe for you.' },
{ id: 'thermometer', name: 'Thermometer', category: 'instrument', price: 0, rank: 0, icon: 'thermo', desc: 'Shows the brew’s temperature.' },
{ id: 'thermal', name: 'Thermal Monocle', category: 'instrument', price: 80, rank: 1, icon: 'monocle', desc: 'A heat map of the whole cauldron.' },
{ id: 'kennel', name: 'Creature Kennel', category: 'trials', price: 60, rank: 1, icon: 'toad', desc: 'Replacing a creature costs half.' },
{ id: 'lantern', name: 'Wisp Lantern', category: 'trials', price: 200, rank: 2, icon: 'wisp', desc: 'A wisp joins the testing room.' },
{ id: 'barrel', name: 'Rain Barrel', category: 'garden', price: 70, rank: 0, icon: 'drop', desc: 'The well holds twice as much.', effect: { wellCap: 2 } },
{ id: 'greenhouse', name: 'Greenhouse', category: 'garden', price: 240, rank: 1, icon: 'leaf', desc: 'Plants grow half again as fast.' },
{ id: 'lamp', name: 'Crystal Lamp', category: 'garden', price: 260, rank: 2, icon: 'gem', desc: 'Stones grow half again as fast.' },
{ id: 'sprinkler', name: 'Sprinkler', category: 'garden', price: 380, rank: 2, icon: 'can', desc: 'Plant beds never dry out.' },
{ id: 'shelf1', name: 'Oak Shelves', category: 'storage', price: 90, rank: 1, icon: 'shelf', desc: 'Keep up to 2 L of each ingredient.', effect: { storage: 2000 } },
{ id: 'shelf2', name: 'Cellar Racks', category: 'storage', price: 260, rank: 2, icon: 'shelf2', requires: ['shelf1'], desc: 'Keep up to 5 L of each ingredient.', effect: { storage: 5000 } },
{ id: 'charter', name: 'Guild Charter', category: 'guild', price: 400, rank: 2, icon: 'charter', desc: 'Certification costs 30% less; guild contracts.', effect: { certDiscount: 0.3 } },
];
const STARTING_EQUIPMENT = ['hearth', 'basin', 'pot', 'spoon', 'mortar', 'thermometer'];
const BASE_STORAGE = 800;
function equipmentById(id) {
return EQUIPMENT.find((e) => e.id === id);
}
const RANKS = [
{ name: 'Apprentice', rep: 0 },
{ name: 'Journeyman', rep: 40 },
{ name: 'Adept', rep: 130 },
{ name: 'Expert', rep: 300 },
{ name: 'Master', rep: 600 },
{ name: 'Grand Alchemist', rep: 1100 },
];
function rankIndex(rep) {
let r = 0;
for (let i = 0; i < RANKS.length; i++) if (rep >= RANKS[i].rep) r = i;
return r;
}
function capabilities(owned) {
const has = owned instanceof Set ? owned : new Set(owned);
const cap = { maxFlame: 340, heatPower: 3.5, minCool: 4, coolPower: 4, size: 'pot', storage: BASE_STORAGE, certDiscount: 0, has: (id) => has.has(id) };
for (const e of EQUIPMENT) {
if (!has.has(e.id) || !e.effect) continue;
const f = /** @type {any} */ (e.effect);
if (f.maxFlame && f.maxFlame > cap.maxFlame) { cap.maxFlame = f.maxFlame; cap.heatPower = f.heatPower; }
if (f.minCool !== undefined && f.minCool < cap.minCool) { cap.minCool = f.minCool; cap.coolPower = f.coolPower; }
if (f.size === 'copper' && cap.size === 'pot') cap.size = 'copper';
if (f.size === 'grand') cap.size = 'grand';
if (f.storage && f.storage > cap.storage) cap.storage = f.storage;
if (f.certDiscount) cap.certDiscount = Math.max(cap.certDiscount, f.certDiscount);
}
return cap;
}
return { EQUIPMENT, STARTING_EQUIPMENT, BASE_STORAGE, equipmentById, RANKS, rankIndex, capabilities };
})();
// src/game/testing.js
const __m19 = (() => {
const { NP, PROP_KEYS, PROP_INDEX } = __m13;
const { hashString } = __m6;
const CREATURES = [
{ id: 'toad', name: 'Moss Toad', shows: ['vitality', 'charm', 'bane'], hurt: { bane: 0.9, ardor: 0.6, frost: 0.6 }, from: { bane: 0, ardor: 50, frost: 50 }, cost: 6, max: 100 },
{ id: 'salamander', name: 'Salamander', shows: ['ardor', 'frost'], hurt: { bane: 0.5, frost: 1.1 }, from: { bane: 0, frost: 45 }, cost: 12, max: 100 },
{ id: 'moth', name: 'Moon Moth', shows: ['levity', 'charm', 'bane'], hurt: { bane: 1.1, ardor: 0.9 }, from: { bane: 0, ardor: 40 }, cost: 4, max: 90 },
{ id: 'sprout', name: 'Mandrake Sprout', shows: ['vitality', 'ardor', 'frost', 'bane'], hurt: { bane: 0.8, ardor: 0.8, frost: 0.8 }, from: { bane: 0, ardor: 45, frost: 45 }, cost: 3, max: 100 },
{ id: 'wisp', name: 'Wisp', shows: ['levity', 'vitality', 'charm'], hurt: { bane: 0.4 }, from: { bane: 0 }, cost: 16, max: 100, needs: 'lantern' },
];
const CREATURE_BY_ID = Object.fromEntries(CREATURES.map((c) => [c.id, c]));
const DOSE_ML = 10;
const FAINT = 3;
const REST_PER_MIN = 2;
const RECORD_LIMIT = 60;
function createLab(now = Date.now()) {
const creatures = {};
for (const c of CREATURES) creatures[c.id] = { health: 100, alive: true, at: now, trials: 0 };
return { creatures, records: /** @type {TrialRecord[]} */ ([]), serial: 0 };
}
function normalizeLab(raw, now = Date.now()) {
const out = createLab(now);
if (!raw || typeof raw !== 'object') return out;
if (raw.creatures && typeof raw.creatures === 'object') {
for (const c of CREATURES) {
const s = raw.creatures[c.id];
if (!s || typeof s !== 'object') continue;
out.creatures[c.id] = {
health: Number.isFinite(s.health) ? Math.max(0, Math.min(100, s.health)) : 100,
alive: s.alive !== false,
at: Number.isFinite(s.at) ? Math.min(s.at, now) : now,
trials: s.trials | 0,
};
}
}
if (Array.isArray(raw.records)) out.records = raw.records.filter((r) => r && typeof r === 'object' && CREATURE_BY_ID[r.creature] && r.levels).slice(0, RECORD_LIMIT);
out.serial = Math.max(raw.serial | 0, ...out.records.map((r) => r.serial | 0), 0);
return out;
}
function healthNow(s, now = Date.now()) {
if (!s.alive) return 0;
return Math.min(100, s.health + (Math.max(0, now - s.at) / 60000) * REST_PER_MIN);
}
function observe(def, magic, serial) {
const levels = {};
for (const key of def.shows) {
const v = magic[PROP_INDEX[key]] || 0;
const h = hashString(`${def.id}|${serial}|${key}`);
const u = ((h % 10007) / 10006) * 2 - 1;
let seen = v + u * (2 + 0.06 * v);
if (v < FAINT) seen = 0;
levels[key] = Math.round(Math.max(0, Math.min(def.max, seen)) * 10) / 10;
}
let harm = 0;
for (const [key, k] of Object.entries(def.hurt)) {
const v = magic[PROP_INDEX[key]] || 0;
const from = def.from[key] || 0;
if (v > from) harm += (v - from) * k;
}
harm = Math.max(0, harm - 0.25 * (magic[PROP_INDEX.vitality] || 0));
return { levels, harm };
}
function runTrial(lab, id, dose, ctx) {
const def = CREATURE_BY_ID[id];
if (!def) throw new Error('Choose a creature.');
const now = ctx.now ?? Date.now();
const st = lab.creatures[id];
if (!st || !st.alive) throw new Error(`The ${def.name.toLowerCase()} must be replaced first.`);
if (!(ctx.ml > 0)) throw new Error('No potion to give.');
lab.serial++;
const o = observe(def, dose.magic, lab.serial);
const health = healthNow(st, now) - o.harm * (ctx.ml / DOSE_ML);
const died = health <= 0.5;
lab.creatures[id] = { health: Math.max(0, health), alive: !died, at: now, trials: st.trials + 1 };
const record = {
id: 't' + lab.serial, serial: lab.serial, at: now, day: ctx.day, creature: id, ml: ctx.ml, source: ctx.source,
batchId: ctx.batchId, rev: ctx.rev, levels: o.levels, harm: Math.round(o.harm * 10) / 10, died,
color: (dose.color || [0.5, 0.5, 0.5]).map((c) => Math.round(c * 1000) / 1000), temperature: Math.round(dose.temperature ?? 20),
};
lab.records.unshift(record);
if (lab.records.length > RECORD_LIMIT) lab.records.length = RECORD_LIMIT;
return record;
}
function replaceCreature(lab, id, now = Date.now()) {
if (!CREATURE_BY_ID[id]) throw new Error('Unknown creature.');
lab.creatures[id] = { health: 100, alive: true, at: now, trials: lab.creatures[id]?.trials || 0 };
}
function restCreatures(lab, now = Date.now()) {
for (const s of Object.values(lab.creatures)) if (s.alive) { s.health = 100; s.at = now; }
}
function lastTrialOf(lab, id) {
return lab.records.find((r) => r.creature === id) || null;
}
function blankId() {
return Object.fromEntries(PROP_KEYS.map((k) => [k, null]));
}
function idComplete(id) {
return !!id && PROP_KEYS.every((k) => Number.isFinite(id.values[k]));
}
function idVector(id) {
const v = new Array(NP).fill(0);
for (let k = 0; k < NP; k++) v[k] = Number(id.values[PROP_KEYS[k]]) || 0;
return v;
}
function idError(values, truth) {
let e = 0;
for (let k = 0; k < NP; k++) e = Math.max(e, Math.abs((Number(values[PROP_KEYS[k]]) || 0) - truth[k]));
return e;
}
return { CREATURES, CREATURE_BY_ID, DOSE_ML, FAINT, REST_PER_MIN, RECORD_LIMIT, createLab, normalizeLab, healthNow, observe, runTrial, replaceCreature, restCreatures, lastTrialOf, blankId, idComplete, idVector, idError };
})();
// src/game/garden.js
const __m20 = (() => {
const BEDS = [
{ id: 'well', kind: 'well', role: 'water', cap: 600, fullMin: 16, price: 0, rank: 0 },
{ id: 'dew-a', kind: 'plant', role: 'dew', cap: 90, fullMin: 20, price: 0, rank: 0 },
{ id: 'sap-a', kind: 'plant', role: 'sap', cap: 75, fullMin: 24, price: 0, rank: 0 },
{ id: 'sunstone-a', kind: 'stone', role: 'sunstone', cap: 60, fullMin: 34, price: 0, rank: 0 },
{ id: 'bloodstone-a', kind: 'stone', role: 'bloodstone', cap: 55, fullMin: 36, price: 0, rank: 0 },
{ id: 'glacite-a', kind: 'stone', role: 'glacite', cap: 60, fullMin: 34, price: 45, rank: 0 },
{ id: 'frostmilk-a', kind: 'plant', role: 'frostmilk', cap: 80, fullMin: 24, price: 70, rank: 1 },
{ id: 'heartstone-a', kind: 'stone', role: 'heartstone', cap: 55, fullMin: 38, price: 90, rank: 1 },
{ id: 'dew-b', kind: 'plant', role: 'dew', cap: 90, fullMin: 20, price: 80, rank: 1 },
{ id: 'skystone-a', kind: 'stone', role: 'skystone', cap: 50, fullMin: 42, price: 150, rank: 2 },
{ id: 'witchoil-a', kind: 'plant', role: 'witchoil', cap: 70, fullMin: 28, price: 160, rank: 2 },
{ id: 'sap-b', kind: 'plant', role: 'sap', cap: 75, fullMin: 24, price: 110, rank: 2 },
{ id: 'blight-a', kind: 'stone', role: 'blight', cap: 50, fullMin: 46, price: 190, rank: 3 },
{ id: 'sunstone-b', kind: 'stone', role: 'sunstone', cap: 60, fullMin: 34, price: 140, rank: 3 },
{ id: 'glacite-b', kind: 'stone', role: 'glacite', cap: 60, fullMin: 34, price: 140, rank: 3 },
{ id: 'heartstone-b', kind: 'stone', role: 'heartstone', cap: 55, fullMin: 38, price: 170, rank: 4 },
];
const BED_BY_ID = Object.fromEntries(BEDS.map((b) => [b.id, b]));
const MIN_HARVEST = 0.2;
const WATER_COST = 40;
const MOIST_MS = 30 * 60000;
const WELL_DRAW = 150;
function createGarden(now = Date.now()) {
const g = { beds: {}, well: { stock: BED_BY_ID.well.cap, at: now }, harvested: 0, waterings: 0 };
for (const b of BEDS) if (b.kind !== 'well' && b.price === 0) g.beds[b.id] = { owned: true, g: 1, at: now, wetUntil: now + MOIST_MS };
return g;
}
function normalizeGarden(raw, now = Date.now()) {
const out = createGarden(now);
if (!raw || typeof raw !== 'object') return out;
if (raw.beds && typeof raw.beds === 'object') {
for (const [id, v] of Object.entries(raw.beds)) {
if (!BED_BY_ID[id] || !v || typeof v !== 'object') continue;
const o = /** @type {any} */ (v);
out.beds[id] = {
owned: o.owned !== false,
g: Number.isFinite(o.g) ? Math.max(0, Math.min(1, o.g)) : 0,
at: Number.isFinite(o.at) ? Math.min(o.at, now) : now,
wetUntil: Number.isFinite(o.wetUntil) ? o.wetUntil : 0,
};
}
}
if (raw.well && Number.isFinite(raw.well.stock) && Number.isFinite(raw.well.at)) out.well = { stock: Math.max(0, raw.well.stock), at: Math.min(raw.well.at, now) };
out.harvested = Number.isFinite(raw.harvested) ? raw.harvested : 0;
out.waterings = Number.isFinite(raw.waterings) ? raw.waterings : 0;
return out;
}
function growthMods(cap, event = 'none') {
return {
plant: (cap.has('greenhouse') ? 1.5 : 1) * (event === 'heatwave' ? 0.75 : 1),
stone: (cap.has('lamp') ? 1.5 : 1) * (event === 'eclipse' ? 1.5 : 1),
wellCap: cap.has('barrel') ? 2 : 1,
sprinkler: cap.has('sprinkler'),
rain: event === 'rain',
};
}
function bedStatus(g, b, mods, now = Date.now()) {
if (b.kind === 'well') {
const cap = b.cap * mods.wellCap;
const w = g.well;
const dt = Math.max(0, now - w.at);
const stock = Math.min(cap, w.stock + (dt / (b.fullMin * 60000)) * cap);
return { owned: true, growth: stock / cap, amount: Math.floor(stock), cap, moist: true, ready: stock >= 5, fullIn: ((cap - stock) / cap) * b.fullMin * 60000, dryIn: Infinity };
}
const s = g.beds[b.id];
if (!s || !s.owned) return { owned: false, growth: 0, amount: 0, cap: b.cap, moist: false, ready: false, fullIn: Infinity, dryIn: 0 };
const full = b.fullMin * 60000 / (b.kind === 'plant' ? mods.plant : mods.stone);
let grow = Math.max(0, now - s.at);
let moist = true, dryIn = Infinity;
if (b.kind === 'plant' && !mods.sprinkler && !mods.rain) {
grow = Math.max(0, Math.min(now, s.wetUntil) - s.at);
moist = now < s.wetUntil;
dryIn = Math.max(0, s.wetUntil - now);
}
const growth = Math.min(1, s.g + grow / full);
const fullIn = growth >= 1 ? 0 : moist ? (1 - growth) * full : Infinity;
return { owned: true, growth, amount: Math.floor((b.cap * growth) / 5) * 5, cap: b.cap, moist, ready: growth >= MIN_HARVEST, fullIn, dryIn };
}
function settle(g, b, mods, now) {
const s = g.beds[b.id];
const st = bedStatus(g, b, mods, now);
s.g = st.growth;
s.at = now;
return st;
}
function harvestBed(shop, b, materialId, mods, now = Date.now()) {
const g = shop.garden;
const have = shop.inventory[materialId] ?? 0;
const room = isFinite(have) ? Math.max(0, shop.cap.storage - have) : 0;
if (b.kind === 'well') {
const st = bedStatus(g, b, mods, now);
const amount = Math.floor(Math.min(WELL_DRAW, st.amount, room) / 5) * 5;
if (amount <= 0) return { ok: false, amount: 0, reason: room <= 0 ? 'full' : 'empty', wait: st.fullIn };
g.well = { stock: Math.max(0, st.growth * st.cap - amount), at: now };
shop.inventory[materialId] = have + amount;
return { ok: true, amount };
}
const s = g.beds[b.id];
if (!s || !s.owned) return { ok: false, amount: 0, reason: 'unplanted' };
const st = bedStatus(g, b, mods, now);
if (!st.ready) return { ok: false, amount: 0, reason: 'unripe', wait: st.moist ? ((MIN_HARVEST - st.growth) / Math.max(1e-6, 1 - st.growth)) * st.fullIn : Infinity };
const amount = Math.floor(Math.min(st.amount, room) / 5) * 5;
if (amount <= 0) return { ok: false, amount: 0, reason: 'full' };
const left = Math.max(0, st.growth - amount / b.cap);
s.g = left < 0.05 ? 0 : left;
s.at = now;
shop.inventory[materialId] = have + amount;
g.harvested += amount;
return { ok: true, amount };
}
function waterBed(shop, b, waterId, mods, now = Date.now()) {
const g = shop.garden;
const s = g.beds[b.id];
if (!s || !s.owned || b.kind !== 'plant') return { ok: false, reason: 'not-plant' };
const st = bedStatus(g, b, mods, now);
if (st.moist && st.dryIn > MOIST_MS * 0.6) return { ok: false, reason: 'wet' };
if ((shop.inventory[waterId] ?? 0) < WATER_COST) return { ok: false, reason: 'no-water' };
settle(g, b, mods, now);
shop.inventory[waterId] -= WATER_COST;
s.wetUntil = now + MOIST_MS;
g.waterings++;
return { ok: true, cost: WATER_COST };
}
function plantBed(g, b, now = Date.now()) {
if (g.beds[b.id] && g.beds[b.id].owned) return false;
g.beds[b.id] = { owned: true, g: 0, at: now, wetUntil: now + MOIST_MS };
return true;
}
function newDayGarden(g, mods, now = Date.now()) {
g.well = { stock: BED_BY_ID.well.cap * mods.wellCap, at: now };
for (const b of BEDS) {
const s = g.beds[b.id];
if (!s || !s.owned || b.kind === 'well') continue;
const st = settle(g, b, mods, now);
if (b.kind === 'stone') s.g = Math.min(1, st.growth + 0.15 * mods.stone);
else if (st.moist) s.g = Math.min(1, st.growth + 0.25 * mods.plant);
if (mods.rain && b.kind === 'plant') s.wetUntil = now + MOIST_MS;
}
}
function formatWait(ms) {
if (!isFinite(ms)) return '—';
const s = Math.ceil(ms / 1000);
if (s < 60) return `${s}s`;
const m = Math.ceil(s / 60);
if (m < 60) return `${m}m`;
return `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}`;
}
return { BEDS, BED_BY_ID, MIN_HARVEST, WATER_COST, MOIST_MS, WELL_DRAW, createGarden, normalizeGarden, growthMods, bedStatus, harvestBed, waterBed, plantBed, newDayGarden, formatWait };
})();
// src/game/haggle.js
const __m21 = (() => {
function startHaggle(com, arch, opts = {}) {
const trust = 1 + Math.min(0.15, (opts.reputation || 0) / 4000);
const fill = Math.min(1, opts.short ?? 1);
const max = Math.max(4, Math.round(com.value * (opts.certified ? 1.25 : 1) * trust * (0.35 + 0.65 * fill)));
const opening = Math.max(2, Math.round(max * arch.open));
return { max, offer: opening, opening, patience: arch.patience, patienceMax: arch.patience, concession: arch.concession, rounds: 0, state: 'open', price: 0, lastAsk: 0 };
}
function ask(h, ask) {
if (h.state === 'deal' || h.state === 'walked') return { result: h.state, offer: h.offer, price: h.price };
ask = Math.max(1, Math.round(ask));
h.lastAsk = ask;
h.rounds++;
if (h.state === 'final') {
if (ask <= h.offer) return deal(h, ask);
h.state = 'walked';
return { result: 'walked', offer: h.offer };
}
if (ask <= h.offer) return deal(h, ask);
if (ask > h.max * 2) {
h.state = 'walked';
return { result: 'walked', offer: h.offer };
}
if (ask <= h.max) {
if (ask - h.offer <= Math.max(1, h.max * 0.04)) return deal(h, ask);
h.offer = Math.min(h.max, Math.round(h.offer + (ask - h.offer) * h.concession));
h.patience -= 1;
} else {
h.offer = Math.min(h.max, Math.round(h.offer + (h.max - h.offer) * h.concession * 0.5));
h.patience -= ask > h.max * 1.3 ? 2 : 1;
}
if (h.patience <= 0) {
h.state = 'final';
h.patience = 0;
return { result: 'final', offer: h.offer };
}
return { result: 'counter', offer: h.offer };
}
function acceptOffer(h) {
if (h.state === 'walked' || h.state === 'deal') return { result: h.state, offer: h.offer, price: h.price };
return deal(h, h.offer);
}
function refuse(h) {
h.state = 'walked';
return { result: /** @type {'walked'} */ ('walked'), offer: h.offer };
}
function deal(h, price) {
h.state = 'deal';
h.price = Math.round(price);
return { result: /** @type {'deal'} */ ('deal'), price: h.price, offer: h.offer };
}
function mood(h) {
if (h.state === 'walked') return 0;
if (h.state === 'deal') return 1;
return Math.max(0, h.patience / Math.max(1, h.patienceMax));
}
return { startHaggle, ask, acceptOffer, refuse, mood };
})();
// src/game/sales.js
const __m22 = (() => {
const { failures } = __m10;
const { PROP_INDEX } = __m13;
const NOTICE = 1.5;
function certificationFee(rank, cap) {
return Math.round((30 + 12 * rank) * (1 - (cap.certDiscount || 0)));
}
function settleSale(com, vial, price, rng, when) {
const truth = vial.m.magic;
const fails = failures(com, truth, NOTICE);
let complaint = null;
if (fails.length) {
const f = fails.slice().sort((a, b) => miss(com, truth, b) - miss(com, truth, a))[0];
complaint = { kind: 'genuine', key: f.key, how: f.kind, due: when.visits + rng.int(1, 3) };
} else if (!com.tutorial && rng.chance(com.bluff || 0)) {
const r = rng.pick(com.requirements);
complaint = { kind: 'bluff', key: r.key, how: r.kind === 'limit' ? 'side' : 'weak', due: when.visits + rng.int(1, 3) };
}
return {
id: 's' + Math.floor(rng.next() * 1e9).toString(36),
day: when.day,
customer: { name: com.customer.name, title: com.customer.title, archetype: com.customer.archetype, portrait: com.customer.portrait },
potion: com.potionName,
requirements: com.requirements.map((r) => ({ ...r })),
price,
tier: com.tier,
label: { ...(vial.label ? vial.label.values : {}) },
certified: vial.certified ? { ...vial.certified } : null,
truth: Array.from(truth, (v) => Math.round(v * 10) / 10),
color: vial.m.color,
ml: vial.ml,
complaint,
resolved: complaint ? null : 'kept',
};
}
function miss(com, truth, f) {
const r = com.requirements.find((x) => x.key === f.key);
const v = truth[PROP_INDEX[f.key]];
return r ? Math.max(r.min - v, v - r.max) : 0;
}
const REP = {
sale: (tier) => 3 + tier,
genuine: (tier) => -(6 + 2 * tier),
bluffRefund: () => -1,
bluffCaught: () => 2,
};
return { NOTICE, certificationFee, settleSale, REP };
})();
// src/game/state.js
const __m5 = (() => {
const { Rng, hashString } = __m6;
const { generateWorld, makeLookup } = __m7;
const { serializeMaterial, deserializeMaterial } = __m9;
const { generateCommission, tutorialCommission, meets } = __m10;
const { EQUIPMENT, STARTING_EQUIPMENT, RANKS, rankIndex, capabilities, equipmentById } = __m18;
const { SIM } = __m16;
const { createLab, normalizeLab, runTrial, replaceCreature, restCreatures, CREATURE_BY_ID, idComplete, idVector, blankId, idError } = __m19;
const { createGarden, normalizeGarden, BEDS, BED_BY_ID, bedStatus, harvestBed, waterBed, plantBed, newDayGarden, growthMods } = __m20;
const { startHaggle, ask, acceptOffer, refuse } = __m21;
const { settleSale, certificationFee, REP } = __m22;
const { archetypeOf } = __m15;
const { PROP_KEYS, toRecord } = __m13;
const SAVE_VERSION = 4;
const WORLD_GEN_VERSION = 3;
const MARKET_EVENTS = [
{ key: 'none', name: 'An ordinary day', icon: 'sun' },
{ key: 'winter', name: 'Bitter Frost', icon: 'snow' },
{ key: 'plague', name: 'Coughing Sickness', icon: 'leaf' },
{ key: 'festival', name: 'Harvest Festival', icon: 'heart' },
{ key: 'heatwave', name: 'Heatwave', icon: 'flame' },
{ key: 'rain', name: 'Gentle Rain', icon: 'drop' },
{ key: 'eclipse', name: 'Crystal Eclipse', icon: 'gem' },
{ key: 'fair', name: 'Market Fair', icon: 'stall' },
];
const ACHIEVEMENTS = [
{ id: 'first_sale', name: 'Open for Business', desc: 'Sell your first potion.', reward: 10 },
{ id: 'haggler', name: 'Silver Tongue', desc: 'Sell for half again the opening offer.', reward: 20 },
{ id: 'certified', name: 'Seal of the Expert', desc: 'Have a potion certified.', reward: 10 },
{ id: 'caught', name: 'Liar Unmasked', desc: 'Show a certificate to a bluffing customer.', reward: 30 },
{ id: 'sharp_eye', name: 'Sharp Eye', desc: 'Write a Potion ID within 6 points of the truth on every property.', reward: 30 },
{ id: 'super', name: 'Transmutation', desc: 'Push a brew past its super transition.', reward: 30 },
{ id: 'fade', name: 'Too Hot', desc: 'Watch overheated magic fade away.', reward: 5 },
{ id: 'heatmix', name: 'Warm Embrace', desc: 'Blend two liquids that refuse to mix while cold.', reward: 15 },
{ id: 'crush', name: 'Stone Breaker', desc: 'Smash a stone with the pestle.', reward: 10 },
{ id: 'frozen', name: 'Cold Hands', desc: 'Freeze a brew solid.', reward: 10 },
{ id: 'boil', name: 'Rolling Boil', desc: 'Boil a liquid into vapour.', reward: 10 },
{ id: 'fire', name: 'Singed Eyebrows', desc: 'Set something alight in the cauldron.', reward: 10 },
{ id: 'harvest1', name: 'Green Fingers', desc: 'Harvest your garden.', reward: 5 },
{ id: 'harvest1k', name: 'Gardener', desc: 'Harvest 1 litre of ingredients.', reward: 40 },
{ id: 'trial1', name: 'First Test', desc: 'Test a potion on a creature.', reward: 5 },
{ id: 'trial25', name: 'Keen Observer', desc: 'Run 25 tests.', reward: 40 },
{ id: 'served10', name: 'Regulars', desc: 'Sell ten potions.', reward: 30 },
{ id: 'served50', name: 'Talk of the Town', desc: 'Sell fifty potions.', reward: 120 },
{ id: 'rich', name: 'Gold in the Coffers', desc: 'Hold 1000 coins at once.', reward: 50 },
{ id: 'journeyman', name: 'Journeyman', desc: 'Reach the rank of Journeyman.', reward: 20 },
{ id: 'adept', name: 'Adept', desc: 'Reach the rank of Adept.', reward: 40 },
{ id: 'expert', name: 'Expert', desc: 'Reach the rank of Expert.', reward: 80 },
{ id: 'master', name: 'Master Alchemist', desc: 'Reach the rank of Master.', reward: 150 },
{ id: 'grand', name: 'Grand Alchemist', desc: 'Complete the Grand Commission.', reward: 500 },
{ id: 'recipe', name: 'Written Down', desc: 'Save a recipe to your book.', reward: 10 },
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
/** @type {number} */ this.servedToday = data.servedToday || 0;
/** @type {number} */ this.dayEarnings = data.dayEarnings || 0;
/** @type {number} */ this.daySpending = data.daySpending || 0;
/** @type {number} */ this.dayRefunds = data.dayRefunds || 0;
/** @type {Record<string, number>} */ this.inventory = data.inventory;
/** @type {string[]} */ this.equipment = data.equipment;
/** @type {Record<string, JournalEntry>} */ this.journal = data.journal || {};
/** @type {Record<string, any>} */ this.knowledge = data.knowledge || {};
/** @type {any[]} */ this.recipes = data.recipes || [];
/** @type {any[]} */ this.history = data.history || [];
/** @type {Record<string, number>} */ this.achievements = data.achievements || {};
/** @type {any} */ this.current = data.current || null;
this.stats = { served: 0, earned: 0, spent: 0, brews: 0, declined: 0, refunds: 0, refunded: 0, bluffsCaught: 0, certified: 0, harvested: 0, trials: 0, ...(data.stats || {}) };
/** @type {{active:boolean, step:number, done:boolean}} */ this.tutorial = { active: false, step: 0, done: true, ...(data.tutorial || {}) };
/** @type {{event:string}} */ this.market = data.market && MARKET_EVENTS.some((e) => e.key === data.market.event) ? { event: data.market.event } : { event: 'none' };
/** @type {any} */ this.cauldron = data.cauldron || null;
/** @type {any[]} */ this.brewLog = data.brewLog || [];
/** @type {number} */ this.reliefDay = data.reliefDay || 0;
/** @type {boolean} */ this.grandDone = !!data.grandDone;
/** @type {number} */ this.createdAt = data.createdAt || Date.now();
this.garden = normalizeGarden(data.garden);
this.lab = normalizeLab(data.lab);
this.vial = data.vial || null;
this.batch = data.batch && typeof data.batch.id === 'string' ? { id: data.batch.id, rev: data.batch.rev | 0 } : newBatch();
this.idCard = data.idCard && data.idCard.values ? data.idCard : { values: blankId(), batchId: this.batch.id, rev: this.batch.rev };
/** @type {any[]} */ this.sales = Array.isArray(data.sales) ? data.sales : [];
/** @type {number} */ this.visits = data.visits | 0;
this.lookup = makeLookup(this.world);
}
static create(seed, opts = {}) {
const world = generateWorld(seed);
const inventory = {};
for (const id of world.ingredients) inventory[id] = 0;
inventory[world.roles.water] = 150;
inventory[world.roles.sap] = 40;
inventory[world.roles.sunstone] = 30;
inventory[world.roles.bloodstone] = 30;
const st = new GameState({
version: SAVE_VERSION,
genVersion: WORLD_GEN_VERSION,
seed,
world,
coins: 40,
reputation: 0,
day: 1,
customerIndex: 0,
customersPerDay: 3,
inventory,
equipment: STARTING_EQUIPMENT.slice(),
tutorial: { active: opts.tutorial !== false, step: 0, done: opts.tutorial === false },
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
stock(id) {
return this.inventory[id] ?? 0;
}
availableSet() {
const s = new Set();
for (const b of BEDS) {
const owned = b.kind === 'well' || (this.garden.beds[b.id] && this.garden.beds[b.id].owned);
if (owned && this.world.roles[b.role]) s.add(this.world.roles[b.role]);
}
for (const [id, v] of Object.entries(this.inventory)) if (v > 0) s.add(id);
return s;
}
consume(id, ml) {
const s = this.stock(id);
if (!isFinite(s)) return true;
if (s + 1e-6 < ml) return false;
this.inventory[id] = round1(s - ml);
return true;
}
spend(amount) {
this.coins = round1(this.coins - amount);
this.stats.spent += amount;
this.daySpending += amount;
}
buyEquipment(id) {
const e = equipmentById(id);
if (!e) return { ok: false, reason: 'Unknown item.' };
if (this.has(id)) return { ok: false, reason: 'Already owned.' };
if (e.rank > this.rank) return { ok: false, reason: `Requires the rank of ${RANKS[e.rank].name}.` };
if (e.requires && !e.requires.every((r) => this.has(r))) return { ok: false, reason: 'Requires the previous upgrade.' };
if (this.coins < e.price) return { ok: false, reason: 'Not enough coins.' };
this.spend(e.price);
this.equipment.push(id);
return { ok: true, item: e };
}
get growth() {
return growthMods(this.cap, this.market.event);
}
bed(bedId, now = Date.now()) {
const b = BED_BY_ID[bedId];
return b ? bedStatus(this.garden, b, this.growth, now) : null;
}
harvest(bedId, now = Date.now()) {
const b = BED_BY_ID[bedId];
if (!b) return { ok: false, amount: 0, reason: 'unknown', events: [] };
const id = this.world.roles[b.role];
const r = harvestBed(/** @type {any} */ (this), b, id, this.growth, now);
const events = [];
if (r.ok && b.kind !== 'well') {
this.stats.harvested += r.amount;
events.push(...this.unlock('harvest1'));
if (this.stats.harvested >= 1000) events.push(...this.unlock('harvest1k'));
}
return { ...r, id, events };
}
water(bedId, now = Date.now()) {
const b = BED_BY_ID[bedId];
if (!b) return { ok: false, reason: 'unknown' };
return waterBed(/** @type {any} */ (this), b, this.world.roles.water, this.growth, now);
}
plant(bedId, now = Date.now()) {
const b = BED_BY_ID[bedId];
if (!b || b.kind === 'well') return { ok: false, reason: 'unknown' };
if (this.garden.beds[b.id] && this.garden.beds[b.id].owned) return { ok: false, reason: 'Already planted.' };
if (b.rank > this.rank) return { ok: false, reason: `Requires the rank of ${RANKS[b.rank].name}.` };
if (this.coins < b.price) return { ok: false, reason: 'Not enough coins.' };
this.spend(b.price);
plantBed(this.garden, b, now);
return { ok: true, cost: b.price };
}
newBatch() {
this.batch = newBatch();
this.idCard = { values: blankId(), batchId: this.batch.id, rev: this.batch.rev };
return this.batch;
}
touchBatch() {
this.batch.rev++;
}
get idStale() {
return this.idCard.batchId !== this.batch.id || (this.idCard.rev ?? 0) !== this.batch.rev;
}
writeId(target, values) {
const clean = Object.fromEntries(PROP_KEYS.map((k) => [k, Number.isFinite(values[k]) ? Math.max(0, Math.min(100, Math.round(/** @type {number} */ (values[k])))) : null]));
if (target === 'vial') {
if (!this.vial || this.vial.certified) return false;
this.vial.label = { values: clean };
return true;
}
this.idCard = { values: clean, batchId: this.batch.id, rev: this.batch.rev };
return true;
}
recordTrial(creatureId, dose, ctx) {
const rec = runTrial(this.lab, creatureId, dose, { ...ctx, day: this.day });
this.stats.trials++;
const events = [...this.unlock('trial1')];
if (this.stats.trials >= 25) events.push(...this.unlock('trial25'));
return { record: rec, events };
}
replaceCreature(id, free = false) {
const def = CREATURE_BY_ID[id];
if (!def) return { ok: false, reason: 'Unknown creature.' };
const cost = free ? 0 : Math.ceil(def.cost * (this.has('kennel') ? 0.5 : 1));
if (cost > this.coins + 1e-9) return { ok: false, reason: `A new one costs ${cost} coins.` };
this.spend(cost);
replaceCreature(this.lab, id);
return { ok: true, cost };
}
creatureAvailable(id) {
const def = CREATURE_BY_ID[id];
return !!def && (!def.needs || this.has(def.needs));
}
get certifyFee() {
return certificationFee(this.rank, this.cap);
}
certifyVial() {
const v = this.vial;
if (!v) return { ok: false, reason: 'No vial.' };
if (v.certified) return { ok: false, reason: 'Already certified.' };
const fee = this.certifyFee;
if (this.coins < fee) return { ok: false, reason: `The expert asks ${fee} coins.` };
this.spend(fee);
const truth = toRecord(v.m.magic);
const events = [...this.unlock('certified')];
if (v.label && idComplete(v.label) && idError(v.label.values, v.m.magic) <= 6) events.push(...this.unlock('sharp_eye'));
v.estimate = v.label ? { ...v.label.values } : null;
v.certified = Object.fromEntries(PROP_KEYS.map((k) => [k, Math.round(truth[k])]));
v.label = { values: { ...v.certified }, certified: true };
this.stats.certified++;
return { ok: true, fee, events };
}
labelMatches(com = this.current) {
const v = this.vial;
if (!v || !com || com.type !== 'order' || !v.label || !idComplete(v.label)) return false;
return meets(com, idVector(v.label));
}
commissionContext() {
return {
world: this.world,
lookup: this.lookup,
available: this.availableSet(),
stock: this.inventory,
cap: this.cap,
rank: this.rank,
event: this.market.event,
};
}
dueComplaint() {
return this.sales.find((s) => s.complaint && !s.resolved && this.visits >= s.complaint.due) || null;
}
nextCustomer() {
if (this.current) return this.current;
const due = this.dueComplaint();
if (due) {
this.visits++;
this.current = { type: 'complaint', saleId: due.id, customer: due.customer, potionName: due.potion, complaint: due.complaint, price: due.price, certified: !!due.certified };
return this.current;
}
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
if (!com) { this.customerIndex++; return this.nextCustomer(); }
this.visits++;
this.current = com;
return com;
}
grandCommission(rng) {
const com = generateCommission(this.commissionContext(), rng, { tier: 4, archetype: 'noble', contract: true, super: true }) ||
generateCommission(this.commissionContext(), rng, { tier: 4, contract: true });
if (com) {
com.grand = true;
com.customer.name = 'Queen Isolde’s Herald';
com.dialogue = 'By royal decree: the Queen requires a masterwork of pure magic.';
com.value = Math.round(com.value * 2.5);
com.bluff = 0;
}
return com;
}
declineCustomer() {
const c = this.current;
if (!c || c.tutorial || c.type !== 'order') return;
this.current = null;
this.customerIndex++;
this.stats.declined++;
}
beginHaggle() {
const com = this.current, v = this.vial;
if (!com || com.type !== 'order' || !v) return null;
if (!com.haggle) {
com.haggle = startHaggle(com, archetypeOf(com.customer.archetype), { certified: !!v.certified, reputation: this.reputation, short: v.ml / com.bottleMl });
}
return com.haggle;
}
haggleAsk(price) {
const h = this.beginHaggle();
if (!h) return null;
return ask(h, price);
}
haggleAccept() {
const h = this.beginHaggle();
return h ? acceptOffer(h) : null;
}
haggleRefuse() {
const h = this.beginHaggle();
if (h) refuse(h);
this.declineCustomer();
}
completeSale() {
const com = this.current, v = this.vial;
if (!com || com.type !== 'order' || !v || !com.haggle || com.haggle.state !== 'deal') return { sale: null, events: [] };
const price = com.haggle.price;
const rng = new Rng(hashString(`${this.seed}:sale:${com.id}:${this.visits}`));
const sale = settleSale(com, v, price, rng, { day: this.day, visits: this.visits });
this.sales.unshift(sale);
if (this.sales.length > 80) this.sales.length = 80;
const events = [];
const oldRank = this.rank;
this.coins = round1(this.coins + price);
this.reputation = Math.max(0, this.reputation + REP.sale(com.tier));
this.stats.served++;
this.stats.earned += price;
this.dayEarnings += price;
this.servedToday++;
this.history.unshift({ day: this.day, customer: com.customer.name, title: com.customer.title, potion: com.potionName, paid: price, color: v.m.color, ml: v.ml, certified: !!v.certified });
if (this.history.length > 60) this.history.length = 60;
if (com.tutorial) { this.tutorial.done = true; this.tutorial.active = false; }
if (com.grand && meets(com, v.m.magic)) { this.grandDone = true; events.push(...this.unlock('grand')); }
this.vial = null;
this.current = null;
this.customerIndex++;
events.push(...this.unlock('first_sale'));
if (price >= com.haggle.opening * 1.5) events.push(...this.unlock('haggler'));
if (this.stats.served >= 10) events.push(...this.unlock('served10'));
if (this.stats.served >= 50) events.push(...this.unlock('served50'));
if (this.coins >= 1000) events.push(...this.unlock('rich'));
events.push(...this.rankEvents(oldRank));
return { sale, events };
}
rankEvents(oldRank) {
const nr = this.rank;
if (nr <= oldRank) return [];
const events = [{ type: 'rank', rank: nr, name: RANKS[nr].name }];
const ach = ['', 'journeyman', 'adept', 'expert', 'master'][nr];
if (ach) events.push(...this.unlock(ach));
this.customersPerDay = 3 + Math.floor(nr / 2) + (this.market.event === 'fair' ? 1 : 0);
return events;
}
resolveComplaint(how) {
const c = this.current;
if (!c || c.type !== 'complaint') return { ok: false, reason: 'No complaint.' };
const sale = this.sales.find((s) => s.id === c.saleId);
if (!sale) { this.current = null; return { ok: false, reason: 'Unknown sale.' }; }
const events = [];
if (how === 'certificate') {
if (!sale.certified) return { ok: false, reason: 'This potion was never certified.' };
if (sale.complaint.kind === 'bluff') {
sale.resolved = 'caught';
this.reputation += REP.bluffCaught();
this.stats.bluffsCaught++;
events.push(...this.unlock('caught'));
this.current = null;
return { ok: true, outcome: 'caught', amount: 0, events };
}
how = 'refund';
}
const amount = sale.price;
this.coins = round1(this.coins - amount);
this.stats.refunds++;
this.stats.refunded += amount;
this.dayRefunds += amount;
this.reputation = Math.max(0, this.reputation + (sale.complaint.kind === 'genuine' ? REP.genuine(sale.tier) : REP.bluffRefund()));
sale.resolved = 'refunded';
this.current = null;
return { ok: true, outcome: sale.certified ? 'proven' : 'refunded', amount, events };
}
get dayOver() {
return !this.current && this.customerIndex >= this.customersPerDay && !this.dueComplaint();
}
endDay() {
const summary = { day: this.day, earned: this.dayEarnings, spent: this.daySpending, refunds: this.dayRefunds, served: this.servedToday };
this.day++;
this.customerIndex = 0;
this.servedToday = 0;
this.dayEarnings = 0;
this.daySpending = 0;
this.dayRefunds = 0;
this.current = null;
this.rollMarket();
this.customersPerDay = 3 + Math.floor(this.rank / 2) + (this.market.event === 'fair' ? 1 : 0);
newDayGarden(this.garden, this.growth);
restCreatures(this.lab);
return summary;
}
rollMarket() {
const rng = new Rng(hashString(`${this.seed}:market:${this.day}`));
const ev = this.day <= 2 ? MARKET_EVENTS[0] : rng.weighted(MARKET_EVENTS, [6, 1, 1, 1, 1, 1, 1, 1]);
this.market = { event: ev.key };
}
get marketEvent() {
return MARKET_EVENTS.find((e) => e.key === this.market.event) || MARKET_EVENTS[0];
}
claimRelief() {
if (this.reliefDay === this.day || this.coins >= 10) return 0;
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
dayRefunds: this.dayRefunds,
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
brewLog: this.brewLog,
reliefDay: this.reliefDay,
grandDone: this.grandDone,
createdAt: this.createdAt,
garden: this.garden,
lab: this.lab,
vial: this.vial,
batch: this.batch,
idCard: this.idCard,
sales: this.sales,
visits: this.visits,
savedAt: Date.now(),
};
}
static fromJSON(raw) {
const data = migrate(raw);
const world = { ...data.world, materials: data.world.materials.map(deserializeMaterial) };
const inventory = Object.fromEntries(Object.entries(data.inventory).map(([k, v]) => [k, v === 'inf' ? Infinity : Number(v)]));
for (const id of world.ingredients || []) if (!(id in inventory)) inventory[id] = 0;
for (const [k, v] of Object.entries(inventory)) if (!Number.isFinite(v) && v !== Infinity) inventory[k] = 0;
return new GameState({ ...data, world, inventory });
}
}
function newBatch() {
return { id: 'b' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36), rev: 0 };
}
function migrate(raw) {
if (!raw || typeof raw !== 'object') throw new Error('Not a save file');
const d = { ...raw };
if (!d.version) throw new Error('Missing save version');
if (d.version > SAVE_VERSION) throw new Error('This save comes from a newer version of the game');
if (typeof d.seed !== 'string' && typeof d.seed !== 'number') throw new Error('The save has no world seed');
d._migratedFrom = d.version;
if (d.version < 4) {
const w = generateWorld(d.seed);
d.world = { ...w, materials: w.materials.map(serializeMaterial) };
const inventory = {};
for (const id of w.ingredients) inventory[id] = 0;
inventory[w.roles.water] = 150;
d.inventory = inventory;
const known = new Set(EQUIPMENT.map((e) => e.id));
d.equipment = [...new Set([...STARTING_EQUIPMENT, ...(Array.isArray(d.equipment) ? d.equipment : []).filter((id) => known.has(id))])];
const awards = new Set(ACHIEVEMENTS.map((a) => a.id));
d.achievements = Object.fromEntries(Object.entries(d.achievements || {}).filter(([k]) => awards.has(k)));
d.history = (Array.isArray(d.history) ? d.history : []).map((h) => ({ day: h.day, customer: h.customer, title: h.title, potion: h.potion, paid: h.paid, color: h.color, ml: h.ml }));
d.journal = {};
d.knowledge = {};
d.recipes = [];
d.brewLog = [];
d.current = null;
d.cauldron = null;
d.vial = null;
d.batch = null;
d.idCard = null;
d.garden = null;
d.lab = null;
d.sales = [];
d.visits = 0;
d.market = { event: 'none' };
d.customerIndex = Math.min(d.customerIndex | 0, d.customersPerDay | 0 || 3);
d.customersPerDay = d.customersPerDay | 0 || 3;
d.genVersion = WORLD_GEN_VERSION;
d.tutorial = { active: false, step: 0, done: true };
d.version = 4;
}
if (!d.world || !Array.isArray(d.world.materials)) {
const w = generateWorld(d.seed);
d.world = { ...w, materials: w.materials.map(serializeMaterial) };
}
if (d.world.materials.length === 0) throw new Error('The save has no ingredients');
if (!d.inventory || typeof d.inventory !== 'object') throw new Error('The save has no inventory');
for (const k of ['journal', 'achievements', 'stats', 'tutorial', 'knowledge']) d[k] = d[k] && typeof d[k] === 'object' ? d[k] : {};
d.recipes = Array.isArray(d.recipes) ? d.recipes : [];
d.history = Array.isArray(d.history) ? d.history : [];
d.brewLog = Array.isArray(d.brewLog) ? d.brewLog : [];
d.equipment = Array.isArray(d.equipment) && d.equipment.length ? d.equipment : STARTING_EQUIPMENT.slice();
if (!Number.isFinite(d.coins)) d.coins = 0;
if (!Number.isFinite(d.reputation)) d.reputation = 0;
if (!Number.isFinite(d.day) || d.day < 1) d.day = 1;
return d;
}
function round1(v) {
return Math.round(v * 10) / 10;
}
return { SAVE_VERSION, WORLD_GEN_VERSION, MARKET_EVENTS, ACHIEVEMENTS, GameState, migrate, EQUIPMENT, SIM, BEDS };
})();
// src/game/persistence.js
const __m23 = (() => {
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
const __m26 = (() => {
const { MAX_SPECIES } = __m12;
const { PHASE } = __m16;
const STATE_FIELDS_F32 = ['x', 'y', 'vx', 'vy', 'temp', 'lat', 'eph', 'restX', 'restY', 'agit', 'burn', 'wet', 'q', 'vig', 'ss', 'stp'];
const STATE_FIELDS_I32 = ['group'];
const STATE_FIELDS_U8 = ['phase'];
const STATE_FIELDS_U32 = ['seed'];
const DERIVED_FIELDS = [
'rho20', 'rho', 'invMass', 'rhoCp', 'kappa', 'lnMu20', 'viscT', 'lnMu', 'gran', 'binder',
'tm', 'tb', 'volFrac', 'latF', 'latV', 'beta', 'cA', 'cB', 'colL', 'colA', 'colB',
'opacity', 'flam', 'ign', 'combHeat', 'gasRho', 'glow', 'friction', 'hardness', 'yieldV', 'econd',
'mw', 'tf', 'ts', 'sk',
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
this.q = new Float32Array(capacity);
this.vig = new Float32Array(capacity).fill(1);
this.ss = new Float32Array(capacity);
this.stp = new Float32Array(capacity).fill(-300);
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
this.econd = new Float32Array(capacity);
this.mw = new Float32Array(capacity);
this.tf = new Float32Array(capacity);
this.ts = new Float32Array(capacity);
this.sk = new Float32Array(capacity).fill(-1);
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
this.agit[i] = 0; this.burn[i] = 0; this.wet[i] = 0; this.q[i] = 0;
this.vig[i] = 1; this.ss[i] = 0; this.stp[i] = -300;
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
for (const f of ['x', 'y', 'px', 'py', 'vx', 'vy', 'temp', 'lat', 'eph', 'restX', 'restY', 'agit', 'burn', 'wet', 'q', 'vig', 'ss', 'stp', 'group', 'phase', 'seed', 'sleep', 'dirty']) {
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
const __m27 = (() => {
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
const __m28 = (() => {
const { SIM } = __m16;
const CAULDRON_SIZES = {
pot: { key: 'pot', label: 'Iron Pot', mouth: 0.8, belly: 1.0, neck: 0.5, depth: 1.55, capacity: 310 },
copper: { key: 'copper', label: 'Copper Cauldron', mouth: 0.95, belly: 1.2, neck: 0.6, depth: 1.8, capacity: 440 },
grand: { key: 'grand', label: 'Grand Athanor', mouth: 1.1, belly: 1.4, neck: 0.7, depth: 2.1, capacity: 600 },
small: { key: 'small', label: 'Great Iron Pot', mouth: 1.7, belly: 2.15, neck: 1.1, depth: 3.2, capacity: 1400 },
medium: { key: 'medium', label: 'Great Copper Cauldron', mouth: 1.95, belly: 2.5, neck: 1.25, depth: 3.6, capacity: 2000 },
large: { key: 'large', label: 'Great Athanor', mouth: 2.2, belly: 2.85, neck: 1.35, depth: 4.0, capacity: 2700 },
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
const __m29 = (() => {
const { MAX_SPECIES, NO_BOIL } = __m12;
const { granularFraction, suspensionLnMult } = __m14;
const { rgbToOklab, linearToSrgb } = __m8;
const { PHASE } = __m16;
const { thresholds } = __m13;
const thr = { fade: 0, super: 0, key: -1, weight: 0 };
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
let cA = 0, cB = 0, ec = 0;
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
ec += f * sp.econd[s];
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
p.econd[i] = ec * inv;
thresholds(sp, comp, off, thr);
p.mw[i] = thr.weight * inv;
p.tf[i] = thr.fade;
p.ts[i] = thr.super;
p.sk[i] = thr.key;
const s = Math.max(0, Math.min(1, (gran - 0.34) / 0.42));
p.yieldV[i] = (0.1 + 0.6 * bnd) * Math.pow(s, 1.1);
p.dirty[i] = 0;
}
return { GAS_MASS, refreshParticle };
})();
// src/simulation/rigid.js
const __m30 = (() => {
const { PHASE } = __m16;
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
const __m31 = (() => {
const { PHASE, SIM } = __m16;
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
const __m32 = (() => {
const { PHASE, PHASE_NAMES } = __m16;
const { MAX_SPECIES, NO_BOIL } = __m12;
const { refreshParticle } = __m29;
const { FRESH } = __m30;
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
const __m33 = (() => {
const { PHASE } = __m16;
const { MAX_SPECIES } = __m12;
const { compatFactorT } = __m17;
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
const vig = p.vig, ss = p.ss, stp = p.stp, magW = sp.magW;
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
Math.abs(p.gran[i] - p.gran[j]) < 1e-5 &&
(p.mw[i] <= 0 || (Math.abs(vig[i] - vig[j]) < 1e-3 && Math.abs(ss[i] - ss[j]) < 1e-3 && Math.abs(stp[i] - stp[j]) < 0.5))
) continue;
const dx = p.x[i] - p.x[j], dy = p.y[i] - p.y[j];
const r2 = dx * dx + dy * dy;
if (r2 >= RD2) continue;
const c = compatFactorT(p.cA[i], p.cB[i], p.cA[j], p.cB[j], 0.5 * (p.temp[i] + p.temp[j]));
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
let m = 0, wi = 0, wj = 0;
for (let s = 0; s < ns; s++) {
const a = comp[oi + s], b = comp[oj + s];
const mws = magW[s];
if (mws > 0) { wi += a * mws; wj += b * mws; }
if (a === b) continue;
const d = (b - a) * kx;
comp[oi + s] = a + d;
comp[oj + s] = b - d;
m += d < 0 ? -d : d;
}
if (wi + wj > 1e-6) {
const ki = 1 - kx;
const ni = ki * wi + kx * wj, nj = ki * wj + kx * wi;
const vi = vig[i], vj = vig[j], si = ss[i], sj = ss[j];
const ti = stp[i] > -273 ? stp[i] : p.temp[i], tj = stp[j] > -273 ? stp[j] : p.temp[j];
if (ni > 1e-9) {
vig[i] = (ki * wi * vi + kx * wj * vj) / ni;
ss[i] = (ki * wi * si + kx * wj * sj) / ni;
stp[i] = (ki * wi * ti + kx * wj * tj) / ni;
}
if (nj > 1e-9) {
vig[j] = (ki * wj * vj + kx * wi * vi) / nj;
ss[j] = (ki * wj * sj + kx * wi * si) / nj;
stp[j] = (ki * wj * tj + kx * wi * ti) / nj;
}
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
const __m34 = (() => {
const { MAX_SPECIES } = __m12;
const { PHASE } = __m16;
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
if (rule.wet) {
const sol = 1 - p.gran[i];
if (sol < 0.5) continue;
lim *= sol;
}
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
if (rule.wet && p.gran[i] > 0.7 && p.gran[j] > 0.7) continue;
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
const __m35 = (() => {
const { PHASE, SIM } = __m16;
const { MAX_SPECIES } = __m12;
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
this.recovered = /** @type {Record<string, number>} */ ({});
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
let best = -1, bf = 0, tot = 0;
for (let s = 0; s < sp.count; s++) {
const f = p.comp[i * MAX_SPECIES + s];
if (f > 0 && sp.defs[s]) t.skimmed[sp.defs[s].id] = (t.skimmed[sp.defs[s].id] || 0) + f;
tot += f;
if (f > bf) { bf = f; best = s; }
}
if (best >= 0 && bf >= 0.92 * tot && p.burn[i] < 0.05 && sp.defs[best]) {
const id = sp.defs[best].id;
t.recovered[id] = (t.recovered[id] || 0) + 1;
}
sim.removeParticle(i);
}
if (victims.length) sim.emit({ type: 'skim', count: victims.length, x: t.x, y: t.y });
}
return { TOOL_SPECS, ToolState, clampToInterior, toolForces, toolConstraints, LIQUID };
})();
// src/simulation/emitter.js
const __m36 = (() => {
const { PHASE, SIM, formPhase } = __m16;
const { COLUMN } = __m28;
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
const form = opts.ground && def.form === 'solid' ? 'powder' : def.form;
const k = Math.min(1, Math.max(0.5, this.sim.cauldron.mouth / 1.7));
this.active = {
def,
form,
x: opts.x ?? 0,
rate: opts.rate ?? (form === 'powder' ? 55 : form === 'gas' ? 30 : 75) * k,
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
const form = a.form;
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
if (this.blocked > 1.2) {
sim.emit({ type: 'full' });
this.stop();
return;
}
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
// src/simulation/electric.js
const __m37 = (() => {
const { PHASE } = __m16;
const KQ = 26; // conduction rate (game scaled)
const RE = 0.16; // contact distance
const JOULE = 140; // heat per unit of charge moved per unit of potential difference
function electricStep(sim, dt) {
const p = sim.p, n = p.count, q = p.q;
let any = false;
for (let i = 0; i < n; i++) if (q[i] > 1e-5 || q[i] < -1e-5) { any = true; break; }
if (!any) return;
const G = p.econd, T = p.temp, C = p.rhoCp, ph = p.phase;
const { pairI, pairJ, pairCount } = sim.grid;
const R2 = RE * RE;
for (let k = 0; k < pairCount; k++) {
const i = pairI[k], j = pairJ[k];
const dq = q[j] - q[i];
if (dq > -1e-5 && dq < 1e-5) continue;
if (ph[i] === PHASE.GAS || ph[j] === PHASE.GAS) continue;
const gi = G[i], gj = G[j];
if (gi <= 0 || gj <= 0) continue;
const dx = p.x[i] - p.x[j], dy = p.y[i] - p.y[j];
const r2 = dx * dx + dy * dy;
if (r2 >= R2) continue;
const g = ((2 * gi * gj) / (gi + gj)) * (1 - Math.sqrt(r2) / RE);
let m = KQ * g * dq * dt;
const lim = 0.24 * Math.abs(dq);
if (m > lim) m = lim; else if (m < -lim) m = -lim;
q[i] += m;
q[j] -= m;
const heat = JOULE * Math.abs(m * dq) * (1 - Math.min(0.9, g));
if (heat > 0) {
T[i] += (0.5 * heat) / C[i];
T[j] += (0.5 * heat) / C[j];
sim.energyIn += heat;
}
if (Math.abs(dq) > 0.55 && g > 0.25 && sim.rand() < 0.02) {
sim.emit({ type: 'spark', x: 0.5 * (p.x[i] + p.x[j]), y: 0.5 * (p.y[i] + p.y[j]), q: Math.abs(dq) });
}
}
}
function totalCharge(sim) {
let s = 0;
for (let i = 0; i < sim.p.count; i++) s += sim.p.q[i];
return s;
}
return { electricStep, totalCharge };
})();
// src/simulation/magic.js
const __m38 = (() => {
const { PHASE } = __m16;
const { FADE_RATE, SUPER_RATE, beyondSuper } = __m13;
const { GAS, LIQUID, PASTE, POWDER } = PHASE;
function magicStep(sim, dt) {
const p = sim.p, n = p.count;
const T = p.temp, mw = p.mw, vig = p.vig, ss = p.ss, stp = p.stp, tf = p.tf, ts = p.ts;
let transmuted = 0, faded = 0;
for (let i = 0; i < n; i++) {
if (mw[i] <= 0) continue;
const ph = p.phase[i];
if (ph === GAS) continue;
const t = T[i];
if (t > stp[i] && (ph === LIQUID || ph === PASTE || (ph === POWDER && p.gran[i] < 0.97))) stp[i] = t;
const over = t - tf[i];
if (over > 0 && vig[i] > 0) {
vig[i] *= Math.exp(-FADE_RATE * over * dt);
if (vig[i] < 1e-4) vig[i] = 0;
faded++;
if ((sim.steps + i) % 97 === 0) sim.emit({ type: 'fade', x: p.x[i], y: p.y[i] });
}
if (ss[i] < 1 && beyondSuper(t, ts[i])) {
ss[i] = Math.min(1, ss[i] + SUPER_RATE * dt * (1 + Math.abs(t - ts[i]) / 6));
if (transmuted++ < 4 && (sim.steps + i) % 5 === 0) sim.emit({ type: 'transmute', x: p.x[i], y: p.y[i], key: p.sk[i], temp: t });
}
}
sim.stats.faded = faded;
return transmuted;
}
return { magicStep };
})();
// src/simulation/world.js
const __m25 = (() => {
const { PHASE, SIM, TUNE, formPhase } = __m16;
const { Particles } = __m26;
const { NeighborGrid } = __m27;
const { Cauldron, COLUMN } = __m28;
const { SpeciesTable, MAX_SPECIES } = __m12;
const { refreshParticle } = __m29;
const { RigidBodies } = __m30;
const { thermalStep } = __m31;
const { phaseStep, classifyFluid } = __m32;
const { diffusionStep } = __m33;
const { ReactionSystem } = __m34;
const { ToolState, toolForces, toolConstraints } = __m35;
const { Emitter } = __m36;
const { electricStep } = __m37;
const { magicStep } = __m38;
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
this.cauldron = new Cauldron(/** @type {any} */ (opts.size || 'small'));
const cap = opts.capacity || Math.max(this.cauldron.capacity + 400, 1800);
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
this.stats = { stepMs: 0, steps: 0, pairs: 0, awake: 0, faded: 0 };
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
this.p.q[i] = def.charge || 0;
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
electricStep(this, dt2);
diffusionStep(this, dt2);
this.reactions.step(dt2);
phaseStep(this, dt2);
magicStep(this, dt2);
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
const __m39 = (() => {
const { MAX_SPECIES } = __m12;
const { refreshParticle } = __m29;
const { Simulation } = __m25;
const { CAULDRON_SIZES } = __m28;
const F32_FIELDS_V1 = ['x', 'y', 'vx', 'vy', 'temp', 'lat', 'eph', 'restX', 'restY', 'agit', 'burn', 'wet'];
const F32_FIELDS_V2 = [...F32_FIELDS_V1, 'q'];
const F32_FIELDS = [...F32_FIELDS_V2, 'vig', 'ss', 'stp'];
const SNAPSHOT_VERSION = 3;
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
if (snap.n > sim.capacity) console.warn(`Cauldron snapshot holds ${snap.n} particles; this vessel holds ${sim.capacity}.`);
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
const v = snap.v || 1;
const fields = v >= 3 ? F32_FIELDS : v >= 2 ? F32_FIELDS_V2 : F32_FIELDS_V1;
const from = CAULDRON_SIZES[snap.size], to = sim.cauldron.spec;
const remap = from && from.key !== to.key && (from.depth > to.depth + 1e-6 || from.belly > to.belly + 1e-6);
const sx = remap ? to.belly / from.belly : 1, sy = remap ? to.depth / from.depth : 1;
p.count = n;
for (let i = 0; i < n; i++) {
p.q[i] = 0; p.vig[i] = 1; p.ss[i] = 0; p.stp[i] = -300;
fields.forEach((name, k) => {
/** @type {any} */ (p)[name][i] = f[k * snap.n + i];
});
if (remap) {
p.x[i] *= sx;
if (p.y[i] > 0) p.y[i] *= sy;
p.restX[i] *= sx; p.restY[i] *= sy;
}
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
const __m41 = (() => {
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
const __m42 = (() => {
const { PHASE } = __m16;
const { LIQUID, POWDER, PASTE, SOLID, GAS } = PHASE;
const LS = 9;
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
this.liq = new Float32Array(n * LS);
this.sol = new Float32Array(n * 4);
this.gas = new Float32Array(n * 4);
this.wl = new Float32Array(n); // liquid weight, contiguous (blur, neighbours)
this.wb = new Float32Array(n); // smoothed liquid weight (surface shape)
this.wt = new Float32Array(n); // blur scratch
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
let anySolid = false, anyGas = false, anyGrain = false;
for (let i = 0; i < n; i++) {
const x = p.x[i] * s + view.ox, y = p.y[i] * s + view.oy;
if (x < minX) minX = x; if (x > maxX) maxX = x;
if (y < minY) minY = y; if (y > maxY) maxY = y;
const ph = p.phase[i];
if (ph === SOLID) anySolid = true; else if (ph === GAS) anyGas = true; else if (ph === POWDER) anyGrain = true;
}
const pad = Math.ceil(0.16 * s) + 2;
const bx = Math.floor(minX) - pad, by = Math.floor(minY) - pad;
const w = Math.ceil(maxX) + pad - bx, h = Math.ceil(maxY) + pad - by;
if (w <= 0 || h <= 0 || w * h > 4e6) return null;
this._alloc(w, h);
const N = w * h;
const { liq, sol, gas, grain } = this;
liq.fill(0, 0, N * LS);
if (anySolid) sol.fill(0, 0, N * 4);
if (anyGas) gas.fill(0, 0, N * 4);
if (anyGrain) grain.fill(0, 0, N);
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
const Ti = T[i];
const cy = fy | 0;
const inv = 1 / (rl * rl), rl2 = rl * rl;
for (let dy = -RL; dy <= RL; dy++) {
const yy = cy + dy;
if (yy < 0 || yy >= h) continue;
const ddy = yy + 0.5 - fy;
const rem = rl2 - ddy * ddy;
if (rem <= 0) continue;
const half = Math.sqrt(rem);
const x0 = Math.max(0, Math.floor(fx - 0.5 - half)), x1 = Math.min(w - 1, Math.ceil(fx - 0.5 + half));
const row = yy * w;
for (let xx = x0; xx <= x1; xx++) {
const ddx = xx + 0.5 - fx;
let q = 1 - (ddx * ddx + ddy * ddy) * inv;
if (q <= 0) continue;
q *= q;
const k = (row + xx) * LS;
liq[k] += q; liq[k + 1] += q * r; liq[k + 2] += q * g; liq[k + 3] += q * b;
liq[k + 4] += q * o; liq[k + 5] += q * isPaste; liq[k + 6] += q * tex; liq[k + 7] += q * glow; liq[k + 8] += q * Ti;
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
liq[k * LS + 7] += p.glow[i] + p.burn[i];
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
const k4 = k * 4;
sol[k4] += q; sol[k4 + 1] += q * r; sol[k4 + 2] += q * g; sol[k4 + 3] += q * b;
liq[k * LS + 7] += q * p.glow[i] * 0.5;
}
}
} else if (ph === GAS) {
const cy = fy | 0;
const inv = 1 / (rgas * rgas), rg2 = rgas * rgas;
const gr0 = r * 0.5 + 0.5, gg0 = g * 0.5 + 0.5, gb0 = b * 0.5 + 0.5;
for (let dy = -RG; dy <= RG; dy++) {
const yy = cy + dy;
if (yy < 0 || yy >= h) continue;
const ddy = yy + 0.5 - fy;
const rem = rg2 - ddy * ddy;
if (rem <= 0) continue;
const half = Math.sqrt(rem);
const x0 = Math.max(0, Math.floor(fx - 0.5 - half)), x1 = Math.min(w - 1, Math.ceil(fx - 0.5 + half));
for (let xx = x0; xx <= x1; xx++) {
const ddx = xx + 0.5 - fx;
let q = 1 - (ddx * ddx + ddy * ddy) * inv;
if (q <= 0) continue;
q *= q;
const k = (yy * w + xx) * 4;
gas[k] += q; gas[k + 1] += q * gr0; gas[k + 2] += q * gg0; gas[k + 3] += q * gb0;
}
}
}
}
const wb = this.wb, wt = this.wt;
const wl = this.wl;
for (let k = 0; k < N; k++) wl[k] = liq[k * LS];
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
const gp = anyGrain ? grain[k] : 0;
if (gp) {
R = (gp & 255) / 255; G = ((gp >>> 8) & 255) / 255; B = ((gp >>> 16) & 255) / 255; A = 1;
}
const sw = anySolid ? sol[k * 4] : 0;
if (sw > 0.45) {
const inv = 1 / sw;
let r = sol[k * 4 + 1] * inv, g = sol[k * 4 + 2] * inv, b = sol[k * 4 + 3] * inv;
const up = y > 0 ? sol[(k - w) * 4] : 0, left = x > 0 ? sol[(k - 1) * 4] : 0, down = y < h - 1 ? sol[(k + w) * 4] : 0, right = x < w - 1 ? sol[(k + 1) * 4] : 0;
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
const c9 = kc * LS;
let r = liq[c9 + 1] * inv, g = liq[c9 + 2] * inv, b = liq[c9 + 3] * inv;
const paste = liq[c9 + 5] * inv;
const opac = liq[c9 + 4] * inv;
let a = Math.min(0.97, Math.max(0.84, opac + 0.1));
const tex = liq[c9 + 6] * inv;
const up = y > 0 ? wb[k - w] : 0;
const down = y < h - 1 ? wb[k + w] : 0;
let l = 1;
if (paste > 0.5) {
a = 1;
l = 0.9 + tex * 0.09;
if (up <= thr) l = 1.12;
else if (down <= thr || (x > 0 && wb[k - 1] <= thr) || (x < w - 1 && wb[k + 1] <= thr)) l = 0.7;
} else {
const clear = Math.max(0, 1 - opac);
const ct = clear * 0.45;
r = r * (1 - ct) + 0.42 * ct; g = g * (1 - ct) + 0.6 * ct; b = b * (1 - ct) + 0.82 * ct;
l = (0.98 + tex * 0.03) * (1 - clear * 0.55);
if (up <= thr) l = 1.28; // meniscus highlight
else if (y > 1 && wb[k - 2 * w] <= thr) l = 1.1;
const depth = (y - surf[x]) * depthScale;
l *= 1 - Math.min(0.42, depth * 0.16);
if (down <= thr) l *= 0.78;
}
const temp = liq[c9 + 8] * inv;
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
const gw = anyGas ? gas[k * 4] : 0;
if (gw > 0.04) {
const inv = 1 / gw;
const a = 0.7 * (1 - Math.exp(-gw * 0.55)) * (0.9 + 0.1 * shimmer);
const r = gas[k * 4 + 1] * inv, g = gas[k * 4 + 2] * inv, b = gas[k * 4 + 3] * inv;
R = R * (1 - a) + r * a; G = G * (1 - a) + g * a; B = B * (1 - a) + b * a;
A = A + (1 - A) * a;
}
const gv = liq[k * LS + 7];
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
const __m43 = (() => {
const { PAL, hex2rgb } = __m41;
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
const __m40 = (() => {
const { PAL, paintBackground, renderCauldron, paintHearth, makeCanvas, rgbStr, hex2rgb, drawJar, rect } = __m41;
const { FluidRenderer } = __m42;
const { Effects } = __m43;
const { COLUMN } = __m28;
const { PHASE } = __m16;
const { PROPS } = __m13;
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
if (quality === 'low' || (quality === 'medium' && (cssW / artPx) * (cssH / artPx) > 90000)) artPx += 1;
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
case 'spark': this.fx.burst(1, x, y, 5, s * 0.5, [190, 220, 255], 0.8); break;
case 'transmute': {
const c = e.key >= 0 && PROPS[e.key] ? PROPS[e.key].color : [1, 1, 1];
this.fx.burst(4, x, y, 6, s * 0.7, [c[0] * 255, c[1] * 255, c[2] * 255], 1.2);
break;
}
case 'fade':
this.fx.add(7, x, y, (this.fx.rand() - 0.5) * s * 0.2, -s * 0.7, 0.9, Math.max(2, s * 0.06), [200, 180, 255]);
break;
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
const __m44 = (() => {
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
// src/rendering/scenes.js
const __m45 = (() => {
function R(ctx, x, y, w, h, c) {
ctx.fillStyle = c;
ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
}
function css(rgb, k = 1) {
return `rgb(${Math.round(Math.min(255, rgb[0] * 255 * k))},${Math.round(Math.min(255, rgb[1] * 255 * k))},${Math.round(Math.min(255, rgb[2] * 255 * k))})`;
}
function mix(a, b, t) {
return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
function drawRaw(ctx, x, y, shape, color, fill = 1) {
const c = css(color), d = css(color, 0.62), hi = css(mix(color, [1, 1, 1], 0.45)), k = '#1a1218';
const g = '#4f7a31', gd = '#335224';
const s = Math.max(0.35, fill);
const P = (px, py, w, h, col) => R(ctx, x + px, y + py, w, h, col);
switch (shape) {
case 'root': {
P(7, 1, 2, 4, g); P(5, 2, 2, 2, gd); P(9, 2, 2, 2, g);
const h = Math.round(9 * s);
P(6, 5, 4, h, k); P(7, 5, 2, h, c); P(7, 5, 1, h, hi);
P(4, 7, 3, 1, d); P(9, 9, 3, 1, d); P(5, 11, 2, 1, d);
break;
}
case 'leaf': case 'moss': {
const n = Math.max(1, Math.round(3 * s));
for (let i = 0; i < n; i++) {
const ox = [4, 8, 6][i], oy = [6, 5, 2][i];
P(ox - 1, oy, 6, 5, k); P(ox, oy + 1, 4, 3, shape === 'moss' ? d : c); P(ox + 1, oy + 1, 2, 1, hi);
}
P(7, 10, 2, 5, gd);
if (shape === 'moss') { P(3, 12, 10, 3, k); P(4, 12, 8, 2, c); P(5, 12, 2, 1, hi); }
break;
}
case 'petal': case 'flower': case 'clover': {
P(7, 8, 2, 7, g);
P(4, 11, 3, 2, g);
const r = Math.round(2 + 2 * s);
P(8 - r, 6 - r, r * 2, r * 2, k);
P(9 - r, 7 - r, r * 2 - 2, r * 2 - 2, c);
P(7, 5, 2, 2, shape === 'flower' ? '#ffe58a' : shape === 'clover' ? hi : css(color, 1.2));
P(8 - r + 1, 7 - r, 1, 1, hi);
break;
}
case 'cap': {
P(7, 9, 2, 6, '#e6d3a5'); P(7, 9, 1, 6, '#f6ead0');
const w = Math.round(6 + 4 * s);
P(8 - w / 2, 5, w, 4, k); P(8 - w / 2 + 1, 5, w - 2, 3, c);
P(8 - w / 2 + 2, 6, 2, 1, hi); P(8, 7, 1, 1, hi);
break;
}
case 'bean': {
P(6, 3, 2, 9, g);
for (let i = 0; i < Math.round(3 * s); i++) { P(3 + i * 3, 6 + (i % 2) * 3, 4, 3, k); P(4 + i * 3, 7 + (i % 2) * 3, 2, 1, c); }
break;
}
case 'pepper': {
P(7, 2, 2, 3, g);
const h = Math.round(5 + 6 * s);
P(5, 4, 6, h, k); P(6, 4, 4, h - 1, c); P(6, 5, 1, h - 3, hi);
break;
}
case 'scale': {
const w = Math.round(6 + 4 * s);
P(8 - w / 2, 6, w, 7, k); P(9 - w / 2, 7, w - 2, 5, c);
for (let i = 0; i < w - 3; i += 2) P(9 - w / 2 + i, 8, 1, 3, d);
P(9 - w / 2, 7, 2, 1, hi);
break;
}
case 'crystal': {
const h = Math.round(5 + 7 * s);
P(6, 14 - h, 4, h, k); P(7, 15 - h, 2, h - 1, c); P(7, 15 - h, 1, h - 2, hi);
P(3, 16 - Math.round(h * 0.6), 3, Math.round(h * 0.6) - 1, k); P(4, 16 - Math.round(h * 0.6), 1, Math.round(h * 0.6) - 2, c);
P(10, 16 - Math.round(h * 0.7), 3, Math.round(h * 0.7) - 1, k); P(11, 16 - Math.round(h * 0.7), 1, Math.round(h * 0.7) - 2, c);
break;
}
case 'powder': {
const w = Math.round(6 + 6 * s);
P(8 - w / 2, 12, w, 3, k); P(9 - w / 2, 11, w - 2, 3, c); P(10 - w / 2, 10, w - 4, 2, c); P(10 - w / 2, 10, 2, 1, hi);
P(9, 13, 1, 1, d); P(6, 12, 1, 1, d);
break;
}
default: { // stone
const w = Math.round(6 + 6 * s);
P(8 - w / 2, 9, w, 6, k); P(9 - w / 2, 9, w - 2, 5, c); P(9 - w / 2, 9, w - 3, 1, hi); P(10 - w / 2, 13, w - 3, 1, d);
}
}
}
function rawSprite(shape, color, fill = 1) {
const cv = document.createElement('canvas');
cv.width = 16; cv.height = 16;
const ctx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d'));
drawRaw(ctx, 0, 0, shape, color, fill);
return cv;
}
return { drawRaw, rawSprite };
})();
// src/game/measure.js
const __m46 = (() => {
const { MAX_SPECIES } = __m12;
const { PHASE, SIM } = __m16;
const { oklabToRgb } = __m8;
const { sampleMagic } = __m13;
function measureParticles(sim, indices) {
const n = indices.length;
if (!n) return null;
const p = sim.p, sp = sim.species, S = MAX_SPECIES;
const ns = sp.count;
const comp = new Float64Array(ns);
let L = 0, A = 0, B = 0, T = 0, glow = 0;
const phases = [0, 0, 0, 0, 0];
for (const i of indices) {
let tot = 0;
for (let s = 0; s < ns; s++) tot += p.comp[i * S + s];
tot = tot || 1;
for (let s = 0; s < ns; s++) comp[s] += p.comp[i * S + s] / tot;
L += p.colL[i]; A += p.colA[i]; B += p.colB[i];
T += p.temp[i];
glow += p.glow[i];
phases[p.phase[i]]++;
}
const composition = {};
for (let s = 0; s < ns; s++) {
const def = sp.defs[s];
if (!def || comp[s] / n < 1e-5) continue;
composition[def.id] = comp[s] / n;
}
const lab = [L / n, A / n, B / n];
const mg = sampleMagic(sim, indices);
return {
count: n,
ml: n * SIM.ML_PER_PARTICLE,
composition,
color: oklabToRgb(lab[0], lab[1], lab[2]),
lab,
temperature: T / n,
magic: Array.from(mg.magic, (v) => Math.round(v * 100) / 100),
vig: mg.vig,
ss: mg.ss,
steep: mg.steep,
phases: { liquid: phases[0] / n, powder: phases[1] / n, paste: phases[2] / n, solid: phases[3] / n, gas: phases[4] / n },
glow: glow / n,
};
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
return { measureParticles, tapSelection };
})();
// src/game/journal.js
const __m47 = (() => {
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
if (m) state.learn(e.id, 'seen', true);
break;
}
case 'phase': {
const id = e.species;
if (!id) break;
const T = Math.round(e.temp);
if (e.to === 'gas') {
add({ key: `boil:${id}`, title: `${name(id)} boils`, text: `It turned to vapour at about ${T}°C. Magic that boils away is lost unless the lid keeps it in.`, kind: 'phase', material: id });
achievements.push(...state.unlock('boil'));
} else if (e.to === 'solid') {
add({ key: `freeze:${id}`, title: `${name(id)} freezes`, text: `It froze solid at about ${T}°C. A frozen brew cannot be stirred: crush it or let it thaw.`, kind: 'phase', material: id });
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
add({ key: `heatmix:${e.a}:${e.b}`, title: 'Blended by heat', text: `${name(e.a)} and ${name(e.b)} kept apart while cold but blended once hot — and stay blended.`, kind: 'mixing', material: e.a });
achievements.push(...state.unlock('heatmix'));
break;
}
case 'ignite': {
const id = e.species;
add({ key: `fire:${id}`, title: `${name(id)} burns`, text: 'It caught fire where it met the air. Burnt magic is gone for good. Closing the lid starves the flame.', kind: 'fire', material: id });
achievements.push(...state.unlock('fire'));
break;
}
case 'crush':
achievements.push(...state.unlock('crush'));
add({ key: 'crush', title: 'Smashing stones', text: 'The pestle smashes whole stones into powder without losing any. Only powder dissolves, and hot water draws out far more magic.', kind: 'tool' });
break;
case 'layers': {
add({ key: `layers:${e.a}:${e.b}`, title: 'Separate layers', text: `${name(e.a)} and ${name(e.b)} refuse to blend while cold and settle into layers. Heat helps them blend.`, kind: 'mixing', material: e.a });
break;
}
}
return { entries, achievements };
}
return { processEvent };
})();
// src/game/autobrew.js
const __m48 = (() => {
const { PHASE, SIM } = __m16;
const { MAX_SPECIES } = __m12;
class AutoBrewer {
constructor(sim, plan, lookup, opts = {}) {
this.sim = sim;
this.plan = plan;
this.lookup = lookup;
this.scale = opts.scale || 1;
this.onPour = opts.onPour;
this.onPoured = opts.onPoured;
this.stage = 'pour';
this.ingIndex = 0;
this.t = 0;
this.stageT = 0;
this.phase = 0;
this.status = 'Preparing';
this.failed = false;
this.chilling = false;
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
control(target, margin = 60) {
const T = this.meanTemp();
const f = this.sim.furnace;
const err = target - T;
let s = Math.max(-1, Math.min(1, err / (err < 0 ? 4 : 12)));
if (s > 0) s = Math.min(s, Math.max(0.04, (target + margin - 20) / Math.max(1, f.maxFlame - 20)));
f.setting = s;
return Math.abs(err);
}
goal() {
const plan = this.plan;
const hot = (plan.heatTo ?? 20) > 25, cold = (plan.coolTo ?? 20) < 15;
if (this.chilling || (cold && !hot)) return plan.coolTo;
return plan.heatTo ?? 20;
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
if (this.t > 420) { this.failed = true; this.finish(); return; }
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
const ground = !!ing.ground && def.form === 'solid';
sim.emitter.start(def, { x: (this.ingIndex % 2 ? -0.35 : 0.35), amount: n, rate: def.form === 'powder' || ground ? 70 : 110, ground });
this.status = ground ? `Grinding and adding ${def.name}` : `Pouring ${def.name}`;
if (this.onPoured) this.onPoured(ing.id, n, ground);
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
const need = plan.stir ?? (plan.knead ? 14 : 7);
if (this.stageT > need) this.next('heat');
return;
}
case 'heat': {
const goal = this.goal();
this.status = goal < 15 ? 'Chilling' : `Heating to ${Math.round(goal)}°C`;
const err = this.control(goal);
if (this.stageT % 3 < 1.5) this.stir(0.8); else this.release();
if (err < 4 || this.stageT > 70) this.next('hold');
return;
}
case 'hold': {
this.control(this.goal());
this.status = 'Holding';
if (this.stageT % 2.5 < 1.5) this.stir(0.9); else this.release();
if (this.stageT > (plan.hold ?? 6) + 4) {
if (!this.chilling && (plan.heatTo ?? 20) > 25 && (plan.coolTo ?? 20) < 15) { this.chilling = true; this.next('heat'); }
else this.next('serve');
}
return;
}
case 'serve': {
const err = this.control(plan.serveTemp ?? 20, (plan.coolTo ?? 20) < 0 ? 25 : 60);
this.status = `Bringing to ${Math.round(plan.serveTemp ?? 20)}°C`;
if (this.stageT % 2 < 1.2) this.stir(0.8); else this.release();
if ((err < 3 && this.stageT > 3 && !this.frozen()) || this.stageT > 120) this.finish();
return;
}
}
}
frozen() {
const p = this.sim.p;
for (let i = 0; i < p.count; i++) if (p.phase[i] === PHASE.SOLID) return true;
return false;
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
const __m49 = (() => {
const { h, btn, modal, toast, coins, confirmDialog, clear } = __m2;
const { icon } = __m3;
const { drawJar } = __m41;
const { EQUIPMENT, RANKS } = __m18;
const { ACHIEVEMENTS } = __m5;
const { PROPS, PROP_BY_KEY } = __m13;
const { reqText } = __m10;
const { rawSprite } = __m45;
const { rgbToHex } = __m8;
const { SIM } = __m16;
const { exportSave, parseImport, saveGame } = __m23;
const { audio } = __m4;
const CAT_LABEL = { heat: 'Fire', cold: 'Frost', vessel: 'Cauldrons', tool: 'Tools', instrument: 'Instruments', trials: 'Testing room', garden: 'Garden', storage: 'Shelves', guild: 'Guild' };
function jarCanvas(m, w = 22, hh = 30) {
if (m.form === 'solid') {
const cv = rawSprite(m.shape || 'stone', m.look || m.color);
cv.style.width = w * 2 + 'px';
cv.style.height = w * 2 + 'px';
return cv;
}
const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(w), height: String(hh), style: { width: w * 2 + 'px', height: hh * 2 + 'px' } }));
drawJar(cv.getContext('2d'), 2, 0, w - 4, hh, m.look || m.color, m.form);
return cv;
}
function magicChips(magic, min = 1) {
const list = PROPS.filter((p) => ((magic && magic[p.key]) || 0) >= min);
if (!list.length) return [h('span', { class: 'muted', text: '—' })];
return list.map((p) => h('span', { class: 'fx-chip', title: p.label }, icon(p.icon, 'sm'), ` ${Math.round(magic[p.key])}`));
}
function thresholdChips(m) {
const out = [];
if (Number.isFinite(m.fadeT)) out.push(h('span', { class: 'fx-chip dim', title: `Its magic fades above ${m.fadeT}°C` }, icon('flame', 'sm'), ` >${m.fadeT}°`));
if (Number.isFinite(m.superT)) out.push(h('span', { class: 'fx-chip dim', title: `Super transition at ${m.superT}°C: all its magic becomes ${PROP_BY_KEY[m.superKey].label}` }, icon('spark', 'sm'), ` ${m.superT}° `, icon(PROP_BY_KEY[m.superKey].icon, 'sm')));
return out;
}
function swatch(rgb) {
return h('span', { class: 'swatch', style: { background: rgbToHex(rgb) } });
}
function openShop(lab) {
const st = lab.state;
const body = h('div');
const coinLine = h('div', { class: 'row shop-coins' });
const m = modal({ title: 'Guild Shop', body: [body], wide: true, onClose: () => lab.refreshHud(true) });
m.el.insertBefore(coinLine, m.body);
const render = () => {
clear(coinLine).append(icon('coin'), h('b', { text: coins(st.coins) }));
clear(body);
for (const cat of Object.keys(CAT_LABEL)) {
const items = EQUIPMENT.filter((e) => e.category === cat && e.price > 0);
if (!items.length) continue;
body.appendChild(h('h3', { class: 'shop-cat', text: CAT_LABEL[cat] }));
const list = h('div', { class: 'list' });
for (const e of items) {
const owned = st.has(e.id);
const rankOk = e.rank <= st.rank;
const reqOk = !e.requires || e.requires.every((r) => st.has(r));
let action;
if (owned) action = icon('check');
else if (!rankOk) action = h('span', { class: 'small muted' }, icon('lock', 'sm'), ` ${RANKS[e.rank].name}`);
else action = btn(`${coins(e.price)}`, async () => {
const ok = await confirmDialog(`Buy ${e.name}?`, `${e.desc}\n${e.price} coins.`, 'Buy');
if (!ok) return;
const r = st.buyEquipment(e.id);
if (r.ok) {
audio.play('purchase');
toast(e.name, '', e.icon);
lab.buildActions();
lab.refreshCapabilities();
lab.save();
} else { audio.play('error'); toast('Cannot buy', r.reason, 'lock'); }
render();
}, { icon: 'coin', cls: 'gold', disabled: st.coins < e.price || !reqOk, act: 'equip-' + e.id });
list.appendChild(h('div', { class: 'item parch' + (owned || rankOk ? '' : ' locked') },
h('img', { src: icon(e.icon).src, class: 'ico lg', alt: '' }),
h('div', {}, h('div', { class: 'title', text: e.name }), h('div', { class: 'meta', text: e.desc })),
action));
}
body.appendChild(list);
}
};
render();
audio.play('page');
return m;
}
function openIngredient(lab, id) {
const st = lab.state;
const m = st.lookup(id);
if (!m) return;
const bars = h('div', { class: 'aspect-bars' });
for (const p of PROPS) {
const v = (m.magic && m.magic[p.key]) || 0;
bars.append(h('span', { title: p.label }, icon(p.icon, 'sm')), h('div', { class: 'bar' }, h('i', { style: { width: Math.min(100, v) + '%', background: `rgb(${p.color.map((c) => Math.round(c * 255)).join(',')})` } })), h('b', { text: String(Math.round(v)) }));
}
const stock = lab.sandbox ? '∞' : `${Math.round(st.stock(id))}`;
modal({
title: m.name,
body: [
h('div', { class: 'card parch ing-card' }, jarCanvas(m, 22, 30), h('div', {},
h('div', { class: 'small', text: m.description }),
h('div', { class: 'row small' }, icon('jar', 'sm'), ` ${stock} ml`, m.form === 'solid' ? h('span', { class: 'tag', title: 'Smash it first: mortar or pestle' }, icon('mortar', 'sm')) : null))),
h('div', { class: 'card parch' }, bars),
h('div', { class: 'card parch row wrap' }, ...thresholdChips(m)),
],
});
}
function openHint(lab) {
const st = lab.state;
const com = st.current;
if (!com || com.type !== 'order') return;
const show = () => {
const ref = com.reference;
const main = ref.ingredients.slice().sort((a, b) => b.n - a.n).map((i) => st.lookup(i.id)).find((x) => x && x.kind !== 'water');
const total = ref.ingredients.reduce((a, b) => a + b.n, 0);
const rows = ref.ingredients.map((i) => {
const m = st.lookup(i.id);
const share = Math.round((i.n / total) * 10) * 10;
return h('div', { class: 'row' }, jarCanvas(m, 12, 16), h('span', { text: `~${share}%  ${m.name}` }), i.ground ? icon('mortar', 'sm') : null);
});
const tips = [];
if ((ref.heatTo ?? 20) > 30) tips.push(h('div', { class: 'row small' }, icon('flame', 'sm'), ` ~${Math.round(ref.heatTo / 5) * 5}°`));
if ((ref.coolTo ?? 20) < 12) tips.push(h('div', { class: 'row small' }, icon('snow', 'sm'), ` ~${Math.round(ref.coolTo / 5) * 5}°`));
if (ref.knead) tips.push(h('div', { class: 'row small' }, icon('spoon', 'sm'), ' stir well'));
void main;
modal({ title: 'Guild advice', body: [h('div', { class: 'card parch' }, ...rows, ...tips)] });
};
if (com.hintBought || !com.hintCost) { com.hintBought = true; show(); return; }
confirmDialog('Ask the guild?', `${com.hintCost} coins.`, 'Pay').then((ok) => {
if (!ok) return;
if (st.coins < com.hintCost) { toast('Not enough coins', '', 'coin'); return; }
st.spend(com.hintCost);
com.hintBought = true;
audio.play('coin');
lab.refreshHud();
show();
});
}
function showDaySummary(lab, summary, onDone) {
const st = lab.state;
const net = summary.earned - summary.spent - summary.refunds;
modal({
title: `Day ${summary.day}`,
onClose: onDone,
body: [
h('div', { class: 'card parch' },
h('div', { class: 'kv' },
icon('deal'), h('span', { text: String(summary.served) }),
icon('coin'), h('span', { text: `+${coins(summary.earned)}` }),
icon('bag'), h('span', { text: `−${coins(summary.spent)}` }),
icon('refund'), h('span', { text: `−${coins(summary.refunds)}` }),
icon('scales'), h('b', { text: (net >= 0 ? '+' : '') + coins(net) }),
icon('star'), h('span', { text: `${st.rankName} · ${st.reputation}` }),
)),
h('div', { class: 'card parch row' }, icon(st.marketEvent.icon), h('b', { text: st.marketEvent.name })),
],
foot: [btn('Open the shop', () => document.querySelector('.overlay .modal-head .btn').dispatchEvent(new MouseEvent('click')), { cls: 'primary', icon: 'door', act: 'next-day' })],
});
}
function renderRecipes(lab, container) {
const st = lab.state;
const render = () => {
clear(container);
const save = btn('Save the brew', () => {
const parts = lab.batchParts();
if (!parts.length) { toast('The cauldron is empty', '', 'cauldron'); return; }
const p = lab.sim.p;
let T = 0, n = 0;
for (let i = 0; i < p.count; i++) { T += p.temp[i]; n++; }
const draft = lab.recipeDraft({ temperature: n ? T / n : 20, color: [0.5, 0.5, 0.5] });
const evs = st.addRecipe({ ...draft, name: `Recipe ${st.recipes.length + 1}`, id: st.idStale ? null : { ...st.idCard.values } });
for (const e of evs) lab.announce(e);
toast('Recipe saved', '', 'book');
render();
}, { icon: 'book', act: 'save-recipe' });
container.appendChild(h('div', { class: 'row' }, save));
if (!st.recipes.length) {
container.appendChild(h('div', { class: 'card parch small muted', text: '—' }));
return;
}
for (const r of st.recipes) {
const total = r.ingredients.reduce((a, i) => a + i.ml, 0) || 1;
const parts = h('div', { class: 'meta' }, ...r.ingredients.map((i) => {
const m = st.lookup(i.id);
return h('span', { class: 'fx-chip' }, swatch(m ? m.look || m.color : [0.5, 0.5, 0.5]), ` ${Math.round(i.ml)}`, i.ground ? icon('mortar', 'sm') : null);
}));
const steps = h('div', { class: 'meta' },
r.maxTemp > 30 ? h('span', { class: 'fx-chip' }, icon('flame', 'sm'), ` ${r.maxTemp}°`) : null,
r.minTemp < 12 ? h('span', { class: 'fx-chip' }, icon('snow', 'sm'), ` ${r.minTemp}°`) : null,
r.stirSeconds ? h('span', { class: 'fx-chip' }, icon('spoon', 'sm'), ` ${r.stirSeconds}s`) : null,
h('span', { class: 'fx-chip dim' }, icon('flask', 'sm'), ` ${Math.round(total)}`));
const idChips = r.id ? h('div', { class: 'meta' }, icon('scroll', 'sm'), ...PROPS.filter((p) => Number.isFinite(r.id[p.key])).map((p) => h('span', { class: 'fx-chip dim' }, icon(p.icon, 'sm'), ` ${r.id[p.key]}`))) : null;
const canAfford = r.ingredients.every((i) => lab.sandbox || st.stock(i.id) >= i.ml);
const actions = h('div', { class: 'row wrap' },
btn('', () => { prepareRecipe(lab, r); lab.showView('brew'); }, { icon: 'pour', cls: 'icon', disabled: !canAfford, title: canAfford ? 'Pour it all in' : 'Not enough in store', act: 'prepare' }),
st.has('homunculus') ? btn('', () => { lab.startHomunculus(r); lab.showView('brew'); }, { icon: 'homunculus', cls: 'icon', disabled: !canAfford, title: 'Let the homunculus brew it', act: 'homunculus' }) : null,
btn('', () => { const name = prompt('Rename recipe', r.name); if (name) { r.name = name.slice(0, 40); render(); } }, { icon: 'scroll', cls: 'icon', title: 'Rename' }),
btn('', async () => { if (await confirmDialog('Delete recipe?', r.name, 'Delete', 'danger')) { st.recipes.splice(st.recipes.indexOf(r), 1); render(); } }, { icon: 'trash', cls: 'icon danger', title: 'Delete' }));
container.appendChild(h('div', { class: 'item parch' },
swatch(r.color || [0.5, 0.5, 0.5]),
h('div', {}, h('div', { class: 'title', text: r.name }), parts, steps, idChips),
actions));
}
};
render();
}
function prepareRecipe(lab, r) {
const queue = r.ingredients.slice();
const next = () => {
if (!queue.length) { toast('All poured', '', 'book', 2200); return; }
if (lab.sim.emitter.pouring) { setTimeout(next, 200); return; }
const i = queue.shift();
lab.selectIngredient(i.id);
lab.startPour(lab.pourX, Math.round(i.ml / SIM.ML_PER_PARTICLE), i.ground);
setTimeout(next, 250);
};
next();
}
function renderJournal(lab, container, tab = 'journal') {
const st = lab.state;
clear(container);
if (tab === 'achievements') {
const list = h('div', { class: 'list' });
for (const a of ACHIEVEMENTS) {
const got = !!st.achievements[a.id];
list.appendChild(h('div', { class: 'item parch' + (got ? '' : ' locked') }, icon(got ? 'trophy' : 'lock'), h('div', {}, h('div', { class: 'title', text: a.name }), h('div', { class: 'meta', text: a.desc })), h('span', { class: 'price' }, icon('coin', 'sm'), String(a.reward))));
}
container.appendChild(list);
return;
}
const entries = Object.values(st.journal).sort((a, b) => b.day - a.day);
if (!entries.length) container.appendChild(h('div', { class: 'card parch small muted', text: '—' }));
for (const e of entries) {
container.appendChild(h('div', { class: 'card parch' }, h('div', { class: 'row' }, icon(e.kind === 'magic' ? 'spark' : e.kind === 'fire' ? 'flame' : e.kind === 'phase' ? 'thermo' : 'scroll'), h('b', { text: e.title }), h('span', { class: 'spacer' }), h('span', { class: 'small muted', text: `${e.day}` })), h('div', { class: 'small', text: e.text })));
}
}
function openPause(lab) {
const app = lab.app;
let m;
const items = [
btn('Resume', () => m.close(), { cls: 'primary', icon: 'speed', act: 'resume' }),
btn('How to play', () => { m.close(); openHelp(); }, { icon: 'help', act: 'help' }),
btn('Settings & saves', () => { m.close(); openSettings(app, lab); }, { icon: 'gear', act: 'settings' }),
];
if (!lab.sandbox) items.push(btn('Restart tutorial', () => { m.close(); lab.tutorial && lab.tutorial.start(true); }, { icon: 'bulb' }));
items.push(btn(lab.sandbox ? 'Leave experiment' : 'Save & quit', () => { m.close(); app.showMenu(); }, { icon: 'door', act: 'quit' }));
m = modal({ title: lab.sandbox ? 'Free Experiment' : 'Paused', body: h('div', { class: 'list' }, items) });
}
function openHelp() {
const sec = (ic, title, lines) => h('div', { class: 'card parch' }, h('h3', {}, icon(ic), ' ' + title), ...lines.map((l) => h('div', { class: 'small', text: '• ' + l })));
modal({
title: 'How to play',
wide: true,
body: [
sec('stall', 'Customers', ['They bring a problem and ask for magic: ranges on six properties (Vitality, Ardor, Frost, Levity, Charm, Bane).', 'They buy on your label — the Potion ID — and haggle: name a price, they counter, until you agree or they lose patience.', 'If what they drink misses their range, they come back for a refund. Some bluff. Only an expert’s certificate (costly) proves a potion was right.']),
sec('seedling', 'Garden', ['Everything grows in your garden: water from the well, liquids from plant beds, stones from crystal beds.', 'Plant beds grow only while moist: water them. Harvest takes what has grown; the bed starts again.']),
sec('cauldron', 'Brewing', ['A potion’s magic is the proportion-weighted blend of its ingredients’ magic. Water dilutes.', 'Smash stones (mortar or pestle): only powder dissolves, and hot water draws out far more of its magic.', 'Heat helps liquids that keep apart when cold to blend.', 'Too hot and magic fades. Every ingredient also has a super-transition temperature, mostly far out of reach — but blends average them (weighted by magic). Cross it and all the magic pours into one property.']),
sec('toad', 'Testing', ['Give 10 ml to a creature and watch: leaves, flames, ice, floating, hearts and bubbles — measured against the notched post in the cage (one notch = 10), or counted (one = 10).', 'Each creature shows only some properties. Set the Potion ID sliders by what you saw, then bottle.']),
sec('help', 'Keys', ['C V G T J rooms · 1 pour · 2 spoon · 3 pestle · 4 skimmer · L lid · B bottle · F speed · A auto-stir · M mortar · arrows fire · S shop · Esc menu.']),
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
const quality = /** @type {HTMLSelectElement} */ (h('select', { 'aria-label': 'Graphics quality', style: { width: '50%' } }, ...[['auto', 'Automatic'], ['high', 'High quality'], ['medium', 'Balanced'], ['low', 'Battery saver']].map(([q, t]) => h('option', { value: q, text: t }))));
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
h('div', { class: 'small', text: 'The game saves on this device. Export a file to back it up or move it.' }),
h('div', { class: 'row wrap' },
btn('Export save', () => { lab.save(); exportSave(lab.state); }, { icon: 'scroll', act: 'export' }),
btn('Import save', () => fileIn.click(), { icon: 'plus', act: 'import' }),
fileIn)) : h('div', { class: 'card parch' }, h('h3', { text: 'Saves' }), h('div', { class: 'row wrap' }, btn('Import save', () => fileIn.click(), { icon: 'plus', act: 'import' }), fileIn));
modal({
title: 'Settings',
onClose: () => app.saveSettings(),
body: [
h('div', { class: 'card parch' }, h('h3', { text: 'Sound' }), vol('master', 'Master volume'), vol('sfx', 'Effects'), vol('music', 'Music'), check('musicOn', 'Play music', () => audio.music(s.musicOn)), check('muted', 'Mute everything')),
h('div', { class: 'card parch' }, h('h3', { text: 'Display' }), h('div', { class: 'toggle-row' }, h('span', { text: 'Graphics' }), quality),
h('div', { class: 'small muted', text: 'Automatic steps down when frames run slow. The physics and magic are identical in every mode.' }),
check('showFps', 'Show performance stats')),
saveSection,
h('div', { class: 'card parch small' }, 'The Alchemist’s Shop — all art, sound, font and code made for this game. Runs fully offline.'),
],
});
}
function reqChips(reqs, cls = '') {
return h('div', { class: 'req-chips ' + cls }, ...reqs.map((r) => h('span', { class: 'req-chip' + (r.kind === 'limit' ? ' limit' : ''), title: `${PROP_BY_KEY[r.key].label} ${reqText(r)}`, 'data-key': r.key }, icon(PROP_BY_KEY[r.key].icon, 'sm'), h('span', { class: 'tgt', text: reqText(r) }))));
}
return { magicChips, thresholdChips, openShop, openIngredient, openHint, showDaySummary, renderRecipes, renderJournal, openPause, openHelp, openSettings, reqChips };
})();
// src/ui/tutorial.js
const __m50 = (() => {
const { h, btn, clear } = __m2;
const { icon } = __m3;
const { MAX_SPECIES } = __m12;
const { idComplete } = __m19;
class Tutorial {
constructor(lab) {
this.lab = lab;
this.active = false;
this.index = 0;
this.target = null;
this.flags = {};
this.shown = -1;
}
get steps() {
const lab = this.lab;
const st = lab.state;
const R = st.world.roles;
const water = st.lookup(R.water), dew = st.lookup(R.dew);
const volumeOf = (id) => {
const s = lab.sim.species.slotOf.get(id);
if (s === undefined) return 0;
let t = 0;
for (let i = 0; i < lab.sim.p.count; i++) t += lab.sim.p.comp[i * MAX_SPECIES + s];
return t * 5;
};
const act = (a) => () => /** @type {HTMLElement} */ (lab.el.querySelector(`[data-act="${a}"]`));
const tab = (id) => () => lab.tabEls[id] && lab.tabEls[id].b;
const tested = () => st.lab.records.some((r) => r.creature === 'toad' && r.batchId === st.batch.id);
return [
{ icon: 'stall', text: 'A customer needs a healing potion. Let’s make it!', button: 'Start' },
{ icon: 'seedling', text: 'Everything grows in your garden. Open it.', target: tab('garden'), done: () => lab.view === 'garden' },
{ icon: 'well', text: 'Draw water from the well.', target: act('harvest-well'), done: () => this.flags.harvest_water || st.stock(R.water) >= 280 },
{ icon: 'leaf', text: `Harvest the ${dew.name}.`, target: act('harvest-dew-a'), done: () => st.stock(R.dew) > 0 },
{ icon: 'cauldron', text: 'Back to the cauldron.', target: tab('brew'), done: () => lab.view === 'brew' },
{ icon: 'jar', text: `Tap the ${water.name} jar.`, target: () => lab.jarEls[R.water] && lab.jarEls[R.water].el, done: () => lab.selected === R.water || volumeOf(R.water) >= 45 },
{ icon: 'pour', text: 'Pour 50 ml.', target: act('dose-50'), done: () => volumeOf(R.water) >= 45 },
{ icon: 'jar', text: `Now the ${dew.name}: pour 50 ml of it.`, target: () => (lab.selected === R.dew ? lab.el.querySelector('[data-act="dose-50"]') : lab.jarEls[R.dew] && lab.jarEls[R.dew].el), done: () => volumeOf(R.dew) >= 45 && !lab.sim.emitter.pouring },
{ icon: 'spoon', text: 'Stir: pick the spoon and drag it round the brew.', target: () => lab.toolBtns.spoon, done: () => (lab.sim.tool.stirDistance - (this.flags.stir0 ?? (this.flags.stir0 = lab.sim.tool.stirDistance))) > 8 },
{ icon: 'toad', text: 'What does it do? Only a test can tell. Open the testing room.', target: tab('testing'), done: () => lab.view === 'testing' },
{ icon: 'dropper', text: 'Give the Moss Toad a dose and watch it.', target: act('dose-toad'), done: tested },
{ icon: 'leaf', text: 'Each leaf on its back is 10 Vitality. Set the Vitality slider.', target: () => lab.el.querySelector('[data-prop="vitality"]'), done: () => Number.isFinite(st.idCard.values.vitality) },
{ icon: 'scroll', text: 'No hearts or bubbles means 0. Set every slider — that is your Potion ID.', target: () => lab.el.querySelector('.id-panel'), done: () => idComplete(st.idCard) },
{ icon: 'bottle', text: 'Back to the cauldron and Bottle it.', target: () => (lab.view === 'brew' ? lab.bottleFab : lab.tabEls.brew.b), done: () => this.flags.bottled || !!st.vial },
{ icon: 'deal', text: 'Offer it to the customer.', target: act('sell'), done: () => this.flags.haggle || !!(st.current && st.current.haggle) || this.flags.sold },
{ icon: 'coin', text: 'Ask a higher price, or take the offer.', target: () => lab.el.querySelector('.haggle'), done: () => this.flags.sold },
{ icon: 'seal', text: 'Sold! If a potion fails, its buyer comes back for a refund. Some bluff: only an expert’s seal proves you right.', button: 'Finish' },
];
}
start(restart = false) {
if (restart) this.lab.state.tutorial.done = false;
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
const c = this.lab.coach;
if (c) { clear(c); c.classList.add('hidden'); }
if (this.target) this.target.classList.remove('highlight');
this.target = null;
this.shown = -1;
if (this.lab.resize) requestAnimationFrame(() => this.lab.resize());
}
show() {
const steps = this.steps;
const s = steps[this.index];
if (!s) { this.finish(); return; }
const lab = this.lab;
const c = clear(lab.coach);
c.classList.remove('hidden');
c.append(
h('span', { class: 'coach-step', text: `${this.index + 1}/${steps.length}` }),
icon(s.icon || 'bulb'),
h('span', { class: 'coach-text', text: s.text }),
h('span', { class: 'coach-actions' },
s.button ? btn(s.button, () => this.advance(), { cls: 'primary', act: 'tutorial-next' }) : null,
btn('', () => this.finish(), { icon: 'close', cls: 'icon', title: 'Skip the tutorial', act: 'tutorial-skip' })));
this.shown = this.index;
this.attach(s);
requestAnimationFrame(() => lab.resize());
}
attach(s) {
let t = s.target ? s.target() : null;
if (t && !t.offsetParent) {
const view = t.closest && t.closest('[data-view]');
const id = view && view.getAttribute('data-view');
t = id && this.lab.tabEls[id] ? this.lab.tabEls[id].b : null;
}
if (t === this.target) return;
if (this.target) this.target.classList.remove('highlight');
if (t) t.classList.add('highlight');
this.target = t;
}
place() {}
advance() {
this.index++;
this.show();
}
notify(kind, data) {
if (!this.active) return;
if (kind === 'bottle') this.flags.bottled = true;
if (kind === 'sold') this.flags.sold = true;
if (kind === 'haggle') this.flags.haggle = true;
if (kind === 'harvest' && data === this.lab.state.world.roles.water) this.flags.harvest_water = true;
if (kind === 'view' && this.index === this.steps.length - 1 && this.flags.sold) { this.finish(); return; }
if (this.shown === this.index) this.attach(this.steps[this.index]);
}
update() {
if (!this.active) return;
const s = this.steps[this.index];
if (!s) return;
if (s.done && s.done()) this.advance();
else if (Math.random() < 0.08) this.attach(s); // rooms rebuild their controls
}
}
return { Tutorial };
})();
// src/ui/views/counter.js
const __m51 = (() => {
const { h, btn, clear, coins, toast, confirmDialog } = __m2;
const { icon } = __m3;
const { audio } = __m4;
const { drawPortrait } = __m44;
const { drawBottle } = __m40;
const { PROPS, PROP_BY_KEY } = __m13;
const { idComplete } = __m19;
const { mood } = __m21;
const { archetypeOf } = __m15;
const panels = __m49;
class CounterView {
constructor(lab) {
this.lab = lab;
this.el = h('section', { class: 'view view-counter', 'data-view': 'counter' });
this.say = '';
this.ask = 0;
}
build() {
this.refresh();
}
refresh() {
const lab = this.lab, st = lab.state;
const el = clear(this.el);
if (lab.sandbox) {
el.append(h('div', { class: 'card parch' }, icon('flask'), ' Free Experiment'));
return;
}
const c = st.current;
if (!c) {
el.append(h('div', { class: 'card parch counter-empty' },
st.dayOver ? btn('Close for the night', () => lab.endDay(), { cls: 'gold', icon: 'sun', act: 'end-day' })
: btn('Open the door', () => lab.bringCustomer(true), { cls: 'gold', icon: 'door', act: 'next-customer' })));
this.vialCard(el, null);
return;
}
if (c.type === 'complaint') { this.complaintCard(el, c); return; }
const h0 = c.haggle;
const mo = h0 ? (h0.state === 'walked' ? 'unhappy' : mood(h0) > 0.6 ? 'happy' : mood(h0) > 0.25 ? 'neutral' : 'unhappy') : 'neutral';
const portrait = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'portrait big' }));
drawPortrait(portrait, c.customer.portrait, mo);
el.append(h('div', { class: 'card parch customer-card' },
h('div', { class: 'cust-top' }, portrait, h('div', {},
h('div', { class: 'cust-name', text: c.customer.name }),
h('div', { class: 'small muted' }, c.customer.title, c.contract ? h('span', { class: 'tag' }, icon('charter', 'sm')) : null, c.grand ? h('span', { class: 'tag' }, icon('trophy', 'sm')) : null),
h('div', { class: 'speech', text: '“' + c.dialogue + '”' }))),
h('div', { class: 'potion-name' }, c.potionName, h('span', { class: 'muted small', text: ` · ${c.bottleMl} ml` })),
panels.reqChips(c.requirements, 'big'),
h('div', { class: 'row wrap cust-actions' },
btn(c.hintCost ? `${c.hintCost}` : '', () => panels.openHint(lab), { icon: 'bulb', title: 'Guild advice', act: 'hint' }),
c.tutorial ? null : btn('', () => lab.decline(), { icon: 'door', cls: 'icon', title: 'Send away', act: 'decline' }),
h('span', { class: 'spacer' }),
st.vial ? null : btn('Brew', () => lab.showView('brew'), { icon: 'cauldron', cls: 'primary', act: 'go-brew' }))));
this.vialCard(el, c);
}
vialCard(el, com) {
const lab = this.lab, st = lab.state;
const v = st.vial;
if (!v) {
if (com) el.append(h('div', { class: 'card parch steps small' }, icon('cauldron'), ' → ', icon('toad'), ' → ', icon('bottle'), ' → ', icon('deal')));
return;
}
const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: '24', height: '32', class: 'vial-art' }));
drawBottle(cv.getContext('2d'), 2, 3, 20, 29, v.m.color, Math.min(1, v.ml / Math.max(1, com ? com.bottleMl : v.ml)));
const label = v.label || { values: {} };
const match = com ? st.labelMatches(com) : false;
const complete = !!v.label && idComplete(v.label);
const chips = h('div', { class: 'id-chips' }, ...PROPS.map((p) => {
const val = label.values[p.key];
const bad = com && complete && com.requirements.some((r) => r.key === p.key && (val < r.min || val > r.max));
return h('span', { class: 'id-chip' + (bad ? ' bad' : '') + (Number.isFinite(val) ? '' : ' unknown'), title: p.label }, icon(p.icon, 'sm'), h('b', { text: Number.isFinite(val) ? String(val) : '?' }));
}));
const head = h('div', { class: 'row' }, cv, h('div', { class: 'vial-head' },
h('div', { class: 'row' }, h('b', { text: `${Math.round(v.ml)} ml` }), v.certified ? h('span', { class: 'seal', title: 'Certified by an expert' }, icon('seal'), h('span', { class: 'small', text: 'Certified' })) : null,
v.label && v.label.stale && !v.certified ? h('span', { class: 'warn small', title: 'The ID was written before the last ingredients went in' }, icon('warn', 'sm')) : null),
chips));
const card = h('div', { class: 'card parch vial-card' }, head);
if (com && com.type === 'order') {
const h0 = com.haggle;
if (h0 && h0.state !== 'walked') card.append(this.hagglePanel(com, h0));
else {
const sell = btn('Offer', () => this.startSale(com), { cls: 'primary', icon: 'deal', act: 'sell', disabled: v.ml < 5 });
const certify = v.certified ? null : btn(`${st.certifyFee}`, () => this.certify(), { icon: 'seal', title: 'Have an expert alchemist certify it', act: 'certify', disabled: st.coins < st.certifyFee });
const editId = v.certified ? null : btn('', () => { lab.testSource = 'vial'; lab.showView('testing'); }, { icon: 'toad', cls: 'icon', title: 'Test it and write its ID', act: 'test-vial' });
if (complete) card.append(h('div', { class: 'match ' + (match ? 'ok' : 'bad') }, icon(match ? 'check' : 'close', 'sm')));
card.append(h('div', { class: 'row wrap' }, sell, certify, editId, h('span', { class: 'spacer' }), this.vialMenu()));
}
} else {
card.append(h('div', { class: 'row wrap' }, v.certified ? null : btn(`${st.certifyFee}`, () => this.certify(), { icon: 'seal', title: 'Certify', act: 'certify', disabled: st.coins < st.certifyFee }), h('span', { class: 'spacer' }), this.vialMenu()));
}
el.append(card);
}
vialMenu() {
const lab = this.lab;
return h('div', { class: 'row' },
btn('', () => lab.pourBackVial(), { icon: 'pour', cls: 'icon', title: 'Pour back into the cauldron', act: 'pour-back' }),
btn('', async () => { if (await confirmDialog('Empty the vial?', '', 'Empty', 'danger')) lab.discardVial(); }, { icon: 'trash', cls: 'icon danger', title: 'Empty the vial', act: 'discard' }));
}
async certify() {
const lab = this.lab, st = lab.state;
const ok = await confirmDialog('Ask an expert?', `An expert alchemist measures the potion exactly and seals it. Proof against false complaints. ${st.certifyFee} coins.`, 'Certify', 'gold');
if (!ok) return;
const r = st.certifyVial();
if (!r.ok) { toast('Cannot certify', r.reason, 'seal'); audio.play('error'); return; }
audio.play('coin');
for (const e of r.events) lab.announce(e);
lab.refreshHud();
lab.save();
this.refresh();
}
startSale(com) {
const lab = this.lab, st = lab.state;
const v = st.vial;
if (!v.label || !idComplete(v.label)) {
toast('Label it first', 'Test it on the creatures and write its Potion ID.', 'toad');
audio.play('error');
return;
}
if (!st.labelMatches(com)) {
this.say = 'That is not what I need.';
audio.play('fail');
const card = this.el.querySelector('.vial-card');
if (card) card.classList.add('shake');
setTimeout(() => this.refresh(), 450);
toast(com.customer.name.split(' ')[0], 'That is not what I need.', 'close', 2600);
return;
}
const hg = st.beginHaggle();
this.ask = Math.round(hg.offer * 1.6);
this.say = `${coins(hg.offer)}?`;
audio.play('coin');
this.refresh();
if (lab.tutorial) lab.tutorial.notify('haggle');
}
hagglePanel(com, hg) {
const ask = Math.max(1, Math.round(this.ask || hg.offer + 1));
const askEl = h('b', { class: 'ask-val', text: coins(ask) });
const set = (v) => { this.ask = Math.max(1, Math.round(v)); askEl.textContent = coins(this.ask); slider.value = String(this.ask); };
const top = Math.max(hg.offer * 3, ask + 10);
const slider = /** @type {HTMLInputElement} */ (h('input', { type: 'range', min: String(Math.max(1, hg.offer)), max: String(Math.round(top)), value: String(ask), 'aria-label': 'Your price' }));
slider.addEventListener('input', () => set(Number(slider.value)));
const pips = h('span', { class: 'pips', title: 'Patience' }, ...Array.from({ length: hg.patienceMax }, (_, i) => h('i', { class: i < hg.patience ? 'on' : '' })));
const finalNote = hg.state === 'final';
return h('div', { class: 'haggle' },
h('div', { class: 'row offer-row' }, h('span', { class: 'bubble' + (finalNote ? ' final' : '') }, icon('coin', 'sm'), h('b', { text: coins(hg.offer) }), finalNote ? h('span', { class: 'small', text: ' final' }) : null), h('span', { class: 'spacer' }), pips),
h('div', { class: 'row ask-row' },
btn('−5', () => set(this.ask - 5), { cls: 'small', act: 'ask-m5' }), btn('−1', () => set(this.ask - 1), { cls: 'small', act: 'ask-m1' }),
h('span', { class: 'ask-box' }, icon('coin', 'sm'), askEl),
btn('+1', () => set(this.ask + 1), { cls: 'small', act: 'ask-p1' }), btn('+5', () => set(this.ask + 5), { cls: 'small', act: 'ask-p5' })),
slider,
h('div', { class: 'row wrap' },
finalNote ? null : btn('Ask', () => this.doAsk(), { cls: 'gold', icon: 'scales', act: 'ask' }),
btn(`Take ${coins(hg.offer)}`, () => this.doAccept(), { cls: 'primary', icon: 'deal', act: 'take-offer' }),
h('span', { class: 'spacer' }),
btn('', () => this.doRefuse(), { icon: 'close', cls: 'icon danger', title: 'No deal', act: 'refuse' })));
}
doAsk() {
const st = this.lab.state;
const r = st.haggleAsk(this.ask);
if (!r) return;
if (r.result === 'deal') return this.closeSale();
if (r.result === 'walked') { audio.play('fail'); toast(st.current.customer.name.split(' ')[0], 'Too much! Good day.', 'door', 2600); this.walkOut(); return; }
audio.play(r.result === 'final' ? 'error' : 'coin');
this.ask = Math.max(r.offer + 1, Math.round((this.ask + r.offer) / 2 + 1));
this.refresh();
}
doAccept() {
const r = this.lab.state.haggleAccept();
if (r && r.result === 'deal') this.closeSale();
}
doRefuse() {
const st = this.lab.state;
if (st.current && st.current.tutorial) { toast('Not this one', 'Your first customer needs this potion.', 'heart'); return; }
st.haggleRefuse();
this.walkOut();
}
walkOut() {
const lab = this.lab, st = lab.state;
if (st.current && st.current.tutorial) { st.current.haggle = null; this.refresh(); return; }
if (st.current && st.current.haggle && st.current.haggle.state === 'walked') st.declineCustomer();
lab.refreshCustomer();
this.refresh();
lab.save();
setTimeout(() => lab.bringCustomer(true), 900);
}
closeSale() {
const lab = this.lab, st = lab.state;
const com = st.current;
const { sale, events } = st.completeSale();
if (!sale) return;
audio.play('coin');
const arch = archetypeOf(com.customer.archetype);
toast(`+${coins(sale.price)}`, arch.pleased[Math.floor(Math.random() * arch.pleased.length)], 'coin', 3000);
for (const e of events) lab.announce(e);
lab.save();
lab.refreshCustomer();
lab.refreshHud(true);
this.refresh();
if (lab.tutorial) lab.tutorial.notify('sold');
if (!st.dayOver) setTimeout(() => lab.bringCustomer(true), 1300);
}
complaintCard(el, c) {
const lab = this.lab, st = lab.state;
const portrait = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'portrait big' }));
drawPortrait(portrait, c.customer.portrait, 'unhappy');
const p = PROP_BY_KEY[c.complaint.key];
const line = c.complaint.how === 'weak' ? `Your ${c.potionName.toLowerCase()} did nothing!` : c.complaint.how === 'strong' ? 'Far too strong!' : 'It made me ill!';
el.append(h('div', { class: 'card parch customer-card complaint' },
h('div', { class: 'cust-top' }, portrait, h('div', {},
h('div', { class: 'cust-name', text: c.customer.name }),
h('div', { class: 'speech', text: `“${line} I want my money back.”` }))),
h('div', { class: 'row complaint-issue' }, icon(p.icon, 'lg'), icon(c.complaint.how === 'weak' ? 'down' : c.complaint.how === 'strong' ? 'up' : 'warn', 'lg'), h('span', { class: 'spacer' }), icon('refund'), h('b', { class: 'price-big', text: coins(c.price) })),
h('div', { class: 'row wrap' },
btn(`Refund ${coins(c.price)}`, () => this.resolve('refund'), { cls: 'danger', icon: 'refund', act: 'refund' }),
c.certified ? btn('Certificate', () => this.resolve('certificate'), { cls: 'gold', icon: 'seal', act: 'show-certificate' }) : null)));
this.vialCard(el, null);
void st;
}
resolve(how) {
const lab = this.lab, st = lab.state;
const r = st.resolveComplaint(how);
if (!r.ok) { toast('Cannot', r.reason || '', 'close'); return; }
if (r.outcome === 'caught') { audio.play('fanfare'); toast('Caught bluffing!', 'They leave red-faced.', 'seal', 3500); }
else { audio.play('coin'); toast(`−${coins(r.amount)}`, r.outcome === 'proven' ? 'The certificate proves them right.' : 'Refunded.', 'refund', 3000); }
for (const e of r.events || []) lab.announce(e);
lab.save();
lab.refreshHud(true);
lab.refreshCustomer();
this.refresh();
setTimeout(() => lab.bringCustomer(true), 900);
}
}
return { CounterView };
})();
// src/rendering/garden.js
const __m53 = (() => {
const { Rng } = __m6;
const { BEDS } = __m20;
const { drawRaw } = __m45;
const GARDEN_W = 192;
const GARDEN_H = 120;
function R(ctx, x, y, w, h, c) {
ctx.fillStyle = c;
ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
}
function css(rgb, k = 1) {
return `rgb(${Math.round(Math.min(255, rgb[0] * 255 * k))},${Math.round(Math.min(255, rgb[1] * 255 * k))},${Math.round(Math.min(255, rgb[2] * 255 * k))})`;
}
const PLOTS = BEDS.filter((b) => b.kind !== 'well');
function bedRect(id) {
if (id === 'well') return { x: 4, y: 44, w: 32, h: 44 };
const i = PLOTS.findIndex((b) => b.id === id);
const col = i % 5, row = Math.floor(i / 5);
return { x: 42 + col * 30, y: 18 + row * 33, w: 28, h: 31 };
}
function bedAt(x, y) {
for (const b of BEDS) {
const r = bedRect(b.id);
if (x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) return b.id;
}
return null;
}
function paintGarden(ctx, seed) {
const W = GARDEN_W, H = GARDEN_H;
const rng = new Rng('garden:' + seed);
for (let y = 0; y < 14; y++) R(ctx, 0, y, W, 1, css([0.55 + y * 0.01, 0.72 + y * 0.008, 0.92]));
R(ctx, 0, 10, W, 6, '#6d4527');
for (let x = 0; x < W; x += 6) { R(ctx, x, 6, 4, 10, '#a9743f'); R(ctx, x, 6, 4, 1, '#c99a5f'); }
for (let y = 16; y < H; y++) R(ctx, 0, y, W, 1, css([0.33, 0.52, 0.22], 0.92 + ((y * 7) % 5) * 0.02));
for (let i = 0; i < 500; i++) R(ctx, rng.int(0, W - 1), rng.int(16, H - 1), 1, 1, rng.chance(0.5) ? '#4f7a31' : '#6d9a42');
R(ctx, 38, 16, 3, H - 16, '#b8a07a');
for (let i = 0; i < 40; i++) R(ctx, 38 + rng.int(0, 2), rng.int(16, H - 1), 1, 1, '#8a7656');
for (let i = 0; i < 24; i++) {
const x = rng.int(0, 36), y = rng.int(92, H - 2);
R(ctx, x, y, 1, 1, rng.pick(['#ffe58a', '#ff9fc7', '#ffffff', '#c9b7ff']));
}
}
function drawBeds(ctx, status, colorOf, t, locked) {
for (const b of BEDS) {
const r = bedRect(b.id);
const st = status(b.id);
if (b.kind === 'well') { well(ctx, r, st, t); continue; }
if (!st || !st.owned) { emptyPlot(ctx, r, locked(b.id)); continue; }
if (b.kind === 'stone') {
R(ctx, r.x + 1, r.y + r.h - 8, r.w - 2, 7, '#7d7268');
for (let k = 0; k < 8; k++) R(ctx, r.x + 2 + ((k * 7) % (r.w - 4)), r.y + r.h - 7 + (k % 3) * 2, 2, 1, '#9a8f84');
const c = colorOf(b.role);
const g = st.growth;
if (g > 0.03) {
drawRaw(ctx, r.x + 6, r.y + r.h - 20, b.role === 'sunstone' || b.role === 'bloodstone' || b.role === 'blight' ? 'stone' : 'crystal', c, Math.max(0.2, g));
if (g > 0.5) drawRaw(ctx, r.x + 14, r.y + r.h - 19, 'crystal', c, Math.max(0.2, g - 0.4));
}
if (g >= 0.999 && Math.sin(t * 3 + r.x) > 0.8) R(ctx, r.x + 12, r.y + r.h - 18, 1, 1, '#ffffff');
} else {
const moist = st.moist;
R(ctx, r.x + 1, r.y + r.h - 7, r.w - 2, 6, moist ? '#3a2416' : '#8b6a45');
for (let k = 0; k < 6; k++) R(ctx, r.x + 3 + k * 4, r.y + r.h - 5, 2, 1, moist ? '#24160f' : '#a8875c');
plant(ctx, b.role, r, st.growth, colorOf(b.role), t, moist);
}
R(ctx, r.x + 2, r.y + r.h - 1, r.w - 4, 1, '#24160f');
R(ctx, r.x + 2, r.y + r.h - 1, Math.round((r.w - 4) * st.growth), 1, st.ready ? '#9fe06a' : '#c08a2a');
}
}
function emptyPlot(ctx, r, locked) {
R(ctx, r.x + 2, r.y + r.h - 8, r.w - 4, 6, locked ? '#3f5a28' : '#5a7a34');
R(ctx, r.x + r.w / 2 - 1, r.y + r.h - 16, 2, 9, '#6d4527');
R(ctx, r.x + r.w / 2 - 5, r.y + r.h - 20, 10, 6, locked ? '#5a5060' : '#c2a678');
if (locked) { R(ctx, r.x + r.w / 2 - 2, r.y + r.h - 19, 4, 4, '#2b1d14'); R(ctx, r.x + r.w / 2 - 1, r.y + r.h - 18, 2, 1, '#e8b45c'); }
else { R(ctx, r.x + r.w / 2 - 1, r.y + r.h - 19, 2, 4, '#3f6e2a'); R(ctx, r.x + r.w / 2 - 2, r.y + r.h - 18, 4, 2, '#3f6e2a'); }
}
function well(ctx, r, st, t) {
const fill = st ? st.growth : 1;
R(ctx, r.x + 2, r.y + 4, 2, r.h - 20, '#52321d'); R(ctx, r.x + r.w - 4, r.y + 4, 2, r.h - 20, '#52321d');
R(ctx, r.x, r.y, r.w, 5, '#8a1f1a'); R(ctx, r.x + 2, r.y + 1, r.w - 4, 1, '#c04a2a');
R(ctx, r.x + r.w / 2 - 1, r.y + 5, 1, 8, '#2b1d14');
R(ctx, r.x + r.w / 2 - 3, r.y + 13, 6, 4, '#8b5a31');
R(ctx, r.x + 1, r.y + r.h - 16, r.w - 2, 14, '#5d5465');
for (let x = r.x + 1; x < r.x + r.w - 1; x += 5) R(ctx, x, r.y + r.h - 16, 4, 3, '#73697b');
R(ctx, r.x + 4, r.y + r.h - 12, r.w - 8, 8, '#1a1a2a');
const wh = Math.round(7 * fill);
if (wh > 0) R(ctx, r.x + 4, r.y + r.h - 4 - wh, r.w - 8, wh, '#4c86c4');
if (wh > 0 && Math.sin(t * 2) > 0) R(ctx, r.x + 6 + Math.round(Math.sin(t) * 3), r.y + r.h - 4 - wh, 4, 1, '#8fc7f2');
}
function plant(ctx, role, r, g, color, t, moist) {
const base = r.y + r.h - 7;
const h = Math.max(2, Math.round(18 * Math.min(1, g * 1.4)));
const cx = r.x + r.w / 2;
const sway = Math.round(Math.sin(t * 1.6 + r.x) * (moist ? 1 : 0));
const leafC = moist ? '#4f9a31' : '#8a8a3a';
const c = css(color), c2 = css(color, 0.7);
if (role === 'sap') {
R(ctx, cx - 1, base - h, 2, h, '#52321d');
const cw = Math.max(3, Math.round(16 * g));
R(ctx, cx - cw / 2 + sway, base - h - 4, cw, Math.max(2, Math.round(8 * g)), '#c04a2a');
R(ctx, cx - cw / 2 + 1 + sway, base - h - 4, cw - 2, 2, '#ff8a2a');
} else if (role === 'witchoil') {
const bw = Math.max(3, Math.round(18 * g));
R(ctx, cx - bw / 2, base - Math.round(h * 0.7), bw, Math.round(h * 0.7), '#2a4f2a');
R(ctx, cx - bw / 2 + 1, base - Math.round(h * 0.7), bw - 2, 2, '#3f6e3a');
} else {
R(ctx, cx + sway, base - h, 1, h, '#335224');
R(ctx, cx - 4, base - Math.round(h * 0.4), 4, 2, leafC); R(ctx, cx + 1, base - Math.round(h * 0.6), 4, 2, leafC);
if (g > 0.3) { R(ctx, cx - 2 + sway, base - h - 3, 5, 3, c); R(ctx, cx + sway, base - h - 4, 1, 1, '#ffffff'); }
}
const n = g >= 0.2 ? Math.floor(g * 5) : 0;
for (let i = 0; i < n; i++) {
const x = cx - 7 + ((i * 5) % 15), y = base - 4 - ((i * 7) % Math.max(3, h));
R(ctx, x, y, 2, 2, c2); R(ctx, x, y, 1, 1, c);
}
}
return { GARDEN_W, GARDEN_H, bedRect, bedAt, paintGarden, drawBeds };
})();
// src/ui/views/garden.js
const __m52 = (() => {
const { h, btn, clear, toast, coins, confirmDialog } = __m2;
const { icon } = __m3;
const { audio } = __m4;
const { BEDS, BED_BY_ID, WATER_COST, formatWait } = __m20;
const { RANKS } = __m18;
const { paintGarden, drawBeds, bedAt, bedRect, GARDEN_W, GARDEN_H } = __m53;
const { rawSprite } = __m45;
const { drawJar } = __m41;
const { PROPS } = __m13;
class GardenView {
constructor(lab) {
this.lab = lab;
this.el = h('section', { class: 'view view-garden', 'data-view': 'garden' });
this.time = 0;
this.floaters = [];
this.bg = null;
this.bgKey = '';
this.rows = {};
}
build() {
const el = clear(this.el);
this.canvas = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(GARDEN_W), height: String(GARDEN_H), class: 'scene garden-scene', 'aria-label': 'Your garden: tap a bed to harvest it' }));
this.ctx = /** @type {CanvasRenderingContext2D} */ (this.canvas.getContext('2d'));
this.canvas.addEventListener('pointerdown', (e) => this.tapScene(e));
this.list = h('div', { class: 'beds' });
el.append(h('div', { class: 'garden-scene-wrap' }, h('div', { class: 'scene-wrap' }, this.canvas)), h('div', { class: 'garden-list' }, this.list));
this.refresh();
}
status(id) {
const lab = this.lab, st = lab.state;
if (lab.sandbox) return { owned: true, growth: 1, amount: BED_BY_ID[id].cap, cap: BED_BY_ID[id].cap, moist: true, ready: true, fullIn: 0, dryIn: Infinity };
return st.bed(id);
}
refresh() {
const lab = this.lab, st = lab.state;
if (!this.list) return;
const list = clear(this.list);
this.rows = {};
for (const b of BEDS) {
const m = st.lookup(st.world.roles[b.role]);
if (!m) continue;
const s = this.status(b.id);
const owned = !!(s && s.owned);
const locked = !lab.sandbox && !owned && b.rank > st.rank;
const sprite = m.form === 'solid' ? rawSprite(m.shape || 'stone', m.look || m.color, owned ? Math.max(0.3, s.growth) : 0.4) : jarSprite(m);
const barI = h('i');
const meta = h('div', { class: 'meta' });
const plantB = btn(`${b.price}`, () => this.plant(b.id), { icon: 'plus', cls: 'gold', title: `Plant for ${b.price} coins`, act: 'plant-' + b.id });
const waterB = b.kind === 'plant' ? btn(`${WATER_COST}`, () => this.water(b.id), { icon: 'can', title: `Water it (${WATER_COST} ml of well water)`, act: 'water-' + b.id }) : null;
const harvestB = btn('', () => this.harvest(b.id), { icon: b.kind === 'well' ? 'well' : 'satchel', cls: 'primary icon', title: b.kind === 'well' ? 'Draw water' : 'Harvest', act: 'harvest-' + b.id });
const actions = h('div', { class: 'bed-actions' }, plantB, waterB, harvestB);
const fx = h('div', { class: 'bed-fx' }, ...PROPS.filter((p) => (m.magic?.[p.key] || 0) >= 10).map((p) => icon(p.icon, 'sm')));
const row = h('div', { class: 'bed parch' + (owned ? '' : ' unowned') + (locked ? ' locked' : ''), 'data-bed': b.id },
sprite,
h('div', { class: 'bed-info' }, h('div', { class: 'title' }, h('span', { text: m.name }), fx), h('div', { class: 'bar' }, barI), meta),
actions);
this.rows[b.id] = { row, barI, meta, plantB, waterB, harvestB, b, m, sig: '' };
list.appendChild(row);
this.fillRow(b.id);
}
this.paintBg();
}
fillRow(id) {
const lab = this.lab, st = lab.state;
const r = this.rows[id];
if (!r) return;
const { b } = r;
const s = this.status(id);
const owned = !!(s && s.owned);
const locked = !lab.sandbox && !owned && b.rank > st.rank;
r.row.classList.toggle('unowned', !owned);
r.row.classList.toggle('locked', locked);
r.barI.style.width = Math.round((owned ? s.growth : 0) * 100) + '%';
r.barI.classList.toggle('ripe', owned && s.ready);
r.plantB.classList.toggle('hidden', owned || locked);
r.plantB.disabled = st.coins < b.price;
const showWater = owned && b.kind === 'plant' && isFinite(s.dryIn) && !lab.sandbox;
if (r.waterB) {
r.waterB.classList.toggle('hidden', !showWater);
r.waterB.classList.toggle('gold', showWater && !s.moist);
r.waterB.disabled = !showWater || (s.moist && s.dryIn > 18 * 60000) || st.stock(st.world.roles.water) < WATER_COST;
}
r.harvestB.classList.toggle('hidden', !owned);
r.harvestB.disabled = !owned || !s.ready;
let parts;
if (!owned) parts = locked ? [['lock', RANKS[b.rank].name]] : [];
else if (b.kind === 'well') parts = [['drop', String(s.amount)], s.growth < 0.999 ? ['clock', formatWait(s.fullIn)] : null];
else parts = [['jar', String(s.ready ? s.amount : 0)], s.growth >= 0.999 ? ['check', ''] : s.moist ? ['clock', formatWait(s.fullIn)] : ['warn', ''],
b.kind === 'plant' && s.moist && isFinite(s.dryIn) ? ['drop', formatWait(s.dryIn)] : null];
parts = parts.filter(Boolean);
const sig = JSON.stringify(parts);
if (sig === r.sig) return;
r.sig = sig;
clear(r.meta).append(...parts.map(([ic, txt]) => h('span', { class: ic === 'check' ? 'ok' : ic === 'warn' ? 'warn' : ic === 'clock' || ic === 'drop' && b.kind !== 'well' ? 'muted' : '' }, icon(ic, 'sm'), txt ? ` ${txt}` : '')));
}
paintBg() {
const key = this.lab.state.seed;
if (key === this.bgKey) return;
this.bgKey = key;
this.bg = document.createElement('canvas');
this.bg.width = GARDEN_W; this.bg.height = GARDEN_H;
paintGarden(/** @type {CanvasRenderingContext2D} */ (this.bg.getContext('2d')), key);
}
harvest(id) {
const lab = this.lab, st = lab.state;
const b = BED_BY_ID[id];
const m = st.lookup(st.world.roles[b.role]);
const r = lab.sandbox ? { ok: true, amount: b.kind === 'well' ? 150 : b.cap, events: [], reason: '', wait: 0 } : st.harvest(id);
if (!r.ok) {
audio.play('error');
const why = r.reason === 'full' ? 'Your shelves are full.' : r.reason === 'unripe' ? (isFinite(r.wait) ? `Ripe in ${formatWait(r.wait)}.` : 'Too dry to grow — water it.') : r.reason === 'empty' ? 'The well is dry for now.' : '';
toast(m.name, why, 'clock', 2600);
return;
}
audio.play(b.kind === 'well' ? 'pour' : 'select');
const rc = bedRect(id);
this.floaters.push({ x: rc.x + rc.w / 2, y: rc.y + 6, t: 0, text: `+${r.amount}`, color: m.look || m.color });
for (const e of r.events || []) lab.announce(e);
if (lab.tutorial) lab.tutorial.notify('harvest', m.id);
if (!lab.jarEls[m.id]) lab.buildShelf(); else lab.updateShelf();
lab.save();
this.fillRow(id);
if (b.kind === 'well') for (const bb of BEDS) if (bb.kind === 'plant') this.fillRow(bb.id);
lab.updateBadges();
}
water(id) {
const lab = this.lab, st = lab.state;
const r = st.water(id);
if (!r.ok) {
audio.play('error');
toast('Cannot water', r.reason === 'no-water' ? `It takes ${WATER_COST} ml of well water.` : r.reason === 'wet' ? 'It is still moist.' : '', 'can', 2400);
return;
}
audio.play('pour');
lab.updateShelf();
lab.save();
this.fillRow(id);
this.fillRow('well');
}
async plant(id) {
const lab = this.lab, st = lab.state;
const b = BED_BY_ID[id];
const m = st.lookup(st.world.roles[b.role]);
if (!(await confirmDialog(`Plant ${m.name}?`, `${coins(b.price)} coins. It starts from bare soil.`, 'Plant', 'gold'))) return;
const r = st.plant(id);
if (!r.ok) { toast('Cannot plant', r.reason || '', 'lock'); audio.play('error'); return; }
audio.play('purchase');
lab.buildShelf();
lab.refreshHud();
lab.save();
this.refresh();
}
tapScene(e) {
const r = this.canvas.getBoundingClientRect();
const x = ((e.clientX - r.left) / r.width) * GARDEN_W, y = ((e.clientY - r.top) / r.height) * GARDEN_H;
const id = bedAt(x, y);
if (!id) return;
const s = this.status(id);
if (!s || !s.owned) {
const row = this.rows[id];
if (row && row.row.scrollIntoView) row.row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
return;
}
if (BED_BY_ID[id].kind === 'plant' && !s.moist && !s.ready) { this.water(id); return; }
this.harvest(id);
}
frame(dt) {
if (!this.ctx || !this.bg) return;
this.time += dt;
const ctx = this.ctx, lab = this.lab, st = lab.state;
ctx.drawImage(this.bg, 0, 0);
const now = Date.now();
const cache = {};
drawBeds(ctx, (id) => (cache[id] ||= lab.sandbox ? this.status(id) : st.bed(id, now)), (role) => { const m = st.lookup(st.world.roles[role]); return m ? m.look || m.color : [0.5, 0.5, 0.5]; }, this.time,
(id) => !lab.sandbox && BED_BY_ID[id].rank > st.rank);
for (const f of this.floaters) {
f.t += dt;
const a = Math.max(0, 1 - f.t / 1.2);
ctx.globalAlpha = a;
for (let k = 0; k < 4; k++) {
const px = f.x + Math.cos(k * 1.7 + f.t * 3) * f.t * 10, py = f.y - f.t * 14 - k * 2;
ctx.fillStyle = `rgb(${Math.round(f.color[0] * 255)},${Math.round(f.color[1] * 255)},${Math.round(f.color[2] * 255)})`;
ctx.fillRect(Math.round(px), Math.round(py), 2, 2);
}
ctx.fillStyle = '#ffe39a';
ctx.font = '8px "Alchemist Pixel", monospace';
ctx.fillText(f.text, Math.round(f.x - 6), Math.round(f.y - 6 - f.t * 10));
ctx.globalAlpha = 1;
}
this.floaters = this.floaters.filter((f) => f.t < 1.2);
this._acc = (this._acc || 0) + dt;
if (this._acc > 1) { this._acc = 0; for (const id of Object.keys(this.rows)) this.fillRow(id); }
}
}
function jarSprite(m) {
const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: '15', height: '20', class: 'bed-jar' }));
drawJar(cv.getContext('2d'), 1, 0, 13, 20, m.look || m.color, m.form);
return cv;
}
return { GardenView };
})();
// src/rendering/creatures.js
const __m55 = (() => {
const CAGE_W = 64;
const CAGE_H = 72;
const FLOOR = 64;
const TOP = 8;
const SPAN = FLOOR - TOP;
function R(ctx, x, y, w, h, c) {
ctx.fillStyle = c;
ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
}
function levelY(v) {
return FLOOR - (Math.max(0, Math.min(100, v)) / 100) * SPAN;
}
function reactionAmount(t) {
if (t < 0) return 0;
if (t < 1.4) { const u = t / 1.4; return u * u * (3 - 2 * u); }
if (t < 8) return 1;
if (t < 10) { const u = (t - 8) / 2; return 1 - u * u * (3 - 2 * u); }
return 0;
}
function counted(v) {
const n = Math.floor(v / 10);
const rest = (v - n * 10) / 10;
return rest >= 0.25 ? { n: n + 1, last: rest } : { n, last: 1 };
}
function heart(ctx, x, y, s = 1, col = '#ff5aa8') {
if (s < 0.6) { R(ctx, x + 1, y + 1, 2, 2, col); return; }
R(ctx, x, y, 2, 1, col); R(ctx, x + 3, y, 2, 1, col);
R(ctx, x, y + 1, 5, 1, col); R(ctx, x + 1, y + 2, 3, 1, col); R(ctx, x + 2, y + 3, 1, 1, col);
R(ctx, x, y, 1, 1, '#ffc7dd');
}
function leaf(ctx, x, y, s = 1) {
if (s < 0.6) { R(ctx, x + 1, y + 1, 2, 2, '#7dc24a'); return; }
R(ctx, x + 1, y, 2, 1, '#9fe06a'); R(ctx, x, y + 1, 4, 2, '#7dc24a'); R(ctx, x + 1, y + 3, 2, 1, '#3a6e24');
}
function bubble(ctx, x, y, s = 1) {
const r = s < 0.6 ? 1 : 2;
R(ctx, x, y, r + 1, r + 1, '#9fbf2a'); R(ctx, x, y, 1, 1, '#e6f08a');
if (r > 1) R(ctx, x + 1, y + 2, 2, 1, '#5a7a1a');
}
function ember(ctx, x, y, s = 1) {
R(ctx, x, y, s < 0.6 ? 1 : 2, s < 0.6 ? 1 : 2, '#ffb444'); R(ctx, x, y, 1, 1, '#fff0b0');
}
function flake(ctx, x, y, s = 1) {
if (s < 0.6) { R(ctx, x + 1, y + 1, 1, 1, '#dff4ff'); return; }
R(ctx, x + 1, y, 1, 3, '#dff4ff'); R(ctx, x, y + 1, 3, 1, '#dff4ff');
}
function column(ctx, x, yBottom, v, draw, t, wobble = 0.6) {
const c = counted(v);
for (let i = 0; i < c.n; i++) {
const col = i % 2, row = Math.floor(i / 2);
const ox = x + col * 7 + Math.round(Math.sin(t * 2 + i) * wobble);
const oy = yBottom - row * 6;
draw(ctx, ox, oy, i === c.n - 1 ? c.last : 1);
}
}
function cage(ctx, id, t) {
const W = CAGE_W, H = CAGE_H;
const back = id === 'wisp' ? ['#1e2433', '#252c3d'] : id === 'salamander' ? ['#3a2a24', '#45322a'] : ['#3a3024', '#43382a'];
for (let y = 0; y < H; y++) R(ctx, 0, y, W, 1, y % 8 < 4 ? back[0] : back[1]);
for (let x = 2; x < W; x += 12) R(ctx, x, 0, 1, H, 'rgba(0,0,0,0.25)');
if (id === 'sprout') { R(ctx, 18, FLOOR, 28, H - FLOOR, '#7a3c1f'); R(ctx, 16, FLOOR, 32, 2, '#a8582a'); }
else if (id === 'salamander') { R(ctx, 0, FLOOR, W, H - FLOOR, '#4a4252'); R(ctx, 0, FLOOR, W, 1, '#73697b'); }
else { R(ctx, 0, FLOOR, W, H - FLOOR, '#8b5a31'); for (let x = 1; x < W; x += 3) R(ctx, x, FLOOR - 1, 2, 1, '#c2a678'); }
R(ctx, 3, TOP - 2, 2, SPAN + 3, '#6d4527');
R(ctx, 3, TOP - 2, 1, SPAN + 3, '#a9743f');
for (let k = 0; k <= 10; k++) {
const y = Math.round(levelY(k * 10));
R(ctx, 5, y, k % 5 === 0 ? 4 : 2, 1, k % 5 === 0 ? '#ffe39a' : '#c2a678');
}
if (id === 'salamander') {
R(ctx, W - 5, TOP - 2, 2, SPAN + 3, '#4a6a8a');
for (let k = 0; k <= 10; k++) {
const y = Math.round(levelY(k * 10));
R(ctx, W - (k % 5 === 0 ? 9 : 7), y, k % 5 === 0 ? 4 : 2, 1, k % 5 === 0 ? '#dff4ff' : '#8fc7f2');
}
}
void t;
}
function drawCreature(ctx, id, st, t, reaction) {
ctx.clearRect(0, 0, CAGE_W, CAGE_H);
cage(ctx, id, t);
const a = reaction ? reactionAmount(reaction.age) : 0;
const L = (k) => (reaction && reaction.levels[k] ? reaction.levels[k] * a : 0);
if (!st.alive) { dead(ctx, id); return; }
const bob = Math.round(Math.sin(t * 2.2) * 0.8);
const weak = st.health < 35;
switch (id) {
case 'toad': toad(ctx, t, bob, L('vitality'), L('charm'), L('bane'), weak); break;
case 'salamander': salamander(ctx, t, bob, L('ardor'), L('frost'), weak); break;
case 'moth': moth(ctx, t, L('levity'), L('charm'), L('bane'), weak); break;
case 'sprout': sprout(ctx, t, L('vitality'), L('ardor'), L('frost'), L('bane'), weak); break;
case 'wisp': wisp(ctx, t, L('levity'), L('vitality'), L('charm')); break;
}
if (reaction && reaction.age >= 0 && reaction.age < 0.35) {
ctx.fillStyle = `rgba(255,255,255,${0.35 * (1 - reaction.age / 0.35)})`;
ctx.fillRect(0, 0, CAGE_W, CAGE_H);
}
}
function mixHex(a, b, t) {
const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(',')})`;
}
function toad(ctx, t, bob, vit, charm, bane, weak) {
const sick = Math.min(1, bane / 60);
const body = mixHex('#5f9e3a', '#8a8a2a', sick), dark = mixHex('#3a6e24', '#5a4a1a', sick), belly = '#d8d08a';
const cx = 32, by = FLOOR - 1 + bob;
const puff = 1 + Math.min(0.15, vit / 600);
const ell = (x, y, rx, ry, c) => { for (let yy = -ry; yy <= ry; yy++) { const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry)))); R(ctx, x - w, y + yy, w * 2 + 1, 1, c); } };
ell(cx, by - 6, Math.round(11 * puff) + 1, Math.round(6 * puff) + 1, '#1a1218');
ell(cx, by - 6, Math.round(11 * puff), Math.round(6 * puff), body);
ell(cx, by - 3, Math.round(8 * puff), 2, belly);
ell(cx - 6, by - 12, 3, 3, '#1a1218'); ell(cx + 6, by - 12, 3, 3, '#1a1218');
ell(cx - 6, by - 12, 2, 2, '#fff6e0'); ell(cx + 6, by - 12, 2, 2, '#fff6e0');
R(ctx, cx - 6, by - 12 + (weak ? 1 : 0), 1, 1, '#1a1218'); R(ctx, cx + 6, by - 12 + (weak ? 1 : 0), 1, 1, '#1a1218');
R(ctx, cx - 4, by - 7, 8, 1, dark);
R(ctx, cx - 13, by - 1, 4, 2, dark); R(ctx, cx + 9, by - 1, 4, 2, dark);
const c = counted(vit);
for (let i = 0; i < c.n; i++) {
const lx = 26 + (i % 4) * 4.5, ly = by - 22 - Math.floor(i / 4) * 6 + Math.round(Math.sin(t * 2 + i) * 0.5);
leaf(ctx, lx, ly, i === c.n - 1 ? c.last : 1);
if (Math.floor(i / 4) === 0) R(ctx, lx + 1, ly + 4, 1, by - 12 - (ly + 4), '#3a6e24');
}
column(ctx, 12, 40, charm, (g, x, y, s) => heart(g, x, y, s), t);
column(ctx, 44, 40, bane, bubble, t, 1);
}
function salamander(ctx, t, bob, ardor, frost, weak) {
const ice = frost;
const cx = 30, by = FLOOR - 1;
if (ice > 0.5) {
const top = Math.round(levelY(ice));
ctx.fillStyle = 'rgba(170,220,255,0.55)';
ctx.fillRect(14, top, CAGE_W - 22, FLOOR - top);
R(ctx, 14, top, CAGE_W - 22, 1, '#dff4ff');
for (let y = top + 3; y < FLOOR; y += 6) R(ctx, 18 + ((y * 7) % 30), y, 3, 1, '#ffffff');
}
const body = weak ? '#a8582a' : '#e2702a', spots = '#ffd75a', k = '#1a1218';
const sway = Math.round(Math.sin(t * 3) * 1);
R(ctx, cx - 14, by - 4 + bob, 26, 5, k);
R(ctx, cx - 13, by - 3 + bob, 24, 3, body);
R(ctx, cx + 10, by - 6 + bob, 7, 6, k); R(ctx, cx + 11, by - 5 + bob, 5, 4, body); R(ctx, cx + 14, by - 4 + bob, 1, 1, k);
R(ctx, cx - 20 + sway, by - 2 + bob, 8, 2, k); R(ctx, cx - 19 + sway, by - 2 + bob, 6, 1, body);
for (let i = 0; i < 4; i++) R(ctx, cx - 10 + i * 6, by - 3 + bob, 2, 1, spots);
R(ctx, cx - 9, by + 1, 2, 1, k); R(ctx, cx + 5, by + 1, 2, 1, k);
if (ardor > 0.5) {
const top = levelY(ardor);
const base = by - 4 + bob;
for (let y = Math.round(top); y < base; y++) {
const u = (y - top) / Math.max(1, base - top);
const w = Math.max(1, Math.round(2 + u * 7 + Math.sin(t * 12 + y * 0.7) * 1.2));
const col = u < 0.2 ? '#fff0b0' : u < 0.55 ? '#ffb444' : '#ff7a1c';
R(ctx, cx - 2 - w / 2 + Math.sin(t * 9 + y * 0.4) * 1.2, y, w, 1, col);
}
}
}
function moth(ctx, t, lev, charm, bane, weak) {
const y = Math.round(levelY(lev) - 3 + Math.sin(t * 4) * (lev > 2 ? 0.8 : 0));
const x = 30 + Math.round(Math.sin(t * 1.3) * 2);
const flap = Math.sin(t * (lev > 2 ? 14 : 3)) > 0 ? 1 : 0;
const droop = weak || bane > 30 ? 2 : 0;
const wing = bane > 20 ? '#b8b0a0' : '#e8dcff', wing2 = bane > 20 ? '#8a826a' : '#a678ff';
R(ctx, x - 9, y - 4 + droop - flap, 8, 5, '#1a1218'); R(ctx, x - 8, y - 3 + droop - flap, 6, 3, wing); R(ctx, x - 7, y - 2 + droop - flap, 2, 1, wing2);
R(ctx, x + 2, y - 4 + droop - flap, 8, 5, '#1a1218'); R(ctx, x + 3, y - 3 + droop - flap, 6, 3, wing); R(ctx, x + 6, y - 2 + droop - flap, 2, 1, wing2);
R(ctx, x - 1, y - 4, 3, 7, '#1a1218'); R(ctx, x, y - 3, 1, 5, '#c2a678');
R(ctx, x - 2, y - 7, 1, 3, '#1a1218'); R(ctx, x + 2, y - 7, 1, 3, '#1a1218');
column(ctx, 48, 52, charm, (g, xx, yy, s) => heart(g, xx, yy, s), t);
const c = counted(bane);
for (let i = 0; i < c.n; i++) {
const fy = y + 3 + ((t * 9 + i * 7) % Math.max(4, FLOOR - y - 3));
R(ctx, x - 6 + (i * 5) % 14, fy, i === c.n - 1 && c.last < 0.6 ? 1 : 2, 1, '#9fbf2a');
}
}
function sprout(ctx, t, vit, ardor, frost, bane, weak) {
const h = Math.max(8, FLOOR - levelY(Math.max(10, vit)));
const top = FLOOR - h;
const sway = Math.round(Math.sin(t * 1.5) * 1);
const wilt = Math.min(1, bane / 50) * 0.6 + (weak ? 0.3 : 0);
const leafC = mixHex('#5fae3a', '#b8a83a', wilt), stem = '#335224';
R(ctx, 31 + sway, top, 2, h, stem);
const n = Math.max(1, Math.floor(h / 7));
for (let i = 0; i < n; i++) {
const ly = top + 3 + i * 7, side = i % 2 ? 1 : -1;
const dx = side < 0 ? -6 : 3;
R(ctx, 32 + sway + dx, ly + (wilt > 0.4 ? 1 : 0), 5, 2, leafC);
}
R(ctx, 29 + sway, top - 3, 6, 3, '#9fe06a');
R(ctx, 28, FLOOR + 2, 8, 4, '#c8a06a'); R(ctx, 30, FLOOR + 3, 1, 1, '#1a1218'); R(ctx, 33, FLOOR + 3, 1, 1, '#1a1218');
column(ctx, 11, 54, ardor, ember, t, 0.8);
column(ctx, 42, 54, frost, flake, t, 0.4);
column(ctx, 52, 30, bane, bubble, t, 0.8);
}
function wisp(ctx, t, lev, vit, charm) {
const y = Math.round(levelY(Math.max(8, lev)) + Math.sin(t * 2.5) * 1);
const x = 32 + Math.round(Math.sin(t * 1.1) * 3);
const r = 3 + Math.round(vit / 12);
ctx.fillStyle = `rgba(180,255,160,${0.12 + Math.min(0.4, vit / 150)})`;
ctx.fillRect(x - r, y - r, r * 2, r * 2);
const pulse = 0.7 + 0.3 * Math.sin(t * 3);
R(ctx, x - 3, y - 3, 6, 6, `rgba(143,224,255,${pulse})`);
R(ctx, x - 1, y - 1, 3, 3, '#ffffff');
column(ctx, 48, 52, charm, (g, xx, yy, s) => heart(g, xx, yy, s), t);
}
function dead(ctx, id) {
const g = '#6a6272', k = '#1a1218';
if (id === 'sprout') { R(ctx, 31, FLOOR - 10, 2, 10, '#5a4330'); R(ctx, 26, FLOOR - 6, 6, 1, '#5a4330'); return; }
if (id === 'wisp') { R(ctx, 30, FLOOR - 4, 4, 2, '#3a3341'); return; }
if (id === 'moth') { R(ctx, 24, FLOOR - 2, 14, 2, g); R(ctx, 30, FLOOR - 3, 2, 1, k); return; }
R(ctx, 18, FLOOR - 6, 26, 6, g); R(ctx, 20, FLOOR - 5, 1, 1, k); R(ctx, 24, FLOOR - 5, 1, 1, k);
}
return { CAGE_W, CAGE_H, levelY, reactionAmount, drawCreature };
})();
// src/ui/views/testing.js
const __m54 = (() => {
const { h, btn, clear, toast } = __m2;
const { icon } = __m3;
const { audio } = __m4;
const { CREATURES, CREATURE_BY_ID, DOSE_ML, healthNow, lastTrialOf } = __m19;
const { PROPS } = __m13;
const { drawCreature, CAGE_W, CAGE_H } = __m55;
class TestingView {
constructor(lab) {
this.lab = lab;
this.el = h('section', { class: 'view view-testing', 'data-view': 'testing' });
this.cards = {};
this.react = {};
this.time = 0;
this.drag = null;
}
get source() {
const lab = this.lab;
return lab.testSource === 'vial' && lab.state.vial ? 'vial' : 'cauldron';
}
available() {
const lab = this.lab;
if (this.source === 'vial') return lab.state.vial ? lab.state.vial.ml : 0;
return lab.tapAvailable();
}
build() {
const lab = this.lab, st = lab.state;
const el = clear(this.el);
this.head = h('div', { class: 'test-head' });
this.dropper = h('div', { class: 'dropper', role: 'button', tabindex: '0', 'aria-label': 'Dropper: drag it onto a creature' }, icon('dropper', 'lg'), h('span', { class: 'small', text: `${DOSE_ML} ml` }));
this.bindDropper();
const grid = h('div', { class: 'creatures' });
this.cards = {};
for (const c of CREATURES) {
if (!lab.sandbox && !st.creatureAvailable(c.id)) {
grid.appendChild(h('div', { class: 'creature locked parch' }, icon('lock'), icon(c.id === 'wisp' ? 'wisp' : 'help')));
continue;
}
const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(CAGE_W), height: String(CAGE_H), class: 'cage', 'aria-hidden': 'true' }));
const hp = h('i');
const doseB = btn('', () => this.test(c.id), { cls: 'primary', icon: 'dropper', title: `Give ${DOSE_ML} ml`, act: 'dose-' + c.id });
const replayB = btn('', () => this.replay(c.id), { icon: 'replay', cls: 'icon', title: 'Watch the last reaction again', act: 'replay-' + c.id });
const replaceB = btn('', () => this.replace(c.id), { icon: 'plus', cls: 'gold', title: 'Replace', act: 'replace-' + c.id });
const shows = h('div', { class: 'shows', title: 'Shows' }, ...c.shows.map((k) => icon(PROPS.find((p) => p.key === k).icon, 'sm')));
const card = h('div', { class: 'creature parch', 'data-creature': c.id },
cv,
h('div', { class: 'creature-name' }, h('span', { text: c.name }), shows),
h('div', { class: 'bar hp' }, hp),
h('div', { class: 'creature-actions' }, doseB, replayB, replaceB));
this.cards[c.id] = { card, cv, ctx: cv.getContext('2d'), hp, doseB, replayB, replaceB };
grid.appendChild(card);
}
this.idPanel = h('div', { class: 'id-panel parch' });
el.append(this.head, grid, this.idPanel);
this.refresh();
}
refresh() {
const lab = this.lab, st = lab.state;
if (!this.head) return;
const head = clear(this.head);
const src = this.source;
head.append(h('div', { class: 'seg', role: 'radiogroup', 'aria-label': 'Draw the dose from' },
btn(`${Math.round(lab.tapAvailable())}`, () => { lab.testSource = 'cauldron'; this.refresh(); }, { icon: 'cauldron', cls: src === 'cauldron' ? 'active' : '', title: 'From the cauldron tap', act: 'src-cauldron' }),
st.vial ? btn(`${Math.round(st.vial.ml)}`, () => { lab.testSource = 'vial'; this.refresh(); }, { icon: 'bottle', cls: src === 'vial' ? 'active' : '', title: 'From the sealed vial', act: 'src-vial' }) : null),
h('span', { class: 'spacer' }), this.dropper);
const avail = this.available();
const now = Date.now();
for (const [id, c] of Object.entries(this.cards)) {
const s = st.lab.creatures[id];
const hpNow = healthNow(s, now);
c.hp.style.width = Math.round(hpNow) + '%';
c.hp.style.background = hpNow > 60 ? '#7dc24a' : hpNow > 25 ? '#f0b84a' : '#e0402c';
c.card.classList.toggle('spent', !s.alive);
c.doseB.disabled = !s.alive || avail < DOSE_ML / 2;
c.doseB.classList.toggle('hidden', !s.alive);
c.replayB.disabled = !lastTrialOf(st.lab, id);
const cost = lab.sandbox ? 0 : Math.ceil(CREATURE_BY_ID[id].cost * (st.has('kennel') ? 0.5 : 1));
c.replaceB.classList.toggle('hidden', s.alive);
const rl = c.replaceB.querySelector('.lbl');
if (rl) rl.textContent = String(cost);
else c.replaceB.appendChild(h('span', { class: 'lbl', text: String(cost) }));
}
this.renderId();
}
idTarget() {
const st = this.lab.state;
if (this.source === 'vial' && st.vial) return { kind: /** @type {'vial'} */ ('vial'), values: st.vial.label ? st.vial.label.values : {}, certified: !!st.vial.certified };
return { kind: /** @type {'batch'} */ ('batch'), values: st.idCard.batchId === st.batch.id ? st.idCard.values : {}, certified: false, stale: st.idStale && st.idCard.batchId === st.batch.id };
}
renderId() {
const lab = this.lab, st = lab.state;
const el = clear(this.idPanel);
const tgt = this.idTarget();
el.append(h('div', { class: 'row id-title' }, icon('scroll'), h('b', { text: 'Potion ID' }), icon(tgt.kind === 'vial' ? 'bottle' : 'cauldron', 'sm'),
tgt.certified ? h('span', { class: 'seal' }, icon('seal', 'sm')) : null,
tgt.stale ? h('span', { class: 'warn', title: 'Ingredients were added after this ID was written' }, icon('warn', 'sm')) : null,
h('span', { class: 'spacer' }),
tgt.certified ? null : btn('', () => this.clearId(), { icon: 'trash', cls: 'icon', title: 'Clear the ID', act: 'id-clear' })));
const rows = h('div', { class: 'id-rows' });
for (const p of PROPS) {
const v = tgt.values[p.key];
const known = Number.isFinite(v);
const out = h('b', { class: 'id-val', text: known ? String(v) : '?' });
const inp = /** @type {HTMLInputElement} */ (h('input', { type: 'range', min: '0', max: '100', step: '1', value: String(known ? v : 0), 'aria-label': p.label, 'data-prop': p.key, class: known ? '' : 'unset' }));
inp.disabled = tgt.certified;
inp.style.setProperty('--c', `rgb(${p.color.map((x) => Math.round(x * 255)).join(',')})`);
inp.addEventListener('input', () => { out.textContent = inp.value; inp.classList.remove('unset'); });
inp.addEventListener('change', () => this.setValue(p.key, Number(inp.value)));
rows.append(h('div', { class: 'id-row', title: p.label }, icon(p.icon), inp, out));
}
el.append(rows);
void st;
}
setValue(key, v) {
const lab = this.lab, st = lab.state;
const tgt = this.idTarget();
if (tgt.certified) return;
const values = { ...Object.fromEntries(PROPS.map((p) => [p.key, null])), ...tgt.values, [key]: v };
st.writeId(tgt.kind, values);
lab.save();
lab.views.counter.refresh();
if (lab.tutorial) lab.tutorial.notify('id', key);
this.renderId();
}
clearId() {
const lab = this.lab, st = lab.state;
const tgt = this.idTarget();
st.writeId(tgt.kind, Object.fromEntries(PROPS.map((p) => [p.key, null])));
lab.save();
this.renderId();
}
test(id) {
const lab = this.lab, st = lab.state;
const s = st.lab.creatures[id];
if (!s || !s.alive) return;
let dose, ml, ctx;
try {
if (this.source === 'vial') {
const r = lab.vialDose(DOSE_ML);
if (!r) { toast('The vial is empty', '', 'bottle'); return; }
({ dose, ml } = r);
ctx = { ml, source: 'vial', batchId: r.batchId, rev: r.rev };
} else {
const r = lab.drawDose(DOSE_ML);
if (!r) { toast('Nothing to test', 'Brew something first.', 'cauldron'); return; }
({ dose, ml } = r);
ctx = { ml, source: 'cauldron', batchId: st.batch.id, rev: st.batch.rev };
}
const { record, events } = st.recordTrial(id, dose, ctx);
this.react[id] = { levels: record.levels, start: this.time };
audio.play(record.died ? 'fail' : 'discover');
for (const e of events) lab.announce(e);
if (lab.tutorial) lab.tutorial.notify('trial', id);
lab.save();
} catch (e) {
toast('Cannot', String(e && e.message), 'close');
}
this.refresh();
lab.views.counter.refresh();
}
replay(id) {
const r = lastTrialOf(this.lab.state.lab, id);
if (!r) return;
this.react[id] = { levels: r.levels, start: this.time };
audio.play('select');
}
replace(id) {
const lab = this.lab;
const r = lab.state.replaceCreature(id, lab.sandbox);
if (!r.ok) { toast('Cannot replace', r.reason, 'coin'); audio.play('error'); return; }
audio.play(r.cost ? 'coin' : 'click');
delete this.react[id];
lab.refreshHud();
lab.save();
this.refresh();
}
bindDropper() {
const d = this.dropper;
let ghost = null;
const target = (x, y) => {
const el = document.elementFromPoint(x, y);
const card = el && /** @type {HTMLElement} */ (el).closest ? /** @type {HTMLElement} */ (el).closest('[data-creature]') : null;
return card ? card.getAttribute('data-creature') : null;
};
d.addEventListener('pointerdown', (e) => {
e.preventDefault();
d.setPointerCapture(e.pointerId);
ghost = h('div', { class: 'drag-ghost' }, icon('dropper', 'lg'));
document.body.appendChild(ghost);
this.drag = { id: e.pointerId };
move(e);
});
const move = (e) => {
if (!this.drag || !ghost) return;
ghost.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 34}px)`;
const id = target(e.clientX, e.clientY);
for (const [k, c] of Object.entries(this.cards)) c.card.classList.toggle('drop-hover', k === id);
};
const end = (e) => {
if (!this.drag) return;
this.drag = null;
if (ghost) ghost.remove();
ghost = null;
for (const c of Object.values(this.cards)) c.card.classList.remove('drop-hover');
const id = target(e.clientX, e.clientY);
if (id) this.test(id);
};
d.addEventListener('pointermove', move);
d.addEventListener('pointerup', end);
d.addEventListener('pointercancel', () => { this.drag = null; if (ghost) ghost.remove(); ghost = null; });
}
frame(dt) {
this.time += dt;
const st = this.lab.state;
const now = Date.now();
for (const [id, c] of Object.entries(this.cards)) {
const r = this.react[id];
const s = st.lab.creatures[id];
drawCreature(c.ctx, id, { alive: s.alive, health: healthNow(s, now) }, this.time, r ? { levels: r.levels, age: this.time - r.start } : null);
if (r && this.time - r.start > 11) delete this.react[id];
}
this._acc = (this._acc || 0) + dt;
if (this._acc > 2) { this._acc = 0; this.refreshHealth(); }
}
refreshHealth() {
const st = this.lab.state, now = Date.now();
for (const [id, c] of Object.entries(this.cards)) {
const hpNow = healthNow(st.lab.creatures[id], now);
c.hp.style.width = Math.round(hpNow) + '%';
}
}
}
return { TestingView };
})();
// src/ui/views/book.js
const __m56 = (() => {
const { h, btn, clear, coins } = __m2;
const { icon } = __m3;
const { audio } = __m4;
const panels = __m49;
const { PROPS, PROP_BY_KEY } = __m13;
const { rgbToHex } = __m8;
const TABS = [
['recipes', 'Recipes', 'book'], ['ingredients', 'Ingredients', 'leaf'], ['journal', 'Journal', 'scroll'],
['achievements', 'Awards', 'trophy'], ['sales', 'Sales', 'coin'],
];
class BookView {
constructor(lab) {
this.lab = lab;
this.el = h('section', { class: 'view view-book', 'data-view': 'book' });
this.tab = 'recipes';
}
build() {
const el = clear(this.el);
this.tabs = h('div', { class: 'book-tabs', role: 'tablist' });
this.body = h('div', { class: 'book-body' });
el.append(this.tabs, this.body);
this.refresh();
}
open(t) {
this.tab = t;
this.refresh();
}
refresh() {
if (!this.tabs) return;
const tabs = clear(this.tabs);
for (const [k, label, ic] of TABS) {
if (this.lab.sandbox && (k === 'sales' || k === 'achievements')) continue;
tabs.appendChild(btn(label, () => { this.tab = k; audio.play('page'); this.refresh(); }, { icon: ic, cls: this.tab === k ? 'active' : '', act: 'book-' + k }));
}
const body = clear(this.body);
const lab = this.lab;
switch (this.tab) {
case 'recipes': panels.renderRecipes(lab, body); break;
case 'ingredients': this.renderIngredients(body); break;
case 'sales': this.renderSales(body); break;
default: panels.renderJournal(lab, body, this.tab);
}
}
renderIngredients(body) {
const lab = this.lab, st = lab.state;
const avail = st.availableSet();
const list = h('div', { class: 'list' });
for (const id of st.world.ingredients) {
const m = st.lookup(id);
const seen = lab.sandbox || avail.has(id);
list.appendChild(h('div', { class: 'item parch' + (seen ? '' : ' locked') },
h('span', { class: 'swatch big', style: { background: rgbToHex(m.look || m.color) } }),
h('div', {},
h('div', { class: 'title', text: m.name }),
h('div', { class: 'meta' }, ...panels.magicChips(m.magic)),
h('div', { class: 'meta' }, ...panels.thresholdChips(m))),
btn('', () => panels.openIngredient(lab, id), { icon: 'eye', cls: 'icon', title: 'Its magic', act: 'inspect-' + id })));
}
body.appendChild(list);
}
renderSales(body) {
const st = this.lab.state;
body.appendChild(h('div', { class: 'row small ledger-sum' },
icon('coin', 'sm'), ` ${coins(st.stats.earned)}`, h('span', { class: 'spacer' }),
icon('refund', 'sm'), ` ${coins(st.stats.refunded)}`, h('span', { class: 'spacer' }),
icon('seal', 'sm'), ` ${st.stats.certified}`, h('span', { class: 'spacer' }),
icon('deal', 'sm'), ` ${st.stats.served}`));
if (!st.sales.length) { body.appendChild(h('div', { class: 'card parch small muted', text: '—' })); return; }
for (const s of st.sales.slice(0, 40)) {
const outcome = s.resolved === 'refunded' ? icon('refund') : s.resolved === 'caught' ? icon('seal') : s.complaint ? icon('clock') : icon('check');
body.appendChild(h('div', { class: 'item parch' },
h('span', { class: 'swatch big', style: { background: rgbToHex(s.color || [0.5, 0.5, 0.5]) } }),
h('div', {},
h('div', { class: 'title', text: s.potion }),
h('div', { class: 'meta', text: `${s.customer.name} · day ${s.day}` }),
h('div', { class: 'meta' }, ...s.requirements.map((r) => h('span', { class: 'fx-chip' }, icon(PROP_BY_KEY[r.key].icon, 'sm'), r.kind === 'limit' ? `≤${r.max}` : r.max >= 100 ? `≥${r.min}` : `${r.min}–${r.max}`))),
s.certified ? h('div', { class: 'meta' }, icon('seal', 'sm'), ...PROPS.map((p) => h('span', { class: 'fx-chip dim' }, icon(p.icon, 'sm'), ` ${s.certified[p.key]}`))) : null),
h('span', { class: 'sale-side' }, h('b', { text: coins(s.price) }), outcome)));
}
}
}
return { BookView };
})();
// src/ui/lab.js
const __m24 = (() => {
const { Simulation } = __m25;
const { PHASE, SIM } = __m16;
const { snapshotSim, applySnapshot } = __m39;
const { clampToInterior } = __m35;
const { MAX_SPECIES } = __m12;
const { compatFactorT } = __m17;
const { Renderer } = __m40;
const { drawPortrait } = __m44;
const { drawJar } = __m41;
const { rawSprite } = __m45;
const { measureParticles, tapSelection } = __m46;
const { processEvent } = __m47;
const { saveGame, saveJSON, KEYS } = __m23;
const { AutoBrewer } = __m48;
const { RANKS } = __m18;
const { PROP_BY_KEY } = __m13;
const { rgbToHex } = __m8;
const { h, btn, clear, toast, coins, confirmDialog, setNoticeHost } = __m2;
const { icon, iconUrl } = __m3;
const { audio } = __m4;
const panels = __m49;
const { Tutorial } = __m50;
const { CounterView } = __m51;
const { GardenView } = __m52;
const { TestingView } = __m54;
const { BookView } = __m56;
const TOOL_DEFS = [
{ id: 'spoon', label: 'Spoon', icon: 'spoon', key: '2' },
{ id: 'pestle', label: 'Pestle', icon: 'pestle', key: '3', needs: 'pestle' },
{ id: 'skimmer', label: 'Skim', icon: 'ladle', key: '4', needs: 'skimmer' },
{ id: 'pour', label: 'Pour', icon: 'pour', key: '1' },
];
const VIEWS = [
{ id: 'counter', label: 'Counter', icon: 'stall', key: 'c' },
{ id: 'brew', label: 'Brew', icon: 'cauldron', key: 'v' },
{ id: 'garden', label: 'Garden', icon: 'seedling', key: 'g' },
{ id: 'testing', label: 'Testing', icon: 'toad', key: 't' },
{ id: 'book', label: 'Book', icon: 'book', key: 'j' },
];
class LabScreen {
constructor(app, state, opts = {}) {
this.app = app;
this.state = state;
this.sandbox = !!opts.sandbox;
this.tool = 'spoon';
this.selected = null;
this.ground = false;
this.speed = 1;
this.pointer = { down: false, x: 0, y: 0, id: -1, wx: 0, wy: 0 };
this.pourX = 0.3;
this.lastPoured = {};
this.bottling = null;
this.thermal = false;
this.autoStir = false;
this.autoBrewer = null;
this.time = 0;
this.hudTimer = 0;
this.tapTimer = 0;
this.saveTimer = 0;
this.mixTimer = 0;
this.tapMl = 0;
this.running = false;
this.fpsAcc = { t: 0, n: 0, fps: 0 };
this.perf = { intervals: new Float32Array(600), work: new Float32Array(600), n: 0, physMs: 0, renderMs: 0 };
this.stirLevel = 0;
this.lastBoil = 0;
this._raf = 0;
this.view = 'brew';
this.testSource = 'cauldron';
this.awayWarned = 0;
}
mount(root) {
this.root = root;
const st = this.state;
const cap = st.cap;
this.cap = cap;
this.sim = this.makeSim(cap.size);
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
this.selectTool('spoon', true);
if (!this.sandbox) {
if (!st.current && !st.dayOver) this.bringCustomer(false);
this.tutorial = new Tutorial(this);
if (st.tutorial.active && !st.tutorial.done) this.tutorial.start();
}
this.showView(this.sandbox ? 'brew' : st.vial || (st.current && st.current.type === 'complaint') ? 'counter' : 'brew', true);
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
else this.lastT = performance.now();
};
document.addEventListener('visibilitychange', this.onVis);
this.onUnload = () => this.save();
window.addEventListener('pagehide', this.onUnload);
this.saveBlocked = false;
this.onStorage = (/** @type {StorageEvent} */ e) => {
if (this.sandbox || e.key !== KEYS.save || this.saveBlocked) return;
this.saveBlocked = true;
this.app.showMenu();
toast('Shop opened elsewhere', 'Saved from another tab. Press Continue to carry on here.', 'scroll', 7000);
};
window.addEventListener('storage', this.onStorage);
audio.music(this.app.settings.music > 0 && this.app.settings.musicOn);
}
makeSim(size) {
const st = this.state;
return new Simulation({ size, lookup: st.lookup, reactions: st.world.reactions });
}
unmount() {
this.save();
this.running = false;
cancelAnimationFrame(this._raf);
window.removeEventListener('resize', this.onResize);
window.removeEventListener('keydown', this.onKey);
document.removeEventListener('visibilitychange', this.onVis);
window.removeEventListener('pagehide', this.onUnload);
window.removeEventListener('storage', this.onStorage);
if (this.resizeObs) this.resizeObs.disconnect();
if (this.tutorial) this.tutorial.stop();
audio.update({ fire: 0, stir: 0, pour: 0, boil: 0, cold: 0 }, 0);
setNoticeHost(null);
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
const sim = this.makeSim(cap.size);
applySnapshot(sim, snap, { lookup: this.state.lookup });
this.sim = sim;
toast('New cauldron installed', '', 'cauldron');
}
this.cap = cap;
this._applyFurnaceCaps();
this.buildTools();
this.buildShelf();
this.resize(true);
this.refreshHud(true);
for (const v of Object.values(this.views)) v.build();
}
buildDom() {
this.el = h('div', { class: 'screen lab', 'data-mode': this.sandbox ? 'sandbox' : 'game', 'data-view': 'brew' });
this.coinEl = h('span', { class: 'coins-val' });
this.rankName = h('div', { class: 'rankname' });
this.rankBar = h('i');
this.dayEl = h('div', { class: 'day' });
this.topbar = h('header', { class: 'topbar frame' },
btn('', () => panels.openPause(this), { icon: 'menu', cls: 'icon', title: 'Menu (Esc)', act: 'menu' }),
this.sandbox
? h('div', { class: 'stat' }, icon('flask'), h('span', { text: 'Free Experiment' }))
: h('div', { class: 'stat', title: 'Coins' }, icon('coin'), this.coinEl),
this.sandbox ? null : h('div', { class: 'rankrow' }, icon('star', 'rank-ico'), h('div', { class: 'stat rankbox' }, this.rankName, h('div', { class: 'bar' }, this.rankBar))),
this.sandbox ? null : this.dayEl,
this.notice = h('div', { class: 'notice', role: 'status', 'aria-live': 'polite' }),
this.sandbox ? null : btn('', () => panels.openShop(this), { icon: 'bag', cls: 'icon', title: 'Guild shop (S)', act: 'shop' }),
);
setNoticeHost(this.notice);
this.coach = h('div', { class: 'coach hidden', role: 'note', 'aria-live': 'polite' });
this.strip = h('div', { class: 'order-strip parch', role: 'button', tabindex: '0', 'aria-label': 'The request: open the counter' });
this.strip.addEventListener('click', (e) => { if (!(/** @type {HTMLElement} */ (e.target)).closest('.btn')) this.showView('counter'); });
this.canvas = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'view-canvas', 'aria-label': 'Cauldron: drag to stir, hold to pour the selected ingredient' }));
this.chips = h('div', { class: 'hud-chips' });
this.bottleFab = btn('Bottle', () => this.startBottling(), { icon: 'bottle', cls: 'fab primary', title: 'Bottle the potion (B)', act: 'bottle' });
this.infoFab = btn('', () => this.toggleBrewInfo(), { icon: 'scroll', cls: 'fab-mini icon', title: 'What is in the cauldron', act: 'brew-info' });
this.brewPanel = h('div', { class: 'brew-panel parch hidden' });
this.stageEl = h('main', { class: 'stage' }, this.canvas, this.chips, this.brewPanel, this.infoFab, this.sandbox ? null : this.bottleFab);
this.furnaceInput = /** @type {HTMLInputElement} */ (h('input', { type: 'range', min: '-100', max: '100', step: '1', value: '0', 'aria-label': 'Fire and frost control' }));
this.furnaceInput.addEventListener('input', () => {
const v = Number(this.furnaceInput.value) / 100;
this.setFurnace(Math.abs(v) < 0.06 ? 0 : v);
});
this.furnaceLabel = h('span', { class: 'flabel' });
this.furnaceIcon = icon('flame');
this.lidBtn = btn('', () => this.toggleLid(), { icon: 'lid', cls: 'icon', title: 'Lid on/off (L)', act: 'lid' });
this.controls = h('section', { class: 'controls frame' },
this.lidBtn,
h('div', { class: 'furnace' }, this.furnaceIcon, this.furnaceInput, this.furnaceLabel),
);
this.toolsEl = h('div', { class: 'tools', role: 'toolbar', 'aria-label': 'Tools' });
this.toolbar = h('nav', { class: 'toolbar frame' }, this.toolsEl);
this.shelfEl = h('div', { class: 'shelf', role: 'listbox', 'aria-label': 'Ingredient shelf' });
this.doseEl = h('div', { class: 'dose' });
this.shelfWrap = h('div', { class: 'shelf-wrap frame' }, this.doseEl, this.shelfEl);
this.brewView = h('section', { class: 'view view-brew', 'data-view': 'brew' },
this.sandbox ? null : this.strip, this.stageEl, this.controls, this.toolbar, this.shelfWrap);
this.views = { counter: new CounterView(this), garden: new GardenView(this), testing: new TestingView(this), book: new BookView(this) };
this.viewsEl = h('div', { class: 'views' }, this.views.counter.el, this.brewView, this.views.garden.el, this.views.testing.el, this.views.book.el);
this.tabEls = {};
this.tabbar = h('nav', { class: 'tabbar frame', 'aria-label': 'Rooms' });
for (const v of VIEWS) {
if (this.sandbox && v.id === 'counter') continue;
const badge = h('span', { class: 'badge hidden' });
const b = h('button', { class: 'tab', 'data-act': 'tab-' + v.id, 'aria-label': v.label, title: `${v.label} (${v.key.toUpperCase()})` }, icon(v.icon), h('span', { class: 'tab-lbl', text: v.label }), badge);
b.addEventListener('click', () => { audio.play('select'); this.showView(v.id); });
this.tabEls[v.id] = { b, badge };
this.tabbar.appendChild(b);
}
this.el.append(this.topbar, this.coach, this.viewsEl, this.tabbar);
this.root.appendChild(this.el);
this.buildTools();
this.buildShelf();
this.buildDose();
for (const v of Object.values(this.views)) v.build();
}
showView(id, silent = false) {
if (this.sandbox && id === 'counter') id = 'brew';
this.view = id;
this.el.setAttribute('data-view', id);
for (const [k, t] of Object.entries(this.tabEls)) {
t.b.classList.toggle('active', k === id);
t.b.setAttribute('aria-current', k === id ? 'page' : 'false');
}
if (id !== 'brew') {
if (this.sim.emitter.pouring && !(this.sim.emitter.active && this.sim.emitter.active.dose)) this.sim.emitter.stop();
this.pointer.down = false;
const t = this.sim.tool;
if (t.active && !t.auto) t.setTarget(t.x, t.y, false);
}
const v = this.views[id];
if (v) v.refresh();
if (id === 'brew') requestAnimationFrame(() => this.resize());
if (!silent) this.updateBadges();
if (this.tutorial) this.tutorial.notify('view', id);
}
updateBadges() {
const st = this.state;
const set = (id, text) => {
const t = this.tabEls[id];
if (!t) return;
t.badge.textContent = text || '';
t.badge.classList.toggle('hidden', !text);
};
const visitor = st.current && !this.sandbox && this.view !== 'counter' && !this._seenCustomer;
set('counter', st.current && st.current.type === 'complaint' && this.view !== 'counter' ? '!' : st.vial ? '1' : visitor ? '!' : '');
let ripe = 0;
if (!this.sandbox) for (const id of Object.keys(st.garden.beds)) { const s = st.bed(id); if (s && s.owned && s.growth >= 0.999) ripe++; }
set('garden', ripe ? String(ripe) : '');
if (this.view === 'counter') this._seenCustomer = true;
}
placeDose() {
this.doseEl.classList.toggle('collapsed', this.tool !== 'pour' || !this.selected);
}
buildActions() {
const a = this.actionsEl;
if (!a) return;
clear(a);
const set = {};
set.stir = btn('', () => {}, { icon: 'gear', cls: 'icon', title: this.state.has('stirrer') ? 'Clockwork stirrer on/off (A)' : 'Hold to stir automatically', act: 'autostir' });
const startAuto = (e) => { e.preventDefault(); if (this.state.has('stirrer')) this.setAutoStir(!this.autoStir); else this.setAutoStir(true); };
const stopAuto = () => { if (!this.state.has('stirrer')) this.setAutoStir(false); };
set.stir.addEventListener('pointerdown', startAuto);
set.stir.addEventListener('pointerup', stopAuto);
set.stir.addEventListener('pointerleave', stopAuto);
set.stir.addEventListener('pointercancel', stopAuto);
set.speed = btn('1×', () => this.cycleSpeed(), { icon: 'speed', cls: 'icon', title: 'Time speed (F)', act: 'speed' });
a.append(set.stir, set.speed);
if (this.state.has('thermal') || this.sandbox) {
set.thermal = btn('', () => this.toggleThermal(), { icon: 'monocle', cls: 'icon', title: 'Heat map (H)', act: 'thermal' });
a.append(set.thermal);
}
a.append(btn('', () => this.emptyCauldron(), { icon: 'trash', cls: 'icon danger', title: 'Empty the cauldron', act: 'empty' }));
this.actionSet = set;
this.syncActions();
}
syncActions() {
const lidOpen = !this.sim.cauldron.lidClosed;
this.lidBtn.classList.toggle('active', lidOpen);
this.lidBtn.title = lidOpen ? 'Lid open — tap to close (L)' : 'Lid closed — tap to open (L)';
const set = this.actionSet;
if (!set) return;
set.stir.classList.toggle('active', this.autoStir);
set.speed.classList.toggle('active', this.speed > 1);
const l = set.speed.querySelector('.lbl');
if (l) l.textContent = this.speed + '×';
if (set.thermal) set.thermal.classList.toggle('active', this.thermal);
}
toggleThermal() {
this.thermal = !this.thermal;
this.syncActions();
}
buildTools() {
const t = clear(this.toolsEl);
this.toolBtns = {};
for (const d of TOOL_DEFS) {
if (d.needs && !this.state.has(d.needs) && !this.sandbox) continue;
if (d.id === 'pour') continue; // pouring starts from the shelf
const b = btn(d.label, () => this.selectTool(d.id), { icon: d.icon, title: `${d.label} (${d.key})`, act: 'tool-' + d.id });
this.toolBtns[d.id] = b;
t.appendChild(b);
}
t.appendChild(h('div', { class: 'sep' }));
this.actionsEl = h('div', { class: 'acts' });
t.appendChild(this.actionsEl);
this.buildActions();
if (this.tool) this.selectTool(this.tool, true);
}
shelfIds() {
const st = this.state;
if (this.sandbox) return st.world.ingredients;
const avail = st.availableSet();
return st.world.ingredients.filter((id) => avail.has(id));
}
buildShelf() {
const sh = clear(this.shelfEl);
this.jarEls = {};
const st = this.state;
const ids = this.shelfIds();
const labels = shelfLabels(ids.map((id) => st.lookup(id).name));
for (const [n, id] of ids.entries()) {
const m = st.lookup(id);
let cv;
if (m.form === 'solid') {
cv = rawSprite(m.shape || 'stone', m.look || m.color);
cv.classList.add('raw');
} else {
cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: '15', height: '20' }));
drawJar(cv.getContext('2d'), 1, 0, 13, 20, m.look || m.color, m.form);
}
const stock = h('span', { class: 'jstock' });
const el = h('button', { class: 'jar' + (m.form === 'solid' ? ' stone' : ''), title: m.name, 'aria-label': m.name, 'data-id': id, role: 'option' }, stock, cv, h('span', { class: 'jname', text: labels[n] }));
this.bindJar(el, id);
this.jarEls[id] = { el, stock };
sh.appendChild(el);
}
this.updateShelf();
}
bindJar(el, id) {
let pressTimer = 0, sx = 0, sy = 0, dragging = false, ghost = null, pid = -1, columns = false;
const clearTimer = () => { if (pressTimer > 0) clearTimeout(pressTimer); };
el.addEventListener('pointerdown', (e) => {
sx = e.clientX; sy = e.clientY; dragging = false; pid = e.pointerId;
columns = getComputedStyle(this.shelfEl).flexWrap === 'wrap';
if (e.pointerType === 'mouse') { try { el.setPointerCapture(e.pointerId); } catch { /* ignore */ } }
pressTimer = /** @type {any} */ (setTimeout(() => { pressTimer = -1; panels.openIngredient(this, id); }, 550));
});
el.addEventListener('pointermove', (e) => {
if (e.pointerId !== pid || pressTimer === -1) return;
const dy = sy - e.clientY, dx = Math.abs(e.clientX - sx);
const sr = this.shelfEl.getBoundingClientRect();
const outside = e.clientX < sr.left || e.clientX > sr.right || e.clientY < sr.top || e.clientY > sr.bottom;
const across = columns ? dx > 14 && dx > Math.abs(dy) * 0.9 : dy > 14 && dy > dx * 0.9;
if (!dragging && Math.hypot(dx, dy) > 16 && (across || outside)) {
clearTimer(); pressTimer = 0;
dragging = true;
try { el.setPointerCapture(e.pointerId); } catch { /* ignore */ }
this.selectIngredient(id);
ghost = h('div', { class: 'drag-ghost jar-ghost' }, el.querySelector('canvas').cloneNode(true));
const c2 = ghost.querySelector('canvas');
const src = el.querySelector('canvas');
if (c2 && src) /** @type {CanvasRenderingContext2D} */ (/** @type {HTMLCanvasElement} */ (c2).getContext('2d')).drawImage(/** @type {HTMLCanvasElement} */ (src), 0, 0);
document.body.appendChild(ghost);
}
if (dragging && ghost) {
ghost.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 48}px)`;
const r = this.canvas.getBoundingClientRect();
const over = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
if (over) {
const [wx] = this.renderer.toWorld(e.clientX - r.left, e.clientY - r.top);
if (!this.sim.emitter.pouring) this.startPour(wx);
else { this.pourX = this.clampPourX(wx); this.sim.emitter.setX(this.pourX); }
} else if (this.sim.emitter.pouring && !this.sim.emitter.active.dose) this.sim.emitter.stop();
}
});
const end = (e) => {
if (e.pointerId !== pid) return;
clearTimer();
if (dragging) {
dragging = false;
if (ghost) ghost.remove();
ghost = null;
if (this.sim.emitter.pouring && !this.sim.emitter.active.dose) this.sim.emitter.stop();
pressTimer = -2;
}
};
el.addEventListener('pointerup', end);
el.addEventListener('pointercancel', end);
el.addEventListener('pointerleave', () => { if (!dragging) clearTimer(); });
el.addEventListener('click', () => {
if (pressTimer === -1 || pressTimer === -2) { pressTimer = 0; return; }
this.selectIngredient(id);
});
el.addEventListener('contextmenu', (e) => { e.preventDefault(); panels.openIngredient(this, id); });
}
buildDose() {
const d = clear(this.doseEl);
this.groundBtn = btn('', () => { this.ground = !this.ground; this.syncGround(); audio.play('select'); }, { icon: 'mortar', cls: 'icon', title: 'Smash it to powder in the mortar first (G)', act: 'ground' });
this.selIcon = h('span', { class: 'sel-ico' });
d.append(this.selIcon);
for (const ml of [10, 25, 50, 100]) d.append(btn(`${ml}`, () => this.pourDose(ml), { title: `Pour exactly ${ml} ml`, act: 'dose-' + ml }));
d.append(this.groundBtn, btn('', () => panels.openIngredient(this, this.selected), { icon: 'eye', cls: 'icon', title: 'Its magic', act: 'sel-info' }));
this.syncGround();
}
syncGround() {
if (!this.groundBtn) return;
const m = this.selected ? this.state.lookup(this.selected) : null;
const can = !!m && m.form === 'solid' && (this.sandbox || this.state.has('mortar'));
this.groundBtn.classList.toggle('hidden', !can);
this.groundBtn.classList.toggle('active', can && this.ground);
if (this.selIcon) {
clear(this.selIcon);
if (m) this.selIcon.append(h('span', { class: 'swatch', style: { background: rgbToHex(m.look || m.color) } }), h('span', { class: 'sel-name', text: m.name }));
}
}
resize(force = false) {
this.placeDose();
const r = this.stageEl.getBoundingClientRect();
if (r.width < 10 || r.height < 10) return;
const st = this.state;
const jars = st.world.ingredients.slice(0, 14).map((id) => ({ color: st.lookup(id).look || st.lookup(id).color, form: st.lookup(id).form === 'solid' ? 'powder' : st.lookup(id).form }));
if (force) this.renderer._key = '';
this.renderer.resize(Math.floor(r.width), Math.floor(r.height), this.sim.cauldron, jars, this.effectiveQuality());
if (this.tutorial) this.tutorial.place();
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
if (this.pointer.down) return; // a second finger never fights the first
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
this.stageEl.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
this.stageEl.addEventListener('gesturestart', (e) => e.preventDefault());
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
if (!this.selected) { toast('Pick an ingredient', '', 'jar'); return; }
this.startPour(wx);
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
const view = VIEWS.find((v) => v.key === k);
if (view && this.tabEls[view.id]) { this.showView(view.id); return; }
const def = TOOL_DEFS.find((d) => d.key === k);
if (def && (this.toolBtns[def.id] || def.id === 'pour')) { if (def.id === 'pour' && !this.selected) return; this.selectTool(def.id); return; }
if (k === 'l') this.toggleLid();
else if (k === 'f') this.cycleSpeed();
else if (k === 'b' && !this.sandbox) this.startBottling();
else if (k === 's' && !this.sandbox) panels.openShop(this);
else if (k === 'r' && !this.sandbox) { this.showView('book'); this.views.book.open('recipes'); }
else if (k === 'm') { this.ground = !this.ground; this.syncGround(); }
else if (k === 'a') this.setAutoStir(!this.autoStir);
else if (k === 'h' && (this.state.has('thermal') || this.sandbox)) this.toggleThermal();
else if (k === 'escape') panels.openPause(this);
else if (k === 'arrowup' || k === 'arrowright') { this.setFurnace(Math.min(1, this.sim.furnace.setting + 0.1)); }
else if (k === 'arrowdown' || k === 'arrowleft') { this.setFurnace(Math.max(-1, this.sim.furnace.setting - 0.1)); }
else if (k === '0') this.setFurnace(0);
}
selectTool(id, silent = false) {
this.tool = id;
for (const [k, b] of Object.entries(this.toolBtns || {})) b.classList.toggle('active', k === id);
if (id === 'spoon' || id === 'pestle' || id === 'skimmer') this.sim.tool.type = /** @type {any} */ (id);
if (id !== 'pour') {
if (this.sim.emitter.pouring && !(this.sim.emitter.active && this.sim.emitter.active.dose)) this.sim.emitter.stop();
for (const j of Object.values(this.jarEls || {})) j.el.classList.remove('selected');
this.selected = null;
}
this.placeDose();
this.syncGround();
if (!silent) audio.play('select');
if (this.tutorial) this.tutorial.notify('tool', id);
}
selectIngredient(id) {
const m = this.state.lookup(id);
if (this.selected !== id) this.ground = !!(m.form === 'solid' && (this.sandbox || this.state.has('mortar')));
this.selectTool('pour', true);
this.selected = id;
for (const [k, j] of Object.entries(this.jarEls)) j.el.classList.toggle('selected', k === id);
audio.play('select');
this.placeDose();
this.syncGround();
if (this.tutorial) this.tutorial.notify('select', id);
}
clampPourX(x) {
const m = this.sim.cauldron.mouth - 0.15;
return Math.max(-m, Math.min(m, x));
}
canPour(id) {
if (this.sandbox) return Infinity;
return Math.floor(this.state.stock(id) / SIM.ML_PER_PARTICLE);
}
startPour(x, amount, ground) {
const id = this.selected;
if (!id) return;
const avail = this.canPour(id);
if (avail <= 0) {
audio.play('error');
const m = this.state.lookup(id);
toast(`No ${m.name} left`, 'Harvest more in the garden.', 'seedling');
return;
}
if (this.sim.p.count >= this.sim.maxParticles - 2) {
toast('The cauldron is full', '', 'cauldron');
return;
}
this.pourX = this.clampPourX(x);
const def = this.state.lookup(id);
const n = Math.min(avail, amount ?? Infinity);
const g = ground ?? (this.ground && def.form === 'solid' && (this.sandbox || this.state.has('mortar')));
this.sim.emitter.start(def, { x: this.pourX, amount: n, ground: g });
this.sim.emitter.active.dose = amount !== undefined;
this.lastPoured[id] = this.sim.emitter.poured[id] || 0;
this.pourGround = g;
if (g) audio.play('crush');
if (this.tutorial) this.tutorial.notify('pour', id);
}
pourDose(ml) {
if (!this.selected) { toast('Pick an ingredient', '', 'jar'); return; }
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
this.logPour(id, ml, !!(em.active ? em.active.form === 'powder' && em.active.def.form === 'solid' : this.pourGround));
}
}
logPour(id, ml, ground = false) {
const log = this.state.brewLog;
if (this.sim.p.count <= Math.round(ml / SIM.ML_PER_PARTICLE) + 1 && !log.some((e) => e.type === 'pour')) this.state.newBatch();
const last = log[log.length - 1];
if (last && last.type === 'pour' && last.id === id && !!last.ground === ground) last.ml += ml;
else log.push({ type: 'pour', id, ml, t: Math.round(this.sim.time), ground: ground || undefined });
this.state.touchBatch();
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
t.autoCenterY = c.depth - Math.min(0.75, c.depth * 0.3);
t.autoRadius = upgraded ? c.belly * 0.55 : c.belly * 0.32;
t.autoPhase = 0;
} else {
t.setTarget(t.x, t.y, false);
}
this.syncActions();
}
async emptyCauldron() {
if (this.sim.p.count === 0) return;
const ok = await confirmDialog('Empty the cauldron?', 'Everything in it is poured away.', 'Empty it', 'danger');
if (!ok) return;
this.sim.clear();
this.state.brewLog = [];
this.state.newBatch();
this.lastPoured = {};
audio.play('splash');
this.views.testing.refresh();
this.save();
}
bringCustomer(withSound = true) {
const st = this.state;
if (this.sandbox) return;
const c = st.nextCustomer();
if (c && withSound) audio.play(c.type === 'complaint' ? 'fail' : 'bell');
this._seenCustomer = false;
this.refreshCustomer();
if (this.views) this.views.counter.refresh();
this.updateBadges();
}
refreshCustomer() {
if (this.sandbox) return;
const st = this.state;
const el = clear(this.strip);
const com = st.current;
el.classList.toggle('empty', !com || com.type !== 'order');
if (!com) {
el.append(h('div', { class: 'strip-empty' }, icon(st.dayOver ? 'sun' : 'door'), h('span', { class: 'small', text: st.dayOver ? 'Day over' : 'No customer' })));
return;
}
const portrait = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'portrait' }));
drawPortrait(portrait, com.customer.portrait, com.type === 'complaint' ? 'unhappy' : 'neutral');
if (com.type === 'complaint') {
el.append(portrait, h('div', { class: 'strip-main' }, h('div', { class: 'req-chips' }, h('span', { class: 'req-chip bad' }, icon('refund', 'sm'), icon(PROP_BY_KEY[com.complaint.key].icon, 'sm'), icon(com.complaint.how === 'weak' ? 'down' : 'warn', 'sm')))));
return;
}
el.append(portrait, h('div', { class: 'strip-main' }, panels.reqChips(com.requirements)));
}
async decline() {
const ok = await confirmDialog('Send the customer away?', '', 'Send away', 'danger');
if (!ok) return;
this.state.declineCustomer();
this.refreshCustomer();
this.views.counter.refresh();
setTimeout(() => this.bringCustomer(true), 700);
}
endDay() {
const summary = this.state.endDay();
this.save();
panels.showDaySummary(this, summary, () => {
const relief = this.state.claimRelief();
if (relief) toast('Guild stipend', `+${relief} coins`, 'coin', 4000);
this.buildShelf();
this.bringCustomer(true);
this.refreshHud(true);
this.views.garden.refresh();
this.views.testing.refresh();
});
}
startBottling() {
if (this.sandbox || this.bottling) return;
const st = this.state;
if (st.vial) { toast('A vial is waiting', 'Sell or empty it first.', 'bottle'); this.showView('counter'); return; }
const com = st.current && st.current.type === 'order' ? st.current : null;
const n = com ? com.bottleN : 20;
const sel = tapSelection(this.sim, n);
if (sel.length < 1) { toast('Nothing to bottle', '', 'flask'); audio.play('error'); return; }
const m = measureParticles(this.sim, sel);
this.sim.emitter.stop();
this.setAutoStir(false);
this.bottling = { total: sel.length, removed: 0, progress: 0, color: m.color, measurement: m, n, t: 0, batch: { ...st.batch } };
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
b.progress = b.removed / Math.max(1, b.n);
if (b.t > 1.8) this.finishBottling();
}
finishBottling() {
const b = this.bottling;
this.bottling = null;
const st = this.state;
const id = st.idCard && st.idCard.batchId === b.batch.id ? st.idCard : null;
st.vial = {
id: 'v' + Date.now().toString(36),
ml: b.measurement.ml,
m: b.measurement,
batchId: b.batch.id,
rev: b.batch.rev,
label: id ? { values: { ...id.values }, stale: (id.rev ?? 0) !== b.batch.rev } : null,
certified: null,
parts: this.batchParts(),
day: st.day,
recipe: this.recipeDraft(b.measurement),
};
if (this.sim.p.count === 0) { st.brewLog = []; st.newBatch(); this.lastPoured = {}; }
audio.play('glass');
this.save();
this.showView('counter');
this.updateBadges();
}
discardVial() {
this.state.vial = null;
audio.play('splash');
this.save();
this.views.counter.refresh();
this.updateBadges();
}
pourBackVial() {
const st = this.state;
const v = st.vial;
if (!v) return;
const sim = this.sim;
const n = Math.floor(v.ml / SIM.ML_PER_PARTICLE);
const ids = Object.keys(v.m.composition);
const total = Object.values(v.m.composition).reduce((a, b) => a + b, 0) || 1;
if (sim.p.count + n > sim.maxParticles) { toast('No room', 'The cauldron is too full.', 'cauldron'); return; }
let made = 0;
for (let k = 0; k < n; k++) {
const x = (sim.rand() - 0.5) * sim.cauldron.mouth;
const i = sim.addParticle(st.lookup(ids[0]), x, 0.15 + sim.rand() * 0.25, PHASE.LIQUID, v.m.temperature);
if (i < 0) break;
sim.p.comp.fill(0, i * MAX_SPECIES, (i + 1) * MAX_SPECIES);
for (const id of ids) {
const def = st.lookup(id);
if (!def) continue;
const s = sim.slotFor(def);
if (s >= 0) sim.p.comp[i * MAX_SPECIES + s] += v.m.composition[id] / total;
}
sim.p.vig[i] = v.m.vig ?? 1;
sim.p.ss[i] = v.m.ss ?? 0;
sim.p.stp[i] = v.m.steep ?? -300;
sim.p.dirty[i] = 1;
made++;
}
if (st.batch.id !== v.batchId) st.newBatch();
st.touchBatch();
st.vial = null;
audio.play('splash');
toast('Poured back', `${made * SIM.ML_PER_PARTICLE} ml`, 'pour');
this.save();
this.views.counter.refresh();
this.showView('brew');
}
recipeDraft(m) {
const st = this.state;
const agg = [];
for (const e of st.brewLog) {
if (e.type !== 'pour') continue;
const last = agg[agg.length - 1];
if (last && last.id === e.id && !!last.ground === !!e.ground) last.ml += e.ml;
else agg.push({ id: e.id, ml: e.ml, ground: e.ground || undefined });
}
const stats = st.brewLog.find((e) => e.type === 'stats') || {};
const com = st.current && st.current.type === 'order' ? st.current : null;
return {
name: com ? com.potionName : 'Experiment',
ingredients: agg,
maxTemp: Math.round(stats.maxT ?? m.temperature),
minTemp: Math.round(stats.minT ?? m.temperature),
serveTemp: Math.round(m.temperature),
stirSeconds: Math.round(stats.stir || 0),
crushed: !!stats.crushed,
color: m.color,
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
if (t.active && t.type === 'pestle') s.crushed = true;
}
announce(e) {
if (e.type === 'achievement') {
toast(e.name, `+${e.reward}`, 'trophy', 3600);
audio.play('fanfare');
} else if (e.type === 'rank') {
toast(`Rank: ${e.name}`, 'New beds, customers and equipment.', 'charter', 5000);
audio.play('fanfare');
this.buildShelf();
this.views.garden.refresh();
}
}
tapAvailable() {
const p = this.sim.p;
let n = 0;
for (let i = 0; i < p.count; i++) if (p.phase[i] !== PHASE.GAS && p.phase[i] !== PHASE.SOLID) n++;
return n * SIM.ML_PER_PARTICLE;
}
batchParts() {
const out = [];
for (const e of this.state.brewLog) if (e.type === 'pour') {
const last = out.find((x) => x.id === e.id);
if (last) last.ml += e.ml; else out.push({ id: e.id, ml: e.ml });
}
return out;
}
drawDose(ml) {
const n = Math.max(1, Math.round(ml / SIM.ML_PER_PARTICLE));
const sel = tapSelection(this.sim, n);
if (!sel.length) return null;
const m = measureParticles(this.sim, sel);
for (const i of sel.slice().sort((a, b) => b - a)) this.sim.removeParticle(i);
if (this.sim.p.count === 0) { this.state.brewLog = []; this.lastPoured = {}; }
audio.play('glass');
return { dose: m, ml: sel.length * SIM.ML_PER_PARTICLE };
}
vialDose(ml) {
const v = this.state.vial;
if (!v || v.ml < 1) return null;
const take = Math.min(ml, v.ml);
v.ml -= take;
const r = { dose: v.m, ml: take, batchId: v.batchId, rev: v.rev };
if (v.ml < 1) {
this.state.vial = null;
toast('The vial is empty', '', 'bottle');
}
return r;
}
toggleBrewInfo() {
this.brewPanel.classList.toggle('hidden');
this.updateBrewPanel(true);
}
updateBrewPanel(force = false) {
const el = this.brewPanel;
if (!el || (el.classList.contains('hidden') && !force)) return;
const st = this.state;
clear(el);
const parts = this.batchParts();
el.append(h('div', { class: 'row' }, icon('cauldron'), h('b', { text: `${this.sim.p.count * SIM.ML_PER_PARTICLE} ml` }), h('span', { class: 'spacer' }), btn('', () => this.toggleBrewInfo(), { icon: 'close', cls: 'icon', title: 'Close' })));
if (!parts.length) { el.append(h('div', { class: 'small muted', text: '—' })); return; }
for (const p of parts) {
const m = st.lookup(p.id);
if (!m) continue;
el.append(h('div', { class: 'row small poured' }, h('span', { class: 'swatch', style: { background: rgbToHex(m.look || m.color) } }), h('span', { class: 'pname', text: m.name }), h('span', { class: 'spacer' }), h('b', { text: `${Math.round(p.ml)}` })));
}
}
refreshHud(full = false) {
const st = this.state;
if (!this.sandbox) {
this.coinEl.textContent = coins(st.coins);
this.coinEl.classList.toggle('neg', st.coins < 0);
const r = st.rank, next = RANKS[r + 1];
this.rankName.textContent = RANKS[r].name;
const prog = next ? (st.reputation - RANKS[r].rep) / (next.rep - RANKS[r].rep) : 1;
this.rankBar.style.width = Math.round(Math.min(1, prog) * 100) + '%';
this.rankBar.parentElement.title = `${RANKS[r].name} · ${st.reputation}${next ? ' / ' + next.rep : ''}`;
const ev = st.marketEvent;
const dayKey = `${st.day}|${st.customerIndex}|${st.current ? st.current.type : ''}|${st.customersPerDay}|${ev.key}`;
if (dayKey !== this._dayKey) {
this._dayKey = dayKey;
const seen = Math.min(st.customerIndex + (st.current && st.current.type === 'order' ? 1 : 0), st.customersPerDay);
this.dayEl.title = `Day ${st.day} · customer ${seen} of ${st.customersPerDay}`;
clear(this.dayEl).append(...[icon('sun', 'sm'), h('span', { text: `${st.day}` }), icon('stall', 'sm'), h('span', { class: 'muted', text: `${seen}/${st.customersPerDay}` }), ev.key !== 'none' ? h('span', { class: 'event', title: ev.name }, icon(ev.icon, 'sm')) : null].filter(Boolean));
}
}
this.syncActions();
const f = this.sim.furnace.setting;
const c = this.sim.cauldron;
this.furnaceLabel.textContent = `${Math.round(c.bottomTemperature())}°`;
this.furnaceLabel.title = f > 0.02 ? `Fire ${Math.round(f * 100)}%` : f < -0.02 ? `Frost ${Math.round(-f * 100)}%` : 'Off';
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
let T = 0, n = 0;
for (let i = 0; i < p.count; i++) if (p.phase[i] !== PHASE.GAS) { T += p.temp[i]; n++; }
c.append(h('div', { class: 'chip', title: 'In the cauldron (ml)' }, icon('flask', 'sm'), ` ${p.count * SIM.ML_PER_PARTICLE}`));
if (n) c.append(h('div', { class: 'chip', title: 'Mean temperature' }, icon('thermo', 'sm'), ` ${Math.round(T / n)}°`));
if (this.autoBrewer) c.append(h('div', { class: 'chip', title: this.autoBrewer.status }, icon('homunculus', 'sm'), ' …'));
if (this.app.settings.showFps) c.append(h('div', { class: 'chip', text: `${this.fpsAcc.fps} fps · ${sim.stats.stepMs.toFixed(1)} ms · ${p.count}` }));
}
frame(t) {
const tw0 = performance.now();
const pf = this.perf;
pf.intervals[pf.n % 600] = t - this.lastT;
let dt = (t - this.lastT) / 1000;
const battery = this.effectiveQuality() === 'low' && this.app.settings.quality === 'low';
if (battery && dt < 1 / 34) return;
this.lastT = t;
if (dt > 0.1) dt = 0.1;
this.time += dt;
const fa = this.fpsAcc;
fa.t += dt; fa.n++;
if (fa.t >= 1) { fa.fps = Math.round(fa.n / fa.t); fa.t = 0; fa.n = 0; }
const modalOpen = !!document.querySelector('.overlay');
const sim = this.sim;
const brewing = this.view === 'brew';
if (this.autoBrewer) {
const n = Math.min(12, Math.round((dt * this.speed) / SIM.DT));
for (let k = 0; k < n; k++) {
this.autoBrewer.tick();
sim.step();
if (this.autoBrewer.done) { toast('Homunculus done', '', 'homunculus'); this.autoBrewer = null; this.setFurnace(0); break; }
}
this.accountPours();
} else {
const cap = this.speed > 1 ? 10 : 6;
const budget = Math.max(8, Math.min(22, 30 - (brewing ? this.perf.renderMs : 2)));
const maxSteps = Math.max(1, Math.min(cap, Math.floor(budget / Math.max(0.3, sim.stats.stepMs || 1))));
sim.advance(dt, this.speed, maxSteps);
this.accountPours();
}
const tw1 = performance.now();
this.stepBottling(dt);
this.trackBrew(dt);
if (sim.events.length) {
const evs = sim.events.splice(0);
for (const e of evs) this.handleSimEvent(e);
}
this.hudTimer += dt;
this.tapTimer += dt;
this.saveTimer += dt;
this.mixTimer += dt;
if (this.hudTimer > 0.25) { this.hudTimer = 0; this.refreshHud(); this.updateShelf(); this.updateBrewPanel(); this.checkAway(); this.recoverSkimmed(); }
if (this.tapTimer > 0.5 && !this.bottling) { this.tapTimer = 0; this.tapMl = this.tapAvailable(); if (this.bottleFab) this.bottleFab.disabled = this.tapMl < SIM.ML_PER_PARTICLE; }
if (this.mixTimer > 2) { this.mixTimer = 0; this.detectMixing(); }
if (this.saveTimer > 15) { this.saveTimer = 0; this.save(); }
if (this.tutorial) this.tutorial.update();
const tool = sim.tool;
const stirTarget = tool.active && tool.type !== 'skimmer' ? Math.min(1, tool.speed / 2.5) : 0;
this.stirLevel += (stirTarget - this.stirLevel) * Math.min(1, dt * 10);
if (sim.steps % 30 === 0) { let boiling = 0; for (let i = 0; i < sim.p.count; i++) if (sim.p.phase[i] === PHASE.GAS && sim.nCond[i] >= 3) boiling++; this.lastBoil = boiling; }
const audible = brewing ? 1 : 0.35;
audio.update({ fire: Math.max(0, sim.furnace.setting) * audible, cold: Math.max(0, -sim.furnace.setting) * audible, stir: this.stirLevel, pour: sim.emitter.pouring ? 1 : 0, boil: Math.min(1, this.lastBoil / 30) * audible }, dt);
const tw2 = performance.now();
if (brewing) {
const em = sim.emitter;
this.renderer.render({
sim,
time: this.time,
dt: modalOpen ? dt * 0.5 : dt,
pour: { active: em.pouring, x: em.active ? em.active.x : this.pourX, def: em.active ? em.active.def : null },
tool: { type: tool.type, x: tool.x, y: tool.y, active: tool.active },
toolHover: this.hover && (this.tool === 'spoon' || this.tool === 'pestle' || this.tool === 'skimmer'),
bottling: this.bottling ? { progress: this.bottling.progress, color: this.bottling.color } : null,
showBottle: !this.sandbox && !this.state.vial,
probe: null,
thermal: this.thermal,
alembic: false,
receiver: null,
stirrer: this.state.has('stirrer') && this.autoStir,
});
} else if (this.views[this.view] && this.views[this.view].frame) {
this.views[this.view].frame(dt);
}
const tw3 = performance.now();
pf.work[pf.n % 600] = tw3 - tw0;
if (brewing) this.adaptQuality(dt, tw3 - tw0);
pf.n++;
pf.physMs = pf.physMs * 0.95 + (tw1 - tw0) * 0.05;
if (brewing) pf.renderMs = pf.renderMs * 0.95 + (tw3 - tw2) * 0.05;
}
checkAway() {
if (this.view === 'brew') return;
const sim = this.sim;
if (this.time - this.awayWarned < 20) return;
let gas = 0, burn = 0;
for (let i = 0; i < sim.p.count; i++) { if (sim.p.phase[i] === PHASE.GAS) gas++; if (sim.p.burn[i] > 0.3) burn++; }
const fading = sim.stats.faded > 3;
if (burn > 2 || fading || (gas > 6 && sim.furnace.setting > 0.05)) {
this.awayWarned = this.time;
toast(burn > 2 ? 'Something is burning!' : fading ? 'The magic is fading!' : 'The cauldron is boiling', 'The fire is still lit.', 'flame', 4000);
}
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
if (this.view === 'brew') this.renderer.onEvent(e);
switch (e.type) {
case 'crush': if (Math.random() < 0.5) audio.play('crush'); break;
case 'ignite': audio.play('ignite'); break;
case 'transmute': if (Math.random() < 0.3) audio.play('reaction'); break;
case 'phase': if (e.to === 'solid' && Math.random() < 0.15) audio.play('freeze'); break;
case 'full': toast('The cauldron is full', '', 'cauldron'); break;
}
if (this.sandbox) return;
const r = processEvent(this.state, e);
for (const entry of r.entries) {
toast(entry.title, '', entry.kind === 'magic' ? 'eye' : 'scroll', 3200);
audio.play('discover');
}
for (const a of r.achievements) this.announce(a);
}
detectMixing() {
if (this.sandbox) return;
const sim = this.sim, p = sim.p, sp = sim.species;
const liquids = [];
for (let s = 0; s < sp.count; s++) if (sp.defs[s] && sp.defs[s].form === 'liquid' && sp.magW[s] >= 0) liquids.push(s);
for (let a = 0; a < liquids.length; a++) for (let b = a + 1; b < liquids.length; b++) {
const A = liquids[a], B = liquids[b];
if (compatFactorT(sp.compatA[A], sp.compatB[A], sp.compatA[B], sp.compatB[B], 20) > 0.2) continue;
let both = 0, onlyA = 0, onlyB = 0;
for (let i = 0; i < p.count; i++) {
const fa = p.comp[i * MAX_SPECIES + A], fb = p.comp[i * MAX_SPECIES + B];
if (fa > 0.25 && fb > 0.25) both++;
else if (fa > 0.8) onlyA++;
else if (fb > 0.8) onlyB++;
}
const ids = [sp.defs[A].id, sp.defs[B].id].sort();
if (both >= 10) this.handleSimEvent({ type: 'heatmix', a: ids[0], b: ids[1] });
else if (onlyA >= 10 && onlyB >= 10) this.handleSimEvent({ type: 'layers', a: ids[0], b: ids[1] });
}
}
startHomunculus(recipe) {
const plan = {
ingredients: recipe.ingredients.map((i) => ({ id: i.id, n: Math.round(i.ml / SIM.ML_PER_PARTICLE), ground: i.ground })),
heatTo: recipe.maxTemp, coolTo: recipe.minTemp, serveTemp: recipe.serveTemp, knead: recipe.stirSeconds > 12, crush: recipe.crushed, hold: 12,
};
this.autoBrewer = new AutoBrewer(this.sim, plan, this.state.lookup, {
onPour: (id, n) => this.sandbox || this.state.stock(id) >= n * SIM.ML_PER_PARTICLE,
onPoured: (id, n, ground) => { this.pourGround = ground; },
});
toast('The homunculus gets to work', recipe.name, 'homunculus');
}
recoverSkimmed() {
const rec = this.sim.tool.recovered;
const st = this.state;
let any = 0;
for (const [id, n] of Object.entries(rec)) {
if (n <= 0) continue;
rec[id] = 0;
if (this.sandbox || !st.world.ingredients.includes(id) || !isFinite(st.stock(id))) continue;
const ml = n * SIM.ML_PER_PARTICLE;
const room = Math.max(0, st.cap.storage - st.stock(id));
const back = Math.min(ml, room);
if (back > 0) { st.inventory[id] = st.stock(id) + back; any += back; }
}
if (any) {
this.updateShelf();
if (this.time - (this._recToast || -99) > 4) { this._recToast = this.time; toast('Recovered', `+${any} ml`, 'ladle', 2200); }
}
}
save() {
if (this.saveBlocked) return;
if (this.sandbox) {
saveJSON(KEYS.sandbox, { seed: this.state.seed, cauldron: snapshotSim(this.sim, this.cap.size), lab: this.state.lab });
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
return { VIEWS, LabScreen };
})();
// src/materials/reference.js
const __m58 = (() => {
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
density: 2.4, compat: [0.7, 0.4], friction: 0.6, melt: 1200, boil: Infinity, hardness: 0.6, heatCapacity: 2, conductivity: 1.5, glow: 0.4 });
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
const __m57 = (() => {
const { h, btn } = __m2;
const { Renderer } = __m40;
const { Simulation } = __m25;
const { REF, refLookup } = __m58;
const { hasSave, loadGame } = __m23;
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
const { EQUIPMENT } = __m18;
const { loadGame, saveGame, hasSave, deleteSave, loadJSON, saveJSON, KEYS, storageAvailable } = __m23;
const { LabScreen } = __m24;
const { MenuScreen } = __m57;
const { openSettings, openHelp } = __m49;
const { Rng } = __m6;
const { normalizeLab } = __m19;
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
h('div', { class: 'small', text: 'Every world grows its own ingredients and customers from its seed. Share a seed to share a world.' }),
h('label', { class: 'field' }, 'World seed', seedIn),
h('div', { class: 'toggle-row' }, h('span', { text: 'Guided first order (recommended)' }), tut)),
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
if (saved && saved.seed === seed && saved.lab) st.lab = normalizeLab(saved.lab);
this._swap(new LabScreen(this, st, { sandbox: true }));
toast('Free Experiment', 'Every ingredient, tool and creature. Nothing here affects your shop.', 'flask', 4500);
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