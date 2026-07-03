// Solid-color avatar options. Colors as data, like tags.ts — all dark
// enough that the light initials stay readable.
export const AVATAR_COLORS = [
  { name: "Grass", value: "#3B6D11" },
  { name: "Fire", value: "#A32D2D" },
  { name: "Water", value: "#185FA5" },
  { name: "Psychic", value: "#534AB7" },
  { name: "Rock", value: "#854F0B" },
  { name: "Fairy", value: "#A3325F" },
  { name: "Steel", value: "#4A5561" },
  { name: "Dark", value: "#2C2C2A" },
] as const;

export const DEFAULT_AVATAR_COLOR = AVATAR_COLORS[0].value;
