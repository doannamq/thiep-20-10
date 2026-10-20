'use client';
import type { Phase } from './Experience';
export default function Envelope({ phase, onOpen }: { phase: Phase; onOpen: () => void }) {
  const open = phase !== 'envelope';
  const gone = phase === 'gallery' || phase === 'toGarden' || phase === 'garden';
  return (
    <section className={`screen ${gone ? 'gone' : ''}`}>
      <div className={`env ${open ? 'open' : ''}`} role="button" tabIndex={open ? -1 : 0} aria-label="Nhấn để mở phong bì"
        onClick={onOpen} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}>
        <div className="back" /><div className="flap" />
        <div className="paper"><span className="ph">♥</span><span className="ps">Dành riêng cho em</span></div>
        <div className="front" /><div className="seal">♥</div>
        <p className="to">Gửi người con gái của anh 💌</p>
      </div>
      <p className={`hint ${open ? 'out' : ''}`}>Chạm nhẹ vào tấm thiệp để mở món quà đặc biệt</p>
    </section>
  );
}
