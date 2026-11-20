import Image from "next/image";
import { existsSync } from "fs";
import { join } from "path";
import Band from "@/components/ui/Band";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";

// Real app screenshots, rendered only when the file exists under
// public/images/pocket-money/. width/height are the files' intrinsic pixels,
// so the browser reserves space before load.
const SCREENSHOTS: {
  file: string;
  caption: string;
  wide: boolean;
  width: number;
  height: number;
}[] = [
  {
    file: "pm-dashboard-desktop.png",
    caption: "The dashboard: budget, wallet stashes, holds, and the full log",
    wide: true,
    width: 1328,
    height: 699,
  },
  {
    file: "pm-add-transaction.png",
    caption: "Log a spend, return, or sale in seconds",
    wide: false,
    width: 568,
    height: 1000,
  },
  {
    file: "pm-wishlist-grail.png",
    caption: "The wishlist, with funds reserved toward your grail",
    wide: true,
    width: 1202,
    height: 812,
  },
  {
    file: "pm-mobile-dashboard.png",
    caption: "Works great on your phone",
    wide: false,
    width: 600,
    height: 883,
  },
];

export default function PocketMoneyScreenshotStrip() {
  const available = SCREENSHOTS.filter((s) =>
    existsSync(join(process.cwd(), "public/images/pocket-money", s.file))
  );
  if (available.length === 0) return null;

  return (
    <Band surface="forest" labelledBy="pm-shots">
      <Container width="content">
        <SectionHeader
          id="pm-shots"
          surface="forest"
          size="m"
          title="See it in action"
          lead="Real screenshots, no mockups. This is the app you get."
        />
      </Container>

      {/* Scrolls inside itself; the page never scrolls sideways. */}
      <ul
        tabIndex={0}
        aria-label="Pocket Money screenshots"
        className="mt-8 flex snap-x gap-5 overflow-x-auto rail pb-3"
      >
        {available.map((shot) => (
          <li key={shot.file} className={`shrink-0 snap-start ${shot.wide ? "w-[min(42rem,85vw)]" : "w-[min(18.75rem,70vw)]"}`}>
            <figure>
              <div className="rounded-lg border border-forest-hairline bg-forest-raised p-2">
                <Image
                  src={`/images/pocket-money/${shot.file}`}
                  alt="" // the figcaption describes it
                  width={shot.width}
                  height={shot.height}
                  loading="lazy"
                  sizes={
                    shot.wide
                      ? "(max-width: 800px) calc(85vw - 18px), 662px"
                      : "(max-width: 428px) calc(70vw - 18px), 282px"
                  }
                  className="block h-auto w-full rounded-md"
                />
              </div>
              <figcaption className="mt-2.5 text-meta text-on-forest-muted">{shot.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Band>
  );
}
