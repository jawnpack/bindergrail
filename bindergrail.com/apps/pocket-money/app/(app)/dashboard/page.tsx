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

  if (!user) return null;

  const now = new Date();
  const initialYear = now.getFullYear();
  const initialMonth = now.getMonth() + 1;

  // Ensure the current month has a budget row (carries forward the last
  // month's amount) before fetching the full history.
  const currentBudget = await getOrCreateMonthlyBudget(
    supabase,
    user.id,
    initialYear,
    initialMonth
  );

  const [
    profile,
    allBudgets,
    allTransactions,
    holds,
    grail,
    customTags,
    settings,
    wishlistItems,
    grailFunds,
    walletBuckets,
  ] = await Promise.all([
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
