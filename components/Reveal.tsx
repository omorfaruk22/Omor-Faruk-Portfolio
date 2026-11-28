"use client";
import { motion, useReducedMotion } from "framer-motion";

export type RevealDirection = "bottom" | "top" | "left" | "right";

const DEFAULT_DISTANCES: Record<RevealDirection, number> = {
  bottom: 34,
  top: 26,
  left: 42,
  right: 42,
};

function getOffset(from: RevealDirection, distance?: number): { x: number; y: number } {
  const d = distance ?? DEFAULT_DISTANCES[from];
  switch (from) {
    case "top":
      return { x: 0, y: -d };
    case "left":
      return { x: -d, y: 0 };
    case "right":
      return { x: d, y: 0 };
    case "bottom":
    default:
      return { x: 0, y: d };
  }
}

export default function Reveal({
  children,
  className,
  delay = 0,
  from = "bottom",
  distance,
  duration = 0.65,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: RevealDirection;
  distance?: number;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const offset = getOffset(from, distance);

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration,
        delay: Math.min(delay, 0.4),
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
