// The Great Pyramid of Khufu, Giza (c. 2570 BC). Chamber positions from Petrie (1883).
// Model units are metres: origin at the centre of the base, +x east, +y up, +z south.
export default function khufu(api) {
  const { THREE, V, D, up, ph, COL, passage, room, gabledRoom, corbelRoom, route, person, frame, put, halfAt, wallImage, extraMat } = api;

  const B = 230.33 / 2, K = Math.tan(51.844 * D), H = B * K;
  const AX = 7.29; // passage system lies 7.29 m east of the N–S centre line (Petrie)
  const descA = 26.52 * D, ascA = 26.04 * D;
  const descDir = V(0, -Math.sin(descA), Math.cos(descA));
  const ascDir = V(0, Math.sin(ascA), Math.cos(ascA));
  // Positions from Petrie (1883), measured from the centre of the base (+s = south of centre)
  const entrance = V(AX, 16.97, -115.17 + 13.31);                 // doorway 668.2 in up, 524.1 in in from the north edge
  const descEnd = entrance.clone().addScaledVector(descDir, (16.97 + 30.0) / Math.sin(descA));   // floor ends 1181 in below the pavement
  const ascStart = V(AX, 4.39, -41.32 - 35.29);                   // ascending floor starts 172.9 in up, 1389.5 in north of the Gallery
  const galStart = V(AX, 21.66, -41.32);                          // Gallery begins 1626.8 in north of centre
  const galEnd = V(AX, 21.66 + 41.33 * Math.tan(26.2 * D), 0.01); // Great Step face, 0.4 in south of centre
  const KC = { x0: -2.74, x1: 7.75, y0: 43.0, y1: 48.83, s0: 8.40, s1: 13.64 };   // walls 330.6 / 537.0 in S, 305.1 in E, 107.7 in W
  const QC = { x0: AX - 2.88, x1: AX + 2.88, y0: 21.19, s0: -2.625, s1: 2.605 };  // ridge 0.3 in north of centre
  const hitFace = (p, d) => d.z < 0 ? (K * (B + p.z) - p.y) / (d.y - K * d.z) : (K * (B - p.z) - p.y) / (d.y + K * d.z);

  return {
    id: 'khufu', king: 'Khufu', reign: [2589, 2566], year: 2570, lat: 29.97917, lon: 31.13417,
    short: 'Khufu', site: 'Giza', date: 'c. 2570 BC', title: 'The Great Pyramid of Khufu',
    rings: [[B, 0], [0, H]], today: 138.5, lowest: -30, start: 'king',
    tour: () => [
      { id: 'pyramid', path: [V(AX, 1.65, -B - 60)], look: V(AX, 17, entrance.z), say: 'We start on the north side. The original entrance is about 17 m up the face, a little east of the centre line.' },
      { id: 'entrance', path: [V(AX, 15, entrance.z - 9), up(entrance, 1.0)], look: up(entrance.clone().addScaledVector(descDir, 15), 1.0), say: 'The real entrance. From here a passage only 1.2 m high slopes steeply down into the pyramid.' },
      { id: 'descending', path: [up(entrance.clone().addScaledVector(descDir, 26), 1.0)], look: up(entrance.clone().addScaledVector(descDir, 45), 1.0), say: 'The descending passage runs on for about 100 m, deep into the bedrock. We turn off just ahead, where a hidden passage climbs upward.' },
      { id: 'ascending', path: [up(entrance.clone().addScaledVector(descDir, 28.6), 1.0), up(ascStart, 1.0), up(ascStart.clone().addScaledVector(ascDir, 22), 1.0)], look: up(galStart, 1.0), say: 'The ascending passage. Its lower end is still blocked by three granite plugs; visitors today reach it through the robbers\u2019 tunnel.' },
      { id: 'queen', path: [up(galStart, 1.0), up(V(AX, 21.66, -9), 1.0), up(V(AX, QC.y0, -3.4), 1.3), V(AX - 1.2, QC.y0 + 1.65, -0.8)], look: V(QC.x1, QC.y0 + 2.4, 0), say: 'A side trip along the level passage to the Queen\u2019s Chamber, which sits exactly on the pyramid\u2019s east\u2013west axis. The tall niche in the east wall may once have held a statue.' },
      { id: 'gallery', path: [up(V(AX, QC.y0, -3.4), 1.3), up(V(AX, 21.66, -9), 1.0), up(galStart.clone().add(V(0, 0, 1.6)), 1.65)], look: galStart.clone().addScaledVector(ascDir, 40).add(V(0, 4, 0)), say: 'The Grand Gallery: 46.7 m long and 8.6 m high. Its walls step inward in seven courses so the roof can span the gap without an arch.' },
      { id: 'antechamber', path: [up(galStart.clone().addScaledVector(ascDir, 16), 1.65), up(galStart.clone().addScaledVector(ascDir, 44), 1.65), up(V(AX, 43.01, 1.3), 1.0), up(V(AX, 43.0, 2.4), 1.0), V(AX, 44.6, 4.3)], look: V(AX, 44.4, 8.4), say: 'Over the Great Step and into the antechamber, where three stone slabs once slid down in grooves to seal the way.' },
      { id: 'king', path: [up(V(AX, 43.0, 6.5), 1.0), up(V(AX, 43.0, 8.7), 1.0), V(4.6, 44.65, 11.6)], look: V(KC.x0 + 1.7, 43.6, 11.9), say: 'The King\u2019s Chamber, lined entirely with granite from Aswan. The lidless sarcophagus at the far end is the only thing left in it.' },
      { id: 'relieving', path: [V(3, 44.65, 11.2)], look: V(3, 62, 11.6), say: 'Above this flat ceiling are five more low chambers, stacked to spread the weight of the stone above. Their walls carry the builders\u2019 painted marks naming Khufu.' },
    ],
    stats: [['Original height', '146.6 m'], ['Base', '230.3 m per side']],
    sources: 'W. M. F. Petrie, <i>The Pyramids and Temples of Gizeh</i> (1883); V. Maragioglio &amp; C. Rinaldi, <i>L’Architettura delle Piramidi Menfite</i> IV (1965); M. Lehner, <i>The Complete Pyramids</i> (1997); G. Dormion, <i>La chambre de Chéops</i> (2004); Morishima et al., <i>Nature</i> 552 (2017); Procureur et al., <i>Nature Communications</i> 14 (2023).',
    features: [
      { id: 'pyramid', group: 'Exterior', name: 'The pyramid', color: 'sand', conf: 'surveyed',
        why: 'It was the tallest building on Earth for about 3,800 years, and it is the only one of the Seven Wonders of the Ancient World still standing.',
        photos: () => [ph('khufu-exterior.jpg', 'The Great Pyramid seen from close to its base', 'The Great Pyramid from close to its base.', 'Jorge Láscar', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:The_Great_Pyramid_of_Giza_(14794652632).jpg', V(70, 1.7, -B - 55), V(-10, 45, 0))],
        text: 'The largest of the Giza pyramids, built for King Khufu of the 4th Dynasty. Its sides face the cardinal directions to within a few arcminutes. The smooth white limestone casing that once covered it was mostly stripped in the Middle Ages.',
        facts: [['Base side', '230.3 m · 440 cubits'], ['Original height', 'c. 146.6 m · 280 cubits'], ['Height today', 'c. 138.5 m'], ['Face slope', '51° 50′ 40″'], ['Volume', 'c. 2.6 million m³']] },
      { id: 'entrance', group: 'Exterior', name: 'Original entrance', color: 'lime', conf: 'surveyed', major: true,
        why: 'Placing it high on the north face points the passage at the northern sky, where Egyptians placed the never-setting stars they linked to the king\u2019s afterlife.',
        photos: () => [ph('khufu-entrance.jpg', '19th-century photograph of the pyramid entrance', 'A 19th-century photograph of the original entrance and the chevron blocks above it.', 'Boston Public Library, Tupper Scrapbooks', 'Public domain', 'https://commons.wikimedia.org/wiki/File:The_Entrance_to_Great_Pyramid_by_Boston_Public_Library.jpg', V(AX, 8, -B - 18), V(AX, 18, entrance.z))],
        text: 'The real entrance, on the north face. Like every main passage, it sits a little over 7 m east of the centre line. Visitors today go in through the robbers’ tunnel lower down.',
        facts: [['Height above base', '16.97 m (Petrie)'], ['East of centre', '7.3 m (Petrie) · 7.9 m (M&R)'], ['Opening', '1.05 × 1.20 m']] },
      { id: 'chevrons', group: 'Exterior', name: 'Chevron blocks', color: 'lime', conf: 'approx',
        why: 'An early example of builders steering weight around an opening, the same idea used on a much larger scale above the King\u2019s Chamber.',
        text: 'Two pairs of huge limestone blocks leaning against each other above the entrance. They carry the weight of the masonry away from the passage roof. Shown here in simplified form.',
        facts: [['Layout', '2 gabled pairs'], ['Material', 'Limestone']] },
      { id: 'robbers', group: 'Exterior', name: 'Robbers’ tunnel', color: 'shaft', conf: 'approx',
        why: 'It reached the hidden ascending passage, whose entrance had been sealed and disguised. Without it, the upper chambers might have stayed unknown much longer.',
        text: 'A rough tunnel forced through the core masonry, traditionally credited to Caliph al-Ma’mun around AD 820. It meets the ascending passage beside the granite plugs, which the diggers went around. It is the tourist entrance today.',
        facts: [['Starts at', 'c. 7 m above base'], ['Length', 'c. 30 m'], ['Route', 'Simplified']] },
      { id: 'descending', group: 'Below ground', name: 'Descending passage', color: 'rock', conf: 'surveyed', major: true,
        why: 'Its straight line and steady angle over about 100 m show how precisely the builders could set out a slope.',
        text: 'A long, straight, narrow corridor sloping down from the entrance. The upper part runs through built masonry and the rest is cut into the bedrock below the pyramid. You cannot stand upright in it.',
        facts: [['Slope', '26° 31′ (Petrie) · 26° 27′ (Dormion)'], ['Length', 'c. 100 m'], ['Cross-section', 'c. 1.05 × 1.20 m'], ['Lowest point', '30.0 m below base (Petrie)'], ['Then level passage', '8.84 m']] },
      { id: 'subterranean', group: 'Below ground', name: 'Subterranean chamber', color: 'rock', conf: 'approx', major: true,
        why: 'Probably the first planned burial chamber. Leaving it unfinished suggests the design changed during construction.',
        photos: () => [ph('khufu-subterranean.jpg', 'Old photograph of a rough rock-cut chamber', 'The unfinished Subterranean Chamber, photographed in the early 1900s by John and Edgar Morton.', 'John and Edgar Morton', 'Public domain', 'https://commons.wikimedia.org/wiki/File:27_edgar.jpg', V(7.0, -28.2, 4.4), V(-1, -28.6, 0))],
        text: 'An unfinished room cut deep in the bedrock. The floor was never levelled and much of the western half is still solid rock. A small dead-end passage leads south from it.',
        facts: [['Size', '14.1 E–W × 8.4 m N–S'], ['Height', 'c. 4 m (uneven)'], ['Depth', 'roof 26.8 m, floor c. 30.4 m below base (Petrie)'], ['South passage', 'c. 16 m, dead end']] },
      { id: 'well', group: 'Below ground', name: 'Well shaft', color: 'rock', conf: 'approx',
        why: 'It explains how the workers who sealed the upper passages could get out afterwards.',
        text: 'An irregular, almost vertical shaft linking the bottom of the Grand Gallery to the lower descending passage. It passes a natural cavity called the Grotto, where the bedrock rises about 5.7 m above the base. It was probably the workers’ way out after the passage was plugged.',
        facts: [['Length', 'c. 50 m'], ['Grotto', 'c. 5.7 m above base'], ['Route', 'Irregular, simplified']] },
      { id: 'ascending', group: 'Ascending system', name: 'Ascending passage', color: 'lime', conf: 'surveyed',
        why: 'It let the burial chambers sit high in the masonry instead of underground, a major change from earlier pyramids.',
        text: 'Branches up from the roof of the descending passage and climbs to the Grand Gallery. Its entrance was hidden behind a ceiling block and only discovered when the robbers’ tunnel broke through.',
        facts: [['Slope', 'c. 26° (26° 2′–26° 6′)'], ['Length', '39.3 m · 75 cubits'], ['Cross-section', 'c. 1.05 × 1.20 m']] },
      { id: 'plugs', group: 'Ascending system', name: 'Granite plugs', color: 'granite', conf: 'surveyed',
        why: 'They were the main security system. Later diggers tunnelled around them because the granite was too hard to cut.',
        text: 'Three granite blocks still jammed in the lower end of the ascending passage. They were slid down from above to seal the upper chambers.',
        facts: [['Number', '3'], ['Lengths', '1.57, 1.67, 1.0 m'], ['Material', 'Granite']] },
      { id: 'gallery', group: 'Ascending system', name: 'Grand Gallery', color: 'lime', conf: 'surveyed', major: true,
        why: 'One of the most impressive spaces of the Old Kingdom. Its stepped roof carries the weight above without any arch.',
        photos: () => [ph('khufu-gallery-2.jpg', 'Looking up the Grand Gallery with its modern walkway', 'Looking up the Grand Gallery from near its foot.', 'Mike McBey', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Looking_upwards,_along_the_Grand_Gallery,_inside_the_Great_Pyramid_1984_(50535456558).jpg', galStart.clone().addScaledVector(ascDir, 4).add(V(0, 1.7, 0)), galStart.clone().addScaledVector(ascDir, 40).add(V(0, 3, 0))), ph('khufu-gallery-1.jpg', 'The tall, narrow Grand Gallery in low light', 'The corbelled walls rising on both sides of the Grand Gallery.', 'Keith Adler', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Great_Pyramid_of_Giza_Grand_Gallery.jpg', galStart.clone().addScaledVector(ascDir, 10).add(V(0, 1.7, 0)), galStart.clone().addScaledVector(ascDir, 45).add(V(0, 5, 0)))],
        text: 'A tall, steep hall with a corbelled roof: each of the seven upper courses of stone steps inward. A narrow channel runs up the middle between two side ramps.',
        facts: [['Length', '46.7 m'], ['Height', '8.6 m'], ['Width at floor', '2.06 m'], ['Width at roof', 'c. 1.04 m'], ['Corbel courses', '7, from 2.29 m up']] },
      { id: 'queenPassage', group: 'Ascending system', name: 'Queen’s Chamber passage', color: 'lime', conf: 'surveyed',
        why: 'It leads to the middle chamber, a sign of the builders\u2019 second-stage plan.',
        text: 'A level corridor running south from the foot of the Grand Gallery. The floor drops by about half a metre shortly before the chamber.',
        facts: [['Cross-section', '1.05 × 1.17 m'], ['Height after step', '1.68 m'], ['Floor step', 'c. 0.5 m']] },
      { id: 'queen', group: 'Ascending system', name: 'Queen’s Chamber', color: 'lime', conf: 'surveyed', major: true,
        why: 'Probably a second planned burial chamber or a room for a statue of the king, left unfinished when the design moved higher.',
        text: 'A limestone room with a pointed roof, lying exactly on the pyramid’s east–west axis. The name came from early Arab travellers; no queen was buried here. A tall corbelled niche is set into the east wall.',
        facts: [['Size', '5.76 E–W × 5.23 m N–S'], ['Height at ridge', '6.23 m'], ['Floor above base', 'c. 21 m'], ['East niche', '4.67 m high']] },
      { id: 'queenShafts', group: 'Ascending system', name: 'Queen’s Chamber shafts', color: 'shaft', conf: 'approx', shaft: true,
        why: 'Their sealed stone \u201cdoors\u201d are among the pyramid\u2019s last unexplained features.',
        text: 'Two tiny shafts that never reach the outside. In 1993 Rudolf Gantenbrink’s robot Upuaut-2 found the south shaft closed about 65 m in by a small stone slab with two copper pins. A 2002 probe drilled through and found another stone behind it.',
        facts: [['Cross-section', 'c. 20 × 20 cm'], ['Rise', 'c. 39°'], ['Blocked at', 'c. 65 m']] },
      { id: 'antechamber', group: 'King’s level', name: 'Antechamber', color: 'granite', conf: 'surveyed',
        why: 'Its portcullis slabs were the last barrier before the burial.',
        text: 'A small granite-lined room in front of the King’s Chamber. Grooves in its walls once held three sliding stone portcullis slabs.',
        facts: [['Length', '2.95 m'], ['Width', '1.65 m (Petrie)'], ['Height', '3.79 m'], ['Portcullis slots', '3']] },
      { id: 'king', group: 'King’s level', name: 'King’s Chamber', color: 'granite', conf: 'surveyed', major: true,
        why: 'The intended resting place of Khufu. No one had built a granite chamber this high inside a pyramid before.',
        photos: () => [ph('khufu-king-1.jpg', 'The granite sarcophagus in the King\'s Chamber', 'The sarcophagus at the west end of the King\'s Chamber.', 'Andrew Currie', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Khufu_Pyramid_-_King%27s_Chamber.jpg', V(4.5, 44.6, 12.0), V(-1.0, 43.6, 11.9)), ph('khufu-king-2.jpg', 'Visitors standing in the King\'s Chamber', 'Visitors in the King\'s Chamber, for a sense of its size.', 'Mike McBey', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:At_the_centre_of_the_Great_Pyramid_(47315820161).jpg', V(6.9, 44.5, 10.0), V(0, 44.2, 13.2))],
        text: 'The burial chamber, built entirely of red granite brought from Aswan, about 800 km up the Nile. The flat roof is spanned by nine granite beams.',
        facts: [['Size', '10.47 × 5.23 m'], ['In cubits', '20 × 10'], ['Height', '5.82 m'], ['Floor above base', 'c. 43 m'], ['Roof beams', '9, est. 25–80 t']] },
      { id: 'sarcophagus', group: 'King’s level', name: 'Sarcophagus', color: 'granite', conf: 'surveyed',
        why: 'It is the only object left in the burial chamber; no body or grave goods were ever found.',
        text: 'A plain, lidless granite box at the west end of the King’s Chamber. It was probably put in place before the chamber was roofed.',
        facts: [['Outside', 'c. 2.28 × 0.98 × 1.05 m'], ['Lid', 'Missing']] },
      { id: 'relieving', group: 'King’s level', name: 'Relieving chambers', color: 'granite', conf: 'approx',
        why: 'They spread the weight above the chamber, and the painted builders\u2019 marks inside are the strongest evidence that the pyramid was built for Khufu.',
        text: 'Five low compartments stacked above the King’s Chamber, topped by a pointed roof of limestone blocks. The lowest was found by Nathaniel Davison in the 1760s, the rest by Howard Vyse and John Perring in 1837. Painted builders’ marks inside name Khufu’s work gangs.',
        facts: [['Compartments', '5'], ['Top above ceiling', 'c. 17 m'], ['Heights shown', 'Approximate']] },
      { id: 'kingShafts', group: 'King’s level', name: 'King’s Chamber shafts', color: 'shaft', conf: 'approx', shaft: true,
        why: 'Some researchers think they pointed toward important stars of the time, linked to beliefs about the king\u2019s journey after death.',
        photos: () => [ph('khufu-shaft.jpg', 'Square opening of a shaft in a granite wall', 'The opening of the north shaft in the King\'s Chamber wall.', 'Vincent Brown', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Great_Pyramid_Air_Shaft_(39752498153).jpg', V(KC.x1 - 2.5, 44.0, KC.s0 + 1.6), V(KC.x1 - 2.5, 44.0, KC.s0))],
        text: 'Two narrow shafts that run from the chamber walls all the way to the outer faces. Their purpose is debated: ventilation, or a symbolic route for the king’s soul to the stars.',
        facts: [['North slope', 'c. 32½°, varies'], ['South slope', '45°'], ['Cross-section', 'c. 20 × 14 cm'], ['Above floor', '0.91 m']] },
      { id: 'bigVoid', group: 'Scan discoveries', name: 'The Big Void', color: 'scan', conf: 'uncertain', scan: true, major: true,
        why: 'The first major structure found inside the Great Pyramid since the 1800s, and it was found with particle physics.',
        text: 'Detected in 2017 by the ScanPyramids team using cosmic-ray muons. It is at least 30 m long with a cross-section similar to the Grand Gallery, somewhere above it. Nobody has entered it, and whether it is level or sloping is unknown. The box marks the general zone only.',
        facts: [['Found', '2017, muon imaging'], ['Length', '≥ 30 m'], ['Position', 'Uncertain']] },
      { id: 'nfc', group: 'Scan discoveries', name: 'North Face Corridor', color: 'scan', conf: 'approx', scan: true,
        why: 'It proved that muon scanning can find real hidden spaces, and it may help explain how the north face was built.',
        text: 'A hidden corridor behind the chevron blocks, first detected by scans in 2016 and seen directly with an endoscope in 2023. It has a pointed roof and ends after about 9 m. Its purpose is unknown.',
        facts: [['Confirmed', '2023, endoscope'], ['Length', 'c. 9 m'], ['Cross-section', 'c. 2 × 2 m'], ['Height', 'c. 17–23 m above ground']] },
      { id: 'quarryMarks', group: 'Inscriptions and marks', color: 'mark', mark: true, conf: 'surveyed', at: V((KC.x0 + KC.x1) / 2, 61.62, KC.s1 + 0.37), plaque: { file: 'khufu-cartouche-mark.jpg', aspect: 1.887, facing: 'z-', w: 1.2 }, major: true, name: 'Builders\u2019 marks naming Khufu',
        photos: () => [ph('khufu-cartouche-mark.jpg', 'Khufu\u2019s name in a red-painted cartouche', 'Khufu\u2019s name in a cartouche, as painted by a work gang, copied by the Lepsius expedition.', 'Karl Richard Lepsius', 'Public domain', 'https://commons.wikimedia.org/wiki/File:Kartu_Chufu01.JPG', V((KC.x0 + KC.x1) / 2, 61.9, KC.s1 - 1.2), V((KC.x0 + KC.x1) / 2, 61.6, KC.s1 + 0.4)), ph('khufu-gang-names.jpg', 'Four groups of hieroglyphs, each a work-gang name', 'The names of four work gangs painted in the relieving chambers, drawn by George Reisner.', 'George Andrew Reisner', 'Public domain', 'https://commons.wikimedia.org/wiki/File:Khufu_work_gang_names.png', V((KC.x0 + KC.x1) / 2, 61.9, KC.s1 - 1.2), V((KC.x0 + KC.x1) / 2, 61.6, KC.s1 + 0.4))],
        text: 'Red-painted marks left by the work gangs on blocks in the relieving chambers, found by Vyse and Perring in 1837. They include Khufu\u2019s name inside cartouches and gang names such as \u201cFriends of Khufu\u201d. They were painted during quarrying or building and were never meant to be seen.',
        why: 'They are the main physical evidence tying the pyramid to Khufu.',
        facts: [['Found', '1837'], ['Paint', 'Red ochre'], ['Names', 'Khufu, work gangs'], ['On the model', 'One cartouche, placed as an example']] },
      { id: 'lepsius', group: 'Inscriptions and marks', color: 'mark', mark: true, conf: 'surveyed', at: V(AX - 4.5, 26, -(B - 26 / K) - 0.3), plaque: { file: 'khufu-lepsius.jpg', aspect: 1.12, facing: 'z-', w: 0.9, crop: [0.624, 0.0875, 0.803, 0.205] }, name: 'Lepsius inscription',
        photos: () => [ph('khufu-lepsius.jpg', 'Pencil drawing of the entrance with a small inscribed panel above it', 'The entrance in 1842, drawn by the Lepsius expedition, with the new inscription panel at top right.', 'Lepsius expedition artist', 'Public domain', 'https://commons.wikimedia.org/wiki/File:Lepsius-inschrift-cheops-pyramide.jpeg', V(AX - 4.5, 25.6, -(B - 26 / K) - 3.2), V(AX - 4.5, 26, -(B - 26 / K)))],
        text: 'A hieroglyphic text carved above the entrance in 1842 by the Prussian expedition led by Karl Richard Lepsius, in honour of King Friedrich Wilhelm IV. It is modern, written in the ancient script.',
        why: 'It is the most visible hieroglyphic text on the pyramid, and a record of the birth of scientific Egyptology.',
        facts: [['Carved', '1842'], ['Script', 'Hieroglyphs (modern)'], ['Size on model', 'Estimated from the drawing']] },
      { id: 'djediMarks', group: 'Inscriptions and marks', color: 'mark', mark: true, conf: 'approx', at: V(AX, 62.9, 53.6), outline: { w: 0.6, h: 0.6 }, name: 'Marks behind the shaft door',
        text: 'In 2011 the Djedi robot pushed a small camera past the stone door in the Queen\u2019s Chamber south shaft and filmed red-painted marks on the floor behind it. They may be builders\u2019 numbers.',
        why: 'They are the only marks ever seen in the shafts, and could help explain how the shafts were laid out.',
        facts: [['Filmed', '2011, Djedi robot'], ['Paint', 'Red'], ['On the model', 'Location only']] },
    ],
    build() {
      const M = api.ctx.mats;
      // Descending passage, level passage, subterranean chamber, dead-end south passage
      passage('descending', entrance, descEnd, 1.05, 1.2);
      const SC = { s0: descEnd.z + 8.84, s1: descEnd.z + 8.84 + 8.37 };   // roof 26.82 m and floor c. 30.4 m below the pavement
      passage('descending', descEnd, V(AX, descEnd.y, SC.s0), 0.85, 0.92);
      room('subterranean', -6.0, 8.1, -30.38, -26.82, SC.s0, SC.s1);
      passage('subterranean', V(0.5, -30.0, SC.s1), V(0.5, -30.0, SC.s1 + 16.4), 0.75, 0.75);

      // Entrance marker and chevrons
      room('entrance', AX - 0.8, AX + 0.8, entrance.y - 0.2, entrance.y + 1.6, entrance.z - 0.5, entrance.z + 1.2);
      [[0, 19.2], [1, 21.4]].forEach(([i, ry]) => {
        const s = -(B - ry / K) + 1.5 + i * 1.0;
        for (const side of [-1, 1]) {
          const slab = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.9, 2.4), M.chevrons);
          slab.position.set(AX + side * 1.25, ry - 1.1, s);
          slab.rotation.z = -side * 40 * D;
          put('chevrons', slab);
        }
      });

      // Ascending passage with granite plugs
      passage('ascending', ascStart, galStart, 1.05, 1.2);
      let t = 0.4;
      for (const len of [1.57, 1.67, 1.0]) {
        const a = ascStart.clone().addScaledVector(ascDir, t);
        passage('plugs', a, a.clone().addScaledVector(ascDir, len - 0.04), 1.07, 1.22);
        t += len;
      }

      // Robbers' tunnel
      route('robbers', [V(AX - 3, 7, -(B - 7 / K)), V(AX - 3, 7, -82), V(AX - 1.4, 6.8, -75.5), ascStart.clone().addScaledVector(ascDir, 5.4).setX(AX - 0.5)], 1.6, 1.8);

      // Grand Gallery: corbelled profile extruded along its slope
      {
        const f = frame(galStart, galEnd);
        const sh = new THREE.Shape();
        const wall = 2.29, step = (8.6 - wall) / 7, inset = 0.076;
        sh.moveTo(-1.03, 0); sh.lineTo(1.03, 0);
        let hw = 1.03, y = wall;
        sh.lineTo(hw, y);
        for (let i = 0; i < 7; i++) { hw -= inset; sh.lineTo(hw, y); y += step; sh.lineTo(hw, y); }
        sh.lineTo(-hw, y);
        for (let i = 0; i < 7; i++) { y -= step; sh.lineTo(-hw, y); hw += inset; sh.lineTo(-hw, y); }
        sh.closePath();
        const m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: f.len, bevelEnabled: false }), M.gallery);
        m.quaternion.copy(f.q);
        m.position.copy(galStart);
        put('gallery', m);
        const rampMat = extraMat(COL.lime.clone().multiplyScalar(0.7), 'lime');
        for (const side of [-1, 1]) {
          const r = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.61, f.len), rampMat);
          r.quaternion.copy(f.q);
          r.position.copy(galStart).addScaledVector(f.x, side * 0.785).addScaledVector(f.dir, f.len / 2).addScaledVector(f.n, 0.31);
          r.userData.fid = 'gallery'; api.ctx.groups.gallery.add(r); api.ctx.pickables.push(r);
        }
      }

      // Queen's Chamber passage, chamber, niche
      passage('queenPassage', galStart, V(AX, 21.66, -8.4), 1.05, 1.30);
      passage('queenPassage', V(AX, QC.y0, -8.4), V(AX, QC.y0, QC.s0), 1.05, 1.77);
      gabledRoom('queen', QC.x0, QC.x1, QC.y0, 4.69, 6.23, QC.s0, QC.s1);
      room('queen', QC.x1, QC.x1 + 1.0, QC.y0, QC.y0 + 4.67, -0.79, 0.79);

      // Queen's Chamber shafts (north one jogs west around the Grand Gallery)
      {
        const sA = 39.6 * D, nA = 37.5 * D;
        const s0 = V(AX, 22.2, QC.s1), s1 = V(AX, 22.2, QC.s1 + 2);
        const s2 = s1.clone().add(V(0, Math.sin(sA), Math.cos(sA)).multiplyScalar(63));
        route('queenShafts', [s0, s1, s2], 0.2, 0.2);
        const n0 = V(AX, 22.2, QC.s0), n1 = V(AX, 22.2, QC.s0 - 2);
        const nd = V(0, Math.sin(nA), -Math.cos(nA));
        const n2 = n1.clone().addScaledVector(nd, 14);
        const n3 = n2.clone().addScaledVector(nd, 3).setX(AX - 3);
        const n4 = n3.clone().addScaledVector(nd, 14);
        const n5 = n4.clone().addScaledVector(nd, 3).setX(AX);
        const n6 = n5.clone().addScaledVector(nd, 25);
        route('queenShafts', [n0, n1, n2, n3, n4, n5, n6], 0.2, 0.2);
        for (const p of [s2, n6]) {
          const door = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), M.queenShafts);
          door.position.copy(p); put('queenShafts', door);
        }
      }

      // Well shaft and Grotto
      route('well', [V(AX - 1.03, 21.6, -40.4), V(AX - 1.03, 13.6, -40.4), V(AX - 1.9, 5.7, -37.5), V(AX - 1.5, -7, -25.5), V(AX - 0.6, -24, -19.8)], 0.9, 0.9);
      {
        const grotto = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 10), M.well);
        grotto.position.set(AX - 1.9, 5.7, -37.5); put('well', grotto, false);
      }

      // King's level: great step, low passages, antechamber, chamber, sarcophagus
      room('king', AX - 1.03, AX + 1.03, galEnd.y, 43.01, 0.01, 1.56);   // the Great Step
      passage('antechamber', V(AX, KC.y0, 1.56), V(AX, KC.y0, 2.89), 1.05, 1.11);
      room('antechamber', AX - 0.825, AX + 0.825, KC.y0, KC.y0 + 3.79, 2.89, 5.84);   // 65.0 in wide (Petrie)
      passage('antechamber', V(AX, KC.y0, 5.84), V(AX, KC.y0, KC.s0), 1.05, 1.11);
      room('king', KC.x0, KC.x1, KC.y0, KC.y1, KC.s0, KC.s1);
      M.sarcophagus.color.multiplyScalar(0.75);
      room('sarcophagus', KC.x0 + 1.2, KC.x0 + 2.18, KC.y0, KC.y0 + 1.05, KC.s0 + 1.47, KC.s0 + 3.75);

      // Relieving chambers: five compartments, the top one gabled
      const floors = [49.9, 52.7, 55.5, 58.3, 61.1];
      floors.slice(0, 4).forEach(y => room('relieving', KC.x0, KC.x1, y, y + 0.95, KC.s0 - 0.2, KC.s1 + 0.2));
      gabledRoom('relieving', KC.x0, KC.x1, floors[4], 1.0, 4.7, KC.s0 - 0.4, KC.s1 + 0.4);

      // King's Chamber shafts, run to the outer faces
      {
        const nA = 32.5 * D, sA = 45 * D;
        const n0 = V(KC.x1 - 2.5, KC.y0 + 0.91, KC.s0), n1 = n0.clone().add(V(0, 0, -2.4));
        const nd = V(0, Math.sin(nA), -Math.cos(nA));
        route('kingShafts', [n0, n1, n1.clone().addScaledVector(nd, hitFace(n1, nd))], 0.2, 0.14);
        const s0 = V(KC.x1 - 2.5, KC.y0 + 0.91, KC.s1), s1 = s0.clone().add(V(0, 0, 2.4));
        const sd = V(0, Math.sin(sA), Math.cos(sA));
        route('kingShafts', [s0, s1, s1.clone().addScaledVector(sd, hitFace(s1, sd))], 0.2, 0.14);
      }

      // Scan discoveries
      {
        const a = galStart.clone().addScaledVector(ascDir, 8).add(V(0, 15, 0));
        passage('bigVoid', a, a.clone().addScaledVector(ascDir, 30), 2.1, 8);
        const faceS = -(B - 20.5 / K);
        const sh = new THREE.Shape();
        sh.moveTo(-1.0, 0); sh.lineTo(1.0, 0); sh.lineTo(1.0, 1.45); sh.lineTo(0, 2.0); sh.lineTo(-1.0, 1.45); sh.closePath();
        const n = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 9, bevelEnabled: false }), M.nfc);
        n.position.set(AX, 20.5, faceS + 1.5);
        put('nfc', n);
      }

      person(KC.x0 + 4.2, KC.y0, KC.s1 - 0.7, -0.6);
      person(AX - 1.0, KC.y0, KC.s0 + 3.6, 0.9);
      { const p = galStart.clone().addScaledVector(ascDir, 22); person(AX, p.y, p.z, Math.PI); }
      person(AX - 0.8, QC.y0, 0.4, 0.4);
      person(AX, KC.y0, galEnd.z + 4.4, Math.PI);
      person(1.5, -30.38, (SC.s0 + SC.s1) / 2, 0.3);
      person(AX + 4, 0, -B - 6, Math.PI);
      person(AX + 6, 0, -B - 9, 2.6);
    },
  };
}
