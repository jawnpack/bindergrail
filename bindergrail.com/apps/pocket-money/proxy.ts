import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Scope auth cookies to .bindergrail.com in production, matching the browser
// and server clients. If the proxy wrote host-only cookies instead, token
// rotation could leave two same-named cookies at different scopes and the
// server could read the stale one — a Safari-specific login loop.
const cookieDomain =
  process.env.NODE_ENV === "production" ? ".bindergrail.com" : undefined;

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, { ...options, domain: cookieDomain })
          );
        },
      },
    }
  );

  // This is the single place that refreshes the session on a navigation.
  // getUser() both validates the token and, when the access token has expired,
  // rotates the refresh token — writing the new cookies onto `response` via
  // setAll above. Because the refresh token is one-time-use, we want as few
  // concurrent refreshes as possible (see the matcher below).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/wishlist") ||
    pathname.startsWith("/account");

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const redirect = NextResponse.redirect(url);
    // Carry any cookies refreshed above onto the redirect. A bare
    // NextResponse.redirect() drops them, so a refresh that happened to land on
    // this same request would be thrown away — stranding the session and
    // producing the login loop.
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  return response;
}

// Run ONLY on the protected routes, and skip prefetch requests. A single
// in-app navigation used to fire a burst of concurrent proxy runs (the
// document, its RSC payload, and every prefetched link), each attempting its
// own refresh and racing over the same one-time refresh token. Limiting the
// proxy to real navigations of protected pages means at most one refresh per
// navigation. The `:path*` patterns also match the bare route (e.g. /account).
export const config = {
  matcher: [
    {
      source: "/dashboard/:path*",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    {
      source: "/wishlist/:path*",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    {
      source: "/account/:path*",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
