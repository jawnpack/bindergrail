import { Press_Start_2P } from "next/font/google";

// Pixel face for the Cardboard Flip banner. Below the fold everywhere it
// appears, so it isn't preloaded. The (public) layout imports this too, which
// puts its @font-face in the shared layout stylesheet — otherwise prefetching a
// page with the banner preloads a route-only stylesheet the current page never
// uses ("preloaded but not used"). The font file itself only downloads where
// the banner actually renders.
export const flipPixel = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-flip-pixel",
});
