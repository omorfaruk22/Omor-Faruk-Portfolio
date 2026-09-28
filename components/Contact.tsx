"use client";
import { useState } from "react";
import Section from "./Section";
import Reveal from "./Reveal";
import { profile } from "@/data/profile";
import { StatusLabel } from "./StatusDropdown";

export default function Contact() {
  const [f, setF] = useState({ name: "", email: "", subject: "", message: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  // No backend: opens the visitor's mail app with the message pre-filled.
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `${f.message}\n\nFrom: ${f.name} <${f.email}>`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(f.subject)}&body=${encodeURIComponent(body)}`;
  };
  const field = "w-full rounded-lg border border-brand/20 bg-ink-2 px-4 py-3 text-sm outline-none transition focus:border-brand";

  return (
    <Section id="contact" title="Let's Build Something Together.">
      <div className="grid gap-10 md:grid-cols-2">
        <Reveal className="space-y-3 font-mono text-sm">
          <StatusLabel />
          <p><span className="text-brand">email</span> — <a href={`mailto:${profile.email}`} className="break-all hover:underline">{profile.email}</a></p>
          <p><span className="text-brand">phone</span> — {profile.phones.map((p, i) => <span key={p}>{i > 0 && " / "}<a href={`tel:${p}`} className="hover:underline">{p}</a></span>)}</p>
          <p><span className="text-brand">location</span> — {profile.location}</p>
        </Reveal>
        <Reveal>
          <form onSubmit={submit} className="space-y-3">
            <input required placeholder="Name" value={f.name} onChange={set("name")} className={field} />
            <input required type="email" placeholder="Email" value={f.email} onChange={set("email")} className={field} />
            <input placeholder="Subject" value={f.subject} onChange={set("subject")} className={field} />
            <textarea required rows={5} placeholder="Message" value={f.message} onChange={set("message")} className={field} />
            <button type="submit" className="btn-primary w-full font-mono sm:w-auto">./send-message</button>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
