import crypto from "crypto";
import { NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { saveUploadedAsset } from "@/lib/portfolio-store";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "application/pdf": ".pdf",
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  const session = getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Unsupported file type. Allowed: PNG, JPG, WEBP, GIF, PDF." },
        { status: 400 }
      );
    }

    const limit = file.type === "application/pdf" ? MAX_PDF_BYTES : MAX_IMAGE_BYTES;
    if (file.size > limit) {
      return NextResponse.json(
        { error: `File is too large. Maximum allowed size is ${Math.round(limit / (1024 * 1024))}MB.` },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const randomId = crypto.randomBytes(6).toString("hex");
    const safeName = `${Date.now()}-${randomId}${ext}`;

    const url = await saveUploadedAsset(safeName, file.type, buffer);
    return NextResponse.json({ url, fileName: safeName, contentType: file.type });
  } catch (err) {
    console.error("[POST /api/portfolio/upload]", err);
    const message = err instanceof Error ? err.message : "Failed to upload file.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
