"use client";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Briefcase, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { adminFetch } from "./api";
import { ConfirmModal, StringListEditor, TagInput, inputCls, labelCls } from "./ui";
import type { ExperienceItem, PortfolioData } from "@/types/portfolio";

type ExpDraft = Omit<ExperienceItem, "id"> & { id?: string };

const emptyExp = (): ExpDraft => ({
  company: "",
  position: "",
  duration: "",
  location: "",
  responsibilities: [],
  technologies: [],
});

export default function ExperienceTab({
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
  const [editing, setEditing] = useState<ExpDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ExperienceItem | null>(null);

  useEffect(() => {
    if (initialOpenNew) {
      setEditing(emptyExp());
      onConsumeOpenNew?.();
    }
  }, [initialOpenNew, onConsumeOpenNew]);

  const persistList = async (nextList: ExperienceItem[], successMessage: string) => {
    setSaving(true);
    try {
      const updated = await adminFetch<PortfolioData>("/api/portfolio", {
        method: "PUT",
        body: JSON.stringify({ experience: nextList }),
      });
      onDataChange(updated);
      onNotify("success", successMessage);
      return true;
    } catch (err) {
      onNotify("error", err instanceof Error ? err.message : "Failed to save experience.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editing.company.trim() || !editing.position.trim()) {
      onNotify("error", "Company and position are required.");
      return;
    }

    const entry: ExperienceItem = {
      id: editing.id || `exp-${Date.now()}`,
      company: editing.company.trim(),
      position: editing.position.trim(),
      duration: editing.duration.trim(),
      location: editing.location?.trim() || "",
      responsibilities: editing.responsibilities.filter(Boolean),
      technologies: editing.technologies.filter(Boolean),
    };

    const nextList = editing.id
      ? data.experience.map((item) => (item.id === editing.id ? entry : item))
      : [entry, ...data.experience];

    const ok = await persistList(
      nextList,
      editing.id ? `Updated "${entry.position}".` : `Added "${entry.position}" at ${entry.company}!`
    );
    if (ok) setEditing(null);
  };

  const reorder = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= data.experience.length) return;
    const next = [...data.experience];
    [next[index], next[target]] = [next[target], next[index]];
    await persistList(next, "Updated experience order.");
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const next = data.experience.filter((item) => item.id !== deleteTarget.id);
    const ok = await persistList(next, `Deleted "${deleteTarget.position}".`);
    if (ok) setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="card flex flex-col justify-between gap-4 border-brand/25 p-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="flex items-center gap-2 text-lg font-bold text-fg">
              <Briefcase size={18} className="text-brand" /> Experience Manager
            </h2>
            <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 font-mono text-xs text-brand">
              {data.experience.length} entries
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">
            Add internships, freelance engagements, or jobs. Entries appear immediately in the Experience timeline &amp; Resume modal.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(emptyExp())}
          className="btn-primary shrink-0 font-mono !text-xs"
        >
          <Plus size={16} /> Add Experience
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="card border-brand/40 p-6 shadow-glow">
          <div className="flex items-center justify-between border-b border-brand/15 pb-4">
            <h3 className="text-base font-bold text-fg">
              {editing.id ? "Edit Experience" : "New Experience Entry"}
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
              <label className={labelCls}>Position / Role *</label>
              <input
                type="text"
                required
                value={editing.position}
                onChange={(e) =>
                  setEditing((prev) => (prev ? { ...prev, position: e.target.value } : null))
                }
                placeholder="e.g. Junior Full Stack Developer"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Company / Organization *</label>
              <input
                type="text"
                required
                value={editing.company}
                onChange={(e) =>
                  setEditing((prev) => (prev ? { ...prev, company: e.target.value } : null))
                }
                placeholder="e.g. TechStudio BD"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Duration *</label>
              <input
                type="text"
                required
                value={editing.duration}
                onChange={(e) =>
                  setEditing((prev) => (prev ? { ...prev, duration: e.target.value } : null))
                }
                placeholder="e.g. Jan 2026 – Present"
                className={`${inputCls} font-mono text-xs`}
              />
            </div>

            <div>
              <label className={labelCls}>Location / Work Type (optional)</label>
              <input
                type="text"
                value={editing.location ?? ""}
                onChange={(e) =>
                  setEditing((prev) => (prev ? { ...prev, location: e.target.value } : null))
                }
                placeholder="e.g. Remote · Freelance"
                className={inputCls}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelCls}>Key Responsibilities</label>
              <StringListEditor
                items={editing.responsibilities}
                onChange={(responsibilities) =>
                  setEditing((prev) => (prev ? { ...prev, responsibilities } : null))
                }
                placeholder="Describe a key responsibility or achievement..."
                addLabel="Add point"
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelCls}>Technologies Used</label>
              <TagInput
                values={editing.technologies}
                onChange={(technologies) =>
                  setEditing((prev) => (prev ? { ...prev, technologies } : null))
                }
                placeholder="Next.js, Node.js, MongoDB, Tailwind CSS..."
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2.5 border-t border-brand/15 pt-4">
            <button
              type="button"
              disabled={saving}
              onClick={() => setEditing(null)}
              className="btn-ghost !px-4 !py-2"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary !px-5 !py-2 font-mono">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {editing.id ? "Save Changes" : "Add Experience"}
            </button>
          </div>
        </form>
      )}

      {data.experience.length === 0 ? (
        <div className="card border-dashed p-10 text-center">
          <Briefcase size={30} className="mx-auto text-brand/70" />
          <h3 className="mt-3 text-base font-semibold text-fg">No experience added yet</h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-muted">
            Your portfolio currently displays the animated &quot;coming soon&quot; badge. Add your first role, freelance project, or internship to reveal your experience timeline.
          </p>
          <button
            type="button"
            onClick={() => setEditing(emptyExp())}
            className="btn-primary mt-5 font-mono !text-xs"
          >
            <Plus size={15} /> Add First Experience
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.experience.map((exp, index) => (
            <div key={exp.id} className="card border-brand/20 p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-brand">{exp.duration}</span>
                    {exp.location && (
                      <span className="rounded-full border border-brand/20 bg-ink px-2 py-0.5 font-mono text-[10px] text-muted">
                        {exp.location}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-fg">{exp.position}</h3>
                  <p className="text-sm text-muted">{exp.company}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={saving || index === 0}
                    onClick={() => reorder(index, -1)}
                    aria-label="Move up"
                    className="rounded-md border border-brand/20 bg-ink p-2 text-muted hover:border-brand hover:text-fg disabled:opacity-30"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={saving || index === data.experience.length - 1}
                    onClick={() => reorder(index, 1)}
                    aria-label="Move down"
                    className="rounded-md border border-brand/20 bg-ink p-2 text-muted hover:border-brand hover:text-fg disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing({ ...exp })}
                    title="Edit experience"
                    className="rounded-md border border-brand/20 bg-ink p-2 text-muted hover:border-brand hover:text-fg"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(exp)}
                    title="Delete experience"
                    className="rounded-md border border-red-500/25 bg-red-500/5 p-2 text-red-400 hover:border-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {exp.responsibilities.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                  {exp.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}

              {exp.technologies.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {exp.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-brand/20 bg-brand/[0.04] px-2 py-0.5 font-mono text-[11px] text-fg"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title={`Delete "${deleteTarget?.position}"?`}
        description={`This removes your role at ${deleteTarget?.company} from your portfolio and resume modal.`}
        confirmLabel="Delete Experience"
        busy={saving}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
