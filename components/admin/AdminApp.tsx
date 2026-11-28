"use client";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import CinematicSplash from "@/components/CinematicSplash";
import AdminLogin from "./AdminLogin";
import AdminShell from "./AdminShell";
import { adminFetch, getStoredToken } from "./api";
import type { PortfolioData, StorageBackend } from "@/types/portfolio";

export default function AdminApp({
  initialAuthenticated,
  initialUser,
  defaultEmail,
  initialUsingDefaultPassword,
  storageBackend,
  initialData,
}: {
  initialAuthenticated: boolean;
  initialUser: string | null;
  defaultEmail: string;
  initialUsingDefaultPassword: boolean;
  storageBackend: StorageBackend;
  initialData: PortfolioData;
}) {
  const reduceMotion = useReducedMotion();
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  // Plays 2-second boot splash on BOTH dashboard refresh (when already logged in) AND fresh login!
  const [showBootSplash, setShowBootSplash] = useState(initialAuthenticated);
  const [dashboardReady, setDashboardReady] = useState(!initialAuthenticated);
  const [bootKey, setBootKey] = useState(initialAuthenticated ? 1 : 0);
  const [user, setUser] = useState(initialUser ?? defaultEmail);
  const [usingDefaultPassword, setUsingDefaultPassword] = useState(initialUsingDefaultPassword);
  const [data, setData] = useState<PortfolioData>(initialData);

  // If SSR cookie wasn't available (e.g., strict cross-site iframe), check stored bearer token
  useEffect(() => {
    if (authenticated) return;
    if (!getStoredToken()) return;
    adminFetch<{ authenticated: boolean; user: string | null; usingDefaultPassword: boolean }>(
      "/api/auth/session"
    )
      .then((res) => {
        if (res.authenticated) {
          setShowBootSplash(true);
          setDashboardReady(false);
          setBootKey((k) => k + 1);
          setAuthenticated(true);
          if (res.user) setUser(res.user);
          setUsingDefaultPassword(res.usingDefaultPassword);
        }
      })
      .catch(() => {
        // stay on login screen
      });
  }, [authenticated]);

  const handleLoginSuccess = async (loggedInUser: string, usingDefault: boolean) => {
    setUser(loggedInUser);
    setUsingDefaultPassword(usingDefault);
    setShowBootSplash(true);
    setDashboardReady(false);
    setBootKey((k) => k + 1);
    try {
      const fresh = await adminFetch<PortfolioData>("/api/portfolio");
      setData(fresh);
    } catch {
      // use initialData fallback
    }
    setAuthenticated(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  };

  const handleSplashExitStart = useCallback(() => {
    setDashboardReady(true);
  }, []);

  const handleSplashComplete = useCallback(() => {
    setShowBootSplash(false);
    setDashboardReady(true);
  }, []);

  return (
    <>
      <CinematicSplash
        active={showBootSplash}
        mode="admin"
        brandName={data.profile.name}
        subtitle={`Welcome back, ${data.profile.name.split(" ")[0]}`}
        durationMs={2000}
        onExitStart={handleSplashExitStart}
        onComplete={handleSplashComplete}
      />

      <AnimatePresence mode="wait" initial={false}>
        {!authenticated ? (
          <motion.div
            key="admin-login-view"
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -18, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <AdminLogin
              defaultEmail={defaultEmail}
              usingDefaultPassword={usingDefaultPassword}
              onSuccess={handleLoginSuccess}
            />
          </motion.div>
        ) : (
          <motion.div
            key={`admin-dashboard-view-${bootKey}`}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <AdminShell
              initialData={data}
              userEmail={user}
              storageBackend={storageBackend}
              usingDefaultPassword={usingDefaultPassword}
              dashboardReady={dashboardReady || Boolean(reduceMotion)}
              onPasswordChanged={() => setUsingDefaultPassword(false)}
              onLogout={() => {
                setShowBootSplash(false);
                setDashboardReady(false);
                setAuthenticated(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
