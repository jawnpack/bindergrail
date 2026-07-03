"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

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
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Account menu"
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
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontFamily: "inherit",
            }}
          >
            {getInitials(displayName)}
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: 36,
                right: 0,
                backgroundColor: "var(--pm-white)",
                border: "0.5px solid var(--pm-gray-border)",
                borderRadius: 10,
                minWidth: 160,
                zIndex: 60,
                boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                overflow: "hidden",
              }}
            >
              {displayName && (
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--pm-ink)",
                    padding: "10px 14px 8px",
                    borderBottom: "0.5px solid var(--pm-gray-border)",
                  }}
                >
                  {displayName}
                </p>
              )}
              <Link
                href="/account"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "10px 14px",
                  fontSize: 12,
                  color: "var(--pm-ink)",
                  textDecoration: "none",
                  borderBottom: "0.5px solid var(--pm-gray-border)",
                }}
              >
                Account
              </Link>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 14px",
                  fontSize: 12,
                  color: "var(--pm-red-dark)",
                  background: "none",
                  border: "none",
                  cursor: signingOut ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
