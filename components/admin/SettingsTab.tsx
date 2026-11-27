"use client";
import { useRef, useState } from "react";
import {
  Database,
  Download,
  KeyRound,
  Loader2,
  RotateCcw,
  Settings,
  ShieldAlert,
  Upload,
} from "lucide-react";
import { adminFetch } from "./api";
import { ConfirmModal, inputCls, labelCls } from "./ui";
import type { PortfolioData, StorageBackend } from "@/types/portfolio";

export default function SettingsTab({
  data,
  storageBackend,
  usingDefaultPassword,
  onPasswordChanged,
  onDataChange,
  onNotify,
}: {
  data: PortfolioData;
  storageBackend: StorageBackend;
  usingDefaultPassword: boolean;
  onPasswordChanged: () => void;
  onDataChange: (next: PortfolioData) => void;
  onNotify: (type: "success" | "error" | "info", text: string) => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      onNotify("error", "New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      onNotify("error", "New password and confirmation do not match.");
      return;
    }
    setSavingPw(true);
    try {
      await adminFetch<{ ok: boolean }>("/api/auth/password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onPasswordChanged();
      onNotify("success", "Admin password updated securely!");
    } catch (err) {
      onNotify("error", err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setSavingPw(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify("info", "Exported full portfolio backup JSON.");
  };

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Partial<PortfolioData>;
      const updated = await adminFetch<PortfolioData>("/api/portfolio", {
        method: "PUT",
        body: JSON.stringify(parsed),
      });
      onDataChange(updated);
      onNotify("success", "Imported portfolio backup successfully!");
    } catch (err) {
      onNotify("error", err instanceof Error ? err.message : "Invalid JSON backup file.");
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      const fresh = await adminFetch<PortfolioData>("/api/portfolio/reset", { method: "POST" });
      onDataChange(fresh);
      setResetOpen(false);
      onNotify("success", "Portfolio reset to initial default content.");
    } catch (err) {
      onNotify("error", err instanceof Error ? err.message : "Failed to reset portfolio.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card border-brand/25 p-5">
        <h2 className="flex items-center gap-2 text-lg font-bold text-fg">
          <Settings size={18} className="text-brand" /> Settings, Security &amp; Backups
        </h2>
        <p className="mt-1 text-xs text-muted">
          Manage your admin password, cloud database status for Vercel, and JSON backups.
        </p>
      </div>

      {/* Password Change */}
      <form onSubmit={handlePasswordChange} className="glass-card p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-fg">
              <KeyRound size={17} className="text-brand" /> Admin Password
            </h3>
            <p className="mt-0.5 text-xs text-muted">
              Stored securely using salted scrypt hashing.
            </p>
          </div>
          {usingDefaultPassword && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] text-amber-300">
              <ShieldAlert size={12} /> Using default password
            </span>
          )}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div>
            <label className={labelCls}>Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Confirm New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button type="submit" disabled={savingPw} className="btn-primary !px-5 !py-2.5 font-mono">
            {savingPw ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />}
            Update Password
          </button>
        </div>
      </form>

      {/* Storage Backend Diagnostics */}
      <div className="glass-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-base font-bold text-fg">
            <Database size={17} className="text-brand" /> Data Storage Backend
          </h3>
          <span className="rounded-full border border-brand/35 bg-brand/10 px-3 py-1 font-mono text-xs text-brand">
            Active:{" "}
            {storageBackend === "mongodb"
              ? "MongoDB Atlas"
              : storageBackend === "redis"
                ? "Upstash Redis / Vercel KV"
                : "Local JSON File (data/portfolio-store.json)"}
          </span>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-muted">
          Locally, all changes automatically save to{" "}
          <code className="text-brand">data/portfolio-store.json</code>. For live edits on{" "}
          <strong className="text-fg">Vercel</strong> (where the serverless filesystem is read-only), add these environment variables in your Vercel Project Settings:
        </p>

        <pre className="mt-4 overflow-x-auto rounded-xl border border-brand/20 bg-ink p-4 font-mono text-xs leading-6 text-muted">
{`# Required for secure production admin login:
ADMIN_EMAIL=omorfaruk22571@gmail.com
ADMIN_PASSWORD=your-strong-password
ADMIN_SECRET=any-long-random-string

# Persistent cloud database on Vercel (Option 1 — MongoDB Atlas):
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/?retryWrites=true&w=majority

# Or Option 2 — Upstash Redis / Vercel KV:
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...`}
        </pre>
      </div>

      {/* Backup, Restore & Reset */}
      <div className="glass-card p-6">
        <h3 className="text-base font-bold text-fg">Backup, Restore &amp; Reset</h3>
        <p className="mt-1 text-xs text-muted">
          Export your complete portfolio as JSON, restore from a backup file, or reset everything back to the original seed data.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="btn-ghost !px-4 !py-2.5 font-mono !text-xs"
          >
            <Download size={15} /> Export JSON Backup
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => handleImport(e.target.files?.[0])}
          />
          <button
            type="button"
            disabled={importing}
            onClick={() => fileRef.current?.click()}
            className="btn-ghost !px-4 !py-2.5 font-mono !text-xs"
          >
            {importing ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            Import JSON Backup
          </button>

          <button
            type="button"
            onClick={() => setResetOpen(true)}
            className="btn border border-red-500/35 bg-red-500/10 !px-4 !py-2.5 font-mono !text-xs text-red-300 hover:border-red-400 hover:bg-red-500/20"
          >
            <RotateCcw size={15} /> Reset to Default Data
          </button>
        </div>
      </div>

      <ConfirmModal
        open={resetOpen}
        title="Reset portfolio to default data?"
        description="This overwrites your current projects, experience, status, profile, skills, services, and social links with the original repository seed data. Export a JSON backup first if you want to keep your changes."
        confirmLabel="Yes, Reset Everything"
        busy={resetting}
        onConfirm={handleReset}
        onCancel={() => setResetOpen(false)}
      />
    </div>
  );
}
