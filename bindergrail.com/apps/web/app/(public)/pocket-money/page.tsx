// LOGO CANVA DIRECTIONS — Pocket Money
// Canvas: 500 x 100px, transparent background
// "Pocket" — DM Sans Bold, 52px, #3D5C42 (Forest)
// "Money"  — DM Sans Bold, 52px, #B07035 (Amber)
// Single line, no space between words styled differently
// Below: "a Binder Grail app" — DM Sans Light, 14px, #6A9470, letter-spacing +80
// Export as PNG 2x transparent

import type { Metadata } from "next";
import Image from "next/image";
import { existsSync } from "fs";
import { join } from "path";
import PocketMoneyScreenshotStrip from "@/components/PocketMoneyScreenshotStrip";
import JsonLd from "@/components/JsonLd";
import Band from "@/components/ui/Band";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

// Real app screenshot once provided; dynamic card until then.
const PM_OG_FILE = "/images/og/pocket-money-og.png";
const PM_OG = existsSync(join(process.cwd(), "public", PM_OG_FILE))
  ? PM_OG_FILE
  : `/api/og?title=${encodeURIComponent("Pocket Money: envelope budgeting with wallet stashes")}`;

export const metadata: Metadata = {
  title: "Pocket Money — Hobby Budget App with Wallet Stashes",
  description:
    "Free hobby budget app with wallet stashes, holds, and a grail fund. Envelope budgeting, no bank linking ever. Track collecting money the way you spend it.",
  keywords: [
    "hobby budget app",
    "budgeting app for collectors",
    "envelope budgeting app",
    "wallet stashes",
    "wallet buckets",
    "sinking funds app",
    "Pokemon TCG budget tracker",
    "sneaker budget tracker",
    "track hobby spending",
    "free budget app",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://bindergrail.com/pocket-money" },
  openGraph: {
    type: "website",
    siteName: "Binder Grail",
    title: "Pocket Money — Hobby Budget App with Wallet Stashes",
    description:
      "Set a monthly budget, split your cash into spending stashes, track holds before they land, and save toward your grail. Free, built for collectors.",
    url: "https://bindergrail.com/pocket-money",
    images: [{ url: PM_OG, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: [PM_OG] },
};

const FAQS = [
  {
    q: "Is Pocket Money free?",
    a: "Yes. Pocket Money is completely free. Create an account and your login works across every Binder Grail tool.",
  },
  {
    q: "Does it connect to my bank?",
    a: "No, and it never will. Pocket Money is privacy-first: you log transactions yourself, which takes seconds and keeps your financial accounts completely out of it. Nothing to link, nothing to leak.",
  },
  {
    q: "Is it only for Pokémon cards?",
    a: "No. It was built by a collector for hobby money of every kind. Stashes and custom tags work just as well for sneakers, gaming, vinyl, or whatever you collect.",
  },
  {
    q: "What are wallet stashes?",
    a: "Stashes are envelope budgeting for your hobby cash. Split your wallet into pots like a sneaker fund or a TCG fund, spend from a stash without touching your monthly budget, and watch every balance update automatically.",
  },
  {
    q: "Can I track sneaker and trading card spending separately?",
    a: "That is exactly what Pocket Money is built for. Give each hobby its own stash, tag every purchase with up to 3 tags, and see per-stash balances plus pending holds at a glance.",
  },
  {
    q: "What is a grail fund?",
    a: "Your grail is the one big item you are chasing. Reserve sale money or wallet cash toward it, watch the progress bar fill, and get a full gold celebration when it is fully funded.",
  },
  {
    q: "Does money from sales go back into my budget?",
    a: "You decide. When you log a sale, the proceeds can land in your pocket, in any stash, or get reserved for a wishlist item. Your monthly budget stays honest either way.",
  },
];

const HERO_POINTS = [
  "Monthly budget with month-by-month history",
  "Wallet stashes: split cash into sneaker money, TCG money, whatever",
  "Holds show pending spend before it leaves your wallet",
  "Log spends, returns, and sales with up to 3 tags each",
  "Reserve sale money for your grail and watch it fill up",
];

const FEATURES = [
  {
    title: "Wallet stashes",
    body: "Split your cash into pots like a sneaker fund or TCG fund. Spending from a stash never touches your monthly budget, and the app rebalances everything automatically. Classic envelope budgeting.",
  },
  {
    title: "Monthly budget",
    body: "Set your envelope for the month, flip back through past months, and get honest red numbers when you blow past it. Returns refund the budget, sales never inflate it.",
  },
  {
    title: "Holds and pending money",
    body: "Preorders and IOUs sit as holds with a pending amount on the right stash, so you always know what is already spoken for before it leaves.",
  },
  {
    title: "The grail fund",
    body: "Pick one grail from your wishlist. Reserve sale money or wallet cash toward it, watch the bar fill, and get the gold screen when it is fully funded.",
  },
  {
    title: "Tags and custom categories",
    body: "Up to 3 tags per transaction from the built-in set plus 10 custom tags of your own. Every entry is editable after the fact.",
  },
  {
    title: "Sales and returns",
    body: "Money coming back in goes where you say: into your pocket, into a stash, or reserved for a wishlist item. Your budget stays honest either way.",
  },
];

export default function PocketMoneyPage() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Pocket Money",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            url: "https://pocketmoney.bindergrail.com",
            description:
              "Free hobby budgeting app for collectors. Monthly budgets, envelope-style wallet stashes, pending holds, multi-tag transaction tracking, and a grail savings fund.",
            featureList: [
              "Monthly hobby budget with month-by-month history",
              "Wallet stashes for envelope-style category spending",
              "Pending holds that show money before it leaves",
              "Spend, return, and sale logging with up to 3 tags each",
              "Wishlist with reserved funds and one active grail",
              "Sale proceeds routed to wallet, stash, or grail fund",
              "Custom spending tags",
            ],
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            publisher: { "@type": "Organization", name: "Binder Grail", url: "https://bindergrail.com" },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />

      {/* ── Hero: the app's own header is folded in as the top row ─────── */}
      <Band surface="forest" rule={false} reveal={false} rhythm="none" className="pt-6 pb-(--band-y)">
        <Container width="wide">
          <div className="mb-(--band-y-tight) flex flex-wrap items-center justify-between gap-4 border-b border-forest-hairline pb-5">
            <p className="leading-tight">
              <span className="block font-serif text-display-s text-on-forest">
                Pocket <span className="text-on-forest-muted">Money</span>
              </span>
              <span className="text-label uppercase text-on-forest-muted">a Binder Grail app</span>
            </p>
            <Button href="https://pocketmoney.bindergrail.com" variant="secondary" className="text-on-forest">
              Open the app
            </Button>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Kicker surface="forest" className="mb-5">
                Pokémon TCG · Budget tracker
              </Kicker>
              <h1 className="font-serif text-display-xl text-on-forest">
                Collect on a <em className="text-on-forest-muted">budget.</em>
                <br />
                Not a prayer.
              </h1>
              <p className="mt-6 max-w-measure-lead text-lead text-pretty text-on-forest-muted">
                Set your monthly limit. Log every purchase. Know exactly where you stand before you
                swipe.
              </p>

              <ul className="mt-7 flex max-w-measure flex-col gap-2">
                {HERO_POINTS.map((f) => (
                  <li key={f} className="flex gap-3 text-meta text-on-forest">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rotate-45 bg-amber-bright" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Button href="https://pocketmoney.bindergrail.com/signup" variant="primary">
                  Create your free account
                </Button>
                <Button href="https://pocketmoney.bindergrail.com/login" variant="quiet" className="text-on-forest">
                  Already tracking? Sign in
                </Button>
              </div>
              <p className="mt-4 text-meta text-on-forest-muted">
                Free to use. Your Binder Grail account works here too.
              </p>
            </div>

            {/* The budget envelope, cropped from the real dashboard and set large */}
            <div className="lg:col-span-6">
              <Image
                src="/images/pocket-money/pm-budget-envelope.png"
                alt="Pocket Money's monthly budget envelope: remaining and spent totals, the budget bar, and the wallet split into stashes"
                width={559}
                height={440}
                priority
                sizes="(max-width: 1024px) calc(100vw - 2.5rem), 600px"
                className="h-auto w-full rounded-lg border border-forest-hairline"
              />
            </div>
          </div>
        </Container>
      </Band>

      {/* ── Features (crawlable) ───────────────────────────── */}
      <Band surface="parchment" labelledBy="pm-features">
        <Container width="content">
          <SectionHeader
            id="pm-features"
            surface="parchment"
            title="Budgeting built for hobby money"
            lead="Most budget apps treat your hobby like a line item. Pocket Money treats it like the main event: envelope-style stashes, pending holds, and a fund for the one card you would trade the rest for."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <li key={f.title}>
                <Card surface="parchment" className="h-full p-6">
                  <h3 className="font-serif text-display-s text-on-cream">{f.title}</h3>
                  <p className="mt-2 text-meta text-pretty text-on-cream-muted">{f.body}</p>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Band>

      <PocketMoneyScreenshotStrip />

      {/* ── FAQ (crawlable) ────────────────────────────────── */}
      <Band surface="cream" labelledBy="pm-faq">
        <Container width="content" className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeader id="pm-faq" title="Questions collectors ask" size="m" />
            <Button href="https://pocketmoney.bindergrail.com/signup" variant="primary-light" className="mt-7">
              Start budgeting free
            </Button>
          </div>
          <dl className="divide-y divide-cream-hairline border-y border-cream-hairline lg:col-span-8">
            {FAQS.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="text-ui font-medium text-on-cream">{f.q}</dt>
                <dd className="mt-1.5 max-w-measure text-meta text-pretty text-on-cream-muted">{f.a}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Band>
    </>
  );
}
