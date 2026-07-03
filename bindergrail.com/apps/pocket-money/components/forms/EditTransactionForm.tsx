"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import TagPicker from "@/components/forms/TagPicker";

interface EditableTransaction {
  id: string;
  type: "spend" | "return" | "sale";
  name: string;
  amount: number;
  date: string;
  tag: string | null;
  tags?: string[];
  note: string | null;
}

interface EditTransactionFormProps {
  transaction: EditableTransaction;
  customTags?: string[];
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

export default function EditTransactionForm({
  transaction,
  customTags = [],
  onClose,
  onSuccess,
}: EditTransactionFormProps) {
  const [name, setName] = useState(transaction.name);
  const [amount, setAmount] = useState(String(transaction.amount));
  const [type, setType] = useState<"spend" | "return" | "sale">(
    transaction.type
  );
  const [date, setDate] = useState(transaction.date);
  const [tags, setTags] = useState<string[]>(
    transaction.tags?.length
      ? transaction.tags
      : transaction.tag
      ? [transaction.tag]
      : []
  );
  const [note, setNote] = useState(transaction.note ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !amount || !date) return;
    setError("");
    setLoading(true);

    // Destination is intentionally not editable here — changing a
    // grail-fund sale after the fact would desync pm_grail_fund.
    const { error: updateError } = await supabase
      .from("pm_transactions")
      .update({
        type,
        name,
        amount: parseFloat(amount),
        date,
        tag: tags[0] ?? null,
        tags,
        note: note || null,
      })
      .eq("id", transaction.id);

    setLoading(false);

    if (updateError) {
      setError("Couldn't save the changes. Try again.");
      return;
    }

    router.refresh();
    onSuccess("Transaction updated.");
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${transaction.name}"? This can't be undone.`)) {
      return;
    }
    setError("");
    setDeleting(true);

    const { error: deleteError } = await supabase
      .from("pm_transactions")
      .delete()
      .eq("id", transaction.id);

    setDeleting(false);

    if (deleteError) {
      setError("Couldn't delete that. Try again.");
      return;
    }

    router.refresh();
    onSuccess("Transaction deleted.");
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
            Edit transaction
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
            <label style={labelStyle}>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* Amount */}
          <div>
            <label style={labelStyle}>Amount</label>
            <input
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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

          {/* Tags */}
          <div>
            <label style={labelStyle}>Tags</label>
            <TagPicker
              customTags={customTags}
              selected={tags}
              onChange={setTags}
            />
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

          {error && (
            <p style={{ fontSize: 13, color: "var(--pm-red-mid)" }}>{error}</p>
          )}

          {/* Save */}
          <button
            type="submit"
            disabled={loading || deleting}
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
            {loading ? "Saving..." : "Save changes"}
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading || deleting}
            style={{
              width: "100%",
              backgroundColor: "transparent",
              color: "var(--pm-red-dark)",
              border: "none",
              padding: 6,
              fontSize: 12,
              fontWeight: 500,
              cursor: deleting ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}
          >
            {deleting ? "Deleting..." : "Delete transaction"}
          </button>
        </form>
      </div>
    </div>
  );
}
