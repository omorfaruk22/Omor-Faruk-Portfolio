# Omor Faruk — Portfolio

A responsive personal portfolio for **Omor Faruk**, a Full Stack Web Developer and Computer Science & Technology student. The site presents professional information, skills, education, social links, contact details, a downloadable resume, and selected projects with dedicated detail pages.

## Features

- Responsive navigation for desktop, tablet, and mobile screens
- Hero section with profile photo, professional designation, live admin-managed status, and resume download
- About section covering background, interests, and development journey
- Categorized skills, education, services, and experience sections
- Home page highlights **4 featured project cards** with a direct link to the dedicated `/projects` archive page
- Dedicated `/projects` page listing **all projects** with search, category filters, and sorting
- Individual `/projects/[slug]` detail pages (automatically available for every newly added project) with technology stack, highlights, challenges, future improvements, live demo, and GitHub links
- Full **Admin Dashboard** (`/admin`) with authentication to manage everything:
  - Projects (add, edit, delete, reorder, upload images, choose featured homepage projects)
  - Availability & Live Status (switch active status, add custom statuses with colors & notes, edit Hero status headline)
  - Experience timeline entries
  - Profile, About bio, profile photo, and resume PDF
  - Skills categories, Education timeline, Services, and Social links
  - Password management, JSON backup/restore, and reset to defaults
- Contact form with customizable endpoint
- Social profile links and GitHub contribution chart
- Dynamic SEO metadata, sitemap, robots file, and structured data
- Animated interface built with Framer Motion, with reduced-motion support

## Featured Projects

| Project | Category | Main technologies |
| --- | --- | --- |
| [BazarDor](https://bazardor-omega.vercel.app/) | Full Stack | Next.js 14, TypeScript, Tailwind CSS, Better Auth, MongoDB Atlas |
| [FitLog — Workout Library](https://assignment-006-chi.vercel.app/) | Frontend | Next.js 15, TypeScript, Tailwind CSS, React, FitLog API |
| [Library Management System](https://library-management-system.vercel.app/) | Full Stack | Next.js, TypeScript, MongoDB Atlas, Mongoose, Auth.js |
| [Movie Explorer](https://movie-explore-tawny.vercel.app/) | Frontend | React, Vite, JavaScript, Vercel |

Project details are available through routes such as:

```text
/projects/bazardor
/projects/fitlog
/projects/library-management-system
/projects/movie-explorer
```

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **UI:** React 18, Tailwind CSS, Lucide icons, Framer Motion
- **Deployment:** Vercel

## Run Locally

Install [Node.js](https://nodejs.org/) version 18 or later, then run:

```bash
git clone https://github.com/omorfaruk22/Omor-Faruk-Portfolio.git
cd Omor-Faruk-Portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```text
app/                         # App Router pages, metadata, sitemap, and styles
  projects/[slug]/page.tsx   # Dynamic project detail pages
components/                  # Reusable portfolio sections and UI components
data/                        # Editable personal, skills, social, and project data
public/
  profile.jpg                # Profile photograph
  resume.pdf                 # Downloadable resume
  projects/                  # Project preview images
hooks/                       # Custom React hooks
```

## Personalize the Content

Most portfolio content is stored in the `data` directory:

| File | Purpose |
| --- | --- |
| `data/profile.ts` | Name, title, bio, contact information, education, profile photo, and resume path |
| `data/projects.ts` | Project cards, detail content, images, technologies, GitHub URLs, live URLs, challenges, and future plans |
| `data/skills.ts` | Skill groups and technologies |
| `data/socials.ts` | GitHub, LinkedIn, Facebook, and email links |
| `data/experience.ts` | Professional experience entries |
| `data/services.ts` | Services offered |
| `data/availability.ts` | Current availability status displayed across the site |

### Change the Profile Photo

Replace this file while keeping the same name:

```text
public/profile.jpg
```

### Change the Resume

Replace this file while keeping the same name:

```text
public/resume.pdf
```

### Change Project Images

Place project screenshots in `public/projects/`. Use a 16:9 image, ideally `1200 × 675` pixels, with PNG, JPG, or WEBP format. Then set the matching path in `data/projects.ts`:

```ts
image: "/projects/bazardor.png",
```

Do not include `public` in the image path.

## Deployment

The project is ready to deploy on Vercel.

1. Push this repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com/).
3. Vercel detects Next.js automatically; click **Deploy**.
4. Every new push to the connected branch triggers a fresh deployment.

For production SEO metadata and sitemap links, set `NEXT_PUBLIC_SITE_URL` in Vercel to the deployed site URL.

### Admin Dashboard & Cloud Persistence on Vercel

Open `/admin` to manage your portfolio content.

- **Local development:** Changes persist automatically to `data/portfolio-store.json`. Default first-time login is `admin` (or your email) / `admin123` — change it immediately in **Settings**.
- **Vercel production:** Because serverless filesystems are read-only, configure environment variables (see `.env.example`):
  - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SECRET` for admin authentication
  - `MONGODB_URI` (MongoDB Atlas) **or** `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` for persistent cloud storage
  - Optional: `IMGBB_API_KEY` for external image hosting on uploads

## Contact

- Email: [omorfaruk22571@gmail.com](mailto:omorfaruk22571@gmail.com)
- GitHub: [omorfaruk22](https://github.com/omorfaruk22)
- LinkedIn: [Omor Faruk](https://www.linkedin.com/in/omor-faruk-3562873ab/)

## License

This portfolio is for personal use. Do not reuse personal information, project screenshots, or resume content without permission.
