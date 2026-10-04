import { createClient } from "@/lib/supabase/server";
import { TOKEN_EARN, type TokenReason } from "./config";

// Token balance is the sum of `arcade_token_events.amount` for a user. Defensive:
// until the migration is applied, the balance reads as 0 and earns no-op.

export async function getTokenBalance(userId: string): Promise<number> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("arcade_token_events")
      .select("amount")
      .eq("user_id", userId);
    if (error || !data) return 0;
    return (data as { amount: number }[]).reduce((sum, r) => sum + r.amount, 0);
  } catch {
    return 0;
  }
}

export async function earnTokens(args: {
  game: string;
  reason: TokenReason;
}): Promise<{ ok: boolean }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false };
    const { error } = await supabase.from("arcade_token_events").insert({
      user_id: user.id,
      game: args.game,
      amount: TOKEN_EARN[args.reason],
      reason: args.reason,
    });
    return { ok: !error };
  } catch {
    return { ok: false };
  }
}
