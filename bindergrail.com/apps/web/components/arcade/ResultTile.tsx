type State = "exact" | "close" | "miss" | "current" | "wrong" | "empty";

// Exact/close/miss differ in lightness (gold/blue/dark) so the grid still reads
// without color and in the emoji share text.
const STATE: Record<State, string> = {
  exact: "bg-gold-400 text-ink-950 border-[3px] border-ink-950",
  close: "bg-blue-400 text-ink-950 border-[3px] border-ink-950",
  miss: "bg-ink-700 text-cream-400 border-[3px] border-ink-600",
  current: "bg-ink-950 text-gold-400 border-[3px] border-dashed border-gold-400",
  wrong: "bg-red-400 text-ink-950 border-[3px] border-ink-950",
  empty: "bg-ink-950 text-stone-400 border-[3px] border-ink-600",
};

export default function ResultTile({
  state,
  label,
  size = 30,
}: {
  state: State;
  label?: string;
  size?: number;
}) {
  return (
    <div
      className={`box-border flex items-center justify-center font-display text-[14px] ${STATE[state]}`}
      style={{ width: size, height: size }}
    >
      {label ?? ""}
    </div>
  );
}
