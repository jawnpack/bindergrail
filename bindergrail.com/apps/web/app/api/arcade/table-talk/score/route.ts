import { NextResponse } from "next/server";
import { submitScore } from "@/lib/arcade/leaderboard";

// Record a Table Talk run. submitScore ties the row to the signed-in user via the
// session (anonymous runs aren't persisted — arcade_scores requires a user). The
// client score is accepted as-is for now; full server-side run validation is a
// future hardening step noted in the handoff.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  const score = typeof b.score === "number" ? b.score : null;
  if (score === null || !Number.isFinite(score) || score < 0 || score > 1_000_000) {
    return NextResponse.json({ error: "invalid score" }, { status: 400 });
  }

  const meta = {
    cards: typeof b.cards === "number" ? b.cards : 0,
    runLength: typeof b.runLength === "number" ? b.runLength : 0,
    bestDiscountPct: typeof b.bestDiscountPct === "number" ? b.bestDiscountPct : 0,
  };

  const result = await submitScore({
    game: "table-talk",
    score: Math.round(score),
    meta,
  });
  return NextResponse.json(result);
}
