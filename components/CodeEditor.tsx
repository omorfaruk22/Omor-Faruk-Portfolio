"use client";
import { useMemo } from "react";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useApp } from "./Providers";

function highlight(line: string) {
  const re = /("[^"]*")|\b(const|true|false)\b|\b(\d+)\b|(\w+)(?=:)/g;
  const out: React.ReactNode[] = [];
  let last = 0,
    i = 0,
    m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const cls = m[1]
      ? "text-yellow-300"
      : m[2]
        ? "text-brand"
        : m[3]
          ? "text-orange-300"
          : "text-emerald-200";
    out.push(
      <span key={i++} className={cls}>
        {m[0]}
      </span>
    );
    last = re.lastIndex;
  }
  out.push(line.slice(last));
  return out;
}

export default function CodeEditor() {
  const { data, option } = useApp();
  const { profile, skills } = data;

  const code = useMemo(() => {
    const currentEdu =
      profile.education.find((e) => e.current) ?? profile.education[profile.education.length - 1];
    const topSkills = Array.from(
      new Set(skills.flatMap((g) => g.items))
    ).slice(0, 7);
    const isAvailable = option.id !== "unavailable";
    const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

    const skillLines = topSkills.map((s) => `    "${esc(s)}"`).join(",\n");

    return `const developer = {
  name: "${esc(profile.name)}",
  role: "${esc(profile.title)}",
  status: "${esc(profile.status)}",

  education: {
    degree: "${esc(currentEdu?.title || "Computer Science")}",
    institute: "${esc(currentEdu?.place || "Self-taught")}"
  },

  skills: [
${skillLines}
  ],

  location: "${esc(profile.location)}",
  availability: "${esc(option.label)}",
  available: ${isAvailable}
};`;
  }, [profile, skills, option]);

  const typed = useTypewriter(code, 18);
  const lines = typed.split("\n");

  return (
    <div
      className="card w-full overflow-hidden text-[11px] shadow-glow sm:text-xs"
      aria-label="portfolio.tsx code editor"
    >
      <div className="flex items-center gap-2 border-b border-brand/10 bg-black/30 px-3 py-2 font-mono">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 rounded-t border-b border-brand px-2 py-0.5 text-fg">
          portfolio.tsx
        </span>
        <span className="hidden text-muted sm:inline">README.md</span>
      </div>
      <pre className="max-h-[360px] overflow-auto p-3 font-mono leading-5 sm:p-4">
        <code>
          {lines.map((l, i) => (
            <div key={i} className="whitespace-pre">
              <span className="mr-3 inline-block w-5 select-none text-right text-muted/60">
                {i + 1}
              </span>
              {highlight(l)}
              {i === lines.length - 1 && <span className="cursor" />}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
