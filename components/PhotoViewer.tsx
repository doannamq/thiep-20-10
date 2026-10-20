'use client';
import type { Photo } from '@/lib/photos';
// Ảnh lớn là shared element: cùng một khung chuyển từ rect của ảnh 3D -> trung tâm và ngược lại.
export default function PhotoViewer({ photo, from, open, onClose }: { photo: Photo; from: DOMRect; open: boolean; onClose: () => void }) {
  const W = innerWidth, H = innerHeight;
  const w = Math.min(W * 0.9, H * 0.66 * photo.ratio), h = w / photo.ratio;
  const to = { left: (W - w) / 2, top: (H - h) / 2 - 22, width: w, height: h };
  const r = open ? to : { left: from.left, top: from.top, width: from.width, height: from.height };
  return (
    <div className={`overlay ${open ? 'on' : ''}`} onClick={onClose} role="dialog" aria-modal="true" aria-label={photo.caption}>
      <figure className="viewer" style={r} onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.src} alt={photo.alt} draggable={false} />
      </figure>
      <p className="vcap" style={{ top: to.top + to.height + 16, opacity: open ? 1 : 0 }}>{photo.caption}</p>
      <button className="vclose" onClick={onClose} aria-label="Đóng ảnh" autoFocus>✕</button>
    </div>
  );
}
