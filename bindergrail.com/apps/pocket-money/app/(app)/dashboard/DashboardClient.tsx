"use client";

import { useState, useMemo } from "react";
import Topbar from "@/components/layout/Topbar";
import BudgetHeader from "@/components/dashboard/BudgetHeader";
import GrailStrip from "@/components/dashboard/GrailStrip";
import HoldsSection from "@/components/dashboard/HoldsSection";
import TransactionLog from "@/components/dashboard/TransactionLog";
import AddTransactionForm from "@/components/forms/AddTransactionForm";
import AddHoldForm from "@/components/forms/AddHoldForm";
import Toast from "@/components/forms/Toast";
import {
  calcMonthTotals,
  getBudgetStatus,
  getStatusCopy,
  getRemaining,
  getProgressPercent,
  getProgressColor,
} from "@/lib/pocket-money/budget";

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
  displayName: string | null;
  currency: string;
  budget: number;
  allTransactions: Transaction[];
  holds: Hold[];
  grailItem: GrailItem | null;
  initialYear: number;
  initialMonth: number;
}

function getMonthLabel(year: number, month: number): string {
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function DashboardClient({
  userId,
  displayName,
  currency,
  budget,
  allTransactions,
  holds,
  grailItem,
  initialYear,
  initialMonth,
}: DashboardClientProps) {
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [showAddTx, setShowAddTx] = useState(false);
  const [showAddHold, setShowAddHold] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const now = new Date();
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;

  const canGoForward =
    selectedYear < nowYear ||
    (selectedYear === nowYear && selectedMonth < nowMonth);

  function prevMonth() {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (!canGoForward) return;
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  }

  const monthTxs = useMemo(() => {
    const prefix = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;
    return allTransactions.filter((tx) => tx.date.startsWith(prefix));
  }, [allTransactions, selectedYear, selectedMonth]);

  const { spent, inflow } = calcMonthTotals(monthTxs);
  const remaining = getRemaining(budget, spent, inflow);
  const percent = getProgressPercent(spent, budget);
  const status = getBudgetStatus(spent, budget);
  const statusCopy = getStatusCopy(status);
  const progressColor = getProgressColor(spent, budget);
  const monthLabel = getMonthLabel(selectedYear, selectedMonth);

  function handleTxSuccess(name: string, type: string, destination?: string) {
    setShowAddTx(false);
    if (type === "sale" && destination === "grail_fund") {
      setToast("Sale proceeds sent to your Grail Fund.");
    } else if (type === "sale") {
      setToast("Sale proceeds added to your Bag.");
    } else if (type === "return") {
      setToast("Return logged.");
    } else {
      setToast(`Got ${name}! Added to your Bag.`);
    }
  }

  const logButton = (
    <button
      onClick={() => setShowAddTx(true)}
      style={{
        width: "100%",
        backgroundColor: "var(--pm-green-mid)",
        color: "var(--pm-white)",
        border: "none",
        borderRadius: 10,
        padding: 13,
        fontSize: 14,
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      + log transaction
    </button>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--pm-gray-bg)",
      }}
    >
      {/* Two-column desktop layout */}
      <div
        className="md:flex md:max-w-[900px] md:mx-auto"
        style={{ minHeight: "100vh" }}
      >
        {/* Left column */}
        <div
          className="md:w-[400px] md:flex-shrink-0 md:flex md:flex-col md:border-r"
          style={{
            borderColor: "var(--pm-gray-border)",
            paddingBottom: 88,
          }}
        >
          <Topbar displayName={displayName} />

          <BudgetHeader
            monthLabel={monthLabel}
            remaining={remaining}
            spent={spent}
            budget={budget}
            currency={currency}
            statusCopy={statusCopy}
            percent={percent}
            progressColor={progressColor}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            canGoForward={canGoForward}
          />

          {grailItem && (
            <GrailStrip
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
            onToast={(msg) => setToast(msg)}
          />

          {/* Desktop log button */}
          <div
            className="hidden md:block"
            style={{ padding: "16px 20px", marginTop: "auto" }}
          >
            {logButton}
          </div>
        </div>

        {/* Right column — full transaction log */}
        <div className="md:flex-1" style={{ minWidth: 0 }}>
          <TransactionLog transactions={allTransactions} currency={currency} />
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 16px 20px",
          backgroundColor: "var(--pm-gray-bg)",
          borderTop: "0.5px solid var(--pm-gray-border)",
          zIndex: 10,
        }}
      >
        {logButton}
      </div>

      {/* Modals */}
      {showAddTx && (
        <AddTransactionForm
          userId={userId}
          currency={currency}
          grailItemId={grailItem?.id ?? null}
          onClose={() => setShowAddTx(false)}
          onSuccess={handleTxSuccess}
        />
      )}

      {showAddHold && (
        <AddHoldForm
          userId={userId}
          currency={currency}
          onClose={() => setShowAddHold(false)}
          onSuccess={() => {
            setShowAddHold(false);
            setToast("Something's in the tall grass...");
          }}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
