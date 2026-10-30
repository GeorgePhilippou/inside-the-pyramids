// The Bent Pyramid of Sneferu, Dahshur (c. 2600 BC).
// Model units are metres: origin at the centre of the base, +x east, +y up, +z south.
export default function bent(api) {
  const { THREE, V, D, up, ph, COL, passage, room, gabledRoom, corbelRoom, route, person, frame, put, halfAt, wallImage, extraMat } = api;

  const B = 189.43 / 2, bendY = 47.04, bendB = 123.58 / 2, H = 104.71;
  const rings = [[B, 0], [bendB, bendY], [0, H]];
  const nA = 25 * D;
  const nEntrance = V(0, 11.8, -halfAt(rings, 11.8));
  const nEnd = nEntrance.clone().add(V(0, -74 * Math.sin(nA), 74 * Math.cos(nA)));
  const ante = [nEnd.z, nEnd.z + 5.4];
  const lowY = nEnd.y + 6.5;
  const LC = { x0: -2.15, x1: 2.15, s0: ante[1], s1: ante[1] + 4.96 };
  const wY = 33.32, wS = 3;
  const wEntrance = V(-halfAt(rings, wY), wY, wS);
  const wEnd = V(-12, 0.9, wS);
  const UC = { x0: -4, x1: 3.97, y0: 0.9, s0: wS - 2.63, s1: wS + 2.63 };

  return {
    id: 'bent', king: 'Sneferu', reign: [2613, 2589], year: 2600, lat: 29.79028, lon: 31.20944,
    short: 'Bent', site: 'Dahshur', date: 'c. 2600 BC', title: 'The Bent Pyramid of Sneferu',
    rings, lowest: nEnd.y, start: 'lowerChamber',
    tour: () => [
      { id: 'pyramid', path: [V(0, 1.65, -B - 60)], look: V(0, 40, -bendB), say: 'The Bent Pyramid: its slope changes about halfway up. Much of its smooth limestone casing is still in place.' },
      { id: 'north', path: [V(0, 12, nEntrance.z - 6), up(nEntrance, 0.9), up(nEntrance.clone().lerp(nEnd, 0.5), 0.9)], look: up(nEnd, 0.9), say: 'The north passage runs 74 m down into the bedrock.' },
      { id: 'lowerAnte', path: [up(nEnd, 0.9), V(0, nEnd.y + 1.6, ante[0] + 2.7)], look: V(0, nEnd.y + 12, ante[0] + 3.2), say: 'A narrow space with a stepped roof 12.6 m high, an early experiment in the technique later used in the Grand Gallery.' },
      { id: 'lowerChamber', path: [V(0, lowY + 1.6, LC.s0 + 0.7), V(0, lowY + 1.6, (LC.s0 + LC.s1) / 2)], look: V(0, lowY + 15, (LC.s0 + LC.s1) / 2 + 0.3), say: 'The lower chamber, 6.5 m above the antechamber floor, with a stepped roof rising 17 m.' },
      { id: 'upperChamber', path: [V(-1, lowY + 13, LC.s0 + 0.6), V(-3.5, lowY + 13.5, LC.s0 + 0.6), V(-6.5, 0.5, -1), V(-8.6, UC.y0 + 1, wS), V(-1.5, UC.y0 + 1.65, wS)], look: V(0, UC.y0 + 6, wS + 0.8), say: 'Through the rough connecting tunnel to the upper chamber, still braced with its original cedar beams.' },
    ],
    stats: [['Height', '104.71 m'], ['Base', '189.43 m per side']],
    sources: 'A. Fakhry, <i>The Monuments of Sneferu at Dahshur</i> (1959–61); M. Verner, <i>The Pyramids</i> (2001); M. Lehner, <i>The Complete Pyramids</i> (1997, 2008); R. Stadelmann (1997). The west passage angle, the upper chamber’s exact position and the robbers’ tunnel route are approximate.',
    features: [
      { id: 'pyramid', group: 'Exterior', name: 'The pyramid', color: 'sand', conf: 'surveyed',
        why: 'A turning point in pyramid building. The change of slope shows the builders adjusting the design as problems appeared.',
        photos: () => [ph('bent-exterior.jpg', 'The Bent Pyramid with its change of slope', 'The Bent Pyramid, much of its smooth casing still in place.', 'Jorge Láscar', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Bent_Pyramid_featuring_the_original_polished_limestone_outer_casing_that_the_pyramids_used_to_have_(14616487960).jpg', V(130, 1.7, -B - 160), V(0, 40, 0)), ph('bent-bend.jpg', 'Close view of the change in slope', 'Close-up of the change of slope on one face.', 'Darer101', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:11-degree_angle_change_of_the_Bent_Pyramid_at_Dahshur.jpg', V(35, 1.7, -B - 10), V(20, 47, -bendB))],
        text: 'Sneferu’s second pyramid. Partway up, the builders reduced the slope sharply, probably because the structure showed signs of instability, which gives it its bent outline. Much of its smooth limestone casing survives.',
        facts: [['Base side', '189.43 m · 362 cubits'], ['Height', '104.71 m · 200 cubits'], ['Lower slope', '54° 27′ 44″'], ['Slope changes at', '47.04 m'], ['Upper slope', '43° 22′']] },
      { id: 'north', group: 'Lower system', name: 'North entrance and passage', color: 'lime', conf: 'surveyed', major: true,
        why: 'It continues the tradition of passages aimed at the northern stars.',
        text: 'The north entrance leads into a long, low passage that slopes down into the bedrock.',
        facts: [['Entrance height', '11.80 m'], ['Slope', '25°'], ['Length', '74 m'], ['Cross-section', '1.10 wide × 1.05 m high']] },
      { id: 'lowerAnte', group: 'Lower system', name: 'Lower antechamber', color: 'lime', conf: 'surveyed',
        why: 'Its tall, narrow stepped roof is an early test of the technique later used in the Grand Gallery.',
        text: 'A tall, narrow corbelled space at the bottom of the passage. The lower chamber opens 6.5 m above its floor.',
        facts: [['Height', '12.60 m'], ['Length', '5.40 m']] },
      { id: 'lowerChamber', group: 'Lower system', name: 'Lower chamber', color: 'lime', conf: 'surveyed', major: true,
        why: 'One of the earliest large corbelled burial chambers, a model for the Red Pyramid and Khufu\u2019s pyramid.',
        text: 'A tall room with a corbelled roof that steps inward on all four sides. A short corridor from it leads to a vertical shaft on the pyramid’s axis.',
        facts: [['Floor plan', '4.96 × 4.30 m'], ['Roof height', '17.20 m'], ['Floor', '6.50 m above antechamber']] },
      { id: 'chimney', group: 'Lower system', name: 'Shaft on the axis', color: 'shaft', conf: 'approx', shaft: true,
        why: 'Its purpose is unknown, so it remains one of the Bent Pyramid\u2019s unsolved features.',
        text: 'A short corridor and a vertical shaft directly under the apex. Its purpose is unknown. Route simplified.',
        facts: [['Position', 'On the vertical axis']] },
      { id: 'west', group: 'Upper system', name: 'West entrance and passage', color: 'lime', conf: 'approx', major: true,
        why: 'It is the only Egyptian pyramid with a second entrance on the west side.',
        text: 'A second entrance high on the west face, the only Egyptian pyramid with one on that side. Its passage slopes down to a level section, where two portcullis slabs slid down 45° ramps to block it.',
        facts: [['Entrance height', '33.32 m'], ['Length', '67.66 m'], ['Portcullises', '2'], ['Slope', 'c. 29° (approx.)']] },
      { id: 'upperChamber', group: 'Upper system', name: 'Upper chamber', color: 'lime', conf: 'surveyed', major: true,
        why: 'The cedar beams, imported from Lebanon, show the walls were already shifting while the pyramid was being built.',
        photos: () => [ph('bent-chamber.jpg', 'Looking up at old wooden beams across a stone chamber', 'The original cedar beams in the upper chamber.', 'Panegyrics of Granovetter', 'CC BY-SA 2.0', 'https://commons.wikimedia.org/wiki/File:26722-_burial_chamber_in_Sneferu%27s_Bent_pyramid.jpg', V(-0.5, UC.y0 + 1.6, wS), V(0, UC.y0 + 7, wS + 0.8))],
        text: 'A corbelled room roofed on all four sides. It still contains a framework of original cedar beams, probably added to brace the walls as the masonry shifted.',
        facts: [['Floor plan', '7.97 × 5.26 m'], ['Roof height', '16.50 m'], ['Cedar', 'Original beams']] },
      { id: 'tunnel', group: 'Upper system', name: 'Connecting tunnel', color: 'shaft', conf: 'approx',
        why: 'Joining two separate chamber systems is unusual and shows the design changing during construction.',
        text: 'A rough tunnel joining the two systems. It starts at a hole high in the lower chamber, reached today by a 15 m ladder, and comes out in the west passage between the two portcullises.',
        facts: [['Ladder', '15 m'], ['Route', 'Approximate']] },
    ],
    build() {
      passage('north', nEntrance, nEnd, 1.1, 1.05);
      corbelRoom('lowerAnte', -0.9, 0.9, nEnd.y, ante[0], ante[1], 12.6, 3, 8, 0.05, 0.1);
      corbelRoom('lowerChamber', LC.x0, LC.x1, lowY, LC.s0, LC.s1, 17.2, 3.5, 14, 0.12, 0.13);
      route('chimney', [V(0, lowY, LC.s1), V(0, lowY, 0), V(0, lowY + 14, 0)], 0.9, 1.1);
      passage('west', wEntrance, wEnd, 1.1, 1.1);
      passage('west', wEnd, V(UC.x0, UC.y0, wS), 1.1, 1.3);
      for (const x of [-10.5, -6.6]) room('west', x, x + 0.5, UC.y0, UC.y0 + 2.2, wS - 0.75, wS + 0.75, extraMat(COL.lime.clone().multiplyScalar(0.7), 'lime'));
      corbelRoom('upperChamber', UC.x0, UC.x1, UC.y0, UC.s0, UC.s1, 16.5, 3.5, 14, 0.14, 0.09);
      const cedar = new THREE.MeshStandardMaterial({ color: COL.cedar, roughness: 0.9 });
      for (let i = 0; i < 5; i++) room('upperChamber', UC.x0 + 0.6 + i * 1.6, UC.x0 + 0.85 + i * 1.6, UC.y0 + 3.2, UC.y0 + 3.45, UC.s0, UC.s1, cedar);
      route('tunnel', [V(-1.0, lowY + 12, LC.s0 + 0.6), V(-3.5, lowY + 12.5, LC.s0 + 0.6), V(-6.5, -0.5, -1), V(-8.6, UC.y0, wS)], 1.0, 1.4);

      person(0.6, lowY, (LC.s0 + LC.s1) / 2, -0.4);
      person(0, nEnd.y, ante[0] + 2.7, Math.PI);
      person(-1.2, UC.y0, wS, 0.7);
      person(4, 0, -B - 5, Math.PI);
    },
  };
}
