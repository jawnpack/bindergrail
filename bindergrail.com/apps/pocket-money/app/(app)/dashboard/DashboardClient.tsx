"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Topbar from "@/components/layout/Topbar";
import BudgetHeader from "@/components/dashboard/BudgetHeader";
import GrailStrip from "@/components/dashboard/GrailStrip";
import HoldsSection from "@/components/dashboard/HoldsSection";
import TransactionLog from "@/components/dashboard/TransactionLog";
import AddTransactionForm from "@/components/forms/AddTransactionForm";
import EditTransactionForm from "@/components/forms/EditTransactionForm";
import EditBudgetForm from "@/components/forms/EditBudgetForm";
import EditWalletForm from "@/components/forms/EditWalletForm";
import ManageBucketsForm from "@/components/forms/ManageBucketsForm";
import Toast from "@/components/forms/Toast";
import {
  calcMonthTotals,
  getBudgetStatus,
  getStatusCopy,
  getRemaining,
  getProgressPercent,
  getProgressColor,
  formatCurrency,
} from "@/lib/pocket-money/budget";

interface Transaction {
  id: string;
  type: "spend" | "return" | "sale";
  name: string;
  amount: number;
  date: string;
  tag: string | null;
  tags: string[];
  note: string | null;
  destination: "budget" | "grail_fund" | null;
  bucket_id: string | null;
}

interface WalletBucket {
  id: string;
  name: string;
  amount: number;
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

interface WishlistPickerItem {
  id: string;
  name: string;
  isGrail: boolean;
}

interface MonthlyBudget {
  year: number;
  month: number;
  budget_amount: number;
  currency: string;
}

interface DashboardClientProps {
  userId: string;
  displayName: string | null;
  avatarColor: string | null;
  currency: string;
  allBudgets: MonthlyBudget[];
  allTransactions: Transaction[];
  holds: Hold[];
  grailItem: GrailItem | null;
  wishlistItems: WishlistPickerItem[];
  customTags: string[];
  walletAmount: number;
  buckets: WalletBucket[];
  reservedTotal: number;
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
  avatarColor,
  currency,
  allBudgets,
  allTransactions,
  holds,
  grailItem,
  wishlistItems,
  customTags,
  walletAmount,
  buckets,
  reservedTotal,
  initialYear,
  initialMonth,
}: DashboardClientProps) {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [showAddTx, setShowAddTx] = useState(false);
  const [showEditBudget, setShowEditBudget] = useState(false);
  const [showEditWallet, setShowEditWallet] = useState(false);
  const [showBuckets, setShowBuckets] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
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

  const budget =
    allBudgets.find(
      (b) => b.year === selectedYear && b.month === selectedMonth
    )?.budget_amount ?? 0;

  const bucketsTotal = buckets.reduce((sum, b) => sum + Number(b.amount), 0);
  const bucketNames = Object.fromEntries(buckets.map((b) => [b.id, b.name]));

  const { spent, inflow } = calcMonthTotals(monthTxs);
  const remaining = getRemaining(budget, spent, inflow);
  const percent = getProgressPercent(spent, budget);
  const status = getBudgetStatus(spent, budget);
  const statusCopy = getStatusCopy(status);
  const statusColor =
    status === "over"
      ? "var(--pm-red-dark)"
      : status === "warning"
      ? "var(--pm-amber-dark)"
      : "var(--pm-green-dark)";
  const progressColor = getProgressColor(spent, budget);
  const monthLabel = getMonthLabel(selectedYear, selectedMonth);

  function handleTxSuccess(name: string, type: string, destination?: string) {
    setShowAddTx(false);
    if (type === "sale" && destination === "grail_fund") {
      setToast("Sale logged. Funds reserved for your wishlist item.");
    } else if (type === "sale") {
      setToast("Sale logged. Funds added to your wallet.");
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
          <Topbar
            displayName={displayName}
            avatarColor={avatarColor}
            active="dashboard"
          />

          <BudgetHeader
            monthLabel={monthLabel}
            remaining={remaining}
            spent={spent}
            budget={budget}
            currency={currency}
            statusCopy={statusCopy}
            statusColor={statusColor}
            percent={percent}
            progressColor={progressColor}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            canGoForward={canGoForward}
            onEditBudget={() => setShowEditBudget(true)}
          />

          {/* Wallet */}
          <div
            style={{
              padding: "10px 20px",
              backgroundColor: "var(--pm-white)",
              borderBottom: "0.5px solid var(--pm-gray-border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    color: "var(--pm-gray-text)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 1,
                  }}
                >
                  Wallet
                </p>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "var(--pm-ink)",
                  }}
                >
                  {formatCurrency(
                    walletAmount + bucketsTotal + reservedTotal,
                    currency
                  )}
                </p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => setShowBuckets(true)}
                  style={{
                    border: "0.5px solid var(--pm-gray-border)",
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontSize: 11,
                    backgroundColor: "var(--pm-white)",
                    color: "var(--pm-gray-text)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  buckets
                </button>
                <button
                  onClick={() => setShowEditWallet(true)}
                  style={{
                    border: "0.5px solid var(--pm-gray-border)",
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontSize: 11,
                    backgroundColor: "var(--pm-white)",
                    color: "var(--pm-gray-text)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  edit
                </button>
              </div>
            </div>

            {/* Buckets */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 4,
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: 11, color: "var(--pm-gray-text)" }}>
                pocket{" "}
                <span style={{ fontWeight: 500, color: "var(--pm-green-dark)" }}>
                  {formatCurrency(walletAmount, currency)}
                </span>
              </span>
              {buckets.map((b) => (
                <span
                  key={b.id}
                  style={{ fontSize: 11, color: "var(--pm-gray-text)" }}
                >
                  {b.name.toLowerCase()}{" "}
                  <span style={{ fontWeight: 500, color: "var(--pm-ink)" }}>
                    {formatCurrency(Number(b.amount), currency)}
                  </span>
                </span>
              ))}
              {reservedTotal > 0 && (
                <Link
                  href="/wishlist"
                  style={{
                    fontSize: 11,
                    color: "var(--pm-gray-text)",
                    textDecoration: "none",
                  }}
                >
                  reserved{" "}
                  <span style={{ fontWeight: 500, color: "var(--pm-amber-dark)" }}>
                    {formatCurrency(reservedTotal, currency)}
                  </span>
                </Link>
              )}
            </div>
          </div>

          {grailItem && (
            <Link
              href="/wishlist"
              style={{ display: "block", textDecoration: "none" }}
            >
              <GrailStrip
                name={grailItem.name}
                targetPrice={grailItem.targetPrice}
                amountSaved={grailItem.amountSaved}
                currency={currency}
              />
            </Link>
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
          <TransactionLog
            transactions={allTransactions}
            currency={currency}
            bucketNames={bucketNames}
            onEdit={(tx) => setEditingTx(tx as Transaction)}
          />
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
          wishlistItems={wishlistItems}
          buckets={buckets}
          customTags={customTags}
          onClose={() => setShowAddTx(false)}
          onSuccess={handleTxSuccess}
        />
      )}

      {editingTx && (
        <EditTransactionForm
          transaction={editingTx}
          buckets={buckets}
          customTags={customTags}
          onClose={() => setEditingTx(null)}
          onSuccess={(message) => {
            setEditingTx(null);
            setToast(message);
          }}
        />
      )}

      {showBuckets && (
        <ManageBucketsForm
          userId={userId}
          pocketAmount={walletAmount}
          buckets={buckets}
          currency={currency}
          onClose={() => setShowBuckets(false)}
          onChanged={(message) => {
            setToast(message);
            router.refresh();
          }}
        />
      )}

      {showEditWallet && (
        <EditWalletForm
          userId={userId}
          currentAmount={walletAmount}
          onClose={() => setShowEditWallet(false)}
          onSuccess={() => {
            setShowEditWallet(false);
            setToast("Wallet updated.");
            router.refresh();
          }}
        />
      )}

      {showEditBudget && (
        <EditBudgetForm
          userId={userId}
          year={selectedYear}
          month={selectedMonth}
          monthLabel={monthLabel}
          currentAmount={budget}
          currency={currency}
          onClose={() => setShowEditBudget(false)}
          onSuccess={() => {
            setShowEditBudget(false);
            setToast("Budget updated.");
            router.refresh();
          }}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
