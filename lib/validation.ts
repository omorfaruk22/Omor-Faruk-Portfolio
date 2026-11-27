import { getDefaultPortfolioData, slugify } from "@/lib/default-data";
import type {
  AvailabilityOption,
  EducationItem,
  ExperienceItem,
  PortfolioData,
  ProfileData,
  ProjectItem,
  SkillGroup,
  SocialIconId,
  SocialItem,
} from "@/types/portfolio";

const VALID_SOCIAL_ICONS: SocialIconId[] = [
  "github",
  "linkedin",
  "facebook",
  "email",
  "twitter",
  "youtube",
  "instagram",
  "website",
];

function cleanString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function cleanStringArray(value: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

export function normalizeUrl(value: unknown, fallback = ""): string {
  const raw = cleanString(value, fallback);
  if (!raw) return "";
  return raw;
}

export function ensureValidSiteUrl(value: unknown): string {
  const candidate = cleanString(value, process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
  try {
    return new URL(candidate).toString().replace(/\/$/, "");
  } catch {
    return "http://localhost:3000";
  }
}

export function normalizeProject(raw: Partial<ProjectItem>, existingSlugs: Set<string>, fallbackIndex = 0): ProjectItem {
  const title = cleanString(raw.title, "Untitled Project");
  const baseSlug = slugify(cleanString(raw.slug) || title) || `project-${Date.now()}-${fallbackIndex}`;
  let uniqueSlug = baseSlug;
  let counter = 2;
  while (existingSlugs.has(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter++}`;
  }
  existingSlugs.add(uniqueSlug);

  return {
    id: cleanString(raw.id) || `proj-${uniqueSlug}-${Math.random().toString(36).slice(2, 7)}`,
    slug: uniqueSlug,
    title,
    description: cleanString(raw.description),
    image: cleanString(raw.image) || "/projects/bazardor.png",
    technologies: cleanStringArray(raw.technologies),
    github: normalizeUrl(raw.github),
    serverGithub: normalizeUrl(raw.serverGithub) || undefined,
    live: normalizeUrl(raw.live),
    category: cleanString(raw.category) || "Full Stack",
    featured: Boolean(raw.featured),
    highlights: cleanStringArray(raw.highlights),
    challenges: cleanStringArray(raw.challenges),
    improvements: cleanStringArray(raw.improvements),
    createdAt: cleanString(raw.createdAt) || new Date().toISOString(),
  };
}

export function normalizeAvailabilityOptions(raw: unknown, fallback: AvailabilityOption[]): AvailabilityOption[] {
  if (!Array.isArray(raw) || raw.length === 0) return fallback;
  const seen = new Set<string>();
  const out: AvailabilityOption[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const obj = item as Partial<AvailabilityOption>;
    const label = cleanString(obj.label);
    if (!label) continue;
    const baseId = slugify(cleanString(obj.id) || label) || `status-${out.length + 1}`;
    let id = baseId;
    let n = 2;
    while (seen.has(id)) id = `${baseId}-${n++}`;
    seen.add(id);
    const code = cleanString(obj.code) || id.replace(/-/g, "_");
    const color = /^#[0-9a-fA-F]{3,8}$/.test(cleanString(obj.color)) ? cleanString(obj.color) : "#22C55E";
    out.push({
      id,
      label,
      code,
      color,
      note: cleanString(obj.note),
    });
  }
  return out.length > 0 ? out : fallback;
}

export function normalizeExperience(raw: unknown): ExperienceItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is Partial<ExperienceItem> => Boolean(item && typeof item === "object"))
    .map((item, idx) => ({
      id: cleanString(item.id) || `exp-${Date.now()}-${idx}`,
      company: cleanString(item.company),
      position: cleanString(item.position),
      duration: cleanString(item.duration),
      location: cleanString(item.location),
      responsibilities: cleanStringArray(item.responsibilities),
      technologies: cleanStringArray(item.technologies),
    }))
    .filter((item) => item.company || item.position);
}

export function normalizeEducation(raw: unknown, fallback: EducationItem[]): EducationItem[] {
  if (!Array.isArray(raw)) return fallback;
  return raw
    .filter((item): item is Partial<EducationItem> => Boolean(item && typeof item === "object"))
    .map((item, idx) => ({
      id: cleanString(item.id) || `edu-${Date.now()}-${idx}`,
      title: cleanString(item.title),
      place: cleanString(item.place),
      period: cleanString(item.period),
      note: cleanString(item.note),
      current: Boolean(item.current),
    }))
    .filter((item) => item.title);
}

export function normalizeSkills(raw: unknown, fallback: SkillGroup[]): SkillGroup[] {
  if (!Array.isArray(raw)) return fallback;
  return raw
    .filter((item): item is Partial<SkillGroup> => Boolean(item && typeof item === "object"))
    .map((item, idx) => ({
      id: cleanString(item.id) || `skill-${Date.now()}-${idx}`,
      group: cleanString(item.group),
      items: Array.from(new Set(cleanStringArray(item.items))),
    }))
    .filter((item) => item.group);
}

export function normalizeSocials(raw: unknown, fallback: SocialItem[]): SocialItem[] {
  if (!Array.isArray(raw)) return fallback;
  return raw
    .filter((item): item is Partial<SocialItem> => Boolean(item && typeof item === "object"))
    .map((item, idx) => {
      const iconCandidate = cleanString(item.icon || item.id) as SocialIconId;
      const icon: SocialIconId = VALID_SOCIAL_ICONS.includes(iconCandidate) ? iconCandidate : "website";
      return {
        id: cleanString(item.id) || `social-${Date.now()}-${idx}`,
        icon,
        label: cleanString(item.label) || icon,
        href: normalizeUrl(item.href),
        blurb: cleanString(item.blurb),
      };
    })
    .filter((item) => item.label && item.href);
}

export function normalizeProfile(raw: Partial<ProfileData> | undefined, base: ProfileData): ProfileData {
  if (!raw || typeof raw !== "object") return base;
  return {
    name: cleanString(raw.name, base.name) || base.name,
    title: cleanString(raw.title, base.title),
    heroBadge: cleanString(raw.heroBadge, base.heroBadge),
    status: cleanString(raw.status, base.status),
    statusSubtitle: cleanString(raw.statusSubtitle, base.statusSubtitle),
    portfolioVersion: cleanString(raw.portfolioVersion, base.portfolioVersion),
    tagline: cleanString(raw.tagline, base.tagline),
    email: cleanString(raw.email, base.email),
    phones: Array.isArray(raw.phones) ? cleanStringArray(raw.phones) : base.phones,
    location: cleanString(raw.location, base.location),
    permanentAddress: cleanString(raw.permanentAddress, base.permanentAddress),
    photo: cleanString(raw.photo, base.photo) || base.photo,
    resumeUrl: cleanString(raw.resumeUrl, base.resumeUrl) || base.resumeUrl,
    siteUrl: ensureValidSiteUrl(raw.siteUrl ?? base.siteUrl),
    githubUser: cleanString(raw.githubUser, base.githubUser),
    formspreeUrl: cleanString(raw.formspreeUrl, base.formspreeUrl),
    seoDescription: cleanString(raw.seoDescription, base.seoDescription),
    bio: Array.isArray(raw.bio) ? cleanStringArray(raw.bio) : base.bio,
    education: Array.isArray(raw.education) ? normalizeEducation(raw.education, base.education) : base.education,
  };
}

export function normalizePortfolioData(raw: Partial<PortfolioData> | null | undefined, base?: PortfolioData): PortfolioData {
  const defaults = base ?? getDefaultPortfolioData();
  if (!raw || typeof raw !== "object") return defaults;

  const profile = normalizeProfile(raw.profile, defaults.profile);
  const options = normalizeAvailabilityOptions(raw.availability?.options, defaults.availability.options);
  const requestedStatus = cleanString(raw.availability?.status, defaults.availability.status);
  const activeStatus = options.some((o) => o.id === requestedStatus) ? requestedStatus : options[0].id;

  const slugSet = new Set<string>();
  const projects = Array.isArray(raw.projects)
    ? raw.projects.map((p, idx) => normalizeProject(p, slugSet, idx))
    : defaults.projects;

  const experience = Array.isArray(raw.experience) ? normalizeExperience(raw.experience) : defaults.experience;
  const skills = Array.isArray(raw.skills) ? normalizeSkills(raw.skills, defaults.skills) : defaults.skills;
  const services = Array.isArray(raw.services) ? cleanStringArray(raw.services) : defaults.services;
  const socials = Array.isArray(raw.socials) ? normalizeSocials(raw.socials, defaults.socials) : defaults.socials;

  return {
    profile,
    availability: {
      status: activeStatus,
      options,
    },
    projects,
    experience,
    skills,
    services,
    socials,
    updatedAt: new Date().toISOString(),
  };
}
