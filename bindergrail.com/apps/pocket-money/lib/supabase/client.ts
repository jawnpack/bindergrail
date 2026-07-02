import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@bindergrail/database";

// Match the server client: scope auth cookies to .bindergrail.com in
// production so one login covers every Binder Grail tool.
const cookieDomain =
  process.env.NODE_ENV === "production" ? ".bindergrail.com" : undefined;

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain: cookieDomain,
      },
    }
  );
}
