"use client";
import { useEffect, useRef } from "react";

// 20 glowing "snake" lights that travel along the background grid lines (36px cells).
export default function SnakeBackground() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const layer = ref.current;
    if (!layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const made: HTMLSpanElement[] = [];
    for (let i = 0; i < 20; i++) {
      const s = document.createElement("span");
      s.className = "spark";
      s.style.top = `${Math.floor((Math.random() * 90) / 4) * 4}%`;
      s.style.left = `${Math.random() * 92}%`;
      const w = 36 * (2 + Math.floor(Math.random() * 7));
      const h = 36 * (2 + Math.floor(Math.random() * 6));
      const cw = Math.random() < 0.5;
      const pts = cw ? [[0, 0], [w, 0], [w, h], [0, h], [0, 0]] : [[0, 0], [0, h], [w, h], [w, 0], [0, 0]];
      s.animate(
        pts.map(([x, y]) => ({ transform: `translate(${x}px, ${y}px)` })),
        { duration: 9000 + Math.random() * 10000, iterations: Infinity, delay: -Math.random() * 9000, easing: "linear" }
      );
      layer.appendChild(s);
      made.push(s);
    }
    return () => made.forEach((m) => m.remove());
  }, []);
  return <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden" />;
}
