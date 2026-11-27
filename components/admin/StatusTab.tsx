"use client";
import { useEffect, useState } from "react";
import { Activity, Check, Code2, Eye, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { slugify } from "@/lib/default-data";
import { StatusDot } from "@/components/StatusDropdown";
import { adminFetch } from "./api";
import { ConfirmModal, inputCls, labelCls } from "./ui";
import type { AvailabilityOption, PortfolioData } from "@/types/portfolio";

const COLOR_PRESETS = [
  "#22C55E",
  "#10B981",
  "#38BDF8",
  "#EAB308",
  "#F97316",
  "#EC4899",
  "#A855F7",
  "#6B7280",
  "#EF4444",
];

type StatusDraft = {
  originalId?: string;
  label: string;
  code: string;
  color: string;
  note: string;
};

const emptyStatus = (): StatusDraft => ({
  label: "",
  code: "",
  color: "#22C55E",
  note: "",
});

export default function StatusTab({
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
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<StatusDraft | null>(null);
  const [codeTouched, setCodeTouched] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AvailabilityOption | null>(null);

  const [heroStatus, setHeroStatus] = useState(data.profile.status);
  const [heroSubtitle, setHeroSubtitle] = useState(data.profile.statusSubtitle);
  const [heroBadge, setHeroBadge] = useState(data.profile.heroBadge);
  const [portfolioVersion, setPortfolioVersion] = useState(data.profile.portfolioVersion);
  const [savingHero, setSavingHero] = useState(false);

  useEffect(() => {
    setHeroStatus(data.profile.status);
    setHeroSubtitle(data.profile.statusSubtitle);
    setHeroBadge(data.profile.heroBadge);
    setPortfolioVersion(data.profile.portfolioVersion);
  }, [data.profile]);

  useEffect(() => {
    if (initialOpenNew) {
      setEditing(emptyStatus());
      setCodeTouched(false);
      onConsumeOpenNew?.();
    }
  }, [initialOpenNew, onConsumeOpenNew]);

  const activeOption =
    data.availability.options.find((o) => o.id === data.availability.status) ??
    data.availability.options[0];

  const previewStatus = editing
    ? {
        label: editing.label || "Custom Status",
        code: editing.code || "custom_status",
        color: editing.color,
        note: editing.note,
      }
    : activeOption;

  const setActiveStatus = async (statusId: string) => {
    setSaving(true);
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
      onDataChange(updated);
      const chosen = updated.availability.options.find((o) => o.id === statusId);
      onNotify("success", `Live status switched to "${chosen?.label ?? statusId}".`);
    } catch (err) {
      onNotify("error", err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !editing.label.trim()) return;
    setSaving(true);
    try {
      const nextCode =
        editing.code.trim() || slugify(editing.label).replace(/-/g, "_") || "custom_status";
      let nextOptions: AvailabilityOption[];
      let nextActiveStatus = data.availability.status;

      if (editing.originalId) {
        nextOptions = data.availability.options.map((opt) =>
          opt.id === editing.originalId
            ? {
                ...opt,
                label: editing.label.trim(),
                code: nextCode,
                color: editing.color,
                note: editing.note.trim(),
              }
            : opt
        );
      } else {
        const newId = slugify(editing.label) || `status-${Date.now()}`;
        const newOption: AvailabilityOption = {
          id: newId,
          label: editing.label.trim(),
          code: nextCode,
          color: editing.color,
          note: editing.note.trim(),
        };
        nextOptions = [...data.availability.options, newOption];
        nextActiveStatus = newOption.id;
      }

      const updated = await adminFetch<PortfolioData>("/api/portfolio", {
        method: "PUT",
        body: JSON.stringify({
          availability: {
            status: nextActiveStatus,
            options: nextOptions,
          },
        }),
      });
      onDataChange(updated);
      onNotify(
        "success",
        editing.originalId
          ? `Updated status "${editing.label}".`
          : `Added and activated status "${editing.label}"!`
      );
      setEditing(null);
    } catch (err) {
      onNotify("error", err instanceof Error ? err.message : "Failed to save status.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    if (data.availability.options.length <= 1) {
      onNotify("error", "You must keep at least one availability status.");
      setDeleteTarget(null);
      return;
    }
    setSaving(true);
    try {
      const remaining = data.availability.options.filter((o) => o.id !== deleteTarget.id);
      const nextStatus =
        data.availability.status === deleteTarget.id
          ? remaining[0].id
          : data.availability.status;

      const updated = await adminFetch<PortfolioData>("/api/portfolio", {
        method: "PUT",
        body: JSON.stringify({
          availability: {
            status: nextStatus,
            options: remaining,
          },
        }),
      });
      onDataChange(updated);
      onNotify("success", `Removed status "${deleteTarget.label}".`);
      setDeleteTarget(null);
    } catch (err) {
      onNotify("error", err instanceof Error ? err.message : "Failed to delete status.");
    } finally {
      setSaving(false);
    }
  };

  const saveHeroStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingHero(true);
    try {
      const updated = await adminFetch<PortfolioData>("/api/portfolio", {
        method: "PUT",
        body: JSON.stringify({
          profile: {
            ...data.profile,
            status: heroStatus.trim(),
            statusSubtitle: heroSubtitle.trim(),
            heroBadge: heroBadge.trim(),
            portfolioVersion: portfolioVersion.trim(),
          },
        }),
      });
      onDataChange(updated);
      onNotify("success", "Updated hero status & badges!");
    } catch (err) {
      onNotify("error", err instanceof Error ? err.message : "Failed to update hero status.");
    } finally {
      setSavingHero(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card flex flex-col justify-between gap-4 border-brand/30 p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-fg">
            <Activity size={18} className="text-brand" /> Live Status Studio
          </h2>
          <p className="mt-1 text-xs text-muted">
            Switch active status or design custom status badges — updates across Navbar, Hero, About, Terminal, CodeEditor &amp; Contact.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(emptyStatus());
            setCodeTouched(false);
          }}
          className="btn-primary shrink-0 !rounded-xl font-mono !text-xs shadow-glow"
        >
          <Plus size={16} /> Add Custom Status
        </button>
      </div>

      {/* Live Preview Stage */}
      <div className="glass-card overflow-hidden border-brand/25 p-5 sm:p-6">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-brand">
          <Eye size={13} /> Live Portfolio Preview {editing ? "(Drafting)" : "(Active)"}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {/* Navbar + Hero Badge preview */}
          <div className="rounded-xl border border-brand/15 bg-ink p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
              Navbar &amp; Hero Badges
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-ink-2 px-3 py-1.5 font-mono text-xs text-fg">
                <StatusDot color={previewStatus?.color ?? "#22C55E"} />
                {previewStatus?.label}
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-brand/20 bg-ink-2 px-3 py-1.5 font-mono text-xs text-muted">
                <StatusDot color={previewStatus?.color ?? "#22C55E"} />
                <span className="text-fg">{previewStatus?.label}</span>
                <span className="text-brand">/</span>
                <span>{previewStatus?.code}</span>
              </span>
            </div>
            {previewStatus?.note && (
              <p className="mt-3 text-xs leading-relaxed text-muted">{previewStatus.note}</p>
            )}
          </div>

          {/* Hero CURRENTLY card preview */}
          <div className="rounded-xl border border-brand/15 bg-ink p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-ink-2 px-2.5 py-0.5 font-mono text-[10px] uppercase text-muted">
                <Code2 size={11} className="text-brand" /> {heroBadge || "Full stack developer"}
              </span>
              <span className="rounded-full border border-brand/20 bg-brand/10 px-2.5 py-0.5 font-mono text-[10px] text-brand">
                {portfolioVersion || "PORTFOLIO v1.0"}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.profile.photo}
                alt={data.profile.name}
                className="h-11 w-11 shrink-0 rounded-xl border border-brand/30 object-cover"
              />
              <div className="min-w-0">
                <p className="font-mono text-[10px] text-muted">CURRENTLY</p>
                <p className="truncate text-sm font-semibold text-fg">
                  {heroStatus || "Computer Science & Technology Student"}
                </p>
                <p className="truncate text-xs text-muted">
                  {heroSubtitle || "Learning by building real projects"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Status Form */}
      {editing && (
        <form onSubmit={handleSaveOption} className="glass-card border-brand/45 p-6 shadow-glow">
          <div className="flex items-center justify-between border-b border-brand/15 pb-4">
            <h3 className="text-base font-bold text-fg">
              {editing.originalId ? "Edit Status Option" : "Create New Custom Status"}
            </h3>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-md border border-brand/20 p-2 text-muted hover:text-fg"
            >
              <X size={15} />
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelCls}>Status Label *</label>
              <input
                type="text"
                required
                value={editing.label}
                onChange={(e) => {
                  const label = e.target.value;
                  setEditing((prev) =>
                    prev
                      ? {
                          ...prev,
                          label,
                          code: codeTouched ? prev.code : slugify(label).replace(/-/g, "_"),
                        }
                      : null
                  );
                }}
                placeholder="e.g. Open for Internship"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Code Tag (monospace badge)</label>
              <input
                type="text"
                value={editing.code}
                onChange={(e) => {
                  setCodeTouched(true);
                  setEditing((prev) => (prev ? { ...prev, code: e.target.value } : null));
                }}
                placeholder="open_for_internship"
                className={`${inputCls} font-mono text-xs`}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelCls}>Indicator Glow Color</label>
              <div className="flex flex-wrap items-center gap-2">
                {COLOR_PRESETS.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => setEditing((prev) => (prev ? { ...prev, color: hex } : null))}
                    aria-label={`Select color ${hex}`}
                    className={`h-8 w-8 rounded-full border-2 transition ${
                      editing.color.toLowerCase() === hex.toLowerCase()
                        ? "scale-110 border-white"
                        : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                    style={{ background: hex, boxShadow: `0 0 12px ${hex}66` }}
                  />
                ))}
                <input
                  type="color"
                  value={editing.color}
                  onChange={(e) =>
                    setEditing((prev) => (prev ? { ...prev, color: e.target.value } : null))
                  }
                  className="h-8 w-10 cursor-pointer rounded border border-brand/25 bg-ink p-0.5"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={labelCls}>Availability Note (shown in Navbar status popover)</label>
              <input
                type="text"
                value={editing.note}
                onChange={(e) =>
                  setEditing((prev) => (prev ? { ...prev, note: e.target.value } : null))
                }
                placeholder="e.g. Available for remote full-stack internships & freelance projects."
                className={inputCls}
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2.5 border-t border-brand/15 pt-4">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="btn-ghost !rounded-xl !px-4 !py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary !rounded-xl !px-5 !py-2 font-mono shadow-glow"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {editing.originalId ? "Save Status" : "Add & Activate"}
            </button>
          </div>
        </form>
      )}

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {data.availability.options.map((opt) => {
          const isActive = opt.id === data.availability.status;
          return (
            <div
              key={opt.id}
              className={`glass-card flex flex-col justify-between gap-4 p-5 transition ${
                isActive ? "border-brand bg-brand/[0.08] shadow-glow" : "border-brand/20"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <StatusDot color={opt.color} />
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold text-fg">{opt.label}</h3>
                      <p className="truncate font-mono text-xs text-muted">{opt.code}</p>
                    </div>
                  </div>
                  {isActive && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-ink-3">
                      <Check size={12} /> Active
                    </span>
                  )}
                </div>
                {opt.note && (
                  <p className="mt-3 text-xs leading-relaxed text-muted">{opt.note}</p>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-brand/15 pt-3">
                <button
                  type="button"
                  disabled={saving || isActive}
                  onClick={() => setActiveStatus(opt.id)}
                  className={`rounded-lg px-3.5 py-1.5 font-mono text-xs font-semibold transition ${
                    isActive
                      ? "cursor-default bg-brand/15 text-brand"
                      : "bg-brand text-ink-3 hover:bg-brand-600"
                  }`}
                >
                  {isActive ? "Currently Active" : "Set as Active"}
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing({
                        originalId: opt.id,
                        label: opt.label,
                        code: opt.code,
                        color: opt.color,
                        note: opt.note ?? "",
                      });
                      setCodeTouched(true);
                    }}
                    title="Edit status"
                    className="rounded-lg border border-brand/20 bg-ink p-2 text-muted hover:border-brand hover:text-fg"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={data.availability.options.length <= 1}
                    onClick={() => setDeleteTarget(opt)}
                    title="Delete status"
                    className="rounded-lg border border-red-500/25 bg-red-500/5 p-2 text-red-400 hover:border-red-400 disabled:opacity-30"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hero Headline Editor */}
      <form onSubmit={saveHeroStatus} className="glass-card p-6">
        <h3 className="text-base font-bold text-fg">Hero &amp; Profile Status Headline</h3>
        <p className="mt-0.5 text-xs text-muted">
          Updates live in the preview above and across your Hero, Footer, Resume, and Terminal.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls}>Current Status Headline</label>
            <input
              type="text"
              value={heroStatus}
              onChange={(e) => setHeroStatus(e.target.value)}
              placeholder="Computer Science & Technology Student"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Status Subtitle</label>
            <input
              type="text"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              placeholder="Learning by building real projects"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Hero Top Badge</label>
            <input
              type="text"
              value={heroBadge}
              onChange={(e) => setHeroBadge(e.target.value)}
              placeholder="Full stack developer"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Portfolio Version Pill</label>
            <input
              type="text"
              value={portfolioVersion}
              onChange={(e) => setPortfolioVersion(e.target.value)}
              placeholder="PORTFOLIO v1.0"
              className={`${inputCls} font-mono text-xs`}
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={savingHero}
            className="btn-primary !rounded-xl !px-5 !py-2.5 font-mono shadow-glow"
          >
            {savingHero ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Save Headline Status
          </button>
        </div>
      </form>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title={`Delete "${deleteTarget?.label}" status?`}
        description="If this status is currently active, another status will automatically be selected."
        confirmLabel="Delete Status"
        busy={saving}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
