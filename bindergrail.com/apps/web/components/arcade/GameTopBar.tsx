import Link from "next/link";
import PixelSprite from "./PixelSprite";
import TopBarTokens from "./TopBarTokens";
import { accentText } from "./ui";
import type { Accent } from "@/lib/arcade/config";

// Same on every cabinet: back to the lobby, game name in its accent, token
// balance (or SIGN IN when signed out — filled in client-side so the page can be
// static). 56px on phone, 64px on desktop.
export default function GameTopBar({
  title,
  accent,
}: {
  title: string;
  accent: Accent;
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
      <TopBarTokens />
    </div>
  );
}
