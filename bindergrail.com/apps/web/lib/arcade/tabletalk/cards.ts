import type { Card } from "./types.ts";

// Invented card data (no real Pokémon IP). Adding hundreds more is just more rows.
// market_reference_price trends up by era; condition/grading vary independently.
export const CARDS: Card[] = [
  // ── Modern ──────────────────────────────────────────────
  { card_id: "m-emberkit-ex", display_name: "Emberkit ex", era_category: "modern", set_name: "Ashfall", year: 2024, rarity: "Double Rare", condition_type: "raw", market_reference_price: 18, flavor_text: "Still warm from the pack." },
  { card_id: "m-glassfinch", display_name: "Glassfinch", era_category: "modern", set_name: "Prism Hollow", year: 2023, rarity: "Illustration Rare", condition_type: "graded", grading_company: "PSA", grade: 10, market_reference_price: 54, flavor_text: "Clean gem copy." },
  { card_id: "m-voltmoth", display_name: "Voltmoth", era_category: "modern", set_name: "Static Skies", year: 2024, rarity: "Common", condition_type: "raw", market_reference_price: 6, flavor_text: "A dime-bin regular." },
  { card_id: "m-pebblepup", display_name: "Pebblepup", era_category: "modern", set_name: "Verdant Crown", year: 2023, rarity: "Uncommon", condition_type: "raw", market_reference_price: 9, flavor_text: "Cheap but charming." },
  { card_id: "m-tidecaller", display_name: "Tidecaller", era_category: "modern", set_name: "Salt & Storm", year: 2024, rarity: "Ultra Rare", condition_type: "graded", grading_company: "CGC", grade: 9.5, market_reference_price: 42, flavor_text: "Chase card of the set." },
  { card_id: "m-dawnfern", display_name: "Dawnfern", era_category: "modern", set_name: "Verdant Crown", year: 2023, rarity: "Rare", condition_type: "raw", market_reference_price: 14, flavor_text: "Sleeper pick." },
  { card_id: "m-sparkcub", display_name: "Sparkcub", era_category: "modern", set_name: "Static Skies", year: 2024, rarity: "Double Rare", condition_type: "graded", grading_company: "PSA", grade: 9, market_reference_price: 31, flavor_text: "Popular grade." },
  { card_id: "m-marshling", display_name: "Marshling", era_category: "modern", set_name: "Ashfall", year: 2024, rarity: "Common", condition_type: "raw", market_reference_price: 5, flavor_text: "Bulk, but cute." },

  // ── Mid-Modern ──────────────────────────────────────────
  { card_id: "x-moss-golem", display_name: "Moss Golem", era_category: "mid", set_name: "Overgrowth", year: 2016, rarity: "Secret Rare", condition_type: "graded", grading_company: "PSA", grade: 10, market_reference_price: 220, flavor_text: "Set chase, tough in 10." },
  { card_id: "x-dusk-warden", display_name: "Dusk Warden", era_category: "mid", set_name: "Nightfall", year: 2014, rarity: "Full Art", condition_type: "graded", grading_company: "PSA", grade: 9, market_reference_price: 130, flavor_text: "Beloved full art." },
  { card_id: "x-stormcrown", display_name: "Stormcrown", era_category: "mid", set_name: "Tempest", year: 2017, rarity: "Ultra Rare", condition_type: "raw", market_reference_price: 72, flavor_text: "Clean raw copy." },
  { card_id: "x-cinderplume", display_name: "Cinderplume", era_category: "mid", set_name: "Overgrowth", year: 2016, rarity: "Holo Rare", condition_type: "raw", market_reference_price: 48, flavor_text: "Light edge wear." },
  { card_id: "x-frostvane", display_name: "Frostvane", era_category: "mid", set_name: "Nightfall", year: 2014, rarity: "Secret Rare", condition_type: "graded", grading_company: "BGS", grade: 9.5, market_reference_price: 185, flavor_text: "Subgrade darling." },
  { card_id: "x-grivener", display_name: "Grivener", era_category: "mid", set_name: "Tempest", year: 2017, rarity: "Reverse Holo", condition_type: "raw", market_reference_price: 36, flavor_text: "Underrated." },
  { card_id: "x-lumenstag", display_name: "Lumenstag", era_category: "mid", set_name: "Aurora", year: 2015, rarity: "Full Art", condition_type: "graded", grading_company: "PSA", grade: 8, market_reference_price: 95, flavor_text: "Honest 8." },
  { card_id: "x-thornjaw", display_name: "Thornjaw", era_category: "mid", set_name: "Overgrowth", year: 2016, rarity: "Holo Rare", condition_type: "raw", market_reference_price: 60, flavor_text: "Soft corners." },

  // ── Vintage ─────────────────────────────────────────────
  { card_id: "v-ancient-roar", display_name: "Ancient Roar", era_category: "vintage", set_name: "First Light", year: 1999, rarity: "Holo Rare", condition_type: "graded", grading_company: "PSA", grade: 9, market_reference_price: 1200, flavor_text: "Grail-tier." },
  { card_id: "v-emberking", display_name: "Emberking", era_category: "vintage", set_name: "First Light", year: 1999, rarity: "Holo Rare", condition_type: "graded", grading_company: "PSA", grade: 7, market_reference_price: 420, flavor_text: "Played but iconic." },
  { card_id: "v-seafounder", display_name: "Seafounder", era_category: "vintage", set_name: "Tidal", year: 2000, rarity: "Holo Rare", condition_type: "raw", market_reference_price: 260, flavor_text: "Raw, light whitening." },
  { card_id: "v-oldgrove", display_name: "Old Grove", era_category: "vintage", set_name: "Verdant Past", year: 2001, rarity: "Holo Rare", condition_type: "raw", market_reference_price: 190, flavor_text: "Edge wear, strong eye appeal." },
  { card_id: "v-stormfather", display_name: "Stormfather", era_category: "vintage", set_name: "Tidal", year: 2000, rarity: "Secret Rare", condition_type: "graded", grading_company: "PSA", grade: 8, market_reference_price: 640, flavor_text: "Set centerpiece." },
  { card_id: "v-firstlight-promo", display_name: "First Light Promo", era_category: "vintage", set_name: "Promo", year: 1999, rarity: "Promo", condition_type: "graded", grading_company: "CGC", grade: 9.5, market_reference_price: 820, flavor_text: "Rare promo." },
  { card_id: "v-moonfang", display_name: "Moonfang", era_category: "vintage", set_name: "Eclipse", year: 2002, rarity: "Holo Rare", condition_type: "raw", market_reference_price: 150, flavor_text: "Affordable vintage." },
  { card_id: "v-crownleaf", display_name: "Crownleaf", era_category: "vintage", set_name: "Verdant Past", year: 2001, rarity: "Secret Rare", condition_type: "graded", grading_company: "PSA", grade: 10, market_reference_price: 1500, flavor_text: "Population scarce." },
];
