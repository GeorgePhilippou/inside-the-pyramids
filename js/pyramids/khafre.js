// The Pyramid of Khafre, Giza (c. 2540 BC).
// Model units are metres: origin at the centre of the base, +x east, +y up, +z south.
export default function khafre(api) {
  const { THREE, V, D, up, ph, COL, passage, room, gabledRoom, corbelRoom, route, person, frame, put, halfAt, wallImage, extraMat } = api;

  const B = 215.25 / 2, K = Math.tan(53.167 * D), H = B * K;
  const AX = 12; // both passage systems c. 12 m east of the centre line
  const upA = 25.9 * D, lowA = 21.7 * D;
  const upEntrance = V(AX, 11.54, -(B - 11.54 / K));
  const upEnd = upEntrance.clone().add(V(0, -11.54, 11.54 / Math.tan(upA)));
  const BC = { x0: AX + 0.55 - 14.15, x1: AX + 0.55, y0: 0, s0: -2.5, s1: 2.5 };
  const lowEntrance = V(AX, 0, -B - 0.5);
  const LD = 30 * Math.sin(lowA);   // the lower passage descends about 30 m before levelling out
  const lowBottom = lowEntrance.clone().add(V(0, -LD, LD / Math.tan(lowA)));
  const ascFoot = V(AX, -LD, lowBottom.z + 20);
  const ascTop = V(AX, 0, ascFoot.z + LD / Math.tan(22 * D));

  return {
    id: 'khafre', king: 'Khafre', reign: [2558, 2532], year: 2540, lat: 29.97611, lon: 31.13083,
    short: 'Khafre', site: 'Giza', date: 'c. 2540 BC', title: 'The Pyramid of Khafre',
    rings: [[B, 0], [0, H]], today: 136.4, lowest: -13, start: 'burial',
    // Cut from a photogrammetry model of the plateau. Levelled and turned by fitting a plane to each face (53.2°; Khufu lies to the NE),
    // and scaled so the casing left near the top sits on the casing line; the stripped faces below are 2–3 m inside it.
    // The scan is too coarse to show the entrance hollow, so the opening is drawn flush on the scanned face.
    scan: { url: 'models/khafre.glb', today: true, centre: [-1.1176, 1.1068, 1.5344], up: [-0.0389, 0.9987, 0.0337], rotY: -0.7168, scale: [132.36, 132.36, 132.36], keepAbove: -0.3, inset: 2.6, flushDoors: true, keepWithin: B + 9 },
    tour: () => [
      { id: 'pyramid', path: [V(AX, 1.65, -B - 55)], look: V(AX, 12, upEntrance.z), say: 'Khafre\u2019s pyramid has two entrances on the north side: one in the face about 11.5 m up, and one in the pavement below it.' },
      { id: 'upper', path: [V(AX, 10, upEntrance.z - 8), up(upEntrance, 1.0), up(upEntrance.clone().lerp(upEnd, 0.6), 1.0)], look: up(upEnd, 1.0), say: 'The upper passage, lined with granite, slopes down to bedrock level. A granite portcullis once blocked its lower end.' },
      { id: 'horizontal', path: [up(upEnd, 1.0), up(V(AX, 0, -40), 1.0)], look: up(V(AX, 0, BC.s0), 1.0), say: 'The long level passage runs south to the burial chamber. The ramp from the lower entrance joins it along the way.' },
      { id: 'burial', path: [up(V(AX, 0, -3.2), 1.2), V(9, 1.65, 0)], look: V(0.3, 0.5, 0), say: 'The burial chamber, cut into the bedrock with a pointed roof of huge limestone beams. The granite sarcophagus is sunk into the floor near the west wall.' },
      { id: 'belzoni', path: [V(5.5, 1.65, -1.2)], look: V(5, 3.3, BC.s1), say: 'On the wall: \u201cScoperta da G. Belzoni 2 mar 1818\u201d, painted by the first modern visitor to reach this room.' },
    ],
    stats: [['Original height', '143.5 m'], ['Base', '215.25 m per side']],
    sources: 'M. Verner, <i>The Pyramids</i> (2001); M. Lehner, <i>The Complete Pyramids</i> (1997, 2008); W. M. F. Petrie (1883); G. Belzoni’s 1818 account. Overall size is surveyed. The published interior plans give few passage figures online, so passage angles and lengths here are approximate.',
    features: [
      { id: 'pyramid', group: 'Exterior', name: 'The pyramid', color: 'sand', conf: 'surveyed',
        why: 'It is linked by its causeway to the Great Sphinx, which most scholars attribute to Khafre.',
        photos: () => [ph('khafre-exterior.jpg', 'Khafre\'s pyramid with casing still at the top', 'Khafre\'s pyramid, with original casing still near the top.', 'MusikAnimal', 'CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:Pyramid_of_Khafre_Giza_Egypt_in_2015_2.jpg', V(40, 1.7, B + 150), V(0, 50, 0))],
        text: 'Built for Khafre, Khufu’s son. It is slightly smaller than the Great Pyramid but stands on bedrock about 10 m higher and has a steeper slope, so it often looks taller. The top of the pyramid still keeps part of its original limestone casing. In the Today look the pyramid is a 3D scan, cut from a model of the plateau (photogrammetry by pierre391, CC BY).',
        facts: [['Base side', '215.25 m · 411 cubits'], ['Original height', '143.5 m · 274 cubits'], ['Height today', '136.4 m'], ['Face slope', '53° 10′']] },
      { id: 'upper', group: 'Upper system', name: 'Upper entrance and passage', color: 'granite', conf: 'approx', major: true,
        photos: () => [ph('khafre-passage.jpg', 'Looking up a steep, narrow passage with a modern walkway and handrails', 'Looking back up the sloping passage toward the entrance.', 'Jon Bodsworth', 'Copyrighted free use', 'https://commons.wikimedia.org/wiki/File:04_khafre_passage.jpg', up(upEnd, 1.5), upEntrance)],
        why: 'It shows a simpler design than Khufu\u2019s, with everything kept near or below ground level.',
        text: 'The entrance used today, 11.54 m up the north face. A granite-lined passage slopes down to bedrock level, where a granite portcullis once closed it, then levels out. Like the lower system, it lies about 12 m east of the centre line.',
        facts: [['Entrance height', '11.54 m'], ['East of centre', 'c. 12 m'], ['Lining', 'Granite'], ['Slope', 'c. 26°']] },
      { id: 'horizontal', group: 'Upper system', name: 'Horizontal passage', color: 'rock', conf: 'approx',
        why: 'Running the route at bedrock level made the chamber easier to cut and to seal.',
        text: 'A long level corridor cut in the bedrock, running south to the burial chamber. The ramp from the lower system joins it partway along.',
        facts: [['Length', 'c. 70 m (approx.)'], ['Level', 'c. base level']] },
      { id: 'burial', group: 'Upper system', name: 'Burial chamber', color: 'rock', conf: 'surveyed', major: true,
        why: 'Its roof is partly built above ground and its floor cut into rock, a mix of two older ways of making royal tombs.',
        photos: () => [ph('khafre-burial.jpg', 'Burial chamber with the sarcophagus sunk into the floor', 'The burial chamber, looking west toward the sarcophagus.', 'Leon Petrosyan', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:The_Pyramide_of_Khofru_3.jpg', V(8.5, 1.6, 0), V(0, 0.4, 0))],
        text: 'A long room cut into a pit in the bedrock, with a pointed roof of huge limestone beams built above ground level. Giovanni Belzoni entered it on 2 March 1818 and painted his name on the wall, which can still be seen.',
        facts: [['Size', '14.15 E–W × 5 m N–S'], ['Height', 'nearly 7 m (approx.)'], ['Roof', 'Gabled limestone beams'], ['First entered', '1818, Belzoni']] },
      { id: 'sarcophagus', group: 'Upper system', name: 'Sarcophagus', color: 'granite', conf: 'approx',
        why: 'Sinking it into the floor made it hard to move or break into.',
        photos: () => [ph('khafre-sarcophagus.jpg', 'Granite sarcophagus set into the floor', 'Khafre\'s granite sarcophagus, partly sunk into the floor.', 'Kelisi', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:KhafresSarcophagus.jpg', V(2.8, 1.9, 1.6), V(0.3, 0.1, 0))],
        text: 'Carved from one block of granite and set partly into the floor near the west wall. A pit nearby probably held the canopic chest. Size shown is approximate.',
        facts: [['Material', 'Granite'], ['Set', 'Partly sunk in floor']] },
      { id: 'lower', group: 'Lower system', name: 'Lower entrance and passage', color: 'rock', conf: 'approx', major: true,
        why: 'It may belong to an earlier plan, when the pyramid was meant to stand further north.',
        text: 'A second entrance at the foot of the north face, cut entirely in the bedrock. Its passage descends, runs level past a portcullis, then climbs a ramp to join the horizontal passage of the upper system.',
        facts: [['Entrance', 'At ground level'], ['Slope', 'c. 21° 40′'], ['Sloping length', 'c. 30 m'], ['Height', 'c. 1.19 m'], ['Material', 'Cut in bedrock']] },
      { id: 'side', group: 'Lower system', name: 'Subsidiary chamber', color: 'rock', conf: 'approx', major: true,
        why: 'Its purpose is still debated, so it remains one of the open questions about this pyramid.',
        text: 'A side room opening west off the lower passage, about as long as Khufu’s King’s Chamber (Petrie). Its purpose is unclear; it may have stored burial goods, or it may be left over from an earlier plan.',
        facts: [['Size', 'c. 10.41 × 3.12 m'], ['Roof', 'Gabled'], ['Purpose', 'Unknown']] },
      { id: 'belzoni', group: 'Inscriptions and marks', color: 'mark', mark: true, conf: 'approx', at: V(5, 3.3, BC.s1 - 0.03), plaque: { file: 'khafre-belzoni.jpg', aspect: 1.6, facing: 'z-', w: 2.4 }, major: true, name: 'Belzoni\u2019s name',
        text: 'Giovanni Belzoni wrote his name and the date in large letters on a wall of the burial chamber when he entered in 1818. It is modern graffiti. No ancient inscriptions have been found inside this pyramid.',
        why: 'It records the first modern entry into the burial chamber.',
        photos: () => [ph('khafre-belzoni.jpg', 'Painted letters reading Belzoni, 2 March 1818', 'Belzoni\'s name and the date, 2 March 1818, on the chamber wall.', 'Inkapigen', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Inscription_in_the_pyramid.jpg', V(5, 3.3, -1.0), V(5, 3.6, BC.s1))],
        facts: [['Written', '2 March 1818'], ['Ancient texts inside', 'None found']] },
    ],
    build() {
      // Upper system
      passage('upper', upEntrance, upEnd, 1.05, 1.2);
      room('upper', AX - 0.75, AX + 0.75, 0, 1.6, upEnd.z + 0.6, upEnd.z + 1.0, extraMat(COL.granite, 'granite'));
      passage('horizontal', upEnd, V(AX, 0, BC.s0), 1.05, 1.75);
      gabledRoom('burial', BC.x0, BC.x1, BC.y0, 5.0, 6.83, BC.s0, BC.s1);
      api.ctx.mats.sarcophagus.color.multiplyScalar(0.75);
      room('sarcophagus', BC.x0 + 1.4, BC.x0 + 2.45, -0.4, 0.55, -1.3, 1.3);
      // Lower system
      passage('lower', lowEntrance, lowBottom, 1.05, 1.2);
      passage('lower', lowBottom, ascFoot, 1.05, 1.2);
      passage('lower', ascFoot, ascTop, 1.05, 1.2);
      room('lower', AX - 0.75, AX + 0.75, -LD, -LD + 1.8, lowBottom.z + 3, lowBottom.z + 3.4, extraMat(COL.granite, 'granite'));
      const sideS = lowBottom.z + 8;
      passage('side', V(AX, -LD, sideS), V(9.6, -LD, sideS), 1.0, 1.4);
      gabledRoom('side', 9.6 - 10.41, 9.6, -LD, 1.8, 2.61, sideS - 1.56, sideS + 1.56);

      person(BC.x0 + 4, 0, 0.6, -0.5);
      person(AX - 3, 0, -0.8, 0.4);
      person(4, -LD, sideS, 1.2);
      person(AX + 4, 0, -B - 6, Math.PI);
    },
  };
}
