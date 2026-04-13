"use client";

import type { BudgetStatus } from "@/lib/pocket-money/budget";

interface ProgressBarProps {
  percent: number; // 0–100
  status: BudgetStatus;
}

const trackColor = "var(--pm-gray-border)";
const fillColors: Record<BudgetStatus, string> = {
  healthy: "var(--pm-green-mid)",
  warning: "var(--pm-amber-mid)",
  over: "var(--pm-red-mid)",
};

export default function ProgressBar({ percent, status }: ProgressBarProps) {
  return (
    <div
      style={{
        width: "100%",
        height: 8,
        backgroundColor: trackColor,
        borderRadius: 99,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${percent}%`,
          backgroundColor: fillColors[status],
          borderRadius: 99,
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}
