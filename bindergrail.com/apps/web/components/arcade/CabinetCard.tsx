import ArcadeButton from "./ArcadeButton";
import Chip from "./Chip";
import CardFrame from "./CardFrame";
import PixelSprite from "./PixelSprite";
import type { Cabinet } from "@/lib/arcade/config";

// A little bespoke art per cabinet in the select grid — keeps the row from
// reading as four identical tiles. Everything else is driven by the config.
function CabinetArt({ id }: { id: string }) {
  if (id === "cardboard-flip") {
    return (
      <div className="flex flex-col items-center justify-center gap-3">
        <span className="font-num text-[44px] leading-none text-cyan-300">
          DAY 01/30
        </span>
        <span className="font-display text-[10px] text-cream-100">
          OPEN YOUR OWN SHOP
        </span>
      </div>
    );
  }
  if (id === "gut-check") {
    return (
      <div className="flex items-center justify-center gap-6">
        <CardFrame rarity="grail" size="md" insets={{ l: 12, r: 4, t: 7, b: 7 }} />
        <div className="flex flex-col gap-[6px]">
          <span className="font-display text-[10px] text-cream-400">GRADE</span>
          <span className="font-num text-[52px] leading-[0.9] text-gold-400">
            ?/10
          </span>
        </div>
      </div>
    );
  }
  if (id === "comp-check") {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <span className="font-num text-[42px] leading-none text-cream-100">
          $42.00
        </span>
        <div className="flex gap-[14px]">
          <PixelSprite name="arrow-up" height={12} className="text-gold-400" />
          <PixelSprite name="arrow-down" height={12} className="text-blue-400" />
        </div>
        <span className="font-num text-[42px] leading-none text-cyan-300 motion-safe:animate-[bgaBlink_1.2s_steps(1,end)_infinite]">
          $??.??
        </span>
      </div>
    );
  }
  // table-talk
  return (
    <div className="relative w-full max-w-[230px] border-[3px] border-cream-100 bg-ink-800 px-[14px] pb-[18px] pt-3 shadow-[0_0_0_3px_var(--color-ink-950)]">
      <span className="font-display text-[9px] text-gold-400">SAL</span>
      <p className="m-0 mt-[6px] font-body text-[16px] leading-[1.35] text-cream-100">
        Hundred eighty. Firm. ...Mostly firm.
      </p>
    </div>
  );
}

const CHIP_STATUS = { live: "live", new: "new", soon: "soon" } as const;

export default function CabinetCard({ cabinet }: { cabinet: Cabinet }) {
  return (
    <article className="flex flex-col border-[3px] border-ink-600 bg-ink-900 shadow-[6px_6px_0_var(--color-ink-950)]">
      <div className="flex h-44 items-center justify-center border-b-[3px] border-ink-600 bg-ink-950 p-4">
        <CabinetArt id={cabinet.id} />
      </div>
      <div className="flex grow flex-col gap-3 p-[18px]">
        <div className="flex flex-wrap gap-2">
          <Chip tone={cabinet.type} />
          <Chip tone={CHIP_STATUS[cabinet.status]} />
        </div>
        <h3 className="m-0 font-display text-[14px] leading-[1.4] text-cream-100">
          {cabinet.title}
        </h3>
        <p className="m-0 font-body text-[16px] text-cream-400">{cabinet.blurb}</p>
        <div className="mt-auto flex items-center justify-between gap-[10px] pt-[6px]">
          <span className="font-display text-[8px] text-stone-400">
            {cabinet.playsLabel}
          </span>
          <ArcadeButton href={cabinet.href} size="sm">
            PLAY
          </ArcadeButton>
        </div>
      </div>
    </article>
  );
}
