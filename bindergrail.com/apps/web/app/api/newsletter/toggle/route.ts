import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  subscribeToBeehiiv,
  unsubscribeFromBeehiiv,
  resubscribeToBeehiiv,
} from "@/lib/beehiiv";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subscribed } = await req.json();

  const { data: profile } = await supabase
    .from("users")
    .select("beehiiv_subscriber_id")
    .eq("id", user.id)
    .single();

  let beehiivId = profile?.beehiiv_subscriber_id ?? null;

  if (subscribed) {
    if (beehiivId) {
      await resubscribeToBeehiiv(beehiivId);
    } else {
      // Not linked yet — subscribe fresh and capture the new id
      beehiivId = (await subscribeToBeehiiv(user.email, "account")) ?? null;
    }
  } else if (beehiivId) {
    await unsubscribeFromBeehiiv(beehiivId);
  }

  await supabase
    .from("users")
    .update({
      beehiiv_subscriber_id: beehiivId,
      newsletter_subscribed: subscribed,
    })
    .eq("id", user.id);

  return NextResponse.json({ success: true, subscribed });
}
