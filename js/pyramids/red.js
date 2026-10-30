// The Red Pyramid of Sneferu, Dahshur (c. 2590 BC).
// Model units are metres: origin at the centre of the base, +x east, +y up, +z south.
export default function red(api) {
  const { THREE, V, D, up, ph, COL, passage, room, gabledRoom, corbelRoom, route, person, frame, put, halfAt, wallImage, extraMat } = api;

  const B = 110, K = Math.tan(43.367 * D), H = B * K;
  const dA = 27 * D;
  const entrance = V(0, 28, -(B - 28 / K));
  const dEnd = entrance.clone().add(V(0, -28, 28 / Math.tan(dA)));
  const W = 3.65 / 2;
  const c1 = [-16.5, -8.14], c2 = [-4.18, 4.18], c3 = [7.3, 11.48];

  return {
    id: 'red', king: 'Sneferu', reign: [2613, 2589], year: 2590, lat: 29.80889, lon: 31.20611,
    short: 'Red', site: 'Dahshur', date: 'c. 2590 BC', title: 'The Red Pyramid of Sneferu',
    rings: [[B, 0], [0, H]], lowest: -2, start: 'chamber3',
    tour: () => [
      { id: 'pyramid', path: [V(0, 1.65, -B - 60)], look: V(0, 30, entrance.z), say: 'The Red Pyramid, Sneferu\u2019s third and final pyramid, with a gentle 43\u00b0 slope. The entrance is 28 m up the north face.' },
      { id: 'descending', path: [V(0, 27, entrance.z - 8), up(entrance, 0.75), up(entrance.clone().lerp(dEnd, 0.55), 0.75)], look: up(dEnd, 0.75), say: 'A 61 m passage, less than a metre high, slopes all the way down to ground level.' },
      { id: 'chamber1', path: [up(dEnd, 0.8), V(0, 1.6, c1[0] + 0.8), V(0, 1.6, (c1[0] + c1[1]) / 2)], look: V(0, 11, (c1[0] + c1[1]) / 2 + 1), say: 'The first chamber. Its roof rises 12 m in eleven inward steps.' },
      { id: 'chamber2', path: [V(-1, 1.0, c1[1] - 0.3), V(-1, 1.0, c2[0] + 0.3), V(0, 1.6, -0.5)], look: V(0, 7.8, c2[1]), say: 'The second chamber, directly under the apex. The opening high in the far wall leads to the burial chamber.' },
      { id: 'chamber3', path: [V(0, 1.6, 2.6), V(0, 8.8, c2[1] - 0.2), V(0, 8.8, c3[0] + 0.3), V(0, 8.6, (c3[0] + c3[1]) / 2)], look: V(0, 13, c3[1]), say: 'Up the modern stair into the burial chamber. Its floor was dug up by treasure hunters; human remains, possibly Sneferu\u2019s, were found here.' },
    ],
    stats: [['Height', '105 m'], ['Base', '220 m per side']],
    sources: 'M. Lehner, <i>The Complete Pyramids</i> (1997, 2008); R. Stadelmann’s Dahshur work; site guides for chamber plan sizes. Overall size, passage slope and chamber heights are published figures. Chamber floor plans and the third chamber’s level are approximate.',
    features: [
      { id: 'pyramid', group: 'Exterior', name: 'The pyramid', color: 'sand', conf: 'surveyed',
        why: 'Sneferu\u2019s builders learned from the Bent Pyramid and used a safer, shallower slope from the start. Its success led directly to the Great Pyramid.',
        photos: () => [ph('red-exterior.jpg', 'The Red Pyramid seen across the desert', 'The Red Pyramid and its shallow 43° slope.', 'Darer101', 'CC BY 4.0', 'https://commons.wikimedia.org/wiki/File:Red_Pyramid_at_Dahshur.jpg', V(B + 170, 1.7, 30), V(0, 30, 0))],
        text: 'Built for Sneferu, Khufu’s father, after the problems with the Bent Pyramid. It is the first successful smooth-sided pyramid, with a shallow slope of about 43°. Its name comes from the reddish limestone of its core.',
        facts: [['Base side', '220 m · 420 cubits'], ['Height', '105 m · 200 cubits'], ['Face slope', '43° 22′']] },
      { id: 'descending', group: 'Passage', name: 'Entrance and descending passage', color: 'lime', conf: 'approx', major: true,
        why: 'The high entrance keeps the passage aimed at the northern sky, a feature later pyramids kept.',
        photos: () => [ph('red-passage.jpg', 'Looking down a long sloping passage', 'Looking down the 61 m passage toward the chambers.', 'Jorge Láscar', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Inside_the_Red_Pyramid_-_The_61m._long_passage_leading_to_the_master_chamber_(14795442922).jpg', entrance.clone().lerp(dEnd, 0.08).add(V(0, 0.7, 0)), dEnd), ph('red-entrance.jpg', 'Stairs leading up the north face to the entrance', 'The modern stairs up to the entrance on the north face.', 'Sturm58', 'CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:Red-pyramid_-_entry.jpg', V(0, 1.7, -B - 70), V(0, 22, entrance.z))],
        text: 'The entrance is high on the north face. A long low passage slopes down to ground level, then a short level passage leads to the first chamber.',
        facts: [['Entrance height', 'c. 28 m'], ['Slope', '27°'], ['Length', 'c. 61–63 m'], ['Cross-section', 'c. 1.2 wide × 0.91 m high']] },
      { id: 'chamber1', group: 'Chambers', name: 'First chamber', color: 'lime', conf: 'approx', major: true,
        why: 'Its stepped roof has carried the weight of the pyramid above for about 4,500 years without failing.',
        photos: () => [ph('red-corbel-1.jpg', 'Looking up at a stepped stone ceiling', 'The stepped (corbelled) ceiling of one of the first two chambers.', 'Jon Bodsworth', 'Copyrighted free use', 'https://commons.wikimedia.org/wiki/File:11_red_corbel_1.jpg', V(0, 1.6, (c1[0] + c1[1]) / 2 - 2), V(0, 12, (c1[0] + c1[1]) / 2 - 1))],
        text: 'A tall room with a corbelled roof rising in eleven steps. Its long axis runs north–south. Drawn here with a simplified corbel.',
        facts: [['Roof height', 'c. 12.3 m'], ['Corbel steps', '11'], ['Floor plan', 'c. 8.4 × 3.6 m']] },
      { id: 'chamber2', group: 'Chambers', name: 'Second chamber', color: 'lime', conf: 'approx', major: true,
        why: 'Lying under the apex, it shows how carefully the builders laid out the centre of the pyramid.',
        photos: () => [ph('red-corbel-2.jpg', 'Tall chamber with a wooden stair', 'The second chamber, with the modern stair up to the third chamber.', 'Jon Bodsworth', 'Copyrighted free use', 'https://commons.wikimedia.org/wiki/File:12_red_corbel_2.jpg', V(0, 1.6, c2[0] + 0.5), V(0, 7.8, c2[1]))],
        text: 'Almost identical to the first and lying directly under the apex. The short passage between them is offset to the west, possibly to confuse robbers.',
        facts: [['Roof height', 'c. 12.3 m'], ['Position', 'Under the apex']] },
      { id: 'chamber3', group: 'Chambers', name: 'Third (burial) chamber', color: 'lime', conf: 'approx', major: true,
        why: 'Raising the burial chamber above the passages looks ahead to the high chambers of Khufu\u2019s pyramid.',
        photos: () => [ph('red-chamber.jpg', 'Chamber floor covered in broken stone', 'The rough, broken floor of the third chamber.', 'Roland Unger', 'CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:DahshurRedPyrChamber.jpg', V(0, 9.4, c3[0] + 0.3), V(0, 7.0, c3[1] - 1)), ph('red-burial.jpg', 'Looking down from the stair in the burial chamber', 'The burial chamber from the modern stair, under its stepped ceiling.', 'Jorge Láscar', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Massive_corbel-vaulted_ceiling_of_the_main_burial_chamber_-_Red_Pyramid_(14772801236).jpg', V(-2.5, 13, (c3[0] + c3[1]) / 2), V(0.5, 7.2, (c3[0] + c3[1]) / 2))],
        text: 'Entered through an opening about 8 m up the south wall of the second chamber. It runs east–west, unlike the other two, and its rough floor lies below the level of the passage. Human remains, possibly Sneferu’s, were found here in the 1950s.',
        facts: [['Roof height', 'c. 15 m'], ['Floor plan', 'c. 8.4 × 4.2 m'], ['Opening', 'c. 8 m up']] },
      { id: 'casingMarks', group: 'Inscriptions and marks', color: 'mark', mark: true, conf: 'approx', at: V(B - 10, 0.06, -B + 10), outline: { w: 24, h: 24 }, major: true, name: 'Dated builders\u2019 marks',
        text: 'Red-painted gang names and dates found on casing and backing blocks during excavations around the pyramid. Some give the year of Sneferu\u2019s reign in which the block was placed. The dashed outline shows the general area, not an exact block.',
        why: 'The dates help work out how quickly the pyramid was built.',
        facts: [['Paint', 'Red'], ['Content', 'Gang names, dates']] },
    ],
    build() {
      passage('descending', entrance, dEnd, 1.2, 0.91);
      passage('descending', dEnd, V(0, 0, c1[0]), 1.2, 1.1);
      corbelRoom('chamber1', -W, W, 0, c1[0], c1[1], 12.3, 2.6, 11, 0.12, 0.12);
      passage('chamber2', V(-1.0, 0, c1[1]), V(-1.0, 0, c2[0]), 1.0, 1.1);
      corbelRoom('chamber2', -W, W, 0, c2[0], c2[1], 12.3, 2.6, 11, 0.12, 0.12);
      passage('chamber3', V(0, 7.8, c2[1]), V(0, 7.8, c3[0]), 1.0, 1.1);
      corbelRoom('chamber3', -4.18, 4.18, 7.0, c3[0], c3[1], 15, 3.0, 14, 0.12, 0.12);

      person(0.3, 0, (c1[0] + c1[1]) / 2, 0.5);
      person(-0.4, 0, 0, -0.3);
      person(1.5, 7.0, 9.4, 0.8);
      person(4, 0, -B - 5, Math.PI);
    },
  };
}
