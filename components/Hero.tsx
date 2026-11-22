"use client";
import Image from "next/image";
import { ArrowDownRight, ArrowUpRight, Code2, Mail } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { profile } from "@/data/profile";
import { useApp } from "./Providers";
import { StatusDot } from "./StatusDropdown";
import CodeEditor from "./CodeEditor";

export default function Hero() {
  const { option, setResumeOpen } = useApp();
  const reduce = useReducedMotion();

  return (
    <section id="top" className="relative isolate mx-auto grid w-full max-w-6xl items-center gap-12 overflow-hidden px-5 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
      <div aria-hidden="true" className="pointer-events-none absolute -right-28 top-10 -z-10 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
        className="order-2 lg:order-1"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-ink-2/80 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          <Code2 size={14} className="text-brand" /> Full stack developer
        </div>
        <p className="mt-7 text-lg text-muted">Hi, I&apos;m</p>
        <h1 className="mt-1 text-5xl font-extrabold leading-[1.02] tracking-tight text-fg sm:text-6xl md:text-7xl">
          {profile.name.split(" ")[0]} <span className="text-brand">{profile.name.split(" ").slice(1).join(" ")}</span>
        </h1>
        <h2 className="mt-5 max-w-xl font-mono text-lg leading-relaxed text-fg sm:text-2xl">{profile.title}</h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted">{profile.tagline}</p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-brand/20 bg-ink-2/80 px-3 py-2 font-mono text-xs text-muted">
          <StatusDot color={option.color} /> <span>{option.label}</span><span className="text-brand">/</span><span>{option.code}</span>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#projects" className="btn-primary">Explore projects <ArrowDownRight size={17} /></a>
          <a href="#contact" className="btn-ghost"><Mail size={16} /> Contact me</a>
          <button onClick={() => setResumeOpen(true)} className="rounded-lg px-3 py-3 text-sm font-semibold text-muted transition hover:text-brand">View resume <ArrowUpRight size={16} /></button>
        </div>
        <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-brand/15 pt-5 font-mono text-xs text-muted">
          <span><strong className="text-fg">{profile.location}</strong> · based</span>
          <span><strong className="text-fg">Web apps</strong> · building</span>
        </div>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="order-1 mx-auto w-full max-w-xl lg:order-2"
      >
        <div className="relative rounded-[2rem] border border-brand/20 bg-gradient-to-br from-brand/10 via-ink-2 to-ink p-4 shadow-glow sm:p-6">
          <div aria-hidden="true" className="absolute -left-3 top-1/4 h-20 w-20 rounded-full bg-brand/20 blur-2xl" />
          <div className="relative flex items-center justify-between rounded-2xl border border-brand/15 bg-ink/80 p-4 sm:p-5">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-brand/35 shadow-glow sm:h-20 sm:w-20">
                <Image src={profile.photo} alt={`${profile.name} — profile photo`} width={320} height={320} priority className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="font-mono text-xs text-muted">CURRENTLY</p>
                <p className="mt-1 font-semibold text-fg">{profile.status}</p>
                <p className="mt-1 text-xs text-muted">Learning by building real projects</p>
              </div>
            </div>
            <span className="hidden rounded-full border border-brand/20 bg-brand/10 px-3 py-1 font-mono text-[10px] text-brand sm:inline-flex">PORTFOLIO v1.0</span>
          </div>
          <div className="relative mt-4 overflow-hidden rounded-2xl border border-brand/15 bg-ink/70 p-2 sm:p-3">
            <CodeEditor />
          </div>
          <div className="relative mt-4 grid grid-cols-3 gap-2 text-center font-mono text-[10px] text-muted sm:text-xs">
            {[
              ["01", "Discover"],
              ["02", "Build"],
              ["03", "Improve"],
            ].map(([number, label]) => (
              <div key={number} className="rounded-xl border border-brand/15 bg-ink/70 px-2 py-3">
                <span className="text-brand">{number}</span><span className="mx-1 text-brand/50">/</span>{label}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
