// A 7-day Mon–Sun strip. The last `streak` days up to today read as "kept";
// today is a dashed "current" cell. Personal, so the lobby only renders it when
// signed in.
const LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function todayMondayIndex(): number {
  // 0 = Monday … 6 = Sunday, in America/New_York.
  const wd = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
  }).format(new Date());
  const map: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };
  return map[wd] ?? 0;
}

export default function StreakStrip({ streak }: { streak: number }) {
  const today = todayMondayIndex();
  // Days kept: the `streak` days ending yesterday (today is still "current").
  const kept = new Set<number>();
  for (let i = 1; i <= streak; i++) {
    const idx = today - i;
    if (idx >= 0) kept.add(idx);
  }

  return (
    <div className="flex flex-col gap-3 border-[3px] border-ink-600 bg-ink-900 p-4 shadow-[4px_4px_0_var(--color-ink-950)]">
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-[11px] text-cream-100">DAILY STREAK</span>
        <span className="font-num text-[26px] leading-none text-gold-400">
          {streak} {streak === 1 ? "DAY" : "DAYS"}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-[6px]">
        {LABELS.map((label, i) => {
          const isToday = i === today;
          const isKept = kept.has(i);
          const cls = isToday
            ? "border-dashed border-gold-400 text-gold-400 bg-ink-950 motion-safe:animate-[bgaBlink_1.2s_steps(1,end)_infinite]"
            : isKept
              ? "border-ink-950 bg-gold-400 text-ink-950"
              : "border-ink-600 bg-ink-800 text-stone-400";
          return (
            <div
              key={i}
              className={`flex h-[30px] items-center justify-center border-2 font-display text-[9px] ${cls}`}
            >
              {label}
            </div>
          );
        })}
      </div>
      <span className="font-body text-[14px] text-cream-400">
        Play both dailies today to keep it alive.
      </span>
    </div>
  );
}
