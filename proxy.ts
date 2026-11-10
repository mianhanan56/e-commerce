import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "@/lib/supabase/env";

// /shop?category=<slug> was the category URL until 2026-11-11. Those links (bookmarks, shared
// links, anything already indexed) now go permanently to /shop/<slug>, keeping the other
// filters. next.config redirects can't do this: they pass the old parameter through.
function legacyCategoryRedirect(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("category");
  if (slug === null) return null;
  const url = request.nextUrl.clone();
  url.searchParams.delete("category");
  if (slug) url.pathname = `/shop/${encodeURIComponent(slug)}`;
  return NextResponse.redirect(url, 308);
}

// Admin: refreshes the Supabase session cookie and turns signed-out visitors away early.
// The authoritative admin check is requireAdmin() in the portal layout and every action.
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/shop") {
    return legacyCategoryRedirect(request) ?? NextResponse.next();
  }

  let response = NextResponse.next({ request });
  if (!isSupabaseConfigured()) return response;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet, headers) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([k, v]) => response.headers.set(k, v));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const isLogin = request.nextUrl.pathname === "/admin/login";

  if (!data?.claims && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    // Only old category links: a plain /shop visit never runs the proxy.
    { source: "/shop", has: [{ type: "query", key: "category" }] },
  ],
};
