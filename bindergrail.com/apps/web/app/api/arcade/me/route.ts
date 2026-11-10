import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTokenBalance } from "@/lib/arcade/tokens";
import { getDailyStreak } from "@/lib/arcade/streak";
import { getUserBest } from "@/lib/arcade/leaderboard";

// The only cookie-dependent arcade read. The lobby and game pages are static;
// their signed-in widgets (tokens, streak, best run) fetch this once on load.
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const headers = { "Cache-Control": "private, no-store" };
  if (!user) return NextResponse.json({ signedIn: false }, { headers });

  const [tokens, streak, flipBest] = await Promise.all([
    getTokenBalance(user.id),
    getDailyStreak(user.id),
    getUserBest("cardboard-flip"),
  ]);
  return NextResponse.json({ signedIn: true, tokens, streak, flipBest }, { headers });
}
