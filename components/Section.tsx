import Reveal from "./Reveal";

export default function Section({
  id,
  title,
  badge,
  children,
}: {
  id: string;
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      style={{ contain: "layout style" }}
      className="mx-auto w-full max-w-6xl overflow-x-clip px-4 py-12 sm:px-5 md:px-8 md:py-24"
    >
      <Reveal from="top" className="mb-7 flex flex-wrap items-center gap-3 md:mb-8">
        <h2 className="break-words text-2xl font-bold text-brand sm:text-3xl md:text-4xl">
          {title}
        </h2>
        {badge}
      </Reveal>
      {children}
    </section>
  );
}
