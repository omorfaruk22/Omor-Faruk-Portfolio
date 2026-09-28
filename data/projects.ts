export type Project = {
  title: string;
  description: string;
  image: string; // e.g. "/projects/my-app.png" (put file in /public/projects)
  technologies: string[];
  github: string;
  live: string;
  category: string; // used by the filter buttons
};

// Add your real projects here. Example:
// { title: "My App", description: "What it does", image: "", technologies: ["Next.js"], github: "https://github.com/...", live: "https://...", category: "Full Stack" }
export const projects: Project[] = [];
