"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, FolderKanban, Search, SlidersHorizontal, X } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { useApp } from "./Providers";

type SortMode = "featured" | "newest" | "alpha";

export default function AllProjectsClient() {
  const { data } = useApp();
  const projects = data.projects;

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))],
    [projects]
  );

  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortMode>("featured");

  const currentCategory = categories.includes(activeCategory) ? activeCategory : "All";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = projects.filter((p) => {
      const matchesCat = currentCategory === "All" || p.category === currentCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      const hay = [p.title, p.description, p.category, ...p.technologies].join(" ").toLowerCase();
      return hay.includes(q);
    });

    if (sortBy === "featured") {
      return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    if (sortBy === "newest") {
      return [...list].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    }
    return [...list].sort((a, b) => a.title.localeCompare(b.title));
  }, [projects, currentCategory, query, sortBy]);

  const featuredCount = projects.filter((p) => p.featured).length;
  const uniqueTechCount = useMemo(
    () => new Set(projects.flatMap((p) => p.technologies)).size,
    [projects]
  );

  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-20 pt-10 md:px-8 md:pt-14">
      <Link
        href="/"
        className="mb-7 inline-flex items-center gap-2 font-mono text-sm text-muted transition hover:text-brand"
      >
        <ArrowLeft size={16} /> Back to home
      </Link>

      <div className="flex flex-col justify-between gap-6 border-b border-brand/15 pb-8 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-ink-2/80 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-brand">
            <FolderKanban size={13} /> Project Archive
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-fg sm:text-5xl">
            All <span className="text-brand">Projects</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Every application, full-stack platform, and frontend experiment I have built —
            dynamically updated whenever new work is added.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 font-mono">
          <div className="card px-4 py-3 text-center">
            <p className="text-xl font-bold text-brand">{projects.length}</p>
            <p className="mt-0.5 text-[11px] text-muted">Total</p>
          </div>
          <div className="card px-4 py-3 text-center">
            <p className="text-xl font-bold text-fg">{featuredCount}</p>
            <p className="mt-0.5 text-[11px] text-muted">Featured</p>
          </div>
          <div className="card px-4 py-3 text-center">
            <p className="text-xl font-bold text-fg">{uniqueTechCount}</p>
            <p className="mt-0.5 text-[11px] text-muted">Technologies</p>
          </div>
        </div>
      </div>

      {/* Search, Category Filter & Sort Toolbar */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full lg:max-w-md">
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects, categories, or technologies..."
            aria-label="Search projects or technologies"
            className="w-full rounded-full border border-brand/25 bg-ink-2 py-3 pl-11 pr-11 text-sm text-fg outline-none transition placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted hover:text-fg"
            >
              <X size={16} />
            </button>
          )}
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <SlidersHorizontal size={14} className="text-brand" />
            <label htmlFor="project-sort" className="sr-only">
              Sort projects
            </label>
            <select
              id="project-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortMode)}
              className="rounded-lg border border-brand/25 bg-ink-2 px-3 py-2 font-mono text-xs text-fg outline-none transition focus:border-brand"
            >
              <option value="featured">Featured first</option>
              <option value="newest">Newest first</option>
              <option value="alpha">Alphabetical (A–Z)</option>
            </select>
          </div>
          <span className="rounded-full border border-brand/20 bg-ink-2 px-3 py-1.5 font-mono text-xs text-muted">
            {filtered.length} of {projects.length} shown
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" aria-label="Filter projects by category">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            aria-pressed={currentCategory === cat}
            className={`rounded-full border px-4 py-2 font-mono text-xs transition ${
              currentCategory === cat
                ? "border-brand bg-brand text-ink-3 font-semibold"
                : "border-brand/30 bg-ink-2 text-muted hover:border-brand hover:text-fg"
            }`}
          >
            {cat}
            {cat !== "All" && (
              <span className="ml-1.5 opacity-75">
                ({projects.filter((p) => p.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="card mt-8 border-dashed p-12 text-center">
          <p className="text-sm text-muted">
            No projects match your current filter. Try clearing the search or choosing another category.
          </p>
          {(query || currentCategory !== "All") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveCategory("All");
              }}
              className="btn-ghost mt-4 font-mono !text-xs"
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <ProjectCard
                key={project.id || project.slug}
                project={project}
                index={index}
                showFeaturedBadge
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
