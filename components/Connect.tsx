"use client";
import Section from "./Section";
import Reveal from "./Reveal";
import { useApp } from "./Providers";

export default function Connect() {
  const { data } = useApp();
  const { socials, profile } = data;
  const links = socials.filter((s) => s.icon !== "email" && s.id !== "email");

  return (
    <Section id="connect" title="Connect">
      <div className="grid w-full min-w-0 gap-4 md:grid-cols-3">
        {links.map((s, i) => (
          <Reveal
            key={s.id}
            from={i % 3 === 0 ? "left" : i % 3 === 1 ? "bottom" : "right"}
            delay={i * 0.08}
            className="min-w-0"
          >
            <div className="card flex h-full w-full min-w-0 flex-col justify-between gap-4 p-5 sm:p-6">
              <div className="min-w-0">
                <p className="font-mono text-sm text-brand">{s.icon || s.id}</p>
                <p className="mt-1 break-words text-lg font-semibold">{profile.name}</p>
                <p className="mt-1 break-words text-sm text-muted">{s.blurb}</p>
              </div>
              <a href={s.href} target="_blank" rel="noreferrer" className="btn-primary w-full">
                View {s.label} →
              </a>
            </div>
          </Reveal>
        ))}
      </div>
      {profile.githubUser && (
        <Reveal className="mt-6 w-full min-w-0 max-w-full">
          <div className="card w-full min-w-0 max-w-full overflow-hidden p-4">
            <p className="mb-3 font-mono text-xs text-muted">
              github contributions · live public data
            </p>
            <div className="w-full max-w-full overflow-x-auto pb-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://ghchart.rshah.org/22C55E/${profile.githubUser}`}
                alt="GitHub contribution chart"
                className="h-auto w-full min-w-[540px] max-w-none"
                loading="lazy"
              />
            </div>
          </div>
        </Reveal>
      )}
    </Section>
  );
}
