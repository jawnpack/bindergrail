"use client";

import { useState } from "react";
import CabinetCard from "./CabinetCard";
import PixelSprite from "./PixelSprite";
import ArcadeButton from "./ArcadeButton";
import Chip from "./Chip";
import { CABINETS, type CabinetType } from "@/lib/arcade/config";

// The only client island on the lobby: filters the cabinet grid. Filter state is
// the one interactive bit; everything it renders is otherwise static.
type Filter = "all" | CabinetType;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "daily", label: "DAILY" },
  { id: "arcade", label: "ARCADE" },
  { id: "story", label: "STORY" },
];

function LockedCard({ title, blurb }: { title: string; blurb: string }) {
  return (
    <article className="flex flex-col border-[3px] border-dashed border-ink-600 bg-ink-900">
      <div className="flex h-44 flex-col items-center justify-center gap-[14px] border-b-[3px] border-dashed border-ink-600 bg-ink-950">
        <PixelSprite name="lock" height={28} className="text-stone-400" />
        <span className="font-display text-[10px] text-stone-400">COMING SOON</span>
      </div>
      <div className="flex grow flex-col gap-3 p-[18px]">
        <h3 className="m-0 font-display text-[14px] leading-[1.4] text-stone-400">
          {title}
        </h3>
        <p className="m-0 font-body text-[16px] text-cream-400">{blurb}</p>
        <div className="mt-auto pt-[6px]">
          <ArcadeButton href="#newsletter" variant="outline" size="sm">
            CAST A VOTE
          </ArcadeButton>
        </div>
      </div>
    </article>
  );
}

export default function SelectGame() {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = CABINETS.filter((c) => filter === "all" || c.type === filter);

  return (
    <section
      aria-labelledby="select-title"
      className="flex flex-col gap-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-[14px]">
        <h2
          id="select-title"
          className="m-0 font-display text-[18px] text-cream-100"
        >
          SELECT GAME
        </h2>
        <div role="group" aria-label="Filter games" className="flex flex-wrap gap-[10px]">
          {FILTERS.map((f) => {
            const on = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f.id)}
                className={`min-h-[44px] cursor-pointer border-[3px] px-[14px] font-display text-[10px] shadow-[3px_3px_0_var(--color-ink-950)] ${
                  on
                    ? "border-ink-950 bg-gold-400 text-ink-950"
                    : "border-ink-600 bg-ink-800 text-cream-100"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
        {shown.map((cabinet) => (
          <CabinetCard key={cabinet.id} cabinet={cabinet} />
        ))}
        {filter === "all" ? (
          <>
            <LockedCard
              title="NEXT CABINET"
              blurb="Vote for the next game in the Common Rare newsletter."
            />
            <article className="flex flex-col border-[3px] border-dashed border-ink-600 bg-ink-900">
              <div className="flex h-44 flex-col items-center justify-center gap-[14px] border-b-[3px] border-dashed border-ink-600 bg-ink-950">
                <PixelSprite name="lock" height={28} className="text-stone-400" />
                <span className="font-display text-[10px] text-stone-400">
                  COMING SOON
                </span>
              </div>
              <div className="flex grow flex-col gap-3 p-[18px]">
                <div className="flex gap-2">
                  <Chip tone="soon" />
                </div>
                <h3 className="m-0 font-display text-[14px] text-stone-400">???</h3>
                <p className="m-0 font-body text-[16px] text-cream-400">
                  This cabinet is still being wired up.
                </p>
              </div>
            </article>
          </>
        ) : null}
      </div>
    </section>
  );
}
