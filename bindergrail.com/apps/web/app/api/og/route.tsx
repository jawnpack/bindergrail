import { ImageResponse } from "next/og";

// Dynamic Open Graph images: 1200×630, Binder Grail dark card.
//   /api/og?variant=home                     — homepage card
//   /api/og?title=...&tag=Market|Advice|News — blog post card

const INK = "#1A1814";
const CREAM = "#F5F0E8";
const AMBER = "#B07035";
const DUST = "#7A7468";

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  Market: { bg: "#FAEEDA", text: "#633806" },
  Advice: { bg: "#EAF3DE", text: "#27500A" },
  News: { bg: "#E8E0D0", text: "#5F5E5A" },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const variant = searchParams.get("variant");
  const title = searchParams.get("title") ?? "Binder Grail";
  const tag = searchParams.get("tag");

  if (variant === "home") {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: INK,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 700,
              color: CREAM,
              letterSpacing: "-2px",
            }}
          >
            Binder
            <span style={{ color: AMBER, margin: "0 6px" }}>·</span>
            Grail
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              color: DUST,
              marginTop: 24,
            }}
          >
            Collect smarter. Spend less. Chase your grail.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: AMBER,
              marginTop: 56,
              letterSpacing: "2px",
            }}
          >
            bindergrail.com
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const tagColors = tag ? TAG_COLORS[tag] : undefined;
  const titleSize = title.length > 90 ? 46 : title.length > 60 ? 54 : 64;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: INK,
          padding: "64px 72px",
        }}
      >
        {/* Top: brand eyebrow + tag pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 700,
              color: AMBER,
              letterSpacing: "6px",
            }}
          >
            BINDER GRAIL
          </div>
          {tagColors && (
            <div
              style={{
                display: "flex",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "3px",
                color: tagColors.text,
                backgroundColor: tagColors.bg,
                padding: "8px 22px",
                borderRadius: 6,
              }}
            >
              {tag?.toUpperCase()}
            </div>
          )}
        </div>

        {/* Middle: title */}
        <div
          style={{
            display: "flex",
            fontSize: titleSize,
            fontWeight: 700,
            color: CREAM,
            lineHeight: 1.15,
            letterSpacing: "-1px",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        {/* Bottom: site mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", fontSize: 26, color: DUST }}>
            Pokémon TCG guides for frugal collectors
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: AMBER,
              letterSpacing: "2px",
            }}
          >
            bindergrail.com
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
