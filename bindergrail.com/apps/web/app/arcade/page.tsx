import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { dailySeed, puzzleLabel } from "@/lib/arcade/dailySeed";
import { getTokenBalance } from "@/lib/arcade/tokens";
import { getDailyStreak } from "@/lib/arcade/streak";
import { getUserBest } from "@/lib/arcade/leaderboard";
import { getCabinet } from "@/lib/arcade/config";
import PixelSprite from "@/components/arcade/PixelSprite";
import HudPill from "@/components/arcade/HudPill";
import ArcadeButton from "@/components/arcade/ArcadeButton";
import MarqueeTicker from "@/components/arcade/MarqueeTicker";
import FeaturedCabinet from "@/components/arcade/FeaturedCabinet";
import DailyTile from "@/components/arcade/DailyTile";
import StreakStrip from "@/components/arcade/StreakStrip";
import SelectGame from "@/components/arcade/SelectGame";

function dateLabel(dateET: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(dateET + "T12:00:00Z"));
}

export default async function ArcadeLobby() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const signedIn = !!user;

  const [tokens, streak, flipBest] = user
    ? await Promise.all([
        getTokenBalance(user.id),
        getDailyStreak(user.id),
        getUserBest("cardboard-flip"),
      ])
    : [null, 0, null];

  const { number, dateET } = dailySeed();
  const n = puzzleLabel(number);
  const flip = getCabinet("cardboard-flip")!;

  const ticker = [
    "INSERT COIN",
    "NEW DAILIES AT MIDNIGHT ET",
    `GUT CHECK ${n} IS LIVE`,
    `COMP CHECK ${n} IS LIVE`,
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
        border: "border-gold-400",
        extra: "shadow-[inset_0_0_0_3px_var(--color-gold-700)]",
      },
    ];

  return (
    <>
      {/* Header */}
      <header className="border-b-[3px] border-ink-700 bg-ink-900">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-5 px-6 py-5">
          <div className="flex flex-col gap-[10px]">
            <a
              href="https://bindergrail.com"
              className="inline-flex items-center gap-2 font-display text-[10px] text-cream-400 no-underline"
            >
              <PixelSprite name="back" height={11} />
              BINDERGRAIL.COM
            </a>
            <h1 className="m-0 font-display text-[22px] leading-[1.25] text-gold-400 [text-shadow:4px_4px_0_var(--color-gold-700)] md:text-[26px]">
              BINDER GRAIL ARCADE
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {signedIn ? (
              <>
                <HudPill sprite="coin" value={tokens ?? 0} label="TOKENS" />
                <HudPill
                  sprite="flame"
                  value={streak}
                  label="DAY STREAK"
                  valueClassName="text-cream-100"
                />
              </>
            ) : (
              <ArcadeButton href="/login" variant="outline" size="sm">
                SIGN IN
              </ArcadeButton>
            )}
          </div>
        </div>
      </header>

      <MarqueeTicker items={ticker} />

      <main className="mx-auto flex max-w-[1200px] flex-col gap-14 px-6 py-11">
        <FeaturedCabinet
          cabinet={flip}
          signedIn={signedIn}
          best={flipBest != null ? String(flipBest) : null}
        />

        {/* Today's dailies */}
        <section aria-labelledby="dailies-title" className="flex flex-col gap-5">
          <div className="flex flex-wrap items-baseline justify-between gap-[10px]">
            <h2
              id="dailies-title"
              className="m-0 font-display text-[18px] text-cream-100"
            >
              TODAY&apos;S DAILIES
            </h2>
            <span className="font-body text-[16px] text-cream-400">
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
            />
            <DailyTile
              numberLabel={n}
              title="COMP CHECK"
              desc="Higher or lower on sold prices."
              href="/arcade/comp-check"
              accent="blue"
              stateLabel="NOT PLAYED"
            />
            {signedIn ? <StreakStrip streak={streak} /> : null}
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
              className="m-0 font-display text-[15px] text-gold-400"
            >
              HOW TOKENS WORK
            </h2>
            <p className="m-0 font-body text-[17px] leading-[1.45] text-cream-100">
              Play as much as you want — the arcade is free, forever. Tokens are{" "}
              <span className="text-gold-400">earned by playing</span>, never for
              sale.
            </p>
            <ol className="m-0 flex list-decimal flex-col gap-2 pl-[22px] font-body text-[17px] leading-[1.45]">
              <li>Play any cabinet — unlimited runs.</li>
              <li>
                Earn tokens for clearing dailies, keeping streaks and posting high
                scores.
              </li>
              <li>Spend them on card frames for your share cards and name.</li>
            </ol>
            <p className="m-0 font-body text-[15px] leading-[1.45] text-cream-400">
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
                <span className="font-display text-[9px] text-cream-100">
                  {t.label}
                </span>
                <span className="font-num text-[22px] leading-none text-gold-400">
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
          className="flex flex-wrap items-center justify-between gap-5 border-[3px] border-gold-400 bg-ink-900 p-7 shadow-[6px_6px_0_var(--color-ink-950)]"
        >
          <div className="flex min-w-0 flex-1 basis-[420px] flex-col gap-[10px]">
            <h2 id="news-title" className="m-0 font-display text-[15px] text-gold-400">
              MISSED A DAILY?
            </h2>
            <p className="m-0 font-body text-[18px] text-cream-100">
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
          <span className="font-display text-[9px] text-stone-400">
            BINDER GRAIL ARCADE 2026
          </span>
          <nav aria-label="Arcade" className="flex flex-wrap gap-[22px] font-display text-[9px]">
            <a href="#scores" className="text-cream-400 no-underline">
              HIGH SCORES
            </a>
            <Link href="/arcade" className="text-cream-400 no-underline">
              HOW TO PLAY
            </Link>
            <a href="https://bindergrail.com" className="text-cream-400 no-underline">
              BINDERGRAIL.COM
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
