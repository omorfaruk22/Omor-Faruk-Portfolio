"use client";
import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Printer, X } from "lucide-react";
import { useApp } from "./Providers";
import { profile } from "@/data/profile";
import { skills } from "@/data/skills";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { socials } from "@/data/socials";

const H = ({ children }: { children: React.ReactNode }) => <h3 className="mb-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-brand">{children}</h3>;

export default function ResumeModal() {
  const { resumeOpen, setResumeOpen } = useApp();

  useEffect(() => {
    if (!resumeOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setResumeOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [resumeOpen, setResumeOpen]);

  return (
    <AnimatePresence>
      {resumeOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-6"
          role="dialog" aria-modal="true" aria-label="Resume"
          onMouseDown={(e) => e.target === e.currentTarget && setResumeOpen(false)}
        >
          <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} id="resume-print" className="card relative my-4 w-full max-w-2xl p-5 shadow-glow sm:p-8">
            <div className="no-print mb-5 flex flex-wrap items-center justify-end gap-2">
              <a href={profile.resumeUrl} download="Omor-Faruk-Resume.pdf" className="btn-primary !px-4 !py-2"><Download size={16} /> Download PDF</a>
              <button onClick={() => window.print()} className="btn-ghost !px-4 !py-2"><Printer size={16} /> Print</button>
              <button onClick={() => setResumeOpen(false)} aria-label="Close resume" className="btn-ghost !px-3 !py-2"><X size={16} /></button>
            </div>

            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <Image src={profile.photo} alt={profile.name} width={96} height={96} className="h-24 w-24 rounded-full border-2 border-brand/50 object-cover" />
              <div>
                <h2 className="text-2xl font-extrabold text-brand">{profile.name}</h2>
                <p className="font-mono text-sm">{profile.title}</p>
                <p className="font-mono text-xs text-muted">{profile.status}</p>
              </div>
            </div>
            <hr className="my-5 border-brand/20" />

            <div className="space-y-5 text-sm leading-relaxed">
              <div><H>Profile</H><p className="text-muted">{profile.bio[0]}</p></div>
              <div>
                <H>Education</H>
                {profile.education.map((e) => (
                  <p key={e.title} className="text-muted"><b className="text-fg">{e.title}</b>{e.place && ` — ${e.place}`}{e.period && ` · ${e.period}`}{e.current ? " · Currently studying" : e.note ? ` · ${e.note}` : ""}</p>
                ))}
              </div>
              <div>
                <H>Skills</H>
                {skills.map((g) => <p key={g.group} className="text-muted"><b className="text-fg">{g.group}:</b> {g.items.join(", ")}</p>)}
              </div>
              <div>
                <H>Experience</H>
                {experience.length === 0 ? <p className="text-muted">Details coming soon.</p> : experience.map((x) => <p key={x.company + x.position} className="text-muted"><b className="text-fg">{x.position}</b> — {x.company} · {x.duration}</p>)}
              </div>
              <div>
                <H>Projects</H>
                {projects.length === 0 ? <p className="text-muted">Coming soon.</p> : projects.map((p) => <p key={p.title} className="text-muted"><b className="text-fg">{p.title}</b> — {p.description}</p>)}
              </div>
              <div>
                <H>Contact</H>
                <p>{profile.email}</p>
                <p>{profile.phones.join(" / ")}</p>
                <p className="text-muted">{profile.location}</p>
                <p className="mt-2 break-all text-muted">{socials.filter((s) => s.id !== "email").map((s) => s.href.replace("https://", "")).join("  ·  ")}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
