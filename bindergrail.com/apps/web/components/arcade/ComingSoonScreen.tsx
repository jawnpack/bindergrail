import type { ReactNode } from "react";
import ArcadeButton from "./ArcadeButton";
import { RIM, accentText, accentShadow } from "./ui";
import type { Accent } from "@/lib/arcade/config";

// Placeholder title screen shown inside GameShell until a game's logic lands.
// Renders the attract screen plus the rules, so it reads on phone (where the
// side panels are hidden) as well as desktop.
export default function ComingSoonScreen({
  title,
  accent,
  tagline,
  howToPlay,
  hero,
}: {
  title: string;
  accent: Accent;
  tagline: string;
  howToPlay: string[];
  hero?: ReactNode;
}) {
  return (
    <div className="flex grow flex-col items-center gap-5 p-6 text-center">
      <span className="font-body text-[15px] text-cream-400">{tagline}</span>
      <h1
        className={`m-0 font-display text-[30px] leading-[1.3] ${accentText[accent]} ${accentShadow[accent]}`}
      >
        {title}
      </h1>

      {hero ? <div className="flex items-center justify-center py-1">{hero}</div> : null}

      <div className={`w-full bg-ink-800 p-4 text-left ${RIM}`}>
        <span className="font-display text-[9px] text-gold-400">HOW TO PLAY</span>
        <ol className="m-0 mt-2 flex list-decimal flex-col gap-1 pl-5 font-body text-[16px] leading-[1.35]">
          {howToPlay.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      <ArcadeButton disabled className="w-full">
        COMING SOON
      </ArcadeButton>
      <span className="font-body text-[14px] text-cream-400">
        This cabinet is being wired up. New dailies drop at midnight ET.
      </span>
    </div>
  );
}
