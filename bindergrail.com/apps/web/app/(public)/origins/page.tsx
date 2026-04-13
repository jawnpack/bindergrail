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

export const metadata: Metadata = {
  title: "Origins — Pokémon TCG Collection Tracker | Binder Grail",
  description:
    "Track every card you own. Search the full Pokémon TCG database, log condition and price paid, and see your collection value at a glance. Coming soon from Binder Grail.",
  robots: { index: true, follow: true },
};

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function OriginsPage() {
  return (
    <div style={{ fontFamily: "var(--font-dm-sans), Arial, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ── Nav ────────────────────────────────────────────── */}
      <header
        style={{
          backgroundColor: "#E8E4DC",
          borderBottom: "1px solid #C8C0B0",
        }}
      >
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
                fontStyle: "italic",
                fontSize: 18,
                color: "#2C2A22",
                lineHeight: 1.2,
              }}
            >
              Origins
            </div>
            <div
              style={{
                fontSize: 9,
                color: "#7A6E5F",
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
              color: "#5F5E5A",
              backgroundColor: "#D8D0C0",
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
          backgroundColor: "#E8E4DC",
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
            opacity: 0.06,
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
              color: "#B07035",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              marginBottom: 20,
            }}
          >
            Pokémon TCG · Collection tracker
          </p>
          <h1
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontWeight: 900,
              fontSize: "clamp(40px, 7vw, 68px)",
              lineHeight: 1.05,
              color: "#2C2A22",
              letterSpacing: "-0.02em",
              marginBottom: 24,
            }}
          >
            Your collection.
            <br />
            <span style={{ fontStyle: "italic", color: "#B07035" }}>Every card.</span>
            <br />
            One place.
          </h1>
          <p
            style={{
              fontSize: 15,
              fontWeight: 300,
              color: "#7A6E5F",
              lineHeight: 1.7,
              marginBottom: 16,
              maxWidth: 460,
            }}
          >
            Search the full card database. Log what you own, what you paid,
            and what condition it&apos;s in.
          </p>

          {/* Feature bullets */}
          <div style={{ marginBottom: 40 }}>
            {[
              "Search the TCGdex database — every set, every card",
              "Log condition, price paid, and grading status per card",
              "Collection value summary and graded card tracker",
            ].map((f) => (
              <div
                key={f}
                style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}
              >
                <span style={{ color: "#B07035", fontSize: 16, lineHeight: 1.5, flexShrink: 0 }}>·</span>
                <span style={{ fontSize: 13, color: "#7A6E5F", lineHeight: 1.6 }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Sign-up form */}
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#2C2A22",
              marginBottom: 12,
            }}
          >
            Get notified at launch
          </p>
          <WaitlistForm
            app="origins"
            inputBg="#FFFFFF"
            inputBorder="#C8C0B0"
            inputTextColor="#2C2A22"
            buttonColor="#B07035"
          />
          <p style={{ marginTop: 10, fontSize: 11, color: "#B4B2A9" }}>
            No spam. Just a launch notification.
          </p>
        </div>
      </section>

      <OriginsScreenshotStrip />

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer
        style={{
          backgroundColor: "#E8E4DC",
          borderTop: "1px solid #C8C0B0",
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
            fontStyle: "italic",
            fontSize: 13,
            color: "#B07035",
          }}
        >
          Origins
        </span>
        <span style={{ fontSize: 11, color: "#7A6E5F" }}>a Binder Grail app</span>
      </footer>
    </div>
  );
}
