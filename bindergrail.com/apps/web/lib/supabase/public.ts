import { createClient } from "@supabase/supabase-js";

// Cookie-less anon client for PUBLIC reads (rows exposed by RLS public-select
// policies) on static/ISR pages. Reading cookies would force a page dynamic;
// this doesn't. Returns null when env isn't configured (e.g. local builds).
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
