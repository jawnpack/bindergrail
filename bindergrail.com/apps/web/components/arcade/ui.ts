// Shared class strings for the arcade. Kept as literal strings so Tailwind's
// scanner generates them, and so the "drop shadow / bevel / rim" tokens from the
// brief live in exactly one place. Every color is a theme variable.

import type { Accent } from "@/lib/arcade/config";

// 4px hard drop shadow, no blur.
export const DROP = "shadow-[4px_4px_0_var(--color-ink-950)]";

// Cream text-box rim: 3px cream border + ink keyline + offset drop.
export const RIM =
  "border-[3px] border-cream-100 shadow-[0_0_0_3px_var(--color-ink-950),6px_6px_0_3px_var(--color-ink-950)]";

// Panel: ink-900 surface, ink-600 border, hard drop.
export const PANEL = "bg-ink-900 border-[3px] border-ink-600 " + DROP;

export const accentText: Record<Accent, string> = {
  gold: "text-gold-400",
  blue: "text-blue-400",
  cyan: "text-cyan-300",
  magenta: "text-magenta-400",
};

export const accentBorder: Record<Accent, string> = {
  gold: "border-gold-400",
  blue: "border-blue-400",
  cyan: "border-cyan-300",
  magenta: "border-magenta-400",
};

export const accentShadow: Record<Accent, string> = {
  gold: "[text-shadow:4px_4px_0_var(--color-gold-700)]",
  blue: "[text-shadow:4px_4px_0_var(--color-blue-700)]",
  cyan: "[text-shadow:4px_4px_0_var(--color-ink-800)]",
  magenta: "[text-shadow:4px_4px_0_var(--color-ink-700)]",
};
