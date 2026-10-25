'use client';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Github, ExternalLink, Layers3 } from 'lucide-react';
import Section from './Section';
import Reveal from './Reveal';
import { isPlaceholderUrl, projects } from '@/data/projects';

export default function Projects() {
  const cats = useMemo(
    () => ['All', ...Array.from(new Set(projects.map(p => p.category)))],
    [],
  );
  const [cat, setCat] = useState('All');
  const shown = projects.filter(p => cat === 'All' || p.category === cat);

  return (
    <Section
      id="projects"
      title="Featured Projects"
      badge={
        <span className="rounded-full border border-brand/25 px-3 py-1 font-mono text-xs text-muted">
          {projects.length} projects
        </span>
      }
    >
      <Reveal className="mb-7 max-w-2xl text-sm leading-relaxed text-muted">
        A selection of applications I have built. Open a project for its
        technology stack, implementation highlights, challenges and future
        plans.
      </Reveal>
      <div className="mb-7 flex flex-wrap gap-2" aria-label="Filter projects">
        {cats.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            className={`rounded-full border px-4 py-2 font-mono text-xs transition ${cat === c ? 'border-brand bg-brand text-ink-3' : 'border-brand/30 bg-ink-2 text-muted hover:border-brand hover:text-fg'}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p, index) => (
            <motion.article
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.22, delay: index * 0.035 }}
              className="group card flex h-full flex-col overflow-hidden border-brand/15 transition hover:-translate-y-1 hover:border-brand/50 hover:shadow-glow"
            >
              <a
                href={`/projects/${p.slug}`}
                className="relative block overflow-hidden"
                aria-label={`View ${p.title} project details`}
              >
                {/* Placeholder artwork lives in public/projects; replace it with your own screenshot when ready. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={`${p.title} project preview placeholder`}
                  className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/60 px-3 py-1 font-mono text-[11px] text-white backdrop-blur">
                  {p.category}
                </span>
              </a>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight text-fg">
                    {p.title}
                  </h3>
                  <Layers3
                    size={17}
                    className="mt-1 shrink-0 text-brand"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {p.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.technologies.slice(0, 4).map(t => (
                    <span
                      key={t}
                      className="rounded-md border border-brand/20 bg-brand/[0.04] px-2 py-1 text-[11px] text-muted"
                    >
                      {t}
                    </span>
                  ))}
                  {p.technologies.length > 4 && (
                    <span className="px-1 py-1 text-[11px] text-muted">
                      +{p.technologies.length - 4}
                    </span>
                  )}
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-brand/10 pt-4">
                  <a
                    href={`/projects/${p.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
                  >
                    Project details <ArrowUpRight size={16} />
                  </a>
                  <div className="flex items-center gap-3">
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`GitHub repository for ${p.title}${isPlaceholderUrl(p.github) ? ' (placeholder link)' : ''}`}
                      title={
                        isPlaceholderUrl(p.github)
                          ? 'Replace with your GitHub repository URL'
                          : 'Open GitHub repository'
                      }
                      className="text-muted transition hover:text-brand"
                    >
                      <Github size={17} />
                    </a>
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Live demo for ${p.title}${isPlaceholderUrl(p.live) ? ' (placeholder link)' : ''}`}
                      title={
                        isPlaceholderUrl(p.live)
                          ? 'Replace with your live project URL'
                          : 'Open live project'
                      }
                      className="text-muted transition hover:text-brand"
                    >
                      <ExternalLink size={17} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </Section>
  );
}
