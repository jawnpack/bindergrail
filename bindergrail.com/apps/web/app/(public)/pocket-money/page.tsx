// LOGO CANVA DIRECTIONS — Pocket Money
// Canvas: 500 x 100px, transparent background
// "Pocket" — DM Sans Bold, 52px, #3D5C42 (Forest)
// "Money"  — DM Sans Bold, 52px, #B07035 (Amber)
// Single line, no space between words styled differently
// Below: "a Binder Grail app" — DM Sans Light, 14px, #6A9470, letter-spacing +80
// Export as PNG 2x transparent

import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";
import PocketMoneyScreenshotStrip from "@/components/PocketMoneyScreenshotStrip";

export const metadata: Metadata = {
  title: "Pocket Money — Pokémon TCG Budget Tracker | Binder Grail",
  description:
    "Set a monthly budget, log every purchase, and track your Pokémon TCG spending by category. Coming soon from Binder Grail.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://bindergrail.com/pocket-money" },
  openGraph: {
    title: "Pocket Money — Pokémon TCG Budget Tracker",
    description:
      "Set a monthly budget, log every purchase, and track your Pokémon TCG spending by category.",
    url: "https://bindergrail.com/pocket-money",
    images: [{ url: "/images/binder_grail_logo.png", width: 511, height: 234 }],
  },
  twitter: { card: "summary_large_image" },
};

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function PocketMoneyPage() {
  return (
    <div style={{ fontFamily: "var(--font-dm-sans), Arial, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
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
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#B0D4B8",
              backgroundColor: "#2A4230",
              border: "1px solid #4A7052",
              borderRadius: 20,
              padding: "4px 12px",
            }}
          >
            Coming soon
          </span>
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
              "Monthly budget limit with alert when you're close",
              "Log purchases by category — packs, singles, sealed, grading",
              "Spending history and trends across months",
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

          {/* Sign-up form */}
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#F5F0E8",
              marginBottom: 12,
            }}
          >
            Get notified at launch
          </p>
          <WaitlistForm
            app="pocket-money"
            inputBg="#2A4230"
            inputBorder="#4A7052"
          />
          <p style={{ marginTop: 10, fontSize: 11, color: "#4A7052" }}>
            No spam. Just a launch notification.
          </p>
        </div>
      </section>

      <PocketMoneyScreenshotStrip />

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
