import type {
  EraConfig,
  EraId,
  TacticConfig,
  TacticId,
  VendorConfig,
  VendorId,
} from "./types.ts";

// ── Eras: the risk/reward axis. Modern safe/small, Vintage risky/big. ──
export const ERAS: Record<EraId, EraConfig> = {
  modern: {
    id: "modern",
    label: "Modern",
    weight: 45,
    markup: [0.05, 0.2],
    floorDiscount: [0.03, 0.08],
    angerMult: 0.8,
  },
  mid: {
    id: "mid",
    label: "Mid-Modern",
    weight: 40,
    markup: [0.12, 0.3],
    floorDiscount: [0.08, 0.18],
    angerMult: 1.0,
  },
  vintage: {
    id: "vintage",
    label: "Vintage",
    weight: 15,
    markup: [0.2, 0.45],
    floorDiscount: [0.15, 0.35],
    angerMult: 1.3,
  },
};

export const ERA_IDS: EraId[] = ["modern", "mid", "vintage"];
export const VENDOR_IDS: VendorId[] = ["friendly", "busy", "tough"];

// ── Tactics: base effects, before vendor/era modifiers. ──
export const TACTICS: Record<TacticId, TacticConfig> = {
  respectful: {
    id: "respectful",
    label: "Respectful offer",
    hint: "Small, polite discount.",
    priceMove: [-0.08, -0.03],
    mood: [0, 3],
  },
  lowball: {
    id: "lowball",
    label: "Lowball",
    hint: "Big swing — big risk.",
    priceMove: [-0.26, -0.1],
    mood: [12, 26],
  },
  compliment: {
    id: "compliment",
    label: "Compliment the card",
    hint: "Warm them up.",
    priceMove: [-0.01, 0],
    mood: [-7, -2],
  },
  ask: {
    id: "ask",
    label: "Ask about the card",
    hint: "Soften them, learn something.",
    priceMove: [-0.03, 0],
    mood: [-4, 1],
  },
  walk_bluff: {
    id: "walk_bluff",
    label: "Pretend to walk",
    hint: "Might snap a discount — or snap them.",
    priceMove: [-0.2, 0],
    mood: [3, 10],
  },
  flaw: {
    id: "flaw",
    label: "Point out a flaw",
    hint: "Works when there's a real issue.",
    priceMove: [-0.14, -0.03],
    mood: [2, 8],
  },
  cash: {
    id: "cash",
    label: "Offer cash / quick deal",
    hint: "Speed over sentiment.",
    priceMove: [-0.11, -0.03],
    mood: [0, 3],
  },
};

export const TACTIC_ORDER: TacticId[] = [
  "respectful",
  "cash",
  "compliment",
  "ask",
  "flaw",
  "walk_bluff",
  "lowball",
];

export const ENCOUNTER_WEIGHTS: Record<EraId, number> = {
  modern: 45,
  mid: 40,
  vintage: 15,
};

// ── Vendors: personality via tactic multipliers + reaction dialogue. ──
export const VENDORS: Record<VendorId, VendorConfig> = {
  friendly: {
    id: "friendly",
    label: "The Friendly Collector",
    blurb: "Chatty, loves the hobby. Build rapport before you push.",
    patience: [70, 92],
    crashThreshold: [78, 92],
    floorFactor: 1.15,
    phoneBehavior: false,
    walkBluffBackfire: 0.2,
    initialState: "chatty",
    tactics: {
      respectful: { priceMult: 1.1, moodMult: 0.8 },
      lowball: { priceMult: 1.0, moodMult: 0.6 },
      compliment: { priceMult: 1.0, moodMult: 1.4 },
      ask: { priceMult: 1.2, moodMult: 1.4 },
      walk_bluff: { priceMult: 1.0, moodMult: 1.0 },
      flaw: { priceMult: 1.0, moodMult: 0.9 },
      cash: { priceMult: 0.9, moodMult: 1.0 },
    },
    reactions: {
      open: ["“Oh, this one's a favorite of mine.”", "“Great eye — want to hear the story on it?”"],
      priceDownBig: ["He grins. “Alright, you talked me into it.”", "“For you? Sure, I can do that.”"],
      priceDownSmall: ["“Yeah, I can come down a little.”", "He nods. “That's fair.”"],
      noMove: ["“Let me think about it...”", "He tilts his head. “Maybe.”"],
      priceUp: ["“Hmm, actually that one's worth a bit more.”", "“Now you've got me second-guessing the price.”"],
      moodDown: ["He lights up. “Yeah! I pulled this myself.”", "“You really know your stuff.”"],
      moodUp: ["He folds his arms. “That's a little low, friend.”", "“Come on now.”"],
      nearCrash: ["His smile fades. “I'm trying to be nice here.”", "“Let's keep it friendly, yeah?”"],
    },
  },
  busy: {
    id: "busy",
    label: "The Busy Dealer",
    blurb: "Distracted and time-pressed. Strike fast, keep it moving.",
    patience: [42, 64],
    crashThreshold: [60, 80],
    floorFactor: 1.0,
    phoneBehavior: true,
    walkBluffBackfire: 0.3,
    initialState: "scanning",
    tactics: {
      respectful: { priceMult: 1.0, moodMult: 1.0 },
      lowball: { priceMult: 1.0, moodMult: 1.1 },
      compliment: { priceMult: 0.7, moodMult: 0.6 },
      ask: { priceMult: 0.8, moodMult: 0.5 },
      walk_bluff: { priceMult: 1.1, moodMult: 1.0 },
      flaw: { priceMult: 1.0, moodMult: 1.0 },
      cash: { priceMult: 1.4, moodMult: 1.2 },
    },
    reactions: {
      open: ["“What do you need? I've got a line forming.”", "“Make it quick, I'm slammed today.”"],
      priceDownBig: ["“Fine, done. Next.”", "“Sold. Cash?”"],
      priceDownSmall: ["“Yeah, whatever, a little off.”", "“Sure. Moving on.”"],
      noMove: ["He shrugs, eyes on the room.", "“Can't right now.”"],
      priceUp: ["“Actually there's someone else asking. It's more.”", "“Price went up, pal.”"],
      moodDown: ["“Appreciate it. Quick though.”", "He nods, half-listening."],
      moodUp: ["He sighs. “Can we do this quickly?”", "“You're wasting my time.”"],
      phone: ["His phone buzzes. He looks down.", "A notification pulls his eyes away.", "He glances at the sales app."],
      nearCrash: ["“I don't have time for this.”", "He looks toward security."],
    },
  },
  tough: {
    id: "tough",
    label: "The Tough Negotiator",
    blurb: "Knows every comp. Subtlety works; bullying backfires.",
    patience: [55, 78],
    crashThreshold: [54, 70],
    floorFactor: 0.8,
    phoneBehavior: false,
    walkBluffBackfire: 0.4,
    initialState: "firm",
    tactics: {
      respectful: { priceMult: 1.1, moodMult: 0.9 },
      lowball: { priceMult: 0.6, moodMult: 1.6 },
      compliment: { priceMult: 0.8, moodMult: 0.8 },
      ask: { priceMult: 0.9, moodMult: 0.9 },
      walk_bluff: { priceMult: 0.9, moodMult: 1.2 },
      flaw: { priceMult: 1.2, moodMult: 1.0 },
      cash: { priceMult: 1.0, moodMult: 1.0 },
    },
    reactions: {
      open: ["“You know what these go for.”", "He taps the case. “Price is the price.”"],
      priceDownBig: ["He exhales. “One time. Don't tell anyone.”", "“Fine. You drive a hard bargain.”"],
      priceDownSmall: ["“I can shave a little. That's it.”", "“Barely. There.”"],
      noMove: ["“That's my price.”", "He doesn't blink."],
      priceUp: ["“Insult me and the number goes up.”", "His tone sharpens. “Now it's more.”"],
      moodDown: ["A small nod. “You've done your homework.”", "“Respect.”"],
      moodUp: ["He raises an eyebrow.", "“You're not serious.”"],
      nearCrash: ["“We're about done here.”", "He stares. “Last chance to be reasonable.”"],
    },
  },
};
