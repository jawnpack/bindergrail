import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getTokenBalance } from "@/lib/arcade/tokens";
import GameShell from "@/components/arcade/GameShell";
import ComingSoonScreen from "@/components/arcade/ComingSoonScreen";
import TextBox from "@/components/arcade/TextBox";

export const metadata: Metadata = {
  title: "Table Talk",
  description:
    "Table Talk — an arcade haggling game. Talk a card-show vendor down to his floor price before he loses patience.",
  alternates: { canonical: "https://bindergrail.com/arcade/table-talk" },
};

const HOW_TO_PLAY = [
  "Every vendor has a secret floor price.",
  "You get three offers. Watch for tells.",
  "Lowballs cost patience. Run out and he walks.",
];

const KEYS = [
  { key: "▲ ▼", action: "Raise / lower offer" },
  { key: "ENTER", action: "Make offer" },
  { key: "ESC", action: "Back to lobby" },
];

export default async function TableTalkPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const tokens = user ? await getTokenBalance(user.id) : null;

  return (
    <GameShell
      id="table-talk"
      title="TABLE TALK"
      accent="cyan"
      howToPlay={HOW_TO_PLAY}
      keys={KEYS}
      tokens={tokens}
    >
      <ComingSoonScreen
        title="TABLE TALK"
        accent="cyan"
        tagline="Arcade · endless vendors"
        howToPlay={HOW_TO_PLAY}
        hero={
          <div className="w-full max-w-[280px]">
            <TextBox
              speaker="BIG SAL"
              line="You buying or just looking? Clock's ticking, pal."
            />
          </div>
        }
      />
    </GameShell>
  );
}
