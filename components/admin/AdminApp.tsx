"use client";
import { useEffect, useState } from "react";
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
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
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
    try {
      const fresh = await adminFetch<PortfolioData>("/api/portfolio");
      setData(fresh);
    } catch {
      // use initialData fallback
    }
    setAuthenticated(true);
  };

  if (!authenticated) {
    return (
      <AdminLogin
        defaultEmail={defaultEmail}
        usingDefaultPassword={usingDefaultPassword}
        onSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <AdminShell
      initialData={data}
      userEmail={user}
      storageBackend={storageBackend}
      usingDefaultPassword={usingDefaultPassword}
      onPasswordChanged={() => setUsingDefaultPassword(false)}
      onLogout={() => setAuthenticated(false)}
    />
  );
}
