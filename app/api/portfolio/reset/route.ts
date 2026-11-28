import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { resetPortfolioData } from "@/lib/portfolio-store";

export async function POST(request: Request) {
  const session = getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await resetPortfolioData();
    try {
      revalidatePath("/", "layout");
      revalidatePath("/projects");
      revalidatePath("/projects/[slug]", "page");
    } catch {
      // ignore
    }
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to reset portfolio data.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
