import type { Metadata } from "next";
import Band from "@/components/ui/Band";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";

export const metadata: Metadata = {
  title: "About Binder Grail",
  description:
    "A Pokémon TCG platform for collectors who have a life outside of buying and selling cards. Built by a collector, for collectors.",
  alternates: { canonical: "https://bindergrail.com/about" },
  openGraph: {
    type: "website",
    siteName: "Binder Grail",
    title: "About Binder Grail",
    description:
      "A Pokémon TCG platform for collectors who have a life outside of buying and selling cards.",
    url: "https://bindergrail.com/about",
    images: [{ url: "/images/binder_grail_logo.png", width: 511, height: 234 }],
  },
  twitter: { card: "summary_large_image" },
};

const HERE = [
  {
    name: "Common Rare — Free newsletter",
    badge: <StatusBadge status="live" label="Weekly" />,
    body: "Market analysis and collecting strategy delivered weekly-ish. No spam, no hype, just the thinking.",
  },
  {
    name: "Pocket Money — Live now",
    badge: <StatusBadge status="live" />,
    body: "A simple tool for managing your monthly collecting budget. Set a limit, log your pickups, and save toward your grail.",
  },
  {
    name: "Origins — Coming soon",
    badge: <StatusBadge status="soon" surface="parchment" />,
    body: "A collection tracker for every card you own. Log condition, price paid, and see what your binder is worth.",
  },
];

export default function AboutPage() {
  return (
    <>
      <main className="flex-1 bg-cream px-(--gutter) pt-(--band-y-tight) pb-(--band-y)">
        <div className="mx-auto max-w-prose">
          <h1 className="font-serif text-display-l text-on-cream">About Binder Grail</h1>
          <p className="mt-4 max-w-measure-lead text-lead text-pretty text-on-cream-muted">
            A Pokémon TCG platform for collectors who have a life outside of buying and selling cards.
          </p>

          <section aria-labelledby="author" className="mt-12 border-t border-cream-hairline pt-10">
            <h2 id="author" className="mb-6 font-serif text-display-m text-on-cream">
              Jon Paek
            </h2>
            <div className="max-w-measure space-y-5 text-body text-pretty text-on-cream">
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

          <section
            aria-labelledby="whats-here"
            className="mt-12 rounded-md border border-cream-hairline bg-parchment p-6 md:p-8"
          >
            <h2 id="whats-here" className="mb-5 font-serif text-display-s text-on-cream">
              What&apos;s here
            </h2>
            <dl className="divide-y divide-cream-hairline">
              {HERE.map((h) => (
                <div key={h.name} className="py-4 first:pt-0 last:pb-0">
                  <dt className="flex flex-wrap items-center gap-3 text-ui font-medium text-on-cream">
                    {h.name}
                    {h.badge}
                  </dt>
                  <dd className="mt-1 max-w-measure-card text-meta text-on-cream-muted">{h.body}</dd>
                </div>
              ))}
            </dl>
          </section>

          <Button href="https://commonrare.bindergrail.com" variant="primary-light" className="mt-10">
            Subscribe to Common Rare
          </Button>
        </div>
      </main>

      <Band surface="ink" rhythm="tight" labelledBy="about-cr">
        <div className="mx-auto max-w-prose px-(--gutter) md:px-0">
          <SectionHeader
            id="about-cr"
            surface="ink"
            size="m"
            kicker="Common Rare · Free newsletter"
            title="The weekly read for frugal collectors."
          />
          <Button href="https://commonrare.bindergrail.com" variant="primary" className="mt-6">
            Subscribe to Common Rare
          </Button>
        </div>
      </Band>
    </>
  );
}
