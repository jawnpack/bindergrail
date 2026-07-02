"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_TAGS } from "@/lib/pocket-money/tags";

interface AddWishlistItemFormProps {
  userId: string;
  onClose: () => void;
  onSuccess: (name: string) => void;
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

export default function AddWishlistItemForm({
  userId,
  onClose,
  onSuccess,
}: AddWishlistItemFormProps) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [url, setUrl] = useState("");
  const [tag, setTag] = useState("");
  const [cost, setCost] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    setError("");
    setLoading(true);

    const { error: insertError } = await supabase
      .from("pm_wishlist_items")
      .insert({
        user_id: userId,
        name,
        note: note || null,
        url: url || null,
        tag: tag || null,
        target_price: cost ? parseFloat(cost) : null,
        is_grail: false,
        status: "active",
      });

    setLoading(false);

    if (insertError) {
      setError("Couldn't add that item. Try again.");
      return;
    }

    onSuccess(name);
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
            Add to wishlist
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
            <label style={labelStyle}>What are you hunting?</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Umbreon VMAX Alt Art"
              required
              style={inputStyle}
            />
          </div>

          {/* Cost */}
          <div>
            <label style={labelStyle}>Cost</label>
            <input
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="0.00"
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional — condition, grade, version..."
              style={inputStyle}
            />
          </div>

          {/* URL */}
          <div>
            <label style={labelStyle}>Link</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
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

          {error && (
            <p style={{ fontSize: 13, color: "var(--pm-red-mid)" }}>{error}</p>
          )}

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
            {loading ? "Adding..." : "Add to wishlist"}
          </button>
        </form>
      </div>
    </div>
  );
}
