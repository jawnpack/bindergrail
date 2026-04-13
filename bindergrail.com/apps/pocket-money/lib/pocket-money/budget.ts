export type BudgetStatus = "healthy" | "warning" | "over";

export function getBudgetStatus(spent: number, budget: number): BudgetStatus {
  if (budget <= 0) return "healthy";
  if (spent > budget) return "over";
  if (spent >= budget * 0.75) return "warning";
  return "healthy";
}

export function getStatusCopy(status: BudgetStatus): string {
  switch (status) {
    case "healthy":
      return "HP is looking healthy.";
    case "warning":
      return "Warning: low HP.";
    case "over":
      return "You blacked out. Let's heal up and try again.";
  }
}

export function getRemaining(
  budget: number,
  spent: number,
  inflow: number
): number {
  return budget - spent + inflow;
}

export function getProgressPercent(spent: number, budget: number): number {
  if (budget <= 0) return 0;
  return Math.min((spent / budget) * 100, 100);
}
