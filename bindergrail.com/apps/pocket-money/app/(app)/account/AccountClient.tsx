"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Topbar from "@/components/layout/Topbar";
import Toast from "@/components/forms/Toast";
import { formatCurrency } from "@/lib/pocket-money/budget";
import { DEFAULT_TAGS, MAX_CUSTOM_TAGS } from "@/lib/pocket-money/tags";
import { isNameAllowed } from "@/lib/pocket-money/profanity";
import { AVATAR_COLORS, DEFAULT_AVATAR_COLOR } from "@/lib/pocket-money/avatar";
import type { CustomTagRow } from "@/lib/pocket-money/queries";

interface AccountClientProps {
  userId: string;
  email: string;
  displayName: string | null;
  avatarColor: string | null;
  currency: string;
  currentBudget: number;
  currentYear: number;
  currentMonth: number;
  customTags: CustomTagRow[];
}

const sectionStyle: React.CSSProperties = {
  backgroundColor: "var(--pm-white)",
  border: "0.5px solid var(--pm-gray-border)",
  borderRadius: 10,
  padding: "16px 20px",
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: "var(--pm-gray-text)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 12,
};

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

// Quiet, footnote-weight action — used by the support section only.
const quietButtonStyle: React.CSSProperties = {
  border: "0.5px solid var(--pm-gray-border)",
  borderRadius: 8,
  padding: "7px 20px",
  fontSize: 13,
  fontWeight: 500,
  backgroundColor: "var(--pm-white)",
  color: "var(--pm-ink-light)",
  cursor: "pointer",
  fontFamily: "inherit",
  textDecoration: "none",
};

const SHARE_URL = "https://pocketmoney.bindergrail.com";

export default function AccountClient({
  userId,
  email,
  displayName,
  avatarColor,
  currency,
  currentBudget,
  currentYear,
  currentMonth,
  customTags,
}: AccountClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const [nameInput, setNameInput] = useState(displayName ?? "");
  const [selectedColor, setSelectedColor] = useState(
    avatarColor ?? DEFAULT_AVATAR_COLOR
  );
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [budgetInput, setBudgetInput] = useState(
    currentBudget > 0 ? String(currentBudget) : ""
  );
  const [applyToPast, setApplyToPast] = useState(false);
  const [savingBudget, setSavingBudget] = useState(false);

  const [newTag, setNewTag] = useState("");
  const [savingTag, setSavingTag] = useState(false);
  const [deletingTag, setDeletingTag] = useState<string | null>(null);

  const [toast, setToast] = useState<string | null>(null);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileError("");

    const check = isNameAllowed(nameInput);
    if (!check.ok) {
      setProfileError(check.reason ?? "That name won't work.");
      return;
    }

    setSavingProfile(true);
    const { error } = await supabase
      .from("users")
      .update({
        display_name: nameInput.trim(),
        avatar_color: selectedColor,
      })
      .eq("id", userId);
    setSavingProfile(false);

    if (error) {
      setProfileError("Couldn't save your profile. Try again.");
      return;
    }

    setToast("Profile updated.");
    router.refresh();
  }

  async function handleSaveBudget(e: React.FormEvent) {
    e.preventDefault();
    if (!budgetInput) return;
    setSavingBudget(true);

    const parsed = parseFloat(budgetInput);

    // Current month row exists (server page get-or-creates it). Future
    // months carry this forward automatically when they're first opened.
    const { error: updateError } = await supabase
      .from("pm_monthly_budgets")
      .update({ budget_amount: parsed })
      .eq("user_id", userId)
      .eq("year", currentYear)
      .eq("month", currentMonth);

    let pastError = null;
    if (!updateError && applyToPast) {
      const { error } = await supabase
        .from("pm_monthly_budgets")
        .update({ budget_amount: parsed })
        .eq("user_id", userId);
      pastError = error;
    }

    setSavingBudget(false);

    if (updateError || pastError) {
      setToast("Couldn't save the budget. Try again.");
      return;
    }

    setToast(
      applyToPast
        ? "Budget saved for all months."
        : "Budget saved. Applies this month and forward."
    );
    router.refresh();
  }

  async function handleAddTag(e: React.FormEvent) {
    e.preventDefault();
    const name = newTag.trim();
    if (!name) return;

    if (customTags.length >= MAX_CUSTOM_TAGS) {
      setToast(`Custom tags are limited to ${MAX_CUSTOM_TAGS}.`);
      return;
    }
    const exists =
      DEFAULT_TAGS.some((t) => t.name.toLowerCase() === name.toLowerCase()) ||
      customTags.some((t) => t.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      setToast("That tag already exists.");
      return;
    }

    setSavingTag(true);
    const { error } = await supabase
      .from("pm_user_tags")
      .insert({ user_id: userId, name });
    setSavingTag(false);

    if (error) {
      setToast("Couldn't add that tag. Try again.");
      return;
    }

    setNewTag("");
    setToast(`Tag "${name}" added.`);
    router.refresh();
  }

  async function handleDeleteTag(tag: CustomTagRow) {
    setDeletingTag(tag.id);
    const { error } = await supabase
      .from("pm_user_tags")
      .delete()
      .eq("id", tag.id);
    setDeletingTag(null);

    if (error) {
      setToast("Couldn't remove that tag. Try again.");
      return;
    }

    setToast(`Tag "${tag.name}" removed.`);
    router.refresh();
  }

  async function handleShare() {
    // Native share sheet where available (mobile); clipboard fallback.
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({ title: "Pocket Money", url: SHARE_URL });
      } catch {
        // user dismissed the sheet — nothing to do
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setToast("Link copied.");
    } catch {
      setToast("Couldn't copy — grab it from the address bar.");
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--pm-gray-bg)" }}>
      <div className="md:max-w-[600px] md:mx-auto" style={{ minHeight: "100vh" }}>
        <Topbar displayName={displayName} avatarColor={avatarColor} />

        <div
          style={{
            padding: "16px 20px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <p style={{ fontSize: 15, fontWeight: 500, color: "var(--pm-ink)" }}>
            Account
          </p>

          {/* Profile */}
          <div style={sectionStyle}>
            <p style={sectionLabelStyle}>Trainer</p>
            <form
              onSubmit={handleSaveProfile}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              {/* Avatar preview + name */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    backgroundColor: selectedColor,
                    color: "var(--pm-green-lightest)",
                    fontSize: 15,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    letterSpacing: "0.02em",
                  }}
                >
                  {(nameInput.trim() || "?")
                    .split(/\s+/)
                    .map((p, i, arr) =>
                      i === 0 || i === arr.length - 1 ? p[0] : ""
                    )
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Display name"
                    maxLength={30}
                    required
                    style={inputStyle}
                  />
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--pm-gray-text)",
                      marginTop: 4,
                    }}
                  >
                    {email}
                  </p>
                </div>
              </div>

              {/* Color swatches */}
              <div>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--pm-gray-text)",
                    marginBottom: 6,
                  }}
                >
                  Avatar color
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {AVATAR_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setSelectedColor(c.value)}
                      aria-label={`${c.name} avatar color`}
                      title={c.name}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        backgroundColor: c.value,
                        border:
                          selectedColor === c.value
                            ? "2px solid var(--pm-ink)"
                            : "2px solid var(--pm-white)",
                        outline: "0.5px solid var(--pm-gray-border)",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
              </div>

              {profileError && (
                <p style={{ fontSize: 12, color: "var(--pm-red-mid)" }}>
                  {profileError}
                </p>
              )}

              <button
                type="submit"
                disabled={savingProfile}
                style={{
                  backgroundColor: "var(--pm-green-mid)",
                  color: "var(--pm-white)",
                  border: "none",
                  borderRadius: 10,
                  padding: "11px 0",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: savingProfile ? "not-allowed" : "pointer",
                  opacity: savingProfile ? 0.6 : 1,
                  fontFamily: "inherit",
                }}
              >
                {savingProfile ? "Saving..." : "Save profile"}
              </button>
            </form>
          </div>

          {/* Monthly budget */}
          <div style={sectionStyle}>
            <p style={sectionLabelStyle}>Monthly budget</p>
            <p
              style={{
                fontSize: 12,
                color: "var(--pm-gray-text)",
                marginBottom: 12,
                lineHeight: 1.5,
              }}
            >
              Applies to this month and every month after. Current:{" "}
              {formatCurrency(currentBudget, currency)}.
            </p>
            <form
              onSubmit={handleSaveBudget}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="1"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="200"
                required
                style={inputStyle}
              />
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  fontSize: 12,
                  color: "var(--pm-gray-text)",
                  cursor: "pointer",
                  lineHeight: 1.5,
                }}
              >
                <input
                  type="checkbox"
                  checked={applyToPast}
                  onChange={(e) => setApplyToPast(e.target.checked)}
                  style={{
                    marginTop: 2,
                    cursor: "pointer",
                    accentColor: "var(--pm-green-mid)",
                  }}
                />
                <span>
                  Also apply this budget to past months. Rewrites your history,
                  so past months are measured against this number too.
                </span>
              </label>
              <button
                type="submit"
                disabled={savingBudget}
                style={{
                  backgroundColor: "var(--pm-green-mid)",
                  color: "var(--pm-white)",
                  border: "none",
                  borderRadius: 10,
                  padding: "11px 0",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: savingBudget ? "not-allowed" : "pointer",
                  opacity: savingBudget ? 0.6 : 1,
                  fontFamily: "inherit",
                }}
              >
                {savingBudget ? "Saving..." : "Save budget"}
              </button>
            </form>
          </div>

          {/* Custom tags */}
          <div style={sectionStyle}>
            <p style={sectionLabelStyle}>Custom tags</p>
            <p
              style={{
                fontSize: 12,
                color: "var(--pm-gray-text)",
                marginBottom: 12,
                lineHeight: 1.5,
              }}
            >
              Your own categories, next to the built-in ones. Up to{" "}
              {MAX_CUSTOM_TAGS} custom tags. {customTags.length}/
              {MAX_CUSTOM_TAGS} used.
            </p>

            {customTags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginBottom: 12,
                }}
              >
                {customTags.map((tag) => (
                  <span
                    key={tag.id}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 500,
                      backgroundColor: "var(--pm-gray-bg)",
                      color: "var(--pm-ink-light)",
                      border: "0.5px solid var(--pm-gray-border)",
                    }}
                  >
                    {tag.name}
                    <button
                      onClick={() => handleDeleteTag(tag)}
                      disabled={deletingTag === tag.id}
                      aria-label={`Remove tag ${tag.name}`}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--pm-gray-text)",
                        cursor: "pointer",
                        fontSize: 13,
                        lineHeight: 1,
                        padding: 0,
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <form onSubmit={handleAddTag} style={{ display: "flex", gap: 8 }}>
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="e.g. Grading"
                maxLength={20}
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                type="submit"
                disabled={savingTag || customTags.length >= MAX_CUSTOM_TAGS}
                style={{
                  backgroundColor:
                    customTags.length >= MAX_CUSTOM_TAGS
                      ? "var(--pm-gray-border)"
                      : "var(--pm-green-mid)",
                  color: "var(--pm-white)",
                  border: "none",
                  borderRadius: 10,
                  padding: "0 18px",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor:
                    savingTag || customTags.length >= MAX_CUSTOM_TAGS
                      ? "not-allowed"
                      : "pointer",
                  fontFamily: "inherit",
                }}
              >
                {savingTag ? "..." : "+ add"}
              </button>
            </form>
          </div>

          {/* Support — a quiet footnote, never an upsell. Everything is free. */}
          <div
            style={{
              marginTop: 8,
              paddingTop: 20,
              borderTop: "0.5px solid var(--pm-gray-border)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "var(--pm-gray-text)",
                lineHeight: 1.6,
                maxWidth: 320,
                margin: "0 auto 14px",
              }}
            >
              Pocket Money is free and always will be. If it&apos;s helped you,
              sharing it or chipping in anything at all means a lot.
            </p>
            <div
              style={{ display: "flex", gap: 8, justifyContent: "center" }}
            >
              <button
                type="button"
                onClick={handleShare}
                style={quietButtonStyle}
              >
                Share
              </button>
              <a
                href="https://www.paypal.com/ncp/payment/WJ56SJ8A8XFYE"
                target="_blank"
                rel="noopener noreferrer"
                style={quietButtonStyle}
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
