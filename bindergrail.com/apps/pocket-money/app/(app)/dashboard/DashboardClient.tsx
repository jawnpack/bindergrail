"use client";

import { useState, useEffect } from "react";
import BudgetHeader from "@/components/dashboard/BudgetHeader";
import GrailBanner from "@/components/dashboard/GrailBanner";
import HoldsSection from "@/components/dashboard/HoldsSection";
import TransactionLog from "@/components/dashboard/TransactionLog";
import AddTransactionForm from "@/components/forms/AddTransactionForm";
import Button from "@/components/ui/Button";

interface Transaction {
  id: string;
  type: "spend" | "return" | "sale";
  name: string;
  amount: number;
  date: string;
  tag: string | null;
  note: string | null;
}

interface Hold {
  id: string;
  name: string;
  amount: number;
  due_date: string;
  tag: string | null;
  note: string | null;
}

interface GrailItem {
  id: string;
  name: string;
  targetPrice: number | null;
  amountSaved: number;
}

interface DashboardClientProps {
  userId: string;
  currency: string;
  budget: number;
  spent: number;
  inflow: number;
  transactions: Transaction[];
  holds: Hold[];
  grailItem: GrailItem | null;
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 80,
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "var(--pm-ink)",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 500,
        zIndex: 100,
        whiteSpace: "nowrap",
        boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
        animation: "fadeInUp 0.2s ease",
      }}
    >
      {message}
    </div>
  );
}

export default function DashboardClient({
  userId,
  currency,
  budget,
  spent,
  inflow,
  transactions,
  holds,
  grailItem,
}: DashboardClientProps) {
  const [showAddTx, setShowAddTx] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
  }

  function handleTxSuccess(name: string, type: string) {
    setShowAddTx(false);
    if (type === "sale") {
      showToast("Funds added to your Bag.");
    } else {
      showToast(`Got ${name}! It was added to your Bag.`);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--pm-gray-bg)",
        paddingBottom: 88,
      }}
    >
      {/* Header bar */}
      <div
        style={{
          backgroundColor: "var(--pm-green-dark)",
          padding: "16px 20px 12px",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "rgba(255,255,255,0.6)",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            marginBottom: 2,
          }}
        >
          a Binder Grail tool
        </p>
        <p
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: "#fff",
          }}
        >
          Pocket Money
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 16px 0", maxWidth: 520, margin: "0 auto" }}>
        <BudgetHeader
          budget={budget}
          spent={spent}
          inflow={inflow}
          currency={currency}
        />

        {grailItem && (
          <GrailBanner
            name={grailItem.name}
            targetPrice={grailItem.targetPrice}
            amountSaved={grailItem.amountSaved}
            currency={currency}
          />
        )}

        <HoldsSection
          holds={holds}
          currency={currency}
          userId={userId}
          onToast={showToast}
        />

        <div style={{ marginBottom: 12 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--pm-gray-text)",
              marginBottom: 8,
            }}
          >
            This month
          </p>
          <TransactionLog transactions={transactions} currency={currency} />
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 16px 20px",
          backgroundColor: "var(--pm-gray-bg)",
          borderTop: "1px solid var(--pm-gray-border)",
        }}
      >
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <Button
            fullWidth
            size="lg"
            onClick={() => setShowAddTx(true)}
            style={{ fontSize: 15 }}
          >
            + Log transaction
          </Button>
        </div>
      </div>

      {/* Add transaction form */}
      {showAddTx && (
        <AddTransactionForm
          userId={userId}
          currency={currency}
          onClose={() => setShowAddTx(false)}
          onSuccess={handleTxSuccess}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
