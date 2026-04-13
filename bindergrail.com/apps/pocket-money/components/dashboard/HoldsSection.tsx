"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AddHoldForm from "@/components/forms/AddHoldForm";
import { formatCurrency } from "@/lib/pocket-money/budget";

interface Hold {
  id: string;
  name: string;
  amount: number;
  due_date: string;
  tag: string | null;
  note: string | null;
}

interface HoldsSectionProps {
  holds: Hold[];
  currency: string;
  userId: string;
  onToast: (msg: string) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function HoldsSection({
  holds,
  currency,
  userId,
  onToast,
}: HoldsSectionProps) {
  const router = useRouter();
  const supabase = createClient();
  const [showForm, setShowForm] = useState(false);
  const [completing, setCompleting] = useState<string | null>(null);

  async function handleDone(hold: Hold) {
    setCompleting(hold.id);
    const today = new Date().toISOString().split("T")[0];

    await supabase
      .from("pm_holds")
      .update({ status: "done" })
      .eq("id", hold.id);

    await supabase.from("pm_transactions").insert({
      user_id: userId,
      type: "spend",
      name: hold.name,
      amount: hold.amount,
      date: today,
      tag: hold.tag,
      note: hold.note,
      destination: null,
    });

    setCompleting(null);
    onToast(`Got ${hold.name}! It was added to your Bag.`);
    router.refresh();
  }

  return (
    <div
      style={{
        padding: "14px 20px",
        borderBottom: "0.5px solid var(--pm-gray-border)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: holds.length > 0 ? 10 : 0,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "var(--pm-gray-text)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Holds
        </span>
        <button
          onClick={() => setShowForm(true)}
          style={{
            backgroundColor: "var(--pm-green-mid)",
            color: "var(--pm-white)",
            border: "none",
            borderRadius: 20,
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          + add hold
        </button>
      </div>

      {/* Hold rows */}
      {holds.length === 0 ? (
        <p
          style={{
            fontSize: 13,
            color: "var(--pm-gray-text)",
            fontStyle: "italic",
            marginTop: 10,
          }}
        >
          No tall grass ahead.
        </p>
      ) : (
        <div>
          {holds.map((hold, i) => (
            <div
              key={hold.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 11,
                paddingBottom: 11,
                borderBottom:
                  i < holds.length - 1
                    ? "0.5px solid var(--pm-gray-border)"
                    : undefined,
                gap: 12,
              }}
            >
              {/* Left: dot + name + date */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    backgroundColor: "var(--pm-amber-mid)",
                    flexShrink: 0,
                    marginTop: 4,
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--pm-ink)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {hold.name}
                  </p>
                  <p style={{ fontSize: 10, color: "var(--pm-gray-text)", marginTop: 1 }}>
                    {formatDate(hold.due_date)}
                  </p>
                </div>
              </div>

              {/* Right: amount + done button */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--pm-amber-dark)",
                  }}
                >
                  {formatCurrency(hold.amount, currency)}
                </span>
                <button
                  disabled={completing === hold.id}
                  onClick={() => handleDone(hold)}
                  style={{
                    border: "0.5px solid var(--pm-gray-border)",
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 400,
                    backgroundColor: "var(--pm-white)",
                    color: "var(--pm-gray-text)",
                    cursor: completing === hold.id ? "not-allowed" : "pointer",
                    opacity: completing === hold.id ? 0.5 : 1,
                  }}
                >
                  {completing === hold.id ? "..." : "done"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <AddHoldForm
          userId={userId}
          currency={currency}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            onToast("Something's in the tall grass...");
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
