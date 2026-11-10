import { redirect } from "next/navigation";

// proxy.ts routes "/" on cookie presence before this ever renders; this is only
// a static fallback so the route never does a Supabase round trip.
export default function RootPage() {
  redirect("/login");
}
