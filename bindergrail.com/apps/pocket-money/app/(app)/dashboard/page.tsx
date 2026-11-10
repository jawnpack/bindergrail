import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import {
  getUserProfile,
  getOrCreateMonthlyBudget,
  getAllBudgets,
  getAllTransactions,
  getPendingHolds,
  getActiveGrail,
  getCustomTags,
  getUserSettings,
  getWishlistItems,
  getGrailFunds,
  getWalletBuckets,
} from "@/lib/pocket-money/queries";
import {
  activeFunds,
  computeWallet,
  reservedByItem,
} from "@/lib/pocket-money/wallet";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const now = new Date();
  const initialYear = now.getFullYear();
  const initialMonth = now.getMonth() + 1;

  // One parallel round trip. The current-month budget row is ensured (carrying
  // forward last month's amount) alongside the history fetch; if it was just
  // created, it won't be in the history yet, so it's merged in below.
  const [
    currentBudget,
    profile,
    budgetHistory,
    allTransactions,
    holds,
    grail,
    customTags,
    settings,
    wishlistItems,
    grailFunds,
    walletBuckets,
  ] = await Promise.all([
    getOrCreateMonthlyBudget(supabase, user.id, initialYear, initialMonth),
    getUserProfile(supabase, user.id),
    getAllBudgets(supabase, user.id),
    getAllTransactions(supabase, user.id),
    getPendingHolds(supabase, user.id),
    getActiveGrail(supabase, user.id),
    getCustomTags(supabase, user.id),
    getUserSettings(supabase, user.id),
    getWishlistItems(supabase, user.id),
    getGrailFunds(supabase, user.id),
    getWalletBuckets(supabase, user.id),
  ]);

  const allBudgets = budgetHistory.some(
    (b) => b.year === initialYear && b.month === initialMonth
  )
    ? budgetHistory
    : [
        ...budgetHistory,
        {
          year: initialYear,
          month: initialMonth,
          budget_amount: currentBudget.budget_amount,
          currency: currentBudget.currency,
        },
      ];

  // Money committed to grails already caught has been SPENT — scope the
  // reserve to items still active so it can't linger in the wallet.
  const activeItemIds = wishlistItems
    .filter((i) => i.status === "active")
    .map((i) => i.id);
  const heldFunds = activeFunds(grailFunds, activeItemIds);
  const wallet = computeWallet(settings.cash_reserve, walletBuckets, heldFunds);
  const savedByItem = reservedByItem(heldFunds);

  return (
    <DashboardClient
      userId={user.id}
      displayName={profile.display_name}
      avatarColor={profile.avatar_color}
      currency={currentBudget.currency}
      allBudgets={allBudgets}
      wishlistItems={wishlistItems
        .filter((i) => i.status === "active")
        .map((i) => ({ id: i.id, name: i.name, isGrail: i.is_grail }))}
      customTags={customTags.map((t) => t.name)}
      wallet={wallet}
      buckets={walletBuckets}
      allTransactions={allTransactions}
      holds={holds}
      grailItem={
        grail
          ? {
              id: grail.id,
              name: grail.name,
              targetPrice: grail.target_price,
              // same source as the wallet's reserved figure
              amountSaved: savedByItem[grail.id] ?? 0,
            }
          : null
      }
      initialYear={initialYear}
      initialMonth={initialMonth}
    />
  );
}
