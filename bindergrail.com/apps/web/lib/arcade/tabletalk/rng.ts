// Small seeded RNG so runs are random in play but deterministic in tests.

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

function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rng = {
  float(): number;
  int(maxExclusive: number): number;
  range(min: number, max: number): number;
  pick<T>(arr: readonly T[]): T;
  weighted<T>(items: readonly T[], weights: readonly number[]): T;
  chance(p: number): boolean;
};

export function makeRng(seed?: string): Rng {
  const s =
    seed ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  const f = mulberry32(xmur3(s)());
  const rng: Rng = {
    float: () => f(),
    int: (max) => Math.floor(f() * max),
    range: (min, max) => min + f() * (max - min),
    pick: (arr) => arr[Math.floor(f() * arr.length)],
    weighted: (items, weights) => {
      const total = weights.reduce((a, b) => a + b, 0);
      let r = f() * total;
      for (let i = 0; i < items.length; i++) {
        r -= weights[i];
        if (r <= 0) return items[i];
      }
      return items[items.length - 1];
    },
    chance: (p) => f() < p,
  };
  return rng;
}
