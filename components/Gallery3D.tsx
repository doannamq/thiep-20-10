'use client';
import { memo, useEffect, useRef, useState } from 'react';
import { PHOTOS, layoutSlots, type Photo, type Slot } from '@/lib/photos';
import type { Phase } from './Experience';

type Props = { phase: Phase; dim: boolean; hiddenId?: string; onPick: (id: string, r: DOMRect) => void; reg: (id: string, el: HTMLElement | null) => void };

const Floating = memo(function Floating({ p, s, i, phase, hidden, onPick, reg }: { p: Photo; s: Slot; i: number; phase: Phase; hidden: boolean; onPick: Props['onPick']; reg: Props['reg'] }) {
  const [broken, setBroken] = useState(false);
  const shown = phase === 'launch' || phase === 'gallery';
  const gone = phase === 'toGarden' || phase === 'garden';
  // 3 trạng thái: ẩn trong phong bì -> bay ra vị trí 3D -> hội tụ vào giữa
  const t = shown ? `translate3d(${s.x}px,${s.y}px,${s.z}px) rotateX(${s.rx}deg) rotateY(${s.ry}deg) rotateZ(${s.rz}deg)`
    : gone ? `translate3d(0px,0px,-300px) rotateZ(${-s.rz * 4}deg) scale(.05)`
    : `translate3d(0px,${s.h * 0.25}px,-60px) rotateX(70deg) rotateZ(${s.rz * 3}deg) scale(.12)`;
  const delay = phase === 'launch' ? i * 140 : phase === 'toGarden' ? i * 50 : 0;
  return (
    <button ref={(el) => reg(p.id, el)} className="photo" aria-label={`Xem ảnh: ${p.caption}`}
      style={{ width: s.w, height: s.h, marginLeft: -s.w / 2, marginTop: -s.h / 2, transform: t, opacity: shown && !hidden ? 1 : 0, transitionDelay: `${delay}ms`, pointerEvents: phase === 'gallery' ? 'auto' : 'none' }}
      onClick={(e) => {
        e.stopPropagation();

        const rect = e.currentTarget.getBoundingClientRect();

        console.log('Ảnh được click:', p.id, p.src);
        console.log('Phase:', phase);
        console.log('Kích thước vùng click:', rect.width, rect.height);

        onPick(p.id, rect);
      }}>
      <span className="bob" style={{ animationDuration: `${s.dur}s`, animationDelay: `${s.del}s` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={broken ? '/photos/p1.jpg' : p.src} alt={p.alt} draggable={false} onError={() => setBroken(true)} />
      </span>
    </button>
  );
});

export default function Gallery3D({ phase, dim, hiddenId, onPick, reg }: Props) {
  const [slots, setSlots] = useState<Slot[] | null>(null); // null ở server -> không lệch hydration
  const scene = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let id = 0; const go = () => setSlots(layoutSlots(innerWidth, innerHeight));
    go(); const rs = () => { clearTimeout(id); id = window.setTimeout(go, 200); };
    addEventListener('resize', rs); return () => { removeEventListener('resize', rs); clearTimeout(id); };
  }, []);
  // Parallax: ghi thẳng vào style, không render lại React
  const move = (e: React.PointerEvent) => {
    if (dim || !scene.current) return;
    const dx = e.clientX / innerWidth - 0.5, dy = e.clientY / innerHeight - 0.5;
    scene.current.style.transform = `rotateY(${dx * 8}deg) rotateX(${-dy * 6}deg)`;
  };
  return (
    <div className={`stage ${phase === 'gallery' ? 'live' : ''} ${dim ? 'dim' : ''}`} onPointerMove={move}>
      <div className="scene" ref={scene}>
        {slots && PHOTOS.map((p, i) => <Floating key={p.id} p={p} s={slots[i]} i={i} phase={phase} hidden={hiddenId === p.id} onPick={onPick} reg={reg} />)}
      </div>
    </div>
  );
}
