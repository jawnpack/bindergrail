// Gut Check tuning knobs in one place. Grade scale, result thresholds, daily size,
// share emoji, achievement + contributor-reward vocabularies.

export const GRADE_MIN = 1;
export const GRADE_MAX = 10;
export const GRADES: number[] = Array.from(
  { length: GRADE_MAX - GRADE_MIN + 1 },
  (_, i) => GRADE_MIN + i
);

export const DAILY_SIZE = 5;
export const DISTRIBUTION_MIN_GUESSES = 20;

export type ResultKind = "exact" | "close" | "miss";

// "close" = within this many grades of the real one (0 is always "exact").
export type ResultThresholds = { closeWithin: number };
export const DEFAULT_THRESHOLDS: ResultThresholds = { closeWithin: 1 };

// Share grid: green exact, yellow close, red miss (configurable).
export const RESULT_EMOJI: Record<ResultKind, string> = {
  exact: "🟩",
  close: "🟨",
  miss: "🟥",
};

export type Confidence = "low" | "medium" | "high";

export const ACHIEVEMENTS = [
  { key: "first_exact", label: "First Exact Guess" },
  { key: "exact_5", label: "5 Exact Grades" },
  { key: "exact_25", label: "25 Exact Grades" },
  { key: "exact_50", label: "50 Exact Grades" },
  { key: "perfect_daily", label: "Perfect Daily" },
] as const;

export const CONTRIBUTOR_EVENTS = [
  "submission_approved",
  "submission_published",
  "community_engagement",
  "featured_card",
] as const;
