"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useApp } from "./Providers";

export function StatusDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-2 w-2 shrink-0 rounded-full"
      style={{ background: color, boxShadow: `0 0 8px ${color}` }}
    />
  );
}

// Read-only status label used in Hero / About / Contact
export function StatusLabel({ className = "" }: { className?: string }) {
  const { option } = useApp();
  return (
    <span className={`inline-flex max-w-full flex-wrap items-center gap-2 font-mono text-xs text-muted ${className}`}>
      <StatusDot color={option.color} />
      <span className="break-words">{option.label}</span>
    </span>
  );
}

export default function StatusDropdown() {
  const { option } = useApp();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-brand/25 px-2.5 py-1.5 font-mono text-xs text-muted transition hover:border-brand/60 hover:text-fg sm:gap-2 sm:px-3"
      >
        <StatusDot color={option.color} />
        <span className="hidden max-w-[130px] truncate md:inline">{option.label}</span>
        <span className="sr-only md:hidden">{option.label}</span>
        <ChevronDown size={13} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Current availability status"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="card fixed left-4 right-4 top-[72px] z-50 p-4 shadow-glow sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Current Status
              </span>
              <span className="truncate rounded-full border border-brand/25 bg-brand/10 px-2 py-0.5 font-mono text-[10px] text-brand">
                {option.code}
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-2.5">
              <StatusDot color={option.color} />
              <p className="text-sm font-semibold text-fg">{option.label}</p>
            </div>
            {option.note && (
              <p className="mt-2 text-xs leading-relaxed text-muted">{option.note}</p>
            )}
            <Link
              href="/#contact"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-brand/30 bg-brand/10 px-3 py-2 font-mono text-xs font-medium text-brand transition hover:bg-brand hover:text-ink-3"
            >
              Get in touch <ArrowUpRight size={14} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
