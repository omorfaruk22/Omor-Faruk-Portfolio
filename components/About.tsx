import Section from "./Section";
import Reveal from "./Reveal";
import { profile } from "@/data/profile";
import { StatusLabel } from "./StatusDropdown";

function withName(text: string) {
  const [before, ...rest] = text.split(profile.name);
  if (!rest.length) return text;
  return (<>{before}<span className="font-semibold text-brand">{profile.name}</span>{rest.join(profile.name)}</>);
}

export default function About() {
  return (
    <Section id="about" title="About">
      <div className="grid gap-8 md:grid-cols-[1fr_1.8fr]">
        <Reveal>
          <p className="font-mono text-sm text-brand">// who I am</p>
          <StatusLabel className="mt-4" />
        </Reveal>
        <Reveal className="space-y-4 leading-relaxed text-muted">
          {profile.bio.map((p, i) => <p key={i}>{i === 0 ? withName(p) : p}</p>)}
        </Reveal>
      </div>
    </Section>
  );
}
