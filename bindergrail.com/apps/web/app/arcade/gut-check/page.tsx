import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getTokenBalance } from "@/lib/arcade/tokens";
import { dailySeed, puzzleLabel } from "@/lib/arcade/dailySeed";
import GameShell from "@/components/arcade/GameShell";
import ComingSoonScreen from "@/components/arcade/ComingSoonScreen";
import CardFrame from "@/components/arcade/CardFrame";

export const metadata: Metadata = {
  title: "Gut Check",
  description:
    "Gut Check — a daily Pokémon grading game. Read the condition report and call the grade on five raw cards.",
  alternates: { canonical: "https://bindergrail.com/arcade/gut-check" },
};

const HOW_TO_PLAY = [
  "Read the card and the inspector's notes.",
  "Call the grade from 1 to 10.",
  "Dead on scores 3. Off by one scores 1.",
];

const KEYS = [
  { key: "1-0", action: "Call the grade" },
  { key: "ENTER", action: "Lock in / next" },
  { key: "ESC", action: "Back to lobby" },
];

export default async function GutCheckPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const tokens = user ? await getTokenBalance(user.id) : null;
  const { number } = dailySeed();

  return (
    <GameShell
      id="gut-check"
      title="GUT CHECK"
      accent="gold"
      howToPlay={HOW_TO_PLAY}
      keys={KEYS}
      tokens={tokens}
    >
      <ComingSoonScreen
        title="GUT CHECK"
        accent="gold"
        tagline={`Daily ${puzzleLabel(number)} · 5 cards`}
        howToPlay={HOW_TO_PLAY}
        hero={<CardFrame rarity="grail" size="lg" insets={{ l: 20, r: 8, t: 10, b: 10 }} />}
      />
    </GameShell>
  );
}
