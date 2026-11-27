import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { getPortfolioData, savePortfolioData } from "@/lib/portfolio-store";
import { normalizeProject } from "@/lib/validation";
import type { ProjectItem } from "@/types/portfolio";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<ProjectItem>;
    if (!body?.title?.trim()) {
      return NextResponse.json({ error: "Project title is required." }, { status: 400 });
    }

    const current = await getPortfolioData();
    const existingSlugs = new Set(current.projects.map((p) => p.slug));
    const newProject = normalizeProject(
      {
        ...body,
        createdAt: new Date().toISOString(),
      },
      existingSlugs
    );

    // Prepend new project so it appears at the top of the list
    const updated = await savePortfolioData({
      projects: [newProject, ...current.projects],
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/projects");
      revalidatePath(`/projects/${newProject.slug}`);
      revalidatePath("/sitemap.xml");
    } catch {
      // ignore
    }

    return NextResponse.json(
      { project: updated.projects.find((p) => p.slug === newProject.slug) ?? newProject, data: updated },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create project.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
