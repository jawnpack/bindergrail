import PixelSprite, { type SpriteName } from "./PixelSprite";

// Sprite + a value in the number font, optional label. Used for tokens and streak.
export default function HudPill({
  sprite,
  value,
  label,
  valueClassName = "text-gold-400",
}: {
  sprite: SpriteName;
  value: string | number;
  label?: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-2 border-[3px] border-ink-600 bg-ink-800 px-[10px] py-1">
      <PixelSprite name={sprite} height={18} />
      <span className={`font-num text-[26px] leading-none ${valueClassName}`}>
        {value}
      </span>
      {label ? (
        <span className="font-display text-[9px] text-cream-400">{label}</span>
      ) : null}
    </div>
  );
}
