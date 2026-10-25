import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Lightbulb,
  Wrench,
} from 'lucide-react';
import Section from '@/components/Section';
import { isPlaceholderUrl, projects } from '@/data/projects';

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export default function ProjectDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = projects.find(item => item.slug === params.slug);
  if (!project) notFound();
  const githubPlaceholder = isPlaceholderUrl(project.github);
  const livePlaceholder = isPlaceholderUrl(project.live);
  return (
    <main className="relative z-10 min-h-screen">
      <Section id="project-details" title={project.title}>
        <Link
          href="/#projects"
          className="mb-7 inline-flex items-center gap-2 font-mono text-sm text-muted transition hover:text-brand"
        >
          <ArrowLeft size={16} /> All projects
        </Link>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="card overflow-hidden border-brand/20">
              {/* Replace this placeholder cover with a screenshot by changing image in data/projects.ts. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={`${project.title} preview placeholder`}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
            <div className="mt-7 card p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                Project overview
              </p>
              <p className="mt-3 leading-relaxed text-muted">
                {project.description}
              </p>
              <h2 className="mt-7 text-lg font-semibold">What I built</h2>
              <ul className="mt-4 space-y-3">
                {project.highlights.map(item => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-muted"
                  >
                    <Check size={17} className="mt-0.5 shrink-0 text-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <aside className="space-y-5">
            <div className="card p-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                Project details
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Category{' '}
                <span className="float-right text-fg">{project.category}</span>
              </p>
              <div className="my-4 border-t border-brand/10" />
              <h2 className="text-sm font-semibold">Technology stack</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map(technology => (
                  <span
                    key={technology}
                    className="rounded-md border border-brand/20 bg-brand/[0.04] px-2.5 py-1.5 text-xs text-fg"
                  >
                    {technology}
                  </span>
                ))}
              </div>
              <div className="mt-6 grid gap-3">
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary w-full"
                >
                  {livePlaceholder
                    ? 'Live demo placeholder'
                    : 'View live project'}
                  <ArrowUpRight size={16} />
                </a>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost w-full"
                >
                  {githubPlaceholder
                    ? 'GitHub repo placeholder'
                    : 'Client GitHub repository'}
                  <ArrowUpRight size={16} />
                </a>
              </div>
              {(livePlaceholder || githubPlaceholder) && (
                <p className="mt-3 text-xs leading-relaxed text-muted">
                  Replace the example URLs in{' '}
                  <code className="text-brand">data/projects.ts</code> with your
                  real links.
                </p>
              )}
            </div>
            <div className="card p-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <Wrench size={16} className="text-brand" /> Challenges
              </h2>
              <ul className="mt-4 space-y-3">
                {project.challenges.map(item => (
                  <li
                    key={item}
                    className="border-l border-brand/30 pl-3 text-sm leading-relaxed text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <Lightbulb size={16} className="text-brand" /> Future
                improvements
              </h2>
              <ul className="mt-4 space-y-3">
                {project.improvements.map(item => (
                  <li
                    key={item}
                    className="border-l border-brand/30 pl-3 text-sm leading-relaxed text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
        <Link
          href="/#projects"
          className="mt-8 inline-flex items-center gap-2 font-mono text-sm text-brand hover:underline"
        >
          <ArrowLeft size={16} /> Back to portfolio projects
        </Link>
      </Section>
    </main>
  );
}
