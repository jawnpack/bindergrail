"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import AddHoldForm from "@/components/forms/AddHoldForm";

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

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
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
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <p
          style={{ fontSize: 13, fontWeight: 500, color: "var(--pm-gray-text)" }}
        >
          Holds
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowForm(true)}
          style={{ fontSize: 13, padding: "4px 8px" }}
        >
          + Add hold
        </Button>
      </div>

      {holds.length === 0 ? (
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: "14px 16px",
            border: "1px solid var(--pm-gray-border)",
          }}
        >
          <p
            style={{
              fontSize: 14,
              color: "var(--pm-gray-text)",
              fontStyle: "italic",
            }}
          >
            No tall grass ahead.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {holds.map((hold) => (
            <div
              key={hold.id}
              style={{
                backgroundColor: "var(--pm-amber-light)",
                border: "1px solid var(--pm-amber-mid)",
                borderRadius: 12,
                padding: "12px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--pm-ink)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {hold.name}
                </p>
                <p style={{ fontSize: 12, color: "var(--pm-amber-dark)", marginTop: 2 }}>
                  {formatCurrency(hold.amount, currency)} · due {formatDate(hold.due_date)}
                  {hold.tag && ` · ${hold.tag}`}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                disabled={completing === hold.id}
                onClick={() => handleDone(hold)}
                style={{ flexShrink: 0, borderColor: "var(--pm-amber-mid)" }}
              >
                {completing === hold.id ? "..." : "Done"}
              </Button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <AddHoldForm
          userId={userId}
          currency={currency}
          onClose={() => setShowForm(false)}
          onSuccess={(name) => {
            setShowForm(false);
            onToast("Something's in the tall grass...");
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
