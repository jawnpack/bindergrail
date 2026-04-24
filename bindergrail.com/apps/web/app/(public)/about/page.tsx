import type { Metadata } from "next";
import GrainOverlay from "@/components/GrainOverlay";

export const metadata: Metadata = {
  title: "About Binder Grail",
  description:
    "A Pokémon TCG platform for collectors who have a life outside of buying and selling cards. Built by a collector, for collectors.",
  alternates: { canonical: "https://bindergrail.com/about" },
  openGraph: {
    title: "About Binder Grail",
    description:
      "A Pokémon TCG platform for collectors who have a life outside of buying and selling cards.",
    url: "https://bindergrail.com/about",
    images: [{ url: "/images/binder_grail_logo.png", width: 511, height: 234 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function AboutPage() {
  return (
    <>
      <main className="flex-1 py-14" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-[680px] mx-auto px-6">
          {/* Header */}
          <h1
            className="text-[36px] md:text-[48px] font-black tracking-tight mb-3"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
          >
            About Binder Grail
          </h1>
          <p className="text-[16px] leading-relaxed mb-12" style={{ color: "#7A7468" }}>
            A Pokémon TCG platform for collectors who have a life outside of buying and selling cards.
          </p>

          {/* Author */}
          <section className="mb-12">
            <h2
              className="text-[22px] font-bold mb-6"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
            >
              Jon Paek
            </h2>

            <div className="space-y-5 text-[15px] leading-[1.75]" style={{ color: "#1A1814" }}>
              <p>
                I spent over a decade working in supply chain and ERP — thinking about inventory cycles, demand signals, and the gap between what systems say and what markets do. That lens transfers surprisingly well to Pokémon TCG investing. Print cycles are supply chain problems. Secondary market pricing is demand signaling. Understanding when to hold and when to move is just applied logistics.
              </p>
              <p>
                I grew up with Pokémon and, like a lot of people my age, drifted away and came back. A sneakerhead background helped — the parallels between limited releases, restock hunting, and secondary market dynamics are almost identical. When I started buying sealed product seriously, I already knew how to think about it.
              </p>
              <p>
                I started Binder Grail because most Pokémon content tells you what&apos;s hot, not how to think about it. There&apos;s no shortage of &quot;buy this card now&quot; content. There&apos;s a shortage of frameworks — the kind of thinking that helps you make a good call on your own when the next set drops and nobody&apos;s covered it yet.
              </p>
              <p>
                What I publish here: honest market analysis, sealed product strategy, grading guidance, and a frugal collecting philosophy that assumes you&apos;re working with a real budget and a real life. No hype, no filler, no affiliate links to cards I don&apos;t believe in.
              </p>
            </div>
          </section>

          {/* Platform section */}
          <section
            className="rounded-sm p-8 mb-12 border"
            style={{ borderColor: "#D8D0C0", backgroundColor: "#FDFAF5" }}
          >
            <h2
              className="text-[20px] font-bold mb-5"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
            >
              What&apos;s here
            </h2>
            <dl className="space-y-4 text-[14px]">
              <div>
                <dt className="font-semibold mb-1" style={{ color: "#1A1814" }}>
                  Common Rare — Free newsletter
                </dt>
                <dd style={{ color: "#7A7468" }}>
                  Market analysis and collecting strategy delivered weekly-ish. No spam, no hype, just the thinking.
                </dd>
              </div>
              <div>
                <dt className="font-semibold mb-1" style={{ color: "#7A7468" }}>
                  Origins — Coming soon
                </dt>
                <dd style={{ color: "#7A7468" }}>
                  A deep-dive into Pokémon set history and what it tells us about long-term value.
                </dd>
              </div>
              <div>
                <dt className="font-semibold mb-1" style={{ color: "#7A7468" }}>
                  Budget tool — Coming soon
                </dt>
                <dd style={{ color: "#7A7468" }}>
                  A simple tool for managing your monthly collecting budget and tracking what you own.
                </dd>
              </div>
            </dl>
          </section>

          <a
            href="https://commonrare.bindergrail.com"
            className="inline-block rounded-sm px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#B07035", color: "#F5F0E8" }}
          >
            Subscribe to Common Rare
          </a>
        </div>
      </main>

      {/* Newsletter strip */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "#1A1814" }}>
        <GrainOverlay />
        <div className="relative z-10 max-w-[680px] mx-auto px-6 py-14">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-3"
            style={{ color: "#B07035" }}
          >
            Common Rare · Free newsletter
          </p>
          <h2
            className="text-[24px] font-bold mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5F0E8" }}
          >
            The weekly read for frugal collectors.
          </h2>
          <a
            href="https://commonrare.bindergrail.com"
            className="inline-block rounded-sm px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#B07035", color: "#F5F0E8" }}
          >
            Subscribe to Common Rare
          </a>
        </div>
      </section>
    </>
  );
}
