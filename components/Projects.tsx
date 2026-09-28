"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import Section from "./Section";
import Reveal from "./Reveal";
import { projects } from "@/data/projects";

export default function Projects() {
  const cats = useMemo(() => ["All", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))], []);
  const [cat, setCat] = useState("All");
  const shown = projects.filter((p) => cat === "All" || p.category === cat);

  return (
    <Section id="projects" title="Projects">
      {projects.length === 0 ? (
        <Reveal>
          <div className="card p-8 text-center sm:p-10">
            <p className="font-mono text-sm text-brand">data/projects.ts</p>
            <p className="mt-2 text-muted">Real projects are on the way. Add them to the projects data file and they will appear here automatically.</p>
          </div>
        </Reveal>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-1.5 font-mono text-xs transition ${cat === c ? "border-brand bg-brand text-ink-3" : "border-brand/30 hover:border-brand"}`}>{c}</button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((p) => (
                <motion.article key={p.title} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="card overflow-hidden transition hover:border-brand/60 hover:shadow-glow">
                  {p.image && /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.image} alt={p.title} className="h-40 w-full object-cover" />}
                  <div className="p-5">
                    <h3 className="font-semibold">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted">{p.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">{p.technologies.map((t) => <span key={t} className="rounded border border-brand/25 px-2 py-0.5 text-xs">{t}</span>)}</div>
                    <div className="mt-4 flex gap-4 text-sm">
                      {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-brand hover:underline"><Github size={15} />Code</a>}
                      {p.live && <a href={p.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-brand hover:underline"><ExternalLink size={15} />Live</a>}
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </Section>
  );
}
