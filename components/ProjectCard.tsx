"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github, Layers3, Star } from "lucide-react";
import { isPlaceholderUrl } from "@/data/projects";
import type { ProjectItem } from "@/types/portfolio";

export default function ProjectCard({
  project,
  index,
  showFeaturedBadge = false,
}: {
  project: ProjectItem;
  index: number;
  showFeaturedBadge?: boolean;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.22, delay: Math.min(index * 0.035, 0.25) }}
      className="group card flex h-full flex-col overflow-hidden border-brand/15 transition hover:-translate-y-1 hover:border-brand/50 hover:shadow-glow"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="relative block overflow-hidden bg-ink"
        aria-label={`View ${project.title} project details`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt={`${project.title} project showcase`}
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:h-56"
        />
        {showFeaturedBadge && project.featured && (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-brand/40 bg-brand px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-ink-3">
            <Star size={11} className="fill-current" /> Featured
          </span>
        )}
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/65 px-3 py-1 font-mono text-[11px] text-white backdrop-blur">
          {project.category}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/projects/${project.slug}`} className="hover:text-brand">
            <h3 className="text-lg font-semibold tracking-tight text-fg transition group-hover:text-brand">
              {project.title}
            </h3>
          </Link>
          <Layers3 size={17} className="mt-1 shrink-0 text-brand" aria-hidden="true" />
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-md border border-brand/20 bg-brand/[0.04] px-2 py-1 text-[11px] text-muted"
            >
              {t}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-1 py-1 text-[11px] text-muted">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-brand/10 pt-4">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
          >
            Project details <ArrowUpRight size={16} />
          </Link>
          <div className="flex items-center gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`GitHub repository for ${project.title}${
                  isPlaceholderUrl(project.github) ? " (placeholder link)" : ""
                }`}
                title="Open GitHub repository"
                className="text-muted transition hover:text-brand"
              >
                <Github size={17} />
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                aria-label={`Live demo for ${project.title}`}
                title="Open live project"
                className="text-muted transition hover:text-brand"
              >
                <ExternalLink size={17} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
