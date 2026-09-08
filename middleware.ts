import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: { headers: req.headers } });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return req.cookies.getAll(); },
      setAll(c) { c.forEach(({ name, value, options }) => req.cookies.set(name, value, options)); res = NextResponse.next({ request: { headers: req.headers } }); c.forEach(({ name, value, options }) => res.cookies.set(name, value, options)); },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  const path = req.nextUrl.pathname;
  const isAuth = path === "/login" || path === "/register";
  const isApp = path.startsWith("/profil") || path.startsWith("/foto") || path.startsWith("/history") || path.startsWith("/stats") || path.startsWith("/dev");
  if (!user && isApp) return NextResponse.redirect(new URL("/login", req.url));
  if (user && isAuth) return NextResponse.redirect(new URL("/profil", req.url));
  return res;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
