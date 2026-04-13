import { NextResponse } from "next/server";
import { subscribeToBeehiiv } from "@/lib/beehiiv";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, tag = "free" } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // If Beehiiv isn't configured yet, succeed silently
    if (!process.env.BEEHIIV_API_KEY || !process.env.BEEHIIV_PUBLICATION_ID) {
      console.warn("Beehiiv not configured — skipping subscription");
      return NextResponse.json({ success: true });
    }

    await subscribeToBeehiiv(email, tag);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
