"use client";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Code2, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { adminFetch } from "./api";
import { TagInput, inputCls, labelCls } from "./ui";
import type { PortfolioData, SkillGroup } from "@/types/portfolio";

export default function SkillsTab({
  data,
  onDataChange,
  onNotify,
}: {
  data: PortfolioData;
  onDataChange: (next: PortfolioData) => void;
  onNotify: (type: "success" | "error" | "info", text: string) => void;
}) {
  const [groups, setGroups] = useState<SkillGroup[]>(data.skills);
  const [newGroupName, setNewGroupName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setGroups(data.skills);
  }, [data.skills]);

  const addGroup = () => {
    const clean = newGroupName.trim();
    if (!clean) return;
    setGroups((prev) => [
      ...prev,
      { id: `skill-${Date.now()}`, group: clean, items: [] },
    ]);
    setNewGroupName("");
  };

  const updateGroup = (index: number, patch: Partial<SkillGroup>) => {
    setGroups((prev) => prev.map((g, i) => (i === index ? { ...g, ...patch } : g)));
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= groups.length) return;
    setGroups((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removeGroup = (index: number) => {
    setGroups((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await adminFetch<PortfolioData>("/api/portfolio", {
        method: "PUT",
        body: JSON.stringify({ skills: groups }),
      });
      onDataChange(updated);
      onNotify("success", "Skills saved successfully!");
    } catch (err) {
      onNotify("error", err instanceof Error ? err.message : "Failed to save skills.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card flex flex-col justify-between gap-4 border-brand/25 p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-fg">
            <Code2 size={18} className="text-brand" /> Skills Manager
          </h2>
          <p className="mt-1 text-xs text-muted">
            Organize skill categories and add or remove technologies. Click &quot;Save Skills&quot; when done.
          </p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="btn-primary shrink-0 font-mono !text-xs"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Save Skills
        </button>
      </div>

      {/* Add new skill group */}
      <div className="glass-card p-5">
        <label className={labelCls}>Add New Skill Category</label>
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addGroup();
              }
            }}
            placeholder="e.g. DevOps & Cloud, Mobile, AI / ML..."
            className={`${inputCls} flex-1`}
          />
          <button
            type="button"
            onClick={addGroup}
            className="btn-ghost shrink-0 font-mono !text-xs"
          >
            <Plus size={15} /> Add Category
          </button>
        </div>
      </div>

      {/* Groups */}
      <div className="space-y-4">
        {groups.map((group, idx) => (
          <div key={group.id} className="glass-card border-brand/20 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={group.group}
                onChange={(e) => updateGroup(idx, { group: e.target.value })}
                className={`${inputCls} max-w-xs font-mono text-xs font-semibold uppercase tracking-wider text-brand`}
              />
              <span className="font-mono text-xs text-muted">{group.items.length} skills</span>
              <div className="ml-auto flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => move(idx, -1)}
                  aria-label="Move category up"
                  className="rounded-md border border-brand/20 bg-ink p-2 text-muted hover:border-brand hover:text-fg disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  disabled={idx === groups.length - 1}
                  onClick={() => move(idx, 1)}
                  aria-label="Move category down"
                  className="rounded-md border border-brand/20 bg-ink p-2 text-muted hover:border-brand hover:text-fg disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => removeGroup(idx)}
                  aria-label={`Delete ${group.group}`}
                  className="rounded-md border border-red-500/25 bg-red-500/5 p-2 text-red-400 hover:border-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="mt-3">
              <TagInput
                values={group.items}
                onChange={(items) => updateGroup(idx, { items })}
                placeholder={`Add skill to ${group.group}...`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="btn-primary !px-6 !py-3 font-mono"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save All Skills
        </button>
      </div>
    </div>
  );
}
