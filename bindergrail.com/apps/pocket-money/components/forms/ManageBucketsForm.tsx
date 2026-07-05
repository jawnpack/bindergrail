"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/pocket-money/budget";
import type { WalletBucketRow } from "@/lib/pocket-money/queries";

interface ManageBucketsFormProps {
  userId: string;
  pocketAmount: number;
  buckets: WalletBucketRow[];
  currency: string;
  onClose: () => void;
  onChanged: (message: string) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  border: "0.5px solid var(--pm-gray-border)",
  borderRadius: 8,
  fontSize: 13,
  color: "var(--pm-ink)",
  backgroundColor: "var(--pm-white)",
  outline: "none",
  fontFamily: "inherit",
};

const smallButtonStyle: React.CSSProperties = {
  border: "0.5px solid var(--pm-gray-border)",
  borderRadius: 6,
  padding: "4px 10px",
  fontSize: 11,
  backgroundColor: "var(--pm-white)",
  color: "var(--pm-gray-text)",
  cursor: "pointer",
  fontFamily: "inherit",
};

export default function ManageBucketsForm({
  userId,
  pocketAmount,
  buckets,
  currency,
  onClose,
  onChanged,
}: ManageBucketsFormProps) {
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [transfer, setTransfer] = useState<{
    bucketId: string;
    direction: "in" | "out";
  } | null>(null);
  const [transferAmount, setTransferAmount] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const supabase = createClient();

  async function setPocket(amount: number): Promise<boolean> {
    const { error: err } = await supabase
      .from("pm_user_settings")
      .upsert({ user_id: userId, cash_reserve: amount });
    return !err;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setError("");

    const seed = newAmount ? parseFloat(newAmount) : 0;
    if (seed < 0) return;
    if (seed > pocketAmount) {
      setError(
        `Not enough in your Pocket. ${formatCurrency(pocketAmount, currency)} available.`
      );
      return;
    }
    if (buckets.some((b) => b.name.toLowerCase() === name.toLowerCase())) {
      setError("A bucket with that name already exists.");
      return;
    }

    setBusy(true);
    const { error: insertError } = await supabase
      .from("pm_wallet_buckets")
      .insert({ user_id: userId, name, amount: seed });

    if (insertError) {
      setBusy(false);
      setError("Couldn't create that bucket. Try again.");
      return;
    }

    if (seed > 0) {
      const ok = await setPocket(pocketAmount - seed);
      if (!ok) {
        await supabase
          .from("pm_wallet_buckets")
          .delete()
          .eq("user_id", userId)
          .eq("name", name);
        setBusy(false);
        setError("Couldn't move the cash. Try again.");
        return;
      }
    }

    setBusy(false);
    setNewName("");
    setNewAmount("");
    onChanged(`Bucket "${name}" created.`);
  }

  async function handleTransfer(bucket: WalletBucketRow) {
    if (!transferAmount) return;
    setError("");
    const parsed = parseFloat(transferAmount);
    if (parsed <= 0) return;

    const direction = transfer?.direction ?? "in";

    if (direction === "in" && parsed > pocketAmount) {
      setError(
        `Not enough in your Pocket. ${formatCurrency(pocketAmount, currency)} available.`
      );
      return;
    }
    if (direction === "out" && parsed > Number(bucket.amount)) {
      setError(
        `That bucket only has ${formatCurrency(Number(bucket.amount), currency)}.`
      );
      return;
    }

    const bucketDelta = direction === "in" ? parsed : -parsed;

    setBusy(true);
    const { error: bucketError } = await supabase
      .from("pm_wallet_buckets")
      .update({ amount: Number(bucket.amount) + bucketDelta })
      .eq("id", bucket.id);

    if (bucketError) {
      setBusy(false);
      setError("Couldn't move the cash. Try again.");
      return;
    }

    const ok = await setPocket(pocketAmount - bucketDelta);
    if (!ok) {
      // Put the bucket back so nothing is lost
      await supabase
        .from("pm_wallet_buckets")
        .update({ amount: Number(bucket.amount) })
        .eq("id", bucket.id);
      setBusy(false);
      setError("Couldn't move the cash. Try again.");
      return;
    }

    setBusy(false);
    setTransfer(null);
    setTransferAmount("");
    onChanged(
      direction === "in"
        ? `${formatCurrency(parsed, currency)} moved into ${bucket.name}.`
        : `${formatCurrency(parsed, currency)} back in your Pocket.`
    );
  }

  async function handleDelete(bucket: WalletBucketRow) {
    if (
      !window.confirm(
        `Delete "${bucket.name}"? Its ${formatCurrency(Number(bucket.amount), currency)} goes back to your Pocket.`
      )
    ) {
      return;
    }
    setError("");
    setBusy(true);

    const ok = await setPocket(pocketAmount + Number(bucket.amount));
    if (!ok) {
      setBusy(false);
      setError("Couldn't move the cash back. Try again.");
      return;
    }

    const { error: deleteError } = await supabase
      .from("pm_wallet_buckets")
      .delete()
      .eq("id", bucket.id);

    if (deleteError) {
      await setPocket(pocketAmount);
      setBusy(false);
      setError("Couldn't delete that bucket. Try again.");
      return;
    }

    setBusy(false);
    onChanged(`Bucket "${bucket.name}" deleted.`);
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
            marginBottom: 6,
          }}
        >
          <p style={{ fontSize: 15, fontWeight: 500, color: "var(--pm-ink)" }}>
            Wallet buckets
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
        <p
          style={{
            fontSize: 11,
            color: "var(--pm-gray-text)",
            lineHeight: 1.5,
            marginBottom: 16,
          }}
        >
          Split your wallet into spending pots. Bucket spends don&apos;t count
          against your monthly budget.
        </p>

        {/* Pocket */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 12px",
            backgroundColor: "var(--pm-gray-bg)",
            borderRadius: 8,
            marginBottom: 10,
          }}
        >
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--pm-ink)" }}>
              Pocket
            </p>
            <p style={{ fontSize: 10, color: "var(--pm-gray-text)" }}>
              Unassigned cash
            </p>
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--pm-green-dark)" }}>
            {formatCurrency(pocketAmount, currency)}
          </span>
        </div>

        {/* Buckets */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {buckets.map((bucket) => (
            <div
              key={bucket.id}
              style={{
                border: "0.5px solid var(--pm-gray-border)",
                borderRadius: 8,
                padding: "10px 12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--pm-ink)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {bucket.name}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--pm-ink-light)" }}>
                    {formatCurrency(Number(bucket.amount), currency)}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    disabled={busy}
                    onClick={() => {
                      setTransfer({ bucketId: bucket.id, direction: "in" });
                      setTransferAmount("");
                      setError("");
                    }}
                    style={smallButtonStyle}
                  >
                    + add
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => {
                      setTransfer({ bucketId: bucket.id, direction: "out" });
                      setTransferAmount("");
                      setError("");
                    }}
                    style={smallButtonStyle}
                  >
                    – take
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => handleDelete(bucket)}
                    style={{ ...smallButtonStyle, padding: "4px 8px" }}
                    aria-label={`Delete ${bucket.name}`}
                  >
                    ×
                  </button>
                </div>
              </div>

              {transfer?.bucketId === bucket.id && (
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0.01"
                    step="0.01"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder={
                      transfer.direction === "in"
                        ? "Amount from Pocket"
                        : "Amount back to Pocket"
                    }
                    autoFocus
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    disabled={busy}
                    onClick={() => handleTransfer(bucket)}
                    style={{
                      backgroundColor: "var(--pm-green-mid)",
                      color: "var(--pm-white)",
                      border: "none",
                      borderRadius: 8,
                      padding: "0 14px",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: busy ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    move
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => setTransfer(null)}
                    style={smallButtonStyle}
                  >
                    cancel
                  </button>
                </div>
              )}
            </div>
          ))}

          {buckets.length === 0 && (
            <p
              style={{
                fontSize: 12,
                color: "var(--pm-gray-text)",
                fontStyle: "italic",
              }}
            >
              No buckets yet. Make one below.
            </p>
          )}
        </div>

        {/* Create */}
        <form
          onSubmit={handleCreate}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--pm-ink)" }}>
            New bucket
          </p>
          <div style={{ display: "flex", gap: 6 }}>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Sneaker fund"
              maxLength={24}
              required
              style={{ ...inputStyle, flex: 1.4 }}
            />
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="0.00"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              type="submit"
              disabled={busy}
              style={{
                backgroundColor: "var(--pm-green-mid)",
                color: "var(--pm-white)",
                border: "none",
                borderRadius: 8,
                padding: "0 14px",
                fontSize: 12,
                fontWeight: 500,
                cursor: busy ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              + add
            </button>
          </div>
          <p style={{ fontSize: 10, color: "var(--pm-gray-text)" }}>
            Starting amount comes out of your Pocket.
          </p>
        </form>

        {error && (
          <p style={{ fontSize: 12, color: "var(--pm-red-mid)", marginTop: 10 }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
