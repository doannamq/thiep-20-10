'use client';
import { useEffect, useRef } from 'react';
// Một canvas duy nhất: đốm sáng luôn có; cánh hoa rơi + tim bay chỉ khi ở khu vườn.
export default function BackgroundEffects({ garden }: { garden: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const g = useRef(garden); g.current = garden;
  useEffect(() => {
    const cv = ref.current!, ctx = cv.getContext('2d')!, rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    let W = 0, H = 0, raf = 0;
    const size = () => { const d = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    size(); addEventListener('resize', size);
    const sp = Array.from({ length: 44 }, () => ({ x: Math.random(), y: Math.random(), r: rnd(1, 2.8), p: rnd(0, 6.3), s: rnd(0.5, 1.2) }));
    const pt = Array.from({ length: 22 }, () => ({ x: rnd(0, W), y: rnd(-H, 0), w: rnd(6, 12), a: rnd(0, 6.3), va: rnd(-0.02, 0.02), vy: rnd(0.5, 1), ph: rnd(0, 6.3), c: ['#ffb7ce', '#ffa2bd', '#ffd7e3', '#fff'][Math.floor(rnd(0, 4))] }));
    const hs = Array.from({ length: 10 }, () => ({ x: rnd(0, W), y: rnd(0, H), s: rnd(5, 10), vy: rnd(0.4, 0.9), ph: rnd(0, 6.3) }));
    const frame = (t: number) => {
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#fff3d1';
      for (const s of sp) { ctx.globalAlpha = rm ? 0.5 : 0.2 + 0.6 * Math.abs(Math.sin((t / 850) * s.s + s.p)); ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, 6.3); ctx.fill(); }
      if (g.current && !rm) {
        for (const p of pt) {
          p.y += p.vy; p.a += p.va; p.x += Math.sin(t / 800 + p.ph) * 0.8;
          if (p.y > H + 20) { p.y = -20; p.x = rnd(0, W); }
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.scale(1, 0.6 + 0.4 * Math.cos(t / 500 + p.ph)); ctx.globalAlpha = 0.82; ctx.fillStyle = p.c;
          ctx.beginPath(); ctx.ellipse(0, 0, p.w, p.w * 0.58, 0, 0, 6.3); ctx.fill(); ctx.restore();
        }
        for (const h of hs) {
          h.y -= h.vy; if (h.y < -20) { h.y = H + 20; h.x = rnd(0, W); }
          const s = h.s; ctx.save(); ctx.translate(h.x + Math.sin(t / 950 + h.ph) * 16, h.y); ctx.globalAlpha = 0.55 * Math.min(1, h.y / (H * 0.35)); ctx.fillStyle = '#ff99b6';
          ctx.beginPath(); ctx.moveTo(0, s * 0.3); ctx.bezierCurveTo(-s, -s * 0.5, -s * 0.6, -s * 1.2, 0, -s * 0.6); ctx.bezierCurveTo(s * 0.6, -s * 1.2, s, -s * 0.5, 0, s * 0.3); ctx.fill(); ctx.restore();
        }
      }
      ctx.globalAlpha = 1;
      if (!rm) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); };
  }, []);
  return <canvas id="fx" ref={ref} aria-hidden="true" />;
}
