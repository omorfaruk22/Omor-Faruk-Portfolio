"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  FolderKanban,
  Loader2,
  Pencil,
  Plus,
  Save,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { getHomeProjects, slugify } from "@/lib/default-data";
import { adminFetch } from "./api";
import {
  ConfirmModal,
  MediaUploadField,
  StringListEditor,
  TagInput,
  inputCls,
  labelCls,
  textareaCls,
} from "./ui";
import type { PortfolioData, ProjectItem } from "@/types/portfolio";

const CATEGORY_PRESETS = ["Full Stack", "Frontend", "Backend", "Mobile App", "AI / ML", "SaaS"];

const IMAGE_PRESETS = [
  { label: "SalonBook", url: "/projects/salonbook.png" },
  { label: "StudioSpace", url: "/projects/studiospace.png" },
  { label: "BazarDor", url: "/projects/bazardor.png" },
  { label: "FitLog", url: "/projects/fitlog.png" },
  { label: "Library MS", url: "/projects/library-management.png" },
  { label: "Movie Explorer", url: "/projects/movie-explorer.png" },
];

type ProjectDraft = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  technologies: string[];
  github: string;
  serverGithub: string;
  live: string;
  category: string;
  featured: boolean;
  highlights: string[];
  challenges: string[];
  improvements: string[];
};

const emptyDraft = (): ProjectDraft => ({
  title: "",
  slug: "",
  description: "",
  image: "/projects/bazardor.png",
  technologies: [],
  github: "",
  serverGithub: "",
  live: "",
  category: "Full Stack",
  featured: false,
  highlights: [],
  challenges: [],
  improvements: [],
});

export default function ProjectsTab({
  data,
  onDataChange,
  onNotify,
  initialOpenNew = false,
  onConsumeOpenNew,
}: {
  data: PortfolioData;
  onDataChange: (next: PortfolioData) => void;
  onNotify: (type: "success" | "error" | "info", text: string) => void;
  initialOpenNew?: boolean;
  onConsumeOpenNew?: () => void;
}) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<ProjectDraft | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectItem | null>(null);

  useEffect(() => {
    if (initialOpenNew) {
      setEditing(emptyDraft());
      setSlugTouched(false);
      onConsumeOpenNew?.();
    }
  }, [initialOpenNew, onConsumeOpenNew]);

  const homeIds = useMemo(
    () => new Set(getHomeProjects(data.projects, 4).map((p) => p.id)),
    [data.projects]
  );

  const featuredCount = data.projects.filter((p) => p.featured).length;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data.projects;
    return data.projects.filter((p) =>
      [p.title, p.category, p.slug, ...p.technologies].join(" ").toLowerCase().includes(q)
    );
  }, [data.projects, search]);

  const openEdit = (p: ProjectItem) => {
    setEditing({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      image: p.image,
      technologies: [...p.technologies],
      github: p.github,
      serverGithub: p.serverGithub ?? "",
      live: p.live,
      category: p.category,
      featured: p.featured,
      highlights: [...p.highlights],
      challenges: [...p.challenges],
      improvements: [...p.improvements],
    });
    setSlugTouched(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editing.title.trim()) {
      onNotify("error", "Project title is required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...editing,
        slug: editing.slug.trim() || slugify(editing.title),
        serverGithub: editing.serverGithub.trim() || undefined,
      };
      if (editing.id) {
        const res = await adminFetch<{ project: ProjectItem; data: PortfolioData }>(
          `/api/portfolio/projects/${encodeURIComponent(editing.id)}`,
          { method: "PUT", body: JSON.stringify(payload) }
        );
        onDataChange(res.data);
        onNotify("success", `Updated "${res.project.title}".`);
      } else {
        const res = await adminFetch<{ project: ProjectItem; data: PortfolioData }>(
          "/api/portfolio/projects",
          { method: "POST", body: JSON.stringify(payload) }
        );
        onDataChange(res.data);
        onNotify(
          "success",
          `Added "${res.project.title}" — live now on /projects and /projects/${res.project.slug}!`
        );
      }
      setEditing(null);
    } catch (err) {
      onNotify("error", err instanceof Error ? err.message : "Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  const toggleFeatured = async (project: ProjectItem) => {
    setBusyId(project.id);
    try {
      const res = await adminFetch<{ project: ProjectItem; data: PortfolioData }>(
        `/api/portfolio/projects/${encodeURIComponent(project.id)}`,
        { method: "PUT", body: JSON.stringify({ featured: !project.featured }) }
      );
      onDataChange(res.data);
      onNotify(
        "success",
        res.project.featured
          ? `"${project.title}" marked as Featured for Homepage.`
          : `"${project.title}" removed from Featured.`
      );
    } catch (err) {
      onNotify("error", err instanceof Error ? err.message : "Failed to update project.");
    } finally {
      setBusyId(null);
    }
  };

  const reorder = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= data.projects.length) return;
    const next = [...data.projects];
    [next[index], next[target]] = [next[target], next[index]];
    setBusyId(data.projects[index].id);
    try {
      const updated = await adminFetch<PortfolioData>("/api/portfolio", {
        method: "PUT",
        body: JSON.stringify({ projects: next }),
      });
      onDataChange(updated);
    } catch (err) {
      onNotify("error", err instanceof Error ? err.message : "Failed to reorder projects.");
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.id);
    try {
      const res = await adminFetch<{ deletedId: string; data: PortfolioData }>(
        `/api/portfolio/projects/${encodeURIComponent(deleteTarget.id)}`,
        { method: "DELETE" }
      );
      onDataChange(res.data);
      onNotify("success", `Deleted "${deleteTarget.title}".`);
      setDeleteTarget(null);
    } catch (err) {
      onNotify("error", err instanceof Error ? err.message : "Failed to delete project.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card flex flex-col justify-between gap-4 border-brand/25 p-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-fg">Projects Manager</h2>
            <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 font-mono text-xs text-brand">
              {data.projects.length} total
            </span>
            <span className="rounded-full border border-brand/20 bg-ink px-2.5 py-0.5 font-mono text-xs text-muted">
              {featuredCount} starred · first 4 shown on Home
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Your Main Page (/) displays the top 4 featured projects. Every project you add here automatically appears on{" "}
            <Link href="/projects" target="_blank" className="text-brand hover:underline">
              /projects
            </Link>{" "}
            with its own detail page.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(emptyDraft());
            setSlugTouched(false);
          }}
          className="btn-primary shrink-0 font-mono !text-xs"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Add / Edit Project Form */}
      {editing && (
        <form
          onSubmit={handleSave}
          className="card border-brand/40 p-5 shadow-glow sm:p-6"
        >
          <div className="flex items-center justify-between border-b border-brand/15 pb-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-brand">
                {editing.id ? "Edit Project" : "New Project"}
              </p>
              <h3 className="mt-0.5 text-lg font-bold text-fg">
                {editing.title || "Untitled Project"}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-md border border-brand/20 p-2 text-muted hover:border-brand hover:text-fg"
              aria-label="Close editor"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelCls}>Project Title *</label>
              <input
                type="text"
                required
                value={editing.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setEditing((prev) =>
                    prev
                      ? {
                          ...prev,
                          title,
                          slug: slugTouched ? prev.slug : slugify(title),
                        }
                      : null
                  );
                }}
                placeholder="e.g. DevFlow SaaS"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>URL Slug (/projects/...)</label>
              <input
                type="text"
                value={editing.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setEditing((prev) => (prev ? { ...prev, slug: slugify(e.target.value) } : null));
                }}
                placeholder="devflow-saas"
                className={`${inputCls} font-mono text-xs`}
              />
            </div>

            <div>
              <label className={labelCls}>Category</label>
              <input
                type="text"
                value={editing.category}
                onChange={(e) =>
                  setEditing((prev) => (prev ? { ...prev, category: e.target.value } : null))
                }
                placeholder="Full Stack"
                className={inputCls}
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {CATEGORY_PRESETS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() =>
                      setEditing((prev) => (prev ? { ...prev, category: cat } : null))
                    }
                    className={`rounded-md border px-2 py-0.5 font-mono text-[11px] transition ${
                      editing.category === cat
                        ? "border-brand bg-brand/15 text-brand"
                        : "border-brand/20 bg-ink text-muted hover:text-fg"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-start pt-1 md:pt-6">
              <label className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-brand/25 bg-ink px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-fg">Feature on Homepage</p>
                  <p className="text-xs text-muted">
                    Top 4 featured projects are highlighted on the Main Page
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={editing.featured}
                  onChange={(e) =>
                    setEditing((prev) => (prev ? { ...prev, featured: e.target.checked } : null))
                  }
                  className="h-5 w-5 accent-brand"
                />
              </label>
            </div>

            <div className="md:col-span-2">
              <label className={labelCls}>Short Description *</label>
              <textarea
                required
                rows={3}
                value={editing.description}
                onChange={(e) =>
                  setEditing((prev) => (prev ? { ...prev, description: e.target.value } : null))
                }
                placeholder="Describe what the application does and who it helps..."
                className={textareaCls}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelCls}>Project Preview Image (16:9 recommended)</label>
              <MediaUploadField
                value={editing.image}
                onChange={(url) => setEditing((prev) => (prev ? { ...prev, image: url } : null))}
                presets={IMAGE_PRESETS}
                onNotify={onNotify}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelCls}>Technologies (press Enter or comma to add)</label>
              <TagInput
                values={editing.technologies}
                onChange={(technologies) =>
                  setEditing((prev) => (prev ? { ...prev, technologies } : null))
                }
                placeholder="Next.js, TypeScript, Tailwind CSS, MongoDB..."
              />
            </div>

            <div>
              <label className={labelCls}>Live Demo URL</label>
              <input
                type="url"
                value={editing.live}
                onChange={(e) =>
                  setEditing((prev) => (prev ? { ...prev, live: e.target.value } : null))
                }
                placeholder="https://my-project.vercel.app"
                className={`${inputCls} font-mono text-xs`}
              />
            </div>

            <div>
              <label className={labelCls}>GitHub Repository URL</label>
              <input
                type="url"
                value={editing.github}
                onChange={(e) =>
                  setEditing((prev) => (prev ? { ...prev, github: e.target.value } : null))
                }
                placeholder="https://github.com/omorfaruk22/project"
                className={`${inputCls} font-mono text-xs`}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelCls}>Server GitHub URL (optional)</label>
              <input
                type="url"
                value={editing.serverGithub}
                onChange={(e) =>
                  setEditing((prev) => (prev ? { ...prev, serverGithub: e.target.value } : null))
                }
                placeholder="https://github.com/omorfaruk22/project-server"
                className={`${inputCls} font-mono text-xs`}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelCls}>Highlights / What I Built</label>
              <StringListEditor
                items={editing.highlights}
                onChange={(highlights) =>
                  setEditing((prev) => (prev ? { ...prev, highlights } : null))
                }
                placeholder="Add a key feature or accomplishment..."
                addLabel="Add highlight"
              />
            </div>

            <div>
              <label className={labelCls}>Challenges</label>
              <StringListEditor
                items={editing.challenges}
                onChange={(challenges) =>
                  setEditing((prev) => (prev ? { ...prev, challenges } : null))
                }
                placeholder="Add a technical challenge..."
                addLabel="Add"
              />
            </div>

            <div>
              <label className={labelCls}>Future Improvements</label>
              <StringListEditor
                items={editing.improvements}
                onChange={(improvements) =>
                  setEditing((prev) => (prev ? { ...prev, improvements } : null))
                }
                placeholder="Add a planned improvement..."
                addLabel="Add"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-brand/15 pt-4">
            <button
              type="button"
              disabled={saving}
              onClick={() => setEditing(null)}
              className="btn-ghost !px-4 !py-2.5"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary !px-5 !py-2.5 font-mono">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {editing.id ? "Save Changes" : "Publish Project"}
            </button>
          </div>
        </form>
      )}

      {/* Search bar */}
      <label className="relative block max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects by title, category, or tech..."
          className={`${inputCls} pl-10`}
        />
      </label>

      {/* Projects List */}
      {filtered.length === 0 ? (
        <div className="card border-dashed p-10 text-center">
          <FolderKanban size={28} className="mx-auto text-muted" />
          <p className="mt-3 text-sm text-muted">No projects found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((project) => {
            const globalIndex = data.projects.findIndex((p) => p.id === project.id);
            const isOnHome = homeIds.has(project.id);
            const isBusy = busyId === project.id;

            return (
              <div
                key={project.id}
                className="card flex flex-col gap-4 border-brand/20 p-4 transition hover:border-brand/45 sm:flex-row sm:items-center"
              >
                <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg border border-brand/15 bg-ink sm:h-20 sm:w-36">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                  {isOnHome && (
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-brand px-1.5 py-0.5 font-mono text-[10px] font-bold text-ink-3">
                      HOME
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-semibold text-fg">{project.title}</h3>
                    <span className="rounded-full border border-brand/25 bg-brand/10 px-2 py-0.5 font-mono text-[10px] text-brand">
                      {project.category}
                    </span>
                    <span className="font-mono text-[11px] text-muted">
                      /projects/{project.slug}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-muted">{project.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 5).map((t) => (
                      <span
                        key={t}
                        className="rounded border border-brand/15 bg-ink px-1.5 py-0.5 font-mono text-[10px] text-muted"
                      >
                        {t}
                      </span>
                    ))}
                    {project.technologies.length > 5 && (
                      <span className="font-mono text-[10px] text-muted">
                        +{project.technologies.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:shrink-0">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => toggleFeatured(project)}
                    title={
                      project.featured
                        ? "Featured for homepage (click to unstar)"
                        : "Star to feature on homepage"
                    }
                    className={`rounded-md border p-2 transition ${
                      project.featured
                        ? "border-brand bg-brand/15 text-brand"
                        : "border-brand/20 bg-ink text-muted hover:border-brand hover:text-brand"
                    }`}
                  >
                    <Star size={15} className={project.featured ? "fill-current" : ""} />
                  </button>

                  {!search && (
                    <>
                      <button
                        type="button"
                        disabled={isBusy || globalIndex === 0}
                        onClick={() => reorder(globalIndex, -1)}
                        aria-label="Move project up"
                        className="rounded-md border border-brand/20 bg-ink p-2 text-muted transition hover:border-brand hover:text-fg disabled:opacity-30"
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        type="button"
                        disabled={isBusy || globalIndex === data.projects.length - 1}
                        onClick={() => reorder(globalIndex, 1)}
                        aria-label="Move project down"
                        className="rounded-md border border-brand/20 bg-ink p-2 text-muted transition hover:border-brand hover:text-fg disabled:opacity-30"
                      >
                        <ArrowDown size={15} />
                      </button>
                    </>
                  )}

                  <Link
                    href={`/projects/${project.slug}`}
                    target="_blank"
                    title="View live detail page"
                    className="rounded-md border border-brand/20 bg-ink p-2 text-muted transition hover:border-brand hover:text-brand"
                  >
                    <ExternalLink size={15} />
                  </Link>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => openEdit(project)}
                    title="Edit project"
                    className="rounded-md border border-brand/20 bg-ink p-2 text-muted transition hover:border-brand hover:text-fg"
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => setDeleteTarget(project)}
                    title="Delete project"
                    className="rounded-md border border-red-500/25 bg-red-500/5 p-2 text-red-400 transition hover:border-red-400 hover:bg-red-500/15"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This permanently removes the project from your homepage, /projects page, and its detail page."
        confirmLabel="Delete Project"
        busy={Boolean(busyId)}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
