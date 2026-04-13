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
  const percent =
    targetPrice && targetPrice > 0
      ? Math.min((amountSaved / targetPrice) * 100, 100)
      : 0;

  return (
    <div
      style={{
        backgroundColor: "var(--pm-green-lightest)",
        borderBottom: "0.5px solid var(--pm-green-light)",
        padding: "12px 20px",
      }}
    >
      {/* Eyebrow */}
      <p
        style={{
          fontSize: 10,
          fontWeight: 500,
          color: "var(--pm-green-dark)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 4,
        }}
      >
        Active Grail
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
            color: "var(--pm-green-text)",
          }}
        >
          {name}
        </span>
        {targetPrice && (
          <span style={{ fontSize: 13, color: "var(--pm-green-dark)" }}>
            {formatCurrency(targetPrice, currency)}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: "100%",
          height: 4,
          backgroundColor: "var(--pm-green-light)",
          borderRadius: 99,
          overflow: "hidden",
          marginBottom: 6,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            backgroundColor: "var(--pm-green-dark)",
            borderRadius: 99,
            transition: "width 0.4s ease",
          }}
        />
      </div>

      {/* Subtext */}
      <p
        style={{
          fontSize: 10,
          color: "var(--pm-green-dark)",
          fontStyle: "italic",
        }}
      >
        A legendary Pokémon is said to live there... ·{" "}
        {formatCurrency(amountSaved, currency)} saved
      </p>
    </div>
  );
}
