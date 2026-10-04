import { DAILY_LAUNCH_ET } from "./config";

// The daily puzzle number is driven by today's date in America/New_York, so the
// puzzle rolls over at midnight ET and everyone on a given ET day gets the same
// number. Puzzle #001 is DAILY_LAUNCH_ET.

/** YYYY-MM-DD for the given instant, in America/New_York. */
export function etDateString(date: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function daysBetween(fromISO: string, toISO: string): number {
  const [fy, fm, fd] = fromISO.split("-").map(Number);
  const [ty, tm, td] = toISO.split("-").map(Number);
  const from = Date.UTC(fy, fm - 1, fd);
  const to = Date.UTC(ty, tm - 1, td);
  return Math.round((to - from) / 86_400_000);
}

export type DailySeed = { number: number; dateET: string };

export function dailySeed(date: Date = new Date()): DailySeed {
  const dateET = etDateString(date);
  const number = Math.max(1, daysBetween(DAILY_LAUNCH_ET, dateET) + 1);
  return { number, dateET };
}

/** "#001" style label. */
export function puzzleLabel(n: number): string {
  return "#" + String(n).padStart(3, "0");
}
