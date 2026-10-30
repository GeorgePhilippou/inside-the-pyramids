// The Great Sphinx, Giza (c. 2540 BC). Carved from the bedrock; it faces east.
// Model units are metres: origin at the middle of its base, +x east (the way it faces), +y up, +z south.
// Overall size is published (73 m long, 19 m wide, 20 m high). The body is a simplified sculpture;
// the holes and passages follow the published descriptions and are placed approximately.
export default function sphinx(api) {
  const { THREE, V, D, up, ph, COL, passage, room, gabledRoom, corbelRoom, route, person, frame, put, halfAt, wallImage, extraMat } = api;

  const L2 = 73 / 2, W2 = 19 / 2, H = 20;
  const backY = 12.5;                                   // top of the back (approximate)
  const backAt = x => backY * Math.sqrt(Math.max(0, 1 - ((x + 6) / 23) ** 2));   // height of the back at x
  const rb = (w, h, d, x, y, z, r = 1.2) => {
    const { RoundedBoxGeometry } = api;
    const g = new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2.2, h / 2.2, d / 2.2));
    g.translate(x, y, z);
    return g;
  };
  // upper half of an ellipsoid, resting on the floor
  const dome = (rx, ry, rz, x, z = 0) => {
    const g = new THREE.SphereGeometry(1, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    g.scale(rx, ry, rz); g.translate(x, 0, z);
    return g;
  };
  const shape = () => [
    dome(12, 10, 9.5, -24),                             // haunches
    dome(23, backY, 7.8, -6),                           // body
    dome(6.5, 15.5, 6.2, 9.5),                          // chest and shoulders
    rb(7, 7.5, 10.5, 12.2, 15.6, 0, 1.2),               // the nemes headdress
    rb(5.2, 6.4, 4.4, 15.2, 16.4, 0, 1.0),              // face
    rb(2.6, 2.6, 3.4, 12.6, H - 1.3, 0, 0.8),           // top of the head
    rb(1.6, 7, 3.2, 13.6, 11.2, -3.6, 0.5),             // lappets of the headdress
    rb(1.6, 7, 3.2, 13.6, 11.2, 3.6, 0.5),
    rb(23, 2.6, 3.6, 25, 1.3, -3.3, 0.9),               // front paws, 3 m apart
    rb(23, 2.6, 3.6, 25, 1.3, 3.3, 0.9),
    rb(14, 2.4, 3, -24, 1.2, W2 - 1.2, 0.9),            // hind paw and tail along the south side
  ];
  const rump = V(-30, 0, -W2 + 1.2);

  return {
    id: 'sphinx', kind: 'Sphinx', king: 'Khafre', reign: [2558, 2532], year: 2540, lat: 29.97528, lon: 31.13750,
    short: 'Sphinx', site: 'Giza', date: 'c. 2540 BC', title: 'The Great Sphinx',
    rings: [[L2, 0], [L2, H]], zr: W2 / L2, lowest: -6, start: 'rump', shape,
    profile: [[-L2, 0], [-L2, 9], [-30, 10.5], [-20, backY], [5, backY], [9, 15.5], [9.5, 19], [12, H], [14, H], [17.6, 18], [17.6, 13.4], [14.5, 12], [14.5, 2.6], [L2, 2.6], [L2, 0]],
    tour: () => [
      { id: 'pyramid', path: [V(L2 + 45, 1.65, 12)], look: V(10, 12, 0), say: 'The Great Sphinx, carved from the living rock of the Giza plateau. A lion’s body with a king’s head, probably Khafre’s, facing the sunrise.' },
      { id: 'stela', path: [V(L2 + 6, 1.65, 0), V(20, 1.65, 0)], look: V(14.6, 2.2, 0), say: 'Between the paws stands the Dream Stela, set up about 1,100 years later by Thutmose IV. It tells how the Sphinx promised him the throne if he cleared away the sand.' },
      { id: 'rump', path: [V(-22, 1.65, -W2 - 6), V(-30, 1.65, -W2 - 3)], look: up(rump, 1.0), say: 'Low on the north side of the rump, a short passage leads into the body. It climbs about 4 m to a small niche, and goes down about 5 m into the rock.' },
      { id: 'perring', path: [V(4, backY + 3, -10)], look: V(5, backY - 2, 0), say: 'Behind the head, a hole drilled in 1837 by Colonel Vyse’s team, who hoped to find chambers. The rods stuck at about 8 m. Nothing was found.' },
      { id: 'fissure', path: [V(-8, backY + 4, -14)], look: V(-8, 6, 0), say: 'A natural crack runs right through the body at the waist, up to 2 m wide at the top.' },
      { id: 'cavity', path: [V(36, 6, -22)], look: V(26, -4, 0), say: 'A seismic survey in the early 1990s reported a cavity in the rock under the front paws. No one has entered it, and what it is remains unknown.' },
    ],
    stats: [['Length', '73 m'], ['Height', '20 m']],
    sources: 'M. Lehner, <i>Archaeology of an Image: The Great Sphinx of Giza</i> (1991); M. Lehner &amp; Z. Hawass, <i>Giza and the Pyramids</i> (2017); S. Hassan, <i>The Sphinx</i> (1949). Overall size is published. The sculpted body is simplified, and the holes and passages are placed from published descriptions.',
    features: [
      { id: 'pyramid', group: 'Exterior', name: 'The Sphinx', color: 'sand', conf: 'surveyed',
        photos: () => [ph('sphinx-exterior.jpg', 'The head of the Sphinx in profile against a blue sky', 'The head in profile, wearing the striped nemes headdress, seen from the north.', 'Petar Milošević', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Great_Sphinx_(%D8%A3%D8%A8%D9%88_%D8%A7%D9%84%D9%87%D9%88%D9%84).jpg', V(14, 11, -34), V(14, 15.5, 0))],
        why: 'It is the largest statue of the ancient world carved from a single mass of rock, and it is still mostly solid stone.',
        text: 'A lion with a human head wearing the royal nemes headdress, carved out of the bedrock where builders had quarried stone. It faces due east. Most scholars think it shows King Khafre. Apart from a few small holes and passages, it is solid rock.',
        facts: [['Length', '73 m'], ['Width', '19 m'], ['Height', '20 m'], ['Faces', 'East']] },
      { id: 'head', group: 'Holes and passages', name: 'Hole in the head', color: 'shaft', conf: 'uncertain',
        why: 'Holes like this fed the old idea of hidden rooms; it may once have held a crown or headdress fitting.',
        text: 'A hole in the top of the head, closed with a metal hatch by the engineer Émile Baraize in 1926. Its depth is not published, so it is drawn short.',
        facts: [['Closed', '1926'], ['Depth', 'Not published']] },
      { id: 'perring', group: 'Holes and passages', name: 'Perring’s Hole', color: 'later', conf: 'approx',
        why: 'It is a record of 19th-century treasure hunting at Giza.',
        text: 'A hole drilled into the back just behind the head in 1837 by Howard Vyse and John Perring, searching for chambers. Their rods stuck at about 8.2 m. It was cleared again in 1978.',
        facts: [['Made', '1837'], ['Depth reached', 'c. 8.2 m']] },
      { id: 'fissure', group: 'Holes and passages', name: 'Waist fissure', color: 'rock', conf: 'approx',
        why: 'Cracks like this show the softer layers of rock the Sphinx is carved from, and why it needs constant repair.',
        text: 'A natural crack through the body at the waist. It is up to 2 m wide at the top and ends about 1 m above the floor.',
        facts: [['Width at top', 'up to 2 m'], ['Bottom', 'c. 1 m above floor']] },
      { id: 'rump', group: 'Holes and passages', name: 'Rump passage', color: 'shaft', conf: 'approx', major: true,
        why: 'It is the only real passage into the body, and it leads nowhere: a reminder that the Sphinx has no hidden halls.',
        text: 'A passage low on the north side of the rump, found open by Baraize in 1926 and re-excavated in 1980. One branch rises about 4 m to a niche; the other goes down about 5 m into the rock toward the north-east. Its age and purpose are unknown.',
        facts: [['Entrance', '1.3 m wide, narrowing to 1.07 m'], ['Up', 'c. 4 m, to a niche 1 × 1.8 m'], ['Down', 'c. 5 m deep']] },
      { id: 'keyhole', group: 'Holes and passages', name: 'Keyhole Shaft', color: 'shaft', conf: 'approx',
        why: 'A small, shallow pit cut in the floor around the Sphinx; one of several that were checked for hidden rooms.',
        text: 'A shallow shaft in the rock ledge of the enclosure, opposite the northern hind paw, cleared in 1978.',
        facts: [['Size', '1.42 × 1.06 m'], ['Depth', 'c. 2 m']] },
      { id: 'cavity', group: 'Scan discoveries', name: 'Cavity under the paws', color: 'scan', conf: 'uncertain', scan: true,
        why: 'It is one of the few hints of space under the Sphinx, and it has never been tested by digging.',
        text: 'A seismic survey of the floor around the Sphinx in the early 1990s reported a cavity in the rock beneath the front paws. Its size, shape and depth are not certain, and it may be natural. The box marks the general zone only.',
        facts: [['Found', 'Seismic survey, early 1990s'], ['Entered', 'Never'], ['Position', 'Uncertain']] },
      { id: 'stela', group: 'Inscriptions and marks', name: 'Dream Stela', color: 'mark', mark: true, conf: 'approx', major: true,
        photos: () => [ph('sphinx-stela.jpg', 'A tall granite slab with a rounded top standing between the paws', 'The Dream Stela standing against the chest, seen from beside the north paw.', 'HoremWeb', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Dream-stela.jpg', V(21, 7, -9), V(14.8, 1.8, 0))],
        why: 'It shows the Sphinx was already ancient and revered, and half buried in sand, by the New Kingdom.',
        text: 'A granite slab set up between the paws by King Thutmose IV around 1400 BC. Its text tells how, as a prince, he fell asleep in the Sphinx’s shadow and dreamed it promised him the throne if he cleared away the sand burying it. A small space behind it is now covered with a modern roof.',
        facts: [['Set up', 'c. 1400 BC, Thutmose IV'], ['Height', 'c. 3.6 m'], ['Material', 'Granite']] },
    ],
    build() {
      const M = api.ctx.mats;
      // Hole in the head, Perring's Hole behind it
      room('head', 12.2, 13.0, H - 2.0, H + 0.05, -0.4, 0.4);
      room('perring', 4.7, 5.3, backAt(5) - 8.2, backAt(5) + 0.05, -0.3, 0.3);
      // Waist fissure: a tapering crack through the body
      { const sh = new THREE.Shape();
        sh.moveTo(-1, backY); sh.lineTo(1, backY); sh.lineTo(0.1, 1); sh.lineTo(-0.1, 1); sh.closePath();
        const m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 15.5, bevelEnabled: false }), M.fissure);
        m.position.set(-8, 0, -7.75); put('fissure', m);
        M.fissure.opacity = 0.28; }   // a thin crack: faint, so it does not hide the body
      // Rump passage: in from the north side, then up to a niche and down into the rock
      const inner = rump.clone().add(V(0, 0, 2));
      passage('rump', rump.clone().add(V(0, 0, -1.2)), inner, 1.2, 1.7);
      route('rump', [inner, inner.clone().add(V(-0.6, 2.4, 0.6))], 1.0, 1.6);
      room('rump', -31.1, -30.1, 2.4, 4.2, -6.2, -5.2);                 // niche, 1 × 1.8 m
      route('rump', [inner.clone().add(V(0, -0.2, 0)), inner.clone().add(V(2.8, -5, -2.8))], 1.07, 1.4);
      // Keyhole Shaft on the enclosure floor, opposite the northern hind paw
      room('keyhole', -24.7, -23.3, -2, 0.02, -W2 - 5.5, -W2 - 4.4);
      // Reported cavity under the front paws (zone only)
      room('cavity', 20, 30, -8, -3, -5, 5);
      // Dream Stela between the paws, against the chest
      room('stela', 14.4, 15.1, 0, 3.6, -1.1, 1.1);

      person(L2 + 4, 0, -2.5, -Math.PI / 2);
      person(-30.5, 0, -W2 - 2, 0);
      person(18, 0, 0.2, -Math.PI / 2);
    },
  };
}
