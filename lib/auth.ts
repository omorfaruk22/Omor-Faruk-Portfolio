import crypto from "crypto";
import { cookies } from "next/headers";
import { getStoredAuthHash, saveStoredAuthHash } from "@/lib/portfolio-store";

export const SESSION_COOKIE = "portfolio_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
const DEFAULT_DEV_PASSWORD = "admin123";

function getSigningSecret(): string {
  const base =
    process.env.ADMIN_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "omor-faruk-portfolio-local-admin-secret-v1";
  return crypto.createHash("sha256").update(`portfolio-session:${base}`).digest("hex");
}

export function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL || "omorfaruk22571@gmail.com").trim().toLowerCase();
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${derived}`;
}

export function verifyPasswordHash(password: string, stored: string): boolean {
  const parts = stored.split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, expectedHex] = parts;
  const actual = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  if (actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(actual, expected);
}

function safeEqualStrings(a: string, b: string): boolean {
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export async function isUsingDefaultPassword(): Promise<boolean> {
  if (process.env.ADMIN_PASSWORD) return false;
  const storedHash = await getStoredAuthHash();
  return !storedHash;
}

export async function verifyAdminCredentials(identifier: string, password: string): Promise<boolean> {
  const cleanId = identifier.trim().toLowerCase();
  const allowedIds = new Set([getAdminEmail(), "admin"]);
  if (!allowedIds.has(cleanId)) return false;

  const storedHash = await getStoredAuthHash();
  if (storedHash) {
    return verifyPasswordHash(password, storedHash);
  }

  const configuredPassword = process.env.ADMIN_PASSWORD || DEFAULT_DEV_PASSWORD;
  return safeEqualStrings(password, configuredPassword);
}

export async function updateAdminPassword(currentPassword: string, newPassword: string): Promise<{ ok: boolean; error?: string }> {
  if (newPassword.length < 6) {
    return { ok: false, error: "New password must be at least 6 characters long." };
  }
  const valid = await verifyAdminCredentials(getAdminEmail(), currentPassword);
  if (!valid) {
    return { ok: false, error: "Current password is incorrect." };
  }
  const hash = hashPassword(newPassword);
  await saveStoredAuthHash(hash);
  return { ok: true };
}

export type AdminSession = {
  sub: string;
  iat: number;
  exp: number;
};

export function createSessionToken(subject: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSession = {
    sub: subject,
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSigningSecret())
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const encodedPayload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = crypto
    .createHmac("sha256", getSigningSecret())
    .update(encodedPayload)
    .digest("base64url");

  if (!safeEqualStrings(signature, expected)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as AdminSession;
    const now = Math.floor(Date.now() / 1000);
    if (!parsed.exp || parsed.exp < now) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getAdminSession(): AdminSession | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export function getAdminSessionFromRequest(request: Request): AdminSession | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    const session = verifySessionToken(token);
    if (session) return session;
  }
  return getAdminSession();
}

export function getSessionCookieOptions(request?: Request) {
  const proto = request?.headers.get("x-forwarded-proto") || "";
  const host = request?.headers.get("x-forwarded-host") || request?.headers.get("host") || "";
  const isHttps = proto === "https" || request?.url.startsWith("https://") || process.env.NODE_ENV === "production";
  const isPreviewIframe = host.endsWith(".e2b.app");

  return {
    name: SESSION_COOKIE,
    httpOnly: true,
    sameSite: (isPreviewIframe && isHttps ? "none" : "lax") as "none" | "lax",
    secure: isHttps,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
