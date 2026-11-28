"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Copy,
  Eye,
  ExternalLink,
  FolderKanban,
  Github,
  LayoutGrid,
  Layers3,
  List,
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
  initialEditProjectId = null,
  onConsumeEditProjectId,
}: {
  data: PortfolioData;
  onDataChange: (next: PortfolioData) => void;
  onNotify: (type: "success" | "error" | "info", text: string) => void;
  initialOpenNew?: boolean;
  onConsumeOpenNew?: () => void;
  initialEditProjectId?: string | null;
  onConsumeEditProjectId?: () => void;
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [editing, setEditing] = useState<ProjectDraft | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectItem | null>(null);

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

  useEffect(() => {
    if (initialOpenNew) {
      setEditing(emptyDraft());
      setSlugTouched(false);
      onConsumeOpenNew?.();
    }
  }, [initialOpenNew, onConsumeOpenNew]);

  useEffect(() => {
    if (!initialEditProjectId) return;
    const found = data.projects.find((p) => p.id === initialEditProjectId);
    if (found) openEdit(found);
    onConsumeEditProjectId?.();
  }, [initialEditProjectId, data.projects, onConsumeEditProjectId]);

  const homeSlotMap = useMemo(() => {
    const map = new Map<string, number>();
    getHomeProjects(data.projects, 4).forEach((p, idx) => map.set(p.id, idx + 1));
    return map;
  }, [data.projects]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(data.projects.map((p) => p.category).filter(Boolean)))],
    [data.projects]
  );

  const featuredCount = data.projects.filter((p) => p.featured).length;
  const activeCat = categories.includes(categoryFilter) ? categoryFilter : "All";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.projects.filter((p) => {
      if (activeCat !== "All" && p.category !== activeCat) return false;
      if (!q) return true;
      return [p.title, p.category, p.slug, ...p.technologies].join(" ").toLowerCase().includes(q);
    });
  }, [data.projects, search, activeCat]);

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
          `Published "${res.project.title}" — live on /projects and /projects/${res.project.slug}!`
        );
      }
      setEditing(null);
    } catch (err) {
      onNotify("error", err instanceof Error ? err.message : "Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  const duplicateProject = (p: ProjectItem) => {
    setEditing({
      title: `${p.title} Copy`,
      slug: `${p.slug}-copy`,
      description: p.description,
      image: p.image,
      technologies: [...p.technologies],
      github: p.github,
      serverGithub: p.serverGithub ?? "",
      live: p.live,
      category: p.category,
      featured: false,
      highlights: [...p.highlights],
      challenges: [...p.challenges],
      improvements: [...p.improvements],
    });
    setSlugTouched(false);
    onNotify("info", `Duplicated "${p.title}" into editor — edit and click Publish.`);
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
          ? `"${project.title}" starred for Homepage.`
          : `"${project.title}" unstarred.`
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
      {/* Studio Header Banner */}
      <div className="glass-card flex flex-col justify-between gap-4 border-brand/30 p-5 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="flex items-center gap-2 text-lg font-bold text-fg">
              <FolderKanban size={18} className="text-brand" /> Projects Studio
            </h2>
            <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 font-mono text-xs text-brand">
              {data.projects.length} total
            </span>
            <span className="rounded-full border border-brand/20 bg-ink px-2.5 py-0.5 font-mono text-xs text-muted">
              {featuredCount} starred · Top 4 on Home
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Main Page (/) highlights 4 projects. Every project you publish appears automatically on{" "}
            <Link href="/projects" target="_blank" className="text-brand hover:underline">
              /projects
            </Link>{" "}
            with a dynamic detail page.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(emptyDraft());
            setSlugTouched(false);
          }}
          className="btn-primary shrink-0 !rounded-xl font-mono !text-xs shadow-glow"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Split-Screen Studio Editor with Real-Time Live Card Preview */}
      {editing && (
        <form
          onSubmit={handleSave}
          className="glass-card border-brand/45 p-5 shadow-glow sm:p-6"
        >
          <div className="flex items-center justify-between border-b border-brand/15 pb-4">
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-wider text-brand">
                {editing.id ? "Editing Project" : "New Project Studio"}
              </p>
              <h3 className="mt-0.5 truncate text-lg font-bold text-fg">
                {editing.title || "Untitled Project"}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-lg border border-brand/20 p-2 text-muted hover:border-brand hover:text-fg"
              aria-label="Close editor"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.9fr)]">
            {/* Left: Form fields */}
            <div className="min-w-0 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
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
                  <label className={labelCls}>URL Slug</label>
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
                        className={`rounded-md border px-2 py-0.5 font-mono text-[10px] transition ${
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

                <div className="flex items-start sm:pt-6">
                  <label className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-brand/25 bg-ink px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-fg">Feature on Home</p>
                      <p className="text-[11px] text-muted">Top 4 featured show on Main Page</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={editing.featured}
                      onChange={(e) =>
                        setEditing((prev) => (prev ? { ...prev, featured: e.target.checked } : null))
                      }
                      className="h-5 w-5 shrink-0 accent-brand"
                    />
                  </label>
                </div>
              </div>

              <div>
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

              <div>
                <label className={labelCls}>Project Preview Image (16:9 recommended)</label>
                <MediaUploadField
                  value={editing.image}
                  onChange={(url) => setEditing((prev) => (prev ? { ...prev, image: url } : null))}
                  presets={IMAGE_PRESETS}
                  onNotify={onNotify}
                />
              </div>

              <div>
                <label className={labelCls}>Technologies (press Enter or comma)</label>
                <TagInput
                  values={editing.technologies}
                  onChange={(technologies) =>
                    setEditing((prev) => (prev ? { ...prev, technologies } : null))
                  }
                  placeholder="Next.js, TypeScript, Tailwind CSS, MongoDB..."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
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
                <div className="sm:col-span-2">
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
              </div>

              <div>
                <label className={labelCls}>Highlights / What I Built</label>
                <StringListEditor
                  items={editing.highlights}
                  onChange={(highlights) =>
                    setEditing((prev) => (prev ? { ...prev, highlights } : null))
                  }
                  placeholder="Add a key feature or accomplishment..."
                  addLabel="Add"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Challenges</label>
                  <StringListEditor
                    items={editing.challenges}
                    onChange={(challenges) =>
                      setEditing((prev) => (prev ? { ...prev, challenges } : null))
                    }
                    placeholder="Add a challenge..."
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
                    placeholder="Add a future plan..."
                    addLabel="Add"
                  />
                </div>
              </div>
            </div>

            {/* Right: Real-Time Live Card Preview */}
            <aside className="min-w-0">
              <div className="xl:sticky xl:top-24">
                <div className="mb-2.5 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-brand">
                  <span className="flex items-center gap-1.5">
                    <Eye size={13} /> Real-Time Card Preview
                  </span>
                  <span className="truncate text-[10px] lowercase text-muted">
                    /projects/{editing.slug || "your-slug"}
                  </span>
                </div>

                <div className="card overflow-hidden border-brand/30 shadow-glow">
                  <div className="relative h-48 overflow-hidden bg-ink">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editing.image || "/projects/bazardor.png"}
                      alt="Live preview"
                      className="h-full w-full object-cover"
                    />
                    {editing.featured && (
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-brand/40 bg-brand px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-ink-3">
                        <Star size={10} className="fill-current" /> Featured
                      </span>
                    )}
                    <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/80 px-2.5 py-0.5 font-mono text-[10px] text-white">
                      {editing.category || "Category"}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="break-words text-base font-semibold text-fg">
                        {editing.title || "Your Project Title"}
                      </h4>
                      <Layers3 size={15} className="mt-1 shrink-0 text-brand" />
                    </div>
                    <p className="mt-1.5 line-clamp-3 break-words text-xs leading-relaxed text-muted">
                      {editing.description ||
                        "Start typing a description to preview how your project card will appear on the portfolio..."}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(editing.technologies.length > 0
                        ? editing.technologies.slice(0, 4)
                        : ["Next.js", "TypeScript"]
                      ).map((t) => (
                        <span
                          key={t}
                          className="rounded border border-brand/20 bg-brand/[0.05] px-2 py-0.5 text-[10px] text-muted"
                        >
                          {t}
                        </span>
                      ))}
                      {editing.technologies.length > 4 && (
                        <span className="px-1 py-0.5 text-[10px] text-muted">
                          +{editing.technologies.length - 4}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-brand/10 pt-3">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand">
                        Project details <ArrowUpRight size={14} />
                      </span>
                      <div className="flex items-center gap-2.5 text-muted">
                        {editing.github && <Github size={14} />}
                        {editing.live && <ExternalLink size={14} />}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-brand/15 bg-ink/80 p-3 font-mono text-[11px] text-muted">
                  <p>
                    Highlights: <span className="text-fg">{editing.highlights.length}</span> ·
                    Challenges: <span className="text-fg">{editing.challenges.length}</span> ·
                    Plans: <span className="text-fg">{editing.improvements.length}</span>
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-brand/15 pt-4">
            <button
              type="button"
              disabled={saving}
              onClick={() => setEditing(null)}
              className="btn-ghost !rounded-xl !px-4 !py-2.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary !rounded-xl !px-5 !py-2.5 font-mono shadow-glow"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {editing.id ? "Save Changes" : "Publish Project"}
            </button>
          </div>
        </form>
      )}

      {/* Search + Category Filters + View Switcher */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-md">
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

        <div className="flex items-center gap-1.5 self-start rounded-xl border border-brand/20 bg-ink p-1 sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs transition ${
              viewMode === "list"
                ? "bg-brand text-ink-3 font-semibold"
                : "text-muted hover:text-fg"
            }`}
          >
            <List size={14} /> List
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs transition ${
              viewMode === "grid"
                ? "bg-brand text-ink-3 font-semibold"
                : "text-muted hover:text-fg"
            }`}
          >
            <LayoutGrid size={14} /> Grid
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition ${
              activeCat === cat
                ? "border-brand bg-brand text-ink-3 font-semibold"
                : "border-brand/25 bg-ink-2 text-muted hover:border-brand hover:text-fg"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects List or Grid */}
      {filtered.length === 0 ? (
        <div className="glass-card border-dashed p-10 text-center">
          <FolderKanban size={28} className="mx-auto text-muted" />
          <p className="mt-3 text-sm text-muted">No matching projects found.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => {
            const slot = homeSlotMap.get(project.id);
            const isBusy = busyId === project.id;
            return (
              <div
                key={project.id}
                className="glass-card flex flex-col overflow-hidden border-brand/20 transition hover:border-brand/50"
              >
                <div className="relative h-36 bg-ink">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  {slot && (
                    <span className="absolute left-2.5 top-2.5 rounded-md bg-brand px-2 py-0.5 font-mono text-[10px] font-bold text-ink-3">
                      HOME #{slot}
                    </span>
                  )}
                  <span className="absolute right-2.5 top-2.5 rounded-md bg-black/80 px-2 py-0.5 font-mono text-[10px] text-white">
                    {project.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="truncate text-base font-bold text-fg">{project.title}</h3>
                  <p className="mt-1 line-clamp-2 flex-1 text-xs text-muted">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-brand/15 pt-3">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => toggleFeatured(project)}
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 font-mono text-[11px] transition ${
                        project.featured
                          ? "border-brand bg-brand/15 text-brand"
                          : "border-brand/20 bg-ink text-muted hover:text-brand"
                      }`}
                    >
                      <Star size={12} className={project.featured ? "fill-current" : ""} />
                      {project.featured ? "Featured" : "Feature"}
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => duplicateProject(project)}
                        title="Duplicate"
                        className="rounded-md border border-brand/20 bg-ink p-1.5 text-muted hover:text-fg"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(project)}
                        title="Edit"
                        className="rounded-md border border-brand/20 bg-ink p-1.5 text-muted hover:text-fg"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(project)}
                        title="Delete"
                        className="rounded-md border border-red-500/25 bg-red-500/5 p-1.5 text-red-400 hover:border-red-400"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((project) => {
            const globalIndex = data.projects.findIndex((p) => p.id === project.id);
            const slot = homeSlotMap.get(project.id);
            const isBusy = busyId === project.id;

            return (
              <div
                key={project.id}
                className="glass-card flex flex-col gap-4 border-brand/20 p-4 transition hover:border-brand/45 sm:flex-row sm:items-center"
              >
                <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl border border-brand/15 bg-ink sm:h-20 sm:w-36">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  {slot && (
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-brand px-1.5 py-0.5 font-mono text-[10px] font-bold text-ink-3">
                      HOME #{slot}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-semibold text-fg">{project.title}</h3>
                    <span className="rounded-full border border-brand/25 bg-brand/10 px-2 py-0.5 font-mono text-[10px] text-brand">
                      {project.category}
                    </span>
                    <span className="truncate font-mono text-[11px] text-muted">
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
                    className={`rounded-lg border p-2 transition ${
                      project.featured
                        ? "border-brand bg-brand/15 text-brand"
                        : "border-brand/20 bg-ink text-muted hover:border-brand hover:text-brand"
                    }`}
                  >
                    <Star size={14} className={project.featured ? "fill-current" : ""} />
                  </button>

                  {!search && activeCat === "All" && (
                    <>
                      <button
                        type="button"
                        disabled={isBusy || globalIndex === 0}
                        onClick={() => reorder(globalIndex, -1)}
                        aria-label="Move project up"
                        className="rounded-lg border border-brand/20 bg-ink p-2 text-muted transition hover:border-brand hover:text-fg disabled:opacity-30"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={isBusy || globalIndex === data.projects.length - 1}
                        onClick={() => reorder(globalIndex, 1)}
                        aria-label="Move project down"
                        className="rounded-lg border border-brand/20 bg-ink p-2 text-muted transition hover:border-brand hover:text-fg disabled:opacity-30"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => duplicateProject(project)}
                    title="Duplicate project"
                    className="rounded-lg border border-brand/20 bg-ink p-2 text-muted transition hover:border-brand hover:text-fg"
                  >
                    <Copy size={14} />
                  </button>

                  <Link
                    href={`/projects/${project.slug}`}
                    target="_blank"
                    title="View live detail page"
                    className="rounded-lg border border-brand/20 bg-ink p-2 text-muted transition hover:border-brand hover:text-brand"
                  >
                    <ExternalLink size={14} />
                  </Link>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => openEdit(project)}
                    title="Edit project"
                    className="rounded-lg border border-brand/20 bg-ink p-2 text-muted transition hover:border-brand hover:text-fg"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => setDeleteTarget(project)}
                    title="Delete project"
                    className="rounded-lg border border-red-500/25 bg-red-500/5 p-2 text-red-400 transition hover:border-red-400 hover:bg-red-500/15"
                  >
                    <Trash2 size={14} />
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
