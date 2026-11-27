"use client";
import { GraduationCap, Layers3, MapPin, Sparkles } from "lucide-react";
import Section from "./Section";
import Reveal from "./Reveal";
import { StatusLabel } from "./StatusDropdown";
import { useApp } from "./Providers";

function withName(text: string, name: string) {
  if (!name) return text;
  const [before, ...rest] = text.split(name);
  if (!rest.length) return text;
  return (
    <>
      {before}
      <span className="font-semibold text-brand">{name}</span>
      {rest.join(name)}
    </>
  );
}

export default function About() {
  const { data } = useApp();
  const { profile, projects, skills } = data;
  const currentEdu =
    profile.education.find((e) => e.current) ?? profile.education[profile.education.length - 1];
  const totalSkills = skills.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <Section id="about" title="About">
      <div className="grid w-full min-w-0 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.75fr)] md:gap-8">
        <Reveal className="min-w-0">
          <div className="card w-full min-w-0 overflow-hidden border-brand/20 p-5 sm:p-6">
            <p className="font-mono text-xs text-brand">{"// who I am"}</p>
            <StatusLabel className="mt-3" />

            <div className="mt-5 space-y-3 border-t border-brand/15 pt-4 text-xs text-muted">
              <div className="flex min-w-0 items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-brand" />
                <span className="min-w-0 break-words">{profile.location}</span>
              </div>
              {currentEdu && (
                <div className="flex min-w-0 items-start gap-2.5">
                  <GraduationCap size={15} className="mt-0.5 shrink-0 text-brand" />
                  <span className="min-w-0 break-words">
                    {currentEdu.place || currentEdu.title}
                  </span>
                </div>
              )}
              <div className="flex min-w-0 items-start gap-2.5">
                <Layers3 size={15} className="mt-0.5 shrink-0 text-brand" />
                <span className="min-w-0 break-words">
                  {projects.length} projects · {totalSkills} skills
                </span>
              </div>
              <div className="flex min-w-0 items-start gap-2.5">
                <Sparkles size={15} className="mt-0.5 shrink-0 text-brand" />
                <span className="min-w-0 break-words">{profile.status}</span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="min-w-0">
          <div className="card w-full min-w-0 space-y-4 overflow-hidden border-brand/15 p-5 text-sm leading-relaxed text-muted sm:p-6 sm:text-base">
            {profile.bio.map((p, i) => (
              <p key={i} className="break-words">
                {i === 0 ? withName(p, profile.name) : p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
