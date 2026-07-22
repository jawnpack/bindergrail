import { createServerClient } from "@/lib/supabase/server";
import {
  getUserProfile,
  getWishlistItems,
  getCustomTags,
  getGrailFunds,
  getUserSettings,
} from "@/lib/pocket-money/queries";
import { activeFunds, reservedByItem } from "@/lib/pocket-money/wallet";
import WishlistClient from "./WishlistClient";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [profile, items, customTags, grailFunds, settings] = await Promise.all([
    getUserProfile(supabase, user.id),
    getWishlistItems(supabase, user.id),
    getCustomTags(supabase, user.id),
    getGrailFunds(supabase, user.id),
    getUserSettings(supabase, user.id),
  ]);

  // Funds against acquired items are money already spent — scope to active.
  const activeItemIds = items
    .filter((i) => i.status === "active")
    .map((i) => i.id);
  const reserved = reservedByItem(activeFunds(grailFunds, activeItemIds));

  const grail = items.find((i) => i.is_grail && i.status === "active") ?? null;

  return (
    <WishlistClient
      userId={user.id}
      displayName={profile.display_name}
      avatarColor={profile.avatar_color}
      currency={profile.currency}
      items={items}
      customTags={customTags.map((t) => t.name)}
      reservedByItem={reserved}
      availableCash={settings.cash_reserve}
      // same source as the wallet's reserved figure
      grailAmountSaved={grail ? reserved[grail.id] ?? 0 : 0}
    />
  );
}
