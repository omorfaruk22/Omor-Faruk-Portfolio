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
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [showUnlockSplash, setShowUnlockSplash] = useState(false);
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
    setShowUnlockSplash(true);
    setJustLoggedIn(true);
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

  const handleSplashComplete = useCallback(() => {
    setShowUnlockSplash(false);
  }, []);

  return (
    <>
      <CinematicSplash
        active={showUnlockSplash}
        mode="admin"
        brandName={data.profile.name}
        subtitle={`Welcome back, ${data.profile.name.split(" ")[0]}`}
        durationMs={2000}
        onComplete={handleSplashComplete}
      />

      <AnimatePresence mode="wait" initial={false}>
        {!authenticated ? (
          <motion.div
            key="admin-login-view"
            initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <AdminLogin
              defaultEmail={defaultEmail}
              usingDefaultPassword={usingDefaultPassword}
              onSuccess={handleLoginSuccess}
            />
          </motion.div>
        ) : (
          <motion.div
            key="admin-dashboard-view"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <AdminShell
              initialData={data}
              userEmail={user}
              storageBackend={storageBackend}
              usingDefaultPassword={usingDefaultPassword}
              animateEntrance={justLoggedIn}
              onPasswordChanged={() => setUsingDefaultPassword(false)}
              onLogout={() => {
                setJustLoggedIn(false);
                setShowUnlockSplash(false);
                setAuthenticated(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
