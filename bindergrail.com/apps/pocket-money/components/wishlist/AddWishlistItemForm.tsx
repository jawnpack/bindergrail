"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_TAGS, MAX_CUSTOM_TAGS } from "@/lib/pocket-money/tags";

const NEW_TAG_OPTION = "__new__";

interface AddWishlistItemFormProps {
  userId: string;
  customTags: string[];
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
  customTags,
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

  // Inline tag creation
  const [localCustomTags, setLocalCustomTags] = useState(customTags);
  const [creatingTag, setCreatingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [tagError, setTagError] = useState("");
  const [savingTag, setSavingTag] = useState(false);

  const supabase = createClient();

  const atTagLimit = localCustomTags.length >= MAX_CUSTOM_TAGS;

  function handleTagSelect(value: string) {
    if (value === NEW_TAG_OPTION) {
      setTagError("");
      if (atTagLimit) {
        setTagError(
          `You've hit the ${MAX_CUSTOM_TAGS} custom tag limit. Manage tags in Account.`
        );
        return;
      }
      setCreatingTag(true);
      return;
    }
    setTag(value);
  }

  async function handleCreateTag() {
    const trimmed = newTagName.trim();
    if (!trimmed) return;
    setTagError("");

    if (atTagLimit) {
      setTagError(
        `You've hit the ${MAX_CUSTOM_TAGS} custom tag limit. Manage tags in Account.`
      );
      return;
    }
    const exists =
      DEFAULT_TAGS.some((t) => t.name.toLowerCase() === trimmed.toLowerCase()) ||
      localCustomTags.some((t) => t.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      setTagError("That tag already exists.");
      return;
    }

    setSavingTag(true);
    const { error: insertError } = await supabase
      .from("pm_user_tags")
      .insert({ user_id: userId, name: trimmed });
    setSavingTag(false);

    if (insertError) {
      setTagError("Couldn't create that tag. Try again.");
      return;
    }

    setLocalCustomTags([...localCustomTags, trimmed]);
    setTag(trimmed);
    setNewTagName("");
    setCreatingTag(false);
  }

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
            {!creatingTag ? (
              <select
                value={tag}
                onChange={(e) => handleTagSelect(e.target.value)}
                style={{ ...inputStyle, appearance: "none" }}
              >
                <option value="">No tag</option>
                {DEFAULT_TAGS.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
                {localCustomTags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
                <option value={NEW_TAG_OPTION}>
                  + New tag… ({localCustomTags.length}/{MAX_CUSTOM_TAGS} used)
                </option>
              </select>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="New tag name"
                  maxLength={20}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCreateTag();
                    }
                  }}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleCreateTag}
                  disabled={savingTag}
                  style={{
                    backgroundColor: "var(--pm-green-mid)",
                    color: "var(--pm-white)",
                    border: "none",
                    borderRadius: 8,
                    padding: "0 14px",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: savingTag ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {savingTag ? "..." : "add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreatingTag(false);
                    setNewTagName("");
                    setTagError("");
                  }}
                  style={{
                    background: "none",
                    border: "0.5px solid var(--pm-gray-border)",
                    borderRadius: 8,
                    padding: "0 12px",
                    fontSize: 13,
                    color: "var(--pm-gray-text)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  cancel
                </button>
              </div>
            )}
            {tagError && (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--pm-red-mid)",
                  marginTop: 6,
                }}
              >
                {tagError}
              </p>
            )}
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
