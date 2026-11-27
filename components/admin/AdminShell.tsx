"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Briefcase,
  Code2,
  Command,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Share2,
  ShieldAlert,
  User,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "@/components/Providers";
import { StatusDot } from "@/components/StatusDropdown";
import { adminFetch, setStoredToken } from "./api";
import { ToastViewport, type ToastMessage } from "./ui";
import CommandPalette from "./CommandPalette";
import OverviewTab, { type AdminTabId } from "./OverviewTab";
import ProjectsTab from "./ProjectsTab";
import StatusTab from "./StatusTab";
import ExperienceTab from "./ExperienceTab";
import ProfileTab from "./ProfileTab";
import SkillsTab from "./SkillsTab";
import EducationTab from "./EducationTab";
import ServicesTab from "./ServicesTab";
import SocialsTab from "./SocialsTab";
import SettingsTab from "./SettingsTab";
import type { PortfolioData, StorageBackend } from "@/types/portfolio";

type NavItem = {
  id: AdminTabId;
  label: string;
  shortLabel: string;
  group: "Workspace" | "Portfolio" | "System";
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Overview", shortLabel: "Home", group: "Workspace", icon: LayoutDashboard },
  { id: "projects", label: "Projects Studio", shortLabel: "Projects", group: "Workspace", icon: FolderKanban },
  { id: "status", label: "Status Studio", shortLabel: "Status", group: "Workspace", icon: Activity },
  { id: "experience", label: "Experience", shortLabel: "Work", group: "Workspace", icon: Briefcase },
  { id: "profile", label: "Profile & About", shortLabel: "Profile", group: "Portfolio", icon: User },
  { id: "skills", label: "Skills", shortLabel: "Skills", group: "Portfolio", icon: Code2 },
  { id: "education", label: "Education", shortLabel: "Edu", group: "Portfolio", icon: GraduationCap },
  { id: "services", label: "Services", shortLabel: "Services", group: "Portfolio", icon: Wrench },
  { id: "socials", label: "Social Links", shortLabel: "Socials", group: "Portfolio", icon: Share2 },
  { id: "settings", label: "Settings", shortLabel: "Settings", group: "System", icon: Settings },
];

const NAV_GROUPS: NavItem["group"][] = ["Workspace", "Portfolio", "System"];

const MOBILE_DOCK_TABS: AdminTabId[] = ["overview", "projects", "status", "experience"];

export default function AdminShell({
  initialData,
  userEmail,
  storageBackend,
  usingDefaultPassword,
  onPasswordChanged,
  onLogout,
}: {
  initialData: PortfolioData;
  userEmail: string;
  storageBackend: StorageBackend;
  usingDefaultPassword: boolean;
  onPasswordChanged: () => void;
  onLogout: () => void;
}) {
  const router = useRouter();
  const { setData: setGlobalData } = useApp();

  const [data, setData] = useState<PortfolioData>(initialData);
  const [activeTab, setActiveTab] = useState<AdminTabId>("overview");
  const [pendingOpenNew, setPendingOpenNew] = useState<AdminTabId | null>(null);
  const [pendingEditProjectId, setPendingEditProjectId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [savingStatus, setSavingStatus] = useState(false);

  // Global Cmd+K / Ctrl+K shortcut for Command Palette
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const notify = useCallback((type: "success" | "error" | "info", text: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const handleDataChange = useCallback(
    (next: PortfolioData) => {
      setData(next);
      setGlobalData(next);
      router.refresh();
    },
    [setGlobalData, router]
  );

  const handleNavigate = useCallback((tab: AdminTabId, openNew = false) => {
    setActiveTab(tab);
    setPendingOpenNew(openNew ? tab : null);
    setSidebarOpen(false);
  }, []);

  const handleEditProject = useCallback((projectId: string) => {
    setActiveTab("projects");
    setPendingEditProjectId(projectId);
    setSidebarOpen(false);
  }, []);

  const handleExportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify("info", "Exported portfolio JSON backup.");
  }, [data, notify]);

  const handleQuickStatusChange = async (statusId: string) => {
    setSavingStatus(true);
    try {
      const updated = await adminFetch<PortfolioData>("/api/portfolio", {
        method: "PUT",
        body: JSON.stringify({
          availability: {
            ...data.availability,
            status: statusId,
          },
        }),
      });
      handleDataChange(updated);
      const chosen = updated.availability.options.find((o) => o.id === statusId);
      notify("success", `Live status updated to "${chosen?.label ?? statusId}".`);
    } catch (err) {
      notify("error", err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleLogout = async () => {
    try {
      await adminFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setStoredToken(null);
    onLogout();
  };

  const activeOption =
    data.availability.options.find((o) => o.id === data.availability.status) ??
    data.availability.options[0];
  const currentNav = NAV_ITEMS.find((n) => n.id === activeTab) ?? NAV_ITEMS[0];

  const getCountBadge = (id: AdminTabId): number | null => {
    switch (id) {
      case "projects":
        return data.projects.length;
      case "experience":
        return data.experience.length;
      case "status":
        return data.availability.options.length;
      case "skills":
        return data.skills.length;
      case "education":
        return data.profile.education.length;
      case "services":
        return data.services.length;
      case "socials":
        return data.socials.length;
      default:
        return null;
    }
  };

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-brand/15 px-5 py-4">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-mono text-sm font-bold text-brand">
          <span className="truncate">&lt;{data.profile.name}/&gt;</span>
          <span className="shrink-0 rounded-md border border-brand/35 bg-brand/15 px-1.5 py-0.5 text-[9px] uppercase tracking-wider">
            OS
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="rounded-md p-1 text-muted hover:text-fg lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Quick Command Trigger inside Sidebar */}
      <div className="px-3 pt-3">
        <button
          type="button"
          onClick={() => {
            setSidebarOpen(false);
            setCmdOpen(true);
          }}
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-brand/20 bg-ink/80 px-3 py-2 font-mono text-xs text-muted transition hover:border-brand/50 hover:text-fg"
        >
          <span className="flex items-center gap-2">
            <Search size={13} className="text-brand" /> Quick command...
          </span>
          <kbd className="rounded border border-brand/25 bg-ink-2 px-1.5 py-0.5 text-[10px]">
            ⌘K
          </kbd>
        </button>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto p-3" aria-label="Admin sections">
        {NAV_GROUPS.map((groupName) => (
          <div key={groupName}>
            <p className="mb-1.5 px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted/70">
              {groupName}
            </p>
            <div className="space-y-0.5">
              {NAV_ITEMS.filter((n) => n.group === groupName).map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                const count = getCountBadge(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    className={`relative flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      active ? "font-semibold text-brand" : "text-muted hover:bg-brand/5 hover:text-fg"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="admin-active-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 -z-10 rounded-xl border border-brand/40 bg-brand/15 shadow-glow"
                      />
                    )}
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Icon size={16} />
                      <span className="truncate">{item.label}</span>
                    </span>
                    {count !== null && (
                      <span
                        className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
                          active ? "bg-brand text-ink-3 font-bold" : "bg-ink text-muted"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-brand/15 p-3">
        <div className="rounded-xl border border-brand/15 bg-ink/90 p-3">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.profile.photo}
              alt={data.profile.name}
              className="h-9 w-9 shrink-0 rounded-lg border border-brand/30 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-mono text-[11px] font-semibold text-fg">
                {data.profile.name}
              </p>
              <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] text-muted">
                {activeOption && <StatusDot color={activeOption.color} />}
                <span className="truncate">{activeOption?.label}</span>
              </div>
            </div>
          </div>
          <p className="mt-2 truncate font-mono text-[10px] text-muted/80">{userEmail}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 py-1.5 font-mono text-xs text-red-300 transition hover:border-red-400 hover:bg-red-500/20"
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative z-10 flex min-h-screen w-full max-w-full overflow-x-clip">
      {/* Ambient Emerald Aurora */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-40 right-1/4 -z-10 h-96 w-96 rounded-full bg-brand/[0.08] blur-[130px]"
      />

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-brand/15 bg-ink-2/85 backdrop-blur-xl lg:sticky lg:top-0 lg:block lg:h-screen">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm lg:hidden"
            onMouseDown={(e) => e.target === e.currentTarget && setSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
              className="h-full w-72 max-w-[85vw] border-r border-brand/25 bg-ink-2 shadow-glow"
            >
              {SidebarContent}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-2 border-b border-brand/15 bg-ink/85 px-3.5 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-brand/30 p-2 text-brand lg:hidden"
              aria-label="Open admin menu"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-sm font-bold text-fg sm:text-lg">
                  {currentNav.label}
                </h1>
                <span className="hidden rounded-full border border-brand/25 bg-brand/10 px-2 py-0.5 font-mono text-[10px] text-brand sm:inline-flex">
                  {storageBackend === "mongodb"
                    ? "MongoDB"
                    : storageBackend === "redis"
                      ? "Redis"
                      : "Local JSON"}
                </span>
              </div>
              <p className="hidden font-mono text-[10px] text-muted sm:block">
                Omor Portfolio OS · Live Sync Enabled
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              aria-label="Open command palette"
              className="inline-flex items-center gap-1.5 rounded-xl border border-brand/25 bg-ink-2 px-2.5 py-1.5 font-mono text-xs text-muted transition hover:border-brand hover:text-fg sm:px-3"
            >
              <Command size={13} className="text-brand" />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden rounded border border-brand/20 bg-ink px-1 py-0.5 text-[10px] sm:inline">
                ⌘K
              </kbd>
            </button>

            {activeOption && (
              <button
                type="button"
                onClick={() => handleNavigate("status")}
                className="hidden items-center gap-2 rounded-full border border-brand/25 bg-ink-2 px-3 py-1.5 font-mono text-xs text-muted transition hover:border-brand hover:text-fg xl:inline-flex"
              >
                <StatusDot color={activeOption.color} />
                <span className="max-w-[120px] truncate">{activeOption.label}</span>
              </button>
            )}

            <Link
              href="/projects"
              target="_blank"
              className="btn-ghost hidden !rounded-xl !px-3 !py-1.5 font-mono !text-xs sm:inline-flex"
            >
              Projects <ExternalLink size={12} />
            </Link>
            <Link
              href="/"
              target="_blank"
              className="btn-primary !rounded-xl !px-2.5 !py-1.5 font-mono !text-[11px] sm:!px-3 sm:!text-xs"
            >
              Live <ExternalLink size={12} />
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-3.5 pb-24 pt-5 sm:p-6 lg:p-8 lg:pb-12">
          {usingDefaultPassword && activeTab !== "settings" && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
              <div className="flex min-w-0 items-center gap-2.5">
                <ShieldAlert size={16} className="shrink-0 text-amber-400" />
                <span className="min-w-0">
                  Using default password. Update it in Settings before sharing publicly.
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleNavigate("settings")}
                className="rounded-lg border border-amber-400/40 bg-amber-500/15 px-3 py-1 font-mono text-[11px] font-semibold text-amber-200 hover:bg-amber-500/25"
              >
                Secure Now →
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="min-w-0"
            >
              {activeTab === "overview" && (
                <OverviewTab
                  data={data}
                  storageBackend={storageBackend}
                  usingDefaultPassword={usingDefaultPassword}
                  onNavigate={handleNavigate}
                  onEditProject={handleEditProject}
                  onQuickStatusChange={handleQuickStatusChange}
                  onOpenCommandPalette={() => setCmdOpen(true)}
                  savingStatus={savingStatus}
                />
              )}

              {activeTab === "projects" && (
                <ProjectsTab
                  data={data}
                  onDataChange={handleDataChange}
                  onNotify={notify}
                  initialOpenNew={pendingOpenNew === "projects"}
                  onConsumeOpenNew={() => setPendingOpenNew(null)}
                  initialEditProjectId={pendingEditProjectId}
                  onConsumeEditProjectId={() => setPendingEditProjectId(null)}
                />
              )}

              {activeTab === "status" && (
                <StatusTab
                  data={data}
                  onDataChange={handleDataChange}
                  onNotify={notify}
                  initialOpenNew={pendingOpenNew === "status"}
                  onConsumeOpenNew={() => setPendingOpenNew(null)}
                />
              )}

              {activeTab === "experience" && (
                <ExperienceTab
                  data={data}
                  onDataChange={handleDataChange}
                  onNotify={notify}
                  initialOpenNew={pendingOpenNew === "experience"}
                  onConsumeOpenNew={() => setPendingOpenNew(null)}
                />
              )}

              {activeTab === "profile" && (
                <ProfileTab data={data} onDataChange={handleDataChange} onNotify={notify} />
              )}

              {activeTab === "skills" && (
                <SkillsTab data={data} onDataChange={handleDataChange} onNotify={notify} />
              )}

              {activeTab === "education" && (
                <EducationTab data={data} onDataChange={handleDataChange} onNotify={notify} />
              )}

              {activeTab === "services" && (
                <ServicesTab data={data} onDataChange={handleDataChange} onNotify={notify} />
              )}

              {activeTab === "socials" && (
                <SocialsTab data={data} onDataChange={handleDataChange} onNotify={notify} />
              )}

              {activeTab === "settings" && (
                <SettingsTab
                  data={data}
                  storageBackend={storageBackend}
                  usingDefaultPassword={usingDefaultPassword}
                  onPasswordChanged={onPasswordChanged}
                  onDataChange={handleDataChange}
                  onNotify={notify}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Native-Style Bottom Floating Dock */}
      <nav
        aria-label="Mobile quick navigation"
        className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 gap-1 rounded-2xl border border-brand/25 bg-ink-2/90 p-1.5 shadow-glow backdrop-blur-xl lg:hidden"
      >
        {MOBILE_DOCK_TABS.map((tabId) => {
          const item = NAV_ITEMS.find((n) => n.id === tabId)!;
          const Icon = item.icon;
          const active = activeTab === tabId;
          return (
            <button
              key={tabId}
              type="button"
              onClick={() => handleNavigate(tabId)}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-2 font-mono text-[10px] transition ${
                active ? "bg-brand/20 font-semibold text-brand" : "text-muted hover:text-fg"
              }`}
            >
              <Icon size={16} />
              <span className="truncate">{item.shortLabel}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-2 font-mono text-[10px] transition ${
            !MOBILE_DOCK_TABS.includes(activeTab)
              ? "bg-brand/20 font-semibold text-brand"
              : "text-muted hover:text-fg"
          }`}
        >
          <Menu size={16} />
          <span>More</span>
        </button>
      </nav>

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        data={data}
        onNavigate={handleNavigate}
        onEditProject={handleEditProject}
        onQuickStatusChange={handleQuickStatusChange}
        onExportJson={handleExportJson}
      />

      <ToastViewport
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}
