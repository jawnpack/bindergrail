export type BudgetStatus = "healthy" | "warning" | "over";

export function getBudgetStatus(spent: number, budget: number): BudgetStatus {
  if (budget <= 0) return "healthy";
  if (spent > budget) return "over";
  if (spent >= budget * 0.75) return "warning";
  return "healthy";
}

export function getStatusCopy(status: BudgetStatus): string {
  if (status === "over") return "You blacked out. Let's heal up and try again.";
  if (status === "warning") return "Warning: low HP.";
  return "HP is looking healthy.";
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

export function getProgressColor(spent: number, budget: number): string {
  const status = getBudgetStatus(spent, budget);
  if (status === "over") return "#E24B4A";
  if (status === "warning") return "#EF9F27";
  return "#639922";
}

export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function calcMonthTotals(transactions: Array<{ type: string; amount: number }>) {
  let spent = 0;
  let inflow = 0;
  for (const t of transactions) {
    if (t.type === "spend") spent += Number(t.amount);
    else inflow += Number(t.amount);
  }
  return { spent, inflow };
}
