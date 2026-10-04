import Link from "next/link";
import PixelSprite from "./PixelSprite";
import { accentText } from "./ui";
import type { Accent } from "@/lib/arcade/config";

// Same on every cabinet: back to the lobby, game name in its accent, token
// balance (or SIGN IN when signed out). 56px on phone, 64px on desktop.
export default function GameTopBar({
  title,
  accent,
  tokens,
}: {
  title: string;
  accent: Accent;
  tokens?: number | null;
}) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b-[3px] border-ink-700 bg-ink-950 px-3 lg:h-16 lg:px-7">
      <Link
        href="/arcade"
        className="inline-flex min-h-[44px] items-center gap-2 font-display text-[9px] text-cream-400 no-underline lg:text-[10px]"
      >
        <PixelSprite name="back" height={11} />
        LOBBY
      </Link>
      <span className={`font-display text-[11px] lg:text-[15px] ${accentText[accent]}`}>
        {title}
      </span>
      <div className="flex items-center gap-[6px]">
        {tokens == null ? (
          <Link
            href="/login"
            className="font-display text-[9px] text-cream-400 no-underline"
          >
            SIGN IN
          </Link>
        ) : (
          <>
            <PixelSprite name="coin" height={16} />
            <span className="font-num text-[24px] leading-none text-gold-400">
              {tokens}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
