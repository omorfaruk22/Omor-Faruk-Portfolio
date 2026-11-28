"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { AvailabilityOption, PortfolioData } from "@/types/portfolio";

type Ctx = {
  data: PortfolioData;
  setData: (next: PortfolioData) => void;
  refreshData: () => Promise<void>;
  status: string;
  option: AvailabilityOption;
  resumeOpen: boolean;
  setResumeOpen: (v: boolean) => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used inside <Providers>");
  return c;
}

const FALLBACK_OPTION: AvailabilityOption = {
  id: "available",
  label: "Available",
  code: "available_for_work",
  color: "#22C55E",
};

export default function Providers({
  initialData,
  children,
}: {
  initialData: PortfolioData;
  children: React.ReactNode;
}) {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [resumeOpen, setResumeOpen] = useState(false);

  // Sync if server sends refreshed initialData (e.g., after router.refresh())
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch("/api/portfolio", { cache: "no-store" });
      if (res.ok) {
        const fresh = (await res.json()) as PortfolioData;
        setData(fresh);
      }
    } catch {
      // keep existing state on transient error
    }
  }, []);

  const status = data.availability.status;
  const option =
    data.availability.options.find((o) => o.id === status) ??
    data.availability.options[0] ??
    FALLBACK_OPTION;

  return (
    <AppCtx.Provider
      value={{
        data,
        setData,
        refreshData,
        status,
        option,
        resumeOpen,
        setResumeOpen,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}
