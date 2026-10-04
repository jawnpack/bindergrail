import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getTokenBalance } from "@/lib/arcade/tokens";
import { dailySeed, puzzleLabel } from "@/lib/arcade/dailySeed";
import GameShell from "@/components/arcade/GameShell";
import ComingSoonScreen from "@/components/arcade/ComingSoonScreen";
import PixelSprite from "@/components/arcade/PixelSprite";

export const metadata: Metadata = {
  title: "Comp Check",
  description:
    "Comp Check — a daily Pokémon price game. Did the next card sell for more or less? Build the longest streak.",
  alternates: { canonical: "https://bindergrail.com/arcade/comp-check" },
};

const HOW_TO_PLAY = [
  "See what the last card sold for.",
  "Guess if the next one sold for more or less.",
  "One wrong call ends your streak.",
];

const KEYS = [
  { key: "▲ ▼", action: "Higher / lower" },
  { key: "ENTER", action: "Next card" },
  { key: "ESC", action: "Back to lobby" },
];

export default async function CompCheckPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const tokens = user ? await getTokenBalance(user.id) : null;
  const { number } = dailySeed();

  return (
    <GameShell
      id="comp-check"
      title="COMP CHECK"
      accent="blue"
      howToPlay={HOW_TO_PLAY}
      keys={KEYS}
      tokens={tokens}
    >
      <ComingSoonScreen
        title="COMP CHECK"
        accent="blue"
        tagline={`Daily ${puzzleLabel(number)} · 10-card chain`}
        howToPlay={HOW_TO_PLAY}
        hero={
          <div className="flex flex-col items-center gap-2">
            <span className="font-num text-[46px] leading-none text-cream-100">
              $42.00
            </span>
            <div className="flex gap-4">
              <PixelSprite name="arrow-up" height={16} className="text-gold-400" />
              <PixelSprite name="arrow-down" height={16} className="text-blue-400" />
            </div>
            <span className="font-num text-[46px] leading-none text-cyan-300 motion-safe:animate-[bgaBlink_1.2s_steps(1,end)_infinite]">
              $??.??
            </span>
          </div>
        }
      />
    </GameShell>
  );
}
