"use client";
import Link from "next/link";
import {
  Github,
  Linkedin,
  Facebook,
  Mail,
  Twitter,
  Youtube,
  Instagram,
  Globe,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "./Providers";
import type { SocialIconId } from "@/types/portfolio";

const icons: Record<SocialIconId, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
  email: Mail,
  twitter: Twitter,
  youtube: Youtube,
  instagram: Instagram,
  website: Globe,
};

export default function Footer() {
  const { data } = useApp();
  const { profile, socials } = data;

  return (
    <footer className="relative z-10 border-t border-brand/15 px-5 py-10 text-center">
      <p className="font-mono text-lg font-bold text-brand">&lt;{profile.name} /&gt;</p>
      <p className="mt-1 text-sm">
        <span className="font-semibold text-brand">{profile.name}</span> — {profile.title}
      </p>
      <p className="text-sm text-muted">{profile.status}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {socials.map((s) => {
          const Icon = icons[s.icon] ?? Globe;
          const isEmail = s.icon === "email" || s.href.startsWith("mailto:");
          return (
            <a
              key={s.id}
              href={s.href}
              target={isEmail ? undefined : "_blank"}
              rel="noreferrer"
              aria-label={s.label}
              className="rounded-md border border-brand/25 p-2 text-brand transition hover:border-brand hover:bg-brand/10"
            >
              <Icon size={18} />
            </a>
          );
        })}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-muted">
        <span>Built with Next.js + TypeScript + Tailwind CSS</span>
        <span className="text-brand/40">·</span>
        <Link
          href="/projects"
          className="font-mono text-muted transition hover:text-brand"
        >
          Projects
        </Link>
        <span className="text-brand/40">·</span>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 font-mono text-muted/80 transition hover:text-brand"
        >
          <Shield size={12} /> Admin
        </Link>
      </div>
    </footer>
  );
}
