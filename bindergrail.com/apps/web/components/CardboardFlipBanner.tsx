import { Press_Start_2P } from "next/font/google";

// Pixel font to match the game's arcade look. Only loads on pages that show the banner.
const pixel = Press_Start_2P({ subsets: ["latin"], weight: "400", display: "swap" });

// The game is a static page served by a rewrite, so use a plain <a> (full page
// load) rather than next/link client navigation.
const GAME_URL = "/games/thecardboardflip";

type Variant = "feature" | "strip";

export default function CardboardFlipBanner({ variant = "strip" }: { variant?: Variant }) {
  return variant === "feature" ? <Feature /> : <Strip />;
}

function Feature() {
  return (
    <section className="bg-ink border-t border-dust/30">
      <div className="max-w-5xl mx-auto px-6 py-14 md:py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] mb-4 text-amber">
            New · A Binder Grail game · Free demo
          </p>
          <h2 className={`${pixel.className} text-[22px] md:text-[28px] leading-[1.35] mb-5 text-cream`}>
            The Cardboard Flip
          </h2>
          <p className="text-[15px] leading-relaxed mb-6 text-dust max-w-md">
            Sneaker resale is dead. You&apos;ve got $1,500, 30 days, and a card shop across the
            street. Read the rumors, flip the hype, and open your own shop before rent catches up
            with you.
          </p>
          <ul className="flex flex-wrap gap-2 mb-8">
            {["Plays in your browser", "No sign-up", "A new market every day"].map((label) => (
              <li
                key={label}
                className="text-[12px] font-medium px-2.5 py-1 rounded-sm border border-dust/40 text-cream"
              >
                {label}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={GAME_URL}
              className="rounded-sm px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-80 bg-amber text-cream"
            >
              Play free →
            </a>
            <span className="text-[13px] text-dust">About 10 minutes a run</span>
          </div>
        </div>

        {/* A peek at the game screen, drawn in text like the game itself */}
        <a
          href={GAME_URL}
          aria-label="Play The Cardboard Flip"
          className={`${pixel.className} block rounded-sm border-2 border-cream bg-ink text-cream text-[9px] md:text-[10px] leading-[1.9] transition-opacity hover:opacity-90`}
        >
          <div className="flex justify-between px-3 py-2 bg-cream text-ink">
            <span>DAY 4 · THU</span>
            <span>$3,212</span>
          </div>
          <div className="px-3 py-3 border-b-2 border-cream">
            <p className="text-dust mb-1">THE FEED</p>
            <p>LEAKER: A mega-streamer is opening a case of Dark Flames live this week.</p>
          </div>
          <div className="px-3 py-2">
            {[
              ["Dark Flames", "$163"],
              ["Masks of Dawn", "$141"],
              ["The Base Set", "$600"],
            ].map(([name, price]) => (
              <div key={name} className="flex justify-between items-center py-1.5 border-b border-dashed border-dust/50 last:border-0">
                <span>{name}</span>
                <span className="flex items-center gap-2">
                  {price}
                  <span className="px-1.5 py-0.5 bg-cream text-ink">BUY</span>
                </span>
              </div>
            ))}
          </div>
          <div className="px-3 py-2 bg-cream text-ink text-center">NEXT DAY ▶</div>
        </a>
      </div>
    </section>
  );
}

function Strip() {
  return (
    <a
      href={GAME_URL}
      className="group block rounded-sm bg-ink px-5 py-4 transition-opacity hover:opacity-95"
    >
      <span className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5">
        <span className={`${pixel.className} text-[11px] leading-[1.6] text-cream shrink-0`}>
          The Cardboard Flip
        </span>
        <span className="text-[13px] leading-snug text-dust flex-1">
          Can you flip $1,500 into your own card shop in 30 days? A free game from Binder Grail.
        </span>
        <span className="text-[13px] font-medium text-amber shrink-0 group-hover:underline">
          Play the demo →
        </span>
      </span>
    </a>
  );
}
