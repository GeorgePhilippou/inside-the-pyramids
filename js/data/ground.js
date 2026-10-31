// Ground height in the Valley of the Kings, from the grid in valley-data.js (metres, relative to KV 62's entrance).
import { VALLEY, DEM_DATA } from './valley-data.js';
const bin = atob(DEM_DATA), H = new Int16Array(bin.length / 2);
for (let i = 0; i < H.length; i++) H[i] = bin.charCodeAt(2 * i) | (bin.charCodeAt(2 * i + 1) << 8);
const { x0, z0, step, nx, nz, scale } = VALLEY;
// Bilinear height at model point (x, z), measured from the entrance of KV 62; (ox, oz, oy) shift the origin
export function groundAt(x, z) {
  const fx = Math.min(nx - 1.001, Math.max(0, (x - x0) / step)), fz = Math.min(nz - 1.001, Math.max(0, (z - z0) / step));
  const i = Math.floor(fx), j = Math.floor(fz), tx = fx - i, tz = fz - j, at = (a, b) => H[b * nx + a] * scale;
  return (at(i, j) * (1 - tx) + at(i + 1, j) * tx) * (1 - tz) + (at(i, j + 1) * (1 - tx) + at(i + 1, j + 1) * tx) * tz;
}
// The ground around a tomb whose entrance is at valley point p = [x, y, z], in that tomb's own coordinates
export const groundAround = p => (x, z) => groundAt(x + p[0], z + p[2]) - p[1];
export const VALLEY_EXTENT = { x0, z0, x1: x0 + (nx - 1) * step, z1: z0 + (nz - 1) * step };
