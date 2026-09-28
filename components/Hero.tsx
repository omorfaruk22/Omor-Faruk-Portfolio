"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { profile } from "@/data/profile";
import { useApp } from "./Providers";
import { StatusDot } from "./StatusDropdown";
import CodeEditor from "./CodeEditor";

export default function Hero() {
  const { option, setResumeOpen } = useApp();
  const reduce = useReducedMotion();
  return (
    <section id="top" className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-14 pt-10 md:px-8 md:pb-24 md:pt-20 lg:grid-cols-2 lg:gap-14">
      <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="order-2 lg:order-1">
        <p className="font-mono text-sm text-brand">&gt; status: {option.code}</p>
        <p className="mt-5 text-lg text-muted">Hi, I&apos;m</p>
        <h1 className="mt-1 text-4xl font-extrabold leading-tight tracking-tight text-brand sm:text-5xl md:text-6xl">{profile.name}</h1>
        <h2 className="mt-3 font-mono text-lg text-fg sm:text-2xl">{profile.title}</h2>
        <p className="mt-6 max-w-lg leading-relaxed text-muted">{profile.tagline}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href="#projects" className="btn-primary">View My Work</a>
          <a href="#contact" className="btn-ghost">Let&apos;s Work Together</a>
          <button onClick={() => setResumeOpen(true)} className="btn-ghost">Download Resume</button>
        </div>
      </motion.div>

      <div className="order-1 flex flex-col items-center gap-6 lg:order-2">
        <div className="relative h-52 w-52 overflow-hidden rounded-full border-2 border-brand/50 shadow-glow sm:h-60 sm:w-60 md:h-64 md:w-64">
          <Image src={profile.photo} alt={`${profile.name} — profile photo`} width={640} height={640} priority className="h-full w-full object-cover" />
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-black/65 px-3 py-1.5 font-mono text-[11px] backdrop-blur">
            <StatusDot color={option.color} /> {option.label.toUpperCase()}
          </div>
        </div>
        <CodeEditor />
      </div>
    </section>
  );
}
