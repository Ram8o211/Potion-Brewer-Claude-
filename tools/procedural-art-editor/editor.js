// Procedural Art Studio: standalone authoring experiment.
 // Uses the actual game visual generator. No game runtime files are changed.
import { describe } from '../../src/visual/descriptor.js';
import { VISUAL_SCHEMA } from '../../src/visual/identity.js';
import { plantFrame, iconFrame, pieceFrame } from '../../src/visual/render.js';
import { FAMILY_OF, HABITATS } from '../../src/visual/taxonomy.js';
import { sceneOf } from '../../src/visual/env/scene.js';

const $ = (id) => document.getElementById(id);
const SIDE = 96;
const stageNames = ['Sprout', 'Ripe', 'Mature'];
const effects = ['arcana', 'vitality', 'strength', 'love', 'fire', 'frost', 'toxicity', 'death', 'transformation', 'acidity'];
const defaultSpec = () => ({
  shape: 'crystal', region: 'netherwood', seed: 314159, color: '#957bc5',
  effect: 'arcana', intensity: 20, glow: 0.4, morph: {},
  layers: {}, components: []
});
let spec = defaultSpec();
let stage = 2, variant = 0, kind = 'plant', mount = 'ground', fragment = 0;
let tool = 'draw', brushSize = 1, ink = '#ddc38c';
let activeComponent = -1, painting = false;
let undo = [], redo = [];
let draggingBefore = null;
const canvas = $('editor'), ctx = canvas.getContext('2d', { willReadFrequently: true });
ctx.imageSmoothingEnabled = false;
const status = (message) => { $('status').textContent = message; };
const clone = (x) => JSON.parse(JSON.stringify(x));
const safeNum = (x, fallback) => Number.isFinite(Number(x)) ? Number(x) : fallback;
const rgb = (hex) => [1, 3, 5].map(i => parseInt(hex.slice(i, i+2), 16) / 255);
const pack = (hex) => (0xff000000 | parseInt(hex.slice(1, 7), 16)) >>> 0;
const unpack = (n) => '#' + (n & 0xffffff).toString(16).padStart(6, '0');
const key = (k = kind, s = stage, v = variant, m = mount, p = fragment) =>
  k === 'plant' ? `plant|${s}|${v}|${m}` : k === 'icon' ? 'icon' : `piece|${p}`;

function identity() {
  const fx = { [spec.effect]: spec.intensity };
  return { v: VISUAL_SCHEMA, key: 'editor-' + spec.shape, shape: spec.shape,
    region: spec.region, origin: 'editor', seed: spec.seed >>> 0, rare: false,
    color: rgb(spec.color), fx, arc: 0, glow: spec.glow };
}
function descriptor() {
  const base = describe(identity());
  return { ...base, m: { ...base.m, ...spec.morph }, pal: base.pal };
}
function generate(k = kind, s = stage, v = variant, m = mount, p = fragment) {
  const d = descriptor();
  return k === 'icon' ? iconFrame(d) :
    k === 'piece' ? { pix: pieceFrame(d, p).pix, ax: 20, ay: 40 } :
      plantFrame(d, s, { variant: v, mount: m });
}
function frameCanvas(k = kind, s = stage, v = variant, m = mount, p = fragment, patches = true) {
  const c = document.createElement('canvas'); c.width = SIDE; c.height = SIDE;
  const x = c.getContext('2d', { willReadFrequently: true });
  x.imageSmoothingEnabled = false;
  const fr = generate(k, s, v, m, p);
  // The artboard uses the native pixel grid. Plant anchors are ground-aligned.
  const dx = k === 'plant' ? Math.round(SIDE/2 - fr.ax) : Math.round((SIDE-fr.pix.w)/2);
  const dy = k === 'plant' ? Math.round(77 - fr.ay) : Math.round((SIDE-fr.pix.h)/2);
  x.drawImage(fr.pix.toCanvas(), dx, dy);
  if (patches) {
    const overlay = spec.layers[key(k,s,v,m,p)] || {};
    for (const [pos, color] of Object.entries(overlay)) {
      const q = Number(pos); if (!Number.isInteger(q) || q<0 || q>=SIDE*SIDE) continue;
      const xx=q%SIDE, yy=(q/SIDE)|0;
      if (color === null) x.clearRect(xx,yy,1,1);
      else if (/^#[0-9a-f]{6}$/i.test(color)) { x.fillStyle = color; x.fillRect(xx,yy,1,1); }
    }
  }
  return c;
}
function mainPreview() {
  const fr = frameCanvas();
  ctx.clearRect(0, 0, SIDE, SIDE);
  ctx.drawImage(fr, 0, 0);
  if ($('showGrid').checked) {
    // Faint major guides at 8 pixel intervals, never baked into exports.
    ctx.save(); ctx.strokeStyle='rgba(208,209,176,.17)'; ctx.lineWidth=.15;
    for (let q=0;q<=SIDE;q+=8) { ctx.beginPath();ctx.moveTo(q+.5,0);ctx.lineTo(q+.5,SIDE);ctx.stroke();ctx.beginPath();ctx.moveTo(0,q+.5);ctx.lineTo(SIDE,q+.5);ctx.stroke(); } ctx.restore();
  }
}
function thumb(c, title, click, selected=false) {
  const b = document.createElement('button'); b.className='thumb' + (selected?' selected':'');
  const view=document.createElement('canvas');view.width=SIDE;view.height=SIDE;
  view.getContext('2d').drawImage(c,0,0);
  const name=document.createElement('span');name.textContent=title;
  b.append(view,name);b.addEventListener('click',click);return b;
}
function previews() {
  const variants=$('variants'); variants.replaceChildren();
  for (let v=0;v<4;v++) {
    variants.append(thumb(frameCanvas('plant',stage,v,mount,0), 'Variant '+(v+1),()=>{variant=v;refresh();}, v===variant));
  }
  const fragments=$('fragments');fragments.replaceChildren();
  fragments.append(thumb(frameCanvas('icon',stage,0,mount,0), 'Icon',()=>{kind='icon';$('frameKind').value=kind;refresh();},kind==='icon'));
  for(let p=0;p<4;p++)fragments.append(thumb(frameCanvas('piece',stage,0,mount,p),'Piece '+(p+1),()=>{kind='piece';fragment=p;$('frameKind').value=kind;refresh();},kind==='piece'&&p===fragment));
  const stages=$('stages');stages.replaceChildren();
  for(let s=0;s<3;s++) {
    const b=document.createElement('button');b.className='stage'+(stage===s?' active':'');
    const view=document.createElement('canvas');view.width=SIDE;view.height=SIDE;
    view.getContext('2d').drawImage(frameCanvas('plant',s,variant,mount,0),0,0);
    const name=document.createElement('span');name.textContent=stageNames[s];
    b.append(view,name);b.onclick=()=>{stage=s;kind='plant';$('frameKind').value=kind;refresh();};stages.append(b);
  }
}
function morphControls(rebuild=false) {
  const parent=$('morphControls');
  if (rebuild) parent.replaceChildren();
  const d=describe(identity());
  const vars=Object.entries(d.m).filter(([name,value])=>typeof value==='number' && Number.isFinite(value));
  if (!rebuild && parent.dataset.shape===spec.shape && parent.dataset.effect===spec.effect) return;
  parent.replaceChildren();
  for(const [name,value] of vars) {
    const label=document.createElement('label');label.textContent=name.replace(/([A-Z])/g,' $1');
    const input=document.createElement('input');input.type='number';input.step='any';
    input.value=String(spec.morph[name]??value);
    input.title='Override generator parameter: '+name;
    input.addEventListener('change',()=>{
      const n=Number(input.value);
      if(!Number.isFinite(n)){input.value=String(spec.morph[name]??value);return;}
      spec.morph[name]=Math.max(-10000,Math.min(10000,n));refresh(false);
    });
    label.append(input);parent.append(label);
  }
  parent.dataset.shape=spec.shape;parent.dataset.effect=spec.effect;
}
function environment() {
  try {
    const env=sceneOf(spec.region,String(spec.seed));
    const target=$('environment');const cx=target.getContext('2d');
    target.width=env.pix.w;target.height=env.pix.h;cx.drawImage(env.pix.toCanvas(),0,0);
  } catch(e) { status('Environment preview error: '+e.message); }
}
function components() {
  const list=$('components');list.replaceChildren();
  if(!spec.components.length) {
    const note=document.createElement('p');note.className='hint';note.textContent='No components saved yet.';list.append(note);return;
  }
  for(let i=0;i<spec.components.length;i++) {
    const comp=spec.components[i];
    const b=document.createElement('button');b.className='component'+(activeComponent===i?' selected':'');
    const c=document.createElement('canvas');c.width=comp.w;c.height=comp.h;
    const d=c.getContext('2d').createImageData(comp.w,comp.h);
    for(let q=0;q<comp.pixels.length;q++) {
      const n=comp.pixels[q]>>>0, j=q*4;
      d.data[j]=n&255;d.data[j+1]=(n>>>8)&255;d.data[j+2]=(n>>>16)&255;d.data[j+3]=n>>>24;
    }
    c.getContext('2d').putImageData(d,0,0);
    const label=document.createElement('div');const strong=document.createElement('strong');strong.textContent=comp.name;
    const small=document.createElement('small');small.textContent=comp.w+' × '+comp.h+' px';
    label.append(strong,small);b.append(c,label);
    b.onclick=()=>{activeComponent=i;setTool('stamp');components();};
    list.append(b);
  }
}
function refresh(rebuildMorph=false, env=false) {
  try { mainPreview();previews();morphControls(rebuildMorph); if(env) environment();components();
    $('effectValue').textContent=spec.intensity; $('glowValue').textContent=spec.glow.toFixed(2);
    status('Rendered '+spec.shape+' · '+spec.region+' · seed '+spec.seed);
  } catch(e) {console.error(e);status('Render error: '+e.message);}
}
function checkpoint(){undo.push(clone(spec.layers));if(undo.length>25)undo.shift();redo=[];}
function point(ev){
  const r=canvas.getBoundingClientRect();
  return {x:Math.floor((ev.clientX-r.left)*SIDE/r.width),y:Math.floor((ev.clientY-r.top)*SIDE/r.height)};
}
function applyPixel(x,y,color) {
  if(x<0||y<0||x>=SIDE||y>=SIDE)return;
  const k=key();if(!spec.layers[k])spec.layers[k]={};
  spec.layers[k][y*SIDE+x]=color;
}
function brush(ev) {
  const {x,y}=point(ev);
  const b=Math.floor(brushSize/2);
  for(let oy=0;oy<brushSize;oy++)for(let ox=0;ox<brushSize;ox++)
    applyPixel(x+ox-b,y+oy-b,tool==='erase'?null:ink);
  mainPreview();
}
function stamp(ev){
  const comp=spec.components[activeComponent];
  if(!comp){status('Select a saved component first.');return;}
  checkpoint();
  const {x,y}=point(ev);
  const ox=x-Math.floor(comp.w/2),oy=y-Math.floor(comp.h/2);
  for(let cy=0;cy<comp.h;cy++)for(let cx=0;cx<comp.w;cx++) {
    const n=comp.pixels[cy*comp.w+cx]>>>0;
    if(n>>>24)applyPixel(ox+cx,oy+cy,unpack(n));
  }
  refresh(false); status('Stamped '+comp.name+' as editable pixels');
}
function setTool(t) {
  tool=t;
  document.querySelectorAll('[data-tool]').forEach(b=>b.classList.toggle('active',b.dataset.tool===t));
}
function picker(ev) {
  const {x,y}=point(ev);if(x<0||y<0||x>=SIDE||y>=SIDE)return;
  const d=frameCanvas().getContext('2d').getImageData(x,y,1,1).data;
  if(d[3]===0)return;
  ink='#'+[d[0],d[1],d[2]].map(x=>x.toString(16).padStart(2,'0')).join('');
  $('ink').value=ink;setTool('draw');status('Picked '+ink);
}
function captureComponent() {
  const data=frameCanvas().getContext('2d').getImageData(0,0,SIDE,SIDE).data;
  let x0=SIDE,y0=SIDE,x1=-1,y1=-1;
  for(let y=0;y<SIDE;y++)for(let x=0;x<SIDE;x++) {
    if(data[(y*SIDE+x)*4+3]>0){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
  }
  if(x1<0){status('Nothing visible to capture.');return;}
  const w=x1-x0+1,h=y1-y0+1,pixels=[];
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++) {
    const q=(y*SIDE+x)*4;
    pixels.push(((data[q+3]<<24)|(data[q+2]<<16)|(data[q+1]<<8)|data[q])>>>0);
  }
  if(spec.components.length>=24){status('Library limit: 24 components');return;}
  const name=$('componentName').value.trim()||'Component '+(spec.components.length+1);
  spec.components.push({name,w,h,pixels});activeComponent=spec.components.length-1;
  components(); status('Captured '+name+' ('+w+' × '+h+'). Select Stamp to reuse.');
}
function download(filename,body,mime) {
  const url=URL.createObjectURL(new Blob([body],{type:mime}));
  const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function syncControls() {
  $('shape').value=spec.shape;$('region').value=spec.region;$('seed').value=spec.seed;
  $('color').value=spec.color;$('effect').value=spec.effect;$('intensity').value=spec.intensity;
  $('glow').value=Math.round(spec.glow*100);
}
function boot() {
  for(const name of Object.keys(FAMILY_OF).sort()) {const o=document.createElement('option');o.value=name;o.textContent=name;$('shape').append(o);}
  for(const name of Object.keys(HABITATS)) {const o=document.createElement('option');o.value=name;o.textContent=name;$('region').append(o);}
  syncControls();
  for(const id of ['shape','region','seed','color','effect','intensity','glow']) {
    $(id).addEventListener(id==='intensity'||id==='glow'?'input':'change',()=>{
      if(id==='shape'){spec.shape=$('shape').value;spec.morph={};}
      if(id==='region')spec.region=$('region').value;
      if(id==='seed')spec.seed=(Math.max(0,safeNum($('seed').value,0))>>>0);
      if(id==='color')spec.color=$('color').value;
      if(id==='effect')spec.effect=$('effect').value;
      if(id==='intensity')spec.intensity=safeNum($('intensity').value,20);
      if(id==='glow')spec.glow=safeNum($('glow').value,40)/100;
      refresh(id==='shape'||id==='effect',id==='region'||id==='seed');
    });
  }
  $('resetMorph').onclick=()=>{spec.morph={};refresh(true);};
  $('regenerate').onclick=()=>{spec.seed=(Math.imul(spec.seed,1664525)+1013904223)>>>0;syncControls();refresh(true,true);};
  $('frameKind').onchange=()=>{kind=$('frameKind').value;refresh();};
  $('mount').onchange=()=>{mount=$('mount').value;refresh();};
  $('ink').oninput=()=>{ink=$('ink').value;};
  $('brush').onchange=()=>{brushSize=Number($('brush').value);};
  $('showGrid').onchange=()=>{mainPreview();};
  document.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>setTool(b.dataset.tool));
  canvas.addEventListener('pointerdown',ev=>{
    if(ev.button!==0 && ev.pointerType==='mouse')return;
    if(tool==='pick'){picker(ev);return;}
    if(tool==='stamp'){stamp(ev);return;}
    checkpoint();painting=true;canvas.setPointerCapture(ev.pointerId);brush(ev);
  });
  canvas.addEventListener('pointermove',ev=>{if(painting)brush(ev);});
  for(const n of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(n,()=>{if(painting){painting=false;refresh(false);}});
  const doUndo=()=>{if(!undo.length)return;redo.push(clone(spec.layers));spec.layers=undo.pop();refresh();};
  const doRedo=()=>{if(!redo.length)return;undo.push(clone(spec.layers));spec.layers=redo.pop();refresh();};
  $('undo').onclick=doUndo;$('redo').onclick=doRedo;
  document.addEventListener('keydown',e=>{
    if(!(e.ctrlKey||e.metaKey)||!['z','y'].includes(e.key.toLowerCase()))return;
    if(e.target instanceof HTMLInputElement && e.target.type!=='range')return;
    e.preventDefault();if(e.key.toLowerCase()==='y'||(e.key.toLowerCase()==='z'&&e.shiftKey))doRedo();else doUndo();
  });
  $('clearFrame').onclick=()=>{checkpoint();delete spec.layers[key()];refresh();};
  $('captureComponent').onclick=captureComponent;
  $('savePNG').onclick=()=>{
    const source=frameCanvas();source.toBlob(b=>{if(b)download('potion-'+spec.shape+'-'+kind+'.png',b,'image/png');},'image/png');
  };
  $('saveJSON').onclick=()=>download('potion-art-project.json',JSON.stringify({schema:1,spec},null,2),'application/json');
  $('importJSON').onclick=()=>$('projectFile').click();
  $('projectFile').onchange=async(e)=>{
    const file=e.target.files?.[0];if(!file)return;
    try {
      if(file.size>5_000_000)throw Error('Project file too large (5 MB max)');
      const data=JSON.parse(await file.text());
      if(data.schema!==1||!data.spec||!Object.hasOwn(FAMILY_OF,data.spec.shape)||!Object.hasOwn(HABITATS,data.spec.region))throw Error('Invalid project schema or form');
      const s=data.spec;
      const loaded=defaultSpec();loaded.shape=s.shape;loaded.region=s.region;
      loaded.seed=(safeNum(s.seed,1)>>>0);loaded.color=/^#[0-9a-f]{6}$/i.test(s.color)?s.color:loaded.color;
      loaded.effect=effects.includes(s.effect)?s.effect:loaded.effect;
      loaded.intensity=Math.max(0,Math.min(35,safeNum(s.intensity,20)));
      loaded.glow=Math.max(0,Math.min(1,safeNum(s.glow,.4)));
      loaded.morph=s.morph&&typeof s.morph==='object'?s.morph:{};
      loaded.layers=s.layers&&typeof s.layers==='object'?s.layers:{};
      loaded.components=Array.isArray(s.components)?s.components.filter(c=>c && c.w>0 && c.h>0 && c.w<=SIDE && c.h<=SIDE && Array.isArray(c.pixels) && c.pixels.length===c.w*c.h).slice(0,24):[];
      spec=loaded;undo=[];redo=[];activeComponent=-1;syncControls();refresh(true,true);
      status('Imported project: '+file.name);
    }catch(error){status('Import failed: '+error.message);}
    e.target.value='';
  };
  refresh(true,true);
}
boot();
