"use client";

// Topic filter: a row of toggle buttons (aria-pressed), 44px tall, label caps.
export default function FilterGroup<T extends string>({
  options,
  value,
  onChange,
  label,
  className = "",
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((t) => {
        const on = value === t;
        return (
          <button
            key={t}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(t)}
            className={`inline-flex min-h-11 items-center rounded-sm border px-4 text-label uppercase transition-colors duration-(--dur-fast) ${
              on
                ? "border-ink bg-ink text-on-ink"
                : "border-cream-hairline bg-parchment text-on-cream-muted hover:border-amber hover:text-on-cream"
            }`}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
