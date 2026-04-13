// LOGO CANVA DIRECTIONS — Pocket Money
// Canvas: 500 x 100px, transparent background
// "Pocket" — DM Sans Bold, 52px, #3D5C42 (Forest)
// "Money"  — DM Sans Bold, 52px, #B07035 (Amber)
// Single line, no space between words styled differently
// Below: "a Binder Grail app" — DM Sans Light, 14px, #6A9470, letter-spacing +80
// Export as PNG 2x transparent

import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Pocket Money — Pokémon TCG Budget Tracker | Binder Grail",
  description:
    "Set a monthly budget, log every purchase, and track your Pokémon TCG spending by category. Coming soon from Binder Grail.",
  robots: { index: true, follow: true },
};

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function PocketMoneyPage() {
  return (
    <div style={{ fontFamily: "var(--font-dm-sans), Arial, sans-serif" }}>
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

      {/* ── Hero ───────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#3D5C42",
          position: "relative",
          overflow: "hidden",
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
            maxWidth: 960,
            margin: "0 auto",
            padding: "72px 24px 80px",
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
              fontSize: "clamp(36px, 6vw, 60px)",
              lineHeight: 1.08,
              color: "#F5F0E8",
              letterSpacing: "-0.02em",
              marginBottom: 20,
              maxWidth: 560,
            }}
          >
            Collect on a{" "}
            <span style={{ fontStyle: "italic", color: "#D4E8D8" }}>budget.</span>
            <br />
            Not a prayer.
          </h1>
          <p
            style={{
              fontSize: 13,
              fontWeight: 300,
              color: "#6A9470",
              maxWidth: 300,
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            Set your monthly limit. Log every purchase. Know exactly where you
            stand before you swipe.
          </p>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              fontWeight: 600,
              color: "#B0D4B8",
              backgroundColor: "#2A4230",
              border: "1px solid #4A7052",
              borderRadius: 20,
              padding: "5px 14px",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#B07035",
                display: "inline-block",
              }}
            />
            Launching soon
          </span>
        </div>
      </section>

      {/* ── App preview ────────────────────────────────────── */}
      <section style={{ backgroundColor: "#EAF0EB", padding: "56px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#3D5C42",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: 20,
            }}
          >
            App preview
          </p>

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #C8D8CA",
                borderRadius: 8,
                padding: "16px 18px",
              }}
            >
              <p style={{ fontSize: 11, color: "#6A9470", marginBottom: 6 }}>Spent</p>
              <p
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#2C2A22",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                $184
              </p>
              <p style={{ fontSize: 11, color: "#6A9470" }}>of $300 budget</p>
            </div>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #C8D8CA",
                borderRadius: 8,
                padding: "16px 18px",
              }}
            >
              <p style={{ fontSize: 11, color: "#6A9470", marginBottom: 6 }}>Remaining</p>
              <p
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#3D5C42",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                $116
              </p>
              <p style={{ fontSize: 11, color: "#6A9470" }}>this month</p>
            </div>
          </div>

          {/* Budget bar card */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #C8D8CA",
              borderRadius: 8,
              padding: "16px 18px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 12, color: "#2C2A22", fontWeight: 500 }}>
                April 2026
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#3D5C42" }}>
                61%
              </span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "#E8F0E9",
                overflow: "hidden",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "61%",
                  backgroundColor: "#3D5C42",
                  borderRadius: 4,
                }}
              />
            </div>
            <p style={{ fontSize: 11, color: "#6A9470" }}>
              Packs $80 · Singles $64 · Sealed $40
            </p>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#F5F0E8",
          borderTop: "1px solid #D8D0C0",
          padding: "56px 24px",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#7A7468",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: 24,
            }}
          >
            What it does
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              "Monthly budget limit with alert when you're close",
              "Log purchases by category — packs, singles, sealed, grading",
              "Spending history and trends across months",
            ].map((f) => (
              <div key={f} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span
                  style={{
                    color: "#3D5C42",
                    fontSize: 18,
                    lineHeight: 1,
                    marginTop: 1,
                    flexShrink: 0,
                  }}
                >
                  ·
                </span>
                <p style={{ fontSize: 14, color: "#1A1814", lineHeight: 1.6 }}>{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Notify ─────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#3D5C42",
          padding: "56px 24px",
          position: "relative",
          overflow: "hidden",
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
        <div style={{ position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontWeight: 700,
              fontSize: "clamp(22px, 4vw, 30px)",
              color: "#F5F0E8",
              marginBottom: 20,
            }}
          >
            Get notified when it launches.
          </h2>
          <WaitlistForm
            app="pocket-money"
            inputBg="#2A4230"
            inputBorder="#4A7052"
          />
          <p style={{ marginTop: 12, fontSize: 11, color: "#4A7052" }}>
            No spam. Just a launch notification.
          </p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer
        style={{
          backgroundColor: "#F5F0E8",
          borderTop: "1px solid #D8D0C0",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "100%",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontWeight: 700,
            fontSize: 14,
            color: "#3D5C42",
          }}
        >
          Pocket Money
        </span>
        <span style={{ fontSize: 11, color: "#7A7468" }}>by Binder Grail</span>
      </footer>
    </div>
  );
}
