"use client";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Briefcase,
  Code2,
  FolderKanban,
  Layers,
  Plus,
  Sparkles,
  Star,
  User,
} from "lucide-react";
import { getHomeProjects } from "@/lib/default-data";
import { StatusDot } from "@/components/StatusDropdown";
import type { PortfolioData, StorageBackend } from "@/types/portfolio";

export type AdminTabId =
  | "overview"
  | "projects"
  | "status"
  | "experience"
  | "profile"
  | "skills"
  | "education"
  | "services"
  | "socials"
  | "settings";

export default function OverviewTab({
  data,
  storageBackend,
  onNavigate,
  onQuickStatusChange,
  savingStatus,
}: {
  data: PortfolioData;
  storageBackend: StorageBackend;
  onNavigate: (tab: AdminTabId, openNew?: boolean) => void;
  onQuickStatusChange: (statusId: string) => void;
  savingStatus: boolean;
}) {
  const activeOption =
    data.availability.options.find((o) => o.id === data.availability.status) ??
    data.availability.options[0];
  const homeProjects = getHomeProjects(data.projects, 4);
  const totalSkills = data.skills.reduce((sum, g) => sum + g.items.length, 0);

  const storageLabel =
    storageBackend === "mongodb"
      ? "MongoDB Atlas"
      : storageBackend === "redis"
        ? "Upstash Redis / KV"
        : "Local JSON Store";

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <button
          type="button"
          onClick={() => onNavigate("projects")}
          className="card group p-5 text-left transition hover:border-brand/50 hover:shadow-glow"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-muted">
              Projects
            </span>
            <FolderKanban size={18} className="text-brand" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-fg">{data.projects.length}</p>
          <p className="mt-1 font-mono text-xs text-muted">
            <span className="text-brand">{homeProjects.length}</span> shown on home · all on /projects
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("status")}
          className="card group p-5 text-left transition hover:border-brand/50 hover:shadow-glow"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-muted">
              Live Status
            </span>
            <Activity size={18} className="text-brand" />
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            {activeOption && <StatusDot color={activeOption.color} />}
            <p className="truncate text-lg font-bold text-fg">
              {activeOption?.label ?? "Available"}
            </p>
          </div>
          <p className="mt-1.5 font-mono text-xs text-muted">
            {data.availability.options.length} custom statuses configured
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("experience")}
          className="card group p-5 text-left transition hover:border-brand/50 hover:shadow-glow"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-muted">
              Experience
            </span>
            <Briefcase size={18} className="text-brand" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-fg">{data.experience.length}</p>
          <p className="mt-1 font-mono text-xs text-muted">
            {data.experience.length === 0 ? "Showing coming soon state" : "Active timeline entries"}
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("skills")}
          className="card group p-5 text-left transition hover:border-brand/50 hover:shadow-glow"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-muted">
              Skills & Services
            </span>
            <Code2 size={18} className="text-brand" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-fg">{totalSkills}</p>
          <p className="mt-1 font-mono text-xs text-muted">
            {data.skills.length} skill groups · {data.services.length} services
          </p>
        </button>
      </div>

      {/* Quick Actions + Quick Status Switcher */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-fg">Quick Actions</h2>
              <p className="mt-0.5 text-xs text-muted">
                Jump straight to adding or editing portfolio sections
              </p>
            </div>
            <Sparkles size={18} className="text-brand" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onNavigate("projects", true)}
              className="btn-primary !justify-start !px-4 !py-3 font-mono !text-xs"
            >
              <Plus size={16} /> Add New Project
            </button>
            <button
              type="button"
              onClick={() => onNavigate("experience", true)}
              className="btn-ghost !justify-start !px-4 !py-3 font-mono !text-xs"
            >
              <Briefcase size={15} /> Add Experience
            </button>
            <button
              type="button"
              onClick={() => onNavigate("status", true)}
              className="btn-ghost !justify-start !px-4 !py-3 font-mono !text-xs"
            >
              <Activity size={15} /> Add Custom Status
            </button>
            <button
              type="button"
              onClick={() => onNavigate("profile")}
              className="btn-ghost !justify-start !px-4 !py-3 font-mono !text-xs"
            >
              <User size={15} /> Edit Profile & Bio
            </button>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-brand/15 pt-4 font-mono text-xs text-muted">
            <span>
              Storage: <strong className="text-brand">{storageLabel}</strong>
            </span>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1 text-fg hover:text-brand"
              >
                Live Home <ArrowUpRight size={13} />
              </Link>
              <Link
                href="/projects"
                target="_blank"
                className="inline-flex items-center gap-1 text-fg hover:text-brand"
              >
                /projects <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Instant Status Switcher */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-fg">Quick Status Switch</h2>
              <p className="mt-0.5 text-xs text-muted">
                Click any status to update Navbar, Hero, About &amp; Contact instantly
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("status")}
              className="font-mono text-xs text-brand hover:underline"
            >
              Manage all →
            </button>
          </div>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {data.availability.options.map((opt) => {
              const active = opt.id === data.availability.status;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={savingStatus}
                  onClick={() => onQuickStatusChange(opt.id)}
                  className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left transition ${
                    active
                      ? "border-brand bg-brand/15 text-fg shadow-glow"
                      : "border-brand/15 bg-ink text-muted hover:border-brand/50 hover:text-fg"
                  }`}
                >
                  <StatusDot color={opt.color} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{opt.label}</p>
                    <p className="truncate font-mono text-[10px] opacity-75">{opt.code}</p>
                  </div>
                  {active && (
                    <span className="rounded-full bg-brand px-2 py-0.5 font-mono text-[10px] font-bold text-ink-3">
                      ON
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Homepage 4 Projects Preview */}
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-base font-bold text-fg">
              <Layers size={17} className="text-brand" /> Homepage Featured Projects (4 Slots)
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              These 4 projects appear on your Main Page (/). All {data.projects.length} projects appear on /projects.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("projects")}
            className="btn-ghost !px-3.5 !py-2 font-mono !text-xs"
          >
            Manage Projects →
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {homeProjects.map((project, idx) => (
            <div
              key={project.id}
              className="overflow-hidden rounded-xl border border-brand/20 bg-ink"
            >
              <div className="relative h-28 overflow-hidden bg-ink-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 font-mono text-[10px] text-brand backdrop-blur">
                  #{idx + 1} Home
                </span>
                {project.featured && (
                  <Star
                    size={14}
                    className="absolute right-2 top-2 fill-brand text-brand drop-shadow"
                  />
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-semibold text-fg">{project.title}</p>
                <p className="mt-0.5 font-mono text-[11px] text-muted">{project.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
