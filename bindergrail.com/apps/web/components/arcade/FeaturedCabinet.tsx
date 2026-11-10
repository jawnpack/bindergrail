import ArcadeButton from "./ArcadeButton";
import Chip from "./Chip";
import PixelSprite from "./PixelSprite";
import FeaturedBest from "./FeaturedBest";
import { RIM } from "./ui";
import type { Cabinet } from "@/lib/arcade/config";

// The hero slot. The personal stat (your best run) is a client island that only
// renders when signed in, so we never show a fake balance and the page stays
// static.
export default function FeaturedCabinet({ cabinet }: { cabinet: Cabinet }) {
  return (
    <section
      aria-labelledby="featured-title"
      className={`flex flex-wrap bg-ink-900 ${RIM}`}
    >
      {/* Attract screen */}
      <div className="flex min-h-[380px] flex-1 basis-[440px] flex-col items-center justify-center gap-6 bg-ink-950 p-9">
        <span className="font-display text-[10px] text-cyan-300">NOW PLAYING</span>
        <div className="flex flex-col items-center gap-1 font-display text-[28px] leading-[1.35] text-cream-100 [text-shadow:4px_4px_0_var(--color-blue-700)]">
          <span>THE</span>
          <span>CARDBOARD</span>
          <span>FLIP</span>
        </div>
        <span className="font-num text-[30px] leading-none text-gold-400">
          DAY 01 / 30
        </span>
        <span className="flex items-center gap-2 font-display text-[11px] text-cream-100 motion-safe:animate-[bgaBlink_1.2s_steps(1,end)_infinite]">
          <PixelSprite name="arrow-up" height={12} />
          PRESS START
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 basis-[400px] flex-col justify-center gap-5 p-9">
        <div className="flex flex-wrap gap-2">
          <Chip tone="live" />
          <Chip tone="story" label="STORY SIM" />
          <Chip tone="soon" label="30 DAYS" />
        </div>
        <h2
          id="featured-title"
          className="m-0 font-display text-[22px] leading-[1.35] text-gold-400"
        >
          {cabinet.title}
        </h2>
        <p className="m-0 font-body text-[19px] leading-[1.5] text-cream-100">
          Buy low, sell high and make rent every week. Flip your way from a single
          binder to your own card shop in 30 days.
        </p>
        <FeaturedBest />
        <div className="flex flex-wrap gap-[14px] pt-1">
          <ArcadeButton href={cabinet.href}>
            <PixelSprite name="arrow-up" height={14} />
            PRESS START
          </ArcadeButton>
          <ArcadeButton href="#scores" variant="outline" size="sm">
            HIGH SCORES
          </ArcadeButton>
        </div>
      </div>
    </section>
  );
}
