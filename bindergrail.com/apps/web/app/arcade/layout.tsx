import type { Metadata } from "next";
import { Press_Start_2P, Pixelify_Sans, VT323 } from "next/font/google";
import CrtOverlay from "@/components/arcade/CrtOverlay";

const display = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-press-start",
});
const body = Pixelify_Sans({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixelify",
});
const num = VT323({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-vt323",
});

export const metadata: Metadata = {
  title: "Arcade",
  description:
    "The Binder Grail Arcade — daily Pokémon TCG games. Grade raw cards in Gut Check, call sold prices in Comp Check, haggle in Table Talk, and open your own shop in The Cardboard Flip.",
  alternates: { canonical: "https://bindergrail.com/arcade" },
  openGraph: {
    type: "website",
    siteName: "Binder Grail",
    title: "Binder Grail Arcade",
    description:
      "Daily Pokémon TCG games — grade cards, call comps, haggle, and flip your way to your own shop.",
    url: "https://bindergrail.com/arcade",
    images: [{ url: "/images/binder_grail_logo.png", width: 511, height: 234 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function ArcadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${display.variable} ${body.variable} ${num.variable} min-h-screen bg-ink-950 bg-[radial-gradient(var(--color-ink-800)_1px,transparent_1px)] [background-size:16px_16px] font-body text-[16px] leading-[1.45] text-cream-100`}
    >
      {children}
      <CrtOverlay />
    </div>
  );
}
