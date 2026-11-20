import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/posts";
import JsonLd from "@/components/JsonLd";
import CardboardFlipBanner from "@/components/CardboardFlipBanner";
import Band from "@/components/ui/Band";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import StatusBadge from "@/components/ui/StatusBadge";

export const metadata: Metadata = {
  title: "Binder Grail — Pokémon TCG Tools & Market Analysis for Frugal Collectors",
  description:
    "Market analysis, a free Pokémon TCG budget tracker, and the Common Rare newsletter — Binder Grail helps frugal collectors spend smarter.",
  openGraph: {
    type: "website",
    siteName: "Binder Grail",
    title: "Binder Grail",
    description: "Pokémon TCG tools and market analysis for frugal collectors.",
    images: [{ url: "/api/og?variant=home", width: 1200, height: 630 }],
  },
};

function Tag({ tag, surface = "cream" }: { tag: string; surface?: "cream" | "ink" }) {
  const market = tag === "Market";
  const tone = market
    ? surface === "ink"
      ? "text-amber-bright"
      : "text-amber-deep"
    : surface === "ink"
      ? "text-on-ink-muted"
      : "text-on-cream-muted";
  return <span className={`text-label uppercase ${tone}`}>{tag}</span>;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// The three doors into Binder Grail, shown beside the hero headline.
const ENTRIES = [
  {
    title: "Common Rare",
    body: "The weekly newsletter: market moves, restocks, a plain verdict on every product.",
    href: "https://commonrare.bindergrail.com",
    badge: <StatusBadge status="live" label="Weekly" />,
  },
  {
    title: "Pocket Money",
    body: "A free Pokémon budget tracker. Set a monthly budget and log what you buy.",
    href: "/pocket-money",
    badge: <StatusBadge status="live" />,
  },
  {
    title: "Arcade",
    body: "Daily Pokémon TCG games, free to play. Start with The Cardboard Flip.",
    href: "/arcade",
    badge: <StatusBadge status="new" />,
  },
];

const PM_FEATURES = [
  "A monthly budget envelope, with every purchase logged against it",
  "Holds for pre-orders and known costs, so nothing sneaks up on you",
  "A wishlist with one active grail and a fund that fills as you save",
  "Sale and return logging that flows the money back into your budget",
  "Tags and category stashes, so you see where the money actually goes",
  "Month-by-month history to spot the trend",
];

export default function HomePage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;
  const listed = rest.slice(0, 4);

  return (
    <>
      {/* Compact SoftwareApplication for Pocket Money. The full node
          (featureList + FAQ) lives on /pocket-money; same url + @id here
          so search engines treat them as one app, not a duplicate. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "@id": "https://pocketmoney.bindergrail.com/#app",
          name: "Pocket Money",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web",
          url: "https://pocketmoney.bindergrail.com",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: {
            "@type": "Organization",
            name: "Binder Grail",
            url: "https://bindergrail.com",
          },
        }}
      />

      {/* ── Hero: copy in cols 1–7, three entry cards in cols 9–12. No motion. */}
      <Band surface="ink" rule={false} reveal={false} rhythm="none" className="py-(--band-y-tight) lg:py-(--band-y)">
        <Container width="wide" className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <Kicker surface="ink" className="mb-5">
              Pokémon TCG · For frugal collectors
            </Kicker>
            <h1 className="font-serif text-display-xl text-on-ink">
              Collect <em className="text-amber-bright">smarter.</em>
              <br />
              Spend less.
              <br />
              Chase your grail.
            </h1>
            <p className="mt-6 max-w-measure-lead text-lead text-pretty text-on-ink-muted">
              Binder Grail is the home for budget-conscious Pokémon TCG collectors. Market
              analysis, collecting tools, and a weekly newsletter — built to help you collect
              consciously.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button href="/blog" variant="primary">
                Explore Binder Grail
              </Button>
              <Button href="https://commonrare.bindergrail.com" variant="quiet" className="text-on-ink">
                Read Common Rare, our newsletter
              </Button>
            </div>
          </div>

          <ul className="grid gap-3 sm:grid-cols-3 lg:col-span-4 lg:col-start-9 lg:grid-cols-1">
            {ENTRIES.map((e) => (
              <li key={e.title}>
                <Card
                  surface="ink"
                  href={e.href}
                  prefetch={e.href === "/arcade" ? false : undefined}
                  className="h-full p-5"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-serif text-display-s text-on-ink">{e.title}</span>
                    {e.badge}
                  </span>
                  <span className="mt-2 block text-meta text-on-ink-muted">{e.body}</span>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Band>

      {/* ── The Cardboard Flip (game demo) ────────────────────────── */}
      <CardboardFlipBanner variant="feature" />

      {/* ── Pocket Money: visual left, copy right ─────────────────── */}
      <Band surface="parchment" labelledBy="pm-title">
        <Container width="wide" className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="overflow-hidden rounded-md border border-cream-hairline lg:col-span-6">
            <Image
              src="/images/pocket-money/pm-dashboard-desktop.png"
              alt="The Pocket Money dashboard showing a monthly budget, a wallet split into stashes, holds, an active grail, and a transaction log"
              width={1328}
              height={699}
              sizes="(max-width: 1024px) 100vw, 600px"
              className="h-auto w-full"
            />
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <SectionHeader
              id="pm-title"
              surface="parchment"
              kicker="Pocket Money · A Binder Grail app"
              title={<>A Pokémon budget tracker that&apos;s actually free</>}
              lead="Set a monthly budget, log what you buy, and always know where you stand before the next drop. No account fees, no catch."
            />

            <ul className="mt-6 flex flex-wrap gap-2">
              {["Free forever", "No bank linking, ever", "No ads", "Your data is yours"].map((label) => (
                <li key={label}>
                  <Chip surface="parchment">{label}</Chip>
                </li>
              ))}
            </ul>

            <ul className="mt-7 flex max-w-measure flex-col gap-2.5">
              {PM_FEATURES.map((feature) => (
                <li key={feature} className="flex gap-3 text-meta text-on-cream">
                  <span aria-hidden="true" className="mt-1 shrink-0 text-amber-deep">
                    <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 6.2l2.2 2.2 4.8-5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button href="https://pocketmoney.bindergrail.com/signup" variant="primary-light">
                Start tracking free
              </Button>
              <Button href="/pocket-money" variant="quiet" prefetch={false} className="text-on-cream">
                See how it works
              </Button>
            </div>
          </div>
        </Container>
      </Band>

      {/* ── Latest ────────────────────────────────────────────────── */}
      <Band surface="cream" labelledBy="latest-title">
        <Container width="content">
          <div className="mb-10 flex items-end justify-between gap-6">
            <SectionHeader id="latest-title" title="Latest" size="l" />
            <Button href="/blog" variant="quiet" prefetch={false} className="shrink-0 text-amber-deep">
              All posts
            </Button>
          </div>

          {featured && (
            <Card surface="ink" href={`/blog/${featured.slug}`} prefetch={false} className="group mb-10 p-7 md:p-10">
              <span className="mb-4 flex items-center gap-4">
                <Tag tag={featured.tag} surface="ink" />
                <time dateTime={featured.date} className="text-meta text-on-ink-muted figures">
                  {formatDate(featured.date)}
                </time>
              </span>
              <span className="block max-w-measure font-serif text-display-m text-balance text-on-ink">
                {featured.title}
              </span>
              <span className="mt-3 block max-w-measure text-ui text-pretty text-on-ink-muted">
                {featured.description}
              </span>
            </Card>
          )}

          <ol className="divide-y divide-cream-hairline border-y border-cream-hairline">
            {listed.map((post, i) => (
              <li key={post.slug}>
                <Link
                  prefetch={false}
                  href={`/blog/${post.slug}`}
                  className="group flex items-baseline gap-5 py-5 md:gap-8"
                >
                  <span
                    aria-hidden="true"
                    className="figures w-12 shrink-0 text-right font-serif text-display-l italic text-on-cream-muted transition-colors duration-(--dur-fast) group-hover:text-amber-deep md:w-16"
                  >
                    0{i + 2}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="mb-1.5 flex items-center gap-4">
                      <Tag tag={post.tag} />
                      <time dateTime={post.date} className="figures text-meta text-on-cream-muted">
                        {formatDate(post.date)}
                      </time>
                    </span>
                    <span className="block font-serif text-display-s text-balance text-on-cream">
                      <span className="link-grow">{post.title}</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </Band>

      {/* ── Tools (Pocket Money has its own band above) ───────────── */}
      <Band surface="cream" rhythm="tight" labelledBy="tools-title">
        <Container width="content" className="grid gap-8 md:grid-cols-12 md:items-start">
          <SectionHeader id="tools-title" title="Tools" size="m" className="md:col-span-4" />
          <Card surface="cream" href="/origins" prefetch={false} className="p-6 md:col-span-8">
            <span className="flex items-center gap-3">
              <span className="font-serif text-display-s italic text-on-cream">Origins</span>
              <StatusBadge status="soon" surface="parchment" />
            </span>
            <span className="mt-1 block text-label uppercase text-on-cream-muted">a Binder Grail app</span>
            <span className="mt-4 block max-w-measure border-t border-cream-hairline pt-4 text-meta text-on-cream">
              Track every card you own. Log condition, price paid, and grading status — so you
              always know what&apos;s in your binder and what it&apos;s worth.
            </span>
            <span className="mt-4 inline-flex items-center gap-2 text-meta font-medium text-amber-deep">
              <span className="link-grow">Learn more</span> →
            </span>
          </Card>
        </Container>
      </Band>

      {/* ── Newsletter strip ──────────────────────────────────────── */}
      <Band surface="ink" id="newsletter" labelledBy="cr-title">
        <Container width="content" className="grid gap-8 md:grid-cols-12 md:items-center">
          <div className="md:col-span-3">
            <Image
              src="/images/common_rare_logo-2-removebg-preview.png"
              alt="Common Rare"
              height={80}
              width={107}
              className="h-16 w-auto brightness-0 invert md:h-20"
             
            />
          </div>
          <div className="md:col-span-9">
            <SectionHeader
              id="cr-title"
              surface="ink"
              size="m"
              kicker="Common Rare · A Binder Grail newsletter"
              title={
                <>
                  The weekly read for <em className="text-amber-bright">frugal</em> collectors.
                </>
              }
              lead="Market moves, restock alerts, and a plain verdict on every new Pokémon TCG product. Free, every week."
            />
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Button href="https://commonrare.bindergrail.com" variant="primary">
                Subscribe to Common Rare
              </Button>
              <span className="text-meta text-on-ink-muted">Free, every week. Unsubscribe anytime.</span>
            </div>
          </div>
        </Container>
      </Band>
    </>
  );
}
