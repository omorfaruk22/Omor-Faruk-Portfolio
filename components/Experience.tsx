import Section from "./Section";
import Reveal from "./Reveal";
import { experience } from "@/data/experience";

export default function Experience() {
  const empty = experience.length === 0;
  return (
    <Section id="experience" title="Experience" badge={empty ? <span className="soon font-mono text-xs"><i />coming soon</span> : undefined}>
      {empty ? (
        <Reveal>
          <div className="card grid gap-4 p-6 text-sm sm:grid-cols-2">
            <p className="font-mono text-xs text-muted sm:col-span-2">{"// edit in data/experience.ts"}</p>
            {["Company", "Position", "Duration", "Technologies"].map((l) => (
              <div key={l}><p className="text-muted">{l}</p><p className="font-medium">— to be added —</p></div>
            ))}
          </div>
        </Reveal>
      ) : (
        <ol className="ml-2 space-y-8 border-l border-brand/30">
          {experience.map((x) => (
            <li key={x.company + x.position} className="relative pl-6"><Reveal>
                <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-brand" />
                <p className="font-mono text-xs text-brand">{x.duration}</p>
                <h3 className="text-lg font-semibold">{x.position}</h3>
                <p className="text-sm text-muted">{x.company}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">{x.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul>
                <div className="mt-3 flex flex-wrap gap-2">{x.technologies.map((t) => <span key={t} className="rounded border border-brand/25 px-2 py-0.5 text-xs">{t}</span>)}</div>
              </Reveal></li>
          ))}
        </ol>
      )}
    </Section>
  );
}
