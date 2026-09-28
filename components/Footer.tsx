import { Github, Linkedin, Facebook, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";

const icons = { github: Github, linkedin: Linkedin, facebook: Facebook, email: Mail } as const;

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-brand/15 px-5 py-10 text-center">
      <p className="font-mono text-lg font-bold text-brand">&lt;{profile.name} /&gt;</p>
      <p className="mt-1 text-sm"><span className="font-semibold text-brand">{profile.name}</span> — {profile.title}</p>
      <p className="text-sm text-muted">{profile.status}</p>
      <div className="mt-4 flex justify-center gap-3">
        {socials.map((s) => {
          const Icon = icons[s.id];
          return <a key={s.id} href={s.href} target={s.id === "email" ? undefined : "_blank"} rel="noreferrer" aria-label={s.label} className="rounded-md border border-brand/25 p-2 text-brand transition hover:border-brand hover:bg-brand/10"><Icon size={18} /></a>;
        })}
      </div>
      <p className="mt-5 text-xs text-muted">Built with Next.js + TypeScript + Tailwind CSS</p>
    </footer>
  );
}
