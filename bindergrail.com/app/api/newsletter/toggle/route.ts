import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { unsubscribeFromBeehiiv, resubscribeToBeehiiv } from "@/lib/beehiiv";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subscribed } = await req.json();

  const { data: profile } = await supabase
    .from("users")
    .select("beehiiv_subscriber_id, newsletter_subscribed")
    .eq("id", user.id)
    .single();

  if (profile?.beehiiv_subscriber_id) {
    if (subscribed) {
      await resubscribeToBeehiiv(profile.beehiiv_subscriber_id);
    } else {
      await unsubscribeFromBeehiiv(profile.beehiiv_subscriber_id);
    }
  }

  await supabase
    .from("users")
    .update({ newsletter_subscribed: subscribed })
    .eq("id", user.id);

  return NextResponse.json({ success: true, subscribed });
}
