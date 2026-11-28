import { NextResponse } from "next/server";
import { getUploadedAsset } from "@/lib/portfolio-store";

export const dynamic = "force-dynamic";

const SAFE_FILENAME_RE = /^[a-zA-Z0-9._-]+$/;

export async function GET(_request: Request, { params }: { params: { filename: string } }) {
  const fileName = params.filename;
  if (!fileName || !SAFE_FILENAME_RE.test(fileName) || fileName.includes("..")) {
    return NextResponse.json({ error: "Invalid filename." }, { status: 400 });
  }

  const asset = await getUploadedAsset(fileName);
  if (!asset) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(asset.buffer), {
    status: 200,
    headers: {
      "Content-Type": asset.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
