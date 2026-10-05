import { NextResponse } from "next/server";
import { revealGuess, getDistribution } from "@/lib/arcade/gutcheck/queries";
import { GRADE_MIN, GRADE_MAX } from "@/lib/arcade/gutcheck/config";

// Submit a guess and get the reveal. The actual grade lives only server-side (and
// in gut_check_reveal) so it can't be read before this call.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const cardId = typeof b.cardId === "string" ? b.cardId : null;
  const guess = typeof b.guess === "number" ? b.guess : null;
  const confidence =
    b.confidence === "low" || b.confidence === "medium" || b.confidence === "high"
      ? b.confidence
      : undefined;
  const challengeDate =
    typeof b.challengeDate === "string" ? b.challengeDate : null;
  const roundIndex = typeof b.roundIndex === "number" ? b.roundIndex : 0;
  const anonId = typeof b.anonId === "string" ? b.anonId.slice(0, 64) : "";

  if (
    !cardId ||
    guess === null ||
    !Number.isFinite(guess) ||
    guess < GRADE_MIN ||
    guess > GRADE_MAX
  ) {
    return NextResponse.json({ error: "invalid guess" }, { status: 400 });
  }

  const reveal = await revealGuess({
    cardId,
    guess,
    confidence,
    challengeDate,
    roundIndex,
    anonId,
  });
  if (!reveal) {
    return NextResponse.json({ error: "card not available" }, { status: 404 });
  }

  const distribution = await getDistribution(cardId);
  return NextResponse.json({ reveal, distribution });
}
