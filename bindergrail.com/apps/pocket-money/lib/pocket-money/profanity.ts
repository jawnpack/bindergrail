// Lightweight obscenity check for display names. Normalizes common
// letter substitutions, then checks a curated list. Substring matches
// are limited to words that can't appear inside innocent names;
// shorter/ambiguous words only match as whole tokens.

const LEET_MAP: Record<string, string> = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  "8": "b",
  "@": "a",
  $: "s",
  "!": "i",
  "+": "t",
};

// Unambiguous even as substrings
const SUBSTRING_BANNED = [
  "fuck",
  "shit",
  "cunt",
  "bitch",
  "nigg",
  "faggot",
  "fagot",
  "retard",
  "whore",
  "slut",
  "wanker",
  "jizz",
  "pussy",
  "twat",
  "kike",
  "beaner",
  "tranny",
];

// Only banned as standalone words (avoids the Scunthorpe problem)
const EXACT_BANNED = [
  "ass",
  "arse",
  "cum",
  "cock",
  "dick",
  "fag",
  "hoe",
  "tit",
  "tits",
  "spic",
  "chink",
  "coon",
  "paki",
];

function normalize(input: string): string {
  return input
    .toLowerCase()
    .split("")
    .map((ch) => LEET_MAP[ch] ?? ch)
    .join("");
}

export function isNameAllowed(name: string): { ok: boolean; reason?: string } {
  const trimmed = name.trim();

  if (trimmed.length < 1) return { ok: false, reason: "Name can't be empty." };
  if (trimmed.length > 30)
    return { ok: false, reason: "Keep it under 30 characters." };

  const normalized = normalize(trimmed);
  const collapsed = normalized.replace(/[^a-z]/g, "");
  const tokens = normalized.split(/[^a-z]+/).filter(Boolean);

  for (const word of SUBSTRING_BANNED) {
    if (collapsed.includes(word)) {
      return { ok: false, reason: "Pick a friendlier name, trainer." };
    }
  }
  for (const word of EXACT_BANNED) {
    if (tokens.includes(word)) {
      return { ok: false, reason: "Pick a friendlier name, trainer." };
    }
  }

  return { ok: true };
}
