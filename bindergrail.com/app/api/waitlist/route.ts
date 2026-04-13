import { NextResponse } from "next/server";
import { subscribeToBeehiiv } from "@/lib/beehiiv";

export async function POST(req: Request) {
  const { email, app } = await req.json();

  if (!email || !app) {
    return NextResponse.json({ error: "Email and app required" }, { status: 400 });
  }

  try {
    const tag = app === "origins" ? "origins_waitlist" : "pocket_money_waitlist";
    await subscribeToBeehiiv(email, tag);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
  }
}
