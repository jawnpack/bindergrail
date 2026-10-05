import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getTokenBalance } from "@/lib/arcade/tokens";
import { dailySeed } from "@/lib/arcade/dailySeed";
import { getPracticeCards } from "@/lib/arcade/gutcheck/queries";
import { DAILY_SIZE } from "@/lib/arcade/gutcheck/config";
import GameShell from "@/components/arcade/GameShell";
import ComingSoonScreen from "@/components/arcade/ComingSoonScreen";
import CardFrame from "@/components/arcade/CardFrame";
import GutCheckGame from "@/components/arcade/gutcheck/GutCheckGame";

export const metadata: Metadata = {
  title: "Gut Check — Practice",
  description:
    "Unlimited Gut Check practice: predict the PSA grade of real graded Pokémon cards, as many rounds as you want.",
  alternates: { canonical: "https://bindergrail.com/arcade/gut-check/practice" },
};

// Practice never caches — each visit pulls a fresh sample.
export const dynamic = "force-dynamic";

const HOW_TO_PLAY = [
  "Study the card — front, back and the condition notes.",
  "Call the grade from 1 to 10.",
  "Reveal the confirmed grade and the clues behind it.",
];

const KEYS = [
  { key: "1-0", action: "Call the grade" },
  { key: "ENTER", action: "Lock in / next" },
  { key: "ESC", action: "Back to lobby" },
];

export default async function GutCheckPracticePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const tokens = user ? await getTokenBalance(user.id) : null;
  const { number } = dailySeed();
  const cards = await getPracticeCards(DAILY_SIZE);

  return (
    <GameShell
      id="gut-check"
      title="GUT CHECK · PRACTICE"
      accent="gold"
      howToPlay={HOW_TO_PLAY}
      keys={KEYS}
      tokens={tokens}
    >
      {cards.length > 0 ? (
        <GutCheckGame
          cards={cards}
          challengeDate={null}
          puzzleNumber={number}
          mode="practice"
        />
      ) : (
        <ComingSoonScreen
          title="GUT CHECK"
          accent="gold"
          tagline="Practice mode"
          howToPlay={HOW_TO_PLAY}
          hero={<CardFrame rarity="grail" size="lg" insets={{ l: 20, r: 8, t: 10, b: 10 }} />}
        />
      )}
    </GameShell>
  );
}
