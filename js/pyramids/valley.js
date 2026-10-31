// The Valley of the Kings, Thebes (c. 1500–1070 BC): every tomb in the Theban Mapping Project survey.
// Model units are metres from the entrance of KV 62: +x east, +y up, +z south.
// Each tomb is built from its surveyed rooms and corridors (sizes and relative bearings are the survey's).
// Where side rooms sit along a wall, and how steeply each corridor descends, are not published, so the
// layout of each tomb is schematic: side rooms are spaced evenly along their parent, and slopes follow the
// type of passage.
import { VALLEY, TOMBS } from '../data/valley-data.js';
import { groundAt, VALLEY_EXTENT } from '../data/ground.js';

// Owner, dynasty and reign for each tomb (reigns after I. Shaw, The Oxford History of Ancient Egypt, 2000)
const OWNERS = {
  1: ['Ramesses VII', 20, 'c. 1136–1129 BC'], 2: ['Ramesses IV', 20, 'c. 1153–1147 BC'], 3: ['A son of Ramesses III', 20], 4: ['Ramesses XI', 20, 'c. 1099–1069 BC'],
  5: ['Sons of Ramesses II', 19], 6: ['Ramesses IX', 20, 'c. 1126–1108 BC'], 7: ['Ramesses II', 19, 'c. 1279–1213 BC'], 8: ['Merenptah', 19, 'c. 1213–1203 BC'],
  9: ['Ramesses V and Ramesses VI', 20, 'c. 1147–1136 BC'], 10: ['Amenmesse', 19, 'c. 1203–1200 BC'], 11: ['Ramesses III', 20, 'c. 1184–1153 BC'], 12: ['Unknown'],
  13: ['Bay, chancellor', 19], 14: ['Tausert and Setnakht', 19, 'c. 1188–1184 BC'], 15: ['Seti II', 19, 'c. 1200–1194 BC'], 16: ['Ramesses I', 19, 'c. 1295–1294 BC'],
  17: ['Seti I', 19, 'c. 1294–1279 BC'], 18: ['Ramesses X', 20, 'c. 1108–1099 BC'], 19: ['Mentuherkhepeshef, a prince', 20], 20: ['Thutmose I and Hatshepsut', 18, 'c. 1504–1458 BC'],
  21: ['Unknown', 18], 22: ['Amenhotep III', 18, 'c. 1390–1352 BC'], 23: ['Ay', 18, 'c. 1327–1323 BC'], 24: ['Unknown', 18], 25: ['Unknown', 18],
  26: ['Unknown'], 27: ['Unknown', 18], 28: ['Unknown', 18], 30: ['Unknown', 18], 32: ['Tiaa, mother of Thutmose IV', 18], 34: ['Thutmose III', 18, 'c. 1479–1425 BC'],
  35: ['Amenhotep II', 18, 'c. 1427–1400 BC'], 36: ['Maiherpri, a noble', 18], 37: ['Unknown', 18], 38: ['Thutmose I', 18, 'c. 1504–1492 BC'], 39: ['Amenhotep I (?)', 18, 'c. 1525–1504 BC'],
  42: ['Hatshepsut-Meryetre, queen', 18], 43: ['Thutmose IV', 18, 'c. 1400–1390 BC'], 46: ['Yuya and Thuyu, parents of Queen Tiye', 18], 47: ['Siptah', 19, 'c. 1194–1188 BC'],
  49: ['Unknown', 18], 54: ['Tutankhamun’s embalming cache', 18], 55: ['Amarna royal burial (Tiye or Akhenaten?)', 18], 56: ['“The Gold Tomb”', 19],
  57: ['Horemheb', 18, 'c. 1323–1295 BC'], 60: ['Sitre In, a royal nurse', 18], 61: ['Unknown'], 62: ['Tutankhamun', 18, 'c. 1336–1327 BC'], A: ['Unknown'],
};
// A line on the tombs that stand out
const NOTES = {
  5: 'The largest tomb in Egypt, with well over 120 rooms, made for the many sons of Ramesses II. Most of it was only explored from 1995.',
  7: 'The tomb of Egypt’s most famous king, badly damaged by floods over the centuries.',
  9: 'Begun for Ramesses V and finished for Ramesses VI. Its ceilings carry the Book of the Day and the Book of the Night, with the sky goddess Nut stretched across them. Its builders’ debris hid the entrance to Tutankhamun’s tomb below.',
  11: 'Known as “Bruce’s tomb” after its 18th-century visitor; famous for its paintings of harpists.',
  14: 'Begun for Queen Tausert and taken over by Setnakht, who enlarged it into one of the longest tombs in the valley.',
  16: 'A short, hurried tomb: Ramesses I reigned for less than two years.',
  17: 'The longest and most completely decorated tomb in the valley.',
  20: 'Probably the earliest tomb in the valley; its corridor curls deep into the rock for over 200 m.',
  22: 'In the West Valley. The tomb of Tutankhamun’s grandfather, with paintings of the Amduat.',
  23: 'In the West Valley. Ay was Tutankhamun’s successor; his tomb shows hunting scenes rare in royal tombs.',
  34: 'Cut high in a cleft of the cliff and reached by a steep stair. Its oval burial chamber is painted like an unrolled papyrus of the Amduat.',
  35: 'Found in 1898 with a cache of royal mummies hidden here by priests around 1000 BC.',
  43: 'Found by Howard Carter in 1903. Graffiti inside record its restoration after robbery under Horemheb.',
  46: 'Found almost intact in 1905, with furniture and a chariot; the richest private burial in the valley before Tutankhamun.',
  55: 'A small, damaged tomb with burial equipment from the Amarna period; whose body it held is still debated.',
  57: 'The first tomb with the Book of Gates carved in relief; left unfinished at the king’s death.',
  62: 'Small, and found nearly intact in 1922. It has its own detailed model.',
};
const DYN = { 18: '18th Dynasty', 19: '19th Dynasty', 20: '20th Dynasty' };

export default function valley(api) {
  const { THREE, V, D, COL, put, person, frame } = api;
  const FIX = VALLEY.bearingFix;                     // survey bearings are 27.5° off true north
  const H0 = 2.4, SLOPE = { Entryway: 18, Corridor: 6, Stairwell: 25, Descent: 22 };   // default height; slopes in degrees (schematic)

  // ---------- Lay out one tomb from its survey record ----------
  const norm = id => String(id).replace(/^0+(?=\w)/, '').toLowerCase();
  const dirOf = b => V(Math.sin(b * D), 0, -Math.cos(b * D));                 // bearing -> horizontal direction
  const turn = (d, deg) => d.clone().applyAxisAngle(V(0, 1, 0), -deg * D);     // positive = clockwise (to the right)
  function layout(t) {
    const pos = V(...t.pos), units = new Map(), order = [];
    const key = (type, id) => (type === 'Descent' ? norm(id) + '/descent' : norm(id));
    for (const [type, id, H, W, L, orient, pillars, deco] of t.els) {
      const k = key(type, id);
      if (!units.has(k)) { units.set(k, { k, id: norm(id), gate: null, room: null }); order.push(k); }
      const u = units.get(k), el = { type, H, W, L, orient, pillars, deco };
      if (type === 'Gate' && !u.room) u.gate = el; else if (type === 'Gate') u.gate ??= el; else u.room = el;
    }
    const parse = o => {
      if (!o) return null;
      let m = o.match(/^([\d.]+)°\s*$/);
      if (m) return { abs: +m[1] + FIX };
      m = o.match(/^(-?[\d.]+)°\s*(left|right)?\s*from\s+(.+)$/i);
      if (!m) return null;
      const side = (m[2] || '').toLowerCase(), ang = +m[1] * (side === 'left' ? -1 : 1);
      return { ang, side, parent: norm(m[3].trim().split(/\s+/).pop()) };
    };
    const placed = new Map(), boxes = [];
    const sideCount = {}, sideSeen = {};
    for (const k of order) { const u = units.get(k), o = parse(u.room?.orient ?? u.gate?.orient); u.o = o;
      if (o?.parent && Math.abs(Math.abs(o.ang) - 90) < 30) { const s = o.parent + (o.ang < 0 ? 'L' : 'R'); sideCount[s] = (sideCount[s] ?? 0) + 1; } }
    let last = null, guard = 0, lowest = 0;
    const pending = [...order];
    while (pending.length && guard++ < 2000) {
      const k = pending.shift(), u = units.get(k), o = u.o;
      let P = o?.parent ? placed.get(o.parent) : last;
      if (o?.parent && !P) { if (pending.length && guard < 1000) { pending.push(k); continue; } P = last; }
      const r = u.room ?? { type: u.gate?.type ?? 'Gate', H: u.gate?.H, W: u.gate?.W, L: u.gate?.L };
      const W = r.W || u.gate?.W || 2, L = r.L || (r.type === 'Gate' ? 1 : 3), H = r.H || (r.type === 'Entryway' ? null : H0);
      let start, dir;
      if (!P) { start = pos.clone(); dir = dirOf(o?.abs ?? 0); }
      else {
        const a = o?.ang ?? 0;
        if (r.type === 'Descent') {
          // a stair down through the floor along the left side of its room, ending at the room's far wall
          dir = P.dir.clone(); const left = V(dir.z, 0, -dir.x);
          start = P.start.clone().addScaledVector(dir, Math.max(0, P.L - L)).addScaledVector(left, Math.max(0, P.W / 2 - W / 2));
        } else if (Math.abs(Math.abs(a) - 90) < 30) {
          const s = o.parent + (a < 0 ? 'L' : 'R'), n = sideCount[s] ?? 1, i = sideSeen[s] = (sideSeen[s] ?? -1) + 1;
          dir = turn(P.dir, a < 0 ? -90 : 90);
          start = P.start.clone().addScaledVector(P.dir, P.L * (i + 0.5) / n).addScaledVector(dir, P.W / 2);
          start.y = P.start.y + (P.end.y - P.start.y) * (i + 0.5) / n;
        } else if (Math.abs(Math.abs(a) - 180) < 30) {
          const left = V(P.dir.z, 0, -P.dir.x);
          dir = P.dir.clone().negate();
          start = P.start.clone().addScaledVector(left, (a < 0 || o.side === 'left' ? 1 : -1) * (P.W / 2 + W / 2 + 0.6));
        } else {
          // straight on (or a slight bend): from the far end of the parent, or from the foot of its descent
          dir = turn(P.dir, a);
          const desc = placed.get(o?.parent + '/descent') ?? (P.descentOf ? null : placed.get(P.id + '/descent'));
          start = (r.type !== 'Side chamber' && desc && desc !== P) ? desc.end.clone() : P.end.clone();
        }
      }
      const gate = u.gate && u.room ? (u.gate.L || 0.8) : 0;
      const slope = (SLOPE[r.type] ?? 0) * D;
      const roomStart = start.clone().addScaledVector(dir, gate);
      const end = roomStart.clone().addScaledVector(dir, L); end.y -= Math.tan(slope) * L;
      if (gate) boxes.push({ a: start, b: roomStart, w: u.gate.W || W * 0.6, h: u.gate.H || Math.min(H ?? H0, 2.2) });
      boxes.push({ a: roomStart, b: end, w: W, h: H ?? 0.3, open: !H });
      const p = { id: u.id, start: roomStart, end, dir, L, W, descentOf: r.type === 'Descent' };
      placed.set(k, p); if (r.type !== 'Descent' && r.type !== 'Side chamber' && Math.abs(o?.ang ?? 0) < 30) last = p;
      lowest = Math.min(lowest, end.y);
    }
    return { boxes, lowest };
  }

  // ---------- Every tomb with a known position ----------
  const located = TOMBS.filter(t => t.pos);
  const plans = new Map(located.map(t => [t, layout(t)]));
  const lowest = Math.min(...[...plans.values()].map(p => p.lowest)) - 2;
  const east = located.filter(t => t.pos[0] > -400);
  const cx = east.reduce((s, t) => s + t.pos[0], 0) / east.length, cz = east.reduce((s, t) => s + t.pos[2], 0) / east.length;
  const ext = VALLEY_EXTENT;
  const fid = t => 'kv' + String(t.kv).toLowerCase();
  const kvName = t => typeof t.kv === 'number' ? `KV ${t.kv}` : `KV ${t.kv}`;
  const features = [
    { id: 'pyramid', group: 'The valley', name: 'The Valley of the Kings', color: 'sand', conf: 'surveyed',
      why: 'For nearly 500 years the kings of the New Kingdom were buried here instead of in pyramids, in tombs hidden in the rock.',
      text: `A desert valley on the west bank of the Nile at Thebes (modern Luxor), under a pyramid-shaped peak, el-Qurn. It holds over 60 tombs, from great royal tombs to small pits. This model shows the ${located.length} with a surveyed position, each built from its measured rooms. ${TOMBS.length - located.length} small pits have no published position and are not shown. Room sizes come from the survey; where side rooms sit along a wall and how steeply corridors slope are not published, so each tomb\u2019s layout is schematic. The ground comes from satellite elevation data and is approximate.`,
      facts: [['Tombs surveyed', String(TOMBS.length)], ['Shown', String(located.length)], ['In use', 'c. 1500–1070 BC'], ['Dynasties', '18th to 20th']] },
  ];
  for (const t of located) {
    const [owner, dyn, reign] = OWNERS[t.kv] ?? [t.title];
    const rooms = new Set(t.els.filter(e => e[0] !== 'Gate').map(e => e[1])).size, deco = t.els.some(e => e[7]);
    const b0 = t.els.find(e => e[0] === 'Entryway')?.[5]?.match(/^([\d.]+)°/);
    const bearing = b0 ? Math.round((+b0[1] + FIX + 360) % 360) : null;
    const isKing = t.owner === 'King';
    features.push({
      id: fid(t), group: dyn ? DYN[dyn] : 'Owner unknown', name: `${kvName(t)}: ${owner}`, color: deco ? 'paint' : 'rock', conf: 'approx', major: isKing || [5, 46, 55].includes(t.kv),
      link: t.kv === 62 ? 'tut' : t.kv === 17 ? 'seti' : null,
      why: NOTES[t.kv],
      text: `${owner}${dyn ? `, ${DYN[dyn]}` : ''}${reign ? ` (${reign})` : ''}. ${t.len ? `${t.len} m long` : 'Length not published'}, with ${rooms} room${rooms === 1 ? '' : 's'} and corridor${rooms === 1 ? '' : 's'}${deco ? ', partly decorated' : ', undecorated'}.`,
      facts: [['Length', t.len ? `${t.len} m` : '—'], ['Floor area', t.area ? `${t.area} m²` : '—'], ['Rooms and corridors', String(rooms)], ['Entrance', t.entrance ?? '—'], ['Bearing', bearing != null ? `${bearing}° (true)` : '—'], ['Entrance height', t.elev ? `${t.elev} m above sea level` : '—'], ...(t.disc ? [['Recorded by', t.disc.replace(' | ', ', ')]] : []), ['Layout', 'Schematic (see the valley)']],
    });
  }

  return {
    id: 'valley', kind: 'valley', king: 'New Kingdom kings', reign: [1539, 1075], year: 1300, lat: VALLEY.lat0, lon: VALLEY.lon0,
    short: 'Valley of the Kings', site: 'Valley of the Kings', thumb: 'photos/seti-hall.jpg', date: 'c. 1500–1070 BC', title: 'The Valley of the Kings', collection: true,
    profile: [[-60, 0], [-24, 18], [-8, 26], [0, 34], [10, 24], [30, 14], [60, 0]],   // icon: the peak of el-Qurn above the valley
    rings: [[300, 0], [300, 0.01]], lowest, start: 'kv62', groundY: Math.min(-60, lowest - 5),
    terrain: { size: [ext.x1 - ext.x0, ext.z1 - ext.z0], center: [(ext.x0 + ext.x1) / 2, (ext.z0 + ext.z1) / 2], step: VALLEY.step, h: groundAt, dem: true },
    overview: { t: [cx, -10, cz], p: [cx + 230, 260, cz + 380] },
    stats: [['Tombs shown', String(located.length)], ['In use', 'c. 1500–1070 BC']],
    sources: 'Theban Mapping Project survey of the Valley of the Kings (tomb positions, entrance heights, room sizes and bearings); ground heights from AWS Terrain Tiles (SRTM); reigns after I. Shaw (ed.), <i>The Oxford History of Ancient Egypt</i> (2000). The survey grid is turned 27.5° to true north here, as fitted to the elevation data and published coordinates. Tomb layouts are schematic.',
    features,
    build() {
      const M = api.ctx.mats;
      for (const t of located) {
        const geos = [];
        for (const { a, b, w, h, open } of plans.get(t).boxes) {
          const f = frame(a, b), g = new THREE.BoxGeometry(Math.max(0.3, w), h, Math.max(0.2, f.len));
          const c = a.clone().addScaledVector(f.dir, f.len / 2).addScaledVector(f.n, open ? -h / 2 : h / 2);
          g.applyMatrix4(new THREE.Matrix4().compose(c, f.q, V(1, 1, 1)));
          geos.push(g.toNonIndexed());
        }
        if (!geos.length) continue;
        put(fid(t), new THREE.Mesh(api.mergeGeometries(geos), M[fid(t)]));
      }
      person(1.5, 0, 2.5, -Math.PI / 2);
    },
  };
}
