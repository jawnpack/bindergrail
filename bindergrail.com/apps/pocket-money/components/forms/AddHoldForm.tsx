"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { DEFAULT_TAGS } from "@/lib/pocket-money/tags";

interface AddHoldFormProps {
  userId: string;
  currency: string;
  onClose: () => void;
  onSuccess: (name: string) => void;
}

export default function AddHoldForm({
  userId,
  currency,
  onClose,
  onSuccess,
}: AddHoldFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(today);
  const [tag, setTag] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !amount || !dueDate) return;
    setLoading(true);

    await supabase.from("pm_holds").insert({
      user_id: userId,
      name,
      amount: parseFloat(amount),
      due_date: dueDate,
      tag: tag || null,
      note: note || null,
      status: "pending",
    });

    setLoading(false);
    onSuccess(name);
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
            Add a hold
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
            label="What's on hold?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Pokémon Center ETB"
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

          <Input
            label="When does it hit?"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
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

          <Button type="submit" fullWidth disabled={loading} style={{ marginTop: 4, backgroundColor: "var(--pm-amber-mid)" }}>
            {loading ? "Adding..." : "Add hold"}
          </Button>
        </form>
      </div>
    </div>
  );
}
