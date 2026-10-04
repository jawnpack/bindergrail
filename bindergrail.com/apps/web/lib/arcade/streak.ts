import { createClient } from "@/lib/supabase/server";
import { etDateString } from "./dailySeed";

// Daily streak = number of consecutive ET days (ending today or yesterday) on
// which the player cleared BOTH dailies. Derived from arcade_scores so there is
// no separate streak table to keep in sync. Defensive: no data -> 0.

const DAILY_GAMES = ["gut-check", "comp-check"];

export async function getDailyStreak(userId: string): Promise<number> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("arcade_scores")
      .select("game, created_at")
      .eq("user_id", userId)
      .in("game", DAILY_GAMES)
      .order("created_at", { ascending: false })
      .limit(400);
    if (error || !data) return 0;

    // Collect the set of games played per ET day.
    const byDay = new Map<string, Set<string>>();
    for (const row of data as { game: string; created_at: string }[]) {
      const day = etDateString(new Date(row.created_at));
      const set = byDay.get(day) ?? new Set<string>();
      set.add(row.game);
      byDay.set(day, set);
    }

    const complete = (day: string) => {
      const set = byDay.get(day);
      return !!set && DAILY_GAMES.every((g) => set.has(g));
    };

    // Walk back from today (allowing today to be unplayed yet) counting
    // consecutive complete days.
    const DAY = 86_400_000;
    const todayET = etDateString();
    let cursor = new Date(todayET + "T12:00:00Z");
    let streak = 0;
    // If today isn't complete, start counting from yesterday.
    if (!complete(etDateString(cursor))) cursor = new Date(cursor.getTime() - DAY);
    while (complete(etDateString(cursor))) {
      streak += 1;
      cursor = new Date(cursor.getTime() - DAY);
    }
    return streak;
  } catch {
    return 0;
  }
}
