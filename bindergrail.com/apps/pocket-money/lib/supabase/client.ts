import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@bindergrail/database";
import { AUTH_COOKIE_NAME } from "./cookie-name";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Host-only cookie (no `domain`) with an app-specific name — see
      // cookie-name.ts for why the default name caused a login loop.
      cookieOptions: { name: AUTH_COOKIE_NAME },
    }
  );
}
