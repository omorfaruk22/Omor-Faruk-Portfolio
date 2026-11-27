"use client";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Plus, Save, Share2, Trash2 } from "lucide-react";
import { adminFetch } from "./api";
import { inputCls, labelCls } from "./ui";
import type { PortfolioData, SocialIconId, SocialItem } from "@/types/portfolio";

const ICON_OPTIONS: { value: SocialIconId; label: string }[] = [
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "email", label: "Email" },
  { value: "twitter", label: "X / Twitter" },
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
  { value: "website", label: "Website / Other" },
];

export default function SocialsTab({
  data,
  onDataChange,
  onNotify,
}: {
  data: PortfolioData;
  onDataChange: (next: PortfolioData) => void;
  onNotify: (type: "success" | "error" | "info", text: string) => void;
}) {
  const [items, setItems] = useState<SocialItem[]>(data.socials);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setItems(data.socials);
  }, [data.socials]);

  const addSocial = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `social-${Date.now()}`,
        icon: "website",
        label: "",
        href: "",
        blurb: "",
      },
    ]);
  };

  const update = (idx: number, patch: Partial<SocialItem>) => {
    setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, ...patch } : item)));
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
        body: JSON.stringify({ socials: items }),
      });
      onDataChange(updated);
      onNotify("success", "Social links updated!");
    } catch (err) {
      onNotify("error", err instanceof Error ? err.message : "Failed to save social links.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card flex flex-col justify-between gap-4 border-brand/25 p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-fg">
            <Share2 size={18} className="text-brand" /> Social Links Manager
          </h2>
          <p className="mt-1 text-xs text-muted">
            Controls the Connect cards, Footer social icons, Resume links, and structured SEO data.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={addSocial} className="btn-ghost font-mono !text-xs">
            <Plus size={15} /> Add Link
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
        {items.map((social, idx) => (
          <div key={social.id} className="card border-brand/20 p-5">
            <div className="flex items-center justify-between gap-2 border-b border-brand/10 pb-3">
              <span className="font-mono text-xs text-brand">
                {social.label || `Link #${idx + 1}`}
              </span>
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
                <label className={labelCls}>Platform Icon</label>
                <select
                  value={social.icon}
                  onChange={(e) => update(idx, { icon: e.target.value as SocialIconId })}
                  className={inputCls}
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Display Label</label>
                <input
                  type="text"
                  value={social.label}
                  onChange={(e) => update(idx, { label: e.target.value })}
                  placeholder="GitHub"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>URL (or mailto:...)</label>
                <input
                  type="text"
                  value={social.href}
                  onChange={(e) => update(idx, { href: e.target.value })}
                  placeholder="https://github.com/..."
                  className={`${inputCls} font-mono text-xs`}
                />
              </div>
              <div>
                <label className={labelCls}>Short Blurb</label>
                <input
                  type="text"
                  value={social.blurb}
                  onChange={(e) => update(idx, { blurb: e.target.value })}
                  placeholder="Code, experiments & commits."
                  className={inputCls}
                />
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
          Save Social Links
        </button>
      </div>
    </div>
  );
}
