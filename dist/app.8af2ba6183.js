// The Alchemist's Shop 2.3.0 — bundled build
// src/ui/icons.js
const __m3 = (() => {
const PAL = {
k: '#1a1218', K: '#3a2a30', w: '#fff6e0', W: '#c9c0b0', s: '#8a8296', S: '#4a4252',
y: '#ffd75a', Y: '#c48a2c', o: '#ff8a2a', r: '#e0402c', R: '#8a1f1a', b: '#4a8cff', B: '#23458f',
c: '#8fe0ff', g: '#7dc24a', G: '#3a6e24', n: '#a8743f', N: '#5a3a20', p: '#a678ff', P: '#5a3aa8',
m: '#ff5aa8', l: '#fff0b0', t: '#5fd4b4',
};
const ICONS = {
purge: ['.....kk..l..', '....kWWk.l..', '....kwck.l..', '...kkwckk...', '..kwcccccK..', '.kwcccwcccK.', 'kwcccwwwcccK', 'kwccccwcccBk', 'kwcccccccBBk', '.kwccccccBk.', '..kkkkkkkk..', '............'],
knife: ['..........kk', '.........kWk', '........kWsk', '.......kWsk.', '......kWsk..', '.....kWsk...', '....kWsk....', '..kkkkk.....', '..kNnk......', '.kNnk.......', 'kNnk........', 'kkk.........'],
claw: ['k...k...k...', 'rk..rk..rk..', '.rk..rk..rk.', '.rrk.rrk.rrk', '..rk..rk..rk', '..rrk.rrk.rr', '...rk..rk..r', '...rrk.rrk..', '....rk..rk..', '....Rk..Rk..', '.....k...k..', '............'],
tag: ['......kkkk..', '.....kllllk.', '....klllkllk', '...kllllllk.', '..klllllllk.', '.kllNlllllk.', 'kllNNllllk..', 'klllNlllk...', '.kllllllk...', '..kllllk....', '...kllk.....', '....kk......'],
deal: ['............', '............', 'kk........kk', 'knk..kk..knk', 'knnkkllkknnk', 'kNnklllllnNk', '.kNlllkllNk.', '..kllkllkk..', '...klllk....', '....kkk.....', '............', '............'],
pure: ['.....kk.....', '....kcck....', '....kcck....', '...kcwcck...', '...kcwcck...', '..kcwccccK..', '..kcccccck..', '.kccccccccK.', '.kcccccccck.', '.kcccccccBk.', '..kccccBBk..', '...kkkkkk...'],
talk: ['.kkkkkkkkkk.', 'kwwwwwwwwwwk', 'kwwwwrrwwwwk', 'kwwwwrrwwwwk', 'kwwwwrrwwwwk', 'kwwwwrrwwwwk', 'kwwwwwwwwwwk', 'kwwwwrrwwwwk', 'kWwwwwwwwwWk', '.kkkkwwkkkk.', '.....kwk....', '......kk....'],
awaken: ['.....k......', '....kpk.....', '.k..kpk..k..', '.kpkkwkkpk..', '..kpwwwpk...', 'kppwwlwwppk.', '..kpwwwpk...', '.kpkkwkkpk..', '.k..kpk..k..', '....kpk.....', '.....k......', '............'],
bone: ['............', '.kk.......kk', 'kwwk.....kwk', 'kwWwk...kwwk', '.kwWwkkkwWk.', '..kwWwwwWk..', '..kWwwwWwk..', '.kWwkkkwWwk.', 'kwwk...kwWwk', 'kwk.....kwwk', 'kk.......kk.', '............'],
fur: ['............', '..k...k...k.', '.kWk.kWk.kWk', '.kwWkkwWkkwk', 'kwwwWwwwWwwk', 'kwwwwwwwwwWk', 'kWwwwWwwwWWk', 'kWWwwWWwWWWk', '.kWWWWWWWWk.', '..kkkkkkkk..', '............', '............'],
nest: ['............', '...kkkkkk...', '..kwwwwwWk..', '.kwwlwwwwWk.', '.kwwwwwwwWk.', '..kwwwwwWk..', 'knknkkkknknk', 'kNnNnnNnNnNk', '.kNnNnNnNnk.', '..kkkkkkkk..', '............', '............'],
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
fist: ['............', '...kkkkkk...', '..kyykyykk..', '.kyykyykyyk.', '.kyykyykyyk.', '.kyyyyyyyyk.', 'kkyyyyyyyyk.', 'kyyyyyyyyYk.', '.kyyyyyyYk..', '..kyyyyYYk..', '..kYYYYYk...', '..kkkkkkk...'],
rose: ['....kkkk....', '...kmmmmk...', '..kmmlmmmk..', '..kmlmmlmk..', '..kmmmmmmk..', '...kmmmmk...', '....kkkk.k..', '.....kg.kgk.', '..kk.kgkgk..', '.kgGkkgGk...', '..kkk.kgk...', '......kk....'],
swirl: ['...kkkkk....', '..kttttk....', '.ktkkkk.....', 'ktk..kkkk...', 'ktk.kttttk..', 'ktk.ktkktk..', 'ktk..kk.ktk.', '.ktk....ktk.', '..ktkkkktk..', '...ktttttk..', '....kkkkk...', '............'],
acid: ['...kkkkkk...', '....kwWk....', '....kwWk....', '...kwwWWk...', '..kwgw.gWk..', '..kgygyggk..', '.kgyggygggk.', '.kggyggyggk.', 'kggggggggGGk', 'kggygggggGGk', '.kkkkkkkkkk.', '............'],
skull: ['............', '...kkkkkk...', '..kwwwwwwk..', '.kwwwwwwwWk.', '.kwkkwwkkWk.', '.kwkkwwkkWk.', '.kwwwkkwwWk.', '..kwwwwwWk..', '...kwkwkWk..', '...kwkwkk...', '....kkkk....', '............'],
death: ['.....kk.....', '....kppk....', '...kpPPpk...', '...kpkkpk...', '..kpPkkPpk..', '..kpPPPPpk..', '.kpPPPPPPpk.', '.kpPPPPPPpk.', 'kpPPPPPPPPpk', 'kpPkPPkPPkpk', 'kpk.kk.kk.kk', 'kk..........'],
mortar: ['..........kk', '.........kWk', '........kWk.', '.......kWk..', '......kWk...', '.kkkkkWkkkk.', 'kWWWWsWWWWsk', '.kssssssssk.', '.kssssssssk.', '..kssssssk..', '...kkkkkk...', '..kkkkkkkk..'],
galvo: ['..kkkkkkkk..', '.kwwwwwwwwk.', 'kwwkwwwwkwwk', 'kwwwwwwkwwwk', 'kwwwwwkwwwwk', 'kwwwwkwwwwwk', 'kwwwryrwwwwk', 'kSSSSSSSSSSk', 'kSyySSSSbbSk', 'kSSSSSSSSSSk', '.kkkkkkkkkk.', '............'],
rabbit: ['..kk..kk....', '.kwk.kwk....', '.kmk.kmk....', '.kwk.kwk....', '..kwkwwk....', '.kwwwwwwk...', '.kwkwwwwk...', '.kwwwwwwwkk.', '..kwwwwwwwk.', '..kwwwwwwWk.', '...kwkkwkk..', '...kk..kk...'],
beetle: ['..k......k..', '...k....k...', '...kkkkkk...', '..kGgggggk..', '.kGgkgGkggk.', 'kkGggkGggGkk', '.kGggkGggGk.', 'kkGggkGggGkk', '.kGggkGggGk.', '..kGGkGGGk..', '...kkkkkk...', '............'],
seedling: ['............', '...kk..kk...', '..kgGkkgGk..', '..kggGkggk..', '...kgGgGk...', '.....kGk....', '.....kGk....', '..kkkkkkkk..', '..knnnnnnk..', '..knNnnnnk..', '...knnnnk...', '...kkkkkk...'],
stone: ['............', '............', '....kkkkk...', '..kkWWWsskk.', '.kWWsssssSk.', '.kWssssssSSk', 'kWsssssssSSk', 'kssssssssSSk', 'kSssssssSSSk', '.kSSSSSSSSk.', '..kkkkkkkk..', '............'],
wisp: ['.....k......', '....kck.....', '....kcck....', '...kcwck....', '..kcwwwck...', '..kcwlwck...', '.kcwwlwwck..', '.kcwlllwck..', '.kcwwlwwck..', '..kcwwwck...', '...kccck....', '....kkk.....'],
satchel: ['...kkkkkk...', '..kN....Nk..', '.kN......Nk.', 'kkkkkkkkkkkk', 'knnnnnnnnnnk', 'knnnkyykknnk', 'knnnkyykknnk', 'knnnnkknnnNk', 'knnnnnnnnnNk', 'knnnnnnnnNNk', '.kNNNNNNNNk.', '..kkkkkkkk..'],
tree: ['....kkkk....', '..kkgggGkk..', '.kgggggggGk.', 'kgggGgggggGk', 'kggggggGgggk', 'kgGgggggggGk', '.kgggggGgGk.', '..kkkNnkkk..', '.....kNk....', '.....kNk....', '....kNnNk...', '..kkkkkkkk..'],
stall: ['kkkkkkkkkkkk', 'krrwwrrwwrrk', 'krrwwrrwwrrk', '.kkkkkkkkkk.', '.kn......nk.', '.kn.kmk..nk.', '.kn.kmk..nk.', 'kkkkkkkkkkkk', 'knnnnnnnnnnk', 'knNnnnnnNnnk', 'knnnnnnnnnnk', 'kkkkkkkkkkkk'],
dropper: ['..........kk', '.........kmk', '........kmmk', '.......kmmk.', '......kwWk..', '.....kwWk...', '....kwWk....', '...kwWk.....', '..kwWk......', '.kcWk.......', '.kck........', '..k.........'],
leaf: ['..........kk', '........kkgk', '......kkgggk', '....kkgggGgk', '...kgggGgggk', '..kggGgggggk', '..kgGgggggk.', '.kgGgggggk..', '.kGgggGkk...', 'kGgkkkk.....', 'kk..........', '............'],
gem: ['............', '...kkkkkk...', '..kpwppPPk..', '.kpwpppPPPk.', 'kkkkkkkkkkkk', '.kpwpppPPk..', '..kpwppPk...', '...kpwPk....', '....kpk.....', '.....k......', '............', '............'],
pick: ['..kkkk......', '.kWWWWkk....', 'kWSSSSWWk...', '.kk..kSWk...', '......kNnk..', '.......kNnk.', '........kNnk', '.........kNk', '..........kk', '............', '............', '............'],
trowel: ['.........kk.', '........knNk', '.......knNk.', '......knNk..', '.....kkkk...', '....kWWsk...', '...kWwWsk...', '..kWwWWsk...', '.kWwWWsSk...', '.kWWWsSk....', 'kWsSSkk.....', 'kkkk........'],
sickle: ['....kkkk....', '..kkWWWWk...', '.kWWkkkWWk..', 'kWWk...kWk..', 'kWk.....kk..', 'kWk.........', 'kWk.........', '.kWk....kk..', '..kWkk.knk..', '...kkWkNk...', '......kNk...', '.......kk...'],
brush: ['........kk..', '.......knk..', '......knk...', '.....knk....', '....knk.....', '...kNNk.....', '..kYYYYk....', '.kyyyyyk....', 'kWkWkWkWk...', 'kWkWkWkWk...', '.kkkkkkk....', '............'],
bolt: ['......kkkk..', '.....kyyyk..', '....kyyyk...', '...kyyyk....', '..kyyyykkk..', '.kyyyyyyyk..', '..kkkyyyk...', '....kyyk....', '...kyyk.....', '..kyyk......', '..kyk.......', '..kk........'],
spark: ['.....k......', '....kyk.....', '....kyk..k..', '.k..kyk.kyk.', 'kyk.kyykyk..', '.kyykyyyk...', '..kyyllyyk..', '...kyyykyyk.', '..kyk.kyk.k.', '.kyk..kyk...', '..k....k....', '............'],
bottle: ['....kkkk....', '....knnk....', '....kWWk....', '...kwwWWk...', '..kwmmmmWk..', '.kwmmlmmmWk.', '.kwmmmmmmWk.', '.kwmmmmmmPk.', '.kwmmmmmPWk.', '..kwmmmPWk..', '...kkkkkk...', '............'],
trophy: ['.kkkkkkkkkk.', 'kykyyyyyykyk', 'kyykyyyykyyk', '.kyyyyyyyyk.', '..kyyyyyYk..', '...kyyyYk...', '....kyYk....', '.....kk.....', '....kyYk....', '...kkkkkk...', '..kyyyyyYk..', '..kkkkkkkk..'],
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
case 'awaken': {
const o = this._tone(220, 'sine', t, 0.07, 1.3, this.sfx, 0.25);
o.frequency.exponentialRampToValueAtTime(330, t + 1.2);
[659, 831, 988, 1319, 1661].forEach((f, k) => this._tone(f, 'sine', t + 0.08 + k * 0.07, 0.035, 0.9));
this._noiseBurst(t + 0.05, 0.03, 0.8, 'highpass', 6000);
break;
}
case 'crack':
this._noiseBurst(t, 0.22, 0.05, 'highpass', 1800, 1.5);
this._tone(300 + Math.random() * 160, 'square', t, 0.05, 0.04);
break;
case 'talk':
for (let k = 0; k < 3 + (Math.random() * 3 | 0); k++) this._tone(170 + Math.random() * 90, 'triangle', t + k * 0.09, 0.035, 0.07);
break;
case 'deal':
this._tone(392, 'triangle', t, 0.07, 0.12);
this._tone(523, 'triangle', t + 0.1, 0.07, 0.12);
[988, 1319, 1976].forEach((f, k) => this._tone(f, 'square', t + 0.22 + k * 0.07, 0.04, 0.12));
break;
case 'complaint':
[262, 247, 233].forEach((f, k) => { const o = this._tone(f, 'sawtooth', t + k * 0.14, 0.03, 0.16); o.frequency.exponentialRampToValueAtTime(f * 0.85, t + k * 0.14 + 0.15); });
break;
case 'praise':
[523, 659, 784].forEach((f, k) => this._tone(f, 'triangle', t + k * 0.08, 0.06, 0.35));
break;
case 'squeak': {
const o = this._tone(1700 + Math.random() * 600, 'sine', t, 0.04, 0.09);
o.frequency.exponentialRampToValueAtTime(2600 + Math.random() * 500, t + 0.07);
break;
}
case 'thump':
this._tone(70 + Math.random() * 20, 'sine', t, 0.12, 0.08);
this._noiseBurst(t, 0.04, 0.05, 'lowpass', 400);
break;
case 'munch':
for (let k = 0; k < 3; k++) this._noiseBurst(t + k * 0.08, 0.05, 0.03, 'bandpass', 2200 + Math.random() * 800, 2);
break;
case 'birth':
[1319, 1568, 1976].forEach((f, k) => this._tone(f, 'sine', t + k * 0.06, 0.04, 0.2));
break;
case 'toll':
[1, 2.4, 3.9].forEach((m, k) => this._tone(196 * m, 'sine', t + k * 0.004, 0.08 / (k + 1), 2.2 / (k + 1)));
break;
case 'dig':
this._noiseBurst(t, 0.14, 0.12, 'lowpass', 600);
this._noiseBurst(t + 0.12, 0.08, 0.1, 'lowpass', 900);
break;
case 'snip':
this._noiseBurst(t, 0.12, 0.03, 'highpass', 4000);
this._tone(2400, 'square', t, 0.02, 0.02);
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
function placeToasts() {
if (!toastBox || !toastBox.parentElement) return;
const tour = document.querySelector('.tutor-slot .tutor');
const top = tour ? tour.getBoundingClientRect().bottom - toastBox.parentElement.getBoundingClientRect().top + 6 : 0;
toastBox.style.top = top > 0 ? `${Math.round(top)}px` : '';
}
function toast(title, text = '', iconName = 'star', ms = 3200) {
if (!toastBox) return;
placeToasts();
const t = h('div', { class: 'toast parch' }, icon(iconName), h('div', {}, h('b', { text: title }), text));
toastBox.appendChild(t);
while (toastBox.children.length > 3) toastBox.firstChild.remove();
const out = () => {
if (t.classList.contains('out')) return;
t.classList.add('out');
setTimeout(() => t.remove(), 320);
};
setTimeout(out, ms);
}
function coins(v) {
return (Math.round(v * 10) / 10).toLocaleString('en-US', { maximumFractionDigits: 1 });
}
function starsText(n, max = 5) {
return '★'.repeat(n) + '☆'.repeat(max - n);
}
return { h, btn, clear, setOverlayRoot, modal, confirmDialog, setToastRoot, placeToasts, toast, coins, starsText };
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
// src/materials/profiles.js
const __m11 = (() => {
const { hashString } = __m6;
const ROLE_EFFECTS = {
soot: { toxicity: 3, acidity: -6 },
smoke: { toxicity: 8 },
water: {},
oil: {},
syrup: { vitality: 4 },
spirit: {},
essenceA: { vitality: 18 },
essenceB: { fire: 17 },
essenceC: { arcana: 18 },
binder: { strength: 6 },
salt: {},
ember: { fire: 30, acidity: 8 },
frost: { frost: 30 },
metal: { strength: 10, toxicity: 24 },
crystal: { arcana: 28, transformation: 4 },
wax: { strength: 5 },
fizz: { acidity: 24, transformation: 5 },
spores: { arcana: 14, transformation: 10, vitality: 3 },
resin: { fire: 14, strength: 12 },
starlight: { arcana: 32, love: 6 },
moss: { strength: 26, vitality: 3 },
vapor: { arcana: 8, toxicity: 16 },
phoenix: { fire: 36, vitality: 16, transformation: 10 },
void: { death: 28, arcana: 22, transformation: 10 },
p_elixir: { vitality: 40, strength: 2 },
p_ardent: { fire: 42, love: 4 },
p_arcane: { arcana: 44, transformation: 4 },
p_salve: { strength: 38, vitality: 6 },
p_fizzgas: { transformation: 6, acidity: 4 },
p_spent: { acidity: 6 },
p_caramel: { vitality: 8, fire: 8, love: 8, strength: 5 },
p_panacea: { vitality: 48, arcana: 34, strength: 4 },
p_amalgam: { strength: 36, arcana: 16, toxicity: 10 },
p_phoenix: { vitality: 36, fire: 40, transformation: 12 },
p_varnish: { strength: 34, fire: 12, toxicity: 8 },
p_frostbloom: { frost: 30, arcana: 18, transformation: 6 },
p_lumen: { arcana: 50, vitality: 4, love: 4 },
};
const ROLE_ARCANE = {
soot: [800, 2], smoke: [100, 2], syrup: [380, 2.4],
essenceA: [300, 3.2], essenceB: [450, 3], essenceC: [-150, 3], binder: [200, 2.5],
ember: [600, 2.5], frost: [-650, 2.6], metal: [700, 2.4], crystal: [500, 3], wax: [350, 2.2], fizz: [-100, 2.5],
spores: [250, 3], resin: [900, 2.8], starlight: [-400, 2.8], moss: [550, 3], vapor: [-300, 2.5],
phoenix: [950, 2.4], void: [-900, 2.6],
p_elixir: [260, 2.2], p_ardent: [500, 2], p_arcane: [450, 2], p_salve: [250, 2], p_fizzgas: [-100, 2], p_spent: [-100, 2],
p_caramel: [400, 2], p_panacea: [350, 1.8], p_amalgam: [650, 2], p_phoenix: [900, 2], p_varnish: [700, 2],
p_frostbloom: [-500, 2.2], p_lumen: [100, 1.8],
};
const FX_VERSION = 2;
const ROLE_ELECTRIC = {
water: [0.08, 0], oil: [0, 0], syrup: [0.04, 0], spirit: [0.03, 0], essenceA: [0.1, 0], essenceB: [0.1, 0], essenceC: [0.12, 0],
binder: [0.02, 0], salt: [0.6, 0], ember: [0.35, 0.25], frost: [0.06, 0], metal: [1, 0], crystal: [0.2, 0], wax: [0, 0], fizz: [0.3, 0],
spores: [0.05, 0], resin: [0, 0], starlight: [0.3, 0.2], moss: [0.05, 0], vapor: [0.02, 0], phoenix: [0.4, 0.5], void: [0.25, -0.6],
soot: [0.5, 0], smoke: [0, 0], p_amalgam: [0.9, 0], p_elixir: [0.2, 0], p_arcane: [0.25, 0], p_lumen: [0.35, 0.15], p_phoenix: [0.4, 0.3],
};
function roleOf(id) {
if (id.startsWith('wild-')) return id;
const k = id.lastIndexOf('-');
return k > 0 ? id.slice(0, k) : id;
}
function jitter(seed, id, salt, amp) {
const h = hashString(`${seed}|${id}|${salt}`);
return 1 - amp + ((h % 10007) / 10006) * 2 * amp;
}
function applyProfile(m, seed) {
const role = roleOf(m.id);
const known = ROLE_EFFECTS[role];
if (!m.effects || (known && m.fxv !== FX_VERSION && !m.wild && !role.startsWith('wild-'))) {
const fx = {};
if (known) {
for (const [k, v] of Object.entries(known)) fx[k] = Math.round(v * jitter(seed, m.id, k, 0.1) * 10) / 10;
} else if (m.aspects) {
const keys = ['vitality', 'fire', 'arcana', 'strength'];
m.aspects.forEach((v, i) => { if (v) fx[keys[i]] = v; });
}
m.effects = fx;
if (known) {
const arc = ROLE_ARCANE[role];
m.arcane = arc ? arcaneProfile(seed, m.id, arc[0], arc[1]) : undefined;
if (!arc) delete m.arcane;
m.fxv = FX_VERSION;
}
}
if (!m.arcane && m.effects && Object.values(m.effects).some((v) => Math.abs(Number(v)) >= 1) && !role.startsWith('wild-')) {
m.arcane = arcaneProfile(seed, m.id, 400, 2.2);
}
if (m.econd === undefined) {
const el = ROLE_ELECTRIC[role] || [m.form === 'liquid' ? 0.06 : 0.03, 0];
m.econd = el[0];
m.charge = el[1];
}
return m;
}
function arcaneProfile(seed, id, thr, gain) {
const t = Math.round((thr + (jitter(seed, id, 'arc', 1) - 1) * 60) / 5) * 5;
return { thr: Math.max(-1000, Math.min(1000, t)), gain: Math.round(gain * jitter(seed, id, 'gain', 0.08) * 100) / 100 };
}
return { ROLE_EFFECTS, ROLE_ARCANE, FX_VERSION, ROLE_ELECTRIC, roleOf, jitter, applyProfile, arcaneProfile };
})();
// src/reactions/compatibility.js
const __m14 = (() => {
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
// src/alchemy/effects.js
const __m13 = (() => {
const EFFECTS = [
{ key: 'vitality', label: 'Vitality', icon: 'heart', color: [0.92, 0.3, 0.32], kind: 'magic', desc: 'Healing and life: mends wounds, restores energy.' },
{ key: 'strength', label: 'Strength', icon: 'fist', color: [0.96, 0.76, 0.36], kind: 'magic', desc: 'Might and toughness of body (or of stone).' },
{ key: 'love', label: 'Love', icon: 'rose', color: [1, 0.5, 0.74], kind: 'magic', desc: 'Attraction, affection and calm.' },
{ key: 'arcana', label: 'Arcana', icon: 'eye', color: [0.62, 0.52, 1], kind: 'magic', desc: 'Insight and raw magical potency; makes things shine.' },
{ key: 'transformation', label: 'Transformation', icon: 'swirl', color: [0.4, 0.9, 0.79], kind: 'magic', desc: 'Change of shape, colour or nature.' },
{ key: 'fire', label: 'Fire', icon: 'flame', color: [1, 0.56, 0.3], kind: 'magic', desc: 'Burning warmth. Opposes frost.' },
{ key: 'frost', label: 'Frost', icon: 'snow', color: [0.55, 0.87, 1], kind: 'magic', desc: 'Freezing cold. Opposes fire.' },
{ key: 'acidity', label: 'Acidity', icon: 'acid', color: [0.84, 0.91, 0.45], kind: 'chemical', signed: true, harmful: true, desc: 'Corrosive acid. Negative values are alkaline; acids and alkalis neutralise.' },
{ key: 'toxicity', label: 'Toxicity', icon: 'skull', color: [0.57, 0.8, 0.44], kind: 'chemical', harmful: true, desc: 'Poison. Vitality neutralises it.' },
{ key: 'death', label: 'Death', icon: 'death', color: [0.71, 0.57, 0.93], kind: 'magic', harmful: true, desc: 'Necromantic decay. Opposes vitality.' },
];
const NE = EFFECTS.length;
const EFFECT_KEYS = EFFECTS.map((e) => e.key);
const EFFECT_INDEX = Object.fromEntries(EFFECT_KEYS.map((k, i) => [k, i]));
const EFFECT_BY_KEY = Object.fromEntries(EFFECTS.map((e) => [e.key, e]));
const E = Object.freeze({ VIT: 0, STR: 1, LOVE: 2, ARC: 3, TRANS: 4, FIRE: 5, FROST: 6, ACID: 7, TOX: 8, DEATH: 9 });
const ASPECT_TO_EFFECT = ['vitality', 'fire', 'arcana', 'strength'];
const { compatFactor } = __m14;
const LEACH_WET = 0.12;
const LEACH_DRY = 0.05;
const KNEE = 40;
function effectVector(def) {
const v = new Array(NE).fill(0);
if (def && def.effects) {
for (let k = 0; k < NE; k++) v[k] = Number(def.effects[EFFECT_KEYS[k]]) || 0;
} else if (def && def.aspects) {
for (let a = 0; a < 4; a++) v[EFFECT_INDEX[ASPECT_TO_EFFECT[a]]] += def.aspects[a] || 0;
}
return v;
}
function toRecord(vec) {
const o = {};
for (let k = 0; k < NE; k++) o[EFFECT_KEYS[k]] = Math.round(vec[k] * 10) / 10;
return o;
}
function fromRecord(rec) {
const v = new Array(NE).fill(0);
if (rec) for (let k = 0; k < NE; k++) v[k] = Number(rec[EFFECT_KEYS[k]]) || 0;
return v;
}
function extractedEffects(sp, comp, off, T, out) {
for (let k = 0; k < NE; k++) out[k] = 0;
const n = sp.count;
let tot = 0, liquid = 0, nl = 0;
for (let s = 0; s < n; s++) {
const f = comp[off + s];
if (f <= 0) continue;
tot += f;
if (!sp.isPowder[s] || T >= sp.melt[s]) { liquid += f; liqIdx[nl++] = s; }
}
if (tot <= 1e-9) return 0;
for (let s = 0; s < n; s++) {
const f = comp[off + s];
if (f <= 0) continue;
let avail = f;
if (sp.isPowder[s] && T < sp.melt[s]) {
let solvent = 0;
for (let q = 0; q < nl; q++) {
const l = liqIdx[q];
if (compatFactor(sp.compatA[s], sp.compatB[s], sp.compatA[l], sp.compatB[l]) > 0.5) solvent += comp[off + l];
}
const sol = Math.min(0.9, Math.max(0, sp.solubility[s] + sp.solTemp[s] * (T - 20)));
const dissolved = Math.min(f, sol * solvent * 1.2);
avail = dissolved + (solvent / tot > 0.05 ? LEACH_WET : LEACH_DRY) * (f - dissolved);
}
const base = s * NE;
for (let k = 0; k < NE; k++) {
const e = sp.eff[base + k];
if (e !== 0) out[k] += avail * e;
}
}
const inv = 1 / tot;
for (let k = 0; k < NE; k++) out[k] *= inv;
return liquid / tot;
}
const liqIdx = new Int16Array(64);
const contrib = new Float64Array(32);
function interact(e, laws, trace) {
const nl = Math.min(laws ? laws.length : 0, contrib.length);
for (let r = 0; r < nl; r++) {
const L = laws[r];
const a = e[L.a], b = L.kind === 'suppress' ? Math.abs(e[L.b]) : e[L.b];
contrib[r] = 0;
if (a <= L.min || b <= L.min) continue;
if (L.kind === 'transmute') {
const amt = Math.min(L.k * Math.sqrt((a - L.min) * (b - L.min)), 0.8 * Math.min(a, b));
contrib[r] = amt;
} else if (L.kind === 'catalyse') {
contrib[r] = Math.min(1, (b - L.min) / Math.max(1, 3 * L.min)) * L.k * a;
} else {
contrib[r] = Math.min(a, L.k * b);
}
}
for (let r = 0; r < nl; r++) {
const amt = contrib[r];
if (amt <= 0) continue;
const L = laws[r];
if (L.kind === 'transmute') {
e[L.a] -= amt * 0.5;
e[L.b] -= amt * 0.5;
e[L.c] += amt * 1.15;
} else if (L.kind === 'catalyse') {
e[L.a] += amt;
} else {
e[L.a] -= amt;
}
if (trace) trace[r] += amt;
}
let m = Math.min(e[E.FIRE], e[E.FROST]);
if (m > 0) { e[E.FIRE] -= m; e[E.FROST] -= m; }
m = Math.min(e[E.VIT], e[E.DEATH]);
if (m > 0) { e[E.VIT] -= m; e[E.DEATH] -= m; }
m = Math.min(e[E.VIT] * 0.5, e[E.TOX]);
if (m > 0) { e[E.TOX] -= m; e[E.VIT] -= 2 * m; }
for (let k = 0; k < NE; k++) {
let v = e[k];
if (k !== E.ACID && v < 0) v = 0;
const s = v < 0 ? -1 : 1, av = Math.abs(v);
e[k] = av <= KNEE ? v : s * (KNEE + 60 * (1 - Math.exp(-(av - KNEE) / 60)));
}
return e;
}
const scratch = new Float64Array(NE);
function compositionEffects(sp, comp, off, T, laws, out, trace) {
extractedEffects(sp, comp, off, T, scratch);
for (let k = 0; k < NE; k++) out[k] = scratch[k];
interact(out, laws, trace);
return out;
}
function theoryOf(parts, lookup, knownLaws = []) {
const v = new Float64Array(NE);
let tot = 0;
for (const p of parts) tot += p.ml;
if (tot <= 0) return v;
for (const p of parts) {
const d = lookup(p.id);
if (!d || d.remains) continue;
const ev = effectVector(d);
for (let k = 0; k < NE; k++) v[k] += (ev[k] * p.ml) / tot;
}
return interact(v, knownLaws);
}
function sampleEffects(sim, indices) {
const p = sim.p, sp = sim.species, laws = sim.laws || [], S = p.S;
const sum = new Float64Array(NE);
const trace = new Float64Array(laws.length);
const one = new Float64Array(NE);
const n = indices.length;
for (let q = 0; q < n; q++) {
const i = indices[q];
compositionEffects(sp, p.comp, i * S, p.temp[i], laws, one, trace);
for (let k = 0; k < NE; k++) sum[k] += one[k];
}
if (n) {
for (let k = 0; k < NE; k++) sum[k] /= n;
for (let r = 0; r < trace.length; r++) trace[r] /= n;
}
return { effects: sum, resonance: trace };
}
function dominantEffect(v, min = 2) {
let best = -1, bv = min;
for (let k = 0; k < NE; k++) {
const x = k === E.ACID ? Math.abs(v[k]) : v[k];
if (x > bv) { bv = x; best = k; }
}
return best;
}
function potencyWord(v, key) {
if (key === 'acidity' && v < -2) return v < -25 ? 'strongly alkaline' : 'alkaline';
const a = Math.abs(v);
if (a < 2) return 'none';
if (a < 8) return 'trace';
if (a < 20) return 'mild';
if (a < 40) return 'strong';
return 'intense';
}
return { EFFECTS, NE, EFFECT_KEYS, EFFECT_INDEX, EFFECT_BY_KEY, E, ASPECT_TO_EFFECT, effectVector, toRecord, fromRecord, extractedEffects, interact, compositionEffects, theoryOf, sampleEffects, dominantEffect, potencyWord };
})();
// src/materials/wild.js
const __m12 = (() => {
const { Rng } = __m6;
const { hslToRgb } = __m8;
const { completeMaterial } = __m9;
const { EFFECT_INDEX } = __m13;
const { arcaneProfile } = __m11;
const WILD_SPECS = [
{ key: 'ironroot', noun: 'Ironroot', shape: 'root', region: 'forest', rank: 0, buy: 1, hue: [28, 0.45, 0.42], form: 'solid', density: 1.05, hardness: 0.5, sol: 0.12, solT: 0.0022,
fx: { strength: 26, frost: 9 }, arc: [560, 3], price: 9, gather: 'dig', lore: 'A knotted woodland root that carries strength — and a cold, earthy chill that needs something fiery to cancel it. Crush or grind it; it gives up far more when steeped in hot water.' },
{ key: 'silverleaf', noun: 'Silverleaf', shape: 'leaf', region: 'forest', rank: 0, buy: 1, hue: [150, 0.25, 0.7], form: 'solid', density: 0.72, hardness: 0.22, sol: 0.18, solT: 0.0015,
fx: { vitality: 24, frost: 8 }, arc: [550, 3], price: 9, gather: 'pick', lore: 'Soft silvery leaves prized by healers. They heal, but leave a frosty bite that a warming herb must cancel. Gentle warmth draws out their healing.' },
{ key: 'nightshade', noun: 'Nightshade', shape: 'leaf', region: 'forest', rank: 0, buy: null, hue: [285, 0.45, 0.42], form: 'solid', density: 1.12, hardness: 0.25, sol: 0.16, solT: 0.001, compat: [0.55, 0.22],
fx: { toxicity: 28, death: 12, acidity: 5 }, arc: [350, 2.5], price: 12, gather: 'pick', dusk: true,
steep: { name: 'Nightshade Tincture', into: 'spirit', lo: [20, 25], hi: [60, 65] },
lore: 'A poisonous leaf, gathered at dusk. Its oily extract dissolves in spirits rather than water. Test tiny doses before you trust it.' },
{ key: 'emberbark', noun: 'Emberbark', shape: 'bark', region: 'forest', rank: 0, buy: 1, hue: [12, 0.55, 0.36], form: 'solid', density: 0.88, hardness: 0.4, sol: 0.12, solT: 0.002,
fx: { fire: 22, toxicity: 7 }, arc: [560, 2.8], price: 8, gather: 'scrape',
steep: { name: 'Emberbark Tea', into: 'water', lo: [45, 50], hi: [85, 90] },
lore: 'Resinous red bark that smoulders in the mouth. It warms, but its sap is a little poisonous: something healing must mend the bite.' },
{ key: 'owlberry', noun: 'Owlberry', shape: 'berry', region: 'forest', rank: 0, buy: null, hue: [330, 0.55, 0.38], form: 'solid', density: 0.98, hardness: 0.12, sol: 0.22, solT: 0.0012,
fx: { love: 20, toxicity: 6, fire: 5 }, arc: [380, 3], price: 9, gather: 'pick',
steep: { name: 'Owlberry Cordial', into: 'water', lo: [30, 35], hi: [65, 70] },
lore: 'Dark berries the owls guard jealously. Sweet with affection, warm on the tongue and faintly poisonous.' },
{ key: 'witchear', noun: 'Witch’s Ear', shape: 'bracket', region: 'forest', rank: 1, buy: 2, hue: [32, 0.35, 0.3], form: 'solid', density: 0.8, hardness: 0.3, sol: 0.15, solT: 0.0012,
fx: { arcana: 20, death: 7 }, arc: [420, 3], price: 14, gather: 'scrape',
steep: { name: 'Witch’s Ear Broth', into: 'water', lo: [25, 30], hi: [60, 65] },
lore: 'A leathery shelf fungus that grows on dead oaks. It sharpens the mind but carries the dead tree’s chill of decay; life cancels it.' },
{ key: 'mandrake', noun: 'Mandrake', shape: 'root', region: 'forest', rank: 2, buy: null, hue: [38, 0.5, 0.6], form: 'solid', density: 1.15, hardness: 0.45, sol: 0.12, solT: 0.0015, rare: true,
fx: { transformation: 34, strength: 12, toxicity: 7 }, arc: [420, 3], price: 30, gather: 'dig', lore: 'A rare screaming root of transformation, with strength in it and a poisonous skin. Old grimoires say it wakes fully only in warm spirits.' },
{ key: 'heartpetal', noun: 'Heartpetal', shape: 'petal', region: 'meadow', rank: 0, buy: 1, hue: [335, 0.6, 0.72], form: 'solid', density: 0.6, hardness: 0.15, sol: 0.2, solT: 0.001,
fx: { love: 26, fire: 6 }, arc: null, price: 10, gather: 'pick',
steep: { name: 'Heartpetal Infusion', into: 'water', lo: [30, 35], hi: [60, 65] },
lore: 'Soft meadow petals carrying affection — and the flush of passion, a little fire that something cool must cancel. Warm water draws out their love; strong heat spoils them. Too delicate to hold awakened magic.' },
{ key: 'sunthistle', noun: 'Sunthistle', shape: 'flower', region: 'meadow', rank: 0, buy: 1, hue: [45, 0.8, 0.55], form: 'solid', density: 0.8, hardness: 0.3, sol: 0.15, solT: 0.0015,
fx: { fire: 16, vitality: 8 }, arc: [520, 2.8], price: 9, gather: 'pick',
steep: { name: 'Sunthistle Tea', into: 'water', lo: [40, 45], hi: [80, 85] },
lore: 'A prickly golden flower that warms the blood and lifts the spirits. It brews into a fiery, restoring tea.' },
{ key: 'nettle', noun: 'Nettle', shape: 'sprig', region: 'meadow', rank: 0, buy: 1, hue: [105, 0.5, 0.4], form: 'solid', density: 0.74, hardness: 0.2, sol: 0.17, solT: 0.0015,
fx: { strength: 16, acidity: 10 }, arc: [560, 3], price: 7, gather: 'pick',
steep: { name: 'Nettle Tea', into: 'water', lo: [45, 50], hi: [85, 90] },
lore: 'Stinging hedgerow nettles. Steeped hot they give strength, and the sting of their acid — chalk or another alkali settles it.' },
{ key: 'dreamclover', noun: 'Dreamclover', shape: 'clover', region: 'meadow', rank: 1, buy: null, hue: [205, 0.45, 0.62], form: 'solid', density: 0.7, hardness: 0.18, sol: 0.16, solT: 0.0012, rare: true,
fx: { arcana: 16, frost: 7, vitality: 4 }, arc: [250, 3], price: 18, gather: 'pick', dawn: true,
steep: { name: 'Dreamclover Tea', into: 'water', lo: [30, 35], hi: [60, 65] },
lore: 'A rare blue clover, open only at dawn, that brings vivid dreams and clear insight, with a cool and gently healing aftertaste.' },
{ key: 'beebalm', noun: 'Bee Balm', shape: 'spike', region: 'meadow', rank: 1, buy: 2, hue: [300, 0.5, 0.6], form: 'solid', density: 0.66, hardness: 0.15, sol: 0.19, solT: 0.0012,
fx: { vitality: 14, love: 10, acidity: -6 }, arc: [480, 3], price: 12, gather: 'pick',
steep: { name: 'Balm Tea', into: 'water', lo: [35, 40], hi: [70, 75] },
lore: 'Shaggy purple flower-spikes humming with bees: a gentle balm for body and heart, with a soft alkaline aftertaste.' },
{ key: 'hemlock', noun: 'Hemlock Seed', shape: 'seed', region: 'meadow', rank: 1, buy: null, hue: [70, 0.25, 0.5], form: 'solid', density: 1.1, hardness: 0.35, sol: 0.14, solT: 0.0015,
fx: { death: 20, frost: 8, toxicity: 6 }, arc: [450, 2.6], price: 14, gather: 'pick', dusk: true,
steep: { name: 'Hemlock Draught', into: 'water', lo: [20, 25], hi: [50, 55] },
lore: 'Ribbed grey seeds of the spotted hemlock, gathered at dusk. A cold, creeping death with a little poison in it.' },
{ key: 'riverchalk', noun: 'River Chalk', shape: 'stone', region: 'river', rank: 0, buy: 1, hue: [48, 0.22, 0.82], form: 'solid', density: 1.32, hardness: 0.35, sol: 0.06, solT: 0.0005, binder: 0.55, friction: 0.7,
fx: { acidity: -24, frost: 6 }, arc: [350, 2.5], price: 6, gather: 'dig',
steep: { name: 'Chalk Milk', into: 'water', lo: [15, 20], hi: [60, 65] },
lore: 'Soft, cold alkaline chalk from the bank. It neutralises acids. Ground and stirred into water it clouds into chalk milk; a little water kneads it into a paste.' },
{ key: 'frostcap', noun: 'Frostcap', shape: 'cap', region: 'river', rank: 0, buy: 1, hue: [196, 0.5, 0.72], form: 'solid', density: 0.95, hardness: 0.25, sol: 0.17, solT: 0.0012,
fx: { frost: 24, death: 6 }, arc: [520, 2.8], price: 10, gather: 'pick',
steep: { name: 'Frostcap Brine', into: 'water', lo: [1, 2], hi: [12, 14] },
lore: 'A cool mushroom growing beneath the willows, with a breath of the grave about it. It steeps only in ice-cold water, giving a freezing brine.' },
{ key: 'bogbean', noun: 'Bogbean', shape: 'bean', region: 'river', rank: 0, buy: null, hue: [95, 0.4, 0.42], form: 'solid', density: 1.0, hardness: 0.3, sol: 0.2, solT: 0.0015,
fx: { vitality: 14, acidity: 8 }, arc: [400, 2.5], price: 7, gather: 'pick',
steep: { name: 'Bogbean Broth', into: 'water', lo: [40, 45], hi: [80, 85] },
lore: 'A marsh bean: restorative, though sour with bog acid unless something alkaline settles it.' },
{ key: 'willowbark', noun: 'Willow Bark', shape: 'bark', region: 'river', rank: 0, buy: 1, hue: [60, 0.18, 0.55], form: 'solid', density: 0.85, hardness: 0.4, sol: 0.12, solT: 0.002,
fx: { frost: 14, vitality: 6, acidity: 7 }, arc: [560, 2.6], price: 7, gather: 'scrape',
steep: { name: 'Willow Tea', into: 'water', lo: [40, 45], hi: [80, 85] },
lore: 'Pale grey bark that cools fevers and soothes, bitter with acid.' },
{ key: 'reedmace', noun: 'Reedmace', shape: 'reed', region: 'river', rank: 0, buy: null, hue: [26, 0.5, 0.3], form: 'solid', density: 0.7, hardness: 0.25, sol: 0.16, solT: 0.0015,
fx: { strength: 13, acidity: -7, frost: 5 }, arc: [520, 2.8], price: 7, gather: 'scrape',
steep: { name: 'Reed Pith Broth', into: 'water', lo: [35, 40], hi: [80, 85] },
lore: 'Brown velvet heads on tall stems. The pith gives a steady strength, chalky and cool.' },
{ key: 'riverpearl', noun: 'River Pearl', shape: 'shell', region: 'river', rank: 1, buy: 2, hue: [210, 0.15, 0.85], form: 'solid', density: 1.6, hardness: 0.55, sol: 0.08, solT: 0.002,
fx: { arcana: 14, acidity: -12 }, arc: [560, 3], price: 16, gather: 'pick',
steep: { name: 'Nacre Milk', into: 'water', lo: [50, 55], hi: [85, 90] },
lore: 'Mussel shells lined with mother-of-pearl. Ground and simmered, the nacre gives insight — and a strongly alkaline milk.' },
{ key: 'emberflint', noun: 'Ember Flint', shape: 'stone', region: 'quarry', rank: 0, buy: 1, hue: [16, 0.62, 0.55], form: 'solid', density: 1.6, hardness: 0.7, sol: 0.05, solT: 0.003,
fx: { fire: 26, acidity: 12 }, arc: [820, 2.5], price: 11, gather: 'mine',
steep: { name: 'Flint Fire-Water', into: 'water', lo: [80, 85], hi: [160, 170] },
lore: 'A warm flint that releases fire, and a sharp acid with it, when ground. It barely dissolves unless the water is near boiling.' },
{ key: 'mica', noun: 'Mica Dust', shape: 'powder', region: 'quarry', rank: 0, buy: 1, hue: [270, 0.25, 0.75], form: 'powder', density: 1.22, hardness: 0.3, sol: 0.16, solT: 0.001, binder: 0.4, friction: 0.66,
fx: { transformation: 18, acidity: -6 }, arc: [500, 3], price: 7, gather: 'sweep',
steep: { name: 'Mica Shimmer', into: 'water', lo: [40, 45], hi: [85, 90] },
lore: 'Naturally loose glittering grains of change, faintly alkaline. Knead with a little water for dough; warm plenty of water with it for a shimmering infusion.' },
{ key: 'saltpetre', noun: 'Saltpetre', shape: 'crust', region: 'quarry', rank: 0, buy: 1, hue: [190, 0.12, 0.88], form: 'powder', density: 1.9, hardness: 0.3, sol: 0.3, solT: 0.004, friction: 0.6,
fx: { frost: 16, acidity: 7 }, arc: [540, 2.6], price: 6, gather: 'sweep',
lore: 'Cold white crystals that bloom on cave walls. They dissolve readily and chill whatever they touch, with a sour edge.' },
{ key: 'sulfur', noun: 'Sulphur Crust', shape: 'powder', region: 'quarry', rank: 1, buy: 2, hue: [56, 0.85, 0.6], form: 'powder', density: 1.4, hardness: 0.3, sol: 0.22, solT: 0.0015, friction: 0.6,
fx: { acidity: 26, fire: 7, toxicity: 5 }, arc: [500, 2.5], price: 10, gather: 'mine',
steep: { name: 'Sulphur Water', into: 'water', lo: [50, 55], hi: [95, 100] },
lore: 'A crumbly yellow crust. Strongly acidic, it etches stone and stings flesh. Hot water dissolves it into a biting acid.' },
{ key: 'lodestone', noun: 'Lodestone', shape: 'nugget', region: 'quarry', rank: 1, buy: 2, hue: [220, 0.08, 0.3], form: 'solid', density: 2.4, hardness: 0.75, sol: 0.06, solT: 0.003,
fx: { strength: 20, toxicity: 6, frost: 5 }, arc: [760, 2.6], price: 13, gather: 'mine',
steep: { name: 'Rust Water', into: 'water', lo: [70, 75], hi: [150, 160] },
lore: 'A heavy, magnetic black nugget. Its iron gives great strength but rusts into a cold, faintly poisonous water.' },
{ key: 'cinnabar', noun: 'Cinnabar', shape: 'crystal', region: 'quarry', rank: 1, buy: null, hue: [358, 0.7, 0.42], form: 'solid', density: 2.2, hardness: 0.5, sol: 0.08, solT: 0.002,
fx: { transformation: 18, toxicity: 10, fire: 4 }, arc: [620, 2.8], price: 15, gather: 'mine',
steep: { name: 'Cinnabar Tincture', into: 'spirit', lo: [30, 35], hi: [60, 65] },
lore: 'Blood-red crystals of quicksilver ore. Powerfully transforming and poisonous; it dissolves in warm spirits.' },
{ key: 'stormglass', noun: 'Storm Glass', shape: 'shard', region: 'quarry', rank: 2, buy: null, hue: [222, 0.55, 0.7], form: 'solid', density: 1.9, hardness: 0.65, sol: 0.08, solT: 0.0015, rare: true,
fx: { arcana: 12, transformation: 6, fire: 6 }, arc: [-600, 3], econd: 0.6, charge: 1, glow: 0.3, price: 28, gather: 'mine', lore: 'Glass struck by lightning: insight, change and a crackle of fire. It still holds a charge that flows into anything that conducts.' },
{ key: 'gravemoss', noun: 'Grave Moss', shape: 'moss', region: 'moonfen', rank: 2, buy: null, hue: [150, 0.12, 0.45], form: 'solid', density: 0.85, hardness: 0.2, sol: 0.16, solT: 0.0012,
fx: { death: 34, frost: 8, toxicity: 12 }, arc: [-700, 2.5], price: 26, gather: 'scrape', dusk: true,
steep: { name: 'Barrow Draught', into: 'water', lo: [-5, 0], hi: [10, 12] },
lore: 'Moss from old barrows, heavy with death magic, scraped at dusk. It steeps only in near-freezing water. Dilute generously and test carefully.' },
{ key: 'starquartz', noun: 'Star Quartz', shape: 'crystal', region: 'moonfen', rank: 2, buy: null, hue: [280, 0.45, 0.78], form: 'solid', density: 1.5, hardness: 0.65, sol: 0.1, solT: 0.002, glow: 0.5,
fx: { arcana: 26, love: 14, frost: 5 }, arc: [-400, 3], price: 30, gather: 'mine', lore: 'A luminous crystal of love and insight, cool to the touch. Crush it, then warm it in spirits.' },
{ key: 'wisplichen', noun: 'Wisp Lichen', shape: 'moss', region: 'moonfen', rank: 2, buy: null, hue: [172, 0.6, 0.6], form: 'solid', density: 0.7, hardness: 0.15, sol: 0.18, solT: 0.001, glow: 0.7,
fx: { arcana: 28, frost: 7, toxicity: 4 }, arc: [-250, 3], price: 24, gather: 'scrape',
steep: { name: 'Lichen Glow', into: 'water', lo: [15, 20], hi: [45, 50] },
lore: 'A faintly glowing lichen that the wisps feed on, cold and a little poisonous. Lukewarm water draws out its light.' },
{ key: 'moonlily', noun: 'Moonlily', shape: 'lily', region: 'moonfen', rank: 2, buy: null, hue: [240, 0.3, 0.86], form: 'solid', density: 0.62, hardness: 0.12, sol: 0.2, solT: 0.001, glow: 0.4,
fx: { vitality: 30, frost: 12, acidity: -4 }, arc: [-300, 3], price: 22, gather: 'pick', dawn: true,
steep: { name: 'Moonlily Dew', into: 'water', lo: [10, 15], hi: [40, 45] },
lore: 'A pale lily that opens to the moon and closes at sunrise; gather it at dawn. Deeply healing, and cold as a winter night.' },
{ key: 'toadstool', noun: 'Toadstool', shape: 'toadstool', region: 'moonfen', rank: 2, buy: null, hue: [5, 0.75, 0.48], form: 'solid', density: 0.9, hardness: 0.2, sol: 0.18, solT: 0.0012,
fx: { transformation: 28, toxicity: 9, death: 5 }, arc: [-350, 2.8], price: 20, gather: 'pick',
steep: { name: 'Toadstool Broth', into: 'water', lo: [20, 25], hi: [50, 55] },
lore: 'A red, white-spotted toadstool from the fairy rings. It changes whoever eats it — and poisons them a little.' },
{ key: 'sirenreed', noun: 'Siren Reed', shape: 'reed', region: 'moonfen', rank: 2, buy: null, hue: [180, 0.35, 0.5], form: 'solid', density: 0.66, hardness: 0.2, sol: 0.18, solT: 0.0012,
fx: { love: 28, frost: 8, toxicity: 6 }, arc: [-200, 3], price: 20, gather: 'scrape', dusk: true,
steep: { name: 'Siren Water', into: 'water', lo: [15, 20], hi: [45, 50] },
lore: 'Reeds that sing to travellers at dusk. Their pith enchants the heart, coldly, and with a trace of poison.' },
{ key: 'dragonpepper', noun: 'Dragon Pepper', shape: 'pepper', region: 'crags', rank: 3, buy: null, hue: [4, 0.8, 0.5], form: 'solid', density: 0.9, hardness: 0.3, sol: 0.18, solT: 0.0015,
fx: { fire: 34, strength: 14, toxicity: 4 }, arc: [850, 2.6], price: 32, gather: 'pick', lore: 'A furious red pepper from the crags, with strength in its heat and a poisonous sting. Its fire loves oil.' },
{ key: 'cinderscale', noun: 'Cinder Scale', shape: 'scale', region: 'crags', rank: 3, buy: null, hue: [24, 0.7, 0.4], form: 'solid', density: 1.45, hardness: 0.6, sol: 0.07, solT: 0.003, rare: true,
fx: { fire: 22, transformation: 18, vitality: 6 }, arc: [1000, 2.6], econd: 0.3, charge: 0.4, price: 40, gather: 'mine',
steep: { name: 'Salamander Essence', into: 'oil', lo: [140, 150], hi: [300, 320] },
lore: 'A shed salamander scale, warm to the touch. Only fierce heat — hot oil, not water — dissolves it.' },
{ key: 'ashbloom', noun: 'Ashbloom', shape: 'lily', region: 'crags', rank: 3, buy: null, hue: [20, 0.85, 0.6], form: 'solid', density: 0.7, hardness: 0.15, sol: 0.18, solT: 0.0015, glow: 0.3,
fx: { vitality: 30, fire: 12, acidity: 6 }, arc: [560, 2.8], price: 30, gather: 'pick',
steep: { name: 'Ashbloom Tea', into: 'water', lo: [45, 50], hi: [85, 90] },
lore: 'A flower that blooms in warm ash after an eruption. It heals and burns, with a smoky acid note.' },
{ key: 'obsidian', noun: 'Obsidian', shape: 'shard', region: 'crags', rank: 3, buy: null, hue: [265, 0.3, 0.16], form: 'solid', density: 2.35, hardness: 0.8, sol: 0.06, solT: 0.002,
fx: { strength: 32, death: 8, fire: 6 }, arc: [900, 2.6], price: 34, gather: 'mine',
steep: { name: 'Obsidian Water', into: 'water', lo: [75, 80], hi: [150, 160] },
lore: 'Black volcanic glass with an edge like a razor: unyielding strength, a smouldering heat and a whisper of death. It gives itself up only to water near the boil.' },
];
const WILD_BY_KEY = Object.fromEntries(WILD_SPECS.map((s) => [s.key, s]));
const PREFIX = ['Moss', 'Moon', 'Dusk', 'Ember', 'Witch', 'Frost', 'Star', 'Thorn', 'Dew', 'Raven', 'Old', 'Hollow'];
const r2 = (v) => Math.round(v * 100) / 100;
const WILD_FX_VERSION = 4;
function generateWild(seed, base) {
const rng = new Rng('wild:' + seed);
const used = new Set(base.materials.filter((m) => !m.id.startsWith('wild-')).map((m) => m.name));
const materials = [];
const ids = {};
for (const s of WILD_SPECS) {
const id = 'wild-' + s.key;
const [h, sat, l] = s.hue;
const color = hslToRgb((h + rng.range(-8, 8) + 360) % 360, Math.min(1, sat * rng.range(0.9, 1.1)), Math.min(0.92, l * rng.range(0.94, 1.06)));
let name = '';
const prefixes = PREFIX.filter((w) => !s.noun.includes(w));
for (let tries = 0; tries < 12 && (!name || used.has(name)); tries++) name = `${rng.pick(prefixes)} ${s.noun}`;
if (used.has(name)) name = s.noun;
used.add(name);
const fx = {};
for (const [k, v] of Object.entries(s.fx)) fx[k] = Math.round(v * rng.range(0.9, 1.1) * 10) / 10;
const m = completeMaterial({
id, name, archetype: 'wild', form: /** @type {any} */ (s.form), color, tint: 0.75, opacity: 1,
density: r2(s.density * rng.range(0.97, 1.03)), compat: s.compat ? s.compat.slice() : [r2(rng.range(0.8, 0.84)), r2(rng.range(0.12, 0.16))],
friction: s.friction ?? r2(rng.range(0.62, 0.72)), binder: s.binder ?? 0, hardness: s.hardness,
solubility: r2(s.sol * rng.range(0.9, 1.1)), solubilityTemp: s.solT, melt: 1500, boil: Infinity,
heatCapacity: 1.7, conductivity: 0.35, flammability: s.region === 'quarry' ? 0 : 0.45, ignition: Math.round(rng.range(260, 320)), combustionHeat: 500,
ash: base.roles.soot, smoke: base.roles.smoke, glow: s.glow || 0, reactivity: 0.3,
price: s.price, tier: s.buy === null ? 99 : s.buy, product: false, description: s.lore,
});
const mm = /** @type {any} */ (m);
mm.effects = fx;
if (s.arc) mm.arcane = arcaneProfile(seed, id, s.arc[0], s.arc[1]);
mm.fxv = WILD_FX_VERSION;
mm.econd = s.econd ?? 0.04;
mm.charge = s.charge ?? 0;
mm.wild = { key: s.key, shape: s.shape, region: s.region, rank: s.rank, rare: !!s.rare, gatherOnly: s.buy === null, gather: s.gather || 'pick', dusk: !!s.dusk, dawn: !!s.dawn };
if (s.form === 'solid') mm.crushable = true;
materials.push(m);
ids[s.key] = id;
}
const reactions = [];
const t5 = (lo, hi) => Math.round(rng.range(lo, hi) / 5) * 5;
const product = (key, from, props, fx) => {
const src = materials.find((m) => m.id === ids[from]);
if (!fx) {
const k = 1.08 * rng.range(0.97, 1.03);
fx = Object.fromEntries(Object.entries(/** @type {any} */ (src).effects).map(([e, v]) => [e, Math.round(Number(v) * k * 10) / 10]));
}
const m = completeMaterial({
id: 'wild-p-' + key, archetype: 'product', tint: 0.85, opacity: 0.85, heatCapacity: 3.6, boil: Infinity, melt: -20,
viscosity: 2.5, compat: src.compat.slice(), price: 0, tier: 99, product: true, density: src.density,
form: 'liquid', color: src.color.map((c) => r2(c * 0.85)), ...props,
});
const mm = /** @type {any} */ (m);
mm.econd = 0.12;
mm.charge = 0;
mm.effects = fx;
mm.arcane = { ...(/** @type {any} */ (src).arcane) };
mm.fxv = WILD_FX_VERSION;
materials.push(m);
return m;
};
const water = base.roles.water, spirit = base.roles.spirit, oil = base.roles.oil;
const nm = (k) => materials.find((m) => m.id === ids[k]).name;
const short = (k) => nm(k).split(' ').slice(-1)[0];
const steepedRoot = product('steeped-ironroot', 'ironroot', { name: `Steeped ${nm('ironroot')}`, description: 'A dark root extract: all of the root’s strength, and its chill, fully in solution.' });
reactions.push({ id: 'rw_steep_root', name: steepedRoot.name, kind: 'decompose', a: ids.ironroot, b: null, ra: 1, rb: 0, products: [{ id: steepedRoot.id, frac: 1 }],
minT: t5(60, 70), maxT: 160, rate: 0.09, heat: -5, stir: 0.3, wet: true, hint: `Ground ${nm('ironroot')} steeps into a liquid extract in hot water.` });
const infusion = product('silver-infusion', 'silverleaf', { name: `${nm('silverleaf')} Infusion`, description: 'A pale, fragrant healing infusion with a frosty edge.' });
reactions.push({ id: 'rw_infuse_leaf', name: infusion.name, kind: 'decompose', a: ids.silverleaf, b: null, ra: 1, rb: 0, products: [{ id: infusion.id, frac: 1 }],
minT: t5(45, 55), maxT: t5(85, 95), rate: 0.1, heat: -5, stir: 0.3, wet: true, hint: `${nm('silverleaf')} infuses in warm (not boiling) water.` });
const wilted = product('wilted-petal', 'heartpetal', { name: `Wilted ${nm('heartpetal')}`, color: [0.45, 0.32, 0.3], description: 'Scorched petals: the love is gone and bitterness remains.' }, { love: 6, toxicity: 9 });
delete /** @type {any} */ (wilted).arcane;
reactions.push({ id: 'rw_wilt_petal', name: wilted.name, kind: 'decompose', a: ids.heartpetal, b: null, ra: 1, rb: 0, products: [{ id: wilted.id, frac: 1 }],
minT: t5(78, 88), maxT: 400, rate: 0.12, heat: 0, stir: 0.2, hint: `Strong heat spoils ${nm('heartpetal')}.` });
const mandrakeT = product('mandrake-tincture', 'mandrake', { name: `${nm('mandrake')} Tincture`, compat: [0.62, 0.16], description: 'The waking root dissolved in warm spirit.' });
reactions.push({ id: 'rw_mandrake', name: mandrakeT.name, kind: 'mix', a: ids.mandrake, b: spirit, ra: 1, rb: 2, products: [{ id: mandrakeT.id, frac: 1 }],
minT: t5(35, 45), maxT: t5(70, 75), rate: 0.25, heat: 10, stir: 0.8, hint: `${nm('mandrake')} wakes in warm spirit.` });
const starT = product('starlit-tincture', 'starquartz', { name: `Starlit ${short('starquartz')} Tincture`, compat: [0.62, 0.16], glow: 0.7, description: 'Crushed quartz dissolved in warm spirit; it glimmers.' });
reactions.push({ id: 'rw_starquartz', name: starT.name, kind: 'mix', a: ids.starquartz, b: spirit, ra: 1, rb: 2, products: [{ id: starT.id, frac: 1 }],
minT: t5(35, 45), maxT: t5(70, 80), rate: 0.25, heat: 8, stir: 0.8, hint: `Crushed ${nm('starquartz')} dissolves in warm spirit.` });
const dragonOil = product('dragonfire-oil', 'dragonpepper', { name: 'Dragonfire Oil', compat: [0.16, 0.11], color: [0.85, 0.25, 0.08], flammability: 0.7, ignition: 240, combustionHeat: 900,
ash: base.roles.soot, smoke: base.roles.smoke, description: 'Pepper fire carried in oil.' });
reactions.push({ id: 'rw_dragonoil', name: dragonOil.name, kind: 'contact', a: ids.dragonpepper, b: oil, ra: 1, rb: 1, products: [{ id: dragonOil.id, frac: 1 }],
minT: t5(30, 40), maxT: 220, rate: 0.4, heat: 20, stir: 1, hint: `Ground ${nm('dragonpepper')} pours its fire into warm oil.` });
const gypsum = product('gypsum', 'riverchalk', { name: 'Gypsum Grit', form: 'powder', color: [0.9, 0.88, 0.82], friction: 0.68, solubility: 0.02, melt: 1500, viscosity: 1,
description: 'The neutral grit left where acid met chalk: whatever either carried is spent.' }, {});
reactions.push({ id: 'rw_neutralise', name: 'Neutralisation', kind: 'contact', a: ids.riverchalk, b: ids.sulfur, ra: 1, rb: 1, products: [{ id: gypsum.id, frac: 1 }],
minT: -10, maxT: 400, rate: 0.5, heat: 60, stir: 1, wet: true, hint: `${nm('riverchalk')} fizzes where it meets ${nm('sulfur')} and both turn to neutral grit.` });
for (const s of WILD_SPECS) {
if (!s.steep) continue;
const st = s.steep;
const solvent = st.into === 'spirit' ? spirit : st.into === 'oil' ? oil : water;
const solv = base.materials.find((m) => m.id === solvent);
const ext = product(`extract-${s.key}`, s.key, {
name: st.name, ...(solv ? { compat: solv.compat.slice() } : {}),
description: `The magic of ${nm(s.key)} drawn into ${st.into === 'water' ? 'water' : st.into}.`,
});
const lo = t5(st.lo[0], st.lo[1]), hi = t5(st.hi[0], st.hi[1]);
const where = st.into === 'water' ? '' : ` in ${st.into}`;
const window = lo <= 15 ? `only when chilled below ${hi}°C` : `between about ${lo} and ${hi}°C`;
if (st.into === 'water') {
reactions.push({ id: `rw_extract_${s.key}`, name: ext.name, kind: 'decompose', a: ids[s.key], b: null, ra: 1, rb: 0, products: [{ id: ext.id, frac: 1 }],
minT: lo, maxT: hi, rate: 0.1, heat: -4, stir: 0.4, wet: true, hint: `Ground ${nm(s.key)} steeps into water ${window}.` });
} else {
reactions.push({ id: `rw_extract_${s.key}`, name: ext.name, kind: st.into === 'oil' ? 'contact' : 'mix', a: ids[s.key], b: solvent, ra: 1, rb: 1, products: [{ id: ext.id, frac: 1 }],
minT: lo, maxT: hi, rate: 0.25, heat: 4, stir: 0.8, hint: `${nm(s.key)} dissolves${where} ${window}.` });
}
}
return { materials, reactions, ids, laws: generateLaws(seed) };
}
const LAW_TEMPLATES = [
{ id: 'forged', name: 'Forged Vigour', kind: 'catalyse', a: 'strength', b: 'fire', k: [0.45, 0.7], lore: 'A touch of fire tempers strength and makes it stronger.' },
{ id: 'blessed', name: 'Blessed Life', kind: 'catalyse', a: 'vitality', b: 'arcana', k: [0.4, 0.6], lore: 'Arcana amplifies healing.' },
{ id: 'enchant', name: 'Enchantment', kind: 'transmute', a: 'love', b: 'arcana', c: 'transformation', k: [0.5, 0.75], lore: 'Love and arcana together become transformation.' },
{ id: 'venom', name: 'Burning Venom', kind: 'transmute', a: 'toxicity', b: 'fire', c: 'death', k: [0.45, 0.65], lore: 'Fire turns poison into death.' },
{ id: 'bitter', name: 'Bitter Heart', kind: 'suppress', a: 'love', b: 'toxicity', k: [1.0, 1.5], lore: 'Poison sours love.' },
{ id: 'quicken', name: 'Quickening', kind: 'transmute', a: 'vitality', b: 'transformation', c: 'strength', k: [0.45, 0.6], lore: 'Life and change together build strength.' },
{ id: 'glacial', name: 'Glacial Insight', kind: 'catalyse', a: 'arcana', b: 'frost', k: [0.35, 0.55], lore: 'Cold sharpens arcane insight.' },
{ id: 'corrode', name: 'Corroding Change', kind: 'transmute', a: 'acidity', b: 'strength', c: 'transformation', k: [0.4, 0.55], lore: 'Acid gnaws strength into change.' },
{ id: 'heartfire', name: 'Heartfire', kind: 'transmute', a: 'love', b: 'fire', c: 'vitality', k: [0.45, 0.6], lore: 'Passion’s warmth becomes life.' },
{ id: 'gravechill', name: 'Grave Chill', kind: 'catalyse', a: 'death', b: 'frost', k: [0.4, 0.6], lore: 'Cold feeds death.' },
{ id: 'dulling', name: 'Dulling', kind: 'suppress', a: 'arcana', b: 'toxicity', k: [0.7, 1.0], lore: 'Poison clouds arcane potency.' },
{ id: 'wildgrowth', name: 'Wild Growth', kind: 'catalyse', a: 'transformation', b: 'vitality', k: [0.35, 0.55], lore: 'Life drives change wild.' },
{ id: 'kindling', name: 'Kindling', kind: 'catalyse', a: 'fire', b: 'acidity', k: [0.3, 0.45], lore: 'Acid feeds the flame.' },
];
function generateLaws(seed) {
const rng = new Rng('laws:' + seed);
const pool = rng.shuffle(LAW_TEMPLATES);
const out = [];
const pairs = new Set();
for (const t of pool) {
if (out.length >= 6) break;
const key = [t.a, t.b].sort().join('+');
if (pairs.has(key)) continue;
pairs.add(key);
out.push({
id: t.id, name: t.name, kind: /** @type {any} */ (t.kind),
a: EFFECT_INDEX[t.a], b: EFFECT_INDEX[t.b], c: t.c ? EFFECT_INDEX[t.c] : -1,
k: Math.round(rng.range(t.k[0], t.k[1]) * 100) / 100,
min: Math.round(rng.range(2, 4.5) * 10) / 10,
lore: t.lore,
});
}
return out;
}
return { WILD_SPECS, WILD_BY_KEY, WILD_FX_VERSION, generateWild, generateLaws };
})();
// src/alchemy/arcane.js
const __m15 = (() => {
const { EFFECT_KEYS } = __m13;
const ARCANE_SCALE = 0.1;
const ARCANE_ZERO = 20;
const AWAKE_SUFFIX = '~a';
function thresholdToCelsius(thr) {
return ARCANE_ZERO + ARCANE_SCALE * thr;
}
function celsiusToThreshold(T) {
return (T - ARCANE_ZERO) / ARCANE_SCALE;
}
function isAwakenedId(id) {
return typeof id === 'string' && id.endsWith(AWAKE_SUFFIX);
}
function awakenedId(id) {
return isAwakenedId(id) ? id : id + AWAKE_SUFFIX;
}
function baseIdOf(id) {
return isAwakenedId(id) ? id.slice(0, -AWAKE_SUFFIX.length) : id;
}
function isMagical(def) {
return !!(def && def.arcane && Number.isFinite(def.arcane.thr) && !def.awakened);
}
function awakenedDef(base) {
const gain = base.arcane && base.arcane.gain > 0 ? base.arcane.gain : 3;
const effects = {};
for (const k of EFFECT_KEYS) {
const v = base.effects ? Number(base.effects[k]) || 0 : 0;
if (v) effects[k] = Math.round(Math.max(-100, Math.min(100, v * gain)) * 10) / 10;
}
return {
...base,
id: awakenedId(base.id),
name: `Awakened ${base.name}`,
effects,
awakened: true,
base: base.id,
arcane: { thr: base.arcane ? base.arcane.thr : 0, gain, awake: true },
glow: Math.min(1, (base.glow || 0) * 0.5 + 0.35),
product: true,
tier: 99,
price: 0,
wild: undefined,
crushable: base.crushable,
description: `${base.name}, awakened past its arcane threshold. Its magic runs ${gain.toFixed(1)}× stronger and no longer fades with temperature.`,
};
}
function withAwakened(lookup) {
const cache = new Map();
return (id) => {
if (!isAwakenedId(id)) return lookup(id);
let d = cache.get(id);
if (d === undefined) {
const base = lookup(baseIdOf(id));
d = isMagical(base) ? awakenedDef(base) : null;
if (base) cache.set(id, d);
}
return d || undefined;
};
}
function blendThreshold(parts, lookup) {
let w = 0, t = 0;
for (const p of parts) {
const d = lookup(p.id);
if (!isMagical(d) || !(p.ml > 0)) continue;
w += p.ml;
t += p.ml * d.arcane.thr;
}
return w > 0 ? t / w : null;
}
function pastThreshold(thr, T) {
const Ta = thresholdToCelsius(thr);
return thr >= 0 ? T >= Ta : T <= Ta;
}
function describeThreshold(thr) {
const T = Math.round(thresholdToCelsius(thr));
const sign = thr > 0 ? '+' : '';
return `${sign}${Math.round(thr)} (${thr >= 0 ? 'heat past' : 'chill below'} ${T}°C)`;
}
function awakenParts(parts, composition, lookup) {
let awake = 0, magic = 0;
for (const [id, v] of Object.entries(composition)) {
const d = lookup(id);
if (!d) continue;
if (d.awakened) { awake += v; magic += v; } else if (isMagical(d)) magic += v;
}
const share = magic > 0 ? awake / magic : 0;
if (share < 0.01) return parts;
const out = [];
for (const p of parts) {
const d = lookup(p.id);
if (!isMagical(d)) { out.push(p); continue; }
if (share < 0.99) out.push({ id: p.id, ml: p.ml * (1 - share) });
out.push({ id: awakenedId(p.id), ml: p.ml * share });
}
return out;
}
return { ARCANE_SCALE, ARCANE_ZERO, AWAKE_SUFFIX, thresholdToCelsius, celsiusToThreshold, isAwakenedId, awakenedId, baseIdOf, isMagical, awakenedDef, withAwakened, blendThreshold, pastThreshold, describeThreshold, awakenParts };
})();
// src/materials/generator.js
const __m7 = (() => {
const { Rng } = __m6;
const { hslToRgb } = __m8;
const { completeMaterial } = __m9;
const { makeName, makeProductName } = __m10;
const { applyProfile } = __m11;
const { generateWild, generateLaws, WILD_FX_VERSION } = __m12;
const { withAwakened } = __m15;
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
void [syrup, essA, essB, binder, salt, essC, ember, frost, metal, crystal, wax, fizz, spores, resin, starlight, moss, vapor, phoenix, voidInk];
const ingredients = [water, oil, spirit].map((m) => m.id);
const starting = ingredients.slice();
return addAlchemy({ seed: seedStr, materials, ingredients, starting, reactions, roles });
}
function addAlchemy(world) {
for (const m of world.materials) applyProfile(m, world.seed);
const stale = !world.wild || world.materials.some((m) => m.id.startsWith('wild-') && m.fxv !== WILD_FX_VERSION);
if (stale) {
const w = generateWild(world.seed, world);
for (const m of w.materials) {
const old = world.materials.find((x) => x.id === m.id);
if (!old) { world.materials.push(m); continue; }
const mm = /** @type {any} */ (m);
Object.assign(old, { effects: mm.effects, arcane: mm.arcane, fxv: mm.fxv, solubility: m.solubility, binder: m.binder, description: m.description });
if (mm.wild) old.wild = { ...mm.wild };
}
for (const r of w.reactions) {
const k = world.reactions.findIndex((x) => x.id === r.id);
if (k < 0) world.reactions.push(r);
else world.reactions[k] = r;
}
world.wild = w.materials.filter((m) => !m.product).map((m) => m.id);
for (const id of world.wild) if (!world.ingredients.includes(id)) world.ingredients.push(id);
if (!world.laws) world.laws = w.laws;
}
if (!world.laws) world.laws = generateLaws(world.seed);
const keep = new Set([...SOLVENT_ROLES.map((r) => world.roles[r]), ...world.wild]);
world.ingredients = world.ingredients.filter((id) => keep.has(id) || world.materials.some((m) => m.id === id && m.remains));
world.starting = SOLVENT_ROLES.map((r) => world.roles[r]).filter(Boolean);
return world;
}
const SOLVENT_ROLES = ['water', 'oil', 'spirit'];
const LAB_ROLES = ['syrup', 'essenceA', 'essenceB', 'binder', 'salt', 'essenceC', 'ember', 'frost', 'metal', 'crystal', 'wax', 'fizz', 'spores', 'resin', 'starlight', 'moss', 'vapor', 'phoenix', 'void'];
function sandboxIngredients(world) {
const ids = world.ingredients.slice();
for (const r of LAB_ROLES) if (world.roles[r] && !ids.includes(world.roles[r])) ids.push(world.roles[r]);
return ids;
}
function makeLookup(world, extra = []) {
const map = new Map();
let n = -1;
const index = () => {
map.clear();
for (const m of world.materials) map.set(m.id, m);
for (const m of extra) map.set(m.id, m);
n = world.materials.length;
};
index();
return withAwakened((id) => {
if (n !== world.materials.length) index();
return map.get(id);
});
}
return { generateWorld, addAlchemy, SOLVENT_ROLES, LAB_ROLES, sandboxIngredients, makeLookup };
})();
// src/materials/pieces.js
const __m20 = (() => {
const PIECES_URL = 'assets/icons/pieces.png';
const PIECES_SIZE = /** @type {[number, number]} */ ([160, 1440]);
const PIECE_CELL = 40;
const PIECE_MASK = 20;
const PIECES = {
ashbloom: [
[0, 1000, '00c6001ff00fff81fff81fff83fffe3fffe3fffe7fffe7fffe7fffcffff8ffff87fff83fff83fff03fff01ffc007fc000380'],
[40, 1000, '00000180803c3c03cfe03fff03fff03fff83fff83fffc7fffc7fffc3fffc3fffc3fffc1fffc0fffc0fff807ff803ff001cc0'],
[80, 1000, '0018003fc007fe03fff83fffc7fffc7fffe7fffe7fffeffffffffff7fffe7fffe3fffc1fffc1fff80fff807ff001e0000000'],
[120, 1000, '0080001c0003ff007ff86fff87fffc7fffcffffefffff7fffe7fffe7fffe7fffc7fffc3fffc1fffc0fff807fe003c0000000'],
],
beebalm: [
[0, 920, '00040001e0007f000ff803ff807ff80fffc0fffc3fffc7fffc7fffc3fffe3fffc1fff81fff00fff80fff80ffe00e00004000'],
[40, 920, '0080001f0007f800ffc00ffe01fff03fff03fff03fff03fffc7fffe3fffe1fffc0fffc1fff83fff01fff00fff003cf000020'],
[80, 920, '00060003f0007f001ff803ffc03ffc07ffc77ffe7fffe7fffc7fffc3fffe3fffc1fff81fff01fff01ffe01ffc01e00008000'],
[120, 920, '0040000e0001f8007fc00ffc00ffe00fff01fff03fff03fff81fff81fff00fff03fffc7fffc3fff81fff00ff8001e0000000'],
],
bogbean: [
[0, 880, '00c0001e0001f8003fe007ff00fff00fff00fff00fff80fff81fff81fff81fff81fff81fff80fff007fe003fc000f8000600'],
[40, 880, '00060001e0007f001ff807ff80fffc0fffc1fffc3fffc3fffc7fffe7fffc7fffc7fff87ffe07ffc07ff807fe007fc001f000'],
[80, 880, '0070001fe007ff00fff81fffc3fffe7fffefffffffffffffff7ffff7ffff7ffff7fffe3fffc3fff81fff01ffc00fc0000000'],
[120, 880, '000e0001f0003f000ff803ff807ffc0fffc1fffc1fffc3fffc3fff83fff83fff83fff03fff01ffe01ff800fe000f80004000'],
],
cinderscale: [
[0, 1120, '001c000ff001ff807ffc07ffc0fffe0fffe1fffe3fffe3fffe3fffe3fffc7fffc3fff83fff83fff01ffe00ff8007e0003800'],
[40, 1120, '0038001ff007ff807ffc0fffe1ffff3ffff3fffe7ffff7ffff7fffeffffe7fffcffff87fff87fff03ffc01ff800fc0000000'],
[80, 1120, '003c000ff803ffc07ffe0fffe1fffe3fffe3fffe7fffe7fffe7fffe7fffc7fffc7fffc3fff83fff01ffe00ff8007e0003000'],
[120, 1120, '00c0003f0007fc00ffe00fff01fff01fff83fff83fffc3fffc3fffc3fffc3fffc3fff83fff83fff01ffe00ffc003f0001c00'],
],
cinnabar: [
[0, 520, '003fc00ffe01ffe03ffe07ffe0fffe1fffe3fffe7fffe7fffe7fffe7fffe7fffe7fffe7fffc3fffc3fff83ffe01ff800e000'],
[40, 520, '0018000fc007fe01fff03fff03fff83fff83fff83fff87fffc7fffc7fffc7fffe7fffe7fffc7fffc3fff80ffe001fc000380'],
[80, 520, '000f0007f801ffc03ffc07ffe0fffe3fffe3fffe7fffc7fffc7fffc7fffc7fffc7fff87fff83fff81fff80fff003fe000380'],
[120, 520, '0080003e0007f000ffc01fff03fff87fffc7fffc7fffe7fffe7fffe7fffe3fffe3fffe3fffe3fffc1fff80fff001fe0003c0'],
],
dragonpepper: [
[0, 1080, '007001ffc03ffe03ffe03ffe00fff00fff80fff80fffc07ffc07ffe07ffe07ffe0fffe3fffe7fe7e7f83e1e03e0001c00008'],
[40, 1080, '020000f0000fc000ff000ff800ffc01ffc01ffc01ffe01ffe00ffe00ffe007fe003ff001ff000ff0007f8003f8000f800030'],
[80, 1080, '00000000003be007ff00fff807ff803ffc03ffc07ffe07ffe03fff03fff81fff80fffc07ffe01fff007fe0007c0000000000'],
[120, 1080, '1f0001ff801ffc00ffe01ffe01fff03fff83fff83fff83fff81fff807ff807ff007ff007fe00ffc01ff801fe001fc000e000'],
],
dreamclover: [
[0, 400, '0080007c6007ff80fffc07ffc07ffc0fff81fffc7fffe7fffffffff7fffe7fffe7fff83fff01ffe01ffe01ffc01c00000000'],
[40, 400, '0100003f0003f8007f8007fc007fc07fff07fff83fffc3fffc1fffe1fffe3fffc3fffc7fffc7fffc7fffc7fffc787f800100'],
[80, 400, '00380007c000fe001fe01fff83fffc3fffe3fffe3fffe3fffc3fff87fff87fff87fff87fff87fff87fff83f3f03c00020000'],
[120, 400, '0180007c000fef01fff81fff81fffc1fff83fff83fff83fffc1fffc1fffe3fffc3fffc3fff87fff83fffc3f1fc0001c00008'],
],
emberbark: [
[0, 120, '00008000fc007fc00ffc01ff801ff803ff803ffc0fffc0fff81fff81fff01ffe01ffe01ffe01ffc03ff803fc003e00010000'],
[40, 120, '002000070001ff003ff807ff80fff80fff81fff81fffe3fffe3fffe3fffe3fffc3fff03fff07ffe07ffc07ff807fe0038000'],
[80, 120, '000f8003f8007fc03ffc07ffc0fffc1fffe3fffe7fffe7fffc7fffc7fff87fff03fff03ffe03ffe03ffc03ff003fe001c000'],
[120, 120, '00000003e000ff801ff803ff80fff81fff83fffc3fffe7fffe7ffffffffeffffcffff0fffe0fffe0fff80fff0001c0000000'],
],
emberflint: [
[0, 560, '0001000078001fc003fc00ffc03ffc0fffc1fffc1fffc1fffc3fff83fff87fff03fff03ffe01ffe01ffc00ff000fc0006000'],
[40, 560, '0002000070001f8003f800ff803ffc07ffc0fffc0fffc1fffc1fffc3fffc3fffc3fffc3fffc1fff81ffe00ffc003f8000e00'],
[80, 560, '00038000fc003fc00ffe03ffe0fffe0fffe1fffe3fffe3fffe7fffc7fffc7fff87fff87fff07ffe03ffc01ff000fc0003000'],
[120, 560, '000000078001fe00fff01fff81fffc1fffe3fffe3fffe3ffff7fffe7fffe7fffcffff0fffe07ffc03ff001f8000c00000000'],
],
frostcap: [
[0, 840, '0070003fc007ff00fffc1fffe1fffe3fffe3fffe7fffc7fff87fff0fffe0fffe07fff07fff81c3fc003fc001f8000f000060'],
[40, 840, '01c0003f0007fc00ffe01fff01fff83fffc7fffc7fffe7fffe7fffe3fffe1fffc03ff803fc007f000ff0007e0007e0003c00'],
[80, 840, '00f8003fc007fe00fff03fff87fff87fffc7fffc7fffc3fffc1fffe0fffe07ffe07ffe1fffc3fffc3fef81fc000f80003000'],
[120, 840, '000e0007f001ff00fff81fff83fff87fffc7fffc3fffc1fffc0fffe07ffe0fffe1fffc3fff83fe003fc003f8001f80007000'],
],
gravemoss: [
[0, 1280, '00f8003ff807ffc0fffe0fffe0ffff1ffff3fffe3fffe7fffe7fffe7fffc7fffcffffc7fff87fff83fff03ffc00ff8001c00'],
[40, 1280, '0038001ff007ff807ffc0fffc1fffe1fffe3fffe3fffe7fffe7fffc7fffc7fffc7fffc7fff87fff83fff01ffe01ff0003800'],
[80, 1280, '00c0003f8007fe00fff01fff81fff83fffc7fffc7fffcffffcffffe7fffe7fffe3fffc1fffc0fff80ffe007f8001f8000e00'],
[120, 1280, '0020000f8003fe01fff83fffc7fffc7fffc7fffe7fffc7fffc7fffc7fffc7fff87fff87fff87fff87fff03fff00ffc003800'],
],
heartpetal: [
[0, 280, '00000001e00fbf03fff83fffc7fffc7fff87fffe3ffff3ffff7fffe7fffeffffeffffe7fffe3fffe03ffe01fcf0000200000'],
[40, 280, '0080001f0007f800ffc01fff03fff83fff87fff07ffc07ffe03fff03fff83fffc1fffc1fffc1fffc0fff807ff803ff000780'],
[80, 280, '0180003e0017f003ffe03fff03fff83fffc3fff83fff87fffcffffeffffe7fffe7fffe7fffc3fff03ffe03fc803800010000'],
[120, 280, '00c0003f1007ff00fff81fff83fff83fff87fff87fff87fffc7fffc3fffe1fffc1fffe1fffe3fffe1ffe40ffc007f8000400'],
],
hemlock: [
[0, 960, '0004000ce001fe003ff003fe003fe00ffc01ff801ff801ffb00fff00ffe013fc01ff800ff0007e0007c0003c000380001000'],
[40, 960, '002000070000f8001f8001f800ff801ff801ff781fff80fff807ff003ff007fe003fe001fe000fc0007c0003800038000180'],
[80, 960, '00040001e0003e0063e00f7e00f7e00fffc0fffc2fffc7fffc3fff83fff01ffe00ffc00ff8007e0007c00078000700002000'],
[120, 960, '0f0000f8001fc000fc1c0fe3e0fe7e07e7e3fefc7fefc7fff83f7f83fff80fff007fe001fc001f8000f0000f0000f0000600'],
],
ironroot: [
[0, 0, '00000003f0003f0007f8007fc00ffe03fff07ffe0fffe1fffc1fffc3fff83fff87fff87fff87fffc67ffc03f9801f0000000'],
[40, 0, '00380003c0007c001fc003fe00ffe01fff81fffc1fffc3fffc7fff83fffc0fffc1fffc3fff87fff039ff803f7807c3c03018'],
[80, 0, '0002000070007f807ffc0fff81fff83fffc7fffc77ffc77ffe6fffe1fffe3fff67fff0ffff0f9ff871ff803e1803c0001800'],
[120, 0, '01e0007f801ffe03fff07fff0ffff8ffff87fff87fffc7fffc7fffe7fffe7fffe7fffe3fff81fff80fff801ff001fe000400'],
],
lodestone: [
[0, 480, '000f001ff803ffc07ffe07ffe0fffe1fffe1fffe3fffe7fffe7fffe7fffeffffcffffcffffcffff8fffe0fff807fc0038000'],
[40, 480, '001c0003e0007f001ff803ff80fffc0fffc1fffc1fffc1fffc1fffc3fffc3fffc3fffc3fff83fff81fff00ffc007f0003000'],
[80, 480, '00030003f801ffc03ffe07ffe0fffe1fffe1fffe3fffc3fffc7fffc7fff8ffff87fff87fff03fff01ffe00ffc003f0001800'],
[120, 480, '0060001fc001fe003ff007ff80fffc1fffc3fffc3fffc3fffc7fffc7fffe7fffc7fffe7fffe3fffc1fffc07ff801ff0007e0'],
],
mandrake: [
[0, 240, '038000fc000fec007efc03ffc01ffc03ff807ff00fff81ff383ff007ff807ffc03ffe03ffe03ffc077fe063fe021cf000430'],
[40, 240, '00180003c0003c0003c0007c000fc001fc003fe007fe007ff00fff81fff81fff81fff81fff807ff007fe0066c00c08000000'],
[80, 240, '000001c0003f0007f8007faf03fff81fffc0fffe1fff83ffe03ffe07fff87fffc3fffe3fff81fffe0cfff0e7ff0400000000'],
[120, 240, '0030000fc003ff007ff80fffc1fffc3fffe3fffe3fffe7fffe3fffc7fffc7fffc7fff83fff81fff81fff00ffe007fc000600'],
],
mica: [
[0, 600, '0020000f8003fc007fe00fff00fff81fffc1fffe3fffe7fffe7fffc7fffc7fff87fff03fff03ffe03ffe03ffc01fc000e000'],
[40, 600, '0040001e0003f8007fc00fff01fff83fffc3fffc3fffc3fffc3fffc3fffc7fffe7fffe7fffe7fffc7fff83fff03ffc01e000'],
[80, 600, '00000000c0003f001ffc07ffe1ffff3ffff7ffffffffeffffeffffe7fffc7fffc7fffc7fff83fff81fff003f8000c0000000'],
[120, 600, '03f8007fe00fff00fff81fffe1fffe3ffff3ffff3ffff7ffff7ffff7fffefffffffffeffffc7fff87ffe03ff8007c0000000'],
],
moonlily: [
[0, 1160, '0070000f8001fc01bfc07fff87fffc7fffe7fffe3fffe1fffe1fffc1fff83fff83fff87fffc7fffc3fffc3fff83e3f800070'],
[40, 1160, '0080001e3003f7807ff807ff80fff81fff83fff83fffc1fffe1fffe0fffc3fffc7fff87fff07ffe03ffe01ffe00ffc000040'],
[80, 1160, '0070000fc001fe01bfe03fffc7fffe7fffefffffffffe7fffe3fffc1fff83fffc3fffe3fffe7fffe7fffe3fffe07c7e00004'],
[120, 1160, '000c0007e003fe007fe007ff00fff00fff01fff03fff03fff03fff83fff83fffc3fffc3fffc3fffc1fffc1f3fc081f800070'],
],
nettle: [
[0, 360, '00060007e000ff007ff00fff81fff81fffc3fffc7fffc7fffc7fffc3fffc3fffc1fff80fff80fff01ffc03cf003800030000'],
[40, 360, '03c000fff00fff83fff83fff07fff07fff87fffc7fffe7fffe7fffe7ffff7dffe78ffe387fe303fe300fe0001e0000c00000'],
[80, 360, '0004000ff803ff80fff81fffc3fffc3fffc7fffc7fffc7fffcffffeffffe7fffe7fffe3fffe3ffff3fffe380003000000000'],
[120, 360, '0100003f000ffc03ffe03fff03fff87fff87fffc7fffc7fffc7fffc7fffc3fffc1fff80fff80fff0020f0000700007000020'],
],
nightshade: [
[0, 80, '000000060007fe00fff80fff83fff83fffc3fffc3fffe7fffe7fffe7fffe3fffe3fffe3fffe1fffc0fffc0fff801fe000980'],
[40, 80, '0010003f0003ff00fff80fff80fff81fff83fff83fff83fff87fffc7fffc3fffc3fff83fff81fff00fff007ff003fe000900'],
[80, 80, '0010001f8007fe00fff80fff83fffc3fffc3fffc3fffe7fffe7fffe3fffe3fffe3fffc3fffc1fffc1fffc07ff801fe000100'],
[120, 80, '0000001fc007fe01fffc1fffc3fffc7fffcffffe7ffff7fffe7fffe7fffe7fffe3fffe3fffe1fffc0fff807fe000fc000000'],
],
obsidian: [
[0, 1040, '007f801ffc03ffc07ffe0fffc1fffe3fffe3fffe7fffe7fffe7fffe7fffe7fffeffffcffff8ffff87fff03ffe01ffc007000'],
[40, 1040, '0018003fc007fc007fe007fe00fff00fff80fff81fffc1fffc1fffc1fffc1fffc3fff83fff81fff80ffe007fc001f8000600'],
[80, 1040, '00380007f801ffc03ffc0fffc1fffe3fffe7fffe7fffe7fffe7ffffffffeffffe7fffc3fff83fff81ffe00ffc007e0000000'],
[120, 1040, '01c0003fc00ffe01fff03fff87fffc7fffc7fffc7fffe3fffe3fffc3fffe3fffc1fffc1fff81fff80fff007ff000fe0001c0'],
],
owlberry: [
[0, 160, '0040001f8003fc007fc007fc007fe00fff01fff81fff83fffc3fffc3fffc3fffc3fffc3fffc1fffc0fffc07ff803ff000060'],
[40, 160, '0180003e0007f000ff801ff801ffc01ffe01fff01fff81fff83fffc3fffc3fffc3fff81fff81fff00fff007fe003fc000f00'],
[80, 160, '0300007e0007f000ff801ff801ffc01ffe01fff01fff83fff83fffc3fffc3fffc3fffc3fff81fff81fff00ffe007fc001f00'],
[120, 160, '0030001f8003f8003fc007fc007fe00fff00fff01fff81fffc1fffe1fffe1fffe3fffe7fffc3fff83fff81ffe00ff8006800'],
],
reedmace: [
[0, 720, '0000000000070000f80c0fc1c0fe1c0ff380ff3807ff807ffe7fffe3fffc0fffc07ff803ff003ff001fe0004000000000000'],
[40, 720, '0000000040003e0007e000fe001fe003fc007fc067fbe67ffe67ff8f7fe0fffc0fdfe0ffff07fff87f018780002000000000'],
[80, 720, '0000000000001c0007f000ff063ff067ff077fe2fffcef7ffef7ffcffff87fff87fff07fc003e0003c000100000000000000'],
[120, 720, '00000000000000007f000ff801ff801ff801ff801ffc00ffcc0fffe0fffeffff77ffe33ffe01ffc001f00000000000000000'],
],
riverchalk: [
[0, 800, '007c000ff001ff803ffc0fffe1fffe3ffff7ffff7ffffffffeffffe7fffc7fffc7fffc7fff83fff03fff01ffe00ffc000f00'],
[40, 800, '0038000fe003ff007ff80fff80fffc1fffc1fffc1fffc3fffe3fffe3fffe3fffc3fff87fff87fff07ffe03ff801fe0001000'],
[80, 800, '000f000ff807ffc0fffc1fffe3fffe3ffff3ffff7ffff7fffeffffeffffeffffe7fffc7fffc3fff81ffe00ffc001f0000400'],
[120, 800, '0018000fe003ff00fff81fffc1fffc3fffe3fffe3fffe7fffe7fffe7fffe7fffeffffcffffc7fff83fff01fff007f8001800'],
],
riverpearl: [
[0, 760, '00000000f8007fc03ffe07ffe0ffff1ffff3ffff7fffffffffffffeffffe7fffc7fffc3fff81fff80fff007f800380000000'],
[40, 760, '001c0007e000ff003ff807ffc0fffc1fffc1fffe1fffe3fffe3fffe3fffe7fffe7fffc7fffc7fff83fff81fff007fe000780'],
[80, 760, '00000001e000ff803ffc0fffc1fffe3fffe7ffff7ffff7fffeffffeffffc7fffc7fff83fff01ffe00ff8007f0001c0000000'],
[120, 760, '00000003f000ff803ffc07ffe1fffe3fffe3ffff7ffff7ffffffffffffffffffeffffe7fffc7fff83fff01ffe003f0000000'],
],
saltpetre: [
[0, 640, '0000000fe003ff00fff81fffc7fffc7fffcffffeffffeffffe7fffe7fffe7ffff7ffff7fffe7fffc3fff00ffe000f8000000'],
[40, 640, '0300007c000fe001ff803ffe03fff87fffc7fffe7fffeffffeffffe7fffe7fffe3fffe3fffc3fffc1fffc1fff80fff000fe0'],
[80, 640, '00078003fc007fe01fff07fff0ffff1ffff1ffff1ffff3ffff3fffe7fffe7fffcffffcffff87fff07fff03ffe00ffc003f00'],
[120, 640, '00000007c001fe003ff007ff00fffc0fffe1ffff3ffff3ffff7ffff7fffffffffffffe7fffc3fff81ffe007f0001e0000000'],
],
silverleaf: [
[0, 40, '000060007f000fe007fc00ffc01ffc0bff81fffc1fffc1fffc3fffc3fff83fff03fff03fff01fff01ffe03ff8078c0060000'],
[40, 40, '0002000070001f0003f0017f003ff003ff807ff80fff80fff81fff01fff80fff00fff00ffe007fc003f8001c000180001800'],
[80, 40, '00000000fe00fff01ffe0fffe1fffe1fffc3fff83fff87fffc7fff87fff07ffe03ffc03ffe03ffc073e00e00004000000000'],
[120, 40, '000080003c00078007f001ff003ff007ff007ff80fff81fff81fff83fff83ffe03ffe03ffc03ffc01fc001f8001c00000000'],
],
sirenreed: [
[0, 1240, '00008000fc001fc00ffc01ffc01ffc01ff807ff80fff80fff03ffe03ffe03ffc03ff003ff803ff003fe003fc001f00018000'],
[40, 1240, '00008001bc003fc003fc01ffc03ffc03ffc03ff807ff807ff027ff03fff07ffe07ff807fe007fe003fe003fc003e00010000'],
[80, 1240, '00010000f8003f8007f000ff803ff807ff007ff007fe017fe01ffe01ffe01ffd81fff80fff00ffe007fc007f0007c0003000'],
[120, 1240, '00018000fc007fc007f800ffc03ff807ff807ff007ff017ff01bfe03ffc03ff003ffc03ff803ff001ff001fc001e00008000'],
],
starquartz: [
[0, 1320, '000e0007f000ff801ffc03ffc03ffe37ffe3fffe3fffe7fffc7fffc7fff87fff87fffc3fffc3fff81fff01ffe00ff8006000'],
[40, 1320, '00080003c0007e001fe003fe007ff407ffe3fffe3fffe3fffe7fffe7fffe7fffc3fffc3fff81fff00ffc00fe000780002000'],
[80, 1320, '000c0003e001fe003ff007ff00fff80fff81fffc3fffc3fffc3fff83fff83fff83fff03fff01ffe01ffc00ff800fe0007000'],
[120, 1320, '001000078000fc001fe011fe03fff03fff03fff87fffc7fffc7fffc3fffc3fff81fff81fff80fff007fe003fc000f8000100'],
],
stormglass: [
[0, 1400, '003f000ff801ffc03ffc07ffc0fffc0fffe1fffe1fffe3fffc3fffc7fff87fff87fff07ffe07ffc07ffc03ff003f8001c000'],
[40, 1400, '00020001f8007fc01ffc03ffe07ffe07ffe0fffe1fffc1fffc3fffc3fffc3fffc7fff87fff07ffe07ff807ff003fe001f800'],
[80, 1400, '00000000f8007fc01ffc03ffe07ffe0ffff1ffff3fffe3fffe7fffe7fffc7fff8ffff07ffe07ffc03ff801fe000300000000'],
[120, 1400, '000380007c001fe007fe01ffe03ffe07ffe0fffe1fffe1fffc3fffc3fff83fff07fff07ffe07ffc03ff801ff001fc0006000'],
],
sulfur: [
[0, 440, '000e000ff803ffc07ffe0fffe0fffe1fffe3fffe3fffe7fffe7fffe7fffe7fffe3fffe3fffe1fffc0fff80ffe007f0001800'],
[40, 440, '007e007ff00fff81fff83fffc3fffc7fffc7fff87fff87fffc7fffe3fffe3fffe3fffc3fffc1fffc0f7f8007f8001f000060'],
[80, 440, '0003801ffe07ffe07ffe0fffe1fffe1fffe3fffe7fffe7fffe7fffe7fffc7fffc7fffc7fffc7fff07ffe03ffc01ff8000000'],
[120, 440, '0200007e000ff801ffc01ffe03fff07fff07fff87fff87fff87fffc7fffc7fffc7fffc7fffe7fffe7fffc3fffc3fff007f80'],
],
sunthistle: [
[0, 320, '0080001ee003ff00bff01fff83fffe3fffe1fffe1fffc3fff87fffc7fffe3fffc1fff83fff83fff83fff810ff8007f800038'],
[40, 320, '0e4001fe001ffe01fff01fff07fff07fffc3fffc3fffe3fffc3fffc7fffc7fffe7fffe7fffe7fffc7fff8fcf38e000000000'],
[80, 320, '00c0000f001ff801ffc01fff03fff87fffc7fffc7fff87fff81fffc1fffc3fffe3fffe3fffc3fff03fff03ffe03800010000'],
[120, 320, '0060007f0007fe007ff007ff03fff07fffc7fffe3fffe1fffc3fffc7fff87fff87fff83fff00fff01fff01fff01c07000020'],
],
toadstool: [
[0, 1200, '00f0003fe007ff00fff81fffc1fffe3fffe3fffc3fffc7fff87ffe07ffe07fff03fff81f7f8007fc003fc003f8001f0000c0'],
[40, 1200, '0070001fc007ff00fff80fff81fffc3fffc3fffe7fffe7fffe7fffe7fffc3fffc0fff007f8007f000ff0007f0003e0000c00'],
[80, 1200, '00f0003fc00ffe01fff03fff87fff87fffcffffcffffe7fffe7fffe3fffe0fffe07ffc0fff80fff00ff000ff0007e0001c00'],
[120, 1200, '0070000f8003fc007fe00fff01fff81fff83fffc3fffc3fffe7fffe7fffc7fffc7fff87ffe07ffe03ffe01efe0007c000300'],
],
willowbark: [
[0, 680, '0000000040003f0007f803ffc07ffc0fffe0fffe3ffff7ffff7ffff7fffeffffc7fff87ffe03ffc01ff000fe0007c0000000'],
[40, 680, '00000000000028003ff007ff80fffc1fffe3ffff3ffff7ffff7fffeffffe7fffc7fff03ff803fe001f000040000000000000'],
[80, 680, '0000000000000f8001fc007fe07ffe0ffff1ffff3ffff7fffe7fffc7fff8ffff8ffff07ffc03ff801fe000fc000000000000'],
[120, 680, '000000010000fc001fe003ff80fffc0fffe1fffe3fffe7fffffffffffffeffffc7fff03ffc03ff801ff000f0000000000000'],
],
wisplichen: [
[0, 1360, '0000000fc001fe003ff01fffc3fffe7fffeffffffffffffffe7fffe7fffc3fff81fff00ffe007fc00ffc00f3e0021c000000'],
[40, 1360, '03000078000fc0007f8003fe003fe007ff00fff81fffc3fffc3fffc7fffc7fffc7fffc3fff83fff01ffe01ff8007f0001c00'],
[80, 1360, '0070001fc003fe007ff00fff01fffe7fffe7fffffffffffffe7fffe7fffe3fffc1fff80fff007fc001f0000f0000f0000200'],
[120, 1360, '0060000f0003fc00ffe01fff01fff83fffc3fffc3fffc3fffc3fffc1fffc1fff83fff83fff03ffe018f80007800078000300'],
],
witchear: [
[0, 200, '0070001fc007ff00fff81fff83fffc3fffc7fffe7fffe7fffe3fffe1fffe1fffe07ffc03ff803f8003f8003f8001f0000780'],
[40, 200, '01f0007fc01ffe03fff07fff87fff83fffc3fffc3fffc1fffc0fffc0fffc0fff81fff03fe003fe003fe001fc000fc0003000'],
[80, 200, '01fe007ff00fff81fffc3fffe3fffe7ffff7fffeffffeffffcffff87fff07fff87fff83fffc1e7fe003fc003fc003f8000c0'],
[120, 200, '0030003fe007ff00fff81fffc3fffc7fffe7fffe7fffe7fffe3fffe3fffe0fffe07ffc0fff81ff001ff000ff0007e0001c00'],
],
};
return { PIECES_URL, PIECES_SIZE, PIECE_CELL, PIECE_MASK, PIECES };
})();
// src/materials/shapes.js
const __m19 = (() => {
const LOOK = Object.freeze({
ICE: 0, FIBRE: 1, LEAF: 2, STONE: 3, CRYSTAL: 4, CAP: 5, GLOSSY: 6, BONE: 7, FUR: 8, LUMP: 9,
BARK: 10, BERRY: 11, GILLS: 12, SEED: 13, SHELL: 14, METAL: 15, GLASS: 16, SPOTS: 17, REED: 18, FLORET: 19,
});
const { PIECES, PIECE_CELL, PIECE_MASK } = __m20;
const { WILD_BY_KEY } = __m12;
const SHAPE_LOOK = {
root: LOOK.FIBRE, pepper: LOOK.FIBRE, leaf: LOOK.LEAF, petal: LOOK.LEAF, flower: LOOK.LEAF, clover: LOOK.LEAF, moss: LOOK.LEAF, sprig: LOOK.LEAF,
stone: LOOK.STONE, crust: LOOK.STONE, crystal: LOOK.CRYSTAL, cap: LOOK.CAP, bean: LOOK.GLOSSY, scale: LOOK.GLOSSY, bone: LOOK.BONE, fur: LOOK.FUR, lump: LOOK.LUMP,
bark: LOOK.BARK, berry: LOOK.BERRY, bracket: LOOK.GILLS, seed: LOOK.SEED, shell: LOOK.SHELL, nugget: LOOK.METAL, shard: LOOK.GLASS,
toadstool: LOOK.SPOTS, reed: LOOK.REED, spike: LOOK.FLORET, lily: LOOK.FLORET,
};
function shapeOf(def) {
if (!def) return 'stone';
if (def.shape) return def.shape;
if (def.wild && def.wild.shape) return def.wild.shape;
switch (def.archetype) {
case 'crystal': case 'frost': return 'crystal';
case 'resin': return 'lump';
default: return 'stone';
}
}
function solidLook(def) {
if (!def || def.form !== 'solid') return LOOK.ICE;
if (def.archetype === 'frost') return LOOK.CRYSTAL;
return SHAPE_LOOK[shapeOf(def)] ?? LOOK.STONE;
}
const hex = (a, b) => [a + (b & 1) * 0.5, b * 0.866];
const TEMPLATES = {
root: [[0, 0], [1, 0.2], [-1, -0.1], [2, 0.35], [-2, -0.15], [3, 0.6], [-3, -0.1], [0.5, 0.9], [-1.5, 0.75], [4, 0.95], [2.4, -0.7], [-3.9, 0.4]],
pepper: [[0, 0], [1, 0.1], [-1, 0], [2, 0.3], [0.5, 0.86], [-0.5, 0.86], [3, 0.6], [1.5, 0.95], [-2, -0.3]],
leaf: [[0, 0], [1, 0], [-1, 0], [0.5, 0.86], [-0.5, 0.86], [0.5, -0.86], [-0.5, -0.86], [2, 0], [-2, 0.1], [1.5, 0.7], [1.5, -0.7]],
petal: [[0, 0], [1, 0], [0.5, 0.86], [-0.5, 0.86], [-1, 0], [-0.5, -0.86], [0.5, -0.86]],
flower: [[0, 0], [1, 0], [0.5, 0.86], [-0.5, 0.86], [-1, 0], [-0.5, -0.86], [0.5, -0.86], [0, 1.73], [0, 2.6]],
clover: [[0, 0], [0.8, -0.6], [-0.8, -0.6], [0, 0.9], [1.6, -0.5], [-1.6, -0.5], [0, 1.8]],
moss: [[0, 0], [1, 0], [-1, 0], [0.5, 0.86], [-0.5, 0.86], [1.5, 0.86], [-1.5, 0.86], [0, -0.86], [2, 0.2]],
stone: [[0, 0], ...[0, 1, 2, 3, 4, 5].map((k) => [Math.cos((k * Math.PI) / 3), Math.sin((k * Math.PI) / 3)]),
...[0, 1, 2, 3, 4, 5].map((k) => [1.732 * Math.cos((k * Math.PI) / 3 + Math.PI / 6), 1.732 * Math.sin((k * Math.PI) / 3 + Math.PI / 6)])],
crystal: [[0, 0], [0, 1], [0.866, 0.5], [0.866, -0.5], [0, -1], [0, 2], [0.866, 1.5], [0.866, -1.5], [0.43, -2.25], [0.43, 2.75]],
cap: [[0, 0], [1, 0], [-1, 0], [2, 0.25], [-2, 0.25], [0.5, -0.8], [-0.5, -0.8], [0, 1], [0, 2]],
bean: [[0, 0], [1, 0.15], [-1, 0.15], [0.5, -0.8], [-0.5, -0.8], [2, 0.5], [-2, 0.5]],
scale: [[0, 0], [1, 0], [-1, 0], ...[hex(0, 1), hex(-1, 1), hex(0, -1), hex(-1, -1)].map(([x, y]) => [x, y]), [0, 1.73]],
bone: [[0, 0], [1, 0], [-1, 0], [2, 0], [-2, 0], [3, 0.5], [3, -0.5], [-3, 0.5], [-3, -0.5], [3.8, 0], [-3.8, 0]],
fur: [[0, 0], [1, 0.2], [-1, 0.1], [0.4, 0.9], [-0.6, 0.9], [0.5, -0.85], [-0.4, -0.8], [1.5, -0.6]],
lump: [[0, 0], [1, 0], [-1, 0.1], [0.5, 0.86], [-0.5, 0.9], [0.4, -0.85], [-0.6, -0.8], [1.6, 0.6]],
bark: [[0, 0], [1, 0], [-1, 0], [2, 0.1], [-2, 0.1], [0.5, 0.86], [-0.5, 0.86], [1.5, 0.95], [-1.5, 0.95], [2.8, 0.6]],
berry: [[0, 0], [1, 0], [0.5, 0.86], [-0.5, 0.86], [-1, 0], [0, 1.73], [1, 1.73], [0.5, -0.9]],
bracket: [[0, 0], [1, 0], [-1, 0], [2, 0], [-2, 0], [0.5, -0.86], [-0.5, -0.86], [1.5, -0.86], [-1.5, -0.86], [0, -1.73]],
sprig: [[0, 0], [0, 1], [0, -1], [0.9, 0.5], [-0.9, -0.5], [0.9, -1.3], [-0.9, 1.3], [0, 2], [0, -2]],
spike: [[0, 0], [0, 1], [0, -1], [0, 2], [0, -2], [0.8, 0.5], [-0.8, 0.5], [0.8, -0.5], [-0.8, -0.5], [0, 3]],
seed: [[0, 0], [1, 0], [-1, 0], [0.5, 0.8], [-0.5, 0.8], [0.5, -0.8]],
nugget: [[0, 0], [1, 0], [0.5, 0.86], [-0.5, 0.86], [-1, 0], [-0.5, -0.86], [0.5, -0.86], [1.4, 0.9]],
shard: [[0, 0], [0.9, 0.25], [-0.9, -0.25], [1.8, 0.5], [-1.8, -0.5], [2.7, 0.6], [0.4, -0.7], [-2.6, -0.4]],
lily: [[0, 0], [1, 0], [-1, 0], [0.5, 0.86], [-0.5, 0.86], [1.6, -0.6], [-1.6, -0.6], [0, 1.73], [0, 2.6]],
toadstool: [[0, 0], [1, 0], [-1, 0], [2, 0.15], [-2, 0.15], [0.5, -0.86], [-0.5, -0.86], [1.5, -0.7], [-1.5, -0.7], [0, 1], [0, 2]],
reed: [[0, 0], [0, 1], [0, 2], [0, -1], [0, -2], [0, 3], [0.8, -1.5], [0.8, -2.5], [0, -3]],
shell: [[0, 0], [1, 0], [-1, 0], [0.5, -0.86], [-0.5, -0.86], [1.5, -0.86], [-1.5, -0.86], [0, -1.73], [1, -1.73], [-1, -1.73]],
};
function chunkTemplate(def, max, variant = -1) {
const pc = variant >= 0 ? piece(skinOf(def, variant)) : null;
const t = pc ? pc.pts : TEMPLATES[shapeOf(def)] || TEMPLATES.stone;
return t.slice(0, Math.max(1, Math.min(max, t.length)));
}
const SKINS = Object.keys(PIECES).sort().flatMap((key) => PIECES[key].map((_, v) => ({ key, v })));
const SKIN_BASE = Object.fromEntries(Object.keys(PIECES).sort().map((key, n) => [key, 1 + n * 4]));
function hasPieces(def) {
return !!def && def.form === 'solid' && !def.shape && !!def.wild && def.wild.key in SKIN_BASE;
}
function grainSkinOf(def, variant) {
return def && !def.shape && def.wild && def.wild.key in SKIN_BASE ? SKIN_BASE[def.wild.key] + (variant & 3) : 0;
}
function skinOf(def, variant) {
return hasPieces(def) ? SKIN_BASE[def.wild.key] + (variant & 3) : 0;
}
const fitted = [];
function piece(skin) {
if (!skin) return null;
if (fitted[skin] !== undefined) return /** @type {Piece|null} */ (fitted[skin]);
const sk = SKINS[skin - 1];
if (!sk) return null;
const [fx, fy, hexRows] = PIECES[sk.key][sk.v];
const M = PIECE_MASK, D = (M + 3) >> 2;
const mask = new Uint8Array(M * M);
for (let y = 0; y < M; y++) {
const row = parseInt(hexRows.slice(y * D, (y + 1) * D), 16);
for (let x = 0; x < M; x++) mask[y * M + x] = (row >>> (D * 4 - 1 - x)) & 1;
}
let area = 0;
for (const m of mask) area += m;
const spec = WILD_BY_KEY[sk.key];
const n = (TEMPLATES[spec ? spec.shape : 'stone'] || TEMPLATES.stone).length;
const inside = (x, y) => x >= 0 && y >= 0 && x < M && y < M && mask[(y | 0) * M + (x | 0)] === 1;
let best = null;
let bestScore = -1, bestK = 1;
for (let k = 1.5; k <= M / 1.5; k += 0.05) {
const rr = (0.65 * k) ** 2;
for (let oy = 0; oy < 4; oy++) for (let ox = 0; ox < 4; ox++) {
const pts = [];
const x0 = (ox / 4) * k, y0 = (oy / 4) * k * 0.866;
for (let b = -1; b * k * 0.866 + y0 < M + k; b++) {
for (let a = -1; a * k + x0 < M + k; a++) {
const x = (a + (b & 1) * 0.5) * k + x0, y = b * k * 0.866 + y0;
if (inside(x, y)) pts.push([x, y]);
}
}
if (pts.length !== n) continue;
let both = 0, blob = 0;
for (let cy = 0; cy < M; cy++) for (let cx = 0; cx < M; cx++) {
let hit = false;
for (const [x, y] of pts) if ((x - cx - 0.5) ** 2 + (y - cy - 0.5) ** 2 < rr) { hit = true; break; }
if (hit) { blob++; if (mask[cy * M + cx]) both++; }
}
const score = both / (area + blob - both);
if (score > bestScore) { bestScore = score; best = pts; bestK = k; }
}
}
if (!best) return (fitted[skin] = null);
let mx = 0, my = 0;
for (const [x, y] of best) { mx += x; my += y; }
mx /= n; my /= n;
const pts = best.map(([x, y]) => [(x - mx) / bestK, (y - my) / bestK]).sort((p, q) => Math.hypot(p[0], p[1]) - Math.hypot(q[0], q[1]));
const r = PIECE_CELL / M;
return (fitted[skin] = { pts, ax: fx + mx * r, ay: fy + my * r, ppu: bestK * r, cx: fx, cy: fy });
}
function chunkSize(def) {
return (TEMPLATES[shapeOf(def)] || TEMPLATES.stone).length;
}
return { LOOK, shapeOf, solidLook, chunkTemplate, hasPieces, grainSkinOf, skinOf, piece, chunkSize };
})();
// src/reactions/species.js
const __m18 = (() => {
const { rgbToOklab, srgbToLinear } = __m8;
const { volatilityOf } = __m9;
const { NE, effectVector } = __m13;
const { isMagical, awakenedId } = __m15;
const { solidLook } = __m19;
const MAX_SPECIES = 24;
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
this.eff = new Float32Array(S * NE);
this.econd = f();
this.echarge = f();
this.ashSlot = new Int16Array(S).fill(-1);
this.smokeSlot = new Int16Array(S).fill(-1);
this.arcThr = f();
this.arcMag = new Uint8Array(S);
this.isAwake = new Uint8Array(S);
this.awakeSlot = new Int16Array(S).fill(-1);
this.isWhole = new Uint8Array(S);
this.look = new Uint8Array(S);
this.magicCount = 0;
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
const ev = effectVector(def);
for (let k = 0; k < NE; k++) this.eff[slot * NE + k] = ev[k];
this.econd[slot] = def.econd ?? 0.05;
this.echarge[slot] = def.charge ?? 0;
const mag = isMagical(def);
this.arcMag[slot] = mag ? 1 : 0;
this.arcThr[slot] = mag ? def.arcane.thr : 0;
this.isAwake[slot] = def.awakened ? 1 : 0;
this.awakeSlot[slot] = -1;
this.isWhole[slot] = def.form === 'solid' ? 1 : 0;
this.look[slot] = solidLook(def);
if (mag) this.magicCount++;
if (def.awakened && def.base) {
const b = this.slotOf.get(def.base);
if (b !== undefined) this.awakeSlot[b] = slot;
} else if (mag) {
const a = this.slotOf.get(awakenedId(def.id));
if (a !== undefined) this.awakeSlot[slot] = a;
}
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
if (this.arcMag[slot]) this.magicCount--;
this.arcMag[slot] = 0;
this.isAwake[slot] = 0;
this.awakeSlot[slot] = -1;
for (let s = 0; s < MAX_SPECIES; s++) {
if (this.ashSlot[s] === slot) this.ashSlot[s] = -1;
if (this.smokeSlot[s] === slot) this.smokeSlot[s] = -1;
if (this.awakeSlot[s] === slot) this.awakeSlot[s] = -1;
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
const __m21 = (() => {
const { MAX_SPECIES, NO_BOIL } = __m18;
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
const __m17 = (() => {
const { SpeciesTable, MAX_SPECIES } = __m18;
const { mixtureProps } = __m21;
const { compositionEffects, extractedEffects, NE } = __m13;
const { isMagical, awakenedId, thresholdToCelsius } = __m15;
const ACTIVATION_MARGIN = 6;
const tables = new WeakMap();
function predictPlan(world, lookup, plan) {
const vol = new Map();
let total = 0;
for (const ing of plan.ingredients) {
vol.set(ing.id, (vol.get(ing.id) || 0) + ing.n);
total += ing.n;
}
const fired = [];
const st = plan.steep ? plan.steep.T : 20;
const lo = Math.min(20, plan.coolTo ?? 20, plan.serveTemp ?? 20, st);
const hi = Math.max(20, plan.heatTo ?? 20, plan.serveTemp ?? 20, st, plan.reduce ? reduceTemp(plan, lookup) : 20);
for (let pass = 0; pass < 3; pass++) {
for (const r of world.reactions) {
const a = vol.get(r.a) || 0;
const b = r.b ? vol.get(r.b) || 0 : Infinity;
if (a <= 0 || b <= 0) continue;
if (r.maxT < lo || r.minT > hi) continue;
const held = (plan.hold ?? 0) >= 8 || (!!plan.steep && plan.steep.hold >= 8 && plan.steep.T >= r.minT && plan.steep.T <= r.maxT);
if (r.wet && !held && r.minT > (plan.serveTemp ?? 20)) continue;
const yieldF = r.kind === 'decompose' ? (r.wet ? 0.85 : 0.55) : 0.88;
const ext = Math.min(a / r.ra, r.b ? b / r.rb : Infinity) * yieldF;
if (ext <= 0.01) continue;
vol.set(r.a, a - ext * r.ra);
if (r.b) vol.set(r.b, b - ext * r.rb);
const used = ext * (r.ra + (r.b ? r.rb : 0));
for (const pr of r.products) vol.set(pr.id, (vol.get(pr.id) || 0) + used * pr.frac);
fired.push(r.id);
}
}
let wMag = 0, tMag = 0;
for (const [id, v] of vol) {
const d = lookup(id);
if (v > 1e-6 && isMagical(d)) { wMag += v; tMag += v * d.arcane.thr; }
}
const threshold = wMag > 0 ? tMag / wMag : null;
let awakened = false;
if (threshold !== null) {
const Ta = thresholdToCelsius(threshold);
awakened = threshold >= 0 ? hi >= Ta : lo <= Ta;
if (awakened) {
for (const [id, v] of [...vol]) {
const d = lookup(id);
if (v <= 1e-6 || !isMagical(d) || !lookup(awakenedId(id))) continue;
vol.set(id, 0);
vol.set(awakenedId(id), (vol.get(awakenedId(id)) || 0) + v);
}
}
}
if (plan.reduce && plan.reduce.frac > 0) {
let left = plan.reduce.frac * total;
const vols = [...vol].map(([id, v]) => ({ id, v, d: lookup(id) })).filter((x) => x.v > 1e-6 && x.d && x.d.form === 'liquid' && isFinite(x.d.boil) && x.d.boil < 150)
.sort((a, b) => a.d.boil - b.d.boil);
for (const x of vols) {
if (left <= 0) break;
const take = Math.min(x.v, left);
vol.set(x.id, x.v - take);
total -= take;
left -= take;
}
}
for (const [id, v] of vol) {
const d = lookup(id);
if (d && d.form === 'gas' && d.boil < (plan.serveTemp ?? 20)) {
total -= v;
vol.set(id, 0);
}
}
let sp = tables.get(lookup);
const comp = new Float32Array(MAX_SPECIES);
for (let attempt = 0; attempt < 2; attempt++) {
if (!sp || attempt) { sp = new SpeciesTable(); tables.set(lookup, sp); }
comp.fill(0);
let full = false;
for (const [id, v] of vol) {
if (v <= 1e-6) continue;
const def = lookup(id);
if (!def) continue;
const s = sp.ensure(def);
if (s >= 0) comp[s] += v / total;
else full = true;
}
if (!full) break;
}
const props = mixtureProps(sp, comp, 0, plan.serveTemp ?? 20);
const effects = compositionEffects(sp, comp, 0, plan.serveTemp ?? 20, world.laws || [], new Array(NE).fill(0));
const raw = new Array(NE).fill(0);
extractedEffects(sp, comp, 0, plan.serveTemp ?? 20, raw);
const composition = {};
for (let s = 0; s < sp.count; s++) if (sp.defs[s] && comp[s] > 1e-5) composition[sp.defs[s].id] = comp[s];
return { ...props, effects, raw, composition, reactions: fired, totalParticles: total, threshold, awakened };
}
function reduceTemp(plan, lookup) {
let b = Infinity;
for (const ing of plan.ingredients) {
const d = lookup(ing.id);
if (d && d.form === 'liquid' && isFinite(d.boil) && d.boil < 150) b = Math.min(b, d.boil);
}
let water = Infinity;
for (const ing of plan.ingredients) { const d = lookup(ing.id); if (d && d.form === 'liquid' && isFinite(d.boil) && d.boil < 150 && d.boil > b + 10) water = Math.min(water, d.boil); }
return isFinite(water) && plan.reduce && plan.reduce.frac > spiritShare(plan, lookup, b) ? water : isFinite(b) ? b : 100;
}
function spiritShare(plan, lookup, b) {
let s = 0, t = 0;
for (const ing of plan.ingredients) { const d = lookup(ing.id); t += ing.n; if (d && d.boil === b) s += ing.n; }
return t ? s / t : 0;
}
function arcaneRegime(ids, lookup, temps) {
const ths = [];
for (const id of ids) {
const d = lookup(id);
if (isMagical(d)) ths.push(d.arcane.thr);
}
if (!ths.length) return 'quiet';
const hi = Math.max(20, ...temps), lo = Math.min(20, ...temps);
const M = ACTIVATION_MARGIN;
const pos = ths.filter((t) => t >= 0), neg = ths.filter((t) => t < 0);
if (pos.length && neg.length) return hi <= 21 && lo >= 19 ? 'quiet' : 'mixed';
if (pos.length) {
if (hi <= thresholdToCelsius(Math.min(...pos)) - M) return 'quiet';
if (hi >= thresholdToCelsius(Math.max(...pos)) + M) return 'full';
return 'mixed';
}
if (lo >= thresholdToCelsius(Math.max(...neg)) + M) return 'quiet';
if (lo <= thresholdToCelsius(Math.min(...neg)) - M) return 'full';
return 'mixed';
}
function activationMargin(plan, threshold) {
if (threshold === null) return null;
const Ta = thresholdToCelsius(threshold);
const lo = Math.min(20, plan.coolTo ?? 20, plan.serveTemp ?? 20);
const hi = Math.max(20, plan.heatTo ?? 20, plan.serveTemp ?? 20);
return threshold >= 0 ? hi - Ta : Ta - lo;
}
function planCost(plan, priceOf) {
let c = 0;
for (const ing of plan.ingredients) c += (ing.n * 5 / 100) * priceOf(ing.id);
return c;
}
return { ACTIVATION_MARGIN, predictPlan, reduceTemp, arcaneRegime, activationMargin, planCost };
})();
// src/game/customers.js
const __m22 = (() => {
const { Rng } = __m6;
const ARCHETYPES = [
{
key: 'farmer', title: 'Farmer', styles: ['tonic', 'syrup', 'healing', 'bane'], props: ['temperature'], budget: 0.8, strict: 1.3, minRank: 0,
look: { hat: 'straw', outfit: [0.55, 0.42, 0.25], beardChance: 0.5 },
greet: ['Mornin’. The goats are poorly — I need {potion}.', 'Got coin for {potion}, if you can make it proper.', 'My missus sent me for {potion}. Don’t tell her I forgot the colour twice.'],
pleased: ['That’ll do nicely!', 'Smells like a good harvest.'], displeased: ['Hmm. Not quite what she asked for.', 'Bit off, innit?'],
},
{
key: 'innkeeper', title: 'Innkeeper', styles: ['tonic', 'syrup', 'warm', 'love', 'settling'], props: ['temperature', 'quantity'], budget: 0.9, strict: 1.2, minRank: 0,
look: { hat: 'cap', outfit: [0.45, 0.28, 0.2], beardChance: 0.3, apron: true },
greet: ['The common room’s full of coughing travellers. I need {potion}.', 'Make me {potion} — the guests pay well for a warm draught.'],
pleased: ['Perfect, they’ll be singing tonight!', 'On the house next time you visit.'], displeased: ['The regulars will grumble…', 'I’ll water it down and pretend.'],
},
{
key: 'bard', title: 'Bard', styles: ['syrup', 'tonic', 'fizzy', 'love', 'insight'], props: ['viscosity', 'volatility'], budget: 1.0, strict: 1.1, minRank: 0,
look: { hat: 'feather', outfit: [0.6, 0.2, 0.45], beardChance: 0.2 },
greet: ['A sweet, smooth {potion} for my throat — tonight I perform for a duke!', 'Brew me {potion}, alchemist, and I shall write a ballad of you.'],
pleased: ['Magnificent! I feel a song coming on.', 'Ah, honeyed perfection.'], displeased: ['My voice cracks just looking at it.', 'A minor key, I’m afraid.'],
},
{
key: 'healer', title: 'Healer', styles: ['elixir', 'salve', 'syrup', 'healing', 'antidote', 'settling', 'frostsalve'], props: ['viscosity', 'vitality', 'temperature'], budget: 1.15, strict: 0.9, minRank: 0,
look: { hat: 'hood', outfit: [0.85, 0.85, 0.8], beardChance: 0.1 },
greet: ['My patients need {potion}. Precision matters — lives depend on it.', 'I require {potion}, prepared exactly as described.'],
pleased: ['Excellent work. This will save lives.', 'Precisely right. Thank you.'], displeased: ['This won’t do for my patients.', 'Careless. I expected better.'],
},
{
key: 'knight', title: 'Knight', styles: ['elixir', 'heavy', 'salve', 'ardent', 'strength', 'healing'], props: ['vitality', 'strength', 'density'], budget: 1.25, strict: 1.0, minRank: 1,
look: { hat: 'helm', outfit: [0.6, 0.62, 0.68], beardChance: 0.6 },
greet: ['I ride for the border at dawn. Brew me {potion} — something with backbone.', 'The king’s coin, for {potion}. Make it hearty.'],
pleased: ['A warrior’s draught! My thanks.', 'This will see me through the battle.'], displeased: ['I’ve tasted better from a ditch.', 'Hm. It will have to do.'],
},
{
key: 'traveler', title: 'Traveller', styles: ['ardent', 'tonic', 'warm', 'firetonic', 'strength'], props: ['density', 'temperature', 'fire'], budget: 1.0, strict: 1.1, minRank: 0,
look: { hat: 'wide', outfit: [0.35, 0.4, 0.3], beardChance: 0.5 },
greet: ['The mountain pass is freezing. I need {potion}, light enough to carry.', 'Long road ahead. {potion}, please — quickly.'],
pleased: ['That’ll keep the frost out of my bones.', 'Safe roads to you, friend.'], displeased: ['Heavy as a stone, this.', 'I’ll manage, I suppose.'],
},
{
key: 'scholar', title: 'Scholar', styles: ['arcane', 'tonic', 'lumen', 'insight'], props: ['stability', 'arcana'], budget: 1.2, strict: 0.85, minRank: 1,
look: { hat: 'none', outfit: [0.25, 0.3, 0.5], beardChance: 0.4, glasses: true },
greet: ['For my research I require {potion}. It must be perfectly stable.', 'Fascinating shop. I need {potion} — homogeneous, mind you.'],
pleased: ['Remarkable consistency! Exactly as theorised.', 'This will make an excellent footnote.'], displeased: ['Inconsistent results. Disappointing.', 'The data will be noisy.'],
},
{
key: 'witch', title: 'Hedge Witch', styles: ['salve', 'fizzy', 'frost', 'arcane', 'bane', 'transmute', 'love'], props: ['viscosity', 'volatility', 'strength'], budget: 1.1, strict: 1.0, minRank: 1,
look: { hat: 'witch', outfit: [0.2, 0.25, 0.2], beardChance: 0 },
greet: ['Hehe… a {potion}, dearie. Thick enough to stand a spoon in.', 'The coven wants {potion}. Don’t ask what for.'],
pleased: ['Wicked work, dearie!', 'The coven will be pleased.'], displeased: ['Pah! A toad could brew better.', 'Too weak, too weak…'],
},
{
key: 'blacksmith', title: 'Blacksmith', styles: ['heavy', 'ardent', 'warm', 'firetonic', 'etching', 'strength'], props: ['temperature', 'density', 'fire'], budget: 1.1, strict: 1.1, minRank: 1,
look: { hat: 'bandana', outfit: [0.3, 0.22, 0.18], beardChance: 0.8, apron: true },
greet: ['Need {potion} for quenching. Hot, and heavy.', 'Forge is roaring. Bring me {potion}.'],
pleased: ['Hah! That’s the stuff.', 'Good and solid.'], displeased: ['Too thin. Like my patience.', 'That won’t temper anything.'],
},
{
key: 'noble', title: 'Noble', styles: ['tonic', 'elixir', 'arcane', 'lumen', 'love', 'transmute'], props: ['stability', 'color'], budget: 1.6, strict: 0.7, minRank: 2,
look: { hat: 'crown', outfit: [0.5, 0.1, 0.25], beardChance: 0.3 },
greet: ['I require {potion}, and the colour must be EXACT. I shall know.', 'My banquet demands {potion}. Spare no expense — but spare me mistakes.'],
pleased: ['Exquisite. You may be presented at court.', 'Acceptable. More than acceptable.'], displeased: ['Vulgar. Simply vulgar.', 'Did you even look at the colour?'],
},
{
key: 'wizard', title: 'Wizard', styles: ['arcane', 'fizzy', 'frost', 'lumen', 'panacea', 'transmute', 'insight'], props: ['arcana', 'volatility', 'stability'], budget: 1.5, strict: 0.85, minRank: 2,
look: { hat: 'wizard', outfit: [0.25, 0.2, 0.55], beardChance: 0.9 },
greet: ['Ah, an apprentice of the Art. Prepare {potion} — the stars align tonight.', 'I seek {potion} with unusual properties. Impress me.'],
pleased: ['The aether sings! Splendid.', 'Yes… yes! This will do.'], displeased: ['The aether is offended.', 'Mundane. Utterly mundane.'],
},
{
key: 'hunter', title: 'Hunter', styles: ['tonic', 'heavy', 'salve', 'frost', 'bane', 'frostsalve', 'strength'], props: ['stability', 'volatility', 'temperature'], budget: 1.05, strict: 1.0, minRank: 1,
look: { hat: 'hood', outfit: [0.3, 0.38, 0.22], beardChance: 0.5 },
greet: ['Something that won’t spoil in my pack — {potion}.', 'Big game in the woods. I’ll need {potion}.'],
pleased: ['Good. Steady as a held breath.', 'That’ll keep.'], displeased: ['It’s already separating.', 'Won’t last a day out there.'],
},
];
const FIRST = ['Aldric', 'Bryn', 'Cedric', 'Dagna', 'Edda', 'Fenwick', 'Gwen', 'Hob', 'Isolde', 'Jory', 'Kestrel', 'Liesl', 'Mabry', 'Nell', 'Osric', 'Perrin', 'Quill', 'Rowena', 'Sabine', 'Tamsin', 'Ulric', 'Vesna', 'Wynn', 'Yara', 'Zebedee', 'Agnes', 'Bertram', 'Cora', 'Dunstan', 'Elowen', 'Godric', 'Hilda', 'Ivo', 'Maud', 'Piers', 'Rosalind', 'Tobias', 'Wilda'];
const LAST = ['Ashdown', 'Brightwater', 'Copperpot', 'Dunmore', 'Elderberry', 'Fairweather', 'Greaves', 'Hollins', 'Ironside', 'Juniper', 'Kettleby', 'Larkspur', 'Millward', 'Nettlefold', 'Oakhart', 'Pennywhistle', 'Quarrel', 'Ravensby', 'Stonebridge', 'Thistlewood', 'Underhill', 'Vane', 'Whitlock', 'Yarrow'];
const TITLES = new Set(['Old', 'Young', 'Sir', 'Dame', 'Lady', 'Lord', 'Master', 'Mistress', 'Brother', 'Sister', 'Mother', 'Father', 'Granny', 'Gaffer', 'Widow', 'Captain']);
function shortName(name) {
const parts = String(name || '').split(' ').filter(Boolean);
return (parts.length > 1 && TITLES.has(parts[0]) ? parts[1] : parts[0]) || '';
}
const SKIN = [[0.96, 0.8, 0.66], [0.87, 0.66, 0.5], [0.72, 0.52, 0.36], [0.55, 0.38, 0.26], [0.4, 0.27, 0.18], [0.98, 0.86, 0.76]];
const HAIR = [[0.15, 0.1, 0.07], [0.35, 0.22, 0.12], [0.62, 0.38, 0.18], [0.85, 0.7, 0.4], [0.55, 0.55, 0.55], [0.9, 0.9, 0.88], [0.55, 0.2, 0.1]];
const PERSONA = {
farmer: [0.45, 3, 0.92, 0.5], innkeeper: [0.6, 3, 0.85, 0.5], bard: [0.3, 2, 0.75, 0.3], healer: [0.25, 2, 0.95, 0.95],
knight: [0.3, 2, 0.9, 0.6], traveler: [0.5, 3, 0.78, 0.5], scholar: [0.4, 3, 0.9, 0.9], witch: [0.7, 4, 0.6, 0.4],
blacksmith: [0.55, 3, 0.88, 0.5], noble: [0.2, 2, 0.62, 0.85], wizard: [0.4, 3, 0.82, 0.8], hunter: [0.5, 3, 0.8, 0.55],
};
function makePersona(rng, arch) {
const [haggle, rounds, honesty, proof] = PERSONA[arch.key] || [0.5, 3, 0.85, 0.5];
const j = (v, a) => Math.max(0, Math.min(1, v + rng.range(-a, a)));
return {
haggle: Math.round(j(haggle, 0.15) * 100) / 100,
patience: Math.max(2, rounds + rng.int(-1, 1)),
honesty: Math.round(j(honesty, 0.12) * 100) / 100,
proof: Math.round(j(proof, 0.1) * 100) / 100,
};
}
function makeCustomer(rng, arch) {
const name = `${rng.pick(FIRST)} ${rng.pick(LAST)}`;
const persona = makePersona(rng.fork('persona'), arch);
return {
persona,
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
return { ARCHETYPES, shortName, makeCustomer, archetypeOf, Rng };
})();
// src/game/evaluate.js
const __m23 = (() => {
const { EFFECTS, EFFECT_INDEX, EFFECT_KEYS, NE } = __m13;
const PROPERTY_LABELS = {
temperature: 'Temperature', quantity: 'Quantity', purity: 'Purity', ...Object.fromEntries(EFFECTS.map((e) => [e.key, e.label])),
};
function strongestUnwanted(effects, exclude = []) {
let m = 0, key = '';
if (!effects) return { value: 0, key };
for (let k = 0; k < NE; k++) {
if (exclude.includes(EFFECT_KEYS[k])) continue;
const v = Math.abs(effects[k] || 0);
if (v > m) { m = v; key = EFFECT_KEYS[k]; }
}
return { value: m, key };
}
function isEffectKey(key) {
return EFFECT_INDEX[key] !== undefined;
}
function scoreRequirement(req, m) {
let value, d;
switch (req.key) {
case 'temperature':
value = m.temperature;
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
function describeValue(key, value, m) {
void m;
switch (key) {
case 'temperature':
return `${Math.round(value)}°C`;
case 'purity':
return value < 0.05 ? 'pure' : `${value.toFixed(1)}% other magic`;
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
const w = r.req.key === 'quantity' ? 0.8 : 1;
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
return { PROPERTY_LABELS, strongestUnwanted, isEffectKey, scoreRequirement, describeValue, evaluatePotion };
})();
// src/simulation/constants.js
const __m24 = (() => {
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
// src/game/requests.js
const __m25 = (() => {
const REQUESTS = [
{ id: 'healing', title: 'Healing Draught', fx: [{ key: 'vitality' }], who: ['healer', 'farmer', 'innkeeper', 'knight', 'hunter'], minTier: 0,
story: ['My patients are wasting with fever. I need something that truly heals — and nothing else in it.', 'The goats are poorly and so is my back. A healing draught, plain and honest.', 'A traveller collapsed in my common room. Something to bring the colour back to his face.'] },
{ id: 'strength', title: 'Draught of Might', fx: [{ key: 'strength' }], who: ['knight', 'blacksmith', 'hunter', 'farmer', 'traveler'], minTier: 0,
story: ['The new anvil arrives tomorrow and it takes four men to lift. I want to be one of them.', 'Harvest is in and the carts are heavy. Strength in my arms, nothing more.', 'A tourney at the castle. My lance arm must not tire.'] },
{ id: 'love', title: 'Love Philtre', fx: [{ key: 'love' }], who: ['bard', 'innkeeper', 'noble', 'farmer'], minTier: 0,
story: ['There is someone I sing to every night, and she has not once looked up. Just a little warmth in her heart.', 'For a betrothal feast — it should warm every heart at the table, and do nothing else.', 'My husband has grown cold as a cellar. Remind him why he married me.'] },
{ id: 'warming', title: 'Warming Draught', fx: [{ key: 'fire' }], who: ['traveler', 'blacksmith', 'hunter', 'farmer'], minTier: 0,
story: ['The mountain pass is all ice. Something with real fire in it, against the cold.', 'My forge-hands work through the winter nights. Fire in the belly, nothing more.', 'The well froze and so did I. A warming draught, please.'] },
{ id: 'cooling', title: 'Cooling Draught', fx: [{ key: 'frost' }], who: ['healer', 'hunter', 'blacksmith', 'traveler'], minTier: 1,
story: ['A child with a burning fever. It must be properly cold-natured.', 'I crossed the salt flats and my blood is still boiling. Something icy.', 'A dragon-bite on my forearm. Frost, and plenty of it.'] },
{ id: 'insight', title: 'Draught of Insight', fx: [{ key: 'arcana' }], who: ['scholar', 'wizard', 'noble'], minTier: 1,
story: ['My treatise is stuck on the same page for a month. Sharpen my mind — and only my mind.', 'The stars align tonight. I need clear arcane sight for the reading.', 'Examinations at the academy. True arcana, if you please.'] },
{ id: 'change', title: 'Transmutation Elixir', fx: [{ key: 'transformation' }], who: ['witch', 'wizard', 'noble', 'bard'], minTier: 2,
story: ['A masquerade at the duke’s. I wish to arrive as someone — something — else.', 'My garden grows too plainly. I want to coax it into stranger shapes.', 'The coven’s rite needs a draught of pure change.'] },
{ id: 'settling', title: 'Settling Draught', fx: [{ key: 'acidity', sign: -1 }], who: ['innkeeper', 'healer', 'noble', 'farmer'], minTier: 1,
story: ['Too much feasting. My stomach burns with acid — something chalky and alkaline to settle it.', 'Heartburn, every night since the harvest supper. An alkaline draught, nothing else.'] },
{ id: 'etching', title: 'Etching Acid', fx: [{ key: 'acidity' }], who: ['blacksmith', 'scholar', 'witch'], minTier: 1, drunk: false, tolerate: ['toxicity', 'fire'],
story: ['I etch my maker’s mark into blades. A strong acid that bites steel.', 'Copper plates for my engravings. It must bite cleanly.'] },
{ id: 'bane', title: 'Pest Bane', fx: [{ key: 'toxicity' }], who: ['farmer', 'hunter', 'innkeeper'], minTier: 1, drunk: false, tolerate: ['death', 'acidity'],
story: ['Rats in the granary, bold as cats. It has to be poisonous to them.', 'Slugs have eaten half my cabbages. Deadly to pests, please.'] },
{ id: 'expedition', title: 'Expedition Draught', fx: [{ key: 'strength' }, { key: 'transformation', share: 0.6 }], who: ['knight', 'hunter', 'traveler'], minTier: 2,
story: ['We ride into the Thornwastes. I must be strong enough to carry the wounded, and able to change shape to slip past the wardens.', 'A long patrol beyond the border. Strength for the march, and a change of form for the night watch.'] },
{ id: 'hearth', title: 'Hearth-and-Heart Cordial', fx: [{ key: 'fire' }, { key: 'love', share: 0.7 }], who: ['innkeeper', 'farmer', 'bard'], minTier: 2,
story: ['Our cottage is cold and so is my marriage. Fire for the hearth and love for the heart, in one cup.', 'A winter wedding in a draughty barn. Warm them through, and warm them to each other.'] },
{ id: 'recovery', title: 'Soldier’s Recovery', fx: [{ key: 'vitality' }, { key: 'strength', share: 0.6 }], who: ['knight', 'healer', 'hunter'], minTier: 2,
story: ['My company limps home from the siege. Heal the wounds and put the strength back in their legs.', 'Back from a bear hunt with three broken ribs. Mend me, and make me strong enough to try again.'] },
{ id: 'meditation', title: 'Glacial Meditation', fx: [{ key: 'arcana' }, { key: 'frost', share: 0.6 }], who: ['wizard', 'scholar'], minTier: 2,
story: ['A week of meditation on the glacier. A cold, clear mind — frost to endure, arcana to see.', 'I study the ice-runes of the north. I must think clearly and feel no cold.'] },
{ id: 'forgefire', title: 'Forge-Fire Tonic', fx: [{ key: 'strength' }, { key: 'fire', share: 0.6 }], who: ['blacksmith', 'knight'], minTier: 2,
story: ['The great bell must be cast tonight. Strength to swing the hammer, fire to stand the heat.', 'A duel at dawn in the frozen yard. Strength, and fire against the cold.'] },
{ id: 'blessing', title: 'Wedding Blessing', fx: [{ key: 'love' }, { key: 'vitality', share: 0.6 }], who: ['noble', 'bard', 'healer'], minTier: 2,
story: ['My daughter weds the baron’s son. A toast for long life and true affection.', 'A blessing for the newlyweds: health to them, and love between them.'] },
{ id: 'shapeshift', title: 'Shapeshifter’s Study', fx: [{ key: 'transformation' }, { key: 'arcana', share: 0.6 }], who: ['wizard', 'witch', 'scholar'], minTier: 3,
story: ['I study the old shapeshifters. I need to change, and understand the change while it happens.', 'The coven elders want a true shifting draught: change of form, guided by arcane sight.'] },
{ id: 'fevercure', title: 'Fever Cure', fx: [{ key: 'vitality' }, { key: 'frost', share: 0.5 }], who: ['healer', 'noble'], minTier: 3,
story: ['The marsh fever: it burns them up from inside. It must heal, and it must cool.', 'The prince is burning with fever. Healing, and cold to break the heat.'] },
{ id: 'warpath', title: 'War-Path Draught', fx: [{ key: 'strength' }, { key: 'fire', share: 0.5 }, { key: 'vitality', share: 0.5 }], who: ['knight'], minTier: 4,
story: ['The northern campaign. Strength, fire against the frost and healing for the march — the general’s own order.'] },
{ id: 'starseer', title: 'Star-Seer’s Elixir', fx: [{ key: 'arcana' }, { key: 'transformation', share: 0.5 }, { key: 'love', share: 0.4 }], who: ['wizard', 'noble'], minTier: 4,
story: ['A rite under the comet: sight, change and the bond between the casters — all three, in measure.'] },
];
const TIER_TARGET = [[8, 15], [10, 18], [13, 22], [17, 28], [22, 34]];
const PURITY_LIMIT = 1.2;
function requestById(id) {
return REQUESTS.find((r) => r.id === id);
}
return { REQUESTS, TIER_TARGET, PURITY_LIMIT, requestById };
})();
// src/game/commissions.js
const __m16 = (() => {
const { Rng } = __m6;
const { describeColor } = __m8;
const { predictPlan, planCost, arcaneRegime, ACTIVATION_MARGIN } = __m17;
const { ARCHETYPES, makeCustomer, archetypeOf } = __m22;
const { evaluatePotion } = __m23;
const { SIM } = __m24;
const { EFFECT_INDEX, EFFECT_BY_KEY, EFFECT_KEYS, NE, interact } = __m13;
const { thresholdToCelsius, isMagical } = __m15;
const { compatFactor } = __m14;
const { REQUESTS, TIER_TARGET, PURITY_LIMIT, requestById } = __m25;
function effectRequirement(key, sign, min) {
if (sign < 0) {
const max = -Math.max(3, Math.round(min));
return { key, kind: /** @type {'max'} */ ('max'), target: max, tol: 0, zero: 14, label: `alkaline, ${max} or lower`, effect: true };
}
const t = Math.max(3, Math.round(min));
return { key, kind: /** @type {'min'} */ ('min'), target: t, tol: 0, zero: Math.max(6, t * 0.6), label: `at least ${t}%`, effect: true, name: EFFECT_BY_KEY[key].label.toLowerCase() };
}
function purityRequirement(exclude, limit = PURITY_LIMIT) {
return { key: 'purity', kind: /** @type {'max'} */ ('max'), target: limit, tol: 0, zero: 2.5, exclude: exclude.slice(), label: `no other effect above ${limit}%`, effect: true };
}
function unwantedMax(effects, exclude) {
let m = 0, key = '';
for (let k = 0; k < NE; k++) {
if (exclude.includes(EFFECT_KEYS[k])) continue;
const v = Math.abs(effects[k]);
if (v > m) { m = v; key = EFFECT_KEYS[k]; }
}
return { value: m, key };
}
function solventsOf(ctx) {
const R = ctx.world.roles;
return [R.water, R.spirit, R.oil].filter((id) => id && ctx.available.has(id)).map(ctx.lookup);
}
function prepFor(m, ctx, solvents) {
const water = solvents.find((x) => x.id === ctx.world.roles.water) || solvents[0];
if (m.form === 'liquid') {
const compat = solvents.find((l) => compatFactor(m.compat[0], m.compat[1], l.compat[0], l.compat[1]) > 0.6);
return { solvent: compat || null, heatTo: 20, coolTo: 20, hold: 6 };
}
if (m.form === 'gas') return null;
if (m.form === 'solid' && m.melt < 15 && m.boil > 60) {
const compat = solvents.find((l) => compatFactor(m.compat[0], m.compat[1], l.compat[0], l.compat[1]) > 0.6);
return { solvent: compat || null, heatTo: 20, coolTo: 20, hold: 12 };
}
const ground = m.form === 'solid';
const rx = ctx.world.reactions.find((r) => r.a === m.id && (r.wet || r.kind === 'mix' || r.kind === 'contact') && r.products.length === 1 && /^rw_(extract|steep|infuse|mandrake|starquartz|dragonoil)/.test(r.id));
if (rx) {
const solvent = rx.b ? solvents.find((l) => l.id === rx.b) : water;
if (!solvent) return null;
const boil = isFinite(solvent.boil) ? solvent.boil : 400;
if (rx.maxT <= 20) {
const floor = coldFloor(ctx.cap);
const T = Math.max(Math.round((rx.minT + rx.maxT) / 2), floor + 1);
if (T > rx.maxT - 3) return null;
return { solvent, heatTo: 20, coolTo: T, hold: 22, ground, lo: Math.max(rx.minT + 1, floor + 1), hi: rx.maxT - 3 };
}
const lo = rx.minT + 7, hi = Math.min(rx.maxT - 4, boil - 8, ctx.cap.maxFlame - 40);
if (hi < lo) return null;
if (lo <= 15) {
const T = Math.max(lo, Math.min(hi, ctx.cap.minCool + 3));
if (T > hi || T < ctx.cap.minCool + 2) return null;
return { solvent, heatTo: 20, coolTo: T, hold: 22, ground };
}
return { solvent, heatTo: Math.round((lo + hi) / 2), coolTo: 20, hold: 22, ground, lo, hi };
}
const compat = solvents.find((l) => compatFactor(m.compat[0], m.compat[1], l.compat[0], l.compat[1]) > 0.6);
if (!compat || (m.solubility || 0) < 0.03) return null;
return { solvent: compat, heatTo: 20, coolTo: 20, hold: 10, ground };
}
function coldFloor(cap) {
return cap.minCool > 0 ? 9 : 3;
}
const NEUTRALISABLE = new Set(['fire', 'frost', 'vitality', 'death', 'toxicity', 'acidity']);
function searchPlan(wanted, exclude, ctx, rng, n, o) {
const solvents = solventsOf(ctx);
if (!solvents.length) return null;
const pot = (m, w) => w.sign * (((m.effects || {})[w.key]) || 0);
const admissible = (m) => Object.entries(m.effects).every(([k, v]) => Math.abs(Number(v) || 0) < 1 || exclude.includes(k) || NEUTRALISABLE.has(k));
const water = ctx.lookup(ctx.world.roles.water);
const hot = Math.min(ctx.cap.maxFlame - 40, (water && isFinite(water.boil) ? water.boil : 100) - 6), cold = 20 + 0.55 * (ctx.cap.minCool - 20);
const wakes = (m) => isMagical(m) && (m.arcane.thr >= 0 ? thresholdToCelsius(m.arcane.thr) + ACTIVATION_MARGIN + 4 <= hot : thresholdToCelsius(m.arcane.thr) - ACTIVATION_MARGIN - 4 >= cold);
const pool = [...ctx.available].map(ctx.lookup)
.filter((m) => m && m.effects && m.form !== 'gas' && !m.awakened && !m.remains && !m.product && Object.keys(m.effects).length && admissible(m) && (!o.activation || wakes(m))
&& !(ctx.avoid && ctx.avoid.has(m.id)) && obtainable(ctx, m.id, 40));
const carriers = wanted.map((w) => pool.filter((m) => pot(m, w) >= 4)
.map((m) => {
let side = 0;
for (const [k, v] of Object.entries(m.effects)) if (!exclude.includes(k)) side += Math.abs(Number(v) || 0);
return { m, score: pot(m, w) / (1 + side * 0.04) * (0.8 + 0.4 * rng.next()) };
})
.sort((a, b) => b.score - a.score).slice(0, 4).map((c) => c.m));
if (carriers.some((c) => !c.length)) return null;
const tries = [];
for (let a = 0; a < 3; a++) {
const pick = wanted.map((w, k) => carriers[k][Math.min(carriers[k].length - 1, a === 0 ? 0 : rng.int(0, carriers[k].length - 1))]);
if (o.activation && new Set(pick.map((m) => m.arcane.thr >= 0)).size > 1) continue;
if (!tries.some((t) => t.every((m, k) => m === pick[k]))) tries.push(pick);
}
for (const pick of tries) {
const sign = pick[0].arcane ? pick[0].arcane.thr >= 0 : true;
const plan = composePlan(pick, wanted, exclude, ctx, solvents, n, o, o.activation ? pool.filter((m) => (m.arcane.thr >= 0) === sign) : pool);
if (plan) return plan;
}
return null;
}
function composePlan(pick, wanted, exclude, ctx, solvents, n, o, pool) {
const uniq = [...new Set(pick)];
const preps = uniq.map((m) => prepFor(m, ctx, solvents));
if (preps.some((p) => !p)) return null;
let solvent = null, win = null, chill = false, hold = 8;
for (const p of preps) {
if (p.solvent && solvent && p.solvent.id !== solvent.id) continue;
const pw = p.lo !== undefined ? [p.lo, p.hi] : p.coolTo < 20 ? [Math.max(ctx.cap.minCool + 2, p.coolTo - 3), p.coolTo + 3] : null;
if (pw) {
const isCold = p.coolTo < 20;
if (win && isCold !== chill) continue;
const nw = win ? [Math.max(win[0], pw[0]), Math.min(win[1], pw[1])] : pw;
if (nw[0] > nw[1]) continue;
win = nw;
chill = isCold;
}
solvent = solvent || p.solvent;
hold = Math.max(hold, p.hold);
}
solvent = solvent || solvents.find((x) => x.id === ctx.world.roles.water) || solvents[0];
const quietServe = o.activation ? [] : [o.serve];
let stageT = null;
if (win) {
const mid = (win[0] + win[1]) / 2;
for (let T = Math.ceil(win[0]); T <= win[1]; T++) {
if (arcaneRegime(uniq.map((m) => m.id), ctx.lookup, [T, ...quietServe]) !== 'quiet') continue;
if (stageT === null || Math.abs(T - mid) < Math.abs(stageT - mid)) stageT = T;
}
if (stageT === null) return null;
}
const temps = stageT === null ? quietServe : [stageT, ...quietServe];
const helpers = pool.filter((m) => !uniq.includes(m) && arcaneRegime([...uniq.map((c) => c.id), m.id], ctx.lookup, temps) === 'quiet');
const solidFrac = (id) => ctx.lookup(id).form !== 'liquid';
const plainPlan = (ing) => /** @type {import('./predict.js').BrewPlan} */ ({ ingredients: ing, heatTo: Math.max(20, o.serve), coolTo: Math.min(20, o.serve), serveTemp: o.serve, knead: ing.some((i) => solidFrac(i.id)), crush: ing.some((i) => solidFrac(i.id) && ctx.lookup(i.id).form === 'solid'), hold: 8 });
const build = (x) => {
let used = 0, solids = 0;
for (const [id, f] of x) { used += f; if (solidFrac(id)) solids += f; }
if (used > 0.97 || solids > 0.5) return null;
const ing = [];
const ns = Math.round(n * (1 - used));
if (ns >= 2) ing.push({ id: solvent.id, n: ns });
for (const [id, f] of x) {
const c = Math.round(n * f);
if (c < 1) continue;
ing.push({ id, n: c });
}
if (ing.length < 2) return null;
return plainPlan(ing);
};
const edgeOk = (plan, ids) => {
const held = [plan.steep ? plan.steep.T : null, plan.activate ? plan.heatTo : null, plan.activate ? plan.coolTo : null].filter((t) => t !== null);
if (!held.length) return true;
for (const id of ids) {
const rx = ctx.world.reactions.find((r) => r.a === id && r.wet && r.products.length === 1 && /^rw_(extract|steep|infuse)/.test(r.id));
if (!rx) continue;
const cold = rx.maxT <= 20;
const inside = held.some((t) => (cold ? t >= rx.minT + 1 && t <= rx.maxT - 2 : t >= rx.minT + 7 && t <= rx.maxT - 2));
const edge = held.some((t) => (cold ? t > rx.maxT - 2 && t <= rx.maxT + 3 : t >= rx.minT - 3 && t < rx.minT + 7));
if (edge && !inside) return false;
}
return true;
};
const finish = (plan) => {
const ids = plan.ingredients.map((i) => i.id);
if (stageT !== null) {
plan.steep = { T: stageT, hold };
plan.heatTo = Math.max(plan.heatTo, stageT);
plan.coolTo = Math.min(plan.coolTo, stageT);
}
if (!edgeOk(plan, ids)) return null;
const pre = predictPlan(ctx.world, ctx.lookup, plan);
if (arcaneRegime([...ids, ...Object.keys(pre.composition)], ctx.lookup, temps) !== 'quiet') return null;
if (plan.heatTo > ctx.cap.maxFlame - 40 || plan.coolTo < ctx.cap.minCool + 2) return null;
if (!o.activation) return pre.awakened ? null : pre;
if (pre.threshold === null) return null;
const Ta = thresholdToCelsius(pre.threshold);
if (pre.threshold >= 0) {
const T = Math.ceil(Ta + ACTIVATION_MARGIN + 4);
const boil = Math.min(...plan.ingredients.map((i) => ctx.lookup(i.id).boil).filter((b) => isFinite(b)), 400);
if (T > Math.min(ctx.cap.maxFlame - 40, boil - 6)) return null;
plan.heatTo = Math.max(plan.heatTo, T);
} else {
const T = Math.floor(Ta - ACTIVATION_MARGIN - 4);
if (T < 20 + 0.55 * (ctx.cap.minCool - 20)) return null;
plan.coolTo = Math.min(plan.coolTo, T);
}
plan.hold = 18;
plan.activate = true;
if (!edgeOk(plan, ids)) return null;
const pred = predictPlan(ctx.world, ctx.lookup, plan);
return pred.awakened ? pred : null;
};
const model = new Map();
const probe = (m, f) => {
const plan = build(new Map([[m.id, f]]));
if (!plan) return null;
if (stageT !== null) {
plan.steep = { T: stageT, hold };
plan.heatTo = Math.max(plan.heatTo, stageT);
plan.coolTo = Math.min(plan.coolTo, stageT);
}
const pr = predictPlan(ctx.world, ctx.lookup, plan);
const share = (plan.ingredients.find((i) => i.id === m.id)?.n || 0) / pr.totalParticles;
if (share <= 0) return null;
const g = o.activation && isMagical(m) ? m.arcane.gain : 1;
return pr.raw.map((v) => (v / share) * g);
};
const vecOf = (m, f = 0.2) => {
if (!model.has(m.id)) model.set(m.id, probe(m, f) || new Array(NE).fill(0));
return /** @type {number[]} */ (model.get(m.id));
};
const laws = ctx.world.laws || [];
const tmp = new Float64Array(NE);
const outcome = (ids, xs) => {
tmp.fill(0);
for (let j = 0; j < ids.length; j++) {
const v = /** @type {number[]} */ (model.get(ids[j]));
for (let k = 0; k < NE; k++) tmp[k] += xs[j] * v[k];
}
return interact(tmp, laws);
};
const wIdx = wanted.map((w) => EFFECT_INDEX[w.key]);
const free = EFFECT_KEYS.map((k) => exclude.includes(k));
const badness = (e) => {
let b = 0;
wanted.forEach((w, j) => {
const v = w.sign * e[wIdx[j]];
const lo = w.target * 1.15, hi = w.target * 1.45;
if (v < lo) b += 40 * ((lo - v) / w.target) ** 2;
else if (v > hi) b += 8 * ((v - hi) / w.target) ** 2;
});
for (let k = 0; k < NE; k++) {
if (free[k]) continue;
const a = Math.abs(e[k]);
b += 0.05 * a * a + (a > 0.3 ? 6 * (a - 0.3) ** 2 : 0);
}
return b;
};
const solve = (ids, start) => {
const xs = start.slice();
const solid = ids.map(solidFrac);
const feasible = () => {
let used = 0, sol = 0;
for (let j = 0; j < xs.length; j++) { if (xs[j] < 0) return false; used += xs[j]; if (solid[j]) sol += xs[j]; }
return used <= 0.92 && sol <= 0.48;
};
const cost = () => badness(outcome(ids, xs)) + 0.02 * xs.reduce((a, v) => a + v, 0);
let best = cost(), step = 0.08;
for (let it = 0; it < 220 && step > 0.0015; it++) {
let moved = false;
for (let j = 0; j < xs.length; j++) {
for (const d of [step, -step]) {
const old = xs[j];
xs[j] = Math.max(0, old + d);
if (xs[j] !== old && feasible()) {
const c = cost();
if (c < best - 1e-9) { best = c; moved = true; continue; }
}
xs[j] = old;
}
}
if (!moved) step *= 0.5;
}
return { xs, cost: best };
};
const good = (e) => wanted.every((w, j) => w.sign * e[wIdx[j]] >= w.target * 1.04) && EFFECT_KEYS.every((k, i) => free[i] || Math.abs(e[i]) <= PURITY_LIMIT * 0.45);
for (const m of uniq) vecOf(m);
if (uniq.some((m) => model.get(m.id).every((v) => v === 0))) return null;
const E_ = EFFECT_INDEX;
const net = (v) => [v[E_.fire] - v[E_.frost], v[E_.vitality] - v[E_.death] - 2 * v[E_.toxicity], v[E_.acidity], v[E_.strength], v[E_.love], v[E_.arcana], v[E_.transformation]];
const NC = 7;
const tgt = new Array(NC).fill(0), wt = new Array(NC).fill(6);
const chan = { fire: [0, 1], frost: [0, -1], vitality: [1, 1], acidity: [2, 1], strength: [3, 1], love: [4, 1], arcana: [5, 1], transformation: [6, 1] };
const convex = wanted.every((w) => chan[w.key]);
for (const w of wanted) {
if (!chan[w.key]) continue;
const [c, sg] = chan[w.key];
tgt[c] = sg * w.sign * w.target * 1.25;
wt[c] = 40 / (w.target * w.target);
}
let ids = uniq.map((m) => m.id);
let xs0 = ids.map(() => 0.25);
if (convex) {
const cand = [...uniq, ...helpers];
for (const m of helpers) vecOf(m);
const M = cand.map((m) => net(model.get(m.id)));
const solid = cand.map((m) => solidFrac(m.id));
const x = /** @type {number[]} */ (cand.map((m) => (uniq.includes(m) ? 0.15 : 0)));
const r = tgt.map((t, c) => cand.reduce((acc, m, j) => acc + M[j][c] * x[j], 0) - t);
for (let sweep = 0; sweep < 300; sweep++) {
let change = 0;
for (let j = 0; j < cand.length; j++) {
let g = 0.02, hh = 0;
for (let c = 0; c < NC; c++) { g += 2 * wt[c] * M[j][c] * r[c]; hh += 2 * wt[c] * M[j][c] * M[j][c]; }
if (hh <= 1e-12) continue;
let nx = Math.max(0, x[j] - g / hh);
let used = 0, sol = 0;
for (let q = 0; q < cand.length; q++) if (q !== j) { used += x[q]; if (solid[q]) sol += x[q]; }
nx = Math.min(nx, 0.92 - used, solid[j] ? 0.48 - sol : 1);
nx = Math.max(0, nx);
const d = nx - x[j];
if (d === 0) continue;
for (let c = 0; c < NC; c++) r[c] += M[j][c] * d;
x[j] = nx;
change = Math.max(change, Math.abs(d));
}
if (change < 1e-5) break;
}
const keep = cand.map((m, j) => ({ m, f: x[j], c: uniq.includes(m) })).filter((k) => k.c || k.f * n >= 0.6)
.sort((p, q) => (q.c ? 1 : 0) - (p.c ? 1 : 0) || q.f - p.f).slice(0, Math.max(uniq.length + 1, 5));
ids = keep.map((k) => k.m.id);
xs0 = keep.map((k) => Math.max(k.f, 0.01));
}
let sol = solve(ids, xs0);
if (!good(outcome(ids, sol.xs)) && !convex) {
const cands = helpers.filter((m) => !ids.includes(m.id)).slice(0, 12);
let bestTry = null;
for (const m of cands) {
vecOf(m);
const ids2 = [...ids, m.id];
const t = solve(ids2, [...sol.xs, 0.05]);
if (!bestTry || t.cost < bestTry.sol.cost) bestTry = { ids: ids2, sol: t };
}
if (bestTry && bestTry.sol.cost < sol.cost * 0.95) { ids = bestTry.ids; sol = bestTry.sol; }
}
const accept = (pred) => wanted.every((w, j) => {
const v = w.sign * pred.effects[wIdx[j]];
return v >= w.target * 1.02 && v <= w.target * 1.7;
}) && unwantedMax(pred.effects, exclude).value <= PURITY_LIMIT * 0.6;
const toMap = (xs) => new Map(/** @type {[string, number][]} */ (ids.map((id, j) => [id, xs[j]])).filter(([, f]) => f * n >= 0.5));
let best = null;
for (let it = 0; it < 3; it++) {
const plan = build(toMap(sol.xs));
if (!plan) break;
const pred = finish(plan);
if (!pred) break;
if (accept(pred)) return { plan, pred };
const err = planError(pred, wanted, wIdx, exclude);
if (!best || err < best.err) best = { plan, pred, err };
for (const id of ids) {
const f = sol.xs[ids.indexOf(id)];
const v = probe(ctx.lookup(id), Math.max(0.03, f));
if (v) model.set(id, v);
}
sol = solve(ids, sol.xs);
}
if (!best || best.err > 2) return null;
let cur = best;
for (let step = 0; step < 5; step++) {
let better = null;
for (let j = 0; j < cur.plan.ingredients.length; j++) {
for (const d of [1, -1]) {
const ing = cur.plan.ingredients.map((i) => ({ ...i }));
ing[j].n += d;
if (ing[j].n < 1) continue;
const p2 = plainPlan(ing);
const r2 = finish(p2);
if (!r2) continue;
const err = planError(r2, wanted, wIdx, exclude);
if (err < (better ? better.err : cur.err) - 1e-6) better = { plan: p2, pred: r2, err };
}
}
if (!better) break;
cur = better;
if (accept(cur.pred)) return { plan: cur.plan, pred: cur.pred };
}
return null;
}
function planError(pred, wanted, wIdx, exclude) {
let e = 0;
wanted.forEach((w, j) => {
const v = w.sign * pred.effects[wIdx[j]];
if (v < w.target * 1.08) e += 4 * (w.target * 1.08 - v) / w.target;
else if (v > w.target * 1.6) e += (v - w.target * 1.6) / w.target;
});
for (let k = 0; k < NE; k++) {
if (exclude.includes(EFFECT_KEYS[k])) continue;
const a = Math.abs(pred.effects[k]);
if (a > PURITY_LIMIT * 0.5) e += a - PURITY_LIMIT * 0.5;
}
return e;
}
function requestsFor(arch, tier, event, recent = []) {
let list = REQUESTS.filter((r) => r.minTier <= tier && r.who.includes(arch.key));
const bonus = { winter: ['warming', 'hearth', 'forgefire'], plague: ['healing', 'recovery', 'fevercure'], conclave: ['insight', 'meditation', 'shapeshift'], festival: ['love', 'blessing', 'hearth'] }[event];
if (bonus) list = list.concat(REQUESTS.filter((r) => bonus.includes(r.id) && r.minTier <= tier));
const fresh = list.filter((r) => !recent.slice(0, 4).some((s) => s && s.split('+')[0] === r.id));
return fresh.length ? fresh : list;
}
function obtainable(ctx, id, ml) {
if (!ctx.supply) return true;
if (id === ctx.world.roles.water) return true;
return ctx.supply(id) >= ml || (!!ctx.buyable && ctx.buyable(id));
}
const TEST_MARGIN = 1.15;
function checkSupply(plan, ctx) {
const out = { ok: true, cost: 0, short: /** @type {string[]} */ ([]), gather: /** @type {{id:string, ml:number}[]} */ ([]), buy: /** @type {{id:string, ml:number}[]} */ ([]) };
if (!ctx.supply) return out;
const need = new Map();
for (const ing of plan.ingredients) need.set(ing.id, (need.get(ing.id) || 0) + ing.n * SIM.ML_PER_PARTICLE * TEST_MARGIN);
for (const [id, ml] of need) {
if (id === ctx.world.roles.water) continue;
const free = ctx.supply(id);
const stock = ctx.stock ? ctx.stock(id) : 0;
if (free >= ml) { if (ml > stock) out.gather.push({ id, ml: Math.ceil((ml - stock) / 5) * 5 }); continue; }
if (free > stock) out.gather.push({ id, ml: Math.ceil((free - stock) / 5) * 5 });
if (ctx.buyable && ctx.buyable(id)) {
const ml2 = Math.ceil((ml - free) / 100) * 100;
out.buy.push({ id, ml: ml2 });
out.cost += (ml2 / 100) * ctx.priceOf(id);
} else out.short.push(id);
}
if (out.short.length || out.cost > (ctx.coins ?? Infinity) + 20) out.ok = false;
return out;
}
const TECHNIQUES = [
{
id: 'strong', name: 'Strong and compact', mechanic: 'concentration', minTier: 2, who: ['hunter', 'traveler', 'knight', 'healer', 'wizard', 'witch', 'blacksmith'],
lesson: 'Stronger than a plain brew of these herbs gives. Boil water off with the lid open — the magic stays, but its side effects grow with it and must be cancelled harder — or brew with more herb and less water.',
apply: ({ plan, pred, ctx, rng, wanted, exclude }) => {
const water = ctx.world.roles.water;
const nW = plan.ingredients.filter((i) => i.id === water).reduce((a, i) => a + i.n, 0);
const tot = plan.ingredients.reduce((a, i) => a + i.n, 0);
if (nW < tot * 0.35 || plan.ingredients.some((i) => i.id === ctx.world.roles.spirit)) return null;
const frac = Math.round(rng.range(0.2, 0.3) * 100) / 100;
const p2 = { ...plan, reduce: { frac } };
const r2 = predictPlan(ctx.world, ctx.lookup, p2);
if (r2.reactions.length !== pred.reactions.length || r2.awakened !== pred.awakened) return null;
if (unwantedMax(r2.effects, exclude).value > PURITY_LIMIT * 0.6) return null;
if (!wanted.every((w) => w.sign * r2.effects[EFFECT_INDEX[w.key]] >= w.sign * pred.effects[EFFECT_INDEX[w.key]] * 1.25)) return null;
return { plan: p2, pred: r2, strengthen: true, reqs: [], say: 'Make it strong and compact — a little goes a long way where I am going.' };
},
},
];
function techniqueById(id) {
return TECHNIQUES.find((t) => t.id === id);
}
function migrateTechniques(ids) {
return [...new Set(ids.map((t) => (t === 'concentrate' ? 'strong' : t)).filter((t) => techniqueById(t)))];
}
function generateCommission(ctx, rng, opts = {}) {
const tier = Math.max(0, Math.min(4, opts.tier ?? Math.min(4, ctx.rank)));
const archetypes = ARCHETYPES.filter((a) => a.minRank <= ctx.rank);
const archKey = opts.archetype || (opts.patron && opts.patron.archetype);
for (let attempt = 0; attempt < (opts.simple ? 12 : 30); attempt++) {
const arch = archKey ? archetypeOf(archKey) : rng.pick(archetypes);
const bottleMl = [100, 150, 200, 250, 300][tier] * (opts.contract ? 1.5 : 1);
const bottleN = Math.round(bottleMl / SIM.ML_PER_PARTICLE);
const vessel = { pot: 310, copper: 440, grand: 600, small: 1400, medium: 2000, large: 2700 }[ctx.cap.size] || 310;
const totalN = Math.min(Math.round(bottleN * rng.range(1.7, 2.3)), Math.floor(vessel * 0.45));
let requests = opts.request ? [requestById(opts.request)].filter(Boolean) : requestsFor(arch, tier, ctx.event, opts.recent);
if (opts.simple) requests = REQUESTS.filter((r) => r.minTier === 0 && r.fx.length === 1);
if (!requests.length) continue;
const com = effectCommission(rng.pick(requests), arch, tier, ctx, rng, totalN, bottleMl, bottleN, opts);
if (com) return com;
}
return null;
}
function effectCommission(req, arch, tier, ctx, rng, totalN, bottleMl, bottleN, opts) {
const [lo, hi] = TIER_TARGET[tier];
const serve = 20;
let found = null, activation = false, wanted = [], exclude = [], supply = null;
const local = { ...ctx, avoid: new Set(ctx.avoid || []) };
const mains = opts.simple ? [lo] : [Math.round(rng.range(lo, hi)), lo];
if (tier >= 3) mains.push(TIER_TARGET[tier - 1][0], TIER_TARGET[tier - 2][0]);
outer: for (const main of mains) {
wanted = req.fx.map((f, k) => ({ key: f.key, sign: f.sign || 1, target: k === 0 ? main : Math.max(4, Math.round(main * (f.share || 0.6) * rng.range(0.9, 1.1))) }));
exclude = [...wanted.map((w) => w.key), ...(req.tolerate || [])];
for (let tries = 0; tries < 3; tries++) {
found = searchPlan(wanted, exclude, local, rng, totalN, { activation: false, serve });
activation = false;
if (!found && tier >= 2) {
found = searchPlan(wanted, exclude, local, rng, totalN, { activation: true, serve });
activation = !!found;
}
if (!found) break;
supply = checkSupply(found.plan, local);
if (supply.ok) break outer;
const drop = supply.short.length ? supply.short : supply.buy.sort((a, b) => b.ml * ctx.priceOf(b.id) - a.ml * ctx.priceOf(a.id)).slice(0, 1).map((x) => x.id);
for (const id of drop) local.avoid.add(id);
found = null;
}
}
if (!found) return null;
let { plan, pred } = found;
const strict = arch.strict * (opts.contract ? 0.8 : 1) * (opts.simple ? 1.4 : 1);
const chosen = [];
const techReqs = [];
let say = [];
if (!opts.simple) {
const n = tier <= 1 ? (rng.chance(0.35) ? 1 : 0) : tier === 2 ? (rng.chance(0.65) ? 1 : 0) : 1 + (rng.chance(0.4) ? 1 : 0);
const forced = (opts.techniques || []).map(techniqueById).filter(Boolean);
const pool = TECHNIQUES.filter((t) => t.minTier <= tier && !forced.includes(t));
const weighted = rng.shuffle(pool).sort((a, b) => (b.who.includes(arch.key) ? 1 : 0) - (a.who.includes(arch.key) ? 1 : 0));
for (const t of [...forced, ...weighted]) {
if (chosen.length >= Math.max(n, forced.length)) break;
const r = t.apply({ plan, pred, ctx: local, rng, tier, strict, wanted, exclude, request: req });
if (!r) continue;
if (r.plan) { plan = r.plan; pred = r.pred || predictPlan(ctx.world, ctx.lookup, plan); }
if (unwantedMax(pred.effects, exclude).value > PURITY_LIMIT * 0.6) return null;
techReqs.push(...r.reqs);
chosen.push(t.id);
if (r.say) say.push(r.say);
}
if (chosen.length && !checkSupply(plan, local).ok) return null;
if (!wanted.every((w) => w.sign * pred.effects[EFFECT_INDEX[w.key]] >= w.target * 1.0)) return null;
}
const reqs = [];
for (const w of wanted) {
const v = w.sign * pred.effects[EFFECT_INDEX[w.key]];
reqs.push(effectRequirement(w.key, w.sign, Math.min(chosen.includes('strong') ? v * 0.85 : w.target, v * 0.88)));
}
if (tier >= 3 && strict < 1 && rng.chance(0.4)) {
const r0 = reqs[0], v = wanted[0].sign * pred.effects[EFFECT_INDEX[wanted[0].key]];
if (wanted[0].sign > 0) {
const tol = Math.max(3, Math.round(v * 0.2));
Object.assign(r0, { kind: 'target', target: Math.round(v), tol, zero: tol * 3, label: `${Math.round(v) - tol}–${Math.round(v) + tol}%` });
}
}
if (req.drunk !== false || (req.tolerate && req.tolerate.length < 9)) reqs.push(purityRequirement(exclude, opts.simple ? 3 : PURITY_LIMIT));
reqs.push(...techReqs);
const com = finalize({ style: req.id, request: req, title: req.title, arch, tier, ctx, rng, plan, pred, reqs, bottleMl, bottleN, opts, activation, techniques: chosen, say });
if (com) com.supplies = supplyBrief(plan, local, wanted, exclude, supply);
return com;
}
function supplyBrief(plan, ctx, wanted, exclude, supply) {
const total = plan.ingredients.reduce((a, i) => a + i.n, 0) * SIM.ML_PER_PARTICLE;
const carriers = wanted.map((w) => {
const list = [...ctx.available].map(ctx.lookup).filter((m) => m && m.effects && !m.product && !m.remains && w.sign * ((m.effects || {})[w.key] || 0) >= 8)
.map((m) => ({ id: m.id, where: ctx.supply ? (ctx.stock && ctx.stock(m.id) >= 40 ? 'shelf' : ctx.supply(m.id) >= 40 ? 'wilds' : ctx.buyable && ctx.buyable(m.id) ? 'market' : 'none') : 'shelf' }))
.filter((c) => c.where !== 'none')
.slice(0, 5);
return { key: w.key, sign: w.sign, carriers: list };
});
return { brewMl: Math.round((total * TEST_MARGIN) / 10) * 10, carriers, purchases: supply ? Math.round(supply.cost * 10) / 10 : 0 };
}
function predictedMeasurement(pred, plan, ml) {
return { ml, count: Math.round(ml / SIM.ML_PER_PARTICLE), lab: pred.lab, color: pred.color, temperature: plan.serveTemp ?? 20, effects: Array.from(pred.effects) };
}
function finalize({ style, request, title, arch, tier, ctx, rng, plan, pred, reqs, bottleMl, bottleN, opts, activation, techniques = [], say = [] }) {
const com = {
id: 'q' + Math.floor(rng.next() * 1e9).toString(36),
tier, style: [style, ...techniques.slice().sort()].join('+'), request: request ? request.id : null, contract: !!opts.contract, potionName: '', customer: null, dialogue: '',
requirements: reqs, bottleMl, bottleN, budget: 0, reference: plan, techniques,
predicted: { effects: Array.from(pred.effects), color: pred.color, reactions: pred.reactions, threshold: pred.threshold, awakened: pred.awakened },
effectOrder: reqs.some((r) => r.effect), activation, hintCost: 0,
};
const check = evaluatePotion(com, /** @type {any} */ (predictedMeasurement(pred, plan, bottleMl)));
if (check.quality < 0.999) return null;
const customer = makeCustomer(rng, arch);
const cost = planCost(plan, ctx.priceOf) * (bottleN / pred.totalParticles) * 1.6;
const eventBonus = ctx.event && ['winter', 'plague', 'conclave', 'festival'].includes(ctx.event) ? 1.15 : 1;
const techPay = techniques.reduce((a, t) => a + (t === 'strong' ? 18 + 4 * tier : 5), 0);
const budget = Math.round((14 + cost * (2.6 + 0.45 * tier) + 9 * tier + reqs.length * 5 + (com.effectOrder ? 10 : 0) + techPay + (activation ? 30 + 12 * tier : 0)) * arch.budget * eventBonus * (opts.contract ? 2.2 : 1));
const potionName = (techniques.includes('strong') ? 'Concentrated ' : '') + (title || 'Potion');
let greet = request ? rng.pick(request.story) : rng.pick(arch.greet).replace('{potion}', aOrAn(potionName.toLowerCase()) + ' ' + potionName.toLowerCase());
if (say.length) greet += ' ' + say.join(' ');
Object.assign(com, { potionName, customer, dialogue: greet, budget: Math.max(12, budget), hintCost: Math.max(3, Math.round(budget * 0.12)) });
return com;
}
const TUTORIAL_HERBS = { healer: 'wild-silverleaf', warmer: 'wild-sunthistle' };
function tutorialCommission(ctx, rng) {
const R = ctx.world.roles;
const { healer, warmer } = TUTORIAL_HERBS;
const plan = { ingredients: [{ id: R.water, n: 22 }, { id: healer, n: 10 }, { id: warmer, n: 5 }], heatTo: 62, coolTo: 20, serveTemp: 20, steep: { T: 62, hold: 22 }, knead: true, crush: true, hold: 8 };
const pred = predictPlan(ctx.world, ctx.lookup, plan);
const vit = Math.max(4, Math.round(pred.effects[EFFECT_INDEX.vitality] * 0.7));
const arch = archetypeOf('farmer');
const customer = makeCustomer(rng, arch);
customer.name = 'Old Mabry Hollins';
const colorWord = describeColor(pred.color);
const leaf = ctx.lookup(healer).name, sun = ctx.lookup(warmer).name;
return {
id: 'q-tutorial',
tier: 0,
style: 'healing',
contract: false,
tutorial: true,
potionName: `${capitalize(colorWord)} Healing Tonic`,
customer,
dialogue: `Ah, a new alchemist! My old joints ache. Could you brew me a healing tonic? ${leaf} heals, they say, but it leaves a frosty bite — a little ${sun} should warm that away. Test that it truly heals, and that nothing else is in it!`,
requirements: [
{ key: 'vitality', kind: 'min', target: vit, tol: 0, zero: Math.max(6, vit * 0.6), label: `at least ${vit}%`, effect: true },
purityRequirement(['vitality'], 3),
],
bottleMl: 100,
bottleN: 20,
budget: 30,
reference: plan,
predicted: { effects: Array.from(pred.effects), color: pred.color, reactions: pred.reactions, threshold: pred.threshold, awakened: pred.awakened },
effectOrder: true,
activation: false,
hintCost: 0,
techniques: [],
};
}
function capitalize(s) {
return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
function aOrAn(w) {
return /^[aeiou]/i.test(w) ? 'an' : 'a';
}
return { purityRequirement, coldFloor, TEST_MARGIN, checkSupply, TECHNIQUES, techniqueById, migrateTechniques, generateCommission, TUTORIAL_HERBS, tutorialCommission, unwantedMax };
})();
// src/game/equipment.js
const __m26 = (() => {
const EQUIPMENT = [
{ id: 'hearth', name: 'Stone Hearth', category: 'heat', price: 0, rank: 0, icon: 'fire', mechanics: ['steeping', 'concentration', 'awakening'], desc: 'A wood fire under the cauldron. It brings a pot to the boil in seconds and takes lamp oil past 200°C — every steep, boil and heat-awakening in the guild’s books.', effect: { maxFlame: 340, heatPower: 3.5 } },
{ id: 'basin', name: 'Cold-Water Basin', category: 'cold', price: 0, rank: 0, icon: 'basin', mechanics: ['cold-extraction'], desc: 'Cool well water under the cauldron: chills a brew to about 9°C — cold enough for most ice-cold steeps, never colder.', effect: { minCool: 4, coolPower: 4 } },
{ id: 'pot', name: 'Iron Pot', category: 'vessel', price: 0, rank: 0, icon: 'cauldron', mechanics: ['batch'], desc: 'Your first cauldron (about 1.5 litres).', effect: { size: 'pot' } },
{ id: 'spoon', name: 'Oak Spoon', category: 'tool', price: 0, rank: 0, icon: 'spoon', mechanics: ['mixing'], desc: 'Stirs, folds and kneads.' },
{ id: 'pestle', name: 'Granite Pestle', category: 'tool', price: 0, rank: 0, icon: 'pestle', mechanics: ['extraction'], desc: 'Crushes whole herbs, roots and stones in the pot, frozen blocks and crystal chunks into grains. Everything solid goes in whole: only the pestle breaks it up.' },
{ id: 'thermometer', name: 'Mercury Thermometer', category: 'instrument', price: 0, rank: 0, icon: 'thermo', mechanics: ['steeping'], desc: 'Reads temperatures anywhere in the brew.' },
{ id: 'kit', name: 'Forager’s Kit', category: 'gathering', price: 60, rank: 0, icon: 'trowel', mechanics: ['gathering'], desc: 'Trowel, rock hammer, sickle and brush: roots, mineral seams, mosses and fine dust come up whole. Without it you scrabble up half as much of anything you cannot simply pick.' },
{ id: 'satchel', name: 'Forager’s Satchel', category: 'gathering', price: 80, rank: 1, icon: 'satchel', mechanics: ['gathering'], desc: 'Carry more from the wilds: each harvest gathers half as much again.' },
{ id: 'rack1', name: 'Bottle Shelf', category: 'storage', price: 40, rank: 0, icon: 'shelf', mechanics: ['storage'], desc: 'A plank shelf with a lip: room for 6 sealed bottles of potion.', effect: { bottles: 6 } },
{ id: 'rack2', name: 'Potion Cabinet', category: 'storage', price: 150, rank: 1, icon: 'shelf2', requires: ['rack1'], mechanics: ['storage'], desc: 'A glass-fronted cabinet: room for 12 sealed bottles.', effect: { bottles: 12 } },
{ id: 'rack3', name: 'Bottle Cellar', category: 'storage', price: 420, rank: 2, icon: 'shelf2', requires: ['rack2'], mechanics: ['storage'], desc: 'Cool cellar racks from floor to vault: room for 24 sealed bottles.', effect: { bottles: 24 } },
{ id: 'frostrune', name: 'Frost Rune Plate', category: 'cold', price: 150, rank: 1, icon: 'rune', requires: ['basin'], mechanics: ['cold-extraction', 'awakening'], desc: 'A carved rune that draws a brew down to about -14°C: the ice-cold steeps the basin cannot hold (Grave Moss, the narrowest windows), the cold awakenings of Moonfen magic, and freezing. Mind the dial: a brew frozen solid gives up less.', effect: { minCool: -30, coolPower: 6 } },
{ id: 'glacial', name: 'Glacial Sigil', category: 'cold', price: 750, rank: 3, icon: 'snow', requires: ['frostrune'], mechanics: ['awakening', 'cold-extraction'], desc: 'Deep cold, fast: a brew falls to about -48°C, past the thresholds of the Moonfen’s deepest magic.', effect: { minCool: -70, coolPower: 9 } },
{ id: 'stirrer', name: 'Clockwork Stirrer', category: 'tool', price: 110, rank: 1, icon: 'gear', mechanics: ['mixing'], desc: 'A wind-up paddle that keeps stirring on its own — through the whole depth of the brew — while you gather, test or serve. It evens a brew about three times as fast as the hand spoon, so every bottle of a batch matches the one you tested.' },
{ id: 'homunculus', name: 'Brass Homunculus', category: 'tool', price: 1100, rank: 3, icon: 'homunculus', mechanics: ['automation'], desc: 'A clockwork assistant that follows a saved recipe’s recorded procedure step by step — every pour, grinding, stir, heat, chill, hold, boil-down and the lid — in the real cauldron, at full ingredient cost.' },
{ id: 'arcanometer', name: 'Arcanometer', category: 'instrument', price: 200, rank: 1, icon: 'awaken', mechanics: ['awakening', 'experimentation'], desc: 'A lodestone needle in a glass of wisp-light. The Inspect probe shows the aura of strong magic in the matter under it (which kinds, never how strong) and reads its arcane threshold to the nearest 50, and how much has awakened.' },
{ id: 'kennel', name: 'Subject Kennel', category: 'trials', price: 60, rank: 1, icon: 'rabbit', mechanics: ['experimentation'], desc: 'Spare cages and pots: the hutch holds six rabbits, and new test subjects cost half — corroborate a reading on more animals.', effect: { hutch: 6 } },
{ id: 'warren', name: 'Rabbit Warren', category: 'trials', price: 180, rank: 2, icon: 'nest', requires: ['kennel'], mechanics: ['experimentation'], desc: 'A walled run with burrows and a nest box: room for ten rabbits.', effect: { hutch: 10 } },
{ id: 'still', name: 'Purging Still', category: 'trials', price: 150, rank: 1, icon: 'alembic', mechanics: ['experimentation'], desc: 'The guild’s recipe for the purging draught and a little still to brew it: a draught costs 1 coin of salts and a short wait instead of 8 coins at the apothecary. A purge washes every potion effect out of a rabbit and stops any degeneration.' },
{ id: 'copper', name: 'Copper Cauldron', category: 'vessel', price: 320, rank: 2, icon: 'cauldron2', requires: ['pot'], mechanics: ['batch'], desc: 'A larger vessel (about 2.2 litres): bigger orders, spare test doses and two or three bottles from one tested batch.', effect: { size: 'copper' } },
{ id: 'grand', name: 'Grand Athanor Vessel', category: 'vessel', price: 1800, rank: 4, icon: 'cauldron3', requires: ['copper'], mechanics: ['batch'], desc: 'A huge vessel (3 litres) for the grandest commissions and whole shelves from one batch.', effect: { size: 'grand' } },
{ id: 'charter', name: 'Guild Charter', category: 'guild', price: 400, rank: 2, icon: 'charter', mechanics: ['commerce'], desc: 'Guild membership: 15% off all reagents, and the day’s last customer brings a guild contract — a larger bottle for a much larger fee.', effect: { discount: 0.15 } },
];
const STARTING_EQUIPMENT = ['hearth', 'basin', 'pot', 'spoon', 'pestle', 'thermometer'];
const BASE_STORAGE = 2500;
const BASE_BOTTLES = 3;
const BASE_HUTCH = 4;
const RETIRED_EQUIPMENT = {
hydrometer: { name: 'Glass Hydrometer', price: 45, sandbox: true, why: 'customers no longer ask for a density' },
viscometer: { name: 'Falling-Ball Viscometer', price: 70, sandbox: true, why: 'natural brews stay watery: viscosity is never asked for' },
assay: { name: 'Assay Kit', price: 90, sandbox: true, why: 'customers no longer ask for stability or volatility; the cauldron tells you when a brew is uneven' },
galvanometer: { name: 'Galvanometer', price: 120, sandbox: true, why: 'charge is never asked for' },
thermal: { name: 'Thermal Monocle', price: 80, sandbox: true, why: 'the heat map is now a Free Experiment view' },
skimmer: { name: 'Brass Skimmer', price: 60, sandbox: true, why: 'natural extracts all mix with water, so there is no layer worth skimming; the tap already draws from the bottom' },
alembic: { name: 'Copper Alembic', price: 360, sandbox: true, why: 'boiling down with the lid open does the same, and the distillate is never clean enough to jar' },
bellows: { name: 'Bellows & Coal', price: 120, why: 'the hearth already reaches every steep and boil; hotter fires only set lamp oil alight' },
athanor: { name: 'Athanor Furnace', price: 700, why: 'the hearth already reaches every steep and boil' },
lens: { name: 'Aether Lens', price: 140, into: 'arcanometer', why: 'its aura view is now part of the Arcanometer' },
trowel: { name: 'Digging Trowel', price: 20, into: 'kit', why: 'the Forager’s Kit holds every gathering tool' },
rockhammer: { name: 'Rock Hammer', price: 35, into: 'kit', why: 'the Forager’s Kit holds every gathering tool' },
brush: { name: 'Badger Brush', price: 15, into: 'kit', why: 'the Forager’s Kit holds every gathering tool' },
sickle: { name: 'Silver Sickle', price: 45, into: 'kit', why: 'the Forager’s Kit holds every gathering tool' },
shelf1: { name: 'Oak Shelves', price: 90, why: 'every shop now stores 2.5 L of each reagent' },
shelf2: { name: 'Cellar Racks', price: 260, why: 'every shop now stores 2.5 L of each reagent' },
};
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
const cap = { maxFlame: 340, heatPower: 3.5, minCool: 4, coolPower: 4, size: 'pot', storage: BASE_STORAGE, discount: 0, hutch: BASE_HUTCH, bottles: BASE_BOTTLES, has: (id) => has.has(id) };
for (const e of EQUIPMENT) {
if (!has.has(e.id) || !e.effect) continue;
const f = /** @type {any} */ (e.effect);
if (f.maxFlame && f.maxFlame > cap.maxFlame) { cap.maxFlame = f.maxFlame; cap.heatPower = f.heatPower; }
if (f.minCool !== undefined && f.minCool < cap.minCool) { cap.minCool = f.minCool; cap.coolPower = f.coolPower; }
if (f.size === 'copper' && cap.size === 'pot') cap.size = 'copper';
if (f.size === 'grand') cap.size = 'grand';
if (f.storage && f.storage > cap.storage) cap.storage = f.storage;
if (f.discount) cap.discount = Math.max(cap.discount, f.discount);
if (f.hutch && f.hutch > cap.hutch) cap.hutch = f.hutch;
if (f.bottles && f.bottles > cap.bottles) cap.bottles = f.bottles;
}
return cap;
}
return { EQUIPMENT, STARTING_EQUIPMENT, BASE_STORAGE, BASE_BOTTLES, BASE_HUTCH, RETIRED_EQUIPMENT, equipmentById, RANKS, rankIndex, capabilities };
})();
// src/game/colony.js
const __m28 = (() => {
const { EFFECT_INDEX } = __m13;
const { Rng, hashString } = __m6;
const RABBIT_MARKS = ['vitality', 'strength', 'love', 'arcana', 'transformation', 'fire', 'frost', 'acid', 'alkali', 'toxicity', 'death'];
const MARK_INDEX = Object.fromEntries(RABBIT_MARKS.map((k, i) => [k, i]));
const KIT_DAYS = 4;
const ADULT_DAYS = 8;
const ELDER_DAYS = 40;
const LIFESPAN_DAYS = 56;
const FOUNDER_BORN = -9;
const GESTATION_DAYS = 3;
const DOSE_LIMIT = 40;
const MEMORIAL_LIMIT = 24;
const LEVEL_AT = [8, 30, 60];
const TRAIT_AT = [20, 50, 90, 140, 200];
const DEGEN_AT = 70;
const MARK_MAX = 100;
const LETHAL = ['toxicity', 'death', 'acid', 'alkali', 'fire', 'frost'];
const AGGRO = ['vitality', 'strength', 'arcana', 'transformation'];
const FERAL = AGGRO;
const AGGRO_AT = 60;
const LOVE_MATE = 25;
const MATE_EVERY = [60, 3];
const MARK_TAU = 600;
const BURNS = ['fire', 'acid'];
const BURN_RATE = 0.3;
const MAX_BONUS = 150;
const DEGEN_RISE = 0.25;
const ATTACK_EVERY = [9, 4];
const TRAITS = ['ears2', 'horns', 'antlers', 'unihorn', 'scales', 'spines', 'tail-lizard', 'tail-plume', 'giant', 'tiny', 'eye3', 'wings'];
const TRAIT_EXCLUSIVE = [['giant', 'tiny'], ['horns', 'antlers', 'unihorn'], ['tail-lizard', 'tail-plume']];
const TRAIT_WORDS = {
ears2: 'a second pair of ears', horns: 'two curling horns', antlers: 'small antlers', unihorn: 'a single spiral horn',
scales: 'scaly haunches', spines: 'icy spines along its back', 'tail-lizard': 'a scaly lizard tail', 'tail-plume': 'a plumed tail',
giant: 'a giant frame', tiny: 'a shrunken body', eye3: 'a third eye', wings: 'little membrane wings',
};
const COATS = [
[[0.93, 0.89, 0.82], 3], // cream
[[0.97, 0.96, 0.94], 2], // white
[[0.6, 0.58, 0.62], 2], // grey
[[0.55, 0.42, 0.3], 3], // agouti brown
[[0.36, 0.24, 0.18], 1], // chocolate
[[0.2, 0.18, 0.2], 1], // black
[[0.82, 0.55, 0.3], 2], // ginger
[[0.78, 0.78, 0.8], 1], // silver
];
const PATTERNS = /** @type {const} */ (['solid', 'dutch', 'spotted', 'hooded', 'points', 'agouti']);
const PATTERN_W = [4, 2, 2, 1, 1, 2];
const EARS = /** @type {const} */ (['upright', 'lop', 'half', 'short']);
const EAR_W = [5, 2, 1, 1];
const WHITE = [0.97, 0.96, 0.94], CREAM = [0.93, 0.89, 0.82], CHOC = [0.36, 0.24, 0.18], BLACK = [0.2, 0.18, 0.2];
const lum = (c) => 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2];
const r2 = (v) => Math.round(v * 100) / 100;
function rollLook(rng) {
const coat = COATS[rng.weighted(COATS.map((_, i) => i), COATS.map((c) => c[1]))][0].slice();
const dark = lum(coat) < 0.5;
const coat2 = (dark ? (rng.chance(0.5) ? WHITE : CREAM) : (rng.chance(0.5) ? CHOC : BLACK)).slice();
const white = coat[0] > 0.95;
return {
coat, coat2,
pattern: PATTERNS[rng.weighted([0, 1, 2, 3, 4, 5], PATTERN_W)],
ear: EARS[rng.weighted([0, 1, 2, 3], EAR_W)],
size: r2(Math.max(0.85, Math.min(1.15, 1 + 0.06 * rng.gauss()))),
eye: /** @type {'dark'|'ruby'} */ (white && rng.chance(0.5) ? 'ruby' : 'dark'),
tail: /** @type {0|1|2} */ (rng.int(0, 2)),
seed: 1 + rng.int(0, 2147483000),
};
}
function inheritLook(a, b, rng) {
const from = rng.chance(0.5) ? a : b;
const fresh = rollLook(rng);
const coatFrom = rng.chance(0.1) ? fresh : from;
const pick = (k) => (rng.chance(0.08) ? fresh[k] : (rng.chance(0.5) ? a[k] : b[k]));
const coat = coatFrom.coat.slice();
const white = coat[0] > 0.95;
return {
coat, coat2: coatFrom.coat2.slice(),
pattern: pick('pattern'), ear: pick('ear'),
size: r2(Math.max(0.85, Math.min(1.15, (a.size + b.size) / 2 + rng.range(-0.05, 0.05)))),
eye: /** @type {'dark'|'ruby'} */ (white && (a.eye === 'ruby' || b.eye === 'ruby' || rng.chance(0.25)) ? 'ruby' : 'dark'),
tail: pick('tail'),
seed: 1 + rng.int(0, 2147483000),
};
}
function lookFromSeed(str) {
return rollLook(new Rng(hashString('look:' + str)));
}
function visibleLevel(v) {
return v >= LEVEL_AT[2] ? 3 : v >= LEVEL_AT[1] ? 2 : v >= LEVEL_AT[0] ? 1 : 0;
}
const q3 = (v, a, b, c) => (v >= c ? 3 : v >= b ? 2 : v >= a ? 1 : 0);
function stageOf(r, day) {
if (day === undefined || !Number.isFinite(day)) return 'adult';
const age = day - (r.born ?? FOUNDER_BORN);
return age < KIT_DAYS ? 'kit' : age < ADULT_DAYS ? 'young' : age < ELDER_DAYS ? 'adult' : 'elder';
}
const hpBand = (h) => (h >= 75 ? 0 : h >= 40 ? 1 : h >= 10 ? 2 : 3);
function maxHealthOf(r, day) {
const base = Math.max(20, 100 + (r.bonus || 0) - (r.scar || 0));
return Math.round(base * (stageOf(r, day) === 'elder' && Number.isFinite(day) ? 0.9 : 1) * 10) / 10;
}
function degenOf(r) {
return Array.isArray(r && r.degen) ? r.degen : [];
}
const trait = (r, salt, key) => new Rng(hashString(`${salt}:${r.id}:${r.look ? r.look.seed : 0}:${key}`)).gauss();
function degenAt(r, key) {
return Math.round(clamp(DEGEN_AT + 13 * trait(r, 'degen', key), 42, 95));
}
function degenRate(r, key) {
return Math.round(DEGEN_RISE * clamp(Math.exp(0.55 * trait(r, 'rise', key)), 0.3, 3) * 1000) / 1000;
}
function aggroAt(r, key) {
if (!AGGRO.includes(key)) return Infinity;
return Math.round(clamp(AGGRO_AT + 16 * trait(r, 'aggro', key), 30, 95));
}
function aggroOf(r) {
if (!r || r.alive === false || !r.marks) return [];
return AGGRO.filter((k) => (r.marks[k] || 0) >= aggroAt(r, k)).sort((p, q) => (r.marks[q] - aggroAt(r, q)) - (r.marks[p] - aggroAt(r, p)));
}
function isFeral(r) {
return aggroOf(r).length > 0;
}
function burnRate(v) {
return v > 0 ? BURN_RATE * Math.min(1, v / MARK_MAX) ** 1.5 : 0;
}
function mateEvery(love) {
if (!(love >= LOVE_MATE)) return Infinity;
const t = clamp((love - LOVE_MATE) / (MARK_MAX - LOVE_MATE), 0, 1);
return MATE_EVERY[0] * (MATE_EVERY[1] / MATE_EVERY[0]) ** t;
}
function mateCost(love) {
const t = clamp((love - LOVE_MATE) / (MARK_MAX - LOVE_MATE), 0, 1);
return 0.5 + 6 * t * t;
}
const RABBIT_BIAS = 0.1;
function rabbitSensitivity(r, key) {
const rng = new Rng(hashString(`sens:${r.id}:${r.look ? r.look.seed : 0}:${key}`));
return Math.round(clamp(Math.exp(RABBIT_BIAS * rng.gauss()), 0.6, 1.6) * 1000) / 1000;
}
function rabbitSnap(r, day) {
const mk = r.marks || {}, ex = r.exposure || {};
const lv = RABBIT_MARKS.map((k) => {
if (k === 'strength') return visibleLevel(Math.min(100, (mk.strength || 0) + 0.2 * (ex.strength || 0)));
return visibleLevel(mk[k] || 0);
});
const sc = [
q3(ex.fire || 0, 30, 80, 150), q3(ex.acid || 0, 25, 60, 120), q3(ex.frost || 0, 30, 80, 150),
Math.max(q3(ex.death || 0, 15, 40, 80), stageOf(r, day) === 'elder' ? 1 : 0), q3(ex.arcana || 0, 40, 100, 180),
];
const alive = r.alive !== false;
const dg = alive ? degenOf(r).filter((k) => MARK_INDEX[k] !== undefined) : [];
return {
stage: r.stage || stageOf(r, day),
hp: !alive ? 3 : /** @type {0|1|2|3} */ (hpBand(100 * (r.health ?? 100) / Math.max(1, maxHealthOf(r, day)))),
alive,
preg: !!r.pregnant && alive,
lv, sc,
traits: Array.isArray(r.traits) ? r.traits.slice() : [],
cause: !alive ? (r.cause || 'unknown') : null,
dg, ag: alive && isFeral(r),
};
}
const STAGE_CH = { kit: 'k', young: 'y', adult: 'a', elder: 'e' };
const CH_STAGE = { k: 'kit', y: 'young', a: 'adult', e: 'elder' };
function encodeSnap(s) {
const dg = (s.dg && s.dg.length) || s.ag ? `|${(s.dg || []).join(',')}|${s.ag ? 'a' : '0'}` : '';
return `${STAGE_CH[s.stage] || 'a'}${s.hp}${s.alive ? 1 : 0}${s.preg ? 1 : 0}|${s.lv.join('')}|${s.sc.join('')}|${s.traits.join(',')}|${s.cause || ''}${dg}`;
}
function defaultSnap() {
return { stage: 'adult', hp: 0, alive: true, preg: false, lv: new Array(RABBIT_MARKS.length).fill(0), sc: [0, 0, 0, 0, 0], traits: [], cause: null, dg: [], ag: false };
}
function decodeSnap(str) {
if (typeof str !== 'string') return defaultSnap();
const p = str.split('|');
if (p.length < 5 || p[0].length !== 4) return defaultSnap();
const stage = CH_STAGE[p[0][0]];
const lv = p[1].split('').map(Number);
const sc = p[2].split('').map(Number);
if (!stage || lv.length !== RABBIT_MARKS.length || lv.some((v) => !(v >= 0 && v <= 3)) || sc.some((v) => !(v >= 0 && v <= 3))) return defaultSnap();
while (sc.length < 5) sc.push(0);
const hp = Number(p[0][1]);
const dg = p[5] ? p[5].split(',').filter((k) => MARK_INDEX[k] !== undefined) : [];
return {
stage, hp: /** @type {0|1|2|3} */ (hp >= 0 && hp <= 3 ? hp : 0), alive: p[0][2] === '1', preg: p[0][3] === '1', lv, sc: sc.slice(0, 5),
traits: p[3] ? p[3].split(',').filter((t) => TRAITS.includes(t)) : [], cause: p[4] || null,
dg, ag: p[6] !== undefined ? p[6] === 'a' : dg.some((k) => LEGACY_FERAL.includes(k)),
};
}
const LEGACY_FERAL = ['vitality', 'strength', 'love', 'arcana', 'transformation'];
const NAMES = ['Clover', 'Bramble', 'Hazel', 'Juniper', 'Pip', 'Thistle', 'Willow', 'Sorrel', 'Barley', 'Fennel', 'Nettle', 'Poppy', 'Rowan', 'Sage',
'Tansy', 'Teasel', 'Bryony', 'Campion', 'Dill', 'Elder', 'Flax', 'Gorse', 'Heather', 'Ivy', 'Kale', 'Lovage', 'Mallow', 'Nutmeg', 'Oats', 'Parsley', 'Quince',
'Radish', 'Saffron', 'Tarragon', 'Umber', 'Vetch', 'Wren', 'Yarrow', 'Acorn', 'Basil', 'Cobnut', 'Dandelion', 'Eyebright', 'Foxglove', 'Ginger', 'Hops', 'Iris', 'Jasmine'];
const emptyMarks = () => Object.fromEntries(RABBIT_MARKS.map((k) => [k, 0]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fin = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
const round1 = (v) => Math.round(v * 10) / 10;
const round4 = (v) => Math.round(v * 1e4) / 1e4;
function founders() {
const clover = { coat: [0.93, 0.89, 0.82], coat2: [0.36, 0.24, 0.18], pattern: 'solid', ear: 'upright', size: 1, eye: 'dark', tail: 1, seed: 1 };
const bramble = { coat: [0.55, 0.42, 0.3], coat2: [0.93, 0.89, 0.82], pattern: 'agouti', ear: 'lop', size: 1.05, eye: 'dark', tail: 1, seed: 2 };
return [
newRabbit({ id: 'r1', name: 'Clover', sex: 'f', born: FOUNDER_BORN, look: clover }),
newRabbit({ id: 'r2', name: 'Bramble', sex: 'm', born: FOUNDER_BORN, look: bramble }),
];
}
function newRabbit(o) {
return {
id: o.id, name: o.name, sex: o.sex, born: o.born, look: o.look, parents: o.parents || null,
health: 100, bonus: 0, alive: true, trials: 0, marks: emptyMarks(), exposure: emptyMarks(), scar: 0, traits: [], degen: [], cd: 0, mc: 0,
doses: [], dosesDropped: 0, pregnant: null, diedDay: null, cause: null,
};
}
function createColony(seed = '') {
return { seed, serial: 2, focus: 'r1', breed: true, fedDay: 0, day: 0, rabbits: founders(), memorial: [], purges: 2, still: null, ticks: 0, clock: 0 };
}
function findRabbit(c, id) {
return c.rabbits.find((r) => r.id === id) || null;
}
function livingRabbits(c) {
return c.rabbits.filter((r) => r.alive);
}
function bodies(c) {
return c.rabbits.filter((r) => !r.alive);
}
function focusRabbit(c) {
return (c.focus && findRabbit(c, c.focus)) || c.rabbits.find((r) => r.alive) || c.rabbits[0] || null;
}
function pickName(c, rng) {
const used = new Set([...c.rabbits.map((r) => r.name), ...c.memorial.map((m) => m.name)]);
const free = NAMES.filter((n) => !used.has(n));
if (free.length) return rng.pick(free);
const base = rng.pick(NAMES);
for (let k = 2; ; k++) {
const n = `${base} ${['', '', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'][k] || k}`;
if (!used.has(n)) return n;
}
}
function makeRabbit(c, o, rng) {
c.serial++;
const r = newRabbit({ id: 'r' + c.serial, name: o.name || pickName(c, rng), sex: o.sex, born: o.born, look: o.look, parents: o.parents || null });
c.rabbits.push(r);
return r;
}
function addBoughtRabbit(c, o) {
const rng = new Rng(hashString(`${c.seed}:buy:${c.serial}`));
const live = livingRabbits(c);
const does = live.filter((r) => r.sex === 'f').length, bucks = live.length - does;
const sex = does === bucks ? (rng.chance(0.5) ? 'f' : 'm') : does < bucks ? 'f' : 'm';
return makeRabbit(c, { born: o.day - (ADULT_DAYS + 2), sex, look: rollLook(rng) }, rng);
}
function recordDose(r, d) {
r.doses.push(d);
if (r.doses.length > DOSE_LIMIT) {
r.dosesDropped += r.doses.length - DOSE_LIMIT;
r.doses.splice(0, r.doses.length - DOSE_LIMIT);
}
}
function related(a, b) {
const pa = a.parents || [], pb = b.parents || [];
if (pa.includes(b.id) || pb.includes(a.id)) return true;
return pa.some((p) => p && pb.includes(p));
}
const STAGE_SENS = { kit: 1.6, young: 1.25, adult: 1, elder: 1.15 };
const STAGE_ERR = { kit: 1.4, young: 1.15, adult: 1, elder: 1.1 };
const MARK_DECAY = { vitality: 0.5, strength: 0.8, love: 0.6, arcana: 0.7, transformation: 0.75, fire: 0.4, frost: 0.4, acid: 0.7, alkali: 0.6, toxicity: 0.75, death: 0.85 };
const TRAIT_AFF = {
ears2: { love: 1 }, horns: { fire: 1, strength: 1 }, antlers: { vitality: 1, arcana: 0.5 }, unihorn: { vitality: 0.8, arcana: 1 },
scales: { frost: 0.6, acid: 0.7, toxicity: 0.5 }, spines: { frost: 1.2, toxicity: 0.3 }, 'tail-lizard': { toxicity: 1, fire: 0.5 },
'tail-plume': { love: 0.7, vitality: 0.7 }, giant: { strength: 1.2, vitality: 0.5 }, tiny: { death: 1, frost: 0.6 }, eye3: { arcana: 1.5 }, wings: { arcana: 0.8, love: 0.6 },
};
const TRAIT_LINES = {
ears2: 'A second pair of ears unfurls behind the first!', horns: 'Two little horns push up between its ears!', antlers: 'Tiny velvet antlers sprout from its brow!',
unihorn: 'A single spiral horn grows from its forehead!', scales: 'Its haunches harden into glinting scales!', spines: 'Icy spines rise along its back!',
'tail-lizard': 'Its tail stretches into a scaly lizard tail!', 'tail-plume': 'Its tail blooms into a long feathery plume!', giant: 'It swells to twice its size!',
tiny: 'It shrinks to the size of a kitten!', eye3: 'A third eye opens on its forehead!', wings: 'Little membrane wings unfold from its shoulders!',
};
const CAUSE_OF = { toxicity: 'poison', death: 'death', fire: 'fire', frost: 'frost', acid: 'acid', alkali: 'alkali', transformation: 'change', arcana: 'arcana', vitality: 'growth', strength: 'strain', love: 'love' };
const DEGEN_LINES = {
toxicity: 'The poison has taken hold: it is spreading through its blood on its own!',
death: 'The grey pallor deepens by itself — death magic is eating it from within!',
acid: 'The burns keep spreading: its own body is turning to acid!',
alkali: 'The lye crust keeps growing, cracking deeper into its skin!',
fire: 'It is smouldering from the inside — the heat keeps rising!',
frost: 'The cold has reached its heart and keeps spreading!',
vitality: 'Wild growth: it keeps swelling on its own, ravenous and restless!',
strength: 'Its muscles keep swelling on their own, straining its heart!',
love: 'Its passion will not cool: it chases the others to mate, faster and faster!',
arcana: 'The magic in it runs wild and keeps building!',
transformation: 'The change will not stop — it keeps twisting into something new!',
};
const AGGRO_LINES = {
vitality: 'Bursting with wild vigour, it bares its teeth at the others!',
strength: 'Swollen with strength, it starts shoving and biting the others!',
arcana: 'Sparks lash out of it at the other rabbits!',
transformation: 'Something feral wakes in it — it goes for the others!',
};
const partners = (t) => TRAIT_EXCLUSIVE.filter((g) => g.includes(t)).flat().filter((x) => x !== t);
function growTraits(r, e0, e1, applied) {
const grown = [];
for (let n = 0; n < TRAIT_AT.length && r.traits.length < 5; n++) {
const T = TRAIT_AT[n];
if (!(e0 < T && T <= e1)) continue;
const banned = new Set(r.traits.flatMap((t) => [t, ...partners(t)]));
const cands = TRAITS.filter((t) => !banned.has(t));
if (!cands.length) break;
const rng = new Rng(hashString(`${r.id}:${r.look.seed}:trait:${n}`));
const w = cands.map((t) => 1 + Object.entries(TRAIT_AFF[t] || {}).reduce((a, [k, f]) => a + f * Math.min(40, applied[k] || 0) / 10, 0));
const t = rng.weighted(cands, w);
r.traits.push(t);
grown.push(t);
}
return grown;
}
function rabbitResponse(before, effects, ml, o = {}) {
const r = normalizeRabbit(JSON.parse(JSON.stringify(before || {})), before && before.id);
const obs = [];
const say = (key, tone, text) => obs.push({ key, tone, text });
if (!r.alive) return { after: r, observations: [{ key: '', tone: /** @type {'neutral'} */ ('neutral'), text: `${r.name || 'The rabbit'} is dead. Choose or buy another rabbit.` }], harm: 0, applied: {}, react: [], newTraits: [], cause: r.cause };
const wasAggro = aggroOf(r);
const stage = stageOf(r, o.day);
const x = Math.min(2.5, Math.max(0, ml) / 10);
const s = (STAGE_SENS[stage] || 1) / (r.look.size || 1) * (r.traits.includes('giant') ? 0.85 : 1) * (r.traits.includes('tiny') ? 1.2 : 1);
const e = (k) => (Number(effects[EFFECT_INDEX[k]]) || 0) * x * s;
const acidity = e('acidity');
const a = {
vitality: Math.max(0, e('vitality')), strength: Math.max(0, e('strength')), love: Math.max(0, e('love')), arcana: Math.max(0, e('arcana')),
transformation: Math.max(0, e('transformation')), fire: Math.max(0, e('fire')), frost: Math.max(0, e('frost')),
acid: Math.max(0, acidity), alkali: Math.max(0, -acidity), toxicity: Math.max(0, e('toxicity')), death: Math.max(0, e('death')),
};
const m = r.marks;
const add = (k, v) => { m[k] = clamp(m[k] + v, 0, 100); };
add('vitality', 0.8 * a.vitality);
add('strength', a.strength);
add('love', 1.2 * a.love);
add('arcana', 1.2 * a.arcana);
add('transformation', 1.3 * a.transformation);
add('fire', 1.2 * a.fire - 0.6 * a.frost);
add('frost', 1.2 * a.frost - 0.6 * a.fire);
add('acid', 0.9 * a.acid - 0.5 * a.alkali);
add('alkali', 0.9 * a.alkali - 0.5 * a.acid);
add('toxicity', a.toxicity - 0.5 * a.vitality);
add('death', 1.5 * a.death - 0.3 * a.vitality);
const e0 = r.exposure.transformation;
for (const k of RABBIT_MARKS) r.exposure[k] = round1(r.exposure[k] + a[k]);
const hurt = {
toxicity: a.toxicity * 1.1, death: a.death * 1.8,
fire: a.fire > 18 ? (a.fire - 18) * 0.8 : 0, frost: a.frost > 18 ? (a.frost - 18) * 0.7 : 0,
acid: a.acid > 12 ? (a.acid - 12) * 0.8 : 0, alkali: a.alkali > 20 ? (a.alkali - 20) * 0.5 : 0,
transformation: a.transformation > 30 ? (a.transformation - 30) * 0.3 : 0, arcana: a.arcana > 40 ? (a.arcana - 40) * 0.3 : 0,
};
const harm = Object.values(hurt).reduce((p, v) => p + v, 0);
r.scar = Math.min(80, round1(r.scar + 0.2 * Math.max(0, harm - 5)));
const heal = 0.9 * a.vitality;
let maxHealth = maxHealthOf(r, o.day);
let health = r.health - harm;
const room = Math.max(0, maxHealth - health);
const grow = Math.max(0, heal - room) * 0.5;
if (grow > 0 && health > 0.5) {
r.bonus = round1(Math.min(MAX_BONUS, (r.bonus || 0) + grow));
maxHealth = maxHealthOf(r, o.day);
}
r.health = round1(clamp(health + heal, 0, maxHealth));
r.alive = r.health > 0.5;
const topped = RABBIT_MARKS.filter((k) => m[k] >= MARK_MAX).sort((p, q) => a[q] - a[p])[0];
if (r.alive && topped) { r.alive = false; r.health = 0; hurt[topped] = (hurt[topped] || 0) + 1000; }
const big = (v) => v > 20;
if (a.vitality > 1) say('vitality', 'good', grow > 0.5 ? 'Already in full health, it grows hardier still.' : big(a.vitality) ? 'Its coat gleams; it bounds about full of life.' : 'It looks refreshed.');
if (a.strength > 1) say('strength', 'good', big(a.strength) ? 'Its haunches swell with muscle; it shoves at the bars.' : 'It moves with new strength.');
if (a.love > 1) say('love', 'good', big(a.love) ? 'It nuzzles your hand, utterly devoted; little hearts seem to hang in the air.' : 'It nuzzles your hand.');
if (a.arcana > 1) say('arcana', 'neutral', big(a.arcana) ? 'Violet sparks crawl through its fur; faint runes glimmer.' : 'Its eyes catch a strange glimmer.');
if (a.transformation > 1) say('transformation', 'neutral', 'Its fur ripples and its shape shifts.');
if (a.fire > 1) say('fire', a.fire > 18 ? 'bad' : 'neutral', a.fire > 18 ? 'It yelps; its fur smoulders and singes.' : 'It pants in a warm glow.');
if (a.frost > 1) say('frost', a.frost > 18 ? 'bad' : 'neutral', a.frost > 18 ? 'Frost rimes its whiskers; icicles hang from its chin and it shivers.' : 'It shivers; frost feathers its whiskers.');
if (a.acid > 1) say('acidity', a.acid > 12 ? 'bad' : 'neutral', a.acid > 12 ? 'It squeals: the fur burns away in raw patches.' : 'It scratches at a stinging patch of fur.');
if (a.alkali > 1) say('acidity', a.alkali > 20 ? 'bad' : 'neutral', a.alkali > 20 ? 'A chalky crust cakes its fur and cracks its skin.' : 'A chalky film dulls its coat.');
if (a.toxicity > 1) say('toxicity', 'bad', a.toxicity > 15 ? 'It staggers, sick and trembling.' : 'It looks queasy.');
if (a.death > 1) say('death', 'bad', a.death > 15 ? 'A grey pallor creeps over it.' : 'It grows still and cold for a moment.');
const newTraits = growTraits(r, e0, r.exposure.transformation, a);
for (const t of newTraits) say('transformation', 'neutral', TRAIT_LINES[t]);
const degen = r.alive ? startDegeneration(r) : [];
for (const k of degen) say(k === 'acid' || k === 'alkali' ? 'acidity' : k, 'bad', DEGEN_LINES[k]);
const angry = r.alive ? aggroOf(r).filter((k) => !wasAggro.includes(k)) : [];
if (angry.length && !wasAggro.length) { say(angry[0], 'bad', AGGRO_LINES[angry[0]]); if (!(r.cd > 0)) r.cd = 3; }
if (r.alive && a.love > 1 && m.love >= LOVE_MATE && !(r.mc > 0)) r.mc = Math.min(mateEvery(m.love), 8);
if (!r.alive) {
const worst = Object.entries(hurt).sort((p, q) => q[1] - p[1])[0];
r.cause = worst && worst[1] > 0 ? CAUSE_OF[worst[0]] : 'frail';
r.diedDay = Number.isFinite(o.day) ? o.day : null;
r.pregnant = null;
say('', 'bad', r.cause === 'fire' ? 'It collapses in a smouldering heap.' : r.cause === 'frost' ? 'It freezes stiff and topples over.' : r.cause === 'poison' ? 'It convulses, then lies still.' : r.cause === 'love' ? 'Its heart gives out in a frenzy of passion.' : 'It collapses and does not get up.');
}
if (!obs.length) say('', 'neutral', 'No visible change.');
r.trials++;
const react = RABBIT_MARKS.filter((k) => a[k] > 1);
return { after: r, observations: obs, harm, applied: a, react, newTraits, degen, cause: r.alive ? null : r.cause };
}
function startDegeneration(r) {
const out = [];
for (const k of RABBIT_MARKS) {
if (r.marks[k] >= degenAt(r, k) && !r.degen.includes(k)) { r.degen.push(k); out.push(k); }
}
return out;
}
function colonyTick(c, dt, o = {}) {
const rep = { died: [], attacks: [], degen: [], traits: [], mates: [] };
if (!(dt > 0)) return rep;
const rng = new Rng(hashString(`${o.seed ?? c.seed}:tick:${c.ticks || 0}`));
c.ticks = (c.ticks || 0) + 1;
const day = o.day;
const fade = Math.exp(-dt / MARK_TAU);
const die = (r, cause, by) => {
r.alive = false; r.health = 0; r.cause = cause; r.diedDay = Number.isFinite(day) ? day : null; r.pregnant = null; r.degen = [];
rep.died.push({ id: r.id, name: r.name, cause, ...(by ? { by } : {}) });
};
for (const r of c.rabbits) {
if (!r.alive) continue;
const dg = degenOf(r);
let drain = 0, topped = null;
const hurts = {};
for (const k of RABBIT_MARKS) {
if (dg.includes(k)) {
const v = r.marks[k];
r.marks[k] = round1(Math.min(MARK_MAX, v + degenRate(r, k) * (0.6 + 0.8 * v / MARK_MAX) * dt));
if (r.marks[k] >= MARK_MAX && !topped) topped = k;
if (LETHAL.includes(k)) hurts[k] = (0.4 + 1.6 * r.marks[k] / 100) * dt;
} else {
const v = r.marks[k] * fade;
r.marks[k] = v < 0.3 ? 0 : Math.round(v * 1e4) / 1e4;
}
}
if (topped) { die(r, CAUSE_OF[topped] || 'poison'); continue; }
for (const k of BURNS) if (r.marks[k] > 0) hurts[k] = (hurts[k] || 0) + burnRate(r.marks[k]) * dt;
for (const v of Object.values(hurts)) drain += v;
if (dg.includes('vitality')) r.bonus = round1(Math.min(MAX_BONUS, (r.bonus || 0) + 0.25 * dt));
if (dg.includes('transformation')) {
const e0 = r.exposure.transformation;
r.exposure.transformation = round1(e0 + 0.8 * dt);
for (const t of growTraits(r, e0, r.exposure.transformation, r.marks)) rep.traits.push({ id: r.id, name: r.name, trait: t });
}
const max = maxHealthOf(r, day);
if (drain > 0) {
r.health = round4(r.health - drain);
const burned = BURNS.reduce((a, k) => a + (dg.includes(k) ? 0 : burnRate(r.marks[k]) * dt), 0);
if (burned > 0) r.scar = Math.min(80, round4((r.scar || 0) + 0.05 * burned));
if (r.health <= 0.5) {
const worst = Object.entries(hurts).sort((p, q) => q[1] - p[1])[0];
die(r, (worst && CAUSE_OF[worst[0]]) || 'poison');
continue;
}
} else r.health = round4(Math.min(max, r.health + 0.05 * dt)); // a tenth would round a 0.05 step away
if (r.health > max) r.health = max;
}
for (const r of c.rabbits) {
const angry = aggroOf(r);
if (!angry.length) { if (r.alive) r.cd = 0; continue; }
r.cd = (r.cd || 0) - dt;
if (r.cd > 0) continue;
const fury = Math.max(...angry.map((k) => r.marks[k]));
const t = clamp(Math.max(...angry.map((k) => (r.marks[k] - aggroAt(r, k)) / Math.max(1, MARK_MAX - aggroAt(r, k)))), 0, 1);
r.cd = round1((ATTACK_EVERY[0] + (ATTACK_EVERY[1] - ATTACK_EVERY[0]) * t) * rng.range(0.8, 1.25));
const prey = c.rabbits.filter((x) => x.alive && x.id !== r.id);
if (!prey.length) continue;
const v = rng.pick(prey);
const dmg = round1((8 + 14 * fury / 100 + 0.1 * (r.marks.strength || 0)) * rng.range(0.8, 1.2) * (r.traits.includes('giant') ? 1.3 : 1));
v.health = round1(v.health - dmg);
v.scar = Math.min(80, round1((v.scar || 0) + 0.15 * dmg));
const killed = v.health <= 0.5;
rep.attacks.push({ from: r.id, to: v.id, fromName: r.name, toName: v.name, dmg, killed });
if (killed) die(v, 'mauled', r.name);
}
let living = c.rabbits.filter((x) => x.alive).length;
let pending = 2 * c.rabbits.filter((x) => x.alive && x.pregnant).length;
for (const r of c.rabbits) {
if (!r.alive) continue;
const love = r.marks.love || 0;
if (love < LOVE_MATE) { r.mc = 0; continue; }
r.mc = (r.mc || mateEvery(love)) - dt;
if (r.mc > 0) continue;
r.mc = round1(Math.max(0.5, mateEvery(love) * rng.range(0.8, 1.2)));
const others = c.rabbits.filter((x) => x.alive && x.id !== r.id && stageOf(x, day) !== 'kit');
if (!others.length) continue;
const mates = others.filter((x) => x.sex !== r.sex);
const p = rng.pick(mates.length ? mates : others);
let conceived = false;
if (p.sex !== r.sex) {
const doe = r.sex === 'f' ? r : p, buck = r.sex === 'f' ? p : r;
const room = !Number.isFinite(o.cap) || living + pending < /** @type {number} */ (o.cap);
if (!doe.pregnant && stageOf(doe, day) !== 'kit' && room && rng.chance(0.35)) {
doe.pregnant = { sire: buck.id, due: (Number.isFinite(day) ? /** @type {number} */ (day) : c.day || 0) + GESTATION_DAYS };
pending += 2;
conceived = true;
}
}
r.health = round1(r.health - mateCost(love) * rng.range(0.8, 1.2));
p.health = round1(p.health - 0.5);
rep.mates.push({ from: r.id, to: p.id, fromName: r.name, toName: p.name, conceived });
if (r.health <= 0.5) { die(r, 'love'); living--; }
if (p.alive && p.health <= 0.5) { die(p, 'love'); living--; }
}
return rep;
}
function purgeRabbit(r) {
if (!r || !r.alive) return false;
for (const k of RABBIT_MARKS) r.marks[k] = 0;
r.degen = [];
r.cd = 0;
r.mc = 0;
return true;
}
function cullRabbit(r, day) {
if (!r || !r.alive) return false;
r.alive = false; r.health = 0; r.cause = 'culled'; r.diedDay = Number.isFinite(day) ? day : null; r.pregnant = null; r.degen = []; r.cd = 0; r.mc = 0;
return true;
}
function colonyDay(c, o) {
const day = o.day;
const rng = new Rng(hashString(`${o.seed ?? c.seed}:colony:${day}`));
const rep = { day, born: [], grown: [], died: [], lost: 0, conceived: 0 };
const fed = c.fedDay === day - 1;
const die = (r, cause) => {
r.alive = false; r.health = 0; r.cause = cause; r.diedDay = day; r.pregnant = null;
rep.died.push({ id: r.id, name: r.name, cause });
};
for (const r of c.rabbits) {
if (!r.alive) continue;
for (const k of RABBIT_MARKS) {
if (degenOf(r).includes(k)) continue;
const v = r.marks[k] * MARK_DECAY[k];
r.marks[k] = v < 0.5 ? 0 : round1(v);
}
const poison = Math.max(0, r.marks.toxicity - 40) * 0.5 + Math.max(0, r.marks.death - 40) * 0.4;
if (poison > 0) {
r.health = round1(r.health - poison);
r.scar = Math.min(80, round1(r.scar + 0.2 * poison));
}
if (r.health <= 0.5) { die(r, r.marks.death > r.marks.toxicity ? 'death' : 'poison'); continue; }
const age = day - r.born;
if (age > LIFESPAN_DAYS && rng.chance(Math.min(0.5, (age - LIFESPAN_DAYS) / 24))) { die(r, 'age'); continue; }
const maxHealth = maxHealthOf(r, day);
if (!degenOf(r).some((k) => LETHAL.includes(k))) r.health = round1(Math.min(maxHealth, r.health + 10 + (fed ? 6 : 0)));
if (stageOf(r, day - 1) !== 'adult' && stageOf(r, day - 1) !== 'elder' && stageOf(r, day) === 'adult') rep.grown.push({ id: r.id, name: r.name });
}
let living = c.rabbits.filter((r) => r.alive).length;
for (const doe of c.rabbits.slice()) {
if (!doe.pregnant) continue;
if (!doe.alive) { doe.pregnant = null; continue; }
if (doe.pregnant.due > day) continue;
const sireId = doe.pregnant.sire;
const sire = findRabbit(c, sireId) || c.memorial.find((x) => x.id === sireId) || doe;
const litter = rng.int(1, 3);
const n = Math.max(0, Math.min(litter, o.cap - living));
rep.lost += litter - n;
for (let k = 0; k < n; k++) {
const kit = makeRabbit(c, { born: day, sex: rng.chance(0.5) ? 'f' : 'm', look: inheritLook(doe.look, sire.look, rng), parents: [doe.id, sireId] }, rng);
rep.born.push({ id: kit.id, name: kit.name, mother: doe.name });
living++;
}
doe.pregnant = null;
}
if (c.breed !== false) {
const eligible = (r) => r.alive && stageOf(r, day) === 'adult' && r.health >= 60 && r.marks.toxicity < 30 && r.marks.death < 20 && !degenOf(r).length;
const bucks = c.rabbits.filter((r) => r.sex === 'm' && eligible(r)).sort((p, q) => q.marks.love - p.marks.love || (p.id < q.id ? -1 : 1));
let pending = 2 * c.rabbits.filter((r) => r.alive && r.pregnant).length;
for (const doe of c.rabbits) {
if (doe.sex !== 'f' || doe.pregnant || !eligible(doe)) continue;
if (living + pending >= o.cap) break;
const buck = bucks.find((b) => !related(doe, b));
if (!buck) continue;
const p = 0.3 + 0.4 * Math.min(1, Math.max(doe.marks.love, buck.marks.love) / 50) + (fed ? 0.1 : 0);
if (rng.chance(p)) {
doe.pregnant = { sire: buck.id, due: day + GESTATION_DAYS };
pending += 2;
rep.conceived++;
}
}
}
c.day = day;
return rep;
}
function retireRabbit(c, id, how, parts, day) {
const i = c.rabbits.findIndex((r) => r.id === id);
if (i < 0) return null;
const r = c.rabbits[i];
const entry = {
id: r.id, name: r.name, sex: r.sex, look: r.look, born: r.born, diedDay: r.diedDay, cause: r.cause, stage: stageOf(r, r.diedDay ?? day),
traits: r.traits.slice(), exposure: Object.fromEntries(RABBIT_MARKS.map((k) => [k, round1(r.exposure[k] || 0)])), how, parts: parts.slice(), parents: r.parents,
};
c.rabbits.splice(i, 1);
c.memorial.unshift(entry);
c.memorial = trimMemorial(c.memorial);
if (c.focus === id) { const f = c.rabbits.find((x) => x.alive) || c.rabbits[0]; c.focus = f ? f.id : null; }
return entry;
}
function trimMemorial(list) {
let buried = 0;
return list.filter((m) => m.how === 'processed' || ++buried <= MEMORIAL_LIMIT);
}
function remainsSource(r, day) {
return {
id: r.id, name: r.name, sex: r.sex, look: r.look, exposure: { ...r.exposure }, cause: r.cause || null,
stage: /** @type {any} */ (r).stage || stageOf(r, r.diedDay ?? day), traits: r.traits.slice(), diedDay: r.diedDay ?? null,
};
}
const CAUSE_WORDS = { culled: 'put down', mauled: 'mauled by an aggressive rabbit', love: 'worn out by love', growth: 'burst with wild growth', strain: 'its heart gave out from the strain', poison: 'poisoned', death: 'withered by death magic', fire: 'burned', frost: 'frozen', acid: 'eaten by acid', alkali: 'scalded by lye', change: 'torn apart by change', arcana: 'overwhelmed by magic', age: 'died of old age', frail: 'too frail', unknown: 'died' };
function causeWord(cause) {
return CAUSE_WORDS[cause || 'unknown'] || 'died';
}
function rabbitCondition(r, day) {
const w = [];
if (!r.alive) {
w.push(`dead — ${causeWord(r.cause)}${Number.isFinite(r.diedDay) ? ` (day ${r.diedDay})` : ''}`);
} else {
const h = 100 * r.health / Math.max(1, maxHealthOf(r, day));
w.push(h >= 75 ? 'healthy' : h >= 40 ? 'weakened' : h >= 10 ? 'very weak' : 'near death');
if (isFeral(r)) w.push('AGGRESSIVE');
else if (degenOf(r).length) w.push('degenerating');
if ((r.bonus || 0) >= 10) w.push(r.bonus >= 60 ? 'hale beyond nature' : 'extra hardy');
if (r.scar >= 20) w.push(r.scar >= 50 ? 'badly scarred' : 'scarred');
}
const s = rabbitSnap(r, day);
const L = (k) => s.lv[MARK_INDEX[k]];
const pick = (k, words) => { const l = L(k); if (l && r.alive) w.push(words[l - 1]); };
pick('vitality', ['bright-eyed', 'glowing with health', 'radiant']);
pick('strength', ['sturdy', 'muscular', 'hulking']);
pick('love', ['affectionate', 'lovestruck', 'besotted']);
pick('arcana', ['glimmering', 'sparkling', 'crackling with magic']);
pick('transformation', ['shimmering', 'shifting', 'changing before your eyes']);
pick('fire', ['warm', 'smouldering', 'aflame']);
pick('frost', ['chilly', 'frosted', 'frozen stiff']);
pick('acid', ['itchy', 'burned in patches', 'raw with acid burns']);
pick('alkali', ['dusty', 'crusted', 'caked in lye']);
pick('toxicity', ['queasy', 'sick', 'poisoned']);
pick('death', ['pale', 'grey and cold', 'barely clinging on']);
if (r.alive && r.pregnant) w.push('expecting kits');
if (r.traits.length) w.push(r.traits.map((t) => TRAIT_WORDS[t] || t).join(', '));
return w;
}
function normalizeLook(d, id) {
const fb = lookFromSeed(String(id || 'x'));
if (!d || typeof d !== 'object') return fb;
const col = (v, f) => (Array.isArray(v) && v.length === 3 && v.every((x) => Number.isFinite(x)) ? v.map((x) => clamp(x, 0, 1)) : f);
return {
coat: col(d.coat, fb.coat), coat2: col(d.coat2, fb.coat2),
pattern: PATTERNS.includes(d.pattern) ? d.pattern : fb.pattern,
ear: EARS.includes(d.ear) ? d.ear : fb.ear,
size: clamp(fin(d.size, 1), 0.85, 1.15),
eye: /** @type {'dark'|'ruby'} */ (d.eye === 'ruby' ? 'ruby' : 'dark'),
tail: /** @type {0|1|2} */ ([0, 1, 2].includes(d.tail) ? d.tail : 1),
seed: Number.isFinite(d.seed) && d.seed > 0 ? Math.floor(d.seed) : fb.seed,
};
}
function normalizeMarks(m) {
const out = emptyMarks();
if (m && typeof m === 'object') for (const k of RABBIT_MARKS) out[k] = Math.max(0, fin(m[k], 0));
return out;
}
function normalizeRabbit(r, fallbackId) {
const d = r && typeof r === 'object' ? r : {};
const id = typeof d.id === 'string' && d.id ? d.id : fallbackId || 'r1';
const traits = [];
for (const t of Array.isArray(d.traits) ? d.traits : []) {
if (!TRAITS.includes(t) || traits.includes(t) || traits.some((x) => partners(x).includes(t))) continue;
if (traits.length < 5) traits.push(t);
}
const scar = clamp(fin(d.scar, 0), 0, 80);
const alive = d.alive !== false;
const rb = /** @type {Rabbit} */ ({
id, name: typeof d.name === 'string' && d.name ? d.name : 'Clover', sex: d.sex === 'm' ? 'm' : 'f',
born: fin(d.born, FOUNDER_BORN), look: normalizeLook(d.look, id), parents: Array.isArray(d.parents) ? d.parents.filter((p) => typeof p === 'string').slice(0, 2) : null,
health: clamp(fin(d.health, 100), 0, 100 + MAX_BONUS), bonus: clamp(fin(d.bonus, 0), 0, MAX_BONUS), alive, trials: Math.max(0, fin(d.trials, 0) | 0),
marks: normalizeMarks(d.marks), exposure: normalizeMarks(d.exposure), scar, traits,
degen: alive && Array.isArray(d.degen) ? [...new Set(d.degen.filter((k) => MARK_INDEX[k] !== undefined))] : [], cd: Math.max(0, fin(d.cd, 0)), mc: Math.max(0, fin(d.mc, 0)),
doses: (Array.isArray(d.doses) ? d.doses : []).filter((x) => x && typeof x.rec === 'string').map((x) => ({
rec: x.rec, day: fin(x.day, 0) | 0, ml: Math.max(0, fin(x.ml, 0)), src: x.src === 'vial' ? 'vial' : 'cauldron', obs: typeof x.obs === 'string' ? x.obs : '', ...(x.died ? { died: 1 } : {}),
})).slice(-DOSE_LIMIT),
dosesDropped: Math.max(0, fin(d.dosesDropped, 0) | 0),
pregnant: alive && d.pregnant && typeof d.pregnant.sire === 'string' && Number.isFinite(d.pregnant.due) ? { sire: d.pregnant.sire, due: d.pregnant.due } : null,
diedDay: alive ? null : Number.isFinite(d.diedDay) ? d.diedDay : null,
cause: alive ? null : typeof d.cause === 'string' && d.cause ? d.cause : 'unknown',
});
return rb;
}
const LEGACY_MARKS = { glow: 'arcana', burn: 'fire', frost: 'frost', love: 'love', change: 'transformation', sick: 'toxicity', etch: 'acid' };
function normalizeColony(c, legacy, records = []) {
if (c && typeof c === 'object' && Array.isArray(c.rabbits)) {
const seen = new Set();
const rabbits = [];
for (const r of c.rabbits) {
if (!r || typeof r !== 'object' || typeof r.id !== 'string' || seen.has(r.id)) continue;
seen.add(r.id);
rabbits.push(normalizeRabbit(r));
}
const memorial = trimMemorial((Array.isArray(c.memorial) ? c.memorial : []).filter((m) => m && typeof m.id === 'string' && !seen.has(m.id)).map((m) => ({
id: m.id, name: typeof m.name === 'string' ? m.name : 'Rabbit', sex: m.sex === 'm' ? 'm' : 'f', look: normalizeLook(m.look, m.id), born: fin(m.born, FOUNDER_BORN),
diedDay: Number.isFinite(m.diedDay) ? m.diedDay : null, cause: typeof m.cause === 'string' ? m.cause : 'unknown',
stage: ['kit', 'young', 'adult', 'elder'].includes(m.stage) ? m.stage : 'adult', traits: (Array.isArray(m.traits) ? m.traits : []).filter((t) => TRAITS.includes(t)).slice(0, 5),
exposure: normalizeMarks(m.exposure), how: m.how === 'buried' ? 'buried' : 'processed', parts: (Array.isArray(m.parts) ? m.parts : []).filter((p) => typeof p === 'string'),
parents: Array.isArray(m.parents) ? m.parents.filter((p) => typeof p === 'string').slice(0, 2) : null,
})));
const nums = [...rabbits, ...memorial].map((r) => Number(String(r.id).replace(/^r/, ''))).filter(Number.isFinite);
const out = /** @type {Colony} */ ({
seed: typeof c.seed === 'string' ? c.seed : '', serial: Math.max(fin(c.serial, 0) | 0, ...nums, 0),
focus: null, breed: c.breed !== false, fedDay: fin(c.fedDay, 0) | 0, day: fin(c.day, 0) | 0, rabbits, memorial,
purges: Math.max(0, fin(c.purges, 2) | 0), still: Number.isFinite(c.still) && c.still > 0 ? c.still : null,
ticks: Math.max(0, fin(c.ticks, 0) | 0), clock: Math.max(0, fin(c.clock, 0)),
});
out.focus = typeof c.focus === 'string' && findRabbit(out, c.focus) ? c.focus : (focusRabbit(out) || { id: null }).id;
return out;
}
const col = createColony();
if (legacy && typeof legacy === 'object') {
const f = col.rabbits[0];
const h = Number(legacy.health);
f.health = Number.isFinite(h) ? clamp(h, 0, 100) : 100;
f.alive = legacy.alive !== false;
f.trials = Math.max(0, fin(legacy.trials, 0) | 0);
const lm = legacy.marks && typeof legacy.marks === 'object' ? legacy.marks : {};
for (const [old, k] of Object.entries(LEGACY_MARKS)) f.marks[k] = clamp(Math.max(f.marks[k], fin(lm[old], 0)), 0, 100);
const vig = clamp(fin(lm.vigor, 0), 0, 100);
f.marks.strength = Math.max(f.marks.strength, vig);
f.marks.vitality = Math.max(f.marks.vitality, 0.5 * vig);
const mine = (records || []).filter((r) => r && r.subjectId === 'rabbit' && !r.rabbitId).slice().reverse();
for (const r of mine) {
r.rabbitId = f.id;
r.rabbitName = f.name;
const k = Math.min(2.5, (Number(r.ml) || 0) / 10);
for (const [key, v] of Object.entries(r.values || {})) {
const ch = key === 'acidity' ? (v >= 0 ? 'acid' : 'alkali') : key;
if (MARK_INDEX[ch] !== undefined) f.exposure[ch] = round1(f.exposure[ch] + Math.abs(Number(v) || 0) * k);
}
recordDose(f, { rec: r.id, day: fin(r.day, 0) | 0, ml: fin(r.ml, 0), src: r.source === 'vial' ? 'vial' : 'cauldron',
obs: (r.observations || []).filter((x) => x && x.key).map((x) => x.key + (x.tone === 'good' ? '+' : x.tone === 'bad' ? '-' : '')).join(','), ...(r.died ? { died: 1 } : {}) });
}
for (const k of RABBIT_MARKS) f.exposure[k] = Math.max(f.exposure[k], f.marks[k]);
growTraits(f, 0, f.exposure.transformation, {});
if (!f.alive) { f.health = 0; f.cause = 'unknown'; f.diedDay = null; }
col.focus = f.alive ? f.id : 'r2';
}
return col;
}
function installRabbitAlias(trials) {
Object.defineProperty(trials.subjects, 'rabbit', {
enumerable: false,
configurable: true,
get() {
return focusRabbit(trials.colony) || { id: '', name: '', health: 0, alive: false, trials: 0, marks: emptyMarks() };
},
set(v) {
const f = focusRabbit(trials.colony);
if (!f || !v || typeof v !== 'object') return;
if (v.id === f.id) { Object.assign(f, normalizeRabbit(v, f.id)); return; }
if (Number.isFinite(Number(v.health))) f.health = clamp(Number(v.health), 0, 100);
if (typeof v.alive === 'boolean') f.alive = v.alive;
if (Number.isFinite(v.trials)) f.trials = v.trials;
if (v.marks && typeof v.marks === 'object') {
for (const [k, x] of Object.entries(v.marks)) {
const ch = LEGACY_MARKS[k] || (MARK_INDEX[k] !== undefined ? k : k === 'vigor' ? 'strength' : null);
if (ch && Number.isFinite(x)) f.marks[ch] = clamp(x, 0, 100);
}
}
if (!f.alive) { f.pregnant = null; f.cause = f.cause || 'unknown'; if (f.diedDay === undefined) f.diedDay = null; }
},
});
return trials;
}
return { RABBIT_MARKS, MARK_INDEX, KIT_DAYS, ADULT_DAYS, ELDER_DAYS, LIFESPAN_DAYS, FOUNDER_BORN, GESTATION_DAYS, DOSE_LIMIT, MEMORIAL_LIMIT, LEVEL_AT, TRAIT_AT, DEGEN_AT, MARK_MAX, LETHAL, AGGRO, FERAL, AGGRO_AT, LOVE_MATE, MATE_EVERY, MARK_TAU, BURNS, BURN_RATE, MAX_BONUS, DEGEN_RISE, ATTACK_EVERY, TRAITS, TRAIT_EXCLUSIVE, TRAIT_WORDS, COATS, rollLook, inheritLook, lookFromSeed, visibleLevel, stageOf, maxHealthOf, degenOf, degenAt, degenRate, aggroAt, aggroOf, isFeral, burnRate, mateEvery, mateCost, RABBIT_BIAS, rabbitSensitivity, rabbitSnap, encodeSnap, defaultSnap, decodeSnap, NAMES, createColony, findRabbit, livingRabbits, bodies, focusRabbit, pickName, makeRabbit, addBoughtRabbit, recordDose, related, STAGE_ERR, MARK_DECAY, rabbitResponse, colonyTick, purgeRabbit, cullRabbit, colonyDay, retireRabbit, trimMemorial, remainsSource, causeWord, rabbitCondition, normalizeRabbit, normalizeColony, installRabbitAlias };
})();
// src/game/experiments.js
const __m27 = (() => {
const { EFFECTS, EFFECT_KEYS, EFFECT_INDEX, NE, potencyWord } = __m13;
const { Rng, hashString } = __m6;
const { createColony, normalizeColony, installRabbitAlias, rabbitResponse, findRabbit, focusRabbit, recordDose, rabbitSnap, encodeSnap, stageOf, addBoughtRabbit, STAGE_ERR, rabbitSensitivity, RABBIT_BIAS, maxHealthOf } = __m28;
function readingSteadiness(rabbit, day) {
const stage = STAGE_ERR[stageOf(rabbit, day)] || 1;
const max = Math.max(1, maxHealthOf(rabbit, day ?? 1));
const frac = Math.max(0, Math.min(1, (rabbit.health ?? max) / max));
return stage * (frac < 0.5 ? 1 + (0.5 - frac) : 1);
}
const SUBJECTS = [
{ id: 'rabbit', name: 'Moon Rabbit', kind: 'animal', reveals: EFFECT_KEYS.slice(), cost: 6,
desc: 'A Moon Rabbit of your colony. It shows every effect — each one a little differently.' },
];
const RETIRED = [
{ id: 'beetle', name: 'Copper Beetle', kind: 'animal', reveals: ['strength', 'transformation', 'fire', 'frost', 'toxicity'], cost: 3, desc: '', legacy: true },
{ id: 'seedling', name: 'Bean Seedling', kind: 'plant', reveals: ['vitality', 'love', 'fire', 'frost', 'acidity', 'toxicity'], cost: 2, desc: '', legacy: true },
{ id: 'stone', name: 'Limestone', kind: 'mineral', reveals: ['acidity', 'strength', 'fire', 'frost', 'arcana', 'transformation'], cost: 1, desc: '', legacy: true },
{ id: 'wisp', name: 'Will-o’-Wisp', kind: 'spirit', reveals: ['arcana', 'transformation', 'love', 'death', 'vitality'], cost: 14, desc: '', legacy: true },
];
const SUBJECT_BY_ID = Object.fromEntries([...SUBJECTS, ...RETIRED].map((s) => [s.id, s]));
const RECORD_LIMIT = 160;
const DOSES = [5, 10, 25];
const DOSE_NOISE = 0.3;
const READ_NOISE = 1.5;
function driftTolerance(v) {
return Math.max(3, 0.15 * Math.abs(v));
}
function createTrials() {
const subjects = {};
const t = { subjects, records: /** @type {TrialRecord[]} */ ([]), serial: 0, laws: /** @type {Record<string, {evidence:number, found:number|null}>} */ ({}), colony: createColony() };
installRabbitAlias(t);
return t;
}
function normalizeTrials(t) {
const out = createTrials();
if (!t || typeof t !== 'object') return out;
if (Array.isArray(t.records)) out.records = t.records.filter((r) => r && typeof r === 'object' && typeof r.subjectId === 'string' && r.values).slice(0, RECORD_LIMIT);
out.serial = Math.max(t.serial | 0, ...out.records.map((r) => r.serial | 0), 0);
if (t.laws && typeof t.laws === 'object') for (const [k, v] of Object.entries(t.laws)) if (v && typeof v === 'object') out.laws[k] = { evidence: v.evidence | 0, found: v.found ?? null };
out.colony = normalizeColony(t.colony, t.subjects && t.subjects.rabbit, out.records);
installRabbitAlias(out);
return out;
}
function rabbitReading(rabbit, effects, o) {
const rng = new Rng(hashString(`reading:${o.salt}:${rabbit.id}`));
const errK = Math.sqrt(10 / Math.max(1, o.ml)) * readingSteadiness(rabbit, o.day);
const out = new Array(NE).fill(0);
for (let k = 0; k < NE; k++) {
const v = Number(effects[k]) || 0;
const g1 = rng.gauss(), g2 = rng.gauss();
if (Math.abs(v) < 0.3) continue;
const f = rabbitSensitivity(rabbit, EFFECT_KEYS[k]) * Math.max(0.3, 1 + DOSE_NOISE * errK * g1);
out[k] = v * f + READ_NOISE * errK * g2;
if (Math.sign(out[k]) !== Math.sign(v)) out[k] = 0;
}
return out;
}
const doseErr = (ml) => Math.round(Math.sqrt(10 / Math.max(1, Number(ml) || 10)) * 1000) / 1000;
const EVIDENCE_LEVELS = ['preliminary', 'repeated', 'corroborated', 'certified'];
const EVIDENCE_TEXT = {
preliminary: 'one reading — a rough guess',
repeated: 'repeated on one rabbit — its own bias is still in it',
corroborated: 'corroborated on several rabbits',
certified: 'certified: several rabbits, a narrow margin',
};
const evidenceRank = (level) => EVIDENCE_LEVELS.indexOf(level);
const PRIOR_WEIGHT = 2;
function summarize(samples) {
/** @type {Record<string, number>} */ const values = {};
/** @type {Record<string, number>} */ const spread = {};
/** @type {Record<string, number>} */ const unc = {};
/** @type {Record<string, string>} */ const level = {};
/** @type {Record<string, number>} */ const n = {};
/** @type {Record<string, number>} */ const rabbits = {};
/** @type {Record<string, string>} */ const records = {};
/** @type {Record<string, boolean>} */ const first = {};
/** @type {Record<string, boolean>} */ const unseen = {};
for (const [key, list] of Object.entries(samples || {})) {
if (!Array.isArray(list) || !list.length) continue;
const N = list.length;
const mean = list.reduce((a, s) => a + s.v, 0) / N;
const sd = N > 1 ? Math.sqrt(list.reduce((a, s) => a + (s.v - mean) ** 2, 0) / (N - 1)) : 0;
const R = new Set(list.map((s) => s.r)).size;
const m = Math.round(mean * 10) / 10;
values[key] = Math.abs(m) < 0.5 ? 0 : m;
spread[key] = Math.round(sd * 10) / 10;
n[key] = N;
rabbits[key] = R;
records[key] = list[N - 1].rec;
first[key] = N === 1;
unseen[key] = list.every((s) => s.v === 0);
const bias = RABBIT_BIAS * Math.abs(mean);
let prior2 = 0;
for (const s of list) {
const e = s.e ?? 1;
const u = s.u ?? Math.sqrt((DOSE_NOISE * e * Math.abs(mean)) ** 2 + (READ_NOISE * e) ** 2 + bias ** 2);
prior2 += Math.max((READ_NOISE * e * 0.5) ** 2, u * u - bias * bias);
}
prior2 /= N;
const s2 = (PRIOR_WEIGHT * prior2 + (N - 1) * sd * sd) / (PRIOR_WEIGHT + N - 1);
const se = Math.sqrt(s2 / N + (bias * bias) / R);
unc[key] = Math.round(1.96 * se * 10) / 10;
level[key] = N === 1 ? 'preliminary' : R === 1 ? 'repeated' : N >= 3 && unc[key] <= Math.max(2.5, 0.2 * Math.abs(mean)) ? 'certified' : 'corroborated';
}
return { values, spread, unc, level, n, rabbits, records, first, unseen };
}
function effectEvidence(sum, key, need) {
if (!sum || sum.values[key] === undefined) return { state: 'untested', value: 0, bound: Infinity, level: null, within: null };
const v = sum.values[key], u = sum.unc[key] ?? 0, level = sum.level[key];
const state = sum.unseen && sum.unseen[key] ? 'not-detected' : level === 'preliminary' ? 'detected' : level === 'repeated' ? 'repeated' : 'corroborated';
let within = null;
if (need) {
const lo = v - u, hi = v + u;
if (need.kind === 'limit') within = Math.max(Math.abs(lo), Math.abs(hi)) <= need.target ? true : Math.min(Math.abs(lo), Math.abs(hi)) > need.target && Math.sign(lo) === Math.sign(hi) ? false : null;
else if (need.kind === 'min') within = lo >= need.target ? true : hi < need.target ? false : null;
else if (need.kind === 'max') within = hi <= need.target ? true : lo > need.target ? false : null;
else { const t = need.tol || 0; within = Math.abs(v - need.target) + u <= t ? true : Math.abs(v - need.target) - u > t ? false : null; }
}
return { state, value: v, bound: u, level, within };
}
function requirementEvidence(req, sum) {
const mark = (w) => (w === true ? '✓' : w === false ? '✗' : '~');
const pct = (u) => (u < 10 ? u.toFixed(1) : String(Math.round(u)));
if (req.key === 'purity') {
const keys = EFFECT_KEYS.filter((k) => !(req.exclude || []).includes(k));
const ev = keys.map((k) => ({ k, e: effectEvidence(sum, k, { kind: 'limit', target: req.target }) }));
const open = ev.filter((x) => x.e.state === 'untested').length;
if (open) return { evidence: 'untested', within: null, mark: '?', text: `${open} untested`, title: 'Test a dose: one trial reads every effect at once.' };
const bad = ev.filter((x) => x.e.within === false), unsure = ev.filter((x) => x.e.within === null);
if (bad.length) return { evidence: 'missed', within: false, mark: '✗', text: bad.map((x) => EFFECTS[EFFECT_INDEX[x.k]].label).join(', '), title: 'Reliably above the limit.' };
if (unsure.length) return { evidence: 'unsure', within: null, mark: '~', text: `${unsure.length} not ruled out`, title: `Not detected is not proof of absence: ${unsure.map((x) => EFFECTS[EFFECT_INDEX[x.k]].label).join(', ')} could still lie above ${req.target}%. More readings, or larger doses, narrow it.` };
return { evidence: 'within', within: true, mark: '✓', text: `all below ${req.target}%`, title: 'Every other effect is reliably below the limit.' };
}
const need = req.kind === 'target' ? { kind: 'target', target: req.target, tol: req.tol } : { kind: req.kind, target: req.target };
const e = effectEvidence(sum, req.key, /** @type {any} */ (need));
if (e.state === 'untested') return { evidence: 'untested', within: null, mark: '?', text: 'untested', title: '' };
if (e.state === 'not-detected') return { evidence: 'not-detected', within: e.within, mark: mark(e.within), text: `not detected (≤${pct(e.bound)})`, title: 'No rabbit showed it. It could still be there, below the reading noise.' };
return { evidence: e.state, within: e.within, mark: mark(e.within), text: `${Math.round(e.value)} ±${pct(e.bound)}`, title: e.within === null ? 'The margin of the trials straddles what the customer asked: test again to be sure.' : EVIDENCE_STATE_TEXT[e.state] };
}
const EVIDENCE_STATE_TEXT = {
untested: 'untested',
'not-detected': 'not detected',
detected: 'detected once — a rough estimate',
repeated: 'measured repeatedly on one rabbit',
corroborated: 'corroborated on several rabbits',
};
function addSamples(samples, rec) {
for (const key of rec.revealed || []) {
if (rec.values[key] === undefined) continue;
(samples[key] ||= []).push({ v: rec.values[key], r: rec.rabbitId || rec.subjectId, rec: rec.id, e: doseErr(rec.ml), ...(rec.err && rec.err[key] !== undefined ? { u: rec.err[key] } : {}) });
}
return samples;
}
function runTrial(trials, subjectId, dose, ctx) {
const def = SUBJECT_BY_ID[subjectId];
if (!def || def.legacy) throw new Error('Only the rabbits of the colony can be tested.');
const st = ctx.rabbitId ? findRabbit(trials.colony, ctx.rabbitId) : focusRabbit(trials.colony);
if (!st) throw new Error('Choose a rabbit.');
if (!st.alive) throw new Error(`${st.name} is dead — choose or buy another rabbit.`);
if (!(ctx.ml > 0)) throw new Error('Choose a positive dose.');
const felt = rabbitReading(st, dose.effects, { ml: ctx.ml, day: ctx.day, salt: `${trials.serial + 1}:${ctx.batchId}:${ctx.rev}` });
const rr = rabbitResponse(st, felt, ctx.ml, { day: ctx.day });
const errK = Math.sqrt(10 / ctx.ml) * readingSteadiness(st, ctx.day);
/** @type {Record<string, number>} */ const err = {};
/** @type {Record<string, number>} */ const values = {};
/** @type {Record<string, number>} */ const theory = {};
/** @type {Record<string, number>} */ const tv = {};
const anomalies = [];
for (const key of def.reveals) {
const k = EFFECT_INDEX[key];
const val = Math.round(felt[k] * 10) / 10;
values[key] = Math.abs(val) < 0.5 ? 0 : val;
tv[key] = Math.round((Number(dose.effects[k]) || 0) * 10) / 10;
err[key] = Math.round(Math.sqrt((RABBIT_BIAS * Math.abs(values[key])) ** 2 + (DOSE_NOISE * errK * Math.abs(values[key])) ** 2 + (READ_NOISE * errK) ** 2) * 10) / 10;
theory[key] = Math.round((ctx.theory?.[k] ?? 0) * 10) / 10;
if (Math.abs(values[key] - theory[key]) > Math.max(4, 0.35 * Math.abs(theory[key]))) anomalies.push(key);
}
const lawsFound = [];
const laws = ctx.laws || [];
for (let r = 0; r < laws.length; r++) {
const amt = dose.resonance ? dose.resonance[r] || 0 : 0;
if (amt < 1.5) continue;
const L = laws[r];
const rec = (trials.laws[L.id] ||= { evidence: 0, found: null });
rec.evidence++;
if (rec.found === null && rec.evidence >= 2) { rec.found = ctx.day; lawsFound.push(L.id); }
}
trials.serial++;
const after = rr.after;
const record = {
id: 't' + trials.serial, serial: trials.serial, at: ctx.now ?? Date.now(), day: ctx.day, subjectId: 'rabbit', ml: ctx.ml, source: ctx.source,
batchId: ctx.batchId, rev: ctx.rev, revealed: def.reveals.slice(), values, theory, tv,
observations: rr.observations, anomalies, lawsFound,
look: { color: (dose.color || [0.5, 0.5, 0.5]).map((c) => Math.round(c * 1000) / 1000), temperature: Math.round(dose.temperature ?? 20) },
parts: (ctx.parts || []).map((p) => ({ id: p.id, ml: Math.round(p.ml) })), died: !after.alive, err,
rabbitId: st.id, rabbitName: st.name,
replay: { b: encodeSnap(rabbitSnap(st, ctx.day)), a: encodeSnap(rabbitSnap(after, ctx.day)), rx: rr.react.join(',') },
degen: rr.degen,
};
recordDose(after, { rec: record.id, day: ctx.day, ml: ctx.ml, src: ctx.source === 'vial' ? 'vial' : 'cauldron',
obs: rr.observations.filter((o) => o.key).map((o) => o.key + (o.tone === 'good' ? '+' : o.tone === 'bad' ? '-' : '')).join(','), ...(after.alive ? {} : { died: 1 }) });
const i = trials.colony.rabbits.indexOf(st);
if (i >= 0) trials.colony.rabbits[i] = after;
trials.records.unshift(record);
if (trials.records.length > RECORD_LIMIT) trials.records.length = RECORD_LIMIT;
return record;
}
function resetSubject(trials, id) {
if (id !== 'rabbit') throw new Error('Unknown subject.');
const r = addBoughtRabbit(trials.colony, { day: trials.colony.day || 1 });
trials.colony.focus = r.id;
return r;
}
function certification(trials, batch, current) {
const samples = {};
const stale = new Set();
let changed = false;
for (const r of trials.records.slice().reverse()) {
if (r.batchId !== batch.id) continue;
if (r.rev !== batch.rev) { changed = true; continue; }
for (const key of r.revealed) {
if (r.values[key] === undefined) continue;
const ref = r.tv && r.tv[key] !== undefined ? r.tv[key] : r.values[key];
if (current && Math.abs(current[EFFECT_INDEX[key]] - ref) > driftTolerance(ref)) { stale.add(key); continue; }
(samples[key] ||= []).push({ v: r.values[key], r: r.rabbitId || r.subjectId, rec: r.id, e: doseErr(r.ml), ...(r.err && r.err[key] !== undefined ? { u: r.err[key] } : {}) });
}
}
const carried = /** @type {any} */ (batch).carried;
if (carried && carried.samples) {
const known = new Set(trials.records.map((r) => r.id));
for (const [key, list] of Object.entries(carried.samples)) {
const i = EFFECT_INDEX[key], ref = carried.ref ? carried.ref[i] : undefined;
if (current && ref !== undefined && Math.abs(current[i] - ref) > driftTolerance(ref)) { stale.add(key); continue; }
for (const x of /** @type {Sample[]} */ (list)) if (!known.has(x.rec) && !(samples[key] || []).some((y) => y.rec === x.rec)) (samples[key] ||= []).push(x);
}
}
for (const k of Object.keys(samples)) stale.delete(k);
return { ...summarize(samples), samples, stale: [...stale], changed };
}
function requiredEffects(commission) {
if (!commission) return [];
return commission.requirements.map((r) => r.key).filter((k) => EFFECT_INDEX[k] !== undefined);
}
function missingEffects(commission, values) {
return requiredEffects(commission).filter((k) => values[k] === undefined);
}
function suggestSubjects(keys) {
return keys.length ? ['rabbit'] : [];
}
function knownLaws(trials, laws) {
return (laws || []).filter((L) => trials.laws[L.id] && trials.laws[L.id].found !== null);
}
function describeReading(key, v) {
const e = EFFECTS[EFFECT_INDEX[key]];
return `${e.label} ${Math.round(v)} (${potencyWord(v, key)})`;
}
return { readingSteadiness, SUBJECTS, SUBJECT_BY_ID, RECORD_LIMIT, DOSES, DOSE_NOISE, READ_NOISE, driftTolerance, createTrials, normalizeTrials, rabbitReading, doseErr, EVIDENCE_LEVELS, EVIDENCE_TEXT, evidenceRank, summarize, effectEvidence, requirementEvidence, EVIDENCE_STATE_TEXT, addSamples, runTrial, resetSubject, certification, requiredEffects, missingEffects, suggestSubjects, knownLaws, describeReading };
})();
// src/game/gathering.js
const __m29 = (() => {
const { Rng, hashString } = __m6;
const REGIONS = [
{ id: 'forest', name: 'Whisperwood', rank: 0, magical: false, desc: 'Old oaks and ferns. Roots and leaves grow in the shade.', sky: [0.36, 0.52, 0.42] },
{ id: 'meadow', name: 'Sunlit Meadow', rank: 0, magical: false, desc: 'Flowers and clover under an open sky.', sky: [0.55, 0.72, 0.9] },
{ id: 'river', name: 'Willow Bank', rank: 0, magical: false, desc: 'Chalky banks, mushrooms and bog plants along the slow river.', sky: [0.5, 0.66, 0.78] },
{ id: 'quarry', name: 'Ironstone Quarry', rank: 0, magical: false, desc: 'Cut rock faces, mineral crusts and glittering dust.', sky: [0.62, 0.6, 0.58] },
{ id: 'moonfen', name: 'Moonfen', rank: 2, magical: true, desc: 'A haunted bog lit by wisps. Death-moss and star crystals — and magic that wakes in the cold, not the heat.', sky: [0.16, 0.18, 0.32] },
{ id: 'crags', name: 'Ember Crags', rank: 3, magical: true, desc: 'Volcanic slopes where fire-peppers and salamanders live.', sky: [0.42, 0.2, 0.16] },
];
const REGION_BY_ID = Object.fromEntries(REGIONS.map((r) => [r.id, r]));
const PLACES = {
forest: ['by the old oak', 'in the fern hollow', 'under the beeches', 'at the mossy stump', 'by the woodcutter’s path', 'in the deep shade', 'along the brook'],
meadow: ['by the stile', 'on the sunny slope', 'near the beehives', 'along the hedgerow', 'in the long grass', 'by the well'],
river: ['under the willow', 'on the chalk bank', 'by the ford', 'in the reeds', 'at the mill race', 'on the gravel bar'],
quarry: ['on the east face', 'in the spoil heap', 'by the cart track', 'in the old cutting', 'under the crane', 'at the seam', 'by the powder store'],
moonfen: ['on the barrow', 'by the will-o’-pool', 'in the drowned grove', 'on the stepping stones', 'by the sunken cross', 'in the reed beds'],
crags: ['on the ash slope', 'by the steam vent', 'in the lava cave', 'on the black ridge'],
};
const STAGES = /** @type {const} */ (['sprout', 'ripe', 'mature']);
const SPROUT_SHARE = 0.4;
const MARK_MS = 4 * 60000;
function generateDeposits(world, lookup) {
const rng = new Rng('deposits:' + world.seed);
const out = [];
for (const region of REGIONS) {
const mats = (world.wild || []).map(lookup).filter((m) => m && m.wild && m.wild.region === region.id);
mats.forEach((m, k) => {
const rare = !!m.wild.rare;
const slots = rare ? 1 + (mats.length <= 5 ? 1 : 0) : mats.length > 5 ? 2 : 3;
const take = rare ? rng.int(3, 4) * 10 : rng.int(5, 8) * 10;
const growMs = Math.round((rare ? rng.range(18, 30) : rng.range(4, 8)) * 60000);
const spawnMs = Math.round((rare ? rng.range(15, 25) : rng.range(3, 5)) * 60000);
out.push({
id: `${region.id}:${m.wild.key}:0`,
place: PLACES[region.id][k % PLACES[region.id].length],
region: region.id,
materialId: m.id,
x: Math.round(rng.range(0.1, 0.9) * 1000) / 1000,
y: Math.round(rng.range(0.56, 0.88) * 1000) / 1000,
slots,
capacity: slots * take,
growMs,
spawnMs,
regrowMs: spawnMs * (slots - 1) + growMs,
take,
rank: Math.max(region.rank, m.wild.rank || 0),
rare,
});
});
}
return out;
}
function createGathering(now = Date.now()) {
return { nodes: /** @type {Record<string, Stand>} */ ({}), marks: /** @type {Mark[]} */ ([]), total: 0, trips: 0, created: now };
}
const finite = (/** @type {any} */ v) => typeof v === 'number' && Number.isFinite(v);
function normalizeGathering(g, now = Date.now()) {
const out = createGathering(now);
if (!g || typeof g !== 'object') return out;
if (finite(g.created)) out.created = Math.min(g.created, now);
if (g.nodes && typeof g.nodes === 'object') {
for (const [id, v] of Object.entries(g.nodes)) {
if (!v || typeof v !== 'object' || !Array.isArray(v.plants)) continue;
const plants = v.plants.filter((p) => p && typeof p.id === 'string' && finite(p.x) && finite(p.y) && finite(p.born))
.map((p) => ({ id: p.id, x: Math.min(1, Math.max(0, p.x)), y: Math.min(1, Math.max(0, p.y)), born: Math.min(p.born, now) }));
out.nodes[id] = { plants, due: finite(v.due) ? v.due : null, seq: finite(v.seq) ? v.seq : plants.length, ...(v.scar ? { scar: true } : {}) };
}
}
if (Array.isArray(g.marks)) {
out.marks = g.marks.filter((k) => k && typeof k.region === 'string' && typeof k.key === 'string' && finite(k.x) && finite(k.y) && finite(k.at) && now - k.at < MARK_MS * 2)
.map((k) => ({ region: k.region, key: k.key, x: k.x, y: k.y, at: Math.min(k.at, now), ...(k.deep ? { deep: true } : {}) }));
}
out.total = Number.isFinite(g.total) ? g.total : 0;
out.trips = Number.isFinite(g.trips) ? g.trips : 0;
return out;
}
function sprout(g, d, seq, born) {
const rng = new Rng(hashString(`sprout:${g.created}:${d.id}:${seq}`));
return { id: `${d.id}#${seq}`, x: Math.round(rng.range(0.06, 0.94) * 1000) / 1000, y: Math.round(rng.range(0.56, 0.9) * 1000) / 1000, born: Math.round(born) };
}
function untouched(g, d, now) {
const t0 = Math.min(g.created, now), rng = new Rng(hashString(`stand:${g.created}:${d.id}`));
const plants = [];
for (let k = 0; k < d.slots; k++) plants.push(sprout(g, d, k, t0 - d.growMs * (k === 0 ? 1.2 : rng.range(0.1, 1.6))));
return { plants, due: null, seq: d.slots };
}
const every = (d, s) => d.spawnMs * (s.scar ? SCAR_SLOWDOWN : 1);
function standOf(g, d, now = Date.now()) {
const saved = g.nodes[d.id] || untouched(g, d, now);
const s = { plants: saved.plants.slice(), due: saved.due, seq: saved.seq, ...(saved.scar ? { scar: true } : {}) };
while (s.due !== null && s.due <= now && s.plants.length < d.slots) {
s.plants.push(sprout(g, d, s.seq++, s.due));
s.due += every(d, s);
}
if (s.plants.length >= d.slots) { s.due = null; delete s.scar; }
return s;
}
function plantStage(d, p, now = Date.now()) {
const grown = Math.max(0, Math.min(1, (now - p.born) / d.growMs));
return { stage: grown >= 1 ? 'mature' : grown >= SPROUT_SHARE ? 'ripe' : 'sprout', grown, matureIn: Math.max(0, p.born + d.growMs - now) };
}
function depositStatus(g, d, now = Date.now()) {
const s = standOf(g, d, now);
const plants = s.plants.map((p) => ({ ...p, ...plantStage(d, p, now) }));
const mature = plants.filter((p) => p.stage === 'mature').length;
const missing = d.slots - plants.length;
const lastSprout = missing > 0 && s.due !== null ? s.due + (missing - 1) * every(d, s) : now;
const fullAt = Math.max(now, lastSprout + (missing > 0 ? d.growMs : 0), ...plants.map((p) => p.born + d.growMs));
const nextAt = mature ? now : Math.min(...plants.map((p) => p.born + d.growMs), s.due !== null ? s.due + d.growMs : Infinity);
const stock = mature * d.take;
return {
plants, mature, stock, available: stock,
fraction: plants.reduce((a, p) => a + p.grown, 0) / d.slots,
fullIn: fullAt - now, nextIn: Math.max(0, nextAt - now), scarred: !!s.scar,
};
}
const SCAR_SLOWDOWN = 2;
function marksIn(g, region, now = Date.now()) {
return g.marks.filter((k) => k.region === region).map((k) => ({ ...k, faded: (now - k.at) / (MARK_MS * (k.deep ? 2 : 1)) })).filter((k) => k.faded < 1);
}
const METHODS = {
pick: { verb: 'Pick', tool: null, sound: 'snip', icon: 'rose', hand: '' },
dig: { verb: 'Dig up', tool: 'kit', sound: 'dig', icon: 'trowel', hand: 'by hand, half as much — the Forager’s Kit’s trowel digs it out whole' },
mine: { verb: 'Chip out', tool: 'kit', sound: 'crack', icon: 'pick', hand: 'prised out by hand, half as much — the Forager’s Kit’s hammer would split the seam' },
scrape: { verb: 'Scrape', tool: 'kit', sound: 'snip', icon: 'sickle', hand: 'torn off by hand, half as much — the Forager’s Kit’s sickle cuts it clean' },
sweep: { verb: 'Sweep up', tool: 'kit', sound: 'dig', icon: 'brush', hand: 'scooped by hand, half as much — the Forager’s Kit’s brush gathers the fine dust' },
};
function methodOf(m) {
return METHODS[(m && m.wild && m.wild.gather) || 'pick'] || METHODS.pick;
}
function dayPart(st) {
if (st.dayOver) return 'dusk';
const opened = st.opened !== undefined ? st.opened : st.customerIndex > 0;
return opened ? 'day' : 'dawn';
}
const DAY_PART_NAME = { dawn: 'Dawn', day: 'Midday', dusk: 'Dusk' };
const DAY_PART_HINT = { dawn: 'The shop is still closed: dawn flowers are open.', day: 'The shop is open.', dusk: 'The shop has closed: dusk plants are open until you close for the night.' };
const WEATHERS = [
{ id: 'clear', name: 'Clear skies', icon: 'sun', desc: 'A fair day for foraging.' },
{ id: 'rain', name: 'Soft rain', icon: 'drop', desc: 'Plants drink deep: tonight every herb, root and moss grows back in full.' },
{ id: 'frost', name: 'Hoarfrost', icon: 'snow', desc: 'The meadow flowers stay shut (half the harvest); frost-loving caps swell (half again).' },
{ id: 'storm', name: 'Thunderstorm', icon: 'bolt', desc: 'Lightning recharges the crystal seams — they are full again tonight. Wind scatters a quarter of every outdoor harvest.' },
{ id: 'fog', name: 'Fog', icon: 'wisp', desc: 'Twilight lingers all day: dawn and dusk plants stay open from morning to night.' },
{ id: 'heat', name: 'Heatwave', icon: 'flame', desc: 'Sun-loving flowers are lush (a quarter more); mosses dry out (half as much).' },
];
function weatherOn(seed, day) {
if (day <= 1) return WEATHERS[0];
const r = new Rng(hashString(`weather:${seed}:${day}`)).next();
const cut = [0.4, 0.58, 0.7, 0.8, 0.9, 1];
const ids = ['clear', 'rain', 'fog', 'frost', 'storm', 'heat'];
const id = ids[cut.findIndex((c) => r < c)];
return WEATHERS.find((w) => w.id === id) || WEATHERS[0];
}
const PLANT_SHAPES = new Set(['root', 'leaf', 'petal', 'flower', 'clover', 'moss', 'cap', 'bean', 'pepper', 'bark', 'berry', 'bracket', 'sprig', 'spike', 'seed', 'lily', 'toadstool', 'reed']);
const FLOWER_SHAPES = new Set(['petal', 'flower', 'clover', 'spike', 'lily']);
function gatherPlan(st, d, m, opts = {}) {
const method = methodOf(m);
const hasTool = !method.tool || st.has(method.tool);
const part = dayPart(st);
const weather = weatherOn(st.seed, st.day);
const w = m && m.wild ? m.wild : {};
const hour = w.dawn ? 'dawn' : w.dusk ? 'dusk' : null;
const open = !hour || hour === part || weather.id === 'fog';
const factors = [];
if (st.has('satchel')) factors.push({ why: 'satchel', f: 1.5 });
if (!hasTool) factors.push({ why: method.hand, f: 0.5 });
if (!open) factors.push({ why: `closed until ${hour} — only a few sprigs`, f: 0.25 });
const shape = w.shape || '';
if (weather.id === 'frost' && FLOWER_SHAPES.has(shape)) factors.push({ why: 'shut by the frost', f: 0.5 });
if (weather.id === 'frost' && (shape === 'cap' || shape === 'toadstool' || shape === 'bracket')) factors.push({ why: 'swollen in the frost', f: 1.5 });
if (weather.id === 'heat' && (FLOWER_SHAPES.has(shape))) factors.push({ why: 'lush in the heat', f: 1.25 });
if (weather.id === 'heat' && shape === 'moss') factors.push({ why: 'dried out in the heat', f: 0.5 });
if (weather.id === 'storm') factors.push({ why: 'wind scatters it', f: 0.75 });
if (opts.thorough) factors.push({ why: 'thorough: the stand will sprout slowly', f: 2 });
const f = factors.reduce((a, x) => a * x.f, 1);
const take = Math.max(5, Math.floor((d.take * f) / 5) * 5);
const eff = factors.filter((x) => x.why !== 'satchel' && !x.why.startsWith('thorough')).reduce((a, x) => a * x.f, 1);
return { method, hasTool, part, weather, hour, open, factors, take, eff, thorough: !!opts.thorough };
}
function harvestable(g, d, plan, now = Date.now()) {
return depositStatus(g, d, now).mature ? plan.take : 0;
}
function ripen(g, d, now) {
const s = standOf(g, d, now);
const born = now - d.growMs;
s.plants = s.plants.map((p) => ({ ...p, born: Math.min(p.born, born) }));
while (s.plants.length < d.slots) s.plants.push(sprout(g, d, s.seq++, born));
g.nodes[d.id] = { plants: s.plants, due: null, seq: s.seq };
}
function weatherRegrowth(g, deposits, weather, lookup, now = Date.now()) {
for (const d of deposits) {
const m = lookup(d.materialId);
const shape = m && m.wild ? m.wild.shape : '';
if ((weather.id === 'rain' && PLANT_SHAPES.has(shape)) || (weather.id === 'storm' && (shape === 'crystal' || shape === 'shard'))) ripen(g, d, now);
}
}
function harvest(st, d, opts = {}) {
const now = opts.now ?? Date.now();
if (d.rank > st.rank && !opts.unlimited) return { ok: false, amount: 0, reason: 'locked' };
if (opts.unlimited) return { ok: true, amount: d.take, remaining: d.capacity };
const g = st.gathering;
const s = standOf(g, d, now);
const have = st.inventory[d.materialId] ?? 0;
const room = isFinite(have) ? Math.max(0, st.cap.storage - have) : 0;
const ripe = s.plants.filter((p) => plantStage(d, p, now).stage === 'mature').sort((a, b) => a.born - b.born);
const p = opts.plant ? s.plants.find((q) => q.id === opts.plant) : ripe[0];
if (!p || !ripe.includes(p)) {
const status = depositStatus(g, d, now);
return { ok: false, amount: 0, reason: p ? 'growing' : opts.plant ? 'gone' : 'depleted', nextIn: p ? plantStage(d, p, now).matureIn : status.nextIn };
}
const amount = Math.floor(Math.min(d.take, room) / 5) * 5;
if (amount <= 0) return { ok: false, amount: 0, reason: 'full' };
const plants = s.plants.filter((q) => q !== p);
const scar = !!(opts.thorough || s.scar);
g.nodes[d.id] = { plants, due: s.due ?? now + every(d, { scar }), seq: s.seq, ...(scar ? { scar: true } : {}) };
g.marks = g.marks.filter((k) => now - k.at < MARK_MS * 2);
g.marks.push({ region: d.region, key: opts.key || '', x: p.x, y: p.y, at: now, ...(opts.thorough ? { deep: true } : {}) });
st.inventory[d.materialId] = have + amount;
g.total += amount;
return { ok: true, amount, plant: p.id, remaining: (ripe.length - 1) * d.take };
}
function newDayRegrowth(g, deposits, now = Date.now()) {
for (const d of deposits) {
if (!g.nodes[d.id]) continue;
const s = standOf(g, d, now);
const plants = s.plants.map((p) => ({ ...p, born: p.born - d.growMs / 2 }));
const add = Math.ceil((d.slots - plants.length) * (s.scar ? 0.25 : 0.5));
for (let k = 0; k < add; k++) plants.push(sprout(g, d, s.seq++, now));
const full = plants.length >= d.slots;
g.nodes[d.id] = { plants, due: full ? null : s.due, seq: s.seq, ...(s.scar && !full ? { scar: true } : {}) };
}
}
function formatWait(ms) {
const s = Math.ceil(ms / 1000);
if (s < 60) return `${s}s`;
const m = Math.ceil(s / 60);
if (m < 60) return `${m} min`;
return `${Math.floor(m / 60)} h ${m % 60} min`;
}
return { REGIONS, REGION_BY_ID, STAGES, SPROUT_SHARE, MARK_MS, generateDeposits, createGathering, normalizeGathering, standOf, plantStage, depositStatus, SCAR_SLOWDOWN, marksIn, METHODS, methodOf, dayPart, DAY_PART_NAME, DAY_PART_HINT, WEATHERS, weatherOn, gatherPlan, harvestable, weatherRegrowth, harvest, newDayRegrowth, formatWait };
})();
// src/simulation/particles.js
const __m32 = (() => {
const { MAX_SPECIES } = __m18;
const { PHASE } = __m24;
const { NE } = __m13;
const STATE_FIELDS_F32 = ['x', 'y', 'vx', 'vy', 'temp', 'lat', 'eph', 'restX', 'restY', 'agit', 'burn', 'wet', 'q', 'skinU', 'skinV'];
const STATE_FIELDS_I32 = ['group'];
const STATE_FIELDS_U8 = ['phase'];
const STATE_FIELDS_U16 = ['skin'];
const STATE_FIELDS_U32 = ['seed'];
const DERIVED_FIELDS = [
'rho20', 'rho', 'invMass', 'rhoCp', 'kappa', 'lnMu20', 'viscT', 'lnMu', 'gran', 'binder',
'tm', 'tb', 'volFrac', 'latF', 'latV', 'beta', 'cA', 'cB', 'colL', 'colA', 'colB',
'opacity', 'flam', 'ign', 'combHeat', 'gasRho', 'glow', 'friction', 'hardness', 'yieldV', 'econd',
'auraR', 'auraG', 'auraB', 'auraI', 'arcT', 'whole', 'look',
];
const ARC_NONE = 1e9;
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
this.group = new Int32Array(capacity).fill(-1);
this.skin = new Uint16Array(capacity);
this.skinU = new Float32Array(capacity);
this.skinV = new Float32Array(capacity);
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
this.auraR = new Float32Array(capacity);
this.auraG = new Float32Array(capacity);
this.auraB = new Float32Array(capacity);
this.auraI = new Float32Array(capacity);
this.auraFx = new Float32Array(capacity * NE);
this.arcT = new Float32Array(capacity).fill(ARC_NONE);
this.whole = new Float32Array(capacity);
this.look = new Uint8Array(capacity);
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
this.group[i] = -1;
this.skin[i] = 0; this.skinU[i] = 0; this.skinV[i] = 0;
this.phase[i] = phase;
this.seed[i] = (Math.imul(this._seedCounter++, 2654435761) >>> 0) || 1;
this.sleep[i] = 0;
this.dirty[i] = 1;
this.comp.fill(0, i * this.S, (i + 1) * this.S);
return i;
}
copy(dst, src) {
const self = /** @type {any} */ (this);
for (const f of ['x', 'y', 'px', 'py', 'vx', 'vy', 'temp', 'lat', 'eph', 'restX', 'restY', 'agit', 'burn', 'wet', 'q', 'group', 'skin', 'skinU', 'skinV', 'phase', 'seed', 'sleep', 'dirty']) {
self[f][dst] = self[f][src];
}
for (const f of DERIVED_FIELDS) self[f][dst] = self[f][src];
this.comp.copyWithin(dst * this.S, src * this.S, (src + 1) * this.S);
this.auraFx.copyWithin(dst * NE, src * NE, (src + 1) * NE);
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
return { STATE_FIELDS_F32, STATE_FIELDS_I32, STATE_FIELDS_U8, STATE_FIELDS_U16, STATE_FIELDS_U32, DERIVED_FIELDS, ARC_NONE, Particles };
})();
// src/simulation/grid.js
const __m33 = (() => {
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
const __m34 = (() => {
const { SIM } = __m24;
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
const __m35 = (() => {
const { MAX_SPECIES, NO_BOIL } = __m18;
const { granularFraction, suspensionLnMult } = __m21;
const { rgbToOklab, linearToSrgb } = __m8;
const { PHASE } = __m24;
const { compositionEffects, EFFECTS, NE } = __m13;
const { ARC_NONE } = __m32;
const AURA_W = EFFECTS.map((e) => (e.kind === 'magic' ? 1 : 0.55));
const AURA_COL = EFFECTS.map((e) => e.color);
const auraFx = new Float64Array(NE);
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
let cA = 0, cB = 0, ec = 0, arcW = 0, arcS = 0, whole = 0, lookF = 0, look = 0;
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
if (sp.arcMag[s]) { arcW += f; arcS += f * sp.arcThr[s]; }
if (sp.isWhole[s]) {
whole += f;
if (f > lookF) { lookF = f; look = sp.look[s]; }
}
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
const s = Math.max(0, Math.min(1, (gran - 0.34) / 0.42));
p.yieldV[i] = (0.1 + 0.6 * bnd) * Math.pow(s, 1.1);
p.arcT[i] = arcW > 1e-4 ? arcS / arcW : ARC_NONE;
p.whole[i] = whole * inv;
p.look[i] = look;
refreshAura(sim, i);
p.dirty[i] = 0;
}
function refreshAura(sim, i) {
const p = sim.p, fx = p.auraFx, o = i * NE;
if (sim.species.count === 0) { p.auraI[i] = 0; fx.fill(0, o, o + NE); return; }
compositionEffects(sim.species, p.comp, i * MAX_SPECIES, p.temp[i], sim.laws || [], auraFx);
let I = 0, r = 0, g = 0, b = 0;
for (let k = 0; k < NE; k++) {
const v = Math.abs(auraFx[k]) * AURA_W[k];
if (v < 0.05) { fx[o + k] = 0; continue; }
fx[o + k] = v / 100;
const c = AURA_COL[k];
I += v; r += v * c[0]; g += v * c[1]; b += v * c[2];
}
if (I > 0) {
p.auraR[i] = r / I; p.auraG[i] = g / I; p.auraB[i] = b / I;
}
p.auraI[i] = I / 100;
}
return { GAS_MASS, refreshParticle, refreshAura };
})();
// src/simulation/rigid.js
const __m36 = (() => {
const { PHASE } = __m24;
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
this.angle = new Float32Array(MAX_GROUPS);
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
setRest(idx, g = -1) {
if (g >= 0 && g < MAX_GROUPS) this.angle[g] = 0;
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
_keepRest(idx, g) {
const p = this.sim.p;
const th = this.angle[g] || 0;
let cx = 0, cy = 0, m = 0;
for (const i of idx) { const w = p.rho[i]; cx += p.x[i] * w; cy += p.y[i] * w; m += w; }
cx /= m; cy /= m;
const c = Math.cos(th), s = Math.sin(th);
for (const i of idx) {
const dx = p.x[i] - cx, dy = p.y[i] - cy;
p.restX[i] = c * dx + s * dy;
p.restY[i] = -s * dx + c * dy;
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
this._keepRest(arr, best);
}
}
let nextFree = 0;
for (const arr of pending) {
while (nextFree < MAX_GROUPS && claimed[nextFree]) nextFree++;
if (nextFree >= MAX_GROUPS) break;
claimed[nextFree] = 1;
const from = p.group[arr[0]];
for (const i of arr) p.group[i] = nextFree;
this.angle[nextFree] = from >= 0 && from < MAX_GROUPS ? this.angle[from] : 0;
this._keepRest(arr, nextFree);
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
this.angle[g] = th;
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
const __m37 = (() => {
const { PHASE, SIM } = __m24;
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
const __m38 = (() => {
const { PHASE, PHASE_NAMES } = __m24;
const { MAX_SPECIES, NO_BOIL } = __m18;
const { refreshParticle } = __m35;
const { FRESH } = __m36;
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
const __m39 = (() => {
const { PHASE } = __m24;
const { MAX_SPECIES } = __m18;
const { compatFactor } = __m14;
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
Math.abs(p.gran[i] - p.gran[j]) < 1e-5 &&
Math.abs(p.auraI[i] - p.auraI[j]) < 1e-5 &&
Math.abs(p.arcT[i] - p.arcT[j]) < 1e-3
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
// src/simulation/arcane.js
const __m41 = (() => {
const { MAX_SPECIES } = __m18;
const { ARCANE_SCALE, ARCANE_ZERO, awakenedId } = __m15;
const { ARC_NONE } = __m32;
const RATE = 0.55;
const HEAT = 24;
const TAIL = 0.002;
function arcaneStep(sim, dt) {
const sp = sim.species;
if (sp.magicCount <= 0) return;
const p = sim.p, n = p.count, S = MAX_SPECIES, ns = sp.count;
const comp = p.comp, T = p.temp;
let woke = 0, wx = 0, wy = 0, wt = 0;
const by = sim._awokeBy || (sim._awokeBy = new Float64Array(S));
by.fill(0);
for (let i = 0; i < n; i++) {
const off = i * S;
let w = 0, tw = 0;
for (let s = 0; s < ns; s++) {
if (!sp.arcMag[s]) continue;
const f = comp[off + s];
if (f <= 1e-6) continue;
w += f;
tw += f * sp.arcThr[s];
}
if (w <= 1e-4) { p.arcT[i] = ARC_NONE; continue; }
const thr = tw / w;
p.arcT[i] = thr;
const Ta = ARCANE_ZERO + ARCANE_SCALE * thr;
const past = thr >= 0 ? T[i] - Ta : Ta - T[i];
if (past <= 0) continue;
const k = RATE * Math.min(1.6, 0.2 + past / 6);
let frac = 1 - Math.exp(-k * dt);
if (w * (1 - frac) < TAIL) frac = 1;
let moved = 0;
for (let s = 0; s < ns; s++) {
if (!sp.arcMag[s]) continue;
const f = comp[off + s];
if (f <= 1e-7) continue;
const a = awakeSlot(sim, s);
if (a < 0) continue;
const amt = frac >= 1 ? f : f * frac;
comp[off + s] = f - amt;
comp[off + a] += amt;
moved += amt;
by[s] += amt;
}
if (moved <= 0) continue;
const Q = moved * HEAT * (thr >= 0 ? 1 : -1);
T[i] -= Q / p.rhoCp[i];
p.eph[i] += Q;
p.dirty[i] = 1;
p.wet[i] = Math.min(1, p.wet[i] + 0.25);
woke += moved; wx += p.x[i] * moved; wy += p.y[i] * moved; wt += T[i] * moved;
}
if (woke > 0) {
sim.awakened += woke;
const last = sim._lastAwakenEvent ?? -99;
if (sim.time - last > 1.5) {
sim._lastAwakenEvent = sim.time;
let best = 0;
for (let s = 1; s < S; s++) if (by[s] > by[best]) best = s;
const def = sp.defs[best];
sim.emit({ type: 'awaken', x: wx / woke, y: wy / woke, amount: woke, species: def ? def.id : null, temp: wt / woke });
}
}
}
function awakeSlot(sim, s) {
const sp = sim.species;
let a = sp.awakeSlot[s];
if (a >= 0) return a;
const def = sp.defs[s];
if (!def) return -1;
const ad = sim.lookup(awakenedId(def.id));
if (!ad) return -1;
a = sim.slotFor(ad);
if (a >= 0) sp.awakeSlot[s] = a;
return a;
}
return { arcaneStep, awakeSlot };
})();
// src/reactions/reactions.js
const __m40 = (() => {
const { MAX_SPECIES } = __m18;
const { PHASE } = __m24;
const { awakenedId } = __m15;
const { awakeSlot } = __m41;
const { GAS, SOLID } = PHASE;
class ReactionSystem {
constructor(sim, rules) {
this.sim = sim;
this.rules = rules;
this.lastEvent = {};
this.progress = /** @type {Record<string, number>} */ ({});
this.burned = 0;
this._acc = new Float32Array(MAX_SPECIES);
this._pools = { sa: -1, saw: -1, sb: -1, sbw: -1, magA: false, magB: false };
}
setRules(rules) {
this.rules = rules;
}
needsSlot(id) {
void id;
return false;
}
step(dt) {
const sim = this.sim, p = sim.p, sp = sim.species;
const n = p.count;
for (const rule of this.rules) {
const sa = slot(sp, rule.a), saw = slot(sp, awakenedId(rule.a));
if (sa < 0 && saw < 0) continue;
let sb = -1, sbw = -1;
if (rule.b) {
sb = slot(sp, rule.b);
sbw = slot(sp, awakenedId(rule.b));
if (sb < 0 && sbw < 0) continue;
}
const pools = this._pools;
pools.sa = sa; pools.saw = saw; pools.sb = sb; pools.sbw = sbw;
pools.magA = saw >= 0 || (sa >= 0 && sp.arcMag[sa] === 1);
pools.magB = sbw >= 0 || (sb >= 0 && sp.arcMag[sb] === 1);
if (rule.kind === 'contact') this._contact(rule, dt);
else this._local(rule, dt);
}
this._combustion(dt);
for (let i = 0; i < n; i++) if (p.burn[i] > 0) p.burn[i] *= 0.93;
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
_yield(prods, off, used, q) {
const p = this.sim.p;
for (const [s, f] of prods) {
const v = used * f;
const a = q > 0 ? awakeSlot(this.sim, s) : -1;
if (a >= 0) {
p.comp[off + s] += v * (1 - q);
p.comp[off + a] += v * q;
} else p.comp[off + s] += v;
}
}
_rateT(rule, T) {
if (T < rule.minT || T > rule.maxT) return 0;
return 1 + Math.min(3, (T - rule.minT) / 40);
}
_local(rule, dt) {
const sim = this.sim, p = sim.p, S = MAX_SPECIES, comp = p.comp;
const { sa, saw, sb, sbw, magA, magB } = this._pools;
const hasB = sb >= 0 || sbw >= 0;
let prods = null;
const n = p.count;
for (let i = 0; i < n; i++) {
if (p.phase[i] === SOLID) continue;
const off = i * S;
const fa = pool(comp, off, sa, saw);
if (fa < 0.004) continue;
let lim = fa / rule.ra;
let fb = 0;
if (hasB) {
fb = pool(comp, off, sb, sbw);
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
const ua = ext * rule.ra, ub = hasB ? ext * rule.rb : 0;
const qa = take(comp, off, sa, saw, ua);
const qb = hasB ? take(comp, off, sb, sbw, ub) : 0;
const used = ua + ub;
this._yield(prods, off, used, awakeShare(ua, qa, magA, ub, qb, magB));
p.temp[i] += (rule.heat * used) / p.rhoCp[i];
p.dirty[i] = 1;
p.wet[i] = Math.min(1, p.wet[i] + 0.3);
this.progress[rule.id] = (this.progress[rule.id] || 0) + used;
this._event(rule, i);
}
}
_contact(rule, dt) {
const sim = this.sim, p = sim.p, S = MAX_SPECIES, comp = p.comp;
const { sa, saw, sb, sbw, magA, magB } = this._pools;
const { pairI, pairJ, pairCount } = sim.grid;
let prods = null;
for (let k = 0; k < pairCount; k++) {
let i = pairI[k], j = pairJ[k];
if (p.phase[i] === GAS || p.phase[j] === GAS) continue;
let fa = pool(comp, i * S, sa, saw), fb = pool(comp, j * S, sb, sbw);
if (fa < 0.004 || fb < 0.004) {
const fa2 = pool(comp, j * S, sa, saw), fb2 = pool(comp, i * S, sb, sbw);
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
const qa = take(comp, i * S, sa, saw, ua);
const qb = take(comp, j * S, sb, sbw, ub);
const q = awakeShare(ua, qa, magA, ub, qb, magB);
this._yield(prods, i * S, ua, q);
this._yield(prods, j * S, ub, q);
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
function slot(sp, id) {
const s = sp.slotOf.get(id);
return s === undefined ? -1 : s;
}
function pool(comp, off, s, sw) {
return (s >= 0 ? comp[off + s] : 0) + (sw >= 0 ? comp[off + sw] : 0);
}
function take(comp, off, s, sw, amt) {
const a = s >= 0 ? comp[off + s] : 0, w = sw >= 0 ? comp[off + sw] : 0;
const tot = a + w;
if (tot <= 0) return 0;
const q = w / tot;
if (s >= 0) comp[off + s] = Math.max(0, a - amt * (1 - q));
if (sw >= 0) comp[off + sw] = Math.max(0, w - amt * q);
return q;
}
function awakeShare(ua, qa, magA, ub, qb, magB) {
const tot = (magA ? ua : 0) + (magB ? ub : 0);
if (tot <= 0) return 0;
return ((magA ? ua * qa : 0) + (magB ? ub * qb : 0)) / tot;
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
const __m42 = (() => {
const { PHASE, SIM } = __m24;
const { MAX_SPECIES } = __m18;
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
this.autoSpan = 0;
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
this.ty = this.autoCenterY + Math.sin(this.autoPhase) * this.autoRadius * 0.45 + Math.sin(this.autoPhase * 0.31) * (this.autoSpan || 0);
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
const hard = p.hardness[i];
const crackAt = 0.16 + hard * 0.85;
const grindAt = 0.25 + hard * 1.5;
sim.dmg[i] += (pen * 40 + speed * 1.2) * dt * 3;
const g = p.group[i];
const size = g >= 0 ? bodySize(sim, g) : 1;
if (size >= 3 && sim.dmg[i] >= crackAt) {
crack(sim, i, g);
sim.dmg[i] = crackAt * 0.5;
return;
}
if (sim.dmg[i] < (size <= 2 ? crackAt : grindAt)) return;
sim.dmg[i] = 0;
if (g >= 0) sim.rigid.markDirty(g);
p.group[i] = -1;
p.phase[i] = POWDER;
p.sleep[i] = 0;
p.dirty[i] = 1;
p.vx[i] += (sim.rand() - 0.5) * 0.6;
p.vy[i] -= sim.rand() * 0.4;
sim.emit({ type: 'crush', x: p.x[i], y: p.y[i] });
sim.grid.query(p.x[i], p.y[i], 0.14, (j) => {
if (p.phase[j] === SOLID && p.group[j] === g && g >= 0) sim.dmg[j] += grindAt * 0.25;
});
}
function bodySize(sim, g) {
const p = sim.p;
let c = 0;
for (let k = 0; k < p.count; k++) if (p.group[k] === g) c++;
return c;
}
function crack(sim, i, g) {
const p = sim.p, t = sim.tool;
const idx = [];
let cx = 0, cy = 0;
for (let k = 0; k < p.count; k++) if (p.group[k] === g) { idx.push(k); cx += p.x[k]; cy += p.y[k]; }
if (idx.length < 3) return;
cx /= idx.length; cy /= idx.length;
let rad = 0;
for (const k of idx) rad = Math.max(rad, Math.hypot(p.x[k] - cx, p.y[k] - cy));
let dx = p.x[i] - cx, dy = p.y[i] - cy;
const d = Math.hypot(dx, dy);
let cut;
if (d > 0.45 * rad && d > 0.06) {
dx /= d; dy /= d;
cut = d - 0.11;
} else {
const vl = Math.hypot(t.vx, t.vy) || 1;
dx = -t.vy / vl; dy = t.vx / vl;
cut = 0;
}
const piece = [], rest = [];
for (const k of idx) ((p.x[k] - cx) * dx + (p.y[k] - cy) * dy >= cut ? piece : rest).push(k);
if (!piece.length || !rest.length) return;
const ng = sim.rigid.alloc();
if (ng < 0) return;
sim.rigid.angle[ng] = sim.rigid.angle[g];
for (const k of piece) {
p.group[k] = ng;
p.sleep[k] = 0;
p.vx[k] += dx * 0.35;
p.vy[k] += dy * 0.35 - 0.1;
}
for (const k of rest) p.sleep[k] = 0;
sim.rigid.markDirty(g);
sim.rigid.markDirty(ng);
sim.emit({ type: 'crack', x: p.x[i], y: p.y[i], pieces: 2 });
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
const __m43 = (() => {
const { PHASE, SIM, formPhase } = __m24;
const { COLUMN } = __m34;
const { chunkTemplate, chunkSize, hasPieces, skinOf, grainSkinOf, piece } = __m19;
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
this.chunkTimer = 0.36;
const size = Math.min(a.remaining, chunkSize(a.def));
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
if (form === 'powder') this._grainSkin(a.def, i);
a.remaining--;
a.spawned++;
this.acc -= 1;
this.blocked = 0;
this.poured[a.def.id] = (this.poured[a.def.id] || 0) + 1;
}
if (this.acc > 3) this.acc = 3;
}
_grainSkin(def, i) {
const p = this.sim.p, sd = p.seed[i];
const skin = grainSkinOf(def, sd >>> 30);
const pc = skin ? piece(skin) : null;
if (!pc) return;
const h = Math.imul(sd ^ (sd >>> 13), 0x5bd1e995) >>> 0;
const [u, v] = pc.pts[h % pc.pts.length];
p.skin[i] = skin;
p.skinU[i] = u + (((h >>> 8) & 255) / 255 - 0.5) * 0.8;
p.skinV[i] = v + (((h >>> 16) & 255) / 255 - 0.5) * 0.8;
}
_spawnChunk(a, size) {
const sim = this.sim;
const s = SIM.SPACING;
const variant = hasPieces(a.def) ? Math.floor(sim.rand() * 4) : -1;
const offs = chunkTemplate(a.def, size, variant);
let ext = 0;
for (const [ox, oy] of offs) ext = Math.max(ext, Math.hypot(ox, oy) * s);
const mouth = sim.cauldron.mouth;
const room = Math.max(0.05, mouth - ext - 0.12);
const cx = Math.max(-room, Math.min(room, a.x + (sim.rand() - 0.5) * 0.3));
const cy = this.spawnY() + 0.12;
const ang = (sim.rand() - 0.5) * (ext > 0.25 ? 0.8 : Math.PI * 2);
const ca = Math.cos(ang), sa = Math.sin(ang);
const pts = offs.map(([ox, oy]) => [cx + (ca * ox - sa * oy) * s, cy + (sa * ox + ca * oy) * s]);
for (const [x, y] of pts) if (!this._free(x, y, 0.085)) return false;
const g = sim.rigid.alloc();
if (g < 0) return false;
const idx = [];
const skin = variant >= 0 ? skinOf(a.def, variant) : 0;
for (let k = 0; k < pts.length; k++) {
const [x, y] = pts[k];
const i = sim.addParticle(a.def, x, y, PHASE.SOLID, a.temp);
if (i < 0) break;
sim.p.group[i] = g;
sim.p.vy[i] = 1.2;
sim.p.skin[i] = skin;
sim.p.skinU[i] = offs[k][0];
sim.p.skinV[i] = offs[k][1];
idx.push(i);
}
if (!idx.length) return false;
sim.rigid.setRest(idx, g);
const p = sim.p;
for (const i of idx) {
const rx = p.restX[i], ry = p.restY[i];
p.restX[i] = ca * rx + sa * ry;
p.restY[i] = -sa * rx + ca * ry;
}
sim.rigid.angle[g] = ang;
sim.rigid.markDirty(g);
return true;
}
}
return { Emitter };
})();
// src/simulation/electric.js
const __m44 = (() => {
const { PHASE } = __m24;
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
// src/simulation/world.js
const __m31 = (() => {
const { PHASE, SIM, TUNE, formPhase } = __m24;
const { Particles } = __m32;
const { NeighborGrid } = __m33;
const { Cauldron, COLUMN } = __m34;
const { SpeciesTable, MAX_SPECIES } = __m18;
const { refreshParticle } = __m35;
const { RigidBodies } = __m36;
const { thermalStep } = __m37;
const { phaseStep, classifyFluid } = __m38;
const { diffusionStep } = __m39;
const { ReactionSystem } = __m40;
const { ToolState, toolForces, toolConstraints } = __m42;
const { Emitter } = __m43;
const { electricStep } = __m44;
const { arcaneStep } = __m41;
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
this.laws = opts.laws || [];
this.furnace = { setting: 0, maxFlame: 340, heatPower: 3.5, minCool: 4, coolPower: 6 };
this.oxygen = 1;
this.events = [];
this.time = 0;
this.steps = 0;
this.accumulator = 0;
this.energyIn = 0;
this.energyOut = 0;
this.awakened = 0;
this._lastAwakenEvent = -99;
this._awokeBy = null;
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
arcaneStep(this, dt2);
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
// src/game/measure.js
const __m45 = (() => {
const { MAX_SPECIES } = __m18;
const { PHASE, SIM } = __m24;
const { compatFactor } = __m14;
const { oklabToRgb } = __m8;
const { sampleEffects } = __m13;
function measureParticles(sim, indices) {
const n = indices.length;
if (!n) return null;
const p = sim.p, sp = sim.species, S = MAX_SPECIES;
const ns = sp.count;
const comp = new Float64Array(ns);
let L = 0, A = 0, B = 0, rho = 0, T = 0, lnMu = 0, glow = 0, q = 0;
const charge = p.q;
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
if (charge) q += charge[i];
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
let volat = 0;
for (let s = 0; s < ns; s++) {
const def = sp.defs[s];
if (!def || comp[s] < 1e-5) continue;
composition[def.id] = comp[s];
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
const fx = sampleEffects(sim, indices);
return {
count: n,
ml: n * SIM.ML_PER_PARTICLE,
composition,
color: oklabToRgb(lab[0], lab[1], lab[2]),
lab,
density: rho / n,
viscosity: Math.exp(lnMu / n),
temperature: T / n,
effects: Array.from(fx.effects, (v) => Math.round(v * 100) / 100),
resonance: Array.from(fx.resonance),
charge: q / n,
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
function densityWord(rho) {
return rho > 1.3 ? 'heavy' : rho < 0.9 ? 'light' : 'like water';
}
function evennessWord(stability) {
return stability >= 90 ? 'evenly mixed' : stability >= 70 ? 'a little uneven' : 'uneven — stir it';
}
return { measureParticles, tapSelection, probeSelection, viscosityClass, densityWord, evennessWord };
})();
// src/game/vial.js
const __m30 = (() => {
const { Simulation } = __m31;
const { PHASE, SIM } = __m24;
const { MAX_SPECIES } = __m18;
const { measureParticles } = __m45;
const { refreshParticle } = __m35;
const ROOM = SIM.AMBIENT;
const COOL_TAU = 480;
function makeVial(sim, indices, meta) {
const sp = sim.species, p = sim.p, S = MAX_SPECIES;
const used = [];
for (let s = 0; s < sp.count; s++) {
if (!sp.defs[s]) continue;
let any = false;
for (const i of indices) if (p.comp[i * S + s] > 1e-6) { any = true; break; }
if (any) used.push(s);
}
const particles = indices.map((i) => ({
c: used.map((s) => Math.round(p.comp[i * S + s] * 1e6) / 1e6),
t: Math.round(p.temp[i] * 100) / 100,
q: Math.round(p.q[i] * 1e4) / 1e4 || undefined,
ph: p.phase[i] === PHASE.SOLID || p.phase[i] === PHASE.GAS ? PHASE.LIQUID : p.phase[i],
}));
const vial = /** @type {Vial} */ ({
id: 'v' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36),
species: used.map((s) => sp.defs[s].id),
particles,
ml: particles.length * SIM.ML_PER_PARTICLE,
bottledMl: particles.length * SIM.ML_PER_PARTICLE,
m: null,
batchId: '', rev: 0, cert: {}, parts: [], day: 0, log: [],
...meta,
});
vial.log = [...(vial.log || []), { type: 'bottled', ml: vial.ml, day: vial.day }];
return vial;
}
function appendParticles(vial, sim, indices) {
if (!indices.length) return vial;
const part = makeVial(sim, indices, {});
const map = part.species.map((id) => {
let j = vial.species.indexOf(id);
if (j < 0) {
j = vial.species.length;
vial.species.push(id);
for (const vp of vial.particles) vp.c.push(0);
}
return j;
});
for (const vp of part.particles) {
const c = new Array(vial.species.length).fill(0);
vp.c.forEach((f, k) => { c[map[k]] = f; });
vial.particles.push({ ...vp, c });
}
vial.ml = vial.particles.length * SIM.ML_PER_PARTICLE;
vial.bottledMl = vial.ml;
return vial;
}
const scratch = new WeakMap();
function scratchSim(lookup, laws) {
let s = scratch.get(lookup);
if (!s) {
s = new Simulation({ size: 'pot', lookup, reactions: [], laws, capacity: 900 });
s.maxParticles = s.capacity;
scratch.set(lookup, s);
}
s.laws = laws || [];
return s;
}
function load(vial, lookup, laws, which) {
const sim = scratchSim(lookup, laws);
sim.clear();
const defs = vial.species.map((id) => lookup(id));
const slots = defs.map((d) => (d ? sim.slotFor(d) : -1));
const S = MAX_SPECIES;
const list = which || vial.particles.map((_, k) => k);
const idx = [];
for (const k of list) {
const vp = vial.particles[k];
let first = vp.c.findIndex((f, j) => f > 0 && defs[j]);
if (first < 0) first = 0;
const i = sim.addParticle(defs[first] || defs.find(Boolean), 0, 1, vp.ph, vp.t);
if (i < 0) break;
sim.p.comp.fill(0, i * S, (i + 1) * S);
vp.c.forEach((f, j) => { if (f > 0 && slots[j] >= 0) sim.p.comp[i * S + slots[j]] += f; });
sim.p.q[i] = vp.q || 0;
sim.p.phase[i] = vp.ph;
sim.p.dirty[i] = 1;
idx.push(i);
}
for (const i of idx) refreshParticle(sim, i);
return { sim, idx };
}
function measureVial(vial, lookup, laws, which) {
if (!vial.particles.length) return null;
const { sim, idx } = load(vial, lookup, laws, which);
return measureParticles(sim, idx);
}
function updateVial(vial, lookup, laws) {
vial.ml = vial.particles.length * SIM.ML_PER_PARTICLE;
vial.m = measureVial(vial, lookup, laws);
return vial;
}
function takeDose(vial, ml, lookup, laws, day) {
const N = vial.particles.length;
const k = Math.min(N, Math.max(1, Math.round(ml / SIM.ML_PER_PARTICLE)));
if (!N) return null;
const which = [];
for (let j = 0; j < k; j++) which.push(Math.min(N - 1, Math.floor(((j + 0.5) * N) / k)));
const uniq = [...new Set(which)];
const dose = measureVial(vial, lookup, laws, uniq);
const take = new Set(uniq);
vial.particles = vial.particles.filter((_, i) => !take.has(i));
vial.log.push({ type: 'dose', ml: uniq.length * SIM.ML_PER_PARTICLE, day });
updateVial(vial, lookup, laws);
return { dose, ml: uniq.length * SIM.ML_PER_PARTICLE };
}
function pourBack(vial, sim) {
const n = vial.particles.length;
if (sim.p.count + n > sim.maxParticles) return 0;
const S = MAX_SPECIES;
const defs = vial.species.map((id) => sim.lookup(id));
let made = 0;
const mouth = sim.cauldron.mouth;
for (let k = 0; k < n; k++) {
const vp = vial.particles[k];
const col = k % 9, row = Math.floor(k / 9);
const x = (-0.8 + (col / 8) * 1.6) * (mouth - 0.12) + (sim.rand() - 0.5) * 0.02;
const y = 0.14 + row * 0.1 + (col % 2) * 0.05;
let first = vp.c.findIndex((f, j) => f > 0 && defs[j]);
if (first < 0) first = 0;
const i = sim.addParticle(defs[first], x, Math.min(y, sim.cauldron.depth - 0.2), vp.ph, vp.t);
if (i < 0) break;
sim.p.comp.fill(0, i * S, (i + 1) * S);
vp.c.forEach((f, j) => {
if (f <= 0 || !defs[j]) return;
const s = sim.slotFor(defs[j]);
if (s >= 0) sim.p.comp[i * S + s] += f;
});
sim.p.q[i] = vp.q || 0;
sim.p.vy[i] = 0.8;
sim.p.dirty[i] = 1;
made++;
}
return made;
}
function pourBackParts(vial, ml) {
const parts = vial.parts || [];
const batchMl = parts.reduce((a, p) => a + p.ml, 0);
const share = batchMl > 0 ? Math.min(1, ml / batchMl) : 0;
return parts.map((p) => ({ id: p.id, ml: Math.round(p.ml * share * 10) / 10 }));
}
function relaxVial(vial, dt) {
const k = 1 - Math.exp(-dt / COOL_TAU);
let moved = 0;
for (const vp of vial.particles) {
const d = (ROOM - vp.t) * k;
vp.t += d;
moved = Math.max(moved, Math.abs(d));
}
return moved;
}
function vialInventory(vial) {
const out = {};
for (const vp of vial.particles) vp.c.forEach((f, j) => { if (f > 0) out[vial.species[j]] = (out[vial.species[j]] || 0) + f; });
return out;
}
function migrateVial(v) {
if (!v || typeof v !== 'object') return null;
if (Array.isArray(v.particles) && Array.isArray(v.species)) return v;
const m = v.m || {};
const comp = m.composition || {};
const species = Object.keys(comp);
const tot = species.reduce((a, id) => a + comp[id], 0) || 1;
const n = Math.max(0, Math.floor((v.ml || 0) / SIM.ML_PER_PARTICLE));
const c = species.map((id) => comp[id] / tot);
const particles = [];
for (let k = 0; k < n; k++) particles.push({ c: c.slice(), t: m.temperature ?? ROOM, q: m.charge || undefined, ph: PHASE.LIQUID });
return { ...v, species, particles, ml: n * SIM.ML_PER_PARTICLE, bottledMl: v.bottledMl ?? n * SIM.ML_PER_PARTICLE, log: v.log || [], cert: v.cert || {} };
}
return { makeVial, appendParticles, measureVial, updateVial, takeDose, pourBack, pourBackParts, relaxVial, vialInventory, migrateVial };
})();
// src/game/commerce.js
const __m46 = (() => {
const { Rng, hashString } = __m6;
const { EFFECT_KEYS, EFFECT_INDEX, NE, EFFECT_BY_KEY } = __m13;
const { evaluatePotion, strongestUnwanted, PROPERTY_LABELS } = __m23;
const { PURITY_LIMIT } = __m25;
const { summarize, evidenceRank, EVIDENCE_TEXT } = __m27;
function draftLabel(vial, theory, day) {
const claims = {};
const cert = vial.cert || {}, recs = vial.certRecords || {};
const ev = evidenceOf(vial);
for (let k = 0; k < NE; k++) {
const key = EFFECT_KEYS[k];
if (cert[key] !== undefined) {
claims[key] = trialClaim(cert[key], recs[key], ev[key]);
} else if (theory) {
const v = theory[k];
claims[key] = Math.abs(v) < 0.6 ? { kind: 'none', source: 'estimate', spread: 1 } : { kind: 'value', value: Math.round(v), source: 'estimate', spread: Math.round(2 + 0.3 * Math.abs(v)) };
} else claims[key] = { kind: 'unknown', source: 'estimate' };
}
return { claims, day };
}
function applyTrials(label, values, record, evidence = {}) {
for (const [key, v] of Object.entries(values)) {
const c = label.claims[key];
const t = trialClaim(v, record, evidence[key]);
if (c && c.source === 'player' && !sameClaim(c, t)) {
c.measured = t.measured;
c.record = record;
if (t.evidence) c.evidence = t.evidence;
continue;
}
label.claims[key] = t;
}
return label;
}
function evidenceOf(vial) {
const out = {};
if (!vial || !vial.samples) {
for (const k of Object.keys((vial && vial.cert) || {})) out[k] = { level: 'preliminary', n: 1, r: 1, u: 0 };
return out;
}
const s = summarize(vial.samples);
for (const k of Object.keys(s.values)) out[k] = { level: s.level[k], n: s.n[k], r: s.rabbits[k], u: s.unc[k], s: sigmaOfMargin(s.unc[k]) };
return out;
}
const sigmaOfMargin = (u) => Math.round((u / 1.96) * 10) / 10;
const STAR_STEPS = [0.26, 0.19, 0.14];
const MAX_STARS = STAR_STEPS.length;
const starsOf = (rel) => STAR_STEPS.filter((t) => rel <= t).length;
const relSigma = (value, sigma) => sigma / Math.max(5, Math.abs(value));
function accuracyStars(value, sigma) {
return starsOf(relSigma(value, sigma));
}
function claimSigma(c) {
if (!c || !c.evidence) return null;
if (c.evidence.s !== undefined) return c.evidence.s;
return c.evidence.u ? sigmaOfMargin(c.evidence.u) : null;
}
const wellTested = (c) => c.source === 'trial' && claimSigma(c) !== null && !(c.evidence && c.evidence.n < 2);
function claimStars(c) {
if (!c || c.kind === 'unknown') return null;
if (!wellTested(c)) return 0;
return accuracyStars(c.measured ?? c.value ?? 0, /** @type {number} */ (claimSigma(c)));
}
function labelStars(label) {
let any = false, num = 0, den = 0;
for (const c of Object.values((label && label.claims) || {})) {
if (!c || c.kind === 'unknown') continue;
any = true;
if (!wellTested(c)) continue;
const v = c.measured ?? c.value ?? 0;
const w = Math.max(1, Math.abs(v));
num += w * relSigma(v, /** @type {number} */ (claimSigma(c)));
den += w;
}
if (!any) return null;
return den > 0 ? starsOf(num / den) : 0;
}
function trialClaim(v, record, evidence) {
const measured = Math.round(v * 10) / 10;
const ev = evidence ? { evidence } : {};
return Math.abs(v) < PURITY_LIMIT ? { kind: 'none', source: 'trial', record, measured, ...ev } : { kind: 'value', value: measured, source: 'trial', record, measured, ...ev };
}
function sameClaim(a, b) {
if (a.kind !== b.kind) return false;
return a.kind !== 'value' || Math.abs((a.value || 0) - (b.value || 0)) < 0.05;
}
function editClaim(c, key, op) {
const keep = { record: c.record, measured: c.measured, ...(c.evidence ? { evidence: c.evidence } : {}) };
const tested = c.measured !== undefined ? trialClaim(c.measured, c.record, c.evidence) : null;
if (op === 'tested') return tested || c;
if (op === 'unknown') return { kind: 'unknown', source: 'player', ...keep };
let next;
if (op === 'none') next = { kind: 'none', source: 'player', ...keep };
else {
const d = op === 'up' ? 1 : -1;
const signed = key === 'acidity';
let nv = Math.round(((c.kind === 'value' ? c.value || 0 : 0) + d) * 10) / 10;
if (c.kind !== 'value' && Math.abs(nv) < PURITY_LIMIT) nv = d > 0 ? 2 : signed ? -2 : 0;
if (!signed) nv = Math.max(0, nv);
next = Math.abs(nv) < PURITY_LIMIT ? { kind: 'none', source: 'player', ...keep } : { kind: 'value', value: nv, source: 'player', ...keep };
}
return tested && sameClaim(next, tested) ? tested : next;
}
function claimedEffects(label) {
const e = new Array(NE).fill(0);
for (let k = 0; k < NE; k++) {
const c = label.claims[EFFECT_KEYS[k]];
if (c && c.kind === 'value') e[k] = c.value || 0;
}
return e;
}
function relevantEffects(com) {
const keys = new Set();
for (const r of com.requirements) {
if (EFFECT_INDEX[r.key] !== undefined) keys.add(r.key);
if (r.key === 'purity') for (const k of EFFECT_KEYS) if (!(r.exclude || []).includes(k)) keys.add(k);
}
return [...keys];
}
const EVIDENCE_WEIGHT = { preliminary: 0.45, repeated: 0.7, corroborated: 0.9, certified: 1 };
function claimWeight(c) {
if (!c || c.source !== 'trial') return 0;
return EVIDENCE_WEIGHT[(c.evidence && c.evidence.level) || 'preliminary'] ?? 0.45;
}
function trustReport(com, label, rank) {
const keys = relevantEffects(com);
const proof = com.customer.persona ? com.customer.persona.proof : 0.5;
if (!keys.length) return { trust: Math.min(1.05, 0.85 + 0.04 * rank), evidence: 1, unknown: 0, proof, reasons: ['nothing magical to prove'] };
let proven = 0, unknown = 0, weak = 0;
for (const k of keys) {
const c = label.claims[k];
if (!c || c.kind === 'unknown') unknown++;
const w = claimWeight(c);
proven += w;
if (w > 0 && w < 0.7) weak++;
}
const evidence = proven / keys.length;
const t = 0.5 + 0.05 * rank + evidence * (0.25 + 0.3 * proof) - (unknown / keys.length) * (0.2 + 0.4 * proof) - (1 - evidence) * 0.15 * proof;
const reasons = [];
if (evidence >= 0.85) reasons.push('your trials back the label well');
else if (evidence > 0) reasons.push(weak ? `${weak} of the claims rest on a single reading` : 'only part of the label is tested');
else reasons.push('nothing on the label is tested');
if (unknown) reasons.push(`${unknown} effect${unknown > 1 ? 's' : ''} left unknown`);
if (proof >= 0.8) reasons.push('this customer wants proof');
if (rank >= 2) reasons.push('your guild rank speaks for you');
return { trust: Math.max(0.3, Math.min(1.05, t)), evidence, unknown, proof, reasons };
}
function labelTrust(com, label, rank) {
return trustReport(com, label, rank).trust;
}
function unprovenWanted(com, label) {
return proofGaps(com, label).map((g) => g.key);
}
function proofGaps(com, label) {
const proof = com.customer.persona ? com.customer.persona.proof : 0.5;
if (proof < 0.8) return [];
const need = proof >= 0.92 ? 'corroborated' : 'repeated';
const out = [];
for (const r of com.requirements) {
if (!r.effect || r.key === 'purity') continue;
const c = label.claims[r.key];
const have = c && c.source === 'trial' ? (c.evidence && c.evidence.level) || 'preliminary' : 'untested';
if (have === 'untested' || evidenceRank(have) < evidenceRank(need)) out.push({ key: r.key, need, have });
}
const purity = com.requirements.find((r) => r.key === 'purity');
if (purity) {
for (const k of EFFECT_KEYS) {
if ((purity.exclude || []).includes(k)) continue;
const c = label.claims[k];
if (!c || c.source !== 'trial') { out.push({ key: k, need: 'preliminary', have: 'untested' }); }
}
}
return out;
}
function claimedMeasurement(m, label) {
return { ...m, effects: claimedEffects(label) };
}
function openNegotiation(com, vial, label, rank) {
const persona = com.customer.persona || { haggle: 0.5, patience: 3, honesty: 0.85, proof: 0.5 };
const rng = new Rng(hashString(`${com.id}:${vial.id}:haggle`));
const fitEv = evaluatePotion(com, /** @type {any} */ (claimedMeasurement({ ...vial.m, ml: vial.ml }, label)));
const fit = fitEv.quality;
const tr = trustReport(com, label, rank);
const trust = tr.trust;
const qty = Math.min(1, vial.ml / com.bottleMl);
const reservation = Math.round(com.budget * Math.pow(fit, 1.3) * trust * Math.pow(qty, 1.4) * rng.range(0.92, 1.08) * 10) / 10;
const offer = Math.round(reservation * (0.58 + 0.27 * (1 - persona.haggle)) * 10) / 10;
const misses = fitEv.rows.filter((r) => r.score < 0.999).map((r) => r.req.key);
const reasons = [
{ k: 'fit', v: Math.round(fit * 100), text: fit >= 0.999 ? 'the label and what they see meet the whole order' : `short on ${misses.map((m) => String(PROPERTY_LABELS[m] || m).toLowerCase()).join(', ')}` },
{ k: 'trust', v: Math.round(trust * 100), text: tr.reasons.join('; ') },
{ k: 'quantity', v: Math.round(qty * 100), text: qty >= 0.98 ? 'the full measure' : `only ${vial.ml} of ${com.bottleMl} ml` },
{ k: 'temper', v: Math.round((1 - persona.haggle) * 100), text: persona.haggle > 0.6 ? 'a hard bargainer' : persona.haggle < 0.3 ? 'easy-going' : 'a fair trader' },
];
if (com.patron) reasons.push({ k: 'history', v: Math.round(50 + 50 * com.patron.trust), text: com.patron.trust > 0.2 ? 'they trust you from past visits' : com.patron.trust < -0.2 ? 'they remember being let down' : 'they have been here before' });
const n = { round: 0, patience: persona.patience, reservation, offer, fit, trust, reasons, state: /** @type {'open'} */ ('open'), log: [] };
const opening = fit < 0.35 ? 'That is not what I asked for.' : trust < 0.55 ? 'How do I know it does what your label says?' : fit < 0.8 ? 'Not quite what I wanted, but let’s talk.' : 'This looks right.';
n.log.push({ who: 'them', text: `${opening} I can offer ${fmt(offer)} coins.`, coins: offer });
return n;
}
function proposePrice(n, com, ask) {
if (n.state !== 'open') return n;
const persona = com.customer.persona || { haggle: 0.5 };
ask = Math.max(0, Math.round(ask * 10) / 10);
n.round++;
n.log.push({ who: 'you', text: `I want ${fmt(ask)} coins.`, coins: ask });
if (ask <= n.offer + 0.05) return close(n, ask, 'Done! A fair price.');
if (ask <= n.reservation * (1 - 0.12 * persona.haggle)) return close(n, ask, 'Very well — agreed.');
n.patience -= ask > n.reservation * 1.4 ? 2 : 1;
if (n.patience <= 0) {
n.state = 'left';
n.log.push({ who: 'them', text: ask > n.reservation * 1.4 ? 'That is robbery! Good day.' : 'We will not agree. I will find another alchemist.' });
return n;
}
const step = (0.3 + 0.35 * (1 - persona.haggle)) * (n.reservation - n.offer);
n.offer = Math.round(Math.min(n.reservation, Math.max(n.offer, n.offer + step)) * 10) / 10;
const mood = ask > n.reservation * 1.4 ? 'Absurd.' : persona.haggle > 0.6 ? 'Hah! No.' : 'Too much for me.';
n.log.push({ who: 'them', text: `${mood} ${fmt(n.offer)} coins, and that is generous.${n.patience <= 1 ? ' Last offer.' : ''}`, coins: n.offer });
return n;
}
function acceptOffer(n) {
if (n.state !== 'open') return n;
n.log.push({ who: 'you', text: `Agreed: ${fmt(n.offer)} coins.` });
return close(n, n.offer, 'Pleasure doing business.');
}
function close(n, price, text) {
n.state = 'deal';
n.price = price;
n.log.push({ who: 'them', text });
return n;
}
function recordSale(st, com, vial, label, price, truth) {
const ev = evaluatePotion(com, truth);
const rng = new Rng(hashString(`${com.id}:${vial.id}:after`));
const persona = com.customer.persona || { honesty: 0.85 };
const wrong = [];
for (const k of EFFECT_KEYS) {
const c = label.claims[k];
const v = truth.effects[EFFECT_INDEX[k]];
if (!c || c.kind === 'unknown') continue;
if (c.kind === 'none' && Math.abs(v) >= PURITY_LIMIT) wrong.push(k);
const margin = c.source === 'trial' && c.evidence ? c.evidence.u || 0 : 0;
if (c.kind === 'value' && Math.abs(v - (c.value || 0)) > Math.max(3, 0.25 * Math.abs(c.value || 0), margin)) wrong.push(k);
}
const purity = com.requirements.find((r) => r.key === 'purity');
const side = purity ? strongestUnwanted(truth.effects, purity.exclude || []) : { value: 0, key: '' };
const harmful = side.value >= 3 && ['toxicity', 'death', 'acidity'].includes(side.key);
const failed = ev.rows.filter((r) => r.score < 0.7 && r.req.key !== 'quantity').map((r) => r.req.key);
const evidence = [...new Set(Object.values(label.claims).filter((c) => c.source === 'trial' && c.record).map((c) => c.record))];
const sale = {
id: 's' + hashString(`${com.id}:${vial.id}`).toString(36), day: st.day, customer: { name: com.customer.name, title: com.customer.title, archetype: com.customer.archetype, portrait: com.customer.portrait },
potion: com.potionName, price, quality: Math.round(ev.quality * 1000) / 1000, repDelta: ev.repDelta, wrong, failed, side: side.value >= PURITY_LIMIT ? side : null,
claims: label.claims, truth: Array.from(truth.effects, (v) => Math.round(v * 10) / 10), evidence, batchId: vial.batchId, rev: vial.rev, ml: vial.ml,
};
let follow = null;
const due = st.day + 1;
if (ev.quality >= 0.85 && !wrong.length && !harmful) {
if (rng.next() > persona.honesty) {
const key = rng.pick(com.requirements.filter((r) => r.effect && r.key !== 'purity').map((r) => r.key).concat(['quality']));
follow = { kind: 'complaint', legit: false, demand: Math.round(price * rng.range(0.5, 1) * 10) / 10, cites: [key],
text: key === 'quality' ? 'It did nothing at all. I want my money back.' : `The ${EFFECT_BY_KEY[key] ? EFFECT_BY_KEY[key].label.toLowerCase() : key} was much weaker than you claimed. Refund me.` };
} else {
const referral = rng.chance(0.35);
follow = { kind: 'praise', legit: true, tip: Math.round(price * rng.range(0.05, 0.15) * 10) / 10, referral,
text: referral ? 'It worked wonders! I told a friend about your shop — expect them.' : 'It worked exactly as promised. Thank you!' };
}
} else if (ev.quality < 0.6 || wrong.length || harmful) {
const share = harmful ? 1 : wrong.length ? Math.max(0.5, 1 - ev.quality) : Math.max(0.3, 1 - ev.quality);
const cites = [...new Set([...wrong, ...failed])];
follow = { kind: 'complaint', legit: true, demand: Math.round(price * share * 10) / 10, cites, harmful,
text: harmful ? `Your potion made me ill — ${EFFECT_BY_KEY[side.key].label.toLowerCase()}! You never said.` : wrong.length ? `Your label lied: ${wrong.map((k) => EFFECT_BY_KEY[k].label.toLowerCase()).join(', ')} was nothing like you wrote.` : 'It barely worked. I paid for a proper potion.' };
} else {
follow = { kind: 'quiet', legit: true, text: 'Seemed content enough.' };
}
follow = { id: 'f' + sale.id.slice(1), saleId: sale.id, day: due, customer: sale.customer, ...follow, resolved: false };
return { sale, follow, ev };
}
function resolveFollowUp(st, f, action) {
const sale = (st.sales || []).find((s) => s.id === f.saleId);
const rng = new Rng(hashString(`${f.id}:${action}`));
let coins = 0, rep = 0, text = '';
const base = sale ? sale.repDelta : 0;
if (f.kind === 'praise') {
coins = f.tip || 0;
rep = Math.max(2, base);
text = f.referral ? 'They leave a tip and promise to send a friend.' : 'They leave a small tip.';
} else if (f.kind === 'quiet') {
rep = base;
text = 'No news is good news.';
} else if (action === 'refund') {
coins = -f.demand; // the state refuses a refund the shop cannot pay in full
rep = f.legit ? Math.min(-1, Math.round(base / 2)) : 1;
text = f.legit ? 'You refund them. They leave mollified.' : 'You refund them. They leave smirking — but people saw you were fair.';
} else if (action === 'dispute') {
const covered = sale && (f.cites || []).every((k) => k === 'quality' ? sale.evidence.length > 0 : sale.claims[k] && sale.claims[k].source === 'trial');
if (f.legit) {
const paid = Math.min(f.demand, st.coins);
coins = -paid || 0; // never "-0"
rep = Math.min(-6, base - 4) - Math.round(6 * (1 - paid / Math.max(1e-9, f.demand)));
text = paid + 1e-9 >= f.demand ? 'Your records do not hold up: the complaint was fair. You refund them, and the story spreads.' : 'Your records do not hold up, and you cannot pay them back in full. The story spreads.';
} else if (covered || rng.chance(0.35 + 0.08 * st.rank)) {
rep = 2;
text = covered ? 'You show the trial records of that very batch. They mumble and leave empty-handed.' : 'You stand your ground and they back down.';
} else {
const half = Math.round(f.demand * 0.5 * 10) / 10;
const paid = Math.min(half, st.coins);
coins = -paid || 0; // never "-0"
rep = -3 - Math.round(3 * (1 - paid / Math.max(1e-9, half)));
text = 'With no trial records to show, you settle for half.';
}
} else {
rep = f.legit ? Math.min(-6, base - 3) : -2;
text = 'You turn them away. They grumble to everyone in the square.';
}
return { coins, rep, text };
}
function fmt(v) {
return (Math.round(v * 10) / 10).toLocaleString('en-US', { maximumFractionDigits: 1 });
}
return { draftLabel, applyTrials, evidenceOf, STAR_STEPS, MAX_STARS, accuracyStars, claimSigma, claimStars, labelStars, trialClaim, sameClaim, editClaim, claimedEffects, relevantEffects, EVIDENCE_WEIGHT, trustReport, labelTrust, unprovenWanted, proofGaps, claimedMeasurement, openNegotiation, proposePrice, acceptOffer, recordSale, resolveFollowUp, EVIDENCE_TEXT };
})();
// src/materials/remains.js
const __m47 = (() => {
const { completeMaterial } = __m9;
const { arcaneProfile, jitter } = __m11;
function remainsId(rabbitId, part) {
return `rem-${rabbitId}-${part}`;
}
function isRemains(m) {
return !!(m && m.remains);
}
const burned = (src) => src.cause === 'fire' || (src.exposure.fire || 0) >= 60;
function remainsPlan(src) {
const big = src.stage === 'adult' || src.stage === 'elder';
const k = big ? 1 : 0.5;
const ex = src.exposure;
const out = [{ part: 'bone', ml: big ? 110 : 55 }];
if (burned(src)) out.push({ part: 'ash', ml: big ? 50 : 25 });
else out.push({ part: 'fur', ml: Math.round((80 * k) / 5) * 5 });
if ((ex.toxicity || 0) + (ex.acid || 0) + (ex.alkali || 0) + (ex.transformation || 0) >= 30) out.push({ part: 'residue', ml: big ? 40 : 20 });
return out;
}
const FX = {
bone: { base: { strength: 3, death: 3 }, ch: { strength: [30, 1], death: [28, 1], transformation: [24, 0.8], arcana: [22, 0.8], frost: [12, 0.5] } },
fur: { base: { love: 2 }, ch: { love: [30, 1], vitality: [24, 0.8], fire: [26, 0.9], frost: [26, 0.9], toxicity: [20, 0.7], arcana: [10, 0.4] } },
ash: { base: { acidity: -8, fire: 4 }, ch: { fire: [32, 1], death: [20, 0.8] } },
residue: { base: { toxicity: 2 }, ch: { toxicity: [34, 1], acidity: [30, 0.9], transformation: [26, 0.9], vitality: [14, 0.5], death: [14, 0.5] } },
};
const ARC_BASE = { bone: 600, fur: -250, ash: 900, residue: -500 };
const PART_NOUN = { bone: 'bones', fur: 'pelt', ash: 'ashes', residue: 'residue' };
const PART_SHORT = { bone: 'bone', fur: 'pelt', ash: 'ash', residue: 'residue' };
const mix = (a, b, t) => a.map((x, i) => Math.round((x + (b[i] - x) * t) * 1000) / 1000);
const r1 = (v) => Math.round(v * 10) / 10;
function partEffects(part, ex, seed, id) {
const t = FX[part];
const fx = { ...t.base };
for (const [k, [cap, take]] of Object.entries(t.ch)) {
const E = k === 'acidity' ? (ex.acid || 0) - (ex.alkali || 0) : ex[k] || 0;
if (!E) continue;
const v = Math.sign(E) * r1(cap * (1 - Math.exp((-take * Math.abs(E)) / 60)) * jitter(seed, id, k, 0.08));
fx[k] = r1(Math.max(-40, Math.min(40, (fx[k] || 0) + v)));
}
for (const k of Object.keys(fx)) if (Math.abs(fx[k]) < 0.5) delete fx[k];
return fx;
}
function partColor(part, src) {
const ex = src.exposure;
if (part === 'bone') return mix(mix([0.9, 0.86, 0.76], [0.6, 0.58, 0.62], Math.min(0.5, (ex.death || 0) / 120)), [0.4, 0.9, 0.79], Math.min(0.3, (ex.transformation || 0) / 300));
if (part === 'fur') {
let c = src.look.coat.slice();
c = mix(c, [0.3, 0.2, 0.14], Math.min(0.5, (ex.fire || 0) / 150));
c = mix(c, [0.55, 0.62, 0.3], Math.min(0.3, (ex.toxicity || 0) / 200));
return mix(c, [0.75, 0.9, 1], Math.min(0.3, (ex.frost || 0) / 200));
}
if (part === 'ash') return mix([0.42, 0.4, 0.4], [0.55, 0.3, 0.2], Math.min(0.3, (ex.fire || 0) / 300));
const parts = [[[0.55, 0.62, 0.3], ex.toxicity || 0], [[0.85, 0.8, 0.3], ex.acid || 0], [[0.85, 0.82, 0.74], ex.alkali || 0], [[0.4, 0.9, 0.79], ex.transformation || 0], [[0.5, 0.48, 0.46], 10]];
const w = parts.reduce((a, p) => a + /** @type {number} */ (p[1]), 0);
return [0, 1, 2].map((i) => Math.round((parts.reduce((a, p) => a + /** @type {number[]} */ (p[0])[i] * /** @type {number} */ (p[1]), 0) / w) * 1000) / 1000);
}
function describe(part, src) {
const she = src.sex === 'f' ? 'she' : 'he';
const kind = src.sex === 'f' ? 'a doe' : 'a buck';
const how = src.cause && src.cause !== 'unknown' ? ` that died ${{ poison: 'of poison', death: 'of death magic', fire: 'in fire', frost: 'of cold', acid: 'of acid burns', alkali: 'of lye burns', change: 'of a violent change', arcana: 'of a magical surfeit', age: 'of old age', frail: 'of weakness' }[src.cause] || ''}` : '';
const when = Number.isFinite(src.diedDay) ? ` on day ${src.diedDay}` : '';
const what = { bone: 'The cleaned bones', fur: 'The pelt', ash: 'The ashes', residue: 'A residue scraped from the remains' }[part];
const traits = part === 'bone' && src.traits.some((t) => ['horns', 'antlers', 'unihorn'].includes(t)) ? ' The skull bears its horns.' : part === 'bone' && src.traits.includes('wings') ? ' Fine wing bones are among them.' : '';
return `${what} of ${src.name}, ${kind}${how}${when}. Whatever ${she} absorbed in life may linger in them.${traits}${part === 'bone' || part === 'fur' ? ' Crush or grind it; only what dissolves takes effect.' : ''}`;
}
function remainsMaterials(src, world) {
return remainsPlan(src).map(({ part }) => {
const id = remainsId(src.id, part);
const fx = partEffects(part, src.exposure, world.seed, id);
const solid = part === 'bone' || part === 'fur';
const color = partColor(part, src);
const phys = {
bone: { form: 'solid', archetype: 'remains', density: 1.85, hardness: 0.7, solubility: 0.05, solubilityTemp: 0.0025, compat: [0.82, 0.14], friction: 0.68, heatCapacity: 1.4, conductivity: 0.4, flammability: 0, tint: 0.6, price: 8 },
fur: { form: 'solid', archetype: 'remains', density: 0.62, hardness: 0.15, solubility: 0.14, solubilityTemp: 0.002, compat: [0.55, 0.22], friction: 0.7, heatCapacity: 1.5, conductivity: 0.2, flammability: 0.6, ignition: 280, combustionHeat: 500, ash: world.roles.soot, smoke: world.roles.smoke, tint: 0.75, price: 6 },
ash: { form: 'powder', archetype: 'ash', density: 0.8, friction: 0.72, solubility: 0.18, solubilityTemp: 0.002, compat: [0.84, 0.12], heatCapacity: 0.9, conductivity: 0.3, flammability: 0, tint: 0.7, price: 4 },
residue: { form: 'powder', archetype: 'remains', density: 1.3, solubility: 0.24, solubilityTemp: 0.003, binder: 0.2, friction: 0.6, compat: [0.82, 0.15], heatCapacity: 1.2, conductivity: 0.35, flammability: 0.1, ignition: 300, combustionHeat: 300, ash: world.roles.soot, tint: 0.7, price: 5 },
}[part];
const m = completeMaterial(/** @type {any} */ ({
id, name: `${src.name}’s ${PART_NOUN[part]}`, color, opacity: 1, melt: 1500, boil: Infinity, reactivity: 0.2,
tier: 99, product: false, description: describe(part, src), ...phys,
glow: (src.exposure.arcana || 0) > 40 ? Math.min(0.6, ((src.exposure.arcana || 0) - 40) / 150) : 0,
}));
const mm = /** @type {any} */ (m);
mm.effects = fx;
const arc = fx.arcana || 0;
const thr = ARC_BASE[part] * (1 - Math.min(0.8, Math.max(0, arc) / 30)) + 10 * ((fx.fire || 0) - (fx.frost || 0));
mm.arcane = arcaneProfile(world.seed, id, thr, 1.8 + 0.04 * Math.min(30, Math.max(0, arc)));
mm.econd = 0.03;
mm.charge = 0;
mm.shape = part === 'bone' ? 'bone' : part === 'fur' ? 'fur' : undefined;
if (solid) mm.crushable = true;
mm.remains = { rabbitId: src.id, rabbitName: src.name, part, day: src.diedDay, cause: src.cause, short: `${src.name.split(' ')[0]} ${PART_SHORT[part]}` };
return m;
});
}
return { remainsId, isRemains, remainsPlan, remainsMaterials };
})();
// src/game/patrons.js
const __m48 = (() => {
const RETURN_CHANCE = 0.3;
const BANNED_TRUST = -0.75;
const clamp1 = (v) => Math.max(-1, Math.min(1, v));
function notePatron(st, com) {
if (!com || !com.customer || com.tutorial) return null;
const c = com.customer;
const p = st.patrons[c.name] || { name: c.name, archetype: c.archetype, title: c.title, portrait: c.portrait, persona: c.persona, visits: 0, good: 0, bad: 0, trust: 0, lastDay: 0, lastPotion: '' };
p.visits++;
p.lastDay = st.day;
p.lastPotion = com.potionName;
st.patrons[c.name] = p;
return p;
}
function patronVerdict(st, f, action) {
const p = f && f.customer ? st.patrons[f.customer.name] : null;
if (!p) return null;
if (f.kind === 'praise') { p.good++; p.trust = clamp1(p.trust + 0.25); }
else if (f.kind === 'quiet') p.trust = clamp1(p.trust + 0.05);
else if (f.legit) {
p.bad++;
p.trust = clamp1(p.trust - (action === 'refund' ? 0.2 : action === 'dispute' ? 0.5 : 0.4));
} else if (action === 'refund') p.trust = clamp1(p.trust + 0.05);
p.lastOutcome = f.kind;
return p;
}
function returningPatron(st, rng) {
const list = Object.values(st.patrons || {}).filter((p) => p.visits > 0 && p.lastDay < st.day && p.trust > BANNED_TRUST);
if (!list.length || !rng.chance(RETURN_CHANCE)) return null;
return rng.weighted(list, list.map((p) => 1 + Math.min(4, p.visits) + Math.max(0, p.trust) * 2));
}
function welcomePatron(com, p, st) {
const base = p.persona || com.customer.persona || { haggle: 0.5, patience: 3, honesty: 0.85, proof: 0.5 };
const t = p.trust;
const persona = {
...base,
proof: round2(Math.max(0, Math.min(1, base.proof - 0.3 * t))),
haggle: round2(Math.max(0, Math.min(1, base.haggle - 0.15 * t))),
patience: Math.max(2, base.patience + (t > 0.3 ? 1 : t < -0.3 ? -1 : 0)),
};
com.customer = { ...com.customer, name: p.name, archetype: p.archetype, title: p.title, portrait: p.portrait, persona };
const loyalty = 1 + 0.12 * t + 0.04 * Math.min(4, p.visits);
com.budget = Math.max(12, Math.round(com.budget * loyalty));
const last = (p.lastPotion || 'potion').toLowerCase();
const opening = p.lastOutcome === 'praise' || (p.good > p.bad && t > 0.2)
? `Your ${last} did everything you promised — I came straight back.`
: p.lastOutcome === 'complaint' || t < -0.2
? `Last time your ${last} let me down. This time I want to see proof before I pay.`
: `Back again — the ${last} was fair enough.`;
com.dialogue = `${opening} ${com.dialogue}`;
com.patron = { visits: p.visits, trust: round2(t), good: p.good, bad: p.bad };
return com;
}
function recentStyles(st) {
return (st.sales || []).slice(0, 8).map((s) => s.style).filter(Boolean);
}
function noveltyFactor(style, recent, tier = 0, rank = 0) {
const below = Math.max(0, rank - tier);
const level = below <= 1 ? 1 : below === 2 ? 0.6 : 0.4;
const same = recent.slice(0, 6).filter((s) => s === style).length;
return level * (same >= 2 ? 0.85 : 1);
}
function round2(v) {
return Math.round(v * 100) / 100;
}
return { RETURN_CHANCE, BANNED_TRUST, notePatron, patronVerdict, returningPatron, welcomePatron, recentStyles, noveltyFactor };
})();
// src/game/recipes.js
const __m49 = (() => {
const TRACE_DT = 1;
const TRACE_MAX = 1200;
const HOLD_MIN = 6, HOLD_BAND = 4, ROOM = 20;
const STAGE_MIN = 8;
const LOSS_MIN = 0.04;
const SAME = { T: 8, holdRatio: 0.5, loss: 0.08, ml: 5, mlShare: 0.15, serve: 6 };
function traceSample(log, s) {
let tr = log.find((e) => e.type === 'trace');
if (!tr) { tr = { type: 'trace', dt: TRACE_DT, s: [] }; log.push(tr); }
tr.s.push([Math.round(s.t), Math.round(s.T * 10) / 10, s.stir ? 1 : 0, s.crush ? 1 : 0, s.lid ? 1 : 0, ...(s.ml !== undefined ? [Math.round(s.ml)] : [])]);
if (tr.s.length > TRACE_MAX) {
const half = tr.s.length >> 1;
tr.s = tr.s.slice(0, half).filter((_, k) => k % 2 === 0).concat(tr.s.slice(half));
}
return tr;
}
function buildProcedure(log, serveT) {
const tr = log.find((e) => e.type === 'trace');
const samples = tr ? tr.s : [];
const dt = tr ? tr.dt : 1;
const events = [];
for (const e of log) {
if (e.type === 'pour') events.push({ t: e.t || 0, step: { op: 'pour', id: e.id, ml: round1(e.ml), ...(e.ground ? { ground: true } : {}) } });
else if (e.type === 'lid') events.push({ t: e.t || 0, step: { op: 'lid', closed: !!e.closed } });
else if (e.type === 'skim') events.push({ t: e.t || 0, step: { op: 'skim', ml: round1(e.ml || 0) } });
else if (e.type === 'distil') events.push({ t: e.t || 0, step: { op: 'distil', ml: round1(e.ml || 0) } });
}
let k = 0;
while (k < samples.length) {
let j = k, sum = 0, n = 0, stir = 0;
while (j < samples.length) {
const mean = n ? sum / n : samples[j][1];
if (Math.abs(samples[j][1] - mean) > HOLD_BAND) break;
sum += samples[j][1]; n++; stir += samples[j][2];
j++;
}
const level = n ? sum / n : ROOM;
const dur = n > 1 ? samples[j - 1][0] - samples[k][0] + dt : 0;
if (dur >= HOLD_MIN && Math.abs(level - ROOM) >= 6) {
const step = { op: 'temp', T: Math.round(level), hold: Math.round(dur), stir: Math.round((stir / n) * 100) / 100 };
const v0 = volumeAt(samples, k), v1 = volumeAt(samples, j - 1);
if (v0 > 0 && v1 >= 0 && (v0 - v1) / v0 >= LOSS_MIN) /** @type {any} */ (step).loss = Math.round(((v0 - v1) / v0) * 100) / 100;
events.push({ t: samples[k][0] + 0.5, step });
}
k = Math.max(j, k + 1);
}
events.sort((a, b) => a.t - b.t);
const steps = [];
let si = 0;
const work = (until) => {
let stir = 0, crush = 0;
while (si < samples.length && samples[si][0] < until) {
stir += samples[si][2] * dt;
crush += samples[si][3] * dt;
si++;
}
if (crush > 0) steps.push({ op: 'crush', s: Math.max(10, Math.round(crush)) });
if (stir >= 3) steps.push({ op: 'stir', s: Math.round(stir) });
};
for (const ev of events) {
work(ev.t);
if (ev.step.op === 'temp') {
const end = ev.t + ev.step.hold;
while (si < samples.length && samples[si][0] < end) si++;
}
const last = steps[steps.length - 1];
if (ev.step.op === 'pour' && last && last.op === 'pour' && last.id === ev.step.id && !!last.ground === !!ev.step.ground) last.ml = round1(last.ml + ev.step.ml);
else if (ev.step.op === 'lid' && last && last.op === 'lid') last.closed = ev.step.closed;
else steps.push(ev.step);
}
work(Infinity);
if (serveT !== undefined) steps.push({ op: 'serve', T: Math.round(serveT) });
return steps;
}
function volumeAt(samples, i) {
const s = samples[i];
return s && s.length > 5 ? s[5] : -1;
}
function procedureLimits(steps) {
const out = [];
if (steps.some((s) => s.op === 'skim')) out.push('skimming');
if (steps.some((s) => s.op === 'distil')) out.push('distilling');
return out;
}
function approximateSteps(r) {
const steps = (r.ingredients || []).map((i) => /** @type {Step} */ ({ op: 'pour', id: i.id, ml: i.ml, ...(i.ground ? { ground: true } : {}) }));
if (r.crushed) steps.push({ op: 'crush', s: 15 });
steps.push({ op: 'stir', s: (r.stirSeconds || 0) > 12 ? 14 : 7 });
if ((r.maxTemp ?? 20) > 26) steps.push({ op: 'temp', T: Math.round(r.maxTemp), hold: 12, stir: 0.5 });
if ((r.minTemp ?? 20) < 14) steps.push({ op: 'temp', T: Math.round(r.minTemp), hold: 12, stir: 0.5 });
steps.push({ op: 'serve', T: Math.round(r.serveTemp ?? 20) });
return steps;
}
function migrateRecipe(r) {
if (!r || typeof r !== 'object') return r;
if (!Array.isArray(r.steps)) return { ...r, steps: approximateSteps(r), approx: true, approxWhy: 'saved before procedures were kept', brews: r.brews | 0, reproduced: r.reproduced | 0, mismatched: r.mismatched | 0 };
if (r.approx) return r;
if (r.steps.some((s) => s.op === 'skim' || s.op === 'distil')) return { ...r, approx: true, approxWhy: 'it skims or distils with tools the guild has retired' };
let open = false;
for (const s of r.steps) {
if (s.op === 'lid') open = !s.closed;
if (s.op === 'temp' && open && s.T >= 90 && s.loss === undefined) return { ...r, approx: true, approxWhy: 'it boils with the lid open, and how much boiled away was not recorded' };
}
return r;
}
function holds(steps) {
return steps.filter((s) => s.op === 'temp').map((s) => /** @type {{T:number, hold:number, loss?:number}} */ (s));
}
function procedureShape(steps, solid = () => true) {
const stages = [];
const ing = new Map();
const whole = new Set();
let stirredSinceAdd = true, serve = null;
for (const s of steps) {
switch (s.op) {
case 'pour': {
const e = ing.get(s.id) || { byStage: [], ground: false };
const k = stages.length;
e.byStage[k] = (e.byStage[k] || 0) + s.ml;
if (s.ground) e.ground = true; else if (solid(s.id)) whole.add(s.id);
ing.set(s.id, e);
stirredSinceAdd = false;
break;
}
case 'crush':
for (const id of whole) { const e = ing.get(id); if (e) e.ground = true; }
whole.clear();
break;
case 'stir':
if (s.s >= 3) stirredSinceAdd = true;
break;
case 'temp':
if (s.hold < STAGE_MIN && !(s.loss >= LOSS_MIN)) break;
stages.push({ T: s.T, hold: s.hold, loss: s.loss || 0 });
if ((s.stir ?? 0.5) >= 0.2) stirredSinceAdd = true;
break;
case 'serve':
serve = s.T;
break;
}
}
return { stages, ing, stirred: stirredSinceAdd, serve };
}
function compareRecipe(recipe, parts, steps, lookup = (/** @type {string} */ id) => /** @type {any} */ ({ name: id })) {
const out = { formulation: false, procedure: /** @type {boolean|null} */ (false), differences: /** @type {string[]} */ ([]) };
if (!recipe.ingredients || !parts.length) return out;
const want = new Map();
for (const i of recipe.ingredients) want.set(i.id, (want.get(i.id) || 0) + i.ml);
out.formulation = want.size === parts.length && parts.every((x) => want.has(x.id) && Math.abs(/** @type {number} */ (want.get(x.id)) - x.ml) <= SAME.ml);
if (!out.formulation) return out;
if (recipe.approx || !Array.isArray(recipe.steps)) { out.procedure = null; return out; }
const solid = (id) => { const m = lookup(id); return !m || !m.form || m.form === 'solid'; };
const a = procedureShape(recipe.steps, solid), b = procedureShape(steps, solid);
const name = (id) => { const m = lookup(id); return m ? m.name : id; };
const diff = out.differences;
if (a.stages.length !== b.stages.length) diff.push(`${b.stages.length} heat stage${b.stages.length === 1 ? '' : 's'} instead of ${a.stages.length}`);
else a.stages.forEach((x, k) => {
const y = b.stages[k];
if (Math.abs(x.T - y.T) > SAME.T) diff.push(`stage ${k + 1} at ${y.T}°C instead of ${x.T}°C`);
else if (y.hold < x.hold * SAME.holdRatio && !(x.loss || y.loss)) diff.push(`stage ${k + 1} held ${y.hold} s instead of ${x.hold} s`);
if (Math.abs(x.loss - y.loss) > SAME.loss) diff.push(`stage ${k + 1} boiled away ${Math.round(y.loss * 100)} % instead of ${Math.round(x.loss * 100)} %`);
});
for (const [id, x] of a.ing) {
const y = b.ing.get(id);
if (!y) continue;
if (x.ground !== y.ground) diff.push(`${name(id)} ${y.ground ? 'ground' : 'left whole'} (the recipe ${x.ground ? 'grinds it' : 'leaves it whole'})`);
const n = Math.max(x.byStage.length, y.byStage.length);
for (let k = 0; k < n; k++) {
const ma = x.byStage[k] || 0, mb = y.byStage[k] || 0;
if (Math.abs(ma - mb) > Math.max(SAME.ml, SAME.mlShare * Math.max(ma, mb))) {
diff.push(`${name(id)}: ${Math.round(mb)} ml ${k < a.stages.length ? `before stage ${k + 1}` : 'after the last stage'} instead of ${Math.round(ma)} ml`);
break;
}
}
}
if (a.stirred && !b.stirred) diff.push('not stirred after the last addition');
if (a.serve !== null && b.serve !== null && Math.abs(a.serve - b.serve) > SAME.serve) diff.push(`bottled at ${b.serve}°C instead of ${a.serve}°C`);
out.procedure = diff.length === 0;
return out;
}
function matchRecipe(recipe, parts, steps, lookup) {
const c = compareRecipe(recipe, parts, steps, lookup);
return !c.formulation ? null : c.procedure ? 'procedure' : 'formulation';
}
function recipeConfidence(r) {
if (!r.verified || !Object.keys(r.verified).length) return 'untested';
if ((r.mismatched | 0) > (r.reproduced | 0)) return 'unreliable';
if ((r.reproduced | 0) >= 1) return 'reproduced';
return 'tested';
}
const CONFIDENCE_TEXT = {
untested: 'Never tested: what it does is only the guild theory.',
tested: 'Tested once, when it was saved. Brew it again the same way and test it to prove it repeats.',
reproduced: 'Brewed again the same way and the trials agreed: a reliable recipe.',
unreliable: 'Brewed again the same way and the trials disagreed: something matters that the recipe does not hold.',
};
function checkReproduction(recipe, cert, batchKey) {
const keys = Object.keys(recipe.verified || {}).filter((k) => cert.values[k] !== undefined);
if (!keys.length) return null;
recipe.checked = recipe.checked || [];
if (recipe.checked.includes(batchKey)) return null;
const agree = keys.every((k) => {
const tol = Math.max(3, (cert.unc ? cert.unc[k] || 0 : 0) + ((recipe.evidence && recipe.evidence[k] && recipe.evidence[k].u) || 0));
return Math.abs(cert.values[k] - recipe.verified[k]) <= tol;
});
recipe.checked.push(batchKey);
if (recipe.checked.length > 12) recipe.checked.shift();
if (agree) recipe.reproduced = (recipe.reproduced | 0) + 1;
else recipe.mismatched = (recipe.mismatched | 0) + 1;
return agree ? 'agree' : 'differ';
}
function describeStep(s, lookup) {
switch (s.op) {
case 'pour': { const m = lookup(s.id); return `Add ${Math.round(s.ml)} ml ${m ? m.name : s.id}${s.ground ? ', then crush it' : ''}`; }
case 'stir': return `Stir ${s.s} s`;
case 'crush': return `Crush with the pestle ${s.s} s`;
case 'temp': return `${s.T > ROOM ? 'Heat' : 'Cool'} to ${s.T}°C and hold ${s.hold} s${s.loss ? `, lid open, until ${Math.round(s.loss * 100)} % has boiled away` : ''}${s.stir && s.stir > 0.4 ? ', stirring' : ''}`;
case 'lid': return s.closed ? 'Close the lid' : 'Open the lid';
case 'skim': return `Skim off ${Math.round(s.ml)} ml (a retired tool)`;
case 'distil': return `Distil off ${Math.round(s.ml)} ml (a retired tool)`;
case 'serve': return `Bottle at ${s.T}°C`;
}
return '';
}
function round1(v) {
return Math.round(v * 10) / 10;
}
return { TRACE_DT, TRACE_MAX, SAME, traceSample, buildProcedure, procedureLimits, approximateSteps, migrateRecipe, holds, procedureShape, compareRecipe, matchRecipe, recipeConfidence, CONFIDENCE_TEXT, checkReproduction, describeStep };
})();
// src/game/state.js
const __m5 = (() => {
const { Rng, hashString } = __m6;
const { generateWorld, makeLookup, addAlchemy, LAB_ROLES } = __m7;
const { serializeMaterial, deserializeMaterial } = __m9;
const { generateCommission, tutorialCommission } = __m16;
const { EQUIPMENT, STARTING_EQUIPMENT, RANKS, rankIndex, capabilities, equipmentById, RETIRED_EQUIPMENT } = __m26;
const { SIM } = __m24;
const { createTrials, normalizeTrials, runTrial, SUBJECT_BY_ID, knownLaws, certification, summarize } = __m27;
const { createGathering, normalizeGathering, generateDeposits, harvest, gatherPlan, weatherOn, weatherRegrowth, newDayRegrowth, depositStatus } = __m29;
const { predictPlan } = __m17;
const { EFFECT_INDEX, EFFECT_KEYS } = __m13;
const { migrateVial } = __m30;
const { recordSale, resolveFollowUp, applyTrials, evidenceOf } = __m46;
const { colonyDay, colonyTick, livingRabbits, findRabbit, addBoughtRabbit, retireRabbit, remainsSource, purgeRabbit, cullRabbit, maxHealthOf, FOUNDER_BORN } = __m28;
const { remainsMaterials, remainsPlan, isRemains } = __m47;
const { returningPatron, welcomePatron, recentStyles, notePatron, patronVerdict, noveltyFactor } = __m48;
const { techniqueById, migrateTechniques } = __m16;
const { migrateRecipe } = __m49;
const SAVE_VERSION = 6;
const PURGE_PRICE = 8;
const PURGE_BREW_COST = 1;
const PURGE_BREW_TIME = 40;
const WORLD_GEN_VERSION = 2;
const STARTER_HERBS = { silverleaf: 200, sunthistle: 150, heartpetal: 150, ironroot: 150, emberbark: 100, frostcap: 100, riverchalk: 100, nettle: 100 };
const ASPECT_KEY_MAP = { vitality: 'vitality', ardor: 'fire', arcana: 'arcana', fortitude: 'strength' };
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
{ id: 'layers', name: 'Oil and Water', desc: 'Observe immiscible liquids separating into layers.', reward: 10 },
{ id: 'trial1', name: 'First Trial', desc: 'Test a potion on a subject.', reward: 10 },
{ id: 'trial25', name: 'Empiricist', desc: 'Run 25 trials.', reward: 60 },
{ id: 'law1', name: 'Hidden Harmony', desc: 'Discover a resonance law through repeated trials.', reward: 40 },
{ id: 'law4', name: 'Natural Philosopher of Magic', desc: 'Discover four resonance laws.', reward: 150 },
{ id: 'forage1', name: 'Into the Wilds', desc: 'Gather your first wild ingredient.', reward: 10 },
{ id: 'forage1k', name: 'Seasoned Forager', desc: 'Gather 1000 ml of wild ingredients.', reward: 50 },
{ id: 'certified', name: 'Proven Remedy', desc: 'Serve a potion whose effects you verified by experiment.', reward: 15 },
{ id: 'steep', name: 'Patience of the Steep', desc: 'Steep a herb into a liquid extract with heat.', reward: 15 },
{ id: 'awaken', name: 'Awakening', desc: 'Awaken a magical ingredient past its arcane threshold.', reward: 20 },
{ id: 'deal', name: 'Silver Tongue', desc: 'Sell a potion for more than the customer first offered.', reward: 15 },
{ id: 'dispute', name: 'The Records Speak', desc: 'Win a dispute with trial records of the batch.', reward: 30 },
{ id: 'referral', name: 'Word of Mouth', desc: 'Serve a customer sent by a satisfied one.', reward: 25 },
{ id: 'kit1', name: 'New Arrivals', desc: 'Kits are born in your hutch.', reward: 15 },
{ id: 'colony8', name: 'Thriving Warren', desc: 'Keep eight living rabbits.', reward: 40 },
{ id: 'survivor', name: 'Iron Constitution', desc: 'A rabbit survives ten trials.', reward: 30 },
{ id: 'remains1', name: 'Nothing Wasted', desc: 'Recover the remains of a rabbit as ingredients.', reward: 15 },
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
/** @type {{active:boolean, step:number, done:boolean, tips?:Record<string, boolean>}} */ this.tutorial = { active: false, step: 0, done: true, ...(data.tutorial || {}) };
/** @type {{event:string, mods:Record<string, number>}} */ this.market = data.market || { event: 'none', mods: {} };
/** @type {any} */ this.cauldron = data.cauldron || null;
/** @type {any[]} */ this.brewLog = data.brewLog || [];
/** @type {number} */ this.reliefDay = data.reliefDay || 0;
/** @type {boolean} */ this.grandDone = !!data.grandDone;
/** @type {number} */ this.createdAt = data.createdAt || Date.now();
/** @type {ReturnType<typeof createTrials>} */ this.trials = normalizeTrials(data.trials);
/** @type {ReturnType<typeof createGathering>} */ this.gathering = normalizeGathering(data.gathering);
this.vial = migrateVial(data.vial);
this.bottles = Array.isArray(data.bottles) ? data.bottles.map(migrateVial).filter(Boolean) : [];
/** @type {any[]} */ this.sales = Array.isArray(data.sales) ? data.sales : [];
/** @type {any[]} */ this.followUps = Array.isArray(data.followUps) ? data.followUps : [];
/** @type {number} */ this.referrals = data.referrals | 0;
/** @type {boolean} */ this.opened = data.opened !== undefined ? !!data.opened : (data.customerIndex | 0) > 0 || !!data.current;
/** @type {Record<string, any>} */ this.patrons = data.patrons && typeof data.patrons === 'object' ? data.patrons : {};
this.batch = data.batch && typeof data.batch.id === 'string' ? { id: data.batch.id, rev: data.batch.rev | 0, ...(data.batch.carried && typeof data.batch.carried === 'object' ? { carried: data.batch.carried } : {}) } : newBatch();
this.lookup = makeLookup(this.world);
this._deposits = null;
const col = this.trials.colony;
if (!col.seed) col.seed = String(this.seed);
if (!col.day) {
for (const r of col.rabbits) if (r.born === FOUNDER_BORN && !r.parents) r.born = this.day - 1 + FOUNDER_BORN;
col.day = this.day;
}
}
static create(seed, opts = {}) {
const world = generateWorld(seed);
const inventory = {};
for (const id of world.starting) inventory[id] = 0;
const R = world.roles;
inventory[R.water] = Infinity;
inventory[R.oil] = 200;
inventory[R.spirit] = 200;
for (const id of world.wild || []) inventory[id] = 0;
for (const [key, ml] of Object.entries(STARTER_HERBS)) if (world.wild.includes('wild-' + key)) inventory['wild-' + key] = ml;
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
return this.world.ingredients.filter((id) => { const m = this.lookup(id); return m && !isRemains(m) && !(m.wild && m.wild.gatherOnly) && !m.product && (m.tier || 0) <= this.rank; });
}
availableSet() {
const s = new Set(this.purchasable());
for (const [id, v] of Object.entries(this.inventory)) if (v > 0) s.add(id);
return s;
}
get deposits() {
if (!this._deposits) this._deposits = generateDeposits(this.world, this.lookup);
return this._deposits;
}
gatherableSet() {
const s = new Set();
for (const d of this.deposits) if (d.rank <= this.rank) s.add(d.materialId);
return s;
}
gather(depositId, opts = {}) {
const d = this.deposits.find((x) => x.id === depositId);
if (!d) return { ok: false, amount: 0, reason: 'unknown' };
const m = this.lookup(d.materialId);
const { take } = gatherPlan(this, d, m, { thorough: opts.thorough });
const r = harvest(this, { ...d, take }, { ...opts, key: m && m.wild ? m.wild.key : '' });
if (r.ok && !opts.unlimited) {
this.stats.gathered = (this.stats.gathered || 0) + r.amount;
/** @type {any} */ (r).events = [...this.unlock('forage1')];
if (this.stats.gathered >= 1000) /** @type {any} */ (r).events.push(...this.unlock('forage1k'));
}
return r;
}
newBatch() {
this.batch = newBatch();
return this.batch;
}
touchBatch() {
this.batch.rev++;
delete this.batch.carried;
}
resumeBatch(v) {
const same = this.batch.id === v.batchId && this.batch.rev === v.rev;
const prev = /** @type {any} */ ((same && this.batch.carried) || {});
const samples = JSON.parse(JSON.stringify(prev.samples || {}));
for (const [k, list] of Object.entries(v.samples || {})) for (const x of list) if (!(samples[k] ||= []).some((y) => y.rec === x.rec)) samples[k].push(x);
const label = v.label || prev.label;
this.batch = { id: v.batchId, rev: v.rev, carried: {
samples,
ref: v.m && v.m.effects ? Array.from(v.m.effects) : prev.ref,
...(label ? { label: JSON.parse(JSON.stringify(label)) } : {}),
} };
return this.batch;
}
get knownLaws() {
return knownLaws(this.trials, this.world.laws || []);
}
recordTrial(subjectId, dose, ctx) {
const rec = runTrial(this.trials, subjectId, dose, { ...ctx, day: this.day, laws: this.world.laws || [] });
this.stats.trials = (this.stats.trials || 0) + 1;
const events = [...this.unlock('trial1')];
if (this.stats.trials >= 25) events.push(...this.unlock('trial25'));
for (const id of rec.lawsFound) {
const L = (this.world.laws || []).find((l) => l.id === id);
if (!L) continue;
const entry = this.discover({ key: 'law:' + id, title: L.name, text: L.lore, kind: 'law' });
if (entry) events.push({ type: 'law', id, name: L.name, lore: L.lore });
events.push(...this.unlock('law1'));
if (this.knownLaws.length >= 4) events.push(...this.unlock('law4'));
}
if (rec.rabbitId) {
const r = findRabbit(this.trials.colony, rec.rabbitId);
if (r && !r.alive) events.push({ type: 'rabbit-died', id: r.id, name: r.name, cause: r.cause });
if (r && r.alive && r.trials >= 10) events.push(...this.unlock('survivor'));
}
return { record: rec, events };
}
get colony() {
return this.trials.colony;
}
rabbitPrice() {
return Math.ceil(SUBJECT_BY_ID.rabbit.cost * (this.has('kennel') ? 0.5 : 1));
}
buyRabbit(free = false) {
const c = this.colony;
const cap = this.cap.hutch;
if (livingRabbits(c).length >= cap) return { ok: false, reason: `The hutch is full (${cap} places). More places are sold in the Shop.` };
const cost = free ? 0 : this.rabbitPrice();
if (cost > this.coins + 1e-9) return { ok: false, reason: `A new rabbit costs ${cost} coins.` };
this.coins = round1(this.coins - cost);
this.stats.spent += cost;
this.daySpending += cost;
const rabbit = addBoughtRabbit(c, { day: this.day });
c.focus = rabbit.id;
return { ok: true, cost, rabbit };
}
selectRabbit(id) {
if (!findRabbit(this.colony, id)) return false;
this.colony.focus = id;
return true;
}
feedCost() {
return livingRabbits(this.colony).length ? 1 : 0;
}
feedRabbits() {
const c = this.colony;
const live = livingRabbits(c);
if (!live.length) return { ok: false, reason: 'There is nobody to feed.' };
if (c.fedDay === this.day) return { ok: false, reason: 'They have eaten today.' };
const cost = this.feedCost();
if (cost > this.coins + 1e-9) return { ok: false, reason: `Hay and greens cost ${cost} coin.` };
this.coins = round1(this.coins - cost);
this.stats.spent += cost;
this.daySpending += cost;
c.fedDay = this.day;
for (const r of live) {
r.health = round1(Math.min(maxHealthOf(r, this.day), r.health + 6));
r.marks.toxicity = Math.max(0, round1(r.marks.toxicity - 5));
}
return { ok: true, cost };
}
setBreeding(on) {
this.colony.breed = !!on;
}
registerMaterial(def) {
if (!this.world.materials.some((m) => m.id === def.id)) this.world.materials.push(def);
if (!this.world.ingredients.includes(def.id)) this.world.ingredients.push(def.id);
return this.lookup(def.id);
}
processRemains(id) {
const c = this.colony;
const r = findRabbit(c, id);
if (!r) return { ok: false, reason: 'There is no such body in the hutch.' };
if (r.alive) return { ok: false, reason: `${r.name} is alive.` };
const src = remainsSource(r, this.day);
const defs = remainsMaterials(src, this.world);
const plan = remainsPlan(src);
const parts = [];
for (const d of defs) {
this.registerMaterial(d);
const ml = (plan.find((p) => p.part === d.remains.part) || { ml: 0 }).ml;
const have = this.inventory[d.id] || 0;
this.inventory[d.id] = Math.min(this.cap.storage, have + ml);
parts.push({ id: d.id, name: d.name, ml });
}
retireRabbit(c, id, 'processed', defs.map((d) => d.id), this.day);
this.stats.recovered = (this.stats.recovered || 0) + 1;
const events = [];
const entry = this.discover({ key: 'remains:' + id, title: `The remains of ${r.name}`, text: `You recovered ${parts.map((p) => p.name.split('’s ')[1] || p.name).join(', ')} from ${r.name}. What ${r.sex === 'f' ? 'she' : 'he'} absorbed in life may linger in them — only trials will tell.`, kind: 'colony' });
if (entry) events.push({ type: 'journal', entry });
events.push(...this.unlock('remains1'));
return { ok: true, parts, events };
}
buryRabbit(id) {
const r = findRabbit(this.colony, id);
if (!r || r.alive) return { ok: false, reason: r ? `${r.name} is alive.` : 'There is no such body.' };
retireRabbit(this.colony, id, 'buried', [], this.day);
return { ok: true };
}
restoreRemains() {
for (const m of this.colony.memorial) {
if (m.how !== 'processed' || !m.parts.length) continue;
if (m.parts.every((id) => this.world.materials.some((x) => x.id === id))) continue;
for (const d of remainsMaterials(remainsSource(/** @type {any} */ (m), this.day), this.world)) this.registerMaterial(d);
}
}
replaceSubject(id, free = false) {
if (id !== 'rabbit') return { ok: false, reason: 'Only rabbits are tested now.' };
const r = this.buyRabbit(free);
if (r.ok) return r;
const alive = livingRabbits(this.colony)[0];
if (alive && livingRabbits(this.colony).length >= this.cap.hutch) { this.colony.focus = alive.id; return { ok: true, cost: 0, reselected: true }; }
return r;
}
subjectAvailable(id) {
return id === 'rabbit';
}
purgePrice() {
return PURGE_PRICE;
}
buyPurge(free = false) {
const cost = free ? 0 : this.purgePrice();
if (cost > this.coins + 1e-9) return { ok: false, reason: `A purging draught costs ${cost} coins.` };
this.coins = round1(this.coins - cost);
this.stats.spent += cost;
this.daySpending += cost;
this.colony.purges = (this.colony.purges || 0) + 1;
return { ok: true, cost };
}
brewPurge(free = false) {
if (!free && !this.has('still')) return { ok: false, reason: 'Buy the Purging Still in the Shop to brew your own.' };
if (this.colony.still) return { ok: false, reason: 'The still is already working.' };
const cost = free ? 0 : PURGE_BREW_COST;
if (cost > this.coins + 1e-9) return { ok: false, reason: `The salts cost ${cost} coin.` };
this.coins = round1(this.coins - cost);
this.stats.spent += cost;
this.daySpending += cost;
this.colony.still = PURGE_BREW_TIME;
return { ok: true, cost };
}
purgeRabbit(id, free = false) {
const r = findRabbit(this.colony, id);
if (!r || !r.alive) return { ok: false, reason: 'Choose a living rabbit.' };
if (!free && !(this.colony.purges > 0)) return { ok: false, reason: 'You have no purging draught: buy one, or brew it in the still.' };
if (!free) this.colony.purges--;
purgeRabbit(r);
return { ok: true, rabbit: r };
}
cullRabbit(id) {
const r = findRabbit(this.colony, id);
if (!r || !r.alive) return { ok: false, reason: 'Choose a living rabbit.' };
cullRabbit(r, this.day);
this.stats.culled = (this.stats.culled || 0) + 1;
return { ok: true, rabbit: r };
}
tickColony(dt) {
const c = this.colony;
const events = [];
if (c.still) {
c.still = round1(c.still - dt);
if (c.still <= 0) { c.still = null; c.purges = (c.purges || 0) + 1; events.push({ type: 'purge-brewed' }); }
}
const rep = colonyTick(c, dt, { day: this.day, seed: this.seed, cap: this.cap.hutch });
for (const d of rep.died) events.push({ type: 'rabbit-died', ...d });
for (const a of rep.attacks) events.push({ type: 'attack', ...a });
for (const m of rep.mates) events.push({ type: 'mate', ...m });
for (const t of rep.traits) events.push({ type: 'trait', ...t });
return { rep, events };
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
canBuy(id) {
const m = this.lookup(id);
if (!m) return { ok: false, reason: 'Unknown ingredient.' };
if (id === this.world.roles.water) return { ok: false, reason: 'Well water is free.' };
if (isRemains(m)) return { ok: false, reason: 'Remains are never sold.' };
if (m.wild && m.wild.gatherOnly) return { ok: false, reason: `${m.name} is only found in the wilds.` };
if (!this.world.ingredients.includes(id) || m.product) return { ok: false, reason: 'The market does not sell that.' };
if ((m.tier || 0) > this.rank) return { ok: false, reason: `The herbalist sells ${m.name} from the rank of ${(RANKS[m.tier] || RANKS[RANKS.length - 1]).name}.` };
return { ok: true };
}
buy(id, ml) {
const legal = this.canBuy(id);
if (!legal.ok) return { ok: false, reason: legal.reason };
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
buyBackPrepared() {
let paid = 0;
for (const role of LAB_ROLES) {
const id = this.world.roles[role];
const ml = id ? this.inventory[id] : 0;
if (!id || !(ml > 0) || !isFinite(ml)) continue;
const m = this.lookup(id);
paid += (ml / 100) * ((m && m.price) || 0) * 0.4;
this.inventory[id] = 0;
}
paid = round1(paid);
if (paid > 0) {
this.coins = round1(this.coins + paid);
this.journal['note:buyback'] = { key: 'note:buyback', kind: 'note', title: 'The guild bought back your reagents', day: this.day,
text: `The market no longer sells prepared reagents: every effect must now come from what you gather. The guild paid ${paid} coins for the essences, salts and crystals left on your shelves.` };
}
return paid;
}
get bottleRoom() {
return Math.max(0, this.cap.bottles - this.bottles.length);
}
shelveBottle(v) {
const fromCounter = !v;
const b = v || this.vial;
if (!b) return { ok: false, reason: 'There is no bottle to put away.' };
if (this.bottleRoom <= 0) return { ok: false, reason: `The potion shelves are full (${this.cap.bottles} bottles). Sell, pour back or discard one, or buy more shelving.` };
this.bottles.push(b);
if (fromCounter) this.vial = null;
return { ok: true, bottle: b };
}
takeBottle(id) {
const k = this.bottles.findIndex((b) => b.id === id);
if (k < 0) return { ok: false, reason: 'No such bottle.' };
const b = this.bottles[k];
if (this.vial) this.bottles[k] = this.vial;
else this.bottles.splice(k, 1);
this.vial = b;
return { ok: true, bottle: b };
}
shareEvidence(batchId) {
const known = new Set(this.trials.records.map((r) => r.id));
for (const v of [this.vial, ...this.bottles]) {
if (!v || !v.batchId || (batchId && v.batchId !== batchId) || !v.m) continue;
const cert = certification(this.trials, { id: v.batchId, rev: v.rev }, v.m.effects);
const merged = {};
for (const [k, list] of Object.entries(v.samples || {})) merged[k] = list.filter((x) => !known.has(x.rec) || (cert.samples[k] || []).some((y) => y.rec === x.rec));
for (const [k, list] of Object.entries(cert.samples)) for (const x of list) if (!(merged[k] ||= []).some((y) => y.rec === x.rec)) merged[k].push(x);
for (const k of Object.keys(merged)) if (!merged[k].length) delete merged[k];
const count = (o) => Object.values(o || {}).reduce((a, l) => a + l.length, 0);
const sum = summarize(merged);
const changed = JSON.stringify(sum.values) !== JSON.stringify(v.cert || {}) || count(merged) !== count(v.samples);
v.samples = merged;
v.cert = sum.values;
v.certRecords = sum.records;
if (changed && v.label) applyTrials(v.label, sum.values, Object.values(sum.records)[0] || '', evidenceOf(v));
}
}
removeBottle(id) {
const k = this.bottles.findIndex((b) => b.id === id);
if (k < 0) return null;
return this.bottles.splice(k, 1)[0];
}
supplyOf(id, now = Date.now()) {
const stock = this.stock(id);
if (!isFinite(stock)) return Infinity;
let wild = 0;
for (const d of this.deposits) {
if (d.materialId !== id || d.rank > this.rank) continue;
const plan = gatherPlan(this, d, this.lookup(id));
wild += depositStatus(this.gathering, d, now).mature * plan.take;
}
return stock + wild;
}
commissionContext() {
const available = this.availableSet();
for (const id of this.gatherableSet()) available.add(id);
for (const id of [...available]) if (isRemains(this.lookup(id))) available.delete(id);
const now = Date.now();
const supplies = new Map();
return {
world: this.world,
lookup: this.lookup,
available,
cap: this.cap,
rank: this.rank,
priceOf: (id) => this.priceOf(id),
event: this.market.event,
coins: this.coins,
supply: (id) => { if (!supplies.has(id)) supplies.set(id, this.supplyOf(id, now)); return /** @type {number} */ (supplies.get(id)); },
buyable: (id) => this.canBuy(id).ok,
stock: (id) => this.stock(id),
};
}
nextCustomer() {
if (this.current) return this.current;
if (this.customerIndex >= this.customersPerDay) return null;
this.opened = true;
for (let guard = 0; guard < 4 && this.customerIndex < this.customersPerDay; guard++) {
const com = this._makeCustomer();
if (com) { this.current = com; return com; }
this.customerIndex++;
}
return null;
}
_makeCustomer() {
const rng = new Rng(hashString(`${this.seed}:${this.day}:${this.customerIndex}`));
const ctx = this.commissionContext();
let com;
if (this.tutorial.active && !this.tutorial.done && this.stats.served === 0) {
com = tutorialCommission(ctx, rng);
} else if (this.rank >= 4 && !this.grandDone && this.customerIndex === 0 && this.day % 2 === 0) {
com = this.grandCommission(rng);
}
if (!com) {
const contract = this.has('charter') && this.rank >= 2 && this.customerIndex === this.customersPerDay - 1;
const tier = Math.max(0, Math.min(4, this.rank + (rng.chance(0.25) ? -1 : 0) + (rng.chance(0.15) ? 1 : 0)));
const patron = returningPatron(this, rng);
const opts = { tier: Math.min(tier, this.rank + 1), contract, patron, recent: recentStyles(this) };
com = generateCommission(ctx, rng, opts);
for (let t = opts.tier - 1; !com && t >= 0; t--) com = generateCommission(ctx, rng, { ...opts, tier: t, contract: false });
if (!com) com = generateCommission(ctx, rng, { tier: 0, simple: true });
if (com && patron) welcomePatron(com, patron, this);
if (com && this.referrals > 0) {
this.referrals--;
com.referral = true;
com.budget = Math.round(com.budget * 1.3);
com.dialogue = `A friend told me your potions really work. ${com.dialogue}`;
}
}
return com || null;
}
grandCommission(rng) {
const ctx = this.commissionContext();
const com = generateCommission(ctx, rng, { tier: 4, request: rng.pick(['warpath', 'starseer']), contract: true, techniques: ['strong'] }) ||
generateCommission(ctx, rng, { tier: 4, contract: true });
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
if (!com) return [];
return this._bookSale(com, ev, measurement, ev.payment, ev.repDelta);
}
_bookSale(com, ev, measurement, paid, rep, saleId = null) {
const events = [];
this.coins = round1(this.coins + paid);
events.push(...this.adjustReputation(rep));
this.stats.served++;
this.stats.earned += paid;
this.dayEarnings += paid;
this.servedToday++;
this.history.unshift({
day: this.day, customer: com.customer.name, title: com.customer.title, potion: com.potionName, quality: saleId ? null : ev.quality, stars: saleId ? null : ev.stars,
paid, color: measurement?.color, ml: measurement?.ml, ...(saleId ? { saleId } : {}),
});
if (this.history.length > 60) this.history.length = 60;
if (com.tutorial) { this.tutorial.done = true; this.tutorial.active = false; }
if (!saleId) events.push(...this._verdict(ev.quality, ev.perfect, !!com.grand));
this.current = null;
this.customerIndex++;
events.push(...this.unlock('first_sale'));
if (this.stats.served >= 10) events.push(...this.unlock('served10'));
if (this.stats.served >= 50) events.push(...this.unlock('served50'));
if (this.coins >= 1000) events.push(...this.unlock('rich'));
return events;
}
_verdict(quality, perfect, grand) {
const events = [];
this.stats.bestQuality = Math.max(this.stats.bestQuality, quality);
if (perfect) { this.stats.perfect++; events.push(...this.unlock('perfect')); }
if (this.stats.perfect >= 5) events.push(...this.unlock('perfect5'));
if (grand && quality >= 0.85) { this.grandDone = true; events.push(...this.unlock('grand')); }
return events;
}
completeDeal(vial, label, price, truth, firstOffer = 0) {
const com = this.current;
if (!com) return { events: [], sale: null, follow: null, ev: null };
const { sale, follow, ev } = recordSale(this, com, vial, label, price, truth);
sale.perfect = ev.perfect;
sale.stars = ev.stars;
sale.grand = !!com.grand;
sale.style = com.style || null;
sale.techniques = com.techniques || [];
const novelty = noveltyFactor(sale.style, recentStyles(this), com.tier || 0, this.rank);
if (sale.repDelta > 0 && novelty < 1) { sale.repDelta = Math.round(sale.repDelta * novelty); sale.novelty = novelty; }
notePatron(this, com);
const events = this._bookSale(com, ev, truth, price, 1, sale.id);
this.sales.unshift(sale);
if (this.sales.length > 80) this.sales.length = 80;
this.followUps.push(follow);
if (price > firstOffer + 0.5 && firstOffer > 0) events.push(...this.unlock('deal'));
if (com.referral) events.push(...this.unlock('referral'));
return { events, sale, follow, ev };
}
dueFollowUps() {
return this.followUps.filter((f) => !f.resolved && f.day <= this.day && f.kind !== 'quiet');
}
settleFollowUp(id, action) {
const f = this.followUps.find((x) => x.id === id);
if (!f || f.resolved) return null;
if (action === 'refund' && f.kind === 'complaint' && this.coins + 1e-9 < (f.demand || 0)) return { refused: true, coins: 0, rep: 0, text: `You do not have ${f.demand} coins to refund.`, events: [] };
const r = resolveFollowUp(this, f, action);
f.resolved = true;
f.action = action;
f.outcome = r;
this.coins = round1(this.coins + r.coins);
if (r.coins < 0) { this.stats.refunds = (this.stats.refunds || 0) + 1; this.daySpending -= r.coins; }
else this.dayEarnings += r.coins;
if (f.kind === 'praise' && f.referral) this.referrals++;
const events = this.adjustReputation(r.rep);
if (action === 'dispute' && r.rep > 0) { this.stats.disputesWon = (this.stats.disputesWon || 0) + 1; events.push(...this.unlock('dispute')); }
const sale = this.sales.find((s) => s.id === f.saleId);
if (sale) {
sale.outcome = { kind: f.kind, action, ...r };
const hist = this.history.find((x) => x.saleId === sale.id);
if (hist && hist.quality === null) { hist.quality = sale.quality; hist.stars = sale.stars ?? null; }
events.push(...this._verdict(sale.quality, !!sale.perfect, !!sale.grand));
if (sale.quality >= 0.85) for (const t of sale.techniques || []) {
const T = techniqueById(t);
if (!T) continue;
const entry = this.discover({ key: 'technique:' + t, title: `Technique: ${T.name}`, text: T.lesson, kind: 'technique' });
if (entry) { events.push({ type: 'technique', id: t, name: T.name, text: T.lesson }); events.push(...this.adjustReputation(4)); }
}
}
patronVerdict(this, f, action);
return { ...r, events };
}
adjustReputation(delta) {
const oldRank = this.rank;
this.reputation = Math.max(-100, this.reputation + delta);
const events = [];
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
const settled = [];
for (const f of this.followUps) {
if (f.resolved || f.day > this.day) continue;
if (f.kind === 'quiet') { this.settleFollowUp(f.id, 'thank'); continue; }
if (f.day < this.day) settled.push({ f, r: this.settleFollowUp(f.id, f.kind === 'praise' ? 'thank' : 'dismiss') });
}
this.followUps = this.followUps.filter((f) => !f.resolved || f.day >= this.day - 6);
const summary = { day: this.day, earned: this.dayEarnings, spent: this.daySpending, served: this.servedToday, settled: settled.length };
weatherRegrowth(this.gathering, this.deposits, weatherOn(this.seed, this.day), this.lookup);
this.day++;
this.customerIndex = 0;
this.servedToday = 0;
this.dayEarnings = 0;
this.daySpending = 0;
this.current = null;
this.opened = false;
this.customersPerDay = 3 + Math.floor(this.rank / 2);
this.rollMarket();
newDayRegrowth(this.gathering, this.deposits);
const colony = colonyDay(this.colony, { seed: this.seed, day: this.day, cap: this.cap.hutch });
const events = [];
this.stats.bred = (this.stats.bred || 0) + colony.born.length;
if (colony.born.length) events.push(...this.unlock('kit1'));
if (livingRabbits(this.colony).length >= 8) events.push(...this.unlock('colony8'));
return { ...summary, colony: { ...colony, events } };
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
firstTip(key) {
const t = (this.tutorial.tips ||= {});
if (t[key]) return false;
t[key] = true;
return true;
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
laws: this.world.laws,
wild: this.world.wild,
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
brewLog: this.brewLog,
reliefDay: this.reliefDay,
grandDone: this.grandDone,
createdAt: this.createdAt,
trials: this.trials,
gathering: this.gathering,
vial: this.vial,
bottles: this.bottles,
batch: this.batch,
sales: this.sales,
followUps: this.followUps,
referrals: this.referrals,
opened: this.opened,
patrons: this.patrons,
savedAt: Date.now(),
};
}
static fromJSON(raw) {
const data = migrate(raw);
const world = {
...data.world,
materials: data.world.materials.map(deserializeMaterial),
};
addAlchemy(world);
const inventory = Object.fromEntries(Object.entries(data.inventory).map(([k, v]) => [k, v === 'inf' ? Infinity : Number(v)]));
for (const id of world.wild || []) if (!(id in inventory)) inventory[id] = 0;
for (const [k, v] of Object.entries(inventory)) if (!Number.isFinite(v) && v !== Infinity) inventory[k] = 0;
const st = new GameState({ ...data, world, inventory });
if (data._migratedFrom !== undefined && data._migratedFrom < 3) st.genVersion = WORLD_GEN_VERSION;
st.buyBackPrepared();
if (st.current) migrateCommission(st.current, st.world, st.lookup);
if (st.current) retireRequirements(st.current);
return st;
}
}
function newBatch() {
return { id: 'b' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36), rev: 0 };
}
function migrateCommission(com, world, lookup) {
if (!com || !Array.isArray(com.requirements)) return com;
const old = com.requirements.filter((r) => ASPECT_KEY_MAP[r.key] && r.effect === undefined && com.predicted && com.predicted.aspects);
if (!old.length) return com;
let pred = null;
try { pred = com.reference ? predictPlan(world, lookup, com.reference) : null; } catch { pred = null; }
const OLD = ['vitality', 'ardor', 'arcana', 'fortitude'];
for (const r of old) {
const key = ASPECT_KEY_MAP[r.key];
const oldPred = com.predicted.aspects[OLD.indexOf(r.key)] || 0;
const newPred = pred ? pred.effects[EFFECT_INDEX[key]] : oldPred;
const ratio = oldPred > 0 ? Number(r.target) / oldPred : 0.65;
const target = Math.max(3, Math.round(newPred * ratio));
Object.assign(r, { key, target, zero: Math.max(8, target * 0.6), label: `at least ${target}`, effect: true });
}
if (pred) com.predicted.effects = pred.effects;
com.effectOrder = true;
return com;
}
function migrate(raw) {
if (!raw || typeof raw !== 'object') throw new Error('Not a save file');
const d = { ...raw };
if (!d.version) throw new Error('Missing save version');
if (d.version > SAVE_VERSION) throw new Error('This save comes from a newer version of the game');
d._migratedFrom = d.version;
if (Array.isArray(d.equipment) && d.equipment.includes('lantern')) d.equipment = [...new Set(d.equipment.map((id) => (id === 'lantern' ? 'still' : id)))];
if (d.version < 2) {
d.market = d.market || { event: 'none', mods: {} };
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
if (d.version < 3) {
d.trials = d.trials || null;
d.gathering = d.gathering || null;
d.vial = null;
d.batch = null;
d.version = 3;
}
if (d.version < 4) {
d.trials = d.trials || null;
d.sales = Array.isArray(d.sales) ? d.sales : [];
d.followUps = Array.isArray(d.followUps) ? d.followUps : [];
d.referrals = d.referrals | 0;
d.version = 4;
}
if (d.version < 5) {
d.opened = (d.customerIndex | 0) > 0 || !!d.current;
d.patrons = d.patrons && typeof d.patrons === 'object' ? d.patrons : {};
d.recipes = (d.recipes || []).map(migrateRecipe);
d.version = 5;
}
if (d.version < 6) {
const refit = retireEquipment(d.equipment);
d.equipment = refit.equipment;
d.coins = round1((Number(d.coins) || 0) + refit.refund);
if (refit.lines.length) {
d.journal['note:refit'] = { key: 'note:refit', kind: 'note', title: 'The guild refitted your workshop', day: d.day | 0,
text: `Some instruments and tools no longer serve the trade, and the guild has taken them back: ${refit.lines.join('; ')}. ${refit.refund > 0 ? `${refit.refund} coins were paid back in all.` : ''}`.trim() };
}
d.recipes = (d.recipes || []).map(migrateRecipe);
delete d.receiver;
d.version = 6;
}
for (const id of STARTING_EQUIPMENT) if (!d.equipment.includes(id)) d.equipment = [...d.equipment, id];
d.equipment = d.equipment.filter((id) => id !== 'mortar');
if (d.world && Array.isArray(d.world.materials) && d.world.materials.length === 0) throw new Error('The save has no reagents');
if (!d.inventory || typeof d.inventory !== 'object') throw new Error('The save has no inventory');
return d;
}
function retireEquipment(list) {
const owned = [...new Set(list || [])];
const out = owned.filter((id) => !RETIRED_EQUIPMENT[id] && id !== 'pestle');
let refund = 0;
const lines = [];
const into = {};
for (const id of owned) {
const r = RETIRED_EQUIPMENT[id];
if (!r) continue;
if (r.into) { into[r.into] = (into[r.into] || 0) + r.price; continue; }
refund += r.price;
lines.push(`${r.name} (${r.price} coins: ${r.why})`);
}
for (const [target, paid] of Object.entries(into)) {
const e = equipmentById(target);
const names = owned.filter((id) => RETIRED_EQUIPMENT[id] && RETIRED_EQUIPMENT[id].into === target).map((id) => RETIRED_EQUIPMENT[id].name);
if (!e) continue;
if (out.includes(target)) {
refund += paid;
lines.push(`${names.join(', ')} (${paid} coins: you already own the ${e.name})`);
} else {
out.push(target);
const back = Math.max(0, paid - e.price);
refund += back;
lines.push(`${names.join(', ')} → the ${e.name}${back ? ` and ${back} coins` : ''}`);
}
}
if (owned.includes('pestle')) { refund += 35; lines.push('Granite Pestle (35 coins: every workshop now has one)'); }
return { equipment: out, refund: round1(refund), lines };
}
function retireRequirements(com) {
if (!com || !Array.isArray(com.requirements)) return com;
const keep = (r) => r.key === 'purity' || EFFECT_KEYS.includes(r.key);
com.requirements = com.requirements.filter(keep);
com.techniques = migrateTechniques(com.techniques || []);
if (typeof com.style === 'string') com.style = [com.style.split('+')[0], ...com.techniques.slice().sort()].join('+');
com.effectOrder = com.requirements.some((r) => r.effect);
return com;
}
function round1(v) {
return Math.round(v * 10) / 10;
}
return { SAVE_VERSION, PURGE_PRICE, PURGE_BREW_COST, PURGE_BREW_TIME, WORLD_GEN_VERSION, STARTER_HERBS, MARKET_EVENTS, ACHIEVEMENTS, GameState, migrateCommission, migrate, retireEquipment, retireRequirements, EQUIPMENT, SIM };
})();
// src/game/persistence.js
const __m50 = (() => {
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
// src/simulation/snapshot.js
const __m52 = (() => {
const { MAX_SPECIES } = __m18;
const { refreshParticle } = __m35;
const { Simulation } = __m31;
const { CAULDRON_SIZES } = __m34;
const F32_FIELDS_V1 = ['x', 'y', 'vx', 'vy', 'temp', 'lat', 'eph', 'restX', 'restY', 'agit', 'burn', 'wet'];
const F32_FIELDS = [...F32_FIELDS_V1, 'q'];
const SNAPSHOT_VERSION = 2;
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
skin: toBase64(p.skin.slice(0, n)),
skinUV: toBase64(Float32Array.from({ length: 2 * n }, (_, k) => (k < n ? p.skinU[k] : p.skinV[k - n]))),
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
let skin = null, skinUV = null;
if (snap.skin && snap.skinUV) {
const kb = fromBase64(snap.skin), ub = fromBase64(snap.skinUV);
skin = new Uint16Array(kb.buffer, kb.byteOffset, kb.byteLength / 2);
skinUV = new Float32Array(ub.buffer, ub.byteOffset, ub.byteLength / 4);
}
const p = sim.p;
const S = MAX_SPECIES;
const fields = (snap.v || 1) >= 2 ? F32_FIELDS : F32_FIELDS_V1;
const from = CAULDRON_SIZES[snap.size], to = sim.cauldron.spec;
const remap = from && from.key !== to.key && (from.depth > to.depth + 1e-6 || from.belly > to.belly + 1e-6);
const sx = remap ? to.belly / from.belly : 1, sy = remap ? to.depth / from.depth : 1;
p.count = n;
for (let i = 0; i < n; i++) {
p.q[i] = 0;
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
p.skin[i] = skin ? skin[i] : 0;
p.skinU[i] = skinUV ? skinUV[i] : 0;
p.skinV[i] = skinUV ? skinUV[snap.n + i] : 0;
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
const __m54 = (() => {
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
const u = L.scale >= 70 ? 3 : L.scale >= 34 ? 2 : 1;
const w = Math.ceil(W / u), h = Math.ceil(H / u);
const cv = makeCanvas(w, h);
const g = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d'));
paintWorkshop(g, w, h, {
cx: L.cx / u, floorY: Math.round(L.floorY / u), s: L.scale / u,
half: (L.half ?? L.scale * 3.1) / u, top: (L.top ?? L.floorY - L.scale * 4) / u, jars: L.jars,
});
ctx.imageSmoothingEnabled = false;
ctx.drawImage(cv, 0, 0, w * u, h * u);
}
const DK = '#140e12';
function paintWorkshop(g, W, H, L) {
const rng = new Rng('backdrop-2');
const s = L.s, cx = L.cx, fy = L.floorY;
R(g, 0, 0, W, fy, '#1e1a22');
const bh = Math.max(4, Math.round(s * 0.2)), bw = bh * 2 + 3;
const bricks = ['#2c2632', '#332c3a', '#3a3341', '#2a2430', '#403848'];
for (let y = 0, row = 0; y < fy; y += bh, row++) {
const off = row % 2 ? Math.round(bw / 2) : 0;
for (let x = -off; x < W; x += bw) {
const c = rng.pick(bricks);
R(g, x + 1, y + 1, bw - 1, bh - 1, c);
R(g, x + 1, y + 1, bw - 2, 1, mixHex(c, '#6a6070', 0.35));
R(g, x + 1, y + bh - 1, bw - 1, 1, mixHex(c, '#0a080c', 0.4));
R(g, x + 1, y + 1, 1, bh - 2, mixHex(c, '#6a6070', 0.2));
if (rng.chance(0.3)) R(g, x + 2 + rng.int(0, bw - 5), y + 2 + rng.int(0, Math.max(0, bh - 4)), rng.int(1, 2), 1, mixHex(c, '#0a080c', 0.5));
if (rng.chance(0.06)) R(g, x + rng.int(1, bw - 3), y + bh - 2, rng.int(2, 4), 1, '#3f5a2a');
}
}
for (let y = 0; y < fy; y++) {
const a = 0.35 * Math.max(0, 1 - y / (fy * 0.4));
if (a > 0.01) R(g, 0, y, W, 1, `rgba(8,6,10,${a.toFixed(3)})`);
}
const by = Math.round(s * 0.12), bth = Math.max(3, Math.round(s * 0.2));
R(g, 0, by - 1, W, bth + 2, DK);
R(g, 0, by, W, bth, PAL.wood2); R(g, 0, by, W, 1, PAL.wood4); R(g, 0, by + bth - 1, W, 1, PAL.wood1);
for (let x = rng.int(0, 12); x < W; x += rng.int(10, 24)) R(g, x, by + 1 + rng.int(0, bth - 3), rng.int(4, 9), 1, PAL.wood1);
const clear = (x, pad = 0) => Math.abs(x - cx) > L.half * 0.62 + pad;
for (let k = 0; k < 9; k++) {
const hx = Math.round((k + 0.5) * (W / 9) + rng.range(-4, 4));
if (!clear(hx, 2)) continue;
herbBundle(g, rng, hx, by + bth, Math.round(s * rng.range(0.45, 0.75)), rng.pick([['#2f5a24', '#4f8a32', '#7da447'], ['#4a3a6a', '#7a5aa8', '#a88ad8'], ['#5a6a24', '#8a9a32', '#b8c84a']]));
}
for (const side of [-1, 1]) {
const x0 = side < 0 ? rng.int(1, 4) : W - rng.int(2, 5);
ivy(g, rng, x0, by + bth, Math.round(s * 1.6));
}
const shelves = [];
const gap = Math.max(s * 0.55, 6);
const up = by + bth + Math.round(s * 0.5);
if (up < L.top - s * 0.15) {
shelves.push([2, up, Math.round(cx - gap - 2), -1], [Math.round(cx + gap), up, Math.round(W - 2 - cx - gap), 1]);
}
const room = Math.max(0, cx - L.half * 0.95);
const shelfW = Math.min(Math.round(s * 1.9), Math.round(room - 2));
if (shelfW > s * 0.5) {
for (const sy of [Math.round(s * 1.05), Math.round(s * 2.3)]) {
if (sy > fy - s * 0.6 || (shelves.length && sy < up + s * 0.7)) continue;
shelves.push([Math.round(Math.max(2, cx - L.half * 0.95 - shelfW)), sy, shelfW, -1], [Math.round(Math.min(W - shelfW - 2, cx + L.half * 0.95)), sy, shelfW, 1]);
}
}
let ji = 0;
for (const [sx, sy, sw, side] of shelves) {
if (sw < 8) continue;
shelf(g, sx, sy, sw);
let x = sx + 2;
while (x < sx + sw - 4) {
const kind = rng.next();
const jar = L.jars.length ? L.jars[ji++ % L.jars.length] : { color: [0.5, 0.6, 0.8], form: 'liquid' };
if (kind < 0.55) { const jw = Math.max(4, Math.round(s * rng.range(0.16, 0.24))), jh = Math.max(5, Math.round(s * rng.range(0.24, 0.36))); if (x + jw > sx + sw - 2) break; drawJar(g, x, sy - 1 - jh, jw, jh, jar.color, jar.form); x += jw + 1 + rng.int(0, 1); }
else if (kind < 0.7) { const bw2 = Math.max(4, Math.round(s * 0.2)); if (x + bw2 > sx + sw - 2) break; bottle(g, x, sy - 1, bw2, Math.round(s * rng.range(0.38, 0.5)), jar.color); x += bw2 + 2; }
else if (kind < 0.85) { const n = rng.int(2, 4); for (let b = 0; b < n && x < sx + sw - 5; b++) { const bh2 = Math.round(s * rng.range(0.24, 0.32)); const c = rng.pick([PAL.copper1, PAL.leaf1, PAL.frost0, '#5a2340', PAL.wood2]); R(g, x - 1, sy - 2 - bh2, 4, bh2 + 1, DK); R(g, x, sy - 1 - bh2, 2, bh2, c); R(g, x, sy - bh2 + 1, 2, 1, PAL.brass); x += 3; } x += 2; }
else { const pw = Math.max(5, Math.round(s * 0.26)); if (x + pw > sx + sw - 2) break; pottedPlant(g, rng, x, sy - 1, pw); x += pw + 2; }
}
ivy(g, rng, side < 0 ? sx + 1 : sx + sw - 2, sy + 2, Math.round(s * rng.range(0.4, 0.9)));
}
R(g, 0, fy, W, H - fy, '#2a2430');
const fh = Math.max(3, Math.round(s * 0.18));
for (let y = fy, row = 0; y < H; y += fh, row++) {
const fw = fh * 3 + row;
for (let x = -(row * 7) % fw; x < W; x += fw) {
const c = rng.pick(['#3d3844', '#4a4252', '#433b4a', '#38323f']);
R(g, x + 1, y + 1, fw - 1, fh - 1, c);
R(g, x + 1, y + 1, fw - 2, 1, mixHex(c, '#8a8296', 0.3));
}
}
R(g, 0, fy, W, 1, '#0d0a10'); R(g, 0, fy + 1, W, 1, 'rgba(0,0,0,0.4)');
const lx = cx - L.half * 0.95, rx = cx + L.half * 0.95;
if (lx > s * 0.7) barrel(g, Math.round(lx - s * 0.75), fy + 1, Math.round(s * 0.62), Math.round(s * 0.8));
if (lx > s * 1.6) { stoneBlock(g, Math.round(lx - s * 1.5), fy + 1, Math.round(s * 0.55), Math.round(s * 0.36)); mortar(g, Math.round(lx - s * 1.38), fy + 1 - Math.round(s * 0.36), Math.round(s * 0.3)); }
if (W - rx > s * 0.8) sack(g, rng, Math.round(rx + s * 0.25), fy + 1, Math.round(s * 0.62), Math.round(s * 0.66));
if (W - rx > s * 1.6) pottedPlant(g, rng, Math.round(rx + s * 1.05), fy + 1, Math.round(s * 0.4));
const gl = g.createRadialGradient(cx, fy, s * 0.2, cx, fy, s * 4.2);
gl.addColorStop(0, 'rgba(255,150,60,0.22)');
gl.addColorStop(0.5, 'rgba(255,120,40,0.08)');
gl.addColorStop(1, 'rgba(255,120,40,0)');
g.fillStyle = gl;
g.fillRect(0, 0, W, H);
const vg = g.createRadialGradient(cx, fy * 0.7, s * 1.8, cx, fy * 0.6, Math.max(W, H) * 0.9);
vg.addColorStop(0, 'rgba(0,0,0,0)');
vg.addColorStop(1, 'rgba(6,4,10,0.4)');
g.fillStyle = vg;
g.fillRect(0, 0, W, H);
}
function shelf(g, x, y, w) {
R(g, x - 1, y - 1, w + 2, 4, DK);
R(g, x, y, w, 2, PAL.wood4); R(g, x, y, w, 1, PAL.wood5); R(g, x, y + 2, w, 1, PAL.wood1);
for (const bx of [x + 2, x + w - 4]) { R(g, bx, y + 3, 2, 3, PAL.iron3); R(g, bx + 1, y + 6, 1, 1, PAL.iron3); }
R(g, x, y + 3, w, 1, 'rgba(0,0,0,0.35)');
}
function herbBundle(g, rng, x, y, len, pal) {
R(g, x, y, 1, 2, PAL.parch1);
R(g, x - 1, y + 2, 3, 2, PAL.wood3);
for (let i = 0; i < len; i++) {
const t = i / len, wd = Math.max(1, Math.round((0.4 + Math.sin(t * Math.PI) * 0.9) * 3));
R(g, x - wd, y + 4 + i, wd * 2 + 1, 1, DK);
for (let k = -wd + 1; k < wd; k++) R(g, x + k, y + 4 + i, 1, 1, pal[(k + i + 9) % 3 === 0 ? 2 : (k + i) % 2 ? 1 : 0]);
}
for (let k = 0; k < 4; k++) R(g, x + rng.int(-3, 3), y + 4 + rng.int(len - 3, len + 1), 1, 1, pal[1]);
}
function ivy(g, rng, x, y, len) {
let px = x;
for (let i = 0; i < len; i++) {
px += rng.int(-1, 1) * (i % 3 === 0 ? 1 : 0);
R(g, px, y + i, 1, 1, '#2a4a1f');
if (i % 3 === 0) { const sd = rng.chance(0.5) ? -1 : 1; R(g, px + sd, y + i, 2 * sd > 0 ? 2 : 1, 2, '#4f8a32'); R(g, px + sd * 2, y + i, 1, 1, '#7da447'); }
}
}
function bottle(g, x, base, w, h, color) {
const nw = Math.max(2, Math.round(w / 3)), nh = Math.round(h * 0.35), bh = h - nh;
const nx = x + Math.round((w - nw) / 2);
R(g, x - 1, base - bh - 1, w + 2, bh + 1, DK);
R(g, nx - 1, base - h - 1, nw + 2, nh + 1, DK);
R(g, x, base - bh, w, bh, 'rgba(160,210,230,0.25)');
const fill = Math.round(bh * 0.65);
R(g, x, base - fill, w, fill, rgbStr(color, 0.9));
R(g, x, base - fill, w, 1, rgbStr(color, 1.3));
R(g, nx, base - h, nw, nh, 'rgba(160,210,230,0.3)');
R(g, nx, base - h - 1, nw, 2, PAL.wood5);
R(g, x, base - bh + 1, 1, bh - 2, 'rgba(255,255,255,0.45)');
}
function pottedPlant(g, rng, x, base, w) {
const ph = Math.max(3, Math.round(w * 0.7));
R(g, x - 1, base - ph - 1, w + 2, ph + 1, DK);
R(g, x, base - ph, w, ph, PAL.copper2); R(g, x, base - ph, w, 1, PAL.copper3); R(g, x + w - 2, base - ph + 1, 2, ph - 1, PAL.copper1);
R(g, x - 1, base - ph - 1, w + 2, 2, PAL.copper3);
const top = base - ph - 1;
for (let i = 0; i < w * 2.2; i++) {
const lx = x + rng.int(-1, w), ly = top - rng.int(0, Math.round(w * 1.2));
R(g, lx, ly, 2, 1, DK);
R(g, lx, ly, 1, 1, rng.pick(['#3f7a2a', '#5a9a34', '#7da447', '#2f5a24']));
}
for (let i = 0; i < 3; i++) R(g, x + Math.round(w / 2) + rng.int(-1, 1), top - i * 2, 1, 2, '#2f5a24');
}
function barrel(g, x, base, w, h) {
for (let yy = 0; yy < h; yy++) {
const t = yy / h, bulge = Math.round(Math.sin(t * Math.PI) * w * 0.08);
R(g, x - bulge - 1, base - h + yy, w + bulge * 2 + 2, 1, DK);
R(g, x - bulge, base - h + yy, w + bulge * 2, 1, PAL.wood3);
for (let k = 3; k < w; k += 4) R(g, x - bulge + k, base - h + yy, 1, 1, PAL.wood2);
R(g, x - bulge, base - h + yy, 2, 1, PAL.wood4);
R(g, x + w + bulge - 3, base - h + yy, 3, 1, PAL.wood1);
}
for (const t of [0.15, 0.5, 0.85]) { const yy = Math.round(base - h + t * h); R(g, x - 1, yy, w + 2, 2, PAL.iron2); R(g, x - 1, yy, w + 2, 1, PAL.iron4); }
R(g, x, base - h - 1, w, 2, PAL.wood4); R(g, x + 1, base - h - 1, w - 2, 1, PAL.wood5);
}
function sack(g, rng, x, base, w, h) {
for (let yy = 0; yy < h; yy++) {
const t = yy / h, wd = Math.round(w * (0.55 + 0.45 * Math.sin(Math.min(1, t * 1.3) * Math.PI / 2)));
const ox = Math.round((w - wd) / 2);
R(g, x + ox - 1, base - h + yy, wd + 2, 1, DK);
R(g, x + ox, base - h + yy, wd, 1, t < 0.15 ? '#a8885a' : '#8a6a42');
R(g, x + ox, base - h + yy, 2, 1, '#b89868');
R(g, x + ox + wd - 2, base - h + yy, 2, 1, '#6a5032');
}
R(g, x + Math.round(w * 0.3), base - Math.round(h * 0.82), Math.round(w * 0.4), 1, '#4a3420');
for (let i = 0; i < w; i++) R(g, x + rng.int(2, w - 3), base - rng.int(2, h - 3), 1, 1, '#7a5a38');
}
function stoneBlock(g, x, base, w, h) {
R(g, x - 1, base - h - 1, w + 2, h + 1, DK);
R(g, x, base - h, w, h, PAL.stone2); R(g, x, base - h, w, 1, PAL.stone4); R(g, x, base - h, 1, h, PAL.stone3); R(g, x + w - 2, base - h + 1, 2, h - 1, PAL.stone1);
}
function mortar(g, x, base, w) {
const h = Math.max(3, Math.round(w * 0.6));
R(g, x - 1, base - h - 1, w + 2, h + 1, DK);
R(g, x, base - h, w, h, PAL.stone3); R(g, x, base - h, w, 1, PAL.stone4); R(g, x + 1, base - h + 1, w - 2, 1, PAL.stone1);
for (let i = 0; i < h + 2; i++) R(g, x + w - 2 + Math.round(i * 0.5), base - h - i, 2, 1, i ? PAL.wood4 : PAL.wood5);
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
function hammer(x, y) {
const h = (i, j) => {
let n = (i * 374761393 + j * 668265263) | 0;
n = Math.imul(n ^ (n >>> 13), 1274126177);
return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
};
const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j;
const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
const a = h(i, j) + (h(i + 1, j) - h(i, j)) * sx;
const b = h(i, j + 1) + (h(i + 1, j + 1) - h(i, j + 1)) * sx;
return a + (b - a) * sy;
}
function renderCauldron(c, v) {
const s = v.scale;
const wall = 0.16, rim = 0.28;
const x0 = Math.floor(v.ox + (-c.belly - 0.6) * s), x1 = Math.ceil(v.ox + (c.belly + 0.6) * s);
const y0 = Math.floor(v.oy + -0.25 * s), y1 = Math.ceil(v.oy + (c.depth + 0.5) * s);
const w = x1 - x0, h = y1 - y0;
const p = s >= 70 ? 2 : 1;
const cw = Math.ceil(w / p), ch = Math.ceil(h / p);
const S = s / p, u = 1 / S; // coarse px per world unit, world units per coarse px
const ox = (v.ox - x0) / p, oy = (v.oy - y0) / p;
const body = makeCanvas(cw, ch);
const bctx = body.getContext('2d');
const img = bctx.createImageData(cw, ch);
const d = img.data;
const iron = [PAL.iron0, PAL.iron1, PAL.iron2, PAL.iron3, PAL.iron4, PAL.iron5, '#9a95a6'].map(hex2rgb);
const OUT = hex2rgb('#08070a');
const put = (px, py, col) => { const o = (py * cw + px) * 4; d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2]; d[o + 3] = 255; };
const band = (lum, px, py) => {
const t = (BAYER4[(px & 3) + (py & 3) * 4] + 0.5) / 16;
return Math.max(0, Math.min(6, Math.floor(lum + (t - 0.5) * 0.7 + 0.5)));
};
const seams = [c.neck * 0.8, c.neck + (c.depth - c.neck) * 0.55];
const rivetGap = Math.max(5, Math.round(0.22 * S));
const wallCells = [];
for (let py = 0; py < ch; py++) {
const wy = (py + 0.5 - oy) * u;
if (wy < -0.02) continue;
for (let px = 0; px < cw; px++) {
const wx = (px + 0.5 - ox) * u;
const dist = c.sample(wx, wy);
const nx = c.nx, ny = c.ny;
if (dist <= 0 && wy >= 0) {
const hw = Math.max(0.05, c.halfWidth(wy));
const xt = wx / hw;
const depthT = Math.min(1, wy / c.depth);
let lum = 1.7 - depthT * 1.2 + xt * 0.5 - xt * xt * 0.4;
lum += (hammer(wx * 7, wy * 7) - 0.5) * 0.35;
if (wy < 0.14) lum -= (0.14 - wy) * 6; // shadow cast by the rim
if (dist > -u * 1.5) lum = Math.min(lum, 0.6); // seam where wall meets bowl
let k = Math.min(3, band(lum, px, py));
const k0 = k;
for (const sy of seams) {
const yy = sy - 0.07 * (1 - xt * xt);
const dy = (wy - yy) * S;
if (dy >= -0.5 && dy < 0.5) k = Math.max(0, k0 - 1);
else if (dy >= 0.5 && dy < 1.5) k = Math.min(4, k0 + 1);
if (Math.abs(xt) < 0.92 && Math.abs(dy + 1) < 1.01) {
const along = Math.round(Math.asin(Math.max(-1, Math.min(1, xt))) * hw * S);
const m = ((along % rivetGap) + rivetGap) % rivetGap;
if (m === 0) k = dy < -1 ? 5 : 4;
else if (m === 1 && dy > -1.5) k = 1;
}
}
put(px, py, iron[k]);
continue;
}
if (!(dist > 0 && dist < wall)) continue;
let lum = 3.0 - nx * 1.6 - ny * 1.3;
lum += Math.pow(Math.max(0, -nx * 0.66 - ny * 0.75), 6) * 2.2; // sheen on the upper left of the belly
lum += (hammer(wx * 9, wy * 9) - 0.5) * 0.9; // hammered dimples
const outer = wall - dist;
if (outer < u * 2.2 && nx * 0.6 + ny * 0.8 > 0.35) lum = Math.max(lum, 3.6);
if (dist < u * 1.2) lum = 0.6; // inner lip in shadow
let col = iron[band(lum, px, py)];
if (outer < u) col = OUT; // silhouette outline
put(px, py, col);
if (outer >= u) {
const cell = c.wallCellAt(Math.max(-c.belly, Math.min(c.belly, wx - nx * dist)), Math.min(c.depth, wy - ny * dist));
if (cell >= 0) wallCells.push(px, py, cell);
}
}
}
bctx.putImageData(img, 0, 0);
const cv = makeCanvas(cw, ch);
const ctx = cv.getContext('2d');
const X = (wx) => Math.round(ox + wx * S), Y = (wy) => Math.round(oy + wy * S);
const legW = Math.max(3, Math.round(0.2 * S));
const top = Y(c.depth - 0.3), bot = Y(c.depth + 0.4);
for (const sgn of [-1, 1]) {
const cx = X(sgn * c.belly * 0.6);
for (let y = top; y < bot; y++) {
const t = (y - top) / Math.max(1, bot - top);
const half = Math.round(legW * (0.62 - 0.22 * Math.sin(Math.min(1, t / 0.8) * Math.PI) + (t > 0.78 ? (t - 0.78) * 3.2 : 0)) );
const shift = t > 0.78 ? Math.round(sgn * (t - 0.78) * legW * 1.6) : 0;
const l = cx - half + shift, r = cx + half + shift;
R(ctx, l - 1, y, r - l + 2, 1, '#08070a');
R(ctx, l, y, r - l, 1, PAL.iron2);
R(ctx, l, y, Math.max(1, Math.round((r - l) * 0.3)), 1, PAL.iron4);
R(ctx, l + Math.max(1, Math.round((r - l) * 0.3)), y, 1, 1, PAL.iron3);
R(ctx, r - 1, y, 1, 1, PAL.iron1);
}
const fx = cx + Math.round(sgn * legW * 0.35), toe = Math.max(1, Math.round(legW * 0.3));
for (let k = -1; k <= 1; k++) {
const tx = fx + k * (toe + 1) - Math.floor(toe / 2);
R(ctx, tx - 1, bot - 1, toe + 2, 2, '#08070a');
R(ctx, tx, bot - 1, toe, 1, PAL.iron3);
}
R(ctx, cx - legW, bot, legW * 2 + Math.round(legW * 0.7), 1, 'rgba(0,0,0,0.45)');
}
ctx.drawImage(body, 0, 0);
const hy = Y(0.55);
const ringR = Math.max(3, Math.round(0.14 * S)), ringT = Math.max(1, Math.round(0.045 * S));
for (const sgn of [-1, 1]) {
const wallX = X(sgn * (c.halfWidth(0.42) + wall));
const hx = wallX + sgn * (ringR - 1);
const lugW = Math.max(2, Math.round(0.08 * S) + 1), lugH = Math.max(3, Math.round(0.12 * S));
const ly = hy - ringR - Math.round(lugH / 2);
const lx = sgn > 0 ? wallX - 1 : wallX - lugW + 1;
R(ctx, lx - 1, ly - 1, lugW + 2, lugH + 2, '#08070a');
R(ctx, lx, ly, lugW, lugH, PAL.iron3);
R(ctx, lx, ly, lugW, 1, PAL.iron5);
R(ctx, lx, ly + lugH - 1, lugW, 1, PAL.iron1);
for (let yy = -ringR - 1; yy <= ringR + 1; yy++) {
for (let xx = -ringR - 1; xx <= ringR + 1; xx++) {
const r = Math.hypot(xx + 0.5 * 0, yy);
if (r > ringR + 0.6 || r < ringR - ringT - 0.6) continue;
let col;
if (r > ringR - 0.4 || r < ringR - ringT + 0.4) col = '#08070a';
else {
const lit = (-xx - yy) / (r || 1);
col = lit > 0.55 ? PAL.iron5 : lit > -0.2 ? PAL.iron4 : lit > -0.7 ? PAL.iron3 : PAL.iron2;
}
if (ringT === 1 && col === '#08070a' && r < ringR + 0.1 && r > ringR - 1.4) col = PAL.iron4;
R(ctx, hx + xx, hy + yy, 1, 1, col);
}
}
R(ctx, lx, hy - ringR - 1, lugW, 2, PAL.iron4);
}
const ry = Y(-0.12), rh = Math.max(4, Y(0.12) - ry);
for (const sgn of [-1, 1]) {
const a = X(sgn * (c.mouth - 0.02)), b = X(sgn * (c.mouth + rim));
const l = Math.min(a, b), r = Math.max(a, b);
R(ctx, l + 1, ry - 1, r - l - 2, rh + 2, '#08070a');
R(ctx, l, ry, r - l, rh, '#08070a');
R(ctx, l + 1, ry, r - l - 2, rh, PAL.iron3);
R(ctx, l, ry + 1, r - l, rh - 2, PAL.iron3);
const hiH = Math.max(1, Math.round(rh * 0.3));
R(ctx, l + 1, ry, r - l - 2, hiH, PAL.iron5);
R(ctx, l + 1, ry + hiH, r - l - 2, 1, PAL.iron4);
R(ctx, l + 1, ry + rh - Math.max(1, Math.round(rh * 0.3)), r - l - 2, Math.max(1, Math.round(rh * 0.3)), PAL.iron1);
const gx = sgn < 0 ? l + 2 : r - 4;
R(ctx, gx, ry, 2, 1, '#c8c3d2');
}
const out = makeCanvas(w, h);
const octx = out.getContext('2d');
octx.imageSmoothingEnabled = false;
octx.drawImage(cv, 0, 0, cw * p, ch * p);
const wallPix = [];
for (let k = 0; k < wallCells.length; k += 3) {
for (let j = 0; j < p; j++) for (let i = 0; i < p; i++) {
const fx = wallCells[k] * p + i, fy = wallCells[k + 1] * p + j;
if (fx < w && fy < h) wallPix.push(fx, fy, wallCells[k + 2]);
}
}
return { canvas: out, x: x0, y: y0, wallPix };
}
function paintLid(c, S) {
const half = Math.round((c.mouth + 0.22) * S);
const fh = Math.max(2, Math.round(0.1 * S)); // flange
const dh = Math.max(3, Math.round(0.2 * S)); // dome rise
const kh = Math.max(3, Math.round(0.13 * S)), kw = Math.max(3, Math.round(0.11 * S)); // knob
const cw = half * 2 + 2, ch = fh + dh + kh + 3;
const cv = makeCanvas(cw, ch);
const ctx = cv.getContext('2d');
const cx = half + 1, base = ch - 1 - fh; // dome sits on the flange
const rd = half - Math.max(2, Math.round(0.07 * S));
const OUT = '#08070a';
const iron = [PAL.iron0, PAL.iron1, PAL.iron2, PAL.iron3, PAL.iron4, PAL.iron5, '#9a95a6'];
const domeH = (x) => (Math.abs(x) >= rd ? 0 : Math.round(dh * Math.sqrt(1 - (x / rd) * (x / rd))));
for (let x = -rd; x <= rd; x++) {
const hgt = domeH(x);
const topY = base - hgt;
R(ctx, cx + x, topY - 1, 1, 1, OUT);
for (let y = topY; y < base; y++) {
const xt = x / rd, yt = (base - y) / Math.max(1, dh);
let lum = 3.4 - xt * 1.6 + yt * 0.8;
if (Math.abs(xt + 0.42) < 0.08 && yt > 0.35) lum += 1.6; // a highlight streak
const t = (BAYER4[((cx + x) & 3) + (y & 3) * 4] + 0.5) / 16;
R(ctx, cx + x, y, 1, 1, iron[Math.max(1, Math.min(6, Math.floor(lum + (t - 0.5) * 0.8 + 0.5)))]);
}
}
const fy = base;
R(ctx, 1, fy - 1, cw - 2, fh + 2, OUT);
R(ctx, 0, fy, cw, fh, OUT);
R(ctx, 1, fy, cw - 2, fh, PAL.iron3);
R(ctx, 1, fy, cw - 2, 1, PAL.iron5);
R(ctx, 1, fy + fh - 1, cw - 2, 1, PAL.iron1);
R(ctx, 3, fy, Math.max(2, Math.round(half * 0.3)), 1, '#c8c3d2');
const ky = base - dh - kh;
R(ctx, cx - kw - 1, base - dh - 2, kw * 2 + 2, 3, OUT);
R(ctx, cx - kw, base - dh - 1, kw * 2, 1, PAL.iron4);
R(ctx, cx - Math.ceil(kw / 2) - 1, ky - 1, Math.ceil(kw / 2) * 2 + 2, kh + 1, OUT);
R(ctx, cx - Math.ceil(kw / 2), ky, Math.ceil(kw / 2) * 2, kh - 1, PAL.wood3);
R(ctx, cx - Math.ceil(kw / 2), ky, 1, kh - 1, PAL.wood5);
R(ctx, cx + Math.ceil(kw / 2) - 1, ky, 1, kh - 1, PAL.wood1);
R(ctx, cx - Math.ceil(kw / 2), ky, Math.ceil(kw / 2) * 2, 1, PAL.wood4);
return { cv, cw, ch, cx, base, fh, domeH };
}
function renderLid(c, v) {
const s = v.scale;
const p = s >= 70 ? 2 : 1;
const S = s / p;
const { cv, cw, ch, cx, base, fh, domeH } = paintLid(c, S);
const w = cw * p, h = ch * p;
const out = makeCanvas(w, h);
const octx = out.getContext('2d');
octx.imageSmoothingEnabled = false;
octx.drawImage(cv, 0, 0, w, h);
const x = Math.round(v.ox) - cx * p, y = Math.round(v.oy - 0.12 * s) - (ch - 1 - fh) * p;
return { canvas: out, x, y, topY: (wx) => y + (base - domeH(Math.round(wx * S)) - 1) * p };
}
function renderLidAside(c, v) {
const s = v.scale;
const p = s >= 70 ? 2 : 1;
const S = s / p;
const { cv, cw, ch } = paintLid(c, S);
const tw = ch, th = cw;
const t = makeCanvas(tw + 2, th + 1);
const tctx = t.getContext('2d');
tctx.imageSmoothingEnabled = false;
tctx.setTransform(0, 1, 1, 0, 0, 0);
tctx.drawImage(cv, 0, 0);
tctx.setTransform(1, 0, 0, 1, 0, 0);
R(tctx, 0, th, tw + 2, 1, 'rgba(0,0,0,0.4)');
const w = (tw + 2) * p, h = (th + 1) * p;
const out = makeCanvas(w, h);
const octx = out.getContext('2d');
octx.imageSmoothingEnabled = false;
octx.drawImage(t, 0, 0, w, h);
const x = Math.round(v.ox + (-c.belly - 0.1) * s) - tw * p;
const y = Math.round(v.oy + (c.depth + 0.4) * s) - th * p;
return { canvas: out, x, y };
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
const top = Math.round(v.oy + (c.depth + 0.25) * s), bot = Math.round(v.oy + (c.depth + 0.7) * s);
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
const fy = Math.round(v.oy + (c.depth + 0.2) * s), lw = Math.round(c.belly * 0.5 * s), lh = Math.max(3, Math.round(s * 0.11));
for (const [dx, dy, ww] of [[-0.55, 0, 1], [0.05, 0, 1], [-0.25, -1, 0.9]]) {
const x = Math.round(v.ox + dx * c.belly * s), y = fy + Math.round(dy * lh * 0.8);
const w2 = Math.round(lw * ww);
R(ctx, x - 1, y - 1, w2 + 2, lh + 2, PAL.wood0);
R(ctx, x, y, w2, lh, PAL.wood2); R(ctx, x, y, w2, 1, PAL.wood4); R(ctx, x, y + lh - 1, w2, 1, PAL.wood1);
for (let k = 3; k < w2 - 3; k += 5) R(ctx, x + k, y + 1 + (k % 2), 3, 1, PAL.wood1);
R(ctx, x + w2 - lh, y, lh, lh, PAL.parch1); R(ctx, x + w2 - lh + 1, y + 1, Math.max(1, lh - 2), Math.max(1, lh - 2), PAL.parch0);
}
for (let k = 0; k < 14; k++) R(ctx, Math.round(v.ox + rng.range(-0.6, 0.6) * c.belly * s), fy + lh + rng.int(-1, 1), 2, 1, rng.pick([PAL.fire0, PAL.iron1, PAL.copper0]));
}
return { PAL, hex2rgb, rgbStr, mixHex, paintBackground, drawJar, renderCauldron, renderLid, renderLidAside, makeCanvas, paintHearth, rect: R };
})();
// src/rendering/pieces-art.js
const __m56 = (() => {
const { PIECES_URL, PIECE_CELL } = __m20;
const { piece } = __m19;
const PIECE_ART = {
ready: false,
width: 0,
height: 0,
px: null,
loading: null,
};
function loadPieceArt() {
if (PIECE_ART.loading) return PIECE_ART.loading;
if (typeof Image === 'undefined' || typeof document === 'undefined') return (PIECE_ART.loading = Promise.resolve(false));
PIECE_ART.loading = new Promise((resolve) => {
const img = new Image();
img.onload = () => {
const cv = document.createElement('canvas');
cv.width = img.width; cv.height = img.height;
const ctx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d', { willReadFrequently: true }));
ctx.drawImage(img, 0, 0);
const data = ctx.getImageData(0, 0, cv.width, cv.height).data;
PIECE_ART.px = new Uint32Array(data.buffer, data.byteOffset, data.byteLength / 4);
PIECE_ART.width = cv.width;
PIECE_ART.height = cv.height;
PIECE_ART.ready = true;
resolve(true);
};
img.onerror = () => resolve(false);
img.src = PIECES_URL;
});
return PIECE_ART.loading;
}
const palettes = new Map();
function piecePalette(skin) {
const px = PIECE_ART.px;
if (!px) return null;
let pal = palettes.get(skin);
if (pal) return pal;
const pc = piece(skin);
if (!pc) return null;
const out = [];
for (let y = pc.cy; y < pc.cy + PIECE_CELL; y++) {
for (let x = pc.cx; x < pc.cx + PIECE_CELL; x++) {
const c = px[y * PIECE_ART.width + x];
if (c >>> 31) out.push(c);
}
}
pal = Uint32Array.from(out.length ? out : [0xff808080]);
palettes.set(skin, pal);
return pal;
}
return { PIECE_ART, loadPieceArt, piecePalette };
})();
// src/rendering/potion-fx.js
const __m57 = (() => {
const { EFFECTS } = __m13;
const K = Object.fromEntries(EFFECTS.map((e, k) => [e.key, k]));
function hash01(n) {
n = Math.imul(n ^ (n >>> 15), 0x2c1b3c6d);
n = Math.imul(n ^ (n >>> 12), 0x297a2d39);
n ^= n >>> 15;
return (n >>> 0) / 4294967296;
}
function cellHash(cx, cy, salt) {
return hash01(Math.imul(cx, 73856093) ^ Math.imul(cy, 19349663) ^ Math.imul(salt, 83492791));
}
function vnoise(x, y, salt) {
const ix = Math.floor(x), iy = Math.floor(y);
let fx = x - ix, fy = y - iy;
fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
const a = cellHash(ix, iy, salt), b = cellHash(ix + 1, iy, salt), c = cellHash(ix, iy + 1, salt), d = cellHash(ix + 1, iy + 1, salt);
return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
}
let dX = 0, dY = 0, dH = 0;
function cellDot(sx, sy, C, scroll, prob, salt, m) {
if (prob <= 0) return false;
const yy = sy + Math.floor(scroll);
const cx = Math.floor(sx / C), cy = Math.floor(yy / C);
const h = cellHash(cx, cy, salt);
if (h >= prob) return false;
dH = h / prob;
const span = Math.max(1, C - 2 * m);
dX = sx - (cx * C + m + Math.floor(cellHash(cx, cy, salt + 7) * span));
dY = yy - (cy * C + m + Math.floor(cellHash(cx, cy, salt + 13) * span));
return true;
}
const fc = [0, 0, 0];
const INK = [0.02, 0.02, 0.03], GROUND = [0, 0, 0];
const base = [0, 0, 0], LIGHT = [0, 0, 0], DARK = [0, 0, 0], HI = [0, 0, 0], DEEP = [0, 0, 0];
function mixTo(c, t) {
if (t > 1) t = 1;
fc[0] += (c[0] - fc[0]) * t; fc[1] += (c[1] - fc[1]) * t; fc[2] += (c[2] - fc[2]) * t;
}
const HEART_S = [0b01010, 0b11111, 0b01110, 0b00100]; // 5×4, centre (2, 1)
const HEART_L = [0b0110110, 0b1111111, 0b1111111, 0b0111110, 0b0011100, 0b0001000]; // 7×6, centre (3, 2)
const inMask = (rows, w, x, y) => x >= 0 && x < w && y >= 0 && y < rows.length && ((rows[y] >> (w - 1 - x)) & 1) === 1;
function potionFx(f, o, mask, inv, sx, sy, time, below, edge) {
base[0] = fc[0]; base[1] = fc[1]; base[2] = fc[2];
for (let c = 0; c < 3; c++) {
LIGHT[c] = base[c] + (1 - base[c]) * 0.45;
HI[c] = base[c] + (1 - base[c]) * 0.9;
GROUND[c] = base[c] * 0.8;
DARK[c] = base[c] * 0.62;
DEEP[c] = base[c] * 0.3;
}
for (let m = mask, k = 0; m; m >>>= 1, k++) {
if (!(m & 1)) continue;
const A = Math.min(1.6, Math.sqrt(f[o + k] * inv) * 1.5);
if (A < 0.03) continue;
mixTo(GROUND, A * 0.35);
switch (k) {
case K.vitality: {
const t = (time / 1.2) % 1;
const beat = Math.exp(-Math.pow((t - 0.1) / 0.05, 2)) + 0.6 * Math.exp(-Math.pow((t - 0.3) / 0.05, 2));
const n = vnoise(sx * 0.11, sy * 0.11 - time * 0.4, 101);
if (n > 0.55) mixTo(LIGHT, A * (n - 0.55) * (1.3 + 1.2 * beat));
else if (n < 0.4) mixTo(DARK, A * (0.4 - n) * 1.1);
if (cellDot(sx, sy, 8, time * 5, A * 0.45, 103, 1)) {
const ax = Math.abs(dX), ay = Math.abs(dY);
if (ax + ay === 0) mixTo(HI, 0.9);
else if (ax + ay === 1 && dH > 0.6 && beat > 0.3) mixTo(LIGHT, 0.7);
}
break;
}
case K.strength: {
const wv = sy * 0.09 + Math.sin(sx * 0.075 + time * 0.7) * 0.5 + time * 0.12;
const step = Math.floor((wv - Math.floor(wv)) * 5);
const tone = step === 0 ? HI : step === 1 ? LIGHT : step === 3 ? DARK : step === 4 ? DEEP : null;
if (tone) mixTo(tone, A * (step === 4 ? 0.45 : 0.55));
break;
}
case K.love: {
if (cellDot(sx, sy, 16, time * 3, A * 0.45, 211, 4)) {
const sw = Math.round(Math.sin(time * 1.6 + dH * 9) * 1.5);
if (inMask(HEART_L, 7, dX + 3 - sw, dY + 2)) mixTo(HI, 0.85);
}
if (cellDot(sx, sy, 10, time * 5, A * 0.5, 223, 3)) {
const sw = Math.round(Math.sin(time * 2.2 + dH * 9) * 1);
if (inMask(HEART_S, 5, dX + 2 - sw, dY + 1)) mixTo(LIGHT, 0.85);
}
if (cellDot(sx, sy, 6, time * 4, A * 0.25, 227, 0) && dX === 0 && dY === 0) mixTo(HI, 0.6);
break;
}
case K.arcana: {
mixTo(DARK, A * 0.18);
if (cellDot(sx, sy, 11, time * 0.6, A * 0.75, 307, 4)) {
const tw = 0.5 + 0.5 * Math.sin(time * (1.2 + dH * 1.8) + dH * 40);
const L = Math.round((1 + Math.floor(dH * 3.99)) * (0.3 + 0.7 * tw));
const ax = Math.abs(dX), ay = Math.abs(dY);
if (ax === 0 && ay === 0 && tw > 0.05) mixTo(HI, 0.6 + 0.4 * tw);
else if ((ax === 0 && ay <= L) || (ay === 0 && ax <= L)) mixTo(Math.max(ax, ay) === L ? LIGHT : HI, 0.85);
}
if (cellDot(sx, sy, 5, 0, A * 0.3, 311, 0) && dX === 0 && dY === 0 && Math.sin(time * 3 + dH * 50) > 0) mixTo(LIGHT, 0.7);
break;
}
case K.transformation: {
const ph = (sx + sy) / 14 - time * 0.5;
const fr = ph - Math.floor(ph), band = Math.floor(ph);
const sw = 0.75 + 0.25 * Math.sin(band * 1.7 + time * 1.6);
mixTo(fr < 0.5 ? LIGHT : DARK, A * sw * (fr < 0.08 || (fr > 0.5 && fr < 0.58) ? 0.35 : 0.6));
const along = (sx - sy) / 2 + time * 6;
if (fr > 0.2 && fr < 0.3 && ((Math.floor(along) % 5) + 5) % 5 === 0) mixTo(HI, A * 0.9);
break;
}
case K.fire: {
const n = vnoise(sx * 0.16, sy * 0.06 + time * 1.8, 401) * 0.7 + vnoise(sx * 0.4, sy * 0.15 + time * 4, 403) * 0.3;
const hot = below < 10 ? 0.08 : 0;
if (n + hot > 0.62) mixTo(n + hot > 0.74 ? HI : LIGHT, A * Math.min(1, (n + hot - 0.62) * 5));
else if (n < 0.38) mixTo(DARK, A * (0.38 - n) * 2);
if (cellDot(sx, sy, 9, time * 14, A * 0.4, 409, 2)) {
const cx = Math.round(Math.sin(time * 6 + dH * 20 + dY * 0.9) * 1);
if (dY === 0 && dX === 0) mixTo(HI, 0.95);
else if (dY > 0 && dY <= 2 && dX === cx) mixTo(LIGHT, 0.7);
}
break;
}
case K.frost: {
mixTo(LIGHT, A * (edge ? 0.8 : 0.25));
if (cellDot(sx, sy, 12, -time * 2, A * 0.75, 503, 4)) {
const sw = Math.round(Math.sin(time * 1.1 + dH * 9) * 1.5);
const ax = Math.abs(dX - sw), ay = Math.abs(dY), R = dH > 0.5 ? 3 : 2;
const arm = (ax === 0 || ay === 0 || ax === ay) && Math.max(ax, ay) <= R;
const tip = R === 3 && ((ax === 1 && ay === 3) || (ax === 3 && ay === 1));
if (arm || tip) mixTo(ax + ay === 0 || Math.max(ax, ay) === R ? HI : LIGHT, 0.9);
}
if (cellDot(sx, sy, 6, -time * 3, A * 0.25, 509, 0) && dX === 0 && dY === 0) mixTo(HI, 0.7);
break;
}
case K.acidity: {
if (cellDot(sx, sy, 3, time * 18, A * 0.5, 601, 0) && dX === 0 && dY === 0) mixTo(dH < 0.65 ? HI : DARK, 0.75);
if (cellDot(sx, sy, 4, time * 11, A * 0.35, 603, 0) && dX === 0 && dY === 0) mixTo(LIGHT, 0.6);
if (below <= 1 && cellHash(sx, Math.floor(time * 10), 607) < A * 0.45) mixTo(HI, 0.8);
break;
}
case K.toxicity: {
const n = vnoise(sx * 0.07 + time * 0.12, sy * 0.08 - time * 0.2, 701) * 0.75 + vnoise(sx * 0.2 - time * 0.3, sy * 0.2, 703) * 0.25;
if (n > 0.52) mixTo(DEEP, A * Math.min(0.75, (n - 0.52) * 2.6));
else if (n < 0.35) mixTo(LIGHT, A * (0.35 - n) * 1.8);
if (cellDot(sx, sy, 15, time * 2.2, A * 0.4, 709, 5)) {
const R = 2.3 + dH * 2.2 + Math.sin(time * 3 + dH * 30) * 0.3;
const d = Math.hypot(dX, dY);
if (d < R + 0.5) {
if (d > R - 0.6) mixTo(DEEP, 0.85);
else if (dX < 0 && dY < 0 && d > R * 0.3 && d < R * 0.7) mixTo(HI, 0.85);
else mixTo(DARK, 0.4);
}
}
break;
}
case K.death: {
const wx = vnoise(sx * 0.05 + time * 0.1, sy * 0.05, 801) * 6, wy = vnoise(sx * 0.05, sy * 0.05 - time * 0.12, 803) * 6;
const n = vnoise(sx * 0.06 + wx, sy * 0.06 + wy - time * 0.15, 805);
if (n > 0.5) mixTo(DEEP, A * Math.min(0.85, (n - 0.5) * 2.4));
else if (n < 0.3) mixTo(LIGHT, A * (0.3 - n) * 1.2);
if (cellDot(sx, sy, 8, -time * 3.5, A * 0.4, 809, 1)) {
if (dX === 0 && dY === 0) mixTo(dH < 0.8 ? INK : HI, 0.9);
else if (dH < 0.25 && dX === 1 && dY === 0) mixTo(INK, 0.8);
}
break;
}
}
}
}
return { fc, potionFx };
})();
// src/rendering/brew-palette.js
const __m58 = (() => {
const { MAX_SPECIES } = __m18;
const { srgbToLinear, linearToSrgb } = __m8;
const { PIECE_ART, piecePalette } = __m56;
const { grainSkinOf } = __m19;
const bySpecies = new WeakMap();
const bySkin = new Map();
function paintedSource(def, sim, depth = 0) {
if (!def || depth > 3) return null;
if (grainSkinOf(def, 0)) return def;
if (def.awakened && def.base) return paintedSource(sim.lookup(def.base), sim, depth + 1);
const rules = sim.reactions && sim.reactions.rules;
if (rules) {
for (const r of rules) {
if (r.products && r.products.length === 1 && r.products[0].id === def.id && !r.b) {
const src = paintedSource(sim.lookup(r.a), sim, depth + 1);
if (src) return src;
}
}
}
return null;
}
function dominantColour(cols) {
const lum = (c) => 0.3 * c[0] + 0.55 * c[1] + 0.15 * c[2];
const body = cols.filter((c) => lum(c) > 0.14);
const use = body.length > cols.length * 0.3 ? body : cols;
const BINS = 12, GREY = BINS;
const bin = new Array(BINS + 1).fill(0);
const key = use.map((c) => {
const mx = Math.max(c[0], c[1], c[2]), mn = Math.min(c[0], c[1], c[2]), d = mx - mn;
if (d < 0.08 || d < mx * 0.15) return GREY;
let hue = mx === c[0] ? ((c[1] - c[2]) / d + 6) % 6 : mx === c[1] ? (c[2] - c[0]) / d + 2 : (c[0] - c[1]) / d + 4;
return Math.floor((hue / 6) * BINS + 0.5) % BINS;
});
for (const k of key) bin[k]++;
let best = 0, bestS = -1;
for (let k = 0; k <= BINS; k++) {
const sc = k === GREY ? bin[k] : bin[k] + 0.5 * (bin[(k + 1) % BINS] + bin[(k + BINS - 1) % BINS]);
if (sc > bestS) { bestS = sc; best = k; }
}
const near = (k) => (best === GREY ? k === GREY : k !== GREY && Math.min((k - best + BINS) % BINS, (best - k + BINS) % BINS) <= 1);
const mean = [0, 0, 0];
let n = 0;
for (let i = 0; i < use.length; i++) {
if (!near(key[i])) continue;
for (let c = 0; c < 3; c++) mean[c] += srgbToLinear(use[i][c]);
n++;
}
return mean.map((v) => linearToSrgb(v / Math.max(1, n)));
}
function skinColour(base) {
let got = bySkin.get(base);
if (got !== undefined) return got;
const cols = [];
for (let v = 0; v < 4; v++) {
const pal = piecePalette(base + v);
if (!pal) continue;
for (let i = 0; i < pal.length; i++) { const c = pal[i]; cols.push([(c & 255) / 255, ((c >>> 8) & 255) / 255, ((c >>> 16) & 255) / 255]); }
}
got = cols.length ? dominantColour(cols) : null;
bySkin.set(base, got);
return got;
}
function speciesPalette(def, sim) {
if (!def || typeof def !== 'object') return null;
let got = bySpecies.get(def);
if (got !== undefined) return got;
got = null;
const src = paintedSource(def, sim);
const sk = src ? skinColour(grainSkinOf(src, 0)) : null;
if (sk) {
const dim = src === def || def.awakened ? 1 : 0.85;
const tint = def.tint ?? 1;
got = { abs: sk.map((c) => -Math.log(Math.max(0.003, srgbToLinear(c * dim))) * tint) };
}
bySpecies.set(def, got);
return got;
}
const slots = /** @type {(SpeciesPalette|null)[]} */ (new Array(MAX_SPECIES).fill(null));
const slotDef = new Array(MAX_SPECIES).fill(null);
let any = false;
function preparePalettes(sim) {
if (!PIECE_ART.ready) return false;
const sp = sim.species;
any = false;
for (let s = 0; s < sp.count; s++) {
const d = sp.defs[s];
if (d !== slotDef[s]) { slotDef[s] = d; slots[s] = speciesPalette(d, sim); }
if (slots[s]) any = true;
}
return any;
}
const pc = [0, 0, 0];
function paletteColour(sim, i) {
const p = sim.p, sp = sim.species, comp = p.comp, off = i * MAX_SPECIES;
let tot = 0, aR = 0, aG = 0, aB = 0, pw = 0;
for (let s = 0; s < sp.count; s++) {
const f = comp[off + s];
if (f <= 0) continue;
tot += f;
const pl = slots[s];
if (pl) {
aR += f * pl.abs[0]; aG += f * pl.abs[1]; aB += f * pl.abs[2];
pw += f;
} else {
aR += f * sp.absR[s]; aG += f * sp.absG[s]; aB += f * sp.absB[s];
}
}
if (pw <= 0 || tot <= 1e-6) return false;
const inv = 1 / tot;
pc[0] = Math.min(1, linearToSrgb(Math.exp(-aR * inv)));
pc[1] = Math.min(1, linearToSrgb(Math.exp(-aG * inv)));
pc[2] = Math.min(1, linearToSrgb(Math.exp(-aB * inv)));
return true;
}
return { dominantColour, preparePalettes, pc, paletteColour };
})();
// src/rendering/fluid.js
const __m55 = (() => {
const { PHASE, SIM } = __m24;
const { LOOK, piece } = __m19;
const { PIECE_ART, loadPieceArt, piecePalette } = __m56;
const { PIECE_CELL } = __m20;
const { NE } = __m13;
const { MAX_SPECIES } = __m18;
const { potionFx, fc } = __m57;
const { preparePalettes, paletteColour, pc: palCol } = __m58;
const { LIQUID, POWDER, PASTE, SOLID, GAS } = PHASE;
const LS = 9;
function hash01(n) {
n = Math.imul(n ^ (n >>> 15), 0x2c1b3c6d);
n = Math.imul(n ^ (n >>> 12), 0x297a2d39);
n ^= n >>> 15;
return (n >>> 0) / 4294967296;
}
const em = [0, 0, 0];
const chK = new Int32Array(NE), chV = new Float32Array(NE);
let nc = 0;
function emission(p, i, r, g, b, glow) {
const a = p.auraI[i];
const s = a > 0.002 ? (1 - Math.exp(-Math.pow(a, 1.4) * 6)) * 0.75 : 0;
nc = 0;
if (s > 0) {
const fx = p.auraFx, o = i * NE, k0 = s / a;
for (let k = 0; k < NE; k++) {
const v = fx[o + k];
if (v > 0) { chK[nc] = k; chV[nc] = v * k0; nc++; }
}
}
const gl = glow * 0.42, bu = p.burn[i];
em[0] = gl * (0.45 + r * 0.55) + bu;
em[1] = gl * (0.45 + g * 0.55) + bu * 0.55;
em[2] = gl * (0.45 + b * 0.55) + bu * 0.18;
return s + em[0] + em[1] + em[2];
}
function drawnGlow(p, sp, i, vis) {
if (!vis) return p.glow[i];
const off = i * MAX_SPECIES;
let g = 0, t = 0;
for (let s = 0; s < sp.count; s++) { const f = p.comp[off + s]; if (f > 0) { g += f * vis[s]; t += f; } }
return t > 0 ? g / t : 0;
}
const glowVis = new Float32Array(MAX_SPECIES);
function drawnGlowTable(sim) {
const sp = sim.species;
let vis = null;
for (let s = 0; s < sp.count; s++) {
const d = sp.defs[s];
const base = d && d.awakened && d.base ? sim.lookup(d.base) : null;
glowVis[s] = base ? base.glow || 0 : sp.glow[s];
if (glowVis[s] !== sp.glow[s]) vis = glowVis;
}
return vis;
}
function addMagic(mfx, px, q) {
const o = px * NE;
for (let c = 0; c < nc; c++) mfx[o + chK[c]] += q * chV[c];
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
this.halo = true;
this.haloCanvas = null;
this.haloCtx = null;
this.haloImage = null;
this.hw = 0;
this.hh = 0;
}
_alloc(w, h) {
const n = w * h;
if (n > this.cap) {
this.cap = n;
this.liq = new Float32Array(n * LS);
this.sol = new Float32Array(n * 4);
this.emit = new Float32Array(n * 4); // emitted light r, g, b and kernel weight
this.mfx = new Float32Array(n * NE); // emitted magic, per effect
this.solBest = new Float32Array(n); // strongest solid particle at a pixel…
this.solIdx = new Int32Array(n); // …and its index
this.wl = new Float32Array(n); // liquid weight, contiguous (blur, neighbours)
this.wb = new Float32Array(n); // smoothed liquid weight (surface shape)
this.wt = new Float32Array(n); // blur scratch
this.grain = new Uint32Array(n); // packed grain colour (0 = none)
}
if (w !== this.w || h !== this.h || !this.canvas) {
this.w = w;
this.h = h;
this.canvas = makeCanvas(w, h);
this.ctx = /** @type {any} */ (this.canvas).getContext('2d');
this.image = this.ctx.createImageData(w, h);
const hw = Math.ceil(w / 2), hh = Math.ceil(h / 2);
this.hw = hw; this.hh = hh;
this.haloCanvas = makeCanvas(hw, hh);
this.haloCtx = /** @type {any} */ (this.haloCanvas).getContext('2d');
this.haloImage = this.haloCtx.createImageData(hw, hh);
this.haloAcc = new Float32Array(hw * hh * 3);
this.haloTmp = new Float32Array(hw * hh * 3);
this.gas = new Float32Array(hw * hh * 4); // vapour weight + colour at half resolution
this.mote = new Float32Array(w * h * 4); // vapour droplets: alpha + colour, full resolution
this.gasTmp = new Float32Array(hw * hh * 4);
}
}
render(sim, view, time) {
const p = sim.p, n = p.count;
if (n === 0) return null;
const s = view.scale;
let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
let anySolid = false, anyGas = false, anyGrain = false, anyLight = false, anyGlow = false, fxMask = 0;
for (let i = 0; i < n; i++) {
const x = p.x[i] * s + view.ox, y = p.y[i] * s + view.oy;
if (x < minX) minX = x; if (x > maxX) maxX = x;
if (y < minY) minY = y; if (y > maxY) maxY = y;
const ph = p.phase[i];
if (ph === SOLID) anySolid = true; else if (ph === GAS) anyGas = true; else if (ph === POWDER) anyGrain = true;
if (p.auraI[i] > 0.002 || p.glow[i] > 0.02 || p.burn[i] > 0.02) anyLight = true;
if (p.glow[i] > 0.02 || p.burn[i] > 0.02) anyGlow = true;
if (p.auraI[i] > 0.002) for (let k = 0, o = i * NE; k < NE; k++) if (p.auraFx[o + k] > 0) fxMask |= 1 << k;
}
if (!PIECE_ART.loading) loadPieceArt();
const painted = preparePalettes(sim);
const vis = anyGlow ? drawnGlowTable(sim) : null;
const art = PIECE_ART.ready ? PIECE_ART.px : null, artW = PIECE_ART.width;
const pad = Math.ceil(0.16 * s) + 8;
const bx = Math.floor(minX) - pad, by = Math.floor(minY) - pad;
const w = Math.ceil(maxX) + pad - bx, h = Math.ceil(maxY) + pad - by;
if (w <= 0 || h <= 0 || w * h > 4e6) return null;
this._alloc(w, h);
const N = w * h;
const { liq, sol, gas, grain, emit, mfx, solBest, solIdx } = this;
liq.fill(0, 0, N * LS);
if (anySolid) { sol.fill(0, 0, N * 4); solBest.fill(0, 0, N); }
if (anyGas) { gas.fill(0, 0, this.hw * this.hh * 4); this.mote.fill(0, 0, N * 4); }
if (anyGrain) grain.fill(0, 0, N);
if (anyLight) emit.fill(0, 0, N * 4);
if (fxMask) mfx.fill(0, 0, N * NE);
const rl = 0.092 * s; // liquid kernel radius (px), ~1.85 particle radii
const rs = 0.085 * s; // solid
const rgas = 0.13 * s; // gas, in half-resolution pixels (wide, soft kernel so vapour reads as fog)
const rgrain = Math.max(1.2, 0.05 * s * 1.02);
const RL = Math.ceil(rl), RS = Math.ceil(rs), RG = Math.ceil(rgas);
const colR = sim.colR, colG = sim.colG, colB = sim.colB;
const T = p.temp;
for (let i = 0; i < n; i++) {
const ph = p.phase[i];
const fx = p.x[i] * s + view.ox - bx, fy = p.y[i] * s + view.oy - by;
let r = colR[i], g = colG[i], b = colB[i];
if (painted && p.whole[i] < 0.5 && paletteColour(sim, i)) { r = palCol[0]; g = palCol[1]; b = palCol[2]; }
const seed = p.seed[i];
const lit = anyLight && emission(p, i, r, g, b, drawnGlow(p, sim.species, i, vis)) > 0.004;
const eR = em[0], eG = em[1], eB = em[2];
if (ph === LIQUID || ph === PASTE) {
const isPaste = ph === PASTE ? 1 : 0;
const tex = hash01(seed) * 2 - 1;
const o = Math.max(0.35, p.opacity[i]);
const Ti = T[i];
const slush = p.lat[i] < 0 && p.latF[i] > 0 ? Math.min(1, -p.lat[i] / p.latF[i]) : 0;
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
liq[k + 4] += q * o; liq[k + 5] += q * isPaste; liq[k + 6] += q * tex; liq[k + 7] += q * Ti; liq[k + 8] += q * slush;
if (lit) { const e = (row + xx) * 4; emit[e] += q * eR; emit[e + 1] += q * eG; emit[e + 2] += q * eB; emit[e + 3] += q; if (nc) addMagic(mfx, row + xx, q); }
}
}
} else if (ph === POWDER) {
const frozen = p.gran[i] < 0.5;
const damp = !frozen && p.gran[i] < 0.96 ? Math.min(0.45, (0.97 - p.gran[i]) * 1.6) : 0;
const burnL = p.burn[i] > 0.1 ? 1 + p.burn[i] : 1;
const pc = art && p.skin[i] ? piece(p.skin[i]) : null;
const pal = pc ? piecePalette(p.skin[i]) : null;
const wArt = pc ? Math.max(0, Math.min(1, (p.whole[i] - 0.3) * 2)) : 0;
const rx = Math.round(fx), ry = Math.round(fy);
const chips = 3 + (seed & 1);
for (let c = 0; c < chips + 2; c++) {
const h1 = hash01(seed + c * 7919), h2 = hash01(seed * 3 + c * 104729 + 1), h3 = hash01(seed * 7 + c * 1299709 + 2);
const speck = c >= chips;
const an = h1 * 6.2832;
const dist = speck ? rgrain * (0.85 + 0.45 * h2) : c === 0 ? 0 : Math.sqrt(h2) * rgrain * 0.6;
const rc = speck ? 0.5 : Math.max(0.8, rgrain * (0.36 + 0.2 * h3));
const ccx = fx + Math.cos(an) * dist, ccy = fy + Math.sin(an) * dist;
const lcx = ccx + Math.cos(h3 * 6.2832) * rc * 0.65, lcy = ccy + Math.sin(h3 * 6.2832) * rc * 0.65;
let cr = r, cg = g, cb = b;
if (pc && wArt > 0) {
const u = p.skinU[i] + (ccx - fx) / (s * SIM.SPACING) + (h1 - 0.5) * 0.5, v = p.skinV[i] + (ccy - fy) / (s * SIM.SPACING) + (h3 - 0.5) * 0.5;
const tx = Math.floor(pc.ax + u * pc.ppu), ty = Math.floor(pc.ay + v * pc.ppu);
let t = tx >= pc.cx && ty >= pc.cy && tx < pc.cx + PIECE_CELL && ty < pc.cy + PIECE_CELL ? /** @type {Uint32Array} */ (art)[ty * artW + tx] : 0;
if (!(t >>> 31) && pal) t = pal[Math.floor(h2 * pal.length)];
if (t >>> 31) {
cr = ((t & 255) / 255) * wArt + r * (1 - wArt);
cg = (((t >>> 8) & 255) / 255) * wArt + g * (1 - wArt);
cb = (((t >>> 16) & 255) / 255) * wArt + b * (1 - wArt);
}
} else {
const k = 0.8 + 0.34 * h3;
cr = r * k; cg = g * (k + (h1 - 0.5) * 0.06); cb = b * (k + (h2 - 0.5) * 0.06);
}
const R2 = rc * rc, L2 = R2 * 0.5;
const x0 = Math.max(0, Math.floor(Math.min(ccx, lcx) - rc)), x1 = Math.min(w - 1, Math.ceil(Math.max(ccx, lcx) + rc));
const y0 = Math.max(0, Math.floor(Math.min(ccy, lcy) - rc)), y1 = Math.min(h - 1, Math.ceil(Math.max(ccy, lcy) + rc));
for (let yy = y0; yy <= y1; yy++) {
for (let xx = x0; xx <= x1; xx++) {
const hv = hash01(seed + (xx - rx + 15) * 31 + (yy - ry + 15) * 977 + c * 65537);
const dx = xx + 0.5 - ccx, dy = yy + 0.5 - ccy, ex = xx + 0.5 - lcx, ey = yy + 0.5 - lcy;
const edge = 0.62 + 0.5 * hv;
const inside = speck ? (xx === Math.floor(ccx) && yy === Math.floor(ccy)) : (dx * dx + dy * dy < R2 * edge || ex * ex + ey * ey < L2 * edge);
if (!inside) continue;
let lum = speck ? 0.9 + hv * 0.2 : 1 + 0.24 * Math.max(-1, Math.min(1, -(dx + dy) / (rc * 1.4))) + (hv - 0.5) * 0.12;
if (frozen) lum = 0.95 + hv * 0.12;
lum *= (1 - damp) * burnL;
const R8 = clamp255(cr * lum * 255), G8 = clamp255(cg * lum * 255), B8 = clamp255(cb * lum * 255);
grain[yy * w + xx] = 0xff000000 | (B8 << 16) | (G8 << 8) | R8;
if (lit) { const e = (yy * w + xx) * 4; emit[e] += eR; emit[e + 1] += eG; emit[e + 2] += eB; emit[e + 3] += 1; if (nc) addMagic(mfx, yy * w + xx, 1); }
}
}
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
if (q > solBest[k]) { solBest[k] = q; solIdx[k] = i; }
if (lit) { emit[k4] += q * eR; emit[k4 + 1] += q * eG; emit[k4 + 2] += q * eB; emit[k4 + 3] += q; if (nc) addMagic(mfx, k, q); }
}
}
} else if (ph === GAS) {
const hx = fx * 0.5, hy = fy * 0.5;
const cy = hy | 0;
const inv = 1 / (rgas * rgas), rg2 = rgas * rgas;
const hw = this.hw, hh = this.hh, gas = this.gas;
const gr0 = r * 0.5 + 0.5, gg0 = g * 0.5 + 0.5, gb0 = b * 0.5 + 0.5;
for (let dy = -RG; dy <= RG; dy++) {
const yy = cy + dy;
if (yy < 0 || yy >= hh) continue;
const ddy = yy + 0.5 - hy;
const rem = rg2 - ddy * ddy;
if (rem <= 0) continue;
const half = Math.sqrt(rem);
const x0 = Math.max(0, Math.floor(hx - 0.5 - half)), x1 = Math.min(hw - 1, Math.ceil(hx - 0.5 + half));
for (let xx = x0; xx <= x1; xx++) {
const ddx = xx + 0.5 - hx;
let q = 1 - (ddx * ddx + ddy * ddy) * inv;
if (q <= 0) continue;
q *= q;
const k = (yy * hw + xx) * 4;
gas[k] += q; gas[k + 1] += q * gr0; gas[k + 2] += q * gg0; gas[k + 3] += q * gb0;
}
}
const mote = this.mote, R0 = rgas * 1.7, rise = 0.07 * s;
const mr = r * 0.6 + 0.4, mg = g * 0.6 + 0.4, mb = b * 0.6 + 0.4;
const nm = 5 + (seed & 3);
for (let m = 0; m < nm; m++) {
const h1 = hash01(seed + m * 7919), h2 = hash01(seed * 3 + m * 104729 + 1), h3 = hash01(seed * 7 + m * 1299709 + 2);
const t = time * (0.3 + 0.35 * h2) + h1;
const cyc = Math.floor(t), ph = t - cyc;
const h4 = hash01(seed + m * 31 + cyc * 65537);
const an = h4 * 6.2832, dist = Math.sqrt(hash01(seed * 5 + m * 17 + cyc * 92821)) * R0;
const mx = fx + Math.cos(an) * dist + Math.sin(time * 1.7 + h3 * 6.2832) * 1.2;
const my = fy + Math.sin(an) * dist * 0.8 - ph * rise;
const a = Math.min(1, Math.sin(ph * Math.PI) * 1.4) * (0.55 + 0.45 * h3);
const sz = h2 > 0.78 ? 2 : 1;
const x0 = Math.floor(mx), y0 = Math.floor(my);
for (let yy = y0; yy < y0 + sz; yy++) {
if (yy < 0 || yy >= h) continue;
for (let xx = x0; xx < x0 + sz; xx++) {
if (xx < 0 || xx >= w) continue;
const k = (yy * w + xx) * 4;
mote[k] += a; mote[k + 1] += a * mr; mote[k + 2] += a * mg; mote[k + 3] += a * mb;
}
}
}
if (lit) {
const px = Math.min(h - 1, Math.max(0, fy | 0)) * w + Math.min(w - 1, Math.max(0, fx | 0)), k = px * 4;
emit[k] += eR * 0.35; emit[k + 1] += eG * 0.35; emit[k + 2] += eB * 0.35; emit[k + 3] += 0.35;
if (nc) addMagic(mfx, px, 0.35);
}
}
}
if (anyGas) this._blurGas();
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
if (!this.surfTmp || this.surfTmp.length < w) this.surfTmp = new Int32Array(w);
const top = this.surfTmp;
for (let x = 0; x < w; x++) {
let y = h - 1;
while (y >= 0 && wb[y * w + x] <= thr) y--;
if (y < 0) { top[x] = h; continue; }
for (;;) {
while (y > 0 && wb[(y - 1) * w + x] > thr) y--;
let g = y - 1;
while (g >= 0 && y - g <= 3 && wb[g * w + x] <= thr) g--;
if (g >= 0 && y - g <= 3) y = g; else break;
}
top[x] = y;
}
const SR = Math.max(4, Math.round(0.3 * s));
const win = [];
for (let x = 0; x < w; x++) {
win.length = 0;
for (let xx = Math.max(0, x - SR), xe = Math.min(w - 1, x + SR); xx <= xe; xx++) if (top[xx] < h) win.push(top[xx]);
if (!win.length) { surf[x] = h; continue; }
win.sort((a, b) => a - b);
surf[x] = win[win.length >> 1];
}
const depthScale = 1 / Math.max(6, 0.9 * s);
const thermal = this.thermal;
const twinkle = time * 3.1;
for (let y = 0; y < h; y++) {
const row = y * w;
for (let x = 0; x < w; x++) {
const k = row + x;
let R = 0, G = 0, B = 0, A = 0, fxLiq = false, fxEdge = false;
const gp = anyGrain ? grain[k] : 0;
if (gp) {
R = (gp & 255) / 255; G = ((gp >>> 8) & 255) / 255; B = ((gp >>> 16) & 255) / 255; A = 1;
}
const sw = anySolid ? sol[k * 4] : 0;
if (sw > 0.45) {
const bi = solIdx[k];
const up = y > 0 ? sol[(k - w) * 4] : 0, left = x > 0 ? sol[(k - 1) * 4] : 0, down = y < h - 1 ? sol[(k + w) * 4] : 0, right = x < w - 1 ? sol[(k + 1) * 4] : 0;
const edgeHi = up < 0.45 || left < 0.45, edgeLo = down < 0.45 || right < 0.45;
const inv = 1 / sw;
let r = sol[k * 4 + 1] * inv, g = sol[k * 4 + 2] * inv, b = sol[k * 4 + 3] * inv;
let l = 1, a = 0.97;
if (p.whole[bi] > 0.5) {
const gi = p.group[bi];
const th = gi >= 0 ? sim.rigid.angle[gi] : 0;
const ddx = (x + 0.5 - (p.x[bi] * s + view.ox - bx)) / s, ddy = (y + 0.5 - (p.y[bi] * s + view.oy - by)) / s;
const ct = Math.cos(th), st = Math.sin(th);
const ox = ct * ddx + st * ddy, oy = -st * ddx + ct * ddy;
const lx = p.restX[bi] + ox, ly = p.restY[bi] + oy;
const u = Math.floor(lx * s * 0.75), v = Math.floor(ly * s * 0.75);
const sd = gi >= 0 ? gi * 7919 + 13 : p.seed[bi];
const hv = hash01(sd + (u + 4096) * 37 + (v + 4096) * 1013);
const pc = art && p.skin[bi] ? piece(p.skin[bi]) : null;
if (pc) {
const tx = Math.floor(pc.ax + (p.skinU[bi] + ox / SIM.SPACING) * pc.ppu);
const ty = Math.floor(pc.ay + (p.skinV[bi] + oy / SIM.SPACING) * pc.ppu);
const c = tx >= pc.cx && ty >= pc.cy && tx < pc.cx + PIECE_CELL && ty < pc.cy + PIECE_CELL ? /** @type {Uint32Array} */ (art)[ty * artW + tx] : 0;
if (c >>> 31) {
r = (c & 255) / 255; g = ((c >>> 8) & 255) / 255; b = ((c >>> 16) & 255) / 255;
a = 1;
} else a = 0;
} else switch (p.look[bi]) {
case LOOK.FIBRE: { // fibres along the root, the odd knot
const band = Math.floor(ly * s * 0.55);
l = (band & 1) ? 0.8 + hv * 0.08 : 0.97 + hv * 0.08;
if (hash01(sd + Math.floor(lx * s * 0.25) * 53 + band * 7) < 0.05) l = 0.66;
break;
}
case LOOK.LEAF: { // a bright midrib and paired veins
const av = Math.abs(ly * s);
l = av < 0.7 ? 1.16 : ((Math.floor(Math.abs(lx) * s * 0.5) + Math.floor(av * 0.5)) % 3 === 0 ? 1.06 : 0.9 + hv * 0.06);
break;
}
case LOOK.STONE: l = hv < 0.13 ? 0.7 : hv > 0.93 ? 1.16 : 0.9 + hv * 0.1; break;
case LOOK.CRYSTAL: { // long facets down the prism
const f = Math.floor((ly * 0.9 - lx * 0.35) * s * 0.4);
l = (f % 3 + 3) % 3 === 0 ? 1.14 : (f % 3 + 3) % 3 === 1 ? 0.84 : 0.97;
a = 0.9;
break;
}
case LOOK.CAP: l = (ly < 0 && hv < 0.08) ? 1.45 : ly > 0.05 ? 1.08 : 0.94 + hv * 0.06; break;
case LOOK.GLOSSY: l = Math.abs(lx * 0.7 + ly * 0.7 + 0.06) * s < 0.6 ? 1.3 : 0.92 + hv * 0.06; break;
case LOOK.BONE: l = hv < 0.05 ? 0.8 : Math.abs(ly * s) < 0.6 ? 0.96 : 1.04; break;
case LOOK.FUR: l = 0.78 + hash01(sd + (u + 4096) * 37 + Math.floor(ly * s * 0.4 + 4096) * 1013) * 0.42; break;
case LOOK.LUMP: l = Math.abs(lx * 0.7 + ly * 0.7 + 0.05) * s < 0.6 ? 1.32 : 0.88 + hv * 0.06; a = 0.94; break;
case LOOK.BARK: { // rough plates split by deep, wandering fissures
const col = Math.floor(lx * s * 0.35);
const f = ly * s * 0.4 + hash01(sd + (col + 4096) * 97) * 0.9;
l = f - Math.floor(f) < 0.24 ? 0.58 : 0.9 + hv * 0.14;
break;
}
case LOOK.BERRY: { // round, glossy berries with dark gaps and a bright dot each
const fx = lx * s * 0.4, fy = ly * s * 0.4, dx = fx - Math.round(fx), dy = fy - Math.round(fy);
const r2 = dx * dx + dy * dy;
l = r2 > 0.2 ? 0.55 : dx < -0.08 && dy < -0.08 && r2 < 0.1 ? 1.55 : 1.02 - r2;
break;
}
case LOOK.GILLS: { // fine lamellae fanning out from the stalk
const ang = Math.atan2(ly + 1.5, lx);
l = (Math.floor(ang * 14 / Math.PI + 64) & 1) ? 0.78 : 1.04 + hv * 0.05;
break;
}
case LOOK.SEED: { // diagonal ribs
const rb = Math.floor((lx * 0.8 + ly * 0.6) * s * 0.55);
l = (rb & 1) ? 0.74 : 1.06 + hv * 0.05;
break;
}
case LOOK.SHELL: { // concentric growth rings with a pearly sheen
const ring = Math.floor(Math.hypot(lx, ly - 1.2) * s * 0.45);
l = (ring & 1) ? 0.86 : 1.08;
if (hv > 0.9) { l = 1.35; r = r * 0.7 + 0.3; g = g * 0.7 + 0.28; b = b * 0.7 + 0.32; }
break;
}
case LOOK.METAL: // bands of metallic sheen and the odd bright fleck
l = 0.7 + 0.5 * Math.abs(Math.sin(ly * s * 0.22 + lx * s * 0.05)) + (hv > 0.96 ? 0.35 : 0);
break;
case LOOK.GLASS: { // dark glass with sharp, curving glints
const c = Math.sin((lx * 1.3 + ly * ly * 0.6) * s * 0.3);
l = c > 0.9 ? 1.7 : 0.72 + hv * 0.06;
a = 0.95;
break;
}
case LOOK.SPOTS: { // white warts scattered over the cap
const fx = lx * s * 0.28, fy = ly * s * 0.28, cx = Math.floor(fx), cy = Math.floor(fy);
const dx = fx - cx - 0.5, dy = fy - cy - 0.5;
if (hash01(sd + (cx + 4096) * 131 + (cy + 4096) * 977) < 0.4 && dx * dx + dy * dy < 0.08) { r = 0.95; g = 0.93; b = 0.88; l = 1; }
else l = 0.95 + hv * 0.08;
break;
}
case LOOK.REED: // fine velvet striations along the stem
l = (Math.floor(lx * s * 0.9) & 1 ? 0.86 : 1.0) + hv * 0.08;
break;
case LOOK.FLORET: // a froth of tiny florets
l = hv > 0.72 ? 1.32 : hv < 0.16 ? 0.72 : 0.98;
break;
default: l = 0.92 + hv * 0.1;
}
if (!pc) { if (edgeHi) l *= 1.16; else if (edgeLo) l *= 0.64; }
const dmg = sim.dmg[bi] / (0.25 + p.hardness[bi] * 1.5);
if (dmg > 0.12 && hash01(p.seed[bi] * 3 + (u + 4096) * 7 + (v + 4096) * 131) < dmg * 0.4) l *= 0.42;
} else {
const melt = p.lat[bi] > 0 && p.latF[bi] > 0 ? Math.min(1, p.lat[bi] / p.latF[bi]) : 0;
const frost = 1 - melt * 0.8;
r = r * (1 - 0.45 * frost) + 0.42 * frost; g = g * (1 - 0.45 * frost) + 0.45 * frost; b = b * (1 - 0.45 * frost) + 0.5 * frost;
l = 0.78 + 0.22 * Math.min(1, sw / 1.6);
if (edgeHi) l = 1.18 - 0.2 * melt; else if (edgeLo) l = 0.72;
else if (((x * 7 + y * 13) % 23) === 0) l = 1.12;
a = 0.92 - 0.12 * melt;
}
R = R * (1 - a) + r * l * a; G = G * (1 - a) + g * l * a; B = B * (1 - a) + b * l * a; A = A + (1 - A) * a;
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
let a = Math.min(0.96, 0.7 + 0.3 * opac);
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
const depth = Math.max(0, (y - surf[x]) * depthScale);
const path = Math.min(4.5, 0.75 + depth * (0.9 + 2 * clear));
r = Math.pow(Math.max(0.02, r), path); g = Math.pow(Math.max(0.02, g), path); b = Math.pow(Math.max(0.02, b), path);
l = (1 + tex * 0.07) * (1 - clear * 0.18) * (1 - Math.min(0.3, depth * 0.1));
if (up <= thr) l = 1.32; // meniscus highlight
else if (y > 1 && wb[k - 2 * w] <= thr) l = 1.16; // sheen just under the surface
else if (y > 2 && wb[k - 3 * w] <= thr) l *= 1.07;
if (down <= thr) l *= 0.7;
}
const slush = liq[c9 + 8] * inv;
if (slush > 0.04) {
const f = Math.min(0.75, slush * 0.85);
r = r * (1 - f) + 0.82 * f; g = g * (1 - f) + 0.9 * f; b = b * (1 - f) + 0.98 * f;
if (((x * 5 + y * 3) % 7) === 0 && slush > 0.3) l *= 1.15;
a = Math.max(a, 0.9);
}
const temp = liq[c9 + 7] * inv;
if (thermal) {
const tt = Math.max(0, Math.min(1, (temp + 20) / 140));
r = tt; g = 0.25 + 0.3 * (1 - Math.abs(tt - 0.5) * 2); b = 1 - tt;
a = 0.9;
} else if (temp > 70) {
const hh = Math.min(0.25, (temp - 70) / 400);
r += hh; g += hh * 0.3;
}
r *= l; g *= l; b *= l;
if (fxMask && !thermal) {
fxLiq = true;
fxEdge = up <= thr || down <= thr || (x > 0 && wb[k - 1] <= thr) || (x < w - 1 && wb[k + 1] <= thr);
}
R = R * (1 - a) + r * a; G = G * (1 - a) + g * a; B = B * (1 - a) + b * a;
A = A + (1 - A) * a;
}
if (anyGas) {
const hw = this.hw, hh = this.hh, gas = this.gas;
const gx = Math.max(0, Math.min(hw - 1.001, x * 0.5 - 0.25)), gy = Math.max(0, Math.min(hh - 1.001, y * 0.5 - 0.25));
const ix = gx | 0, iy = gy | 0, tx = gx - ix, ty = gy - iy;
const k00 = (iy * hw + ix) * 4, k10 = k00 + 4, k01 = k00 + hw * 4, k11 = k01 + 4;
const w00 = (1 - tx) * (1 - ty), w10 = tx * (1 - ty), w01 = (1 - tx) * ty, w11 = tx * ty;
const gw = gas[k00] * w00 + gas[k10] * w10 + gas[k01] * w01 + gas[k11] * w11;
if (gw > 0.03) {
const inv = 1 / gw;
const a = Math.min(0.34, 0.4 * (1 - Math.exp(-gw * 0.5)));
const r = (gas[k00 + 1] * w00 + gas[k10 + 1] * w10 + gas[k01 + 1] * w01 + gas[k11 + 1] * w11) * inv;
const g = (gas[k00 + 2] * w00 + gas[k10 + 2] * w10 + gas[k01 + 2] * w01 + gas[k11 + 2] * w11) * inv;
const b = (gas[k00 + 3] * w00 + gas[k10 + 3] * w10 + gas[k01 + 3] * w01 + gas[k11 + 3] * w11) * inv;
R = R * (1 - a) + r * a; G = G * (1 - a) + g * a; B = B * (1 - a) + b * a;
A = A + (1 - A) * a;
}
const mote = this.mote, m4 = k * 4, ma = mote[m4];
if (ma > 0.02) {
const a = Math.min(0.9, ma), inv = 1.12 / ma;
R = R * (1 - a) + mote[m4 + 1] * inv * a; G = G * (1 - a) + mote[m4 + 2] * inv * a; B = B * (1 - a) + mote[m4 + 3] * inv * a;
A = A + (1 - A) * a;
}
}
if (anyGlow && !thermal) {
const e4 = k * 4, ew = emit[e4 + 3];
if (ew > 0.02 && A > 0.05) {
const inv = 1 / Math.max(ew, 0.6);
const sp = ((x * 13 + y * 7) % 31 === 0) ? 1.6 + 0.8 * Math.max(0, Math.sin(twinkle + x * 0.7 + y)) : 1;
const e0 = emit[e4] * inv * sp, e1 = emit[e4 + 1] * inv * sp, e2 = emit[e4 + 2] * inv * sp;
const eM = Math.max(e0, e1, e2);
if (eM > 0.01) {
const t = Math.min(0.6, eM * 0.7), lum = Math.max(R, G, B) / eM;
R += (e0 * lum - R) * t; G += (e1 * lum - G) * t; B += (e2 * lum - B) * t;
}
const er = Math.min(1, e0 * 0.6), eg = Math.min(1, e1 * 0.6), eb = Math.min(1, e2 * 0.6);
R = 1 - (1 - R) * (1 - er); G = 1 - (1 - G) * (1 - eg); B = 1 - (1 - B) * (1 - eb);
}
}
if (fxLiq) {
const ew = emit[k * 4 + 3];
if (ew > 0.02 && A > 0.05) {
const ia = 1 / A;
fc[0] = R * ia; fc[1] = G * ia; fc[2] = B * ia;
potionFx(mfx, k * NE, fxMask, 1 / Math.max(ew, 0.6), x + bx, y + by, time, y - surf[x], fxEdge);
R = fc[0] * A; G = fc[1] * A; B = fc[2] * A;
}
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
const halo = anyGlow && this.halo && !thermal ? this._halo(w, h) : null;
return { canvas: this.canvas, x: bx, y: by, halo };
}
_blurGas() {
const hw = this.hw, hh = this.hh, a = this.gas, t = this.gasTmp;
for (let y = 0; y < hh; y++) {
for (let x = 0; x < hw; x++) {
let s0 = 0, s1 = 0, s2 = 0, s3 = 0;
for (let d = -2; d <= 2; d++) {
const xx = x + d;
if (xx < 0 || xx >= hw) continue;
const k = (y * hw + xx) * 4;
s0 += a[k]; s1 += a[k + 1]; s2 += a[k + 2]; s3 += a[k + 3];
}
const o = (y * hw + x) * 4;
t[o] = s0 * 0.2; t[o + 1] = s1 * 0.2; t[o + 2] = s2 * 0.2; t[o + 3] = s3 * 0.2;
}
}
for (let y = 0; y < hh; y++) {
for (let x = 0; x < hw; x++) {
let s0 = 0, s1 = 0, s2 = 0, s3 = 0;
for (let d = -2; d <= 2; d++) {
const yy = y + d;
if (yy < 0 || yy >= hh) continue;
const k = (yy * hw + x) * 4;
s0 += t[k]; s1 += t[k + 1]; s2 += t[k + 2]; s3 += t[k + 3];
}
const o = (y * hw + x) * 4;
a[o] = s0 * 0.2; a[o + 1] = s1 * 0.2; a[o + 2] = s2 * 0.2; a[o + 3] = s3 * 0.2;
}
}
}
_halo(w, h) {
const hw = this.hw, hh = this.hh, acc = this.haloAcc, tmp = this.haloTmp, emit = this.emit;
acc.fill(0, 0, hw * hh * 3);
for (let y = 0; y < h; y++) {
const hy = (y >> 1) * hw;
for (let x = 0; x < w; x++) {
const e4 = (y * w + x) * 4;
if (emit[e4 + 3] <= 0.01) continue;
const k = (hy + (x >> 1)) * 3;
acc[k] += emit[e4]; acc[k + 1] += emit[e4 + 1]; acc[k + 2] += emit[e4 + 2];
}
}
for (let pass = 0; pass < 2; pass++) {
blur5(acc, tmp, hw, hh, 3, 1, hw);
blur5(tmp, acc, hw, hh, 3, hw, 1);
}
const d = this.haloImage.data;
for (let k = 0, o = 0; k < hw * hh; k++, o += 4) {
const a = k * 3;
d[o] = clamp255(Math.round(acc[a] * 0.09 * 16) * 16);
d[o + 1] = clamp255(Math.round(acc[a + 1] * 0.09 * 16) * 16);
d[o + 2] = clamp255(Math.round(acc[a + 2] * 0.09 * 16) * 16);
d[o + 3] = 255;
}
this.haloCtx.putImageData(this.haloImage, 0, 0);
return this.haloCanvas;
}
}
function blur5(src, dst, hw, hh, C, step, cross) {
const n = step === 1 ? hw : hh, lines = step === 1 ? hh : hw;
for (let l = 0; l < lines; l++) {
const base = l * cross;
for (let i = 0; i < n; i++) {
const o = (base + i * step) * C;
for (let c = 0; c < C; c++) {
let v = 0;
for (let dd = -2; dd <= 2; dd++) {
const j = i + dd;
if (j < 0 || j >= n) continue;
v += src[(base + j * step) * C + c];
}
dst[o + c] = v * 0.2;
}
}
}
}
function makeCanvas(w, h) {
if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
const c = document.createElement('canvas');
c.width = w;
c.height = h;
return c;
}
function clamp255(v) {
return v < 0 ? 0 : v > 255 ? 255 : v | 0;
}
return { drawnGlow, drawnGlowTable, FluidRenderer };
})();
// src/rendering/effects.js
const __m59 = (() => {
const { PAL, hex2rgb } = __m54;
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
const __m53 = (() => {
const { PAL, paintBackground, renderCauldron, renderLid, renderLidAside, paintHearth, makeCanvas, rgbStr, hex2rgb, drawJar, rect } = __m54;
const { FluidRenderer, drawnGlow, drawnGlowTable } = __m55;
const { Effects } = __m59;
const { COLUMN } = __m34;
const { PHASE } = __m24;
const { compositionEffects, dominantEffect, EFFECTS, NE } = __m13;
const auraScratch = new Float64Array(NE);
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
this.lidArt = null;
this.lidAsideArt = null;
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
const viewTop = VIEW_TOP, viewBot = c.depth + 0.7;
const viewH = viewBot - viewTop;
const s = Math.min(W / viewW, H / viewH);
this.view = { scale: s, ox: Math.round(W / 2), oy: Math.round((H - viewH * s) / 2 - viewTop * s) };
this.jars = jars;
this.bg = makeCanvas(W, H);
const bctx = this.bg.getContext('2d');
bctx.imageSmoothingEnabled = false;
const floorY = Math.round(this.view.oy + (c.depth + 0.42) * s);
paintBackground(bctx, W, H, { cx: this.view.ox, floorY, scale: s, half: (c.belly + 0.6) * s, top: this.view.oy - 0.25 * s, jars });
paintHearth(bctx, c, this.view);
this.cauldronArt = renderCauldron(c, this.view);
this.lidArt = renderLid(c, this.view);
this.lidAsideArt = renderLidAside(c, this.view);
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
const fireX = view.ox, fireY = Math.round(view.oy + (c.depth + 0.22) * s);
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
this.fluid.halo = this.quality !== 'low';
const fr = this.fluid.render(sim, view, st.time);
if (fr) {
ctx.drawImage(fr.canvas, fr.x, fr.y);
if (fr.halo) {
ctx.globalCompositeOperation = 'lighter';
ctx.drawImage(fr.halo, fr.x, fr.y, fr.halo.width * 2, fr.halo.height * 2);
ctx.globalCompositeOperation = 'source-over';
}
}
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
if (st.aura && this.quality !== 'low' && p.count) {
const tries = this.quality === 'high' ? 4 : 2;
for (let k = 0; k < tries; k++) {
const i = Math.floor(this.fx.rand() * p.count);
if (p.phase[i] === PHASE.GAS || p.phase[i] === PHASE.SOLID) continue;
compositionEffects(sim.species, p.comp, i * p.S, p.temp[i], sim.laws || [], auraScratch);
const d = dominantEffect(auraScratch, 4);
if (d < 0 || this.fx.rand() > 0.35) continue;
const [ax, ay] = this.toScreen(p.x[i], p.y[i]);
const col = EFFECTS[d].color;
this.fx.add(4, ax, ay - 1, 0, -s * 0.15, 0.6, 1, [col[0] * 255, col[1] * 255, col[2] * 255]);
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
if (c.lidClosed) {
const la = this.lidArt;
ctx.drawImage(la.canvas, la.x, la.y);
const wx = st.pour && st.pour.active ? st.pour.x : 0.6;
const px = Math.round(view.ox + wx * s);
const fw = Math.max(4, Math.round(0.22 * s)), fh = Math.max(2, Math.round(0.1 * s));
const y = la.topY(wx) + 1;
rect(ctx, px - fw / 2 - 1, y - fh - Math.round(0.06 * s) - 1, fw + 2, fh + 2, '#08070a');
rect(ctx, px - fw / 4, y - Math.round(0.06 * s), fw / 2, Math.round(0.06 * s) + 1, PAL.copper2);
rect(ctx, px - fw / 2, y - fh - Math.round(0.06 * s), fw, fh, PAL.brass);
rect(ctx, px - fw / 2, y - fh - Math.round(0.06 * s), fw, 1, PAL.brassHi);
rect(ctx, px + fw / 2 - 1, y - fh - Math.round(0.06 * s), 1, fh, PAL.copper2);
} else {
const la = this.lidAsideArt;
ctx.drawImage(la.canvas, la.x, la.y);
}
}
_drawTap(c, st) {
const { ctx, view } = this;
const s = view.scale;
const tx = Math.round(view.ox + (c.halfWidth(c.depth - 0.62) + 0.16) * s);
const ty = Math.round(view.oy + (c.depth - 0.62) * s);
const tw = Math.max(4, Math.round(0.25 * s)), th = Math.max(2, Math.round(0.07 * s));
rect(ctx, tx, ty, tw, th, PAL.brass);
rect(ctx, tx, ty, tw, 1, PAL.brassHi);
rect(ctx, tx + tw - th, ty + th, th, th * 2, PAL.copper2);
rect(ctx, tx + Math.round(tw / 3), ty - th, th, th, PAL.copper3); // valve handle
const b = st.bottling;
const bw = Math.max(6, Math.round(0.34 * s)), bh = Math.max(9, Math.round(0.55 * s));
const bx = tx + tw - th / 2 - bw / 2, by = Math.round(view.oy + (c.depth + 0.25) * s) - bh;
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
const g = ctx.createRadialGradient(view.ox, view.oy + (c.depth + 0.3) * s, 0, view.ox, view.oy + (c.depth + 0.3) * s, s * 2.6);
g.addColorStop(0, `rgba(255,120,40,${0.32 * setting * flick})`);
g.addColorStop(1, 'rgba(255,120,40,0)');
ctx.fillStyle = g;
ctx.fillRect(0, 0, this.W, this.H);
} else if (setting < -0.02) {
const g = ctx.createRadialGradient(view.ox, view.oy + (c.depth + 0.3) * s, 0, view.ox, view.oy + (c.depth + 0.3) * s, s * 2.2);
g.addColorStop(0, `rgba(90,170,255,${0.22 * -setting})`);
g.addColorStop(1, 'rgba(90,170,255,0)');
ctx.fillStyle = g;
ctx.fillRect(0, 0, this.W, this.H);
}
const p = st.sim.p, vis = drawnGlowTable(st.sim);
let glow = 0, gr = 0, gg = 0, gb = 0;
const step = Math.max(1, Math.floor(p.count / 300));
for (let i = 0; i < p.count; i += step) {
const gl = drawnGlow(p, st.sim.species, i, vis);
const e = gl * 0.6 + p.burn[i] * 1.5;
if (e > 0.05) {
glow += e;
gr += st.sim.colR[i] * gl * 0.6 + p.burn[i] * 1.5;
gg += st.sim.colG[i] * gl * 0.6 + p.burn[i] * 0.8;
gb += st.sim.colB[i] * gl * 0.6 + p.burn[i] * 0.3;
}
}
if (glow > 0.5) {
const a = Math.min(0.35, glow * step * 0.002);
const col = `${Math.round(Math.min(1, gr / glow) * 255)},${Math.round(Math.min(1, gg / glow) * 255)},${Math.round(Math.min(1, gb / glow) * 255)}`;
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
case 'awaken': this.fx.burst(4, x, y, 18, s * 0.9, [235, 215, 255], 1.2); break;
case 'crack': this.fx.burst(3, x, y, 6, s * 0.45, [225, 215, 200], 0.6); break;
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
const __m60 = (() => {
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
// src/rendering/wilds-atlas.js
const __m62 = (() => {
const ATLASES = {
forest: {
url: 'assets/wilds/forest.png',
size: [256, 396],
frames: {
bush_flowers: [0, 328, 24, 19],
bush_round: [197, 302, 24, 20],
bush_small: [222, 302, 19, 20],
distant: [0, 241, 256, 30],
emberbark_depleted: [25, 328, 30, 19],
emberbark_hover: [56, 328, 30, 19],
emberbark_icon: [0, 302, 32, 25],
emberbark_idle: [87, 328, 30, 19],
fern: [165, 302, 31, 21],
fern_small: [126, 368, 18, 16],
glint_0: [55, 387, 3, 3],
glint_1: [45, 387, 4, 4],
glint_2: [59, 387, 3, 3],
glint_3: [50, 387, 4, 4],
ironroot_depleted: [145, 368, 32, 16],
ironroot_hover: [178, 368, 32, 16],
ironroot_icon: [33, 302, 32, 25],
ironroot_idle: [211, 368, 32, 16],
leaves_1: [0, 387, 12, 9],
leaves_2: [25, 387, 19, 7],
log: [118, 328, 39, 19],
mandrake_depleted: [158, 328, 32, 19],
mandrake_hover: [191, 328, 32, 19],
mandrake_icon: [0, 272, 32, 29],
mandrake_idle: [224, 328, 32, 19],
mid: [0, 200, 256, 40],
near: [0, 105, 256, 47],
nightshade_closed: [66, 272, 32, 26],
nightshade_closed_hover: [99, 272, 32, 26],
nightshade_depleted: [132, 272, 32, 26],
nightshade_hover: [165, 272, 32, 26],
nightshade_icon: [99, 302, 32, 24],
nightshade_idle: [198, 272, 32, 26],
oak_small: [154, 0, 55, 59],
oaks: [0, 0, 153, 104],
owlberry_depleted: [0, 348, 32, 19],
owlberry_hover: [33, 348, 32, 19],
owlberry_icon: [33, 272, 32, 27],
owlberry_idle: [66, 348, 32, 19],
silverleaf_depleted: [99, 348, 32, 18],
silverleaf_hover: [132, 348, 32, 18],
silverleaf_icon: [132, 302, 32, 22],
silverleaf_idle: [165, 348, 32, 18],
sky: [0, 153, 256, 46],
snag: [244, 368, 11, 15],
sticks: [13, 387, 11, 8],
stones: [60, 368, 43, 17],
stump: [104, 368, 21, 17],
witchear_depleted: [198, 348, 29, 18],
witchear_hover: [0, 368, 29, 18],
witchear_icon: [66, 302, 32, 25],
witchear_idle: [30, 368, 29, 18],
},
},
river: {
url: 'assets/wilds/river.png',
size: [256, 435],
frames: {
bank: [96, 382, 150, 20],
bogbean_depleted: [31, 335, 32, 22],
bogbean_hover: [64, 335, 32, 22],
bogbean_icon: [0, 240, 29, 32],
bogbean_idle: [97, 335, 32, 22],
branch: [226, 404, 23, 12],
bush_plain: [130, 335, 27, 22],
buttercups: [11, 425, 8, 9],
frostcap_depleted: [192, 304, 30, 23],
frostcap_hover: [223, 304, 30, 23],
frostcap_icon: [30, 240, 26, 32],
frostcap_idle: [0, 335, 30, 23],
glint_0: [51, 425, 3, 3],
glint_1: [41, 425, 4, 4],
glint_2: [55, 425, 3, 3],
glint_3: [46, 425, 4, 4],
grass_1: [0, 425, 10, 10],
grass_2: [20, 425, 12, 9],
mountains: [0, 273, 256, 30],
pebble: [33, 425, 7, 6],
pines: [0, 202, 256, 37],
post: [247, 382, 9, 20],
reedmace_depleted: [33, 304, 30, 26],
reedmace_hover: [64, 304, 30, 26],
reedmace_icon: [57, 240, 18, 32],
reedmace_idle: [95, 304, 30, 26],
riverchalk_depleted: [108, 404, 31, 19],
riverchalk_hover: [140, 404, 31, 19],
riverchalk_icon: [126, 304, 32, 24],
riverchalk_idle: [172, 404, 31, 19],
riverpearl_depleted: [0, 382, 31, 21],
riverpearl_hover: [32, 382, 31, 21],
riverpearl_icon: [159, 304, 32, 24],
riverpearl_idle: [64, 382, 31, 21],
sign: [0, 404, 11, 20],
sky: [0, 97, 256, 58],
stump: [204, 404, 21, 16],
water: [0, 359, 256, 22],
willow_great: [0, 0, 79, 96],
willow_second: [80, 0, 71, 87],
willow_small: [0, 156, 37, 45],
willowbark_depleted: [12, 404, 31, 20],
willowbark_hover: [44, 404, 31, 20],
willowbark_icon: [0, 304, 32, 30],
willowbark_idle: [76, 404, 31, 20],
},
},
quarry: {
url: 'assets/wilds/quarry.png',
size: [256, 393],
frames: {
blocks: [206, 321, 30, 17],
brush_small: [198, 377, 11, 9],
cart: [105, 287, 34, 26],
cinnabar_depleted: [198, 342, 32, 16],
cinnabar_hover: [0, 360, 32, 16],
cinnabar_icon: [188, 287, 32, 23],
cinnabar_idle: [33, 360, 32, 16],
crane: [0, 0, 54, 72],
crate: [153, 377, 11, 11],
crate_small: [210, 377, 9, 8],
dirt_heap: [165, 377, 17, 11],
emberflint_depleted: [0, 342, 32, 17],
emberflint_hover: [33, 342, 32, 17],
emberflint_icon: [22, 287, 30, 32],
emberflint_idle: [66, 342, 32, 17],
far_cliffs: [0, 243, 256, 43],
frame: [0, 192, 48, 50],
glint_0: [230, 377, 3, 3],
glint_1: [220, 377, 4, 4],
glint_2: [234, 377, 3, 3],
glint_3: [225, 377, 4, 4],
ladder: [0, 287, 21, 33],
lodestone_depleted: [66, 360, 31, 16],
lodestone_hover: [98, 360, 31, 16],
lodestone_icon: [155, 287, 32, 25],
lodestone_idle: [130, 360, 31, 16],
mica_depleted: [99, 342, 32, 17],
mica_hover: [132, 342, 32, 17],
mica_icon: [0, 321, 32, 20],
mica_idle: [165, 342, 32, 17],
near_cliffs: [0, 73, 256, 61],
pebbles: [183, 377, 14, 10],
rail_fence: [128, 377, 24, 15],
saltpetre_depleted: [162, 360, 31, 16],
saltpetre_hover: [194, 360, 31, 16],
saltpetre_icon: [221, 287, 32, 22],
saltpetre_idle: [0, 377, 31, 16],
scaffold: [53, 287, 18, 29],
shrub_green: [33, 321, 20, 20],
sky: [0, 135, 256, 56],
stone_block: [87, 321, 22, 18],
stone_pillar: [140, 287, 14, 26],
stormglass_depleted: [32, 377, 31, 16],
stormglass_hover: [64, 377, 31, 16],
stormglass_icon: [54, 321, 32, 19],
stormglass_idle: [96, 377, 31, 16],
sulfur_depleted: [110, 321, 31, 18],
sulfur_hover: [142, 321, 31, 18],
sulfur_icon: [72, 287, 32, 27],
sulfur_idle: [174, 321, 31, 18],
},
},
moonfen: {
url: 'assets/wilds/moonfen.png',
size: [256, 423],
frames: {
cattails: [114, 197, 24, 29],
dead_tree: [126, 0, 37, 58],
fiddleheads: [50, 405, 10, 13],
ghost_stumps: [61, 405, 25, 11],
glint_0: [155, 405, 3, 3],
glint_1: [145, 405, 4, 4],
glint_2: [159, 405, 3, 3],
glint_3: [150, 405, 4, 4],
grass_2: [99, 405, 9, 9],
grass_3: [109, 405, 8, 7],
gravemoss_closed: [160, 288, 32, 24],
gravemoss_closed_hover: [193, 288, 32, 24],
gravemoss_depleted: [0, 315, 32, 24],
gravemoss_hover: [33, 315, 32, 24],
gravemoss_icon: [66, 315, 32, 24],
gravemoss_idle: [99, 315, 32, 24],
hills: [0, 230, 256, 28],
mist: [0, 386, 256, 18],
moonlily_closed: [132, 315, 32, 24],
moonlily_closed_hover: [165, 315, 32, 24],
moonlily_depleted: [198, 315, 32, 24],
moonlily_hover: [0, 340, 32, 24],
moonlily_icon: [0, 197, 31, 32],
moonlily_idle: [33, 340, 32, 24],
night_flowers: [87, 405, 11, 11],
pad: [137, 405, 7, 5],
rock_big: [0, 405, 29, 18],
rock_mid: [30, 405, 19, 14],
rock_small: [118, 405, 9, 7],
sirenreed_closed: [0, 259, 32, 28],
sirenreed_closed_hover: [33, 259, 32, 28],
sirenreed_depleted: [66, 259, 32, 28],
sirenreed_hover: [99, 259, 32, 28],
sirenreed_icon: [32, 197, 29, 32],
sirenreed_idle: [132, 259, 32, 28],
sky: [0, 100, 256, 50],
starquartz_depleted: [165, 259, 31, 26],
starquartz_hover: [197, 259, 31, 26],
starquartz_icon: [62, 197, 27, 32],
starquartz_idle: [0, 288, 31, 26],
stone_flat: [128, 405, 8, 6],
stump_drowned: [66, 340, 29, 20],
stump_glowing: [32, 288, 28, 26],
toadstool_depleted: [96, 340, 32, 20],
toadstool_hover: [129, 340, 32, 20],
toadstool_icon: [139, 197, 32, 29],
toadstool_idle: [162, 340, 32, 20],
treeline: [0, 151, 256, 45],
trunk: [195, 340, 42, 20],
water: [0, 365, 96, 20],
water_2: [97, 365, 112, 20],
willow_center: [79, 0, 46, 85],
willow_left: [0, 0, 78, 99],
willow_small: [164, 0, 39, 51],
wisplichen_depleted: [61, 288, 32, 26],
wisplichen_hover: [94, 288, 32, 26],
wisplichen_icon: [90, 197, 23, 32],
wisplichen_idle: [127, 288, 32, 26],
},
},
crags: {
url: 'assets/wilds/crags.png',
size: [256, 285],
frames: {
ashbloom_depleted: [189, 169, 31, 25],
ashbloom_hover: [221, 169, 31, 25],
ashbloom_icon: [143, 65, 27, 32],
ashbloom_idle: [0, 196, 31, 25],
cinderscale_depleted: [0, 247, 31, 23],
cinderscale_hover: [32, 247, 31, 23],
cinderscale_icon: [171, 65, 27, 32],
cinderscale_idle: [64, 247, 31, 23],
crag_large: [0, 65, 56, 43],
crag_medium: [0, 109, 31, 31],
crag_small: [96, 247, 23, 23],
crag_tall: [57, 65, 43, 41],
dead_brush: [32, 196, 22, 25],
dragonpepper_depleted: [0, 169, 32, 26],
dragonpepper_hover: [33, 169, 32, 26],
dragonpepper_icon: [199, 65, 26, 32],
dragonpepper_idle: [66, 169, 32, 26],
ember_brush: [11, 271, 12, 11],
ember_brush_small: [0, 271, 10, 14],
fissures: [0, 222, 256, 24],
glint_0: [82, 271, 3, 3],
glint_1: [72, 271, 4, 4],
glint_2: [86, 271, 3, 3],
glint_3: [77, 271, 4, 4],
gusher: [101, 65, 41, 34],
lava_pan: [51, 271, 20, 8],
lava_pool: [156, 247, 47, 18],
obsidian_depleted: [99, 169, 29, 26],
obsidian_hover: [129, 169, 29, 26],
obsidian_icon: [226, 65, 29, 32],
obsidian_idle: [159, 169, 29, 26],
ridges: [0, 141, 256, 27],
rock_1: [24, 271, 14, 9],
rock_3: [39, 271, 11, 9],
rock_mound: [120, 247, 35, 23],
sky: [0, 0, 256, 64],
vent: [204, 247, 44, 16],
},
},
};
return { ATLASES };
})();
// src/rendering/meadow-atlas.js
const __m63 = (() => {
const ATLAS_URL = 'assets/meadow/atlas.png';
const ATLAS_SIZE = [256, 473];
const FRAMES = {
beebalm_depleted: [123, 164, 27, 31],
beebalm_hover: [151, 164, 27, 31],
beebalm_icon: [0, 164, 20, 32],
beebalm_idle: [179, 164, 27, 31],
bird_1: [134, 463, 6, 3],
bird_3: [117, 463, 6, 4],
bush_dark: [103, 379, 28, 21],
bush_low: [113, 426, 30, 17],
bush_pink: [66, 350, 30, 26],
bush_round: [27, 379, 34, 23],
bush_white: [0, 379, 26, 24],
cloud_1: [144, 426, 44, 17],
cloud_2: [13, 463, 22, 9],
cloud_3: [214, 426, 32, 15],
cloud_5: [181, 447, 26, 10],
cloud_6: [66, 447, 46, 13],
cloud_8: [208, 447, 30, 10],
dreamclover_closed: [97, 350, 26, 26],
dreamclover_closed_hover: [124, 350, 26, 26],
dreamclover_depleted: [151, 350, 26, 26],
dreamclover_hover: [178, 350, 26, 26],
dreamclover_icon: [21, 164, 23, 32],
dreamclover_idle: [205, 350, 26, 26],
far_mountains: [0, 404, 256, 21],
fence: [0, 426, 112, 20],
flowers_buttercups: [36, 463, 11, 9],
flowers_daisies: [141, 447, 13, 11],
flowers_daisy_clump: [48, 463, 10, 8],
flowers_mixed: [126, 447, 14, 12],
flowers_pink_clump: [73, 463, 13, 7],
flowers_pinks: [155, 447, 11, 11],
flowers_posies: [59, 463, 13, 8],
flowers_yellows: [113, 447, 12, 13],
glint_0: [141, 463, 3, 3],
glint_1: [124, 463, 4, 4],
glint_2: [145, 463, 3, 3],
glint_3: [129, 463, 4, 4],
grass_1: [189, 426, 24, 17],
grass_2: [167, 447, 13, 11],
grass_3: [239, 447, 12, 10],
grass_4: [0, 463, 12, 10],
grass_5: [87, 463, 7, 7],
grass_6: [95, 463, 8, 7],
grass_7: [104, 463, 5, 6],
grass_8: [110, 463, 6, 6],
grass_near: [0, 260, 42, 29],
heartpetal_depleted: [93, 320, 28, 28],
heartpetal_hover: [122, 320, 28, 28],
heartpetal_icon: [45, 164, 25, 32],
heartpetal_idle: [151, 320, 28, 28],
hemlock_closed: [207, 164, 26, 31],
hemlock_closed_hover: [0, 197, 26, 31],
hemlock_depleted: [27, 197, 26, 31],
hemlock_hover: [54, 197, 26, 31],
hemlock_icon: [180, 320, 32, 28],
hemlock_idle: [81, 197, 26, 31],
near_mountains: [0, 290, 256, 29],
nettle_depleted: [0, 320, 30, 29],
nettle_hover: [31, 320, 30, 29],
nettle_icon: [71, 164, 26, 32],
nettle_idle: [62, 320, 30, 29],
oak: [0, 0, 77, 84],
rock_big: [62, 379, 40, 22],
rock_mossy: [0, 447, 34, 15],
rock_pair: [35, 447, 30, 15],
sky: [0, 85, 256, 78],
sunthistle_depleted: [213, 320, 32, 28],
sunthistle_hover: [0, 350, 32, 28],
sunthistle_icon: [98, 164, 24, 32],
sunthistle_idle: [33, 350, 32, 28],
treeline: [0, 229, 256, 30],
};
return { ATLAS_URL, ATLAS_SIZE, FRAMES };
})();
// src/rendering/growth-atlas.js
const __m64 = (() => {
const ATLAS_URL = 'assets/growth/atlas.png';
const RES = 2;
const ATLAS_SIZE = [512, 542];
const FRAMES = {
ashbloom_mature: [208, 0, 50, 44],
ashbloom_mature_hover: [260, 0, 50, 44],
ashbloom_ripe: [312, 0, 50, 44],
ashbloom_sprout: [364, 0, 50, 44],
beebalm_mature: [356, 48, 38, 38],
beebalm_mature_hover: [396, 48, 38, 38],
beebalm_ripe: [436, 48, 38, 38],
beebalm_sprout: [0, 90, 38, 38],
bogbean_mature: [442, 170, 46, 34],
bogbean_mature_hover: [0, 208, 46, 34],
bogbean_ripe: [48, 208, 46, 34],
bogbean_sprout: [96, 208, 46, 34],
cinderscale_mature: [42, 130, 50, 36],
cinderscale_mature_hover: [94, 130, 50, 36],
cinderscale_ripe: [146, 130, 50, 36],
cinderscale_sprout: [198, 130, 50, 36],
cinnabar_mature: [200, 280, 50, 32],
cinnabar_mature_hover: [252, 280, 50, 32],
cinnabar_ripe: [304, 280, 50, 32],
cinnabar_sprout: [356, 280, 50, 32],
dragonpepper_mature: [416, 0, 50, 40],
dragonpepper_mature_hover: [0, 48, 50, 40],
dragonpepper_ripe: [52, 48, 50, 40],
dragonpepper_sprout: [104, 48, 50, 40],
dreamclover_mature: [40, 90, 40, 38],
dreamclover_mature_hover: [82, 90, 40, 38],
dreamclover_ripe: [124, 90, 40, 38],
dreamclover_sprout: [166, 90, 40, 38],
emberbark_mature: [408, 280, 50, 32],
emberbark_mature_hover: [460, 280, 50, 32],
emberbark_ripe: [0, 316, 50, 32],
emberbark_sprout: [52, 316, 50, 32],
emberflint_mature: [104, 316, 50, 32],
emberflint_mature_hover: [156, 316, 50, 32],
emberflint_ripe: [208, 316, 50, 32],
emberflint_sprout: [260, 316, 50, 32],
frostcap_mature: [144, 208, 48, 34],
frostcap_mature_hover: [194, 208, 48, 34],
frostcap_ripe: [244, 208, 48, 34],
frostcap_sprout: [294, 208, 48, 34],
gravemoss_mature: [100, 418, 46, 30],
gravemoss_mature_hover: [148, 418, 46, 30],
gravemoss_ripe: [196, 418, 46, 30],
gravemoss_sprout: [244, 418, 46, 30],
heartpetal_mature: [208, 90, 40, 38],
heartpetal_mature_hover: [250, 90, 40, 38],
heartpetal_ripe: [292, 90, 40, 38],
heartpetal_sprout: [334, 90, 40, 38],
hemlock_mature: [250, 130, 32, 36],
hemlock_mature_hover: [284, 130, 32, 36],
hemlock_ripe: [318, 130, 32, 36],
hemlock_sprout: [352, 130, 32, 36],
ironroot_mature: [312, 316, 50, 32],
ironroot_mature_hover: [364, 316, 50, 32],
ironroot_ripe: [416, 316, 50, 32],
ironroot_sprout: [0, 350, 50, 32],
lodestone_mature: [292, 418, 48, 30],
lodestone_mature_hover: [342, 418, 48, 30],
lodestone_ripe: [392, 418, 48, 30],
lodestone_sprout: [442, 418, 48, 30],
mandrake_mature: [344, 208, 50, 34],
mandrake_mature_hover: [396, 208, 50, 34],
mandrake_ripe: [448, 208, 50, 34],
mandrake_sprout: [0, 244, 50, 34],
mica_mature: [80, 484, 48, 28],
mica_mature_hover: [130, 484, 48, 28],
mica_ripe: [180, 484, 48, 28],
mica_sprout: [230, 484, 48, 28],
moonlily_mature: [280, 484, 46, 28],
moonlily_mature_hover: [328, 484, 46, 28],
moonlily_ripe: [376, 484, 46, 28],
moonlily_sprout: [424, 484, 46, 28],
nettle_mature: [376, 90, 40, 38],
nettle_mature_hover: [418, 90, 40, 38],
nettle_ripe: [460, 90, 40, 38],
nettle_sprout: [0, 130, 40, 38],
nightshade_mature: [52, 244, 48, 34],
nightshade_mature_hover: [102, 244, 48, 34],
nightshade_ripe: [152, 244, 48, 34],
nightshade_sprout: [202, 244, 48, 34],
obsidian_mature: [0, 0, 50, 46],
obsidian_mature_hover: [52, 0, 50, 46],
obsidian_ripe: [104, 0, 50, 46],
obsidian_sprout: [156, 0, 50, 46],
owlberry_mature: [52, 350, 50, 32],
owlberry_mature_hover: [104, 350, 50, 32],
owlberry_ripe: [156, 350, 50, 32],
owlberry_sprout: [208, 350, 50, 32],
reedmace_mature: [156, 48, 48, 40],
reedmace_mature_hover: [206, 48, 48, 40],
reedmace_ripe: [256, 48, 48, 40],
reedmace_sprout: [306, 48, 48, 40],
riverchalk_mature: [260, 350, 54, 32],
riverchalk_mature_hover: [316, 350, 54, 32],
riverchalk_ripe: [372, 350, 54, 32],
riverchalk_sprout: [428, 350, 54, 32],
riverpearl_mature: [252, 244, 54, 34],
riverpearl_mature_hover: [308, 244, 54, 34],
riverpearl_ripe: [364, 244, 54, 34],
riverpearl_sprout: [420, 244, 54, 34],
saltpetre_mature: [0, 452, 48, 30],
saltpetre_mature_hover: [50, 452, 48, 30],
saltpetre_ripe: [100, 452, 48, 30],
saltpetre_sprout: [150, 452, 48, 30],
silverleaf_mature: [0, 384, 50, 32],
silverleaf_mature_hover: [52, 384, 50, 32],
silverleaf_ripe: [104, 384, 50, 32],
silverleaf_sprout: [156, 384, 50, 32],
sirenreed_mature: [386, 130, 40, 36],
sirenreed_mature_hover: [428, 130, 40, 36],
sirenreed_ripe: [470, 130, 40, 36],
sirenreed_sprout: [0, 170, 40, 36],
starquartz_mature: [208, 384, 42, 32],
starquartz_mature_hover: [252, 384, 42, 32],
starquartz_ripe: [296, 384, 42, 32],
starquartz_sprout: [340, 384, 42, 32],
stormglass_mature: [200, 452, 48, 30],
stormglass_mature_hover: [250, 452, 48, 30],
stormglass_ripe: [300, 452, 48, 30],
stormglass_sprout: [350, 452, 48, 30],
sulfur_mature: [384, 384, 48, 32],
sulfur_mature_hover: [434, 384, 48, 32],
sulfur_ripe: [0, 418, 48, 32],
sulfur_sprout: [50, 418, 48, 32],
sunthistle_mature: [42, 170, 42, 36],
sunthistle_mature_hover: [86, 170, 42, 36],
sunthistle_ripe: [130, 170, 42, 36],
sunthistle_sprout: [174, 170, 42, 36],
toadstool_mature: [472, 484, 38, 26],
toadstool_mature_hover: [0, 516, 38, 26],
toadstool_ripe: [40, 516, 38, 26],
toadstool_sprout: [80, 516, 38, 26],
willowbark_mature: [218, 170, 54, 36],
willowbark_mature_hover: [274, 170, 54, 36],
willowbark_ripe: [330, 170, 54, 36],
willowbark_sprout: [386, 170, 54, 36],
wisplichen_mature: [400, 452, 38, 30],
wisplichen_mature_hover: [440, 452, 38, 30],
wisplichen_ripe: [0, 484, 38, 30],
wisplichen_sprout: [40, 484, 38, 30],
witchear_mature: [0, 280, 48, 34],
witchear_mature_hover: [50, 280, 48, 34],
witchear_ripe: [100, 280, 48, 34],
witchear_sprout: [150, 280, 48, 34],
};
return { ATLAS_URL, RES, ATLAS_SIZE, FRAMES };
})();
// src/rendering/ingredient-icons.js
const __m65 = (() => {
const ICONS_URL = 'assets/icons/ingredients.png';
const ICONS_SIZE = /** @type {[number, number]} */ ([576, 576]);
const ICON_FRAMES = {
ashbloom: [96, 384, 96, 96],
beebalm: [480, 288, 96, 96],
bogbean: [384, 288, 96, 96],
cinderscale: [384, 384, 96, 96],
cinnabar: [96, 192, 96, 96],
dragonpepper: [288, 384, 96, 96],
dreamclover: [384, 96, 96, 96],
emberbark: [288, 0, 96, 96],
emberflint: [192, 192, 96, 96],
frostcap: [288, 288, 96, 96],
gravemoss: [192, 480, 96, 96],
heartpetal: [96, 96, 96, 96],
hemlock: [0, 384, 96, 96],
ironroot: [0, 0, 96, 96],
lodestone: [0, 192, 96, 96],
mandrake: [0, 96, 96, 96],
mica: [288, 192, 96, 96],
moonlily: [480, 384, 96, 96],
nettle: [288, 96, 96, 96],
nightshade: [192, 0, 96, 96],
obsidian: [192, 384, 96, 96],
owlberry: [384, 0, 96, 96],
reedmace: [0, 288, 96, 96],
riverchalk: [192, 288, 96, 96],
riverpearl: [96, 288, 96, 96],
saltpetre: [384, 192, 96, 96],
silverleaf: [96, 0, 96, 96],
sirenreed: [96, 480, 96, 96],
starquartz: [288, 480, 96, 96],
stormglass: [480, 480, 96, 96],
sulfur: [480, 96, 96, 96],
sunthistle: [192, 96, 96, 96],
toadstool: [0, 480, 96, 96],
willowbark: [480, 192, 96, 96],
wisplichen: [384, 480, 96, 96],
witchear: [480, 0, 96, 96],
};
return { ICONS_URL, ICONS_SIZE, ICON_FRAMES };
})();
// src/rendering/scenes.js
const __m66 = (() => {
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
case 'bone': {
const hl = Math.max(1, Math.round(4 * s)), l = 8 - hl, r = 8 + hl;
P(l - 1, 6, r - l + 2, 4, k);
for (const kx of [l - 2, r - 1]) { P(kx - 1, 4, 5, 5, k); P(kx - 1, 7, 5, 5, k); }
P(l, 7, r - l, 2, c); P(l, 8, r - l, 1, d);
for (const kx of [l - 2, r - 1]) { P(kx, 5, 3, 3, c); P(kx, 8, 3, 3, c); P(kx, 10, 3, 1, d); P(kx, 5, 1, 1, hi); }
P(l + 1, 7, Math.max(1, r - l - 2), 1, hi);
break;
}
case 'fur': {
const hw = Math.max(3, Math.round(6 * s)), x0 = 8 - hw, x1 = 8 + hw;
P(x0 - 1, 6, x1 - x0 + 2, 7, k);
P(x0 - 2, 5, 3, 2, k); P(x1 - 1, 5, 3, 2, k); P(x0 - 2, 12, 3, 2, k); P(x1 - 1, 12, 3, 2, k);
P(x0, 6, x1 - x0, 6, c);
P(x0 - 1, 6, 2, 1, c); P(x1 - 1, 6, 2, 1, c); P(x0 - 1, 12, 2, 1, d); P(x1 - 1, 12, 2, 1, d);
for (let x = x0; x < x1; x += 2) P(x, 5, 1, 1, (x & 2) ? k : c);
for (let y = 7; y < 12; y++) for (let x = x0 + ((y & 1) ? 1 : 0); x < x1; x += 3) P(x, y, 1, 1, y < 9 ? hi : d);
P(x0, 11, x1 - x0, 1, d);
break;
}
case 'bark': {
const w = Math.round(6 + 5 * s);
P(8 - w / 2, 4, w, 9, k); P(9 - w / 2, 5, w - 2, 7, c);
for (let i = 0; i < w - 3; i += 3) P(9 - w / 2 + i + 1, 5, 1, 7, d);
P(9 - w / 2, 5, w - 2, 1, hi); P(8 + w / 2 - 2, 6, 1, 5, css(color, 0.45));
break;
}
case 'berry': {
P(7, 1, 2, 4, gd); P(9, 2, 3, 1, g);
const n = Math.max(2, Math.round(5 * s));
const pos = [[6, 5], [9, 5], [4, 8], [7, 8], [10, 8], [6, 11]];
for (let i = 0; i < n; i++) { const [px, py] = pos[i]; P(px - 1, py - 1, 5, 5, k); P(px, py, 3, 3, c); P(px, py, 1, 1, hi); P(px + 2, py + 2, 1, 1, d); }
break;
}
case 'bracket': {
P(1, 3, 3, 12, '#4a3020'); P(2, 3, 1, 12, '#6b4a30');
const w = Math.round(6 + 6 * s);
P(4, 6, w, 5, k); P(4, 7, w - 1, 3, c); P(4, 7, w - 2, 1, hi);
for (let i = 5; i < 4 + w - 1; i += 2) P(i, 9, 1, 1, d);
if (s > 0.6) { P(4, 11, w - 3, 3, k); P(4, 12, w - 4, 1, c); }
break;
}
case 'sprig': {
P(7, 3, 2, 12, gd);
const n = Math.max(1, Math.round(3 * s));
for (let i = 0; i < n; i++) {
const y0 = 3 + i * 4;
P(2, y0, 5, 3, k); P(3, y0 + 1, 4, 1, c); P(2, y0 + 1, 1, 1, c);
P(9, y0 + 1, 5, 3, k); P(9, y0 + 2, 4, 1, c); P(13, y0 + 2, 1, 1, c);
P(4, y0, 1, 1, hi); P(11, y0 + 1, 1, 1, hi);
}
break;
}
case 'spike': {
P(7, 9, 2, 6, g); P(4, 12, 3, 2, g);
const h = Math.round(5 + 4 * s);
P(5, 9 - h, 6, h + 1, k);
for (let y = 10 - h; y < 9; y += 2) { P(5, y, 6, 1, c); P(6, y + 1, 4, 1, d); }
P(6, 10 - h, 1, 1, hi); P(9, 12 - h, 1, 1, hi);
break;
}
case 'seed': {
P(7, 7, 2, 8, gd);
const n = Math.max(2, Math.round(5 * s));
for (let i = 0; i < n; i++) { const px = 2 + i * 2.5; P(px, 3 + (i % 2), 3, 4, k); P(px + 1, 4 + (i % 2), 1, 2, c); P(px + 1, 6 + (i % 2), 6 - px / 2.5, 1, gd); }
break;
}
case 'crust': {
const w = Math.round(6 + 6 * s);
P(8 - w / 2, 12, w, 3, '#5a5450');
for (let i = 0; i < w; i += 2) { P(8 - w / 2 + i, 9 + (i % 4 === 0 ? 0 : 1), 2, 3, k); P(8 - w / 2 + i, 10 + (i % 4 === 0 ? 0 : 1), 1, 2, c); }
P(9 - w / 2, 9, 1, 1, hi); P(8, 10, 1, 1, hi);
break;
}
case 'nugget': {
const w = Math.round(5 + 5 * s);
P(8 - w / 2, 8, w, 6, k); P(9 - w / 2, 8, w - 2, 5, c); P(8 - w / 2 + 1, 7, w - 3, 1, k);
P(9 - w / 2, 9, w - 3, 1, css(color, 1.9)); P(10 - w / 2, 12, w - 4, 1, d);
break;
}
case 'shard': {
const h = Math.round(5 + 7 * s);
for (let i = 0; i < h; i++) { P(4 + i * 0.6, 14 - i, 3, 1, k); P(5 + i * 0.6, 14 - i, 1, 1, c); }
P(5 + (h - 2) * 0.6, 15 - h, 1, 1, '#ffffff'); P(5, 13, 1, 1, hi);
break;
}
case 'lily': {
P(7, 8, 2, 7, g); P(9, 12, 3, 2, g);
const r = Math.round(2 + 2 * s);
P(8 - r - 1, 3, r * 2 + 2, 5, k); P(8 - r, 4, r * 2, 3, c);
P(8 - r - 1, 2, 2, 2, k); P(7 + r, 2, 2, 2, k); P(8 - r, 3, 1, 1, c); P(8 + r, 3, 1, 1, c);
P(7, 7, 2, 1, d); P(8 - r, 4, 1, 1, hi);
break;
}
case 'toadstool': {
P(6, 9, 4, 6, '#e8dcc4'); P(6, 9, 1, 6, '#fff6e6');
const w = Math.round(7 + 4 * s);
P(8 - w / 2, 4, w, 6, k); P(9 - w / 2, 5, w - 2, 4, c); P(10 - w / 2, 4, w - 4, 1, k);
P(9 - w / 2 + 1, 6, 1, 1, '#ffffff'); P(8, 5, 2, 1, '#ffffff'); P(7 + w / 2 - 2, 7, 1, 1, '#ffffff');
break;
}
case 'reed': {
P(7, 1, 1, 3, gd); P(7, 9, 2, 6, g);
const h = Math.round(3 + 3 * s);
P(6, 3, 4, h + 1, k); P(7, 4, 2, h - 1, c); P(7, 4, 1, 1, hi);
P(9, 10, 4, 1, g); P(3, 12, 4, 1, g);
break;
}
case 'shell': {
const w = Math.round(6 + 5 * s);
P(8 - w / 2, 7, w, 6, k); P(9 - w / 2, 8, w - 2, 4, c); P(7, 13, 2, 2, k);
for (let i = 1; i < w - 2; i += 2) P(8 - w / 2 + i, 8, 1, 4, d);
P(9 - w / 2, 8, w - 2, 1, css(mix(color, [1, 0.9, 1], 0.6)));
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
// src/rendering/wild-sprites.js
const __m61 = (() => {
const { ATLASES } = __m62;
const FIELD = __m63;
const GROW = __m64;
const { ICONS_URL, ICON_FRAMES } = __m65;
const { rawSprite } = __m66;
class SpriteAtlas {
constructor(url, frames, res = 1) {
this.url = url;
this.res = res;
this.src = frames;
this.frames = res === 1 ? frames : Object.fromEntries(Object.entries(frames).map(([k, f]) => [k, /** @type {[number, number, number, number]} */ (f.map((v) => v / res))]));
this.img = null;
this.ready = false;
this.loading = null;
this.pixels = null;
this.masks = {};
}
load() {
if (this.loading) return this.loading;
if (typeof Image === 'undefined') return (this.loading = Promise.resolve(false));
this.loading = new Promise((resolve) => {
const img = new Image();
img.onload = () => { this.img = img; this.ready = true; resolve(true); };
img.onerror = () => resolve(false);
img.src = this.url;
});
return this.loading;
}
frame(name) {
return this.frames[name] || null;
}
mask(name) {
const f = this.frames[name];
if (!f) return null;
if (this.masks[name]) return this.masks[name];
if (!this.pixels && this.img && typeof document !== 'undefined') {
const cv = document.createElement('canvas');
cv.width = this.img.width; cv.height = this.img.height;
const ctx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d', { willReadFrequently: true }));
ctx.drawImage(this.img, 0, 0);
this.pixels = { width: cv.width, data: ctx.getImageData(0, 0, cv.width, cv.height).data };
}
if (!this.pixels) return null;
const [x, y] = this.src[name], [, , w, h] = f, r = this.res, { width, data } = this.pixels, m = new Uint8Array(w * h);
for (let j = 0; j < h * r; j++) for (let i = 0; i < w * r; i++) if (data[((y + j) * width + x + i) * 4 + 3] > 0) m[Math.floor(j / r) * w + Math.floor(i / r)] = 1;
return (this.masks[name] = m);
}
draw(ctx, name, x, y, scale = 1, flip = false) {
const f = this.frames[name], s = this.src[name];
if (!f || !this.img) return;
const w = f[2] * scale, h = f[3] * scale, left = Math.round(x - w / 2), top = Math.round(y - h);
if (flip) {
ctx.save();
ctx.translate(left + w, top);
ctx.scale(-1, 1);
ctx.drawImage(this.img, s[0], s[1], s[2], s[3], 0, 0, w, h);
ctx.restore();
} else ctx.drawImage(this.img, s[0], s[1], s[2], s[3], left, top, w, h);
}
}
const MEADOW = new SpriteAtlas(FIELD.ATLAS_URL, FIELD.FRAMES);
const REGION_ATLAS = {
meadow: MEADOW,
...Object.fromEntries(Object.entries(ATLASES).map(([region, a]) => [region, new SpriteAtlas(a.url, a.frames)])),
};
function gatherable(region, atlas, k) {
const has = (/** @type {string} */ n) => !!atlas.frames[k + '_' + n];
return [k, {
region, atlas, idle: k + '_idle', hover: k + '_hover',
depleted: k + '_depleted',
...(has('harvesting') ? { harvesting: k + '_harvesting' } : {}),
...(has('closed') ? { closed: k + '_closed', closedHover: k + '_closed_hover' } : {}),
...(has('icon') ? { icon: k + '_icon' } : {}),
}];
}
const GATHERABLES = Object.fromEntries(Object.entries({
forest: ['ironroot', 'silverleaf', 'nightshade', 'owlberry', 'emberbark', 'witchear', 'mandrake'],
meadow: ['heartpetal', 'sunthistle', 'nettle', 'dreamclover', 'beebalm', 'hemlock'],
river: ['riverchalk', 'frostcap', 'bogbean', 'willowbark', 'reedmace', 'riverpearl'],
quarry: ['emberflint', 'mica', 'saltpetre', 'sulfur', 'lodestone', 'cinnabar', 'stormglass'],
moonfen: ['gravemoss', 'starquartz', 'wisplichen', 'moonlily', 'toadstool', 'sirenreed'],
crags: ['dragonpepper', 'cinderscale', 'ashbloom', 'obsidian'],
}).flatMap(([region, keys]) => keys.map((k) => gatherable(region, REGION_ATLAS[region], k))));
const ICONS = new SpriteAtlas(ICONS_URL, ICON_FRAMES);
const GROWTH = new SpriteAtlas(GROW.ATLAS_URL, GROW.FRAMES, GROW.RES);
function growthFrame(key, stage, hover = false) {
const name = `${key}_${stage}${hover && stage === 'mature' ? '_hover' : ''}`;
return GROWTH.frames[name] ? name : null;
}
const CRYSTALS = new Set(['saltpetre', 'sulfur', 'lodestone', 'cinnabar', 'stormglass', 'starquartz', 'wisplichen', 'sirenreed', 'cinderscale', 'obsidian']);
const glints = {};
function glintSpots(atlas, name, n = 4) {
if (glints[name]) return glints[name];
const f = atlas.frames[name];
if (!f || !atlas.mask(name) || !atlas.pixels) return [];
const [x0, y0, w, h] = atlas.src[name], r = atlas.res, { width, data } = atlas.pixels;
const at = (/** @type {number} */ i, /** @type {number} */ j) => (i < 0 || j < 0 || i >= w || j >= h ? -1 : ((y0 + j) * width + x0 + i) * 4);
const luma = (/** @type {number} */ k) => (k < 0 || !data[k + 3] ? 0 : 0.3 * data[k] + 0.59 * data[k + 1] + 0.11 * data[k + 2]);
const cands = [];
for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
const l = luma(at(i, j));
if (l < 120) continue;
if ([[0, -1], [-1, 0], [1, 0], [-1, -1], [1, -1]].some(([di, dj]) => luma(at(i + di, j + dj)) < 50)) cands.push({ i, j, s: l - (j / h) * 120 });
}
cands.sort((a, b) => b.s - a.s);
const out = [];
for (const c of cands) {
if (out.length >= n) break;
const dx = c.i / r - w / r / 2, dy = c.j / r - h / r;
if (out.every(([ox, oy]) => Math.abs(ox - dx) + Math.abs(oy - dy) >= 5)) out.push([dx, dy]);
}
return (glints[name] = out);
}
const ICON_SIZE = 32;
const MIN_HIT = 20;
function gatherFrameName(key, s) {
const g = GATHERABLES[key];
if (!g) return null;
if (s.harvesting && g.harvesting) return g.harvesting;
if (!s.can) return g.depleted;
if (s.closed && g.closed) return s.hover ? /** @type {string} */ (g.closedHover) : g.closed;
return s.hover ? g.hover : g.idle;
}
function plantBox(p, name, W, H) {
const f = name ? GROWTH.frames[name] : null;
const ax = Math.round(p.x * W), ay = Math.round(p.y * H);
const w = f ? f[2] : 16, h = f ? f[3] : 16, bottom = f ? ay : ay + 2;
const hw = Math.max(w, MIN_HIT) / 2, hh = Math.max(h, MIN_HIT);
return { ax, ay, w, h, x0: ax - hw, x1: ax + hw, y0: bottom - hh, y1: bottom + 2 };
}
function hitPlant(plants, frameOf, px, py, W, H, slop = 4) {
let best = null, bestY = -Infinity, near = null, nearD = slop * slop;
for (const p of plants) {
const b = plantBox(p, frameOf(p), W, H);
if (px >= b.x0 && px <= b.x1 && py >= b.y0 && py <= b.y1) {
if (b.ay > bestY) { bestY = b.ay; best = p; }
continue;
}
const dx = Math.max(b.x0 - px, 0, px - b.x1), dy = Math.max(b.y0 - py, 0, py - b.y1), dd = dx * dx + dy * dy;
if (dd <= nearD) { nearD = dd; near = p; }
}
return best || near;
}
function ingredientSprite(m, fill = 1) {
const cv = rawSprite(m.wild ? m.wild.shape : m.shape || 'stone', m.look || m.color, fill);
const key = m.wild ? m.wild.key : null;
const g = key ? GATHERABLES[key] : null;
const f = g && g.icon ? g.atlas.frames[g.icon] : null;
const fi = key ? ICONS.frames[key] : null;
if (!f && !fi) return cv;
const paintFrame = () => {
if (!g || !f) return;
cv.width = cv.height = ICON_SIZE;
const ctx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d'));
g.atlas.draw(ctx, /** @type {string} */ (g.icon), cv.width / 2, cv.height - Math.floor((cv.height - f[3]) / 2));
};
const paintIcon = () => {
if (!fi || !key) return;
cv.width = fi[2];
cv.height = fi[3];
cv.style.imageRendering = 'auto';
const ctx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d'));
ctx.imageSmoothingEnabled = true;
ICONS.draw(ctx, key, cv.width / 2, cv.height);
};
if (fi && ICONS.ready) paintIcon();
else {
if (f) {
if (g && g.atlas.ready) paintFrame();
else if (g) g.atlas.load().then((ok) => { if (ok && !(fi && ICONS.ready)) paintFrame(); });
}
if (fi) ICONS.load().then((ok) => { if (ok) paintIcon(); });
}
return cv;
}
return { SpriteAtlas, MEADOW, REGION_ATLAS, GATHERABLES, ICONS, GROWTH, growthFrame, CRYSTALS, glintSpots, ICON_SIZE, MIN_HIT, gatherFrameName, plantBox, hitPlant, ingredientSprite };
})();
// src/game/journal.js
const __m67 = (() => {
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
case 'awaken': {
const id = e.species;
if (!id || !L(id)) break;
const d = L(id);
state.learn(id, 'awaken', Math.round(e.temp));
add({ key: `awaken:${id}`, title: `${d.name} awakens`, text: `Near ${Math.round(e.temp)}°C a glow ran through the ${d.name.toLowerCase()}: it passed its arcane threshold and its magic woke, far stronger than before. Awakened matter stays awake when it cools, is bottled or kept — only dilution or reactions undo it.`, kind: 'arcane', material: id });
achievements.push(...state.unlock('awaken'));
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
if (/^rw_(steep|infuse)/.test(rule.id)) achievements.push(...state.unlock('steep'));
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
case 'spark':
add({ key: 'spark', title: 'A galvanic spark', text: 'Charge leapt between touching matter. Conductive brews (brine, metals) carry electric charge; oil and pure spirits insulate. Moving charge warms what it passes through.', kind: 'tool' });
break;
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
const __m68 = (() => {
const { PHASE, SIM } = __m24;
const { MAX_SPECIES } = __m18;
function condensedCount(sim) {
const p = sim.p;
let n = 0;
for (let i = 0; i < p.count; i++) if (p.phase[i] !== PHASE.GAS) n++;
return n;
}
function stageGoal(plan) {
const st = plan.steep ? plan.steep.T : null;
const cool = plan.coolTo ?? 20, heat = plan.heatTo ?? 20;
const cold = cool < Math.min(15, st ?? 99) - 1 && heat <= Math.max(25, st ?? 0) + 1;
return cold ? cool : heat;
}
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
this.held = 0;
this.crushTarget = -1;
const steps = /** @type {any} */ (plan).steps;
this.steps = /** @type {any[]|null} */ (steps ? steps.flatMap((s) => (s.op === 'pour' && s.ground ? [{ ...s, ground: undefined }, { op: 'crush', s: 60 }] : [s])) : null);
this.stepIndex = 0;
this.target = 20;
this.reduceFrom = 0;
this.venting = 0;
if (this.steps) this.stage = 'steps';
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
if (this.t > (this.steps ? 900 : 360)) { this.failed = true; this.finish(); return; }
switch (this.stage) {
case 'steps': this.tickStep(); return;
case 'pour': {
if (sim.emitter.pouring) { this.stir(0.6); return; }
if (this.ingIndex >= plan.ingredients.length) {
this.next(plan.crush ? 'crush' : 'stir');
return;
}
const ing = plan.ingredients[this.ingIndex++];
this.pourOne(ing);
return;
}
case 'crush': {
if (!this.crushSolids() || this.stageT > 90) { this.release(); this.next('stir'); }
return;
}
case 'stir': {
this.status = 'Stirring';
this.stir(1);
this.control(20);
const need = plan.knead ? 14 : plan.activate ? 10 : 7;
if (this.stageT > need) this.next(plan.steep ? 'steep' : 'heat');
return;
}
case 'steep': {
const T = plan.steep.T;
this.status = `Steeping at ${Math.round(T)}°C`;
const err = this.control(T);
if (this.stageT % 3 < 1.6) this.stir(0.8); else this.release();
if (err < 4) this.held = (this.held || 0) + dt;
if (this.held >= plan.steep.hold || this.stageT > 90) { this.held = 0; this.next('heat'); }
return;
}
case 'heat': {
const goal = stageGoal(plan);
this.status = goal < 15 ? `Chilling to ${Math.round(goal)}°C` : `Heating to ${Math.round(goal)}°C`;
const err = this.control(goal);
if (this.stageT % 3 < 1.5) this.stir(0.8); else this.release();
if (err < 4 || this.stageT > (goal < 15 ? 120 : 70)) this.next('hold');
return;
}
case 'hold': {
this.control(stageGoal(plan));
this.status = plan.activate ? 'Letting it awaken' : 'Letting it react';
if (this.stageT % 2.5 < 1.5) this.stir(0.9); else this.release();
if (this.stageT > (plan.hold ?? 6) + 4) this.next(plan.reduce ? 'reduce' : 'serve');
return;
}
case 'reduce': {
const c = sim.cauldron;
if (this.stageT <= dt + 1e-9) { this.reduceFrom = condensedCount(sim); this.lidWas = c.lidClosed; c.lidClosed = false; }
const goal = Math.round(this.reduceFrom * (1 - (plan.reduce ? plan.reduce.frac : 0)));
if (!this.venting) {
this.status = `Boiling down (${condensedCount(sim)} → ${goal})`;
this.control(130);
sim.furnace.setting = Math.min(sim.furnace.setting, 0.7);
if (this.stageT % 3 < 1.2) this.stir(0.7); else this.release();
if (condensedCount(sim) <= goal || this.stageT > 160) { this.venting = this.stageT; sim.furnace.setting = 0; this.release(); }
return;
}
this.status = 'Letting the steam out';
sim.furnace.setting = 0;
const gas = sim.p.count - condensedCount(sim);
if (gas <= 0 && condensedCount(sim) > goal && this.stageT < 200) { this.venting = 0; return; }
if (gas <= 0 || this.stageT - this.venting > 20) { c.lidClosed = this.lidWas ?? true; this.venting = 0; this.next('serve'); }
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
crushSolids() {
const sim = this.sim, p = sim.p;
this.status = 'Crushing solids';
let k = this.crushTarget ?? -1;
if (k < 0 || k >= p.count || p.phase[k] !== PHASE.SOLID) {
k = -1;
for (let i = 0; i < p.count; i++) if (p.phase[i] === PHASE.SOLID && (k < 0 || p.y[i] > p.y[k])) k = i;
this.crushTarget = k;
}
if (k < 0) return false;
const t = sim.tool;
t.type = 'pestle';
this.phase += SIM.DT * 9;
t.setTarget(p.x[k] + Math.sin(this.phase * 0.6) * 0.18, p.y[k] + Math.abs(Math.sin(this.phase)) * 0.25 - 0.08, true);
t.beginFrame();
t.substep(0, 1);
return true;
}
pourOne(ing) {
const n = Math.max(1, Math.round((ing.n ?? (ing.ml || 0) / SIM.ML_PER_PARTICLE) * this.scale));
if (this.onPour && !this.onPour(ing.id, n)) { this.failed = true; this.finish(); return false; }
const def = this.lookup(ing.id);
if (!def) { this.failed = true; this.finish(); return false; }
this.sim.emitter.start(def, { x: (this.ingIndex % 2 ? -0.35 : 0.35), amount: n, rate: def.form === 'powder' ? 70 : 110 });
this.status = `Pouring ${def.name}`;
if (this.onPoured) this.onPoured(ing.id, n);
return true;
}
tickStep() {
const sim = this.sim, dt = SIM.DT;
const steps = /** @type {any[]} */ (this.steps);
if (sim.emitter.pouring) { this.control(this.target); return; }
const s = steps[this.stepIndex];
if (!s) { this.finish(); return; }
const done = () => { this.release(); this.stepIndex++; this.stageT = 0; this.held = 0; };
switch (s.op) {
case 'pour':
if (this.stageT <= dt + 1e-9) { if (this.pourOne(s)) this.stageT = dt * 2; return; }
done();
return;
case 'stir':
this.status = 'Stirring';
this.control(this.target);
this.stir(1);
if (this.stageT >= s.s) done();
return;
case 'crush': {
this.control(this.target);
if (!this.crushSolids() || this.stageT >= s.s) done();
return;
}
case 'temp': {
if (s.loss) { this.tickBoilDown(s, done); return; }
this.target = s.T;
this.status = `${s.T < 20 ? 'Chilling' : 'Heating'} to ${s.T}°C`;
const err = this.control(s.T);
const duty = s.stir ?? 0.5;
if (duty > 0.05 && (this.stageT % 3) < 3 * duty) this.stir(0.8); else this.release();
if (err < 4) this.held += dt;
if (this.held >= s.hold || this.stageT > s.hold + 120) done();
return;
}
case 'lid':
sim.cauldron.lidClosed = !!s.closed;
done();
return;
case 'serve': {
this.target = s.T;
this.status = `Bringing to ${s.T}°C`;
const err = this.control(s.T);
if (this.stageT % 2 < 1.2) this.stir(0.6); else this.release();
if ((err < 3 && this.stageT > 2) || this.stageT > 60) done();
return;
}
default:
done();
}
}
tickBoilDown(s, done) {
const sim = this.sim, c = sim.cauldron, dt = SIM.DT;
if (this.stageT <= dt + 1e-9) { this.reduceFrom = condensedCount(sim); this.venting = 0; }
c.lidClosed = false;
const goal = Math.round(this.reduceFrom * (1 - s.loss));
if (!this.venting) {
this.status = `Boiling down (${Math.round((1 - condensedCount(sim) / Math.max(1, this.reduceFrom)) * 100)} of ${Math.round(s.loss * 100)} %)`;
this.control(Math.max(s.T, 130));
sim.furnace.setting = Math.min(sim.furnace.setting, 0.7);
if (this.stageT % 3 < 1.2) this.stir(0.7); else this.release();
if (condensedCount(sim) <= goal || this.stageT > s.hold + 200) { this.venting = this.stageT; sim.furnace.setting = 0; this.release(); }
return;
}
this.status = 'Letting the steam out';
sim.furnace.setting = 0;
const gas = sim.p.count - condensedCount(sim);
if (gas <= 0 || this.stageT - this.venting > 20) { this.venting = 0; done(); }
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
return { condensedCount, stageGoal, AutoBrewer, runPlanHeadless, speciesFraction };
})();
// src/game/mechanics.js
const __m70 = (() => {
const MECHANICS = [
{ id: 'formulation', name: 'Formulation and neutralisation', role: 'core', stage: 'formulation', rank: 0,
decision: 'Which natural ingredients, in what proportions, to carry the wanted effects and cancel their side effects.',
consequence: 'Effects cancel in pairs where they meet (fire–frost, life–death, life–poison, acid–alkali); what is left is the potion.',
objective: 'The wanted effects at strength, every other effect under the purity limit.',
feedback: 'Each ingredient’s known effects and its balancing hints; the guild theory; trials.' },
{ id: 'extraction', name: 'Grinding and extraction', role: 'core', stage: 'preparation', rank: 0,
decision: 'Crush in the pot with the pestle, or leave it whole.',
consequence: 'Only what dissolves acts: a whole herb gives nothing, the same herb ground gives its effects.',
objective: 'Reaching the strength the order asks for at all.',
feedback: 'Brew advice (“whole herbs: crush”), the brew’s colour, trials.' },
{ id: 'steeping', name: 'Steeping temperature', role: 'core', stage: 'preparation', rank: 0,
decision: 'How hot to steep, for how long, and which ingredients go in before the steep.',
consequence: 'Inside an ingredient’s steeping window it gives up two to three times as much; outside it only what dissolves.',
objective: 'Strength without wasting herbs; an ingredient added after the steep stays weak.',
feedback: 'The lore of each herb, the reaction once discovered (its window in the journal), brew advice, trials.' },
{ id: 'heat-damage', name: 'Heat-sensitive ingredients', role: 'core', stage: 'preparation', rank: 0,
decision: 'Keep delicate petals below their spoiling heat.',
consequence: 'Overheated Heartpetal wilts: its love falls to a quarter and a poison appears.',
objective: 'Love philtres and cordials must not be boiled.',
feedback: 'The petal’s lore, the wilting reaction in the journal, trials.' },
{ id: 'cold-extraction', name: 'Cold extraction', role: 'core', stage: 'preparation', rank: 0,
decision: 'Steep ice-cold ingredients cold — but not frozen — instead of warm.',
consequence: 'Frostcap held at 5–10°C gives two and a half to three times the frost it gives warm; frozen solid it gives less again. The basin holds 9°C; narrower windows (Grave Moss) need the Frost Rune.',
objective: 'Cooling and fever orders at strength.',
feedback: 'The lore (“steeps only in ice-cold water”), the thermometer, trials.' },
{ id: 'awakening', name: 'Arcane awakening', role: 'core', stage: 'transformation', rank: 2,
decision: 'Heat (or chill) a well-mixed brew past the blend’s arcane threshold, or keep it below.',
consequence: 'Awakened magic runs two to three times stronger, side effects too, and stays awake.',
objective: 'Strong orders beyond what sleeping magic reaches; plain orders that must not overshoot.',
feedback: 'The glow, the journal’s awakening temperatures, the Arcanometer’s threshold reading, trials.' },
{ id: 'concentration', name: 'Concentration and dilution', role: 'core', stage: 'balancing', rank: 0,
decision: 'Boil water off with the lid open, or add water.',
consequence: 'Boiling a third away strengthens every effect by about 40 %, wanted and unwanted; water weakens both.',
objective: 'Strong orders (“strong and compact”); taming a brew that overshoots its purity limit.',
feedback: 'Steam escaping (brew advice), the volume, trials.' },
{ id: 'mixing', name: 'Mixing', role: 'supporting', stage: 'balancing', rank: 0,
decision: 'Stir, and how thoroughly, after every addition.',
consequence: 'Powders dissolve faster when stirred (about 40 % more in a cold brew), neutralisers meet what they cancel, and every bottle of the batch comes out the same.',
objective: 'Bottles that match the trials of their batch (shared batch evidence).',
feedback: 'The swirl of colours, brew advice (“uneven: stir”), bottles whose evidence goes stale.' },
{ id: 'experimentation', name: 'Trials on rabbits', role: 'core', stage: 'experimentation', rank: 0,
decision: 'How many doses, how large, on how many rabbits — and when a rabbit needs a purge.',
consequence: 'Each reading narrows the estimate; several rabbits average out each one’s bias; doses pile up in a rabbit.',
objective: 'A label customers trust and pay for; proof for demanding customers; disputes won.',
feedback: 'The expected-effects section: value, margin, evidence level, detection limit.' },
{ id: 'commerce', name: 'Labels and bargaining', role: 'core', stage: 'commerce', rank: 0,
decision: 'What to claim on the label and what price to ask.',
consequence: 'Customers pay for claims they trust and come back if the potion or the label failed them.',
objective: 'Coins and reputation, patrons who return.',
feedback: 'The customer’s reasons in the bargaining, next-day verdicts.' },
{ id: 'gathering', name: 'Gathering', role: 'supporting', stage: 'formulation', rank: 0,
decision: 'Where, when (dawn, dusk, weather) and how carefully to harvest.',
consequence: 'Ingredients the market does not sell; careful harvests regrow faster.',
objective: 'Supplying every order without the market’s prices.',
feedback: 'The wilds’ deposits, weather and hours.' },
{ id: 'storage', name: 'Potion shelves', role: 'production', stage: 'production', rank: 0,
decision: 'Bottle a batch for later customers.',
consequence: 'Bottles of one batch share its trials (each checked against its own contents).',
objective: 'Serving a later order without brewing or testing again.',
feedback: 'The shelf, bottles that already meet the order.' },
{ id: 'batch', name: 'Batch size', role: 'production', stage: 'production', rank: 0,
decision: 'How large a batch to brew.',
consequence: 'A larger vessel brews bigger orders and several bottles from one tested batch.',
objective: 'Contracts and repeat orders.',
feedback: 'The cauldron’s fill line.' },
{ id: 'automation', name: 'Recipes and the homunculus', role: 'production', stage: 'production', rank: 0,
decision: 'Save a procedure that worked, and brew it again.',
consequence: 'The same ingredients prepared the same way give the same potion; a reproduced recipe is reliable.',
objective: 'Repeat orders with less work and less testing.',
feedback: 'The recipe book: formulation, procedure and reproduction kept apart.' },
];
const MECHANIC_BY_ID = Object.fromEntries(MECHANICS.map((m) => [m.id, m]));
const IMMERSION = [
{ id: 'layering', name: 'Density and layering', note: 'Liquids that do not mix stratify by density; every natural extract mixes with water, so layering never separates magic. The tap draws from the bottom.' },
{ id: 'viscosity', name: 'Viscosity', note: 'Pastes and doughs hold their shape; natural brews stay watery.' },
{ id: 'charge', name: 'Electric charge', note: 'Storm Glass carries charge into conductive brews; sparks warm what they pass through.' },
{ id: 'phases', name: 'Freezing, melting, boiling and vapour', note: 'Rigid frozen blocks, vapour under the lid, condensation, latent heat.' },
{ id: 'fire', name: 'Burning', note: 'Oil and spirit catch fire on glowing iron; the lid smothers it.' },
{ id: 'appearance', name: 'Colour, glow and bubbles', note: 'The colour shows what is dissolved; awakened magic glows.' },
];
const SANDBOX_CONTROLS = ['skimmer', 'alembic', 'heatmap', 'readouts'];
return { MECHANICS, MECHANIC_BY_ID, IMMERSION, SANDBOX_CONTROLS };
})();
// src/ui/panels.js
const __m69 = (() => {
const { recipeConfidence, CONFIDENCE_TEXT, describeStep } = __m49;
const { MECHANIC_BY_ID } = __m70;
const { evidenceRank } = __m27;
const { h, btn, modal, toast, coins, starsText, confirmDialog, clear } = __m2;
const { icon } = __m3;
const { drawPortrait } = __m60;
const { drawJar } = __m54;
const { EQUIPMENT, RANKS } = __m26;
const { ACHIEVEMENTS } = __m5;
const { viscosityClass, densityWord, evennessWord } = __m45;
const { EFFECTS, EFFECT_BY_KEY, EFFECT_KEYS, dominantEffect } = __m13;
const { ingredientSprite } = __m61;
const { compatFactor } = __m14;
const { describeColor, rgbToHex } = __m8;
const { SIM } = __m24;
const { exportSave, parseImport, saveGame } = __m50;
const { audio } = __m4;
const { isMagical } = __m15;
const { causeWord } = __m28;
const CAT_LABEL = { heat: 'Fire', cold: 'Cooling', vessel: 'Cauldrons', tool: 'Tools', instrument: 'Instruments', trials: 'Trials room', gathering: 'Foraging', storage: 'Potion storage', guild: 'Guild' };
function jarCanvas(m, w = 22, hh = 30) {
if ((m.wild || m.remains) && m.form === 'solid') {
const cv = ingredientSprite(m);
cv.style.width = w * 2 + 'px';
cv.style.height = w * 2 + 'px';
return cv;
}
const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(w), height: String(hh), style: { width: w * 2 + 'px', height: hh * 2 + 'px' } }));
drawJar(cv.getContext('2d'), 2, 0, w - 4, hh, m.look || m.color, m.form);
return cv;
}
function fxChips(fx, min = 1) {
const list = EFFECT_KEYS.map((k) => /** @type {[string, number]} */ ([k, (fx && fx[k]) || 0])).filter(([, v]) => Math.abs(v) >= min).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
if (!list.length) return [h('span', { class: 'muted', text: 'none' })];
return list.map(([k, v]) => h('span', { class: 'fx-chip', title: EFFECT_BY_KEY[k].label }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ` ${Math.round(v)}`));
}
function swatch(rgb) {
return h('span', { class: 'swatch', style: { background: rgbToHex(rgb), display: 'inline-block', width: '18px', height: '12px', boxShadow: '0 0 0 1px #2b1d14', verticalAlign: 'middle' } });
}
function openShop(lab, tab = 'reagents') {
const st = lab.state;
const body = h('div');
const tabs = h('div', { class: 'tabs' });
let current = tab;
const m = modal({ title: 'Shop', body: [tabs, body], wide: true, onClose: () => lab.refreshHud(true) });
m.el.insertBefore(tabs, m.body);
const coinLine = h('div', { class: 'row', style: { justifyContent: 'flex-end', padding: '0 12px' } });
m.el.insertBefore(coinLine, m.body);
const renderTabs = () => {
clear(tabs);
for (const [k, label, ic] of [['reagents', 'Buy', 'jar'], ['equipment', 'Equipment', 'gear'], ['sell', 'Sell', 'coin']]) {
tabs.appendChild(btn(label, () => { current = k; render(); }, { icon: ic, cls: current === k ? 'active' : '', act: 'shop-tab-' + k }));
}
};
const render = () => {
renderTabs();
clear(coinLine).append(icon('coin'), h('span', { text: coins(st.coins) + ' coins' }), ...(st.marketEvent.key !== 'none' ? [h('span', { class: 'muted small', text: ` · today: ${st.marketEvent.name}` })] : []));
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
body.appendChild(h('div', { class: 'muted small', text: `Prices per 100 ml · room for ${st.cap.storage} ml of each. Water is free; oil and spirit carry no magic. Herbs and minerals are free in the Wilds — from Journeyman on, the common ones are sold here too.` }));
const list = h('div', { class: 'list' });
for (const id of st.world.ingredients) {
const mt = st.lookup(id);
if (mt.wild && mt.wild.gatherOnly) continue; // only found in the wilds
if (mt.remains) continue; // recovered from a rabbit, never sold
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
h('div', { class: 'meta', text: locked ? `${mt.wild ? 'The herbalist sells it' : 'Unlocks'} at the rank of ${(RANKS[mt.tier] || RANKS[RANKS.length - 1]).name}.${mt.wild ? ' Until then, gather it in the wilds.' : ''}` : mt.description }),
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
if (!items.length) continue;
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
h('div', {}, h('div', { class: 'title', text: e.name }), h('div', { class: 'meta', text: e.desc + (!reqOk && !owned ? ' (requires the previous upgrade)' : '') }),
h('div', { class: 'meta muted mech', 'data-mechanics': e.mechanics.join(' '), text: 'For: ' + e.mechanics.map((id) => (MECHANIC_BY_ID[id] ? MECHANIC_BY_ID[id].name.toLowerCase() : id)).join(' · ') })),
action,
));
}
body.appendChild(list);
}
}
function renderSell(lab, body, rerender) {
const st = lab.state;
body.appendChild(h('div', { class: 'muted small', text: 'Ingredients you have 100 ml or more of, bought back at 40% of today’s price.' }));
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
h('span', { class: 'k', text: 'Weight' }), h('span', { text: lab.sandbox ? `${m.density.toFixed(2)} g/ml` : densityWord(m.density) }),
h('span', { class: 'k', text: m.form === 'powder' ? 'Grains' : 'Thickness' }), h('span', { text: m.form === 'powder' ? `piles at ≈${Math.round(Math.atan(m.friction) * 180 / Math.PI)}°` + (m.solubility > 0.05 ? ', dissolves in water' : '') : lab.sandbox ? `${m.viscosity} cP` : viscosityClass(m.viscosity) }),
h('span', { class: 'k', text: 'Melts' }), h('span', { text: k.melt !== undefined ? `≈${k.melt}°C (observed)` : m.form === 'liquid' ? 'unknown (freeze it to find out)' : 'unknown' }),
h('span', { class: 'k', text: 'Boils' }), h('span', { text: k.boil !== undefined ? `≈${k.boil}°C (observed)` : isFinite(m.boil) ? 'unknown (heat it to find out)' : 'does not boil' }),
h('span', { class: 'k', text: 'Magic' }), h('span', { text: !isMagical(m) ? 'none to awaken' : k.awaken !== undefined ? `awoke near ${k.awaken}°C in your brew (observed)` : 'can awaken — its threshold is unknown (heat or chill it to find out)' }),
h('span', { class: 'k', text: 'Price' }), h('span', { text: `${coins(st.priceOf(id))} / 100 ml` }),
);
const asp = h('div', { class: 'aspect-bars' });
for (const e of m.remains ? [] : EFFECTS) {
const v = (m.effects && m.effects[e.key]) || 0;
if (Math.abs(v) < 1) continue;
asp.append(h('span', {}, icon(e.icon, 'sm'), ' ' + e.label), h('div', { class: 'bar' }, h('i', { style: { width: Math.min(100, Math.abs(v)) + '%', background: `rgb(${e.color.map((c) => Math.round(c * 255)).join(',')})` } })), h('span', { text: e.key === 'acidity' && v < 0 ? `${Math.round(v)} (alkaline)` : String(Math.round(v)) }));
}
if (m.remains) asp.append(h('span', { class: 'muted', text: `Unknown: recovered from ${m.remains.rabbitName}. Whatever it absorbed in life may linger — test it in the Trials room.` }));
else if (!asp.children.length) asp.append(h('span', { class: 'muted', text: 'No magical or chemical effect.' }));
const reactions = st.world.reactions.filter((r) => (r.a === id || r.b === id) && st.journal['reaction:' + r.id]);
const balance = m.wild ? balanceHints(st, m) : [];
modal({
title: m.name,
body: [
h('div', { class: 'card parch ing-card' }, jarCanvas(m, 22, 30), h('div', {}, h('div', { text: m.description }), h('div', {}, ...tags.map((t) => h('span', { class: 'tag', text: t }))))),
h('div', { class: 'card parch' }, facts),
h('div', { class: 'card parch' }, h('div', { class: 'small muted', text: m.remains ? 'Effects' : m.product ? 'Effects of this pure substance (as the guild knows it)' : 'Known effects of the pure ingredient (mixtures must be tested)' }), asp,
(m.wild || m.remains) && m.form === 'solid' ? h('div', { class: 'small', text: 'Supplied whole: crush it in the pot with the pestle (Crush). Only what dissolves takes effect.' }) : null),
balance.length ? h('div', { class: 'card parch' }, h('div', { class: 'small muted', text: 'Nothing that grows is pure. Its side effects cancel against their opposites:' }), ...balance.map((t) => h('div', { class: 'small', text: '• ' + t }))) : null,
reactions.length ? h('div', { class: 'card parch' }, h('div', { class: 'small muted', text: 'Known reactions' }), ...reactions.map((r) => h('div', { class: 'small', text: `• ${r.name}: ${r.hint || ''}` }))) : null,
],
});
}
const OPPOSITE = {
fire: ['frost', 'frost cancels fire'], frost: ['fire', 'fire cancels frost'], death: ['vitality', 'life cancels death'],
toxicity: ['vitality', 'life mends poison, two parts of life to one of poison'], vitality: ['death', 'death (or poison) cancels life'],
acid: ['alkali', 'an alkali neutralises acid'], alkali: ['acid', 'an acid neutralises alkali'],
};
function balanceHints(st, m) {
const fx = Object.entries(m.effects || {}).filter(([, v]) => Math.abs(Number(v)) >= 1);
if (fx.length < 2) return [];
const main = fx.reduce((a, b) => (Math.abs(Number(b[1])) > Math.abs(Number(a[1])) ? b : a))[0];
const key = (k, v) => (k === 'acidity' ? (v < 0 ? 'alkali' : 'acid') : k);
const carries = (x, ch) => (ch === 'acid' ? Math.max(0, x.effects.acidity || 0) : ch === 'alkali' ? Math.max(0, -(x.effects.acidity || 0)) : x.effects[ch] || 0);
const out = [];
for (const [k, v] of fx) {
if (k === main) continue;
const opp = OPPOSITE[key(k, Number(v))];
if (!opp) continue;
const names = (st.world.wild || []).map(st.lookup).filter((x) => x && x.id !== m.id && x.effects && carries(x, opp[0]) >= 6 && x.wild.rank <= Math.max(st.rank, 1))
.sort((a, b) => carries(b, opp[0]) - carries(a, opp[0])).slice(0, 3).map((x) => x.name);
const label = k === 'acidity' ? (Number(v) < 0 ? 'Alkali' : 'Acid') : EFFECTS.find((e) => e.key === k).label;
out.push(`${label}: ${opp[1]}${names.length ? ` — e.g. ${names.join(', ')}` : ''}.`);
}
return out;
}
function openHint(lab) {
const st = lab.state;
const com = st.current;
if (!com) return;
const show = () => {
const ref = com.reference;
const main = ref.ingredients.slice().sort((a, b) => b.n - a.n).map((i) => st.lookup(i.id)).find((x) => x && x.effects && Object.values(x.effects).some((v) => Math.abs(v) >= 12));
const tips = [];
if (main) tips.push(`A guild alchemist would start from ${main.name}${main.wild ? ` (it grows in the ${main.wild.region === 'forest' ? 'Whisperwood' : main.wild.region === 'meadow' ? 'Sunlit Meadow' : main.wild.region === 'river' ? 'Willow Bank' : main.wild.region === 'quarry' ? 'Ironstone Quarry' : main.wild.region === 'moonfen' ? 'Moonfen' : 'Ember Crags'})` : ''}.`);
if (ref.ingredients.some((i) => i.ground)) tips.push('Crush what is whole with the pestle — only what dissolves takes effect.');
if (ref.steep && ref.steep.T < 15) tips.push('Part of this wants ice-cold water, not heat — cold, but not frozen.');
else if ((ref.heatTo ?? 20) > 40 && !com.activation) tips.push('Patience and gentle heat draw out more than stirring alone.');
if (ref.reduce) tips.push('It must be stronger than the herbs give plainly: boil some water off with the lid open — and cancel the side effects harder, for they grow too.');
if (com.activation) {
const cold = com.predicted && com.predicted.threshold !== null && com.predicted.threshold < 0;
tips.push(`This strength is out of reach for sleeping magic: it must be awakened. Mix everything first at room temperature, then ${cold ? 'chill' : 'heat'} the whole brew until it glows — and hold it there until the glow is even.`);
}
if (com.requirements.some((r) => r.key === 'purity')) tips.push('“No other effect above 1.2 %” is strict. Choose ingredients that do one thing, and test for the effects you did not ask for, too — “not detected” after one small dose is not yet proof.');
tips.push('How much, and with what? That you must find out. Test small doses before you bottle.');
modal({ title: 'Guild advice', body: [h('div', { class: 'card parch' }, ...tips.map((t) => h('div', { class: 'small', text: '• ' + t })))] });
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
function openBottleSize(lab, avail, onPick, o = {}) {
const st = lab.state;
const com = lab.sandbox ? null : st.current;
const per = SIM.ML_PER_PARTICLE;
const counterFree = o.counterFree !== false, shelfRoom = o.shelfRoom || 0;
let dest = /** @type {'counter'|'shelf'} */ (counterFree ? 'counter' : 'shelf');
const sizes = new Set([25, 50, 100, 150, 200, 300]);
if (com) sizes.add(com.bottleMl);
const list = [...sizes].sort((a, b) => a - b);
let m;
const pick = (ml) => { m.close(); onPick(Math.max(1, Math.round(ml / per)), dest); };
const btns = list.map((ml) => btn(`${ml} ml${com && ml === com.bottleMl ? ' · ordered' : ''}`, () => pick(ml), {
cls: com && ml === com.bottleMl ? 'primary' : '', disabled: ml / per > avail, act: 'bottle-' + ml,
}));
btns.push(btn(`All · ${avail * per} ml`, () => pick(avail * per), { act: 'bottle-all', title: 'Everything that can run out of the tap' }));
let destRow = null;
if (o.shelves) {
const opts = /** @type {[string, string, boolean][]} */ ([
['counter', counterFree ? 'To the counter (sell or test)' : 'Counter is taken', counterFree],
['shelf', shelfRoom > 0 ? `To the potion shelves · ${shelfRoom} free` : 'Potion shelves are full', shelfRoom > 0],
]);
const bs = opts.map(([k, label, ok]) => btn(label, () => { dest = /** @type {any} */ (k); sync(); }, { icon: k === 'shelf' ? 'shelf2' : 'deal', disabled: !ok, act: 'bottle-dest-' + k }));
const sync = () => bs.forEach((b, i) => b.classList.toggle('active', opts[i][0] === dest));
sync();
destRow = h('div', { class: 'row wrap bottle-dest' }, ...bs);
}
m = modal({
title: 'Bottle the potion',
body: [h('div', { class: 'card parch' },
h('div', { class: 'small', text: `It fills from the tap at the bottom (the lowest layer first): ${avail * per} ml can be drawn. A sealed bottle keeps its exact contents.` }),
destRow ? h('div', { class: 'small muted step-k', text: '1. Where to?' }) : null,
destRow,
h('div', { class: 'small muted step-k', text: destRow ? '2. How much?' : 'How much?' }),
h('div', { class: 'row wrap bottle-sizes' }, ...btns))],
});
return m;
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
hutchSummary(summary.colony),
h('div', { class: 'card parch' }, h('b', { text: `Tomorrow: ${st.marketEvent.name}` }), h('div', { class: 'small', text: st.marketEvent.text })),
st.nextRank() ? h('div', { class: 'small muted', text: `Next rank: ${st.nextRank().name} at ${st.nextRank().rep} reputation.` }) : null,
],
foot: [btn('Start the new day', () => document.querySelector('.overlay .modal-head .btn').dispatchEvent(new MouseEvent('click')), { cls: 'primary', icon: 'sun', act: 'next-day', title: 'Dawn: gather in the Wilds, then open the door at the Counter' })],
});
}
function hutchSummary(col) {
if (!col || !(col.born.length || col.grown.length || col.died.length || col.lost || col.conceived)) return null;
const rows = [];
if (col.born.length) rows.push(h('span', { class: 'k', text: 'Kits born' }), h('span', { text: `${col.born.length} (${[...new Set(col.born.map((b) => b.mother))].join(', ')})` }));
if (col.grown.length) rows.push(h('span', { class: 'k', text: 'Grown up' }), h('span', { text: col.grown.map((g) => g.name).join(', ') }));
if (col.died.length) rows.push(h('span', { class: 'k', text: 'Died' }), h('span', { text: col.died.map((d) => `${d.name} (${causeWord(d.cause)})`).join(', ') }));
if (col.conceived) rows.push(h('span', { class: 'k', text: 'Expecting' }), h('span', { text: `${col.conceived} doe${col.conceived > 1 ? 's' : ''}` }));
return h('div', { class: 'card parch hutch-summary', 'data-summary': 'hutch' },
h('div', { class: 'row' }, icon('rabbit'), h('b', { text: 'The hutch' })),
h('div', { class: 'kv' }, ...rows),
col.lost ? h('div', { class: 'small muted', text: `The hutch was too full for ${col.lost} more kit${col.lost > 1 ? 's' : ''}; the breeder took them.` }) : null);
}
function showAnalysis(lab, m, recipe, title = 'Analysis of the brew') {
const st = lab.state;
const comp = Object.entries(m.composition).sort((a, b) => b[1] - a[1]);
const sand = lab.sandbox;
const aura = sand || st.has('arcanometer') ? EFFECTS.filter((e, k) => Math.abs(m.effects[k]) >= 3).map((e) => e.label).join(', ') || 'no aura' : null;
const kv = (k, v) => [h('span', { class: 'k', text: k }), h('span', { text: v })];
modal({
title,
body: [
h('div', { class: 'card parch' }, h('div', { class: 'kv' },
h('span', { class: 'k', text: 'Colour' }), h('span', {}, swatch(m.color), ' ' + describeColor(m.color)),
...kv('Volume', `${m.ml} ml`),
...kv('Temperature', `${Math.round(m.temperature)}°C`),
...kv('Mixed', sand ? `stability ${Math.round(m.stability)}` : evennessWord(m.stability)),
...kv('Weight', sand ? `${m.density.toFixed(3)} g/ml` : densityWord(m.density)),
...kv('Thickness', sand ? `${viscosityClass(m.viscosity)} (${m.viscosity < 100 ? m.viscosity.toFixed(1) : Math.round(m.viscosity)} cP)` : viscosityClass(m.viscosity)),
...(sand ? [...kv('Volatility', String(Math.round(m.volatility))), ...kv('Charge', `${m.charge >= 0 ? '+' : ''}${m.charge.toFixed(2)}`)] : []),
...kv('Effects', 'unknown — test a dose in Trials'),
...(aura ? kv('Aura', aura) : []),
)),
h('div', { class: 'card parch' }, h('div', { class: 'small muted', text: 'Composition' }), ...comp.map(([id, f]) => h('div', { class: 'small', text: `${(f * 100).toFixed(1)}%  ${st.lookup(id) ? st.lookup(id).name : id}` }))),
lab.sandbox ? null : h('div', { class: 'row' }, btn('Save as recipe', () => { const ev = st.addRecipe({ ...recipe, name: 'Experiment ' + (st.recipes.length + 1) }); for (const e of ev) lab.announce(e); toast('Recipe saved', '', 'book'); }, { icon: 'book' })),
],
});
}
function openRecipes(lab) {
if (lab.showView) { lab.showView('book'); lab.views.book.open('recipes'); return; }
}
function renderRecipes(lab, container, rerender) {
const st = lab.state;
const m = { body: container, close: () => {} };
const render = () => {
clear(m.body);
if (!st.recipes.length) {
m.body.appendChild(h('div', { class: 'card parch', text: 'Your recipe book is empty. After bottling a potion you can save how you made it here, then prepare it again later.' }));
return;
}
for (const r of st.recipes) {
const ing = r.ingredients.map((i) => `${i.ml} ml ${st.lookup(i.id) ? st.lookup(i.id).name : '?'}${i.ground ? ' (ground)' : ''}`).join(', ');
const steps = r.steps || [];
const conf = recipeConfidence(r);
const canAfford = r.ingredients.every((i) => lab.sandbox || st.stock(i.id) >= i.ml);
const actions = h('div', { class: 'row', style: { flexWrap: 'wrap' } },
btn('Prepare', () => { prepareRecipe(lab, r); if (lab.showView) lab.showView('brew'); }, { icon: 'pour', disabled: !canAfford, title: canAfford ? 'Pour the ingredients in order; you follow the steps' : 'Not enough stock', act: 'prepare' }),
st.has('homunculus') ? btn('Homunculus', () => { if (lab.startHomunculus(r) !== false && lab.showView) lab.showView('brew'); }, { icon: 'homunculus', disabled: !canAfford, act: 'homunculus', title: 'The homunculus follows every recorded step in the real cauldron' }) : null,
btn('', async () => { const name = prompt('Rename recipe', r.name); if (name) { r.name = name.slice(0, 40); render(); } }, { icon: 'scroll', cls: 'icon', title: 'Rename' }),
btn('', async () => { if (await confirmDialog('Delete recipe?', r.name, 'Delete', 'danger')) { st.recipes.splice(st.recipes.indexOf(r), 1); render(); } }, { icon: 'trash', cls: 'icon danger', title: 'Delete' }),
);
const verified = r.verified && Object.keys(r.verified).length;
const ev = r.evidence || {};
const weakest = Object.values(ev).reduce((w, e) => (w === null || evidenceRank(e.level) < evidenceRank(w) ? e.level : w), null);
const stepList = h('ol', { class: 'recipe-steps' }, ...steps.map((x) => h('li', { class: 'small' + (x.op === 'skim' || x.op === 'distil' ? ' manual' : ''), text: describeStep(x, st.lookup) })));
const limits = r.limits && r.limits.length ? r.limits : [];
m.body.appendChild(h('div', { class: 'item parch recipe', 'data-recipe': r.id || '', 'data-confidence': conf, 'data-procedure': r.approx ? 'approximate' : 'recorded' },
swatch(r.result.color),
h('div', {},
h('div', { class: 'title', text: r.name }),
h('div', { class: 'meta' }, h('b', { text: 'Formulation: ' }), ing),
steps.length ? h('details', { class: 'meta steps' }, h('summary', {}, h('b', { text: 'Procedure: ' }), `${steps.length} steps${r.approx ? ` — approximate (${r.approxWhy || 'saved before procedures were kept'}): a replay may not give the same potion` : ' — recorded as it was brewed'}`), stepList) : null,
limits.length ? h('div', { class: 'meta muted', text: `The homunculus cannot do the ${limits.join(' or ')}: it skips ${limits.length > 1 ? 'those steps' : 'that step'}.` }) : null,
h('div', { class: 'meta', text: `Result: ${describeColor(r.result.color)}${r.quality !== null && r.quality !== undefined ? ` · sold at ${Math.round(r.quality * 100)}% quality` : ''}` }),
h('div', { class: 'meta' }, h('span', { class: verified ? 'ok' : 'muted', text: verified ? 'Tested: ' : 'Untested formula — effects unknown' }), ...(verified ? fxChips(r.verified, 0.5) : []),
weakest ? h('span', { class: 'muted', text: ` · ${weakest === 'preliminary' ? 'one reading' : weakest}` }) : null),
h('div', { class: 'meta conf conf-' + conf }, h('b', { text: 'Reproduction: ' }), `${CONF_LABEL[conf]} — ${CONFIDENCE_TEXT[conf]}${r.brews ? ` (brewed ${r.brews}×, reproduced ${r.reproduced | 0}×${r.mismatched ? `, differed ${r.mismatched}×` : ''})` : ''}`),
),
actions,
));
}
};
render();
void rerender;
}
const CONF_LABEL = { untested: 'Untested', tested: 'Tested once', reproduced: 'Reproduced', unreliable: 'Unreliable' };
function prepareRecipe(lab, r) {
const steps = r.steps || [];
const firstOther = steps.findIndex((x) => x.op !== 'pour');
const lead = steps.length ? steps.slice(0, firstOther < 0 ? steps.length : firstOther).filter((x) => x.op === 'pour').map((x) => ({ id: x.id, ml: x.ml })) : r.ingredients.slice();
const queue = lead.length ? lead : r.ingredients.slice();
const rest = steps.slice(firstOther < 0 ? steps.length : firstOther);
const next = () => {
if (!queue.length) {
toast('Ingredients poured', rest.length ? `Next: ${rest.slice(0, 3).map((x) => describeStep(x, lab.state.lookup)).join('; ')}${rest.length > 3 ? '… (see the book)' : ''}.` : `Now ${r.stirSeconds ? 'stir' : 'mix'} and serve at ${r.serveTemp}°C.`, 'book', 7000);
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
function openJournal(lab, tab = 'journal') {
if (lab.showView) { lab.showView('book'); lab.views.book.open(tab === 'discoveries' ? 'journal' : tab); }
}
function renderJournal(lab, container, tab = 'journal') {
const st = lab.state;
const m = { body: container };
const current = tab === 'journal' ? 'discoveries' : tab;
const render = () => {
clear(m.body);
if (current === 'discoveries') {
const entries = Object.values(st.journal).filter((e) => e.kind !== 'ingredient').sort((a, b) => b.day - a.day);
const total = st.world.reactions.length;
m.body.appendChild(h('div', { class: 'small muted', text: `Reactions discovered: ${st.reactionsDiscovered()} of ${total}. Keep experimenting — heat, cold, stirring and new combinations all reveal secrets.` }));
if (!entries.length) m.body.appendChild(h('div', { class: 'card parch', text: 'Nothing recorded yet. Watch closely as you brew: boiling, freezing, dough, dissolving and reactions are all noted here.' }));
for (const e of entries) {
m.body.appendChild(h('div', { class: 'card parch' }, h('div', { class: 'row' }, icon(e.kind === 'reaction' ? 'eye' : e.kind === 'fire' ? 'flame' : e.kind === 'phase' ? 'thermo' : e.kind === 'arcane' ? 'awaken' : 'scroll'), h('b', { text: e.title }), h('span', { class: 'spacer' }), h('span', { class: 'small muted', text: `Day ${e.day}` })), h('div', { class: 'small', text: e.text })));
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
m.body.appendChild(h('div', { class: 'item parch' }, s.color ? swatch(s.color) : icon('flask'), h('div', {}, h('div', { class: 'title', text: s.potion }), h('div', { class: 'meta', text: `Day ${s.day} · ${s.customer} (${s.title}) · ${s.quality === null || s.quality === undefined ? 'awaiting their verdict' : Math.round(s.quality * 100) + '%'}` })), h('span', {}, h('span', { class: 'stars', text: s.stars === null || s.stars === undefined ? '…' : starsText(s.stars) }), h('div', { class: 'small', text: `+${coins(s.paid)}` }))));
}
}
};
render();
}
function openPause(lab) {
const app = lab.app;
let m;
const items = [
btn('Back to the game', () => m.close(), { cls: 'primary', icon: 'speed', act: 'resume' }),
btn('How to play', () => { m.close(); openHelp(); }, { icon: 'help', act: 'help' }),
];
if (!lab.sandbox) items.push(btn('Guided tour', () => { m.close(); if (lab.tutorial) { lab.tutorial.start(true); lab.showView('brew'); } }, { icon: 'bulb', act: 'tour', title: 'Walk through every part of the shop again' }));
items.push(btn('Settings & saves', () => { m.close(); openSettings(app, lab); }, { icon: 'gear', act: 'settings' }));
if (lab.sandbox && lab.receiver && lab.receiver.count) items.push(btn('Pour back distillate', () => { lab.pourReceiver(); m.close(); }, { icon: 'alembic' }));
items.push(btn(lab.sandbox ? 'Leave the experiment' : 'Save & quit to title', () => { m.close(); app.showMenu(); }, { icon: 'door', act: 'quit' }));
m = modal({ title: lab.sandbox ? 'Free Experiment' : 'Menu', body: h('div', { class: 'list' }, items) });
}
function openReceiver(lab) {
const st = lab.state, rec = lab.receiver;
if (!rec || !rec.count) return;
const tot = Object.values(rec.comp).reduce((a, b) => /** @type {number} */ (a) + /** @type {number} */ (b), 0) || 1;
const parts = Object.entries(rec.comp).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([id, f]) => `${st.lookup(id) ? st.lookup(id).name : id} ${Math.round((f / tot) * 100)}%`).join(', ');
let m;
m = modal({
title: `Receiver flask · ${rec.count * SIM.ML_PER_PARTICLE} ml`,
body: h('div', { class: 'card parch' }, h('div', { class: 'small', text: `What the alembic drew off: ${parts}.` }),
h('div', { class: 'small muted', text: 'Water and spirit boil off together: a distillate is rarely one thing.' })),
foot: [
btn('Pour into the cauldron', () => { lab.pourReceiver(); m.close(); }, { icon: 'pour', act: 'receiver-pour' }),
btn('Pour away', () => { lab.receiver = null; m.close(); }, { icon: 'trash', cls: 'danger', act: 'receiver-away' }),
],
});
}
function openHelp() {
const sec = (title, ic, lines, open = false) => h('details', { class: 'card parch help-sec', ...(open ? { open: true } : {}) },
h('summary', {}, icon(ic), h('span', { text: title })),
...lines.map((l) => h('div', { class: 'small', text: '• ' + l })));
const body = h('div', { class: 'help' },
h('div', { class: 'card parch help-day' }, h('h3', { text: 'A day in the shop' }),
h('ol', { class: 'small' }, ...[
'Dawn: gather herbs and minerals in the Wilds (dawn flowers close once the shop opens).',
'Open the door at the Counter and read the customer’s order.',
'Brew: pour, crush, stir, heat or chill in the cauldron.',
'Test a dose on a rabbit in Trials: only a test shows what a mixture does.',
'Bottle it, check the label and sell it at the Counter — agree on a price.',
'When the last customer has gone (dusk), close the shop for the night.',
].map((t) => h('li', { text: t })))),
sec('Orders and selling', 'stall', ['Customers ask for an effect — healing, strength, love, fire… — at a strength in percent (everyday orders want about 8–15 %).', 'Most orders forbid side effects: “no other effect above 1.2 %”. Every other kind of magic in the bottle must stay that faint.', 'Before a sale you write the label — tested values, the guild theory’s estimates, “none” or unknown — and bargain over the price. The customer comes back the next day: pleased, or with a complaint. Refund them, dispute it with your trial records, or turn them away.', 'Bottle onto the potion shelves whenever there is room (3 bottles; more with a Bottle Shelf, Potion Cabinet or Bottle Cellar). Bottles of one batch share its trials.', 'Honest, well-tested potions earn reputation. Reputation raises your rank, which opens regions, ingredients, equipment and harder orders.'], true),
sec('Ingredients and side effects', 'leaf', ['The Shop sells no prepared reagents — only free well water and two plain solvents, oil and spirit. Every effect comes from what you gather.', 'Nothing that grows is pure: each herb or mineral brings side effects. Cancel them with their opposites — fire and frost, life and death (life also mends poison, two parts to one), acid and alkali.', 'Long-press (or right-click) a jar to see what it does and what cancels its side effects.', 'You know what each plain ingredient does. You do NOT know what a mixture does: extraction, heat, reactions and hidden laws change it.']),
sec('Brewing', 'cauldron', ['Pour: tap a jar, then a dose button (25–250 ml) — or hold your finger in the cauldron, or drag a jar onto it.', 'Crush: whole roots, leaves and stones go into the pot whole and give up almost nothing until you break them up with Crush (the pestle).', 'Steep at the right heat: most herbs give two to three times as much held warm in their steeping window (see the herb’s card and your journal). Some want ice-cold water: Frostcap near 9 °C gives about three times as much — but frozen solid gives less. Heartpetal wilts above about 85 °C.', 'Stir after every addition: an unstirred brew pours unevenly, so later bottles may not match the tested dose. Auto stirs for you (the Clockwork Stirrer about three times as fast).', 'The fire control: right heats, left cools; tap Off beside it (or press 0) to put it out at once. The lid keeps steam in; boiling with the lid off makes a brew smaller and stronger — side effects too. Add water to weaken it.', 'Tap the ml · °C readout over the cauldron to see what is in it; Inspect reads one spot; Sample measures what a bottle would hold.']),
sec('Arcane awakening', 'awaken', ['Magical ingredients carry a hidden arcane threshold. Heat the brew past it (or, for cold magic, chill it below) and the magic awakens: it glows and acts two to three times stronger — side effects too.', 'In a blend the threshold is the mix of its magical ingredients’ thresholds, by volume. Mix first at room temperature, then heat or chill; a half-mixed brew awakens unevenly.', 'Awakened magic stays awake when it cools, is bottled or kept. Only dilution and reactions undo it. The Arcanometer reads a brew’s threshold.']),
sec('Trials and rabbits', 'rabbit', ['Choose a rabbit and give it a dose (5, 10 or 25 ml) from the cauldron tap or the sealed vial. One trial reads every effect at once.', 'Each reading is uncertain: the ± margin is how far the truth may lie. One reading is a rough guess; repeating it on the same rabbit helps a little; other rabbits help most (detected once → repeated → corroborated).', '“Not detected” is not proof of absence: a faint effect can hide below the noise. Cautious customers want readings repeated or corroborated, and every customer pays more for a well-tested label.', 'Effects pile up in a rabbit and fade slowly. Past its own hidden limit an effect runs out of control and can kill it; fire and acid burn; strength and vitality can make it attack; love makes it mate. A purging draught washes everything out. Rabbits can be fed, bred, bought and put down; a body’s remains can be recovered once as an ingredient.', 'When a trial surprises you, a hidden law may be at work. Confirm it twice and your theory learns it.']),
sec('Wilds', 'tree', ['Tap a mature plant in the picture, or its button, to gather. Every plant grows from sprout to ripe to mature, and only a mature one can be harvested. A harvest leaves a mark on the ground that fades; new sprouts come up at random spots until the region is full again, even while the game is closed.', 'Thorough digs the plant out for twice as much, but its kind then sprouts at half pace. Roots, seams, mosses and dust need the Forager’s Kit for a full harvest.', 'Twilight plants open only at dawn (before you open the shop) or at dusk (after the last customer). The weather changes daily. New regions open with rank.']),
sec('Recipes and the Book', 'book', ['After a sale you can save the brew as a recipe: what went in, and every step in order. Prepare pours it again; the Brass Homunculus replays every step.', 'The Book also keeps every trial, the laws you discovered, all ingredients, your journal, awards and sales.']),
sec('Keys and tips', 'bulb', ['Keys: 1 pour · 2 stir · 3 crush · 5 inspect · L lid · B bottle · F speed · A auto-stir · arrows fire · 0 fire off · S shop · R recipes · C/V/W/T/J rooms · Esc menu.', 'Advice at the Counter buys a hint for a hard order.', 'Orders far below your rank earn little reputation; a technique sold well for the first time earns a bonus.', 'Out of money? The guild helps a struggling apprentice once a day — and well water is always free.', 'The Free Experiment has every tool, the skimmer, the alembic, a heat map and exact physical readings.']),
);
body.addEventListener('toggle', (e) => {
const t = /** @type {HTMLDetailsElement} */ (e.target);
if (t.open) for (const d of body.querySelectorAll('details[open]')) if (d !== t) /** @type {HTMLDetailsElement} */ (d).open = false;
}, true);
modal({ title: 'How to play', wide: true, body: [body] });
}
function openSettings(app, lab) {
const s = app.settings;
const vol = (key, label) => {
const inp = /** @type {HTMLInputElement} */ (h('input', { type: 'range', class: 'vol', min: '0', max: '100', value: String(Math.round(s[key] * 100)), 'aria-label': label }));
inp.addEventListener('input', () => {
s[key] = Number(inp.value) / 100;
app.applySettings();
if (key === 'music' && s.musicOn !== s.music > 0) { s.musicOn = s.music > 0; audio.music(s.musicOn); }
});
return h('div', { class: 'toggle-row' }, h('span', { text: label }), inp);
};
const check = (key, label, after) => {
const inp = /** @type {HTMLInputElement} */ (h('input', { type: 'checkbox', 'aria-label': label }));
inp.checked = !!s[key];
inp.addEventListener('change', () => { s[key] = inp.checked; app.applySettings(); after && after(); });
return h('div', { class: 'toggle-row' }, h('span', { text: label }), inp);
};
const quality = /** @type {HTMLSelectElement} */ (h('select', { 'aria-label': 'Graphics quality', style: { width: '55%' } }, ...[['auto', 'Automatic'], ['high', 'Best looking'], ['medium', 'Balanced'], ['low', 'Battery saver']].map(([q, t]) => h('option', { value: q, text: t }))));
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
h('div', { class: 'small', text: 'Saved automatically on this device. Export a file to back it up or move it to another device.' }),
h('div', { class: 'row', style: { flexWrap: 'wrap', marginTop: '6px' } },
btn('Export save', () => { lab.save(); exportSave(lab.state); }, { icon: 'scroll', act: 'export' }),
btn('Import save', () => fileIn.click(), { icon: 'plus', act: 'import' }),
fileIn,
)) : h('div', { class: 'card parch' }, h('h3', { text: 'Saves' }), h('div', { class: 'row', style: { flexWrap: 'wrap' } }, btn('Import save', () => fileIn.click(), { icon: 'plus', act: 'import' }), fileIn));
modal({
title: 'Settings',
onClose: () => app.saveSettings(),
body: [
h('div', { class: 'card parch' }, h('h3', { text: 'Sound' }), vol('master', 'Volume'), vol('sfx', 'Effects'), vol('music', 'Music'), check('muted', 'Mute everything')),
h('div', { class: 'card parch' }, h('h3', { text: 'Display' }), h('div', { class: 'toggle-row' }, h('span', { text: 'Graphics' }), quality),
h('div', { class: 'small muted', text: 'Automatic lowers the detail when the game runs slowly. Battery saver draws 30 frames a second without lighting. The brewing itself is identical in every mode.' }),
check('showFps', 'Show frame rate')),
saveSection,
h('div', { class: 'small muted credits', text: 'The Alchemist’s Shop — all art, sound, font and code made for this game. Runs fully offline.' }),
],
});
}
return { jarCanvas, fxChips, openShop, openIngredient, openHint, openBottleSize, showDaySummary, showAnalysis, openRecipes, renderRecipes, openJournal, renderJournal, openPause, openReceiver, openHelp, openSettings };
})();
// src/ui/trade.js
const __m71 = (() => {
const { h, btn, modal, toast, coins, clear, starsText } = __m2;
const { icon } = __m3;
const { drawPortrait } = __m60;
const { audio } = __m4;
const { EFFECTS, EFFECT_BY_KEY } = __m13;
const { draftLabel, openNegotiation: beginNegotiation, proposePrice, acceptOffer, relevantEffects, trustReport, editClaim, proofGaps, claimSigma, claimStars, labelStars, MAX_STARS } = __m46;
const { PURITY_LIMIT } = __m25;
const { shortName } = __m22;
function openIdentify(lab, vial, onDone) {
const st = lab.state;
const draft = vial.label ? JSON.parse(JSON.stringify(vial.label)) : draftLabel(vial, lab.vialTheory(vial), st.day);
const com = st.current;
const relevant = com ? new Set(relevantEffects(com)) : new Set(EFFECTS.map((e) => e.key));
const rows = h('div', { class: 'label-rows' });
let open = '';
const render = () => {
clear(rows);
for (const e of EFFECTS) {
const c = draft.claims[e.key];
const lvl = c.evidence ? c.evidence.level : 'preliminary';
const sigma = claimSigma(c);
const src = c.source === 'trial' ? h('span', { class: 'src trial lvl-' + lvl, title: `Measured in trials of this batch: ${c.evidence ? `${c.evidence.n} reading${c.evidence.n === 1 ? '' : 's'} on ${c.evidence.r} rabbit${c.evidence.r === 1 ? '' : 's'}, standard deviation ${sigma} (±${c.evidence.u} at 95 %)` : 'one reading'}` }, icon('dropper', 'sm'), lvl === 'preliminary' ? ' 1 reading' : ` ${lvl}`)
: c.kind === 'unknown' ? h('span', { class: 'src unknown', text: 'unknown' })
: c.source === 'estimate' ? h('span', { class: 'src est', text: `theory${c.spread ? ' ±' + c.spread : ''}` }) : h('span', { class: 'src you', text: 'your claim' });
const sd = c.source === 'trial' && sigma !== null ? ` σ ${sigma}` : '';
const val = c.kind === 'value' ? `${Math.round((c.value || 0) * 10) / 10}%${sd}` : c.kind === 'none' ? `none (< ${PURITY_LIMIT}%)${sd}` : '?';
const cs = claimStars(c);
const edit = (op) => () => { draft.claims[e.key] = editClaim(c, e.key, op); render(); };
const row = h('div', { class: 'label-row' + (relevant.has(e.key) ? ' relevant' : '') + (c.kind === 'unknown' ? ' unknown' : '') + (open === e.key ? ' open' : ''), 'data-claim': e.key },
icon(e.icon, 'sm'), h('span', { class: 'lk', text: e.label }), src, h('b', { class: 'lv' }, val, cs === null ? null : h('span', { class: 'acc-stars', title: accuracyTitle(cs), text: ' ' + starsText(cs, MAX_STARS) })),
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
const ls = labelStars(draft);
accEl.textContent = ls === null ? '' : `Accuracy ${starsText(ls, MAX_STARS)} — ${accuracyTitle(ls)}`;
if (com) {
const rep = trustReport(com, draft, st.rank);
const t = rep.trust;
const gaps = proofGaps(com, draft);
trustEl.textContent = `${shortName(com.customer.name)} will trust this label ${t >= 0.9 ? 'fully' : t >= 0.7 ? 'well' : t >= 0.5 ? 'somewhat' : 'barely'}: ${rep.reasons.join('; ')}.${gaps.length ? ` Before buying they want ${gaps.some((g) => g.have === 'untested') ? 'the untested effects tested' : 'stronger proof'}.` : ''}`;
}
};
const trustEl = h('div', { class: 'small' });
const accEl = h('div', { class: 'small acc-line', 'data-acc': 'label' });
let m;
m = modal({
title: 'Label the potion',
wide: true,
body: [
h('div', { class: 'card parch' },
h('div', { class: 'small', text: 'Claim what this potion does. Tested values come from trials of this batch (more readings, more rabbits: more trust); the rest are the guild theory’s estimates, or unknown. Customers pay for your claims — and come back if they were wrong. Tap a line to change it.' }),
com ? h('div', { class: 'small muted', text: 'Highlighted: the effects this order cares about.' }) : null,
accEl, trustEl),
h('div', { class: 'card parch' }, rows),
],
foot: [btn('Seal the label', () => { m.close(); audio.play('page'); onDone(draft); }, { cls: 'primary', icon: 'tag', act: 'label-seal' })],
});
render();
return m;
}
function openNegotiation(lab, com, vial, onEnd) {
const st = lab.state;
const key = JSON.stringify(vial.label.claims);
const prev = com.haggle && com.haggle.vialId === vial.id && com.haggle.state === 'open' ? com.haggle : null;
let n;
if (prev && prev.labelKey === key) n = prev;
else {
n = beginNegotiation(com, vial, vial.label, st.rank);
if (prev) {
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
const WHY = { fit: 'Fit', trust: 'Trust', quantity: 'Measure', temper: 'Temper', history: 'History' };
function showDeal(lab, com, sale, recipe, onDone) {
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
function followUpCard(lab, f) {
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
function claimSummary(claims) {
const parts = [];
for (const e of EFFECTS) {
const c = claims[e.key];
if (!c || c.kind === 'none') continue;
const sigma = c.source === 'trial' ? claimSigma(c) : null;
parts.push(c.kind === 'unknown' ? `${e.label} ?` : `${e.label} ${Math.round(c.value)}%${c.source === 'trial' ? ` (tested${sigma !== null ? `, σ ${sigma}` : ''})` : ''}`);
}
return parts.length ? parts.join(', ') + '; nothing else' : 'no magical effect';
}
function accuracyTitle(n) {
return ['a rough guess: test it again, on other rabbits', 'fairly reliable', 'reliable', 'precise: a narrow standard deviation'][n] || '';
}
function labelLine(label) {
const n = labelStars(label);
return `${n === null ? '' : starsText(n, MAX_STARS) + ' '}${claimSummary(label.claims)}`;
}
return { openIdentify, openNegotiation, showDeal, followUpCard, claimSummary, accuracyTitle, labelLine, EFFECT_BY_KEY };
})();
// src/ui/tutorial.js
const __m72 = (() => {
const { h, btn, placeToasts } = __m2;
const { PHASE } = __m24;
const { TUTORIAL_HERBS } = __m16;
const { shortName } = __m22;
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
const water = st.lookup(R.water);
const H = TUTORIAL_HERBS, leaf = st.lookup(H.healer), sun = st.lookup(H.warmer);
const poured = (id) => st.brewLog.reduce((a, e) => a + (e.type === 'pour' && e.id === id ? e.ml : 0), 0);
const brewT = () => {
const p = lab.sim.p;
let T = 0, n = 0;
for (let i = 0; i < p.count; i++) if (p.phase[i] !== PHASE.GAS) { T += p.temp[i]; n++; }
return n ? T / n : 20;
};
const wholeSolids = () => {
const p = lab.sim.p;
let n = 0;
for (let i = 0; i < p.count; i++) if (p.phase[i] === PHASE.SOLID) n++;
return n;
};
const tab = (id) => () => lab.tabEls[id] && lab.tabEls[id].b;
const q = (sel) => () => /** @type {HTMLElement|null} */ (lab.el.querySelector(sel));
const inView = (id) => () => lab.view === id;
const rabbitTested = () => st.trials.records.some((r) => r.subjectId === 'rabbit' && r.batchId === st.batch.id);
const who = st.current && st.current.customer ? shortName(st.current.customer.name) : 'the customer';
return [
{ text: 'Welcome to your shop, alchemist! This tour shows every part of it while you brew your first order. Follow the glowing outline: do what it asks, or press Next.', button: 'Let’s begin' },
{ text: 'The top bar: ☰ opens the menu (how to play, settings, this tour). Then your coins, your rank (its bar fills with reputation), the day and which customer of the day this is. Shop sells ingredients and equipment.', target: () => lab.topbar, button: 'Next' },
{ text: 'Five rooms along the edge: Counter (customers), Brew (the cauldron), Wilds (gathering), Trials (testing on rabbits) and Book (recipes and notes). A red mark means something is waiting there.', target: () => lab.tabbar, button: 'Next' },
{ text: 'A customer is waiting. Open the Counter.', target: tab('counter'), done: inView('counter') },
{ text: 'The order: every line must be met — the effect and its strength, purity (no other effect above a limit) and the quantity. “?” means not tested yet. Advice buys a hint; Decline sends a customer away.', target: q('.customer-card .reqs'), button: 'Next' },
{ text: 'Let’s brew it. Press “Brew it”.', target: () => lab.el.querySelector('[data-act=go-brew]') || tab('brew')(), done: inView('brew') },
{ text: 'The order strip stays above the cauldron: each chip fills as the brew meets that line of the order. Tap the strip to go back to the Counter.', target: () => lab.strip, button: 'Next' },
{ text: `Tap the jar of ${water.name} on the shelf to pick it up. The small number on a jar is how many ml you have.`, target: () => lab.jarEls[R.water] && lab.jarEls[R.water].el, done: () => lab.selected === R.water },
{ text: 'Pour about 110 ml: tap 100, then 25. You can also hold your finger in the cauldron to pour freely, or drag a jar onto it.', target: () => lab.doseEl, done: () => poured(R.water) >= 95 },
{ text: `Now pick up the ${leaf.name}. Tip: long-press (or right-click) any jar to read what it does — this one heals, but leaves a frosty bite.`, target: () => lab.jarEls[H.healer] && lab.jarEls[H.healer].el, done: () => lab.selected === H.healer },
{ text: 'Pour 50 ml. The leaves go in whole — and whole leaves give up almost nothing, so you will crush them in a moment.', target: () => lab.doseEl, done: () => poured(H.healer) >= 45 && !lab.sim.emitter.pouring },
{ text: `Nothing that grows is pure, but opposites cancel: fire–frost, life–death, acid–alkali. Pick up the ${sun.name}: its fire cancels the leaf’s frost.`, target: () => lab.jarEls[H.warmer] && lab.jarEls[H.warmer].el, done: () => lab.selected === H.warmer },
{ text: 'Pour 25 ml — half as much as the leaf, so fire and frost balance out.', target: () => lab.doseEl, done: () => poured(H.warmer) >= 20 && !lab.sim.emitter.pouring },
{ text: 'Now choose Crush (the pestle) and drag it back and forth over the leaves at the bottom of the pot. Only crushed herbs give up their magic — nothing is ground for you.', target: () => lab.toolBtns.pestle, done: () => wholeSolids() <= 3 || (lab.tool === 'pestle' && (lab.sim.tool.stirDistance - (this.flags.crush0 ?? (this.flags.crush0 = lab.sim.tool.stirDistance))) > 25) },
{ text: 'Choose Stir and drag circles through the brew: stirring spreads the magic evenly. (Auto, further along, stirs for you while you hold it.)', target: () => lab.toolBtns.spoon, done: () => (lab.sim.tool.stirDistance - (this.flags.stir0 ?? (this.flags.stir0 = lab.sim.tool.stirDistance))) > 12 || lab.sim.tool.auto || brewT() >= 40 },
{ text: 'Herbs steep only when warm. Slide the fire control right (left cools) and bring the brew to about 60 °C. The lid keeps steam in; with the lid off, boiling makes a brew smaller and stronger.', target: () => lab.controls, done: () => brewT() >= 50 },
{ text: 'The other tools: Crush (whole herbs, stones, ice), Inspect (tap a spot to read it), Sample (what a bottle would hold), 1× (speeds up time), Empty. Tap the ml · °C readout over the cauldron to see what is inside.', target: () => lab.toolbar, button: 'Next' },
{ text: 'Does it really heal? What a mixture does is unknown until it is tested. Open the Trials room.', target: tab('trials'), done: inView('trials') },
{ text: 'Choose a rabbit (tap it) and press Give — or drag the dropper onto it. The dose is real potion from the cauldron’s tap.', target: () => document.querySelector('[data-act=test-rabbit]') || lab.views.trials.hutch.el, done: rabbitTested },
{ text: 'The result: each effect the rabbit showed, with a ± margin. One reading is a rough guess; a second rabbit narrows it most — and demanding customers insist on that.', target: q('.estimate-card'), button: 'Next' },
{ text: 'Look after your rabbits here: buy, feed, breed, and purge one to wash a potion out. Too much of an effect can make a rabbit sick, wild or dead — every rabbit has its own hidden limits.', target: q('.hutch-manage'), button: 'Next' },
{ text: 'Back to the cauldron.', target: tab('brew'), done: inView('brew') },
{ text: 'Press Bottle and choose 100 ml (the order’s quantity). A bottle goes to the counter, or onto your potion shelves for later.', target: () => lab.bottleFab, done: () => this.flags.bottled },
{ text: `Your vial is on the counter, labelled from your trial. Press “Sell to ${who}”, agree on a price, then save the recipe to your book.`, target: () => document.querySelector('[data-act=serve]') || tab('counter')(), done: () => this.flags.sold },
{ text: 'Splendid — your first sale! The customer comes back tomorrow: pleased, or with a complaint you can refund, dispute with your trial records, or refuse. The potion shelves below keep sealed bottles for later customers.', target: () => lab.el.querySelector('.view-counter .shelf-card') || tab('counter')(), button: 'Next' },
{ text: 'Ingredients run out. Open the Wilds to gather more.', target: tab('wilds'), done: inView('wilds') },
{ text: 'Tap a mature plant in the picture, or its button, to gather it. Plants grow from sprout to ripe to mature; only mature ones can be harvested, and new sprouts come up until the ground is full. Thorough digs a plant out for twice as much, but its kind sprouts slowly. Some flowers open only at dawn or at dusk. New regions open as your rank rises.', target: q('.view-wilds .deposits'), button: 'Next' },
{ text: 'Now open the Book.', target: tab('book'), done: inView('book') },
{ text: 'The Book keeps your recipes (Prepare pours one again), every trial, the laws of magic you discover, all ingredients, your journal, awards and sales.', target: q('.book-tabs'), button: 'Next' },
{ text: 'The Shop sells ingredients, buys your surplus, and offers equipment: each piece lets you do something new (deep cold, a stirrer, a bigger cauldron, more shelves…).', target: q('[data-act=shop]'), button: 'Next' },
{ text: 'That is a day: at dawn gather in the Wilds, then open the door at the Counter; brew, test, bottle and sell; when the last customer has gone, close the shop. ☰ → How to play explains everything in detail. Good luck!', target: tab('counter'), button: 'Run my shop!' },
];
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
this.lab.el.classList.remove('touring');
if (this.target) this.target.classList.remove('highlight');
this.target = null;
placeToasts();
}
show() {
this.clearUi();
const steps = this.steps;
const s = steps[this.index];
if (!s) { this.finish(); return; }
const lab = this.lab;
const actions = h('div', { class: 'tutor-actions' },
h('span', { class: 'tutor-step', text: `${this.index + 1}/${steps.length}` }),
btn('End tour', () => this.finish(), { act: 'tutorial-skip', title: 'End the guided tour (restart it from ☰ Menu)' }),
s.button
? btn(s.button, () => this.advance(), { cls: 'primary', act: 'tutorial-next' })
: btn('Skip step', () => this.advance(), { act: 'tutorial-skip-step', title: 'Move on without doing this step' }),
);
this.box = h('div', { class: 'tutor parch' + (s.button ? '' : ' waiting'), role: 'note' }, h('div', { class: 'tutor-text', text: s.text }), actions);
lab.tutorSlot.appendChild(this.box);
lab.el.classList.add('touring');
const t = s.target ? s.target() : null;
if (t) { t.classList.add('highlight'); this.target = t; }
placeToasts();
}
advance() {
this.index++;
this.show();
}
notify(kind, data) {
if (!this.active) return;
if (kind === 'bottle') this.flags.bottled = true;
if (kind === 'view') {
if (this.index === this.steps.length - 1) { this.finish(); return; }
this.show();
}
if (kind === 'sold') { this.flags.sold = true; }
void data;
}
update() {
if (!this.active) return;
const s = this.steps[this.index];
if (!s) return;
if (s.done && s.done()) this.advance();
else if (this.box && Math.random() < 0.05) {
const t = s.target ? s.target() : null;
if (t && t !== this.target) { if (this.target) this.target.classList.remove('highlight'); t.classList.add('highlight'); this.target = t; }
}
}
}
return { Tutorial };
})();
// src/ui/views/counter.js
const __m73 = (() => {
const { h, btn, clear, coins, confirmDialog, starsText } = __m2;
const { icon } = __m3;
const { drawPortrait } = __m60;
const { drawBottle } = __m53;
const { PROPERTY_LABELS, scoreRequirement } = __m23;
const { techniqueById } = __m16;
const { EFFECT_INDEX, NE } = __m13;
const { EFFECT_BY_KEY } = __m13;
const { missingEffects, summarize, requirementEvidence } = __m27;
const { labelStars, MAX_STARS } = __m46;
const trade = __m71;
const { describeColor, rgbToHex } = __m8;
const { viscosityClass } = __m45;
const panels = __m69;
const { shortName } = __m22;
class CounterView {
constructor(lab) {
this.lab = lab;
this.el = h('section', { class: 'view view-counter', 'data-view': 'counter' });
}
build() {
this.refresh();
}
refresh() {
const lab = this.lab, st = lab.state;
const el = clear(this.el);
if (lab.sandbox) {
el.append(h('div', { class: 'card parch' }, h('h3', { text: 'Free Experiment' }), h('div', { class: 'small', text: 'No customers here: every reagent, tool and subject is yours to play with. Bottle what you like, test everything.' })));
this.vialCard(el);
return;
}
for (const f of st.dueFollowUps()) el.append(trade.followUpCard(lab, f));
const com = st.current;
if (!com) {
el.append(h('div', { class: 'card parch counter-empty' },
h('div', { text: st.dayOver ? `The last customer has left. Day ${st.day} is over.` : st.opened ? 'The shop is quiet.' : `Dawn of day ${st.day}. The shop is still closed.` }),
h('div', { class: 'small muted', text: st.dayOver ? 'Dusk: the twilight plants are open in the wilds until you close for the night.' : st.opened ? '' : 'Dawn flowers are open in the wilds only until you open the door. Brew ahead for the shelves, or open up when you are ready.' }),
h('div', { class: 'row wrap' },
st.dayOver ? btn('Close shop for the night', () => lab.endDay(), { cls: 'gold', icon: 'sun', act: 'end-day' })
: btn(st.opened ? 'Next customer' : 'Open the door', () => lab.bringCustomer(true), { cls: 'gold', icon: 'door', act: 'next-customer' }))));
this.vialCard(el);
this.shelfCard(el);
return;
}
const portrait = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'portrait big' }));
drawPortrait(portrait, com.customer.portrait, 'neutral');
const sum = st.vial ? summarize(st.vial.samples || seedSamples(st.vial)) : lab.currentCert();
const list = h('ul', { class: 'reqs full' });
for (const req of com.requirements) {
const isFx = !!EFFECT_BY_KEY[req.key];
const label = PROPERTY_LABELS[req.key] || req.key;
const status = isFx || req.key === 'purity' ? reqStatus(req, sum) : null;
const target = h('span', { text: req.label });
list.appendChild(h('li', { class: 'req' + (req.limit || req.key === 'purity' ? ' limit' : '') }, icon(isFx ? EFFECT_BY_KEY[req.key].icon : lab.reqIcon(req.key)), h('span', {}, h('span', { class: 'lbl-k', text: (req.limit ? 'Limit: ' : '') + label + ' ' }), target), status));
}
list.appendChild(h('li', { class: 'req' }, icon('flask'), h('span', {}, h('span', { class: 'lbl-k', text: 'Quantity ' }), `${com.bottleMl} ml`)));
el.append(h('div', { class: 'card parch customer-card' },
h('div', { class: 'cust-top' }, portrait, h('div', {},
h('div', { class: 'cust-name', text: `${com.customer.name}` }),
h('div', { class: 'small muted', text: `${com.customer.title}${com.contract ? ' · Guild contract' : ''}${com.grand ? ' · Grand Commission' : ''}` }),
h('div', { class: 'budget' }, icon('coin', 'sm'), ` up to ${coins(com.budget)}`))),
com.patron ? h('div', { class: 'small patron ' + (com.patron.trust > 0.2 ? 'ok' : com.patron.trust < -0.2 ? 'warn' : 'muted'), text: `A returning customer (${com.patron.visits} earlier visit${com.patron.visits === 1 ? '' : 's'}): ${com.patron.trust > 0.2 ? 'they trust your shop — less haggling, a bigger purse' : com.patron.trust < -0.2 ? 'they were let down before and want proof this time' : 'they know your shop'}.` }) : null,
h('div', { class: 'speech', text: '“' + com.dialogue + '”' }),
h('div', { class: 'potion-name', text: com.potionName }),
list,
this.techCard(com),
this.supplyCard(com),
this.shelfMatches(com),
h('div', { class: 'row wrap cust-actions' },
btn('Brew it', () => lab.showView('brew'), { icon: 'cauldron', cls: 'primary', act: 'go-brew', title: 'Go to the cauldron' }),
btn(com.hintCost ? `Advice · ${com.hintCost}` : 'Advice', () => panels.openHint(lab), { icon: 'bulb', act: 'hint', title: com.hintCost ? `A guild alchemist suggests an approach for ${com.hintCost} coins` : 'A guild alchemist suggests an approach' }),
com.tutorial ? null : btn('Decline', () => lab.decline(), { icon: 'door', act: 'decline', title: 'Send this customer away (no penalty)' }))));
this.vialCard(el);
this.shelfCard(el);
}
techCard(com) {
const ts = (com.techniques || []).map(techniqueById).filter(Boolean);
if (!ts.length) return null;
const st = this.lab.state;
return h('div', { class: 'small tech-card' }, h('b', { text: 'What it takes: ' }),
...ts.map((t) => h('div', { class: 'tech', 'data-tech': t.id }, h('span', { class: st.journal['technique:' + t.id] ? 'ok' : '', text: `${t.name}${st.journal['technique:' + t.id] ? ' ✓' : ''}: ` }), t.lesson)));
}
supplyCard(com) {
const sup = com.supplies;
if (!sup || com.tutorial) return null;
const st = this.lab.state;
const where = { shelf: 'on the shelf', wilds: 'in the wilds', market: 'in the Shop' };
return h('details', { class: 'small supply-card' }, h('summary', { text: `Plan for about ${sup.brewMl} ml of brew (the bottle and a few test doses)` }),
...sup.carriers.map((c) => h('div', {}, h('b', { text: `${EFFECT_BY_KEY[c.key].label}${c.sign < 0 ? ' (alkaline)' : ''}: ` }),
c.carriers.length ? c.carriers.map((x) => `${st.lookup(x.id).name} (${where[x.where] || x.where})`).join(', ') : 'nothing you can get today carries it')),
h('div', { class: 'muted', text: 'Every one of them brings side effects: plan what will cancel them. Long-press a jar on the shelf to see its effects.' }));
}
shelfMatches(com) {
const st = this.lab.state;
if (!st.bottles.length) return null;
const fits = [];
for (const b of st.bottles) {
if (!b.m) continue;
const cert = b.cert || {};
const fx = new Array(NE).fill(0);
let untested = 0;
for (const r of com.requirements) {
if (r.key === 'purity') { for (const e of Object.keys(EFFECT_INDEX)) if (!(r.exclude || []).includes(e) && cert[e] === undefined) untested++; continue; }
if (EFFECT_BY_KEY[r.key] && cert[r.key] === undefined) untested++;
}
for (const [k, v] of Object.entries(cert)) fx[EFFECT_INDEX[k]] = v;
const m = { ...b.m, effects: fx, ml: b.ml };
const ok = com.requirements.every((r) => scoreRequirement(r, /** @type {any} */ (m)).score >= 0.999) && b.ml >= com.bottleMl;
if (ok || (untested && com.requirements.filter((r) => !EFFECT_BY_KEY[r.key] && r.key !== 'purity').every((r) => scoreRequirement(r, /** @type {any} */ (m)).score >= 0.999))) fits.push({ b, ok: ok && !untested });
}
if (!fits.length) return null;
const sure = fits.filter((f) => f.ok).length;
return h('div', { class: 'small shelf-match ' + (sure ? 'ok' : 'muted'), text: sure ? `On your shelves: ${sure} tested bottle${sure === 1 ? '' : 's'} already meet${sure === 1 ? 's' : ''} this order — take it down and offer it.` : `On your shelves: ${fits.length} bottle${fits.length === 1 ? '' : 's'} look${fits.length === 1 ? 's' : ''} right but ${fits.length === 1 ? 'is' : 'are'} not fully tested for this order.` });
}
vialCard(el) {
const lab = this.lab, st = lab.state;
const v = st.vial;
if (!v) {
if (st.current) el.append(h('div', { class: 'card parch small muted next-step' }, h('b', { text: 'Next: ' }), 'brew it, test a dose in Trials, then Bottle it — the vial appears here.'));
return;
}
const com = st.current;
const m = v.m;
const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: '24', height: '32', class: 'vial-art' }));
const ctx = cv.getContext('2d');
drawBottle(ctx, 2, 3, 20, 29, m.color, Math.min(1, v.ml / Math.max(1, com ? com.bottleMl : v.ml)));
const need = com ? missingEffects(com, v.cert || {}) : [];
const first = com ? shortName(com.customer.name) : '';
const serve = com ? btn(`Sell to ${first}`, () => lab.serveVial(), { cls: 'primary', icon: 'deal', disabled: v.ml < 5, act: 'serve', title: `Offer the vial to ${first} and agree on a price` }) : null;
const labelB = btn(v.label ? 'Edit label' : 'Write label', () => lab.identifyVial(), { icon: 'tag', act: 'label', title: 'What the label claims the potion does' });
const testB = btn('Test it', () => { lab.trialSource = 'vial'; lab.showView('trials'); }, { icon: 'dropper', act: 'test-vial', title: 'Give a dose from this vial to a rabbit' });
const back = btn('Pour back', () => lab.pourBackVial(), { icon: 'pour', act: 'pour-back', title: 'Return the vial to the cauldron to keep working on it' });
const store = lab.sandbox ? null : btn('To shelf', () => lab.shelveVial(), { icon: 'shelf2', act: 'shelve-vial', disabled: st.bottleRoom <= 0, title: st.bottleRoom <= 0 ? 'The potion shelves are full' : 'Keep this bottle on the potion shelves' });
const discard = btn('Discard', async () => { if (await confirmDialog('Discard the vial?', 'The potion is poured away. Ingredients are not refunded.', 'Discard', 'danger')) lab.discardVial(); }, { icon: 'trash', cls: 'danger', act: 'discard', title: 'Pour the vial away' });
el.append(h('div', { class: 'card parch vial-card' },
h('div', { class: 'row' }, cv, h('div', {},
h('b', { text: `Sealed vial · ${Math.round(v.ml)} ml` }),
h('div', { class: 'small' }, h('span', { class: 'swatch', style: { background: rgbToHex(m.color) } }), ` ${describeColor(m.color)} · ${Math.round(m.temperature)}°C · ${viscosityClass(m.viscosity)}`),
verifiedLine(v.cert),
v.label ? h('div', { class: 'small label-line' }, icon('tag', 'sm'), ` ${trade.labelLine(v.label)}`) : null)),
need.length && com ? h('div', { class: 'warn small', text: `Not yet tested: ${need.map((k) => EFFECT_BY_KEY[k].label).join(', ')}. ${first} trusts an untested label less${com.customer.persona && com.customer.persona.proof >= 0.8 ? ' — and insists on proof' : ''}.` }) : null,
com && v.ml < com.bottleMl ? h('div', { class: 'small muted', text: `Short of the ${com.bottleMl} ml ordered; the customer pays less.` }) : null,
h('div', { class: 'row wrap' }, serve, labelB, testB, store, back, discard)));
}
shelfCard(el) {
const lab = this.lab, st = lab.state;
if (lab.sandbox) return;
lab.freshBottles();
const cap = st.cap.bottles;
if (this.sel && !st.bottles.some((b) => b.id === this.sel)) this.sel = null;
const grid = h('div', { class: 'bottle-shelf', role: 'listbox', 'aria-label': 'Potion shelves' });
const rows = Math.ceil(cap / 6);
for (let i = 0; i < rows * 6; i++) {
const b = st.bottles[i];
if (!b) {
grid.appendChild(h('div', { class: 'bottle-slot' + (i < cap ? ' empty' : ' locked'), 'aria-hidden': 'true' }));
continue;
}
const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: '16', height: '22', class: 'vial-art' }));
drawBottle(/** @type {CanvasRenderingContext2D} */ (cv.getContext('2d')), 2, 2, 12, 19, b.m ? b.m.color : [0.5, 0.5, 0.5], Math.min(1, b.ml / Math.max(1, b.bottledMl || b.ml)));
const fxText = b.label ? trade.labelLine(b.label) : '';
const acc = b.label ? labelStars(b.label) : null;
const slot = h('button', { class: 'bottle-slot' + (this.sel === b.id ? ' active' : '') + (b.label ? ' labelled' : ''), role: 'option', 'aria-selected': this.sel === b.id ? 'true' : 'false', 'aria-label': `${b.label && b.label.name ? b.label.name : 'Bottle'}, ${Math.round(b.ml)} ml${fxText ? `: ${fxText}` : ''}`, ...(fxText ? { title: fxText } : {}), 'data-act': 'bottle-slot', 'data-id': b.id },
cv, h('span', { class: 'bml', text: `${Math.round(b.ml)}` }), b.label ? h('span', { class: 'btag' }, icon('tag', 'sm')) : null,
acc === null ? null : h('span', { class: 'bstars', 'data-stars': String(acc), text: starsText(acc, MAX_STARS) }));
slot.addEventListener('click', () => { this.sel = this.sel === b.id ? null : b.id; this.refresh(); });
grid.appendChild(slot);
}
const b = this.sel ? st.bottles.find((x) => x.id === this.sel) : null;
let detail = null;
if (b) {
const m = b.m || {};
detail = h('div', { class: 'bottle-detail' },
h('div', { class: 'small' }, h('span', { class: 'swatch', style: { background: rgbToHex(m.color || [0.5, 0.5, 0.5]) } }), ` ${describeColor(m.color || [0.5, 0.5, 0.5])} · ${Math.round(b.ml)} ml · ${Math.round(m.temperature ?? 20)}°C · bottled on day ${b.day || st.day}`),
verifiedLine(b.cert),
b.label ? h('div', { class: 'small label-line' }, icon('tag', 'sm'), ` ${trade.labelLine(b.label)}`) : null,
h('div', { class: 'row wrap' },
btn(st.vial ? 'Swap with the vial' : 'To the counter', () => lab.takeBottle(b.id), { icon: 'deal', cls: 'primary', act: 'take-bottle', title: 'Put this bottle on the counter to sell or test it' }),
btn('Pour back', () => lab.pourBackBottle(b.id), { icon: 'pour', act: 'pour-back-bottle' }),
btn('Discard', async () => { if (await confirmDialog('Discard the bottle?', 'The potion is poured away. Ingredients are not refunded.', 'Discard', 'danger')) lab.discardBottle(b.id); }, { icon: 'trash', cls: 'danger', act: 'discard-bottle' })));
}
el.append(h('div', { class: 'card parch shelf-card' },
h('div', { class: 'row' }, icon('shelf2'), h('b', { text: `Potion shelves · ${st.bottles.length}/${cap}` })),
st.bottles.length ? null : h('div', { class: 'small muted', text: 'Empty. When you bottle a brew, choose “To the potion shelves” to keep it for a later customer. Tap a bottle here to use it. More shelving is sold in the Shop.' }),
grid, detail));
}
}
function seedSamples(v) {
const out = {};
for (const [k, x] of Object.entries(v.cert || {})) out[k] = [{ v: Number(x) || 0, r: 'bottled', rec: (v.certRecords || {})[k] || '' }];
return out;
}
function reqStatus(req, sum) {
const r = requirementEvidence(req, sum);
const cls = r.evidence === 'untested' ? 'unknown' : r.within === true ? 'known' : r.within === false ? 'miss' : 'open';
return h('span', { class: 'fx-status ' + cls, 'data-evidence': r.evidence, title: r.title, text: `${r.mark} ${r.text}` });
}
function verifiedLine(cert) {
const all = Object.entries(cert || {});
if (!all.length) return h('div', { class: 'small' }, 'Tested: ', h('span', { class: 'muted', text: 'nothing — effects unknown' }));
const seen = all.filter(([, x]) => Math.abs(x) >= 0.5), unseen = all.length - seen.length;
return h('div', { class: 'small' }, 'Tested: ', ...seen.map(([k, x]) => h('span', { class: 'fx-chip' }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ` ${Math.round(x)}`)),
unseen ? h('span', { class: 'muted', text: ` ${seen.length ? '· ' : ''}${unseen} not detected` }) : null);
}
return { CounterView };
})();
// src/rendering/backdrops-ground.js
const __m76 = (() => {
const GROUND = {
meadow: [
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[[62, 222]],
[[50, 222]],
[[50, 222]],
[[50, 222]],
[[50, 222]],
[[50, 222]],
[[50, 222]],
[[50, 222]],
[[4, 222]],
[[4, 222]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[4, 253]],
[[11, 253]],
[[17, 253]],
[[24, 244]],
[[31, 235]],
[[37, 226]],
[[44, 217]],
[],
[],
[],
[],
[],
],
forest: [
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[[100, 167]],
[[94, 168]],
[[88, 169]],
[[82, 170]],
[[76, 172]],
[[76, 173]],
[[76, 174]],
[[76, 175]],
[[76, 176]],
[[76, 176]],
[[63, 176]],
[[60, 176]],
[[58, 181]],
[[50, 216]],
[[43, 251]],
[[35, 251]],
[[27, 251]],
[[20, 251]],
[[12, 251]],
[[12, 251]],
[[12, 251]],
[[12, 251]],
[[12, 251]],
[[12, 251]],
[[12, 251]],
[[12, 251]],
[[12, 251]],
[[12, 244]],
[[12, 237]],
[[12, 228]],
[[12, 219]],
[[16, 210]],
[[20, 201]],
[[24, 200]],
[[28, 199]],
[[32, 197]],
[[36, 196]],
[[40, 195]],
[[44, 194]],
[[48, 193]],
[[52, 192]],
[[53, 190]],
[[53, 189]],
[[54, 188]],
[[54, 187]],
[[55, 187]],
[[55, 186]],
[[56, 186]],
[[56, 186]],
[[57, 185]],
[[57, 185]],
[[58, 184]],
[[58, 184]],
[[59, 184]],
[[59, 183]],
[[60, 183]],
[],
[],
],
river: [
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[[36, 109], [114, 117], [123, 142], [152, 220]],
[[36, 117], [123, 220]],
[[36, 117], [123, 220]],
[[36, 118], [123, 220]],
[[36, 220]],
[[36, 220]],
[[36, 220]],
[[23, 220]],
[[23, 220]],
[[22, 220]],
[[21, 220]],
[[20, 253]],
[[19, 253]],
[[18, 253]],
[[17, 253]],
[[16, 253]],
[[18, 253]],
[[20, 253]],
[[21, 253]],
[[23, 253]],
[[25, 250]],
[[27, 246]],
[[28, 243]],
[[30, 240]],
[[32, 174], [179, 236]],
[[34, 173], [180, 233]],
[[35, 173], [182, 232]],
[[37, 171], [182, 230]],
[[39, 171], [182, 229]],
[[41, 171], [182, 227]],
[[42, 171], [182, 226]],
[[44, 171], [182, 224]],
[[46, 59], [64, 123], [128, 171], [181, 223]],
[[47, 58], [68, 122], [130, 172], [181, 222]],
[[49, 57], [68, 120], [132, 220]],
[[50, 57], [68, 119], [132, 219]],
[[52, 57], [68, 119], [132, 217]],
[[53, 57], [68, 119], [132, 216]],
[[55, 57], [68, 119], [132, 214]],
[[56, 59], [66, 119], [132, 213]],
[[58, 59], [64, 119], [131, 208]],
[[59, 121], [131, 176], [182, 203]],
[[61, 174], [186, 199]],
[[62, 173], [186, 194]],
[[64, 172], [187, 189]],
[],
[],
],
quarry: [
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[[4, 7], [17, 23], [34, 66], [71, 73], [84, 191], [199, 217], [228, 234]],
[[16, 23], [34, 74], [83, 166], [175, 234]],
[[17, 23], [31, 77], [82, 166], [175, 234]],
[[17, 23], [31, 166], [175, 234]],
[[17, 23], [29, 166], [175, 234]],
[[17, 166], [175, 234]],
[[22, 167], [174, 223], [229, 234]],
[[22, 220], [229, 234]],
[[22, 219], [229, 234]],
[[22, 218], [229, 234]],
[[22, 166], [171, 218], [229, 234]],
[[22, 165], [172, 218], [229, 234]],
[[22, 27], [32, 164], [172, 218], [228, 234]],
[[22, 26], [34, 77], [83, 164], [172, 218], [227, 234]],
[[22, 26], [34, 77], [83, 164], [172, 218], [227, 234]],
[[22, 26], [34, 76], [83, 164], [172, 218], [227, 234]],
[[22, 26], [34, 76], [83, 164], [171, 234]],
[[22, 26], [34, 76], [83, 165], [171, 234]],
[[22, 26], [33, 76], [83, 234]],
[[22, 26], [32, 76], [83, 234]],
[[22, 27], [32, 212]],
[[22, 110], [118, 212]],
[[22, 109], [118, 212]],
[[22, 108], [118, 212]],
[[22, 107], [118, 212]],
[[22, 107], [118, 212]],
[[22, 107], [117, 212]],
[[31, 107], [116, 212]],
[[4, 14], [34, 107], [115, 212]],
[[4, 11], [34, 109], [115, 212]],
[[4, 8], [34, 212]],
[[4, 7], [34, 212]],
[[4, 7], [34, 40], [45, 212]],
[[4, 7], [32, 37], [47, 212]],
[[60, 212]],
[[60, 194], [203, 212]],
[[60, 191], [206, 212]],
[[60, 188], [206, 212]],
[[60, 186], [206, 212]],
[[60, 183], [206, 212]],
[[60, 180], [206, 212]],
[[60, 180], [204, 212]],
[[60, 180], [203, 212]],
[[61, 180], [203, 212]],
[[63, 147], [154, 179], [203, 212]],
[[72, 146], [154, 179], [199, 206], [211, 212]],
[[75, 146], [154, 179], [198, 206]],
[[79, 146], [154, 178], [197, 206]],
[[79, 146], [154, 177], [197, 206]],
[[79, 146], [154, 175], [197, 206]],
[[79, 146], [153, 172], [197, 206]],
[[79, 83], [91, 147], [152, 169], [197, 206]],
[[77, 81], [91, 166], [196, 212]],
[[72, 81], [91, 163], [196, 212]],
[[72, 80], [91, 162], [186, 187], [196, 212]],
[[72, 80], [91, 162], [184, 187], [196, 212]],
[[72, 80], [90, 162], [179, 187], [196, 212]],
[[61, 62], [71, 80], [89, 162], [177, 190], [196, 212]],
[],
[],
],
moonfen: [
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[[58, 71], [162, 167]],
[[55, 78], [118, 121], [125, 142], [191, 194], [202, 204]],
[[52, 78], [105, 121], [124, 142], [192, 194], [202, 204]],
[[52, 53], [56, 59], [68, 72], [75, 78], [105, 139]],
[[105, 135]],
[[105, 135]],
[[105, 135]],
[[105, 138]],
[[105, 148]],
[[102, 105], [108, 152], [157, 158], [166, 168], [198, 201]],
[[109, 131], [136, 154], [157, 172], [178, 189], [197, 201]],
[[109, 119], [122, 127], [140, 175], [178, 192], [195, 204]],
[[54, 57], [111, 117], [142, 204]],
[[53, 59], [112, 116], [142, 204]],
[[52, 64], [142, 201]],
[[52, 64], [135, 199]],
[[52, 64], [78, 79], [133, 199]],
[[53, 55], [63, 64], [73, 74], [134, 199]],
[[75, 76], [134, 200]],
[[139, 204]],
[[6, 21], [141, 174], [177, 209], [212, 251]],
[[6, 16], [141, 171], [178, 207], [212, 251]],
[[6, 15], [141, 170], [181, 201], [214, 251]],
[[6, 15], [139, 158], [165, 168], [187, 191], [229, 251]],
[[6, 15], [139, 155], [237, 244], [247, 251]],
[[6, 15], [133, 153], [250, 251]],
[[9, 20], [122, 124], [131, 151]],
[[11, 20], [122, 150]],
[[12, 20], [24, 26], [114, 116], [125, 149]],
[[14, 28], [129, 148]],
[[131, 147]],
[[133, 145]],
[[135, 142]],
[[135, 139]],
[[135, 138]],
[[50, 51], [133, 138]],
[[45, 46], [50, 51], [132, 138], [143, 144]],
[[44, 47], [50, 51], [130, 139], [142, 144], [185, 186]],
[[44, 54], [112, 114], [127, 144], [185, 187]],
[[44, 55], [111, 114], [122, 149], [185, 192]],
[[44, 57], [69, 70], [123, 151], [184, 192]],
[[44, 57], [68, 70], [132, 152], [184, 192], [221, 222]],
[[44, 72], [79, 80], [134, 155], [158, 160], [183, 188], [221, 223]],
[[44, 82], [139, 141], [145, 167], [175, 187], [212, 213], [216, 226]],
[[48, 82], [146, 187], [193, 203], [206, 207], [211, 226]],
[[50, 83], [96, 99], [147, 187], [192, 226]],
[[51, 83], [93, 104], [134, 135], [149, 226]],
[[53, 82], [97, 104], [134, 136], [149, 226]],
[[6, 39], [56, 78], [100, 101], [134, 136], [149, 224]],
[[13, 39], [67, 69], [148, 215], [219, 221]],
[[17, 24], [32, 38], [67, 69], [148, 215]],
[[148, 215]],
[[148, 215]],
[[148, 215]],
[[146, 215]],
[[146, 214]],
[[145, 212]],
[],
[],
[],
],
crags: [
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[],
[[56, 104], [125, 131], [140, 196]],
[[56, 110], [121, 125], [142, 196]],
[[56, 110], [121, 125], [152, 196]],
[[56, 115], [121, 125], [152, 196]],
[[56, 125], [152, 196]],
[[56, 125], [152, 196]],
[[56, 125], [152, 196]],
[[64, 134], [156, 196]],
[[70, 138], [159, 196]],
[[75, 138], [161, 196]],
[[88, 139], [164, 196]],
[[88, 145], [167, 196]],
[[56, 58], [88, 147], [172, 253]],
[[56, 63], [88, 153], [175, 253]],
[[56, 68], [88, 156], [175, 190], [195, 253]],
[[56, 68], [78, 157], [175, 181], [195, 253]],
[[4, 42], [49, 151], [157, 158], [175, 181], [196, 238], [243, 253]],
[[4, 42], [49, 151], [175, 181], [204, 238], [243, 253]],
[[4, 42], [49, 151], [174, 181], [211, 212], [217, 238], [244, 253]],
[[4, 42], [49, 151], [173, 181], [217, 238], [245, 253]],
[[4, 42], [49, 151], [172, 182], [218, 238], [245, 253]],
[[4, 42], [49, 151], [172, 183], [218, 238], [246, 253]],
[[4, 42], [49, 150], [173, 184], [218, 238], [246, 253]],
[[4, 43], [48, 144], [173, 195], [218, 238], [247, 253]],
[[4, 141], [173, 195], [200, 203], [218, 239], [247, 253]],
[[4, 20], [29, 74], [83, 139], [173, 207], [214, 240], [248, 253]],
[[4, 6], [16, 18], [29, 74], [83, 134], [173, 240], [248, 253]],
[[16, 17], [29, 74], [83, 115], [122, 125], [165, 240], [248, 253]],
[[29, 74], [83, 102], [158, 240], [248, 253]],
[[29, 74], [83, 102], [152, 241], [249, 253]],
[[28, 74], [81, 102], [149, 241], [249, 253]],
[[28, 75], [80, 102], [148, 241], [249, 253]],
[[27, 102], [154, 241], [249, 253]],
[[27, 106], [116, 119], [157, 202], [208, 242], [249, 253]],
[[15, 17], [27, 119], [160, 200], [208, 242], [249, 253]],
[[14, 17], [27, 119], [174, 200], [208, 243], [249, 253]],
[[14, 17], [27, 119], [139, 143], [176, 200], [208, 225], [230, 243], [249, 253]],
[[12, 17], [26, 119], [129, 146], [176, 200], [208, 211], [230, 243], [248, 253]],
[[12, 16], [26, 149], [176, 200], [208, 209], [233, 253]],
[[11, 16], [27, 153], [176, 200], [207, 209], [233, 253]],
[[10, 15], [27, 38], [43, 158], [176, 208], [234, 253]],
[[7, 15], [27, 37], [43, 111], [120, 160], [173, 208], [234, 253]],
[[7, 15], [27, 33], [44, 109], [120, 160], [175, 208], [234, 253]],
[[6, 15], [27, 33], [52, 108], [120, 160], [177, 207], [234, 253]],
[[5, 6], [27, 33], [55, 108], [120, 163], [180, 206], [234, 253]],
[[27, 33], [63, 107], [120, 165], [185, 206], [234, 253]],
[[25, 33], [66, 107], [120, 167], [188, 206], [235, 253]],
[[25, 33], [66, 107], [120, 167], [190, 205], [235, 253]],
[[26, 33], [66, 107], [120, 171], [194, 199], [225, 226], [235, 253]],
[[27, 34], [66, 107], [120, 175], [224, 226], [235, 244]],
[[27, 34], [66, 107], [119, 180], [224, 226]],
[[37, 41], [55, 56], [63, 68], [73, 110], [115, 182], [223, 226]],
[[55, 67], [74, 181]],
[[59, 67], [74, 118], [126, 178]],
[[74, 118], [131, 174]],
[],
[],
[],
[],
[],
],
};
return { GROUND };
})();
// src/rendering/regions.js
const __m75 = (() => {
const { Rng } = __m6;
const { SpriteAtlas, MEADOW } = __m61;
const { GROUND } = __m76;
const SCENE_W = 256;
const SCENE_H = 144;
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const bayer = (x, y) => (BAYER4[(x & 3) + (y & 3) * 4] + 0.5) / 16;
const K = '#1a1218';
function R(ctx, x, y, w, h, c) {
ctx.fillStyle = c;
ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
}
function rgbOf(hex) {
const v = parseInt(hex.slice(1), 16);
return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}
const css = (c) => `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
function gradient(ctx, x0, y0, w, h, stops, steps = 10) {
const cols = stops.map(rgbOf);
const at = (t) => {
const f = Math.min(cols.length - 1.0001, t * (cols.length - 1)), i = Math.floor(f);
return mix(cols[i], cols[i + 1], f - i);
};
for (let y = 0; y < h; y++) {
const t = h > 1 ? y / (h - 1) : 0;
const band = t * steps, lo = Math.floor(band), frac = band - lo;
const cA = css(at(lo / steps)), cB = css(at(Math.min(1, (lo + 1) / steps)));
let run = 0, cur = '';
for (let x = 0; x <= w; x++) {
const c = x === w ? '' : frac > bayer(x0 + x, y0 + y) ? cB : cA;
if (c !== cur) { if (cur) R(ctx, x0 + x - run, y0 + y, run, 1, cur); cur = c; run = 0; }
run++;
}
}
}
function disc(ctx, cx, cy, rx, ry, c) {
for (let yy = -ry; yy <= ry; yy++) {
const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry || 1))));
R(ctx, cx - w, cy + yy, w * 2 + 1, 1, c);
}
}
function ridge(ctx, rng, y, amp, rough, bottom, c, W = SCENE_W) {
let h = y + rng.range(-amp, amp), v = 0;
for (let x = 0; x < W; x++) {
v += rng.range(-rough, rough); v *= 0.9;
h = Math.max(y - amp, Math.min(y + amp, h + v));
R(ctx, x, h, 1, bottom - h, c);
}
}
function treeLine(ctx, rng, y, size, c, cHi) {
for (let x = -size; x < SCENE_W + size; x += rng.int(Math.round(size * 0.6), size)) {
const r = rng.int(Math.round(size * 0.55), size), cy = y - rng.int(0, Math.round(size * 0.6));
disc(ctx, x, cy, r, Math.round(r * 1.15), c);
if (cHi) disc(ctx, x - Math.round(r / 3), cy - Math.round(r / 2), Math.max(1, Math.round(r / 3)), Math.max(1, Math.round(r / 3)), cHi);
R(ctx, x, cy, Math.max(2, r * 2 / 3), y + 30 - cy, c);
}
}
function canopy(ctx, rng, cx, cy, r, pal) {
const blobs = [];
for (let i = 0; i < 9; i++) blobs.push([cx + rng.range(-r * 0.8, r * 0.8), cy + rng.range(-r * 0.5, r * 0.45), rng.range(r * 0.4, r * 0.62)]);
for (const [x, y, br] of blobs) disc(ctx, Math.round(x), Math.round(y), Math.round(br) + 1, Math.round(br * 0.85) + 1, pal[0]);
for (const [x, y, br] of blobs) disc(ctx, Math.round(x), Math.round(y), Math.round(br), Math.round(br * 0.85), pal[1]);
for (const [x, y, br] of blobs) disc(ctx, Math.round(x - br * 0.15), Math.round(y - br * 0.2), Math.round(br * 0.75), Math.round(br * 0.62), pal[2]);
for (const [x, y, br] of blobs) if (x < cx + r * 0.3 && y < cy + r * 0.1) disc(ctx, Math.round(x - br * 0.3), Math.round(y - br * 0.35), Math.round(br * 0.42), Math.round(br * 0.34), pal[3]);
for (let i = 0; i < r * 1.2; i++) R(ctx, cx + rng.range(-r, r * 0.5), cy + rng.range(-r * 0.7, r * 0.1), 1, 1, pal[4]);
for (let i = 0; i < r * 2; i++) {
const a = rng.range(0, Math.PI * 2), d = r * rng.range(0.85, 1.05);
R(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.75, 1, 1, pal[rng.int(0, 1)]);
}
}
function trunk(ctx, rng, x, top, bot, w, pal) {
R(ctx, x - 1, top, w + 2, bot - top, pal[0]);
R(ctx, x, top, w, bot - top, pal[2]);
R(ctx, x, top, Math.max(1, Math.round(w / 4)), bot - top, pal[3]);
R(ctx, x + w - Math.max(1, Math.round(w / 3)), top, Math.max(1, Math.round(w / 3)), bot - top, pal[1]);
for (let y = top + 2; y < bot - 2; y += rng.int(2, 4)) R(ctx, x + rng.int(1, Math.max(1, w - 2)), y, 1, rng.int(2, 4), pal[1]);
R(ctx, x - 3, bot - 2, w + 6, 2, pal[0]); R(ctx, x - 2, bot - 2, w + 4, 1, pal[2]);
R(ctx, x - 4, bot - 1, 3, 1, pal[1]); R(ctx, x + w + 1, bot - 1, 3, 1, pal[1]);
}
function fern(ctx, rng, x, y, size, dark, light) {
for (let f = 0; f < 5; f++) {
const ang = -Math.PI / 2 + (f - 2) * 0.55 + rng.range(-0.15, 0.15);
for (let i = 0; i < size; i++) {
const t = i / size, bend = t * t * 0.9 * Math.sign(f - 2 || 1);
const px = x + Math.cos(ang + bend) * i, py = y + Math.sin(ang + bend) * i * 0.8;
R(ctx, px, py, 1, 1, dark);
if (i % 2 === 0 && i > 1) { R(ctx, px - 1, py + 1, 1, 1, light); R(ctx, px + 1, py + 1, 1, 1, dark); }
}
}
}
function tuft(ctx, x, y, h, dark, light) {
R(ctx, x, y - h, 1, h, dark); R(ctx, x - 1, y - h + 2, 1, h - 2, light); R(ctx, x + 1, y - h + 1, 1, h - 1, dark); R(ctx, x + 2, y - h + 3, 1, h - 3, light);
}
function flower(ctx, x, y, c, stem) {
R(ctx, x, y, 1, 3, stem);
R(ctx, x - 1, y - 1, 3, 1, c); R(ctx, x, y - 2, 1, 3, c); R(ctx, x, y - 1, 1, 1, '#fff3b0');
}
function rock(ctx, rng, x, y, w, h, pal, moss) {
for (let yy = 0; yy < h; yy++) {
const t = yy / h, inset = Math.round((1 - Math.sqrt(Math.min(1, t * 2.2))) * w * 0.3);
R(ctx, x + inset - 1, y + yy, w - inset * 2 + 2, 1, pal[0]);
R(ctx, x + inset, y + yy, w - inset * 2, 1, t < 0.3 ? pal[3] : t < 0.7 ? pal[2] : pal[1]);
R(ctx, x + inset, y + yy, Math.max(1, Math.round((w - inset * 2) * 0.25)), 1, t < 0.5 ? pal[4] : pal[3]);
}
R(ctx, x, y + h, w, 1, pal[0]);
for (let i = 0; i < w / 4; i++) R(ctx, x + rng.int(2, w - 3), y + rng.int(2, h - 1), rng.int(1, 3), 1, pal[1]);
if (moss) for (let i = 0; i < w; i++) R(ctx, x + rng.int(Math.round(w * 0.15), Math.round(w * 0.85)), y + rng.int(0, Math.round(h * 0.3)), 1, 1, rng.chance(0.5) ? moss[0] : moss[1]);
}
function speckle(ctx, rng, y0, y1, n, cols, len = 2) {
for (let i = 0; i < n; i++) R(ctx, rng.int(0, SCENE_W - 1), rng.int(y0, y1), rng.int(1, len), 1, rng.pick(cols));
}
function rays(ctx, rng, n, a) {
for (let i = 0; i < n; i++) {
const x0 = rng.int(10, SCENE_W * 0.7), w = rng.int(6, 14), len = rng.int(70, 120);
for (let y = 0; y < len; y++) R(ctx, x0 + y * 0.55, y, w, 1, `rgba(255,248,200,${(a * (1 - y / len)).toFixed(3)})`);
}
}
function cloud(ctx, x, y, s, c, shade) {
disc(ctx, x, y, 6 * s, 3 * s, shade);
disc(ctx, x - 7 * s, y + s, 5 * s, 2 * s, shade);
disc(ctx, x + 8 * s, y + s, 5 * s, 2 * s, shade);
disc(ctx, x, y - s, 6 * s, 3 * s, c);
disc(ctx, x - 7 * s, y, 4 * s, 2 * s, c);
disc(ctx, x + 7 * s, y, 4 * s, 2 * s, c);
}
function oak(ctx, rng, x, top, bot, w, pal) {
for (let y = top; y < bot; y++) {
const flare = Math.max(0, y - (bot - 10)), ww = w + Math.round(flare * flare * 0.12) * 2, x0 = x - Math.round(flare * flare * 0.12);
R(ctx, x0 - 1, y, ww + 2, 1, pal[0]);
R(ctx, x0, y, ww, 1, pal[2]);
R(ctx, x0, y, Math.max(2, Math.round(ww * 0.28)), 1, pal[3]);
R(ctx, x0, y, 1, 1, pal[4]);
R(ctx, x0 + ww - Math.max(2, Math.round(ww * 0.3)), y, Math.max(2, Math.round(ww * 0.3)), 1, pal[1]);
}
for (let k = 0; k < Math.round(w / 3); k++) {
let cx = x + rng.int(2, w - 3);
for (let y = top + rng.int(0, 6); y < bot - rng.int(2, 8); y++) { R(ctx, cx, y, 1, 1, pal[0]); if (rng.chance(0.18)) cx += rng.chance(0.5) ? 1 : -1; cx = Math.max(x + 1, Math.min(x + w - 2, cx)); }
}
const ky = rng.int(top + 10, bot - 16), kx = x + rng.int(2, Math.max(2, w - 6));
disc(ctx, kx + 2, ky, 2, 2, pal[0]); R(ctx, kx + 1, ky - 1, 2, 1, pal[1]);
for (const dir of [-1, 1]) {
const rx = dir < 0 ? x - 4 : x + w + 3;
for (let i = 0; i < 6; i++) { R(ctx, rx + dir * i, bot - 3 + Math.round(i / 3), 3, 2, pal[0]); R(ctx, rx + dir * i, bot - 3 + Math.round(i / 3), 2, 1, pal[2]); }
}
}
function bush(ctx, rng, cx, cy, r, pal, berries) {
R(ctx, cx - r, cy + Math.round(r * 0.45), r * 2, 2, 'rgba(10,30,8,0.35)');
const blobs = [];
for (let i = 0; i < 6; i++) blobs.push([cx + rng.range(-r * 0.7, r * 0.7), cy + rng.range(-r * 0.35, r * 0.2), rng.range(r * 0.42, r * 0.6)]);
for (const [x, y, br] of blobs) disc(ctx, Math.round(x), Math.round(y), Math.round(br) + 1, Math.round(br * 0.8) + 1, pal[0]);
for (const [x, y, br] of blobs) disc(ctx, Math.round(x), Math.round(y), Math.round(br), Math.round(br * 0.8), pal[1]);
for (const [x, y, br] of blobs) disc(ctx, Math.round(x - br * 0.15), Math.round(y - br * 0.22), Math.round(br * 0.7), Math.round(br * 0.5), pal[2]);
for (const [x, y, br] of blobs) if (x < cx + r * 0.3) disc(ctx, Math.round(x - br * 0.32), Math.round(y - br * 0.4), Math.max(1, Math.round(br * 0.32)), Math.max(1, Math.round(br * 0.22)), pal[3]);
for (let i = 0; i < r; i++) R(ctx, cx + rng.range(-r * 0.8, r * 0.3), cy + rng.range(-r * 0.6, 0), 1, 1, pal[4]);
if (berries) for (let i = 0; i < Math.round(r * 0.5); i++) {
const bx = Math.round(cx + rng.range(-r * 0.7, r * 0.7)), by = Math.round(cy + rng.range(-r * 0.4, r * 0.25));
berry(ctx, bx, by, berries); if (rng.chance(0.6)) berry(ctx, bx + 3, by + 2, berries);
}
}
function berry(ctx, x, y, c) {
R(ctx, x - 1, y, 5, 3, c[0]); R(ctx, x, y - 1, 3, 5, c[0]);
R(ctx, x, y, 3, 3, c[1]); R(ctx, x, y, 1, 1, c[2]);
}
function mushroom(ctx, x, y, s, c) {
const w = 3 + s * 2, ch = 2 + s;
R(ctx, x - 2, y - ch - 1, 4, ch + 2, K); R(ctx, x - 1, y - ch, 2, ch + 1, '#e8dcc8'); R(ctx, x - 1, y - ch, 1, ch + 1, '#fff8ea');
const row = (yy) => Math.round(w * Math.sqrt(1 - Math.pow((ch - yy) / (ch + 1), 2)));
for (let yy = 0; yy <= ch; yy++) R(ctx, x - row(yy) - 1, y - ch * 2 + yy - 1, row(yy) * 2 + 2, 3, c[0]);
for (let yy = 0; yy <= ch; yy++) R(ctx, x - row(yy), y - ch * 2 + yy, row(yy) * 2, 1, yy < ch / 2 ? c[2] : c[1]);
R(ctx, x - w, y - ch * 2, 2, 1, c[2]);
R(ctx, x - Math.round(w / 2), y - ch * 2, 1, 1, c[3]); R(ctx, x + Math.round(w / 3), y - ch * 2 + 1, 1, 1, c[3]); if (s > 1) R(ctx, x - 1, y - ch - 2, 2, 1, c[3]);
}
function bluebell(ctx, x, y, h, c = ['#2a1f5a', '#6a5ad0', '#a898ff']) {
for (let i = 0; i < h; i++) R(ctx, x + Math.round(Math.sin(i / h * 1.6) * 2), y - i, 1, 1, '#2f6a24');
for (let b = 0; b < 3; b++) {
const by = y - h + 2 + b * 3, bx = x + Math.round(Math.sin((h - b * 3) / h * 1.6) * 2) + (b % 2 ? -2 : 2);
R(ctx, bx - 1, by - 1, 3, 4, c[0]); R(ctx, bx - 1, by, 3, 2, c[1]); R(ctx, bx - 2, by + 2, 5, 1, c[0]); R(ctx, bx - 1, by + 2, 3, 1, c[1]); R(ctx, bx, by, 1, 1, c[2]);
}
R(ctx, x - 2, y - 3, 2, 1, '#4f9a2a'); R(ctx, x + 1, y - 2, 2, 1, '#4f9a2a');
}
function daisy(ctx, x, y, petal = '#ffffff', heart = '#ffd23a') {
R(ctx, x, y + 2, 1, 3, '#2f6a24');
R(ctx, x - 2, y - 1, 5, 3, 'rgba(20,40,10,0.45)'); R(ctx, x - 1, y - 2, 3, 5, 'rgba(20,40,10,0.45)');
R(ctx, x - 1, y - 1, 3, 3, petal); R(ctx, x - 2, y, 5, 1, petal); R(ctx, x, y - 2, 1, 5, petal);
R(ctx, x, y, 1, 1, heart);
}
function stump(ctx, x, y, w, h, pal) {
R(ctx, x - 1, y - h, w + 2, h + 1, pal[0]);
R(ctx, x, y - h, w, h, pal[2]); R(ctx, x, y - h, 2, h, pal[3]); R(ctx, x + w - 3, y - h, 3, h, pal[1]);
for (let k = 0; k < 3; k++) R(ctx, x + 3 + k * 4, y - h + 3, 1, h - 4, pal[1]);
R(ctx, x - 3, y - 1, 3, 2, pal[0]); R(ctx, x + w, y - 1, 3, 2, pal[0]); R(ctx, x - 2, y - 1, 2, 1, pal[2]); R(ctx, x + w, y - 1, 2, 1, pal[1]);
disc(ctx, x + Math.floor(w / 2), y - h, Math.floor(w / 2) + 1, 3, pal[0]);
disc(ctx, x + Math.floor(w / 2), y - h, Math.floor(w / 2), 2, '#d8a868');
disc(ctx, x + Math.floor(w / 2), y - h, Math.floor(w / 3), 1, '#b8844a');
R(ctx, x + Math.floor(w / 2), y - h, 1, 1, '#8a5a2e');
}
function fence(ctx, x, y, posts, gap) {
const wood = ['#24160f', '#5a3a20', '#8a5c33', '#b8844a'];
for (const ry of [y - 9, y - 5]) { R(ctx, x - 2, ry - 1, (posts - 1) * gap + 6, 4, wood[0]); R(ctx, x - 1, ry, (posts - 1) * gap + 4, 2, wood[2]); R(ctx, x - 1, ry, (posts - 1) * gap + 4, 1, wood[3]); }
for (let i = 0; i < posts; i++) { const px = x + i * gap; R(ctx, px - 1, y - 13, 5, 14, wood[0]); R(ctx, px, y - 12, 3, 12, wood[2]); R(ctx, px, y - 12, 1, 12, wood[3]); R(ctx, px + 2, y - 12, 1, 12, wood[1]); }
}
function sparkle(ctx, x, y, c = '#fff3a0', core = '#ffffff') {
R(ctx, x - 1, y, 3, 1, c); R(ctx, x, y - 1, 1, 3, c); R(ctx, x, y, 1, 1, core);
}
function crystals(ctx, rng, x, y, n) {
for (let i = 0; i < n; i++) {
const cx = x + rng.int(-4, 4), h = rng.int(2, 4);
R(ctx, cx - 1, y - h - 1, 3, h + 2, '#1a3a5a'); R(ctx, cx, y - h, 1, h + 1, '#8fe0ff');
}
sparkle(ctx, x + rng.int(-3, 3), y - rng.int(4, 7), '#bfefff');
}
const OAK = ['#0f1f10', '#1f3a1a', '#2f5a24', '#4f8a32', '#9fd060'];
const BARK = ['#1a1008', '#3a2414', '#5a3a20', '#7a5230'];
const STONE = ['#1a1820', '#3d3a44', '#5d5a64', '#7d7a84', '#a8a4ac'];
const MOSS = ['#4f7a31', '#7da447'];
const LEAF = ['#163212', '#2a6a1c', '#3f8f24', '#68bc34', '#b6ea5a'];
const SHRUB = ['#12300f', '#256018', '#3a8a22', '#5cb030', '#a6e050'];
const OAKBARK = ['#1e1008', '#4a2a14', '#6e4220', '#94602e', '#b8844a'];
const BERRY = ['#4a0a10', '#e0302c', '#ffc0a8'];
const SHROOM = ['#3a1440', '#b04ac8', '#e08cf0', '#ffffff'];
const RSTONE = ['#1e2028', '#555a68', '#7a8090', '#9aa2b0', '#c8d0da'];
function forest(ctx, rng) {
const W = SCENE_W, H = SCENE_H;
gradient(ctx, 0, 0, W, 64, ['#3f8ee0', '#7ec0f0', '#cdeef0'], 9);
cloud(ctx, 128, 14, 2, '#ffffff', '#cfe2f2');
cloud(ctx, 96, 30, 1, '#ffffff', '#d4e6f4');
treeLine(ctx, rng, 46, 12, '#4f9a96', '#74baa8');
treeLine(ctx, rng, 54, 14, '#3a8060', '#5aa070');
gradient(ctx, 0, 62, W, H - 62, ['#5aa834', '#4a9a2a', '#367a1e'], 7);
for (let y = 70; y < 122; y++) {
const t = (y - 70) / 52, hw = 30 + t * 60;
for (let x = Math.round(128 - hw); x < 128 + hw; x++) {
const e = 1 - Math.abs(x - 128) / hw;
if (e * 1.4 * (1 - Math.abs(t - 0.45)) > bayer(x, y) + 0.15) R(ctx, x, y, 1, 1, '#6cbc3e');
}
}
rays(ctx, rng, 2, 0.14);
for (let i = 0; i < 3; i++) { const x0 = 104 + i * 16; for (let y = 0; y < 110; y++) R(ctx, x0 + y * 0.35, y, 7 - i, 1, `rgba(255,250,210,${(0.22 * (1 - y / 110)).toFixed(3)})`); }
for (const x of [50, 150, 200]) { R(ctx, x - 1, 40, 7, 30, '#1e3020'); R(ctx, x, 40, 5, 30, '#4a3a28'); R(ctx, x, 40, 1, 30, '#6a5238'); }
speckle(ctx, rng, 64, H - 1, 700, ['#3a8a22', '#6cbc3e', '#2f7a1e', '#7ac848', '#4f9a2a'], 3);
for (let x = -6; x < W + 10; x += rng.int(16, 24)) bush(ctx, rng, x, rng.int(66, 72), rng.int(8, 12), SHRUB, null);
fence(ctx, 112, 82, 3, 14);
const trees = [[6, 18], [66, 12], [180, 12], [232, 18]];
for (const [x, w] of trees) oak(ctx, rng, x, 18, 80 + rng.int(-2, 3), w, OAKBARK);
for (const [x, w] of trees) {
const c = x + w / 2;
canopy(ctx, rng, c - 12, rng.int(4, 12), rng.int(22, 26), LEAF);
canopy(ctx, rng, c + 14, rng.int(6, 14), rng.int(20, 24), LEAF);
canopy(ctx, rng, c, rng.int(20, 26), rng.int(16, 20), LEAF);
}
bush(ctx, rng, 92, 96, 12, SHRUB, BERRY);
bush(ctx, rng, 160, 86, 10, SHRUB, BERRY);
bush(ctx, rng, 30, 92, 11, SHRUB, null);
bush(ctx, rng, 224, 94, 12, SHRUB, null);
stump(ctx, 144, 114, 18, 11, OAKBARK);
for (let i = 0; i < 8; i++) bluebell(ctx, 194 + i * 4 + rng.int(-1, 1), 104 + rng.int(-6, 4), rng.int(9, 13));
for (const [cx, cy, n] of [[52, 84, 6], [44, 104, 4], [222, 112, 7], [120, 132, 4], [240, 88, 3]]) for (let i = 0; i < n; i++) daisy(ctx, cx + rng.int(-10, 10), cy + rng.int(-5, 5));
for (let i = 0; i < 60; i++) tuft(ctx, rng.int(0, W), rng.int(76, H), rng.int(3, 6), '#2f6a1e', '#7ac848');
for (let i = 0; i < 8; i++) fern(ctx, rng, rng.int(0, W), rng.int(110, H - 2), rng.int(8, 12), '#2a6a1c', '#7ac848');
rock(ctx, rng, -4, 112, 40, 24, RSTONE, MOSS);
crystals(ctx, rng, 14, 118, 3);
rock(ctx, rng, 214, 126, 46, 18, RSTONE, MOSS);
crystals(ctx, rng, 238, 130, 3);
rock(ctx, rng, 176, 128, 16, 8, RSTONE, MOSS);
mushroom(ctx, 40, 140, 2, SHROOM); mushroom(ctx, 50, 142, 1, SHROOM);
mushroom(ctx, 196, 138, 2, SHROOM); mushroom(ctx, 205, 141, 1, SHROOM);
for (let i = 0; i < 18; i++) sparkle(ctx, rng.int(4, W - 4), rng.int(60, H - 6), rng.pick(['#fff3a0', '#ffe066']), '#ffffff');
}
const BACKDROPS = Object.fromEntries(Object.keys(GROUND).map((r) => [r, new SpriteAtlas(`assets/backdrops/${r}.png`, { scene: [0, 0, SCENE_W, SCENE_H] })]));
function groundGrid(region) {
const grid = new Uint8Array(SCENE_W * SCENE_H);
(GROUND[region] || []).forEach((runs, y) => { for (const [x0, x1] of runs) grid.fill(1, y * SCENE_W + x0, y * SCENE_W + x1); });
return grid;
}
const GROUND_TOP = Object.fromEntries(Object.entries(GROUND).map(([r, rows]) => [r, rows.findIndex((runs) => runs.length)]));
const frameAt = (f, x, y) => [Math.round(x - f[2] / 2), Math.round(y - f[3])];
function stamp(grid, m, w, h, left, top, grow) {
const W = SCENE_W, H = SCENE_H;
for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
if (!m[j * w + i]) continue;
for (let y = Math.max(0, top + j - grow); y <= Math.min(H - 1, top + j + grow); y++)
for (let x = Math.max(0, left + i - grow); x <= Math.min(W - 1, left + i + grow); x++) grid[y * W + x] = 1;
}
}
const ROOM = 4;
class PlantGround {
constructor(region) {
this.region = region;
this.ground = groundGrid(region);
this.top = Math.max(1, GROUND_TOP[region] ?? 0);
this.spots = new Map();
}
place(plants, shapeOf) {
const W = SCENE_W, H = SCENE_H, G = this.ground;
const out = {};
for (const p of plants) out[p.id] = { x: p.x, y: p.y };
const here = new Set(plants.map((p) => p.id));
for (const id of [...this.spots.keys()]) if (!here.has(id)) this.spots.delete(id);
const fresh = plants.filter((p) => !this.spots.has(p.id) && shapeOf(p));
if (fresh.length) {
const roomy = new Uint8Array(W * H), tight = new Uint8Array(W * H);
const mark = (/** @type {{x:number, y:number, w:number, h:number, m:Uint8Array}} */ s) => {
const [left, top] = frameAt([0, 0, s.w, s.h], s.x, s.y);
stamp(roomy, s.m, s.w, s.h, left, top, ROOM);
stamp(tight, s.m, s.w, s.h, left, top, 1);
};
for (const s of this.spots.values()) mark(s);
for (const p of fresh) {
const { w, h, m } = /** @type {{w:number, h:number, m:Uint8Array}} */ (shapeOf(p));
const f = [0, 0, w, h], sw = Math.max(4, Math.round(w * 0.5));
const fits = (taken, ax, ay) => {
const [left, top] = frameAt(f, ax, ay);
if (ay < this.top || ay > H - 3 || left < 1 || left + w > W - 1 || top < 1) return false;
for (let y = ay - 1; y <= ay; y++) for (let x = ax - Math.floor(sw / 2); x < ax - Math.floor(sw / 2) + sw; x++) if (!G[y * W + x]) return false;
for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (m[j * w + i] && taken[(top + j) * W + left + i]) return false;
return true;
};
const ox = Math.round(p.x * W), oy = Math.round(p.y * H);
const tries = [[0, ox, oy]];
for (let y = this.top; y <= H - 3; y++) for (let x = (y + ox) & 1; x < W; x += 2) if (G[y * W + x]) tries.push([(x - ox) ** 2 + ((y - oy) * 1.6) ** 2, x, y]);
tries.sort((a, b) => a[0] - b[0]);
const spot = tries.find(([, x, y]) => fits(roomy, x, y)) || tries.find(([, x, y]) => fits(tight, x, y));
const [, x, y] = spot || [0, ox, oy];
const s = { x, y, w, h, m };
mark(s);
this.spots.set(p.id, s);
}
}
for (const [id, s] of this.spots) out[id] = { x: s.x / W, y: s.y / H };
return out;
}
}
function meadow(ctx, rng) {
const W = SCENE_W, H = SCENE_H;
gradient(ctx, 0, 0, W, 70, ['#5a96e0', '#8cc0f0', '#d8eef8'], 9);
disc(ctx, 214, 20, 9, 9, '#fff6c8'); disc(ctx, 214, 20, 7, 7, '#fffbe6');
for (let i = 0; i < 4; i++) cloud(ctx, rng.int(10, W - 30), rng.int(10, 34), rng.pick([1, 1, 2]), '#ffffff', '#d4e4f4');
ridge(ctx, rng, 56, 6, 0.6, 72, '#7aa8b8');
ridge(ctx, rng, 62, 5, 0.5, 80, '#5a9a5a');
treeLine(ctx, rng, 66, 8, '#3f7a3a', '#5a9a4a');
gradient(ctx, 0, 68, W, H - 68, ['#7ac04a', '#5aa83a', '#3f8a2a'], 6);
speckle(ctx, rng, 70, H - 1, 700, ['#8ad05a', '#4f9a32', '#9ade6a', '#3f8a2a'], 3);
for (let x = 6; x < W; x += 22) { R(ctx, x - 1, 70, 4, 14, K); R(ctx, x, 71, 2, 13, '#8a5c33'); R(ctx, x, 71, 1, 13, '#a8763f'); }
for (const y of [73, 78]) { R(ctx, 0, y - 1, W, 3, K); R(ctx, 0, y, W, 1, '#a8763f'); }
for (let i = 0; i < 90; i++) tuft(ctx, rng.int(0, W), rng.int(82, H), rng.int(3, 6), '#3f8a2a', '#8ad05a');
for (let i = 0; i < 120; i++) flower(ctx, rng.int(0, W), rng.int(84, H - 2), rng.pick(['#ff9fc7', '#ffe58a', '#ffffff', '#c9b7ff', '#ff6a8a']), '#3f8a2a');
oak(ctx, rng, 20, 46, 74, 8, OAKBARK);
canopy(ctx, rng, 18, 36, 18, LEAF); canopy(ctx, rng, 34, 42, 14, LEAF);
for (const [x, y, r, b] of [[60, 84, 9, null], [196, 82, 10, ['#5a0a3a', '#ff6aa8', '#ffd0e8']], [244, 90, 11, null]]) bush(ctx, rng, x, y, r, SHRUB, b);
for (const [cx, cy, n] of [[30, 100, 6], [110, 92, 5], [170, 120, 6], [232, 128, 5]]) for (let i = 0; i < n; i++) daisy(ctx, cx + rng.int(-12, 12), cy + rng.int(-5, 5));
for (let i = 0; i < 6; i++) bluebell(ctx, 134 + i * 4 + rng.int(-1, 1), 112 + rng.int(-4, 4), rng.int(9, 12));
rock(ctx, rng, -4, 124, 34, 20, RSTONE, MOSS);
for (let i = 0; i < 14; i++) sparkle(ctx, rng.int(4, W - 4), rng.int(78, H - 6), '#fff3a0');
}
function river(ctx, rng) {
const W = SCENE_W, H = SCENE_H;
gradient(ctx, 0, 0, W, 66, ['#7aaad8', '#a8cce8', '#e0ecf0'], 8);
for (let i = 0; i < 3; i++) cloud(ctx, rng.int(10, W - 30), rng.int(8, 28), 1, '#ffffff', '#c8dcec');
treeLine(ctx, rng, 56, 12, '#5a8a7a', '#6f9e88');
gradient(ctx, 0, 60, W, H - 60, ['#8aaa4a', '#6a8f3a', '#4f7a2a'], 6);
speckle(ctx, rng, 62, H - 1, 500, ['#9aba5a', '#5a8a32', '#7aa045'], 3);
for (let y = 62; y < H; y++) {
const t = (y - 62) / (H - 62), cx = 70 + t * 110 + Math.sin(y * 0.11) * 8, w = 10 + t * 46;
R(ctx, cx - w / 2 - 3, y, w + 6, 1, '#d8d0b0');
R(ctx, cx - w / 2 - 1, y, w + 2, 1, '#a89a70');
for (let x = 0; x < w; x++) R(ctx, cx - w / 2 + x, y, 1, 1, (x + y) % 9 === 0 ? '#9fd4f0' : t < 0.3 ? '#5a9ad0' : bayer(x, y) < t ? '#2f6aa8' : '#4a86c4');
}
for (const [x, cy] of [[28, 30], [214, 26]]) {
trunk(ctx, rng, x, cy, 84, 7, BARK);
canopy(ctx, rng, x + 3, cy, 20, LEAF);
for (let i = 0; i < 26; i++) { const vx = x + 3 + rng.int(-22, 22), vy = cy + rng.int(0, 10), len = rng.int(12, 34); for (let k = 0; k < len; k++) R(ctx, vx + Math.round(Math.sin(k * 0.3) * 0.6), vy + k, 1, 1, k % 3 ? '#4f8a32' : '#7aba4a'); }
}
for (let i = 0; i < 26; i++) {
const x = rng.int(0, W), y = rng.int(80, H), h = rng.int(8, 16);
R(ctx, x, y - h, 1, h, '#5a7a2a'); if (rng.chance(0.5)) { R(ctx, x - 1, y - h - 1, 3, 4, '#5a3a20'); R(ctx, x - 1, y - h - 1, 1, 4, '#7a5230'); }
}
for (let i = 0; i < 6; i++) { const x = rng.int(110, 200), y = rng.int(100, H - 6); disc(ctx, x, y, 3, 1, '#3a7a2a'); R(ctx, x - 1, y - 1, 2, 1, '#6aaa3a'); }
rock(ctx, rng, 150, 120, 14, 7, RSTONE, MOSS); rock(ctx, rng, 170, 128, 12, 6, RSTONE, MOSS);
bush(ctx, rng, 52, 78, 10, SHRUB, null); bush(ctx, rng, 244, 92, 12, SHRUB, BERRY); bush(ctx, rng, 8, 112, 11, SHRUB, null);
rock(ctx, rng, 220, 128, 40, 18, RSTONE, MOSS);
for (const [x, y, sz] of [[34, 136, 2], [42, 139, 1], [104, 96, 1], [232, 120, 2]]) mushroom(ctx, x, y, sz, ['#3a1a08', '#c8642a', '#f0a050', '#fff3d8']);
for (let i = 0; i < 6; i++) daisy(ctx, rng.int(10, 60), rng.int(84, 104));
for (let i = 0; i < 4; i++) fern(ctx, rng, rng.int(0, 50), rng.int(120, H - 2), rng.int(8, 11), '#2a6a1c', '#7ac848');
for (let i = 0; i < 10; i++) sparkle(ctx, rng.int(60, 200), rng.int(70, H - 4), '#dff4ff');
}
function quarry(ctx, rng) {
const W = SCENE_W, H = SCENE_H;
gradient(ctx, 0, 0, W, 50, ['#7aa8d8', '#a8c8e8', '#e8e0d0'], 8);
for (let i = 0; i < 4; i++) cloud(ctx, rng.int(0, W), rng.int(6, 22), rng.pick([1, 2]), '#ffffff', '#d8dce8');
const tiers = [[18, 30, ['#5d5a64', '#7d7a84', '#9d9aa4']], [34, 30, ['#55525c', '#75727c', '#95929c']], [52, 28, ['#4d4a54', '#6d6a74', '#8d8a94']]];
for (const [y, h, c] of /** @type {[number, number, string[]][]} */ (tiers)) {
let x = -rng.int(0, 20);
while (x < W) {
const bw = rng.int(14, 30), top = y + rng.int(-4, 4);
R(ctx, x, top, bw, h + 20, K);
R(ctx, x + 1, top + 1, bw - 2, h + 20, c[1]);
R(ctx, x + 1, top + 1, bw - 2, 2, c[2]);
R(ctx, x + 1, top + 3, 2, h + 18, c[2]);
R(ctx, x + bw - 4, top + 3, 3, h + 18, c[0]);
for (let k = 0; k < 4; k++) R(ctx, x + rng.int(3, bw - 4), top + rng.int(5, h), rng.int(2, 6), 1, c[0]);
if (rng.chance(0.4)) R(ctx, x + rng.int(3, bw - 6), top + rng.int(6, h - 4), 1, rng.int(4, 9), c[0]);
x += bw - 1;
}
}
gradient(ctx, 0, 74, W, H - 74, ['#a8885a', '#8a6a42', '#6a5032'], 6);
speckle(ctx, rng, 76, H - 1, 600, ['#c0a070', '#7a5a38', '#5a4228', '#9a7a52'], 2);
for (let i = 0; i < 70; i++) { const x = rng.int(0, W), y = rng.int(78, H - 2); R(ctx, x, y, 2, 1, '#4a4252'); R(ctx, x, y - 1, 1, 1, '#8a8296'); }
const wood = ['#24160f', '#5a3a20', '#8a5c33', '#a8763f'];
const beam = (x, y, w, h) => { R(ctx, x - 1, y - 1, w + 2, h + 2, wood[0]); R(ctx, x, y, w, h, wood[2]); R(ctx, x, y, w, 1, wood[3]); };
beam(204, 16, 4, 60); beam(170, 14, 50, 4);
R(ctx, 176, 18, 1, 22, '#3a2a20'); R(ctx, 174, 40, 5, 3, '#545060'); R(ctx, 176, 43, 2, 3, '#716c7c');
beam(196, 30, 18, 3);
for (const [x, y, h] of [[90, 44, 30], [136, 50, 26]]) { beam(x, y, 3, h); beam(x + 14, y, 3, h); beam(x - 2, y, 21, 3); for (let r = y + 6; r < y + h; r += 5) R(ctx, x + 3, r, 11, 1, wood[3]); }
beam(16, 50, 3, 34); beam(16, 50, 10, 3);
R(ctx, 22, 54, 7, 9, K); R(ctx, 23, 55, 5, 7, '#ffb444'); R(ctx, 24, 56, 3, 5, '#fff3b0'); R(ctx, 22, 53, 7, 1, '#545060');
for (let r = 14; r > 0; r -= 2) disc(ctx, 25, 58, r, r, `rgba(255,190,90,${(0.05).toFixed(3)})`);
for (let i = 0; i < 40; i++) { const x = rng.int(0, 44), y = rng.int(100, H); R(ctx, x, y, rng.int(3, 6), rng.int(2, 4), rng.pick(['#1e1b22', '#2c2831', '#3d3844'])); R(ctx, x, y, 1, 1, '#716c7c'); }
R(ctx, 226, 104, 26, 14, K); R(ctx, 227, 105, 24, 11, '#6d4527'); R(ctx, 227, 105, 24, 2, '#a9743f');
for (let i = 0; i < 4; i++) R(ctx, 229 + i * 6, 107, 1, 9, '#3a2416');
disc(ctx, 232, 119, 3, 3, K); disc(ctx, 246, 119, 3, 3, K); R(ctx, 232, 119, 1, 1, '#716c7c'); R(ctx, 246, 119, 1, 1, '#716c7c');
for (let i = 0; i < 8; i++) R(ctx, 228 + rng.int(0, 20), 102 + rng.int(0, 2), 3, 2, rng.pick(['#3d3844', '#545060']));
rock(ctx, rng, 60, 118, 22, 12, RSTONE);
rock(ctx, rng, 190, 126, 18, 10, RSTONE);
rock(ctx, rng, 120, 130, 30, 14, RSTONE);
crystals(ctx, rng, 72, 120, 3); crystals(ctx, rng, 134, 132, 4);
bush(ctx, rng, 248, 78, 9, SHRUB, null); bush(ctx, rng, 4, 80, 8, SHRUB, null);
for (let i = 0; i < 12; i++) sparkle(ctx, rng.int(40, W - 30), rng.int(80, H - 4), rng.pick(['#fff3d0', '#bfefff']));
}
function moonfen(ctx, rng) {
const W = SCENE_W, H = SCENE_H;
gradient(ctx, 0, 0, W, 76, ['#070a1a', '#121a3a', '#2a2a5a', '#3a3a6a'], 10);
for (let i = 0; i < 70; i++) R(ctx, rng.int(0, W), rng.int(0, 56), 1, 1, rng.pick(['#c9b7ff', '#ffffff', '#8fa8e0']));
for (let i = 0; i < 5; i++) { const x = rng.int(0, W), y = rng.int(0, 40); R(ctx, x - 1, y, 3, 1, '#c9d8ff'); R(ctx, x, y - 1, 1, 3, '#c9d8ff'); }
disc(ctx, 50, 20, 9, 9, 'rgba(200,220,255,0.12)'); R(ctx, 44, 14, 12, 12, '#e8f0ff'); R(ctx, 44, 14, 12, 1, '#ffffff'); R(ctx, 50, 18, 3, 3, '#c0d0f0'); R(ctx, 46, 22, 2, 2, '#c0d0f0');
treeLine(ctx, rng, 62, 14, '#141c34', null);
treeLine(ctx, rng, 70, 12, '#0f1828', null);
gradient(ctx, 0, 70, W, H - 70, ['#16261e', '#0f1c16', '#0a140f'], 5);
for (let k = 0; k < 3; k++) {
let cx = rng.int(30, W - 30);
for (let y = 76 + k * 22; y < H; y++) {
cx += Math.sin(y * 0.2 + k) * 1.2;
const w = 14 + (y - 76) * 0.4;
R(ctx, cx - w / 2, y, w, 1, '#0a1a2a');
if (rng.chance(0.35)) R(ctx, cx - w / 2 + rng.int(0, w), y, rng.int(1, 4), 1, rng.pick(['#2f8aa8', '#5fd4e8', '#1a4a6a']));
}
}
for (const [x, cy] of [[20, 30], [104, 36], [196, 28], [244, 40]]) {
trunk(ctx, rng, x, cy, 86, 6, ['#05080a', '#1a1612', '#2a221a', '#3a3024']);
canopy(ctx, rng, x + 3, cy, 18, ['#050a08', '#0f2018', '#1a3a28', '#2a5a3a', '#5fd4b4']);
for (let i = 0; i < 20; i++) { const vx = x + 3 + rng.int(-18, 18), vy = cy + rng.int(0, 8), len = rng.int(10, 30); for (let k = 0; k < len; k++) R(ctx, vx, vy + k, 1, 1, k % 4 ? '#1f4a34' : '#3f8a5a'); }
}
for (let i = 0; i < 8; i++) { const x = rng.int(0, W), y = rng.int(84, H - 4); disc(ctx, x, y, rng.int(8, 14), 3, '#1f3a24'); speckle(ctx, rng, y - 2, y + 1, 10, ['#3f7a3a', '#2a5a2a']); }
for (const [x, y] of [[66, 88], [150, 98], [222, 92]]) {
for (let j = 0; j < 3; j++) { R(ctx, x - 5 + j, y - j * 4 - 4, 10 - j * 2, 4, K); R(ctx, x - 4 + j, y - j * 4 - 3, 8 - j * 2, 3, '#4a4a5a'); R(ctx, x - 4 + j, y - j * 4 - 3, 8 - j * 2, 1, '#6a6a7a'); }
R(ctx, x - 5, y, 10, 1, '#5fd4e8');
}
for (const [x, y] of [[36, 98], [180, 86], [128, 120]]) for (let j = 0; j < 3; j++) { const h = rng.int(6, 14), cx = x + j * 4 - 4; R(ctx, cx - 1, y - h, 3, h, '#3a2a6a'); R(ctx, cx, y - h, 1, h, '#c9b7ff'); R(ctx, cx + 1, y - h + 2, 1, h - 2, '#8c6cff'); }
for (let i = 0; i < 30; i++) { const x = rng.int(0, W), y = rng.int(84, H), h = rng.int(6, 12); R(ctx, x, y - h, 1, h, '#2a4a2a'); if (rng.chance(0.3)) { R(ctx, x - 1, y - h, 3, 2, '#8c6cff'); R(ctx, x, y - h - 1, 1, 1, '#c9b7ff'); } }
for (const [x, y, sz] of [[14, 132, 2], [22, 136, 1], [92, 128, 2], [206, 138, 2], [216, 140, 1]]) {
for (let r = 8; r > 0; r -= 2) disc(ctx, x, y - 4, r, r, 'rgba(95,212,232,0.05)');
mushroom(ctx, x, y, sz, ['#0a2a3a', '#2fa8c8', '#8ff0ff', '#e9fbff']);
}
for (let i = 0; i < 14; i++) sparkle(ctx, rng.int(4, W - 4), rng.int(70, H - 4), rng.pick(['#8fe0ff', '#c9b7ff']));
}
function crags(ctx, rng) {
const W = SCENE_W, H = SCENE_H;
gradient(ctx, 0, 0, W, 72, ['#2a0f12', '#6a2418', '#c0501f', '#e88a3a'], 10);
for (let i = 0; i < 5; i++) { const x = rng.int(0, W), y = rng.int(4, 30); disc(ctx, x, y, rng.int(10, 20), rng.int(3, 6), 'rgba(40,20,20,0.35)'); }
ridge(ctx, rng, 40, 14, 1.4, 90, '#3a1a18');
ridge(ctx, rng, 56, 10, 1.1, 96, '#2a1210');
for (let k = 0; k < 4; k++) {
let x = rng.int(20, W - 20);
for (let y = rng.int(40, 56); y < 96; y++) { x += rng.range(-1, 1); R(ctx, x, y, 2, 1, y % 3 ? '#ff7a1c' : '#ffb444'); }
}
gradient(ctx, 0, 78, W, H - 78, ['#3a1c16', '#2a1210', '#1a0a08'], 5);
speckle(ctx, rng, 80, H - 1, 500, ['#4a2a20', '#1a0a08', '#5a3226'], 3);
for (let i = 0; i < 4; i++) { const x = rng.int(20, W - 20), y = rng.int(96, H - 8); disc(ctx, x, y, rng.int(8, 16), 3, '#c2410f'); disc(ctx, x, y, rng.int(4, 8), 1, '#ffb444'); }
for (let i = 0; i < 10; i++) { let x = rng.int(0, W), y = rng.int(84, H); for (let k = 0; k < 12; k++) { R(ctx, x, y, 1, 1, '#ff7a1c'); x += rng.int(-1, 1); y += 1; } }
for (let i = 0; i < 6; i++) rock(ctx, rng, rng.int(-6, W - 20), rng.int(88, H - 14), rng.int(14, 26), rng.int(8, 14), ['#05030a', '#140c18', '#241828', '#3a2a3e', '#6a4a7a']);
rock(ctx, rng, -6, 120, 44, 24, ['#05030a', '#1a1018', '#2a1e28', '#443244', '#7a5a8a']);
rock(ctx, rng, 212, 124, 48, 20, ['#05030a', '#1a1018', '#2a1e28', '#443244', '#7a5a8a']);
for (const [x, y] of [[18, 124], [232, 128], [140, 104]]) for (let j = 0; j < 3; j++) { const h = rng.int(5, 11), cx = x + j * 4 - 4; R(ctx, cx - 1, y - h, 3, h, '#4a0f08'); R(ctx, cx, y - h, 1, h, '#ffb444'); R(ctx, cx + 1, y - h + 2, 1, h - 2, '#ff7a1c'); }
for (const [x, y] of [[70, 96], [190, 92]]) for (let k = 0; k < 7; k++) { let bx = x, by = y; const a = -Math.PI / 2 + (k - 3) * 0.35; for (let i = 0; i < 10; i++) { R(ctx, bx, by, 1, 1, '#2a1410'); bx += Math.cos(a) * 1.1; by += Math.sin(a); } }
for (let i = 0; i < 16; i++) sparkle(ctx, rng.int(4, W - 4), rng.int(60, H - 4), rng.pick(['#ffb444', '#ff7a1c']), '#fff3b0');
}
const PAINTERS = { forest, meadow, river, quarry, moonfen, crags };
function paintRegion(ctx, region, seed) {
const id = PAINTERS[region] ? region : 'forest';
if (BACKDROPS[id] && BACKDROPS[id].ready) BACKDROPS[id].draw(ctx, 'scene', SCENE_W / 2, SCENE_H);
else PAINTERS[id](ctx, new Rng(`scene2:${seed}:${region}`));
R(ctx, 0, 0, SCENE_W, 1, 'rgba(0,0,0,0.35)');
R(ctx, 0, SCENE_H - 1, SCENE_W, 1, 'rgba(0,0,0,0.35)');
}
const VENTS = [
{ x: 71, y: 57, rise: 46, drift: 8, r: 4, n: 22, speed: 0.16 },
{ x: 195, y: 34, rise: 34, drift: 6, r: 3, n: 18, speed: 0.19 },
];
const STEAM = ['#fff0b0', '#f49e39', '#e56522', '#8a4a50', '#6a4457', '#4e3040'];
function steam(ctx, v, t) {
for (let k = v.n - 1; k >= 0; k--) {
const age = (t * v.speed + k / v.n) % 1, seed = Math.floor(t * v.speed + k / v.n) * 7 + k;
const x = v.x + age * v.drift + Math.sin(age * 5 + seed) * (1 + age * 2), y = v.y - age * v.rise;
const r = Math.max(2, Math.round(v.r * (0.55 + age * 1.2)));
const c = STEAM[Math.min(STEAM.length - 1, Math.floor(Math.sqrt(age) * STEAM.length))];
ctx.globalAlpha = age < 0.55 ? 0.85 : Math.ceil(((1 - age) / 0.45) * 4) / 4 * 0.85;
disc(ctx, Math.round(x), Math.round(y), r, r - 1, c);
if (r >= 4) disc(ctx, Math.round(x - 1), Math.round(y - 1), r - 2, Math.max(1, r - 3), STEAM[Math.max(0, STEAM.indexOf(c) - 1)]);
}
ctx.globalAlpha = 0.9;
R(ctx, v.x - 1, v.y - 4, 3, 4, STEAM[1]);
R(ctx, v.x, v.y - 3 - (Math.sin(t * 9) > 0 ? 1 : 0), 1, 3, STEAM[0]);
ctx.globalAlpha = 1;
}
function animateRegion(ctx, region, t) {
const W = SCENE_W, H = SCENE_H;
if (region === 'moonfen') {
for (let i = 0; i < 7; i++) {
const x = Math.round(W * (0.08 + i * 0.13) + Math.sin(t * 0.7 + i * 2) * 10), y = Math.round(H * (0.5 + 0.06 * (i % 3)) + Math.sin(t * 1.3 + i) * 6);
for (let r = 6; r > 0; r -= 2) disc(ctx, x, y, r, r, 'rgba(95,212,232,0.06)');
R(ctx, x - 1, y - 2, 2, 4, '#8fe0ff'); R(ctx, x - 1, y, 2, 2, '#e9fbff'); R(ctx, x, y - 4 + Math.round(Math.sin(t * 8 + i)), 1, 2, '#5fd4e8');
}
} else if (region === 'forest' || region === 'meadow' || region === 'river') {
if (region === 'meadow' && MEADOW.ready) for (let i = 0; i < 2; i++) {
const x = ((t * (6 + i * 2) + i * 130) % (W + 20)) - 10, y = H * (0.1 + i * 0.12) + Math.sin(t * 1.5 + i) * 2;
MEADOW.draw(ctx, Math.sin(t * 7 + i * 2) > 0 ? 'bird_1' : 'bird_3', x, y);
}
else for (let i = 0; i < 3; i++) {
const x = ((t * (8 + i * 3) + i * 80) % (W + 20)) - 10, y = H * (0.12 + i * 0.06) + Math.sin(t * 3 + i) * 2;
const up = Math.sin(t * 10 + i) > 0 ? 1 : 0;
R(ctx, x, y, 1, 1, '#24160f'); R(ctx, x - 1, y - up, 1, 1, '#24160f'); R(ctx, x + 1, y - up, 1, 1, '#24160f'); R(ctx, x - 2, y - up * 2 + 1, 1, 1, '#24160f'); R(ctx, x + 2, y - up * 2 + 1, 1, 1, '#24160f');
}
if (region === 'meadow') for (let i = 0; i < 4; i++) {
const x = W * (0.2 + i * 0.2) + Math.sin(t * 0.9 + i * 3) * 18, y = H * 0.66 + Math.sin(t * 1.7 + i) * 8, open = Math.sin(t * 14 + i) > 0;
const c = ['#ffe58a', '#ff9fc7', '#ffffff', '#c9b7ff'][i];
R(ctx, x - (open ? 2 : 1), y, open ? 2 : 1, 2, c); R(ctx, x + 1, y, open ? 2 : 1, 2, c); R(ctx, x, y, 1, 2, K);
}
if (region === 'forest') for (let i = 0; i < 10; i++) {
const x = (i * 37 + Math.sin(t * 0.5 + i) * 6) % W, y = 40 + ((i * 29 + t * 4) % 60);
if (Math.sin(t * 2 + i * 1.7) > 0.3) R(ctx, x, y, 1, 1, '#fff6c0');
}
if (region === 'river' && BACKDROPS.river.ready) for (let i = 0; i < 8; i++) {
const x = ((t * (5 + i % 3) + i * 37) % (W + 8)) - 4, y = 86 + ((i * 5) % 14) + Math.round(Math.sin(t * 2 + i));
R(ctx, x, y, 3, 1, '#dff4ff');
}
else if (region === 'river') for (let i = 0; i < 8; i++) {
const y = 70 + ((t * 8 + i * 9) % (H - 70)), tt = (y - 62) / (H - 62), x = 70 + tt * 110 + Math.sin(y * 0.11) * 8 + Math.sin(t * 2 + i) * 6;
R(ctx, x, y, 3, 1, '#dff4ff');
}
} else if (region === 'crags') {
if (BACKDROPS.crags.ready) for (const v of VENTS) steam(ctx, v, t);
for (let i = 0; i < 12; i++) {
const y = H * 0.75 - ((t * 12 + i * 11) % 60), x = W * (0.05 + i * 0.08) + Math.sin(t + i) * 4;
R(ctx, x, y, 1, 1, i % 3 ? '#ffb444' : '#ff7a1c');
}
} else if (region === 'quarry') {
for (let i = 0; i < 6; i++) {
const x = (i * 47 + t * 6) % W, y = 60 + Math.sin(t * 0.8 + i) * 10 + i * 6;
R(ctx, x, y, 1, 1, 'rgba(255,240,210,0.6)');
}
const flick = 0.7 + 0.3 * Math.sin(t * 9);
if (!BACKDROPS.quarry.ready) R(ctx, 24, 56, 3, 5, `rgba(255,243,176,${flick.toFixed(2)})`);
}
}
return { SCENE_W, SCENE_H, BACKDROPS, GROUND_TOP, PlantGround, paintRegion, animateRegion };
})();
// src/ui/views/wilds.js
const __m74 = (() => {
const { h, btn, clear, toast } = __m2;
const { icon } = __m3;
const { audio } = __m4;
const { REGIONS, depositStatus, formatWait, gatherPlan, harvestable, dayPart, weatherOn, marksIn, DAY_PART_NAME } = __m29;
const { equipmentById } = __m26;
const { RANKS } = __m26;
const { drawRaw } = __m66;
const { paintRegion, animateRegion, PlantGround, BACKDROPS, SCENE_W, SCENE_H } = __m75;
const { GATHERABLES, GROWTH, CRYSTALS, REGION_ATLAS, growthFrame, glintSpots, plantBox, hitPlant, ingredientSprite } = __m61;
const { EFFECT_BY_KEY } = __m13;
function sparkle(ctx, x, y, u) {
const q = 0.5, L = [1, 2, 4, 6, 4, 2, 1][Math.min(6, Math.floor(u * 7))] * q;
const cx = Math.round(x / q) * q, cy = Math.round(y / q) * q;
ctx.fillStyle = 'rgba(255,250,225,0.75)';
ctx.fillRect(cx, cy - L * 1.5, q, L * 1.5);
ctx.fillRect(cx, cy + q, q, L * 1.5);
ctx.fillRect(cx - L, cy, L, q);
ctx.fillRect(cx + q, cy, L, q);
ctx.fillStyle = '#ffffff';
ctx.fillRect(cx, cy, q, q);
}
class WildsView {
constructor(lab) {
this.lab = lab;
this.el = h('section', { class: 'view view-wilds', 'data-view': 'wilds' });
this.region = 'forest';
this.time = 0;
this.floaters = [];
this.bg = null;
this.bgKey = '';
this.ground = null;
this.field = [];
this.thorough = false;
this.rain = [];
this.hover = null;
this.grewAt = {};
this.can = {};
this.closed = {};
this.waiting = new Set();
}
build() {
const el = clear(this.el);
this.tabs = h('div', { class: 'region-tabs', role: 'tablist' });
this.sky = h('div', { class: 'wilds-sky small' });
this.canvas = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(SCENE_W * GROWTH.res), height: String(SCENE_H * GROWTH.res), class: 'scene', 'aria-label': 'Region scene: tap a deposit to gather' }));
this.ctx = /** @type {CanvasRenderingContext2D} */ (this.canvas.getContext('2d'));
this.ctx.setTransform(GROWTH.res, 0, 0, GROWTH.res, 0, 0);
this.ctx.imageSmoothingEnabled = false;
this.canvas.addEventListener('pointerdown', (e) => this.tapScene(e));
this.canvas.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') this.setHover(this.depositAt(e)); });
this.canvas.addEventListener('pointerleave', () => this.setHover(null));
this.info = h('div', { class: 'region-info small' });
this.list = h('div', { class: 'deposits' });
this.foot = h('div', { class: 'small muted wilds-foot' });
el.append(this.tabs, h('div', { class: 'wilds-scene' }, h('div', { class: 'scene-wrap' }, this.canvas), this.info), h('div', { class: 'wilds-list' }, this.sky, this.list, this.foot));
this.refresh();
}
loadSprites() {
for (const atlas of [BACKDROPS[this.region], REGION_ATLAS[this.region], GROWTH]) {
if (!atlas || atlas.ready || this.waiting.has(atlas)) continue;
this.waiting.add(atlas);
atlas.load().then((ok) => { if (ok) { this.bgKey = ''; this.refresh(); } });
}
}
unlocked(r) {
return this.lab.sandbox || r.rank <= this.lab.state.rank;
}
refresh() {
const lab = this.lab, st = lab.state;
if (!this.tabs) return;
this.loadSprites();
const tabs = clear(this.tabs);
for (const r of REGIONS) {
const ok = this.unlocked(r);
tabs.appendChild(btn(r.name, () => {
if (!ok) { toast(r.name, `The guild grants passage at the rank of ${RANKS[r.rank].name}.`, 'lock'); return; }
this.region = r.id; this.bgKey = ''; audio.play('page'); this.refresh();
}, { cls: (this.region === r.id ? 'active ' : '') + (ok ? '' : 'locked'), icon: ok ? (r.magical ? 'wisp' : r.id === 'quarry' ? 'pick' : r.id === 'river' ? 'drop' : r.id === 'meadow' ? 'rose' : 'tree') : 'lock', act: 'region-' + r.id }));
}
const region = REGIONS.find((r) => r.id === this.region);
clear(this.info).append(h('b', { text: region.name }), ' — ' + region.desc);
const list = clear(this.list);
const now = Date.now();
const weather = weatherOn(st.seed, st.day), part = dayPart(st);
const mode = (t, on, act) => btn(t, () => { this.thorough = on; audio.play('click'); this.refresh(); }, { cls: 'small' + (this.thorough === on ? ' active' : ''), act });
clear(this.sky).append(...[
h('div', { class: 'row wrap sky-row' },
icon(part === 'dawn' ? 'sun' : part === 'dusk' ? 'wisp' : 'sun', 'sm'), h('b', { text: lab.sandbox ? 'Any hour' : DAY_PART_NAME[part] }),
lab.sandbox ? null : h('span', { class: 'muted', text: part === 'dawn' ? '(until you open the shop)' : part === 'dusk' ? '(after the last customer, until you close)' : '(the shop is open)' }),
h('span', { class: 'spacer' }), icon(weather.icon, 'sm'), h('b', { text: lab.sandbox ? '' : weather.name })),
lab.sandbox || weather.id === 'clear' ? null : h('div', { class: 'muted', text: weather.desc }),
h('div', { class: 'row wrap seg harvest-mode' }, h('span', { text: 'Harvest:' }), mode('Careful', false, 'harvest-careful'), mode('Thorough ×2', true, 'harvest-thorough'),
this.thorough ? h('span', { class: 'muted', text: 'digs the plant out whole: its kind sprouts at half pace' }) : null)].filter(Boolean));
this.rows = {};
for (const d of this.deposits()) {
const m = st.lookup(d.materialId);
const s = depositStatus(st.gathering, d, now);
const locked = !lab.sandbox && d.rank > st.rank;
const plan = gatherPlan(st, d, m, { thorough: this.thorough });
const can = lab.sandbox ? d.take : harvestable(st.gathering, d, plan, now);
const take = lab.sandbox ? d.take : can || plan.take;
const fx = Object.entries(m.effects || {}).filter(([, v]) => Math.abs(v) >= 5).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 3);
const stock = lab.sandbox ? '∞' : this.stockText(d, s);
const when = lab.sandbox ? 'never runs out' : this.when(s, can);
this.can[d.id] = locked || can >= 5;
this.closed[d.id] = !lab.sandbox && !plan.open;
const g = btn(locked ? RANKS[d.rank].name : `${plan.method.verb} +${take} ml`, () => this.gather(d), { cls: 'gold', icon: locked ? 'lock' : plan.method.icon, disabled: locked || (!lab.sandbox && can < 5), act: 'gather-' + d.id });
const barI = h('i', { style: { width: Math.round((lab.sandbox ? 1 : s.fraction) * 100) + '%' } });
const meta = h('div', { class: 'meta', text: `${stock} · ${when}` });
this.rows[d.id] = { barI, meta, g, locked, take, card: /** @type {HTMLElement | null} */ (null) };
const notes = lab.sandbox ? [] : plan.factors.filter((f) => f.why !== 'satchel' && !f.why.startsWith('thorough')).map((f) => f.why);
const tool = plan.method.tool ? equipmentById(plan.method.tool) : null;
const card = h('div', { class: 'deposit parch' + (locked ? ' locked' : '') + (s.scarred ? ' scarred' : '') + (this.can[d.id] ? '' : ' spent'), 'data-deposit': d.id },
ingredientSprite(m, lab.sandbox ? 1 : s.fraction),
h('div', { class: 'dep-info' },
h('div', { class: 'title' }, m.name, d.rare ? h('span', { class: 'tag rare', text: 'rare' }) : null, plan.hour ? h('span', { class: 'tag hour', text: plan.hour }) : null),
d.place ? h('div', { class: 'meta place', text: d.place }) : null,
h('div', { class: 'bar' }, barI),
meta,
notes.length ? h('div', { class: 'meta note', text: notes.join(' · ') }) : null,
!lab.sandbox && tool && !plan.hasTool ? h('div', { class: 'meta muted', text: `${tool.name}: ${tool.price} coins at the shop` }) : null,
h('div', { class: 'meta fx' }, ...fx.map(([k, v]) => h('span', { class: 'fx-chip', title: EFFECT_BY_KEY[k].label }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ` ${Math.round(v)}`)),
h('span', { class: 'muted', text: ` · in stores: ${Math.round(st.stock(m.id))} ml` }))),
g);
this.rows[d.id].card = card;
card.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') this.setHover(d.id); });
card.addEventListener('pointerleave', () => { if (this.hover === d.id) this.setHover(null); });
list.appendChild(card);
}
clear(this.foot).append(`Room for ${st.cap.storage} ml of each ingredient. ${st.has('satchel') ? 'Your satchel carries half as much again. ' : ''}Only mature plants can be harvested. New sprouts come up at random spots until the ground is full again, even while the game is closed, and each new day brings every plant on.`);
this.paintBg();
this.grow();
}
stockText(d, s) {
return `${s.mature} of ${d.slots} mature${s.plants.length > s.mature ? ` · ${s.plants.length - s.mature} growing` : ''} · ${d.take} ml each`;
}
deposits() {
return this.lab.state.deposits.filter((d) => d.region === this.region);
}
paintBg() {
const backdrop = BACKDROPS[this.region];
const key = this.region + ':' + this.lab.state.seed + ':' + !!(backdrop && backdrop.ready) + ':' + GROWTH.ready;
if (key === this.bgKey) return;
this.bgKey = key;
this.bg = document.createElement('canvas');
this.bg.width = SCENE_W; this.bg.height = SCENE_H;
paintRegion(/** @type {CanvasRenderingContext2D} */ (this.bg.getContext('2d')), this.region, this.lab.state.seed);
this.ground = new PlantGround(this.region);
this.field = [];
}
shown() {
const lab = this.lab;
return this.deposits().filter((d) => lab.sandbox || d.rank <= lab.state.rank);
}
shapeOf(p) {
if (!p.key || !GROWTH.ready) return null;
const f = GROWTH.frame(p.key + '_mature_hover');
if (!f) return null;
const m = new Uint8Array(f[2] * f[3]);
for (const stage of ['sprout', 'ripe', 'mature', 'mature_hover']) {
const mm = GROWTH.mask(`${p.key}_${stage}`);
if (mm && mm.length === m.length) for (let k = 0; k < m.length; k++) m[k] |= mm[k];
}
return { w: f[2], h: f[3], m };
}
grow() {
if (!this.ground) return;
const st = this.lab.state, now = Date.now();
const plants = [];
for (const d of this.shown()) {
const m = st.lookup(d.materialId);
const key = m && m.wild && GATHERABLES[m.wild.key] ? m.wild.key : null;
const s = depositStatus(st.gathering, d, now);
for (const p of s.plants) plants.push({ ...p, dep: d, m, key, stage: this.lab.sandbox ? 'mature' : p.stage, grown: this.lab.sandbox ? 1 : p.grown });
}
plants.sort((a, b) => a.born - b.born || (a.id < b.id ? -1 : 1));
const spots = this.ground.place(plants, (p) => this.shapeOf(p));
const grewAt = {};
for (const p of plants) {
Object.assign(p, spots[p.id]);
const tag = p.id + ':' + p.stage;
grewAt[tag] = this.grewAt[tag] ?? (this.field.length ? this.time : -9);
}
this.grewAt = grewAt;
this.field = plants;
}
setHover(id) {
if (this.hover === id) return;
this.hover = id;
const p = id && this.field.find((q) => q.id === id);
if (this.canvas) this.canvas.style.cursor = p ? (p.stage === 'mature' ? 'pointer' : 'help') : 'default';
}
frameOf(p) {
return p.key && GROWTH.ready ? growthFrame(p.key, p.stage, this.hover === p.id || this.hover === p.dep.id) : null;
}
plantAt(e) {
const r = this.canvas.getBoundingClientRect();
const x = ((e.clientX - r.left) / r.width) * SCENE_W, y = ((e.clientY - r.top) / r.height) * SCENE_H;
const ripe = this.field.filter((p) => p.stage === 'mature');
return hitPlant(ripe, (p) => this.frameOf(p), x, y, SCENE_W, SCENE_H) || hitPlant(this.field, (p) => this.frameOf(p), x, y, SCENE_W, SCENE_H);
}
depositAt(e) {
const p = this.plantAt(e);
return p ? p.id : null;
}
gather(d, plant = null) {
const lab = this.lab, st = lab.state;
const m = st.lookup(d.materialId);
const plan = gatherPlan(st, d, m, { thorough: this.thorough });
const r = lab.sandbox ? { ok: true, amount: d.take, events: [], plant: plant ? plant.id : null } : st.gather(d.id, { thorough: this.thorough, ...(plant ? { plant: plant.id } : {}) });
if (!r.ok) {
audio.play('error');
const why = r.reason === 'full' ? `Your shelves are full of ${m.name}.` : r.reason === 'locked' ? 'You may not gather here yet.'
: r.reason === 'growing' ? `Still growing — only a mature plant can be harvested. This one matures in ${formatWait(r.nextIn || 60000)}.`
: `Nothing is mature yet. The next plant matures in ${formatWait(r.nextIn || 60000)}.`;
toast(r.reason === 'growing' ? 'Not ripe yet' : 'Nothing to gather', why, 'satchel');
return;
}
audio.play(plan.method.sound);
setTimeout(() => audio.play('select'), 140);
const at = this.field.find((p) => p.id === r.plant) || { x: d.x, y: d.y, key: null, stage: 'mature' };
const mark = st.gathering.marks[st.gathering.marks.length - 1];
if (!lab.sandbox && mark && r.plant && at.key) { mark.x = at.x; mark.y = at.y; }
const f = at.key && GROWTH.ready ? GROWTH.frame(at.key + '_mature') : null;
this.floaters.push({ x: at.x * SCENE_W, y: at.y * SCENE_H - Math.max(0, (f ? f[3] : 16) - 16), t: 0, text: `+${r.amount}`, color: m.look || m.color, shape: m.wild ? m.wild.shape : 'stone' });
for (const e of r.events || []) lab.announce(e);
if (lab.tutorial) lab.tutorial.notify('gather', d.materialId);
if (!lab.jarEls[d.materialId]) lab.buildShelf(); else lab.updateShelf();
lab.save();
this.refresh();
}
tapScene(e) {
const p = this.plantAt(e);
if (p) this.gather(p.dep, p);
}
frame(dt) {
if (!this.ctx || !this.bg) return;
this.time += dt;
const ctx = this.ctx, st = this.lab.state, now = Date.now();
ctx.drawImage(this.bg, 0, 0);
animateRegion(ctx, this.region, this.time);
for (const k of marksIn(st.gathering, this.region, now)) this.drawMark(ctx, k);
for (const p of this.field.slice().sort((a, b) => a.y - b.y)) {
const name = this.frameOf(p);
if (name) { this.drawPlant(ctx, p, name); continue; }
const x = Math.round(p.x * SCENE_W) - 8, y = Math.round(p.y * SCENE_H) - 14;
ctx.fillStyle = 'rgba(0,0,0,0.25)';
ctx.fillRect(x + 3, y + 14, 10, 2);
drawRaw(ctx, x, y, p.m.wild ? p.m.wild.shape : 'stone', p.m.look || p.m.color, 0.25 + p.grown * 0.75);
if (p.stage === 'mature' && Math.sin(this.time * 3 + p.x * 20) > 0.92) { ctx.fillStyle = '#fff6e0'; ctx.fillRect(x + 12, y + 1, 1, 1); }
}
this.paintSky(ctx, dt);
for (const f of this.floaters) {
f.t += dt;
const a = Math.max(0, 1 - f.t / 1.2);
ctx.globalAlpha = a;
for (let k = 0; k < 4; k++) {
const px = f.x + Math.cos(k * 1.7 + f.t * 3) * f.t * 14, py = f.y - f.t * 18 - k * 2;
ctx.fillStyle = `rgb(${Math.round(f.color[0] * 255)},${Math.round(f.color[1] * 255)},${Math.round(f.color[2] * 255)})`;
ctx.fillRect(Math.round(px), Math.round(py), 2, 2);
}
ctx.fillStyle = '#ffe39a';
ctx.font = '8px "Alchemist Pixel", monospace';
ctx.fillText(f.text, Math.round(f.x - 6), Math.round(f.y - 16 - f.t * 12));
ctx.globalAlpha = 1;
}
this.floaters = this.floaters.filter((f) => f.t < 1.2);
this._acc = (this._acc || 0) + dt;
if (this._acc > 1) { this._acc = 0; this.tick(); }
}
drawPlant(ctx, p, name) {
const x = Math.round(p.x * SCENE_W), y = Math.round(p.y * SCENE_H);
const f = /** @type {number[]} */ (GROWTH.frame(name));
const body = GROWTH.frame(p.key + '_' + p.stage);
const since = this.time - (this.grewAt[p.id + ':' + p.stage] ?? -9);
const sw = Math.max(4, Math.round((body ? body[2] : f[2]) * (p.stage === 'sprout' ? 0.3 : p.stage === 'ripe' ? 0.45 : 0.55)));
ctx.fillStyle = 'rgba(10,30,8,0.2)';
ctx.fillRect(x - Math.floor(sw / 2), y - 1, sw, 2);
ctx.fillRect(x - Math.floor(sw / 2) + 2, y, Math.max(2, sw - 4), 1);
ctx.fillRect(x - Math.floor(sw / 4), y - 1, Math.max(2, Math.floor(sw / 2)), 2);
GROWTH.draw(ctx, name, x, y - (since < 0.3 ? 1 : 0));
if (p.stage === 'mature' && CRYSTALS.has(p.key) && this.hover !== p.id && !this.closed[p.dep.id]) {
const spots = glintSpots(GROWTH, name);
const cycle = this.time * 0.6 + p.x * 7.3 + p.y * 3.1, phase = cycle % 2;
if (spots.length && phase < 0.5) {
const [dx, dy] = spots[Math.floor(cycle / 2) % spots.length];
sparkle(ctx, x + dx, y + dy, phase / 0.5);
}
}
}
drawMark(ctx, k) {
const f = k.key && GROWTH.ready ? GROWTH.frame(k.key + '_mature') : null;
const x = Math.round(k.x * SCENE_W), y = Math.round(k.y * SCENE_H);
const w = Math.max(8, Math.round((f ? f[2] : 16) * 0.75)), hw = Math.floor(w / 2);
const stone = this.region === 'quarry' || this.region === 'crags';
const [soil, dark, clod] = stone ? ['#6e6258', '#3a322c', '#a09280'] : this.region === 'moonfen' ? ['#3a3228', '#16120e', '#5a5040'] : ['#7a5230', '#3a2412', '#a07a4a'];
ctx.globalAlpha = Math.ceil((1 - k.faded) * 4) / 4;
ctx.fillStyle = soil;
ctx.fillRect(x - hw, y - 3, w, 4);
ctx.fillRect(x - hw + 2, y - 4, w - 4, 1);
ctx.fillStyle = dark;
ctx.fillRect(x - hw + 1, y + 1, w - 2, 1);
if (k.deep) {
ctx.fillRect(x - Math.floor(hw / 2), y - 2, Math.max(3, hw), 2);
}
ctx.fillStyle = clod;
for (let i = 0; i < 4; i++) ctx.fillRect(x - hw + 1 + ((i * 7 + Math.round(k.x * 97)) % Math.max(1, w - 2)), y - 4 + (i % 3) * 2, 1, 1);
if (!k.deep && !stone) {
ctx.fillStyle = '#4a6a22';
ctx.fillRect(x - 2, y - 6, 1, 3);
ctx.fillRect(x + 1, y - 5, 1, 2);
}
ctx.globalAlpha = 1;
}
paintSky(ctx, dt) {
const st = this.lab.state;
if (this.lab.sandbox) return;
const part = dayPart(st), weather = weatherOn(st.seed, st.day);
if (part !== 'day') {
ctx.fillStyle = part === 'dawn' ? 'rgba(255,170,190,0.16)' : 'rgba(90,50,120,0.28)';
ctx.fillRect(0, 0, SCENE_W, SCENE_H);
if (part === 'dusk') { ctx.fillStyle = 'rgba(255,140,60,0.12)'; ctx.fillRect(0, Math.round(SCENE_H * 0.35), SCENE_W, Math.round(SCENE_H * 0.2)); }
}
if (weather.id === 'fog') {
for (let k = 0; k < 4; k++) {
ctx.fillStyle = `rgba(225,225,235,${0.12 + 0.04 * k})`;
const y = Math.round(SCENE_H * (0.45 + 0.12 * k) + Math.sin(this.time * 0.4 + k) * 2);
ctx.fillRect(0, y, SCENE_W, 5 + k);
}
} else if (weather.id === 'rain' || weather.id === 'storm' || weather.id === 'frost') {
const snow = weather.id === 'frost';
while (this.rain.length < (snow ? 40 : 70)) this.rain.push({ x: Math.random() * SCENE_W, y: Math.random() * SCENE_H, v: 0.6 + Math.random() * 0.4 });
ctx.fillStyle = snow ? 'rgba(245,250,255,0.85)' : 'rgba(170,200,235,0.55)';
for (const r of this.rain) {
r.y += dt * (snow ? 14 : weather.id === 'storm' ? 150 : 110) * r.v;
r.x += dt * (snow ? Math.sin(this.time + r.v * 9) * 6 : weather.id === 'storm' ? -40 : -8);
if (r.y > SCENE_H) { r.y -= SCENE_H; r.x = Math.random() * SCENE_W; }
if (r.x < 0) r.x += SCENE_W;
ctx.fillRect(Math.round(r.x), Math.round(r.y), 1, snow ? 1 : 3);
}
if (weather.id === 'storm' && Math.sin(this.time * 0.9) > 0.995) { ctx.fillStyle = 'rgba(255,255,240,0.35)'; ctx.fillRect(0, 0, SCENE_W, SCENE_H); }
} else if (weather.id === 'heat') {
ctx.fillStyle = 'rgba(255,200,90,0.1)';
ctx.fillRect(0, 0, SCENE_W, SCENE_H);
}
}
when(s, can) {
if (s.fullIn <= 0) return 'fully grown';
const growing = `growing back${s.scarred ? ' slowly' : ''} · full in ${formatWait(s.fullIn)}`;
if (can >= 5) return growing;
return `next ripe in ${formatWait(s.nextIn)} · ${growing}`;
}
tick() {
const lab = this.lab, st = lab.state;
if (lab.sandbox || !this.rows) return;
const now = Date.now();
for (const d of this.deposits()) {
const row = this.rows[d.id];
if (!row) continue;
const s = depositStatus(st.gathering, d, now);
const plan = gatherPlan(st, d, st.lookup(d.materialId), { thorough: this.thorough });
const can = harvestable(st.gathering, d, plan, now);
row.barI.style.width = Math.round(s.fraction * 100) + '%';
row.meta.textContent = `${this.stockText(d, s)} · ${this.when(s, can)}`;
row.g.disabled = row.locked || can < 5;
this.can[d.id] = row.locked || can >= 5;
if (row.card) row.card.classList.toggle('spent', !this.can[d.id]);
this.closed[d.id] = !plan.open;
}
this.grow();
}
}
return { WildsView };
})();
// src/rendering/rabbit.js
const __m78 = (() => {
const { Rng, hashString } = __m6;
const { PAL, makeCanvas } = __m54;
const { RABBIT_MARKS } = __m28;
const RABBIT_W = 48;
const RABBIT_H = 40;
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const bayer = (x, y) => BAYER4[(x & 3) + (y & 3) * 4];
const K = '#1a1218';
const WHITE = [1, 1, 1];
const TEAL = [0.4, 0.9, 0.79], SICK = [0.55, 0.62, 0.3], ICE = [0.75, 0.9, 1], ASH = [0.54, 0.51, 0.59];
const EMBER = [1, 0.6, 0.3], CHAR = [0.23, 0.14, 0.09], GREY = [0.66, 0.64, 0.68];
const C_PINK = '#ffc7dd', C_NOSE = '#ff5aa8', C_HEART = '#ff5aa8', C_BLUSH = '#ff9fc7', C_RUBY = '#e0402c';
const C_RIME = PAL.frost3, C_ICE = '#8fd0ff';
const C_CHALK = '#e6dcc8', C_CHALK2 = '#c9c0b0', C_CRUST = '#a8a090';
const C_SINGE = '#3a2416', C_SINGE2 = '#5a3a20', C_SOOT = '#2a1a12';
const C_BURN = '#ffc7dd', C_BURN_RIM = '#c0506a', C_RAW = '#ff8fa0', C_ACID = '#d8e86a';
const C_SLIME = '#92cc71', C_SLIME2 = '#6f8a3a', C_DRIP = '#b6e08a';
const C_GOLD = PAL.brassHi, C_GLEAM = '#fff0b0', C_CREAM = '#fff6e0';
const C_RUNE = PAL.magic, C_RUNE_HI = PAL.magicHi, C_SHIM = '#5fd4b4', C_GREY = '#a8a2b0';
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const mod = (v, m) => ((v % m) + m) % m;
const lvl = (v) => (v >= 3 ? 3 : v >= 2 ? 2 : v >= 1 ? 1 : 0);
function css(rgb, k = 1) {
return `rgb(${Math.round(clamp(rgb[0] * 255 * k, 0, 255))},${Math.round(clamp(rgb[1] * 255 * k, 0, 255))},${Math.round(clamp(rgb[2] * 255 * k, 0, 255))})`;
}
function mix(a, b, t) {
return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
function rgbOf(v, fallback) {
return Array.isArray(v) && v.length >= 3 ? [clamp(+v[0] || 0, 0, 1), clamp(+v[1] || 0, 0, 1), clamp(+v[2] || 0, 0, 1)] : fallback;
}
function pen(ctx, fx, fy, dx, dy, mirror, clip = true) {
return (x, y, w, h, c) => {
let X = Math.round(x) + dx, Y = Math.round(y) + dy;
let W = Math.max(1, Math.round(w)), H = Math.max(1, Math.round(h));
if (clip) {
if (X < 0) { W += X; X = 0; }
if (Y < 0) { H += Y; Y = 0; }
if (X + W > RABBIT_W) W = RABBIT_W - X;
if (Y + H > RABBIT_H) H = RABBIT_H - Y;
if (W <= 0 || H <= 0) return;
}
ctx.fillStyle = c;
ctx.fillRect(fx + (mirror ? RABBIT_W - X - W : X), fy + Y, W, H);
};
}
const E = (cx, cy, rx, ry) => ({ cx: Math.round(cx), cy: Math.round(cy), rx: Math.max(1, Math.round(rx)), ry: Math.max(1, Math.round(ry)) });
const half = (e, dy) => Math.round(e.rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (e.ry * e.ry))));
function ell(P, e, grow, col) {
const g = { rx: e.rx + grow, ry: e.ry + grow };
for (let yy = -g.ry; yy <= g.ry; yy++) {
const w = half(g, yy);
P(e.cx - w, e.cy + yy, w * 2 + 1, 1, col);
}
}
function spanOf(e, y, grow = 0) {
const g = { rx: e.rx + grow, ry: e.ry + grow }, yy = y - e.cy;
if (yy < -g.ry || yy > g.ry) return null;
const w = half(g, yy);
return [e.cx - w, e.cx + w];
}
function rowsOf(parts, grow = 0) {
let y0 = Infinity, y1 = -Infinity;
for (const e of parts) { y0 = Math.min(y0, e.cy - e.ry - grow); y1 = Math.max(y1, e.cy + e.ry + grow); }
const out = [];
for (let y = y0; y <= y1; y++) {
let x0 = Infinity, x1 = -Infinity;
for (const e of parts) {
const s = spanOf(e, y, grow);
if (s) { x0 = Math.min(x0, s[0]); x1 = Math.max(x1, s[1]); }
}
if (x1 >= x0) out.push([y, x0, x1]);
}
return out;
}
function colEdge(parts, x, dir = -1) {
let best = null;
for (const e of parts) {
const dx = Math.abs(x - e.cx);
if (dx > e.rx) continue;
for (let i = 0; i <= e.ry; i++) {
const yy = dir < 0 ? i - e.ry : e.ry - i;
if (half(e, yy) >= dx) { const y = e.cy + yy; if (best === null || (dir < 0 ? y < best : y > best)) best = y; break; }
}
}
return best;
}
function xRange(parts) {
let x0 = Infinity, x1 = -Infinity;
for (const e of parts) { x0 = Math.min(x0, e.cx - e.rx); x1 = Math.max(x1, e.cx + e.rx); }
return [x0, x1];
}
function stamp(P, grid, x, y, pal) {
for (let r = 0; r < grid.length; r++) {
const row = grid[r];
for (let i = 0; i < row.length;) {
const ch = row[i];
let j = i + 1;
while (j < row.length && row[j] === ch) j++;
const col = pal[ch];
if (col) P(x + i, y + r, j - i, 1, col);
i = j;
}
}
}
const HORNS = ['kk...', 'khk..', '.khk.', '.khHk', '..kHk'];
const ANTLERS = ['.k...k.', 'kak.kak', 'kak.kak', '.kakak.', '..kak..', '..kAk..', '..kAk..'];
const UNIHORN = ['..k..', '.kwk.', '.kyk.', '.kwk.', 'kyywk', 'kwyyk'];
const WING = ['k.....', 'kk....', 'kmk...', 'kmmkk.', 'kmMmmk', '.kkkkk'];
const WING_FOLD = ['kkkkk.', 'kmmMmk', '.kkkkk'];
const SPIKE = ['.k.', 'kik', 'kIk'];
const CRYSTAL = ['.k.', 'kik', 'ktk', 'kTk'];
const RUNES = [['x.x', '.x.', 'x.x'], ['xxx', '.x.', '.x.'], ['x..', 'xxx', '..x'], ['.x.', 'x.x', '.x.']];
const HORN_H = { horns: 5, antlers: 7, unihorn: 6 };
function heart(P, x, y, c) {
P(x, y, 1, 1, c); P(x + 2, y, 1, 1, c); P(x, y + 1, 3, 1, c); P(x + 1, y + 2, 1, 1, c);
}
function plus(P, x, y, c) {
P(x - 1, y, 3, 1, c); P(x, y - 1, 1, 3, c);
}
function rabbitLevels(snap) {
const lv = (snap && snap.lv) || [];
const o = {};
for (let i = 0; i < RABBIT_MARKS.length; i++) o[RABBIT_MARKS[i]] = lvl(lv[i]);
return o;
}
const scarsOf = (snap) => { const s = (snap && snap.sc) || []; return [lvl(s[0]), lvl(s[1]), lvl(s[2]), lvl(s[3]), lvl(s[4])]; };
const traitsOf = (snap) => new Set(snap && Array.isArray(snap.traits) ? snap.traits : []);
function rabbitPose(snap, want) {
if (!snap || snap.alive === false) return 'dead';
const L = rabbitLevels(snap);
if (L.death === 3 || snap.hp >= 3) return 'collapse';
if (want === 'loaf' || want === 'rear' || want === 'flop') return want;
if (L.toxicity >= 2 || snap.hp >= 2) return 'sick';
return 'idle';
}
function rabbitPace(snap) {
const L = rabbitLevels(snap);
return (L.death >= 2 ? 0.5 : L.death === 1 ? 0.8 : 1) * (L.toxicity === 3 ? 0.6 : 1) * (snap && snap.stage === 'elder' ? 0.7 : 1) * (L.vitality === 3 || L.fire === 3 ? 1.6 : 1);
}
const STAGE_G = { kit: 0.62, young: 0.82, adult: 1, elder: 0.97 };
function rabbitAnchors(look, snap, want) {
look = look || {};
const L = rabbitLevels(snap), tr = traitsOf(snap);
const pose = rabbitPose(snap, want);
const stage = snap && STAGE_G[snap.stage] ? snap.stage : 'adult';
const kit = stage === 'kit', elder = stage === 'elder';
const mus = L.strength;
const size = clamp(Number(look.size) || 1, 0.85, 1.15);
const g = clamp(size * STAGE_G[stage] * (1 + 0.04 * mus) * (tr.has('giant') ? 1.18 : tr.has('tiny') ? 0.8 : 1), 0.5, 1.3);
const hs = kit ? 0.95 * Math.max(g, 0.8) : 0.25 + 0.75 * g;
const lying = pose === 'dead' || pose === 'collapse' || pose === 'flop';
const preg = snap && snap.preg ? 1 : 0;
const oy = 34;
const ox = Math.round(24 - (lying ? 15 : 14) * g);
const bulk = [0, 1, 1, 2][mus];
const earK = (look.ear === 'short' ? 0.6 : 1) * (kit ? 0.7 : 1);
const hornH = tr.has('antlers') ? HORN_H.antlers : tr.has('unihorn') ? HORN_H.unihorn : tr.has('horns') ? HORN_H.horns : 0;
const headRy = Math.round(3.3 * hs);
let haunch, chest, head;
if (lying) {
const hry = Math.round(4.2 * g) + preg, cry = Math.round(3.6 * g + bulk * 0.5);
haunch = E(ox + 11 * g, oy - hry, 11 * g, hry);
chest = E(ox + 21 * g, oy - cry, 5 * g + bulk, cry);
head = E(ox + 27 * g, oy - headRy, 4.2 * hs, headRy);
} else {
let hrx = 10 * g, hry = 6 * g + preg, ccx = ox + 19 * g, ccy = oy - 8 * g, crx = 6 * g + bulk, cry = 5 * g + bulk * 0.5;
let hcx = ox + 24 * g, hcy = oy - 13 * g;
if (pose === 'sick') { hrx -= 1; hry += 1; hcy += 2; } // hunched, head hanging
else if (pose === 'loaf') { hrx -= 1; hry -= 1; ccx -= 1; ccy += 1; hcx -= 1; hcy += 2; } // tucked into a loaf
if (elder) { hry += 1; hcy += 1; } // a rounder back, the head a little lower
if (pose === 'rear') {
const earLen = look.ear === 'lop' ? 0 : Math.round(10 * hs * earK);
const room = Math.round(hcy) - headRy - 1 - Math.max(Math.ceil(earLen * 0.7), hornH);
const lift = clamp(Math.min(Math.round(5 * g), room), 0, 6);
ccx += g; ccy -= Math.min(3 * g, lift); cry += 1; hcx -= g; hcy -= lift;
}
haunch = E(ox + 9 * g, 0, hrx, hry);
haunch.cy = oy - haunch.ry;
chest = E(ccx, ccy, crx, cry);
head = E(hcx, hcy, 4.2 * hs, headRy);
}
const bulges = [];
if (mus >= 2) bulges.push(E(chest.cx + chest.rx - 1, chest.cy + chest.ry - 2, 2 * g + 0.4, 2 * g + 0.4)); // forearm
if (mus >= 3) {
bulges.push(E(chest.cx - 1, chest.cy - chest.ry + 2, 3.2 * g, 2.2 * g)); // shoulder
bulges.push(E(haunch.cx + 3 * g, haunch.cy - haunch.ry + 2.5 * g, 4.2 * g, 3 * g)); // thigh
bulges.push(E((chest.cx + head.cx) / 2, (chest.cy - chest.ry + head.cy + head.ry) / 2 + 1, 2.4 * g, 2 * g)); // neck
}
const parts = [haunch, chest, ...bulges, head];
const top = head.cy - head.ry;
const ew = hs >= 1.1 ? 4 : 3;
const droop = lying ? 0 : pose === 'sick' || (snap && snap.hp >= 2) || L.frost === 2 ? 3 : pose === 'loaf' ? 2 : 0;
const shift = tr.has('eye3') ? 1 : 0;
const ears = [];
if (lying) {
const len = Math.max(3, Math.round(8 * hs * earK));
ears.push({ kind: 'flat', far: true, x: head.cx - 2 - len, y: top - 1, len, w: 2, lean: 0 });
ears.push({ kind: 'flat', far: false, x: head.cx - 1 - len, y: top + 1, len, w: 2, lean: 0 });
} else {
const kinds = look.ear === 'lop' ? ['lop', 'lop'] : look.ear === 'half' ? ['lop', 'up'] : ['up', 'up'];
for (let i = 0; i < 2; i++) {
const far = i === 0;
if (kinds[i] === 'lop') {
const y = top - 1;
ears.push({ kind: 'lop', far, x: head.cx - (far ? 5 : 3) - shift, y, len: head.cy + 4 - y, w: ew, lean: 0 });
} else {
const base = top + 1;
const len = clamp(Math.round((far ? 9 : 10) * hs * earK) - droop, 2, base);
ears.push({ kind: 'up', far, x: head.cx - (far ? 3 : 0) - shift, y: base, len, w: ew, lean: droop ? 2 : 4 });
}
}
}
const legs = [];
if (pose === 'dead') {
const lh = Math.max(2, Math.round(3 * g));
for (const x of [chest.cx - 1, haunch.cx + Math.round(haunch.rx * 0.35)]) {
const y = colEdge([haunch, chest], x, -1) ?? haunch.cy;
legs.push({ x, y: y - lh, w: 2, h: lh + 1 });
}
} else if (pose === 'flop') legs.push({ x: haunch.cx - haunch.rx - 2, y: oy - 3, w: Math.max(3, Math.round(5 * g)), h: 2 });
const eye = { x: head.cx + Math.max(1, Math.round(2 * hs)), y: head.cy - 1 };
const nose = { x: head.cx + half(head, 1), y: head.cy + 1 };
const tailR = Math.max(1, Math.round([1, 2, 3][look.tail === 0 || look.tail === 2 ? look.tail : 1] * Math.min(1, g + 0.25)));
const tx = haunch.cx - haunch.rx;
const tail = { x: tx, y: haunch.cy - (lying ? 1 : 2), r: tailR, len: clamp(Math.round(9 * g), 3, tx - 1) };
const prx = Math.max(2, Math.round(3 * Math.min(g, 1.1)));
const plume = E(Math.max(prx + 2, tx - 1), tail.y - Math.max(2, Math.round(2.5 * g)), prx, Math.max(2, Math.round(2.2 * Math.min(g, 1.1))));
const wing = lying ? { x: haunch.cx - 2, y: haunch.cy - haunch.ry - 2 } : { x: chest.cx - chest.rx - 3, y: chest.cy - chest.ry - 4 };
let x0 = Math.min(haunch.cx - haunch.rx, tx - tailR) - 1;
if (tr.has('tail-lizard')) x0 = Math.min(x0, tx - tail.len - 1);
if (tr.has('tail-plume')) x0 = Math.min(x0, plume.cx - plume.rx - 1);
if (legs.length && pose === 'flop') x0 = Math.min(x0, legs[0].x - 1);
let x1 = 0;
for (const e of parts) x1 = Math.max(x1, e.cx + e.rx + 1);
let y0 = top - 1;
for (const e of ears) y0 = Math.min(y0, e.kind === 'up' ? e.y - e.len + 1 : e.y - 1);
if (tr.has('ears2')) y0 = Math.min(y0, ...ears.map((e) => (e.kind === 'flat' ? e.y - 3 : y0)));
if (hornH) y0 = Math.min(y0, top + 1 - hornH);
if (tr.has('wings')) y0 = Math.min(y0, wing.y - 1);
for (const l of legs) y0 = Math.min(y0, l.y - 1);
if (tr.has('spines')) y0 = Math.min(y0, Math.min(haunch.cy - haunch.ry, chest.cy - chest.ry) - 5);
return {
pose, lying, g, hs, haunch, chest, head, bulges, parts, ears, legs,
eye, eye3: { x: head.cx + 1, y: top + 1 }, nose, cheek: { x: head.cx + 1, y: head.cy + 1 },
brow: { x: head.cx - 1 - shift, y: top }, tail, plume, wing,
back: { x0: haunch.cx - haunch.rx + 2, x1: chest.cx, y: haunch.cy - haunch.ry },
belly: { x: chest.cx + 1, y: chest.cy + chest.ry - 2 },
feetY: oy - 1,
cx: Math.round((haunch.cx - haunch.rx + head.cx + head.rx) / 2),
top: Math.max(0, y0 + 1),
box: { x0, y0, x1, y1: oy + 1 },
};
}
const shades = (c) => ({ body: css(c), shade: css(c, 0.82), dark: css(c, 0.68), hi: css(mix(c, WHITE, 0.4)), rgb: c });
function tintCoat(c, L, sc, dead, cause) {
let o = mix(c, TEAL, [0, 0.12, 0.25, 0.4][L.transformation]);
o = mix(o, SICK, [0, 0.22, 0.4, 0.58][L.toxicity]);
o = mix(o, ICE, [0, 0.15, 0.35, 0.55][L.frost]);
o = mix(o, ASH, Math.min(0.85, [0, 0.22, 0.45, 0.7][L.death] + [0, 0.1, 0.2, 0.35][sc[3]]));
const v = [1, 1.04, 1.08, 1.12][L.vitality];
o = [Math.min(1, o[0] * v), Math.min(1, o[1] * v), Math.min(1, o[2] * v)];
if (L.fire === 3) o = mix(o, EMBER, 0.15);
if (dead) {
o = mix(o, ASH, 0.3).map((x) => x * 0.9);
if (cause === 'fire') o = mix(o, CHAR, 0.65);
}
return o;
}
function spotsOn(a, seed, label, n, upper = false) {
const r = new Rng(hashString(`${seed}:${label}`));
const out = [];
for (let i = 0; i < n; i++) {
const e = r.next() < 0.68 ? a.haunch : a.chest;
const ang = upper ? r.range(Math.PI * 1.08, Math.PI * 1.92) : r.range(0, Math.PI * 2), rad = Math.sqrt(r.next()) * 0.72;
out.push({ x: Math.round(e.cx + Math.cos(ang) * (e.rx - 1) * rad), y: Math.round(e.cy + Math.sin(ang) * (e.ry - 1) * rad) });
}
return out;
}
function drawBody(P, look, snap, a, low) {
const L = rabbitLevels(snap), sc = scarsOf(snap);
const dead = !snap || snap.alive === false, cause = dead ? (snap && snap.cause) || 'unknown' : null;
const coat = rgbOf(look.coat, [0.93, 0.89, 0.82]);
const coat2 = rgbOf(look.coat2, [0.36, 0.24, 0.18]);
const kit = snap && snap.stage === 'kit';
const fur = tintCoat(coat, L, sc, dead, cause);
const fur2 = tintCoat(kit ? mix(coat2, coat, 0.5) : coat2, L, sc, dead, cause);
const S = {
P, a, L, sc, tr: traitsOf(snap), dead, cause, pattern: look.pattern || 'solid', eyeCol: look.eye || 'dark',
seed: (look.seed >>> 0) || 1, fur, C: shades(fur), C2: shades(fur2),
};
if (!low && !dead) auraLayer(S);
farLayer(S);
for (const e of a.parts) ell(P, e, 1, K); // outline pass
fillLayer(S);
patternLayer(S);
shadeLayer(S);
strengthMarks(S);
if (S.tr.has('scales')) scaleMarks(S);
coatMarks(S);
burnMarks(S);
acidMarks(S);
alkaliMarks(S);
frostMarks(S);
sickMarks(S);
nearLayer(S);
faceLayer(S);
if (dead) causeLayer(S);
}
const AURAS = /** @type {[string, string, number[], number][]} */ ([
['vitality', '255,214,120', [0, 0.12, 0.22, 0.32], 2],
['arcana', '166,120,255', [0, 0.15, 0.3, 0.45], 1],
['fire', '255,122,28', [0, 0.1, 0.2, 0.35], 0],
]);
function auraLayer(S) {
for (const [ch, rgb, alpha, grow] of AURAS) {
const v = S.L[ch];
if (!v) continue;
const col = `rgba(${rgb},${alpha[v]})`;
for (const [y, x0, x1] of rowsOf(S.a.parts, grow + v + 1)) S.P(x0, y, x1 - x0 + 1, 1, col);
}
}
function farLayer(S) {
const { P, a, tr, C, C2 } = S;
for (const l of a.legs) {
P(l.x - 1, l.y - 1, l.w + 2, l.h + 2, K);
P(l.x, l.y, l.w, l.h, S.pattern === 'points' ? C2.body : C.body);
if (a.pose === 'dead') P(l.x, l.y, l.w, 1, C.hi);
}
if (tr.has('wings')) wingArt(S, true);
tailLayer(S);
if (tr.has('ears2')) for (const e of a.ears) {
const x = { ...e, x: e.kind === 'flat' ? e.x + 1 : e.x - 2, y: e.kind === 'flat' ? e.y - 2 : e.y, len: Math.max(2, e.len - 2) };
earArt(S, x, 'extra');
}
for (const e of a.ears) if (e.far) earArt(S, e, 'far');
hornArt(S, true);
}
function tailLayer(S) {
const { P, a, tr, C2 } = S, t = a.tail;
if (tr.has('tail-lizard')) {
const n = t.len, drop = Math.max(0, a.feetY - 2 - t.y);
const body = css(mix(S.fur, [0.42, 0.58, 0.38], 0.45), 0.8), dark = css(mix(S.fur, [0.42, 0.58, 0.38], 0.45), 0.6);
const cols = [];
for (let i = 0; i < n; i++) cols.push([t.x - i, t.y - 1 + Math.round((drop * i) / n), i < n / 3 ? 3 : i < (2 * n) / 3 ? 2 : 1]);
for (const [x, y, th] of cols) P(x, y - 1, 1, th + 2, K);
P(t.x - n, cols[n - 1][1], 1, 1, K);
for (const [x, y, th] of cols) { P(x, y, 1, th, body); if ((x + y) & 1) P(x, y + th - 1, 1, 1, dark); }
return;
}
if (tr.has('tail-plume')) {
const e = a.plume;
ell(P, e, 1, K);
ell(P, e, 0, C2.body);
P(e.cx - e.rx + 1, e.cy - e.ry, 2, 1, C_CREAM); P(e.cx - e.rx, e.cy - 1, 1, 2, C_CREAM); P(e.cx, e.cy - e.ry, 1, 1, C2.hi);
return;
}
const e = { cx: t.x, cy: t.y, rx: t.r, ry: t.r };
ell(P, e, 1, K);
ell(P, e, 0, S.pattern === 'points' ? C2.body : css(mix(S.fur, WHITE, 0.6)));
}
function earArt(S, e, side) {
const { P, L, sc } = S;
const base = S.pattern === 'hooded' || S.pattern === 'points' ? S.C2 : S.C;
const rgb = sc[3] >= 2 ? mix(base.rgb, GREY, 0.5) : base.rgb;
const fill = css(rgb, side === 'near' ? 1 : side === 'far' ? 0.82 : 0.68);
const inner = side !== 'near' ? null : S.dead ? '#c8a0b0' : C_PINK;
const tips = [];
if (!S.dead) for (let i = 0; i < L.frost; i++) tips.push(C_RIME);
const markN = sc[0] >= 2 ? sc[0] : sc[2];
for (let i = 0; i < markN; i++) tips.push(sc[0] >= 2 ? C_SOOT : PAL.frost0);
if (e.kind === 'up') {
for (let i = 0; i < e.len; i++) {
const y = e.y - i, x = e.x - Math.floor(i / e.lean), fromTip = e.len - 1 - i;
if (fromTip === 0) { P(x + 1, y, e.w - 2, 1, K); continue; }
P(x, y, e.w, 1, K);
const tip = tips[fromTip - 1];
P(x + 1, y, e.w - 2, 1, tip || fill);
if (inner && !tip && i > 0) P(x + e.w - 2, y, 1, 1, inner);
}
} else if (e.kind === 'lop') {
P(e.x, e.y, e.w, e.len - 1, K);
P(e.x + 1, e.y + e.len - 1, e.w - 2, 1, K);
P(e.x + 1, e.y + 1, e.w - 2, e.len - 2, fill);
if (side === 'near') P(e.x + 1, e.y + 1, 1, Math.max(1, e.len - 3), base.shade);
for (let i = 0; i < tips.length && i < e.len - 2; i++) P(e.x + 1, e.y + e.len - 2 - i, e.w - 2, 1, tips[i]);
} else {
P(e.x + 1, e.y - 1, e.len, 1, K);
P(e.x, e.y, 1, e.w, K);
P(e.x - 1, e.y + e.w - 1, 1, 1, K);
P(e.x, e.y + e.w, e.len + 1, 1, K);
P(e.x + 1, e.y, e.len, e.w, fill);
P(e.x + 1, e.y, 1, 1, css(rgb, 0.68));
if (inner && e.len > 4) P(e.x + 3, e.y + e.w - 1, Math.max(1, e.len - 6), 1, inner);
for (let i = 0; i < tips.length && i < e.len - 1; i++) P(e.x + 1 + i, e.y, 1, e.w, tips[i]);
}
}
function hornArt(S, far) {
const { P, a, tr } = S;
if (tr.has('unihorn')) {
if (!far) stamp(P, UNIHORN, a.head.cx - 1, a.brow.y + 2 - UNIHORN.length, { k: K, w: C_CREAM, y: C_GOLD });
return;
}
const grid = tr.has('antlers') ? ANTLERS : tr.has('horns') ? HORNS : null;
if (!grid) return;
const pal = grid === ANTLERS
? (far ? { k: K, a: '#a8743f', A: '#6d4527' } : { k: K, a: '#c48a5c', A: '#8a5a31' })
: (far ? { k: K, h: PAL.parch1, H: PAL.parch0 } : { k: K, h: PAL.parch2, H: '#a8743f' });
stamp(P, grid, a.brow.x - 3 - (far ? 3 : 0), a.brow.y + (far ? 1 : 2) - grid.length, pal);
}
function wingArt(S, far) {
const pal = far ? { k: K, m: '#7a5ac8', M: '#5a3aa8' } : { k: K, m: '#b491ee', M: PAL.magic };
stamp(S.P, S.a.lying ? WING_FOLD : WING, S.a.wing.x - (far ? 2 : 0), S.a.wing.y - (far ? 1 : 0), pal);
}
function fillLayer(S) {
const { P, a, C, C2 } = S, h = a.haunch;
ell(P, h, 0, C.body);
ell(P, a.chest, 0, C.body);
for (const b of a.bulges) ell(P, b, 0, C.body);
ell(P, { cx: h.cx, cy: h.cy + Math.round(h.ry / 2), rx: Math.max(1, h.rx - 2), ry: Math.max(1, Math.round(h.ry / 3)) }, 0, C.shade);
ell(P, { cx: a.belly.x, cy: a.belly.y, rx: Math.max(1, Math.round(3 * a.g)), ry: Math.max(1, Math.round(2 * a.g)) }, 0, C.hi);
ell(P, a.head, 0, S.pattern === 'hooded' ? C2.body : C.body);
if (!a.lying) {
const foot = S.pattern === 'points' ? C2.body : C.dark, fw = Math.round(5 * a.g), hw = Math.round(6 * a.g);
P(a.chest.cx - fw, a.feetY, fw, 1, foot);
P(h.cx - hw, a.feetY, hw, 1, foot);
}
}
function shadeLayer(S) {
const { P, a } = S;
const lit = 'rgba(255,250,235,0.28)', fur = 'rgba(40,24,16,0.14)', shade = 'rgba(40,22,12,0.22)', deep = 'rgba(30,16,8,0.32)';
for (const e of [a.haunch, a.chest, a.head]) {
for (let yy = -e.ry; yy <= e.ry; yy++) {
const w = half(e, yy), y = e.cy + yy, t = (yy + e.ry) / Math.max(1, 2 * e.ry);
for (let x = e.cx - w; x <= e.cx + w; x++) {
const b = bayer(x, y), u = (x - (e.cx - w)) / Math.max(1, 2 * w);
if (t < 0.32 && u > 0.25 && u < 0.8 && b < 9 - t * 20) P(x, y, 1, 1, lit);
else if (t > 0.72 && b < (t - 0.62) * 34) P(x, y, 1, 1, t > 0.88 ? deep : shade);
else if (u < 0.12 && b < 8) P(x, y, 1, 1, shade);
else if (b === 3 && (y & 1)) P(x, y, 1, 1, fur);
}
}
}
}
function patternLayer(S) {
const { P, a, C2 } = S, body = [a.haunch, a.chest];
if (S.pattern === 'dutch') {
const seam = a.chest.cx - a.chest.rx + 1, bw = Math.max(2, Math.round(2.5 * a.g));
for (const [y, x0, x1] of rowsOf(body)) {
const l = Math.max(x0, seam - bw), r = Math.min(x1, seam + bw);
if (r >= l) P(l, y, r - l + 1, 1, C2.body);
}
} else if (S.pattern === 'spotted') {
const r = new Rng(hashString(`${S.seed}:spots`)), n = 3 + r.int(0, 2);
for (let i = 0; i < n; i++) {
const e = i === 0 ? a.chest : a.haunch;
const ang = r.range(0, Math.PI * 2), rad = Math.sqrt(r.next()) * 0.6;
const px = Math.round(e.cx + Math.cos(ang) * e.rx * rad), py = Math.round(e.cy + Math.sin(ang) * e.ry * rad);
const b = { rx: Math.max(1, Math.round(r.range(1.5, 3) * a.g)), ry: Math.max(1, Math.round(r.range(1, 2) * a.g)) };
for (let yy = -b.ry; yy <= b.ry; yy++) {
const s = spanOf(e, py + yy);
if (!s) continue;
const w = half(b, yy), l = Math.max(s[0], px - w), rr = Math.min(s[1], px + w);
if (rr >= l) P(l, py + yy, rr - l + 1, 1, C2.body);
}
}
} else if (S.pattern === 'agouti') {
const tick = css(S.fur, 1.15), dark = css(S.fur, 0.8);
const [x0, x1] = xRange(body);
for (let x = x0; x <= x1; x++) {
const y0 = colEdge(body, x, -1);
if (y0 === null) continue;
for (let y = y0; y < y0 + 3; y++) { const b = bayer(x, y); if (b < 5) P(x, y, 1, 1, tick); else if (b > 13) P(x, y, 1, 1, dark); }
}
}
}
function strengthMarks(S) {
const { P, a, C } = S, s = S.L.strength, h = a.haunch, c = a.chest;
if (!s) return;
const ry = Math.max(2, h.ry - 1), rx = Math.max(2, h.rx - 3);
for (let yy = -ry + 1; yy <= ry - 2; yy++) P(h.cx + Math.round(rx * 0.6 * Math.sqrt(1 - (yy * yy) / (ry * ry))), h.cy + yy, 1, 1, C.dark);
if (s < 2) return;
for (let i = 0; i < 3; i++) { P(h.cx - 4 + i, h.cy - 1 + i, 1, 1, C.dark); P(h.cx - 1 + i, h.cy - 3 + i, 1, 1, C.dark); }
P(c.cx - 2, c.cy - c.ry + 1, 4, 1, C.hi);
const f = a.bulges[0];
if (f) P(f.cx, f.cy - f.ry + 1, 1, 1, C.hi);
if (s < 3) return;
const vein = css(S.fur, 0.6);
P(c.cx + 1, c.cy, 1, 2, vein); P(c.cx + 2, c.cy + 2, 1, 1, vein);
for (let i = 0; i < 3; i++) P(h.cx - 5 + i * 3, h.cy - h.ry + 2, 1, 2, C.dark);
if (a.bulges[1]) P(a.bulges[1].cx - 1, a.bulges[1].cy - a.bulges[1].ry + 1, 3, 1, C.hi);
}
function scaleMarks(S) {
const { P, a } = S, h = a.haunch;
const dk = css(mix(S.fur, [0.35, 0.55, 0.4], 0.35), 0.72), hi = css(mix(S.fur, [0.6, 0.85, 0.6], 0.3), 1.12);
for (let y = h.cy - h.ry + 2, row = 0; y <= h.cy + h.ry - 2; y += 2, row++) {
const s = spanOf(h, y);
if (!s) continue;
for (let x = s[0] + 1 + (row & 1) * 2; x <= Math.min(s[1] - 2, h.cx + Math.round(h.rx / 2)); x += 4) { P(x, y, 2, 1, dk); P(x, y - 1, 1, 1, hi); }
}
}
function coatMarks(S) {
const { P, a, L, sc } = S, body = [a.haunch, a.chest];
if (!S.dead && L.vitality >= 1) for (let x = a.back.x0 + 1; x < a.back.x1; x++) {
const y = colEdge(body, x, -1);
if (y !== null) P(x, y + 1, 1, 1, S.C.hi);
}
if (!S.dead && L.vitality >= 3) for (const [y, , x1] of rowsOf([a.haunch, a.chest, ...a.bulges])) {
const hs = spanOf(a.head, y, 1);
if (!hs || x1 < hs[0]) P(x1, y, 1, 1, C_GOLD);
}
if (L.transformation >= 2) for (const p of spotsOn(a, S.seed, 'teal', L.transformation === 3 ? 6 : 3)) P(p.x, p.y, 1, 1, C_SHIM);
if (sc[4] >= 1) {
const r = new Rng(hashString(`${S.seed}:rune`)), h = a.haunch;
stamp(P, RUNES[r.int(0, 3)], h.cx - 1 - Math.round(h.rx / 3), h.cy - 1, { x: C_RUNE });
if (sc[4] >= 2) stamp(P, RUNES[r.int(0, 3)], a.chest.cx - 2, a.chest.cy - 1, { x: C_RUNE });
if (sc[4] >= 3) for (const p of spotsOn(a, S.seed, 'stars', 5)) P(p.x, p.y, 1, 1, C_RUNE_HI);
}
if (sc[3] >= 3) for (const p of spotsOn(a, S.seed, 'grey', 6, true)) P(p.x, p.y, 2, 1, '#c8c2cc');
}
function burnMarks(S) {
const { P, a, sc } = S;
for (const p of spotsOn(a, S.seed, 'singe', [0, 3, 7, 12][sc[0]], true)) { P(p.x, p.y, 1, 1, C_SINGE); P(p.x + 1, p.y, 1, 1, C_SINGE2); }
if (sc[0] >= 3) { const h = a.haunch; P(h.cx - 2, h.cy - h.ry + 1, 4, 3, C_SOOT); P(h.cx - 2, h.cy - h.ry + 1, 4, 1, C_SINGE); }
const f = S.dead ? 0 : S.L.fire;
if (f >= 2) for (const p of spotsOn(a, S.seed, 'embers', f === 3 ? 5 : 3, true)) { P(p.x, p.y, 1, 1, '#ff7a1c'); if (f === 3) P(p.x, p.y - 1, 1, 1, '#ffb444'); }
}
const acidSpots = (seed, a) => spotsOn(a, seed, 'acid', 5);
function acidMarks(S) {
const { P, a } = S;
for (const p of spotsOn(a, S.seed, 'burns', [0, 2, 4, 7][S.sc[1]])) { const w = 2 + (p.x & 1); P(p.x, p.y, w + 1, 3, C_BURN_RIM); P(p.x, p.y, w, 2, C_BURN); }
const v = S.dead ? 0 : S.L.acid;
for (const p of acidSpots(S.seed, a).slice(0, [0, 1, 3, 5][v])) {
P(p.x - 1, p.y - 1, 3, 3, C_BURN_RIM); P(p.x, p.y, 1, 1, v === 3 ? C_RUBY : C_RAW); P(p.x - 1, p.y - 1, 1, 1, C_ACID);
}
}
function alkaliMarks(S) {
const { P, a } = S, v = S.dead ? 0 : S.L.alkali, body = [a.haunch, a.chest];
if (!v) return;
for (const p of spotsOn(a, S.seed, 'chalk', 4)) P(p.x, p.y, 1, 1, C_CHALK);
if (v >= 2) {
const [x0, x1] = xRange(body);
for (let x = x0; x <= x1; x++) {
const y0 = colEdge(body, x, -1);
if (y0 === null) continue;
for (let y = y0; y < y0 + 3; y++) { const b = bayer(x, y); if (b < 3) P(x, y, 1, 1, C_CHALK); else if (b > 13) P(x, y, 1, 1, C_CHALK2); }
}
if (!a.lying) { P(a.chest.cx - Math.round(5 * a.g), a.feetY, 3, 1, C_CHALK); P(a.haunch.cx - Math.round(6 * a.g), a.feetY, 3, 1, C_CHALK); }
}
if (v >= 3) for (const p of spotsOn(a, S.seed, 'crust', 4, true)) { P(p.x, p.y, 2, 2, C_CHALK); P(p.x, p.y + 2, 2, 1, C_CRUST); }
}
function frostMarks(S) {
const { P, a } = S, v = S.dead ? 0 : S.L.frost, parts = a.parts;
if (!v) return;
const [x0, x1] = xRange(parts);
for (let x = x0; x <= x1; x++) {
if (v === 1 && (x & 1)) continue;
const y = colEdge(parts, x, -1);
if (y !== null) P(x, y, 1, 1, C_RIME);
}
if (v < 2) return;
const icicle = (x, len) => { const y = colEdge(parts, x, 1); if (y !== null) { P(x, y + 1, 1, len, C_ICE); P(x, y + 1, 1, 1, C_RIME); } };
icicle(a.nose.x - 1, 2); icicle(a.nose.x - 2, 3); icicle(a.chest.cx + 1, 2);
if (v < 3) return;
icicle(a.chest.cx + 3, 2); icicle(a.nose.x - 3, 2);
for (let i = 0; i < 3; i++) {
const x = a.back.x0 + 3 + Math.round((i * (a.back.x1 - a.back.x0)) / 3), y = colEdge(parts, x, -1);
if (y === null) continue;
P(x, y - 1, 1, 1, C_RIME); P(x - 1, y - 2, 1, 1, C_RIME); P(x - 2, y - 3, 1, 1, '#ffffff');
}
const rows = rowsOf(parts), lim = rows[0][0] + Math.round(rows.length * 0.4);
for (const [y, rx0, rx1] of rows) if (y <= lim) P(rx0, y, rx1 - rx0 + 1, 1, 'rgba(223,244,255,0.3)');
}
function sickMarks(S) {
const { P, a, L } = S;
if (S.dead) return;
if (L.toxicity >= 2) for (const p of spotsOn(a, S.seed, 'blotch', L.toxicity === 3 ? 3 : 2)) { P(p.x, p.y, 2, 1, C_SLIME2); P(p.x, p.y + 1, 1, 1, C_SLIME2); }
if (L.death >= 3) for (let i = 0; i < 3; i++) P(a.chest.cx - 3 + i * 2, a.chest.cy - 1, 1, 2, S.C.dark);
}
function nearLayer(S) {
const { P, a, tr } = S;
for (const e of a.ears) if (!e.far) earArt(S, e, 'near');
hornArt(S, false);
if (tr.has('spines')) {
const body = [a.haunch, a.chest];
for (let i = 0; i < 5; i++) {
const x = a.back.x0 + 1 + Math.round((i * (a.back.x1 - a.back.x0 - 1)) / 4), y = colEdge(body, x, -1);
if (y !== null) stamp(P, SPIKE, x - 1, y - 3 - (i & 1), { k: K, i: C_RIME, I: C_ICE });
}
}
if (tr.has('wings')) wingArt(S, false);
}
function faceLayer(S) {
const { P, a, L, sc, dead, C, C2 } = S, e = a.eye, n = a.nose, big = a.hs >= 0.95;
if (S.pattern === 'points') P(n.x - 2, n.y - 1, 3, 3, C2.body);
if (sc[3] >= 1) P(n.x - 2, n.y - 1, 3, 2, C_GREY);
if (!dead && L.death >= 1) P(e.x - 1, e.y + 1, 3, 1, L.death >= 2 ? PAL.stone2 : C.dark);
if (!dead && L.death >= 2) { P(e.x - 1, e.y - 1, 3, 1, PAL.stone2); P(e.x - 1, e.y + 2, 2, 1, C.dark); }
if (dead) {
P(e.x - 1, e.y, 3, 1, K);
P(e.x - 1, e.y + 1, 1, 1, C.dark); P(e.x + 1, e.y + 1, 1, 1, C.dark);
} else if (a.pose === 'flop') { P(e.x - 1, e.y - 1, 1, 1, K); P(e.x, e.y, 1, 1, K); P(e.x + 1, e.y - 1, 1, 1, K); }
else if (L.love === 3) heart(P, e.x - 1, e.y - 1, C_HEART);
else if (a.pose === 'collapse' || a.pose === 'loaf' || L.toxicity === 3) { P(e.x - 1, e.y - 1, 3, 1, C.dark); P(e.x - 1, e.y, 2, 1, K); }
else if (L.love === 2) { P(e.x - 1, e.y, 1, 1, K); P(e.x, e.y - 1, 1, 1, K); P(e.x + 1, e.y, 1, 1, K); }
else {
const arc = L.arcana >= 2 || sc[4] >= 2;
P(e.x, e.y, big ? 2 : 1, big ? 2 : 1, arc ? C_RUNE_HI : S.eyeCol === 'ruby' ? C_RUBY : K);
if (big) P(e.x, e.y, 1, 1, arc ? '#ffffff' : C_CREAM);
if (arc) P(e.x - 1, e.y, 1, 1, C_RUNE);
else if (L.arcana === 1) P(e.x, e.y - 1, 1, 1, C_RUNE);
}
P(n.x, n.y, 1, 1, dead ? '#b07890' : C_NOSE);
if (dead) { if (S.tr.has('eye3')) P(a.eye3.x, a.eye3.y, 2, 1, K); return; }
if (L.vitality >= 2) P(n.x - 1, n.y, 1, 1, '#ff8fb8');
if (L.love >= 1) P(a.cheek.x, a.cheek.y, L.love === 3 ? 3 : 2, 1, C_BLUSH);
if (L.toxicity === 3) { P(n.x - 1, n.y + 1, 1, 1, C_BLUSH); P(n.x, n.y + 1, 1, 2, C_SLIME); }
if (L.alkali === 3) { P(n.x + 1, n.y - 1, 2, 1, C_CREAM); P(n.x + 1, n.y + 1, 2, 1, C_CREAM); }
if (S.tr.has('eye3')) { P(a.eye3.x, a.eye3.y, 2, 1, C_RUNE); P(a.eye3.x + 1, a.eye3.y, 1, 1, C_RUNE_HI); }
}
function causeLayer(S) {
const { P, a } = S;
switch (S.cause) {
case 'frost': { // frozen into a block of ice
const rows = rowsOf(a.parts, 2);
for (const [y, x0, x1] of rows) P(x0, y, x1 - x0 + 1, 1, 'rgba(223,244,255,0.35)');
P(rows[0][1], rows[0][0], rows[0][2] - rows[0][1] + 1, 1, C_RIME);
for (const [y, x0] of rows) P(x0, y, 1, 1, C_RIME);
const h = a.haunch;
P(h.cx - 2, h.cy - 2, 1, 1, '#ffffff'); P(h.cx - 1, h.cy - 1, 2, 1, '#ffffff'); P(a.chest.cx, a.chest.cy - 1, 1, 2, '#ffffff');
break;
}
case 'fire':
for (const p of spotsOn(a, S.seed, 'char', 3, true)) { P(p.x, p.y, 2, 1, '#c2410f'); P(p.x, p.y, 1, 1, '#ff7a1c'); }
break;
case 'poison':
P(a.nose.x - 1, a.nose.y + 1, 1, 1, C_BLUSH);
P(a.nose.x - 3, a.feetY + 1, 5, 1, 'rgba(146,204,113,0.7)');
break;
case 'acid':
for (const p of spotsOn(a, S.seed, 'acid-death', 3)) { P(p.x - 1, p.y - 1, 3, 3, C_BURN_RIM); P(p.x, p.y, 1, 1, C_RUBY); }
P(a.cx - 3, a.feetY + 1, 6, 1, 'rgba(216,232,106,0.6)');
break;
case 'alkali':
for (const p of spotsOn(a, S.seed, 'crust-death', 4, true)) { P(p.x, p.y, 2, 2, C_CHALK); P(p.x, p.y + 2, 2, 1, C_CRUST); }
break;
case 'change': { // crystals grown out of the back
const body = [a.haunch, a.chest];
for (let i = 0; i < 3; i++) {
const x = a.back.x0 + 2 + Math.round((i * (a.back.x1 - a.back.x0)) / 3), y = colEdge(body, x, -1);
if (y !== null) stamp(P, CRYSTAL, x - 1, y - 3, { k: K, i: C_RIME, t: C_SHIM, T: '#2f8a78' });
}
break;
}
case 'arcana':
stamp(P, RUNES[S.seed & 3], a.haunch.cx - 1, a.haunch.cy - 1, { x: C_RUNE_HI });
stamp(P, RUNES[(S.seed + 1) & 3], a.chest.cx - 1, a.chest.cy - 1, { x: C_RUNE_HI });
break;
case 'death':
for (const [y, x0, x1] of rowsOf(a.parts)) P(x0, y, x1 - x0 + 1, 1, 'rgba(180,145,238,0.18)');
break;
default: // age, frailty, unknown: nothing more to see
}
}
function drawFx(P, look, snap, a, t, react, acted, low) {
const L = rabbitLevels(snap);
const seed = (look.seed >>> 0) % 997, tt = t + seed * 0.37;
if (!snap.alive) { deadFx(P, a, snap.cause, tt); return; }
const q = low ? 0.5 : 1;
const lv = (ch) => (acted.includes(ch) ? Math.max(1, L[ch]) : L[ch]);
const cnt = (ch, base) => (base > 0 ? Math.max(1, Math.round(base * q * (acted.includes(ch) ? 1 + react : 1))) : 0);
const body = [a.haunch, a.chest, ...a.bulges];
const [bx0, bx1] = xRange(a.parts);
const headTop = a.head.cy - a.head.ry, midY = Math.round((a.haunch.cy + a.head.cy) / 2);
const backTop = (x) => colEdge(body, x, -1) ?? a.back.y;
let v = lv('vitality');
if (v) { // a twinkle running along the back, rising gold pluses, a gleam
const x = a.back.x0 + Math.floor(mod(tt * 9, Math.max(1, a.back.x1 - a.back.x0)));
P(x, backTop(x), 1, 1, C_CREAM);
if (v >= 2) for (let i = 0, n = cnt('vitality', 2); i < n; i++) {
const age = mod(tt + i * 0.7, 1.4);
if (age > 1.2) continue;
const k = Math.floor((tt + i * 0.7) / 1.4);
const px = a.cx - 8 + ((k * 7 + i * 5) & 15), py = headTop + 2 - Math.round((age / 1.2) * 8);
plus(P, px, py, C_GOLD); P(px, py, 1, 1, C_CREAM);
}
if (v >= 3 && Math.sin(tt * 3.1) > 0.3) plus(P, a.chest.cx - 2, a.chest.cy - 2, C_GLEAM);
}
v = lv('strength');
if (v >= 2 && mod(tt, 2.2) < 0.25) { // a flex, kicking up dust at level 3
P(a.chest.cx - 2, a.chest.cy - a.chest.ry, 4, 1, 'rgba(255,240,200,0.75)');
if (v >= 3) for (let i = 0; i < 3; i++) P(a.haunch.cx - 6 + i * 4, a.feetY + (i & 1) - 1, 1, 1, PAL.parch1);
}
v = lv('love');
if (v) for (let i = 0, n = cnt('love', [0, 1, 2, 3][v]); i < n; i++) { // hearts drifting up in front of the ears
const p = mod(tt / 1.6 + i / n, 1);
heart(P, a.head.cx + 2 + ((i * 5) % 7) - 2 + Math.round(Math.sin(tt * 3 + i * 2)), headTop - 3 - Math.round(p * 10), v === 3 && i & 1 ? C_PINK : C_HEART);
}
v = lv('arcana');
if (v) { // twinkling stars, orbiting runes, a ring on the floor and a glowing eye
for (let i = 0, n = cnt('arcana', 2); i < n; i++) {
if (Math.sin(tt * 3 + i * 2.1) < 0) continue;
const sx = a.cx + [-12, 11, -5, 15][i & 3], sy = headTop + [3, -2, -4, 7][i & 3];
plus(P, sx, sy, C_RUNE_HI); P(sx, sy, 1, 1, '#ffffff');
}
if (v >= 2) for (let i = 0, n = cnt('arcana', 3); i < n; i++) {
const ang = tt * 1.2 + i * 2.09;
stamp(P, RUNES[(i + seed) & 3], a.cx - 1 + Math.round(Math.cos(ang) * 14), midY - 1 + Math.round(Math.sin(ang) * 5), { x: Math.sin(ang) > 0 ? C_RUNE_HI : C_RUNE });
}
if (v >= 3) {
for (let i = 0, n = Math.round(6 * q); i < n; i++) { const ang = tt * 1.5 + (i * Math.PI * 2) / n; P(a.cx + Math.round(Math.cos(ang) * 12), a.feetY + 2 + Math.round(Math.sin(ang) * 2), 1, 1, C_RUNE); }
if (Math.sin(tt * 4) > 0) P(a.eye.x, a.eye.y - 1, 1, 1, '#ffffff');
}
}
v = lv('transformation');
if (v) { // a teal shimmer sweeping the coat, motes spiralling in, a glitch
const p = mod(tt, 3);
if (p < 0.9) {
const rows = rowsOf(a.parts), y0 = rows[0][0], sx = bx0 - 6 + Math.round((p / 0.9) * (bx1 - bx0 + 12));
for (let i = 0; i < rows.length; i += 2) {
const [y, x0, x1] = rows[i], x = sx - ((y - y0) >> 1);
if (x >= x0 && x <= x1 - 1) P(x, y, 2, 1, 'rgba(95,212,180,0.55)');
}
}
if (v >= 2) for (let i = 0, n = cnt('transformation', 4); i < n; i++) {
const r = 14 - mod(tt * 6 + i * 3, 12), ang = tt * 3 + i * (Math.PI / 2);
P(a.cx + Math.round(Math.cos(ang) * r), midY + Math.round(Math.sin(ang) * r * 0.5), 1, 1, C_SHIM);
}
if (v >= 3 && mod(tt, 2.5) < 0.12) for (let i = 0; i < 3; i++) P(bx0 + ((seed + i * 11) % Math.max(1, bx1 - bx0 - 4)), headTop + 4 + i * 4, 5, 1, C_SHIM);
}
v = lv('fire');
if (v) { // smoulder (1), flames along the back (2), more flames, sparks and burning ear tips (3)
if (v === 1 && Math.sin(tt * 5) > -0.2) P(a.back.x0 + 4, backTop(a.back.x0 + 4) + 1, 1, 1, '#ffb444');
const nf = cnt('fire', [0, 0, 3, 6][v]), span = a.back.x1 + 2 - a.back.x0;
for (let i = 0; i < nf; i++) {
const x = a.back.x0 + Math.round(((i + 0.5) * span) / nf), y = backTop(x);
const h = 2 + (((tt * 10 + i * 3) | 0) % 3) + (v === 3 ? 1 : 0);
P(x, y - h, 1, h, '#ff7a1c'); P(x, y - 2, 1, 2, '#ffb444');
if (v === 3 && i & 1) P(x, y - 1, 1, 1, PAL.fire5);
}
for (let i = 0, n = cnt('fire', 1); i < n; i++) {
const age = mod(tt * 0.8 + i * 0.5, 1);
P(a.back.x0 + 3 + i * 6 + Math.round(Math.sin(tt * 2 + i) * 1.5), a.back.y - 2 - Math.round(age * 10), 1, 1, '#8a8296');
}
if (v === 3) {
for (let i = 0, n = cnt('fire', 2); i < n; i++) P(a.back.x0 + 5 + ((i * 9 + seed) % 14) + Math.round(Math.sin(tt * 6 + i)), a.back.y - 3 - Math.round(mod(tt * 1.7 + i * 0.5, 1) * 14), 1, 1, '#ffd75a');
const e = a.ears[a.ears.length - 1];
if (e && e.kind === 'up') { const tx = e.x + 1 - Math.floor((e.len - 1) / e.lean), ty = e.y - e.len; P(tx, ty - 1 - (((tt * 8) | 0) & 1), 1, 2, '#ff7a1c'); }
}
}
v = lv('frost');
if (v) { // breath puffs (1-2), falling snow (2), frozen still with glints on the ice (3)
if (v < 3 && mod(tt, 1.6) < 0.45) P(a.nose.x + 1 + Math.round(mod(tt, 1.6) * 6), a.nose.y - 1, 2, 1, 'rgba(223,244,255,0.8)');
if (v >= 2) for (let i = 0, n = cnt('frost', v === 3 ? 5 : 2); i < n; i++) {
P(bx0 - 2 + ((i * 13 + seed) % (bx1 - bx0 + 4)) + Math.round(Math.sin(tt * 1.3 + i) * 1.5), 2 + Math.round(mod(tt * 5 + i * 9, 32)), 1, 1, C_RIME);
}
if (v === 3) for (let i = 0; i < 2; i++) if (Math.sin(tt * 5 + i * 2.5) > 0.6) { const x = a.back.x0 + 2 + i * 7; P(x, backTop(x) + 1, 1, 1, '#ffffff'); }
}
v = lv('acid');
if (v) { // a droplet on a raw spot and steam rising from them
const pts = acidSpots(look.seed >>> 0 || 1, a);
if (Math.sin(tt * 4) > 0) P(pts[0].x, pts[0].y + 1, 1, 1, C_ACID);
for (let i = 0, n = cnt('acid', v); i < n; i++) {
const p = pts[i % pts.length];
P(p.x + Math.round(Math.sin(tt * 3 + i)), p.y - 2 - Math.round(mod(tt * 0.9 + i * 0.37, 1) * 7), 1, 1, 'rgba(230,240,220,0.7)');
}
}
v = lv('alkali');
if (v) { // chalk dust drifting down, a sneeze at level 3
for (let i = 0, n = cnt('alkali', v === 1 ? 1 : 2); i < n; i++) {
const x = bx0 + 2 + ((i * 11 + seed) % Math.max(1, bx1 - bx0 - 4));
P(x, backTop(x) + Math.round(mod(tt * 4 + i * 5, 12)), 1, 1, C_CHALK);
}
if (v === 3 && mod(tt, 4) > 3.8) P(a.nose.x + 1, a.nose.y - 1, 3, 2, C_CREAM);
}
v = lv('toxicity');
if (v) { // bubbles off the back, then a drool drip and a purple bubble
for (let i = 0, n = cnt('toxicity', v); i < n; i++) {
const p = mod(tt / 2 + i / n, 1);
P(a.back.x0 + 3 + i * 4 + Math.round(Math.sin(tt * 2 + i)), a.back.y - 2 - Math.round(p * 8), 2, 2, v === 3 && i === 2 ? '#a678ff' : C_SLIME);
}
if (v === 3) P(a.nose.x - 1, a.nose.y + 3 + Math.round(mod(tt / 1.5, 1) * Math.max(0, a.feetY - a.nose.y - 3)), 1, 1, C_DRIP);
}
v = lv('death');
if (v) for (let i = 0, n = cnt('death', [0, 1, 1, 3][v]); i < n; i++) { // slow violet-grey wisps
if (v === 2 && i === 0 && mod(tt, 4) > 2.6) continue;
const x = bx0 + 4 + ((i * 9 + seed) % Math.max(1, bx1 - bx0 - 8)) + Math.round(Math.sin(tt * 1.4 + i * 2) * 2);
const y = a.back.y - 1 - Math.round(mod(tt * 0.35 + i * 0.33, 1) * 12), c = v === 1 ? 'rgba(180,145,238,0.35)' : 'rgba(180,145,238,0.6)';
P(x, y, 1, 2, c); P(x + (Math.sin(tt * 2 + i) > 0 ? 1 : -1), y - 1, 1, 1, c);
}
}
function deadFx(P, a, cause, t) {
if (cause === 'fire') {
const x = a.cx - 2 + Math.round(Math.sin(t * 1.1) * 2), y = a.back.y - 2 - Math.round(mod(t * 0.3, 1) * 12);
P(x, y, 1, 2, 'rgba(138,130,150,0.7)'); P(x + 1, y - 2, 1, 1, 'rgba(138,130,150,0.45)');
} else if (cause === 'frost') {
if (Math.sin(t * 2.3) > 0.7) P(a.haunch.cx - 3, a.haunch.cy - a.haunch.ry - 2, 1, 1, '#ffffff');
if (Math.sin(t * 1.7 + 2) > 0.7) P(a.head.cx, a.head.cy - a.head.ry - 2, 1, 1, '#ffffff');
} else if (cause === 'poison') {
for (let i = 0; i < 2; i++) {
const x = a.cx + Math.round(Math.cos(t * 6.3 + i * 2.8) * 7), y = a.back.y - 4 + Math.round(Math.sin(t * 9.1 + i * 1.3) * 2);
P(x, y, 1, 1, K); P(x, y - 1, 1, 1, 'rgba(255,255,255,0.6)');
}
}
}
function motion(look, snap, a, t, react, hop) {
const shake = react > 0 ? Math.round(Math.sin(t * 40) * react * 1.5) : 0;
const L = rabbitLevels(snap);
if (a.lying || L.frost === 3) return { dx: shake, dy: 0 };
const seed = (look.seed >>> 0) || 1, ts = t * rabbitPace(snap);
const slumped = a.pose === 'sick' || a.pose === 'loaf';
let dx = 0, dy = 0;
if (hop && a.pose === 'idle') {
const per = (4 + (seed % 300) / 100) * (snap.stage === 'kit' ? 0.6 : 1), ph = mod(ts + (seed % 7), per);
if (ph < 0.4) dy = -Math.round(Math.min(4, Math.max(1, a.top)) * Math.sin((Math.PI * ph) / 0.4));
}
if (dy === 0) dy = Math.round(Math.sin(ts * 2.2 + (seed % 11)) * (slumped ? 0.5 : L.vitality === 3 ? 1.5 : 0.8));
if (L.frost) { const per = L.frost === 2 ? 1.3 : 2.6; if (mod(t, per) < (L.frost === 2 ? 0.35 : 0.2)) dx += Math.sin(t * 88) > 0 ? 1 : -1; }
if (L.toxicity >= 2) dx += Math.round(Math.sin(t * 1.6));
if (L.acid === 3 && mod(t, 3.1) < 0.1) dx -= 1;
if (L.alkali === 3 && mod(t, 4) > 3.8) dx -= 1;
if (L.transformation === 3 && mod(t, 2.5) < 0.12) dx += 1;
if (L.love === 3) dx += Math.round(Math.sin(t * 0.9) * 0.6);
if (L.arcana === 3) dy -= 2 + (Math.sin(t * 1.5) > 0 ? 1 : 0);
return { dx: dx + shake, dy };
}
const SPRITES = new Map();
const SPRITE_MAX = 64;
function rabbitSpriteKey(look, snap, want) {
const c = (v) => (Array.isArray(v) ? v.map((x) => Math.round(x * 255)).join(',') : '');
const s = snap || {};
const lv = Array.isArray(s.lv) ? s.lv.join('') : '', sc = Array.isArray(s.sc) ? s.sc.join('') : '';
const tr = Array.isArray(s.traits) ? s.traits.join(',') : '';
return `${c(look.coat)}|${c(look.coat2)}|${look.pattern}|${look.ear}|${look.size}|${look.eye}|${look.tail}|${look.seed}|${s.stage}${s.hp}${s.alive === false ? 0 : 1}${s.preg ? 1 : 0}|${lv}|${sc}|${tr}|${s.cause || ''}|${rabbitPose(snap, want)}`;
}
function drawRabbitSprite(look, snap, factory = makeCanvas, opts = {}) {
const cv = factory(RABBIT_W, RABBIT_H);
const ctx = cv.getContext('2d');
drawBody(pen(ctx, 0, 0, 0, 0, false), look, snap, rabbitAnchors(look, snap, opts.pose), opts.quality === 'low');
return cv;
}
function clearRabbitSprites() {
SPRITES.clear();
}
function spriteFor(look, snap, pose, low, factory) {
const key = rabbitSpriteKey(look, snap, pose) + (low ? '|lo' : '');
let cv = SPRITES.get(key);
if (cv) { SPRITES.delete(key); SPRITES.set(key, cv); return cv; }
cv = drawRabbitSprite(look, snap, factory, { pose, quality: low ? 'low' : 'high' });
SPRITES.set(key, cv);
if (SPRITES.size > SPRITE_MAX) SPRITES.delete(SPRITES.keys().next().value);
return cv;
}
function drawFloor(ctx, fx, fy) {
ctx.fillStyle = '#8b5a31';
ctx.fillRect(fx + 4, fy + 35, 40, 3);
ctx.fillStyle = '#c2a678';
for (let x = 5; x < 44; x += 3) ctx.fillRect(fx + x, fy + 34, 2, 1);
}
function drawRabbit(ctx, look, snap, t, react = 0, opts = {}) {
const fx = Math.round(opts.x || 0), fy = Math.round(opts.y || 0);
if (opts.clear !== false) ctx.clearRect(fx, fy, RABBIT_W, RABBIT_H);
if (opts.floor !== false) drawFloor(ctx, fx, fy);
if (!look || !snap) return;
const low = opts.quality === 'low', mirror = !!opts.mirror, clip = opts.clip !== false;
const a = rabbitAnchors(look, snap, opts.pose);
const rx = clamp(Number(react) || 0, 0, 1);
const acted = rx > 0 && Array.isArray(opts.react) ? opts.react : [];
const time = Number(t) || 0;
const m = motion(look, snap, a, time, rx, opts.hop !== false);
const dy = m.dy - Math.round(opts.lift || 0);
const shadowP = pen(ctx, fx, fy, m.dx, 0, mirror, clip);
const sx0 = a.haunch.cx - a.haunch.rx + 1, sx1 = Math.max(a.chest.cx + a.chest.rx, a.lying ? a.head.cx + a.head.rx : 0);
shadowP(sx0, a.feetY + 1, sx1 - sx0, 1, 'rgba(0,0,0,0.18)');
shadowP(sx0 + 2, a.feetY + 2, sx1 - sx0 - 4, 1, 'rgba(0,0,0,0.12)');
const factory = opts.factory || (typeof document !== 'undefined' ? makeCanvas : null);
if (opts.cache !== false && factory) {
const sprite = spriteFor(look, snap, a.pose, low, factory);
if (mirror) {
ctx.save();
ctx.translate(fx + RABBIT_W - m.dx, fy + dy);
ctx.scale(-1, 1);
ctx.drawImage(sprite, 0, 0);
ctx.restore();
} else ctx.drawImage(sprite, fx + m.dx, fy + dy);
} else drawBody(pen(ctx, fx, fy, m.dx, dy, mirror, clip), look, snap, a, low);
drawFx(pen(ctx, fx, fy, m.dx, dy, mirror, clip), look, snap, a, time, rx, acted, low);
if (rx > 0 && opts.flash !== false) {
ctx.fillStyle = `rgba(255,255,255,${(rx * 0.35).toFixed(3)})`;
ctx.fillRect(fx, fy, RABBIT_W, RABBIT_H);
}
}
return { RABBIT_W, RABBIT_H, rabbitLevels, rabbitPose, rabbitPace, rabbitAnchors, rabbitSpriteKey, drawRabbitSprite, clearRabbitSprites, drawRabbit };
})();
// src/rendering/hutch-scene.js
const __m80 = (() => {
const { Rng, hashString } = __m6;
const { PAL, makeCanvas } = __m54;
const { drawRabbit, rabbitAnchors, rabbitLevels, rabbitPace, RABBIT_W } = __m78;
const HUTCH_W = 224;
const HUTCH_H = 88;
const HUTCH_BODIES = 3;
const FLOOR_Y = 48;
const ROAM = { x0: 30, x1: 160, y0: 57, y1: 76 };
const RACK = { x: 40, y: 58 };
const SLOTS = [[180, 70], [200, 74], [186, 78]];
const RAIL_Y = 79;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
function R(ctx, x, y, w, h, c) {
ctx.fillStyle = c;
ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
}
const HW = { k: '#1a1218', p0: '#2a170c', p1: '#3a2212', p2: '#4a2c17', p3: '#5a371d', p4: '#6d4626', p5: '#8a5c33', p6: '#a8763f' };
const STRAW = ['#7a5a24', '#9a7630', '#b8923c', '#d2ae52', '#e8cc74', '#f6e2a0'];
function post(ctx, x, y, w, h) {
R(ctx, x - 1, y - 1, w + 2, h + 1, HW.k);
R(ctx, x, y, w, h, HW.p4);
R(ctx, x, y, 1, h, HW.p6);
R(ctx, x + w - 1, y, 1, h, HW.p2);
R(ctx, x - 1, y - 2, w + 2, 2, HW.p5); R(ctx, x - 1, y - 2, w + 2, 1, HW.p6);
for (let yy = y + 3; yy < y + h - 1; yy += 4) R(ctx, x + 1 + (yy % 3), yy, 1, 2, HW.p3);
}
function paintHutch(ctx, o = {}) {
const W = HUTCH_W, H = HUTCH_H, rng = new Rng('hutch-bg-2');
for (let y = 0, i = 0; y < FLOOR_Y; y += 8, i++) {
const tone = [HW.p2, HW.p3, HW.p2, HW.p1, HW.p3, HW.p2][i % 6];
R(ctx, 0, y, W, 8, tone);
R(ctx, 0, y, W, 1, i % 2 ? HW.p4 : HW.p3);
R(ctx, 0, y + 7, W, 1, HW.p0);
for (let k = 0; k < 16; k++) R(ctx, rng.int(0, W - 10), y + rng.int(2, 6), rng.int(6, 22), 1, rng.chance(0.5) ? HW.p1 : HW.p4);
for (let k = 0; k < 2; k++) { const kx = rng.int(8, W - 8), ky = y + rng.int(3, 5); R(ctx, kx - 1, ky, 3, 1, HW.p1); R(ctx, kx, ky - 1, 1, 3, HW.p1); R(ctx, kx, ky, 1, 1, HW.p0); }
for (let x = (i % 2) * 31 + rng.int(10, 30); x < W; x += rng.int(52, 84)) {
R(ctx, x, y + 1, 1, 6, HW.p0); R(ctx, x + 1, y + 1, 1, 6, HW.p4);
R(ctx, x - 3, y + 3, 1, 1, '#8a8296'); R(ctx, x + 3, y + 3, 1, 1, '#8a8296');
}
}
for (let y = 0; y < FLOOR_Y; y++) {
const a = y < 16 ? 0.32 * (1 - y / 16) : 0;
if (a > 0.01) R(ctx, 0, y, W, 1, `rgba(10,6,4,${a.toFixed(3)})`);
if (y > 34) R(ctx, 0, y, W, 1, `rgba(255,190,90,${(0.05 * (y - 34) / 14).toFixed(3)})`);
}
post(ctx, 0, 0, 5, FLOOR_Y);
post(ctx, W - 5, 0, 5, FLOOR_Y);
R(ctx, 0, 0, W, 4, HW.p1); R(ctx, 0, 3, W, 1, HW.p0); R(ctx, 0, 0, W, 1, HW.p3);
for (let y = FLOOR_Y; y < H; y++) R(ctx, 0, y, W, 1, y < FLOOR_Y + 3 ? STRAW[0] : STRAW[1 + ((y >> 2) % 2)]);
for (let k = 0; k < 900; k++) {
const x = rng.int(-2, W), y = rng.int(FLOOR_Y + 2, H - 1), len = rng.int(2, 5);
const c = STRAW[rng.weighted([0, 1, 2, 3, 4, 5], [1.2, 1.6, 2, 2, 1.4, 0.6])];
const dir = rng.pick([-1, 1, 0]);
for (let j = 0; j < len; j++) R(ctx, x + j, y + (dir ? Math.round(j * dir * 0.5) : 0), 1, 1, c);
}
R(ctx, 0, FLOOR_Y, W, 1, HW.p0);
R(ctx, 0, FLOOR_Y + 1, W, 2, 'rgba(20,10,0,0.35)');
R(ctx, 0, FLOOR_Y + 3, W, 2, 'rgba(20,10,0,0.15)');
const rx = 8, ry = 8, rw = 26, rh = 38;
for (let k = 0; k < 140; k++) R(ctx, rng.int(rx + 2, rx + rw - 3), rng.int(ry + 2, ry + rh - 4), rng.int(1, 4), 1, rng.pick([STRAW[2], STRAW[3], STRAW[4], STRAW[5], '#a89a40']));
for (let x = rx + 3; x < rx + rw - 2; x += 5) { R(ctx, x, ry + 2, 1, rh - 4, HW.p1); R(ctx, x + 1, ry + 2, 1, rh - 4, HW.p5); }
for (let y = ry + 6; y < ry + rh - 3; y += 7) { R(ctx, rx + 2, y, rw - 4, 1, HW.p1); R(ctx, rx + 2, y - 1, rw - 4, 1, HW.p5); }
post(ctx, rx, ry, 3, rh); post(ctx, rx + rw - 3, ry, 3, rh);
R(ctx, rx - 1, ry, rw + 2, 3, HW.k); R(ctx, rx, ry, rw, 2, HW.p5); R(ctx, rx, ry, rw, 1, HW.p6);
for (let k = 0; k < 26; k++) { const x = rng.int(rx + 1, rx + rw - 2); R(ctx, x, ry - rng.int(1, 4), 1, rng.int(2, 4), rng.pick([STRAW[3], STRAW[4], STRAW[5]])); }
for (let k = 0; k < 40; k++) R(ctx, rng.int(rx - 4, rx + rw + 8), rng.int(FLOOR_Y + 1, FLOOR_Y + 9), rng.int(2, 5), 1, rng.pick([STRAW[3], STRAW[4], STRAW[5]]));
const bx = 176, by = 22, bw = 42, bh = 32;
R(ctx, bx - 1, by - 1, bw + 2, bh + 2, HW.k);
for (let y = by, i = 0; y < by + bh; y += 6, i++) {
R(ctx, bx, y, bw, 6, i % 2 ? HW.p4 : HW.p3);
R(ctx, bx, y, bw, 1, HW.p5); R(ctx, bx, y + 5, bw, 1, HW.p1);
for (let k = 0; k < 3; k++) R(ctx, bx + rng.int(1, bw - 8), y + rng.int(2, 4), rng.int(3, 7), 1, HW.p2);
}
R(ctx, bx, by, 2, bh, HW.p6); R(ctx, bx + bw - 2, by, 2, bh, HW.p2);
const dx = bx + 13, dw = 16, dy = by + 10;
for (let y = dy; y < by + bh; y++) {
const t = y - dy, half = t < 6 ? Math.round(Math.sqrt(Math.max(0, 36 - (6 - t) * (6 - t))) * (dw / 12)) : dw / 2;
R(ctx, dx + dw / 2 - half - 1, y, half * 2 + 2, 1, HW.p1);
R(ctx, dx + dw / 2 - half, y, half * 2, 1, y < dy + 3 ? '#140c08' : '#0d0806');
}
if (o.nest) for (let k = 0; k < 22; k++) R(ctx, rng.int(dx, dx + dw - 2), rng.int(by + bh - 6, by + bh - 1), rng.int(2, 3), 1, rng.pick([STRAW[4], STRAW[5], '#f6ead0', '#e6d3a5']));
for (let y = 0; y < 8; y++) {
const w = bw + 8 - y;
R(ctx, bx - 4 + Math.round(y / 2), by - 8 + y, w, 1, STRAW[y < 2 ? 4 : y < 5 ? 3 : 2]);
}
for (let k = 0; k < 60; k++) R(ctx, rng.int(bx - 4, bx + bw + 3), rng.int(by - 9, by - 1), 1, rng.int(1, 3), rng.pick([STRAW[1], STRAW[2], STRAW[5]]));
R(ctx, bx - 4, by - 1, bw + 8, 1, STRAW[0]);
R(ctx, bx, by + bh + 1, bw, 2, 'rgba(20,10,0,0.35)');
bowl(ctx, 86, 70, 9, 3, '#2a3a8a', '#4a6ad0', '#8aa8ff', (x, y) => { for (let k = 0; k < 12; k++) R(ctx, x + rng.int(-6, 6), y + rng.int(-1, 0), 1, 1, rng.pick(['#c8782a', '#e8a040', '#8a4a1a'])); });
bowl(ctx, 58, 64, 7, 2, '#3d3844', '#73697b', '#a8a2b0', (x, y) => { R(ctx, x - 5, y - 1, 11, 2, PAL.frost1); R(ctx, x - 3, y - 1, 3, 1, PAL.frost3); });
if (o.cloth) {
R(ctx, 166, 64, 56, 18, PAL.parch0); R(ctx, 167, 64, 54, 16, PAL.parch1); R(ctx, 167, 64, 54, 1, PAL.parch2);
for (let x = 174; x < 220; x += 9) { R(ctx, x, 66, 1, 5, PAL.parch0); R(ctx, x + 1, 71, 1, 5, PAL.parch0); }
for (let x = 167; x < 221; x += 2) R(ctx, x, 79, 1, 1, PAL.parch2);
}
for (let x = 0; x < 10; x++) { const a = (0.28 * (1 - x / 10)).toFixed(3); R(ctx, x, 0, 1, H, `rgba(8,4,2,${a})`); R(ctx, W - 1 - x, 0, 1, H, `rgba(8,4,2,${a})`); }
}
function bowl(ctx, x, y, rx, ry, dark, mid, hi, fill) {
R(ctx, x - rx - 1, y - ry - 1, rx * 2 + 3, ry * 2 + 5, 'rgba(20,10,0,0.25)');
for (let yy = -ry; yy <= ry; yy++) { const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry)))); R(ctx, x - w - 1, y + yy, w * 2 + 3, 1, HW.k); }
R(ctx, x - rx, y, rx * 2 + 1, 4, HW.k);
R(ctx, x - rx + 1, y, rx * 2 - 1, 3, mid); R(ctx, x - rx + 1, y + 2, rx * 2 - 1, 1, dark); R(ctx, x - rx + 2, y, 2, 2, hi);
for (let yy = -ry + 1; yy < 1; yy++) { const w = Math.round((rx - 1) * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry)))); R(ctx, x - w, y + yy, w * 2 + 1, 1, dark); }
fill(x, y);
}
function paintHutchFront(ctx) {
const W = HUTCH_W, H = HUTCH_H;
R(ctx, 0, RAIL_Y - 1, W, H - RAIL_Y + 1, HW.k);
R(ctx, 0, RAIL_Y, W, H - RAIL_Y, HW.p3);
R(ctx, 0, RAIL_Y, W, 1, HW.p6); R(ctx, 0, RAIL_Y + 1, W, 1, HW.p5);
R(ctx, 0, H - 2, W, 2, HW.p1);
for (let x = 6; x < W; x += 13) R(ctx, x, RAIL_Y + 3 + (x % 3), 7, 1, HW.p2);
for (const x of [2, 56, 112, 168, W - 8]) post(ctx, x, RAIL_Y - 7, 6, H - RAIL_Y + 7);
}
class HutchScene {
constructor(opts = {}) {
this.factory = opts.canvas || null;
this.sprites = opts.sprites !== false;
this.actors = new Map();
this.steps = 0;
this.nest = false;
this.cloth = false;
this.bg = null;
this.bgKey = '';
this.fg = null;
this.clashes = [];
}
sync(entries) {
const seen = new Set();
let bodies = 0, nest = false;
for (const e of Array.isArray(entries) ? entries : []) {
if (!e || e.id == null || !e.look || !e.snap) continue;
const id = String(e.id);
if (seen.has(id)) continue;
seen.add(id);
let a = this.actors.get(id);
if (!a) { a = this._spawn(id, e); this.actors.set(id, a); }
a.look = e.look;
a.snap = e.snap;
a.L = rabbitLevels(e.snap);
a.mother = e.mother != null ? String(e.mother) : Array.isArray(e.parents) && e.parents[0] ? String(e.parents[0]) : null;
const alive = e.snap.alive !== false;
if (!alive) {
const slot = SLOTS[bodies++];
a.hidden = !slot;
if (slot) { a.x = slot[0]; a.y = slot[1]; }
a.act = 'dead'; a.pose = null; a.face = 1; a.hops = 0;
} else {
if (!a.alive) this._place(a);
a.hidden = false;
if (e.snap.preg) nest = true;
}
a.alive = alive;
}
for (const id of [...this.actors.keys()]) if (!seen.has(id)) this.actors.delete(id);
this.nest = nest;
this.cloth = bodies > 0;
}
update(dt) {
const d = Number.isFinite(dt) ? clamp(dt, 0, 0.1) : 0;
this.steps++;
for (const a of this.actors.values()) {
if (a.react > 0) a.react = Math.max(0, a.react - d * 1.25);
if (a.alive) this._tick(a, d);
}
for (const c of this.clashes) c.t += d;
this.clashes = this.clashes.filter((c) => c.t < 0.9);
}
attack(fromId, toId) {
const a = this.actors.get(String(fromId)), v = this.actors.get(String(toId));
if (!v || v.hidden) return;
v.react = 1;
v.reactCh = [];
const b = this._box(v);
this.clashes.push({ x: Math.round((b.x0 + b.x1) / 2), y: Math.round((b.y0 + b.y1) / 2), t: 0 });
if (a && a.alive && !a.hidden && a.act !== 'collapse' && a.act !== 'frozen') {
const side = a.x < v.x ? -1 : 1;
this._hopTo(a, this._roam(v.x + side * 10, v.y), 3, true);
}
}
mate(fromId, toId) {
const a = this.actors.get(String(fromId)), v = this.actors.get(String(toId));
if (!v || v.hidden) return;
const b = this._box(v);
this.clashes.push({ x: Math.round((b.x0 + b.x1) / 2), y: Math.round(b.y0), t: 0, love: true });
if (a && a.alive && !a.hidden && a.act !== 'collapse' && a.act !== 'frozen') {
const side = a.x < v.x ? -1 : 1;
this._hopTo(a, this._roam(v.x + side * 7, v.y), 2, true);
}
}
poke(id, channels = []) {
const a = this.actors.get(String(id));
if (!a || !a.alive || a.act === 'collapse' || a.act === 'frozen') return;
a.react = 1;
a.reactCh = channels.slice();
a.next = null;
this._hopTo(a, { x: a.x + a.face * 2, y: a.y }, 1, false);
}
draw(ctx, t, o = {}) {
const low = !!o.low;
this._background(ctx);
const list = this._visible();
for (const a of list) {
const f = this._frame(a);
drawRabbit(ctx, a.look, a.snap, t + a.phase, a.react, {
x: f.x, y: f.y, lift: f.lift, mirror: f.mirror, pose: a.pose || undefined, react: a.reactCh,
quality: low ? 'low' : 'high', clear: false, floor: false, clip: false, flash: false, hop: false,
cache: this.sprites, factory: this.factory || undefined,
});
}
for (const a of list) {
if (!a.alive || !a.snap.ag) continue;
const f = this._frame(a), hx = f.mirror ? f.x + RABBIT_W - 1 - f.an.head.cx : f.x + f.an.head.cx;
const y = Math.max(2, f.y + f.an.top - f.lift - 3);
const on = Math.floor(t * 6 + a.phase) % 2 === 0;
R(ctx, hx - 4, y, 2, 1, on ? '#ff3a2a' : '#a8241a'); R(ctx, hx + 3, y, 2, 1, on ? '#ff3a2a' : '#a8241a');
R(ctx, hx - 3, y - 1, 1, 1, '#ff3a2a'); R(ctx, hx + 3, y - 1, 1, 1, '#ff3a2a');
}
for (const c of this.clashes) {
if (c.love) {
for (let i = 0; i < 2; i++) {
const hx = c.x - 3 + i * 6, hy = Math.round(c.y - 2 - c.t * 10 - i * 2);
const col = c.t < 0.5 ? '#ff5a8a' : '#c8306a';
R(ctx, hx, hy, 1, 1, col); R(ctx, hx + 2, hy, 1, 1, col); R(ctx, hx - 1 + 1, hy + 1, 3, 1, col); R(ctx, hx + 1, hy + 2, 1, 1, col);
}
continue;
}
const k = c.t < 0.45 ? '#ff3a2a' : '#a8241a';
for (let i = 0; i < 3; i++) for (let j = 0; j < 5; j++) R(ctx, c.x - 4 + i * 3 + j, c.y - 3 + j, 1, 1, j === 2 ? '#fff0e0' : k);
if (c.t < 0.3) for (let i = 0; i < 6; i++) R(ctx, c.x + Math.round(Math.cos(i) * (4 + c.t * 20)), c.y + Math.round(Math.sin(i * 1.7) * (3 + c.t * 10)), 1, 1, '#f6ead0');
}
this._front(ctx);
const hov = o.hover != null ? this.actors.get(String(o.hover)) : null;
if (hov && !hov.hidden) {
const b = this._box(hov), rx = Math.max(6, Math.round((b.x1 - b.x0) / 2) - 3);
for (let i = 0; i < 12; i++) {
const ang = (i * Math.PI) / 6;
R(ctx, Math.round(hov.x + Math.cos(ang) * rx), Math.round(hov.y + 1 + Math.sin(ang) * 2), 1, 1, PAL.brassHi);
}
}
const sel = o.selected != null ? this.actors.get(String(o.selected)) : null;
if (sel && !sel.hidden) {
const f = this._frame(sel), hx = f.mirror ? f.x + RABBIT_W - 1 - f.an.head.cx : f.x + f.an.head.cx;
const y = Math.max(4, f.y + f.an.top - f.lift - 5 + Math.round(Math.sin(t * 4)));
R(ctx, hx - 3, y - 1, 7, 2, '#1a1218'); R(ctx, hx - 2, y + 1, 5, 1, '#1a1218'); R(ctx, hx - 1, y + 2, 3, 1, '#1a1218'); R(ctx, hx, y + 3, 1, 1, '#1a1218');
R(ctx, hx - 2, y, 5, 1, PAL.brass); R(ctx, hx - 1, y + 1, 3, 1, PAL.brass); R(ctx, hx, y + 2, 1, 1, PAL.brass); R(ctx, hx - 2, y, 2, 1, PAL.brassHi);
}
}
hit(x, y) {
const list = this._visible();
for (let i = list.length - 1; i >= 0; i--) {
const b = this._box(list[i]);
if (x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1) return list[i].id;
}
return null;
}
boxOf(id) {
const a = this.actors.get(String(id));
return a && !a.hidden ? this._box(a) : null;
}
where(id) {
const a = this.actors.get(String(id));
return a ? { x: Math.round(a.x), y: Math.round(a.y), face: a.face, act: a.act, hidden: a.hidden } : null;
}
_spawn(id, e) {
const r = new Rng(hashString(`hutch:${id}:${e.look.seed}`));
const a = {
id, look: e.look, snap: e.snap, L: rabbitLevels(e.snap), mother: null, alive: e.snap.alive !== false, hidden: false,
x: 0, y: 0, face: r.chance(0.5) ? 1 : -1, act: 'idle', at: 0, dur: r.range(0.3, 2), pose: null,
hops: 0, hopT: 0.34, hopH: 4, step: 8, sx: 0, sy: 0, tx: 0, ty: 0, gx: 0, gy: 0, next: null,
n: 0, phase: r.range(0, 10), react: 0, reactCh: [], anSnap: null, anPose: null, an: null,
};
a.x = r.int(ROAM.x0, ROAM.x1);
a.y = r.int(ROAM.y0, ROAM.y1);
return a;
}
_place(a) {
const r = new Rng(hashString(`hutch:place:${a.id}:${a.n++}`));
a.x = r.int(ROAM.x0, ROAM.x1); a.y = r.int(ROAM.y0, ROAM.y1);
a.act = 'idle'; a.at = 0; a.dur = 1; a.pose = null; a.hops = 0;
}
_tick(a, dt) {
const L = a.L, snap = a.snap;
if (L.death === 3 || snap.hp >= 3) { a.act = 'collapse'; a.pose = null; return; } // too weak to move
if (L.frost === 3) { a.act = 'frozen'; a.pose = null; return; } // frozen stiff
if (a.act === 'collapse' || a.act === 'frozen') this._begin(a, 'idle', 0.5);
a.at += dt * rabbitPace(snap);
if (a.act === 'hop' || a.act === 'zoom') {
const p = Math.min(1, a.at / a.hopT);
a.x = a.sx + (a.tx - a.sx) * p;
a.y = a.sy + (a.ty - a.sy) * p;
if (p < 1) return;
if (--a.hops > 0 && this._nextHop(a)) return;
if (a.next === 'eat') { a.next = null; this._begin(a, 'eat', 2.6); } else this._decide(a);
return;
}
if (a.act === 'float') {
const dx = a.gx - a.x, dy = a.gy - a.y, d = Math.hypot(dx, dy), s = Math.min(d, 6 * dt);
if (d > 0.5) { a.x += (dx / d) * s; a.y += (dy / d) * s; if (Math.abs(dx) > 1) a.face = dx > 0 ? 1 : -1; }
}
if (a.at >= a.dur) this._decide(a);
}
_decide(a) {
const r = new Rng(hashString(`${a.id}:${a.look.seed}:${a.n++}`));
const L = a.L, kit = a.snap.stage === 'kit';
const sick = L.toxicity >= 2 || a.snap.hp >= 2;
a.next = null;
if (a.snap.ag && r.chance(0.6)) {
const others = [...this.actors.values()].filter((o) => o !== a && o.alive && !o.hidden);
if (others.length) { const o = r.pick(others); return this._hopTo(a, this._roam(o.x - 9 * Math.sign(o.x - a.x || 1), o.y), 3, true); }
}
if (sick && r.chance(0.8)) return this._begin(a, 'loaf', r.range(3, 6));
if (L.arcana === 3 && r.chance(0.45)) {
const g = this._goal(a, r, 26);
a.gx = g.x; a.gy = g.y;
return this._begin(a, 'float', r.range(2.5, 4));
}
if ((L.fire === 3 || L.vitality === 3) && r.chance(0.4)) return this._hopTo(a, this._goal(a, r, 60), 4, true);
if (L.strength >= 2 && r.chance(0.3)) return this._begin(a, 'flex', r.range(1.2, 2));
if ((L.love >= 2 || L.vitality >= 2) && a.snap.hp === 0 && r.chance(0.25)) return this._begin(a, 'flop', r.range(2.5, 4.5));
const pick = r.weighted(['idle', 'hop', 'groom', 'eat', 'sniff'], [3, 3, 1.5, 1.2, 1.5]);
if (pick === 'hop') return this._hopTo(a, this._goal(a, r, 30), kit ? 2 : r.int(1, 3), false);
if (pick === 'eat') {
const dx = RACK.x - a.x, dy = RACK.y - a.y;
if (Math.hypot(dx, dy) <= 4) return this._begin(a, 'eat', r.range(2, 3.5));
a.next = 'eat';
return this._hopTo(a, { x: RACK.x + r.int(-3, 3), y: RACK.y + r.int(0, 3) }, 16, false);
}
const dur = pick === 'idle' ? r.range(1.2, 3.5) * (kit ? 0.6 : 1) : pick === 'groom' ? r.range(1.5, 2.5) : r.range(0.8, 1.4);
return this._begin(a, pick, dur);
}
_begin(a, act, dur) {
a.act = act; a.at = 0; a.dur = dur; a.hops = 0;
a.pose = act === 'loaf' ? 'loaf' : act === 'flex' ? 'rear' : act === 'flop' ? 'flop' : null;
if (act === 'eat') a.face = -1;
}
_goal(a, r, range) {
const mom = a.snap.stage === 'kit' && a.mother ? this.actors.get(a.mother) : null;
if (mom && mom.alive && !mom.hidden) return this._roam(mom.x - mom.face * 9 + r.int(-3, 3), mom.y + r.int(0, 3));
if (a.L.love >= 2 && r.chance(0.5)) {
let best = null, bd = Infinity;
for (const o of this.actors.values()) {
if (o === a || !o.alive || o.hidden) continue;
const d = Math.hypot(o.x - a.x, o.y - a.y);
if (d < bd) { bd = d; best = o; }
}
if (best) return this._roam(best.x - 9 * Math.sign(best.x - a.x || 1), best.y + r.int(-2, 2));
}
return this._roam(a.x + r.range(-range, range), a.y + r.range(-range / 3, range / 3));
}
_roam(x, y) {
return { x: clamp(x, ROAM.x0, ROAM.x1), y: clamp(y, ROAM.y0, ROAM.y1) };
}
_hopTo(a, goal, n, zoom) {
const kit = a.snap.stage === 'kit';
a.act = zoom ? 'zoom' : 'hop'; a.pose = null;
a.gx = goal.x; a.gy = goal.y; a.hops = n;
a.hopT = zoom ? 0.17 : 0.34; a.hopH = kit ? 2 : zoom ? 5 : 4;
a.step = (kit ? 5 : 8) * (zoom ? 1.7 : 1);
if (!this._nextHop(a)) this._begin(a, 'idle', 0.6);
}
_nextHop(a) {
const dx = a.gx - a.x, dy = a.gy - a.y, d = Math.hypot(dx, dy);
if (d < 0.5 && a.hops <= 0) return false;
const len = Math.min(a.step, d);
a.sx = a.x; a.sy = a.y;
a.tx = d > 0 ? a.x + (dx / d) * len : a.x;
a.ty = d > 0 ? a.y + (dy / d) * len : a.y;
if (Math.abs(dx) > 0.5) a.face = dx > 0 ? 1 : -1;
a.at = 0;
if (d < 0.5) a.hops = 1; // a hop on the spot (a poke), then stop
return true;
}
_anchors(a) {
if (a.an && a.anSnap === a.snap && a.anPose === a.pose) return a.an;
a.an = rabbitAnchors(a.look, a.snap, a.pose || undefined);
a.anSnap = a.snap; a.anPose = a.pose;
return a.an;
}
_frame(a) {
const an = this._anchors(a), mirror = a.face < 0;
let lift = 0, nx = 0, ny = 0;
if (a.act === 'hop' || a.act === 'zoom') lift = Math.round(a.hopH * Math.sin(Math.PI * Math.min(1, a.at / a.hopT)));
else if (a.act === 'groom') ny = Math.floor(a.at * 5) & 1;
else if (a.act === 'eat') ny = Math.floor(a.at * 4) & 1;
else if (a.act === 'sniff') nx = (Math.floor(a.at * 8) & 1) * a.face;
const x = Math.round(a.x) - (mirror ? RABBIT_W - 1 - an.cx : an.cx) + nx;
const y = Math.round(a.y) - an.feetY + ny;
return { x, y, lift, mirror, an };
}
_box(a) {
const f = this._frame(a), b = f.an.box, pad = a.snap.stage === 'kit' ? 6 : 3;
const x0 = f.mirror ? f.x + RABBIT_W - 1 - b.x1 : f.x + b.x0, x1 = f.mirror ? f.x + RABBIT_W - 1 - b.x0 : f.x + b.x1;
return { x0: x0 - pad, y0: f.y + b.y0 - f.lift - pad, x1: x1 + pad, y1: f.y + b.y1 + pad };
}
_visible() {
return [...this.actors.values()].filter((a) => !a.hidden).sort((p, q) => p.y - q.y || (p.id < q.id ? -1 : p.id > q.id ? 1 : 0));
}
_front(ctx) {
const factory = this.factory || (typeof document !== 'undefined' ? makeCanvas : null);
if (!factory) { paintHutchFront(ctx); return; }
if (!this.fg) { this.fg = factory(HUTCH_W, HUTCH_H); paintHutchFront(this.fg.getContext('2d')); }
ctx.drawImage(this.fg, 0, 0);
}
_background(ctx) {
const o = { nest: this.nest, cloth: this.cloth };
const factory = this.factory || (typeof document !== 'undefined' ? makeCanvas : null);
if (!factory) { paintHutch(ctx, o); return; }
const key = `${o.nest ? 1 : 0}${o.cloth ? 1 : 0}`;
if (!this.bg || this.bgKey !== key) {
this.bg = factory(HUTCH_W, HUTCH_H);
paintHutch(this.bg.getContext('2d'), o);
this.bgKey = key;
}
ctx.drawImage(this.bg, 0, 0);
}
}
return { HUTCH_W, HUTCH_H, HUTCH_BODIES, paintHutch, paintHutchFront, HutchScene };
})();
// src/ui/views/hutch.js
const __m79 = (() => {
const { readingSteadiness } = __m27;
const { h, btn, clear, toast, modal, confirmDialog } = __m2;
const { icon } = __m3;
const { audio } = __m4;
const { drawRabbit, RABBIT_W, RABBIT_H } = __m78;
const { HutchScene, HUTCH_W, HUTCH_H } = __m80;
const { EFFECT_BY_KEY } = __m13;
const { livingRabbits, bodies, rabbitSnap, rabbitCondition, stageOf, findRabbit, colonyDay, maxHealthOf, degenOf, isFeral, RABBIT_MARKS, LETHAL, TRAIT_WORDS, LOVE_MATE, BURNS } = __m28;
const { PURGE_BREW_TIME } = __m5;
const STAGE_WORD = { kit: 'kit', young: 'youngster', adult: 'adult', elder: 'elder' };
const CHANNELS = RABBIT_MARKS.map((k) => {
const e = EFFECT_BY_KEY[k === 'acid' || k === 'alkali' ? 'acidity' : k];
return { key: k, label: k === 'acid' ? 'Acid' : k === 'alkali' ? 'Lye' : e.label, icon: e.icon, color: k === 'alkali' ? [0.78, 0.76, 0.66] : e.color };
});
const rgb = (c) => `rgb(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)})`;
class HutchPanel {
constructor(view) {
this.view = view;
this.lab = view.lab;
this.el = h('div', { class: 'card parch hutch' });
this.scene = new HutchScene();
this.tiles = {};
this.hover = null;
this._acc = 0;
this._live = 0;
this.d = {};
}
get st() {
return this.lab.state;
}
render() {
const lab = this.lab, st = this.st, c = st.colony;
const el = clear(this.el);
const live = livingRabbits(c);
const cap = st.cap.hutch;
const price = lab.sandbox ? 0 : st.rabbitPrice();
const full = live.length >= cap;
const fed = c.fedDay === st.day;
const feral = live.filter((r) => isFeral(r));
el.append(h('div', { class: 'row wrap hutch-head' },
icon('rabbit'), h('b', { text: 'The hutch' }), h('span', { class: 'small muted', text: `${live.length} of ${cap} places` }),
feral.length ? h('span', { class: 'feral-warn small' }, icon('claw', 'sm'), ` ${feral.map((r) => r.name).join(', ')} attacking the others!`) : null));
const manage = [h('div', { class: 'hutch-actions' },
btn(price ? `Buy · ${price}` : 'Buy', () => this.buy(), { icon: 'plus', act: 'colony-buy', disabled: full || (!lab.sandbox && st.coins < price), title: full ? `The hutch is full (${cap} places): more places are sold in the Shop.` : 'Buy an adult rabbit from the breeder' }),
btn(fed ? 'Fed' : lab.sandbox ? 'Feed' : `Feed · ${st.feedCost()}`, () => this.feed(), { icon: 'leaf', act: 'colony-feed', disabled: fed || !live.length, title: 'Hay and greens: they recover faster and pair up more readily tonight' }),
btn(c.breed ? 'Breeding on' : 'Breeding off', () => this.toggleBreed(), { icon: 'nest', cls: c.breed ? 'active' : '', act: 'colony-breed', title: 'Let healthy, unrelated adults pair up overnight' }),
lab.sandbox ? btn('Next day', () => this.nextDay(), { icon: 'clock', act: 'colony-day', title: 'Let a night pass in the hutch' }) : null)];
const brewing = c.still != null;
this.d.still = h('span', { class: 'small muted still-state', text: '' });
manage.push(h('div', { class: 'purge-row' },
icon('purge'), h('b', { class: 'small', text: lab.sandbox ? 'Purges: unlimited' : `Purges: ${c.purges || 0}` }),
h('span', { class: 'spacer' }),
lab.sandbox ? null : btn(`Buy · ${st.purgePrice()}`, () => this.buyPurge(), { icon: 'coin', act: 'purge-buy', disabled: st.coins < st.purgePrice(), title: 'A purging draught from the apothecary: washes every potion effect out of a rabbit and stops degeneration' }),
lab.sandbox ? null : (st.has('still')
? btn(brewing ? 'Brewing…' : 'Brew · 1', () => this.brewPurge(), { icon: 'alembic', act: 'purge-brew', disabled: brewing || st.coins < 1, title: 'Brew a purging draught in your still' })
: h('span', { class: 'small muted', text: 'Brew your own with a Purging Still (Shop)' })),
this.d.still));
this.canvas = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(HUTCH_W), height: String(HUTCH_H), class: 'hutch-scene', role: 'img', 'aria-label': `The hutch: ${live.length} rabbits${bodies(c).length ? ` and ${bodies(c).length} bodies` : ''}. Tap a rabbit to choose it.` }));
this.ctx = /** @type {CanvasRenderingContext2D} */ (this.canvas.getContext('2d'));
this.canvas.addEventListener('pointerdown', (e) => this.tapScene(e));
this.canvas.addEventListener('pointermove', (e) => { this.hover = this.hitAt(e); });
this.canvas.addEventListener('pointerleave', () => { this.hover = null; });
el.append(h('div', { class: 'hutch-scene-wrap' }, this.canvas));
this.syncScene();
const chosen = findRabbit(c, c.focus);
const view = this.view, dose = view.doseMl(), avail = view.available();
el.append(h('div', { class: 'dose-ctl' }, ...view.doseControls()));
if (chosen && chosen.alive) {
el.append(h('div', { class: 'dose-bar' },
view.dropper,
btn(`Give ${dose} ml to ${chosen.name}`, () => view.test('rabbit'), { cls: 'primary', icon: 'dropper', act: 'test-rabbit', disabled: dose <= 0 || avail <= 0, title: `Give ${chosen.name} ${dose} ml from the ${view.source === 'vial' ? 'sealed vial' : 'cauldron tap'}` })));
} else if (chosen) {
el.append(h('div', { class: 'dose-bar' }, h('span', { class: 'small', text: `${chosen.name} is dead: choose a living rabbit to dose.` })));
} else {
el.append(h('div', { class: 'dose-bar' }, h('span', { class: 'small', text: 'Tap a rabbit to choose it.' })));
}
const tiles = h('div', { class: 'rabbit-tiles', role: 'listbox', 'aria-label': 'Rabbits' });
this.tiles = {};
const order = { adult: 0, elder: 1, young: 2, kit: 3 };
const list = c.rabbits.slice().sort((a, b) => (a.alive === b.alive ? 0 : a.alive ? -1 : 1) || order[stageOf(a, st.day)] - order[stageOf(b, st.day)]);
for (const r of list) {
const cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(RABBIT_W), height: String(RABBIT_H), class: 'rabbit-art', 'aria-hidden': 'true' }));
const sel = r.id === c.focus;
const tags = [];
if (!r.alive) tags.push(icon('skull', 'sm'));
else {
if (isFeral(r)) tags.push(icon('claw', 'sm'));
else if (degenOf(r).length) tags.push(icon('skull', 'sm'));
if (r.pregnant) tags.push(icon('nest', 'sm'));
if (r.marks.love >= 8) tags.push(icon('heart', 'sm'));
}
const hp = h('i');
const tile = h('button', {
class: 'rabbit-tile' + (sel ? ' selected' : '') + (r.alive ? '' : ' dead') + (stageOf(r, st.day) === 'kit' ? ' kit' : '') + (isFeral(r) ? ' feral' : degenOf(r).length ? ' degen' : ''),
'data-rabbit': r.id, 'data-subject': 'rabbit', role: 'option', 'aria-selected': sel ? 'true' : 'false',
'aria-label': `${r.name}, ${r.sex === 'f' ? 'doe' : 'buck'}: ${rabbitCondition(r, st.day).join(', ')}`,
}, cv, h('span', { class: 'rt-name', text: r.name }), r.alive ? h('span', { class: 'bar hp rt-hp' }, hp) : null, h('span', { class: 'rt-tags' }, ...tags));
tile.addEventListener('click', () => this.view.select(r.id));
this.tiles[r.id] = { tile, cv, ctx: /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d')), key: '', hp };
tiles.appendChild(tile);
}
if (!c.rabbits.length) tiles.appendChild(h('div', { class: 'small muted', text: 'The hutch is empty. Buy a rabbit to test potions on.' }));
el.append(tiles);
const f = findRabbit(c, c.focus);
this.d = { still: this.d.still };
if (f) el.append(this.detail(f));
el.append(h('div', { class: 'hutch-manage' }, ...manage));
if (c.memorial.length) el.append(h('div', { class: 'small muted memorial', text: `Remembered: ${c.memorial.slice(0, 6).map((m) => m.name).join(', ')}${c.memorial.length > 6 ? '…' : ''}` }));
this.drawTiles(0, true);
this.live();
}
detail(r) {
const lab = this.lab, st = this.st;
const stage = stageOf(r, st.day);
const age = st.day - r.born;
const parents = (r.parents || []).map((id) => (findRabbit(st.colony, id) || st.colony.memorial.find((m) => m.id === id) || { name: '' }).name).filter(Boolean);
const words = rabbitCondition(r, st.day);
const portrait = /** @type {HTMLCanvasElement} */ (h('canvas', { width: String(RABBIT_W), height: String(RABBIT_H), class: 'rd-portrait', 'aria-hidden': 'true' }));
this.d.portrait = /** @type {CanvasRenderingContext2D} */ (portrait.getContext('2d'));
this.d.id = r.id;
const view = this.view;
const actions = [];
if (r.alive) {
actions.push(btn(lab.sandbox ? 'Purge' : `Purge (${st.colony.purges || 0})`, () => this.purge(r), { icon: 'purge', act: 'rabbit-purge', disabled: !lab.sandbox && !(st.colony.purges > 0), title: 'Give a purging draught: every effect washes out, degeneration stops' }));
actions.push(btn('Put down', () => this.cull(r), { icon: 'knife', cls: 'danger', act: 'rabbit-cull', title: 'End its life now (the body stays for remains or burial)' }));
} else {
actions.push(btn('New rabbit', () => view.replace('rabbit'), { icon: 'plus', act: 'replace-rabbit' }));
actions.push(btn('Recover remains', () => this.remains(r), { icon: 'bone', cls: 'gold', act: 'rabbit-remains' }));
actions.push(btn('Bury', () => this.bury(r), { icon: 'trash', cls: 'danger', act: 'rabbit-bury' }));
}
actions.push(btn('History', () => this.history(r), { icon: 'scroll', act: 'rabbit-history', disabled: !r.doses.length }));
const hpFill = h('i'), hpText = h('span', { class: 'small hp-text' });
this.d.hp = hpFill; this.d.hpText = hpText;
const bars = {};
const grid = h('div', { class: 'status-bars', role: 'list', 'aria-label': `Effects active in ${r.name}` });
for (const ch of CHANNELS) {
const fill = h('i', { style: { background: rgb(ch.color) } });
const val = h('span', { class: 'sb-v' });
const burns = BURNS.includes(ch.key) ? ' While any of it is active it burns the rabbit, faster the higher it is.' : '';
const row = h('div', { class: 'sb', role: 'listitem', title: `${ch.label} active in ${r.name}.${burns} Somewhere along this bar — only this rabbit knows where — it starts running out of control.` },
icon(ch.icon, 'sm'), h('span', { class: 'sb-k', text: ch.label }), h('span', { class: 'sb-bar' }, fill), val);
bars[ch.key] = { fill, row, val };
grid.append(row);
}
this.d.bars = bars;
const effects = h('div', { class: 'rd-effects' },
h('div', { class: 'row rd-effects-head' }, h('b', { class: 'small', text: `Active in ${r.name}` }), h('span', { class: 'spacer' }), h('span', { class: 'small muted', text: 'its limits are hidden' })),
grid);
const out = h('div', { class: 'rabbit-detail' + (isFeral(r) ? ' feral' : '') },
h('div', { class: 'rd-top' },
portrait,
h('div', { class: 'rd-info' },
h('div', { class: 'rd-title' }, h('b', { text: r.name }), h('span', { class: 'small muted', text: ` ${r.sex === 'f' ? 'doe' : 'buck'} · ${STAGE_WORD[stage]}${r.alive ? ` · ${age >= 0 ? `${age} day${age === 1 ? '' : 's'} old` : 'grown'}` : ''}` })),
h('div', { class: 'small', text: words.join(' · ') }),
r.alive ? h('div', { class: 'rd-hp' }, icon('heart', 'sm'), h('span', { class: 'bar hp big' }, hpFill), hpText) : null,
h('div', { class: 'small muted', text: `${r.trials} trial${r.trials === 1 ? '' : 's'}${parents.length ? ` · child of ${parents.join(' and ')}` : ''}` }),
r.alive ? (() => { const k = readingSteadiness(r, st.day); return h('div', { class: 'small steadiness ' + (k <= 1.02 ? 'ok' : 'warn'), 'data-steadiness': String(Math.round(k * 100) / 100), title: 'How steady its readings are, from its age and health (its own hidden sensitivity is not in it)', text: k <= 1.02 ? 'Readings: steady' : k <= 1.2 ? 'Readings: a little unsteady' : 'Readings: shaky — hurt or very young or old' }); })() : null)),
r.alive ? effects : null,
h('div', { class: 'row wrap rd-actions' }, ...actions));
return out;
}
live() {
const st = this.st, c = st.colony;
for (const [id, t] of Object.entries(this.tiles)) {
const r = findRabbit(c, id);
if (!r || !r.alive || !t.hp) continue;
const f = r.health / Math.max(1, maxHealthOf(r, st.day));
t.hp.style.width = Math.round(100 * Math.max(0, Math.min(1, f))) + '%';
t.hp.style.background = f > 0.6 ? '#7dc24a' : f > 0.25 ? '#f0b84a' : '#e0402c';
}
if (this.d.still) this.d.still.textContent = c.still != null ? `still: ${Math.ceil(c.still)} s` : '';
const r = this.d.id ? findRabbit(c, this.d.id) : null;
if (!r || !r.alive || !this.d.bars) return;
const max = maxHealthOf(r, st.day), f = r.health / Math.max(1, max);
if (this.d.hp) {
this.d.hp.style.width = Math.round(100 * Math.max(0, Math.min(1, f))) + '%';
this.d.hp.style.background = f > 0.6 ? '#7dc24a' : f > 0.25 ? '#f0b84a' : '#e0402c';
}
if (this.d.hpText) this.d.hpText.textContent = `${Math.max(0, Math.round(r.health))} / ${Math.round(max)}`;
const dg = degenOf(r);
for (const [k, b] of Object.entries(this.d.bars)) {
const v = Math.max(0, Math.min(100, r.marks[k] || 0));
b.fill.style.width = v.toFixed(1) + '%';
b.val.textContent = v < 0.5 ? '—' : `${Math.round(v)}%`;
b.row.classList.toggle('degen', dg.includes(k));
b.row.classList.toggle('lethal', dg.includes(k) && LETHAL.includes(k));
b.row.classList.toggle('mating', k === 'love' && v >= LOVE_MATE);
b.row.classList.toggle('burning', BURNS.includes(k) && v >= 0.5);
b.row.classList.toggle('zero', v < 0.5);
}
}
syncScene() {
const st = this.st;
this.scene.sync(st.colony.rabbits.map((r) => ({ id: r.id, look: r.look, snap: rabbitSnap(r, st.day), mother: r.parents ? r.parents[0] : undefined })));
}
poke(id, channels) {
this.syncScene();
this.scene.poke(id, channels);
}
hitAt(e) {
if (!this.canvas) return null;
const b = this.canvas.getBoundingClientRect();
return this.scene.hit(((e.clientX - b.left) / b.width) * HUTCH_W, ((e.clientY - b.top) / b.height) * HUTCH_H);
}
tapScene(e) {
const id = this.hitAt(e);
if (id) this.view.select(id);
}
buy() {
const lab = this.lab;
const r = this.st.buyRabbit(lab.sandbox);
if (!r.ok) { toast('No new rabbit', r.reason, 'rabbit'); audio.play('error'); return; }
audio.play(r.cost ? 'coin' : 'squeak');
this.after();
}
feed() {
const lab = this.lab;
const r = lab.sandbox ? (this.st.colony.fedDay = this.st.day, { ok: true, cost: 0 }) : this.st.feedRabbits();
if (!r.ok) { toast('Not now', r.reason, 'leaf'); audio.play('error'); return; }
audio.play('munch');
this.after();
}
toggleBreed() {
this.st.setBreeding(!this.st.colony.breed);
audio.play('click');
this.after();
}
buyPurge() {
const r = this.st.buyPurge(this.lab.sandbox);
if (!r.ok) { toast('No purge', r.reason, 'purge'); audio.play('error'); return; }
audio.play('coin');
this.after();
}
brewPurge() {
const r = this.st.brewPurge(this.lab.sandbox);
if (!r.ok) { toast('The still', r.reason, 'alembic'); audio.play('error'); return; }
audio.play('pour');
toast('The still is working', `A purging draught will be ready in ${PURGE_BREW_TIME} seconds.`, 'alembic', 2500);
this.after();
}
purge(r) {
const res = this.st.purgeRabbit(r.id, this.lab.sandbox);
if (!res.ok) { toast('No purge', res.reason, 'purge'); audio.play('error'); return; }
audio.play('glass');
this.view.rreact[r.id] = 1;
toast(`${r.name} is purged`, 'Every potion effect washes out of it; anything degenerating has stopped, and so has any aggression or frenzy. What grew for good stays.', 'purge', 3500);
this.after();
}
async cull(r) {
const feral = isFeral(r);
if (!await confirmDialog(`Put ${r.name} down?`, feral ? `${r.name} is aggressive and is attacking the colony. The body stays: recover its remains or bury it.` : 'It dies at once. The body stays: recover its remains or bury it.', 'Put down', 'danger')) return;
const res = this.st.cullRabbit(r.id);
if (!res.ok) { toast('Cannot', res.reason, 'knife'); return; }
audio.play('toll');
this.after();
}
nextDay() {
const st = this.st;
st.day++;
const rep = colonyDay(st.colony, { seed: st.seed, day: st.day, cap: st.cap.hutch });
audio.play(rep.born.length ? 'birth' : rep.died.length ? 'toll' : 'page');
const parts = [];
if (rep.born.length) parts.push(`${rep.born.length} kit${rep.born.length > 1 ? 's' : ''} born`);
if (rep.grown.length) parts.push(`${rep.grown.map((g) => g.name).join(', ')} grown up`);
if (rep.died.length) parts.push(`${rep.died.map((d) => d.name).join(', ')} died`);
toast(`Day ${st.day}`, parts.length ? parts.join(' · ') + '.' : 'A quiet night in the hutch.', 'clock', 3000);
this.after();
}
history(r) {
const st = this.st;
const rows = r.doses.slice().reverse().map((d) => {
const rec = st.trials.records.find((x) => x.id === d.rec);
const text = rec ? rec.observations.map((o) => o.text).join(' ') : d.obs ? `Showed: ${d.obs.replace(/[+-]/g, '').split(',').join(', ')}.` : 'No visible change.';
return h('div', { class: 'history-row' + (d.died ? ' died' : '') },
h('div', {}, h('b', { text: `Day ${d.day} · ${d.ml} ml from the ${d.src === 'vial' ? 'vial' : 'tap'}` }), h('div', { class: 'small', text })),
rec && rec.replay ? btn('Replay', () => { m.close(); this.view.startReplay(rec); }, { icon: 'eye', act: 'replay-' + rec.id }) : null);
});
let m;
m = modal({
title: `${r.name}’s trials`,
body: [h('div', { class: 'card parch history' }, ...(rows.length ? rows : [h('div', { class: 'small muted', text: 'No trials yet.' })]),
r.dosesDropped ? h('div', { class: 'small muted', text: `…and ${r.dosesDropped} earlier.` }) : null)],
});
}
async remains(r) {
const lab = this.lab;
const traits = r.traits.length ? ` Its body still bears ${r.traits.map((t) => TRAIT_WORDS[t]).join(', ')}.` : '';
if (!await confirmDialog(`Recover ${r.name}’s remains?`, `Bones, pelt or ash, and whatever residue is left become ingredients on your shelf — once. What ${r.sex === 'f' ? 'she' : 'he'} absorbed in life may linger in them; only trials will tell.${traits}`, 'Recover', 'gold')) return;
const res = this.st.processRemains(r.id);
if (!res.ok) { toast('Cannot', res.reason, 'bone'); return; }
audio.play('crush');
toast('Remains recovered', res.parts.map((p) => `${p.name} (${p.ml} ml)`).join(', '), 'bone', 5000);
for (const e of res.events) if (e.type !== 'journal') lab.announce(e);
lab.buildShelf();
this.after();
}
async bury(r) {
if (!await confirmDialog(`Bury ${r.name}?`, 'Nothing is recovered.', 'Bury', 'danger')) return;
this.st.buryRabbit(r.id);
audio.play('toll');
this.after();
}
after() {
const lab = this.lab;
lab.refreshHud();
lab.save();
this.view.refresh();
}
drawTiles(t, force = false) {
const st = this.st;
for (const [id, tl] of Object.entries(this.tiles)) {
const r = findRabbit(st.colony, id);
if (!r) continue;
const snap = rabbitSnap(r, st.day);
const key = JSON.stringify(snap);
if (!force && !r.alive && key === tl.key) continue;
tl.key = key;
drawRabbit(tl.ctx, r.look, snap, r.alive ? t : 0, this.view.rreact[id] || 0, { quality: this.lab.effectiveQuality() === 'low' ? 'low' : 'high' });
}
}
frame(dt, t) {
if (!this.ctx) return;
const low = this.lab.effectiveQuality() === 'low';
this.scene.update(dt);
this.scene.draw(this.ctx, t, { selected: this.st.colony.focus, hover: this.hover, low });
this._acc += dt;
if (this._acc >= (low ? 0.2 : 0.1)) { this._acc = 0; this.drawTiles(t); }
this._live += dt;
if (this._live >= 0.25) { this._live = 0; this.live(); }
}
}
return { CHANNELS, HutchPanel };
})();
// src/ui/views/trials.js
const __m77 = (() => {
const { h, btn, clear, toast } = __m2;
const { icon } = __m3;
const { audio } = __m4;
const { SUBJECT_BY_ID, DOSES, missingEffects } = __m27;
const { EFFECTS, EFFECT_BY_KEY, EFFECT_INDEX, EFFECT_KEYS, potencyWord } = __m13;
const { SIM } = __m24;
const { applyTrials } = __m46;
const { summarize, addSamples, EVIDENCE_TEXT, evidenceRank, requirementEvidence } = __m27;
const { evidenceOf } = __m46;
const { shortName } = __m22;
const LEVEL_SHORT = { preliminary: '1 reading', repeated: 'repeated', corroborated: 'corroborated', certified: 'certified' };
const { drawRabbit } = __m78;
const { focusRabbit, findRabbit, rabbitSnap, decodeSnap, lookFromSeed, RABBIT_MARKS } = __m28;
const { HutchPanel } = __m79;
const REPLAY_T = 3.2;
class TrialsView {
constructor(lab) {
this.lab = lab;
this.el = h('section', { class: 'view view-trials', 'data-view': 'trials' });
this.time = 0;
this.last = null;
this.drag = null;
this.rreact = {};
this.replay = null;
this.hutch = new HutchPanel(this);
this.cards = {};
}
get source() {
const lab = this.lab;
if (lab.trialSource === 'vial' && lab.state.vial) return 'vial';
return 'cauldron';
}
available() {
const lab = this.lab;
if (this.source === 'vial') return lab.state.vial ? lab.state.vial.ml : 0;
return lab.tapAvailable();
}
doseMl() {
const d = Math.min(this.lab.trialDose, this.available());
return d < SIM.ML_PER_PARTICLE ? this.lab.trialDose : Math.floor(d / SIM.ML_PER_PARTICLE) * SIM.ML_PER_PARTICLE;
}
build() {
const lab = this.lab, st = lab.state;
const el = clear(this.el);
this.expect = h('div', { class: 'card parch estimate-card', 'data-role': 'estimate' });
this.status = h('div', { class: 'trials-status small' });
this.dropper = h('div', { class: 'dropper', role: 'button', tabindex: '0', 'aria-label': 'Dropper: drag onto a rabbit to give it the dose' }, icon('dropper', 'lg'), h('span', { class: 'small', text: 'Drag' }));
this.bindDropper();
this.report = h('div', { class: 'trial-report' });
el.append(this.expect, this.status, this.hutch.el, this.report);
this.cards = { rabbit: { card: this.hutch.el } };
void st;
this.refresh();
}
select(id) {
const st = this.lab.state;
if (!st.selectRabbit(id)) return;
const r = findRabbit(st.colony, id);
audio.play(r && r.alive ? 'squeak' : 'click');
this.replay = null;
this.lab.save();
this.refresh();
}
startReplay(rec) {
if (!rec || !rec.replay) return;
if (rec.rabbitId && findRabbit(this.lab.state.colony, rec.rabbitId)) {
this.lab.state.selectRabbit(rec.rabbitId);
this.refresh();
}
this.replay = { rec, t: 0 };
this.last = rec;
this.renderReport();
const ol = this.report.querySelector('.obs-list');
if (ol) ol.classList.add('replaying');
audio.play(rec.died ? 'toll' : 'squeak');
const p = this.hutch.el.querySelector('.rabbit-detail');
if (p && p.scrollIntoView) p.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
doseControls() {
const lab = this.lab, st = lab.state;
const src = this.source;
const from = h('div', { class: 'seg', role: 'radiogroup', 'aria-label': 'Dose from' }, h('span', { class: 'small seg-k', text: 'From' }),
btn(`Cauldron · ${Math.round(lab.tapAvailable())} ml`, () => { lab.trialSource = 'cauldron'; this.refresh(); }, { cls: src === 'cauldron' ? 'active' : '', act: 'src-cauldron', title: 'Draw the dose from the cauldron’s tap' }),
st.vial ? btn(`Vial · ${Math.round(st.vial.ml)} ml`, () => { lab.trialSource = 'vial'; this.refresh(); }, { cls: src === 'vial' ? 'active' : '', act: 'src-vial', title: `The sealed vial: ${Math.round(st.vial.ml)} of ${Math.round(st.vial.bottledMl || st.vial.ml)} ml left` }) : null,
st.vial && src === 'vial' ? btn('Pour back', () => lab.pourBackVial(), { icon: 'pour', act: 'trials-pour-back', title: 'Return the rest of the vial to the cauldron' }) : null,
st.vial && src === 'vial' && lab.sandbox ? btn('Discard', () => { lab.discardVial(); this.refresh(); }, { icon: 'trash', cls: 'danger', act: 'trials-discard' }) : null);
const doses = h('div', { class: 'seg', role: 'radiogroup', 'aria-label': 'Dose' }, h('span', { class: 'small seg-k', text: 'Dose' }),
...DOSES.map((ml) => btn(`${ml} ml`, () => { lab.trialDose = ml; this.refresh(); }, { cls: lab.trialDose === ml ? 'active' : '', act: 'dose-' + ml })));
return [from, doses];
}
refresh() {
const lab = this.lab, st = lab.state;
if (!this.expect) return;
const src = this.source;
const cert = this.estimate();
const com = st.current;
const need = com ? missingEffects(com, cert.values) : [];
this.renderExpected(cert);
const status = clear(this.status);
if (cert.changed && src === 'cauldron') status.append(h('div', { class: 'warn small', text: 'Earlier trials of this batch are outdated: you added ingredients since.' }));
if (cert.stale.length) status.append(h('div', { class: 'warn small', text: `The brew has changed since it was tested (${cert.stale.map((k) => EFFECT_BY_KEY[k].label).join(', ')}): reactions, heat or settling. Test again.` }));
if (com && need.length) {
status.append(h('div', { class: 'small' }, h('span', { text: 'Not yet tested for the order: ' }), ...need.map((k) => h('span', { class: 'fx-chip need' }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ' ' + EFFECT_BY_KEY[k].label))));
} else if (com && com.effectOrder) {
status.append(h('div', { class: 'ok small', text: 'Every effect the order asks about has been tested for this ' + (src === 'vial' ? 'vial.' : 'batch.') }));
}
this.hutch.render();
this.renderReport();
}
theoryOf() {
const lab = this.lab, st = lab.state;
try {
const t = this.source === 'vial' && st.vial ? lab.vialTheory(st.vial) : lab.theory();
return t ? Object.fromEntries(EFFECT_KEYS.map((k) => [k, Number(t[EFFECT_INDEX[k]]) || 0])) : null;
} catch { return null; }
}
renderExpected(cert) {
const el = clear(this.expect);
const vial = this.source === 'vial';
const th = this.theoryOf();
const tested = EFFECT_KEYS.filter((k) => cert.values[k] !== undefined);
const unseen = tested.filter((k) => cert.unseen ? cert.unseen[k] : cert.values[k] === 0 && (cert.spread[k] || 0) <= 1);
const shown = tested.filter((k) => !unseen.includes(k));
const firsts = shown.filter((k) => (cert.n[k] || 0) === 1);
const trials = tested.length ? Math.max(...tested.map((k) => cert.n[k] || 0)) : 0;
const rabbits = tested.length ? Math.max(...tested.map((k) => cert.rabbits[k] || 0)) : 0;
el.append(h('div', { class: 'row', title: 'Each value is the mean of every trial; ± is how far the true strength may lie from it. Other rabbits average out each rabbit’s own bias.' }, icon('scales'), h('b', { text: vial ? 'Expected effects of this vial' : 'Expected effects of this batch' }), h('span', { class: 'spacer' }),
trials ? h('span', { class: 'small muted', text: `${trials} trial${trials === 1 ? '' : 's'} · ${rabbits} rabbit${rabbits === 1 ? '' : 's'}` }) : null));
if (!tested.length) {
el.append(h('div', { class: 'small muted', text: 'Unknown — nothing tested yet. Give a rabbit a dose below to start the estimate.' }));
return;
}
const rows = h('div', { class: 'reading-rows' });
for (const k of shown) {
const e = EFFECT_BY_KEY[k], v = cert.values[k], one = (cert.n[k] || 0) === 1;
const u = sdRound((cert.unc || {})[k] ?? (cert.spread[k] || 0)), sd = sdRound(cert.spread[k] || 0);
const lvl = (cert.level || {})[k] || (one ? 'preliminary' : 'repeated');
const lo = Math.max(0, Math.abs(v) - u), hi = Math.min(100, Math.abs(v) + u);
const t = th ? th[k] : undefined;
rows.appendChild(h('div', { class: 'reading lvl-' + lvl + (one ? ' first' : ''), 'data-effect': k, 'data-level': lvl, title: `${e.label}: ${cert.n[k]} reading${cert.n[k] === 1 ? '' : 's'} on ${cert.rabbits[k]} rabbit${cert.rabbits[k] === 1 ? '' : 's'}${one ? '' : `, which differ by about ±${sd} from each other`} · ${EVIDENCE_TEXT[lvl]}${t !== undefined ? ` · theory ${Math.round(t)}%` : ''}` },
icon(e.icon, 'sm'), h('span', { class: 'rk', text: e.label }),
h('div', { class: 'rbar' },
u > 0 ? h('i', { class: 'range', style: { left: lo + '%', width: (hi - lo) + '%', background: rgb(e.color) } }) : null,
t !== undefined && Math.abs(t) >= 0.5 ? h('i', { class: 'th theory', style: { left: Math.min(100, Math.abs(t)) + '%' } }) : null,
h('i', { class: 'th mean', style: { left: Math.min(100, Math.abs(v)) + '%' } })),
h('span', { class: 'rv', text: `${fmtPct(v)}% ±${u} · ${LEVEL_SHORT[lvl]}` })));
}
if (shown.length) el.append(rows);
if (unseen.length) {
const bound = Math.max(...unseen.map((k) => (cert.unc || {})[k] || 0));
el.append(h('div', { class: 'small muted quiet', 'data-undetected': unseen.join(' '), title: 'No rabbit showed these. A faint effect can hide below the reading noise: more readings, and larger doses, narrow how strong it could be.' },
'Not detected: ', ...unseen.map((k) => icon(EFFECT_BY_KEY[k].icon, 'sm')), ` — each could still be up to ${sdRound(bound)}%`));
}
if (firsts.length) el.append(h('div', { class: 'warn small first-flag', text: `One reading only${firsts.length === shown.length ? '' : ` (${firsts.map((k) => EFFECT_BY_KEY[k].label).join(', ')})`}: a rough guess with a wide margin. Test again — a second rabbit narrows it most.` }));
if (rabbits <= 1 && trials >= 2) el.append(h('div', { class: 'warn small', text: 'All on one rabbit: its own bias stays in the estimate, and the effect piles up in it towards a limit nobody can see. Try another rabbit.' }));
const com = this.lab.state.current;
if (com && !this.lab.sandbox) {
const reqs = com.requirements.filter((r) => r.effect);
if (reqs.length) el.append(h('div', { class: 'within', 'data-section': 'within' }, h('b', { text: 'Against the order: ' }),
...reqs.map((r) => { const x = requirementEvidence(r, cert); return h('span', { class: 'w ' + (x.within === true ? 'ok' : x.within === false ? 'miss' : 'open'), 'data-req': r.key, 'data-evidence': x.evidence, title: x.title, text: ` ${r.key === 'purity' ? 'purity' : EFFECT_BY_KEY[r.key].label} ${x.mark} ${x.text}` }); })));
const proof = com.customer.persona ? com.customer.persona.proof : 0.5;
const need = proof >= 0.92 ? 'corroborated' : proof >= 0.8 ? 'repeated' : null;
const keys = com.requirements.filter((r) => r.effect && r.key !== 'purity').map((r) => r.key);
const short = need ? keys.filter((k) => cert.level && (cert.level[k] === undefined || evidenceRank(cert.level[k]) < evidenceRank(need))) : [];
if (need && short.length) el.append(h('div', { class: 'small proof-need', text: `${shortName(com.customer.name)} insists on proof: ${short.map((k) => EFFECT_BY_KEY[k].label).join(', ')} must be ${need === 'corroborated' ? 'read on at least two rabbits' : 'tested more than once'}.` }));
else if (keys.length && keys.every((k) => cert.level && cert.level[k])) el.append(h('div', { class: 'small ok', text: need ? `Enough proof for ${shortName(com.customer.name)}.` : 'Stronger evidence (more rabbits) makes customers trust your label — and pay — more.' }));
}
}
estimate() {
const lab = this.lab, st = lab.state;
if (this.source === 'vial' && st.vial) return { ...summarize(st.vial.samples || {}), ...vialFallback(st.vial), stale: [], changed: false };
return { spread: {}, n: {}, rabbits: {}, ...lab.currentCert() };
}
renderReport() {
const lab = this.lab, st = lab.state;
const r = this.last || st.trials.records[0];
const el = clear(this.report);
if (!r) {
el.append(h('div', { class: 'card parch small', text: 'No trial yet. A mixture’s effects are unknown until it is tested: choose a rabbit above and give it a dose.' }));
return;
}
const subj = SUBJECT_BY_ID[r.subjectId] || SUBJECT_BY_ID.rabbit;
const laws = r.lawsFound.map((id) => (st.world.laws || []).find((l) => l.id === id)).filter(Boolean);
const who = r.rabbitName ? r.rabbitName : subj.name;
const body = r.rabbitId ? findRabbit(st.colony, r.rabbitId) : null;
el.append(h('div', { class: 'card parch report' },
h('div', { class: 'row' }, icon('dropper'), h('b', { text: `Trial ${r.serial}: ${who}` }), h('span', { class: 'spacer' }), h('span', { class: 'small muted', text: `${r.ml} ml from the ${r.source === 'vial' ? 'vial' : 'tap'}` })),
h('ul', { class: 'obs-list' }, ...r.observations.map((o) => h('li', { class: 'tone-' + o.tone, text: o.text }))),
r.anomalies.length ? h('div', { class: 'warn small', text: `Unexpected: ${r.anomalies.map((k) => EFFECT_BY_KEY[k].label).join(', ')} differs from theory. Something in this mixture interacts — repeat with variations to find out what.` }) : null,
...laws.map((L) => h('div', { class: 'law-found' }, icon('star'), h('div', {}, h('b', { text: `Law discovered: ${L.name}` }), h('div', { class: 'small', text: L.lore + ' Your theory now accounts for it.' })))),
r.died ? h('div', { class: 'bad small', text: `${who} did not survive. ${body ? 'The body stays in the hutch: recover its remains or bury it.' : ''} A potion that kills a rabbit should not be sold as a remedy.` }) : null,
r.replay ? h('div', { class: 'row' }, btn('Replay', () => this.startReplay(r), { icon: 'eye', act: 'replay-trial', title: 'Watch this trial again — nothing is used up' })) : null,
));
}
test(id = 'rabbit') {
void id;
const lab = this.lab, st = lab.state;
const rabbit = focusRabbit(st.colony);
if (!rabbit || !rabbit.alive) {
toast('Choose a living rabbit', 'The chosen rabbit is dead: pick another in the hutch, or buy one.', 'rabbit');
this.refresh();
return;
}
const want = lab.trialDose;
let dose, ml, ctx;
try {
if (this.source === 'vial') {
const r = lab.vialDose(want);
if (!r) { toast('Not enough potion', 'The vial is empty.', 'bottle'); return; }
({ dose, ml } = r);
ctx = { ml, source: 'vial', batchId: r.batchId, rev: r.rev, theory: r.theory, parts: r.parts };
} else {
const r = lab.drawDose(want);
if (!r) { toast('Nothing to test', 'Pour and mix a brew first; the dose is drawn from the tap at the bottom.', 'flask'); return; }
({ dose, ml } = r);
ctx = { ml, source: 'cauldron', batchId: st.batch.id, rev: st.batch.rev, theory: lab.theory(), parts: lab.batchParts() };
}
/** @type {any} */ (ctx).rabbitId = rabbit.id;
const vial = this.source === 'vial' ? st.vial : null;
const { record, events } = st.recordTrial('rabbit', dose, ctx);
if (vial) {
vial.samples = addSamples(vial.samples || seedSamples(vial), record);
const sum = summarize(vial.samples);
vial.cert = sum.values;
vial.certRecords = sum.records;
if (vial.label) applyTrials(vial.label, Object.fromEntries(Object.keys(record.values).map((k) => [k, sum.values[k]])), record.id, evidenceOf(vial));
}
lab.shareEvidence(record.batchId);
this.last = record;
this.replay = null;
this.rreact[rabbit.id] = 1;
this.hutch.poke(rabbit.id, record.replay && record.replay.rx ? record.replay.rx.split(',') : []);
audio.play(record.died ? 'toll' : record.observations.some((o) => o.tone === 'bad') ? 'thump' : 'squeak');
if (record.degen && record.degen.length && !record.died) toast(`${rabbit.name} is degenerating!`, 'An effect has piled up past what its body can hold and keeps rising on its own until it kills it. Purge it — or put it down.', 'skull', 6000);
for (const e of events) {
if (e.type === 'law') { toast(`Law discovered: ${e.name}`, e.lore, 'star', 6000); audio.play('fanfare'); }
else if (e.type === 'rabbit-died') toast(`${e.name} died`, 'The body stays in the hutch. Recover its remains — once — or bury it.', 'skull', 5000);
else lab.announce(e);
}
if (lab.tutorial) lab.tutorial.notify('trial', 'rabbit');
lab.save();
} catch (e) {
toast('Cannot test', String(e && e.message), 'close');
}
lab.updateAssay(true);
this.refresh();
lab.refreshCustomer();
lab.views.counter.refresh();
lab.updateBadges();
}
replace(id) {
const lab = this.lab;
const r = lab.state.replaceSubject(id, lab.sandbox);
if (!r.ok) { toast('Cannot replace', r.reason, 'coin'); audio.play('error'); return; }
audio.play(r.cost ? 'coin' : 'click');
lab.refreshHud();
lab.save();
this.refresh();
}
colonyEvents(events) {
if (!events.length) return;
let rebuild = false;
for (const e of events) {
if (e.type === 'mate') {
this.hutch.scene.mate && this.hutch.scene.mate(e.from, e.to);
if (e.conceived) rebuild = true;
} else if (e.type === 'attack') {
this.hutch.scene.attack && this.hutch.scene.attack(e.from, e.to);
this.rreact[e.to] = 1;
if (this.lab.view === 'trials') audio.play('thump');
if (e.killed) rebuild = true;
} else if (e.type === 'rabbit-died') {
rebuild = true;
toast(`${e.name} died`, e.by ? `${e.by} mauled ${e.name} to death. Put the aggressive rabbit down or purge it before it kills again.` : e.cause === 'love' ? `${e.name} wore itself out with love. The body stays in the hutch.` : `The degeneration ran its course. The body stays in the hutch.`, 'skull', 5000);
audio.play('toll');
} else if (e.type === 'trait') rebuild = true;
else if (e.type === 'purge-brewed') { toast('A purging draught is ready', 'The still has finished brewing.', 'purge', 2500); rebuild = true; }
}
if (rebuild && this.expect) this.refresh();
else if (this.expect) this.hutch.syncScene();
}
bindDropper() {
const d = this.dropper;
let ghost = null;
const target = (x, y) => {
const el = document.elementFromPoint(x, y);
if (el && el === this.hutch.canvas) {
const id = this.hutch.hitAt(/** @type {any} */ ({ clientX: x, clientY: y }));
return id || null;
}
const tile = el && /** @type {HTMLElement} */ (el).closest ? /** @type {HTMLElement} */ (el).closest('[data-rabbit]') : null;
if (tile) return tile.getAttribute('data-rabbit');
const det = el && /** @type {HTMLElement} */ (el).closest ? /** @type {HTMLElement} */ (el).closest('.rabbit-detail') : null;
return det ? this.lab.state.colony.focus : null;
};
const targets = () => Object.entries(this.hutch.tiles).map(([k, t]) => /** @type {[string, HTMLElement]} */ ([k, t.tile]));
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
for (const [k, el] of targets()) el.classList.toggle('drop-hover', k === id);
this.hutch.hover = id;
};
const end = (e) => {
if (!this.drag) return;
this.drag = null;
if (ghost) ghost.remove();
ghost = null;
for (const [, el] of targets()) el.classList.remove('drop-hover');
const id = target(e.clientX, e.clientY);
if (!id) return;
const r = findRabbit(this.lab.state.colony, id);
if (r && !r.alive) { this.select(r.id); toast(`${r.name} is dead`, 'Choose a living rabbit to dose.', 'skull'); return; }
this.lab.state.selectRabbit(id);
this.test('rabbit');
};
d.addEventListener('pointermove', move);
d.addEventListener('pointerup', end);
d.addEventListener('pointercancel', () => { this.drag = null; if (ghost) ghost.remove(); ghost = null; });
d.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.test('rabbit'); });
}
frame(dt) {
this.time += dt;
const low = this.lab.effectiveQuality() === 'low';
for (const [rid, r] of Object.entries(this.rreact)) if (r > 0) this.rreact[rid] = Math.max(0, r - dt * 1.4);
this.hutch.frame(dt, this.time);
this.drawPortrait(dt, low);
}
drawPortrait(dt, low) {
const ctx = this.hutch.d.portrait;
if (!ctx) return;
const st = this.lab.state;
const quality = low ? 'low' : 'high';
if (this.replay) {
const rp = this.replay;
rp.t += dt;
const rec = rp.rec;
const who = findRabbit(st.colony, rec.rabbitId) || st.colony.memorial.find((m) => m.id === rec.rabbitId);
const look = who ? who.look : lookFromSeed(rec.rabbitId || 'x');
const before = decodeSnap(rec.replay.b), after = decodeSnap(rec.replay.a);
const react = rec.replay.rx ? rec.replay.rx.split(',').filter((k) => RABBIT_MARKS.includes(k)) : [];
if (rp.t < 0.6) drawRabbit(ctx, look, before, this.time, 0, { quality });
else {
const dying = before.alive && !after.alive && rp.t < 1.3;
const snap = dying ? { ...after, alive: true, hp: /** @type {3} */ (3) } : after;
drawRabbit(ctx, look, snap, this.time, Math.max(0, 1 - (rp.t - 0.6) * 1.2), { quality, react });
}
if (rp.t > REPLAY_T) {
this.replay = null;
const ol = this.report && this.report.querySelector('.obs-list');
if (ol) ol.classList.remove('replaying');
}
return;
}
const r = this.hutch.d.id ? findRabbit(st.colony, this.hutch.d.id) : focusRabbit(st.colony);
if (!r) { ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); return; }
const react = this.rreact[r.id] || 0;
const last = react > 0 && this.last && this.last.rabbitId === r.id && this.last.replay ? this.last.replay.rx.split(',').filter((k) => RABBIT_MARKS.includes(k)) : [];
drawRabbit(ctx, r.look, rabbitSnap(r, st.day), this.time, react, { quality, react: last });
}
}
function seedSamples(v) {
const s = {};
for (const [k, x] of Object.entries(v.cert || {})) s[k] = [{ v: Number(x) || 0, r: 'bottled', rec: (v.certRecords || {})[k] || '' }];
return s;
}
function vialFallback(v) {
if (v.samples) return {};
return summarize(seedSamples(v));
}
function sdRound(s) {
return s < 10 ? Math.round(s * 10) / 10 : Math.round(s);
}
function fmtPct(v) {
return Math.abs(v) < 10 ? String(Math.round(v * 10) / 10) : String(Math.round(v));
}
function rgb(c) {
return `rgb(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)})`;
}
return { TrialsView, EFFECTS, EFFECT_INDEX };
})();
// src/ui/views/book.js
const __m81 = (() => {
const { h, btn, clear } = __m2;
const { icon } = __m3;
const { audio } = __m4;
const panels = __m69;
const { SUBJECT_BY_ID } = __m27;
const { EFFECTS, EFFECT_BY_KEY, EFFECT_KEYS } = __m13;
const { rgbToHex } = __m8;
const TABS = [
['recipes', 'Recipes', 'book'], ['trials', 'Trials', 'dropper'], ['laws', 'Laws', 'eye'], ['ingredients', 'Ingredients', 'leaf'],
['journal', 'Journal', 'scroll'], ['achievements', 'Awards', 'trophy'], ['history', 'Sales', 'coin'],
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
if (this.lab.sandbox && (k === 'history' || k === 'achievements')) continue;
tabs.appendChild(btn(label, () => { this.tab = k; audio.play('page'); this.refresh(); }, { icon: ic, cls: this.tab === k ? 'active' : '', act: 'book-' + k }));
}
const body = clear(this.body);
const lab = this.lab;
switch (this.tab) {
case 'recipes': panels.renderRecipes(lab, body, () => this.refresh()); break;
case 'trials': this.renderTrials(body); break;
case 'laws': this.renderLaws(body); break;
case 'ingredients': this.renderIngredients(body); break;
default: panels.renderJournal(lab, body, this.tab);
}
}
renderTrials(body) {
const st = this.lab.state;
const recs = st.trials.records;
body.appendChild(h('div', { class: 'small muted', text: `${st.stats.trials || 0} trials run. Each records exactly what it revealed and what the guild theory expected.` }));
if (!recs.length) { body.appendChild(h('div', { class: 'card parch', text: 'No trials yet. In the Trials room, give a measured dose to one of your rabbits.' })); return; }
for (const r of recs.slice(0, 40)) {
const s = SUBJECT_BY_ID[r.subjectId];
body.appendChild(h('div', { class: 'item parch' },
h('span', { class: 'swatch big', style: { background: rgbToHex(r.look.color) } }),
h('div', {},
h('div', { class: 'title', text: `#${r.serial} ${r.rabbitName ? `${r.rabbitName} the ${s ? s.name : 'rabbit'}` : s ? s.name : r.subjectId} · ${r.ml} ml` }),
h('div', { class: 'meta' }, ...r.revealed.filter((k) => r.values[k] !== 0 || r.anomalies.includes(k)).map((k) => h('span', { class: 'fx-chip' + (r.anomalies.includes(k) ? ' anomaly' : ''), title: `${EFFECT_BY_KEY[k].label}: observed ${r.values[k]}${r.err && r.err[k] !== undefined ? ` ±${r.err[k]}` : ''}, theory ${r.theory[k]}` }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ` ${Math.round(r.values[k])}`))),
h('div', { class: 'meta', text: r.observations.map((o) => o.text).join(' ') }),
r.parts && r.parts.length ? h('div', { class: 'meta muted', text: 'Batch: ' + r.parts.map((p) => `${p.ml} ml ${st.lookup(p.id) ? st.lookup(p.id).name : '?'}`).join(', ') }) : null),
h('span', { class: 'small muted', text: `Day ${r.day}` })));
}
}
renderLaws(body) {
const st = this.lab.state;
body.appendChild(h('div', { class: 'card parch' }, h('h3', { text: 'The Guild Primer' }),
...['Fire and frost cancel each other where they meet.', 'Life (vitality) and death cancel each other.', 'Vitality neutralises toxicity: two parts of healing cure one part of poison.', 'Acids and alkalis neutralise. Acidity below zero means alkaline.', 'Only what dissolves takes effect: whole roots and stones do nothing until crushed or ground, and grains beyond what the liquid can hold barely count. Heat helps many things dissolve.', 'Effects act where substances meet. Layers that never mix never interact — stir!', 'Strong effects show diminishing returns.']
.map((t) => h('div', { class: 'small', text: '• ' + t }))));
const laws = st.world.laws || [];
const found = laws.filter((L) => st.trials.laws[L.id] && st.trials.laws[L.id].found !== null);
const hinted = laws.filter((L) => st.trials.laws[L.id] && st.trials.laws[L.id].found === null);
body.appendChild(h('div', { class: 'small muted', text: `This world hides ${laws.length} laws of resonance between effects. Discovered: ${found.length}. A law shows itself in trials where its effects meet; two observations confirm it.` }));
for (const L of found) {
body.appendChild(h('div', { class: 'item parch' }, icon('star'),
h('div', {}, h('div', { class: 'title', text: L.name }), h('div', { class: 'meta', text: L.lore }),
h('div', { class: 'meta muted', text: `${EFFECTS[L.a].label} with ${EFFECTS[L.b].label}${L.c >= 0 ? ` → ${EFFECTS[L.c].label}` : ''} · confirmed on day ${st.trials.laws[L.id].found}` }))));
}
for (const L of hinted) {
body.appendChild(h('div', { class: 'item parch locked' }, icon('help'),
h('div', {}, h('div', { class: 'title', text: 'An unexplained anomaly' }), h('div', { class: 'meta', text: `Something changed ${EFFECTS[L.a].label.toLowerCase()} in one of your trials. Repeat similar mixtures to confirm what.` }))));
}
}
renderIngredients(body) {
const lab = this.lab, st = lab.state;
body.appendChild(h('div', { class: 'small muted', text: 'The effects of every plain ingredient are known to the guild. Mixtures are not — that is what the trials are for.' }));
const list = h('div', { class: 'list' });
for (const id of st.world.ingredients) {
const m = st.lookup(id);
const seen = lab.sandbox || m.tier <= st.rank || st.stock(id) > 0 || (m.wild && st.gatherableSet().has(id));
const fx = m.remains ? [] : EFFECT_KEYS.map((k) => [k, (m.effects && m.effects[k]) || 0]).filter(([, v]) => Math.abs(v) >= 1).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
list.appendChild(h('div', { class: 'item parch' + (seen ? '' : ' locked') },
panels.jarCanvas(m, 18, 24),
h('div', {},
h('div', { class: 'title', text: seen ? m.name : '???' }),
seen ? h('div', { class: 'meta' }, m.remains ? h('span', { class: 'muted', text: 'effects unknown — test it' }) : fx.length ? fx.map(([k, v]) => h('span', { class: 'fx-chip', title: EFFECT_BY_KEY[k].label }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ` ${Math.round(v)}`)) : h('span', { class: 'muted', text: 'no magical effect' })) : h('div', { class: 'meta', text: 'Not yet available.' }),
seen ? h('div', { class: 'meta muted', text: `${m.remains ? `remains of ${m.remains.rabbitName}` : m.wild ? `wild · ${m.wild.region}` : m.form}${m.solubility > 0.03 ? ' · dissolves' : ''}${m.binder > 0.3 ? ' · forms dough' : ''}` }) : null),
seen ? btn('', () => panels.openIngredient(lab, id), { icon: 'lens', cls: 'icon', title: 'Inspect', act: 'inspect-' + id }) : icon('lock')));
}
body.appendChild(list);
}
}
return { BookView };
})();
// src/ui/lab.js
const __m51 = (() => {
const { Simulation } = __m31;
const { PHASE, SIM } = __m24;
const { snapshotSim, applySnapshot } = __m52;
const { clampToInterior } = __m42;
const { MAX_SPECIES } = __m18;
const { compatFactor } = __m14;
const { Renderer } = __m53;
const { drawPortrait } = __m60;
const { drawJar } = __m54;
const { ingredientSprite } = __m61;
const { measureParticles, tapSelection, probeSelection, viscosityClass, densityWord } = __m45;
const { scoreRequirement, PROPERTY_LABELS } = __m23;
const { processEvent } = __m67;
const { saveGame, saveJSON, KEYS } = __m50;
const { AutoBrewer, condensedCount } = __m68;
const { traceSample, buildProcedure, procedureLimits, matchRecipe, compareRecipe, checkReproduction, TRACE_DT } = __m49;
const { proofGaps, draftLabel, applyTrials, evidenceOf } = __m46;
const { RANKS } = __m26;
const { certification, missingEffects, requirementEvidence } = __m27;
const { sandboxIngredients } = __m7;
const { makeVial, appendParticles, updateVial, takeDose, pourBack, pourBackParts, relaxVial } = __m30;
const { theoryOf, EFFECTS, EFFECT_BY_KEY, EFFECT_INDEX, dominantEffect, NE } = __m13;
const { awakenParts, describeThreshold } = __m15;
const { ARC_NONE } = __m32;
const { describeColor, rgbToHex } = __m8;
const { h, btn, clear, toast, coins, confirmDialog } = __m2;
const { icon } = __m3;
const { audio } = __m4;
const panels = __m69;
const trade = __m71;
const { Tutorial } = __m72;
const { CounterView } = __m73;
const { WildsView } = __m74;
const { TrialsView } = __m77;
const { BookView } = __m81;
const { shortName } = __m22;
const REQ_ICON = { temperature: 'thermo', quantity: 'flask', purity: 'pure' };
const TOOL_DEFS = [
{ id: 'spoon', label: 'Stir', icon: 'spoon', key: '2', title: 'Spoon: drag in the brew to stir' },
{ id: 'pestle', label: 'Crush', icon: 'pestle', key: '3', needs: 'pestle', title: 'Pestle: drag over whole herbs, stones or ice to crush them' },
{ id: 'skimmer', label: 'Skim', icon: 'ladle', key: '4', sandbox: true, title: 'Skimmer: lift off the top layer' },
{ id: 'probe', label: 'Inspect', icon: 'lens', key: '5', title: 'Inspect: tap a spot to read its colour, heat and contents' },
{ id: 'pour', label: 'Pour', icon: 'pour', key: '1' },
];
const VIEWS = [
{ id: 'counter', label: 'Counter', icon: 'stall', key: 'c' },
{ id: 'brew', label: 'Brew', icon: 'cauldron', key: 'v' },
{ id: 'wilds', label: 'Wilds', icon: 'tree', key: 'w' },
{ id: 'trials', label: 'Trials', icon: 'dropper', key: 't' },
{ id: 'book', label: 'Book', icon: 'book', key: 'j' },
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
this.receiver = null;
this.autoBrewer = null;
this.time = 0;
this.hudTimer = 0;
this.assayTimer = 0;
this.saveTimer = 0;
this.layerTimer = 0;
this.assay = null;
this.cert = { values: {}, records: {}, stale: [], changed: false };
this.running = false;
this.fpsAcc = { t: 0, n: 0, fps: 0 };
this.perf = { intervals: new Float32Array(600), work: new Float32Array(600), n: 0, physMs: 0, renderMs: 0 };
this.stirLevel = 0;
this.lastBoil = 0;
this._raf = 0;
this.view = 'brew';
this.trialSource = 'cauldron';
this.trialDose = 10;
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
const tutorialVisit = st.tutorial.active && !st.tutorial.done && st.stats.served === 0;
if (!st.current && !st.dayOver && (st.opened || tutorialVisit)) this.bringCustomer(false);
else this.refreshCustomer();
this.tutorial = new Tutorial(this);
if (st.tutorial.active && !st.tutorial.done) this.tutorial.start();
}
this.autoLabel();
this.showView(this.sandbox ? 'brew' : st.vial ? 'counter' : 'brew', true);
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
toast('Shop opened elsewhere', 'Your shop was saved from another tab, so this one stepped back to keep that progress. Press Continue to carry on here.', 'scroll', 7000);
};
window.addEventListener('storage', this.onStorage);
audio.music(this.app.settings.music > 0 && this.app.settings.musicOn);
}
makeSim(size) {
const st = this.state;
return new Simulation({ size, lookup: st.lookup, reactions: st.world.reactions, laws: st.world.laws });
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
this.el.remove();
}
_applyFurnaceCaps() {
const cap = this.state.cap;
const fire = this.sandbox ? SANDBOX_FIRE : cap;
Object.assign(this.sim.furnace, { maxFlame: fire.maxFlame, heatPower: fire.heatPower, minCool: cap.minCool, coolPower: cap.coolPower });
}
refreshCapabilities() {
const cap = this.state.cap;
if (cap.size !== this.cap.size) {
const snap = snapshotSim(this.sim, this.cap.size);
const sim = this.makeSim(cap.size);
applySnapshot(sim, snap, { lookup: this.state.lookup });
this.sim = sim;
toast('New cauldron installed', `Your ${sim.cauldron.spec.label} is ready.`, 'cauldron');
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
const st = this.state;
this.el = h('div', { class: 'screen lab', 'data-mode': this.sandbox ? 'sandbox' : 'game', 'data-view': 'brew' });
this.coinEl = h('span', { class: 'coins-val' });
this.rankName = h('div', { class: 'rankname' });
this.rankBar = h('i');
this.dayEl = h('div', { class: 'day' });
this.topbar = h('header', { class: 'topbar frame' },
btn('', () => panels.openPause(this), { icon: 'menu', cls: 'icon', title: 'Menu: help, settings, tour (Esc)', act: 'menu' }),
this.sandbox
? h('div', { class: 'stat' }, icon('flask'), h('span', { text: 'Free Experiment' }))
: h('div', { class: 'stat', title: 'Coins' }, icon('coin'), this.coinEl),
this.sandbox ? null : h('div', { class: 'rankrow' }, h('div', { class: 'stat rankbox' }, this.rankName, h('div', { class: 'bar' }, this.rankBar))),
this.sandbox ? null : this.dayEl,
h('div', { class: 'spacer' }),
this.sandbox ? null : btn('Shop', () => panels.openShop(this), { icon: 'bag', cls: 'shop-btn', title: 'Shop: ingredients and equipment (S)', act: 'shop' }),
);
this.strip = h('div', { class: 'order-strip parch', role: 'button', tabindex: '0', 'aria-label': 'Order: open the counter' });
this.strip.addEventListener('click', (e) => { if (!(/** @type {HTMLElement} */ (e.target)).closest('.btn')) this.showView('counter'); });
this.canvas = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'view-canvas', 'aria-label': 'Cauldron: drag to stir, hold to pour the selected reagent' }));
this.readout = h('div', { class: 'readout parch hidden' });
this.infoText = h('span');
this.infoBtn = h('button', { class: 'chip chip-btn info-chip', 'data-act': 'brew-info', title: 'What is in the cauldron', 'aria-label': 'What is in the cauldron' }, icon('scroll', 'sm'), this.infoText);
this.infoBtn.addEventListener('click', () => { audio.play('click'); this.toggleBrewInfo(); });
this.chipList = h('div', { class: 'chip-list' });
this.chips = h('div', { class: 'hud-chips' }, this.infoBtn, this.chipList);
this.pourHint = h('div', { class: 'pour-hint chip hidden' });
this.bottleFab = btn('Bottle', () => this.startBottling(), { icon: 'bottle', cls: 'fab primary', title: 'Bottle the potion from the tap (B)', act: 'bottle' });
this.brewPanel = h('div', { class: 'brew-panel parch hidden' });
this.stageEl = h('main', { class: 'stage' }, this.canvas, this.readout, this.chips, this.pourHint, this.brewPanel, this.bottleFab);
this.furnaceInput = /** @type {HTMLInputElement} */ (h('input', { type: 'range', min: '-100', max: '100', step: '1', value: '0', 'aria-label': 'Fire and frost control' }));
this.furnaceInput.addEventListener('input', () => {
const v = Number(this.furnaceInput.value) / 100;
this.setFurnace(Math.abs(v) < 0.12 ? 0 : v);
});
this.furnaceOff = btn('Off', () => { this.setFurnace(0); audio.play('select'); }, { cls: 'foff', title: 'Put the fire or frost out (0)', act: 'furnace-off' });
this.furnaceLabel = h('span', { class: 'flabel' });
this.lidBtn = btn('Lid', () => this.toggleLid(), { icon: 'lid', cls: 'lid-btn', title: 'Lid on/off (L)', act: 'lid' });
this.controls = h('section', { class: 'controls frame' },
this.lidBtn,
h('div', { class: 'furnace', title: 'Slide left to cool, right to heat (arrow keys, 0 for off)' }, icon('snow', 'sm'), h('div', { class: 'frange' }, this.furnaceInput), icon('flame', 'sm'), this.furnaceLabel, this.furnaceOff),
);
this.toolsEl = h('div', { class: 'tools', role: 'toolbar', 'aria-label': 'Tools' });
this.toolbar = h('nav', { class: 'toolbar frame' }, this.toolsEl);
this.shelfEl = h('div', { class: 'shelf', role: 'listbox', 'aria-label': 'Ingredient shelf' });
this.doseEl = h('div', { class: 'dose' });
this.shelfWrap = h('div', { class: 'shelf-wrap frame' }, this.doseEl, this.shelfEl);
this.brewView = h('section', { class: 'view view-brew', 'data-view': 'brew' },
this.sandbox ? null : this.strip, this.stageEl, this.controls, this.toolbar, this.shelfWrap);
this.views = { counter: new CounterView(this), wilds: new WildsView(this), trials: new TrialsView(this), book: new BookView(this) };
this.viewsEl = h('div', { class: 'views' }, this.views.counter.el, this.brewView, this.views.wilds.el, this.views.trials.el, this.views.book.el);
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
this.tutorSlot = h('div', { class: 'tutor-slot', 'aria-live': 'polite' });
this.el.append(this.topbar, this.tutorSlot, this.viewsEl, this.tabbar);
this.root.appendChild(this.el);
this.buildTools();
this.buildShelf();
this.buildDose();
for (const v of Object.values(this.views)) v.build();
void st;
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
if (id === 'trials' && !this.sandbox && !(this.tutorial && this.tutorial.active) && this.state.firstTip('farm')) toast('The rabbit farm', 'One reading is a rough guess: test again, ideally on another rabbit. Too much of an effect in one rabbit can make it sick, wild or dead.', 'rabbit', 6000);
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
set('counter', st.vial ? '1' : st.current && !this.sandbox && this.view !== 'counter' && !this._seenCustomer ? '!' : '');
const com = st.current;
const need = com ? missingEffects(com, this.cert.values) : [];
set('trials', com && com.effectOrder && need.length && this.tapAvailable() >= 5 ? '?' : '');
if (this.view === 'counter') this._seenCustomer = true;
}
reqIcon(key) {
return REQ_ICON[key] || (EFFECT_BY_KEY[key] ? EFFECT_BY_KEY[key].icon : 'star');
}
placeDose() {
this.doseEl.classList.toggle('collapsed', this.tool !== 'pour' || !this.selected);
}
buildActions() {
const a = this.actionsEl;
if (!a) return;
clear(a);
const set = {};
set.stir = btn('Auto', () => {}, { icon: 'swirl', title: this.state.has('stirrer') ? 'Clockwork stirrer on/off (A)' : 'Hold to stir automatically (A)', act: 'autostir' });
const startAuto = (e) => { e.preventDefault(); if (this.state.has('stirrer')) this.setAutoStir(!this.autoStir); else this.setAutoStir(true); };
const stopAuto = () => { if (!this.state.has('stirrer')) this.setAutoStir(false); };
set.stir.addEventListener('pointerdown', startAuto);
set.stir.addEventListener('pointerup', stopAuto);
set.stir.addEventListener('pointerleave', stopAuto);
set.stir.addEventListener('pointercancel', stopAuto);
set.speed = btn('1×', () => this.cycleSpeed(), { icon: 'speed', title: 'Time speed: 1×, 2×, 4× (F)', act: 'speed' });
a.append(set.stir, set.speed);
if (this.sandbox) {
set.thermal = btn('Heat', () => this.toggleThermal(), { icon: 'monocle', title: 'Heat map (H)', act: 'thermal' });
a.append(set.thermal);
set.alembic = btn('Still', () => this.toggleAlembic(), { icon: 'alembic', title: 'Alembic valve: draw off the vapour', act: 'alembic' });
a.append(set.alembic);
}
a.append(btn('Empty', () => this.emptyCauldron(), { icon: 'trash', cls: 'danger', title: 'Empty the cauldron', act: 'empty' }));
this.actionSet = set;
this.syncActions();
}
syncActions() {
const lidOpen = !this.sim.cauldron.lidClosed;
this.lidBtn.classList.toggle('active', !lidOpen);
this.lidBtn.title = lidOpen ? 'The lid is off: steam escapes — tap to put it on (L)' : 'The lid is on: steam stays in — tap to take it off (L)';
const ll = this.lidBtn.querySelector('.lbl');
if (ll) ll.textContent = lidOpen ? 'Lid off' : 'Lid on';
const set = this.actionSet;
if (!set) return;
set.stir.classList.toggle('active', this.autoStir);
set.speed.classList.toggle('active', this.speed > 1);
const l = set.speed.querySelector('.lbl');
if (l) l.textContent = this.speed + '×';
if (set.thermal) set.thermal.classList.toggle('active', this.thermal);
if (set.alembic) set.alembic.classList.toggle('active', this.alembicOpen);
}
toggleThermal() {
this.thermal = !this.thermal;
this.syncActions();
}
buildTools() {
const t = clear(this.toolsEl);
this.toolBtns = {};
for (const d of TOOL_DEFS) {
if (!this.sandbox && (d.sandbox || (d.needs && !this.state.has(d.needs)))) continue;
if (d.id === 'pour') continue; // pouring starts from the shelf
const b = btn(d.label, () => this.selectTool(d.id), { icon: d.icon, title: `${d.title || d.label} (${d.key})`, act: 'tool-' + d.id });
this.toolBtns[d.id] = b;
t.appendChild(b);
}
t.appendChild(btn('Sample', () => this.sampleVial(), { icon: 'jar', title: 'Sample: measure what a bottle drawn from the tap would hold', act: 'sample' }));
t.appendChild(h('div', { class: 'sep' }));
this.actionsEl = h('div', { class: 'acts' });
t.appendChild(this.actionsEl);
this.buildActions();
if (this.tool) this.selectTool(this.tool, true);
}
buildShelf() {
const sh = clear(this.shelfEl);
this.jarEls = {};
const st = this.state;
const ids = this.sandbox ? sandboxIngredients(st.world) : st.world.ingredients.filter((id) => st.lookup(id).tier <= st.rank || st.stock(id) > 0);
const labels = shelfLabels(ids.map((id) => st.lookup(id).name));
for (const [n, id] of ids.entries()) {
const m = st.lookup(id);
let cv;
if ((m.wild || m.remains) && m.form === 'solid') {
cv = ingredientSprite(m);
cv.classList.add('raw');
} else {
cv = /** @type {HTMLCanvasElement} */ (h('canvas', { width: '15', height: '20' }));
drawJar(cv.getContext('2d'), 1, 0, 13, 20, m.look || m.color, m.form);
}
const stock = h('span', { class: 'jstock' });
const el = h('button', { class: 'jar' + (m.wild ? ' wild' : '') + (m.remains ? ' remains' : ''), title: m.name, 'aria-label': m.name, 'data-id': id, role: 'option' }, stock, cv, h('span', { class: 'jname', text: m.remains ? m.remains.short : labels[n] }));
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
this.selName = h('span', { class: 'sel-name' });
d.append(icon('pour', 'sm'), this.selName);
for (const ml of [25, 50, 100, 250]) d.append(btn(`${ml}`, () => this.pourDose(ml), { title: `Pour exactly ${ml} ml`, act: 'dose-' + ml }));
d.append(h('span', { class: 'muted dose-note', text: 'ml' }));
this.syncSelName();
}
syncSelName() {
const m = this.selected ? this.state.lookup(this.selected) : null;
if (this.selName) this.selName.textContent = m ? m.name : 'Pick a jar';
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
if (!this.selected) { toast('Choose a reagent', 'Tap a jar on the shelf first, or drag one onto the cauldron.', 'jar'); return; }
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
const view = VIEWS.find((v) => v.key === k);
if (view && this.tabEls[view.id]) { this.showView(view.id); return; }
const def = TOOL_DEFS.find((d) => d.key === k);
if (def && (this.toolBtns[def.id] || def.id === 'pour')) { if (def.id === 'pour' && !this.selected) return; this.selectTool(def.id); return; }
if (k === 'l') this.toggleLid();
else if (k === 'f') this.cycleSpeed();
else if (k === 'b') this.startBottling();
else if (k === 's' && !this.sandbox) panels.openShop(this);
else if (k === 'r' && !this.sandbox) { this.showView('book'); this.views.book.open('recipes'); }
else if (k === 'a') this.setAutoStir(!this.autoStir);
else if (k === 'h' && this.sandbox) this.toggleThermal();
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
if (id !== 'pour') {
if (this.sim.emitter.pouring && !(this.sim.emitter.active && this.sim.emitter.active.dose)) this.sim.emitter.stop();
for (const j of Object.values(this.jarEls || {})) j.el.classList.remove('selected');
this.selected = id === 'pour' ? this.selected : null;
}
this.pourHint.classList.toggle('hidden', id !== 'pour');
this.updatePourHint();
this.placeDose();
this.syncSelName();
if (!silent) audio.play('select');
if (this.tutorial) this.tutorial.notify('tool', id);
}
selectIngredient(id) {
this.selected = id;
this.selectTool('pour', true);
this.selected = id;
for (const [k, j] of Object.entries(this.jarEls)) j.el.classList.toggle('selected', k === id);
audio.play('select');
this.updatePourHint();
this.placeDose();
this.syncSelName();
if (this.tutorial) this.tutorial.notify('select', id);
}
updatePourHint() {
if (this.tool !== 'pour') return;
const m = this.selected ? this.state.lookup(this.selected) : null;
this.pourHint.textContent = m ? `Hold in the cauldron to ${m.form === 'solid' ? 'drop it in' : 'pour'}` : 'Tap a jar on the shelf';
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
const m = this.state.lookup(id);
toast('Out of stock', m.remains ? 'A rabbit’s remains are recovered only once.' : m.wild && m.tier > this.state.rank ? `Gather more ${m.name} in the Wilds.` : `Buy more ${m.name} in the Shop${m.wild ? ' or gather it in the Wilds' : ''}.`, m.remains ? 'bone' : m.wild ? 'tree' : 'bag');
return;
}
if (this.sim.p.count >= this.sim.maxParticles - 2) {
toast('The cauldron is full', 'Bottle or empty it first.', 'cauldron');
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
if (this.sim.p.count <= Math.round(ml / SIM.ML_PER_PARTICLE) + 1 && !log.some((e) => e.type === 'pour')) this.state.newBatch();
const last = log[log.length - 1];
if (last && last.type === 'pour' && last.id === id && !last.ground) last.ml += ml;
else log.push({ type: 'pour', id, ml, t: Math.round(this.sim.time) });
this.state.touchBatch();
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
t.autoCenterY = c.depth - Math.min(0.75, c.depth * 0.3);
t.autoRadius = upgraded ? c.belly * 0.55 : c.belly * 0.32;
t.autoPhase = 0;
t.autoSpan = 0;
if (upgraded) this.aimStirrer();
} else {
t.setTarget(t.x, t.y, false);
}
this.syncActions();
}
aimStirrer() {
const t = this.sim.tool, c = this.sim.cauldron, p = this.sim.p;
if (!t.auto || !this.state.has('stirrer') && !this.sandbox) return;
let top = c.depth;
for (let i = 0; i < p.count; i += 3) if (p.phase[i] !== PHASE.GAS) top = Math.min(top, p.y[i]);
t.autoCenterY = (top + c.depth) / 2;
t.autoSpan = Math.max(0, (c.depth - top) / 2 - 0.2);
}
async emptyCauldron() {
if (this.sim.p.count === 0) return;
const ok = await confirmDialog('Empty the cauldron?', 'Everything in the cauldron will be poured away. Ingredients are not refunded.', 'Empty it', 'danger');
if (!ok) return;
this.sim.clear();
this.state.brewLog = [];
this.state.newBatch();
this.lastPoured = {};
audio.play('splash');
this.save();
}
bringCustomer(withSound = true) {
const st = this.state;
if (this.sandbox) return;
const c = st.nextCustomer();
if (c && withSound) audio.play('bell');
if (c && !c.tutorial && !(this.tutorial && this.tutorial.active)) {
if (c.activation && st.firstTip('activation')) toast('Awakened magic wanted', 'This order is stronger than sleeping magic can reach: the brew must be awakened past its arcane threshold. See How to play → Arcane awakening, or ask the guild.', 'awaken', 8000);
else if (c.requirements.some((r) => r.key === 'purity') && st.firstTip('purity')) toast('A pure potion', '“No other effect above 1.2 %”: every effect the customer did not ask for must stay that faint. Test for them too.', 'pure', 7000);
}
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
this.reqEls = [];
el.classList.toggle('empty', !com);
if (!com) {
el.append(h('div', { class: 'strip-empty small', text: st.dayOver ? `Day ${st.day} is over — close the shop at the Counter.` : 'No customer yet — open the door at the Counter.' }));
return;
}
const portrait = /** @type {HTMLCanvasElement} */ (h('canvas', { class: 'portrait' }));
drawPortrait(portrait, com.customer.portrait, 'neutral');
this.portraitEl = portrait;
const chips = h('div', { class: 'req-chips' });
for (const req of com.requirements) {
const now = h('span', { class: 'now' });
const meter = h('i');
const fx = !!EFFECT_BY_KEY[req.key] || req.key === 'purity';
const li = h('div', { class: 'req-chip' + (fx ? ' fx' : '') + (req.limit ? ' limit' : ''), title: `${req.limit ? 'Limit — ' : ''}${PROPERTY_LABELS[req.key]}: ${req.label}` },
icon(this.reqIcon(req.key), 'sm'),
req.key === 'color' ? h('span', { class: 'swatch', style: { background: rgbToHex(req.rgb) } }) : h('span', { class: 'tgt', text: shortTarget(req) }),
now, h('div', { class: 'meter' }, meter));
chips.appendChild(li);
this.reqEls.push({ req, li, now, meter });
}
const qNow = h('span', { class: 'now' });
const qMeter = h('i');
const qli = h('div', { class: 'req-chip' }, icon('flask', 'sm'), h('span', { class: 'tgt', text: `${com.bottleMl}` }), qNow, h('div', { class: 'meter' }, qMeter));
chips.appendChild(qli);
this.reqEls.push({ req: { key: 'quantity' }, li: qli, now: qNow, meter: qMeter });
el.append(portrait, h('div', { class: 'strip-main' }, h('div', { class: 'potion-name', text: com.potionName }), chips));
this.updateAssay(true);
}
async decline() {
const ok = await confirmDialog('Decline this order?', 'The customer will leave without paying. Your reputation is not affected.', 'Decline', 'danger');
if (!ok) return;
this.state.declineCustomer();
this.refreshCustomer();
this.views.counter.refresh();
setTimeout(() => this.bringCustomer(true), 900);
}
endDay() {
const summary = this.state.endDay();
this.save();
const col = summary.colony;
if (col) {
if (col.born.length) setTimeout(() => audio.play('birth'), 600);
else if (col.died.length) setTimeout(() => audio.play('toll'), 600);
for (const e of col.events || []) this.announce(e);
}
panels.showDaySummary(this, summary, () => {
this.views.trials.build();
const relief = this.state.claimRelief();
if (relief) toast('Guild stipend', `The guild lends a struggling apprentice ${relief} coins.`, 'coin', 4000);
this.buildShelf();
this.refreshCustomer();
this.views.counter.refresh();
this.updateBadges();
this.refreshHud(true);
this.views.wilds.refresh();
});
}
startBottling() {
if (this.bottling) return;
const st = this.state;
const counterFree = !st.vial && !this.sandbox;
if (!counterFree && !this.sandbox && st.bottleRoom <= 0) {
toast('Nowhere to put it', `The counter holds a vial and the potion shelves are full (${st.cap.bottles}). Serve, pour back or discard a bottle first — or buy more shelving.`, 'bottle', 4500);
this.showView('counter');
return;
}
if (this.sandbox && st.vial) { toast('A vial is waiting', 'Pour back or discard the sealed vial first.', 'bottle'); return; }
const avail = Math.floor(this.tapAvailable() / SIM.ML_PER_PARTICLE);
if (avail < 1) { toast('Nothing to bottle', 'There is no liquid at the tap.', 'flask'); audio.play('error'); return; }
panels.openBottleSize(this, avail, (n, dest) => this.beginBottling(n, dest), { counterFree: counterFree || this.sandbox, shelfRoom: this.sandbox ? 0 : st.bottleRoom, shelves: !this.sandbox });
}
beginBottling(n, dest = 'counter') {
if (this.bottling) return;
const st = this.state;
const sel = tapSelection(this.sim, n);
if (sel.length < 1) return;
const m = measureParticles(this.sim, sel);
this.sim.emitter.stop();
this.setAutoStir(false);
const cert = certification(st.trials, st.batch, m.effects);
const vial = makeVial(this.sim, [], {
batchId: st.batch.id, rev: st.batch.rev, cert: cert.values, certRecords: cert.records, samples: cert.samples, parts: this.batchParts(),
day: st.day, commissionId: st.current ? st.current.id : null,
});
const carried = st.batch.carried;
if (carried && carried.label && !cert.stale.length && Object.keys(cert.values).length) {
vial.label = JSON.parse(JSON.stringify(carried.label));
applyTrials(vial.label, cert.values, Object.values(cert.records)[0] || '', evidenceOf(vial));
}
this.bottling = { total: sel.length, removed: 0, progress: 0, color: m.color, t: 0, vial, dest };
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
appendParticles(b.vial, this.sim, sel);
for (const i of sel) this.sim.removeParticle(i);
b.removed += sel.length;
if (!sel.length) b.total = b.removed;
}
b.progress = b.removed / Math.max(1, b.total);
if (b.t > 1.8) this.finishBottling();
}
finishBottling() {
const b = this.bottling;
this.bottling = null;
const st = this.state;
const vial = b.vial;
updateVial(vial, st.lookup, st.world.laws);
vial.recipe = this.recipeDraft(vial.m, null, st.current);
this.autoLabel(vial);
vial.commissionId = b.dest === 'shelf' ? null : vial.commissionId;
if (b.dest === 'shelf' && st.shelveBottle(vial).ok) {
if (this.sim.p.count === 0) { st.brewLog = []; st.newBatch(); this.lastPoured = {}; }
audio.play('glass');
this.save();
toast('Bottle shelved', `${vial.ml} ml sealed and put on the potion shelves (${st.bottles.length}/${st.cap.bottles}). Take it down at the Counter whenever you need it.`, 'bottle', 3600);
if (this.view === 'counter') this.views.counter.refresh();
this.updateBadges();
return;
}
st.vial = vial;
if (this.sim.p.count === 0) { st.brewLog = []; st.newBatch(); this.lastPoured = {}; }
audio.play('glass');
this.save();
if (this.sandbox || !st.current) toast('Vial sealed', `${vial.ml} ml bottled. Test it in the Trials room, or pour it back to keep working on it.`, 'bottle', 3600);
this.showView(this.sandbox ? 'trials' : 'counter');
this.updateBadges();
}
shelveVial() {
const st = this.state;
const r = st.shelveBottle();
if (!r.ok) { toast('The shelves are full', r.reason, 'bottle', 4000); audio.play('error'); return; }
audio.play('glass');
this.save();
this.views.counter.refresh();
this.updateBadges();
}
takeBottle(id) {
const r = this.state.takeBottle(id);
if (!r.ok) return;
updateVial(r.bottle, this.state.lookup, this.state.world.laws);
this.shareEvidence(r.bottle.batchId);
audio.play('glass');
this.save();
this.views.counter.refresh();
this.updateBadges();
}
discardBottle(id) {
if (!this.state.removeBottle(id)) return;
audio.play('splash');
this.save();
this.views.counter.refresh();
}
pourBackBottle(id) {
const b = this.state.bottles.find((x) => x.id === id);
if (!b) return;
if (!this.pourVialIntoCauldron(b)) return;
this.state.removeBottle(id);
this.save();
this.views.counter.refresh();
this.showView('brew');
}
serveVial() {
const st = this.state;
const v = st.vial, com = st.current;
if (!v || !com) return;
if (!v.label) { this.identifyVial(() => this.serveVial()); return; }
const gaps = proofGaps(com, v.label);
if (gaps.length) {
const untested = gaps.filter((g) => g.have === 'untested');
const weak = gaps.filter((g) => g.have !== 'untested');
const remeasured = untested.filter((g) => v.label.claims[g.key] && v.label.claims[g.key].measured !== undefined);
const names = (l) => l.map((g) => EFFECT_BY_KEY[g.key].label).join(', ');
toast(`${shortName(com.customer.name)} wants proof`, remeasured.length
? `This customer only buys on trial evidence of this batch: put the tested reading of ${names(remeasured)} back on the label (✓).`
: untested.length ? `This customer only buys on trial evidence of this batch: test ${names(untested)} first${com.requirements.some((r) => r.key === 'purity') ? ' — one trial reads every effect at once' : ''}.`
: `One reading is not enough for this customer: ${names(weak)} must be ${weak[0].need === 'corroborated' ? 'read on a second rabbit' : 'tested again'}.`, 'dropper', 6000);
return;
}
trade.openNegotiation(this, com, v, (n) => {
this.save();
if (!n) return;
if (n.state === 'left') { this.customerLeft(); return; }
if (n.state === 'deal') this.completeDeal(n.price, n.log.find((l) => l.who === 'them' && l.coins)?.coins || 0);
});
}
identifyVial(after) {
const v = this.state.vial;
if (!v) return;
trade.openIdentify(this, v, (label) => {
v.label = label;
this.save();
this.views.counter.refresh();
if (after) after();
});
}
completeDeal(price, firstOffer) {
const st = this.state;
const v = st.vial, com = st.current;
if (!v || !com) return;
const truth = { ...v.m, ml: Math.floor(v.ml / SIM.ML_PER_PARTICLE) * SIM.ML_PER_PARTICLE };
const recipe = { ...(v.recipe || this.recipeDraft(truth, null, com)), verified: v.cert || {} };
const { events, sale } = st.completeDeal(v, v.label, price, truth, firstOffer);
st.vial = null;
if (com.effectOrder && Object.values(v.label.claims).some((c) => c.source === 'trial')) events.push(...st.unlock('certified'));
for (const e of events) this.announce(e);
this.save();
trade.showDeal(this, com, sale, recipe, () => {
this.refreshCustomer();
this.views.counter.refresh();
this.refreshHud(true);
if (this.tutorial) this.tutorial.notify('sold');
if (!st.dayOver) setTimeout(() => this.bringCustomer(true), 1400);
});
}
customerLeft() {
const st = this.state;
toast('The customer left', 'No sale. Your vial is still on the counter.', 'door');
if (st.current && st.current.tutorial) return;
st.declineCustomer();
this.save();
this.refreshCustomer();
this.views.counter.refresh();
setTimeout(() => this.bringCustomer(true), 1200);
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
if (!this.pourVialIntoCauldron(v)) return;
st.vial = null;
this.save();
this.views.counter.refresh();
this.showView('brew');
}
pourVialIntoCauldron(v) {
const st = this.state;
const empty = this.sim.p.count === 0;
const made = pourBack(v, this.sim);
if (!made) { toast('No room', 'The cauldron is too full to pour the bottle back.', 'cauldron'); return false; }
st.brewLog.push({ type: 'vial', ml: made * SIM.ML_PER_PARTICLE, t: Math.round(this.sim.time), parts: pourBackParts(v, made * SIM.ML_PER_PARTICLE), from: v.id });
const kept = !!v.batchId && (empty || (st.batch.id === v.batchId && st.batch.rev === v.rev));
if (kept) st.resumeBatch(v);
else {
if (st.batch.id !== v.batchId) st.newBatch();
st.touchBatch();
}
audio.play('splash');
toast('Poured back', `${made * SIM.ML_PER_PARTICLE} ml returned to the cauldron. ${kept ? 'It is the same tested potion: its trials and label still hold.' : 'Earlier trials no longer describe the brew.'}`, 'pour');
return true;
}
recipeDraft(m, ev, com) {
const st = this.state;
const ing = [];
for (const e of st.brewLog) if (e.type === 'pour') ing.push({ id: e.id, ml: e.ml, ground: e.ground || undefined });
const agg = [];
for (const i of ing) {
const last = agg[agg.length - 1];
if (last && last.id === i.id && !!last.ground === !!i.ground) last.ml += i.ml;
else agg.push({ ...i });
}
const stats = st.brewLog.find((e) => e.type === 'stats') || {};
const steps = buildProcedure(st.brewLog, m.temperature);
return {
name: com ? com.potionName : 'Experiment',
request: com ? com.request : null,
techniques: com ? com.techniques || [] : [],
ingredients: agg,
limits: procedureLimits(steps),
maxTemp: Math.round(stats.maxT ?? m.temperature),
minTemp: Math.round(stats.minT ?? m.temperature),
serveTemp: Math.round(m.temperature),
stirSeconds: Math.round(stats.stir || 0),
crushed: !!stats.crushed,
lid: this.sim.cauldron.lidClosed,
result: { color: m.color, ml: m.ml },
verified: { ...this.cert.values },
steps,
evidence: Object.fromEntries(Object.keys(this.cert.values || {}).map((k) => [k, { level: (this.cert.level || {})[k] || 'preliminary', n: (this.cert.n || {})[k] || 1, r: (this.cert.rabbits || {})[k] || 1, u: (this.cert.unc || {})[k] || 0 }])),
brews: 1, reproduced: 0, mismatched: 0,
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
const stirring = t.active && t.type === 'spoon' && (t.speed > 0.2 || this.autoStir);
if (stirring) s.stir += dt;
if (t.active && t.type === 'pestle') s.crushed = true;
this._tr = this._tr || { t: 0, stir: false, crush: false };
this._tr.stir ||= stirring;
this._tr.crush ||= t.active && t.type === 'pestle';
if (n && this.sim.time - this._tr.t >= TRACE_DT) {
traceSample(log, { t: this.sim.time, T, stir: this._tr.stir, crush: this._tr.crush, lid: this.sim.cauldron.lidClosed, ml: condensedCount(this.sim) * SIM.ML_PER_PARTICLE });
this._tr = { t: this.sim.time, stir: false, crush: false };
}
}
sampleVial() {
const n = this.state.current ? this.state.current.bottleN : 20;
const m = measureParticles(this.sim, tapSelection(this.sim, n));
if (!m) { toast('Nothing to sample', 'The cauldron is empty.', 'flask'); return; }
audio.play('glass');
panels.showAnalysis(this, m, this.recipeDraft(m, null, null), `Measuring vial · ${m.ml} ml from the tap`);
}
announce(e) {
if (e.type === 'achievement') {
toast(`Achievement: ${e.name}`, `${e.desc} (+${e.reward} coins)`, 'star', 4200);
audio.play('fanfare');
} else if (e.type === 'technique') {
toast(`Technique mastered: ${e.name}`, `${e.text} (+4 reputation)`, 'star', 5200);
audio.play('fanfare');
} else if (e.type === 'rank') {
toast(`Promoted to ${e.name}!`, RANK_NEWS[e.rank] || 'New customers, reagents, regions and equipment are available.', 'charter', 7000);
audio.play('fanfare');
this.buildShelf();
this.views.wilds.refresh();
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
const add = (id, ml) => {
const last = out.find((x) => x.id === id);
if (last) last.ml += ml; else out.push({ id, ml });
};
for (const e of this.state.brewLog) {
if (e.type === 'pour') add(e.id, e.ml);
else if (e.type === 'vial') for (const p of e.parts || []) add(p.id, p.ml);
}
return out;
}
knownRecipe() {
const parts = this.batchParts();
if (!parts.length || this.sandbox) return null;
const steps = buildProcedure(this.state.brewLog);
for (const r of this.state.recipes) {
if (!r.verified || !Object.keys(r.verified).length || !r.ingredients) continue;
if (matchRecipe(r, parts, steps, this.state.lookup) === 'procedure') return r;
}
return null;
}
brewAdvice() {
if (this._advice && this.time - this._advice.t < 1) return this._advice.list;
const list = this.computeAdvice();
this._advice = { t: this.time, list };
return list;
}
computeAdvice() {
const sim = this.sim, p = sim.p, st = this.state, sp = sim.species, S = MAX_SPECIES;
const out = [];
if (!p.count) return out;
let whole = 0, gas = 0, T = 0, n = 0;
const raw = new Map();
for (let i = 0; i < p.count; i++) {
const ph = p.phase[i];
if (ph === PHASE.GAS) { gas++; continue; }
T += p.temp[i]; n++;
for (let s = 0; s < sp.count; s++) {
const f = p.comp[i * S + s];
const d = sp.defs[s];
if (f < 0.3 || !d || !d.wild) continue;
if (ph === PHASE.SOLID && d.crushable) whole++;
raw.set(s, (raw.get(s) || 0) + f);
}
}
T = n ? T / n : 20;
if (whole >= 3) out.push({ key: 'whole', text: 'Whole herbs and stones give up almost nothing: crush them with the pestle (Crush).' });
const windows = [];
for (const [s, f] of raw) {
if (f < 1.5) continue;
const d = sp.defs[s];
const r = st.world.reactions.find((x) => x.a === d.id && x.products.length === 1 && /^rw_(extract|infuse|steep)/.test(x.id));
if (!r) continue;
const knownR = this.sandbox || st.journal['reaction:' + r.id];
if (knownR && (T < r.minT - 2 || T > r.maxT + 2)) windows.push(`${d.name.split(' ').slice(-1)[0]} steeps at ${r.minT}–${r.maxT}°C`);
else if (!knownR && T < 30 && r.minT > 25) windows.push('');
}
const named = windows.filter(Boolean);
if (named.length) out.push({ key: 'window', text: `${named.slice(0, 2).join('; ')} — the brew is at ${Math.round(T)}°C.` });
else if (windows.length) out.push({ key: 'warm', text: 'Some of these herbs have not given up their magic yet: most steep only when warmed (a few only ice-cold).' });
if (gas >= 3 && !sim.cauldron.lidClosed) out.push({ key: 'steam', text: 'Boiling with the lid off: steam is leaving, so the brew grows smaller and stronger — side effects too.' });
else if (this.assay && this.assay.stability < 70 && !sim.emitter.pouring && !this.autoStir) out.push({ key: 'stir', text: 'The brew is uneven — pockets and layers. Stir it through before you test or bottle.' });
return out.slice(0, 3);
}
similarRecipe() {
const parts = this.batchParts();
if (!parts.length || this.sandbox) return null;
const steps = buildProcedure(this.state.brewLog);
for (const r of this.state.recipes) {
if (!r.verified || !Object.keys(r.verified).length) continue;
const c = compareRecipe(r, parts, steps, this.state.lookup);
if (c.formulation && !c.procedure) return { recipe: r, differences: c.differences, approx: c.procedure === null };
}
return null;
}
checkRecipeRepeat() {
const r = this.knownRecipe();
if (!r || !this.cert || !Object.keys(this.cert.values || {}).length) return;
const keys = Object.keys(r.verified);
if (!keys.every((k) => this.cert.values[k] !== undefined)) return;
const res = checkReproduction(r, this.cert, `${this.state.batch.id}:${this.state.batch.rev}`);
if (res === 'agree') toast('Recipe reproduced', `“${r.name}” brewed again and tested the same: a reliable recipe.`, 'book', 4200);
else if (res === 'differ') toast('The recipe did not repeat', `This batch of “${r.name}” tested differently from the recorded one. Something in the procedure matters that the recipe does not hold.`, 'book', 6000);
}
theory() {
const parts = awakenParts(this.batchParts(), this.sim.inventory(), this.state.lookup);
return theoryOf(parts, this.state.lookup, this.sandbox ? this.state.world.laws : this.state.knownLaws);
}
vialTheory(v) {
const comp = v && v.m ? v.m.composition : {};
return theoryOf(awakenParts(v.parts || [], comp, this.state.lookup), this.state.lookup, this.sandbox ? this.state.world.laws : this.state.knownLaws);
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
const st = this.state;
const v = st.vial;
if (!v || v.particles.length < 1) return null;
const r = takeDose(v, ml, st.lookup, st.world.laws, st.day);
if (!r) return null;
const out = { dose: r.dose, ml: r.ml, batchId: v.batchId, rev: v.rev, theory: this.vialTheory(v), parts: v.parts || [] };
if (v.particles.length < 1) {
st.vial = null;
toast('The vial is empty', 'All of it went to the trials.', 'bottle');
}
return out;
}
currentCert() {
return this.cert;
}
updateAssay(force = false) {
const st = this.state;
const com = st.current;
const n = com ? com.bottleN : 20;
const sel = tapSelection(this.sim, n);
const m = sel.length ? measureParticles(this.sim, sel) : null;
this.assay = m;
this.cert = m ? certification(st.trials, st.batch, m.effects) : { values: {}, records: {}, stale: [], changed: false };
if (!this.sandbox && st.trials.records.length !== this._recCount) { this._recCount = st.trials.records.length; this.checkRecipeRepeat(); }
if (!com || !this.reqEls || !this.reqEls.length) return;
for (const r of this.reqEls) {
let score = 0, text = '—', unknown = false;
if (m) {
if (r.req.key === 'quantity') {
const f = Math.min(1, m.ml / com.bottleMl);
score = f >= 0.98 ? 1 : f * f;
text = `${m.ml}`;
} else if (r.req.key === 'purity' || EFFECT_BY_KEY[r.req.key]) {
const ev = requirementEvidence(r.req, /** @type {any} */ (this.cert));
const v = this.cert.values[r.req.key];
if (ev.evidence === 'untested') {
unknown = true; score = 0;
if (r.req.key === 'purity') { const keys = EFFECTS.map((e) => e.key).filter((k) => !(r.req.exclude || []).includes(k)); const known = keys.filter((k) => this.cert.values[k] !== undefined).length; text = known ? `${known}/${keys.length}` : '?'; }
else text = '?';
} else {
score = ev.within === true ? 1 : ev.within === false ? 0.2 : 0.7;
text = r.req.key === 'purity' ? ev.mark : ev.evidence === 'not-detected' ? `${ev.mark}nd` : `${ev.mark}${Math.round(v)}`;
}
r.li.title = `${PROPERTY_LABELS[r.req.key]}: ${r.req.label} — ${ev.text}${ev.title ? ` (${ev.title})` : ''}`;
} else {
const s = scoreRequirement(r.req, m);
score = s.score;
text = `${Math.round(s.value)}°`;
}
}
r.now.textContent = text;
r.meter.style.width = unknown ? '0%' : Math.round(score * 100) + '%';
r.meter.style.background = score >= 0.999 ? '#4c8a2a' : score > 0.6 ? '#c08a2a' : '#a83a2a';
r.li.classList.toggle('ok', score >= 0.999 && !unknown);
r.li.classList.toggle('unknown', unknown);
}
if (this.bottleFab) this.bottleFab.disabled = !m;
this.updateBadges();
void force;
}
toggleBrewInfo() {
this.brewPanel.classList.toggle('hidden');
const open = !this.brewPanel.classList.contains('hidden');
this.stageEl.classList.toggle('info-open', open);
this.infoBtn.classList.toggle('active', open);
this.updateBrewPanel(true);
}
updateBrewPanel(force = false) {
const el = this.brewPanel;
if (!el || (el.classList.contains('hidden') && !force)) return;
const sim = this.sim, p = sim.p, st = this.state;
const n = p.count;
clear(el);
el.append(h('div', { class: 'row' }, icon('cauldron'), h('b', { text: 'In the cauldron' }), h('span', { class: 'spacer' }), btn('', () => this.toggleBrewInfo(), { icon: 'close', cls: 'icon', title: 'Close' })));
if (!n) { el.append(h('div', { class: 'small muted', text: 'Empty. Pick a reagent and pour.' })); return; }
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
const theory = this.theory();
const cert = this.cert;
const known = this.knownRecipe();
const similar = known ? null : this.similarRecipe();
const thList = EFFECTS.map((e, k) => /** @type {[import('../alchemy/effects.js').EffectDef, number]} */ ([e, theory[k]])).filter(([, v]) => Math.abs(v) >= 1);
el.append(...[
h('div', { class: 'small', text: `${n * SIM.ML_PER_PARTICLE} ml · ${tn ? Math.round(tsum / tn) : '—'}°C${tn ? ` (${Math.round(tmin)}–${Math.round(tmax)})` : ''} · lid ${sim.cauldron.lidClosed ? 'on' : 'off'}` }),
...this.brewAdvice().map((a) => h('div', { class: 'small advice', 'data-advice': a.key, text: a.text })),
h('div', { class: 'phase-bar' }, ...['liquid', 'powder', 'paste', 'solid', 'gas'].map((name, k) => phases[k] ? h('i', { class: 'ph-' + name, title: name, style: { flexGrow: String(phases[k]) } }) : null)),
h('div', { class: 'small muted', text: ['liquid', 'powder', 'paste', 'solid', 'vapour'].map((name, k) => (phases[k] ? `${name} ${Math.round((phases[k] / n) * 100)}%` : '')).filter(Boolean).join(' · ') }),
...comp.map(([id, v]) => {
const m = st.lookup(id);
return h('div', { class: 'row small' }, h('span', { class: 'swatch', style: { background: rgbToHex(m ? m.look || m.color : [0.5, 0.5, 0.5]) } }), h('span', { text: `${Math.round((v / tot) * 100)}% ${m ? m.name : id}` }));
}),
h('div', { class: 'small know' }, h('b', { text: 'Theory ' }), thList.length ? thList.map(([e, v]) => h('span', { class: 'fx-chip dim', title: e.label }, icon(e.icon, 'sm'), ` ≈${Math.round(v)}`)) : h('span', { class: 'muted', text: 'no effects expected' })),
known ? h('div', { class: 'small know' }, h('b', { text: 'Recipe ' }), ...Object.entries(known.verified).map(([k, v]) => h('span', { class: 'fx-chip dim', title: `${EFFECT_BY_KEY[k].label}, as verified when “${known.name}” was first brewed` }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ` ~${Math.round(/** @type {number} */ (v))}`))) : null,
similar ? h('div', { class: 'small warn recipe-partial', text: similar.approx
? `Recipe “${similar.recipe.name}”: the same ingredients, but its procedure is only approximate — test this batch rather than rely on what it recorded.`
: `Recipe “${similar.recipe.name}”: the same ingredients, but not yet prepared the same way (${similar.differences.slice(0, 2).join('; ')}) — follow its steps before you rely on what it recorded.` }) : null,
h('div', { class: 'small know' }, h('b', { text: 'Verified ' }), Object.keys(cert.values).length ? Object.entries(cert.values).map(([k, v]) => h('span', { class: 'fx-chip', title: EFFECT_BY_KEY[k].label }, icon(EFFECT_BY_KEY[k].icon, 'sm'), ` ${Math.round(v)}`)) : h('span', { class: 'muted', text: cert.changed ? 'outdated — retest' : 'nothing yet' })),
h('div', { class: 'small muted', text: `Theory: what the ingredients do on paper.${known ? ' Recipe: what this recipe did when tested.' : ''} Verified: trials of this batch — the only proof.` }),
].filter(Boolean));
void force;
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
const arc = this.sandbox || st.has('arcanometer');
const aura = arc ? EFFECTS.filter((e, k) => Math.abs(m.effects[k]) >= 3) : [];
el.append(
h('div', { class: 'rrow' }, h('span', { class: 'swatch', style: { background: rgbToHex(m.color) } }), h('b', { text: `${describeColor(m.color)} ${phase}` })),
this.sandbox
? h('div', { text: `${Math.round(m.temperature)}°C · ${m.viscosity < 100 ? m.viscosity.toFixed(1) : Math.round(m.viscosity)} cP · ${m.density.toFixed(2)} g/ml · charge ${m.charge.toFixed(2)}` })
: h('div', { text: `${Math.round(m.temperature)}°C · ${viscosityClass(m.viscosity)} · ${densityWord(m.density)}` }),
...comp.map(([id, f]) => h('div', { text: `${Math.round(f * 100)}% ${st.lookup(id) ? st.lookup(id).name : id}` })),
arc ? h('div', { class: 'aura' }, h('span', { text: 'Aura: ' }), aura.length ? aura.map((e) => icon(e.icon, 'sm')) : h('span', { text: 'none' })) : h('div', { class: 'muted', text: 'Effects: unknown (test in Trials)' }),
);
if (arc) el.append(this.arcaneReading(sel, m));
}
arcaneReading(sel, m) {
const p = this.sim.p;
let w = 0, t = 0;
for (const i of sel) if (p.arcT[i] < ARC_NONE) { w++; t += p.arcT[i]; }
let awake = 0, magic = 0;
for (const [id, f] of Object.entries(m.composition)) {
const d = this.state.lookup(id);
if (!d) continue;
if (d.awakened) { awake += f; magic += f; } else if (d.arcane && Number.isFinite(d.arcane.thr)) magic += f;
}
if (!magic) return h('div', { class: 'muted', text: 'Arcanometer: no magic here' });
const share = Math.round((awake / magic) * 100);
const thr = w ? Math.round(t / w / 50) * 50 : null;
return h('div', { class: 'arcane-read' }, icon('awaken', 'sm'), ` ${thr === null ? 'all awakened' : 'threshold ' + describeThreshold(thr)}${share ? ` · ${share}% awake` : ''}`);
}
refreshHud(full = false) {
const st = this.state;
if (!this.sandbox) {
this.coinEl.textContent = coins(st.coins);
const r = st.rank, next = RANKS[r + 1];
this.rankName.textContent = RANKS[r].name;
const prog = next ? (st.reputation - RANKS[r].rep) / (next.rep - RANKS[r].rep) : 1;
this.rankBar.style.width = Math.round(Math.max(0, Math.min(1, prog)) * 100) + '%';
this.rankBar.parentElement.parentElement.title = `Rank: ${RANKS[r].name} · reputation ${st.reputation}${next ? ` of ${next.rep} for ${next.name}` : ''}`;
const guest = Math.min(st.customerIndex + (st.current ? 1 : 0), st.customersPerDay);
this.dayEl.title = `Day ${st.day}: customer ${guest} of ${st.customersPerDay} today${st.marketEvent.key !== 'none' ? ` · ${st.marketEvent.name}` : ''}`;
clear(this.dayEl).append(h('span', { text: `Day ${st.day}` }), h('span', { class: 'guests', text: `Customer ${guest}/${st.customersPerDay}` }), ...(st.marketEvent.key !== 'none' ? [h('span', { class: 'event', text: st.marketEvent.name })] : []));
}
this.syncActions();
const f = this.sim.furnace.setting;
const c = this.sim.cauldron;
const label = f > 0.02 ? `Heat ${Math.round(f * 100)}%` : f < -0.02 ? `Cool ${Math.round(-f * 100)}%` : 'Off';
this.furnaceLabel.textContent = `${label} · ${Math.round(c.bottomTemperature())}°C`;
this.furnaceLabel.title = 'Setting, and the temperature of the cauldron floor';
const on = Math.abs(f) > 0.02;
this.furnaceOff.disabled = !on;
this.furnaceOff.classList.toggle('hot', f > 0.02);
this.furnaceOff.classList.toggle('cold', f < -0.02);
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
const sim = this.sim;
const p = sim.p;
let T = 0, n = 0, gas = 0;
for (let i = 0; i < p.count; i++) { if (p.phase[i] === PHASE.GAS) gas++; else { T += p.temp[i]; n++; } }
const info = `${p.count * SIM.ML_PER_PARTICLE} / ${sim.maxParticles * SIM.ML_PER_PARTICLE} ml${n ? ` · ${Math.round(T / n)}°C` : ''}`;
if (this.infoText.textContent !== info) this.infoText.textContent = info;
const list = [];
if (gas > 0) list.push({ text: `Vapour ${gas * SIM.ML_PER_PARTICLE} ml${sim.cauldron.lidClosed ? '' : ' (escaping!)'}` });
if (this.autoBrewer) list.push({ text: `Homunculus: ${this.autoBrewer.status}` });
else if (!this.bottling) {
const a = this.brewAdvice()[0];
if (a) list.push({ text: ADVICE_SHORT[a.key] || 'Advice', act: 'advice-chip', cls: 'advice', title: a.text, key: a.key, on: () => toast('At the cauldron', a.text, 'bulb', 5000) });
}
if (this.receiver && this.receiver.count) list.push({ text: `Receiver ${this.receiver.count * SIM.ML_PER_PARTICLE} ml`, act: 'receiver', title: 'The alembic’s receiver flask', on: () => panels.openReceiver(this) });
if (this.app.settings.showFps) list.push({ text: `${this.fpsAcc.fps} fps · ${sim.stats.stepMs.toFixed(1)} ms/step · ${p.count} p` });
const sig = list.map((x) => x.text + '|' + (x.title || '')).join('/');
if (sig === this._chipSig) return;
this._chipSig = sig;
const c = clear(this.chipList);
for (const x of list) {
c.append(x.act ? h('button', { class: 'chip chip-btn' + (x.cls ? ' ' + x.cls : ''), 'data-act': x.act, ...(x.key ? { 'data-advice': x.key } : {}), title: x.title || '', onclick: x.on }, x.text) : h('div', { class: 'chip', text: x.text }));
}
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
this._colonyAcc = (this._colonyAcc || 0) + dt;
if (this._colonyAcc >= 0.5) { this.tickColony(this._colonyAcc); this._colonyAcc = 0; }
if (this.autoBrewer) {
const n = Math.min(12, Math.round((dt * this.speed) / SIM.DT));
for (let k = 0; k < n; k++) {
this.autoBrewer.tick();
sim.step();
if (this.autoBrewer.done) { toast('Homunculus finished', this.autoBrewer.failed ? 'It stopped — check your stock.' : 'The brew is ready to test and bottle.', 'homunculus'); this.autoBrewer = null; this.setFurnace(0); break; }
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
if (this.alembicOpen) this.collectVapour();
this.stepBottling(dt);
this.stepVial(dt);
this.trackBrew(dt);
if (sim.events.length) {
const evs = sim.events.splice(0);
for (const e of evs) this.handleSimEvent(e);
}
this.hudTimer += dt;
this.assayTimer += dt;
this.saveTimer += dt;
this.layerTimer += dt;
if (this.hudTimer > 0.25) { this.hudTimer = 0; if (this.autoStir) this.aimStirrer(); this.refreshHud(); this.updateShelf(); if (this.probe) this.updateProbe(); this.updateBrewPanel(); this.checkAway(); }
if (this.assayTimer > 0.4 && !this.bottling) { this.assayTimer = 0; this.updateAssay(); }
if (this.layerTimer > 2) { this.layerTimer = 0; this.detectLayers(); }
if (this.saveTimer > 15) { this.saveTimer = 0; this.save(); }
if (this.tutorial) this.tutorial.update();
const tool = sim.tool;
const stirTarget = tool.active && tool.type !== 'skimmer' ? Math.min(1, tool.speed / 2.5) : 0;
this.stirLevel += (stirTarget - this.stirLevel) * Math.min(1, dt * 10);
let boiling = 0;
if (sim.steps % 30 === 0) { for (let i = 0; i < sim.p.count; i++) if (sim.p.phase[i] === PHASE.GAS && sim.nCond[i] >= 3) boiling++; this.lastBoil = boiling; }
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
showBottle: true,
probe: this.tool === 'probe' ? this.probe : null,
thermal: this.thermal,
alembic: this.sandbox,
receiver: this.receiver,
stirrer: this.state.has('stirrer') && this.autoStir,
aura: this.sandbox || this.state.has('arcanometer'),
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
tickColony(dt) {
const c = this.state.colony;
const now = Date.now();
const away = c.clock > 0 ? Math.min(600, Math.max(0, (now - c.clock) / 1000 - dt)) : 0;
c.clock = now;
const events = [];
let left = away > 2 ? away + dt : dt;
while (left > 1e-6) {
const step = Math.min(1, left);
left -= step;
events.push(...this.state.tickColony(step).events);
}
if (events.length) {
this.views.trials.colonyEvents(events);
this.updateBadges();
if (this.view !== 'trials') {
const att = events.filter((e) => e.type === 'attack');
if (att.length && this.time - (this._feralWarned || -99) > 20) { this._feralWarned = this.time; toast('Trouble in the hutch', `${att[0].fromName} has turned aggressive and is attacking ${att[0].toName}!`, 'claw', 4500); }
}
}
}
stepVial(dt) {
const st = this.state;
for (const b of st.bottles) this._shelfDrift = (this._shelfDrift || 0) + relaxVial(b, dt * this.speed);
const v = st.vial;
if (!v) return;
this._vialDrift = (this._vialDrift || 0) + relaxVial(v, dt * this.speed);
this._vialT = (this._vialT || 0) + dt;
if (this._vialT > 2 && this._vialDrift > 0.5) {
this._vialT = 0;
this._vialDrift = 0;
updateVial(v, st.lookup, st.world.laws);
if (this.view === 'counter') this.views.counter.refresh();
}
}
shareEvidence(batchId) {
if (!this.sandbox) this.state.shareEvidence(batchId);
this.autoLabel();
}
autoLabel(only) {
const st = this.state;
for (const v of only ? [only] : [st.vial, ...st.bottles]) {
if (!v || v.label || !v.cert || !Object.keys(v.cert).length) continue;
if (!v.m) updateVial(v, st.lookup, st.world.laws);
v.label = draftLabel(v, this.vialTheory(v), st.day);
v.label.auto = true;
}
}
freshBottles() {
if ((this._shelfDrift || 0) < 0.5) return;
this._shelfDrift = 0;
for (const b of this.state.bottles) updateVial(b, this.state.lookup, this.state.world.laws);
}
checkAway() {
if (this.view === 'brew') return;
const sim = this.sim;
if (this.time - this.awayWarned < 20) return;
let gas = 0, burn = 0;
for (let i = 0; i < sim.p.count; i++) { if (sim.p.phase[i] === PHASE.GAS) gas++; if (sim.p.burn[i] > 0.3) burn++; }
if (burn > 2 || (gas > 6 && sim.furnace.setting > 0.05)) {
this.awayWarned = this.time;
toast(burn > 2 ? 'Something is burning!' : 'The cauldron is boiling', 'The fire is still lit while you are away.', 'flame', 4000);
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
case 'reaction': audio.play('reaction'); break;
case 'crush': if (Math.random() < 0.5) audio.play('crush'); break;
case 'ignite': audio.play('ignite'); break;
case 'awaken': audio.play('awaken'); break;
case 'crack': audio.play('crack'); break;
case 'spark': if (Math.random() < 0.3) audio.play('crush'); break;
case 'phase': if (e.to === 'solid' && Math.random() < 0.15) audio.play('freeze'); break;
case 'full': toast('The cauldron is full', 'Bottle or empty it before adding more.', 'cauldron'); break;
}
if (this.sandbox) return;
const r = processEvent(this.state, e);
for (const entry of r.entries) {
if (entry.kind === 'ingredient') continue;
toast(entry.kind === 'reaction' ? 'New reaction discovered!' : entry.kind === 'arcane' ? 'Arcane awakening!' : 'Discovery', entry.title, entry.kind === 'reaction' ? 'eye' : entry.kind === 'arcane' ? 'awaken' : 'scroll', 3800);
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
if (!c.lidClosed || !this.sandbox) return;
this.receiver = this.receiver || { count: 0, comp: {}, color: [0.7, 0.8, 0.9] };
const rec = this.receiver;
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
}
pourReceiver() {
const rec = this.receiver;
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
this.receiver = null;
this.state.touchBatch();
toast('Distillate poured back', `${made * SIM.ML_PER_PARTICLE} ml returned to the cauldron.`, 'alembic');
}
startHomunculus(recipe) {
const steps = recipe.steps && recipe.steps.length ? recipe.steps : null;
const plan = steps ? { ingredients: [], heatTo: recipe.maxTemp, coolTo: recipe.minTemp, serveTemp: recipe.serveTemp, steps } : {
ingredients: recipe.ingredients.map((i) => ({ id: i.id, n: Math.round(i.ml / SIM.ML_PER_PARTICLE), ground: i.ground })),
heatTo: recipe.maxTemp, coolTo: recipe.minTemp, serveTemp: recipe.serveTemp, knead: recipe.stirSeconds > 12, crush: recipe.crushed || recipe.ingredients.some((i) => i.ground), hold: 12,
};
const need = new Map();
for (const s of steps || []) if (s.op === 'pour') need.set(s.id, (need.get(s.id) || 0) + s.ml);
if (!steps) for (const i of recipe.ingredients) need.set(i.id, (need.get(i.id) || 0) + i.ml);
const short = this.sandbox ? [] : [...need].filter(([id, ml]) => this.state.stock(id) + 1e-6 < ml);
if (short.length) { toast('Not enough on the shelf', `The homunculus needs ${short.map(([id, ml]) => `${Math.round(ml - this.state.stock(id))} ml more ${this.state.lookup(id).name}`).join(', ')}.`, 'homunculus', 5000); return false; }
this.autoBrewer = new AutoBrewer(this.sim, /** @type {any} */ (plan), this.state.lookup, {
onPour: (id, n) => {
const ml = n * SIM.ML_PER_PARTICLE;
if (!this.sandbox && this.state.stock(id) < ml) return false;
return true;
},
});
recipe.brews = (recipe.brews | 0) + 1;
const lim = procedureLimits(steps || []);
const limits = lim.length ? ` It cannot do the ${lim.join(' or ')} and skips ${lim.length > 1 ? 'those steps' : 'that step'}.` : '';
toast('The homunculus gets to work', `${recipe.name}${recipe.approx ? ` — an approximate recipe (${recipe.approxWhy || 'saved before procedures were kept'}): the result may differ, so test it.` : ''}${limits}`, 'homunculus', 5200);
return true;
}
save() {
if (this.saveBlocked) return;
if (this.sandbox) {
saveJSON(KEYS.sandbox, { seed: this.state.seed, cauldron: snapshotSim(this.sim, this.cap.size), trials: this.state.trials });
return;
}
this.state.cauldron = snapshotSim(this.sim, this.cap.size);
saveGame(this.state);
}
}
const SANDBOX_FIRE = { maxFlame: 800, heatPower: 8 };
const ADVICE_SHORT = { whole: 'Whole herbs: crush', window: 'Outside the steep', warm: 'Not steeped yet', steam: 'Steam escaping', stir: 'Uneven: stir' };
const RANK_NEWS = [
'',
'Journeyman: cooling and insight orders arrive, the herbalist sells the common herbs, and the guild offers the Frost Rune (deep cold), the Clockwork Stirrer and the Arcanometer.',
'Adept: strong orders need awakened magic, or a brew boiled down with the lid open, and customers combine two effects. The Moonfen opens, its magic woken by cold; larger cauldrons and the Guild Charter are for sale.',
'Expert: customers combine several effects and techniques in one order. The Ember Crags open; the Glacial Sigil reaches the deepest cold, and the Brass Homunculus brews your recipes.',
'Master: the grandest commissions — several effects, awakened, in exact measure. The Queen’s herald may call.',
'Grand Alchemist: the guild has nothing left to teach you.',
];
function shortTarget(req) {
if (req.key === 'purity') return `<${req.target}`;
if (req.key === 'temperature') return `${Math.round(req.target)}°`;
if (req.kind === 'min') return `≥${Math.round(req.target)}`;
if (req.kind === 'max') return `≤${Math.round(req.target)}`;
if (EFFECT_BY_KEY[req.key]) return `${Math.max(0, Math.round(req.target - req.tol))}–${Math.round(req.target + req.tol)}`;
return req.label.split(' ')[0];
}
function fromValue(key, v) {
const e = new Array(NE).fill(0);
e[EFFECT_INDEX[key]] = v;
return e;
}
function shelfLabels(names) {
const last = names.map((nm) => nm.split(' ').slice(-1)[0]);
return names.map((nm, i) => {
if (last.filter((l) => l === last[i]).length < 2) return last[i];
const words = nm.split(' ');
return words.length > 1 ? words[0] : nm;
});
}
void dominantEffect;
return { VIEWS, LabScreen };
})();
// src/materials/reference.js
const __m83 = (() => {
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
const __m82 = (() => {
const { h, btn } = __m2;
const { Renderer } = __m53;
const { Simulation } = __m31;
const { REF, refLookup } = __m83;
const { hasSave, loadGame } = __m50;
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
const { sandboxIngredients } = __m7;
const { EQUIPMENT } = __m26;
const { loadGame, saveGame, hasSave, deleteSave, loadJSON, saveJSON, KEYS, storageAvailable } = __m50;
const { LabScreen } = __m51;
const { MenuScreen } = __m82;
const { openSettings, openHelp } = __m69;
const { Rng } = __m6;
const { normalizeTrials } = __m27;
const DEFAULT_SETTINGS = { master: 0.8, sfx: 0.8, music: 0.35, musicOn: true, muted: false, quality: 'auto', showFps: false };
const SEED_WORDS = ['amber', 'ashen', 'brine', 'copper', 'dusk', 'elder', 'fen', 'gloam', 'hollow', 'iron', 'juniper', 'kelp', 'lantern', 'moon', 'nettle', 'oak', 'pewter', 'quill', 'raven', 'sage', 'thorn', 'umber', 'vale', 'willow', 'wyrm', 'yarrow'];
class App {
constructor(root) {
this.root = root;
this.settings = loadJSON(KEYS.settings, { ...DEFAULT_SETTINGS });
if (this.settings.musicOn === false) this.settings.music = 0;
this.settings.musicOn = this.settings.music > 0;
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
const tut = /** @type {HTMLInputElement} */ (h('input', { type: 'checkbox', 'aria-label': 'Guided tour' }));
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
h('div', { class: 'small', text: 'The seed generates the world: its ingredients, reactions and customers. The same seed gives the same world.' }),
h('label', { class: 'field' }, 'World seed', seedIn),
h('div', { class: 'toggle-row' }, h('span', { text: 'Guided tour of the shop (recommended)' }), tut)),
],
foot: [btn('Open my shop', go, { cls: 'primary', icon: 'door', act: 'start-game' })],
});
}
startSandbox() {
const saved = loadJSON(KEYS.sandbox, null);
const existing = loadGame().state;
const seed = existing ? existing.seed : saved && saved.seed ? saved.seed : 'experiment';
const st = GameState.create(seed, { tutorial: false });
for (const id of sandboxIngredients(st.world)) st.inventory[id] = Infinity;
st.equipment = EQUIPMENT.map((e) => e.id);
st.reputation = 99999;
st.current = null;
if (saved && saved.seed === seed && saved.cauldron) st.cauldron = saved.cauldron;
if (saved && saved.seed === seed && saved.trials) {
st.trials = normalizeTrials(saved.trials);
st.day = Math.max(st.day, st.colony.day || 1);
st.colony.seed = st.colony.seed || String(seed);
st.restoreRemains();
for (const id of sandboxIngredients(st.world)) st.inventory[id] = Infinity;
}
this._swap(new LabScreen(this, st, { sandbox: true }));
toast('Free Experiment', 'Unlimited reagents, wild ingredients, tools and test subjects. Nothing here affects your shop.', 'flask', 4500);
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
// src/ui/textures.js
const __m84 = (() => {
const { Rng } = __m6;
function texture(w, h, paint) {
const cv = document.createElement('canvas');
cv.width = w; cv.height = h;
const ctx = /** @type {CanvasRenderingContext2D} */ (cv.getContext('2d'));
paint(ctx, (x, y, ww, hh, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, ww, hh); });
return `url(${cv.toDataURL()})`;
}
function installTextures() {
if (typeof document === 'undefined' || document.documentElement.dataset.tex) return;
const rng = new Rng('ui-textures');
const wood = texture(64, 32, (_, R) => {
for (let y = 0; y < 32; y++) {
for (let x = 0; x < 64;) {
const len = rng.int(3, 14), dark = rng.chance(0.5);
if (rng.chance(0.55)) R(x, y, len, 1, dark ? 'rgba(20,10,4,0.16)' : 'rgba(255,220,170,0.07)');
x += len;
}
}
for (let k = 0; k < 2; k++) {
const kx = rng.int(4, 58), ky = rng.int(4, 28);
R(kx - 2, ky, 5, 1, 'rgba(20,10,4,0.22)'); R(kx - 1, ky - 1, 3, 3, 'rgba(20,10,4,0.18)'); R(kx, ky, 1, 1, 'rgba(20,10,4,0.35)');
}
});
const parch = texture(64, 64, (_, R) => {
for (let k = 0; k < 220; k++) R(rng.int(0, 63), rng.int(0, 63), rng.int(1, 3), 1, rng.chance(0.6) ? 'rgba(120,90,50,0.07)' : 'rgba(255,255,240,0.18)');
for (let k = 0; k < 18; k++) R(rng.int(0, 63), rng.int(0, 63), 1, 1, 'rgba(90,60,30,0.16)');
});
const nail = texture(4, 4, (_, R) => {
R(1, 0, 2, 4, 'rgba(18,12,10,0.85)'); R(0, 1, 4, 2, 'rgba(18,12,10,0.85)');
R(1, 1, 2, 2, '#8a8296'); R(1, 1, 1, 1, '#d8d2e0');
});
const root = document.documentElement;
root.style.setProperty('--tex-wood', wood);
root.style.setProperty('--tex-parch', parch);
root.style.setProperty('--nail', nail);
root.dataset.tex = '1';
}
return { installTextures };
})();
// src/main.js
const __m0 = (() => {
const { App } = __m1;
const { installTextures } = __m84;
installTextures();
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