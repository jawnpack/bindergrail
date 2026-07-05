import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@bindergrail/database";

export interface BudgetRow {
  id: string;
  budget_amount: number;
  currency: string;
}

export interface MonthlyBudgetRow {
  year: number;
  month: number;
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
  tags: string[];
  note: string | null;
  destination: "budget" | "grail_fund" | null;
  bucket_id: string | null;
}

export interface WalletBucketRow {
  id: string;
  name: string;
  amount: number;
}

export interface CustomTagRow {
  id: string;
  name: string;
}

export interface UserSettingsRow {
  cash_reserve: number;
}

export interface HoldRow {
  id: string;
  name: string;
  amount: number;
  due_date: string;
  tag: string | null;
  note: string | null;
  bucket_id: string | null;
}

export interface GrailItemRow {
  id: string;
  name: string;
  target_price: number | null;
}

export interface WishlistItemRow {
  id: string;
  name: string;
  target_price: number | null;
  note: string | null;
  url: string | null;
  tag: string | null;
  is_grail: boolean;
  status: "active" | "acquired";
}

export interface GrailFundRow {
  amount_saved: number;
}

export interface GrailFundEntry {
  wishlist_item_id: string;
  amount_saved: number;
}

export interface UserProfileRow {
  display_name: string | null;
  avatar_color: string | null;
  currency: string;
}

export async function getOrCreateMonthlyBudget(
  supabase: SupabaseClient<Database>,
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

  // New month: carry forward the most recent budget instead of starting at 0
  const { data: previous } = await supabase
    .from("pm_monthly_budgets")
    .select("budget_amount, currency")
    .eq("user_id", userId)
    .order("year", { ascending: false })
    .order("month", { ascending: false })
    .limit(1)
    .maybeSingle();

  const carried = previous as { budget_amount: number; currency: string } | null;

  const { data: newRow } = await supabase
    .from("pm_monthly_budgets")
    .insert({
      user_id: userId,
      year,
      month,
      budget_amount: carried?.budget_amount ?? 0,
      currency: carried?.currency ?? "USD",
    })
    .select("id, budget_amount, currency")
    .single();

  return (newRow as BudgetRow) ?? { id: "", budget_amount: 0, currency: "USD" };
}

export async function getAllBudgets(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<MonthlyBudgetRow[]> {
  const { data } = await supabase
    .from("pm_monthly_budgets")
    .select("year, month, budget_amount, currency")
    .eq("user_id", userId);

  return (data ?? []) as MonthlyBudgetRow[];
}

export async function getMonthTransactions(
  supabase: SupabaseClient<Database>,
  userId: string,
  year: number,
  month: number
): Promise<TransactionRow[]> {
  const monthStr = String(month).padStart(2, "0");
  const { data } = await supabase
    .from("pm_transactions")
    .select("id, type, name, amount, date, tag, tags, note, destination, bucket_id")
    .eq("user_id", userId)
    .gte("date", `${year}-${monthStr}-01`)
    .lt("date", month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, "0")}-01`)
    .order("date", { ascending: false });

  return (data ?? []) as TransactionRow[];
}

export async function getAllTransactions(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<TransactionRow[]> {
  const { data } = await supabase
    .from("pm_transactions")
    .select("id, type, name, amount, date, tag, tags, note, destination, bucket_id")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  return (data ?? []) as TransactionRow[];
}

export async function getPendingHolds(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<HoldRow[]> {
  const { data } = await supabase
    .from("pm_holds")
    .select("id, name, amount, due_date, tag, note, bucket_id")
    .eq("user_id", userId)
    .eq("status", "pending")
    .order("due_date", { ascending: true });

  return (data ?? []) as HoldRow[];
}

export async function getActiveGrail(
  supabase: SupabaseClient<Database>,
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

export async function getWishlistItems(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<WishlistItemRow[]> {
  const { data } = await supabase
    .from("pm_wishlist_items")
    .select("id, name, target_price, note, url, tag, is_grail, status")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data ?? []) as WishlistItemRow[];
}

export async function getGrailFunds(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<GrailFundEntry[]> {
  const { data } = await supabase
    .from("pm_grail_fund")
    .select("wishlist_item_id, amount_saved")
    .eq("user_id", userId);

  return (data ?? []) as GrailFundEntry[];
}

export async function getCustomTags(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<CustomTagRow[]> {
  const { data } = await supabase
    .from("pm_user_tags")
    .select("id, name")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  return (data ?? []) as CustomTagRow[];
}

export async function getWalletBuckets(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<WalletBucketRow[]> {
  const { data } = await supabase
    .from("pm_wallet_buckets")
    .select("id, name, amount")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  return (data ?? []) as WalletBucketRow[];
}

export async function getUserSettings(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<UserSettingsRow> {
  const { data } = await supabase
    .from("pm_user_settings")
    .select("cash_reserve")
    .eq("user_id", userId)
    .maybeSingle();

  return (data as UserSettingsRow) ?? { cash_reserve: 0 };
}

export async function getUserProfile(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<UserProfileRow> {
  const { data } = await supabase
    .from("users")
    .select("display_name, avatar_color, currency")
    .eq("id", userId)
    .maybeSingle();

  return (
    (data as UserProfileRow) ?? {
      display_name: null,
      avatar_color: null,
      currency: "USD",
    }
  );
}
