type Tone = "daily" | "arcade" | "story" | "live" | "new" | "soon";

// Background + text per tone. All tones use dark text on a bright fill except
// "soon", which is a quiet ink chip.
const TONE: Record<Tone, string> = {
  daily: "bg-gold-400 text-ink-950",
  arcade: "bg-blue-400 text-ink-950",
  story: "bg-magenta-400 text-ink-950",
  live: "bg-green-400 text-ink-950",
  new: "bg-cyan-300 text-ink-950",
  soon: "bg-ink-700 text-cream-400",
};

const LABEL: Record<Tone, string> = {
  daily: "DAILY",
  arcade: "ARCADE",
  story: "STORY",
  live: "LIVE",
  new: "NEW",
  soon: "COMING SOON",
};

export default function Chip({
  tone,
  label,
}: {
  tone: Tone;
  label?: string;
}) {
  return (
    <span
      className={`inline-block px-[7px] py-[5px] font-display text-[8px] leading-none ${TONE[tone]}`}
    >
      {label ?? LABEL[tone]}
    </span>
  );
}
