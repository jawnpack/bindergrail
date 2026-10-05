import { test } from "node:test";
import assert from "node:assert/strict";
import { gradeResult, gradeDistance, buildShareGrid, gutCheckShareText } from "./grade.ts";

test("exact guess", () => {
  const r = gradeResult(8, 8);
  assert.equal(r.distance, 0);
  assert.equal(r.result, "exact");
});

test("within one is close", () => {
  assert.equal(gradeResult(8, 7).result, "close");
  assert.equal(gradeResult(7, 8).result, "close");
});

test("more than one off is a miss", () => {
  const r = gradeResult(8, 5);
  assert.equal(r.distance, 3);
  assert.equal(r.result, "miss");
});

test("threshold is configurable", () => {
  assert.equal(gradeResult(8, 6, { closeWithin: 2 }).result, "close");
  assert.equal(gradeResult(8, 6, { closeWithin: 1 }).result, "miss");
});

test("distance is absolute", () => {
  assert.equal(gradeDistance(3, 9), 6);
  assert.equal(gradeDistance(9, 3), 6);
});

test("share grid maps results to emoji", () => {
  assert.equal(buildShareGrid(["exact", "close", "miss"]), "🟩🟨🟥");
});

test("share text has count, grid and link", () => {
  const txt = gutCheckShareText({
    number: 1,
    results: ["exact", "exact", "close", "miss", "exact"],
  });
  assert.match(txt, /#001/);
  assert.match(txt, /3\/5 exact/);
  assert.match(txt, /🟩🟩🟨🟥🟩/);
  assert.match(txt, /bindergrail\.com\/arcade\/gut-check/);
});
