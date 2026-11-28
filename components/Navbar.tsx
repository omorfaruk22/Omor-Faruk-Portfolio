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
    <header
      style={{ transform: "translateZ(0)" }}
      className="sticky top-0 z-50 w-full border-b border-brand/10 bg-ink/[0.97] lg:bg-ink/88 lg:backdrop-blur-md"
    >
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-3.5 sm:px-5 md:px-8"
        aria-label="Main"
      >
        <Link
          href="/"
          className="min-w-0 truncate font-mono text-sm font-bold text-brand sm:text-[15px]"
        >
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
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <StatusDropdown />
          <button
            onClick={() => setResumeOpen(true)}
            className="btn-ghost hidden whitespace-nowrap !px-3 !py-1.5 font-mono !text-xs sm:inline-flex"
          >
            Resume
          </button>
          <Link
            href="/admin"
            className="btn-primary whitespace-nowrap !px-2.5 !py-1.5 font-mono !text-[11px] sm:!px-3 sm:!text-xs"
          >
            <Lock size={12} className="shrink-0" />
            <span className="hidden sm:inline">Admin Login</span>
            <span className="sm:hidden">Admin</span>
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
        <div className="border-t border-brand/10 bg-ink/[0.98] px-4 pb-5 pt-2 lg:hidden">
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
