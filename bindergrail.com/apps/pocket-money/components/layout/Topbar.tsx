interface TopbarProps {
  displayName: string | null;
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Topbar({ displayName }: TopbarProps) {
  return (
    <div
      style={{
        backgroundColor: "#2C2C2A",
        padding: "0 20px",
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      {/* Wordmark */}
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "0.04em",
        }}
      >
        <span style={{ color: "var(--pm-green-lightest)" }}>pocket </span>
        <span style={{ color: "var(--pm-green-mid)" }}>money</span>
      </span>

      {/* Avatar */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          backgroundColor: "#3B6D11",
          color: "var(--pm-green-lightest)",
          fontSize: 11,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          letterSpacing: "0.02em",
        }}
      >
        {getInitials(displayName)}
      </div>
    </div>
  );
}
