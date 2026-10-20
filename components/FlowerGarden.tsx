'use client';
import { useMemo } from 'react';

const S = {
  rose: (a: string, b: string, c: string) => { let s = ''; for (let i = 0; i < 5; i++) s += `<ellipse cy="-15" rx="14" ry="16" fill="${a}" transform="rotate(${i * 72})"/><ellipse cy="-10" rx="10" ry="12" fill="${b}" transform="rotate(${i * 72 + 36})"/>`; return s + `<circle r="7" fill="${c}"/>`; },
  tulip: (a: string, b: string) => `<path d="M-4 10C-28 6-30-26-16-46-6-32 0-12-4 10Z" fill="${b}"/><path d="M4 10C28 6 30-26 16-46 6-32 0-12 4 10Z" fill="${b}"/><path d="M0 12C-22 12-24-24 0-52 24-24 22 12 0 12Z" fill="${a}"/>`,
  daisy: (a: string, b: string) => { let s = ''; for (let i = 0; i < 16; i++) s += `<ellipse cy="-16" rx="4.8" ry="14" fill="${a}" stroke="#fad2e1" stroke-width=".5" transform="rotate(${i * 22.5})"/>`; return s + `<circle r="7.5" fill="${b}"/>`; },
  lav: (c: string) => { let s = ''; for (let y = -50; y <= 5; y += 9) { const d = 7 + (y + 50) * 0.12; s += `<ellipse cx="${-d}" cy="${y}" rx="4.5" ry="6" fill="${c}" transform="rotate(-25 ${-d} ${y})"/><ellipse cx="${d}" cy="${y + 2}" rx="4.5" ry="6" fill="${c}" transform="rotate(25 ${d} ${y + 2})"/>`; } return s; },
} as const;
type K = keyof typeof S;
const PAL: Record<K, string[][]> = {
  rose: [['#f04e82', '#ff7ba6', '#c4285b'], ['#ff6884', '#ffa2b4', '#d93b58'], ['#d82258', '#f24a7c', '#9e113b']],
  tulip: [['#ff5376', '#e02a52'], ['#fdb0c0', '#eb8aa2'], ['#ffa34d', '#e67324']],
  daisy: [['#fffdfa', '#ffc233']], lav: [['#9d7bea'], ['#bfa6f5']],
};
const LAYERS: { g: number; y: [number, number]; st: [number, number]; sc: [number, number]; w: number; t: K[] }[] = [
  { g: 580, y: [200, 290], st: [38, 54], sc: [0.9, 1.1], w: 2.5, t: ['lav', 'tulip', 'lav'] },
  { g: 600, y: [290, 380], st: [55, 78], sc: [1.2, 1.5], w: 3.5, t: ['rose', 'tulip', 'daisy', 'rose'] },
  { g: 625, y: [390, 480], st: [45, 65], sc: [1.2, 1.5], w: 4, t: ['daisy', 'rose', 'rose'] },
];
const rng = (a: number) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

function buildGarden() {
  const r = rng(1020), R = (a: number, b: number) => a + r() * (b - a);
  let n = 0, out = `<defs><linearGradient id="h1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d5e38" stop-opacity=".7"/><stop offset="1" stop-color="#193b22"/></linearGradient><linearGradient id="h2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d7d4a"/><stop offset="1" stop-color="#1f4c29"/></linearGradient><linearGradient id="h3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4e995f"/><stop offset="1" stop-color="#285a33"/></linearGradient></defs>` +
    `<path fill="url(#h1)" d="M0 450Q300 350 620 420T1200 400V650H0Z"/><path fill="url(#h2)" d="M0 490Q380 430 780 490T1200 480V650H0Z"/><path fill="url(#h3)" d="M0 550Q450 510 900 545T1200 535V650H0Z"/>`;
  for (const L of LAYERS) for (let x = 40; x <= 1160; x += R(...L.st)) {
    const type = L.t[Math.floor(r() * L.t.length)], pal = PAL[type], col = pal[Math.floor(r() * pal.length)];
    const px = x + R(-12, 12), py = R(...L.y), cx = px + (n % 2 ? 1 : -1) * R(15, 35), cy = (L.g + py) / 2, d = (0.2 + n * 0.035).toFixed(2), sw = R(1.2, 2.4), dir = n % 2 ? 1 : -1;
    const lx = 0.2025 * L.g + 0.495 * cy + 0.3025 * py, ly = lx; void ly;
    const tt = 0.55, lfx = (1 - tt) ** 2 * px + 2 * (1 - tt) * tt * cx + tt * tt * px, lfy = (1 - tt) ** 2 * L.g + 2 * (1 - tt) * tt * cy + tt * tt * py;
    out += `<g class="plant-group" style="--sd:${R(3.5, 5).toFixed(1)}s;--sl:${(n * 0.15).toFixed(2)}s;--d1:-${sw.toFixed(1)}deg;--d2:${sw.toFixed(1)}deg">` +
      `<path class="stem" pathLength="1" stroke="${type === 'lav' ? '#3d6c46' : '#4d8c59'}" stroke-width="${L.w}" d="M${px} ${L.g}Q${cx} ${cy} ${px} ${py}" style="--d:${d}s"/>` +
      (type === 'lav' ? '' : `<g transform="translate(${lfx} ${lfy}) rotate(${dir * 32})"><ellipse class="leaf-node" cx="${dir * 18}" rx="20" ry="7" fill="#69ab78" style="--d:${(+d + 0.3).toFixed(2)}s"/></g>`) +
      `<g transform="translate(${px} ${py}) scale(${R(...L.sc).toFixed(2)})"><g class="flower-head" style="--d:${(+d + 0.45).toFixed(2)}s">${(S[type] as (...a: string[]) => string)(...col)}</g></g></g>`;
    n++;
  }
  return out;
}

export default function FlowerGarden({ onBack }: { onBack: () => void }) {
  const svg = useMemo(buildGarden, []);
  return (
    <section className="garden">
      <h2 className="gtitle">Gửi em ngàn đóa hoa và những điều dịu dàng nhất 🌷</h2>
      <svg viewBox="0 0 1200 650" preserveAspectRatio="xMidYMax slice" role="img" aria-label="Khu vườn hoa hồng, tulip, cúc và oải hương" dangerouslySetInnerHTML={{ __html: svg }} />
      <p className="gmsg">Mong em luôn được yêu thương, luôn rực rỡ như những bông hoa. Chúc em một ngày 20/10 thật hạnh phúc!</p>
      <button className="btn ghost" onClick={onBack}>Quay lại những kỷ niệm</button>
    </section>
  );
}
