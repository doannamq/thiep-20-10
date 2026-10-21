"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { PHOTOS } from "@/lib/photos";
import Envelope from "./Envelope";
import Gallery3D from "./Gallery3D";
import PhotoViewer from "./PhotoViewer";
import FlowerGarden from "./FlowerGarden";
import BackgroundEffects from "./BackgroundEffects";
import MusicButton from "./MusicButton";

// State machine: mỗi thao tác chỉ hợp lệ ở đúng trạng thái của nó.
export type Phase =
  | "envelope"
  | "opening"
  | "launch"
  | "gallery"
  | "toGarden"
  | "garden";
type Viewer = { id: string; rect: DOMRect } | null;

export default function Experience() {
  const [phase, setPhase] = useState<Phase>("envelope");
  const [viewer, setViewer] = useState<Viewer>(null);
  const [vOpen, setVOpen] = useState(false);
  const els = useRef(new Map<string, HTMLElement>());
  const timers = useRef<number[]>([]);
  const busy = useRef(false);

  const later = useCallback((fn: () => void, ms: number) => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    timers.current.push(window.setTimeout(fn, rm ? ms * 0.2 : ms));
  }, []);
  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const openEnvelope = () => {
    if (phase !== "envelope") return;
    setPhase("opening");
    later(() => setPhase("launch"), 1300);
    later(() => setPhase("gallery"), 1300 + PHOTOS.length * 140 + 1500);
  };
  const pick = (id: string, rect: DOMRect) => {
    console.log({
      clickedId: id,
      phase,
      viewerId: viewer?.id ?? null,
      busy: busy.current,
    });

    if (phase !== "gallery" || viewer || busy.current) return;

    setViewer({ id, rect });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVOpen(true));
    });
  };
  const close = useCallback(
    (then?: () => void) => {
      if (!viewer) return then?.();
      const el = els.current.get(viewer.id);
      if (el) setViewer({ id: viewer.id, rect: el.getBoundingClientRect() }); // quay về đúng vị trí hiện tại của ảnh
      setVOpen(false);
      later(() => {
        setViewer(null);
        then?.();
      }, 560);
    },
    [viewer, later],
  );
  const toGarden = () => {
    if (phase !== "gallery" || busy.current) return;
    busy.current = true;
    close(() => {
      setPhase("toGarden");
      later(() => {
        setPhase("garden");
        busy.current = false;
      }, 1800);
    });
  };
  const back = () => {
    if (phase === "garden") setPhase("gallery");
  };

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && viewer && close();
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [viewer, close]);

  const scene =
    phase === "envelope" || phase === "opening"
      ? 1
      : phase === "launch" || phase === "gallery"
        ? 2
        : 3;
  const reg = useCallback((id: string, el: HTMLElement | null) => {
    el ? els.current.set(id, el) : els.current.delete(id);
  }, []);

  return (
    <div data-scene={scene}>
      <div className="bg b1" />
      <div className="bg b2" />
      <div className="bg b3" />
      <BackgroundEffects garden={scene === 3} />
      <MusicButton />
      <Envelope phase={phase} onOpen={openEnvelope} />
      {phase !== "envelope" && (
        <Gallery3D
          phase={phase}
          dim={!!viewer}
          hiddenId={viewer?.id}
          onPick={pick}
          reg={reg}
        />
      )}
      <div className={`chrome ${phase === "gallery" && !viewer ? "on" : ""}`}>
        <p className="gh">Những kỷ niệm nhỏ, dành riêng cho em ❤️</p>
        <p className="gs">Chạm vào một bức ảnh để khám phá nhé!</p>
        <button
          className="btn"
          onClick={toGarden}
          tabIndex={phase === "gallery" ? 0 : -1}
        >
          Đi đến vườn hoa 🌸
        </button>
      </div>
      {viewer && (
        <PhotoViewer
          photo={PHOTOS.find((p) => p.id === viewer.id)!}
          from={viewer.rect}
          open={vOpen}
          onClose={() => close()}
        />
      )}
      {phase === "garden" && <FlowerGarden onBack={back} />}
    </div>
  );
}
