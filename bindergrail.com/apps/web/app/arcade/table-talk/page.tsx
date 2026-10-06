import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getTokenBalance } from "@/lib/arcade/tokens";
import GameShell from "@/components/arcade/GameShell";
import TableTalkGame from "@/components/arcade/tabletalk/TableTalkGame";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Table Talk — Haggle at the Card Show",
  description:
    "Table Talk is an endless card-show haggling game. Read the vendor, pick your tactics, talk the price down, and bank the biggest discount before you get thrown out.",
  alternates: { canonical: "https://bindergrail.com/arcade/table-talk" },
  openGraph: {
    type: "website",
    siteName: "Binder Grail",
    title: "Table Talk — Haggle at the Card Show",
    description:
      "Work the table, read the vendor, and walk away with the biggest discount.",
    url: "https://bindergrail.com/arcade/table-talk",
  },
};

const HOW_TO_PLAY = [
  "A vendor offers a card at their asking price.",
  "Use tactics to talk the price down — watch how they react.",
  "Buy or walk away, but don't push them into throwing you out.",
];

const KEYS = [
  { key: "TAB", action: "Move between tactics" },
  { key: "ENTER", action: "Activate" },
  { key: "ESC", action: "Back to lobby" },
];

export default async function TableTalkPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const tokens = user ? await getTokenBalance(user.id) : null;

  return (
    <>
      <GameShell
        id="table-talk"
        title="TABLE TALK"
        accent="cyan"
        howToPlay={HOW_TO_PLAY}
        keys={KEYS}
        tokens={tokens}
      >
        <TableTalkGame />
      </GameShell>

      <section className="mx-auto max-w-[760px] px-6 py-12">
        <h1 className="m-0 font-display text-[18px] leading-[1.5] text-cyan-300 [text-shadow:4px_4px_0_var(--color-ink-800)]">
          Table Talk — Haggle at the Card Show
        </h1>
        <p className="mt-5 font-body text-[18px] leading-[1.6] text-cream-100">
          Table Talk is a card-show bargaining game. Each vendor offers a card at a
          marked-up price, and it&apos;s on you to talk them down. Read their mood,
          pick the right tactic, and know when to buy or walk — but push too hard and
          they&apos;ll have you thrown out of the convention.
        </p>
        <h2 className="mt-8 font-display text-[12px] text-cream-100">THE VENDORS</h2>
        <ul className="mt-3 flex list-disc flex-col gap-2 pl-6 font-body text-[17px] leading-[1.5]">
          <li>
            <strong>The Friendly Collector</strong> — loves the hobby. Build rapport
            before you push.
          </li>
          <li>
            <strong>The Busy Dealer</strong> — distracted and time-pressed. Strike
            fast, keep it moving.
          </li>
          <li>
            <strong>The Tough Negotiator</strong> — knows every comp. Subtlety works;
            bullying backfires.
          </li>
        </ul>
        <h2 className="mt-8 font-display text-[12px] text-cream-100">SCORING</h2>
        <p className="mt-3 font-body text-[17px] leading-[1.6] text-cream-100">
          Your score is the total money you save off asking price across every card
          you buy in a run. Modern cards are the safe warm-up, Vintage the big swings.
          Walking away is free — only an angry vendor ends the run.
        </p>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "@id": "https://bindergrail.com/arcade/table-talk#game",
          name: "Table Talk",
          applicationCategory: "GameApplication",
          operatingSystem: "Web",
          url: "https://bindergrail.com/arcade/table-talk",
          description:
            "An endless card-show haggling game: read the vendor, pick your tactics, and bank the biggest discount before you get thrown out.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
    </>
  );
}
