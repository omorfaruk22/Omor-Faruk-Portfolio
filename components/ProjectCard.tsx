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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.16), ease: [0.22, 1, 0.36, 1] }}
      className="group card flex h-full min-w-0 flex-col overflow-hidden border-brand/15 transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-brand/50"
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
          loading="lazy"
          decoding="async"
          className="h-52 w-full object-cover transition-transform duration-300 will-change-transform group-hover:scale-[1.03] sm:h-56"
        />
        {showFeaturedBadge && project.featured && (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-brand/40 bg-brand px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-ink-3">
            <Star size={11} className="fill-current" /> Featured
          </span>
        )}
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/80 px-3 py-1 font-mono text-[11px] text-white">
          {project.category}
        </span>
      </Link>
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/projects/${project.slug}`} className="min-w-0 hover:text-brand">
            <h3 className="break-words text-lg font-semibold tracking-tight text-fg transition group-hover:text-brand">
              {project.title}
            </h3>
          </Link>
          <Layers3 size={17} className="mt-1 shrink-0 text-brand" aria-hidden="true" />
        </div>
        <p className="mt-2 flex-1 break-words text-sm leading-relaxed text-muted">
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
