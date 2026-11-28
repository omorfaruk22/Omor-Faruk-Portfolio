"use client";
import { motion, useReducedMotion, useScroll } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-brand will-change-transform"
      style={{ scaleX: scrollYProgress, transform: "translateZ(0)" }}
      aria-hidden="true"
    />
  );
}
