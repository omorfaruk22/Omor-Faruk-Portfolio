"use client";
import { useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  Circle,
  Code2,
  Command,
  Database,
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
  usingDefaultPassword,
  onNavigate,
  onEditProject,
  onQuickStatusChange,
  onOpenCommandPalette,
  savingStatus,
}: {
  data: PortfolioData;
  storageBackend: StorageBackend;
  usingDefaultPassword: boolean;
  onNavigate: (tab: AdminTabId, openNew?: boolean) => void;
  onEditProject: (projectId: string) => void;
  onQuickStatusChange: (statusId: string) => void;
  onOpenCommandPalette: () => void;
  savingStatus: boolean;
}) {
  const activeOption =
    data.availability.options.find((o) => o.id === data.availability.status) ??
    data.availability.options[0];
  const homeProjects = getHomeProjects(data.projects, 4);
  const totalSkills = data.skills.reduce((sum, g) => sum + g.items.length, 0);

  // Portfolio Readiness Score checks
  const healthChecks = useMemo(
    () => [
      {
        label: "4+ projects published",
        done: data.projects.length >= 4,
        tab: "projects" as AdminTabId,
      },
      {
        label: "Experience timeline populated",
        done: data.experience.length > 0,
        tab: "experience" as AdminTabId,
      },
      {
        label: "Profile bio, photo & resume set",
        done: Boolean(data.profile.photo && data.profile.resumeUrl && data.profile.bio.length > 0),
        tab: "profile" as AdminTabId,
      },
      {
        label: "Skills & services listed",
        done: totalSkills >= 5 && data.services.length >= 3,
        tab: "skills" as AdminTabId,
      },
      {
        label: "Social profiles connected",
        done: data.socials.length >= 2,
        tab: "socials" as AdminTabId,
      },
      {
        label: "Custom admin password set",
        done: !usingDefaultPassword,
        tab: "settings" as AdminTabId,
      },
      {
        label: "Cloud database connected",
        done: storageBackend !== "file",
        tab: "settings" as AdminTabId,
      },
    ],
    [data, totalSkills, usingDefaultPassword, storageBackend]
  );

  const completedCount = healthChecks.filter((c) => c.done).length;
  const healthScore = Math.round((completedCount / healthChecks.length) * 100);
  const ringRadius = 38;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashOffset = ringCircumference * (1 - healthScore / 100);

  // Category distribution
  const categoryStats = useMemo(() => {
    const map = new Map<string, number>();
    data.projects.forEach((p) => {
      const cat = p.category || "Other";
      map.set(cat, (map.get(cat) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({
        name,
        count,
        pct: data.projects.length ? Math.round((count / data.projects.length) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [data.projects]);

  // Top technologies across projects
  const topTech = useMemo(() => {
    const map = new Map<string, number>();
    data.projects.forEach((p) => {
      p.technologies.forEach((t) => {
        const clean = t.trim();
        if (clean) map.set(clean, (map.get(clean) ?? 0) + 1);
      });
    });
    const list = Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
    const max = list[0]?.count || 1;
    return list.map((item) => ({ ...item, pct: Math.round((item.count / max) * 100) }));
  }, [data.projects]);

  const storageLabel =
    storageBackend === "mongodb"
      ? "MongoDB Atlas"
      : storageBackend === "redis"
        ? "Upstash Redis / KV"
        : "Local JSON Store";

  return (
    <div className="space-y-6">
      {/* Command Center Welcome Hero */}
      <div className="glass-card relative overflow-hidden border-brand/30 p-5 sm:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand/15 blur-3xl"
        />
        <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-brand/40 shadow-glow sm:h-16 sm:w-16">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.profile.photo}
                alt={data.profile.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-brand">
                <Sparkles size={11} /> Command Center Active
              </div>
              <h2 className="mt-1.5 truncate text-xl font-extrabold tracking-tight text-fg sm:text-2xl">
                Welcome back, {data.profile.name.split(" ")[0]}
              </h2>
              <p className="mt-0.5 flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
                {activeOption && <StatusDot color={activeOption.color} />}
                <span>{activeOption?.label}</span>
                <span className="text-brand/40">·</span>
                <span className="inline-flex items-center gap-1">
                  <Database size={11} className="text-brand" /> {storageLabel}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="btn-ghost !rounded-xl !px-3.5 !py-2.5 font-mono !text-xs"
            >
              <Command size={14} className="text-brand" /> Quick Jump
              <kbd className="hidden rounded border border-brand/25 bg-ink px-1.5 py-0.5 text-[10px] text-muted sm:inline">
                ⌘K
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => onNavigate("projects", true)}
              className="btn-primary !rounded-xl !px-4 !py-2.5 font-mono !text-xs shadow-glow"
            >
              <Plus size={15} /> New Project
            </button>
          </div>
        </div>
      </div>

      {/* 4 Telemetry Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <button
          type="button"
          onClick={() => onNavigate("projects")}
          className="glass-card group relative overflow-hidden p-5 text-left transition hover:-translate-y-0.5 hover:border-brand/55 hover:shadow-glow"
        >
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-brand/70 to-transparent opacity-60 transition group-hover:opacity-100" />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
              Projects
            </span>
            <span className="rounded-lg border border-brand/25 bg-brand/10 p-1.5 text-brand">
              <FolderKanban size={15} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-fg">
            {data.projects.length}
          </p>
          <p className="mt-1.5 font-mono text-[11px] text-muted">
            <span className="text-brand">{homeProjects.length}</span> on Home · all on /projects
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("status")}
          className="glass-card group relative overflow-hidden p-5 text-left transition hover:-translate-y-0.5 hover:border-brand/55 hover:shadow-glow"
        >
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-brand/70 to-transparent opacity-60 transition group-hover:opacity-100" />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
              Live Status
            </span>
            <span className="rounded-lg border border-brand/25 bg-brand/10 p-1.5 text-brand">
              <Activity size={15} />
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            {activeOption && <StatusDot color={activeOption.color} />}
            <p className="truncate text-lg font-bold text-fg">
              {activeOption?.label ?? "Available"}
            </p>
          </div>
          <p className="mt-2 font-mono text-[11px] text-muted">
            {data.availability.options.length} custom statuses ready
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("experience")}
          className="glass-card group relative overflow-hidden p-5 text-left transition hover:-translate-y-0.5 hover:border-brand/55 hover:shadow-glow"
        >
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-brand/70 to-transparent opacity-60 transition group-hover:opacity-100" />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
              Experience
            </span>
            <span className="rounded-lg border border-brand/25 bg-brand/10 p-1.5 text-brand">
              <Briefcase size={15} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-fg">
            {data.experience.length}
          </p>
          <p className="mt-1.5 font-mono text-[11px] text-muted">
            {data.experience.length === 0 ? "Tap to add your first role" : "Active timeline roles"}
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("skills")}
          className="glass-card group relative overflow-hidden p-5 text-left transition hover:-translate-y-0.5 hover:border-brand/55 hover:shadow-glow"
        >
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-brand/70 to-transparent opacity-60 transition group-hover:opacity-100" />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
              Skills &amp; Services
            </span>
            <span className="rounded-lg border border-brand/25 bg-brand/10 p-1.5 text-brand">
              <Code2 size={15} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-fg">{totalSkills}</p>
          <p className="mt-1.5 font-mono text-[11px] text-muted">
            {data.skills.length} groups · {data.services.length} services
          </p>
        </button>
      </div>

      {/* Readiness Gauge + Analytics Panel */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        {/* Portfolio Readiness Gauge */}
        <div className="glass-card min-w-0 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-fg">Portfolio Readiness</h3>
              <p className="mt-0.5 text-xs text-muted">
                Live health &amp; deployment checklist
              </p>
            </div>
            <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 font-mono text-xs font-bold text-brand">
              {completedCount}/{healthChecks.length}
            </span>
          </div>

          <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row">
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
              <svg className="h-28 w-28 -rotate-90" viewBox="0 0 96 96">
                <circle
                  cx="48"
                  cy="48"
                  r={ringRadius}
                  fill="none"
                  stroke="rgba(34,197,94,0.14)"
                  strokeWidth="8"
                />
                <circle
                  cx="48"
                  cy="48"
                  r={ringRadius}
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringDashOffset}
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-xl font-extrabold text-fg">{healthScore}%</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-brand">
                  Score
                </span>
              </div>
            </div>

            <div className="w-full min-w-0 space-y-2">
              {healthChecks.map((check) => (
                <button
                  key={check.label}
                  type="button"
                  onClick={() => onNavigate(check.tab)}
                  className="flex w-full items-center justify-between gap-2 rounded-lg border border-brand/10 bg-ink/70 px-3 py-2 text-left text-xs transition hover:border-brand/40"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {check.done ? (
                      <CheckCircle2 size={14} className="shrink-0 text-brand" />
                    ) : (
                      <Circle size={14} className="shrink-0 text-amber-400" />
                    )}
                    <span className={`truncate ${check.done ? "text-muted" : "font-medium text-fg"}`}>
                      {check.label}
                    </span>
                  </span>
                  {!check.done && (
                    <span className="shrink-0 font-mono text-[10px] text-brand">Fix →</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category & Top Tech Analytics */}
        <div className="glass-card min-w-0 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="flex items-center gap-2 text-base font-bold text-fg">
                <BarChart3 size={17} className="text-brand" /> Portfolio Stack Analytics
              </h3>
              <p className="mt-0.5 text-xs text-muted">
                Category mix &amp; most-used technologies across {data.projects.length} projects
              </p>
            </div>
            <Link
              href="/projects"
              target="_blank"
              className="inline-flex items-center gap-1 font-mono text-xs text-brand hover:underline"
            >
              /projects <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Category Breakdown Bar */}
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-muted">
              <span>CATEGORIES</span>
              <span>{categoryStats.length} types</span>
            </div>
            <div className="flex h-3 w-full overflow-hidden rounded-full border border-brand/20 bg-ink">
              {categoryStats.map((cat, idx) => {
                const shades = ["#22C55E", "#10B981", "#38BDF8", "#EAB308", "#A855F7"];
                return (
                  <div
                    key={cat.name}
                    title={`${cat.name}: ${cat.count} (${cat.pct}%)`}
                    style={{
                      width: `${Math.max(cat.pct, 6)}%`,
                      background: shades[idx % shades.length],
                    }}
                    className="h-full transition-all"
                  />
                );
              })}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {categoryStats.map((cat, idx) => {
                const shades = ["#22C55E", "#10B981", "#38BDF8", "#EAB308", "#A855F7"];
                return (
                  <span
                    key={cat.name}
                    className="inline-flex items-center gap-1.5 rounded-md border border-brand/15 bg-ink px-2 py-1 font-mono text-[11px] text-muted"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: shades[idx % shades.length] }}
                    />
                    <span className="text-fg">{cat.name}</span>
                    <span>({cat.count})</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Top Technologies Horizontal Bars */}
          <div className="mt-6 space-y-2.5">
            <p className="font-mono text-[11px] text-muted">TOP TECHNOLOGIES</p>
            {topTech.map((tech) => (
              <div key={tech.name} className="space-y-1">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="truncate text-fg">{tech.name}</span>
                  <span className="text-muted">
                    {tech.count} {tech.count === 1 ? "project" : "projects"}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-ink">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-700 to-brand transition-all duration-500"
                    style={{ width: `${tech.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instant Status Switcher + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card min-w-0 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-fg">Live Status Switcher</h3>
              <p className="mt-0.5 text-xs text-muted">
                One tap updates Navbar, Hero, About, Terminal &amp; Contact
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("status")}
              className="font-mono text-xs text-brand hover:underline"
            >
              Status Studio →
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
                  className={`flex min-w-0 items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left transition ${
                    active
                      ? "border-brand bg-brand/15 text-fg shadow-glow"
                      : "border-brand/15 bg-ink/80 text-muted hover:border-brand/50 hover:text-fg"
                  }`}
                >
                  <StatusDot color={opt.color} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{opt.label}</p>
                    <p className="truncate font-mono text-[10px] opacity-75">{opt.code}</p>
                  </div>
                  {active && (
                    <span className="shrink-0 rounded-full bg-brand px-2 py-0.5 font-mono text-[10px] font-bold text-ink-3">
                      LIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-card min-w-0 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-fg">Quick Launchpad</h3>
              <p className="mt-0.5 text-xs text-muted">
                Fast shortcuts to publish or refine your portfolio
              </p>
            </div>
            <Sparkles size={17} className="text-brand" />
          </div>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onNavigate("projects", true)}
              className="flex items-center gap-3 rounded-xl border border-brand/35 bg-brand/10 p-3.5 text-left transition hover:bg-brand/20"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-ink-3">
                <Plus size={17} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-fg">Add Project</p>
                <p className="truncate font-mono text-[10px] text-muted">Live card preview</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("experience", true)}
              className="flex items-center gap-3 rounded-xl border border-brand/20 bg-ink/80 p-3.5 text-left transition hover:border-brand/50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand/30 bg-brand/10 text-brand">
                <Briefcase size={16} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-fg">Add Experience</p>
                <p className="truncate font-mono text-[10px] text-muted">Timeline entry</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("status", true)}
              className="flex items-center gap-3 rounded-xl border border-brand/20 bg-ink/80 p-3.5 text-left transition hover:border-brand/50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand/30 bg-brand/10 text-brand">
                <Activity size={16} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-fg">Custom Status</p>
                <p className="truncate font-mono text-[10px] text-muted">Badge &amp; color</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("profile")}
              className="flex items-center gap-3 rounded-xl border border-brand/20 bg-ink/80 p-3.5 text-left transition hover:border-brand/50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand/30 bg-brand/10 text-brand">
                <User size={16} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-fg">Profile &amp; Bio</p>
                <p className="truncate font-mono text-[10px] text-muted">Photo &amp; resume</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Homepage 4-Slot Showcase */}
      <div className="glass-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-fg">
              <Layers size={17} className="text-brand" /> Homepage 4-Slot Showcase
            </h3>
            <p className="mt-0.5 text-xs text-muted">
              Click any card to edit directly. Starred projects fill slots #1–#4 on your Main Page.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("projects")}
            className="btn-ghost !rounded-xl !px-3.5 !py-2 font-mono !text-xs"
          >
            Open Projects Studio →
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {homeProjects.map((project, idx) => (
            <button
              key={project.id}
              type="button"
              onClick={() => onEditProject(project.id)}
              className="group overflow-hidden rounded-xl border border-brand/20 bg-ink text-left transition hover:-translate-y-0.5 hover:border-brand/60 hover:shadow-glow"
            >
              <div className="relative h-28 overflow-hidden bg-ink-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute left-2 top-2 rounded-md bg-black/75 px-2 py-0.5 font-mono text-[10px] font-semibold text-brand backdrop-blur">
                  Slot #{idx + 1}
                </span>
                {project.featured && (
                  <Star
                    size={14}
                    className="absolute right-2 top-2 fill-brand text-brand drop-shadow"
                  />
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-semibold text-fg transition group-hover:text-brand">
                  {project.title}
                </p>
                <p className="mt-0.5 truncate font-mono text-[11px] text-muted">
                  {project.category} · {project.technologies.length} tech
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
