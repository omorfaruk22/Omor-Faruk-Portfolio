"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Terminal } from "lucide-react";

export default function CinematicSplash({
  active,
  mode,
  brandName,
  subtitle,
  durationMs = 2000,
  onExitStart,
  onComplete,
}: {
  active: boolean;
  mode: "portfolio" | "admin";
  brandName: string;
  subtitle?: string;
  durationMs?: number;
  onExitStart?: () => void;
  onComplete?: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"running" | "exiting" | "done">(active ? "running" : "done");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) {
      setPhase("done");
      return;
    }

    if (reduceMotion) {
      setProgress(100);
      setPhase("done");
      onExitStart?.();
      onComplete?.();
      return;
    }

    setPhase("running");
    setProgress(0);

    const fillMs = Math.max(800, durationMs - 520);
    let rafId = 0;
    let startTime = 0;
    let exitTimer: ReturnType<typeof setTimeout> | null = null;
    let doneTimer: ReturnType<typeof setTimeout> | null = null;

    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const t = Math.min(1, (now - startTime) / fillMs);
      // Smooth cubic ease-out for native 60/90/120Hz progress feel
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);

    exitTimer = setTimeout(() => {
      setProgress(100);
      setPhase("exiting");
      onExitStart?.();
    }, fillMs);

    doneTimer = setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, durationMs);

    return () => {
      cancelAnimationFrame(rafId);
      if (exitTimer) clearTimeout(exitTimer);
      if (doneTimer) clearTimeout(doneTimer);
    };
  }, [active, durationMs, reduceMotion, onExitStart, onComplete]);

  const show = active && phase !== "done";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={`cinematic-splash-${mode}`}
          initial={{ opacity: 1 }}
          animate={
            phase === "exiting"
              ? { opacity: 0, scale: 1.03, y: -18 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          exit={{ opacity: 0, scale: 1.03, y: -18 }}
          transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          className={`fixed inset-0 z-[200] flex items-center justify-center bg-ink px-4 will-change-transform ${
            phase === "exiting" ? "pointer-events-none" : ""
          }`}
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,197,94,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,.055) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
          aria-live="polite"
          aria-label={mode === "admin" ? "Unlocking admin dashboard" : "Loading portfolio"}
        >
          {/* Running green square border frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm rounded-2xl shadow-[0_0_50px_4px_rgba(34,197,94,0.22)]"
          >
            <div className="relative overflow-hidden rounded-2xl border border-brand/25 p-[2px]">
              <div className="running-border-beam" aria-hidden="true" />
              <div
                style={{
                  background: "linear-gradient(165deg, #0d190f 0%, #070e08 100%)",
                }}
                className="relative z-10 rounded-[14px] px-6 py-7 text-center sm:px-8"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-brand/40 bg-brand/10 text-brand shadow-[0_0_24px_rgba(34,197,94,0.35)]">
                  {mode === "admin" ? <ShieldCheck size={24} /> : <Terminal size={22} />}
                </div>

                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-brand">
                  {mode === "admin" ? "Access Granted" : "Initializing"}
                </p>

                <h2 className="mt-1.5 font-mono text-xl font-extrabold tracking-tight text-fg sm:text-2xl">
                  {mode === "admin" ? "Command Center" : `<${brandName}/>`}
                </h2>

                <p className="mt-1 font-mono text-xs text-muted">
                  {subtitle ||
                    (mode === "admin"
                      ? "Booting live portfolio workspace..."
                      : "Full Stack Developer Portfolio")}
                </p>

                {/* Smooth 2-second emerald progress bar */}
                <div className="mt-6">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand/15">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-600 via-brand to-[#86EFAC]"
                      style={{
                        width: `${progress}%`,
                        boxShadow: "0 0 14px rgba(34,197,94,0.7)",
                      }}
                    />
                  </div>
                  <div className="mt-2.5 flex items-center justify-between font-mono text-[11px] text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                      {progress >= 100
                        ? mode === "admin"
                          ? "Ready"
                          : "Welcome"
                        : mode === "admin"
                          ? "Syncing modules..."
                          : "Loading experience..."}
                    </span>
                    <span className="font-semibold text-brand">{progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
