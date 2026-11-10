"use client";

import StreakStrip from "./StreakStrip";
import { usePlayer } from "./usePlayer";

// Signed-in only daily streak strip.
export default function PlayerStreak() {
  const player = usePlayer();
  if (!player || !player.signedIn) return null;
  return <StreakStrip streak={player.streak} />;
}
