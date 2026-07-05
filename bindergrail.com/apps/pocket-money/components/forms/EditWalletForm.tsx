"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface EditWalletFormProps {
  userId: string;
  currentAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditWalletForm({
  userId,
  currentAmount,
  onClose,
  onSuccess,
}: EditWalletFormProps) {
  const [amount, setAmount] = useState(
    currentAmount !== 0 ? String(currentAmount) : ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (amount === "") return;
    setError("");
    setLoading(true);

    const { error: upsertError } = await supabase
      .from("pm_user_settings")
      .upsert({ user_id: userId, cash_reserve: parseFloat(amount) });

    setLoading(false);

    if (upsertError) {
      setError("Couldn't save. Try again.");
      return;
    }

    onSuccess();
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
            marginBottom: 20,
          }}
        >
          <p style={{ fontSize: 15, fontWeight: 500, color: "var(--pm-ink)" }}>
            Your Pocket
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
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
            autoFocus
            style={{
              width: "100%",
              backgroundColor: "var(--pm-gray-bg)",
              border: "0.5px solid var(--pm-gray-border)",
              borderRadius: 10,
              fontSize: 28,
              fontWeight: 500,
              color: "var(--pm-ink)",
              padding: "14px 16px",
              outline: "none",
              fontFamily: "inherit",
            }}
          />

          <p
            style={{
              fontSize: 11,
              color: "var(--pm-gray-text)",
              fontStyle: "italic",
              marginTop: -6,
            }}
          >
            Your unassigned cash. Pocket spends subtract from it, returns and
            sales add back. Bucket money is managed separately. Edit any time
            to reset it.
          </p>

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
            {loading ? "Saving..." : "Save wallet"}
          </button>
        </form>
      </div>
    </div>
  );
}
