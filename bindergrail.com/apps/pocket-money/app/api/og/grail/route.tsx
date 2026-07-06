import { ImageResponse } from "next/og";

// Text-only grail share card: 1200×630 PNG, Pocket Money dark + gold.
//   /api/og/grail?name=<grail name>&days=<days in the making>

const INK = "#2C2C2A";
const GREEN_LIGHTEST = "#EAF3DE";
const GREEN_MID = "#639922";
const GOLD = "#EF9F27";
const GOLD_DEEP = "#C57F14";
const DUST = "#888780";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = (searchParams.get("name") || "My grail").slice(0, 120);
  const daysRaw = searchParams.get("days");
  const days = daysRaw && /^\d+$/.test(daysRaw) ? Number(daysRaw) : null;

  const nameSize = name.length > 80 ? 48 : name.length > 44 ? 60 : 76;

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
          padding: "72px 80px",
        }}
      >
        {/* Top: legendary catch eyebrow */}
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 500,
            color: GOLD,
            letterSpacing: "8px",
          }}
        >
          LEGENDARY CATCH
        </div>

        {/* Middle: grail name + days */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: nameSize,
              fontWeight: 500,
              color: GREEN_LIGHTEST,
              lineHeight: 1.1,
              letterSpacing: "-1px",
              maxWidth: 1040,
            }}
          >
            {name}
          </div>
          {days !== null && (
            <div
              style={{
                display: "flex",
                fontSize: 30,
                color: DUST,
                marginTop: 24,
                fontStyle: "italic",
              }}
            >
              {days === 0
                ? "Caught the day it hit the list."
                : `${days} ${days === 1 ? "day" : "days"} in the making.`}
            </div>
          )}
        </div>

        {/* Bottom: wordmark + gold rule */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: 3,
              backgroundColor: GOLD_DEEP,
              marginBottom: 24,
            }}
          />
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
                fontWeight: 500,
                letterSpacing: "1px",
              }}
            >
              <span style={{ color: GREEN_LIGHTEST }}>pocket </span>
              <span style={{ color: GREEN_MID }}>money</span>
            </div>
            <div style={{ display: "flex", fontSize: 22, color: DUST }}>
              pocketmoney.bindergrail.com
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
