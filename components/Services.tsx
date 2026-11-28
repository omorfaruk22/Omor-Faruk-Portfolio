"use client";
import Section from "./Section";
import Reveal from "./Reveal";
import { useApp } from "./Providers";

export default function Services() {
  const { data } = useApp();
  const { services } = data;

  return (
    <Section id="services" title="Services">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal
            key={`${s}-${i}`}
            from={i % 3 === 0 ? "left" : i % 3 === 1 ? "bottom" : "right"}
            delay={(i % 3) * 0.07}
          >
            <div className="card flex min-w-0 items-center gap-3 p-4 font-mono text-sm transition hover:border-brand/60 hover:shadow-glow">
              <span className="h-2 w-2 shrink-0 rounded-sm bg-brand" />{" "}
              <span className="min-w-0 break-words">{s}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
