import Section from "./Section";
import Reveal from "./Reveal";
import { socials } from "@/data/socials";
import { profile } from "@/data/profile";

export default function Connect() {
  const links = socials.filter((s) => s.id !== "email");
  return (
    <Section id="connect" title="Connect">
      <div className="grid gap-4 md:grid-cols-3">
        {links.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.06}>
            <div className="card flex h-full flex-col justify-between gap-4 p-6">
              <div>
                <p className="font-mono text-sm text-brand">{s.id}</p>
                <p className="mt-1 text-lg font-semibold">{profile.name}</p>
                <p className="mt-1 text-sm text-muted">{s.blurb}</p>
              </div>
              <a href={s.href} target="_blank" rel="noreferrer" className="btn-primary">View {s.label} →</a>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-6">
        <div className="card overflow-x-auto p-4">
          <p className="mb-3 font-mono text-xs text-muted">github contributions · live public data</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://ghchart.rshah.org/22C55E/${profile.githubUser}`} alt="GitHub contribution chart" className="min-w-[640px]" loading="lazy" />
        </div>
      </Reveal>
    </Section>
  );
}
