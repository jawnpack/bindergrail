// @font-face rules for the root 404 page, injected with a plain inline <style>.
//
// Why not next/font or a stylesheet <link>: the 404 lives in the ROOT segment,
// so next/font CSS (or a hoisted React stylesheet resource) attached to it is
// preloaded on every route — including /arcade, which doesn't use these fonts.
// A plain <style> isn't a hoistable resource, so it only exists when the 404
// renders. Same variable woff2 files next/font self-hosts for the marketing site
// (Latin subset; SIL Open Font License), plus next/font's metric-matched
// fallbacks so the swap doesn't shift layout.
const LATIN =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";

export const NOT_FOUND_FONT_CSS = `
@font-face{font-family:"BG404 Playfair";font-style:normal;font-weight:400 900;font-display:swap;src:url(/fonts/not-found/playfair-display-latin.woff2) format("woff2");unicode-range:${LATIN}}
@font-face{font-family:"BG404 Playfair";font-style:italic;font-weight:400 900;font-display:swap;src:url(/fonts/not-found/playfair-display-italic-latin.woff2) format("woff2");unicode-range:${LATIN}}
@font-face{font-family:"BG404 DM Sans";font-style:normal;font-weight:100 1000;font-display:swap;src:url(/fonts/not-found/dm-sans-latin.woff2) format("woff2");unicode-range:${LATIN}}
@font-face{font-family:"BG404 Playfair Fallback";src:local("Times New Roman");ascent-override:97.25%;descent-override:22.56%;line-gap-override:0%;size-adjust:111.26%}
@font-face{font-family:"BG404 DM Sans Fallback";src:local(Arial);ascent-override:94.9%;descent-override:29.66%;line-gap-override:0%;size-adjust:104.53%}
`;

export const NOT_FOUND_FONT_VARS = {
  "--font-playfair": '"BG404 Playfair", "BG404 Playfair Fallback"',
  "--font-dm-sans": '"BG404 DM Sans", "BG404 DM Sans Fallback"',
};
