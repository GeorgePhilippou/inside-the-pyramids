// The Step Pyramid of Djoser, Saqqara (c. 2650 BC), the first pyramid.
// Model units are metres: origin at the centre of the base, +x east, +y up, +z south.
// Overall size, stage sizes, shaft and east-shaft depths are published figures (Lauer; Firth & Quibell).
// The underground network is nearly 6 km long; only its main lines are drawn, simplified.
export default function djoser(api) {
  const { THREE, V, D, up, ph, COL, passage, room, gabledRoom, corbelRoom, route, person, frame, put, halfAt, wallImage, extraMat } = api;

  const RX = 121 / 2, RZ = 109 / 2, ZR = RZ / RX;      // 121 m east–west, 109 m north–south
  const STEPS = [11.5, 11.0, 10.5, 10.2, 9.8, 9.5];    // six steps, 62.5 m in all; individual heights approximate
  const BATTER = 0.3, TREAD = 5.0;                     // each step leans in at about 73°
  const rings = [[RX, 0]];
  { let r = RX, y = 0;
    STEPS.forEach((h, i) => { y += h; r -= h * BATTER; rings.push([r, y]); if (i < STEPS.length - 1) { r -= TREAD; rings.push([r, y]); } }); }
  const lvl = -28;                                     // floor of the shaft and the main galleries
  const entranceTop = V(0, 0, -RZ - 26), shaftN = V(0, -22, -3.5);

  return {
    id: 'djoser', king: 'Djoser', reign: [2667, 2648], year: 2650, lat: 29.87111, lon: 31.21639,
    short: 'Djoser', site: 'Saqqara', date: 'c. 2650 BC', title: 'The Step Pyramid of Djoser',
    rings, zr: ZR, lowest: -33, start: 'vault',
    tour: () => [
      { id: 'pyramid', path: [V(20, 1.65, -RZ - 70)], look: V(0, 25, 0), say: 'The first pyramid ever built, about 4,650 years ago, for King Djoser. His architect Imhotep stacked six stone steps, each smaller than the one below.' },
      { id: 'stages', path: [V(95, 30, -60)], look: V(0, 10, 0), say: 'It grew in stages. It began as a low, square, flat-topped tomb (a mastaba), was enlarged twice, then turned into a four-step and finally a six-step pyramid.' },
      { id: 'entrance', path: [V(0, 1.65, entranceTop.z - 6), up(entranceTop, 1.2), up(entranceTop.clone().lerp(shaftN, 0.6), 1.2)], look: up(shaftN, 1.2), say: 'The way in starts north of the pyramid and slopes down through the rock to the great shaft.' },
      { id: 'shaft', path: [up(shaftN, 1.2), V(0, -12, 0)], look: V(0, lvl, 0), say: 'The central shaft: 7 m square and 28 m deep. At the bottom sits the granite burial vault.' },
      { id: 'vault', path: [V(2.6, lvl + 1.4, 2.6)], look: V(0, lvl + 0.9, 0), say: 'The burial vault, built of granite. It was closed from above with a granite plug weighing about 3.5 tonnes.' },
      { id: 'blue', path: [V(10, lvl + 1.6, 0), V(17, lvl + 1.6, 0)], look: V(26, lvl + 1.2, 0), say: 'The blue chambers. Their walls are covered with blue faience tiles imitating reed matting, and carved panels show Djoser running the ritual course of his jubilee festival.' },
      { id: 'eastShafts', path: [V(40, -6, -36)], look: V(40, -20, 0), say: 'Eleven deep shafts along the east side. The first five held burials of the royal family; the others led to galleries packed with stone vessels.' },
      { id: 'serdab', path: [V(18, 1.6, -RZ - 6)], look: V(12, 1.5, -RZ - 1.4), say: 'The serdab: a sealed stone box against the north face. A statue of Djoser sat inside, looking out through two eye holes.' },
    ],
    stats: [['Height', '62.5 m'], ['Base', '121 × 109 m']],
    sources: 'J.-P. Lauer, <i>La pyramide à degrés</i> (1936–39); C. M. Firth &amp; J. E. Quibell, <i>The Step Pyramid</i> (1935); M. Lehner, <i>The Complete Pyramids</i> (2008). Overall size, the building stages, the shaft and the east shafts are published figures. Step heights and the underground network are simplified.',
    features: [
      { id: 'pyramid', group: 'Exterior', name: 'The pyramid', color: 'sand', conf: 'surveyed',
        why: 'It is the oldest large stone building in the world, and the model every later pyramid grew from.',
        text: 'Built for King Djoser of the 3rd Dynasty, probably designed by his official Imhotep. Six steps of limestone rise to 62.5 m. It is longer east–west than north–south, because it grew out of an older tomb in several stages.',
        facts: [['Base', '121 E–W × 109 m N–S'], ['Height', '62.5 m'], ['Steps', '6'], ['Volume', 'c. 330,400 m³']] },
      { id: 'stages', group: 'Exterior', name: 'Building stages', color: 'stage', conf: 'approx', major: true,
        why: 'The stages show the idea of a pyramid being invented: a flat tomb was stacked upward, step by step.',
        text: 'It began as a square mastaba 63 m wide and 8.4 m high (M1). It was cased again (M2), then extended 8.4 m to the east (M3). Next came a four-step pyramid 42 m high (P1), enlarged to six steps (P1′) and finished with a final casing (P2). The outlines show the mastaba stages and the four-step pyramid; their exact positions are approximate.',
        facts: [['M1', '63 m square, 8.4 m high'], ['M2', '71.5 m square'], ['M3', '79.5 × 71.5 m'], ['P1', '85.5 × 77 m, 4 steps, 42 m'], ['P2', '121 × 109 m, 6 steps']] },
      { id: 'serdab', group: 'Exterior', name: 'Serdab', color: 'lime', conf: 'approx',
        why: 'It held the oldest known life-size royal statue, placed so the king could watch the offerings.',
        text: 'A small sealed chamber leaning against the north face. A seated statue of Djoser looked out through two eye holes in its north wall. The statue is now in the Egyptian Museum in Cairo; a copy sits in its place.',
        facts: [['Eye holes', '2'], ['Statue', 'Egyptian Museum, Cairo'], ['Position', 'Approximate']] },
      { id: 'entrance', group: 'Underground', name: 'North entrance passage', color: 'rock', conf: 'approx', major: true,
        why: 'Putting the entrance on the north became a rule that lasted through the whole pyramid age.',
        text: 'The way in begins north of the pyramid, in the court of the north temple, and slopes down through the bedrock to the central shaft.',
        facts: [['Starts', 'North of the pyramid'], ['Route', 'Simplified']] },
      { id: 'shaft', group: 'Underground', name: 'Central shaft', color: 'rock', conf: 'surveyed', major: true,
        why: 'It is the heart of the tomb: the burial vault was built at its foot before the pyramid rose above it.',
        text: 'A huge square shaft cut straight down into the rock beneath the pyramid. After the burial it was filled with stone.',
        facts: [['Size', '7 × 7 m'], ['Depth', '28 m']] },
      { id: 'vault', group: 'Underground', name: 'Granite burial vault', color: 'granite', conf: 'approx', major: true,
        why: 'Granite brought from Aswan shows how much effort went into protecting the king’s body.',
        text: 'A small chamber of granite blocks at the bottom of the shaft, entered through a round hole in its roof. After the burial the hole was sealed with a granite plug. Earlier, a limestone chamber decorated with stars may have stood here.',
        facts: [['Material', 'Granite, 4 courses'], ['Size shown', 'c. 3 × 1.65 m, approximate']] },
      { id: 'plug', group: 'Underground', name: 'Granite plug', color: 'granite', conf: 'approx',
        why: 'A simple, heavy seal: once lowered, it could not be lifted from inside.',
        text: 'A granite stopper lowered into the hole in the vault’s roof to close it after the burial.',
        facts: [['Weight', 'c. 3.5 tonnes']] },
      { id: 'galleries', group: 'Underground', name: 'Galleries', color: 'rock', conf: 'approx',
        why: 'The underground palace gave the king rooms and stores for eternity, like the palace he lived in.',
        text: 'A maze of corridors and rooms cut in the rock around the shaft, nearly 6 km in all. Only the main lines are drawn here.',
        facts: [['Total length', 'c. 5.7 km'], ['Layout', 'Simplified']] },
      { id: 'blue', group: 'Underground', name: 'Blue chambers', color: 'faience', conf: 'approx', major: true,
        why: 'They are among the earliest decorated royal rooms, and show what the king’s palace may have looked like.',
        text: 'Rooms east of the shaft whose walls are lined with thousands of small blue-green faience tiles, set to look like reed matting hung on a palace wall. Three carved panels show Djoser performing rituals of the Heb-sed, his jubilee festival.',
        facts: [['Tiles', 'Blue-green faience'], ['Reliefs', '3 panels of the king'], ['Position', 'Approximate']] },
      { id: 'eastShafts', group: 'Underground', name: 'Eleven east shafts', color: 'rock', conf: 'approx',
        why: 'They show the royal family being buried with the king, inside his monument.',
        text: 'A row of eleven deep shafts along the east side, later covered when the mastaba was extended. Shafts I–V held burials of the royal family. Shafts VI–XI led to galleries filled with over 40,000 stone vessels, some carrying the names of earlier kings.',
        facts: [['Shafts', '11'], ['Depth', 'c. 32–33 m'], ['Stone vessels', 'Over 40,000']] },
    ],
    build() {
      const M = api.ctx.mats;
      // Building stages: earlier mastabas and the four-step pyramid, as outlines with a faint fill
      const stage = (w, d, h, cx, y0 = 0) => { const m = room('stages', cx - w / 2, cx + w / 2, y0, y0 + h, -d / 2, d / 2); return m; };
      stage(63, 63, 8.4, 0);
      stage(71.5, 71.5, 8.4, 0);
      stage(79.5, 71.5, 8.4, 4.2);
      { let w = 85.5, d = 77, y = 0;
        [11.5, 10.6, 10.2, 9.7].forEach(h => { stage(w, d, h, 4.2, y); y += h; w -= 2 * (h * 0.3 + 4.2); d -= 2 * (h * 0.3 + 4.2) * 77 / 85.5; }); }
      M.stages.opacity = 0.05;   // outlines matter more than the fill

      // Entrance passage, central shaft, vault and plug
      passage('entrance', entranceTop, shaftN, 1.6, 1.8);
      room('shaft', -3.5, 3.5, lvl, 0, -3.5, 3.5);
      M.shaft.opacity = 0.32;
      room('vault', -1.5, 1.5, lvl, lvl + 1.65, -0.83, 0.83);
      { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.6, 24), M.plug);
        p.position.set(0, lvl + 1.65 + 0.8, 0); put('plug', p); }

      // Main galleries (simplified): a ring round the shaft and long arms north, west and south
      const g = (a, b) => passage('galleries', V(a[0], lvl, a[1]), V(b[0], lvl, b[1]), 1.4, 1.9);
      g([-9, -9], [9, -9]); g([9, -9], [9, 9]); g([9, 9], [-9, 9]); g([-9, 9], [-9, -9]);
      g([0, -3.5], [0, -9]); g([-3.5, 0], [-9, 0]); g([0, 3.5], [0, 9]);
      g([0, -9], [0, -34]); g([-9, 0], [-38, 0]); g([0, 9], [0, 30]);
      for (const z of [-16, -22, -28]) g([0, z], [-14, z]);
      for (const x of [-16, -24, -32]) g([x, 0], [x, 14]);

      // Blue chambers east of the shaft
      g([9, 0], [16, 0]);
      room('blue', 16, 28, lvl, lvl + 2.1, -1.6, 1.6);
      room('blue', 22, 25, lvl, lvl + 2.1, -6, -1.6);
      room('blue', 22, 25, lvl, lvl + 2.1, 1.6, 6);

      // Eleven east shafts, each with a gallery running west from its foot
      for (let i = 0; i < 11; i++) {
        const z = -27.5 + i * 5.5;
        room('eastShafts', 39.2, 40.8, -32, 0, z - 0.8, z + 0.8);
        passage('eastShafts', V(39.2, -32, z), V(30, -32, z), 1.1, 1.6);
      }

      // Serdab against the north face
      room('serdab', 10.8, 13.2, 0, 3.0, -RZ - 2.6, -RZ);

      person(1.2, lvl, 1.8, 0.4);
      person(20, lvl, 0.4, -1.2);
      person(14, 0, -RZ - 4, Math.PI);
      person(4, 0, -RZ - 8, 2.6);
    },
  };
}
