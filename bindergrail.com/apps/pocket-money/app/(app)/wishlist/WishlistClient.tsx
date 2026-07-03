"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Topbar from "@/components/layout/Topbar";
import GrailStrip from "@/components/dashboard/GrailStrip";
import AddWishlistItemForm from "@/components/wishlist/AddWishlistItemForm";
import GrailMoment from "@/components/wishlist/GrailMoment";
import Toast from "@/components/forms/Toast";
import { formatCurrency } from "@/lib/pocket-money/budget";
import { getTagStyle } from "@/lib/pocket-money/tags";
import type { WishlistItemRow } from "@/lib/pocket-money/queries";

interface WishlistClientProps {
  userId: string;
  displayName: string | null;
  avatarColor: string | null;
  currency: string;
  items: WishlistItemRow[];
  grailAmountSaved: number;
}

const smallButtonStyle: React.CSSProperties = {
  border: "0.5px solid var(--pm-gray-border)",
  borderRadius: 6,
  padding: "4px 10px",
  fontSize: 11,
  fontWeight: 400,
  backgroundColor: "var(--pm-white)",
  color: "var(--pm-gray-text)",
  cursor: "pointer",
  fontFamily: "inherit",
};

export default function WishlistClient({
  userId,
  displayName,
  avatarColor,
  currency,
  items,
  grailAmountSaved,
}: WishlistClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [grailMomentName, setGrailMomentName] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const grail = items.find((i) => i.is_grail && i.status === "active") ?? null;
  const active = items.filter((i) => i.status === "active" && !i.is_grail);
  const acquired = items.filter((i) => i.status === "acquired");

  async function setAsGrail(item: WishlistItemRow) {
    setBusy(item.id);

    const { error: clearError } = await supabase
      .from("pm_wishlist_items")
      .update({ is_grail: false })
      .eq("user_id", userId)
      .eq("is_grail", true);

    const { error: setError } = clearError
      ? { error: clearError }
      : await supabase
          .from("pm_wishlist_items")
          .update({ is_grail: true })
          .eq("id", item.id);

    setBusy(null);

    if (clearError || setError) {
      setToast("Something went wrong. Try again.");
      return;
    }

    setToast(`${item.name} is now your grail.`);
    router.refresh();
  }

  async function markAcquired(item: WishlistItemRow) {
    setBusy(item.id);

    const { error } = await supabase
      .from("pm_wishlist_items")
      .update({ status: "acquired" })
      .eq("id", item.id);

    setBusy(null);

    if (error) {
      setToast("Something went wrong. Try again.");
      return;
    }

    if (item.is_grail) {
      setGrailMomentName(item.name);
    } else {
      setToast(`Got ${item.name}!`);
    }
    router.refresh();
  }

  async function removeItem(item: WishlistItemRow) {
    setBusy(item.id);

    const { error } = await supabase
      .from("pm_wishlist_items")
      .delete()
      .eq("id", item.id);

    setBusy(null);

    if (error) {
      setToast("Something went wrong. Try again.");
      return;
    }

    setToast("Removed from wishlist.");
    router.refresh();
  }

  function renderRow(item: WishlistItemRow, isAcquired: boolean) {
    const tagStyle = item.tag ? getTagStyle(item.tag) : null;

    return (
      <div
        key={item.id}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          padding: "12px 20px",
          borderBottom: "0.5px solid var(--pm-gray-border)",
          opacity: isAcquired ? 0.55 : 1,
        }}
      >
        {/* Dot */}
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: isAcquired
              ? "var(--pm-gray-border)"
              : "var(--pm-green-mid)",
            flexShrink: 0,
            marginTop: 5,
          }}
        />

        {/* Left: name + description + tag + link */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 13,
              color: "var(--pm-ink)",
              textDecoration: isAcquired ? "line-through" : "none",
            }}
          >
            {item.name}
          </p>
          {item.note && (
            <p
              style={{
                fontSize: 11,
                color: "var(--pm-gray-text)",
                marginTop: 1,
              }}
            >
              {item.note}
            </p>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 3,
              flexWrap: "wrap",
            }}
          >
            {tagStyle && item.tag && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 500,
                  padding: "1px 6px",
                  borderRadius: 4,
                  backgroundColor: tagStyle.bg,
                  color: tagStyle.text,
                }}
              >
                {item.tag}
              </span>
            )}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 10,
                  color: "var(--pm-green-dark)",
                  textDecoration: "underline",
                }}
              >
                view listing ↗
              </a>
            )}
          </div>
        </div>

        {/* Right: cost + actions */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 6,
            flexShrink: 0,
          }}
        >
          {item.target_price != null && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: isAcquired ? "var(--pm-gray-text)" : "var(--pm-ink)",
              }}
            >
              {formatCurrency(item.target_price, currency)}
            </span>
          )}
          {!isAcquired && (
            <div style={{ display: "flex", gap: 6 }}>
              {!item.is_grail && (
                <button
                  disabled={busy === item.id}
                  onClick={() => setAsGrail(item)}
                  style={smallButtonStyle}
                >
                  set grail
                </button>
              )}
              <button
                disabled={busy === item.id}
                onClick={() => markAcquired(item)}
                style={smallButtonStyle}
              >
                got it
              </button>
              <button
                disabled={busy === item.id}
                onClick={() => removeItem(item)}
                style={{ ...smallButtonStyle, padding: "4px 8px" }}
                aria-label={`Remove ${item.name}`}
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--pm-gray-bg)" }}>
      <div className="md:max-w-[600px] md:mx-auto" style={{ minHeight: "100vh" }}>
        <Topbar
          displayName={displayName}
          avatarColor={avatarColor}
          active="wishlist"
        />

        {/* Active grail */}
        {grail && (
          <>
            <GrailStrip
              name={grail.name}
              targetPrice={grail.target_price}
              amountSaved={grailAmountSaved}
              currency={currency}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 6,
                padding: "8px 20px",
                backgroundColor: "var(--pm-green-lightest)",
                borderBottom: "0.5px solid var(--pm-green-light)",
                marginTop: -1,
              }}
            >
              <button
                disabled={busy === grail.id}
                onClick={() => markAcquired(grail)}
                style={smallButtonStyle}
              >
                got it
              </button>
              <button
                disabled={busy === grail.id}
                onClick={() => removeItem(grail)}
                style={{ ...smallButtonStyle, padding: "4px 8px" }}
                aria-label={`Remove ${grail.name}`}
              >
                ×
              </button>
            </div>
          </>
        )}

        {/* Wishlist header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 20px 10px",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "var(--pm-gray-text)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Wishlist
          </span>
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              backgroundColor: "var(--pm-green-mid)",
              color: "var(--pm-white)",
              border: "none",
              borderRadius: 20,
              padding: "4px 10px",
              fontSize: 11,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            + add item
          </button>
        </div>

        {/* Active items */}
        {active.length === 0 && !grail ? (
          <p
            style={{
              fontSize: 13,
              color: "var(--pm-gray-text)",
              fontStyle: "italic",
              padding: "10px 20px 24px",
            }}
          >
            Nothing on the list yet. What are you hunting?
          </p>
        ) : (
          <div>{active.map((item) => renderRow(item, false))}</div>
        )}

        {/* Acquired */}
        {acquired.length > 0 && (
          <>
            <div style={{ padding: "18px 20px 8px" }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--pm-gray-text)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Caught
              </span>
            </div>
            <div>{acquired.map((item) => renderRow(item, true))}</div>
          </>
        )}
      </div>

      {/* Modals */}
      {showAddForm && (
        <AddWishlistItemForm
          userId={userId}
          onClose={() => setShowAddForm(false)}
          onSuccess={(name) => {
            setShowAddForm(false);
            setToast(`${name} added to the hunt.`);
            router.refresh();
          }}
        />
      )}

      {grailMomentName && (
        <GrailMoment
          itemName={grailMomentName}
          onClose={() => setGrailMomentName(null)}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
