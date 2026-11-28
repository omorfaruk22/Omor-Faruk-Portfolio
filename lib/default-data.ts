import { availability, availabilityOptions } from "@/data/availability";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { skills } from "@/data/skills";
import { socials } from "@/data/socials";
import type { PortfolioData, ProjectItem, SocialIconId } from "@/types/portfolio";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getHomeProjects(projectList: ProjectItem[], limit = 4): ProjectItem[] {
  const featured = projectList.filter((project) => project.featured);
  const rest = projectList.filter((project) => !project.featured);
  return [...featured, ...rest].slice(0, limit);
}

const availabilityNotes: Record<string, string> = {
  available: "Open to full-time roles, internships, and exciting freelance web projects.",
  freelancer: "Available for freelance full-stack & frontend development projects.",
  collaboration: "Open to collaborating on open-source and creative developer projects.",
  unavailable: "Currently focused on ongoing work & studies, but feel free to say hello.",
};

export function getDefaultPortfolioData(): PortfolioData {
  return {
    profile: {
      name: profile.name,
      title: profile.title,
      heroBadge: "Full stack developer",
      status: profile.status,
      statusSubtitle: "Learning by building real projects",
      portfolioVersion: "PORTFOLIO v1.0",
      tagline: profile.tagline,
      email: profile.email,
      phones: [...profile.phones],
      location: profile.location,
      permanentAddress: profile.permanentAddress,
      photo: profile.photo,
      resumeUrl: profile.resumeUrl,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? profile.siteUrl,
      githubUser: profile.githubUser,
      formspreeUrl: "https://formspree.io/f/mvkkzyja",
      seoDescription: profile.seoDescription,
      bio: [...profile.bio],
      education: profile.education.map((edu, index) => ({
        id: `edu-${index + 1}`,
        title: edu.title,
        place: edu.place,
        period: edu.period,
        note: edu.note,
        current: edu.current,
      })),
    },
    availability: {
      status: availability.status,
      options: availabilityOptions.map((option) => ({
        id: option.id,
        label: option.label,
        code: option.code,
        color: option.color,
        note: availabilityNotes[option.id] ?? "",
      })),
    },
    projects: projects.map((project, index) => ({
      id: `proj-${project.slug}`,
      slug: project.slug,
      title: project.title,
      description: project.description,
      image: project.image,
      technologies: [...project.technologies],
      github: project.github,
      serverGithub: project.serverGithub,
      live: project.live,
      category: project.category,
      featured: index < 4,
      highlights: [...project.highlights],
      challenges: [...project.challenges],
      improvements: [...project.improvements],
      createdAt: new Date(Date.UTC(2026, 0, Math.max(1, 20 - index))).toISOString(),
    })),
    experience: experience.map((item, index) => ({
      id: `exp-${index + 1}`,
      company: item.company,
      position: item.position,
      duration: item.duration,
      location: "",
      responsibilities: [...item.responsibilities],
      technologies: [...item.technologies],
    })),
    skills: skills.map((group, index) => ({
      id: `skill-${index + 1}`,
      group: group.group,
      items: Array.from(new Set(group.items)),
    })),
    services: [...services],
    socials: socials.map((social) => ({
      id: social.id,
      icon: (["github", "linkedin", "facebook", "email"].includes(social.id)
        ? social.id
        : "website") as SocialIconId,
      label: social.label,
      href: social.href,
      blurb: social.blurb,
    })),
    updatedAt: new Date().toISOString(),
  };
}
