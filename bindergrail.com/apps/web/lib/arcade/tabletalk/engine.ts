import type { Rng } from "./rng.ts";
import type {
  Card,
  DealResult,
  EncounterState,
  EraId,
  Reaction,
  TacticId,
  VendorId,
} from "./types.ts";
import {
  ENCOUNTER_WEIGHTS,
  ERAS,
  ERA_IDS,
  TACTICS,
  VENDORS,
  VENDOR_IDS,
} from "./data.ts";

const round2 = (n: number) => Math.round(n * 100) / 100;
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export function cardHasVisibleFlaw(card: Card): boolean {
  return card.condition_type === "raw" || (card.grade != null && card.grade <= 8);
}

export type EncounterOptions = {
  cardPool: Card[];
  weights?: Record<EraId, number>;
  recentCardIds?: string[];
  forceVendor?: VendorId;
  forceEra?: EraId;
};

export function createEncounter(rng: Rng, opts: EncounterOptions): EncounterState {
  const weights = opts.weights ?? ENCOUNTER_WEIGHTS;
  const eraId =
    opts.forceEra ?? rng.weighted(ERA_IDS, ERA_IDS.map((id) => weights[id]));
  const era = ERAS[eraId];

  const inEra = opts.cardPool.filter((c) => c.era_category === eraId);
  const pool = inEra.length > 0 ? inEra : opts.cardPool;
  const recent = opts.recentCardIds ?? [];
  const fresh = pool.filter((c) => !recent.includes(c.card_id));
  const card = rng.pick(fresh.length > 0 ? fresh : pool);

  const vendorId = opts.forceVendor ?? rng.pick(VENDOR_IDS);
  const vendor = VENDORS[vendorId];

  const ref = card.market_reference_price;
  const openingAsk = round2(ref * (1 + rng.range(era.markup[0], era.markup[1])));
  const floorDisc = rng.range(era.floorDiscount[0], era.floorDiscount[1]) * vendor.floorFactor;
  const floor = round2(ref * (1 - clamp(floorDisc, 0, 0.6)));

  return {
    vendor: vendorId,
    card,
    openingAsk,
    currentPrice: openingAsk,
    floor,
    mood: Math.round(rng.range(5, 20)),
    patience: Math.round(rng.range(vendor.patience[0], vendor.patience[1])),
    crashThreshold: Math.round(rng.range(vendor.crashThreshold[0], vendor.crashThreshold[1])),
    behaviorState: vendor.initialState,
    distractedTurns: 0,
    turnCount: 0,
    crashed: false,
    lastReaction: null,
  };
}

function pickLine(vendorId: VendorId, kind: string, rng: Rng): string {
  const r = VENDORS[vendorId].reactions;
  const lines = r[kind] ?? r.noMove ?? ["..."];
  return rng.pick(lines);
}

// Apply one tactic. Pure: returns a new EncounterState (does not mutate).
export function applyTactic(
  enc: EncounterState,
  tacticId: TacticId,
  rng: Rng
): EncounterState {
  const vendor = VENDORS[enc.vendor];
  const era = ERAS[enc.card.era_category];
  const base = TACTICS[tacticId];
  const mod = vendor.tactics[tacticId];
  const distracted = enc.distractedTurns > 0;

  let priceFrac = rng.range(base.priceMove[0], base.priceMove[1]) * mod.priceMult;
  let moodDelta = rng.range(base.mood[0], base.mood[1]) * mod.moodMult * era.angerMult;
  let forcedKind: string | null = null;

  // Tactic-specific behavior.
  if (tacticId === "lowball") {
    // Tough vendors (or already-irritated ones) may counter UPWARD instead.
    if ((enc.vendor === "tough" || enc.mood > 55) && rng.chance(0.5)) {
      priceFrac = rng.range(0.03, 0.1);
      moodDelta += 6;
      forcedKind = "priceUp";
    }
  } else if (tacticId === "cash") {
    if (enc.vendor === "busy" || distracted) {
      priceFrac *= 1.6;
      moodDelta -= 2;
    }
  } else if (tacticId === "flaw") {
    if (!cardHasVisibleFlaw(enc.card)) {
      // Dishonest nitpicking on a clean card — no price help, real anger.
      priceFrac = 0;
      moodDelta = rng.range(8, 16) * era.angerMult;
      forcedKind = "moodUp";
    }
  } else if (tacticId === "walk_bluff") {
    if (rng.chance(vendor.walkBluffBackfire)) {
      priceFrac = 0;
      moodDelta += rng.range(14, 28);
      forcedKind = "nearCrash";
    } else if (rng.chance(0.55)) {
      priceFrac = rng.range(-0.2, -0.09);
      forcedKind = "priceDownBig";
    } else {
      priceFrac = 0;
      forcedKind = "noMove";
    }
  } else if (tacticId === "ask" || tacticId === "compliment") {
    // Small talk wastes a busy dealer's time.
    if (enc.vendor === "busy") moodDelta += 3;
  }

  // Price update, clamped so a discount never dips below the hidden floor.
  let newPrice = enc.currentPrice * (1 + priceFrac);
  if (priceFrac < 0 && newPrice < enc.floor) newPrice = enc.floor;
  newPrice = round2(Math.max(0.01, newPrice));

  const mood = clamp(enc.mood + moodDelta, 0, 100);
  const patience = clamp(enc.patience - rng.range(5, 12), 0, 100);

  // Busy dealer may get distracted by their phone.
  let distractedTurns = Math.max(0, enc.distractedTurns - 1);
  let behaviorState = enc.behaviorState;
  let event: string | undefined;
  if (vendor.phoneBehavior && distractedTurns === 0 && rng.chance(0.28)) {
    distractedTurns = rng.int(2) + 1;
    behaviorState = "distracted";
    event = "phone";
  } else if (distractedTurns > 0) {
    behaviorState = "distracted";
  } else {
    behaviorState = vendor.initialState;
  }

  const crashed = mood >= enc.crashThreshold || patience <= 0;

  // Reaction kind: forced override > crash > price/mood classification.
  let kind = forcedKind ?? "noMove";
  if (!forcedKind) {
    if (crashed || mood >= enc.crashThreshold - 8) kind = "nearCrash";
    else if (priceFrac > 0.0001) kind = "priceUp";
    else if (priceFrac <= -0.07) kind = "priceDownBig";
    else if (priceFrac < -0.0001) kind = "priceDownSmall";
    else if (moodDelta < -0.5) kind = "moodDown";
    else if (moodDelta > 3) kind = "moodUp";
    else kind = "noMove";
  }

  const line = event === "phone" ? pickLine(enc.vendor, "phone", rng) : pickLine(enc.vendor, kind, rng);

  const reaction: Reaction = {
    kind,
    line,
    priceDelta: round2(newPrice - enc.currentPrice),
    moodDelta: Math.round(moodDelta),
    event,
  };

  return {
    ...enc,
    currentPrice: newPrice,
    mood,
    patience,
    distractedTurns,
    behaviorState,
    turnCount: enc.turnCount + 1,
    crashed,
    lastReaction: reaction,
  };
}

export function dealResult(enc: EncounterState): DealResult {
  const savings = round2(enc.openingAsk - enc.currentPrice);
  const discountPct =
    enc.openingAsk > 0 ? Math.round((savings / enc.openingAsk) * 1000) / 10 : 0;
  return { savings, discountPct };
}

// How close the vendor is to walking — used only to drive UI (never shown numerically).
export function vendorTension(enc: EncounterState): "calm" | "wary" | "edge" {
  const ratio = enc.mood / enc.crashThreshold;
  if (ratio >= 0.75) return "edge";
  if (ratio >= 0.45) return "wary";
  return "calm";
}
