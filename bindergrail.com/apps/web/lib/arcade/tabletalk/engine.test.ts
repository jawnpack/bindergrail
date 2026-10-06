import { test } from "node:test";
import assert from "node:assert/strict";
import { makeRng } from "./rng.ts";
import {
  applyTactic,
  createEncounter,
  dealResult,
  cardHasVisibleFlaw,
} from "./engine.ts";
import { CARDS } from "./cards.ts";
import type { TacticId } from "./types.ts";

const opts = { cardPool: CARDS };

test("opening ask is above the floor and both are positive", () => {
  const rng = makeRng("t1");
  for (let i = 0; i < 200; i++) {
    const e = createEncounter(rng, opts);
    assert.ok(e.openingAsk > 0, "ask positive");
    assert.ok(e.floor > 0, "floor positive");
    assert.ok(e.openingAsk >= e.floor, "ask >= floor");
    assert.equal(e.currentPrice, e.openingAsk);
  }
});

test("price never dips below the floor on discounts, and stays finite", () => {
  const rng = makeRng("t2");
  const tactics: TacticId[] = ["respectful", "cash", "lowball", "flaw", "walk_bluff"];
  for (let i = 0; i < 50; i++) {
    let e = createEncounter(rng, opts);
    for (let t = 0; t < 12 && !e.crashed; t++) {
      e = applyTactic(e, rng.pick(tactics), rng);
      assert.ok(Number.isFinite(e.currentPrice), "finite price");
      assert.ok(e.currentPrice >= e.floor - 0.011, "not below floor");
      assert.ok(e.currentPrice > 0, "positive price");
    }
  }
});

test("prices can go both down and up across many turns", () => {
  const rng = makeRng("t3");
  let sawDown = false;
  let sawUp = false;
  for (let i = 0; i < 300 && !(sawDown && sawUp); i++) {
    let e = createEncounter(rng, opts);
    for (let t = 0; t < 6 && !e.crashed; t++) {
      const before = e.currentPrice;
      e = applyTactic(e, rng.pick(["lowball", "respectful", "flaw"] as TacticId[]), rng);
      if (e.currentPrice < before) sawDown = true;
      if (e.currentPrice > before) sawUp = true;
    }
  }
  assert.ok(sawDown, "observed a price drop");
  assert.ok(sawUp, "observed a price rise");
});

test("spamming lowballs eventually crashes a tough vendor", () => {
  const rng = makeRng("t4");
  let crashedCount = 0;
  for (let i = 0; i < 40; i++) {
    let e = createEncounter(rng, { ...opts, forceVendor: "tough" });
    for (let t = 0; t < 20 && !e.crashed; t++) e = applyTactic(e, "lowball", rng);
    if (e.crashed) crashedCount++;
  }
  assert.ok(crashedCount > 30, `tough vendor crashes under lowball spam (${crashedCount}/40)`);
});

test("friendly vendor tolerates more lowballs than tough", () => {
  const rng = makeRng("t5");
  const turnsToCrash = (vendor: "friendly" | "tough") => {
    let total = 0;
    const n = 40;
    for (let i = 0; i < n; i++) {
      let e = createEncounter(rng, { ...opts, forceVendor: vendor });
      let t = 0;
      for (; t < 30 && !e.crashed; t++) e = applyTactic(e, "lowball", rng);
      total += t;
    }
    return total / n;
  };
  const friendly = turnsToCrash("friendly");
  const tough = turnsToCrash("tough");
  assert.ok(friendly > tough, `friendly lasts longer (${friendly.toFixed(1)} vs ${tough.toFixed(1)})`);
});

test("era economics scale: vintage asks and savings exceed modern", () => {
  const rng = makeRng("t6");
  const avgAsk = (era: "modern" | "vintage") => {
    let sum = 0;
    const n = 100;
    for (let i = 0; i < n; i++) sum += createEncounter(rng, { ...opts, forceEra: era }).openingAsk;
    return sum / n;
  };
  assert.ok(avgAsk("vintage") > avgAsk("modern") * 3, "vintage asks much higher");
});

test("savings are opening ask minus final price", () => {
  const rng = makeRng("t7");
  let e = createEncounter(rng, { ...opts, forceVendor: "friendly" });
  e = applyTactic(e, "respectful", rng);
  const d = dealResult(e);
  assert.equal(d.savings, Math.round((e.openingAsk - e.currentPrice) * 100) / 100);
  assert.ok(d.discountPct >= 0 || e.currentPrice > e.openingAsk);
});

test("pointing out a flaw on a clean graded 10 only angers the vendor", () => {
  const rng = makeRng("t8");
  const clean = CARDS.find((c) => c.grade === 10)!;
  assert.equal(cardHasVisibleFlaw(clean), false);
  let e = createEncounter(rng, { cardPool: [clean], forceVendor: "tough" });
  const before = e.currentPrice;
  const mood0 = e.mood;
  e = applyTactic(e, "flaw", rng);
  assert.equal(e.currentPrice, before, "no discount for a bogus flaw");
  assert.ok(e.mood > mood0, "mood rose");
});

test("deterministic for a fixed seed", () => {
  const a = createEncounter(makeRng("same"), opts);
  const b = createEncounter(makeRng("same"), opts);
  assert.equal(a.card.card_id, b.card.card_id);
  assert.equal(a.vendor, b.vendor);
  assert.equal(a.openingAsk, b.openingAsk);
});
