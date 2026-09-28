"use client";
import { createContext, useContext, useState } from "react";
import { availability, availabilityOptions, type AvailabilityId } from "@/data/availability";

type Ctx = {
  status: AvailabilityId;
  setStatus: (s: AvailabilityId) => void;
  option: (typeof availabilityOptions)[number];
  resumeOpen: boolean;
  setResumeOpen: (v: boolean) => void;
};
const AppCtx = createContext<Ctx | null>(null);

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used inside <Providers>");
  return c;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AvailabilityId>(availability.status);
  const [resumeOpen, setResumeOpen] = useState(false);
  const option = availabilityOptions.find((o) => o.id === status) ?? availabilityOptions[0];
  return <AppCtx.Provider value={{ status, setStatus, option, resumeOpen, setResumeOpen }}>{children}</AppCtx.Provider>;
}
