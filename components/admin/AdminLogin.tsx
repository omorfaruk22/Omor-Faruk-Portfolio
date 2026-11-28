"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { adminFetch, setStoredToken } from "./api";
import { inputCls, labelCls } from "./ui";

export default function AdminLogin({
  defaultEmail,
  usingDefaultPassword,
  onSuccess,
}: {
  defaultEmail: string;
  usingDefaultPassword: boolean;
  onSuccess: (user: string, usingDefault: boolean) => void;
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await adminFetch<{
        authenticated: boolean;
        user: string;
        token: string;
        usingDefaultPassword: boolean;
      }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (res.token) {
        setStoredToken(res.token);
      }
      onSuccess(res.user, res.usingDefaultPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center overflow-x-clip px-4 py-10 sm:px-5">
      <div
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle, rgba(34, 197, 94, 0.16) 0%, rgba(34, 197, 94, 0.04) 45%, transparent 70%)",
        }}
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full"
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="mb-5 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted transition hover:text-brand"
          >
            <ArrowLeft size={14} /> Back to portfolio
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand/10 px-2.5 py-1 font-mono text-[10px] text-brand">
            <Sparkles size={11} /> Mission Control
          </span>
        </div>

        <div className="glass-card overflow-hidden border-brand/30 shadow-glow">
          <div className="flex items-center justify-between gap-2 border-b border-brand/15 bg-black/45 px-4 py-3 font-mono text-xs text-muted">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/75" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/75" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/75" />
              <span className="ml-2 flex items-center gap-1.5 text-fg">
                <Terminal size={13} className="text-brand" /> admin@omor: ~/auth
              </span>
            </div>
            <span className="rounded border border-brand/25 bg-brand/10 px-1.5 py-0.5 text-[10px] text-brand">
              HMAC-SHA256
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand/40 bg-gradient-to-br from-brand/25 to-brand/5 text-brand shadow-glow">
                <ShieldCheck size={24} />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-extrabold tracking-tight text-fg">
                  Portfolio Command Center
                </h1>
                <p className="mt-0.5 font-mono text-xs text-muted">
                  Authenticate to manage all sections
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div>
                <label htmlFor="admin-email" className={labelCls}>
                  Admin Email or Username
                </label>
                <input
                  id="admin-email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin or your email"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="admin-password" className={labelCls}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className={`${inputCls} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-fg"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/35 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full rounded-xl py-3 font-mono shadow-glow"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Verifying session...
                  </>
                ) : (
                  <>
                    <Lock size={15} /> ./unlock-dashboard
                  </>
                )}
              </button>
            </form>

            {usingDefaultPassword && (
              <div className="mt-6 rounded-xl border border-brand/20 bg-brand/[0.05] p-3.5 font-mono text-[11px] leading-relaxed text-muted">
                <p className="flex items-center gap-1.5 font-semibold text-brand">
                  <KeyRound size={13} /> Default development credentials:
                </p>
                <p className="mt-1.5 break-all">
                  User: <span className="text-fg">admin</span> or{" "}
                  <span className="text-fg">{defaultEmail}</span>
                </p>
                <p>
                  Password: <span className="text-fg">admin123</span>
                </p>
                <p className="mt-1.5 text-[10px] text-muted/80">
                  Update this anytime inside Settings or via ADMIN_PASSWORD env var.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
