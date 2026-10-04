// Single source of truth for the arcade. Adding a game is one entry in CABINETS.

export const ARCADE_URL = "https://bindergrail.com/arcade";

// Launch day for daily puzzles — this is puzzle #001. Dates are America/New_York.
export const DAILY_LAUNCH_ET = "2026-10-04";

export type CabinetType = "daily" | "arcade" | "story";
export type CabinetStatus = "live" | "new" | "soon";
export type Accent = "gold" | "blue" | "cyan" | "magenta";

export type Cabinet = {
  id: string;
  title: string;
  type: CabinetType;
  status: CabinetStatus;
  blurb: string;
  href: string;
  accent: Accent;
  playsLabel: string;
};

export const CABINETS: Cabinet[] = [
  {
    id: "cardboard-flip",
    title: "THE CARDBOARD FLIP",
    type: "story",
    status: "live",
    blurb:
      "A 30-day flipping challenge. Make rent, dodge debt, open your own card shop.",
    href: "/games/thecardboardflip",
    accent: "magenta",
    playsLabel: "UNLIMITED RUNS",
  },
  {
    id: "gut-check",
    title: "GUT CHECK",
    type: "daily",
    status: "new",
    blurb:
      "Five raw cards a day. Read the condition report and call the grade.",
    href: "/arcade/gut-check",
    accent: "gold",
    playsLabel: "1 PLAY A DAY",
  },
  {
    id: "comp-check",
    title: "COMP CHECK",
    type: "daily",
    status: "new",
    blurb: "Did the next one sell for more or less? Build the longest streak.",
    href: "/arcade/comp-check",
    accent: "blue",
    playsLabel: "1 PLAY A DAY",
  },
  {
    id: "table-talk",
    title: "TABLE TALK",
    type: "arcade",
    status: "new",
    blurb: "Haggle a card-show vendor down before he loses his patience.",
    href: "/arcade/table-talk",
    accent: "cyan",
    playsLabel: "ENDLESS VENDORS",
  },
];

export function getCabinet(id: string): Cabinet | undefined {
  return CABINETS.find((c) => c.id === id);
}

// Token earn amounts — starting values to tune later. One place so the economy
// stays legible.
export const TOKEN_EARN = {
  dailyClear: 10,
  streakDay: 5,
  highScore: 25,
} as const;

export type TokenReason = keyof typeof TOKEN_EARN;
