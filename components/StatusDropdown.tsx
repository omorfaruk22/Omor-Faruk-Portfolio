"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { availabilityOptions } from "@/data/availability";
import { useApp } from "./Providers";

export function StatusDot({ color }: { color: string }) {
  return <span className="inline-block h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />;
}

// Read-only status label used in Hero / About / Contact
export function StatusLabel({ className = "" }: { className?: string }) {
  const { option } = useApp();
  return (
    <span className={`inline-flex items-center gap-2 font-mono text-xs text-muted ${className}`}>
      <StatusDot color={option.color} />
      {option.label}
    </span>
  );
}

export default function StatusDropdown() {
  const { option, setStatus } = useApp();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={box} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-brand/25 px-3 py-1.5 font-mono text-xs text-muted transition hover:border-brand/60"
      >
        <StatusDot color={option.color} />
        <span className="hidden sm:inline">{option.label}</span>
        <span className="sm:hidden">{option.id === "available" ? "Available" : "Status"}</span>
        <ChevronDown size={14} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="card absolute right-0 z-50 mt-2 w-60 p-1.5 shadow-glow"
          >
            {availabilityOptions.map((o) => (
              <li key={o.id}>
                <button
                  role="option"
                  aria-selected={o.id === option.id}
                  onClick={() => { setStatus(o.id); setOpen(false); }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left font-mono text-xs hover:bg-brand/10"
                >
                  <StatusDot color={o.color} /> {o.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
