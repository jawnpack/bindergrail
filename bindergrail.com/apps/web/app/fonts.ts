import { Playfair_Display, DM_Sans } from "next/font/google";

// Marketing-site fonts. Applied by the (public), (auth) and (dashboard) layouts
// and the 404 page — NOT the root layout — so /arcade never loads or preloads
// them (it has its own pixel fonts in app/arcade/layout.tsx).

// Display face for headings, including the homepage H1 (which uses both the
// normal and italic styles). Variable file, so one woff2 per style covers
// every weight.
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
});

// Body text, also above the fold (nav + hero copy). Kept preloaded on purpose:
// without it the nav visibly re-flows when DM Sans swaps in (measured CLS
// 0.0002 vs 0 with it). Variable file, so one woff2 covers every weight.
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

// Sets the font variables and the body face on a layout's wrapper element.
export const siteFontClass = `${playfair.variable} ${dmSans.variable} site-fonts`;
