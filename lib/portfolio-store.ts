import fs from "fs/promises";
import path from "path";
import { MongoClient } from "mongodb";
import { getDefaultPortfolioData } from "@/lib/default-data";
import { normalizePortfolioData } from "@/lib/validation";
import type { PortfolioData, StorageBackend } from "@/types/portfolio";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "portfolio-store.json");
const AUTH_FILE = path.join(DATA_DIR, ".admin-auth.json");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

const REDIS_DATA_KEY = "omor_portfolio:data";
const REDIS_AUTH_KEY = "omor_portfolio:auth";

type MongoGlobal = typeof globalThis & {
  __portfolioMongoClient?: Promise<MongoClient>;
};

function getRedisConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (url && token) return { url: url.replace(/\/$/, ""), token };
  return null;
}

export function getStorageBackend(): StorageBackend {
  if (process.env.MONGODB_URI) return "mongodb";
  if (getRedisConfig()) return "redis";
  return "file";
}

async function getMongoDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");
  const g = globalThis as MongoGlobal;
  if (!g.__portfolioMongoClient) {
    const client = new MongoClient(uri);
    g.__portfolioMongoClient = client.connect();
  }
  const client = await g.__portfolioMongoClient;
  return client.db(process.env.MONGODB_DB || "omor_portfolio");
}

async function redisGet(key: string): Promise<string | null> {
  const cfg = getRedisConfig();
  if (!cfg) return null;
  const res = await fetch(`${cfg.url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${cfg.token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis GET failed: ${res.status}`);
  const body = (await res.json()) as { result: string | null };
  return body.result ?? null;
}

async function redisSet(key: string, value: string): Promise<void> {
  const cfg = getRedisConfig();
  if (!cfg) throw new Error("Redis is not configured");
  const res = await fetch(`${cfg.url}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(value),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis SET failed: ${res.status}`);
}

async function atomicWriteFile(filePath: string, content: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmpPath, content, "utf8");
  await fs.rename(tmpPath, filePath);
}

function formatWriteError(err: unknown): Error {
  const code = (err as NodeJS.ErrnoException | undefined)?.code;
  if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
    return new Error(
      "Storage is read-only in this serverless deployment. Add MONGODB_URI (MongoDB Atlas) or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN in Vercel Environment Variables to persist changes."
    );
  }
  return err instanceof Error ? err : new Error("Failed to save portfolio data");
}

export async function getPortfolioData(): Promise<PortfolioData> {
  const backend = getStorageBackend();
  const defaults = getDefaultPortfolioData();

  try {
    if (backend === "mongodb") {
      const db = await getMongoDb();
      const doc = await db.collection<{ _id: string; data: PortfolioData }>("portfolio").findOne({ _id: "main" });
      if (!doc?.data) return defaults;
      return normalizePortfolioData(doc.data, defaults);
    }

    if (backend === "redis") {
      const raw = await redisGet(REDIS_DATA_KEY);
      if (!raw) return defaults;
      const parsed = JSON.parse(raw) as Partial<PortfolioData>;
      return normalizePortfolioData(parsed, defaults);
    }

    const raw = await fs.readFile(STORE_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<PortfolioData>;
    return normalizePortfolioData(parsed, defaults);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException | undefined)?.code;
    if (code === "ENOENT") {
      return defaults;
    }
    console.error("[portfolio-store] Error reading portfolio data, using defaults:", err);
    return defaults;
  }
}

export async function savePortfolioData(input: Partial<PortfolioData>): Promise<PortfolioData> {
  const current = await getPortfolioData();
  const merged = normalizePortfolioData(
    {
      ...current,
      ...input,
      profile: input.profile ? { ...current.profile, ...input.profile } : current.profile,
      availability: input.availability
        ? {
            status: input.availability.status ?? current.availability.status,
            options: input.availability.options ?? current.availability.options,
          }
        : current.availability,
    },
    current
  );

  const backend = getStorageBackend();

  try {
    if (backend === "mongodb") {
      const db = await getMongoDb();
      await db
        .collection<{ _id: string; data: PortfolioData; updatedAt: string }>("portfolio")
        .updateOne({ _id: "main" }, { $set: { data: merged, updatedAt: merged.updatedAt } }, { upsert: true });
      return merged;
    }

    if (backend === "redis") {
      await redisSet(REDIS_DATA_KEY, JSON.stringify(merged));
      return merged;
    }

    await atomicWriteFile(STORE_FILE, JSON.stringify(merged, null, 2));
    return merged;
  } catch (err) {
    throw formatWriteError(err);
  }
}

export async function resetPortfolioData(): Promise<PortfolioData> {
  const defaults = getDefaultPortfolioData();
  const backend = getStorageBackend();

  try {
    if (backend === "mongodb") {
      const db = await getMongoDb();
      await db
        .collection<{ _id: string; data: PortfolioData; updatedAt: string }>("portfolio")
        .updateOne({ _id: "main" }, { $set: { data: defaults, updatedAt: defaults.updatedAt } }, { upsert: true });
      return defaults;
    }

    if (backend === "redis") {
      await redisSet(REDIS_DATA_KEY, JSON.stringify(defaults));
      return defaults;
    }

    await atomicWriteFile(STORE_FILE, JSON.stringify(defaults, null, 2));
    return defaults;
  } catch (err) {
    throw formatWriteError(err);
  }
}

export async function getStoredAuthHash(): Promise<string | null> {
  const backend = getStorageBackend();
  try {
    if (backend === "mongodb") {
      const db = await getMongoDb();
      const doc = await db.collection<{ _id: string; hash: string }>("portfolio").findOne({ _id: "auth" });
      return doc?.hash ?? null;
    }
    if (backend === "redis") {
      const raw = await redisGet(REDIS_AUTH_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { hash?: string };
      return parsed.hash ?? null;
    }
    const raw = await fs.readFile(AUTH_FILE, "utf8");
    const parsed = JSON.parse(raw) as { hash?: string };
    return parsed.hash ?? null;
  } catch {
    return null;
  }
}

export async function saveStoredAuthHash(hash: string): Promise<void> {
  const backend = getStorageBackend();
  try {
    if (backend === "mongodb") {
      const db = await getMongoDb();
      await db
        .collection<{ _id: string; hash: string; updatedAt: string }>("portfolio")
        .updateOne({ _id: "auth" }, { $set: { hash, updatedAt: new Date().toISOString() } }, { upsert: true });
      return;
    }
    if (backend === "redis") {
      await redisSet(REDIS_AUTH_KEY, JSON.stringify({ hash, updatedAt: new Date().toISOString() }));
      return;
    }
    await atomicWriteFile(AUTH_FILE, JSON.stringify({ hash, updatedAt: new Date().toISOString() }, null, 2));
  } catch (err) {
    throw formatWriteError(err);
  }
}

export async function saveUploadedAsset(
  safeFileName: string,
  contentType: string,
  buffer: Buffer
): Promise<string> {
  // Optional ImgBB integration for images when IMGBB_API_KEY is configured
  if (process.env.IMGBB_API_KEY && contentType.startsWith("image/")) {
    const form = new FormData();
    form.append("image", buffer.toString("base64"));
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(process.env.IMGBB_API_KEY)}`,
      { method: "POST", body: form }
    );
    if (res.ok) {
      const json = (await res.json()) as { data?: { url?: string } };
      if (json.data?.url) return json.data.url;
    }
  }

  const backend = getStorageBackend();

  if (backend === "mongodb") {
    const db = await getMongoDb();
    await db
      .collection<{ _id: string; contentType: string; data: string; createdAt: string }>("portfolio_uploads")
      .updateOne(
        { _id: safeFileName },
        {
          $set: {
            contentType,
            data: buffer.toString("base64"),
            createdAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );
    return `/api/uploads/${safeFileName}`;
  }

  if (backend === "file") {
    try {
      await fs.mkdir(UPLOADS_DIR, { recursive: true });
      await fs.writeFile(path.join(UPLOADS_DIR, safeFileName), buffer);
      return `/api/uploads/${safeFileName}`;
    } catch (err) {
      // Fallback to data URI if filesystem is read-only and asset is reasonable in size
      const code = (err as NodeJS.ErrnoException | undefined)?.code;
      if ((code === "EROFS" || code === "EACCES") && buffer.length <= 2 * 1024 * 1024) {
        return `data:${contentType};base64,${buffer.toString("base64")}`;
      }
      throw formatWriteError(err);
    }
  }

  // Redis backend: inline data URI for compact assets (or configure IMGBB_API_KEY / MONGODB_URI for large files)
  if (buffer.length <= 1.5 * 1024 * 1024) {
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  }
  throw new Error("File is too large for Redis inline storage. Use an image under 1.5MB or configure IMGBB_API_KEY / MONGODB_URI.");
}

export async function getUploadedAsset(
  safeFileName: string
): Promise<{ buffer: Buffer; contentType: string } | null> {
  const backend = getStorageBackend();

  if (backend === "mongodb") {
    const db = await getMongoDb();
    const doc = await db
      .collection<{ _id: string; contentType: string; data: string }>("portfolio_uploads")
      .findOne({ _id: safeFileName });
    if (!doc) return null;
    return {
      buffer: Buffer.from(doc.data, "base64"),
      contentType: doc.contentType,
    };
  }

  const filePath = path.join(UPLOADS_DIR, safeFileName);
  try {
    const buffer = await fs.readFile(filePath);
    const ext = path.extname(safeFileName).toLowerCase();
    const mimeMap: Record<string, string> = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
    };
    return {
      buffer,
      contentType: mimeMap[ext] || "application/octet-stream",
    };
  } catch {
    return null;
  }
}
