'use client';
import { useEffect, useRef, useState } from 'react';
const NOTES = [261.63, 329.63, 392, 523.25, 329.63, 392, 493.88, 587.33, 349.23, 440, 523.25, 659.25];
// Nhạc arpeggio tạo bằng WebAudio, chỉ phát sau khi người dùng bấm.
export default function MusicButton() {
  const [on, setOn] = useState(false);
  const ac = useRef<AudioContext | null>(null), timer = useRef(0), k = useRef(0);
  useEffect(() => () => { clearInterval(timer.current); ac.current?.close(); }, []);
  const tone = (f: number) => {
    const c = ac.current!, o = c.createOscillator(), g = c.createGain(), n = c.currentTime;
    o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(0, n); g.gain.linearRampToValueAtTime(0.07, n + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, n + 1.9);
    o.connect(g).connect(c.destination); o.start(n); o.stop(n + 2);
  };
  const toggle = () => {
    clearInterval(timer.current);
    if (!on) {
      try { ac.current = ac.current || new AudioContext(); ac.current.resume(); } catch { return; }
      tone(NOTES[k.current++ % NOTES.length]);
      timer.current = window.setInterval(() => tone(NOTES[k.current++ % NOTES.length]), 600);
    }
    setOn(!on);
  };
  return <button className="music" aria-pressed={on} aria-label={on ? 'Tắt nhạc nền' : 'Bật nhạc nền'} onClick={toggle}>{on ? '♫' : '♪'}</button>;
}
