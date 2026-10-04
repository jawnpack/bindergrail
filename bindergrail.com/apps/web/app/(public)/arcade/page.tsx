import type { Metadata } from "next";
import Link from "next/link";
import { Press_Start_2P, Pacifico } from "next/font/google";
import ArcadeAccount from "./ArcadeAccount";
import styles from "./arcade.module.css";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-press",
});

// Neon-sign typeface for the title.
const neon = Pacifico({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-neon",
});

export const metadata: Metadata = {
  title: "Arcade",
  description:
    "Step into the arcade — retro cabinets for every Binder Grail game. Now playing: The Cardboard Flip. One account across the arcade and Pocket Money.",
  alternates: { canonical: "https://bindergrail.com/arcade" },
  openGraph: {
    type: "website",
    siteName: "Binder Grail",
    title: "Arcade",
    description:
      "Retro cabinets for every Binder Grail game. Now playing: The Cardboard Flip.",
    url: "https://bindergrail.com/arcade",
    images: [{ url: "/images/binder_grail_logo.png", width: 511, height: 234 }],
  },
  twitter: { card: "summary_large_image" },
};

// Each game is a cabinet in an aisle. Add future games here and they slot in
// beside The Cardboard Flip; a new aisle is just another entry in `aisles`.
const aisles = [
  {
    badge: "AISLE 1",
    name: "CARD SHOP SIMS",
    games: [
      {
        slug: "thecardboardflip",
        name: "THE CARDBOARD FLIP",
        href: "/games/thecardboardflip",
        title: ["THE", "CARDBOARD", "FLIP"],
        price: "$1,500 · 30 DAYS",
        tag: "FLIP · HYPE · SHOP",
        players: "1 PLAYER",
      },
    ],
  },
];

export default function ArcadePage() {
  return (
    <main className={`${styles.arcade} ${pressStart.variable} ${neon.variable}`}>
      <div className={styles.inner}>
        {/* Title */}
        <div className={styles.titleWrap}>
          <span className={styles.kicker}>INSERT COIN</span>
          <h1 className={styles.title}>arcade</h1>
          <p className={styles.subtitle}>
            A cabinet for every Binder Grail game. Pull up, read the marquee, and
            press start. More cabinets rolling onto the floor soon.
          </p>
        </div>

        {/* Account */}
        <div className={styles.playerStrip}>
          <ArcadeAccount />
        </div>

        {/* Aisles */}
        {aisles.map((aisle) => (
          <section key={aisle.badge} className={styles.aisle}>
            <div className={styles.aisleSign}>
              <span className={styles.aisleBadge}>{aisle.badge}</span>
              <span className={styles.aisleName}>{aisle.name}</span>
            </div>

            <div className={styles.aisleFloor}>
              {aisle.games.map((game) => (
                <div key={game.slug}>
                  <Link
                    href={game.href}
                    className={styles.cabinet}
                    aria-label={`Play ${game.name}`}
                  >
                    <div className={styles.marquee}>{game.name}</div>
                    <div className={styles.body}>
                      <div className={styles.bezel}>
                        <div className={styles.screen}>
                          <div className={styles.screenContent}>
                            <div className={styles.screenTitle}>
                              {game.title.map((line) => (
                                <span key={line}>
                                  {line}
                                  <br />
                                </span>
                              ))}
                            </div>
                            <div className={styles.screenPrice}>{game.price}</div>
                            <div className={styles.screenTag}>{game.tag}</div>
                            <div className={styles.screenStart}>▶ PRESS START</div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.panel}>
                        <span className={styles.joystick} />
                        <span className={styles.buttons}>
                          <span className={`${styles.btnDot} ${styles.amber}`} />
                          <span className={styles.btnDot} />
                        </span>
                      </div>
                    </div>
                    <div className={styles.coin}>
                      <span className={styles.slot} />
                      <br />
                      <span className={styles.coinPlay}>INSERT COIN · PLAY</span>
                    </div>
                  </Link>

                  <div className={styles.caption}>
                    <div className={styles.capName}>{game.name}</div>
                    <div className={styles.capMeta}>{game.players} · FREE</div>
                  </div>
                </div>
              ))}

              {/* Placeholder for the next cabinet */}
              <div className={styles.comingSoon}>
                MORE
                <br />
                CABINETS
                <br />
                COMING SOON
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
