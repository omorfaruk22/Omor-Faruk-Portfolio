"use client";
import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  Briefcase,
  Code2,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
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

const NAV_ITEMS: {
  id: AdminTabId;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "status", label: "Status", icon: Activity },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "profile", label: "Profile & About", icon: User },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "services", label: "Services", icon: Wrench },
  { id: "socials", label: "Social Links", icon: Share2 },
  { id: "settings", label: "Settings", icon: Settings },
];

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [savingStatus, setSavingStatus] = useState(false);

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
        <Link href="/" className="font-mono text-sm font-bold text-brand">
          &lt;{data.profile.name}/&gt;
          <span className="ml-2 rounded border border-brand/30 bg-brand/10 px-1.5 py-0.5 text-[10px] uppercase">
            Admin
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

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin sections">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          const count = getCountBadge(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigate(item.id)}
              className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-left text-sm transition ${
                active
                  ? "border border-brand/40 bg-brand/15 font-semibold text-brand shadow-glow"
                  : "border border-transparent text-muted hover:bg-brand/5 hover:text-fg"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon size={16} />
                {item.label}
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
      </nav>

      <div className="border-t border-brand/15 p-3">
        <div className="rounded-xl border border-brand/15 bg-ink p-3">
          <p className="truncate font-mono text-[11px] text-fg">{userEmail}</p>
          <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[10px] text-muted">
            {activeOption && <StatusDot color={activeOption.color} />}
            <span className="truncate">{activeOption?.label}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 py-1.5 font-mono text-xs text-red-300 transition hover:border-red-400 hover:bg-red-500/20"
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative z-10 flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-brand/15 bg-ink-2/90 backdrop-blur lg:sticky lg:top-0 lg:block lg:h-screen">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm lg:hidden"
          onMouseDown={(e) => e.target === e.currentTarget && setSidebarOpen(false)}
        >
          <aside className="h-full w-72 border-r border-brand/20 bg-ink-2 shadow-glow">
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-brand/15 bg-ink/85 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-md border border-brand/30 p-2 text-brand lg:hidden"
              aria-label="Open admin menu"
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="text-base font-bold text-fg sm:text-lg">{currentNav.label}</h1>
              <p className="hidden font-mono text-[11px] text-muted sm:block">
                Portfolio Control Center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeOption && (
              <button
                type="button"
                onClick={() => handleNavigate("status")}
                className="hidden items-center gap-2 rounded-full border border-brand/25 bg-ink-2 px-3 py-1.5 font-mono text-xs text-muted transition hover:border-brand hover:text-fg md:inline-flex"
              >
                <StatusDot color={activeOption.color} />
                <span>{activeOption.label}</span>
              </button>
            )}
            <Link
              href="/projects"
              target="_blank"
              className="btn-ghost !px-3 !py-1.5 font-mono !text-xs"
            >
              Projects <ExternalLink size={13} />
            </Link>
            <Link
              href="/"
              target="_blank"
              className="btn-primary !px-3 !py-1.5 font-mono !text-xs"
            >
              Live Site <ExternalLink size={13} />
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6 lg:p-8">
          {usingDefaultPassword && activeTab !== "settings" && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
              <div className="flex items-center gap-2.5">
                <ShieldAlert size={16} className="shrink-0 text-amber-400" />
                <span>
                  You are using the default development password. Update it in Settings before deploying publicly.
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleNavigate("settings")}
                className="rounded-md border border-amber-400/40 bg-amber-500/15 px-3 py-1 font-mono text-[11px] font-semibold text-amber-200 hover:bg-amber-500/25"
              >
                Change Password →
              </button>
            </div>
          )}

          {activeTab === "overview" && (
            <OverviewTab
              data={data}
              storageBackend={storageBackend}
              onNavigate={handleNavigate}
              onQuickStatusChange={handleQuickStatusChange}
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
        </main>
      </div>

      <ToastViewport
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}
