"use client";

import { usePlayer } from "./usePlayer";

// Signed-in only: the player's best Cardboard Flip run (unchanged from when this
// rendered on the server — signed-out visitors see nothing here).
export default function FeaturedBest() {
  const player = usePlayer();
  if (!player || !player.signedIn) return null;
  return (
    <div className="border-[3px] border-ink-600 bg-ink-800 p-[14px]">
      <div className="font-display text-[9px] text-cream-400">YOUR BEST RUN</div>
      <div className="font-num text-[30px] leading-[1.1] text-cream-100">
        {player.flipBest != null ? String(player.flipBest) : "NO RUNS YET"}
      </div>
    </div>
  );
}
