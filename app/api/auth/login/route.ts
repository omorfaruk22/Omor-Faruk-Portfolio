import { NextResponse } from "next/server";
import {
  createSessionToken,
  getAdminEmail,
  getSessionCookieOptions,
  isUsingDefaultPassword,
  verifyAdminCredentials,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; username?: string; password?: string };
    const identifier = (body.email ?? body.username ?? "").trim();
    const password = body.password ?? "";

    if (!identifier || !password) {
      return NextResponse.json({ error: "Email/username and password are required." }, { status: 400 });
    }

    const ok = await verifyAdminCredentials(identifier, password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials. Please check your email and password." }, { status: 401 });
    }

    const token = createSessionToken(getAdminEmail());
    const usingDefaultPassword = await isUsingDefaultPassword();

    const response = NextResponse.json({
      authenticated: true,
      user: getAdminEmail(),
      token,
      usingDefaultPassword,
    });
    response.cookies.set({
      ...getSessionCookieOptions(request),
      value: token,
    });
    return response;
  } catch (err) {
    console.error("[api/auth/login]", err);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
