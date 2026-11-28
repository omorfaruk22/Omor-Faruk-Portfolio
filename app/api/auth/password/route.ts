import { NextResponse } from "next/server";
import { getAdminSessionFromRequest, updateAdminPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const session = getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { currentPassword?: string; newPassword?: string };
    const result = await updateAdminPassword(body.currentPassword ?? "", body.newPassword ?? "");
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true, message: "Password updated successfully." });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update password.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
