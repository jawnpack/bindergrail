import { createServerClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

interface BudgetRow {
  budget_amount: number;
  currency: string;
}

interface TransactionRow {
  id: string;
  type: "spend" | "return" | "sale";
  name: string;
  amount: number;
  date: string;
  tag: string | null;
  note: string | null;
}

interface HoldRow {
  id: string;
  name: string;
  amount: number;
  due_date: string;
  tag: string | null;
  note: string | null;
}

interface WishlistRow {
  id: string;
  name: string;
  target_price: number | null;
}

interface GrailFundRow {
  amount_saved: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cast<T>(val: any): T | null {
  return (val ?? null) as T | null;
}

export default async function DashboardPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const monthStr = String(month).padStart(2, "0");

  const [budgetRes, txRes, holdsRes, grailRes] = await Promise.all([
    supabase
      .from("pm_monthly_budgets")
      .select("budget_amount, currency")
      .eq("user_id", user.id)
      .eq("year", year)
      .eq("month", month)
      .maybeSingle(),

    supabase
      .from("pm_transactions")
      .select("id, type, name, amount, date, tag, note")
      .eq("user_id", user.id)
      .gte("date", `${year}-${monthStr}-01`)
      .order("date", { ascending: false }),

    supabase
      .from("pm_holds")
      .select("id, name, amount, due_date, tag, note")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .order("due_date", { ascending: true }),

    supabase
      .from("pm_wishlist_items")
      .select("id, name, target_price")
      .eq("user_id", user.id)
      .eq("is_grail", true)
      .eq("status", "active")
      .maybeSingle(),
  ]);

  const budgetRow = cast<BudgetRow>(budgetRes.data);
  const transactions = ((txRes.data ?? []) as unknown) as TransactionRow[];
  const holds = ((holdsRes.data ?? []) as unknown) as HoldRow[];
  const grailRow = cast<WishlistRow>(grailRes.data);

  let grailAmountSaved = 0;
  if (grailRow) {
    const { data: fundData } = await supabase
      .from("pm_grail_fund")
      .select("amount_saved")
      .eq("user_id", user.id)
      .eq("wishlist_item_id", grailRow.id)
      .maybeSingle();
    const fund = cast<GrailFundRow>(fundData);
    if (fund) grailAmountSaved = fund.amount_saved;
  }

  const currency = budgetRow?.currency ?? "USD";
  const budget = budgetRow?.budget_amount ?? 0;

  const spent = transactions
    .filter((t) => t.type === "spend")
    .reduce((sum, t) => sum + t.amount, 0);
  const inflow = transactions
    .filter((t) => t.type === "return" || t.type === "sale")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <DashboardClient
      userId={user.id}
      currency={currency}
      budget={budget}
      spent={spent}
      inflow={inflow}
      transactions={transactions}
      holds={holds}
      grailItem={
        grailRow
          ? {
              id: grailRow.id,
              name: grailRow.name,
              targetPrice: grailRow.target_price,
              amountSaved: grailAmountSaved,
            }
          : null
      }
    />
  );
}
