// Brand tokens for build-time image generation (favicon, apple-icon,
// manifest icons). ImageResponse/Satori can't read the CSS variables in
// globals.css, so the icon colors live here as the single source of truth.
// Keep these in sync with the matching --pm-* tokens in app/globals.css.
export const BRAND = {
  greenMid: "#639922", // --pm-green-mid  (icon tile background)
  greenLightest: "#EAF3DE", // --pm-green-lightest (monogram letters)
  ink: "#2C2C2A", // --pm-ink (manifest theme color)
} as const;
