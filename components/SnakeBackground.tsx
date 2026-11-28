"use client";
import { useEffect, useRef } from "react";

// Lightweight GPU-composited "snake" sparks traveling along the 36px background grid.
export default function SnakeBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    if (!layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    const count = isMobile ? 6 : 14;
    const made: HTMLSpanElement[] = [];
    const animations: Animation[] = [];

    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.className = "spark";
      s.style.top = `${Math.floor((Math.random() * 90) / 4) * 4}%`;
      s.style.left = `${Math.random() * 92}%`;
      const w = 36 * (2 + Math.floor(Math.random() * 6));
      const h = 36 * (2 + Math.floor(Math.random() * 5));
      const cw = Math.random() < 0.5;
      const pts = cw
        ? [[0, 0], [w, 0], [w, h], [0, h], [0, 0]]
        : [[0, 0], [0, h], [w, h], [w, 0], [0, 0]];
      const anim = s.animate(
        pts.map(([x, y]) => ({ transform: `translate3d(${x}px, ${y}px, 0)` })),
        {
          duration: 10000 + Math.random() * 10000,
          iterations: Infinity,
          delay: -Math.random() * 9000,
          easing: "linear",
        }
      );
      layer.appendChild(s);
      made.push(s);
      animations.push(anim);
    }

    const onVisibility = () => {
      animations.forEach((a) => (document.hidden ? a.pause() : a.play()));
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      animations.forEach((a) => a.cancel());
      made.forEach((m) => m.remove());
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ contain: "strict", transform: "translateZ(0)" }}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    />
  );
}
