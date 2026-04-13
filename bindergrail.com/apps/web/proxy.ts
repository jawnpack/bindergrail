import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Only run auth logic if Supabase is configured
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
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

  // Refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const hostname = request.headers.get("host") ?? "";

  // Subdomain routing — rewrite subdomain requests to the correct path
  if (hostname.startsWith("origins.")) {
    const url = request.nextUrl.clone();
    url.pathname = "/origins";
    return NextResponse.rewrite(url);
  }
  if (hostname.startsWith("pocketmoney.")) {
    const url = request.nextUrl.clone();
    url.pathname = "/pocket-money";
    return NextResponse.rewrite(url);
  }

  // Protect /account and /newsletter/[id] — redirect to /login if not authenticated
  // Note: /newsletter index is public; only sub-routes (individual issues) are protected
  const isProtected =
    pathname.startsWith("/account") ||
    (pathname.startsWith("/newsletter/") && pathname !== "/newsletter/");

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
