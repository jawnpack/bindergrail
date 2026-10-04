import PixelSprite from "./PixelSprite";

type Rarity = "common" | "rare" | "holo" | "grail";
type Size = "sm" | "md" | "lg";

// Gem fill + highlight per rarity (theme variables).
const GEM: Record<Rarity, { fill: string; high: string }> = {
  common: { fill: "var(--color-stone-400)", high: "var(--color-cream-400)" },
  rare: { fill: "var(--color-cyan-300)", high: "var(--color-cream-100)" },
  holo: { fill: "var(--color-magenta-400)", high: "var(--color-cream-100)" },
  grail: { fill: "var(--color-gold-400)", high: "var(--color-cream-100)" },
};

const DIM: Record<Size, { w: number; h: number; gemH: number }> = {
  sm: { w: 62, h: 86, gemH: 23 },
  md: { w: 74, h: 104, gemH: 27 },
  lg: { w: 120, h: 168, gemH: 40 },
};

export type Insets = { l: number; r: number; t: number; b: number };

// A gold card with an ink art window and a rarity-tinted gem. Shift the window's
// insets to show off-center art; add cream wear marks.
export default function CardFrame({
  rarity = "common",
  size = "md",
  insets,
  wear,
  className = "",
}: {
  rarity?: Rarity;
  size?: Size;
  insets?: Insets;
  wear?: React.CSSProperties[];
  className?: string;
}) {
  const d = DIM[size];
  const g = GEM[rarity];
  const ins = insets ?? { l: 5, r: 5, t: 5, b: 5 };

  return (
    <div
      className={`relative rounded-[4px] border-2 border-ink-950 bg-gold-400 ${className}`}
      style={{ width: d.w, height: d.h }}
    >
      <div
        className="absolute flex items-center justify-center border border-gold-700 bg-ink-700"
        style={{ left: ins.l, right: ins.r, top: ins.t, bottom: ins.b }}
      >
        <PixelSprite name="gem" height={d.gemH} gemFill={g.fill} gemHigh={g.high} />
      </div>
      {wear?.map((style, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="absolute bg-cream-100 opacity-90"
          style={style}
        />
      ))}
    </div>
  );
}
