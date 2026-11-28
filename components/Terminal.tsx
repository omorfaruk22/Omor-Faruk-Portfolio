"use client";
import { useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useApp } from "./Providers";

export default function Terminal() {
  const { data, option, introReady } = useApp();
  const { profile, skills } = data;
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const shouldStart = inView && (introReady || Boolean(reduceMotion));

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

  const typed = useTypewriter(transcript, 12, shouldStart);
  const lines = typed.split("\n");
  const handle = profile.name.split(" ")[0]?.toLowerCase() || "dev";

  return (
    <section className="mx-auto w-full max-w-6xl overflow-x-clip px-4 pb-10 sm:px-5 md:px-8">
      <motion.div
        ref={ref}
        initial={reduceMotion ? false : { opacity: 0, y: 46 }}
        animate={shouldStart ? { opacity: 1, y: 0 } : { opacity: 0, y: 46 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="card w-full min-w-0 max-w-full overflow-hidden shadow-glow"
      >
        <div className="flex items-center gap-2 border-b border-brand/10 bg-black/30 px-4 py-2.5 font-mono text-xs text-muted">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-green-500/70" />
          <span className="ml-2 truncate">{handle}@dev: ~</span>
        </div>
        <pre className="min-h-[200px] w-full max-w-full overflow-x-auto whitespace-pre-wrap break-words p-4 font-mono text-[12px] leading-6 sm:whitespace-pre sm:p-5 sm:text-[13px]">
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
      </motion.div>
    </section>
  );
}
