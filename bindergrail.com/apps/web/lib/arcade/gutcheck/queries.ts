import { createClient } from "@/lib/supabase/server";
import { dailySeed } from "@/lib/arcade/dailySeed";
import { seededShuffle } from "./daily";
import { DAILY_SIZE } from "./config";
import type {
  PlayCard,
  DailyChallenge,
  RevealResult,
  DistributionRow,
} from "./types";

// Columns safe to send to the browser (never the grade or teaching notes).
const PLAY_COLUMNS =
  "id, card_name, set_name, collector_number, grading_company, difficulty, " +
  "condition_report, centering_notes, corner_notes, edge_notes, surface_notes, " +
  "whitening_notes, print_line_notes, front_crop_url, back_crop_url, " +
  "certificate_redacted_image_url";

// All helpers are defensive: until the migrations are applied they return
// null/empty rather than throwing.

export async function getDailyChallenge(
  date: string
): Promise<DailyChallenge | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gut_check_daily_challenges")
      .select("challenge_date, seed, card_ids, challenge_version")
      .eq("challenge_date", date)
      .maybeSingle();
    if (error || !data) return null;
    return data as DailyChallenge;
  } catch {
    return null;
  }
}

export async function getPlayCards(ids: string[]): Promise<PlayCard[]> {
  if (ids.length === 0) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gut_check_cards")
      .select(PLAY_COLUMNS)
      .in("id", ids);
    if (error || !data) return [];
    const byId = new Map((data as unknown as PlayCard[]).map((c) => [c.id, c]));
    // Preserve the frozen daily order.
    return ids.map((id) => byId.get(id)).filter((c): c is PlayCard => !!c);
  } catch {
    return [];
  }
}

export async function getTodayPlay(): Promise<{
  challenge: DailyChallenge;
  cards: PlayCard[];
  number: number;
} | null> {
  const { dateET } = dailySeed();
  const challenge = await getDailyChallenge(dateET);
  if (!challenge) return null;
  const cards = await getPlayCards(challenge.card_ids);
  if (cards.length === 0) return null;
  const { number } = dailySeed();
  return { challenge, cards, number };
}

// Practice mode: a deterministic-per-load sample of published cards, independent
// of the daily. Pulls a page of ids then shuffles in-process.
export async function getPracticeCards(n: number = DAILY_SIZE): Promise<PlayCard[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gut_check_cards")
      .select(PLAY_COLUMNS)
      .limit(200);
    if (error || !data) return [];
    return seededShuffle(data as unknown as PlayCard[], String(Date.now())).slice(0, n);
  } catch {
    return [];
  }
}

// Reveal (records the guess + returns the answer). Runs server-side; the RPC uses
// the caller's auth.uid() when signed in, else the anon id.
export async function revealGuess(args: {
  cardId: string;
  guess: number;
  confidence?: string;
  challengeDate: string | null;
  roundIndex: number;
  anonId: string;
}): Promise<RevealResult | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("gut_check_reveal", {
      p_card: args.cardId,
      p_guess: args.guess,
      p_confidence: args.confidence ?? null,
      p_challenge_date: args.challengeDate,
      p_round_index: args.roundIndex,
      p_anon: args.anonId,
      p_close_within: 1,
    });
    if (error || !data || !Array.isArray(data) || data.length === 0) return null;
    return data[0] as RevealResult;
  } catch {
    return null;
  }
}

export async function getDistribution(
  cardId: string
): Promise<DistributionRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("gut_check_distribution", {
      card: cardId,
      min_guesses: 20,
    });
    if (error || !data) return [];
    return (data as { guessed_grade: number; n: number }[]).map((r) => ({
      guessed_grade: r.guessed_grade,
      n: r.n,
    }));
  } catch {
    return [];
  }
}
