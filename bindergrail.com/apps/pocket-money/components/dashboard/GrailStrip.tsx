import { formatCurrency } from "@/lib/pocket-money/budget";

interface GrailStripProps {
  name: string;
  targetPrice: number | null;
  amountSaved: number;
  currency: string;
}

export default function GrailStrip({
  name,
  targetPrice,
  amountSaved,
  currency,
}: GrailStripProps) {
  const funded =
    targetPrice != null && targetPrice > 0 && amountSaved >= targetPrice;
  const percent =
    targetPrice && targetPrice > 0
      ? Math.min((amountSaved / targetPrice) * 100, 100)
      : 0;

  // Fully funded flips the strip from grass green to gold
  const palette = funded
    ? {
        bg: "var(--pm-amber-light)",
        border: "var(--pm-amber-mid)",
        eyebrow: "var(--pm-amber-dark)",
        text: "var(--pm-amber-dark)",
        track: "var(--pm-amber-mid)",
        fill: "var(--pm-amber-dark)",
      }
    : {
        bg: "var(--pm-green-lightest)",
        border: "var(--pm-green-light)",
        eyebrow: "var(--pm-green-dark)",
        text: "var(--pm-green-text)",
        track: "var(--pm-green-light)",
        fill: "var(--pm-green-dark)",
      };

  return (
    <div
      style={{
        backgroundColor: palette.bg,
        borderBottom: `0.5px solid ${palette.border}`,
        padding: "12px 20px",
      }}
    >
      {/* Eyebrow */}
      <p
        style={{
          fontSize: 10,
          fontWeight: 500,
          color: palette.eyebrow,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 4,
        }}
      >
        {funded ? "★ Grail fully funded" : "Active Grail"}
      </p>

      {/* Name + target row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: palette.text,
          }}
        >
          {name}
        </span>
        {targetPrice && (
          <span style={{ fontSize: 13, color: palette.eyebrow }}>
            {formatCurrency(targetPrice, currency)}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: "100%",
          height: 4,
          backgroundColor: palette.track,
          borderRadius: 99,
          overflow: "hidden",
          marginBottom: 6,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            backgroundColor: palette.fill,
            borderRadius: 99,
            transition: "width 0.4s ease",
          }}
        />
      </div>

      {/* Subtext */}
      <p
        style={{
          fontSize: 10,
          color: palette.eyebrow,
          fontStyle: "italic",
        }}
      >
        {funded
          ? `The Poké Ball is ready. Go catch it. · ${formatCurrency(amountSaved, currency)} saved`
          : `A legendary Pokémon is said to live there... · ${formatCurrency(amountSaved, currency)} saved`}
      </p>
    </div>
  );
}
