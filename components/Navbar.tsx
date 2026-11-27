"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, Menu, X } from "lucide-react";
import StatusDropdown from "./StatusDropdown";
import { useApp } from "./Providers";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#education", label: "Education" },
  { href: "/#experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/#services", label: "Services" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data, setResumeOpen } = useApp();
  const { profile } = data;

  return (
    <header className="sticky top-0 z-50 border-b border-brand/10 bg-ink/80 backdrop-blur">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-5 md:px-8"
        aria-label="Main"
      >
        <Link href="/" className="shrink-0 font-mono text-[15px] font-bold text-brand">
          &lt;{profile.name}/&gt;
        </Link>
        <div className="hidden items-center gap-4 font-mono text-xs lg:flex xl:gap-6 xl:text-sm">
          {links.map((l) => {
            const isProjectsActive = l.href === "/projects" && pathname.startsWith("/projects");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link whitespace-nowrap ${isProjectsActive ? "!text-brand after:!w-full" : ""}`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <StatusDropdown />
          <button
            onClick={() => setResumeOpen(true)}
            className="btn-ghost hidden whitespace-nowrap !px-3 !py-1.5 font-mono !text-xs sm:inline-flex"
          >
            Resume
          </button>
          <Link
            href="/admin"
            className="btn-primary hidden whitespace-nowrap !px-3 !py-1.5 font-mono !text-xs sm:inline-flex"
          >
            <Lock size={13} /> Admin Login
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-md border border-brand/30 p-2 text-brand lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-brand/10 bg-ink px-5 pb-4 pt-2 lg:hidden">
          <div className="flex flex-col">
            {links.map((l) => {
              const isProjectsActive = l.href === "/projects" && pathname.startsWith("/projects");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`border-b border-brand/10 py-3 font-mono text-sm transition hover:text-brand ${
                    isProjectsActive ? "text-brand" : "text-fg"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <button
                onClick={() => {
                  setOpen(false);
                  setResumeOpen(true);
                }}
                className="btn-ghost w-full font-mono"
              >
                Download Resume
              </button>
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="btn-primary w-full font-mono"
              >
                <Lock size={15} /> Admin Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
