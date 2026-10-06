export type EraId = "modern" | "mid" | "vintage";
export type VendorId = "friendly" | "busy" | "tough";
export type TacticId =
  | "respectful"
  | "lowball"
  | "compliment"
  | "ask"
  | "walk_bluff"
  | "flaw"
  | "cash";
export type ConditionType = "raw" | "graded";

export type Card = {
  card_id: string;
  display_name: string;
  era_category: EraId;
  set_name: string;
  year: number;
  rarity?: string;
  condition_type: ConditionType;
  grading_company?: string;
  grade?: number;
  market_reference_price: number;
  image_reference?: string;
  flavor_text?: string;
};

export type EraConfig = {
  id: EraId;
  label: string;
  weight: number;
  markup: [number, number]; // opening markup over reference
  floorDiscount: [number, number]; // how far below reference the floor can sit
  angerMult: number; // scales mood damage
};

// Per-tactic multipliers for a vendor (how that vendor reacts to each tactic).
export type VendorTacticMod = { priceMult: number; moodMult: number };

export type VendorConfig = {
  id: VendorId;
  label: string;
  blurb: string;
  patience: [number, number];
  crashThreshold: [number, number];
  floorFactor: number; // >1 looser floor (more savings), <1 tighter
  phoneBehavior: boolean;
  walkBluffBackfire: number; // chance a walk bluff angers them
  initialState: string;
  tactics: Record<TacticId, VendorTacticMod>;
  reactions: Record<string, string[]>; // keyed by reaction kind
};

export type TacticConfig = {
  id: TacticId;
  label: string;
  hint: string;
  priceMove: [number, number]; // fraction of current price (negative = discount)
  mood: [number, number]; // irritation delta
};

export type EncounterState = {
  vendor: VendorId;
  card: Card;
  openingAsk: number;
  currentPrice: number;
  floor: number;
  mood: number;
  patience: number;
  crashThreshold: number;
  behaviorState: string;
  distractedTurns: number;
  turnCount: number;
  crashed: boolean;
  lastReaction: Reaction | null;
};

export type Reaction = {
  kind: string;
  line: string;
  priceDelta: number;
  moodDelta: number;
  event?: string;
};

export type DealResult = { savings: number; discountPct: number };
