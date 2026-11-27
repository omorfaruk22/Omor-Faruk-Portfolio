"use client";
import { useMemo, useRef } from "react";
import { useInView } from "framer-motion";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useApp } from "./Providers";

export default function Terminal() {
  const { data, option } = useApp();
  const { profile, skills } = data;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const transcript = useMemo(() => {
    const currentEdu =
      profile.education.find((e) => e.current) ?? profile.education[profile.education.length - 1];
    const flatSkills = Array.from(new Set(skills.flatMap((g) => g.items))).slice(0, 12);
    const firstRow = flatSkills.slice(0, 7).join(", ");
    const secondRow = flatSkills.slice(7).join(", ");
    const skillText = secondRow ? `${firstRow},\n${secondRow}` : firstRow;

    const lines = [
      `$ whoami`,
      profile.name,
      `$ role`,
      profile.title,
      `$ status`,
      profile.status,
      `$ location`,
      profile.location,
    ];
    if (currentEdu?.title) {
      lines.push(`$ education`, currentEdu.title);
    }
    if (currentEdu?.place) {
      lines.push(`$ institute`, currentEdu.place);
    }
    if (skillText) {
      lines.push(`$ skills`, skillText);
    }
    lines.push(
      `$ availability`,
      `${option.label} (${option.code})`,
      `$ echo "Let's build something great."`,
      `Let's build something great.`
    );
    return lines.join("\n");
  }, [profile, skills, option]);

  const typed = useTypewriter(transcript, 12, inView);
  const lines = typed.split("\n");
  const handle = profile.name.split(" ")[0]?.toLowerCase() || "dev";

  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-10 md:px-8">
      <div ref={ref} className="card overflow-hidden shadow-glow">
        <div className="flex items-center gap-2 border-b border-brand/10 bg-black/30 px-4 py-2.5 font-mono text-xs text-muted">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2">{handle}@dev: ~</span>
        </div>
        <pre className="min-h-[200px] overflow-x-auto p-4 font-mono text-[12px] leading-6 sm:p-5 sm:text-[13px]">
          {lines.map((l, i) => (
            <div key={i}>
              {l.startsWith("$ ") ? (
                <>
                  <span className="text-brand">$</span> {l.slice(2)}
                </>
              ) : (
                <span className="text-brand/80">{l}</span>
              )}
              {i === lines.length - 1 && <span className="cursor" />}
            </div>
          ))}
        </pre>
      </div>
    </section>
  );
}
