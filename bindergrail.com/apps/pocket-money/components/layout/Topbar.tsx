import Link from "next/link";

interface TopbarProps {
  displayName: string | null;
  active?: "dashboard" | "wishlist";
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        fontSize: 12,
        fontWeight: 500,
        color: isActive ? "var(--pm-green-lightest)" : "var(--pm-gray-text)",
        textDecoration: "none",
      }}
    >
      {label}
    </Link>
  );
}

export default function Topbar({ displayName, active }: TopbarProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--pm-ink)",
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

      {/* Nav + avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <NavLink
          href="/dashboard"
          label="dashboard"
          isActive={active === "dashboard"}
        />
        <NavLink
          href="/wishlist"
          label="wishlist"
          isActive={active === "wishlist"}
        />
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: "var(--pm-green-dark)",
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
    </div>
  );
}
