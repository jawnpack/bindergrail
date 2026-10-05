import { test } from "node:test";
import assert from "node:assert/strict";
import { selectDailyCards, seededShuffle } from "./daily.ts";

const POOL = Array.from({ length: 30 }, (_, i) => `card-${i}`);

test("deterministic for the same seed", () => {
  const a = selectDailyCards(POOL, "2026-10-04", 5);
  const b = selectDailyCards(POOL, "2026-10-04", 5);
  assert.deepEqual(a, b);
});

test("different seeds usually differ", () => {
  const a = selectDailyCards(POOL, "2026-10-04", 5);
  const b = selectDailyCards(POOL, "2026-10-05", 5);
  assert.notDeepEqual(a, b);
});

test("no repeats and respects size", () => {
  const picked = selectDailyCards(POOL, "seed-x", 5);
  assert.equal(picked.length, 5);
  assert.equal(new Set(picked).size, 5);
});

test("dedupes the pool and never exceeds it", () => {
  const dupes = ["a", "a", "b", "b", "c"];
  const picked = selectDailyCards(dupes, "seed", 5);
  assert.equal(new Set(picked).size, picked.length);
  assert.ok(picked.length <= 3);
});

test("seededShuffle does not mutate input", () => {
  const original = POOL.slice();
  seededShuffle(POOL, "seed");
  assert.deepEqual(POOL, original);
});
