import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { getPortfolioData, savePortfolioData } from "@/lib/portfolio-store";
import type { PortfolioData } from "@/types/portfolio";

export const dynamic = "force-dynamic";

function revalidatePortfolioPaths() {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/projects");
    revalidatePath("/projects/[slug]", "page");
    revalidatePath("/sitemap.xml");
  } catch {
    // Safe no-op outside standard request context
  }
}

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    console.error("[GET /api/portfolio]", err);
    return NextResponse.json({ error: "Failed to load portfolio data." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<PortfolioData>;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid portfolio payload." }, { status: 400 });
    }
    const updated = await savePortfolioData(body);
    revalidatePortfolioPaths();
    return NextResponse.json(updated, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[PUT /api/portfolio]", err);
    const message = err instanceof Error ? err.message : "Failed to save portfolio data.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
