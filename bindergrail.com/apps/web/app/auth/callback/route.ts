import { createClient } from "@/lib/supabase/server";
import { getBeehiivSubscription } from "@/lib/beehiiv";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Reconcile the Beehiiv newsletter link by email on every login/signup.
      // The handle_new_user trigger has already created the users row.
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        try {
          const sub = await getBeehiivSubscription(user.email);
          await supabase
            .from("users")
            .update({
              beehiiv_subscriber_id: sub?.id ?? null,
              newsletter_subscribed: sub?.active ?? false,
            })
            .eq("id", user.id);
        } catch {
          // Best-effort: never block login on a Beehiiv/DB hiccup.
        }
      }
      return NextResponse.redirect(`${origin}/account`);
    }
  }

  // On error, redirect to login
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
