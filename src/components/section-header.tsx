export function SectionHeader({
  index,
  label,
  title,
}: {
  index: string;
  label: string;
  title: string;
}) {
  return (
    <div className="relative mb-8 md:pl-10">
      <div className="absolute -left-[5px] top-2 hidden h-3 w-3 rounded-full border-2 border-accent bg-bg md:block" />
      <p className="signal-tag text-xs uppercase tracking-[0.2em] text-muted">
        {index} — {label}
      </p>
      <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-text sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
