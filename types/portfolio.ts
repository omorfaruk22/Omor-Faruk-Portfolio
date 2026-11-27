export type AvailabilityOption = {
  id: string;
  label: string;
  code: string;
  color: string;
  note?: string;
};

export type EducationItem = {
  id: string;
  title: string;
  place: string;
  period: string;
  note: string;
  current: boolean;
};

export type ProfileData = {
  name: string;
  title: string;
  heroBadge: string;
  status: string;
  statusSubtitle: string;
  portfolioVersion: string;
  tagline: string;
  email: string;
  phones: string[];
  location: string;
  permanentAddress: string;
  photo: string;
  resumeUrl: string;
  siteUrl: string;
  githubUser: string;
  formspreeUrl: string;
  seoDescription: string;
  bio: string[];
  education: EducationItem[];
};

export type ProjectItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github: string;
  serverGithub?: string;
  live: string;
  category: string;
  featured: boolean;
  highlights: string[];
  challenges: string[];
  improvements: string[];
  createdAt?: string;
};

export type ExperienceItem = {
  id: string;
  company: string;
  position: string;
  duration: string;
  location?: string;
  responsibilities: string[];
  technologies: string[];
};

export type SkillGroup = {
  id: string;
  group: string;
  items: string[];
};

export type SocialIconId =
  | "github"
  | "linkedin"
  | "facebook"
  | "email"
  | "twitter"
  | "youtube"
  | "instagram"
  | "website";

export type SocialItem = {
  id: string;
  icon: SocialIconId;
  label: string;
  href: string;
  blurb: string;
};

export type PortfolioData = {
  profile: ProfileData;
  availability: {
    status: string;
    options: AvailabilityOption[];
  };
  projects: ProjectItem[];
  experience: ExperienceItem[];
  skills: SkillGroup[];
  services: string[];
  socials: SocialItem[];
  updatedAt: string;
};

export type StorageBackend = "mongodb" | "redis" | "file";
