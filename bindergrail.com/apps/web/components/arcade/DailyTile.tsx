import ArcadeButton from "./ArcadeButton";
import { accentBorder, accentText } from "./ui";
import type { Accent } from "@/lib/arcade/config";

// A single daily in TODAY'S DAILIES: numbered badge, name, one-liner, play state.
export default function DailyTile({
  numberLabel,
  title,
  desc,
  href,
  accent,
  stateLabel,
  launched,
}: {
  numberLabel: string;
  title: string;
  desc: string;
  href: string;
  accent: Accent;
  stateLabel?: string;
  launched: boolean;
}) {
  return (
    <div className="flex items-center gap-4 border-[3px] border-ink-600 bg-ink-900 p-4 shadow-[4px_4px_0_var(--color-ink-950)]">
      <div
        className={`flex h-16 w-16 shrink-0 items-center justify-center border-[3px] bg-ink-950 font-num text-arc-32 ${accentBorder[accent]} ${accentText[accent]}`}
      >
        {numberLabel}
      </div>
      <div className="flex min-w-0 grow flex-col gap-1">
        <span className="font-display text-arc-14 text-cream-100">{title}</span>
        <span className="font-body text-arc-16 text-cream-400">{desc}</span>
        {launched && stateLabel ? (
          <span className="font-display text-arc-12 text-red-400">{stateLabel}</span>
        ) : null}
        {!launched ? (
          <span className="font-display text-arc-12 text-stone-400">COMING SOON</span>
        ) : null}
      </div>
      {launched ? (
        <ArcadeButton href={href} size="sm">
          PLAY
        </ArcadeButton>
      ) : (
        <ArcadeButton disabled size="sm">
          SOON
        </ArcadeButton>
      )}
    </div>
  );
}
