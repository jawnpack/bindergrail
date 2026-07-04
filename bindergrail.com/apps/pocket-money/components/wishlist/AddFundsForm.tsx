"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/pocket-money/budget";

interface AddFundsFormProps {
  userId: string;
  itemId: string;
  itemName: string;
  availableCash: number;
  currency: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "0.5px solid var(--pm-gray-border)",
  borderRadius: 8,
  fontSize: 14,
  color: "var(--pm-ink)",
  backgroundColor: "var(--pm-white)",
  outline: "none",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 500,
  color: "var(--pm-ink)",
  marginBottom: 6,
};

export default function AddFundsForm({
  userId,
  itemId,
  itemName,
  availableCash,
  currency,
  onClose,
  onSuccess,
}: AddFundsFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const [source, setSource] = useState<"wallet" | "sale">("wallet");
  const [amount, setAmount] = useState("");
  const [saleName, setSaleName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function bumpFund(delta: number): Promise<boolean> {
    const { data: existing, error: readError } = await supabase
      .from("pm_grail_fund")
      .select("amount_saved")
      .eq("user_id", userId)
      .eq("wishlist_item_id", itemId)
      .maybeSingle();

    if (readError) return false;

    const currentSaved = existing
      ? Number((existing as { amount_saved: number }).amount_saved)
      : 0;

    const { error: writeError } = await supabase.from("pm_grail_fund").upsert(
      {
        user_id: userId,
        wishlist_item_id: itemId,
        amount_saved: currentSaved + delta,
      },
      { onConflict: "user_id,wishlist_item_id" }
    );

    return !writeError;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount) return;
    setError("");

    const parsed = parseFloat(amount);
    if (parsed <= 0) return;

    if (source === "wallet" && parsed > availableCash) {
      setError(
        `Not enough available cash. You have ${formatCurrency(availableCash, currency)}.`
      );
      return;
    }
    if (source === "sale" && !saleName) {
      setError("Give the sale a name.");
      return;
    }

    setLoading(true);

    if (source === "wallet") {
      // Move money from available cash into the item's reserve
      const { error: walletError } = await supabase
        .from("pm_user_settings")
        .upsert({ user_id: userId, cash_reserve: availableCash - parsed });

      if (walletError) {
        setLoading(false);
        setError("Couldn't move the cash. Try again.");
        return;
      }

      const ok = await bumpFund(parsed);
      setLoading(false);

      if (!ok) {
        // Put the cash back so nothing is lost
        await supabase
          .from("pm_user_settings")
          .upsert({ user_id: userId, cash_reserve: availableCash });
        setError("Couldn't reserve the funds. Try again.");
        return;
      }

      onSuccess(`${formatCurrency(parsed, currency)} reserved for ${itemName}.`);
      return;
    }

    // Sale: log the transaction, then reserve the proceeds.
    // The wallet trigger skips grail-fund sales, so nothing double-counts.
    const { error: txError } = await supabase.from("pm_transactions").insert({
      user_id: userId,
      type: "sale",
      name: saleName,
      amount: parsed,
      date: today,
      tag: null,
      tags: [],
      note: `Reserved for ${itemName}`,
      destination: "grail_fund",
    });

    if (txError) {
      setLoading(false);
      setError("Couldn't log the sale. Try again.");
      return;
    }

    const ok = await bumpFund(parsed);
    setLoading(false);

    if (!ok) {
      setError("Sale logged, but the reserve didn't update. Try editing it.");
      return;
    }

    onSuccess(`Sale logged. ${formatCurrency(parsed, currency)} reserved for ${itemName}.`);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          backgroundColor: "var(--pm-white)",
          borderRadius: 16,
          padding: 24,
          width: "100%",
          maxWidth: 420,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <p style={{ fontSize: 15, fontWeight: 500, color: "var(--pm-ink)" }}>
            Add funds
          </p>
          <button
            onClick={onClose}
            style={{
              fontSize: 20,
              color: "var(--pm-gray-text)",
              background: "none",
              border: "none",
              cursor: "pointer",
              lineHeight: 1,
              padding: 0,
            }}
          >
            ×
          </button>
        </div>
        <p
          style={{
            fontSize: 12,
            color: "var(--pm-gray-text)",
            marginBottom: 18,
          }}
        >
          Toward {itemName}
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          {/* Source segmented control */}
          <div>
            <label style={labelStyle}>Where from?</label>
            <div
              style={{
                display: "flex",
                border: "0.5px solid var(--pm-gray-border)",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {(
                [
                  { value: "wallet", label: "my wallet" },
                  { value: "sale", label: "log a sale" },
                ] as const
              ).map((btn, i) => (
                <button
                  key={btn.value}
                  type="button"
                  onClick={() => setSource(btn.value)}
                  style={{
                    flex: 1,
                    padding: "9px 0",
                    fontSize: 13,
                    fontWeight: 500,
                    border: "none",
                    borderRight:
                      i === 0 ? "0.5px solid var(--pm-gray-border)" : "none",
                    cursor: "pointer",
                    backgroundColor:
                      source === btn.value ? "var(--pm-ink)" : "var(--pm-white)",
                    color:
                      source === btn.value
                        ? "var(--pm-green-lightest)"
                        : "var(--pm-gray-text)",
                    transition: "background-color 0.15s",
                    fontFamily: "inherit",
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            {source === "wallet" && (
              <p
                style={{
                  fontSize: 10,
                  color: "var(--pm-gray-text)",
                  marginTop: 4,
                }}
              >
                {formatCurrency(availableCash, currency)} available.
              </p>
            )}
          </div>

          {/* Sale name */}
          {source === "sale" && (
            <div>
              <label style={labelStyle}>What did you sell?</label>
              <input
                value={saleName}
                onChange={(e) => setSaleName(e.target.value)}
                placeholder="e.g. Charizard bulk lot"
                required
                style={inputStyle}
              />
            </div>
          )}

          {/* Amount */}
          <div>
            <label style={labelStyle}>How much?</label>
            <input
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              autoFocus
              style={inputStyle}
            />
          </div>

          {error && (
            <p style={{ fontSize: 13, color: "var(--pm-red-mid)" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: "var(--pm-green-mid)",
              color: "var(--pm-white)",
              border: "none",
              borderRadius: 10,
              padding: 13,
              fontSize: 14,
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              fontFamily: "inherit",
            }}
          >
            {loading ? "Reserving..." : "Reserve funds"}
          </button>
        </form>
      </div>
    </div>
  );
}
