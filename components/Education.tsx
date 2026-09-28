import Section from "./Section";
import Reveal from "./Reveal";
import { profile } from "@/data/profile";

export default function Education() {
  return (
    <Section id="education" title="Education">
      <ol className="ml-2 space-y-8 border-l border-brand/30">
        {profile.education.map((e) => (
          <li key={e.title} className="relative pl-6"><Reveal>
              <span className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-brand ${e.current ? "shadow-glow" : ""}`} />
              {e.current && <span className="soon mb-2 font-mono text-[11px] uppercase tracking-wider"><i />Currently studying</span>}
              {!e.current && <p className="font-mono text-xs uppercase text-muted">{e.note}</p>}
              <h3 className="mt-1 text-lg font-semibold">{e.title}</h3>
              {e.place && <p className="text-sm text-muted">{e.place}</p>}
              {e.period && <p className="font-mono text-xs text-brand">{e.period}</p>}
            </Reveal></li>
        ))}
      </ol>
    </Section>
  );
}
