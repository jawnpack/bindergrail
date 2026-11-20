import { isDark, AMBER_TEXT, MUTED, type Surface } from "./surface";

// Text inputs: 44px tall, ui step, hairline border that turns amber on hover;
// the global amber focus ring does the rest.
const BASE =
  "min-h-11 w-full rounded-sm border px-4 text-ui transition-colors duration-(--dur-fast) hover:border-amber disabled:opacity-60";

export function inputClass(surface: Surface) {
  return `${BASE} ${
    surface === "forest"
      ? "border-forest-hairline bg-forest-raised text-on-forest placeholder:text-on-forest-muted"
      : isDark(surface)
        ? "border-ink-hairline bg-ink-raised text-on-ink placeholder:text-on-ink-muted"
        : "border-cream-hairline bg-cream text-on-cream placeholder:text-on-cream-muted"
  }`;
}

// Status lines under a form.
export const noteClass = (surface: Surface) => `text-meta ${MUTED[surface]}`;
export const successClass = (surface: Surface) => `text-meta font-medium ${AMBER_TEXT[surface]}`;
export const errorClass = (surface: Surface) =>
  `text-meta font-medium ${isDark(surface) ? "text-on-ink" : "text-on-cream"}`;
