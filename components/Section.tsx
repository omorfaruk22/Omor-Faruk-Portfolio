import Reveal from "./Reveal";

export default function Section({
  id, title, badge, children,
}: { id: string; title: string; badge?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-24">
      <Reveal className="mb-8 flex flex-wrap items-center gap-3">
        <h2 className="text-3xl font-bold text-brand md:text-4xl">{title}</h2>
        {badge}
      </Reveal>
      {children}
    </section>
  );
}
