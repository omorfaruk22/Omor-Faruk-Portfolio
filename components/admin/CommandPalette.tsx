"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Briefcase,
  Code2,
  CornerDownLeft,
  Download,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  Share2,
  Sparkles,
  User,
  Wrench,
  X,
} from "lucide-react";
import { StatusDot } from "@/components/StatusDropdown";
import type { AdminTabId } from "./OverviewTab";
import type { PortfolioData } from "@/types/portfolio";

type CommandItem = {
  id: string;
  group: "Quick Actions" | "Navigate" | "Switch Status" | "Projects";
  label: string;
  subtitle?: string;
  keywords: string;
  dotColor?: string;
  icon?: React.ReactNode;
  run: () => void;
};

export default function CommandPalette({
  open,
  onClose,
  data,
  onNavigate,
  onEditProject,
  onQuickStatusChange,
  onExportJson,
}: {
  open: boolean;
  onClose: () => void;
  data: PortfolioData;
  onNavigate: (tab: AdminTabId, openNew?: boolean) => void;
  onEditProject: (projectId: string) => void;
  onQuickStatusChange: (statusId: string) => void;
  onExportJson: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const items = useMemo<CommandItem[]>(() => {
    const actions: CommandItem[] = [
      {
        id: "act-add-project",
        group: "Quick Actions",
        label: "Add New Project",
        subtitle: "Publish to /projects and optionally feature on Home",
        keywords: "new create add project portfolio",
        icon: <Plus size={15} className="text-brand" />,
        run: () => onNavigate("projects", true),
      },
      {
        id: "act-add-experience",
        group: "Quick Actions",
        label: "Add Experience Entry",
        subtitle: "Add a role, internship, or freelance experience",
        keywords: "new create add experience work job internship",
        icon: <Briefcase size={15} className="text-brand" />,
        run: () => onNavigate("experience", true),
      },
      {
        id: "act-add-status",
        group: "Quick Actions",
        label: "Create Custom Status",
        subtitle: "Add a new availability badge with custom color",
        keywords: "new create add status availability badge",
        icon: <Sparkles size={15} className="text-brand" />,
        run: () => onNavigate("status", true),
      },
      {
        id: "act-export",
        group: "Quick Actions",
        label: "Export Portfolio Backup (JSON)",
        subtitle: "Download all portfolio data locally",
        keywords: "export download json backup",
        icon: <Download size={15} className="text-brand" />,
        run: onExportJson,
      },
      {
        id: "act-live-home",
        group: "Quick Actions",
        label: "Open Live Portfolio Home",
        subtitle: "/",
        keywords: "open view live site home",
        icon: <ExternalLink size={15} className="text-muted" />,
        run: () => window.open("/", "_blank", "noopener,noreferrer"),
      },
      {
        id: "act-live-projects",
        group: "Quick Actions",
        label: "Open Dedicated Projects Page",
        subtitle: "/projects",
        keywords: "open view all projects archive",
        icon: <ExternalLink size={15} className="text-muted" />,
        run: () => window.open("/projects", "_blank", "noopener,noreferrer"),
      },
    ];

    const nav: CommandItem[] = [
      { id: "nav-overview", group: "Navigate", label: "Overview & Analytics", keywords: "dashboard home stats health", icon: <LayoutDashboard size={15} />, run: () => onNavigate("overview") },
      { id: "nav-projects", group: "Navigate", label: "Projects Studio", subtitle: `${data.projects.length} projects`, keywords: "projects portfolio", icon: <FolderKanban size={15} />, run: () => onNavigate("projects") },
      { id: "nav-status", group: "Navigate", label: "Status Studio", subtitle: `${data.availability.options.length} statuses`, keywords: "status availability", icon: <Activity size={15} />, run: () => onNavigate("status") },
      { id: "nav-experience", group: "Navigate", label: "Experience Manager", subtitle: `${data.experience.length} entries`, keywords: "experience career", icon: <Briefcase size={15} />, run: () => onNavigate("experience") },
      { id: "nav-profile", group: "Navigate", label: "Profile & About", keywords: "profile about bio photo resume contact", icon: <User size={15} />, run: () => onNavigate("profile") },
      { id: "nav-skills", group: "Navigate", label: "Skills Manager", subtitle: `${data.skills.length} groups`, keywords: "skills tech stack", icon: <Code2 size={15} />, run: () => onNavigate("skills") },
      { id: "nav-education", group: "Navigate", label: "Education Timeline", keywords: "education degree diploma", icon: <GraduationCap size={15} />, run: () => onNavigate("education") },
      { id: "nav-services", group: "Navigate", label: "Services", subtitle: `${data.services.length} services`, keywords: "services offerings", icon: <Wrench size={15} />, run: () => onNavigate("services") },
      { id: "nav-socials", group: "Navigate", label: "Social Links", keywords: "socials github linkedin facebook email", icon: <Share2 size={15} />, run: () => onNavigate("socials") },
      { id: "nav-settings", group: "Navigate", label: "Settings & Security", keywords: "settings password security database backup reset", icon: <Settings size={15} />, run: () => onNavigate("settings") },
    ];

    const statuses: CommandItem[] = data.availability.options.map((opt) => ({
      id: `status-${opt.id}`,
      group: "Switch Status",
      label: `Set status: ${opt.label}`,
      subtitle: opt.id === data.availability.status ? "Currently active" : opt.code,
      keywords: `status switch ${opt.label} ${opt.code}`,
      dotColor: opt.color,
      run: () => onQuickStatusChange(opt.id),
    }));

    const projectItems: CommandItem[] = data.projects.map((p) => ({
      id: `proj-${p.id}`,
      group: "Projects",
      label: p.title,
      subtitle: `${p.category} · /projects/${p.slug}`,
      keywords: `edit project ${p.title} ${p.category} ${p.technologies.join(" ")}`,
      icon: <FolderKanban size={15} className="text-brand" />,
      run: () => onEditProject(p.id),
    }));

    return [...actions, ...nav, ...statuses, ...projectItems];
  }, [data, onNavigate, onEditProject, onQuickStatusChange, onExportJson]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 14);
    return items.filter((item) =>
      `${item.label} ${item.subtitle ?? ""} ${item.keywords}`.toLowerCase().includes(q)
    );
  }, [items, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].run();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, selectedIndex, onClose]);

  const groups = useMemo(() => {
    const map = new Map<string, { item: CommandItem; flatIndex: number }[]>();
    filtered.forEach((item, flatIndex) => {
      const list = map.get(item.group) ?? [];
      list.push({ item, flatIndex });
      map.set(item.group, list);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[130] flex items-start justify-center bg-black/80 p-4 pt-[10vh] lg:backdrop-blur-sm"
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.16 }}
            className="glass-card w-full max-w-xl overflow-hidden border-brand/35 shadow-glow"
          >
            <div className="flex items-center gap-3 border-b border-brand/15 px-4 py-3.5">
              <Search size={18} className="shrink-0 text-brand" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, jump to section, edit project, or switch status..."
                className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted/70"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close command palette"
                className="rounded-md border border-brand/20 p-1 text-muted hover:text-fg"
              >
                <X size={15} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {groups.length === 0 ? (
                <div className="px-4 py-10 text-center font-mono text-xs text-muted">
                  No matching commands for &quot;{query}&quot;
                </div>
              ) : (
                groups.map(([groupName, entries]) => (
                  <div key={groupName} className="mb-2 last:mb-0">
                    <p className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      {groupName}
                    </p>
                    {entries.map(({ item, flatIndex }) => {
                      const active = flatIndex === selectedIndex;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onMouseEnter={() => setSelectedIndex(flatIndex)}
                          onClick={() => {
                            item.run();
                            onClose();
                          }}
                          className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                            active
                              ? "bg-brand/15 text-fg ring-1 ring-brand/40"
                              : "text-muted hover:bg-brand/5 hover:text-fg"
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-brand/20 bg-ink">
                              {item.dotColor ? <StatusDot color={item.dotColor} /> : item.icon}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-fg">{item.label}</p>
                              {item.subtitle && (
                                <p className="truncate font-mono text-[11px] text-muted">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                          </div>
                          {active && <ArrowRight size={14} className="shrink-0 text-brand" />}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t border-brand/15 bg-black/30 px-4 py-2.5 font-mono text-[10px] text-muted">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-brand/25 bg-ink px-1.5 py-0.5 text-fg">↑↓</kbd> Navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-brand/25 bg-ink px-1.5 py-0.5 text-fg">
                    <CornerDownLeft size={10} />
                  </kbd>{" "}
                  Run
                </span>
              </div>
              <span>
                <kbd className="rounded border border-brand/25 bg-ink px-1.5 py-0.5 text-fg">ESC</kbd> Close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
