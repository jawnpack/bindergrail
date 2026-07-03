import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { subscribeToBeehiiv } from "@/lib/beehiiv";
import { sendWaitlistConfirmation } from "@/lib/resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { email?: string; source?: string; optedIntoNewsletter?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const source = body.source ?? "origins";
  const optedIntoNewsletter = Boolean(body.optedIntoNewsletter);

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Every submission writes a waitlist row. This is the owned contact list;
  // Beehiiv is only touched on explicit opt-in below.
  const supabase = await createClient();
  const { error: insertError } = await supabase.from("waitlist").insert({
    email,
    source,
    opted_into_newsletter: optedIntoNewsletter,
  });

  let alreadyOnList = false;
  if (insertError) {
    // 23505 = unique violation: already on the list, treat as success
    if (insertError.code === "23505") {
      alreadyOnList = true;
    } else {
      console.error("Waitlist insert failed:", insertError);
      return NextResponse.json(
        { error: "Failed to join waitlist" },
        { status: 500 }
      );
    }
  }

  // Explicit opt-in only: push to Beehiiv with the source tag
  if (optedIntoNewsletter && !alreadyOnList) {
    try {
      await subscribeToBeehiiv(email, `${source}-waitlist`);
    } catch (err) {
      // Waitlist row is saved; newsletter subscription is best-effort
      console.error("Beehiiv subscribe failed:", err);
    }
  }

  // Confirmation via Resend, best-effort
  if (!alreadyOnList) {
    try {
      await sendWaitlistConfirmation(email);
    } catch (err) {
      console.error("Waitlist confirmation email failed:", err);
    }
  }

  return NextResponse.json({ success: true, alreadyOnList });
}
