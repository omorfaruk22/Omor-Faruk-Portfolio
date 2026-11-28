"use client";
import Section from "./Section";
import Reveal from "./Reveal";
import { useApp } from "./Providers";

export default function Experience() {
  const { data } = useApp();
  const { experience } = data;
  const empty = experience.length === 0;

  return (
    <Section
      id="experience"
      title="Experience"
      badge={
        empty ? (
          <span className="soon font-mono text-xs">
            <i />
            coming soon
          </span>
        ) : (
          <span className="rounded-full border border-brand/25 px-3 py-1 font-mono text-xs text-muted">
            {experience.length} {experience.length === 1 ? "role" : "roles"}
          </span>
        )
      }
    >
      {empty ? (
        <Reveal>
          <div className="card grid gap-4 p-6 text-sm sm:grid-cols-2">
            <p className="font-mono text-xs text-muted sm:col-span-2">
              {"// manage experience entries from /admin"}
            </p>
            {["Company", "Position", "Duration", "Technologies"].map((l) => (
              <div key={l}>
                <p className="text-muted">{l}</p>
                <p className="font-medium">— to be added —</p>
              </div>
            ))}
          </div>
        </Reveal>
      ) : (
        <ol className="ml-2 space-y-8 border-l border-brand/30">
          {experience.map((x) => (
            <li key={x.id || `${x.company}-${x.position}`} className="relative pl-6">
              <Reveal>
                <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-brand shadow-glow" />
                <div className="card min-w-0 border-brand/20 p-4 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-xs text-brand">{x.duration}</p>
                    {x.location && (
                      <span className="rounded-full border border-brand/20 bg-brand/5 px-2.5 py-0.5 font-mono text-[11px] text-muted">
                        {x.location}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1.5 break-words text-lg font-semibold text-fg">{x.position}</h3>
                  <p className="break-words text-sm text-muted">{x.company}</p>
                  {x.responsibilities.length > 0 && (
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
                      {x.responsibilities.map((r, idx) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  )}
                  {x.technologies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {x.technologies.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-brand/25 bg-brand/[0.04] px-2.5 py-1 text-xs text-fg"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}
