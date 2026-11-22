"use client";
import { useMemo, useState } from "react";
import Section from "./Section";
import Reveal from "./Reveal";
import { skills } from "@/data/skills";

export default function Skills() {
  const groups = useMemo(() => ["All", ...skills.map((group) => group.group)], []);
  const [activeGroup, setActiveGroup] = useState("All");
  const visibleSkills = skills.filter((group) => activeGroup === "All" || group.group === activeGroup);

  return (
    <Section id="skills" title="Skills">
      <Reveal className="mb-6 max-w-2xl text-sm leading-relaxed text-muted">
        Technologies and computer science topics I use and continue to explore.
      </Reveal>
      <div className="mb-7 flex flex-wrap gap-2" aria-label="Filter skills by category">
        {groups.map((group) => (
          <button
            key={group}
            type="button"
            onClick={() => setActiveGroup(group)}
            aria-pressed={activeGroup === group}
            className={`rounded-full border px-4 py-2 font-mono text-xs transition ${activeGroup === group ? "border-brand bg-brand text-ink-3" : "border-brand/30 bg-ink-2 text-muted hover:border-brand hover:text-fg"}`}
          >
            {group}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleSkills.map((group, index) => (
          <Reveal key={group.group} delay={index * 0.05}>
            <div className="card h-full border-brand/25 p-5 transition hover:-translate-y-0.5 hover:border-brand/60 hover:shadow-glow">
              <p className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand">
                <span className="h-2 w-2 rounded-sm bg-brand shadow-glow" /> {group.group}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span key={skill} className="rounded-md border border-brand/25 bg-brand/5 px-2.5 py-1 text-xs text-fg">{skill}</span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
