"use client";

import ProgressBar from "@/components/ui/ProgressBar";

interface GrailBannerProps {
  name: string;
  targetPrice: number | null;
  amountSaved: number;
  currency: string;
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function GrailBanner({
  name,
  targetPrice,
  amountSaved,
  currency,
}: GrailBannerProps) {
  const percent =
    targetPrice && targetPrice > 0
      ? Math.min((amountSaved / targetPrice) * 100, 100)
      : 0;

  return (
    <div
      style={{
        backgroundColor: "var(--pm-amber-light)",
        border: "1px solid var(--pm-amber-mid)",
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 12,
      }}
    >
      <p
        style={{
          fontSize: 10,
          fontWeight: 500,
          color: "var(--pm-amber-dark)",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          marginBottom: 4,
        }}
      >
        Active Grail
      </p>
      <p
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: "var(--pm-ink)",
          marginBottom: 2,
        }}
      >
        {name}
      </p>
      <p
        style={{
          fontSize: 12,
          color: "var(--pm-amber-dark)",
          fontStyle: "italic",
          marginBottom: 10,
        }}
      >
        A legendary Pokémon is said to live there...
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          color: "var(--pm-amber-dark)",
          marginBottom: 8,
        }}
      >
        <span>Saved: {formatCurrency(amountSaved, currency)}</span>
        {targetPrice && (
          <span>Goal: {formatCurrency(targetPrice, currency)}</span>
        )}
      </div>

      <div
        style={{
          height: 8,
          backgroundColor: "var(--pm-amber-mid)",
          borderRadius: 99,
          overflow: "hidden",
          opacity: 0.35,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
          }}
        />
      </div>
      {/* Custom amber progress */}
      <div
        style={{
          width: "100%",
          height: 8,
          backgroundColor: "rgba(239,159,39,0.25)",
          borderRadius: 99,
          overflow: "hidden",
          marginTop: -8,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            backgroundColor: "var(--pm-amber-mid)",
            borderRadius: 99,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}
