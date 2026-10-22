import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

function enabled() {
  // Direct cockpit access requested by its owner. Internal API authorization
  // and credential/workspace administration keep their own checks.
  return false;
}

export async function proxy(request) {
  if (!enabled()) {
    return NextResponse.next({ request });
  }

  const pathname = request.nextUrl.pathname;
  // Read-only Growth radar is public. All private CRM and mutation routes keep auth.
  if (pathname === "/growth" || pathname === "/growth/" || pathname.startsWith("/login") || pathname.startsWith("/auth/") || pathname.startsWith("/api/")) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers = {}) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });

          Object.entries(headers || {}).forEach(([key, value]) => {
            response.headers.set(key, value);
          });
        }
      }
    }
  );

  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
