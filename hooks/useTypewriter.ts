"use client";
import { useEffect, useState } from "react";

export function useTypewriter(text: string, speed = 25, start = true) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(text.length);
      return;
    }
    setN(0);
    const id = setInterval(() => {
      setN((v) => {
        if (v >= text.length) {
          clearInterval(id);
          return v;
        }
        return v + 1;
      });
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, start]);
  return text.slice(0, n);
}
