import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Lightbulb, Wrench } from "lucide-react";
import Section from "@/components/Section";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SnakeBackground from "@/components/SnakeBackground";
import ScrollProgress from "@/components/ScrollProgress";
import ResumeModal from "@/components/ResumeModal";
import { isPlaceholderUrl } from "@/data/projects";
import { getPortfolioData } from "@/lib/portfolio-store";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { projects, profile } = await getPortfolioData();
  const project = projects.find((item) => item.slug === params.slug);
  if (!project) {
    return { title: `Project Not Found | ${profile.name}` };
  }
  return {
    title: `${project.title} | ${profile.name}`,
    description: project.description,
  };
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { projects } = await getPortfolioData();
  const project = projects.find((item) => item.slug === params.slug);
  if (!project) notFound();

  const githubPlaceholder = project.github ? isPlaceholderUrl(project.github) : false;

  return (
    <>
      <ScrollProgress />
      <SnakeBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen">
        <Section id="project-details" title={project.title}>
          <Link
            href="/projects"
            className="mb-7 inline-flex items-center gap-2 font-mono text-sm text-muted transition hover:text-brand"
          >
            <ArrowLeft size={16} /> All projects
          </Link>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="card overflow-hidden border-brand/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={`${project.title} project showcase`}
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>
              <div className="card mt-7 p-6 sm:p-8">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                  Project overview
                </p>
                <p className="mt-3 leading-relaxed text-muted">{project.description}</p>
                {project.highlights.length > 0 && (
                  <>
                    <h2 className="mt-7 text-lg font-semibold">What I built</h2>
                    <ul className="mt-4 space-y-3">
                      {project.highlights.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex gap-3 text-sm leading-relaxed text-muted"
                        >
                          <Check size={17} className="mt-0.5 shrink-0 text-brand" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
            <aside className="space-y-5">
              <div className="card p-6">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                  Project details
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Category <span className="float-right text-fg">{project.category}</span>
                </p>
                <div className="my-4 border-t border-brand/10" />
                <h2 className="text-sm font-semibold">Technology stack</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-md border border-brand/20 bg-brand/[0.04] px-2.5 py-1.5 text-xs text-fg"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
                <div className="mt-6 grid gap-3">
                  {project.live ? (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary w-full"
                    >
                      View live project <ArrowUpRight size={16} />
                    </a>
                  ) : (
                    <span className="btn-ghost w-full cursor-default">
                      Live demo not available
                    </span>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost w-full"
                    >
                      {githubPlaceholder
                        ? "GitHub repo placeholder"
                        : project.serverGithub
                          ? "Client GitHub repository"
                          : "GitHub repository"}
                      <ArrowUpRight size={16} />
                    </a>
                  )}
                  {project.serverGithub && (
                    <a
                      href={project.serverGithub}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost w-full"
                    >
                      Server GitHub repository <ArrowUpRight size={16} />
                    </a>
                  )}
                </div>
              </div>
              {project.challenges.length > 0 && (
                <div className="card p-6">
                  <h2 className="flex items-center gap-2 text-sm font-semibold">
                    <Wrench size={16} className="text-brand" /> Challenges
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {project.challenges.map((item, idx) => (
                      <li
                        key={idx}
                        className="border-l border-brand/30 pl-3 text-sm leading-relaxed text-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {project.improvements.length > 0 && (
                <div className="card p-6">
                  <h2 className="flex items-center gap-2 text-sm font-semibold">
                    <Lightbulb size={16} className="text-brand" /> Future improvements
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {project.improvements.map((item, idx) => (
                      <li
                        key={idx}
                        className="border-l border-brand/30 pl-3 text-sm leading-relaxed text-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
          <div className="mt-8 flex flex-wrap gap-6">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 font-mono text-sm text-brand hover:underline"
            >
              <ArrowLeft size={16} /> Back to all projects
            </Link>
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-brand"
            >
              Home featured section
            </Link>
          </div>
        </Section>
      </main>
      <Footer />
      <ResumeModal />
    </>
  );
}
