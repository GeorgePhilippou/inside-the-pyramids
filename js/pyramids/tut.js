// The tomb of Tutankhamun, KV 62, Valley of the Kings (c. 1325 BC).
// Model units are metres: origin at the top of the entrance stairs, +x east, +y up, +z south.
// Room and corridor sizes are the Theban Mapping Project survey. The tomb runs almost due west (271.68°).
// Floor levels are not published room by room, so the depths here are approximate.
export default function tut(api) {
  const { THREE, V, D, up, ph, COL, passage, room, gabledRoom, corbelRoom, route, person, frame, put, halfAt, wallImage, extraMat } = api;

  const stairX = 5.61, stairDrop = 4.0;                         // entryway A: 16 steps
  const fB = -stairDrop, fI = -5.6, fJ = fI - 0.9;               // floor of corridor B, chamber I, and the lower rooms
  const I = { x0: -18.73, x1: -15.18, z0: -6.2, z1: 1.66 };      // antechamber: 3.55 × 7.86 m
  const J = { x0: -19.5, x1: -13.1, z0: -10.34, z1: -6.2 };      // burial chamber: 6.4 × 4.14 m, north of I
  const Ia = { x0: -22.03, x1: -19.43, z0: -1.55, z1: 2.75 };    // annex: 2.6 × 4.3 m
  const Ja = { x0: -12.58, x1: -8.75, z0: -10.65, z1: -5.9 };    // treasury: 3.83 × 4.75 m
  const jc = [(J.x0 + J.x1) / 2, (J.z0 + J.z1) / 2];
  const hill = (x, z) => Math.max(0, (-28 - x) * 0.45) + Math.max(0, (-24 - z) * 0.35) + Math.max(0, (x - 40) * 0.2);
  const terrain = {
    size: [200, 200], center: [-20, -10], step: 2,
    h: (x, z) => { const b = hill(x, z); return b > 0 ? b + 1.2 * Math.sin(x * 0.21) * Math.sin(z * 0.17) * Math.min(1, b / 4) : 0; },
    holes: [[[0.1, -0.9], [0.1, 0.9], [-stairX + 1.0, 0.9], [-stairX + 1.0, -0.9]]],   // the open stairwell; its far end is roofed by rock
  };

  return {
    id: 'tut', kind: 'tomb', king: 'Tutankhamun', reign: [1336, 1327], year: 1325, lat: 25.740389, lon: 32.601417,
    short: 'Tutankhamun', site: 'Valley of the Kings', date: 'c. 1325 BC', title: 'The tomb of Tutankhamun (KV 62)',
    rings: [[40, 0], [40, 0.01]], terrain, lowest: fJ - 1, start: 'burial',
    overview: { t: [-14, -4.5, -4], p: [22, 20, 34] },
    profile: [[0, 0], [-stairX, fB], [-14.3, fI], [-15.2, fI], [-15.2, fJ], [-22, fJ], [-22, fJ + 3.7], [-15.2, fI + 2.75], [-6.6, fB + 2.2], [-stairX + 1, 0]],
    tour: () => [
      { id: 'pyramid', path: [V(14, 1.65, 6)], look: V(-2, -1, 0), say: 'Tutankhamun’s tomb is cut into the floor of the valley. Its entrance lay hidden under the debris of a later tomb and some workmen’s huts, which is why robbers almost missed it.' },
      { id: 'entry', path: [V(1.5, 1.65, 0), V(-2.6, fB * 0.55 + 1.65, 0)], look: V(-8, fB + 0.8, 0), say: 'Sixteen steps lead down into the rock. Howard Carter’s team found the first of them on 4 November 1922.' },
      { id: 'corridor', path: [V(-6.4, fB + 1.6, 0), V(-12, fI + 1.6 + 0.4, 0)], look: V(-16, fI + 1.2, 0), say: 'The sloping corridor. When Carter found it, it was packed with rubble, put back after robbers had broken in shortly after the burial.' },
      { id: 'ante', path: [V(-15.6, fI + 1.6, 0.4), V(-16.6, fI + 1.6, -1.5)], look: V(-17, fI + 1.2, -6), say: 'The antechamber, where Carter first saw “wonderful things”: gilded couches, chariots and boxes piled up. The two guardian statues stood at the far end, either side of the sealed burial chamber.' },
      { id: 'annex', path: [V(-18.2, fI + 1.6, 0.6)], look: V(-21, fJ + 0.8, 0.6), say: 'Through a small hole in the west wall, the annex: a low storeroom crammed with more than 2,000 objects, from food and wine to weapons and toys.' },
      { id: 'burial', path: [V(-16.5, fI + 1.6, -5.6), V(-17.8, fJ + 1.6, -7.2)], look: V(-14, fJ + 1.8, -9.6), say: 'The burial chamber, the only painted room. Four gilded shrines once filled it almost wall to wall, nested around the stone sarcophagus.' },
      { id: 'treasury', path: [V(-13.6, fJ + 1.6, -8.3)], look: V(-9.5, fJ + 1, -8.3), say: 'The treasury, guarded by a statue of the jackal god Anubis on a shrine. Behind him stood the gilded canopic shrine holding the king’s internal organs.' },
    ],
    stats: [['Length', '30.8 m'], ['Rooms', '4']],
    sources: 'Theban Mapping Project, KV 62 survey (room sizes and orientation); H. Carter &amp; A. C. Mace, <i>The Tomb of Tut.ankh.Amen</i> (1923–33); N. Reeves, <i>The Complete Tutankhamun</i> (1990). Room and corridor sizes are surveyed. Floor levels are approximate.',
    features: [
      { id: 'pyramid', group: 'Outside', name: 'The valley floor', color: 'sand', conf: 'surveyed',
        why: 'Hidden under later debris, it was the only royal tomb in the valley found nearly intact.',
        text: 'A small tomb cut into the floor of the Valley of the Kings. It was probably not built for a king: when Tutankhamun died young, around age 19, this smaller tomb was used and quickly decorated. Debris from the later tomb of Ramesses VI covered its entrance, so it was forgotten.',
        facts: [['Found', '4 November 1922'], ['Total length', '30.80 m'], ['Floor area', '109.83 m²'], ['Axis', 'Almost due west']] },
      { id: 'entry', group: 'Entrance', name: 'Entrance stairway', color: 'rock', conf: 'surveyed',
        why: 'The first step, found under a workmen’s hut, began the most famous discovery in archaeology.',
        text: 'Sixteen steps cut down into the bedrock. The lowest part of the stairway runs under the rock of the valley floor. The last six steps and the doorway at the bottom were cut back in ancient times so that larger pieces of furniture could be carried down.',
        facts: [['Steps', '16'], ['Width', '1.66 m'], ['Length', '5.61 m']] },
      { id: 'corridor', group: 'Entrance', name: 'Descending corridor', color: 'rock', conf: 'surveyed',
        why: 'The rubble refilling it shows the tomb was robbed soon after the burial and then resealed.',
        text: 'A plain sloping corridor. It was found filled with limestone chips, packed in after robbers had tunnelled through and the tomb was restored by officials.',
        facts: [['Length', '7.67 m'], ['Width', '1.66 m'], ['Height', '1.98 m']] },
      { id: 'ante', group: 'Rooms', name: 'Antechamber', color: 'rock', conf: 'surveyed', major: true,
        why: 'Carter’s first view into it, by candlelight, became the defining moment of Egyptology.',
        text: 'A plain room crowded with furniture when it was found: three animal-headed gilded couches, dismantled chariots, chests and the king’s throne. Two life-size guardian statues stood either side of the sealed doorway to the burial chamber. Since 2007 the king’s mummy has lain here in a climate-controlled glass case.',
        facts: [['Size', '7.86 × 3.55 m'], ['Height', '2.75 m'], ['Decoration', 'None']] },
      { id: 'annex', group: 'Rooms', name: 'Annex', color: 'rock', conf: 'surveyed',
        why: 'Its jumble of everyday objects shows what the king was expected to need in the afterlife.',
        text: 'A storeroom off the antechamber, with its floor about 0.9 m lower. It held more than 2,000 objects in disorder: food, wine jars, oils, shabti figures, model boats, bows, throwing sticks, shields, and even toys and a box of paints.',
        facts: [['Size', '4.3 × 2.6 m'], ['Height', '2.63 m'], ['Objects', 'Over 2,000']] },
      { id: 'burial', group: 'Rooms', name: 'Burial chamber', color: 'paint', conf: 'surveyed', major: true,
        photos: () => [ph('tut-west.jpg', 'Rows of painted baboons on a yellow wall, with the sarcophagus in front', 'The west wall with the twelve baboons of the Amduat, and the sarcophagus in the foreground.', 'Romagy', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Tutankhamun_KV62_burial_chamber_and_sarcophagus.jpg', V(-13.7, fJ + 1.9, -7.0), V(J.x0, fJ + 2.0, -8.8)), ph('tut-north.jpg', 'Painted figures of the king and gods on a yellow wall above the stone sarcophagus', 'The north wall: Ay performing the Opening of the Mouth (right), the king greeting Nut, and the king with his ka embracing Osiris.', 'ولاء (Wala)', 'Public domain', 'https://commons.wikimedia.org/wiki/File:KV62,_Egypt_03.jpg', V(-16.3, fJ + 1.7, -6.7), V(-15.6, fJ + 2.0, J.z0))],
        why: 'It is the only royal burial ever found with its gold coffins and treasures still in place.',
        text: 'The only decorated room in the tomb, with its floor about 0.9 m below the antechamber. Four gilded wooden shrines nested inside each other almost filled it, around the stone sarcophagus and three coffins, the innermost of solid gold. The walls are painted on a yellow ground.',
        facts: [['Size', '6.4 × 4.14 m'], ['Height', '3.68 m'], ['Opened', '16 February 1923']] },
      { id: 'sarcophagus', group: 'Rooms', name: 'Sarcophagus', color: 'stone', conf: 'surveyed',
        why: 'It still stands where it was placed, the only one of the valley’s royal sarcophagi with its king nearby.',
        text: 'A box of yellow quartzite with a goddess carved at each corner, spreading her wings around it. Its lid is red granite painted yellow to match, probably because the original was not ready in time.',
        facts: [['Size', '2.75 × 1.33 × 1.49 m'], ['Box', 'Quartzite'], ['Lid', 'Granite, painted']] },
      { id: 'treasury', group: 'Rooms', name: 'Treasury', color: 'rock', conf: 'surveyed', major: true,
        why: 'Its canopic shrine and Anubis statue are among the finest objects ever found in Egypt.',
        text: 'A storeroom off the burial chamber, with no door. A statue of Anubis lying on a shrine guarded its entrance. Behind stood the gilded canopic shrine; inside it, a chest of calcite held four small gold coffins with the king’s internal organs.',
        facts: [['Size', '4.75 × 3.83 m'], ['Height', '2.35 m'], ['Guardian', 'Anubis shrine']] },
      { id: 'wallN', group: 'Painted walls', name: 'North wall', color: 'paint', inscribed: true, conf: 'surveyed',
        photos: () => [ph('tut-north.jpg', 'Painted figures of the king and gods on a yellow wall above the stone sarcophagus', 'The north wall: Ay performing the Opening of the Mouth (right), the king greeting Nut, and the king with his ka embracing Osiris.', 'ولاء (Wala)', 'Public domain', 'https://commons.wikimedia.org/wiki/File:KV62,_Egypt_03.jpg', V(-16.3, fJ + 1.7, -6.7), V(-15.6, fJ + 2.0, J.z0))],
        why: 'It shows his successor Ay performing the rite, a claim to the throne painted into the tomb.',
        text: 'From right to left: Ay, the next king, dressed as a priest, performs the Opening of the Mouth on Tutankhamun as Osiris; Tutankhamun greets the sky goddess Nut; and Tutankhamun, followed by his ka (spirit), embraces Osiris.',
        facts: [['Scenes', 'Opening of the Mouth; Nut; Osiris']] },
      { id: 'wallW', group: 'Painted walls', name: 'West wall', color: 'paint', inscribed: true, conf: 'surveyed',
        photos: () => [ph('tut-west.jpg', 'Rows of painted baboons on a yellow wall, with the sarcophagus in front', 'The west wall with the twelve baboons of the Amduat, and the sarcophagus in the foreground.', 'Romagy', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Tutankhamun_KV62_burial_chamber_and_sarcophagus.jpg', V(-13.7, fJ + 1.9, -7.0), V(J.x0, fJ + 2.0, -8.8))],
        why: 'It sets the king on the sun god’s night journey through the underworld.',
        text: 'Twelve baboons in rows, from the first hour of the Amduat (the book of “what is in the underworld”), with the sun god’s boat above them.',
        facts: [['Scene', 'Amduat, first hour']] },
      { id: 'wallS', group: 'Painted walls', name: 'South wall', color: 'paint', inscribed: true, conf: 'surveyed',
        why: 'Carter had to take part of it down to get into the chamber.',
        text: 'The king with Hathor, Anubis and Isis. Part of this wall was painted on the partition wall that Carter removed to enter the chamber.',
        facts: [['Scene', 'The king with gods']] },
      { id: 'wallE', group: 'Painted walls', name: 'East wall', color: 'paint', inscribed: true, conf: 'surveyed',
        photos: () => [ph('tut-east.jpg', 'Men in white robes pulling a shrine on a sledge, painted on a yellow wall', 'The east wall: courtiers drag the king\u2019s mummy to the tomb in a shrine on a sledge.', 'Romagy', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Tutankhamun_KV62_burial_chamber_procession.jpg', V(-18.6, fJ + 1.7, -8.3), V(J.x1, fJ + 2.0, -8.3))],
        why: 'It is the only scene of a royal funeral in the Valley of the Kings.',
        text: 'The funeral: courtiers in white, including two viziers with shaved heads, drag the king’s mummy on a sledge under a canopy.',
        facts: [['Scene', 'Funeral procession']] },
    ],
    build() {
      const M = api.ctx.mats;
      // Entrance stairs: the sixteen treads, open to the sky above
      for (let i = 0; i < 16; i++) {
        const x1 = -i * stairX / 16, x0 = -(i + 1) * stairX / 16, f = -(i + 1) * stairDrop / 16;
        room('entry', x0, x1, f - stairDrop / 16, f, -0.83, 0.83);
      }
      passage('corridor', V(-stairX, fB, 0), V(-6.6, fB, 0), 1.57, 2.18);
      passage('corridor', V(-6.6, fB, 0), V(-14.27, fI, 0), 1.66, 1.98);
      passage('ante', V(-14.27, fI, 0), V(I.x1, fI, 0), 1.53, 1.97);
      room('ante', I.x0, I.x1, fI, fI + 2.75, I.z0, I.z1);
      passage('annex', V(I.x0, fI, 0.6), V(Ia.x1, fI, 0.6), 1.0, 1.44);
      room('annex', Ia.x0, Ia.x1, fJ, fJ + 2.63, Ia.z0, Ia.z1);
      room('burial', J.x0, J.x1, fJ, fJ + 3.68, J.z0, J.z1);
      room('sarcophagus', jc[0] - 1.375, jc[0] + 1.375, fJ, fJ + 1.49, jc[1] - 0.665, jc[1] + 0.665);
      passage('treasury', V(J.x1, fJ, jc[1]), V(Ja.x0, fJ, jc[1]), 1.13, 1.67);
      room('treasury', Ja.x0, Ja.x1, fJ, fJ + 2.35, Ja.z0, Ja.z1);
      // The painted walls, as panels just inside each wall of the burial chamber
      const lo = fJ + 0.25, hi = fJ + 3.45, t = 0.06;
      room('wallN', J.x0 + 0.1, J.x1 - 0.1, lo, hi, J.z0 + 0.02, J.z0 + 0.02 + t);
      room('wallS', J.x0 + 0.1, J.x1 - 0.1, lo, hi, J.z1 - 0.02 - t, J.z1 - 0.02);
      room('wallW', J.x0 + 0.02, J.x0 + 0.02 + t, lo, hi, J.z0 + 0.1, J.z1 - 0.1);
      room('wallE', J.x1 - 0.02 - t, J.x1 - 0.02, lo, hi, J.z0 + 0.1, J.z1 - 0.1);
      M.sarcophagus.opacity = 0.85;

      person(-16.2, fI, -1.0, 0.6);
      person(-17.4, fJ, -9.4, 1.2);
      person(3, 0, 1.6, -Math.PI / 2);
    },
  };
}
