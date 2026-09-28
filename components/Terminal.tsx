"use client";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { useTypewriter } from "@/hooks/useTypewriter";

const transcript = `$ whoami
Omor Faruk
$ role
Full Stack Web Developer
$ status
Student + Developer
$ location
Cox's Bazar, Bangladesh
$ education
Diploma in Computer Science & Technology
$ institute
Cox's Bazar Polytechnic Institute
$ skills
JavaScript, TypeScript, React, Next.js, Node.js, Python, Java,
DSA, Networking, IoT, Database Management
$ availability
Available for Freelance
$ echo "Let's build something great."
Let's build something great.`;

export default function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const typed = useTypewriter(transcript, 12, inView);
  const lines = typed.split("\n");
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-10 md:px-8">
      <div ref={ref} className="card overflow-hidden shadow-glow">
        <div className="flex items-center gap-2 border-b border-brand/10 bg-black/30 px-4 py-2.5 font-mono text-xs text-muted">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2">omor@dev: ~</span>
        </div>
        <pre className="min-h-[200px] overflow-x-auto p-4 font-mono text-[12px] leading-6 sm:p-5 sm:text-[13px]">
          {lines.map((l, i) => (
            <div key={i}>
              {l.startsWith("$ ") ? <><span className="text-brand">$</span> {l.slice(2)}</> : <span className="text-brand/80">{l}</span>}
              {i === lines.length - 1 && <span className="cursor" />}
            </div>
          ))}
        </pre>
      </div>
    </section>
  );
}
