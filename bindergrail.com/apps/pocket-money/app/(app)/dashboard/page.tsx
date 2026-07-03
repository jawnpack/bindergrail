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
} from "@/lib/pocket-money/queries";
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

  const [profile, allBudgets, allTransactions, holds, grail, customTags, settings] =
    await Promise.all([
      getUserProfile(supabase, user.id),
      getAllBudgets(supabase, user.id),
      getAllTransactions(supabase, user.id),
      getPendingHolds(supabase, user.id),
      getActiveGrail(supabase, user.id),
      getCustomTags(supabase, user.id),
      getUserSettings(supabase, user.id),
    ]);

  return (
    <DashboardClient
      userId={user.id}
      displayName={profile.display_name}
      avatarColor={profile.avatar_color}
      currency={currentBudget.currency}
      allBudgets={allBudgets}
      customTags={customTags.map((t) => t.name)}
      walletAmount={settings.cash_reserve}
      allTransactions={allTransactions}
      holds={holds}
      grailItem={
        grail
          ? {
              id: grail.item.id,
              name: grail.item.name,
              targetPrice: grail.item.target_price,
              amountSaved: grail.fund ? grail.fund.amount_saved : 0,
            }
          : null
      }
      initialYear={initialYear}
      initialMonth={initialMonth}
    />
  );
}
