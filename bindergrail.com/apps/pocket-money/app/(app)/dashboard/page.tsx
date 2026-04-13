import { createServerClient } from "@/lib/supabase/server";
import {
  getUserProfile,
  getOrCreateMonthlyBudget,
  getAllTransactions,
  getPendingHolds,
  getActiveGrail,
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

  const [profile, budget, allTransactions, holds, grail] = await Promise.all([
    getUserProfile(supabase, user.id),
    getOrCreateMonthlyBudget(supabase, user.id, initialYear, initialMonth),
    getAllTransactions(supabase, user.id),
    getPendingHolds(supabase, user.id),
    getActiveGrail(supabase, user.id),
  ]);

  return (
    <DashboardClient
      userId={user.id}
      displayName={profile.display_name}
      currency={budget.currency}
      budget={budget.budget_amount}
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
