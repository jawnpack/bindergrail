"use client";

import { formatCurrency } from "@/lib/pocket-money/budget";

interface BudgetHeaderProps {
  monthLabel: string;
  remaining: number;
  spent: number;
  budget: number;
  currency: string;
  statusCopy: string;
  percent: number;
  progressColor: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  canGoForward: boolean;
}

export default function BudgetHeader({
  monthLabel,
  remaining,
  spent,
  budget,
  currency,
  statusCopy,
  percent,
  progressColor,
  onPrevMonth,
  onNextMonth,
  canGoForward,
}: BudgetHeaderProps) {
  const remainingColor =
    remaining < 0
      ? "var(--pm-red-dark)"
      : remaining === 0
      ? "var(--pm-red-dark)"
      : "var(--pm-green-dark)";

  return (
    <div
      style={{
        backgroundColor: "var(--pm-gray-bg)",
        borderBottom: "0.5px solid var(--pm-gray-border)",
        padding: "14px 20px",
      }}
    >
      {/* Month nav row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span
          style={{ fontSize: 13, fontWeight: 500, color: "var(--pm-ink)" }}
        >
          {monthLabel}
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={onPrevMonth}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: "0.5px solid var(--pm-gray-border)",
              backgroundColor: "var(--pm-white)",
              color: "var(--pm-gray-text)",
              cursor: "pointer",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Previous month"
          >
            ‹
          </button>
          <button
            onClick={onNextMonth}
            disabled={!canGoForward}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: "0.5px solid var(--pm-gray-border)",
              backgroundColor: canGoForward ? "var(--pm-white)" : "transparent",
              color: canGoForward ? "var(--pm-gray-text)" : "var(--pm-gray-border)",
              cursor: canGoForward ? "pointer" : "default",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      {/* Two balance cards */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {/* Remaining card */}
        <div
          style={{
            flex: 1,
            backgroundColor: "var(--pm-white)",
            border: "0.5px solid var(--pm-gray-border)",
            borderRadius: 10,
            padding: "10px 12px",
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: "var(--pm-gray-text)",
              marginBottom: 3,
            }}
          >
            remaining
          </p>
          <p
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: remainingColor,
              lineHeight: 1.1,
              marginBottom: 4,
            }}
          >
            {formatCurrency(Math.abs(remaining), currency)}
          </p>
          <p
            style={{
              fontSize: 11,
              color: "var(--pm-green-dark)",
              fontStyle: "italic",
            }}
          >
            {statusCopy}
          </p>
        </div>

        {/* Spent card */}
        <div
          style={{
            flex: 1,
            backgroundColor: "var(--pm-white)",
            border: "0.5px solid var(--pm-gray-border)",
            borderRadius: 10,
            padding: "10px 12px",
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: "var(--pm-gray-text)",
              marginBottom: 3,
            }}
          >
            spent
          </p>
          <p
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: "var(--pm-red-dark)",
              lineHeight: 1.1,
            }}
          >
            {formatCurrency(spent, currency)}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: "100%",
          height: 5,
          backgroundColor: "var(--pm-gray-border)",
          borderRadius: 99,
          overflow: "hidden",
          marginBottom: 5,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            backgroundColor: progressColor,
            borderRadius: 99,
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Meta row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 11, color: "var(--pm-gray-text)" }}>
          {formatCurrency(spent, currency)} of {formatCurrency(budget, currency)} budget
        </span>
        <span style={{ fontSize: 11, color: "var(--pm-gray-text)" }}>
          {Math.round(percent)}% used
        </span>
      </div>
    </div>
  );
}
