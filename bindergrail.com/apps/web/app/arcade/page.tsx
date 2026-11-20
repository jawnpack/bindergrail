import Link from "next/link";
import { dailySeed, puzzleLabel } from "@/lib/arcade/dailySeed";
import { getCabinet, isLaunched } from "@/lib/arcade/config";
import PixelSprite from "@/components/arcade/PixelSprite";
import ArcadeButton from "@/components/arcade/ArcadeButton";
import MarqueeTicker from "@/components/arcade/MarqueeTicker";
import FeaturedCabinet from "@/components/arcade/FeaturedCabinet";
import DailyTile from "@/components/arcade/DailyTile";
import SelectGame from "@/components/arcade/SelectGame";
import PlayerHud from "@/components/arcade/PlayerHud";
import PlayerStreak from "@/components/arcade/PlayerStreak";

function dateLabel(dateET: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(dateET + "T12:00:00Z"));
}

// Static, regenerated every 5 minutes so the date-driven parts (daily number,
// date label) roll over shortly after midnight ET. Everything personal — sign
// in, tokens, streak, best run — is a client island fed by /api/arcade/me.
export const revalidate = 300;

export default function ArcadeLobby() {
  const { number, dateET } = dailySeed();
  const n = puzzleLabel(number);
  const flip = getCabinet("cardboard-flip")!;

  const ticker = [
    "INSERT COIN",
    ...(isLaunched("gut-check") || isLaunched("comp-check")
      ? ["NEW DAILIES AT MIDNIGHT ET"]
      : ["DAILY GAMES COMING SOON"]),
    ...(isLaunched("gut-check") ? [`GUT CHECK ${n} IS LIVE`] : []),
    ...(isLaunched("comp-check") ? [`COMP CHECK ${n} IS LIVE`] : []),
    "CAN YOU OPEN YOUR SHOP BY DAY 30?",
  ];

  const frameTiers: { label: string; cost: string; border: string; extra?: string }[] =
    [
      { label: "COMMON", cost: "FREE", border: "border-stone-400" },
      { label: "RARE", cost: "50 TOKENS", border: "border-cyan-300" },
      {
        label: "HOLO",
        cost: "150 TOKENS",
        border: "border-magenta-400",
        extra: "shadow-[inset_0_0_0_3px_var(--color-cyan-300)]",
      },
      {
        label: "GRAIL",
        cost: "500 TOKENS",
        border: "border-amber-bright",
        extra: "shadow-[inset_0_0_0_3px_var(--color-amber)]",
      },
    ];

  return (
    <>
      {/* Header */}
      <header className="border-b-[3px] border-ink-700 bg-ink-900">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-5 px-6 py-5">
          <div className="flex flex-col gap-1">
            <a
              href="https://bindergrail.com"
              className="inline-flex min-h-11 items-center gap-2 font-display text-arc-12 text-cream-400 no-underline hover:text-cream-100"
            >
              <PixelSprite name="back" height={11} />
              BINDERGRAIL.COM
            </a>
            <h1 className="m-0 font-display text-arc-24 leading-[1.25] text-amber-bright [text-shadow:4px_4px_0_var(--color-amber)] md:text-arc-24">
              BINDER GRAIL ARCADE
            </h1>
          </div>
          <PlayerHud />
        </div>
      </header>

      <MarqueeTicker items={ticker} />

      <main className="mx-auto flex max-w-[1200px] flex-col gap-14 px-6 py-11">
        <FeaturedCabinet cabinet={flip} />

        {/* Today's dailies */}
        <section aria-labelledby="dailies-title" className="flex flex-col gap-5">
          <div className="flex flex-wrap items-baseline justify-between gap-[10px]">
            <h2
              id="dailies-title"
              className="m-0 font-display text-arc-18 text-cream-100"
            >
              TODAY&apos;S DAILIES
            </h2>
            <span className="font-body text-arc-16 text-cream-400">
              {dateLabel(dateET)} · resets at midnight ET
            </span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
            <DailyTile
              numberLabel={n}
              title="GUT CHECK"
              desc="Five raw cards. Call the grade."
              href="/arcade/gut-check"
              accent="gold"
              stateLabel="NOT PLAYED"
              launched={isLaunched("gut-check")}
            />
            <DailyTile
              numberLabel={n}
              title="COMP CHECK"
              desc="Higher or lower on sold prices."
              href="/arcade/comp-check"
              accent="blue"
              stateLabel="NOT PLAYED"
              launched={isLaunched("comp-check")}
            />
            {isLaunched("gut-check") || isLaunched("comp-check") ? (
              <PlayerStreak />
            ) : null}
          </div>
        </section>

        <SelectGame />

        {/* How tokens work */}
        <section
          aria-labelledby="tokens-title"
          className="flex flex-wrap items-stretch gap-7"
        >
          <div className="flex min-w-0 flex-1 basis-[360px] flex-col gap-[14px] border-[3px] border-cream-100 bg-ink-800 p-6 shadow-[0_0_0_3px_var(--color-ink-950),6px_6px_0_3px_var(--color-ink-950)]">
            <h2
              id="tokens-title"
              className="m-0 font-display text-arc-16 text-amber-bright"
            >
              HOW TOKENS WORK
            </h2>
            <p className="m-0 font-body text-arc-16 leading-[1.45] text-cream-100">
              Play as much as you want — the arcade is free, forever. Tokens are{" "}
              <span className="text-amber-bright">earned by playing</span>, never for
              sale.
            </p>
            <ol className="m-0 flex list-decimal flex-col gap-2 pl-[22px] font-body text-arc-16 leading-[1.45]">
              <li>Play any cabinet — unlimited runs.</li>
              <li>
                Earn tokens for clearing dailies, keeping streaks and posting high
                scores.
              </li>
              <li>Spend them on card frames for your share cards and name.</li>
            </ol>
            <p className="m-0 font-body text-arc-16 leading-[1.45] text-cream-400">
              Paid upgrades (coming soon): color themes and in-game enhancements —
              cosmetic and optional. Never pay-to-play, never pay-to-win.
            </p>
          </div>
          <div className="grid min-w-0 flex-1 basis-[520px] grid-cols-4 gap-4">
            {frameTiers.map((t) => (
              <div
                key={t.label}
                className="flex flex-col items-center gap-[10px] border-[3px] border-ink-600 bg-ink-900 p-4"
              >
                <div
                  className={`h-[88px] w-16 rounded-[4px] border-[6px] bg-ink-700 ${t.border} ${t.extra ?? ""}`}
                />
                <span className="font-display text-arc-12 text-cream-100">
                  {t.label}
                </span>
                <span className="font-num text-arc-24 leading-none text-amber-bright">
                  {t.cost}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Common Rare band */}
        <section
          id="newsletter"
          aria-labelledby="news-title"
          className="flex flex-wrap items-center justify-between gap-5 border-[3px] border-amber-bright bg-ink-900 p-7 shadow-[6px_6px_0_var(--color-ink-950)]"
        >
          <div className="flex min-w-0 flex-1 basis-[420px] flex-col gap-[10px]">
            <h2 id="news-title" className="m-0 font-display text-arc-16 text-amber-bright">
              MISSED A DAILY?
            </h2>
            <p className="m-0 font-body text-arc-18 text-cream-100">
              Every Friday, Common Rare recaps the week&apos;s answers, high scores
              and the cards that stumped everyone.
            </p>
          </div>
          <ArcadeButton href="https://commonrare.bindergrail.com">
            READ COMMON RARE
          </ArcadeButton>
        </section>
      </main>

      {/* Footer */}
      <footer
        id="scores"
        className="border-t-[3px] border-ink-700 bg-ink-900"
      >
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-6">
          <span className="font-display text-arc-12 text-stone-400">
            BINDER GRAIL ARCADE 2026
          </span>
          <nav aria-label="Arcade" className="flex flex-wrap gap-x-6 font-display text-arc-12">
            <a href="#scores" className="inline-flex min-h-11 items-center text-cream-400 no-underline hover:text-cream-100">
              HIGH SCORES
            </a>
            <Link href="/arcade" className="inline-flex min-h-11 items-center text-cream-400 no-underline hover:text-cream-100">
              HOW TO PLAY
            </Link>
            <a href="https://bindergrail.com" className="inline-flex min-h-11 items-center text-cream-400 no-underline hover:text-cream-100">
              BINDERGRAIL.COM
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
