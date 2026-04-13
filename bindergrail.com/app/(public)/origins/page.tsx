// LOGO CANVA DIRECTIONS — Origins
// Canvas: 400 x 100px, transparent background
// "Origins" — Playfair Display Bold Italic, 52px, #2C2A22 (Ink)
// Just the "O" colored #B07035 (Amber) — rest stays ink
// Below: "a Binder Grail app" — DM Sans Light, 14px, #7A6E5F, letter-spacing +80
// Export as PNG 2x transparent
// Also export a cream version (#F5F0E8) for use on dark backgrounds

import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Origins — Pokémon TCG Collection Tracker | Binder Grail",
  description:
    "Track every card you own. Search the full Pokémon TCG database, log condition and price paid, and see your collection value at a glance. Coming soon from Binder Grail.",
  robots: { index: true, follow: true },
};

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function OriginsPage() {
  return (
    <div style={{ fontFamily: "var(--font-dm-sans), Arial, sans-serif" }}>
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

      {/* ── Hero ───────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#E8E4DC",
          position: "relative",
          overflow: "hidden",
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
            maxWidth: 960,
            margin: "0 auto",
            padding: "72px 24px 80px",
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
              fontSize: "clamp(36px, 6vw, 60px)",
              lineHeight: 1.08,
              color: "#2C2A22",
              letterSpacing: "-0.02em",
              marginBottom: 20,
              maxWidth: 560,
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
              fontSize: 13,
              fontWeight: 300,
              color: "#7A6E5F",
              maxWidth: 300,
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            Search the full card database. Log what you own, what you paid, and
            what condition it&apos;s in.
          </p>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              fontWeight: 600,
              color: "#5F5E5A",
              backgroundColor: "#D8D0C0",
              border: "1px solid #C8C0B0",
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
      <section style={{ backgroundColor: "#F5F0E8", padding: "56px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#7A6E5F",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: 20,
            }}
          >
            App preview
          </p>

          {/* Card previews */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            {/* Card 1 — standard */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #D8D0C0",
                borderRadius: 8,
                padding: 12,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Amber accent bar */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 4,
                  height: "100%",
                  backgroundColor: "#B07035",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: 22,
                  color: "#E8E4DC",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                025
              </p>
              <p
                style={{
                  fontSize: 9,
                  textTransform: "uppercase",
                  color: "#B4B2A9",
                  letterSpacing: "0.08em",
                  marginBottom: 4,
                }}
              >
                Obsidian Flames
              </p>
              <p
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#2C2A22",
                  marginBottom: 10,
                }}
              >
                Charizard ex SAR
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    backgroundColor: "#EAF0EB",
                    color: "#3D5C42",
                    padding: "2px 7px",
                    borderRadius: 3,
                  }}
                >
                  NM
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#B07035" }}>
                  $38.00
                </span>
              </div>
            </div>

            {/* Card 2 — graded */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #D8D0C0",
                borderRadius: 8,
                padding: 12,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Forest accent bar */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 4,
                  height: "100%",
                  backgroundColor: "#3D5C42",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: 22,
                  color: "#E8E4DC",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                064
              </p>
              <p
                style={{
                  fontSize: 9,
                  textTransform: "uppercase",
                  color: "#B4B2A9",
                  letterSpacing: "0.08em",
                  marginBottom: 4,
                }}
              >
                Twilight Masquerade
              </p>
              <p
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#2C2A22",
                  marginBottom: 10,
                }}
              >
                Greninja ex SIR
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    backgroundColor: "#E8F0D8",
                    color: "#2A4230",
                    padding: "2px 7px",
                    borderRadius: 3,
                  }}
                >
                  PSA 10
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#B07035" }}>
                  $210.00
                </span>
              </div>
            </div>
          </div>

          {/* Summary block */}
          <div
            style={{
              backgroundColor: "#2C2A22",
              borderRadius: 10,
              padding: 16,
            }}
          >
            <p
              style={{
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#5F5E5A",
                marginBottom: 10,
              }}
            >
              Collection summary
            </p>
            {[
              { label: "Total cards", value: "147", color: "#F5F0E8" },
              { label: "Total value", value: "$2,840", color: "#B07035" },
              { label: "Graded", value: "12", color: "#F5F0E8" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 12, color: "#7A7468" }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#E8E4DC",
          borderTop: "1px solid #C8C0B0",
          padding: "56px 24px",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#7A6E5F",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: 24,
            }}
          >
            What it does
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              "Search the TCGdex database — every set, every card",
              "Log condition, price paid, and grading status per card",
              "Collection value summary and graded card tracker",
            ].map((f) => (
              <div key={f} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span
                  style={{
                    color: "#B07035",
                    fontSize: 18,
                    lineHeight: 1,
                    marginTop: 1,
                    flexShrink: 0,
                  }}
                >
                  ·
                </span>
                <p style={{ fontSize: 14, color: "#2C2A22", lineHeight: 1.6 }}>{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Notify ─────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "#2C2A22",
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
            app="origins"
            inputBg="#3A3830"
            inputBorder="#4A4840"
          />
          <p style={{ marginTop: 12, fontSize: 11, color: "#4A4840" }}>
            No spam. Just a launch notification.
          </p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer
        style={{
          backgroundColor: "#E8E4DC",
          borderTop: "1px solid #C8C0B0",
          padding: "16px 24px",
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
            fontSize: 14,
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
