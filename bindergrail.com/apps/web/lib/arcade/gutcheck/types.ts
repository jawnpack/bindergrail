import type { ResultKind, Confidence } from "./config";

// The safe, pre-guess view of a card (NO confirmed_grade / teaching_points — those
// are revealed only via gut_check_reveal after a guess).
export type PlayCard = {
  id: string;
  card_name: string | null;
  set_name: string | null;
  collector_number: string | null;
  grading_company: string;
  difficulty: string;
  condition_report: string | null;
  centering_notes: string | null;
  corner_notes: string | null;
  edge_notes: string | null;
  surface_notes: string | null;
  whitening_notes: string | null;
  print_line_notes: string | null;
  front_crop_url: string | null;
  back_crop_url: string | null;
  certificate_redacted_image_url: string | null;
};

export type DailyChallenge = {
  challenge_date: string;
  seed: string;
  card_ids: string[];
  challenge_version: number;
};

export type RevealResult = {
  confirmed_grade: number;
  card_name: string | null;
  set_name: string | null;
  collector_number: string | null;
  teaching_points: string | null;
  distance: number;
  result: ResultKind;
};

export type DistributionRow = { guessed_grade: number; n: number };

export type GuessInput = {
  cardId: string;
  guess: number;
  confidence?: Confidence;
  challengeDate: string | null;
  roundIndex: number;
  anonId: string;
};
