import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { getPortfolioData, savePortfolioData } from "@/lib/portfolio-store";
import { normalizeProject } from "@/lib/validation";
import type { ProjectItem } from "@/types/portfolio";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<ProjectItem>;
    const current = await getPortfolioData();
    const index = current.projects.findIndex((p) => p.id === params.id || p.slug === params.id);
    if (index === -1) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const existing = current.projects[index];
    const otherSlugs = new Set(
      current.projects.filter((_, idx) => idx !== index).map((p) => p.slug)
    );
    const updatedProject = normalizeProject(
      {
        ...existing,
        ...body,
        id: existing.id,
        createdAt: existing.createdAt,
      },
      otherSlugs,
      index
    );

    const nextProjects = [...current.projects];
    nextProjects[index] = updatedProject;

    const updated = await savePortfolioData({ projects: nextProjects });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/projects");
      revalidatePath(`/projects/${existing.slug}`);
      revalidatePath(`/projects/${updatedProject.slug}`);
      revalidatePath("/sitemap.xml");
    } catch {
      // ignore
    }

    return NextResponse.json({ project: updatedProject, data: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update project.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const current = await getPortfolioData();
    const target = current.projects.find((p) => p.id === params.id || p.slug === params.id);
    if (!target) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const nextProjects = current.projects.filter((p) => p.id !== target.id);
    const updated = await savePortfolioData({ projects: nextProjects });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/projects");
      revalidatePath(`/projects/${target.slug}`);
      revalidatePath("/sitemap.xml");
    } catch {
      // ignore
    }

    return NextResponse.json({ deletedId: target.id, data: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete project.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
