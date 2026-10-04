import { createClient } from "@/lib/supabase/server";

// Leaderboard lives in one table, `arcade_scores` (see the migration). Every
// helper is defensive: until the migration is applied the table is absent, so
// reads return empty and writes report failure rather than throwing.

export type ScoreRow = {
  user_id: string;
  game: string;
  puzzle_number: number | null;
  score: number;
  meta: Record<string, unknown> | null;
  created_at: string;
};

export async function submitScore(args: {
  game: string;
  score: number;
  puzzleNumber?: number | null;
  meta?: Record<string, unknown>;
}): Promise<{ ok: boolean }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false };

    const row = {
      user_id: user.id,
      game: args.game,
      puzzle_number: args.puzzleNumber ?? null,
      score: args.score,
      meta: args.meta ?? {},
    };
    // Upsert on the daily unique key so a repeat play of the same puzzle updates.
    const { error } =
      args.puzzleNumber != null
        ? await supabase
            .from("arcade_scores")
            .upsert(row, { onConflict: "user_id,game,puzzle_number" })
        : await supabase.from("arcade_scores").insert(row);
    return { ok: !error };
  } catch {
    return { ok: false };
  }
}

export async function getTopScores(
  game: string,
  puzzleNumber?: number
): Promise<ScoreRow[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("arcade_scores")
      .select("user_id, game, puzzle_number, score, meta, created_at")
      .eq("game", game)
      .order("score", { ascending: false })
      .limit(5);
    if (puzzleNumber != null) query = query.eq("puzzle_number", puzzleNumber);
    const { data, error } = await query;
    if (error || !data) return [];
    return data as ScoreRow[];
  } catch {
    return [];
  }
}

export async function getUserBest(game: string): Promise<number | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .from("arcade_scores")
      .select("score")
      .eq("game", game)
      .eq("user_id", user.id)
      .order("score", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return (data as { score: number }).score;
  } catch {
    return null;
  }
}
