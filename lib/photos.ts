export type Photo = { id: string; src: string; alt: string; caption: string; ratio: number };
// Thêm ảnh: bỏ file vào public/photos rồi khai báo thêm một dòng ở đây (ratio = rộng / cao).
export const PHOTOS: Photo[] = [
  ['', .8], ['', 1], ['', .75], ['', 1.25],
  ['', .8], ['', 1], ['', .75], ['', 1.2],
].map(([caption, ratio], i) => ({ id: `p${i + 1}`, src: `/photos/p${i + 1}.jpg`, alt: String(caption), caption: String(caption), ratio: Number(ratio) }));

export type Slot = { x: number; y: number; z: number; w: number; h: number; rx: number; ry: number; rz: number; dur: number; del: number };
const rng = (a: number) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const PERSP = 1200;

// Vị trí ngẫu nhiên có seed cố định (ổn định giữa các lần render), tránh chồng lấp bằng lấy mẫu nhiều lần.
export function layoutSlots(W: number, H: number): Slot[] {
  const r = rng(20102026), portrait = H > W;
  const base = portrait ? Math.min(W * 0.36, H * 0.2) : Math.min(H * 0.3, W * 0.2);
  const out: Slot[] = [];
  PHOTOS.forEach((p) => {
    const s = base * (0.8 + r() * 0.5), w = s * Math.sqrt(p.ratio), h = s / Math.sqrt(p.ratio);
    const z = -260 + r() * 380, k = PERSP / (PERSP - z);
    let best = { x: 0, y: 0 }, bd = -1e9;
    for (let t = 0; t < 150; t++) {
      const hx = Math.max(10, W / 2 - (w * k) / 2 - 12), hy = Math.max(10, H / 2 - (h * k) / 2 - 70);
      const x = ((r() * 2 - 1) * hx) / k, y = ((r() * 2 - 1) * hy) / k;
      let d = 1e9;
      for (const o of out) { const ko = PERSP / (PERSP - o.z); d = Math.min(d, Math.hypot(x * k - o.x * ko, y * k - o.y * ko) - (Math.max(w, h) * k + Math.max(o.w, o.h) * ko) * 0.4); }
      if (d > bd) { bd = d; best = { x, y }; }
      if (d > 0) break;
    }
    out.push({ ...best, z, w, h, rx: (r() - 0.5) * 24, ry: (r() - 0.5) * 44, rz: (r() - 0.5) * 18, dur: 5 + r() * 3, del: -r() * 6 });
  });
  return out;
}
