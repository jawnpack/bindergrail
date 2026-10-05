import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getTokenBalance } from "@/lib/arcade/tokens";
import { dailySeed, puzzleLabel } from "@/lib/arcade/dailySeed";
import { getTodayPlay } from "@/lib/arcade/gutcheck/queries";
import GameShell from "@/components/arcade/GameShell";
import ComingSoonScreen from "@/components/arcade/ComingSoonScreen";
import CardFrame from "@/components/arcade/CardFrame";
import GutCheckGame from "@/components/arcade/gutcheck/GutCheckGame";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Gut Check — Guess the PSA Grade",
  description:
    "Gut Check is a daily card-grading game. Study a real, already-graded Pokémon card, predict its PSA grade, then see the confirmed grade and the visible clues behind it.",
  alternates: { canonical: "https://bindergrail.com/arcade/gut-check" },
  openGraph: {
    type: "website",
    siteName: "Binder Grail",
    title: "Gut Check — Guess the PSA Grade",
    description:
      "Predict the PSA grade of real graded Pokémon cards and learn what the graders see.",
    url: "https://bindergrail.com/arcade/gut-check",
  },
};

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

export default async function GutCheckPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const tokens = user ? await getTokenBalance(user.id) : null;
  const { number } = dailySeed();
  const play = await getTodayPlay();

  return (
    <>
      <GameShell
        id="gut-check"
        title="GUT CHECK"
        accent="gold"
        howToPlay={HOW_TO_PLAY}
        keys={KEYS}
        tokens={tokens}
      >
        {play ? (
          <GutCheckGame
            cards={play.cards}
            challengeDate={play.challenge.challenge_date}
            puzzleNumber={play.number}
            mode="daily"
          />
        ) : (
          <ComingSoonScreen
            title="GUT CHECK"
            accent="gold"
            tagline={`Daily ${puzzleLabel(number)} · 5 cards`}
            howToPlay={HOW_TO_PLAY}
            hero={<CardFrame rarity="grail" size="lg" insets={{ l: 20, r: 8, t: 10, b: 10 }} />}
          />
        )}
      </GameShell>

      {/* Crawlable SEO content — real HTML, not canvas. */}
      <section className="mx-auto max-w-[760px] px-6 py-12">
        <h1 className="m-0 font-display text-[18px] leading-[1.5] text-gold-400 [text-shadow:4px_4px_0_var(--color-gold-700)]">
          Can You Guess the PSA Grade? | Gut Check
        </h1>
        <p className="mt-5 font-body text-[18px] leading-[1.6] text-cream-100">
          Gut Check is a daily game for Pokémon collectors who want to get better at
          reading card condition. Each day you get five real, already-graded cards.
          Study the photos and the condition notes, predict the PSA grade, then see
          the confirmed grade and a short explanation of the visible clues — centering,
          corners, edges, surface and whitening.
        </p>
        <h2 className="mt-8 font-display text-[12px] text-cream-100">HOW IT WORKS</h2>
        <ol className="mt-3 flex list-decimal flex-col gap-2 pl-6 font-body text-[17px] leading-[1.5]">
          <li>Everyone gets the same five cards each day (resets at midnight ET).</li>
          <li>Call each grade from 1 to 10, with an optional confidence.</li>
          <li>
            Reveal the confirmed grade, how far off you were, and the clues behind it.
          </li>
          <li>Share your result as a grid: 🟩 exact, 🟨 within one, 🟥 further off.</li>
        </ol>
        <h2 className="mt-8 font-display text-[12px] text-cream-100">
          WHAT MOVES A GRADE
        </h2>
        <p className="mt-3 font-body text-[17px] leading-[1.6] text-cream-100">
          Graders weigh centering, corner sharpness, edge wear, surface scratches and
          print lines together — no single flaw decides a grade on its own. Gut Check
          is a skill and education game built on known graded examples; it won&apos;t
          tell you what an ungraded card will grade.
        </p>
        <p className="mt-6 font-body text-[14px] leading-[1.6] text-cream-400">
          Binder Grail is not affiliated with, endorsed by, or a partner of PSA.
          &ldquo;PSA grade&rdquo; refers to the grade PSA already assigned to the real
          example shown.
        </p>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "@id": "https://bindergrail.com/arcade/gut-check#game",
          name: "Gut Check",
          applicationCategory: "GameApplication",
          operatingSystem: "Web",
          url: "https://bindergrail.com/arcade/gut-check",
          description:
            "A daily Pokémon card-grading game. Predict the PSA grade of real graded cards and learn the visible clues behind each grade.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
    </>
  );
}
