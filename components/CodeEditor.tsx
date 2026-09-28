"use client";
import { useTypewriter } from "@/hooks/useTypewriter";
import { profile } from "@/data/profile";
import { skills } from "@/data/skills";

const code = `const developer = {
  name: "${profile.name}",
  role: "Full Stack Developer",
  status: "Student",

  education: {
    degree: "Diploma in CST",
    institute: "Cox's Bazar Polytechnic Institute",
    session: "2023-2024",
    expectedCompletion: 2028
  },

  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "Java"
  ],

  location: "${profile.location}",

  available: true
};`;

function highlight(line: string) {
  const re = /("[^"]*")|\b(const|true|false)\b|\b(\d+)\b|(\w+)(?=:)/g;
  const out: React.ReactNode[] = [];
  let last = 0, i = 0, m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const cls = m[1] ? "text-yellow-300" : m[2] ? "text-brand" : m[3] ? "text-orange-300" : "text-emerald-200";
    out.push(<span key={i++} className={cls}>{m[0]}</span>);
    last = re.lastIndex;
  }
  out.push(line.slice(last));
  return out;
}

export default function CodeEditor() {
  const typed = useTypewriter(code, 18);
  const lines = typed.split("\n");
  void skills; // skills list above mirrors data/skills.ts
  return (
    <div className="card w-full overflow-hidden text-[11px] shadow-glow sm:text-xs" aria-label="portfolio.tsx code editor">
      <div className="flex items-center gap-2 border-b border-brand/10 bg-black/30 px-3 py-2 font-mono">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 rounded-t border-b border-brand px-2 py-0.5 text-fg">portfolio.tsx</span>
        <span className="hidden text-muted sm:inline">README.md</span>
      </div>
      <pre className="max-h-[360px] overflow-auto p-3 font-mono leading-5 sm:p-4">
        <code>
          {lines.map((l, i) => (
            <div key={i} className="whitespace-pre">
              <span className="mr-3 inline-block w-5 select-none text-right text-muted/60">{i + 1}</span>
              {highlight(l)}
              {i === lines.length - 1 && <span className="cursor" />}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
