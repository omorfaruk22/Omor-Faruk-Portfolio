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
          <Reveal key={`${s}-${i}`} delay={(i % 3) * 0.05}>
            <div className="card flex items-center gap-3 p-4 font-mono text-sm transition hover:border-brand/60 hover:shadow-glow">
              <span className="h-2 w-2 shrink-0 rounded-sm bg-brand" /> {s}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
