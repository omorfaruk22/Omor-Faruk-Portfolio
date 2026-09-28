// All personal info lives here. Edit and the whole site updates.
export const profile = {
  name: "Omor Faruk",
  title: "Full Stack Web Developer",
  status: "Computer Science & Technology Student",
  tagline:
    "I build modern, scalable and user-focused web applications while continuously exploring new technologies and improving my craft.",
  email: "omorfaruk22571@gmail.com",
  phones: ["01776664368", "01570276657"],
  location: "Cox's Bazar, Bangladesh",
  permanentAddress: "Bogura, Mokamtola, Daridaha, Mohabbot Nodipur, Bangladesh",
  photo: "/profile.jpg",
  resumeUrl: "/resume.pdf",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  githubUser: "omorfaruk22",
  seoDescription:
    "Omor Faruk is a Computer Science & Technology student and Full Stack Web Developer from Bangladesh, focused on building modern, scalable and user-focused web applications.",
  bio: [
    "Hi, I'm Omor Faruk, a Computer Science & Technology student and aspiring Full Stack Web Developer from Bangladesh. I enjoy turning ideas into practical, modern web applications and continuously improving my skills through hands-on coding and real-world problem solving.",
    "My interests span frontend and backend development, databases, networking, operating systems, IoT, digital electronics, and core computer science concepts. I enjoy understanding how software works from both the user interface and system side while focusing on clean, maintainable and efficient code.",
    "I'm currently pursuing my Diploma in Computer Science & Technology at Cox's Bazar Polytechnic Institute and actively developing my skills through hands-on practice, personal projects and continuous learning.",
    "I'm open to freelance opportunities, collaborative projects and opportunities where I can learn, contribute and grow as a developer.",
  ],
  education: [
    { title: "SSC", place: "", period: "", note: "Completed", current: false },
    {
      title: "Diploma in Computer Science & Technology",
      place: "Cox's Bazar Polytechnic Institute",
      period: "Session 2023–2024 · Expected completion 2028",
      note: "Currently studying",
      current: true,
    },
  ],
};
