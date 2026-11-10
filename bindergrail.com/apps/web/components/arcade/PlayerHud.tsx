"use client";

import HudPill from "./HudPill";
import ArcadeButton from "./ArcadeButton";
import { usePlayer } from "./usePlayer";

// Lobby header: token + streak pills when signed in, SIGN IN otherwise. The
// slot keeps a fixed minimum height so the header doesn't grow (and push the
// page down) when the player data arrives after the static HTML paints.
// SIGN IN doesn't prefetch: /login uses the marketing layout, whose fonts the
// arcade doesn't use, and prefetching it would preload them here.
export default function PlayerHud() {
  const player = usePlayer();
  return (
    <div className="flex min-h-[50px] flex-wrap items-center gap-3">
      {player === null ? null : player.signedIn ? (
        <>
          <HudPill sprite="coin" value={player.tokens} label="TOKENS" />
          <HudPill
            sprite="flame"
            value={player.streak}
            label="DAY STREAK"
            valueClassName="text-cream-100"
          />
        </>
      ) : (
        <ArcadeButton href="/login" prefetch={false} variant="outline" size="sm">
          SIGN IN
        </ArcadeButton>
      )}
    </div>
  );
}
