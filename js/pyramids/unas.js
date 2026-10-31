// The Pyramid of Unas, Saqqara (c. 2350 BC), the first with the Pyramid Texts.
// Model units are metres: origin at the centre of the base, +x east, +y up, +z south.
export default function unas(api) {
  const { THREE, V, D, up, ph, COL, passage, room, gabledRoom, corbelRoom, route, person, frame, put, halfAt, wallImage, extraMat } = api;

  const B = 57.75 / 2, K = Math.tan(56.31 * D), H = B * K;
  const fl = -14.35 * Math.sin(22 * D);                  // floor level of the burial apartments
  const AC = { x0: -1.54, x1: 1.54, s0: -1.875, s1: 1.875 };   // antechamber, under the apex
  const BC = { x0: -1.54 - 7.3, x1: -1.54, s0: -1.54, s1: 1.54 }; // burial chamber, to the west
  const pS1 = AC.s0, pS0 = pS1 - 14.10;                 // horizontal passage
  const vS0 = pS0 - 2.47;                                // vestibule
  const entrance = V(0, 0, vS0 - 14.35 * Math.cos(22 * D));
  const wallH = 3.0, peakH = 4.4;                         // room heights: approximate

  return {
    id: 'unas', king: 'Unas', reign: [2375, 2345], year: 2350, lat: 29.86833, lon: 31.21472,
    short: 'Unas', site: 'Saqqara', date: 'c. 2350 BC', title: 'The Pyramid of Unas',
    rings: [[B, 0], [0, H]], lowest: fl - 1, start: 'texts',
    // A phone LiDAR scan of the antechamber and the doorways off it (M. Teresa Soria Trastoy, CC BY-NC-SA), in metres.
    // Shown in place of the drawn rooms while you stand in the antechamber; it covers the near ends of the burial chamber and serdab.
    interiorScan: { url: 'models/unas-antechamber.glb', centre: [1.15, 0, -0.23], rotY: -Math.PI / 2, at: [0, fl, 0],
      clip: [[0, 0, 1, 2.3]], box: [[-2.1, fl - 0.3, -1.95], [1.85, fl + 5.2, 1.95]],
      hides: ['antechamber', 'ptAN', 'ptAS', 'ptAE', 'ptAW', 'burial', 'ptBN', 'ptBS', 'ptBE', 'serdab'] },
    tour: () => [
      { id: 'pyramid', path: [V(0, 1.65, -B - 30)], look: V(0, 10, 0), say: 'Unas\u2019s pyramid is now a low mound, but the rooms underneath are almost intact. Their walls are the first ever covered in writing.' },
      { id: 'descending', path: [V(0, 1.65, entrance.z - 4), up(entrance, 1.0), up(entrance.clone().lerp(V(0, fl, vS0), 0.6), 1.0)], look: up(V(0, fl, vS0), 1.0), say: 'The entrance opens in the floor of a chapel against the north face. The corridor slopes down at 22\u00b0.' },
      { id: 'passage', path: [up(V(0, fl, vS0), 1.0), up(V(0, fl, pS0 + 1), 1.0), up(V(0, fl, pS1 - 1.5), 1.0)], look: V(0.55, fl + 0.7, pS1 - 1.5), say: 'Past the three granite portcullises. On the last stretch of the passage the Pyramid Texts begin.' },
      { id: 'antechamber', path: [V(0, fl + 1.65, AC.s0 + 0.4), V(0, fl + 1.65, 0.6)], look: V(AC.x1, fl + 2.3, 0), say: 'The antechamber, directly under the apex, with real photographs of its texts on the walls. The east gable holds the Cannibal Hymn.' },
      { id: 'burial', path: [V(-1.2, fl + 1.65, 0), V(-4.3, fl + 1.65, 0)], look: V(BC.x0, fl + 2.6, 0), say: 'The burial chamber, its ceiling painted with stars. Spells to protect the king cover the gable above the sarcophagus.' },
    ],
    stats: [['Original height', '43 m'], ['Base', '57.75 m per side']],
    sources: 'D. Arnold (2003); M. Lehner, <i>The Complete Pyramids</i> (2008); M. Verner, <i>The Pyramids</i> (2001); R. Stadelmann (1985); J. P. Allen, <i>The Ancient Egyptian Pyramid Texts</i> (2005). Room plans and passage lengths are published figures; room heights and the sarcophagus size are approximate, and the inscribed panels show where the texts are, not their actual signs.',
    features: [
      { id: 'pyramid', group: 'Exterior', name: 'The pyramid', color: 'sand', conf: 'surveyed',
        why: 'Unas was the last king of the 5th Dynasty, and his pyramid is the first with texts carved inside. Every later Old Kingdom king followed his example.',
        photos: () => [ph('unas-exterior.jpg', 'The ruined pyramid of Unas, a low mound of stone', 'The pyramid today: its core has collapsed into a low mound.', 'Darer101', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Pyramid_of_Unas_at_Saqqara.jpg', V(70, 1.7, 75), V(0, 12, 0))],
        text: 'A small pyramid at Saqqara, built about 150 years after Khufu’s. Its core of rough limestone was built in six steps and cased in fine white Tura limestone. The casing was later stripped and the core has slumped into a mound, but the chambers underneath survive almost intact.',
        facts: [['Base side', '57.75 m · 110 cubits'], ['Original height', '43 m'], ['Face slope', '56° 18′ 35″'], ['Volume', '47,390 m³']] },
      { id: 'descending', group: 'Passage', name: 'Entrance and descending corridor', color: 'lime', conf: 'surveyed', major: true,
        why: 'The entrance under a chapel floor, rather than high on the face, became the standard plan for late Old Kingdom pyramids.',
        text: 'The entrance opens in the floor of a small chapel against the north face. A corridor slopes down from it into the bedrock.',
        facts: [['Length', '14.35 m'], ['Slope', '22°'], ['Starts', 'Under the north chapel']] },
      { id: 'vestibule', group: 'Passage', name: 'Vestibule', color: 'lime', conf: 'surveyed',
        why: 'It marks the start of the level route to the burial rooms.',
        text: 'A small room at the bottom of the descending corridor, where the passage levels out.',
        facts: [['Size', '2.47 × 2.08 m']] },
      { id: 'passage', group: 'Passage', name: 'Portcullis passage', color: 'granite', conf: 'surveyed',
        why: 'Its last stretch carries the first Pyramid Texts a visitor meets, so the texts begin before the burial rooms do.',
        text: 'A level corridor blocked by three granite portcullis slabs. The section nearest the antechamber is inscribed.',
        facts: [['Length', '14.10 m'], ['Portcullises', '3, granite']] },
      { id: 'antechamber', group: 'Burial rooms', name: 'Antechamber', color: 'lime', conf: 'surveyed', major: true,
        why: 'Its texts describe the king’s passage from earth to the sky; it sits right under the apex of the pyramid.',
        text: 'The central room, directly under the apex. Its walls are covered in Pyramid Texts, and its pointed ceiling is painted with stars. Step inside it to see a 3D scan of the real room and its texts.',
        facts: [['Size', '3.75 × 3.08 m'], ['Position', 'Under the apex'], ['Height', 'Approximate in model'], ['3D scan', 'M. Teresa Soria Trastoy \u00b7 CC BY-NC-SA']] },
      { id: 'burial', group: 'Burial rooms', name: 'Burial chamber', color: 'lime', conf: 'surveyed', major: true,
        why: 'This is the first royal burial chamber in Egypt with its walls covered in writing.',
        photos: () => [
          ph('unas-burial.jpg', 'The west end of the burial chamber, with texts on the gable above the dark sarcophagus', 'Looking west over the sarcophagus at the inscribed gable wall.', 'Vincent Brown', 'CC BY 2.0', "https://commons.wikimedia.org/wiki/File:Burial_chamber_in_Unas%27_pyramid.jpg", V(-4.3, fl + 1.7, 0), V(BC.x0, fl + 2.6, 0)),
          ph('unas-ceiling.jpg', 'A ceiling painted with rows of five-pointed stars', 'The pointed ceiling, painted with stars.', 'Vincent Brown', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Unas%E2%80%99_Sarcophagus_Chamber_Ceiling.jpg', V(-5, fl + 1.6, 0), V(-5.2, fl + 4.4, 0.4)),
          ph('unas-wall.jpg', 'Painted palace-facade panelling next to columns of hieroglyphs', 'The painted palace-front panelling around the sarcophagus, beside the texts.', 'Vincent Brown', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Burial_Chamber_Wall_of_Unas%E2%80%99_Pyramid.jpg', V(-6.2, fl + 1.6, -0.2), V(-7.6, fl + 1.8, BC.s1))],
        text: 'A long room with a pointed ceiling painted blue with gold stars. The west end around the sarcophagus is carved and painted with a palace-front pattern; the other walls are covered with Pyramid Texts. Gaston Maspero entered it in 1881.',
        facts: [['Size', '7.3 × 3.08 m'], ['Ceiling', 'Gabled, painted with stars'], ['Entered', '1881, Maspero']] },
      { id: 'sarcophagus', group: 'Burial rooms', name: 'Sarcophagus', color: 'shaft', conf: 'approx',
        why: 'It was robbed in antiquity but survived undamaged, still in its original place.',
        text: 'A greywacke sarcophagus against the west wall. It was once thought to be basalt. Size shown is approximate.',
        facts: [['Material', 'Greywacke'], ['Position', 'West end']] },
      { id: 'serdab', group: 'Burial rooms', name: 'Serdab', color: 'lime', conf: 'surveyed',
        why: 'Its three niches may have held statues or burial goods; unlike the other rooms, it was left uninscribed.',
        text: 'A room east of the antechamber with three deep recesses.',
        facts: [['Size', '6.75 × 2 m'], ['Recesses', '3'], ['Inscribed', 'No']] },
      { id: 'texts', group: 'The Pyramid Texts, wall by wall', name: 'The Pyramid Texts', color: 'texts', conf: 'surveyed', inscribed: true, major: true,
        photos: () => [ph('unas-texts-colour.jpg', 'Columns of carved hieroglyphs filled with dark blue paint, with oval cartouches', 'The texts today: signs carved into the limestone and filled with blue pigment. The ovals are cartouches holding the king\u2019s name.', 'Aidan McRae Thomson', 'CC BY-SA 2.0', 'https://commons.wikimedia.org/wiki/File:Pyramid_Texts_in_Unas%E2%80%99_Pyramid_2017.jpg', V(0.2, fl + 1.6, AC.s0 + 0.5), V(0.2, fl + 1.9, AC.s1)), ph('unas-texts.jpg', 'Old photograph of walls covered in columns of hieroglyphs around a doorway', 'Columns of Pyramid Texts around the doorway to the burial chamber, photographed about 1900.', 'Brooklyn Museum lantern slide', 'Public domain', 'https://commons.wikimedia.org/wiki/File:Unas_Pyramidentexte.jpg', V(1.0, fl + 1.6, 0.6), V(BC.x1 - 1, fl + 1.8, 0))],
        why: 'They are among the oldest religious writings in the world: spells to help the dead king rise to the sky and join the gods.',
        text: '283 spells carved in columns of hieroglyphs and filled with blue pigment, read from top to bottom and right to left. They cover the burial chamber, the antechamber and the end of the passage. Click any inscribed wall to read what its spells are about. The antechamber walls show real photographs of their texts; the burial chamber walls still show a placeholder pattern.',
        facts: [['Spells', '283'], ['Colour', 'Carved, painted blue'], ['Reading', 'Columns, right to left'], ['Summaries', 'In our own words']] },
      { id: 'ptBN', group: 'The Pyramid Texts, wall by wall', name: 'Burial chamber, north wall', color: 'texts', conf: 'approx', inscribed: true,
        view: { cam: V(-4.5, fl + 1.65, BC.s1 - 0.3).toArray(), look: V(-4.5, fl + 1.6, BC.s0).toArray() },
        why: 'The offering ritual: the king is fed and clothed in the afterlife, as statues were in temples.',
        text: 'A long offering ritual. Each item presented to the king, from bread, beer and meat to oils, linen and royal insignia, is named with a short spell, as in a temple service.',
        facts: [['Spells', 'about 23–171'], ['Shown on model', 'Not yet: pattern only']] },
      { id: 'ptBS', group: 'The Pyramid Texts, wall by wall', name: 'Burial chamber, south wall', color: 'texts', conf: 'approx', inscribed: true,
        view: { cam: V(-4.5, fl + 1.65, BC.s0 + 0.3).toArray(), look: V(-4.5, fl + 1.6, BC.s1).toArray() },
        why: 'The resurrection ritual: the core promise that the king lives on.',
        text: 'The resurrection ritual. The king is told to wake, stand up and take his place among the gods. A famous line insists that he has not gone away dead, but gone away alive.',
        facts: [['Spells', 'about 213–222'], ['Shown on model', 'Not yet: pattern only']] },
      { id: 'ptBE', group: 'The Pyramid Texts, wall by wall', name: 'Burial chamber, east wall', color: 'texts', conf: 'approx', inscribed: true,
        view: { cam: V(BC.x0 + 2.2, fl + 1.65, 0).toArray(), look: V(BC.x1, fl + 1.8, 0).toArray() },
        why: 'Food for the spirit: the king is given control over his own offerings.',
        text: 'Spells about food and provisions for the king\u2019s spirit, giving him command over the offerings brought to him.',
        facts: [['Spells', 'about 204–212'], ['Shown on model', 'Not yet: pattern only']] },
      { id: 'ptBW', group: 'The Pyramid Texts, wall by wall', name: 'Burial chamber, west gable', color: 'texts', conf: 'approx', inscribed: true,
        view: { cam: V(BC.x1 - 0.6, fl + 1.65, 0).toArray(), look: V(BC.x0, fl + 3.4, 0).toArray() },
        why: 'Protection right above the body: the first thing that would face any threat to the king.',
        text: 'Protective spells against snakes and other dangers, placed on the gable directly above the sarcophagus to guard the body.',
        facts: [['Spells', 'about 226–243'], ['Shown on model', 'Not yet: pattern only']] },
      { id: 'ptAW', group: 'The Pyramid Texts, wall by wall', name: 'Antechamber, west wall', color: 'texts', conf: 'approx', inscribed: true,
        view: { cam: V(AC.x1 - 0.4, fl + 1.65, 0).toArray(), look: V(AC.x0, fl + 2.1, 0).toArray() },
        why: 'The turning point: the king leaves the burial chamber and is announced to the gods.',
        text: 'Above the doorway to the burial chamber. These spells mark the king\u2019s move out of the burial chamber: he is announced to the gods and begins his journey toward the sky.',
        facts: [['Spells', '247–253'], ['Shown on model', 'Real wall photograph']] },
      { id: 'ptAS', group: 'The Pyramid Texts, wall by wall', name: 'Antechamber, south wall', color: 'texts', conf: 'approx', inscribed: true,
        view: { cam: V(0, fl + 1.65, AC.s0 + 0.4).toArray(), look: V(0, fl + 1.6, AC.s1).toArray() },
        why: 'Crossing into the sky, with the help of the gods and a divine ferryman.',
        text: 'Spells for crossing into the sky. The king demands passage, and a divine ferryman is called on to carry him over the waterway that separates earth from the heavens.',
        facts: [['Spells', '254–272'], ['Shown on model', 'Real wall photograph']] },
      { id: 'ptAE', group: 'The Pyramid Texts, wall by wall', name: 'Antechamber, east wall', color: 'texts', conf: 'approx', inscribed: true,
        view: { cam: V(AC.x0 + 0.4, fl + 1.65, 0).toArray(), look: V(AC.x1, fl + 2.3, 0).toArray() },
        why: 'Home of the famous Cannibal Hymn, plus spells to keep dangers away.',
        text: 'In the gable is the famous Cannibal Hymn (spells 273–274): the king hunts the gods and eats them to take in their power. Below it, many short spells ward off snakes and other dangerous creatures.',
        facts: [['Spells', '273–301'], ['Shown on model', 'Real wall photograph']] },
      { id: 'ptAN', group: 'The Pyramid Texts, wall by wall', name: 'Antechamber, north wall', color: 'texts', conf: 'approx', inscribed: true,
        view: { cam: V(0, fl + 1.65, AC.s1 - 0.4).toArray(), look: V(0, fl + 2.1, AC.s0).toArray() },
        why: 'The ascent: different ways for the king to reach the sky.',
        text: 'Spells of ascent. The king rises to the sky by a ladder, on the wind or in the form of a bird, and joins the sun god.',
        facts: [['Spells', '302–312'], ['Shown on model', 'Real wall photograph']] },
    ],
    build() {
      const M = api.ctx.mats;
      room('descending', -0.8, 0.8, -0.2, 1.4, entrance.z - 0.5, entrance.z + 1.0);
      passage('descending', entrance, V(0, fl, vS0), 1.05, 1.3);
      room('vestibule', -1.04, 1.04, fl, fl + 2.4, vS0, pS0);
      passage('passage', V(0, fl, pS0), V(0, fl, pS1), 1.05, 1.3);
      const pc = extraMat(COL.granite, 'granite');
      for (const ds of [1.4, 2.3, 3.2]) room('passage', -0.75, 0.75, fl, fl + 1.6, pS0 + ds, pS0 + ds + 0.5, pc);
      gabledRoom('antechamber', AC.x0, AC.x1, fl, wallH, peakH, AC.s0, AC.s1);
      gabledRoom('burial', BC.x0, BC.x1, fl, wallH, peakH, BC.s0, BC.s1);
      M.sarcophagus.color.set('#4b4f4a');
      room('sarcophagus', BC.x0 + 0.25, BC.x0 + 1.3, fl, fl + 1.1, -1.35, 1.35);
      // serdab: short passage east, then three recesses
      passage('serdab', V(AC.x1, fl, 0), V(3.0, fl, 0), 1.05, 1.3);
      for (const [s0, s1] of [[-3.375, -1.275], [-1.05, 1.05], [1.275, 3.375]]) room('serdab', 3.0, 5.0, fl, fl + 2.5, s0, s1);
      // Inscribed walls: each wall is its own feature, so you can click it to read about it
      const T = 0.06, top = fl + wallH, bottom = fl + 0.05;
      room('ptBN', BC.x0 + 1.6, BC.x1, bottom, top, BC.s0, BC.s0 + T);      // east of the palace-front panelling
      room('ptBS', BC.x0 + 1.6, BC.x1, bottom, top, BC.s1 - T, BC.s1);
      room('ptBE', BC.x1 - T, BC.x1, bottom, top, BC.s0, -0.6); room('ptBE', BC.x1 - T, BC.x1, bottom, top, 0.6, BC.s1);
      gabledRoom('ptBW', BC.x0, BC.x0 + T, fl + wallH * 0.55, wallH * 0.45, peakH - wallH * 0.55, BC.s0, BC.s1);
      room('ptAN', AC.x0, AC.x1, bottom, top, AC.s0, AC.s0 + T);
      room('ptAS', AC.x0, AC.x1, bottom, top, AC.s1 - T, AC.s1);
      room('ptAE', AC.x1 - T, AC.x1, bottom, top, AC.s0, -0.6); room('ptAE', AC.x1 - T, AC.x1, bottom, top, 0.6, AC.s1);
      room('ptAW', AC.x0, AC.x0 + T, fl + 1.35, top, AC.s0, AC.s1);       // above the doorway to the burial chamber
      room('texts', -0.56, -0.5, bottom, fl + 1.25, pS1 - 4, pS1); room('texts', 0.5, 0.56, bottom, fl + 1.25, pS1 - 4, pS1);
      // Photographs of the actual antechamber texts, fitted to each wall without stretching
      const off = T + 0.012;
      wallImage('ptAW', 'pt-247-253.jpg', 1.613, 'x+', AC.x0 + off, 0, fl + 2.18, 3.4, 1.6);
      wallImage('ptAS', 'pt-254-260.jpg', 1.141, 'z-', AC.s1 - off, -0.77, fl + 1.6, 1.5, 2.8);
      wallImage('ptAS', 'pt-260-272.jpg', 1.412, 'z-', AC.s1 - off, 0.77, fl + 1.6, 1.5, 2.8);
      wallImage('ptAE', 'pt-277-301.jpg', 1.18, 'x-', AC.x1 - off, 0, fl + 2.2, 3.4, 1.55);
      wallImage('ptAE', 'pt-273-276.jpg', 1.579, 'x-', AC.x1 - off, 0, fl + 3.5, 1.1, 0.75);
      wallImage('ptAN', 'pt-302-312.jpg', 1.426, 'z+', AC.s0 + off, 0, fl + 2.18, 3.0, 1.6);

      person(-3.4, fl, 0.8, -0.8);
      person(-1.1, fl, -1.35, 0.6);   // in a corner, out of the way of the walls
      person(6, 0, -B - 8, Math.PI);
    },
  };
}
