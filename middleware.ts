import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    const { data, error } = await supabase.rpc("check_user_step");
    if (
      user &&
      !error &&
      data !== 2 &&
      req.nextUrl.pathname !== "/onboarding" &&
      !req.nextUrl.pathname.includes("/api") &&
      !req.nextUrl.pathname.startsWith("/auth")
    ) {
      req.nextUrl.pathname = "/onboarding";
      return NextResponse.redirect(req.nextUrl);
    }
    if (user && req.nextUrl.pathname === "/login") {
      req.nextUrl.pathname = "";
      return NextResponse.redirect(req.nextUrl);
    }

    /*  NOTE : ADMIN ROUTES */
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!user) return NextResponse.error();
      const { data, error } = await supabase
        .from("User")
        .select("role")
        .eq("id", user.id)
        .single<{ role: string }>();
      if (error || !data || data.role.toLowerCase() != "admin")
        return NextResponse.error();
    }

    return res;
  } catch (e) {
    return NextResponse.next({ request: { headers: req.headers } });
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|auth/callback|auth/pw-callback).*)",
  ],
};
