"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_TAGS } from "@/lib/pocket-money/tags";

interface AddTransactionFormProps {
  userId: string;
  currency: string;
  grailItemId?: string | null;
  onClose: () => void;
  onSuccess: (name: string, type: string, destination?: string) => void;
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

export default function AddTransactionForm({
  userId,
  currency,
  grailItemId,
  onClose,
  onSuccess,
}: AddTransactionFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"spend" | "return" | "sale">("spend");
  const [date, setDate] = useState(today);
  const [tag, setTag] = useState("");
  const [note, setNote] = useState("");
  const [destination, setDestination] = useState<"budget" | "grail_fund">("budget");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !amount || !date) return;
    setLoading(true);

    await supabase.from("pm_transactions").insert({
      user_id: userId,
      type,
      name,
      amount: parseFloat(amount),
      date,
      tag: tag || null,
      note: note || null,
      destination: type === "sale" ? destination : null,
    });

    if (type === "sale" && destination === "grail_fund" && grailItemId) {
      const { data: existing } = await supabase
        .from("pm_grail_fund")
        .select("amount_saved")
        .eq("user_id", userId)
        .eq("wishlist_item_id", grailItemId)
        .maybeSingle();

      const currentSaved = existing ? Number((existing as { amount_saved: number }).amount_saved) : 0;

      await supabase.from("pm_grail_fund").upsert({
        user_id: userId,
        wishlist_item_id: grailItemId,
        amount_saved: currentSaved + parseFloat(amount),
      });
    }

    setLoading(false);
    router.refresh();
    onSuccess(name, type, type === "sale" ? destination : undefined);
  }

  const typeButtons: { value: "spend" | "return" | "sale"; label: string }[] = [
    { value: "spend", label: "spend" },
    { value: "return", label: "return" },
    { value: "sale", label: "sale" },
  ];

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
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <p style={{ fontSize: 15, fontWeight: 500, color: "var(--pm-ink)" }}>
            Log a transaction
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

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          {/* Name */}
          <div>
            <label style={labelStyle}>What did you buy?</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Prismatic Evolutions booster box"
              required
              style={inputStyle}
            />
          </div>

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
              style={inputStyle}
            />
          </div>

          {/* Type segmented control */}
          <div>
            <label style={labelStyle}>Type</label>
            <div
              style={{
                display: "flex",
                border: "0.5px solid var(--pm-gray-border)",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {typeButtons.map((btn, i) => (
                <button
                  key={btn.value}
                  type="button"
                  onClick={() => setType(btn.value)}
                  style={{
                    flex: 1,
                    padding: "9px 0",
                    fontSize: 13,
                    fontWeight: 500,
                    border: "none",
                    borderRight:
                      i < typeButtons.length - 1
                        ? "0.5px solid var(--pm-gray-border)"
                        : "none",
                    cursor: "pointer",
                    backgroundColor:
                      type === btn.value ? "var(--pm-ink)" : "var(--pm-white)",
                    color:
                      type === btn.value
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
          </div>

          {/* Destination (sale only) */}
          {type === "sale" && (
            <div>
              <label style={labelStyle}>Where does this go?</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { value: "budget" as const, label: "Back into my budget" },
                  { value: "grail_fund" as const, label: "Toward my grail" },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setDestination(value)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 500,
                      border: "0.5px solid var(--pm-gray-border)",
                      cursor: "pointer",
                      textAlign: "left",
                      backgroundColor:
                        destination === value ? "var(--pm-ink)" : "var(--pm-white)",
                      color:
                        destination === value
                          ? "var(--pm-green-lightest)"
                          : "var(--pm-ink)",
                      transition: "background-color 0.15s",
                      fontFamily: "inherit",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date */}
          <div>
            <label style={labelStyle}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* Tag */}
          <div>
            <label style={labelStyle}>Tag</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              style={{ ...inputStyle, appearance: "none" }}
            >
              <option value="">No tag</option>
              {DEFAULT_TAGS.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Note */}
          <div>
            <label style={labelStyle}>Note</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional..."
              style={inputStyle}
            />
          </div>

          {/* Submit */}
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
              marginTop: 2,
            }}
          >
            {loading ? "Logging..." : "Log it"}
          </button>
        </form>
      </div>
    </div>
  );
}
