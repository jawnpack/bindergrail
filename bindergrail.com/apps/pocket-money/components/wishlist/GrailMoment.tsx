"use client";

interface GrailMomentProps {
  itemName: string;
  onClose: () => void;
}

export default function GrailMoment({ itemName, onClose }: GrailMomentProps) {
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
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "var(--pm-green-light)",
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
          {itemName}
        </p>
        <p
          style={{
            fontSize: 13,
            color: "var(--pm-gray-text)",
            fontStyle: "italic",
            marginBottom: 32,
          }}
        >
          You caught your grail. The chase was worth it.
        </p>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "var(--pm-green-mid)",
            color: "var(--pm-white)",
            border: "none",
            borderRadius: 10,
            padding: "13px 28px",
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
