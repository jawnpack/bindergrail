import { DAILY_SIZE } from "./config.ts";

// Deterministic daily selection. The same (pool, seed) always yields the same
// ordered set — but the game FREEZES the result into gut_check_daily_challenges so
// later content edits can't change a completed day. Pure, unit-tested.

// xmur3 string hash -> 32-bit seed.
function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

// mulberry32 PRNG.
function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Deterministic Fisher–Yates using a string seed. Does not mutate the input.
export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  const rand = mulberry32(xmur3(seed)());
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Pick `size` unique card ids for a day. Caller must pass a pool of UNIQUE ids;
// the result never repeats a card. Returns fewer than `size` only if the pool is
// smaller than `size`.
export function selectDailyCards(
  cardIds: readonly string[],
  seed: string,
  size: number = DAILY_SIZE
): string[] {
  const unique = Array.from(new Set(cardIds));
  return seededShuffle(unique, seed).slice(0, size);
}
