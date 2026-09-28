"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import StatusDropdown from "./StatusDropdown";
import { useApp } from "./Providers";
import { profile } from "@/data/profile";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { setResumeOpen } = useApp();
  return (
    <header className="sticky top-0 z-50 border-b border-brand/10 bg-ink/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 md:px-8" aria-label="Main">
        <a href="#top" className="font-mono text-[15px] font-bold text-brand">&lt;{profile.name}/&gt;</a>
        <div className="hidden items-center gap-7 font-mono text-sm lg:flex">
          {links.map((l) => <a key={l.href} href={l.href} className="nav-link">{l.label}</a>)}
        </div>
        <div className="flex items-center gap-2">
          <StatusDropdown />
          <button onClick={() => setResumeOpen(true)} className="btn-ghost hidden !px-3 !py-1.5 font-mono !text-xs sm:inline-flex">Resume</button>
          <button onClick={() => setOpen((o) => !o)} className="rounded-md border border-brand/30 p-2 text-brand lg:hidden" aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-brand/10 bg-ink px-5 pb-4 pt-2 lg:hidden">
          <div className="flex flex-col">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-brand/10 py-3 font-mono text-sm text-fg hover:text-brand">{l.label}</a>
            ))}
            <button onClick={() => { setOpen(false); setResumeOpen(true); }} className="btn-primary mt-4">Download Resume</button>
          </div>
        </div>
      )}
    </header>
  );
}
