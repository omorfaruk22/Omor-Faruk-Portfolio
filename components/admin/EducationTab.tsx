"use client";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, GraduationCap, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { adminFetch } from "./api";
import { inputCls, labelCls } from "./ui";
import type { EducationItem, PortfolioData } from "@/types/portfolio";

export default function EducationTab({
  data,
  onDataChange,
  onNotify,
}: {
  data: PortfolioData;
  onDataChange: (next: PortfolioData) => void;
  onNotify: (type: "success" | "error" | "info", text: string) => void;
}) {
  const [items, setItems] = useState<EducationItem[]>(data.profile.education);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setItems(data.profile.education);
  }, [data.profile.education]);

  const addEntry = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `edu-${Date.now()}`,
        title: "",
        place: "",
        period: "",
        note: "Completed",
        current: false,
      },
    ]);
  };

  const update = (idx: number, patch: Partial<EducationItem>) => {
    setItems((prev) => prev.map((e, i) => (i === idx ? { ...e, ...patch } : e)));
  };

  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const remove = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await adminFetch<PortfolioData>("/api/portfolio", {
        method: "PUT",
        body: JSON.stringify({
          profile: {
            ...data.profile,
            education: items,
          },
        }),
      });
      onDataChange(updated);
      onNotify("success", "Education timeline updated!");
    } catch (err) {
      onNotify("error", err instanceof Error ? err.message : "Failed to save education.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card flex flex-col justify-between gap-4 border-brand/25 p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-fg">
            <GraduationCap size={18} className="text-brand" /> Education Manager
          </h2>
          <p className="mt-1 text-xs text-muted">
            Manage degrees, diplomas, certifications, and your active study indicator.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={addEntry} className="btn-ghost font-mono !text-xs">
            <Plus size={15} /> Add Entry
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="btn-primary font-mono !text-xs"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Save
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((edu, idx) => (
          <div key={edu.id} className="glass-card border-brand/20 p-5">
            <div className="flex items-center justify-between gap-2 border-b border-brand/10 pb-3">
              <span className="font-mono text-xs text-brand">Entry #{idx + 1}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => move(idx, -1)}
                  className="rounded-md border border-brand/20 bg-ink p-1.5 text-muted hover:text-fg disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  disabled={idx === items.length - 1}
                  onClick={() => move(idx, 1)}
                  className="rounded-md border border-brand/20 bg-ink p-1.5 text-muted hover:text-fg disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="rounded-md border border-red-500/25 bg-red-500/5 p-1.5 text-red-400 hover:border-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelCls}>Degree / Certificate Title *</label>
                <input
                  type="text"
                  value={edu.title}
                  onChange={(e) => update(idx, { title: e.target.value })}
                  placeholder="Diploma in Engineering CST"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Institution / School</label>
                <input
                  type="text"
                  value={edu.place}
                  onChange={(e) => update(idx, { place: e.target.value })}
                  placeholder="Cox's Bazar Polytechnic Institute"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Session / Period</label>
                <input
                  type="text"
                  value={edu.period}
                  onChange={(e) => update(idx, { period: e.target.value })}
                  placeholder="Session 2023–2024 · Expected completion 2028"
                  className={`${inputCls} font-mono text-xs`}
                />
              </div>
              <div>
                <label className={labelCls}>Status Note</label>
                <input
                  type="text"
                  value={edu.note}
                  onChange={(e) => update(idx, { note: e.target.value })}
                  placeholder="Completed / Currently studying"
                  className={inputCls}
                />
              </div>
              <div className="md:col-span-2">
                <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-fg">
                  <input
                    type="checkbox"
                    checked={edu.current}
                    onChange={(e) => update(idx, { current: e.target.checked })}
                    className="h-4 w-4 accent-brand"
                  />
                  <span>Show pulsing &quot;Currently studying&quot; badge</span>
                </label>
              </div>
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
          Save Education
        </button>
      </div>
    </div>
  );
}
