import type { SupabaseClient } from "@supabase/supabase-js";

export interface BudgetRow {
  id: string;
  budget_amount: number;
  currency: string;
}

export interface TransactionRow {
  id: string;
  type: "spend" | "return" | "sale";
  name: string;
  amount: number;
  date: string;
  tag: string | null;
  note: string | null;
}

export interface HoldRow {
  id: string;
  name: string;
  amount: number;
  due_date: string;
  tag: string | null;
  note: string | null;
}

export interface GrailItemRow {
  id: string;
  name: string;
  target_price: number | null;
}

export interface GrailFundRow {
  amount_saved: number;
}

export interface UserProfileRow {
  display_name: string | null;
  currency: string;
}

export async function getOrCreateMonthlyBudget(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  userId: string,
  year: number,
  month: number
): Promise<BudgetRow> {
  const { data } = await supabase
    .from("pm_monthly_budgets")
    .select("id, budget_amount, currency")
    .eq("user_id", userId)
    .eq("year", year)
    .eq("month", month)
    .maybeSingle();

  if (data) return data as BudgetRow;

  const { data: newRow } = await supabase
    .from("pm_monthly_budgets")
    .insert({
      user_id: userId,
      year,
      month,
      budget_amount: 0,
      currency: "USD",
    })
    .select("id, budget_amount, currency")
    .single();

  return (newRow as BudgetRow) ?? { id: "", budget_amount: 0, currency: "USD" };
}

export async function getMonthTransactions(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  userId: string,
  year: number,
  month: number
): Promise<TransactionRow[]> {
  const monthStr = String(month).padStart(2, "0");
  const { data } = await supabase
    .from("pm_transactions")
    .select("id, type, name, amount, date, tag, note")
    .eq("user_id", userId)
    .gte("date", `${year}-${monthStr}-01`)
    .lt("date", month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, "0")}-01`)
    .order("date", { ascending: false });

  return (data ?? []) as TransactionRow[];
}

export async function getAllTransactions(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  userId: string
): Promise<TransactionRow[]> {
  const { data } = await supabase
    .from("pm_transactions")
    .select("id, type, name, amount, date, tag, note")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  return (data ?? []) as TransactionRow[];
}

export async function getPendingHolds(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  userId: string
): Promise<HoldRow[]> {
  const { data } = await supabase
    .from("pm_holds")
    .select("id, name, amount, due_date, tag, note")
    .eq("user_id", userId)
    .eq("status", "pending")
    .order("due_date", { ascending: true });

  return (data ?? []) as HoldRow[];
}

export async function getActiveGrail(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  userId: string
): Promise<{ item: GrailItemRow; fund: GrailFundRow | null } | null> {
  const { data: item } = await supabase
    .from("pm_wishlist_items")
    .select("id, name, target_price")
    .eq("user_id", userId)
    .eq("is_grail", true)
    .eq("status", "active")
    .maybeSingle();

  if (!item) return null;

  const { data: fund } = await supabase
    .from("pm_grail_fund")
    .select("amount_saved")
    .eq("user_id", userId)
    .eq("wishlist_item_id", (item as GrailItemRow).id)
    .maybeSingle();

  return {
    item: item as GrailItemRow,
    fund: fund ? (fund as GrailFundRow) : null,
  };
}

export async function getUserProfile(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  userId: string
): Promise<UserProfileRow> {
  const { data } = await supabase
    .from("users")
    .select("display_name, currency")
    .eq("id", userId)
    .maybeSingle();

  return (data as UserProfileRow) ?? { display_name: null, currency: "USD" };
}
