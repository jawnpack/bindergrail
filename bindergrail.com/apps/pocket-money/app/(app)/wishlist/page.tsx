import { createServerClient } from "@/lib/supabase/server";
import {
  getUserProfile,
  getWishlistItems,
  getActiveGrail,
  getCustomTags,
} from "@/lib/pocket-money/queries";
import WishlistClient from "./WishlistClient";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [profile, items, grail, customTags] = await Promise.all([
    getUserProfile(supabase, user.id),
    getWishlistItems(supabase, user.id),
    getActiveGrail(supabase, user.id),
    getCustomTags(supabase, user.id),
  ]);

  return (
    <WishlistClient
      userId={user.id}
      displayName={profile.display_name}
      avatarColor={profile.avatar_color}
      currency={profile.currency}
      items={items}
      customTags={customTags.map((t) => t.name)}
      grailAmountSaved={grail?.fund?.amount_saved ?? 0}
    />
  );
}
