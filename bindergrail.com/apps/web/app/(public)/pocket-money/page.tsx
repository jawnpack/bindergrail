// LOGO CANVA DIRECTIONS — Pocket Money
// Canvas: 500 x 100px, transparent background
// "Pocket" — DM Sans Bold, 52px, #3D5C42 (Forest)
// "Money"  — DM Sans Bold, 52px, #B07035 (Amber)
// Single line, no space between words styled differently
// Below: "a Binder Grail app" — DM Sans Light, 14px, #6A9470, letter-spacing +80
// Export as PNG 2x transparent

import type { Metadata } from "next";
import PocketMoneyScreenshotStrip from "@/components/PocketMoneyScreenshotStrip";

export const metadata: Metadata = {
  title: "Pocket Money — Hobby Budget App with Wallet Buckets | Binder Grail",
  description:
    "Free hobby budgeting app for collectors. Set a monthly budget, split your cash into buckets like sneakers and TCG, track pending holds, and save toward your grail. Envelope budgeting built for the way collectors actually spend.",
  keywords: [
    "hobby budget app",
    "budgeting app for collectors",
    "envelope budgeting app",
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
    title: "Pocket Money — Hobby Budget App with Wallet Buckets",
    description:
      "Set a monthly budget, split your cash into spending buckets, track holds before they land, and save toward your grail. Free, built for collectors.",
    url: "https://bindergrail.com/pocket-money",
    images: [{ url: "/images/binder_grail_logo.png", width: 511, height: 234 }],
  },
  twitter: { card: "summary_large_image" },
};

const FAQS = [
  {
    q: "Is Pocket Money free?",
    a: "Yes. Pocket Money is completely free. Create an account and your login works across every Binder Grail tool.",
  },
  {
    q: "What are wallet buckets?",
    a: "Buckets are envelope budgeting for your hobby cash. Split your wallet into pots like a sneaker fund or a TCG fund, spend from a bucket without touching your monthly budget, and watch every balance update automatically.",
  },
  {
    q: "Can I track sneaker and trading card spending separately?",
    a: "That is exactly what Pocket Money is built for. Give each hobby its own bucket, tag every purchase with up to 3 tags, and see per-bucket balances plus pending holds at a glance.",
  },
  {
    q: "What is a grail fund?",
    a: "Your grail is the one big item you are chasing. Reserve sale money or wallet cash toward it, watch the progress bar fill, and get a full gold celebration when it is fully funded.",
  },
  {
    q: "Does money from sales go back into my budget?",
    a: "You decide. When you log a sale, the proceeds can land in your pocket, in any bucket, or get reserved for a wishlist item. Your monthly budget stays honest either way.",
  },
];

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function PocketMoneyPage() {
  return (
    <div style={{ fontFamily: "var(--font-dm-sans), Arial, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Pocket Money",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              url: "https://pocketmoney.bindergrail.com",
              description:
                "Free hobby budgeting app for collectors. Monthly budgets, envelope-style wallet buckets, pending holds, multi-tag transaction tracking, and a grail savings fund.",
              featureList: [
                "Monthly hobby budget with month-by-month history",
                "Wallet buckets for envelope-style category spending",
                "Pending holds that show money before it leaves",
                "Spend, return, and sale logging with up to 3 tags each",
                "Wishlist with reserved funds and one active grail",
                "Sale proceeds routed to wallet, bucket, or grail fund",
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
          ]),
        }}
      />
      {/* ── Nav ────────────────────────────────────────────── */}
      <header style={{ backgroundColor: "#3D5C42" }}>
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontWeight: 700,
                fontSize: 18,
                color: "#F5F0E8",
                lineHeight: 1.2,
              }}
            >
              Pocket <span style={{ color: "#B0D4B8" }}>Money</span>
            </div>
            <div
              style={{
                fontSize: 9,
                color: "#6A9470",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginTop: 2,
              }}
            >
              a Binder Grail app
            </div>
          </div>
          <a
            href="https://pocketmoney.bindergrail.com"
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#2A4230",
              backgroundColor: "#B0D4B8",
              border: "1px solid #4A7052",
              borderRadius: 20,
              padding: "4px 12px",
              textDecoration: "none",
            }}
          >
            Open the app
          </a>
        </div>
      </header>

      {/* ── Hero + Sign up ─────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#3D5C42",
          position: "relative",
          overflow: "hidden",
          flex: 1,
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            pointerEvents: "none",
            backgroundImage: GRAIN,
            backgroundSize: "180px",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 600,
            margin: "0 auto",
            padding: "80px 24px 96px",
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#B0D4B8",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              marginBottom: 20,
            }}
          >
            Pokémon TCG · Budget tracker
          </p>
          <h1
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontWeight: 900,
              fontSize: "clamp(40px, 7vw, 68px)",
              lineHeight: 1.05,
              color: "#F5F0E8",
              letterSpacing: "-0.02em",
              marginBottom: 24,
            }}
          >
            Collect on a{" "}
            <span style={{ fontStyle: "italic", color: "#D4E8D8" }}>budget.</span>
            <br />
            Not a prayer.
          </h1>
          <p
            style={{
              fontSize: 15,
              fontWeight: 300,
              color: "#6A9470",
              lineHeight: 1.7,
              marginBottom: 16,
              maxWidth: 460,
            }}
          >
            Set your monthly limit. Log every purchase. Know exactly where you
            stand before you swipe.
          </p>

          {/* Feature bullets */}
          <div style={{ marginBottom: 40 }}>
            {[
              "Monthly budget with month-by-month history",
              "Wallet buckets: split cash into sneaker money, TCG money, whatever",
              "Holds show pending spend before it leaves your wallet",
              "Log spends, returns, and sales with up to 3 tags each",
              "Reserve sale money for your grail and watch it fill up",
            ].map((f) => (
              <div
                key={f}
                style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}
              >
                <span style={{ color: "#B07035", fontSize: 16, lineHeight: 1.5, flexShrink: 0 }}>·</span>
                <span style={{ fontSize: 13, color: "#6A9470", lineHeight: 1.6 }}>{f}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <a
              href="https://pocketmoney.bindergrail.com/signup"
              style={{
                display: "inline-block",
                backgroundColor: "#B07035",
                color: "#F5F0E8",
                borderRadius: 4,
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Create your free account
            </a>
            <a
              href="https://pocketmoney.bindergrail.com/login"
              style={{ fontSize: 13, color: "#B0D4B8", textDecoration: "underline" }}
            >
              Already tracking? Sign in
            </a>
          </div>
          <p style={{ marginTop: 12, fontSize: 11, color: "#4A7052" }}>
            Free to use. Your Binder Grail account works here too.
          </p>
        </div>
      </section>

      {/* ── Features (crawlable) ───────────────────────────── */}
      <section style={{ backgroundColor: "#EAF0EB", padding: "56px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontWeight: 700,
              fontSize: 28,
              color: "#2A4230",
              marginBottom: 8,
            }}
          >
            Budgeting built for hobby money
          </h2>
          <p style={{ fontSize: 14, color: "#3D5C42", maxWidth: 560, lineHeight: 1.6, marginBottom: 32 }}>
            Most budget apps treat your hobby like a line item. Pocket Money
            treats it like the main event: envelope-style buckets, pending
            holds, and a fund for the one card you would trade the rest for.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {[
              {
                title: "Wallet buckets",
                body: "Split your cash into pots like a sneaker fund or TCG fund. Spending from a bucket never touches your monthly budget, and the app rebalances everything automatically.",
              },
              {
                title: "Monthly budget",
                body: "Set your envelope for the month, flip back through past months, and get honest red numbers when you blow past it. Returns refund the budget, sales never inflate it.",
              },
              {
                title: "Holds and pending money",
                body: "Preorders and IOUs sit as holds with a pending amount on the right bucket, so you always know what is already spoken for before it leaves.",
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
                title: "One account, every tool",
                body: "Your Binder Grail login works across the whole family of collector tools. Free, no card required.",
              },
            ].map((f) => (
              <div
                key={f.title}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #C8D8CA",
                  borderRadius: 8,
                  padding: "18px 20px",
                }}
              >
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: "#2A4230",
                    marginBottom: 6,
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ fontSize: 13, color: "#5F6E62", lineHeight: 1.6 }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PocketMoneyScreenshotStrip />

      {/* ── FAQ (crawlable) ────────────────────────────────── */}
      <section style={{ backgroundColor: "#F5F0E8", padding: "56px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontWeight: 700,
              fontSize: 24,
              color: "#1A1814",
              marginBottom: 24,
            }}
          >
            Questions collectors ask
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {FAQS.map((f) => (
              <div key={f.q}>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: "#1A1814",
                    marginBottom: 4,
                  }}
                >
                  {f.q}
                </h3>
                <p style={{ fontSize: 13, color: "#7A7468", lineHeight: 1.65 }}>
                  {f.a}
                </p>
              </div>
            ))}
          </div>
          <a
            href="https://pocketmoney.bindergrail.com/signup"
            style={{
              display: "inline-block",
              marginTop: 28,
              backgroundColor: "#3D5C42",
              color: "#F5F0E8",
              borderRadius: 4,
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Start budgeting free
          </a>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer
        style={{
          backgroundColor: "#2A4230",
          borderTop: "1px solid #4A7052",
          padding: "14px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontWeight: 700,
            fontSize: 13,
            color: "#6A9470",
          }}
        >
          Pocket Money
        </span>
        <span style={{ fontSize: 11, color: "#4A7052" }}>by Binder Grail</span>
      </footer>
    </div>
  );
}
