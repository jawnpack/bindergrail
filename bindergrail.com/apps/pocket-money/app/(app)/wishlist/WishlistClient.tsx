"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Topbar from "@/components/layout/Topbar";
import GrailStrip from "@/components/dashboard/GrailStrip";
import AddWishlistItemForm from "@/components/wishlist/AddWishlistItemForm";
import EditWishlistItemForm from "@/components/wishlist/EditWishlistItemForm";
import AddFundsForm from "@/components/wishlist/AddFundsForm";
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
  customTags: string[];
  reservedByItem: Record<string, number>;
  availableCash: number;
  grailAmountSaved: number;
  openFundsForItemId: string | null;
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

/** Whole days since an ISO timestamp. Called from event handlers only —
 *  reading the clock during render is impure. */
function daysSince(iso: string): number {
  return Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  );
}

export default function WishlistClient({
  userId,
  displayName,
  avatarColor,
  currency,
  items,
  customTags,
  reservedByItem,
  availableCash,
  grailAmountSaved,
  openFundsForItemId,
}: WishlistClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItemRow | null>(null);
  // Opens straight from the dashboard's "reserved" figure via ?funds=<id>.
  const [fundingItem, setFundingItem] = useState<WishlistItemRow | null>(
    () => items.find((i) => i.id === openFundsForItemId) ?? null
  );
  const [toast, setToast] = useState<string | null>(null);
  const [grailMomentItem, setGrailMomentItem] = useState<{
    name: string;
    days: number;
  } | null>(null);
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
    const reserved = reservedByItem[item.id] ?? 0;

    const { error } = await supabase
      .from("pm_wishlist_items")
      .update({ status: "acquired" })
      .eq("id", item.id);

    if (error) {
      setBusy(null);
      setToast("Something went wrong. Try again.");
      return;
    }

    // Catching SPENDS the money held against this item: clear the hold so it
    // stops counting as reserved. Deliberately does NOT touch pocket/stashes —
    // that money already left the wallet when it was reserved. Deducting here
    // would count the same dollar twice.
    if (reserved > 0) {
      const { error: fundError } = await supabase
        .from("pm_grail_fund")
        .delete()
        .eq("user_id", userId)
        .eq("wishlist_item_id", item.id);

      if (fundError) {
        setBusy(null);
        setToast("Marked as caught, but the reserve didn't clear. Try again.");
        router.refresh();
        return;
      }
    }

    setBusy(null);

    if (item.is_grail) {
      setGrailMomentItem({ name: item.name, days: daysSince(item.created_at) });
    } else {
      setToast(`Got ${item.name}!`);
    }
    router.refresh();
  }

  async function removeItem(item: WishlistItemRow) {
    setBusy(item.id);
    const reserved = reservedByItem[item.id] ?? 0;

    // Deleting the item cascades its fund row away, so return any money
    // held against it to the pocket first — committed cash is never destroyed.
    if (reserved > 0) {
      const { error: refundError } = await supabase
        .from("pm_user_settings")
        .upsert({ user_id: userId, cash_reserve: availableCash + reserved });

      if (refundError) {
        setBusy(null);
        setToast("Couldn't return the reserved money. Try again.");
        return;
      }
    }

    const { error } = await supabase
      .from("pm_wishlist_items")
      .delete()
      .eq("id", item.id);

    setBusy(null);

    if (error) {
      // Roll the refund back so the money isn't counted twice.
      if (reserved > 0) {
        await supabase
          .from("pm_user_settings")
          .upsert({ user_id: userId, cash_reserve: availableCash });
      }
      setToast("Something went wrong. Try again.");
      return;
    }

    setToast(
      reserved > 0
        ? `Removed. ${formatCurrency(reserved, currency)} returned to your pocket.`
        : "Removed from wishlist."
    );
    router.refresh();
  }

  function renderRow(item: WishlistItemRow, isAcquired: boolean) {
    const tagStyle = item.tag ? getTagStyle(item.tag) : null;
    const reserved = reservedByItem[item.id] ?? 0;
    const funded =
      item.target_price != null &&
      item.target_price > 0 &&
      reserved >= item.target_price;

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
          backgroundColor:
            funded && !isAcquired ? "var(--pm-amber-light)" : undefined,
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
              : funded
              ? "var(--pm-amber-mid)"
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
            {funded && !isAcquired && (
              <span
                style={{
                  marginLeft: 6,
                  fontSize: 9,
                  fontWeight: 500,
                  padding: "1px 6px",
                  borderRadius: 4,
                  backgroundColor: "var(--pm-amber-mid)",
                  color: "var(--pm-white)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                ★ Funded
              </span>
            )}
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

        {/* Right: cost + reserved + actions */}
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
          {!isAcquired && reserved > 0 && (
            <button
              type="button"
              disabled={busy === item.id}
              onClick={() => setFundingItem(item)}
              title="Add or take back reserved money"
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: "var(--pm-amber-dark)",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                fontFamily: "inherit",
                textDecoration: "underline",
                textUnderlineOffset: 2,
              }}
            >
              {funded
                ? `fully funded · ${formatCurrency(reserved, currency)}`
                : `${formatCurrency(reserved, currency)} reserved`}
            </button>
          )}
          {!isAcquired && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <button
                disabled={busy === item.id}
                onClick={() => setFundingItem(item)}
                style={smallButtonStyle}
              >
                funds
              </button>
              <button
                disabled={busy === item.id}
                onClick={() => setEditingItem(item)}
                style={smallButtonStyle}
              >
                edit
              </button>
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
                justifyContent: "space-between",
                alignItems: "center",
                gap: 6,
                padding: "8px 20px",
                backgroundColor:
                  grail.target_price != null &&
                  grail.target_price > 0 &&
                  grailAmountSaved >= grail.target_price
                    ? "var(--pm-amber-light)"
                    : "var(--pm-green-lightest)",
                borderBottom: "0.5px solid var(--pm-green-light)",
                marginTop: -1,
              }}
            >
              {/* The money is the control: tap the amount to adjust it. */}
              <button
                type="button"
                disabled={busy === grail.id}
                onClick={() => setFundingItem(grail)}
                title="Add or take back reserved money"
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--pm-green-text)",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textDecoration: "underline",
                  textUnderlineOffset: 2,
                }}
              >
                {grailAmountSaved > 0
                  ? `${formatCurrency(grailAmountSaved, currency)} reserved · adjust`
                  : "reserve funds"}
              </button>

              <div style={{ display: "flex", gap: 6 }}>
              <button
                disabled={busy === grail.id}
                onClick={() => setFundingItem(grail)}
                style={smallButtonStyle}
              >
                funds
              </button>
              <button
                disabled={busy === grail.id}
                onClick={() => setEditingItem(grail)}
                style={smallButtonStyle}
              >
                edit
              </button>
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
          customTags={customTags}
          onClose={() => setShowAddForm(false)}
          onSuccess={(name) => {
            setShowAddForm(false);
            setToast(`${name} added to the hunt.`);
            router.refresh();
          }}
        />
      )}

      {editingItem && (
        <EditWishlistItemForm
          item={editingItem}
          customTags={customTags}
          onClose={() => setEditingItem(null)}
          onSuccess={(message) => {
            setEditingItem(null);
            setToast(message);
            router.refresh();
          }}
        />
      )}

      {fundingItem && (
        <AddFundsForm
          userId={userId}
          itemId={fundingItem.id}
          itemName={fundingItem.name}
          availableCash={availableCash}
          reservedAmount={reservedByItem[fundingItem.id] ?? 0}
          currency={currency}
          onClose={() => setFundingItem(null)}
          onSuccess={(message) => {
            setFundingItem(null);
            setToast(message);
            router.refresh();
          }}
        />
      )}

      {grailMomentItem && (
        <GrailMoment
          name={grailMomentItem.name}
          days={grailMomentItem.days}
          onClose={() => setGrailMomentItem(null)}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
