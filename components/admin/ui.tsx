"use client";
import { useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { adminFetch } from "./api";

export const inputCls =
  "w-full min-w-0 rounded-xl border border-brand/20 bg-ink px-3.5 py-2.5 text-sm text-fg outline-none transition placeholder:text-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/20";

export const textareaCls = `${inputCls} min-h-[96px] resize-y leading-relaxed`;

export const labelCls = "mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted";

export type ToastMessage = {
  id: string;
  type: "success" | "error" | "info";
  text: string;
};

export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      className="pointer-events-none fixed inset-x-3 bottom-24 z-[120] flex flex-col gap-2 sm:left-auto sm:right-5 sm:w-full sm:max-w-sm lg:bottom-5"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-glow ${
            toast.type === "error"
              ? "border-red-500/40 bg-ink-2/[0.98] text-red-200"
              : toast.type === "info"
                ? "border-brand/30 bg-ink-2/[0.98] text-fg"
                : "border-brand/50 bg-ink-2/[0.98] text-fg"
          }`}
        >
          {toast.type === "error" ? (
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-400" />
          ) : (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand" />
          )}
          <p className="flex-1 leading-snug">{toast.text}</p>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
            className="text-muted hover:text-fg"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  danger = true,
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 lg:backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => e.target === e.currentTarget && !busy && onCancel()}
    >
      <div className="glass-card w-full max-w-md border-brand/25 p-6 shadow-glow">
        <div className="flex items-start gap-3">
          <div
            className={`rounded-xl border p-2.5 ${
              danger
                ? "border-red-500/30 bg-red-500/10 text-red-400"
                : "border-brand/30 bg-brand/10 text-brand"
            }`}
          >
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-fg">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="btn-ghost !px-4 !py-2"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className={`btn !px-4 !py-2 ${
              danger
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-brand text-ink-3 hover:bg-brand-600"
            }`}
          >
            {busy && <Loader2 size={15} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function TagInput({
  values,
  onChange,
  placeholder = "Type and press Enter...",
}: {
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const addValues = (raw: string) => {
    const pieces = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (pieces.length === 0) return;
    const merged = Array.from(new Set([...values, ...pieces]));
    onChange(merged);
    setDraft("");
  };

  return (
    <div className="rounded-lg border border-brand/20 bg-ink p-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
      <div className="flex flex-wrap gap-1.5">
        {values.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 rounded-md border border-brand/30 bg-brand/10 px-2.5 py-1 text-xs text-fg"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(values.filter((v) => v !== tag))}
              aria-label={`Remove ${tag}`}
              className="text-muted transition hover:text-red-400"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addValues(draft);
            } else if (e.key === "Backspace" && !draft && values.length > 0) {
              onChange(values.slice(0, -1));
            }
          }}
          onBlur={() => draft.trim() && addValues(draft)}
          placeholder={placeholder}
          className="min-w-[160px] flex-1 bg-transparent px-1.5 py-1 text-sm text-fg outline-none placeholder:text-muted/60"
        />
      </div>
    </div>
  );
}

export function StringListEditor({
  items,
  onChange,
  placeholder = "Add an item...",
  multiline = false,
  addLabel = "Add item",
}: {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  multiline?: boolean;
  addLabel?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const clean = draft.trim();
    if (!clean) return;
    onChange([...items, clean]);
    setDraft("");
  };

  const updateAt = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-2.5">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-start gap-2">
          {multiline ? (
            <textarea
              rows={3}
              value={item}
              onChange={(e) => updateAt(idx, e.target.value)}
              className={`${inputCls} min-h-[72px] flex-1`}
            />
          ) : (
            <input
              type="text"
              value={item}
              onChange={(e) => updateAt(idx, e.target.value)}
              className={`${inputCls} flex-1`}
            />
          )}
          <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
            <button
              type="button"
              onClick={() => move(idx, -1)}
              disabled={idx === 0}
              aria-label="Move up"
              className="rounded-md border border-brand/20 bg-ink-2 p-2 text-muted transition hover:border-brand hover:text-fg disabled:opacity-30"
            >
              <ArrowUp size={14} />
            </button>
            <button
              type="button"
              onClick={() => move(idx, 1)}
              disabled={idx === items.length - 1}
              aria-label="Move down"
              className="rounded-md border border-brand/20 bg-ink-2 p-2 text-muted transition hover:border-brand hover:text-fg disabled:opacity-30"
            >
              <ArrowDown size={14} />
            </button>
            <button
              type="button"
              onClick={() => remove(idx)}
              aria-label="Delete item"
              className="rounded-md border border-red-500/25 bg-red-500/5 p-2 text-red-400 transition hover:border-red-400 hover:bg-red-500/15"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-2 sm:flex-row">
        {multiline ? (
          <textarea
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            className={`${inputCls} min-h-[64px] flex-1`}
          />
        ) : (
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            placeholder={placeholder}
            className={`${inputCls} flex-1`}
          />
        )}
        <button
          type="button"
          onClick={add}
          className="btn-ghost shrink-0 !px-4 !py-2 font-mono !text-xs"
        >
          <Plus size={15} /> {addLabel}
        </button>
      </div>
    </div>
  );
}

export function MediaUploadField({
  value,
  onChange,
  accept = "image/png,image/jpeg,image/webp,image/gif",
  kind = "image",
  presets,
  onNotify,
}: {
  value: string;
  onChange: (nextUrl: string) => void;
  accept?: string;
  kind?: "image" | "pdf";
  presets?: { label: string; url: string }[];
  onNotify?: (type: "success" | "error", text: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await adminFetch<{ url: string }>("/api/portfolio/upload", {
        method: "POST",
        body: formData,
      });
      onChange(res.url);
      onNotify?.("success", `${kind === "pdf" ? "Resume PDF" : "Image"} uploaded successfully.`);
    } catch (err) {
      onNotify?.("error", err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={kind === "pdf" ? "/resume.pdf or https://..." : "/projects/demo.png or https://..."}
          className={`${inputCls} flex-1 font-mono text-xs`}
        />
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="btn-ghost shrink-0 !px-4 !py-2 font-mono !text-xs"
        >
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {uploading ? "Uploading..." : kind === "pdf" ? "Upload PDF" : "Upload Image"}
        </button>
      </div>

      {kind === "image" && value && (
        <div className="overflow-hidden rounded-xl border border-brand/20 bg-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Media preview"
            className="aspect-[16/9] max-h-48 w-full object-cover"
          />
        </div>
      )}

      {kind === "pdf" && value && (
        <div className="flex items-center justify-between rounded-lg border border-brand/20 bg-ink px-3.5 py-2.5 text-xs">
          <span className="flex items-center gap-2 truncate font-mono text-muted">
            <FileText size={15} className="shrink-0 text-brand" />
            <span className="truncate">{value}</span>
          </span>
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="ml-3 shrink-0 font-mono text-brand hover:underline"
          >
            Preview
          </a>
        </div>
      )}

      {presets && presets.length > 0 && (
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] text-muted">
            <ImageIcon size={12} className="text-brand" /> Quick pick from existing project images:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset.url}
                type="button"
                onClick={() => onChange(preset.url)}
                className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition ${
                  value === preset.url
                    ? "border-brand bg-brand/15 text-brand"
                    : "border-brand/20 bg-ink text-muted hover:border-brand/50 hover:text-fg"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
