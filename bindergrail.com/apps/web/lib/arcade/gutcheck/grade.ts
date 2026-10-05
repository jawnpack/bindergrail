import {
  DEFAULT_THRESHOLDS,
  RESULT_EMOJI,
  type ResultKind,
  type ResultThresholds,
} from "./config.ts";
import { ARCADE_URL } from "../config.ts";

// Pure grading/result/share logic — no I/O, fully unit-tested.

export function gradeDistance(guess: number, actual: number): number {
  return Math.abs(guess - actual);
}

export function gradeResult(
  guess: number,
  actual: number,
  thresholds: ResultThresholds = DEFAULT_THRESHOLDS
): { distance: number; result: ResultKind } {
  const distance = gradeDistance(guess, actual);
  const result: ResultKind =
    distance === 0 ? "exact" : distance <= thresholds.closeWithin ? "close" : "miss";
  return { distance, result };
}

export function buildShareGrid(results: ResultKind[]): string {
  return results.map((r) => RESULT_EMOJI[r]).join("");
}

export function gutCheckShareText(opts: {
  number: number;
  results: ResultKind[];
}): string {
  const exact = opts.results.filter((r) => r === "exact").length;
  const header = `Gut Check #${String(opts.number).padStart(3, "0")}  ${exact}/${opts.results.length} exact`;
  return [header, buildShareGrid(opts.results), `${ARCADE_URL}/gut-check`].join("\n");
}
