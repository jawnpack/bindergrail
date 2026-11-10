import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/supabase/cookie-name";

// The auth cookie may be chunked (pm-auth, pm-auth.0, pm-auth.1, ...).
function hasAuthCookie(request: NextRequest): boolean {
  return request.cookies
    .getAll()
    .some(
      (c) =>
        c.value &&
        (c.name === AUTH_COOKIE_NAME || c.name.startsWith(`${AUTH_COOKIE_NAME}.`))
    );
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Entry point: route on cookie presence alone — no Supabase round trip. A stale
  // cookie lands on /dashboard, where the check below sends it on to /login.
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = hasAuthCookie(request) ? "/dashboard" : "/login";
    return NextResponse.redirect(url);
  }

  // Protected route with no auth cookie at all: redirect without a network call.
  if (!hasAuthCookie(request)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Host-only cookie with an app-specific name, matching the browser and
      // server clients. See lib/supabase/cookie-name.ts.
      cookieOptions: { name: AUTH_COOKIE_NAME },
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
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // This is the single place that refreshes the session on a navigation.
  // getSession() reads the session from the cookie and only goes to the network
  // when the access token has expired, in which case it rotates the refresh
  // token and writes the new cookies onto `response` via setAll above. It is NOT
  // used for authorization: every protected page validates with getUser() where
  // it reads data (and RLS guards every query), redirecting to /login if invalid.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
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

// Run on the entry point and the protected routes only, and skip prefetch
// requests on the protected ones. A single in-app navigation used to fire a
// burst of concurrent proxy runs (the document, its RSC payload, and every
// prefetched link), each attempting its own refresh and racing over the same
// one-time refresh token. The `:path*` patterns also match the bare route.
export const config = {
  matcher: [
    "/",
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
