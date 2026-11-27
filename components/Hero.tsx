"use client";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Code2, Mail } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useApp } from "./Providers";
import { StatusDot } from "./StatusDropdown";
import CodeEditor from "./CodeEditor";

export default function Hero() {
  const { data, option, setResumeOpen } = useApp();
  const { profile } = data;
  const reduce = useReducedMotion();

  const nameParts = profile.name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? profile.name;
  const restName = nameParts.slice(1).join(" ");

  return (
    <section
      id="top"
      className="relative isolate mx-auto grid w-full max-w-6xl items-center gap-10 overflow-x-clip px-4 pb-14 pt-8 sm:px-5 md:gap-12 md:px-8 md:pb-24 md:pt-16 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-10 -z-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl sm:h-96 sm:w-96"
      />
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
        className="order-2 min-w-0 lg:order-1"
      >
        <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-brand/25 bg-ink-2/80 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          <Code2 size={14} className="shrink-0 text-brand" />
          <span className="truncate">{profile.heroBadge || "Full stack developer"}</span>
        </div>
        <p className="mt-6 text-base text-muted sm:mt-7 sm:text-lg">Hi, I&apos;m</p>
        <h1 className="mt-1 break-words text-4xl font-extrabold leading-[1.05] tracking-tight text-fg sm:text-6xl md:text-7xl">
          {firstName}{" "}
          {restName && <span className="text-brand">{restName}</span>}
        </h1>
        <h2 className="mt-4 max-w-xl break-words font-mono text-base leading-relaxed text-fg sm:mt-5 sm:text-2xl">
          {profile.title}
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:mt-5 sm:text-base">
          {profile.tagline}
        </p>
        <div className="mt-5 inline-flex max-w-full flex-wrap items-center gap-2 rounded-lg border border-brand/20 bg-ink-2/80 px-3 py-2 font-mono text-xs text-muted sm:mt-6">
          <StatusDot color={option.color} />
          <span className="break-words">{option.label}</span>
          <span className="text-brand">/</span>
          <span className="break-all">{option.code}</span>
        </div>
        <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
          <a href="#projects" className="btn-primary">
            Explore projects <ArrowDownRight size={17} />
          </a>
          <a href="#contact" className="btn-ghost">
            <Mail size={16} /> Contact me
          </a>
          <button
            onClick={() => setResumeOpen(true)}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-3 text-sm font-semibold text-muted transition hover:text-brand"
          >
            View resume <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 border-t border-brand/15 pt-5 font-mono text-xs text-muted sm:mt-10">
          <span>
            <strong className="text-fg">{profile.location}</strong> · based
          </span>
          <span>
            <Link href="/projects" className="transition hover:text-brand">
              <strong className="text-fg">{data.projects.length} projects</strong> · built
            </Link>
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="order-1 mx-auto w-full min-w-0 max-w-xl lg:order-2"
      >
        <div className="relative w-full min-w-0 overflow-hidden rounded-[1.5rem] border border-brand/20 bg-gradient-to-br from-brand/10 via-ink-2 to-ink p-3.5 shadow-glow sm:rounded-[2rem] sm:p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-3 top-1/4 h-20 w-20 rounded-full bg-brand/20 blur-2xl"
          />
          <div className="relative flex items-center justify-between gap-3 rounded-2xl border border-brand/15 bg-ink/80 p-3.5 sm:p-5">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-brand/35 shadow-glow sm:h-20 sm:w-20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.photo}
                  alt={`${profile.name} — profile photo`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[11px] text-muted sm:text-xs">CURRENTLY</p>
                <p className="mt-0.5 break-words text-sm font-semibold text-fg sm:mt-1 sm:text-base">
                  {profile.status}
                </p>
                <p className="mt-0.5 break-words text-xs text-muted sm:mt-1">
                  {profile.statusSubtitle || "Learning by building real projects"}
                </p>
              </div>
            </div>
            <span className="hidden shrink-0 rounded-full border border-brand/20 bg-brand/10 px-3 py-1 font-mono text-[10px] text-brand sm:inline-flex">
              {profile.portfolioVersion || "PORTFOLIO v1.0"}
            </span>
          </div>
          <div className="relative mt-3.5 min-w-0 overflow-hidden rounded-2xl border border-brand/15 bg-ink/70 p-2 sm:mt-4 sm:p-3">
            <CodeEditor />
          </div>
          <div className="relative mt-3.5 grid grid-cols-3 gap-2 text-center font-mono text-[10px] text-muted sm:mt-4 sm:text-xs">
            {[
              ["01", "Discover"],
              ["02", "Build"],
              ["03", "Improve"],
            ].map(([number, label]) => (
              <div key={number} className="min-w-0 truncate rounded-xl border border-brand/15 bg-ink/70 px-1.5 py-2.5 sm:px-2 sm:py-3">
                <span className="text-brand">{number}</span>
                <span className="mx-0.5 text-brand/50 sm:mx-1">/</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
