// The tomb of Seti I, KV 17, Valley of the Kings (c. 1279 BC).
// Model units are metres: origin at the top of the entrance, +x east, +y up, +z south.
// Built along its own axis (running toward -x), then turned to its true bearing of 218.68° (south-west).
// Room and corridor sizes are the Theban Mapping Project survey. Floor levels and the slope of the
// unexcavated tunnel K are not published room by room, so depths are approximate.
export default function seti(api) {
  const { THREE, V, D, up, ph, COL, passage, room, gabledRoom, corbelRoom, route, person, frame, put, halfAt, wallImage, extraMat } = api;

  const PHI = (270 - 218.68) * D, c = Math.cos(PHI), s = Math.sin(PHI);
  const W = (x, y, z) => V(x * c + z * s, y, -x * s + z * c);             // tomb axis -> world
  const L = (x, z) => [x * c - z * s, x * s + z * c];                       // world -> tomb axis
  // Floors along the tomb (approximate), from the top of the entrance
  const f = { B: -5.0, C: -7.2, D: -11.66, E: -13.6, Fa: -14.4, G: -17.2, H: -20.5, I: -22.4, Jlow: -24.0 };
  const ax = { B: [-16.81, -27.42], C: [-28.5, -36.22], D: [-37.18, -46.27], E: [-47.37, -51.02], F: [-52.06, -60.49], I: [-77.85, -83.1], J: [-84.14, -98.4] };
  const gz = 2.75;                                                          // the axis steps left after hall F
  const Jup = -92.0;                                                        // where the raised pillared part of J ends
  const kA = V(-96.6, f.Jlow, gz - 1.2), kDir = V(-Math.cos(7.51 * D), -0.2, -Math.sin(7.51 * D)).normalize();
  const kB = kA.clone().addScaledVector(kDir, 174);
  const ridge = xl => Math.min(72, Math.max(0, (-6 - xl) * 0.62));
  const terrain = (() => {
    const pts = [[45, -90], [45, 90], [-300, 90], [-300, -90]].map(([x, z]) => W(x, 0, z));
    const xs = pts.map(p => p.x), zs = pts.map(p => p.z);
    return {
      size: [Math.max(...xs) - Math.min(...xs), Math.max(...zs) - Math.min(...zs)], center: [(Math.max(...xs) + Math.min(...xs)) / 2, (Math.max(...zs) + Math.min(...zs)) / 2], step: 3,
      h: (x, z) => { const [xl, zl] = L(x, z), r = ridge(xl); return r > 0 ? r * (1 - 0.3 * (zl / 90) ** 2) + 1.6 * Math.sin(xl * 0.09) * Math.cos(zl * 0.11) * Math.min(1, r / 6) : 0; },
      holes: [[[0.3, -1.4], [0.3, 1.4], [-15.81, 1.4], [-15.81, -1.4]].map(([x, z]) => { const p = W(x, 0, z); return [p.x, p.z]; })],
    };
  })();
  const wp = (x, y, z) => W(x, y, z);

  return {
    id: 'seti', kind: 'tomb', king: 'Seti I', reign: [1294, 1279], year: 1279, lat: 25.740294, lon: 32.602051, entranceY: 7.47,
    short: 'Seti I', site: 'Valley of the Kings', date: 'c. 1279 BC', title: 'The tomb of Seti I (KV 17)',
    rings: [[60, 0], [60, 0.01]], terrain, rotateY: PHI, cut: W(0, 0, 1).toArray(), lowest: kB.y - 2, start: 'burial',   // the cut runs along the tomb's axis
    overview: { t: W(-60, -16, 0).toArray(), p: W(-30, 70, -150).toArray() },
    profile: [[0, 0], [-15.8, f.B], [-27.4, f.C], [-36.2, f.D], [-46.3, f.E], [-60.5, f.E], [-70.5, f.H], [-83.1, f.I], [-92, f.I], [-92, f.Jlow], [-98.4, f.Jlow], [-98.4, f.Jlow + 6.05], [-84, f.I + 3.6], [-60.5, f.E + 3.2], [-46.3, f.E + 2.8], [-16.8, f.B + 2.6], [-12, 0]],
    tour: () => [
      { id: 'pyramid', path: [wp(18, 1.65, 10)], look: wp(-10, -2, 0), say: 'Seti I’s tomb is the longest and most completely decorated in the valley. Giovanni Belzoni found it on 16 October 1817.' },
      { id: 'entry', path: [wp(1, 1.65, 0), wp(-14, f.B + 1.8, 0)], look: wp(-22, f.B, 0), say: 'Twenty-six ancient steps lead down to the first corridor.' },
      { id: 'corrB', path: [wp(-18, f.B + 1.65, 0), wp(-25, f.C + 1.9, 0)], look: wp(-32, f.C - 1, 0), say: 'From here on almost every surface is carved in fine raised relief and painted. These walls carry the Litany of Ra, praising the sun god in his many forms.' },
      { id: 'stairC', path: [wp(-29, f.C + 1.65, 0), wp(-35.4, f.D + 1.8, 0)], look: wp(-42, f.D, 0), say: 'A steep stairway descending at about 30 degrees, then another corridor with the fourth and fifth hours of the Amduat.' },
      { id: 'well', path: [wp(-46.6, f.E + 1.65, 0), wp(-48.2, f.E + 1.65, 1.7)], look: wp(-49.2, f.E - 3, 0), say: 'The well chamber. A deep shaft cut through the floor may have caught flood water, or stopped robbers. Belzoni had to bridge it.' },
      { id: 'hallF', path: [wp(-53, f.E + 1.65, 0), wp(-57, f.E + 1.65, -1.5)], look: wp(-58, f.E + 1.8, 3), say: 'The first pillared hall, with scenes from the Book of Gates, including the four peoples of the world shown with different features for the first time.' },
      { id: 'corrG', path: [wp(-59, f.E + 1.3, gz), wp(-66, f.G - 1.4 + 1.65, gz), wp(-74, f.H - 1.1 + 1.65, gz)], look: wp(-80, f.I + 1, gz), say: 'Down the left side of the hall and on through corridors showing the Opening of the Mouth ritual.' },
      { id: 'burial', path: [wp(-85, f.I + 1.65, gz), wp(-90.5, f.I + 1.65, gz)], look: wp(-97, f.Jlow + 4, gz), say: 'The burial chamber: a hall of six pillars, then steps down into a sunken room with a vaulted ceiling painted with the stars and constellations of the night sky.' },
      { id: 'tunnelK', path: [wp(-95.5, f.Jlow + 1.65, gz - 1.2)], look: wp(-110, f.Jlow - 3, gz - 3), say: 'Under the spot where the sarcophagus stood, a tunnel runs on into the rock for 174 m. It was only fully cleared between 2007 and 2010, and ends abruptly, unfinished.' },
    ],
    stats: [['Length', '137.2 m'], ['Plus tunnel', '174 m']],
    sources: 'Theban Mapping Project, KV 17 survey (room sizes, orientation, decoration); G. Belzoni, <i>Narrative of the Operations and Recent Discoveries</i> (1820); E. Hornung, <i>The Tomb of Pharaoh Seti I</i> (1991); Z. Hawass, excavation of corridor K (2007–2010). Room and corridor sizes are surveyed. Floor levels are approximate, and the slope of corridor K is a guess.',
    features: [
      { id: 'pyramid', group: 'Outside', name: 'The hillside', color: 'sand', conf: 'approx',
        why: 'It is the first royal tomb decorated from end to end, and it set the pattern for the rest of the 19th Dynasty.',
        text: 'The tomb is cut into the foot of a sloping hill in the south-east branch of the valley. It is 137 m long, the longest and deepest tomb in the Valley of the Kings, and almost every wall is carved and painted. The hill shape here is approximate.',
        facts: [['Found', '16 October 1817, Belzoni'], ['Total length', '137.19 m (tunnel K extra)'], ['Floor area', '649 m²'], ['Axis', '218.68° (south-west)']] },
      { id: 'entry', group: 'Upper corridors', name: 'Entrance stairway', color: 'rock', conf: 'surveyed',
        why: 'The open stairway is the only undecorated part before the burial chamber.',
        text: 'Twenty-six ancient steps cut into the slope, now preceded by modern steps and retaining walls.',
        facts: [['Length', '15.81 m'], ['Width', '2.71 m'], ['Steps', '26']] },
      { id: 'corrB', group: 'Upper corridors', name: 'First corridor', color: 'paint', conf: 'surveyed',
        why: 'The Litany of Ra here appears for the first time in a royal tomb.',
        text: 'A sloping corridor decorated with the Litany of Ra, a hymn naming the sun god’s 75 forms.',
        facts: [['Length', '10.61 m'], ['Width', '2.62 m'], ['Height', '2.58 m']] },
      { id: 'stairC', group: 'Upper corridors', name: 'Stairwell and second corridor', color: 'paint', conf: 'surveyed',
        photos: () => [ph('seti-corridor.jpg', 'A winged serpent with human legs and columns of coloured hieroglyphs carved in relief', 'Corridor D: a winged serpent from the fourth hour of the Amduat, carved in raised relief and painted.', 'Carole Raddato', 'CC BY-SA 2.0', 'https://commons.wikimedia.org/wiki/File:KV17,_the_tomb_of_Pharaoh_Seti_I_of_the_Nineteenth_Dynasty,_Corridor_D_decorated_with_the_fourth_hour_of_the_Amduat,_Valley_of_the_Kings,_Egypt_(49846343896).jpg', wp(-41, -11.0, -0.6), wp(-43.6, -11.3, 1.3))],
        why: 'The steep descent takes the tomb quickly deep into the rock.',
        text: 'Steps descend at a steep 30 degrees, with recesses cut high in the walls and more of the Litany of Ra. The next corridor shows the fourth and fifth hours of the Amduat.',
        facts: [['Stairwell', '7.72 × 2.6 m, 30°'], ['Corridor', '9.09 × 2.61 m']] },
      { id: 'well', group: 'Upper corridors', name: 'Well chamber', color: 'paint', conf: 'approx', major: true,
        why: 'Its shaft, and the decorated wall at its far end, were meant to make robbers think the tomb ended here.',
        text: 'A room with a shaft cut through its floor. Its walls show Seti I with Anubis, Horus, Isis, Hathor and Osiris, under a ceiling of yellow stars on blue. The shaft has not been fully cleared, so its depth is drawn approximately.',
        facts: [['Room', '4.17 × 3.65 m'], ['Height', '2.46 m'], ['Shaft depth', 'Not fully cleared']] },
      { id: 'hallF', group: 'Pillared halls', name: 'First pillared hall', color: 'paint', conf: 'surveyed', major: true,
        photos: () => [ph('seti-hall.jpg', 'Two painted pillars showing the king with goddesses, framing a wall of painted figures', 'The first pillared hall: Seti I with Hathor and Isis on the pillars, the Book of Gates on the wall beyond.', 'Carole Raddato', 'CC BY-SA 2.0', 'https://commons.wikimedia.org/wiki/File:KV17,_the_tomb_of_Pharaoh_Seti_I_of_the_Nineteenth_Dynasty,_Pillared_Chamber_F,_left_pillar_Seti_before_Hathor_as_Goddess_of_the_West,_right_pillar_Seti_before_Isis,_Valley_of_the_Kings,_Egypt_(49846646197).jpg', wp(-52.7, f.E + 1.6, 0), wp(-60.4, f.E + 1.5, 0))],
        why: 'Its Book of Gates scene shows the four peoples known to Egypt, each with their own features and dress.',
        text: 'A square hall with four pillars, decorated with the fourth and fifth divisions of the Book of Gates. On the rear wall Horus presents the king to Osiris and Hathor. A stair down through the left side of the floor continues the tomb, shifting its axis to the left.',
        facts: [['Size', '8.43 × 7.95 m'], ['Height', '3.16 m'], ['Pillars', '4']] },
      { id: 'sideFa', group: 'Pillared halls', name: 'Side hall', color: 'paint', conf: 'approx',
        why: 'It shows the ninth to eleventh hours of the night journey of the sun.',
        text: 'A side hall with two pillars, its floor a few steps lower than the first pillared hall. Its walls carry the ninth, tenth and eleventh hours of the Amduat. Its position here is approximate.',
        facts: [['Size', '8.62 × 7.86 m'], ['Height', '3.67 m'], ['Pillars', '2']] },
      { id: 'corrG', group: 'Lower corridors', name: 'Lower corridors', color: 'paint', conf: 'surveyed',
        why: 'The Opening of the Mouth ritual gave the king back his senses for the afterlife.',
        text: 'Two corridors descend on a divided stairway, decorated with scenes from the Opening of the Mouth ritual. Vandals later cut out many of the king’s names and figures.',
        facts: [['Corridor G', '8.94 × 2.62 m'], ['Corridor H', '5.28 × 2.63 m']] },
      { id: 'chamberI', group: 'Lower corridors', name: 'Chamber before the burial hall', color: 'paint', conf: 'surveyed',
        why: 'Nineteenth-century copyists pressed wet paper on its walls, and much of the colour came off with it.',
        text: 'A small room showing the king with Anubis, Isis, Horus, Hathor and Osiris, under a starry ceiling.',
        facts: [['Size', '5.25 × 4.16 m'], ['Height', '2.53 m']] },
      { id: 'burial', group: 'Burial chamber', name: 'Burial chamber', color: 'paint', conf: 'surveyed', major: true,
        photos: () => [ph('seti-ceiling.jpg', 'Gold figures and stars on a black vaulted ceiling', 'The vaulted ceiling of the crypt: star clocks and constellations in gold on black, above a procession of gods.', 'Carole Raddato', 'CC BY-SA 2.0', 'https://commons.wikimedia.org/wiki/File:KV17,_the_tomb_of_Pharaoh_Seti_I_of_the_of_the_burial_chamber,_Nineteenth_Dynasty,_astronomical_vaulted_ceiling_Valley_of_the_Kings,_Egypt_(49845803483).jpg', wp(-95, f.Jlow + 1.7, gz - 1), wp(-95.5, f.Jlow + 6, gz + 3)), ph('seti-burial.jpg', 'A falcon-headed god carved and painted on a pillar', 'A god on one of the pillars of the burial chamber, carved in raised relief and painted.', 'Carole Raddato', 'CC BY-SA 2.0', 'https://commons.wikimedia.org/wiki/File:KV17,_the_tomb_of_Pharaoh_Seti_I_of_the_Nineteenth_Dynasty,_Burial_chamber_J,_Valley_of_the_Kings,_Egypt_(49846644117).jpg', wp(-87.3, f.I + 1.6, gz + 0.4), wp(-88.6, f.I + 1.7, gz + 2.2))],
        why: 'Its vaulted ceiling is one of the earliest maps of the night sky, with constellations drawn as gods and animals.',
        text: 'A raised hall with six pillars in two rows, then steps down into a sunken room with a vaulted ceiling painted with astronomical figures. Winged figures of Isis and Nephthys kneel at the tops of the side walls. The walls show the Book of Gates and the Amduat.',
        facts: [['Length', '14.26 m'], ['Width', '8.38 m'], ['Height', '6.05 m (vault)'], ['Pillars', '6']] },
      { id: 'sarcophagus', group: 'Burial chamber', name: 'Sarcophagus (now in London)', color: 'stone', conf: 'approx',
        why: 'Translucent and covered inside and out with texts, it is one of the finest sarcophagi ever made.',
        text: 'A sarcophagus carved from a single block of calcite (Egyptian alabaster), found by Belzoni over the entrance to tunnel K. It has been in Sir John Soane’s Museum in London since 1824. Seti’s mummy had long since been moved to a royal cache and is now in Cairo. Size and position here are approximate.',
        facts: [['Material', 'Calcite'], ['Now', 'Sir John Soane’s Museum, London'], ['Mummy', 'Found in cache DB 320']] },
      { id: 'sides', group: 'Burial chamber', name: 'Side rooms', color: 'paint', conf: 'surveyed',
        why: 'They held the burial goods; one has stone benches decorated with images of funeral furniture.',
        text: 'Five rooms open off the burial chamber. The largest on the left has two pillars and wide benches, with pictures of beds, chests and shrines on their faces. A four-pillared room at the rear was left unfinished and undecorated.',
        facts: [['Bench room', '8.06 × 7.91 m, 2 pillars'], ['Rear room', '13.2 × 5.32 m, 4 pillars'], ['Small rooms', '3, about 3 × 2.7 m']] },
      { id: 'tunnelK', group: 'Burial chamber', name: 'Tunnel K', color: 'rock', conf: 'uncertain', major: true,
        why: 'Nobody knows what it was for; it may have been meant to reach a symbolic underworld, or water.',
        text: 'A narrow tunnel leading down from the floor of the burial chamber, under the place where the sarcophagus stood. Its first part is a divided stairway. It was cleared between 2007 and 2010 and found to be 174 m long, ending abruptly at the bottom of a second staircase. Its slope here is a guess.',
        facts: [['Length', '174 m'], ['Width', 'c. 1 m'], ['Cleared', '2007–2010'], ['Slope', 'Not published']] },
    ],
    build() {
      const M = api.ctx.mats;
      // Entrance stairway: the treads, open to the sky
      for (let i = 0; i < 26; i++) {
        const x1 = -i * 15.81 / 26, x0 = -(i + 1) * 15.81 / 26, fl = -(i + 1) * -f.B / 26;
        room('entry', x0, x1, fl + f.B / 26, fl, -1.35, 1.35);
      }
      // Upper corridors and the well chamber
      passage('corrB', V(-15.81, f.B, 0), V(ax.B[0], f.B, 0), 2.07, 2.48);
      passage('corrB', V(ax.B[0], f.B, 0), V(ax.B[1], f.C, 0), 2.62, 2.58);
      passage('stairC', V(ax.B[1], f.C, 0), V(ax.C[0], f.C, 0), 2.1, 2.38);
      passage('stairC', V(ax.C[0], f.C, 0), V(ax.C[1], f.D, 0), 2.6, 3.81);
      passage('stairC', V(ax.C[1], f.D, 0), V(ax.D[0], f.D, 0), 2.07, 2.4);
      passage('stairC', V(ax.D[0], f.D, 0), V(ax.D[1], f.E, 0), 2.61, 2.78);
      passage('well', V(ax.D[1], f.E, 0), V(ax.E[0], f.E, 0), 2.08, 2.39);
      room('well', ax.E[1], ax.E[0], f.E, f.E + 2.46, -2.085, 2.085);
      room('well', ax.E[1] + 0.5, ax.E[0] - 0.5, f.E - 6, f.E, -1.6, 1.6);           // the shaft (depth approximate)
      M.well.opacity = 0.5;
      // First pillared hall, its stair down on the left, and the side hall
      passage('hallF', V(ax.E[1], f.E, 0), V(ax.F[0], f.E, 0), 2.1, 2.25);
      room('hallF', ax.F[1], ax.F[0], f.E, f.E + 3.16, -3.975, 3.975);
      const pillar = (id, x, z, y0, h, w = 1.0) => { const p = room(id, x - w / 2, x + w / 2, y0, y0 + h, z - w / 2, z + w / 2); p.userData.pillar = true; };
      for (const x of [-54.6, -58.0]) for (const z of [-2.0, 2.0]) pillar('hallF', x, z, f.E, 3.16);
      passage('corrG', V(-55.5, f.E, gz), V(ax.F[1], f.G + 0.4, gz), 2.44, 3.25);
      passage('sideFa', V(ax.F[1], f.E, -2.0), V(-61.48, f.E, -2.0), 1.57, 2.34);
      room('sideFa', -70.1, -61.48, f.Fa, f.Fa + 3.67, -5.93, 1.93);
      for (const x of [-64.4, -67.2]) pillar('sideFa', x, -2.0, f.Fa, 3.67, 1.18);
      // Lower corridors to chamber I
      passage('corrG', V(ax.F[1], f.G + 0.4, gz), V(-61.54, f.G, gz), 2.09, 2.7);
      passage('corrG', V(-61.54, f.G, gz), V(-70.48, f.H, gz), 2.62, 2.64);
      passage('corrG', V(-70.48, f.H, gz), V(-71.52, f.H, gz), 2.09, 2.34);
      passage('corrG', V(-71.52, f.H, gz), V(-76.8, f.I, gz), 2.63, 2.7);
      passage('chamberI', V(-76.8, f.I, gz), V(ax.I[0], f.I, gz), 2.07, 2.09);
      room('chamberI', ax.I[1], ax.I[0], f.I, f.I + 2.53, gz - 2.08, gz + 2.08);
      // Burial chamber: raised pillared hall, then the sunken vaulted crypt
      passage('burial', V(ax.I[1], f.I, gz), V(ax.J[0], f.I, gz), 2.08, 2.33);
      room('burial', Jup, ax.J[0], f.I, f.I + 3.6, gz - 4.19, gz + 4.19);
      room('burial', ax.J[1], Jup, f.Jlow, f.Jlow + 4.35, gz - 4.19, gz + 4.19);
      { const v = new THREE.Mesh(new THREE.CylinderGeometry(4.19, 4.19, Jup - ax.J[1], 32, 1, true, 0, Math.PI), M.burial);
        v.geometry.rotateZ(Math.PI / 2); v.geometry.scale(1, 0.41, 1);
        v.position.set((Jup + ax.J[1]) / 2, f.Jlow + 4.35, gz); put('burial', v, false); }
      for (const x of [-86.2, -88.6, -91.0]) for (const z of [gz - 2.2, gz + 2.2]) pillar('burial', x, z, f.I, 3.6, 1.04);
      room('sarcophagus', -97.5, -94.7, f.Jlow, f.Jlow + 0.8, gz - 1.75, gz - 0.65);
      // Side rooms: two off the pillared hall, two off the crypt, one behind it
      const side = (x0, x1, z0, z1, y, h) => room('sides', x0, x1, y, y + h, z0, z1);
      side(-88.6, -85.45, gz + 4.97, gz + 7.61, f.I, 2.11);                       // Ja, left
      side(-89.0, -85.8, gz - 7.63, gz - 4.97, f.I, 2.03);                        // Je, right (sizes from the survey, sides approximate)
      side(-98.2, -90.3, gz + 5.1, gz + 13.16, f.Jlow, 3.0);                       // Jb, left, with benches
      side(-97.6, -94.5, gz - 7.7, gz - 5.04, f.Jlow, 2.03);                        // Jd, right
      side(-106.26, -100.94, gz - 6.6, gz + 6.6, f.Jlow, 3.73);                      // Jc, behind
      passage('sides', V(ax.J[1], f.Jlow, gz + 4.5), V(-100.94, f.Jlow, gz + 4.5), 0.99, 1.54);
      // Tunnel K, from the floor under the sarcophagus (slope approximate)
      passage('tunnelK', kA, kB, 0.99, 1.57);

      person(-56.2, f.E, 0.6, 0.4);
      person(-89.8, f.I, gz + 0.3, 0.8);
      person(-96, f.Jlow, gz + 1.2, -0.5);
      person(4, 0, 1.8, -Math.PI / 2);
    },
  };
}
