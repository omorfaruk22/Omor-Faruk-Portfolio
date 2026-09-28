import Section from "./Section";
import Reveal from "./Reveal";
import { skills } from "@/data/skills";

export default function Skills() {
  return (
    <Section id="skills" title="Skills">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((g, i) => (
          <Reveal key={g.group} delay={i * 0.05}>
            <div className="card h-full border-brand/25 p-5 transition hover:-translate-y-0.5 hover:border-brand/60 hover:shadow-glow">
              <p className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand">
                <span className="h-2 w-2 rounded-sm bg-brand shadow-glow" /> {g.group}
              </p>
              <div className="flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <span key={s} className="rounded-md border border-brand/25 bg-brand/5 px-2.5 py-1 text-xs text-fg">{s}</span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
