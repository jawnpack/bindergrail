import { createServerClient } from "@/lib/supabase/server";
import {
  getUserProfile,
  getOrCreateMonthlyBudget,
  getCustomTags,
} from "@/lib/pocket-money/queries";
import AccountClient from "./AccountClient";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const [profile, budget, customTags] = await Promise.all([
    getUserProfile(supabase, user.id),
    getOrCreateMonthlyBudget(supabase, user.id, year, month),
    getCustomTags(supabase, user.id),
  ]);

  return (
    <AccountClient
      userId={user.id}
      email={user.email ?? ""}
      displayName={profile.display_name}
      currency={budget.currency}
      currentBudget={budget.budget_amount}
      currentYear={year}
      currentMonth={month}
      customTags={customTags}
    />
  );
}
