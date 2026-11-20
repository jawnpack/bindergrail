// LOGO CANVA DIRECTIONS — Origins
// Canvas: 400 x 100px, transparent background
// "Origins" — Playfair Display Bold Italic, 52px, #2C2A22 (Ink)
// Just the "O" colored #B07035 (Amber) — rest stays ink
// Below: "a Binder Grail app" — DM Sans Light, 14px, #7A6E5F, letter-spacing +80
// Export as PNG 2x transparent
// Also export a cream version (#F5F0E8) for use on dark backgrounds

import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";
import OriginsScreenshotStrip from "@/components/OriginsScreenshotStrip";
import JsonLd from "@/components/JsonLd";
import Band from "@/components/ui/Band";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import StatusBadge from "@/components/ui/StatusBadge";

export const metadata: Metadata = {
  title: "Origins — Pokémon TCG Collection Tracker",
  description:
    "Track every card you own. Search the full Pokémon TCG database, log condition and price paid, and see your collection value at a glance. Coming soon from Binder Grail.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://bindergrail.com/origins" },
  openGraph: {
    type: "website",
    siteName: "Binder Grail",
    title: "Origins — Pokémon TCG Collection Tracker",
    description:
      "Track every card you own. Search the full Pokémon TCG database, log condition and price paid, and see your collection value at a glance.",
    url: "https://bindergrail.com/origins",
    images: [{ url: "/images/binder_grail_logo.png", width: 511, height: 234 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function OriginsPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Origins",
          applicationCategory: "LifestyleApplication",
          operatingSystem: "Web",
          url: "https://bindergrail.com/origins",
          description:
            "Track every Pokémon card you own. Log condition and price paid, and see your collection value at a glance.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@type": "Organization", name: "Binder Grail", url: "https://bindergrail.com" },
        }}
      />

      {/* ── Hero: the app's own header folded in as the top row ─────── */}
      <Band surface="parchment" rule={false} reveal={false} rhythm="none" className="pt-6 pb-(--band-y)">
        <Container width="content">
          <div className="mb-(--band-y-tight) flex flex-wrap items-center justify-between gap-4 border-b border-cream-hairline pb-5">
            <p className="leading-tight">
              <span className="block font-serif text-display-s italic text-on-cream">Origins</span>
              <span className="text-label uppercase text-on-cream-muted">a Binder Grail app</span>
            </p>
            <StatusBadge status="soon" surface="parchment" label="Coming soon" />
          </div>

          <div className="max-w-prose">
            <Kicker surface="parchment" className="mb-5">
              Pokémon TCG · Collection tracker
            </Kicker>
            <h1 className="font-serif text-display-xl text-on-cream">
              Your collection.
              <br />
              <em className="text-amber-deep">Every card.</em>
              <br />
              One place.
            </h1>
            <p className="mt-6 max-w-measure-lead text-lead text-pretty text-on-cream-muted">
              Search the full card database. Log what you own, what you paid, and what condition
              it&apos;s in.
            </p>

            <ul className="mt-7 flex flex-col gap-2">
              {[
                "Search the TCGdex database — every set, every card",
                "Log condition, price paid, and grading status per card",
                "Collection value summary and graded card tracker",
              ].map((f) => (
                <li key={f} className="flex gap-3 text-meta text-on-cream">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rotate-45 bg-amber" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <p className="mt-10 mb-3 text-ui font-medium text-on-cream">Get notified at launch</p>
            <WaitlistForm app="origins" surface="parchment" />
            <p className="mt-2 text-meta text-on-cream-muted">No spam. Just a launch notification.</p>
          </div>
        </Container>
      </Band>

      <OriginsScreenshotStrip />
    </>
  );
}
