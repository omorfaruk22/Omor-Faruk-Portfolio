# Omor Faruk — Portfolio (Next.js 14 + TypeScript + Tailwind + Framer Motion)

## Run
    npm install
    npm run dev          # http://localhost:3000
    npm run build && npm start

## Edit everything from /data
- data/profile.ts       name, bio, contact, education, resume path
- data/availability.ts  change `availability.status` -> updates navbar, hero, about, contact
- data/skills.ts, data/services.ts, data/experience.ts, data/projects.ts, data/socials.ts
- public/profile.jpg    your photo (replace to change)
- public/resume.pdf     the file behind "Download PDF" in the resume popup (replace with your own anytime)
- Set NEXT_PUBLIC_SITE_URL to your real domain for SEO / sitemap.

## Structure
Each section is its own component in /components: Navbar, Hero, CodeEditor, Terminal, About, Skills,
Education, Experience, Services, Projects, Connect, Contact, Footer, ResumeModal, SnakeBackground.
