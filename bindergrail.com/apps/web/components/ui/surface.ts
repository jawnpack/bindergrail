// Every block on the site sits on one of these surfaces. Components take a
// `surface` so text, hairlines and accents pick the token that passes contrast
// on it — never a hardcoded color.
export type Surface = "cream" | "parchment" | "ink" | "forest";

export const isDark = (s: Surface) => s === "ink" || s === "forest";

export const SURFACE_BG: Record<Surface, string> = {
  cream: "bg-cream text-on-cream",
  parchment: "bg-parchment text-on-cream",
  ink: "bg-ink text-on-ink",
  forest: "bg-forest text-on-forest",
};

export const HAIRLINE: Record<Surface, string> = {
  cream: "border-cream-hairline",
  parchment: "border-cream-hairline",
  ink: "border-ink-hairline",
  forest: "border-forest-hairline",
};

export const MUTED: Record<Surface, string> = {
  cream: "text-on-cream-muted",
  parchment: "text-on-cream-muted",
  ink: "text-on-ink-muted",
  forest: "text-on-forest-muted",
};

// Amber as TEXT: bright on ink, deep on light (decorative --amber never).
// Forest is the exception: amber-bright is only 3.5:1 there, so accent text on
// Pocket Money's surface uses its own pale green (6.4:1).
export const AMBER_TEXT: Record<Surface, string> = {
  cream: "text-amber-deep",
  parchment: "text-amber-deep",
  ink: "text-amber-bright",
  forest: "text-on-forest-muted",
};

// Raised blocks (cards, chips) on each surface.
export const RAISED: Record<Surface, string> = {
  cream: "bg-parchment",
  parchment: "bg-cream",
  ink: "bg-ink-raised",
  forest: "bg-forest-raised",
};
