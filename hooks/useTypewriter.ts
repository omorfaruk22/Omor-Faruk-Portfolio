"use client";
import { useEffect, useState } from "react";

// VSync-synced typewriter using requestAnimationFrame so it matches 60/90/120Hz+ display FPS cleanly.
export function useTypewriter(text: string, speed = 25, start = true) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(text.length);
      return;
    }

    setN(0);
    let rafId = 0;
    let startTime = 0;
    let lastCount = 0;

    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const nextCount = Math.min(text.length, Math.floor((now - startTime) / speed));
      if (nextCount !== lastCount) {
        lastCount = nextCount;
        setN(nextCount);
      }
      if (nextCount < text.length) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [text, speed, start]);

  return text.slice(0, n);
}
