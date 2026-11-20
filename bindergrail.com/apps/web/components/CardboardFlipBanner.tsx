import { flipPixel as pixel } from "./flip-font";
import Band from "@/components/ui/Band";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import Chip from "@/components/ui/Chip";
import Button from "@/components/ui/Button";

// The game is a static page served by a rewrite, so links are plain <a> (full
// page load) rather than next/link client navigation.
const GAME_URL = "/games/thecardboardflip";

type Variant = "feature" | "strip";

export default function CardboardFlipBanner({ variant = "strip" }: { variant?: Variant }) {
  return variant === "feature" ? <Feature /> : <Strip />;
}

function Feature() {
  return (
    <Band surface="ink" rhythm="tight" labelledBy="flip-title">
      <Container width="content" className="grid items-center gap-10 md:grid-cols-12">
        <div className="md:col-span-6">
          <Kicker surface="ink" className="mb-4">
            New · A Binder Grail game · Free demo
          </Kicker>
          <h2 id="flip-title" className={`${pixel.className} mb-5 text-pixel-title text-on-ink`}>
            The Cardboard Flip
          </h2>
          <p className="mb-6 max-w-measure-lead text-ui text-pretty text-on-ink-muted">
            Sneaker resale is dead. You&apos;ve got $1,500, 30 days, and a card shop across the
            street. Read the rumors, flip the hype, and open your own shop before rent catches up
            with you.
          </p>
          <ul className="mb-8 flex flex-wrap gap-2">
            {["Plays in your browser", "No sign-up", "A new market every day"].map((label) => (
              <li key={label}>
                <Chip surface="ink">{label}</Chip>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Button href={GAME_URL} variant="primary" arrow>
              Play free
            </Button>
            <span className="text-meta text-on-ink-muted">About 10 minutes a run</span>
          </div>
        </div>

        {/* A peek at the game screen, drawn in text like the game itself */}
        <a
          href={GAME_URL}
          aria-label="Play The Cardboard Flip"
          className={`${pixel.className} block rounded-sm border-2 border-on-ink bg-ink text-pixel text-on-ink transition-[border-color,transform] duration-(--dur) ease-almanac hover:-translate-y-0.5 hover:border-amber-bright md:col-span-6`}
        >
          <div className="flex justify-between gap-3 bg-on-ink px-3 py-2 text-ink">
            <span>DAY 4 · THU</span>
            <span>$3,212</span>
          </div>
          <div className="border-b-2 border-on-ink px-3 py-3">
            <p className="mb-1 text-on-ink-muted">THE FEED</p>
            <p>LEAKER: A mega-streamer is opening a case of Dark Flames live this week.</p>
          </div>
          <div className="px-3 py-2">
            {[
              ["Dark Flames", "$163"],
              ["Masks of Dawn", "$141"],
              ["The Base Set", "$600"],
            ].map(([name, price]) => (
              <div
                key={name}
                className="flex items-center justify-between gap-3 border-b border-dashed border-ink-hairline py-1.5 last:border-0"
              >
                <span>{name}</span>
                <span className="flex items-center gap-2">
                  {price}
                  <span className="bg-on-ink px-1.5 py-0.5 text-ink">BUY</span>
                </span>
              </div>
            ))}
          </div>
          <div className="bg-on-ink px-3 py-2 text-center text-ink">NEXT DAY ▶</div>
        </a>
      </Container>
    </Band>
  );
}

function Strip() {
  return (
    <a
      href={GAME_URL}
      className="group block rounded-md border border-ink-hairline bg-ink px-5 py-4 transition-[border-color,transform] duration-(--dur) ease-almanac hover:-translate-y-0.5 hover:border-amber-bright"
    >
      <span className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
        {/* Press Start 2P is monospaced at 1em per glyph, so this title is
            exactly 18em wide. Fixing the width keeps the row from reflowing
            when the (non-preloaded) pixel font swaps in. */}
        <span className={`${pixel.className} shrink-0 whitespace-nowrap text-pixel text-on-ink sm:w-[18em]`}>
          The Cardboard Flip
        </span>
        <span className="flex-1 text-meta text-on-ink-muted">
          Can you flip $1,500 into your own card shop in 30 days? A free game from Binder Grail.
        </span>
        <span className="shrink-0 text-meta font-medium text-amber-bright">
          <span className="link-grow">Play the demo</span> →
        </span>
      </span>
    </a>
  );
}
