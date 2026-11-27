import { NextResponse } from "next/server";
import { getSessionCookieOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    ...getSessionCookieOptions(request),
    value: "",
    maxAge: 0,
  });
  return response;
}
