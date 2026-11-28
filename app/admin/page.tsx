import type { Metadata } from "next";
import AdminApp from "@/components/admin/AdminApp";
import { getAdminEmail, getAdminSession, isUsingDefaultPassword } from "@/lib/auth";
import { getPortfolioData, getStorageBackend } from "@/lib/portfolio-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard | Portfolio Manager",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = getAdminSession();
  const [data, usingDefaultPassword] = await Promise.all([
    getPortfolioData(),
    isUsingDefaultPassword(),
  ]);
  const storageBackend = getStorageBackend();
  const defaultEmail = getAdminEmail();

  return (
    <AdminApp
      initialAuthenticated={Boolean(session)}
      initialUser={session?.sub ?? null}
      defaultEmail={defaultEmail}
      initialUsingDefaultPassword={usingDefaultPassword}
      storageBackend={storageBackend}
      initialData={data}
    />
  );
}
