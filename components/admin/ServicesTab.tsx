"use client";
import { useEffect, useState } from "react";
import { Loader2, Save, Wrench } from "lucide-react";
import { adminFetch } from "./api";
import { StringListEditor } from "./ui";
import type { PortfolioData } from "@/types/portfolio";

export default function ServicesTab({
  data,
  onDataChange,
  onNotify,
}: {
  data: PortfolioData;
  onDataChange: (next: PortfolioData) => void;
  onNotify: (type: "success" | "error" | "info", text: string) => void;
}) {
  const [services, setServices] = useState<string[]>(data.services);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setServices(data.services);
  }, [data.services]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await adminFetch<PortfolioData>("/api/portfolio", {
        method: "PUT",
        body: JSON.stringify({ services }),
      });
      onDataChange(updated);
      onNotify("success", "Services updated!");
    } catch (err) {
      onNotify("error", err instanceof Error ? err.message : "Failed to save services.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card flex flex-col justify-between gap-4 border-brand/25 p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-fg">
            <Wrench size={18} className="text-brand" /> Services Manager
          </h2>
          <p className="mt-1 text-xs text-muted">
            Add, edit, reorder, or remove the services listed on your portfolio ({services.length} services).
          </p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="btn-primary shrink-0 font-mono !text-xs"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Save Services
        </button>
      </div>

      <div className="glass-card p-6">
        <StringListEditor
          items={services}
          onChange={setServices}
          placeholder="e.g. Next.js Full Stack Development..."
          addLabel="Add service"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="btn-primary !px-6 !py-3 font-mono"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Services
        </button>
      </div>
    </div>
  );
}
