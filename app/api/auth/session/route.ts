import { NextResponse } from "next/server";
import { getAdminSessionFromRequest, isUsingDefaultPassword } from "@/lib/auth";
import { getStorageBackend } from "@/lib/portfolio-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = getAdminSessionFromRequest(request);
  const usingDefaultPassword = await isUsingDefaultPassword();
  const storageBackend = getStorageBackend();

  return NextResponse.json(
    {
      authenticated: Boolean(session),
      user: session?.sub ?? null,
      usingDefaultPassword,
      storageBackend,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
