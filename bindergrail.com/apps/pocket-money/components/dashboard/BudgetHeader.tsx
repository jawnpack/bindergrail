"use client";

import ProgressBar from "@/components/ui/ProgressBar";
import {
  getBudgetStatus,
  getStatusCopy,
  getRemaining,
  getProgressPercent,
} from "@/lib/pocket-money/budget";

interface BudgetHeaderProps {
  budget: number;
  spent: number;
  inflow: number;
  currency: string;
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
}

export default function BudgetHeader({
  budget,
  spent,
  inflow,
  currency,
}: BudgetHeaderProps) {
  const remaining = getRemaining(budget, spent, inflow);
  const status = getBudgetStatus(spent, budget);
  const percent = getProgressPercent(spent, budget);
  const copy = getStatusCopy(status);

  const remainingColor =
    status === "over"
      ? "var(--pm-red-mid)"
      : status === "warning"
      ? "var(--pm-amber-dark)"
      : "var(--pm-green-dark)";

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: "20px 20px 16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        marginBottom: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div>
          <p style={{ fontSize: 12, color: "var(--pm-gray-text)", marginBottom: 2 }}>
            Remaining
          </p>
          <p
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: remainingColor,
              lineHeight: 1.1,
            }}
          >
            {remaining < 0 ? "-" : ""}
            {formatCurrency(remaining, currency)}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 12, color: "var(--pm-gray-text)", marginBottom: 2 }}>
            Spent
          </p>
          <p
            style={{
              fontSize: 20,
              fontWeight: 500,
              color: "var(--pm-red-mid)",
              lineHeight: 1.1,
            }}
          >
            {formatCurrency(spent, currency)}
          </p>
          {inflow > 0 && (
            <>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--pm-gray-text)",
                  marginBottom: 2,
                  marginTop: 6,
                }}
              >
                Back in
              </p>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: "var(--pm-green-mid)",
                }}
              >
                +{formatCurrency(inflow, currency)}
              </p>
            </>
          )}
        </div>
      </div>

      <ProgressBar percent={percent} status={status} />

      <p
        style={{
          fontSize: 12,
          color: "var(--pm-gray-text)",
          marginTop: 8,
          fontStyle: "italic",
        }}
      >
        {copy}
      </p>

      <p style={{ fontSize: 12, color: "var(--pm-gray-text)", marginTop: 4 }}>
        Budget: {formatCurrency(budget, currency)}
      </p>
    </div>
  );
}
