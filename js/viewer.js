import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import bent from './pyramids/bent.js';
import red from './pyramids/red.js';
import khufu from './pyramids/khufu.js';
import khafre from './pyramids/khafre.js';
import menkaure from './pyramids/menkaure.js';
import unas from './pyramids/unas.js';
import djoser from './pyramids/djoser.js';
import sphinx from './pyramids/sphinx.js';
import tut from './pyramids/tut.js';
import seti from './pyramids/seti.js';
import valley from './pyramids/valley.js';

// All models: metres, origin at the centre of the base. +x = east, +y = up, +z = south.
const D = Math.PI / 180;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const up = (p, h) => p.clone().add(V(0, h, 0));   // a point h metres above a floor point
// Photo with its estimated camera position and look-at point (model metres)
const ph = (src, alt, caption, credit, license, url, cam, look) => ({ src: 'photos/' + src, alt, caption, credit, license, url, cam: cam.toArray(), look: look.toArray() });
const css = getComputedStyle(document.documentElement);
const C = n => new THREE.Color(css.getPropertyValue('--' + n).trim());
const COL = { edge: C('edge'), grid1: C('grid1'), grid2: C('grid2'), sand: C('sand'), lime: C('lime'), granite: C('granite'), rock: C('rock'), scan: C('scan'), shaft: C('shaft'), later: C('later'), faience: C('faience'), stage: C('stage'), paint: C('paint'), stone: C('stone'), cedar: C('cedar'), mark: C('mark'), texts: C('texts'), human: C('human') };

// ---------- Scene ----------
const host = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ antialias: true });
// Phones and tablets get lighter shadows; phones also a lower resolution
const lowPower = matchMedia('(pointer: coarse)').matches || Math.min(screen.width, screen.height) < 820;
const phone = Math.min(screen.width, screen.height) < 600;
renderer.setPixelRatio(Math.min(devicePixelRatio, phone ? 1.5 : 2));
renderer.localClippingEnabled = true;
host.appendChild(renderer.domElement);
const labelRenderer = new CSS2DRenderer({ element: document.getElementById('labels') });

const scene = new THREE.Scene();
scene.background = new THREE.Color(css.getPropertyValue('--bg').trim());
scene.fog = new THREE.Fog(scene.background, 900, 3200);
const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 8000);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.12;
controls.rotateSpeed = 0.6;
controls.zoomToCursor = true;   // touch pinch
controls.panSpeed = 1.0;
controls.screenSpacePanning = true;
controls.maxDistance = 2600;
controls.minDistance = 0.05;

const hemi = new THREE.HemisphereLight(0xdfe8ff, 0x3a2a18, 1.1);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff1d6, 1.4);
sun.position.set(200, 300, 120);
sun.shadow.mapSize.set(lowPower ? 2048 : 4096, lowPower ? 2048 : 4096);
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.6;
scene.add(sun, sun.target);
// soft light from the north-east sky, so the faces turned away from the sun stay readable
const fill = new THREE.DirectionalLight(0xdde6f2, 0);
fill.position.set(160, 140, -260);
scene.add(fill);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = lowPower ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
const groundXray = new THREE.MeshBasicMaterial({ color: COL.rock, transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(6000, 6000), groundXray);   // geometry replaced per site
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);
const grid = new THREE.GridHelper(6000, 300, COL.grid1, COL.grid2);
grid.material.transparent = true; grid.material.opacity = 0.9;
scene.add(grid);
const humanMat = new THREE.MeshStandardMaterial({ color: COL.human, emissive: COL.human, emissiveIntensity: 0.15, roughness: 0.7 });
const shellMat = new THREE.MeshBasicMaterial({ color: COL.sand, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide });
// real terrain in the see-through look: lit, so hills and wadis show their shape
const terrainXray = new THREE.MeshLambertMaterial({ color: COL.sand, transparent: true, opacity: 0.38, depthWrite: false, side: THREE.DoubleSide });
const clip = new THREE.Plane(V(-1, 0, 0), 0);

// ---------- Stone look: textures drawn once on canvases, so there are no image files to load ----------
function rng(seed) { let s = seed >>> 0; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296); }
function stoneTexture({ size = 512, tile, base, spread = 0.08, course = [0.7, 1.3], blockW = [0.9, 2.6], joint = 'rgba(60,45,30,.45)', grain = 26, speckle = 0, speckleCols = [], cracks = 0, seed = 1 }) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'), r = rng(seed), px = size / tile, col = new THREE.Color(base);
  g.fillStyle = '#' + col.getHexString(); g.fillRect(0, 0, size, size);
  if (course) {
    // rows of blocks with slightly different tones and dark joints between them
    for (let y = 0; y < size;) {
      let h = (course[0] + r() * (course[1] - course[0])) * px;
      if (y + h > size - course[0] * px * 0.6) h = size - y;
      for (let x = -r() * 2 * px; x < size;) {
        const w = (blockW[0] + r() * (blockW[1] - blockW[0])) * px;
        g.fillStyle = '#' + col.clone().offsetHSL(0, (r() - 0.5) * spread * 0.4, (r() - 0.5) * spread).getHexString();
        g.fillRect(x, y, w, h);
        g.strokeStyle = joint; g.lineWidth = 1.6; g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
        x += w;
      }
      y += h;
    }
  }
  const img = g.getImageData(0, 0, size, size), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const n = (r() - 0.5) * grain; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  g.putImageData(img, 0, 0);
  for (let i = 0; i < speckle; i++) { g.fillStyle = speckleCols[(r() * speckleCols.length) | 0]; const s = 0.6 + r() * 1.4; g.fillRect(r() * size, r() * size, s, s); }
  g.strokeStyle = 'rgba(50,35,20,.3)'; g.lineWidth = 1;
  for (let i = 0; i < cracks; i++) {
    let x = r() * size, y = r() * size; g.beginPath(); g.moveTo(x, y);
    for (let k = 0; k < 6; k++) { x += (r() - 0.5) * 60; y += (r() - 0.5) * 60; g.lineTo(x, y); }
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  t.repeat.set(1 / tile, 1 / tile);   // geometry UVs are in metres
  return t;
}
const TEX = {
  casing: stoneTexture({ tile: 14, base: '#c4ad86', course: [0.55, 1.05], blockW: [1.0, 2.4], spread: 0.12, seed: 3 }),
  lime: stoneTexture({ tile: 6, base: '#d7c7a3', course: [0.5, 1.0], blockW: [0.8, 2.0], spread: 0.06, seed: 5 }),
  granite: stoneTexture({ tile: 6, base: '#7d5a54', course: [1.0, 1.3], blockW: [1.4, 3.0], spread: 0.05, speckle: 14000, speckleCols: ['rgba(40,28,26,.55)', 'rgba(170,135,125,.45)', 'rgba(95,62,56,.5)'], joint: 'rgba(30,15,12,.45)', grain: 18, seed: 7 }),
  rock: stoneTexture({ tile: 8, base: '#a78a62', course: null, cracks: 40, grain: 34, seed: 9 }),
  sand: stoneTexture({ tile: 30, base: '#d8c39a', course: null, grain: 22, seed: 11 }),
};
TEX.texts = (() => {
  // columns of blue signs on limestone: an impression of the Pyramid Texts, not real text
  const size = 512, tile = 2, c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'), r = rng(21), col = 32, w = size / col;
  g.fillStyle = '#d6cbb4'; g.fillRect(0, 0, size, size);
  for (let i = 0; i < col; i++) {
    g.fillStyle = 'rgba(60,70,90,.25)'; g.fillRect(i * w, 0, 1, size);
    for (let y = 4; y < size; y += w * 0.9) {
      if (r() < 0.35) continue;   // leave gaps, like worn or unpainted signs
      g.fillStyle = r() < 0.2 ? 'rgba(40,70,70,.55)' : 'rgba(36,52,82,.6)';
      const cx = i * w + w / 2, k = r();
      if (k < 0.3) g.fillRect(cx - w * 0.3, y, w * 0.6, w * 0.18);
      else if (k < 0.55) { g.beginPath(); g.arc(cx, y + w * 0.3, w * 0.22, 0, Math.PI * 2); g.fill(); }
      else if (k < 0.8) g.fillRect(cx - w * 0.1, y, w * 0.2, w * 0.6);
      else { g.beginPath(); g.moveTo(cx - w * 0.3, y + w * 0.6); g.lineTo(cx + w * 0.05, y); g.lineTo(cx + w * 0.3, y + w * 0.6); g.fill(); }
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  t.repeat.set(1 / tile, 1 / tile);
  return t;
})();
TEX.faience = (() => {
  // small blue-green tiles in rows, set like reed matting, as in Djoser's blue chambers
  const size = 256, tile = 1, c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'), r = rng(31), n = 16, w = size / n;
  g.fillStyle = '#d9cfb8'; g.fillRect(0, 0, size, size);
  for (let i = 0; i < n; i++) for (let j = 0; j < n * 2; j++) {
    g.fillStyle = `hsl(${178 + r() * 14}, ${45 + r() * 15}%, ${38 + r() * 10}%)`;
    g.fillRect(i * w + 1.5, j * w / 2 + 1, w - 3, w / 2 - 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  t.repeat.set(1 / tile, 1 / tile);
  return t;
})();
TEX.paint = (() => {
  // an impression of New Kingdom tomb painting: figures in rows on a yellow ground, between coloured bands
  const size = 512, tile = 3, c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'), r = rng(41);
  g.fillStyle = '#e3b85a'; g.fillRect(0, 0, size, size);
  for (const [y, col] of [[0, '#2f4f6f'], [10, '#a8432c'], [size - 18, '#a8432c'], [size - 8, '#2f4f6f']]) { g.fillStyle = col; g.fillRect(0, y, size, 8); }
  for (let row = 0; row < 2; row++) for (let i = 0; i < 9; i++) {
    const x = 18 + i * 56 + r() * 8, y0 = 40 + row * 230, hgt = 170 + r() * 20;
    g.fillStyle = r() < 0.5 ? '#a4452c' : '#c9894a';                      // skin
    g.fillRect(x + 12, y0 + 22, 16, hgt * 0.42);
    g.beginPath(); g.arc(x + 20, y0 + 14, 10, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#1c1c1c'; g.fillRect(x + 9, y0 + 2, 22, 12);             // wig
    g.fillStyle = '#f2ede0'; g.fillRect(x + 8, y0 + 22 + hgt * 0.42, 24, hgt * 0.36);   // kilt or robe
    g.fillStyle = '#a4452c'; g.fillRect(x + 13, y0 + 22 + hgt * 0.78, 5, hgt * 0.2); g.fillRect(x + 22, y0 + 22 + hgt * 0.78, 5, hgt * 0.2);
    g.fillStyle = 'rgba(40,50,80,.55)';
    for (let k = 0; k < 4; k++) g.fillRect(x + 40, y0 + 6 + k * 14, 8, 8);   // a column of signs
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  t.repeat.set(1 / tile, 1 / tile);
  return t;
})();
TEX.sand.repeat.set(200, 200);       // ground plane is 6 km across with 0–1 UVs
const TEX_FOR = { sand: 'casing', lime: 'lime', granite: 'granite', rock: 'rock', shaft: 'lime', later: 'rock', texts: 'texts', faience: 'faience', paint: 'paint', stone: 'rock' };
const WHITE = new THREE.Color(0xffffff);
const shellStone = new THREE.MeshStandardMaterial({ map: TEX.casing, roughness: 0.95, side: THREE.DoubleSide });
const groundStone = new THREE.MeshStandardMaterial({ map: TEX.sand, roughness: 1, side: THREE.DoubleSide });
const sphinxStone = new THREE.MeshStandardMaterial({ map: TEX.rock, roughness: 1 });
const SKY = (() => {
  const c = document.createElement('canvas'); c.width = 2; c.height = 256;
  const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, '#5d93cf'); gr.addColorStop(0.62, '#a9c8e6'); gr.addColorStop(1, '#efe4cc');
  g.fillStyle = gr; g.fillRect(0, 0, 2, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
})();
const HORIZON = new THREE.Color('#e9dfc8'), PAPER = scene.background.clone();

// UVs in metres, picked per face from its dominant direction, so textures keep a true scale on every block
function worldUV(geo) {
  if (!geo.attributes.normal) geo.computeVertexNormals();
  const p = geo.attributes.position, n = geo.attributes.normal, uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    const [u, v] = ay >= ax && ay >= az ? [p.getX(i), p.getZ(i)] : ax >= az ? [p.getZ(i), p.getY(i)] : [p.getX(i), p.getY(i)];
    uv[2 * i] = u; uv[2 * i + 1] = v;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}
function makeShellGeo(rings, zr = 1) {
  const pos = [], uv = [], corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([x, z]) => [x, z * zr]);
  for (let i = 0; i < rings.length - 1; i++) {
    const [a, ya] = rings[i], [b, yb] = rings[i + 1];
    for (let k = 0; k < 4; k++) {
      const c0 = corners[k], c1 = corners[(k + 1) % 4];
      const vs = [[c0[0] * a, ya, c0[1] * a], [c1[0] * a, ya, c1[1] * a], [c1[0] * b, yb, c1[1] * b], [c0[0] * a, ya, c0[1] * a], [c1[0] * b, yb, c1[1] * b], [c0[0] * b, yb, c0[1] * b]];
      for (const v of vs) { pos.push(...v); uv.push(k % 2 ? v[2] : v[0], v[1]); }   // courses stay horizontal
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.computeVertexNormals();
  return geo;
}
// See-through shading: faces seen head-on are clearer, edges and grazing faces denser, so each volume reads as a solid
function xray(m) {
  m.onBeforeCompile = sh => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <dithering_fragment>', `
      float xr = 1.0 - abs(dot(normalize(normal), normalize(vViewPosition)));
      gl_FragColor.a = clamp(gl_FragColor.a * (0.55 + 1.5 * xr * xr), 0.0, 1.0);
      #include <dithering_fragment>`);
  };
  m.customProgramCacheKey = () => 'xray';
  return m;
}
function setEmissive() {
  const lo = toggles.stone ? 0 : 0.12, hi = toggles.stone ? 0.3 : 0.55;
  for (const [k, m] of Object.entries(ctx.mats)) m.emissiveIntensity = k === ctx.selected ? hi : lo;
}
function applyLook() {
  const stone = toggles.stone;
  for (const [id, m] of Object.entries(ctx.mats)) {
    const f = ctx.byId[id], key = stone && !f.scan && !f.mark ? TEX_FOR[f.color] : null;
    m.map = key ? TEX[key] : null;
    m.color.copy(key ? (id === 'sarcophagus' ? new THREE.Color(0x6a6a6a) : WHITE) : m.userData.col);
    m.transparent = !key; m.opacity = key ? 1 : m.userData.op; m.depthWrite = !!key; m.userData.faded = false;
    m.needsUpdate = true;
  }
  for (const lm of Object.values(ctx.lineMats)) lm.visible = !stone;
  ctx.groups.pyramid.traverse(o => { if (o.isLine || o.isLineSegments) o.visible = !stone; });
  ctx.shell.material = ctx.def.terrain?.dem ? terrainXray : shellMat;
  ctx.shell.visible = !stone;
  for (const grp of [ctx.ext.built, ctx.ext.today]) if (grp) grp.visible = solidVisible(grp.userData.solid, stone, grp.userData.hasToday);
  for (const m of ctx.extra) { m.map = stone ? TEX[m.userData.key] : null; m.color.copy(stone ? new THREE.Color(0xdedede) : m.userData.col); m.needsUpdate = true; }
  sun.castShadow = stone;
  fill.intensity = stone ? 0.75 : 0;
  syncLook();
  ground.material = stone ? groundStone : groundXray;
  grid.visible = !stone;
  hemi.intensity = stone ? 0.9 : 1.1; sun.intensity = stone ? 2.4 : 1.4;
  sun.position.set(stone ? -220 : 200, 260, stone ? 180 : 120).normalize().multiplyScalar(900);   // low western sun gives each face its own shade
  scene.background = stone ? SKY : PAPER;
  scene.fog.color.copy(stone ? HORIZON : PAPER);
  ctx.surround?.traverse(o => { if (o.userData.solid !== undefined) o.visible = solidVisible(o.userData.solid, stone, o.userData.hasToday); });
  for (const g of Object.values(ctx.groups)) for (const o of g.children) if (o.userData.solid !== undefined) o.visible = solidVisible(o.userData.solid, stone, !!ctx.ext.today) && (!o.userData.cap || toggles.cut);
  syncRecesses(true);
  document.getElementById('opacity').disabled = stone;
  setEmissive();
}

// ---------- Exteriors: smooth white casing as built, or the weathered stepped core seen today ----------
TEX.tura = stoneTexture({ tile: 14, base: '#e9e2d0', course: [1.0, 1.5], blockW: [1.5, 3.0], spread: 0.03, joint: 'rgba(90,80,60,.16)', grain: 12, seed: 13 });
TEX.sphinx = stoneTexture({ tile: 8, base: '#c9a675', course: [0.4, 1.3], blockW: [40, 60], spread: 0.2, joint: 'rgba(90,65,35,.3)', grain: 30, cracks: 40, seed: 17 });   // bands of bedrock
TEX.core = stoneTexture({ tile: 9, base: '#bea47b', course: [3, 3], blockW: [0.7, 2.0], spread: 0.16, joint: 'rgba(70,52,30,.5)', grain: 30, cracks: 25, seed: 15 });
function exteriorMats() {
  const m = {
    tura: new THREE.MeshStandardMaterial({ map: TEX.tura, roughness: 0.7, side: THREE.DoubleSide }),
    core: new THREE.MeshStandardMaterial({ map: TEX.core, roughness: 1, side: THREE.DoubleSide }),
    redCore: new THREE.MeshStandardMaterial({ map: TEX.core, color: '#e6ad8f', roughness: 1, side: THREE.DoubleSide }),
    granite: new THREE.MeshStandardMaterial({ map: TEX.granite, roughness: 0.85, side: THREE.DoubleSide }),
    weathered: new THREE.MeshStandardMaterial({ map: TEX.casing, roughness: 0.95, side: THREE.DoubleSide }),
    oldCasing: new THREE.MeshStandardMaterial({ map: TEX.tura, color: '#d6c39d', roughness: 0.85, side: THREE.DoubleSide }),
    bedrock: new THREE.MeshStandardMaterial({ map: TEX.sphinx, roughness: 1, side: THREE.DoubleSide }),
    hillside: new THREE.MeshStandardMaterial({ map: TEX.rock, color: '#e3cfae', roughness: 1, side: THREE.DoubleSide }),
  };
  for (const x of Object.values(m)) x.clipShadows = true;
  return m;
}
const MAIN_MATS = exteriorMats(), NEIGHBOUR_MATS = exteriorMats();   // neighbours are never cut away
const CAP_MATS = { core: new THREE.MeshStandardMaterial({ map: TEX.core, color: 0xe8dcc4, roughness: 1, side: THREE.DoubleSide }), rock: new THREE.MeshStandardMaterial({ map: TEX.rock, color: 0xcbb89a, roughness: 1, side: THREE.DoubleSide }) };
// How each pyramid looks today. Heights are published; the stepped core is drawn with typical course heights.
const TODAY = {
  khufu: { top: 138.5, courses: [1.45, 0.55] },
  khafre: { top: 136.4, courses: [1.25, 0.6], capFrom: 100 },              // casing survives on the top third
  menkaure: { top: 61, courses: [1.0, 0.6], baseTo: 8, baseMat: 'granite' }, // 7 of the granite courses survive
  red: { top: 104, courses: [0.9, 0.55], core: 'redCore' },
  bent: { smooth: true },                                                   // most of its casing is still in place
  djoser: { smooth: true },                                                 // steps weathered, casing mostly gone
};
// A sculpted monument (the Sphinx) gives its own pieces; they are merged once into one surface
function shapeGeo(def) {
  if (!def._shape) { const g = mergeGeometries(def.shape().map(x => x.index ? x.toNonIndexed() : x)); worldUV(g); def._shape = g; }
  return def._shape;
}
// ---------- Rock-cut tombs: a hillside above the tomb instead of a pyramid ----------
// def.terrain: { size: [w, d], center: [x, z], step, h(x, z): height of the ground, holes: [[x, z], ...] polygons
// left open (cut entrances) }. Flat valley floor is left to the ground plane, which gets the same holes.
const inPoly = (x, z, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, zi] = poly[i], [xj, zj] = poly[j]; if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) c = !c; } return c; };
const inHole = (def, x, z) => (def.terrain.holes ?? []).some(p => inPoly(x, z, p));
function terrainGeo(def) {
  if (def._terrain) return def._terrain;
  const T = def.terrain, [w, d] = T.size, [cx, cz] = T.center ?? [0, 0], step = T.step ?? 2;
  const nx = Math.ceil(w / step), nz = Math.ceil(d / step), pos = [], idx = [];
  for (let i = 0; i <= nx; i++) for (let k = 0; k <= nz; k++) { const x = cx - w / 2 + i * step, z = cz - d / 2 + k * step; pos.push(x, T.h(x, z), z); }
  const at = (i, k) => i * (nz + 1) + k, y = n => pos[3 * n + 1];
  for (let i = 0; i < nx; i++) for (let k = 0; k < nz; k++) {
    const a = at(i, k), b = at(i + 1, k), c = at(i + 1, k + 1), e = at(i, k + 1);
    if (!T.dem && Math.max(y(a), y(b), y(c), y(e)) < 0.02) continue;
    if ([a, b, c, e].some(n => inHole(def, pos[3 * n], pos[3 * n + 2])) || inHole(def, (pos[3 * a] + pos[3 * c]) / 2, (pos[3 * a + 2] + pos[3 * c + 2]) / 2)) continue;
    idx.push(a, e, c, a, c, b);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
  g.computeVertexNormals(); worldUV(g);
  return (def._terrain = g);
}
const customGeo = def => def.shape ? shapeGeo(def) : def.terrain ? terrainGeo(def) : null;
// Ground plane, with the tomb entrances cut out of it where there are any
const plainGround = new THREE.PlaneGeometry(6000, 6000);
function groundGeo(def) {
  const holes = def.terrain?.holes;
  if (!holes?.length) return plainGround;
  const sh = new THREE.Shape([[-3000, -3000], [3000, -3000], [3000, 3000], [-3000, 3000]].map(([x, y]) => new THREE.Vector2(x, y)));
  for (const h of holes) sh.holes.push(new THREE.Path(h.map(([x, z]) => new THREE.Vector2(x, -z))));
  const g = new THREE.ShapeGeometry(sh), p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + 3000) / 6000, (p.getY(i) + 3000) / 6000);
  return g;
}
function frustumGeo(rings, y0, y1, inset = 0) {
  const rs = [[halfAt(rings, y0) - inset, y0], ...rings.filter(([, y]) => y > y0 && y < y1).map(([r, y]) => [r - inset, y]), [Math.max(0, halfAt(rings, y1) - inset), y1]];
  return makeShellGeo(rs);
}
function capGeo(r, y) { const g = new THREE.PlaneGeometry(2 * r, 2 * r); g.rotateX(-Math.PI / 2); g.translate(0, y, 0); worldUV(g); return g; }
// Hollow stepped surface: a vertical riser and a flat tread for every course, set back from the casing line.
// holes: openings to leave out, as { k: side (0 N, 1 E, 2 S, 3 W), u0, u1: span along the side, y0, y1 }
function stepGeo(rings, y0, y1, courses, inset = 1.0, seed = 5, holes = []) {
  const pos = [], uv = [], r = rng(seed), top = rings[rings.length - 1][1];
  const quad = (a, b, c, d, ua, ub, uc, ud) => { pos.push(...a, ...b, ...c, ...a, ...c, ...d); uv.push(...ua, ...ub, ...uc, ...ua, ...uc, ...ud); };
  const SP = [(rr, u, yy) => [u, yy, -rr], (rr, u, yy) => [rr, yy, u], (rr, u, yy) => [u, yy, rr], (rr, u, yy) => [-rr, yy, u]];
  const DIR = [1, 1, -1, -1];   // each side runs corner to corner in this direction along u
  const spans = (k, R, ya, yb) => {
    let s = [[-R, R]];
    for (const h of holes) if (h.k === k && h.y1 > ya && h.y0 < yb) s = s.flatMap(([l, q]) => h.u1 <= l || h.u0 >= q ? [[l, q]] : [[l, h.u0], [h.u1, q]].filter(([x0, x1]) => x1 - x0 > 0.01));
    return s.map(([l, q]) => DIR[k] > 0 ? [l, q] : [q, l]);
  };
  let y = y0, R = Math.max(0.5, halfAt(rings, y0) - inset);
  while (y < y1 - 0.01) {
    let h = (courses[0] + (courses[1] - courses[0]) * (y / top)) * (0.85 + r() * 0.3);
    if (y + h > y1 - 0.2) h = y1 - y;
    const Rn = Math.max(0.5, halfAt(rings, y + h) - inset), ci = u => Math.max(-Rn, Math.min(Rn, u));
    for (let k = 0; k < 4; k++) {
      const P = SP[k];
      for (const [ua, ub] of spans(k, R, y, y + h)) quad(P(R, ua, y), P(R, ub, y), P(R, ub, y + h), P(R, ua, y + h), [ua, y], [ub, y], [ub, y + h], [ua, y + h]);
      for (const [ua, ub] of spans(k, R, y + h - 0.01, y + h + 0.01)) {
        const pts = [P(R, ua, y + h), P(R, ub, y + h), P(Rn, ci(ub), y + h), P(Rn, ci(ua), y + h)];
        quad(...pts, ...pts.map(p => [p[0], p[2]]));
      }
    }
    y += h; R = Rn;
  }
  quad([-R, y, -R], [R, y, -R], [R, y, R], [-R, y, R], [-R, -R], [R, -R], [R, R], [-R, R]);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.computeVertexNormals();
  return geo;
}
function exteriorGroups(def, neighbour = false, holes = []) {
  const M = neighbour ? NEIGHBOUR_MATS : MAIN_MATS, built = new THREE.Group(), today = new THREE.Group();
  const add = (grp, geo, mat) => { const m = new THREE.Mesh(geo, mat); m.castShadow = m.receiveShadow = true; grp.add(m); };
  const top = def.rings[def.rings.length - 1][1];
  if (def.shape || def.terrain) { add(built, customGeo(def), def.terrain?.dem ? M.hillside : M.bedrock); built.userData.solid = 'built'; return { built, today: null }; }
  if (def.id === 'menkaure') { add(built, frustumGeo(def.rings, 0, 20), M.granite); add(built, frustumGeo(def.rings, 20, top), M.tura); }   // lowest 16 courses were granite
  else add(built, makeShellGeo(def.rings, def.zr), M.tura);
  const t = TODAY[def.id];
  if (t?.smooth) add(today, makeShellGeo(def.rings, def.zr), M.weathered);
  else if (t) {
    if (t.baseTo) add(today, frustumGeo(def.rings, 0, t.baseTo), M[t.baseMat]);
    add(today, stepGeo(def.rings, t.baseTo ?? 0, t.capFrom ?? t.top, t.courses, 1.0, 5, holes), M[t.core ?? 'core']);
    if (t.capFrom) { add(today, frustumGeo(def.rings, t.capFrom, t.top), M.oldCasing); add(today, capGeo(halfAt(def.rings, t.top), t.top), M.oldCasing); }
  }
  built.userData.solid = 'built'; built.userData.hasToday = !!t;
  today.userData.solid = 'today';
  return { built, today: t ? today : null };
}
function extraMat(color, key) {
  const m = new THREE.MeshStandardMaterial({ color, roughness: 0.85 });
  m.userData = { col: m.color.clone(), key };
  ctx.extra.push(m);
  return m;
}
const solidVisible = (s, stone, hasToday) => s === 'door' ? !(stone && toggles.today && hasToday) : s === false ? !stone : s === 'today' ? stone && toggles.today : s === 'built' ? stone && !(toggles.today && hasToday) : stone;

// ---------- Building helpers (act on the pyramid being built) ----------
let ctx = null;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function put(id, mesh, edges = true, edgeGeo = null) {
  mesh.userData.fid = id;
  if (mesh.isMesh && !mesh.geometry.userData.uv) { worldUV(mesh.geometry); mesh.geometry.userData.uv = true; }
  mesh.castShadow = mesh.receiveShadow = true;
  ctx.groups[id].add(mesh);
  ctx.pickables.push(mesh);
  if (edges) {
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(edgeGeo ?? mesh.geometry, 20), lineMat(id));
    e.position.copy(mesh.position); e.quaternion.copy(mesh.quaternion);
    ctx.groups[id].add(e);
  }
  return mesh;
}
function lineMat(id) {
  return ctx.lineMats[id] ??= new THREE.LineBasicMaterial({ color: COL[ctx.byId[id].color].clone().multiplyScalar(0.62) });
}
// Local frame for a passage running from a to b (floor centreline)
function frame(a, b) {
  const dir = b.clone().sub(a); const len = dir.length(); dir.normalize();
  // "up" for the passage: world up with the along-passage part removed
  const n = V(0, 1, 0).addScaledVector(dir, -dir.y);
  if (n.lengthSq() < 1e-6) n.set(0, 0, -1);
  n.normalize();
  const x = new THREE.Vector3().crossVectors(n, dir);
  return { dir, len, n, x, q: new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, n, dir)) };
}
// A box with slightly rounded edges, so light catches the corners; outlined along the plain box edges
function softBox(id, w, h, d, mat) {
  const r = Math.min(0.06, Math.min(w, h, d) * 0.12);
  const m = new THREE.Mesh(r > 0.01 ? new RoundedBoxGeometry(w, h, d, 2, r) : new THREE.BoxGeometry(w, h, d), mat ?? ctx.mats[id]);
  m.userData.edgeGeo = new THREE.BoxGeometry(w, h, d);
  return m;
}
// ---------- Where passages meet the outer face ----------
// Passages are trimmed flush with the face, and the opening is drawn as a dark doorway. In the "today" look
// the casing is gone, so the opening is cut back into the stepped core: the steps get a hole, and a short
// dark recess sits behind it.
const CORE_DEPTH = 2.2;   // how far in (horizontally) the opening sits in the stepped core
const doorMat = new THREE.MeshBasicMaterial({ color: 0x2b2117, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
const recessMat = new THREE.MeshBasicMaterial({ color: 0x241b12, side: THREE.BackSide });
const doorRimMat = new THREE.LineBasicMaterial({ color: 0x5a4527 });
const SIDE_OF = n => n.z < -0.5 ? 0 : n.x > 0.5 ? 1 : n.z > 0.5 ? 2 : 3;   // north, east, south, west
function faceAt(p) {
  // outward horizontal direction of the face nearest to p, and the face's slope there
  const rings = ctx.def.rings, hz = Math.abs(p.x) > Math.abs(p.z) ? V(Math.sign(p.x), 0, 0) : V(0, 0, Math.sign(p.z) || -1);
  let s = 0;
  for (let i = 0; i < rings.length - 1; i++) if (p.y <= rings[i + 1][1] || i === rings.length - 2) { s = (rings[i][0] - rings[i + 1][0]) / (rings[i + 1][1] - rings[i][1]); break; }
  return { hz, n: hz.clone().add(V(0, s, 0)).normalize(), u: V(0, 1, 0).addScaledVector(hz, -s).normalize() };
}
// If p lies on the outer face and the passage runs inward from it, the face plane there (q, n)
function faceEnd(p, inward) {
  if (ctx.def.shape || ctx.def.terrain || (ctx.def.zr ?? 1) !== 1) return null;
  const rings = ctx.def.rings, top = rings[rings.length - 1][1];
  if (p.y < -0.05 || p.y > top) return null;
  const r = halfAt(rings, Math.max(0, p.y)), m = Math.max(Math.abs(p.x), Math.abs(p.z));
  if (Math.abs(m - r) > 0.8) return null;
  const F = faceAt(p);
  if (inward.dot(F.n) > -0.2) return null;
  const q = p.clone().addScaledVector(F.hz, r - m);
  const T = TODAY[ctx.def.id];
  const stepped = !!(T && !T.smooth && p.y < (T.capFrom ?? T.top) && p.y >= (T.baseTo ?? 0) - 0.01);
  return { ...F, q, stepped };
}
// A passage-shaped box from a to b, with either end trimmed onto a plane {p, n} (projected along the passage)
function cutBox(a, b, w, h, cutA, cutB) {
  const f = frame(a, b), geo = new THREE.BoxGeometry(w, h, f.len);
  const pos = geo.attributes.position, v = new THREE.Vector3();
  const centre = a.clone().addScaledVector(f.dir, f.len / 2).addScaledVector(f.n, h / 2);
  const toWorld = new THREE.Matrix4().compose(centre, f.q, V(1, 1, 1)), toLocal = toWorld.clone().invert();
  for (let i = 0; i < pos.count; i++) {
    const cut = pos.getZ(i) < 0 ? cutA : cutB;
    if (!cut) continue;
    v.fromBufferAttribute(pos, i).applyMatrix4(toWorld);
    v.addScaledVector(f.dir, -v.clone().sub(cut.p).dot(cut.n) / f.dir.dot(cut.n));
    v.applyMatrix4(toLocal);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo);
  m.position.copy(centre); m.quaternion.copy(f.q);
  return m;
}
const innerPlane = (e, d) => ({ p: e.q.clone().addScaledVector(e.hz, -d), n: e.n });
function passage(id, a, b, w, h) {
  const f = frame(a, b), inward = f.dir;
  const ea = faceEnd(a, inward), eb = faceEnd(b, inward.clone().negate());
  if (!ea && !eb) {
    const m = softBox(id, w, h, f.len);
    m.quaternion.copy(f.q);
    m.position.copy(a).addScaledVector(f.dir, f.len / 2).addScaledVector(f.n, h / 2);
    return put(id, m, true, m.userData.edgeGeo);
  }
  // trimmed at the face; where the core is stepped today, the last stretch is a separate piece that hides in that look
  const cut = e => e && (e.stepped ? innerPlane(e, CORE_DEPTH + 0.3) : { p: e.q, n: e.n });
  const m = cutBox(a, b, w, h, cut(ea), cut(eb));
  m.material = ctx.mats[id];
  put(id, m);
  for (const [e, end, dir] of [[ea, a, inward], [eb, b, inward.clone().negate()]]) {
    if (!e) continue;
    ctx.faceEnds.push({ id, p: end, e, dir, w, h, n: f.n });
    if (!e.stepped) continue;
    const reach = (CORE_DEPTH + 3) / Math.max(0.2, -dir.dot(e.hz));
    const collar = cutBox(end.clone().addScaledVector(dir, -2), end.clone().addScaledVector(dir, reach), w, h, { p: e.q, n: e.n }, innerPlane(e, CORE_DEPTH + 0.3));
    collar.material = ctx.mats[id];
    put(id, collar);
    collar.userData.solid = 'door';
    ctx.collars.push(collar);
  }
  return m;
}
function room(id, x0, x1, y0, y1, s0, s1, mat) {
  const m = softBox(id, x1 - x0, y1 - y0, s1 - s0, mat);
  m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (s0 + s1) / 2);
  return put(id, m, true, m.userData.edgeGeo);
}
// The doorway itself: a dark opening on the face plane with a thin rim (hidden in "today" where the casing is gone),
// and for the stepped core a dark recess plus a hole in the steps
function doorway(id, p, dir, w, h, pn) {
  ctx.doors.push(p.clone());
  const e = faceEnd(p, dir.clone().negate()) ?? { ...faceAt(p), q: p.clone(), stepped: false };
  const { hz, n, u, q: fq } = e;
  const t = new THREE.Vector3().crossVectors(u, n);
  const c = p.clone().addScaledVector(pn ?? V(0, 1, 0), h / 2);
  const k = dir.dot(n);
  if (Math.abs(k) > 1e-3) c.addScaledVector(dir, -c.clone().sub(fq).dot(n) / k);   // slide the centre onto the face plane
  const hh = Math.min(h / Math.max(0.3, Math.abs(k)), h * 3);
  const geo = new THREE.PlaneGeometry(w, hh); geo.userData.uv = true;
  const rot = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(t, u, n));
  const face = new THREE.Group(); if (e.stepped) face.userData.solid = 'door';
  const hole = new THREE.Mesh(geo, doorMat); hole.position.copy(c).addScaledVector(n, 0.03); hole.quaternion.copy(rot);
  hole.userData.fid = id; hole.renderOrder = 12; face.add(hole); ctx.pickables.push(hole);
  const rim = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(w + 0.3, hh + 0.3)), doorRimMat);
  rim.position.copy(hole.position); rim.quaternion.copy(rot); face.add(rim);
  ctx.groups[id].add(face);
  if (!e.stepped) return;
  const inward = dir.clone().negate(), reach = (CORE_DEPTH + 3) / Math.max(0.2, inward.dot(hz.clone().negate()));
  const recess = cutBox(p.clone().addScaledVector(inward, -2), p.clone().addScaledVector(inward, reach), w + 0.1, h + 0.1, { p: fq.clone().addScaledVector(hz, 0.2), n }, innerPlane(e, CORE_DEPTH));
  recess.material = recessMat;
  recess.userData.solid = 'today';
  ctx.groups[id].add(recess);
  // when you stand in the doorway, the recess gives way to the passage itself
  const near = new THREE.Box3().setFromObject(recess).expandByScalar(4);
  ctx.recesses.push({ recess, near, collars: ctx.collars.filter(c => new THREE.Box3().setFromObject(c).intersectsBox(near)), inside: false });
  // the hole in the steps covers where the recess passes through the core
  const box = new THREE.Box3().setFromObject(recess), side = SIDE_OF(hz), along = side % 2 ? 'z' : 'x';
  ctx.holes.push({ k: side, u0: box.min[along] - 0.05, u1: box.max[along] + 0.05, y0: box.min.y - 0.05, y1: box.max.y + 0.05 });
}
function fadeInside() {
  const stone = toggles.stone, p = camera.position;
  ctx.boxes ??= Object.fromEntries(Object.entries(ctx.groups).filter(([id]) => id !== 'pyramid' && ctx.mats[id]).map(([id, g]) => [id, g.children.filter(o => o.isMesh).map(o => new THREE.Box3().setFromObject(o).expandByScalar(0.05))]));
  for (const [id, boxes] of Object.entries(ctx.boxes)) {
    const m = ctx.mats[id], inside = !stone && boxes.some(b => b.containsPoint(p));
    if (inside === !!m.userData.faded) continue;
    m.userData.faded = inside;
    m.opacity = inside ? 0.05 : m.userData.op;
  }
}
function syncRecesses(force) {
  for (const r of ctx.recesses) {
    const inside = r.near.containsPoint(camera.position);
    if (inside === r.inside && !force) continue;
    r.inside = inside;
    const stone = toggles.stone, hasToday = !!ctx.ext.today;
    r.recess.visible = solidVisible('today', stone, hasToday) && !inside;
    for (const c of r.collars) c.visible = solidVisible('door', stone, hasToday) || inside;
  }
}
// ---------- Scanned models ----------
// def.scan: a scan that replaces a monument's hand-made shape (scaled, turned and moved into place).
// def.interiorScan: a scan of a room, shown in place of the drawn room while you are inside it.
const gltfLoader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
const scanCache = {};
const loadScan = url => scanCache[url] ??= new Promise((res, rej) => gltfLoader.load(url, g => res(g.scene), undefined, rej));
function placeScan(scene, s) {
  const inner = scene.clone(true); inner.position.set(...s.centre.map(v => -v));
  const turn = new THREE.Group(); turn.rotation.y = s.rotY ?? 0; turn.add(inner);
  const place = new THREE.Group(); place.scale.set(...(s.scale ?? [1, 1, 1])); place.position.set(...(s.at ?? [0, 0, 0])); place.add(turn);
  return place;
}
function addScans(def) {
  const c = ctx;
  if (def.scan) loadScan(def.scan.url).then(scene => {
    if (ctx !== c) return;
    const base = def.scan.keepAbove != null ? [new THREE.Plane(V(0, 1, 0), -def.scan.keepAbove)] : [];
    // solid: the scan with its own texture
    const solid = placeScan(scene, def.scan);
    solid.traverse(o => { if (!o.isMesh) return;
      o.material = o.material.clone(); Object.assign(o.material, { metalness: 0, roughness: 1, side: THREE.DoubleSide }); o.material.clipShadows = true;
      if (def.scan.tint) o.material.color.setRGB(...def.scan.tint);   // e.g. warm a bronze cast to the colour of limestone
      o.material.userData.baseClip = base; o.material.clippingPlanes = base; o.castShadow = o.receiveShadow = true; });
    ctx.ext.built.clear(); ctx.ext.built.add(solid);
    // see-through: the same surface, faint and lit, so its shape still reads
    const glass = placeScan(scene, def.scan);
    glass.traverse(o => { if (!o.isMesh) return;
      o.material = new THREE.MeshLambertMaterial({ map: o.material.map, color: 0xf3e6cc, transparent: true, opacity: 0.4, depthWrite: false, side: THREE.DoubleSide });
      o.material.userData.baseClip = base; o.material.clippingPlanes = base; o.renderOrder = 10; });
    ctx.groups.pyramid.remove(ctx.shell); ctx.shell = glass; ctx.groups.pyramid.add(glass);
    applyToggles();
  }).catch(e => console.warn('Scan did not load', e));
  if (def.interiorScan) loadScan(def.interiorScan.url).then(scene => {
    if (ctx !== c) return;
    const s = def.interiorScan, g = placeScan(scene, s);
    const clip = (s.clip ?? []).map(([nx, ny, nz, d]) => new THREE.Plane(V(nx, ny, nz), d));
    g.traverse(o => { if (o.isMesh) { o.material = new THREE.MeshBasicMaterial({ map: o.material.map, side: THREE.DoubleSide, clippingPlanes: clip }); } });
    g.visible = false;
    ctx.root.add(g);
    ctx.interior = { g, box: new THREE.Box3(V(...s.box[0]), V(...s.box[1])), hides: s.hides, inside: false };
  }).catch(e => console.warn('Scan did not load', e));
}
// Inside a scanned room: show the scan and hide the drawn room it replaces
function syncInterior() {
  const it = ctx.interior; if (!it) return;
  const inside = it.box.containsPoint(camera.position);
  if (inside === it.inside) return;
  it.inside = inside; it.g.visible = inside;
  if (inside) for (const id of it.hides) ctx.groups[id].visible = false; else applyToggles();
  refreshLabels();
}
function addDoorways() {
  for (const d of ctx.faceEnds) {
    if (ctx.doors.some(q => q.distanceTo(d.p) < 1.5)) continue;
    doorway(d.id, d.p, d.dir.clone().negate(), d.w, d.h, d.n);
  }
  // rebuild the stepped "today" exterior with holes where the openings are
  if (ctx.holes.length && ctx.ext.today) {
    const visible = ctx.ext.today.visible;
    ctx.groups.pyramid.remove(ctx.ext.today);
    ctx.ext.today = exteriorGroups(ctx.def, false, ctx.holes).today;
    ctx.ext.today.visible = visible;
    ctx.groups.pyramid.add(ctx.ext.today);
  }
}
// Pointed roof with its ridge running east–west (or north–south when ridgeNS)
function gabledRoom(id, x0, x1, y0, wallH, peakH, s0, s1, ridgeNS = false) {
  const [a0, a1] = ridgeNS ? [x0, x1] : [s0, s1];
  const sh = new THREE.Shape();
  sh.moveTo(a0, y0); sh.lineTo(a1, y0); sh.lineTo(a1, y0 + wallH); sh.lineTo((a0 + a1) / 2, y0 + peakH); sh.lineTo(a0, y0 + wallH); sh.closePath();
  const depth = ridgeNS ? s1 - s0 : x1 - x0;
  const m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: false }), ctx.mats[id]);
  if (ridgeNS) m.position.set(0, 0, s0);
  else { m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(V(0, 0, 1), V(0, 1, 0), V(-1, 0, 0))); m.position.set(x1, 0, 0); }
  return put(id, m);
}
// Corbelled room: vertical walls, then courses that each step inward (insetX / insetS per side)
function corbelRoom(id, x0, x1, y0, s0, s1, totalH, wallH, steps, insetX, insetS) {
  room(id, x0, x1, y0, y0 + wallH, s0, s1);
  const h = (totalH - wallH) / steps;
  for (let i = 1; i <= steps; i++) {
    const y = y0 + wallH + (i - 1) * h;
    room(id, x0 + insetX * i, x1 - insetX * i, y, y + h, s0 + insetS * i, s1 - insetS * i);
  }
}
// Thin shaft or tunnel along a polyline, plus a 1px line so it stays visible from afar
function route(id, pts, w, h) {
  for (let i = 0; i < pts.length - 1; i++) passage(id, pts[i], pts[i + 1], w, h);
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat(id));
  line.userData.fid = id;
  ctx.groups[id].add(line); ctx.pickables.push(line);
}
// A photograph of an inscribed wall, recoloured like the real walls (signs filled dark blue on pale limestone)
const wallTexCache = {};
function wallTexture(file, { recolor = true, crop = null } = {}) {
  const key = file + recolor + crop;
  if (wallTexCache[key]) return wallTexCache[key];
  const c = document.createElement('canvas'), t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const img = new Image();
  img.onload = () => {
    if (!recolor) {
      // natural colours; optionally just one part of the picture
      const [a, b, c2, d2] = crop ?? [0, 0, 1, 1];
      const sx = a * img.width, sy = b * img.height, sw = (c2 - a) * img.width, sh = (d2 - b) * img.height;
      c.width = Math.min(1400, Math.round(sw)); c.height = Math.round(sh * c.width / sw);
      c.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, c.width, c.height);
      t.needsUpdate = true;
      return;
    }
    // trim the dark borders of the old photographs
    const probe = document.createElement('canvas'); probe.width = img.width; probe.height = img.height;
    const pg = probe.getContext('2d'); pg.drawImage(img, 0, 0);
    const pd = pg.getImageData(0, 0, img.width, img.height).data;
    const lum = (x, y) => { const i = (y * img.width + x) * 4; return (pd[i] + pd[i + 1] + pd[i + 2]) / 765; };
    const rowDark = y => { let t = 0; for (let x = 0; x < img.width; x += 8) t += lum(x, y); return t / (img.width / 8) < 0.22; };
    const colDark = x => { let t = 0; for (let y = 0; y < img.height; y += 8) t += lum(x, y); return t / (img.height / 8) < 0.22; };
    let x0 = 0, x1 = img.width - 1, y0 = 0, y1 = img.height - 1;
    while (y0 < y1 && rowDark(y0)) y0++; while (y1 > y0 && rowDark(y1)) y1--;
    while (x0 < x1 && colDark(x0)) x0++; while (x1 > x0 && colDark(x1)) x1--;
    const sw = x1 - x0 + 1, sh = y1 - y0 + 1;
    const w = Math.min(1400, sw), h = Math.round(sh * w / sw);
    c.width = w; c.height = h;
    const g = c.getContext('2d'); g.drawImage(img, x0, y0, sw, sh, 0, 0, w, h);
    const d = g.getImageData(0, 0, w, h), px = d.data;
    // a blurred copy finds large dark areas (doorways, deep shadow), which are not signs
    const bw = Math.max(2, Math.round(w / 40)), bh = Math.max(2, Math.round(h / 40));
    const small = document.createElement('canvas'); small.width = bw; small.height = bh;
    small.getContext('2d').drawImage(c, 0, 0, bw, bh);
    const blur = document.createElement('canvas'); blur.width = w; blur.height = h;
    const bg = blur.getContext('2d'); bg.drawImage(small, 0, 0, w, h);
    const bd = bg.getImageData(0, 0, w, h).data;
    const ink = [36, 52, 82], stone = [214, 203, 180], gap = [43, 33, 23];
    for (let i = 0; i < px.length; i += 4) {
      const l = (px[i] * 0.3 + px[i + 1] * 0.59 + px[i + 2] * 0.11) / 255;
      const m = (bd[i] * 0.3 + bd[i + 1] * 0.59 + bd[i + 2] * 0.11) / 255;
      const k = Math.min(1, Math.max(0, (l - 0.25) / 0.45));   // dark carved signs -> ink, light stone -> stone
      const open = Math.min(1, Math.max(0, (0.24 - m) / 0.08)) * (l < 0.3 ? 1 : 0);   // inside a big dark area -> opening
      for (let j = 0; j < 3; j++) px[i + j] = (ink[j] + (stone[j] - ink[j]) * k) * (1 - open) + gap[j] * open;
    }
    g.putImageData(d, 0, 0);
    t.needsUpdate = true;
  };
  img.src = 'photos/' + file;
  return (wallTexCache[key] = t);
}
const FACING = { 'z+': 0, 'z-': Math.PI, 'x+': Math.PI / 2, 'x-': -Math.PI / 2 };
// An inscription shown flat on the stone, with a thin clay frame
function plaqueMesh(f) {
  const p = f.plaque, geo = new THREE.PlaneGeometry(p.w, p.w / p.aspect);
  geo.userData.uv = true;
  geo.rotateY(FACING[p.facing]);
  const tex = wallTexture(p.file, { recolor: false, crop: p.crop });
  // lit a little from within, so it stays readable on shaded faces and in dark rooms
  const mat = new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.75, roughness: 0.9 });
  const m = new THREE.Mesh(geo, mat);
  m.position.copy(f.at);
  put(f.id, m, false);
  backSide(f.id, m, p.facing, mat);
  // a pale panel behind it, so it stands out from the stone around it
  const pad = new THREE.Mesh(new THREE.PlaneGeometry(p.w + 0.24, p.w / p.aspect + 0.24).rotateY(FACING[p.facing]), new THREE.MeshBasicMaterial({ color: 0xf2e9d6, side: THREE.DoubleSide }));
  pad.geometry.userData.uv = true;
  pad.position.copy(f.at);
  ctx.groups[f.id].add(pad);
  const frame = new THREE.LineSegments(new THREE.EdgesGeometry(pad.geometry), new THREE.LineBasicMaterial({ color: COL.mark }));
  frame.position.copy(f.at);
  ctx.groups[f.id].add(frame);
}
// The same picture on the back of a wall image, the right way round, so it reads from either side of the wall
const NORMAL = { 'z+': V(0, 0, 1), 'z-': V(0, 0, -1), 'x+': V(1, 0, 0), 'x-': V(-1, 0, 0) };
function backSide(id, front, facing, mat) {
  const g = front.geometry.clone();
  g.rotateY(Math.PI);
  g.userData.uv = true;
  const b = new THREE.Mesh(g, mat);
  b.position.copy(front.position).addScaledVector(NORMAL[facing], -0.03);
  front.position.addScaledVector(NORMAL[facing], 0.03);
  put(id, b, false);
}
// Where only the place is known: a faint flat patch with a dashed clay outline
function outlineMesh(f) {
  const o = f.outline, geo = new THREE.PlaneGeometry(o.w, o.h);
  geo.userData.uv = true;
  geo.rotateX(-Math.PI / 2);
  ctx.mats[f.id].opacity = 0.22;
  const m = new THREE.Mesh(geo, ctx.mats[f.id]);
  m.position.copy(f.at);
  put(f.id, m, false);
  const line = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineDashedMaterial({ color: COL.mark, dashSize: o.w / 10, gapSize: o.w / 20 }));
  line.computeLineDistances();
  line.position.copy(f.at);
  ctx.groups[f.id].add(line);
}
function wallImage(id, file, aspect, facing, plane, along, cy, maxW, maxH) {
  const w = Math.min(maxW, maxH * aspect), h = w / aspect;
  const geo = new THREE.PlaneGeometry(w, h);
  geo.userData.uv = true;   // keep the picture's own UVs
  geo.rotateY(FACING[facing]);
  const tex = wallTexture(file);
  const mat = new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.45, roughness: 0.9 });
  const m = new THREE.Mesh(geo, mat);
  if (facing[0] === 'z') m.position.set(along, cy, plane); else m.position.set(plane, cy, along);
  put(id, m, false);
  backSide(id, m, facing, mat);
  return m;
}
function person(x, y, z, turn = 0) {
  const g = new THREE.Group();
  const add = (geo, px, py) => { const m = new THREE.Mesh(geo, humanMat); m.position.set(px, py, 0); m.castShadow = true; g.add(m); };
  // 1.75 m tall: legs, body, arms and head as rounded capsules
  add(new THREE.CapsuleGeometry(0.065, 0.74, 4, 10), -0.085, 0.44);
  add(new THREE.CapsuleGeometry(0.065, 0.74, 4, 10), 0.085, 0.44);
  add(new THREE.CapsuleGeometry(0.17, 0.32, 4, 14), 0, 1.16);
  add(new THREE.CapsuleGeometry(0.045, 0.56, 4, 8), -0.235, 1.12);
  add(new THREE.CapsuleGeometry(0.045, 0.56, 4, 8), 0.235, 1.12);
  add(new THREE.SphereGeometry(0.11, 16, 12), 0, 1.62);
  g.position.set(x, y, z);
  g.rotation.y = turn;
  ctx.humans.add(g);
}
// Half-width of the pyramid at height y, from its profile rings
function halfAt(rings, y) {
  for (let i = 0; i < rings.length - 1; i++) {
    const [a, ya] = rings[i], [b, yb] = rings[i + 1];
    if (y <= yb) return a + (b - a) * (y - ya) / (yb - ya);
  }
  return 0;
}
function buildShell(def) {
  const rings = def.rings, g = ctx.groups.pyramid, zr = def.zr ?? 1;
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const geo = customGeo(def) ?? makeShellGeo(rings, zr);
  const shell = new THREE.Mesh(geo, shellMat);
  ctx.shell = shell;
  shell.renderOrder = 10;
  g.add(shell);
  ctx.ext = exteriorGroups(def);
  g.add(ctx.ext.built);
  if (ctx.ext.today) g.add(ctx.ext.today);
  const square = (r, y) => [V(-r, y, -r * zr), V(r, y, -r * zr), V(r, y, r * zr), V(-r, y, r * zr), V(-r, y, -r * zr)];
  const edgeMat = new THREE.LineBasicMaterial({ color: COL.edge, transparent: true, opacity: 0.9 });
  const courseMat = new THREE.LineBasicMaterial({ color: COL.edge, transparent: true, opacity: 0.22 });
  const top = rings[rings.length - 1][1];
  if (def.shape) g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 40), courseMat));
  else if (def.terrain) { /* the hillside needs no outline */ }
  else {
    for (const c of corners) g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rings.map(([r, y]) => V(c[0] * r, y, c[1] * r * zr))), edgeMat));
    for (const [r, y] of rings) if (r > 0) g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(square(r, y)), edgeMat));
    for (let y = 10; y < top; y += 10) g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(square(halfAt(rings, y), y)), courseMat));
  }
  if (def.today) {
    const t = new THREE.Line(new THREE.BufferGeometry().setFromPoints(square(halfAt(rings, def.today), def.today)), new THREE.LineDashedMaterial({ color: COL.edge, dashSize: 1, gapSize: 1 }));
    t.computeLineDistances();
    g.add(t);
  }
  // Cut faces for the cut-away: the pyramid's cross-section on the cutting plane (as built, and as the
  // weathered core today), and the bedrock below ground, so the cut shows solid stone rather than a hollow shell
  const depth = Math.max(20, -def.lowest + 12);
  // the cut keeps the side its normal points to; sections are drawn in that plane (u runs along it)
  const cn = V(...(def.cut ?? [-1, 0, 0])).normalize(), ct = V(cn.z, 0, -cn.x);
  const toPlane = new THREE.Matrix4().makeBasis(ct, V(0, 1, 0), cn).setPosition(cn.clone().multiplyScalar(0.02));
  const section = (pts, mat, solid) => {
    const geo = new THREE.ShapeGeometry(new THREE.Shape(pts.map(([u, y]) => new THREE.Vector2(u, y))));
    geo.applyMatrix4(toPlane); worldUV(geo); geo.userData.uv = true;
    const m = new THREE.Mesh(geo, mat); m.receiveShadow = true;
    m.userData.solid = solid; m.userData.cap = true;
    g.add(m);
  };
  const outline = rs => [...rs.map(([r, y]) => [-r * zr, y]), ...[...rs].reverse().map(([r, y]) => [r * zr, y])];
  const T = TODAY[def.id];
  if (def.terrain) {
    // the hillside cut along the plane, above the valley floor
    const [w, d] = def.terrain.size, [cx, cz] = def.terrain.center ?? [0, 0], U = Math.hypot(w, d) / 2 + Math.hypot(cx, cz), pts = [];
    for (let u = -U; u <= U; u += 1.5) { const q = ct.clone().multiplyScalar(u).addScaledVector(cn, 0.02); pts.push([u, Math.max(0, def.terrain.h(q.x, q.z))]); }
    section([[-U, 0], ...pts, [U, 0]], CAP_MATS.rock, true);
  } else if (!def.shape) {
    section(outline(rings), CAP_MATS.core, def.id in TODAY ? 'built' : true);
    if (T && !T.smooth) {
      const top = T.top, rs = [...rings.filter(([, y]) => y < top).map(([r, y]) => [Math.max(0.5, r - 1), y]), [Math.max(0.5, halfAt(rings, top) - 1), top]];
      section(outline(rs), CAP_MATS.core, 'today');
    } else if (T) section(outline(rings), CAP_MATS.core, 'today');
  }
  const w = rings[0][0] * zr + 40;
  section([[-w, -depth], [w, -depth], [w, 0], [-w, 0]], CAP_MATS.rock, true);

  const bed = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(rings[0][0] * 2 + 60, depth, rings[0][0] * zr * 2 + 60)), new THREE.LineBasicMaterial({ color: COL.rock, transparent: true, opacity: 0.35 }));
  bed.position.y = -depth / 2;
  g.add(bed);
}

// ======================================================================
// Pyramid records
// ======================================================================








// Each pyramid's data lives in its own file and is built with these shared helpers
const api = { THREE, RoundedBoxGeometry, mergeGeometries, V, D, up, ph, COL, passage, room, doorway, gabledRoom, corbelRoom, route, person, frame, put, halfAt, wallImage, extraMat, get ctx() { return ctx; } };
const PYRAMIDS = [djoser, bent, red, khufu, khafre, sphinx, menkaure, unas, valley, tut, seti].map(make => make(api));   // oldest first
const KHUFU = PYRAMIDS.find(p => p.id === 'khufu');

// ======================================================================
// Loading a pyramid into the scene
// ======================================================================
const info = document.getElementById('info');
const detail = document.getElementById('detail');
const list = document.getElementById('features');
const confText = { surveyed: 'Surveyed', approx: 'Approximate', uncertain: 'Uncertain · scan data' };
// What each site has in the way of texts and decoration
const WRITING = {
  djoser: 'No texts are carved inside the pyramid. Below it, the blue chambers have carved panels showing Djoser at his jubilee festival, with his names. A statue base found in the complex names Imhotep, probably his architect.',
  bent: 'No texts were carved inside. Like every pyramid before Unas, its rooms are plain stone.',
  red: 'No texts were carved inside. Red-painted builders\u2019 marks on casing blocks name work gangs and give dates in Sneferu\u2019s reign (see Dated builders\u2019 marks).',
  khufu: 'No texts were carved inside. Red-painted builders\u2019 marks in the relieving chambers name Khufu and his work gangs, and in 1842 the Lepsius expedition carved a hieroglyphic text over the entrance. Both are listed under Inscriptions and marks.',
  khafre: 'No ancient texts have been found inside. The only writing is Giovanni Belzoni\u2019s name and date, painted in the burial chamber in 1818.',
  menkaure: 'No texts were carved inside, apart from the carved palace-front panelling. A wooden coffin lid naming Menkaure, made about 1,900 years after his death, was found here.',
  sphinx: 'The Sphinx carries no ancient text of its own. The main inscription is the Dream Stela between its paws, set up by Thutmose IV around 1400 BC.',
  unas: 'The first pyramid with texts. The Pyramid Texts cover the walls of the burial chamber, the antechamber and part of the corridor, carved and filled with blue pigment. The Pyramid Texts group lists them wall by wall.',
  valley: 'Royal tombs here are decorated with guides to the afterlife: the Amduat, the Book of Gates, the Litany of Ra and the Books of the Sky, carved or painted on corridors and chambers. Tombs with decoration are coloured gold.',
  tut: 'Only the burial chamber is painted; the rest of the tomb was left plain, probably because the king died young and suddenly. Its four walls are listed under Painted walls.',
  seti: 'Almost every wall and ceiling is carved in raised relief and painted, from the Litany of Ra near the entrance to the map of the night sky on the burial chamber\u2019s vault.',
};
const toggles = { humans: true, shafts: true, scan: true, marks: true, surround: true, labels: true, cut: false, stone: false, today: true };

function load(def, fly) {
  if (ctx && walk.on) stopWalk();
  if (ctx && tour.on) stopTour();
  if (ctx) {
    for (const o of ctx.labels) o.element.remove();
    scene.remove(ctx.root);
    ctx.root.traverse(o => { o.geometry?.dispose(); });
  }
  const root = new THREE.Group();
  scene.add(root);
  for (const f of def.features) if (typeof f.photos === 'function') f.photos = f.photos();
  const R = def.rings[0][0] + 160;
  Object.assign(sun.shadow.camera, { left: -R, right: R, top: R, bottom: -R, near: 10, far: 2200 });
  sun.shadow.camera.updateProjectionMatrix();
  ctx = { def, root, groups: {}, mats: {}, lineMats: {}, pickables: [], labels: [], humans: new THREE.Group(), extra: [], faceEnds: [], doors: [], holes: [], collars: [], recesses: [],
    byId: Object.fromEntries(def.features.map(f => [f.id, f])), selected: null };
  root.add(ctx.humans);
  for (const f of def.features) {
    const g = new THREE.Group();
    root.add(g);
    ctx.groups[f.id] = g;
    ctx.mats[f.id] = xray(new THREE.MeshStandardMaterial({ color: COL[f.color], emissive: COL[f.color], emissiveIntensity: 0.12, roughness: 0.8, transparent: true, opacity: f.scan ? 0.45 : f.mark ? 0.95 : 0.62, depthWrite: false, side: THREE.DoubleSide }));
  }
  ground.geometry = groundGeo(def);
  ground.position.y = def.groundY ?? 0;   // under real terrain the flat ground sits below the lowest valley floor
  clip.normal.set(...(def.cut ?? [-1, 0, 0])).normalize();   // the cut-away runs along each site's own plane
  buildShell(def);
  def.build();
  addScans(def);
  if (def.rotateY) for (const [id, g] of [...Object.entries(ctx.groups), ['humans', ctx.humans]]) if (id !== 'pyramid') g.rotation.y = def.rotateY;   // built along its own axis
  addDoorways();
  buildSurroundings(def);
  for (const f of def.features) if (f.at) {
    if (f.plaque) plaqueMesh(f);
    else if (f.outline) outlineMesh(f);
  }
  for (const m of Object.values(ctx.mats)) { m.userData.col = m.color.clone(); m.userData.op = m.opacity; }

  // Labels
  for (const f of def.features) {
    if (f.id === 'pyramid') continue;
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'tag';
    el.textContent = f.name;
    el.addEventListener('pointerdown', e => e.stopPropagation());
    el.addEventListener('click', e => { e.stopPropagation(); select(f.id, true); });
    const o = new CSS2DObject(el);
    o.position.copy(anchorOf(f.id).top);
    o.userData = { id: f.id, major: !!f.major };
    root.add(o); ctx.labels.push(o);
  }
  const b = def.rings[0][0] + 22, bz = def.rings[0][0] * (def.zr ?? 1) + 22;
  for (const [txt, p] of [['North', V(0, 0.2, -bz)], ['South', V(0, 0.2, bz)], ['East', V(b, 0.2, 0)], ['West', V(-b, 0.2, 0)]]) {
    const el = document.createElement('div'); el.className = 'tag quiet'; el.textContent = txt;
    el.style.pointerEvents = 'none';
    const o = new CSS2DObject(el); o.position.copy(p); o.userData = { quiet: true }; root.add(o); ctx.labels.push(o);
  }

  // Panel
  document.getElementById('eyebrow').textContent = `${def.site}, Egypt · ${def.date}`;
  document.getElementById('title').textContent = def.title;
  document.getElementById('stats').innerHTML = [...(def.collection ? [] : [['King', def.king], ['Reign', fmtReign(def)]]), ...def.stats].map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('');
  document.getElementById('writing').textContent = WRITING[def.id] ?? '';
  // look and cut-away names that fit what this is
  const carved = def.shape || def.terrain;
  document.getElementById('look-built').textContent = carved ? 'Solid' : 'As built';
  document.getElementById('look-built-s').textContent = carved ? 'Solid' : 'Built';
  document.getElementById('cut-label').textContent = def.cut ? 'Cut away along the tomb' : 'Cut away east half';
  document.getElementById('lede').textContent = def.features[0].text.split('. ')[0] + '.';
  document.getElementById('sources').innerHTML = `<b>Measurements from</b> ${def.sources} Each feature is tagged with how sure the published figures are. Where surveys disagree, both values are given. Passages and chambers are drawn at true scale; routes marked approximate are simplified.`;
  const groupsOrder = [...new Set(def.features.map(f => f.group))];
  const startOpen = !matchMedia('(max-width: 860px)').matches;
  list.innerHTML = groupsOrder.map(g => `<details class="grp"${startOpen ? ' open' : ''}><summary class="group-title">${g}<span>${def.features.filter(f => f.group === g).length}</span></summary><div class="feat-list">
    ${def.features.filter(f => f.group === g).map(f => `<button type="button" class="feat" data-id="${f.id}"><i class="sw" style="background:var(--${f.color})"></i>${f.name}${f.photos?.length ? '<svg class="i cam" viewBox="0 0 24 24" aria-label="Has photos"><path d="M4 8h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="13" r="3"/></svg>' : ''}</button>`).join('')}
    </div></details>`).join('');
  if (typeof syncPicker === 'function') syncPicker(def);
  document.getElementById('tg-shafts').hidden = !def.features.some(f => f.shaft);
  document.getElementById('tg-scan').hidden = !def.features.some(f => f.scan);
  document.getElementById('tg-marks').hidden = !def.features.some(f => f.mark || f.inscribed);
  document.getElementById('btn-tour').hidden = !def.tour;

  applyToggles();
  clearSelection();
  buildKey();
  if (fly) overview(); else { const v = overviewPose(); camera.position.copy(v.p); controls.target.copy(v.t); }
}

function anchorOf(id) {
  const box = new THREE.Box3().setFromObject(ctx.groups[id]);
  const c = box.getCenter(new THREE.Vector3());
  return { box, c, top: V(c.x, box.max.y, c.z) };
}

function select(id, fly, photo = 0) {
  ctx.selected = id;
  const f = ctx.byId[id];
  const ph = f.photos?.[photo];
  setHash(id);
  const btn = list.querySelector(`.feat[data-id="${id}"]`);
  if (btn) btn.closest('details').open = true;
  document.getElementById('detail-titles').innerHTML = `<span class="conf ${f.conf}">${confText[f.conf]}</span><h2>${f.name}</h2>`;
  detail.hidden = false;
  if (!helpEl.hidden) setHelp(false);
  info.scrollTop = 0;
  info.innerHTML = `
    ${ph ? `<figure class="photo">
      <img src="${ph.src}" alt="${ph.alt}">
      <figcaption>${ph.caption}<span class="credit">Photo: ${ph.credit} · <a href="${ph.url}" target="_blank" rel="noopener">${ph.license}</a></span></figcaption>
      ${f.photos.length > 1 ? `<div class="thumbs">${f.photos.map((p, i) => `<button type="button" data-photo="${i}" aria-label="Photo ${i + 1}: ${p.alt}" aria-pressed="${i === photo}"><img src="${p.src}" alt=""></button>`).join('')}</div>` : ''}
      <div class="view-row"><button type="button" class="text-btn view-from" data-photo="${photo}"><svg class="i" viewBox="0 0 24 24"><path d="M4 8h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="13" r="3"/></svg>View from where this was taken</button><span>Viewpoint estimated from the photo</span></div>
    </figure>` : ''}
    <p>${f.text}</p>
    ${f.why ? `<div class="why"><b>Why it matters</b><p>${f.why}</p></div>` : ''}
    <dl class="facts">${f.facts.map(([k, v]) => `<dt>${k}</dt><dd${/\d/.test(v) ? '' : ' class="txt"'}>${v}</dd>`).join('')}</dl>
    ${f.link ? `<button type="button" class="text-btn open-link" data-open="${f.link}"><svg class="i" viewBox="0 0 24 24"><path d="M12 3 3 8l9 5 9-5zM3 8v8l9 5 9-5V8"/></svg>Open the detailed model</button>` : ''}`;
  for (const b of list.querySelectorAll('.feat')) b.setAttribute('aria-current', b.dataset.id === id);
  setEmissive();
  for (const o of ctx.labels) o.element.classList.toggle('on', o.userData.id === id);
  refreshLabels();
  showPhotoMarker(ph);
  if (fly) { if (walk.on) walkToFeature(id, ph ?? f.view); else if (f.view) flyTo(V(...f.view.look), V(...f.view.cam)); else flyToFeature(id); }
}
info.addEventListener('click', e => {
  const o = e.target.closest('[data-open]');
  if (o) return switchTo(PYRAMIDS.find(p => p.id === o.dataset.open));
  const t = e.target.closest('[data-photo]');
  if (!t) return;
  const i = +t.dataset.photo, ph = ctx.byId[ctx.selected].photos[i];
  if (t.classList.contains('view-from')) walk.on ? startWalk(V(...ph.cam), V(...ph.look)) : flyTo(V(...ph.look), V(...ph.cam));
  else select(ctx.selected, true, i);
});

// A small camera marker showing where the selected photo was taken (estimated from the photo)
const markerMat = new THREE.MeshBasicMaterial({ color: COL.mark });
let photoMarker = null;
function showPhotoMarker(ph) {
  if (photoMarker) { scene.remove(photoMarker); photoMarker = null; }
  if (!ph) return;
  const g = new THREE.Group();
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.8, 4, 1, true), markerMat);
  cone.rotation.x = Math.PI / 2;
  g.add(cone);
  g.add(new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), markerMat));
  g.position.set(...ph.cam);
  g.lookAt(V(...ph.look));
  // keep it just behind the viewpoint so it is visible after orbiting away, not in the photo view itself
  g.position.addScaledVector(V(...ph.look).sub(V(...ph.cam)).normalize(), -0.6);
  scene.add(g);
  photoMarker = g;
}
list.addEventListener('click', e => {
  const b = e.target.closest('.feat');
  if (!b) return;
  select(b.dataset.id, true);
  if (matchMedia('(max-width: 860px)').matches) setContents(false);
});
function clearSelection() {
  if (!ctx) return;
  ctx.selected = null;
  setHash(null);
  detail.hidden = true;
  for (const b of list.querySelectorAll('.feat')) b.setAttribute('aria-current', false);
  setEmissive();
  for (const o of ctx.labels) o.element.classList.remove('on');
  showPhotoMarker(null);
  refreshLabels();
}
document.getElementById('btn-close').addEventListener('click', clearSelection);
addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!picker.hidden) return setPicker(false);
  if (!helpEl.hidden) return setHelp(false);
  if (menus.some(([, m]) => !m.hidden)) return closeMenus();
  if (tour.on) stopTour(); else if (walk.on) stopWalk(); else clearSelection();
});

// Contents panel and navigation help
const contentsEl = document.getElementById('contents'), contentsBtn = document.getElementById('btn-contents');
function setContents(open) { contentsEl.hidden = !open; contentsBtn.setAttribute('aria-expanded', open); }
contentsBtn.addEventListener('click', () => { if (!detail.hidden) { clearSelection(); setContents(true); } else setContents(contentsEl.hidden); });
setContents(!matchMedia('(max-width: 860px)').matches);
const helpEl = document.getElementById('welcome'), helpBtn = document.getElementById('btn-help');
let helpSeen = false;
try { helpSeen = localStorage.getItem('pyramids-welcome-seen') === '1'; } catch (e) {}
// The start screen: every site as a card, grouped by place
function renderWelcome() {
  const thumb = d => d.thumb ?? d.features.map(f => typeof f.photos === 'function' ? f.photos() : f.photos).find(p => p?.length)?.[0]?.src;
  document.getElementById('welcome-sites').innerHTML = SITES.map(site => `<div class="site-col"><h3>${site}</h3>${
    PYRAMIDS.filter(d => d.site === site).map(d => { const src = thumb(d); return `<button type="button" class="site-card" data-id="${d.id}">
      ${src ? `<img src="${src}" alt="" loading="lazy">` : `<span class="site-icon">${profileSVG(d, 40, 24)}</span>`}
      <span><b>${d.short}</b><small>${d.date}</small></span></button>`; }).join('')}</div>`).join('');
}
function setHelp(open) {
  if (open) renderWelcome();
  helpEl.hidden = !open; helpBtn.setAttribute('aria-expanded', open);
  if (open) document.getElementById('welcome-go').focus();
  else try { localStorage.setItem('pyramids-welcome-seen', '1'); } catch (e) {}
}
helpBtn.addEventListener('click', () => setHelp(helpEl.hidden));
document.getElementById('welcome-go').addEventListener('click', () => setHelp(false));
document.getElementById('welcome-x').addEventListener('click', () => setHelp(false));
document.getElementById('welcome-sites').addEventListener('click', e => { const t = e.target.closest('[data-id]'); if (t) { setHelp(false); switchTo(PYRAMIDS.find(p => p.id === t.dataset.id)); } });
helpEl.addEventListener('click', e => { if (e.target === helpEl) setHelp(false); });

// Toolbar menus: one open at a time; close on outside click, Esc, or after a one-off action
const menus = [['menu-view', 'view-menu'], ['menu-show', 'show-menu']].map(([b, m]) => [document.getElementById(b), document.getElementById(m)]);
function closeMenus(except) { for (const [b, m] of menus) if (m !== except) { m.hidden = true; b.setAttribute('aria-expanded', false); } }
for (const [b, m] of menus) b.addEventListener('click', e => { e.stopPropagation(); const open = m.hidden; closeMenus(); m.hidden = !open; b.setAttribute('aria-expanded', open); layoutLabels.t = 0; });
addEventListener('pointerdown', e => { if (!e.target.closest('.menu-wrap')) closeMenus(); });
for (const id of ['btn-overview', 'btn-side']) document.getElementById(id).addEventListener('click', () => closeMenus());

// Look: See-through, As built (smooth casing) or Today (weathered)
const lookButtons = [...document.querySelectorAll('[data-look]')];
function syncLook() {
  const look = !toggles.stone ? 'xray' : toggles.today && ctx?.ext?.today ? 'today' : 'built';
  for (const b of lookButtons) b.setAttribute('aria-pressed', b.dataset.look === look);
  const todayBtn = lookButtons.find(b => b.dataset.look === 'today');
  todayBtn.hidden = !ctx?.ext?.today;
}
function setLook(look) {
  toggles.stone = look !== 'xray';
  if (look !== 'xray') toggles.today = look === 'today';
  applyToggles();
}
for (const b of lookButtons) b.addEventListener('click', () => setLook(b.dataset.look));

// Camera moves
let anim = null;
function flyTo(target, pos) {
  anim = { t0: performance.now(), dur: reduceMotion ? 1 : 1100, ft: controls.target.clone(), fp: camera.position.clone(), tt: target, tp: pos };
}
function overviewPose() {
  if (ctx.def.overview) { const o = ctx.def.overview, fit = camera.aspect < 1 ? Math.min(2, 0.85 / camera.aspect) : 1, t = V(...o.t); return { t, p: V(...o.p).sub(t).multiplyScalar(fit).add(t) }; }
  const k = ctx.def.rings[0][0] / 115;
  const h = ctx.def.rings[ctx.def.rings.length - 1][1];
  const fit = camera.aspect < 1 ? Math.min(2.2, 0.85 / camera.aspect) : 1;   // step back on tall, narrow screens
  return { t: V(0, h * 0.3, 0), p: V(285 * k * fit, 150 * k * fit + h * 0.06, 250 * k * fit) };
}
function overview() { const v = overviewPose(); flyTo(v.t, v.p); }
function interiorBox() {
  const box = new THREE.Box3();
  for (const [id, g] of Object.entries(ctx.groups)) if (id !== 'pyramid') box.expandByObject(g);
  return box;
}
function sideView() {
  const box = interiorBox(), c = box.getCenter(new THREE.Vector3());
  const span = Math.max(box.max.z - box.min.z, box.max.y - box.min.y);
  flyTo(c, c.clone().add(V(span * 1.6 + 20, 4, 0)));
}
function flyToFeature(id) {
  if (id === 'pyramid') return overview();
  const { box, c } = anchorOf(id);
  const size = box.getSize(new THREE.Vector3()).length();
  const dist = Math.max(size * 1.5, 10);
  flyTo(c, c.clone().add(V(1, 0.45, 0.55).normalize().multiplyScalar(dist)));
}

// Toggles
// true while walking or touring inside a pyramid, where outside labels would show through the walls
const indoors = () => (walk.on && walk.inside) || (tour.on && tour.inside);
function refreshLabels() {
  for (const o of ctx.labels) {
    const f = o.userData.id && ctx.byId[o.userData.id];
    const groupVisible = !f || ctx.groups[f.id].visible;
    const hidden = toggles.stone && !toggles.cut && o.userData.id && o.userData.id !== ctx.selected;   // solid stone hides what is inside
    o.visible = toggles.labels && groupVisible && !hidden && (o.userData.surround ? toggles.surround && !indoors() : o.userData.quiet ? !indoors() : true);
  }
}
function applyToggles() {
  ctx.humans.visible = toggles.humans;
  if (ctx.surround) ctx.surround.visible = toggles.surround;
  for (const f of ctx.def.features) {
    if (f.shaft) ctx.groups[f.id].visible = toggles.shafts;
    if (f.scan) ctx.groups[f.id].visible = toggles.scan;
    if (f.mark || f.inscribed) ctx.groups[f.id].visible = toggles.marks;
  }
  applyLook();
  // Cut away the east half of the outer pyramid. Changing the number of clipping planes needs a shader rebuild.
  const planes = toggles.cut ? [clip] : [];
  const cutMats = new Set([shellMat, terrainXray, shellStone, doorMat, doorRimMat, recessMat, ...Object.values(MAIN_MATS)]);
  ctx.groups.pyramid.traverse(o => { if (o.material) cutMats.add(o.material); });
  for (const m of cutMats) { const want = [...(m.userData.baseClip ?? []), ...planes]; if ((m.clippingPlanes?.length ?? 0) !== want.length) { m.clippingPlanes = want; m.needsUpdate = true; } }
  const seeBelow = toggles.cut && toggles.stone;
  if (groundStone.transparent !== seeBelow) { groundStone.transparent = seeBelow; groundStone.opacity = seeBelow ? 0.5 : 1; groundStone.depthWrite = !seeBelow; groundStone.needsUpdate = true; }
  refreshLabels();
}
function toggle(btn, key) {
  btn.addEventListener('click', () => { toggles[key] = !toggles[key]; btn.setAttribute('aria-pressed', toggles[key]); applyToggles(); });
}
document.getElementById('btn-overview').addEventListener('click', overview);
document.getElementById('btn-side').addEventListener('click', sideView);
toggle(document.getElementById('btn-cut'), 'cut');
toggle(document.getElementById('tg-humans'), 'humans');
toggle(document.getElementById('tg-shafts'), 'shafts');
toggle(document.getElementById('tg-scan'), 'scan');
toggle(document.getElementById('tg-marks'), 'marks');
toggle(document.getElementById('tg-surround'), 'surround');
toggle(document.getElementById('tg-labels'), 'labels');
const op = document.getElementById('opacity');
op.addEventListener('input', () => { shellMat.opacity = op.value / 100; });

// Monument picker: the current one in the top bar, with older/newer arrows; the panel shows every
// monument at the same scale, then grouped by site
const pickBtn = document.getElementById('pick-btn'), picker = document.getElementById('picker');
const SITES = ['Saqqara', 'Dahshur', 'Giza', 'Valley of the Kings'];
function scaleStrip(current) {
  const gap = 44, base = 150, pad = 8, deep = -Math.min(0, ...PYRAMIDS.filter(d => !d.collection).flatMap(d => profilePts(d).map(p => p[1]))), foot = 78 + deep;
  let x = pad;
  scaleStrip.era = false;
  const parts = PYRAMIDS.filter(def => !def.collection).map(def => {
    const pts = profilePts(def), minX = Math.min(...pts.map(p => p[0])), maxX = Math.max(...pts.map(p => p[0]));
    // leave room for the name under small or narrow monuments, and a wider gap before the New Kingdom tombs
    if (def.terrain && !scaleStrip.era) { scaleStrip.era = true; x += gap * 2; }
    const room = Math.max(maxX - minX, def.short.length * 17 + 8), ox = x + (room - (maxX - minX)) / 2 - minX; x += room + gap;
    const top = Math.max(...pts.map(p => p[1]));
    return `<g class="strip-item${def === current ? ' on' : ''}" tabindex="0" role="button" data-id="${def.id}" aria-label="${def.title}, ${def.date}">
      <rect x="${ox + minX - gap / 2}" y="0" width="${maxX - minX + gap}" height="${base + foot}" class="hit"/>
      <polygon points="${pts.map(([px, py]) => `${(ox + px).toFixed(1)},${(base - py).toFixed(1)}`).join(' ')}"/>
      <text x="${ox + (minX + maxX) / 2}" y="${base + deep + 36}" class="nm">${def.short}</text>
      <text x="${ox + (minX + maxX) / 2}" y="${base + deep + 66}" class="dt">${def.date.replace('c. ', '')}</text>
      <text x="${ox + (minX + maxX) / 2}" y="${base - top - 10}" class="ht">${top > 1 ? `${Math.round(top)} m` : `${Math.round(-Math.min(...pts.map(p => p[1])))} m deep`}</text></g>`;
  }).join('');
  return `<svg viewBox="0 -36 ${x - gap + pad} ${base + foot + 36}" role="group" aria-label="All monuments to scale">
    <line x1="0" y1="${base}" x2="${x}" y2="${base}" class="ground"/>${parts}</svg>`;
}
function renderPicker() {
  const cur = ctx?.def;
  document.getElementById('scale-strip').innerHTML = scaleStrip(cur);
  document.getElementById('pick-groups').innerHTML = SITES.map(site => `<div class="pick-group"><h3>${site}</h3><div class="pick-cards">${
    PYRAMIDS.filter(d => d.site === site).map(d => `<button type="button" class="pick-card" data-id="${d.id}" aria-current="${d === cur}">
      <span class="pc-icon">${profileSVG(d, 40, 24)}</span>
      <span class="pc-txt"><b>${d.title}</b><span>${d.date} · King ${d.king}</span><span class="muted">${d.stats.map(([k, v]) => `${k} ${v}`).join(' · ')}</span></span></button>`).join('')
  }</div></div>`).join('');
}
function setPicker(open) {
  if (open) renderPicker();
  picker.hidden = !open; pickBtn.setAttribute('aria-expanded', open);
  if (open) picker.querySelector('[aria-current="true"]')?.focus();
  layoutLabels.t = 0;
}
function syncPicker(def) {
  document.getElementById('pick-icon').innerHTML = profileSVG(def, 30, 18);
  document.getElementById('pick-name').textContent = def.short;
  document.getElementById('pick-sub').textContent = `${def.site} · ${def.date}`;
  pickBtn.setAttribute('aria-label', `${def.title}, ${def.date}. Choose another monument`);
  const i = PYRAMIDS.indexOf(def);
  document.getElementById('pick-prev').disabled = i === 0;
  document.getElementById('pick-next').disabled = i === PYRAMIDS.length - 1;
}
pickBtn.addEventListener('click', e => { e.stopPropagation(); setPicker(picker.hidden); });
document.getElementById('picker-close').addEventListener('click', () => setPicker(false));
document.getElementById('pick-prev').addEventListener('click', () => switchTo(PYRAMIDS[Math.max(0, PYRAMIDS.indexOf(ctx.def) - 1)]));
document.getElementById('pick-next').addEventListener('click', () => switchTo(PYRAMIDS[Math.min(PYRAMIDS.length - 1, PYRAMIDS.indexOf(ctx.def) + 1)]));
picker.addEventListener('click', e => { const t = e.target.closest('[data-id]'); if (t) { setPicker(false); switchTo(PYRAMIDS.find(p => p.id === t.dataset.id)); } });
picker.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.strip-item')) { e.preventDefault(); e.target.click(); } });
addEventListener('pointerdown', e => { if (!picker.hidden && !e.target.closest('#picker, #pick-btn')) setPicker(false); });

// Picking
const ray = new THREE.Raycaster();
ray.params.Line.threshold = 0.6;
const visible = o => { for (let p = o; p; p = p.parent) if (!p.visible) return false; return true; };
function pointerRay(x, y) {
  const r = renderer.domElement.getBoundingClientRect();
  ray.setFromCamera(new THREE.Vector2(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1), camera);
  return ray;
}
function hitAt(x, y, withShell = false) {
  const objs = ctx.pickables.filter(visible);
  if (withShell) ctx.groups.pyramid.traverse(o => { if (o.isMesh) objs.push(o); });
  return pointerRay(x, y).intersectObjects(objs, false)[0];
}
// ---------- Navigation ----------
// Mouse: drag turns around the point you grab, right-drag or Shift-drag moves, wheel zooms toward the pointer.
// Trackpad: two-finger scroll up/down zooms toward the pointer, sideways turns; pinch zooms; Shift + scroll moves.
// Keyboard: W/S or Up/Down walk forward/back, A/D or Left/Right turn, Q/E move down/up.
// Wheel and key input is queued and eased in over a few frames so movement stays smooth.
const nav = { zoom: 0, pt: null, dir: null, t: 0, x: 0, y: 0, orbit: 0, panX: 0, panY: 0, keys: new Set() };
const spherical = new THREE.Spherical();

// Move the orbit pivot to the depth of whatever is under the pointer, without changing the view
function pivotToPointer(x, y) {
  const hit = hitAt(x, y) ?? hitAt(x, y, true);
  if (!hit) return;
  const dir = controls.target.clone().sub(camera.position).normalize();
  const depth = hit.point.clone().sub(camera.position).dot(dir);
  if (depth > 0.3) controls.target.copy(camera.position).addScaledVector(dir, depth);
}

let down = null;
renderer.domElement.addEventListener('pointerdown', e => {
  down = [e.clientX, e.clientY]; anim = null;
  if (e.button === 0 && !e.shiftKey && !walk.on) pivotToPointer(e.clientX, e.clientY);
});
renderer.domElement.addEventListener('pointerup', e => {
  if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return;
  const hit = hitAt(e.clientX, e.clientY);
  if (hit) select(hit.object.userData.fid, false);
});

// Double-click: focus on the spot under the pointer, keeping the current viewing direction
renderer.domElement.addEventListener('dblclick', e => {
  if (walk.on) return;
  const hit = hitAt(e.clientX, e.clientY, true);
  if (!hit) return;
  const dir = camera.position.clone().sub(controls.target).normalize();
  const dist = Math.min(camera.position.distanceTo(controls.target) * 0.5, 40);
  flyTo(hit.point.clone(), hit.point.clone().addScaledVector(dir, Math.max(dist, 6)));
});

function orbitBy(dx, dy) {
  const off = camera.position.clone().sub(controls.target);
  spherical.setFromVector3(off);
  spherical.theta -= dx * 0.005;
  spherical.phi = THREE.MathUtils.clamp(spherical.phi - dy * 0.005, 0.02, Math.PI - 0.02);
  camera.position.copy(controls.target).add(off.setFromSpherical(spherical));
}
function panBy(dx, dy) {
  const dist = camera.position.distanceTo(controls.target);
  const k = 2 * dist * Math.tan(camera.fov * D / 2) / renderer.domElement.clientHeight;
  const right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0);
  const up = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 1);
  const move = right.multiplyScalar(dx * k).add(up.multiplyScalar(-dy * k));
  camera.position.add(move); controls.target.add(move);
}
function queueZoom(x, y, amount) {
  const now = performance.now();
  // keep one zoom point for the whole gesture so the view does not wobble
  if (!nav.pt || now - nav.t > 250 || Math.hypot(x - nav.x, y - nav.y) > 24) {
    const hit = hitAt(x, y) ?? hitAt(x, y, true);
    const r = pointerRay(x, y).ray;
    nav.pt = hit ? hit.point.clone() : r.at(camera.position.distanceTo(controls.target), new THREE.Vector3());
    nav.dir = r.direction.clone(); nav.x = x; nav.y = y;
  }
  nav.t = now;
  nav.zoom += amount;
}
function applyZoom(amount) {
  const f = Math.exp(amount), p = nav.pt;
  if (f < 1 && camera.position.distanceTo(p) * f < 0.7) {
    // Right up against something: keep going forward, so you can pass through a wall into the room behind
    const step = nav.dir.clone().multiplyScalar(-amount * 10);
    camera.position.add(step); controls.target.add(step); p.add(step);
    return;
  }
  if (f > 1 && camera.position.length() * f > 2600) { nav.zoom = 0; return; }
  camera.position.sub(p).multiplyScalar(f).add(p);
  controls.target.sub(p).multiplyScalar(f).add(p);
}
host.addEventListener('wheel', e => {
  e.preventDefault(); e.stopPropagation();
  anim = null;
  const px = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1;
  const dx = e.deltaX * px, dy = e.deltaY * px;
  if (walk.on) {
    if (Math.abs(dx) > Math.abs(dy)) { walk.yaw += dx * 0.004; placeCamera(); } else walk.wheel -= dy * 0.012;
    return;
  }
  if (e.shiftKey) { nav.panX += dx; nav.panY += dy; return; }
  if (e.ctrlKey) return queueZoom(e.clientX, e.clientY, dy * 0.012);           // pinch
  if (Math.abs(dx) > Math.abs(dy) * 1.2) { nav.orbit += dx; return; }         // sideways swipe
  queueZoom(e.clientX, e.clientY, THREE.MathUtils.clamp(dy, -150, 150) * 0.0024);
}, { passive: false, capture: true });

// Keyboard walking
const NAV_KEYS = ['w', 'a', 's', 'd', 'q', 'e', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift'];
addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (!NAV_KEYS.includes(k) || e.metaKey || e.ctrlKey || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || document.body.dataset.mode !== 'model') return;
  e.preventDefault(); anim = null; nav.keys.add(k);
});
addEventListener('keyup', e => nav.keys.delete(e.key.toLowerCase()));
addEventListener('blur', () => nav.keys.clear());

function stepNav(dt) {
  if (walk.on) return walkStep(dt);
  const k = 1 - Math.pow(2e-8, dt);   // about a quarter of the queued motion per frame at 60 fps
  if (Math.abs(nav.zoom) > 1e-4) { const a = nav.zoom * k; nav.zoom -= a; applyZoom(a); } else nav.zoom = 0;
  if (Math.abs(nav.orbit) > 0.05) { const a = nav.orbit * k; nav.orbit -= a; orbitBy(a, 0); } else nav.orbit = 0;
  if (Math.abs(nav.panX) + Math.abs(nav.panY) > 0.05) { const ax = nav.panX * k, ay = nav.panY * k; nav.panX -= ax; nav.panY -= ay; panBy(ax, ay); } else nav.panX = nav.panY = 0;
  if (!nav.keys.size) return;
  const has = (...ks) => ks.some(x => nav.keys.has(x)) ? 1 : 0;
  const fwd = has('w', 'arrowup') - has('s', 'arrowdown');
  const turn = has('a', 'arrowleft') - has('d', 'arrowright');
  const lift = has('e') - has('q');
  const dist = camera.position.distanceTo(controls.target);
  const speed = THREE.MathUtils.clamp(dist * 0.8, 2, 120) * dt;
  const view = controls.target.clone().sub(camera.position).normalize();
  const move = view.multiplyScalar(fwd * speed).add(V(0, lift * speed, 0));
  camera.position.add(move); controls.target.add(move);
  if (turn) {
    // turn on the spot, like turning your head
    const off = controls.target.clone().sub(camera.position).applyAxisAngle(V(0, 1, 0), turn * 1.4 * dt);
    controls.target.copy(camera.position).add(off);
  }
}



// ======================================================================
// Surroundings: neighbouring pyramids and the Sphinx, placed from their real coordinates
// ======================================================================
const M_LAT = 110850, mLon = lat => 111320 * Math.cos(lat * D);
const localPos = (def, lat, lon) => V((lon - def.lon) * mLon(def.lat), 0, -(lat - def.lat) * M_LAT);
const surroundMat = new THREE.LineBasicMaterial({ color: COL.edge, transparent: true, opacity: 0.6, fog: false });
function outlinePyramid(rings, at, zr = 1) {
  const g = new THREE.Group();
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([x, z]) => [x, z * zr]);
  for (const c of corners) g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rings.map(([r, y]) => V(c[0] * r, y, c[1] * r))), surroundMat));
  for (const [r, y] of rings) if (r > 0) g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([...corners, corners[0]].map(c => V(c[0] * r, y, c[1] * r))), surroundMat));
  g.position.copy(at);
  return g;
}
function surroundLabel(text, pos, onClick) {
  const el = document.createElement(onClick ? 'button' : 'div');
  el.className = 'tag nb'; el.textContent = text;
  if (onClick) { el.type = 'button'; el.addEventListener('pointerdown', e => e.stopPropagation()); el.addEventListener('click', e => { e.stopPropagation(); onClick(); }); }
  else el.style.pointerEvents = 'none';
  const o = new CSS2DObject(el); o.position.copy(pos); o.userData = { surround: true };
  ctx.surround.add(o); ctx.labels.push(o);
}
function buildSurroundings(def) {
  ctx.surround = new THREE.Group();
  ctx.root.add(ctx.surround);
  for (const p of PYRAMIDS) {
    if (p === def) continue;
    const at = localPos(def, p.lat, p.lon);
    if (at.length() > 3500) continue;
    if (p.terrain || def.terrain) {
      if (p.terrain && def.terrain && !p.collection && !def.collection) surroundLabel(`${p.short} →`, at.clone().setY((p.entranceY ?? 0) - (def.entranceY ?? 0) + 8), () => switchTo(p));
      continue;
    }
    const outline = p.shape ? new THREE.LineSegments(new THREE.EdgesGeometry(shapeGeo(p), 40), surroundMat) : outlinePyramid(p.rings, at, p.zr);
    if (p.shape) outline.position.copy(at);
    outline.userData.solid = false; ctx.surround.add(outline);
    const ex = exteriorGroups(p, true);
    for (const grp of [ex.built, ex.today]) if (grp) { grp.position.copy(at); grp.visible = false; ctx.surround.add(grp); }
    surroundLabel(`${p.short} →`, at.clone().setY(p.rings[p.rings.length - 1][1] + 6), () => switchTo(p));
  }
}

// ======================================================================
// Views: 3D model, timeline, map
// ======================================================================
function switchTo(def) {
  setMode('model');
  if (ctx.def !== def) load(def, true);
}
const modeButtons = [...document.querySelectorAll('.mode')];
function setMode(m) {
  if (m !== 'model' && walk.on) stopWalk();
  if (m !== 'model' && tour.on) stopTour();
  document.body.dataset.mode = m;
  for (const b of modeButtons) b.setAttribute('aria-pressed', b.dataset.mode === m);
  document.getElementById('timeline-view').hidden = m !== 'timeline';
  document.getElementById('map-view').hidden = m !== 'map';
  if (m === 'map' && !document.getElementById('sat-wrap').hidden) initSatMap();
}
for (const b of modeButtons) b.addEventListener('click', () => setMode(b.dataset.mode));

// Side profile in metres, west to east: from the pyramid's rings, or the monument's own outline
function profilePts(def) {
  return def.profile ?? [...def.rings.map(([r, y]) => [-r, y]), ...def.rings.slice(0, -1).reverse().map(([r, y]) => [r, y])];
}
function profileSVG(def, w = 26, h = 16) {
  const s = (h - 2) / 146.6, cx = w / 2;
  const pts = profilePts(def).map(([px, py]) => [cx + px * s, h - 1 - py * s]);
  return `<svg viewBox="0 0 ${w} ${h}" aria-hidden="true"><polygon points="${pts.map(p => p.map(n => n.toFixed(2)).join(',')).join(' ')}" fill="currentColor"/></svg>`;
}
function fmtReign(d) { return `c. ${d.reign[0]}–${d.reign[1]} BC`; }

// Chronology: I. Shaw (ed.), The Oxford History of Ancient Egypt (2000). Other chronologies shift these by a few decades.
const DYNASTIES = [['3rd Dynasty', 2686, 2613], ['4th Dynasty', 2613, 2494], ['5th Dynasty', 2494, 2345], ['6th Dynasty', 2345, 2181], ['18th Dynasty', 1550, 1295], ['19th Dynasty', 1295, 1186], ['20th Dynasty', 1186, 1069]];
const KINGS = [['Djoser', 2667, 2648], ['Sneferu', 2613, 2589], ['Khufu', 2589, 2566], ['Djedefre', 2566, 2558], ['Khafre', 2558, 2532], ['Menkaure', 2532, 2503], ['Unas', 2375, 2345], ['Tutankhamun', 1336, 1327], ['Seti I', 1294, 1279]];
const CONTEXT = [
  { name: 'Meidum pyramid', short: 'Meidum', place: 'Meidum', year: 2610, lat: 29.38806, lon: 31.15694, note: 'Probably begun for Huni and finished by Sneferu; its outer layers later collapsed.' },
];

function renderTimeline() {
  // Two stretches of time, 2700–2300 BC and 1400–1250 BC, with the 900 years between them left out
  const SEG = [[2700, 2300, 40, 880], [1550, 1050, 960, 1200]];
  const seg = yr => yr > 1800 ? SEG[0] : SEG[1];
  const W = 1240, x = yr => { const [a, b, x0, x1] = seg(yr); return x0 + (a - yr) * (x1 - x0) / (a - b); };
  const band = DYNASTIES.map(([n, a, b], i) => {
    const [sa, sb] = seg(a), x0 = x(Math.min(a, sa)), x1 = x(Math.max(b, sb));
    return `<rect x="${x0}" y="8" width="${x1 - x0}" height="26" class="${i % 2 ? 'dyn b' : 'dyn'}"/><text x="${(x0 + x1) / 2}" y="25" class="dyn-t">${n}</text>`;
  }).join('');
  const kings = KINGS.map(([n, a, b]) => `<rect x="${x(a)}" y="66" width="${x(b) - x(a)}" height="18" rx="3" class="reign${PYRAMIDS.some(p => p.king === n) ? ' ours' : ''}"/><text x="${(x(a) + x(b)) / 2}" y="${x(b) - x(a) < 40 ? 60 : 100}" class="king-t">${n}</text>`).join('');
  const items = [...CONTEXT.map(c => ({ ...c, ctx: true })), ...PYRAMIDS.filter(p => !p.collection).map(p => ({ name: p.short, year: p.year, def: p }))].sort((a, b) => b.year - a.year);
  const seen = {};
  const marks = items.map((it, i) => {
    const cx = x(it.year) + (seen[it.year] = (seen[it.year] ?? -1) + 1) * 30, ly = i % 2 ? 196 : 176;
    const icon = it.def ? `<g transform="translate(${cx - 13},${132})" class="pm ours">${profileSVG(it.def).replace('<svg', '<svg width="26" height="16"')}</g>`
      : `<path d="M${cx - 9} 148 L${cx} 134 L${cx + 9} 148 Z" class="pm"/>`;
    const label = `<line x1="${cx}" y1="150" x2="${cx}" y2="${ly - 11}" class="tick"/><text x="${cx}" y="${ly}" class="${it.def ? 'mk-t ours' : 'mk-t'}">${it.def ? it.def.short : it.short}</text>`;
    return it.def ? `<g class="tl-hit" tabindex="0" role="button" data-id="${it.def.id}" aria-label="Open ${it.def.title}">${icon}${label}</g>` : `<g><title>${it.name}: ${it.note}</title>${icon}${label}</g>`;
  }).join('');
  let axis = '';
  for (const [a, b, x0, x1] of SEG) {
    axis += `<line x1="${x0}" y1="226" x2="${x1}" y2="226" class="axis"/>`;
    for (let yr = a; yr >= b; yr -= a < 2000 ? 100 : 50) axis += `<line x1="${x(yr)}" y1="226" x2="${x(yr)}" y2="232" class="tick"/><text x="${x(yr)}" y="248" class="ax-t">${yr} BC</text>`;
  }
  axis += `<text x="920" y="212" class="ax-t gap-t">750 years left out</text>`;
  const svg = `<svg class="timeline" viewBox="0 0 ${W} 262" role="img" aria-label="Timeline: Old Kingdom pyramids, 2700 to 2300 BC, and New Kingdom tombs, 1400 to 1250 BC">
    ${band}${kings}${axis}${marks}</svg>`;
  const cards = PYRAMIDS.map(p => `<button type="button" class="pcard" data-id="${p.id}">
      <span class="pcard-icon">${profileSVG(p, 44, 26)}</span>
      <span class="pcard-date">${p.date}</span><b>${p.short}</b>
      <span>${p.site} · King ${p.king}</span><span class="muted">Reign ${fmtReign(p)}</span></button>`).join('');
  const el = document.getElementById('timeline-view');
  el.innerHTML = `<header class="view-head"><div><div class="eyebrow">Old Kingdom and New Kingdom</div><h2>When they were built</h2>
      <p>Djoser’s Step Pyramid, the first, came about 50 years before the others. Five pyramids and the Sphinx were then built in under a century by three generations of one family: Sneferu, his son Khufu, and Khufu’s sons and grandson. Unas came about 150 years later, the first with texts carved inside. About 800 years after that, New Kingdom kings no longer built pyramids: they were buried in tombs cut into the Valley of the Kings, near Thebes (modern Luxor).</p></div></header>
    <div class="scroll-x">${svg}</div>
    <div class="pcards">${cards}</div>
    <div class="ctx-list">${CONTEXT.map(c => `<div><b>${c.name}</b> · ${c.place}, c. ${c.year} BC<br><span class="muted">${c.note}</span></div>`).join('')}</div>
    <p class="fine">Dates follow I. Shaw (ed.), <i>The Oxford History of Ancient Egypt</i> (2000). Other chronologies move them by a few decades. Each pyramid was built during its king’s reign; the year shown is approximate.</p>`;
}

function renderMap() {
  // Region: plain equirectangular projection, 10 px per km
  const lon0 = 31.00, lat1 = 30.10, k = 10 / 1000;
  const P = (lat, lon) => [((lon - lon0) * mLon(29.7) * k).toFixed(1), ((lat1 - lat) * M_LAT * k).toFixed(1)];
  const nile = [[30.10, 31.232], [30.044, 31.229], [30.00, 31.226], [29.95, 31.252], [29.90, 31.263], [29.85, 31.280], [29.80, 31.286], [29.75, 31.286], [29.70, 31.281], [29.60, 31.270], [29.50, 31.250], [29.40, 31.226], [29.33, 31.215]];
  const path = 'M' + nile.map(([a, b]) => P(a, b).join(' ')).join(' L');
  const site = (lat, lon, label, cls, id, dx = 8) => {
    const [px, py] = P(lat, lon);
    const tri = `<path d="M${px - 6} ${+py + 5} L${px} ${py - 6} L${+px + 6} ${+py + 5} Z" class="${cls}"/>`;
    const t = `<text x="${+px - dx}" y="${+py + 4}" class="map-t ${cls}" text-anchor="end">${label}</text>`;
    return id ? `<g class="tl-hit" tabindex="0" role="button" data-id="${id}" aria-label="Open ${label}">${tri}${t}</g>` : `<g>${tri}${t}</g>`;
  };
  const city = (lat, lon, label) => { const [px, py] = P(lat, lon); return `<circle cx="${px}" cy="${py}" r="3.5" class="city"/><text x="${+px + 8}" y="${+py + 4}" class="map-t city-t">${label}</text>`; };
  const box = (la0, lo0, la1, lo1, label) => { const [x0, y0] = P(la0, lo0), [x1, y1] = P(la1, lo1); return `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" class="inset-box"/><text x="${x0}" y="${y0 - 5}" class="map-t small">${label}</text>`; };
  const [w, h] = P(29.33, 31.42).map(Number);
  const region = `<svg viewBox="-10 -10 ${w + 20} ${h + 20}" class="map" role="img" aria-label="Map of the pyramid sites along the Nile">
    <rect x="-10" y="-10" width="${w + 20}" height="${h + 20}" class="desert"/>
    <path d="${path}" class="farmland"/><path d="${path}" class="river"/>
    ${box(30.00, 31.10, 29.95, 31.16, 'Giza')}${box(29.83, 31.18, 29.77, 31.24, 'Dahshur')}
    ${city(30.0444, 31.2357, 'Cairo (modern)')}${city(29.8467, 31.2550, 'Memphis, the Old Kingdom capital')}
    ${CONTEXT.map(c => site(c.lat, c.lon, c.short, 'other')).join('')}
    ${PYRAMIDS.filter(p => ['khufu', 'red', 'bent', 'unas', 'djoser'].includes(p.id)).map(p => site(p.lat, p.lon, p.id === 'khufu' ? 'Giza pyramids' : p.short, 'ours', p.id, p.id === 'djoser' ? -8 : 8)).join('')}
    <text x="${P(29.6, 31.29)[0]}" y="${P(29.6, 31.29)[1]}" class="map-t river-t" transform="rotate(-80 ${P(29.6, 31.29).join(' ')})">Nile</text>
    <g transform="translate(${w - 40},20)"><path d="M0 18 L6 0 L12 18 L6 13 Z" class="north"/><text x="6" y="32" class="map-t small" text-anchor="middle">N</text></g>
    <g transform="translate(10,${h - 20})"><line x1="0" y1="0" x2="100" y2="0" class="scale"/><text x="0" y="-6" class="map-t small">10 km</text></g>
  </svg>`;

  // Site plans at true scale: each pyramid drawn as its base square, aligned north
  const plan = (sites, extras, cLat, cLon, spanM, label, scaleM) => {
    const s = 600 / spanM;
    const Q = (lat, lon) => [300 + (lon - cLon) * mLon(cLat) * s, 300 - (lat - cLat) * M_LAT * s];
    const sq = sites.map(p => {
      const [px, py] = Q(p.lat, p.lon), r = p.rings[0][0] * s, rz = r * (p.zr ?? 1);
      return `<g class="tl-hit" tabindex="0" role="button" data-id="${p.id}" aria-label="Open ${p.title}">
        <rect x="${px - r}" y="${py - rz}" width="${2 * r}" height="${2 * rz}" class="${p.shape ? 'sphinx' : 'foot'}"/>
        ${p.shape ? '' : `<path d="M${px - r} ${py - rz} L${px + r} ${py + rz} M${px + r} ${py - rz} L${px - r} ${py + rz}" class="foot-x"/>`}
        <text x="${px}" y="${py + rz + 16}" class="map-t ours" text-anchor="middle">${p.short}</text></g>`;
    }).join('');
    const ex = extras.map(e => { const [px, py] = Q(e.lat, e.lon); return `<rect x="${px - 36.5 * s}" y="${py - 9.5 * s}" width="${73 * s}" height="${19 * s}" class="sphinx"/><text x="${px}" y="${py + 9.5 * s + 14}" class="map-t small" text-anchor="middle">${e.name}</text>`; }).join('');
    return `<svg viewBox="0 0 600 600" class="map" role="img" aria-label="${label}">
      <rect width="600" height="600" class="desert"/>${sq}${ex}
      <g transform="translate(560,20)"><path d="M0 18 L6 0 L12 18 L6 13 Z" class="north"/><text x="6" y="32" class="map-t small" text-anchor="middle">N</text></g>
      <g transform="translate(20,575)"><line x1="0" y1="0" x2="${scaleM * s}" y2="0" class="scale"/><text x="0" y="-6" class="map-t small">${scaleM} m</text></g>
    </svg>`;
  };
  const giza = PYRAMIDS.filter(p => p.site === 'Giza'), dah = PYRAMIDS.filter(p => p.site === 'Dahshur');
  const avg = (a, k) => a.reduce((t, p) => t + p[k], 0) / a.length;
  const el = document.getElementById('map-view');
  el.innerHTML = `<header class="view-head map-head"><div><div class="eyebrow">Lower Egypt</div><h2>Where they stand</h2>
      <p>All of these monuments sit on the desert edge west of the Nile, close to Memphis, the capital of the Old Kingdom. Giza and Dahshur are about 20 km apart, with Saqqara between them. Click a pin for details, then open it in 3D.</p></div>
      <div class="seg" role="group" aria-label="Map style"><button type="button" data-maptab="sat" aria-pressed="true">Satellite</button><button type="button" data-maptab="diagram" aria-pressed="false">Diagram</button></div></header>
    <div id="sat-wrap" class="sat-wrap">
      <div class="row-btns" role="group" aria-label="Jump to a site">
        <button type="button" class="text-btn" data-site="all">All sites</button><button type="button" class="text-btn" data-site="giza">Giza</button>
        <button type="button" class="text-btn" data-site="dahshur">Dahshur</button><button type="button" class="text-btn" data-site="saqqara">Saqqara</button>
        <button type="button" class="text-btn" data-site="meidum">Meidum</button><button type="button" class="text-btn" data-site="valley">Valley of the Kings</button></div>
      <div id="sat-map" role="region" aria-label="Satellite map"></div>
      <p class="fine">Satellite imagery and place names from Esri World Imagery. Orange squares show each pyramid\u2019s original base outline, drawn from its published size and coordinates.</p>
    </div>
    <div id="map-diagram" hidden>
      <p class="fine" id="map-note"></p>
      <div class="maps">
        <figure>${region}<figcaption>The region. River course simplified.</figcaption></figure>
        <figure>${plan(giza, [], avg(giza, 'lat') - 0.0005, avg(giza, 'lon') + 0.0015, 1500, 'Plan of the Giza plateau', 200)}<figcaption>Giza plateau, to scale.</figcaption></figure>
        <figure>${plan(dah, [], avg(dah, 'lat'), avg(dah, 'lon'), 2600, 'Plan of the Dahshur pyramids', 500)}<figcaption>Dahshur, to scale.</figcaption></figure>
      </div>
      <p class="fine">Positions from published site coordinates. Pyramid bases drawn at their true size and orientation.</p>
    </div>`;
}
for (const id of ['timeline-view', 'map-view']) {
  const el = document.getElementById(id);
  const go = e => { const t = e.target.closest('[data-id]'); if (t) switchTo(PYRAMIDS.find(p => p.id === t.dataset.id)); };
  el.addEventListener('click', go);
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(e); } });
}
renderTimeline();
renderMap();

// ======================================================================
// Satellite map (Leaflet + Esri World Imagery), with the diagram as a fallback
// ======================================================================
let satMap = null;
const SAT_CONTEXT = [
  ...CONTEXT,
  { name: 'Memphis', short: 'Memphis', place: 'Mit Rahina', lat: 29.8467, lon: 31.2550, note: 'The capital of Egypt in the Old Kingdom.' },
];
function showMapTab(tab, note) {
  for (const b of document.querySelectorAll('[data-maptab]')) b.setAttribute('aria-pressed', b.dataset.maptab === tab);
  document.getElementById('sat-wrap').hidden = tab !== 'sat';
  document.getElementById('map-diagram').hidden = tab !== 'diagram';
  if (note) document.getElementById('map-note').textContent = note;
  if (tab === 'sat') initSatMap();
}
function initSatMap() {
  if (!window.L) return showMapTab('diagram', 'Satellite imagery could not load here, so the diagram is shown instead.');
  if (satMap) { setTimeout(() => satMap.invalidateSize(), 0); return; }
  satMap = L.map('sat-map', { zoomSnap: 0.5, worldCopyJump: false }).setView([29.70, 31.19], 10);
  const imagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19, maxNativeZoom: 18,
    attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community',
  }).addTo(satMap);
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, maxNativeZoom: 18, opacity: 0.8 }).addTo(satMap);
  let fails = 0;
  imagery.on('tileerror', () => { if (++fails === 4) showMapTab('diagram', 'Satellite imagery could not load here, so the diagram is shown instead.'); });

  const pin = (cls, title, sub) => L.divIcon({ className: 'pin-wrap', html: `<span class="pin ${cls}"><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span>`, iconSize: null, iconAnchor: [0, 0] });
  const items = [];
  for (const p of PYRAMIDS) {
    const r = p.rings[0][0], dLa = r * (p.zr ?? 1) / M_LAT, dLo = r / mLon(p.lat);
    if (!p.terrain) L.rectangle([[p.lat - dLa, p.lon - dLo], [p.lat + dLa, p.lon + dLo]], { color: '#c96442', weight: 2, fill: false, interactive: false }).addTo(satMap);
    const m = L.marker([p.terrain ? p.lat : p.lat + dLa, p.lon], { icon: pin('ours', p.short, p.date), riseOnHover: true })   // pin sits on the north edge so the pyramid stays visible
      .bindPopup(`<div class="pop"><div class="eyebrow">${p.site} · ${p.date}</div><b>${p.title}</b><p>${p.features[0].text.split('. ')[0]}.</p><button type="button" class="text-btn" data-id="${p.id}">Open in 3D</button></div>`);
    items.push({ m, site: p.site, name: p.short, ours: true });
  }
  for (const c of SAT_CONTEXT) {
    const m = L.marker([c.lat, c.lon], { icon: pin('other', c.short, c.year ? `c. ${c.year} BC` : '') })
      .bindPopup(`<div class="pop"><div class="eyebrow">${c.place}${c.year ? ` · c. ${c.year} BC` : ''}</div><b>${c.name}</b><p>${c.note}</p></div>`);
    items.push({ m, site: c.place, name: c.short, ours: false });
  }
  // Pins that would overlap on screen merge into one pin per site; clicking it zooms in until they separate
  let groups = [];
  const regroup = () => {
    for (const g of groups) g.remove();
    groups = [];
    const pts = items.map(it => satMap.latLngToLayerPoint(it.m.getLatLng())), used = new Set();
    items.forEach((it, i) => {
      if (used.has(i)) return;
      const near = [i];
      items.forEach((jt, j) => { if (j > i && !used.has(j) && jt.site === it.site && pts[i].distanceTo(pts[j]) < 64) near.push(j); });
      near.forEach(j => used.add(j));
      if (near.length === 1) { if (!satMap.hasLayer(it.m)) it.m.addTo(satMap); return; }
      const list = near.map(j => items[j]);
      list.forEach(x => x.m.remove());
            const ll = L.latLngBounds(list.map(x => x.m.getLatLng()));
      const g = L.marker(ll.getCenter(), { icon: pin(list.some(x => x.ours) ? 'ours group' : 'other group', it.site, list.map(x => x.name).join(', ')), riseOnHover: true }).addTo(satMap);
      g.on('click', () => satMap.flyToBounds(ll, { padding: [120, 120], maxZoom: 17 }));
      groups.push(g);
    });
  };
  satMap.on('zoomend', regroup);
  regroup();
  setTimeout(() => satMap.invalidateSize(), 0);
}
const SITE_BOUNDS = {
  all: [[29.36, 31.10], [30.00, 31.30]],
  giza: [[29.9705, 31.1255], [29.9820, 31.1395]],
  dahshur: [[29.7855, 31.2010], [29.8135, 31.2140]],
  saqqara: [[29.8640, 31.2100], [29.8740, 31.2230]],
  meidum: [[29.3845, 31.1530], [29.3915, 31.1610]],
  valley: [[25.7365, 32.5975], [25.7435, 32.6055]],
};
document.getElementById('map-view').addEventListener('click', e => {
  const t = e.target.closest('[data-maptab]');
  if (t) return showMapTab(t.dataset.maptab);
  const s = e.target.closest('[data-site]');
  if (s && satMap) satMap.flyToBounds(SITE_BOUNDS[s.dataset.site], { duration: reduceMotion ? 0 : 1.2, padding: [20, 20] });
});

// ======================================================================
// Walk mode: first person at human eye height, following floors and slopes
// ======================================================================
const EYE = 1.65, WALK_SPEED = 1.4;
const walk = { on: false, x: 0, z: 0, feet: 0, eye: EYE, yaw: 0, pitch: 0, wheel: 0, drag: null, objs: [], rects: [], saved: null };
const walkRay = new THREE.Raycaster();
const torch = new THREE.PointLight(0xffd8a8, 0, 30, 1.6);   // a lamp you carry, lit only indoors
scene.add(torch);
const DOWN = V(0, -1, 0), UP = V(0, 1, 0);
const hud = document.getElementById('walkhud'), walkBtn = document.getElementById('btn-walk'), startSel = document.getElementById('walk-start');

function walkables() {
  const list = [ground];
  if (ctx.def.terrain?.dem) ctx.ext.built.traverse(o => { if (o.isMesh) list.push(o); });   // walk on the real hillside
  for (const o of ctx.pickables) {
    if (!o.isMesh || !visible(o)) continue;
    const f = ctx.byId[o.userData.fid];
    if (!f.scan && !f.mark && !f.shaft) list.push(o);
  }
  return list;
}
function floorAt(x, z, fromY) {
  walkRay.set(V(x, fromY, z), DOWN); walkRay.far = 400;
  return walkRay.intersectObjects(walk.objs, false)[0]?.point.y ?? null;
}
function headroom(x, feet, z) {
  walkRay.set(V(x, feet + 0.2, z), UP); walkRay.far = 4;
  const h = walkRay.intersectObjects(walk.objs, false)[0];
  return h ? h.distance + 0.2 : Infinity;
}
const inFootprint = (x, z) => {
  if (ctx.def.terrain) return !ctx.def.terrain.dem && ctx.def.terrain.h(x, z) > 1.2 && !inHole(ctx.def, x, z);   // inside the hillside
  const r = halfAt(ctx.def.rings, 0); return Math.abs(x) < r && Math.abs(z) < r * (ctx.def.zr ?? 1);
};
const lookDir = () => V(-Math.sin(walk.yaw) * Math.cos(walk.pitch), Math.sin(walk.pitch), -Math.cos(walk.yaw) * Math.cos(walk.pitch));
function placeCamera() {
  camera.position.set(walk.x, walk.feet + walk.eye, walk.z);
  controls.target.copy(camera.position).addScaledVector(lookDir(), 3);
  camera.lookAt(controls.target);
}
function setToggle(key, on) {
  toggles[key] = on;
  applyToggles();
}
function outsideStart() {
  const r = halfAt(ctx.def.rings, 0) * (ctx.def.zr ?? 1);
  return { p: V(0, 0, -r - 60), look: V(0, Math.min(22, ctx.def.rings[ctx.def.rings.length - 1][1] * 0.6), -r) };
}
function startWalk(p, look) {
  if (!walk.on) {
    walk.saved = { stone: toggles.stone, fov: camera.fov };
    walk.on = true; controls.enabled = false; anim = null;
    nav.zoom = nav.orbit = nav.panX = nav.panY = 0;
    if (!toggles.stone) setToggle('stone', true);
    camera.fov = 68; camera.updateProjectionMatrix();
    document.body.classList.add('walking');
    setContents(false); setHelp(false);
    hud.hidden = false; walkBtn.setAttribute('aria-pressed', true);
    fillStartPoints();
  }
  walk.objs = walkables();
  buildMinimap();
  walk.x = p.x; walk.z = p.z;
  walk.feet = floorAt(p.x, p.z, p.y + 1.0) ?? 0;
  walk.eye = Math.min(EYE, Math.max(0.6, headroom(walk.x, walk.feet, walk.z) - 0.12));
  walk.inside = Math.abs(walk.feet) > 0.05 || inFootprint(walk.x, walk.z);
  refreshLabels();
  const d = look.clone().sub(p);
  walk.yaw = Math.atan2(-d.x, -d.z);
  walk.pitch = THREE.MathUtils.clamp(Math.atan2(d.y, Math.hypot(d.x, d.z)), -0.9, 0.9);
  placeCamera();
}
function stopWalk() {
  if (!walk.on) return;
  walk.on = false; walk.drag = null; controls.enabled = true;
  camera.fov = walk.saved.fov; camera.updateProjectionMatrix();
  controls.target.copy(camera.position).addScaledVector(lookDir(), 10);
  if (!walk.saved.stone) setToggle('stone', false);
  document.body.classList.remove('walking');
  hud.hidden = true; walkBtn.setAttribute('aria-pressed', false);
  torch.intensity = 0;
}
function walkToFeature(id, ph) {
  if (ph) return startWalk(V(...ph.cam), V(...ph.look));
  const { c } = anchorOf(id);
  startWalk(c, c.clone().add(V(0, 0, 5)));
}
function fillStartPoints() {
  const opts = [['outside', 'Outside, north side']];
  for (const f of ctx.def.features) if (f.id !== 'pyramid' && !f.scan && !f.mark && !f.shaft && !(f.inscribed && f.id !== 'texts')) opts.push([f.id, f.name]);
  startSel.innerHTML = opts.map(([v, t]) => `<option value="${v}">${t}</option>`).join('');
}
startSel.addEventListener('change', () => {
  const v = startSel.value;
  if (v === 'outside') { const s = outsideStart(); startWalk(s.p, s.look); }
  else walkToFeature(v, ctx.byId[v].photos?.[0]);
  startSel.blur();
});
walkBtn.addEventListener('click', () => {
  if (walk.on) return stopWalk();
  if (tour.on) stopTour();
  setMode('model');
  // start in whatever is selected, if you can stand in it; otherwise outside the north face
  const id = ctx.selected;
  fillStartPoints();
  if (id && [...startSel.options].some(o => o.value === id)) { walkToFeature(id, ctx.byId[id].photos?.[0]); startSel.value = id; }
  else { const s = outsideStart(); startWalk(s.p, s.look); }
});
document.getElementById('walk-exit').addEventListener('click', stopWalk);

// Touch: hold the on-screen arrows to walk
for (const b of document.querySelectorAll('[data-walk]')) {
  const key = b.dataset.walk;
  b.addEventListener('pointerdown', e => { e.preventDefault(); nav.keys.add(key); });
  for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) b.addEventListener(ev, () => nav.keys.delete(key));
}

// Drag to look around
renderer.domElement.addEventListener('pointerdown', e => { if (walk.on) { walk.drag = [e.clientX, e.clientY]; renderer.domElement.setPointerCapture(e.pointerId); } });
renderer.domElement.addEventListener('pointermove', e => {
  if (!walk.on || !walk.drag) return;
  walk.yaw += (e.clientX - walk.drag[0]) * 0.0042;
  walk.pitch = THREE.MathUtils.clamp(walk.pitch + (e.clientY - walk.drag[1]) * 0.0042, -1.35, 1.35);
  walk.drag = [e.clientX, e.clientY];
  placeCamera();
});
renderer.domElement.addEventListener('pointerup', () => { walk.drag = null; });

function walkStep(dt) {
  const has = (...ks) => ks.some(x => nav.keys.has(x)) ? 1 : 0;
  const fwd = has('w', 'arrowup') - has('s', 'arrowdown');
  const strafe = has('d') - has('a');
  walk.yaw += (has('arrowleft') - has('arrowright')) * 1.6 * dt;
  let step = 0;
  if (Math.abs(walk.wheel) > 0.001) { step = walk.wheel * Math.min(1, dt * 10); walk.wheel -= step; } else walk.wheel = 0;
  const speed = WALK_SPEED * (nav.keys.has('shift') ? 4 : 1) * dt;
  const fx = -Math.sin(walk.yaw), fz = -Math.cos(walk.yaw), rx = Math.cos(walk.yaw), rz = -Math.sin(walk.yaw);
  const mx = fx * (fwd * speed + step) + rx * strafe * speed, mz = fz * (fwd * speed + step) + rz * strafe * speed;
  if (mx || mz) {
    // try the full move, then each axis on its own so you slide along walls
    for (const [dx, dz] of [[mx, mz], [mx, 0], [0, mz]]) {
      const nx = walk.x + dx, nz = walk.z + dz;
      const f = floorAt(nx, nz, walk.feet + 1.0);
      if (f === null || f > walk.feet + 0.95) continue;
      const onOpenGround = Math.abs(walk.feet) < 0.05 && !inFootprint(walk.x, walk.z);
      if (onOpenGround ? inFootprint(nx, nz) : f < walk.feet - 1.2) continue;   // solid masonry or a drop: treat as a wall
      walk.x = nx; walk.z = nz; walk.feet = f;
      break;
    }
  }
  const inside = Math.abs(walk.feet) > 0.05 || inFootprint(walk.x, walk.z);
  if (inside !== walk.inside) { walk.inside = inside; refreshLabels(); }
  // duck under low ceilings, like in the 1.2 m passages
  const want = Math.min(EYE, Math.max(0.6, headroom(walk.x, walk.feet, walk.z) - 0.12));
  walk.eye += (want - walk.eye) * Math.min(1, dt * 8);
  placeCamera();
  torch.position.copy(camera.position).addScaledVector(lookDir(), -0.9).add(V(0, 0.4, 0));   // held just behind your head
  torch.intensity = walk.inside ? 10 : 0;
  drawMinimap();
}

// ---------- Minimap: side view of the pyramid with your position ----------
const mm = document.getElementById('minimap'), mmg = mm.getContext('2d');
function buildMinimap() {
  const box = new THREE.Box3();
  walk.rects = walk.objs.filter(o => o !== ground).map(o => {
    box.setFromObject(o);
    return [box.min.z, box.max.z, box.min.y, box.max.y];
  });
  const dpr = Math.min(devicePixelRatio, 2);
  mm.width = mm.clientWidth * dpr; mm.height = mm.clientHeight * dpr;
}
function drawMinimap() {
  const W = mm.width, H = mm.height, zr = ctx.def.zr ?? 1, rings = ctx.def.rings.map(([r, y]) => [r * zr, y]), r0 = rings[0][0], top = rings[rings.length - 1][1];
  const low = Math.min(ctx.def.lowest, 0) - 6, span = Math.max(2 * r0 + 60, (top - low) * W / H);
  const k = W / span, X = z => W / 2 + z * k, Y = y => H - 8 - (y - low) * k * 0.98;
  mmg.clearRect(0, 0, W, H);
  mmg.fillStyle = '#e8dcc0'; mmg.fillRect(0, Y(0), W, H - Y(0));
  mmg.beginPath();
  if (ctx.def.terrain) {
    // the hillside above you, across the valley at your east–west position
    mmg.moveTo(X(-r0 - 40), Y(0));
    for (let z = -r0 - 40; z <= r0 + 40; z += 2) mmg.lineTo(X(z), Y(Math.max(0, ctx.def.terrain.h(walk.x, z))));
    mmg.lineTo(X(r0 + 40), Y(0));
  } else {
    rings.forEach(([r, y], i) => (i ? mmg.lineTo : mmg.moveTo).call(mmg, X(-r), Y(y)));
    [...rings].reverse().forEach(([r, y]) => mmg.lineTo(X(r), Y(y)));
  }
  mmg.closePath(); mmg.fillStyle = '#d6c39b'; mmg.fill(); mmg.strokeStyle = '#9c8456'; mmg.lineWidth = 1.5; mmg.stroke();
  mmg.fillStyle = 'rgba(120,80,40,.75)';
  for (const [z0, z1, y0, y1] of walk.rects) mmg.fillRect(X(z0), Y(y1), Math.max(1.5, (z1 - z0) * k), Math.max(1.5, (y1 - y0) * k));
  const px = X(walk.z), py = Y(walk.feet + walk.eye), d = lookDir();
  const len = 18 * (devicePixelRatio > 1 ? 2 : 1), hz = d.z, hy = d.y;
  const n = Math.hypot(hz, hy) || 1;
  mmg.fillStyle = 'rgba(201,100,66,.25)';
  mmg.beginPath(); mmg.moveTo(px, py);
  mmg.lineTo(px + (hz / n) * len - (hy / n) * len * 0.45, py - (hy / n) * len - (hz / n) * len * 0.45);
  mmg.lineTo(px + (hz / n) * len + (hy / n) * len * 0.45, py - (hy / n) * len + (hz / n) * len * 0.45);
  mmg.closePath(); mmg.fill();
  mmg.fillStyle = '#c96442'; mmg.beginPath(); mmg.arc(px, py, 4 * (devicePixelRatio > 1 ? 2 : 1), 0, Math.PI * 2); mmg.fill();
}


// ---------- Label layout ----------
// Every frame: the most important labels are placed first; any label that would overlap one already placed
// shrinks to a dot (pointing at it shows the name). Smaller features only get a full label once they are
// big enough on screen, so more names appear as you zoom in.
const _lv = new THREE.Vector3(), _ls = new THREE.Sphere(), _lb = new THREE.Box3();
// Points along each part of a feature where its label can sit. Long passages get one every few metres,
// so when you are close to one end the label stays on screen next to the part you can see.
function labelAnchors(id) {
  const pts = [], b = new THREE.Box3(), sz = new THREE.Vector3();
  ctx.groups[id].updateMatrixWorld(true);
  ctx.groups[id].traverse(o => {
    if (!o.isMesh || o.userData.solid === 'today') return;
    o.geometry.computeBoundingBox(); b.copy(o.geometry.boundingBox); b.getSize(sz);
    const ax = sz.x >= sz.y && sz.x >= sz.z ? 'x' : sz.z >= sz.y ? 'z' : 'y';
    const n = Math.min(24, Math.max(1, Math.ceil(sz[ax] / 6)));
    for (let i = 0; i < n; i++) {
      const p = b.getCenter(new THREE.Vector3());
      p[ax] = b.min[ax] + sz[ax] * (i + 0.5) / n;
      if (ax !== 'y') p.y = b.max.y;
      pts.push(p.applyMatrix4(o.matrixWorld));
    }
  });
  return pts;
}
// How big a feature looks: the size of a cube with the same volume, so thin shafts that spread far
// do not count as large and push the main chambers' labels aside
function labelSize(id, r) {
  let vol = 0; const sz = new THREE.Vector3();
  ctx.groups[id].traverse(o => { if (o.isMesh && o.userData.solid !== 'today') { o.geometry.computeBoundingBox(); o.geometry.boundingBox.getSize(sz); vol += Math.max(sz.x, 0.05) * Math.max(sz.y, 0.05) * Math.max(sz.z, 0.05); } });
  return Math.min(r, Math.max(0.5, Math.cbrt(vol)));
}
const _la = new THREE.Vector3();
const onScreen = (p, m) => { _la.copy(p).project(camera); return _la.z < 1 && Math.abs(_la.x) < m && Math.abs(_la.y) < m; };
function placeAnchor(o, u, whole) {
  // the whole feature fits on screen: one steady label above it; otherwise the nearest visible part
  let i = whole && onScreen(u.anchors[0], 0.9) ? 0 : (u.ai && onScreen(u.anchors[u.ai], 0.8) ? u.ai : -1);
  if (i < 0) {
    let best = Infinity;
    for (let k = 1; k < u.anchors.length; k++) {
      if (!onScreen(u.anchors[k], 0.8)) continue;
      const d = _la.x * _la.x + _la.y * _la.y;
      if (d < best) { best = d; i = k; }
    }
  }
  if (i < 0) i = 0;
  u.ai = i;
  o.position.copy(u.anchors[i]);
}
const _occ = new THREE.Raycaster();
const overlaps = (r, list) => list.some(q => r.x0 < q.x1 && r.x1 > q.x0 && r.y0 < q.y1 && r.y1 > q.y0);
function layoutLabels() {
  const W = renderer.domElement.clientWidth, H = renderer.domElement.clientHeight;
  const focal = (H / 2) / Math.tan(camera.fov * D / 2);
  const items = [];
  for (const o of ctx.labels) {
    if (!o.visible) continue;
    const u = o.userData, el = o.element;
    if (u.r === undefined) {
      if (u.id) { _lb.setFromObject(ctx.groups[u.id]).getBoundingSphere(_ls); u.r = _ls.radius; u.c = _ls.center.clone(); u.anchors = [o.position.clone(), ...labelAnchors(u.id)]; u.re = labelSize(u.id, u.r); } else u.r = 0;
    }
    if (!u.w && el.offsetWidth && !el.classList.contains('dot')) { u.w = el.offsetWidth; u.h = el.offsetHeight; }
    const dist = u.c ? Math.max(0.5, u.c.distanceTo(camera.position) - u.r * 0.5) : o.getWorldPosition(_lv).distanceTo(camera.position);
    if (u.anchors) placeAnchor(o, u, u.r / dist * focal < 0.6 * Math.min(W, H));
    o.getWorldPosition(_lv);
    _lv.project(camera);
    if (_lv.z > 1 || Math.abs(_lv.x) > 1.1 || Math.abs(_lv.y) > 1.1) continue;
    const sel = !!u.id && u.id === ctx.selected;
    const px = u.r ? u.re / dist * focal : 0;             // the feature's size on screen, in pixels
    const f = u.id && ctx.byId[u.id];
    const pr = sel ? 1e6 : u.quiet ? 5 : u.surround ? 60 : (u.major ? (f.scan || f.mark ? 70 : 100) : 0) + Math.min(px, 60);
    u.pos = o.getWorldPosition(new THREE.Vector3());
    items.push({ el, u, sel, px, pr, x: (_lv.x + 1) / 2 * W, y: (1 - _lv.y) / 2 * H });
  }
  items.sort((a, b) => b.pr - a.pr);
  // treat the floating panels as occupied, so labels never hide underneath them
  const now = performance.now();
  if (!layoutLabels.ui || now - layoutLabels.t > 400) {
    layoutLabels.t = now;
    const host = renderer.domElement.getBoundingClientRect();
    layoutLabels.ui = [...document.querySelectorAll('.topbar, .contents, .detail, .toolbar, .walkhud, .menu, .orient, .picker')]
      .filter(el => el.offsetWidth > 0).map(el => el.getBoundingClientRect())
      .map(r => ({ x0: r.left - host.left, x1: r.right - host.left, y0: r.top - host.top, y1: r.bottom - host.top }));
  }
  const placed = [...layoutLabels.ui], dots = [];
  const solid = toggles.stone && !toggles.cut && !indoors() ? [ctx.ext.built, ctx.ext.today].filter(g => g?.visible) : null;
  if (solid && now - (layoutLabels.tb ?? 0) > 200) layoutLabels.tb = now;
  for (const { el, u, sel, px, x, y } of items) {
    // behind solid stone? checked a few times a second
    if (!solid) u.behind = false;
    else if (layoutLabels.tb === now && (u.quiet || u.surround || sel)) {
      const p = u.pos, d = p.distanceTo(camera.position);
      _occ.set(camera.position, p.clone().sub(camera.position).normalize()); _occ.far = d - 1;
      u.behind = _occ.intersectObjects(solid, true).length > 0;
    }
    el.classList.toggle('behind', !!(u.behind && sel));
    if (u.behind && !sel) { el.classList.add('gone'); el.classList.remove('dot'); continue; }
    const w = (u.w || 90) + 6, h = (u.h || 22) + 4;
    const wantsFull = sel || u.quiet || u.surround || u.major || px > 28;
    let mode = 'gone', off = [0, -14];
    if (wantsFull) {
      // above the point first; if that is taken, beside or below it, before giving up to a dot
      for (const [dx, dy] of u.quiet ? [[0, 0]] : [[0, -14], [0, 16], [-(w / 2 + 12), 0], [w / 2 + 12, 0]]) {
        const rect = { x0: x + dx - w / 2, x1: x + dx + w / 2, y0: y + dy - h / 2, y1: y + dy + h / 2 };
        if (!overlaps(rect, placed)) { mode = 'full'; off = [dx, dy]; placed.push(rect); break; }
      }
    }
    if (mode === 'gone' && !u.quiet && (u.major || u.surround || px > 8)) {
      const d = { x0: x - 8, x1: x + 8, y0: y - 22, y1: y - 6 };
      if (!overlaps(d, placed) && !overlaps(d, dots)) { mode = 'dot'; dots.push(d); }
    }
    el.style.translate = mode === 'full' ? `${off[0]}px ${off[1]}px` : '0 -14px';
    el.classList.toggle('dot', mode === 'dot');
    el.classList.toggle('gone', mode === 'gone');
  }
}

// ---------- Links: #khufu opens a pyramid, #khufu/king opens a feature in it ----------
let lastHash = '';
function setHash(id) {
  lastHash = '#' + ctx.def.id + (id ? '/' + id : '');
  if (location.hash !== lastHash) history.replaceState(null, '', lastHash);
}
function openFromHash(fly) {
  const [pid, fid] = decodeURIComponent(location.hash.slice(1)).split(/[/.]/);
  const def = PYRAMIDS.find(p => p.id === pid) ?? KHUFU;
  if (!ctx || ctx.def !== def) load(def, fly);
  if (fid && ctx.byId[fid]) { setHelp(false); select(fid, true); } else setHash(null);
}
document.getElementById('btn-link').addEventListener('click', async () => {
  const note = document.getElementById('copied'), url = location.href;
  try { await navigator.clipboard.writeText(url); note.textContent = 'Link copied. Anyone who opens it lands right here.'; }
  catch (e) { note.innerHTML = `Copy this link: <input value="${url}" readonly onfocus="this.select()">`; }
  note.hidden = false;
  clearTimeout(note.t); note.t = setTimeout(() => { note.hidden = true; }, 4000);
});


// ======================================================================
// Guided tour: the camera moves along each pyramid's real route, stopping to explain each part
// ======================================================================
const TOUR_SPEED = 6;   // metres per second between stops
const tour = { on: false, stops: [], i: -1, pts: [], lens: [], total: 0, d: 0, moving: false, look: null, saved: null };
const tourHud = document.getElementById('tourhud'), tourBtn = document.getElementById('btn-tour');
function startTour() {
  if (!ctx.def.tour) return;
  if (walk.on) stopWalk();
  setMode('model'); setHelp(false); closeMenus();
  tour.saved = { stone: toggles.stone, fov: camera.fov };
  tour.on = true; tour.stops = ctx.def.tour(); anim = null;
  controls.enabled = false;
  if (!toggles.stone) { toggles.stone = true; toggles.today = true; applyToggles(); }
  camera.fov = 62; camera.updateProjectionMatrix();
  document.body.classList.add('touring');
  tourHud.hidden = false; tourBtn.setAttribute('aria-pressed', true);
  document.getElementById('tour-dots').innerHTML = tour.stops.map(() => '<i></i>').join('');
  goStop(0);
}
function stopTour() {
  if (!tour.on) return;
  tour.on = false; tour.moving = false;
  controls.enabled = true;
  camera.fov = tour.saved.fov; camera.updateProjectionMatrix();
  if (!tour.saved.stone) { toggles.stone = false; applyToggles(); }
  document.body.classList.remove('touring');
  tour.inside = false; refreshLabels();
  tourHud.hidden = true; tourBtn.setAttribute('aria-pressed', false);
  torch.intensity = 0;
}
function goStop(i) {
  tour.i = i;
  const st = tour.stops[i], f = ctx.byId[st.id];
  tour.pts = [camera.position.clone(), ...st.path];
  tour.lens = []; tour.total = 0;
  for (let k = 1; k < tour.pts.length; k++) { const l = tour.pts[k].distanceTo(tour.pts[k - 1]); tour.lens.push(l); tour.total += l; }
  tour.d = 0; tour.moving = true; tour.look = st.look;
  tour.dir = controls.target.clone().sub(camera.position).normalize();
  controls.enabled = false;
  document.getElementById('tour-step').textContent = `Guided tour \u00b7 ${i + 1} of ${tour.stops.length}`;
  document.getElementById('tour-title').textContent = f.name;
  document.getElementById('tour-say').textContent = st.say ?? f.why;
  [...document.getElementById('tour-dots').children].forEach((d, k) => d.className = k < i ? 'done' : k === i ? 'now' : '');
  document.getElementById('tour-back').disabled = i === 0;
  document.getElementById('tour-next').textContent = i === tour.stops.length - 1 ? 'Finish' : 'Next';
  ctx.selected = st.id; setEmissive(); refreshLabels(); setHash(st.id);
}
const _tl = new THREE.Vector3();
function tourStep(dt) {
  if (!tour.moving) return;
  // faster over long stretches, easing to a walking pace as the stop gets close
  tour.d = Math.min(tour.total, tour.d + Math.max(TOUR_SPEED, (tour.total - tour.d) * 1.4) * dt);
  // position along the path, heading along the current segment, turning toward the stop's view near the end
  let d = tour.d, k = 0;
  while (k < tour.lens.length - 1 && d > tour.lens[k]) { d -= tour.lens[k]; k++; }
  const a = tour.pts[k], b = tour.pts[k + 1] ?? a, t = tour.lens[k] ? d / tour.lens[k] : 1;
  camera.position.lerpVectors(a, b, t);
  const remaining = tour.total - tour.d;
  const ahead = b.distanceTo(a) > 0.01 ? b.clone().sub(a).normalize() : V(0, 0, 1);
  const toLook = tour.look.clone().sub(camera.position).normalize();
  const w = Math.min(1, Math.max(0, 1 - remaining / 6));   // blend into the final view over the last 6 m
  // turn smoothly toward where we are heading, so the view never swings backwards
  const want = ahead.lerp(toLook, w).normalize();
  tour.dir = (tour.dir ?? want.clone()).lerp(want, Math.min(1, dt * 5)).normalize();
  controls.target.copy(camera.position).addScaledVector(tour.dir, 3);
  camera.lookAt(controls.target);
  const cp = camera.position, inside = ctx.def.terrain ? cp.y < Math.max(0, ctx.def.terrain.h(cp.x, cp.z)) - 0.2 : inFootprint(cp.x, cp.z) || cp.y < 0;
  if (inside !== tour.inside) { tour.inside = inside; refreshLabels(); }
  torch.position.copy(camera.position).addScaledVector(tour.dir, -0.9); torch.intensity = inside ? 8 : 0;   // held just behind your head
  if (tour.d >= tour.total) {
    tour.moving = false;
    controls.target.copy(tour.look);   // at a stop you can drag to look around what is being described
    controls.enabled = true;
  }
}
tourBtn.addEventListener('click', () => tour.on ? stopTour() : startTour());
document.getElementById('welcome-tour').addEventListener('click', startTour);
document.getElementById('tour-exit').addEventListener('click', stopTour);
document.getElementById('tour-next').addEventListener('click', () => tour.i < tour.stops.length - 1 ? goStop(tour.i + 1) : stopTour());
document.getElementById('tour-back').addEventListener('click', () => tour.i > 0 && goStop(tour.i - 1));

// ---------- Where you are: compass, position in words, colour key ----------
const KEY_TEXT = { paint: 'Carved and painted walls', stage: 'Earlier building stages', faience: 'Blue faience tiles', lime: 'Built of limestone', granite: 'Granite and other hard stone', rock: 'Cut into the bedrock', shaft: 'Shafts and narrow tunnels', later: 'Dug later by robbers', scan: 'Found by scans, not entered', mark: 'Inscriptions and marks', texts: 'Pyramid Texts' };
const keyEl = document.getElementById('key'), keyBtn = document.getElementById('btn-key');
function buildKey() {
  const used = new Set(ctx.def.features.filter(f => f.id !== 'pyramid').map(f => f.color === 'stone' ? 'granite' : f.color));
  keyEl.innerHTML = Object.entries(KEY_TEXT).filter(([c]) => used.has(c)).map(([c, t]) => `<div><i style="background:var(--${c})"></i>${t}</div>`).join('')
    + (ctx.doors.length ? '<div><i class="door"></i>Opening in the outer face</div>' : '')
    + '<div><i style="background:var(--human)"></i>Person, 1.75 m tall</div>'
    + '<p class="key-conf"><span class="conf surveyed">Surveyed</span> measured figures <span class="conf approx">Approximate</span> simplified or estimated <span class="conf uncertain">Uncertain</span> known only from scans</p>';
}
keyBtn.addEventListener('click', () => { keyEl.hidden = !keyEl.hidden; keyBtn.setAttribute('aria-expanded', !keyEl.hidden); layoutLabels.t = 0; });
const rose = document.getElementById('compass-rose'), whereEl = document.getElementById('orient-where'), heightEl = document.getElementById('orient-height');
const SIDES = { 'z-': 'north', 'z+': 'south', 'x+': 'east', 'x-': 'west' };
function updateOrient() {
  const f = controls.target.clone().sub(camera.position);
  rose.setAttribute('transform', `rotate(${Math.atan2(f.x, -f.z) * -180 / Math.PI})`);
  const p = camera.position, rings = ctx.def.rings, zr = ctx.def.zr ?? 1, r = halfAt(rings, Math.max(0, p.y));
  const m = Math.max(Math.abs(p.x), Math.abs(p.z) / zr);
  const side = SIDES[Math.abs(p.x) > Math.abs(p.z) ? (p.x > 0 ? 'x+' : 'x-') : (p.z > 0 ? 'z+' : 'z-')];
  const inside = p.y >= 0 && m < r && !ctx.def.shape && !ctx.def.terrain;
  whereEl.textContent = ctx.def.terrain ? (p.y < ctx.def.terrain.h(p.x, p.z) - 0.5 ? (p.y < 0 ? 'Underground, in the tomb' : 'Inside the hillside') : 'In the valley') : p.y < 0 ? (m < rings[0][0] + 30 ? 'Below ground, in the bedrock' : 'Below ground') : inside ? `Inside the ${ctx.def.kind ?? 'pyramid'}` : p.y > rings[rings.length - 1][1] * 1.4 || m > rings[0][0] * 4 ? `Above the ${side} side` : `Outside, ${side} side`;
  // the nearest named part, if one is close
  let near = null, best = Math.max(12, r * 0.15);
  for (const o of ctx.labels) {
    const u = o.userData;
    if (!u.id || !u.anchors || !ctx.groups[u.id].visible) continue;
    for (const a of u.anchors) { const d = a.distanceTo(p); if (d < best) { best = d; near = ctx.byId[u.id].name; } }
  }
  const h = Math.round(p.y);
  heightEl.textContent = (Math.abs(h) < 1 ? 'At ground level' : h > 0 ? `${h} m above the base` : `${-h} m below the base`) + (near ? ` \u00b7 near ${near}` : '');
}
// Top bar: drop the title, then the place and date under the monument's name, until it fits
const topbar = document.querySelector('.topbar');
function fitTopbar() {
  topbar.classList.remove('tight1', 'tight2');
  for (const c of ['tight1', 'tight2']) {
    if (topbar.scrollWidth <= topbar.clientWidth + 1) break;
    topbar.classList.add(c);
  }
}

// Resize and loop
function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h); labelRenderer.setSize(w, h);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  fitTopbar();
}
document.fonts?.ready.then(fitTopbar);
addEventListener('resize', resize);
resize();

setMode('model');
openFromHash(false);
setHelp(!helpSeen && !location.hash.includes('/'));   // first visit: the start screen, unless a link points at a feature
addEventListener('hashchange', () => { if (location.hash !== lastHash) openFromHash(true); });

const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
let lastFrame = performance.now();
renderer.setAnimationLoop(now => {
  const dt = Math.min(0.1, (now - lastFrame) / 1000); lastFrame = now;
  if (tour.on) tourStep(dt); else stepNav(dt);
  if (anim) {
    const t = Math.min(1, (now - anim.t0) / anim.dur), k = ease(t);
    controls.target.lerpVectors(anim.ft, anim.tt, k);
    camera.position.lerpVectors(anim.fp, anim.tp, k);
    if (t === 1) anim = null;
  }
  if (ctx.mats.bigVoid && ctx.groups.bigVoid.visible) ctx.mats.bigVoid.opacity = 0.32 + 0.14 * Math.sin(now / 600);
  controls.update();
  if (ctx.recesses.length) syncRecesses();
  if (ctx.interior) syncInterior();
  if (now - (fadeInside.t ?? 0) > 120) { fadeInside.t = now; fadeInside(); }
  renderer.render(scene, camera);
  layoutLabels();
  labelRenderer.render(scene, camera);
  if (now - (updateOrient.t ?? 0) > 150) { updateOrient.t = now; updateOrient(); }
});
