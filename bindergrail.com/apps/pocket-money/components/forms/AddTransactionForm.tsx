"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { DEFAULT_TAGS } from "@/lib/pocket-money/tags";

interface AddTransactionFormProps {
  userId: string;
  currency: string;
  onClose: () => void;
  onSuccess: (name: string, type: string) => void;
}

export default function AddTransactionForm({
  userId,
  currency,
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

    setLoading(false);
    router.refresh();
    onSuccess(name, type);
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 500,
    color: "var(--pm-ink)",
    display: "block",
    marginBottom: 6,
  };
  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid var(--pm-gray-border)",
    backgroundColor: "#fff",
    color: "var(--pm-ink)",
    fontSize: 15,
    fontWeight: 400,
    appearance: "none",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.35)",
        zIndex: 50,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          backgroundColor: "var(--pm-gray-bg)",
          borderRadius: "20px 20px 0 0",
          padding: "24px 20px 32px",
          width: "100%",
          maxWidth: 520,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <p style={{ fontSize: 17, fontWeight: 500, color: "var(--pm-ink)" }}>
            Log a transaction
          </p>
          <button
            onClick={onClose}
            style={{
              fontSize: 22,
              color: "var(--pm-gray-text)",
              background: "none",
              border: "none",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input
            label="What did you buy?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Prismatic Evolutions booster box"
            required
          />

          <Input
            label="How much?"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />

          <div>
            <label style={labelStyle}>Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "spend" | "return" | "sale")}
              style={selectStyle}
            >
              <option value="spend">Spend</option>
              <option value="return">Return</option>
              <option value="sale">Sale</option>
            </select>
          </div>

          {type === "sale" && (
            <div>
              <label style={labelStyle}>Where does this go?</label>
              <select
                value={destination}
                onChange={(e) =>
                  setDestination(e.target.value as "budget" | "grail_fund")
                }
                style={selectStyle}
              >
                <option value="budget">Back into my budget</option>
                <option value="grail_fund">Toward my grail</option>
              </select>
            </div>
          )}

          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <div>
            <label style={labelStyle}>Tag (optional)</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              style={selectStyle}
            >
              <option value="">No tag</option>
              {DEFAULT_TAGS.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any notes..."
          />

          <Button type="submit" fullWidth disabled={loading} style={{ marginTop: 4 }}>
            {loading ? "Logging..." : "Log it"}
          </Button>
        </form>
      </div>
    </div>
  );
}
