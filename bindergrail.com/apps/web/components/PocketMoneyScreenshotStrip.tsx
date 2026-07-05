import { existsSync } from "fs";
import { join } from "path";

// Real app screenshots, rendered only when the file exists under
// public/images/pocket-money/. Shot list (save as PNG, exact filenames):
//   pm-dashboard-desktop.png  — full desktop dashboard, ~1900×1000 (16:9-ish)
//   pm-add-transaction.png    — the "Log a transaction" modal, ~840×1500 portrait
//   pm-wishlist-grail.png     — wishlist page with grail + reserved, ~1200×1000
//   pm-mobile-dashboard.png   — narrow browser/phone view, ~750×1500 portrait
const SCREENSHOTS: { file: string; caption: string; wide: boolean }[] = [
  {
    file: "pm-dashboard-desktop.png",
    caption: "The dashboard: budget, wallet buckets, holds, and the full log",
    wide: true,
  },
  {
    file: "pm-add-transaction.png",
    caption: "Log a spend, return, or sale in seconds",
    wide: false,
  },
  {
    file: "pm-wishlist-grail.png",
    caption: "The wishlist, with funds reserved toward your grail",
    wide: true,
  },
  {
    file: "pm-mobile-dashboard.png",
    caption: "Works great on your phone",
    wide: false,
  },
];

export default function PocketMoneyScreenshotStrip() {
  const available = SCREENSHOTS.filter((s) =>
    existsSync(join(process.cwd(), "public/images/pocket-money", s.file))
  );

  if (available.length === 0) return null;

  return (
    <section style={{ backgroundColor: "#2A4230", padding: "56px 0" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
        <h2
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontWeight: 700,
            fontSize: 26,
            color: "#F5F0E8",
            marginBottom: 6,
          }}
        >
          See it in action
        </h2>
        <p style={{ fontSize: 13, color: "#8AAE90", marginBottom: 28 }}>
          Real screenshots, no mockups. This is the app you get.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 20,
          overflowX: "auto",
          padding: "0 max(24px, calc((100% - 960px) / 2)) 8px",
          scrollbarWidth: "thin",
        }}
      >
        {available.map((shot) => (
          <figure
            key={shot.file}
            style={{
              flexShrink: 0,
              width: shot.wide ? "min(680px, 85vw)" : "min(300px, 70vw)",
              margin: 0,
            }}
          >
            <div
              style={{
                backgroundColor: "#1A2E1E",
                borderRadius: 12,
                padding: 8,
                border: "1px solid #4A7052",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/pocket-money/${shot.file}`}
                alt={shot.caption}
                loading="lazy"
                decoding="async"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  borderRadius: 6,
                }}
              />
            </div>
            <figcaption
              style={{
                fontSize: 12,
                color: "#B0D4B8",
                marginTop: 10,
                lineHeight: 1.5,
              }}
            >
              {shot.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
