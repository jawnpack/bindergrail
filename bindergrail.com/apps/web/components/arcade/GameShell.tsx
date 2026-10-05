import Link from "next/link";
import type { ReactNode } from "react";
import GameTopBar from "./GameTopBar";
import GameKeys from "./GameKeys";
import { accentText } from "./ui";
import { CABINETS, type Accent } from "@/lib/arcade/config";

const marqueeBg: Record<Accent, string> = {
  gold: "bg-gold-400",
  blue: "bg-blue-400",
  cyan: "bg-cyan-300",
  magenta: "bg-magenta-400",
};

function Panel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-[3px] border-ink-600 bg-ink-900 p-4 shadow-[4px_4px_0_var(--color-ink-950)]">
      <span className="font-display text-[9px] text-gold-400">{label}</span>
      {children}
    </div>
  );
}

// The frame every cabinet renders inside. Phone: full-screen column under the top
// bar. Desktop (lg+): the same ~460px screen inside a bezel, with HOW TO PLAY /
// KEYBOARD on the left and stats / TODAY'S TOP 5 / MORE CABINETS on the right.
// The game screen (`children`) is rendered once and reused at both sizes.
export default function GameShell({
  id,
  title,
  accent,
  howToPlay,
  keys,
  tokens,
  stats,
  topScores,
  children,
}: {
  id: string;
  title: string;
  accent: Accent;
  howToPlay: string[];
  keys: { key: string; action: string }[];
  tokens?: number | null;
  stats?: ReactNode;
  topScores?: { name: string; score: string }[];
  children: ReactNode;
}) {
  const others = CABINETS.filter((c) => c.id !== id).slice(0, 3);
  const top = topScores ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <GameTopBar title={title} accent={accent} tokens={tokens} />
      <GameKeys />

      <div className="flex grow items-start justify-center gap-0 lg:gap-9 lg:p-7">
        {/* Left rail */}
        <aside className="hidden w-[290px] shrink-0 flex-col gap-[22px] lg:flex">
          <Panel label="HOW TO PLAY">
            <ol className="m-0 flex list-decimal flex-col gap-[6px] pl-5 font-body text-[16px] leading-[1.35]">
              {howToPlay.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </Panel>
          <Panel label="KEYBOARD">
            <div className="flex flex-col gap-3">
              {keys.map((k) => (
                <div key={k.key} className="flex items-center gap-3">
                  <span className="flex min-h-[36px] min-w-[44px] items-center justify-center bg-ink-800 px-2 font-display text-[8px] text-cream-100 shadow-[0_3px_0_var(--color-ink-600)] [border:3px_solid_var(--color-cream-100)]">
                    {k.key}
                  </span>
                  <span className="font-body text-[16px]">{k.action}</span>
                </div>
              ))}
            </div>
          </Panel>
        </aside>

        {/* Center cabinet / screen */}
        <div className="flex w-full grow flex-col lg:w-auto lg:grow-0 lg:border-[3px] lg:border-ink-600 lg:bg-ink-700 lg:p-[14px] lg:shadow-[8px_8px_0_var(--color-ink-950)]">
          <div
            className={`hidden h-10 items-center justify-center border-b-[3px] border-ink-950 font-display text-[13px] text-ink-950 lg:flex ${marqueeBg[accent]}`}
          >
            {title} #001
          </div>
          <div className="flex w-full grow flex-col bg-ink-900 lg:mx-auto lg:h-[586px] lg:w-[442px] lg:grow-0 lg:overflow-y-auto">
            {children}
          </div>
        </div>

        {/* Right rail */}
        <aside className="hidden w-[290px] shrink-0 flex-col gap-[22px] lg:flex">
          {stats ? <Panel label="YOUR STATS">{stats}</Panel> : null}
          <Panel label="TODAY'S TOP 5">
            <div className="flex flex-col gap-2">
              {[0, 1, 2, 3, 4].map((i) => {
                const row = top[i];
                return (
                  <div
                    key={i}
                    className="flex justify-between font-num text-[22px] leading-[1.1]"
                  >
                    <span>
                      {i + 1} {row ? row.name : "[PLAYER]"}
                    </span>
                    <span className="text-gold-400">{row ? row.score : "[--]"}</span>
                  </div>
                );
              })}
            </div>
          </Panel>
          <Panel label="MORE CABINETS">
            {others.map((c) => (
              <Link
                key={c.id}
                href={c.href}
                className="flex min-h-[44px] items-center justify-between border-[3px] border-ink-600 bg-ink-800 px-3 font-display text-[9px] text-cream-100 no-underline"
              >
                <span>{c.title}</span>
                <span className={accentText[c.accent]}>
                  {c.type.toUpperCase()}
                </span>
              </Link>
            ))}
          </Panel>
        </aside>
      </div>
    </div>
  );
}
