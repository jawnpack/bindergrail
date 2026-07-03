"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Topbar from "@/components/layout/Topbar";
import Toast from "@/components/forms/Toast";
import { formatCurrency } from "@/lib/pocket-money/budget";
import { DEFAULT_TAGS } from "@/lib/pocket-money/tags";
import type { CustomTagRow } from "@/lib/pocket-money/queries";

const MAX_CUSTOM_TAGS = 10;

interface AccountClientProps {
  userId: string;
  email: string;
  displayName: string | null;
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

export default function AccountClient({
  userId,
  email,
  displayName,
  currency,
  currentBudget,
  currentYear,
  currentMonth,
  customTags,
}: AccountClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const [budgetInput, setBudgetInput] = useState(
    currentBudget > 0 ? String(currentBudget) : ""
  );
  const [applyToPast, setApplyToPast] = useState(false);
  const [savingBudget, setSavingBudget] = useState(false);

  const [newTag, setNewTag] = useState("");
  const [savingTag, setSavingTag] = useState(false);
  const [deletingTag, setDeletingTag] = useState<string | null>(null);

  const [toast, setToast] = useState<string | null>(null);

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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--pm-gray-bg)" }}>
      <div className="md:max-w-[600px] md:mx-auto" style={{ minHeight: "100vh" }}>
        <Topbar displayName={displayName} />

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
            <p style={{ fontSize: 14, fontWeight: 500, color: "var(--pm-ink)" }}>
              {displayName ?? "No display name"}
            </p>
            <p style={{ fontSize: 12, color: "var(--pm-gray-text)", marginTop: 2 }}>
              {email}
            </p>
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
        </div>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
