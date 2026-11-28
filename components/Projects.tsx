"use client";
import Link from "next/link";
import { ArrowRight, FolderKanban } from "lucide-react";
import Section from "./Section";
import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";
import { useApp } from "./Providers";
import { getHomeProjects } from "@/lib/default-data";

export default function Projects() {
  const { data } = useApp();
  const allProjects = data.projects;
  const homeProjects = getHomeProjects(allProjects, 4);

  return (
    <Section
      id="projects"
      title="Projects"
      badge={
        <span className="rounded-full border border-brand/25 px-3 py-1 font-mono text-xs text-muted">
          Showing {homeProjects.length} of {allProjects.length} projects
        </span>
      }
    >
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <Reveal className="max-w-2xl text-sm leading-relaxed text-muted">
          A curated highlight of my featured applications. Open any project for its
          technology stack, implementation highlights, challenges and future plans,
          or browse the full archive on the projects page.
        </Reveal>
        <Reveal>
          <Link
            href="/projects"
            className="btn-ghost shrink-0 font-mono !px-4 !py-2.5 !text-xs"
          >
            All {allProjects.length} projects <ArrowRight size={15} />
          </Link>
        </Reveal>
      </div>

      {homeProjects.length === 0 ? (
        <div className="card border-dashed p-10 text-center text-sm text-muted">
          No projects added yet. Add your first project from the admin dashboard.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {homeProjects.map((project, index) => (
            <ProjectCard
              key={project.id || project.slug}
              project={project}
              index={index}
              showFeaturedBadge
            />
          ))}
        </div>
      )}

      {allProjects.length > 0 && (
        <Reveal className="mt-8">
          <div className="card flex flex-col items-start justify-between gap-4 border-brand/25 bg-gradient-to-r from-brand/[0.06] via-ink-2 to-ink-2 p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3.5">
              <div className="rounded-xl border border-brand/30 bg-brand/10 p-2.5 text-brand">
                <FolderKanban size={20} />
              </div>
              <div>
                <p className="font-semibold text-fg">
                  Want to explore all {allProjects.length} projects?
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  Search by technology, filter by category, and view every project I&apos;ve built.
                </p>
              </div>
            </div>
            <Link href="/projects" className="btn-primary shrink-0 font-mono">
              View All Projects <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      )}
    </Section>
  );
}
