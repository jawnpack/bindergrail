// Run: npm run test:wallet   (node:test + native TS stripping, no deps)
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  activeFunds,
  computeWallet,
  conservesOnCatch,
  conservesOnReserve,
  conservesOnUnreserve,
  reservedByItem,
  reservedTotal,
} from "./wallet.ts";

const stashes = [
  { id: "s1", amount: 493.62 },
  { id: "s2", amount: 1013.51 },
];

test("reserved is excluded from the spendable total", () => {
  const w = computeWallet(2626.83, stashes, [
    { wishlist_item_id: "grail", amount_saved: 500 },
  ]);
  assert.equal(w.stashes, 1507.13);
  assert.equal(w.reserved, 500);
  // The bug: this used to be pocket + stashes + reserved.
  assert.equal(w.freeToSpend, 4133.96);
});

test("reserving drops the total and raises reserved by the same amount", () => {
  const before = computeWallet(1000, [], []);
  // reserve 250: pocket down, fund up
  const after = computeWallet(750, [], [
    { wishlist_item_id: "g", amount_saved: 250 },
  ]);
  assert.equal(before.freeToSpend, 1000);
  assert.equal(after.freeToSpend, 750);
  assert.equal(after.reserved, 250);
  assert.ok(conservesOnReserve(before, after, 250));
});

test("catching the grail clears reserved WITHOUT dropping the total again", () => {
  const before = computeWallet(750, [], [
    { wishlist_item_id: "g", amount_saved: 250 },
  ]);
  // catch: fund row deleted, pocket untouched
  const after = computeWallet(750, [], []);
  assert.equal(after.reserved, 0);
  assert.equal(after.freeToSpend, before.freeToSpend); // no second deduction
  assert.ok(conservesOnCatch(before, after, 250));
});

test("double-counting on catch is rejected by the invariant", () => {
  const before = computeWallet(750, [], [
    { wishlist_item_id: "g", amount_saved: 250 },
  ]);
  // the bug we are guarding against: also deducting from pocket on catch
  const doubleCounted = computeWallet(500, [], []);
  assert.ok(!conservesOnCatch(before, doubleCounted, 250));
});

test("un-reserving returns the money to the pocket", () => {
  const before = computeWallet(750, [], [
    { wishlist_item_id: "g", amount_saved: 250 },
  ]);
  const after = computeWallet(1000, [], []);
  assert.ok(conservesOnUnreserve(before, after, 250));
});

test("funds against acquired items drop out of every figure", () => {
  const funds = [
    { wishlist_item_id: "caught", amount_saved: 2250 }, // acquired grail
    { wishlist_item_id: "live", amount_saved: 100 },
  ];
  // only "live" is still active
  const scoped = activeFunds(funds, ["live"]);
  assert.equal(reservedTotal(scoped), 100);
  assert.equal(computeWallet(2626.83, stashes, scoped).reserved, 100);
});

test("reservedByItem sums per item", () => {
  const map = reservedByItem([
    { wishlist_item_id: "a", amount_saved: 100 },
    { wishlist_item_id: "a", amount_saved: 50 },
    { wishlist_item_id: "b", amount_saved: 25 },
  ]);
  assert.deepEqual(map, { a: 150, b: 25 });
});
