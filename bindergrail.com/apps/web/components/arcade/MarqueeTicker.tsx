// A seamless scrolling marquee: the items are duplicated so the -50% loop is
// gapless. Stops under reduced-motion (then the first run just sits visible).
export default function MarqueeTicker({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden whitespace-nowrap border-b-[3px] border-ink-950 bg-gold-400 text-ink-950">
      <div className="inline-flex py-[11px] font-display text-[10px] leading-none motion-safe:animate-[bgaMarquee_45s_linear_infinite] lg:text-[11px]">
        {doubled.map((item, i) => (
          <span key={i} className="pr-14">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
