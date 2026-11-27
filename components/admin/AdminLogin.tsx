"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, ShieldCheck, Terminal } from "lucide-react";
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
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 font-mono text-xs text-muted transition hover:text-brand"
        >
          <ArrowLeft size={14} /> Back to portfolio
        </Link>

        <div className="card overflow-hidden border-brand/25 shadow-glow">
          <div className="flex items-center gap-2 border-b border-brand/15 bg-black/40 px-4 py-3 font-mono text-xs text-muted">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
            <span className="ml-2 flex items-center gap-1.5 text-fg">
              <Terminal size={13} className="text-brand" /> admin@portfolio: ~/auth
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand/35 bg-brand/10 text-brand">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-fg">Admin Dashboard</h1>
                <p className="font-mono text-xs text-muted">
                  Sign in to manage your portfolio
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                <div className="rounded-lg border border-red-500/35 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full font-mono"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Authenticating...
                  </>
                ) : (
                  <>
                    <Lock size={15} /> ./sign-in
                  </>
                )}
              </button>
            </form>

            {usingDefaultPassword && (
              <div className="mt-6 rounded-xl border border-brand/20 bg-brand/[0.04] p-3.5 font-mono text-[11px] leading-relaxed text-muted">
                <p className="font-semibold text-brand">First-time login credentials:</p>
                <p className="mt-1">
                  User: <span className="text-fg">admin</span> or{" "}
                  <span className="text-fg">{defaultEmail}</span>
                </p>
                <p>
                  Password: <span className="text-fg">admin123</span>
                </p>
                <p className="mt-1.5 text-[10px] text-muted/80">
                  Change this immediately in Settings or set ADMIN_PASSWORD in your environment variables.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
