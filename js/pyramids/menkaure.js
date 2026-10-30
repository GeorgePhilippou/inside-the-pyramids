// The Pyramid of Menkaure, Giza (c. 2510 BC).
// Model units are metres: origin at the centre of the base, +x east, +y up, +z south.
export default function menkaure(api) {
  const { THREE, V, D, up, ph, COL, passage, room, gabledRoom, corbelRoom, route, person, frame, put, halfAt, wallImage, extraMat } = api;

  const K = Math.tan(51.34 * D), H = 65, B = H / K;
  const dA = 26 * D;
  const entrance = V(0, 4.2, -(B - 4.2 / K));
  const dEnd = entrance.clone().add(V(0, -32 * Math.sin(dA), 32 * Math.cos(dA)));
  const fl = dEnd.y; // level of the panelled chamber and antechamber
  const AC = { x0: -7, x1: 7, s0: -1.9, s1: 1.9 };
  const BCy = fl - 4.3;

  return {
    id: 'menkaure', king: 'Menkaure', reign: [2532, 2503], year: 2510, lat: 29.97250, lon: 31.12806,
    short: 'Menkaure', site: 'Giza', date: 'c. 2510 BC', title: 'The Pyramid of Menkaure',
    rings: [[B, 0], [0, H]], today: 61, lowest: BCy - 1, start: 'burial',
    tour: () => [
      { id: 'pyramid', path: [V(0, 1.65, -B - 40)], look: V(0, 8, entrance.z), say: 'Menkaure\u2019s is the smallest of the three great Giza pyramids. Its lowest courses were cased in red granite, and some of it is still in place.' },
      { id: 'descending', path: [V(0, 4.5, entrance.z - 6), up(entrance, 1.0), up(entrance.clone().lerp(dEnd, 0.6), 1.0)], look: up(dEnd, 1.0), say: 'The entrance passage, lined with granite, slopes down into the rock.' },
      { id: 'panelled', path: [up(dEnd, 1.0), V(0, fl + 1.6, dEnd.z + 1.8)], look: V(0, fl + 1.1, dEnd.z + 3.6), say: 'The panelled chamber, carved to look like the front of a royal palace: the only decorated room in the three Giza pyramids.' },
      { id: 'portcullis', path: [up(V(0, fl, dEnd.z + 3.8), 1.0), up(V(0, fl, dEnd.z + 7), 1.0)], look: up(V(0, fl, AC.s0), 1.0), say: 'Three granite portcullis slabs once dropped into slots along this passage to block it.' },
      { id: 'antechamber', path: [up(V(0, fl, AC.s0 - 0.3), 1.0), V(1.5, fl + 1.65, 0)], look: V(-7, fl + 2, 0), say: 'The large rectangular room, cut in the bedrock. It may have been the first burial chamber before the plan was enlarged.' },
      { id: 'burial', path: [up(V(2, fl, 0), 1.0), up(V(-4.5, BCy, 0), 1.0), up(V(-6.2, BCy, 0), 1.2), V(-6.8, BCy + 1.65, 0)], look: V(-12.8, BCy + 1.8, 0), say: 'Down to the granite burial chamber. Its basalt sarcophagus was lost at sea in 1838 on the way to England.' },
    ],
    stats: [['Original height', 'c. 65 m'], ['Base', '102.2 × 104.6 m']],
    sources: 'V. Maragioglio &amp; C. Rinaldi, <i>L’Architettura delle Piramidi Menfite</i> VI (1967); M. Lehner, <i>The Complete Pyramids</i> (2008); R. Howard Vyse (1840). Overall size is surveyed. Interior room sizes come from secondary summaries of these surveys and are approximate.',
    features: [
      { id: 'pyramid', group: 'Exterior', name: 'The pyramid', color: 'sand', conf: 'surveyed',
        why: 'The last of the three great Giza pyramids. Its smaller size may reflect changing priorities or resources late in the 4th Dynasty.',
        photos: () => [ph('menkaure-exterior.jpg', 'Menkaure\'s pyramid behind smaller queens\' pyramids', 'Menkaure\'s pyramid from the south, behind its queens\' pyramids.', 'Vincent Brown', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Pyramid_of_Menkaure_(29197729700).jpg', V(15, 1.7, B + 170), V(0, 25, 0))],
        text: 'The smallest of the three main Giza pyramids, built for Menkaure. Its lowest 16 courses were cased in red granite from Aswan, some of it never smoothed. It was probably finished in a hurry after the king died.',
        facts: [['Base', '102.2 × 104.6 m'], ['Original height', 'c. 65 m · 125 cubits'], ['Height today', 'c. 61 m'], ['Face slope', '51° 20′ 25″'], ['Granite casing', '16 courses']] },
      { id: 'descending', group: 'Main passage', name: 'Entrance and descending passage', color: 'granite', conf: 'approx', major: true,
        why: 'Its granite lining shows the care taken even in a smaller pyramid.',
        photos: () => [ph('menkaure-descending.jpg', 'Looking up the sloping entrance passage', 'Looking back up the descending passage toward the entrance.', 'CT Snow', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Menkaure-pyramid_descending_passage.jpg', entrance.clone().lerp(dEnd, 0.85).add(V(0, 0.9, 0)), entrance.clone().add(V(0, 0.6, 0)))],
        text: 'The entrance is about 4.2 m above the base in the north face. The passage is lined with granite through the masonry, then cut in rock as it slopes down. It was not found until 1837.',
        facts: [['Entrance height', 'c. 4.2 m (M&R)'], ['Length', 'c. 32 m'], ['Slope', 'c. 26° (approx.)']] },
      { id: 'panelled', group: 'Main passage', name: 'Panelled chamber', color: 'rock', conf: 'approx', major: true,
        why: 'The palace-front panelling presents the tomb as the king\u2019s house, an idea that goes back to the earliest royal tombs.',
        photos: () => [ph('menkaure-panelled.jpg', 'Room with carved panelling on its walls', 'The panelled chamber, with niches carved into the walls.', 'Jon Bodsworth', 'Copyrighted free use', 'https://commons.wikimedia.org/wiki/File:11_menkaure_Panelled_Chamber.jpg', V(0, fl + 1.5, dEnd.z + 0.4), V(0, fl + 1.0, dEnd.z + 3.6))],
        text: 'A small room whose walls are carved with panelling copying the front of a royal palace, eleven niches on each long wall. It is the only decorated room in the three Giza pyramids.',
        facts: [['Niches', '11 per long wall'], ['Size shown', 'Approximate']] },
      { id: 'portcullis', group: 'Main passage', name: 'Portcullis passage', color: 'granite', conf: 'approx',
        why: 'It reuses the security ideas of Khufu\u2019s pyramid in a simpler form.',
        photos: () => [ph('menkaure-portcullis.jpg', 'Rock wall with a socket for a portcullis beam', 'A socket above one of the portcullis slots.', 'Jon Bodsworth', 'Copyrighted free use', 'https://commons.wikimedia.org/wiki/File:13_menkaure_portcullis_room.jpg', V(0, fl + 1.2, dEnd.z + 5), V(0.6, fl + 1.8, dEnd.z + 6))],
        text: 'A level corridor with three granite portcullis slabs that once slid down to seal the way to the burial rooms.',
        facts: [['Portcullises', '3, granite (M&R)']] },
      { id: 'antechamber', group: 'Burial rooms', name: 'Rectangular chamber', color: 'rock', conf: 'approx', major: true,
        why: 'It is evidence that the plan was enlarged during construction.',
        text: 'A large room cut in the bedrock and aligned east–west, opening at its west end onto a broad niche. It may have been the original burial chamber before the plan was enlarged.',
        facts: [['Size', 'c. 14 × 3.8 m'], ['Height', 'c. 4.8 m']] },
      { id: 'upperPassage', group: 'Burial rooms', name: 'Upper passage', color: 'shaft', conf: 'approx',
        why: 'A clue that the pyramid was first planned smaller, then enlarged.',
        text: 'A blind corridor above the main passage. It runs almost level, then rises and stops in the masonry, plugged with limestone. It seems to be left over from an earlier, smaller design of the pyramid.',
        facts: [['Ends', 'In the masonry'], ['Route', 'Simplified']] },
      { id: 'burial', group: 'Burial rooms', name: 'Burial chamber', color: 'granite', conf: 'approx', major: true,
        why: 'Its imitation vault is an early experiment in making a stone roof look curved.',
        photos: () => [ph('menkaure-burial.jpg', 'Granite chamber with a curved ceiling', 'The granite burial chamber and its curved ceiling.', 'Jon Bodsworth', 'Copyrighted free use', 'https://commons.wikimedia.org/wiki/File:17_menkaure_burial_chamber.jpg', V(-6.5, BCy + 1.6, 0), V(-12.8, BCy + 1.8, 0))],
        text: 'A granite-lined room set lower and to the west. Its roof is made of granite beams in pairs, cut underneath into a curve so it looks like a vault. The basalt sarcophagus found here was lost at sea in 1838 when the ship Beatrice sank on its way to England.',
        facts: [['Size', 'c. 6.6 × 2.6 m'], ['Height', 'c. 3.4 m'], ['Sarcophagus', 'Lost at sea, 1838']] },
      { id: 'cellar', group: 'Burial rooms', name: 'Six-niche room', color: 'rock', conf: 'approx',
        why: 'Storerooms like these became a standard part of later royal tombs.',
        photos: () => [ph('menkaure-niches.jpg', 'Rock-cut room with niches', 'The niche room.', 'Jon Bodsworth', 'Copyrighted free use', 'https://commons.wikimedia.org/wiki/File:15_menkaure_chamber_with_five_niches.jpg', V(-5.2, BCy + 0.6, -2.6), V(-3.0, BCy - 0.4, -4.6))],
        text: 'Reached by a short flight of steps from the corridor to the burial chamber. Six small rock-cut storerooms open off it, four on the east and two on the north.',
        facts: [['Storerooms', '6'], ['Access', 'Seven steps'], ['Size shown', 'Approximate']] },
      { id: 'coffinLid', group: 'Inscriptions and marks', color: 'mark', mark: true, conf: 'approx', at: V(4, fl + 0.03, 0), outline: { w: 2.2, h: 0.7 }, major: true, name: 'Inscribed coffin lid',
        text: 'Howard Vyse found pieces of a wooden coffin lid inscribed with Menkaure\u2019s name here in 1837. It was made about 1,900 years after his death, when priests restored old royal burials, and is now in the British Museum. The chambers themselves carry no inscriptions.',
        why: 'It shows that later Egyptians still honoured and repaired the burials of the pyramid builders.',
        facts: [['Found', '1837'], ['Made', 'c. 600 BC'], ['Now', 'British Museum'], ['On the model', 'Find spot, approximate']] },
    ],
    build() {
      passage('descending', entrance, dEnd, 1.05, 1.2);
      room('panelled', -1.6, 1.6, fl, fl + 2.1, dEnd.z, dEnd.z + 3.6);
      const pS = dEnd.z + 3.6;
      passage('portcullis', V(0, fl, pS), V(0, fl, AC.s0), 1.05, 1.2);
      for (const ds of [1.5, 3.0, 4.5]) room('portcullis', -0.75, 0.75, fl, fl + 1.6, pS + ds, pS + ds + 0.4);
      room('antechamber', AC.x0, AC.x1, fl, fl + 4.8, AC.s0, AC.s1);
      route('upperPassage', [V(0, fl + 3.6, AC.s0), V(0, fl + 3.6, AC.s0 - 12), V(0, 0.5, -B + 22)], 1.05, 1.2);
      // corridor down to the burial chamber, then the chamber
      route('burial', [V(2.0, fl, 0), V(-4.5, BCy, 0), V(-6.2, BCy, 0)], 1.05, 1.2);
      room('burial', -12.8, -6.2, BCy, BCy + 3.4, -1.3, 1.3);
      // six-niche room off the corridor's north side
      route('cellar', [V(-4.9, BCy, -0.5), V(-4.9, BCy - 0.9, -2.4)], 1.0, 1.6);
      room('cellar', -6.4, -3.4, BCy - 0.9, BCy + 1.3, -5.2, -2.4);
      for (const s of [-4.9, -4.2, -3.5, -2.8]) room('cellar', -3.4, -2.4, BCy - 0.9, BCy + 0.6, s, s + 0.5);
      for (const x of [-5.8, -4.6]) room('cellar', x, x + 0.8, BCy - 0.9, BCy + 0.6, -6.2, -5.2);

      person(-9.5, BCy, 0.2, 0.6);
      person(3, fl, 0.3, -0.4);
      person(0, fl, dEnd.z + 1.6, Math.PI);
      person(4, 0, -B - 5, Math.PI);
    },
  };
}
