"use client";

import GrailShare from "@/components/wishlist/GrailShare";

interface GrailMomentProps {
  name: string;
  days: number | null;
  onClose: () => void;
}

export default function GrailMoment({ name, days, onClose }: GrailMomentProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "var(--pm-ink)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        overflowY: "auto",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400, margin: "auto" }}>
        {/* Celebration hero */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "var(--pm-amber-mid)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 14,
            }}
          >
            ★ Legendary catch
          </p>
          <p
            style={{
              fontSize: 26,
              fontWeight: 500,
              color: "var(--pm-green-lightest)",
              lineHeight: 1.25,
              marginBottom: 10,
            }}
          >
            {name}
          </p>
          <p
            style={{
              fontSize: 13,
              color: "var(--pm-gray-text)",
              fontStyle: "italic",
            }}
          >
            {days !== null && days > 0
              ? `You caught your grail after ${days} ${days === 1 ? "day" : "days"}. The chase was worth it.`
              : "You caught your grail. The chase was worth it."}
          </p>
        </div>

        {/* Share suite */}
        <GrailShare name={name} days={days} />

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            width: "100%",
            marginTop: 20,
            backgroundColor: "transparent",
            color: "var(--pm-gray-text)",
            border: "0.5px solid var(--pm-gray-border)",
            borderRadius: 10,
            padding: "12px 28px",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Add it to the Pokédex
        </button>
      </div>
    </div>
  );
}
