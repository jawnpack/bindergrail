"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_TAGS } from "@/lib/pocket-money/tags";
import type { WishlistItemRow } from "@/lib/pocket-money/queries";

interface EditWishlistItemFormProps {
  item: WishlistItemRow;
  customTags: string[];
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

export default function EditWishlistItemForm({
  item,
  customTags,
  onClose,
  onSuccess,
}: EditWishlistItemFormProps) {
  const [name, setName] = useState(item.name);
  const [cost, setCost] = useState(
    item.target_price != null ? String(item.target_price) : ""
  );
  const [note, setNote] = useState(item.note ?? "");
  const [url, setUrl] = useState(item.url ?? "");
  const [tag, setTag] = useState(item.tag ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const tagOptions = [
    ...DEFAULT_TAGS.map((t) => t.name),
    ...customTags.filter((c) => !DEFAULT_TAGS.some((t) => t.name === c)),
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    setError("");
    setLoading(true);

    const { error: updateError } = await supabase
      .from("pm_wishlist_items")
      .update({
        name,
        target_price: cost ? parseFloat(cost) : null,
        note: note || null,
        url: url || null,
        tag: tag || null,
      })
      .eq("id", item.id);

    setLoading(false);

    if (updateError) {
      setError("Couldn't save the changes. Try again.");
      return;
    }

    onSuccess("Wishlist item updated.");
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
            Edit wishlist item
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
          <div>
            <label style={labelStyle}>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

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

          <div>
            <label style={labelStyle}>Description</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional..."
              style={inputStyle}
            />
          </div>

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

          <div>
            <label style={labelStyle}>Tag</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              style={{ ...inputStyle, appearance: "none" }}
            >
              <option value="">No tag</option>
              {tagOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
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
            {loading ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
